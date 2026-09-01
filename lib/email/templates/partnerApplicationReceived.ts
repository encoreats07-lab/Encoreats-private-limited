export interface PartnerApplicationReceivedData {
  email: string;
  name: string;
  partnerType: string;
  city: string;
  applicationId: string;
}

export function partnerApplicationReceivedTemplate(data: PartnerApplicationReceivedData): string {
  const { name, partnerType, city, applicationId } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Received — Encoreats Partner Atelier</title>
</head>
<body style="margin:0; padding:0; background-color:#080809; color:#f4f0e8; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
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
                Partner & Creator Atelier
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 36px;">
              <div style="font-size:10px; text-transform:uppercase; letter-spacing:2px; color:#c9a96e; font-family:monospace; margin-bottom:12px;">
                Application Received • Ref: ${applicationId.slice(0, 8)}
              </div>
              <h1 style="font-family:Georgia, serif; font-size:32px; line-height:1.2; font-weight:300; color:#f4f0e8; margin:0 0 20px 0;">
                We have received your <span style="color:#c9a96e;">${partnerType}</span> submission.
              </h1>
              <p style="font-size:14px; line-height:1.7; color:#a9a39a; margin:0 0 16px 0;">
                Dear ${name},
              </p>
              <p style="font-size:14px; line-height:1.7; color:#a9a39a; margin:0 0 20px 0;">
                Thank you for applying to partner with Encoreats in <strong>${city}</strong>. Our curation board evaluates applicants based on artistic originality, spatial atmosphere, and cultural alignment.
              </p>
              
              <div style="background-color:#080809; border:1px solid #27272a; padding:20px; margin-bottom:24px;">
                <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#c9a96e; font-family:monospace; margin-bottom:10px;">
                  What Happens Next
                </div>
                <ol style="margin:0; padding-left:18px; font-size:13px; color:#a9a39a; line-height:1.8;">
                  <li>Our curation team conducts an initial review of your portfolio/venue details.</li>
                  <li>Aligned applications progress to a 15-minute creative alignment session.</li>
                  <li>Approved partners are onboarded into seasonal experience programming.</li>
                </ol>
              </div>

              <p style="font-size:13px; color:#71717a; line-height:1.6;">
                Review typically takes 3-5 business days. We will contact you at this email address with updates.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 36px; border-top:1px solid #27272a; text-align:center; background-color:#080809;">
              <div style="font-size:11px; color:#71717a;">
                Encoreats Curation Board • Partner Atelier
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
