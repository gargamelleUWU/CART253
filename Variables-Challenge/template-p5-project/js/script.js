/**
 * Mr. Furious
 * Pippin Barr
 *
 * A guy who becomes visibly furious!
 */

"use strict";

// Our friend Mr. Furious
let i=0;
let mrFurious = {
  // Position and size
  size: 100,

  // Colour
  fill: {
    r: 255, g: 225, b: 225
  }
};

let sky = {
    r: 135, g: 206, b: 235
}

/** Create the canvas */
function setup() {
  createCanvas(windowWidth, windowHeight);
}

/** Draw (and update) Mr. Furious */

    let colorSwitcher = 0;
    let colorSwitcherRate = 2

function draw() {
    sky.b = map(sin(frameCount*0.01 + (PI/2)), -1, 1, 0, 235);
    sky.g = map(sin(frameCount*0.01 + (PI/2)), -1, 1, 0, 206);
    sky.r = map(sin(frameCount*0.01 + (PI/2)), -1, 1, 0, 135);
    background(sky.r, sky.g, sky.b);
    console.log(colorSwitcher);

    push()
    fill(100,0,100);
    let birdX = map(cos(frameCount*0.08), -1, 1, 35, width-35);
    let birdY = map(cos(frameCount*0.5), -1, 1, 50, 60);
    circle(birdX, birdY, 35);
    pop()

    mrFurious.fill.g += colorSwitcher;
    mrFurious.fill.b += colorSwitcher;
  
    if (mrFurious.fill.g < 1) {
        colorSwitcher = colorSwitcherRate;
    }
    if (mrFurious.fill.g >= 225) {
        colorSwitcher = -1*colorSwitcherRate;
    }

  push();
  noStroke();
  fill(mrFurious.fill.r, mrFurious.fill.g, mrFurious.fill.b);
  ellipse(map(sin(frameCount)*sin(frameCount*0.01), -1, 1, (width/2)-10, (width/2)+10), windowHeight/2, mrFurious.size);
  pop();
}
