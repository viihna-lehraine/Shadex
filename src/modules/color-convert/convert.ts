import { isHSLTooGray, isHSLTooDark, isHSLTooBright } from '../dom/UI-params';
import {
    formatHSLColorPropertiesAsNumbers,
    globalColorSpaceFormatting,
    initialHSLColorGeneration
} from '../../helpers/conversion-helpers';
import { convert } from '../color-convert/conversion-index';

// when a conversion button is clicked, this will pull the color space type for that color and repopulate color-text-output-box with it
// previous conversion function actually tried to convert them again. But conversion takes place with palette generation and are stored as an oject
export function convertColors(targetFormat) {
    const colorTextOutputBoxes = document.querySelectorAll('.color-text-output-box');

    colorTextOutputBoxes.forEach(box => {
        const colorValues = box.colorValues;
        const convert = conversionMap[box.getAttribute('data-format')][targetFormat];
        const newColor = convert(colorValues);

        if (!newColor) {
            console.error(`Conversion to ${targetFormat} is not supported.`);
            return;
        }

        box.value = newColor;
        box.setAttribute('data-format', targetFormat);
    })
};

// generate values for all 6 color spaces for all swatches when a palette is generated, stores as an object (I think?)
export function genAndStoreColorValues(color, initialColorSpace = 'hex') {    
    let colorValues = {};
    let hslColor;

    const hexValue = (typeof color.value === 'object' && color.value.value) ? color.value.value : color.value; // ensure hex value is properly extracted

    color.format = initialColorSpace;

    hslColor = initialHslColorGeneration(color, hexValue);
    formatHslForInitialColorValueGen(hslColor.hue, hslColor.saturation, hslColor.lightness);
    formatHslColorPropertiesAsNumbers(hslColor);

    const formattedHslColor = {
        hue: hslColor.hue,
        saturation: `${hslColor.saturation}%`,
        lightness: `${hslColor.lightness}%`
    }

    globalColorSpaceFormatting(initialColorSpace = 'hex', hexValue, formattedHslColor, colorValues, hslColor);
};


export function adjustSL(
    color: number | string,
    limitGrayAndBlack: boolean,
    limitLight: boolean,
    initialColorSpace: string = 'hex'
) {
    let hslColor;

    if (typeof color === 'number') {
        color = color.toString(16); // *DEV-NOTE** check this
    } 

    switch (initialColorSpace) {
        case 'hex':
            hslColor = convert.hexToHSL(color);
            break;
        case 'rgb':
            hslColor = convert.rgbToHSL(color);
            break;
        case 'hsl':
            hslColor = color;
            break;
        case 'hsv':
            hslColor = convert.hsvToHSL(color);
            break;
        case 'cmyk':
            hslColor = convert.cmykToHSL(color);
            break;
        case 'lab':
            hslColor = convert.labToHSL(color);
            break;
        default:
            hslColor = convert.hexToHSL(color);
            break;
    }

    if (limitGrayAndBlack) {
        ({ saturation: hslColor.saturation, lightness: hslColor.lightness } = applyLimitGrayAndBlack(hslColor.saturation, hslColor.lightness));
    }

    if (limitLight) {
        hslColor.lightness = applyLimitLight(hslColor.lightness);
    }

    return hslColor;
};
