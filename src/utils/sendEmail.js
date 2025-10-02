const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: (process.env.SMTP_SECURE === 'true') || true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Send email with subject & html template
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.APP_NAME || 'BooklyStore'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };
