
const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "wdcproject.nodemailer@gmail.com",
        pass: "tscatlljpsqzyalu"
    }
});



const sendMail = async (to, subject, html_body) => {

    const mailOptions = {
        from: "Adelaide Uni Clubs",
        to: to,
        subject: subject,
        html: html_body
    };

    return transporter.sendMail(mailOptions);
};



module.exports = { sendMail };
