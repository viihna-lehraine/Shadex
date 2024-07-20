// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { hexToRGB } from "./convertToRGB.js";


// Convert Hex to HSL
function hexToHSL(hex) {
    try {
        console.log(`Converting Hex to HSL: ${hex}`);
        const rgb = hexToRGB(hex);
        console.log(`Converted RGB from Hex: ${JSON.stringify(rgb)}`);
        const hsl = rgbToHSL(rgb.red, rgb.green, rgb.blue);
        console.log(`Converted HSL from RGB: ${JSON.stringify(hsl)}`);

        return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`;

    } catch (error) {
        console.error(`Error converting Hex to HSL: ${error}`);

        // Return black for invalid inputs
        hue, saturation, lightness = 0;
        hsl = { hue, saturation, lightness };
        return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`;
    }
}


// convert RGB to HSL
function rgbToHSL(red, green, blue) {
    try {
        console.log(`Converting RGB to HSL: R=${red}, G=${green}, B=${blue}`);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            throw new Error(`Invalid RGB values: R=${red}, G=${green}, B=${blue}`);
        }

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

        console.log(`Converted HSL: H=${hue}, S=${saturation * 100}, L=${lightness * 100}`);

        
        hue = Math.round(hue);
        saturation = Math.round(saturation * 100);
        lightness = Math.round(lightness * 100);
        hsl = { hue, saturation, lightness };

        return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`;

    } catch (error) {
        console.error(`Error converting RGB to HSL: ${error}`);

        // Return black for invalid inputs
        hue, saturation, lightness = 0;
        hsl = { hue, saturation, lightness };
        return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`;
    }
}


// Convert HSV to HSL
function hsvToHSL(hue, saturation, value) {
    try {
        console.log(`Converting HSV to HSL: H=${hue}, S=${saturation}, V=${value}`);

        if (isNaN(hue) || isNaN(saturation) || isNaN(value)) {
            throw new Error(`Invalid HSV values: H=${hue}, S=${saturation}, V=${value}`);
        }

        saturation /= 100;
        value /= 100;

        let lightness = value * (1 - saturation / 2);
        let newSaturation = (lightness === 0 || lightness === 1) ? 0 : (value - lightness) / Math.min(lightness, 1 - lightness);

        console.log(`Converted HSL: H=${hue}, S=${newSaturation * 100}, L=${lightness * 100}`);

        hue = Math.round(hue);
        saturation = Math.round(saturation * 100);
        lightness = Math.round(lightness * 100);
        hsl = { hue, saturation, lightness };

        return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`

    } catch (error) {
        console.error(`Error converting HSV to HSL: ${error}`);

        // Return black for invalid inputs
        hue, saturation, lightness = 0;
        hsl = { hue, saturation, lightness };
        return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`;
    }
}


// Convert CMYK to HSL
function cmykToHSL(cyan, magenta, yellow, key) {
    try {
        console.log(`Converting CMYK to HSL: C=${cyan}, M=${magenta}, Y=${yellow}, K=${key}`);
        const rgb = cmykToRGB(cyan, magenta, yellow, key);
        console.log(`Converted RGB from CMYK: ${JSON.stringify(rgb)}`);

        return rgbToHSL(rgb.red, rgb.green, rgb.blue);

    } catch (error) {
        console.error(`Error converting CMYK to HSL: ${error}`);

        // Return black for invalid inputs
        hue, saturation, lightness = 0;
        hsl = { hue, saturation, lightness };
        return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`;
    }
}


//Convert Lab to HSL
function labToHSL(l, a, b) {
    try {
        console.log(`Converting Lab to HSL: L=${l}, A=${a}, B=${b}`);
        const rgb = labToRGB(l, a, b);
        console.log(`Converted RGB from Lab: ${JSON.stringify(rgb)}`);
        
        return rgbToHSL(rgb.red, rgb.green, rgb.blue);

    } catch (error) {
        console.error(`Error converting Lab to HSL: ${error}`);
        
        // Return black for invalid inputs
        hue, saturation, lightness = 0;
        hsl = { hue, saturation, lightness };
        return `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`; 
    }
}


export { hexToHSL, rgbToHSL, hsvToHSL, cmykToHSL, labToHSL };