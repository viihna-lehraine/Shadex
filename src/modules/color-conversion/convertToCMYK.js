// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { hexToRGB } from "./index.js";


// Convert Hex to CMYK
function hexToCMYK(hex) {
    const rgb = hexToRGB(hex);
    const cmyk = rgbToCMYK(rgb.red, rgb.green, rgb.blue);

    return `cmyk(${cmyk.cyan}%, ${cmyk.magenta}%, ${cmyk.yellow}%, ${cmyk.key}%)`;
}


// Convert RGB to CMYK
function rgbToCMYK(red, green, blue) {
    const redPrime = red / 255;
    const greenPrime = green / 255;
    const bluePrime = blue / 255;

    const key = 1 - Math.max(redPrime, greenPrime, bluePrime);
    const cyan = (1 - redPrime - key) / (1 - key) || 0;
    const magenta = (1 - greenPrime - key) / (1 - key) || 0;
    const yellow = (1 - bluePrime - key) / (1 - key) || 0;

    return {
        cyan: Math.round(cyan * 100),
        magenta: Math.round(magenta * 100),
        yellow: Math.round(yellow * 100),
        key: Math.round(key * 100)
    };
}


// Convert HSL to CMYK
function hslToCMYK(hue, saturation, lightness) {
    const rgb = hslToRGB(hue, saturation, lightness);
    return rgbToCMYK(rgb.red, rgb.green, rgb.blue);
}


// Convert HSV to CMYK
function hsvToCMYK(hue, saturation, value) {
    const rgb = hsvToRGB(hue, saturation, value);
    return rgbToCMYK(rgb.red, rgb.green, rgb.blue);
}


// Convert Lab to CMYK
function labToCMYK(l, a, b) {
    const rgb = labToRGB(l, a, b);
    return rgbToCMYK(rgb.red, rgb.green, rgb.blue);
}

export { hexToCMYK, rgbToCMYK, hslToCMYK, hsvToCMYK, labToCMYK }