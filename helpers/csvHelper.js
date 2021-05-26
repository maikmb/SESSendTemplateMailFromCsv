const csv = require('csv-parser');
const fs = require('fs');
const config = require('../config');

function readCSV(fileName) {
    const results = [];
    return new Promise(resolve => {
        fs.createReadStream(fileName)
            .pipe(csv({ separator: config.separator }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            });
    });
}

module.exports = { readCSV }