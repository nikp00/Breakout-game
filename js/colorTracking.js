function TrackedColor(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
}

function clearTrackedColors() {
  trackedColors = [];
}

function motionTracking() {
  var avgX = 0;
  var avgY = 0;
  var count = 0;
  var loc;

  for (let x = 0; x < canvasWidth; x++) {
    for (let y = 0; y < canvasHeight; y++) {
      loc = (x + y * canvasWidth) * 4;
      for (let i = 0; i < trackedColors.length; i++) {

        var r1 = pixelsP[loc];
        var g1 = pixelsP[loc + 1];
        var b1 = pixelsP[loc + 2];
        var r2 = trackedColors[i].r;
        var g2 = trackedColors[i].g;
        var b2 = trackedColors[i].b;

        var d = distSq(r1, g1, b1, r2, g2, b2);

        if (d < threshold * threshold) {
          avgX += x;
          avgY += y;
          count++;
        }
      }
    }
  }

  if (count > 0) {
    isPredicting = true;
    avgX = avgX / count;
    avgY = avgY / count;
    avgX = canvasWidth - avgX;

    fill(255, 0, 0);

    stroke(0);
    ellipse(avgX, avgY, 24, 24);
  } else {
    isPredicting = false;
    avgX = (canvasWidth - paddleWidth) / 2;
  }
  return avgX;


}

function tr() {
  threshold = document.getElementById('tr').value;
  document.getElementById("range").innerHTML = threshold;
}