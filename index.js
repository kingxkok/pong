//Server setup

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var fs = require('fs');
var server = app.listen(port, function(){
	console.log('listening on port',port);
});


app.use(express.static('public'));

//Routing

app.get('/', function(req, res) {
    fs.readFile(__dirname + '/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});


//Socket Setup
var io = require('socket.io')(server);
var sockets = {};
var gameBox = {width: 800, height : 600}

io.on('connection', function(socket){
	console.log(socket.id, "made socket connection")
	sockets[socket.id] = socket;

	if(countProperties(paddles) == 1)	
		paddles[socket.id] = new Paddle(gameBox.width-10-20, (gameBox.height-90)/2, 20, 90, 'blue')
	else
  		paddles[socket.id] = new Paddle(10, (gameBox.height-90)/2, 20, 90, 'blue');

  	socket.on('keydown', function(data){

  		if(data.kc === upKey) paddles[socket.id].up = 1;
  		else if(data.kc === downKey) paddles[socket.id].down = 1;
  	})
  	socket.on('keyup', function(data){
  		if(data.kc === upKey) paddles[socket.id].up = 0;
  		else if(data.kc === downKey) paddles[socket.id].down = 0;
  	})



  	socket.on('disconnect', function(){
  		delete sockets[socket.id];
  		delete paddles[socket.id];
  	})


})

setInterval(function(){
	for(var i in sockets){
		var socket = sockets[i];
		let paddle = paddles[i];

		var amount = paddle.down - paddle.up;
  		if(amount != 0){
  			var y = paddle.y + 4*amount//(amount*timeDiff*speed);
          	paddle.y = y;
         }

		socket.emit('render',paddles)
	}
	

},1000/30)



function Paddle(x, y, width, height, color, upKey, downKey){
      this.x = x;
      this.y = y;
      this.color = color;
      this.width = width;
      this.height = height;
      this.upKey = upKey;
      this.downKey = downKey;
      this.up = 0;
      this.down = 0;

      this.moveUp = function(){
        this.up = 1;
      }
      this.stopMoveUp = function(){
        this.up = 0;
      }
      this.moveDown = function(){
        this.down = 1;
      }
      this.stopMoveDown = function(){
        this.down = 0;
      }
  }

var QKey = 81;
var AKey = 65;
var upKey = 38;
var downKey = 40;
var paddles = {};




function countProperties(obj) {
    return Object.keys(obj).length;
}














