import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

function mailSender(email, title, body) {

    try {
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER, 
                pass: process.env.MAIL_PASS,
            }
        })

        let info = transporter.sendMail({
            from: 'StudyNotion || Mega Project by Neeraj Suman',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

        console.log("info: ", info);

        return info;

    } catch (error) {
        console.log(error.message);
    }
}

export default mailSender;