import { generateAndStoreColorValues, populateColorTextOutputBox, randomHSL, randomSL } from '../../export';

export function generateMonochromaticPalette(numBoxes: number, limitGrayAndBlack: boolean, limitLight: boolean, customColor: unknown = null, initialColorSpace: string = 'hex') {
    if (numBoxes < 2) {
        window.alert('To generate a monochromatic palette, please select a number of swatches greater than 1');

        return [];
    }

    const colors = [];
    let baseColor;

    // generate the base color using the initial color space
    if (customColor !== null && customColor !== undefined) {
        baseColor = generateAndStoreColorValues(customColor, initialColorSpace = 'hex');
    } else {
        switch (initialColorSpace) {
            case 'hex':
                baseColor = generateAndStoreColorValues(randomHex(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'rgb':
                baseColor = generateAndStoreColorValues(randomRGB(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'hsl':
                baseColor = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'hsv':
                baseColor = generateAndStoreColorValues(randomHSV(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'cmyk':
                baseColor = generateAndStoreColorValues(randomCMYK(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'lab':
                baseColor = generateAndStoreColorValues(randomLab(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            default:
                baseColor = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
        }
    }

    for (let i = 0; i < numBoxes; i++) {
        const slValues = randomSL(limitGrayAndBlack, limitLight);
        const monoColor = generateAndStoreColorValues({
            hue: baseColor.hue, // use the hue from the base color
            saturation: slValues.saturation,
            lightness: slValues.lightness
        }, 'hsl');

        colors.push(monoColor);

        const colorBox = document.getElementById(`color-box-${i + 1}`);

        if (colorBox) {
            colorBox.style.backgroundColor = monoColor.hsl;

            populateColorTextOutputBox(monoColor, (i + 1));
        }
    }

    return colors;
};
