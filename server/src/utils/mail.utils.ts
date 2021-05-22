import { createTransport, SendMailOptions } from "nodemailer";

const {EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, MAIL_SENDER_ADDRESS, URL} = process.env;
const transport = createTransport({
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT!),
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    }
});

export const sendRegistrationEmail = async (toAddress: string, userId: number, token: string): Promise<boolean> => {
    const mailOptions: SendMailOptions = {
        from: {
            name: "Hi-Ku",
            address: MAIL_SENDER_ADDRESS!
        },
        to: toAddress,
        subject: "Your Hi-Ku registration",
        html: `
        Welcome to Hi-Ku! 
        Before you start your poems,
        please click on <a href=${`${URL}/app/auth/confirmRegistration/${userId}/${token}`}>this link</a>.
        `
    };

    try {
        await transport.sendMail(mailOptions);
        console.log(`Sent registration email to ${toAddress}`);
        return true;
    } catch (err) {
        console.error(`Error sending email to ${toAddress}: ${err.message}`);
        return false;
    }
};