// ColorGen - version 0.5.22-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { hexToRGB, hslToRGB, hsvToRGB } from "../../export.js";


// Convert Hex to CMYK
function hexToCMYK(hex) {
    console.log('hexToCMYK() executing');
    console.log('hexToCMYK() - hex: ', hex, ' data type ', (typeof hex));

    try {
        console.log(`hexToCMYK() - converting Hex to CMYK: ${hex}`);
        console.log('hexToCMYK() - calling hexToRGB()')
        const rgb = hexToRGB(hex);
        console.log(`hexToCMYK() - converted RGB from Hex: ${JSON.stringify(rgb)}`);
        console.log('hexToCMYK() - rgb: ', rgb, ' data type: ', (typeof rgb));
        console.log('hexToCMYK() - calling rgbToCMYK()');
        const cmyk = rgbToCMYK(rgb.red, rgb.green, rgb.blue);
        console.log(`hexToCMYK() - converted CMYK from RGB: ${JSON.stringify(cmyk)}`);
        console.log('hexToCMYK() - cmyk: ', cmyk, ' data type: ', (typeof cmyk));
        console.log('hexToCMYK() complete - returning cmyk as a formatted string');
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;
    } catch (error) {
        console.error(`hexToCMYK() - error converting Hex to CMYK: ${error}`);
        const cmyk = { cyan: 0, magenta: 0, yellow: 0, key: 0 }; // return black in case of error
        console.log('hexToCMYK() - cmyk: ', cmyk, ' data type: ', (typeof cmyk));
        console.log('hexToCMYK() complete - returning cmyk as a formatted string');
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`; 
    }
};


// Convert RGB to CMYK
function rgbToCMYK(red, green, blue) {
    console.log('rgbToCMYK() executing');
    console.log('rgbToCMYK() - red: ', red, ' green: ', green, ' blue: ', blue);
    console.log('rgbToCMYK() > types - red: ', (typeof red), ' green: ', (typeof green), ' blue: ', (typeof blue));

    try {
        console.log(`rgbToCMYK() - converting RGB to CMYK: R=${red}, G=${green}, B=${blue}`);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`rgbToCMYK() - invalid RGB values: R=${red}, G=${green}, B=${blue}`);
        }

        const redPrime = red / 255;
        const greenPrime = green / 255;
        const bluePrime = blue / 255;

        const key = 1 - Math.max(redPrime, greenPrime, bluePrime);
        const cyan = (1 - redPrime - key) / (1 - key) || 0;
        const magenta = (1 - greenPrime - key) / (1 - key) || 0;
        const yellow = (1 - bluePrime - key) / (1 - key) || 0;

        const cmyk = {
            cyan: Math.round(cyan * 100),
            magenta: Math.round(magenta * 100),
            yellow: Math.round(yellow * 100),
            key: Math.round(key * 100)
        };
        
        if (isNaN(cmyk.cyan) || isNaN(cmyk.magenta) || isNaN(cmyk.yellow) || isNaN(cmyk.key)) {
            throw new Error(`rgbToCMYK() - invalid CMYK values generated: ${JSON.stringify(cmyk)}`);
        }

        console.log(`rgbToCMYK() - converted CMYK from RGB: ${JSON.stringify(cmyk)}`);
        console.log('rgbToCMYK() - cmyk: ', cmyk, ' data type: ', (typeof cmyk));
        console.log('rgbToCMYK() complete - returning cmyk as an object');
        return cmyk;
    } catch (error) {
        console.error(`rgbToCMYK() - error converting RGB to CMYK: ${error}`);
        console.log('rgbToCMYK() complete; setting default CMYK value { 0, 0, 0, 0 }');
        return { cyan: 0, magenta: 0, yellow: 0, key: 0 }; // set default CMYK in case of error
    }
};


// Convert HSL to CMYK
function hslToCMYK(hue, saturation, lightness) {
    console.log('hslToCMYK() executing');
    console.log('hslToCMYK() - hue: ', hue, ' saturation: ', saturation, ' lightness: ', lightness);
    console.log('hslToCMYK() > types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' lightness: ', (typeof lightness));

    try {
        console.log(`hslToCMYK() - converting HSL to CMYK: H=${hue}, S=${saturation}, L=${lightness}`);
        const rgb = hslToRGB(hue, saturation, lightness);
        console.log('hslToCMYK() - rgb: ', rgb, ' type: ', (typeof rgb));
        console.log(`hslToCMYK() - converted RGB from HSL: ${JSON.stringify(rgb)}`);
        console.log('hslToCMYK() - calling rgbToCMYK(rgb.red, rgb.green, rgb.blue)');
        const cmyk = rgbToCMYK(rgb.red, rgb.green, rgb.blue);
        console.log('cmyk: ', cmyk, ' type: ', (typeof cmyk));
        console.log('hslToCMYK() complete - returning cmyk as a formatted string');
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;
    } catch (error) {
        console.error(`hslToCMYK() - error converting HSL to CMYK: ${error}`);
        const cmyk = { cyan: 0, magenta: 0, yellow: 0, key: 0 }; // set default CMYK in case of error
        console.log('hslToCMYK() complete - returning cmyk with properties { cyan: 0, magenta: 0, yellow: 0, key: 0 } as a formatted string');
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`; 
    }
};


// Convert HSV to CMYK
function hsvToCMYK(hue, saturation, value) {
    console.log('hsvToCMYK() executing');
    console.log('hsvToCMYK() - hue: ', hue, ' saturation: ', saturation, ' value: ', value);
    console.log('hsvToCMYK() > types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' value: ', (typeof value));

    try {
        console.log(`hsvToCMYK() - converting HSV to CMYK: H=${hue}, S=${saturation}, V=${value}`);
        console.log('hsvToCMYK() - calling hsvToRGB()');
        const rgb = hsvToRGB(hue, saturation, value);
        console.log(`hsvToCMYK() - converted RGB from HSV: ${JSON.stringify(rgb)}`);
        console.log('hsvToCMYK() - rgb: ', rgb, ' type: ', (typeof rgb));
        const cmyk = rgbToCMYK(rgb.red, rgb.green, rgb.blue);
        console.log('hsvToCMYK() - cmyk: ', cmyk, ' type: ', (typeof cmyk));
        console.log('hsvToCMYK() complete - returning cmyk as a formatted string');
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;
    } catch (error) {
        console.error(`hsvToCMYK() - error converting HSV to CMYK: ${error}`);
        const cmyk = { cyan: 0, magenta: 0, yellow: 0, key: 0 }; // set default cmyk in case of error
        console.log('hsvToCMYK() complete - returning { cyan: 0, magenta: 0, yellow: 0, key: 0 } formatted as a string');
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`; 
    }
};


// Convert Lab to CMYK
function labToCMYK(l, a, b) {
    console.log('labToCMYK() executing');
    console.log('labToCMYK() - l: ', l, ' a: ', a, ' b: ', b);
    console.log('labToCMYK() > types - l: ', (typeof l), ' a: ', (typeof a), ' b: ', (typeof b));

    try {
        console.log(`labToCMYK() - converting Lab to CMYK: L=${l}, A=${a}, B=${b}`);
        console.log('labToCMYK() - calling labToRGB()');
        const rgb = labToRGB(l, a, b);
        console.log(`labToCMYK() - converted RGB from Lab: ${JSON.stringify(rgb)}`);
        console.log('labToCMYK() - rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('labToCMYK() - calling rgbToCMYK(rgb.red, rgb.green, rgb.blue');
        const cmyk = rgbToCMYK(rgb.red, rgb.green, rgb.blue);
        console.log('cmyk: ', cmyk, ' type: ', (typeof cmyk));
        console.log('labToCMYK() complete - returning cmyk as a formatted string');
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;
    } catch (error) {
        console.error(`labToCMYK() - error converting Lab to CMYK: ${error}`);
        const cmyk = { cyan: 0, magenta: 0, yellow: 0, key: 0 }; // set default CMYK in case of error
        console.log('labToCMYK() complete - returning cmyk { cyan: 0, magenta: 0, yellow: 0, key: 0 } as a formatted string');
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;  
    }
};


export { hexToCMYK, rgbToCMYK, hslToCMYK, hsvToCMYK, labToCMYK };