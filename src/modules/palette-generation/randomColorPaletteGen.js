// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { randomHex, randomRGB, randomHSL, randomHSV, randomCMYK, randomLab } from '../../utils/index.js';
import { generateAndStoreColorValues } from '../color-conversion/index.js';


// Generate Random Color Palette
function generateRandomColorPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null, initialColorSpace = 'hex') {
    console.log('executing generateRandomColorPalette');
    console.log(`numBoxes: ${numBoxes}, limitGrayAndBlack: ${limitGrayAndBlack}, customColor: ${customColor}, initialColorSpace: ${initialColorSpace}`);

    const colors = [];

    for (let i = 0; i < numBoxes; i++) {
        let color;

        if (i === 0 && customColor) {
            console.log('user-defined custom color: ', customColor);
            console.log('calling generateAndStoreColorValues');
            color = generateAndStoreColorValues(customColor, initialColorSpace = 'hex');
        } else {
            let baseColor;
            switch (initialColorSpace) {
                case 'hex':
                    console.log('calling randomHex');
                    baseColor = randomHex(limitGrayAndBlack, limitLight);
                    break;
                case 'rgb':
                    console.log('calling randomRGB');
                    baseColor = randomRGB(limitGrayAndBlack, limitLight);
                    break;
                case 'hsl':
                    console.log('calling randomHSL');
                    baseColor = randomHSL(limitGrayAndBlack, limitLight);
                    break;
                case 'hsv':
                    console.log('calling randomHSV');
                    baseColor = randomHSV(limitGrayAndBlack, limitLight);
                    break;
                case 'cmyk':
                    console.log('calling randomCMYK');
                    baseColor = randomCMYK(limitGrayAndBlack, limitLight);
                    break;
                case 'lab':
                    console.log('calling randomLab');
                    baseColor = randomLab(limitGrayAndBlack, limitLight);
                    break;
                default:
                    console.log('DEFAULT CASE - calling randomHSL');
                    baseColor = randomHSL(limitGrayAndBlack, limitLight);
            }

            console.log('initialColorSpace switch expression complete for generateRandomColorPalette');
            console.log(`Base Color Generated: ${JSON.stringify(baseColor)}`);
            color = generateAndStoreColorValues(baseColor, initialColorSpace = 'hex');
        }

        colors.push(color);
    }

    console.log('generated random color palette : ', colors);
    console.log('execution complete for generateRandomColorPalette');
    return colors;
}


export { generateRandomColorPalette };