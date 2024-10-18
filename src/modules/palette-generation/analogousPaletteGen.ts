import { generateAndStoreColorValues, randomCMYK, randomHex, randomHSL, randomHSV, randomLab, randomRGB, randomSL } from '../../export';

export function generateAnalogousHues(color, numBoxes: number) {
    const analogousHues = [];
    const baseHue = color.hue;
    const maxTotalDistance = 60;
    const minTotalDistance = 10 + (numBoxes - 2) * 9;
    const totalIncrement = Math.floor(Math.random() * (maxTotalDistance - minTotalDistance + 1)) + minTotalDistance;
    const increment = Math.floor(totalIncrement / (numBoxes - 1));

    for (let i = 1; i < numBoxes; i++) {
        analogousHues.push((baseHue + increment * i) % 360);
    }

    return analogousHues;
};

export function generateAnalogousPalette(numBoxes: number, limitGrayAndBlack: boolean, limitLight: boolean, customColor: unknown = null, initialColorSpace: string = 'hex') {
    if (numBoxes < 2) {
        window.alert('To generate an analogous palette, please select a number of swatches greater than 1');
        return;
    }
    const colors = [];
    let color;

    // generate the base color using the initial color space
    if (customColor !== null && customColor !== undefined) {
        color = generateAndStoreColorValues(customColor, initialColorSpace = 'hex');
    } else {
        switch (initialColorSpace) {
            case 'hex':
                color = generateAndStoreColorValues(randomHex(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'rgb':
                color = generateAndStoreColorValues(randomRGB(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'hsl':
                color = generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'hsv':
                color = generateAndStoreColorValues(randomHSV(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'cmyk':
                color = generateAndStoreColorValues(randomCMYK(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            case 'lab':
                color = generateAndStoreColorValues(randomLab(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
                break;
            default:
                color: generateAndStoreColorValues(randomHSL(limitGrayAndBlack, limitLight), initialColorSpace = 'hex');
        }
    }

    const analogousHues = generateAnalogousHues(color, numBoxes);
    colors.push(color);

    for (let i = 0; i < analogousHues.length; i++) {
        let analogousHue = analogousHues[i];
        let analogousSatAndLightness = randomSL(limitGrayAndBlack, limitLight);
        let analogousColor = generateAndStoreColorValues({
            hue: analogousHue,
            saturation: analogousSatAndLightness.saturation,
            lightness: analogousSatAndLightness.lightness
        }, 'hsl');

        colors.push(analogousColor);

        let colorBox = document.getElementById(`color-box-${i + 2}`);

        if (colorBox) {
            let colorString;
            switch (initialColorSpace) {
                case 'hex':
                    colorString = analogousHue.hex;
                    break;
                case 'rgb':
                    colorString = analogousColor.rgb;
                    break;
                case 'hsl':
                    colorString = analogousColor.hsl;
                    break;
                case 'hsv':
                    colorString = analogousColor.hsv;
                    break;
                case 'cmyk':
                    colorString = analogousColor.cmyk;
                    break;
                case 'lab':
                    colorString = analogousColor.lab;
                    break;
                default:
                    colorString = analogousColor.hex;
            }

            colorBox.style.backgroundColor = colorString;
        }
    }
    return colors;
};
