function index(i, j, cols) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

function distSq(r1, g1, b1, r2, g2, b2) {
  var temp = (r2 - r1) * (r2 - r1) + (g2 - g1) * (g2 - g1) + (b2 - b1) * (b2 - b1)
  return temp;
}

function hide() {
  if (cyc) {
    cyc = false;
    document.getElementById('hide').innerHTML = 'HIDE CAM';
  } else {
    cyc = true;
    document.getElementById('hide').innerHTML = 'SHOW CAM';
  }
}

function startStop() {

  if (!run) {
    run = true;
    //audio.play();
  } else {
    run = false;
    //audio.pause();
  }
}

function keyPressed() {
  if (keyCode == 37) {
    paddle.left = true;
    paddle.right = false;
  } else if (keyCode == 39) {
    paddle.left = false;
    paddle.right = true;
  } else if (keyCode == 38 && paddle.magForce == 1000) {
    paddle.magForce = 0;
    spacePressed = true;
    ballIsFrezzed = false;
  }
}

function keyReleased() {
  paddle.left = false;
  paddle.right = false;
}

function highlight() {
  dropzone.style('background-color', '#fff');
  dropzone.style('color', '#000');
  dropzone.style('border-color', '#000');
}

function unhighlight() {
  dropzone.style('background-color', '#000');
  dropzone.style('color', '#fff');
  dropzone.style('border-color', '#fff');
}

function gotFile(file) {
  audio = null;
  audio = loadSound(file.data, function() {
    audio.loop();
  });
  audio.loop();
  dropzone.style('display', 'none');

}

function info() {
  Swal.fire({
    type: 'info',
    title: 'INFO',
    html: '<div style="text-align:left;">' +
      'This is a version of the breakout game. It uses FFT analysis to color the bricks based on the music that is playing in the background.' +
      'You can play the game with the arrow keys and with motion tracking. The game includes two techniques of motion detection. The first technique is' +
      ' color tracking where the algorithm tracks the position of the selected color(s) and moves the paddle accordingli, the sensitivity of the algorithm' +
      ' can be adjusted with the threshold slider. The second technique includes machine learning. The player must add equal amounts of images for the center,' +
      ' left, and right positions (minimum 30 images per position, then the program applies the images to the MobileNet training model and then uses regression to calculate the position of the paddle) ' +
      '<br/><br/><br/></div> <span style="text-align:center;">Nik Prinčič, 2019</span>'
  });
}

function infoColorTracking() {
  Swal.fire({
    type: 'info',
    title: 'INFO',
    html: '<div style="text-align:left; padding: 0px 20px;">' +
      '<ul style="list-style-type: square;">' +
      '<li>You can play using the arrow keys.</li>' +
      '<li>You can upload an audio file which will be used for the FTT analysis and will be played in the background.</li>' +
      '<li>You can click on the webcam image and select a color which will be tracked (chose a distinct bright color).</li>' +
      '<li>You can adjust the sensitiviti of the color tracking algorithm with the slider (default is 10).</li>' +
      '</ul>' +
      '</div>'
  });
}

function infoRegression() {
  Swal.fire({
    type: 'info',
    title: 'INFO',
    html: '<div style="text-align:left;padding: 0px 20px;">' +
      '<ul style="list-style-type: square;">' +
      '<li>You can play using the arrow keys.</li>' +
      '<li>You can upload a audio file wich will be used for the FTT analysis and will be played in the background.</li>' +
      '<li>You can controll the paddle wit your hand infront of your webcam.' +
      '<ol style="padding-left:20px;">' +
      '<li>Put your hand in the center of the frame and add at least 30 images.</li>' +
      '<li>Move the slider to the left or to the right and add the same number of images.</li>' +
      '<li>Move the slider to the opposite side and repeat the proces.</li>' +
      '<li>Click train.</li>' +
      '<li>Click predict</li>' +
      '</ol>' +
      '</li>' +
      '<li>You can adjust the sensitiviti of the color tracking algorithm with the slider (default is 10).</li>' +
      '</ul>' +
      '</div> <span style="text-align:center;">Nik Prinčič, 2019</span>'
  });
}

function reload() {
  window.location.reload()
}

function checkState() {
  var finish = true;
  for (let i = 0; i < bricks.length; i++) {
    if (bricks[i].wasHit != true) {
      finish = false;
      break;
    }
  }

  if (finish) {
    audio.pause();
    audio = null;
    noLoop();
    Swal.fire({
      type: 'info',
      title: 'YOU WON'
    }).then(function() {
      writeLeaderboard();
      reload();
    });
  }
}

function changeLevel() {
  let index = 0;
  let indexC = 0;

  matrix.splice(matrix.length - 1, 1);

  let col0, col1, col3, col4;

  col0 = matrix.splice(0, 7).reverse();
  col1 = matrix.splice(0, 7).reverse();
  col2 = matrix.splice(0, 7).reverse();
  col3 = matrix.splice(0, 7).reverse();
  col4 = matrix.splice(0, 7).reverse();

  matrix = col0.concat(col1);
  matrix = matrix.concat(col2);
  matrix = matrix.concat(col3);
  matrix = matrix.concat(col4);

  for (let i = 0; i < bricks.length; i++) {

    if (matrix[i] == 1)
      bricks[i].wasHit = false;
    else {
      bricks[i].wasHit = true;
    }
  }
}

function selectLevel() {
  Swal.fire({
    type: 'warning',
    title: 'SELECT A LEVEL',
    onOpen: fillLevels,
    html: '<select id="levels">' +
      '<option value="default" >Default</option>' +
      '</select>'
  }).then(function() {
    currentLevel = document.getElementById('levels').options[document.getElementById('levels').selectedIndex].value;
    currentLevel = JSON.parse(localStorage.getItem(currentLevel));
    matrix = currentLevel.data.split(',');
    changeLevel();

  });
}

function fillLevels() {
  let levels = window.Object.keys(localStorage);
  for (let i = 0; i < levels.length; i++) {
    if (levels[i] != 'default') {
      document.getElementById('levels').innerHTML += '<option value="' + levels[i] + '">' + levels[i] + '</option>';
      console.log("");
    }
  }
}

function timer() {
  s++;
  if (s % 60 == 0) {
    s = 0;
    m++;
  }
  if (s % 10 != 0 && s < 10) {
    if (m < 10) {
      time = "0" + m + ":0" + s;
    } else {
      time = m + ":0" + s;
    }
  } else {
    if (m < 10) {
      time = "0" + m + ":" + s;
    } else {
      time = m + ":" + s;
    }
  }
  document.getElementById('timer').innerHTML = "Time: <br>" + time;
}

function checkLeaderboard() {
  Swal.fire({
    type: 'info',
    title: 'INFO',
    html: '<div class="tableContainer">' +
      "<table>" +
      "<tr>" +
      "<td>Standing</td><td>Time</td>" +
      "</tr>" +
      "<tr>" +
      "<td>1</td><td>" + JSON.parse(localStorage.getItem(currentLevel.label)).time1 + "</td>" +
      "</tr>" +

      "<tr>" +
      "<td>2</td><td>" + JSON.parse(localStorage.getItem(currentLevel.label)).time2 + "</td>" +
      "</tr>" +

      "<tr>" +
      "<td>3</td><td>" + JSON.parse(localStorage.getItem(currentLevel.label)).time3 + "</td>" +
      "</tr>" +
      "</table></div>"
  });
}

function writeLeaderboard() {
  let tempMin, tempSec, tempTime;
  tempMin = time.split(':')[0];
  tempSec = time.split(':')[1];
  tempTime = tempMin * 60 + tempSec;

  console.log(tempMin, tempSec, tempTime);

  let tempLocalTime1, tempLocalTime2, tempLocalTime3;

  if (currentLevel.time1 != null) {
    tempLocalTime1 = currentLevel.time1.split(':')[0] * 60 + currentLevel.time1.split(':')[1];
  } else {
    tempLocalTime1 = Number.MAX_SAFE_INTEGER;
  }
  if (currentLevel.time2 != null) {
    tempLocalTime2 = currentLevel.time2.split(':')[0] * 60 + currentLevel.time2.split(':')[1];
  } else {
    tempLocalTime2 = Number.MAX_SAFE_INTEGER;
  }
  if (currentLevel.time3 != null) {
    tempLocalTime3 = currentLevel.time3.split(':')[0] * 60 + currentLevel.time3.split(':')[1];
  } else {
    tempLocalTime3 = Number.MAX_SAFE_INTEGER;
  }

  console.log(tempLocalTime1, tempLocalTime2, tempLocalTime3);

  if (tempLocalTime1 > tempTime) {
    currentLevel.time3 = currentLevel.time2;
    currentLevel.time2 = currentLevel.time1;
    currentLevel.time1 = time;
    console.log("asdasdasd");
  } else if (tempLocalTime2 > tempTime) {
    currentLevel.time3 = currentLevel.time2;
    currentLevel.time2 = time;
  } else if (tempLocalTime3 > tempTime) {
    currentLevel.time3 = time;
  }

  localStorage.setItem(currentLevel.label, JSON.stringify(currentLevel));

}
