let angle = 0;
let moon, planet, miniMoon;
let toggle = true;
let orbitSpeed = 0.02;

let moonTrail = [];
let miniTrail = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  planet = { x: mouseX, y: mouseY, size: 200, }
  moon = { x: 500, y: 400, size: 50, }
  miniMoon = { x: 100, y: 100, size: 10, }
}


//I want to make a simple program that generates random circles around the mouse.
//I would also like these circles to pop into existance at a rate related to the speed of the mouse's movement
//what do I need?

// Position of the cursor
// circle
// constraint spawn point to near the mouse
// speed of the cursor
//
function draw() {
  background(10)

  fill(255);
  noStroke()
  circle(mouseX, mouseY, planet.size);

  orbitPlanet();

  moonTrail.push({ x: moon.x, y: moon.y });
  miniTrail.push({ x: miniMoon.x, y: miniMoon.y })

  if (moonTrail.length > 150) moonTrail.shift();
  if (miniTrail.length > 150) miniTrail.shift();

  noFill();
  stroke(200, 200, 200, 150);
  strokeWeight(4);
  beginShape();
  for (let p of moonTrail) vertex(p.x, p.y);
  endShape();

  noFill();
  stroke(50, 50, 50, 150);
  strokeWeight(3);
  beginShape();
  for (let p of miniTrail) vertex(p.x, p.y);
  endShape();

  noStroke();
  fill(200);
  circle(moon.x, moon.y, moon.size)

  noStroke();
  fill(50);
  circle(miniMoon.x, miniMoon.y, miniMoon.size)
}

function orbitPlanet() {
  moon.x = mouseX + planet.size * cos(angle);
  moon.y = mouseY + planet.size * sin(angle);

  miniMoon.x = moon.x + moon.size * sin(angle);
  miniMoon.y = moon.y + moon.size * cos(angle);

  if (toggle) {
    angle -= orbitSpeed; // orbit clockwise
  } else {
    angle += orbitSpeed; // orbit counter-clockwise
  }
}

function mousePressed() {
  toggle = !toggle;
  console.log(toggle);
}

function mouseWheel(event) {
  if (event.delta > 0) {
    orbitSpeed -= 0.01;
  } else {
    orbitSpeed += 0.01;
  }

  orbitSpeed = constrain(orbitSpeed, 0.001, 0.5);
}