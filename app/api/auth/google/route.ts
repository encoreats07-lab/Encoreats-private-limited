import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signToken, setSessionCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { generateReferralCode } from "@/lib/referrals";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "google_auth";
    const limit = checkRateLimit(`google_auth_${ip}`, 10, 60000);
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: { code: "RATE_LIMITED", message: "Too many login attempts. Please wait." } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { googleId, email, name, avatarUrl } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Google profile email is required." } },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanGoogleId = googleId || `google_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const displayName = name || cleanEmail.split("@")[0] || "Cultural Connoisseur";

    // Find existing user by Google ID or Email
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: cleanGoogleId }, { email: cleanEmail }],
      },
    });

    if (user) {
      // Link Google ID if missing
      if (!user.googleId || !user.emailVerified) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: user.googleId || cleanGoogleId,
            authProvider: "GOOGLE",
            emailVerified: true,
            avatarUrl: user.avatarUrl || avatarUrl || null,
          },
        });
      }
    } else {
      // Create new Google User
      const userReferralCode = generateReferralCode();
      const defaultInterests = JSON.stringify(["Culinary", "Music", "Culture"]);

      user = await prisma.user.create({
        data: {
          name: displayName,
          email: cleanEmail,
          googleId: cleanGoogleId,
          authProvider: "GOOGLE",
          emailVerified: true,
          avatarUrl: avatarUrl || null,
          role: "CUSTOMER",
          interests: defaultInterests,
          earlyAccess: {
            create: {
              name: displayName,
              email: cleanEmail,
              city: "mumbai",
              interests: defaultInterests,
              referralCode: userReferralCode,
              status: "CONFIRMED",
            },
          },
          notifications: {
            create: {
              title: "Welcome to Encoreats Circle",
              message: "Your Google membership account is active. Explore seasonal cultural experiences.",
              type: "AUTH",
            },
          },
        },
      });
    }

    // Set HTTP-only JWT Session cookie
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    await setSessionCookie(token);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
      avatarUrl: user.avatarUrl,
      emailVerified: true,
    };

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: "Authenticated via Google successfully.",
    });
  } catch (error: any) {
    console.error("API /api/auth/google Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Google authentication failed." } },
      { status: 500 }
    );
  }
}
