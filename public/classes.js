
//Array initialization functions

  function initPlayers(){
    players = [];
    players.push(new Player("Left"));
    players.push(new Player("Right"));
    return players;
  }

  function initBalls() {
    balls = [];
    let speed = 3; //ballspeed
    function xvel(speed){
        let xvel = (Math.random()>0.5)? speed : speed*-1;
        return xvel + (Math.random()-0.5);
    }
    function yvel(speed){
        return speed*(Math.random()-0.5);
    }

    for(let i = 0; i < numballs; i++)
        balls.push(new Ball(canvas.width/2, canvas.height/2, xvel(speed), yvel(speed), BLUE));

    return balls;
  }
  function initPaddles(){
      paddles = [];
      let width = paddleWidth;
      let height = paddleHeight;
      paddles.push(new Paddle(10, (canvas.height-height)/2, width, height, RED, Q, A ));
      paddles.push(new Paddle(790-width, (canvas.height-height)/2, width, height, GREEN, P, L));
      return paddles;
  }


  //Class declarations

  function Player(name){
    this.name = name;
    this.score = 0;
  }
  function Ball(x, y, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.origX = x;
    this.origY = y;
    this.radius = ballRadius;
  }
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