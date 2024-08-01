// ColorGen - version 0.5.2-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { hexToRGB, hslToRGB, hsvToRGB } from "./index.js";


// Convert Hex to CMYK
function hexToCMYK(hex) {
    console.log('executing hexToCMYK');
    console.log('hex: ', hex, ' data type ', (typeof hex));

    try {
        console.log(`Converting Hex to CMYK: ${hex}`);
        console.log('calling hexToRGB')
        const rgb = hexToRGB(hex);
        console.log(`Converted RGB from Hex: ${JSON.stringify(rgb)}`);
        console.log('rgb: ', rgb, ' data type: ', (typeof rgb));
        console.log('calling rgbToCMYK');
        const cmyk = rgbToCMYK(rgb.red, rgb.green, rgb.blue);
        console.log(`Converted CMYK from RGB: ${JSON.stringify(cmyk)}`);
        console.log('cmyk: ', cmyk, ' data type: ', (typeof cmyk));
        console.log('execution of hexToCMYK complete');
        
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;

    } catch (error) {
        console.error(`Error converting Hex to CMYK: ${error}`);

        // Set default CMYK in case of error
        const cmyk = { cyan: 0, magenta: 0, yellow: 0, key: 0 };
        console.log('cmyk: ', cmyk, ' data type: ', (typeof cmyk));
        console.log('execution of hexToCMYK complete');
        
        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`; 
    }}


// Convert RGB to CMYK
function rgbToCMYK(red, green, blue) {
    console.log('executing rgbToCMYK');
    console.log('red: ', red, ' green: ', green, ' blue: ', blue);
    console.log('types - red: ', (typeof red), ' green: ', (typeof green), ' blue: ', (typeof blue));

    try {
        console.log(`Converting RGB to CMYK: R=${red}, G=${green}, B=${blue}`);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`Invalid RGB values: R=${red}, G=${green}, B=${blue}`);
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
            throw new Error(`Invalid CMYK values generated: ${JSON.stringify(cmyk)}`);
        }

        console.log(`Converted CMYK from RGB: ${JSON.stringify(cmyk)}`);
        console.log('cmyk: ', cmyk, ' data type: ', (typeof cmyk));
        console.log('execution of rgbToCMYK complete');


        return cmyk;
        
    } catch (error) {
        console.error(`Error converting RGB to CMYK: ${error}`);
        console.log('execution of rgbToCMYK complete');

        // Set default CMYK in case of error
        return { cyan: 0, magenta: 0, yellow: 0, key: 0 };
    }
}


// Convert HSL to CMYK
function hslToCMYK(hue, saturation, lightness) {
    console.log('excecuting hslToCMYK');
    console.log('hue: ', hue, ' saturation: ', saturation, ' lightness: ', lightness);
    console.log('types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' lightness: ', (typeof lightness));

    try {
        console.log(`Converting HSL to CMYK: H=${hue}, S=${saturation}, L=${lightness}`);
        const rgb = hslToRGB(hue, saturation, lightness);
        console.log('rgb: ', rgb, ' type: ', (typeof rgb));
        console.log(`Converted RGB from HSL: ${JSON.stringify(rgb)}`);

        const cmyk = rgbToCMYK(rgb.red, rgb.green, rgb.blue);
        console.log('cmyk: ', cmyk, ' type: ', (typeof cmyk));
        console.log('execution of hslToCMYK complete');

        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;

    } catch (error) {
        console.error(`Error converting HSL to CMYK: ${error}`);

        // Set default CMYK in case of error
        const cmyk = { cyan: 0, magenta: 0, yellow: 0, key: 0 };

        console.log('execution of hslToCMYK complete');

        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`; 
    }
}

// Convert HSV to CMYK
function hsvToCMYK(hue, saturation, value) {
    console.log('executing hslToCMYK');
    console.log('hue: ', hue, ' saturation: ', saturation, ' value: ', value);
    console.log('types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' value: ', (typeof value));

    try {
        console.log(`Converting HSV to CMYK: H=${hue}, S=${saturation}, V=${value}`);
        console.log('calling hsvToRGB');
        const rgb = hsvToRGB(hue, saturation, value);
        console.log(`Converted RGB from HSV: ${JSON.stringify(rgb)}`);
        console.log('rgb: ', rgb, ' type: ', (typeof rgb));

        const cmyk = rgbToCMYK(rgb.red, rgb.green, rgb.blue);
        console.log('cmyk: ', cmyk, ' type: ', (typeof cmyk));
        console.log('execution of hsvToCMYK complete');

        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;

    } catch (error) {
        console.error(`Error converting HSV to CMYK: ${error}`);
        
        // Set default CMYK in case of error
        const cmyk = { cyan: 0, magenta: 0, yellow: 0, key: 0 };
        console.log('execution of hsvToCMYK complete');

        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`; 
    }
}


// Convert Lab to CMYK
function labToCMYK(l, a, b) {
    console.log('executing labToCMYK');
    console.log('l: ', l, ' a: ', a, ' b: ', b);
    console.log('types - l: ', (typeof l), ' a: ', (typeof a), ' b: ', (typeof b));

    try {
        console.log(`Converting Lab to CMYK: L=${l}, A=${a}, B=${b}`);
        console.log('calling labToRGB');
        const rgb = labToRGB(l, a, b);
        console.log(`Converted RGB from Lab: ${JSON.stringify(rgb)}`);
        console.log('rgb: ', rgb, ' type: ', (typeof rgb));

        const cmyk = rgbToCMYK(rgb.red, rgb.green, rgb.blue);
        console.log('cmyk: ', cmyk, ' type: ', (typeof cmyk));
        console.log('execution of labToCMYK complete');

        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;

    } catch (error) {
        console.error(`Error converting Lab to CMYK: ${error}`);

        // Set default CMYK in case of error
        const cmyk = { cyan: 0, magenta: 0, yellow: 0, key: 0 };
        
        console.log('execution of labToCMYK complete');

        return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;  
    }
}


export { hexToCMYK, rgbToCMYK, hslToCMYK, hsvToCMYK, labToCMYK }