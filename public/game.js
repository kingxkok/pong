

var killgame = false;
var speedup = animspeedup;

function game(){
	
 	window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
         function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();
      

	  
      function getMousePos(canvas, evt) {
        // get canvas position
        var obj = canvas;
        var top = 0;
        var left = 0;
        while(obj.tagName != 'BODY') {
          top += obj.offsetTop;
          left += obj.offsetLeft;
          obj = obj.offsetParent;
        }

        // return relative mouse position
        var mouseX = evt.clientX - left + window.pageXOffset;
        var mouseY = evt.clientY - top + window.pageYOffset;
        return {
          x: mouseX,
          y: mouseY
        };
      }



            //Balls
      function updateBalls(canvas, balls, timeDiff, mousePos) {
        if(balls[0]===undefined) endRound();
       // console.log("ball 0 " + balls[0].x + " " + balls[0].speed() + " ball 1 " + balls[1].x + " " + balls[1].speed())
        var context = canvas.getContext('2d');
        var collisionDamper = 0.0;
        var floorFriction = 0.0000 * timeDiff;
        var mouseForceMultiplier = -2 * timeDiff;
        var restoreForce = 0;//0.002 * timeDiff;

        for(var n = 0; n < balls.length; n++) {

          var ball = balls[n];
          // set ball position based on velocity
          ball.y += ball.vy;
          ball.x += ball.vx;

          let curspd = ball.speed();
          //speed limiter speed limit
          if (curspd>30){
            ball.setSpeed(30);
          }
          else if(curspd>10){
            ball.setSpeed(0.9*ball.speed());
          }
          else if(curspd>5)
          {
            ball.setSpeed(0.99*ball.speed());
          } 

          //accelerator
          ball.vx+=Math.sign(ball.vx)*0.0001;

          // restore forces
          if(ball.x > ball.origX) {
            ball.vx -= restoreForce;
          }
          else {
            ball.vx += restoreForce;
          }
          if(ball.y > ball.origY) {
            ball.vy -= restoreForce;
          }
          else {
            ball.vy += restoreForce;
          }

          // mouse forces
          var mouseX = mousePos.x;
          var mouseY = mousePos.y;

          var distX = ball.x - mouseX;
          var distY = ball.y - mouseY;

          var radius = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

          var totalDist = Math.abs(distX) + Math.abs(distY);

          var forceX = (Math.abs(distX) / totalDist) * (1 / radius) * mouseForceMultiplier;
          var forceY = (Math.abs(distY) / totalDist) * (1 / radius) * mouseForceMultiplier;

          if(distX > 0) {// mouse is left of ball
            ball.vx += forceX;
          }
          else {
            ball.vx -= forceX;
          }
          if(distY > 0) {// mouse is on top of ball
            ball.vy += forceY;
          }
          else {
            ball.vy -= forceY;
          }



          //Reduce ball life
          ball.life--;
          if(ball.life != Infinity)
          ball.radius = (ballRadius*ball.life/lifespan)/4*3 + ballRadius/4;
          //remove balls
          let removeBall = function(ball){
            balls.splice(n,1);
            n--;
          }
          if(ball.life<=0) {
            removeBall();
            continue;
          }

          //paddles
          for(var p = 0; p < paddles.length; p++){

          	var paddle = paddles[p];

          	//corner
          	if(paddleCornerHit(paddle, ball)) continue;

            let randSign = function(){
              if(Math.random()>0.5) return -1;
              else return 1;
            }

            let bounceMultiplier = 3;
          	//left paddle
          	if(p == 0)
	          	if(ball.x < (paddle.x + paddle.width + ball.radius) && ball.x > (paddle.x-ball.radius) 
	          	 && ball.y < paddle.y + paddle.height + ball.radius && ball.y > paddle.y-ball.radius ){
	          		ball.x = paddle.x + paddle.width + ball.radius + 1;
	          		ball.vx *= -1*bounceMultiplier;
                ball.vy *= bounceMultiplier;
	         // 		ball.vx *= (1 - collisionDamper);

                if(spawn)
                balls.push(new Ball(ball.x,ball.y,3,randSign(),BLACK,lifespan*Math.random()-balls.length)); //spawn ball
	          	}
	         //right paddle
          	if(p==1)
          		if(ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width
          		 && ball.y < paddle.y + paddle.height + ball.radius && ball.y > paddle.y-ball.radius ){
          			ball.x = paddle.x - ball.radius - 1;
	          		ball.vx *= -1*bounceMultiplier;
                ball.vy *= bounceMultiplier;
	         // 		ball.vx *= (1 - collisionDamper);


                if(spawn)
                balls.push(new Ball(ball.x,ball.y,-3,randSign(),BLACK,lifespan*Math.random()-balls.length));
          		}
 			

          }

          


          //Floor and walls
          // floor friction 
          /*
          if(ball.vx > 0) {
            ball.vx -= floorFriction;
          }
          else if(ball.vx < 0) {
            ball.vx += floorFriction;
          }
          if(ball.vy > 0) {
            ball.vy -= floorFriction;
          }
          else if(ball.vy < 0) {
            ball.vy += floorFriction;
          } */

          // floor condition
          if(ball.y > (canvas.height - ball.radius)) {
            ball.y = canvas.height - ball.radius - 2;
            ball.vy *= -1;
            ball.vy *= (1 - collisionDamper);
          }

          // ceiling condition
          if(ball.y < (ball.radius)) {
            ball.y = ball.radius + 2;
            ball.vy *= -1;
            ball.vy *= (1 - collisionDamper);
          }

          // right wall condition
          if(ball.x > (canvas.width - ball.radius)) {
            ball.x = canvas.width - ball.radius - 2;
            ball.vx *= -1;
            ball.vx *= (1 - collisionDamper);
            removeBall();
            players[0].score++;
            continue;
          //  endRound();
          }

          // left wall condition
          if(ball.x < (ball.radius)) {
            ball.x = ball.radius + 2;
            ball.vx *= -1;
            ball.vx *= (1 - collisionDamper);
            removeBall();
            players[1].score++;
            continue;
          //  endRound()
          }

        }
      }

      //Paddles
      function paddleCornerHit(paddle, ball){
      	var hit = false;
      	hit = hit || collided(paddle.x, paddle.y, ball);
      	hit = hit || collided(paddle.x+paddle.width, paddle.y, ball);
      	hit = hit || collided(paddle.x+paddle.width, paddle.y+paddle.height, ball);
      	hit = hit || collided(paddle.x, paddle.y+paddle.height, ball);
      	return hit;
      }
      function collided(x, y, ball){
      	var dist2 = Math.pow(x-ball.x,2) + Math.pow(y-ball.y,2);
      	if (dist2 <= Math.pow(ball.radius,2) ){
      		let speed = Math.sqrt(Math.pow(ball.vx, 2) + Math.pow(ball.vy, 2)) ;
      		ball.vx = ball.x-x;
      		ball.vy = ball.y-y;
      		var curspeed = Math.sqrt(Math.pow(ball.vx, 2) + Math.pow(ball.vy, 2));
      		ball.vx *= (speed/curspeed);
      		ball.vy *= (speed/curspeed);
      		return true;
      	}
      	return false;
      }
      function updatePaddles(canvas, paddles, timeDiff){
      	var context = canvas.getContext('2d');
      	var speed = paddleSpeed;
      	for(var n = 0; n < paddles.length; n++){
      		var paddle = paddles[n];
      		var amount = paddle.down - paddle.up;
      		if(amount != 0){
      			var y = paddle.y + (amount*timeDiff*speed);
                if(y>0 && y<canvas.height-paddle.height)
      			paddle.y = y;
      		}

      	}
      }

   

      
      function animate(canvas, balls, lastTime, mousePos) {
        var context = canvas.getContext('2d');

        // update
        var date = new Date();
        var time = date.getTime();
        var timeDiff = time - lastTime;
        if(started){ //only update if started
       	 updateBalls(canvas, balls, timeDiff, mousePos);
       	 updatePaddles(canvas, paddles, timeDiff);
    	 }
        lastTime = time;

        // clear
        context.fillStyle = "rgba(255,255,255,0.2)"; //transparency creates fade effect
        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.fill()
        if(!started) context.clearRect(0, 0, canvas.width, canvas.height);

        // render
		renderBall(context);
		renderPaddle(context);
		renderScores(context);

        // request new frame
        console.log(speedup)
		    
        requestAnimFrame(function() {
		      if(started){
              animate(canvas, balls, lastTime, mousePos);
              while(speedup){
                speedup--;
			           animate(canvas, balls, lastTime, mousePos);
              }
           }
        });

      }

      //Rendering
	  function renderPaddle(context){
		  for(var n = 0; n < paddles.length; n++){
			var paddle = paddles[n];
			context.beginPath();
			context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
			context.fillStyle = paddle.color;
			context.fill();
		}
	  }
	  function renderBall(context){
		for(var n = 0; n < balls.length; n++) {
          var ball = balls[n];
          context.beginPath();
          context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
          context.fillStyle = ball.color;
          context.fill();
        }
	  }
	  function renderScores(context){
	  	for(var n = 0; n < paddles.length; n++){
	  		var player = players[n];
	  		context.fillStyle = BLACK;
	  		context.font = "20px Arial";
	  		context.fillText("Player " + player.name + ": \t", 10, (20*(1+n)) );
	  		context.fillText(player.score, 150, (20*(1+n)));
	  	}
	  }

	 function endRound(){
      started = false;
      balls = initBalls();
      paddles = initPaddles();
      speedup = animspeedup;
    }
	  function endGame(){
		started = false;
		players = initPlayers();
		paddles = initPaddles();
		balls = initBalls();
		animate(canvas, balls, time, mousePos);
	 }

      
      var players = initPlayers();
      var balls = initBalls();
	    var paddles = initPaddles();
      var date = new Date();
      var time = date.getTime();
      /*
       * set mouse position really far away
       * so the mouse forces are nearly obsolete
       */
      var mousePos = {
        x: 9999,
        y: 9999
      };

      ////////
	  //Event Listeners
	  ///////
      canvas.addEventListener('mousemove', function(evt) {
        var pos = getMousePos(canvas, evt);
        mousePos.x = pos.x;
        mousePos.y = pos.y;
      });

      canvas.addEventListener('mouseout', function(evt) {
        mousePos.x = 9999;
        mousePos.y = 9999;
      });
	  
	  canvas.addEventListener('mousedown', function(evt) {
	  	if(killgame) return;
		  if(!started) {
			animate(canvas, balls, time, mousePos);
			started = true;
		  }
		  else {
			  started = false;
		  }
	  });
	  
	  window.addEventListener('keypress', function(evt){
		  var kc = (evt.keyCode || evt.which);

		  if(kc == SPACE){
    		if(!started) {
    			animate(canvas, balls, time, mousePos);
    			started = true;
    		}
    		else {
    		  started = false;
    		}
		  }//evt.kc = space
		 
	  });
	  
    window.pause = function(){
      started = false;
    }

	  window.addEventListener('keydown', function(evt){
	  	var kc = (evt.keyCode || evt.which);
	  	//console.log(kc);
	  	 if (started){
		  	//paddles
		  	for(var n = 0; n < paddles.length; n++){
		  		var paddle = paddles[n];
		  		if(kc == paddle.upKey) {
		  			paddle.moveUp();
		  		} else if (kc == paddle.downKey){
		  			paddle.moveDown();
		  		}
		  	}
		  }
	  });

	  
	 window.addEventListener('keyup', function(evt){
	 	var kc = (evt.keyCode || evt.which);
	 //	console.log(kc);
		if(kc == ESC) endGame();

	 	if(started){
	 		//paddles
		  	for(var n = 0; n < paddles.length; n++){
		  		var paddle = paddles[n];
		  		if(kc == paddle.upKey) {
		  			paddle.stopMoveUp();
		  		} else if (kc == paddle.downKey){
		  			paddle.stopMoveDown();
		  		}
		  	}
	 	}
	 });

    animate(canvas, balls, time, mousePos);

	}




	

	game();
