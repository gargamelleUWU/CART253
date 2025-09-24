/**
 * Art Jam Assignment
 * Felix Dionne
 * 
 * We be making a self portrait. I don't know how yet, but that's what we doing!
 */

"use strict";

/**
 * Setting up a nearly black canvas.
*/
function setup() {
    createCanvas (windowWidth, windowHeight);
    background(20,20,20);
}

function mouseMoved() {
    isMoving = true;
}

function draw() {
const mousePosition = dist(mouseX, mouseY, width/2, height/2);
const mouseOverCircle = (mousePosition < 350/2);
    circle(width/2, height/2, 350);
    if (mouseOverCircle && isMoving)
    {
       fill(10,10,200);  
    } else {
        fill(255,255,255);
    }
}