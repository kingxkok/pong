//socket connection
var socket = io.connect(window.location.href);

socket.on('render', function(data){
	render(data);
})

//DOM
var canvas = document.getElementById('myCanvas');

var render = function(data){
	var context  = canvas.getContext('2d');


    // clear
    context.fillStyle = "rgba(0,0,0,0.2)"; //transparency creates fade effect
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill()

	for(var i in data){
		let paddle = data[i];
		context.beginPath();
		context.rect(paddle.x, paddle.y, 10, 50);
		context.fillStyle = 'red';
		context.fill();	
	}

}

var QKey = 81;
var AKey = 65;
var upKey = 38;
var downKey = 40;

window.addEventListener('keydown', function(evt){
	evt.preventDefault();
	var kc = (evt.keyCode || evt.which);
	if(kc === downKey || kc === upKey) 
		socket.emit('keydown', {kc : kc})
})

window.addEventListener('keyup', function(evt){
	evt.preventDefault();
	var kc = (evt.keyCode || evt.which);
	if(kc === downKey || kc === upKey) 
		socket.emit('keyup', {kc : kc})
})