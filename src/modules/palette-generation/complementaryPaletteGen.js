// ColorGen - version 0.5.1
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@voidfucker.com / viihna.78 (Signal) / Lost-Possum (Github))

// BEGIN CODE



import { populateColorTextOutputBox} from './index.js';
import { generateAndStoreColorValues, adjustSaturationAndLightness } from '../color-conversion/index.js';
import { randomHex, randomRGB, randomHSL, randomHSV, randomCMYK, randomLab } from '../../utils/index.js';


// Generate complementary palette
function generateComplementaryPalette(numBoxes, limitGrayAndBlack, limitLight, baseColor = null, initialColorSpace) {
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
                color = generateAndStoreColorValues(randomHex(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'rgb':
                color = generateAndStoreColorValues(randomRGB(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'hsl':
                color = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'hsv':
                color = generateAndStoreColorValues(randomHSV(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'cmyk':
                color = generateAndStoreColorValues(randomCMYK(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            case 'lab':
                color = generateAndStoreColorValues(randomLab(limitGrayAndBlack, limitLight), initialColorSpace);
                break;
            default:
                color = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace);
        }
    }

    const complementaryHue = (color.hsl.hue + 180) % 360;
    colors.push(color);

    for (let i = 2; i <= numBoxes; i++) {
        let complementarySatAndLightness = adjustSaturationAndLightness({
            hue: complementaryHue,
            saturation: color.hsl.saturation,
            lightness: color.hsl.lightness,
        }, 'hsl', limitGrayAndBlack, limitLight);

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
            colorBox.style.backgroundColor = colorString;
            populateColorTextOutputBox(complementaryColor, i);
        }
    }
    return colors;
}


export { generateComplementaryPalette };