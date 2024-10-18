import { genAndStoreColorValues } from '../color-convert/convert';
import { populateColorTextOutputBox } from '../dom/main';
import {
    randomCMYK,
    randomHex,
    randomHSL,
    randomHSV,
    randomLAB,
    randomRGB,
    randomSL
} from '../../utils/random';

function genHexadicHues(color) {
    const hexadicHues = [];
    const baseHue = color.hue;
    const hue1 = baseHue;
    const hue2 = (hue1 + 180) % 360;
    const randomDistance = Math.floor(Math.random() * 71 + 10);
    const hue3 = (hue1 + randomDistance) % 360;
    const hue4 = (hue3 + 180) % 360;
    const hue5 = (hue1 + 360 - randomDistance) % 360;
    const hue6 = (hue5 + 180) % 360;

    hexadicHues.push(hue1, hue2, hue3, hue4, hue5, hue6);

    return hexadicHues;
};

export function genHexadicPalette(
    numBoxes: number,
    limitGrayAndBlack: boolean,
    limitLight: boolean,
    customColor: unknown = null,
    initialColorSpace: unknown = 'hex'
) {
    if (numBoxes < 6) {
        window.alert('To generate a hexadic palette, please select a number of swatches greater than 5');

        return [];
    }

    // generate the base color using the initial color space
    if (customColor !== null && customColor !== undefined) {
        baseColor = genAndStoreColorValues(
            customColor,
            initialColorSpace = 'hex'
        );
    } else {
        switch (initialColorSpace) {
            case 'hex':
                baseColor = genAndStoreColorValues(
                    randomHex(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace = 'hex'
                );
                break;
            case 'rgb':            
                baseColor = genAndStoreColorValues(
                    randomRGB(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace = 'hex'
                );
                break;
            case 'hsl':
                baseColor = genAndStoreColorValues(
                    randomHSL(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace = 'hex'
                );
                break;
            case 'hsv':
                baseColor = genAndStoreColorValues(
                    randomHSV(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace = 'hex'
                );
                break;
            case 'cmyk':
                baseColor = genAndStoreColorValues(
                    randomCMYK(
                        limitGrayAndBlack,
                        limitLight
                    ),
                    initialColorSpace = 'hex'
                );
                break;
            case 'lab':
                baseColor = genAndStoreColorValues(
                    randomLAB(
                        limitGrayAndBlack,
                        limitLight
                    ), initialColorSpace = 'hex'
                );
                break;
            default:
                baseColor = genAndStoreColorValues(
                    randomHSL(
                        limitGrayAndBlack,
                        limitLight),
                        initialColorSpace = 'hex'
                    );
        }
    }

    const hexadicHues = genHexadicHues(baseColor.hue);

    for (let i = 0; i < numBoxes; i++) {
        const hue = hexadicHues[i % 6]; // cycle through the hexadic hues
        let { saturation, lightness } = randomSL(limitGrayAndBlack, limitLight);

        if (limitGrayAndBlack) {
            ({ saturation, lightness } = applyLimitGrayAndBlack(saturation, lightness));
        }

        if (limitLight) {
            lightness = applyLimitLight(lightness);
        }

        const hexadicColor = genAndStoreColorValues(
            { hue, saturation, lightness },
            'hsl'
        );

        colors.push(hexadicColor);

        const colorBox = document.getElementById(`color-box-${i + 1}`);

        if (colorBox) {
            colorBox.style.backgroundColor = hexadicColor.hsl;

            populateColorTextOutputBox(hexadicColor, i + 1);
        }
    }

    return colors;
};
