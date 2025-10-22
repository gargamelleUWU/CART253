/**
 * Bouncy Ball Ball Bonanza
 * Pippin Barr
 * 
 * The starting point for a ball-bouncing experience of
 * epic proportions!
 */

"use strict";


let isStopped = false;

// Our ball
const ball = {
    x: 300,
    y: 20,
    width: 10,
    height: 10,
    velocity: {
        x: 0,
        y: 8,
        previousY: 8,
    }
};

// Our paddle
const paddle = {
    x: 300,
    y: 280,
    width: 80,
    height: 10
};

let mouse = {
    velocity: {
        x: 0,
    }
}

const paddle2 = {
    x: 300,
    y: 20,
    width: 80,
    height: 10,
};

/**
 * Create the canvas
*/
function setup() {
    createCanvas(600, 300);
}


/**
 * Move and display the ball and paddle
*/
function draw() {
    background("#87ceeb");
    ballFreeze();

    movePaddle(paddle);
    moveBall(ball);

    handleBounce(ball, paddle);

    drawPaddle(paddle);
    drawBall(ball);
    trackMouse();
}

/**
 * Moves the paddle
 */
function movePaddle(paddle) {
paddle.x = mouseX;
paddle2.x = 600 - mouseX;
}

/**
 * Moves the ball passed in as a parameter
 */
function moveBall(ball) {
ball.y += ball.velocity.y;
ball.x += ball.velocity.x;
}

/**
 * Bounces the provided ball off the provided paddle
 */
function handleBounce(ball, paddle) {
    if (ball.y < 0 || ball.y > 300) {
        ball.velocity.y *= -1;
        ball.velocity.previousY = ball.velocity.y;
    }

    if (ball.x < 0 || ball.x > 600) {
        ball.velocity.x *= -1;
    }

    if (checkOverlap(paddle, ball)) {
        ball.velocity.y *=-1
        ball.velocity.previousY = ball.velocity.y;
        ball.velocity.x = mouse.velocity.x;
    }

    if (checkOverlap(paddle2, ball)) {
        ball.velocity.y *=-1
        ball.velocity.previousY = ball.velocity.y;
        ball.velocity.x = mouse.velocity.x;
    }

}

/**
 * Draws the specified paddle on the canvas
 */
function drawPaddle(paddle) {
    push();
    rectMode(CENTER);
    noStroke();
    fill("pink");
    rect(paddle.x, paddle.y, paddle.width, paddle.height);
    rect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    pop();
}

/**
 * Draws the specified ball on the canvas
 */
function drawBall(ball) {
    push();
    rectMode(CENTER);
    noStroke();
    fill("pink");
    rect(ball.x, ball.y, ball.width, ball.height);
    pop();
}

/**
 * Returns true if rectA and rectB overlap, and false otherwise
 * Assumes rectA and rectB have properties x, y, width and height to describe
 * their rectangles, and that rectA and rectB are displayed CENTERED on their
 * x,y coordinates.
 */
function checkOverlap(rectA, rectB) {
  return (rectA.x + rectA.width/2 > rectB.x - rectB.width/2 &&
          rectA.x - rectA.width/2 < rectB.x + rectB.width/2 &&
          rectA.y + rectA.height/2 > rectB.y - rectB.height/2 &&
          rectA.y - rectA.height/2 < rectB.y + rectB.height/2);
}

function ballFreeze() {
    if (isStopped === true) {
        ball.velocity.y = 0;
        ball.velocity.x = 0;
    } else if(isStopped === false)
        ball.velocity.y = ball.velocity.previousY;
}

function mousePressed () {
    isStopped = !isStopped;
}

function trackMouse() {
   mouse.velocity.x = (mouseX - pmouseX);
    console.log(mouse.velocity.x);
}