// File: common/utils/color.js
import { coreUtils } from '../core.js';
import { createLogger } from '../../logger/index.js';
import { defaultData as defaults } from '../../data/defaults.js';
import { modeData as mode } from '../../data/mode.js';
const logMode = mode.logging;
const thisModule = 'common/utils/color.js';
const logger = await createLogger();
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
    return (coreUtils.guards.isColor(value) &&
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
    return (coreUtils.guards.isColor(value) &&
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
    return (coreUtils.guards.isColor(value) &&
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
        return coreUtils.convert.colorStringToColor(color);
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
    const thisMethod = 'colorToColorString()';
    const clonedColor = coreUtils.base.clone(color);
    if (isColorString(clonedColor)) {
        if (logMode.error) {
            logger.error(`Already formatted as color string: ${JSON.stringify(color)}`, `${thisModule} > ${thisMethod}`);
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
            logger.error(`Unsupported format: ${clonedColor.format}`, `${thisModule} > ${thisMethod}`);
        }
        else if (!mode.quiet && logMode.warn) {
            logger.warn('Failed to convert to color string.', `${thisModule} > ${thisMethod}`);
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
            logger.error(`Invalid hex color: ${hex}. Expected format #RRGGBBAA`, `${thisModule} > getAlphaFromHex()`);
        else if (!mode.quiet && logMode.warn)
            logger.warn('Failed to parse alpha from hex color.', `${thisModule} > getAlphaFromHex()`);
    }
    const alphaHex = hex.slice(-2);
    const alphaDecimal = parseInt(alphaHex, 16);
    return alphaDecimal / 255;
}
function getColorString(color) {
    const thisMethod = 'getColorString()';
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
                    logger.error(`Unsupported color format for ${color}`, `${thisModule} > ${thisMethod}`);
                return null;
        }
    }
    catch (error) {
        if (!logMode.error)
            logger.error(`getColorString error: ${error}`, `${thisModule} > ${thisMethod}`);
        return null;
    }
}
function hexAlphaToNumericAlpha(hexAlpha) {
    return parseInt(hexAlpha, 16) / 255;
}
const parseColor = (colorSpace, value) => {
    const thisMethod = 'parseColor';
    try {
        switch (colorSpace) {
            case 'cmyk': {
                const [c, m, y, k, a] = parseComponents(value, 5);
                return {
                    value: {
                        cyan: coreUtils.brand.asPercentile(c),
                        magenta: coreUtils.brand.asPercentile(m),
                        yellow: coreUtils.brand.asPercentile(y),
                        key: coreUtils.brand.asPercentile(k),
                        alpha: coreUtils.brand.asAlphaRange(a)
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
                        hex: coreUtils.brand.asHexSet(hexValue),
                        alpha: coreUtils.brand.asHexComponent(alpha),
                        numAlpha: coreUtils.brand.asAlphaRange(numAlpha)
                    },
                    format: 'hex'
                };
            case 'hsl': {
                const [h, s, l, a] = parseComponents(value, 4);
                return {
                    value: {
                        hue: coreUtils.brand.asRadial(h),
                        saturation: coreUtils.brand.asPercentile(s),
                        lightness: coreUtils.brand.asPercentile(l),
                        alpha: coreUtils.brand.asAlphaRange(a)
                    },
                    format: 'hsl'
                };
            }
            case 'hsv': {
                const [h, s, v, a] = parseComponents(value, 4);
                return {
                    value: {
                        hue: coreUtils.brand.asRadial(h),
                        saturation: coreUtils.brand.asPercentile(s),
                        value: coreUtils.brand.asPercentile(v),
                        alpha: coreUtils.brand.asAlphaRange(a)
                    },
                    format: 'hsv'
                };
            }
            case 'lab': {
                const [l, a, b, alpha] = parseComponents(value, 4);
                return {
                    value: {
                        l: coreUtils.brand.asLAB_L(l),
                        a: coreUtils.brand.asLAB_A(a),
                        b: coreUtils.brand.asLAB_B(b),
                        alpha: coreUtils.brand.asAlphaRange(alpha)
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
                        red: coreUtils.brand.asByteRange(r),
                        green: coreUtils.brand.asByteRange(g),
                        blue: coreUtils.brand.asByteRange(b),
                        alpha: coreUtils.brand.asAlphaRange(a)
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
                        logger.warn(`Failed to parse color: ${message}`, `${thisModule} > ${thisMethod}`);
                }
                else {
                    throw new Error(message);
                }
                return null;
        }
    }
    catch (error) {
        if (logMode.error)
            logger.error(`parseColor error: ${error}`, `${thisModule} > ${thisMethod}`);
        return null;
    }
};
function parseComponents(value, count) {
    const thisMethod = 'parseComponents()';
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
                    logger.warn(`Expected ${count} components.`, `${thisModule} > ${thisMethod}`);
                return [];
            }
        return components;
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Error parsing components: ${error}`, `${thisModule} > ${thisMethod}`);
        return [];
    }
}
function parseHexWithAlpha(hexValue) {
    const hex = hexValue.startsWith('#') ? hexValue : `#${hexValue}`;
    const alpha = hex.length === 9 ? hex.slice(-2) : 'FF';
    const numAlpha = hexAlphaToNumericAlpha(alpha);
    return {
        hex: coreUtils.brand.asHexSet(hex),
        alpha: coreUtils.brand.asHexComponent(alpha),
        numAlpha: coreUtils.brand.asAlphaRange(numAlpha)
    };
}
function stripHashFromHex(hex) {
    const thisMethod = 'stripHashFromHex()';
    try {
        const hexString = `${hex.value.hex}${hex.value.alpha}`;
        return hex.value.hex.startsWith('#')
            ? {
                value: {
                    hex: coreUtils.brand.asHexSet(hexString.slice(1)),
                    alpha: coreUtils.brand.asHexComponent(String(hex.value.alpha)),
                    numAlpha: coreUtils.brand.asAlphaRange(hexAlphaToNumericAlpha(String(hex.value.alpha)))
                },
                format: 'hex'
            }
            : hex;
    }
    catch (error) {
        if (logMode.error)
            logger.error(`stripHashFromHex error: ${error}`, `${thisModule} > ${thisMethod}`);
        const unbrandedHex = coreUtils.base.clone(defaults.colors.base.unbranded.hex);
        return coreUtils.brandColor.asHex(unbrandedHex);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL3V0aWxzL2NvbG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQTZCOUIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN2QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDckQsT0FBTyxFQUFFLFdBQVcsSUFBSSxRQUFRLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsUUFBUSxJQUFJLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXRELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDN0IsTUFBTSxVQUFVLEdBQUcsdUJBQXVCLENBQUM7QUFFM0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxrREFBa0Q7QUFFbEQsU0FBUyxhQUFhLENBQ3JCLEtBQVksRUFDWixNQUFtQjtJQUVuQixPQUFPLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDO0FBQ2hDLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxLQUFhO0lBQ2xDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQUMsS0FBYTtJQUMxQyxPQUFPO1FBQ04sTUFBTTtRQUNOLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsSUFBSTtRQUNKLElBQUk7UUFDSixLQUFLO0tBQ0wsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUFDLEtBQWM7SUFDcEMs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RyxJQUFJLENBQUM7U0FDN0QsUUFBUSxDQUFDLEVBQUUsQ0FBQztTQUNaLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ2IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1NBQ3RDLFFBQVEsQ0FBQyxFQUFFLENBQUM7U0FDWixRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRW5CLE9BQU8sR0FBRyxHQUFHLEdBQUcsUUFBUSxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBK0M7SUFDckUsa0JBQWtCO0lBQ2xCLFVBQVU7SUFDVixzQkFBc0I7SUFDdEIsZUFBZTtJQUNmLGNBQWM7SUFDZCxzQkFBc0I7SUFDdEIsV0FBVztJQUNYLFlBQVk7SUFDWixZQUFZO0lBQ1osYUFBYTtJQUNiLGFBQWE7SUFDYixZQUFZO0lBQ1osb0JBQW9CO0lBQ3BCLGtCQUFrQjtJQUNsQixRQUFRO0lBQ1IsS0FBSztJQUNMLFdBQVc7SUFDWCxVQUFVO0lBQ1YsV0FBVztJQUNYLFdBQVc7SUFDWCxjQUFjO0lBQ2QsVUFBVTtJQUNWLFdBQVc7SUFDWCxXQUFXO0lBQ1gsS0FBSztJQUNMLFdBQVc7SUFDWCxLQUFLO0lBQ0wsV0FBVztJQUNYLFNBQVM7SUFDVCxVQUFVO0lBQ1YsVUFBVTtJQUNWLGVBQWU7SUFDZixTQUFTO0lBQ1QsVUFBVTtJQUNWLFVBQVU7SUFDVixLQUFLO0lBQ0wsV0FBVztJQUNYLGFBQWE7SUFDYixVQUFVO0lBQ1YsZUFBZTtJQUNmLGlCQUFpQjtJQUNqQixnQkFBZ0I7SUFDaEIsc0JBQXNCO0lBQ3RCLGNBQWM7Q0FDTCxDQUFDO0FBRVgsT0FBTyxFQUFFLHNCQUFzQixFQUFFLGdCQUFnQixFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBjb21tb24vdXRpbHMvY29sb3IuanNcblxuaW1wb3J0IHtcblx0Q01ZSyxcblx0Q01ZS19TdHJpbmdQcm9wcyxcblx0Q29sb3IsXG5cdENvbG9yRm9ybWF0LFxuXHRDb2xvclNwYWNlLFxuXHRDb2xvclNwYWNlRXh0ZW5kZWQsXG5cdENvbG9yX1N0cmluZ1Byb3BzLFxuXHRDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2UsXG5cdEhleCxcblx0SGV4X1N0cmluZ1Byb3BzLFxuXHRIU0wsXG5cdEhTTF9TdHJpbmdQcm9wcyxcblx0SFNWLFxuXHRIU1ZfU3RyaW5nUHJvcHMsXG5cdExBQixcblx0TEFCX1N0cmluZ1Byb3BzLFxuXHRSR0IsXG5cdFJHQl9TdHJpbmdQcm9wcyxcblx0U0wsXG5cdFNMX1N0cmluZ1Byb3BzLFxuXHRTdG9yZWRQYWxldHRlLFxuXHRTVixcblx0U1ZfU3RyaW5nUHJvcHMsXG5cdFhZWixcblx0WFlaX1N0cmluZ1Byb3BzXG59IGZyb20gJy4uLy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGNvcmVVdGlscyB9IGZyb20gJy4uL2NvcmUuanMnO1xuaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAnLi4vLi4vbG9nZ2VyL2luZGV4LmpzJztcbmltcG9ydCB7IGRlZmF1bHREYXRhIGFzIGRlZmF1bHRzIH0gZnJvbSAnLi4vLi4vZGF0YS9kZWZhdWx0cy5qcyc7XG5pbXBvcnQgeyBtb2RlRGF0YSBhcyBtb2RlIH0gZnJvbSAnLi4vLi4vZGF0YS9tb2RlLmpzJztcblxuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcbmNvbnN0IHRoaXNNb2R1bGUgPSAnY29tbW9uL3V0aWxzL2NvbG9yLmpzJztcblxuY29uc3QgbG9nZ2VyID0gYXdhaXQgY3JlYXRlTG9nZ2VyKCk7XG5cbi8vICoqKioqKioqIFNFQ1RJT04gMTogUm9idXN0IFR5cGUgR3VhcmRzICoqKioqKioqXG5cbmZ1bmN0aW9uIGlzQ29sb3JGb3JtYXQ8VCBleHRlbmRzIENvbG9yPihcblx0Y29sb3I6IENvbG9yLFxuXHRmb3JtYXQ6IFRbJ2Zvcm1hdCddXG4pOiBjb2xvciBpcyBUIHtcblx0cmV0dXJuIGNvbG9yLmZvcm1hdCA9PT0gZm9ybWF0O1xufVxuXG5mdW5jdGlvbiBpc0NvbG9yU3BhY2UodmFsdWU6IHN0cmluZyk6IHZhbHVlIGlzIENvbG9yU3BhY2Uge1xuXHRyZXR1cm4gWydjbXlrJywgJ2hleCcsICdoc2wnLCAnaHN2JywgJ2xhYicsICdyZ2InLCAneHl6J10uaW5jbHVkZXModmFsdWUpO1xufVxuXG5mdW5jdGlvbiBpc0NvbG9yU3BhY2VFeHRlbmRlZCh2YWx1ZTogc3RyaW5nKTogdmFsdWUgaXMgQ29sb3JTcGFjZUV4dGVuZGVkIHtcblx0cmV0dXJuIFtcblx0XHQnY215aycsXG5cdFx0J2hleCcsXG5cdFx0J2hzbCcsXG5cdFx0J2hzdicsXG5cdFx0J2xhYicsXG5cdFx0J3JnYicsXG5cdFx0J3NsJyxcblx0XHQnc3YnLFxuXHRcdCd4eXonXG5cdF0uaW5jbHVkZXModmFsdWUpO1xufVxuXG5mdW5jdGlvbiBpc0NvbG9yU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ29sb3JfU3RyaW5nUHJvcHMge1xuXHRpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuXHRcdGNvbnN0IGNvbG9yU3RyaW5nID0gdmFsdWUgYXMgRXhjbHVkZTxcblx0XHRcdENvbG9yX1N0cmluZ1Byb3BzLFxuXHRcdFx0SGV4X1N0cmluZ1Byb3BzXG5cdFx0Pjtcblx0XHRjb25zdCB2YWxpZFN0cmluZ0Zvcm1hdHM6IEV4Y2x1ZGU8XG5cdFx0XHRDb2xvcl9TdHJpbmdQcm9wcyxcblx0XHRcdEhleF9TdHJpbmdQcm9wc1xuXHRcdD5bJ2Zvcm1hdCddW10gPSBbJ2NteWsnLCAnaHNsJywgJ2hzdicsICdsYWInLCAncmdiJywgJ3NsJywgJ3N2JywgJ3h5eiddO1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdCd2YWx1ZScgaW4gY29sb3JTdHJpbmcgJiZcblx0XHRcdCdmb3JtYXQnIGluIGNvbG9yU3RyaW5nICYmXG5cdFx0XHR2YWxpZFN0cmluZ0Zvcm1hdHMuaW5jbHVkZXMoY29sb3JTdHJpbmcuZm9ybWF0KVxuXHRcdCk7XG5cdH1cblxuXHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiAvXiNbMC05QS1GYS1mXXs2LDh9JC8udGVzdCh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGlzRm9ybWF0KGZvcm1hdDogdW5rbm93bik6IGZvcm1hdCBpcyBDb2xvckZvcm1hdCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIGZvcm1hdCA9PT0gJ3N0cmluZycgJiZcblx0XHRbJ2NteWsnLCAnaGV4JywgJ2hzbCcsICdoc3YnLCAnbGFiJywgJ3JnYicsICdzbCcsICdzdicsICd4eXonXS5pbmNsdWRlcyhcblx0XHRcdGZvcm1hdFxuXHRcdClcblx0KTtcbn1cblxuLy8gKioqKioqKiogU0VDVElPTiAyOiBOYXJyb3cgVHlwZSBHdWFyZHMgKioqKioqKipcblxuZnVuY3Rpb24gaXNDTVlLQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDTVlLIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBDTVlLKS5mb3JtYXQgPT09ICdjbXlrJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUspLnZhbHVlLmN5YW4gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLKS52YWx1ZS5tYWdlbnRhID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZSykudmFsdWUueWVsbG93ID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZSykudmFsdWUua2V5ID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0NNWUtGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgQ01ZSyB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnY215aycpO1xufVxuXG5mdW5jdGlvbiBpc0NNWUtTdHJpbmcodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDTVlLX1N0cmluZ1Byb3BzIHtcblx0cmV0dXJuIChcblx0XHRpc0NvbG9yU3RyaW5nKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIENNWUtfU3RyaW5nUHJvcHMpLmZvcm1hdCA9PT0gJ2NteWsnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZS19TdHJpbmdQcm9wcykudmFsdWUuY3lhbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUtfU3RyaW5nUHJvcHMpLnZhbHVlLm1hZ2VudGEgPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLX1N0cmluZ1Byb3BzKS52YWx1ZS55ZWxsb3cgPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLX1N0cmluZ1Byb3BzKS52YWx1ZS5rZXkgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSGV4KHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgSGV4IHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBIZXgpLmZvcm1hdCA9PT0gJ2hleCcgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIZXgpLnZhbHVlLmhleCA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNIZXhGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgSGV4IHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdoZXgnKTtcbn1cblxuZnVuY3Rpb24gaXNIU0xDb2xvcih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhTTCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgSFNMKS5mb3JtYXQgPT09ICdoc2wnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMKS52YWx1ZS5odWUgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU0wpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU0wpLnZhbHVlLmxpZ2h0bmVzcyA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNIU0xGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgSFNMIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdoc2wnKTtcbn1cblxuZnVuY3Rpb24gaXNIU0xTdHJpbmcodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIU0xfU3RyaW5nUHJvcHMge1xuXHRyZXR1cm4gKFxuXHRcdGlzQ29sb3JTdHJpbmcodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgSFNMX1N0cmluZ1Byb3BzKS5mb3JtYXQgPT09ICdoc2wnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMX1N0cmluZ1Byb3BzKS52YWx1ZS5odWUgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU0xfU3RyaW5nUHJvcHMpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU0xfU3RyaW5nUHJvcHMpLnZhbHVlLmxpZ2h0bmVzcyA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNIU1ZDb2xvcih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhTViB7XG5cdHJldHVybiAoXG5cdFx0Y29yZVV0aWxzLmd1YXJkcy5pc0NvbG9yKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIEhTVikuZm9ybWF0ID09PSAnaHN2JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVikudmFsdWUuaHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNWKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNWKS52YWx1ZS52YWx1ZSA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNIU1ZGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgSFNWIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdoc3YnKTtcbn1cblxuZnVuY3Rpb24gaXNIU1ZTdHJpbmcodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIU1ZfU3RyaW5nUHJvcHMge1xuXHRyZXR1cm4gKFxuXHRcdGlzQ29sb3JTdHJpbmcodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgSFNWX1N0cmluZ1Byb3BzKS5mb3JtYXQgPT09ICdoc3YnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNWX1N0cmluZ1Byb3BzKS52YWx1ZS5odWUgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1ZfU3RyaW5nUHJvcHMpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1ZfU3RyaW5nUHJvcHMpLnZhbHVlLnZhbHVlID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0xBQih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIExBQiB7XG5cdHJldHVybiAoXG5cdFx0Y29yZVV0aWxzLmd1YXJkcy5pc0NvbG9yKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIExBQikuZm9ybWF0ID09PSAnbGFiJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIExBQikudmFsdWUubCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIExBQikudmFsdWUuYSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIExBQikudmFsdWUuYiA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNMQUJGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgTEFCIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdsYWInKTtcbn1cblxuZnVuY3Rpb24gaXNSR0IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBSR0Ige1xuXHRyZXR1cm4gKFxuXHRcdGNvcmVVdGlscy5ndWFyZHMuaXNDb2xvcih2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBSR0IpLmZvcm1hdCA9PT0gJ3JnYicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBSR0IpLnZhbHVlLnJlZCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFJHQikudmFsdWUuZ3JlZW4gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBSR0IpLnZhbHVlLmJsdWUgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzUkdCRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIFJHQiB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAncmdiJyk7XG59XG5cbmZ1bmN0aW9uIGlzU0xDb2xvcih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFNMIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBTTCkuZm9ybWF0ID09PSAnc2wnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU0wpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTTCkudmFsdWUubGlnaHRuZXNzID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1NMRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIFNMIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdzbCcpO1xufVxuXG5mdW5jdGlvbiBpc1NMU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgU0xfU3RyaW5nUHJvcHMge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFNMX1N0cmluZ1Byb3BzKS5mb3JtYXQgPT09ICdzbCcgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTTF9TdHJpbmdQcm9wcykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNMX1N0cmluZ1Byb3BzKS52YWx1ZS5saWdodG5lc3MgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzU1ZDb2xvcih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFNWIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBTVikuZm9ybWF0ID09PSAnc3YnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU1YpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTVikudmFsdWUudmFsdWUgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzU1ZGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgU1Yge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ3N2Jyk7XG59XG5cbmZ1bmN0aW9uIGlzU1ZTdHJpbmcodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBTVl9TdHJpbmdQcm9wcyB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgU1ZfU3RyaW5nUHJvcHMpLmZvcm1hdCA9PT0gJ3N2JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNWX1N0cmluZ1Byb3BzKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU1ZfU3RyaW5nUHJvcHMpLnZhbHVlLnZhbHVlID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1hZWih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFhZWiB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgWFlaKS5mb3JtYXQgPT09ICd4eXonICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgWFlaKS52YWx1ZS54ID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgWFlaKS52YWx1ZS55ID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgWFlaKS52YWx1ZS56ID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1hZWkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBYWVoge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ3h5eicpO1xufVxuXG4vLyAqKioqKiBTRUNUSU9OIDM6IFV0aWxpdHkgR3VhcmRzICoqKioqXG5cbmZ1bmN0aW9uIGVuc3VyZUhhc2godmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG5cdHJldHVybiB2YWx1ZS5zdGFydHNXaXRoKCcjJykgPyB2YWx1ZSA6IGAjJHt2YWx1ZX1gO1xufVxuXG5mdW5jdGlvbiBpc0NvbnZlcnRpYmxlQ29sb3IoXG5cdGNvbG9yOiBDb2xvclxuKTogY29sb3IgaXMgQ01ZSyB8IEhleCB8IEhTTCB8IEhTViB8IExBQiB8IFJHQiB7XG5cdHJldHVybiAoXG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnY215aycgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdoZXgnIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnaHNsJyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2hzdicgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdsYWInIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAncmdiJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0lucHV0RWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwpOiBlbGVtZW50IGlzIEhUTUxFbGVtZW50IHtcblx0cmV0dXJuIGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBpc1N0b3JlZFBhbGV0dGUob2JqOiB1bmtub3duKTogb2JqIGlzIFN0b3JlZFBhbGV0dGUge1xuXHRpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgfHwgb2JqID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cblx0Y29uc3QgY2FuZGlkYXRlID0gb2JqIGFzIFBhcnRpYWw8U3RvcmVkUGFsZXR0ZT47XG5cblx0cmV0dXJuIChcblx0XHR0eXBlb2YgY2FuZGlkYXRlLnRhYmxlSUQgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mIGNhbmRpZGF0ZS5wYWxldHRlID09PSAnb2JqZWN0JyAmJlxuXHRcdEFycmF5LmlzQXJyYXkoY2FuZGlkYXRlLnBhbGV0dGUuaXRlbXMpICYmXG5cdFx0dHlwZW9mIGNhbmRpZGF0ZS5wYWxldHRlLmlkID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBuYXJyb3dUb0NvbG9yKFxuXHRjb2xvcjogQ29sb3IgfCBDb2xvcl9TdHJpbmdQcm9wc1xuKTogUHJvbWlzZTxDb2xvciB8IG51bGw+IHtcblx0aWYgKGlzQ29sb3JTdHJpbmcoY29sb3IpKSB7XG5cdFx0cmV0dXJuIGNvcmVVdGlscy5jb252ZXJ0LmNvbG9yU3RyaW5nVG9Db2xvcihjb2xvcik7XG5cdH1cblxuXHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCBhcyBDb2xvclNwYWNlRXh0ZW5kZWQpIHtcblx0XHRjYXNlICdjbXlrJzpcblx0XHRjYXNlICdoZXgnOlxuXHRcdGNhc2UgJ2hzbCc6XG5cdFx0Y2FzZSAnaHN2Jzpcblx0XHRjYXNlICdsYWInOlxuXHRcdGNhc2UgJ3NsJzpcblx0XHRjYXNlICdzdic6XG5cdFx0Y2FzZSAncmdiJzpcblx0XHRjYXNlICd4eXonOlxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG4vLyAqKioqKioqKiBTRUNUSU9OIDQ6IFRSQU5TRk9STSBVVElMUyAqKioqKioqKlxuXG5mdW5jdGlvbiBjb2xvclRvQ29sb3JTdHJpbmcoY29sb3I6IENvbG9yKTogQ29sb3JfU3RyaW5nUHJvcHMge1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ2NvbG9yVG9Db2xvclN0cmluZygpJztcblx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjb3JlVXRpbHMuYmFzZS5jbG9uZShjb2xvcik7XG5cblx0aWYgKGlzQ29sb3JTdHJpbmcoY2xvbmVkQ29sb3IpKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpIHtcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEFscmVhZHkgZm9ybWF0dGVkIGFzIGNvbG9yIHN0cmluZzogJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY2xvbmVkQ29sb3I7XG5cdH1cblxuXHRpZiAoaXNDTVlLQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKFxuXHRcdFx0Y2xvbmVkQ29sb3IudmFsdWVcblx0XHQpIGFzIENNWUtbJ3ZhbHVlJ107XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnY215aycsXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRjeWFuOiBgJHtuZXdWYWx1ZS5jeWFufSVgLFxuXHRcdFx0XHRtYWdlbnRhOiBgJHtuZXdWYWx1ZS5tYWdlbnRhfSVgLFxuXHRcdFx0XHR5ZWxsb3c6IGAke25ld1ZhbHVlLnllbGxvd30lYCxcblx0XHRcdFx0a2V5OiBgJHtuZXdWYWx1ZS5rZXl9JWAsXG5cdFx0XHRcdGFscGhhOiBgJHtuZXdWYWx1ZS5hbHBoYX1gXG5cdFx0XHR9IGFzIENNWUtfU3RyaW5nUHJvcHNbJ3ZhbHVlJ11cblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzSGV4KGNsb25lZENvbG9yKSkge1xuXHRcdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhcblx0XHRcdGNsb25lZENvbG9yLnZhbHVlXG5cdFx0KSBhcyBIZXhbJ3ZhbHVlJ107XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnaGV4Jyxcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGhleDogYCR7bmV3VmFsdWUuaGV4fWAsXG5cdFx0XHRcdGFscGhhOiBgJHtuZXdWYWx1ZS5hbHBoYX1gLFxuXHRcdFx0XHRudW1BbHBoYTogYCR7bmV3VmFsdWUubnVtQWxwaGF9YFxuXHRcdFx0fSBhcyBIZXhfU3RyaW5nUHJvcHNbJ3ZhbHVlJ11cblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzSFNMQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKFxuXHRcdFx0Y2xvbmVkQ29sb3IudmFsdWVcblx0XHQpIGFzIEhTTFsndmFsdWUnXTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdoc2wnLFxuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBgJHtuZXdWYWx1ZS5odWV9YCxcblx0XHRcdFx0c2F0dXJhdGlvbjogYCR7bmV3VmFsdWUuc2F0dXJhdGlvbn0lYCxcblx0XHRcdFx0bGlnaHRuZXNzOiBgJHtuZXdWYWx1ZS5saWdodG5lc3N9JWAsXG5cdFx0XHRcdGFscGhhOiBgJHtuZXdWYWx1ZS5hbHBoYX1gXG5cdFx0XHR9IGFzIEhTTF9TdHJpbmdQcm9wc1sndmFsdWUnXVxuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNIU1ZDb2xvcihjbG9uZWRDb2xvcikpIHtcblx0XHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoXG5cdFx0XHRjbG9uZWRDb2xvci52YWx1ZVxuXHRcdCkgYXMgSFNWWyd2YWx1ZSddO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2hzdicsXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6IGAke25ld1ZhbHVlLmh1ZX1gLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBgJHtuZXdWYWx1ZS5zYXR1cmF0aW9ufSVgLFxuXHRcdFx0XHR2YWx1ZTogYCR7bmV3VmFsdWUudmFsdWV9JWAsXG5cdFx0XHRcdGFscGhhOiBgJHtuZXdWYWx1ZS5hbHBoYX1gXG5cdFx0XHR9IGFzIEhTVl9TdHJpbmdQcm9wc1sndmFsdWUnXVxuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNMQUIoY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKFxuXHRcdFx0Y2xvbmVkQ29sb3IudmFsdWVcblx0XHQpIGFzIExBQlsndmFsdWUnXTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdsYWInLFxuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0bDogYCR7bmV3VmFsdWUubH1gLFxuXHRcdFx0XHRhOiBgJHtuZXdWYWx1ZS5hfWAsXG5cdFx0XHRcdGI6IGAke25ld1ZhbHVlLmJ9YCxcblx0XHRcdFx0YWxwaGE6IGAke25ld1ZhbHVlLmFscGhhfWBcblx0XHRcdH0gYXMgTEFCX1N0cmluZ1Byb3BzWyd2YWx1ZSddXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc1JHQihjbG9uZWRDb2xvcikpIHtcblx0XHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoXG5cdFx0XHRjbG9uZWRDb2xvci52YWx1ZVxuXHRcdCkgYXMgUkdCWyd2YWx1ZSddO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ3JnYicsXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRyZWQ6IGAke25ld1ZhbHVlLnJlZH1gLFxuXHRcdFx0XHRncmVlbjogYCR7bmV3VmFsdWUuZ3JlZW59YCxcblx0XHRcdFx0Ymx1ZTogYCR7bmV3VmFsdWUuYmx1ZX1gLFxuXHRcdFx0XHRhbHBoYTogYCR7bmV3VmFsdWUuYWxwaGF9YFxuXHRcdFx0fSBhcyBSR0JfU3RyaW5nUHJvcHNbJ3ZhbHVlJ11cblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzWFlaKGNsb25lZENvbG9yKSkge1xuXHRcdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhcblx0XHRcdGNsb25lZENvbG9yLnZhbHVlXG5cdFx0KSBhcyBYWVpbJ3ZhbHVlJ107XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAneHl6Jyxcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHg6IGAke25ld1ZhbHVlLnh9YCxcblx0XHRcdFx0eTogYCR7bmV3VmFsdWUueX1gLFxuXHRcdFx0XHR6OiBgJHtuZXdWYWx1ZS56fWAsXG5cdFx0XHRcdGFscGhhOiBgJHtuZXdWYWx1ZS5hbHBoYX1gXG5cdFx0XHR9IGFzIFhZWl9TdHJpbmdQcm9wc1sndmFsdWUnXVxuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0aWYgKCFtb2RlLmdyYWNlZnVsRXJyb3JzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGZvcm1hdDogJHtjbG9uZWRDb2xvci5mb3JtYXR9YCk7XG5cdFx0fSBlbHNlIGlmIChsb2dNb2RlLmVycm9yKSB7XG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBVbnN1cHBvcnRlZCBmb3JtYXQ6ICR7Y2xvbmVkQ29sb3IuZm9ybWF0fWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cdFx0fSBlbHNlIGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLndhcm4pIHtcblx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHQnRmFpbGVkIHRvIGNvbnZlcnQgdG8gY29sb3Igc3RyaW5nLicsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRlZmF1bHRzLmNvbG9ycy5zdHJpbmdzLmhzbDtcblx0fVxufVxuXG5mdW5jdGlvbiBmb3JtYXRQZXJjZW50YWdlVmFsdWVzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oXG5cdHZhbHVlOiBUXG4pOiBUIHtcblx0cmV0dXJuIE9iamVjdC5lbnRyaWVzKHZhbHVlKS5yZWR1Y2UoXG5cdFx0KGFjYywgW2tleSwgdmFsXSkgPT4ge1xuXHRcdFx0KGFjYyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilba2V5XSA9IFtcblx0XHRcdFx0J3NhdHVyYXRpb24nLFxuXHRcdFx0XHQnbGlnaHRuZXNzJyxcblx0XHRcdFx0J3ZhbHVlJyxcblx0XHRcdFx0J2N5YW4nLFxuXHRcdFx0XHQnbWFnZW50YScsXG5cdFx0XHRcdCd5ZWxsb3cnLFxuXHRcdFx0XHQna2V5J1xuXHRcdFx0XS5pbmNsdWRlcyhrZXkpXG5cdFx0XHRcdD8gYCR7dmFsfSVgXG5cdFx0XHRcdDogdmFsO1xuXHRcdFx0cmV0dXJuIGFjYztcblx0XHR9LFxuXHRcdHt9IGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+XG5cdCkgYXMgVDtcbn1cblxuZnVuY3Rpb24gZ2V0QWxwaGFGcm9tSGV4KGhleDogc3RyaW5nKTogbnVtYmVyIHtcblx0aWYgKGhleC5sZW5ndGggIT09IDkgfHwgIWhleC5zdGFydHNXaXRoKCcjJykpIHtcblx0XHRpZiAoIW1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdGBJbnZhbGlkIGhleCBjb2xvcjogJHtoZXh9LiBFeHBlY3RlZCBmb3JtYXQgI1JSR0dCQkFBYFxuXHRcdFx0KTtcblx0XHRlbHNlIGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgSW52YWxpZCBoZXggY29sb3I6ICR7aGV4fS4gRXhwZWN0ZWQgZm9ybWF0ICNSUkdHQkJBQWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gZ2V0QWxwaGFGcm9tSGV4KClgXG5cdFx0XHQpO1xuXHRcdGVsc2UgaWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUud2Fybilcblx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHQnRmFpbGVkIHRvIHBhcnNlIGFscGhhIGZyb20gaGV4IGNvbG9yLicsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gZ2V0QWxwaGFGcm9tSGV4KClgXG5cdFx0XHQpO1xuXHR9XG5cblx0Y29uc3QgYWxwaGFIZXggPSBoZXguc2xpY2UoLTIpO1xuXHRjb25zdCBhbHBoYURlY2ltYWwgPSBwYXJzZUludChhbHBoYUhleCwgMTYpO1xuXG5cdHJldHVybiBhbHBoYURlY2ltYWwgLyAyNTU7XG59XG5cbmZ1bmN0aW9uIGdldENvbG9yU3RyaW5nKGNvbG9yOiBDb2xvcik6IHN0cmluZyB8IG51bGwge1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ2dldENvbG9yU3RyaW5nKCknO1xuXG5cdHRyeSB7XG5cdFx0Y29uc3QgZm9ybWF0dGVycyA9IHtcblx0XHRcdGNteWs6IChjOiBDTVlLKSA9PlxuXHRcdFx0XHRgY215aygke2MudmFsdWUuY3lhbn0sICR7Yy52YWx1ZS5tYWdlbnRhfSwgJHtjLnZhbHVlLnllbGxvd30sICR7Yy52YWx1ZS5rZXl9LCAke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHRoZXg6IChjOiBIZXgpID0+IGMudmFsdWUuaGV4LFxuXHRcdFx0aHNsOiAoYzogSFNMKSA9PlxuXHRcdFx0XHRgaHNsKCR7Yy52YWx1ZS5odWV9LCAke2MudmFsdWUuc2F0dXJhdGlvbn0lLCAke2MudmFsdWUubGlnaHRuZXNzfSUsJHtjLnZhbHVlLmFscGhhfSlgLFxuXHRcdFx0aHN2OiAoYzogSFNWKSA9PlxuXHRcdFx0XHRgaHN2KCR7Yy52YWx1ZS5odWV9LCAke2MudmFsdWUuc2F0dXJhdGlvbn0lLCAke2MudmFsdWUudmFsdWV9JSwke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHRsYWI6IChjOiBMQUIpID0+XG5cdFx0XHRcdGBsYWIoJHtjLnZhbHVlLmx9LCAke2MudmFsdWUuYX0sICR7Yy52YWx1ZS5ifSwke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHRyZ2I6IChjOiBSR0IpID0+XG5cdFx0XHRcdGByZ2IoJHtjLnZhbHVlLnJlZH0sICR7Yy52YWx1ZS5ncmVlbn0sICR7Yy52YWx1ZS5ibHVlfSwke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHR4eXo6IChjOiBYWVopID0+XG5cdFx0XHRcdGB4eXooJHtjLnZhbHVlLnh9LCAke2MudmFsdWUueX0sICR7Yy52YWx1ZS56fSwke2MudmFsdWUuYWxwaGF9KWBcblx0XHR9O1xuXG5cdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5jbXlrKGNvbG9yKTtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmhleChjb2xvcik7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5oc2woY29sb3IpO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMuaHN2KGNvbG9yKTtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmxhYihjb2xvcik7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5yZ2IoY29sb3IpO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMueHl6KGNvbG9yKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGlmICghbG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHRgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0IGZvciAke2NvbG9yfWAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCFsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgZ2V0Q29sb3JTdHJpbmcgZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleEFscGhhVG9OdW1lcmljQWxwaGEoaGV4QWxwaGE6IHN0cmluZyk6IG51bWJlciB7XG5cdHJldHVybiBwYXJzZUludChoZXhBbHBoYSwgMTYpIC8gMjU1O1xufVxuXG5jb25zdCBwYXJzZUNvbG9yID0gKGNvbG9yU3BhY2U6IENvbG9yU3BhY2UsIHZhbHVlOiBzdHJpbmcpOiBDb2xvciB8IG51bGwgPT4ge1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ3BhcnNlQ29sb3InO1xuXG5cdHRyeSB7XG5cdFx0c3dpdGNoIChjb2xvclNwYWNlKSB7XG5cdFx0XHRjYXNlICdjbXlrJzoge1xuXHRcdFx0XHRjb25zdCBbYywgbSwgeSwgaywgYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDUpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGN5YW46IGNvcmVVdGlscy5icmFuZC5hc1BlcmNlbnRpbGUoYyksXG5cdFx0XHRcdFx0XHRtYWdlbnRhOiBjb3JlVXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKG0pLFxuXHRcdFx0XHRcdFx0eWVsbG93OiBjb3JlVXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKHkpLFxuXHRcdFx0XHRcdFx0a2V5OiBjb3JlVXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKGspLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGNvcmVVdGlscy5icmFuZC5hc0FscGhhUmFuZ2UoYSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRjb25zdCBoZXhWYWx1ZSA9IHZhbHVlLnN0YXJ0c1dpdGgoJyMnKSA/IHZhbHVlIDogYCMke3ZhbHVlfWA7XG5cdFx0XHRcdGNvbnN0IGFscGhhID0gaGV4VmFsdWUubGVuZ3RoID09PSA5ID8gaGV4VmFsdWUuc2xpY2UoLTIpIDogJ0ZGJztcblx0XHRcdFx0Y29uc3QgbnVtQWxwaGEgPSBoZXhBbHBoYVRvTnVtZXJpY0FscGhhKGFscGhhKTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRoZXg6IGNvcmVVdGlscy5icmFuZC5hc0hleFNldChoZXhWYWx1ZSksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZVV0aWxzLmJyYW5kLmFzSGV4Q29tcG9uZW50KGFscGhhKSxcblx0XHRcdFx0XHRcdG51bUFscGhhOiBjb3JlVXRpbHMuYnJhbmQuYXNBbHBoYVJhbmdlKG51bUFscGhhKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHR9O1xuXHRcdFx0Y2FzZSAnaHNsJzoge1xuXHRcdFx0XHRjb25zdCBbaCwgcywgbCwgYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGh1ZTogY29yZVV0aWxzLmJyYW5kLmFzUmFkaWFsKGgpLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogY29yZVV0aWxzLmJyYW5kLmFzUGVyY2VudGlsZShzKSxcblx0XHRcdFx0XHRcdGxpZ2h0bmVzczogY29yZVV0aWxzLmJyYW5kLmFzUGVyY2VudGlsZShsKSxcblx0XHRcdFx0XHRcdGFscGhhOiBjb3JlVXRpbHMuYnJhbmQuYXNBbHBoYVJhbmdlKGEpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdoc3YnOiB7XG5cdFx0XHRcdGNvbnN0IFtoLCBzLCB2LCBhXSA9IHBhcnNlQ29tcG9uZW50cyh2YWx1ZSwgNCk7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aHVlOiBjb3JlVXRpbHMuYnJhbmQuYXNSYWRpYWwoaCksXG5cdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBjb3JlVXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKHMpLFxuXHRcdFx0XHRcdFx0dmFsdWU6IGNvcmVVdGlscy5icmFuZC5hc1BlcmNlbnRpbGUodiksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZVV0aWxzLmJyYW5kLmFzQWxwaGFSYW5nZShhKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAnbGFiJzoge1xuXHRcdFx0XHRjb25zdCBbbCwgYSwgYiwgYWxwaGFdID0gcGFyc2VDb21wb25lbnRzKHZhbHVlLCA0KTtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0bDogY29yZVV0aWxzLmJyYW5kLmFzTEFCX0wobCksXG5cdFx0XHRcdFx0XHRhOiBjb3JlVXRpbHMuYnJhbmQuYXNMQUJfQShhKSxcblx0XHRcdFx0XHRcdGI6IGNvcmVVdGlscy5icmFuZC5hc0xBQl9CKGIpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGNvcmVVdGlscy5icmFuZC5hc0FscGhhUmFuZ2UoYWxwaGEpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdyZ2InOiB7XG5cdFx0XHRcdGNvbnN0IGNvbXBvbmVudHMgPSB2YWx1ZS5zcGxpdCgnLCcpLm1hcChOdW1iZXIpO1xuXG5cdFx0XHRcdGlmIChjb21wb25lbnRzLnNvbWUoaXNOYU4pKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBSR0IgZm9ybWF0Jyk7XG5cblx0XHRcdFx0Y29uc3QgW3IsIGcsIGIsIGFdID0gY29tcG9uZW50cztcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRyZWQ6IGNvcmVVdGlscy5icmFuZC5hc0J5dGVSYW5nZShyKSxcblx0XHRcdFx0XHRcdGdyZWVuOiBjb3JlVXRpbHMuYnJhbmQuYXNCeXRlUmFuZ2UoZyksXG5cdFx0XHRcdFx0XHRibHVlOiBjb3JlVXRpbHMuYnJhbmQuYXNCeXRlUmFuZ2UoYiksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZVV0aWxzLmJyYW5kLmFzQWxwaGFSYW5nZShhKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Y29uc3QgbWVzc2FnZSA9IGBVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQ6ICR7Y29sb3JTcGFjZX1gO1xuXG5cdFx0XHRcdGlmIChtb2RlLmdyYWNlZnVsRXJyb3JzKSB7XG5cdFx0XHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpIGxvZ2dlci5lcnJvcihtZXNzYWdlKTtcblx0XHRcdFx0XHRlbHNlIGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLndhcm4pXG5cdFx0XHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRcdFx0YEZhaWxlZCB0byBwYXJzZSBjb2xvcjogJHttZXNzYWdlfWAsXG5cdFx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgcGFyc2VDb2xvciBlcnJvcjogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn07XG5cbmZ1bmN0aW9uIHBhcnNlQ29tcG9uZW50cyh2YWx1ZTogc3RyaW5nLCBjb3VudDogbnVtYmVyKTogbnVtYmVyW10ge1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ3BhcnNlQ29tcG9uZW50cygpJztcblxuXHR0cnkge1xuXHRcdGNvbnN0IGNvbXBvbmVudHMgPSB2YWx1ZVxuXHRcdFx0LnNwbGl0KCcsJylcblx0XHRcdC5tYXAodmFsID0+XG5cdFx0XHRcdHZhbC50cmltKCkuZW5kc1dpdGgoJyUnKVxuXHRcdFx0XHRcdD8gcGFyc2VGbG9hdCh2YWwpXG5cdFx0XHRcdFx0OiBwYXJzZUZsb2F0KHZhbCkgKiAxMDBcblx0XHRcdCk7XG5cblx0XHRpZiAoY29tcG9uZW50cy5sZW5ndGggIT09IGNvdW50KVxuXHRcdFx0aWYgKCFtb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkICR7Y291bnR9IGNvbXBvbmVudHMuYCk7XG5cdFx0XHRlbHNlIGlmIChsb2dNb2RlLmVycm9yKSB7XG5cdFx0XHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLndhcm4pXG5cdFx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0XHRgRXhwZWN0ZWQgJHtjb3VudH0gY29tcG9uZW50cy5gLFxuXHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0fVxuXG5cdFx0cmV0dXJuIGNvbXBvbmVudHM7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBFcnJvciBwYXJzaW5nIGNvbXBvbmVudHM6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBbXTtcblx0fVxufVxuXG5mdW5jdGlvbiBwYXJzZUhleFdpdGhBbHBoYShoZXhWYWx1ZTogc3RyaW5nKTogSGV4Wyd2YWx1ZSddIHwgbnVsbCB7XG5cdGNvbnN0IGhleCA9IGhleFZhbHVlLnN0YXJ0c1dpdGgoJyMnKSA/IGhleFZhbHVlIDogYCMke2hleFZhbHVlfWA7XG5cdGNvbnN0IGFscGhhID0gaGV4Lmxlbmd0aCA9PT0gOSA/IGhleC5zbGljZSgtMikgOiAnRkYnO1xuXHRjb25zdCBudW1BbHBoYSA9IGhleEFscGhhVG9OdW1lcmljQWxwaGEoYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0aGV4OiBjb3JlVXRpbHMuYnJhbmQuYXNIZXhTZXQoaGV4KSxcblx0XHRhbHBoYTogY29yZVV0aWxzLmJyYW5kLmFzSGV4Q29tcG9uZW50KGFscGhhKSxcblx0XHRudW1BbHBoYTogY29yZVV0aWxzLmJyYW5kLmFzQWxwaGFSYW5nZShudW1BbHBoYSlcblx0fTtcbn1cblxuZnVuY3Rpb24gc3RyaXBIYXNoRnJvbUhleChoZXg6IEhleCk6IEhleCB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAnc3RyaXBIYXNoRnJvbUhleCgpJztcblxuXHR0cnkge1xuXHRcdGNvbnN0IGhleFN0cmluZyA9IGAke2hleC52YWx1ZS5oZXh9JHtoZXgudmFsdWUuYWxwaGF9YDtcblxuXHRcdHJldHVybiBoZXgudmFsdWUuaGV4LnN0YXJ0c1dpdGgoJyMnKVxuXHRcdFx0PyB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGhleDogY29yZVV0aWxzLmJyYW5kLmFzSGV4U2V0KGhleFN0cmluZy5zbGljZSgxKSksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZVV0aWxzLmJyYW5kLmFzSGV4Q29tcG9uZW50KFxuXHRcdFx0XHRcdFx0XHRTdHJpbmcoaGV4LnZhbHVlLmFscGhhKVxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdG51bUFscGhhOiBjb3JlVXRpbHMuYnJhbmQuYXNBbHBoYVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRoZXhBbHBoYVRvTnVtZXJpY0FscGhhKFN0cmluZyhoZXgudmFsdWUuYWxwaGEpKVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4JyBhcyAnaGV4J1xuXHRcdFx0XHR9XG5cdFx0XHQ6IGhleDtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YHN0cmlwSGFzaEZyb21IZXggZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdGNvbnN0IHVuYnJhbmRlZEhleCA9IGNvcmVVdGlscy5iYXNlLmNsb25lKFxuXHRcdFx0ZGVmYXVsdHMuY29sb3JzLmJhc2UudW5icmFuZGVkLmhleFxuXHRcdCk7XG5cblx0XHRyZXR1cm4gY29yZVV0aWxzLmJyYW5kQ29sb3IuYXNIZXgodW5icmFuZGVkSGV4KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzdHJpcFBlcmNlbnRGcm9tVmFsdWVzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBudW1iZXIgfCBzdHJpbmc+Pihcblx0dmFsdWU6IFRcbik6IHsgW0sgaW4ga2V5b2YgVF06IFRbS10gZXh0ZW5kcyBgJHtudW1iZXJ9JWAgPyBudW1iZXIgOiBUW0tdIH0ge1xuXHRyZXR1cm4gT2JqZWN0LmVudHJpZXModmFsdWUpLnJlZHVjZShcblx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHRjb25zdCBwYXJzZWRWYWx1ZSA9XG5cdFx0XHRcdHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIHZhbC5lbmRzV2l0aCgnJScpXG5cdFx0XHRcdFx0PyBwYXJzZUZsb2F0KHZhbC5zbGljZSgwLCAtMSkpXG5cdFx0XHRcdFx0OiB2YWw7XG5cdFx0XHRhY2Nba2V5IGFzIGtleW9mIFRdID0gcGFyc2VkVmFsdWUgYXMgVFtrZXlvZiBUXSBleHRlbmRzIGAke251bWJlcn0lYFxuXHRcdFx0XHQ/IG51bWJlclxuXHRcdFx0XHQ6IFRba2V5b2YgVF07XG5cdFx0XHRyZXR1cm4gYWNjO1xuXHRcdH0sXG5cdFx0e30gYXMgeyBbSyBpbiBrZXlvZiBUXTogVFtLXSBleHRlbmRzIGAke251bWJlcn0lYCA/IG51bWJlciA6IFRbS10gfVxuXHQpO1xufVxuXG5mdW5jdGlvbiB0b0hleFdpdGhBbHBoYShyZ2JWYWx1ZTogUkdCWyd2YWx1ZSddKTogc3RyaW5nIHtcblx0Y29uc3QgeyByZWQsIGdyZWVuLCBibHVlLCBhbHBoYSB9ID0gcmdiVmFsdWU7XG5cblx0Y29uc3QgaGV4ID0gYCMkeygoMSA8PCAyNCkgKyAocmVkIDw8IDE2KSArIChncmVlbiA8PCA4KSArIGJsdWUpXG5cdFx0LnRvU3RyaW5nKDE2KVxuXHRcdC5zbGljZSgxKX1gO1xuXHRjb25zdCBhbHBoYUhleCA9IE1hdGgucm91bmQoYWxwaGEgKiAyNTUpXG5cdFx0LnRvU3RyaW5nKDE2KVxuXHRcdC5wYWRTdGFydCgyLCAnMCcpO1xuXG5cdHJldHVybiBgJHtoZXh9JHthbHBoYUhleH1gO1xufVxuXG5leHBvcnQgY29uc3QgY29sb3JVdGlsczogQ29tbW9uRm5fTWFzdGVySW50ZXJmYWNlWyd1dGlscyddWydjb2xvciddID0ge1xuXHRjb2xvclRvQ29sb3JTdHJpbmcsXG5cdGVuc3VyZUhhc2gsXG5cdGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMsXG5cdGdldEFscGhhRnJvbUhleCxcblx0Z2V0Q29sb3JTdHJpbmcsXG5cdGhleEFscGhhVG9OdW1lcmljQWxwaGEsXG5cdGlzQ01ZS0NvbG9yLFxuXHRpc0NNWUtGb3JtYXQsXG5cdGlzQ01ZS1N0cmluZyxcblx0aXNDb2xvckZvcm1hdCxcblx0aXNDb2xvclN0cmluZyxcblx0aXNDb2xvclNwYWNlLFxuXHRpc0NvbG9yU3BhY2VFeHRlbmRlZCxcblx0aXNDb252ZXJ0aWJsZUNvbG9yLFxuXHRpc0Zvcm1hdCxcblx0aXNIZXgsXG5cdGlzSGV4Rm9ybWF0LFxuXHRpc0hTTENvbG9yLFxuXHRpc0hTTEZvcm1hdCxcblx0aXNIU0xTdHJpbmcsXG5cdGlzSW5wdXRFbGVtZW50LFxuXHRpc0hTVkNvbG9yLFxuXHRpc0hTVkZvcm1hdCxcblx0aXNIU1ZTdHJpbmcsXG5cdGlzTEFCLFxuXHRpc0xBQkZvcm1hdCxcblx0aXNSR0IsXG5cdGlzUkdCRm9ybWF0LFxuXHRpc1NMQ29sb3IsXG5cdGlzU0xGb3JtYXQsXG5cdGlzU0xTdHJpbmcsXG5cdGlzU3RvcmVkUGFsZXR0ZSxcblx0aXNTVkNvbG9yLFxuXHRpc1NWRm9ybWF0LFxuXHRpc1NWU3RyaW5nLFxuXHRpc1hZWixcblx0aXNYWVpGb3JtYXQsXG5cdG5hcnJvd1RvQ29sb3IsXG5cdHBhcnNlQ29sb3IsXG5cdHBhcnNlQ29tcG9uZW50cyxcblx0cGFyc2VIZXhXaXRoQWxwaGEsXG5cdHN0cmlwSGFzaEZyb21IZXgsXG5cdHN0cmlwUGVyY2VudEZyb21WYWx1ZXMsXG5cdHRvSGV4V2l0aEFscGhhXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgeyBoZXhBbHBoYVRvTnVtZXJpY0FscGhhLCBzdHJpcEhhc2hGcm9tSGV4IH07XG4iXX0=