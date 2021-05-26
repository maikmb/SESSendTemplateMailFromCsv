const { sendTemplatedEmail, sendEmailWithAttachments } = require('../services/emailService');
const { validateEmail } = require('../helpers/emailHelper');
const { sendEmailEmitter } = require("../events/SendMailEvent");
const { renderTemplate } = require('../services/templatesService');
var logger = require("../services/loggerService").Logger;

class BaseHandler {
    constructor() {
    }

    async sendEmailForList(dataSource) {

        const template = await renderTemplate({ templateName: "VxOneEarningsReportLastDays" });

        for (const dataRow of dataSource) {
            // const emailAddress = dataRow["email"];
            const emailAddress = "maikmb@gmail.com"
            const document = dataRow["document"];
            const urlEarningsReport = dataRow["urlEarningsReport"];

            if (!document) continue

            try {
                if (!validateEmail(emailAddress)) continue;

                const sendOutput = await sendEmailWithAttachments({
                    html: template.html,
                    subject: template.subject,
                    to: emailAddress,
                    attachments: [{
                        filename: "Informe Rendimento 2020.pdf",
                        href: urlEarningsReport
                    }]
                });

                // const sendOutput = await sendTemplatedEmail({
                //     toEmailAddress: emailAddress,
                //     templateName: config.templateName,
                //     templateData: JSON.stringify({
                //         urlEarningsReport: dataRow["urlEarningsReport"]
                //     })
                // });

                console.info('✔ [Success] Result::[' + emailAddress + ']', sendOutput);
                logger.info('✔ [Success] Result::[' + emailAddress + ']');

            } catch (error) {
                console.error('❌ [Error] Result::[' + emailAddress + ']', error.message);
                logger.error('❌ [Error] Result::[' + emailAddress + '] - Details: ' + error.message);
            }
            finally {
                sendEmailEmitter.emit('send');
            }
        }
    }


}

module.exports = BaseHandler;