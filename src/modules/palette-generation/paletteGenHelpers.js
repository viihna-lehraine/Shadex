// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



// Create random initial colors if user doesn't define a custom color
function randomInitialColor(baseColor, initialColorSpace = 'hex', limitGrayAndBlack, limitLight) {
    if (!baseColor.value) {
        switch (initialColorSpace) {
            case 'hex':
                baseColor.value = randomHex(limitGrayAndBlack, limitLight);
                break;
            case 'rgb':
                baseColor.value = randomRGB(limitGrayAndBlack, limitLight);
                break;
            case 'hsl':
                baseColor.value = randomHSL(limitGrayAndBlack, limitLight);
                break;
            case 'hsv':
                baseColor.value = randomHSV(limitGrayAndBlack, limitLight);
                break;
            case 'cmyk':
                baseColor.value = randomCMYK(limitGrayAndBlack, limitLight);
                break;
            case 'lab':
                baseColor.value = randomLab(limitGrayAndBlack, limitLight);
                break;
            default:
                baseColor.value = randomHex(limitGrayAndBlack, limitLight);
        }
    }

    return baseColor;
};


// Create random initial colors if user doesn't define a custom color, with logs
function randomInitialColorWithLogs(baseColor, initialColorSpace = 'hex', limitGrayAndBlack, limitLight) {
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
            colors = generateRandomColorPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            return colors;
            break;
        case 2:
            colors = generateComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            return colors;
            break;
        case 3:
            colors = generateTriadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            return colors;
            break;
        case 4:
            colors = generateTetradicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            return colors;
            break;
        case 5:
            colors = generateSplitComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            return colors;
            break;
        case 6:
            colors = generateAnalogousPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            return colors;
            break;
        case 7:
            colors = generateHexadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            return colors;
            break;
        case 8:
            colors = generateDiadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            return colors;
            break;
        case 9:
            colors = generateMonochromaticPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            return colors;
            break;
        default:
            console.error('unable to determine color scheme');
            break;
    }
};


// Generate user-selected palette type, with logs
function generateSelectedPaletteTypeWithLogs(paletteType, numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex') {
    switch (paletteType) {
        case 1:
            console.log('calling generateRandomColorPalette');
            colors = generateRandomColorPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            return colors;
            break;
        case 2:
            console.log('calling generateComplementaryPalette');
            colors = generateComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            return colors;
            break;
        case 3:
            console.log('calling generateTriadicPalette');
            colors = generateTriadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            return colors;
            break;
        case 4:
            console.log('calling generateTetradicPalette');
            colors = generateTetradicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            return colors;
            break;
        case 5:
            console.log('calling generateSplitComplementaryPalette');
            colors = generateSplitComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            return colors;
            break;
        case 6:
            console.log('calling generatAnalogousPalette');
            colors = generateAnalogousPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            return colors;
            break;
        case 7:
            console.log('calling generateHexadicPalette');
            colors = generateHexadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            return colors;
            break;
        case 8:
            console.log('calling generateDiadicPalette');
            colors = generateDiadicPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            return colors;
            break;
        case 9:
            console.log('calling generateMonochromaticPalette');
            colors = generateMonochromaticPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor, customColor, initialColorSpace = 'hex');
            console.log('colors: ', colors, ' data type: ', (typeof colors));
            return colors;
            break;
        default:
            console.error('unable to determine color scheme');
            break;
    };

    console.log('paletteType switch expression complete for generatePalette function');
};


export { randomInitialColor, generateSelectedPaletteType };
export { randomInitialColorWithLogs, generateSelectedPaletteTypeWithLogs };