import { renderEmailLayout } from "./baseLayout";

export function partnerApplicationRejectedTemplate(
  name: string,
  type: string
): { subject: string; html: string } {
  const content = `
    <h1 style="font-size: 22px; margin-bottom: 16px;">Update Regarding Your Partnership Application</h1>
    <p>Dear ${name},</p>
    <p>Thank you for submitting your <strong>${type}</strong> application to Encoreats and sharing your creative portfolio with our curation committee.</p>
    <p>While we deeply appreciate your submission, after careful review of our current season programming and city capacity, we are unable to proceed with an active collaboration at this time.</p>
    <p>We keep all qualified creator and venue profiles in our private archives for future seasonal curation calls.</p>
  `;

  return {
    subject: "Update Regarding Your Encoreats Application",
    html: renderEmailLayout({
      title: "Application Status Update",
      contentHtml: content,
    }),
  };
}
