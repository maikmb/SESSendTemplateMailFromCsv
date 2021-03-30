const { chunk } = require("lodash");
const BaseHandler = require("./base-handler");
const config = require("../config");

class ParallelEmailHandler extends BaseHandler {
    constructor() {
        super();
    }

    async execute(dataSource) {
        const chunckedSource = chunk(dataSource, config.chunkSize);
        const tasks = [];
    
        for (const chunkedItem of chunckedSource) {
            tasks.push(this.sendEmailForList(chunkedItem));
        }
    
        await Promise.all(tasks);
    }
}

module.exports = ParallelEmailHandler;