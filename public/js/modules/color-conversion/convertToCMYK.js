// ColorGen - version 0.5.22-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { hexToCMYKInitLogs, hexToCMYKTryExitLogs, hexToCMYKCatchExitLogs, rgbToCMYKInitLogs, rgbToCMYKTryExitLogs, rgbToCMYKCatchExitLogs, hslToCMYKInitLogs, hsvToCMYKInitLogs, labToCMYKInitLogs } from "../../export.js";
import { hexToCMYKTryCaseHelper, hslToCMYKTryCaseHelper, hsvToCMYKTryCaseHelper, labToCMYKTryCaseHelper } from "../../export.js";


// Convert Hex to CMYK
function hexToCMYK(hex) {
    hexToCMYKInitLogs(hex);

    try {
        hexToCMYKTryCaseHelper(hex);
        hexToCMYKTryExitLogs(cmyk);
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;
    } catch (error) {
        console.error(`hexToCMYK() - error converting Hex to CMYK: ${error}`);
        const cmyk = { cyan: 0, magenta: 0, yellow: 0, key: 0 }; // return black in case of error
        hexToCMYKCatchExitLogs(cmyk);
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`; 
    }
};


// Convert RGB to CMYK
function rgbToCMYK(red, green, blue) {
    rgbToCMYKInitLogs(red, green, blue);

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
        }
        
        if (isNaN(cmyk.cyan) || isNaN(cmyk.magenta) || isNaN(cmyk.yellow) || isNaN(cmyk.key)) {
            throw new Error(`rgbToCMYK() - invalid CMYK values generated: ${JSON.stringify(cmyk)}`);
        }

        rgbToCMYKTryExitLogs(cmyk);
        return cmyk;
    } catch (error) {
        rgbToCMYKCatchExitLogs(error);
        return { cyan: 0, magenta: 0, yellow: 0, key: 0 }; // set default CMYK in case of error
    }
};


// Convert HSL to CMYK
function hslToCMYK(hue, saturation, lightness) {
    hslToCMYKInitLogs(hue, saturation, lightness);

    try {
        hslToCMYKTryCaseHelper(hue, saturation, lightness);
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
    hsvToCMYKInitLogs(hue, saturation, value);

    try {
        hsvToCMYKTryCaseHelper(hue, saturation, value);
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
    labToCMYKInitLogs(l, a, b);

    try {
        labToCMYKTryCaseHelper(l, a, b);
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;
    } catch (error) {
        console.error(`labToCMYK() - error converting Lab to CMYK: ${error}`);
        const cmyk = { cyan: 0, magenta: 0, yellow: 0, key: 0 }; // set default CMYK in case of error
        console.log('labToCMYK() complete - returning cmyk { cyan: 0, magenta: 0, yellow: 0, key: 0 } as a formatted string');
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;  
    }
};


export { hexToCMYK, rgbToCMYK, hslToCMYK, hsvToCMYK, labToCMYK };