"use strict";

const router = require('express').Router();
const Articles = require('./articles');
const articles = new Articles();

module.exports = router;

router.get('/', function (req, res) {
    let data = {};

    res.render('index', data);
});

router.route('/post_article')
    .get(function (req, res) {
        res.render('post_article');
    })
    .post(function (req, res) {
        if(req.body.article.secret !== process.env.secret) {
            res.redirect('/');
        } else {
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
        }
    });

router.route('/article/:id')
    .get(function (req, res) {
        let id = req.params.id;
        articles.getArticleById(id, (err, article) => {
            if (err) {
                return res.render('error', {error: error});
            }
            res.render('article', {
                article: {
                    title: article.title,
                    author: article.author,
                    createdAt: article.createdAt.toString(),
                    text: article.text,
                }
            });
        });
    });

router.route('/*')
    .get(function (req, res) {
        res.redirect('/');
    });
