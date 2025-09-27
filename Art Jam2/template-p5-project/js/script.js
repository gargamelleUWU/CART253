let curtain;
let shyGuy;
let draggingCurtain = false;
let draggingShyGuy = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  curtain = {
    x: 0,
    y: 0,
    w: width / 10,
    h: height,
    color: color(142, 6, 28, 250),
  };

  shyGuy = {
    x: width / 2,
    y: height / 2,
    size: 300,
    color: color(240,240,240),

    leftBrow: {

    },
    rightBrow: {
    },
    leftEye: {

    },
    rightEye: {

    },
    mouth: {

    },

  };
}

function draw() {
  background(255);

  // draw shyGuy
  fill(shyGuy.color);
  stroke(210);
  strokeWeight(4);
  circle(shyGuy.x, shyGuy.y, shyGuy.size);

  curve(shyGuy.x-shyGuy.size/2,shyGuy.y, shyGuy.x-100, shyGuy.y-100, shyGuy.x+100, shyGuy.y+100, shyGuy.x+shyGuy.size/2, shyGuy.y);

  // draw curtain
  fill(curtain.color);
  noStroke();
  rect(curtain.x, curtain.y, curtain.w, curtain.h);

  // update positions
  pull();
}

//setting up the mouse pressed to set one of two boolean values to true.
//this is to fix the overlap on the previous iteration of the drag mechanic
function mousePressed() {
  let radius = shyGuy.size / 2;
  let distance = dist(mouseX, mouseY, shyGuy.x, shyGuy.y);
  let hoverShyGuy = distance < radius;
  let hoverCurtain = mouseX <= curtain.w;

  if (hoverCurtain) {
    draggingCurtain = true;
  } else if (hoverShyGuy) {
    draggingShyGuy = true;
  }
}

//reseting the boolean values when the mouse is released
function mouseReleased() {
  draggingShyGuy = false;
  draggingCurtain = false;
}

//main pull function that 
function pull() {
  let pullBackRate = 0.3;

  // curtain movement
  if (draggingCurtain) {
    curtain.color = color(160, 6, 28, 250);
    curtain.w += movedX;
    pullBackRate = 0;
  } else {
    curtain.color = color(142, 6, 28, 250);
  }

  curtain.w -= pullBackRate;
  curtain.w = constrain(curtain.w, width / 10, width);

  // shyGuy movement
  if (draggingShyGuy) {
    shyGuy.x = mouseX;
    shyGuy.y = mouseY;
  }
}
