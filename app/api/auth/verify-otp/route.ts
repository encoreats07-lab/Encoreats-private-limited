import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOTP, signToken, setSessionCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "client_verify_otp";
    const limit = checkRateLimit(`verify_otp_${ip}`, 10, 60000);
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: { code: "RATE_LIMITED", message: "Too many attempts. Please wait a minute." } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, otpCode, purpose = "EMAIL_VERIFICATION" } = body;

    if (!email || !otpCode || typeof otpCode !== "string") {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Email and 6-digit passcode are required." } },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user || !user.otpCode || !user.otpExpiry) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_OTP", message: "Invalid or expired passcode." } },
        { status: 400 }
      );
    }

    if (new Date() > user.otpExpiry) {
      return NextResponse.json(
        { success: false, error: { code: "EXPIRED_OTP", message: "Passcode has expired. Please request a new code." } },
        { status: 400 }
      );
    }

    const isValid = verifyOTP(otpCode.trim(), user.otpCode);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_OTP", message: "Incorrect 6-digit passcode." } },
        { status: 400 }
      );
    }

    // OTP is valid. Clear OTP fields.
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        otpCode: null,
        otpExpiry: null,
      },
    });

    // Create session cookie
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    await setSessionCookie(token);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
      emailVerified: true,
    };

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: "Passcode verified successfully.",
    });
  } catch (error: any) {
    console.error("API /api/auth/verify-otp Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Verification failed. Please try again." } },
      { status: 500 }
    );
  }
}
