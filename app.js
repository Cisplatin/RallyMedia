"use strict";
require('localenv');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const Ddos = require('ddos');
const ddos = new Ddos({'silentStart' : true});

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static('bower_components'));
app.use(ddos.express);
app.use(require('./lib/routes'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.listen(port, function () {
    console.log('RallyMedia listening on port ' + port + '.');
});
