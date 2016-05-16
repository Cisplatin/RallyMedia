"use strict";

const router = require('express').Router();

router.route('/login').get(function(req, res, next) {
        res.render('login');
});

router.route('/login').post(function(req, res, next) {
    let sess = req.session;
    if (req.body.username == process.env.USERNAME && req.body.password == process.env.PASSWORD) {
        sess.username = process.env.USERNAME;
        sess.password = process.env.PASSWORD;
        res.redirect('/');
    } else {
        res.redirect('login');
    }
});

module.exports = router;
