const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

const APIKey = require('./sendgrid-key');
const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
        user: "apikey",
        pass: APIKey.sendGridAPIKey
    }
});

exports.sendEmail = async (recipient, alias, NUA, date) => {
    const QRCode64 = await QRCode.toDataURL(NUA);
    const message = {
        from: 'no-responder@ugto.mx', // Sender address
        to: recipient,         // List of recipients
        subject: 'Confirmación de tu cita', // Subject line
        html: `¡Hola ${alias}!, tu cita quedó agendada para el <b>${date}</b>.<br>Recuerda mostrar el siguiente código QR a la hora de presentarte y terminar tu cita: <br><img style=display:block; width:180px;height:180px; src="${QRCode64}" /> <br>Te recomendamos leer antes esta información días antes de ir a tu cita: <a href="http://www.donarsangre.org/informacion-basica-para-donantes/">Click aquí.</a>`
    };

    await transporter.sendMail(message, (error, info) => {
        if(error) {
            console.error(error);
        }
    });

};
// verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log('Can\'t send mails.');
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});