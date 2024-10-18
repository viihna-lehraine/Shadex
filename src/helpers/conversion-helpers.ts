import { convert } from '../modules/color-convert/conversion-index';
import { ColorObject, ColorValues } from '../types/interfaces';
import { CMYK, HSL, HSV, LAB, RGB } from '../types/types';

export function declareConversionMap() {
    const conversionMap = {
        hsl: {
            rgb: convert.hslToRGB,
            hex: convert.hslToHex,
            hsv: convert.hslToHSV,
            cmyk: convert.hslToCMYK,
            lab: convert.hslToLAB
        },
        rgb: {
            hsl: convert.rgbToHSL,
            hex: convert.rgbToHex,
            hsv: convert.rgbToHSV,
            cmyk: convert.rgbToCMYK,
            lab: convert.rgbToLAB
        },
        hex: {
            rgb: convert.hexToRGB,
            hsl: convert.hexToHSL,
            hsv: convert.hexToHSV,
            cmyk: convert.hexToCMYK,
            lab: convert.hexToLAB
        },
        hsv: {
            rgb: convert.hsvToRGB,
            hsl: convert.hsvToHSL,
            hex: convert.hsvToHex,
            cmyk: convert.hsvToCMYK,
            lab: convert.hsvToLAB
        },
        cmyk: {
            rgb: convert.cmykToRGB,
            hex: convert.cmykToHex,
            hsl: convert.cmykToHSL,
            hsv: convert.cmykToHSV,
            lab: convert.cmykToLAB
        },
        lab: {
            rgb: convert.labToRGB,
            hex: convert.labToHex,
            hsl: convert.labToHSL,
            hsv: convert.labToHSV,
            cmyk: convert.labToCMYK
        }
    }

    return conversionMap;
}

export function initialHSLColorGen(
    color: ColorObject<HSL | RGB | HSV | CMYK | LAB | string>, 
    hexValue: string
): HSL | undefined {
    switch (color.format) {
        case 'hex': 
            return convert.hexToHSL(hexValue);
        case 'rgb': 
            return convert.rgbToHSL(color.value as RGB);
        case 'hsl': 
            return color.value as HSL;
        case 'hsv': 
            return convert.hsvToHSL(color.value as HSV);
        case 'cmyk': 
            return convert.cmykToHSL(color.value as CMYK);
        case 'lab': 
            return convert.labToHSL(color.value as LAB);
        default: 
            return undefined;
    }
}

// restructures h, s, and l values into the hsl object
export function formatHSLForInitColorGen(
    hue: number,
    saturation: number,
    lightness: number
): HSL {
    return { hue, saturation, lightness };
}

/*
export function typeHSLPropsAsNumbers(hslColor: HSL) {
    hslColor.hue = Number(hslColor.hue);
    hslColor.saturation = Number(hslColor.saturation);
    hslColor.lightness = Number(hslColor.lightness);

    if (typeof hslColor.hue !== 'number' || typeof hslColor.saturation !== 'number' || typeof hslColor.lightness !== 'number') {

        return;
    }

    return hslColorAsNumbers;
}
*/

export function initColorValuesGenCaseHex(
    hexValue: string,
    formattedHslColor: HSL
): ColorValues {
    let colorValues = {
        hex: hexValue,
        rgb: convert.hexToRGB(hexValue),
        hsl: formattedHslColor,
        hsv: convert.hexToHSV(hexValue),
        cmyk: convert.hexToCMYK(hexValue),
        lab: convert.hexToLAB(hexValue)
    }

    return colorValues;
}

export function initColorValuesGenCaseRGB(
    color: ColorObject<RGB>, 
    formattedHslColor: HSL
): ColorValues {
    const colorValues: ColorValues = {
        hex: '',
        rgb: { red: 0, green: 0, blue: 0 },
        hsl: { hue: 0, saturation: 0, lightness: 0 },
        hsv: { hue: 0, saturation: 0, value: 0 },
        cmyk: { cyan: 0, magenta: 0, yellow: 0, key: 0 },
        lab: { l: 0, a: 0, b: 0 }
    };

    colorValues.hex = convert.rgbToHex(color.value);
    colorValues.rgb = color.value;
    colorValues.hsl = formattedHslColor;
    colorValues.hsv = convert.rgbToHSV(color.value);
    colorValues.cmyk = convert.rgbToCMYK(color.value);
    colorValues.lab = convert.rgbToLAB(color.value);

    return colorValues;
}

export function initColorValuesGenCaseHSL(
    hslColor: HSL,
    formattedHslColor: HSL
): ColorValues {
    const colorValues: ColorValues = {
        hex: convert.hslToHex(hslColor),
        rgb: convert.hslToRGB(hslColor),
        hsl: formattedHslColor,
        hsv: convert.hslToHSV(hslColor),
        cmyk: convert.hslToCMYK(hslColor),
        lab: convert.hslToLAB(hslColor)
    }

    return colorValues;
}

export function initColorValuesGenCaseDEFAULT(
    hslColor: HSL
): ColorValues {
    const colorValues: ColorValues = {
        hex: convert.hslToHex(hslColor),
        rgb: convert.hslToRGB(hslColor),
        hsl: hslColor,
        hsv: convert.hslToHSV(hslColor),
        cmyk: convert.hslToCMYK(hslColor),
        lab: convert.hslToLAB(hslColor)
    };
    return colorValues;
}

export function globalColorSpaceFormatting(
    initialColorSpace: string = 'hex',
    hexValue: string,
    formattedHslColor: HSL,
    hslColor: HSL
) {
    const handlers: Record<string, () => ColorValues> = {
        hex: () => initColorValuesGenCaseHex(hexValue, formattedHslColor),
        rgb: () =>
            initColorValuesGenCaseRGB(
                {
                    format: 'rgb',
                    value: convert.hslToRGB(formattedHslColor)
                },
                formattedHslColor
            ),
        hsl: () => initColorValuesGenCaseHSL(hslColor, formattedHslColor),
        default: () => initColorValuesGenCaseDEFAULT(hslColor)
    };

    return (handlers[initialColorSpace] || handlers.default)();
}

export function hexToCMYKTryCaseHelper(hex: string): CMYK {
    const rgb: RGB = convert.hexToRGB(hex);
    return convert.rgbToCMYK(rgb);
}

export function hslToCMYKTryCaseHelper(hsl: HSL): CMYK {
    const rgb: RGB = convert.hslToRGB(hsl);
    return convert.rgbToCMYK(rgb);
}

export function hsvToCMYKTryCaseHelper(hsv: HSV) {
    const rgb: RGB = convert.hsvToRGB(hsv);
    return convert.rgbToCMYK(rgb);
}

export function labToCMYKTryCaseHelper(lab: LAB) {
    const rgb: RGB = convert.labToRGB(lab);
    return convert.rgbToCMYK(rgb);
}

export function hslToHexTryCaseHelper(hsl: HSL): string {
    const rgb = convert.hslToRGB(hsl);
    return convert.rgbToHex(rgb);
}
