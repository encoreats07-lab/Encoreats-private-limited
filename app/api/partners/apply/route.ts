import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  artistApplicationSchema,
  venueApplicationSchema,
  hostApplicationSchema,
} from "@/lib/validation";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { sendTransactionalEmail } from "@/lib/email";
import { partnerApplicationReceivedTemplate } from "@/lib/email/templates/partnerApplicationReceived";
import { adminNotificationTemplate } from "@/lib/email/templates/adminNotification";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`partner_apply_${ip}`, 5, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "RATE_LIMITED", message: "Too many applications submitted. Please wait." },
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const type = (body.type || "ARTIST").toUpperCase();

    let validatedData: any = {};
    let applicantName = "";
    let applicantEmail = "";
    let applicantPhone = "";
    let applicantCity = "";
    let portfolioUrl: string | null = null;
    let fileUrls: string[] = [];

    // Parse according to partner type
    if (type === "ARTIST") {
      const result = artistApplicationSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: { code: "VALIDATION_ERROR", details: result.error.flatten().fieldErrors } },
          { status: 400 }
        );
      }
      if (result.data.honeypot) return NextResponse.json({ success: true }, { status: 200 });

      validatedData = result.data;
      applicantName = result.data.fullName;
      applicantEmail = result.data.email.toLowerCase().trim();
      applicantPhone = result.data.phone;
      applicantCity = result.data.city;
      portfolioUrl = result.data.portfolioUrl;
      fileUrls = result.data.fileUrls || [];
    } else if (type === "VENUE") {
      const result = venueApplicationSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: { code: "VALIDATION_ERROR", details: result.error.flatten().fieldErrors } },
          { status: 400 }
        );
      }
      if (result.data.honeypot) return NextResponse.json({ success: true }, { status: 200 });

      validatedData = result.data;
      applicantName = `${result.data.venueName} (${result.data.contactName})`;
      applicantEmail = result.data.email.toLowerCase().trim();
      applicantPhone = result.data.phone;
      applicantCity = result.data.city;
      portfolioUrl = result.data.websiteUrl;
      fileUrls = result.data.fileUrls || [];
    } else if (type === "HOST") {
      const result = hostApplicationSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: { code: "VALIDATION_ERROR", details: result.error.flatten().fieldErrors } },
          { status: 400 }
        );
      }
      if (result.data.honeypot) return NextResponse.json({ success: true }, { status: 200 });

      validatedData = result.data;
      applicantName = result.data.fullName;
      applicantEmail = result.data.email.toLowerCase().trim();
      applicantPhone = result.data.phone;
      applicantCity = result.data.city;
      portfolioUrl = result.data.websiteUrl || null;
      fileUrls = result.data.fileUrls || [];
    } else {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Invalid partner type specified" } },
        { status: 400 }
      );
    }

    // Store partner application in Prisma
    const application = await prisma.partnerApplication.create({
      data: {
        type: type as any,
        status: "PENDING",
        name: applicantName,
        email: applicantEmail,
        phone: applicantPhone,
        city: applicantCity,
        companyName: type === "VENUE" ? validatedData.venueName : null,
        website: portfolioUrl,
        instagram: validatedData.instagram || null,
        data: JSON.stringify(validatedData),
        portfolioUrl,
        fileUrls: JSON.stringify(fileUrls),
      },
    });

    // Send confirmation email to applicant
    const applicantHtml = partnerApplicationReceivedTemplate({
      name: applicantName,
      email: applicantEmail,
      partnerType: type,
      city: applicantCity,
      applicationId: application.id,
    });

    sendTransactionalEmail({
      to: applicantEmail,
      subject: `Encoreats Application Received — ${type} Atelier`,
      html: applicantHtml,
    }).catch((e) => console.error("Partner confirmation email error:", e));

    // Admin notification email
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const adminHtml = adminNotificationTemplate({
        title: `New Partner Application: ${applicantName} (${type})`,
        type: "PARTNER_APPLICATION",
        details: {
          ApplicationID: application.id,
          Type: type,
          Applicant: applicantName,
          Email: applicantEmail,
          Phone: applicantPhone,
          City: applicantCity,
          Portfolio: portfolioUrl || "None",
        },
      });

      sendTransactionalEmail({
        to: adminEmail,
        subject: `[Encoreats Admin] New ${type} Application: ${applicantName}`,
        html: adminHtml,
      }).catch((e) => console.error("Admin partner notification error:", e));
    }

    return NextResponse.json(
      {
        success: true,
        applicationId: application.id,
        message: "Application submitted successfully to Encoreats Curation Board.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API /api/partners/apply Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to process application." } },
      { status: 500 }
    );
  }
}
