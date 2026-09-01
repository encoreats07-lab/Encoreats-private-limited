import {
  getEmailProvider,
  SendEmailPayload,
} from "./provider";

import { welcomeEmailTemplate } from "./templates/welcome";

import { emailVerificationTemplate } from "./templates/emailVerification";

import { passwordResetTemplate } from "./templates/passwordReset";

import {
  earlyAccessWelcomeTemplate,
  EarlyAccessWelcomeData,
} from "./templates/earlyAccessWelcome";

import { referralMilestoneTemplate } from "./templates/referralMilestone";

import {
  partnerApplicationReceivedTemplate,
  PartnerApplicationReceivedData,
} from "./templates/partnerApplicationReceived";

import { partnerApplicationApprovedTemplate } from "./templates/partnerApplicationApproved";

import { partnerApplicationRejectedTemplate } from "./templates/partnerApplicationRejected";

import {
  adminNotificationTemplate,
  AdminNotificationData,
} from "./templates/adminNotification";


/*
========================================
EXPORT EMAIL PROVIDER
========================================
*/

export * from "./provider";


/*
========================================
EXPORT EMAIL TEMPLATES
========================================
*/

export * from "./templates/welcome";

export * from "./templates/emailVerification";

export * from "./templates/passwordReset";

export * from "./templates/earlyAccessWelcome";

export * from "./templates/referralMilestone";

export * from "./templates/partnerApplicationReceived";

export * from "./templates/partnerApplicationApproved";

export * from "./templates/partnerApplicationRejected";

export * from "./templates/adminNotification";


/*
========================================
MAIN EMAIL FUNCTION
========================================
*/

export async function sendTransactionalEmail(
  payload: SendEmailPayload
) {
  try {
    const provider = getEmailProvider();

    console.log("📧 Sending email...");
    console.log("📬 To:", payload.to);
    console.log("📨 Subject:", payload.subject);

    const result = await provider.sendEmail(payload);

    console.log("✅ Email sent successfully!");

    return result;

  } catch (error) {

    console.error("❌ Email sending failed:", error);

    throw error;
  }
}


/*
========================================
WELCOME EMAIL
========================================
*/

export async function sendWelcomeEmail(
  name: string,
  email: string,
  dashboardUrl: string
) {

  const template = welcomeEmailTemplate(
    name,
    dashboardUrl
  );

  return sendTransactionalEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });

}


/*
========================================
EMAIL VERIFICATION
========================================
*/

export async function sendEmailVerification(
  name: string,
  email: string,
  verifyUrl: string
) {

  const template = emailVerificationTemplate(
    name,
    verifyUrl
  );

  return sendTransactionalEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });

}


/*
========================================
PASSWORD RESET EMAIL
========================================
*/

export async function sendPasswordResetEmail(
  name: string,
  email: string,
  resetUrl: string
) {

  const template = passwordResetTemplate(
    name,
    resetUrl
  );

  return sendTransactionalEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });

}


/*
========================================
EARLY ACCESS WELCOME EMAIL
========================================
*/

export async function sendEarlyAccessWelcomeEmail(
  data: EarlyAccessWelcomeData
) {

  const html = earlyAccessWelcomeTemplate(data);

  return sendTransactionalEmail({
    to: data.email,

    subject:
      "Welcome to Encoreats — Early Access Pass",

    html,
  });

}


/*
========================================
REFERRAL MILESTONE EMAIL
========================================
*/

export async function sendReferralMilestoneEmail(
  name: string,
  email: string,
  tierName: string,
  totalReferrals: number,
  perks: string[]
) {

  const template = referralMilestoneTemplate(
    name,
    tierName,
    totalReferrals,
    perks
  );

  return sendTransactionalEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });

}


/*
========================================
PARTNER APPLICATION RECEIVED
========================================
*/

export async function sendPartnerApplicationReceivedEmail(
  data: PartnerApplicationReceivedData
) {

  const html =
    partnerApplicationReceivedTemplate(data);

  return sendTransactionalEmail({

    // IMPORTANT: EMAIL ADDRESS
    to: data.email,

    subject:
      `Encoreats Application Received — ${data.partnerType} Atelier`,

    html,
  });

}


/*
========================================
PARTNER APPLICATION APPROVED
========================================
*/

export async function sendPartnerApplicationApprovedEmail(
  name: string,
  email: string,
  type: string
) {

  const template =
    partnerApplicationApprovedTemplate(
      name,
      type
    );

  return sendTransactionalEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });

}


/*
========================================
PARTNER APPLICATION REJECTED
========================================
*/

export async function sendPartnerApplicationRejectedEmail(
  name: string,
  email: string,
  type: string
) {

  const template =
    partnerApplicationRejectedTemplate(
      name,
      type
    );

  return sendTransactionalEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });

}


/*
========================================
ADMIN NOTIFICATION EMAIL
========================================
*/

export async function sendAdminNotificationEmail(
  adminEmail: string,
  data: AdminNotificationData
) {

  const html =
    adminNotificationTemplate(data);

  return sendTransactionalEmail({

    to: adminEmail,

    subject:
      `[Encoreats Admin] ${data.title}`,

    html,
  });

}