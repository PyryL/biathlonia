/*
    BIATHLONIA
    Pyry Lahtinen
    18.10.2019
*/



function requirements() {
    //on page load check if the screen is too small
    const sreenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    if (sreenWidth < 1400) {
        alert("Screen width is recommended to be at least 1400 pixels.");
    } else if (screenHeight < 500) {
        alert("Screen height is recommended to be at least 500 pixels.");
    }
}
//check disabled javascript in <noscript> in index.html




function fpsChange() {
    //get the inputted value
    var fps = document.getElementById("fps").value;
    if (fps < 1) {
        fps = 1;
        document.getElementById("fps").value = 1;
    } else if (fps > 120) {
        fps = 120;
        document.getElementById("fps").value = 120;
    }
    //stop the main loop for a while
    clearInterval(mainLoop);
    //restart main loop with new refresh rate
    mainLoop = setInterval(canvasRefresh, 1000/fps);
}

function targetRadiusChange() {
    //get the inputted data
    targetRadius = document.getElementById("targetRadius").value;
    if (targetRadius > 10) {
        targetRadius = 10;
        document.getElementById("targetRadius").value = 10;
    } else if (targetRadius < 1) {
        targetRadius = 1;
        document.getElementById("targetRadius").value = 1;
    }
}

function windChange() {
    //get inputted data
    windScenery = document.getElementById("windSetting").value;

    if (windScenery == 0) { //calm
        windSpeed = 0;
        windAcceleration = 0;
    } else if (windScenery == 1) { //normal
        var direction = Math.round(Math.random()); //0 = <-; 1 = ->
        windAcceleration = 1;
    } else if (windScenery == 2) { //storm
        var direction = Math.round(Math.random()); //0 = <-; 1 = ->
        windAcceleration = 2;
    }

    //blur the focus, because it may disturb keyboard controls
    document.getElementById("windSetting").blur();
}