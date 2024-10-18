import {
    generateComplementaryPalette,
    generateDiadicPalette,
    generateHexadicPalette,
    generateMonochromaticPalette,
    generateRandomColorPalette,
    generateTetradicPalette,
    generateTriadicPalette
} from '../export';
import { genAnalogousPalette } from '../modules/palette-gen/analogous';
import { convert } from '../modules/color-convert/convert';

export function randomInitialColor(
    baseColor,
    initialColorSpace: string = 'hex',
    limitGrayAndBlack: boolean,
    limitLight: boolean
) {
    if (!baseColor || !baseColor.value) {
        if (!baseColor) {
            baseColor = {};
        }
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
                break;
        }
    }

    return baseColor;
};

export function generateSelectedPaletteType(
    paletteType: string,
    numBoxes: number,
    limitGrayAndBlack: boolean,
    limitLight: boolean,
    baseColor,
    customColor,
    initialColorSpace: string = 'hex'
) {
    switch (paletteType) {
        case 1:
            colors = generateRandomColorPalette(
                numBoxes,
                limitGrayAndBlack,
                limitLight,
                baseColor,
                customColor,
                initialColorSpace = 'hex'
            );
            
            return colors;
        case 2:
            colors = generateComplementaryPalette(
                numBoxes,
                limitGrayAndBlack,
                limitLight,
                baseColor,
                customColor,
                initialColorSpace = 'hex'
            );
            
            return colors;
        case 3:
            colors = generateTriadicPalette(
                numBoxes,
                limitGrayAndBlack,
                limitLight,
                baseColor,
                customColor,
                initialColorSpace = 'hex'
            );

            return colors;
        case 4:
            colors = generateTetradicPalette(
                numBoxes,
                limitGrayAndBlack,
                limitLight,
                baseColor,
                customColor,
                initialColorSpace = 'hex'
            );

            return colors;
        case 5:
            let colors = generateSplitComplementaryPalette(
                numBoxes,
                limitGrayAndBlack,
                limitLight,
                baseColor,
                customColor,
                initialColorSpace = 'hex'
            );

            return colors;
        case 6:
            let colors = generateAnalogousPalette(
                numBoxes,
                limitGrayAndBlack,
                limitLight,
                baseColor,
                customColor,
                initialColorSpace = 'hex'
            );

            return colors;
        case 7:
            let colors = generateHexadicPalette(
                numBoxes,
                limitGrayAndBlack,
                limitLight,
                baseColor,
                customColor,
                initialColorSpace = 'hex'
            );

            return colors;
        case 8:
            let colors = generateDiadicPalette(
                numBoxes,
                limitGrayAndBlack,
                limitLight,
                baseColor,
                customColor,
                initialColorSpace = 'hex'
            );

            return colors;
        case 9:
            let colors = generateMonochromaticPalette(
                numBoxes,
                limitGrayAndBlack,
                limitLight,
                baseColor,
                customColor,
                initialColorSpace = 'hex'
            );

            return colors;
        default:
            console.error('generateSelectedPaletteType() - DEFAULT CASE > unable to determine color scheme');
            break;
    }
};

export function parameterAssignForGenerateButtonEventHandler() {
    let paletteTypeOptions = document.getElementById('palette-type-options');
    let paletteNumberOptions = document.getElementById('palette-number-options');
    let numBoxes = parseInt(paletteNumberOptions.value, 10);
    let selectedPaletteTypeOptionValue = parseInt(paletteTypeOptions.value, 10);
    let limitGrayAndBlackCheckbox = document.getElementById('limitGrayAndBlackCheckbox');
    let limitLightCheckbox = document.getElementById('limitLightCheckbox');
    let limitGrayAndBlack = limitGrayAndBlackCheckbox.checked ? true : false;
    let limitLight = limitLightCheckbox.checked ? true : false;
    let initialColorSpace = document.getElementById('initial-colorspace-options').value || 'hsl' ;

    return { 
        numBoxes,
        selectedPaletteTypeOptionValue,
        limitGrayAndBlack,
        limitLight,
        initialColorSpace
    }
};
