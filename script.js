var options = ["0","1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"];

const rolls = ["1"];
rolls.pop();
var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

document.getElementById("spin").addEventListener("click", spin);


function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
  var phase = 0;
  var center = 128;
  var width = 127;
  var frequency = Math.PI*2/maxitem;
  
  red   = Math.sin(frequency*item+2+phase) * width + center;
  green = Math.sin(frequency*item+0+phase) * width + center;
  blue  = Math.sin(frequency*item+4+phase) * width + center;
  
  return RGB2Color(red,green,blue);
}
var trackIndex = 0;
function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 125;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,500,500);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.font = 'bold 12px Helvetica, Arial';

    for(var i = 0; i < options.length; i++) {
      var angle = (startAngle + i * arc * 1.6) % 10;
      //ctx.fillStyle = colors[i];
      ctx.fillStyle = getColor(i, options.length);
      //trackIndex++;
      var size = 20;
      
      ctx.beginPath();
      
      //ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      //ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      if (((angle*size*2) >= 200) && ((angle*size*2) <= 222)){
        trackIndex = i;
      }
        
      ctx.rect(0,angle*size*2,600,size);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur    = 0;
      ctx.shadowColor   = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      ctx.translate(250 ,10 + angle*size*2);
      //ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      ctx.textAlign = 'center';
      ctx.fillText(text, 0, angle*0.8);
      
      ctx.restore();
    } 
    //console.log("one rotation");
    
    //Arrow
    var val = 250;
    ctx.fillStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(240, 222);
    ctx.lineTo(-250, 220 + 20); 
    ctx.lineTo(-250, 220 - 20);
    ctx.moveTo(240, 222);
    ctx.lineTo(-250, 220 - 20);
    
    ctx.moveTo(260, 222);
    ctx.lineTo(2*250, 210);
    ctx.lineTo(2*250, 230); 
    ctx.moveTo(260, 222);
    ctx.lineTo(2*250, 230); 
    
    ctx.stroke();
    
    /*
    ctx.lineTo(250 + 4, val - (outsideRadius + 5)); 
    ctx.lineTo(250 + 4, val - (outsideRadius - 5));
    ctx.lineTo(250 + 9, val - (outsideRadius - 5));
    ctx.lineTo(250 + 0, val - (outsideRadius - 13));
    ctx.lineTo(250 - 9, val - (outsideRadius - 5));
    ctx.lineTo(250 - 4, val - (outsideRadius - 5));
    ctx.lineTo(250 - 4, val - (outsideRadius + 5));
    */
   
    ctx.fill();
    ctx.fillStyle = "black";
  }
}
var beginTrack = 0;
function spin() {
  //spinAngleStart = Math.random() * 10 + 10;
  beginTrack = trackIndex;
  spinAngleStart =  Math.random()*100;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  //spinTimeTotal = 30 * 10;
  rotateWheel();
}

var track = 1;


function rotateWheel() {
  track++;
  console.log("track: " + track);
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  console.log("spinAngle: " + spinAngle);
  //startAngle += 0.125;
  startAngle += spinAngle;
  //startAngle += (spinAngle * Math.PI / 180);
  console.log("startAngle: " + startAngle);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
  //var what = track*0.125; 
  clearTimeout(spinTimeout);
  //var degrees = startAngle;
  //var arcd = arc * 180 / Math.PI;
  console.log("Start angle: " + startAngle);
  console.log("Beginning Track Index: " + beginTrack);
  console.log("End Track Index: " + trackIndex);
 // console.log("What: " + trackIndex);
  //
  var temp = Math.floor(Math.abs(8.5 - 2*(trackIndex - 18)/162));
  
  var index = trackIndex;
  //
  //var index = Math.floor(Math.abs(8 - 2*(trackIndex - 18)/162));
  console.log("temp: " + temp);
  console.log("index: " + index);
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var text = options[index]
  rolls.push(text);
  document.getElementById("rolled").innerHTML = rolls.join('<br>');
  ctx.textAlign = 'center';
  ctx.fillText(text, 250, 235);
  //ctx.fillText(rolls, 400, 235);
  ctx.restore();
  
  console.log(spinAngleStart);
}

function easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}

drawRouletteWheel();