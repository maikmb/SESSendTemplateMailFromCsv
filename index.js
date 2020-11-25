const csv = require('csv-parser')
const fs = require('fs')
const AWS = require('aws-sdk');

async function run() {
    const mailingDataBase = await readCSV('Mailing_NPS');

    testRenderTemplate({
        templateName: 'VxCustomerExperienceInformativoNPS',
        templateData: JSON.stringify({
            nome: 'Maik'
        })
    });

    for (const customer of mailingDataBase) {
        try {
            const customerName = customer["﻿Nome"];
            const customerEmail = customer['Email'];

            const sendOutput = await sendTemplatedEmail({
                toEmailAddress: customerEmail,
                templateName: 'VxCustomerExperienceInformativoNPS',
                templateData: JSON.stringify({
                    nome: customerName
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

    const testTemplate = aws
        .testRenderTemplate({ TemplateName: templateName, TemplateData: templateData })
        .promise()
        .then(result => console.log("TestRenderTemplate Success:", result))
        .catch(error => console.error("TestRenderTemplate Error:", result));
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
            Source: 'Filippo Rovella<frl@vortx.com.br>',
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