// ColorGen - version 0.5.22-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { hexToRGB } from '../../export.js';


// Convert Hex to HSV
function hexToHSV(hexValue) {
    console.log('hexToHSV() executing');
    console.log('hexToHSV() - hex: ', hex, ' data type ', (typeof hex));

    try {
        console.log(`hexToHSV() - converting Hex to HSV: ${hex}`);
        const rgb = hexToRGB(hex);
        console.log(`hexToHSV() - converted RGB from Hex: ${JSON.stringify(rgb)}`);
        console.log('hexToHSV() - rgb: ', rgb, ' data type: ', (typeof rgb));
        const hsv = rgbToHSV(rgb.red, rgb.green, rgb.blue);
        console.log(`hexToHSV() - converted HSV from RGB: ${JSON.stringify(hsv)}`);
        console.log('hexToHSV() - hsv: ', hsv, ' type: ', (typeof hsv));
        console.log('hexToHSV() complete - returning hsv as a formatted string');
        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    } catch (error) {
        console.error(`hexToHSV() - error converting Hex to HSV: ${error}`);
        const hsv = { hue: 0, saturation: 0, value: 0 }; // default black for invalid inputs
        console.log('hexToHSV() - hsv: ', hsv, ' type: ', (typeof hsv));
        console.log('hexToHSV() complete - returning hsv as a formatted string');

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    }
};


// Convert RGB to HSV
function rgbToHSV(red, green, blue) {
    console.log('rgbToHSV() executing');
    console.log('rgbToHSV() - red: ', red, ' green: ', green, ' blue: ', blue);
    console.log('rgbToHSV() > types - red: ', (typeof red), ' green: ', (typeof green), ' blue: ', (typeof blue));

    try {
        console.log(`rgbToHSV() - converting RGB to HSV: R=${red}, G=${green}, B=${blue}`);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`rgbToHSV() - invalid RGB values: R=${red}, G=${green}, B=${blue}`);
        }

        red /= 255;
        green /= 255;
        blue /= 255;

        let max = Math.max(red, green, blue);
        let min = Math.min(red, green, blue);
        let hue, saturation, value = max;

        let delta = max - min;
        saturation = max === 0 ? 0 : delta / max;

        if (max === min) {
            hue = 0;
        } else {
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
            hue /= 6;
        }

        console.log(`rgbToHSV() - converted HSV: H=${hue * 360}, S=${saturation * 100}, V=${value * 100}`);

        const hsv = {
            hue: Math.floor(hue * 360),
            saturation: Math.floor(saturation * 100),
            value: Math.floor(value * 100)
        }

        console.log('rgbToHSV() - hsv: ', hsv, ' type: ', (typeof hsv));
        console.log('rgbToHSV() complete - returning hsv as a formatted string');
        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    } catch (error) {
        console.error(`rgbToHSV() - error converting RGB to HSV: ${error}`);
        const hsv = { hue: 0, saturation: 0, value: 0 }; // default black for invalid inputs
        console.log('rgbToHSV() - hsv: ', hsv, ' type: ', (typeof hsv));
        console.log('rgbToHSV() - execution of rgbToHSV complete - returning hsv as a formatted string');
        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    }
};


// Convert HSL to HSV
function hslToHSV(hue, saturation, lightness) {
    console.log('hslToHSV() executing');
    console.log('hslToHSV() - hue: ', hue, ' saturation: ', saturation, ' lightness: ', lightness);
    console.log('hslToHSV() > types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' lightness: ', (typeof lightness));

    try {
        console.log(`hslToHSV() - converting HSL to HSV: H=${hue}, S=${saturation}, L=${lightness}`);

        if (isNaN(hue) || isNaN(saturation) || isNaN(lightness)) {
            throw new Error(`hslToHSV() - invalid HSL values: H=${hue}, S=${saturation}, L=${lightness}`);
        }

        saturation /= 100;
        lightness /= 100;

        const value = lightness + saturation * Math.min(lightness, 1 - lightness);
        const newSaturation = value === 0 ? 0 : 2 * (1 - lightness / value);

        console.log(`hslToHSV() - converted HSV: H=${hue}, S=${newSaturation * 100}, V=${value * 100}`);

        const hsv = {
            hue: Math.floor(hue),
            saturation: Math.floor(newSaturation * 100),
            value: Math.floor(value * 100)
        };

        console.log('hslToHSV() - hsv: ', hsv, ' type: ', (typeof hsv));
        console.log('hslToHSV() complete - returning hsv as a formatted string');
        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    } catch (error) {
        console.error(`hslToHSV() - error converting HSL to HSV: ${error}`);
        const hsv = { hue: 0, saturation: 0, value: 0 }; // default black for invalid inputs
        console.log('hslToHSV() - hsv: ', hsv, ' type: ', (typeof hsv));
        console.log('hslToHSV() complete - returning hsv as a formatted string');
        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    }
};


// Convert CMYK to HSV
function cmykToHSV(cyan, magenta, yellow, key) {
    console.log('cmykToHSV() executing');
    console.log('cmykToHSV() - cyan: ', cyan, ' magenta: ', magenta, ' yellow: ', yellow, ' key: ', key);
    console.log('cmykToHSV() > types - cyan: ', (typeof cyan), ' magenta: ', (typeof magenta), ' yellow: ', (typeof yellow), ' key: ', (typeof key));

    try {
        console.log(`cmykToHSV() - converting CMYK to HSV: C=${cyan}, M=${magenta}, Y=${yellow}, K=${key}`);
        const rgb = cmykToRGB(cyan, magenta, yellow, key);
        console.log(`cmykToHSV() - converted RGB from CMYK: ${JSON.stringify(rgb)}`);
        console.log('cmykToHSV() - rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('cmykToHSV() complete');
        return rgbToHSV(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        console.error(`cmykToHSV() - error converting CMYK to HSV: ${error}`);
        const hsv = { hue: 0, saturation: 0, value: 0 }; // default black for invalid inputs
        console.log('cmykToHSV() - hsv: ', hsv, ' type: ', (typeof hsv));
        console.log('cmykToHSV() complete - returning hsv as a formatted string');
        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    }
};


// Convert Lab to HSV
function labToHSV(l, a, b) {
    console.log('labToHSV() executing');

    try {
        console.log(`labToHSV() - converting Lab to HSV: L=${l}, A=${a}, B=${b}`);
        const rgb = labToRGB(l, a, b);
        console.log(`labToHSV() - converted RGB from Lab: ${JSON.stringify(rgb)}`);
        console.log('labToHSV() - rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('labtoHSV() complete - returning output of rgbToHSV() called with parameters (rgb.red, rgb.green, rgb.blue');
        return rgbToHSV(rgb.red, rgb.green, rgb.blue);
    } catch (error) {
        console.error(`labToHSV() - error converting Lab to HSV: ${error}`);
        const hsv = { hue: 0, saturation: 0, value: 0 }; // default black for invalid inputs
        console.log('labToHSV() - hsv: ', hsv, ' type: ', (typeof hsv));
        console.log('labToHSV() complete - returning hsv as a formatted string');
        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    }
};


export { hexToHSV, rgbToHSV, hslToHSV, cmykToHSV, labToHSV };