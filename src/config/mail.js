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
        html: `¡Hola ${alias}!, tu cita quedó agendada para el ${date}.<br>Recuerda mostrar el siguiente código QR a la hora de presentarte y terminar tu cita: <br><img style=display:block; width:100px;height:100px; src="${QRCode64}" />`
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