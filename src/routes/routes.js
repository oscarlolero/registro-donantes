const dbConfig = require('../config/db');
const mail = require('../config/mail');
const db = dbConfig.db;
//dbConfig.cleanAndPopulateDB();

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
            if (req.body.nua.length !== 6) {
                req.flash('registerMsg', 'NUA inválido, deben de ser 6 digitos.');
                return res.redirect('/registro');
            } else if(req.body.first_name.length < 3 || req.body.last_name.length < 3) {
                req.flash('registerMsg', 'El nombre y apellido deben contener al menos 3 letras.');
                return res.redirect('/registro');
            } else if(req.body.career === '0') {
                req.flash('registerMsg', 'Selecciona una carrera.');
                return res.redirect('/registro');
            } else if(req.body.email < 4) {
                req.flash('registerMsg', 'Correo inválido.');
                return res.redirect('/registro');
            } else if(req.body.day === '0') {
                req.flash('registerMsg', 'Selecciona un día.');
                return res.redirect('/registro');
            } else if(req.body.hour === '0') {
                req.flash('registerMsg', 'Selecciona un horario.');
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
            let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            await userDoc.set({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                date: day,
                hour: req.body.hour,
                career: req.body.career,
                ip: typeof ip.split(':')[3] === 'undefined' ? ip : ip.split(':')[3],
                assist: false
            });
        } catch (e) {
            req.flash('registerMsg', 'Hubo un error interno con el servidor.');
            res.redirect('registrado');
            console.error('CATCH:', e);
        }
        await mail.sendEmail(req.body.email,req.body.first_name,req.body.nua, `${req.body.day} a las ${req.body.hour}`);
        await db.collection('stats').doc('dbStats').update({
            'usersRegistered': dbConfig.FieldValue.increment(1)
        });
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

    app.get('/getassistance', async (req, res) => {
        const assistanceList = await dbConfig.getAssistace();
        //res.send(assistanceList);
        let text = 'Asistieron: \n\r';
        assistanceList.assist.forEach(user => {
            text = text.concat(`\t${user}\n\r`)
        });
        text = text.concat('No han asistido o no asistieron: \n\r');
        assistanceList.noAssist.forEach(user => {
            text = text.concat(`\t${user}\n\r`)
        });
        res.send(text);
    });

    app.get('/generatepdf', async (req, res) => {
        const assistanceList = await dbConfig.getAssistace();
        //res.send(assistanceList);
        let text = 'Personas que se registraron al evento de donación en DICIS el 3 y 4 de septiembre del 2019: \n\r';
        let total = 0;
        assistanceList.assist.forEach(user => {
            text = text.concat(`\t${user}\n\r`)
            total++;
        });
        assistanceList.noAssist.forEach(user => {
            text = text.concat(`\t${user}\n\r`)
            total++;
        });
        text = text.concat(`Total: ${total}`);
        res.send(text);
    });

    app.get('/generateexcel', async (req, res) => {
        const assistanceList = await dbConfig.getAssistace();
        //res.send(assistanceList);
        let text = 'Personas que se registraron al evento de donación en DICIS el 3 y 4 de septiembre del 2019: \n\r';
        let total = 0;
        assistanceList.assist.forEach(user => {
            text = text.concat(`\t${user}\n\r`)
            total++;
        });
        assistanceList.noAssist.forEach(user => {
            text = text.concat(`\t${user}\n\r`)
            total++;
        });
        text = text.concat(`Total: ${total}`);
        res.send(text);
    });
};