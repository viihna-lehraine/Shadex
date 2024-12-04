// File: src/common/utils/color.ts
import { config } from '../../config';
import { core } from '../core';
const mode = config.mode;
// ******** SECTION 1: Robust Type Guards ********
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
    return (core.isColor(value) &&
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
    return (core.isColor(value) &&
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
    return (core.isColor(value) &&
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
        return core.colorStringToColor(color);
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
                    numAlpha: hex.value.numAlpha
                },
                format: 'hex'
            };
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`addHashToHex error: ${error}`);
        return config.defaults.colors.hex;
    }
}
function colorToColorString(color) {
    const clonedColor = core.clone(color);
    if (isColorString(clonedColor)) {
        if (mode.logErrors)
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
        if (!mode.gracefulErrors)
            throw new Error(`Unsupported format: ${clonedColor.format}`);
        else if (mode.logErrors)
            console.error(`Unsupported format: ${clonedColor.format}`);
        else if (!mode.quiet)
            console.warn('Failed to convert to color string.');
        return config.defaults.colors.strings.hsl;
    }
}
function componentToHex(component) {
    try {
        const hex = Math.max(0, Math.min(255, component)).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
    catch (error) {
        if (!mode.quiet)
            console.error(`componentToHex error: ${error}`);
        return '00';
    }
}
function formatColor(color, asColorString = false, asCSSString = false) {
    const baseColor = core.clone(color);
    let formattedString = undefined;
    if (asColorString) {
        formattedString = colorToColorString(color);
    }
    else if (asCSSString) {
        formattedString = core.getCSSColorString(color);
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
        if (!mode.gracefulErrors)
            throw new Error(`Invalid hex color: ${hex}. Expected format #RRGGBBAA`);
        else if (mode.logErrors)
            console.error(`Invalid hex color: ${hex}. Expected format #RRGGBBAA`);
        else if (!mode.quiet)
            console.warn('Failed to parse alpha from hex color.');
    }
    const alphaHex = hex.slice(-2);
    const alphaDecimal = parseInt(alphaHex, 16);
    return alphaDecimal / 255;
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
                if (!mode.logErrors)
                    console.error(`Unsupported color format for ${color}`);
                return null;
        }
    }
    catch (error) {
        if (!mode.logErrors)
            console.error(`getColorString error: ${error}`);
        return null;
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
                const numAlpha = hexAlphaToNumericAlpha(alpha);
                return {
                    value: {
                        hex: hexValue,
                        alpha,
                        numAlpha
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
                if (!mode.gracefulErrors)
                    throw new Error(`Unsupported color format: ${colorSpace}`);
                else if (mode.logErrors)
                    console.error(`Unsupported color format: ${colorSpace}`);
                else if (!mode.quiet)
                    console.warn(`Failed to parse color: ${colorSpace}`);
                return null;
        }
    }
    catch (error) {
        if (mode.logErrors)
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
            if (!mode.gracefulErrors)
                throw new Error(`Expected ${count} components.`);
            else if (mode.logErrors) {
                if (!mode.quiet)
                    console.warn(`Expected ${count} components.`);
                console.error(`Expected ${count} components.`);
                return [];
            }
        return components;
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`Error parsing components: ${error}`);
        return [];
    }
}
function parseHexWithAlpha(hexValue) {
    const hex = hexValue.startsWith('#') ? hexValue : `#${hexValue}`;
    const alpha = hex.length === 9 ? hex.slice(-2) : 'FF';
    const numAlpha = hexAlphaToNumericAlpha(alpha);
    return { hex, alpha, numAlpha };
}
function stripHashFromHex(hex) {
    try {
        const hexString = `${hex.value.hex}${hex.value.alpha}`;
        return hex.value.hex.startsWith('#')
            ? {
                value: {
                    hex: hexString.slice(1),
                    alpha: hex.value.alpha,
                    numAlpha: hexAlphaToNumericAlpha(hex.value.alpha)
                },
                format: 'hex'
            }
            : hex;
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`stripHashFromHex error: ${error}`);
        return core.clone(config.defaults.colors.hex);
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
export const color = {
    addHashToHex,
    colorToColorString,
    componentToHex,
    ensureHash,
    formatColor,
    formatPercentageValues,
    getAlphaFromHex,
    getColorString,
    hexAlphaToNumericAlpha,
    isCMYKColor,
    isCMYKFormat,
    isCMYKString,
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
    parseHexWithAlpha,
    stripHashFromHex,
    stripPercentFromValues,
    toHexWithAlpha
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL3V0aWxzL2NvbG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGtDQUFrQztBQWlDbEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN0QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRS9CLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFFekIsa0RBQWtEO0FBRWxELFNBQVMsYUFBYSxDQUNyQixLQUFZLEVBQ1osTUFBbUI7SUFFbkIsT0FBTyxLQUFLLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQztBQUNoQyxDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsS0FBYTtJQUNsQyxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNFLENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUFDLEtBQWE7SUFDMUMsT0FBTztRQUNOLE1BQU07UUFDTixLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLElBQUk7UUFDSixJQUFJO1FBQ0osS0FBSztLQUNMLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25CLENBQUM7QUFFRCxNQUFNLFVBQVUsYUFBYSxDQUFDLEtBQWM7SUFDM0MsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUk7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUU5RCxNQUFNLFdBQVcsR0FBRyxLQUFvQixDQUFDO0lBQ3pDLE1BQU0sa0JBQWtCLEdBQTRCO1FBQ25ELE1BQU07UUFDTixLQUFLO1FBQ0wsS0FBSztRQUNMLElBQUk7UUFDSixJQUFJO0tBQ0os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OlsiLy8gRmlsZTogc3JjL2NvbW1vbi91dGlscy9jb2xvci50c1xuXG5pbXBvcnQge1xuXHRDTVlLLFxuXHRDTVlLU3RyaW5nLFxuXHRDTVlLVmFsdWVTdHJpbmcsXG5cdENvbG9yLFxuXHRDb2xvclNwYWNlLFxuXHRDb2xvclNwYWNlRXh0ZW5kZWQsXG5cdENvbG9yU3RyaW5nLFxuXHRGb3JtYXQsXG5cdEhleCxcblx0SGV4VmFsdWUsXG5cdEhleFZhbHVlU3RyaW5nLFxuXHRIU0wsXG5cdEhTTFN0cmluZyxcblx0SFNMVmFsdWVTdHJpbmcsXG5cdEhTVixcblx0SFNWU3RyaW5nLFxuXHRIU1ZWYWx1ZVN0cmluZyxcblx0TEFCLFxuXHRMQUJWYWx1ZVN0cmluZyxcblx0UkdCLFxuXHRSR0JWYWx1ZSxcblx0UkdCVmFsdWVTdHJpbmcsXG5cdFNMLFxuXHRTTFN0cmluZyxcblx0U3RvcmVkUGFsZXR0ZSxcblx0U1YsXG5cdFNWU3RyaW5nLFxuXHRYWVosXG5cdFhZWlZhbHVlU3RyaW5nXG59IGZyb20gJy4uLy4uL2luZGV4JztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQgeyBjb3JlIH0gZnJvbSAnLi4vY29yZSc7XG5cbmNvbnN0IG1vZGUgPSBjb25maWcubW9kZTtcblxuLy8gKioqKioqKiogU0VDVElPTiAxOiBSb2J1c3QgVHlwZSBHdWFyZHMgKioqKioqKipcblxuZnVuY3Rpb24gaXNDb2xvckZvcm1hdDxUIGV4dGVuZHMgQ29sb3I+KFxuXHRjb2xvcjogQ29sb3IsXG5cdGZvcm1hdDogVFsnZm9ybWF0J11cbik6IGNvbG9yIGlzIFQge1xuXHRyZXR1cm4gY29sb3IuZm9ybWF0ID09PSBmb3JtYXQ7XG59XG5cbmZ1bmN0aW9uIGlzQ29sb3JTcGFjZSh2YWx1ZTogc3RyaW5nKTogdmFsdWUgaXMgQ29sb3JTcGFjZSB7XG5cdHJldHVybiBbJ2NteWsnLCAnaGV4JywgJ2hzbCcsICdoc3YnLCAnbGFiJywgJ3JnYicsICd4eXonXS5pbmNsdWRlcyh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGlzQ29sb3JTcGFjZUV4dGVuZGVkKHZhbHVlOiBzdHJpbmcpOiB2YWx1ZSBpcyBDb2xvclNwYWNlRXh0ZW5kZWQge1xuXHRyZXR1cm4gW1xuXHRcdCdjbXlrJyxcblx0XHQnaGV4Jyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnbGFiJyxcblx0XHQncmdiJyxcblx0XHQnc2wnLFxuXHRcdCdzdicsXG5cdFx0J3h5eidcblx0XS5pbmNsdWRlcyh2YWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbG9yU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ29sb3JTdHJpbmcge1xuXHRpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fCB2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG5cdGNvbnN0IGNvbG9yU3RyaW5nID0gdmFsdWUgYXMgQ29sb3JTdHJpbmc7XG5cdGNvbnN0IHZhbGlkU3RyaW5nRm9ybWF0czogQ29sb3JTdHJpbmdbJ2Zvcm1hdCddW10gPSBbXG5cdFx0J2NteWsnLFxuXHRcdCdoc2wnLFxuXHRcdCdoc3YnLFxuXHRcdCdzbCcsXG5cdFx0J3N2J1xuXHRdO1xuXG5cdHJldHVybiAoXG5cdFx0J3ZhbHVlJyBpbiBjb2xvclN0cmluZyAmJlxuXHRcdCdmb3JtYXQnIGluIGNvbG9yU3RyaW5nICYmXG5cdFx0dmFsaWRTdHJpbmdGb3JtYXRzLmluY2x1ZGVzKGNvbG9yU3RyaW5nLmZvcm1hdClcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNGb3JtYXQoZm9ybWF0OiB1bmtub3duKTogZm9ybWF0IGlzIEZvcm1hdCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIGZvcm1hdCA9PT0gJ3N0cmluZycgJiZcblx0XHRbJ2NteWsnLCAnaGV4JywgJ2hzbCcsICdoc3YnLCAnbGFiJywgJ3JnYicsICdzbCcsICdzdicsICd4eXonXS5pbmNsdWRlcyhcblx0XHRcdGZvcm1hdFxuXHRcdClcblx0KTtcbn1cblxuLy8gKioqKioqKiogU0VDVElPbiAyOiBOYXJyb3dlciBUeXBlIEd1YXJkcyAqKioqKioqKlxuXG5mdW5jdGlvbiBpc0NNWUtDb2xvcih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENNWUsge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIENNWUspLmZvcm1hdCA9PT0gJ2NteWsnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZSykudmFsdWUuY3lhbiA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUspLnZhbHVlLm1hZ2VudGEgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLKS52YWx1ZS55ZWxsb3cgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLKS52YWx1ZS5rZXkgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzQ01ZS0Zvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBDTVlLIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdjbXlrJyk7XG59XG5cbmZ1bmN0aW9uIGlzQ01ZS1N0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENNWUtTdHJpbmcge1xuXHRyZXR1cm4gKFxuXHRcdGlzQ29sb3JTdHJpbmcodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgQ01ZS1N0cmluZykuZm9ybWF0ID09PSAnY215aycgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLU3RyaW5nKS52YWx1ZS5jeWFuID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZS1N0cmluZykudmFsdWUubWFnZW50YSA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUtTdHJpbmcpLnZhbHVlLnllbGxvdyA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUtTdHJpbmcpLnZhbHVlLmtleSA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNIZXgodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIZXgge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIEhleCkuZm9ybWF0ID09PSAnaGV4JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhleCkudmFsdWUuaGV4ID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hleEZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBIZXgge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2hleCcpO1xufVxuXG5mdW5jdGlvbiBpc0hTTENvbG9yKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgSFNMIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBIU0wpLmZvcm1hdCA9PT0gJ2hzbCcgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU0wpLnZhbHVlLmh1ZSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTCkudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTCkudmFsdWUubGlnaHRuZXNzID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hTTEZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBIU0wge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2hzbCcpO1xufVxuXG5mdW5jdGlvbiBpc0hTTFN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhTTFN0cmluZyB7XG5cdHJldHVybiAoXG5cdFx0aXNDb2xvclN0cmluZyh2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBIU0xTdHJpbmcpLmZvcm1hdCA9PT0gJ2hzbCcgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU0xTdHJpbmcpLnZhbHVlLmh1ZSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTFN0cmluZykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTFN0cmluZykudmFsdWUubGlnaHRuZXNzID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hTVkNvbG9yKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgSFNWIHtcblx0cmV0dXJuIChcblx0XHRjb3JlLmlzQ29sb3IodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgSFNWKS5mb3JtYXQgPT09ICdoc3YnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNWKS52YWx1ZS5odWUgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1YpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1YpLnZhbHVlLnZhbHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hTVkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBIU1Yge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2hzdicpO1xufVxuXG5mdW5jdGlvbiBpc0hTVlN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhTVlN0cmluZyB7XG5cdHJldHVybiAoXG5cdFx0aXNDb2xvclN0cmluZyh2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBIU1ZTdHJpbmcpLmZvcm1hdCA9PT0gJ2hzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1ZTdHJpbmcpLnZhbHVlLmh1ZSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVlN0cmluZykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVlN0cmluZykudmFsdWUudmFsdWUgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzTEFCKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgTEFCIHtcblx0cmV0dXJuIChcblx0XHRjb3JlLmlzQ29sb3IodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgTEFCKS5mb3JtYXQgPT09ICdsYWInICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgTEFCKS52YWx1ZS5sID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgTEFCKS52YWx1ZS5hID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgTEFCKS52YWx1ZS5iID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0xBQkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBMQUIge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2xhYicpO1xufVxuXG5mdW5jdGlvbiBpc1JHQih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFJHQiB7XG5cdHJldHVybiAoXG5cdFx0Y29yZS5pc0NvbG9yKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFJHQikuZm9ybWF0ID09PSAncmdiJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFJHQikudmFsdWUucmVkID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgUkdCKS52YWx1ZS5ncmVlbiA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFJHQikudmFsdWUuYmx1ZSA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNSR0JGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgUkdCIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdyZ2InKTtcbn1cblxuZnVuY3Rpb24gaXNTTENvbG9yKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgU0wge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFNMKS5mb3JtYXQgPT09ICdzbCcgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTTCkudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNMKS52YWx1ZS5saWdodG5lc3MgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzU0xGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgU0wge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ3NsJyk7XG59XG5cbmZ1bmN0aW9uIGlzU0xTdHJpbmcodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBTTFN0cmluZyB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgU0xTdHJpbmcpLmZvcm1hdCA9PT0gJ3NsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNMU3RyaW5nKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU0xTdHJpbmcpLnZhbHVlLmxpZ2h0bmVzcyA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNTVkNvbG9yKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgU1Yge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFNWKS5mb3JtYXQgPT09ICdzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTVikudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNWKS52YWx1ZS52YWx1ZSA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNTVkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBTViB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnc3YnKTtcbn1cblxuZnVuY3Rpb24gaXNTVlN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFNWU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBTVlN0cmluZykuZm9ybWF0ID09PSAnc3YnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU1ZTdHJpbmcpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTVlN0cmluZykudmFsdWUudmFsdWUgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzWFlaKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgWFlaIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBYWVopLmZvcm1hdCA9PT0gJ3h5eicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBYWVopLnZhbHVlLnggPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBYWVopLnZhbHVlLnkgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBYWVopLnZhbHVlLnogPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzWFlaRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIFhZWiB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAneHl6Jyk7XG59XG5cbi8vICoqKioqIFNFQ1RJT04gMzogVXRpbGl0eSBHdWFyZHMgKioqKipcblxuZnVuY3Rpb24gZW5zdXJlSGFzaCh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcblx0cmV0dXJuIHZhbHVlLnN0YXJ0c1dpdGgoJyMnKSA/IHZhbHVlIDogYCMke3ZhbHVlfWA7XG59XG5cbmZ1bmN0aW9uIGlzQ29udmVydGlibGVDb2xvcihcblx0Y29sb3I6IENvbG9yXG4pOiBjb2xvciBpcyBDTVlLIHwgSGV4IHwgSFNMIHwgSFNWIHwgTEFCIHwgUkdCIHtcblx0cmV0dXJuIChcblx0XHRjb2xvci5mb3JtYXQgPT09ICdjbXlrJyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2hleCcgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdoc2wnIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnaHN2JyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2xhYicgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdyZ2InXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSW5wdXRFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCk6IGVsZW1lbnQgaXMgSFRNTEVsZW1lbnQge1xuXHRyZXR1cm4gZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGlzU3RvcmVkUGFsZXR0ZShvYmo6IHVua25vd24pOiBvYmogaXMgU3RvcmVkUGFsZXR0ZSB7XG5cdGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCBvYmogPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuXHRjb25zdCBjYW5kaWRhdGUgPSBvYmogYXMgUGFydGlhbDxTdG9yZWRQYWxldHRlPjtcblxuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiBjYW5kaWRhdGUudGFibGVJRCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgY2FuZGlkYXRlLnBhbGV0dGUgPT09ICdvYmplY3QnICYmXG5cdFx0QXJyYXkuaXNBcnJheShjYW5kaWRhdGUucGFsZXR0ZS5pdGVtcykgJiZcblx0XHR0eXBlb2YgY2FuZGlkYXRlLnBhbGV0dGUuaWQgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIG5hcnJvd1RvQ29sb3IoY29sb3I6IENvbG9yIHwgQ29sb3JTdHJpbmcpOiBDb2xvciB8IG51bGwge1xuXHRpZiAoaXNDb2xvclN0cmluZyhjb2xvcikpIHtcblx0XHRyZXR1cm4gY29yZS5jb2xvclN0cmluZ1RvQ29sb3IoY29sb3IpO1xuXHR9XG5cblx0c3dpdGNoIChjb2xvci5mb3JtYXQgYXMgQ29sb3JTcGFjZUV4dGVuZGVkKSB7XG5cdFx0Y2FzZSAnY215ayc6XG5cdFx0Y2FzZSAnaGV4Jzpcblx0XHRjYXNlICdoc2wnOlxuXHRcdGNhc2UgJ2hzdic6XG5cdFx0Y2FzZSAnbGFiJzpcblx0XHRjYXNlICdzbCc6XG5cdFx0Y2FzZSAnc3YnOlxuXHRcdGNhc2UgJ3JnYic6XG5cdFx0Y2FzZSAneHl6Jzpcblx0XHRcdHJldHVybiBjb2xvcjtcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuLy8gKioqKioqKiogU0VDVElPTiA0OiBUUkFOU0ZPUk0gVVRJTFMgKioqKioqKipcblxuZnVuY3Rpb24gYWRkSGFzaFRvSGV4KGhleDogSGV4KTogSGV4IHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gaGV4LnZhbHVlLmhleC5zdGFydHNXaXRoKCcjJylcblx0XHRcdD8gaGV4XG5cdFx0XHQ6IHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aGV4OiBgIyR7aGV4LnZhbHVlfX1gLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGhleC52YWx1ZS5hbHBoYSxcblx0XHRcdFx0XHRcdG51bUFscGhhOiBoZXgudmFsdWUubnVtQWxwaGFcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hleCcgYXMgJ2hleCdcblx0XHRcdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5sb2dFcnJvcnMpIGNvbnNvbGUuZXJyb3IoYGFkZEhhc2hUb0hleCBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb25maWcuZGVmYXVsdHMuY29sb3JzLmhleDtcblx0fVxufVxuXG5mdW5jdGlvbiBjb2xvclRvQ29sb3JTdHJpbmcoY29sb3I6IENvbG9yKTogQ29sb3JTdHJpbmcge1xuXHRjb25zdCBjbG9uZWRDb2xvciA9IGNvcmUuY2xvbmUoY29sb3IpIGFzIEV4Y2x1ZGU8Q29sb3IsIEhleD47XG5cblx0aWYgKGlzQ29sb3JTdHJpbmcoY2xvbmVkQ29sb3IpKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdGBBbHJlYWR5IGZvcm1hdHRlZCBhcyBjb2xvciBzdHJpbmc6ICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gY2xvbmVkQ29sb3I7XG5cdH1cblxuXHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoY2xvbmVkQ29sb3IudmFsdWUpO1xuXG5cdGlmIChpc0NNWUtDb2xvcihjbG9uZWRDb2xvcikpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnY215aycsXG5cdFx0XHR2YWx1ZTogbmV3VmFsdWUgYXMgdW5rbm93biBhcyBDTVlLVmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzSGV4KGNsb25lZENvbG9yKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdoZXgnLFxuXHRcdFx0dmFsdWU6IG5ld1ZhbHVlIGFzIHVua25vd24gYXMgSGV4VmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzSFNMQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2hzbCcsXG5cdFx0XHR2YWx1ZTogbmV3VmFsdWUgYXMgdW5rbm93biBhcyBIU0xWYWx1ZVN0cmluZ1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNIU1ZDb2xvcihjbG9uZWRDb2xvcikpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnaHN2Jyxcblx0XHRcdHZhbHVlOiBuZXdWYWx1ZSBhcyB1bmtub3duIGFzIEhTVlZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc0xBQihjbG9uZWRDb2xvcikpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnbGFiJyxcblx0XHRcdHZhbHVlOiBuZXdWYWx1ZSBhcyB1bmtub3duIGFzIExBQlZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc1JHQihjbG9uZWRDb2xvcikpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAncmdiJyxcblx0XHRcdHZhbHVlOiBuZXdWYWx1ZSBhcyB1bmtub3duIGFzIFJHQlZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc1hZWihjbG9uZWRDb2xvcikpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAneHl6Jyxcblx0XHRcdHZhbHVlOiBuZXdWYWx1ZSBhcyB1bmtub3duIGFzIFhZWlZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRpZiAoIW1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGZvcm1hdDogJHtjbG9uZWRDb2xvci5mb3JtYXR9YCk7XG5cdFx0ZWxzZSBpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBVbnN1cHBvcnRlZCBmb3JtYXQ6ICR7Y2xvbmVkQ29sb3IuZm9ybWF0fWApO1xuXHRcdGVsc2UgaWYgKCFtb2RlLnF1aWV0KVxuXHRcdFx0Y29uc29sZS53YXJuKCdGYWlsZWQgdG8gY29udmVydCB0byBjb2xvciBzdHJpbmcuJyk7XG5cblx0XHRyZXR1cm4gY29uZmlnLmRlZmF1bHRzLmNvbG9ycy5zdHJpbmdzLmhzbDtcblx0fVxufVxuXG5mdW5jdGlvbiBjb21wb25lbnRUb0hleChjb21wb25lbnQ6IG51bWJlcik6IHN0cmluZyB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgaGV4ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBjb21wb25lbnQpKS50b1N0cmluZygxNik7XG5cblx0XHRyZXR1cm4gaGV4Lmxlbmd0aCA9PT0gMSA/ICcwJyArIGhleCA6IGhleDtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUuZXJyb3IoYGNvbXBvbmVudFRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuICcwMCc7XG5cdH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0Q29sb3IoXG5cdGNvbG9yOiBDb2xvcixcblx0YXNDb2xvclN0cmluZzogYm9vbGVhbiA9IGZhbHNlLFxuXHRhc0NTU1N0cmluZzogYm9vbGVhbiA9IGZhbHNlXG4pOiB7IGJhc2VDb2xvcjogQ29sb3I7IGZvcm1hdHRlZFN0cmluZz86IENvbG9yU3RyaW5nIHwgc3RyaW5nIH0ge1xuXHRjb25zdCBiYXNlQ29sb3IgPSBjb3JlLmNsb25lKGNvbG9yKTtcblxuXHRsZXQgZm9ybWF0dGVkU3RyaW5nOiBDb2xvclN0cmluZyB8IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuXHRpZiAoYXNDb2xvclN0cmluZykge1xuXHRcdGZvcm1hdHRlZFN0cmluZyA9IGNvbG9yVG9Db2xvclN0cmluZyhcblx0XHRcdGNvbG9yIGFzIEV4Y2x1ZGU8Q29sb3IsIEhleCB8IExBQiB8IFJHQj5cblx0XHQpIGFzIENvbG9yU3RyaW5nO1xuXHR9IGVsc2UgaWYgKGFzQ1NTU3RyaW5nKSB7XG5cdFx0Zm9ybWF0dGVkU3RyaW5nID0gY29yZS5nZXRDU1NDb2xvclN0cmluZyhjb2xvcikgYXMgc3RyaW5nO1xuXHR9XG5cblx0cmV0dXJuIGZvcm1hdHRlZFN0cmluZyAhPT0gdW5kZWZpbmVkXG5cdFx0PyB7IGJhc2VDb2xvciwgZm9ybWF0dGVkU3RyaW5nIH1cblx0XHQ6IHsgYmFzZUNvbG9yIH07XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHVua25vd24+Pihcblx0dmFsdWU6IFRcbik6IFQge1xuXHRyZXR1cm4gT2JqZWN0LmVudHJpZXModmFsdWUpLnJlZHVjZShcblx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHQoYWNjIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVtrZXldID0gW1xuXHRcdFx0XHQnc2F0dXJhdGlvbicsXG5cdFx0XHRcdCdsaWdodG5lc3MnLFxuXHRcdFx0XHQndmFsdWUnLFxuXHRcdFx0XHQnY3lhbicsXG5cdFx0XHRcdCdtYWdlbnRhJyxcblx0XHRcdFx0J3llbGxvdycsXG5cdFx0XHRcdCdrZXknXG5cdFx0XHRdLmluY2x1ZGVzKGtleSlcblx0XHRcdFx0PyBgJHt2YWx9JWBcblx0XHRcdFx0OiB2YWw7XG5cdFx0XHRyZXR1cm4gYWNjO1xuXHRcdH0sXG5cdFx0e30gYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj5cblx0KSBhcyBUO1xufVxuXG5mdW5jdGlvbiBnZXRBbHBoYUZyb21IZXgoaGV4OiBzdHJpbmcpOiBudW1iZXIge1xuXHRpZiAoaGV4Lmxlbmd0aCAhPT0gOSB8fCAhaGV4LnN0YXJ0c1dpdGgoJyMnKSkge1xuXHRcdGlmICghbW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0YEludmFsaWQgaGV4IGNvbG9yOiAke2hleH0uIEV4cGVjdGVkIGZvcm1hdCAjUlJHR0JCQUFgXG5cdFx0XHQpO1xuXHRcdGVsc2UgaWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0YEludmFsaWQgaGV4IGNvbG9yOiAke2hleH0uIEV4cGVjdGVkIGZvcm1hdCAjUlJHR0JCQUFgXG5cdFx0XHQpO1xuXHRcdGVsc2UgaWYgKCFtb2RlLnF1aWV0KVxuXHRcdFx0Y29uc29sZS53YXJuKCdGYWlsZWQgdG8gcGFyc2UgYWxwaGEgZnJvbSBoZXggY29sb3IuJyk7XG5cdH1cblxuXHRjb25zdCBhbHBoYUhleCA9IGhleC5zbGljZSgtMik7XG5cdGNvbnN0IGFscGhhRGVjaW1hbCA9IHBhcnNlSW50KGFscGhhSGV4LCAxNik7XG5cblx0cmV0dXJuIGFscGhhRGVjaW1hbCAvIDI1NTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29sb3JTdHJpbmcoY29sb3I6IENvbG9yKTogc3RyaW5nIHwgbnVsbCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgZm9ybWF0dGVycyA9IHtcblx0XHRcdGNteWs6IChjOiBDTVlLKSA9PlxuXHRcdFx0XHRgY215aygke2MudmFsdWUuY3lhbn0sICR7Yy52YWx1ZS5tYWdlbnRhfSwgJHtjLnZhbHVlLnllbGxvd30sICR7Yy52YWx1ZS5rZXl9LCAke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHRoZXg6IChjOiBIZXgpID0+IGMudmFsdWUuaGV4LFxuXHRcdFx0aHNsOiAoYzogSFNMKSA9PlxuXHRcdFx0XHRgaHNsKCR7Yy52YWx1ZS5odWV9LCAke2MudmFsdWUuc2F0dXJhdGlvbn0lLCAke2MudmFsdWUubGlnaHRuZXNzfSUsJHtjLnZhbHVlLmFscGhhfSlgLFxuXHRcdFx0aHN2OiAoYzogSFNWKSA9PlxuXHRcdFx0XHRgaHN2KCR7Yy52YWx1ZS5odWV9LCAke2MudmFsdWUuc2F0dXJhdGlvbn0lLCAke2MudmFsdWUudmFsdWV9JSwke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHRsYWI6IChjOiBMQUIpID0+XG5cdFx0XHRcdGBsYWIoJHtjLnZhbHVlLmx9LCAke2MudmFsdWUuYX0sICR7Yy52YWx1ZS5ifSwke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHRyZ2I6IChjOiBSR0IpID0+XG5cdFx0XHRcdGByZ2IoJHtjLnZhbHVlLnJlZH0sICR7Yy52YWx1ZS5ncmVlbn0sICR7Yy52YWx1ZS5ibHVlfSwke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHR4eXo6IChjOiBYWVopID0+XG5cdFx0XHRcdGB4eXooJHtjLnZhbHVlLnh9LCAke2MudmFsdWUueX0sICR7Yy52YWx1ZS56fSwke2MudmFsdWUuYWxwaGF9KWBcblx0XHR9O1xuXG5cdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5jbXlrKGNvbG9yKTtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmhleChjb2xvcik7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5oc2woY29sb3IpO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMuaHN2KGNvbG9yKTtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmxhYihjb2xvcik7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5yZ2IoY29sb3IpO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMueHl6KGNvbG9yKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGlmICghbW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0IGZvciAke2NvbG9yfWApO1xuXG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIW1vZGUubG9nRXJyb3JzKSBjb25zb2xlLmVycm9yKGBnZXRDb2xvclN0cmluZyBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleEFscGhhVG9OdW1lcmljQWxwaGEoaGV4QWxwaGE6IHN0cmluZyk6IG51bWJlciB7XG5cdHJldHVybiBwYXJzZUludChoZXhBbHBoYSwgMTYpIC8gMjU1O1xufVxuXG5jb25zdCBwYXJzZUNvbG9yID0gKGNvbG9yU3BhY2U6IENvbG9yU3BhY2UsIHZhbHVlOiBzdHJpbmcpOiBDb2xvciB8IG51bGwgPT4ge1xuXHR0cnkge1xuXHRcdHN3aXRjaCAoY29sb3JTcGFjZSkge1xuXHRcdFx0Y2FzZSAnY215ayc6IHtcblx0XHRcdFx0Y29uc3QgW2MsIG0sIHksIGssIGFdID0gcGFyc2VDb21wb25lbnRzKHZhbHVlLCA1KTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7IGN5YW46IGMsIG1hZ2VudGE6IG0sIHllbGxvdzogeSwga2V5OiBrLCBhbHBoYTogYSB9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRjb25zdCBoZXhWYWx1ZSA9IHZhbHVlLnN0YXJ0c1dpdGgoJyMnKSA/IHZhbHVlIDogYCMke3ZhbHVlfWA7XG5cdFx0XHRcdGNvbnN0IGFscGhhID0gaGV4VmFsdWUubGVuZ3RoID09PSA5ID8gaGV4VmFsdWUuc2xpY2UoLTIpIDogJ0ZGJztcblx0XHRcdFx0Y29uc3QgbnVtQWxwaGEgPSBoZXhBbHBoYVRvTnVtZXJpY0FscGhhKGFscGhhKTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRoZXg6IGhleFZhbHVlLFxuXHRcdFx0XHRcdFx0YWxwaGEsXG5cdFx0XHRcdFx0XHRudW1BbHBoYVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHR9O1xuXHRcdFx0Y2FzZSAnaHNsJzoge1xuXHRcdFx0XHRjb25zdCBbaCwgcywgbCwgYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHsgaHVlOiBoLCBzYXR1cmF0aW9uOiBzLCBsaWdodG5lc3M6IGwsIGFscGhhOiBhIH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAnaHN2Jzoge1xuXHRcdFx0XHRjb25zdCBbaCwgcywgdiwgYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHsgaHVlOiBoLCBzYXR1cmF0aW9uOiBzLCB2YWx1ZTogdiwgYWxwaGE6IGEgfSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdsYWInOiB7XG5cdFx0XHRcdGNvbnN0IFtsLCBhLCBiLCBhbHBoYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXHRcdFx0XHRyZXR1cm4geyB2YWx1ZTogeyBsLCBhLCBiLCBhbHBoYSB9LCBmb3JtYXQ6ICdsYWInIH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdyZ2InOiB7XG5cdFx0XHRcdGNvbnN0IFtyLCBnLCBiLCBhXSA9IHZhbHVlLnNwbGl0KCcsJykubWFwKE51bWJlcik7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZTogeyByZWQ6IHIsIGdyZWVuOiBnLCBibHVlOiBiLCBhbHBoYTogYSB9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGlmICghbW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtjb2xvclNwYWNlfWApO1xuXHRcdFx0XHRlbHNlIGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQ6ICR7Y29sb3JTcGFjZX1gKTtcblx0XHRcdFx0ZWxzZSBpZiAoIW1vZGUucXVpZXQpXG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKGBGYWlsZWQgdG8gcGFyc2UgY29sb3I6ICR7Y29sb3JTcGFjZX1gKTtcblxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKSBjb25zb2xlLmVycm9yKGBwYXJzZUNvbG9yIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn07XG5cbmZ1bmN0aW9uIHBhcnNlQ29tcG9uZW50cyh2YWx1ZTogc3RyaW5nLCBjb3VudDogbnVtYmVyKTogbnVtYmVyW10ge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNvbXBvbmVudHMgPSB2YWx1ZVxuXHRcdFx0LnNwbGl0KCcsJylcblx0XHRcdC5tYXAodmFsID0+XG5cdFx0XHRcdHZhbC50cmltKCkuZW5kc1dpdGgoJyUnKVxuXHRcdFx0XHRcdD8gcGFyc2VGbG9hdCh2YWwpXG5cdFx0XHRcdFx0OiBwYXJzZUZsb2F0KHZhbCkgKiAxMDBcblx0XHRcdCk7XG5cblx0XHRpZiAoY29tcG9uZW50cy5sZW5ndGggIT09IGNvdW50KVxuXHRcdFx0aWYgKCFtb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkICR7Y291bnR9IGNvbXBvbmVudHMuYCk7XG5cdFx0XHRlbHNlIGlmIChtb2RlLmxvZ0Vycm9ycykge1xuXHRcdFx0XHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUud2FybihgRXhwZWN0ZWQgJHtjb3VudH0gY29tcG9uZW50cy5gKTtcblxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBFeHBlY3RlZCAke2NvdW50fSBjb21wb25lbnRzLmApO1xuXG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblxuXHRcdHJldHVybiBjb21wb25lbnRzO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmxvZ0Vycm9ycykgY29uc29sZS5lcnJvcihgRXJyb3IgcGFyc2luZyBjb21wb25lbnRzOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIFtdO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHBhcnNlSGV4V2l0aEFscGhhKGhleFZhbHVlOiBzdHJpbmcpOiBIZXhWYWx1ZSB8IG51bGwge1xuXHRjb25zdCBoZXggPSBoZXhWYWx1ZS5zdGFydHNXaXRoKCcjJykgPyBoZXhWYWx1ZSA6IGAjJHtoZXhWYWx1ZX1gO1xuXHRjb25zdCBhbHBoYSA9IGhleC5sZW5ndGggPT09IDkgPyBoZXguc2xpY2UoLTIpIDogJ0ZGJztcblx0Y29uc3QgbnVtQWxwaGEgPSBoZXhBbHBoYVRvTnVtZXJpY0FscGhhKGFscGhhKTtcblxuXHRyZXR1cm4geyBoZXgsIGFscGhhLCBudW1BbHBoYSB9O1xufVxuXG5mdW5jdGlvbiBzdHJpcEhhc2hGcm9tSGV4KGhleDogSGV4KTogSGV4IHtcblx0dHJ5IHtcblx0XHRjb25zdCBoZXhTdHJpbmcgPSBgJHtoZXgudmFsdWUuaGV4fSR7aGV4LnZhbHVlLmFscGhhfWA7XG5cblx0XHRyZXR1cm4gaGV4LnZhbHVlLmhleC5zdGFydHNXaXRoKCcjJylcblx0XHRcdD8ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRoZXg6IGhleFN0cmluZy5zbGljZSgxKSxcblx0XHRcdFx0XHRcdGFscGhhOiBoZXgudmFsdWUuYWxwaGEsXG5cdFx0XHRcdFx0XHRudW1BbHBoYTogaGV4QWxwaGFUb051bWVyaWNBbHBoYShoZXgudmFsdWUuYWxwaGEpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnIGFzICdoZXgnXG5cdFx0XHRcdH1cblx0XHRcdDogaGV4O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmxvZ0Vycm9ycykgY29uc29sZS5lcnJvcihgc3RyaXBIYXNoRnJvbUhleCBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGNvbmZpZy5kZWZhdWx0cy5jb2xvcnMuaGV4KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzdHJpcFBlcmNlbnRGcm9tVmFsdWVzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBudW1iZXIgfCBzdHJpbmc+Pihcblx0dmFsdWU6IFRcbik6IHsgW0sgaW4ga2V5b2YgVF06IFRbS10gZXh0ZW5kcyBgJHtudW1iZXJ9JWAgPyBudW1iZXIgOiBUW0tdIH0ge1xuXHRyZXR1cm4gT2JqZWN0LmVudHJpZXModmFsdWUpLnJlZHVjZShcblx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHRjb25zdCBwYXJzZWRWYWx1ZSA9XG5cdFx0XHRcdHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIHZhbC5lbmRzV2l0aCgnJScpXG5cdFx0XHRcdFx0PyBwYXJzZUZsb2F0KHZhbC5zbGljZSgwLCAtMSkpXG5cdFx0XHRcdFx0OiB2YWw7XG5cdFx0XHRhY2Nba2V5IGFzIGtleW9mIFRdID0gcGFyc2VkVmFsdWUgYXMgVFtrZXlvZiBUXSBleHRlbmRzIGAke251bWJlcn0lYFxuXHRcdFx0XHQ/IG51bWJlclxuXHRcdFx0XHQ6IFRba2V5b2YgVF07XG5cdFx0XHRyZXR1cm4gYWNjO1xuXHRcdH0sXG5cdFx0e30gYXMgeyBbSyBpbiBrZXlvZiBUXTogVFtLXSBleHRlbmRzIGAke251bWJlcn0lYCA/IG51bWJlciA6IFRbS10gfVxuXHQpO1xufVxuXG5mdW5jdGlvbiB0b0hleFdpdGhBbHBoYShyZ2JWYWx1ZTogUkdCVmFsdWUpOiBzdHJpbmcge1xuXHRjb25zdCB7IHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhIH0gPSByZ2JWYWx1ZTtcblxuXHRjb25zdCBoZXggPSBgIyR7KCgxIDw8IDI0KSArIChyZWQgPDwgMTYpICsgKGdyZWVuIDw8IDgpICsgYmx1ZSlcblx0XHQudG9TdHJpbmcoMTYpXG5cdFx0LnNsaWNlKDEpfWA7XG5cdGNvbnN0IGFscGhhSGV4ID0gTWF0aC5yb3VuZChhbHBoYSAqIDI1NSlcblx0XHQudG9TdHJpbmcoMTYpXG5cdFx0LnBhZFN0YXJ0KDIsICcwJyk7XG5cblx0cmV0dXJuIGAke2hleH0ke2FscGhhSGV4fWA7XG59XG5cbmV4cG9ydCBjb25zdCBjb2xvciA9IHtcblx0YWRkSGFzaFRvSGV4LFxuXHRjb2xvclRvQ29sb3JTdHJpbmcsXG5cdGNvbXBvbmVudFRvSGV4LFxuXHRlbnN1cmVIYXNoLFxuXHRmb3JtYXRDb2xvcixcblx0Zm9ybWF0UGVyY2VudGFnZVZhbHVlcyxcblx0Z2V0QWxwaGFGcm9tSGV4LFxuXHRnZXRDb2xvclN0cmluZyxcblx0aGV4QWxwaGFUb051bWVyaWNBbHBoYSxcblx0aXNDTVlLQ29sb3IsXG5cdGlzQ01ZS0Zvcm1hdCxcblx0aXNDTVlLU3RyaW5nLFxuXHRpc0NvbG9yRm9ybWF0LFxuXHRpc0NvbG9yU3RyaW5nLFxuXHRpc0NvbG9yU3BhY2UsXG5cdGlzQ29sb3JTcGFjZUV4dGVuZGVkLFxuXHRpc0NvbnZlcnRpYmxlQ29sb3IsXG5cdGlzRm9ybWF0LFxuXHRpc0hleCxcblx0aXNIZXhGb3JtYXQsXG5cdGlzSFNMQ29sb3IsXG5cdGlzSFNMRm9ybWF0LFxuXHRpc0hTTFN0cmluZyxcblx0aXNJbnB1dEVsZW1lbnQsXG5cdGlzSFNWQ29sb3IsXG5cdGlzSFNWRm9ybWF0LFxuXHRpc0hTVlN0cmluZyxcblx0aXNMQUIsXG5cdGlzTEFCRm9ybWF0LFxuXHRpc1JHQixcblx0aXNSR0JGb3JtYXQsXG5cdGlzU0xDb2xvcixcblx0aXNTTEZvcm1hdCxcblx0aXNTTFN0cmluZyxcblx0aXNTdG9yZWRQYWxldHRlLFxuXHRpc1NWQ29sb3IsXG5cdGlzU1ZGb3JtYXQsXG5cdGlzU1ZTdHJpbmcsXG5cdGlzWFlaLFxuXHRpc1hZWkZvcm1hdCxcblx0bmFycm93VG9Db2xvcixcblx0cGFyc2VDb2xvcixcblx0cGFyc2VDb21wb25lbnRzLFxuXHRwYXJzZUhleFdpdGhBbHBoYSxcblx0c3RyaXBIYXNoRnJvbUhleCxcblx0c3RyaXBQZXJjZW50RnJvbVZhbHVlcyxcblx0dG9IZXhXaXRoQWxwaGFcbn0gYXMgY29uc3Q7XG4iXX0=