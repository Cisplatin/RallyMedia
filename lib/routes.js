"use strict";

const router = require('express').Router();
const Articles = require('./articles');
const articleManager = new Articles();
const async = require('async');

module.exports = router;
router.use(require('./users'));
router.route('/')
    .get(function (req, res, next) {
        let sections = ['art', 'sports', 'lifestyle'];
        async.parallel({
            recents: done => articleManager.getRecents(sections, done),
            all: done => articleManager.getAllArticles({limit: 10}, done),
        }, (err, result) => {
            if (err) {
                return next(err);
            }
            function addSectionName(articles) {
                return articles.map((article, i) => {
                    if (!article) {
                        article = {
                            title: 'N/A',
                            author: 'N/A',
                            section: sections[i],
                            slug: '',
                            picture: '',
                        };
                    }
                    article.sectionName = {
                        'art': 'Arts',
                        'sports': 'Sports',
                        'lifestyle': 'Lifestyle'
                    }[article.section];
                    return article;
                });
            }
            result.recents = addSectionName(result.recents);
            result.allall = addSectionName(result.all);
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

router.route('/contact')
    .get(function (req, res) {
        res.render('contact');
    });

function renderArticleSection(section, sectionName) {
    return function (req, res, next) {
        articleManager.getAllArticles(section, {limit: 5}, (err, articles) => {
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
        let sess = req.session;
        if (sess.username == process.env.USERNAME && sess.password == process.env.PASSWORD) {
            res.render('post_article');
        } else {
            res.redirect('login');
        }
    })
    .post(function (req, res, next) {
        let sess = req.session;
        if (sess.username == process.env.USERNAME && sess.password == process.env.PASSWORD) {
            let article = req.body.article;
            articleManager.saveArticle(article, (err, id) => {
                if (err) {
                    return next(err);
                }
                article.id = id;
                res.render('article_posted', {
                    article: article,
                });
            });
        } else {
            res.redirect('login');
        }
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
