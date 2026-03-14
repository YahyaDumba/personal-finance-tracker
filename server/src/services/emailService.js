const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email address',
      html: `<h2>Welcome!</h2><p>Click to verify: <a href="${verifyUrl}">Verify Email</a></p>`
    });
    console.log('EMAIL SENT:', JSON.stringify(result));
  } catch (err) {
    console.log('EMAIL ERROR:', err.message);
  }
};

module.exports = { sendVerificationEmail };