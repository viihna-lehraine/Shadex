// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { applyLimitGrayAndBlack, applyLimitLight, generateAndStoreColorValuesInitialLogging, satAndLightHslColorGen, declareConversionMap } from './index.js';

import { initialHSLColorGenerationWithLogs, formatHSLForInitialColorValueGenWithLogs, formatHslColorPropertiesAsNumbersWithLogs, globalColorSpaceFormattingWithLogs } from './index.js';

import { convertColorsInitialLogging, generateAndStoreColorValuesInitialLogging, generateAndStoreColorValuesFinalLogs, adjustSatAndLightInitLogs } from '../../utils/index.js';


//Create map object for conversion functions
declareConversionMap();


// When a conversion button is clicked, this will pull the color space type for that color and repopulate color-text-output-box with it
// Previous conversion function actually tried to convert them again. But conversion takes place with palette generation and are stored as an oject
function convertColors(targetFormat) {
    convertColorsInitialLogging(targetFormat);

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
            console.error(`Conversion to ${targetFormat} is not supported.`);
            return;
        }

        box.value = newColor;
        box.setAttribute('data-format', targetFormat);

        console.log('execution of convertColors complete');
    });
};


// Generate values for all 6 color spaces for all swatches when a palette is generated, stores as an object (I think?)
function generateAndStoreColorValues(color, initialColorSpace = 'hex') {
    generateAndStoreColorValuesInitialLogging(color, initialColorSpace = 'hex');
    
    let colorValues = {};
    let hslColor;

    // Ensure initialColorSpace is set correctly
    console.log('checking if initialColorSpace is null. If null, assigning value "hex" to initialColorSpace');
    if (initialColorSpace == null) {
        initialColorSpace = 'hex';
    }

    console.log('initialColorSpace defined as ', initialColorSpace, ' , data type: ', (typeof initialColorSpace));

    // Ensure Hex value is correctly extracted
    const hexValue = (typeof color.value === 'object' && color.value.value) ? color.value.value : color.value;
    console.log('hexValue: ', hexValue, ' type: ', (typeof hexValue));

    // Set color.format according to initialColorSpace
    color.format = initialColorSpace;
    console.log('color.format set to: ', color.format);

    // Generate HSL color based on the initial color format
    initialHSLColorGenerationWithLogs(color, hexValue);

    console.log('generated HSL color: ', hslColor, ' type: ', (typeof hslColor));

    // Ensure HSL is in the correct format
    formatHSLForInitialColorValueGenWithLogs(hue, saturation, lightness);

    // Ensure hslColor.saturation and hslColor.lightness are type "number"
    formatHslColorPropertiesAsNumbersWithLogs(hslColor);

    // Deconstruct HSL object into h, s, and l values with correct formatting
    const formattedHslColor = {
        hue: hslColor.hue,
        saturation: `${hslColor.saturation}%`,
        lightness: `${hslColor.lightness}%`
    };

    globalColorSpaceFormattingWithLogs(initialColorSpace = 'hex', hexValue, formattedHslColor, colorValues, hslColor);
    generateAndStoreColorValuesFinalLogs(colorValues);

    return colorValues;
};


function adjustSaturationAndLightness(color, limitGrayAndBlack, limitLight, initialColorSpace = 'hex') {
    adjustSatAndLightInitLogs(color, limitGrayAndBlack, limitLight, initialColorSpace = 'hex');

    let hslColor;

    // convert the input color to HSL
    satAndLightHslColorGen(initialColorSpace = 'hex', color);

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
};


export { convertColors, generateAndStoreColorValues, adjustSaturationAndLightness };