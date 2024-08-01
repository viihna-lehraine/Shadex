// ColorGen - version 0.5.2-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



import { populateColorTextOutputBox} from './index.js';
import { generateAndStoreColorValues, adjustSaturationAndLightness } from '../color-conversion/index.js';
import { randomHex, randomRGB, randomHSL, randomHSV, randomCMYK, randomLab } from '../../utils/index.js';


// Generate complementary palette
function generateComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor = null, initialColorSpace = 'hex') {

    console.log('generateComplementaryPalette() execution starting');

    let generateComplementaryPaletteParameters = [ numBoxes, limitGrayAndBlack, limitLight, baseColor, initialColorSpace ];
    console.log(generateComplementaryPaletteParameters);

    if (numBoxes < 2) {
        window.alert('To generate a complementary palette, please select a number of swatches greater than 1');
        return;
    }
    const colors = [];
    let color;

    // Generate the base color using the initial color space
    if (baseColor !== null && baseColor !== undefined) {
        color = generateAndStoreColorValues(baseColor, initialColorSpace);
    } else {
        switch (initialColorSpace) {
            case 'hex':
                console.log('calling generateAndStoreColorValues(randomHex()');
                color = generateAndStoreColorValues(randomHex(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'rgb':
                console.log('calling generateAndStoreColorValues(randomRGB()');
                color = generateAndStoreColorValues(randomRGB(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'hsl':
                console.log('calling generateAndStoreColorValues(randomHSL()');
                color = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'hsv':
                console.log('calling generateAndStoreColorValues(randomHSV()');
                color = generateAndStoreColorValues(randomHSV(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'cmyk':
                console.log('calling generateAndStoreColorValues(randomCMYK()');
                color = generateAndStoreColorValues(randomCMYK(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'lab':
                console.log('calling generateAndStoreColorValues(randomLab()');
                color = generateAndStoreColorValues(randomLab(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            default:
                // needs adjustment
                console.log('calling generateAndStoreColorValues(randomHSL()');
                color = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace);
        }

        console.log('1st initialColorSpace switch expression for generateComplementaryPalette complete');
    }

    const complementaryHue = (color.hsl.hue + 180) % 360;
    colors.push(color);

    for (let i = 2; i <= numBoxes; i++) {

        console.log('calling adjustSaturationAndLightness()');
        let complementarySatAndLightness = adjustSaturationAndLightness({
            hue: complementaryHue,
            saturation: color.hsl.saturation,
            lightness: color.hsl.lightness,
        }, 'hsl', limitGrayAndBlack, limitLight);
        console.log(complementarySatAndLightness);


        console.log('calling generateAndStoreColorValues()');
        let complementaryColor = generateAndStoreColorValues(complementarySatAndLightness, 'hsl');
        colors.push(complementaryColor);

        let colorBox = document.getElementById(`color-box-${i}`);

        if (colorBox) {
            let colorString;
            switch (initialColorSpace) {
                case 'hex':
                    colorString = complementaryColor.hex;
                    break;
                case 'rgb':
                    colorString = complementaryColor.rgb;
                    break;
                case 'hsl':
                    colorString = complementaryColor.hsl;
                    break;
                case 'hsv':
                    colorString = complementaryColor.hsv;
                    break;
                case 'cmyk':
                    colorString = complementaryColor.cmyk;
                    break;
                case 'lab':
                    colorString = complementaryColor.lab;
                    break;
                default:
                    colorString = complementaryColor.hsl;
            }
            console.log('2nd initialColorSpace switch expression for generateComplementaryPalette complete');
            colorBox.style.backgroundColor = colorString;
            console.log('calling populateColorTextOutputBox(complementaryColor, i)');
            populateColorTextOutputBox(complementaryColor, i);
        }
    }

    console.log('generateComplementaryPalette() execution complete');
    return colors;
}


export { generateComplementaryPalette };