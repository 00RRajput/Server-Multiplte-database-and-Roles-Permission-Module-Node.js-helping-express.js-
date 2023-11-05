const nodemailer = require('nodemailer');
const ejs = require('ejs');
const { IST } = require('./dateTime.helper');
const fs = require('fs/promises');
// const fileSystem = require('fs');
const pathModule = require('path');

let transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL, // generated mail user
        pass: process.env.MAIL_PASS, // generated mail password
    }
});


let mailData = {
    from: 'Coderootz Tech. PVT. LTD.',
    subject: 'Hello World',
    text: 'Test mail to check email transport !',
}

const generateHtml = (path, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let html = ejs.renderFile(pathModule.join(__dirname, path), { data });
            resolve(html);
        } catch (error) {
            reject(error);
        }
    })
}

/**
 * Send an email with a given template and data.
 * @param {Object} email - The email object containing data.
 * @param {string} email.to - The user to whome the email is being sent.
 * @param {string} email.subject - subject of the mail.
 * @param {string} email.text - text to be sent in mail.
 * @param {string} email.attachment - boolean that indicates that a attachment needs to be sent.
 * @param {string} [email.attachmentName] - The optional name of the attachment.
 * @param {string} [email.attachmentPath] - The optional attachment relative path.
 * @param {string} [email.imagePath] - The optional image's relative path.
 * @param {string} template - The template's relative path.
 * @returns {promise} - retuns a promise resolving into messageID or error
 */
const sendMail = (email, template='default') => {
    return new Promise(async (resolve, reject) => {
        try {
            mailData.to = email.to;
            mailData.subject = email.subject;
            mailData.html = await generateHtml(`../Template/email/${template}.ejs`, email);
            mailData.text = email.text || mailData?.text || 'Default mail text !'

            if (email?.attachment) {
                mailData.attachments = [
                    {
                        filename: `${IST()}.${email?.attachmentName || 'attachmentFile'}`,
                        path: `${email?.attachmentPath || 'https://fps-holisol.s3.ap-south-1.amazonaws.com/images/public/file-1687330792938-270817346.png'}`,
                    },
                    {
                        filename: "logo.png",
                        path: `${email?.imagePath || 'https://fps-holisol.s3.ap-south-1.amazonaws.com/images/public/file-1687330792938-270817346.png'}`,
                        cid: "logo_holisol",
                    },
                ]
            }

            let mail = await transporter.sendMail(mailData);
            resolve(mail.messageId);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

module.exports = {
    sendMail
}