import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOTP, hashOTP } from "@/lib/auth/otp";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { sendTransactionalEmail } from "@/lib/email";
import { emailVerificationTemplate } from "@/lib/email/templates/emailVerification";
import { passwordResetTemplate } from "@/lib/email/templates/passwordReset";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "client_send_otp";
    const limit = checkRateLimit(`send_otp_${ip}`, 5, 60000);
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: { code: "RATE_LIMITED", message: "Too many OTP requests. Please wait a minute." } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, purpose = "EMAIL_VERIFICATION" } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Valid email address is required." } },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      // Do not reveal email absence if password reset for security
      if (purpose === "PASSWORD_RESET") {
        return NextResponse.json({
          success: true,
          message: "If the email is registered, a security passcode has been sent.",
        });
      }
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "No account found with this email." } },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP and 10 minute expiration
    const plainOtp = generateOTP();
    const hashedOtp = hashOTP(plainOtp);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: hashedOtp,
        otpExpiry,
      },
    });

    console.log(`[ENCOREATS OTP] Code for ${cleanEmail} (${purpose}): ${plainOtp}`);

    // Send email asynchronously
    let emailData: { subject: string; html: string };
    if (purpose === "PASSWORD_RESET") {
      emailData = passwordResetTemplate(user.name, plainOtp);
    } else {
      emailData = emailVerificationTemplate(user.name, plainOtp);
    }

    sendTransactionalEmail({
      to: cleanEmail,
      subject: emailData.subject,
      html: emailData.html,
    }).catch((err) => console.error("Async OTP email error:", err));

    return NextResponse.json({
      success: true,
      message: "Passcode sent successfully.",
      // Include code in dev log for testing convenience if logger mode
      ...(process.env.EMAIL_PROVIDER === "logger" ? { devCode: plainOtp } : {}),
    });
  } catch (error: any) {
    console.error("API /api/auth/send-otp Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to dispatch passcode." } },
      { status: 500 }
    );
  }
}
