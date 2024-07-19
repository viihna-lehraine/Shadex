// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



// Random HSL generation
function randomHSL(limitGrayAndBlack, limitLight) {
    let hue = Math.floor(Math.random() * 360);
    let saturation = Math.floor(Math.random() * 101);
    let lightness = Math.floor(Math.random() * 101);

    if (limitGrayAndBlack || limitLight) {
        saturation = Math.max(saturation, 20);
        lightness = Math.max(lightness, 25);
    }

    if (limitLight) {
        lightness = Math.min(lightness, 75);
    }

    let color = { hue, saturation, lightness }
    return color;
}


// Random SL generation for an HSL attribute
function randomSL(limitGrayAndBlack, limitLight) {
    let saturation = Math.floor(Math.random() * 101);
    let lightness = Math.floor(Math.random() * 101);

    if (limitGrayAndBlack || limitLight) {
        saturation = Math.max(saturation, 20);
        lightness = Math.max(lightness, 25);
    }

    if (limitLight) {
        lightness = Math.min(lightness, 75);
    }

    // error checking - if saturation or lightness are outside the range 0-100, they are redefined to fit in that range
    if (saturation > 100) saturation = 100;
    if (saturation < 0) saturation = 0;
    if (lightness > 100) lightness = 100;
    if (lightness < 0) lightness = 0;

    let color = { saturation, lightness };
    return color;
}



// Generates a randomized 1st color
function generateColor1(limitGrayAndBlack, limitLight) {
    let color = randomHSL(limitGrayAndBlack, limitLight);
    const colorBox1 = document.getElementById('color-box-1');

    if (colorBox1) {
        colorBox1.style.backgroundColor = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
        populateColorTextOutputBox(color, 1);
    }
    return color;
}


export { randomHSL, randomSL, generateColor1 };