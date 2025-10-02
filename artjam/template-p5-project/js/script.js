/*
* Art Jam Assignment
* Felix Dionne ID: 40316928
* This is my take on a self portrait, definitely not standard
* but I had alot of fun making this one.
* I incorporated some interactive elements, such as a curtain,
* and a light switch which can help our Shy Guy feel far more
* comfortable 
*/

//Global variables which can be used and seen by other functions in the program 
let curtain; 
let shyGuy;
let draggingCurtain = false;
let draggingShyGuy = false;
let opactiy = 0;
let sky = 0;
let terminal = {  //Initializing Terminal object (light switch)
  x: 100,
  y: 100,
  w: 100,
  h: 50,
  c: null,
  on: true,
  stroke: (0),
};
let pullBackRate = 0.5; //the rate at which my curtain pulls back

/*
* Setup function which creates my canvas, defines the attributes of my
* curtain and my shy guy.
*/
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  blackout = createGraphics(width, height);

  curtain = { //Curtain object (the curtain that can be dragged over the ShyGuy)
    x: 0,
    y: 0,
    w: width / 10,
    h: height,
    color: color(142, 6, 28, 230),
  };

  shyGuy = {  //ShyGuy object (the main little guy that is very uncomfortable because he is so shy)
    x: width / 2,
    y: height / 2,
    size: 300,
    color: color(240),
    strokeColor: color(150),
    faceColor: color(60),
  };

  terminal = {  //Setting proper values for the Terminal Object
    x: width * 0.9,
    y: height *0.05,
    w: 50,
    h: 50,
    c: color(150,0,0),
    on: true,
    stroke: (0),
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
  background(sky);

  // Draw ShyGuy
  fill(shyGuy.color);
  stroke(shyGuy.strokeColor);
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
  showInteract();
}

/* 
* Setting up the mouse pressed to set one of two boolean values to true.
* This is to fix the overlap on the previous iteration of the drag mechanic.
* When I dragged the Curtain over the shyguy or vice versa, the other element would get scooped
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
* There are many additional conditions within this function to
* ensure the program works as intended. Making sure the ShyGuy
* and curtain don't get dragged at the same time, making sure
* the ShyGuy or curtain can't be moved when the lights are out
*/
function pull() {
  pullBackRate = 0.3;
  let radius = shyGuy.size/2;

  if (terminal.on === true) {
    if (draggingCurtain) {
      curtain.w += movedX;
      pullBackRate = 0;
    }

    curtain.w -= pullBackRate;
    curtain.w = constrain(curtain.w, width / 10, width * 0.87);

    if (draggingShyGuy) {
      shyGuy.x = mouseX;
      shyGuy.y = mouseY;
      if (shyGuy.x <= radius) {
        shyGuy.x = radius;
      }
      if (shyGuy.x >= width-radius) {
        shyGuy.x = width-radius;
      }
      if (shyGuy.y <= radius) {
        shyGuy.y = radius;
      }
      if (shyGuy.y >= height-radius) {
        shyGuy.y = height-radius;
      }
    }
  }
}

/*
* drawFace creates the face of the ShyGuy and changes it when he is covered
* and uncovered. It also makes him blush when the cursor presses on him.
*/
function drawFace() {
  stroke(shyGuy.faceColor);
  strokeWeight(5);
  noFill();
  let r = shyGuy.size / 2;

/*
 * The following bit of code simply draws the face of the ShyGuy in different emotions
*/

  if (terminal.on === false && curtain.w > shyGuy.x+50) {
  //  Lights off and Covered
  //  Super Happy
    curve(    //Left Eye
      shyGuy.x - r * 0.9, shyGuy.y - r * -0.3,
      shyGuy.x - r * 0.45, shyGuy.y - r * 0.15,
      shyGuy.x - r * 0.15, shyGuy.y - r * 0.15,
      shyGuy.x + r * 0.2, shyGuy.y - r * -0.3
    );
    curve(    //  Right Eye
      shyGuy.x - r * 0.2, shyGuy.y - r * -0.3,
      shyGuy.x + r * 0.15, shyGuy.y - r * 0.15,
      shyGuy.x + r * 0.45, shyGuy.y - r * 0.15,
      shyGuy.x + r * 0.9, shyGuy.y - r * -0.3
    );
    curve(   // Left Brow
      shyGuy.x - r * 0.9, shyGuy.y - r * -1,
      shyGuy.x - r * 0.6, shyGuy.y - r * 0.3,
      shyGuy.x - r * 0.1, shyGuy.y - r * 0.3,
      shyGuy.x + r * 0.2, shyGuy.y - r * -1
    );
    curve(    //  Right Brow
      shyGuy.x - r * 0.2, shyGuy.y - r * -1,
      shyGuy.x + r * 0.1, shyGuy.y - r * 0.3,
      shyGuy.x + r * 0.6, shyGuy.y - r * 0.3,
      shyGuy.x + r * 0.9, shyGuy.y - r * -1
    );
    curve(    //  Mouth
      shyGuy.x - r+100, shyGuy.y -100,
      shyGuy.x - r+100, shyGuy.y +30,
      shyGuy.x + r-100, shyGuy.y +30,
      shyGuy.x + r-100, shyGuy.y -100
    );
  } else if (curtain.w > shyGuy.x+50) {
    //  Only Covered
    //  Medium Happy
    push();   //Eyes
      noStroke();
      fill(0);
      ellipse(shyGuy.x+45,shyGuy.y-18, 30, 50)  //  right eye
    pop();
    curve(    //  Left Eye
      shyGuy.x - r * 0.9, shyGuy.y - r * -0.1,
      shyGuy.x - r * 0.45, shyGuy.y - r * 0.15,
      shyGuy.x - r * 0.15, shyGuy.y - r * 0.15,
      shyGuy.x + r * 0.2, shyGuy.y - r * -0.1
    );
    curve(    //  Left Brow
      shyGuy.x - r * 0.9, shyGuy.y - r * 0.95,
      shyGuy.x - r * 0.6, shyGuy.y - r * 0.35,
      shyGuy.x - r * 0.1, shyGuy.y - r * 0.35,
      shyGuy.x + r * 0.2, shyGuy.y - r * 0.95
    );
    curve(    //  Right Brow
      shyGuy.x - r * 0.2, shyGuy.y - r * -0.1,
      shyGuy.x + r * 0.1, shyGuy.y - r * 0.35,
      shyGuy.x + r * 0.6, shyGuy.y - r * 0.35,
      shyGuy.x + r * 0.9, shyGuy.y - r * -0.1
    );
    //mouth
    ellipse(shyGuy.x, shyGuy.y+20,40,30)
  } else if (terminal.on === false) {
    //  Only in Dark
    //  Medium Happy
    push();   //  Eyes
      noStroke();
      fill(0);
      ellipse(shyGuy.x-45,shyGuy.y-18, 30, 50)
      ellipse(shyGuy.x+45,shyGuy.y-18, 30, 50)
    pop();

    curve(   // Left Brow
      shyGuy.x - r * 0.9, shyGuy.y - r * -0.1,
      shyGuy.x - r * 0.6, shyGuy.y - r * 0.35,
      shyGuy.x - r * 0.1, shyGuy.y - r * 0.35,
      shyGuy.x + r * 0.2, shyGuy.y - r * -0.1
    );
    curve(    //  Right Brow
      shyGuy.x - r * 0.2, shyGuy.y - r * -0.1,
      shyGuy.x + r * 0.1, shyGuy.y - r * 0.35,
      shyGuy.x + r * 0.6, shyGuy.y - r * 0.35,
      shyGuy.x + r * 0.9, shyGuy.y - r * -0.1
    );
    curve(    //  Mouth
      shyGuy.x - r+100, shyGuy.y -10,
      shyGuy.x - r+100, shyGuy.y +30,
      shyGuy.x + r-100, shyGuy.y +30,
      shyGuy.x + r-100, shyGuy.y -10
    )
  } else {
    // Nothing
    // Upset
    curve(    //  Left Brow
      shyGuy.x - r * 0.9, shyGuy.y - r * 0.95,
      shyGuy.x - r * 0.6, shyGuy.y - r * 0.35,
      shyGuy.x - r * 0.1, shyGuy.y - r * 0.35,
      shyGuy.x + r * 0.2, shyGuy.y - r * 0.95
    );
    curve(    //  right Brow
      shyGuy.x - r * 0.2, shyGuy.y - r * 0.95,
      shyGuy.x + r * 0.1, shyGuy.y - r * 0.35,
      shyGuy.x + r * 0.6, shyGuy.y - r * 0.35,
      shyGuy.x + r * 0.9, shyGuy.y - r * 0.95
    );
    curve(    //  Left Eye
      shyGuy.x - r * 0.9, shyGuy.y - r * -0.1,
      shyGuy.x - r * 0.45, shyGuy.y - r * 0.15,
      shyGuy.x - r * 0.15, shyGuy.y - r * 0.15,
      shyGuy.x + r * 0.2, shyGuy.y - r * -0.1
    );
    curve(    //  Right Eye
      shyGuy.x - r * 0.2, shyGuy.y - r * -0.1,
      shyGuy.x + r * 0.15, shyGuy.y - r * 0.15,
      shyGuy.x + r * 0.45, shyGuy.y - r * 0.15,
      shyGuy.x + r * 0.9, shyGuy.y - r * -0.1
    );
    curve(    //  Mouth
      shyGuy.x - r+100, shyGuy.y +60,
      shyGuy.x - r+100, shyGuy.y +10,
      shyGuy.x + r-100, shyGuy.y +10,
      shyGuy.x + r-100, shyGuy.y +60
    );
     if (draggingShyGuy) {   //  Blush
    //   for (let i = 0; i <200; i++) {  //This is me trying to add a feathered edge to the stupid blush. ARGh
    //     noStroke();
    //     fill(222,93,131, 2)
    //     ellipse(shyGuy.x, shyGuy.y-100, 200-(i), 50-(i/4));
    //   }
    // }
      opactiy++;
      opactiy = constrain(opactiy, 0,200);
      noStroke();
      fill(222,93,131,opactiy);
      rect(shyGuy.x-100, shyGuy.y-50, 200,50);
    } else {
      opactiy=0;
    }
  }
  console.log(terminal.on, curtain.w, shyGuy.x+50);
}

function lightSwitch() {
  fill(terminal.c);
  stroke(terminal.stroke)
  rect(terminal.x, terminal.y, terminal.w, terminal.h);
}

function flipLight() {
    blackout.clear()
  if (terminal.on === false) {
    sky = color(46,68,130);
    curtain.w -= pullBackRate;
    curtain.w = constrain(curtain.w, width / 10, width * 0.87);

    blackout.fill(0,0,0,240);
    blackout.rect(0,0, width, height);

    blackout.erase();
    blackout.circle(mouseX, mouseY, 250);
    blackout.noErase();

    image(blackout, 0 ,0);
  } else if (terminal.on === true) {
    sky = color(200, 230,240);
  }
}

function showInteract() {
  let radius = shyGuy.size / 2;
  let distance = dist(mouseX, mouseY, shyGuy.x, shyGuy.y);
  let hoverShyGuy = distance < radius;
  let hoverCurtain = mouseX <= curtain.w;

  if (hoverCurtain && !mouseIsPressed && terminal.on) {
    curtain.color = color(255, 6, 28, 230);
  } else {
    curtain.color = color(142, 6, 28, 230);
  }

  if (hoverShyGuy && !mouseIsPressed && terminal.on) {
    shyGuy.color = color(255,255,255);
    shyGuy.strokeColor = color(220);
    shyGuy.faceColor = color(120);
  } else {
    shyGuy.color = color(240,240,240);
    shyGuy.strokeColor = color(150);
    shyGuy.faceColor = color(60);
  }

  if (mouseX > terminal.x && mouseX < terminal.x + terminal.w 
      && mouseY > terminal.y && mouseY < terminal.y + terminal.h) {
        terminal.c = color(250,0,0);
        terminal.stroke = color(50);
      } else {
        terminal.c = color(150,0,0);
        terminal.stroke = color(0);
      }
}


