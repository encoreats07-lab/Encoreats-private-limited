import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resetPasswordSchema } from "@/lib/validation";
import { hashPassword, verifyOTP } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      const firstMsg = result.error.issues[0]?.message || "Invalid payload";
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: firstMsg } },
        { status: 400 }
      );
    }

    const { token, password } = result.data;
    const email = body.email ? String(body.email).trim().toLowerCase() : null;

    let user = null;

    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    }

    if (!user && token) {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { resetToken: token },
            { verifyToken: token },
          ],
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_TOKEN", message: "Invalid or expired passcode." } },
        { status: 400 }
      );
    }

    // Verify OTP or token expiry
    if (user.otpCode && user.otpExpiry) {
      if (new Date() > user.otpExpiry) {
        return NextResponse.json(
          { success: false, error: { code: "EXPIRED_OTP", message: "Passcode has expired. Please request a new code." } },
          { status: 400 }
        );
      }
      const valid = verifyOTP(token, user.otpCode) || user.resetToken === token;
      if (!valid) {
        return NextResponse.json(
          { success: false, error: { code: "INVALID_OTP", message: "Incorrect 6-digit passcode." } },
          { status: 400 }
        );
      }
    } else if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
      return NextResponse.json(
        { success: false, error: { code: "EXPIRED_TOKEN", message: "Reset token has expired." } },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        otpCode: null,
        otpExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You may now log in with your new credentials.",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Password reset failed." } },
      { status: 500 }
    );
  }
}
