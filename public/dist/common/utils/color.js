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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL3V0aWxzL2NvbG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQTZCOUIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN2QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDckQsT0FBTyxFQUFFLFdBQVcsSUFBSSxRQUFRLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsUUFBUSxJQUFJLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXRELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDN0IsTUFBTSxVQUFVLEdBQUcsdUJBQXVCLENBQUM7QUFFM0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxrREFBa0Q7QUFFbEQsU0FBUyxhQUFhLENBQ3JCLEtBQVksRUFDWixNQUFtQjtJQUVuQixPQUFPLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDO0FBQ2hDLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxLQUFhO0lBQ2xDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQUMsS0FBYTtJQUMxQyxPQUFPO1FBQ04sTUFBTTtRQUNOLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsSUFBSTtRQUNKLElBQUk7UUFDSixLQUFLO0tBQ0wsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUFDLEtBQWM7SUFDcEMs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RUFBbUUsQ0FDbkUsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQStDO0lBQ3JFLGtCQUFrQjtJQUNsQixVQUFVO0lBQ1Ysc0JBQXNCO0lBQ3RCLGNBQWM7SUFDZCxXQUFXO0lBQ1gsWUFBWTtJQUNaLFlBQVk7SUFDWixhQUFhO0lBQ2IsYUFBYTtJQUNiLFlBQVk7SUFDWixvQkFBb0I7SUFDcEIsa0JBQWtCO0lBQ2xCLFFBQVE7SUFDUixLQUFLO0lBQ0wsV0FBVztJQUNYLFVBQVU7SUFDVixXQUFXO0lBQ1gsV0FBVztJQUNYLGNBQWM7SUFDZCxVQUFVO0lBQ1YsV0FBVztJQUNYLFdBQVc7SUFDWCxLQUFLO0lBQ0wsV0FBVztJQUNYLEtBQUs7SUFDTCxXQUFXO0lBQ1gsU0FBUztJQUNULFVBQVU7SUFDVixVQUFVO0lBQ1YsZUFBZTtJQUNmLFNBQVM7SUFDVCxVQUFVO0lBQ1YsVUFBVTtJQUNWLEtBQUs7SUFDTCxXQUFXO0lBQ1gsYUFBYTtJQUNiLFVBQVU7SUFDVixlQUFlO0lBQ2YsZ0JBQWdCO0lBQ2hCLHNCQUFzQjtDQUNiLENBQUM7QUFFWCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IGNvbW1vbi91dGlscy9jb2xvci5qc1xuXG5pbXBvcnQge1xuXHRDTVlLLFxuXHRDTVlLX1N0cmluZ1Byb3BzLFxuXHRDb2xvcixcblx0Q29sb3JGb3JtYXQsXG5cdENvbG9yU3BhY2UsXG5cdENvbG9yU3BhY2VFeHRlbmRlZCxcblx0Q29sb3JfU3RyaW5nUHJvcHMsXG5cdENvbW1vbkZuX01hc3RlckludGVyZmFjZSxcblx0SGV4LFxuXHRIZXhfU3RyaW5nUHJvcHMsXG5cdEhTTCxcblx0SFNMX1N0cmluZ1Byb3BzLFxuXHRIU1YsXG5cdEhTVl9TdHJpbmdQcm9wcyxcblx0TEFCLFxuXHRMQUJfU3RyaW5nUHJvcHMsXG5cdFJHQixcblx0UkdCX1N0cmluZ1Byb3BzLFxuXHRTTCxcblx0U0xfU3RyaW5nUHJvcHMsXG5cdFN0b3JlZFBhbGV0dGUsXG5cdFNWLFxuXHRTVl9TdHJpbmdQcm9wcyxcblx0WFlaLFxuXHRYWVpfU3RyaW5nUHJvcHNcbn0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgY29yZVV0aWxzIH0gZnJvbSAnLi4vY29yZS5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuLi8uLi9sb2dnZXIvaW5kZXguanMnO1xuaW1wb3J0IHsgZGVmYXVsdERhdGEgYXMgZGVmYXVsdHMgfSBmcm9tICcuLi8uLi9kYXRhL2RlZmF1bHRzLmpzJztcbmltcG9ydCB7IG1vZGVEYXRhIGFzIG1vZGUgfSBmcm9tICcuLi8uLi9kYXRhL21vZGUuanMnO1xuXG5jb25zdCBsb2dNb2RlID0gbW9kZS5sb2dnaW5nO1xuY29uc3QgdGhpc01vZHVsZSA9ICdjb21tb24vdXRpbHMvY29sb3IuanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuLy8gKioqKioqKiogU0VDVElPTiAxOiBSb2J1c3QgVHlwZSBHdWFyZHMgKioqKioqKipcblxuZnVuY3Rpb24gaXNDb2xvckZvcm1hdDxUIGV4dGVuZHMgQ29sb3I+KFxuXHRjb2xvcjogQ29sb3IsXG5cdGZvcm1hdDogVFsnZm9ybWF0J11cbik6IGNvbG9yIGlzIFQge1xuXHRyZXR1cm4gY29sb3IuZm9ybWF0ID09PSBmb3JtYXQ7XG59XG5cbmZ1bmN0aW9uIGlzQ29sb3JTcGFjZSh2YWx1ZTogc3RyaW5nKTogdmFsdWUgaXMgQ29sb3JTcGFjZSB7XG5cdHJldHVybiBbJ2NteWsnLCAnaGV4JywgJ2hzbCcsICdoc3YnLCAnbGFiJywgJ3JnYicsICd4eXonXS5pbmNsdWRlcyh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGlzQ29sb3JTcGFjZUV4dGVuZGVkKHZhbHVlOiBzdHJpbmcpOiB2YWx1ZSBpcyBDb2xvclNwYWNlRXh0ZW5kZWQge1xuXHRyZXR1cm4gW1xuXHRcdCdjbXlrJyxcblx0XHQnaGV4Jyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnbGFiJyxcblx0XHQncmdiJyxcblx0XHQnc2wnLFxuXHRcdCdzdicsXG5cdFx0J3h5eidcblx0XS5pbmNsdWRlcyh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGlzQ29sb3JTdHJpbmcodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDb2xvcl9TdHJpbmdQcm9wcyB7XG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsKSB7XG5cdFx0Y29uc3QgY29sb3JTdHJpbmcgPSB2YWx1ZSBhcyBFeGNsdWRlPFxuXHRcdFx0Q29sb3JfU3RyaW5nUHJvcHMsXG5cdFx0XHRIZXhfU3RyaW5nUHJvcHNcblx0XHQ+O1xuXHRcdGNvbnN0IHZhbGlkU3RyaW5nRm9ybWF0czogRXhjbHVkZTxcblx0XHRcdENvbG9yX1N0cmluZ1Byb3BzLFxuXHRcdFx0SGV4X1N0cmluZ1Byb3BzXG5cdFx0PlsnZm9ybWF0J11bXSA9IFsnY215aycsICdoc2wnLCAnaHN2JywgJ2xhYicsICdyZ2InLCAnc2wnLCAnc3YnLCAneHl6J107XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0J3ZhbHVlJyBpbiBjb2xvclN0cmluZyAmJlxuXHRcdFx0J2Zvcm1hdCcgaW4gY29sb3JTdHJpbmcgJiZcblx0XHRcdHZhbGlkU3RyaW5nRm9ybWF0cy5pbmNsdWRlcyhjb2xvclN0cmluZy5mb3JtYXQpXG5cdFx0KTtcblx0fVxuXG5cdHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIC9eI1swLTlBLUZhLWZdezYsOH0kLy50ZXN0KHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gaXNGb3JtYXQoZm9ybWF0OiB1bmtub3duKTogZm9ybWF0IGlzIENvbG9yRm9ybWF0IHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgZm9ybWF0ID09PSAnc3RyaW5nJyAmJlxuXHRcdFsnY215aycsICdoZXgnLCAnaHNsJywgJ2hzdicsICdsYWInLCAncmdiJywgJ3NsJywgJ3N2JywgJ3h5eiddLmluY2x1ZGVzKFxuXHRcdFx0Zm9ybWF0XG5cdFx0KVxuXHQpO1xufVxuXG4vLyAqKioqKioqKiBTRUNUSU9OIDI6IE5hcnJvdyBUeXBlIEd1YXJkcyAqKioqKioqKlxuXG5mdW5jdGlvbiBpc0NNWUtDb2xvcih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENNWUsge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIENNWUspLmZvcm1hdCA9PT0gJ2NteWsnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZSykudmFsdWUuY3lhbiA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUspLnZhbHVlLm1hZ2VudGEgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLKS52YWx1ZS55ZWxsb3cgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLKS52YWx1ZS5rZXkgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzQ01ZS0Zvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBDTVlLIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdjbXlrJyk7XG59XG5cbmZ1bmN0aW9uIGlzQ01ZS1N0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENNWUtfU3RyaW5nUHJvcHMge1xuXHRyZXR1cm4gKFxuXHRcdGlzQ29sb3JTdHJpbmcodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgQ01ZS19TdHJpbmdQcm9wcykuZm9ybWF0ID09PSAnY215aycgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLX1N0cmluZ1Byb3BzKS52YWx1ZS5jeWFuID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZS19TdHJpbmdQcm9wcykudmFsdWUubWFnZW50YSA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUtfU3RyaW5nUHJvcHMpLnZhbHVlLnllbGxvdyA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUtfU3RyaW5nUHJvcHMpLnZhbHVlLmtleSA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNIZXgodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIZXgge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIEhleCkuZm9ybWF0ID09PSAnaGV4JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhleCkudmFsdWUuaGV4ID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hleEZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBIZXgge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2hleCcpO1xufVxuXG5mdW5jdGlvbiBpc0hTTENvbG9yKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgSFNMIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBIU0wpLmZvcm1hdCA9PT0gJ2hzbCcgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU0wpLnZhbHVlLmh1ZSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTCkudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTCkudmFsdWUubGlnaHRuZXNzID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hTTEZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBIU0wge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2hzbCcpO1xufVxuXG5mdW5jdGlvbiBpc0hTTFN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhTTF9TdHJpbmdQcm9wcyB7XG5cdHJldHVybiAoXG5cdFx0aXNDb2xvclN0cmluZyh2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBIU0xfU3RyaW5nUHJvcHMpLmZvcm1hdCA9PT0gJ2hzbCcgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU0xfU3RyaW5nUHJvcHMpLnZhbHVlLmh1ZSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTF9TdHJpbmdQcm9wcykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTF9TdHJpbmdQcm9wcykudmFsdWUubGlnaHRuZXNzID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hTVkNvbG9yKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgSFNWIHtcblx0cmV0dXJuIChcblx0XHRjb3JlVXRpbHMuZ3VhcmRzLmlzQ29sb3IodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgSFNWKS5mb3JtYXQgPT09ICdoc3YnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNWKS52YWx1ZS5odWUgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1YpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1YpLnZhbHVlLnZhbHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hTVkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBIU1Yge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2hzdicpO1xufVxuXG5mdW5jdGlvbiBpc0hTVlN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhTVl9TdHJpbmdQcm9wcyB7XG5cdHJldHVybiAoXG5cdFx0aXNDb2xvclN0cmluZyh2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBIU1ZfU3RyaW5nUHJvcHMpLmZvcm1hdCA9PT0gJ2hzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1ZfU3RyaW5nUHJvcHMpLnZhbHVlLmh1ZSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVl9TdHJpbmdQcm9wcykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVl9TdHJpbmdQcm9wcykudmFsdWUudmFsdWUgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzTEFCKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgTEFCIHtcblx0cmV0dXJuIChcblx0XHRjb3JlVXRpbHMuZ3VhcmRzLmlzQ29sb3IodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgTEFCKS5mb3JtYXQgPT09ICdsYWInICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgTEFCKS52YWx1ZS5sID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgTEFCKS52YWx1ZS5hID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgTEFCKS52YWx1ZS5iID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0xBQkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBMQUIge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2xhYicpO1xufVxuXG5mdW5jdGlvbiBpc1JHQih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFJHQiB7XG5cdHJldHVybiAoXG5cdFx0Y29yZVV0aWxzLmd1YXJkcy5pc0NvbG9yKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFJHQikuZm9ybWF0ID09PSAncmdiJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFJHQikudmFsdWUucmVkID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgUkdCKS52YWx1ZS5ncmVlbiA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFJHQikudmFsdWUuYmx1ZSA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNSR0JGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgUkdCIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdyZ2InKTtcbn1cblxuZnVuY3Rpb24gaXNTTENvbG9yKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgU0wge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFNMKS5mb3JtYXQgPT09ICdzbCcgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTTCkudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNMKS52YWx1ZS5saWdodG5lc3MgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzU0xGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgU0wge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ3NsJyk7XG59XG5cbmZ1bmN0aW9uIGlzU0xTdHJpbmcodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBTTF9TdHJpbmdQcm9wcyB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgU0xfU3RyaW5nUHJvcHMpLmZvcm1hdCA9PT0gJ3NsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNMX1N0cmluZ1Byb3BzKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU0xfU3RyaW5nUHJvcHMpLnZhbHVlLmxpZ2h0bmVzcyA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNTVkNvbG9yKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgU1Yge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFNWKS5mb3JtYXQgPT09ICdzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTVikudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNWKS52YWx1ZS52YWx1ZSA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNTVkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBTViB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnc3YnKTtcbn1cblxuZnVuY3Rpb24gaXNTVlN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFNWX1N0cmluZ1Byb3BzIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBTVl9TdHJpbmdQcm9wcykuZm9ybWF0ID09PSAnc3YnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU1ZfU3RyaW5nUHJvcHMpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTVl9TdHJpbmdQcm9wcykudmFsdWUudmFsdWUgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzWFlaKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgWFlaIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBYWVopLmZvcm1hdCA9PT0gJ3h5eicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBYWVopLnZhbHVlLnggPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBYWVopLnZhbHVlLnkgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBYWVopLnZhbHVlLnogPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzWFlaRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIFhZWiB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAneHl6Jyk7XG59XG5cbi8vICoqKioqIFNFQ1RJT04gMzogVXRpbGl0eSBHdWFyZHMgKioqKipcblxuZnVuY3Rpb24gZW5zdXJlSGFzaCh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcblx0cmV0dXJuIHZhbHVlLnN0YXJ0c1dpdGgoJyMnKSA/IHZhbHVlIDogYCMke3ZhbHVlfWA7XG59XG5cbmZ1bmN0aW9uIGlzQ29udmVydGlibGVDb2xvcihcblx0Y29sb3I6IENvbG9yXG4pOiBjb2xvciBpcyBDTVlLIHwgSGV4IHwgSFNMIHwgSFNWIHwgTEFCIHwgUkdCIHtcblx0cmV0dXJuIChcblx0XHRjb2xvci5mb3JtYXQgPT09ICdjbXlrJyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2hleCcgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdoc2wnIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnaHN2JyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2xhYicgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdyZ2InXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSW5wdXRFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCk6IGVsZW1lbnQgaXMgSFRNTEVsZW1lbnQge1xuXHRyZXR1cm4gZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGlzU3RvcmVkUGFsZXR0ZShvYmo6IHVua25vd24pOiBvYmogaXMgU3RvcmVkUGFsZXR0ZSB7XG5cdGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCBvYmogPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuXHRjb25zdCBjYW5kaWRhdGUgPSBvYmogYXMgUGFydGlhbDxTdG9yZWRQYWxldHRlPjtcblxuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiBjYW5kaWRhdGUudGFibGVJRCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgY2FuZGlkYXRlLnBhbGV0dGUgPT09ICdvYmplY3QnICYmXG5cdFx0QXJyYXkuaXNBcnJheShjYW5kaWRhdGUucGFsZXR0ZS5pdGVtcykgJiZcblx0XHR0eXBlb2YgY2FuZGlkYXRlLnBhbGV0dGUuaWQgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG5hcnJvd1RvQ29sb3IoXG5cdGNvbG9yOiBDb2xvciB8IENvbG9yX1N0cmluZ1Byb3BzXG4pOiBQcm9taXNlPENvbG9yIHwgbnVsbD4ge1xuXHRpZiAoaXNDb2xvclN0cmluZyhjb2xvcikpIHtcblx0XHRyZXR1cm4gY29yZVV0aWxzLmNvbnZlcnQuY29sb3JTdHJpbmdUb0NvbG9yKGNvbG9yKTtcblx0fVxuXG5cdHN3aXRjaCAoY29sb3IuZm9ybWF0IGFzIENvbG9yU3BhY2VFeHRlbmRlZCkge1xuXHRcdGNhc2UgJ2NteWsnOlxuXHRcdGNhc2UgJ2hleCc6XG5cdFx0Y2FzZSAnaHNsJzpcblx0XHRjYXNlICdoc3YnOlxuXHRcdGNhc2UgJ2xhYic6XG5cdFx0Y2FzZSAnc2wnOlxuXHRcdGNhc2UgJ3N2Jzpcblx0XHRjYXNlICdyZ2InOlxuXHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbi8vICoqKioqKioqIFNFQ1RJT04gNDogVFJBTlNGT1JNIFVUSUxTICoqKioqKioqXG5cbmZ1bmN0aW9uIGNvbG9yVG9Db2xvclN0cmluZyhjb2xvcjogQ29sb3IpOiBDb2xvcl9TdHJpbmdQcm9wcyB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAnY29sb3JUb0NvbG9yU3RyaW5nKCknO1xuXHRjb25zdCBjbG9uZWRDb2xvciA9IGNvcmVVdGlscy5iYXNlLmNsb25lKGNvbG9yKTtcblxuXHRpZiAoaXNDb2xvclN0cmluZyhjbG9uZWRDb2xvcikpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcikge1xuXHRcdFx0bG9nZ2VyLmluZm8oXG5cdFx0XHRcdGBBbHJlYWR5IGZvcm1hdHRlZCBhcyBjb2xvciBzdHJpbmc6ICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsb25lZENvbG9yO1xuXHR9XG5cblx0aWYgKGlzQ01ZS0NvbG9yKGNsb25lZENvbG9yKSkge1xuXHRcdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhcblx0XHRcdGNsb25lZENvbG9yLnZhbHVlXG5cdFx0KSBhcyBDTVlLWyd2YWx1ZSddO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2NteWsnLFxuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0Y3lhbjogYCR7bmV3VmFsdWUuY3lhbn0lYCxcblx0XHRcdFx0bWFnZW50YTogYCR7bmV3VmFsdWUubWFnZW50YX0lYCxcblx0XHRcdFx0eWVsbG93OiBgJHtuZXdWYWx1ZS55ZWxsb3d9JWAsXG5cdFx0XHRcdGtleTogYCR7bmV3VmFsdWUua2V5fSVgXG5cdFx0XHR9IGFzIENNWUtfU3RyaW5nUHJvcHNbJ3ZhbHVlJ11cblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzSGV4KGNsb25lZENvbG9yKSkge1xuXHRcdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhcblx0XHRcdChjbG9uZWRDb2xvciBhcyBIZXgpLnZhbHVlXG5cdFx0KSBhcyBIZXhbJ3ZhbHVlJ107XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnaGV4Jyxcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGhleDogYCR7bmV3VmFsdWUuaGV4fWBcblx0XHRcdH0gYXMgSGV4X1N0cmluZ1Byb3BzWyd2YWx1ZSddXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc0hTTENvbG9yKGNsb25lZENvbG9yKSkge1xuXHRcdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhcblx0XHRcdGNsb25lZENvbG9yLnZhbHVlXG5cdFx0KSBhcyBIU0xbJ3ZhbHVlJ107XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnaHNsJyxcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogYCR7bmV3VmFsdWUuaHVlfWAsXG5cdFx0XHRcdHNhdHVyYXRpb246IGAke25ld1ZhbHVlLnNhdHVyYXRpb259JWAsXG5cdFx0XHRcdGxpZ2h0bmVzczogYCR7bmV3VmFsdWUubGlnaHRuZXNzfSVgXG5cdFx0XHR9IGFzIEhTTF9TdHJpbmdQcm9wc1sndmFsdWUnXVxuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNIU1ZDb2xvcihjbG9uZWRDb2xvcikpIHtcblx0XHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoXG5cdFx0XHRjbG9uZWRDb2xvci52YWx1ZVxuXHRcdCkgYXMgSFNWWyd2YWx1ZSddO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2hzdicsXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6IGAke25ld1ZhbHVlLmh1ZX1gLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBgJHtuZXdWYWx1ZS5zYXR1cmF0aW9ufSVgLFxuXHRcdFx0XHR2YWx1ZTogYCR7bmV3VmFsdWUudmFsdWV9JWBcblx0XHRcdH0gYXMgSFNWX1N0cmluZ1Byb3BzWyd2YWx1ZSddXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc0xBQihjbG9uZWRDb2xvcikpIHtcblx0XHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoXG5cdFx0XHRjbG9uZWRDb2xvci52YWx1ZVxuXHRcdCkgYXMgTEFCWyd2YWx1ZSddO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2xhYicsXG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRsOiBgJHtuZXdWYWx1ZS5sfWAsXG5cdFx0XHRcdGE6IGAke25ld1ZhbHVlLmF9YCxcblx0XHRcdFx0YjogYCR7bmV3VmFsdWUuYn1gXG5cdFx0XHR9IGFzIExBQl9TdHJpbmdQcm9wc1sndmFsdWUnXVxuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNSR0IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXRQZXJjZW50YWdlVmFsdWVzKFxuXHRcdFx0Y2xvbmVkQ29sb3IudmFsdWVcblx0XHQpIGFzIFJHQlsndmFsdWUnXTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdyZ2InLFxuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0cmVkOiBgJHtuZXdWYWx1ZS5yZWR9YCxcblx0XHRcdFx0Z3JlZW46IGAke25ld1ZhbHVlLmdyZWVufWAsXG5cdFx0XHRcdGJsdWU6IGAke25ld1ZhbHVlLmJsdWV9YFxuXHRcdFx0fSBhcyBSR0JfU3RyaW5nUHJvcHNbJ3ZhbHVlJ11cblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzWFlaKGNsb25lZENvbG9yKSkge1xuXHRcdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhcblx0XHRcdGNsb25lZENvbG9yLnZhbHVlXG5cdFx0KSBhcyBYWVpbJ3ZhbHVlJ107XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAneHl6Jyxcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHg6IGAke25ld1ZhbHVlLnh9YCxcblx0XHRcdFx0eTogYCR7bmV3VmFsdWUueX1gLFxuXHRcdFx0XHR6OiBgJHtuZXdWYWx1ZS56fWBcblx0XHRcdH0gYXMgWFlaX1N0cmluZ1Byb3BzWyd2YWx1ZSddXG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRpZiAoIW1vZGUuZ3JhY2VmdWxFcnJvcnMpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZm9ybWF0OiAke2Nsb25lZENvbG9yLmZvcm1hdH1gKTtcblx0XHR9IGVsc2UgaWYgKGxvZ01vZGUuZXJyb3IpIHtcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YFVuc3VwcG9ydGVkIGZvcm1hdDogJHtjbG9uZWRDb2xvci5mb3JtYXR9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblx0XHR9IGVsc2UgaWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUud2Fybikge1xuXHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdCdGYWlsZWQgdG8gY29udmVydCB0byBjb2xvciBzdHJpbmcuJyxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVmYXVsdHMuY29sb3JzLnN0cmluZ3MuaHNsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHVua25vd24+Pihcblx0dmFsdWU6IFRcbik6IFQge1xuXHRyZXR1cm4gT2JqZWN0LmVudHJpZXModmFsdWUpLnJlZHVjZShcblx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHQoYWNjIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVtrZXldID0gW1xuXHRcdFx0XHQnc2F0dXJhdGlvbicsXG5cdFx0XHRcdCdsaWdodG5lc3MnLFxuXHRcdFx0XHQndmFsdWUnLFxuXHRcdFx0XHQnY3lhbicsXG5cdFx0XHRcdCdtYWdlbnRhJyxcblx0XHRcdFx0J3llbGxvdycsXG5cdFx0XHRcdCdrZXknXG5cdFx0XHRdLmluY2x1ZGVzKGtleSlcblx0XHRcdFx0PyBgJHt2YWx9JWBcblx0XHRcdFx0OiB2YWw7XG5cdFx0XHRyZXR1cm4gYWNjO1xuXHRcdH0sXG5cdFx0e30gYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj5cblx0KSBhcyBUO1xufVxuXG5mdW5jdGlvbiBnZXRDb2xvclN0cmluZyhjb2xvcjogQ29sb3IpOiBzdHJpbmcgfCBudWxsIHtcblx0Y29uc3QgdGhpc01ldGhvZCA9ICdnZXRDb2xvclN0cmluZygpJztcblxuXHR0cnkge1xuXHRcdGNvbnN0IGZvcm1hdHRlcnMgPSB7XG5cdFx0XHRjbXlrOiAoYzogQ01ZSykgPT5cblx0XHRcdFx0YGNteWsoJHtjLnZhbHVlLmN5YW59LCAke2MudmFsdWUubWFnZW50YX0sICR7Yy52YWx1ZS55ZWxsb3d9LCAke2MudmFsdWUua2V5fSlgLFxuXHRcdFx0aGV4OiAoYzogSGV4KSA9PiBjLnZhbHVlLmhleCxcblx0XHRcdGhzbDogKGM6IEhTTCkgPT5cblx0XHRcdFx0YGhzbCgke2MudmFsdWUuaHVlfSwgJHtjLnZhbHVlLnNhdHVyYXRpb259JSwgJHtjLnZhbHVlLmxpZ2h0bmVzc30lKWAsXG5cdFx0XHRoc3Y6IChjOiBIU1YpID0+XG5cdFx0XHRcdGBoc3YoJHtjLnZhbHVlLmh1ZX0sICR7Yy52YWx1ZS5zYXR1cmF0aW9ufSUsICR7Yy52YWx1ZS52YWx1ZX0lKWAsXG5cdFx0XHRsYWI6IChjOiBMQUIpID0+IGBsYWIoJHtjLnZhbHVlLmx9LCAke2MudmFsdWUuYX0sICR7Yy52YWx1ZS5ifSlgLFxuXHRcdFx0cmdiOiAoYzogUkdCKSA9PlxuXHRcdFx0XHRgcmdiKCR7Yy52YWx1ZS5yZWR9LCAke2MudmFsdWUuZ3JlZW59LCAke2MudmFsdWUuYmx1ZX0pYCxcblx0XHRcdHh5ejogKGM6IFhZWikgPT4gYHh5eigke2MudmFsdWUueH0sICR7Yy52YWx1ZS55fSwgJHtjLnZhbHVlLnp9KWBcblx0XHR9O1xuXG5cdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5jbXlrKGNvbG9yKTtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmhleChjb2xvcik7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5oc2woY29sb3IpO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMuaHN2KGNvbG9yKTtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmxhYihjb2xvcik7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5yZ2IoY29sb3IpO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMueHl6KGNvbG9yKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGlmICghbG9nTW9kZS5lcnJvcilcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0XHRgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0IGZvciAke2NvbG9yfWAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCFsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgZ2V0Q29sb3JTdHJpbmcgZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleEFscGhhVG9OdW1lcmljQWxwaGEoaGV4QWxwaGE6IHN0cmluZyk6IG51bWJlciB7XG5cdHJldHVybiBwYXJzZUludChoZXhBbHBoYSwgMTYpIC8gMjU1O1xufVxuXG5jb25zdCBwYXJzZUNvbG9yID0gKGNvbG9yU3BhY2U6IENvbG9yU3BhY2UsIHZhbHVlOiBzdHJpbmcpOiBDb2xvciB8IG51bGwgPT4ge1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ3BhcnNlQ29sb3InO1xuXG5cdHRyeSB7XG5cdFx0c3dpdGNoIChjb2xvclNwYWNlKSB7XG5cdFx0XHRjYXNlICdjbXlrJzoge1xuXHRcdFx0XHRjb25zdCBbYywgbSwgeSwga10gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDUpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGN5YW46IGNvcmVVdGlscy5icmFuZC5hc1BlcmNlbnRpbGUoYyksXG5cdFx0XHRcdFx0XHRtYWdlbnRhOiBjb3JlVXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKG0pLFxuXHRcdFx0XHRcdFx0eWVsbG93OiBjb3JlVXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKHkpLFxuXHRcdFx0XHRcdFx0a2V5OiBjb3JlVXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKGspXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0Y29uc3QgaGV4VmFsdWUgPSB2YWx1ZS5zdGFydHNXaXRoKCcjJykgPyB2YWx1ZSA6IGAjJHt2YWx1ZX1gO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGhleDogY29yZVV0aWxzLmJyYW5kLmFzSGV4U2V0KGhleFZhbHVlKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHR9O1xuXHRcdFx0Y2FzZSAnaHNsJzoge1xuXHRcdFx0XHRjb25zdCBbaCwgcywgbF0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGh1ZTogY29yZVV0aWxzLmJyYW5kLmFzUmFkaWFsKGgpLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogY29yZVV0aWxzLmJyYW5kLmFzUGVyY2VudGlsZShzKSxcblx0XHRcdFx0XHRcdGxpZ2h0bmVzczogY29yZVV0aWxzLmJyYW5kLmFzUGVyY2VudGlsZShsKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAnaHN2Jzoge1xuXHRcdFx0XHRjb25zdCBbaCwgcywgdl0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGh1ZTogY29yZVV0aWxzLmJyYW5kLmFzUmFkaWFsKGgpLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogY29yZVV0aWxzLmJyYW5kLmFzUGVyY2VudGlsZShzKSxcblx0XHRcdFx0XHRcdHZhbHVlOiBjb3JlVXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKHYpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdsYWInOiB7XG5cdFx0XHRcdGNvbnN0IFtsLCBhLCBiXSA9IHBhcnNlQ29tcG9uZW50cyh2YWx1ZSwgNCk7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGw6IGNvcmVVdGlscy5icmFuZC5hc0xBQl9MKGwpLFxuXHRcdFx0XHRcdFx0YTogY29yZVV0aWxzLmJyYW5kLmFzTEFCX0EoYSksXG5cdFx0XHRcdFx0XHRiOiBjb3JlVXRpbHMuYnJhbmQuYXNMQUJfQihiKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAncmdiJzoge1xuXHRcdFx0XHRjb25zdCBjb21wb25lbnRzID0gdmFsdWUuc3BsaXQoJywnKS5tYXAoTnVtYmVyKTtcblxuXHRcdFx0XHRpZiAoY29tcG9uZW50cy5zb21lKGlzTmFOKSlcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgUkdCIGZvcm1hdCcpO1xuXG5cdFx0XHRcdGNvbnN0IFtyLCBnLCBiXSA9IGNvbXBvbmVudHM7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0cmVkOiBjb3JlVXRpbHMuYnJhbmQuYXNCeXRlUmFuZ2UociksXG5cdFx0XHRcdFx0XHRncmVlbjogY29yZVV0aWxzLmJyYW5kLmFzQnl0ZVJhbmdlKGcpLFxuXHRcdFx0XHRcdFx0Ymx1ZTogY29yZVV0aWxzLmJyYW5kLmFzQnl0ZVJhbmdlKGIpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRjb25zdCBtZXNzYWdlID0gYFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtjb2xvclNwYWNlfWA7XG5cblx0XHRcdFx0aWYgKG1vZGUuZ3JhY2VmdWxFcnJvcnMpIHtcblx0XHRcdFx0XHRpZiAobG9nTW9kZS5lcnJvcikgbG9nZ2VyLmVycm9yKG1lc3NhZ2UpO1xuXHRcdFx0XHRcdGVsc2UgaWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUud2Fybilcblx0XHRcdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdFx0XHRgRmFpbGVkIHRvIHBhcnNlIGNvbG9yOiAke21lc3NhZ2V9YCxcblx0XHRcdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBwYXJzZUNvbG9yIGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufTtcblxuZnVuY3Rpb24gcGFyc2VDb21wb25lbnRzKHZhbHVlOiBzdHJpbmcsIGNvdW50OiBudW1iZXIpOiBudW1iZXJbXSB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAncGFyc2VDb21wb25lbnRzKCknO1xuXG5cdHRyeSB7XG5cdFx0Y29uc3QgY29tcG9uZW50cyA9IHZhbHVlXG5cdFx0XHQuc3BsaXQoJywnKVxuXHRcdFx0Lm1hcCh2YWwgPT5cblx0XHRcdFx0dmFsLnRyaW0oKS5lbmRzV2l0aCgnJScpXG5cdFx0XHRcdFx0PyBwYXJzZUZsb2F0KHZhbClcblx0XHRcdFx0XHQ6IHBhcnNlRmxvYXQodmFsKSAqIDEwMFxuXHRcdFx0KTtcblxuXHRcdGlmIChjb21wb25lbnRzLmxlbmd0aCAhPT0gY291bnQpXG5cdFx0XHRpZiAoIW1vZGUuZ3JhY2VmdWxFcnJvcnMpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgJHtjb3VudH0gY29tcG9uZW50cy5gKTtcblx0XHRcdGVsc2UgaWYgKGxvZ01vZGUuZXJyb3IpIHtcblx0XHRcdFx0aWYgKCFtb2RlLnF1aWV0ICYmIGxvZ01vZGUud2Fybilcblx0XHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRcdGBFeHBlY3RlZCAke2NvdW50fSBjb21wb25lbnRzLmAsXG5cdFx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9XG5cblx0XHRyZXR1cm4gY29tcG9uZW50cztcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEVycm9yIHBhcnNpbmcgY29tcG9uZW50czogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIFtdO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHN0cmlwSGFzaEZyb21IZXgoaGV4OiBIZXgpOiBIZXgge1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ3N0cmlwSGFzaEZyb21IZXgoKSc7XG5cblx0dHJ5IHtcblx0XHRjb25zdCBoZXhTdHJpbmcgPSBgJHtoZXgudmFsdWUuaGV4fWA7XG5cblx0XHRyZXR1cm4gaGV4LnZhbHVlLmhleC5zdGFydHNXaXRoKCcjJylcblx0XHRcdD8ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRoZXg6IGNvcmVVdGlscy5icmFuZC5hc0hleFNldChoZXhTdHJpbmcuc2xpY2UoMSkpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnIGFzICdoZXgnXG5cdFx0XHRcdH1cblx0XHRcdDogaGV4O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgc3RyaXBIYXNoRnJvbUhleCBlcnJvcjogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXG5cdFx0Y29uc3QgdW5icmFuZGVkSGV4ID0gY29yZVV0aWxzLmJhc2UuY2xvbmUoXG5cdFx0XHRkZWZhdWx0cy5jb2xvcnMuYmFzZS51bmJyYW5kZWQuaGV4XG5cdFx0KTtcblxuXHRcdHJldHVybiBjb3JlVXRpbHMuYnJhbmRDb2xvci5hc0hleCh1bmJyYW5kZWRIZXgpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHN0cmlwUGVyY2VudEZyb21WYWx1ZXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIG51bWJlciB8IHN0cmluZz4+KFxuXHR2YWx1ZTogVFxuKTogeyBbSyBpbiBrZXlvZiBUXTogVFtLXSBleHRlbmRzIGAke251bWJlcn0lYCA/IG51bWJlciA6IFRbS10gfSB7XG5cdHJldHVybiBPYmplY3QuZW50cmllcyh2YWx1ZSkucmVkdWNlKFxuXHRcdChhY2MsIFtrZXksIHZhbF0pID0+IHtcblx0XHRcdGNvbnN0IHBhcnNlZFZhbHVlID1cblx0XHRcdFx0dHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgdmFsLmVuZHNXaXRoKCclJylcblx0XHRcdFx0XHQ/IHBhcnNlRmxvYXQodmFsLnNsaWNlKDAsIC0xKSlcblx0XHRcdFx0XHQ6IHZhbDtcblx0XHRcdGFjY1trZXkgYXMga2V5b2YgVF0gPSBwYXJzZWRWYWx1ZSBhcyBUW2tleW9mIFRdIGV4dGVuZHMgYCR7bnVtYmVyfSVgXG5cdFx0XHRcdD8gbnVtYmVyXG5cdFx0XHRcdDogVFtrZXlvZiBUXTtcblx0XHRcdHJldHVybiBhY2M7XG5cdFx0fSxcblx0XHR7fSBhcyB7IFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgYCR7bnVtYmVyfSVgID8gbnVtYmVyIDogVFtLXSB9XG5cdCk7XG59XG5cbmV4cG9ydCBjb25zdCBjb2xvclV0aWxzOiBDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2VbJ3V0aWxzJ11bJ2NvbG9yJ10gPSB7XG5cdGNvbG9yVG9Db2xvclN0cmluZyxcblx0ZW5zdXJlSGFzaCxcblx0Zm9ybWF0UGVyY2VudGFnZVZhbHVlcyxcblx0Z2V0Q29sb3JTdHJpbmcsXG5cdGlzQ01ZS0NvbG9yLFxuXHRpc0NNWUtGb3JtYXQsXG5cdGlzQ01ZS1N0cmluZyxcblx0aXNDb2xvckZvcm1hdCxcblx0aXNDb2xvclN0cmluZyxcblx0aXNDb2xvclNwYWNlLFxuXHRpc0NvbG9yU3BhY2VFeHRlbmRlZCxcblx0aXNDb252ZXJ0aWJsZUNvbG9yLFxuXHRpc0Zvcm1hdCxcblx0aXNIZXgsXG5cdGlzSGV4Rm9ybWF0LFxuXHRpc0hTTENvbG9yLFxuXHRpc0hTTEZvcm1hdCxcblx0aXNIU0xTdHJpbmcsXG5cdGlzSW5wdXRFbGVtZW50LFxuXHRpc0hTVkNvbG9yLFxuXHRpc0hTVkZvcm1hdCxcblx0aXNIU1ZTdHJpbmcsXG5cdGlzTEFCLFxuXHRpc0xBQkZvcm1hdCxcblx0aXNSR0IsXG5cdGlzUkdCRm9ybWF0LFxuXHRpc1NMQ29sb3IsXG5cdGlzU0xGb3JtYXQsXG5cdGlzU0xTdHJpbmcsXG5cdGlzU3RvcmVkUGFsZXR0ZSxcblx0aXNTVkNvbG9yLFxuXHRpc1NWRm9ybWF0LFxuXHRpc1NWU3RyaW5nLFxuXHRpc1hZWixcblx0aXNYWVpGb3JtYXQsXG5cdG5hcnJvd1RvQ29sb3IsXG5cdHBhcnNlQ29sb3IsXG5cdHBhcnNlQ29tcG9uZW50cyxcblx0c3RyaXBIYXNoRnJvbUhleCxcblx0c3RyaXBQZXJjZW50RnJvbVZhbHVlc1xufSBhcyBjb25zdDtcblxuZXhwb3J0IHsgaGV4QWxwaGFUb051bWVyaWNBbHBoYSwgc3RyaXBIYXNoRnJvbUhleCB9O1xuIl19