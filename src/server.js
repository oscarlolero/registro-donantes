const express = require('express');
const app = express();

const path = require('path');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

//Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //Configurar motor de plantillas

//middlewares
app.use(morgan('dev')); //Logeo de peticiones al servidor
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //se pasa la funcion "json" como middlewere a express.
app.use(session({
    secret: 'kajwg45s2',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
//Rutas
require('./routes/routes')(app);

//Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Handle 404
app.use((req, res) => {
    res.redirect('/registro');
});

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});