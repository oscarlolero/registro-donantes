const axios = require('axios');
const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

//CONFIG DATES
// db.doc('dates/20septiembre').set({
//    availableHours: ['8:00 a.m.', '8:20 a.m.', '8:40 a.m.', '9:00 a.m.', '9:20 a.m.', '9:40 a.m.',
//        '10:00 a.m.', '10:20 a.m.', '10:40 a.m.',
//        '11:00 a.m.', '11:20 a.m.', '11:40 a.m.'],
//     name: '20 de septiembre'
// });
// db.doc('dates/20septiembre').collection('8:00').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20septiembre').collection('8:20').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20septiembre').collection('8:40').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20septiembre').collection('9:00').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20septiembre').collection('9:20').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20septiembre').collection('9:40').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20septiembre').collection('10:00').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20septiembre').collection('10:20').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20septiembre').collection('10:40').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20septiembre').collection('11:00').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20septiembre').collection('11:20').doc('additionalInfo').set({additionalInfo: ''});
// db.doc('dates/20septiembre').collection('11:40').doc('additionalInfo').set({additionalInfo: ''});

module.exports = (app, passport) => {
    //agregar validaciones
    const usersCollection = db.collection('users');
    app.post('/register', (req, res) => {
        if (req.body.nua.length !== 6 || req.body.first_name.length <= 2) {
            return res.send('Invalid input');
        }
        try {
            const userDoc = usersCollection.doc(req.body.nua);
            userDoc.get().then(doc => {
                if (doc.exists) {
                    return Promise.reject('User already exists');
                }
            }).then(() => {
                return db.doc(`dates/${req.body.date}`).collection(req.body.time).get().then(snap => {
                    return snap.size;
                });
            }).then((size) => {
                const dateRef = db.doc(`/dates/${req.body.date}`);
                if (size >= 7) {
                    return Promise.reject('There are not more beds available for this hour.');
                } else if (size === 6) {
                    //En caso de llenarse las 6 camas, remover el horario de la lista
                    dateRef.get().then(res => {
                        return res.data().availableHours.filter(value => {
                            return value !== req.body.time;
                        });

                    }).then(newHoursList => {
                        dateRef.update({
                            availableHours: newHoursList
                        }).catch(error => {
                            console.error('Failed to update availableHours', error);
                        });
                    });
                }
                dateRef.collection(req.body.time).doc(req.body.nua).set({additionalInfo: ''}).catch(error => {
                    console.error('Failed to update hour collection', error);
                });
                userDoc.set({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    date: req.body.date,
                    hour: req.body.time,
                    career: req.body.career
                }).catch(error => {
                    console.error('Failed to update hour collection', error);
                });
            }).then(() => {
                console.log('User registered.');
                res.send('Registered')
            }).catch(error => {
                res.send(error);
            })
        } catch (error) {
            console.error('Error while registering user:', error);
        }
    });
    app.post('/login', (req, res) => {
        usersCollection.doc(req.body.nua).get().then(doc => {
            if (!doc.exists) {
                //el nua no existe
                console.log('user not found');
            } else if (doc.data().password === req.body.password) {
                //login correcto
                console.log(doc.data());
            } else {
                //pass incorrecta
                res.send('incorrect pass');
            }
        }).catch(error => {
            console.error('Error getting document', error);
        });
    });

    app.get('/days', (req, res) => {
        db.collection('dates').get().then(snap => {
            const datesList = snap.docs.map(doc => {
                return doc.data().name;
            });
            res.json(datesList);
        });
    });

    app.post('/hours', (req, res) => {
        db.doc(`dates/${req.body.day}`).get().then(hoursList => {
            res.json(hoursList.data().availableHours);
        });
    });
};