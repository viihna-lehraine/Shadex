// ColorGen - version 0.5
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { rgbToHex, hslToHex, hsvToHex, cmykToHex, labToHex } from './index.js';
import { hexToRGB, hslToRGB, hsvToRGB, cmykToRGB, labToRGB } from './index.js';
import { hexToHSL, rgbToHSL, hsvToHSL, cmykToHSL, labToHSL } from './index.js';
import { hexToHSV, rgbToHSV, hslToHSV, cmykToHSV, labToHSV } from './index.js';
import { hexToCMYK, rgbToCMYK, hslToCMYK, hsvToCMYK, labToCMYK } from './index.js';
import { hexToLab, rgbToLab, hslToLab, hsvToLab, cmykToLab } from './index.js';


const conversionMap = {
    hsl: {
        rgb: hslToRGB,
        hex: hslToHex,
        hsv: hslToHSV,
        cmyk: hslToCMYK,
        lab: hslToLab
    },
    rgb: {
        hsl: rgbToHSL,
        hex: rgbToHex,
        hsv: rgbToHSV,
        cmyk: rgbToCMYK,
        lab: rgbToLab
    },
    hex: {
        rgb: hexToRGB,
        hsl: hexToHSL,
        hsv: hexToHSV,
        cmyk: hexToCMYK,
        lab: hexToLab
    },
    hsv: {
        rgb: hsvToRGB,
        hsl: hsvToHSL,
        hex: hsvToHex,
        cmyk: hsvToCMYK,
        lab: hsvToLab
    },
    cmyk: {
        rgb: cmykToRGB,
        hex: cmykToHex,
        hsl: cmykToHSL,
        hsv: cmykToHSV,
        lab: cmykToLab
    },
    lab: {
        rgb: labToRGB,
        hex: labToHex,
        hsl: labToHSL,
        hsv: labToHSV,
        cmyk: labToCMYK
    }
};


// When a conversion button is clicked, this will pull the color space type for that color and repopulate color-text-output-box with it
// Previous conversion function actually tried to convert them again. But conversion takes place with palette generation and are stored as an oject
function convertColors(targetFormat) {
    const colorTextOutputBoxes = document.querySelectorAll('.color-text-output-box');

    colorTextOutputBoxes.forEach(box => {
        const colorValues = box.colorValues;

        // error handling if no color values are found
        if (!colorValues) {
            console.error(`No color values found for ${box.textContent}`);
            return;
        }

        const newColor = colorValues[targetFormat];
        // error handling is conversion is improperly format is malformed or nonexistent
        if (!newColor) {
            console.error(`'Conversion to ${targetFormat} is not supported.`);
            return;
        }

        box.value = newColor; // Changed from .textContent. Apparently this works better for input elements. Need to read more about that later
        box.setAttribute('data-format', targetFormat);
    });
}


// Generate values for all 6 color spaces for all swatches when a palette is generated, stores as an object (I think?)
function generateAndStoreColorValues(hue, saturation, lightness) {
    const colorValues = {};
    const rgb = hslToRGB(hue, saturation, lightness);

    // Generate and store all possible color values
    colorValues.hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    colorValues.rgb = `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
    colorValues.hex = rgbToHex(rgb.red, rgb.green, rgb.blue);
    colorValues.hsv = hexToHSV(colorValues.hex);
    colorValues.cmyk = hexToCMYK(colorValues.hex);
    colorValues.lab = hexToLab(colorValues.hex);

    console.log("generateAndStoreColorValues() complete");
    console.log(colorValues);
    return colorValues;
}


export { convertColors, generateAndStoreColorValues };