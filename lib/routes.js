"use strict";

const router = require('express').Router();
const Articles = require('./articles');
const articles = new Articles();
const async = require('async');

module.exports = router;

router.route('/')
    .get(function (req, res, next) {
        async.map(
            ['sport', 'lifestyle', 'art'],
            articles.getMostRecentArticleBySection.bind(articles),
            (err, results) => {
                if (err) {
                    return next(err);
                }
                let recent = {};
                results.forEach(article => {
                    if (article) {
                        recent[article.section] = article;
                    }
                });
                let data = {
                    recent: recent
                };
                res.render('index', data);
            });
    });

router.route('/post_article')
    .get(function (req, res) {
        res.render('post_article');
    })
    .post(function (req, res, next) {
        let userSecret = (req.body.article.secret || "").trim();
        if (userSecret !== process.env.SECRET) {
            return res.redirect('/');
        }
        let article = req.body.article;
        delete article.secret;
        articles.saveArticle(article, (err, id) => {
            if (err) {
                return next(err);
            }
            article.id = id;
            res.render('article_posted', {
                article: article,
            });
        });
    });

router.route('/article/:slug')
    .get(function (req, res, next) {
        let slug = req.params.slug;
        articles.getArticleBySlug(slug, (err, article) => {
            if (err) {
                return next(err);
            }
            res.render('article', {
                article: {
                    title: article.title,
                    author: article.author,
                    createdAt: article.createdAt,
                    text: article.text,
                }
            });
        });
    });

router.route('*')
    .get(function (req, res) {
        res.redirect('/');
    });
