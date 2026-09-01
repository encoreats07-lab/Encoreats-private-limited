import { prisma } from "@/lib/db";

export interface ReferralTier {
  name: string;
  minReferrals: number;
  badge: string;
  perks: string[];
}

export const REFERRAL_TIERS: ReferralTier[] = [
  {
    name: "Explorer",
    minReferrals: 0,
    badge: "Member",
    perks: ["Access to curated public cultural calendar", "Early access waiting list status"],
  },
  {
    name: "Priority Access",
    minReferrals: 3,
    badge: "Priority",
    perks: ["24-hour advance booking window", "Exclusive cultural drop alerts"],
  },
  {
    name: "Seasonal Priority",
    minReferrals: 5,
    badge: "VIP Priority",
    perks: ["Complimentary concierge assistance", "Private table & seating allocation"],
  },
  {
    name: "Private Invitation Circle",
    minReferrals: 10,
    badge: "Circle Member",
    perks: [
      "Access to unlisted secret dining & art experiences",
      "Direct line to Encoreats Experience Directors",
      "Invitation to biannual Founder Salons",
    ],
  },
];

/**
 * Generate unique luxury referral code (e.g. ENCORE-A9X2B7)
 */
export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "ENCORE-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Returns current tier details based on total qualified referrals count.
 */
export function getReferralTier(count: number): {
  currentTier: ReferralTier;
  nextTier: ReferralTier | null;
  progressPercent: number;
  referralsNeededForNext: number;
} {
  let currentTier = REFERRAL_TIERS[0];
  let nextTier: ReferralTier | null = REFERRAL_TIERS[1];

  for (let i = REFERRAL_TIERS.length - 1; i >= 0; i--) {
    if (count >= REFERRAL_TIERS[i].minReferrals) {
      currentTier = REFERRAL_TIERS[i];
      nextTier = REFERRAL_TIERS[i + 1] || null;
      break;
    }
  }

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progressPercent: 100,
      referralsNeededForNext: 0,
    };
  }

  const range = nextTier.minReferrals - currentTier.minReferrals;
  const currentInTier = count - currentTier.minReferrals;
  const progressPercent = Math.min(Math.round((currentInTier / range) * 100), 100);
  const referralsNeededForNext = nextTier.minReferrals - count;

  return {
    currentTier,
    nextTier,
    progressPercent,
    referralsNeededForNext,
  };
}

/**
 * Process referral relationship safely preventing self-referral and duplicate referrals.
 */
export async function processReferralCode(
  referralCode: string,
  newUserId: string
): Promise<{ success: boolean; referrerId?: string }> {
  try {
    if (!referralCode || !referralCode.trim()) {
      return { success: false };
    }

    const cleanCode = referralCode.trim().toUpperCase();

    // Find referrer early access record
    const referrerRecord = await prisma.earlyAccess.findUnique({
      where: { referralCode: cleanCode },
      select: { userId: true, user: { select: { id: true } } },
    });

    const referrerUserId = referrerRecord?.userId || referrerRecord?.user?.id;

    if (!referrerUserId) {
      return { success: false };
    }

    // Prevent self referral
    if (referrerUserId === newUserId) {
      return { success: false };
    }

    // Check if referral link already exists for this user
    const existing = await prisma.referral.findUnique({
      where: { referredUserId: newUserId },
    });

    if (existing) {
      return { success: false };
    }

    // Create referral record
    await prisma.referral.create({
      data: {
        referrerId: referrerUserId,
        referredUserId: newUserId,
        status: "QUALIFIED",
      },
    });

    return { success: true, referrerId: referrerUserId };
  } catch (error) {
    console.error("Error processing referral code:", error);
    return { success: false };
  }
}
