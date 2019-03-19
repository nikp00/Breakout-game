var resolutionScaleH, resolutionScaleHW, loc, capture, ball, paddle, paddleX;
var canvasWidth = 640;
var canvasHeight = 480;
var cols = 7;
var rows = 5;
var spacePressed = true;
var trackR = 0;
var trackG = 0;
var trackB = 0;
var threshold = 10;
var trackedColors = [];
var brickWidth = 57.5;
var brickHeight = 20;
var paddleWidth = 100;
var paddleHeight = 20;
var ballR = 20;
var offset = 30;
var bricks = [];
var dx = 4;
var dy = -4;
var oldDx = dx;
var oldDy = dy;
var oldPaddleX;
var avgX = 0;
var audio;
var fft, spectrum;
var energy, avgEnergy;
var bass = [];
var lowMid = [];
var mid = [];
var highMid = [];
var treble = [];
var cyc = true;
var run = false;
var isPredicting = false;
var
  def, img1, img2, img3, img4;

var ballIsFrezzed = false;
var addImageButton = false;
var powerups = [];

var pixelsP = [];

var dropzone;

var matrix = defaultLevel.data.split(',');

function preload() {
  audio = loadSound('../assets/song_1.mp3');
  def = loadImage("../assets/default.png");
  img1 = loadImage("../assets/1.svg");
  img2 = loadImage("../assets/2.svg");
  img3 = loadImage("../assets/3.svg");
}


function setup() {

  document.getElementById("range").innerHTML = threshold;

  resolutionScaleH = 1440 / screen.height;
  resolutionScaleW = 3440 / screen.width;
  canvasWidth = floor(canvasWidth / resolutionScaleH);
  canvasHeight = floor(canvasHeight / resolutionScaleH);
  brickWidth = floor(brickWidth / resolutionScaleH);
  brickHeight = floor(brickHeight / resolutionScaleH);
  paddleWidth = floor(paddleWidth / resolutionScaleH);
  paddleHeight = floor(paddleHeight / resolutionScaleH);
  ballR = floor(ballR / resolutionScaleH);
  offset = floor((canvasWidth - 7 * brickWidth) / 8);

  // canvasWidth = 640;
  // canvasHeight = 480;
  // brickWidth = 57.5;
  // brickHeight = 20;
  // paddleWidth = 100;
  // paddleHeight = 20;
  // ballR = 20;

  fft = new p5.FFT();
  createCanvas(canvasWidth, canvasHeight).parent('canvasContainer');
  pixelDensity(1);
  capture = createCapture(VIDEO);
  capture.size(canvasWidth, canvasHeight);
  frameRate(30);
  capture.hide();

  for (let j = 0; j < rows; j++) {
    var color = random(0, 361);
    for (let i = 0; i < cols; i++) {
      bricks.push(new Brick(i, j, brickWidth, brickHeight, color, 100, 50, 1000));
    }
  }

  paddle = new Paddle((canvasWidth - paddleWidth) / 2, canvasHeight - paddleHeight * 2, paddleWidth, paddleHeight);
  ball = new Ball(ballR, canvasWidth / 2, paddle.y - ballR);


  dropzone = select('#dropZone');
  dropzone.dragOver(highlight);
  dropzone.dragLeave(unhighlight);
  dropzone.drop(gotFile, highlight);

  audio.loop();

  selectLevel();
}

function draw() {
  checkState();
  var spectrum = fft.analyze();
  translate(capture.width, 0);
  scale(-1.0, 1.0);
  image(capture, 0, 0, canvasWidth, canvasHeight);
  loadPixels();
  pixelsP = pixels;

  if (cyc) {
    fill(0);
    rect(0, 0, canvasWidth, canvasHeight);
  }

  for (let i = 0; i < bricks.length; i++) {

    if (bricks[i].j == 0) {
      energy = fft.getEnergy("bass");
    } else if (bricks[i].j == 1) {
      energy = fft.getEnergy("lowMid");
    } else if (bricks[i].j == 2) {
      energy = fft.getEnergy("mid");
    } else if (bricks[i].j == 3) {
      energy = fft.getEnergy("highMid");
    } else if (bricks[i].j == 4) {
      energy = fft.getEnergy("treble");
    }

    bricks[i].a = map(energy, 0, 255, 0.01, .6);
    bricks[i].lightnes = map(energy, 0, 255, 0, 70);
    bricks[i].hue = map(energy, 255, 0, 0, 360);
    bricks[i].render();
  }

  for (let i = 0; i < powerups.length; i++) {
    powerups[i].fall();
    powerups[i].check();
  }


  paddleX = motionTracking();
  paddle.render();

  if (run) {
    brickColisionDetection();
    if (audio.isPaused()) {
      audio.play();
    }
    ball.check();
  } else {
    if (audio.isPlaying()) {
      audio.pause();
    }
  }
  ball.render();
}

function mouseClicked() {
  loc = (round(mouseX) + round(mouseY) * canvasWidth) * 4;
  var r, b, g;
  trackR = pixels[loc];
  trackG = pixels[loc + 1];
  trackB = pixels[loc + 2];
  trackedColors.push(new TrackedColor(trackR, trackG, trackB));
}