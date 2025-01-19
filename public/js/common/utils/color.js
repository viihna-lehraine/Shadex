// File: src/common/utils/color.js
import { core } from '../core/index.js';
import { data } from '../../data/index.js';
import { log } from '../../classes/logger/index.js';
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
function colorToColorString(color) {
    const clonedColor = core.base.clone(color);
    if (isColorString(clonedColor)) {
        if (logMode.errors) {
            log.error(`Already formatted as color string: ${JSON.stringify(color)}`);
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
            log.error(`Unsupported format: ${clonedColor.format}`);
        }
        else if (!mode.quiet && logMode.warnings) {
            log.warning('Failed to convert to color string.');
        }
        return data.defaults.colorStrings.hsl;
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
            log.error(`Invalid hex color: ${hex}. Expected format #RRGGBBAA`);
        else if (!mode.quiet && logMode.warnings)
            log.warning('Failed to parse alpha from hex color.');
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
                    log.error(`Unsupported color format for ${color}`);
                return null;
        }
    }
    catch (error) {
        if (!logMode.errors)
            log.error(`getColorString error: ${error}`);
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
                        log.error(message);
                    else if (!mode.quiet && logMode.warnings)
                        log.warning(`Failed to parse color: ${message}`);
                }
                else {
                    throw new Error(message);
                }
                return null;
        }
    }
    catch (error) {
        if (logMode.errors)
            log.error(`parseColor error: ${error}`);
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
                    log.warning(`Expected ${count} components.`);
                return [];
            }
        return components;
    }
    catch (error) {
        if (logMode.errors)
            log.error(`Error parsing components: ${error}`);
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
            log.error(`stripHashFromHex error: ${error}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL3V0aWxzL2NvbG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGtDQUFrQztBQXdDbEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFFcEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN2QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBRTdCLGtEQUFrRDtBQUVsRCxTQUFTLGFBQWEsQ0FDckIsS0FBWSxFQUNaLE1BQW1CO0lBRW5CLE9BQU8sS0FBSyxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUM7QUFDaEMsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLEtBQWE7SUFDbEMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzRSxDQUFDO0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxLQUFhO0lBQzFDLE9BQU87UUFDTixNQUFNO1FBQ04sS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxJQUFJO1FBQ0osSUFBSTtRQUNKLEtBQUs7S0FDTCxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsS0FBYztJQUNwQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDakQsTUFBTSxXQUFXLEdBQUcsS0FBd0MsQ0FBQztRQUM3RCxN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VixVQUFVO0lBQ1YsS0FBSztJQUNMLFdBQVc7SUFDWCxhQUFhO0lBQ2IsVUFBVTtJQUNWLGVBQWU7SUFDZixpQkFBaUI7SUFDakIsZ0JBQWdCO0lBQ2hCLHNCQUFzQjtJQUN0QixjQUFjO0NBQ0wsQ0FBQztBQUVYLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2NvbW1vbi91dGlscy9jb2xvci5qc1xuXG5pbXBvcnQge1xuXHRDTVlLLFxuXHRDTVlLU3RyaW5nLFxuXHRDTVlLVmFsdWUsXG5cdENNWUtWYWx1ZVN0cmluZyxcblx0Q29sb3IsXG5cdENvbG9yU3BhY2UsXG5cdENvbG9yU3BhY2VFeHRlbmRlZCxcblx0Q29sb3JTdHJpbmcsXG5cdENvbW1vblV0aWxzRm5Db2xvcixcblx0Rm9ybWF0LFxuXHRIZXgsXG5cdEhleFN0cmluZyxcblx0SGV4VmFsdWUsXG5cdEhleFZhbHVlU3RyaW5nLFxuXHRIU0wsXG5cdEhTTFN0cmluZyxcblx0SFNMVmFsdWUsXG5cdEhTTFZhbHVlU3RyaW5nLFxuXHRIU1YsXG5cdEhTVlN0cmluZyxcblx0SFNWVmFsdWUsXG5cdEhTVlZhbHVlU3RyaW5nLFxuXHRMQUIsXG5cdExBQlZhbHVlLFxuXHRMQUJWYWx1ZVN0cmluZyxcblx0UkdCLFxuXHRSR0JWYWx1ZSxcblx0UkdCVmFsdWVTdHJpbmcsXG5cdFNMLFxuXHRTTFN0cmluZyxcblx0U3RvcmVkUGFsZXR0ZSxcblx0U1YsXG5cdFNWU3RyaW5nLFxuXHRYWVosXG5cdFhZWlZhbHVlLFxuXHRYWVpWYWx1ZVN0cmluZ1xufSBmcm9tICcuLi8uLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb3JlIH0gZnJvbSAnLi4vY29yZS9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vLi4vZGF0YS9pbmRleC5qcyc7XG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuLi8uLi9jbGFzc2VzL2xvZ2dlci9pbmRleC5qcyc7XG5cbmNvbnN0IG1vZGUgPSBkYXRhLm1vZGU7XG5jb25zdCBsb2dNb2RlID0gbW9kZS5sb2dnaW5nO1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDE6IFJvYnVzdCBUeXBlIEd1YXJkcyAqKioqKioqKlxuXG5mdW5jdGlvbiBpc0NvbG9yRm9ybWF0PFQgZXh0ZW5kcyBDb2xvcj4oXG5cdGNvbG9yOiBDb2xvcixcblx0Zm9ybWF0OiBUWydmb3JtYXQnXVxuKTogY29sb3IgaXMgVCB7XG5cdHJldHVybiBjb2xvci5mb3JtYXQgPT09IGZvcm1hdDtcbn1cblxuZnVuY3Rpb24gaXNDb2xvclNwYWNlKHZhbHVlOiBzdHJpbmcpOiB2YWx1ZSBpcyBDb2xvclNwYWNlIHtcblx0cmV0dXJuIFsnY215aycsICdoZXgnLCAnaHNsJywgJ2hzdicsICdsYWInLCAncmdiJywgJ3h5eiddLmluY2x1ZGVzKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gaXNDb2xvclNwYWNlRXh0ZW5kZWQodmFsdWU6IHN0cmluZyk6IHZhbHVlIGlzIENvbG9yU3BhY2VFeHRlbmRlZCB7XG5cdHJldHVybiBbXG5cdFx0J2NteWsnLFxuXHRcdCdoZXgnLFxuXHRcdCdoc2wnLFxuXHRcdCdoc3YnLFxuXHRcdCdsYWInLFxuXHRcdCdyZ2InLFxuXHRcdCdzbCcsXG5cdFx0J3N2Jyxcblx0XHQneHl6J1xuXHRdLmluY2x1ZGVzKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gaXNDb2xvclN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENvbG9yU3RyaW5nIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwpIHtcblx0XHRjb25zdCBjb2xvclN0cmluZyA9IHZhbHVlIGFzIEV4Y2x1ZGU8Q29sb3JTdHJpbmcsIEhleFN0cmluZz47XG5cdFx0Y29uc3QgdmFsaWRTdHJpbmdGb3JtYXRzOiBFeGNsdWRlPENvbG9yU3RyaW5nLCBIZXhTdHJpbmc+Wydmb3JtYXQnXVtdID1cblx0XHRcdFsnY215aycsICdoc2wnLCAnaHN2JywgJ2xhYicsICdyZ2InLCAnc2wnLCAnc3YnLCAneHl6J107XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0J3ZhbHVlJyBpbiBjb2xvclN0cmluZyAmJlxuXHRcdFx0J2Zvcm1hdCcgaW4gY29sb3JTdHJpbmcgJiZcblx0XHRcdHZhbGlkU3RyaW5nRm9ybWF0cy5pbmNsdWRlcyhjb2xvclN0cmluZy5mb3JtYXQpXG5cdFx0KTtcblx0fVxuXG5cdHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIC9eI1swLTlBLUZhLWZdezYsOH0kLy50ZXN0KHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gaXNGb3JtYXQoZm9ybWF0OiB1bmtub3duKTogZm9ybWF0IGlzIEZvcm1hdCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIGZvcm1hdCA9PT0gJ3N0cmluZycgJiZcblx0XHRbJ2NteWsnLCAnaGV4JywgJ2hzbCcsICdoc3YnLCAnbGFiJywgJ3JnYicsICdzbCcsICdzdicsICd4eXonXS5pbmNsdWRlcyhcblx0XHRcdGZvcm1hdFxuXHRcdClcblx0KTtcbn1cblxuLy8gKioqKioqKiogU0VDVElPTiAyOiBOYXJyb3cgVHlwZSBHdWFyZHMgKioqKioqKipcblxuZnVuY3Rpb24gaXNDTVlLQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDTVlLIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBDTVlLKS5mb3JtYXQgPT09ICdjbXlrJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUspLnZhbHVlLmN5YW4gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLKS52YWx1ZS5tYWdlbnRhID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZSykudmFsdWUueWVsbG93ID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZSykudmFsdWUua2V5ID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0NNWUtGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgQ01ZSyB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnY215aycpO1xufVxuXG5mdW5jdGlvbiBpc0NNWUtTdHJpbmcodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDTVlLU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHRpc0NvbG9yU3RyaW5nKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIENNWUtTdHJpbmcpLmZvcm1hdCA9PT0gJ2NteWsnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZS1N0cmluZykudmFsdWUuY3lhbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUtTdHJpbmcpLnZhbHVlLm1hZ2VudGEgPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLU3RyaW5nKS52YWx1ZS55ZWxsb3cgPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLU3RyaW5nKS52YWx1ZS5rZXkgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSGV4KHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgSGV4IHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBIZXgpLmZvcm1hdCA9PT0gJ2hleCcgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIZXgpLnZhbHVlLmhleCA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNIZXhGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgSGV4IHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdoZXgnKTtcbn1cblxuZnVuY3Rpb24gaXNIU0xDb2xvcih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhTTCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgSFNMKS5mb3JtYXQgPT09ICdoc2wnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMKS52YWx1ZS5odWUgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU0wpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU0wpLnZhbHVlLmxpZ2h0bmVzcyA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNIU0xGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgSFNMIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdoc2wnKTtcbn1cblxuZnVuY3Rpb24gaXNIU0xTdHJpbmcodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIU0xTdHJpbmcge1xuXHRyZXR1cm4gKFxuXHRcdGlzQ29sb3JTdHJpbmcodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgSFNMU3RyaW5nKS5mb3JtYXQgPT09ICdoc2wnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMU3RyaW5nKS52YWx1ZS5odWUgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU0xTdHJpbmcpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU0xTdHJpbmcpLnZhbHVlLmxpZ2h0bmVzcyA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNIU1ZDb2xvcih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhTViB7XG5cdHJldHVybiAoXG5cdFx0Y29yZS5ndWFyZHMuaXNDb2xvcih2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBIU1YpLmZvcm1hdCA9PT0gJ2hzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1YpLnZhbHVlLmh1ZSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVikudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVikudmFsdWUudmFsdWUgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNWRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIEhTViB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnaHN2Jyk7XG59XG5cbmZ1bmN0aW9uIGlzSFNWU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgSFNWU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHRpc0NvbG9yU3RyaW5nKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIEhTVlN0cmluZykuZm9ybWF0ID09PSAnaHN2JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVlN0cmluZykudmFsdWUuaHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNWU3RyaW5nKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNWU3RyaW5nKS52YWx1ZS52YWx1ZSA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNMQUIodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBMQUIge1xuXHRyZXR1cm4gKFxuXHRcdGNvcmUuZ3VhcmRzLmlzQ29sb3IodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgTEFCKS5mb3JtYXQgPT09ICdsYWInICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgTEFCKS52YWx1ZS5sID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgTEFCKS52YWx1ZS5hID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgTEFCKS52YWx1ZS5iID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0xBQkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBMQUIge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2xhYicpO1xufVxuXG5mdW5jdGlvbiBpc1JHQih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFJHQiB7XG5cdHJldHVybiAoXG5cdFx0Y29yZS5ndWFyZHMuaXNDb2xvcih2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBSR0IpLmZvcm1hdCA9PT0gJ3JnYicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBSR0IpLnZhbHVlLnJlZCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFJHQikudmFsdWUuZ3JlZW4gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBSR0IpLnZhbHVlLmJsdWUgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzUkdCRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIFJHQiB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAncmdiJyk7XG59XG5cbmZ1bmN0aW9uIGlzU0xDb2xvcih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFNMIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBTTCkuZm9ybWF0ID09PSAnc2wnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU0wpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTTCkudmFsdWUubGlnaHRuZXNzID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1NMRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIFNMIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdzbCcpO1xufVxuXG5mdW5jdGlvbiBpc1NMU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgU0xTdHJpbmcge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFNMU3RyaW5nKS5mb3JtYXQgPT09ICdzbCcgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTTFN0cmluZykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNMU3RyaW5nKS52YWx1ZS5saWdodG5lc3MgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzU1ZDb2xvcih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFNWIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBTVikuZm9ybWF0ID09PSAnc3YnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU1YpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTVikudmFsdWUudmFsdWUgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzU1ZGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgU1Yge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ3N2Jyk7XG59XG5cbmZ1bmN0aW9uIGlzU1ZTdHJpbmcodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBTVlN0cmluZyB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgU1ZTdHJpbmcpLmZvcm1hdCA9PT0gJ3N2JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNWU3RyaW5nKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU1ZTdHJpbmcpLnZhbHVlLnZhbHVlID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1hZWih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFhZWiB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgWFlaKS5mb3JtYXQgPT09ICd4eXonICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgWFlaKS52YWx1ZS54ID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgWFlaKS52YWx1ZS55ID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgWFlaKS52YWx1ZS56ID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1hZWkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBYWVoge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ3h5eicpO1xufVxuXG4vLyAqKioqKiBTRUNUSU9OIDM6IFV0aWxpdHkgR3VhcmRzICoqKioqXG5cbmZ1bmN0aW9uIGVuc3VyZUhhc2godmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG5cdHJldHVybiB2YWx1ZS5zdGFydHNXaXRoKCcjJykgPyB2YWx1ZSA6IGAjJHt2YWx1ZX1gO1xufVxuXG5mdW5jdGlvbiBpc0NvbnZlcnRpYmxlQ29sb3IoXG5cdGNvbG9yOiBDb2xvclxuKTogY29sb3IgaXMgQ01ZSyB8IEhleCB8IEhTTCB8IEhTViB8IExBQiB8IFJHQiB7XG5cdHJldHVybiAoXG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnY215aycgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdoZXgnIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnaHNsJyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2hzdicgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdsYWInIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAncmdiJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0lucHV0RWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwpOiBlbGVtZW50IGlzIEhUTUxFbGVtZW50IHtcblx0cmV0dXJuIGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBpc1N0b3JlZFBhbGV0dGUob2JqOiB1bmtub3duKTogb2JqIGlzIFN0b3JlZFBhbGV0dGUge1xuXHRpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgfHwgb2JqID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cblx0Y29uc3QgY2FuZGlkYXRlID0gb2JqIGFzIFBhcnRpYWw8U3RvcmVkUGFsZXR0ZT47XG5cblx0cmV0dXJuIChcblx0XHR0eXBlb2YgY2FuZGlkYXRlLnRhYmxlSUQgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mIGNhbmRpZGF0ZS5wYWxldHRlID09PSAnb2JqZWN0JyAmJlxuXHRcdEFycmF5LmlzQXJyYXkoY2FuZGlkYXRlLnBhbGV0dGUuaXRlbXMpICYmXG5cdFx0dHlwZW9mIGNhbmRpZGF0ZS5wYWxldHRlLmlkID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBuYXJyb3dUb0NvbG9yKGNvbG9yOiBDb2xvciB8IENvbG9yU3RyaW5nKTogQ29sb3IgfCBudWxsIHtcblx0aWYgKGlzQ29sb3JTdHJpbmcoY29sb3IpKSB7XG5cdFx0cmV0dXJuIGNvcmUuY29udmVydC50b0NvbG9yKGNvbG9yKTtcblx0fVxuXG5cdHN3aXRjaCAoY29sb3IuZm9ybWF0IGFzIENvbG9yU3BhY2VFeHRlbmRlZCkge1xuXHRcdGNhc2UgJ2NteWsnOlxuXHRcdGNhc2UgJ2hleCc6XG5cdFx0Y2FzZSAnaHNsJzpcblx0XHRjYXNlICdoc3YnOlxuXHRcdGNhc2UgJ2xhYic6XG5cdFx0Y2FzZSAnc2wnOlxuXHRcdGNhc2UgJ3N2Jzpcblx0XHRjYXNlICdyZ2InOlxuXHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbi8vICoqKioqKioqIFNFQ1RJT04gNDogVFJBTlNGT1JNIFVUSUxTICoqKioqKioqXG5cbmZ1bmN0aW9uIGNvbG9yVG9Db2xvclN0cmluZyhjb2xvcjogQ29sb3IpOiBDb2xvclN0cmluZyB7XG5cdGNvbnN0IGNsb25lZENvbG9yID0gY29yZS5iYXNlLmNsb25lKGNvbG9yKTtcblxuXHRpZiAoaXNDb2xvclN0cmluZyhjbG9uZWRDb2xvcikpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcnMpIHtcblx0XHRcdGxvZy5lcnJvcihcblx0XHRcdFx0YEFscmVhZHkgZm9ybWF0dGVkIGFzIGNvbG9yIHN0cmluZzogJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY2xvbmVkQ29sb3I7XG5cdH1cblxuXHRpZiAoaXNDTVlLQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKGNsb25lZENvbG9yLnZhbHVlKSBhcyBDTVlLVmFsdWU7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnY215aycsXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRjeWFuOiBgJHtuZXdWYWx1ZS5jeWFufSVgLFxuXHRcdFx0XHRtYWdlbnRhOiBgJHtuZXdWYWx1ZS5tYWdlbnRhfSVgLFxuXHRcdFx0XHR5ZWxsb3c6IGAke25ld1ZhbHVlLnllbGxvd30lYCxcblx0XHRcdFx0a2V5OiBgJHtuZXdWYWx1ZS5rZXl9JWAsXG5cdFx0XHRcdGFscGhhOiBgJHtuZXdWYWx1ZS5hbHBoYX1gXG5cdFx0XHR9IGFzIENNWUtWYWx1ZVN0cmluZ1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNIZXgoY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKGNsb25lZENvbG9yLnZhbHVlKSBhcyBIZXhWYWx1ZTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdoZXgnLFxuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aGV4OiBgJHtuZXdWYWx1ZS5oZXh9YCxcblx0XHRcdFx0YWxwaGE6IGAke25ld1ZhbHVlLmFscGhhfWAsXG5cdFx0XHRcdG51bUFscGhhOiBgJHtuZXdWYWx1ZS5udW1BbHBoYX1gXG5cdFx0XHR9IGFzIEhleFZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc0hTTENvbG9yKGNsb25lZENvbG9yKSkge1xuXHRcdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhjbG9uZWRDb2xvci52YWx1ZSkgYXMgSFNMVmFsdWU7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnaHNsJyxcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogYCR7bmV3VmFsdWUuaHVlfWAsXG5cdFx0XHRcdHNhdHVyYXRpb246IGAke25ld1ZhbHVlLnNhdHVyYXRpb259JWAsXG5cdFx0XHRcdGxpZ2h0bmVzczogYCR7bmV3VmFsdWUubGlnaHRuZXNzfSVgLFxuXHRcdFx0XHRhbHBoYTogYCR7bmV3VmFsdWUuYWxwaGF9YFxuXHRcdFx0fSBhcyBIU0xWYWx1ZVN0cmluZ1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNIU1ZDb2xvcihjbG9uZWRDb2xvcikpIHtcblx0XHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoY2xvbmVkQ29sb3IudmFsdWUpIGFzIEhTVlZhbHVlO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2hzdicsXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6IGAke25ld1ZhbHVlLmh1ZX1gLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBgJHtuZXdWYWx1ZS5zYXR1cmF0aW9ufSVgLFxuXHRcdFx0XHR2YWx1ZTogYCR7bmV3VmFsdWUudmFsdWV9JWAsXG5cdFx0XHRcdGFscGhhOiBgJHtuZXdWYWx1ZS5hbHBoYX1gXG5cdFx0XHR9IGFzIEhTVlZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc0xBQihjbG9uZWRDb2xvcikpIHtcblx0XHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoY2xvbmVkQ29sb3IudmFsdWUpIGFzIExBQlZhbHVlO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2xhYicsXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRsOiBgJHtuZXdWYWx1ZS5sfWAsXG5cdFx0XHRcdGE6IGAke25ld1ZhbHVlLmF9YCxcblx0XHRcdFx0YjogYCR7bmV3VmFsdWUuYn1gLFxuXHRcdFx0XHRhbHBoYTogYCR7bmV3VmFsdWUuYWxwaGF9YFxuXHRcdFx0fSBhcyBMQUJWYWx1ZVN0cmluZ1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNSR0IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKGNsb25lZENvbG9yLnZhbHVlKSBhcyBSR0JWYWx1ZTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdyZ2InLFxuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0cmVkOiBgJHtuZXdWYWx1ZS5yZWR9YCxcblx0XHRcdFx0Z3JlZW46IGAke25ld1ZhbHVlLmdyZWVufWAsXG5cdFx0XHRcdGJsdWU6IGAke25ld1ZhbHVlLmJsdWV9YCxcblx0XHRcdFx0YWxwaGE6IGAke25ld1ZhbHVlLmFscGhhfWBcblx0XHRcdH0gYXMgUkdCVmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzWFlaKGNsb25lZENvbG9yKSkge1xuXHRcdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhjbG9uZWRDb2xvci52YWx1ZSkgYXMgWFlaVmFsdWU7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAneHl6Jyxcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHg6IGAke25ld1ZhbHVlLnh9YCxcblx0XHRcdFx0eTogYCR7bmV3VmFsdWUueX1gLFxuXHRcdFx0XHR6OiBgJHtuZXdWYWx1ZS56fWAsXG5cdFx0XHRcdGFscGhhOiBgJHtuZXdWYWx1ZS5hbHBoYX1gXG5cdFx0XHR9IGFzIFhZWlZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRpZiAoIW1vZGUuZ3JhY2VmdWxFcnJvcnMpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZm9ybWF0OiAke2Nsb25lZENvbG9yLmZvcm1hdH1gKTtcblx0XHR9IGVsc2UgaWYgKGxvZ01vZGUuZXJyb3JzKSB7XG5cdFx0XHRsb2cuZXJyb3IoYFVuc3VwcG9ydGVkIGZvcm1hdDogJHtjbG9uZWRDb2xvci5mb3JtYXR9YCk7XG5cdFx0fSBlbHNlIGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLndhcm5pbmdzKSB7XG5cdFx0XHRsb2cud2FybmluZygnRmFpbGVkIHRvIGNvbnZlcnQgdG8gY29sb3Igc3RyaW5nLicpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkYXRhLmRlZmF1bHRzLmNvbG9yU3RyaW5ncy5oc2w7XG5cdH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0UGVyY2VudGFnZVZhbHVlczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4+KFxuXHR2YWx1ZTogVFxuKTogVCB7XG5cdHJldHVybiBPYmplY3QuZW50cmllcyh2YWx1ZSkucmVkdWNlKFxuXHRcdChhY2MsIFtrZXksIHZhbF0pID0+IHtcblx0XHRcdChhY2MgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pW2tleV0gPSBbXG5cdFx0XHRcdCdzYXR1cmF0aW9uJyxcblx0XHRcdFx0J2xpZ2h0bmVzcycsXG5cdFx0XHRcdCd2YWx1ZScsXG5cdFx0XHRcdCdjeWFuJyxcblx0XHRcdFx0J21hZ2VudGEnLFxuXHRcdFx0XHQneWVsbG93Jyxcblx0XHRcdFx0J2tleSdcblx0XHRcdF0uaW5jbHVkZXMoa2V5KVxuXHRcdFx0XHQ/IGAke3ZhbH0lYFxuXHRcdFx0XHQ6IHZhbDtcblx0XHRcdHJldHVybiBhY2M7XG5cdFx0fSxcblx0XHR7fSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuXHQpIGFzIFQ7XG59XG5cbmZ1bmN0aW9uIGdldEFscGhhRnJvbUhleChoZXg6IHN0cmluZyk6IG51bWJlciB7XG5cdGlmIChoZXgubGVuZ3RoICE9PSA5IHx8ICFoZXguc3RhcnRzV2l0aCgnIycpKSB7XG5cdFx0aWYgKCFtb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRgSW52YWxpZCBoZXggY29sb3I6ICR7aGV4fS4gRXhwZWN0ZWQgZm9ybWF0ICNSUkdHQkJBQWBcblx0XHRcdCk7XG5cdFx0ZWxzZSBpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRsb2cuZXJyb3IoYEludmFsaWQgaGV4IGNvbG9yOiAke2hleH0uIEV4cGVjdGVkIGZvcm1hdCAjUlJHR0JCQUFgKTtcblx0XHRlbHNlIGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLndhcm5pbmdzKVxuXHRcdFx0bG9nLndhcm5pbmcoJ0ZhaWxlZCB0byBwYXJzZSBhbHBoYSBmcm9tIGhleCBjb2xvci4nKTtcblx0fVxuXG5cdGNvbnN0IGFscGhhSGV4ID0gaGV4LnNsaWNlKC0yKTtcblx0Y29uc3QgYWxwaGFEZWNpbWFsID0gcGFyc2VJbnQoYWxwaGFIZXgsIDE2KTtcblxuXHRyZXR1cm4gYWxwaGFEZWNpbWFsIC8gMjU1O1xufVxuXG5mdW5jdGlvbiBnZXRDb2xvclN0cmluZyhjb2xvcjogQ29sb3IpOiBzdHJpbmcgfCBudWxsIHtcblx0dHJ5IHtcblx0XHRjb25zdCBmb3JtYXR0ZXJzID0ge1xuXHRcdFx0Y215azogKGM6IENNWUspID0+XG5cdFx0XHRcdGBjbXlrKCR7Yy52YWx1ZS5jeWFufSwgJHtjLnZhbHVlLm1hZ2VudGF9LCAke2MudmFsdWUueWVsbG93fSwgJHtjLnZhbHVlLmtleX0sICR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdGhleDogKGM6IEhleCkgPT4gYy52YWx1ZS5oZXgsXG5cdFx0XHRoc2w6IChjOiBIU0wpID0+XG5cdFx0XHRcdGBoc2woJHtjLnZhbHVlLmh1ZX0sICR7Yy52YWx1ZS5zYXR1cmF0aW9ufSUsICR7Yy52YWx1ZS5saWdodG5lc3N9JSwke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHRoc3Y6IChjOiBIU1YpID0+XG5cdFx0XHRcdGBoc3YoJHtjLnZhbHVlLmh1ZX0sICR7Yy52YWx1ZS5zYXR1cmF0aW9ufSUsICR7Yy52YWx1ZS52YWx1ZX0lLCR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdGxhYjogKGM6IExBQikgPT5cblx0XHRcdFx0YGxhYigke2MudmFsdWUubH0sICR7Yy52YWx1ZS5hfSwgJHtjLnZhbHVlLmJ9LCR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdHJnYjogKGM6IFJHQikgPT5cblx0XHRcdFx0YHJnYigke2MudmFsdWUucmVkfSwgJHtjLnZhbHVlLmdyZWVufSwgJHtjLnZhbHVlLmJsdWV9LCR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdHh5ejogKGM6IFhZWikgPT5cblx0XHRcdFx0YHh5eigke2MudmFsdWUueH0sICR7Yy52YWx1ZS55fSwgJHtjLnZhbHVlLnp9LCR7Yy52YWx1ZS5hbHBoYX0pYFxuXHRcdH07XG5cblx0XHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmNteWsoY29sb3IpO1xuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMuaGV4KGNvbG9yKTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmhzbChjb2xvcik7XG5cdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5oc3YoY29sb3IpO1xuXHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMubGFiKGNvbG9yKTtcblx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLnJnYihjb2xvcik7XG5cdFx0XHRjYXNlICd4eXonOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy54eXooY29sb3IpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0aWYgKCFsb2dNb2RlLmVycm9ycylcblx0XHRcdFx0XHRsb2cuZXJyb3IoYFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdCBmb3IgJHtjb2xvcn1gKTtcblxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCFsb2dNb2RlLmVycm9ycykgbG9nLmVycm9yKGBnZXRDb2xvclN0cmluZyBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleEFscGhhVG9OdW1lcmljQWxwaGEoaGV4QWxwaGE6IHN0cmluZyk6IG51bWJlciB7XG5cdHJldHVybiBwYXJzZUludChoZXhBbHBoYSwgMTYpIC8gMjU1O1xufVxuXG5jb25zdCBwYXJzZUNvbG9yID0gKGNvbG9yU3BhY2U6IENvbG9yU3BhY2UsIHZhbHVlOiBzdHJpbmcpOiBDb2xvciB8IG51bGwgPT4ge1xuXHR0cnkge1xuXHRcdHN3aXRjaCAoY29sb3JTcGFjZSkge1xuXHRcdFx0Y2FzZSAnY215ayc6IHtcblx0XHRcdFx0Y29uc3QgW2MsIG0sIHksIGssIGFdID0gcGFyc2VDb21wb25lbnRzKHZhbHVlLCA1KTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRjeWFuOiBjb3JlLmJyYW5kLmFzUGVyY2VudGlsZShjKSxcblx0XHRcdFx0XHRcdG1hZ2VudGE6IGNvcmUuYnJhbmQuYXNQZXJjZW50aWxlKG0pLFxuXHRcdFx0XHRcdFx0eWVsbG93OiBjb3JlLmJyYW5kLmFzUGVyY2VudGlsZSh5KSxcblx0XHRcdFx0XHRcdGtleTogY29yZS5icmFuZC5hc1BlcmNlbnRpbGUoayksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZS5icmFuZC5hc0FscGhhUmFuZ2UoYSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRjb25zdCBoZXhWYWx1ZSA9IHZhbHVlLnN0YXJ0c1dpdGgoJyMnKSA/IHZhbHVlIDogYCMke3ZhbHVlfWA7XG5cdFx0XHRcdGNvbnN0IGFscGhhID0gaGV4VmFsdWUubGVuZ3RoID09PSA5ID8gaGV4VmFsdWUuc2xpY2UoLTIpIDogJ0ZGJztcblx0XHRcdFx0Y29uc3QgbnVtQWxwaGEgPSBoZXhBbHBoYVRvTnVtZXJpY0FscGhhKGFscGhhKTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRoZXg6IGNvcmUuYnJhbmQuYXNIZXhTZXQoaGV4VmFsdWUpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGNvcmUuYnJhbmQuYXNIZXhDb21wb25lbnQoYWxwaGEpLFxuXHRcdFx0XHRcdFx0bnVtQWxwaGE6IGNvcmUuYnJhbmQuYXNBbHBoYVJhbmdlKG51bUFscGhhKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHR9O1xuXHRcdFx0Y2FzZSAnaHNsJzoge1xuXHRcdFx0XHRjb25zdCBbaCwgcywgbCwgYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGh1ZTogY29yZS5icmFuZC5hc1JhZGlhbChoKSxcblx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGNvcmUuYnJhbmQuYXNQZXJjZW50aWxlKHMpLFxuXHRcdFx0XHRcdFx0bGlnaHRuZXNzOiBjb3JlLmJyYW5kLmFzUGVyY2VudGlsZShsKSxcblx0XHRcdFx0XHRcdGFscGhhOiBjb3JlLmJyYW5kLmFzQWxwaGFSYW5nZShhKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAnaHN2Jzoge1xuXHRcdFx0XHRjb25zdCBbaCwgcywgdiwgYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGh1ZTogY29yZS5icmFuZC5hc1JhZGlhbChoKSxcblx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGNvcmUuYnJhbmQuYXNQZXJjZW50aWxlKHMpLFxuXHRcdFx0XHRcdFx0dmFsdWU6IGNvcmUuYnJhbmQuYXNQZXJjZW50aWxlKHYpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGNvcmUuYnJhbmQuYXNBbHBoYVJhbmdlKGEpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdsYWInOiB7XG5cdFx0XHRcdGNvbnN0IFtsLCBhLCBiLCBhbHBoYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRsOiBjb3JlLmJyYW5kLmFzTEFCX0wobCksXG5cdFx0XHRcdFx0XHRhOiBjb3JlLmJyYW5kLmFzTEFCX0EoYSksXG5cdFx0XHRcdFx0XHRiOiBjb3JlLmJyYW5kLmFzTEFCX0IoYiksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZS5icmFuZC5hc0FscGhhUmFuZ2UoYWxwaGEpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdyZ2InOiB7XG5cdFx0XHRcdGNvbnN0IGNvbXBvbmVudHMgPSB2YWx1ZS5zcGxpdCgnLCcpLm1hcChOdW1iZXIpO1xuXG5cdFx0XHRcdGlmIChjb21wb25lbnRzLnNvbWUoaXNOYU4pKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBSR0IgZm9ybWF0Jyk7XG5cblx0XHRcdFx0Y29uc3QgW3IsIGcsIGIsIGFdID0gY29tcG9uZW50cztcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRyZWQ6IGNvcmUuYnJhbmQuYXNCeXRlUmFuZ2UociksXG5cdFx0XHRcdFx0XHRncmVlbjogY29yZS5icmFuZC5hc0J5dGVSYW5nZShnKSxcblx0XHRcdFx0XHRcdGJsdWU6IGNvcmUuYnJhbmQuYXNCeXRlUmFuZ2UoYiksXG5cdFx0XHRcdFx0XHRhbHBoYTogY29yZS5icmFuZC5hc0FscGhhUmFuZ2UoYSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGNvbnN0IG1lc3NhZ2UgPSBgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yU3BhY2V9YDtcblxuXHRcdFx0XHRpZiAobW9kZS5ncmFjZWZ1bEVycm9ycykge1xuXHRcdFx0XHRcdGlmIChsb2dNb2RlLmVycm9ycykgbG9nLmVycm9yKG1lc3NhZ2UpO1xuXHRcdFx0XHRcdGVsc2UgaWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUud2FybmluZ3MpXG5cdFx0XHRcdFx0XHRsb2cud2FybmluZyhgRmFpbGVkIHRvIHBhcnNlIGNvbG9yOiAke21lc3NhZ2V9YCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9ycykgbG9nLmVycm9yKGBwYXJzZUNvbG9yIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn07XG5cbmZ1bmN0aW9uIHBhcnNlQ29tcG9uZW50cyh2YWx1ZTogc3RyaW5nLCBjb3VudDogbnVtYmVyKTogbnVtYmVyW10ge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNvbXBvbmVudHMgPSB2YWx1ZVxuXHRcdFx0LnNwbGl0KCcsJylcblx0XHRcdC5tYXAodmFsID0+XG5cdFx0XHRcdHZhbC50cmltKCkuZW5kc1dpdGgoJyUnKVxuXHRcdFx0XHRcdD8gcGFyc2VGbG9hdCh2YWwpXG5cdFx0XHRcdFx0OiBwYXJzZUZsb2F0KHZhbCkgKiAxMDBcblx0XHRcdCk7XG5cblx0XHRpZiAoY29tcG9uZW50cy5sZW5ndGggIT09IGNvdW50KVxuXHRcdFx0aWYgKCFtb2RlLmdyYWNlZnVsRXJyb3JzKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkICR7Y291bnR9IGNvbXBvbmVudHMuYCk7XG5cdFx0XHRlbHNlIGlmIChsb2dNb2RlLmVycm9ycykge1xuXHRcdFx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbG9nTW9kZS53YXJuaW5ncylcblx0XHRcdFx0XHRsb2cud2FybmluZyhgRXhwZWN0ZWQgJHtjb3VudH0gY29tcG9uZW50cy5gKTtcblxuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9XG5cblx0XHRyZXR1cm4gY29tcG9uZW50cztcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcnMpIGxvZy5lcnJvcihgRXJyb3IgcGFyc2luZyBjb21wb25lbnRzOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIFtdO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHBhcnNlSGV4V2l0aEFscGhhKGhleFZhbHVlOiBzdHJpbmcpOiBIZXhWYWx1ZSB8IG51bGwge1xuXHRjb25zdCBoZXggPSBoZXhWYWx1ZS5zdGFydHNXaXRoKCcjJykgPyBoZXhWYWx1ZSA6IGAjJHtoZXhWYWx1ZX1gO1xuXHRjb25zdCBhbHBoYSA9IGhleC5sZW5ndGggPT09IDkgPyBoZXguc2xpY2UoLTIpIDogJ0ZGJztcblx0Y29uc3QgbnVtQWxwaGEgPSBoZXhBbHBoYVRvTnVtZXJpY0FscGhhKGFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdGhleDogY29yZS5icmFuZC5hc0hleFNldChoZXgpLFxuXHRcdGFscGhhOiBjb3JlLmJyYW5kLmFzSGV4Q29tcG9uZW50KGFscGhhKSxcblx0XHRudW1BbHBoYTogY29yZS5icmFuZC5hc0FscGhhUmFuZ2UobnVtQWxwaGEpXG5cdH07XG59XG5cbmZ1bmN0aW9uIHN0cmlwSGFzaEZyb21IZXgoaGV4OiBIZXgpOiBIZXgge1xuXHR0cnkge1xuXHRcdGNvbnN0IGhleFN0cmluZyA9IGAke2hleC52YWx1ZS5oZXh9JHtoZXgudmFsdWUuYWxwaGF9YDtcblxuXHRcdHJldHVybiBoZXgudmFsdWUuaGV4LnN0YXJ0c1dpdGgoJyMnKVxuXHRcdFx0PyB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGhleDogY29yZS5icmFuZC5hc0hleFNldChoZXhTdHJpbmcuc2xpY2UoMSkpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGNvcmUuYnJhbmQuYXNIZXhDb21wb25lbnQoXG5cdFx0XHRcdFx0XHRcdFN0cmluZyhoZXgudmFsdWUuYWxwaGEpXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0bnVtQWxwaGE6IGNvcmUuYnJhbmQuYXNBbHBoYVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRoZXhBbHBoYVRvTnVtZXJpY0FscGhhKFN0cmluZyhoZXgudmFsdWUuYWxwaGEpKVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4JyBhcyAnaGV4J1xuXHRcdFx0XHR9XG5cdFx0XHQ6IGhleDtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcnMpIGxvZy5lcnJvcihgc3RyaXBIYXNoRnJvbUhleCBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdGNvbnN0IHVuYnJhbmRlZEhleCA9IGNvcmUuYmFzZS5jbG9uZShkYXRhLmRlZmF1bHRzLmNvbG9ycy5oZXgpO1xuXG5cdFx0cmV0dXJuIGNvcmUuYnJhbmRDb2xvci5hc0hleCh1bmJyYW5kZWRIZXgpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHN0cmlwUGVyY2VudEZyb21WYWx1ZXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIG51bWJlciB8IHN0cmluZz4+KFxuXHR2YWx1ZTogVFxuKTogeyBbSyBpbiBrZXlvZiBUXTogVFtLXSBleHRlbmRzIGAke251bWJlcn0lYCA/IG51bWJlciA6IFRbS10gfSB7XG5cdHJldHVybiBPYmplY3QuZW50cmllcyh2YWx1ZSkucmVkdWNlKFxuXHRcdChhY2MsIFtrZXksIHZhbF0pID0+IHtcblx0XHRcdGNvbnN0IHBhcnNlZFZhbHVlID1cblx0XHRcdFx0dHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgdmFsLmVuZHNXaXRoKCclJylcblx0XHRcdFx0XHQ/IHBhcnNlRmxvYXQodmFsLnNsaWNlKDAsIC0xKSlcblx0XHRcdFx0XHQ6IHZhbDtcblx0XHRcdGFjY1trZXkgYXMga2V5b2YgVF0gPSBwYXJzZWRWYWx1ZSBhcyBUW2tleW9mIFRdIGV4dGVuZHMgYCR7bnVtYmVyfSVgXG5cdFx0XHRcdD8gbnVtYmVyXG5cdFx0XHRcdDogVFtrZXlvZiBUXTtcblx0XHRcdHJldHVybiBhY2M7XG5cdFx0fSxcblx0XHR7fSBhcyB7IFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgYCR7bnVtYmVyfSVgID8gbnVtYmVyIDogVFtLXSB9XG5cdCk7XG59XG5cbmZ1bmN0aW9uIHRvSGV4V2l0aEFscGhhKHJnYlZhbHVlOiBSR0JWYWx1ZSk6IHN0cmluZyB7XG5cdGNvbnN0IHsgcmVkLCBncmVlbiwgYmx1ZSwgYWxwaGEgfSA9IHJnYlZhbHVlO1xuXG5cdGNvbnN0IGhleCA9IGAjJHsoKDEgPDwgMjQpICsgKHJlZCA8PCAxNikgKyAoZ3JlZW4gPDwgOCkgKyBibHVlKVxuXHRcdC50b1N0cmluZygxNilcblx0XHQuc2xpY2UoMSl9YDtcblx0Y29uc3QgYWxwaGFIZXggPSBNYXRoLnJvdW5kKGFscGhhICogMjU1KVxuXHRcdC50b1N0cmluZygxNilcblx0XHQucGFkU3RhcnQoMiwgJzAnKTtcblxuXHRyZXR1cm4gYCR7aGV4fSR7YWxwaGFIZXh9YDtcbn1cblxuZXhwb3J0IGNvbnN0IGNvbG9yOiBDb21tb25VdGlsc0ZuQ29sb3IgPSB7XG5cdGNvbG9yVG9Db2xvclN0cmluZyxcblx0ZW5zdXJlSGFzaCxcblx0Zm9ybWF0UGVyY2VudGFnZVZhbHVlcyxcblx0Z2V0QWxwaGFGcm9tSGV4LFxuXHRnZXRDb2xvclN0cmluZyxcblx0aGV4QWxwaGFUb051bWVyaWNBbHBoYSxcblx0aXNDTVlLQ29sb3IsXG5cdGlzQ01ZS0Zvcm1hdCxcblx0aXNDTVlLU3RyaW5nLFxuXHRpc0NvbG9yRm9ybWF0LFxuXHRpc0NvbG9yU3RyaW5nLFxuXHRpc0NvbG9yU3BhY2UsXG5cdGlzQ29sb3JTcGFjZUV4dGVuZGVkLFxuXHRpc0NvbnZlcnRpYmxlQ29sb3IsXG5cdGlzRm9ybWF0LFxuXHRpc0hleCxcblx0aXNIZXhGb3JtYXQsXG5cdGlzSFNMQ29sb3IsXG5cdGlzSFNMRm9ybWF0LFxuXHRpc0hTTFN0cmluZyxcblx0aXNJbnB1dEVsZW1lbnQsXG5cdGlzSFNWQ29sb3IsXG5cdGlzSFNWRm9ybWF0LFxuXHRpc0hTVlN0cmluZyxcblx0aXNMQUIsXG5cdGlzTEFCRm9ybWF0LFxuXHRpc1JHQixcblx0aXNSR0JGb3JtYXQsXG5cdGlzU0xDb2xvcixcblx0aXNTTEZvcm1hdCxcblx0aXNTTFN0cmluZyxcblx0aXNTdG9yZWRQYWxldHRlLFxuXHRpc1NWQ29sb3IsXG5cdGlzU1ZGb3JtYXQsXG5cdGlzU1ZTdHJpbmcsXG5cdGlzWFlaLFxuXHRpc1hZWkZvcm1hdCxcblx0bmFycm93VG9Db2xvcixcblx0cGFyc2VDb2xvcixcblx0cGFyc2VDb21wb25lbnRzLFxuXHRwYXJzZUhleFdpdGhBbHBoYSxcblx0c3RyaXBIYXNoRnJvbUhleCxcblx0c3RyaXBQZXJjZW50RnJvbVZhbHVlcyxcblx0dG9IZXhXaXRoQWxwaGFcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCB7IGhleEFscGhhVG9OdW1lcmljQWxwaGEsIHN0cmlwSGFzaEZyb21IZXggfTtcbiJdfQ==