import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "Hotmail",
    auth: {
        secure: false,
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

export default transporter;