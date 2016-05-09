"use strict";

const express = require('express');
const app = express();
const Articles = require('./articles');
const articles = new Articles();
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');

const port = 3000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static('bower_components'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './templates');

app.get('/', function (req, res) {
    let data = {

    };

    res.render('index', data);
});

app.get('/robots.txt', function (req, res) {
    res.sendFile(__dirname + '/public/robots.txt');
});

app.post('/post_article', function (req, res) {
    let article = req.body.article;
    articles.saveArticle(article, (err, id) => {
        res.send(err || id);
    });
});

app.listen(port, function () {
    console.log('RallyMedia listening on port ' + port + '.');
});
