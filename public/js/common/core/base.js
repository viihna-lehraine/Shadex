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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vY29yZS9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdDQUFnQztBQWlEaEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTNDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQzNDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUV4QixTQUFTLFlBQVksQ0FBQyxLQUFhLEVBQUUsUUFBeUI7SUFDN0QsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFbkMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBSSxLQUFRO0lBQ3pCLE9BQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FDaEIsSUFBTyxFQUNQLEtBQWE7SUFFYixJQUFJLE9BQU8sR0FBeUMsSUFBSSxDQUFDO0lBRXpELE9BQU8sQ0FBQyxHQUFHLElBQW1CLEVBQVEsRUFBRTtRQUN2QyxJQUFJLE9BQU87WUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbkMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDekIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDZixDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDWCxDQUFDLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxRQUFnQjtJQUN6QyxJQUFJ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QyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBQyxLQUFhO0lBQzVCLE9BQU8sbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFFRCxTQUFTLEtBQUssQ0FDYixLQUFzQixFQUN0QixRQUFXO0lBRVgsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUNqQyxJQUFJLFFBQVEsS0FBSyxRQUFRLElBQUksUUFBUSxLQUFLLGNBQWMsRUFBRSxDQUFDO1lBQzFELE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLFFBQVEsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFFRCxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQXFCLENBQUM7UUFFdkQsTUFBTSxJQUFJLEtBQUssQ0FDZCxTQUFTLEtBQUssd0JBQXdCLFFBQVEsS0FBSyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQ2pFLENBQUM7SUFDSCxDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBeUI7SUFDN0MsV0FBVztJQUNYLEdBQUc7SUFDSCxZQUFZO0lBQ1osTUFBTTtJQUNOLEtBQUs7Q0FDTCxDQUFDO0FBRUYsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2NvbW1vbi9jb3JlL2Jhc2UuanNcblxuaW1wb3J0IHtcblx0QWxwaGFSYW5nZSxcblx0Qnl0ZVJhbmdlLFxuXHRDTVlLLFxuXHRDTVlLVW5icmFuZGVkLFxuXHRDTVlLVmFsdWUsXG5cdENvbG9yLFxuXHRDb2xvclN0cmluZyxcblx0Q29tbW9uQ29yZUZuQmFzZSxcblx0Q29tbW9uQ29yZUZuQnJhbmQsXG5cdENvbW1vbkNvcmVGbkJyYW5kQ29sb3IsXG5cdENvbW1vbkNvcmVGbkNvbnZlcnQsXG5cdENvbW1vbkNvcmVGbkd1YXJkcyxcblx0Q29tbW9uQ29yZUZuVmFsaWRhdGUsXG5cdEhleCxcblx0SGV4Q29tcG9uZW50LFxuXHRIZXhTZXQsXG5cdEhleFVuYnJhbmRlZCxcblx0SFNMLFxuXHRIU0xVbmJyYW5kZWQsXG5cdEhTTFZhbHVlLFxuXHRIU1YsXG5cdEhTVlVuYnJhbmRlZCxcblx0SFNWVmFsdWUsXG5cdExBQixcblx0TEFCVW5icmFuZGVkLFxuXHRMQUJfTCxcblx0TEFCX0EsXG5cdExBQl9CLFxuXHROdW1lcmljUmFuZ2VLZXksXG5cdFBlcmNlbnRpbGUsXG5cdFJhZGlhbCxcblx0UmFuZ2VLZXlNYXAsXG5cdFJHQixcblx0UkdCVW5icmFuZGVkLFxuXHRTTCxcblx0U0xVbmJyYW5kZWQsXG5cdFNMVmFsdWUsXG5cdFNWLFxuXHRTVlVuYnJhbmRlZCxcblx0U1ZWYWx1ZSxcblx0WFlaLFxuXHRYWVpVbmJyYW5kZWQsXG5cdFhZWl9YLFxuXHRYWVpfWSxcblx0WFlaX1pcbn0gZnJvbSAnLi4vLi4vaW5kZXgvaW5kZXguanMnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uLy4uL2RhdGEvaW5kZXguanMnO1xuXG5jb25zdCBkZWZhdWx0Q29sb3JzID0gZGF0YS5kZWZhdWx0cy5jb2xvcnM7XG5jb25zdCBtb2RlID0gZGF0YS5tb2RlO1xuY29uc3QgX3NldHMgPSBkYXRhLnNldHM7XG5cbmZ1bmN0aW9uIGNsYW1wVG9SYW5nZSh2YWx1ZTogbnVtYmVyLCByYW5nZUtleTogTnVtZXJpY1JhbmdlS2V5KTogbnVtYmVyIHtcblx0Y29uc3QgW21pbiwgbWF4XSA9IF9zZXRzW3JhbmdlS2V5XTtcblxuXHRyZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIG1pbiksIG1heCk7XG59XG5cbmZ1bmN0aW9uIGNsb25lPFQ+KHZhbHVlOiBUKTogVCB7XG5cdHJldHVybiBzdHJ1Y3R1cmVkQ2xvbmUodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBkZWJvdW5jZTxUIGV4dGVuZHMgKC4uLmFyZ3M6IFBhcmFtZXRlcnM8VD4pID0+IHZvaWQ+KFxuXHRmdW5jOiBULFxuXHRkZWxheTogbnVtYmVyXG4pIHtcblx0bGV0IHRpbWVvdXQ6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgbnVsbCA9IG51bGw7XG5cblx0cmV0dXJuICguLi5hcmdzOiBQYXJhbWV0ZXJzPFQ+KTogdm9pZCA9PiB7XG5cdFx0aWYgKHRpbWVvdXQpIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblxuXHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdGZ1bmMoLi4uYXJncyk7XG5cdFx0fSwgZGVsYXkpO1xuXHR9O1xufVxuXG5mdW5jdGlvbiBwYXJzZUN1c3RvbUNvbG9yKHJhd1ZhbHVlOiBzdHJpbmcpOiBIU0wgfCBudWxsIHtcblx0dHJ5IHtcblx0XHRpZiAoIW1vZGUucXVpZXQpXG5cdFx0XHRjb25zb2xlLmxvZyhgUGFyc2luZyBjdXN0b20gY29sb3I6ICR7SlNPTi5zdHJpbmdpZnkocmF3VmFsdWUpfWApO1xuXG5cdFx0Y29uc3QgbWF0Y2ggPSByYXdWYWx1ZS5tYXRjaChcblx0XHRcdC9oc2xcXCgoXFxkKyksXFxzKihcXGQrKSU/LFxccyooXFxkKyklPyxcXHMqKFxcZCpcXC4/XFxkKylcXCkvXG5cdFx0KTtcblxuXHRcdGlmIChtYXRjaCkge1xuXHRcdFx0Y29uc3QgWywgaHVlLCBzYXR1cmF0aW9uLCBsaWdodG5lc3MsIGFscGhhXSA9IG1hdGNoO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwocGFyc2VJbnQoaHVlKSksXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlSW50KHNhdHVyYXRpb24pKSxcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUludChsaWdodG5lc3MpKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKHBhcnNlRmxvYXQoYWxwaGEpKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0J0ludmFsaWQgSFNMIGN1c3RvbSBjb2xvci4gRXhwZWN0ZWQgZm9ybWF0OiBoc2woSCwgUyUsIEwlLCBBKSdcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgcGFyc2VDdXN0b21Db2xvciBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBiYXNlOiBDb21tb25Db3JlRm5CYXNlID0ge1xuXHRjbGFtcFRvUmFuZ2UsXG5cdGNsb25lLFxuXHRkZWJvdW5jZSxcblx0cGFyc2VDdXN0b21Db2xvclxufSBhcyBjb25zdDtcblxuLy8gKioqKioqKiogU0VDVElPTiAyICoqKioqKioqXG5cbmZ1bmN0aW9uIGFzQWxwaGFSYW5nZSh2YWx1ZTogbnVtYmVyKTogQWxwaGFSYW5nZSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnQWxwaGFSYW5nZScpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBBbHBoYVJhbmdlO1xufVxuXG5mdW5jdGlvbiBhc0JyYW5kZWQ8VCBleHRlbmRzIGtleW9mIFJhbmdlS2V5TWFwPihcblx0dmFsdWU6IG51bWJlcixcblx0cmFuZ2VLZXk6IFRcbik6IFJhbmdlS2V5TWFwW1RdIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsIHJhbmdlS2V5KTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgUmFuZ2VLZXlNYXBbVF07XG59XG5cbmZ1bmN0aW9uIGFzQnl0ZVJhbmdlKHZhbHVlOiBudW1iZXIpOiBCeXRlUmFuZ2Uge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ0J5dGVSYW5nZScpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBCeXRlUmFuZ2U7XG59XG5cbmZ1bmN0aW9uIGFzSGV4Q29tcG9uZW50KHZhbHVlOiBzdHJpbmcpOiBIZXhDb21wb25lbnQge1xuXHRpZiAoIXZhbGlkYXRlLmhleENvbXBvbmVudCh2YWx1ZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgSGV4Q29tcG9uZW50IHZhbHVlOiAke3ZhbHVlfWApO1xuXHR9XG5cblx0cmV0dXJuIHZhbHVlIGFzIHVua25vd24gYXMgSGV4Q29tcG9uZW50O1xufVxuXG5mdW5jdGlvbiBhc0hleFNldCh2YWx1ZTogc3RyaW5nKTogSGV4U2V0IHtcblx0aWYgKC9eI1swLTlhLWZBLUZdezh9JC8udGVzdCh2YWx1ZSkpIHtcblx0XHR2YWx1ZSA9IHZhbHVlLnNsaWNlKDAsIDcpO1xuXHR9XG5cdGlmICghdmFsaWRhdGUuaGV4U2V0KHZhbHVlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBIZXhTZXQgdmFsdWU6ICR7dmFsdWV9YCk7XG5cdH1cblx0cmV0dXJuIHZhbHVlIGFzIEhleFNldDtcbn1cblxuZnVuY3Rpb24gYXNMQUJfTCh2YWx1ZTogbnVtYmVyKTogTEFCX0wge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ0xBQl9MJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIExBQl9MO1xufVxuXG5mdW5jdGlvbiBhc0xBQl9BKHZhbHVlOiBudW1iZXIpOiBMQUJfQSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnTEFCX0EnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgTEFCX0E7XG59XG5cbmZ1bmN0aW9uIGFzTEFCX0IodmFsdWU6IG51bWJlcik6IExBQl9CIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdMQUJfQicpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBMQUJfQjtcbn1cblxuZnVuY3Rpb24gYXNQZXJjZW50aWxlKHZhbHVlOiBudW1iZXIpOiBQZXJjZW50aWxlIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdQZXJjZW50aWxlJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIFBlcmNlbnRpbGU7XG59XG5cbmZ1bmN0aW9uIGFzUmFkaWFsKHZhbHVlOiBudW1iZXIpOiBSYWRpYWwge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ1JhZGlhbCcpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBSYWRpYWw7XG59XG5cbmZ1bmN0aW9uIGFzWFlaX1godmFsdWU6IG51bWJlcik6IFhZWl9YIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdYWVpfWCcpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBYWVpfWDtcbn1cblxuZnVuY3Rpb24gYXNYWVpfWSh2YWx1ZTogbnVtYmVyKTogWFlaX1kge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ1hZWl9ZJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIFhZWl9ZO1xufVxuXG5mdW5jdGlvbiBhc1hZWl9aKHZhbHVlOiBudW1iZXIpOiBYWVpfWiB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnWFlaX1onKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgWFlaX1o7XG59XG5cbmV4cG9ydCBjb25zdCBicmFuZDogQ29tbW9uQ29yZUZuQnJhbmQgPSB7XG5cdGFzQWxwaGFSYW5nZSxcblx0YXNCcmFuZGVkLFxuXHRhc0J5dGVSYW5nZSxcblx0YXNIZXhDb21wb25lbnQsXG5cdGFzSGV4U2V0LFxuXHRhc0xBQl9MLFxuXHRhc0xBQl9BLFxuXHRhc0xBQl9CLFxuXHRhc1BlcmNlbnRpbGUsXG5cdGFzUmFkaWFsLFxuXHRhc1hZWl9YLFxuXHRhc1hZWl9ZLFxuXHRhc1hZWl9aXG59O1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDIgLSBCcmFuZCBDb2xvciAqKioqKioqKlxuXG5mdW5jdGlvbiBhc0NNWUsoY29sb3I6IENNWUtVbmJyYW5kZWQpOiBDTVlLIHtcblx0Y29uc3QgYnJhbmRlZEN5YW4gPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUuY3lhbik7XG5cdGNvbnN0IGJyYW5kZWRNYWdlbnRhID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLm1hZ2VudGEpO1xuXHRjb25zdCBicmFuZGVkWWVsbG93ID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnllbGxvdyk7XG5cdGNvbnN0IGJyYW5kZWRLZXkgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUua2V5KTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRjeWFuOiBicmFuZGVkQ3lhbixcblx0XHRcdG1hZ2VudGE6IGJyYW5kZWRNYWdlbnRhLFxuXHRcdFx0eWVsbG93OiBicmFuZGVkWWVsbG93LFxuXHRcdFx0a2V5OiBicmFuZGVkS2V5LFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnY215aydcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNIZXgoY29sb3I6IEhleFVuYnJhbmRlZCk6IEhleCB7XG5cdGxldCBoZXggPSBjb2xvci52YWx1ZS5oZXg7XG5cblx0aWYgKCFoZXguc3RhcnRzV2l0aCgnIycpKSBoZXggPSBgIyR7aGV4fWA7XG5cblx0aWYgKCEvXiNbMC05QS1GYS1mXXs4fSQvLnRlc3QoaGV4KSlcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgSGV4IGNvbG9yIGZvcm1hdDogJHtoZXh9YCk7XG5cblx0Y29uc3QgaGV4TWFpbiA9IGhleC5zbGljZSgwLCA3KTtcblx0Y29uc3QgYWxwaGEgPSBoZXguc2xpY2UoNywgOSk7XG5cblx0Y29uc3QgYnJhbmRlZEhleCA9IGJyYW5kLmFzSGV4U2V0KGhleE1haW4pO1xuXHRjb25zdCBicmFuZGVkSGV4QWxwaGEgPSBicmFuZC5hc0hleENvbXBvbmVudChhbHBoYSk7XG5cdGNvbnN0IGJyYW5kZWROdW1BbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5udW1BbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0aGV4OiBicmFuZGVkSGV4LFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRIZXhBbHBoYSxcblx0XHRcdG51bUFscGhhOiBicmFuZGVkTnVtQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ2hleCdcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNIU0woY29sb3I6IEhTTFVuYnJhbmRlZCk6IEhTTCB7XG5cdGNvbnN0IGJyYW5kZWRIdWUgPSBicmFuZC5hc1JhZGlhbChjb2xvci52YWx1ZS5odWUpO1xuXHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5zYXR1cmF0aW9uKTtcblx0Y29uc3QgYnJhbmRlZExpZ2h0bmVzcyA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5saWdodG5lc3MpO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdGh1ZTogYnJhbmRlZEh1ZSxcblx0XHRcdHNhdHVyYXRpb246IGJyYW5kZWRTYXR1cmF0aW9uLFxuXHRcdFx0bGlnaHRuZXNzOiBicmFuZGVkTGlnaHRuZXNzLFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnaHNsJ1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc0hTVihjb2xvcjogSFNWVW5icmFuZGVkKTogSFNWIHtcblx0Y29uc3QgYnJhbmRlZEh1ZSA9IGJyYW5kLmFzUmFkaWFsKGNvbG9yLnZhbHVlLmh1ZSk7XG5cdGNvbnN0IGJyYW5kZWRTYXR1cmF0aW9uID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnNhdHVyYXRpb24pO1xuXHRjb25zdCBicmFuZGVkVmFsdWUgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUudmFsdWUpO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdGh1ZTogYnJhbmRlZEh1ZSxcblx0XHRcdHNhdHVyYXRpb246IGJyYW5kZWRTYXR1cmF0aW9uLFxuXHRcdFx0dmFsdWU6IGJyYW5kZWRWYWx1ZSxcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ2hzdidcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNMQUIoY29sb3I6IExBQlVuYnJhbmRlZCk6IExBQiB7XG5cdGNvbnN0IGJyYW5kZWRMID0gYnJhbmQuYXNMQUJfTChjb2xvci52YWx1ZS5sKTtcblx0Y29uc3QgYnJhbmRlZEEgPSBicmFuZC5hc0xBQl9BKGNvbG9yLnZhbHVlLmEpO1xuXHRjb25zdCBicmFuZGVkQiA9IGJyYW5kLmFzTEFCX0IoY29sb3IudmFsdWUuYik7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0bDogYnJhbmRlZEwsXG5cdFx0XHRhOiBicmFuZGVkQSxcblx0XHRcdGI6IGJyYW5kZWRCLFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnbGFiJ1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc1JHQihjb2xvcjogUkdCVW5icmFuZGVkKTogUkdCIHtcblx0Y29uc3QgYnJhbmRlZFJlZCA9IGJyYW5kLmFzQnl0ZVJhbmdlKGNvbG9yLnZhbHVlLnJlZCk7XG5cdGNvbnN0IGJyYW5kZWRHcmVlbiA9IGJyYW5kLmFzQnl0ZVJhbmdlKGNvbG9yLnZhbHVlLmdyZWVuKTtcblx0Y29uc3QgYnJhbmRlZEJsdWUgPSBicmFuZC5hc0J5dGVSYW5nZShjb2xvci52YWx1ZS5ibHVlKTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRyZWQ6IGJyYW5kZWRSZWQsXG5cdFx0XHRncmVlbjogYnJhbmRlZEdyZWVuLFxuXHRcdFx0Ymx1ZTogYnJhbmRlZEJsdWUsXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdyZ2InXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzU0woY29sb3I6IFNMVW5icmFuZGVkKTogU0wge1xuXHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5zYXR1cmF0aW9uKTtcblx0Y29uc3QgYnJhbmRlZExpZ2h0bmVzcyA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5saWdodG5lc3MpO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdHNhdHVyYXRpb246IGJyYW5kZWRTYXR1cmF0aW9uLFxuXHRcdFx0bGlnaHRuZXNzOiBicmFuZGVkTGlnaHRuZXNzLFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnc2wnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzU1YoY29sb3I6IFNWVW5icmFuZGVkKTogU1Yge1xuXHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5zYXR1cmF0aW9uKTtcblx0Y29uc3QgYnJhbmRlZFZhbHVlID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnZhbHVlKTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdHZhbHVlOiBicmFuZGVkVmFsdWUsXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdzdidcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNYWVooY29sb3I6IFhZWlVuYnJhbmRlZCk6IFhZWiB7XG5cdGNvbnN0IGJyYW5kZWRYID0gYnJhbmQuYXNYWVpfWChjb2xvci52YWx1ZS54KTtcblx0Y29uc3QgYnJhbmRlZFkgPSBicmFuZC5hc1hZWl9ZKGNvbG9yLnZhbHVlLnkpO1xuXHRjb25zdCBicmFuZGVkWiA9IGJyYW5kLmFzWFlaX1ooY29sb3IudmFsdWUueik7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0eDogYnJhbmRlZFgsXG5cdFx0XHR5OiBicmFuZGVkWSxcblx0XHRcdHo6IGJyYW5kZWRaLFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAneHl6J1xuXHR9O1xufVxuXG5leHBvcnQgY29uc3QgYnJhbmRDb2xvcjogQ29tbW9uQ29yZUZuQnJhbmRDb2xvciA9IHtcblx0YXNDTVlLLFxuXHRhc0hleCxcblx0YXNIU0wsXG5cdGFzSFNWLFxuXHRhc0xBQixcblx0YXNSR0IsXG5cdGFzU0wsXG5cdGFzU1YsXG5cdGFzWFlaXG59O1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDMgLSBDb252ZXJ0ICoqKioqKioqXG5cbmZ1bmN0aW9uIGhleEFscGhhVG9OdW1lcmljQWxwaGEoaGV4QWxwaGE6IHN0cmluZyk6IG51bWJlciB7XG5cdHJldHVybiBwYXJzZUludChoZXhBbHBoYSwgMTYpIC8gMjU1O1xufVxuXG5mdW5jdGlvbiB0b0NvbG9yKGNvbG9yU3RyaW5nOiBDb2xvclN0cmluZyk6IENvbG9yIHtcblx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjbG9uZShjb2xvclN0cmluZyk7XG5cblx0Y29uc3QgcGFyc2VWYWx1ZSA9ICh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyID0+XG5cdFx0dHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5lbmRzV2l0aCgnJScpXG5cdFx0XHQ/IHBhcnNlRmxvYXQodmFsdWUuc2xpY2UoMCwgLTEpKVxuXHRcdFx0OiBOdW1iZXIodmFsdWUpO1xuXG5cdGNvbnN0IG5ld1ZhbHVlID0gT2JqZWN0LmVudHJpZXMoY2xvbmVkQ29sb3IudmFsdWUpLnJlZHVjZShcblx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHRhY2Nba2V5IGFzIGtleW9mICh0eXBlb2YgY2xvbmVkQ29sb3IpWyd2YWx1ZSddXSA9IHBhcnNlVmFsdWUoXG5cdFx0XHRcdHZhbFxuXHRcdFx0KSBhcyBuZXZlcjtcblx0XHRcdHJldHVybiBhY2M7XG5cdFx0fSxcblx0XHR7fSBhcyBSZWNvcmQ8a2V5b2YgKHR5cGVvZiBjbG9uZWRDb2xvcilbJ3ZhbHVlJ10sIG51bWJlcj5cblx0KTtcblxuXHRzd2l0Y2ggKGNsb25lZENvbG9yLmZvcm1hdCkge1xuXHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnY215aycsIHZhbHVlOiBuZXdWYWx1ZSBhcyBDTVlLVmFsdWUgfTtcblx0XHRjYXNlICdoc2wnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnaHNsJywgdmFsdWU6IG5ld1ZhbHVlIGFzIEhTTFZhbHVlIH07XG5cdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ2hzdicsIHZhbHVlOiBuZXdWYWx1ZSBhcyBIU1ZWYWx1ZSB9O1xuXHRcdGNhc2UgJ3NsJzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ3NsJywgdmFsdWU6IG5ld1ZhbHVlIGFzIFNMVmFsdWUgfTtcblx0XHRjYXNlICdzdic6XG5cdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdzdicsIHZhbHVlOiBuZXdWYWx1ZSBhcyBTVlZhbHVlIH07XG5cdFx0ZGVmYXVsdDpcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcignVW5zdXBwb3J0ZWQgZm9ybWF0IGZvciBjb2xvclN0cmluZ1RvQ29sb3InKTtcblxuXHRcdFx0Y29uc3QgdW5icmFuZGVkSFNMID0gZGVmYXVsdENvbG9ycy5oc2w7XG5cblx0XHRcdGNvbnN0IGJyYW5kZWRIdWUgPSBicmFuZC5hc1JhZGlhbCh1bmJyYW5kZWRIU0wudmFsdWUuaHVlKTtcblx0XHRcdGNvbnN0IGJyYW5kZWRTYXR1cmF0aW9uID0gYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHR1bmJyYW5kZWRIU0wudmFsdWUuc2F0dXJhdGlvblxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IGJyYW5kZWRMaWdodG5lc3MgPSBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdHVuYnJhbmRlZEhTTC52YWx1ZS5saWdodG5lc3Ncblx0XHRcdCk7XG5cdFx0XHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UodW5icmFuZGVkSFNMLnZhbHVlLmFscGhhKTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IGJyYW5kZWRIdWUsXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmRlZFNhdHVyYXRpb24sXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZGVkTGlnaHRuZXNzLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fTtcblx0fVxufVxuXG5mdW5jdGlvbiB0b0NvbG9yVmFsdWVSYW5nZTxUIGV4dGVuZHMga2V5b2YgUmFuZ2VLZXlNYXA+KFxuXHR2YWx1ZTogc3RyaW5nIHwgbnVtYmVyLFxuXHRyYW5nZUtleTogVFxuKTogUmFuZ2VLZXlNYXBbVF0ge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgcmFuZ2VLZXkpO1xuXG5cdGlmIChyYW5nZUtleSA9PT0gJ0hleFNldCcpIHtcblx0XHRyZXR1cm4gYnJhbmQuYXNIZXhTZXQodmFsdWUgYXMgc3RyaW5nKSBhcyB1bmtub3duIGFzIFJhbmdlS2V5TWFwW1RdO1xuXHR9XG5cblx0aWYgKHJhbmdlS2V5ID09PSAnSGV4Q29tcG9uZW50Jykge1xuXHRcdHJldHVybiBicmFuZC5hc0hleENvbXBvbmVudChcblx0XHRcdHZhbHVlIGFzIHN0cmluZ1xuXHRcdCkgYXMgdW5rbm93biBhcyBSYW5nZUtleU1hcFtUXTtcblx0fVxuXG5cdHJldHVybiBicmFuZC5hc0JyYW5kZWQoXG5cdFx0dmFsdWUgYXMgbnVtYmVyLFxuXHRcdHJhbmdlS2V5XG5cdCkgYXMgdW5rbm93biBhcyBSYW5nZUtleU1hcFtUXTtcbn1cblxuZnVuY3Rpb24gdG9DU1NDb2xvclN0cmluZyhjb2xvcjogQ29sb3IpOiBzdHJpbmcge1xuXHR0cnkge1xuXHRcdHN3aXRjaCAoY29sb3IuZm9ybWF0KSB7XG5cdFx0XHRjYXNlICdjbXlrJzpcblx0XHRcdFx0cmV0dXJuIGBjbXlrKCR7Y29sb3IudmFsdWUuY3lhbn0sJHtjb2xvci52YWx1ZS5tYWdlbnRhfSwke2NvbG9yLnZhbHVlLnllbGxvd30sJHtjb2xvci52YWx1ZS5rZXl9JHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBTdHJpbmcoY29sb3IudmFsdWUuaGV4KTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiBgaHNsKCR7Y29sb3IudmFsdWUuaHVlfSwke2NvbG9yLnZhbHVlLnNhdHVyYXRpb259JSwke2NvbG9yLnZhbHVlLmxpZ2h0bmVzc30lLCR7Y29sb3IudmFsdWUuYWxwaGF9KWA7XG5cdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRyZXR1cm4gYGhzdigke2NvbG9yLnZhbHVlLmh1ZX0sJHtjb2xvci52YWx1ZS5zYXR1cmF0aW9ufSUsJHtjb2xvci52YWx1ZS52YWx1ZX0lLCR7Y29sb3IudmFsdWUuYWxwaGF9KWA7XG5cdFx0XHRjYXNlICdsYWInOlxuXHRcdFx0XHRyZXR1cm4gYGxhYigke2NvbG9yLnZhbHVlLmx9LCR7Y29sb3IudmFsdWUuYX0sJHtjb2xvci52YWx1ZS5ifSwke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0Y2FzZSAncmdiJzpcblx0XHRcdFx0cmV0dXJuIGByZ2IoJHtjb2xvci52YWx1ZS5yZWR9LCR7Y29sb3IudmFsdWUuZ3JlZW59LCR7Y29sb3IudmFsdWUuYmx1ZX0sJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdHJldHVybiBgeHl6KCR7Y29sb3IudmFsdWUueH0sJHtjb2xvci52YWx1ZS55fSwke2NvbG9yLnZhbHVlLnp9LCR7Y29sb3IudmFsdWUuYWxwaGF9KWA7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgVW5leHBlY3RlZCBjb2xvciBmb3JtYXQ6ICR7Y29sb3IuZm9ybWF0fWApO1xuXG5cdFx0XHRcdHJldHVybiAnI0ZGRkZGRkZGJztcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBnZXRDU1NDb2xvclN0cmluZyBlcnJvcjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgY29udmVydDogQ29tbW9uQ29yZUZuQ29udmVydCA9IHtcblx0aGV4QWxwaGFUb051bWVyaWNBbHBoYSxcblx0dG9Db2xvcixcblx0dG9Db2xvclZhbHVlUmFuZ2UsXG5cdHRvQ1NTQ29sb3JTdHJpbmdcbn07XG5cbi8vICoqKioqKioqIFNFQ1RJT04gNCAtIEd1YXJkcyAqKioqKioqKlxuXG5mdW5jdGlvbiBpc0NvbG9yKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ29sb3Ige1xuXHRpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fCB2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG5cdGNvbnN0IGNvbG9yID0gdmFsdWUgYXMgQ29sb3I7XG5cdGNvbnN0IHZhbGlkRm9ybWF0czogQ29sb3JbJ2Zvcm1hdCddW10gPSBbXG5cdFx0J2NteWsnLFxuXHRcdCdoZXgnLFxuXHRcdCdoc2wnLFxuXHRcdCdoc3YnLFxuXHRcdCdsYWInLFxuXHRcdCdyZ2InLFxuXHRcdCdzbCcsXG5cdFx0J3N2Jyxcblx0XHQneHl6J1xuXHRdO1xuXG5cdHJldHVybiAoXG5cdFx0J3ZhbHVlJyBpbiBjb2xvciAmJlxuXHRcdCdmb3JtYXQnIGluIGNvbG9yICYmXG5cdFx0dmFsaWRGb3JtYXRzLmluY2x1ZGVzKGNvbG9yLmZvcm1hdClcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNDb2xvclN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENvbG9yU3RyaW5nIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuXHRjb25zdCBjb2xvclN0cmluZyA9IHZhbHVlIGFzIENvbG9yU3RyaW5nO1xuXHRjb25zdCB2YWxpZFN0cmluZ0Zvcm1hdHM6IENvbG9yU3RyaW5nWydmb3JtYXQnXVtdID0gW1xuXHRcdCdjbXlrJyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnc2wnLFxuXHRcdCdzdidcblx0XTtcblxuXHRyZXR1cm4gKFxuXHRcdCd2YWx1ZScgaW4gY29sb3JTdHJpbmcgJiZcblx0XHQnZm9ybWF0JyBpbiBjb2xvclN0cmluZyAmJlxuXHRcdHZhbGlkU3RyaW5nRm9ybWF0cy5pbmNsdWRlcyhjb2xvclN0cmluZy5mb3JtYXQpXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSW5SYW5nZTxUIGV4dGVuZHMga2V5b2YgdHlwZW9mIF9zZXRzPihcblx0dmFsdWU6IG51bWJlciB8IHN0cmluZyxcblx0cmFuZ2VLZXk6IFRcbik6IGJvb2xlYW4ge1xuXHRpZiAocmFuZ2VLZXkgPT09ICdIZXhTZXQnKSB7XG5cdFx0cmV0dXJuIHZhbGlkYXRlLmhleFNldCh2YWx1ZSBhcyBzdHJpbmcpO1xuXHR9XG5cblx0aWYgKHJhbmdlS2V5ID09PSAnSGV4Q29tcG9uZW50Jykge1xuXHRcdHJldHVybiB2YWxpZGF0ZS5oZXhDb21wb25lbnQodmFsdWUgYXMgc3RyaW5nKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIEFycmF5LmlzQXJyYXkoX3NldHNbcmFuZ2VLZXldKSkge1xuXHRcdGNvbnN0IFttaW4sIG1heF0gPSBfc2V0c1tyYW5nZUtleV0gYXMgW251bWJlciwgbnVtYmVyXTtcblxuXHRcdHJldHVybiB2YWx1ZSA+PSBtaW4gJiYgdmFsdWUgPD0gbWF4O1xuXHR9XG5cblx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHJhbmdlIG9yIHZhbHVlIGZvciAke3JhbmdlS2V5fWApO1xufVxuXG5leHBvcnQgY29uc3QgZ3VhcmRzOiBDb21tb25Db3JlRm5HdWFyZHMgPSB7XG5cdGlzQ29sb3IsXG5cdGlzQ29sb3JTdHJpbmcsXG5cdGlzSW5SYW5nZVxufTtcblxuLy8gKioqKioqKiogU0VDVElPTiA1IC0gU2FuaXRpemUgKioqKioqKipcblxuZnVuY3Rpb24gbGFiKHZhbHVlOiBudW1iZXIsIG91dHB1dDogJ2wnIHwgJ2EnIHwgJ2InKTogTEFCX0wgfCBMQUJfQSB8IExBQl9CIHtcblx0aWYgKG91dHB1dCA9PT0gJ2wnKSB7XG5cdFx0cmV0dXJuIGJyYW5kLmFzTEFCX0woTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgMCksIDEwMCkpKTtcblx0fSBlbHNlIGlmIChvdXRwdXQgPT09ICdhJykge1xuXHRcdHJldHVybiBicmFuZC5hc0xBQl9BKE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIC0xMjUpLCAxMjUpKSk7XG5cdH0gZWxzZSBpZiAob3V0cHV0ID09PSAnYicpIHtcblx0XHRyZXR1cm4gYnJhbmQuYXNMQUJfQihNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAtMTI1KSwgMTI1KSkpO1xuXHR9IGVsc2UgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gcmV0dXJuIExBQiB2YWx1ZScpO1xufVxuXG5mdW5jdGlvbiBwZXJjZW50aWxlKHZhbHVlOiBudW1iZXIpOiBQZXJjZW50aWxlIHtcblx0Y29uc3QgcmF3UGVyY2VudGlsZSA9IE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIDApLCAxMDApKTtcblxuXHRyZXR1cm4gYnJhbmQuYXNQZXJjZW50aWxlKHJhd1BlcmNlbnRpbGUpO1xufVxuXG5mdW5jdGlvbiByYWRpYWwodmFsdWU6IG51bWJlcik6IFJhZGlhbCB7XG5cdGNvbnN0IHJhd1JhZGlhbCA9IE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIDApLCAzNjApKSAmIDM2MDtcblxuXHRyZXR1cm4gYnJhbmQuYXNSYWRpYWwocmF3UmFkaWFsKTtcbn1cblxuZnVuY3Rpb24gcmdiKHZhbHVlOiBudW1iZXIpOiBCeXRlUmFuZ2Uge1xuXHRjb25zdCByYXdCeXRlUmFuZ2UgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAwKSwgMjU1KSk7XG5cblx0cmV0dXJuIHRvQ29sb3JWYWx1ZVJhbmdlKHJhd0J5dGVSYW5nZSwgJ0J5dGVSYW5nZScpO1xufVxuXG5leHBvcnQgY29uc3Qgc2FuaXRpemUgPSB7XG5cdGxhYixcblx0cGVyY2VudGlsZSxcblx0cmFkaWFsLFxuXHRyZ2Jcbn07XG5cbi8vICoqKioqKioqIFNFQ1RJT04gNiAtIFZhbGlkYXRlICoqKioqKioqXG5cbmZ1bmN0aW9uIGNvbG9yVmFsdWVzKGNvbG9yOiBDb2xvciB8IFNMIHwgU1YpOiBib29sZWFuIHtcblx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjbG9uZShjb2xvcik7XG5cdGNvbnN0IGlzTnVtZXJpY1ZhbGlkID0gKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiA9PlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKTtcblx0Y29uc3Qgbm9ybWFsaXplUGVyY2VudGFnZSA9ICh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyID0+IHtcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5lbmRzV2l0aCgnJScpKSB7XG5cdFx0XHRyZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZS5zbGljZSgwLCAtMSkpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInID8gdmFsdWUgOiBOYU47XG5cdH07XG5cblx0c3dpdGNoIChjbG9uZWRDb2xvci5mb3JtYXQpIHtcblx0XHRjYXNlICdjbXlrJzpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFtcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5jeWFuLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLm1hZ2VudGEsXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueWVsbG93LFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmtleVxuXHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5jeWFuID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuY3lhbiA8PSAxMDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubWFnZW50YSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLm1hZ2VudGEgPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnllbGxvdyA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnllbGxvdyA8PSAxMDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUua2V5ID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUua2V5IDw9IDEwMFxuXHRcdFx0KTtcblx0XHRjYXNlICdoZXgnOlxuXHRcdFx0cmV0dXJuIC9eI1swLTlBLUZhLWZdezZ9JC8udGVzdChjbG9uZWRDb2xvci52YWx1ZS5oZXgpO1xuXHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRjb25zdCBpc1ZhbGlkSFNMSHVlID1cblx0XHRcdFx0aXNOdW1lcmljVmFsaWQoY2xvbmVkQ29sb3IudmFsdWUuaHVlKSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5odWUgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5odWUgPD0gMzYwO1xuXHRcdFx0Y29uc3QgaXNWYWxpZEhTTFNhdHVyYXRpb24gPVxuXHRcdFx0XHRub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24pID49IDAgJiZcblx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uKSA8PSAxMDA7XG5cdFx0XHRjb25zdCBpc1ZhbGlkSFNMTGlnaHRuZXNzID0gY2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzXG5cdFx0XHRcdD8gbm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MpID49IDAgJiZcblx0XHRcdFx0XHRub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLmxpZ2h0bmVzcykgPD0gMTAwXG5cdFx0XHRcdDogdHJ1ZTtcblxuXHRcdFx0cmV0dXJuIGlzVmFsaWRIU0xIdWUgJiYgaXNWYWxpZEhTTFNhdHVyYXRpb24gJiYgaXNWYWxpZEhTTExpZ2h0bmVzcztcblx0XHRjYXNlICdoc3YnOlxuXHRcdFx0Y29uc3QgaXNWYWxpZEhTVkh1ZSA9XG5cdFx0XHRcdGlzTnVtZXJpY1ZhbGlkKGNsb25lZENvbG9yLnZhbHVlLmh1ZSkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlIDw9IDM2MDtcblx0XHRcdGNvbnN0IGlzVmFsaWRIU1ZTYXR1cmF0aW9uID1cblx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uKSA+PSAwICYmXG5cdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbikgPD0gMTAwO1xuXHRcdFx0Y29uc3QgaXNWYWxpZEhTVlZhbHVlID0gY2xvbmVkQ29sb3IudmFsdWUudmFsdWVcblx0XHRcdFx0PyBub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLnZhbHVlKSA+PSAwICYmXG5cdFx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSkgPD0gMTAwXG5cdFx0XHRcdDogdHJ1ZTtcblxuXHRcdFx0cmV0dXJuIGlzVmFsaWRIU1ZIdWUgJiYgaXNWYWxpZEhTVlNhdHVyYXRpb24gJiYgaXNWYWxpZEhTVlZhbHVlO1xuXHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubCxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5hLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmJcblx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubCA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmwgPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmEgPj0gLTEyNSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5hIDw9IDEyNSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5iID49IC0xMjUgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYiA8PSAxMjVcblx0XHRcdCk7XG5cdFx0Y2FzZSAncmdiJzpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFtcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5yZWQsXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuZ3JlZW4sXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYmx1ZVxuXHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5yZWQgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5yZWQgPD0gMjU1ICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmdyZWVuID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuZ3JlZW4gPD0gMjU1ICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmJsdWUgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ibHVlIDw9IDI1NVxuXHRcdFx0KTtcblx0XHRjYXNlICdzbCc6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbixcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3Ncblx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24gPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmxpZ2h0bmVzcyA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmxpZ2h0bmVzcyA8PSAxMDBcblx0XHRcdCk7XG5cdFx0Y2FzZSAnc3YnOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0W2Nsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24sIGNsb25lZENvbG9yLnZhbHVlLnZhbHVlXS5ldmVyeShcblx0XHRcdFx0XHRpc051bWVyaWNWYWxpZFxuXHRcdFx0XHQpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24gPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnZhbHVlIDw9IDEwMFxuXHRcdFx0KTtcblx0XHRjYXNlICd4eXonOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0W1xuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLngsXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueSxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS56XG5cdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnggPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS54IDw9IDk1LjA0NyAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55ID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueSA8PSAxMDAuMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS56ID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueiA8PSAxMDguODgzXG5cdFx0XHQpO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtjb2xvci5mb3JtYXR9YCk7XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5mdW5jdGlvbiBoZXgodmFsdWU6IHN0cmluZywgcGF0dGVybjogUmVnRXhwKTogYm9vbGVhbiB7XG5cdHJldHVybiBwYXR0ZXJuLnRlc3QodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBoZXhDb21wb25lbnQodmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gaGV4KHZhbHVlLCAvXltBLUZhLWYwLTldezJ9JC8pO1xufVxuXG5mdW5jdGlvbiBoZXhTZXQodmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gL14jWzAtOWEtZkEtRl17Nn0kLy50ZXN0KHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gcmFuZ2U8VCBleHRlbmRzIGtleW9mIHR5cGVvZiBfc2V0cz4oXG5cdHZhbHVlOiBudW1iZXIgfCBzdHJpbmcsXG5cdHJhbmdlS2V5OiBUXG4pOiB2b2lkIHtcblx0aWYgKCFpc0luUmFuZ2UodmFsdWUsIHJhbmdlS2V5KSkge1xuXHRcdGlmIChyYW5nZUtleSA9PT0gJ0hleFNldCcgfHwgcmFuZ2VLZXkgPT09ICdIZXhDb21wb25lbnQnKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdmFsdWUgZm9yICR7cmFuZ2VLZXl9OiAke3ZhbHVlfWApO1xuXHRcdH1cblxuXHRcdGNvbnN0IFttaW4sIG1heF0gPSBfc2V0c1tyYW5nZUtleV0gYXMgW251bWJlciwgbnVtYmVyXTtcblxuXHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdGBWYWx1ZSAke3ZhbHVlfSBpcyBvdXQgb2YgcmFuZ2UgZm9yICR7cmFuZ2VLZXl9IFske21pbn0sICR7bWF4fV1gXG5cdFx0KTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgdmFsaWRhdGU6IENvbW1vbkNvcmVGblZhbGlkYXRlID0ge1xuXHRjb2xvclZhbHVlcyxcblx0aGV4LFxuXHRoZXhDb21wb25lbnQsXG5cdGhleFNldCxcblx0cmFuZ2Vcbn07XG5cbmV4cG9ydCB7IGNsb25lIH07XG4iXX0=