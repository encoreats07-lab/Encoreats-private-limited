export * from "./email/index";

import { sendTransactionalEmail } from "./email/index";

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  return sendTransactionalEmail({ to, subject, html });
};

export default sendEmail;