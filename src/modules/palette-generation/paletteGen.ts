import { generatePaletteBox, generatePaletteExitLogs, generateSelectedPaletteType, paletteGenColorSpaceConditionCheck,randomInitialColor } from '../../export';

export function generatePalette(paletteType: string, numBoxes: number, limitGrayAndBlack: boolean, limitLight: boolean, customColor: string, initialColorSpace: string = 'hex') {
    let colors = [];
    // let baseColor;

    // first, will check if customColor was provided, ensures it is in the form of an object. If not, will reformat customColor as an object
    // if customColor has no value, will instead assign it a default value while formatting it as an object

    // generate user-selected palette type
    if (!colors) {
        console.error('generatePalette() - ERROR - Unable to determine palette type');
        return;
    }

    // if colors array is malformed
    if (!colors || colors.length === 0) {
        console.error('generatePalette() - colors array is empty or undefined');
    }

    generatePaletteExitLogs(colors, numBoxes);
};


// *DEV-NOTE* What the fuck is this function actually doing anymore???
// define default behavior for generateButton click event
export function handleGenerateButtonClick() {
    const {
        numBoxes,
        selectedPaletteTypeOptionValue,
        limitGrayAndBlack,
        limitLight,
        initialColorSpace
    } = parameterAssignForGenerateButtonEventHandler();

    generatePalette(selectedPaletteTypeOptionValue, numBoxes, limitGrayAndBlack, limitLight, initialColorSpace);
};
