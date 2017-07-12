const express = require('express');
const app = express();
var port = process.env.PORT || 3000;
var fs = require('fs');

app.use(express.static('public'));

app.get('/', function(req, res) {
    fs.readFile(__dirname + '/pong.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.listen(port);
console.log("PONG is listening on port ",port);