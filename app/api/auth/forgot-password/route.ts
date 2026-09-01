import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { generateOTP, hashOTP } from "@/lib/auth/otp";
import { sendTransactionalEmail } from "@/lib/email";
import { passwordResetTemplate } from "@/lib/email/templates/passwordReset";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "client_forgot";
    const limit = checkRateLimit(`forgot_${ip}`, 5, 60000);
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: { code: "TOO_MANY_REQUESTS", message: "Too many attempts. Please wait a minute." } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Please provide a valid email address." } },
        { status: 400 }
      );
    }

    const { email, honeypot } = result.data;
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email address, a password reset passcode has been sent.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user without leaking existence
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (user) {
      const plainOtp = generateOTP();
      const hashedOtp = hashOTP(plainOtp);
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await prisma.user.update({
        where: { id: user.id },
        data: {
          otpCode: hashedOtp,
          otpExpiry: otpExpiry,
          resetToken: plainOtp,
          resetTokenExpiry: otpExpiry,
        },
      });

      console.log(`[ENCOREATS RESET OTP] Code for ${cleanEmail}: ${plainOtp}`);

      const emailData = passwordResetTemplate(user.name, plainOtp);
      sendTransactionalEmail({
        to: cleanEmail,
        subject: emailData.subject,
        html: emailData.html,
      }).catch((err) => console.error("Password reset email error:", err));

      return NextResponse.json({
        success: true,
        email: cleanEmail,
        message: "Passcode sent to your email address.",
        ...(process.env.EMAIL_PROVIDER === "logger" ? { devCode: plainOtp } : {}),
      });
    }

    // Standard response for security (non-enumeration)
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email address, a password reset passcode has been sent.",
    });
  } catch (error: unknown) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Unable to process request." } },
      { status: 500 }
    );
  }
}
