let tomatoImg, splatTomatoImg;
let W = 1000,
  H = 300;
let bckColor = "yellow";
let maxSplats = 3;

class KetchupJar {
  constructor() {
    this.x = -10;
    this.y = 30;
    this.size = 200;
    this.prevX = this.x;
    this.prevY = this.y;
    this.prevSize = this.size;
    this.amount = 0;
  }

  reset() {
    this.amount = 0;
  }

  charge() {
    this.amount++;
  }

  drawEnding() {
    background(bckColor);
    this.x += 10;
    this.y -= 1;
    this.size += 3;
    this.draw();
    this.prevX = this.x;
    this.prevY = this.y;
    this.prevSize = this.size;
  }

  shouldDrawEnding() {
    return this.x < W / 3;
  }

  draw() {
    noStroke();
    fill(bckColor);
    rect(this.prevX, this.prevY, this.prevSize, this.prevSize);
    fill("red");
    let bottleW = (this.size * 6.5) / 10;
    rect(this.x + bottleW, this.y, this.size - 2 * bottleW, this.size);
    fill("yellow");
    rect(
      this.x + bottleW,
      this.y,
      this.size - 2 * bottleW,
      this.size * (1 - (2 / 3) * (this.amount / maxSplats))
    );
    image(jarImg, this.x, this.y, this.size, this.size);
  }
}
let jar = new KetchupJar();

class Tomato {
  constructor() {
    this.Y0 = H + 5;
    this.Ax = 0;
    this.Ay = 0.08;
    this.Size = 120;
    this.PrevX = this.X;
    this.PrevY = this.Y;
    this.reset();
  }

  reset() {
    this.Vx0 = (Math.random() - 0.5) * 3;
    this.Vy0 = Math.random() * 2 - 9.5;
    this.X0 = ((Math.random() - 0.5) * W) / 3 + (3 * W) / 5;
    this.X = this.X0;
    this.Y = this.Y0;
    this.Vx = this.Vx0;
    this.Vy = this.Vy0;
    this.isSplat = false;
    this.t = 0;
  }

  move() {
    if (!this.isSplat) {
      this.X = this.Vx * this.t + this.X0;
      this.Y = this.Vy * this.t + this.Y0;
      this.Vx = this.Ax * this.t + this.Vx0;
      this.Vy = this.Ay * this.t + this.Vy0;
      this.PrevX = this.X;
      this.PrevY = this.Y;
      this.t++;
    }
  }

  draw() {
    noStroke();
    fill(bckColor);
    rect(this.PrevX, this.PrevY, this.Size, this.Size);
    image(
      this.isSplat ? splatTomatoImg : tomatoImg,
      this.X,
      this.Y,
      this.Size,
      this.Size
    );
  }

  isInside(x, y) {
    return (
      x > this.X &&
      x < this.X + this.Size &&
      y > this.Y &&
      y < this.Y + this.Size
    );
  }

  splat() {
    this.isSplat = true;
    jar.charge();
    setTimeout(() => tomatoObj.reset(), 1000);
  }
}
let tomatoObj = new Tomato();

function preload() {
  tomatoImg = loadImage("/assets/tomato.png");
  splatTomatoImg = loadImage("/assets/splat-tomato.png");
  jarImg = loadImage("/assets/ketchup-jar.png");
}

function setup() {
  var cnv = createCanvas(W, H);
  cnv.parent("canvas");
  background(bckColor);
  angleMode(DEGREES);
}

function draw() {
  if (jar.amount < maxSplats) {
    noStroke();
    rect(0, 0, tomatoObj.Size, tomatoObj.Size);
    jar.draw();
    tomatoObj.draw();
    if (tomatoObj.Y < H + 10) {
      tomatoObj.move();
    } else {
      tomatoObj.reset();
    }
  } else if (jar.shouldDrawEnding()) {
    jar.drawEnding();
  }
}

function mousePressed(event) {
  if (tomatoObj.isInside(event.x, event.y)) {
    tomatoObj.splat();
  }
  console.log;
}
