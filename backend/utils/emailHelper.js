// /src/utils/emailService.js
const nodemailer = require('nodemailer');

/**
 * Configure Nodemailer with Brevo (Sendinblue) SMTP
 */
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER, // e.g., 778ab8001@smtp-brevo.com
    pass: process.env.EMAIL_PASS, // Brevo SMTP password
  },
});

/**
 * @param {Object} options         - Email options
 * @param {string} options.to      - Recipient email
 * @param {string} options.subject - Subject line
 * @param {string} options.text    - Plain text body
 * @param {string} [options.html]  - Optional HTML body
 */
async function sendEmail({ to, subject, text, html }) {
  try {
    await transporter.sendMail({
      from:"hashirkhan.tech@gmail.com", // Typically same as auth.user or a verified sender domain
      to,
      subject,
      text,
      ...(html && { html }), // If you want to send HTML
    });
    console.log(`Email sent via Brevo to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = { sendEmail };
