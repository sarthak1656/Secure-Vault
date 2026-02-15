import nodemailer from "nodemailer";

// If SMTP is not configured, fall back to console logging for development
const isSmtpConfigured = !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

let transporter = null;
if (isSmtpConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  console.warn("SMTP not fully configured — emails will be logged to console (development fallback)");
}

const FROM_EMAIL = process.env.FROM_EMAIL || process.env.SMTP_USER || "no-reply@localhost";

const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: FROM_EMAIL,
    to,
    subject,
    text,
    html,
  };

  if (!transporter) {
    // Development fallback — log the email contents so OTP can be used without SMTP
    console.log("[DEV EMAIL] To:", to);
    console.log("[DEV EMAIL] Subject:", subject);
    if (text) console.log("[DEV EMAIL] Text:", text);
    if (html) console.log("[DEV EMAIL] HTML:", html);
    return { accepted: [to], messageId: "dev-fallback" };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

export { sendEmail };
