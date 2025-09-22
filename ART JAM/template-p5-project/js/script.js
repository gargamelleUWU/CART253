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

/**
 * Draw will be making the actual portrait.
*/
let xoff = 0;
let i = 0;
let randomizeX = 1;
let randomizeY = 2;

function draw() {
    background(0,0,0);
        beginShape();
    vertex(mouseX,mouseY);
    vertex(150,150);
    vertex(200,200);
    vertex(150,250);
    endShape(CLOSE);
    /*let a = noise(xoff);
    circle(width*noise(randomizeX), height*noise(randomizeY), a*250);
    fill(250,250,250,255*noise(i));
    console.log(xoff);
    console.log(a)

    xoff += 0.01;
    i += 0.02;
    randomizeX += 0.01;
    randomizeY += 0.01;
    */


}