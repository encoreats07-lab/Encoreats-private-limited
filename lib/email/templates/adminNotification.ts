export interface AdminNotificationData {
  title: string;
  type: "EARLY_ACCESS" | "PARTNER_APPLICATION";
  details: Record<string, any>;
}

export function adminNotificationTemplate(data: AdminNotificationData): string {
  const { title, type, details } = data;

  const detailRows = Object.entries(details)
    .map(
      ([key, value]) => `
        <tr>
          <td style="padding:8px 0; border-bottom:1px solid #27272a; color:#a9a39a; font-family:monospace; font-size:11px; text-transform:uppercase;">${key}</td>
          <td style="padding:8px 0; border-bottom:1px solid #27272a; color:#f4f0e8; font-size:13px; text-align:right;">${typeof value === "object" ? JSON.stringify(value) : String(value)}</td>
        </tr>
      `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
</head>
<body style="margin:0; padding:20px; background-color:#080809; color:#f4f0e8; font-family:sans-serif;">
  <div style="max-width:600px; margin:0 auto; background-color:#111113; border:1px solid #c9a96e; padding:30px;">
    <div style="font-size:10px; text-transform:uppercase; letter-spacing:2px; color:#c9a96e; font-family:monospace; margin-bottom:8px;">
      Internal Admin Alert • ${type}
    </div>
    <h2 style="font-family:Georgia, serif; font-size:24px; font-weight:normal; margin:0 0 20px 0; color:#f4f0e8;">
      ${title}
    </h2>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
      ${detailRows}
    </table>
    <div style="font-size:11px; color:#71717a; font-family:monospace;">
      Timestamp: ${new Date().toISOString()}
    </div>
  </div>
</body>
</html>
  `;
}
