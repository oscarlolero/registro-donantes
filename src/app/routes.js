const axios = require('axios');

// const admin = require("firebase-admin");
//
// const serviceAccount = require("../config/firebase-key.json");
//
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://donantes-sangre.firebaseio.com"
// });
//
// const db = admin.database();
// const usersRef = db.ref('users/');

module.exports = (app, passport) => {

    app.post('/register', async (req, res) => {
        try {
            await axios.put(`https://donantes-sangre.firebaseio.com/users/${req.body.nua}.json`, {
                nua: req.body.nua,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: req.body.password
            });
        } catch (e) {
            res.send(e)
        }
    });

    // app.post('/register', async (req, res) => {
    //     usersRef.child('oscarlolero').set({
    //         nua: req.body.nua,
    //         first_name: req.body.first_name,
    //         last_name: req.body.last_name,
    //         email: req.body.email,
    //         password: req.body.password
    //     }).then(() => {
    //         res.send('done');
    //         console.log("added");
    //     });

    // try {
    //     await axios.put(`https://flutter-products-3e91e.firebaseio.com/users/${req.body.username}.json`, {
    //         username: req.body.username,
    //         password: req.body.password,
    //         isAdmin: false,
    //         bill: {
    //             adress: '',
    //             city: '',
    //             cp: '',
    //             email: '',
    //             first_name: '',
    //             last_name: '',
    //             phone: '',
    //             rfc: ''
    //         }
    //     });
    // } catch (e) {
    //     res.redirect('/login?mode=registerFAILED');
    // }
//     res.redirect('/login');
// }
// )
// ;
app.post('/login', (req, res) => {
    usersRef.has({
        nua: req.body.nua,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password
    });
});
}
;