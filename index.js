const { createEmailHandler } = require('./factory/createEmailHandler')
const config = require('./config');
const { readCSV } = require('./helpers/csvHelper');
const EscrituracaoService = require("./services/escrituracaoService");
const polly = require("polly-js");
const { chunk, flatten, take } = require('lodash');
const clc = require('cli-color');
const fs = require('fs');
const { default: axios } = require('axios');
var logger = require("./services/loggerService").Logger;


const validators = {
    forbiden: (err) => {
        return err instanceof Object && err.response && err.response.status === 403
    },
    timeOut: (err) => {
        return err instanceof Object && err.message.includes('ETIMEDOUT')
    },
    pdfSize: (err) => {
        return err instanceof Error && err.message === 'Empty PDF'
    }
}

async function investorGetEarningsReport(dataSource) {

    for (let index = 0; index < dataSource.length; index++) {
        const iterator = dataSource[index];

        const document = iterator["document"];
        if (!document) continue

        console.log(clc.greenBright('Get earnings for investor: '), document)

        try {

            await polly()
                .handle(function (err) {
                    console.log(clc.bgBlue('Try again...'))
                    return [validators.forbiden, validators.timeOut, validators.pdfSize]
                        .map(fn => fn(err))
                        .includes(true)
                })
                .waitAndRetry(1000)
                .executeForPromise(async function () {
                    console.log('Try investor: ', document)
                    const escrituracaoService = new EscrituracaoService();
                    const urlEarningsReport = await escrituracaoService
                        .getInvestorEarningsReport(document);

                    console.log(`${index}/${dataSource.length} Earnings received`, urlEarningsReport);
                    logger.info(`${index}/${dataSource.length} Earnings received: ${urlEarningsReport}`);

                    const pdfContent = await axios.get(urlEarningsReport);

                    if (Number.parseFloat(pdfContent.headers['content-length']) < 100 * 1024){
                        console.log(clc.bgRed('Try again...'))
                        throw new Error('Empty PDF')
                    }
                    
                    iterator.urlEarningsReport = urlEarningsReport;
                });

        } catch (error) {
            if (error && error.message.includes("Investor without earnings report")) {
                console.log(clc.bgYellow(error))
                continue
            }
            console.error(clc.bgRed("Execution error"), error)
        }
    }

    return dataSource;
}

async function processAllEarnings(dataSource) {
    const chunkSize = dataSource.length / 10;
    const chunckedSource = chunk(dataSource, chunkSize);
    const tasks = [];

    for (let index = 0; index < chunckedSource.length; index++) {
        const source = chunckedSource[index];
        tasks.push(investorGetEarningsReport(source));
    }

    const earnings = await Promise.all(tasks);
    return flatten(earnings);
}

async function run(isParallel) {

    console.log(`🔺 DataBase Path: ${config.csvPath}`);
    const dataSource = await readCSV(config.csvPath);

    console.log(`🔺 Total records: ${dataSource.length}`);

    // const flatDataSouce = await investorGetEarningsReport(dataSource);
    const flatDataSouce = await processAllEarnings(dataSource);
    const emailHandler = createEmailHandler(isParallel);
    await emailHandler.execute(flatDataSouce);

    console.log('🔥 Send emails executed with success');
}

try {
    const isParallel = config.isParallel;
    run(isParallel);

} catch (error) {
    console.log(error);
}