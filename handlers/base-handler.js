const { sendTemplatedEmail } = require('../services/emailService');
const { validateEmail } = require('../helpers/emailHelper');
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
            } catch (error) {
                console.error('❌ [Error] Result::[' + emailAddress + ']', error.message);
            }
        }
    }
}

module.exports = BaseHandler;