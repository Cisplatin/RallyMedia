"use strict";
let Articles = require('./articles');

let articles = new Articles(() => {
    articles.saveArticle({
        title: 'how to swag',
        section: 'lifestyle',
    }, (err, id) => {
        articles.getArticleById(id, (err, result) => {
            articles.getArticlesBySection('lifestyle', (err, result) => {
                console.log(result);
            });
        });
    });
});

