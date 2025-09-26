let fallGuy;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(10, 10, 10);
  fallGuy = {
    x: width / 2,
    y: height / 2,
    size: 100,
    color: color(100, 100, 100),
    mass: 2,
    vel: 0,
    acc: 0
  };
}

function draw() {
  background(10, 10, 10);

  hovering();
  gravity();
  createGuy();
}

function createGuy() {
  fill(fallGuy.color);
  circle(fallGuy.x, fallGuy.y, fallGuy.size);
}

function gravity() {
  const g = 3;
  let radius = fallGuy.size / 2;

  fallGuy.acc = g * fallGuy.mass;
  fallGuy.vel += fallGuy.acc;
  fallGuy.y += fallGuy.vel;

  if (fallGuy.y > height - radius) {
    fallGuy.y = height - radius;
    fallGuy.vel = 0;
  }
}

function hovering() {
  let radius = fallGuy.size / 2
  let hover = dist(mouseX, mouseY, fallGuy.x, fallGuy.y) < radius;
  let goodRub = (movedX > 2);

  if (hover && goodRub) {
    fallGuy.color = color(200, 0, 0);
  } else {
    fallGuy.color = fallGuy.color;
  }
  console.log(hover, goodRub);
}