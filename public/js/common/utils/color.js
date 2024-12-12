// File: src/common/utils/color.ts
import { core } from '../core/index.js';
import { data } from '../../data/index.js';
const mode = data.mode;
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
// ******** SECTION 2: Narrow Type Guards ********
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
    return (core.guards.isColor(value) &&
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
    return (core.guards.isColor(value) &&
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
    return (core.guards.isColor(value) &&
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
        return core.convert.toColor(color);
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
                    hex: core.brand.asHexSet(`#${hex.value}}`),
                    alpha: core.brand.asHexComponent(`#$hex.value.alpha`),
                    numAlpha: core.brand.asAlphaRange(hex.value.numAlpha)
                },
                format: 'hex'
            };
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`addHashToHex error: ${error}`);
        return core.brandColor.asHex(data.defaults.colors.hex);
    }
}
function colorToColorString(color) {
    const clonedColor = core.base.clone(color);
    if (isColorString(clonedColor)) {
        if (mode.errorLogs)
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
        else if (mode.errorLogs)
            console.error(`Unsupported format: ${clonedColor.format}`);
        else if (!mode.quiet)
            console.warn('Failed to convert to color string.');
        return data.defaults.colorStrings.hsl;
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
    const baseColor = core.base.clone(color);
    let formattedString = undefined;
    if (asColorString) {
        formattedString = colorToColorString(color);
    }
    else if (asCSSString) {
        formattedString = core.convert.toCSSColorString(color);
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
        else if (mode.errorLogs)
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
                if (!mode.errorLogs)
                    console.error(`Unsupported color format for ${color}`);
                return null;
        }
    }
    catch (error) {
        if (!mode.errorLogs)
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
                    value: {
                        cyan: core.brand.asPercentile(c),
                        magenta: core.brand.asPercentile(m),
                        yellow: core.brand.asPercentile(y),
                        key: core.brand.asPercentile(k),
                        alpha: core.brand.asAlphaRange(a)
                    },
                    format: 'cmyk'
                };
            }
            case 'hex':
                const hexValue = value.startsWith('#') ? value : `#${value}`;
                const alpha = hexValue.length === 9 ? hexValue.slice(-2) : 'FF';
                const numAlpha = hexAlphaToNumericAlpha(alpha);
                return {
                    value: {
                        hex: core.brand.asHexSet(hexValue),
                        alpha: core.brand.asHexComponent(alpha),
                        numAlpha: core.brand.asAlphaRange(numAlpha)
                    },
                    format: 'hex'
                };
            case 'hsl': {
                const [h, s, l, a] = parseComponents(value, 4);
                return {
                    value: {
                        hue: core.brand.asRadial(h),
                        saturation: core.brand.asPercentile(s),
                        lightness: core.brand.asPercentile(l),
                        alpha: core.brand.asAlphaRange(a)
                    },
                    format: 'hsl'
                };
            }
            case 'hsv': {
                const [h, s, v, a] = parseComponents(value, 4);
                return {
                    value: {
                        hue: core.brand.asRadial(h),
                        saturation: core.brand.asPercentile(s),
                        value: core.brand.asPercentile(v),
                        alpha: core.brand.asAlphaRange(a)
                    },
                    format: 'hsv'
                };
            }
            case 'lab': {
                const [l, a, b, alpha] = parseComponents(value, 4);
                return {
                    value: {
                        l: core.brand.asLAB_L(l),
                        a: core.brand.asLAB_A(a),
                        b: core.brand.asLAB_B(b),
                        alpha: core.brand.asAlphaRange(alpha)
                    },
                    format: 'lab'
                };
            }
            case 'rgb': {
                const components = value.split(',').map(Number);
                if (components.some(isNaN))
                    throw new Error('Invalid RGB format');
                const [r, g, b, a] = components;
                return {
                    value: {
                        red: core.brand.asByteRange(r),
                        green: core.brand.asByteRange(g),
                        blue: core.brand.asByteRange(b),
                        alpha: core.brand.asAlphaRange(a)
                    },
                    format: 'rgb'
                };
            }
            default:
                const message = `Unsupported color format: ${colorSpace}`;
                if (mode.gracefulErrors) {
                    if (mode.errorLogs)
                        console.error(message);
                    else if (!mode.quiet)
                        console.warn(`Failed to parse color: ${message}`);
                }
                else {
                    throw new Error(message);
                }
                return null;
        }
    }
    catch (error) {
        if (mode.errorLogs)
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
            else if (mode.errorLogs) {
                if (!mode.quiet)
                    console.warn(`Expected ${count} components.`);
                console.error(`Expected ${count} components.`);
                return [];
            }
        return components;
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Error parsing components: ${error}`);
        return [];
    }
}
function parseHexWithAlpha(hexValue) {
    const hex = hexValue.startsWith('#') ? hexValue : `#${hexValue}`;
    const alpha = hex.length === 9 ? hex.slice(-2) : 'FF';
    const numAlpha = hexAlphaToNumericAlpha(alpha);
    return {
        hex: core.brand.asHexSet(hex),
        alpha: core.brand.asHexComponent(alpha),
        numAlpha: core.brand.asAlphaRange(numAlpha)
    };
}
function stripHashFromHex(hex) {
    try {
        const hexString = `${hex.value.hex}${hex.value.alpha}`;
        return hex.value.hex.startsWith('#')
            ? {
                value: {
                    hex: core.brand.asHexSet(hexString.slice(1)),
                    alpha: core.brand.asHexComponent(String(hex.value.alpha)),
                    numAlpha: core.brand.asAlphaRange(hexAlphaToNumericAlpha(String(hex.value.alpha)))
                },
                format: 'hex'
            }
            : hex;
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`stripHashFromHex error: ${error}`);
        const unbrandedHex = core.base.clone(data.defaults.colors.hex);
        return core.brandColor.asHex(unbrandedHex);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL3V0aWxzL2NvbG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGtDQUFrQztBQWtDbEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUUzQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBRXZCLGtEQUFrRDtBQUVsRCxTQUFTLGFBQWEsQ0FDckIsS0FBWSxFQUNaLE1BQW1CO0lBRW5CLE9BQU8sS0FBSyxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUM7QUFDaEMsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLEtBQWE7SUFDbEMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzRSxDQUFDO0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxLQUFhO0lBQzFDLE9BQU87UUFDTixNQUFNO1FBQ04sS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxJQUFJO1FBQ0osSUFBSTtRQUNKLEtBQUs7S0FDTCxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBRUQsTUFBTSxVQUFVLGFBQWEsQ0FBQyxLQUFjO0lBQzNDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssS0FBSyxJQUFJO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFFOUQsTUFBTSxXQUFXLEdBQUcsS0FBb0IsQ0FBQztJQUN6QyxNQUFNLGtCQUFrQixHQUE0QjtRQUNuRCxNQUFNO1FBQ04sS0FBSztRQUNMLEtBQUs7UUFDTCxJQUFJO1FBQ0osSUFBSTtL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QUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRztZQUNqRyxHQUFHLEVBQUUsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRztZQUM1QixHQUFHLEVBQUUsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUNmLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUc7WUFDdEYsR0FBRyxFQUFFLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FDZixPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHO1lBQ2xGLEdBQUcsRUFBRSxDQUFDLENBQU0sRUFBRSxFQUFFLENBQ2YsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRztZQUNqRSxHQUFHLEVBQUUsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUNmLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUc7WUFDMUUsR0FBRyxFQUFFLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FDZixPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxL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SyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDYixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7U0FDdEMsUUFBUSxDQUFDLEVBQUUsQ0FBQztTQUNaLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFbkIsT0FBTyxHQUFHLEdBQUcsR0FBRyxRQUFRLEVBQUUsQ0FBQztBQUM1QixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUF1QjtJQUN4QyxZQUFZO0lBQ1osa0JBQWtCO0lBQ2xCLGNBQWM7SUFDZCxVQUFVO0lBQ1YsV0FBVztJQUNYLHNCQUFzQjtJQUN0QixlQUFlO0lBQ2YsY0FBYztJQUNkLHNCQUFzQjtJQUN0QixXQUFXO0lBQ1gsWUFBWTtJQUNaLFlBQVk7SUFDWixhQUFhO0lBQ2IsYUFBYTtJQUNiLFlBQVk7SUFDWixvQkFBb0I7SUFDcEIsa0JBQWtCO0lBQ2xCLFFBQVE7SUFDUixLQUFLO0lBQ0wsV0FBVztJQUNYLFVBQVU7SUFDVixXQUFXO0lBQ1gsV0FBVztJQUNYLGNBQWM7SUFDZCxVQUFVO0lBQ1YsV0FBVztJQUNYLFdBQVc7SUFDWCxLQUFLO0lBQ0wsV0FBVztJQUNYLEtBQUs7SUFDTCxXQUFXO0lBQ1gsU0FBUztJQUNULFVBQVU7SUFDVixVQUFVO0lBQ1YsZUFBZTtJQUNmLFNBQVM7SUFDVCxVQUFVO0lBQ1YsVUFBVTtJQUNWLEtBQUs7SUFDTCxXQUFXO0lBQ1gsYUFBYTtJQUNiLFVBQVU7SUFDVixlQUFlO0lBQ2YsaUJBQWlCO0lBQ2pCLGdCQUFnQjtJQUNoQixzQkFBc0I7SUFDdEIsY0FBYztDQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvY29tbW9uL3V0aWxzL2NvbG9yLnRzXG5cbmltcG9ydCB7XG5cdENNWUssXG5cdENNWUtTdHJpbmcsXG5cdENNWUtWYWx1ZVN0cmluZyxcblx0Q29sb3IsXG5cdENvbG9yU3BhY2UsXG5cdENvbG9yU3BhY2VFeHRlbmRlZCxcblx0Q29sb3JTdHJpbmcsXG5cdENvbW1vblV0aWxzRm5Db2xvcixcblx0Rm9ybWF0LFxuXHRIZXgsXG5cdEhleFZhbHVlLFxuXHRIZXhWYWx1ZVN0cmluZyxcblx0SFNMLFxuXHRIU0xTdHJpbmcsXG5cdEhTTFZhbHVlU3RyaW5nLFxuXHRIU1YsXG5cdEhTVlN0cmluZyxcblx0SFNWVmFsdWVTdHJpbmcsXG5cdExBQixcblx0TEFCVmFsdWVTdHJpbmcsXG5cdFJHQixcblx0UkdCVmFsdWUsXG5cdFJHQlZhbHVlU3RyaW5nLFxuXHRTTCxcblx0U0xTdHJpbmcsXG5cdFN0b3JlZFBhbGV0dGUsXG5cdFNWLFxuXHRTVlN0cmluZyxcblx0WFlaLFxuXHRYWVpWYWx1ZVN0cmluZ1xufSBmcm9tICcuLi8uLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb3JlIH0gZnJvbSAnLi4vY29yZS9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vLi4vZGF0YS9pbmRleC5qcyc7XG5cbmNvbnN0IG1vZGUgPSBkYXRhLm1vZGU7XG5cbi8vICoqKioqKioqIFNFQ1RJT04gMTogUm9idXN0IFR5cGUgR3VhcmRzICoqKioqKioqXG5cbmZ1bmN0aW9uIGlzQ29sb3JGb3JtYXQ8VCBleHRlbmRzIENvbG9yPihcblx0Y29sb3I6IENvbG9yLFxuXHRmb3JtYXQ6IFRbJ2Zvcm1hdCddXG4pOiBjb2xvciBpcyBUIHtcblx0cmV0dXJuIGNvbG9yLmZvcm1hdCA9PT0gZm9ybWF0O1xufVxuXG5mdW5jdGlvbiBpc0NvbG9yU3BhY2UodmFsdWU6IHN0cmluZyk6IHZhbHVlIGlzIENvbG9yU3BhY2Uge1xuXHRyZXR1cm4gWydjbXlrJywgJ2hleCcsICdoc2wnLCAnaHN2JywgJ2xhYicsICdyZ2InLCAneHl6J10uaW5jbHVkZXModmFsdWUpO1xufVxuXG5mdW5jdGlvbiBpc0NvbG9yU3BhY2VFeHRlbmRlZCh2YWx1ZTogc3RyaW5nKTogdmFsdWUgaXMgQ29sb3JTcGFjZUV4dGVuZGVkIHtcblx0cmV0dXJuIFtcblx0XHQnY215aycsXG5cdFx0J2hleCcsXG5cdFx0J2hzbCcsXG5cdFx0J2hzdicsXG5cdFx0J2xhYicsXG5cdFx0J3JnYicsXG5cdFx0J3NsJyxcblx0XHQnc3YnLFxuXHRcdCd4eXonXG5cdF0uaW5jbHVkZXModmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb2xvclN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENvbG9yU3RyaW5nIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuXHRjb25zdCBjb2xvclN0cmluZyA9IHZhbHVlIGFzIENvbG9yU3RyaW5nO1xuXHRjb25zdCB2YWxpZFN0cmluZ0Zvcm1hdHM6IENvbG9yU3RyaW5nWydmb3JtYXQnXVtdID0gW1xuXHRcdCdjbXlrJyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnc2wnLFxuXHRcdCdzdidcblx0XTtcblxuXHRyZXR1cm4gKFxuXHRcdCd2YWx1ZScgaW4gY29sb3JTdHJpbmcgJiZcblx0XHQnZm9ybWF0JyBpbiBjb2xvclN0cmluZyAmJlxuXHRcdHZhbGlkU3RyaW5nRm9ybWF0cy5pbmNsdWRlcyhjb2xvclN0cmluZy5mb3JtYXQpXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzRm9ybWF0KGZvcm1hdDogdW5rbm93bik6IGZvcm1hdCBpcyBGb3JtYXQge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiBmb3JtYXQgPT09ICdzdHJpbmcnICYmXG5cdFx0WydjbXlrJywgJ2hleCcsICdoc2wnLCAnaHN2JywgJ2xhYicsICdyZ2InLCAnc2wnLCAnc3YnLCAneHl6J10uaW5jbHVkZXMoXG5cdFx0XHRmb3JtYXRcblx0XHQpXG5cdCk7XG59XG5cbi8vICoqKioqKioqIFNFQ1RJT04gMjogTmFycm93IFR5cGUgR3VhcmRzICoqKioqKioqXG5cbmZ1bmN0aW9uIGlzQ01ZS0NvbG9yKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ01ZSyB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgQ01ZSykuZm9ybWF0ID09PSAnY215aycgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLKS52YWx1ZS5jeWFuID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZSykudmFsdWUubWFnZW50YSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUspLnZhbHVlLnllbGxvdyA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUspLnZhbHVlLmtleSA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNDTVlLRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIENNWUsge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2NteWsnKTtcbn1cblxuZnVuY3Rpb24gaXNDTVlLU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ01ZS1N0cmluZyB7XG5cdHJldHVybiAoXG5cdFx0aXNDb2xvclN0cmluZyh2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBDTVlLU3RyaW5nKS5mb3JtYXQgPT09ICdjbXlrJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUtTdHJpbmcpLnZhbHVlLmN5YW4gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLU3RyaW5nKS52YWx1ZS5tYWdlbnRhID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZS1N0cmluZykudmFsdWUueWVsbG93ID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZS1N0cmluZykudmFsdWUua2V5ID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hleCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhleCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgSGV4KS5mb3JtYXQgPT09ICdoZXgnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSGV4KS52YWx1ZS5oZXggPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSGV4Rm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIEhleCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnaGV4Jyk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIU0wge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIEhTTCkuZm9ybWF0ID09PSAnaHNsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTCkudmFsdWUuaHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMKS52YWx1ZS5saWdodG5lc3MgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIEhTTCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnaHNsJyk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgSFNMU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHRpc0NvbG9yU3RyaW5nKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIEhTTFN0cmluZykuZm9ybWF0ID09PSAnaHNsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTFN0cmluZykudmFsdWUuaHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMU3RyaW5nKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMU3RyaW5nKS52YWx1ZS5saWdodG5lc3MgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNWQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIU1Yge1xuXHRyZXR1cm4gKFxuXHRcdGNvcmUuZ3VhcmRzLmlzQ29sb3IodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgSFNWKS5mb3JtYXQgPT09ICdoc3YnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNWKS52YWx1ZS5odWUgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1YpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1YpLnZhbHVlLnZhbHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hTVkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBIU1Yge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2hzdicpO1xufVxuXG5mdW5jdGlvbiBpc0hTVlN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhTVlN0cmluZyB7XG5cdHJldHVybiAoXG5cdFx0aXNDb2xvclN0cmluZyh2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBIU1ZTdHJpbmcpLmZvcm1hdCA9PT0gJ2hzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1ZTdHJpbmcpLnZhbHVlLmh1ZSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVlN0cmluZykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVlN0cmluZykudmFsdWUudmFsdWUgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzTEFCKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgTEFCIHtcblx0cmV0dXJuIChcblx0XHRjb3JlLmd1YXJkcy5pc0NvbG9yKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIExBQikuZm9ybWF0ID09PSAnbGFiJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIExBQikudmFsdWUubCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIExBQikudmFsdWUuYSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIExBQikudmFsdWUuYiA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNMQUJGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgTEFCIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdsYWInKTtcbn1cblxuZnVuY3Rpb24gaXNSR0IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBSR0Ige1xuXHRyZXR1cm4gKFxuXHRcdGNvcmUuZ3VhcmRzLmlzQ29sb3IodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgUkdCKS5mb3JtYXQgPT09ICdyZ2InICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgUkdCKS52YWx1ZS5yZWQgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBSR0IpLnZhbHVlLmdyZWVuID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgUkdCKS52YWx1ZS5ibHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1JHQkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBSR0Ige1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ3JnYicpO1xufVxuXG5mdW5jdGlvbiBpc1NMQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBTTCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgU0wpLmZvcm1hdCA9PT0gJ3NsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNMKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU0wpLnZhbHVlLmxpZ2h0bmVzcyA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNTTEZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBTTCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnc2wnKTtcbn1cblxuZnVuY3Rpb24gaXNTTFN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFNMU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBTTFN0cmluZykuZm9ybWF0ID09PSAnc2wnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU0xTdHJpbmcpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTTFN0cmluZykudmFsdWUubGlnaHRuZXNzID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1NWQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBTViB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgU1YpLmZvcm1hdCA9PT0gJ3N2JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNWKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU1YpLnZhbHVlLnZhbHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1NWRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIFNWIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdzdicpO1xufVxuXG5mdW5jdGlvbiBpc1NWU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgU1ZTdHJpbmcge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFNWU3RyaW5nKS5mb3JtYXQgPT09ICdzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTVlN0cmluZykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNWU3RyaW5nKS52YWx1ZS52YWx1ZSA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNYWVoodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBYWVoge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFhZWikuZm9ybWF0ID09PSAneHl6JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFhZWikudmFsdWUueCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFhZWikudmFsdWUueSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFhZWikudmFsdWUueiA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNYWVpGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgWFlaIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICd4eXonKTtcbn1cblxuLy8gKioqKiogU0VDVElPTiAzOiBVdGlsaXR5IEd1YXJkcyAqKioqKlxuXG5mdW5jdGlvbiBlbnN1cmVIYXNoKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRyZXR1cm4gdmFsdWUuc3RhcnRzV2l0aCgnIycpID8gdmFsdWUgOiBgIyR7dmFsdWV9YDtcbn1cblxuZnVuY3Rpb24gaXNDb252ZXJ0aWJsZUNvbG9yKFxuXHRjb2xvcjogQ29sb3Jcbik6IGNvbG9yIGlzIENNWUsgfCBIZXggfCBIU0wgfCBIU1YgfCBMQUIgfCBSR0Ige1xuXHRyZXR1cm4gKFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2NteWsnIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnaGV4JyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2hzbCcgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdoc3YnIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnbGFiJyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ3JnYidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNJbnB1dEVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsKTogZWxlbWVudCBpcyBIVE1MRWxlbWVudCB7XG5cdHJldHVybiBlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudDtcbn1cblxuZnVuY3Rpb24gaXNTdG9yZWRQYWxldHRlKG9iajogdW5rbm93bik6IG9iaiBpcyBTdG9yZWRQYWxldHRlIHtcblx0aWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG5cdGNvbnN0IGNhbmRpZGF0ZSA9IG9iaiBhcyBQYXJ0aWFsPFN0b3JlZFBhbGV0dGU+O1xuXG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIGNhbmRpZGF0ZS50YWJsZUlEID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiBjYW5kaWRhdGUucGFsZXR0ZSA9PT0gJ29iamVjdCcgJiZcblx0XHRBcnJheS5pc0FycmF5KGNhbmRpZGF0ZS5wYWxldHRlLml0ZW1zKSAmJlxuXHRcdHR5cGVvZiBjYW5kaWRhdGUucGFsZXR0ZS5pZCA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gbmFycm93VG9Db2xvcihjb2xvcjogQ29sb3IgfCBDb2xvclN0cmluZyk6IENvbG9yIHwgbnVsbCB7XG5cdGlmIChpc0NvbG9yU3RyaW5nKGNvbG9yKSkge1xuXHRcdHJldHVybiBjb3JlLmNvbnZlcnQudG9Db2xvcihjb2xvcik7XG5cdH1cblxuXHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCBhcyBDb2xvclNwYWNlRXh0ZW5kZWQpIHtcblx0XHRjYXNlICdjbXlrJzpcblx0XHRjYXNlICdoZXgnOlxuXHRcdGNhc2UgJ2hzbCc6XG5cdFx0Y2FzZSAnaHN2Jzpcblx0XHRjYXNlICdsYWInOlxuXHRcdGNhc2UgJ3NsJzpcblx0XHRjYXNlICdzdic6XG5cdFx0Y2FzZSAncmdiJzpcblx0XHRjYXNlICd4eXonOlxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG4vLyAqKioqKioqKiBTRUNUSU9OIDQ6IFRSQU5TRk9STSBVVElMUyAqKioqKioqKlxuXG5mdW5jdGlvbiBhZGRIYXNoVG9IZXgoaGV4OiBIZXgpOiBIZXgge1xuXHR0cnkge1xuXHRcdHJldHVybiBoZXgudmFsdWUuaGV4LnN0YXJ0c1dpdGgoJyMnKVxuXHRcdFx0PyBoZXhcblx0XHRcdDoge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRoZXg6IGNvcmUuYnJhbmQuYXNIZXhTZXQoYCMke2hleC52YWx1ZX19YCksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZS5icmFuZC5hc0hleENvbXBvbmVudChgIyRoZXgudmFsdWUuYWxwaGFgKSxcblx0XHRcdFx0XHRcdG51bUFscGhhOiBjb3JlLmJyYW5kLmFzQWxwaGFSYW5nZShoZXgudmFsdWUubnVtQWxwaGEpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnIGFzICdoZXgnXG5cdFx0XHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKGBhZGRIYXNoVG9IZXggZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5icmFuZENvbG9yLmFzSGV4KGRhdGEuZGVmYXVsdHMuY29sb3JzLmhleCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY29sb3JUb0NvbG9yU3RyaW5nKGNvbG9yOiBDb2xvcik6IENvbG9yU3RyaW5nIHtcblx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjb3JlLmJhc2UuY2xvbmUoY29sb3IpIGFzIEV4Y2x1ZGU8Q29sb3IsIEhleD47XG5cblx0aWYgKGlzQ29sb3JTdHJpbmcoY2xvbmVkQ29sb3IpKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdGBBbHJlYWR5IGZvcm1hdHRlZCBhcyBjb2xvciBzdHJpbmc6ICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gY2xvbmVkQ29sb3I7XG5cdH1cblxuXHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoY2xvbmVkQ29sb3IudmFsdWUpO1xuXG5cdGlmIChpc0NNWUtDb2xvcihjbG9uZWRDb2xvcikpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnY215aycsXG5cdFx0XHR2YWx1ZTogbmV3VmFsdWUgYXMgdW5rbm93biBhcyBDTVlLVmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzSGV4KGNsb25lZENvbG9yKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdoZXgnLFxuXHRcdFx0dmFsdWU6IG5ld1ZhbHVlIGFzIHVua25vd24gYXMgSGV4VmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzSFNMQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2hzbCcsXG5cdFx0XHR2YWx1ZTogbmV3VmFsdWUgYXMgdW5rbm93biBhcyBIU0xWYWx1ZVN0cmluZ1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNIU1ZDb2xvcihjbG9uZWRDb2xvcikpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnaHN2Jyxcblx0XHRcdHZhbHVlOiBuZXdWYWx1ZSBhcyB1bmtub3duIGFzIEhTVlZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc0xBQihjbG9uZWRDb2xvcikpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnbGFiJyxcblx0XHRcdHZhbHVlOiBuZXdWYWx1ZSBhcyB1bmtub3duIGFzIExBQlZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc1JHQihjbG9uZWRDb2xvcikpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAncmdiJyxcblx0XHRcdHZhbHVlOiBuZXdWYWx1ZSBhcyB1bmtub3duIGFzIFJHQlZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc1hZWihjbG9uZWRDb2xvcikpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAneHl6Jyxcblx0XHRcdHZhbHVlOiBuZXdWYWx1ZSBhcyB1bmtub3duIGFzIFhZWlZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRpZiAoIW1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGZvcm1hdDogJHtjbG9uZWRDb2xvci5mb3JtYXR9YCk7XG5cdFx0ZWxzZSBpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBVbnN1cHBvcnRlZCBmb3JtYXQ6ICR7Y2xvbmVkQ29sb3IuZm9ybWF0fWApO1xuXHRcdGVsc2UgaWYgKCFtb2RlLnF1aWV0KVxuXHRcdFx0Y29uc29sZS53YXJuKCdGYWlsZWQgdG8gY29udmVydCB0byBjb2xvciBzdHJpbmcuJyk7XG5cblx0XHRyZXR1cm4gZGF0YS5kZWZhdWx0cy5jb2xvclN0cmluZ3MuaHNsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvbXBvbmVudFRvSGV4KGNvbXBvbmVudDogbnVtYmVyKTogc3RyaW5nIHtcblx0dHJ5IHtcblx0XHRjb25zdCBoZXggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIGNvbXBvbmVudCkpLnRvU3RyaW5nKDE2KTtcblxuXHRcdHJldHVybiBoZXgubGVuZ3RoID09PSAxID8gJzAnICsgaGV4IDogaGV4O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmICghbW9kZS5xdWlldCkgY29uc29sZS5lcnJvcihgY29tcG9uZW50VG9IZXggZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gJzAwJztcblx0fVxufVxuXG5mdW5jdGlvbiBmb3JtYXRDb2xvcihcblx0Y29sb3I6IENvbG9yLFxuXHRhc0NvbG9yU3RyaW5nOiBib29sZWFuID0gZmFsc2UsXG5cdGFzQ1NTU3RyaW5nOiBib29sZWFuID0gZmFsc2Vcbik6IHsgYmFzZUNvbG9yOiBDb2xvcjsgZm9ybWF0dGVkU3RyaW5nPzogQ29sb3JTdHJpbmcgfCBzdHJpbmcgfSB7XG5cdGNvbnN0IGJhc2VDb2xvciA9IGNvcmUuYmFzZS5jbG9uZShjb2xvcik7XG5cblx0bGV0IGZvcm1hdHRlZFN0cmluZzogQ29sb3JTdHJpbmcgfCBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cblx0aWYgKGFzQ29sb3JTdHJpbmcpIHtcblx0XHRmb3JtYXR0ZWRTdHJpbmcgPSBjb2xvclRvQ29sb3JTdHJpbmcoXG5cdFx0XHRjb2xvciBhcyBFeGNsdWRlPENvbG9yLCBIZXggfCBMQUIgfCBSR0I+XG5cdFx0KSBhcyBDb2xvclN0cmluZztcblx0fSBlbHNlIGlmIChhc0NTU1N0cmluZykge1xuXHRcdGZvcm1hdHRlZFN0cmluZyA9IGNvcmUuY29udmVydC50b0NTU0NvbG9yU3RyaW5nKGNvbG9yKSBhcyBzdHJpbmc7XG5cdH1cblxuXHRyZXR1cm4gZm9ybWF0dGVkU3RyaW5nICE9PSB1bmRlZmluZWRcblx0XHQ/IHsgYmFzZUNvbG9yLCBmb3JtYXR0ZWRTdHJpbmcgfVxuXHRcdDogeyBiYXNlQ29sb3IgfTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0UGVyY2VudGFnZVZhbHVlczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4+KFxuXHR2YWx1ZTogVFxuKTogVCB7XG5cdHJldHVybiBPYmplY3QuZW50cmllcyh2YWx1ZSkucmVkdWNlKFxuXHRcdChhY2MsIFtrZXksIHZhbF0pID0+IHtcblx0XHRcdChhY2MgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pW2tleV0gPSBbXG5cdFx0XHRcdCdzYXR1cmF0aW9uJyxcblx0XHRcdFx0J2xpZ2h0bmVzcycsXG5cdFx0XHRcdCd2YWx1ZScsXG5cdFx0XHRcdCdjeWFuJyxcblx0XHRcdFx0J21hZ2VudGEnLFxuXHRcdFx0XHQneWVsbG93Jyxcblx0XHRcdFx0J2tleSdcblx0XHRcdF0uaW5jbHVkZXMoa2V5KVxuXHRcdFx0XHQ/IGAke3ZhbH0lYFxuXHRcdFx0XHQ6IHZhbDtcblx0XHRcdHJldHVybiBhY2M7XG5cdFx0fSxcblx0XHR7fSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuXHQpIGFzIFQ7XG59XG5cbmZ1bmN0aW9uIGdldEFscGhhRnJvbUhleChoZXg6IHN0cmluZyk6IG51bWJlciB7XG5cdGlmIChoZXgubGVuZ3RoICE9PSA5IHx8ICFoZXguc3RhcnRzV2l0aCgnIycpKSB7XG5cdFx0aWYgKCFtb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRgSW52YWxpZCBoZXggY29sb3I6ICR7aGV4fS4gRXhwZWN0ZWQgZm9ybWF0ICNSUkdHQkJBQWBcblx0XHRcdCk7XG5cdFx0ZWxzZSBpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRgSW52YWxpZCBoZXggY29sb3I6ICR7aGV4fS4gRXhwZWN0ZWQgZm9ybWF0ICNSUkdHQkJBQWBcblx0XHRcdCk7XG5cdFx0ZWxzZSBpZiAoIW1vZGUucXVpZXQpXG5cdFx0XHRjb25zb2xlLndhcm4oJ0ZhaWxlZCB0byBwYXJzZSBhbHBoYSBmcm9tIGhleCBjb2xvci4nKTtcblx0fVxuXG5cdGNvbnN0IGFscGhhSGV4ID0gaGV4LnNsaWNlKC0yKTtcblx0Y29uc3QgYWxwaGFEZWNpbWFsID0gcGFyc2VJbnQoYWxwaGFIZXgsIDE2KTtcblxuXHRyZXR1cm4gYWxwaGFEZWNpbWFsIC8gMjU1O1xufVxuXG5mdW5jdGlvbiBnZXRDb2xvclN0cmluZyhjb2xvcjogQ29sb3IpOiBzdHJpbmcgfCBudWxsIHtcblx0dHJ5IHtcblx0XHRjb25zdCBmb3JtYXR0ZXJzID0ge1xuXHRcdFx0Y215azogKGM6IENNWUspID0+XG5cdFx0XHRcdGBjbXlrKCR7Yy52YWx1ZS5jeWFufSwgJHtjLnZhbHVlLm1hZ2VudGF9LCAke2MudmFsdWUueWVsbG93fSwgJHtjLnZhbHVlLmtleX0sICR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdGhleDogKGM6IEhleCkgPT4gYy52YWx1ZS5oZXgsXG5cdFx0XHRoc2w6IChjOiBIU0wpID0+XG5cdFx0XHRcdGBoc2woJHtjLnZhbHVlLmh1ZX0sICR7Yy52YWx1ZS5zYXR1cmF0aW9ufSUsICR7Yy52YWx1ZS5saWdodG5lc3N9JSwke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHRoc3Y6IChjOiBIU1YpID0+XG5cdFx0XHRcdGBoc3YoJHtjLnZhbHVlLmh1ZX0sICR7Yy52YWx1ZS5zYXR1cmF0aW9ufSUsICR7Yy52YWx1ZS52YWx1ZX0lLCR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdGxhYjogKGM6IExBQikgPT5cblx0XHRcdFx0YGxhYigke2MudmFsdWUubH0sICR7Yy52YWx1ZS5hfSwgJHtjLnZhbHVlLmJ9LCR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdHJnYjogKGM6IFJHQikgPT5cblx0XHRcdFx0YHJnYigke2MudmFsdWUucmVkfSwgJHtjLnZhbHVlLmdyZWVufSwgJHtjLnZhbHVlLmJsdWV9LCR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdHh5ejogKGM6IFhZWikgPT5cblx0XHRcdFx0YHh5eigke2MudmFsdWUueH0sICR7Yy52YWx1ZS55fSwgJHtjLnZhbHVlLnp9LCR7Yy52YWx1ZS5hbHBoYX0pYFxuXHRcdH07XG5cblx0XHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmNteWsoY29sb3IpO1xuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMuaGV4KGNvbG9yKTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmhzbChjb2xvcik7XG5cdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5oc3YoY29sb3IpO1xuXHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMubGFiKGNvbG9yKTtcblx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLnJnYihjb2xvcik7XG5cdFx0XHRjYXNlICd4eXonOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy54eXooY29sb3IpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0aWYgKCFtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQgZm9yICR7Y29sb3J9YCk7XG5cblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmICghbW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoYGdldENvbG9yU3RyaW5nIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4QWxwaGFUb051bWVyaWNBbHBoYShoZXhBbHBoYTogc3RyaW5nKTogbnVtYmVyIHtcblx0cmV0dXJuIHBhcnNlSW50KGhleEFscGhhLCAxNikgLyAyNTU7XG59XG5cbmNvbnN0IHBhcnNlQ29sb3IgPSAoY29sb3JTcGFjZTogQ29sb3JTcGFjZSwgdmFsdWU6IHN0cmluZyk6IENvbG9yIHwgbnVsbCA9PiB7XG5cdHRyeSB7XG5cdFx0c3dpdGNoIChjb2xvclNwYWNlKSB7XG5cdFx0XHRjYXNlICdjbXlrJzoge1xuXHRcdFx0XHRjb25zdCBbYywgbSwgeSwgaywgYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDUpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGN5YW46IGNvcmUuYnJhbmQuYXNQZXJjZW50aWxlKGMpLFxuXHRcdFx0XHRcdFx0bWFnZW50YTogY29yZS5icmFuZC5hc1BlcmNlbnRpbGUobSksXG5cdFx0XHRcdFx0XHR5ZWxsb3c6IGNvcmUuYnJhbmQuYXNQZXJjZW50aWxlKHkpLFxuXHRcdFx0XHRcdFx0a2V5OiBjb3JlLmJyYW5kLmFzUGVyY2VudGlsZShrKSxcblx0XHRcdFx0XHRcdGFscGhhOiBjb3JlLmJyYW5kLmFzQWxwaGFSYW5nZShhKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdGNvbnN0IGhleFZhbHVlID0gdmFsdWUuc3RhcnRzV2l0aCgnIycpID8gdmFsdWUgOiBgIyR7dmFsdWV9YDtcblx0XHRcdFx0Y29uc3QgYWxwaGEgPSBoZXhWYWx1ZS5sZW5ndGggPT09IDkgPyBoZXhWYWx1ZS5zbGljZSgtMikgOiAnRkYnO1xuXHRcdFx0XHRjb25zdCBudW1BbHBoYSA9IGhleEFscGhhVG9OdW1lcmljQWxwaGEoYWxwaGEpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGhleDogY29yZS5icmFuZC5hc0hleFNldChoZXhWYWx1ZSksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZS5icmFuZC5hc0hleENvbXBvbmVudChhbHBoYSksXG5cdFx0XHRcdFx0XHRudW1BbHBoYTogY29yZS5icmFuZC5hc0FscGhhUmFuZ2UobnVtQWxwaGEpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdH07XG5cdFx0XHRjYXNlICdoc2wnOiB7XG5cdFx0XHRcdGNvbnN0IFtoLCBzLCBsLCBhXSA9IHBhcnNlQ29tcG9uZW50cyh2YWx1ZSwgNCk7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aHVlOiBjb3JlLmJyYW5kLmFzUmFkaWFsKGgpLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogY29yZS5icmFuZC5hc1BlcmNlbnRpbGUocyksXG5cdFx0XHRcdFx0XHRsaWdodG5lc3M6IGNvcmUuYnJhbmQuYXNQZXJjZW50aWxlKGwpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGNvcmUuYnJhbmQuYXNBbHBoYVJhbmdlKGEpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdoc3YnOiB7XG5cdFx0XHRcdGNvbnN0IFtoLCBzLCB2LCBhXSA9IHBhcnNlQ29tcG9uZW50cyh2YWx1ZSwgNCk7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aHVlOiBjb3JlLmJyYW5kLmFzUmFkaWFsKGgpLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogY29yZS5icmFuZC5hc1BlcmNlbnRpbGUocyksXG5cdFx0XHRcdFx0XHR2YWx1ZTogY29yZS5icmFuZC5hc1BlcmNlbnRpbGUodiksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZS5icmFuZC5hc0FscGhhUmFuZ2UoYSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGNhc2UgJ2xhYic6IHtcblx0XHRcdFx0Y29uc3QgW2wsIGEsIGIsIGFscGhhXSA9IHBhcnNlQ29tcG9uZW50cyh2YWx1ZSwgNCk7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGw6IGNvcmUuYnJhbmQuYXNMQUJfTChsKSxcblx0XHRcdFx0XHRcdGE6IGNvcmUuYnJhbmQuYXNMQUJfQShhKSxcblx0XHRcdFx0XHRcdGI6IGNvcmUuYnJhbmQuYXNMQUJfQihiKSxcblx0XHRcdFx0XHRcdGFscGhhOiBjb3JlLmJyYW5kLmFzQWxwaGFSYW5nZShhbHBoYSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGNhc2UgJ3JnYic6IHtcblx0XHRcdFx0Y29uc3QgY29tcG9uZW50cyA9IHZhbHVlLnNwbGl0KCcsJykubWFwKE51bWJlcik7XG5cblx0XHRcdFx0aWYgKGNvbXBvbmVudHMuc29tZShpc05hTikpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFJHQiBmb3JtYXQnKTtcblxuXHRcdFx0XHRjb25zdCBbciwgZywgYiwgYV0gPSBjb21wb25lbnRzO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdHJlZDogY29yZS5icmFuZC5hc0J5dGVSYW5nZShyKSxcblx0XHRcdFx0XHRcdGdyZWVuOiBjb3JlLmJyYW5kLmFzQnl0ZVJhbmdlKGcpLFxuXHRcdFx0XHRcdFx0Ymx1ZTogY29yZS5icmFuZC5hc0J5dGVSYW5nZShiKSxcblx0XHRcdFx0XHRcdGFscGhhOiBjb3JlLmJyYW5kLmFzQWxwaGFSYW5nZShhKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Y29uc3QgbWVzc2FnZSA9IGBVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQ6ICR7Y29sb3JTcGFjZX1gO1xuXG5cdFx0XHRcdGlmIChtb2RlLmdyYWNlZnVsRXJyb3JzKSB7XG5cdFx0XHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuXHRcdFx0XHRcdGVsc2UgaWYgKCFtb2RlLnF1aWV0KVxuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGBGYWlsZWQgdG8gcGFyc2UgY29sb3I6ICR7bWVzc2FnZX1gKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKGBwYXJzZUNvbG9yIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn07XG5cbmZ1bmN0aW9uIHBhcnNlQ29tcG9uZW50cyh2YWx1ZTogc3RyaW5nLCBjb3VudDogbnVtYmVyKTogbnVtYmVyW10ge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNvbXBvbmVudHMgPSB2YWx1ZVxuXHRcdFx0LnNwbGl0KCcsJylcblx0XHRcdC5tYXAodmFsID0+XG5cdFx0XHRcdHZhbC50cmltKCkuZW5kc1dpdGgoJyUnKVxuXHRcdFx0XHRcdD8gcGFyc2VGbG9hdCh2YWwpXG5cdFx0XHRcdFx0OiBwYXJzZUZsb2F0KHZhbCkgKiAxMDBcblx0XHRcdCk7XG5cblx0XHRpZiAoY29tcG9uZW50cy5sZW5ndGggIT09IGNvdW50KVxuXHRcdFx0aWYgKCFtb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkICR7Y291bnR9IGNvbXBvbmVudHMuYCk7XG5cdFx0XHRlbHNlIGlmIChtb2RlLmVycm9yTG9ncykge1xuXHRcdFx0XHRpZiAoIW1vZGUucXVpZXQpIGNvbnNvbGUud2FybihgRXhwZWN0ZWQgJHtjb3VudH0gY29tcG9uZW50cy5gKTtcblxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBFeHBlY3RlZCAke2NvdW50fSBjb21wb25lbnRzLmApO1xuXG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblxuXHRcdHJldHVybiBjb21wb25lbnRzO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgRXJyb3IgcGFyc2luZyBjb21wb25lbnRzOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIFtdO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHBhcnNlSGV4V2l0aEFscGhhKGhleFZhbHVlOiBzdHJpbmcpOiBIZXhWYWx1ZSB8IG51bGwge1xuXHRjb25zdCBoZXggPSBoZXhWYWx1ZS5zdGFydHNXaXRoKCcjJykgPyBoZXhWYWx1ZSA6IGAjJHtoZXhWYWx1ZX1gO1xuXHRjb25zdCBhbHBoYSA9IGhleC5sZW5ndGggPT09IDkgPyBoZXguc2xpY2UoLTIpIDogJ0ZGJztcblx0Y29uc3QgbnVtQWxwaGEgPSBoZXhBbHBoYVRvTnVtZXJpY0FscGhhKGFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdGhleDogY29yZS5icmFuZC5hc0hleFNldChoZXgpLFxuXHRcdGFscGhhOiBjb3JlLmJyYW5kLmFzSGV4Q29tcG9uZW50KGFscGhhKSxcblx0XHRudW1BbHBoYTogY29yZS5icmFuZC5hc0FscGhhUmFuZ2UobnVtQWxwaGEpXG5cdH07XG59XG5cbmZ1bmN0aW9uIHN0cmlwSGFzaEZyb21IZXgoaGV4OiBIZXgpOiBIZXgge1xuXHR0cnkge1xuXHRcdGNvbnN0IGhleFN0cmluZyA9IGAke2hleC52YWx1ZS5oZXh9JHtoZXgudmFsdWUuYWxwaGF9YDtcblxuXHRcdHJldHVybiBoZXgudmFsdWUuaGV4LnN0YXJ0c1dpdGgoJyMnKVxuXHRcdFx0PyB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGhleDogY29yZS5icmFuZC5hc0hleFNldChoZXhTdHJpbmcuc2xpY2UoMSkpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGNvcmUuYnJhbmQuYXNIZXhDb21wb25lbnQoXG5cdFx0XHRcdFx0XHRcdFN0cmluZyhoZXgudmFsdWUuYWxwaGEpXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0bnVtQWxwaGE6IGNvcmUuYnJhbmQuYXNBbHBoYVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRoZXhBbHBoYVRvTnVtZXJpY0FscGhhKFN0cmluZyhoZXgudmFsdWUuYWxwaGEpKVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4JyBhcyAnaGV4J1xuXHRcdFx0XHR9XG5cdFx0XHQ6IGhleDtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoYHN0cmlwSGFzaEZyb21IZXggZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRjb25zdCB1bmJyYW5kZWRIZXggPSBjb3JlLmJhc2UuY2xvbmUoZGF0YS5kZWZhdWx0cy5jb2xvcnMuaGV4KTtcblxuXHRcdHJldHVybiBjb3JlLmJyYW5kQ29sb3IuYXNIZXgodW5icmFuZGVkSGV4KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzdHJpcFBlcmNlbnRGcm9tVmFsdWVzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBudW1iZXIgfCBzdHJpbmc+Pihcblx0dmFsdWU6IFRcbik6IHsgW0sgaW4ga2V5b2YgVF06IFRbS10gZXh0ZW5kcyBgJHtudW1iZXJ9JWAgPyBudW1iZXIgOiBUW0tdIH0ge1xuXHRyZXR1cm4gT2JqZWN0LmVudHJpZXModmFsdWUpLnJlZHVjZShcblx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHRjb25zdCBwYXJzZWRWYWx1ZSA9XG5cdFx0XHRcdHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIHZhbC5lbmRzV2l0aCgnJScpXG5cdFx0XHRcdFx0PyBwYXJzZUZsb2F0KHZhbC5zbGljZSgwLCAtMSkpXG5cdFx0XHRcdFx0OiB2YWw7XG5cdFx0XHRhY2Nba2V5IGFzIGtleW9mIFRdID0gcGFyc2VkVmFsdWUgYXMgVFtrZXlvZiBUXSBleHRlbmRzIGAke251bWJlcn0lYFxuXHRcdFx0XHQ/IG51bWJlclxuXHRcdFx0XHQ6IFRba2V5b2YgVF07XG5cdFx0XHRyZXR1cm4gYWNjO1xuXHRcdH0sXG5cdFx0e30gYXMgeyBbSyBpbiBrZXlvZiBUXTogVFtLXSBleHRlbmRzIGAke251bWJlcn0lYCA/IG51bWJlciA6IFRbS10gfVxuXHQpO1xufVxuXG5mdW5jdGlvbiB0b0hleFdpdGhBbHBoYShyZ2JWYWx1ZTogUkdCVmFsdWUpOiBzdHJpbmcge1xuXHRjb25zdCB7IHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhIH0gPSByZ2JWYWx1ZTtcblxuXHRjb25zdCBoZXggPSBgIyR7KCgxIDw8IDI0KSArIChyZWQgPDwgMTYpICsgKGdyZWVuIDw8IDgpICsgYmx1ZSlcblx0XHQudG9TdHJpbmcoMTYpXG5cdFx0LnNsaWNlKDEpfWA7XG5cdGNvbnN0IGFscGhhSGV4ID0gTWF0aC5yb3VuZChhbHBoYSAqIDI1NSlcblx0XHQudG9TdHJpbmcoMTYpXG5cdFx0LnBhZFN0YXJ0KDIsICcwJyk7XG5cblx0cmV0dXJuIGAke2hleH0ke2FscGhhSGV4fWA7XG59XG5cbmV4cG9ydCBjb25zdCBjb2xvcjogQ29tbW9uVXRpbHNGbkNvbG9yID0ge1xuXHRhZGRIYXNoVG9IZXgsXG5cdGNvbG9yVG9Db2xvclN0cmluZyxcblx0Y29tcG9uZW50VG9IZXgsXG5cdGVuc3VyZUhhc2gsXG5cdGZvcm1hdENvbG9yLFxuXHRmb3JtYXRQZXJjZW50YWdlVmFsdWVzLFxuXHRnZXRBbHBoYUZyb21IZXgsXG5cdGdldENvbG9yU3RyaW5nLFxuXHRoZXhBbHBoYVRvTnVtZXJpY0FscGhhLFxuXHRpc0NNWUtDb2xvcixcblx0aXNDTVlLRm9ybWF0LFxuXHRpc0NNWUtTdHJpbmcsXG5cdGlzQ29sb3JGb3JtYXQsXG5cdGlzQ29sb3JTdHJpbmcsXG5cdGlzQ29sb3JTcGFjZSxcblx0aXNDb2xvclNwYWNlRXh0ZW5kZWQsXG5cdGlzQ29udmVydGlibGVDb2xvcixcblx0aXNGb3JtYXQsXG5cdGlzSGV4LFxuXHRpc0hleEZvcm1hdCxcblx0aXNIU0xDb2xvcixcblx0aXNIU0xGb3JtYXQsXG5cdGlzSFNMU3RyaW5nLFxuXHRpc0lucHV0RWxlbWVudCxcblx0aXNIU1ZDb2xvcixcblx0aXNIU1ZGb3JtYXQsXG5cdGlzSFNWU3RyaW5nLFxuXHRpc0xBQixcblx0aXNMQUJGb3JtYXQsXG5cdGlzUkdCLFxuXHRpc1JHQkZvcm1hdCxcblx0aXNTTENvbG9yLFxuXHRpc1NMRm9ybWF0LFxuXHRpc1NMU3RyaW5nLFxuXHRpc1N0b3JlZFBhbGV0dGUsXG5cdGlzU1ZDb2xvcixcblx0aXNTVkZvcm1hdCxcblx0aXNTVlN0cmluZyxcblx0aXNYWVosXG5cdGlzWFlaRm9ybWF0LFxuXHRuYXJyb3dUb0NvbG9yLFxuXHRwYXJzZUNvbG9yLFxuXHRwYXJzZUNvbXBvbmVudHMsXG5cdHBhcnNlSGV4V2l0aEFscGhhLFxuXHRzdHJpcEhhc2hGcm9tSGV4LFxuXHRzdHJpcFBlcmNlbnRGcm9tVmFsdWVzLFxuXHR0b0hleFdpdGhBbHBoYVxufSBhcyBjb25zdDtcbiJdfQ==