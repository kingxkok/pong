const express = require('express');
const app = express();
var port = process.env.PORT || 3000;
var fs = require('fs');

app.use(express.static('public'));

app.get('/', function(req, res) {
    fs.readFile(__dirname + '/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.get('/pong_kai', function(req, res) {
    fs.readFile(__dirname + '/pong_kai.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.get('/pong_victor', function(req, res) {
    fs.readFile(__dirname + '/pong_victor.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.get('/pong_jordan', function(req, res) {
    fs.readFile(__dirname + '/pong_jordan.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.get('/pong_luke', function(req, res) {
    fs.readFile(__dirname + '/pong_luke.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.get('/pong_frost', function(req, res) {
    fs.readFile(__dirname + '/pong_frost.html', 'utf8', function(err, text){
        res.send(text);
    });
});



app.listen(port);
console.log("PONG is listening on port ",port);