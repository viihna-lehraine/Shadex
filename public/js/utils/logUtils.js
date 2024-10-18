// Helper functon to log the properties of an object
function logObjectProperties(obj) {
    console.log('logObjectProperties(obj) executing');

    try {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                console.log(`${key}: `, obj[key]);
            }
        }
    } catch (error) {
        console.error('logObjectProperties() - error parsing keys in parameter passed to logObjectProperties(); checking parameter data type');
        console.log(typeof obj);
    }

    console.log('logObjectProperties(obj) complete - ')
};


// For generateAndStoreColorValues - when colorValues is defined, this logs all the properties of the objects in colorValues - colorConversion.js
function logObjectPropertiesInColorValues(colorValues) {
    console.log('logObjectPropertiesInColorValues() executing');
    const properties = ['hex', 'rgb', 'hsl', 'hsv', 'cmyk', 'lab'];

    properties.forEach(property => {
        if (typeofColorValues[property] === 'object') {
            console.log(`logObjectPropertiesInColorValues() - ${property} values: `);
            console.log('logObjectPropertiesInColorValues() - calling logObjectProperties(colorValues[property]');
            logObjectProperties(colorValues[property]);
        } else {
            console.error(`Not an object; ${property}: `, colorValues[property], 'type: ', (typeof colorValues[property]));
        }
    })

    console.log('logObjectPropertiesInColorValues() complete;')
};


// Initial logging for convertColors() - colorConversion.js
function convertColorsInitialLogging(targetFormat) {
    console.log('convertColors() executing convertColorsInitialLogging()');

    if (!targetFormat) {
        console.error('convertColorsInitialLogging() - targetFormat not found');
    }

    console.log('targetFormat: ', targetFormat, ' data type: ', (typeof targetFormat));
    console.log('convertColorsInitialLogging complete - returning to convertColors()');
};


// Init loggs for generateAndStoreColorValues() - colorConversion.js
function generateAndStoreColorValuesInitialLogging(color, initialColorSpace = 'hex') {
    console.log('generateAndStoreColorValues() executing generateAndStoreColorValuesInitialLogging()');
    console.log('generateAndStoreColorValuesInitialLogging() - color: ', color, ' type: ', (typeof color));
    if (!color) {
        console.error('generateAndStoreColorValuesInitialLogging() - color not found');
    }

    if (!initialColorSpace) {
        console.error('generateAndStoreColorValuesInitialLogging() - initialColorSpace not found');
    }

    console.log('generateAndStoreColorValuesInitialLogging() - color: ', color, ' data type: ', (typeof color));
    console.log('generateAndStoreColorValuesInitialLogging() - initialColorSpace: ', initialColorSpace, ' data type: ', (typeof initialColorSpace));
    console.log('generateAndStoreColorValues() complete; returning to generateAndStoreColorValues()');
};


// Pre-exit logs for generateAndStoreColorValues() - colorConversion.js
function generateAndStoreColorValuesPreExitLogs(initialColorSpace = 'hex', hexValue, formattedHslColor, colorValues, hslColor) {
    console.log('generateAndStoreColorValues() - initialColorSpace: ', initialColorSpace, ' type: ', (typeof initialColorSpace));
    console.log('generateAndStoreColorValues() - hexValue: ', hexValue, ' type: ' (typeof hexValue));
    console.log('generateAndStoreColorValues() - formattedHslColor: ', formattedHslColor, ' type: ', (typeof formattedHslColor));
    console.log('generateAndStoreColorValues() - colorValues: ', colorValues, ' type: ', (typeof colorValues));
    console.log('generateAndStoreColorValues() - hslColor: ', hslColor, ', type: ', (typeof hslColor));
    console.log('generateAndStoreColorValues() - calling globalColorSpaceFormatting(initialColorSpace = "hex", hexValue, formattedHslColor, colorValues, hslColor)');
};


// Final logging for generateAndStoreColorValues() - colorConversion.js
function generateAndStoreColorValuesExitLogs(colorValues) {
    console.log('genrateAndStoreColorValues() executing generateAndStoreColorValuesExitLogs()');
    console.log('generateAndStoreColorValuesExitLogs() - initialColorSpace switch expression completed for generateAndStoreColorValues()');
    console.log('generateAndStoreColorValuesExitLogs() - generated color values: ', colorValues, ' data type: ', (typeof colorValues));
    console.log('generateAndStoreColorValuesExitLogs() - execution of generateAndStoreColorValues() complete');
};


// Initial logs for adjustSaturationAndLightness - colorConversion.js
function adjustSatAndLightInitLogs(color, limitGrayAndBlack, limitLight, initialColorSpace = 'hex') {
    console.log('executing adjustSaturationAndLightness()');
    console.log(`adjustSatAndLightInitLogs() - color: ${color}, limitGrayAndBlack: ${limitGrayAndBlack}, limitLight: ${limitLight}, initialColorSpace: ${initialColorSpace}`);
    console.log('adjustSatAndLightInitLogs() - types > color: ', (typeof color), ' limitGrayAndBlack: ', (typeof limitGrayAndBlack), ' limitLight ', (typeof limitLight), ' initialColorSpace: ', (typeof initialColorSpace));
};


// Exit logs for adjustSaturationAndLightness() - colorConversion.js
function adjustSatAndLightExitLogs(hslColor) {
    console.log('adjustSaturationAndLightness() - hslColor: ', hslColor, ' type: ', (typeof hslColor));
    console.log('adjustSaturationAndLightness() complete; returning hslColor');
};


// Final Logging for Generate Button Click Event before executing generatePalette function
function generateButtonExitLogs(paletteType, numBoxes, limitGrayAndBlack, limitLight, customColor = null, initialColorSpace = 'hex') {
    console.log('generateButtonExitLogs() - generate button" clicked');
    console.log(`generateButtonExitLogs() -  passing paletteType ${paletteType}, numBoxes ${numBoxes}, limitGrayAndBlack ${limitGrayAndBlack}, limitLight ${limitLight}, and customColor ${customColor}`);
    console.log(`generateButtonExitLogs() - passing initialColorSpace ${initialColorSpace} to generatePalette()`);
    console.log('generateButtonExitLogs() - click event execution complete; calling generatePalette()');
};


// Exit logs for generatePalette function - paletteGen.js
// Logs value and data type for colors and numBoxes before announcing the successful completion of generatePalette 
function generatePaletteExitLogs(colors, numBoxes) {
    console.log('generatePaletteExitLogs() executing');
    console.log('colors: ', colors, ' data type: ', (typeof colors));
    console.log('numBoxes: ', numBoxes, ' data type: ', (typeof numBoxes));
    console.log('generatePaletteExitLogs() complete and generatePalette() complete - calling generatePaletteBox()');
};


// Exit logs for handleGenerateButtonClick - paletteGen.js
function handleGenerateButtonClickExitLogs(selectedPaletteTypeOptionValue, numBoxes, limitGrayAndBlack, limitLight, initialColorSpace) {
    console.log('handleGenerateButtonClickExitLogs() executing');
    console.log(`handleGenerateButtonClickExitLogs() - selectedPaletteTypeOptionValue: ${selectedPaletteTypeOptionValue}, numBoxes: ${numBoxes}, limitGrayAndBlacK: ${limitGrayAndBlack}, limitLight: ${limitLight}, initialColorSpace: ${initialColorSpace}`);
    console.log('handleGenerateButtonClickExitLogs() complete and handleGenerateButtonClick() complete; calling generatePalette()');
};


// Exit logs for randomSL() - randomUtils.js
function randomSLExitLogs(color) {
    console.log('randomSL() - color: ', color, ' type: ', (typeof color));
    console.log('randomSL() - saturation: ', color.saturation, ' typeof saturation: ', (typeof color.saturation), ' lightness: ', color.lightness, ' typeof lightness: ', (typeof lightness));
    console.log('randomSL() complete - returning color');
};


// Exit logs for randomSV() - randomUtils.js
function randomSVExitLogs(color) {
    console.log('randomSV() - color: ', color, ' type: ', (typeof color));
    console.log('randomSV() - saturation: ', color.saturation, ' typeof saturation: ', (typeof color.saturation), ' value: ', color.value, ' typeof value: ', (typeof value));
    console.log('randomSV() complete - returning color');
};


// Init and exit logs for randomRGB() - randomUtils.js
function randomRGBLogs() {
    console.log('randomRGB() executing');
    console.log('randomRGB() complete, returning { format: "rgb", red: , green: , blue: }');
};


// Exit logs for randomHSL() - randomUtils.js
function randomHSLExitLogs(hue, saturation, lightness) {
    console.log(`randomHSL() - generated random HSL: hsl(${hue}, ${saturation}%, ${lightness}%)`);
    console.log('randomHSL() complete');
};


// Init and exit logs for randomHSV() - randomUtils.js
function randomHSVLogs() {
    console.log('randomHSV() executing');
    console.log('randomHSV() complete, returning { format: "hsv", hue: , saturation: , value: }');
};


// Init and exit logs for randomCMYK() - randomUtils.js
function randomCMYKLogs() {
    console.log('randomCMYK() executing');
    console.log('randomCMYK() complete, returning { format: "cmyk", cyan: , magenta: , yellow: , key: }');
};


// Init and exit logs for randomLab() - randomUtils.js
function randomLabLogs() {
    console.log('randomLab() executing');
    console.log('randomLab() complete, returning { format: "lab", l: , a: , b: }');
};


// Init logs for generateRandomFirstColor() - randomUtils.js
function generateRandomFirstColorInitLogs(limitGrayAndBlack, limitLight, initialColorSpace) {
    console.log('generateRandomFirstColor() executing');
    console.log('generateRandomFirstColor() - limitGrayAndBlack: ', limitGrayAndBlack, ' limitLight: ', limitLight, ' initialColorSpace: ', initialColorSpace);
    console.log('generateRandomFirstColor() - types > limitGrayAndBlack: ', (typeof limitGrayAndBlack), ' limitLight: ', (typeof limitLight), ' initialColorSpace: ', (typeof initialColorSpace));
};


// Init logs for hexToCMYK() - convertToCMYK.js
function hexToCMYKInitLogs(hex) {
    console.log('hexToCMYK() executing');
    console.log('hexToCMYK() - hex: ', hex, ' data type ', (typeof hex));
};


// Exit logs for hexToCMYK() try case - convertToCMYK.js
function hexToCMYKTryExitLogs(cmyk) {
    console.log(`hexToCMYK() - converted CMYK from RGB: ${JSON.stringify(cmyk)}`);
    console.log('hexToCMYK() - cmyk: ', cmyk, ' data type: ', (typeof cmyk));
    console.log('hexToCMYK() complete - returning cmyk as a formatted string');
};


// Exit logs for hexToCMYK() catch expression - convertToCMYK.js
function hexToCMYKCatchExitLogs(cmyk) {
    console.log('hexToCMYK() - cmyk: ', cmyk, ' data type: ', (typeof cmyk));
    console.log('hexToCMYK() complete - returning cmyk as a formatted string');
};


// Init logs for rgbToCMYK() - convertToCMYK.js
function rgbToCMYKInitLogs(red, green, blue) {
    console.log('rgbToCMYK() executing');
    console.log('rgbToCMYK() - red: ', red, ' green: ', green, ' blue: ', blue);
    console.log('rgbToCMYK() > types - red: ', (typeof red), ' green: ', (typeof green), ' blue: ', (typeof blue));
};


// Exit logs for try case in rgbToCMYK() - convertToCMYK.js
function rgbToCMYKTryExitLogs(cmyk) {
    console.log(`rgbToCMYK() - converted CMYK from RGB: ${JSON.stringify(cmyk)}`);
    console.log('rgbToCMYK() - cmyk: ', cmyk, ' data type: ', (typeof cmyk));
    console.log('rgbToCMYK() complete - returning cmyk as an object');
};


// Exit logs for catch case in rgbToCMYK() - convertToCMYK.js
function rgbToCMYKCatchExitLogs(error) {
    console.error(`rgbToCMYK() - error converting RGB to CMYK: ${error}`);
    console.log('rgbToCMYK() complete; setting default CMYK value { 0, 0, 0, 0 }');
};


// Init logs for hslToCMYK() - convertToCMYK.js
function hslToCMYKInitLogs(hue, saturation, lightness) {
    console.log('hslToCMYK() executing');
    console.log('hslToCMYK() - hue: ', hue, ' saturation: ', saturation, ' lightness: ', lightness);
    console.log('hslToCMYK() > types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' lightness: ', (typeof lightness));
};


// Init logs for hsvToCMYK() - convertToCMYK.js
function hsvToCMYKInitLogs(hue, saturation, value) {
    console.log('hsvToCMYK() executing');
    console.log('hsvToCMYK() - hue: ', hue, ' saturation: ', saturation, ' value: ', value);
    console.log('hsvToCMYK() > types - hue: ', (typeof hue), ' saturation: ', (typeof saturation), ' value: ', (typeof value));
};


// Init logs for labToCMYK - convertToCMYK.js
function labToCMYKInitLogs(l, a, b) {
    console.log('labToCMYK() executing');
    console.log('labToCMYK() - l: ', l, ' a: ', a, ' b: ', b);
    console.log('labToCMYK() > types - l: ', (typeof l), ' a: ', (typeof a), ' b: ', (typeof b));
};


export { logObjectProperties, logObjectPropertiesInColorValues, convertColorsInitialLogging, generateAndStoreColorValuesInitialLogging, generateAndStoreColorValuesPreExitLogs, generateAndStoreColorValuesExitLogs, adjustSatAndLightInitLogs, adjustSatAndLightExitLogs, generateButtonExitLogs, generatePaletteExitLogs, handleGenerateButtonClickExitLogs, randomSLExitLogs, randomSVExitLogs, randomRGBLogs, randomHSLExitLogs, randomHSVLogs, randomCMYKLogs, randomLabLogs, generateRandomFirstColorInitLogs };
export { hexToCMYKInitLogs, hexToCMYKTryExitLogs, hexToCMYKCatchExitLogs, rgbToCMYKInitLogs, rgbToCMYKTryExitLogs, rgbToCMYKCatchExitLogs, hslToCMYKInitLogs, hsvToCMYKInitLogs, labToCMYKInitLogs };