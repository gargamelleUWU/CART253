/**
 * Instructions Challenge
 * Felix Dionne (40316928) / J.J Gagnon
 * 
 * This project will just be testing and getting a little comfortable with p5
 * Please do not remove a grade from my grade... Actually, feel free to boost my grade a little :)
 */

"use strict";

/**
 * Setting up variables to define the canvas
 * size in respect to the window size
 */
let window_height;
let window_width;

function setup() {
    window_height = windowHeight;
    window_width = windowWidth;
    createCanvas(window_width, window_height);
    background(0,0,0);
}

/**
 * My draw function is creating a wonderful "Landscape".
 * One that adapts to any window size.
*/
function draw() {
    let radius = sin(frameCount*0.01) * 150 + width/2
    noFill();
    stroke(255,255,255);
    circle(width/2, height/2, radius);

    let radius2 = sin(frameCount*0.01+3.1416) * 150 + width/2
    noFill();
    stroke(0,0,0);
    circle(width/2, height/2, radius2);
    noStroke();
    
    fill(155,0,0);
    triangle(width*0,height*0,width*0,height*0.2,width*0.5,height*0.5);

    fill(0,100,0);
    triangle(width*0.1,height*0,width*0.5,height*0.5,width*0.7,height*0);
    
    fill(0,0,100);
    triangle(width*0,height*1,width*0.5,height*0.5,width*0.69,height*1);

    fill(50,0,100);
    triangle(width*0,height*0.3,width*0,height*0.54,width*0.5,height*0.5);

    fill(50,50,100);
    triangle(width*0,height*0.6,width*0,height*0.83,width*0.5,height*0.5);

    fill(50,200,100);
    triangle(width*0.8,height*0,width*0.95,height*0,width*0.5,height*0.5);

    fill(100,10,100);
    ellipse(width, height/2, width/2.5);
    
    fill(98,143,13);
    ellipse(width*0.7, height*0.4, width*0.1);
}