import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    // Allow ADMIN role or fallback authorization check
    if (!user || (user.role !== "ADMIN" && user.role !== "PARTNER")) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Admin authorization required." } },
        { status: 403 }
      );
    }

    const [
      totalUsers,
      totalEarlyAccess,
      totalApplications,
      pendingApplications,
      approvedPartners,
      totalReferrals,
      totalBookings,
      earlyAccessRecords,
      userRecords,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.earlyAccess.count(),
      prisma.partnerApplication.count(),
      prisma.partnerApplication.count({ where: { status: "PENDING" } }),
      prisma.partnerApplication.count({ where: { status: "APPROVED" } }),
      prisma.referral.count(),
      prisma.booking.count(),
      prisma.earlyAccess.findMany({ select: { interests: true, city: true } }),
      prisma.user.findMany({ select: { interests: true, city: true } }),
    ]);

    // Calculate dynamic cultural interest breakdown from database records
    const interestCounts: Record<string, number> = {
      Food: 0,
      Music: 0,
      Art: 0,
      Nightlife: 0,
      Comedy: 0,
      Culture: 0,
      Workshops: 0,
    };

    let totalInterestSelections = 0;

    const processInterests = (rawInterests?: string | null) => {
      if (!rawInterests) return;
      try {
        const parsed: string[] = typeof rawInterests === "string" ? JSON.parse(rawInterests) : rawInterests;
        if (Array.isArray(parsed)) {
          parsed.forEach((interest) => {
            const key = Object.keys(interestCounts).find(
              (k) => k.toLowerCase() === interest.toLowerCase() || interest.toLowerCase().includes(k.toLowerCase())
            ) || "Culture";
            interestCounts[key] = (interestCounts[key] || 0) + 1;
            totalInterestSelections++;
          });
        }
      } catch (e) {}
    };

    earlyAccessRecords.forEach((ea) => processInterests(ea.interests));
    userRecords.forEach((u) => processInterests(u.interests));

    const culturalDemand: Record<string, number> = {};
    Object.keys(interestCounts).forEach((key) => {
      const count = interestCounts[key];
      culturalDemand[key] = totalInterestSelections > 0
        ? Math.round((count / totalInterestSelections) * 100)
        : key === "Food" ? 40 : key === "Music font" ? 30 : 15;
    });

    // Calculate City Distribution Breakdown
    const cityCounts: Record<string, number> = {
      Mumbai: 0,
      Delhi: 0,
      Bengaluru: 0,
      Goa: 0,
      Hyderabad: 0,
    };

    [...earlyAccessRecords, ...userRecords].forEach((item) => {
      if (item.city) {
        const normalizedCity = item.city.charAt(0).toUpperCase() + item.city.slice(1).toLowerCase();
        cityCounts[normalizedCity] = (cityCounts[normalizedCity] || 0) + 1;
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalEarlyAccess,
        totalApplications,
        pendingApplications,
        approvedPartners,
        totalReferrals,
        totalBookings,
        culturalDemand,
        cityDemand: cityCounts,
      },
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch admin stats." } },
      { status: 500 }
    );
  }
}
