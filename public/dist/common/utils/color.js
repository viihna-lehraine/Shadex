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
            logger.info(`Already formatted as color string: ${JSON.stringify(color)}`, `${thisModule} > ${thisMethod}`);
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
                key: `${newValue.key}%`
            }
        };
    }
    else if (isHex(clonedColor)) {
        const newValue = formatPercentageValues(clonedColor.value);
        return {
            format: 'hex',
            value: {
                hex: `${newValue.hex}`
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
                lightness: `${newValue.lightness}%`
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
                value: `${newValue.value}%`
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
                b: `${newValue.b}`
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
                blue: `${newValue.blue}`
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
                z: `${newValue.z}`
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
        else if (logMode.warn) {
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
function getColorString(color) {
    const thisMethod = 'getColorString()';
    try {
        const formatters = {
            cmyk: (c) => `cmyk(${c.value.cyan}, ${c.value.magenta}, ${c.value.yellow}, ${c.value.key})`,
            hex: (c) => c.value.hex,
            hsl: (c) => `hsl(${c.value.hue}, ${c.value.saturation}%, ${c.value.lightness}%)`,
            hsv: (c) => `hsv(${c.value.hue}, ${c.value.saturation}%, ${c.value.value}%)`,
            lab: (c) => `lab(${c.value.l}, ${c.value.a}, ${c.value.b})`,
            rgb: (c) => `rgb(${c.value.red}, ${c.value.green}, ${c.value.blue})`,
            xyz: (c) => `xyz(${c.value.x}, ${c.value.y}, ${c.value.z})`
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
                const [c, m, y, k] = parseComponents(value, 5);
                return {
                    value: {
                        cyan: coreUtils.brand.asPercentile(c),
                        magenta: coreUtils.brand.asPercentile(m),
                        yellow: coreUtils.brand.asPercentile(y),
                        key: coreUtils.brand.asPercentile(k)
                    },
                    format: 'cmyk'
                };
            }
            case 'hex':
                const hexValue = value.startsWith('#') ? value : `#${value}`;
                return {
                    value: {
                        hex: coreUtils.brand.asHexSet(hexValue)
                    },
                    format: 'hex'
                };
            case 'hsl': {
                const [h, s, l] = parseComponents(value, 4);
                return {
                    value: {
                        hue: coreUtils.brand.asRadial(h),
                        saturation: coreUtils.brand.asPercentile(s),
                        lightness: coreUtils.brand.asPercentile(l)
                    },
                    format: 'hsl'
                };
            }
            case 'hsv': {
                const [h, s, v] = parseComponents(value, 4);
                return {
                    value: {
                        hue: coreUtils.brand.asRadial(h),
                        saturation: coreUtils.brand.asPercentile(s),
                        value: coreUtils.brand.asPercentile(v)
                    },
                    format: 'hsv'
                };
            }
            case 'lab': {
                const [l, a, b] = parseComponents(value, 4);
                return {
                    value: {
                        l: coreUtils.brand.asLAB_L(l),
                        a: coreUtils.brand.asLAB_A(a),
                        b: coreUtils.brand.asLAB_B(b)
                    },
                    format: 'lab'
                };
            }
            case 'rgb': {
                const components = value.split(',').map(Number);
                if (components.some(isNaN))
                    throw new Error('Invalid RGB format');
                const [r, g, b] = components;
                return {
                    value: {
                        red: coreUtils.brand.asByteRange(r),
                        green: coreUtils.brand.asByteRange(g),
                        blue: coreUtils.brand.asByteRange(b)
                    },
                    format: 'rgb'
                };
            }
            default:
                const message = `Unsupported color format: ${colorSpace}`;
                if (mode.gracefulErrors) {
                    if (logMode.error)
                        logger.error(message);
                    else if (logMode.warn)
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
                if (logMode.warn)
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
function stripHashFromHex(hex) {
    const thisMethod = 'stripHashFromHex()';
    try {
        const hexString = `${hex.value.hex}`;
        return hex.value.hex.startsWith('#')
            ? {
                value: {
                    hex: coreUtils.brand.asHexSet(hexString.slice(1))
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
export const colorUtils = {
    colorToColorString,
    ensureHash,
    formatPercentageValues,
    getColorString,
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
    stripHashFromHex,
    stripPercentFromValues
};
export { hexAlphaToNumericAlpha, stripHashFromHex };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL3V0aWxzL2NvbG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQTZCOUIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN2QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDckQsT0FBTyxFQUFFLFdBQVcsSUFBSSxRQUFRLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsUUFBUSxJQUFJLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXRELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDN0IsTUFBTSxVQUFVLEdBQUcsdUJBQXVCLENBQUM7QUFFM0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxrREFBa0Q7QUFFbEQsU0FBUyxhQUFhLENBQ3JCLEtBQVksRUFDWixNQUFtQjtJQUVuQixPQUFPLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDO0FBQ2hDLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxLQUFhO0lBQ2xDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQUMsS0FBYTtJQUMxQyxPQUFPO1FBQ04sTUFBTTtRQUNOLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsSUFBSTtRQUNKLElBQUk7UUFDSixLQUFLO0tBQ0wsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUFDLEtBQWM7SUFDcEMs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LFVBQVU7SUFDVixzQkFBc0I7SUFDdEIsY0FBYztJQUNkLFdBQVc7SUFDWCxZQUFZO0lBQ1osWUFBWTtJQUNaLGFBQWE7SUFDYixhQUFhO0lBQ2IsWUFBWTtJQUNaLG9CQUFvQjtJQUNwQixrQkFBa0I7SUFDbEIsUUFBUTtJQUNSLEtBQUs7SUFDTCxXQUFXO0lBQ1gsVUFBVTtJQUNWLFdBQVc7SUFDWCxXQUFXO0lBQ1gsY0FBYztJQUNkLFVBQVU7SUFDVixXQUFXO0lBQ1gsV0FBVztJQUNYLEtBQUs7SUFDTCxXQUFXO0lBQ1gsS0FBSztJQUNMLFdBQVc7SUFDWCxTQUFTO0lBQ1QsVUFBVTtJQUNWLFVBQVU7SUFDVixlQUFlO0lBQ2YsU0FBUztJQUNULFVBQVU7SUFDVixVQUFVO0lBQ1YsS0FBSztJQUNMLFdBQVc7SUFDWCxhQUFhO0lBQ2IsVUFBVTtJQUNWLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsc0JBQXNCO0NBQ2IsQ0FBQztBQUVYLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogY29tbW9uL3V0aWxzL2NvbG9yLmpzXG5cbmltcG9ydCB7XG5cdENNWUssXG5cdENNWUtfU3RyaW5nUHJvcHMsXG5cdENvbG9yLFxuXHRDb2xvckZvcm1hdCxcblx0Q29sb3JTcGFjZSxcblx0Q29sb3JTcGFjZUV4dGVuZGVkLFxuXHRDb2xvcl9TdHJpbmdQcm9wcyxcblx0Q29tbW9uRm5fTWFzdGVySW50ZXJmYWNlLFxuXHRIZXgsXG5cdEhleF9TdHJpbmdQcm9wcyxcblx0SFNMLFxuXHRIU0xfU3RyaW5nUHJvcHMsXG5cdEhTVixcblx0SFNWX1N0cmluZ1Byb3BzLFxuXHRMQUIsXG5cdExBQl9TdHJpbmdQcm9wcyxcblx0UkdCLFxuXHRSR0JfU3RyaW5nUHJvcHMsXG5cdFNMLFxuXHRTTF9TdHJpbmdQcm9wcyxcblx0U3RvcmVkUGFsZXR0ZSxcblx0U1YsXG5cdFNWX1N0cmluZ1Byb3BzLFxuXHRYWVosXG5cdFhZWl9TdHJpbmdQcm9wc1xufSBmcm9tICcuLi8uLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb3JlVXRpbHMgfSBmcm9tICcuLi9jb3JlLmpzJztcbmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJy4uLy4uL2xvZ2dlci9pbmRleC5qcyc7XG5pbXBvcnQgeyBkZWZhdWx0RGF0YSBhcyBkZWZhdWx0cyB9IGZyb20gJy4uLy4uL2RhdGEvZGVmYXVsdHMuanMnO1xuaW1wb3J0IHsgbW9kZURhdGEgYXMgbW9kZSB9IGZyb20gJy4uLy4uL2RhdGEvbW9kZS5qcyc7XG5cbmNvbnN0IGxvZ01vZGUgPSBtb2RlLmxvZ2dpbmc7XG5jb25zdCB0aGlzTW9kdWxlID0gJ2NvbW1vbi91dGlscy9jb2xvci5qcyc7XG5cbmNvbnN0IGxvZ2dlciA9IGF3YWl0IGNyZWF0ZUxvZ2dlcigpO1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDE6IFJvYnVzdCBUeXBlIEd1YXJkcyAqKioqKioqKlxuXG5mdW5jdGlvbiBpc0NvbG9yRm9ybWF0PFQgZXh0ZW5kcyBDb2xvcj4oXG5cdGNvbG9yOiBDb2xvcixcblx0Zm9ybWF0OiBUWydmb3JtYXQnXVxuKTogY29sb3IgaXMgVCB7XG5cdHJldHVybiBjb2xvci5mb3JtYXQgPT09IGZvcm1hdDtcbn1cblxuZnVuY3Rpb24gaXNDb2xvclNwYWNlKHZhbHVlOiBzdHJpbmcpOiB2YWx1ZSBpcyBDb2xvclNwYWNlIHtcblx0cmV0dXJuIFsnY215aycsICdoZXgnLCAnaHNsJywgJ2hzdicsICdsYWInLCAncmdiJywgJ3h5eiddLmluY2x1ZGVzKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gaXNDb2xvclNwYWNlRXh0ZW5kZWQodmFsdWU6IHN0cmluZyk6IHZhbHVlIGlzIENvbG9yU3BhY2VFeHRlbmRlZCB7XG5cdHJldHVybiBbXG5cdFx0J2NteWsnLFxuXHRcdCdoZXgnLFxuXHRcdCdoc2wnLFxuXHRcdCdoc3YnLFxuXHRcdCdsYWInLFxuXHRcdCdyZ2InLFxuXHRcdCdzbCcsXG5cdFx0J3N2Jyxcblx0XHQneHl6J1xuXHRdLmluY2x1ZGVzKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gaXNDb2xvclN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENvbG9yX1N0cmluZ1Byb3BzIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwpIHtcblx0XHRjb25zdCBjb2xvclN0cmluZyA9IHZhbHVlIGFzIEV4Y2x1ZGU8XG5cdFx0XHRDb2xvcl9TdHJpbmdQcm9wcyxcblx0XHRcdEhleF9TdHJpbmdQcm9wc1xuXHRcdD47XG5cdFx0Y29uc3QgdmFsaWRTdHJpbmdGb3JtYXRzOiBFeGNsdWRlPFxuXHRcdFx0Q29sb3JfU3RyaW5nUHJvcHMsXG5cdFx0XHRIZXhfU3RyaW5nUHJvcHNcblx0XHQ+Wydmb3JtYXQnXVtdID0gWydjbXlrJywgJ2hzbCcsICdoc3YnLCAnbGFiJywgJ3JnYicsICdzbCcsICdzdicsICd4eXonXTtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQndmFsdWUnIGluIGNvbG9yU3RyaW5nICYmXG5cdFx0XHQnZm9ybWF0JyBpbiBjb2xvclN0cmluZyAmJlxuXHRcdFx0dmFsaWRTdHJpbmdGb3JtYXRzLmluY2x1ZGVzKGNvbG9yU3RyaW5nLmZvcm1hdClcblx0XHQpO1xuXHR9XG5cblx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgL14jWzAtOUEtRmEtZl17Niw4fSQvLnRlc3QodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBpc0Zvcm1hdChmb3JtYXQ6IHVua25vd24pOiBmb3JtYXQgaXMgQ29sb3JGb3JtYXQge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiBmb3JtYXQgPT09ICdzdHJpbmcnICYmXG5cdFx0WydjbXlrJywgJ2hleCcsICdoc2wnLCAnaHN2JywgJ2xhYicsICdyZ2InLCAnc2wnLCAnc3YnLCAneHl6J10uaW5jbHVkZXMoXG5cdFx0XHRmb3JtYXRcblx0XHQpXG5cdCk7XG59XG5cbi8vICoqKioqKioqIFNFQ1RJT04gMjogTmFycm93IFR5cGUgR3VhcmRzICoqKioqKioqXG5cbmZ1bmN0aW9uIGlzQ01ZS0NvbG9yKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ01ZSyB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgQ01ZSykuZm9ybWF0ID09PSAnY215aycgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLKS52YWx1ZS5jeWFuID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZSykudmFsdWUubWFnZW50YSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUspLnZhbHVlLnllbGxvdyA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUspLnZhbHVlLmtleSA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNDTVlLRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIENNWUsge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2NteWsnKTtcbn1cblxuZnVuY3Rpb24gaXNDTVlLU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ01ZS19TdHJpbmdQcm9wcyB7XG5cdHJldHVybiAoXG5cdFx0aXNDb2xvclN0cmluZyh2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBDTVlLX1N0cmluZ1Byb3BzKS5mb3JtYXQgPT09ICdjbXlrJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUtfU3RyaW5nUHJvcHMpLnZhbHVlLmN5YW4gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLX1N0cmluZ1Byb3BzKS52YWx1ZS5tYWdlbnRhID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZS19TdHJpbmdQcm9wcykudmFsdWUueWVsbG93ID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZS19TdHJpbmdQcm9wcykudmFsdWUua2V5ID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hleCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhleCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgSGV4KS5mb3JtYXQgPT09ICdoZXgnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSGV4KS52YWx1ZS5oZXggPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSGV4Rm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIEhleCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnaGV4Jyk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIU0wge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIEhTTCkuZm9ybWF0ID09PSAnaHNsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTCkudmFsdWUuaHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMKS52YWx1ZS5saWdodG5lc3MgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIEhTTCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnaHNsJyk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgSFNMX1N0cmluZ1Byb3BzIHtcblx0cmV0dXJuIChcblx0XHRpc0NvbG9yU3RyaW5nKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIEhTTF9TdHJpbmdQcm9wcykuZm9ybWF0ID09PSAnaHNsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTF9TdHJpbmdQcm9wcykudmFsdWUuaHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMX1N0cmluZ1Byb3BzKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMX1N0cmluZ1Byb3BzKS52YWx1ZS5saWdodG5lc3MgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNWQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIU1Yge1xuXHRyZXR1cm4gKFxuXHRcdGNvcmVVdGlscy5ndWFyZHMuaXNDb2xvcih2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBIU1YpLmZvcm1hdCA9PT0gJ2hzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1YpLnZhbHVlLmh1ZSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVikudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVikudmFsdWUudmFsdWUgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNWRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIEhTViB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnaHN2Jyk7XG59XG5cbmZ1bmN0aW9uIGlzSFNWU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgSFNWX1N0cmluZ1Byb3BzIHtcblx0cmV0dXJuIChcblx0XHRpc0NvbG9yU3RyaW5nKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIEhTVl9TdHJpbmdQcm9wcykuZm9ybWF0ID09PSAnaHN2JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVl9TdHJpbmdQcm9wcykudmFsdWUuaHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNWX1N0cmluZ1Byb3BzKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNWX1N0cmluZ1Byb3BzKS52YWx1ZS52YWx1ZSA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNMQUIodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBMQUIge1xuXHRyZXR1cm4gKFxuXHRcdGNvcmVVdGlscy5ndWFyZHMuaXNDb2xvcih2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBMQUIpLmZvcm1hdCA9PT0gJ2xhYicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBMQUIpLnZhbHVlLmwgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBMQUIpLnZhbHVlLmEgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBMQUIpLnZhbHVlLmIgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzTEFCRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIExBQiB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnbGFiJyk7XG59XG5cbmZ1bmN0aW9uIGlzUkdCKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgUkdCIHtcblx0cmV0dXJuIChcblx0XHRjb3JlVXRpbHMuZ3VhcmRzLmlzQ29sb3IodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgUkdCKS5mb3JtYXQgPT09ICdyZ2InICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgUkdCKS52YWx1ZS5yZWQgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBSR0IpLnZhbHVlLmdyZWVuID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgUkdCKS52YWx1ZS5ibHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1JHQkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBSR0Ige1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ3JnYicpO1xufVxuXG5mdW5jdGlvbiBpc1NMQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBTTCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgU0wpLmZvcm1hdCA9PT0gJ3NsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNMKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU0wpLnZhbHVlLmxpZ2h0bmVzcyA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNTTEZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBTTCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnc2wnKTtcbn1cblxuZnVuY3Rpb24gaXNTTFN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFNMX1N0cmluZ1Byb3BzIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBTTF9TdHJpbmdQcm9wcykuZm9ybWF0ID09PSAnc2wnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU0xfU3RyaW5nUHJvcHMpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTTF9TdHJpbmdQcm9wcykudmFsdWUubGlnaHRuZXNzID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1NWQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBTViB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgU1YpLmZvcm1hdCA9PT0gJ3N2JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNWKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU1YpLnZhbHVlLnZhbHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1NWRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIFNWIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdzdicpO1xufVxuXG5mdW5jdGlvbiBpc1NWU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgU1ZfU3RyaW5nUHJvcHMge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFNWX1N0cmluZ1Byb3BzKS5mb3JtYXQgPT09ICdzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTVl9TdHJpbmdQcm9wcykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNWX1N0cmluZ1Byb3BzKS52YWx1ZS52YWx1ZSA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNYWVoodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBYWVoge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFhZWikuZm9ybWF0ID09PSAneHl6JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFhZWikudmFsdWUueCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFhZWikudmFsdWUueSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFhZWikudmFsdWUueiA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNYWVpGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgWFlaIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICd4eXonKTtcbn1cblxuLy8gKioqKiogU0VDVElPTiAzOiBVdGlsaXR5IEd1YXJkcyAqKioqKlxuXG5mdW5jdGlvbiBlbnN1cmVIYXNoKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRyZXR1cm4gdmFsdWUuc3RhcnRzV2l0aCgnIycpID8gdmFsdWUgOiBgIyR7dmFsdWV9YDtcbn1cblxuZnVuY3Rpb24gaXNDb252ZXJ0aWJsZUNvbG9yKFxuXHRjb2xvcjogQ29sb3Jcbik6IGNvbG9yIGlzIENNWUsgfCBIZXggfCBIU0wgfCBIU1YgfCBMQUIgfCBSR0Ige1xuXHRyZXR1cm4gKFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2NteWsnIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnaGV4JyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2hzbCcgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdoc3YnIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnbGFiJyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ3JnYidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNJbnB1dEVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsKTogZWxlbWVudCBpcyBIVE1MRWxlbWVudCB7XG5cdHJldHVybiBlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudDtcbn1cblxuZnVuY3Rpb24gaXNTdG9yZWRQYWxldHRlKG9iajogdW5rbm93bik6IG9iaiBpcyBTdG9yZWRQYWxldHRlIHtcblx0aWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG5cdGNvbnN0IGNhbmRpZGF0ZSA9IG9iaiBhcyBQYXJ0aWFsPFN0b3JlZFBhbGV0dGU+O1xuXG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIGNhbmRpZGF0ZS50YWJsZUlEID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiBjYW5kaWRhdGUucGFsZXR0ZSA9PT0gJ29iamVjdCcgJiZcblx0XHRBcnJheS5pc0FycmF5KGNhbmRpZGF0ZS5wYWxldHRlLml0ZW1zKSAmJlxuXHRcdHR5cGVvZiBjYW5kaWRhdGUucGFsZXR0ZS5pZCA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbmFycm93VG9Db2xvcihcblx0Y29sb3I6IENvbG9yIHwgQ29sb3JfU3RyaW5nUHJvcHNcbik6IFByb21pc2U8Q29sb3IgfCBudWxsPiB7XG5cdGlmIChpc0NvbG9yU3RyaW5nKGNvbG9yKSkge1xuXHRcdHJldHVybiBjb3JlVXRpbHMuY29udmVydC5jb2xvclN0cmluZ1RvQ29sb3IoY29sb3IpO1xuXHR9XG5cblx0c3dpdGNoIChjb2xvci5mb3JtYXQgYXMgQ29sb3JTcGFjZUV4dGVuZGVkKSB7XG5cdFx0Y2FzZSAnY215ayc6XG5cdFx0Y2FzZSAnaGV4Jzpcblx0XHRjYXNlICdoc2wnOlxuXHRcdGNhc2UgJ2hzdic6XG5cdFx0Y2FzZSAnbGFiJzpcblx0XHRjYXNlICdzbCc6XG5cdFx0Y2FzZSAnc3YnOlxuXHRcdGNhc2UgJ3JnYic6XG5cdFx0Y2FzZSAneHl6Jzpcblx0XHRcdHJldHVybiBjb2xvcjtcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuLy8gKioqKioqKiogU0VDVElPTiA0OiBUUkFOU0ZPUk0gVVRJTFMgKioqKioqKipcblxuZnVuY3Rpb24gY29sb3JUb0NvbG9yU3RyaW5nKGNvbG9yOiBDb2xvcik6IENvbG9yX1N0cmluZ1Byb3BzIHtcblx0Y29uc3QgdGhpc01ldGhvZCA9ICdjb2xvclRvQ29sb3JTdHJpbmcoKSc7XG5cdGNvbnN0IGNsb25lZENvbG9yID0gY29yZVV0aWxzLmJhc2UuY2xvbmUoY29sb3IpO1xuXG5cdGlmIChpc0NvbG9yU3RyaW5nKGNsb25lZENvbG9yKSkge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKSB7XG5cdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0YEFscmVhZHkgZm9ybWF0dGVkIGFzIGNvbG9yIHN0cmluZzogJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY2xvbmVkQ29sb3I7XG5cdH1cblxuXHRpZiAoaXNDTVlLQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKFxuXHRcdFx0Y2xvbmVkQ29sb3IudmFsdWVcblx0XHQpIGFzIENNWUtbJ3ZhbHVlJ107XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnY215aycsXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRjeWFuOiBgJHtuZXdWYWx1ZS5jeWFufSVgLFxuXHRcdFx0XHRtYWdlbnRhOiBgJHtuZXdWYWx1ZS5tYWdlbnRhfSVgLFxuXHRcdFx0XHR5ZWxsb3c6IGAke25ld1ZhbHVlLnllbGxvd30lYCxcblx0XHRcdFx0a2V5OiBgJHtuZXdWYWx1ZS5rZXl9JWBcblx0XHRcdH0gYXMgQ01ZS19TdHJpbmdQcm9wc1sndmFsdWUnXVxuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNIZXgoY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKFxuXHRcdFx0KGNsb25lZENvbG9yIGFzIEhleCkudmFsdWVcblx0XHQpIGFzIEhleFsndmFsdWUnXTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdoZXgnLFxuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aGV4OiBgJHtuZXdWYWx1ZS5oZXh9YFxuXHRcdFx0fSBhcyBIZXhfU3RyaW5nUHJvcHNbJ3ZhbHVlJ11cblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzSFNMQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKFxuXHRcdFx0Y2xvbmVkQ29sb3IudmFsdWVcblx0XHQpIGFzIEhTTFsndmFsdWUnXTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdoc2wnLFxuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBgJHtuZXdWYWx1ZS5odWV9YCxcblx0XHRcdFx0c2F0dXJhdGlvbjogYCR7bmV3VmFsdWUuc2F0dXJhdGlvbn0lYCxcblx0XHRcdFx0bGlnaHRuZXNzOiBgJHtuZXdWYWx1ZS5saWdodG5lc3N9JWBcblx0XHRcdH0gYXMgSFNMX1N0cmluZ1Byb3BzWyd2YWx1ZSddXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc0hTVkNvbG9yKGNsb25lZENvbG9yKSkge1xuXHRcdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhcblx0XHRcdGNsb25lZENvbG9yLnZhbHVlXG5cdFx0KSBhcyBIU1ZbJ3ZhbHVlJ107XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnaHN2Jyxcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogYCR7bmV3VmFsdWUuaHVlfWAsXG5cdFx0XHRcdHNhdHVyYXRpb246IGAke25ld1ZhbHVlLnNhdHVyYXRpb259JWAsXG5cdFx0XHRcdHZhbHVlOiBgJHtuZXdWYWx1ZS52YWx1ZX0lYFxuXHRcdFx0fSBhcyBIU1ZfU3RyaW5nUHJvcHNbJ3ZhbHVlJ11cblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzTEFCKGNsb25lZENvbG9yKSkge1xuXHRcdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhcblx0XHRcdGNsb25lZENvbG9yLnZhbHVlXG5cdFx0KSBhcyBMQUJbJ3ZhbHVlJ107XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnbGFiJyxcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGw6IGAke25ld1ZhbHVlLmx9YCxcblx0XHRcdFx0YTogYCR7bmV3VmFsdWUuYX1gLFxuXHRcdFx0XHRiOiBgJHtuZXdWYWx1ZS5ifWBcblx0XHRcdH0gYXMgTEFCX1N0cmluZ1Byb3BzWyd2YWx1ZSddXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc1JHQihjbG9uZWRDb2xvcikpIHtcblx0XHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoXG5cdFx0XHRjbG9uZWRDb2xvci52YWx1ZVxuXHRcdCkgYXMgUkdCWyd2YWx1ZSddO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ3JnYicsXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRyZWQ6IGAke25ld1ZhbHVlLnJlZH1gLFxuXHRcdFx0XHRncmVlbjogYCR7bmV3VmFsdWUuZ3JlZW59YCxcblx0XHRcdFx0Ymx1ZTogYCR7bmV3VmFsdWUuYmx1ZX1gXG5cdFx0XHR9IGFzIFJHQl9TdHJpbmdQcm9wc1sndmFsdWUnXVxuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNYWVooY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKFxuXHRcdFx0Y2xvbmVkQ29sb3IudmFsdWVcblx0XHQpIGFzIFhZWlsndmFsdWUnXTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICd4eXonLFxuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0eDogYCR7bmV3VmFsdWUueH1gLFxuXHRcdFx0XHR5OiBgJHtuZXdWYWx1ZS55fWAsXG5cdFx0XHRcdHo6IGAke25ld1ZhbHVlLnp9YFxuXHRcdFx0fSBhcyBYWVpfU3RyaW5nUHJvcHNbJ3ZhbHVlJ11cblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdGlmICghbW9kZS5ncmFjZWZ1bEVycm9ycykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBmb3JtYXQ6ICR7Y2xvbmVkQ29sb3IuZm9ybWF0fWApO1xuXHRcdH0gZWxzZSBpZiAobG9nTW9kZS5lcnJvcikge1xuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgVW5zdXBwb3J0ZWQgZm9ybWF0OiAke2Nsb25lZENvbG9yLmZvcm1hdH1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSBpZiAobG9nTW9kZS53YXJuKSB7XG5cdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0J0ZhaWxlZCB0byBjb252ZXJ0IHRvIGNvbG9yIHN0cmluZy4nLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkZWZhdWx0cy5jb2xvcnMuc3RyaW5ncy5oc2w7XG5cdH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0UGVyY2VudGFnZVZhbHVlczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4+KFxuXHR2YWx1ZTogVFxuKTogVCB7XG5cdHJldHVybiBPYmplY3QuZW50cmllcyh2YWx1ZSkucmVkdWNlKFxuXHRcdChhY2MsIFtrZXksIHZhbF0pID0+IHtcblx0XHRcdChhY2MgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pW2tleV0gPSBbXG5cdFx0XHRcdCdzYXR1cmF0aW9uJyxcblx0XHRcdFx0J2xpZ2h0bmVzcycsXG5cdFx0XHRcdCd2YWx1ZScsXG5cdFx0XHRcdCdjeWFuJyxcblx0XHRcdFx0J21hZ2VudGEnLFxuXHRcdFx0XHQneWVsbG93Jyxcblx0XHRcdFx0J2tleSdcblx0XHRcdF0uaW5jbHVkZXMoa2V5KVxuXHRcdFx0XHQ/IGAke3ZhbH0lYFxuXHRcdFx0XHQ6IHZhbDtcblx0XHRcdHJldHVybiBhY2M7XG5cdFx0fSxcblx0XHR7fSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuXHQpIGFzIFQ7XG59XG5cbmZ1bmN0aW9uIGdldENvbG9yU3RyaW5nKGNvbG9yOiBDb2xvcik6IHN0cmluZyB8IG51bGwge1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ2dldENvbG9yU3RyaW5nKCknO1xuXG5cdHRyeSB7XG5cdFx0Y29uc3QgZm9ybWF0dGVycyA9IHtcblx0XHRcdGNteWs6IChjOiBDTVlLKSA9PlxuXHRcdFx0XHRgY215aygke2MudmFsdWUuY3lhbn0sICR7Yy52YWx1ZS5tYWdlbnRhfSwgJHtjLnZhbHVlLnllbGxvd30sICR7Yy52YWx1ZS5rZXl9KWAsXG5cdFx0XHRoZXg6IChjOiBIZXgpID0+IGMudmFsdWUuaGV4LFxuXHRcdFx0aHNsOiAoYzogSFNMKSA9PlxuXHRcdFx0XHRgaHNsKCR7Yy52YWx1ZS5odWV9LCAke2MudmFsdWUuc2F0dXJhdGlvbn0lLCAke2MudmFsdWUubGlnaHRuZXNzfSUpYCxcblx0XHRcdGhzdjogKGM6IEhTVikgPT5cblx0XHRcdFx0YGhzdigke2MudmFsdWUuaHVlfSwgJHtjLnZhbHVlLnNhdHVyYXRpb259JSwgJHtjLnZhbHVlLnZhbHVlfSUpYCxcblx0XHRcdGxhYjogKGM6IExBQikgPT4gYGxhYigke2MudmFsdWUubH0sICR7Yy52YWx1ZS5hfSwgJHtjLnZhbHVlLmJ9KWAsXG5cdFx0XHRyZ2I6IChjOiBSR0IpID0+XG5cdFx0XHRcdGByZ2IoJHtjLnZhbHVlLnJlZH0sICR7Yy52YWx1ZS5ncmVlbn0sICR7Yy52YWx1ZS5ibHVlfSlgLFxuXHRcdFx0eHl6OiAoYzogWFlaKSA9PiBgeHl6KCR7Yy52YWx1ZS54fSwgJHtjLnZhbHVlLnl9LCAke2MudmFsdWUuen0pYFxuXHRcdH07XG5cblx0XHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmNteWsoY29sb3IpO1xuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMuaGV4KGNvbG9yKTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmhzbChjb2xvcik7XG5cdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5oc3YoY29sb3IpO1xuXHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMubGFiKGNvbG9yKTtcblx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLnJnYihjb2xvcik7XG5cdFx0XHRjYXNlICd4eXonOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy54eXooY29sb3IpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0aWYgKCFsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdGBVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQgZm9yICR7Y29sb3J9YCxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIWxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBnZXRDb2xvclN0cmluZyBlcnJvcjogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4QWxwaGFUb051bWVyaWNBbHBoYShoZXhBbHBoYTogc3RyaW5nKTogbnVtYmVyIHtcblx0cmV0dXJuIHBhcnNlSW50KGhleEFscGhhLCAxNikgLyAyNTU7XG59XG5cbmNvbnN0IHBhcnNlQ29sb3IgPSAoY29sb3JTcGFjZTogQ29sb3JTcGFjZSwgdmFsdWU6IHN0cmluZyk6IENvbG9yIHwgbnVsbCA9PiB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAncGFyc2VDb2xvcic7XG5cblx0dHJ5IHtcblx0XHRzd2l0Y2ggKGNvbG9yU3BhY2UpIHtcblx0XHRcdGNhc2UgJ2NteWsnOiB7XG5cdFx0XHRcdGNvbnN0IFtjLCBtLCB5LCBrXSA9IHBhcnNlQ29tcG9uZW50cyh2YWx1ZSwgNSk7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0Y3lhbjogY29yZVV0aWxzLmJyYW5kLmFzUGVyY2VudGlsZShjKSxcblx0XHRcdFx0XHRcdG1hZ2VudGE6IGNvcmVVdGlscy5icmFuZC5hc1BlcmNlbnRpbGUobSksXG5cdFx0XHRcdFx0XHR5ZWxsb3c6IGNvcmVVdGlscy5icmFuZC5hc1BlcmNlbnRpbGUoeSksXG5cdFx0XHRcdFx0XHRrZXk6IGNvcmVVdGlscy5icmFuZC5hc1BlcmNlbnRpbGUoaylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRjb25zdCBoZXhWYWx1ZSA9IHZhbHVlLnN0YXJ0c1dpdGgoJyMnKSA/IHZhbHVlIDogYCMke3ZhbHVlfWA7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aGV4OiBjb3JlVXRpbHMuYnJhbmQuYXNIZXhTZXQoaGV4VmFsdWUpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdH07XG5cdFx0XHRjYXNlICdoc2wnOiB7XG5cdFx0XHRcdGNvbnN0IFtoLCBzLCBsXSA9IHBhcnNlQ29tcG9uZW50cyh2YWx1ZSwgNCk7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aHVlOiBjb3JlVXRpbHMuYnJhbmQuYXNSYWRpYWwoaCksXG5cdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBjb3JlVXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKHMpLFxuXHRcdFx0XHRcdFx0bGlnaHRuZXNzOiBjb3JlVXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKGwpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdoc3YnOiB7XG5cdFx0XHRcdGNvbnN0IFtoLCBzLCB2XSA9IHBhcnNlQ29tcG9uZW50cyh2YWx1ZSwgNCk7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aHVlOiBjb3JlVXRpbHMuYnJhbmQuYXNSYWRpYWwoaCksXG5cdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBjb3JlVXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKHMpLFxuXHRcdFx0XHRcdFx0dmFsdWU6IGNvcmVVdGlscy5icmFuZC5hc1BlcmNlbnRpbGUodilcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGNhc2UgJ2xhYic6IHtcblx0XHRcdFx0Y29uc3QgW2wsIGEsIGJdID0gcGFyc2VDb21wb25lbnRzKHZhbHVlLCA0KTtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0bDogY29yZVV0aWxzLmJyYW5kLmFzTEFCX0wobCksXG5cdFx0XHRcdFx0XHRhOiBjb3JlVXRpbHMuYnJhbmQuYXNMQUJfQShhKSxcblx0XHRcdFx0XHRcdGI6IGNvcmVVdGlscy5icmFuZC5hc0xBQl9CKGIpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdyZ2InOiB7XG5cdFx0XHRcdGNvbnN0IGNvbXBvbmVudHMgPSB2YWx1ZS5zcGxpdCgnLCcpLm1hcChOdW1iZXIpO1xuXG5cdFx0XHRcdGlmIChjb21wb25lbnRzLnNvbWUoaXNOYU4pKVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBSR0IgZm9ybWF0Jyk7XG5cblx0XHRcdFx0Y29uc3QgW3IsIGcsIGJdID0gY29tcG9uZW50cztcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRyZWQ6IGNvcmVVdGlscy5icmFuZC5hc0J5dGVSYW5nZShyKSxcblx0XHRcdFx0XHRcdGdyZWVuOiBjb3JlVXRpbHMuYnJhbmQuYXNCeXRlUmFuZ2UoZyksXG5cdFx0XHRcdFx0XHRibHVlOiBjb3JlVXRpbHMuYnJhbmQuYXNCeXRlUmFuZ2UoYilcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGNvbnN0IG1lc3NhZ2UgPSBgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yU3BhY2V9YDtcblxuXHRcdFx0XHRpZiAobW9kZS5ncmFjZWZ1bEVycm9ycykge1xuXHRcdFx0XHRcdGlmIChsb2dNb2RlLmVycm9yKSBsb2dnZXIuZXJyb3IobWVzc2FnZSk7XG5cdFx0XHRcdFx0ZWxzZSBpZiAobG9nTW9kZS53YXJuKVxuXHRcdFx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0XHRcdGBGYWlsZWQgdG8gcGFyc2UgY29sb3I6ICR7bWVzc2FnZX1gLFxuXHRcdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YHBhcnNlQ29sb3IgZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59O1xuXG5mdW5jdGlvbiBwYXJzZUNvbXBvbmVudHModmFsdWU6IHN0cmluZywgY291bnQ6IG51bWJlcik6IG51bWJlcltdIHtcblx0Y29uc3QgdGhpc01ldGhvZCA9ICdwYXJzZUNvbXBvbmVudHMoKSc7XG5cblx0dHJ5IHtcblx0XHRjb25zdCBjb21wb25lbnRzID0gdmFsdWVcblx0XHRcdC5zcGxpdCgnLCcpXG5cdFx0XHQubWFwKHZhbCA9PlxuXHRcdFx0XHR2YWwudHJpbSgpLmVuZHNXaXRoKCclJylcblx0XHRcdFx0XHQ/IHBhcnNlRmxvYXQodmFsKVxuXHRcdFx0XHRcdDogcGFyc2VGbG9hdCh2YWwpICogMTAwXG5cdFx0XHQpO1xuXG5cdFx0aWYgKGNvbXBvbmVudHMubGVuZ3RoICE9PSBjb3VudClcblx0XHRcdGlmICghbW9kZS5ncmFjZWZ1bEVycm9ycylcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCAke2NvdW50fSBjb21wb25lbnRzLmApO1xuXHRcdFx0ZWxzZSBpZiAobG9nTW9kZS5lcnJvcikge1xuXHRcdFx0XHRpZiAobG9nTW9kZS53YXJuKVxuXHRcdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdFx0YEV4cGVjdGVkICR7Y291bnR9IGNvbXBvbmVudHMuYCxcblx0XHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblxuXHRcdHJldHVybiBjb21wb25lbnRzO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgRXJyb3IgcGFyc2luZyBjb21wb25lbnRzOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gW107XG5cdH1cbn1cblxuZnVuY3Rpb24gc3RyaXBIYXNoRnJvbUhleChoZXg6IEhleCk6IEhleCB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAnc3RyaXBIYXNoRnJvbUhleCgpJztcblxuXHR0cnkge1xuXHRcdGNvbnN0IGhleFN0cmluZyA9IGAke2hleC52YWx1ZS5oZXh9YDtcblxuXHRcdHJldHVybiBoZXgudmFsdWUuaGV4LnN0YXJ0c1dpdGgoJyMnKVxuXHRcdFx0PyB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGhleDogY29yZVV0aWxzLmJyYW5kLmFzSGV4U2V0KGhleFN0cmluZy5zbGljZSgxKSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hleCcgYXMgJ2hleCdcblx0XHRcdFx0fVxuXHRcdFx0OiBoZXg7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBzdHJpcEhhc2hGcm9tSGV4IGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cblx0XHRjb25zdCB1bmJyYW5kZWRIZXggPSBjb3JlVXRpbHMuYmFzZS5jbG9uZShcblx0XHRcdGRlZmF1bHRzLmNvbG9ycy5iYXNlLnVuYnJhbmRlZC5oZXhcblx0XHQpO1xuXG5cdFx0cmV0dXJuIGNvcmVVdGlscy5icmFuZENvbG9yLmFzSGV4KHVuYnJhbmRlZEhleCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc3RyaXBQZXJjZW50RnJvbVZhbHVlczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgbnVtYmVyIHwgc3RyaW5nPj4oXG5cdHZhbHVlOiBUXG4pOiB7IFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgYCR7bnVtYmVyfSVgID8gbnVtYmVyIDogVFtLXSB9IHtcblx0cmV0dXJuIE9iamVjdC5lbnRyaWVzKHZhbHVlKS5yZWR1Y2UoXG5cdFx0KGFjYywgW2tleSwgdmFsXSkgPT4ge1xuXHRcdFx0Y29uc3QgcGFyc2VkVmFsdWUgPVxuXHRcdFx0XHR0eXBlb2YgdmFsID09PSAnc3RyaW5nJyAmJiB2YWwuZW5kc1dpdGgoJyUnKVxuXHRcdFx0XHRcdD8gcGFyc2VGbG9hdCh2YWwuc2xpY2UoMCwgLTEpKVxuXHRcdFx0XHRcdDogdmFsO1xuXHRcdFx0YWNjW2tleSBhcyBrZXlvZiBUXSA9IHBhcnNlZFZhbHVlIGFzIFRba2V5b2YgVF0gZXh0ZW5kcyBgJHtudW1iZXJ9JWBcblx0XHRcdFx0PyBudW1iZXJcblx0XHRcdFx0OiBUW2tleW9mIFRdO1xuXHRcdFx0cmV0dXJuIGFjYztcblx0XHR9LFxuXHRcdHt9IGFzIHsgW0sgaW4ga2V5b2YgVF06IFRbS10gZXh0ZW5kcyBgJHtudW1iZXJ9JWAgPyBudW1iZXIgOiBUW0tdIH1cblx0KTtcbn1cblxuZXhwb3J0IGNvbnN0IGNvbG9yVXRpbHM6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsndXRpbHMnXVsnY29sb3InXSA9IHtcblx0Y29sb3JUb0NvbG9yU3RyaW5nLFxuXHRlbnN1cmVIYXNoLFxuXHRmb3JtYXRQZXJjZW50YWdlVmFsdWVzLFxuXHRnZXRDb2xvclN0cmluZyxcblx0aXNDTVlLQ29sb3IsXG5cdGlzQ01ZS0Zvcm1hdCxcblx0aXNDTVlLU3RyaW5nLFxuXHRpc0NvbG9yRm9ybWF0LFxuXHRpc0NvbG9yU3RyaW5nLFxuXHRpc0NvbG9yU3BhY2UsXG5cdGlzQ29sb3JTcGFjZUV4dGVuZGVkLFxuXHRpc0NvbnZlcnRpYmxlQ29sb3IsXG5cdGlzRm9ybWF0LFxuXHRpc0hleCxcblx0aXNIZXhGb3JtYXQsXG5cdGlzSFNMQ29sb3IsXG5cdGlzSFNMRm9ybWF0LFxuXHRpc0hTTFN0cmluZyxcblx0aXNJbnB1dEVsZW1lbnQsXG5cdGlzSFNWQ29sb3IsXG5cdGlzSFNWRm9ybWF0LFxuXHRpc0hTVlN0cmluZyxcblx0aXNMQUIsXG5cdGlzTEFCRm9ybWF0LFxuXHRpc1JHQixcblx0aXNSR0JGb3JtYXQsXG5cdGlzU0xDb2xvcixcblx0aXNTTEZvcm1hdCxcblx0aXNTTFN0cmluZyxcblx0aXNTdG9yZWRQYWxldHRlLFxuXHRpc1NWQ29sb3IsXG5cdGlzU1ZGb3JtYXQsXG5cdGlzU1ZTdHJpbmcsXG5cdGlzWFlaLFxuXHRpc1hZWkZvcm1hdCxcblx0bmFycm93VG9Db2xvcixcblx0cGFyc2VDb2xvcixcblx0cGFyc2VDb21wb25lbnRzLFxuXHRzdHJpcEhhc2hGcm9tSGV4LFxuXHRzdHJpcFBlcmNlbnRGcm9tVmFsdWVzXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgeyBoZXhBbHBoYVRvTnVtZXJpY0FscGhhLCBzdHJpcEhhc2hGcm9tSGV4IH07XG4iXX0=