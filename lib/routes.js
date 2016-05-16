"use strict";

const router = require('express').Router();
const Articles = require('./articles');
const articleManager = new Articles();
const async = require('async');

module.exports = router;

router.route('/')
    .get(function (req, res, next) {
        let options = {
            limit: 5
        };
        async.parallel({
            sport: done => articleManager.getArticlesBySection('sport', options, done),
            lifestyle: done => articleManager.getArticlesBySection('lifestyle', options, done),
            art: done => articleManager.getArticlesBySection('art', options, done),
        }, (err, result) => {
            if (err) {
                return next(err);
            }
            let data = {
                articles: result,
            };
            res.render('index', data);
        });
    });

router.route('/about')
    .get(function (req, res) {
        res.render('about');
    });

router.route('/staff')
    .get(function (req, res) {
        res.render('staff');
    });

function renderArticleSection(section, sectionName) {
    return function (req, res, next) {
        articleManager.getArticlesBySection(section, {limit: 5}, (err, articles) => {
            if (err) {
                return next(err);
            }
            res.render('articles_in_section', {
                section: sectionName,
                articles: articles,
            });
        });
    };
}

router.get('/art', renderArticleSection('art', 'Art'));
router.get('/sports', renderArticleSection('sports', 'Sports'));
router.get('/lifestyle', renderArticleSection('lifestyle', 'Lifestyle'));

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
        articleManager.saveArticle(article, (err, id) => {
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
        articleManager.getArticleBySlug(slug, (err, article) => {
            if (err) {
                return next(err);
            }
            if (!article) {
                return res.redirect('/'); // If we can't find article, yolo-redirect
            }
            let htmlText = article.text;
            htmlText = htmlText.replace(/\n/g, '<br>');
            res.render('article', {
                article: {
                    title: article.title,
                    author: article.author,
                    createdAt: article.createdAt,
                    picture: article.picture,
                    text: htmlText,
                }
            });
        });
    });

router.route('*')
    .get(function (req, res) {
        res.redirect('/');
    });
