const nodemailer = require("nodemailer");

let transporter = null;
let transporterKey = "";

const toBool = (value, fallback = false) => {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) {
    return fallback;
  }
  return ["1", "true", "yes", "on"].includes(raw);
};

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getMailConfig = () => {
  const host = String(process.env.SMTP_HOST || "").trim();
  const port = Number(process.env.SMTP_PORT || 0);
  const user = String(process.env.SMTP_USER || "").trim();
  // Google app passwords are often copied with spaces; normalize before SMTP auth.
  const pass = String(process.env.SMTP_PASS || "").replace(/\s+/g, "").trim();
  const from = String(process.env.MAIL_FROM || "").trim();
  const feedbackTo = String(process.env.FEEDBACK_TO_EMAIL || "").trim();
  const secure = toBool(process.env.SMTP_SECURE, port === 465);

  const missing = [];
  if (!host) missing.push("SMTP_HOST");
  if (!port) missing.push("SMTP_PORT");
  if (!user) missing.push("SMTP_USER");
  if (!pass) missing.push("SMTP_PASS");
  if (!from) missing.push("MAIL_FROM");
  if (!feedbackTo) missing.push("FEEDBACK_TO_EMAIL");

  return {
    host,
    port,
    user,
    pass,
    from,
    feedbackTo,
    secure,
    missing,
  };
};

const getTransporter = (config) => {
  const key = `${config.host}|${config.port}|${config.secure}|${config.user}`;
  if (transporter && transporterKey === key) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
  transporterKey = key;
  return transporter;
};

const sendFeedbackEmail = async ({
  fullName,
  email,
  phone,
  message,
  submittedAt,
  clientIp,
  userAgent,
}) => {
  const config = getMailConfig();
  if (config.missing.length > 0) {
    return { ok: false, missing: config.missing };
  }

  const submitted = submittedAt instanceof Date ? submittedAt : new Date();
  const subject = `New Feedback from ${fullName}`;
  const text = [
    "New feedback submission",
    "",
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Phone: ${phone || "-"}`,
    `Submitted At: ${submitted.toISOString()}`,
    `IP: ${clientIp || "-"}`,
    `User-Agent: ${userAgent || "-"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <h2>New Feedback Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone || "-")}</p>
    <p><strong>Submitted At:</strong> ${escapeHtml(submitted.toISOString())}</p>
    <p><strong>IP:</strong> ${escapeHtml(clientIp || "-")}</p>
    <p><strong>User-Agent:</strong> ${escapeHtml(userAgent || "-")}</p>
    <hr />
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
  `;

  const mailer = getTransporter(config);
  await mailer.sendMail({
    from: config.from,
    to: config.feedbackTo,
    replyTo: email,
    subject,
    text,
    html,
  });

  return { ok: true };
};

module.exports = {
  sendFeedbackEmail,
};
