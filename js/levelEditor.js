var resolutionScaleH, resolutionScaleHW, ball, paddle, paddleX;
var canvasWidth = 640;
var canvasHeight = 480;
var cols = 7;
var rows = 5;
var brickWidth = 57.5;
var brickHeight = 20;
var paddleWidth = 100;
var paddleHeight = 20;
var ballR = 20;
var offset = 30;
var bricks = [];
var cyc = true;
var run = false;

var isPredicting = false;

var
  def, img1, img2, img3, img4;

setDefaultLevel();
var matrix = defaultLevel.data.split(',');

function preload() {
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

  createCanvas(canvasWidth, canvasHeight).parent('canvasContainer');


  for (let j = 0; j < rows; j++) {
    var color = random(0, 361);
    for (let i = 0; i < cols; i++) {
      if (matrix[bricks.length] == 1)
        bricks.push(new Brick(i, j, brickWidth, brickHeight, 60, 100, 50, 0));
      else {
        bricks.push(new Brick(i, j, brickWidth, brickHeight, 60, 100, 50, 0, true));
      }
    }
  }

  paddle = new Paddle((canvasWidth - paddleWidth) / 2, canvasHeight - paddleHeight * 2, paddleWidth, paddleHeight);
  ball = new Ball(ballR, canvasWidth / 2, paddle.y - ballR);


}

function draw() {
  //translate(canvasWidth, 0);
  //scale(-1.0, 1.0);
  fill(255);

  if (cyc) {
    fill(0);
    rect(0, 0, canvasWidth, canvasHeight);
  }

  for (let i = 0; i < bricks.length; i++) {
    bricks[i].render();
  }

  paddle.render();
  ball.render();
}

function mouseClicked() {
  for (let i = 0; i < bricks.length; i++) {
    if (mouseX >= bricks[i].x && mouseX <= bricks[i].x + bricks[i].w && mouseY >= bricks[i].y && mouseY <= bricks[i].y + bricks[i].h) {
      if (bricks[i].a == 0) {
        bricks[i].a = 1;
      } else {
        bricks[i].a = 0;
      }
      break;
    }
  }
}

function saveLevel() {
  var oneBrickSelected = false;
  var m = '';
  var name;
  if (document.getElementById('levelName').value != '') {
    for (let i = 0; i < bricks.length; i++) {
      if (bricks[i].a == 1) {
        oneBrickSelected = true;
        m = m + '1,';
      } else {
        m = m + '0,';
      }
    }

    if (oneBrickSelected) {
      name = document.getElementById('levelName').value;
      var level = {
        label: name,
        data: m
      };
      localStorage.setItem(name, JSON.stringify(level));
      Swal.fire({
        type: 'info',
        title: 'LEVEL SAVED'
      }).then(function() {
        reload();
      });
    } else {
      Swal.fire({
        type: 'warning',
        title: 'YOU MUST SELECT AT LEAST ONE BRICK'
      });
    }
  } else {
    Swal.fire({
      type: 'warning',
      title: 'YOU MUST INSERT A NAME FOR THE LEVEL'
    });
  }
}