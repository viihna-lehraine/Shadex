import {
    generateSelectedPaletteType,
    parameterAssignForGenerateButtonEventHandler
} from '../../helpers/palette-gen-helpers';
import { randomInitialColor } from '../../helpers/palette-gen-helpers';

export interface Color {
    hex?: string;
    hsl?: {
        hue: number;
        saturation: number;
        lightness: number;
    },
    hsv?: {
        hue: number;
        saturation: number;
        value: number;
    },
    rgb?: {
        red: number;
        green: number;
        blue: number;
    },
    cmyk?: {
        cyan: number;
        magenta: number;
        yellow: number;
        black: number;
    },
    lab?: {
        l: number;
        a: number;
        b: number;
    }
}

export function genPalette(
    paletteType: string,
    numBoxes: number,
    limitGrayAndBlack: boolean,
    limitLight: boolean,
    customColor: Color | string | null,
    initialColorSpace: string = 'hex'
) {
    let colors: Color = [];
    let baseColor: Color;

    // first, will check if customColor was provided, ensures it is in the form of an object. If not, will reformat customColor as an object
    // if customColor has no value, will instead assign it a default value while formatting it as an object
    randomInitialColor(baseColor, initialColorSpace = 'hex', limitGrayAndBlack, limitLight);

    genSelectedPaletteType(
        paletteType,
        numBoxes,
        limitGrayAndBlack,
        limitLight,
        baseColor,
        customColor,
        initialColorSpace = 'hex'
    );

    if (!colors) {
        console.warn('Unable to determine palette type; returning');
        return;
    }

    if (!colors || colors.length === 0) {
        console.error('colors array is empty or undefined');
    }

    genPaletteBox(colors, numBoxes);
};

// define default behavior for generateButton click event
export function handleGenButtonClick() {
    const {
        numBoxes,
        selectedPaletteTypeOptionValue,
        limitGrayAndBlack,
        limitLight,
        initialColorSpace
    } = parameterAssignForGenerateButtonEventHandler();

    genPalette(
        selectedPaletteTypeOptionValue,
        numBoxes,
        limitGrayAndBlack,
        limitLight,
        initialColorSpace
    );
};
