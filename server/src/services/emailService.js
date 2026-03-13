const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (verifyEmail, token) => {
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    await resend.emails.send({
        from: 'Finance Tracker <onboarding@resend.dev>',
        to: email,
        subject: 'Verify your email address',
        html: `
            <div style = 'font-family: Arial, sans-serif; max-width; 600px; margin: 0 auto;">
            <h2 style='color: #3b82f6;'>Welcome to Personal Finance Tracker<h2>
            <p>Thankyou for registering. Please verify your email to proceed by clicking the button below</p>
            <a href = "${verifyUrl}"
                style='background: #3b82f6; color: white; padding:12px 24px; border-readius:6px; text-decoration:none;display:inline-block; margin:16px 0;'>
                Verify Email
            </a>
            <p> This link expires in 24 hours</p>
            <p> If you didn't created this account, ignore this email</p>
            </div>
        `
    })
}

module.exports  = {sendVerificationEmail};