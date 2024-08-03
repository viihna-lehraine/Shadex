// ColorGen - version 0.5.21-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { generateAndStoreColorValues, randomCMYK, randomHex, randomHSL, randomHSV, randomLab, randomRGB } from '../../export.js';


// Generate Random Color Palette
function generateRandomColorPalette(numBoxes, limitGrayAndBlack, limitLight, customColor = null, initialColorSpace = 'hex') {
    console.log('generateRandomColorPalette() executing');
    console.log(`generateRandomColorPalette() - numBoxes: ${numBoxes}, limitGrayAndBlack: ${limitGrayAndBlack}, customColor: ${customColor}, initialColorSpace: ${initialColorSpace}`);

    const colors = [];

    for (let i = 0; i < numBoxes; i++) {
        let color;

        if (i === 0 && customColor) {
            console.log('generateRandomColorPalette() - user-defined custom color: ', customColor);
            console.log('generateRandomColorPalette() - calling generateAndStoreColorValues');

            if (!initialColorSpace) {
                console.log('generateRandomColorPalette() - initialColorSpace default value "hex" not found; manually declaring initialColorSpace to be "hex"');
                let initialColorSpace = 'hex';
            }
            
            color = generateAndStoreColorValues(customColor, initialColorSpace = 'hex');
        } else {
            let baseColor;

            switch (initialColorSpace) {
                case 'hex':
                    console.log('generateRandomColorPalette() - CASE hex > calling randomHex');
                    baseColor = randomHex(limitGrayAndBlack, limitLight);
                    console.log('generateRandomColorPalette() - baseColor: ', baseColor, ' type: ', (typeof baseColor));
                    break;
                case 'rgb':
                    console.log('generateRandomColorPalette() - CASE rgb > calling randomRGB');
                    baseColor = randomRGB(limitGrayAndBlack, limitLight);
                    console.log('generateRandomColorPalette() - baseColor: ', baseColor, ' type: ', (typeof baseColor));
                    break;
                case 'hsl':
                    console.log('generateRandomColorPalette() - CASE hsl > calling randomHSL');
                    baseColor = randomHSL(limitGrayAndBlack, limitLight);
                    console.log('generateRandomColorPalette() - baseColor: ', baseColor, ' type: ', (typeof baseColor));
                    break;
                case 'hsv':
                    console.log('generateRandomColorPalette() - CASE hsv > calling randomHSV');
                    baseColor = randomHSV(limitGrayAndBlack, limitLight);
                    console.log('generateRandomColorPalette() - baseColor: ', baseColor, ' type: ', (typeof baseColor));
                    break;
                case 'cmyk':
                    console.log('generateRandomColorPalette() - CASE cmyk > calling randomCMYK');
                    baseColor = randomCMYK(limitGrayAndBlack, limitLight);
                    console.log('generateRandomColorPalette() - baseColor: ', baseColor, ' type: ', (typeof baseColor));
                    break;
                case 'lab':
                    console.log('generateRandomColorPalette() - CASE lab > calling randomLab');
                    baseColor = randomLab(limitGrayAndBlack, limitLight);
                    console.log('generateRandomColorPalette() - baseColor: ', baseColor, ' type: ', (typeof baseColor));
                    break;
                default:
                    console.log('generateRandomColorPalette() - DEFAULT CASE > calling randomHSL');
                    baseColor = randomHSL(limitGrayAndBlack, limitLight);
                    console.log('generateRandomColorPalette() - baseColor: ', baseColor, ' type: ', (typeof baseColor));
                    break;
            }

            console.log('generateRandomColorPalette() - initialColorSpace switch expression complete for generateRandomColorPalette()');
            console.log(`generateRandomColorPalette() - base color generated: ${JSON.stringify(baseColor)}`);
            console.log('generateRandomColorPalette() - generateAndStoreColorValues()');
            color = generateAndStoreColorValues(baseColor, initialColorSpace = 'hex');
        }

        console.log('generateRandomColorPalette() - color: ', color, ' type: ', (typeof color));
        colors.push(color);
        console.log('generateRandomColorPalette() - colors: ', colors, ' type: ', (typeof colors));
    }

    console.log('generateRandomColorPalette() - generated random color palette : ', colors, ' type: ', (typeof colors));
    console.log('generateRandomColorPalette() complete');
    return colors;
};


export { generateRandomColorPalette };