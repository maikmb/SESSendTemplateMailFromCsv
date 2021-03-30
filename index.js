const { createEmailHandler } = require('./factory/createEmailHandler')
const config = require('./config');
const { readCSV } = require('./helpers/csvHelper');

async function run(isParallel) {
    const dataSource = await readCSV(config.csvPath);    
    const emailHandler = createEmailHandler(isParallel);
    await emailHandler.execute(dataSource);

    console.log('🔥 Send emails executed with success');
}

try {
    
    const isParallel = config.isParallel;
    run(isParallel);

} catch (error) {
    console.log(error);
}
