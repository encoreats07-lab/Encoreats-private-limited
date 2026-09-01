export interface EmailLayoutOptions {
  title: string;
  preheader?: string;
  contentHtml: string;
}

export function renderEmailLayout({ title, preheader, contentHtml }: EmailLayoutOptions): string {
  const currentYear = new Date().getFullYear();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://encoreats.com";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${preheader ? `<meta name="description" content="${preheader}">` : ""}
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #080809;
      color: #F4F0E8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #080809;
      padding-bottom: 40px;
    }
    .main {
      background-color: #111113;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      font-color: #F4F0E8;
      border: 1px solid rgba(244, 240, 232, 0.08);
      border-radius: 8px;
    }
    .header {
      padding: 40px 30px 20px 30px;
      text-align: center;
      border-bottom: 1px solid rgba(201, 169, 110, 0.15);
    }
    .brand-title {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 26px;
      letter-spacing: 0.25em;
      color: #F4F0E8;
      text-transform: uppercase;
      margin: 0;
      text-decoration: none;
    }
    .brand-tagline {
      font-size: 11px;
      letter-spacing: 0.2em;
      color: #C9A96E;
      text-transform: uppercase;
      margin-top: 6px;
    }
    .content {
      padding: 40px 30px;
      font-size: 15px;
      line-height: 1.7;
      color: #D6D0C7;
    }
    h1, h2, h3 {
      font-family: Georgia, 'Times New Roman', serif;
      color: #F4F0E8;
      font-weight: 400;
      margin-top: 0;
    }
    .button-container {
      margin: 32px 0;
      text-align: center;
    }
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background-color: #C9A96E;
      color: #080809;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      border-radius: 2px;
    }
    .footer {
      padding: 30px;
      text-align: center;
      font-size: 12px;
      color: #8C867D;
      border-top: 1px solid rgba(244, 240, 232, 0.06);
    }
    .footer a {
      color: #C9A96E;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="header">
          <a href="${appUrl}" class="brand-title">ENCOREATS</a>
          <div class="brand-tagline">Curated Cultural Experiences</div>
        </td>
      </tr>
      <tr>
        <td class="content">
          ${contentHtml}
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p style="margin-bottom: 12px;">© ${currentYear} Encoreats Platform Inc. All Rights Reserved.</p>
          <p style="margin: 0;">
            <a href="${appUrl}/privacy">Privacy Policy</a> &nbsp;•&nbsp;
            <a href="${appUrl}/terms">Terms of Membership</a> &nbsp;•&nbsp;
            <a href="${appUrl}/contact">Concierge Support</a>
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}
