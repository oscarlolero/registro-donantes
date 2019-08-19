const axios = require('axios');
const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

module.exports = (app, passport) => {
    let usersCollection = db.collection('users');
    app.post('/register', async (req, res) => {
        try {
            usersCollection.doc(req.body.nua).set({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: req.body.password
            }).then(() => {
                console.log('User registered.');
                res.send('Registered')
            }).catch((error) => {
                console.error('Error while registering user:', error);
            });
        } catch (error) {
            console.error('Error while registering user:', error);
        }

    });
    app.post('/login', (req, res) => {

    });
};