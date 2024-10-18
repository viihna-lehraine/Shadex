import {
    hexToRGB, hexToHSL, hexToHSV, hexToCMYK, hexToLab, rgbToHex, rgbToHSL, rgbToHSV, rgbToCMYK, rgbToLab, hslToHex, hslToRGB, hslToHSV, hslToCMYK, hslToLab, hsvToHex, hsvToRGB, hsvToHSL, hsvToCMYK, hsvToLab, cmykToHex, cmykToRGB, cmykToHSL, cmykToHSV, cmykToLab, labToHex, labToRGB, labToHSL, labToHSV, labToCMYK } from '../export';

export function declareConversionMap() {
    const conversionMap = {
        hsl: {
            rgb: hslToRGB,
            hex: hslToHex,
            hsv: hslToHSV,
            cmyk: hslToCMYK,
            lab: hslToLab
        },
        rgb: {
            hsl: rgbToHSL,
            hex: rgbToHex,
            hsv: rgbToHSV,
            cmyk: rgbToCMYK,
            lab: rgbToLab
        },
        hex: {
            rgb: hexToRGB,
            hsl: hexToHSL,
            hsv: hexToHSV,
            cmyk: hexToCMYK,
            lab: hexToLab
        },
        hsv: {
            rgb: hsvToRGB,
            hsl: hsvToHSL,
            hex: hsvToHex,
            cmyk: hsvToCMYK,
            lab: hsvToLab
        },
        cmyk: {
            rgb: cmykToRGB,
            hex: cmykToHex,
            hsl: cmykToHSL,
            hsv: cmykToHSV,
            lab: cmykToLab
        },
        lab: {
            rgb: labToRGB,
            hex: labToHex,
            hsl: labToHSL,
            hsv: labToHSV,
            cmyk: labToCMYK
        }
    }

    return conversionMap;
};

export function initialHslColorGeneration(color, hexValue) {
    if (color.format === 'hex') {
        hslColor = hexToHSL(hexValue);
    } else if (color.format === 'rgb') {
        hslColor = rgbToHSL(color.value);
    } else if (color.format === 'hsl') {
        hslColor = parseHSL(color.value);
    } else if (color.format === 'hsv') {
        hslColor = hslToHSV(color.value);
    } else if (color.format === 'cmyk') {
        hslColor = cmykToHSL(color.value);
    } else if (color.format === 'lab') {
        hslColor = labToHSL(color.value);
    } else {
        return;
    }

    return hslColor;
};

export function formatHslForInitialColorValueGen(hue, saturation, lightness) {
    let hslColor = { hue, saturation, lightness };

    if (typeof hue === 'object') {
        hslColor = {
            hue: hue.hue,
            saturation: hue.saturation,
            lightness: hue.lightness
        }
    }
    
    return hslColor;
};

export function formatHslColorPropertiesAsNumbers(hslColor) {
    hslColor.hue = Number(hslColor.hue);
    hslColor.saturation = Number(hslColor.saturation);
    hslColor.lightness = Number(hslColor.lightness);

    if (typeof hslColor.hue !== 'number' || typeof hslColor.saturation !== 'number' || typeof hslColor.lightness !== 'number') {

        return;
    }

    return hslColor;
};

export function initialColorValuesGenerationCaseHex(hexValue, formattedHslColor, colorValues) {
    colorValues = {
        hex: hexValue,
        rgb: hexToRGB(hexValue),
        hsl: formattedHslColor,
        hsv: hexToHSV(hexValue),
        cmyk: hexToCMYK(hexValue),
        lab: hexToLab(hexValue)
    }

    return colorValues;
};

export function initialColorValuesGenerationCaseRGB(color, formattedHslColor, colorValues) {
    colorValues = {
        hex: rgbToHex(color.value),
        rgb: color.value,
        hsl: formattedHslColor,
        hsv: rgbToHSV(color.value),
        cmyk: rgbToCMYK(color.value),
        lab: rgbToLab(color.value)
    }

    return colorValues;
};

function initialColorValuesGenerationCaseHSL(hslColor, formattedHslColor, colorValues) {
    colorValues = {
        hex: hslToHex(hslColor.hue, hslColor.saturation, hslColor.lightness),
        rgb: hslToRGB(hslColor.hue, hslColor.saturation, hslColor.lightness),
        hsl: formattedHslColor,
        hsv: hslToHSV(hslColor.hue, hslColor.saturation, hslColor.lightness),
        cmyk: hslToCMYK(hslColor.hue, hslColor.saturation, hslColor.lightness),
        lab: hslToLab(hslColor.hue, hslColor.saturation, hslColor.lightness)
    }

    return colorValues;
};

export function initialColorValuesGenerationCaseDEFAULT(hslColor) {
    colorValues = {
        hex: hslToHex(hslColor.hue, hslColor.saturation, hslColor.lightness),
        rgb: hslToRGB(hslColor.hue, hslColor.saturation, hslColor.lightness),
        hsl: formattedHslColor,
        hsv: hslToHSV(hslColor.hue, hslColor.saturation, hslColor.lightness),
        cmyk: hslToCMYK(hslColor.hue, hslColor.saturation, hslColor.lightness),
        lab: hslToLab(hslColor.hue, hslColor.saturation, hslColor.lightness)
    };

    return colorValues;
};

export function globalColorSpaceFormatting(initialColorSpace = 'hex', hexValue,formattedHslColor, colorValues, hslColor) {
    switch (initialColorSpace) {
        case 'hex':
            initialColorValuesGenerationCaseHex(hexValue, formattedHslColor, colorValues);
            return colorValues;
            break;
        case 'rgb':
            initialColorValuesGenerationCaseRGB(color, formattedHslColor, colorValues);
            return colorValues;
            break;
        case 'hsl':
            initialColorValuesGenerationCaseHSL(hslColor, formattedHslColor, colorValues);
            return colorValues;
            break;
        default:
            initialColorValuesGenerationCaseDEFAULT(hslColor);
            return colorValues;
            break;
    }
};

export function hexToCMYKTryCaseHelper(hex: string) {
    const rgb = hexToRGB(hex);
    const cmyk = rgbToCMYK(rgb.red, rgb.green, rgb.blue);

    return cmyk;
};

export function hslToCMYKTryCaseHelper(hue, saturation, lightness) {
    const rgb = hslToRGB(hue, saturation, lightness);
    const cmyk = rgbToCMYK(rgb.red, rgb.green, rgb.blue);

    return cmyk;
};

export function hsvToCMYKTryCaseHelper(hue, saturation, value) {
    const rgb = hsvToRGB(hue, saturation, value);
    const cmyk = rgbToCMYK(rgb.red, rgb.green, rgb.blue);

    return cmyk;
};

export function labToCMYKTryCaseHelper(l, a, b) {
    const rgb = labToRGB(l, a, b);
    const cmyk = rgbToCMYK(rgb.red, rgb.green, rgb.blue);

    return cmyk;
};

export function hslToHexTryCaseHelper(hue, saturation, lightness) {
    const rgb = hslToRGB(hue, saturation, lightness);
    const hex = rgbToHex(rgb.red, rgb.green, rgb.blue);

    return hex;
};
