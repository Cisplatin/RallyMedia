"use strict";
require('localenv');

const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const session = require('express-session');

const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(session({secret: process.env.SECRET}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static('bower_components'));
app.use(require('./lib/routes'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(function (err, req, res, next) {
    if (err) {
        res.status(500).render('error', {error: err.toString()});
    } else {
        next();
    }
});

app.listen(port, function () {
    console.log('RallyMedia listening on port ' + port + '.');
});
