import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import { hashPassword, generateOTP, hashOTP } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { generateReferralCode, processReferralCode } from "@/lib/referrals";
import { sendTransactionalEmail } from "@/lib/email";
import { emailVerificationTemplate } from "@/lib/email/templates/emailVerification";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "client_register";
    const limit = checkRateLimit(`register_${ip}`, 5, 60000);
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: { code: "TOO_MANY_REQUESTS", message: "Too many attempts. Please wait a minute." } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid input details";
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: firstError, details: result.error.flatten().fieldErrors } },
        { status: 400 }
      );
    }

    const { fullName, email, password, phone, city, interests, referralCode, honeypot } = result.data;

    // Honeypot spam check
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json({ success: true, message: "Registration submitted successfully." });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: { code: "EMAIL_EXISTS", message: "An account with this email address already exists. Please Sign In." } },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);
    const userReferralCode = generateReferralCode();
    const interestsJson = JSON.stringify(interests || ["Food", "Music", "Culture"]);

    // Generate 6-digit OTP code & 10 minute expiry
    const plainOtp = generateOTP();
    const hashedOtp = hashOTP(plainOtp);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Create user with emailVerified = false & Early Access record
    const user = await prisma.user.create({
      data: {
        name: fullName,
        email: cleanEmail,
        passwordHash: hashedPassword,
        phone: phone || null,
        city: city,
        interests: interestsJson,
        role: "CUSTOMER",
        emailVerified: false,
        otpCode: hashedOtp,
        otpExpiry: otpExpiry,
        earlyAccess: {
          create: {
            name: fullName,
            email: cleanEmail,
            city: city,
            interests: interestsJson,
            referralCode: userReferralCode,
            status: "PENDING",
          },
        },
        notifications: {
          create: {
            title: "Welcome to Encoreats Circle",
            message: "Your membership registration has been initiated. Verify your passcode to activate your account.",
            type: "AUTH",
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Process referral code if supplied
    if (referralCode) {
      await processReferralCode(referralCode, user.id);
    }

    console.log(`[ENCOREATS REGISTRATION OTP] Code for ${cleanEmail}: ${plainOtp}`);

    // Send verification OTP email asynchronously
    const emailData = emailVerificationTemplate(user.name, plainOtp);
    sendTransactionalEmail({
      to: cleanEmail,
      subject: emailData.subject,
      html: emailData.html,
    }).catch((err) => console.error("Async welcome verification email error:", err));

    return NextResponse.json({
      success: true,
      requireOtp: true,
      email: cleanEmail,
      message: "Passcode sent to your email address. Please enter the 6-digit code to complete registration.",
      ...(process.env.EMAIL_PROVIDER === "logger" ? { devCode: plainOtp } : {}),
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Registration failed. Please try again." } },
      { status: 500 }
    );
  }
}
