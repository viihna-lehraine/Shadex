// ColorGen - version 0.5.1
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

        const convert = conversionMap[box.getAttribute('data-format')][targetFormat];
        const newColor = convert(colorValues);

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
function generateAndStoreColorValues(color, initialColorSpace) {
    const colorValues = {};

    switch (initialColorSpace) {
        case 'hex':
            const hslFromHex = hexToHSL(color);
            colorValues.hsl = `hsl(${hslFromHex.hue}, ${hslFromHex.saturation}%, ${hslFromHex.lightness}%)`;
            colorValues.rgb = hexToRGB(color);
            colorValues.hsv = hexToHSV(color);
            colorValues.cmyk = hexToCMYK(color);
            colorValues.lab = hexToLab(color);
            colorValues.hex = color;
            break;
        case 'rgb':
            const hslFromRGB = rgbToHSL(color.red, color.green, color.blue);
            colorValues.hsl = `hsl(${hslFromRGB.hue}, ${hslFromRGB.saturation}%, ${hslFromRGB.lightness}%)`;
            colorValues.rgb = `rgb(${color.red}, ${color.green}, ${color.blue})`;
            colorValues.hex = rgbToHex(color.red, color.green, color.blue);
            colorValues.hsv = rgbToHSV(color.red, color.green, color.blue);
            colorValues.cmyk = rgbToCMYK(color.red, color.green, color.blue);
            colorValues.lab = rgbToLab(color.red, color.green, color.blue);
            break;
        case 'hsl':
            const rgbFromHSL = hslToRGB(color.hue, color.saturation, color.lightness);
            colorValues.hsl = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
            colorValues.rgb = `rgb(${rgbFromHSL.red}, ${rgbFromHSL.green}, ${rgbFromHSL.blue})`;
            colorValues.hex = hslToHex(color.hue, color.saturation, color.lightness);
            colorValues.hsv = hslToHSV(color.hue, color.saturation, color.lightness);
            colorValues.cmyk = hslToCMYK(color.hue, color.saturation, color.lightness);
            colorValues.lab = hslToLab(color.hue, color.saturation, color.lightness);
            break;
        case 'hsv':
            const hslFromHSV = hsvToHSL(color.hue, color.saturation, color.value);
            colorValues.hsl = `hsl(${hslFromHSV.hue}, ${hslFromHSV.saturation}%, ${hslFromHSV.lightness}%)`;
            colorValues.rgb = hsvToRGB(color.hue, color.saturation, color.value);
            colorValues.hex = hsvToHex(color.hue, color.saturation, color.value);
            colorValues.hsv = `hsv(${color.hue}, ${color.saturation}%, ${color.value}%)`;
            colorValues.cmyk = hsvToCMYK(color.hue, color.saturation, color.value);
            colorValues.lab = hsvToLab(color.hue, color.saturation, color.value);
            break;
        case 'cmyk':
            const hslFromCMYK = cmykToHSL(color.cyan, color.magenta, color.yellow, color.black);
            colorValues.hsl = `hsl(${hslFromCMYK.hue}, ${hslFromCMYK.saturation}%, ${hslFromCMYK.lightness}%)`;
            colorValues.rgb = cmykToRGB(color.cyan, color.magenta, color.yellow, color.black);
            colorValues.hex = cmykToHex(color.cyan, color.magenta, color.yellow, color.black);
            colorValues.hsv = cmykToHSV(color.cyan, color.magenta, color.yellow, color.black);
            colorValues.cmyk = `cmyk(${color.cyan}%, ${color.magenta}%, ${color.yellow}%, ${color.black}%)`;
            colorValues.lab = cmykToLab(color.cyan, color.magenta, color.yellow, color.black);
            break;
        case 'lab':
            const hslFromLab = labToHSL(color.l, color.a, color.b);
            colorValues.hsl = `hsl(${hslFromLab.hue}, ${hslFromLab.saturation}%, ${hslFromLab.lightness}%)`;
            colorValues.rgb = labToRGB(color.l, color.a, color.b);
            colorValues.hex = labToHex(color.l, color.a, color.b);
            colorValues.hsv = labToHSV(color.l, color.a, color.b);
            colorValues.cmyk = labToCMYK(color.l, color.a, color.b);
            colorValues.lab = `lab(${color.l}, ${color.a}, ${color.b})`;
            break;
        default:
            const defaultHSL = hslToRGB(color.hue, color.saturation, color.lightness);
            colorValues.hsl = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
            colorValues.rgb = `rgb(${defaultHSL.red}, ${defaultHSL.green}, ${defaultHSL.blue})`;
            colorValues.hex = hslToHex(color.hue, color.saturation, color.lightness);
            colorValues.hsv = hslToHSV(color.hue, color.saturation, color.lightness);
            colorValues.cmyk = hslToCMYK(color.hue, color.saturation, color.lightness);
            colorValues.lab = hslToLab(color.hue, color.saturation, color.lightness);
    }

    return colorValues;
}


function adjustSaturationAndLightness(color, limitGrayAndBlack, limitLight, initialColorSpace) {
    let hslColor;

    // convert the input color to HSL
    switch (initialColorSpace) {
        case 'hex':
            hslColor = hexToHSL(color);
            break;
        case 'rgb':
            hslColor = rgbToHSL(color.red, color.green, color.blue);
            break;
        case 'hsl':
            hslColor = color;
            break;
        case 'hsv':
            hslColor = hsvToHSL(color.hue, color.saturation, color.value);
            break;
        case 'cmyk':
            hslColor = cmykToHSL(color.cyan, color.magenta, color.yellow, color.black);
            break;
        case 'lab':
            hslColor = labToHSL(color.l, color.a, color.b);
            break;
        default:
            hslColor = color;
    }

    // Apply limitGrayAndBlack and limitLight, if applicable
    if (limitGrayAndBlack) {
        ({ saturation: hslColor.saturation, lightness: hslColor.lightness } = applyLimitGrayAndBlack(hslColor.saturation, hslColor.lightness));
    }

    if (limitLight) {
        hslColor.lightness = applyLimitLight(hslColor.lightness);
    }

    return hslColor;
}


export { convertColors, generateAndStoreColorValues, adjustSaturationAndLightness };