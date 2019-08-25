const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
        user: "apikey",
        pass: "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"
    }
});
// verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

const message = {
    from: 'no-reply@ugto.mx', // Sender address
    to: 'oscmcojc1@live.com.mx',         // List of recipients
    subject: 'Aviso importante de seguridad', // Subject line
    text: 'Tu cuenta ha sido hackeada jajajajajajjajasduasdjasudh' // Plain text body
};

transporter.sendMail(message, function(err, info) {
    if (err) {
        console.log(err)
    } else {
        console.log(info);
    }
});