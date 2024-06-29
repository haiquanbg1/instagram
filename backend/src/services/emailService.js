const nodemailer = require('nodemailer');

const sendVerificationEmail = async (userEmail, token) => {
    const verificationUrl = `http://localhost:8080/verifyEmail?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Email Verification',
        html: `<h1>Email Verification</h1>
               <p>Click the link below to verify your email:</p>
               <a href="${verificationUrl}">Verify Email</a>`,
    };

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };