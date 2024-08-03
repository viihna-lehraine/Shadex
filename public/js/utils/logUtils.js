// ColorGen - version 0.5.22-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



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


// For generateAndStoreColorValues in colorConversion.js; when colorValues is defined, this logs all the properties of the objects in colorValues
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


// Initial logging for convertColors()
function convertColorsInitialLogging(targetFormat) {
    console.log('convertColors() executing convertColorsInitialLogging()');

    if (!targetFormat) {
        console.error('convertColorsInitialLogging() - targetFormat not found');
    }

    console.log('targetFormat: ', targetFormat, ' data type: ', (typeof targetFormat));
    console.log('convertColorsInitialLogging complete - returning to convertColors()');
};


// Initial logging for generateAndStoreColorValues()
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


// Final logging for generateAndStoreColorValues()
function generateAndStoreColorValuesExitLogs(colorValues) {
    console.log('genrateAndStoreColorValues() executing generateAndStoreColorValuesExitLogs()');
    console.log('generateAndStoreColorValuesExitLogs() - initialColorSpace switch expression completed for generateAndStoreColorValues()');
    console.log('generateAndStoreColorValuesExitLogs() - generated color values: ', colorValues, ' data type: ', (typeof colorValues));
    console.log('generateAndStoreColorValuesExitLogs() - execution of generateAndStoreColorValues() complete');
};


// Initial logging for adjustSaturationAndLightness
function adjustSatAndLightInitLogs(color, limitGrayAndBlack, limitLight, initialColorSpace = 'hex') {
    console.log('executing adjustSaturationAndLightness()');
    console.log(`adjustSatAndLightInitLogs() - color: ${color}, limitGrayAndBlack: ${limitGrayAndBlack}, limitLight: ${limitLight}, initialColorSpace: ${initialColorSpace}`);
    console.log('adjustSatAndLightInitLogs() - types > color: ', (typeof color), ' limitGrayAndBlack: ', (typeof limitGrayAndBlack), ' limitLight ', (typeof limitLight), ' initialColorSpace: ', (typeof initialColorSpace));
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


//Exit logs for handleGenerateButtonClick - paletteGen.js
function handleGenerateButtonClickExitLogs(selectedPaletteTypeOptionValue, numBoxes, limitGrayAndBlack, limitLight, initialColorSpace) {
    console.log('handleGenerateButtonClickExitLogs() executing');
    console.log(`handleGenerateButtonClickExitLogs() - selectedPaletteTypeOptionValue: ${selectedPaletteTypeOptionValue}, numBoxes: ${numBoxes}, limitGrayAndBlacK: ${limitGrayAndBlack}, limitLight: ${limitLight}, initialColorSpace: ${initialColorSpace}`);
    console.log('handleGenerateButtonClickExitLogs() complete and handleGenerateButtonClick() complete; calling generatePalette()');
};


export { logObjectProperties, logObjectPropertiesInColorValues, convertColorsInitialLogging, generateAndStoreColorValuesInitialLogging, generateAndStoreColorValuesExitLogs, adjustSatAndLightInitLogs, generateButtonExitLogs, generatePaletteExitLogs, handleGenerateButtonClickExitLogs };