// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { applyLimitGrayAndBlack, applyLimitLight } from '../index.js';
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
    console.log('executing convertColors');
    console.log('targetFormat: ', targetFormat, ' data type: ', (typeof targetFormat));

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

        if (!newColor) {
            console.error(`'Conversion to ${targetFormat} is not supported.`);
            return;
        }

        box.value = newColor; // Changed from .textContent. Apparently this works better for input elements. Need to read more about that later
        box.setAttribute('data-format', targetFormat);

        console.log('execution of convertColos complete');
    });
}


// Generate values for all 6 color spaces for all swatches when a palette is generated, stores as an object (I think?)
function generateAndStoreColorValues(color, initialColorSpace = 'hex') {
    console.log('executing generateAndStoreColorValues');
    console.log('color: ', color, ' data type: ', (typeof color));
    console.log('initialColorSpace: ', initialColorSpace, ' data type: ', (typeof initialColorSpace));
    
    let colorValues = {};
    let hslColor;
    color.format = initialColorSpace;
    

    if (color.format === 'hex') {
        console.log('calling hexToHSL');
        hslColor = hexToHSL(color.value);
    } else if (color.format === 'rgb') {
        console.log('calling rgbToHSL');
        hslColor = rgbToHSL(color.value);
    } else if (color.format === 'hsl') {
        hslColor = parseHSL(color.value);
    } else if (color.format === 'hsv') {
        console.log('calling hslToHSV');
        hslColor = hslToHSV(color.value);
    } else if (color.format === 'cmyk') {
        console.log('calling cmykToHSL');
        hslColor = cmykToHSL(color.value);
    } else if (color.format === 'lab') {
        console.log('calling labToHSL')
        hslColor = labToHSL(color.value);
    } else {
        console.error('ERROR: unsupported color format: ', color.format);
        return;
    }

    console.log('generated HSL color: ', hslColor);

    // Ensure HSL is in the correct format
    const { hue, saturation, lightness } = hslColor;
    if (typeof hue === 'object') {
        hslColor = {  // extract the nested values from the HSL object
            hue: hue.hue,
            saturation: hue.saturation,
            lightness: hue.lightness
        };
    }

    // Ensure saturation and lightness are numbers, not strings
    hslColor.saturation = Number(hslColor.saturation);
    hslColor.lightness = Number(hslColor.lightness);

    if (typeof hslColor.hue !== 'number' || typeof hslColor.saturation !== 'number' || typeof hslColor.lightness !== 'number') {
        console.error('Invalid HSL values:', hslColor);
        return;
    };

    const formattedHslColor = {
        hue: hslColor.hue,
        saturation: `${hslColor.saturation}%`,
        lightness: `${hslColor.lightness}%`
    };

    switch (initialColorSpace) { // ensure all color spaces are formatted properly when the colorValues object is declared
        case 'hex':
            colorValues = {
                hex: color.value,
                rgb: hexToRGB(color.value),
                hsl: formattedHslColor,
                hsv: hexToHSV(color.value),
                cmyk: hexToCMYK(color.value),
                lab: hexToLab(color.value)
            };
            break;
        case 'rgb':
            colorValues = {
                hex: rgbToHex(color.value),
                rgb: color.value,
                hsl: formattedHslColor,
                hsv: rgbToHSV(color.value),
                cmyk: rgbToCMYK(color.value),
                lab: rgbToLab(color.value)
            };
            break;
        case 'hsl':
            colorValues = {
                hex: hslToHex(hslColor.hue, hslColor.saturation, hslColor.lightness),
                rgb: hslToRGB(hslColor.hue, hslColor.saturation, hslColor.lightness),
                hsl: formattedHslColor,
                hsv: hslToHSV(hslColor.hue, hslColor.saturation, hslColor.lightness),
                cmyk: hslToCMYK(hslColor.hue, hslColor.saturation, hslColor.lightness),
                lab: hslToLab(hslColor.hue, hslColor.saturation, hslColor.lightness)
            };
            break;
        default:
            console.log('executing initialColorSpace switch expression for DEFAULT CASE');
            colorValues = {
                hex: hslToHex(hslColor.hue, hslColor.saturation, hslColor.lightness),
                rgb: hslToRGB(hslColor.hue, hslColor.saturation, hslColor.lightness),
                hsl: formattedHslColor,
                hsv: hslToHSV(hslColor.hue, hslColor.saturation, hslColor.lightness),
                cmyk: hslToCMYK(hslColor.hue, hslColor.saturation, hslColor.lightness),
                lab: hslToLab(hslColor.hue, hslColor.saturation, hslColor.lightness)
            };
            break;
    }

    console.log('initialColorSpace switch expression completed for generateAndStoreColorValues');
    console.log('generated color values: ', colorValues);
    console.log('colorValues: ', colorValues, ' data type: ', (typeof colorValues));

    console.log('execution of generateAndStoreColorValues complete');

    return colorValues;
}


function adjustSaturationAndLightness(color, limitGrayAndBlack, limitLight, initialColorSpace = 'hex') {
    console.log('executing adjustSaturationAndLightness');
    console.log(`color: ${color}, limitGrayAndBlack: ${limitGrayAndBlack}, limitLight: ${limitLight}, initialColorSpace: ${initialColorSpace}`);
    console.log('types - color: ', (typeof color), ' limitGrayAndBlack: ', (typeof limitGrayAndBlack), ' limitLight ', (typeof limitLight), ' initialColorSpace: ', (typeof initialColorSpace));

    let hslColor;

    // convert the input color to HSL
    switch (initialColorSpace) {
        case 'hex':
            console.log('calling hexToHSL');
            hslColor = hexToHSL(color);
            console.log('hslColor: ', hslColor, ' data type: ', (typeof hslColor));
            break;
        case 'rgb':
            console.log('calling rgbToHSL');
            hslColor = rgbToHSL(color.red, color.green, color.blue);
            console.log('hslColor: ', hslColor, ' data type: ', (typeof hslColor));
            break;
        case 'hsl':
            hslColor = color;
            console.log('hslColor: ', hslColor, ' data type: ', (typeof hslColor));
            break;
        case 'hsv':
            console.log('calling hsvToHSL');
            hslColor = hsvToHSL(color.hue, color.saturation, color.value);
            console.log('hslColor: ', hslColor, ' data type: ', (typeof hslColor));
            break;
        case 'cmyk':
            console.log('calling cmykToHSL');
            hslColor = cmykToHSL(color.cyan, color.magenta, color.yellow, color.black);
            console.log('hslColor: ', hslColor, ' data type: ', (typeof hslColor));
            break;
        case 'lab':
            console.log('calling labToHSL');
            hslColor = labToHSL(color.l, color.a, color.b);
            console.log('hslColor: ', hslColor, ' data type: ', (typeof hslColor));
            break;
        default:
            hslColor = color;
            console.log('hslColor: ', hslColor, ' data type: ', (typeof hslColor));
    }
    console.log('initialColorSpace switch expression completed for adjustSaturationAndLightness');

    // Apply limitGrayAndBlack and limitLight, if applicable
    if (limitGrayAndBlack) {
        console.log('calling applyLimitGrayAndBlack');
        ({ saturation: hslColor.saturation, lightness: hslColor.lightness } = applyLimitGrayAndBlack(hslColor.saturation, hslColor.lightness));
    }

    if (limitLight) {
        console.log('calling applyLimitLight');
        hslColor.lightness = applyLimitLight(hslColor.lightness);
    }

    console.log('execution of adjustSaturationAndLightness complete');
    return hslColor;
}


export { convertColors, generateAndStoreColorValues, adjustSaturationAndLightness };