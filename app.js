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

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', function (req, res) {
    let data = {
    };

    res.render('index', data);
});

app.post('/post_article', function (req, res) {
    if (req.body.article.secret !== process.env.secret) {
        res.redirect('/');
    }
    let article = req.body.article;
    articles.saveArticle(article, (err, id) => {
        if (err) {
            return res.render('error', {error: err});
        }
        article.id = id;
        res.render('article_posted', {
            article: article,
        });
    });
});

app.use(require('./routes'));

app.listen(port, function () {
    console.log('RallyMedia listening on port ' + port + '.');
});
