// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { hexToRGB } from "./convertToRGB.js";


// Convert Hex to HSL
function hexToHSL(hex) {
    const rgb = hexToRGB(hex);
    const hsl = rgbToHSL(rgb.red, rgb.green, rgb.blue);

    return {
        hue: hsl.hue,
        saturation: hsl.saturation,
        lightness: hsl.lightness
    }
}


// convert RGB to HSL
function rgbToHSL(red, green, blue) {
    red = red / 255;
    green = green / 255;
    blue = blue / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    let hue, saturation, lightness = (max + min) / 2;

    if (max === min) {
        hue = 0;
        saturation = 0;
    } else {
        const delta = max - min;
        saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
        switch (max) {
            case red:
                hue = (green - blue) / delta + (green < blue ? 6 : 0);
                break;
            case green:
                hue = (blue - red) / delta + 2;
                break;
            case blue:
                hue = (red - green) / delta + 4;
                break;
        }
        hue *= 60;
    }
    return {
        hue: Math.round(hue),
        saturation: Math.round(saturation * 100),
        lightness: Math.round(lightness * 100)
    };
}


// Convert HSV to HSL
function hsvToHSL(hue, saturation, value) {
    saturation /= 100;
    value /= 100;

    let lightness = value * (1 - saturation / 2);
    let newSaturation = (lightness === 0 || lightness === 1) ? 0 : (value - lightness) / Math.min(lightness, 1 - lightness);

    return {
        hue: hue,
        saturation: Math.floor(newSaturation * 100),
        lightness: Math.floor(lightness * 100)
    };
}


// Convert CMYK to HSL
function cmykToHSL(cyan, magenta, yellow, key) {
    const rgb = cmykToRGB(cyan, magenta, yellow, key);
    return rgbToHSL(rgb.red, rgb.green, rgb.blue);
}


//Convert Lab to HSL
function labToHSL(l, a, b) {
    const rgb = labToRGB(l, a, b);
    return rgbToHSL(rgb.red, rgb.green, rgb.blue);
}

export { hexToHSL, rgbToHSL, hsvToHSL, cmykToHSL, labToHSL };