const AWS = require('aws-sdk');
const config = require('../config')
const nodemailer = require("nodemailer");

async function sendEmailWithAttachments({ html, text, subject, to, attachments }) {

    let transporter = nodemailer.createTransport({
        SES: new AWS.SES({ region: 'us-east-1', apiVersion: "2010-12-01" })
    });

    // send mail with defined transport object
    let response = await transporter.sendMail({
        from: config.source,
        to: to,
        subject: subject,
        html: html,
        text: text,
        attachments: attachments,
        replyTo: config.replyToAddresses[0]
    });

    return response;
}

function sendTemplatedEmail({ toEmailAddress, templateName, templateData }) {
    return new Promise((resolve, reject) => {
        const aws = GetSESClient();

        const params = {
            Destination: {
                ToAddresses: [
                    toEmailAddress
                ]
            },
            Source: config.source,
            Template: templateName,
            TemplateData: templateData,
            ReplyToAddresses: config.replyToAddresses
        };

        aws.sendTemplatedEmail(params)
            .promise()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

function testRenderTemplate({ templateName, templateData }) {
    const aws = GetSESClient();

    return testTemplate = aws
        .testRenderTemplate({ TemplateName: templateName, TemplateData: templateData })
        .promise()
        .then(result => console.log("TestRenderTemplate Success:", result))
        .catch(error => console.error("TestRenderTemplate Error:", error));
}

function GetSESClient() {
    AWS.config.loadFromPath('./aws-key.json');
    const aws = new AWS.SES({ apiVersion: "2010-12-01" });
    return aws;
}

function GetS3Client() {
    AWS.config.loadFromPath('./aws-key.json');
    const aws = new AWS.SES({ apiVersion: "2010-12-01" });
    return aws;
}

module.exports = { sendTemplatedEmail, sendEmailWithAttachments }