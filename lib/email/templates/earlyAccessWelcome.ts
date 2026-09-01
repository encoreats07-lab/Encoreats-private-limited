export interface EarlyAccessWelcomeData {
  name: string;
  email: string;
  city: string;
  interests: string[];
  referralCode: string;
  referralUrl: string;
}

export function earlyAccessWelcomeTemplate(data: EarlyAccessWelcomeData): string {
  const { name, city, interests, referralCode, referralUrl } = data;

  const interestsList =
    interests.length > 0
      ? interests
          .map(
            (item) =>
              `<span style="display:inline-block; margin:4px; padding:6px 12px; background:#18181b; border:1px solid #27272a; color:#f4f0e8; font-size:11px; text-transform:uppercase; font-family:monospace; letter-spacing:1px;">${item}</span>`
          )
          .join("")
      : `<span style="color:#a9a39a; font-size:12px;">All Cultural Categories</span>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Encoreats</title>
</head>
<body style="margin:0; padding:0; background-color:#080809; color:#f4f0e8; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#080809; padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background-color:#111113; border:1px solid #27272a; text-align:left;">
          
          <!-- Header -->
          <tr>
            <td style="padding:36px; border-bottom:1px solid #27272a; text-align:center;">
              <div style="font-family:Georgia, serif; font-size:28px; letter-spacing:4px; color:#f4f0e8; text-transform:uppercase;">
                ENCOREATS<span style="color:#c9a96e;">.</span>
              </div>
              <div style="font-size:9px; text-transform:uppercase; letter-spacing:3px; color:#c9a96e; margin-top:6px; font-family:monospace;">
                Private Cultural Atelier
              </div>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="padding:40px 36px 20px;">
              <div style="font-size:10px; text-transform:uppercase; letter-spacing:2px; color:#c9a96e; font-family:monospace; margin-bottom:12px;">
                Membership Curation Pass
              </div>
              <h1 style="font-family:Georgia, serif; font-size:36px; line-height:1.2; font-weight:300; color:#f4f0e8; margin:0 0 20px 0;">
                Welcome to the Vault,<br />
                <span style="font-style:italic; color:#c9a96e;">${name}</span>
              </h1>
              <p style="font-size:14px; line-height:1.7; color:#a9a39a; margin:0 0 16px 0;">
                Your early access request has been confirmed. You are now positioned on our priority invitations list for private dining tables, vinyl listening sanctuaries, and unannounced architectural pop-ups.
              </p>
            </td>
          </tr>

          <!-- Summary Box -->
          <tr>
            <td style="padding:0 36px 30px;">
              <div style="background-color:#080809; border:1px solid #27272a; padding:24px;">
                <div style="font-size:10px; text-transform:uppercase; letter-spacing:2px; color:#c9a96e; font-family:monospace; margin-bottom:16px;">
                  Your Curation Dossier
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:8px 0; font-size:12px; color:#a9a39a; font-family:monospace; text-transform:uppercase;">Primary City</td>
                    <td style="padding:8px 0; font-size:13px; color:#f4f0e8; text-align:right; font-weight:600; text-transform:uppercase;">${city}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; font-size:12px; color:#a9a39a; font-family:monospace; text-transform:uppercase; vertical-align:top;">Passions</td>
                    <td style="padding:8px 0; text-align:right;">${interestsList}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Referral Section -->
          <tr>
            <td style="padding:0 36px 36px;">
              <div style="background-color:#18181b; border:1px solid #c9a96e; padding:28px; text-align:center;">
                <div style="font-size:10px; text-transform:uppercase; letter-spacing:2px; color:#c9a96e; font-family:monospace; margin-bottom:8px;">
                  Your Invitation Circle Code
                </div>
                <div style="font-family:monospace; font-size:24px; font-weight:bold; letter-spacing:4px; color:#c9a96e; margin-bottom:12px;">
                  ${referralCode}
                </div>
                <p style="font-size:12px; color:#a9a39a; line-height:1.6; margin:0 0 18px 0;">
                  Share your invitation link with culturally aligned peers. Submitting friends elevates your priority status for seasonal drops.
                </p>
                <a href="${referralUrl}" style="display:inline-block; padding:12px 24px; background-color:#c9a96e; color:#080809; font-size:11px; text-transform:uppercase; letter-spacing:2px; font-weight:bold; text-decoration:none;">
                  View Invitation Dashboard
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 36px; border-top:1px solid #27272a; text-align:center; background-color:#080809;">
              <div style="font-family:Georgia, serif; font-size:16px; color:#f4f0e8; letter-spacing:2px; margin-bottom:8px;">
                ENCOREATS
              </div>
              <div style="font-size:11px; color:#71717a; line-height:1.6;">
                Experiences Worth Showing Up For.<br />
                © ${new Date().getFullYear()} Encoreats Atelier Inc. All rights reserved.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
