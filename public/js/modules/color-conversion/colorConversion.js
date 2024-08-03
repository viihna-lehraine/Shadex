// ColorGen - version 0.5.22-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { applyLimitGrayAndBlack, applyLimitLight, convertColorsInitialLogging, declareConversionMap, formatHslForInitialColorValueGen, formatHslColorPropertiesAsNumbers, generateAndStoreColorValuesExitLogs, generateAndStoreColorValuesInitialLogging, globalColorSpaceFormatting, initialHslColorGeneration } from '../../export.js';


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
    })
};


// Generate values for all 6 color spaces for all swatches when a palette is generated, stores as an object (I think?)
function generateAndStoreColorValues(color, initialColorSpace = 'hex') {
    generateAndStoreColorValuesInitialLogging(color, initialColorSpace = 'hex');
    
    let colorValues = {};
    let hslColor;

    // Ensure initialColorSpace is set correctly
    console.log('generateAndStoreColorValues() - checking if initialColorSpace is null. If null, assigning value "hex" to initialColorSpace');

    if (initialColorSpace == null) {
        console.log('generateAndStoreColorValues() - initialColorSpace was null; declaring as "hex"');
        initialColorSpace = 'hex';
    }

    console.log('generateAndStoreColorValues() - initialColorSpace defined as ', initialColorSpace, ' , data type: ', (typeof initialColorSpace));

    // Ensure Hex value is correctly extracted
    const hexValue = (typeof color.value === 'object' && color.value.value) ? color.value.value : color.value;

    console.log('generateAndStoreColorValues() - hexValue: ', hexValue, ' type: ', (typeof hexValue));

    // Set color.format according to initialColorSpace
    color.format = initialColorSpace;

    console.log('generateAndStoreColorValues() - color.format set to: ', color.format);

    // Generate HSL color based on the initial color format
    initialHslColorGeneration(color, hexValue);

    console.log('generateAndStoreColorValues() - generated HSL color: ', hslColor, ' type: ', (typeof hslColor));

    // Ensure HSL is in the correct format
    console.log('generateAndStoreColorValues() - calling formatHslForInitialColorValuesGen(hue, saturation, lightness)');
    formatHslForInitialColorValueGen(hue, saturation, lightness);

    console.log('generateAndStoreColorValues() - hslColor: ', hslColor, ' type: ', (typeof hslColor));

    // Ensure hslColor.saturation and hslColor.lightness are type "number"
    console.log('generateAndStoreColorValues() - calling formatHslColorPropertiesAsNumbers');
    formatHslColorPropertiesAsNumbers(hslColor);

    // Deconstruct HSL object into h, s, and l values with correct formatting
    const formattedHslColor = {
        hue: hslColor.hue,
        saturation: `${hslColor.saturation}%`,
        lightness: `${hslColor.lightness}%`
    }

    console.log('generateAndStoreColorValues() - initialColorSpace: ', initialColorSpace, ' type: ', (typeof initialColorSpace));
    console.log('generateAndStoreColorValues() - hexValue: ', hexValue, ' type: ' (typeof hexValue));
    console.log('generateAndStoreColorValues() - formattedHslColor: ', formattedHslColor, ' type: ', (typeof formattedHslColor));
    console.log('generateAndStoreColorValues() - colorValues: ', colorValues, ' type: ', (typeof colorValues));
    console.log('generateAndStoreColorValues() - hslColor: ', hslColor, ', type: ', (typeof hslColor));
    console.log('generateAndStoreColorValues() - calling globalColorSpaceFormatting(initialColorSpace = "hex", hexValue, formattedHslColor, colorValues, hslColor)');
    globalColorSpaceFormatting(initialColorSpace = 'hex', hexValue, formattedHslColor, colorValues, hslColor);
    generateAndStoreColorValuesExitLogs(colorValues);
    return colorValues;
};


function adjustSaturationAndLightness(color, limitGrayAndBlack, limitLight, initialColorSpace = 'hex') {
    console.log('adjustSaturationAndLightnesss() executing with parameters (color, limitGrayAndBlack, limitLight, initialColorSpace = "hex")');
    console.log(`color: ${color}, limitGrayAndBlack: ${limitGrayAndBlack}, limitLight: ${limitLight}, initialColorSpace: ${initialColorSpace}`);
    console.log('types - color: ', (typeof color), ' limitGrayAndBlack: ', (typeof limitGrayAndBlack), ' limitLight ', (typeof limitLight), ' initialColorSpace: ', (typeof initialColorSpace));

    let hslColor;

    // convert the input color to HSL
    switch (initialColorSpace) {
        case 'hex':
            console.log('adjustSaturationAndLightness() - CASE hex > calling hexToHSL()');
            hslColor = hexToHSL(color);
            console.log('adjustSaturationAndLightness() - CASE hex > hslColor: ', hslColor, ' data type: ', (typeof hslColor));
            break;
        case 'rgb':
            console.log('adjustSaturationAndLightness() - CASE rgb > calling rgbToHSL');
            hslColor = rgbToHSL(color.red, color.green, color.blue);
            console.log('adjustSaturationAndLightness() - CASE rgb > hslColor: ', hslColor, ' data type: ', (typeof hslColor));
            break;
        case 'hsl':
            console.log('adjustSaturationAndLightness() - CASE hsl > assinging color to hslColor');
            hslColor = color;
            console.log('adjustSaturationAndLightness() - CASE hsl > hslColor: ', hslColor, ' data type: ', (typeof hslColor));
            break;
        case 'hsv':
            console.log('adjustSaturationAndLightness() - CASE hsv > calling hsvToHSL');
            hslColor = hsvToHSL(color.hue, color.saturation, color.value);
            console.log('adjustSaturationAndLightness() - CASE hsv > hslColor: ', hslColor, ' data type: ', (typeof hslColor));
            break;
        case 'cmyk':
            console.log('adjustSaturationAndLightness() - CASE cmyk > calling cmykToHSL');
            hslColor = cmykToHSL(color.cyan, color.magenta, color.yellow, color.black);
            console.log('adjustSaturationAndLightness() - CASE cmyk > hslColor: ', hslColor, ' data type: ', (typeof hslColor));
            break;
        case 'lab':
            console.log('adjustSaturationAndLightness() - CASE lab > calling labToHSL');
            hslColor = labToHSL(color.l, color.a, color.b);
            console.log('adjustSaturationAndLightness() - CASE lab > hslColor: ', hslColor, ' data type: ', (typeof hslColor));
            break;
        default:
            console.log('adjustSaturationAndLightness() - DEFAULT CASE > calling hexToHSL()');
            hslColor = hexToHSL(color);
            console.log('adjustSaturationAndLightness() - DEFAULT CASE > hslColor: ', hslColor, ' data type: ', (typeof hslColor));
            break;
    }

    console.log('adjustSaturationAndLightness() - initialColorSpace switch expression completed for adjustSaturationAndLightness');

    // Apply limitGrayAndBlack and limitLight, if applicable
    if (limitGrayAndBlack) {
        console.log('adjustSaturationAndLightness() - calling applyLimitGrayAndBlack()');
        ({ saturation: hslColor.saturation, lightness: hslColor.lightness } = applyLimitGrayAndBlack(hslColor.saturation, hslColor.lightness));
    }

    if (limitLight) {
        console.log('adjustSaturationAndLightness() - calling applyLimitLight()');
        hslColor.lightness = applyLimitLight(hslColor.lightness);
    }

    console.log('adjustSaturationAndLightness() - hslColor: ', hslColor, ' type: ', (typeof hslColor));
    console.log('adjustSaturationAndLightness() complete; returning hslColor');
    return hslColor;
};


export { convertColors, generateAndStoreColorValues, adjustSaturationAndLightness };