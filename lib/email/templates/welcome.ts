import { renderEmailLayout } from "./baseLayout";

export function welcomeEmailTemplate(name: string, dashboardUrl: string): { subject: string; html: string } {
  const content = `
    <h1 style="font-size: 24px; margin-bottom: 16px;">Welcome to the Encoreats Circle, ${name}.</h1>
    <p>We are delighted to welcome you to Encoreats — a private platform dedicated to curated cultural, culinary, and artistic gatherings.</p>
    <p>Your membership account has been initialized. Through your portal, you will receive invitation drops to unlisted dining salons, intimate artist performances, and secret venue unveilings across selected global cities.</p>
    
    <div class="button-container">
      <a href="${dashboardUrl}" class="btn">Access Member Dashboard</a>
    </div>

    <p style="font-size: 13px; color: #A9A39A;">If you have any specific cultural preferences or dietary requests, you can update your member profile at any time in your portal.</p>
  `;

  return {
    subject: "Welcome to Encoreats | Private Cultural Circle",
    html: renderEmailLayout({
      title: "Welcome to Encoreats",
      preheader: "Your place in the world of carefully curated cultural experiences has been reserved.",
      contentHtml: content,
    }),
  };
}
