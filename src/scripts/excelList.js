const officegen = require('officegen');
const fs = require('fs');
const admin = require("firebase-admin");
const serviceAccount = require("./../config/firebase-key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
let xlsx = officegen('xlsx');
xlsx.on('finalize', function (written) {
    console.log('Finish to create a Excel document.');
});
xlsx.on('error', function (err) {
    console.log(err)
});

let sheet = xlsx.makeNewSheet();
sheet.name = 'Lista';
//LLENADO DE EXCEL
// sheet.data[0] = [];
// sheet.data[0][0] = 1;
// sheet.data[0][1] = 2;
// sheet.data[1] = [];
// sheet.data[1][3] = 'abc';
const generateExcel = async () => {
    const data = await db.collection('users').get();
    const assistance = {
        assist: [],
        noAssist: []
    };
    data.docs.forEach(doc => {
        if (doc.data().assist === true) {
            assistance.assist.push([doc.id, `${doc.data().first_name} ${doc.data().last_name}`]);
        } else {
            assistance.noAssist.push([doc.id, `${doc.data().first_name} ${doc.data().last_name}`]);
        }
    });

    sheet.data[0] = [];
    sheet.data[0][0] = 'Personas que donaron sangre:';

    let counter = 1, assisted = 0;
    assistance.assist.forEach((person, index) => {
        sheet.data[index + counter] = [];
        sheet.data[index + counter][0] = person[0];
        sheet.data[index + counter][1] = person[1];
        assisted++;
    });
    counter += assisted;
    sheet.data[counter] = [];
    sheet.data[counter][0] = 'Total: ' + assisted;
    counter += 2;
    sheet.data[counter] = [];
    sheet.data[counter][0] = 'Personas que se registraron pero no donaron:';
    counter++;
    assisted = 0;
    assistance.noAssist.forEach((person, index) => {
        sheet.data[index + counter] = [];
        sheet.data[index + counter][0] = person[0];
        sheet.data[index + counter][1] = person[1];
        assisted++;
    });
    counter += assisted;
    sheet.data[counter] = [];
    sheet.data[counter][0] = 'Total: ' + assisted;

    let out = fs.createWriteStream('./src/scripts/listaExcel.xlsx');
    xlsx.generate(out);
};
generateExcel();