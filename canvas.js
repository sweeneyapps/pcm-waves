window.reqAFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function changeSpeed(e) {
  console.log(e.target.value);
  speed = e.target.value;
}

function changeColor(e) {
  color = e.target.value;    
}

function reset() {
  audio.pause();
  audio.currentTime = 0;
  audio.play();
  step = 0;
  soundStep = 0;   
}


var step = 0;  // go thru timeline the x axis of the graph
var soundStep = 0;  // location in the sound file, max = soundData.length (2 channels)
var speed = 737;
var freq = 0.25;
var color = "black";

function nextFrame() {
    
  if (soundStep > soundData.length - 1) reset(); 
  
  soundStep = soundStep + 2;
  step = step + freq;

  loc.X = step;

  loc.X = loc.X % canvas.width;
  loc.Y = (canvas.height * (soundData[soundStep] / 32767) + (canvas.height/2));
}


function drawLine(c) {
  
  c.beginPath();
  c.moveTo(loc.X, loc.Y);

  nextFrame(); 
    
    // this makes sure lineTo doesn't draw across the screen from (canvas width - 1) to 0.
  if (loc.X != 0)
    c.lineTo(loc.X, loc.Y);

  c.closePath();
   
  c.strokeStyle = color;
  c.stroke();

  var clearX = loc.X > 0 ? loc.X + 1 : loc.X; // fix left edge bug
  c.clearRect(clearX, 0, 1, canvas.height); // clear what's ahead 
  printBar();                             
}

function drawRect(r, c) {
  c.beginPath();
  c.rect(r.x, r.y, r.width, r.height);
  c.fillStyle = 'blue';
  c.fill();
}

function drawText(text, c) {
  c.font = "12px serif";
  c.fillText(""+text, 10, 50);
}
 
function printBar(){
  var percentDone = soundStep / soundData.length;
  drawRect({x:0, y:canvas.height-10, width:canvas.width * percentDone, height: 10}, context);
}

  var prevTime = 0.0;  
function animateWave(ctx) {

  for (var i = 0; i < speed; i++) {
    drawLine(ctx);
  }

  if(soundStep < soundData.length) {  
     reqAFrame(function(ms) {
      animateWave(context);
    });
  }  
}


var soundData = [];
var canvas, context, audio;
var loc = {X:0, Y:0};

function startJSON(data) {
  soundData = data;
  console.log('Data loaded into memory');

  // load when document is ready

  document.addEventListener("DOMContentLoaded", function() {
  canvas = document.getElementById('myCanvas');
  context = canvas.getContext('2d');
  animateWave(context);

  document.getElementById('color').onchange = changeColor;
  audio = document.getElementById('audioPlayer');
  audio.play();
  });
}

