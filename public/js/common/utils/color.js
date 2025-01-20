// File: src/common/utils/color.js
import { core } from '../core/index.js';
import { data } from '../../data/index.js';
import { logger } from '../../logger/index.js';
const mode = data.mode;
const logMode = mode.logging;
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
function isColorString(value) {
    if (typeof value === 'object' && value !== null) {
        const colorString = value;
        const validStringFormats = ['cmyk', 'hsl', 'hsv', 'lab', 'rgb', 'sl', 'sv', 'xyz'];
        return ('value' in colorString &&
            'format' in colorString &&
            validStringFormats.includes(colorString.format));
    }
    return typeof value === 'string' && /^#[0-9A-Fa-f]{6,8}$/.test(value);
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
        return core.convert.colorStringToColor(color);
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
function colorToColorString(color) {
    const clonedColor = core.base.clone(color);
    if (isColorString(clonedColor)) {
        if (logMode.errors) {
            logger.error(`Already formatted as color string: ${JSON.stringify(color)}`);
        }
        return clonedColor;
    }
    if (isCMYKColor(clonedColor)) {
        const newValue = formatPercentageValues(clonedColor.value);
        return {
            format: 'cmyk',
            value: {
                cyan: `${newValue.cyan}%`,
                magenta: `${newValue.magenta}%`,
                yellow: `${newValue.yellow}%`,
                key: `${newValue.key}%`,
                alpha: `${newValue.alpha}`
            }
        };
    }
    else if (isHex(clonedColor)) {
        const newValue = formatPercentageValues(clonedColor.value);
        return {
            format: 'hex',
            value: {
                hex: `${newValue.hex}`,
                alpha: `${newValue.alpha}`,
                numAlpha: `${newValue.numAlpha}`
            }
        };
    }
    else if (isHSLColor(clonedColor)) {
        const newValue = formatPercentageValues(clonedColor.value);
        return {
            format: 'hsl',
            value: {
                hue: `${newValue.hue}`,
                saturation: `${newValue.saturation}%`,
                lightness: `${newValue.lightness}%`,
                alpha: `${newValue.alpha}`
            }
        };
    }
    else if (isHSVColor(clonedColor)) {
        const newValue = formatPercentageValues(clonedColor.value);
        return {
            format: 'hsv',
            value: {
                hue: `${newValue.hue}`,
                saturation: `${newValue.saturation}%`,
                value: `${newValue.value}%`,
                alpha: `${newValue.alpha}`
            }
        };
    }
    else if (isLAB(clonedColor)) {
        const newValue = formatPercentageValues(clonedColor.value);
        return {
            format: 'lab',
            value: {
                l: `${newValue.l}`,
                a: `${newValue.a}`,
                b: `${newValue.b}`,
                alpha: `${newValue.alpha}`
            }
        };
    }
    else if (isRGB(clonedColor)) {
        const newValue = formatPercentageValues(clonedColor.value);
        return {
            format: 'rgb',
            value: {
                red: `${newValue.red}`,
                green: `${newValue.green}`,
                blue: `${newValue.blue}`,
                alpha: `${newValue.alpha}`
            }
        };
    }
    else if (isXYZ(clonedColor)) {
        const newValue = formatPercentageValues(clonedColor.value);
        return {
            format: 'xyz',
            value: {
                x: `${newValue.x}`,
                y: `${newValue.y}`,
                z: `${newValue.z}`,
                alpha: `${newValue.alpha}`
            }
        };
    }
    else {
        if (!mode.gracefulErrors) {
            throw new Error(`Unsupported format: ${clonedColor.format}`);
        }
        else if (logMode.errors) {
            logger.error(`Unsupported format: ${clonedColor.format}`);
        }
        else if (!mode.quiet && logMode.warnings) {
            logger.warning('Failed to convert to color string.');
        }
        return data.defaults.colors.strings.hsl;
    }
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
        else if (logMode.errors)
            logger.error(`Invalid hex color: ${hex}. Expected format #RRGGBBAA`);
        else if (!mode.quiet && logMode.warnings)
            logger.warning('Failed to parse alpha from hex color.');
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
                if (!logMode.errors)
                    logger.error(`Unsupported color format for ${color}`);
                return null;
        }
    }
    catch (error) {
        if (!logMode.errors)
            logger.error(`getColorString error: ${error}`);
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
                    if (logMode.errors)
                        logger.error(message);
                    else if (!mode.quiet && logMode.warnings)
                        logger.warning(`Failed to parse color: ${message}`);
                }
                else {
                    throw new Error(message);
                }
                return null;
        }
    }
    catch (error) {
        if (logMode.errors)
            logger.error(`parseColor error: ${error}`);
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
            else if (logMode.errors) {
                if (!mode.quiet && logMode.warnings)
                    logger.warning(`Expected ${count} components.`);
                return [];
            }
        return components;
    }
    catch (error) {
        if (logMode.errors)
            logger.error(`Error parsing components: ${error}`);
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
        if (logMode.errors)
            logger.error(`stripHashFromHex error: ${error}`);
        const unbrandedHex = core.base.clone(data.defaults.colors.base.unbranded.hex);
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
    colorToColorString,
    ensureHash,
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
export { hexAlphaToNumericAlpha, stripHashFromHex };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL3V0aWxzL2NvbG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGtDQUFrQztBQXdDbEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFL0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN2QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBRTdCLGtEQUFrRDtBQUVsRCxTQUFTLGFBQWEsQ0FDckIsS0FBWSxFQUNaLE1BQW1CO0lBRW5CLE9BQU8sS0FBSyxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUM7QUFDaEMsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLEtBQWE7SUFDbEMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzRSxDQUFDO0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxLQUFhO0lBQzFDLE9BQU87UUFDTixNQUFNO1FBQ04sS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxJQUFJO1FBQ0osSUFBSTtRQUNKLEtBQUs7S0FDTCxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsS0FBYztJQUNwQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDakQsTUFBTSxXQUFXLEdBQUcsS0FBd0MsQ0FBQztRQUM3RCxN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SUFDVixlQUFlO0lBQ2YsU0FBUztJQUNULFVBQVU7SUFDVixVQUFVO0lBQ1YsS0FBSztJQUNMLFdBQVc7SUFDWCxhQUFhO0lBQ2IsVUFBVTtJQUNWLGVBQWU7SUFDZixpQkFBaUI7SUFDakIsZ0JBQWdCO0lBQ2hCLHNCQUFzQjtJQUN0QixjQUFjO0NBQ0wsQ0FBQztBQUVYLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2NvbW1vbi91dGlscy9jb2xvci5qc1xuXG5pbXBvcnQge1xuXHRDTVlLLFxuXHRDTVlLU3RyaW5nLFxuXHRDTVlLVmFsdWUsXG5cdENNWUtWYWx1ZVN0cmluZyxcblx0Q29sb3IsXG5cdENvbG9yU3BhY2UsXG5cdENvbG9yU3BhY2VFeHRlbmRlZCxcblx0Q29sb3JTdHJpbmcsXG5cdENvbW1vblV0aWxzRm5Db2xvcixcblx0Rm9ybWF0LFxuXHRIZXgsXG5cdEhleFN0cmluZyxcblx0SGV4VmFsdWUsXG5cdEhleFZhbHVlU3RyaW5nLFxuXHRIU0wsXG5cdEhTTFN0cmluZyxcblx0SFNMVmFsdWUsXG5cdEhTTFZhbHVlU3RyaW5nLFxuXHRIU1YsXG5cdEhTVlN0cmluZyxcblx0SFNWVmFsdWUsXG5cdEhTVlZhbHVlU3RyaW5nLFxuXHRMQUIsXG5cdExBQlZhbHVlLFxuXHRMQUJWYWx1ZVN0cmluZyxcblx0UkdCLFxuXHRSR0JWYWx1ZSxcblx0UkdCVmFsdWVTdHJpbmcsXG5cdFNMLFxuXHRTTFN0cmluZyxcblx0U3RvcmVkUGFsZXR0ZSxcblx0U1YsXG5cdFNWU3RyaW5nLFxuXHRYWVosXG5cdFhZWlZhbHVlLFxuXHRYWVpWYWx1ZVN0cmluZ1xufSBmcm9tICcuLi8uLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb3JlIH0gZnJvbSAnLi4vY29yZS9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vLi4vZGF0YS9pbmRleC5qcyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLi8uLi9sb2dnZXIvaW5kZXguanMnO1xuXG5jb25zdCBtb2RlID0gZGF0YS5tb2RlO1xuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcblxuLy8gKioqKioqKiogU0VDVElPTiAxOiBSb2J1c3QgVHlwZSBHdWFyZHMgKioqKioqKipcblxuZnVuY3Rpb24gaXNDb2xvckZvcm1hdDxUIGV4dGVuZHMgQ29sb3I+KFxuXHRjb2xvcjogQ29sb3IsXG5cdGZvcm1hdDogVFsnZm9ybWF0J11cbik6IGNvbG9yIGlzIFQge1xuXHRyZXR1cm4gY29sb3IuZm9ybWF0ID09PSBmb3JtYXQ7XG59XG5cbmZ1bmN0aW9uIGlzQ29sb3JTcGFjZSh2YWx1ZTogc3RyaW5nKTogdmFsdWUgaXMgQ29sb3JTcGFjZSB7XG5cdHJldHVybiBbJ2NteWsnLCAnaGV4JywgJ2hzbCcsICdoc3YnLCAnbGFiJywgJ3JnYicsICd4eXonXS5pbmNsdWRlcyh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGlzQ29sb3JTcGFjZUV4dGVuZGVkKHZhbHVlOiBzdHJpbmcpOiB2YWx1ZSBpcyBDb2xvclNwYWNlRXh0ZW5kZWQge1xuXHRyZXR1cm4gW1xuXHRcdCdjbXlrJyxcblx0XHQnaGV4Jyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnbGFiJyxcblx0XHQncmdiJyxcblx0XHQnc2wnLFxuXHRcdCdzdicsXG5cdFx0J3h5eidcblx0XS5pbmNsdWRlcyh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGlzQ29sb3JTdHJpbmcodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDb2xvclN0cmluZyB7XG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsKSB7XG5cdFx0Y29uc3QgY29sb3JTdHJpbmcgPSB2YWx1ZSBhcyBFeGNsdWRlPENvbG9yU3RyaW5nLCBIZXhTdHJpbmc+O1xuXHRcdGNvbnN0IHZhbGlkU3RyaW5nRm9ybWF0czogRXhjbHVkZTxDb2xvclN0cmluZywgSGV4U3RyaW5nPlsnZm9ybWF0J11bXSA9XG5cdFx0XHRbJ2NteWsnLCAnaHNsJywgJ2hzdicsICdsYWInLCAncmdiJywgJ3NsJywgJ3N2JywgJ3h5eiddO1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdCd2YWx1ZScgaW4gY29sb3JTdHJpbmcgJiZcblx0XHRcdCdmb3JtYXQnIGluIGNvbG9yU3RyaW5nICYmXG5cdFx0XHR2YWxpZFN0cmluZ0Zvcm1hdHMuaW5jbHVkZXMoY29sb3JTdHJpbmcuZm9ybWF0KVxuXHRcdCk7XG5cdH1cblxuXHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiAvXiNbMC05QS1GYS1mXXs2LDh9JC8udGVzdCh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGlzRm9ybWF0KGZvcm1hdDogdW5rbm93bik6IGZvcm1hdCBpcyBGb3JtYXQge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiBmb3JtYXQgPT09ICdzdHJpbmcnICYmXG5cdFx0WydjbXlrJywgJ2hleCcsICdoc2wnLCAnaHN2JywgJ2xhYicsICdyZ2InLCAnc2wnLCAnc3YnLCAneHl6J10uaW5jbHVkZXMoXG5cdFx0XHRmb3JtYXRcblx0XHQpXG5cdCk7XG59XG5cbi8vICoqKioqKioqIFNFQ1RJT04gMjogTmFycm93IFR5cGUgR3VhcmRzICoqKioqKioqXG5cbmZ1bmN0aW9uIGlzQ01ZS0NvbG9yKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ01ZSyB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgQ01ZSykuZm9ybWF0ID09PSAnY215aycgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLKS52YWx1ZS5jeWFuID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZSykudmFsdWUubWFnZW50YSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUspLnZhbHVlLnllbGxvdyA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUspLnZhbHVlLmtleSA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNDTVlLRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIENNWUsge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2NteWsnKTtcbn1cblxuZnVuY3Rpb24gaXNDTVlLU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ01ZS1N0cmluZyB7XG5cdHJldHVybiAoXG5cdFx0aXNDb2xvclN0cmluZyh2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBDTVlLU3RyaW5nKS5mb3JtYXQgPT09ICdjbXlrJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUtTdHJpbmcpLnZhbHVlLmN5YW4gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLU3RyaW5nKS52YWx1ZS5tYWdlbnRhID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZS1N0cmluZykudmFsdWUueWVsbG93ID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZS1N0cmluZykudmFsdWUua2V5ID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hleCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhleCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgSGV4KS5mb3JtYXQgPT09ICdoZXgnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSGV4KS52YWx1ZS5oZXggPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSGV4Rm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIEhleCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnaGV4Jyk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIU0wge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIEhTTCkuZm9ybWF0ID09PSAnaHNsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTCkudmFsdWUuaHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMKS52YWx1ZS5saWdodG5lc3MgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIEhTTCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnaHNsJyk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgSFNMU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHRpc0NvbG9yU3RyaW5nKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIEhTTFN0cmluZykuZm9ybWF0ID09PSAnaHNsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTFN0cmluZykudmFsdWUuaHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMU3RyaW5nKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMU3RyaW5nKS52YWx1ZS5saWdodG5lc3MgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNWQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIU1Yge1xuXHRyZXR1cm4gKFxuXHRcdGNvcmUuZ3VhcmRzLmlzQ29sb3IodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgSFNWKS5mb3JtYXQgPT09ICdoc3YnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNWKS52YWx1ZS5odWUgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1YpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1YpLnZhbHVlLnZhbHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hTVkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBIU1Yge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2hzdicpO1xufVxuXG5mdW5jdGlvbiBpc0hTVlN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhTVlN0cmluZyB7XG5cdHJldHVybiAoXG5cdFx0aXNDb2xvclN0cmluZyh2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBIU1ZTdHJpbmcpLmZvcm1hdCA9PT0gJ2hzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1ZTdHJpbmcpLnZhbHVlLmh1ZSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVlN0cmluZykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVlN0cmluZykudmFsdWUudmFsdWUgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzTEFCKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgTEFCIHtcblx0cmV0dXJuIChcblx0XHRjb3JlLmd1YXJkcy5pc0NvbG9yKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIExBQikuZm9ybWF0ID09PSAnbGFiJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIExBQikudmFsdWUubCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIExBQikudmFsdWUuYSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIExBQikudmFsdWUuYiA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNMQUJGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgTEFCIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdsYWInKTtcbn1cblxuZnVuY3Rpb24gaXNSR0IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBSR0Ige1xuXHRyZXR1cm4gKFxuXHRcdGNvcmUuZ3VhcmRzLmlzQ29sb3IodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgUkdCKS5mb3JtYXQgPT09ICdyZ2InICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgUkdCKS52YWx1ZS5yZWQgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBSR0IpLnZhbHVlLmdyZWVuID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgUkdCKS52YWx1ZS5ibHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1JHQkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBSR0Ige1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ3JnYicpO1xufVxuXG5mdW5jdGlvbiBpc1NMQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBTTCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgU0wpLmZvcm1hdCA9PT0gJ3NsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNMKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU0wpLnZhbHVlLmxpZ2h0bmVzcyA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNTTEZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBTTCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnc2wnKTtcbn1cblxuZnVuY3Rpb24gaXNTTFN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFNMU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBTTFN0cmluZykuZm9ybWF0ID09PSAnc2wnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU0xTdHJpbmcpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTTFN0cmluZykudmFsdWUubGlnaHRuZXNzID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1NWQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBTViB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgU1YpLmZvcm1hdCA9PT0gJ3N2JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNWKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU1YpLnZhbHVlLnZhbHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1NWRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIFNWIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdzdicpO1xufVxuXG5mdW5jdGlvbiBpc1NWU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgU1ZTdHJpbmcge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFNWU3RyaW5nKS5mb3JtYXQgPT09ICdzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTVlN0cmluZykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNWU3RyaW5nKS52YWx1ZS52YWx1ZSA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNYWVoodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBYWVoge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFhZWikuZm9ybWF0ID09PSAneHl6JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFhZWikudmFsdWUueCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFhZWikudmFsdWUueSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFhZWikudmFsdWUueiA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNYWVpGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgWFlaIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICd4eXonKTtcbn1cblxuLy8gKioqKiogU0VDVElPTiAzOiBVdGlsaXR5IEd1YXJkcyAqKioqKlxuXG5mdW5jdGlvbiBlbnN1cmVIYXNoKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRyZXR1cm4gdmFsdWUuc3RhcnRzV2l0aCgnIycpID8gdmFsdWUgOiBgIyR7dmFsdWV9YDtcbn1cblxuZnVuY3Rpb24gaXNDb252ZXJ0aWJsZUNvbG9yKFxuXHRjb2xvcjogQ29sb3Jcbik6IGNvbG9yIGlzIENNWUsgfCBIZXggfCBIU0wgfCBIU1YgfCBMQUIgfCBSR0Ige1xuXHRyZXR1cm4gKFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2NteWsnIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnaGV4JyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2hzbCcgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdoc3YnIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnbGFiJyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ3JnYidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNJbnB1dEVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsKTogZWxlbWVudCBpcyBIVE1MRWxlbWVudCB7XG5cdHJldHVybiBlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudDtcbn1cblxuZnVuY3Rpb24gaXNTdG9yZWRQYWxldHRlKG9iajogdW5rbm93bik6IG9iaiBpcyBTdG9yZWRQYWxldHRlIHtcblx0aWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG5cdGNvbnN0IGNhbmRpZGF0ZSA9IG9iaiBhcyBQYXJ0aWFsPFN0b3JlZFBhbGV0dGU+O1xuXG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIGNhbmRpZGF0ZS50YWJsZUlEID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiBjYW5kaWRhdGUucGFsZXR0ZSA9PT0gJ29iamVjdCcgJiZcblx0XHRBcnJheS5pc0FycmF5KGNhbmRpZGF0ZS5wYWxldHRlLml0ZW1zKSAmJlxuXHRcdHR5cGVvZiBjYW5kaWRhdGUucGFsZXR0ZS5pZCA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gbmFycm93VG9Db2xvcihjb2xvcjogQ29sb3IgfCBDb2xvclN0cmluZyk6IENvbG9yIHwgbnVsbCB7XG5cdGlmIChpc0NvbG9yU3RyaW5nKGNvbG9yKSkge1xuXHRcdHJldHVybiBjb3JlLmNvbnZlcnQuY29sb3JTdHJpbmdUb0NvbG9yKGNvbG9yKTtcblx0fVxuXG5cdHN3aXRjaCAoY29sb3IuZm9ybWF0IGFzIENvbG9yU3BhY2VFeHRlbmRlZCkge1xuXHRcdGNhc2UgJ2NteWsnOlxuXHRcdGNhc2UgJ2hleCc6XG5cdFx0Y2FzZSAnaHNsJzpcblx0XHRjYXNlICdoc3YnOlxuXHRcdGNhc2UgJ2xhYic6XG5cdFx0Y2FzZSAnc2wnOlxuXHRcdGNhc2UgJ3N2Jzpcblx0XHRjYXNlICdyZ2InOlxuXHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbi8vICoqKioqKioqIFNFQ1RJT04gNDogVFJBTlNGT1JNIFVUSUxTICoqKioqKioqXG5cbmZ1bmN0aW9uIGNvbG9yVG9Db2xvclN0cmluZyhjb2xvcjogQ29sb3IpOiBDb2xvclN0cmluZyB7XG5cdGNvbnN0IGNsb25lZENvbG9yID0gY29yZS5iYXNlLmNsb25lKGNvbG9yKTtcblxuXHRpZiAoaXNDb2xvclN0cmluZyhjbG9uZWRDb2xvcikpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcnMpIHtcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEFscmVhZHkgZm9ybWF0dGVkIGFzIGNvbG9yIHN0cmluZzogJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY2xvbmVkQ29sb3I7XG5cdH1cblxuXHRpZiAoaXNDTVlLQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKGNsb25lZENvbG9yLnZhbHVlKSBhcyBDTVlLVmFsdWU7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnY215aycsXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRjeWFuOiBgJHtuZXdWYWx1ZS5jeWFufSVgLFxuXHRcdFx0XHRtYWdlbnRhOiBgJHtuZXdWYWx1ZS5tYWdlbnRhfSVgLFxuXHRcdFx0XHR5ZWxsb3c6IGAke25ld1ZhbHVlLnllbGxvd30lYCxcblx0XHRcdFx0a2V5OiBgJHtuZXdWYWx1ZS5rZXl9JWAsXG5cdFx0XHRcdGFscGhhOiBgJHtuZXdWYWx1ZS5hbHBoYX1gXG5cdFx0XHR9IGFzIENNWUtWYWx1ZVN0cmluZ1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNIZXgoY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKGNsb25lZENvbG9yLnZhbHVlKSBhcyBIZXhWYWx1ZTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdoZXgnLFxuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aGV4OiBgJHtuZXdWYWx1ZS5oZXh9YCxcblx0XHRcdFx0YWxwaGE6IGAke25ld1ZhbHVlLmFscGhhfWAsXG5cdFx0XHRcdG51bUFscGhhOiBgJHtuZXdWYWx1ZS5udW1BbHBoYX1gXG5cdFx0XHR9IGFzIEhleFZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc0hTTENvbG9yKGNsb25lZENvbG9yKSkge1xuXHRcdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhjbG9uZWRDb2xvci52YWx1ZSkgYXMgSFNMVmFsdWU7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnaHNsJyxcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogYCR7bmV3VmFsdWUuaHVlfWAsXG5cdFx0XHRcdHNhdHVyYXRpb246IGAke25ld1ZhbHVlLnNhdHVyYXRpb259JWAsXG5cdFx0XHRcdGxpZ2h0bmVzczogYCR7bmV3VmFsdWUubGlnaHRuZXNzfSVgLFxuXHRcdFx0XHRhbHBoYTogYCR7bmV3VmFsdWUuYWxwaGF9YFxuXHRcdFx0fSBhcyBIU0xWYWx1ZVN0cmluZ1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNIU1ZDb2xvcihjbG9uZWRDb2xvcikpIHtcblx0XHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoY2xvbmVkQ29sb3IudmFsdWUpIGFzIEhTVlZhbHVlO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2hzdicsXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6IGAke25ld1ZhbHVlLmh1ZX1gLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBgJHtuZXdWYWx1ZS5zYXR1cmF0aW9ufSVgLFxuXHRcdFx0XHR2YWx1ZTogYCR7bmV3VmFsdWUudmFsdWV9JWAsXG5cdFx0XHRcdGFscGhhOiBgJHtuZXdWYWx1ZS5hbHBoYX1gXG5cdFx0XHR9IGFzIEhTVlZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc0xBQihjbG9uZWRDb2xvcikpIHtcblx0XHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoY2xvbmVkQ29sb3IudmFsdWUpIGFzIExBQlZhbHVlO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2xhYicsXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRsOiBgJHtuZXdWYWx1ZS5sfWAsXG5cdFx0XHRcdGE6IGAke25ld1ZhbHVlLmF9YCxcblx0XHRcdFx0YjogYCR7bmV3VmFsdWUuYn1gLFxuXHRcdFx0XHRhbHBoYTogYCR7bmV3VmFsdWUuYWxwaGF9YFxuXHRcdFx0fSBhcyBMQUJWYWx1ZVN0cmluZ1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNSR0IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKGNsb25lZENvbG9yLnZhbHVlKSBhcyBSR0JWYWx1ZTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdyZ2InLFxuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0cmVkOiBgJHtuZXdWYWx1ZS5yZWR9YCxcblx0XHRcdFx0Z3JlZW46IGAke25ld1ZhbHVlLmdyZWVufWAsXG5cdFx0XHRcdGJsdWU6IGAke25ld1ZhbHVlLmJsdWV9YCxcblx0XHRcdFx0YWxwaGE6IGAke25ld1ZhbHVlLmFscGhhfWBcblx0XHRcdH0gYXMgUkdCVmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzWFlaKGNsb25lZENvbG9yKSkge1xuXHRcdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhjbG9uZWRDb2xvci52YWx1ZSkgYXMgWFlaVmFsdWU7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAneHl6Jyxcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHg6IGAke25ld1ZhbHVlLnh9YCxcblx0XHRcdFx0eTogYCR7bmV3VmFsdWUueX1gLFxuXHRcdFx0XHR6OiBgJHtuZXdWYWx1ZS56fWAsXG5cdFx0XHRcdGFscGhhOiBgJHtuZXdWYWx1ZS5hbHBoYX1gXG5cdFx0XHR9IGFzIFhZWlZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRpZiAoIW1vZGUuZ3JhY2VmdWxFcnJvcnMpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZm9ybWF0OiAke2Nsb25lZENvbG9yLmZvcm1hdH1gKTtcblx0XHR9IGVsc2UgaWYgKGxvZ01vZGUuZXJyb3JzKSB7XG5cdFx0XHRsb2dnZXIuZXJyb3IoYFVuc3VwcG9ydGVkIGZvcm1hdDogJHtjbG9uZWRDb2xvci5mb3JtYXR9YCk7XG5cdFx0fSBlbHNlIGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLndhcm5pbmdzKSB7XG5cdFx0XHRsb2dnZXIud2FybmluZygnRmFpbGVkIHRvIGNvbnZlcnQgdG8gY29sb3Igc3RyaW5nLicpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkYXRhLmRlZmF1bHRzLmNvbG9ycy5zdHJpbmdzLmhzbDtcblx0fVxufVxuXG5mdW5jdGlvbiBmb3JtYXRQZXJjZW50YWdlVmFsdWVzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oXG5cdHZhbHVlOiBUXG4pOiBUIHtcblx0cmV0dXJuIE9iamVjdC5lbnRyaWVzKHZhbHVlKS5yZWR1Y2UoXG5cdFx0KGFjYywgW2tleSwgdmFsXSkgPT4ge1xuXHRcdFx0KGFjYyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilba2V5XSA9IFtcblx0XHRcdFx0J3NhdHVyYXRpb24nLFxuXHRcdFx0XHQnbGlnaHRuZXNzJyxcblx0XHRcdFx0J3ZhbHVlJyxcblx0XHRcdFx0J2N5YW4nLFxuXHRcdFx0XHQnbWFnZW50YScsXG5cdFx0XHRcdCd5ZWxsb3cnLFxuXHRcdFx0XHQna2V5J1xuXHRcdFx0XS5pbmNsdWRlcyhrZXkpXG5cdFx0XHRcdD8gYCR7dmFsfSVgXG5cdFx0XHRcdDogdmFsO1xuXHRcdFx0cmV0dXJuIGFjYztcblx0XHR9LFxuXHRcdHt9IGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+XG5cdCkgYXMgVDtcbn1cblxuZnVuY3Rpb24gZ2V0QWxwaGFGcm9tSGV4KGhleDogc3RyaW5nKTogbnVtYmVyIHtcblx0aWYgKGhleC5sZW5ndGggIT09IDkgfHwgIWhleC5zdGFydHNXaXRoKCcjJykpIHtcblx0XHRpZiAoIW1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdGBJbnZhbGlkIGhleCBjb2xvcjogJHtoZXh9LiBFeHBlY3RlZCBmb3JtYXQgI1JSR0dCQkFBYFxuXHRcdFx0KTtcblx0XHRlbHNlIGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEludmFsaWQgaGV4IGNvbG9yOiAke2hleH0uIEV4cGVjdGVkIGZvcm1hdCAjUlJHR0JCQUFgXG5cdFx0XHQpO1xuXHRcdGVsc2UgaWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUud2FybmluZ3MpXG5cdFx0XHRsb2dnZXIud2FybmluZygnRmFpbGVkIHRvIHBhcnNlIGFscGhhIGZyb20gaGV4IGNvbG9yLicpO1xuXHR9XG5cblx0Y29uc3QgYWxwaGFIZXggPSBoZXguc2xpY2UoLTIpO1xuXHRjb25zdCBhbHBoYURlY2ltYWwgPSBwYXJzZUludChhbHBoYUhleCwgMTYpO1xuXG5cdHJldHVybiBhbHBoYURlY2ltYWwgLyAyNTU7XG59XG5cbmZ1bmN0aW9uIGdldENvbG9yU3RyaW5nKGNvbG9yOiBDb2xvcik6IHN0cmluZyB8IG51bGwge1xuXHR0cnkge1xuXHRcdGNvbnN0IGZvcm1hdHRlcnMgPSB7XG5cdFx0XHRjbXlrOiAoYzogQ01ZSykgPT5cblx0XHRcdFx0YGNteWsoJHtjLnZhbHVlLmN5YW59LCAke2MudmFsdWUubWFnZW50YX0sICR7Yy52YWx1ZS55ZWxsb3d9LCAke2MudmFsdWUua2V5fSwgJHtjLnZhbHVlLmFscGhhfSlgLFxuXHRcdFx0aGV4OiAoYzogSGV4KSA9PiBjLnZhbHVlLmhleCxcblx0XHRcdGhzbDogKGM6IEhTTCkgPT5cblx0XHRcdFx0YGhzbCgke2MudmFsdWUuaHVlfSwgJHtjLnZhbHVlLnNhdHVyYXRpb259JSwgJHtjLnZhbHVlLmxpZ2h0bmVzc30lLCR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdGhzdjogKGM6IEhTVikgPT5cblx0XHRcdFx0YGhzdigke2MudmFsdWUuaHVlfSwgJHtjLnZhbHVlLnNhdHVyYXRpb259JSwgJHtjLnZhbHVlLnZhbHVlfSUsJHtjLnZhbHVlLmFscGhhfSlgLFxuXHRcdFx0bGFiOiAoYzogTEFCKSA9PlxuXHRcdFx0XHRgbGFiKCR7Yy52YWx1ZS5sfSwgJHtjLnZhbHVlLmF9LCAke2MudmFsdWUuYn0sJHtjLnZhbHVlLmFscGhhfSlgLFxuXHRcdFx0cmdiOiAoYzogUkdCKSA9PlxuXHRcdFx0XHRgcmdiKCR7Yy52YWx1ZS5yZWR9LCAke2MudmFsdWUuZ3JlZW59LCAke2MudmFsdWUuYmx1ZX0sJHtjLnZhbHVlLmFscGhhfSlgLFxuXHRcdFx0eHl6OiAoYzogWFlaKSA9PlxuXHRcdFx0XHRgeHl6KCR7Yy52YWx1ZS54fSwgJHtjLnZhbHVlLnl9LCAke2MudmFsdWUuen0sJHtjLnZhbHVlLmFscGhhfSlgXG5cdFx0fTtcblxuXHRcdHN3aXRjaCAoY29sb3IuZm9ybWF0KSB7XG5cdFx0XHRjYXNlICdjbXlrJzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMuY215ayhjb2xvcik7XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5oZXgoY29sb3IpO1xuXHRcdFx0Y2FzZSAnaHNsJzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMuaHNsKGNvbG9yKTtcblx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmhzdihjb2xvcik7XG5cdFx0XHRjYXNlICdsYWInOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5sYWIoY29sb3IpO1xuXHRcdFx0Y2FzZSAncmdiJzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMucmdiKGNvbG9yKTtcblx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLnh5eihjb2xvcik7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRpZiAoIWxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0IGZvciAke2NvbG9yfWApO1xuXG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIWxvZ01vZGUuZXJyb3JzKSBsb2dnZXIuZXJyb3IoYGdldENvbG9yU3RyaW5nIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4QWxwaGFUb051bWVyaWNBbHBoYShoZXhBbHBoYTogc3RyaW5nKTogbnVtYmVyIHtcblx0cmV0dXJuIHBhcnNlSW50KGhleEFscGhhLCAxNikgLyAyNTU7XG59XG5cbmNvbnN0IHBhcnNlQ29sb3IgPSAoY29sb3JTcGFjZTogQ29sb3JTcGFjZSwgdmFsdWU6IHN0cmluZyk6IENvbG9yIHwgbnVsbCA9PiB7XG5cdHRyeSB7XG5cdFx0c3dpdGNoIChjb2xvclNwYWNlKSB7XG5cdFx0XHRjYXNlICdjbXlrJzoge1xuXHRcdFx0XHRjb25zdCBbYywgbSwgeSwgaywgYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDUpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGN5YW46IGNvcmUuYnJhbmQuYXNQZXJjZW50aWxlKGMpLFxuXHRcdFx0XHRcdFx0bWFnZW50YTogY29yZS5icmFuZC5hc1BlcmNlbnRpbGUobSksXG5cdFx0XHRcdFx0XHR5ZWxsb3c6IGNvcmUuYnJhbmQuYXNQZXJjZW50aWxlKHkpLFxuXHRcdFx0XHRcdFx0a2V5OiBjb3JlLmJyYW5kLmFzUGVyY2VudGlsZShrKSxcblx0XHRcdFx0XHRcdGFscGhhOiBjb3JlLmJyYW5kLmFzQWxwaGFSYW5nZShhKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdGNvbnN0IGhleFZhbHVlID0gdmFsdWUuc3RhcnRzV2l0aCgnIycpID8gdmFsdWUgOiBgIyR7dmFsdWV9YDtcblx0XHRcdFx0Y29uc3QgYWxwaGEgPSBoZXhWYWx1ZS5sZW5ndGggPT09IDkgPyBoZXhWYWx1ZS5zbGljZSgtMikgOiAnRkYnO1xuXHRcdFx0XHRjb25zdCBudW1BbHBoYSA9IGhleEFscGhhVG9OdW1lcmljQWxwaGEoYWxwaGEpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGhleDogY29yZS5icmFuZC5hc0hleFNldChoZXhWYWx1ZSksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZS5icmFuZC5hc0hleENvbXBvbmVudChhbHBoYSksXG5cdFx0XHRcdFx0XHRudW1BbHBoYTogY29yZS5icmFuZC5hc0FscGhhUmFuZ2UobnVtQWxwaGEpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdH07XG5cdFx0XHRjYXNlICdoc2wnOiB7XG5cdFx0XHRcdGNvbnN0IFtoLCBzLCBsLCBhXSA9IHBhcnNlQ29tcG9uZW50cyh2YWx1ZSwgNCk7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aHVlOiBjb3JlLmJyYW5kLmFzUmFkaWFsKGgpLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogY29yZS5icmFuZC5hc1BlcmNlbnRpbGUocyksXG5cdFx0XHRcdFx0XHRsaWdodG5lc3M6IGNvcmUuYnJhbmQuYXNQZXJjZW50aWxlKGwpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGNvcmUuYnJhbmQuYXNBbHBoYVJhbmdlKGEpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdoc3YnOiB7XG5cdFx0XHRcdGNvbnN0IFtoLCBzLCB2LCBhXSA9IHBhcnNlQ29tcG9uZW50cyh2YWx1ZSwgNCk7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aHVlOiBjb3JlLmJyYW5kLmFzUmFkaWFsKGgpLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogY29yZS5icmFuZC5hc1BlcmNlbnRpbGUocyksXG5cdFx0XHRcdFx0XHR2YWx1ZTogY29yZS5icmFuZC5hc1BlcmNlbnRpbGUodiksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZS5icmFuZC5hc0FscGhhUmFuZ2UoYSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGNhc2UgJ2xhYic6IHtcblx0XHRcdFx0Y29uc3QgW2wsIGEsIGIsIGFscGhhXSA9IHBhcnNlQ29tcG9uZW50cyh2YWx1ZSwgNCk7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGw6IGNvcmUuYnJhbmQuYXNMQUJfTChsKSxcblx0XHRcdFx0XHRcdGE6IGNvcmUuYnJhbmQuYXNMQUJfQShhKSxcblx0XHRcdFx0XHRcdGI6IGNvcmUuYnJhbmQuYXNMQUJfQihiKSxcblx0XHRcdFx0XHRcdGFscGhhOiBjb3JlLmJyYW5kLmFzQWxwaGFSYW5nZShhbHBoYSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGNhc2UgJ3JnYic6IHtcblx0XHRcdFx0Y29uc3QgY29tcG9uZW50cyA9IHZhbHVlLnNwbGl0KCcsJykubWFwKE51bWJlcik7XG5cblx0XHRcdFx0aWYgKGNvbXBvbmVudHMuc29tZShpc05hTikpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFJHQiBmb3JtYXQnKTtcblxuXHRcdFx0XHRjb25zdCBbciwgZywgYiwgYV0gPSBjb21wb25lbnRzO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdHJlZDogY29yZS5icmFuZC5hc0J5dGVSYW5nZShyKSxcblx0XHRcdFx0XHRcdGdyZWVuOiBjb3JlLmJyYW5kLmFzQnl0ZVJhbmdlKGcpLFxuXHRcdFx0XHRcdFx0Ymx1ZTogY29yZS5icmFuZC5hc0J5dGVSYW5nZShiKSxcblx0XHRcdFx0XHRcdGFscGhhOiBjb3JlLmJyYW5kLmFzQWxwaGFSYW5nZShhKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Y29uc3QgbWVzc2FnZSA9IGBVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQ6ICR7Y29sb3JTcGFjZX1gO1xuXG5cdFx0XHRcdGlmIChtb2RlLmdyYWNlZnVsRXJyb3JzKSB7XG5cdFx0XHRcdFx0aWYgKGxvZ01vZGUuZXJyb3JzKSBsb2dnZXIuZXJyb3IobWVzc2FnZSk7XG5cdFx0XHRcdFx0ZWxzZSBpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS53YXJuaW5ncylcblx0XHRcdFx0XHRcdGxvZ2dlci53YXJuaW5nKGBGYWlsZWQgdG8gcGFyc2UgY29sb3I6ICR7bWVzc2FnZX1gKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3JzKSBsb2dnZXIuZXJyb3IoYHBhcnNlQ29sb3IgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufTtcblxuZnVuY3Rpb24gcGFyc2VDb21wb25lbnRzKHZhbHVlOiBzdHJpbmcsIGNvdW50OiBudW1iZXIpOiBudW1iZXJbXSB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29tcG9uZW50cyA9IHZhbHVlXG5cdFx0XHQuc3BsaXQoJywnKVxuXHRcdFx0Lm1hcCh2YWwgPT5cblx0XHRcdFx0dmFsLnRyaW0oKS5lbmRzV2l0aCgnJScpXG5cdFx0XHRcdFx0PyBwYXJzZUZsb2F0KHZhbClcblx0XHRcdFx0XHQ6IHBhcnNlRmxvYXQodmFsKSAqIDEwMFxuXHRcdFx0KTtcblxuXHRcdGlmIChjb21wb25lbnRzLmxlbmd0aCAhPT0gY291bnQpXG5cdFx0XHRpZiAoIW1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgJHtjb3VudH0gY29tcG9uZW50cy5gKTtcblx0XHRcdGVsc2UgaWYgKGxvZ01vZGUuZXJyb3JzKSB7XG5cdFx0XHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLndhcm5pbmdzKVxuXHRcdFx0XHRcdGxvZ2dlci53YXJuaW5nKGBFeHBlY3RlZCAke2NvdW50fSBjb21wb25lbnRzLmApO1xuXG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblxuXHRcdHJldHVybiBjb21wb25lbnRzO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9ycykgbG9nZ2VyLmVycm9yKGBFcnJvciBwYXJzaW5nIGNvbXBvbmVudHM6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gW107XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VIZXhXaXRoQWxwaGEoaGV4VmFsdWU6IHN0cmluZyk6IEhleFZhbHVlIHwgbnVsbCB7XG5cdGNvbnN0IGhleCA9IGhleFZhbHVlLnN0YXJ0c1dpdGgoJyMnKSA/IGhleFZhbHVlIDogYCMke2hleFZhbHVlfWA7XG5cdGNvbnN0IGFscGhhID0gaGV4Lmxlbmd0aCA9PT0gOSA/IGhleC5zbGljZSgtMikgOiAnRkYnO1xuXHRjb25zdCBudW1BbHBoYSA9IGhleEFscGhhVG9OdW1lcmljQWxwaGEoYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0aGV4OiBjb3JlLmJyYW5kLmFzSGV4U2V0KGhleCksXG5cdFx0YWxwaGE6IGNvcmUuYnJhbmQuYXNIZXhDb21wb25lbnQoYWxwaGEpLFxuXHRcdG51bUFscGhhOiBjb3JlLmJyYW5kLmFzQWxwaGFSYW5nZShudW1BbHBoYSlcblx0fTtcbn1cblxuZnVuY3Rpb24gc3RyaXBIYXNoRnJvbUhleChoZXg6IEhleCk6IEhleCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgaGV4U3RyaW5nID0gYCR7aGV4LnZhbHVlLmhleH0ke2hleC52YWx1ZS5hbHBoYX1gO1xuXG5cdFx0cmV0dXJuIGhleC52YWx1ZS5oZXguc3RhcnRzV2l0aCgnIycpXG5cdFx0XHQ/IHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aGV4OiBjb3JlLmJyYW5kLmFzSGV4U2V0KGhleFN0cmluZy5zbGljZSgxKSksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZS5icmFuZC5hc0hleENvbXBvbmVudChcblx0XHRcdFx0XHRcdFx0U3RyaW5nKGhleC52YWx1ZS5hbHBoYSlcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRudW1BbHBoYTogY29yZS5icmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdGhleEFscGhhVG9OdW1lcmljQWxwaGEoU3RyaW5nKGhleC52YWx1ZS5hbHBoYSkpXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnIGFzICdoZXgnXG5cdFx0XHRcdH1cblx0XHRcdDogaGV4O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9ycykgbG9nZ2VyLmVycm9yKGBzdHJpcEhhc2hGcm9tSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0Y29uc3QgdW5icmFuZGVkSGV4ID0gY29yZS5iYXNlLmNsb25lKFxuXHRcdFx0ZGF0YS5kZWZhdWx0cy5jb2xvcnMuYmFzZS51bmJyYW5kZWQuaGV4XG5cdFx0KTtcblxuXHRcdHJldHVybiBjb3JlLmJyYW5kQ29sb3IuYXNIZXgodW5icmFuZGVkSGV4KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzdHJpcFBlcmNlbnRGcm9tVmFsdWVzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBudW1iZXIgfCBzdHJpbmc+Pihcblx0dmFsdWU6IFRcbik6IHsgW0sgaW4ga2V5b2YgVF06IFRbS10gZXh0ZW5kcyBgJHtudW1iZXJ9JWAgPyBudW1iZXIgOiBUW0tdIH0ge1xuXHRyZXR1cm4gT2JqZWN0LmVudHJpZXModmFsdWUpLnJlZHVjZShcblx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHRjb25zdCBwYXJzZWRWYWx1ZSA9XG5cdFx0XHRcdHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIHZhbC5lbmRzV2l0aCgnJScpXG5cdFx0XHRcdFx0PyBwYXJzZUZsb2F0KHZhbC5zbGljZSgwLCAtMSkpXG5cdFx0XHRcdFx0OiB2YWw7XG5cdFx0XHRhY2Nba2V5IGFzIGtleW9mIFRdID0gcGFyc2VkVmFsdWUgYXMgVFtrZXlvZiBUXSBleHRlbmRzIGAke251bWJlcn0lYFxuXHRcdFx0XHQ/IG51bWJlclxuXHRcdFx0XHQ6IFRba2V5b2YgVF07XG5cdFx0XHRyZXR1cm4gYWNjO1xuXHRcdH0sXG5cdFx0e30gYXMgeyBbSyBpbiBrZXlvZiBUXTogVFtLXSBleHRlbmRzIGAke251bWJlcn0lYCA/IG51bWJlciA6IFRbS10gfVxuXHQpO1xufVxuXG5mdW5jdGlvbiB0b0hleFdpdGhBbHBoYShyZ2JWYWx1ZTogUkdCVmFsdWUpOiBzdHJpbmcge1xuXHRjb25zdCB7IHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhIH0gPSByZ2JWYWx1ZTtcblxuXHRjb25zdCBoZXggPSBgIyR7KCgxIDw8IDI0KSArIChyZWQgPDwgMTYpICsgKGdyZWVuIDw8IDgpICsgYmx1ZSlcblx0XHQudG9TdHJpbmcoMTYpXG5cdFx0LnNsaWNlKDEpfWA7XG5cdGNvbnN0IGFscGhhSGV4ID0gTWF0aC5yb3VuZChhbHBoYSAqIDI1NSlcblx0XHQudG9TdHJpbmcoMTYpXG5cdFx0LnBhZFN0YXJ0KDIsICcwJyk7XG5cblx0cmV0dXJuIGAke2hleH0ke2FscGhhSGV4fWA7XG59XG5cbmV4cG9ydCBjb25zdCBjb2xvcjogQ29tbW9uVXRpbHNGbkNvbG9yID0ge1xuXHRjb2xvclRvQ29sb3JTdHJpbmcsXG5cdGVuc3VyZUhhc2gsXG5cdGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMsXG5cdGdldEFscGhhRnJvbUhleCxcblx0Z2V0Q29sb3JTdHJpbmcsXG5cdGhleEFscGhhVG9OdW1lcmljQWxwaGEsXG5cdGlzQ01ZS0NvbG9yLFxuXHRpc0NNWUtGb3JtYXQsXG5cdGlzQ01ZS1N0cmluZyxcblx0aXNDb2xvckZvcm1hdCxcblx0aXNDb2xvclN0cmluZyxcblx0aXNDb2xvclNwYWNlLFxuXHRpc0NvbG9yU3BhY2VFeHRlbmRlZCxcblx0aXNDb252ZXJ0aWJsZUNvbG9yLFxuXHRpc0Zvcm1hdCxcblx0aXNIZXgsXG5cdGlzSGV4Rm9ybWF0LFxuXHRpc0hTTENvbG9yLFxuXHRpc0hTTEZvcm1hdCxcblx0aXNIU0xTdHJpbmcsXG5cdGlzSW5wdXRFbGVtZW50LFxuXHRpc0hTVkNvbG9yLFxuXHRpc0hTVkZvcm1hdCxcblx0aXNIU1ZTdHJpbmcsXG5cdGlzTEFCLFxuXHRpc0xBQkZvcm1hdCxcblx0aXNSR0IsXG5cdGlzUkdCRm9ybWF0LFxuXHRpc1NMQ29sb3IsXG5cdGlzU0xGb3JtYXQsXG5cdGlzU0xTdHJpbmcsXG5cdGlzU3RvcmVkUGFsZXR0ZSxcblx0aXNTVkNvbG9yLFxuXHRpc1NWRm9ybWF0LFxuXHRpc1NWU3RyaW5nLFxuXHRpc1hZWixcblx0aXNYWVpGb3JtYXQsXG5cdG5hcnJvd1RvQ29sb3IsXG5cdHBhcnNlQ29sb3IsXG5cdHBhcnNlQ29tcG9uZW50cyxcblx0cGFyc2VIZXhXaXRoQWxwaGEsXG5cdHN0cmlwSGFzaEZyb21IZXgsXG5cdHN0cmlwUGVyY2VudEZyb21WYWx1ZXMsXG5cdHRvSGV4V2l0aEFscGhhXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgeyBoZXhBbHBoYVRvTnVtZXJpY0FscGhhLCBzdHJpcEhhc2hGcm9tSGV4IH07XG4iXX0=