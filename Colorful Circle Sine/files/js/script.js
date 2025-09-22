/* 
let currentColor, targetColor;
let amt = 0;
//let shapeType = 'traingle';

function setup(){
    createCanvas(windowWidth, windowHeight);
    background(30);

    currentColor = color(random(255), random(255), random(255));
    targetColor = color(random(255), random(255), random(255));
}

function draw() {
    Z = random(1,1.1);
    W = random(1, 1.1);
    let blended = lerpColor(currentColor, targetColor, amt);

    fill(blended);
    noStroke();
    let X = map(sin(frameCount*0.05 + PI/2), 1, -1, 0, width)
    let Y = map(cos(frameCount*0.003 + PI/2), 1, -1, 0, height)
    ellipse(X, Y, 20, 20);

    amt += 0.02;

    if (amt >= 1) {
        currentColor = targetColor;
        targetColor = color(random(255), random(255), random(255));
        amt = 0;
    }
}

function draw() {

}

function mousePressed() {
    background(30);

    currentColor = color(random(255), random(255), random(255));
    targetColor = color(random(255), random(255), random(255));
    amt = 0;
}
*/
let currentColor, targetColor;
let amt = 0;
let prevX, prevY;

function setup() {
  createCanvas(windowWidth, windowHeight);

  currentColor = color(random(255), random(255), random(255));
  targetColor = color(random(255), random(255), random(255));

  prevX = mouseX;
  prevY = mouseY;

  noStroke();
}

function draw() {
  // Semi-transparent background for fading trails
  fill(30, 30, 30, 25); 
  rect(0, 0, width, height);

  // Smooth color transition
  let blended = lerpColor(currentColor, targetColor, amt);
  fill(blended);

  // Draw multiple ellipses between prev and current mouse position
  let steps = 12; // adjust for smoother trail
  for (let i = 0; i <= steps; i++) {
    let x = lerp(prevX, mouseX, i / steps);
    let y = lerp(prevY, mouseY, i / steps);
    ellipse(x, y, 100, 100);
  }

  // Update color interpolation
  amt += 0.02;
  if (amt >= 1) {
    currentColor = targetColor;
    targetColor = color(random(255), random(255), random(255));
    amt = 0;
  }

  // Save current mouse position for next frame
  prevX = mouseX;
  prevY = mouseY;
}

// Reset canvas on mouse click
function mousePressed() {
  background(30);
  currentColor = color(random(255), random(255), random(255));
  targetColor = color(random(255), random(255), random(255));
  amt = 0;
}
