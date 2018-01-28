var canvas;
var ctx;

var gridW, gridH;
var directions = Object.freeze({"up":0, "right":1, "down":2, "left":3})
var snakeDirection;
var nextSnakeDirection;
var snakeLength;
var bodySize = 20;
var bodyInnerSize = 18;
var bodyPositions = [];
var speed;
var xSpeed, ySpeed;
var gameover;

var food = [];

function init(){
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	gridW = gridH = 20;
	ctx.lineWidth = 2;

	food.splice(0, food.length);
	bodyPositions.splice(0, bodyPositions.length);
	bodyPositions.push([9, 10]);
	bodyPositions.push([10, 10]);
	bodyPositions.push([11, 10]);
	bodyPositions.push([12, 10]);

	snakeDirection = directions.right;
	nextSnakeDirection = directions.right;
	gameover = false;

	spawnFood();
}

function gameLoop(){
  getInput();
  update();
  draw();
}

function getInput(){
  $(window).keypress(function(e) {
    switch (e.which) {
			case 97:
				if(snakeDirection !== directions.right){
					nextSnakeDirection = directions.left;
				}
				break;
			case 119:
				if(snakeDirection !== directions.down){
					nextSnakeDirection = directions.up;
				}
				break;
			case 100:
				if(snakeDirection !== directions.left){
					nextSnakeDirection = directions.right;
				}
				break;
			case 115:
				if(snakeDirection !== directions.up){
					nextSnakeDirection = directions.down;
				}
				break;
      case 32:
			case 13:
				if(gameover){
					init();
				}
        break;
      default: break;
    }
  });

	$(window).keydown(function(e) {
    switch (e.which) {
			case 37:
				if(snakeDirection !== directions.right){
					nextSnakeDirection = directions.left;
				}
				break;
			case 38:
				if(snakeDirection !== directions.down){
					nextSnakeDirection = directions.up;
				}
				break;
			case 39:
				if(snakeDirection !== directions.left){
					nextSnakeDirection = directions.right;
				}
				break;
			case 40:
				if(snakeDirection !== directions.up){
					nextSnakeDirection = directions.down;
				}
				break;
			default: break;
		}
  });
}

function update(){
	if(!gameover){
		moveSnake();
		collisionCheck();
	}
}

function moveSnake() {
	switch (nextSnakeDirection) {
		case directions.up:
			xSpeed = 0;		 	ySpeed = -1;     break;
		case directions.right:
			xSpeed = 1;	 		ySpeed = 0;      break;
		case directions.down:
			xSpeed = 0; 	 	ySpeed = 1;      break;
		case directions.left:
			xSpeed = -1;		ySpeed = 0;      break;
		default:
			break;
	}

	snakeDirection = nextSnakeDirection;
	let newHeadX = bodyPositions[bodyPositions.length - 1][0] + xSpeed;
	let newHeadY = bodyPositions[bodyPositions.length - 1][1] + ySpeed;
	bodyPositions.push([newHeadX, newHeadY]);

	if(!(bodyPositions[bodyPositions.length - 1][0] === food[0][0] &&
		 bodyPositions[bodyPositions.length - 1][1] === food[0][1])) {
			 bodyPositions.splice(0, 1);
	 } else {
		 food.splice(0, 1);
		 spawnFood();
	 }
}

function collisionCheck() {
	if(isOutOfBoundsX(bodyPositions[bodyPositions.length - 1][0]) ||
		 isOutOfBoundsY(bodyPositions[bodyPositions.length - 1][1]) ||
		 headEatsBody()) {
		gameover = true;
	}
}

function isOutOfBoundsX(pos) {
	if(pos === -1 || pos === 32){
		return true;
	}

	return false
}

function isOutOfBoundsY(pos) {
	if(pos === -1 || pos === 24){
		return true;
	}

	return false
}

function spawnFood() {
	let newX = Math.floor(Math.random() * 31);
	let newY =  Math.floor(Math.random() * 23);

	for(let i = 0; i < bodyPositions.length; i++){
		if(newX === bodyPositions[i][0] && newY === bodyPositions[i][1])
		spawnFood();
		break;
	}

	food.push([newX, newY]);
}

function headEatsBody() {
	let headX = bodyPositions[bodyPositions.length - 1][0];
	let headY = bodyPositions[bodyPositions.length - 1][1];

	for(let i = 0; i < bodyPositions.length - 2; i++) {
		if(headX === bodyPositions[i][0] && headY === bodyPositions[i][1]){
			return true;
		}
	}

	return false;
}

function draw(){
	clearCanvas();
	drawSnake();
	drawFood();

	if(gameover) {
		drawGameOverText();
	}
}

function clearCanvas() {
	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
	ctx.beginPath();
}

function drawSnake() {
	let snakeColour = "";
	for(var i = 0; i < bodyPositions.length; i++){
		if(i === bodyPositions.length - 1){
			snakeColour = "#00FF33";
		} else {
			snakeColour = "#00AA00";
		}

		if(gameover){
			snakeColour = "#882222";
		}

		drawSquare(bodyPositions[i][0] * gridW, bodyPositions[i][1] * gridH, snakeColour);
	}

	redBodyCountIncFlag = false;
}

function drawFood(){
	for(var i = 0; i < food.length; i++) {
		drawSquare(food[i][0] * gridW, food[i][1] * gridH, "#0044AA");
	}
}

function drawSquare(x, y, colour){
	roundRect(x, y, bodySize, bodySize, 3, colour);
}

function roundRect(x, y, width, height, radius, colour) {
  radius = {tl: radius, tr: radius, br: radius, bl: radius};
	ctx.fillStyle = colour;

  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();

  ctx.fill();
  ctx.stroke();
}

function drawGameOverText() {
	ctx.font = "30px Verdana";
	ctx.textAlign = "center";
	ctx.fillStyle = "#ff0000";
	ctx.fillText("Game Over :(", canvas.width/2, canvas.height/2);
	ctx.font = "20px Verdana";
	ctx.fillText("Press enter or space to restart.", canvas.width/2, canvas.height/2 + 30);
}

$( document ).ready(function() {
	init();
	setInterval(gameLoop, 200);
});
