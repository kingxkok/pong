  //GLOBAL CONSTS
	var BLUE = '#3A5BCD';
	var RED = '#EF2B36';
	var YELLOW = '#FFC636';
	var GREEN = '#02A817';
	var BLACK = '#000000';
	var SPACE = 32;
	var P = 80;
	var L = 76;
	var Q = 81;
	var ESC = 27;
	var A = 65;

	//Document vars
var canvas = document.getElementById('myCanvas');

//game specific VARS
		var started  = false;
		var ballRadius = 10;
		var paddleWidth = 20;
		var paddleHeight = 200;
		var paddleSpeed = 0.8;
		var numballs = 2;
		var ballspeed = 1;
		var lifespan = 900;
		var spawn = true;

        var animspeedup = 10;