const axios = require('axios');
const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

//CONFIG DATES
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
    const usersCollection = db.collection('users');
    app.post('/register', (req, res) => {
        try {
            usersCollection.doc(req.body.nua).set({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: req.body.password
            }).then(() => {
                const date = db.doc(`dates/${req.body.date}`).collection(${req.body.time}).doc(req.body.nua).set({additionalInfo: ''});

                console.log('User registered.');
                res.send('Registered')
            }).catch(error => {
                console.error('Error while registering user:', error);
            });
        } catch (error) {
            console.error('Error while registering user:', error);
        }

    });
    app.post('/login', (req, res) => {
        usersCollection.doc(req.body.nua).get().then(doc => {
            if(!doc.exists) {
                //el nua no existe
                console.log('user not found');
            } else if(doc.data().password === req.body.password) {
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
};