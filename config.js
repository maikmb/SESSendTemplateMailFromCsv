const config = {
    templateName: 'VxLoginUnicoReminderRegister',
    csvPath: 'data-loader/investidor_lote_1.csv',
    batchSize: 2,
    isParallel: true,
    source: 'Time Vortx<time@vortx.com.br>',
    replyToAddresses: [
        'meajuda@vortx.com.br'
    ]
}

module.exports = config;