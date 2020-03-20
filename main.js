/*
    BIATHLONIA
    Pyry Lahtinen
    18.10.2019
*/



var hittedTargets = [false, false, false, false, false];
var targetRadius = 4;
function drawHittedTargetMask(field, x, y, r, i) {
    //circle
    field.fillStyle = "#c9c9c9";
    field.arc(x, y, 1.5*r, 0, 2*Math.PI);
    field.fill();
    //stick
    field.fillStyle = "#c9c9c9";
    field.rect(x-3*r/10/2, y+1.5*r, 3*r/10, 50-1.5*r);
    field.fill();
}
function drawTarget(field, x, y, r, i) {
    //draws the i:th target to the wanted location (x, y) on the canvas field with the radius of r
    field.beginPath();
    if (hittedTargets[i] == true) {
       drawHittedTargetMask(field, x, y, r, i);
    } else {
        field.arc(x, y, r, 0, 2*Math.PI);
        field.fillStyle = "#000000"; //prev. white circle (e3e3e3)
        field.fill();
        /*field.strokeStyle = "#000000"; //with black border
        field.stroke();*/
        field.beginPath();
        field.fillStyle = "#6e6e6e";
        field.rect(x-1.5*r, 300, 3*r, 4);
        field.fill();
    }
}
function distance(x1, y1, x2, y2) {
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;
    var distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    return distance;
}
function hitTheTarget(shotX, shotY, i) {
    //-100 is from canvas position
    //-150 is from crosshair offset (not in mouse position)
    shotX = shotX-100+windSpeed*2;
    shotY = shotY-100-150+crosshairBreath;
    var targetX = [200, 325, 450, 575, 700];
    if (distance(shotX, shotY, targetX[i], 250) <= targetRadius) { //hit
        return true;
    } else { //miss
        if (i==4) { //last = no hit at all
            hitX[hitX.length] = shotX; //draw the hitmark
            hitY[hitY.length] = shotY;
        }

    console.log("mouseX="+shotX+" mouseY="+shotY+" targetX="+targetX[i]+" targetY="+250+" dist="+distance(shotX, shotY, targetX[i], 250));
        return false;
    }
}

var crosshairOffset = 0; //negative=left; positive=right
var crosshairBreath = 0; //crosshair y-offset caused by breathing
var crosshairBreathDirection = 1; //1=going up; 2=coming down
var crosshairOpacity = 1; //1=visible; 0=invisible
function drawCrosshair(field, x, y) {
    //circle
    field.beginPath();
    field.strokeStyle = "rgba(0, 0, 0, " + crosshairOpacity + ")";
    field.arc(x, y+crosshairBreath, 40, 0, 2*Math.PI);
    field.stroke();
    //bottom line
    field.moveTo(x+crosshairOffset, y+30+crosshairBreath);
    field.lineTo(x+crosshairOffset, y+15+crosshairBreath);
    field.stroke();
}

var bullets = 5;
var loaded = false;
function drawBullet(magazine, i) {
    //draw i:th bullets from top
    magazine.beginPath();
    if (i > -1) { //bullet in magazine
        //i*30 is from one bullet's height
        //i*20 is from space between two bullets
        magazine.rect(30, 70+i*30+i*20, 30, 30);
        magazine.stroke(); //box
        magazine.moveTo(30+30, 70+i*30+i*20);
        magazine.lineTo(30+30+20, 70+i*30+i*20+15);
        magazine.stroke(); //upper line
        magazine.moveTo(30+30, 70+i*30+i*20+30);
        magazine.lineTo(30+30+20, 70+i*30+i*20+15);
        magazine.stroke(); //lower line
    } else { //loaded bullet
        magazine.rect(30, 10, 30, 30);
        magazine.stroke();
        magazine.moveTo(30+30, 10);
        magazine.lineTo(30+30+20, 10+15);
        magazine.stroke(); //upper line
        magazine.moveTo(30+30, 10+30);
        magazine.lineTo(30+30+20, 10+15);
        magazine.stroke(); //lower line
    }
}
function drawMagazine(magazine) {
    //clear canvas
    magazine.clearRect(0, 0, magazineCanvas.width, magazineCanvas.height);

    //draw magazine
    magazine.beginPath();
    magazine.rect(10, 50, 90, 270);
    magazine.stroke();

    //draw bullets in magazine
    for (var i=0; i<bullets; i++) {
        drawBullet(magazine, i);
    }

    //draw bullet loaded
    if (loaded == true) {
        drawBullet(magazine, -1);
    }
}

var hitX = [];
var hitY = [];
function drawHits(field) {
    for (var i=0; i<hitX.length; i++) {
        field.beginPath();
        field.arc(hitX[i], hitY[i], 1, 0, 2*Math.PI);
        field.fillStyle = "#000000";
        field.fill();
    }
}

var windSpeed = 2; //negative=from right to left (<-); positive=from left to right (->)
var windAcceleration = 1; //windSpeed changing, units/second; negative=going down; positive going up
var windScenery = 1; //look wind setting <select> in index.html
function windUpdate(wind) {
    //clear canvas
    wind.clearRect(0, 0, 100, 100);

    //update wind
    if (Math.round(Math.random()) == 0) {
        windSpeed = windSpeed + windAcceleration;
    } else {
        windSpeed = windSpeed - windAcceleration;
    }
    if (windScenery == 1) { //normal
        if (windSpeed <= 0) {
            windAcceleration = -1 * windAcceleration;
            windSpeed = 0;
        } else if (windSpeed >= 5) {
            windAcceleration = -1 * windAcceleration;
            windSpeed = 5;
        }
    } else if (windScenery == 2) { //strom
        if (windSpeed <= 4) {
            windAcceleration = -1 * windAcceleration;
            windSpeed = 4;
        } else if (windSpeed >= 9) {
            windAcceleration = -1 * windAcceleration;
            windSpeed = 9;
        }
    }

    //print arrow with correct size
    wind.font = Math.abs(windSpeed*10)+"px Verdana";
    wind.textAlign = "center";
    if (windSpeed < 0) {
        wind.fillText(String.fromCharCode(8592), 50, 65); //from right to left arrow
    } else if (windSpeed > 0) {
        wind.fillText(String.fromCharCode(8594), 50, 65); //from left to right arrow
    }
}

var breathHolding = false;
function breath() {
    //breathing crosshair offset
    if (breathHolding == false) { //is breathing = not holding breath
        //change offset
        if (crosshairBreathDirection == 1) { //going up
            crosshairBreath -= 0.7;
        } else if (crosshairBreathDirection == 2) { //coming down
            crosshairBreath += 0.7;
        }
        //at the end change direction
        if (crosshairBreath <= 0) {
            crosshairBreath = 0;
            crosshairBreathDirection = 2;
        } else if (crosshairBreath >= 25) {
            crosshairBreath = 25;
            crosshairBreathDirection = 1;
        }
    }
}

//get textures
var snowWall = document.getElementById("snowWall");
var hMetal = document.getElementById("hMetal");
var vMetal = document.getElementById("vMetal");

//find the main fieldCanvas
var fieldCanvas = document.getElementById("field");
var field = fieldCanvas.getContext("2d");

//find magazine canvas
var magazineCanvas = document.getElementById("magazine");
var magazine = magazineCanvas.getContext("2d");

//find wind canvas
var windCanvas = document.getElementById("wind");
var wind = windCanvas.getContext("2d");

function canvasRefresh() {
    //clear canvas
    field.fillStyle = "#b0b0b0";
    field.fillRect(0, 0, fieldCanvas.width, fieldCanvas.height);
    //field.drawImage(snowWall, 0, 0, fieldCanvas.width, fieldCanvas.height);

    //draw horizontal bar
    field.fillStyle = "#949494";
    field.fillRect(50, 210, fieldCanvas.width-50-50, 20);

    //draw vertyical bars
    field.fillStyle = "#949494";
    field.fillRect(50, 210, 20, fieldCanvas.height-210);
    field.fillRect(850, 210, 20, fieldCanvas.height-210);

    //draw target background
    field.fillStyle = "#d9d9d9";
    field.fillRect(150, 200, 600, 100);

    //draw number above targets
    field.fillStyle = "#ffc22b";
    field.fillRect(412, 125, 75, 75); //box fill
    field.strokeStyle = "#000000";
    field.strokeRect(412, 125, 75, 75); //box border
    field.font = "50px Verdana";
    field.fillStyle = "#000000";
    field.textBaseline = "middle";
    field.textAlign = "center";
    field.fillText("8", 449, 163); //text

    //hits
    drawHits(field);

    //targets
    drawTarget(field, 200, 250, targetRadius, 0);
    drawTarget(field, 325, 250, targetRadius, 1);
    drawTarget(field, 450, 250, targetRadius, 2);
    drawTarget(field, 575, 250, targetRadius, 3);
    drawTarget(field, 700, 250, targetRadius, 4);

    //update crosshair breathing offset
    breath();

    //crossahir
    //-100 is from canvas top and left styles
    //-150 is from offset (crosshair is not is the same position with pointer)
    drawCrosshair(field, mouseX-100, mouseY-100-150);

    //magazine (and bullets)
    drawMagazine(magazine);
}

//start mouse tracking
var mouseX;
var mouseY;
document.body.addEventListener("mousemove", function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

//keyboard controls
document.body.addEventListener("keydown", function(e) {
    if (e.keyCode == 32) { //space
        // SHOOT
        if (loaded==true && crosshairOpacity>0) { //crosshari is visible
            var shotX = mouseX;
            var shotY = mouseY;
            loaded = false;
            //check if hit the target
            for (var i=0; i<5; i++) {
                if (hitTheTarget(shotX, shotY, i) == true) {
                    console.log(i);
                    hittedTargets[i] = true;
                    break;
                }
            }
        }
    } else if (e.keyCode == 77) { //M-key
        // LOAD
        if (bullets>0 && loaded==false) {
            bullets = bullets - 1;
            loaded = true;
        }
    } else if (e.keyCode == 78) { //N-key
        // RELOAD MAGAZINE
        if (loaded == false) {
            bullets = 5;
        }
    } else if (e.keyCode == 66) {//B-key
        // MANUAL BULLET
        if (loaded==false && bullets==0) {
            bullets = 1;
        }
    } else if (e.keyCode == 90) { //Z-key
        // RESET TARGETS AND HITMARKS
        hittedTargets = [false, false, false, false, false];
        hitX = [];
        hitY = [];
    } else if (e.keyCode == 84) { //T-key
        // CROSSHAIR OFFSET LEFT
        if (crosshairOffset > -26) {
            crosshairOffset--;
        }
    } else if (e.keyCode == 89) { //Y-key
        // CROSSHAIR OFFSET RIGHT
        if (crosshairOffset < 26) {
            crosshairOffset++;
        }
    } else {
        console.log("Key: " + e.keyCode);
    }
});


//start checking mouse button
var mouseButtonDown = false;
document.body.addEventListener("mousedown", function() { mouseButtonDown = true; });
document.body.addEventListener("mouseup", function() { mouseButtonDown = false; });
//mouse button controls
function mouse() {
    if (mouseButtonDown == true) {
        breathHolding = true;
        if (crosshairOpacity > 0) {
            crosshairOpacity -= 0.2;
        }
    } else {
        breathHolding = false;
        if (crosshairOpacity < 1) {
            crosshairOpacity += 0.3;
        }
    }
}
var mouseLoop = setInterval(mouse, 200);


//start infinity loop
var mainLoop = setInterval(canvasRefresh, 1000/60);

//start wind controlling loop
var windLoop = setInterval(function() {
    windUpdate(wind);
}, 1000);