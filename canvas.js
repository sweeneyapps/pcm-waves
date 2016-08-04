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
    step = 0;
    soundStep = 0;
    speed = 500;
    
}
function drawRect(r, c) {
    c.beginPath();
    c.rect(r.x, r.y, r.width, r.height);
    c.fillStyle = '#8ED6FF';
    c.fill();
}

var step = 0;  // go thru timeline the x axis of the graph
var soundStep = 0;  // location in the sound file, max = soundData.length (2 channels)
var speed = 500;
var freq = 0.5;
var color = "black";

function nextFrame() {
    
    // loop on or off
    soundStep = soundStep < soundData.length ? soundStep : 0;   // looping 
    
    
    soundStep = soundStep + 1;
    step = step + freq;

    rect.x = step;

    rect.x = rect.x % canvas.width;
    rect.y = (canvas.height * (soundData[soundStep] / 32767) + (canvas.height/2));
}


function drawLine(c) {
    
    if(rect.x < 0.1) {
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.beginPath();
        c.moveTo(rect.x, rect.y);
    }
    else {
        c.beginPath();
        c.moveTo(rect.x, rect.y);
    }

    nextFrame();
    c.lineTo(rect.x, rect.y);
    c.closePath();
    c.strokeStyle = color;
    c.stroke(); 

    //nextFrame();                             
}

    
function animateWave(ctx) {

    for (var i = 0; i < speed; i++) {
    drawLine(ctx);
    }
    
    if(soundStep < soundData.length) {  
    reqAFrame(function() {
        animateWave(context);
    });
    }  
}


var soundData = [];
var canvas, context;
var rect = {x:0, y:0, width:5, height:5};

function startJSON(data) {
    soundData = data;
    console.log('Data loaded into memory');

    // load when document is ready

    document.addEventListener("DOMContentLoaded", function() {
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    animateWave(context);

    document.getElementById('speed').oninput = changeSpeed;
    document.getElementById('color').onchange = changeColor;
        
    });
}

