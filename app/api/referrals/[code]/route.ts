import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getReferralTier } from "@/lib/referrals";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const resolvedParams = await params;
    const code = resolvedParams.code?.trim();

    if (!code) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Referral code is required" } },
        { status: 400 }
      );
    }

    const earlyAccessRecord = await prisma.earlyAccess.findUnique({
      where: { referralCode: code },
      include: {
        user: {
          include: {
            referralsMade: true,
          },
        },
      },
    });

    if (!earlyAccessRecord) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Invalid referral code" } },
        { status: 404 }
      );
    }

    const referralCount = earlyAccessRecord.user?.referralsMade?.length || 0;
    const tierDetails = getReferralTier(referralCount);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const shareUrl = `${baseUrl}/early-access?ref=${code}`;

    return NextResponse.json({
      success: true,
      data: {
        code,
        userName: earlyAccessRecord.user?.name || earlyAccessRecord.name,
        referralCount,
        currentTier: tierDetails.currentTier.name,
        nextTier: tierDetails.nextTier?.name || "Max Tier Unlocked",
        targetReferrals: tierDetails.nextTier?.minReferrals || tierDetails.currentTier.minReferrals,
        progressPercent: tierDetails.progressPercent,
        shareUrl,
      },
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch referral details";
    console.error("API /api/referrals/[code] Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: errMessage } },
      { status: 500 }
    );
  }
}
