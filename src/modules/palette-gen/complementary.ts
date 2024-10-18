import { adjustSL, genAndStoreColorValues } from '../color-convert/convert';
import { populateColorTextOutputBox } from '../dom/main';
import { randomCMYK, randomHex, randomHSL, randomHSV, randomLAB, randomRGB } from '../../utils/random';
import { adjust}

export function genComplementaryPalette(numBoxes: number, limitGrayAndBlack: boolean, limitLight: boolean, baseColor: unknown = null, initialColorSpace: string = 'hex') {
    if (numBoxes < 2) {
        window.alert('To generate a complementary palette, please select a number of swatches greater than 1');

        return;
    }

    const colors = [];
    let color;

    // generate the base color using the initial color space
    if (baseColor !== null && baseColor !== undefined) {
        color = genAndStoreColorValues(baseColor, initialColorSpace);
    } else {
        switch (initialColorSpace) {
            case 'hex':
                color = genAndStoreColorValues(
                    randomHex(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace
                );
                break;
            case 'rgb':
                color = genAndStoreColorValues(
                    randomRGB(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace
                );
                break;
            case 'hsl':
                color = genAndStoreColorValues(
                    randomHSL(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace
                );
                break;
            case 'hsv':
                color = genAndStoreColorValues(
                    randomHSV(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace
                );
                break;
            case 'cmyk':
                color = genAndStoreColorValues(
                    randomCMYK(
                        limitGrayAndBlack,
                        limitLight
                    ), initialColorSpace
                );
                break;
            case 'lab':
                color = genAndStoreColorValues(
                    randomLAB(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace
                );
                break;
            default:
                color = genAndStoreColorValues(
                    randomHSL(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace
                );
        }
    }

    const complementaryHue = (color.hsl.hue + 180) % 360;

    colors.push(color);

    for (let i = 2; i <= numBoxes; i++) {
        let complementarySatAndLightness =
            adjustSL({
                hue: complementaryHue,
                saturation: color.hsl.saturation,
                lightness: color.hsl.lightness,
            },
            'hsl',
            limitGrayAndBlack,
            limitLight
        );
        let complementaryColor = genAndStoreColorValues(complementarySatAndLightness, 'hsl');

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
};
