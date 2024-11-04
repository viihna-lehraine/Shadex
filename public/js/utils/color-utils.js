import { core } from './core-utils.js';
import { defaults } from '../config/defaults.js';
// ******** SECTION 1: Robust Type Guards ********
function isColor(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    const color = value;
    const validFormats = [
        'cmyk',
        'hex',
        'hsl',
        'hsv',
        'lab',
        'rgb',
        'sl',
        'sv',
        'xyz'
    ];
    return ('value' in color &&
        'format' in color &&
        validFormats.includes(color.format));
}
function isColorFormat(color, format) {
    return color.format === format;
}
function isColorSpace(value) {
    return ['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'xyz'].includes(value);
}
function isColorSpaceExtended(value) {
    return [
        'cmyk',
        'hex',
        'hsl',
        'hsv',
        'lab',
        'rgb',
        'sl',
        'sv',
        'xyz'
    ].includes(value);
}
export function isColorString(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    const colorString = value;
    const validStringFormats = [
        'cmyk',
        'hsl',
        'hsv',
        'sl',
        'sv'
    ];
    return ('value' in colorString &&
        'format' in colorString &&
        validStringFormats.includes(colorString.format));
}
function isFormat(format) {
    return (typeof format === 'string' &&
        ['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'sl', 'sv', 'xyz'].includes(format));
}
// ******** SECTIOn 2: Narrower Type Guards ********
function isCMYKColor(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'cmyk' &&
        'value' in value &&
        typeof value.value.cyan === 'number' &&
        typeof value.value.magenta === 'number' &&
        typeof value.value.yellow === 'number' &&
        typeof value.value.key === 'number');
}
function isCMYKFormat(color) {
    return isColorFormat(color, 'cmyk');
}
function isCMYKString(value) {
    return (isColorString(value) &&
        typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'cmyk' &&
        'value' in value &&
        typeof value.value.cyan === 'string' &&
        typeof value.value.magenta === 'string' &&
        typeof value.value.yellow === 'string' &&
        typeof value.value.key === 'string');
}
function isHex(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'hex' &&
        'value' in value &&
        typeof value.value.hex === 'string');
}
function isHexFormat(color) {
    return isColorFormat(color, 'hex');
}
function isHSLColor(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'hsl' &&
        'value' in value &&
        typeof value.value.hue === 'number' &&
        typeof value.value.saturation === 'number' &&
        typeof value.value.lightness === 'number');
}
function isHSLFormat(color) {
    return isColorFormat(color, 'hsl');
}
function isHSLString(value) {
    return (isColorString(value) &&
        typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'hsl' &&
        'value' in value &&
        typeof value.value.hue === 'number' &&
        typeof value.value.saturation === 'string' &&
        typeof value.value.lightness === 'string');
}
function isHSVColor(value) {
    return (isColor(value) &&
        typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'hsv' &&
        'value' in value &&
        typeof value.value.hue === 'number' &&
        typeof value.value.saturation === 'number' &&
        typeof value.value.value === 'number');
}
function isHSVFormat(color) {
    return isColorFormat(color, 'hsv');
}
function isHSVString(value) {
    return (isColorString(value) &&
        typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'hsv' &&
        'value' in value &&
        typeof value.value.hue === 'number' &&
        typeof value.value.saturation === 'string' &&
        typeof value.value.value === 'string');
}
function isLAB(value) {
    return (isColor(value) &&
        typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'lab' &&
        'value' in value &&
        typeof value.value.l === 'number' &&
        typeof value.value.a === 'number' &&
        typeof value.value.b === 'number');
}
function isLABFormat(color) {
    return isColorFormat(color, 'lab');
}
function isRGB(value) {
    return (isColor(value) &&
        typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'rgb' &&
        'value' in value &&
        typeof value.value.red === 'number' &&
        typeof value.value.green === 'number' &&
        typeof value.value.blue === 'number');
}
function isRGBFormat(color) {
    return isColorFormat(color, 'rgb');
}
function isSLColor(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'sl' &&
        'value' in value &&
        typeof value.value.saturation === 'number' &&
        typeof value.value.lightness === 'number');
}
function isSLFormat(color) {
    return isColorFormat(color, 'sl');
}
function isSLString(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'sl' &&
        'value' in value &&
        typeof value.value.saturation === 'string' &&
        typeof value.value.lightness === 'string');
}
function isSVColor(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'sv' &&
        'value' in value &&
        typeof value.value.saturation === 'number' &&
        typeof value.value.value === 'number');
}
function isSVFormat(color) {
    return isColorFormat(color, 'sv');
}
function isSVString(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'sv' &&
        'value' in value &&
        typeof value.value.saturation === 'string' &&
        typeof value.value.value === 'string');
}
function isXYZ(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'xyz' &&
        'value' in value &&
        typeof value.value.x === 'number' &&
        typeof value.value.y === 'number' &&
        typeof value.value.z === 'number');
}
function isXYZFormat(color) {
    return isColorFormat(color, 'xyz');
}
// ***** SECTION 3: Utility Guards *****
function ensureHash(value) {
    return value.startsWith('#') ? value : `#${value}`;
}
function isConvertibleColor(color) {
    return (color.format === 'cmyk' ||
        color.format === 'hex' ||
        color.format === 'hsl' ||
        color.format === 'hsv' ||
        color.format === 'lab' ||
        color.format === 'rgb');
}
function isInputElement(element) {
    return element instanceof HTMLInputElement;
}
function isStoredPalette(obj) {
    if (typeof obj !== 'object' || obj === null)
        return false;
    const candidate = obj;
    return (typeof candidate.tableID === 'number' &&
        typeof candidate.palette === 'object' &&
        Array.isArray(candidate.palette.items) &&
        typeof candidate.palette.id === 'string');
}
function narrowToColor(color) {
    if (isColorString(color)) {
        return colorStringToColor(color);
    }
    switch (color.format) {
        case 'cmyk':
        case 'hex':
        case 'hsl':
        case 'hsv':
        case 'lab':
        case 'sl':
        case 'sv':
        case 'rgb':
        case 'xyz':
            return color;
        default:
            return null;
    }
}
// ******** SECTION 4: TRANSFORM UTILS ********
function addHashToHex(hex) {
    try {
        return hex.value.hex.startsWith('#')
            ? hex
            : {
                value: {
                    hex: `#${hex.value}}`,
                    alpha: hex.value.alpha,
                    numericAlpha: hex.value.numericAlpha
                },
                format: 'hex'
            };
    }
    catch (error) {
        console.error(`addHashToHex error: ${error}`);
        return defaults.hex;
    }
}
function colorStringToColor(colorString) {
    const clonedColor = core.clone(colorString);
    const parseValue = (value) => typeof value === 'string' && value.endsWith('%')
        ? parseFloat(value.slice(0, -1))
        : Number(value);
    const newValue = Object.entries(clonedColor.value).reduce((acc, [key, val]) => {
        acc[key] = parseValue(val);
        return acc;
    }, {});
    switch (clonedColor.format) {
        case 'cmyk':
            return { format: 'cmyk', value: newValue };
        case 'hsl':
            return { format: 'hsl', value: newValue };
        case 'hsv':
            return { format: 'hsv', value: newValue };
        case 'sl':
            return { format: 'sl', value: newValue };
        case 'sv':
            return { format: 'sv', value: newValue };
        default:
            throw new Error('Unsupported format for colorStringToColor');
    }
}
function colorToColorString(color) {
    const clonedColor = core.clone(color);
    if (isColorString(clonedColor)) {
        console.log(`Already formatted as color string: ${JSON.stringify(color)}`);
        return clonedColor;
    }
    const newValue = formatPercentageValues(clonedColor.value);
    if (isCMYKColor(clonedColor)) {
        return {
            format: 'cmyk',
            value: newValue
        };
    }
    else if (isHex(clonedColor)) {
        return {
            format: 'hex',
            value: newValue
        };
    }
    else if (isHSLColor(clonedColor)) {
        return {
            format: 'hsl',
            value: newValue
        };
    }
    else if (isHSVColor(clonedColor)) {
        return {
            format: 'hsv',
            value: newValue
        };
    }
    else if (isLAB(clonedColor)) {
        return {
            format: 'lab',
            value: newValue
        };
    }
    else if (isRGB(clonedColor)) {
        return {
            format: 'rgb',
            value: newValue
        };
    }
    else if (isXYZ(clonedColor)) {
        return {
            format: 'xyz',
            value: newValue
        };
    }
    else {
        throw new Error(`Unsupported format: ${clonedColor.format}`);
    }
}
function formatColor(color, asColorString = false, asCSSString = false) {
    const baseColor = core.clone(color);
    let formattedString = undefined;
    if (asColorString) {
        formattedString = colorToColorString(color);
    }
    else if (asCSSString) {
        formattedString = getCSSColorString(color);
    }
    return formattedString !== undefined
        ? { baseColor, formattedString }
        : { baseColor };
}
function formatPercentageValues(value) {
    return Object.entries(value).reduce((acc, [key, val]) => {
        acc[key] = [
            'saturation',
            'lightness',
            'value',
            'cyan',
            'magenta',
            'yellow',
            'key'
        ].includes(key)
            ? `${val}%`
            : val;
        return acc;
    }, {});
}
function getAlphaFromHex(hex) {
    if (hex.length !== 9 || !hex.startsWith('#')) {
        throw new Error(`Invalid hex color: ${hex}. Expected format #RRGGBBAA`);
    }
    const alphaHex = hex.slice(-2);
    const alphaDecimal = parseInt(alphaHex, 16);
    return alphaDecimal / 255;
}
function componentToHex(component) {
    try {
        const hex = Math.max(0, Math.min(255, component)).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
    catch (error) {
        console.error(`componentToHex error: ${error}`);
        return '00';
    }
}
function getColorString(color) {
    try {
        const formatters = {
            cmyk: (c) => `cmyk(${c.value.cyan}, ${c.value.magenta}, ${c.value.yellow}, ${c.value.key}, ${c.value.alpha})`,
            hex: (c) => c.value.hex,
            hsl: (c) => `hsl(${c.value.hue}, ${c.value.saturation}%, ${c.value.lightness}%,${c.value.alpha})`,
            hsv: (c) => `hsv(${c.value.hue}, ${c.value.saturation}%, ${c.value.value}%,${c.value.alpha})`,
            lab: (c) => `lab(${c.value.l}, ${c.value.a}, ${c.value.b},${c.value.alpha})`,
            rgb: (c) => `rgb(${c.value.red}, ${c.value.green}, ${c.value.blue},${c.value.alpha})`,
            xyz: (c) => `xyz(${c.value.x}, ${c.value.y}, ${c.value.z},${c.value.alpha})`
        };
        switch (color.format) {
            case 'cmyk':
                return formatters.cmyk(color);
            case 'hex':
                return formatters.hex(color);
            case 'hsl':
                return formatters.hsl(color);
            case 'hsv':
                return formatters.hsv(color);
            case 'lab':
                return formatters.lab(color);
            case 'rgb':
                return formatters.rgb(color);
            case 'xyz':
                return formatters.xyz(color);
            default:
                console.error(`Unsupported color format for ${color}`);
                return null;
        }
    }
    catch (error) {
        console.error(`getColorString error: ${error}`);
        return null;
    }
}
function getCSSColorString(color) {
    try {
        switch (color.format) {
            case 'cmyk':
                return `cmyk(${color.value.cyan},${color.value.magenta},${color.value.yellow},${color.value.key}${color.value.alpha})`;
            case 'hex':
                return String(color.value.hex);
            case 'hsl':
                return `hsl(${color.value.hue},${color.value.saturation}%,${color.value.lightness}%,${color.value.alpha})`;
            case 'hsv':
                return `hsv(${color.value.hue},${color.value.saturation}%,${color.value.value}%,${color.value.alpha})`;
            case 'lab':
                return `lab(${color.value.l},${color.value.a},${color.value.b},${color.value.alpha})`;
            case 'rgb':
                return `rgb(${color.value.red},${color.value.green},${color.value.blue},${color.value.alpha})`;
            case 'xyz':
                return `xyz(${color.value.x},${color.value.y},${color.value.z},${color.value.alpha})`;
            default:
                console.error('Unexpected color format');
                return '#FFFFFFFF';
        }
    }
    catch (error) {
        console.error(`getCSSColorString error: ${error}`);
        return '#FFFFFFFF';
    }
}
function hexAlphaToNumericAlpha(hexAlpha) {
    return parseInt(hexAlpha, 16) / 255;
}
const parseColor = (colorSpace, value) => {
    try {
        switch (colorSpace) {
            case 'cmyk': {
                const [c, m, y, k, a] = parseComponents(value, 5);
                return {
                    value: { cyan: c, magenta: m, yellow: y, key: k, alpha: a },
                    format: 'cmyk'
                };
            }
            case 'hex':
                const hexValue = value.startsWith('#') ? value : `#${value}`;
                const alpha = hexValue.length === 9 ? hexValue.slice(-2) : 'FF';
                const numericAlpha = hexAlphaToNumericAlpha(alpha);
                return {
                    value: {
                        hex: hexValue,
                        alpha,
                        numericAlpha
                    },
                    format: 'hex'
                };
            case 'hsl': {
                const [h, s, l, a] = parseComponents(value, 4);
                return {
                    value: { hue: h, saturation: s, lightness: l, alpha: a },
                    format: 'hsl'
                };
            }
            case 'hsv': {
                const [h, s, v, a] = parseComponents(value, 4);
                return {
                    value: { hue: h, saturation: s, value: v, alpha: a },
                    format: 'hsv'
                };
            }
            case 'lab': {
                const [l, a, b, alpha] = parseComponents(value, 4);
                return { value: { l, a, b, alpha }, format: 'lab' };
            }
            case 'rgb': {
                const [r, g, b, a] = value.split(',').map(Number);
                return {
                    value: { red: r, green: g, blue: b, alpha: a },
                    format: 'rgb'
                };
            }
            default:
                throw new Error(`Unsupported color format: ${colorSpace}`);
        }
    }
    catch (error) {
        console.error(`parseColor error: ${error}`);
        return null;
    }
};
function parseComponents(value, count) {
    try {
        const components = value
            .split(',')
            .map(val => val.trim().endsWith('%')
            ? parseFloat(val)
            : parseFloat(val) * 100);
        if (components.length !== count)
            throw new Error(`Expected ${count} components.`);
        return components;
    }
    catch (error) {
        console.error(`Error parsing components: ${error}`);
        return [];
    }
}
function parseCustomColor(rawValue) {
    try {
        console.log(`Parsing custom color: ${JSON.stringify(rawValue)}`);
        const match = rawValue.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?,\s*(\d*\.?\d+)\)/);
        if (match) {
            const [, hue, saturation, lightness, alpha] = match;
            return {
                value: {
                    hue: Number(hue),
                    saturation: Number(saturation),
                    lightness: Number(lightness),
                    alpha: Number(alpha)
                },
                format: 'hsl'
            };
        }
        else {
            console.error('Invalid HSL custom color. Expected format: hsl(H, S%, L%, A)');
            return null;
        }
    }
    catch (error) {
        console.error(`parseCustomColor error: ${error}`);
        return null;
    }
}
function parseHexWithAlpha(hexValue) {
    const hex = hexValue.startsWith('#') ? hexValue : `#${hexValue}`;
    const alpha = hex.length === 9 ? hex.slice(-2) : 'FF';
    const numericAlpha = hexAlphaToNumericAlpha(alpha);
    return { hex, alpha, numericAlpha };
}
function stripHashFromHex(hex) {
    try {
        const hexString = `${hex.value.hex}${hex.value.alpha}`;
        return hex.value.hex.startsWith('#')
            ? {
                value: {
                    hex: hexString.slice(1),
                    alpha: hex.value.alpha,
                    numericAlpha: hexAlphaToNumericAlpha(hex.value.alpha)
                },
                format: 'hex'
            }
            : hex;
    }
    catch (error) {
        console.error(`stripHashFromHex error: ${error}`);
        return core.clone(defaults.hex);
    }
}
function stripPercentFromValues(value) {
    return Object.entries(value).reduce((acc, [key, val]) => {
        const parsedValue = typeof val === 'string' && val.endsWith('%')
            ? parseFloat(val.slice(0, -1))
            : val;
        acc[key] = parsedValue;
        return acc;
    }, {});
}
function toHexWithAlpha(rgbValue) {
    const { red, green, blue, alpha } = rgbValue;
    const hex = `#${((1 << 24) + (red << 16) + (green << 8) + blue)
        .toString(16)
        .slice(1)}`;
    const alphaHex = Math.round(alpha * 255)
        .toString(16)
        .padStart(2, '0');
    return `${hex}${alphaHex}`;
}
export const colorUtils = {
    addHashToHex,
    colorStringToColor,
    colorToColorString,
    componentToHex,
    ensureHash,
    formatColor,
    formatPercentageValues,
    getAlphaFromHex,
    getColorString,
    getCSSColorString,
    hexAlphaToNumericAlpha,
    isCMYKColor,
    isCMYKFormat,
    isCMYKString,
    isColor,
    isColorFormat,
    isColorString,
    isColorSpace,
    isColorSpaceExtended,
    isConvertibleColor,
    isFormat,
    isHex,
    isHexFormat,
    isHSLColor,
    isHSLFormat,
    isHSLString,
    isInputElement,
    isHSVColor,
    isHSVFormat,
    isHSVString,
    isLAB,
    isLABFormat,
    isRGB,
    isRGBFormat,
    isSLColor,
    isSLFormat,
    isSLString,
    isStoredPalette,
    isSVColor,
    isSVFormat,
    isSVString,
    isXYZ,
    isXYZFormat,
    narrowToColor,
    parseColor,
    parseComponents,
    parseCustomColor,
    parseHexWithAlpha,
    stripHashFromHex,
    stripPercentFromValues,
    toHexWithAlpha
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvY29sb3ItdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNwQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFLOUMsa0RBQWtEO0FBRWxELFNBQVMsT0FBTyxDQUFDLEtBQWM7SUFDOUIsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUk7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUU5RCxNQUFNLEtBQUssR0FBRyxLQUFxQixDQUFDO0lBQ3BDLE1BQU0sWUFBWSxHQUE2QjtRQUM5QyxNQUFNO1FBQ04sS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxJQUFJO1FBQ0osSUFBSTtRQUNKLEtBQUs7S0FDTCxDQUFDO0lBRUYsT0FBTyxDQUNOLE9BQU8sSUFBSSxLQUFLO1FBQ2hCLFFBQVEsSUFBSSxLQUFLO1FBQ2pCLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUNuQyxDQUFDO0FBQ0gsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUNyQixLQUFtQixFQUNuQixNQUFtQjtJQUVuQixPQUFPLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDO0FBQ2hDLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxLQUFhO0lBQ2xDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQzVCLEtBQWE7SUFFYixPQUFPO1FBQ04sTUFBTTtRQUNOLEtBQUs7UUFDTCxLQUFL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QkFBc0I7SUFDdEIsZUFBZTtJQUNmLGNBQWM7SUFDZCxpQkFBaUI7SUFDakIsc0JBQXNCO0lBQ3RCLFdBQVc7SUFDWCxZQUFZO0lBQ1osWUFBWTtJQUNaLE9BQU87SUFDUCxhQUFhO0lBQ2IsYUFBYTtJQUNiLFlBQVk7SUFDWixvQkFBb0I7SUFDcEIsa0JBQWtCO0lBQ2xCLFFBQVE7SUFDUixLQUFLO0lBQ0wsV0FBVztJQUNYLFVBQVU7SUFDVixXQUFXO0lBQ1gsV0FBVztJQUNYLGNBQWM7SUFDZCxVQUFVO0lBQ1YsV0FBVztJQUNYLFdBQVc7SUFDWCxLQUFLO0lBQ0wsV0FBVztJQUNYLEtBQUs7SUFDTCxXQUFXO0lBQ1gsU0FBUztJQUNULFVBQVU7SUFDVixVQUFVO0lBQ1YsZUFBZTtJQUNmLFNBQVM7SUFDVCxVQUFVO0lBQ1YsVUFBVTtJQUNWLEtBQUs7SUFDTCxXQUFXO0lBQ1gsYUFBYTtJQUNiLFVBQVU7SUFDVixlQUFlO0lBQ2YsZ0JBQWdCO0lBQ2hCLGlCQUFpQjtJQUNqQixnQkFBZ0I7SUFDaEIsc0JBQXNCO0lBQ3RCLGNBQWM7Q0FDZCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29yZSB9IGZyb20gJy4vY29yZS11dGlscyc7XG5pbXBvcnQgeyBkZWZhdWx0cyB9IGZyb20gJy4uL2NvbmZpZy9kZWZhdWx0cyc7XG5pbXBvcnQgKiBhcyBjb2xvcnMgZnJvbSAnLi4vaW5kZXgvY29sb3JzJztcbmltcG9ydCAqIGFzIGZuT2JqZWN0cyBmcm9tICcuLi9pbmRleC9mbi1vYmplY3RzJztcbmltcG9ydCAqIGFzIGlkYiBmcm9tICcuLi9pbmRleC9kYXRhYmFzZSc7XG5cbi8vICoqKioqKioqIFNFQ1RJT04gMTogUm9idXN0IFR5cGUgR3VhcmRzICoqKioqKioqXG5cbmZ1bmN0aW9uIGlzQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBjb2xvcnMuQ29sb3Ige1xuXHRpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fCB2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG5cdGNvbnN0IGNvbG9yID0gdmFsdWUgYXMgY29sb3JzLkNvbG9yO1xuXHRjb25zdCB2YWxpZEZvcm1hdHM6IGNvbG9ycy5Db2xvclsnZm9ybWF0J11bXSA9IFtcblx0XHQnY215aycsXG5cdFx0J2hleCcsXG5cdFx0J2hzbCcsXG5cdFx0J2hzdicsXG5cdFx0J2xhYicsXG5cdFx0J3JnYicsXG5cdFx0J3NsJyxcblx0XHQnc3YnLFxuXHRcdCd4eXonXG5cdF07XG5cblx0cmV0dXJuIChcblx0XHQndmFsdWUnIGluIGNvbG9yICYmXG5cdFx0J2Zvcm1hdCcgaW4gY29sb3IgJiZcblx0XHR2YWxpZEZvcm1hdHMuaW5jbHVkZXMoY29sb3IuZm9ybWF0KVxuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0NvbG9yRm9ybWF0PFQgZXh0ZW5kcyBjb2xvcnMuQ29sb3I+KFxuXHRjb2xvcjogY29sb3JzLkNvbG9yLFxuXHRmb3JtYXQ6IFRbJ2Zvcm1hdCddXG4pOiBjb2xvciBpcyBUIHtcblx0cmV0dXJuIGNvbG9yLmZvcm1hdCA9PT0gZm9ybWF0O1xufVxuXG5mdW5jdGlvbiBpc0NvbG9yU3BhY2UodmFsdWU6IHN0cmluZyk6IHZhbHVlIGlzIGNvbG9ycy5Db2xvclNwYWNlIHtcblx0cmV0dXJuIFsnY215aycsICdoZXgnLCAnaHNsJywgJ2hzdicsICdsYWInLCAncmdiJywgJ3h5eiddLmluY2x1ZGVzKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gaXNDb2xvclNwYWNlRXh0ZW5kZWQoXG5cdHZhbHVlOiBzdHJpbmdcbik6IHZhbHVlIGlzIGNvbG9ycy5Db2xvclNwYWNlRXh0ZW5kZWQge1xuXHRyZXR1cm4gW1xuXHRcdCdjbXlrJyxcblx0XHQnaGV4Jyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnbGFiJyxcblx0XHQncmdiJyxcblx0XHQnc2wnLFxuXHRcdCdzdicsXG5cdFx0J3h5eidcblx0XS5pbmNsdWRlcyh2YWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbG9yU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgY29sb3JzLkNvbG9yU3RyaW5nIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuXHRjb25zdCBjb2xvclN0cmluZyA9IHZhbHVlIGFzIGNvbG9ycy5Db2xvclN0cmluZztcblx0Y29uc3QgdmFsaWRTdHJpbmdGb3JtYXRzOiBjb2xvcnMuQ29sb3JTdHJpbmdbJ2Zvcm1hdCddW10gPSBbXG5cdFx0J2NteWsnLFxuXHRcdCdoc2wnLFxuXHRcdCdoc3YnLFxuXHRcdCdzbCcsXG5cdFx0J3N2J1xuXHRdO1xuXG5cdHJldHVybiAoXG5cdFx0J3ZhbHVlJyBpbiBjb2xvclN0cmluZyAmJlxuXHRcdCdmb3JtYXQnIGluIGNvbG9yU3RyaW5nICYmXG5cdFx0dmFsaWRTdHJpbmdGb3JtYXRzLmluY2x1ZGVzKGNvbG9yU3RyaW5nLmZvcm1hdClcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNGb3JtYXQoZm9ybWF0OiB1bmtub3duKTogZm9ybWF0IGlzIGNvbG9ycy5Gb3JtYXQge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiBmb3JtYXQgPT09ICdzdHJpbmcnICYmXG5cdFx0WydjbXlrJywgJ2hleCcsICdoc2wnLCAnaHN2JywgJ2xhYicsICdyZ2InLCAnc2wnLCAnc3YnLCAneHl6J10uaW5jbHVkZXMoXG5cdFx0XHRmb3JtYXRcblx0XHQpXG5cdCk7XG59XG5cbi8vICoqKioqKioqIFNFQ1RJT24gMjogTmFycm93ZXIgVHlwZSBHdWFyZHMgKioqKioqKipcblxuZnVuY3Rpb24gaXNDTVlLQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBjb2xvcnMuQ01ZSyB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgY29sb3JzLkNNWUspLmZvcm1hdCA9PT0gJ2NteWsnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkNNWUspLnZhbHVlLmN5YW4gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuQ01ZSykudmFsdWUubWFnZW50YSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5DTVlLKS52YWx1ZS55ZWxsb3cgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuQ01ZSykudmFsdWUua2V5ID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0NNWUtGb3JtYXQoY29sb3I6IGNvbG9ycy5Db2xvcik6IGNvbG9yIGlzIGNvbG9ycy5DTVlLIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdjbXlrJyk7XG59XG5cbmZ1bmN0aW9uIGlzQ01ZS1N0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIGNvbG9ycy5DTVlLU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHRpc0NvbG9yU3RyaW5nKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIGNvbG9ycy5DTVlLU3RyaW5nKS5mb3JtYXQgPT09ICdjbXlrJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5DTVlLU3RyaW5nKS52YWx1ZS5jeWFuID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkNNWUtTdHJpbmcpLnZhbHVlLm1hZ2VudGEgPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuQ01ZS1N0cmluZykudmFsdWUueWVsbG93ID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkNNWUtTdHJpbmcpLnZhbHVlLmtleSA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNIZXgodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBjb2xvcnMuSGV4IHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBjb2xvcnMuSGV4KS5mb3JtYXQgPT09ICdoZXgnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkhleCkudmFsdWUuaGV4ID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hleEZvcm1hdChjb2xvcjogY29sb3JzLkNvbG9yKTogY29sb3IgaXMgY29sb3JzLkhleCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnaGV4Jyk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBjb2xvcnMuSFNMIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBjb2xvcnMuSFNMKS5mb3JtYXQgPT09ICdoc2wnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkhTTCkudmFsdWUuaHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkhTTCkudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5IU0wpLnZhbHVlLmxpZ2h0bmVzcyA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNIU0xGb3JtYXQoY29sb3I6IGNvbG9ycy5Db2xvcik6IGNvbG9yIGlzIGNvbG9ycy5IU0wge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2hzbCcpO1xufVxuXG5mdW5jdGlvbiBpc0hTTFN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIGNvbG9ycy5IU0xTdHJpbmcge1xuXHRyZXR1cm4gKFxuXHRcdGlzQ29sb3JTdHJpbmcodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgY29sb3JzLkhTTFN0cmluZykuZm9ybWF0ID09PSAnaHNsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5IU0xTdHJpbmcpLnZhbHVlLmh1ZSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5IU0xTdHJpbmcpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuSFNMU3RyaW5nKS52YWx1ZS5saWdodG5lc3MgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNWQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBjb2xvcnMuSFNWIHtcblx0cmV0dXJuIChcblx0XHRpc0NvbG9yKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIGNvbG9ycy5IU1YpLmZvcm1hdCA9PT0gJ2hzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuSFNWKS52YWx1ZS5odWUgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuSFNWKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkhTVikudmFsdWUudmFsdWUgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNWRm9ybWF0KGNvbG9yOiBjb2xvcnMuQ29sb3IpOiBjb2xvciBpcyBjb2xvcnMuSFNWIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdoc3YnKTtcbn1cblxuZnVuY3Rpb24gaXNIU1ZTdHJpbmcodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBjb2xvcnMuSFNWU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHRpc0NvbG9yU3RyaW5nKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIGNvbG9ycy5IU1ZTdHJpbmcpLmZvcm1hdCA9PT0gJ2hzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuSFNWU3RyaW5nKS52YWx1ZS5odWUgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuSFNWU3RyaW5nKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkhTVlN0cmluZykudmFsdWUudmFsdWUgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzTEFCKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgY29sb3JzLkxBQiB7XG5cdHJldHVybiAoXG5cdFx0aXNDb2xvcih2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBjb2xvcnMuTEFCKS5mb3JtYXQgPT09ICdsYWInICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkxBQikudmFsdWUubCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5MQUIpLnZhbHVlLmEgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuTEFCKS52YWx1ZS5iID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0xBQkZvcm1hdChjb2xvcjogY29sb3JzLkNvbG9yKTogY29sb3IgaXMgY29sb3JzLkxBQiB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnbGFiJyk7XG59XG5cbmZ1bmN0aW9uIGlzUkdCKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgY29sb3JzLlJHQiB7XG5cdHJldHVybiAoXG5cdFx0aXNDb2xvcih2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBjb2xvcnMuUkdCKS5mb3JtYXQgPT09ICdyZ2InICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLlJHQikudmFsdWUucmVkID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLlJHQikudmFsdWUuZ3JlZW4gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuUkdCKS52YWx1ZS5ibHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1JHQkZvcm1hdChjb2xvcjogY29sb3JzLkNvbG9yKTogY29sb3IgaXMgY29sb3JzLlJHQiB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAncmdiJyk7XG59XG5cbmZ1bmN0aW9uIGlzU0xDb2xvcih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIGNvbG9ycy5TTCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgY29sb3JzLlNMKS5mb3JtYXQgPT09ICdzbCcgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuU0wpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuU0wpLnZhbHVlLmxpZ2h0bmVzcyA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNTTEZvcm1hdChjb2xvcjogY29sb3JzLkNvbG9yKTogY29sb3IgaXMgY29sb3JzLlNMIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdzbCcpO1xufVxuXG5mdW5jdGlvbiBpc1NMU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgY29sb3JzLlNMU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBjb2xvcnMuU0xTdHJpbmcpLmZvcm1hdCA9PT0gJ3NsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5TTFN0cmluZykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5TTFN0cmluZykudmFsdWUubGlnaHRuZXNzID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1NWQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBjb2xvcnMuU1Yge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIGNvbG9ycy5TVikuZm9ybWF0ID09PSAnc3YnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLlNWKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLlNWKS52YWx1ZS52YWx1ZSA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNTVkZvcm1hdChjb2xvcjogY29sb3JzLkNvbG9yKTogY29sb3IgaXMgY29sb3JzLlNWIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdzdicpO1xufVxuXG5mdW5jdGlvbiBpc1NWU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgY29sb3JzLlNWU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBjb2xvcnMuU1ZTdHJpbmcpLmZvcm1hdCA9PT0gJ3N2JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5TVlN0cmluZykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5TVlN0cmluZykudmFsdWUudmFsdWUgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzWFlaKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgY29sb3JzLlhZWiB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgY29sb3JzLlhZWikuZm9ybWF0ID09PSAneHl6JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5YWVopLnZhbHVlLnggPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuWFlaKS52YWx1ZS55ID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLlhZWikudmFsdWUueiA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNYWVpGb3JtYXQoY29sb3I6IGNvbG9ycy5Db2xvcik6IGNvbG9yIGlzIGNvbG9ycy5YWVoge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ3h5eicpO1xufVxuXG4vLyAqKioqKiBTRUNUSU9OIDM6IFV0aWxpdHkgR3VhcmRzICoqKioqXG5cbmZ1bmN0aW9uIGVuc3VyZUhhc2godmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG5cdHJldHVybiB2YWx1ZS5zdGFydHNXaXRoKCcjJykgPyB2YWx1ZSA6IGAjJHt2YWx1ZX1gO1xufVxuXG5mdW5jdGlvbiBpc0NvbnZlcnRpYmxlQ29sb3IoXG5cdGNvbG9yOiBjb2xvcnMuQ29sb3Jcbik6IGNvbG9yIGlzXG5cdHwgY29sb3JzLkNNWUtcblx0fCBjb2xvcnMuSGV4XG5cdHwgY29sb3JzLkhTTFxuXHR8IGNvbG9ycy5IU1Zcblx0fCBjb2xvcnMuTEFCXG5cdHwgY29sb3JzLlJHQiB7XG5cdHJldHVybiAoXG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnY215aycgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdoZXgnIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnaHNsJyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2hzdicgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdsYWInIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAncmdiJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0lucHV0RWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwpOiBlbGVtZW50IGlzIEhUTUxFbGVtZW50IHtcblx0cmV0dXJuIGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBpc1N0b3JlZFBhbGV0dGUob2JqOiB1bmtub3duKTogb2JqIGlzIGlkYi5TdG9yZWRQYWxldHRlIHtcblx0aWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG5cdGNvbnN0IGNhbmRpZGF0ZSA9IG9iaiBhcyBQYXJ0aWFsPGlkYi5TdG9yZWRQYWxldHRlPjtcblxuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiBjYW5kaWRhdGUudGFibGVJRCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgY2FuZGlkYXRlLnBhbGV0dGUgPT09ICdvYmplY3QnICYmXG5cdFx0QXJyYXkuaXNBcnJheShjYW5kaWRhdGUucGFsZXR0ZS5pdGVtcykgJiZcblx0XHR0eXBlb2YgY2FuZGlkYXRlLnBhbGV0dGUuaWQgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIG5hcnJvd1RvQ29sb3IoXG5cdGNvbG9yOiBjb2xvcnMuQ29sb3IgfCBjb2xvcnMuQ29sb3JTdHJpbmdcbik6IGNvbG9ycy5Db2xvciB8IG51bGwge1xuXHRpZiAoaXNDb2xvclN0cmluZyhjb2xvcikpIHtcblx0XHRyZXR1cm4gY29sb3JTdHJpbmdUb0NvbG9yKGNvbG9yKTtcblx0fVxuXG5cdHN3aXRjaCAoY29sb3IuZm9ybWF0IGFzIGNvbG9ycy5Db2xvclNwYWNlRXh0ZW5kZWQpIHtcblx0XHRjYXNlICdjbXlrJzpcblx0XHRjYXNlICdoZXgnOlxuXHRcdGNhc2UgJ2hzbCc6XG5cdFx0Y2FzZSAnaHN2Jzpcblx0XHRjYXNlICdsYWInOlxuXHRcdGNhc2UgJ3NsJzpcblx0XHRjYXNlICdzdic6XG5cdFx0Y2FzZSAncmdiJzpcblx0XHRjYXNlICd4eXonOlxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG4vLyAqKioqKioqKiBTRUNUSU9OIDQ6IFRSQU5TRk9STSBVVElMUyAqKioqKioqKlxuXG5mdW5jdGlvbiBhZGRIYXNoVG9IZXgoaGV4OiBjb2xvcnMuSGV4KTogY29sb3JzLkhleCB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGhleC52YWx1ZS5oZXguc3RhcnRzV2l0aCgnIycpXG5cdFx0XHQ/IGhleFxuXHRcdFx0OiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGhleDogYCMke2hleC52YWx1ZX19YCxcblx0XHRcdFx0XHRcdGFscGhhOiBoZXgudmFsdWUuYWxwaGEsXG5cdFx0XHRcdFx0XHRudW1lcmljQWxwaGE6IGhleC52YWx1ZS5udW1lcmljQWxwaGFcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hleCcgYXMgJ2hleCdcblx0XHRcdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBhZGRIYXNoVG9IZXggZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdHMuaGV4O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvbG9yU3RyaW5nVG9Db2xvcihjb2xvclN0cmluZzogY29sb3JzLkNvbG9yU3RyaW5nKTogY29sb3JzLkNvbG9yIHtcblx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjb3JlLmNsb25lKGNvbG9yU3RyaW5nKTtcblxuXHRjb25zdCBwYXJzZVZhbHVlID0gKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpOiBudW1iZXIgPT5cblx0XHR0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLmVuZHNXaXRoKCclJylcblx0XHRcdD8gcGFyc2VGbG9hdCh2YWx1ZS5zbGljZSgwLCAtMSkpXG5cdFx0XHQ6IE51bWJlcih2YWx1ZSk7XG5cblx0Y29uc3QgbmV3VmFsdWUgPSBPYmplY3QuZW50cmllcyhjbG9uZWRDb2xvci52YWx1ZSkucmVkdWNlKFxuXHRcdChhY2MsIFtrZXksIHZhbF0pID0+IHtcblx0XHRcdGFjY1trZXkgYXMga2V5b2YgKHR5cGVvZiBjbG9uZWRDb2xvcilbJ3ZhbHVlJ11dID0gcGFyc2VWYWx1ZShcblx0XHRcdFx0dmFsXG5cdFx0XHQpIGFzIG5ldmVyO1xuXHRcdFx0cmV0dXJuIGFjYztcblx0XHR9LFxuXHRcdHt9IGFzIFJlY29yZDxrZXlvZiAodHlwZW9mIGNsb25lZENvbG9yKVsndmFsdWUnXSwgbnVtYmVyPlxuXHQpO1xuXG5cdHN3aXRjaCAoY2xvbmVkQ29sb3IuZm9ybWF0KSB7XG5cdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdjbXlrJywgdmFsdWU6IG5ld1ZhbHVlIGFzIGNvbG9ycy5DTVlLVmFsdWUgfTtcblx0XHRjYXNlICdoc2wnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnaHNsJywgdmFsdWU6IG5ld1ZhbHVlIGFzIGNvbG9ycy5IU0xWYWx1ZSB9O1xuXHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdoc3YnLCB2YWx1ZTogbmV3VmFsdWUgYXMgY29sb3JzLkhTVlZhbHVlIH07XG5cdFx0Y2FzZSAnc2wnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnc2wnLCB2YWx1ZTogbmV3VmFsdWUgYXMgY29sb3JzLlNMVmFsdWUgfTtcblx0XHRjYXNlICdzdic6XG5cdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdzdicsIHZhbHVlOiBuZXdWYWx1ZSBhcyBjb2xvcnMuU1ZWYWx1ZSB9O1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGZvcm1hdCBmb3IgY29sb3JTdHJpbmdUb0NvbG9yJyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY29sb3JUb0NvbG9yU3RyaW5nKGNvbG9yOiBjb2xvcnMuQ29sb3IpOiBjb2xvcnMuQ29sb3JTdHJpbmcge1xuXHRjb25zdCBjbG9uZWRDb2xvciA9IGNvcmUuY2xvbmUoY29sb3IpIGFzIEV4Y2x1ZGU8Y29sb3JzLkNvbG9yLCBjb2xvcnMuSGV4PjtcblxuXHRpZiAoaXNDb2xvclN0cmluZyhjbG9uZWRDb2xvcikpIHtcblx0XHRjb25zb2xlLmxvZyhcblx0XHRcdGBBbHJlYWR5IGZvcm1hdHRlZCBhcyBjb2xvciBzdHJpbmc6ICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWBcblx0XHQpO1xuXG5cdFx0cmV0dXJuIGNsb25lZENvbG9yO1xuXHR9XG5cblx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKGNsb25lZENvbG9yLnZhbHVlKTtcblxuXHRpZiAoaXNDTVlLQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2NteWsnLFxuXHRcdFx0dmFsdWU6IG5ld1ZhbHVlIGFzIHVua25vd24gYXMgY29sb3JzLkNNWUtWYWx1ZVN0cmluZ1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNIZXgoY2xvbmVkQ29sb3IpKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2hleCcsXG5cdFx0XHR2YWx1ZTogbmV3VmFsdWUgYXMgdW5rbm93biBhcyBjb2xvcnMuSGV4VmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzSFNMQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2hzbCcsXG5cdFx0XHR2YWx1ZTogbmV3VmFsdWUgYXMgdW5rbm93biBhcyBjb2xvcnMuSFNMVmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzSFNWQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2hzdicsXG5cdFx0XHR2YWx1ZTogbmV3VmFsdWUgYXMgdW5rbm93biBhcyBjb2xvcnMuSFNWVmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzTEFCKGNsb25lZENvbG9yKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdsYWInLFxuXHRcdFx0dmFsdWU6IG5ld1ZhbHVlIGFzIHVua25vd24gYXMgY29sb3JzLkxBQlZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc1JHQihjbG9uZWRDb2xvcikpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAncmdiJyxcblx0XHRcdHZhbHVlOiBuZXdWYWx1ZSBhcyB1bmtub3duIGFzIGNvbG9ycy5SR0JWYWx1ZVN0cmluZ1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNYWVooY2xvbmVkQ29sb3IpKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ3h5eicsXG5cdFx0XHR2YWx1ZTogbmV3VmFsdWUgYXMgdW5rbm93biBhcyBjb2xvcnMuWFlaVmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZm9ybWF0OiAke2Nsb25lZENvbG9yLmZvcm1hdH1gKTtcblx0fVxufVxuXG5mdW5jdGlvbiBmb3JtYXRDb2xvcihcblx0Y29sb3I6IGNvbG9ycy5Db2xvcixcblx0YXNDb2xvclN0cmluZzogYm9vbGVhbiA9IGZhbHNlLFxuXHRhc0NTU1N0cmluZzogYm9vbGVhbiA9IGZhbHNlXG4pOiB7IGJhc2VDb2xvcjogY29sb3JzLkNvbG9yOyBmb3JtYXR0ZWRTdHJpbmc/OiBjb2xvcnMuQ29sb3JTdHJpbmcgfCBzdHJpbmcgfSB7XG5cdGNvbnN0IGJhc2VDb2xvciA9IGNvcmUuY2xvbmUoY29sb3IpO1xuXG5cdGxldCBmb3JtYXR0ZWRTdHJpbmc6IGNvbG9ycy5Db2xvclN0cmluZyB8IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuXHRpZiAoYXNDb2xvclN0cmluZykge1xuXHRcdGZvcm1hdHRlZFN0cmluZyA9IGNvbG9yVG9Db2xvclN0cmluZyhcblx0XHRcdGNvbG9yIGFzIEV4Y2x1ZGU8Y29sb3JzLkNvbG9yLCBjb2xvcnMuSGV4IHwgY29sb3JzLkxBQiB8IGNvbG9ycy5SR0I+XG5cdFx0KSBhcyBjb2xvcnMuQ29sb3JTdHJpbmc7XG5cdH0gZWxzZSBpZiAoYXNDU1NTdHJpbmcpIHtcblx0XHRmb3JtYXR0ZWRTdHJpbmcgPSBnZXRDU1NDb2xvclN0cmluZyhjb2xvcikgYXMgc3RyaW5nO1xuXHR9XG5cblx0cmV0dXJuIGZvcm1hdHRlZFN0cmluZyAhPT0gdW5kZWZpbmVkXG5cdFx0PyB7IGJhc2VDb2xvciwgZm9ybWF0dGVkU3RyaW5nIH1cblx0XHQ6IHsgYmFzZUNvbG9yIH07XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHVua25vd24+Pihcblx0dmFsdWU6IFRcbik6IFQge1xuXHRyZXR1cm4gT2JqZWN0LmVudHJpZXModmFsdWUpLnJlZHVjZShcblx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHQoYWNjIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVtrZXldID0gW1xuXHRcdFx0XHQnc2F0dXJhdGlvbicsXG5cdFx0XHRcdCdsaWdodG5lc3MnLFxuXHRcdFx0XHQndmFsdWUnLFxuXHRcdFx0XHQnY3lhbicsXG5cdFx0XHRcdCdtYWdlbnRhJyxcblx0XHRcdFx0J3llbGxvdycsXG5cdFx0XHRcdCdrZXknXG5cdFx0XHRdLmluY2x1ZGVzKGtleSlcblx0XHRcdFx0PyBgJHt2YWx9JWBcblx0XHRcdFx0OiB2YWw7XG5cdFx0XHRyZXR1cm4gYWNjO1xuXHRcdH0sXG5cdFx0e30gYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj5cblx0KSBhcyBUO1xufVxuXG5mdW5jdGlvbiBnZXRBbHBoYUZyb21IZXgoaGV4OiBzdHJpbmcpOiBudW1iZXIge1xuXHRpZiAoaGV4Lmxlbmd0aCAhPT0gOSB8fCAhaGV4LnN0YXJ0c1dpdGgoJyMnKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBoZXggY29sb3I6ICR7aGV4fS4gRXhwZWN0ZWQgZm9ybWF0ICNSUkdHQkJBQWApO1xuXHR9XG5cblx0Y29uc3QgYWxwaGFIZXggPSBoZXguc2xpY2UoLTIpO1xuXHRjb25zdCBhbHBoYURlY2ltYWwgPSBwYXJzZUludChhbHBoYUhleCwgMTYpO1xuXG5cdHJldHVybiBhbHBoYURlY2ltYWwgLyAyNTU7XG59XG5cbmZ1bmN0aW9uIGNvbXBvbmVudFRvSGV4KGNvbXBvbmVudDogbnVtYmVyKTogc3RyaW5nIHtcblx0dHJ5IHtcblx0XHRjb25zdCBoZXggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIGNvbXBvbmVudCkpLnRvU3RyaW5nKDE2KTtcblxuXHRcdHJldHVybiBoZXgubGVuZ3RoID09PSAxID8gJzAnICsgaGV4IDogaGV4O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGNvbXBvbmVudFRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuICcwMCc7XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0Q29sb3JTdHJpbmcoY29sb3I6IGNvbG9ycy5Db2xvcik6IHN0cmluZyB8IG51bGwge1xuXHR0cnkge1xuXHRcdGNvbnN0IGZvcm1hdHRlcnMgPSB7XG5cdFx0XHRjbXlrOiAoYzogY29sb3JzLkNNWUspID0+XG5cdFx0XHRcdGBjbXlrKCR7Yy52YWx1ZS5jeWFufSwgJHtjLnZhbHVlLm1hZ2VudGF9LCAke2MudmFsdWUueWVsbG93fSwgJHtjLnZhbHVlLmtleX0sICR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdGhleDogKGM6IGNvbG9ycy5IZXgpID0+IGMudmFsdWUuaGV4LFxuXHRcdFx0aHNsOiAoYzogY29sb3JzLkhTTCkgPT5cblx0XHRcdFx0YGhzbCgke2MudmFsdWUuaHVlfSwgJHtjLnZhbHVlLnNhdHVyYXRpb259JSwgJHtjLnZhbHVlLmxpZ2h0bmVzc30lLCR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdGhzdjogKGM6IGNvbG9ycy5IU1YpID0+XG5cdFx0XHRcdGBoc3YoJHtjLnZhbHVlLmh1ZX0sICR7Yy52YWx1ZS5zYXR1cmF0aW9ufSUsICR7Yy52YWx1ZS52YWx1ZX0lLCR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdGxhYjogKGM6IGNvbG9ycy5MQUIpID0+XG5cdFx0XHRcdGBsYWIoJHtjLnZhbHVlLmx9LCAke2MudmFsdWUuYX0sICR7Yy52YWx1ZS5ifSwke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHRyZ2I6IChjOiBjb2xvcnMuUkdCKSA9PlxuXHRcdFx0XHRgcmdiKCR7Yy52YWx1ZS5yZWR9LCAke2MudmFsdWUuZ3JlZW59LCAke2MudmFsdWUuYmx1ZX0sJHtjLnZhbHVlLmFscGhhfSlgLFxuXHRcdFx0eHl6OiAoYzogY29sb3JzLlhZWikgPT5cblx0XHRcdFx0YHh5eigke2MudmFsdWUueH0sICR7Yy52YWx1ZS55fSwgJHtjLnZhbHVlLnp9LCR7Yy52YWx1ZS5hbHBoYX0pYFxuXHRcdH07XG5cblx0XHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmNteWsoY29sb3IpO1xuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMuaGV4KGNvbG9yKTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmhzbChjb2xvcik7XG5cdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5oc3YoY29sb3IpO1xuXHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMubGFiKGNvbG9yKTtcblx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLnJnYihjb2xvcik7XG5cdFx0XHRjYXNlICd4eXonOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy54eXooY29sb3IpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0IGZvciAke2NvbG9yfWApO1xuXG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBnZXRDb2xvclN0cmluZyBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldENTU0NvbG9yU3RyaW5nKGNvbG9yOiBjb2xvcnMuQ29sb3IpOiBzdHJpbmcge1xuXHR0cnkge1xuXHRcdHN3aXRjaCAoY29sb3IuZm9ybWF0KSB7XG5cdFx0XHRjYXNlICdjbXlrJzpcblx0XHRcdFx0cmV0dXJuIGBjbXlrKCR7Y29sb3IudmFsdWUuY3lhbn0sJHtjb2xvci52YWx1ZS5tYWdlbnRhfSwke2NvbG9yLnZhbHVlLnllbGxvd30sJHtjb2xvci52YWx1ZS5rZXl9JHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBTdHJpbmcoY29sb3IudmFsdWUuaGV4KTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiBgaHNsKCR7Y29sb3IudmFsdWUuaHVlfSwke2NvbG9yLnZhbHVlLnNhdHVyYXRpb259JSwke2NvbG9yLnZhbHVlLmxpZ2h0bmVzc30lLCR7Y29sb3IudmFsdWUuYWxwaGF9KWA7XG5cdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRyZXR1cm4gYGhzdigke2NvbG9yLnZhbHVlLmh1ZX0sJHtjb2xvci52YWx1ZS5zYXR1cmF0aW9ufSUsJHtjb2xvci52YWx1ZS52YWx1ZX0lLCR7Y29sb3IudmFsdWUuYWxwaGF9KWA7XG5cdFx0XHRjYXNlICdsYWInOlxuXHRcdFx0XHRyZXR1cm4gYGxhYigke2NvbG9yLnZhbHVlLmx9LCR7Y29sb3IudmFsdWUuYX0sJHtjb2xvci52YWx1ZS5ifSwke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0Y2FzZSAncmdiJzpcblx0XHRcdFx0cmV0dXJuIGByZ2IoJHtjb2xvci52YWx1ZS5yZWR9LCR7Y29sb3IudmFsdWUuZ3JlZW59LCR7Y29sb3IudmFsdWUuYmx1ZX0sJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdHJldHVybiBgeHl6KCR7Y29sb3IudmFsdWUueH0sJHtjb2xvci52YWx1ZS55fSwke2NvbG9yLnZhbHVlLnp9LCR7Y29sb3IudmFsdWUuYWxwaGF9KWA7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdVbmV4cGVjdGVkIGNvbG9yIGZvcm1hdCcpO1xuXG5cdFx0XHRcdHJldHVybiAnI0ZGRkZGRkZGJztcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgZ2V0Q1NTQ29sb3JTdHJpbmcgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gJyNGRkZGRkZGRic7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4QWxwaGFUb051bWVyaWNBbHBoYShoZXhBbHBoYTogc3RyaW5nKTogbnVtYmVyIHtcblx0cmV0dXJuIHBhcnNlSW50KGhleEFscGhhLCAxNikgLyAyNTU7XG59XG5cbmNvbnN0IHBhcnNlQ29sb3IgPSAoXG5cdGNvbG9yU3BhY2U6IGNvbG9ycy5Db2xvclNwYWNlLFxuXHR2YWx1ZTogc3RyaW5nXG4pOiBjb2xvcnMuQ29sb3IgfCBudWxsID0+IHtcblx0dHJ5IHtcblx0XHRzd2l0Y2ggKGNvbG9yU3BhY2UpIHtcblx0XHRcdGNhc2UgJ2NteWsnOiB7XG5cdFx0XHRcdGNvbnN0IFtjLCBtLCB5LCBrLCBhXSA9IHBhcnNlQ29tcG9uZW50cyh2YWx1ZSwgNSk7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZTogeyBjeWFuOiBjLCBtYWdlbnRhOiBtLCB5ZWxsb3c6IHksIGtleTogaywgYWxwaGE6IGEgfSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0Y29uc3QgaGV4VmFsdWUgPSB2YWx1ZS5zdGFydHNXaXRoKCcjJykgPyB2YWx1ZSA6IGAjJHt2YWx1ZX1gO1xuXHRcdFx0XHRjb25zdCBhbHBoYSA9IGhleFZhbHVlLmxlbmd0aCA9PT0gOSA/IGhleFZhbHVlLnNsaWNlKC0yKSA6ICdGRic7XG5cdFx0XHRcdGNvbnN0IG51bWVyaWNBbHBoYSA9IGhleEFscGhhVG9OdW1lcmljQWxwaGEoYWxwaGEpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGhleDogaGV4VmFsdWUsXG5cdFx0XHRcdFx0XHRhbHBoYSxcblx0XHRcdFx0XHRcdG51bWVyaWNBbHBoYVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHR9O1xuXHRcdFx0Y2FzZSAnaHNsJzoge1xuXHRcdFx0XHRjb25zdCBbaCwgcywgbCwgYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHsgaHVlOiBoLCBzYXR1cmF0aW9uOiBzLCBsaWdodG5lc3M6IGwsIGFscGhhOiBhIH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAnaHN2Jzoge1xuXHRcdFx0XHRjb25zdCBbaCwgcywgdiwgYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHsgaHVlOiBoLCBzYXR1cmF0aW9uOiBzLCB2YWx1ZTogdiwgYWxwaGE6IGEgfSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdsYWInOiB7XG5cdFx0XHRcdGNvbnN0IFtsLCBhLCBiLCBhbHBoYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXHRcdFx0XHRyZXR1cm4geyB2YWx1ZTogeyBsLCBhLCBiLCBhbHBoYSB9LCBmb3JtYXQ6ICdsYWInIH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdyZ2InOiB7XG5cdFx0XHRcdGNvbnN0IFtyLCBnLCBiLCBhXSA9IHZhbHVlLnNwbGl0KCcsJykubWFwKE51bWJlcik7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZTogeyByZWQ6IHIsIGdyZWVuOiBnLCBibHVlOiBiLCBhbHBoYTogYSB9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yU3BhY2V9YCk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYHBhcnNlQ29sb3IgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufTtcblxuZnVuY3Rpb24gcGFyc2VDb21wb25lbnRzKHZhbHVlOiBzdHJpbmcsIGNvdW50OiBudW1iZXIpOiBudW1iZXJbXSB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29tcG9uZW50cyA9IHZhbHVlXG5cdFx0XHQuc3BsaXQoJywnKVxuXHRcdFx0Lm1hcCh2YWwgPT5cblx0XHRcdFx0dmFsLnRyaW0oKS5lbmRzV2l0aCgnJScpXG5cdFx0XHRcdFx0PyBwYXJzZUZsb2F0KHZhbClcblx0XHRcdFx0XHQ6IHBhcnNlRmxvYXQodmFsKSAqIDEwMFxuXHRcdFx0KTtcblxuXHRcdGlmIChjb21wb25lbnRzLmxlbmd0aCAhPT0gY291bnQpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkICR7Y291bnR9IGNvbXBvbmVudHMuYCk7XG5cblx0XHRyZXR1cm4gY29tcG9uZW50cztcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBwYXJzaW5nIGNvbXBvbmVudHM6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gW107XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VDdXN0b21Db2xvcihyYXdWYWx1ZTogc3RyaW5nKTogY29sb3JzLkhTTCB8IG51bGwge1xuXHR0cnkge1xuXHRcdGNvbnNvbGUubG9nKGBQYXJzaW5nIGN1c3RvbSBjb2xvcjogJHtKU09OLnN0cmluZ2lmeShyYXdWYWx1ZSl9YCk7XG5cblx0XHRjb25zdCBtYXRjaCA9IHJhd1ZhbHVlLm1hdGNoKFxuXHRcdFx0L2hzbFxcKChcXGQrKSxcXHMqKFxcZCspJT8sXFxzKihcXGQrKSU/LFxccyooXFxkKlxcLj9cXGQrKVxcKS9cblx0XHQpO1xuXG5cdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHRjb25zdCBbLCBodWUsIHNhdHVyYXRpb24sIGxpZ2h0bmVzcywgYWxwaGFdID0gbWF0Y2g7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiBOdW1iZXIoaHVlKSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBOdW1iZXIoc2F0dXJhdGlvbiksXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiBOdW1iZXIobGlnaHRuZXNzKSxcblx0XHRcdFx0XHRhbHBoYTogTnVtYmVyKGFscGhhKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHQnSW52YWxpZCBIU0wgY3VzdG9tIGNvbG9yLiBFeHBlY3RlZCBmb3JtYXQ6IGhzbChILCBTJSwgTCUsIEEpJ1xuXHRcdFx0KTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBwYXJzZUN1c3RvbUNvbG9yIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VIZXhXaXRoQWxwaGEoaGV4VmFsdWU6IHN0cmluZyk6IGNvbG9ycy5IZXhWYWx1ZSB8IG51bGwge1xuXHRjb25zdCBoZXggPSBoZXhWYWx1ZS5zdGFydHNXaXRoKCcjJykgPyBoZXhWYWx1ZSA6IGAjJHtoZXhWYWx1ZX1gO1xuXHRjb25zdCBhbHBoYSA9IGhleC5sZW5ndGggPT09IDkgPyBoZXguc2xpY2UoLTIpIDogJ0ZGJztcblx0Y29uc3QgbnVtZXJpY0FscGhhID0gaGV4QWxwaGFUb051bWVyaWNBbHBoYShhbHBoYSk7XG5cblx0cmV0dXJuIHsgaGV4LCBhbHBoYSwgbnVtZXJpY0FscGhhIH07XG59XG5cbmZ1bmN0aW9uIHN0cmlwSGFzaEZyb21IZXgoaGV4OiBjb2xvcnMuSGV4KTogY29sb3JzLkhleCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgaGV4U3RyaW5nID0gYCR7aGV4LnZhbHVlLmhleH0ke2hleC52YWx1ZS5hbHBoYX1gO1xuXG5cdFx0cmV0dXJuIGhleC52YWx1ZS5oZXguc3RhcnRzV2l0aCgnIycpXG5cdFx0XHQ/IHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aGV4OiBoZXhTdHJpbmcuc2xpY2UoMSksXG5cdFx0XHRcdFx0XHRhbHBoYTogaGV4LnZhbHVlLmFscGhhLFxuXHRcdFx0XHRcdFx0bnVtZXJpY0FscGhhOiBoZXhBbHBoYVRvTnVtZXJpY0FscGhhKGhleC52YWx1ZS5hbHBoYSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hleCcgYXMgJ2hleCdcblx0XHRcdFx0fVxuXHRcdFx0OiBoZXg7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgc3RyaXBIYXNoRnJvbUhleCBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmhleCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc3RyaXBQZXJjZW50RnJvbVZhbHVlczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgbnVtYmVyIHwgc3RyaW5nPj4oXG5cdHZhbHVlOiBUXG4pOiB7IFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgYCR7bnVtYmVyfSVgID8gbnVtYmVyIDogVFtLXSB9IHtcblx0cmV0dXJuIE9iamVjdC5lbnRyaWVzKHZhbHVlKS5yZWR1Y2UoXG5cdFx0KGFjYywgW2tleSwgdmFsXSkgPT4ge1xuXHRcdFx0Y29uc3QgcGFyc2VkVmFsdWUgPVxuXHRcdFx0XHR0eXBlb2YgdmFsID09PSAnc3RyaW5nJyAmJiB2YWwuZW5kc1dpdGgoJyUnKVxuXHRcdFx0XHRcdD8gcGFyc2VGbG9hdCh2YWwuc2xpY2UoMCwgLTEpKVxuXHRcdFx0XHRcdDogdmFsO1xuXHRcdFx0YWNjW2tleSBhcyBrZXlvZiBUXSA9IHBhcnNlZFZhbHVlIGFzIFRba2V5b2YgVF0gZXh0ZW5kcyBgJHtudW1iZXJ9JWBcblx0XHRcdFx0PyBudW1iZXJcblx0XHRcdFx0OiBUW2tleW9mIFRdO1xuXHRcdFx0cmV0dXJuIGFjYztcblx0XHR9LFxuXHRcdHt9IGFzIHsgW0sgaW4ga2V5b2YgVF06IFRbS10gZXh0ZW5kcyBgJHtudW1iZXJ9JWAgPyBudW1iZXIgOiBUW0tdIH1cblx0KTtcbn1cblxuZnVuY3Rpb24gdG9IZXhXaXRoQWxwaGEocmdiVmFsdWU6IGNvbG9ycy5SR0JWYWx1ZSk6IHN0cmluZyB7XG5cdGNvbnN0IHsgcmVkLCBncmVlbiwgYmx1ZSwgYWxwaGEgfSA9IHJnYlZhbHVlO1xuXG5cdGNvbnN0IGhleCA9IGAjJHsoKDEgPDwgMjQpICsgKHJlZCA8PCAxNikgKyAoZ3JlZW4gPDwgOCkgKyBibHVlKVxuXHRcdC50b1N0cmluZygxNilcblx0XHQuc2xpY2UoMSl9YDtcblx0Y29uc3QgYWxwaGFIZXggPSBNYXRoLnJvdW5kKGFscGhhICogMjU1KVxuXHRcdC50b1N0cmluZygxNilcblx0XHQucGFkU3RhcnQoMiwgJzAnKTtcblxuXHRyZXR1cm4gYCR7aGV4fSR7YWxwaGFIZXh9YDtcbn1cblxuZXhwb3J0IGNvbnN0IGNvbG9yVXRpbHM6IGZuT2JqZWN0cy5Db2xvclV0aWxzID0ge1xuXHRhZGRIYXNoVG9IZXgsXG5cdGNvbG9yU3RyaW5nVG9Db2xvcixcblx0Y29sb3JUb0NvbG9yU3RyaW5nLFxuXHRjb21wb25lbnRUb0hleCxcblx0ZW5zdXJlSGFzaCxcblx0Zm9ybWF0Q29sb3IsXG5cdGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMsXG5cdGdldEFscGhhRnJvbUhleCxcblx0Z2V0Q29sb3JTdHJpbmcsXG5cdGdldENTU0NvbG9yU3RyaW5nLFxuXHRoZXhBbHBoYVRvTnVtZXJpY0FscGhhLFxuXHRpc0NNWUtDb2xvcixcblx0aXNDTVlLRm9ybWF0LFxuXHRpc0NNWUtTdHJpbmcsXG5cdGlzQ29sb3IsXG5cdGlzQ29sb3JGb3JtYXQsXG5cdGlzQ29sb3JTdHJpbmcsXG5cdGlzQ29sb3JTcGFjZSxcblx0aXNDb2xvclNwYWNlRXh0ZW5kZWQsXG5cdGlzQ29udmVydGlibGVDb2xvcixcblx0aXNGb3JtYXQsXG5cdGlzSGV4LFxuXHRpc0hleEZvcm1hdCxcblx0aXNIU0xDb2xvcixcblx0aXNIU0xGb3JtYXQsXG5cdGlzSFNMU3RyaW5nLFxuXHRpc0lucHV0RWxlbWVudCxcblx0aXNIU1ZDb2xvcixcblx0aXNIU1ZGb3JtYXQsXG5cdGlzSFNWU3RyaW5nLFxuXHRpc0xBQixcblx0aXNMQUJGb3JtYXQsXG5cdGlzUkdCLFxuXHRpc1JHQkZvcm1hdCxcblx0aXNTTENvbG9yLFxuXHRpc1NMRm9ybWF0LFxuXHRpc1NMU3RyaW5nLFxuXHRpc1N0b3JlZFBhbGV0dGUsXG5cdGlzU1ZDb2xvcixcblx0aXNTVkZvcm1hdCxcblx0aXNTVlN0cmluZyxcblx0aXNYWVosXG5cdGlzWFlaRm9ybWF0LFxuXHRuYXJyb3dUb0NvbG9yLFxuXHRwYXJzZUNvbG9yLFxuXHRwYXJzZUNvbXBvbmVudHMsXG5cdHBhcnNlQ3VzdG9tQ29sb3IsXG5cdHBhcnNlSGV4V2l0aEFscGhhLFxuXHRzdHJpcEhhc2hGcm9tSGV4LFxuXHRzdHJpcFBlcmNlbnRGcm9tVmFsdWVzLFxuXHR0b0hleFdpdGhBbHBoYVxufTtcbiJdfQ==