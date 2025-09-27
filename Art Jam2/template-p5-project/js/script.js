//Global variables
let curtain;
let shyGuy;
let draggingCurtain = false;
let draggingShyGuy = false;
let opactiy = 0;
let lights = false;
let terminal = {
  x: 100,
  y: 100,
  w: 100,
  h: 50,
  c: null,
  on: true,
};
let pullBackRate = 0.3;

/*
* Setup function which creates my canvas, defines the attributes of my
* curtain and my shy guy.
*/
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  curtain = {
    x: 0,
    y: 0,
    w: width / 10,
    h: height,
    color: color(142, 6, 28, 230),
  };

  shyGuy = {
    x: width / 2,
    y: height / 2,
    size: 300,
    color: color(240,240,240),
  };

  terminal = {
    x: width * 0.9,
    y: height *0.05,
    w: 50,
    h: 50,
    c: color(200,0,0),
    on: true,
  };
}

/*
* This is where the magic happens, the draw function actually draws our
* elements such as the curtain and the shy guy. it also calls the other
* functions which make the project interactive.
*/
function draw() {
let centerX = width/2;
let centerY = height/2;
  background(255);

  // Draw ShyGuy
  fill(shyGuy.color);
  stroke(210);
  strokeWeight(4);
  circle(shyGuy.x, shyGuy.y, shyGuy.size);

  pull();     //  Calling pull function
  drawFace(); //  Calling drawFace function

  // Draw Curtain
  fill(curtain.color);
  noStroke();
  rect(curtain.x, curtain.y, curtain.w, curtain.h);
  flipLight();
  lightSwitch();
}

/* 
* Setting up the mouse pressed to set one of two boolean values to true.
* This is to fix the overlap on the previous iteration of the drag mechanic
*/
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

  if (mouseX > terminal.x && mouseX < terminal.x + terminal.w 
      && mouseY > terminal.y && mouseY < terminal.y + terminal.h) {
    terminal.on = !terminal.on
  } 
  console.log(terminal.on);
}

/*
* reseting the boolean values when the mouse is released
*/
function mouseReleased() {
  draggingShyGuy = false;
  draggingCurtain = false;
}

/*
* Pull function makes the project interactive.
* Allows the user to move the ShyGuy and to pull the curtain
*/
function pull() {
  pullBackRate = 0.3;
  let radius = shyGuy.size/2;

  if (draggingCurtain) {
    curtain.color = color(160, 6, 28, 230);
    curtain.w += movedX;
    pullBackRate = 0;
  } else {
    curtain.color = color(142, 6, 28, 230);
  }

  curtain.w -= pullBackRate;
  curtain.w = constrain(curtain.w, width / 10, width);

  if (draggingShyGuy) {
    shyGuy.x = mouseX;
    shyGuy.y = mouseY;
  }
}

/*
* drawFace creates the face of the ShyGuy and changes it when he is covered
* and uncovered. It also makes him blush when the cursor presses on him.
*/
function drawFace() {
  stroke(50);
  strokeWeight(5);
  noFill();

  let r = shyGuy.size / 2;

  if (curtain.w > shyGuy.x+50) {

  push();   //Eyes
    noStroke();
    fill(0);
    ellipse(shyGuy.x-45,shyGuy.y-18, 30, 50)
    ellipse(shyGuy.x+45,shyGuy.y-18, 30, 50)
  pop();

   curve(  //Left Brow
    shyGuy.x - r * 0.9, shyGuy.y - r * -0.1,
    shyGuy.x - r * 0.6, shyGuy.y - r * 0.35,
    shyGuy.x - r * 0.1, shyGuy.y - r * 0.35,
    shyGuy.x + r * 0.2, shyGuy.y - r * -0.1
  );
  curve(    //Right Brow
    shyGuy.x - r * 0.2, shyGuy.y - r * -0.1,
    shyGuy.x + r * 0.1, shyGuy.y - r * 0.35,
    shyGuy.x + r * 0.6, shyGuy.y - r * 0.35,
    shyGuy.x + r * 0.9, shyGuy.y - r * -0.1
  );
  curve(    //Mouth
    shyGuy.x - r+100, shyGuy.y -10,
    shyGuy.x - r+100, shyGuy.y +30,
    shyGuy.x + r-100, shyGuy.y +30,
    shyGuy.x + r-100, shyGuy.y -10
  )
} else {
  curve(   //Left Brow
    shyGuy.x - r * 0.9, shyGuy.y - r * 0.95,
    shyGuy.x - r * 0.6, shyGuy.y - r * 0.35,
    shyGuy.x - r * 0.1, shyGuy.y - r * 0.35,
    shyGuy.x + r * 0.2, shyGuy.y - r * 0.95
  );
  curve(    //right Brow
    shyGuy.x - r * 0.2, shyGuy.y - r * 0.95,
    shyGuy.x + r * 0.1, shyGuy.y - r * 0.35,
    shyGuy.x + r * 0.6, shyGuy.y - r * 0.35,
    shyGuy.x + r * 0.9, shyGuy.y - r * 0.95
  );
  curve(    //Left Eye
    shyGuy.x - r * 0.9, shyGuy.y - r * -0.1,
    shyGuy.x - r * 0.45, shyGuy.y - r * 0.15,
    shyGuy.x - r * 0.15, shyGuy.y - r * 0.15,
    shyGuy.x + r * 0.2, shyGuy.y - r * -0.1
  );
  curve(    //Right Eye
    shyGuy.x - r * 0.2, shyGuy.y - r * -0.1,
    shyGuy.x + r * 0.15, shyGuy.y - r * 0.15,
    shyGuy.x + r * 0.45, shyGuy.y - r * 0.15,
    shyGuy.x + r * 0.9, shyGuy.y - r * -0.1
  );
  curve(    //Mouth
    shyGuy.x - r+100, shyGuy.y +60,
    shyGuy.x - r+100, shyGuy.y +10,
    shyGuy.x + r-100, shyGuy.y +10,
    shyGuy.x + r-100, shyGuy.y +60
  );
  if (draggingShyGuy) { //Blush
    opactiy++;
    opactiy = constrain(opactiy, 0,200);
    noStroke();
    fill(222,93,131,opactiy);
    rect(shyGuy.x-100, shyGuy.y-50, 200,50);
  } else {
      opactiy = 0;
  }
}
}

function lightSwitch() {
  fill(terminal.c);
  stroke(0)
  rect(terminal.x, terminal.y, terminal.w, terminal.h);
}

function flipLight() {
  if (terminal.on === false) {
    push()
    fill(0, 0, 0, 240);
    rect(0,0,width,height);

    erase();
    circle(mouseX, mouseY, 200);
    noErase();
    pop()
  }
}


