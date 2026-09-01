import { renderEmailLayout } from "./baseLayout";

export function referralMilestoneTemplate(
  name: string,
  tierName: string,
  totalReferrals: number,
  perks: string[]
): { subject: string; html: string } {
  const perksList = perks.map((p) => `<li style="margin-bottom: 6px;">${p}</li>`).join("");

  const content = `
    <h1 style="font-size: 22px; margin-bottom: 16px;">Milestone Achieved: ${tierName}</h1>
    <p>Dear ${name},</p>
    <p>Congratulations. Thanks to your invitations, <strong>${totalReferrals} guests</strong> have joined the Encoreats Circle. You have unlocked the <strong>${tierName}</strong> membership tier.</p>
    
    <div style="background-color: rgba(201, 169, 110, 0.08); border: 1px solid rgba(201, 169, 110, 0.3); padding: 20px; border-radius: 6px; margin: 24px 0;">
      <div style="color: #C9A96E; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 8px;">Unlocked Tier Benefits</div>
      <ul style="padding-left: 20px; margin: 0; color: #F4F0E8;">
        ${perksList}
      </ul>
    </div>

    <div class="button-container">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="btn">View Referral Dashboard</a>
    </div>
  `;

  return {
    subject: `Encoreats Tier Unlocked: ${tierName}`,
    html: renderEmailLayout({
      title: "Referral Milestone Unlocked",
      contentHtml: content,
    }),
  };
}
