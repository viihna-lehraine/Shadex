// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { hslToRGB } from "./index.js";


// Convert color component to Hexfunction componentToHex(c) {
function componentToHex(c) {
    try {
        const hex = c.toString(16);

        return hex.length === 1 ? '0' + hex : hex;
    } catch (error) {
        console.error(`Error converting component to hex: ${error}`);

        // Return '00' for invalid components
        return '00'; 
    }
}


// convert RGB to Hex
function rgbToHex(red, green, blue) {
    try {
        console.log(`Converting RGB to Hex: R=${red}, G=${green}, B=${blue}`);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`Invalid RGB values: R=${red}, G=${green}, B=${blue}`);
        }

        return '#' + componentToHex(red) + componentToHex(green) + componentToHex(blue);
    } catch (error) {
        console.error(`Error converting RGB to Hex: ${error}`);

        // Return black for invalid inputs
        return '#000000';
    }
}


// Convert HSL to Hex
function hslToHex(hue, saturation, lightness) {
    try {
        console.log(`Converting HSL to Hex: H=${hue}, S=${saturation}, L=${lightness}`);
        const rgb = hslToRGB(hue, saturation, lightness);
        console.log(`Converted RGB from HSL: ${JSON.stringify(rgb)}`);

        return rgbToHex(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        console.error(`Error converting HSL to Hex: ${error}`);

        // Return black for invalid inputs
        return '#000000'; 
    }
}


// Convert HSV to Hex
function hsvToHex(hue, saturation, value) {
    try {
        console.log(`Converting HSV to Hex: H=${hue}, S=${saturation}, V=${value}`);
        const rgb = hsvToRGB(hue, saturation, value);
        console.log(`Converted RGB from HSV: ${JSON.stringify(rgb)}`);

        return rgbToHex(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        console.error(`Error converting HSV to Hex: ${error}`);

        // Return black for invalid input
        return '#000000'; 
    }
}


// Convert CMYK to Hex
function cmykToHex(cyan, magenta, yellow, key) {
    try {
        console.log(`Converting CMYK to Hex: C=${cyan}, M=${magenta}, Y=${yellow}, K=${key}`);
        const rgb = cmykToRGB(cyan, magenta, yellow, key);
        console.log(`Converted RGB from CMYK: ${JSON.stringify(rgb)}`);

        return rgbToHex(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        console.error(`Error converting CMYK to Hex: ${error}`);
        
        // Return black for invalid inputs
        return '#000000'; 
    }
}


// Convert Lab to Hex
function labToHex(l, a, b) {
    try {
        console.log(`Converting Lab to Hex: L=${l}, A=${a}, B=${b}`);
        const rgb = labToRGB(l, a, b);
        console.log(`Converted RGB from Lab: ${JSON.stringify(rgb)}`);

        return rgbToHex(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        console.error(`Error converting Lab to Hex: ${error}`);
        
        // Return black for invalid input
        return '#000000'; 
    }
}


export { componentToHex, rgbToHex, hslToHex, hsvToHex, cmykToHex, labToHex }