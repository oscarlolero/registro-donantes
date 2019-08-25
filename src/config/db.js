const admin = require("firebase-admin");
const serviceAccount = require("./firebase-key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
exports.db = admin.firestore();
exports.FieldValue = admin.firestore.FieldValue;
const db = admin.firestore();

//Crear registros en base de datos
//CONFIG DATES
exports.cleanAndPopulateDB = () => {
    db.collection('dates').doc('availableHours').set({
        '20 de septiembre': ['8:00 a.m.', '8:20 a.m.', '8:40 a.m.',
            '9:00 a.m.', '9:20 a.m.', '9:40 a.m.',
            '10:00 a.m.', '10:20 a.m.', '10:40 a.m.',
            '11:00 a.m.', '11:20 a.m.', '11:40 a.m.',
            '12:00 p.m.', '12:20 p.m.', '12:40 p.m.'],
        '21 de septiembre': ['8:00 a.m.', '8:20 a.m.', '8:40 a.m.',
            '9:00 a.m.', '9:20 a.m.', '9:40 a.m.',
            '10:00 a.m.', '10:20 a.m.', '10:40 a.m.',
            '11:00 a.m.', '11:20 a.m.', '11:40 a.m.',
            '12:00 p.m.', '12:20 p.m.', '12:40 p.m.']
    });
    db.collection('stats').doc('dbStats').set({
       usersRegistered: 0
    });
    db.doc('dates/20 de septiembre').collection('8:00 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/20 de septiembre').collection('8:20 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/20 de septiembre').collection('8:40 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/20 de septiembre').collection('9:00 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/20 de septiembre').collection('9:20 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/20 de septiembre').collection('9:40 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/20 de septiembre').collection('10:00 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/20 de septiembre').collection('10:20 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/20 de septiembre').collection('10:40 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/20 de septiembre').collection('11:00 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/20 de septiembre').collection('11:20 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/20 de septiembre').collection('11:40 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/20 de septiembre').collection('12:00 p.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/20 de septiembre').collection('12:20 p.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/20 de septiembre').collection('12:40 p.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/20 de septiembre').set({exists: true});
    //21 DE SEPTIEMBRE
    db.doc('dates/21 de septiembre').collection('8:00 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/21 de septiembre').collection('8:21 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/21 de septiembre').collection('8:40 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/21 de septiembre').collection('9:00 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/21 de septiembre').collection('9:21 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/21 de septiembre').collection('9:40 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/21 de septiembre').collection('10:00 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/21 de septiembre').collection('10:21 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/21 de septiembre').collection('10:40 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/21 de septiembre').collection('11:00 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/21 de septiembre').collection('11:21 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/21 de septiembre').collection('11:40 a.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/21 de septiembre').collection('12:00 p.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/21 de septiembre').collection('12:21 p.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/21 de septiembre').collection('12:40 p.m.').doc('additionalInfo').set({additionalInfo: ''});
    db.doc('dates/21 de septiembre').set({exists: true});
};