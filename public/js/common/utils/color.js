// File: src/common/utils/color.ts
import { core } from '../index.js';
import { config } from '../../config.js';
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
        console.error(`addHashToHex error: ${error}`);
        return config.defaults.colors.hex;
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
        throw new Error(`Invalid hex color: ${hex}. Expected format #RRGGBBAA`);
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
                console.error(`Unsupported color format for ${color}`);
                return null;
        }
    }
    catch (error) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL3V0aWxzL2NvbG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGtDQUFrQztBQUVsQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFpQ3RDLGtEQUFrRDtBQUVsRCxTQUFTLGFBQWEsQ0FDckIsS0FBWSxFQUNaLE1BQW1CO0lBRW5CLE9BQU8sS0FBSyxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUM7QUFDaEMsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLEtBQWE7SUFDbEMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzRSxDQUFDO0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxLQUFhO0lBQzFDLE9BQU87UUFDTixNQUFNO1FBQ04sS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxJQUFJO1FBQ0osSUFBSTtRQUNKLEtBQUs7S0FDTCxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBRUQsTUFBTSxVQUFVLGFBQWEsQ0FBQyxLQUFjO0lBQzNDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssS0FBSyxJQUFJO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFFOUQsTUFBTSxXQUFXLEdBQUcsS0FBb0IsQ0FBQztJQUN6QyxNQUFNLGtCQUFrQixHQUE0QjtRQUNuRCxNQUFNO1FBQ04sS0FBSztRQUNMLEtBQUs7UUFDTCxJQUFJO1FBQ0osSUFBSTtLQUNKLENBQUM7SUFFRixPQUFPLENBQ04sT0FBTyxJQUFJLFdBQVc7UUFDdEIs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O1NBQ1osUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUVuQixPQUFPLEdBQUcsR0FBRyxHQUFHLFFBQVEsRUFBRSxDQUFDO0FBQzVCLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUc7SUFDcEIsWUFBWTtJQUNaLGtCQUFrQjtJQUNsQixjQUFjO0lBQ2QsVUFBVTtJQUNWLFdBQVc7SUFDWCxzQkFBc0I7SUFDdEIsZUFBZTtJQUNmLGNBQWM7SUFDZCxzQkFBc0I7SUFDdEIsV0FBVztJQUNYLFlBQVk7SUFDWixZQUFZO0lBQ1osYUFBYTtJQUNiLGFBQWE7SUFDYixZQUFZO0lBQ1osb0JBQW9CO0lBQ3BCLGtCQUFrQjtJQUNsQixRQUFRO0lBQ1IsS0FBSztJQUNMLFdBQVc7SUFDWCxVQUFVO0lBQ1YsV0FBVztJQUNYLFdBQVc7SUFDWCxjQUFjO0lBQ2QsVUFBVTtJQUNWLFdBQVc7SUFDWCxXQUFXO0lBQ1gsS0FBSztJQUNMLFdBQVc7SUFDWCxLQUFLO0lBQ0wsV0FBVztJQUNYLFNBQVM7SUFDVCxVQUFVO0lBQ1YsVUFBVTtJQUNWLGVBQWU7SUFDZixTQUFTO0lBQ1QsVUFBVTtJQUNWLFVBQVU7SUFDVixLQUFLO0lBQ0wsV0FBVztJQUNYLGFBQWE7SUFDYixVQUFVO0lBQ1YsZUFBZTtJQUNmLGlCQUFpQjtJQUNqQixnQkFBZ0I7SUFDaEIsc0JBQXNCO0lBQ3RCLGNBQWM7Q0FDZCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2NvbW1vbi91dGlscy9jb2xvci50c1xuXG5pbXBvcnQgeyBjb3JlIH0gZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7XG5cdENNWUssXG5cdENNWUtTdHJpbmcsXG5cdENNWUtWYWx1ZVN0cmluZyxcblx0Q29sb3IsXG5cdENvbG9yU3BhY2UsXG5cdENvbG9yU3BhY2VFeHRlbmRlZCxcblx0Q29sb3JTdHJpbmcsXG5cdEZvcm1hdCxcblx0SGV4LFxuXHRIZXhWYWx1ZSxcblx0SGV4VmFsdWVTdHJpbmcsXG5cdEhTTCxcblx0SFNMU3RyaW5nLFxuXHRIU0xWYWx1ZVN0cmluZyxcblx0SFNWLFxuXHRIU1ZTdHJpbmcsXG5cdEhTVlZhbHVlU3RyaW5nLFxuXHRMQUIsXG5cdExBQlZhbHVlU3RyaW5nLFxuXHRSR0IsXG5cdFJHQlZhbHVlLFxuXHRSR0JWYWx1ZVN0cmluZyxcblx0U0wsXG5cdFNMU3RyaW5nLFxuXHRTdG9yZWRQYWxldHRlLFxuXHRTVixcblx0U1ZTdHJpbmcsXG5cdFhZWixcblx0WFlaVmFsdWVTdHJpbmdcbn0gZnJvbSAnLi4vLi4vaW5kZXgnO1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDE6IFJvYnVzdCBUeXBlIEd1YXJkcyAqKioqKioqKlxuXG5mdW5jdGlvbiBpc0NvbG9yRm9ybWF0PFQgZXh0ZW5kcyBDb2xvcj4oXG5cdGNvbG9yOiBDb2xvcixcblx0Zm9ybWF0OiBUWydmb3JtYXQnXVxuKTogY29sb3IgaXMgVCB7XG5cdHJldHVybiBjb2xvci5mb3JtYXQgPT09IGZvcm1hdDtcbn1cblxuZnVuY3Rpb24gaXNDb2xvclNwYWNlKHZhbHVlOiBzdHJpbmcpOiB2YWx1ZSBpcyBDb2xvclNwYWNlIHtcblx0cmV0dXJuIFsnY215aycsICdoZXgnLCAnaHNsJywgJ2hzdicsICdsYWInLCAncmdiJywgJ3h5eiddLmluY2x1ZGVzKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gaXNDb2xvclNwYWNlRXh0ZW5kZWQodmFsdWU6IHN0cmluZyk6IHZhbHVlIGlzIENvbG9yU3BhY2VFeHRlbmRlZCB7XG5cdHJldHVybiBbXG5cdFx0J2NteWsnLFxuXHRcdCdoZXgnLFxuXHRcdCdoc2wnLFxuXHRcdCdoc3YnLFxuXHRcdCdsYWInLFxuXHRcdCdyZ2InLFxuXHRcdCdzbCcsXG5cdFx0J3N2Jyxcblx0XHQneHl6J1xuXHRdLmluY2x1ZGVzKHZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29sb3JTdHJpbmcodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDb2xvclN0cmluZyB7XG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8IHZhbHVlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cblx0Y29uc3QgY29sb3JTdHJpbmcgPSB2YWx1ZSBhcyBDb2xvclN0cmluZztcblx0Y29uc3QgdmFsaWRTdHJpbmdGb3JtYXRzOiBDb2xvclN0cmluZ1snZm9ybWF0J11bXSA9IFtcblx0XHQnY215aycsXG5cdFx0J2hzbCcsXG5cdFx0J2hzdicsXG5cdFx0J3NsJyxcblx0XHQnc3YnXG5cdF07XG5cblx0cmV0dXJuIChcblx0XHQndmFsdWUnIGluIGNvbG9yU3RyaW5nICYmXG5cdFx0J2Zvcm1hdCcgaW4gY29sb3JTdHJpbmcgJiZcblx0XHR2YWxpZFN0cmluZ0Zvcm1hdHMuaW5jbHVkZXMoY29sb3JTdHJpbmcuZm9ybWF0KVxuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0Zvcm1hdChmb3JtYXQ6IHVua25vd24pOiBmb3JtYXQgaXMgRm9ybWF0IHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgZm9ybWF0ID09PSAnc3RyaW5nJyAmJlxuXHRcdFsnY215aycsICdoZXgnLCAnaHNsJywgJ2hzdicsICdsYWInLCAncmdiJywgJ3NsJywgJ3N2JywgJ3h5eiddLmluY2x1ZGVzKFxuXHRcdFx0Zm9ybWF0XG5cdFx0KVxuXHQpO1xufVxuXG4vLyAqKioqKioqKiBTRUNUSU9uIDI6IE5hcnJvd2VyIFR5cGUgR3VhcmRzICoqKioqKioqXG5cbmZ1bmN0aW9uIGlzQ01ZS0NvbG9yKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ01ZSyB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgQ01ZSykuZm9ybWF0ID09PSAnY215aycgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLKS52YWx1ZS5jeWFuID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZSykudmFsdWUubWFnZW50YSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUspLnZhbHVlLnllbGxvdyA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUspLnZhbHVlLmtleSA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNDTVlLRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIENNWUsge1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ2NteWsnKTtcbn1cblxuZnVuY3Rpb24gaXNDTVlLU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ01ZS1N0cmluZyB7XG5cdHJldHVybiAoXG5cdFx0aXNDb2xvclN0cmluZyh2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBDTVlLU3RyaW5nKS5mb3JtYXQgPT09ICdjbXlrJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIENNWUtTdHJpbmcpLnZhbHVlLmN5YW4gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBDTVlLU3RyaW5nKS52YWx1ZS5tYWdlbnRhID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZS1N0cmluZykudmFsdWUueWVsbG93ID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgQ01ZS1N0cmluZykudmFsdWUua2V5ID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0hleCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEhleCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgSGV4KS5mb3JtYXQgPT09ICdoZXgnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSGV4KS52YWx1ZS5oZXggPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSGV4Rm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIEhleCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnaGV4Jyk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIU0wge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIEhTTCkuZm9ybWF0ID09PSAnaHNsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTCkudmFsdWUuaHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMKS52YWx1ZS5saWdodG5lc3MgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIEhTTCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnaHNsJyk7XG59XG5cbmZ1bmN0aW9uIGlzSFNMU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgSFNMU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHRpc0NvbG9yU3RyaW5nKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIEhTTFN0cmluZykuZm9ybWF0ID09PSAnaHNsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTTFN0cmluZykudmFsdWUuaHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMU3RyaW5nKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNMU3RyaW5nKS52YWx1ZS5saWdodG5lc3MgPT09ICdzdHJpbmcnXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNWQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBIU1Yge1xuXHRyZXR1cm4gKFxuXHRcdGNvcmUuaXNDb2xvcih2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBIU1YpLmZvcm1hdCA9PT0gJ2hzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBIU1YpLnZhbHVlLmh1ZSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVikudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVikudmFsdWUudmFsdWUgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSFNWRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIEhTViB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnaHN2Jyk7XG59XG5cbmZ1bmN0aW9uIGlzSFNWU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgSFNWU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHRpc0NvbG9yU3RyaW5nKHZhbHVlKSAmJlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIEhTVlN0cmluZykuZm9ybWF0ID09PSAnaHN2JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIEhTVlN0cmluZykudmFsdWUuaHVlID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNWU3RyaW5nKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgSFNWU3RyaW5nKS52YWx1ZS52YWx1ZSA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNMQUIodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBMQUIge1xuXHRyZXR1cm4gKFxuXHRcdGNvcmUuaXNDb2xvcih2YWx1ZSkgJiZcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBMQUIpLmZvcm1hdCA9PT0gJ2xhYicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBMQUIpLnZhbHVlLmwgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBMQUIpLnZhbHVlLmEgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBMQUIpLnZhbHVlLmIgPT09ICdudW1iZXInXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzTEFCRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIExBQiB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnbGFiJyk7XG59XG5cbmZ1bmN0aW9uIGlzUkdCKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgUkdCIHtcblx0cmV0dXJuIChcblx0XHRjb3JlLmlzQ29sb3IodmFsdWUpICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgUkdCKS5mb3JtYXQgPT09ICdyZ2InICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgUkdCKS52YWx1ZS5yZWQgPT09ICdudW1iZXInICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBSR0IpLnZhbHVlLmdyZWVuID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgUkdCKS52YWx1ZS5ibHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1JHQkZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBSR0Ige1xuXHRyZXR1cm4gaXNDb2xvckZvcm1hdChjb2xvciwgJ3JnYicpO1xufVxuXG5mdW5jdGlvbiBpc1NMQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBTTCB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgU0wpLmZvcm1hdCA9PT0gJ3NsJyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNMKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU0wpLnZhbHVlLmxpZ2h0bmVzcyA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNTTEZvcm1hdChjb2xvcjogQ29sb3IpOiBjb2xvciBpcyBTTCB7XG5cdHJldHVybiBpc0NvbG9yRm9ybWF0KGNvbG9yLCAnc2wnKTtcbn1cblxuZnVuY3Rpb24gaXNTTFN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFNMU3RyaW5nIHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHQnZm9ybWF0JyBpbiB2YWx1ZSAmJlxuXHRcdCh2YWx1ZSBhcyBTTFN0cmluZykuZm9ybWF0ID09PSAnc2wnICYmXG5cdFx0J3ZhbHVlJyBpbiB2YWx1ZSAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU0xTdHJpbmcpLnZhbHVlLnNhdHVyYXRpb24gPT09ICdzdHJpbmcnICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTTFN0cmluZykudmFsdWUubGlnaHRuZXNzID09PSAnc3RyaW5nJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1NWQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBTViB7XG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0J2Zvcm1hdCcgaW4gdmFsdWUgJiZcblx0XHQodmFsdWUgYXMgU1YpLmZvcm1hdCA9PT0gJ3N2JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNWKS52YWx1ZS5zYXR1cmF0aW9uID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiAodmFsdWUgYXMgU1YpLnZhbHVlLnZhbHVlID09PSAnbnVtYmVyJ1xuXHQpO1xufVxuXG5mdW5jdGlvbiBpc1NWRm9ybWF0KGNvbG9yOiBDb2xvcik6IGNvbG9yIGlzIFNWIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICdzdicpO1xufVxuXG5mdW5jdGlvbiBpc1NWU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgU1ZTdHJpbmcge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFNWU3RyaW5nKS5mb3JtYXQgPT09ICdzdicgJiZcblx0XHQndmFsdWUnIGluIHZhbHVlICYmXG5cdFx0dHlwZW9mICh2YWx1ZSBhcyBTVlN0cmluZykudmFsdWUuc2F0dXJhdGlvbiA9PT0gJ3N0cmluZycgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFNWU3RyaW5nKS52YWx1ZS52YWx1ZSA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNYWVoodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBYWVoge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdCdmb3JtYXQnIGluIHZhbHVlICYmXG5cdFx0KHZhbHVlIGFzIFhZWikuZm9ybWF0ID09PSAneHl6JyAmJlxuXHRcdCd2YWx1ZScgaW4gdmFsdWUgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFhZWikudmFsdWUueCA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFhZWikudmFsdWUueSA9PT0gJ251bWJlcicgJiZcblx0XHR0eXBlb2YgKHZhbHVlIGFzIFhZWikudmFsdWUueiA9PT0gJ251bWJlcidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNYWVpGb3JtYXQoY29sb3I6IENvbG9yKTogY29sb3IgaXMgWFlaIHtcblx0cmV0dXJuIGlzQ29sb3JGb3JtYXQoY29sb3IsICd4eXonKTtcbn1cblxuLy8gKioqKiogU0VDVElPTiAzOiBVdGlsaXR5IEd1YXJkcyAqKioqKlxuXG5mdW5jdGlvbiBlbnN1cmVIYXNoKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRyZXR1cm4gdmFsdWUuc3RhcnRzV2l0aCgnIycpID8gdmFsdWUgOiBgIyR7dmFsdWV9YDtcbn1cblxuZnVuY3Rpb24gaXNDb252ZXJ0aWJsZUNvbG9yKFxuXHRjb2xvcjogQ29sb3Jcbik6IGNvbG9yIGlzIENNWUsgfCBIZXggfCBIU0wgfCBIU1YgfCBMQUIgfCBSR0Ige1xuXHRyZXR1cm4gKFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2NteWsnIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnaGV4JyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ2hzbCcgfHxcblx0XHRjb2xvci5mb3JtYXQgPT09ICdoc3YnIHx8XG5cdFx0Y29sb3IuZm9ybWF0ID09PSAnbGFiJyB8fFxuXHRcdGNvbG9yLmZvcm1hdCA9PT0gJ3JnYidcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNJbnB1dEVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsKTogZWxlbWVudCBpcyBIVE1MRWxlbWVudCB7XG5cdHJldHVybiBlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudDtcbn1cblxuZnVuY3Rpb24gaXNTdG9yZWRQYWxldHRlKG9iajogdW5rbm93bik6IG9iaiBpcyBTdG9yZWRQYWxldHRlIHtcblx0aWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG5cdGNvbnN0IGNhbmRpZGF0ZSA9IG9iaiBhcyBQYXJ0aWFsPFN0b3JlZFBhbGV0dGU+O1xuXG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIGNhbmRpZGF0ZS50YWJsZUlEID09PSAnbnVtYmVyJyAmJlxuXHRcdHR5cGVvZiBjYW5kaWRhdGUucGFsZXR0ZSA9PT0gJ29iamVjdCcgJiZcblx0XHRBcnJheS5pc0FycmF5KGNhbmRpZGF0ZS5wYWxldHRlLml0ZW1zKSAmJlxuXHRcdHR5cGVvZiBjYW5kaWRhdGUucGFsZXR0ZS5pZCA9PT0gJ3N0cmluZydcblx0KTtcbn1cblxuZnVuY3Rpb24gbmFycm93VG9Db2xvcihjb2xvcjogQ29sb3IgfCBDb2xvclN0cmluZyk6IENvbG9yIHwgbnVsbCB7XG5cdGlmIChpc0NvbG9yU3RyaW5nKGNvbG9yKSkge1xuXHRcdHJldHVybiBjb3JlLmNvbG9yU3RyaW5nVG9Db2xvcihjb2xvcik7XG5cdH1cblxuXHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCBhcyBDb2xvclNwYWNlRXh0ZW5kZWQpIHtcblx0XHRjYXNlICdjbXlrJzpcblx0XHRjYXNlICdoZXgnOlxuXHRcdGNhc2UgJ2hzbCc6XG5cdFx0Y2FzZSAnaHN2Jzpcblx0XHRjYXNlICdsYWInOlxuXHRcdGNhc2UgJ3NsJzpcblx0XHRjYXNlICdzdic6XG5cdFx0Y2FzZSAncmdiJzpcblx0XHRjYXNlICd4eXonOlxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG4vLyAqKioqKioqKiBTRUNUSU9OIDQ6IFRSQU5TRk9STSBVVElMUyAqKioqKioqKlxuXG5mdW5jdGlvbiBhZGRIYXNoVG9IZXgoaGV4OiBIZXgpOiBIZXgge1xuXHR0cnkge1xuXHRcdHJldHVybiBoZXgudmFsdWUuaGV4LnN0YXJ0c1dpdGgoJyMnKVxuXHRcdFx0PyBoZXhcblx0XHRcdDoge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRoZXg6IGAjJHtoZXgudmFsdWV9fWAsXG5cdFx0XHRcdFx0XHRhbHBoYTogaGV4LnZhbHVlLmFscGhhLFxuXHRcdFx0XHRcdFx0bnVtQWxwaGE6IGhleC52YWx1ZS5udW1BbHBoYVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4JyBhcyAnaGV4J1xuXHRcdFx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGFkZEhhc2hUb0hleCBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb25maWcuZGVmYXVsdHMuY29sb3JzLmhleDtcblx0fVxufVxuXG5mdW5jdGlvbiBjb2xvclRvQ29sb3JTdHJpbmcoY29sb3I6IENvbG9yKTogQ29sb3JTdHJpbmcge1xuXHRjb25zdCBjbG9uZWRDb2xvciA9IGNvcmUuY2xvbmUoY29sb3IpIGFzIEV4Y2x1ZGU8Q29sb3IsIEhleD47XG5cblx0aWYgKGlzQ29sb3JTdHJpbmcoY2xvbmVkQ29sb3IpKSB7XG5cdFx0Y29uc29sZS5sb2coXG5cdFx0XHRgQWxyZWFkeSBmb3JtYXR0ZWQgYXMgY29sb3Igc3RyaW5nOiAke0pTT04uc3RyaW5naWZ5KGNvbG9yKX1gXG5cdFx0KTtcblxuXHRcdHJldHVybiBjbG9uZWRDb2xvcjtcblx0fVxuXG5cdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhjbG9uZWRDb2xvci52YWx1ZSk7XG5cblx0aWYgKGlzQ01ZS0NvbG9yKGNsb25lZENvbG9yKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdjbXlrJyxcblx0XHRcdHZhbHVlOiBuZXdWYWx1ZSBhcyB1bmtub3duIGFzIENNWUtWYWx1ZVN0cmluZ1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNIZXgoY2xvbmVkQ29sb3IpKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGZvcm1hdDogJ2hleCcsXG5cdFx0XHR2YWx1ZTogbmV3VmFsdWUgYXMgdW5rbm93biBhcyBIZXhWYWx1ZVN0cmluZ1xuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNIU0xDb2xvcihjbG9uZWRDb2xvcikpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Zm9ybWF0OiAnaHNsJyxcblx0XHRcdHZhbHVlOiBuZXdWYWx1ZSBhcyB1bmtub3duIGFzIEhTTFZhbHVlU3RyaW5nXG5cdFx0fTtcblx0fSBlbHNlIGlmIChpc0hTVkNvbG9yKGNsb25lZENvbG9yKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdoc3YnLFxuXHRcdFx0dmFsdWU6IG5ld1ZhbHVlIGFzIHVua25vd24gYXMgSFNWVmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzTEFCKGNsb25lZENvbG9yKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdsYWInLFxuXHRcdFx0dmFsdWU6IG5ld1ZhbHVlIGFzIHVua25vd24gYXMgTEFCVmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzUkdCKGNsb25lZENvbG9yKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICdyZ2InLFxuXHRcdFx0dmFsdWU6IG5ld1ZhbHVlIGFzIHVua25vd24gYXMgUkdCVmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2UgaWYgKGlzWFlaKGNsb25lZENvbG9yKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRmb3JtYXQ6ICd4eXonLFxuXHRcdFx0dmFsdWU6IG5ld1ZhbHVlIGFzIHVua25vd24gYXMgWFlaVmFsdWVTdHJpbmdcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZm9ybWF0OiAke2Nsb25lZENvbG9yLmZvcm1hdH1gKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjb21wb25lbnRUb0hleChjb21wb25lbnQ6IG51bWJlcik6IHN0cmluZyB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgaGV4ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBjb21wb25lbnQpKS50b1N0cmluZygxNik7XG5cblx0XHRyZXR1cm4gaGV4Lmxlbmd0aCA9PT0gMSA/ICcwJyArIGhleCA6IGhleDtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBjb21wb25lbnRUb0hleCBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiAnMDAnO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdENvbG9yKFxuXHRjb2xvcjogQ29sb3IsXG5cdGFzQ29sb3JTdHJpbmc6IGJvb2xlYW4gPSBmYWxzZSxcblx0YXNDU1NTdHJpbmc6IGJvb2xlYW4gPSBmYWxzZVxuKTogeyBiYXNlQ29sb3I6IENvbG9yOyBmb3JtYXR0ZWRTdHJpbmc/OiBDb2xvclN0cmluZyB8IHN0cmluZyB9IHtcblx0Y29uc3QgYmFzZUNvbG9yID0gY29yZS5jbG9uZShjb2xvcik7XG5cblx0bGV0IGZvcm1hdHRlZFN0cmluZzogQ29sb3JTdHJpbmcgfCBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cblx0aWYgKGFzQ29sb3JTdHJpbmcpIHtcblx0XHRmb3JtYXR0ZWRTdHJpbmcgPSBjb2xvclRvQ29sb3JTdHJpbmcoXG5cdFx0XHRjb2xvciBhcyBFeGNsdWRlPENvbG9yLCBIZXggfCBMQUIgfCBSR0I+XG5cdFx0KSBhcyBDb2xvclN0cmluZztcblx0fSBlbHNlIGlmIChhc0NTU1N0cmluZykge1xuXHRcdGZvcm1hdHRlZFN0cmluZyA9IGNvcmUuZ2V0Q1NTQ29sb3JTdHJpbmcoY29sb3IpIGFzIHN0cmluZztcblx0fVxuXG5cdHJldHVybiBmb3JtYXR0ZWRTdHJpbmcgIT09IHVuZGVmaW5lZFxuXHRcdD8geyBiYXNlQ29sb3IsIGZvcm1hdHRlZFN0cmluZyB9XG5cdFx0OiB7IGJhc2VDb2xvciB9O1xufVxuXG5mdW5jdGlvbiBmb3JtYXRQZXJjZW50YWdlVmFsdWVzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oXG5cdHZhbHVlOiBUXG4pOiBUIHtcblx0cmV0dXJuIE9iamVjdC5lbnRyaWVzKHZhbHVlKS5yZWR1Y2UoXG5cdFx0KGFjYywgW2tleSwgdmFsXSkgPT4ge1xuXHRcdFx0KGFjYyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilba2V5XSA9IFtcblx0XHRcdFx0J3NhdHVyYXRpb24nLFxuXHRcdFx0XHQnbGlnaHRuZXNzJyxcblx0XHRcdFx0J3ZhbHVlJyxcblx0XHRcdFx0J2N5YW4nLFxuXHRcdFx0XHQnbWFnZW50YScsXG5cdFx0XHRcdCd5ZWxsb3cnLFxuXHRcdFx0XHQna2V5J1xuXHRcdFx0XS5pbmNsdWRlcyhrZXkpXG5cdFx0XHRcdD8gYCR7dmFsfSVgXG5cdFx0XHRcdDogdmFsO1xuXHRcdFx0cmV0dXJuIGFjYztcblx0XHR9LFxuXHRcdHt9IGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+XG5cdCkgYXMgVDtcbn1cblxuZnVuY3Rpb24gZ2V0QWxwaGFGcm9tSGV4KGhleDogc3RyaW5nKTogbnVtYmVyIHtcblx0aWYgKGhleC5sZW5ndGggIT09IDkgfHwgIWhleC5zdGFydHNXaXRoKCcjJykpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaGV4IGNvbG9yOiAke2hleH0uIEV4cGVjdGVkIGZvcm1hdCAjUlJHR0JCQUFgKTtcblx0fVxuXG5cdGNvbnN0IGFscGhhSGV4ID0gaGV4LnNsaWNlKC0yKTtcblx0Y29uc3QgYWxwaGFEZWNpbWFsID0gcGFyc2VJbnQoYWxwaGFIZXgsIDE2KTtcblxuXHRyZXR1cm4gYWxwaGFEZWNpbWFsIC8gMjU1O1xufVxuXG5mdW5jdGlvbiBnZXRDb2xvclN0cmluZyhjb2xvcjogQ29sb3IpOiBzdHJpbmcgfCBudWxsIHtcblx0dHJ5IHtcblx0XHRjb25zdCBmb3JtYXR0ZXJzID0ge1xuXHRcdFx0Y215azogKGM6IENNWUspID0+XG5cdFx0XHRcdGBjbXlrKCR7Yy52YWx1ZS5jeWFufSwgJHtjLnZhbHVlLm1hZ2VudGF9LCAke2MudmFsdWUueWVsbG93fSwgJHtjLnZhbHVlLmtleX0sICR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdGhleDogKGM6IEhleCkgPT4gYy52YWx1ZS5oZXgsXG5cdFx0XHRoc2w6IChjOiBIU0wpID0+XG5cdFx0XHRcdGBoc2woJHtjLnZhbHVlLmh1ZX0sICR7Yy52YWx1ZS5zYXR1cmF0aW9ufSUsICR7Yy52YWx1ZS5saWdodG5lc3N9JSwke2MudmFsdWUuYWxwaGF9KWAsXG5cdFx0XHRoc3Y6IChjOiBIU1YpID0+XG5cdFx0XHRcdGBoc3YoJHtjLnZhbHVlLmh1ZX0sICR7Yy52YWx1ZS5zYXR1cmF0aW9ufSUsICR7Yy52YWx1ZS52YWx1ZX0lLCR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdGxhYjogKGM6IExBQikgPT5cblx0XHRcdFx0YGxhYigke2MudmFsdWUubH0sICR7Yy52YWx1ZS5hfSwgJHtjLnZhbHVlLmJ9LCR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdHJnYjogKGM6IFJHQikgPT5cblx0XHRcdFx0YHJnYigke2MudmFsdWUucmVkfSwgJHtjLnZhbHVlLmdyZWVufSwgJHtjLnZhbHVlLmJsdWV9LCR7Yy52YWx1ZS5hbHBoYX0pYCxcblx0XHRcdHh5ejogKGM6IFhZWikgPT5cblx0XHRcdFx0YHh5eigke2MudmFsdWUueH0sICR7Yy52YWx1ZS55fSwgJHtjLnZhbHVlLnp9LCR7Yy52YWx1ZS5hbHBoYX0pYFxuXHRcdH07XG5cblx0XHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmNteWsoY29sb3IpO1xuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMuaGV4KGNvbG9yKTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmhzbChjb2xvcik7XG5cdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5oc3YoY29sb3IpO1xuXHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMubGFiKGNvbG9yKTtcblx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLnJnYihjb2xvcik7XG5cdFx0XHRjYXNlICd4eXonOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy54eXooY29sb3IpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0IGZvciAke2NvbG9yfWApO1xuXG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBnZXRDb2xvclN0cmluZyBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleEFscGhhVG9OdW1lcmljQWxwaGEoaGV4QWxwaGE6IHN0cmluZyk6IG51bWJlciB7XG5cdHJldHVybiBwYXJzZUludChoZXhBbHBoYSwgMTYpIC8gMjU1O1xufVxuXG5jb25zdCBwYXJzZUNvbG9yID0gKGNvbG9yU3BhY2U6IENvbG9yU3BhY2UsIHZhbHVlOiBzdHJpbmcpOiBDb2xvciB8IG51bGwgPT4ge1xuXHR0cnkge1xuXHRcdHN3aXRjaCAoY29sb3JTcGFjZSkge1xuXHRcdFx0Y2FzZSAnY215ayc6IHtcblx0XHRcdFx0Y29uc3QgW2MsIG0sIHksIGssIGFdID0gcGFyc2VDb21wb25lbnRzKHZhbHVlLCA1KTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7IGN5YW46IGMsIG1hZ2VudGE6IG0sIHllbGxvdzogeSwga2V5OiBrLCBhbHBoYTogYSB9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRjb25zdCBoZXhWYWx1ZSA9IHZhbHVlLnN0YXJ0c1dpdGgoJyMnKSA/IHZhbHVlIDogYCMke3ZhbHVlfWA7XG5cdFx0XHRcdGNvbnN0IGFscGhhID0gaGV4VmFsdWUubGVuZ3RoID09PSA5ID8gaGV4VmFsdWUuc2xpY2UoLTIpIDogJ0ZGJztcblx0XHRcdFx0Y29uc3QgbnVtQWxwaGEgPSBoZXhBbHBoYVRvTnVtZXJpY0FscGhhKGFscGhhKTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRoZXg6IGhleFZhbHVlLFxuXHRcdFx0XHRcdFx0YWxwaGEsXG5cdFx0XHRcdFx0XHRudW1BbHBoYVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHR9O1xuXHRcdFx0Y2FzZSAnaHNsJzoge1xuXHRcdFx0XHRjb25zdCBbaCwgcywgbCwgYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHsgaHVlOiBoLCBzYXR1cmF0aW9uOiBzLCBsaWdodG5lc3M6IGwsIGFscGhhOiBhIH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAnaHN2Jzoge1xuXHRcdFx0XHRjb25zdCBbaCwgcywgdiwgYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHsgaHVlOiBoLCBzYXR1cmF0aW9uOiBzLCB2YWx1ZTogdiwgYWxwaGE6IGEgfSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdsYWInOiB7XG5cdFx0XHRcdGNvbnN0IFtsLCBhLCBiLCBhbHBoYV0gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDQpO1xuXHRcdFx0XHRyZXR1cm4geyB2YWx1ZTogeyBsLCBhLCBiLCBhbHBoYSB9LCBmb3JtYXQ6ICdsYWInIH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdyZ2InOiB7XG5cdFx0XHRcdGNvbnN0IFtyLCBnLCBiLCBhXSA9IHZhbHVlLnNwbGl0KCcsJykubWFwKE51bWJlcik7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZTogeyByZWQ6IHIsIGdyZWVuOiBnLCBibHVlOiBiLCBhbHBoYTogYSB9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yU3BhY2V9YCk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYHBhcnNlQ29sb3IgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufTtcblxuZnVuY3Rpb24gcGFyc2VDb21wb25lbnRzKHZhbHVlOiBzdHJpbmcsIGNvdW50OiBudW1iZXIpOiBudW1iZXJbXSB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29tcG9uZW50cyA9IHZhbHVlXG5cdFx0XHQuc3BsaXQoJywnKVxuXHRcdFx0Lm1hcCh2YWwgPT5cblx0XHRcdFx0dmFsLnRyaW0oKS5lbmRzV2l0aCgnJScpXG5cdFx0XHRcdFx0PyBwYXJzZUZsb2F0KHZhbClcblx0XHRcdFx0XHQ6IHBhcnNlRmxvYXQodmFsKSAqIDEwMFxuXHRcdFx0KTtcblxuXHRcdGlmIChjb21wb25lbnRzLmxlbmd0aCAhPT0gY291bnQpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkICR7Y291bnR9IGNvbXBvbmVudHMuYCk7XG5cblx0XHRyZXR1cm4gY29tcG9uZW50cztcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBwYXJzaW5nIGNvbXBvbmVudHM6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gW107XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VIZXhXaXRoQWxwaGEoaGV4VmFsdWU6IHN0cmluZyk6IEhleFZhbHVlIHwgbnVsbCB7XG5cdGNvbnN0IGhleCA9IGhleFZhbHVlLnN0YXJ0c1dpdGgoJyMnKSA/IGhleFZhbHVlIDogYCMke2hleFZhbHVlfWA7XG5cdGNvbnN0IGFscGhhID0gaGV4Lmxlbmd0aCA9PT0gOSA/IGhleC5zbGljZSgtMikgOiAnRkYnO1xuXHRjb25zdCBudW1BbHBoYSA9IGhleEFscGhhVG9OdW1lcmljQWxwaGEoYWxwaGEpO1xuXG5cdHJldHVybiB7IGhleCwgYWxwaGEsIG51bUFscGhhIH07XG59XG5cbmZ1bmN0aW9uIHN0cmlwSGFzaEZyb21IZXgoaGV4OiBIZXgpOiBIZXgge1xuXHR0cnkge1xuXHRcdGNvbnN0IGhleFN0cmluZyA9IGAke2hleC52YWx1ZS5oZXh9JHtoZXgudmFsdWUuYWxwaGF9YDtcblxuXHRcdHJldHVybiBoZXgudmFsdWUuaGV4LnN0YXJ0c1dpdGgoJyMnKVxuXHRcdFx0PyB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGhleDogaGV4U3RyaW5nLnNsaWNlKDEpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGhleC52YWx1ZS5hbHBoYSxcblx0XHRcdFx0XHRcdG51bUFscGhhOiBoZXhBbHBoYVRvTnVtZXJpY0FscGhhKGhleC52YWx1ZS5hbHBoYSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hleCcgYXMgJ2hleCdcblx0XHRcdFx0fVxuXHRcdFx0OiBoZXg7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgc3RyaXBIYXNoRnJvbUhleCBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGNvbmZpZy5kZWZhdWx0cy5jb2xvcnMuaGV4KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzdHJpcFBlcmNlbnRGcm9tVmFsdWVzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBudW1iZXIgfCBzdHJpbmc+Pihcblx0dmFsdWU6IFRcbik6IHsgW0sgaW4ga2V5b2YgVF06IFRbS10gZXh0ZW5kcyBgJHtudW1iZXJ9JWAgPyBudW1iZXIgOiBUW0tdIH0ge1xuXHRyZXR1cm4gT2JqZWN0LmVudHJpZXModmFsdWUpLnJlZHVjZShcblx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHRjb25zdCBwYXJzZWRWYWx1ZSA9XG5cdFx0XHRcdHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIHZhbC5lbmRzV2l0aCgnJScpXG5cdFx0XHRcdFx0PyBwYXJzZUZsb2F0KHZhbC5zbGljZSgwLCAtMSkpXG5cdFx0XHRcdFx0OiB2YWw7XG5cdFx0XHRhY2Nba2V5IGFzIGtleW9mIFRdID0gcGFyc2VkVmFsdWUgYXMgVFtrZXlvZiBUXSBleHRlbmRzIGAke251bWJlcn0lYFxuXHRcdFx0XHQ/IG51bWJlclxuXHRcdFx0XHQ6IFRba2V5b2YgVF07XG5cdFx0XHRyZXR1cm4gYWNjO1xuXHRcdH0sXG5cdFx0e30gYXMgeyBbSyBpbiBrZXlvZiBUXTogVFtLXSBleHRlbmRzIGAke251bWJlcn0lYCA/IG51bWJlciA6IFRbS10gfVxuXHQpO1xufVxuXG5mdW5jdGlvbiB0b0hleFdpdGhBbHBoYShyZ2JWYWx1ZTogUkdCVmFsdWUpOiBzdHJpbmcge1xuXHRjb25zdCB7IHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhIH0gPSByZ2JWYWx1ZTtcblxuXHRjb25zdCBoZXggPSBgIyR7KCgxIDw8IDI0KSArIChyZWQgPDwgMTYpICsgKGdyZWVuIDw8IDgpICsgYmx1ZSlcblx0XHQudG9TdHJpbmcoMTYpXG5cdFx0LnNsaWNlKDEpfWA7XG5cdGNvbnN0IGFscGhhSGV4ID0gTWF0aC5yb3VuZChhbHBoYSAqIDI1NSlcblx0XHQudG9TdHJpbmcoMTYpXG5cdFx0LnBhZFN0YXJ0KDIsICcwJyk7XG5cblx0cmV0dXJuIGAke2hleH0ke2FscGhhSGV4fWA7XG59XG5cbmV4cG9ydCBjb25zdCBjb2xvciA9IHtcblx0YWRkSGFzaFRvSGV4LFxuXHRjb2xvclRvQ29sb3JTdHJpbmcsXG5cdGNvbXBvbmVudFRvSGV4LFxuXHRlbnN1cmVIYXNoLFxuXHRmb3JtYXRDb2xvcixcblx0Zm9ybWF0UGVyY2VudGFnZVZhbHVlcyxcblx0Z2V0QWxwaGFGcm9tSGV4LFxuXHRnZXRDb2xvclN0cmluZyxcblx0aGV4QWxwaGFUb051bWVyaWNBbHBoYSxcblx0aXNDTVlLQ29sb3IsXG5cdGlzQ01ZS0Zvcm1hdCxcblx0aXNDTVlLU3RyaW5nLFxuXHRpc0NvbG9yRm9ybWF0LFxuXHRpc0NvbG9yU3RyaW5nLFxuXHRpc0NvbG9yU3BhY2UsXG5cdGlzQ29sb3JTcGFjZUV4dGVuZGVkLFxuXHRpc0NvbnZlcnRpYmxlQ29sb3IsXG5cdGlzRm9ybWF0LFxuXHRpc0hleCxcblx0aXNIZXhGb3JtYXQsXG5cdGlzSFNMQ29sb3IsXG5cdGlzSFNMRm9ybWF0LFxuXHRpc0hTTFN0cmluZyxcblx0aXNJbnB1dEVsZW1lbnQsXG5cdGlzSFNWQ29sb3IsXG5cdGlzSFNWRm9ybWF0LFxuXHRpc0hTVlN0cmluZyxcblx0aXNMQUIsXG5cdGlzTEFCRm9ybWF0LFxuXHRpc1JHQixcblx0aXNSR0JGb3JtYXQsXG5cdGlzU0xDb2xvcixcblx0aXNTTEZvcm1hdCxcblx0aXNTTFN0cmluZyxcblx0aXNTdG9yZWRQYWxldHRlLFxuXHRpc1NWQ29sb3IsXG5cdGlzU1ZGb3JtYXQsXG5cdGlzU1ZTdHJpbmcsXG5cdGlzWFlaLFxuXHRpc1hZWkZvcm1hdCxcblx0bmFycm93VG9Db2xvcixcblx0cGFyc2VDb2xvcixcblx0cGFyc2VDb21wb25lbnRzLFxuXHRwYXJzZUhleFdpdGhBbHBoYSxcblx0c3RyaXBIYXNoRnJvbUhleCxcblx0c3RyaXBQZXJjZW50RnJvbVZhbHVlcyxcblx0dG9IZXhXaXRoQWxwaGFcbn07XG4iXX0=