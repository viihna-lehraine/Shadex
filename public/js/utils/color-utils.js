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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvY29sb3ItdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNwQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFLOUMsa0RBQWtEO0FBRWxELFNBQVMsT0FBTyxDQUFDLEtBQWM7SUFDOUIsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUk7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUU5RCxNQUFNLEtBQUssR0FBRyxLQUFxQixDQUFDO0lBQ3BDLE1BQU0sWUFBWSxHQUE2QjtRQUM5QyxNQUFNO1FBQ04sS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxJQUFJO1FBQ0osSUFBSTtRQUNKLEtBQUs7S0FDTCxDQUFDO0lBRUYsT0FBTyxDQUNOLE9BQU8sSUFBSSxLQUFLO1FBQ2hCLFFBQVEsSUFBSSxLQUFLO1FBQ2pCLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUNuQyxDQUFDO0FBQ0gsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUNyQixLQUFtQixFQUNuQixNQUFtQjtJQUVuQixPQUFPLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDO0FBQ2hDLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxLQUFhO0lBQ2xDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQzVCLEtBQWE7SUFFYixPQUFPO1FBQ04sTUFBTTtRQUNOLEtBQUs7UUFDTCxLQUFL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c0JBQXNCO0lBQ3RCLGNBQWM7Q0FDZCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29yZSB9IGZyb20gJy4vY29yZS11dGlscyc7XG5pbXBvcnQgeyBkZWZhdWx0cyB9IGZyb20gJy4uL2NvbmZpZy9kZWZhdWx0cyc7XG5pbXBvcnQgKiBhcyBjb2xvcnMgZnJvbSAnLi4vaW5kZXgvY29sb3JzJztcbmltcG9ydCAqIGFzIGZuT2JqZWN0cyBmcm9tICcuLi9pbmRleC9mbi1vYmplY3RzJztcbmltcG9ydCAqIGFzIGlkYiBmcm9tICcuLi9pbmRleC9kYXRhYmFzZSc7XG5cbi8vICoqKioqKioqIFNFQ1RJT04gMTogUm9idXN0IFR5cGUgR3VhcmRzICoqKioqKioqXG5cbmZ1bmN0aW9uIGlzQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBjb2xvcnMuQ29sb3Ige1xuXHRpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fCB2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG5cdGNvbnN0IGNvbG9yID0gdmFsdWUgYXMgY29sb3JzLkNvbG9yO1xuXHRjb25zdCB2YWxpZEZvcm1hdHM6IGNvbG9ycy5Db2xvclsnZm9ybWF0J11bXSA9IFtcblx0XHQnY215aycsXG5cdFx0J2hleCcsXG5cdFx0J2hzbCcsXG5cdFx0J2hzdicsXG5cdFx0J2xhYicsXG5cdFx0J3JnYicsXG5cdFx0J3NsJyxcblx0XHQnc3YnLFxuXHRcdCd4eXonXG5cdF07XG5cblx0cmV0dXJuIChcblx0XHQndmFsdWUnIGluIGNvbG9yICYmXG5cdFx0J2Zvcm1hdCcgaW4gY29sb3IgJiZcblx0XHR2YWxpZEZvcm1hdHMuaW5jbHVkZXMoY29sb3IuZm9ybWF0KVxuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0NvbG9yRm9ybWF0PFQgZXh0ZW5kcyBjb2xvcnMuQ29sb3I+KFxuXHRjb2xvcjogY29sb3JzLkNvbG9yLFxuXHRmb3JtYXQ6IFRbJ2Zvcm1hdCddXG4pOiBjb2xvciBpcyBUIHtcblx0cmV0dXJuIGNvbG9yLmZvcm1hdCA9PT0gZm9ybWF0O1xufVxuXG5mdW5jdGlvbiBpc0NvbG9yU3BhY2UodmFsdWU6IHN0cmluZyk6IHZhbHVlIGlzIGNvbG9ycy5Db2xvclNwYWNlIHtcblx0cmV0dXJuIFsnY215aycsICdoZXgnLCAnaHNsJywgJ2hzdicsICdsYWInLCAncmdiJywgJ3h5eiddLmluY2x1ZGVzKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gaXNDb2xvclNwYWNlRXh0ZW5kZWQoXG5cdHZhbHVlOiBzdHJpbmdcbik6IHZhbHVlIGlzIGNvbG9ycy5Db2xvclNwYWNlRXh0ZW5kZWQge1xuXHRyZXR1cm4gW1xuXHRcdCdjbXlrJyxcblx0XHQnaGV4Jyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnbGFiJyxcblx0XHQncmdiJyxcblx0XHQnc2wnLFxuXHRcdCdzdicsXG5cdFx0J3h5eidcblx0XS5pbmNsdWRlcyh2YWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbG9yU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgY29sb3JzLkNvbG9yU3RyaW5nIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuXHRjb25zdCBjb2xvclN0cmluZyA9IHZhbHVlIGFzIGNvbG9ycy5Db2xvclN0cmluZztcblx0Y29uc3QgdmFsaWRTdHJpbmdGb3JtYXRzOiBjb2xvcnMuQ29sb3JTdHJpbmdbJ2Zvcm1hdCddW10gPSBbXG5cdFx0J2NteWsnLFxuXHRcdCdoc2wnLFxuXHRcdCdoc3YnLFxuXHRcdCdzbCcsXG5cdFx0J3N2J1xuXHRdO1xuXG5cdHJldHVybiAoXG5cdFx0J3ZhbHVlJyBpbiBjb2xvclN0cmluZyAmJlxuXHRcdCdmb3JtYXQnIGluIGNvbG9yU3RyaW5nICYmXG5cdFx0dmFsaWRTdHJpbmdGb3JtYXRzLmluY2x1ZGVzKGNvbG9yU3RyaW5nLmZvcm1hdClcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNGb3JtYXQoZm9ybWF0OiB1bmtub3duKTogZm9ybWF0IGlzIGNvbG9ycy5Gb3JtYXQge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiBmb3JtYXQgPT09ICdzdHJpbmcnICYmXG5cdFx0WydjbXlrJywgJ2hleCcsICdoc2wnLCAnaHN2JywgJ2xhYicsICdyZ2InLCAnc2wnLCAnc3YnLCAneHl6J10uaW5jbHVkZXMoXG5cdFx0XHRmb3JtYXRcblx0XHQpXG5cdCk7XG59XG5cbi8vICoqKioqKioqIFNFQ1RJT24gMjogTmFycm93ZXIgVHlwZSBHdWFyZHMgKioqKioqKipcblxuZnVuY3Rpb24gaXNDTVlLQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBjb2xvcnMuQ01ZSyB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgY29sb3JzLkNNWUspLmZvcm1hdCA9PT0gJ2NteWsnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkNNWUspLnZhbHVlLmN5YW4gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuQ01ZSykudmFsdWUubWFnZW50YSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5DTVlLKS52YWx1ZS55ZWxsb3cgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuQ01ZSykudmFsdWUua2V5ID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0NNWUtGb3JtYXQoY29sb3I6IGNvbG9ycy5Db2xvcik6IGNvbG9yIGlzIGNvbG9ycy5DTVlLIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdjbXlrJyk7XG59XG5cbmZ1bmN0aW9uIGlzQ01ZS1N0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIGNvbG9ycy5DTVlLU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHRpc0NvbG9yU3RyaW5nKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIGNvbG9ycy5DTVlLU3RyaW5nKS5mb3JtYXQgPT09ICdjbXlrJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5DTVlLU3RyaW5nKS52YWx1ZS5jeWFuID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkNNWUtTdHJpbmcpLnZhbHVlLm1hZ2VudGEgPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuQ01ZS1N0cmluZykudmFsdWUueWVsbG93ID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkNNWUtTdHJpbmcpLnZhbHVlLmtleSA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNIZXgodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBjb2xvcnMuSGV4IHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBjb2xvcnMuSGV4KS5mb3JtYXQgPT09ICdoZXgnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkhleCkudmFsdWUuaGV4ID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hleEZvcm1hdChjb2xvcjogY29sb3JzLkNvbG9yKTogY29sb3IgaXMgY29sb3JzLkhleCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnaGV4Jyk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBjb2xvcnMuSFNMIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBjb2xvcnMuSFNMKS5mb3JtYXQgPT09ICdoc2wnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkhTTCkudmFsdWUuaHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkhTTCkudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5IU0wpLnZhbHVlLmxpZ2h0bmVzcyA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNIU0xGb3JtYXQoY29sb3I6IGNvbG9ycy5Db2xvcik6IGNvbG9yIGlzIGNvbG9ycy5IU0wge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2hzbCcpO1xufVxuXG5mdW5jdGlvbiBpc0hTTFN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIGNvbG9ycy5IU0xTdHJpbmcge1xuXHRyZXR1cm4gKFxuXHRcdGlzQ29sb3JTdHJpbmcodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgY29sb3JzLkhTTFN0cmluZykuZm9ybWF0ID09PSAnaHNsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5IU0xTdHJpbmcpLnZhbHVlLmh1ZSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5IU0xTdHJpbmcpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuSFNMU3RyaW5nKS52YWx1ZS5saWdodG5lc3MgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNWQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBjb2xvcnMuSFNWIHtcblx0cmV0dXJuIChcblx0XHRpc0NvbG9yKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIGNvbG9ycy5IU1YpLmZvcm1hdCA9PT0gJ2hzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuSFNWKS52YWx1ZS5odWUgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuSFNWKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkhTVikudmFsdWUudmFsdWUgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNWRm9ybWF0KGNvbG9yOiBjb2xvcnMuQ29sb3IpOiBjb2xvciBpcyBjb2xvcnMuSFNWIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdoc3YnKTtcbn1cblxuZnVuY3Rpb24gaXNIU1ZTdHJpbmcodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBjb2xvcnMuSFNWU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHRpc0NvbG9yU3RyaW5nKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIGNvbG9ycy5IU1ZTdHJpbmcpLmZvcm1hdCA9PT0gJ2hzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuSFNWU3RyaW5nKS52YWx1ZS5odWUgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuSFNWU3RyaW5nKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkhTVlN0cmluZykudmFsdWUudmFsdWUgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzTEFCKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgY29sb3JzLkxBQiB7XG5cdHJldHVybiAoXG5cdFx0aXNDb2xvcih2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBjb2xvcnMuTEFCKS5mb3JtYXQgPT09ICdsYWInICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLkxBQikudmFsdWUubCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5MQUIpLnZhbHVlLmEgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuTEFCKS52YWx1ZS5iID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0xBQkZvcm1hdChjb2xvcjogY29sb3JzLkNvbG9yKTogY29sb3IgaXMgY29sb3JzLkxBQiB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnbGFiJyk7XG59XG5cbmZ1bmN0aW9uIGlzUkdCKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgY29sb3JzLlJHQiB7XG5cdHJldHVybiAoXG5cdFx0aXNDb2xvcih2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBjb2xvcnMuUkdCKS5mb3JtYXQgPT09ICdyZ2InICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLlJHQikudmFsdWUucmVkID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLlJHQikudmFsdWUuZ3JlZW4gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuUkdCKS52YWx1ZS5ibHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1JHQkZvcm1hdChjb2xvcjogY29sb3JzLkNvbG9yKTogY29sb3IgaXMgY29sb3JzLlJHQiB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAncmdiJyk7XG59XG5cbmZ1bmN0aW9uIGlzU0xDb2xvcih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIGNvbG9ycy5TTCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgY29sb3JzLlNMKS5mb3JtYXQgPT09ICdzbCcgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuU0wpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuU0wpLnZhbHVlLmxpZ2h0bmVzcyA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNTTEZvcm1hdChjb2xvcjogY29sb3JzLkNvbG9yKTogY29sb3IgaXMgY29sb3JzLlNMIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdzbCcpO1xufVxuXG5mdW5jdGlvbiBpc1NMU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgY29sb3JzLlNMU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBjb2xvcnMuU0xTdHJpbmcpLmZvcm1hdCA9PT0gJ3NsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5TTFN0cmluZykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5TTFN0cmluZykudmFsdWUubGlnaHRuZXNzID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1NWQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBjb2xvcnMuU1Yge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIGNvbG9ycy5TVikuZm9ybWF0ID09PSAnc3YnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLlNWKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLlNWKS52YWx1ZS52YWx1ZSA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNTVkZvcm1hdChjb2xvcjogY29sb3JzLkNvbG9yKTogY29sb3IgaXMgY29sb3JzLlNWIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdzdicpO1xufVxuXG5mdW5jdGlvbiBpc1NWU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgY29sb3JzLlNWU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBjb2xvcnMuU1ZTdHJpbmcpLmZvcm1hdCA9PT0gJ3N2JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5TVlN0cmluZykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5TVlN0cmluZykudmFsdWUudmFsdWUgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzWFlaKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgY29sb3JzLlhZWiB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgY29sb3JzLlhZWikuZm9ybWF0ID09PSAneHl6JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIGNvbG9ycy5YWVopLnZhbHVlLnggPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBjb2xvcnMuWFlaKS52YWx1ZS55ID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgY29sb3JzLlhZWikudmFsdWUueiA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNYWVpGb3JtYXQoY29sb3I6IGNvbG9ycy5Db2xvcik6IGNvbG9yIGlzIGNvbG9ycy5YWVoge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ3h5eicpO1xufVxuXG4vLyAqKioqKiBTRUNUSU9OIDM6IFV0aWxpdHkgR3VhcmRzICoqKioqXG5cbmZ1bmN0aW9uIGVuc3VyZUhhc2godmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG5cdHJldHVybiB2YWx1ZS5zdGFydHNXaXRoKCcjJykgPyB2YWx1ZSA6IGAjJHt2YWx1ZX1gO1xufVxuXG5mdW5jdGlvbiBpc0NvbnZlcnRpYmxlQ29sb3IoXG5cdGNvbG9yOiBjb2xvcnMuQ29sb3Jcbik6IGNvbG9yIGlzXG5cdHwgY29sb3JzLkNNWUtcblx0fCBjb2xvcnMuSGV4XG5cdHwgY29sb3JzLkhTTFxuXHR8IGNvbG9ycy5IU1Zcblx0fCBjb2xvcnMuTEFCXG5cdHwgY29sb3JzLlJHQiB7XG5cdHJldHVybiAoXG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnY215aycgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdoZXgnIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnaHNsJyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2hzdicgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdsYWInIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAncmdiJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0lucHV0RWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwpOiBlbGVtZW50IGlzIEhUTUxFbGVtZW50IHtcblx0cmV0dXJuIGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBpc1N0b3JlZFBhbGV0dGUob2JqOiB1bmtub3duKTogb2JqIGlzIGlkYi5TdG9yZWRQYWxldHRlIHtcblx0aWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG5cdGNvbnN0IGNhbmRpZGF0ZSA9IG9iaiBhcyBQYXJ0aWFsPGlkYi5TdG9yZWRQYWxldHRlPjtcblxuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiBjYW5kaWRhdGUudGFibGVJRCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgY2FuZGlkYXRlLnBhbGV0dGUgPT09ICdvYmplY3QnICYmXG5cdFx0QXJyYXkuaXNBcnJheShjYW5kaWRhdGUucGFsZXR0ZS5pdGVtcykgJiZcblx0XHR0eXBlb2YgY2FuZGlkYXRlLnBhbGV0dGUuaWQgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIG5hcnJvd1RvQ29sb3IoXG5cdGNvbG9yOiBjb2xvcnMuQ29sb3IgfCBjb2xvcnMuQ29sb3JTdHJpbmdcbik6IGNvbG9ycy5Db2xvciB8IG51bGwge1xuXHRpZiAoaXNDb2xvclN0cmluZyhjb2xvcikpIHtcblx0XHRyZXR1cm4gY29sb3JTdHJpbmdUb0NvbG9yKGNvbG9yKTtcblx0fVxuXG5cdHN3aXRjaCAoY29sb3IuZm9ybWF0KSB7XG5cdFx0Y2FzZSAnY215ayc6XG5cdFx0Y2FzZSAnaGV4Jzpcblx0XHRjYXNlICdoc2wnOlxuXHRcdGNhc2UgJ2hzdic6XG5cdFx0Y2FzZSAnbGFiJzpcblx0XHRjYXNlICdzbCc6XG5cdFx0Y2FzZSAnc3YnOlxuXHRcdGNhc2UgJ3JnYic6XG5cdFx0Y2FzZSAneHl6Jzpcblx0XHRcdHJldHVybiBjb2xvcjtcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuLy8gKioqKioqKiogU0VDVElPTiA0OiBUUkFOU0ZPUk0gVVRJTFMgKioqKioqKipcblxuZnVuY3Rpb24gYWRkSGFzaFRvSGV4KGhleDogY29sb3JzLkhleCk6IGNvbG9ycy5IZXgge1xuXHR0cnkge1xuXHRcdHJldHVybiBoZXgudmFsdWUuaGV4LnN0YXJ0c1dpdGgoJyMnKVxuXHRcdFx0PyBoZXhcblx0XHRcdDoge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRoZXg6IGAjJHtoZXgudmFsdWV9fWAsXG5cdFx0XHRcdFx0XHRhbHBoYTogaGV4LnZhbHVlLmFscGhhLFxuXHRcdFx0XHRcdFx0bnVtZXJpY0FscGhhOiBoZXgudmFsdWUubnVtZXJpY0FscGhhXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnIGFzICdoZXgnXG5cdFx0XHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgYWRkSGFzaFRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRzLmhleDtcblx0fVxufVxuXG5mdW5jdGlvbiBjb2xvclN0cmluZ1RvQ29sb3IoY29sb3JTdHJpbmc6IGNvbG9ycy5Db2xvclN0cmluZyk6IGNvbG9ycy5Db2xvciB7XG5cdGNvbnN0IGNsb25lZENvbG9yID0gY29yZS5jbG9uZShjb2xvclN0cmluZyk7XG5cblx0Y29uc3QgcGFyc2VWYWx1ZSA9ICh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyID0+XG5cdFx0dHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5lbmRzV2l0aCgnJScpXG5cdFx0XHQ/IHBhcnNlRmxvYXQodmFsdWUuc2xpY2UoMCwgLTEpKVxuXHRcdFx0OiBOdW1iZXIodmFsdWUpO1xuXG5cdGNvbnN0IG5ld1ZhbHVlID0gT2JqZWN0LmVudHJpZXMoY2xvbmVkQ29sb3IudmFsdWUpLnJlZHVjZShcblx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHRhY2Nba2V5IGFzIGtleW9mICh0eXBlb2YgY2xvbmVkQ29sb3IpWyd2YWx1ZSddXSA9IHBhcnNlVmFsdWUoXG5cdFx0XHRcdHZhbFxuXHRcdFx0KSBhcyBuZXZlcjtcblx0XHRcdHJldHVybiBhY2M7XG5cdFx0fSxcblx0XHR7fSBhcyBSZWNvcmQ8a2V5b2YgKHR5cGVvZiBjbG9uZWRDb2xvcilbJ3ZhbHVlJ10sIG51bWJlcj5cblx0KTtcblxuXHRzd2l0Y2ggKGNsb25lZENvbG9yLmZvcm1hdCkge1xuXHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnY215aycsIHZhbHVlOiBuZXdWYWx1ZSBhcyBjb2xvcnMuQ01ZS1ZhbHVlIH07XG5cdFx0Y2FzZSAnaHNsJzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ2hzbCcsIHZhbHVlOiBuZXdWYWx1ZSBhcyBjb2xvcnMuSFNMVmFsdWUgfTtcblx0XHRjYXNlICdoc3YnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnaHN2JywgdmFsdWU6IG5ld1ZhbHVlIGFzIGNvbG9ycy5IU1ZWYWx1ZSB9O1xuXHRcdGNhc2UgJ3NsJzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ3NsJywgdmFsdWU6IG5ld1ZhbHVlIGFzIGNvbG9ycy5TTFZhbHVlIH07XG5cdFx0Y2FzZSAnc3YnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnc3YnLCB2YWx1ZTogbmV3VmFsdWUgYXMgY29sb3JzLlNWVmFsdWUgfTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBmb3JtYXQgZm9yIGNvbG9yU3RyaW5nVG9Db2xvcicpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvbG9yVG9Db2xvclN0cmluZyhcblx0Y29sb3I6IEV4Y2x1ZGU8Y29sb3JzLkNvbG9yLCBjb2xvcnMuSGV4IHwgY29sb3JzLkxBQiB8IGNvbG9ycy5SR0I+XG4pOiBjb2xvcnMuQ29sb3JTdHJpbmcge1xuXHRjb25zdCBjbG9uZWRDb2xvciA9IGNvcmUuY2xvbmUoY29sb3IpIGFzIEV4Y2x1ZGU8XG5cdFx0Y29sb3JzLkNvbG9yLFxuXHRcdGNvbG9ycy5IZXggfCBjb2xvcnMuTEFCIHwgY29sb3JzLlJHQlxuXHQ+O1xuXG5cdGlmIChpc0NvbG9yU3RyaW5nKGNsb25lZENvbG9yKSkge1xuXHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0YEFscmVhZHkgZm9ybWF0dGVkIGFzIGNvbG9yIHN0cmluZzogJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YFxuXHRcdCk7XG5cblx0XHRyZXR1cm4gY2xvbmVkQ29sb3I7XG5cdH1cblxuXHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoY2xvbmVkQ29sb3IudmFsdWUpO1xuXG5cdGlmIChpc0NNWUtDb2xvcihjbG9uZWRDb2xvcikpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnY215aycsXG5cdFx0XHR2YWx1ZTogbmV3VmFsdWUgYXMgdW5rbm93biBhcyBjb2xvcnMuQ01ZS1ZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc0hTTENvbG9yKGNsb25lZENvbG9yKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdoc2wnLFxuXHRcdFx0dmFsdWU6IG5ld1ZhbHVlIGFzIHVua25vd24gYXMgY29sb3JzLkhTTFZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc0hTVkNvbG9yKGNsb25lZENvbG9yKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdoc3YnLFxuXHRcdFx0dmFsdWU6IG5ld1ZhbHVlIGFzIHVua25vd24gYXMgY29sb3JzLkhTVlZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGZvcm1hdDogJHtjbG9uZWRDb2xvci5mb3JtYXR9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0Q29sb3IoXG5cdGNvbG9yOiBjb2xvcnMuQ29sb3IsXG5cdGFzQ29sb3JTdHJpbmc6IGJvb2xlYW4gPSBmYWxzZSxcblx0YXNDU1NTdHJpbmc6IGJvb2xlYW4gPSBmYWxzZVxuKTogeyBiYXNlQ29sb3I6IGNvbG9ycy5Db2xvcjsgZm9ybWF0dGVkU3RyaW5nPzogY29sb3JzLkNvbG9yU3RyaW5nIHwgc3RyaW5nIH0ge1xuXHRjb25zdCBiYXNlQ29sb3IgPSBjb3JlLmNsb25lKGNvbG9yKTtcblxuXHRsZXQgZm9ybWF0dGVkU3RyaW5nOiBjb2xvcnMuQ29sb3JTdHJpbmcgfCBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cblx0aWYgKGFzQ29sb3JTdHJpbmcpIHtcblx0XHRmb3JtYXR0ZWRTdHJpbmcgPSBjb2xvclRvQ29sb3JTdHJpbmcoXG5cdFx0XHRjb2xvciBhcyBFeGNsdWRlPGNvbG9ycy5Db2xvciwgY29sb3JzLkhleCB8IGNvbG9ycy5MQUIgfCBjb2xvcnMuUkdCPlxuXHRcdCkgYXMgY29sb3JzLkNvbG9yU3RyaW5nO1xuXHR9IGVsc2UgaWYgKGFzQ1NTU3RyaW5nKSB7XG5cdFx0Zm9ybWF0dGVkU3RyaW5nID0gZ2V0Q1NTQ29sb3JTdHJpbmcoY29sb3IpIGFzIHN0cmluZztcblx0fVxuXG5cdHJldHVybiBmb3JtYXR0ZWRTdHJpbmcgIT09IHVuZGVmaW5lZFxuXHRcdD8geyBiYXNlQ29sb3IsIGZvcm1hdHRlZFN0cmluZyB9XG5cdFx0OiB7IGJhc2VDb2xvciB9O1xufVxuXG5mdW5jdGlvbiBmb3JtYXRQZXJjZW50YWdlVmFsdWVzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oXG5cdHZhbHVlOiBUXG4pOiBUIHtcblx0cmV0dXJuIE9iamVjdC5lbnRyaWVzKHZhbHVlKS5yZWR1Y2UoXG5cdFx0KGFjYywgW2tleSwgdmFsXSkgPT4ge1xuXHRcdFx0KGFjYyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilba2V5XSA9IFtcblx0XHRcdFx0J3NhdHVyYXRpb24nLFxuXHRcdFx0XHQnbGlnaHRuZXNzJyxcblx0XHRcdFx0J3ZhbHVlJyxcblx0XHRcdFx0J2N5YW4nLFxuXHRcdFx0XHQnbWFnZW50YScsXG5cdFx0XHRcdCd5ZWxsb3cnLFxuXHRcdFx0XHQna2V5J1xuXHRcdFx0XS5pbmNsdWRlcyhrZXkpXG5cdFx0XHRcdD8gYCR7dmFsfSVgXG5cdFx0XHRcdDogdmFsO1xuXHRcdFx0cmV0dXJuIGFjYztcblx0XHR9LFxuXHRcdHt9IGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+XG5cdCkgYXMgVDtcbn1cblxuZnVuY3Rpb24gZ2V0QWxwaGFGcm9tSGV4KGhleDogc3RyaW5nKTogbnVtYmVyIHtcblx0aWYgKGhleC5sZW5ndGggIT09IDkgfHwgIWhleC5zdGFydHNXaXRoKCcjJykpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaGV4IGNvbG9yOiAke2hleH0uIEV4cGVjdGVkIGZvcm1hdCAjUlJHR0JCQUFgKTtcblx0fVxuXG5cdGNvbnN0IGFscGhhSGV4ID0gaGV4LnNsaWNlKC0yKTtcblx0Y29uc3QgYWxwaGFEZWNpbWFsID0gcGFyc2VJbnQoYWxwaGFIZXgsIDE2KTtcblxuXHRyZXR1cm4gYWxwaGFEZWNpbWFsIC8gMjU1O1xufVxuXG5mdW5jdGlvbiBjb21wb25lbnRUb0hleChjb21wb25lbnQ6IG51bWJlcik6IHN0cmluZyB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgaGV4ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBjb21wb25lbnQpKS50b1N0cmluZygxNik7XG5cblx0XHRyZXR1cm4gaGV4Lmxlbmd0aCA9PT0gMSA/ICcwJyArIGhleCA6IGhleDtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBjb21wb25lbnRUb0hleCBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiAnMDAnO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldENvbG9yU3RyaW5nKGNvbG9yOiBjb2xvcnMuQ29sb3IpOiBzdHJpbmcgfCBudWxsIHtcblx0dHJ5IHtcblx0XHRjb25zdCBmb3JtYXR0ZXJzID0ge1xuXHRcdFx0Y215azogKGM6IGNvbG9ycy5DTVlLKSA9PlxuXHRcdFx0XHRgY215aygke2MudmFsdWUuY3lhbn0sICR7Yy52YWx1ZS5tYWdlbnRhfSwgJHtjLnZhbHVlLnllbGxvd30sICR7Yy52YWx1ZS5rZXl9LCAke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHRoZXg6IChjOiBjb2xvcnMuSGV4KSA9PiBjLnZhbHVlLmhleCxcblx0XHRcdGhzbDogKGM6IGNvbG9ycy5IU0wpID0+XG5cdFx0XHRcdGBoc2woJHtjLnZhbHVlLmh1ZX0sICR7Yy52YWx1ZS5zYXR1cmF0aW9ufSUsICR7Yy52YWx1ZS5saWdodG5lc3N9JSwke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHRoc3Y6IChjOiBjb2xvcnMuSFNWKSA9PlxuXHRcdFx0XHRgaHN2KCR7Yy52YWx1ZS5odWV9LCAke2MudmFsdWUuc2F0dXJhdGlvbn0lLCAke2MudmFsdWUudmFsdWV9JSwke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHRsYWI6IChjOiBjb2xvcnMuTEFCKSA9PlxuXHRcdFx0XHRgbGFiKCR7Yy52YWx1ZS5sfSwgJHtjLnZhbHVlLmF9LCAke2MudmFsdWUuYn0sJHtjLnZhbHVlLmFscGhhfSlgLFxuXHRcdFx0cmdiOiAoYzogY29sb3JzLlJHQikgPT5cblx0XHRcdFx0YHJnYigke2MudmFsdWUucmVkfSwgJHtjLnZhbHVlLmdyZWVufSwgJHtjLnZhbHVlLmJsdWV9LCR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdHh5ejogKGM6IGNvbG9ycy5YWVopID0+XG5cdFx0XHRcdGB4eXooJHtjLnZhbHVlLnh9LCAke2MudmFsdWUueX0sICR7Yy52YWx1ZS56fSwke2MudmFsdWUuYWxwaGF9KWBcblx0XHR9O1xuXG5cdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5jbXlrKGNvbG9yKTtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmhleChjb2xvcik7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5oc2woY29sb3IpO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMuaHN2KGNvbG9yKTtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmxhYihjb2xvcik7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5yZ2IoY29sb3IpO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMueHl6KGNvbG9yKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdCBmb3IgJHtjb2xvcn1gKTtcblxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgZ2V0Q29sb3JTdHJpbmcgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRDU1NDb2xvclN0cmluZyhjb2xvcjogY29sb3JzLkNvbG9yKTogc3RyaW5nIHtcblx0dHJ5IHtcblx0XHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdHJldHVybiBgY215aygke2NvbG9yLnZhbHVlLmN5YW59LCR7Y29sb3IudmFsdWUubWFnZW50YX0sJHtjb2xvci52YWx1ZS55ZWxsb3d9LCR7Y29sb3IudmFsdWUua2V5fSR7Y29sb3IudmFsdWUuYWxwaGF9KWA7XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRyZXR1cm4gU3RyaW5nKGNvbG9yLnZhbHVlLmhleCk7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gYGhzbCgke2NvbG9yLnZhbHVlLmh1ZX0sJHtjb2xvci52YWx1ZS5zYXR1cmF0aW9ufSUsJHtjb2xvci52YWx1ZS5saWdodG5lc3N9JSwke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGBoc3YoJHtjb2xvci52YWx1ZS5odWV9LCR7Y29sb3IudmFsdWUuc2F0dXJhdGlvbn0lLCR7Y29sb3IudmFsdWUudmFsdWV9JSwke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0cmV0dXJuIGBsYWIoJHtjb2xvci52YWx1ZS5sfSwke2NvbG9yLnZhbHVlLmF9LCR7Y29sb3IudmFsdWUuYn0sJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdHJldHVybiBgcmdiKCR7Y29sb3IudmFsdWUucmVkfSwke2NvbG9yLnZhbHVlLmdyZWVufSwke2NvbG9yLnZhbHVlLmJsdWV9LCR7Y29sb3IudmFsdWUuYWxwaGF9KWA7XG5cdFx0XHRjYXNlICd4eXonOlxuXHRcdFx0XHRyZXR1cm4gYHh5eigke2NvbG9yLnZhbHVlLnh9LCR7Y29sb3IudmFsdWUueX0sJHtjb2xvci52YWx1ZS56fSwke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Y29uc29sZS5lcnJvcignVW5leHBlY3RlZCBjb2xvciBmb3JtYXQnKTtcblxuXHRcdFx0XHRyZXR1cm4gJyNGRkZGRkZGRic7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGdldENTU0NvbG9yU3RyaW5nIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuICcjRkZGRkZGRkYnO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleEFscGhhVG9OdW1lcmljQWxwaGEoaGV4QWxwaGE6IHN0cmluZyk6IG51bWJlciB7XG5cdHJldHVybiBwYXJzZUludChoZXhBbHBoYSwgMTYpIC8gMjU1O1xufVxuXG5jb25zdCBwYXJzZUNvbG9yID0gKFxuXHRjb2xvclNwYWNlOiBjb2xvcnMuQ29sb3JTcGFjZSxcblx0dmFsdWU6IHN0cmluZ1xuKTogY29sb3JzLkNvbG9yIHwgbnVsbCA9PiB7XG5cdHRyeSB7XG5cdFx0c3dpdGNoIChjb2xvclNwYWNlKSB7XG5cdFx0XHRjYXNlICdjbXlrJzoge1xuXHRcdFx0XHRjb25zdCBbYywgbSwgeSwgaywgYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDUpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHsgY3lhbjogYywgbWFnZW50YTogbSwgeWVsbG93OiB5LCBrZXk6IGssIGFscGhhOiBhIH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdGNvbnN0IGhleFZhbHVlID0gdmFsdWUuc3RhcnRzV2l0aCgnIycpID8gdmFsdWUgOiBgIyR7dmFsdWV9YDtcblx0XHRcdFx0Y29uc3QgYWxwaGEgPSBoZXhWYWx1ZS5sZW5ndGggPT09IDkgPyBoZXhWYWx1ZS5zbGljZSgtMikgOiAnRkYnO1xuXHRcdFx0XHRjb25zdCBudW1lcmljQWxwaGEgPSBoZXhBbHBoYVRvTnVtZXJpY0FscGhhKGFscGhhKTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRoZXg6IGhleFZhbHVlLFxuXHRcdFx0XHRcdFx0YWxwaGEsXG5cdFx0XHRcdFx0XHRudW1lcmljQWxwaGFcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdFx0fTtcblx0XHRcdGNhc2UgJ2hzbCc6IHtcblx0XHRcdFx0Y29uc3QgW2gsIHMsIGwsIGFdID0gcGFyc2VDb21wb25lbnRzKHZhbHVlLCA0KTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7IGh1ZTogaCwgc2F0dXJhdGlvbjogcywgbGlnaHRuZXNzOiBsLCBhbHBoYTogYSB9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGNhc2UgJ2hzdic6IHtcblx0XHRcdFx0Y29uc3QgW2gsIHMsIHYsIGFdID0gcGFyc2VDb21wb25lbnRzKHZhbHVlLCA0KTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7IGh1ZTogaCwgc2F0dXJhdGlvbjogcywgdmFsdWU6IHYsIGFscGhhOiBhIH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAnbGFiJzoge1xuXHRcdFx0XHRjb25zdCBbbCwgYSwgYiwgYWxwaGFdID0gcGFyc2VDb21wb25lbnRzKHZhbHVlLCA0KTtcblx0XHRcdFx0cmV0dXJuIHsgdmFsdWU6IHsgbCwgYSwgYiwgYWxwaGEgfSwgZm9ybWF0OiAnbGFiJyB9O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAncmdiJzoge1xuXHRcdFx0XHRjb25zdCBbciwgZywgYiwgYV0gPSB2YWx1ZS5zcGxpdCgnLCcpLm1hcChOdW1iZXIpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHsgcmVkOiByLCBncmVlbjogZywgYmx1ZTogYiwgYWxwaGE6IGEgfSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtjb2xvclNwYWNlfWApO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBwYXJzZUNvbG9yIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn07XG5cbmZ1bmN0aW9uIHBhcnNlQ29tcG9uZW50cyh2YWx1ZTogc3RyaW5nLCBjb3VudDogbnVtYmVyKTogbnVtYmVyW10ge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNvbXBvbmVudHMgPSB2YWx1ZVxuXHRcdFx0LnNwbGl0KCcsJylcblx0XHRcdC5tYXAodmFsID0+XG5cdFx0XHRcdHZhbC50cmltKCkuZW5kc1dpdGgoJyUnKVxuXHRcdFx0XHRcdD8gcGFyc2VGbG9hdCh2YWwpXG5cdFx0XHRcdFx0OiBwYXJzZUZsb2F0KHZhbCkgKiAxMDBcblx0XHRcdCk7XG5cblx0XHRpZiAoY29tcG9uZW50cy5sZW5ndGggIT09IGNvdW50KVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCAke2NvdW50fSBjb21wb25lbnRzLmApO1xuXG5cdFx0cmV0dXJuIGNvbXBvbmVudHM7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgcGFyc2luZyBjb21wb25lbnRzOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIFtdO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ3VzdG9tQ29sb3IocmF3VmFsdWU6IHN0cmluZyk6IGNvbG9ycy5IU0wgfCBudWxsIHtcblx0dHJ5IHtcblx0XHRjb25zb2xlLmxvZyhgUGFyc2luZyBjdXN0b20gY29sb3I6ICR7SlNPTi5zdHJpbmdpZnkocmF3VmFsdWUpfWApO1xuXG5cdFx0Y29uc3QgbWF0Y2ggPSByYXdWYWx1ZS5tYXRjaChcblx0XHRcdC9oc2xcXCgoXFxkKyksXFxzKihcXGQrKSU/LFxccyooXFxkKyklPyxcXHMqKFxcZCpcXC4/XFxkKylcXCkvXG5cdFx0KTtcblxuXHRcdGlmIChtYXRjaCkge1xuXHRcdFx0Y29uc3QgWywgaHVlLCBzYXR1cmF0aW9uLCBsaWdodG5lc3MsIGFscGhhXSA9IG1hdGNoO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogTnVtYmVyKGh1ZSksXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogTnVtYmVyKHNhdHVyYXRpb24pLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogTnVtYmVyKGxpZ2h0bmVzcyksXG5cdFx0XHRcdFx0YWxwaGE6IE51bWJlcihhbHBoYSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0J0ludmFsaWQgSFNMIGN1c3RvbSBjb2xvci4gRXhwZWN0ZWQgZm9ybWF0OiBoc2woSCwgUyUsIEwlLCBBKSdcblx0XHRcdCk7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgcGFyc2VDdXN0b21Db2xvciBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHBhcnNlSGV4V2l0aEFscGhhKGhleFZhbHVlOiBzdHJpbmcpOiBjb2xvcnMuSGV4VmFsdWUgfCBudWxsIHtcblx0Y29uc3QgaGV4ID0gaGV4VmFsdWUuc3RhcnRzV2l0aCgnIycpID8gaGV4VmFsdWUgOiBgIyR7aGV4VmFsdWV9YDtcblx0Y29uc3QgYWxwaGEgPSBoZXgubGVuZ3RoID09PSA5ID8gaGV4LnNsaWNlKC0yKSA6ICdGRic7XG5cdGNvbnN0IG51bWVyaWNBbHBoYSA9IGhleEFscGhhVG9OdW1lcmljQWxwaGEoYWxwaGEpO1xuXG5cdHJldHVybiB7IGhleCwgYWxwaGEsIG51bWVyaWNBbHBoYSB9O1xufVxuXG5mdW5jdGlvbiBzdHJpcEhhc2hGcm9tSGV4KGhleDogY29sb3JzLkhleCk6IGNvbG9ycy5IZXgge1xuXHR0cnkge1xuXHRcdGNvbnN0IGhleFN0cmluZyA9IGAke2hleC52YWx1ZS5oZXh9JHtoZXgudmFsdWUuYWxwaGF9YDtcblxuXHRcdHJldHVybiBoZXgudmFsdWUuaGV4LnN0YXJ0c1dpdGgoJyMnKVxuXHRcdFx0PyB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGhleDogaGV4U3RyaW5nLnNsaWNlKDEpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGhleC52YWx1ZS5hbHBoYSxcblx0XHRcdFx0XHRcdG51bWVyaWNBbHBoYTogaGV4QWxwaGFUb051bWVyaWNBbHBoYShoZXgudmFsdWUuYWxwaGEpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnIGFzICdoZXgnXG5cdFx0XHRcdH1cblx0XHRcdDogaGV4O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYHN0cmlwSGFzaEZyb21IZXggZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5oZXgpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHN0cmlwUGVyY2VudEZyb21WYWx1ZXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIG51bWJlciB8IHN0cmluZz4+KFxuXHR2YWx1ZTogVFxuKTogeyBbSyBpbiBrZXlvZiBUXTogVFtLXSBleHRlbmRzIGAke251bWJlcn0lYCA/IG51bWJlciA6IFRbS10gfSB7XG5cdHJldHVybiBPYmplY3QuZW50cmllcyh2YWx1ZSkucmVkdWNlKFxuXHRcdChhY2MsIFtrZXksIHZhbF0pID0+IHtcblx0XHRcdGNvbnN0IHBhcnNlZFZhbHVlID1cblx0XHRcdFx0dHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgdmFsLmVuZHNXaXRoKCclJylcblx0XHRcdFx0XHQ/IHBhcnNlRmxvYXQodmFsLnNsaWNlKDAsIC0xKSlcblx0XHRcdFx0XHQ6IHZhbDtcblx0XHRcdGFjY1trZXkgYXMga2V5b2YgVF0gPSBwYXJzZWRWYWx1ZSBhcyBUW2tleW9mIFRdIGV4dGVuZHMgYCR7bnVtYmVyfSVgXG5cdFx0XHRcdD8gbnVtYmVyXG5cdFx0XHRcdDogVFtrZXlvZiBUXTtcblx0XHRcdHJldHVybiBhY2M7XG5cdFx0fSxcblx0XHR7fSBhcyB7IFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgYCR7bnVtYmVyfSVgID8gbnVtYmVyIDogVFtLXSB9XG5cdCk7XG59XG5cbmZ1bmN0aW9uIHRvSGV4V2l0aEFscGhhKHJnYlZhbHVlOiBjb2xvcnMuUkdCVmFsdWUpOiBzdHJpbmcge1xuXHRjb25zdCB7IHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhIH0gPSByZ2JWYWx1ZTtcblxuXHRjb25zdCBoZXggPSBgIyR7KCgxIDw8IDI0KSArIChyZWQgPDwgMTYpICsgKGdyZWVuIDw8IDgpICsgYmx1ZSlcblx0XHQudG9TdHJpbmcoMTYpXG5cdFx0LnNsaWNlKDEpfWA7XG5cdGNvbnN0IGFscGhhSGV4ID0gTWF0aC5yb3VuZChhbHBoYSAqIDI1NSlcblx0XHQudG9TdHJpbmcoMTYpXG5cdFx0LnBhZFN0YXJ0KDIsICcwJyk7XG5cblx0cmV0dXJuIGAke2hleH0ke2FscGhhSGV4fWA7XG59XG5cbmV4cG9ydCBjb25zdCBjb2xvclV0aWxzOiBmbk9iamVjdHMuQ29sb3JVdGlscyA9IHtcblx0YWRkSGFzaFRvSGV4LFxuXHRjb2xvclN0cmluZ1RvQ29sb3IsXG5cdGNvbG9yVG9Db2xvclN0cmluZyxcblx0Y29tcG9uZW50VG9IZXgsXG5cdGVuc3VyZUhhc2gsXG5cdGZvcm1hdENvbG9yLFxuXHRmb3JtYXRQZXJjZW50YWdlVmFsdWVzLFxuXHRnZXRBbHBoYUZyb21IZXgsXG5cdGdldENvbG9yU3RyaW5nLFxuXHRnZXRDU1NDb2xvclN0cmluZyxcblx0aGV4QWxwaGFUb051bWVyaWNBbHBoYSxcblx0aXNDTVlLQ29sb3IsXG5cdGlzQ01ZS0Zvcm1hdCxcblx0aXNDTVlLU3RyaW5nLFxuXHRpc0NvbG9yLFxuXHRpc0NvbG9yRm9ybWF0LFxuXHRpc0NvbG9yU3RyaW5nLFxuXHRpc0NvbG9yU3BhY2UsXG5cdGlzQ29sb3JTcGFjZUV4dGVuZGVkLFxuXHRpc0NvbnZlcnRpYmxlQ29sb3IsXG5cdGlzRm9ybWF0LFxuXHRpc0hleCxcblx0aXNIZXhGb3JtYXQsXG5cdGlzSFNMQ29sb3IsXG5cdGlzSFNMRm9ybWF0LFxuXHRpc0hTTFN0cmluZyxcblx0aXNJbnB1dEVsZW1lbnQsXG5cdGlzSFNWQ29sb3IsXG5cdGlzSFNWRm9ybWF0LFxuXHRpc0hTVlN0cmluZyxcblx0aXNMQUIsXG5cdGlzTEFCRm9ybWF0LFxuXHRpc1JHQixcblx0aXNSR0JGb3JtYXQsXG5cdGlzU0xDb2xvcixcblx0aXNTTEZvcm1hdCxcblx0aXNTTFN0cmluZyxcblx0aXNTdG9yZWRQYWxldHRlLFxuXHRpc1NWQ29sb3IsXG5cdGlzU1ZGb3JtYXQsXG5cdGlzU1ZTdHJpbmcsXG5cdGlzWFlaLFxuXHRpc1hZWkZvcm1hdCxcblx0bmFycm93VG9Db2xvcixcblx0cGFyc2VDb2xvcixcblx0cGFyc2VDb21wb25lbnRzLFxuXHRwYXJzZUN1c3RvbUNvbG9yLFxuXHRwYXJzZUhleFdpdGhBbHBoYSxcblx0c3RyaXBIYXNoRnJvbUhleCxcblx0c3RyaXBQZXJjZW50RnJvbVZhbHVlcyxcblx0dG9IZXhXaXRoQWxwaGFcbn07XG4iXX0=