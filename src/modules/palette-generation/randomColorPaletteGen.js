// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { randomHex, randomRGB, randomHSL, randomHSV, randomCMYK, randomLab } from '../../utils/index.js';


// Generate Random Color Palette
function generateRandomColorPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null, initialColorSpace) {
    const colors = [];

    for (let i = 0; i < numBoxes; i++) {
        let color;
        if (i === 0 && customColor) {
            color = generateAndStoreColorValues(customColor, initialColorSpace);
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
                    baseColor = randomHSL(limitGrayAndBlack, limitLight);
            }

            color = generateAndStoreColorValues(baseColor, initialColorSpace);
        }

        colors.push(color);
    }

    console.log('Generated Random Color Palette:', colors);
    return colors;
}


export { generateRandomColorPalette };