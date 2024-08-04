// ColorGen - version 0.5.22-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { hexToRGB, hexToHSL, hexToHSV, hexToCMYK, hexToLab, rgbToHex, rgbToHSL, rgbToHSV, rgbToCMYK, rgbToLab, hslToHex, hslToRGB, hslToHSV, hslToCMYK, hslToLab, hsvToHex, hsvToRGB, hsvToHSL, hsvToCMYK, hsvToLab, cmykToHex, cmykToRGB, cmykToHSL, cmykToHSV, cmykToLab, labToHex, labToRGB, labToHSL, labToHSV, labToCMYK } from '../export.js';


// Declares conversionMap object
function declareConversionMap() {
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
    }
    
    console.log('conversionMap: ', conversionMap, ' type: ', (typeof conversionMap));

    return conversionMap;
};


// Generate initial HSL color based on color.format
function initialHslColorGeneration(color, hexValue) {
    console.log('initialHslColorGeneration() executing');
    console.log('initialHslColorGeneration() - color: ', color, ' typeof color: ', (typeof color), ' hexValue: ', hexValue, ' typeof hexValue: ', (typeof hexValue));

    if (!color) {
        console.error('initialHslColorGeneration() - error: color not found');
    }
    
    if (!hexValue) {
        console.error('initialHslColorGeneration() - error: hexValue not found');
    }

    if (color.format === 'hex') {
        console.log('initialHslColorGeneration() - calling hexToHSL()');
        hslColor = hexToHSL(hexValue);
    } else if (color.format === 'rgb') {
        console.log('initialHslColorGeneration() - calling rgbToHSL()');
        hslColor = rgbToHSL(color.value);
    } else if (color.format === 'hsl') {
        console.log('initialHslColorGeneration() - calling parseHSL()');
        hslColor = parseHSL(color.value);
    } else if (color.format === 'hsv') {
        console.log('initialHslColorGeneration() - calling hslToHSV()');
        hslColor = hslToHSV(color.value);
    } else if (color.format === 'cmyk') {
        console.log('initialHslColorGeneration() - calling cmykToHSL()');
        hslColor = cmykToHSL(color.value);
    } else if (color.format === 'lab') {
        console.log('initialHslColorGeneration() - calling labToHSL()')
        hslColor = labToHSL(color.value);
    } else {
        console.error('initialHslColorGeneration() - error: unsupported color format: ', color.format, ' ; returning');
        return;
    }

    if (typeof hslColor !== 'object') {
        console.error('initialHslColorGeneration() - error: hslColor is not an object');
    }

    console.log('initialHslColorGeneration() - generated HSL color: ', hslColor, ' type: ', (typeof hslColor));
    console.log('initialHslColorGeneration() complete; returning hslColor');
    return hslColor;
};


// Ensure HSL is in the correct format
function formatHslForInitialColorValueGen(hue, saturation, lightness) {
    let hslColor = { hue, saturation, lightness }; // Fixed the declaration
    console.log('hue: ', hue, ' type: ', (typeof hue));
    console.log('deconstructing hue if it is an object and splitting into hue.hue, hue.saturation, and hue.lightness');

    if (typeof hue === 'object') {
        console.log('hue is an object; extracting nested values and returning as an object'); 

        hslColor = {
            hue: hue.hue,
            saturation: hue.saturation,
            lightness: hue.lightness
        }
    }

    console.log('hue data type: ', (typeof hue), ' hue.hue: ', (typeof hue.hue), ' hue.saturation: ', (typeof hue.saturation), ' hue.lightness: ', (typeof hue.lightness));
    console.log('hslColor: ', hslColor, ' type: ', (typeof hslColor));

    return hslColor; // Ensure the function returns the value
};


// Ensure hslColor.saturation and hslColor.lightness are type "number"
function formatHslColorPropertiesAsNumbers(hslColor) {
    console.log('redefining hslColor.hue, hslColor.saturation, and hslColor.lightness as data type "number"');

    hslColor.hue = Number(hslColor.hue);
    hslColor.saturation = Number(hslColor.saturation);
    hslColor.lightness = Number(hslColor.lightness);

    console.log('hslColor.hue: ', hslColor.hue, ' type: ', (typeof hslColor.hue), ' hslColor.saturation: ', (typeof hslColor.saturation), ' hslColor.lightness: ', (typeof hslColor.lightness));

    if (typeof hslColor.hue !== 'number' || typeof hslColor.saturation !== 'number' || typeof hslColor.lightness !== 'number') {
        console.error('Conversion to type "number" failed: ', hslColor, ' type: ', (typeof hslColor));

        return;
    }

    console.log('hslColor: ', hslColor, ' type: ', (typeof hslColor));

    return hslColor;
};


// Helper function for initial color values generation inside function generateAndStoreColorValues (colorConversion.js), case 'Hex'
function initialColorValuesGenerationCaseHex(hexValue, formattedHslColor, colorValues) {
    console.log('executing initialColorSpace switch expression for case "hex - initialColorValuesGenerationCaseHex()');
    console.log('defining colorValues object via conversion functions');
    console.log('executing initialColorValuesGenerationCaseHex');

    colorValues = {
        hex: hexValue,
        rgb: hexToRGB(hexValue),
        hsl: formattedHslColor,
        hsv: hexToHSV(hexValue),
        cmyk: hexToCMYK(hexValue),
        lab: hexToLab(hexValue)
    }

    logObjectProperties(colorValues);
    logObjectPropertiesInColorValues(colorValues);

    console.log('execution of initialColorValuesGenerationCaseHex complete; returning colorValues');

    return colorValues;
};


// Helper function for initial color values generation inside function generateAndStoreColorValues (colorConversion.js), case 'rgb'
function initialColorValuesGenerationCaseRGB(color, formattedHslColor, colorValues) {
    console.log('executing initialColorSpace switch expression for case "rgb" - initialColorValuesGenerationCaseRGB');
    console.log('defining colorValues object via conversion functions');

    colorValues = {
        hex: rgbToHex(color.value),
        rgb: color.value,
        hsl: formattedHslColor,
        hsv: rgbToHSV(color.value),
        cmyk: rgbToCMYK(color.value),
        lab: rgbToLab(color.value)
    }

    logObjectProperties(colorValues);
    logObjectPropertiesInColorValues(colorValues);
    
    console.log('execution of initialColorValuesGenerationCaseRGB complete; returning colorValues');

    return colorValues;
};


// initialColorValuesGeneerationCaseHSL
function initialColorValuesGenerationCaseHSL(hslColor, formattedHslColor, colorValues) {
    console.log('executing initialColorSpace switch statement for case "hsl" - initialColorValuesGenerationCaseHSL');
    console.log('defining colorValues object via conversion functions');
    
    colorValues = {
        hex: hslToHex(hslColor.hue, hslColor.saturation, hslColor.lightness),
        rgb: hslToRGB(hslColor.hue, hslColor.saturation, hslColor.lightness),
        hsl: formattedHslColor,
        hsv: hslToHSV(hslColor.hue, hslColor.saturation, hslColor.lightness),
        cmyk: hslToCMYK(hslColor.hue, hslColor.saturation, hslColor.lightness),
        lab: hslToLab(hslColor.hue, hslColor.saturation, hslColor.lightness)
    }

    logObjectProperties(colorValues);
    logObjectPropertiesInColorValues(colorValues);

    console.log('execution of initialColorValuesGenerationCaseHSL complete; returning colorValues');

    return colorValues;
};


// Helper function for initial color values generation inside function generateAndStoreColorValues (colorConversion.js), case 'DEFAULT'
function initialColorValuesGenerationCaseDEFAULT(hslColor) {
    console.log('executing initialColorSpace switch statement for case "DEFAULT" - initialColorValuesGenerationCaseDefault()');
    console.log('defining colorValues object via conversion functions');

    colorValues = {
        hex: hslToHex(hslColor.hue, hslColor.saturation, hslColor.lightness),
        rgb: hslToRGB(hslColor.hue, hslColor.saturation, hslColor.lightness),
        hsl: formattedHslColor,
        hsv: hslToHSV(hslColor.hue, hslColor.saturation, hslColor.lightness),
        cmyk: hslToCMYK(hslColor.hue, hslColor.saturation, hslColor.lightness),
        lab: hslToLab(hslColor.hue, hslColor.saturation, hslColor.lightness)
    };

    logObjectProperties(colorValues);
    logObjectPropertiesInColorValues(colorValues);

    console.log('execution of initialColorValuesGenerationCaseDEFAULT complete; returning colorValues');

    return colorValues;
};


// Helper functions for initial color space formatting grouped into 1 function
function globalColorSpaceFormatting(initialColorSpace = 'hex', hexValue,formattedHslColor, colorValues, hslColor) {
    switch (initialColorSpace) {
        case 'hex':
            initialColorValuesGenerationCaseHex(hexValue, formattedHslColor, colorValues);
            return colorValues;
            break;
        case 'rgb':
            initialColorValuesGenerationCaseRGB(color, formattedHslColor, colorValues);
            return colorValues;
            break;
        case 'hsl':
            initialColorValuesGenerationCaseHSL(hslColor, formattedHslColor, colorValues);
            return colorValues;
            break;
        default:
            initialColorValuesGenerationCaseDEFAULT(hslColor);
            return colorValues;
            break;
    }
};


export { declareConversionMap, initialHslColorGeneration, formatHslForInitialColorValueGen, formatHslColorPropertiesAsNumbers, initialColorValuesGenerationCaseHex, initialColorValuesGenerationCaseRGB, initialColorValuesGenerationCaseHSL, initialColorValuesGenerationCaseDEFAULT, globalColorSpaceFormatting };