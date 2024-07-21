// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { hexToRGB } from "./index.js";


// Convert Hex to HSV
function hexToHSV(hex) {
    console.log('executing hexToHSV');
    console.log('hex: ', hex, ' data type ', (typeof hex));

    try {
        console.log(`Converting Hex to HSV: ${hex}`);
        const rgb = hexToRGB(hex);
        console.log(`Converted RGB from Hex: ${JSON.stringify(rgb)}`);
        console.log('rgb: ', rgb, ' data type: ', (typeof rgb));
        const hsv = rgbToHSV(rgb.red, rgb.green, rgb.blue);
        console.log(`Converted HSV from RGB: ${JSON.stringify(hsv)}`);
        console.log('hsv: ', hsv, ' type: ', (typeof hsv));
        console.log('execution of hexToHSV complete');

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;

    } catch (error) {
        console.error(`Error converting Hex to HSV: ${error}`);
        // Default black for invalid inputs
        const hsv = { hue: 0, saturation: 0, value: 0 };
        
        console.log('hsv: ', hsv, ' type: ', (typeof hsv));
        console.log('execution of hexToHSV complete');

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    }
}


// Convert HSL to HSV
function hslToHSV(hue, saturation, lightness) {
    console.log('executing hslToHSV');
    console.log('hue: ', hue, ' saturation: ', saturation, ' lightness: ', lightness);
    console.log('types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' lightness: ', (typeof lightness));

    try {
        console.log(`Converting HSL to HSV: H=${hue}, S=${saturation}, L=${lightness}`);

        if (isNaN(hue) || isNaN(saturation) || isNaN(lightness)) {
            throw new Error(`Invalid HSL values: H=${hue}, S=${saturation}, L=${lightness}`);
        }

        saturation /= 100;
        lightness /= 100;

        const value = lightness + saturation * Math.min(lightness, 1 - lightness);
        const newSaturation = value === 0 ? 0 : 2 * (1 - lightness / value);

        console.log(`Converted HSV: H=${hue}, S=${newSaturation * 100}, V=${value * 100}`);

        const hsv = {
            hue: Math.floor(hue),
            saturation: Math.floor(newSaturation * 100),
            value: Math.floor(value * 100)
        };

        console.log('hsv: ', hsv, ' type: ', (typeof hsv));
        console.log('execution of hslToHSV complete');

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;

    } catch (error) {
        console.error(`Error converting HSL to HSV: ${error}`);
        // Default black for invalid inputs
        const hsv = { hue: 0, saturation: 0, value: 0 };

        console.log('hsv: ', hsv, ' type: ', (typeof hsv));
        console.log('execution of hslToHSV complete');

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    }
}


// Convert RGB to HSV
function rgbToHSV(red, green, blue) {
    console.log('executing rgbToHSV');
    console.log('red: ', red, ' green: ', green, ' blue: ', blue);
    console.log('types - red: ', (typeof red), ' green: ', (typeof green), ' blue: ', (typeof blue));

    try {
        console.log(`Converting RGB to HSV: R=${red}, G=${green}, B=${blue}`);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`Invalid RGB values: R=${red}, G=${green}, B=${blue}`);
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
            hue = 0; // achromatic
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

        console.log(`Converted HSV: H=${hue * 360}, S=${saturation * 100}, V=${value * 100}`);

        const hsv = {
            hue: Math.floor(hue * 360),
            saturation: Math.floor(saturation * 100),
            value: Math.floor(value * 100)
        };

        console.log('hsv: ', hsv, ' type: ', (typeof hsv));
        console.log('execution of rgbToHSV complete');

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
        
    } catch (error) {
        console.error(`Error converting RGB to HSV: ${error}`);
        // Default black for invalid inputs
        const hsv = { hue: 0, saturation: 0, value: 0 };

        console.log('hsv: ', hsv, ' type: ', (typeof hsv));
        console.log('execution of rgbToHSV complete');

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    }
}


// Convert CMYK to HSV
function cmykToHSV(cyan, magenta, yellow, key) {
    console.log('executing cmykToHSV');
    console.log('cyan: ', cyan, ' magenta: ', magenta, ' yellow: ', yellow, ' key: ', key);
    console.log('types - cyan: ', (typeof cyan), ' magenta: ', (typeof magenta), ' yellow: ', (typeof yellow), ' key: ', (typeof key));

    try {
        console.log(`Converting CMYK to HSV: C=${cyan}, M=${magenta}, Y=${yellow}, K=${key}`);
        const rgb = cmykToRGB(cyan, magenta, yellow, key);
        console.log(`Converted RGB from CMYK: ${JSON.stringify(rgb)}`);
        console.log('rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('execution of cmykToHSV complete');

        return rgbToHSV(rgb.red, rgb.green, rgb.blue);

    } catch (error) {
        console.error(`Error converting CMYK to HSV: ${error}`);
        // Default black for invalid inputs
        const hsv = { hue: 0, saturation: 0, value: 0 };

        console.log('hsv: ', hsv, ' type: ', (typeof hsv));
        console.log('execution of cmykToHSV complete');

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    }
}


// Convert Lab to HSV
function labToHSV(l, a, b) {
    console.log('executing labToHSV');

    try {
        console.log(`Converting Lab to HSV: L=${l}, A=${a}, B=${b}`);
        const rgb = labToRGB(l, a, b);
        console.log(`Converted RGB from Lab: ${JSON.stringify(rgb)}`);
        console.log('rgb: ', rgb, ' type: ', (typeof rgb));
        console.log('execution of labToHSV complete');

        return rgbToHSV(rgb.red, rgb.green, rgb.blue);

    } catch (error) {
        console.error(`Error converting Lab to HSV: ${error}`);
        // Default black for invalid inputs
        const hsv = { hue: 0, saturation: 0, value: 0 };

        console.log('hsv: ', hsv, ' type: ', (typeof hsv));
        console.log('execution of labToHSV complete');

        return `hsv(${hsv.hue}, ${hsv.saturation}%, ${hsv.value}%)`;
    }
}


export { hexToHSV, rgbToHSV, hslToHSV, cmykToHSV, labToHSV }