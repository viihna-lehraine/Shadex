// ColorGen - version 0.5.22-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { applyLimitGrayAndBlack, applyLimitLight } from '../export.js';


// Random SL generation for an HSL attribute
function randomSL(limitGrayAndBlack, limitLight) {
    console.log('executing randomSL()');

    let saturation = Math.floor(Math.random() * 101);
    let lightness = Math.floor(Math.random() * 101);

    // error checking - if saturation or lightness are outside the range 0-100, they are redefined to fit in that range
    if (saturation > 100) saturation = 100;
    if (saturation < 0) saturation = 0;
    if (lightness > 100) lightness = 100;
    if (lightness < 0) lightness = 0;

    if (limitGrayAndBlack) {
        console.log('randomSL() - calling applyLimitGrayAndBlack()');
        ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
    }

    if (limitLight) {
        console.log('randomSL() - calling applyLimitLight()');
        lightness = applyLimitLight(lightness);
    }

    let color = { saturation, lightness };

    console.log('randomSL() - color: ', color, ' type: ', (typeof color));
    console.log('randomSL() - saturation: ', color.saturation, ' typeof saturation: ', (typeof color.saturation), ' lightness: ', color.lightness, ' typeof lightness: ', (typeof lightness));
    console.log('randomSL() complete - returning color');
    return color;
};


// Random SV generation for an HSL attribute
function randomSV() {
    console.log('executing randomSV()');

    let saturation = Math.floor(Math.random() * 101);
    let value = Math.floor(Math.random() * 101);

    // error checking - if saturation or lightness are outside the range 0-100, they are redefined to fit in that range
    if (saturation > 100) saturation = 100;
    if (saturation < 0) saturation = 0;
    if (value > 100) value = 100;
    if (value < 0) value = 0;

    let color = { saturation, value };

    console.log('randomSV() - color: ', color, ' type: ', (typeof color));
    console.log('randomSV() - saturation: ', color.saturation, ' typeof saturation: ', (typeof color.saturation), ' value: ', color.value, ' typeof value: ', (typeof value));
    console.log('randomSV() complete - returning color');
    return color;
};


// Random Hex Digit Generation
function generateRandomHexDigit() {
    console.log('generateRandomHexDigit() executing');

    const hexDigits = '0123456789ABCDEF';
    const randomIndex = Math.floor(Math.random() * hexDigits.length);

    console.log('generateRandomHexDigit() complete');
    return hexDigits[randomIndex];
};


// Random Hex Generation
function randomHex() {
    console.log('randomHex() executing');
    let hexCodeArray = [];

    for (let i = 0; i < 6; i++) {
        hexCodeArray.push(generateRandomHexDigit());
    }

    console.log('randomHex() complete');
    return {
        format: 'hex',
        value: '#' + hexCodeArray.join('')
    }
};


// Random RGB Generation
function randomRGB() {
    console.log('randomRGB() executing');
    console.log('randomRGB() complete, returning { format: "rgb", red: , green: , blue: }');
    return {
        format: 'rgb',
        red: Math.floor(Math.random() * 256),
        green: Math.floor(Math.random() * 256),
        blue: Math.floor(Math.random() * 256)
    }
};


// Random HSL generation
function randomHSL(limitGrayAndBlack, limitLight) {
    console.log('randomHSL() executing');

    let hue = Math.floor(Math.random() * 360);
    let saturation = Math.floor(Math.random() * 101);
    let lightness = Math.floor(Math.random() * 101);

    console.log(`randomHSL() - initial random HSL: H=${hue}, S=${saturation}, L=${lightness}`);

    if (limitGrayAndBlack) {
        console.log('randomHSL() - calling applyLimitGrayAndBlack()');
        ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));

        console.log(`randomHSL() - limited gray and black for random HSL: S=${saturation}%, L=${lightness}}`);
    }

    if (limitLight) {
        console.log('randomHSL() - calling applyLimitLight()');
        lightness = applyLimitLight(lightness);

        console.log(`randomHSL() - limited lightness for random HSL: L=${lightness}%`);
    }

    console.log(`randomHSL() - generated random HSL: hsl(${hue}, ${saturation}%, ${lightness}%)`);

    console.log('randomHSL() complete');
    return {
        format: 'hsl',
        hue,
        saturation,
        lightness
    }
};


// Random HSV Generation
function randomHSV() {
    console.log('randomHSV() executing');
    console.log('randomHSV() complete, returning { format: "hsv", hue: , saturation: , value: }');
    return {
        format: 'hsv',
        hue: Math.floor(Math.random() * 360),
        saturation: Math.floor(Math.random() * 101),
        value: Math.floor(Math.random() * 101)
    }
};


// Random CMYK Generation
function randomCMYK() {
    console.log('randomCMYK() executing');
    console.log('randomCMYK() complete, returning { format: "cmyk", cyan: , magenta: , yellow: , key: }');
    return {
        format: 'cmyk',
        cyan: Math.floor(Math.random() * 101),
        magenta: Math.floor(Math.random() * 101),
        yellow: Math.floor(Math.random() * 101),
        black: Math.floor(Math.random() * 101)
    }
};


// Random Lab (CIELAB) Generation
function randomLab() {
    console.log('randomLab() executing');
    console.log('randomLab() complete, returning { format: "lab", l: , a: , b: }');
    return {
        format: 'lab',
        l: (Math.random() * 100).toFixed(2),
        a: ((Math.random() * 256) - 128).toFixed(2),
        b: ((Math.random() * 256) - 128).toFixed(2)
    }
};


// Generates a randomized 1st color
function generateRandomFirstColor(limitGrayAndBlack, limitLight, initialColorSpace) {
    console.log('generateRandomFirstColor() executing');
    console.log('generateRandomFirstColor() - limitGrayAndBlack: ', limitGrayAndBlack, ' limitLight: ', limitLight, ' initialColorSpace: ', initialColorSpace);
    console.log('generateRandomFirstColor() - types > limitGrayAndBlack: ', (typeof limitGrayAndBlack), ' limitLight: ', (typeof limitLight), ' initialColorSpace: ', (typeof initialColorSpace));

    let color;

    switch (initialColorSpace) {
        case 'hex':
            console.log('generateRandomFirstColor() - calling randomHex()');
            color = randomHex(limitGrayAndBlack, limitLight);
            console.log('generateRandomFirstColor() - generated color: ', color, ' type: ', (typeof color));
            break;
        case 'rgb':
            console.log('generateRandomFirstColor() - calling randomRGB()');
            color = randomRGB(limitGrayAndBlack, limitLight);
            console.log('generateRandomFirstColor() - generated color: ', color, ' type: ', (typeof color));
            break;
        case 'hsl':
            console.log('generateRandomFirstColor() - calling randomHSL()');
            color = randomHSL(limitGrayAndBlack, limitLight);
            console.log('generateRandomFirstColor() - generated color: ', color, ' type: ', (typeof color));
            break;
        case 'hsv':
            console.log('generateRandomFirstColor() - calling randomHSV()');
            color = randomHSV(limitGrayAndBlack, limitLight);
            console.log('generateRandomFirstColor() - generated color: ', color, ' type: ', (typeof color));
            break;
        case 'cmyk':
            console.log('generateRandomFirstColor() - calling randomCMYK()');
            color = randomCMYK(limitGrayAndBlack, limitLight);
            console.log('generateRandomFirstColor() - generated color: ', color, ' type: ', (typeof color));
            break;
        case 'lab':
            console.log('generateRandomFirstColor() - calling randomLab()');
            color = randomLab(limitGrayAndBlack, limitLight);
            console.log('generateRandomFirstColor() - generated color: ', color, ' type: ', (typeof color));
            break;
        default:
            console.log('generateRandomFirstColor() - DEFAULT CASE > calling randomHex()');
            color = randomHex(limitGrayAndBlack, limitLight);
            console.log('generateRandomFirstColor() - initialColorSpace: ', initialColorSpace, ' type: ', (typeof initialColorSpace));
            console.log('generateRandomFirstColor() - generated color: ', color, ' type: ', (typeof color));
            break;
    }

    console.log(`generateRandomFirstColor() - generated color with generateRandomFirstColor() > ${JSON.stringify(color)}`);

    const colorBox1 = document.getElementById('color-box-1');

    if (colorBox1) {
        let colorString;

        switch (initialColorSpace) {
            case 'hex':
                console.log('generateRandomFirstColor() - declaring colorString using color: ', color, ' type: ', (typeof color));
                colorString = color;
                console.log('generateRandomFirstColor() - colorString declared > colorString: ', colorString, ' type: ', (typeof colorString));
                break;
            case 'rgb':
                console.log('generateRandomFirstColor() - declaring colorString using color: ', color, ' type: ', (typeof color));
                colorString = `rgb(${color.red}, ${color.green}, ${color.blue})`;
                console.log('generateRandomFirstColor() - colorString declared > colorString: ', colorString, ' type: ', (typeof colorString));
                break;
            case 'hsl':
                console.log('generateRandomFirstColor() - declaring colorString using color: ', color, ' type: ', (typeof color));
                colorString = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
                console.log('generateRandomFirstColor() - colorString declared > colorString: ', colorString, ' type: ', (typeof colorString));
                break;
            case 'hsv':
                console.log('generateRandomFirstColor() - declaring colorString using color: ', color, ' type: ', (typeof color));
                colorString = `hsv(${color.hue}, ${color.saturation}%, ${color.value}%)`;
                console.log('generateRandomFirstColor() - colorString declared > colorString: ', colorString, ' type: ', (typeof colorString));
                break;
            case 'cmyk':
                console.log('generateRandomFirstColor() - declaring colorString using color: ', color, ' type: ', (typeof color));
                colorString = `cmyk(${color.cyan}, ${color.magenta}, ${color.yellow}, ${color.black})`;
                console.log('generateRandomFirstColor() - colorString declared > colorString: ', colorString, ' type: ', (typeof colorString));
                break;
            case 'lab':
                console.log('generateRandomFirstColor() - declaring colorString using color: ', color, ' type: ', (typeof color));
                colorString = `lab(${color.l}, ${color.a}, ${color.b})`;
                console.log('generateRandomFirstColor() - colorString declared > colorString: ', colorString, ' type: ', (typeof colorString));
                break;
            default:
                console.log('generateRandomFirstColor() - declaring colorString using color: ', color, ' type: ', (typeof color));
                colorString = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
                console.log('generateRandomFirstColor() - colorString declared > colorString: ', colorString, ' type: ', (typeof colorString));
                break
        }

        console.log(`generateRandomFirstColor() - setting background color to ${colorString}`);

        colorBox1.style.backgroundColor = colorString;
        populateColorTextOutputBox(color, 1);
    }

    console.log('generateRandomFirstColor() complete');
    return color;
};


export { randomSL, randomSV, generateRandomHexDigit, randomHex, randomRGB, randomHSL, randomHSV, randomCMYK, randomLab, generateRandomFirstColor };