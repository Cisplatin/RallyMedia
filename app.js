const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 3000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static('bower_components'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/admin', function (req, res) {
    res.sendFile(__dirname + '/public/admin.html');
});

app.get('/contact', function (req, res) {
    res.sendFile(__dirname + '/public/contact.html');
});

app.get('/about', function (req, res) {
    res.sendFile(__dirname + '/public/about.html');
});

app.post('/admin', function (req, res) {
    console.log(req.body.user);
});

app.listen(port, function () {
    console.log('RallyMedia listening on port ' + port + '.');
});
