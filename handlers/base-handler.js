const { sendTemplatedEmail } = require('../services/emailService');
const { validateEmail } = require('../helpers/emailHelper');
var logger = require("../services/loggerService").Logger;
const config = require('../config');


class BaseHandler {
    constructor() {
    }

    async sendEmailForList(dataSource) {
        for (const dataRow of dataSource) {
            const emailAddress = dataRow["email"];            
            try {

                if (!validateEmail(emailAddress)) continue;
                const sendOutput = await sendTemplatedEmail({
                    toEmailAddress: emailAddress,
                    templateName: config.templateName,
                    templateData: JSON.stringify({
                    })
                });

                console.info('✔ [Success] Result::[' + emailAddress + ']', sendOutput);
                logger.info('✔ [Success] Result::[' + emailAddress + ']');

            } catch (error) {
                console.error('❌ [Error] Result::[' + emailAddress + ']', error.message);
                logger.error('❌ [Error] Result::[' + emailAddress + '] - Details: ' + error.message);
            }
        }
    }
}

module.exports = BaseHandler;