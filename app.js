"use strict";
require('localenv');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static('bower_components'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(require('./routes'));

app.listen(port, function () {
    console.log('RallyMedia listening on port ' + port + '.');
});
