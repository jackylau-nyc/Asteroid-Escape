//Game Code
	var loggedIn = false;
	var username = '';
	var pass = '';
	var listening = true;
	var paused = true;
	var changeDifficulty = false;
	var fireballOnScreen = false;
	var chocbarOnScreen = false;
	bgMusic = new Audio('vaporwave-loop.mp3'); 
	bgMusic.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);
	var eventVolume = 0.2;
	bgMusic.volume = eventVolume/3;
	var chocPickUpSound = new Audio('NFF-glassy-tap-02.wav');
	var heartPickUpSound = new Audio('NFF-bonus.wav');
	var fireballPickUpSound = new Audio('NFF-explode.wav');
	var androidDeadSound = new Audio('NFF-slowdown.wav');
	//var chocPickUpSound = document.getElementById("chocPickUp"); 
	var heartOnScreen = false;
	var chocDropped = 0;
	var difficulty = 0;
	var difficultyFactor = 15;
	var deadTimer = -1;
	var highscore = 0;
	var character = new Image();
		character.src = 'spaceship.png';
	var ball = new Image();
		ball.src = 'asteroid.png';
	var bar = new Image();
		bar.src = 'battery.png';
	var heart = new Image();
		heart.src = 'repair.png';
	var bgImage = new Image();
		bgImage.src = 'spacebg.jpg';
	var bgCol = 11;
	var bgRow = 11;
	var bgTextColor = 'white';
	var characterChangeTo = 'default';
	var animateTimer = 22; //multiples of 6
	var bgAnimateSpeed = 1; // 0.25 - 5
	var eatTimer = 0;
	var hurtTimer = 0;
	var lifeTimer = 0;
	//var lastUpdateTime = performance.now();
	//var lastDrawTime = performance.now();
	
	function changeState(){
		if (deadTimer == 0) {
			//location.reload(true);
			//clearInterval(updateInterval);
			start();
			deadTimer = -1;
			paused = true;
			fireballOnScreen = false;
			chocbarOnScreen = false;
			heartOnScreen = false;
			chocDropped = 0;
			difficulty = 0;
			bgMusic.pause();
			return;
		}
		if (paused == true) {
		  paused = false;
		  bgMusic.play();
		} else {
		  paused = true;
		  bgMusic.pause();
		  Game.context.font = "24px serif"; 
	      Game.context.textAlign = "center"; 
	      Game.context.textBaseline = "hanging"; 
	      Game.context.fillText("PAUSED", Game.width/2, (Game.height/2) - 50);
	      Game.context.fillText("Press P to Resume.", Game.width/2, (Game.height/2) + 100);
		  
		}
	}
	
	function pauseGame(){	
		if (paused == false) changeState();
	}
	
    var Key = {
      _pressed: {},

      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,

      isDown: function(keyCode) {
        return this._pressed[keyCode];
      },

      onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
      },

      onKeyup: function(event) {
        delete this._pressed[event.keyCode];
      }
	  
    };
	
	function checkPaused(event) {
		if (listening == true){
			if (event.keyCode == 80) {
				if (document.activeElement ==  document.getElementById('loginUsername') || document.activeElement ==  document.getElementById('loginPassword'))	{
					//do nothing
				} else{
					changeState();
					return;
				}
			};
		}
	}
        
    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
	window.addEventListener('keydown', function(event) { checkPaused(event); }, false);

    var Game = {
      fps: 60,
	  height: 450,
      width: 800,
	  score : 0,
	  lives : 0,
	  multiplier : 1,
	  chocInARow : 0
	  //updateInterval: setInterval(function() {}, 1000),
	  //drawInterval: setInterval(function() {}, 1000)
    };
	
	
	Game._onEachFrame = (function() {
		
      //var requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
      var requestAnimationFrame = window.RequestAnimationFrame;

      if (requestAnimationFrame) {
       return function(cb) {
          var _cb = function() { cb(); requestAnimationFrame(_cb); }
          _cb();
        };
      } else {
        return function(cb) {
          setInterval(cb, 1000 / Game.fps);
        }
      } 
    })();
	
	
	start = function(){
	Game.start();
	getLeaderboard();
	}
    
    Game.start = function() {
	  //var t0 = performance.now();
      Game.canvas = document.getElementById("canvas");
      Game.canvas.width = Game.width;
      Game.canvas.height = Game.height;
      Game.context = Game.canvas.getContext("2d");
	  Game.background = new Background();
	  Game.context.fillStyle = bgTextColor;
	  Game.context.shadowBlur = 2;
	  Game.context.drawImage(bgImage, 0, 0,bgImage.width/Game.background.cols,bgImage.height/Game.background.rows, 0, 0, Game.width, Game.height);
	  Game.context.font = "24px serif"; 
	  Game.context.textAlign = "center"; 
	  Game.context.textBaseline = "hanging"; 
	  Game.context.fillText("Use Arrow keys to move around.", Game.width/2, (Game.height/2) - 50);
	  Game.context.fillText("Pick up the fuel packs and avoid the asteroids.", Game.width/2, (Game.height/2) - 25);
	  Game.context.fillText("Pick up fuel packs to increase your multiplier!", Game.width/2, (Game.height/2));
	  Game.context.fillText("Pick up the repair kits for extra lives!", Game.width/2, (Game.height/2)+25);
	  Game.context.fillText("Press P to start or pause the game.", Game.width/2, (Game.height/2) + 100);
	  Game.context.shadowBlur = 0;
	  //Game.background1 = new Background1();
	  //Game.background2 = new Background2();
      Game.player = new Player();
	  Game.fireball = new Fireball();
	  fireballOnScreen = true;
	  Game.chocbar = new Chocbar();
	  chocbarOnScreen = true;
	  chocDropped += 1;
	  Game.heart = new Heart();
	  heartOnScreen = true;
      Game._onEachFrame(Game.run);
      //Game.updateInterval = setInterval(Game.update, Game.ticks);
	  //clearInterval(Game.drawInterval);
      //Game.drawInterval = setInterval(Game.draw, 1000/Game.fps);
	  Game.score = 0;
	  Game.lives = 0;
	  Game.multiplier = 1;
	  Game.chocInARow = 0;
	  //var t1 = performance.now();
	  //console.log("Game.start took " + ((t1 - t0)) + "ms.");
    };
	
	Game.run = (function() {
      var loops = 0, skipTicks = 1000 / Game.fps,
          maxFrameSkip = 10,
          nextGameTick = (new Date).getTime(),
          lastGameTick;

      return function() {
        loops = 0;
		  
		 while ((new Date).getTime() > nextGameTick) {
			Game.update();
			nextGameTick += skipTicks;
			loops++;
	     }


        if (loops) Game.draw();
      }
    })();

    
    Game.draw = function() {
	  //var enterDrawTime = performance.now();
	  //if ((enterDrawTime - lastDrawTime) > 15) console.log("#101 - GameDraw took more than 15ms: " + (enterDrawTime - lastDrawTime) + "."); 
	  //console.log("#101 - GameDraw took: " + (enterDrawTime - lastDrawTime) + "ms."); 
	  //lastDrawTime = enterDrawTime;	 
	  if (deadTimer == 0 || paused == true) return;
	  //var t0 = performance.now();
	  Game.context.shadowColor = "black";
      Game.context.clearRect(0, 0, Game.width, Game.height);

	  //var t1 = performance.now();
	  //if ((t1 - t0) > 1)console.log("#101 - GameDraw(Clear) took more than 1ms: " + (t1 - t0) + ".");
	  Game.background.draw(Game.context);
	  //Game.background1.draw(Game.context);
	  //Game.background2.draw(Game.context);
	  Game.player.draw(Game.context);
	  Game.fireball.draw(Game.context);
	  Game.chocbar.draw(Game.context);
	  Game.heart.draw(Game.context);
	  //var t2 = performance.now();
	  //if ((t2 - t0) > 1)console.log("#102 - GameDraw took more than 1ms: " + (t2 - t0) + ".");
	  Game.context.shadowBlur = 2;
	  Game.context.font = "24px serif"; 
	  Game.context.textAlign = "right"; 
	  Game.context.textBaseline = "hanging"; 
	  Game.context.fillText("Score:"+Game.score, Game.width, 0);
	  Game.context.textAlign = "left"; 
	  var accur = Math.floor(Game.score/(chocDropped-1) * 100);
	  //if (chocDropped != 1) Game.context.fillText("Accuracy:"+accur+"%", 0, 0);
	  //else Game.context.fillText("Accuracy:0%", 0, 0);
	  Game.context.fillText("Mulitplier:"+parseInt(Game.multiplier)+"x ("+Game.chocInARow+")", 0, 0);
	  Game.context.textAlign = "center"; 
	  Game.context.fillText("Lives Remaining:"+Game.lives, Game.width/2, 0);
	  //Game.context.fillText("FPS:" + (1000/(performance.now() - lastDrawTime)), Game.width/2, 25);
	  //var t3 = performance.now();
	  //if ((t3 - t0) > 1)console.log("#103 - GameDraw took more than 1ms: " + (t3 - t0) + ".");
    };
    
    Game.update = function() {
	  //var enterUpdateTime = performance.now();
	  //if ((enterUpdateTime - lastUpdateTime) > 15) console.log("#101 - GameUpdate took more than 15ms: " + (enterUpdateTime - lastUpdateTime) + "."); 
	  //console.log("#101 - GameUpdate took: " + (enterUpdateTime - lastUpdateTime) + "ms."); 
	  //lastUpdateTime = enterUpdateTime;
	  if (paused == true || deadTimer == 0) return;
	  //var t0 = performance.now();
      Game.player.update();
	  Game.fireball.update();
	  Game.chocbar.update();
	  Game.heart.update();
	  Game.background.update();
	  //Game.background1.update();
	  //Game.background2.update();
	  if (deadTimer > 1) {
		deadTimer--;
		//var t1 = performance.now();
		//if ((t1 - t0) > 1)console.log("#101 - GameUpdate took more than 1ms: " + (t1 - t0) + ".");
		return;
	  }
	  if (deadTimer == 1){
		deadTimer = 0;
		Game.context.font = "24px serif"; 
	    Game.context.textAlign = "center"; 
	    Game.context.textBaseline = "hanging"; 
	    Game.context.fillText("You Died!", Game.width/2, (Game.height/2) - 50);
	    Game.context.fillText("Your Score : " + Game.score + ".", Game.width/2, (Game.height/2) - 25);
		if (Game.score > highscore) {
			Game.context.fillText("Congrats! You beat your old highscore of : " + highscore, Game.width/2, (Game.height/2));
			highscore = Game.score;
			saveHighScore();
		}
	    Game.context.fillText("Press P to restart.", Game.width/2, (Game.height/2) + 100);
		//var t1 = performance.now();
		//if ((t1 - t0) > 1)console.log("#102 - GameUpdate took more than 1ms: " + (t1 - t0) + ".");
		bgMusic.pause();
		return;
	  }
	  if(testCollision(Game.player, Game.fireball)) {
      
	  if (Game.lives == 0){
		deadTimer = animateTimer;
		var deadSound = androidDeadSound.cloneNode();
	    deadSound.volume = eventVolume;
	    deadSound.play();
	  } else {
		  Game.lives -= 1;
		  var hurtSound = fireballPickUpSound.cloneNode();
	      hurtSound.volume = eventVolume;
	      hurtSound.play();
	   }
		fireballOnScreen = false;
		hurtTimer = animateTimer;
		Game.player.animateFrame = 0;
		Game.player.changeAnimationTo = 'hurt';
	  }
	  if (testCollision(Game.player, Game.chocbar)) {
	  var chocSound = chocPickUpSound.cloneNode();
	  chocSound.volume = eventVolume/2;
	  chocSound.play();
	  Game.score += parseInt(Game.multiplier)*1;
	  Game.chocInARow++;
	  Game.multiplier = 1 + (Game.chocInARow / 5);
	  
	  chocbarOnScreen = false;
	  eatTimer = animateTimer;
	  Game.player.animateFrame = 0;
	  Game.player.changeAnimationTo = 'eat';
	  
	  }
	  if (testCollision(Game.player, Game.heart)) {
	  var heartSound = heartPickUpSound.cloneNode();
	  heartSound.volume = eventVolume;
	  heartSound.play();
	  Game.lives += 1;
	  heartOnScreen = false;
	  lifeTimer = animateTimer;
	  Game.player.animateFrame = 0;
	  Game.player.changeAnimationTo = 'life';
	  }
	  var newDifficulty = parseInt(Game.score / difficultyFactor);
	  if (newDifficulty > difficulty) {
		  difficulty = newDifficulty;
		  changeDifficulty = true;
	  } else {
		changeDifficulty = false;
	  }
	  //var t1 = performance.now();
	  //if ((t1 - t0) > 1)console.log("#103 - GameUpdate took more than 1ms: " + (t1 - t0) + ".");
    };
	
	function testCollision(obj1, obj2){
		if (Math.abs(obj1.centerx - obj2.centerx) < (obj1.width/3 + obj2.width/3) && Math.abs(obj1.centery - obj2.centery) < (obj1.height/3 + obj2.height/3))	return true;
		else return false;
	}
	
	function Background() {
	  this.startX = 0;
	  this.startY = 0;
	  this.cols = bgCol;
	  this.rows = bgRow;
	  this.animateFrame = 0;
    }
	
	function Background1() {
	  this.startX = 0;
	  this.startY = 0;
    }
	
	function Background2() {
	  this.startX = Game.width;
	  this.startY = 0;
    }
	
    function Player() {
	  this.width = 48;
	  this.height = 1.45*this.width;
	  this.x = Game.width/2;
      this.y = Game.height-this.height;
	  this.centerx = this.x + (this.width/2);
	  this.centery = this.y + (this.height/2); 
	  this.animateFrame = 0;
	  changeAnimationTo = '';
    }
	
	function Fireball(){
	  this.width = 40;
	  this.height = this.width;
	  this.x = Math.ceil(Math.random() * (Game.width - this.width/2));
	  this.y = -10;
	  this.originalSpeed = 6;
	  this.speed = this.originalSpeed;
	  this.centerx = this.x + (this.width/2);
	  this.centery = this.y + (this.height/2);
	  this.animateFrame = 0;
	}
	
	function Chocbar(){
	  this.width = 48;
	  this.height = this.width;
	  this.x = Math.ceil(Math.random() * (Game.width - this.width/2));
	  this.y = -10;
	  this.originalSpeed = 5;
	  this.speed = this.originalSpeed;
	  this.centerx = this.x + (this.width/2);
	  this.centery = this.y + (this.height/2);
	  this.animateFrame = 0;
	}
	
	function Heart(){
	  this.width = 36;
	  this.height = this.width;
	  this.x = Math.ceil(Math.random() * (Game.width - this.width/2));
	  this.y = -10;
	  this.originalSpeed = 3;
	  this.speed = this.originalSpeed;
	  this.centerx = this.x + (this.width/2);
	  this.centery = this.y + (this.height/2);
	  this.animateFrame = 0;
	}
	
	Background.prototype.draw = function(context) {
		//var t0 = performance.now();
		context.shadowBlur = 0;
		var frameCol = Math.floor(this.animateFrame) % this.cols;
		var frameRow = Math.floor(this.animateFrame / this.cols) % this.rows;
		//console.log("col:"+frameCol+",row:"+frameRow)
		context.drawImage(bgImage, frameCol*(bgImage.width/this.cols), frameRow*(bgImage.height/this.rows),bgImage.width/this.cols,bgImage.height/this.rows, this.startX, this.startY, Game.width, Game.height);
		//console.log("drawing from:"+frameCol*(bgImage.width/cols)+"x"+frameRow*(bgImage.height/rows)+" on canvas"  )
		
		//context.drawImage(bgImage, this.startX, 0, Game.width, Game.height);
		//var t1 = performance.now();
		//if ((t1 - t0) > 0.25)console.log("#101 - BG1 took more than 0.25ms: " + (t1 - t0) + ".");
	};
	
	Background1.prototype.draw = function(context) {
		//var t0 = performance.now();
		context.shadowBlur = 0;
		context.drawImage(bgImage, this.startX, 0, Game.width, Game.height);
		//var t1 = performance.now();
		//if ((t1 - t0) > 0.25)console.log("#101 - BG1 took more than 0.25ms: " + (t1 - t0) + ".");
	};	
	
	Background2.prototype.draw = function(context) {
		//var t0 = performance.now();
		context.shadowBlur = 0;
		context.drawImage(bgImage, this.startX, 0, Game.width, Game.height);
		//var t1 = performance.now();
		//if ((t1 - t0) > 0.25)console.log("#101 - BG2 took more than 0.25ms: " + (t1 - t0) + ".");
	};	
	
	Fireball.prototype.draw = function(context) {
		//var t0 = performance.now();
		var frameCol = Math.floor(this.animateFrame) % 7;
		var frameRow = Math.floor(this.animateFrame / 7) % 2;
		context.drawImage(ball, frameCol*(ball.width/7), frameRow*(ball.height/2),ball.width/7,ball.height/2, this.x, this.y, this.width, this.height);
		//var t1 = performance.now();
		//if ((t1 - t0) > 0.25)console.log("#101 - fireball took more than 0.25ms: " + (t1 - t0) + ".");
	};
	
	Chocbar.prototype.draw = function(context) {
		//var t0 = performance.now();
		context.shadowBlur = 10;
		var frameCol = Math.floor(this.animateFrame) % 6;
		var frameRow = Math.floor(this.animateFrame / 6) % 4;
		//context.drawImage(heart, frameCol*(heart.width/7), frameRow*(heart.height/2),heart.width/7,heart.height/2, this.x, this.y, this.width, this.height);
		context.drawImage(bar, frameCol*(bar.width/6), frameRow*(bar.height/4),bar.width/6,bar.height/4, this.x, this.y, this.width, this.height);
		//var t1 = performance.now();
		//if ((t1 - t0) > 0.25)console.log("#101 - chocobar took more than 0.25ms: " + (t1 - t0) + ".");
	};
	
	Heart.prototype.draw = function(context) {
		//var t0 = performance.now();
		context.shadowBlur = 10;
		var frameCol = Math.floor(this.animateFrame) % 7;
		var frameRow = Math.floor(this.animateFrame / 7) % 2;
		context.drawImage(heart, frameCol*(heart.width/7), frameRow*(heart.height/2),heart.width/7,heart.height/2, this.x, this.y, this.width, this.height);
		//var t1 = performance.now();
		//if ((t1 - t0) > 0.25)console.log("#101 - heart took more than 0.25ms: " + (t1 - t0) + ".");
	};

    Player.prototype.draw = function(context) {
		//var t0 = performance.now();
		//var animateDivider = parseInt(animateTimer/4);
		context.shadowBlur = 10;
		var frameCol = Math.floor(this.animateFrame) % 6;
		var frameRow = 0;
		switch (Game.player.changeAnimationTo){
			case('eat'):
				if (eatTimer > 0) frameRow = 1;
				break;
			case('hurt'):
				if (hurtTimer > 0)frameRow = 2;
				break;
			case('life'):
				if (lifeTimer > 0)frameRow = 3;
				break;
			default:
				break;
		}
		context.drawImage(character, frameCol*(character.width/6),frameRow*character.height/4,character.width/6,character.height/4,this.x, this.y, this.width, this.height);
		//else context.drawImage(character, this.x, this.y, this.width, this.height);
		//var t1 = performance.now();
		//if ((t1 - t0) > 0.25)console.log("#101 - player took more than 0.25ms: " + (t1 - t0) + ".");
    };

    Player.prototype.moveLeft = function() {
      if (this.x>0) this.x -= (10 + difficulty/2);
    };

    Player.prototype.moveRight = function() {
      if (this.x<(Game.width-this.width)) this.x += (10 + difficulty/2);
    };

    Player.prototype.moveUp = function() {
      if (this.y>0) this.y -= 10;
    };

    Player.prototype.moveDown = function() {
      if (this.y<(Game.height-this.height)) this.y += (10 + difficulty/2);
    };
    
    Player.prototype.update = function() {
      if (Key.isDown(Key.UP)) this.moveUp();
      if (Key.isDown(Key.LEFT)) this.moveLeft();
      if (Key.isDown(Key.DOWN)) this.moveDown();
      if (Key.isDown(Key.RIGHT)) this.moveRight();
	  this.centerx = this.x + (this.width/2);
	  this.centery = this.y + (this.height/2);
	  if (eatTimer > 0) eatTimer -=1;
	  if (hurtTimer > 0) hurtTimer -=1;
	  if (lifeTimer > 0) lifeTimer -=1;
	  if (lifeTimer > 0) lifeTimer -=1;
	  this.animateFrame += 0.25;
    };
	
	Background.prototype.update = function() {
	  //this.startX -= bgAnimateSpeed;
	  //if (this.startX + Game.width < 0) {
		//this.startX = 0;
	  //}
	  this.animateFrame += 0.25;
    };
	
    Background1.prototype.update = function() {
	  this.startX -= bgAnimateSpeed;
	  if (this.startX + Game.width < 0) {
		this.startX = 0;
	  }
    };
	
	Background2.prototype.update = function() {
	   this.startX -= bgAnimateSpeed;
	  if (this.startX < 0) {
		this.startX = Game.width;
	  }
    };
	
	Fireball.prototype.update = function() {
      if (!fireballOnScreen){
		this.x = Math.ceil(Math.random() * (Game.width - this.width));
		this.y = -10;
		fireballOnScreen = true;
	  } 
	  else {
	     this.y += this.speed;
		 if (this.y > Game.height) fireballOnScreen = false;
	  }
	  this.centerx = this.x + (this.width/2);
	  this.centery = this.y + (this.height/2);
	  if (changeDifficulty == true) this.speed = this.originalSpeed + (difficulty/2);
	  this.animateFrame += 0.2;
    };
	
	Chocbar.prototype.update = function() {
      if (!chocbarOnScreen){
		this.x = Math.ceil(Math.random() * (Game.width - this.width));
		this.y = -10;
		chocbarOnScreen = true;
		chocDropped += 1;
	  } 
	  else {
	     this.y += this.speed;
		 if (this.y > Game.height) {
			 chocbarOnScreen = false;
			 Game.multiplier = 1;
			 Game.chocInARow = 0;
		 }
	  }
	  this.centerx = this.x + (this.width/2);
	  this.centery = this.y + (this.height/2);
	  if (changeDifficulty == true) this.speed = this.originalSpeed + (difficulty/3);
	  this.animateFrame += 0.5;
    };
	
	Heart.prototype.update = function() {
      if (!heartOnScreen){
			this.x = Math.ceil(Math.random() * (Game.width - this.width));
			this.y = -50;
			heartOnScreen = true;
			this.speed = 0;
	  } 
	  else {
		 if (this.speed == 0) {
			//if (Math.round(Math.random() * 1000) < 3) {
				//this.speed = this.originalSpeed + (difficulty/5);
			//}
			if (changeDifficulty) {
				this.speed = this.originalSpeed + (difficulty/5);
			}
		 }
	     this.y += this.speed;
		 if (this.y > Game.height) heartOnScreen = false;
	  }
	  this.centerx = this.x + (this.width/2);
	  this.centery = this.y + (this.height/2);
	  this.animateFrame += 0.5;
    };
	
	// Page Interaction Code
	
	// Get the modal
	var modal1 = document.getElementById('login');
	var modal2 = document.getElementById('signUp');

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal1) {
			modal1.style.display = "none";
		}
		if (event.target == modal2) {
			modal2.style.display = "none";
		}
	}
	
	function signUp(){
		//var email = document.getElementById("email").value;
		var tempUsername = document.getElementById("username").value;
		var tempPass = document.getElementById("password").value;
		var tempPassR = document.getElementById("passwordR").value;
		//var params = "email=" + email + "&username=" + username + "&password=" + pass + "&passwordR=" + passR;
		var params = "username=" + tempUsername + "&password=" + tempPass + "&passwordR=" + tempPassR;
		//console.log("params=" + params);
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				document.getElementById('signUpResponse').innerHTML = xmlhttp.responseText;
				if (xmlhttp.responseText == 'Signed Up Successfully!') {
					document.getElementById('signUpFormBtns').style.display = 'none';
					username = tempUsername;
					pass = tempPass;
					saveHighScore();
					listening = true;
					setTimeout(function(){ document.getElementById('signUp').style.display='none'; clearLogIn();}, 500);
				}
			}
		};
		xmlhttp.open("POST","signUp.php",true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(params);
	}
	
	function logIn(){
		var tempUsername = document.getElementById("loginUsername").value;
		var tempPass = document.getElementById("loginPassword").value;
		var params = "username=" + tempUsername + "&password=" + tempPass;
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				document.getElementById('logInResponse').innerHTML = xmlhttp.responseText;
				if (xmlhttp.responseText == 'Logged In Successfully!') {
					username = tempUsername;
					pass = tempPass;
					getHighScore();
				}
			}
		};
		xmlhttp.open("POST","login.php",true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(params);
	}
	
	function getHighScore(){
		var params = "username=" + username + "&password=" + pass;
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var returnedScore = xmlhttp.responseText;
				//console.log('returnedScore:'+returnedScore);
				if (returnedScore != -1) {
					if (returnedScore > highscore) highscore = returnedScore;
					else saveHighScore();
					setTimeout(function(){clearLogIn();}, 1000);
				}
			}
		};
		xmlhttp.open("POST","getScore.php",true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(params);
	}
	
	function getLeaderboard(){
		//return;
		//console.log('Geleaderboard called');
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				//console.log ('response recieved');
				//console.log(xmlhttp.responseText);
				document.getElementById('leaderboard').innerHTML = xmlhttp.responseText;
			}
		};
		xmlhttp.open("POST","getLeaderboard.php",true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlhttp.send();
	}
	
	function saveHighScore(){
		//return; //need to update
		var params = "username=" + username + "&password=" + pass + "&highscore=" + highscore;
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var response = xmlhttp.responseText;
				//console.log('scoreresponse:'+response);
				if (response == 'Saved Successfully.') {
					//console.log('going to ClearLogIn');
					clearLogIn();
				}
			}
		};
		xmlhttp.open("POST","saveScore.php",true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(params);
	}
	
	function clearSignUpForm(){
		document.getElementById('signUp').style.display = "none";
		//document.getElementById("email").value = "";
		document.getElementById("username").value = "";
		document.getElementById("password").value = "";
		document.getElementById("passwordR").value = "";
		document.getElementById('signUpResponse').innerHTML = "";
	}
	
	
	function clearLogIn(){
		//console.log('ClearLogIn');
		clearSignUpForm();
		document.getElementById('logInBtns').style.display='none';
		getLeaderboard();		
		document.getElementById('userInfo').innerHTML = "Welcome, " + username.bold() + "<br>HighScore: " + highscore.toString().bold();
	}
	