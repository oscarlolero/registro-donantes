const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

//CONFIG DATES
// db.collection('dates').doc('availableHours').set({
//     '20 de septiembre': ['8:00 a.m.', '8:20 a.m.', '8:40 a.m.',
//             '9:00 a.m.', '9:20 a.m.', '9:40 a.m.',
//             '10:00 a.m.', '10:20 a.m.', '10:40 a.m.',
//             '11:00 a.m.', '11:20 a.m.', '11:40 a.m.',
//             '12:00 p.m.', '12:20 p.m.', '12:40 p.m.'],
//     '21 de septiembre': ['8:00 a.m.', '8:20 a.m.', '8:40 a.m.',
//             '9:00 a.m.', '9:20 a.m.', '9:40 a.m.',
//             '10:00 a.m.', '10:20 a.m.', '10:40 a.m.',
//             '11:00 a.m.', '11:20 a.m.', '11:40 a.m.',
//             '12:00 p.m.', '12:20 p.m.', '12:40 p.m.']
// });
// db.doc('dates/20 de septiembre').collection('8:00 a.m.').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20 de septiembre').collection('8:20 a.m.').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20 de septiembre').collection('8:40 a.m.').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20 de septiembre').collection('9:00 a.m.').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20 de septiembre').collection('9:20 a.m.').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20 de septiembre').collection('9:40 a.m.').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20 de septiembre').collection('10:00 a.m.').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20 de septiembre').collection('10:20 a.m.').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20 de septiembre').collection('10:40 a.m.').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20 de septiembre').collection('11:00 a.m.').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20 de septiembre').collection('11:20 a.m.').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20 de septiembre').collection('11:40 a.m.').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20 de septiembre').collection('12:00 p.m.').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20 de septiembre').collection('12:20 p.m.').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20 de septiembre').collection('12:40 p.m.').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20 de septiembre').set({exists: true});
module.exports = (app, passport) => {
    const usersCollection = db.collection('users');
    app.get('/registro', (req, res) => {
        db.collection('dates').doc('availableHours').get().then(doc => {
            // console.log(Object.keys(doc.data()));
            // console.log(Object.entries(doc.data())[1][1]);
            res.render('registro', {
                dates: doc.data()
            });
        });
    });
    app.post('/register', (req, res) => {
        console.log(req.body);
        try {
            const day = req.body.day;
            if (req.body.nua.length !== 6 || req.body.first_name.length <= 2) {
                return res.send('Invalid input');
            }
            const userDoc = usersCollection.doc(req.body.nua);
            userDoc.get().then(doc => {
                if (doc.exists) {
                    return Promise.reject('User already exists');
                }
            }).then(() => {
                return db.doc(`dates/${day}`).collection(req.body.hour).get().then(snap => {
                    return snap.size;
                });
            }).then((size) => {
                const dateRef = db.doc(`dates/${day}`);
                if (size >= 7) {
                    return Promise.reject('There are not more beds available for this hour.');
                } else if (size === 6) {
                    //En caso de llenarse las 6 camas, remover el horario de la lista
                    db.collection('dates').doc('availableHours').get().then(res => {
                        return res.data()[day].filter(value => {
                            return value !== req.body.hour;
                        });
                    }).then(newHoursList => {
                        db.collection('dates').doc('availableHours').update({
                            [day]: newHoursList
                        }).catch(error => {
                            console.error('Failed to update availableHours', error);
                        });
                    });
                }
                dateRef.collection(req.body.hour).doc(req.body.nua).set({additionalInfo: ''}).catch(error => {
                    console.error('Failed to update hour collection', error);
                });
                userDoc.set({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    date: day,
                    hour: req.body.hour,
                    career: req.body.career,
                    assist: false
                }).catch(error => {
                    console.error('Failed to update hour collection', error);
                });
            }).then(() => {
                res.send('Registered');
            }).catch(error => {
                res.send(error);
            })
        } catch (e) {
            console.error('CATCH:', e);
        }

    });
    app.get('/hours', (req, res) => {
        db.collection(`dates`).doc('availableHours').get().then(hoursList => {
            res.json(hoursList.data());
        });
    });
};