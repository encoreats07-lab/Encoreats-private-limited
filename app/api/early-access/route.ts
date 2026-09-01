import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { earlyAccessSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { sendTransactionalEmail } from "@/lib/email";
import { earlyAccessWelcomeTemplate } from "@/lib/email/templates/earlyAccessWelcome";
import { adminNotificationTemplate } from "@/lib/email/templates/adminNotification";

export async function POST(req: Request) {
  try {
    /* ========================================
       RATE LIMIT
    ======================================== */

    const forwardedFor = req.headers.get("x-forwarded-for");

    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateCheck = checkRateLimit(
      `early_access_${ip}`,
      10,
      60 * 1000
    );

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too many requests. Please try again in a minute.",
          },
        },
        { status: 429 }
      );
    }

    /* ========================================
       PARSE + VALIDATE REQUEST
    ======================================== */

    const body = await req.json();

    const result = earlyAccessSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            details: result.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      phone,
      city,
      interests,
      referralCode,
      honeypot,
    } = result.data;

    /* ========================================
       HONEYPOT BOT PROTECTION
    ======================================== */

    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Request received",
        },
        { status: 200 }
      );
    }

    /* ========================================
       NORMALIZE EMAIL
    ======================================== */

    const normalizedEmail = email.toLowerCase().trim();

    console.log(
      `📩 Early access request received from: ${normalizedEmail}`
    );

    /* ========================================
       CHECK EXISTING USER
    ======================================== */

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      include: {
        earlyAccess: true,
      },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    /* ========================================
       EXISTING USER → RESEND EMAIL
    ======================================== */

    if (existingUser?.earlyAccess) {
      console.log(
        `ℹ️ Existing early access user found: ${normalizedEmail}`
      );

      const existingReferralCode =
        existingUser.earlyAccess.referralCode;

      const referralUrl =
        `${baseUrl}/register?ref=${existingReferralCode}`;

      try {
        console.log(
          `📧 Resending welcome email to: ${normalizedEmail}`
        );

        const welcomeHtml = earlyAccessWelcomeTemplate({
          name: existingUser.name || name,
          email: normalizedEmail,
          city: existingUser.city || city,
          interests,
          referralCode: existingReferralCode,
          referralUrl,
        });

        await sendTransactionalEmail({
          to: normalizedEmail,
          subject: "Welcome to Encoreats — Early Access Pass",
          html: welcomeHtml,
        });

        console.log(
          `✅ Welcome email resent successfully to: ${normalizedEmail}`
        );
      } catch (emailError) {
        console.error(
          `❌ Failed to resend welcome email to ${normalizedEmail}:`,
          emailError
        );
      }

      return NextResponse.json(
        {
          success: true,
          alreadyRegistered: true,
          referralCode: existingReferralCode,
          message:
            "You are already registered for early access. Your welcome email has been sent again.",
        },
        { status: 200 }
      );
    }

    /* ========================================
       GENERATE REFERRAL CODE
    ======================================== */

    const randomCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    const newReferralCode = `ENCORE-${randomCode}`;

    /* ========================================
       FIND REFERRER
    ======================================== */

    let referrerUserId: string | null = null;

    if (referralCode?.trim()) {
      const referrerEA =
        await prisma.earlyAccess.findUnique({
          where: {
            referralCode: referralCode.trim(),
          },
        });

      if (referrerEA?.userId) {
        referrerUserId = referrerEA.userId;
      }
    }

    /* ========================================
       CREATE USER + EARLY ACCESS
    ======================================== */

    const { user, earlyAccess } =
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name,
            email: normalizedEmail,
            phone: phone || null,
            city,
          },
        });

        const earlyAccess =
          await tx.earlyAccess.create({
            data: {
              userId: user.id,
              name,
              email: normalizedEmail,
              city,
              interests: JSON.stringify(interests),
              referralCode: newReferralCode,
              referredById: referrerUserId,
              status: "CONFIRMED",
            },
          });

        /* ========================================
           CREATE REFERRAL RELATIONSHIP
        ======================================== */

        if (
          referrerUserId &&
          referrerUserId !== user.id
        ) {
          const existingRelationship =
            await tx.referral.findFirst({
              where: {
                referrerId: referrerUserId,
                referredUserId: user.id,
              },
            });

          if (!existingRelationship) {
            await tx.referral.create({
              data: {
                referrerId: referrerUserId,
                referredUserId: user.id,
                status: "QUALIFIED",
              },
            });
          }
        }

        return {
          user,
          earlyAccess,
        };
      });

    console.log(
      `✅ New early access user created: ${user.email}`
    );

    /* ========================================
       CREATE REFERRAL URL
    ======================================== */

    const referralUrl =
      `${baseUrl}/register?ref=${newReferralCode}`;

    /* ========================================
       SEND USER WELCOME EMAIL
    ======================================== */

    try {
      console.log(
        `📧 Sending welcome email to: ${normalizedEmail}`
      );

      const welcomeHtml = earlyAccessWelcomeTemplate({
        name,
        email: normalizedEmail,
        city,
        interests,
        referralCode: newReferralCode,
        referralUrl,
      });

      await sendTransactionalEmail({
        to: normalizedEmail,
        subject: "Welcome to Encoreats — Early Access Pass",
        html: welcomeHtml,
      });

      console.log(
        `✅ Welcome email sent successfully to: ${normalizedEmail}`
      );
    } catch (emailError) {
      console.error(
        `❌ Failed to send welcome email to ${normalizedEmail}:`,
        emailError
      );
    }

    /* ========================================
       SEND ADMIN NOTIFICATION
    ======================================== */

    const adminEmail = process.env.ADMIN_EMAIL;

    if (adminEmail) {
      try {
        console.log(
          `📧 Sending admin notification to: ${adminEmail}`
        );

        const adminHtml =
          adminNotificationTemplate({
            title: `New Early Access Signup: ${name}`,
            type: "EARLY_ACCESS",
            details: {
              Name: name,
              Email: normalizedEmail,
              Phone: phone || "Not provided",
              City: city,
              Interests: interests.join(", "),
              ReferralCode: newReferralCode,
              ReferredBy:
                referralCode || "Direct",
            },
          });

        await sendTransactionalEmail({
          to: adminEmail,
          subject: `[Encoreats Admin] New Early Access Signup: ${name}`,
          html: adminHtml,
        });

        console.log(
          `✅ Admin notification sent successfully to: ${adminEmail}`
        );
      } catch (adminEmailError) {
        console.error(
          `❌ Failed to send admin notification:`,
          adminEmailError
        );
      }
    } else {
      console.warn(
        "⚠️ ADMIN_EMAIL is not configured."
      );
    }

    /* ========================================
       SUCCESS RESPONSE
    ======================================== */

    return NextResponse.json(
      {
        success: true,
        referralCode: earlyAccess.referralCode,
        referralUrl,
        message:
          "Successfully joined early access vault.",
      },
      {
        status: 201,
      }
    );
  } catch (error: unknown) {
    console.error(
      "❌ API /api/early-access Error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred.";

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message,
        },
      },
      {
        status: 500,
      }
    );
  }
}