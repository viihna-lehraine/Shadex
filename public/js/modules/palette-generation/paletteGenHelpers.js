// ColorGen - version 0.5.21-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



// Create random initial colors if user doesn't define a custom color
function randomInitialColor(baseColor, initialColorSpace = 'hex', limitGrayAndBlack, limitLight) {
    console.log('baseColor: ', baseColor, ' type: ', (typeof baseColor));

    if (!baseColor.value) {
        switch (initialColorSpace) {
            case 'hex':
                console.log('calling randomHex from within generatePalette');

                baseColor.value = randomHex(limitGrayAndBlack, limitLight);

                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));

                break;
            case 'rgb':
                console.log('calling randomRGB from within generatePalette');

                baseColor.value = randomRGB(limitGrayAndBlack, limitLight);

                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));

                break;
            case 'hsl':
                console.log('calling randomHSL from within generatePalette');

                baseColor.value = randomHSL(limitGrayAndBlack, limitLight);

                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));

                break;
            case 'hsv':
                console.log('calling randomHSV from within generatePalette');

                baseColor.value = randomHSV(limitGrayAndBlack, limitLight);

                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));

                break;
            case 'cmyk':
                console.log('calling randomCMYK from within generatePalette');

                baseColor.value = randomCMYK(limitGrayAndBlack, limitLight);

                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));

                break;
            case 'lab':
                console.log('calling randomLab from within generatePalette');

                baseColor.value = randomLab(limitGrayAndBlack, limitLight);

                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));

                break;
            default:
                console.log('DEFAULT CASE - calling randomHex from within generatePalette');

                baseColor.value = randomHex(limitGrayAndBlack, limitLight);

                console.log('baseColor.value: ', baseColor.value, ' type: ', (typeof baseColor.value));

                break;
        }

        console.log ('baseColor.value: ', baseColor.value);
    }
    console.log('generatePalette initialColorSpace switch expression complete');
    console.log('baseColor: ', baseColor);

    return baseColor;
};


// Generate user-selected palette type
function generateSelectedPaletteType(paletteType, numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex') {
    switch (paletteType) {
        case 1:
            console.log('calling generateRandomColorPalette');

            colors = generateRandomColorPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');

            console.log('colors: ', colors, ' data type: ', (typeof colors));

            return colors;
        case 2:
            console.log('calling generateComplementaryPalette');

            colors = generateComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');

            console.log('colors: ', colors, ' data type: ', (typeof colors));

            return colors;
        case 3:
            console.log('calling generateTriadicPalette');

            colors = generateTriadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');

            console.log('colors: ', colors, ' data type: ', (typeof colors));

            return colors;
        case 4:
            console.log('calling generateTetradicPalette');

            colors = generateTetradicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');

            console.log('colors: ', colors, ' data type: ', (typeof colors));

            return colors;
        case 5:
            console.log('calling generateSplitComplementaryPalette');

            colors = generateSplitComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');

            console.log('colors: ', colors, ' data type: ', (typeof colors));

            return colors;
        case 6:
            console.log('calling generatAnalogousPalette');

            colors = generateAnalogousPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');

            console.log('colors: ', colors, ' data type: ', (typeof colors));

            return colors;
        case 7:
            console.log('calling generateHexadicPalette');

            colors = generateHexadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');

            console.log('colors: ', colors, ' data type: ', (typeof colors));

            return colors;
        case 8:
            console.log('calling generateDiadicPalette');

            colors = generateDiadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');

            console.log('colors: ', colors, ' data type: ', (typeof colors));

            return colors;
        case 9:
            console.log('calling generateMonochromaticPalette');

            colors = generateMonochromaticPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');

            console.log('colors: ', colors, ' data type: ', (typeof colors));

            return colors;
        default:
            console.error('unable to determine color scheme');

            break;
    }
};


// First, will check if customColor was provided, ensures it is in the form of an object. If not, will reformat customColor as an object
// If customColor has no value, will instead assign it a default value while formatting it as an object
function paletteGenColorSpaceConditionCheck(customColor) {
    // Ensures customColor is an object. If not, reformats as an object
    if (customColor && typeof customColor === 'object' && customColor.value) {
        console.log('customColor: ', ' type: ', (typeof customcolor));
        console.log('customColor already exists as an object with an assigned value; assigning customColor value and properties to baseColor');

        baseColor = customColor;

        if (!baseColor) {
            console.error('ERROR: baseColor default assignment failed. generatePalette function execution will continue');
        }

        if (typeof baseColor !== 'object') {
            console.error('ERROR: Failed to format baseColor as an object. generatePalette function execution will continue');
        }

        console.log('baseColor: ', ' type: ', (typeof baseColor));
        console.log('generatePalette initialColorSpace conditional checks complete');

        return baseColor;
    } else {
        console.log('customColor is either 1. not provided, 2. is not an object, or 3. has no value property. Assigning as an object with default values and properties');

        // Assign default values if customColor is not provided or is not an object
        baseColor = {
            format: initialColorSpace,
            value: customColor
        };

        console.log('baseColor: ', ' type: ', (typeof baseColor));
        console.log('generatePalette initialColorSpace conditional checks complete. returning baseColor to generatePalette');

        return baseColor;
    }
};


// *DEV-NOTE* 1 - comment this; 2 - move to a better section for event handlers
function parameterAssignForGenerateButtonEventHandler() {
    let paletteTypeOptions = document.getElementById('palette-type-options');
    let paletteNumberOptions = document.getElementById('palette-number-options');
    let numBoxes = parseInt(paletteNumberOptions.value, 10);
    let selectedPaletteTypeOptionValue = parseInt(paletteTypeOptions.value, 10);
    let limitGrayAndBlackCheckbox = document.getElementById('limitGrayAndBlackCheckbox');
    let limitLightCheckbox = document.getElementById('limitLightCheckbox');
    let limitGrayAndBlack = limitGrayAndBlackCheckbox.checked ? 1 : 0;
    let limitLight = limitLightCheckbox.checked ? 1 : 0;
    let initialColorSpace = document.getElementById('initial-colorspace-options').value || 'hsl' ;

    return { 
        numBoxes,
        selectedPaletteTypeOptionValue,
        limitGrayAndBlack,
        limitLight,
        initialColorSpace
    }
};


export { randomInitialColor, generateSelectedPaletteType, paletteGenColorSpaceConditionCheck, parameterAssignForGenerateButtonEventHandler };