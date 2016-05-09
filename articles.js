"use strict";
require('localenv');

const mongodb = require('mongodb');
const ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;
let db = null;

module.exports = class Articles {
    constructor(callback) {
        MongoClient.connect(process.env.MONGODB_URI, (err, _db) => {
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
        this.articles.insertOne(article, (err, result) => {
            if (err || !result) {
                return callback(err || new Error('save article failed'));
            }
            var id = result.insertedId.toString();
            callback(null, id);
        });
    }

    getArticlesBySection(section, callback) {
        if (!this.db) {
            return callback(new Error('no db'));
        }
        this.articles.find({
            section: section
        }).toArray(callback);
    }

    getMostRecentArticleBySection(section, callback) {
        if (!this.db) {
            return callback(new Error('no db'));
        }
        this.articles.find({
            section: section
        }).sort({createdAt: 1}).limit(1).next(callback);
    }

    getArticleById(id, callback) {
        if (!this.db) {
            return callback(new Error('no db'));
        }
        this.articles.find({
            _id: ObjectID(id)
        }).limit(1).next(callback);
    }
};