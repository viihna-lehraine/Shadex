// File: src/common/core/base.js
import { data } from '../../data/index.js';
import { log } from '../../classes/logger/index.js';
const logMode = data.mode.logging;
const defaultColors = data.defaults.colors;
const mode = data.mode;
const _sets = data.sets;
function clampToRange(value, rangeKey) {
    const [min, max] = _sets[rangeKey];
    return Math.min(Math.max(value, min), max);
}
function clone(value) {
    return structuredClone(value);
}
function debounce(func, delay) {
    let timeout = null;
    return (...args) => {
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args);
        }, delay);
    };
}
function parseCustomColor(rawValue) {
    try {
        if (!mode.quiet)
            log.info(`Parsing custom color: ${JSON.stringify(rawValue)}`);
        const match = rawValue.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?,\s*(\d*\.?\d+)\)/);
        if (match) {
            const [, hue, saturation, lightness, alpha] = match;
            return {
                value: {
                    hue: brand.asRadial(parseInt(hue)),
                    saturation: brand.asPercentile(parseInt(saturation)),
                    lightness: brand.asPercentile(parseInt(lightness)),
                    alpha: brand.asAlphaRange(parseFloat(alpha))
                },
                format: 'hsl'
            };
        }
        else {
            if (logMode.errors)
                log.error('Invalid HSL custom color. Expected format: hsl(H, S%, L%, A)');
            return null;
        }
    }
    catch (error) {
        if (logMode.errors)
            log.error(`parseCustomColor error: ${error}`);
        return null;
    }
}
export const base = {
    clampToRange,
    clone,
    debounce,
    parseCustomColor
};
// ******** SECTION 2 ********
function asAlphaRange(value) {
    validate.range(value, 'AlphaRange');
    return value;
}
function asBranded(value, rangeKey) {
    validate.range(value, rangeKey);
    return value;
}
function asByteRange(value) {
    validate.range(value, 'ByteRange');
    return value;
}
function asHexComponent(value) {
    if (!validate.hexComponent(value)) {
        throw new Error(`Invalid HexComponent value: ${value}`);
    }
    return value;
}
function asHexSet(value) {
    if (/^#[0-9a-fA-F]{8}$/.test(value)) {
        value = value.slice(0, 7);
    }
    if (!validate.hexSet(value)) {
        throw new Error(`Invalid HexSet value: ${value}`);
    }
    return value;
}
function asLAB_L(value) {
    validate.range(value, 'LAB_L');
    return value;
}
function asLAB_A(value) {
    validate.range(value, 'LAB_A');
    return value;
}
function asLAB_B(value) {
    validate.range(value, 'LAB_B');
    return value;
}
function asPercentile(value) {
    validate.range(value, 'Percentile');
    return value;
}
function asRadial(value) {
    validate.range(value, 'Radial');
    return value;
}
function asXYZ_X(value) {
    validate.range(value, 'XYZ_X');
    return value;
}
function asXYZ_Y(value) {
    validate.range(value, 'XYZ_Y');
    return value;
}
function asXYZ_Z(value) {
    validate.range(value, 'XYZ_Z');
    return value;
}
export const brand = {
    asAlphaRange,
    asBranded,
    asByteRange,
    asHexComponent,
    asHexSet,
    asLAB_L,
    asLAB_A,
    asLAB_B,
    asPercentile,
    asRadial,
    asXYZ_X,
    asXYZ_Y,
    asXYZ_Z
};
// ******** SECTION 2 - Brand Color ********
function asCMYK(color) {
    const brandedCyan = brand.asPercentile(color.value.cyan);
    const brandedMagenta = brand.asPercentile(color.value.magenta);
    const brandedYellow = brand.asPercentile(color.value.yellow);
    const brandedKey = brand.asPercentile(color.value.key);
    const brandedAlpha = brand.asAlphaRange(color.value.alpha);
    return {
        value: {
            cyan: brandedCyan,
            magenta: brandedMagenta,
            yellow: brandedYellow,
            key: brandedKey,
            alpha: brandedAlpha
        },
        format: 'cmyk'
    };
}
function asHex(color) {
    let hex = color.value.hex;
    if (!hex.startsWith('#'))
        hex = `#${hex}`;
    if (!/^#[0-9A-Fa-f]{8}$/.test(hex))
        throw new Error(`Invalid Hex color format: ${hex}`);
    const hexMain = hex.slice(0, 7);
    const alpha = hex.slice(7, 9);
    const brandedHex = brand.asHexSet(hexMain);
    const brandedHexAlpha = brand.asHexComponent(alpha);
    const brandedNumAlpha = brand.asAlphaRange(color.value.numAlpha);
    return {
        value: {
            hex: brandedHex,
            alpha: brandedHexAlpha,
            numAlpha: brandedNumAlpha
        },
        format: 'hex'
    };
}
function asHSL(color) {
    const brandedHue = brand.asRadial(color.value.hue);
    const brandedSaturation = brand.asPercentile(color.value.saturation);
    const brandedLightness = brand.asPercentile(color.value.lightness);
    const brandedAlpha = brand.asAlphaRange(color.value.alpha);
    return {
        value: {
            hue: brandedHue,
            saturation: brandedSaturation,
            lightness: brandedLightness,
            alpha: brandedAlpha
        },
        format: 'hsl'
    };
}
function asHSV(color) {
    const brandedHue = brand.asRadial(color.value.hue);
    const brandedSaturation = brand.asPercentile(color.value.saturation);
    const brandedValue = brand.asPercentile(color.value.value);
    const brandedAlpha = brand.asAlphaRange(color.value.alpha);
    return {
        value: {
            hue: brandedHue,
            saturation: brandedSaturation,
            value: brandedValue,
            alpha: brandedAlpha
        },
        format: 'hsv'
    };
}
function asLAB(color) {
    const brandedL = brand.asLAB_L(color.value.l);
    const brandedA = brand.asLAB_A(color.value.a);
    const brandedB = brand.asLAB_B(color.value.b);
    const brandedAlpha = brand.asAlphaRange(color.value.alpha);
    return {
        value: {
            l: brandedL,
            a: brandedA,
            b: brandedB,
            alpha: brandedAlpha
        },
        format: 'lab'
    };
}
function asRGB(color) {
    const brandedRed = brand.asByteRange(color.value.red);
    const brandedGreen = brand.asByteRange(color.value.green);
    const brandedBlue = brand.asByteRange(color.value.blue);
    const brandedAlpha = brand.asAlphaRange(color.value.alpha);
    return {
        value: {
            red: brandedRed,
            green: brandedGreen,
            blue: brandedBlue,
            alpha: brandedAlpha
        },
        format: 'rgb'
    };
}
function asSL(color) {
    const brandedSaturation = brand.asPercentile(color.value.saturation);
    const brandedLightness = brand.asPercentile(color.value.lightness);
    const brandedAlpha = brand.asAlphaRange(color.value.alpha);
    return {
        value: {
            saturation: brandedSaturation,
            lightness: brandedLightness,
            alpha: brandedAlpha
        },
        format: 'sl'
    };
}
function asSV(color) {
    const brandedSaturation = brand.asPercentile(color.value.saturation);
    const brandedValue = brand.asPercentile(color.value.value);
    const brandedAlpha = brand.asAlphaRange(color.value.alpha);
    return {
        value: {
            saturation: brandedSaturation,
            value: brandedValue,
            alpha: brandedAlpha
        },
        format: 'sv'
    };
}
function asXYZ(color) {
    const brandedX = brand.asXYZ_X(color.value.x);
    const brandedY = brand.asXYZ_Y(color.value.y);
    const brandedZ = brand.asXYZ_Z(color.value.z);
    const brandedAlpha = brand.asAlphaRange(color.value.alpha);
    return {
        value: {
            x: brandedX,
            y: brandedY,
            z: brandedZ,
            alpha: brandedAlpha
        },
        format: 'xyz'
    };
}
export const brandColor = {
    asCMYK,
    asHex,
    asHSL,
    asHSV,
    asLAB,
    asRGB,
    asSL,
    asSV,
    asXYZ
};
// ******** SECTION 3 - Convert ********
function hexAlphaToNumericAlpha(hexAlpha) {
    return parseInt(hexAlpha, 16) / 255;
}
function toColor(colorString) {
    const clonedColor = clone(colorString);
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
            if (logMode.errors)
                log.error('Unsupported format for colorStringToColor');
            const unbrandedHSL = defaultColors.hsl;
            const brandedHue = brand.asRadial(unbrandedHSL.value.hue);
            const brandedSaturation = brand.asPercentile(unbrandedHSL.value.saturation);
            const brandedLightness = brand.asPercentile(unbrandedHSL.value.lightness);
            const brandedAlpha = brand.asAlphaRange(unbrandedHSL.value.alpha);
            return {
                value: {
                    hue: brandedHue,
                    saturation: brandedSaturation,
                    lightness: brandedLightness,
                    alpha: brandedAlpha
                },
                format: 'hsl'
            };
    }
}
function toColorValueRange(value, rangeKey) {
    validate.range(value, rangeKey);
    if (rangeKey === 'HexSet') {
        return brand.asHexSet(value);
    }
    if (rangeKey === 'HexComponent') {
        return brand.asHexComponent(value);
    }
    return brand.asBranded(value, rangeKey);
}
function toCSSColorString(color) {
    try {
        switch (color.format) {
            case 'cmyk':
                return `cmyk(${color.value.cyan}, ${color.value.magenta}, ${color.value.yellow}, ${color.value.key}, ${color.value.alpha})`;
            case 'hex':
                return String(color.value.hex);
            case 'hsl':
                return `hsl(${color.value.hue}, ${color.value.saturation}%, ${color.value.lightness}%, ${color.value.alpha})`;
            case 'hsv':
                return `hsv(${color.value.hue}, ${color.value.saturation}%, ${color.value.value}%, ${color.value.alpha})`;
            case 'lab':
                return `lab(${color.value.l}, ${color.value.a}, ${color.value.b}, ${color.value.alpha})`;
            case 'rgb':
                return `rgb(${color.value.red}, ${color.value.green}, ${color.value.blue}, ${color.value.alpha})`;
            case 'xyz':
                return `xyz(${color.value.x}, ${color.value.y}, ${color.value.z}, ${color.value.alpha})`;
            default:
                if (logMode.errors)
                    log.error(`Unexpected color format: ${color.format}`);
                return '#FFFFFFFF';
        }
    }
    catch (error) {
        throw new Error(`getCSSColorString error: ${error}`);
    }
}
export const convert = {
    hexAlphaToNumericAlpha,
    toColor,
    toColorValueRange,
    toCSSColorString
};
// ******** SECTION 4 - Guards ********
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
function isColorSpace(value) {
    const validColorSpaces = [
        'cmyk',
        'hex',
        'hsl',
        'hsv',
        'lab',
        'rgb',
        'xyz'
    ];
    return (typeof value === 'string' &&
        validColorSpaces.includes(value));
}
function isColorString(value) {
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
function isInRange(value, rangeKey) {
    if (rangeKey === 'HexSet') {
        return validate.hexSet(value);
    }
    if (rangeKey === 'HexComponent') {
        return validate.hexComponent(value);
    }
    if (typeof value === 'number' && Array.isArray(_sets[rangeKey])) {
        const [min, max] = _sets[rangeKey];
        return value >= min && value <= max;
    }
    throw new Error(`Invalid range or value for ${rangeKey}`);
}
export const guards = {
    isColor,
    isColorSpace,
    isColorString,
    isInRange
};
// ******** SECTION 5 - Sanitize ********
function lab(value, output) {
    if (output === 'l') {
        return brand.asLAB_L(Math.round(Math.min(Math.max(value, 0), 100)));
    }
    else if (output === 'a') {
        return brand.asLAB_A(Math.round(Math.min(Math.max(value, -125), 125)));
    }
    else if (output === 'b') {
        return brand.asLAB_B(Math.round(Math.min(Math.max(value, -125), 125)));
    }
    else
        throw new Error('Unable to return LAB value');
}
function percentile(value) {
    const rawPercentile = Math.round(Math.min(Math.max(value, 0), 100));
    return brand.asPercentile(rawPercentile);
}
function radial(value) {
    const rawRadial = Math.round(Math.min(Math.max(value, 0), 360)) & 360;
    return brand.asRadial(rawRadial);
}
function rgb(value) {
    const rawByteRange = Math.round(Math.min(Math.max(value, 0), 255));
    return toColorValueRange(rawByteRange, 'ByteRange');
}
export const sanitize = {
    lab,
    percentile,
    radial,
    rgb
};
// ******** SECTION 6 - Validate ********
function colorValues(color) {
    const clonedColor = clone(color);
    const isNumericValid = (value) => typeof value === 'number' && !isNaN(value);
    const normalizePercentage = (value) => {
        if (typeof value === 'string' && value.endsWith('%')) {
            return parseFloat(value.slice(0, -1));
        }
        return typeof value === 'number' ? value : NaN;
    };
    switch (clonedColor.format) {
        case 'cmyk':
            return ([
                clonedColor.value.cyan,
                clonedColor.value.magenta,
                clonedColor.value.yellow,
                clonedColor.value.key
            ].every(isNumericValid) &&
                clonedColor.value.cyan >= 0 &&
                clonedColor.value.cyan <= 100 &&
                clonedColor.value.magenta >= 0 &&
                clonedColor.value.magenta <= 100 &&
                clonedColor.value.yellow >= 0 &&
                clonedColor.value.yellow <= 100 &&
                clonedColor.value.key >= 0 &&
                clonedColor.value.key <= 100);
        case 'hex':
            return /^#[0-9A-Fa-f]{6}$/.test(clonedColor.value.hex);
        case 'hsl':
            const isValidHSLHue = isNumericValid(clonedColor.value.hue) &&
                clonedColor.value.hue >= 0 &&
                clonedColor.value.hue <= 360;
            const isValidHSLSaturation = normalizePercentage(clonedColor.value.saturation) >= 0 &&
                normalizePercentage(clonedColor.value.saturation) <= 100;
            const isValidHSLLightness = clonedColor.value.lightness
                ? normalizePercentage(clonedColor.value.lightness) >= 0 &&
                    normalizePercentage(clonedColor.value.lightness) <= 100
                : true;
            return isValidHSLHue && isValidHSLSaturation && isValidHSLLightness;
        case 'hsv':
            const isValidHSVHue = isNumericValid(clonedColor.value.hue) &&
                clonedColor.value.hue >= 0 &&
                clonedColor.value.hue <= 360;
            const isValidHSVSaturation = normalizePercentage(clonedColor.value.saturation) >= 0 &&
                normalizePercentage(clonedColor.value.saturation) <= 100;
            const isValidHSVValue = clonedColor.value.value
                ? normalizePercentage(clonedColor.value.value) >= 0 &&
                    normalizePercentage(clonedColor.value.value) <= 100
                : true;
            return isValidHSVHue && isValidHSVSaturation && isValidHSVValue;
        case 'lab':
            return ([
                clonedColor.value.l,
                clonedColor.value.a,
                clonedColor.value.b
            ].every(isNumericValid) &&
                clonedColor.value.l >= 0 &&
                clonedColor.value.l <= 100 &&
                clonedColor.value.a >= -125 &&
                clonedColor.value.a <= 125 &&
                clonedColor.value.b >= -125 &&
                clonedColor.value.b <= 125);
        case 'rgb':
            return ([
                clonedColor.value.red,
                clonedColor.value.green,
                clonedColor.value.blue
            ].every(isNumericValid) &&
                clonedColor.value.red >= 0 &&
                clonedColor.value.red <= 255 &&
                clonedColor.value.green >= 0 &&
                clonedColor.value.green <= 255 &&
                clonedColor.value.blue >= 0 &&
                clonedColor.value.blue <= 255);
        case 'sl':
            return ([
                clonedColor.value.saturation,
                clonedColor.value.lightness
            ].every(isNumericValid) &&
                clonedColor.value.saturation >= 0 &&
                clonedColor.value.saturation <= 100 &&
                clonedColor.value.lightness >= 0 &&
                clonedColor.value.lightness <= 100);
        case 'sv':
            return ([clonedColor.value.saturation, clonedColor.value.value].every(isNumericValid) &&
                clonedColor.value.saturation >= 0 &&
                clonedColor.value.saturation <= 100 &&
                clonedColor.value.value >= 0 &&
                clonedColor.value.value <= 100);
        case 'xyz':
            return ([
                clonedColor.value.x,
                clonedColor.value.y,
                clonedColor.value.z
            ].every(isNumericValid) &&
                clonedColor.value.x >= 0 &&
                clonedColor.value.x <= 95.047 &&
                clonedColor.value.y >= 0 &&
                clonedColor.value.y <= 100.0 &&
                clonedColor.value.z >= 0 &&
                clonedColor.value.z <= 108.883);
        default:
            if (logMode.errors)
                log.error(`Unsupported color format: ${color.format}`);
            return false;
    }
}
function hex(value, pattern) {
    return pattern.test(value);
}
function hexComponent(value) {
    return hex(value, /^[A-Fa-f0-9]{2}$/);
}
function hexSet(value) {
    return /^#[0-9a-fA-F]{6}$/.test(value);
}
function range(value, rangeKey) {
    if (!isInRange(value, rangeKey)) {
        if (rangeKey === 'HexSet' || rangeKey === 'HexComponent') {
            throw new Error(`Invalid value for ${rangeKey}: ${value}`);
        }
        const [min, max] = _sets[rangeKey];
        throw new Error(`Value ${value} is out of range for ${rangeKey} [${min}, ${max}]`);
    }
}
export const validate = {
    colorValues,
    hex,
    hexComponent,
    hexSet,
    range
};
export { clone };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vY29yZS9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdDQUFnQztBQWtEaEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUVwRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUNsQyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUMzQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFFeEIsU0FBUyxZQUFZLENBQUMsS0FBYSxFQUFFLFFBQXlCO0lBQzdELE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRW5DLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBRUQsU0FBUyxLQUFLLENBQUksS0FBUTtJQUN6QixPQUFPLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBRUQsU0FBUyxRQUFRLENBQ2hCLElBQU8sRUFDUCxLQUFhO0lBRWIsSUFBSSxPQUFPLEdBQXlDLElBQUksQ0FBQztJQUV6RCxPQUFPLENBQUMsR0FBRyxJQUFtQixFQUFRLEVBQUU7UUFDdkMsSUFBSSxPQUFPO1lBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRW5DLE9BQU8sR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFD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S0FBSztDQUNMLENBQUM7QUFFRixPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvY29tbW9uL2NvcmUvYmFzZS5qc1xuXG5pbXBvcnQge1xuXHRBbHBoYVJhbmdlLFxuXHRCeXRlUmFuZ2UsXG5cdENNWUssXG5cdENNWUtVbmJyYW5kZWQsXG5cdENNWUtWYWx1ZSxcblx0Q29sb3IsXG5cdENvbG9yU3BhY2UsXG5cdENvbG9yU3RyaW5nLFxuXHRDb21tb25Db3JlRm5CYXNlLFxuXHRDb21tb25Db3JlRm5CcmFuZCxcblx0Q29tbW9uQ29yZUZuQnJhbmRDb2xvcixcblx0Q29tbW9uQ29yZUZuQ29udmVydCxcblx0Q29tbW9uQ29yZUZuR3VhcmRzLFxuXHRDb21tb25Db3JlRm5WYWxpZGF0ZSxcblx0SGV4LFxuXHRIZXhDb21wb25lbnQsXG5cdEhleFNldCxcblx0SGV4VW5icmFuZGVkLFxuXHRIU0wsXG5cdEhTTFVuYnJhbmRlZCxcblx0SFNMVmFsdWUsXG5cdEhTVixcblx0SFNWVW5icmFuZGVkLFxuXHRIU1ZWYWx1ZSxcblx0TEFCLFxuXHRMQUJVbmJyYW5kZWQsXG5cdExBQl9MLFxuXHRMQUJfQSxcblx0TEFCX0IsXG5cdE51bWVyaWNSYW5nZUtleSxcblx0UGVyY2VudGlsZSxcblx0UmFkaWFsLFxuXHRSYW5nZUtleU1hcCxcblx0UkdCLFxuXHRSR0JVbmJyYW5kZWQsXG5cdFNMLFxuXHRTTFVuYnJhbmRlZCxcblx0U0xWYWx1ZSxcblx0U1YsXG5cdFNWVW5icmFuZGVkLFxuXHRTVlZhbHVlLFxuXHRYWVosXG5cdFhZWlVuYnJhbmRlZCxcblx0WFlaX1gsXG5cdFhZWl9ZLFxuXHRYWVpfWlxufSBmcm9tICcuLi8uLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vLi4vZGF0YS9pbmRleC5qcyc7XG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuLi8uLi9jbGFzc2VzL2xvZ2dlci9pbmRleC5qcyc7XG5cbmNvbnN0IGxvZ01vZGUgPSBkYXRhLm1vZGUubG9nZ2luZztcbmNvbnN0IGRlZmF1bHRDb2xvcnMgPSBkYXRhLmRlZmF1bHRzLmNvbG9ycztcbmNvbnN0IG1vZGUgPSBkYXRhLm1vZGU7XG5jb25zdCBfc2V0cyA9IGRhdGEuc2V0cztcblxuZnVuY3Rpb24gY2xhbXBUb1JhbmdlKHZhbHVlOiBudW1iZXIsIHJhbmdlS2V5OiBOdW1lcmljUmFuZ2VLZXkpOiBudW1iZXIge1xuXHRjb25zdCBbbWluLCBtYXhdID0gX3NldHNbcmFuZ2VLZXldO1xuXG5cdHJldHVybiBNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgbWluKSwgbWF4KTtcbn1cblxuZnVuY3Rpb24gY2xvbmU8VD4odmFsdWU6IFQpOiBUIHtcblx0cmV0dXJuIHN0cnVjdHVyZWRDbG9uZSh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGRlYm91bmNlPFQgZXh0ZW5kcyAoLi4uYXJnczogUGFyYW1ldGVyczxUPikgPT4gdm9pZD4oXG5cdGZ1bmM6IFQsXG5cdGRlbGF5OiBudW1iZXJcbikge1xuXHRsZXQgdGltZW91dDogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudWxsID0gbnVsbDtcblxuXHRyZXR1cm4gKC4uLmFyZ3M6IFBhcmFtZXRlcnM8VD4pOiB2b2lkID0+IHtcblx0XHRpZiAodGltZW91dCkgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0ZnVuYyguLi5hcmdzKTtcblx0XHR9LCBkZWxheSk7XG5cdH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ3VzdG9tQ29sb3IocmF3VmFsdWU6IHN0cmluZyk6IEhTTCB8IG51bGwge1xuXHR0cnkge1xuXHRcdGlmICghbW9kZS5xdWlldClcblx0XHRcdGxvZy5pbmZvKGBQYXJzaW5nIGN1c3RvbSBjb2xvcjogJHtKU09OLnN0cmluZ2lmeShyYXdWYWx1ZSl9YCk7XG5cblx0XHRjb25zdCBtYXRjaCA9IHJhd1ZhbHVlLm1hdGNoKFxuXHRcdFx0L2hzbFxcKChcXGQrKSxcXHMqKFxcZCspJT8sXFxzKihcXGQrKSU/LFxccyooXFxkKlxcLj9cXGQrKVxcKS9cblx0XHQpO1xuXG5cdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHRjb25zdCBbLCBodWUsIHNhdHVyYXRpb24sIGxpZ2h0bmVzcywgYWxwaGFdID0gbWF0Y2g7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChwYXJzZUludChodWUpKSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VJbnQoc2F0dXJhdGlvbikpLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlSW50KGxpZ2h0bmVzcykpLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UocGFyc2VGbG9hdChhbHBoYSkpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdFx0bG9nLmVycm9yKFxuXHRcdFx0XHRcdCdJbnZhbGlkIEhTTCBjdXN0b20gY29sb3IuIEV4cGVjdGVkIGZvcm1hdDogaHNsKEgsIFMlLCBMJSwgQSknXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcnMpIGxvZy5lcnJvcihgcGFyc2VDdXN0b21Db2xvciBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBiYXNlOiBDb21tb25Db3JlRm5CYXNlID0ge1xuXHRjbGFtcFRvUmFuZ2UsXG5cdGNsb25lLFxuXHRkZWJvdW5jZSxcblx0cGFyc2VDdXN0b21Db2xvclxufSBhcyBjb25zdDtcblxuLy8gKioqKioqKiogU0VDVElPTiAyICoqKioqKioqXG5cbmZ1bmN0aW9uIGFzQWxwaGFSYW5nZSh2YWx1ZTogbnVtYmVyKTogQWxwaGFSYW5nZSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnQWxwaGFSYW5nZScpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBBbHBoYVJhbmdlO1xufVxuXG5mdW5jdGlvbiBhc0JyYW5kZWQ8VCBleHRlbmRzIGtleW9mIFJhbmdlS2V5TWFwPihcblx0dmFsdWU6IG51bWJlcixcblx0cmFuZ2VLZXk6IFRcbik6IFJhbmdlS2V5TWFwW1RdIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsIHJhbmdlS2V5KTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgUmFuZ2VLZXlNYXBbVF07XG59XG5cbmZ1bmN0aW9uIGFzQnl0ZVJhbmdlKHZhbHVlOiBudW1iZXIpOiBCeXRlUmFuZ2Uge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ0J5dGVSYW5nZScpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBCeXRlUmFuZ2U7XG59XG5cbmZ1bmN0aW9uIGFzSGV4Q29tcG9uZW50KHZhbHVlOiBzdHJpbmcpOiBIZXhDb21wb25lbnQge1xuXHRpZiAoIXZhbGlkYXRlLmhleENvbXBvbmVudCh2YWx1ZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgSGV4Q29tcG9uZW50IHZhbHVlOiAke3ZhbHVlfWApO1xuXHR9XG5cblx0cmV0dXJuIHZhbHVlIGFzIHVua25vd24gYXMgSGV4Q29tcG9uZW50O1xufVxuXG5mdW5jdGlvbiBhc0hleFNldCh2YWx1ZTogc3RyaW5nKTogSGV4U2V0IHtcblx0aWYgKC9eI1swLTlhLWZBLUZdezh9JC8udGVzdCh2YWx1ZSkpIHtcblx0XHR2YWx1ZSA9IHZhbHVlLnNsaWNlKDAsIDcpO1xuXHR9XG5cdGlmICghdmFsaWRhdGUuaGV4U2V0KHZhbHVlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBIZXhTZXQgdmFsdWU6ICR7dmFsdWV9YCk7XG5cdH1cblx0cmV0dXJuIHZhbHVlIGFzIEhleFNldDtcbn1cblxuZnVuY3Rpb24gYXNMQUJfTCh2YWx1ZTogbnVtYmVyKTogTEFCX0wge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ0xBQl9MJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIExBQl9MO1xufVxuXG5mdW5jdGlvbiBhc0xBQl9BKHZhbHVlOiBudW1iZXIpOiBMQUJfQSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnTEFCX0EnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgTEFCX0E7XG59XG5cbmZ1bmN0aW9uIGFzTEFCX0IodmFsdWU6IG51bWJlcik6IExBQl9CIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdMQUJfQicpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBMQUJfQjtcbn1cblxuZnVuY3Rpb24gYXNQZXJjZW50aWxlKHZhbHVlOiBudW1iZXIpOiBQZXJjZW50aWxlIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdQZXJjZW50aWxlJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIFBlcmNlbnRpbGU7XG59XG5cbmZ1bmN0aW9uIGFzUmFkaWFsKHZhbHVlOiBudW1iZXIpOiBSYWRpYWwge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ1JhZGlhbCcpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBSYWRpYWw7XG59XG5cbmZ1bmN0aW9uIGFzWFlaX1godmFsdWU6IG51bWJlcik6IFhZWl9YIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdYWVpfWCcpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBYWVpfWDtcbn1cblxuZnVuY3Rpb24gYXNYWVpfWSh2YWx1ZTogbnVtYmVyKTogWFlaX1kge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ1hZWl9ZJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIFhZWl9ZO1xufVxuXG5mdW5jdGlvbiBhc1hZWl9aKHZhbHVlOiBudW1iZXIpOiBYWVpfWiB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnWFlaX1onKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgWFlaX1o7XG59XG5cbmV4cG9ydCBjb25zdCBicmFuZDogQ29tbW9uQ29yZUZuQnJhbmQgPSB7XG5cdGFzQWxwaGFSYW5nZSxcblx0YXNCcmFuZGVkLFxuXHRhc0J5dGVSYW5nZSxcblx0YXNIZXhDb21wb25lbnQsXG5cdGFzSGV4U2V0LFxuXHRhc0xBQl9MLFxuXHRhc0xBQl9BLFxuXHRhc0xBQl9CLFxuXHRhc1BlcmNlbnRpbGUsXG5cdGFzUmFkaWFsLFxuXHRhc1hZWl9YLFxuXHRhc1hZWl9ZLFxuXHRhc1hZWl9aXG59O1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDIgLSBCcmFuZCBDb2xvciAqKioqKioqKlxuXG5mdW5jdGlvbiBhc0NNWUsoY29sb3I6IENNWUtVbmJyYW5kZWQpOiBDTVlLIHtcblx0Y29uc3QgYnJhbmRlZEN5YW4gPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUuY3lhbik7XG5cdGNvbnN0IGJyYW5kZWRNYWdlbnRhID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLm1hZ2VudGEpO1xuXHRjb25zdCBicmFuZGVkWWVsbG93ID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnllbGxvdyk7XG5cdGNvbnN0IGJyYW5kZWRLZXkgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUua2V5KTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRjeWFuOiBicmFuZGVkQ3lhbixcblx0XHRcdG1hZ2VudGE6IGJyYW5kZWRNYWdlbnRhLFxuXHRcdFx0eWVsbG93OiBicmFuZGVkWWVsbG93LFxuXHRcdFx0a2V5OiBicmFuZGVkS2V5LFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnY215aydcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNIZXgoY29sb3I6IEhleFVuYnJhbmRlZCk6IEhleCB7XG5cdGxldCBoZXggPSBjb2xvci52YWx1ZS5oZXg7XG5cblx0aWYgKCFoZXguc3RhcnRzV2l0aCgnIycpKSBoZXggPSBgIyR7aGV4fWA7XG5cblx0aWYgKCEvXiNbMC05QS1GYS1mXXs4fSQvLnRlc3QoaGV4KSlcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgSGV4IGNvbG9yIGZvcm1hdDogJHtoZXh9YCk7XG5cblx0Y29uc3QgaGV4TWFpbiA9IGhleC5zbGljZSgwLCA3KTtcblx0Y29uc3QgYWxwaGEgPSBoZXguc2xpY2UoNywgOSk7XG5cblx0Y29uc3QgYnJhbmRlZEhleCA9IGJyYW5kLmFzSGV4U2V0KGhleE1haW4pO1xuXHRjb25zdCBicmFuZGVkSGV4QWxwaGEgPSBicmFuZC5hc0hleENvbXBvbmVudChhbHBoYSk7XG5cdGNvbnN0IGJyYW5kZWROdW1BbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5udW1BbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0aGV4OiBicmFuZGVkSGV4LFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRIZXhBbHBoYSxcblx0XHRcdG51bUFscGhhOiBicmFuZGVkTnVtQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ2hleCdcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNIU0woY29sb3I6IEhTTFVuYnJhbmRlZCk6IEhTTCB7XG5cdGNvbnN0IGJyYW5kZWRIdWUgPSBicmFuZC5hc1JhZGlhbChjb2xvci52YWx1ZS5odWUpO1xuXHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5zYXR1cmF0aW9uKTtcblx0Y29uc3QgYnJhbmRlZExpZ2h0bmVzcyA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5saWdodG5lc3MpO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdGh1ZTogYnJhbmRlZEh1ZSxcblx0XHRcdHNhdHVyYXRpb246IGJyYW5kZWRTYXR1cmF0aW9uLFxuXHRcdFx0bGlnaHRuZXNzOiBicmFuZGVkTGlnaHRuZXNzLFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnaHNsJ1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc0hTVihjb2xvcjogSFNWVW5icmFuZGVkKTogSFNWIHtcblx0Y29uc3QgYnJhbmRlZEh1ZSA9IGJyYW5kLmFzUmFkaWFsKGNvbG9yLnZhbHVlLmh1ZSk7XG5cdGNvbnN0IGJyYW5kZWRTYXR1cmF0aW9uID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnNhdHVyYXRpb24pO1xuXHRjb25zdCBicmFuZGVkVmFsdWUgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUudmFsdWUpO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdGh1ZTogYnJhbmRlZEh1ZSxcblx0XHRcdHNhdHVyYXRpb246IGJyYW5kZWRTYXR1cmF0aW9uLFxuXHRcdFx0dmFsdWU6IGJyYW5kZWRWYWx1ZSxcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ2hzdidcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNMQUIoY29sb3I6IExBQlVuYnJhbmRlZCk6IExBQiB7XG5cdGNvbnN0IGJyYW5kZWRMID0gYnJhbmQuYXNMQUJfTChjb2xvci52YWx1ZS5sKTtcblx0Y29uc3QgYnJhbmRlZEEgPSBicmFuZC5hc0xBQl9BKGNvbG9yLnZhbHVlLmEpO1xuXHRjb25zdCBicmFuZGVkQiA9IGJyYW5kLmFzTEFCX0IoY29sb3IudmFsdWUuYik7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0bDogYnJhbmRlZEwsXG5cdFx0XHRhOiBicmFuZGVkQSxcblx0XHRcdGI6IGJyYW5kZWRCLFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnbGFiJ1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc1JHQihjb2xvcjogUkdCVW5icmFuZGVkKTogUkdCIHtcblx0Y29uc3QgYnJhbmRlZFJlZCA9IGJyYW5kLmFzQnl0ZVJhbmdlKGNvbG9yLnZhbHVlLnJlZCk7XG5cdGNvbnN0IGJyYW5kZWRHcmVlbiA9IGJyYW5kLmFzQnl0ZVJhbmdlKGNvbG9yLnZhbHVlLmdyZWVuKTtcblx0Y29uc3QgYnJhbmRlZEJsdWUgPSBicmFuZC5hc0J5dGVSYW5nZShjb2xvci52YWx1ZS5ibHVlKTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRyZWQ6IGJyYW5kZWRSZWQsXG5cdFx0XHRncmVlbjogYnJhbmRlZEdyZWVuLFxuXHRcdFx0Ymx1ZTogYnJhbmRlZEJsdWUsXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdyZ2InXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzU0woY29sb3I6IFNMVW5icmFuZGVkKTogU0wge1xuXHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5zYXR1cmF0aW9uKTtcblx0Y29uc3QgYnJhbmRlZExpZ2h0bmVzcyA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5saWdodG5lc3MpO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdHNhdHVyYXRpb246IGJyYW5kZWRTYXR1cmF0aW9uLFxuXHRcdFx0bGlnaHRuZXNzOiBicmFuZGVkTGlnaHRuZXNzLFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnc2wnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzU1YoY29sb3I6IFNWVW5icmFuZGVkKTogU1Yge1xuXHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5zYXR1cmF0aW9uKTtcblx0Y29uc3QgYnJhbmRlZFZhbHVlID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnZhbHVlKTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdHZhbHVlOiBicmFuZGVkVmFsdWUsXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdzdidcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNYWVooY29sb3I6IFhZWlVuYnJhbmRlZCk6IFhZWiB7XG5cdGNvbnN0IGJyYW5kZWRYID0gYnJhbmQuYXNYWVpfWChjb2xvci52YWx1ZS54KTtcblx0Y29uc3QgYnJhbmRlZFkgPSBicmFuZC5hc1hZWl9ZKGNvbG9yLnZhbHVlLnkpO1xuXHRjb25zdCBicmFuZGVkWiA9IGJyYW5kLmFzWFlaX1ooY29sb3IudmFsdWUueik7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0eDogYnJhbmRlZFgsXG5cdFx0XHR5OiBicmFuZGVkWSxcblx0XHRcdHo6IGJyYW5kZWRaLFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAneHl6J1xuXHR9O1xufVxuXG5leHBvcnQgY29uc3QgYnJhbmRDb2xvcjogQ29tbW9uQ29yZUZuQnJhbmRDb2xvciA9IHtcblx0YXNDTVlLLFxuXHRhc0hleCxcblx0YXNIU0wsXG5cdGFzSFNWLFxuXHRhc0xBQixcblx0YXNSR0IsXG5cdGFzU0wsXG5cdGFzU1YsXG5cdGFzWFlaXG59O1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDMgLSBDb252ZXJ0ICoqKioqKioqXG5cbmZ1bmN0aW9uIGhleEFscGhhVG9OdW1lcmljQWxwaGEoaGV4QWxwaGE6IHN0cmluZyk6IG51bWJlciB7XG5cdHJldHVybiBwYXJzZUludChoZXhBbHBoYSwgMTYpIC8gMjU1O1xufVxuXG5mdW5jdGlvbiB0b0NvbG9yKGNvbG9yU3RyaW5nOiBDb2xvclN0cmluZyk6IENvbG9yIHtcblx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjbG9uZShjb2xvclN0cmluZyk7XG5cblx0Y29uc3QgcGFyc2VWYWx1ZSA9ICh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyID0+XG5cdFx0dHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5lbmRzV2l0aCgnJScpXG5cdFx0XHQ/IHBhcnNlRmxvYXQodmFsdWUuc2xpY2UoMCwgLTEpKVxuXHRcdFx0OiBOdW1iZXIodmFsdWUpO1xuXG5cdGNvbnN0IG5ld1ZhbHVlID0gT2JqZWN0LmVudHJpZXMoY2xvbmVkQ29sb3IudmFsdWUpLnJlZHVjZShcblx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHRhY2Nba2V5IGFzIGtleW9mICh0eXBlb2YgY2xvbmVkQ29sb3IpWyd2YWx1ZSddXSA9IHBhcnNlVmFsdWUoXG5cdFx0XHRcdHZhbFxuXHRcdFx0KSBhcyBuZXZlcjtcblx0XHRcdHJldHVybiBhY2M7XG5cdFx0fSxcblx0XHR7fSBhcyBSZWNvcmQ8a2V5b2YgKHR5cGVvZiBjbG9uZWRDb2xvcilbJ3ZhbHVlJ10sIG51bWJlcj5cblx0KTtcblxuXHRzd2l0Y2ggKGNsb25lZENvbG9yLmZvcm1hdCkge1xuXHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnY215aycsIHZhbHVlOiBuZXdWYWx1ZSBhcyBDTVlLVmFsdWUgfTtcblx0XHRjYXNlICdoc2wnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnaHNsJywgdmFsdWU6IG5ld1ZhbHVlIGFzIEhTTFZhbHVlIH07XG5cdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ2hzdicsIHZhbHVlOiBuZXdWYWx1ZSBhcyBIU1ZWYWx1ZSB9O1xuXHRcdGNhc2UgJ3NsJzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ3NsJywgdmFsdWU6IG5ld1ZhbHVlIGFzIFNMVmFsdWUgfTtcblx0XHRjYXNlICdzdic6XG5cdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdzdicsIHZhbHVlOiBuZXdWYWx1ZSBhcyBTVlZhbHVlIH07XG5cdFx0ZGVmYXVsdDpcblx0XHRcdGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdFx0bG9nLmVycm9yKCdVbnN1cHBvcnRlZCBmb3JtYXQgZm9yIGNvbG9yU3RyaW5nVG9Db2xvcicpO1xuXG5cdFx0XHRjb25zdCB1bmJyYW5kZWRIU0wgPSBkZWZhdWx0Q29sb3JzLmhzbDtcblxuXHRcdFx0Y29uc3QgYnJhbmRlZEh1ZSA9IGJyYW5kLmFzUmFkaWFsKHVuYnJhbmRlZEhTTC52YWx1ZS5odWUpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdHVuYnJhbmRlZEhTTC52YWx1ZS5zYXR1cmF0aW9uXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZExpZ2h0bmVzcyA9IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0dW5icmFuZGVkSFNMLnZhbHVlLmxpZ2h0bmVzc1xuXHRcdFx0KTtcblx0XHRcdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZSh1bmJyYW5kZWRIU0wudmFsdWUuYWxwaGEpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmRlZEh1ZSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kZWRMaWdodG5lc3MsXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9O1xuXHR9XG59XG5cbmZ1bmN0aW9uIHRvQ29sb3JWYWx1ZVJhbmdlPFQgZXh0ZW5kcyBrZXlvZiBSYW5nZUtleU1hcD4oXG5cdHZhbHVlOiBzdHJpbmcgfCBudW1iZXIsXG5cdHJhbmdlS2V5OiBUXG4pOiBSYW5nZUtleU1hcFtUXSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCByYW5nZUtleSk7XG5cblx0aWYgKHJhbmdlS2V5ID09PSAnSGV4U2V0Jykge1xuXHRcdHJldHVybiBicmFuZC5hc0hleFNldCh2YWx1ZSBhcyBzdHJpbmcpIGFzIHVua25vd24gYXMgUmFuZ2VLZXlNYXBbVF07XG5cdH1cblxuXHRpZiAocmFuZ2VLZXkgPT09ICdIZXhDb21wb25lbnQnKSB7XG5cdFx0cmV0dXJuIGJyYW5kLmFzSGV4Q29tcG9uZW50KFxuXHRcdFx0dmFsdWUgYXMgc3RyaW5nXG5cdFx0KSBhcyB1bmtub3duIGFzIFJhbmdlS2V5TWFwW1RdO1xuXHR9XG5cblx0cmV0dXJuIGJyYW5kLmFzQnJhbmRlZChcblx0XHR2YWx1ZSBhcyBudW1iZXIsXG5cdFx0cmFuZ2VLZXlcblx0KSBhcyB1bmtub3duIGFzIFJhbmdlS2V5TWFwW1RdO1xufVxuXG5mdW5jdGlvbiB0b0NTU0NvbG9yU3RyaW5nKGNvbG9yOiBDb2xvcik6IHN0cmluZyB7XG5cdHRyeSB7XG5cdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gYGNteWsoJHtjb2xvci52YWx1ZS5jeWFufSwgJHtjb2xvci52YWx1ZS5tYWdlbnRhfSwgJHtjb2xvci52YWx1ZS55ZWxsb3d9LCAke2NvbG9yLnZhbHVlLmtleX0sICR7Y29sb3IudmFsdWUuYWxwaGF9KWA7XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRyZXR1cm4gU3RyaW5nKGNvbG9yLnZhbHVlLmhleCk7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gYGhzbCgke2NvbG9yLnZhbHVlLmh1ZX0sICR7Y29sb3IudmFsdWUuc2F0dXJhdGlvbn0lLCAke2NvbG9yLnZhbHVlLmxpZ2h0bmVzc30lLCAke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGBoc3YoJHtjb2xvci52YWx1ZS5odWV9LCAke2NvbG9yLnZhbHVlLnNhdHVyYXRpb259JSwgJHtjb2xvci52YWx1ZS52YWx1ZX0lLCAke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0cmV0dXJuIGBsYWIoJHtjb2xvci52YWx1ZS5sfSwgJHtjb2xvci52YWx1ZS5hfSwgJHtjb2xvci52YWx1ZS5ifSwgJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdHJldHVybiBgcmdiKCR7Y29sb3IudmFsdWUucmVkfSwgJHtjb2xvci52YWx1ZS5ncmVlbn0sICR7Y29sb3IudmFsdWUuYmx1ZX0sICR7Y29sb3IudmFsdWUuYWxwaGF9KWA7XG5cdFx0XHRjYXNlICd4eXonOlxuXHRcdFx0XHRyZXR1cm4gYHh5eigke2NvbG9yLnZhbHVlLnh9LCAke2NvbG9yLnZhbHVlLnl9LCAke2NvbG9yLnZhbHVlLnp9LCAke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0aWYgKGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRcdGxvZy5lcnJvcihgVW5leHBlY3RlZCBjb2xvciBmb3JtYXQ6ICR7Y29sb3IuZm9ybWF0fWApO1xuXG5cdFx0XHRcdHJldHVybiAnI0ZGRkZGRkZGJztcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBnZXRDU1NDb2xvclN0cmluZyBlcnJvcjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgY29udmVydDogQ29tbW9uQ29yZUZuQ29udmVydCA9IHtcblx0aGV4QWxwaGFUb051bWVyaWNBbHBoYSxcblx0dG9Db2xvcixcblx0dG9Db2xvclZhbHVlUmFuZ2UsXG5cdHRvQ1NTQ29sb3JTdHJpbmdcbn07XG5cbi8vICoqKioqKioqIFNFQ1RJT04gNCAtIEd1YXJkcyAqKioqKioqKlxuXG5mdW5jdGlvbiBpc0NvbG9yKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ29sb3Ige1xuXHRpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fCB2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG5cdGNvbnN0IGNvbG9yID0gdmFsdWUgYXMgQ29sb3I7XG5cdGNvbnN0IHZhbGlkRm9ybWF0czogQ29sb3JbJ2Zvcm1hdCddW10gPSBbXG5cdFx0J2NteWsnLFxuXHRcdCdoZXgnLFxuXHRcdCdoc2wnLFxuXHRcdCdoc3YnLFxuXHRcdCdsYWInLFxuXHRcdCdyZ2InLFxuXHRcdCdzbCcsXG5cdFx0J3N2Jyxcblx0XHQneHl6J1xuXHRdO1xuXG5cdHJldHVybiAoXG5cdFx0J3ZhbHVlJyBpbiBjb2xvciAmJlxuXHRcdCdmb3JtYXQnIGluIGNvbG9yICYmXG5cdFx0dmFsaWRGb3JtYXRzLmluY2x1ZGVzKGNvbG9yLmZvcm1hdClcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNDb2xvclNwYWNlKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ29sb3JTcGFjZSB7XG5cdGNvbnN0IHZhbGlkQ29sb3JTcGFjZXM6IENvbG9yU3BhY2VbXSA9IFtcblx0XHQnY215aycsXG5cdFx0J2hleCcsXG5cdFx0J2hzbCcsXG5cdFx0J2hzdicsXG5cdFx0J2xhYicsXG5cdFx0J3JnYicsXG5cdFx0J3h5eidcblx0XTtcblxuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiZcblx0XHR2YWxpZENvbG9yU3BhY2VzLmluY2x1ZGVzKHZhbHVlIGFzIENvbG9yU3BhY2UpXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzQ29sb3JTdHJpbmcodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDb2xvclN0cmluZyB7XG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8IHZhbHVlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cblx0Y29uc3QgY29sb3JTdHJpbmcgPSB2YWx1ZSBhcyBDb2xvclN0cmluZztcblx0Y29uc3QgdmFsaWRTdHJpbmdGb3JtYXRzOiBDb2xvclN0cmluZ1snZm9ybWF0J11bXSA9IFtcblx0XHQnY215aycsXG5cdFx0J2hzbCcsXG5cdFx0J2hzdicsXG5cdFx0J3NsJyxcblx0XHQnc3YnXG5cdF07XG5cblx0cmV0dXJuIChcblx0XHQndmFsdWUnIGluIGNvbG9yU3RyaW5nICYmXG5cdFx0J2Zvcm1hdCcgaW4gY29sb3JTdHJpbmcgJiZcblx0XHR2YWxpZFN0cmluZ0Zvcm1hdHMuaW5jbHVkZXMoY29sb3JTdHJpbmcuZm9ybWF0KVxuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0luUmFuZ2U8VCBleHRlbmRzIGtleW9mIHR5cGVvZiBfc2V0cz4oXG5cdHZhbHVlOiBudW1iZXIgfCBzdHJpbmcsXG5cdHJhbmdlS2V5OiBUXG4pOiBib29sZWFuIHtcblx0aWYgKHJhbmdlS2V5ID09PSAnSGV4U2V0Jykge1xuXHRcdHJldHVybiB2YWxpZGF0ZS5oZXhTZXQodmFsdWUgYXMgc3RyaW5nKTtcblx0fVxuXG5cdGlmIChyYW5nZUtleSA9PT0gJ0hleENvbXBvbmVudCcpIHtcblx0XHRyZXR1cm4gdmFsaWRhdGUuaGV4Q29tcG9uZW50KHZhbHVlIGFzIHN0cmluZyk7XG5cdH1cblxuXHRpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBBcnJheS5pc0FycmF5KF9zZXRzW3JhbmdlS2V5XSkpIHtcblx0XHRjb25zdCBbbWluLCBtYXhdID0gX3NldHNbcmFuZ2VLZXldIGFzIFtudW1iZXIsIG51bWJlcl07XG5cblx0XHRyZXR1cm4gdmFsdWUgPj0gbWluICYmIHZhbHVlIDw9IG1heDtcblx0fVxuXG5cdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCByYW5nZSBvciB2YWx1ZSBmb3IgJHtyYW5nZUtleX1gKTtcbn1cblxuZXhwb3J0IGNvbnN0IGd1YXJkczogQ29tbW9uQ29yZUZuR3VhcmRzID0ge1xuXHRpc0NvbG9yLFxuXHRpc0NvbG9yU3BhY2UsXG5cdGlzQ29sb3JTdHJpbmcsXG5cdGlzSW5SYW5nZVxufTtcblxuLy8gKioqKioqKiogU0VDVElPTiA1IC0gU2FuaXRpemUgKioqKioqKipcblxuZnVuY3Rpb24gbGFiKHZhbHVlOiBudW1iZXIsIG91dHB1dDogJ2wnIHwgJ2EnIHwgJ2InKTogTEFCX0wgfCBMQUJfQSB8IExBQl9CIHtcblx0aWYgKG91dHB1dCA9PT0gJ2wnKSB7XG5cdFx0cmV0dXJuIGJyYW5kLmFzTEFCX0woTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgMCksIDEwMCkpKTtcblx0fSBlbHNlIGlmIChvdXRwdXQgPT09ICdhJykge1xuXHRcdHJldHVybiBicmFuZC5hc0xBQl9BKE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIC0xMjUpLCAxMjUpKSk7XG5cdH0gZWxzZSBpZiAob3V0cHV0ID09PSAnYicpIHtcblx0XHRyZXR1cm4gYnJhbmQuYXNMQUJfQihNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAtMTI1KSwgMTI1KSkpO1xuXHR9IGVsc2UgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gcmV0dXJuIExBQiB2YWx1ZScpO1xufVxuXG5mdW5jdGlvbiBwZXJjZW50aWxlKHZhbHVlOiBudW1iZXIpOiBQZXJjZW50aWxlIHtcblx0Y29uc3QgcmF3UGVyY2VudGlsZSA9IE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIDApLCAxMDApKTtcblxuXHRyZXR1cm4gYnJhbmQuYXNQZXJjZW50aWxlKHJhd1BlcmNlbnRpbGUpO1xufVxuXG5mdW5jdGlvbiByYWRpYWwodmFsdWU6IG51bWJlcik6IFJhZGlhbCB7XG5cdGNvbnN0IHJhd1JhZGlhbCA9IE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIDApLCAzNjApKSAmIDM2MDtcblxuXHRyZXR1cm4gYnJhbmQuYXNSYWRpYWwocmF3UmFkaWFsKTtcbn1cblxuZnVuY3Rpb24gcmdiKHZhbHVlOiBudW1iZXIpOiBCeXRlUmFuZ2Uge1xuXHRjb25zdCByYXdCeXRlUmFuZ2UgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAwKSwgMjU1KSk7XG5cblx0cmV0dXJuIHRvQ29sb3JWYWx1ZVJhbmdlKHJhd0J5dGVSYW5nZSwgJ0J5dGVSYW5nZScpO1xufVxuXG5leHBvcnQgY29uc3Qgc2FuaXRpemUgPSB7XG5cdGxhYixcblx0cGVyY2VudGlsZSxcblx0cmFkaWFsLFxuXHRyZ2Jcbn07XG5cbi8vICoqKioqKioqIFNFQ1RJT04gNiAtIFZhbGlkYXRlICoqKioqKioqXG5cbmZ1bmN0aW9uIGNvbG9yVmFsdWVzKGNvbG9yOiBDb2xvciB8IFNMIHwgU1YpOiBib29sZWFuIHtcblx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjbG9uZShjb2xvcik7XG5cdGNvbnN0IGlzTnVtZXJpY1ZhbGlkID0gKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiA9PlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKTtcblx0Y29uc3Qgbm9ybWFsaXplUGVyY2VudGFnZSA9ICh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyID0+IHtcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5lbmRzV2l0aCgnJScpKSB7XG5cdFx0XHRyZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZS5zbGljZSgwLCAtMSkpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInID8gdmFsdWUgOiBOYU47XG5cdH07XG5cblx0c3dpdGNoIChjbG9uZWRDb2xvci5mb3JtYXQpIHtcblx0XHRjYXNlICdjbXlrJzpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFtcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5jeWFuLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLm1hZ2VudGEsXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueWVsbG93LFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmtleVxuXHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5jeWFuID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuY3lhbiA8PSAxMDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubWFnZW50YSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLm1hZ2VudGEgPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnllbGxvdyA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnllbGxvdyA8PSAxMDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUua2V5ID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUua2V5IDw9IDEwMFxuXHRcdFx0KTtcblx0XHRjYXNlICdoZXgnOlxuXHRcdFx0cmV0dXJuIC9eI1swLTlBLUZhLWZdezZ9JC8udGVzdChjbG9uZWRDb2xvci52YWx1ZS5oZXgpO1xuXHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRjb25zdCBpc1ZhbGlkSFNMSHVlID1cblx0XHRcdFx0aXNOdW1lcmljVmFsaWQoY2xvbmVkQ29sb3IudmFsdWUuaHVlKSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5odWUgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5odWUgPD0gMzYwO1xuXHRcdFx0Y29uc3QgaXNWYWxpZEhTTFNhdHVyYXRpb24gPVxuXHRcdFx0XHRub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24pID49IDAgJiZcblx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uKSA8PSAxMDA7XG5cdFx0XHRjb25zdCBpc1ZhbGlkSFNMTGlnaHRuZXNzID0gY2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzXG5cdFx0XHRcdD8gbm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MpID49IDAgJiZcblx0XHRcdFx0XHRub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLmxpZ2h0bmVzcykgPD0gMTAwXG5cdFx0XHRcdDogdHJ1ZTtcblxuXHRcdFx0cmV0dXJuIGlzVmFsaWRIU0xIdWUgJiYgaXNWYWxpZEhTTFNhdHVyYXRpb24gJiYgaXNWYWxpZEhTTExpZ2h0bmVzcztcblx0XHRjYXNlICdoc3YnOlxuXHRcdFx0Y29uc3QgaXNWYWxpZEhTVkh1ZSA9XG5cdFx0XHRcdGlzTnVtZXJpY1ZhbGlkKGNsb25lZENvbG9yLnZhbHVlLmh1ZSkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlIDw9IDM2MDtcblx0XHRcdGNvbnN0IGlzVmFsaWRIU1ZTYXR1cmF0aW9uID1cblx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uKSA+PSAwICYmXG5cdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbikgPD0gMTAwO1xuXHRcdFx0Y29uc3QgaXNWYWxpZEhTVlZhbHVlID0gY2xvbmVkQ29sb3IudmFsdWUudmFsdWVcblx0XHRcdFx0PyBub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLnZhbHVlKSA+PSAwICYmXG5cdFx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSkgPD0gMTAwXG5cdFx0XHRcdDogdHJ1ZTtcblxuXHRcdFx0cmV0dXJuIGlzVmFsaWRIU1ZIdWUgJiYgaXNWYWxpZEhTVlNhdHVyYXRpb24gJiYgaXNWYWxpZEhTVlZhbHVlO1xuXHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubCxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5hLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmJcblx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubCA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmwgPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmEgPj0gLTEyNSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5hIDw9IDEyNSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5iID49IC0xMjUgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYiA8PSAxMjVcblx0XHRcdCk7XG5cdFx0Y2FzZSAncmdiJzpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFtcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5yZWQsXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuZ3JlZW4sXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYmx1ZVxuXHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5yZWQgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5yZWQgPD0gMjU1ICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmdyZWVuID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuZ3JlZW4gPD0gMjU1ICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmJsdWUgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ibHVlIDw9IDI1NVxuXHRcdFx0KTtcblx0XHRjYXNlICdzbCc6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbixcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3Ncblx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24gPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmxpZ2h0bmVzcyA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmxpZ2h0bmVzcyA8PSAxMDBcblx0XHRcdCk7XG5cdFx0Y2FzZSAnc3YnOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0W2Nsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24sIGNsb25lZENvbG9yLnZhbHVlLnZhbHVlXS5ldmVyeShcblx0XHRcdFx0XHRpc051bWVyaWNWYWxpZFxuXHRcdFx0XHQpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24gPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnZhbHVlIDw9IDEwMFxuXHRcdFx0KTtcblx0XHRjYXNlICd4eXonOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0W1xuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLngsXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueSxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS56XG5cdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnggPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS54IDw9IDk1LjA0NyAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55ID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueSA8PSAxMDAuMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS56ID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueiA8PSAxMDguODgzXG5cdFx0XHQpO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdGxvZy5lcnJvcihgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yLmZvcm1hdH1gKTtcblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleCh2YWx1ZTogc3RyaW5nLCBwYXR0ZXJuOiBSZWdFeHApOiBib29sZWFuIHtcblx0cmV0dXJuIHBhdHRlcm4udGVzdCh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGhleENvbXBvbmVudCh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdHJldHVybiBoZXgodmFsdWUsIC9eW0EtRmEtZjAtOV17Mn0kLyk7XG59XG5cbmZ1bmN0aW9uIGhleFNldCh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdHJldHVybiAvXiNbMC05YS1mQS1GXXs2fSQvLnRlc3QodmFsdWUpO1xufVxuXG5mdW5jdGlvbiByYW5nZTxUIGV4dGVuZHMga2V5b2YgdHlwZW9mIF9zZXRzPihcblx0dmFsdWU6IG51bWJlciB8IHN0cmluZyxcblx0cmFuZ2VLZXk6IFRcbik6IHZvaWQge1xuXHRpZiAoIWlzSW5SYW5nZSh2YWx1ZSwgcmFuZ2VLZXkpKSB7XG5cdFx0aWYgKHJhbmdlS2V5ID09PSAnSGV4U2V0JyB8fCByYW5nZUtleSA9PT0gJ0hleENvbXBvbmVudCcpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB2YWx1ZSBmb3IgJHtyYW5nZUtleX06ICR7dmFsdWV9YCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgW21pbiwgbWF4XSA9IF9zZXRzW3JhbmdlS2V5XSBhcyBbbnVtYmVyLCBudW1iZXJdO1xuXG5cdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0YFZhbHVlICR7dmFsdWV9IGlzIG91dCBvZiByYW5nZSBmb3IgJHtyYW5nZUtleX0gWyR7bWlufSwgJHttYXh9XWBcblx0XHQpO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZTogQ29tbW9uQ29yZUZuVmFsaWRhdGUgPSB7XG5cdGNvbG9yVmFsdWVzLFxuXHRoZXgsXG5cdGhleENvbXBvbmVudCxcblx0aGV4U2V0LFxuXHRyYW5nZVxufTtcblxuZXhwb3J0IHsgY2xvbmUgfTtcbiJdfQ==