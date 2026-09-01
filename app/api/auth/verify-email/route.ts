import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/security/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "client_verify_email";
    const limit = checkRateLimit(`verify_email_${ip}`, 10, 60000);
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: { code: "TOO_MANY_REQUESTS", message: "Too many attempts. Please wait a minute." } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Verification token is required." } },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        verifyToken: token,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_TOKEN", message: "Invalid or expired verification token." } },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyToken: null,
        verifyTokenExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email address verified successfully.",
    });
  } catch (error: unknown) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Verification failed. Please try again." } },
      { status: 500 }
    );
  }
}
