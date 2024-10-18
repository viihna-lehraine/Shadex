import { generateAndStoreColorValues, randomCMYK, randomHex, randomHSL, randomHSV, randomLab, randomRGB } from '../../export';

// generate random color palette
export function generateRandomColorPalette(numBoxes: number, limitGrayAndBlack: boolean, limitLight: boolean, customColor: unknown = null, initialColorSpace: string = 'hex') {
    const colors = [];

    for (let i = 0; i < numBoxes; i++) {
        let color;

        if (i === 0 && customColor) {
            if (!initialColorSpace) {
                console.log('generateRandomColorPalette() - initialColorSpace default value "hex" not found; manually declaring initialColorSpace to be "hex"');
                let initialColorSpace = 'hex';
            }
            
            color = generateAndStoreColorValues(customColor, initialColorSpace = 'hex');
        } else {
            let baseColor;

            switch (initialColorSpace) {
                case 'hex':
                    baseColor = randomHex(limitGrayAndBlack, limitLight);
                    break;
                case 'rgb':
                    baseColor = randomRGB(limitGrayAndBlack, limitLight);
                    break;
                case 'hsl':
                    baseColor = randomHSL(limitGrayAndBlack, limitLight);
                    break;
                case 'hsv':
                    baseColor = randomHSV(limitGrayAndBlack, limitLight);
                    break;
                case 'cmyk':

                    baseColor = randomCMYK(limitGrayAndBlack, limitLight);
                    break;
                case 'lab':
                    baseColor = randomLab(limitGrayAndBlack, limitLight);
                    break;
                default:
                    baseColor = randomHex(limitGrayAndBlack, limitLight);
                    break;
            }

            color = generateAndStoreColorValues(baseColor, initialColorSpace = 'hex');
        }

        colors.push(color);
    }
};
