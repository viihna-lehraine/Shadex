// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { applyLimitGrayAndBlack, applyLimitLight } from "../modules/palette-generation/index.js";


// Random Hex Digit Generation
function generateRandomHexDigit() {
    const hexDigits = '0123456789ABCDEF';
    const randomIndex = Math.floor(Math.random() * hexDigits.length);
    return hexDigits[randomIndex];
}


// Random Hex Generation
function randomHex(limitGrayAndBlack, limitLight) {
    let hexCodeArray = [];
    for (let i = 0; i < 6; i++) {
        hexCodeArray.push(generateRandomHexDigit());
    }

    return {
        format: 'hex',
        value: '#' + hexCodeArray.join('').toUpperCase()
    };
}


// Random RGB Generation
function randomRGB(limitGrayAndBlack, limitLight) {
    return {
        format: 'rgb',
        red: Math.floor(Math.random() * 256),
        green: Math.floor(Math.random() * 256),
        blue: Math.floor(Math.random() * 256)
    };
}


// Random HSL generation
function randomHSL(limitGrayAndBlack, limitLight) {
    let hue = Math.floor(Math.random() * 360);
    let saturation = Math.floor(Math.random() * 101);
    let lightness = Math.floor(Math.random() * 101);

    if (limitGrayAndBlack) {
        ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
    }

    if (limitLight) {
        lightness = applyLimitLight(lightness);
    }

    return {
        format: 'hsl',
        hue,
        saturation,
        lightness
    };
}


// Random SL generation for an HSL attribute
function randomSL(limitGrayAndBlack, limitLight) {
    let saturation = Math.floor(Math.random() * 101);
    let lightness = Math.floor(Math.random() * 101);

    // error checking - if saturation or lightness are outside the range 0-100, they are redefined to fit in that range
    if (saturation > 100) saturation = 100;
    if (saturation < 0) saturation = 0;
    if (lightness > 100) lightness = 100;
    if (lightness < 0) lightness = 0;

    if (limitGrayAndBlack) {
        ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
    }

    if (limitLight) {
        lightness = applyLimitLight(lightness);
    }

    let color = { saturation, lightness };

    console.log('Generated SL: ', color);

    return color;
}


// Random HSV Generation
function randomHSV(limitGrayAndBlack, limitLight) {
    return {
        format: 'hsv',
        hue: Math.floor(Math.random() * 360),
        saturation: Math.floor(Math.random() * 101),
        value: Math.floor(Math.random() * 101)
    };
}


// Random SV generation for an HSL attribute
function randomSV(limitGrayAndBlack, limitLight) {
    let saturation = Math.floor(Math.random() * 101);
    let value = Math.floor(Math.random() * 101);

    // error checking - if saturation or lightness are outside the range 0-100, they are redefined to fit in that range
    if (saturation > 100) saturation = 100;
    if (saturation < 0) saturation = 0;
    if (value > 100) value = 100;
    if (value < 0) value = 0;

    let color = { saturation, value };

    return color;
}


// Random CMYK Generation
function randomCMYK(limitGrayAndBlack, limitLight) {
    return {
        format: 'cmyk',
        cyan: Math.floor(Math.random() * 101),
        magenta: Math.floor(Math.random() * 101),
        yellow: Math.floor(Math.random() * 101),
        black: Math.floor(Math.random() * 101)
    };
}


// Random Lab (CIELAB) Generation
function randomLab(limitGrayAndBlack, limitLight) {
    return {
        format: 'lab',
        l: (Math.random() * 100).toFixed(2),
        a: ((Math.random() * 256) - 128).toFixed(2),
        b: ((Math.random() * 256) - 128).toFixed(2)
    };
}


// Generates a randomized 1st color
function generateColor1(limitGrayAndBlack, limitLight, initialColorSpace) {
    let color;

    switch (initialColorSpace) {
        case 'hex':
            color = randomHex(limitGrayAndBlack, limitLight);
            break;
        case 'rgb':
            color = randomRGB(limitGrayAndBlack, limitLight);
            break;
        case 'hsl':
            color = randomHSL(limitGrayAndBlack, limitLight);
            break;
        case 'hsv':
            color = randomHSV(limitGrayAndBlack, limitLight);
            break;
        case 'cmyk':
            color = randomCMYK(limitGrayAndBlack, limitLight);
            break;
        case 'lab':
            color = randomLab(limitGrayAndBlack, limitLight);
            break;
        default:
            color = randomHSL(limitGrayAndBlack, limitLight);
            break;
    }

    const colorBox1 = document.getElementById('color-box-1');

    if (colorBox1) {
        let colorString;
        switch (initialColorSpace) {
            case 'hex':
                colorString = color;
                break;
            case 'rgb':
                colorString = `rgb(${color.red}, ${color.green}, ${color.blue})`;
                break;
            case 'hsl':
                colorString = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
                break;
            case 'hsv':
                colorString = `hsv(${color.hue}, ${color.saturation}%, ${color.value}%)`;
                break;
            case 'cmyk':
                colorString = `cmyk(${color.cyan}, ${color.magenta}, ${color.yellow}, ${color.black})`;
                break;
            case 'lab':
                colorString = `lab(${color.l}, ${color.a}, ${color.b})`;
                break;
            default:
                colorString = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
        }

        colorBox1.style.backgroundColor = colorString;
        populateColorTextOutputBox(color, 1);
    }

    return color;
}


export { randomHex, randomRGB, randomHSL, randomSL, randomHSV, randomCMYK, randomLab, generateColor1 };