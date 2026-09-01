import { renderEmailLayout } from "./baseLayout";

export function emailVerificationTemplate(name: string, otpCode: string): { subject: string; html: string } {
  const content = `
    <h1 style="font-size: 22px; margin-bottom: 16px; font-family: Georgia, serif;">Verify Your Email Address</h1>
    <p>Dear ${name},</p>
    <p>Use the confidential 6-digit passcode below to complete your verification and activate your Encoreats membership.</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <div style="display: inline-block; padding: 18px 36px; background-color: #121212; border: 1px solid #D4AF37; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #E6C687;">
        ${otpCode}
      </div>
    </div>

    <p style="font-size: 13px; color: #8C867D; text-align: center;">This passcode expires in 10 minutes. Do not share this code with anyone.</p>
  `;

  return {
    subject: `Encoreats Passcode: ${otpCode} — Verify Your Email`,
    html: renderEmailLayout({
      title: "Verify Email Passcode",
      contentHtml: content,
    }),
  };
}
