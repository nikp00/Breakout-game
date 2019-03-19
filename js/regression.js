function predict() {
  regressor.predict(gotResults);
}

function setupButtons() {
  button1.mousePressed(function() {
    addImageButton = true;
  });
  button1.mouseReleased(function() {
    addImageButton = false;
  });



  button2.mousePressed(function() {
    regressor.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        console.log('Loss: ' + loss);
      } else {
        console.log('Done Training. Final Loss: ' + loss);
      }
    });
  });

  button3.mousePressed(function() {

    if (!isPredicting) {
      predict();
      isPredicting = true;
    } else {
      isPredicting = false;
    }
  });
}

function gotResults(err, result) {
  if (err) {
    console.error(err);
  }
  paddleX = map(result, 0, 1, width - paddleWidth, 0);
  console.log(paddleX);
  slider.value(result);
  if (isPredicting) {
    predict();
  }
}