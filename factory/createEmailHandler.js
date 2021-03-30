const ParallelEmailHandler = require("../handlers/parallel-email-handler");
const SimpleEmailHandler = require("../handlers/simple-email-handler");

function createEmailHandler(useParallel) {
    if(useParallel) return new ParallelEmailHandler();
    return new SimpleEmailHandler();
}

module.exports = { createEmailHandler }