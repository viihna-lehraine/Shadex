// File: src/common/core/base.js
import { data } from '../../data/index.js';
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
            console.log(`Parsing custom color: ${JSON.stringify(rawValue)}`);
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
            if (mode.errorLogs)
                console.error('Invalid HSL custom color. Expected format: hsl(H, S%, L%, A)');
            return null;
        }
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`parseCustomColor error: ${error}`);
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
            if (mode.errorLogs)
                console.error('Unsupported format for colorStringToColor');
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
                return `cmyk(${color.value.cyan},${color.value.magenta},${color.value.yellow},${color.value.key}${color.value.alpha})`;
            case 'hex':
                return String(color.value.hex);
            case 'hsl':
                return `hsl(${color.value.hue},${color.value.saturation}%,${color.value.lightness}%,${color.value.alpha})`;
            case 'hsv':
                return `hsv(${color.value.hue},${color.value.saturation}%,${color.value.value}%,${color.value.alpha})`;
            case 'lab':
                return `lab(${color.value.l},${color.value.a},${color.value.b},${color.value.alpha})`;
            case 'rgb':
                return `rgb(${color.value.red},${color.value.green},${color.value.blue},${color.value.alpha})`;
            case 'xyz':
                return `xyz(${color.value.x},${color.value.y},${color.value.z},${color.value.alpha})`;
            default:
                if (mode.errorLogs)
                    console.error(`Unexpected color format: ${color.format}`);
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
            if (mode.errorLogs)
                console.error(`Unsupported color format: ${color.format}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vY29yZS9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdDQUFnQztBQWtEaEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTNDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQzNDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUV4QixTQUFTLFlBQVksQ0FBQyxLQUFhLEVBQUUsUUFBeUI7SUFDN0QsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFbkMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBSSxLQUFRO0lBQ3pCLE9BQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FDaEIsSUFBTyxFQUNQLEtBQWE7SUFFYixJQUFJLE9BQU8sR0FBeUMsSUFBSSxDQUFDO0lBRXpELE9BQU8sQ0FBQyxHQUFHLElBQW1CLEVBQVEsRUFBRTtRQUN2QyxJQUFJLE9BQU87WUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbkMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDekIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDZixDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDWCxDQUFDLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxRQUFnQjtJQUN6QyxJQUFJLENBQUM7UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7WUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVsRSxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUMzQixtREFBbUQsQ0FDbkQsQ0FBQztRQUVGLElBQUksS0FBSyxFQUFFLENBQUM7WUFDWCxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7WUFFcEQsT0FBTztnQkFDTixLQUFLLEVBQUU7b0JBQ04sR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNsQyxVQUFVLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ3BELFNBQVMsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDbEQsS0FBSyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUM1QztnQkFDRCxNQUFNLEVBQUUsS0FBSzthQUNiLENBQUM7UUFDSCxDQUFDO2FBQU0sQ0FBQztZQUNQLElBQUksSUFBSSxDQUFDLFNBQVM7Z0JBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQ1osOERBQThELENBQzlELENBQUM7WUFFSCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7SUFDRixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixJQUFJLElBQUksQ0FBQyxTQUFTO1lBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUV0RSxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFxQjtJQUNyQyxZQUFZO0lBQ1osS0FBSztJQUNMLFFBQVE7SUFDUixnQkFBZ0I7Q0FDUCxDQUFDO0FBRVgsOEJBQThCO0FBRTlCLFNBQVMsWUFBWSxDQUFDLEtBQWE7SUFDbEMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFFcEMsT0FBTyxLQUFtQixDQUFDO0FBQzVCLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FDakIsS0FBYSxFQUNiLFFBQVc7SUFFWCxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUVoQyxPQUFPLEtBQXVCLENBQUM7QUFDaEMsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLEtBQWE7SUFDakMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFbkMsT0FBTyxLQUFrQixDQUFDO0FBQzNCLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxLQUFhO0lBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsT0FBTyxLQUFnQyxDQUFDO0FBQ3pDLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FBQyxLQUFhO0lBQzlCLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDckMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUNELE9BQU8sS0FBZSxDQUFDO0FBQ3hCLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxLQUFhO0lBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRS9CLE9BQU8sS0FBYyxDQUFDO0FBQ3ZCLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxLQUFhO0lBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRS9CLE9BQU8sS0FBYyxDQUFDO0FBQ3ZCLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxLQUFhO0lBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRS9CLE9BQU8sS0FBYyxDQUFDO0FBQ3ZCLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxLQUFhO0lBQ2xDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBRXBDLE9BQU8sS0FBbUIsQ0FBQztBQUM1QixDQUFDO0FBRUQsU0FBUyxRQUFRLENBQUMsS0FBYTtJQUM5QixRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUVoQyxPQUFPLEtBQWUsQ0FBQztBQUN4QixDQUFDO0FBRUQsU0FBUyxPQUFPLENBQUMsS0FBYTtJQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUUvQixPQUFPLEtBQWMsQ0FBQztBQUN2QixDQUFDO0FBRUQsU0FBUyxPQUFPLENBQUMsS0FBYTtJQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUUvQixPQUFPLEtBQWMsQ0FBQztBQUN2QixDQUFDO0FBRUQsU0FBUyxPQUFPLENBQUMsS0FBYTtJQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUUvQixPQUFPLEtBQWMsQ0FBQztBQUN2QixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFzQjtJQUN2QyxZQUFZO0lBQ1osU0FBUztJQUNULFdBQVc7SUFDWCxjQUFjO0lBQ2QsUUFBUTtJQUNSLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLFlBQVk7SUFDWixRQUFRO0lBQ1IsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0NBQ1AsQ0FBQztBQUVGLDRDQUE0QztBQUU1QyxTQUFTLE1BQU0sQ0FBQyxLQUFvQjtJQUNuQyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekQsTUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9ELE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3RCxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkQsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTNELE9BQU87UUFDTixLQUFLLEVBQUU7WUFDTixJQUFJLEVBQUUsV0FBVztZQUNqQixPQUFPLEVBQUUsY0FBYztZQUN2QixNQUFNLEVBQUUsYUFBYTtZQUNyQixHQUFHLEVBQUUsVUFBVTtZQUNmLEtBQUssRUFBRSxZQUFZO1NBQ25CO1FBQ0QsTUFBTSxFQUFFLE1BQU07S0FDZCxDQUFDO0FBQ0gsQ0FBQztBQUVELFNBQVMsS0FBSyxDQUFDLEtBQW1CO0lBQ2pDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0lBRTFCLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztRQUFFLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBRTFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFFckQsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEMsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFOUIsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzQyxNQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BELE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVqRSxPQUFPO1FBQ04sS0FBSyxFQUFFO1lBQ04sR0FBRyxFQUFFLFVBQVU7WUFDZixLQUFLLEVBQUUsZUFBZTtZQUN0QixRQUFRLEVBQUUsZUFBZTtTQUN6QjtRQUNELE1BQU0sRUFBRSxLQUFLO0tBQ2IsQ0FBQztBQUNILENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBQyxLQUFtQjtJQUNqQyxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkQsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDckUsTUFBTSxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkUsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTNELE9BQU87UUFDTixLQUFLLEVBQUU7WUFDTixHQUFHLEVBQUUsVUFBVTtZQUNmLFVBQVUsRUFBRSxpQkFBaUI7WUFDN0IsU0FBUyxFQUFFLGdCQUFnQjtZQUMzQixLQUFLLEVBQUUsWUFBWTtTQUNuQjtRQUNELE1BQU0sRUFBRSxLQUFLO0tBQ2IsQ0FBQztBQUNILENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBQyxLQUFtQjtJQUNqQyxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkQsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDckUsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNELE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUUzRCxPQUFPO1FBQ04sS0FBSyxFQUFFO1lBQ04sR0FBRyxFQUFFLFVBQVU7WUFDZixVQUFVLEVBQUUsaUJBQWlCO1lBQzdCLEtBQUssRUFBRSxZQUFZO1lBQ25CLEtBQUssRUFBRSxZQUFZO1NBQ25CO1FBQ0QsTUFBTSxFQUFFLEtBQUs7S0FDYixDQUFDO0FBQ0gsQ0FBQztBQUVELFNBQVMsS0FBSyxDQUFDLEtBQW1CO0lBQ2pDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUUzRCxPQUFPO1FBQ04sS0FBSyxFQUFFO1lBQ04sQ0FBQyxFQUFFLFFBQVE7WUFDWCxDQUFDLEVBQUUsUUFBUTtZQUNYLENBQUMsRUFBRSxRQUFRO1lBQ1gsS0FBSyxFQUFFLFlBQVk7U0FDbkI7UUFDRCxNQUFNLEVBQUUsS0FBSztLQUNiLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxLQUFLLENBQUMsS0FBbUI7SUFDakMsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RELE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRCxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEQsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTNELE9BQU87UUFDTixLQUFLLEVBQUU7WUFDTixHQUFHLEVBQUUsVUFBVTtZQUNmLEtBQUssRUFBRSxZQUFZO1lBQ25CLElBQUksRUFBRSxXQUFXO1lBQ2pCLEtBQUssRUFBRSxZQUFZO1NBQ25CO1FBQ0QsTUFBTSxFQUFFLEtBQUs7S0FDYixDQUFDO0FBQ0gsQ0FBQztBQUVELFNBQVMsSUFBSSxDQUFDLEtBQWtCO0lBQy9CLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JFLE1BQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25FLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUUzRCxPQUFPO1FBQ04sS0FBSyxFQUFFO1lBQ04sVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLEtBQUssRUFBRSxZQUFZO1NBQ25CO1FBQ0QsTUFBTSxFQUFFLElBQUk7S0FDWixDQUFDO0FBQ0gsQ0FBQztBQUVELFNBQVMsSUFBSSxDQUFDLEtBQWtCO0lBQy9CLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JFLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzRCxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFM0QsT0FBTztRQUNOLEtBQUssRUFBRTtZQUNOLFVBQVUsRUFBRSxpQkFBaUI7WUFDN0IsS0FBSyxFQUFFLFlBQVk7WUFDbkIsS0FBSyxFQUFFLFlBQVk7U0FDbkI7UUFDRCxNQUFNLEVBQUUsSUFBSTtLQUNaLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxLQUFLLENBQUMsS0FBbUI7SUFDakMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTNELE9BQU87UUFDTixLQUFLLEVBQUU7WUFDTixDQUFDLEVBQUUsUUFBUTtZQUNYLENBQUMsRUFBRSxRQUFRO1lBQ1gsQ0FBQyxFQUFFLFFBQVE7WUFDWCxLQUFLLEVBQUUsWUFBWTtTQUNuQjtRQUNELE1BQU0sRUFBRSxLQUFLO0tBQ2IsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQTJCO0lBQ2pELE1BQU07SUFDTixLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztJQUNMLElBQUk7SUFDSixJQUFJO0lBQ0osS0FBSztDQUNMLENBQUM7QUFFRix3Q0FBd0M7QUFFeEMsU0FBUyxzQkFBc0IsQ0FBQyxRQUFnQjtJQUMvQyxPQUFPLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3JDLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxXQUF3QjtJQUN4QyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFdkMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFzQixFQUFVLEVBQUUsQ0FDckQsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRWxCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FDeEQsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRTtRQUNuQixHQUFHLENBQUMsR0FBMEMsQ0FBQyxHQUFHLFVBQVUsQ0FDM0QsR0FBRyxDQUNNLENBQUM7UUFDWCxPQUFPLEdBQUcsQ0FBQztJQUNaLENBQUMsRUFDRCxFQUF5RCxDQUN6RCxDQUFDO0lBRUYsUUFBUSxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDNUIsS0FBSyxNQUFNO1lBQ1YsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQXFCLEVBQUUsQ0FBQztRQUN6RCxLQUFLLEtBQUs7WUFDVCxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBb0IsRUFBRSxDQUFDO1FBQ3ZELEtBQUssS0FBSztZQUNULE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxRQUFvQixFQUFFLENBQUM7UUFDdkQsS0FBSyxJQUFJO1lBQ1IsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQW1CLEVBQUUsQ0FBQztRQUNyRCxLQUFLLElBQUk7WUFDUixPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBbUIsRUFBRSxDQUFDO1FBQ3JEO1lBQ0MsSUFBSSxJQUFJLENBQUMsU0FBUztnQkFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1lBRTVELE1BQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUM7WUFFdkMsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFELE1BQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FDM0MsWUFBWSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQzdCLENBQUM7WUFDRixNQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxZQUFZLENBQzFDLFlBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUM1QixDQUFDO1lBQ0YsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRWxFLE9BQU87Z0JBQ04sS0FBSyxFQUFFO29CQUNOLEdBQUcsRUFBRSxVQUFVO29CQUNmLFVBQVUsRUFBRSxpQkFBaUI7b0JBQzdCLFNBQVMsRUFBRSxnQkFBZ0I7b0JBQzNCLEtBQUssRUFBRSxZQUFZO2lCQUNuQjtnQkFDRCxNQUFNLEVBQUUsS0FBSzthQUNiLENBQUM7SUFDSixDQUFDO0FBQ0YsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQ3pCLEtBQXNCLEVBQ3RCLFFBQVc7SUFFWCxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUVoQyxJQUFJLFFBQVEsS0FBSyxRQUFRLEVBQUUsQ0FBQztRQUMzQixPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBZSxDQUE4QixDQUFDO0lBQ3JFLENBQUM7SUFFRCxJQUFJLFFBQVEsS0FBSyxjQUFjLEVBQUUsQ0FBQztRQUNqQyxPQUFPLEtBQUssQ0FBQyxjQUFjLENBQzFCLEtBQWUsQ0FDYyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQ3JCLEtBQWUsRUFDZixRQUFRLENBQ3FCLENBQUM7QUFDaEMsQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsS0FBWTtJQUNyQyxJQUFJLENBQUM7UUFDSixRQUFRLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN0QixLQUFLLE1BQU07Z0JBQ1YsT0FBTyxRQUFRLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUM7WUFDeEgsS0FBSyxLQUFLO2dCQUNULE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEMsS0FBSyxLQUFLO2dCQUNULE9BQU8sT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDO1lBQzVHLEtBQUssS0FBSztnQkFDVCxPQUFPLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQztZQUN4RyxLQUFLLEtBQUs7Z0JBQ1QsT0FBTyxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUM7WUFDdkYsS0FBSyxLQUFLO2dCQUNULE9BQU8sT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDO1lBQ2hHLEtBQUssS0FBSztnQkFDVCxPQUFPLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQztZQUN2RjtnQkFDQyxJQUFJLElBQUksQ0FBQyxTQUFTO29CQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFFM0QsT0FBTyxXQUFXLENBQUM7UUFDckIsQ0FBQztJQUNGLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDdEQsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQXdCO0lBQzNDLHNCQUFzQjtJQUN0QixPQUFPO0lBQ1AsaUJBQWlCO0lBQ2pCLGdCQUFnQjtDQUNoQixDQUFDO0FBRUYsdUNBQXVDO0FBRXZDLFNBQVMsT0FBTyxDQUFDLEtBQWM7SUFDOUIsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUk7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUU5RCxNQUFNLEtBQUssR0FBRyxLQUFjLENBQUM7SUFDN0IsTUFBTSxZQUFZLEdBQXNCO1FBQ3ZDLE1BQU07UUFDTixLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLElBQUk7UUFDSixJQUFJO1FBQ0osS0FBSztLQUNMLENBQUM7SUFFRixPQUFPLENBQ04sT0FBTyxJQUFJLEtBQUs7UUFDaEIsUUFBUSxJQUFJLEtBQUs7UUFDakIsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQ25DLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsS0FBYztJQUNuQyxNQUFNLGdCQUFnQixHQUFpQjtRQUN0QyxNQUFNO1FBQ04sS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO0tBQ0wsQ0FBQztJQUVGLE9BQU8sQ0FDTixPQUFPLEtBQUssS0FBSyxRQUFRO1FBQ3pCLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxLQUFtQixDQUFDLENBQzlDLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsS0FBYztJQUNwQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLEtBQUssSUFBSTtRQUFFLE9BQU8sS0FBSyxDQUFDO0lBRTlELE1BQU0sV0FBVyxHQUFHLEtBQW9CLENBQUM7SUFDekMsTUFBTSxrQkFBa0IsR0FBNEI7UUFDbkQsTUFBTTtRQUNOLEtBQUs7UUFDTCxLQUFLO1FBQ0wsSUFBSTtRQUNKLElBQUk7S0FDSixDQUFDO0lBRUYsT0FBTyxDQUNOLE9BQU8sSUFBSSxXQUFXO1FBQ3RCLFFBQVEsSUFBSSxXQUFXO1FBQ3ZCLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQy9DLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxTQUFTLENBQ2pCLEtBQXNCLEVBQ3RCLFFBQVc7SUFFWCxJQUFJLFFBQVEsS0FBSyxRQUFRLEVBQUUsQ0FBQztRQUMzQixPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBZSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELElBQUksUUFBUSxLQUFLLGNBQWMsRUFBRSxDQUFDO1FBQ2pDLE9BQU8sUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFlLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2pFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBcUIsQ0FBQztRQUV2RCxPQUFPLEtBQUssSUFBSSxHQUFHLElBQUksS0FBSyxJQUFJLEdBQUcsQ0FBQztJQUNyQyxDQUFDO0lBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUF1QjtJQUN6QyxPQUFPO0lBQ1AsWUFBWTtJQUNaLGFBQWE7SUFDYixTQUFTO0NBQ1QsQ0FBQztBQUVGLHlDQUF5QztBQUV6QyxTQUFTLEdBQUcsQ0FBQyxLQUFhLEVBQUUsTUFBdUI7SUFDbEQsSUFBSSxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDcEIsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQztTQUFNLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQzNCLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztTQUFNLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQzNCLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQzs7UUFBTSxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDdEQsQ0FBQztBQUVELFNBQVMsVUFBVSxDQUFDLEtBQWE7SUFDaEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFcEUsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBQyxLQUFhO0lBQzVCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUV0RSxPQUFPLEtBQUss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LmpzXG5cbmltcG9ydCB7XG5cdEFscGhhUmFuZ2UsXG5cdEJ5dGVSYW5nZSxcblx0Q01ZSyxcblx0Q01ZS1VuYnJhbmRlZCxcblx0Q01ZS1ZhbHVlLFxuXHRDb2xvcixcblx0Q29sb3JTcGFjZSxcblx0Q29sb3JTdHJpbmcsXG5cdENvbW1vbkNvcmVGbkJhc2UsXG5cdENvbW1vbkNvcmVGbkJyYW5kLFxuXHRDb21tb25Db3JlRm5CcmFuZENvbG9yLFxuXHRDb21tb25Db3JlRm5Db252ZXJ0LFxuXHRDb21tb25Db3JlRm5HdWFyZHMsXG5cdENvbW1vbkNvcmVGblZhbGlkYXRlLFxuXHRIZXgsXG5cdEhleENvbXBvbmVudCxcblx0SGV4U2V0LFxuXHRIZXhVbmJyYW5kZWQsXG5cdEhTTCxcblx0SFNMVW5icmFuZGVkLFxuXHRIU0xWYWx1ZSxcblx0SFNWLFxuXHRIU1ZVbmJyYW5kZWQsXG5cdEhTVlZhbHVlLFxuXHRMQUIsXG5cdExBQlVuYnJhbmRlZCxcblx0TEFCX0wsXG5cdExBQl9BLFxuXHRMQUJfQixcblx0TnVtZXJpY1JhbmdlS2V5LFxuXHRQZXJjZW50aWxlLFxuXHRSYWRpYWwsXG5cdFJhbmdlS2V5TWFwLFxuXHRSR0IsXG5cdFJHQlVuYnJhbmRlZCxcblx0U0wsXG5cdFNMVW5icmFuZGVkLFxuXHRTTFZhbHVlLFxuXHRTVixcblx0U1ZVbmJyYW5kZWQsXG5cdFNWVmFsdWUsXG5cdFhZWixcblx0WFlaVW5icmFuZGVkLFxuXHRYWVpfWCxcblx0WFlaX1ksXG5cdFhZWl9aXG59IGZyb20gJy4uLy4uL2luZGV4L2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi8uLi9kYXRhL2luZGV4LmpzJztcblxuY29uc3QgZGVmYXVsdENvbG9ycyA9IGRhdGEuZGVmYXVsdHMuY29sb3JzO1xuY29uc3QgbW9kZSA9IGRhdGEubW9kZTtcbmNvbnN0IF9zZXRzID0gZGF0YS5zZXRzO1xuXG5mdW5jdGlvbiBjbGFtcFRvUmFuZ2UodmFsdWU6IG51bWJlciwgcmFuZ2VLZXk6IE51bWVyaWNSYW5nZUtleSk6IG51bWJlciB7XG5cdGNvbnN0IFttaW4sIG1heF0gPSBfc2V0c1tyYW5nZUtleV07XG5cblx0cmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCBtaW4pLCBtYXgpO1xufVxuXG5mdW5jdGlvbiBjbG9uZTxUPih2YWx1ZTogVCk6IFQge1xuXHRyZXR1cm4gc3RydWN0dXJlZENsb25lKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gZGVib3VuY2U8VCBleHRlbmRzICguLi5hcmdzOiBQYXJhbWV0ZXJzPFQ+KSA9PiB2b2lkPihcblx0ZnVuYzogVCxcblx0ZGVsYXk6IG51bWJlclxuKSB7XG5cdGxldCB0aW1lb3V0OiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuXG5cdHJldHVybiAoLi4uYXJnczogUGFyYW1ldGVyczxUPik6IHZvaWQgPT4ge1xuXHRcdGlmICh0aW1lb3V0KSBjbGVhclRpbWVvdXQodGltZW91dCk7XG5cblx0XHR0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRmdW5jKC4uLmFyZ3MpO1xuXHRcdH0sIGRlbGF5KTtcblx0fTtcbn1cblxuZnVuY3Rpb24gcGFyc2VDdXN0b21Db2xvcihyYXdWYWx1ZTogc3RyaW5nKTogSFNMIHwgbnVsbCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFtb2RlLnF1aWV0KVxuXHRcdFx0Y29uc29sZS5sb2coYFBhcnNpbmcgY3VzdG9tIGNvbG9yOiAke0pTT04uc3RyaW5naWZ5KHJhd1ZhbHVlKX1gKTtcblxuXHRcdGNvbnN0IG1hdGNoID0gcmF3VmFsdWUubWF0Y2goXG5cdFx0XHQvaHNsXFwoKFxcZCspLFxccyooXFxkKyklPyxcXHMqKFxcZCspJT8sXFxzKihcXGQqXFwuP1xcZCspXFwpL1xuXHRcdCk7XG5cblx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdGNvbnN0IFssIGh1ZSwgc2F0dXJhdGlvbiwgbGlnaHRuZXNzLCBhbHBoYV0gPSBtYXRjaDtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKHBhcnNlSW50KGh1ZSkpLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUludChzYXR1cmF0aW9uKSksXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VJbnQobGlnaHRuZXNzKSksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShwYXJzZUZsb2F0KGFscGhhKSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHRcdCdJbnZhbGlkIEhTTCBjdXN0b20gY29sb3IuIEV4cGVjdGVkIGZvcm1hdDogaHNsKEgsIFMlLCBMJSwgQSknXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoYHBhcnNlQ3VzdG9tQ29sb3IgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgYmFzZTogQ29tbW9uQ29yZUZuQmFzZSA9IHtcblx0Y2xhbXBUb1JhbmdlLFxuXHRjbG9uZSxcblx0ZGVib3VuY2UsXG5cdHBhcnNlQ3VzdG9tQ29sb3Jcbn0gYXMgY29uc3Q7XG5cbi8vICoqKioqKioqIFNFQ1RJT04gMiAqKioqKioqKlxuXG5mdW5jdGlvbiBhc0FscGhhUmFuZ2UodmFsdWU6IG51bWJlcik6IEFscGhhUmFuZ2Uge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ0FscGhhUmFuZ2UnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgQWxwaGFSYW5nZTtcbn1cblxuZnVuY3Rpb24gYXNCcmFuZGVkPFQgZXh0ZW5kcyBrZXlvZiBSYW5nZUtleU1hcD4oXG5cdHZhbHVlOiBudW1iZXIsXG5cdHJhbmdlS2V5OiBUXG4pOiBSYW5nZUtleU1hcFtUXSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCByYW5nZUtleSk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIFJhbmdlS2V5TWFwW1RdO1xufVxuXG5mdW5jdGlvbiBhc0J5dGVSYW5nZSh2YWx1ZTogbnVtYmVyKTogQnl0ZVJhbmdlIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdCeXRlUmFuZ2UnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgQnl0ZVJhbmdlO1xufVxuXG5mdW5jdGlvbiBhc0hleENvbXBvbmVudCh2YWx1ZTogc3RyaW5nKTogSGV4Q29tcG9uZW50IHtcblx0aWYgKCF2YWxpZGF0ZS5oZXhDb21wb25lbnQodmFsdWUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIEhleENvbXBvbmVudCB2YWx1ZTogJHt2YWx1ZX1gKTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZSBhcyB1bmtub3duIGFzIEhleENvbXBvbmVudDtcbn1cblxuZnVuY3Rpb24gYXNIZXhTZXQodmFsdWU6IHN0cmluZyk6IEhleFNldCB7XG5cdGlmICgvXiNbMC05YS1mQS1GXXs4fSQvLnRlc3QodmFsdWUpKSB7XG5cdFx0dmFsdWUgPSB2YWx1ZS5zbGljZSgwLCA3KTtcblx0fVxuXHRpZiAoIXZhbGlkYXRlLmhleFNldCh2YWx1ZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgSGV4U2V0IHZhbHVlOiAke3ZhbHVlfWApO1xuXHR9XG5cdHJldHVybiB2YWx1ZSBhcyBIZXhTZXQ7XG59XG5cbmZ1bmN0aW9uIGFzTEFCX0wodmFsdWU6IG51bWJlcik6IExBQl9MIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdMQUJfTCcpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBMQUJfTDtcbn1cblxuZnVuY3Rpb24gYXNMQUJfQSh2YWx1ZTogbnVtYmVyKTogTEFCX0Ege1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ0xBQl9BJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIExBQl9BO1xufVxuXG5mdW5jdGlvbiBhc0xBQl9CKHZhbHVlOiBudW1iZXIpOiBMQUJfQiB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnTEFCX0InKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgTEFCX0I7XG59XG5cbmZ1bmN0aW9uIGFzUGVyY2VudGlsZSh2YWx1ZTogbnVtYmVyKTogUGVyY2VudGlsZSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnUGVyY2VudGlsZScpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBQZXJjZW50aWxlO1xufVxuXG5mdW5jdGlvbiBhc1JhZGlhbCh2YWx1ZTogbnVtYmVyKTogUmFkaWFsIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdSYWRpYWwnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgUmFkaWFsO1xufVxuXG5mdW5jdGlvbiBhc1hZWl9YKHZhbHVlOiBudW1iZXIpOiBYWVpfWCB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnWFlaX1gnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgWFlaX1g7XG59XG5cbmZ1bmN0aW9uIGFzWFlaX1kodmFsdWU6IG51bWJlcik6IFhZWl9ZIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdYWVpfWScpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBYWVpfWTtcbn1cblxuZnVuY3Rpb24gYXNYWVpfWih2YWx1ZTogbnVtYmVyKTogWFlaX1oge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ1hZWl9aJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIFhZWl9aO1xufVxuXG5leHBvcnQgY29uc3QgYnJhbmQ6IENvbW1vbkNvcmVGbkJyYW5kID0ge1xuXHRhc0FscGhhUmFuZ2UsXG5cdGFzQnJhbmRlZCxcblx0YXNCeXRlUmFuZ2UsXG5cdGFzSGV4Q29tcG9uZW50LFxuXHRhc0hleFNldCxcblx0YXNMQUJfTCxcblx0YXNMQUJfQSxcblx0YXNMQUJfQixcblx0YXNQZXJjZW50aWxlLFxuXHRhc1JhZGlhbCxcblx0YXNYWVpfWCxcblx0YXNYWVpfWSxcblx0YXNYWVpfWlxufTtcblxuLy8gKioqKioqKiogU0VDVElPTiAyIC0gQnJhbmQgQ29sb3IgKioqKioqKipcblxuZnVuY3Rpb24gYXNDTVlLKGNvbG9yOiBDTVlLVW5icmFuZGVkKTogQ01ZSyB7XG5cdGNvbnN0IGJyYW5kZWRDeWFuID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLmN5YW4pO1xuXHRjb25zdCBicmFuZGVkTWFnZW50YSA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5tYWdlbnRhKTtcblx0Y29uc3QgYnJhbmRlZFllbGxvdyA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS55ZWxsb3cpO1xuXHRjb25zdCBicmFuZGVkS2V5ID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLmtleSk7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0Y3lhbjogYnJhbmRlZEN5YW4sXG5cdFx0XHRtYWdlbnRhOiBicmFuZGVkTWFnZW50YSxcblx0XHRcdHllbGxvdzogYnJhbmRlZFllbGxvdyxcblx0XHRcdGtleTogYnJhbmRlZEtleSxcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ2NteWsnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzSGV4KGNvbG9yOiBIZXhVbmJyYW5kZWQpOiBIZXgge1xuXHRsZXQgaGV4ID0gY29sb3IudmFsdWUuaGV4O1xuXG5cdGlmICghaGV4LnN0YXJ0c1dpdGgoJyMnKSkgaGV4ID0gYCMke2hleH1gO1xuXG5cdGlmICghL14jWzAtOUEtRmEtZl17OH0kLy50ZXN0KGhleCkpXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIEhleCBjb2xvciBmb3JtYXQ6ICR7aGV4fWApO1xuXG5cdGNvbnN0IGhleE1haW4gPSBoZXguc2xpY2UoMCwgNyk7XG5cdGNvbnN0IGFscGhhID0gaGV4LnNsaWNlKDcsIDkpO1xuXG5cdGNvbnN0IGJyYW5kZWRIZXggPSBicmFuZC5hc0hleFNldChoZXhNYWluKTtcblx0Y29uc3QgYnJhbmRlZEhleEFscGhhID0gYnJhbmQuYXNIZXhDb21wb25lbnQoYWxwaGEpO1xuXHRjb25zdCBicmFuZGVkTnVtQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUubnVtQWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdGhleDogYnJhbmRlZEhleCxcblx0XHRcdGFscGhhOiBicmFuZGVkSGV4QWxwaGEsXG5cdFx0XHRudW1BbHBoYTogYnJhbmRlZE51bUFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdoZXgnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzSFNMKGNvbG9yOiBIU0xVbmJyYW5kZWQpOiBIU0wge1xuXHRjb25zdCBicmFuZGVkSHVlID0gYnJhbmQuYXNSYWRpYWwoY29sb3IudmFsdWUuaHVlKTtcblx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUuc2F0dXJhdGlvbik7XG5cdGNvbnN0IGJyYW5kZWRMaWdodG5lc3MgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUubGlnaHRuZXNzKTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRodWU6IGJyYW5kZWRIdWUsXG5cdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdGxpZ2h0bmVzczogYnJhbmRlZExpZ2h0bmVzcyxcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ2hzbCdcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNIU1YoY29sb3I6IEhTVlVuYnJhbmRlZCk6IEhTViB7XG5cdGNvbnN0IGJyYW5kZWRIdWUgPSBicmFuZC5hc1JhZGlhbChjb2xvci52YWx1ZS5odWUpO1xuXHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5zYXR1cmF0aW9uKTtcblx0Y29uc3QgYnJhbmRlZFZhbHVlID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnZhbHVlKTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRodWU6IGJyYW5kZWRIdWUsXG5cdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdHZhbHVlOiBicmFuZGVkVmFsdWUsXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdoc3YnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzTEFCKGNvbG9yOiBMQUJVbmJyYW5kZWQpOiBMQUIge1xuXHRjb25zdCBicmFuZGVkTCA9IGJyYW5kLmFzTEFCX0woY29sb3IudmFsdWUubCk7XG5cdGNvbnN0IGJyYW5kZWRBID0gYnJhbmQuYXNMQUJfQShjb2xvci52YWx1ZS5hKTtcblx0Y29uc3QgYnJhbmRlZEIgPSBicmFuZC5hc0xBQl9CKGNvbG9yLnZhbHVlLmIpO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdGw6IGJyYW5kZWRMLFxuXHRcdFx0YTogYnJhbmRlZEEsXG5cdFx0XHRiOiBicmFuZGVkQixcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ2xhYidcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNSR0IoY29sb3I6IFJHQlVuYnJhbmRlZCk6IFJHQiB7XG5cdGNvbnN0IGJyYW5kZWRSZWQgPSBicmFuZC5hc0J5dGVSYW5nZShjb2xvci52YWx1ZS5yZWQpO1xuXHRjb25zdCBicmFuZGVkR3JlZW4gPSBicmFuZC5hc0J5dGVSYW5nZShjb2xvci52YWx1ZS5ncmVlbik7XG5cdGNvbnN0IGJyYW5kZWRCbHVlID0gYnJhbmQuYXNCeXRlUmFuZ2UoY29sb3IudmFsdWUuYmx1ZSk7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0cmVkOiBicmFuZGVkUmVkLFxuXHRcdFx0Z3JlZW46IGJyYW5kZWRHcmVlbixcblx0XHRcdGJsdWU6IGJyYW5kZWRCbHVlLFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAncmdiJ1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc1NMKGNvbG9yOiBTTFVuYnJhbmRlZCk6IFNMIHtcblx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUuc2F0dXJhdGlvbik7XG5cdGNvbnN0IGJyYW5kZWRMaWdodG5lc3MgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUubGlnaHRuZXNzKTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdGxpZ2h0bmVzczogYnJhbmRlZExpZ2h0bmVzcyxcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ3NsJ1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc1NWKGNvbG9yOiBTVlVuYnJhbmRlZCk6IFNWIHtcblx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUuc2F0dXJhdGlvbik7XG5cdGNvbnN0IGJyYW5kZWRWYWx1ZSA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS52YWx1ZSk7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0c2F0dXJhdGlvbjogYnJhbmRlZFNhdHVyYXRpb24sXG5cdFx0XHR2YWx1ZTogYnJhbmRlZFZhbHVlLFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnc3YnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzWFlaKGNvbG9yOiBYWVpVbmJyYW5kZWQpOiBYWVoge1xuXHRjb25zdCBicmFuZGVkWCA9IGJyYW5kLmFzWFlaX1goY29sb3IudmFsdWUueCk7XG5cdGNvbnN0IGJyYW5kZWRZID0gYnJhbmQuYXNYWVpfWShjb2xvci52YWx1ZS55KTtcblx0Y29uc3QgYnJhbmRlZFogPSBicmFuZC5hc1hZWl9aKGNvbG9yLnZhbHVlLnopO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdHg6IGJyYW5kZWRYLFxuXHRcdFx0eTogYnJhbmRlZFksXG5cdFx0XHR6OiBicmFuZGVkWixcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ3h5eidcblx0fTtcbn1cblxuZXhwb3J0IGNvbnN0IGJyYW5kQ29sb3I6IENvbW1vbkNvcmVGbkJyYW5kQ29sb3IgPSB7XG5cdGFzQ01ZSyxcblx0YXNIZXgsXG5cdGFzSFNMLFxuXHRhc0hTVixcblx0YXNMQUIsXG5cdGFzUkdCLFxuXHRhc1NMLFxuXHRhc1NWLFxuXHRhc1hZWlxufTtcblxuLy8gKioqKioqKiogU0VDVElPTiAzIC0gQ29udmVydCAqKioqKioqKlxuXG5mdW5jdGlvbiBoZXhBbHBoYVRvTnVtZXJpY0FscGhhKGhleEFscGhhOiBzdHJpbmcpOiBudW1iZXIge1xuXHRyZXR1cm4gcGFyc2VJbnQoaGV4QWxwaGEsIDE2KSAvIDI1NTtcbn1cblxuZnVuY3Rpb24gdG9Db2xvcihjb2xvclN0cmluZzogQ29sb3JTdHJpbmcpOiBDb2xvciB7XG5cdGNvbnN0IGNsb25lZENvbG9yID0gY2xvbmUoY29sb3JTdHJpbmcpO1xuXG5cdGNvbnN0IHBhcnNlVmFsdWUgPSAodmFsdWU6IHN0cmluZyB8IG51bWJlcik6IG51bWJlciA9PlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuZW5kc1dpdGgoJyUnKVxuXHRcdFx0PyBwYXJzZUZsb2F0KHZhbHVlLnNsaWNlKDAsIC0xKSlcblx0XHRcdDogTnVtYmVyKHZhbHVlKTtcblxuXHRjb25zdCBuZXdWYWx1ZSA9IE9iamVjdC5lbnRyaWVzKGNsb25lZENvbG9yLnZhbHVlKS5yZWR1Y2UoXG5cdFx0KGFjYywgW2tleSwgdmFsXSkgPT4ge1xuXHRcdFx0YWNjW2tleSBhcyBrZXlvZiAodHlwZW9mIGNsb25lZENvbG9yKVsndmFsdWUnXV0gPSBwYXJzZVZhbHVlKFxuXHRcdFx0XHR2YWxcblx0XHRcdCkgYXMgbmV2ZXI7XG5cdFx0XHRyZXR1cm4gYWNjO1xuXHRcdH0sXG5cdFx0e30gYXMgUmVjb3JkPGtleW9mICh0eXBlb2YgY2xvbmVkQ29sb3IpWyd2YWx1ZSddLCBudW1iZXI+XG5cdCk7XG5cblx0c3dpdGNoIChjbG9uZWRDb2xvci5mb3JtYXQpIHtcblx0XHRjYXNlICdjbXlrJzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ2NteWsnLCB2YWx1ZTogbmV3VmFsdWUgYXMgQ01ZS1ZhbHVlIH07XG5cdFx0Y2FzZSAnaHNsJzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ2hzbCcsIHZhbHVlOiBuZXdWYWx1ZSBhcyBIU0xWYWx1ZSB9O1xuXHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdoc3YnLCB2YWx1ZTogbmV3VmFsdWUgYXMgSFNWVmFsdWUgfTtcblx0XHRjYXNlICdzbCc6XG5cdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdzbCcsIHZhbHVlOiBuZXdWYWx1ZSBhcyBTTFZhbHVlIH07XG5cdFx0Y2FzZSAnc3YnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnc3YnLCB2YWx1ZTogbmV3VmFsdWUgYXMgU1ZWYWx1ZSB9O1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ1Vuc3VwcG9ydGVkIGZvcm1hdCBmb3IgY29sb3JTdHJpbmdUb0NvbG9yJyk7XG5cblx0XHRcdGNvbnN0IHVuYnJhbmRlZEhTTCA9IGRlZmF1bHRDb2xvcnMuaHNsO1xuXG5cdFx0XHRjb25zdCBicmFuZGVkSHVlID0gYnJhbmQuYXNSYWRpYWwodW5icmFuZGVkSFNMLnZhbHVlLmh1ZSk7XG5cdFx0XHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0dW5icmFuZGVkSFNMLnZhbHVlLnNhdHVyYXRpb25cblx0XHRcdCk7XG5cdFx0XHRjb25zdCBicmFuZGVkTGlnaHRuZXNzID0gYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHR1bmJyYW5kZWRIU0wudmFsdWUubGlnaHRuZXNzXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKHVuYnJhbmRlZEhTTC52YWx1ZS5hbHBoYSk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiBicmFuZGVkSHVlLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kZWRTYXR1cmF0aW9uLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmRlZExpZ2h0bmVzcyxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdH07XG5cdH1cbn1cblxuZnVuY3Rpb24gdG9Db2xvclZhbHVlUmFuZ2U8VCBleHRlbmRzIGtleW9mIFJhbmdlS2V5TWFwPihcblx0dmFsdWU6IHN0cmluZyB8IG51bWJlcixcblx0cmFuZ2VLZXk6IFRcbik6IFJhbmdlS2V5TWFwW1RdIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsIHJhbmdlS2V5KTtcblxuXHRpZiAocmFuZ2VLZXkgPT09ICdIZXhTZXQnKSB7XG5cdFx0cmV0dXJuIGJyYW5kLmFzSGV4U2V0KHZhbHVlIGFzIHN0cmluZykgYXMgdW5rbm93biBhcyBSYW5nZUtleU1hcFtUXTtcblx0fVxuXG5cdGlmIChyYW5nZUtleSA9PT0gJ0hleENvbXBvbmVudCcpIHtcblx0XHRyZXR1cm4gYnJhbmQuYXNIZXhDb21wb25lbnQoXG5cdFx0XHR2YWx1ZSBhcyBzdHJpbmdcblx0XHQpIGFzIHVua25vd24gYXMgUmFuZ2VLZXlNYXBbVF07XG5cdH1cblxuXHRyZXR1cm4gYnJhbmQuYXNCcmFuZGVkKFxuXHRcdHZhbHVlIGFzIG51bWJlcixcblx0XHRyYW5nZUtleVxuXHQpIGFzIHVua25vd24gYXMgUmFuZ2VLZXlNYXBbVF07XG59XG5cbmZ1bmN0aW9uIHRvQ1NTQ29sb3JTdHJpbmcoY29sb3I6IENvbG9yKTogc3RyaW5nIHtcblx0dHJ5IHtcblx0XHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdHJldHVybiBgY215aygke2NvbG9yLnZhbHVlLmN5YW59LCR7Y29sb3IudmFsdWUubWFnZW50YX0sJHtjb2xvci52YWx1ZS55ZWxsb3d9LCR7Y29sb3IudmFsdWUua2V5fSR7Y29sb3IudmFsdWUuYWxwaGF9KWA7XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRyZXR1cm4gU3RyaW5nKGNvbG9yLnZhbHVlLmhleCk7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gYGhzbCgke2NvbG9yLnZhbHVlLmh1ZX0sJHtjb2xvci52YWx1ZS5zYXR1cmF0aW9ufSUsJHtjb2xvci52YWx1ZS5saWdodG5lc3N9JSwke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGBoc3YoJHtjb2xvci52YWx1ZS5odWV9LCR7Y29sb3IudmFsdWUuc2F0dXJhdGlvbn0lLCR7Y29sb3IudmFsdWUudmFsdWV9JSwke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0cmV0dXJuIGBsYWIoJHtjb2xvci52YWx1ZS5sfSwke2NvbG9yLnZhbHVlLmF9LCR7Y29sb3IudmFsdWUuYn0sJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdHJldHVybiBgcmdiKCR7Y29sb3IudmFsdWUucmVkfSwke2NvbG9yLnZhbHVlLmdyZWVufSwke2NvbG9yLnZhbHVlLmJsdWV9LCR7Y29sb3IudmFsdWUuYWxwaGF9KWA7XG5cdFx0XHRjYXNlICd4eXonOlxuXHRcdFx0XHRyZXR1cm4gYHh5eigke2NvbG9yLnZhbHVlLnh9LCR7Y29sb3IudmFsdWUueX0sJHtjb2xvci52YWx1ZS56fSwke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYFVuZXhwZWN0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yLmZvcm1hdH1gKTtcblxuXHRcdFx0XHRyZXR1cm4gJyNGRkZGRkZGRic7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgZ2V0Q1NTQ29sb3JTdHJpbmcgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGNvbnZlcnQ6IENvbW1vbkNvcmVGbkNvbnZlcnQgPSB7XG5cdGhleEFscGhhVG9OdW1lcmljQWxwaGEsXG5cdHRvQ29sb3IsXG5cdHRvQ29sb3JWYWx1ZVJhbmdlLFxuXHR0b0NTU0NvbG9yU3RyaW5nXG59O1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDQgLSBHdWFyZHMgKioqKioqKipcblxuZnVuY3Rpb24gaXNDb2xvcih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENvbG9yIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuXHRjb25zdCBjb2xvciA9IHZhbHVlIGFzIENvbG9yO1xuXHRjb25zdCB2YWxpZEZvcm1hdHM6IENvbG9yWydmb3JtYXQnXVtdID0gW1xuXHRcdCdjbXlrJyxcblx0XHQnaGV4Jyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnbGFiJyxcblx0XHQncmdiJyxcblx0XHQnc2wnLFxuXHRcdCdzdicsXG5cdFx0J3h5eidcblx0XTtcblxuXHRyZXR1cm4gKFxuXHRcdCd2YWx1ZScgaW4gY29sb3IgJiZcblx0XHQnZm9ybWF0JyBpbiBjb2xvciAmJlxuXHRcdHZhbGlkRm9ybWF0cy5pbmNsdWRlcyhjb2xvci5mb3JtYXQpXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzQ29sb3JTcGFjZSh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENvbG9yU3BhY2Uge1xuXHRjb25zdCB2YWxpZENvbG9yU3BhY2VzOiBDb2xvclNwYWNlW10gPSBbXG5cdFx0J2NteWsnLFxuXHRcdCdoZXgnLFxuXHRcdCdoc2wnLFxuXHRcdCdoc3YnLFxuXHRcdCdsYWInLFxuXHRcdCdyZ2InLFxuXHRcdCd4eXonXG5cdF07XG5cblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmXG5cdFx0dmFsaWRDb2xvclNwYWNlcy5pbmNsdWRlcyh2YWx1ZSBhcyBDb2xvclNwYWNlKVxuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0NvbG9yU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ29sb3JTdHJpbmcge1xuXHRpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fCB2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG5cdGNvbnN0IGNvbG9yU3RyaW5nID0gdmFsdWUgYXMgQ29sb3JTdHJpbmc7XG5cdGNvbnN0IHZhbGlkU3RyaW5nRm9ybWF0czogQ29sb3JTdHJpbmdbJ2Zvcm1hdCddW10gPSBbXG5cdFx0J2NteWsnLFxuXHRcdCdoc2wnLFxuXHRcdCdoc3YnLFxuXHRcdCdzbCcsXG5cdFx0J3N2J1xuXHRdO1xuXG5cdHJldHVybiAoXG5cdFx0J3ZhbHVlJyBpbiBjb2xvclN0cmluZyAmJlxuXHRcdCdmb3JtYXQnIGluIGNvbG9yU3RyaW5nICYmXG5cdFx0dmFsaWRTdHJpbmdGb3JtYXRzLmluY2x1ZGVzKGNvbG9yU3RyaW5nLmZvcm1hdClcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNJblJhbmdlPFQgZXh0ZW5kcyBrZXlvZiB0eXBlb2YgX3NldHM+KFxuXHR2YWx1ZTogbnVtYmVyIHwgc3RyaW5nLFxuXHRyYW5nZUtleTogVFxuKTogYm9vbGVhbiB7XG5cdGlmIChyYW5nZUtleSA9PT0gJ0hleFNldCcpIHtcblx0XHRyZXR1cm4gdmFsaWRhdGUuaGV4U2V0KHZhbHVlIGFzIHN0cmluZyk7XG5cdH1cblxuXHRpZiAocmFuZ2VLZXkgPT09ICdIZXhDb21wb25lbnQnKSB7XG5cdFx0cmV0dXJuIHZhbGlkYXRlLmhleENvbXBvbmVudCh2YWx1ZSBhcyBzdHJpbmcpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgQXJyYXkuaXNBcnJheShfc2V0c1tyYW5nZUtleV0pKSB7XG5cdFx0Y29uc3QgW21pbiwgbWF4XSA9IF9zZXRzW3JhbmdlS2V5XSBhcyBbbnVtYmVyLCBudW1iZXJdO1xuXG5cdFx0cmV0dXJuIHZhbHVlID49IG1pbiAmJiB2YWx1ZSA8PSBtYXg7XG5cdH1cblxuXHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcmFuZ2Ugb3IgdmFsdWUgZm9yICR7cmFuZ2VLZXl9YCk7XG59XG5cbmV4cG9ydCBjb25zdCBndWFyZHM6IENvbW1vbkNvcmVGbkd1YXJkcyA9IHtcblx0aXNDb2xvcixcblx0aXNDb2xvclNwYWNlLFxuXHRpc0NvbG9yU3RyaW5nLFxuXHRpc0luUmFuZ2Vcbn07XG5cbi8vICoqKioqKioqIFNFQ1RJT04gNSAtIFNhbml0aXplICoqKioqKioqXG5cbmZ1bmN0aW9uIGxhYih2YWx1ZTogbnVtYmVyLCBvdXRwdXQ6ICdsJyB8ICdhJyB8ICdiJyk6IExBQl9MIHwgTEFCX0EgfCBMQUJfQiB7XG5cdGlmIChvdXRwdXQgPT09ICdsJykge1xuXHRcdHJldHVybiBicmFuZC5hc0xBQl9MKE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIDApLCAxMDApKSk7XG5cdH0gZWxzZSBpZiAob3V0cHV0ID09PSAnYScpIHtcblx0XHRyZXR1cm4gYnJhbmQuYXNMQUJfQShNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAtMTI1KSwgMTI1KSkpO1xuXHR9IGVsc2UgaWYgKG91dHB1dCA9PT0gJ2InKSB7XG5cdFx0cmV0dXJuIGJyYW5kLmFzTEFCX0IoTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgLTEyNSksIDEyNSkpKTtcblx0fSBlbHNlIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHJldHVybiBMQUIgdmFsdWUnKTtcbn1cblxuZnVuY3Rpb24gcGVyY2VudGlsZSh2YWx1ZTogbnVtYmVyKTogUGVyY2VudGlsZSB7XG5cdGNvbnN0IHJhd1BlcmNlbnRpbGUgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAwKSwgMTAwKSk7XG5cblx0cmV0dXJuIGJyYW5kLmFzUGVyY2VudGlsZShyYXdQZXJjZW50aWxlKTtcbn1cblxuZnVuY3Rpb24gcmFkaWFsKHZhbHVlOiBudW1iZXIpOiBSYWRpYWwge1xuXHRjb25zdCByYXdSYWRpYWwgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAwKSwgMzYwKSkgJiAzNjA7XG5cblx0cmV0dXJuIGJyYW5kLmFzUmFkaWFsKHJhd1JhZGlhbCk7XG59XG5cbmZ1bmN0aW9uIHJnYih2YWx1ZTogbnVtYmVyKTogQnl0ZVJhbmdlIHtcblx0Y29uc3QgcmF3Qnl0ZVJhbmdlID0gTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgMCksIDI1NSkpO1xuXG5cdHJldHVybiB0b0NvbG9yVmFsdWVSYW5nZShyYXdCeXRlUmFuZ2UsICdCeXRlUmFuZ2UnKTtcbn1cblxuZXhwb3J0IGNvbnN0IHNhbml0aXplID0ge1xuXHRsYWIsXG5cdHBlcmNlbnRpbGUsXG5cdHJhZGlhbCxcblx0cmdiXG59O1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDYgLSBWYWxpZGF0ZSAqKioqKioqKlxuXG5mdW5jdGlvbiBjb2xvclZhbHVlcyhjb2xvcjogQ29sb3IgfCBTTCB8IFNWKTogYm9vbGVhbiB7XG5cdGNvbnN0IGNsb25lZENvbG9yID0gY2xvbmUoY29sb3IpO1xuXHRjb25zdCBpc051bWVyaWNWYWxpZCA9ICh2YWx1ZTogdW5rbm93bik6IGJvb2xlYW4gPT5cblx0XHR0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSk7XG5cdGNvbnN0IG5vcm1hbGl6ZVBlcmNlbnRhZ2UgPSAodmFsdWU6IHN0cmluZyB8IG51bWJlcik6IG51bWJlciA9PiB7XG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuZW5kc1dpdGgoJyUnKSkge1xuXHRcdFx0cmV0dXJuIHBhcnNlRmxvYXQodmFsdWUuc2xpY2UoMCwgLTEpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IHZhbHVlIDogTmFOO1xuXHR9O1xuXG5cdHN3aXRjaCAoY2xvbmVkQ29sb3IuZm9ybWF0KSB7XG5cdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuY3lhbixcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5tYWdlbnRhLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnllbGxvdyxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5rZXlcblx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuY3lhbiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmN5YW4gPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLm1hZ2VudGEgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5tYWdlbnRhIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55ZWxsb3cgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55ZWxsb3cgPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmtleSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmtleSA8PSAxMDBcblx0XHRcdCk7XG5cdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdHJldHVybiAvXiNbMC05QS1GYS1mXXs2fSQvLnRlc3QoY2xvbmVkQ29sb3IudmFsdWUuaGV4KTtcblx0XHRjYXNlICdoc2wnOlxuXHRcdFx0Y29uc3QgaXNWYWxpZEhTTEh1ZSA9XG5cdFx0XHRcdGlzTnVtZXJpY1ZhbGlkKGNsb25lZENvbG9yLnZhbHVlLmh1ZSkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlIDw9IDM2MDtcblx0XHRcdGNvbnN0IGlzVmFsaWRIU0xTYXR1cmF0aW9uID1cblx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uKSA+PSAwICYmXG5cdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbikgPD0gMTAwO1xuXHRcdFx0Y29uc3QgaXNWYWxpZEhTTExpZ2h0bmVzcyA9IGNsb25lZENvbG9yLnZhbHVlLmxpZ2h0bmVzc1xuXHRcdFx0XHQ/IG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzKSA+PSAwICYmXG5cdFx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MpIDw9IDEwMFxuXHRcdFx0XHQ6IHRydWU7XG5cblx0XHRcdHJldHVybiBpc1ZhbGlkSFNMSHVlICYmIGlzVmFsaWRIU0xTYXR1cmF0aW9uICYmIGlzVmFsaWRIU0xMaWdodG5lc3M7XG5cdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdGNvbnN0IGlzVmFsaWRIU1ZIdWUgPVxuXHRcdFx0XHRpc051bWVyaWNWYWxpZChjbG9uZWRDb2xvci52YWx1ZS5odWUpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmh1ZSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmh1ZSA8PSAzNjA7XG5cdFx0XHRjb25zdCBpc1ZhbGlkSFNWU2F0dXJhdGlvbiA9XG5cdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbikgPj0gMCAmJlxuXHRcdFx0XHRub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24pIDw9IDEwMDtcblx0XHRcdGNvbnN0IGlzVmFsaWRIU1ZWYWx1ZSA9IGNsb25lZENvbG9yLnZhbHVlLnZhbHVlXG5cdFx0XHRcdD8gbm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSkgPj0gMCAmJlxuXHRcdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUudmFsdWUpIDw9IDEwMFxuXHRcdFx0XHQ6IHRydWU7XG5cblx0XHRcdHJldHVybiBpc1ZhbGlkSFNWSHVlICYmIGlzVmFsaWRIU1ZTYXR1cmF0aW9uICYmIGlzVmFsaWRIU1ZWYWx1ZTtcblx0XHRjYXNlICdsYWInOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0W1xuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmwsXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYSxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5iXG5cdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmwgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5sIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5hID49IC0xMjUgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYSA8PSAxMjUgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYiA+PSAtMTI1ICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmIgPD0gMTI1XG5cdFx0XHQpO1xuXHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUucmVkLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmdyZWVuLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmJsdWVcblx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUucmVkID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUucmVkIDw9IDI1NSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ncmVlbiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmdyZWVuIDw9IDI1NSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ibHVlID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYmx1ZSA8PSAyNTVcblx0XHRcdCk7XG5cdFx0Y2FzZSAnc2wnOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0W1xuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24sXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzXG5cdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24gPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MgPD0gMTAwXG5cdFx0XHQpO1xuXHRcdGNhc2UgJ3N2Jzpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFtjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uLCBjbG9uZWRDb2xvci52YWx1ZS52YWx1ZV0uZXZlcnkoXG5cdFx0XHRcdFx0aXNOdW1lcmljVmFsaWRcblx0XHRcdFx0KSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbiA8PSAxMDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUudmFsdWUgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSA8PSAxMDBcblx0XHRcdCk7XG5cdFx0Y2FzZSAneHl6Jzpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFtcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS54LFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnksXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuelxuXHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS54ID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueCA8PSA5NS4wNDcgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnkgPD0gMTAwLjAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnogPD0gMTA4Ljg4M1xuXHRcdFx0KTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQ6ICR7Y29sb3IuZm9ybWF0fWApO1xuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4KHZhbHVlOiBzdHJpbmcsIHBhdHRlcm46IFJlZ0V4cCk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gcGF0dGVybi50ZXN0KHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gaGV4Q29tcG9uZW50KHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcblx0cmV0dXJuIGhleCh2YWx1ZSwgL15bQS1GYS1mMC05XXsyfSQvKTtcbn1cblxuZnVuY3Rpb24gaGV4U2V0KHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcblx0cmV0dXJuIC9eI1swLTlhLWZBLUZdezZ9JC8udGVzdCh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHJhbmdlPFQgZXh0ZW5kcyBrZXlvZiB0eXBlb2YgX3NldHM+KFxuXHR2YWx1ZTogbnVtYmVyIHwgc3RyaW5nLFxuXHRyYW5nZUtleTogVFxuKTogdm9pZCB7XG5cdGlmICghaXNJblJhbmdlKHZhbHVlLCByYW5nZUtleSkpIHtcblx0XHRpZiAocmFuZ2VLZXkgPT09ICdIZXhTZXQnIHx8IHJhbmdlS2V5ID09PSAnSGV4Q29tcG9uZW50Jykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHZhbHVlIGZvciAke3JhbmdlS2V5fTogJHt2YWx1ZX1gKTtcblx0XHR9XG5cblx0XHRjb25zdCBbbWluLCBtYXhdID0gX3NldHNbcmFuZ2VLZXldIGFzIFtudW1iZXIsIG51bWJlcl07XG5cblx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRgVmFsdWUgJHt2YWx1ZX0gaXMgb3V0IG9mIHJhbmdlIGZvciAke3JhbmdlS2V5fSBbJHttaW59LCAke21heH1dYFxuXHRcdCk7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlOiBDb21tb25Db3JlRm5WYWxpZGF0ZSA9IHtcblx0Y29sb3JWYWx1ZXMsXG5cdGhleCxcblx0aGV4Q29tcG9uZW50LFxuXHRoZXhTZXQsXG5cdHJhbmdlXG59O1xuXG5leHBvcnQgeyBjbG9uZSB9O1xuIl19