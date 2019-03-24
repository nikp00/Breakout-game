var resolutionScaleH, resolutionScaleHW, loc, capture, ball, paddle, paddleX;
var canvasWidth = 640;
var canvasHeight = 480;
var cols = 7;
var rows = 5;
var spacePressed = false;
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

var featureExtractor;
var regressor;
var video;
var loss;
var slider;
var samples = 0;
//var positionX = 140;
var button1, button2, button3;
var isPredicting = false;

var
  def, img1, img2, img3, img4;

var ballIsFrezzed = false;
var addImageButton = false;
var powerups = [];

var dropzone;

var center = 0;
var left = 0;
var right = 0;

var matrix = defaultLevel.data.split(',');

var stopwatch, time;
var s = 0;
var m = 0;

var currentLevel;

function preload() {
  audio = loadSound('../assets/song_1.mp3');
  def = loadImage("../assets/default.png");
  img1 = loadImage("../assets/1.svg");
  img2 = loadImage("../assets/2.svg");
  img3 = loadImage("../assets/3.svg");
}


function setup() {

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
  video = createCapture(VIDEO);
  video.size(canvasWidth, canvasHeight);
  frameRate(30);
  video.hide();

  for (let j = 0; j < rows; j++) {
    var color = random(0, 361);
    for (let i = 0; i < cols; i++) {
      if (matrix[bricks.length] == 1)
        bricks.push(new Brick(i, j, brickWidth, brickHeight, color, 100, 50, 1000));
      else {
        bricks.push(new Brick(i, j, brickWidth, brickHeight, color, 100, 50, 1000, true));
      }
    }
  }

  paddle = new Paddle((canvasWidth - paddleWidth) / 2, canvasHeight - paddleHeight * 2, paddleWidth, paddleHeight);
  ball = new Ball(ballR, canvasWidth / 2, paddle.y - ballR);


  featureExtractor = ml5.featureExtractor('MobileNet');
  regressor = featureExtractor.regression(video);

  button1 = select("#addImage", ".bottom");
  button2 = select("#train");
  button3 = select("#predict");
  slider = select("#range");
  setupButtons();

  dropzone = select('#dropZone');
  dropzone.dragOver(highlight);
  dropzone.dragLeave(unhighlight);
  dropzone.drop(gotFile, highlight);

  audio.loop();

  selectLevel();
}

function draw() {
  checkState();
  if (addImageButton) {
    regressor.addImage(slider.value());
    console.log(samples++ + 1);
    switch (slider.value()) {
      case 0.5:
        center++;
        document.getElementById("center").innerHTML = "Center: <br>" + center;
        break;
      case 0.01:
        left++;
        document.getElementById("left").innerHTML = "Left: <br>" + left;
        break;
      case 1:
        right++;
        document.getElementById("right").innerHTML = "Right: <br>" + right;
        break;
      default:
        console.log(slider.value());

    }
  }

  var spectrum = fft.analyze();



  translate(video.width, 0);
  scale(-1.0, 1.0);
  image(video, 0, 0, canvasWidth, canvasHeight);
  fill(255);

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

  paddle.render();
  if (run) {
    brickColisionDetection();
    if (audio.isPaused()) {
      audio.play();
      stopwatch = setInterval(timer, 1000);
    }
    ball.check();
  } else {
    if (audio.isPlaying()) {
      audio.pause();
      clearInterval(stopwatch);
    }
  }
  ball.render();
}