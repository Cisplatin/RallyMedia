"use strict";
require('localenv');

const mongodb = require('mongodb');
const slugify = require('slug');
const uuid = require('uuid');
const async = require('async');

const ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;
const Handlebars = require('handlebars');
let db = null;

Handlebars.registerHelper('trimString', function(passedString) {
    var theString = passedString.substring(0,280);
    var regex = /(&nbsp;|<([^>]+)>)/ig
    , body = theString
    , result = body.replace(regex, "");
    return result.concat('...');
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
        article.slug += `_${uuid().slice(0, 8)}`;
        this.articles.insertOne(article, (err, result) => {
            if (err || !result) {
                return callback(err || new Error('save article failed'));
            }
            var id = result.insertedId.toString();
            callback(null, id);
        });
    }
    
    getRecents(sections, callback) {
        if (!this.db) {
            return callback(new Error('no db'));
        }
        async.parallel(
            sections.map(section => done => {
                this.articles
                    .find({
                        section: section,
                    })
                    .sort({createdAt: -1})
                    .limit(1)
                    .next(done);
            }),
            callback
        );
    }

    getAllArticles(options, callback) {
        if (!this.db) {
            return callback(new Error('no db'));
        }
        let query = {};
        if (options.section) {
            query.section = options.section;
        }
        this.articles
            .find(query)
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
