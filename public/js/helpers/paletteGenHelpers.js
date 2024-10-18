import { generateAnalogousPalette, generateComplementaryPalette, generateDiadicPalette, generateHexadicPalette, generateMonochromaticPalette, generateRandomFirstColor, generateRandomColorPalette, generateTetradicPalette, generateTriadicPalette, randomCMYK, randomHex, randomHSL, randomHSV, randomLab, randomRGB } from '../export.js';


// Create random initial colors if user doesn't define a custom color
function randomInitialColor(baseColor, initialColorSpace = 'hex', limitGrayAndBlack, limitLight) {
    console.log('randomInitialColor() executing');
    console.log('randomInitialColor() - baseColor: ', baseColor, ' type: ', (typeof baseColor));

    if (!baseColor || !baseColor.value) {
        if (!baseColor) {
            baseColor = {};
        }
        switch (initialColorSpace) {
            case 'hex':
                console.log('randomInitialColor() - calling randomHex from within generatePalette');
                baseColor.value = randomHex(limitGrayAndBlack, limitLight);
                console.log('randomInitialColor() - baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));
                break;
            case 'rgb':
                console.log('randomInitialColor() - calling randomRGB from within generatePalette');
                baseColor.value = randomRGB(limitGrayAndBlack, limitLight);
                console.log('randomInitialColor() - baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));
                break;
            case 'hsl':
                console.log('randomInitialColor() - calling randomHSL from within generatePalette');
                baseColor.value = randomHSL(limitGrayAndBlack, limitLight);
                console.log('randomInitialColor() - baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));
                break;
            case 'hsv':
                console.log('randomInitialColor() - calling randomHSV from within generatePalette');
                baseColor.value = randomHSV(limitGrayAndBlack, limitLight);
                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));
                break;
            case 'cmyk':
                console.log('randomInitialColor() - calling randomCMYK from within generatePalette');
                baseColor.value = randomCMYK(limitGrayAndBlack, limitLight);
                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));
                break;
            case 'lab':
                console.log('randomInitialColor() - calling randomLab from within generatePalette');
                baseColor.value = randomLab(limitGrayAndBlack, limitLight);
                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));
                break;
            default:
                console.log('randomInitialColor() - DEFAULT CASE - calling randomHex from within generatePalette');
                baseColor.value = randomHex(limitGrayAndBlack, limitLight);
                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));
                break;
        }

        console.log ('randomInitialColor() - baseColor.value: ', baseColor.value);
    }

    console.log('randomInitialColor() - initialColorSpace switch expression complete');
    console.log('randomInitialColor() - baseColor: ', baseColor);
    console.log('randomInitialColor() complete');
    return baseColor;
};


// Generate user-selected palette type
function generateSelectedPaletteType(paletteType, numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex') {
    console.log('generateSelectedPaletteType() executing');

    switch (paletteType) {
        case 1:
            console.log('generateSelectedPaletteType() - calling generateRandomColorPalette');
            colors = generateRandomColorPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('generateSelectedPaletteType() - colors: ', colors, ' data type: ', (typeof colors));
            return colors;
        case 2:
            console.log('generateSelectedPaletteType() - calling generateComplementaryPalette');
            colors = generateComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('generateSelectedPaletteType() - colors: ', colors, ' data type: ', (typeof colors));
            return colors;
        case 3:
            console.log('generateSelectedPaletteType() - calling generateTriadicPalette');
            colors = generateTriadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('generateSelectedPaletteType() - colors: ', colors, ' data type: ', (typeof colors));
            return colors;
        case 4:
            console.log('generateSelectedPaletteType() - calling generateTetradicPalette');
            colors = generateTetradicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('generateSelectedPaletteType() - colors: ', colors, ' data type: ', (typeof colors));
            return colors;
        case 5:
            console.log('generateSelectedPaletteType() - calling generateSplitComplementaryPalette');
            colors = generateSplitComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('generateSelectedPaletteType() - colors: ', colors, ' data type: ', (typeof colors));
            return colors;
        case 6:
            console.log('generateSelectedPaletteType() - calling generatAnalogousPalette');
            colors = generateAnalogousPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('generateSelectedPaletteType() - colors: ', colors, ' data type: ', (typeof colors));
            return colors;
        case 7:
            console.log('generateSelectedPaletteType() - calling generateHexadicPalette');
            colors = generateHexadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('generateSelectedPaletteType() - colors: ', colors, ' data type: ', (typeof colors));
            return colors;
        case 8:
            console.log('calling generateDiadicPalette');
            colors = generateDiadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('generateSelectedPaletteType() - colors: ', colors, ' data type: ', (typeof colors));
            return colors;
        case 9:
            console.log('generateSelectedPaletteType() - calling generateMonochromaticPalette');
            colors = generateMonochromaticPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('generateSelectedPaletteType() - colors: ', colors, ' data type: ', (typeof colors));
            return colors;
        default:
            console.error('generateSelectedPaletteType() - DEFAULT CASE > unable to determine color scheme');
            break;
    }

    console.log('generateSelectedPaletteType() complete');
};


// First, will check if customColor was provided, ensures it is in the form of an object. If not, will reformat customColor as an object
// If customColor has no value, will instead assign it a default value while formatting it as an object
function paletteGenColorSpaceConditionCheck(customColor, initialColorSpace) {
    console.log('paletteGenColorSpaceConditionCheck() executing');

    let baseColor = customColor;

    // Ensures customColor is an object. If not, reformats as an object
    if (customColor && typeof customColor === 'object' && customColor.value) {
        console.log('paletteGenColorSpaceConditionCheck() - customColor: ', customColor, ' type: ', (typeof customcolor));
        console.log('paletteGenColorSpaceConditionCheck() - customColor already exists as an object with an assigned value; assigning customColor value and properties to baseColor');

        if (!baseColor) {
            console.error('paletteGenColorSpaceConditionCheck() - ERROR: baseColor default assignment failed. generatePalette function execution will continue');
        }

        if (typeof baseColor !== 'object') {
            console.error('paletteGenColorSpaceConditionCheck() - ERROR: Failed to format baseColor as an object. generatePalette function execution will continue');
        }

        console.log('paletteGenColorSpaceConditionCheck() - baseColor: ', baseColor, ' type: ', (typeof baseColor));
        console.log('paletteGenColorSpaceConditionCheck() - eneratePalette initialColorSpace conditional checks complete');

        return baseColor;
    } else {
        console.log('paletteGenColorSpaceConditionCheck() - customColor is either 1. not provided, 2. is not an object, or 3. has no value property. Assigning as an object with default values and properties');

        // Assign default values if customColor is not provided or is not an object
        baseColor = {
            format: initialColorSpace,
            value: customColor ||  generateRandomFirstColor(initialColorSpace)
        }

        console.log('paletteGenColorSpaceConditionCheck() - baseColor: ', baseColor, ' type: ', (typeof baseColor));
        console.log('paletteGenColorSpaceConditionCheck() - generatePalette initialColorSpace conditional checks complete. returning baseColor to generatePalette');
        console.log('paletteGenColorSpaceConditionCheck() complete; returning baseColor');
        return baseColor;
    }
};


// *DEV-NOTE* 1 - comment this; 2 - move to a better section for event handlers
function parameterAssignForGenerateButtonEventHandler() {
    console.log('parameterAssignForGenerateButtonEventHandler() executing');

    let paletteTypeOptions = document.getElementById('palette-type-options');
    let paletteNumberOptions = document.getElementById('palette-number-options');
    let numBoxes = parseInt(paletteNumberOptions.value, 10);
    let selectedPaletteTypeOptionValue = parseInt(paletteTypeOptions.value, 10);
    let limitGrayAndBlackCheckbox = document.getElementById('limitGrayAndBlackCheckbox');
    let limitLightCheckbox = document.getElementById('limitLightCheckbox');
    let limitGrayAndBlack = limitGrayAndBlackCheckbox.checked ? 1 : 0;
    let limitLight = limitLightCheckbox.checked ? 1 : 0;
    let initialColorSpace = document.getElementById('initial-colorspace-options').value || 'hsl' ;

    console.log('parameterAssignForGenerateButtonEventHandler() complete');
    return { 
        numBoxes,
        selectedPaletteTypeOptionValue,
        limitGrayAndBlack,
        limitLight,
        initialColorSpace
    }
};


export { randomInitialColor, generateSelectedPaletteType, paletteGenColorSpaceConditionCheck, parameterAssignForGenerateButtonEventHandler };