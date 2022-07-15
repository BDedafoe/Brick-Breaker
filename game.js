//Creating the Canvas
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
//Making the ball move
var ballRadius = 10;
let x = canvas.width/2;
let y = canvas.height-30;
//You need to add values to x and y after every frame to make it look like the ball is moving
//list variables here and then add this to the 'draw' function on the bottom
let dx = 2;
let dy = -2;
//variables for the paddle function 
//list variables here and then add this to the 'draw' function on the bottom
var paddleHeight = 12;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
//variables for the paddle movement if pressed left or right
var rightPressed = false;
var leftPressed = false;
//Making the brick variables at the top to destroy with the ball. Add this to the bricks function
var brickRowCount = 5; //making the start with three bricks high
var brickColumnCount = 5;  //making the start with 5 bricks across
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 50;
var brickOffsetLeft = 30;
//Add variable to track player's score
var score = 0;
//Add variable to track number of player lives
var lives = 3;
//add eventListeners to work when you click left or right
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//add eventListeners to work when you move your mouse left or right
document.addEventListener("mousemove", mouseMoveHandler, false);

//The bricks function to set up the bricks
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//function for the left and right bar movement
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = false;
    }
}
//function for moving the paddle with your mouse left or right
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

//function for removing bricks once they have been hit with the ball
function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;        //needs to be added to track player's score
                    if(score == brickRowCount*brickColumnCount) {
                        alert("You Win!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}
//this function will run over and over with diff variables to change postions, etc
function drawBall () {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2); 
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    var paddleGradient = ctx.createLinearGradient(480, 25, 20, 18);
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    paddleGradient.addColorStop(0, 'blue');
    paddleGradient.addColorStop(0.5, 'aqua');
    paddleGradient.addColorStop(1, 'blue');
    ctx.fillStyle = paddleGradient;
    ctx.fill();
    ctx.closePath();
}
//making the bricks at the top
function drawBricks() {
    var gradient = ctx.createLinearGradient(150, 10, 300, 150);
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                gradient.addColorStop(0, 'blue');
                gradient.addColorStop(0.5, 'aqua');
                gradient.addColorStop(1, 'blue');
                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
//function for tracking player's score
function drawScore() {
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "hotpink";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "limegreen";
    ctx.fillText("Lives: "+lives, canvas.width-75, 20);
}

//********this is the MAIN FUNCTION OF THE GAME*******
//Updating the frame each time
function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    //if Function to make the ball bounce off of the walls
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
            alert("GAME OVER");
            document.location.reload();
            }
        
        else {
            x = canvas.width/2;
            y = canvas.height-30;
            dx = 3;
            dy = -3;
            paddleX = (canvas.width-paddleWidth)/2; 
            }
        }  
    }
    
    //if Function to make the paddle move left or right
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 6;   //the 6 is the speed of which the paddle moves
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 6;   //the 6 is the speed of which the paddle moves
    }

    //making the ball move variables
    x += dx;            //this function provides the ball's position on every frame
    y += dy;            //this function provides the ball's position on every frame
    requestAnimationFrame(draw);    //this function causes draw over and over again in a loop 

}
draw();