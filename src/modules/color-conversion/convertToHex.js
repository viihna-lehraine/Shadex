// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { hslToRGB } from "./index.js";


// Convert color component to Hexfunction componentToHex(c) {
function componentToHex(c) {
    console.log('executing componentToHex');
    console.log('c: ', c, ' type: ', (typeof c));

    try {
        const hex = c.toString(16);
        console.log('hex: ', hex, ' type: ', (typeof hex));
        console.log('execution of componentToHex complete');

        return hex.length === 1 ? '0' + hex : hex;
    } catch (error) {
        console.error(`Error converting component to hex: ${error}`);

        console.log('execution of componentToHex complete');

        // Return '00' for invalid components
        return '00'; 
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
    console.log('calling hslToHex');
    console.log('hue: ', hue, ' saturation: ', saturation, ' lightness: ', lightness);
    console.log('types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' lightness: ', (typeof lightness));
    
    try {
        console.log(`Converting HSL to Hex: H=${hue}, S=${saturation}, L=${lightness}`);
        console.log('calling hslToRGB');
        const rgb = hslToRGB(hue, saturation, lightness);
        console.log(`Converted RGB from HSL: ${JSON.stringify(rgb)}`);
        console.log('rgb: ', rgb, ' type: ', (typeof rgb));

        console.log('calling rgbToHex');
        console.log('execution of hslToHex complete');
        return rgbToHex(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        console.error(`Error converting HSL to Hex: ${error}`);

        console.log('execution of hslToHex complete');

        // Return black for invalid inputs
        return '#000000'; 
    }
}


// Convert HSV to Hex
function hsvToHex(hue, saturation, value) {
    console.log('executing hsvToHex');
    console.log('hue: ', hue, ' saturation: ', saturation, ' value: ', value);
    console.log('types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' value: ', (typeof value));

    try {
        console.log(`Converting HSV to Hex: H=${hue}, S=${saturation}, V=${value}`);
        const rgb = hsvToRGB(hue, saturation, value);
        console.log(`Converted RGB from HSV: ${JSON.stringify(rgb)}`);
        console.log('rgb: ', rgb, ' type: ', (typeof rgb));

        return rgbToHex(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        console.error(`Error converting HSV to Hex: ${error}`);

        // Return black for invalid input
        return '#000000'; 
    }
}


// Convert CMYK to Hex
function cmykToHex(cyan, magenta, yellow, key) {
    console.log('executing cmykToHex');
    console.log('cyan: ', cyan, ' magenta: ', magenta, ' yellow: ', yellow, ' key: ', key);
    console.log('types - cyan: ', (typeof cyan), ' magenta: ', (typeof magenta), ' yellow: ', (typeof yellow), ' key: ', (typeof key));

    try {
        console.log(`Converting CMYK to Hex: C=${cyan}, M=${magenta}, Y=${yellow}, K=${key}`);
        console.log('calling cmykToHex');
        const rgb = cmykToRGB(cyan, magenta, yellow, key);
        console.log(`Converted RGB from CMYK: ${JSON.stringify(rgb)}`);
        console.log('rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('execution of cmykToHex complete');

        return rgbToHex(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        console.error(`Error converting CMYK to Hex: ${error}`);
        console.log('execution of cmykToHex complete');
        
        // Return black for invalid inputs
        return '#000000'; 
    }
}


// Convert Lab to Hex
function labToHex(l, a, b) {
    console.log('executing labToHex');
    console.log('l: ', l, ' a: ', a, ' b: ', b);
    console.log('types - l: ', (typeof l), ' a: ', (typeof a), ' b: ', (typeof b));

    try {
        console.log(`Converting Lab to Hex: L=${l}, A=${a}, B=${b}`);
        console.log('calling labToRGB');
        const rgb = labToRGB(l, a, b);
        console.log(`Converted RGB from Lab: ${JSON.stringify(rgb)}`);
        console.log('rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('execution of labToHex complete');

        return rgbToHex(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        console.error(`Error converting Lab to Hex: ${error}`);

        console.log('execution of labToHex complete');

        
        // Return black for invalid input
        return '#000000'; 
    }
}


export { componentToHex, rgbToHex, hslToHex, hsvToHex, cmykToHex, labToHex }