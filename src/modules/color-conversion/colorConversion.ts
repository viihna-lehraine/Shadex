import { applyLimitGrayAndBlack, applyLimitLight, formatHslForInitialColorValueGen, formatHslColorPropertiesAsNumbers, globalColorSpaceFormatting, initialHslColorGeneration } from '../../export';

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
        console.log('execution of convertColors complete');
    })
};


// generate values for all 6 color spaces for all swatches when a palette is generated, stores as an object (I think?)
export function generateAndStoreColorValues(color, initialColorSpace = 'hex') {    
    let colorValues = {};
    let hslColor;

    const hexValue = (typeof color.value === 'object' && color.value.value) ? color.value.value : color.value; // ensure hex value is properly extracted

    color.format = initialColorSpace;

    initialHslColorGeneration(color, hexValue);
    formatHslForInitialColorValueGen(hue, saturation, lightness);
    formatHslColorPropertiesAsNumbers(hslColor);

    const formattedHslColor = {
        hue: hslColor.hue,
        saturation: `${hslColor.saturation}%`,
        lightness: `${hslColor.lightness}%`
    }

    globalColorSpaceFormatting(initialColorSpace = 'hex', hexValue, formattedHslColor, colorValues, hslColor);
};


export function adjustSaturationAndLightness(color: number, limitGrayAndBlack: boolean, limitLight: boolean, initialColorSpace: string = 'hex') {
    let hslColor;

    switch (initialColorSpace) {
        case 'hex':
            hslColor = hexToHSL(color);
            break;
        case 'rgb':
            hslColor = rgbToHSL(color.red, color.green, color.blue);
            break;
        case 'hsl':
            hslColor = color;
            break;
        case 'hsv':
            hslColor = hsvToHSL(color.hue, color.saturation, color.value);
            break;
        case 'cmyk':
            hslColor = cmykToHSL(color.cyan, color.magenta, color.yellow, color.black);
            break;
        case 'lab':
            hslColor = labToHSL(color.l, color.a, color.b);
            break;
        default:
            hslColor = hexToHSL(color);
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
