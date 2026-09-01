import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/security/rateLimit";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required to upload KYC documents." } },
        { status: 401 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || "partner_kyc";
    const limit = checkRateLimit(`partner_kyc_${user.id}_${ip}`, 5, 60000);
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: { code: "RATE_LIMITED", message: "Too many upload attempts. Please wait." } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { documentType = "GOVERNMENT_ID", title, fileUrl, fileSize } = body;

    if (!fileUrl || typeof fileUrl !== "string") {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Document file URL is required." } },
        { status: 400 }
      );
    }

    // Find or create PartnerProfile for user
    let partnerProfile = await prisma.partnerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!partnerProfile) {
      partnerProfile = await prisma.partnerProfile.create({
        data: {
          userId: user.id,
          type: "ARTIST",
          businessName: user.name,
          kycStatus: "PENDING",
        },
      });
    }

    // Create PartnerDocument record
    const document = await prisma.partnerDocument.create({
      data: {
        partnerProfileId: partnerProfile.id,
        documentType: documentType as any,
        title: title || documentType.replace(/_/g, " "),
        fileUrl: fileUrl,
        fileType: fileUrl.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
        fileSize: fileSize || null,
        isPrivate: true,
      },
    });

    // Update PartnerProfile status to BASIC_VERIFIED
    await prisma.partnerProfile.update({
      where: { id: partnerProfile.id },
      data: { kycStatus: "BASIC_VERIFIED" },
    });

    // Notify Admin
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "KYC Document Uploaded",
        message: `Your ${documentType.replace(/_/g, " ")} document has been securely submitted for verification.`,
        type: "KYC",
      },
    });

    return NextResponse.json({
      success: true,
      document,
      kycStatus: "BASIC_VERIFIED",
      message: "KYC document uploaded securely to vault.",
    });
  } catch (error: any) {
    console.error("API /api/partners/kyc Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to upload KYC document." } },
      { status: 500 }
    );
  }
}
