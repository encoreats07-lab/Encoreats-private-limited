import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getReferralTier } from "@/lib/referrals";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    // Fetch user details with referrals, early access code, bookings, notifications
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        earlyAccess: true,
        referralsMade: {
          include: {
            referredUser: {
              select: { name: true, createdAt: true },
            },
          },
        },
        bookings: {
          include: {
            experience: true,
          },
          orderBy: { createdAt: "desc" },
        },
        notifications: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!fullUser) {
      return NextResponse.json({ success: false, user: null }, { status: 404 });
    }

    const referralCode = fullUser.earlyAccess?.referralCode || "ENCORE-MEMBER";
    const totalReferrals = fullUser.referralsMade.length;
    const tierInfo = getReferralTier(totalReferrals);

    return NextResponse.json({
      success: true,
      user: {
        id: fullUser.id,
        name: fullUser.name,
        email: fullUser.email,
        role: fullUser.role,
        phone: fullUser.phone,
        city: fullUser.city,
        interests: fullUser.interests ? JSON.parse(fullUser.interests) : [],
        emailVerified: fullUser.emailVerified,
        createdAt: fullUser.createdAt,
      },
      referral: {
        referralCode,
        totalReferrals,
        ...tierInfo,
        referralsList: fullUser.referralsMade,
      },
      bookings: fullUser.bookings,
      notifications: fullUser.notifications,
    });
  } catch (error: any) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch profile." } },
      { status: 500 }
    );
  }
}
