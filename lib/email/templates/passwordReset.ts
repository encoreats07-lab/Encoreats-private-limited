import { renderEmailLayout } from "./baseLayout";

export function passwordResetTemplate(name: string, otpCode: string): { subject: string; html: string } {
  const content = `
    <h1 style="font-size: 22px; margin-bottom: 16px; font-family: Georgia, serif;">Reset Your Account Password</h1>
    <p>Dear ${name},</p>
    <p>We received a request to reset your password for your Encoreats account. Enter the 6-digit verification code below to authorize your new password.</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <div style="display: inline-block; padding: 18px 36px; background-color: #121212; border: 1px solid #D4AF37; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #E6C687;">
        ${otpCode}
      </div>
    </div>

    <p style="font-size: 13px; color: #8C867D; text-align: center;">This security passcode expires in 10 minutes. If you did not request a password reset, please secure your account immediately.</p>
  `;

  return {
    subject: `Encoreats Security Code: ${otpCode} — Password Reset`,
    html: renderEmailLayout({
      title: "Reset Password Code",
      contentHtml: content,
    }),
  };
}
