const csv = require('csv-parser')
const fs = require('fs')
const AWS = require('aws-sdk');
const { startCase, toLower } = require('lodash');

async function run() {
    const mailingDataBase = await readCSV('Mailing_Fundos_One.csv');
    const templateName = 'VxCustomerExperienceInformesRendimentosOne';

    await testRenderTemplate({
        templateName: templateName,
        templateData: JSON.stringify({})
    });

    for (const customer of mailingDataBase) {
        try {
            const customerName = customer["﻿NomeInvestidor"];
            const customerEmail = customer['EmailInvestidor'];
            const firstName = customerName.split(" ").length > 0 ? startCase(toLower(customerName.split(" ")[0])) : customerName;

            const sendOutput = await sendTemplatedEmail({
                toEmailAddress: customerEmail,
                templateName: templateName,
                templateData: JSON.stringify({
                    name: firstName
                })
            });

            console.info('Success SendEmail::: ', sendOutput);
        } catch (error) {
            console.error('Error SendEmail::', error);
        }
    }

}

function testRenderTemplate({ templateName, templateData }) {
    const aws = GetSESClient();

    return testTemplate = aws
        .testRenderTemplate({ TemplateName: templateName, TemplateData: templateData })
        .promise()
        .then(result => console.log("TestRenderTemplate Success:", result))
        .catch(error => console.error("TestRenderTemplate Error:", error));
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
            Source: 'Time Vortx<time@vortx.com.br>',
            Template: templateName,
            TemplateData: templateData,
            ReplyToAddresses: [
                'frl@vortx.com.br'
            ]
        };

        aws.sendTemplatedEmail(params)
            .promise()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

function GetSESClient() {
    AWS.config.loadFromPath('./aws-key.json');
    const aws = new AWS.SES({ apiVersion: "2010-12-01" });
    return aws;
}

function readCSV(fileName) {
    const results = [];
    return new Promise(resolve => {
        fs.createReadStream(fileName)
            .pipe(csv({ separator: ';' }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            });
    });
}

run();