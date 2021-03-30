const BaseHandler = require("./base-handler");

class SimpleEmailHandler extends BaseHandler {
    constructor() {
        super();
    }

    async execute(dataSource) {
        await this.sendEmailForList(dataSource);
    }
}

module.exports = SimpleEmailHandler;