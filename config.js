const config = {
    templateName: 'VxOneEarningsReportLastDays',
    csvPath: 'data-loader/5 mil da base 2.csv',
    batchSize: 15,
    separator: ';',
    isParallel: true,
    source: 'Time Vortx<noreply@vortx.com.br>',
    replyToAddresses: [
        'try@vortx.com.br'
    ]
}

module.exports = config;