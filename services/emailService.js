const fs = require('fs')
const AWS = require('aws-sdk');
const { startCase, toLower, isEmpty, chunk, uniqueId, isNull } = require('lodash');
const axios = require('axios').default
const s3Client = require('../aws/s3Client');

function sendTemplatedEmail({ toEmailAddress, templateName, templateData }) {
    return new Promise((resolve, reject) => {        
        const aws = GetSESClient();

        const params = {
            Destination: {
                ToAddresses: [
                    toEmailAddress
                ]
            },
            Source: 'Time Vortx<time@vortx.com.br>',
            Template: templateName,
            TemplateData: templateData,
            ReplyToAddresses: [
                'middlefundos@vortx.com.br'
            ]
        };

        aws.sendTemplatedEmail(params)
            .promise()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

function getFirstLetter(customerName) {
    const firstName = customerName.split(" ").length > 0 ? startCase(toLower(customerName.split(" ")[0])) : customerName;
    return firstName;
}

function normalizeEmailAddress(emailAddress) {
    const customerEmail = emailAddress.substring(emailAddress.indexOf('<')).replace(/<|>/g, '');
    return customerEmail;
}

// function getEarningsReportUrl(customerDocument) {
//     const urlEarningsReport = await getUrlEarningsReport(customerDocument);
//     if(!urlEarningsReport) throw new Error("Investor without earnings report:" + customerDocument);
//     const s3 = new s3Client();
//     const presignedUrl = await s3.assinarUrlObjeto(urlEarningsReport);
// }

function onlyNumbers(text) {
    return text.replace(/\D+/g, '');
}

async function getUrlEarningsReport(investorDocument) {
    var options = {
        headers: {
            'apikey': '147e2a542d3925ed14d5f59d7939d6233e05a1932ff44f35b86b7522c309f2ab',
            'system': 'ApiVxInforma'
        }
    };

    return await axios
        .get(`https://ms-escrituracao.vortx.com.br/api/earnings-report/all-investor-earnings-report?ReferenceYear=2020&InvestorDocument=${investorDocument}`, options)
        .then(resp => resp.data.link)
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

module.exports = { sendTemplatedEmail }