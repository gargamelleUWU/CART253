let curtain;
let shyGuy;
let draggingCurtain = false;
let draggingShyGuy = false;
let opactiy = 0;

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
}

function draw() {
let centerX = width/2;
let centerY = height/2;
  background(255);

  // draw shyGuy
  fill(shyGuy.color);
  stroke(210);
  strokeWeight(4);
  circle(shyGuy.x, shyGuy.y, shyGuy.size);

  // update positions
  pull();
  drawEyebrows();
  // draw curtain
  fill(curtain.color);
  noStroke();
  rect(curtain.x, curtain.y, curtain.w, curtain.h);


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
  let radius = shyGuy.size/2;

  // curtain movement
  if (draggingCurtain) {
    curtain.color = color(160, 6, 28, 230);
    curtain.w += movedX;
    pullBackRate = 0;
  } else {
    curtain.color = color(142, 6, 28, 230);
  }

  curtain.w -= pullBackRate;
  curtain.w = constrain(curtain.w, width / 10, width);

  // shyGuy movement
  if (draggingShyGuy) {
    shyGuy.x = mouseX;
    shyGuy.y = mouseY;
    let opactiy = 0;
  }

/*
  if (curtain.w > shyGuy.y + (radius-100)) {

    push()
    stroke(150);
    line(shyGuy.x-100, shyGuy.y-50,shyGuy.x-20, shyGuy.y-50);
    line(shyGuy.x+100, shyGuy.y-50,shyGuy.x+20, shyGuy.y-50);
    pop()

    fill(20)
    ellipse(shyGuy.x-50, shyGuy.y-20, 30,50);
    ellipse(shyGuy.x+50, shyGuy.y-20, 30,50);
    opactiy = 0;
  } else {
    push()
    stroke(150);
    line(shyGuy.x-100, shyGuy.y-60,shyGuy.x-20, shyGuy.y-40);
    line(shyGuy.x+100, shyGuy.y-60,shyGuy.x+20, shyGuy.y-40);
    pop()
    
    stroke(20);
    line(shyGuy.x-70, shyGuy.y-20,shyGuy.x-20, shyGuy.y-10);
    line(shyGuy.x+70, shyGuy.y-20,shyGuy.x+20, shyGuy.y-10);

    
    opactiy++;
    opactiy = constrain(opactiy,0,180);

    noStroke()
    fill(222,93,131,opactiy);
    rect(shyGuy.x-100, shyGuy.y-60, 200, 80);
  }
    */
}

function drawEyebrows() {
  stroke(50);
  strokeWeight(5);
  noFill();

  let r = shyGuy.size / 2;

  if (curtain.w > shyGuy.y + (r-100)) {
//Left Brow
  curve(
    shyGuy.x - r * 0.9, shyGuy.y - r * 0.95,   // control1
    shyGuy.x - r * 0.6, shyGuy.y - r * 0.35,   // start
    shyGuy.x - r * 0.1, shyGuy.y - r * 0.35,   // end
    shyGuy.x + r * 0.2, shyGuy.y - r * 0.95    // control2
  );

  //right Brow
  curve(
    shyGuy.x - r * 0.2, shyGuy.y - r * 0.95,   // control1
    shyGuy.x + r * 0.1, shyGuy.y - r * 0.35,   // start
    shyGuy.x + r * 0.6, shyGuy.y - r * 0.35,   // end
    shyGuy.x + r * 0.9, shyGuy.y - r * 0.95    // control2
  );

  //Left Eye
  curve(
    shyGuy.x - r * 0.9, shyGuy.y - r * -0.1,   // control1
    shyGuy.x - r * 0.45, shyGuy.y - r * 0.15,   // start
    shyGuy.x - r * 0.15, shyGuy.y - r * 0.15,   // end
    shyGuy.x + r * 0.2, shyGuy.y - r * -0.1   // control2
  );

  //Right Eye
  curve(
    shyGuy.x - r * 0.2, shyGuy.y - r * -0.1,   // control1
    shyGuy.x + r * 0.15, shyGuy.y - r * 0.15,   // start
    shyGuy.x + r * 0.45, shyGuy.y - r * 0.15,   // end
    shyGuy.x + r * 0.9, shyGuy.y - r * -0.1    // control2
  );

  //Mouth
  curve(
    shyGuy.x - r+100, shyGuy.y +60,
    shyGuy.x - r+100, shyGuy.y +10,
    shyGuy.x + r-100, shyGuy.y +10,
    shyGuy.x + r-100, shyGuy.y +60
  );
} else {
  //Eyes Open
  push();
  noStroke();
  fill(0);
   ellipse(shyGuy.x-45,shyGuy.y-18, 30, 50)
   ellipse(shyGuy.x+45,shyGuy.y-18, 30, 50)
   pop();

   //Left Brow
   curve(
    shyGuy.x - r * 0.9, shyGuy.y - r * -0.1,   // control1
    shyGuy.x - r * 0.6, shyGuy.y - r * 0.35,   // start
    shyGuy.x - r * 0.1, shyGuy.y - r * 0.35,   // end
    shyGuy.x + r * 0.2, shyGuy.y - r * -0.1   // control2
  );

  //Right Brow
  curve(
    shyGuy.x - r * 0.2, shyGuy.y - r * -0.1,   // control1
    shyGuy.x + r * 0.1, shyGuy.y - r * 0.35,   // start
    shyGuy.x + r * 0.6, shyGuy.y - r * 0.35,   // end
    shyGuy.x + r * 0.9, shyGuy.y - r * -0.1    // control2
  );

  //Mouth
  curve(
    shyGuy.x - r+100, shyGuy.y -10,
    shyGuy.x - r+100, shyGuy.y +30,
    shyGuy.x + r-100, shyGuy.y +30,
    shyGuy.x + r-100, shyGuy.y -10
  )
}
}


