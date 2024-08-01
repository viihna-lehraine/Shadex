// ColorGen - version 0.5.2-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { hexToRGB, hexToHSL, hexToHSV, hexToCMYK, hexToLab } from './index.js';
import { rgbToHex, rgbToHSL, rgbToHSV, rgbToCMYK, rgbToLab } from './index.js';
import { hslToHex, hslToRGB, hslToHSV, hslToCMYK, hslToLab } from './index.js';
import { hsvToHex, hsvToRGB, hsvToHSL, hsvToCMYK, hsvToLab } from './index.js';
import { cmykToHex, cmykToRGB, cmykToHSL, cmykToHSV, cmykToLab } from './index.js';
import { labToHex, labToRGB, labToHSL, labToHSV, labToCMYK } from './index.js';


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
    };
    
    return conversionMap;
};


// Generate initial HSL color based on color.format
function initialHSLColorGeneration(color, hexValue) {
    if (color.format === 'hex') {
        hslColor = hexToHSL(hexValue);
    } else if (color.format === 'rgb') {
        hslColor = rgbToHSL(color.value);
    } else if (color.format === 'hsl') {
        hslColor = parseHSL(color.value);
    } else if (color.format === 'hsv') {
        hslColor = hslToHSV(color.value);
    } else if (color.format === 'cmyk') {
        hslColor = cmykToHSL(color.value);
    } else if (color.format === 'lab') {
        hslColor = labToHSL(color.value);
    } else {
        return;
    };

    return hslColor;
};


// Generate initial HSL color based on color.format, with logs
function initialHSLColorGenerationWithLogs(color, hexValue) {
    if (!color) {
        console.error('Error: initialHSLColorGeneration - color not found');
    };
    
    if (!hexValue) {
        console.error('Error: initialHSLColorGeneration - hexValue not found');
    };

    if (color.format === 'hex') {
        console.log('calling hexToHSL');
        hslColor = hexToHSL(hexValue);
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

    if (typeof hslColor !== 'object') {
        console.error('Error: initialHSLColorGeneration - hslColor is not an object');
    };

    console.log('generated HSL color: ', hslColor, ' type: ', (typeof hslColor));

    return hslColor;
};


// Ensure HSL is in the correct format
function formatHSLForInitialColorValueGen(hue, saturation, lightness) {
    let hslColor = { hue, saturation, lightness };
    if (typeof hue === 'object') {
        hslColor = {
            hue: hue.hue,
            saturation: hue.saturation,
            lightness: hue.lightness
        };
    }

    return hslColor;
};


// Ensure HSL is in the correct format, with logs
function formatHSLForInitialColorValueGenWithLogs(hue, saturation, lightness) {
    let hslColor = { hue, saturation, lightness }; // Fixed the declaration
    console.log('hue: ', hue, ' type: ', (typeof hue));
    console.log('deconstructing hue if it is an object and splitting into hue.hue, hue.saturation, and hue.lightness');
    if (typeof hue === 'object') {
        console.log('hue is an object; extracting nested values and returning as an object'); 
        hslColor = {
            hue: hue.hue,
            saturation: hue.saturation,
            lightness: hue.lightness
        };
    }

    console.log('hue data type: ', (typeof hue), ' hue.hue: ', (typeof hue.hue), ' hue.saturation: ', (typeof hue.saturation), ' hue.lightness: ', (typeof hue.lightness));
    console.log('hslColor: ', hslColor, ' type: ', (typeof hslColor));
    return hslColor; // Ensure the function returns the value
}


// Ensure hslColor.saturation and hslColor.lightness are type "number"
function formatHslColorPropertiesAsNumbers() {
    hslColor.hue = Number(hslColor.hue);
    hslColor.saturation = Number(hslColor.saturation);
    hslColor.lightness = Number(hslColor.lightness);

    if (typeof hslColor.hue !== 'number' || typeof hslColor.saturation !== 'number' || typeof hslColor.lightness !== 'number') {
        console.error('Conversion to type "number" failed: ', hslColor, ' type: ', (typeof hslColor));
        return;
    };
};


// Ensure hslColor.saturation and hslColor.lightness are type "number", with logs
function formatHslColorPropertiesAsNumbersWithLogs(hslColor) {
    console.log('redefining hslColor.hue, hslColor.saturation, and hslColor.lightness as data type "number"');
    hslColor.hue = Number(hslColor.hue);
    hslColor.saturation = Number(hslColor.saturation);
    hslColor.lightness = Number(hslColor.lightness);
    console.log('hslColor.hue: ', hslColor.hue, ' type: ', (typeof hslColor.hue), ' hslColor.saturation: ', (typeof hslColor.saturation), ' hslColor.lightness: ', (typeof hslColor.lightness));

    if (typeof hslColor.hue !== 'number' || typeof hslColor.saturation !== 'number' || typeof hslColor.lightness !== 'number') {
        console.error('Conversion to type "number" failed: ', hslColor, ' type: ', (typeof hslColor));
        return;
    };

    console.log('hslColor: ', hslColor, ' type: ', (typeof hslColor));
    return hslColor;
}


// Helper function for initial color values generation inside function generateAndStoreColorValues (colorConversion.js), case 'hex'
function initialColorValuesGenerationCaseHex(hexValue, formattedHslColor) {
    console.log('executing initialColorValuesGenerationCaseHex');

    colorValues = {
        hex: hexValue,
        rgb: hexToRGB(hexValue),
        hsl: formattedHslColor,
        hsv: hexToHSV(hexValue),
        cmyk: hexToCMYK(hexValue),
        lab: hexToLab(hexValue)
    };

    console.log('execution of initialColorValuesGenerationCaseHex complete; returning colorValues');

    return colorValues;
};


// Helper function for initial color values generation inside function generateAndStoreColorValues (colorConversion.js), case 'rgb'
function initialColorValuesGenerationCaseRGB(color, formattedHslColor) {
    console.log('executing initialColorValuesGenerationCaseRGB');

    colorValues = {
        hex: rgbToHex(color.value),
        rgb: color.value,
        hsl: formattedHslColor,
        hsv: rgbToHSV(color.value),
        cmyk: rgbToCMYK(color.value),
        lab: rgbToLab(color.value)
    };

    console.log('execution of initialColorValuesGenerationCaseRGB complete; returning colorValues');

    return colorValues;
};


// Helper function for initial color values generation inside function generateAndStoreColorValues (colorConversion.js), case 'hsl'
function initialColorValuesGenerationCaseHSL(hslColor, formattedHslColor) {
    console.log('executing initialColorValuesGenerationCaseHSL');

    colorValues = {
        hex: hslToHex(hslColor.hue, hslColor.saturation, hslColor.lightness),
        rgb: hslToRGB(hslColor.hue, hslColor.saturation, hslColor.lightness),
        hsl: formattedHslColor,
        hsv: hslToHSV(hslColor.hue, hslColor.saturation, hslColor.lightness),
        cmyk: hslToCMYK(hslColor.hue, hslColor.saturation, hslColor.lightness),
        lab: hslToLab(hslColor.hue, hslColor.saturation, hslColor.lightness)
    };

    console.log('execution of initialColorValuesGenerationCaseHSL complete; returning colorValues');
    
    return colorValues;
};


// Helper function for initial color values generation inside function generateAndStoreColorValues (colorConversion.js), case 'DEFAULT'
function initialColorValuesGenerationCaseDEFAULT(hslColor) {
    colorValues = {
        hex: hslToHex(hslColor.hue, hslColor.saturation, hslColor.lightness),
        rgb: hslToRGB(hslColor.hue, hslColor.saturation, hslColor.lightness),
        hsl: formattedHslColor,
        hsv: hslToHSV(hslColor.hue, hslColor.saturation, hslColor.lightness),
        cmyk: hslToCMYK(hslColor.hue, hslColor.saturation, hslColor.lightness),
        lab: hslToLab(hslColor.hue, hslColor.saturation, hslColor.lightness)
    };

    return colorValues;
};


// initialColorValuesGeneerationCaseHex, but adds debug logs
function initialColorValuesGenerationCaseHexWithLogging(hexValue, formattedHslColor, colorValues) {
    console.log('executing initialColorSpace switch expression for case "hex');
    console.log('defining colorValues object via conversion functions');

    initialColorValuesGenerationCaseHex(hexValue, formattedHslColor);
    logObjectProperties(colorValues);
    logObjectPropertiesInColorValues(colorValues);

    return colorValues;
};


// initialColorValuesGeneerationCaseRGB, but adds debug logs
function initialColorValuesGenerationCaseRGBWithLogging(color, formattedHslColor, colorValues) {
    console.log('executing initialColorSpace switch expression for case "rgb');
    console.log('defining colorValues object via conversion functions');
    
    initialColorValuesGenerationCaseRGB(color, formattedHslColor);
    logObjectProperties(colorValues);
    logObjectPropertiesInColorValues(colorValues);
    
    return colorValues;
};


// initialColorValuesGeneerationCaseHSL,but adds debug logs
function initialColorValuesGenerationCaseHSLWithLogging(hslColor, formattedHslColor, colorValues) {
    console.log('executing initialColorSpace switch statement for case "hsl');
    console.log('defining colorValues object via conversion functions');
    
    initialColorValuesGenerationCaseHSL(hslColor, formattedHslColor);
    logObjectProperties(colorValues);
    logObjectPropertiesInColorValues(colorValues);

    return colorValues;
};


// initialColorValuesGenerationCaseDEFAULT, but adds logs
function initialColorValuesGenerationCaseDEFAULTWithLogging(hslColor) {
    console.log('executing initialColorSpace switch statement for case DEFAULT');
    console.log('defining colorValues object via conversion functions');

    logObjectProperties(colorValues);
    logObjectPropertiesInColorValues(colorValues);

    return colorValues;
};


// Helper functions for initial color space formatting grouped into 1 function
function globalColorSpaceFormatting(initialColorSpace = 'hex', hexValue, formattedHslColor, colorValues, hslColor) {
    switch (initialColorSpace) {
        case 'hex':
            initialColorValuesGenerationCaseHexWithLogging(hexValue, formattedHslColor, colorValues);
            return colorValues;
            break;
        case 'rgb':
            initialColorValuesGenerationCaseRGBWithLogging(color, formattedHslColor, colorValues);
            return colorValues;
            break;
        case 'hsl':
            initialColorValuesGenerationCaseHSLWithLogging(hslColor, formattedHslColor, colorValues);
            return colorValues;
            break;
        default:
            initialColorValuesGenerationCaseDEFAULTWithLogging(hslColor);
            return colorValues;
            break;
    }
}


// Helper functions for initial color space formatting grouped into 1 function, logs added
function globalColorSpaceFormattingWithLogs(initialColorSpace = 'hex', hexValue,formattedHslColor, colorValues, hslColor) {
    switch (initialColorSpace) {
        case 'hex':
            initialColorValuesGenerationCaseHexWithLogging(hexValue, formattedHslColor, colorValues);
            return colorValues;
            break;
        case 'rgb':
            initialColorValuesGenerationCaseRGBWithLogging(color, formattedHslColor, colorValues);
            return colorValues;
            break;
        case 'hsl':
            initialColorValuesGenerationCaseHSLWithLogging(hslColor, formattedHslColor, colorValues);
            return colorValues;
            break;
        default:
            initialColorValuesGenerationCaseDEFAULTWithLogging(hslColor);
            return colorValues;
            break;
    }
};


export { declareConversionMap };

export { initialHSLColorGeneration, formatHSLForInitialColorValueGen, formatHslColorPropertiesAsNumbers };

export { initialHSLColorGenerationWithLogs, formatHSLForInitialColorValueGenWithLogs, formatHslColorPropertiesAsNumbersWithLogs };

export { initialColorValuesGenerationCaseHex, initialColorValuesGenerationCaseRGB, initialColorValuesGenerationCaseHSL, initialColorValuesGenerationCaseDEFAULT };

export { initialColorValuesGenerationCaseHexWithLogging, initialColorValuesGenerationCaseRGBWithLogging, initialColorValuesGenerationCaseHSLWithLogging, initialColorValuesGenerationCaseDEFAULTWithLogging };

export { globalColorSpaceFormatting };
export { globalColorSpaceFormattingWithLogs };