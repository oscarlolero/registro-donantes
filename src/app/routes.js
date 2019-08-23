const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase-key.json");
const config = require('../config/config');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
//config.cleanAndPopulateDB(db);
module.exports = (app) => {
    //Páginas
    app.get('/registro', (req, res) => {
        res.render('registro', {
            registerMsg: req.flash('registerMsg')
        });
    });
    app.get('/registrado', async (req, res) => {
        const NUA = req.query.nua;
        const userData = await db.doc(`users/${NUA}`).get();
            if(userData.exists) {
                res.render('registrado', {
                    data: userData.data(),
                    NUA
                });
            } else {
                return res.redirect('registro');
            }

    });
    //Validaciones y registros
    app.post('/register', async (req, res) => {
        try {
            let data;
            const day = req.body.day;
            const userDoc = db.collection('users').doc(req.body.nua);
            //Verificar que las entradas son válidas
            if (req.body.nua.length !== 6 || req.body.first_name.length < 3 || req.body.last_name.length < 3
                || req.body.email < 4 || req.body.hour === 0 || req.body.day === 0 || typeof req.body.hour === 'undefined') {
                req.flash('registerMsg', 'Verifica que has ingresado todos los datos de manera correcta.');
                return res.redirect('/registro');
            }
            //Checar si el NUA existe
            data = await userDoc.get();
            if(data.exists) {
                req.flash('registerMsg', 'Este NUA ya está registrado.');
                return res.redirect('/registro');
            }
            //Chcar los lugares disponibles
            data = await db.doc(`dates/${day}`).collection(req.body.hour).get();
            if(data.size >= 7) {
                req.flash('registerMsg', 'Se llenó el horario que escogiste.');
                return res.redirect('/registro');
            } else if(data.size === 6) {
                //En caso de llenarse las 6 camas, remover el horario de la lista
                const hoursData = await db.collection('dates').doc('availableHours').get();
                const newHoursList = hoursData.data()[day].filter(value => {
                    return value !== req.body.hour;
                });
                await db.collection('dates').doc('availableHours').update({
                    [day]: newHoursList
                });
            }
            //Registrar el NUA en la colección de su horario
            db.doc(`dates/${day}`).collection(req.body.hour).doc(req.body.nua).set({additionalInfo: ''});
            await userDoc.set({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                date: day,
                hour: req.body.hour,
                career: req.body.career,
                assist: false
            });
        } catch (e) {
            req.flash('registerMsg', 'Hubo un error interno con el servidor.');
            res.redirect('registrado');
            console.error('CATCH:', e);
        }
        res.redirect(`registrado?nua=${req.body.nua}`);
    });

    //Consultas
    app.get('/hours', (req, res) => {
        db.collection(`dates`).doc('availableHours').get().then(hoursList => {
            res.json(hoursList.data());
        });
    });
    app.get('/days', (req, res) => {
        db.collection('dates').doc('availableHours').get().then(doc => {
            res.json(doc.data());
        });
    });
};