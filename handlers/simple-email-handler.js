const BaseHandler = require("./base-handler");

class SimpleEmailHandler extends BaseHandler {
    constructor() {
        super();
    }

    async execute(dataSource) {

        console.log('ℹ Caregando modo de processamento unico')
        console.log(`ℹ Total de Registros: ${dataSource.length}`)

        await this.sendEmailForList(dataSource);
    }
}

module.exports = SimpleEmailHandler;