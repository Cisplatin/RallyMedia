"use strict";

const express = require('express');
const app = express();
const Articles = require('./articles');
const articles = new Articles();
const bodyParser = require('body-parser');

const port = 3000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static('bower_components'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/robots.txt', function (req, res) {
    res.sendFile(__dirname + '/public/robots.txt');
});

app.get('/admin', function (req, res) {
    res.sendFile(__dirname + '/public/admin.html');
});

app.get('/contact', function (req, res) {
    res.sendFile(__dirname + '/public/contact.html');
});

app.get('/about', function (req, res) {
    res.sendFile(__dirname + '/public/about.html');
});

app.post('/admin', function (req, res) {
    let article = req.body.article;
    articles.saveArticle(article, (err, id) => {
        res.send(err || id);
    });
});

app.get('/staff', function(req, res) {
    res.sendFile(__dirname + '/public/staff.html');
});

app.listen(port, function () {
    console.log('RallyMedia listening on port ' + port + '.');
});
