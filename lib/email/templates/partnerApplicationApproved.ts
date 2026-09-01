import { renderEmailLayout } from "./baseLayout";

export function partnerApplicationApprovedTemplate(
  name: string,
  type: string
): { subject: string; html: string } {
  const content = `
    <h1 style="font-size: 22px; margin-bottom: 16px;">Welcome to the Encoreats Partner Ecosystem</h1>
    <p>Dear ${name},</p>
    <p>We are pleased to inform you that your <strong>${type}</strong> partnership application has been reviewed and approved by the Encoreats Curation Board.</p>
    <p>Your work aligns beautifully with our standards of craftsmanship, atmosphere, and editorial distinction. A dedicated Experience Curator will reach out to you within 48 hours to discuss initial experience design and scheduling.</p>

    <div class="button-container">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/partners" class="btn">Explore Partner Portal</a>
    </div>

    <p style="font-size: 13px; color: #A9A39A;">If you have immediate operational questions, please reply directly to this communication.</p>
  `;

  return {
    subject: "Partner Application Approved | Encoreats Curation Board",
    html: renderEmailLayout({
      title: "Partner Application Approved",
      contentHtml: content,
    }),
  };
}
