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
module.exports = (app) => {
    //Páginas
    app.get('/registro', (req, res) => {
        res.render('registro', {
            registerMsg: req.flash('registerMsg')
        });
    });
    app.get('/registrado', async (req, res) => {
        console.log(typeof req.flash('registerMsg'), req.flash('registerMsg'));
        const userData = await db.doc(`users/${req.flash('registerMsg')}`).get();
        res.render('registrado', {
            data: userData.data()
        });
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
            console.log(typeof  req.body.nua, req.body.nua);
            req.flash('registerMsg', req.body.nua);
            res.redirect('registrado');


        } catch (e) {
            req.flash('registerMsg', 'Hubo un error interno con el servidor.');
            res.render('registro', {
                message: req.flash('registerMsg')
            });
            console.error('CATCH:', e);
        }
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