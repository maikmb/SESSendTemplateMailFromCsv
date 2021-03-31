const config = {
    templateName: 'VxLoginUnicoReminderRegister',
    csvPath: 'data-loader/investidor_lote_1.csv',
    batchSize: 10,
    isParallel: true,
    source: 'Time Vortx<time@vortx.com.br>',
    replyToAddresses: [
        'meajuda@vortx.com.br'
    ]
}

module.exports = config;