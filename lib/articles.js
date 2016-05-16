"use strict";
require('localenv');

const mongodb = require('mongodb');
const slugify = require('slug');
const uuid = require('uuid');
const ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;
const Handlebars = require('handlebars');
let db = null;

Handlebars.registerHelper('trimString', function(passedString) {
    var theString = passedString.substring(0,280);
    return theString.concat('...');
});

module.exports = class Articles {
    constructor(callback) {
        let uri = process.env.MONGODB_URI;
        MongoClient.connect(uri, (err, _db) => {
            if (err) {
                console.error(err);
                return;
            }
            this.db = _db;
            this.articles = _db.collection('articles');
            if (callback) {
                callback();
            }
        });
    }
    
    saveArticle(article, callback) {
        if (!this.db) {
            return callback(new Error('no db'));
        }
        article.createdAt = new Date();
        article.section = article.section.toLowerCase();
        article.slug = slugify(article.title || article.text.slice(32) || uuid(), '_');
        this.articles.insertOne(article, (err, result) => {
            if (err || !result) {
                return callback(err || new Error('save article failed'));
            }
            var id = result.insertedId.toString();
            callback(null, id);
        });
    }

    getArticlesBySection(section, options, callback) {
        if (!options) {
            options = {};
        }
        if (typeof options.limit === 'undefined') {
            options.limit = 15;
        }
        if (!this.db) {
            return callback(new Error('no db'));
        }
        this.articles
            .find({
                section: section
            })
            .sort({createdAt: -1})
            .limit(options.limit)
            .toArray(callback);
    }

    getArticleById(id, callback) {
        if (!this.db) {
            return callback(new Error('no db'));
        }
        this.articles
            .find({
                _id: ObjectID(id)
            })
            .limit(1)
            .next(callback);
    }

    getArticleBySlug(slug, callback) {
        if (!this.db) {
            return callback(new Error('no db'));
        }
        this.articles
            .find({
                slug: slug
            })
            .limit(1)
            .next(callback);
    }
};
