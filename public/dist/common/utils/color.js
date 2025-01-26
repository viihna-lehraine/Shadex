// File: src/common/utils/color.js
import { core } from '../core/index.js';
import { createLogger } from '../../logger/index.js';
import { defaults, mode } from '../data/base.js';
const logger = await createLogger();
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
async function narrowToColor(color) {
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
        if (logMode.error) {
            logger.error(`Already formatted as color string: ${JSON.stringify(color)}`, 'common > utils > color > isColorString()');
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
        else if (logMode.error) {
            logger.error(`Unsupported format: ${clonedColor.format}`, 'common > utils > color > colorToColorString()');
        }
        else if (!mode.quiet && logMode.warn) {
            logger.warn('Failed to convert to color string.', 'common > utils > color > colorToColorString()');
        }
        return defaults.colors.strings.hsl;
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
        else if (logMode.error)
            logger.error(`Invalid hex color: ${hex}. Expected format #RRGGBBAA`, 'common > utils > color > getAlphaFromHex()');
        else if (!mode.quiet && logMode.warn)
            logger.warn('Failed to parse alpha from hex color.', 'common > utils > color > getAlphaFromHex()');
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
                if (!logMode.error)
                    logger.error(`Unsupported color format for ${color}`, 'common > utils > color > getColorString()');
                return null;
        }
    }
    catch (error) {
        if (!logMode.error)
            logger.error(`getColorString error: ${error}`, 'common > utils > color > getColorString()');
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
                    if (logMode.error)
                        logger.error(message);
                    else if (!mode.quiet && logMode.warn)
                        logger.warn(`Failed to parse color: ${message}`, 'common > utils > color > parseColor()');
                }
                else {
                    throw new Error(message);
                }
                return null;
        }
    }
    catch (error) {
        if (logMode.error)
            logger.error(`parseColor error: ${error}`, 'common > utils > color > parseColor()');
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
            else if (logMode.error) {
                if (!mode.quiet && logMode.warn)
                    logger.warn(`Expected ${count} components.`, 'common > utils > color > parseComponents()');
                return [];
            }
        return components;
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Error parsing components: ${error}`, 'common > utils > color > parseComponents()');
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
        if (logMode.error)
            logger.error(`stripHashFromHex error: ${error}`, 'common > utils > color > stripHashFromHex()');
        const unbrandedHex = core.base.clone(defaults.colors.base.unbranded.hex);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL3V0aWxzL2NvbG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGtDQUFrQztBQXdDbEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRWpELE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxFQUFFLENBQUM7QUFFcEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUU3QixrREFBa0Q7QUFFbEQsU0FBUyxhQUFhLENBQ3JCLEtBQVksRUFDWixNQUFtQjtJQUVuQixPQUFPLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDO0FBQ2hDLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxLQUFhO0lBQ2xDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQUMsS0FBYTtJQUMxQyxPQUFPO1FBQ04sTUFBTTtRQUNOLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsSUFBSTtRQUNKLElBQUk7UUFDSixLQUFLO0tBQ0wsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUFDLEtBQWM7SUFDcEMsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ2pELE1BQU0sV0FBVyxHQUFHLEtBQXdDLENB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LEtBQUs7SUFDTCxXQUFXO0lBQ1gsVUFBVTtJQUNWLFdBQVc7SUFDWCxXQUFXO0lBQ1gsY0FBYztJQUNkLFVBQVU7SUFDVixXQUFXO0lBQ1gsV0FBVztJQUNYLEtBQUs7SUFDTCxXQUFXO0lBQ1gsS0FBSztJQUNMLFdBQVc7SUFDWCxTQUFTO0lBQ1QsVUFBVTtJQUNWLFVBQVU7SUFDVixlQUFlO0lBQ2YsU0FBUztJQUNULFVBQVU7SUFDVixVQUFVO0lBQ1YsS0FBSztJQUNMLFdBQVc7SUFDWCxhQUFhO0lBQ2IsVUFBVTtJQUNWLGVBQWU7SUFDZixpQkFBaUI7SUFDakIsZ0JBQWdCO0lBQ2hCLHNCQUFzQjtJQUN0QixjQUFjO0NBQ0wsQ0FBQztBQUVYLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2NvbW1vbi91dGlscy9jb2xvci5qc1xuXG5pbXBvcnQge1xuXHRDTVlLLFxuXHRDTVlLU3RyaW5nLFxuXHRDTVlLVmFsdWUsXG5cdENNWUtWYWx1ZVN0cmluZyxcblx0Q29sb3IsXG5cdENvbG9yU3BhY2UsXG5cdENvbG9yU3BhY2VFeHRlbmRlZCxcblx0Q29sb3JTdHJpbmcsXG5cdENvbW1vbkZ1bmN0aW9uc01hc3RlckludGVyZmFjZSxcblx0Rm9ybWF0LFxuXHRIZXgsXG5cdEhleFN0cmluZyxcblx0SGV4VmFsdWUsXG5cdEhleFZhbHVlU3RyaW5nLFxuXHRIU0wsXG5cdEhTTFN0cmluZyxcblx0SFNMVmFsdWUsXG5cdEhTTFZhbHVlU3RyaW5nLFxuXHRIU1YsXG5cdEhTVlN0cmluZyxcblx0SFNWVmFsdWUsXG5cdEhTVlZhbHVlU3RyaW5nLFxuXHRMQUIsXG5cdExBQlZhbHVlLFxuXHRMQUJWYWx1ZVN0cmluZyxcblx0UkdCLFxuXHRSR0JWYWx1ZSxcblx0UkdCVmFsdWVTdHJpbmcsXG5cdFNMLFxuXHRTTFN0cmluZyxcblx0U3RvcmVkUGFsZXR0ZSxcblx0U1YsXG5cdFNWU3RyaW5nLFxuXHRYWVosXG5cdFhZWlZhbHVlLFxuXHRYWVpWYWx1ZVN0cmluZ1xufSBmcm9tICcuLi8uLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb3JlIH0gZnJvbSAnLi4vY29yZS9pbmRleC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuLi8uLi9sb2dnZXIvaW5kZXguanMnO1xuaW1wb3J0IHsgZGVmYXVsdHMsIG1vZGUgfSBmcm9tICcuLi9kYXRhL2Jhc2UuanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcblxuLy8gKioqKioqKiogU0VDVElPTiAxOiBSb2J1c3QgVHlwZSBHdWFyZHMgKioqKioqKipcblxuZnVuY3Rpb24gaXNDb2xvckZvcm1hdDxUIGV4dGVuZHMgQ29sb3I+KFxuXHRjb2xvcjogQ29sb3IsXG5cdGZvcm1hdDogVFsnZm9ybWF0J11cbik6IGNvbG9yIGlzIFQge1xuXHRyZXR1cm4gY29sb3IuZm9ybWF0ID09PSBmb3JtYXQ7XG59XG5cbmZ1bmN0aW9uIGlzQ29sb3JTcGFjZSh2YWx1ZTogc3RyaW5nKTogdmFsdWUgaXMgQ29sb3JTcGFjZSB7XG5cdHJldHVybiBbJ2NteWsnLCAnaGV4JywgJ2hzbCcsICdoc3YnLCAnbGFiJywgJ3JnYicsICd4eXonXS5pbmNsdWRlcyh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGlzQ29sb3JTcGFjZUV4dGVuZGVkKHZhbHVlOiBzdHJpbmcpOiB2YWx1ZSBpcyBDb2xvclNwYWNlRXh0ZW5kZWQge1xuXHRyZXR1cm4gW1xuXHRcdCdjbXlrJyxcblx0XHQnaGV4Jyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnbGFiJyxcblx0XHQncmdiJyxcblx0XHQnc2wnLFxuXHRcdCdzdicsXG5cdFx0J3h5eidcblx0XS5pbmNsdWRlcyh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGlzQ29sb3JTdHJpbmcodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDb2xvclN0cmluZyB7XG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsKSB7XG5cdFx0Y29uc3QgY29sb3JTdHJpbmcgPSB2YWx1ZSBhcyBFeGNsdWRlPENvbG9yU3RyaW5nLCBIZXhTdHJpbmc+O1xuXHRcdGNvbnN0IHZhbGlkU3RyaW5nRm9ybWF0czogRXhjbHVkZTxDb2xvclN0cmluZywgSGV4U3RyaW5nPlsnZm9ybWF0J11bXSA9XG5cdFx0XHRbJ2NteWsnLCAnaHNsJywgJ2hzdicsICdsYWInLCAncmdiJywgJ3NsJywgJ3N2JywgJ3h5eiddO1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdCd2YWx1ZScgaW4gY29sb3JTdHJpbmcgJiZcblx0XHRcdCdmb3JtYXQnIGluIGNvbG9yU3RyaW5nICYmXG5cdFx0XHR2YWxpZFN0cmluZ0Zvcm1hdHMuaW5jbHVkZXMoY29sb3JTdHJpbmcuZm9ybWF0KVxuXHRcdCk7XG5cdH1cblxuXHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiAvXiNbMC05QS1GYS1mXXs2LDh9JC8udGVzdCh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGlzRm9ybWF0KGZvcm1hdDogdW5rbm93bik6IGZvcm1hdCBpcyBGb3JtYXQge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiBmb3JtYXQgPT09ICdzdHJpbmcnICYmXG5cdFx0WydjbXlrJywgJ2hleCcsICdoc2wnLCAnaHN2JywgJ2xhYicsICdyZ2InLCAnc2wnLCAnc3YnLCAneHl6J10uaW5jbHVkZXMoXG5cdFx0XHRmb3JtYXRcblx0XHQpXG5cdCk7XG59XG5cbi8vICoqKioqKioqIFNFQ1RJT04gMjogTmFycm93IFR5cGUgR3VhcmRzICoqKioqKioqXG5cbmZ1bmN0aW9uIGlzQ01ZS0NvbG9yKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ01ZSyB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgQ01ZSykuZm9ybWF0ID09PSAnY215aycgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLKS52YWx1ZS5jeWFuID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZSykudmFsdWUubWFnZW50YSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUspLnZhbHVlLnllbGxvdyA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUspLnZhbHVlLmtleSA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNDTVlLRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIENNWUsge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2NteWsnKTtcbn1cblxuZnVuY3Rpb24gaXNDTVlLU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ01ZS1N0cmluZyB7XG5cdHJldHVybiAoXG5cdFx0aXNDb2xvclN0cmluZyh2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBDTVlLU3RyaW5nKS5mb3JtYXQgPT09ICdjbXlrJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUtTdHJpbmcpLnZhbHVlLmN5YW4gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLU3RyaW5nKS52YWx1ZS5tYWdlbnRhID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZS1N0cmluZykudmFsdWUueWVsbG93ID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZS1N0cmluZykudmFsdWUua2V5ID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hleCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhleCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgSGV4KS5mb3JtYXQgPT09ICdoZXgnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSGV4KS52YWx1ZS5oZXggPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSGV4Rm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIEhleCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnaGV4Jyk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIU0wge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIEhTTCkuZm9ybWF0ID09PSAnaHNsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTCkudmFsdWUuaHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMKS52YWx1ZS5saWdodG5lc3MgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIEhTTCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnaHNsJyk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgSFNMU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHRpc0NvbG9yU3RyaW5nKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIEhTTFN0cmluZykuZm9ybWF0ID09PSAnaHNsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTFN0cmluZykudmFsdWUuaHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMU3RyaW5nKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMU3RyaW5nKS52YWx1ZS5saWdodG5lc3MgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNWQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIU1Yge1xuXHRyZXR1cm4gKFxuXHRcdGNvcmUuZ3VhcmRzLmlzQ29sb3IodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgSFNWKS5mb3JtYXQgPT09ICdoc3YnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNWKS52YWx1ZS5odWUgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1YpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1YpLnZhbHVlLnZhbHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hTVkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBIU1Yge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2hzdicpO1xufVxuXG5mdW5jdGlvbiBpc0hTVlN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhTVlN0cmluZyB7XG5cdHJldHVybiAoXG5cdFx0aXNDb2xvclN0cmluZyh2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBIU1ZTdHJpbmcpLmZvcm1hdCA9PT0gJ2hzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1ZTdHJpbmcpLnZhbHVlLmh1ZSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVlN0cmluZykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVlN0cmluZykudmFsdWUudmFsdWUgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzTEFCKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgTEFCIHtcblx0cmV0dXJuIChcblx0XHRjb3JlLmd1YXJkcy5pc0NvbG9yKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIExBQikuZm9ybWF0ID09PSAnbGFiJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIExBQikudmFsdWUubCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIExBQikudmFsdWUuYSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIExBQikudmFsdWUuYiA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNMQUJGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgTEFCIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdsYWInKTtcbn1cblxuZnVuY3Rpb24gaXNSR0IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBSR0Ige1xuXHRyZXR1cm4gKFxuXHRcdGNvcmUuZ3VhcmRzLmlzQ29sb3IodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgUkdCKS5mb3JtYXQgPT09ICdyZ2InICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgUkdCKS52YWx1ZS5yZWQgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBSR0IpLnZhbHVlLmdyZWVuID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgUkdCKS52YWx1ZS5ibHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1JHQkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBSR0Ige1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ3JnYicpO1xufVxuXG5mdW5jdGlvbiBpc1NMQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBTTCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgU0wpLmZvcm1hdCA9PT0gJ3NsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNMKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU0wpLnZhbHVlLmxpZ2h0bmVzcyA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNTTEZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBTTCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnc2wnKTtcbn1cblxuZnVuY3Rpb24gaXNTTFN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFNMU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBTTFN0cmluZykuZm9ybWF0ID09PSAnc2wnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU0xTdHJpbmcpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTTFN0cmluZykudmFsdWUubGlnaHRuZXNzID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1NWQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBTViB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgU1YpLmZvcm1hdCA9PT0gJ3N2JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNWKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU1YpLnZhbHVlLnZhbHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1NWRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIFNWIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdzdicpO1xufVxuXG5mdW5jdGlvbiBpc1NWU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgU1ZTdHJpbmcge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFNWU3RyaW5nKS5mb3JtYXQgPT09ICdzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTVlN0cmluZykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNWU3RyaW5nKS52YWx1ZS52YWx1ZSA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNYWVoodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBYWVoge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFhZWikuZm9ybWF0ID09PSAneHl6JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFhZWikudmFsdWUueCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFhZWikudmFsdWUueSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFhZWikudmFsdWUueiA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNYWVpGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgWFlaIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICd4eXonKTtcbn1cblxuLy8gKioqKiogU0VDVElPTiAzOiBVdGlsaXR5IEd1YXJkcyAqKioqKlxuXG5mdW5jdGlvbiBlbnN1cmVIYXNoKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRyZXR1cm4gdmFsdWUuc3RhcnRzV2l0aCgnIycpID8gdmFsdWUgOiBgIyR7dmFsdWV9YDtcbn1cblxuZnVuY3Rpb24gaXNDb252ZXJ0aWJsZUNvbG9yKFxuXHRjb2xvcjogQ29sb3Jcbik6IGNvbG9yIGlzIENNWUsgfCBIZXggfCBIU0wgfCBIU1YgfCBMQUIgfCBSR0Ige1xuXHRyZXR1cm4gKFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2NteWsnIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnaGV4JyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2hzbCcgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdoc3YnIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnbGFiJyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ3JnYidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNJbnB1dEVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsKTogZWxlbWVudCBpcyBIVE1MRWxlbWVudCB7XG5cdHJldHVybiBlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudDtcbn1cblxuZnVuY3Rpb24gaXNTdG9yZWRQYWxldHRlKG9iajogdW5rbm93bik6IG9iaiBpcyBTdG9yZWRQYWxldHRlIHtcblx0aWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG5cdGNvbnN0IGNhbmRpZGF0ZSA9IG9iaiBhcyBQYXJ0aWFsPFN0b3JlZFBhbGV0dGU+O1xuXG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIGNhbmRpZGF0ZS50YWJsZUlEID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiBjYW5kaWRhdGUucGFsZXR0ZSA9PT0gJ29iamVjdCcgJiZcblx0XHRBcnJheS5pc0FycmF5KGNhbmRpZGF0ZS5wYWxldHRlLml0ZW1zKSAmJlxuXHRcdHR5cGVvZiBjYW5kaWRhdGUucGFsZXR0ZS5pZCA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbmFycm93VG9Db2xvcihcblx0Y29sb3I6IENvbG9yIHwgQ29sb3JTdHJpbmdcbik6IFByb21pc2U8Q29sb3IgfCBudWxsPiB7XG5cdGlmIChpc0NvbG9yU3RyaW5nKGNvbG9yKSkge1xuXHRcdHJldHVybiBjb3JlLmNvbnZlcnQuY29sb3JTdHJpbmdUb0NvbG9yKGNvbG9yKTtcblx0fVxuXG5cdHN3aXRjaCAoY29sb3IuZm9ybWF0IGFzIENvbG9yU3BhY2VFeHRlbmRlZCkge1xuXHRcdGNhc2UgJ2NteWsnOlxuXHRcdGNhc2UgJ2hleCc6XG5cdFx0Y2FzZSAnaHNsJzpcblx0XHRjYXNlICdoc3YnOlxuXHRcdGNhc2UgJ2xhYic6XG5cdFx0Y2FzZSAnc2wnOlxuXHRcdGNhc2UgJ3N2Jzpcblx0XHRjYXNlICdyZ2InOlxuXHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbi8vICoqKioqKioqIFNFQ1RJT04gNDogVFJBTlNGT1JNIFVUSUxTICoqKioqKioqXG5cbmZ1bmN0aW9uIGNvbG9yVG9Db2xvclN0cmluZyhjb2xvcjogQ29sb3IpOiBDb2xvclN0cmluZyB7XG5cdGNvbnN0IGNsb25lZENvbG9yID0gY29yZS5iYXNlLmNsb25lKGNvbG9yKTtcblxuXHRpZiAoaXNDb2xvclN0cmluZyhjbG9uZWRDb2xvcikpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcikge1xuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgQWxyZWFkeSBmb3JtYXR0ZWQgYXMgY29sb3Igc3RyaW5nOiAke0pTT04uc3RyaW5naWZ5KGNvbG9yKX1gLFxuXHRcdFx0XHQnY29tbW9uID4gdXRpbHMgPiBjb2xvciA+IGlzQ29sb3JTdHJpbmcoKSdcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsb25lZENvbG9yO1xuXHR9XG5cblx0aWYgKGlzQ01ZS0NvbG9yKGNsb25lZENvbG9yKSkge1xuXHRcdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhjbG9uZWRDb2xvci52YWx1ZSkgYXMgQ01ZS1ZhbHVlO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2NteWsnLFxuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0Y3lhbjogYCR7bmV3VmFsdWUuY3lhbn0lYCxcblx0XHRcdFx0bWFnZW50YTogYCR7bmV3VmFsdWUubWFnZW50YX0lYCxcblx0XHRcdFx0eWVsbG93OiBgJHtuZXdWYWx1ZS55ZWxsb3d9JWAsXG5cdFx0XHRcdGtleTogYCR7bmV3VmFsdWUua2V5fSVgLFxuXHRcdFx0XHRhbHBoYTogYCR7bmV3VmFsdWUuYWxwaGF9YFxuXHRcdFx0fSBhcyBDTVlLVmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzSGV4KGNsb25lZENvbG9yKSkge1xuXHRcdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhjbG9uZWRDb2xvci52YWx1ZSkgYXMgSGV4VmFsdWU7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnaGV4Jyxcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGhleDogYCR7bmV3VmFsdWUuaGV4fWAsXG5cdFx0XHRcdGFscGhhOiBgJHtuZXdWYWx1ZS5hbHBoYX1gLFxuXHRcdFx0XHRudW1BbHBoYTogYCR7bmV3VmFsdWUubnVtQWxwaGF9YFxuXHRcdFx0fSBhcyBIZXhWYWx1ZVN0cmluZ1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNIU0xDb2xvcihjbG9uZWRDb2xvcikpIHtcblx0XHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoY2xvbmVkQ29sb3IudmFsdWUpIGFzIEhTTFZhbHVlO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2hzbCcsXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6IGAke25ld1ZhbHVlLmh1ZX1gLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBgJHtuZXdWYWx1ZS5zYXR1cmF0aW9ufSVgLFxuXHRcdFx0XHRsaWdodG5lc3M6IGAke25ld1ZhbHVlLmxpZ2h0bmVzc30lYCxcblx0XHRcdFx0YWxwaGE6IGAke25ld1ZhbHVlLmFscGhhfWBcblx0XHRcdH0gYXMgSFNMVmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzSFNWQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKGNsb25lZENvbG9yLnZhbHVlKSBhcyBIU1ZWYWx1ZTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdoc3YnLFxuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBgJHtuZXdWYWx1ZS5odWV9YCxcblx0XHRcdFx0c2F0dXJhdGlvbjogYCR7bmV3VmFsdWUuc2F0dXJhdGlvbn0lYCxcblx0XHRcdFx0dmFsdWU6IGAke25ld1ZhbHVlLnZhbHVlfSVgLFxuXHRcdFx0XHRhbHBoYTogYCR7bmV3VmFsdWUuYWxwaGF9YFxuXHRcdFx0fSBhcyBIU1ZWYWx1ZVN0cmluZ1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNMQUIoY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKGNsb25lZENvbG9yLnZhbHVlKSBhcyBMQUJWYWx1ZTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdsYWInLFxuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0bDogYCR7bmV3VmFsdWUubH1gLFxuXHRcdFx0XHRhOiBgJHtuZXdWYWx1ZS5hfWAsXG5cdFx0XHRcdGI6IGAke25ld1ZhbHVlLmJ9YCxcblx0XHRcdFx0YWxwaGE6IGAke25ld1ZhbHVlLmFscGhhfWBcblx0XHRcdH0gYXMgTEFCVmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzUkdCKGNsb25lZENvbG9yKSkge1xuXHRcdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhjbG9uZWRDb2xvci52YWx1ZSkgYXMgUkdCVmFsdWU7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAncmdiJyxcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHJlZDogYCR7bmV3VmFsdWUucmVkfWAsXG5cdFx0XHRcdGdyZWVuOiBgJHtuZXdWYWx1ZS5ncmVlbn1gLFxuXHRcdFx0XHRibHVlOiBgJHtuZXdWYWx1ZS5ibHVlfWAsXG5cdFx0XHRcdGFscGhhOiBgJHtuZXdWYWx1ZS5hbHBoYX1gXG5cdFx0XHR9IGFzIFJHQlZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc1hZWihjbG9uZWRDb2xvcikpIHtcblx0XHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoY2xvbmVkQ29sb3IudmFsdWUpIGFzIFhZWlZhbHVlO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ3h5eicsXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHR4OiBgJHtuZXdWYWx1ZS54fWAsXG5cdFx0XHRcdHk6IGAke25ld1ZhbHVlLnl9YCxcblx0XHRcdFx0ejogYCR7bmV3VmFsdWUuen1gLFxuXHRcdFx0XHRhbHBoYTogYCR7bmV3VmFsdWUuYWxwaGF9YFxuXHRcdFx0fSBhcyBYWVpWYWx1ZVN0cmluZ1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0aWYgKCFtb2RlLmdyYWNlZnVsRXJyb3JzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGZvcm1hdDogJHtjbG9uZWRDb2xvci5mb3JtYXR9YCk7XG5cdFx0fSBlbHNlIGlmIChsb2dNb2RlLmVycm9yKSB7XG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBVbnN1cHBvcnRlZCBmb3JtYXQ6ICR7Y2xvbmVkQ29sb3IuZm9ybWF0fWAsXG5cdFx0XHRcdCdjb21tb24gPiB1dGlscyA+IGNvbG9yID4gY29sb3JUb0NvbG9yU3RyaW5nKCknXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSBpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS53YXJuKSB7XG5cdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0J0ZhaWxlZCB0byBjb252ZXJ0IHRvIGNvbG9yIHN0cmluZy4nLFxuXHRcdFx0XHQnY29tbW9uID4gdXRpbHMgPiBjb2xvciA+IGNvbG9yVG9Db2xvclN0cmluZygpJ1xuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVmYXVsdHMuY29sb3JzLnN0cmluZ3MuaHNsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHVua25vd24+Pihcblx0dmFsdWU6IFRcbik6IFQge1xuXHRyZXR1cm4gT2JqZWN0LmVudHJpZXModmFsdWUpLnJlZHVjZShcblx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHQoYWNjIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVtrZXldID0gW1xuXHRcdFx0XHQnc2F0dXJhdGlvbicsXG5cdFx0XHRcdCdsaWdodG5lc3MnLFxuXHRcdFx0XHQndmFsdWUnLFxuXHRcdFx0XHQnY3lhbicsXG5cdFx0XHRcdCdtYWdlbnRhJyxcblx0XHRcdFx0J3llbGxvdycsXG5cdFx0XHRcdCdrZXknXG5cdFx0XHRdLmluY2x1ZGVzKGtleSlcblx0XHRcdFx0PyBgJHt2YWx9JWBcblx0XHRcdFx0OiB2YWw7XG5cdFx0XHRyZXR1cm4gYWNjO1xuXHRcdH0sXG5cdFx0e30gYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj5cblx0KSBhcyBUO1xufVxuXG5mdW5jdGlvbiBnZXRBbHBoYUZyb21IZXgoaGV4OiBzdHJpbmcpOiBudW1iZXIge1xuXHRpZiAoaGV4Lmxlbmd0aCAhPT0gOSB8fCAhaGV4LnN0YXJ0c1dpdGgoJyMnKSkge1xuXHRcdGlmICghbW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0YEludmFsaWQgaGV4IGNvbG9yOiAke2hleH0uIEV4cGVjdGVkIGZvcm1hdCAjUlJHR0JCQUFgXG5cdFx0XHQpO1xuXHRcdGVsc2UgaWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBJbnZhbGlkIGhleCBjb2xvcjogJHtoZXh9LiBFeHBlY3RlZCBmb3JtYXQgI1JSR0dCQkFBYCxcblx0XHRcdFx0J2NvbW1vbiA+IHV0aWxzID4gY29sb3IgPiBnZXRBbHBoYUZyb21IZXgoKSdcblx0XHRcdCk7XG5cdFx0ZWxzZSBpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS53YXJuKVxuXHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdCdGYWlsZWQgdG8gcGFyc2UgYWxwaGEgZnJvbSBoZXggY29sb3IuJyxcblx0XHRcdFx0J2NvbW1vbiA+IHV0aWxzID4gY29sb3IgPiBnZXRBbHBoYUZyb21IZXgoKSdcblx0XHRcdCk7XG5cdH1cblxuXHRjb25zdCBhbHBoYUhleCA9IGhleC5zbGljZSgtMik7XG5cdGNvbnN0IGFscGhhRGVjaW1hbCA9IHBhcnNlSW50KGFscGhhSGV4LCAxNik7XG5cblx0cmV0dXJuIGFscGhhRGVjaW1hbCAvIDI1NTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29sb3JTdHJpbmcoY29sb3I6IENvbG9yKTogc3RyaW5nIHwgbnVsbCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgZm9ybWF0dGVycyA9IHtcblx0XHRcdGNteWs6IChjOiBDTVlLKSA9PlxuXHRcdFx0XHRgY215aygke2MudmFsdWUuY3lhbn0sICR7Yy52YWx1ZS5tYWdlbnRhfSwgJHtjLnZhbHVlLnllbGxvd30sICR7Yy52YWx1ZS5rZXl9LCAke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHRoZXg6IChjOiBIZXgpID0+IGMudmFsdWUuaGV4LFxuXHRcdFx0aHNsOiAoYzogSFNMKSA9PlxuXHRcdFx0XHRgaHNsKCR7Yy52YWx1ZS5odWV9LCAke2MudmFsdWUuc2F0dXJhdGlvbn0lLCAke2MudmFsdWUubGlnaHRuZXNzfSUsJHtjLnZhbHVlLmFscGhhfSlgLFxuXHRcdFx0aHN2OiAoYzogSFNWKSA9PlxuXHRcdFx0XHRgaHN2KCR7Yy52YWx1ZS5odWV9LCAke2MudmFsdWUuc2F0dXJhdGlvbn0lLCAke2MudmFsdWUudmFsdWV9JSwke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHRsYWI6IChjOiBMQUIpID0+XG5cdFx0XHRcdGBsYWIoJHtjLnZhbHVlLmx9LCAke2MudmFsdWUuYX0sICR7Yy52YWx1ZS5ifSwke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHRyZ2I6IChjOiBSR0IpID0+XG5cdFx0XHRcdGByZ2IoJHtjLnZhbHVlLnJlZH0sICR7Yy52YWx1ZS5ncmVlbn0sICR7Yy52YWx1ZS5ibHVlfSwke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHR4eXo6IChjOiBYWVopID0+XG5cdFx0XHRcdGB4eXooJHtjLnZhbHVlLnh9LCAke2MudmFsdWUueX0sICR7Yy52YWx1ZS56fSwke2MudmFsdWUuYWxwaGF9KWBcblx0XHR9O1xuXG5cdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5jbXlrKGNvbG9yKTtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmhleChjb2xvcik7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5oc2woY29sb3IpO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMuaHN2KGNvbG9yKTtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmxhYihjb2xvcik7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5yZ2IoY29sb3IpO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMueHl6KGNvbG9yKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGlmICghbG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHRgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0IGZvciAke2NvbG9yfWAsXG5cdFx0XHRcdFx0XHQnY29tbW9uID4gdXRpbHMgPiBjb2xvciA+IGdldENvbG9yU3RyaW5nKCknXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCFsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgZ2V0Q29sb3JTdHJpbmcgZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0J2NvbW1vbiA+IHV0aWxzID4gY29sb3IgPiBnZXRDb2xvclN0cmluZygpJ1xuXHRcdFx0KTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleEFscGhhVG9OdW1lcmljQWxwaGEoaGV4QWxwaGE6IHN0cmluZyk6IG51bWJlciB7XG5cdHJldHVybiBwYXJzZUludChoZXhBbHBoYSwgMTYpIC8gMjU1O1xufVxuXG5jb25zdCBwYXJzZUNvbG9yID0gKGNvbG9yU3BhY2U6IENvbG9yU3BhY2UsIHZhbHVlOiBzdHJpbmcpOiBDb2xvciB8IG51bGwgPT4ge1xuXHR0cnkge1xuXHRcdHN3aXRjaCAoY29sb3JTcGFjZSkge1xuXHRcdFx0Y2FzZSAnY215ayc6IHtcblx0XHRcdFx0Y29uc3QgW2MsIG0sIHksIGssIGFdID0gcGFyc2VDb21wb25lbnRzKHZhbHVlLCA1KTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRjeWFuOiBjb3JlLmJyYW5kLmFzUGVyY2VudGlsZShjKSxcblx0XHRcdFx0XHRcdG1hZ2VudGE6IGNvcmUuYnJhbmQuYXNQZXJjZW50aWxlKG0pLFxuXHRcdFx0XHRcdFx0eWVsbG93OiBjb3JlLmJyYW5kLmFzUGVyY2VudGlsZSh5KSxcblx0XHRcdFx0XHRcdGtleTogY29yZS5icmFuZC5hc1BlcmNlbnRpbGUoayksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZS5icmFuZC5hc0FscGhhUmFuZ2UoYSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRjb25zdCBoZXhWYWx1ZSA9IHZhbHVlLnN0YXJ0c1dpdGgoJyMnKSA/IHZhbHVlIDogYCMke3ZhbHVlfWA7XG5cdFx0XHRcdGNvbnN0IGFscGhhID0gaGV4VmFsdWUubGVuZ3RoID09PSA5ID8gaGV4VmFsdWUuc2xpY2UoLTIpIDogJ0ZGJztcblx0XHRcdFx0Y29uc3QgbnVtQWxwaGEgPSBoZXhBbHBoYVRvTnVtZXJpY0FscGhhKGFscGhhKTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRoZXg6IGNvcmUuYnJhbmQuYXNIZXhTZXQoaGV4VmFsdWUpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGNvcmUuYnJhbmQuYXNIZXhDb21wb25lbnQoYWxwaGEpLFxuXHRcdFx0XHRcdFx0bnVtQWxwaGE6IGNvcmUuYnJhbmQuYXNBbHBoYVJhbmdlKG51bUFscGhhKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHR9O1xuXHRcdFx0Y2FzZSAnaHNsJzoge1xuXHRcdFx0XHRjb25zdCBbaCwgcywgbCwgYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGh1ZTogY29yZS5icmFuZC5hc1JhZGlhbChoKSxcblx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGNvcmUuYnJhbmQuYXNQZXJjZW50aWxlKHMpLFxuXHRcdFx0XHRcdFx0bGlnaHRuZXNzOiBjb3JlLmJyYW5kLmFzUGVyY2VudGlsZShsKSxcblx0XHRcdFx0XHRcdGFscGhhOiBjb3JlLmJyYW5kLmFzQWxwaGFSYW5nZShhKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAnaHN2Jzoge1xuXHRcdFx0XHRjb25zdCBbaCwgcywgdiwgYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGh1ZTogY29yZS5icmFuZC5hc1JhZGlhbChoKSxcblx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGNvcmUuYnJhbmQuYXNQZXJjZW50aWxlKHMpLFxuXHRcdFx0XHRcdFx0dmFsdWU6IGNvcmUuYnJhbmQuYXNQZXJjZW50aWxlKHYpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGNvcmUuYnJhbmQuYXNBbHBoYVJhbmdlKGEpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdsYWInOiB7XG5cdFx0XHRcdGNvbnN0IFtsLCBhLCBiLCBhbHBoYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRsOiBjb3JlLmJyYW5kLmFzTEFCX0wobCksXG5cdFx0XHRcdFx0XHRhOiBjb3JlLmJyYW5kLmFzTEFCX0EoYSksXG5cdFx0XHRcdFx0XHRiOiBjb3JlLmJyYW5kLmFzTEFCX0IoYiksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZS5icmFuZC5hc0FscGhhUmFuZ2UoYWxwaGEpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdyZ2InOiB7XG5cdFx0XHRcdGNvbnN0IGNvbXBvbmVudHMgPSB2YWx1ZS5zcGxpdCgnLCcpLm1hcChOdW1iZXIpO1xuXG5cdFx0XHRcdGlmIChjb21wb25lbnRzLnNvbWUoaXNOYU4pKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBSR0IgZm9ybWF0Jyk7XG5cblx0XHRcdFx0Y29uc3QgW3IsIGcsIGIsIGFdID0gY29tcG9uZW50cztcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRyZWQ6IGNvcmUuYnJhbmQuYXNCeXRlUmFuZ2UociksXG5cdFx0XHRcdFx0XHRncmVlbjogY29yZS5icmFuZC5hc0J5dGVSYW5nZShnKSxcblx0XHRcdFx0XHRcdGJsdWU6IGNvcmUuYnJhbmQuYXNCeXRlUmFuZ2UoYiksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZS5icmFuZC5hc0FscGhhUmFuZ2UoYSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGNvbnN0IG1lc3NhZ2UgPSBgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yU3BhY2V9YDtcblxuXHRcdFx0XHRpZiAobW9kZS5ncmFjZWZ1bEVycm9ycykge1xuXHRcdFx0XHRcdGlmIChsb2dNb2RlLmVycm9yKSBsb2dnZXIuZXJyb3IobWVzc2FnZSk7XG5cdFx0XHRcdFx0ZWxzZSBpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS53YXJuKVxuXHRcdFx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0XHRcdGBGYWlsZWQgdG8gcGFyc2UgY29sb3I6ICR7bWVzc2FnZX1gLFxuXHRcdFx0XHRcdFx0XHQnY29tbW9uID4gdXRpbHMgPiBjb2xvciA+IHBhcnNlQ29sb3IoKSdcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgcGFyc2VDb2xvciBlcnJvcjogJHtlcnJvcn1gLFxuXHRcdFx0XHQnY29tbW9uID4gdXRpbHMgPiBjb2xvciA+IHBhcnNlQ29sb3IoKSdcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufTtcblxuZnVuY3Rpb24gcGFyc2VDb21wb25lbnRzKHZhbHVlOiBzdHJpbmcsIGNvdW50OiBudW1iZXIpOiBudW1iZXJbXSB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29tcG9uZW50cyA9IHZhbHVlXG5cdFx0XHQuc3BsaXQoJywnKVxuXHRcdFx0Lm1hcCh2YWwgPT5cblx0XHRcdFx0dmFsLnRyaW0oKS5lbmRzV2l0aCgnJScpXG5cdFx0XHRcdFx0PyBwYXJzZUZsb2F0KHZhbClcblx0XHRcdFx0XHQ6IHBhcnNlRmxvYXQodmFsKSAqIDEwMFxuXHRcdFx0KTtcblxuXHRcdGlmIChjb21wb25lbnRzLmxlbmd0aCAhPT0gY291bnQpXG5cdFx0XHRpZiAoIW1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgJHtjb3VudH0gY29tcG9uZW50cy5gKTtcblx0XHRcdGVsc2UgaWYgKGxvZ01vZGUuZXJyb3IpIHtcblx0XHRcdFx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUud2Fybilcblx0XHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRcdGBFeHBlY3RlZCAke2NvdW50fSBjb21wb25lbnRzLmAsXG5cdFx0XHRcdFx0XHQnY29tbW9uID4gdXRpbHMgPiBjb2xvciA+IHBhcnNlQ29tcG9uZW50cygpJ1xuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0fVxuXG5cdFx0cmV0dXJuIGNvbXBvbmVudHM7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBFcnJvciBwYXJzaW5nIGNvbXBvbmVudHM6ICR7ZXJyb3J9YCxcblx0XHRcdFx0J2NvbW1vbiA+IHV0aWxzID4gY29sb3IgPiBwYXJzZUNvbXBvbmVudHMoKSdcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gW107XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VIZXhXaXRoQWxwaGEoaGV4VmFsdWU6IHN0cmluZyk6IEhleFZhbHVlIHwgbnVsbCB7XG5cdGNvbnN0IGhleCA9IGhleFZhbHVlLnN0YXJ0c1dpdGgoJyMnKSA/IGhleFZhbHVlIDogYCMke2hleFZhbHVlfWA7XG5cdGNvbnN0IGFscGhhID0gaGV4Lmxlbmd0aCA9PT0gOSA/IGhleC5zbGljZSgtMikgOiAnRkYnO1xuXHRjb25zdCBudW1BbHBoYSA9IGhleEFscGhhVG9OdW1lcmljQWxwaGEoYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0aGV4OiBjb3JlLmJyYW5kLmFzSGV4U2V0KGhleCksXG5cdFx0YWxwaGE6IGNvcmUuYnJhbmQuYXNIZXhDb21wb25lbnQoYWxwaGEpLFxuXHRcdG51bUFscGhhOiBjb3JlLmJyYW5kLmFzQWxwaGFSYW5nZShudW1BbHBoYSlcblx0fTtcbn1cblxuZnVuY3Rpb24gc3RyaXBIYXNoRnJvbUhleChoZXg6IEhleCk6IEhleCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgaGV4U3RyaW5nID0gYCR7aGV4LnZhbHVlLmhleH0ke2hleC52YWx1ZS5hbHBoYX1gO1xuXG5cdFx0cmV0dXJuIGhleC52YWx1ZS5oZXguc3RhcnRzV2l0aCgnIycpXG5cdFx0XHQ/IHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aGV4OiBjb3JlLmJyYW5kLmFzSGV4U2V0KGhleFN0cmluZy5zbGljZSgxKSksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZS5icmFuZC5hc0hleENvbXBvbmVudChcblx0XHRcdFx0XHRcdFx0U3RyaW5nKGhleC52YWx1ZS5hbHBoYSlcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRudW1BbHBoYTogY29yZS5icmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdGhleEFscGhhVG9OdW1lcmljQWxwaGEoU3RyaW5nKGhleC52YWx1ZS5hbHBoYSkpXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnIGFzICdoZXgnXG5cdFx0XHRcdH1cblx0XHRcdDogaGV4O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgc3RyaXBIYXNoRnJvbUhleCBlcnJvcjogJHtlcnJvcn1gLFxuXHRcdFx0XHQnY29tbW9uID4gdXRpbHMgPiBjb2xvciA+IHN0cmlwSGFzaEZyb21IZXgoKSdcblx0XHRcdCk7XG5cblx0XHRjb25zdCB1bmJyYW5kZWRIZXggPSBjb3JlLmJhc2UuY2xvbmUoXG5cdFx0XHRkZWZhdWx0cy5jb2xvcnMuYmFzZS51bmJyYW5kZWQuaGV4XG5cdFx0KTtcblxuXHRcdHJldHVybiBjb3JlLmJyYW5kQ29sb3IuYXNIZXgodW5icmFuZGVkSGV4KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzdHJpcFBlcmNlbnRGcm9tVmFsdWVzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBudW1iZXIgfCBzdHJpbmc+Pihcblx0dmFsdWU6IFRcbik6IHsgW0sgaW4ga2V5b2YgVF06IFRbS10gZXh0ZW5kcyBgJHtudW1iZXJ9JWAgPyBudW1iZXIgOiBUW0tdIH0ge1xuXHRyZXR1cm4gT2JqZWN0LmVudHJpZXModmFsdWUpLnJlZHVjZShcblx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHRjb25zdCBwYXJzZWRWYWx1ZSA9XG5cdFx0XHRcdHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIHZhbC5lbmRzV2l0aCgnJScpXG5cdFx0XHRcdFx0PyBwYXJzZUZsb2F0KHZhbC5zbGljZSgwLCAtMSkpXG5cdFx0XHRcdFx0OiB2YWw7XG5cdFx0XHRhY2Nba2V5IGFzIGtleW9mIFRdID0gcGFyc2VkVmFsdWUgYXMgVFtrZXlvZiBUXSBleHRlbmRzIGAke251bWJlcn0lYFxuXHRcdFx0XHQ/IG51bWJlclxuXHRcdFx0XHQ6IFRba2V5b2YgVF07XG5cdFx0XHRyZXR1cm4gYWNjO1xuXHRcdH0sXG5cdFx0e30gYXMgeyBbSyBpbiBrZXlvZiBUXTogVFtLXSBleHRlbmRzIGAke251bWJlcn0lYCA/IG51bWJlciA6IFRbS10gfVxuXHQpO1xufVxuXG5mdW5jdGlvbiB0b0hleFdpdGhBbHBoYShyZ2JWYWx1ZTogUkdCVmFsdWUpOiBzdHJpbmcge1xuXHRjb25zdCB7IHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhIH0gPSByZ2JWYWx1ZTtcblxuXHRjb25zdCBoZXggPSBgIyR7KCgxIDw8IDI0KSArIChyZWQgPDwgMTYpICsgKGdyZWVuIDw8IDgpICsgYmx1ZSlcblx0XHQudG9TdHJpbmcoMTYpXG5cdFx0LnNsaWNlKDEpfWA7XG5cdGNvbnN0IGFscGhhSGV4ID0gTWF0aC5yb3VuZChhbHBoYSAqIDI1NSlcblx0XHQudG9TdHJpbmcoMTYpXG5cdFx0LnBhZFN0YXJ0KDIsICcwJyk7XG5cblx0cmV0dXJuIGAke2hleH0ke2FscGhhSGV4fWA7XG59XG5cbmV4cG9ydCBjb25zdCBjb2xvcjogQ29tbW9uRnVuY3Rpb25zTWFzdGVySW50ZXJmYWNlWyd1dGlscyddWydjb2xvciddID0ge1xuXHRjb2xvclRvQ29sb3JTdHJpbmcsXG5cdGVuc3VyZUhhc2gsXG5cdGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMsXG5cdGdldEFscGhhRnJvbUhleCxcblx0Z2V0Q29sb3JTdHJpbmcsXG5cdGhleEFscGhhVG9OdW1lcmljQWxwaGEsXG5cdGlzQ01ZS0NvbG9yLFxuXHRpc0NNWUtGb3JtYXQsXG5cdGlzQ01ZS1N0cmluZyxcblx0aXNDb2xvckZvcm1hdCxcblx0aXNDb2xvclN0cmluZyxcblx0aXNDb2xvclNwYWNlLFxuXHRpc0NvbG9yU3BhY2VFeHRlbmRlZCxcblx0aXNDb252ZXJ0aWJsZUNvbG9yLFxuXHRpc0Zvcm1hdCxcblx0aXNIZXgsXG5cdGlzSGV4Rm9ybWF0LFxuXHRpc0hTTENvbG9yLFxuXHRpc0hTTEZvcm1hdCxcblx0aXNIU0xTdHJpbmcsXG5cdGlzSW5wdXRFbGVtZW50LFxuXHRpc0hTVkNvbG9yLFxuXHRpc0hTVkZvcm1hdCxcblx0aXNIU1ZTdHJpbmcsXG5cdGlzTEFCLFxuXHRpc0xBQkZvcm1hdCxcblx0aXNSR0IsXG5cdGlzUkdCRm9ybWF0LFxuXHRpc1NMQ29sb3IsXG5cdGlzU0xGb3JtYXQsXG5cdGlzU0xTdHJpbmcsXG5cdGlzU3RvcmVkUGFsZXR0ZSxcblx0aXNTVkNvbG9yLFxuXHRpc1NWRm9ybWF0LFxuXHRpc1NWU3RyaW5nLFxuXHRpc1hZWixcblx0aXNYWVpGb3JtYXQsXG5cdG5hcnJvd1RvQ29sb3IsXG5cdHBhcnNlQ29sb3IsXG5cdHBhcnNlQ29tcG9uZW50cyxcblx0cGFyc2VIZXhXaXRoQWxwaGEsXG5cdHN0cmlwSGFzaEZyb21IZXgsXG5cdHN0cmlwUGVyY2VudEZyb21WYWx1ZXMsXG5cdHRvSGV4V2l0aEFscGhhXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgeyBoZXhBbHBoYVRvTnVtZXJpY0FscGhhLCBzdHJpcEhhc2hGcm9tSGV4IH07XG4iXX0=