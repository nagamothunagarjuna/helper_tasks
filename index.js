const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');

const currDir = path.join(__dirname + '\\csv_files\\');

const readdir = (dirname) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dirname, (error, filenames) => {
            if (error) {
                reject(error);
            } else {
                resolve(filenames);
            }
        });
    });
};

const filtercsvFiles = (filename) => {
    return filename.split('.')[1] === 'csv';
};

function cleanCSVData(data) {
    for (let i in data) {
        let col_names = Object.keys(data[i]);
        for (var c in col_names) {
            if (data[i][col_names[c]] === "") delete data[i][col_names[c]];
        }
    }
    return data;
}

async function getCSVData(file) {
    const csvData = await csv().fromFile(file);
    const total = cleanCSVData(csvData);
    for (let i in total) {
        if (total[i].hasOwnProperty('tables')) {
            let table_names = total[i].tables.split(",");
            delete total[i].tables;
            for (var t in table_names) {
                let table_name = table_names[t];
                let condition = '';
                let col_names = Object.keys(total[i]);
                for (var c in col_names) {
                    condition += `${col_names[c]} = ${total[i][col_names[c]]}`
                    if (c != col_names.length - 1) { condition += " and " }
                }
                console.log(`Table Name: ${table_name}, Condition: ${condition}`);
            }
        } else {
            console.log('No table Given')
        }
    }
}

readdir(currDir)
    .then((filenames) => {
        filenames = filenames.filter(filtercsvFiles);
        filenames.forEach(file => getCSVData(currDir + '\\' + file));
    });