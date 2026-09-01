import nodemailer from "nodemailer";

/*
========================================
EMAIL TYPES
========================================
*/

export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface EmailProvider {
  sendEmail(
    payload: SendEmailPayload
  ): Promise<{
    success: boolean;
    id?: string;
    error?: string;
  }>;
}


/*
========================================
LOGGER EMAIL PROVIDER
Development Only
========================================
*/

export class LoggerEmailProvider implements EmailProvider {
  async sendEmail(payload: SendEmailPayload) {
    console.log("");
    console.log("================================================");
    console.log("📧 EMAIL LOGGER MODE");
    console.log("================================================");
    console.log(`TO: ${payload.to}`);
    console.log(`SUBJECT: ${payload.subject}`);
    console.log(
      `FROM: ${payload.from ||
      process.env.EMAIL_FROM ||
      "Encoreats <concierge@encoreats.com>"
      }`
    );
    console.log("------------------------------------------------");
    console.log("EMAIL CONTENT:");
    console.log(payload.html.substring(0, 500) + "...");
    console.log("================================================");
    console.log("");

    return {
      success: true,
      id: `logger_${Date.now()}`,
    };
  }
}


/*
========================================
NODEMAILER SMTP PROVIDER
========================================
*/

export class NodemailerProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";

    const port = Number(
      process.env.SMTP_PORT || 587
    );

    const user =
      process.env.SMTP_USER ||
      process.env.GMAIL_USER;

    const pass =
      process.env.SMTP_PASSWORD ||
      process.env.GMAIL_APP_PASSWORD;

    /*
    ========================================
    VALIDATE SMTP CONFIGURATION
    ========================================
    */

    if (!user) {
      throw new Error(
        "SMTP_USER or GMAIL_USER is missing."
      );
    }

    if (!pass) {
      throw new Error(
        "SMTP_PASSWORD or GMAIL_APP_PASSWORD is missing."
      );
    }

    console.log("================================================");
    console.log("📧 SMTP EMAIL CONFIGURATION");
    console.log("================================================");
    console.log("Provider: SMTP / Nodemailer");
    console.log("Host:", host);
    console.log("Port:", port);
    console.log("User:", user);
    console.log("Password configured:", pass ? "YES ✅" : "NO ❌");
    console.log("================================================");

    /*
    ========================================
    CREATE SMTP TRANSPORTER
    ========================================
    */

    this.transporter = nodemailer.createTransport({
      host,
      port,

      secure: port === 465,

      auth: {
        user,
        pass,
      },

      tls: {
        rejectUnauthorized: false,
      },
    });
  }


  /*
  ========================================
  SEND EMAIL
  ========================================
  */

  async sendEmail(payload: SendEmailPayload) {
    try {
      const smtpUser =
        process.env.SMTP_USER ||
        process.env.GMAIL_USER;

      const from =
        payload.from ||
        process.env.EMAIL_FROM ||
        `Encoreats <${smtpUser}>`;

      console.log("");
      console.log("📧 Attempting to send email...");
      console.log("📬 To:", payload.to);
      console.log("📨 Subject:", payload.subject);
      console.log("📤 From:", from);

      const info =
        await this.transporter.sendMail({
          from,
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
        });

      console.log("✅ EMAIL SENT SUCCESSFULLY");
      console.log("📨 Message ID:", info.messageId);
      console.log(
        "📬 Accepted:",
        info.accepted
      );

      if (info.rejected.length > 0) {
        console.error(
          "❌ Rejected recipients:",
          info.rejected
        );

        throw new Error(
          `Email rejected: ${info.rejected.join(", ")}`
        );
      }

      return {
        success: true,
        id: info.messageId,
      };

    } catch (error: unknown) {

      console.error("");
      console.error("================================================");
      console.error("❌ SMTP EMAIL FAILED");
      console.error("================================================");

      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Unknown SMTP email error";

      /*
      IMPORTANT:
      Throw error instead of silently returning success:false.
      This allows your API route to detect the real problem.
      */

      throw new Error(message);
    }
  }
}


/*
========================================
RESEND PROVIDER
========================================
*/

export class ResendProvider implements EmailProvider {
  async sendEmail(payload: SendEmailPayload) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error(
        "RESEND_API_KEY is missing."
      );
    }

    try {
      const response = await fetch(
        "https://api.resend.com/emails",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            from:
              payload.from ||
              process.env.EMAIL_FROM ||
              "Encoreats <concierge@encoreats.com>",

            to: payload.to,

            subject: payload.subject,

            html: payload.html,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "❌ Resend API Error:",
          data
        );

        throw new Error(
          data.message ||
          "Resend API email sending failed."
        );
      }

      console.log(
        "✅ Resend email sent successfully:",
        data.id
      );

      return {
        success: true,
        id: data.id,
      };

    } catch (error: unknown) {

      console.error(
        "❌ Resend email error:",
        error
      );

      throw error;
    }
  }
}


/*
========================================
GET ACTIVE EMAIL PROVIDER
========================================
*/

export function getEmailProvider(): EmailProvider {
  const providerType = (
    process.env.EMAIL_PROVIDER || "logger"
  )
    .trim()
    .toLowerCase();

  console.log("");
  console.log("========================================");
  console.log("📧 ACTIVE EMAIL PROVIDER");
  console.log("========================================");
  console.log("EMAIL_PROVIDER =", providerType);
  console.log("========================================");

  switch (providerType) {

    case "smtp":
    case "gmail":
    case "nodemailer":

      console.log(
        "✅ Using Nodemailer SMTP Provider"
      );

      return new NodemailerProvider();


    case "resend":

      console.log(
        "✅ Using Resend Email Provider"
      );

      return new ResendProvider();


    case "logger":

      console.log(
        "⚠️ Using Logger Email Provider"
      );

      return new LoggerEmailProvider();


    default:

      console.warn(
        `⚠️ Unknown EMAIL_PROVIDER "${providerType}". Using Logger Provider.`
      );

      return new LoggerEmailProvider();
  }
}