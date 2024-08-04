// ColorGen - version 0.5.22-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { hslToHexTryCaseHelper } from '../../export.js';
import { hsvToRGB } from '../../export.js';


// Convert color component to Hexfunction componentToHex(c) {
function componentToHex(c) {
    console.log('componentToHex()');
    console.log('componentToHex() - c: ', c, ' type: ', (typeof c));

    try {
        const hex = c.toString(16);
        console.log('componentToHex() - hex: ', hex, ' type: ', (typeof hex));
        console.log('componentToHex() - execution of componentToHex complete');
        return hex.length === 1 ? '0' + hex : hex;
    } catch (error) {
        console.error(`componentToHex() - error converting component to hex: ${error}`);
        console.log('componentToHex() complete - returning default component "00"');
        return '00'; // return '00' for invalid components
    }
}


// convert RGB to Hex
function rgbToHex(red, green, blue) {
    console.log('executing rgbToHex');
    console.log('red: ', red, ' green: ', green, ' blue: ', blue);
    console.log('types - red: ', (typeof red), ' green: ', (typeof green), ' blue: ', (typeof blue));

    try {
        console.log(`Converting RGB to Hex: R=${red}, G=${green}, B=${blue}`);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`Invalid RGB values: R=${red}, G=${green}, B=${blue}`);
        }

        console.log('calling componentToHex 3x - once each for paramters red, green, and blue');
        console.log('execution of rgbToHex complete');
        return '#' + componentToHex(red) + componentToHex(green) + componentToHex(blue);
    } catch (error) {
        console.error(`Error converting RGB to Hex: ${error}`);

        console.log('execution of rgbToHex complete');

        // Return black for invalid inputs
        return '#000000';
    }
}


// Convert HSL to Hex
function hslToHex(hue, saturation, lightness) {
    console.log('hslToHex() executing');
    console.log('hslToHex() - hue: ', hue, ' saturation: ', saturation, ' lightness: ', lightness);
    console.log('hslToHex() - types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' lightness: ', (typeof lightness));
    
    try {
        hslToHexTryCaseHelper(hue, saturation, lightness);
        console.log('hslToHex() - execution of hslToHex complete; calling rgbToHex with parameters (rgb.red, rgb.green, rgb.blue) and returning hex: ', hex, ' type: ', (typeof hex));
        return rgbToHex(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        console.error(`hslToHex() - error converting HSL to Hex: ${error}`);
        console.log('hslToHex complete - returning "#000000"');
        return '#000000'; // return black for invalid inputs
    }
};


// Convert HSV to Hex
function hsvToHex(hue, saturation, value) {
    console.log('hsvToHex() executing');
    console.log('hsvToHex() - hue: ', hue, ' saturation: ', saturation, ' value: ', value);
    console.log('hsvToHex() - types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' value: ', (typeof value));

    try {
        console.log(`hsvToHex() - converting HSV to Hex: H=${hue}, S=${saturation}, V=${value}`);
        const rgb = hsvToRGB(hue, saturation, value);
        console.log(`hsvToHex() - converted RGB from HSV: ${JSON.stringify(rgb)}`);
        console.log('hsvToHex() - rgb: ', rgb, ' type: ', (typeof rgb));
        return rgbToHex(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        console.error(`hsvToHex() complete > error converting HSV to Hex: ${error} - returning "#000000"`);
        return '#000000'; // return black for invalid input
    }
}


// Convert CMYK to Hex
function cmykToHex(cyan, magenta, yellow, key) {
    console.log('cmykToHex() executing');
    console.log('cmykToHex() - cyan: ', cyan, ' magenta: ', magenta, ' yellow: ', yellow, ' key: ', key);
    console.log('cmykToHex() > types - cyan: ', (typeof cyan), ' magenta: ', (typeof magenta), ' yellow: ', (typeof yellow), ' key: ', (typeof key));

    try {
        console.log(`cmykToHex() - converting CMYK to Hex: C=${cyan}, M=${magenta}, Y=${yellow}, K=${key}`);
        console.log('cmykToHex() - calling cmykToHex() with parameters (cyan, magenta, yellow, key)');
        const rgb = cmykToRGB(cyan, magenta, yellow, key);
        console.log(`cmykToHex() - converted RGB from CMYK: ${JSON.stringify(rgb)}`);
        console.log('cmykToHex() - rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('cmykToHex() complete');
        return rgbToHex(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        console.error(`cmykToHex() - error converting CMYK to Hex: ${error}`);
        console.log('cmykToHex() complete - returning "#000000"');
        return '#000000'; // return black for invalid inputs
    }
}


// Convert Lab to Hex
function labToHex(l, a, b) {
    console.log('labToHex() executing');
    console.log('labToHex() - l: ', l, ' a: ', a, ' b: ', b);
    console.log('labToHex() - types - l: ', (typeof l), ' a: ', (typeof a), ' b: ', (typeof b));

    try {
        console.log(`labToHex() - converting Lab to Hex: L=${l}, A=${a}, B=${b}`);
        console.log('labToHex() - calling labToRGB');
        const rgb = labToRGB(l, a, b);
        console.log(`labToHex() - converted RGB from Lab: ${JSON.stringify(rgb)}`);
        console.log('labToHex() - rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('labToHex() - execution of labToHex complete');
        return rgbToHex(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        console.error(`labToHex() - error converting Lab to Hex: ${error}`);
        console.log('labToHex() complete - returning "#000000"');
        return '#000000'; // return black for invalid input
    }
}


export { componentToHex, rgbToHex, hslToHex, hsvToHex, cmykToHex, labToHex };