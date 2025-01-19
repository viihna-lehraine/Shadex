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
function cmykStringToValue(cmyk) {
    return {
        cyan: brand.asPercentile(parseFloat(cmyk.cyan) / 100),
        magenta: brand.asPercentile(parseFloat(cmyk.magenta) / 100),
        yellow: brand.asPercentile(parseFloat(cmyk.yellow) / 100),
        key: brand.asPercentile(parseFloat(cmyk.key) / 100),
        alpha: brand.asAlphaRange(parseFloat(cmyk.alpha))
    };
}
function cmykValueToString(cmyk) {
    return {
        cyan: `${cmyk.cyan * 100}%`,
        magenta: `${cmyk.magenta * 100}%`,
        yellow: `${cmyk.yellow * 100}%`,
        key: `${cmyk.key * 100}%`,
        alpha: `${cmyk.alpha}`
    };
}
function hexAlphaToNumericAlpha(hexAlpha) {
    return parseInt(hexAlpha, 16) / 255;
}
function hexStringToValue(hex) {
    return {
        hex: brand.asHexSet(hex.hex),
        alpha: brand.asHexComponent(hex.alpha),
        numAlpha: brand.asAlphaRange(parseFloat(hex.numAlpha))
    };
}
function hexValueToString(hex) {
    return {
        hex: hex.hex,
        alpha: `${hex.alpha}`,
        numAlpha: `${hex.numAlpha}`
    };
}
function hslStringToValue(hsl) {
    return {
        hue: brand.asRadial(parseFloat(hsl.hue)),
        saturation: brand.asPercentile(parseFloat(hsl.saturation) / 100),
        lightness: brand.asPercentile(parseFloat(hsl.lightness) / 100),
        alpha: brand.asAlphaRange(parseFloat(hsl.alpha))
    };
}
function hslValueToString(hsl) {
    return {
        hue: `${hsl.hue}°`,
        saturation: `${hsl.saturation * 100}%`,
        lightness: `${hsl.lightness * 100}%`,
        alpha: `${hsl.alpha}`
    };
}
function hsvStringToValue(hsv) {
    return {
        hue: brand.asRadial(parseFloat(hsv.hue)),
        saturation: brand.asPercentile(parseFloat(hsv.saturation) / 100),
        value: brand.asPercentile(parseFloat(hsv.value) / 100),
        alpha: brand.asAlphaRange(parseFloat(hsv.alpha))
    };
}
function hsvValueToString(hsv) {
    return {
        hue: `${hsv.hue}°`,
        saturation: `${hsv.saturation * 100}%`,
        value: `${hsv.value * 100}%`,
        alpha: `${hsv.alpha}`
    };
}
function labValueToString(lab) {
    return {
        l: `${lab.l}`,
        a: `${lab.a}`,
        b: `${lab.b}`,
        alpha: `${lab.alpha}`
    };
}
function labStringToValue(lab) {
    return {
        l: brand.asLAB_L(parseFloat(lab.l)),
        a: brand.asLAB_A(parseFloat(lab.a)),
        b: brand.asLAB_B(parseFloat(lab.b)),
        alpha: brand.asAlphaRange(parseFloat(lab.alpha))
    };
}
function rgbValueToString(rgb) {
    return {
        red: `${rgb.red}`,
        green: `${rgb.green}`,
        blue: `${rgb.blue}`,
        alpha: `${rgb.alpha}`
    };
}
function rgbStringToValue(rgb) {
    return {
        red: brand.asByteRange(parseFloat(rgb.red)),
        green: brand.asByteRange(parseFloat(rgb.green)),
        blue: brand.asByteRange(parseFloat(rgb.blue)),
        alpha: brand.asAlphaRange(parseFloat(rgb.alpha))
    };
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
function xyzValueToString(xyz) {
    return {
        x: `${xyz.x}`,
        y: `${xyz.y}`,
        z: `${xyz.z}`,
        alpha: `${xyz.alpha}`
    };
}
function xyzStringToValue(xyz) {
    return {
        x: brand.asXYZ_X(parseFloat(xyz.x)),
        y: brand.asXYZ_Y(parseFloat(xyz.y)),
        z: brand.asXYZ_Z(parseFloat(xyz.z)),
        alpha: brand.asAlphaRange(parseFloat(xyz.alpha))
    };
}
const stringToValue = {
    cmyk: cmykStringToValue,
    hex: hexStringToValue,
    hsl: hslStringToValue,
    hsv: hsvStringToValue,
    lab: labStringToValue,
    rgb: rgbStringToValue,
    xyz: xyzStringToValue
};
const valueToString = {
    cmyk: cmykValueToString,
    hex: hexValueToString,
    hsl: hslValueToString,
    hsv: hsvValueToString,
    lab: labValueToString,
    rgb: rgbValueToString,
    xyz: xyzValueToString
};
export const convert = {
    hexAlphaToNumericAlpha,
    stringToValue,
    toColor,
    toColorValueRange,
    toCSSColorString,
    valueToString
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vY29yZS9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdDQUFnQztBQTZEaEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUVwRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUNsQyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUMzQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFFeEIsU0FBUyxZQUFZLENBQUMsS0FBYSxFQUFFLFFBQXlCO0lBQzdELE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRW5DLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBRUQsU0FBUyxLQUFLLENBQUksS0FBUTtJQUN6QixPQUFPLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBRUQsU0FBUyxRQUFRLENBQ2hCLElBQU8sRUFDUCxLQUFhO0lBRWIsSUFBSSxPQUFPLEdBQXlDLElBQUksQ0FBQztJQUV6RCxPQUFPLENBQUMsR0FBRyxJQUFtQixFQUFRLEVBQUU7UUFDdkMsSUFBSSxPQUFPO1lBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRW5DLE9BQU8sR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFD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TyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQztTQUFNLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQzNCLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztTQUFNLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQzNCLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQzs7UUFBTSxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDdEQsQ0FBQztBQUVELFNBQVMsVUFBVSxDQUFDLEtBQWE7SUFDaEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFcEUsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBQyxLQUFhO0lBQzVCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUss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RSxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9jb21tb24vY29yZS9iYXNlLmpzXG5cbmltcG9ydCB7XG5cdEFscGhhUmFuZ2UsXG5cdEJ5dGVSYW5nZSxcblx0Q01ZSyxcblx0Q01ZS1VuYnJhbmRlZCxcblx0Q01ZS1ZhbHVlLFxuXHRDTVlLVmFsdWVTdHJpbmcsXG5cdENvbG9yLFxuXHRDb2xvclNwYWNlLFxuXHRDb2xvclN0cmluZyxcblx0Q29tbW9uQ29yZUZuQmFzZSxcblx0Q29tbW9uQ29yZUZuQnJhbmQsXG5cdENvbW1vbkNvcmVGbkJyYW5kQ29sb3IsXG5cdENvbW1vbkNvcmVGbkNvbnZlcnQsXG5cdENvbW1vbkNvcmVGbkd1YXJkcyxcblx0Q29tbW9uQ29yZUZuVmFsaWRhdGUsXG5cdEhleCxcblx0SGV4Q29tcG9uZW50LFxuXHRIZXhTZXQsXG5cdEhleFVuYnJhbmRlZCxcblx0SGV4VmFsdWUsXG5cdEhleFZhbHVlU3RyaW5nLFxuXHRIU0wsXG5cdEhTTFVuYnJhbmRlZCxcblx0SFNMVmFsdWUsXG5cdEhTTFZhbHVlU3RyaW5nLFxuXHRIU1YsXG5cdEhTVlVuYnJhbmRlZCxcblx0SFNWVmFsdWUsXG5cdEhTVlZhbHVlU3RyaW5nLFxuXHRMQUIsXG5cdExBQlVuYnJhbmRlZCxcblx0TEFCVmFsdWUsXG5cdExBQlZhbHVlU3RyaW5nLFxuXHRMQUJfTCxcblx0TEFCX0EsXG5cdExBQl9CLFxuXHROdW1lcmljUmFuZ2VLZXksXG5cdFBlcmNlbnRpbGUsXG5cdFJhZGlhbCxcblx0UmFuZ2VLZXlNYXAsXG5cdFJHQixcblx0UkdCVW5icmFuZGVkLFxuXHRSR0JWYWx1ZSxcblx0UkdCVmFsdWVTdHJpbmcsXG5cdFNMLFxuXHRTTFVuYnJhbmRlZCxcblx0U0xWYWx1ZSxcblx0U1YsXG5cdFNWVW5icmFuZGVkLFxuXHRTVlZhbHVlLFxuXHRYWVosXG5cdFhZWlVuYnJhbmRlZCxcblx0WFlaVmFsdWUsXG5cdFhZWlZhbHVlU3RyaW5nLFxuXHRYWVpfWCxcblx0WFlaX1ksXG5cdFhZWl9aXG59IGZyb20gJy4uLy4uL2luZGV4L2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi8uLi9kYXRhL2luZGV4LmpzJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uLy4uL2NsYXNzZXMvbG9nZ2VyL2luZGV4LmpzJztcblxuY29uc3QgbG9nTW9kZSA9IGRhdGEubW9kZS5sb2dnaW5nO1xuY29uc3QgZGVmYXVsdENvbG9ycyA9IGRhdGEuZGVmYXVsdHMuY29sb3JzO1xuY29uc3QgbW9kZSA9IGRhdGEubW9kZTtcbmNvbnN0IF9zZXRzID0gZGF0YS5zZXRzO1xuXG5mdW5jdGlvbiBjbGFtcFRvUmFuZ2UodmFsdWU6IG51bWJlciwgcmFuZ2VLZXk6IE51bWVyaWNSYW5nZUtleSk6IG51bWJlciB7XG5cdGNvbnN0IFttaW4sIG1heF0gPSBfc2V0c1tyYW5nZUtleV07XG5cblx0cmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCBtaW4pLCBtYXgpO1xufVxuXG5mdW5jdGlvbiBjbG9uZTxUPih2YWx1ZTogVCk6IFQge1xuXHRyZXR1cm4gc3RydWN0dXJlZENsb25lKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gZGVib3VuY2U8VCBleHRlbmRzICguLi5hcmdzOiBQYXJhbWV0ZXJzPFQ+KSA9PiB2b2lkPihcblx0ZnVuYzogVCxcblx0ZGVsYXk6IG51bWJlclxuKSB7XG5cdGxldCB0aW1lb3V0OiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuXG5cdHJldHVybiAoLi4uYXJnczogUGFyYW1ldGVyczxUPik6IHZvaWQgPT4ge1xuXHRcdGlmICh0aW1lb3V0KSBjbGVhclRpbWVvdXQodGltZW91dCk7XG5cblx0XHR0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRmdW5jKC4uLmFyZ3MpO1xuXHRcdH0sIGRlbGF5KTtcblx0fTtcbn1cblxuZnVuY3Rpb24gcGFyc2VDdXN0b21Db2xvcihyYXdWYWx1ZTogc3RyaW5nKTogSFNMIHwgbnVsbCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFtb2RlLnF1aWV0KVxuXHRcdFx0bG9nLmluZm8oYFBhcnNpbmcgY3VzdG9tIGNvbG9yOiAke0pTT04uc3RyaW5naWZ5KHJhd1ZhbHVlKX1gKTtcblxuXHRcdGNvbnN0IG1hdGNoID0gcmF3VmFsdWUubWF0Y2goXG5cdFx0XHQvaHNsXFwoKFxcZCspLFxccyooXFxkKyklPyxcXHMqKFxcZCspJT8sXFxzKihcXGQqXFwuP1xcZCspXFwpL1xuXHRcdCk7XG5cblx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdGNvbnN0IFssIGh1ZSwgc2F0dXJhdGlvbiwgbGlnaHRuZXNzLCBhbHBoYV0gPSBtYXRjaDtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKHBhcnNlSW50KGh1ZSkpLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUludChzYXR1cmF0aW9uKSksXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VJbnQobGlnaHRuZXNzKSksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShwYXJzZUZsb2F0KGFscGhhKSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdFx0J0ludmFsaWQgSFNMIGN1c3RvbSBjb2xvci4gRXhwZWN0ZWQgZm9ybWF0OiBoc2woSCwgUyUsIEwlLCBBKSdcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9ycykgbG9nLmVycm9yKGBwYXJzZUN1c3RvbUNvbG9yIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGJhc2U6IENvbW1vbkNvcmVGbkJhc2UgPSB7XG5cdGNsYW1wVG9SYW5nZSxcblx0Y2xvbmUsXG5cdGRlYm91bmNlLFxuXHRwYXJzZUN1c3RvbUNvbG9yXG59IGFzIGNvbnN0O1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDIgKioqKioqKipcblxuZnVuY3Rpb24gYXNBbHBoYVJhbmdlKHZhbHVlOiBudW1iZXIpOiBBbHBoYVJhbmdlIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdBbHBoYVJhbmdlJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIEFscGhhUmFuZ2U7XG59XG5cbmZ1bmN0aW9uIGFzQnJhbmRlZDxUIGV4dGVuZHMga2V5b2YgUmFuZ2VLZXlNYXA+KFxuXHR2YWx1ZTogbnVtYmVyLFxuXHRyYW5nZUtleTogVFxuKTogUmFuZ2VLZXlNYXBbVF0ge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgcmFuZ2VLZXkpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBSYW5nZUtleU1hcFtUXTtcbn1cblxuZnVuY3Rpb24gYXNCeXRlUmFuZ2UodmFsdWU6IG51bWJlcik6IEJ5dGVSYW5nZSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnQnl0ZVJhbmdlJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIEJ5dGVSYW5nZTtcbn1cblxuZnVuY3Rpb24gYXNIZXhDb21wb25lbnQodmFsdWU6IHN0cmluZyk6IEhleENvbXBvbmVudCB7XG5cdGlmICghdmFsaWRhdGUuaGV4Q29tcG9uZW50KHZhbHVlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBIZXhDb21wb25lbnQgdmFsdWU6ICR7dmFsdWV9YCk7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWUgYXMgdW5rbm93biBhcyBIZXhDb21wb25lbnQ7XG59XG5cbmZ1bmN0aW9uIGFzSGV4U2V0KHZhbHVlOiBzdHJpbmcpOiBIZXhTZXQge1xuXHRpZiAoL14jWzAtOWEtZkEtRl17OH0kLy50ZXN0KHZhbHVlKSkge1xuXHRcdHZhbHVlID0gdmFsdWUuc2xpY2UoMCwgNyk7XG5cdH1cblx0aWYgKCF2YWxpZGF0ZS5oZXhTZXQodmFsdWUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIEhleFNldCB2YWx1ZTogJHt2YWx1ZX1gKTtcblx0fVxuXHRyZXR1cm4gdmFsdWUgYXMgSGV4U2V0O1xufVxuXG5mdW5jdGlvbiBhc0xBQl9MKHZhbHVlOiBudW1iZXIpOiBMQUJfTCB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnTEFCX0wnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgTEFCX0w7XG59XG5cbmZ1bmN0aW9uIGFzTEFCX0EodmFsdWU6IG51bWJlcik6IExBQl9BIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdMQUJfQScpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBMQUJfQTtcbn1cblxuZnVuY3Rpb24gYXNMQUJfQih2YWx1ZTogbnVtYmVyKTogTEFCX0Ige1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ0xBQl9CJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIExBQl9CO1xufVxuXG5mdW5jdGlvbiBhc1BlcmNlbnRpbGUodmFsdWU6IG51bWJlcik6IFBlcmNlbnRpbGUge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ1BlcmNlbnRpbGUnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgUGVyY2VudGlsZTtcbn1cblxuZnVuY3Rpb24gYXNSYWRpYWwodmFsdWU6IG51bWJlcik6IFJhZGlhbCB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnUmFkaWFsJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIFJhZGlhbDtcbn1cblxuZnVuY3Rpb24gYXNYWVpfWCh2YWx1ZTogbnVtYmVyKTogWFlaX1gge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ1hZWl9YJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIFhZWl9YO1xufVxuXG5mdW5jdGlvbiBhc1hZWl9ZKHZhbHVlOiBudW1iZXIpOiBYWVpfWSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnWFlaX1knKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgWFlaX1k7XG59XG5cbmZ1bmN0aW9uIGFzWFlaX1oodmFsdWU6IG51bWJlcik6IFhZWl9aIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdYWVpfWicpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBYWVpfWjtcbn1cblxuZXhwb3J0IGNvbnN0IGJyYW5kOiBDb21tb25Db3JlRm5CcmFuZCA9IHtcblx0YXNBbHBoYVJhbmdlLFxuXHRhc0JyYW5kZWQsXG5cdGFzQnl0ZVJhbmdlLFxuXHRhc0hleENvbXBvbmVudCxcblx0YXNIZXhTZXQsXG5cdGFzTEFCX0wsXG5cdGFzTEFCX0EsXG5cdGFzTEFCX0IsXG5cdGFzUGVyY2VudGlsZSxcblx0YXNSYWRpYWwsXG5cdGFzWFlaX1gsXG5cdGFzWFlaX1ksXG5cdGFzWFlaX1pcbn07XG5cbi8vICoqKioqKioqIFNFQ1RJT04gMiAtIEJyYW5kIENvbG9yICoqKioqKioqXG5cbmZ1bmN0aW9uIGFzQ01ZSyhjb2xvcjogQ01ZS1VuYnJhbmRlZCk6IENNWUsge1xuXHRjb25zdCBicmFuZGVkQ3lhbiA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5jeWFuKTtcblx0Y29uc3QgYnJhbmRlZE1hZ2VudGEgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUubWFnZW50YSk7XG5cdGNvbnN0IGJyYW5kZWRZZWxsb3cgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUueWVsbG93KTtcblx0Y29uc3QgYnJhbmRlZEtleSA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5rZXkpO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdGN5YW46IGJyYW5kZWRDeWFuLFxuXHRcdFx0bWFnZW50YTogYnJhbmRlZE1hZ2VudGEsXG5cdFx0XHR5ZWxsb3c6IGJyYW5kZWRZZWxsb3csXG5cdFx0XHRrZXk6IGJyYW5kZWRLZXksXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc0hleChjb2xvcjogSGV4VW5icmFuZGVkKTogSGV4IHtcblx0bGV0IGhleCA9IGNvbG9yLnZhbHVlLmhleDtcblxuXHRpZiAoIWhleC5zdGFydHNXaXRoKCcjJykpIGhleCA9IGAjJHtoZXh9YDtcblxuXHRpZiAoIS9eI1swLTlBLUZhLWZdezh9JC8udGVzdChoZXgpKVxuXHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBIZXggY29sb3IgZm9ybWF0OiAke2hleH1gKTtcblxuXHRjb25zdCBoZXhNYWluID0gaGV4LnNsaWNlKDAsIDcpO1xuXHRjb25zdCBhbHBoYSA9IGhleC5zbGljZSg3LCA5KTtcblxuXHRjb25zdCBicmFuZGVkSGV4ID0gYnJhbmQuYXNIZXhTZXQoaGV4TWFpbik7XG5cdGNvbnN0IGJyYW5kZWRIZXhBbHBoYSA9IGJyYW5kLmFzSGV4Q29tcG9uZW50KGFscGhhKTtcblx0Y29uc3QgYnJhbmRlZE51bUFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLm51bUFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRoZXg6IGJyYW5kZWRIZXgsXG5cdFx0XHRhbHBoYTogYnJhbmRlZEhleEFscGhhLFxuXHRcdFx0bnVtQWxwaGE6IGJyYW5kZWROdW1BbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnaGV4J1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc0hTTChjb2xvcjogSFNMVW5icmFuZGVkKTogSFNMIHtcblx0Y29uc3QgYnJhbmRlZEh1ZSA9IGJyYW5kLmFzUmFkaWFsKGNvbG9yLnZhbHVlLmh1ZSk7XG5cdGNvbnN0IGJyYW5kZWRTYXR1cmF0aW9uID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnNhdHVyYXRpb24pO1xuXHRjb25zdCBicmFuZGVkTGlnaHRuZXNzID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLmxpZ2h0bmVzcyk7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0aHVlOiBicmFuZGVkSHVlLFxuXHRcdFx0c2F0dXJhdGlvbjogYnJhbmRlZFNhdHVyYXRpb24sXG5cdFx0XHRsaWdodG5lc3M6IGJyYW5kZWRMaWdodG5lc3MsXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdoc2wnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzSFNWKGNvbG9yOiBIU1ZVbmJyYW5kZWQpOiBIU1Yge1xuXHRjb25zdCBicmFuZGVkSHVlID0gYnJhbmQuYXNSYWRpYWwoY29sb3IudmFsdWUuaHVlKTtcblx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUuc2F0dXJhdGlvbik7XG5cdGNvbnN0IGJyYW5kZWRWYWx1ZSA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS52YWx1ZSk7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0aHVlOiBicmFuZGVkSHVlLFxuXHRcdFx0c2F0dXJhdGlvbjogYnJhbmRlZFNhdHVyYXRpb24sXG5cdFx0XHR2YWx1ZTogYnJhbmRlZFZhbHVlLFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnaHN2J1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc0xBQihjb2xvcjogTEFCVW5icmFuZGVkKTogTEFCIHtcblx0Y29uc3QgYnJhbmRlZEwgPSBicmFuZC5hc0xBQl9MKGNvbG9yLnZhbHVlLmwpO1xuXHRjb25zdCBicmFuZGVkQSA9IGJyYW5kLmFzTEFCX0EoY29sb3IudmFsdWUuYSk7XG5cdGNvbnN0IGJyYW5kZWRCID0gYnJhbmQuYXNMQUJfQihjb2xvci52YWx1ZS5iKTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRsOiBicmFuZGVkTCxcblx0XHRcdGE6IGJyYW5kZWRBLFxuXHRcdFx0YjogYnJhbmRlZEIsXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdsYWInXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzUkdCKGNvbG9yOiBSR0JVbmJyYW5kZWQpOiBSR0Ige1xuXHRjb25zdCBicmFuZGVkUmVkID0gYnJhbmQuYXNCeXRlUmFuZ2UoY29sb3IudmFsdWUucmVkKTtcblx0Y29uc3QgYnJhbmRlZEdyZWVuID0gYnJhbmQuYXNCeXRlUmFuZ2UoY29sb3IudmFsdWUuZ3JlZW4pO1xuXHRjb25zdCBicmFuZGVkQmx1ZSA9IGJyYW5kLmFzQnl0ZVJhbmdlKGNvbG9yLnZhbHVlLmJsdWUpO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdHJlZDogYnJhbmRlZFJlZCxcblx0XHRcdGdyZWVuOiBicmFuZGVkR3JlZW4sXG5cdFx0XHRibHVlOiBicmFuZGVkQmx1ZSxcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ3JnYidcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNTTChjb2xvcjogU0xVbmJyYW5kZWQpOiBTTCB7XG5cdGNvbnN0IGJyYW5kZWRTYXR1cmF0aW9uID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnNhdHVyYXRpb24pO1xuXHRjb25zdCBicmFuZGVkTGlnaHRuZXNzID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLmxpZ2h0bmVzcyk7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0c2F0dXJhdGlvbjogYnJhbmRlZFNhdHVyYXRpb24sXG5cdFx0XHRsaWdodG5lc3M6IGJyYW5kZWRMaWdodG5lc3MsXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdzbCdcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNTVihjb2xvcjogU1ZVbmJyYW5kZWQpOiBTViB7XG5cdGNvbnN0IGJyYW5kZWRTYXR1cmF0aW9uID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnNhdHVyYXRpb24pO1xuXHRjb25zdCBicmFuZGVkVmFsdWUgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUudmFsdWUpO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdHNhdHVyYXRpb246IGJyYW5kZWRTYXR1cmF0aW9uLFxuXHRcdFx0dmFsdWU6IGJyYW5kZWRWYWx1ZSxcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ3N2J1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc1hZWihjb2xvcjogWFlaVW5icmFuZGVkKTogWFlaIHtcblx0Y29uc3QgYnJhbmRlZFggPSBicmFuZC5hc1hZWl9YKGNvbG9yLnZhbHVlLngpO1xuXHRjb25zdCBicmFuZGVkWSA9IGJyYW5kLmFzWFlaX1koY29sb3IudmFsdWUueSk7XG5cdGNvbnN0IGJyYW5kZWRaID0gYnJhbmQuYXNYWVpfWihjb2xvci52YWx1ZS56KTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHR4OiBicmFuZGVkWCxcblx0XHRcdHk6IGJyYW5kZWRZLFxuXHRcdFx0ejogYnJhbmRlZFosXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICd4eXonXG5cdH07XG59XG5cbmV4cG9ydCBjb25zdCBicmFuZENvbG9yOiBDb21tb25Db3JlRm5CcmFuZENvbG9yID0ge1xuXHRhc0NNWUssXG5cdGFzSGV4LFxuXHRhc0hTTCxcblx0YXNIU1YsXG5cdGFzTEFCLFxuXHRhc1JHQixcblx0YXNTTCxcblx0YXNTVixcblx0YXNYWVpcbn07XG5cbi8vICoqKioqKioqIFNFQ1RJT04gMyAtIENvbnZlcnQgKioqKioqKipcblxuZnVuY3Rpb24gY215a1N0cmluZ1RvVmFsdWUoY215azogQ01ZS1ZhbHVlU3RyaW5nKTogQ01ZS1ZhbHVlIHtcblx0cmV0dXJuIHtcblx0XHRjeWFuOiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VGbG9hdChjbXlrLmN5YW4pIC8gMTAwKSxcblx0XHRtYWdlbnRhOiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VGbG9hdChjbXlrLm1hZ2VudGEpIC8gMTAwKSxcblx0XHR5ZWxsb3c6IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUZsb2F0KGNteWsueWVsbG93KSAvIDEwMCksXG5cdFx0a2V5OiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VGbG9hdChjbXlrLmtleSkgLyAxMDApLFxuXHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UocGFyc2VGbG9hdChjbXlrLmFscGhhKSlcblx0fTtcbn1cblxuZnVuY3Rpb24gY215a1ZhbHVlVG9TdHJpbmcoY215azogQ01ZS1ZhbHVlKTogQ01ZS1ZhbHVlU3RyaW5nIHtcblx0cmV0dXJuIHtcblx0XHRjeWFuOiBgJHtjbXlrLmN5YW4gKiAxMDB9JWAsXG5cdFx0bWFnZW50YTogYCR7Y215ay5tYWdlbnRhICogMTAwfSVgLFxuXHRcdHllbGxvdzogYCR7Y215ay55ZWxsb3cgKiAxMDB9JWAsXG5cdFx0a2V5OiBgJHtjbXlrLmtleSAqIDEwMH0lYCxcblx0XHRhbHBoYTogYCR7Y215ay5hbHBoYX1gXG5cdH07XG59XG5cbmZ1bmN0aW9uIGhleEFscGhhVG9OdW1lcmljQWxwaGEoaGV4QWxwaGE6IHN0cmluZyk6IG51bWJlciB7XG5cdHJldHVybiBwYXJzZUludChoZXhBbHBoYSwgMTYpIC8gMjU1O1xufVxuXG5mdW5jdGlvbiBoZXhTdHJpbmdUb1ZhbHVlKGhleDogSGV4VmFsdWVTdHJpbmcpOiBIZXhWYWx1ZSB7XG5cdHJldHVybiB7XG5cdFx0aGV4OiBicmFuZC5hc0hleFNldChoZXguaGV4KSxcblx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoaGV4LmFscGhhKSxcblx0XHRudW1BbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKHBhcnNlRmxvYXQoaGV4Lm51bUFscGhhKSlcblx0fTtcbn1cblxuZnVuY3Rpb24gaGV4VmFsdWVUb1N0cmluZyhoZXg6IEhleFZhbHVlKTogSGV4VmFsdWVTdHJpbmcge1xuXHRyZXR1cm4ge1xuXHRcdGhleDogaGV4LmhleCxcblx0XHRhbHBoYTogYCR7aGV4LmFscGhhfWAsXG5cdFx0bnVtQWxwaGE6IGAke2hleC5udW1BbHBoYX1gXG5cdH07XG59XG5cbmZ1bmN0aW9uIGhzbFN0cmluZ1RvVmFsdWUoaHNsOiBIU0xWYWx1ZVN0cmluZyk6IEhTTFZhbHVlIHtcblx0cmV0dXJuIHtcblx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKHBhcnNlRmxvYXQoaHNsLmh1ZSkpLFxuXHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUZsb2F0KGhzbC5zYXR1cmF0aW9uKSAvIDEwMCksXG5cdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VGbG9hdChoc2wubGlnaHRuZXNzKSAvIDEwMCksXG5cdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShwYXJzZUZsb2F0KGhzbC5hbHBoYSkpXG5cdH07XG59XG5cbmZ1bmN0aW9uIGhzbFZhbHVlVG9TdHJpbmcoaHNsOiBIU0xWYWx1ZSk6IEhTTFZhbHVlU3RyaW5nIHtcblx0cmV0dXJuIHtcblx0XHRodWU6IGAke2hzbC5odWV9wrBgLFxuXHRcdHNhdHVyYXRpb246IGAke2hzbC5zYXR1cmF0aW9uICogMTAwfSVgLFxuXHRcdGxpZ2h0bmVzczogYCR7aHNsLmxpZ2h0bmVzcyAqIDEwMH0lYCxcblx0XHRhbHBoYTogYCR7aHNsLmFscGhhfWBcblx0fTtcbn1cblxuZnVuY3Rpb24gaHN2U3RyaW5nVG9WYWx1ZShoc3Y6IEhTVlZhbHVlU3RyaW5nKTogSFNWVmFsdWUge1xuXHRyZXR1cm4ge1xuXHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwocGFyc2VGbG9hdChoc3YuaHVlKSksXG5cdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoaHN2LnNhdHVyYXRpb24pIC8gMTAwKSxcblx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoaHN2LnZhbHVlKSAvIDEwMCksXG5cdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShwYXJzZUZsb2F0KGhzdi5hbHBoYSkpXG5cdH07XG59XG5cbmZ1bmN0aW9uIGhzdlZhbHVlVG9TdHJpbmcoaHN2OiBIU1ZWYWx1ZSk6IEhTVlZhbHVlU3RyaW5nIHtcblx0cmV0dXJuIHtcblx0XHRodWU6IGAke2hzdi5odWV9wrBgLFxuXHRcdHNhdHVyYXRpb246IGAke2hzdi5zYXR1cmF0aW9uICogMTAwfSVgLFxuXHRcdHZhbHVlOiBgJHtoc3YudmFsdWUgKiAxMDB9JWAsXG5cdFx0YWxwaGE6IGAke2hzdi5hbHBoYX1gXG5cdH07XG59XG5cbmZ1bmN0aW9uIGxhYlZhbHVlVG9TdHJpbmcobGFiOiBMQUJWYWx1ZSk6IExBQlZhbHVlU3RyaW5nIHtcblx0cmV0dXJuIHtcblx0XHRsOiBgJHtsYWIubH1gLFxuXHRcdGE6IGAke2xhYi5hfWAsXG5cdFx0YjogYCR7bGFiLmJ9YCxcblx0XHRhbHBoYTogYCR7bGFiLmFscGhhfWBcblx0fTtcbn1cblxuZnVuY3Rpb24gbGFiU3RyaW5nVG9WYWx1ZShsYWI6IExBQlZhbHVlU3RyaW5nKTogTEFCVmFsdWUge1xuXHRyZXR1cm4ge1xuXHRcdGw6IGJyYW5kLmFzTEFCX0wocGFyc2VGbG9hdChsYWIubCkpLFxuXHRcdGE6IGJyYW5kLmFzTEFCX0EocGFyc2VGbG9hdChsYWIuYSkpLFxuXHRcdGI6IGJyYW5kLmFzTEFCX0IocGFyc2VGbG9hdChsYWIuYikpLFxuXHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UocGFyc2VGbG9hdChsYWIuYWxwaGEpKVxuXHR9O1xufVxuXG5mdW5jdGlvbiByZ2JWYWx1ZVRvU3RyaW5nKHJnYjogUkdCVmFsdWUpOiBSR0JWYWx1ZVN0cmluZyB7XG5cdHJldHVybiB7XG5cdFx0cmVkOiBgJHtyZ2IucmVkfWAsXG5cdFx0Z3JlZW46IGAke3JnYi5ncmVlbn1gLFxuXHRcdGJsdWU6IGAke3JnYi5ibHVlfWAsXG5cdFx0YWxwaGE6IGAke3JnYi5hbHBoYX1gXG5cdH07XG59XG5cbmZ1bmN0aW9uIHJnYlN0cmluZ1RvVmFsdWUocmdiOiBSR0JWYWx1ZVN0cmluZyk6IFJHQlZhbHVlIHtcblx0cmV0dXJuIHtcblx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKHBhcnNlRmxvYXQocmdiLnJlZCkpLFxuXHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZShwYXJzZUZsb2F0KHJnYi5ncmVlbikpLFxuXHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKHBhcnNlRmxvYXQocmdiLmJsdWUpKSxcblx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKHBhcnNlRmxvYXQocmdiLmFscGhhKSlcblx0fTtcbn1cblxuZnVuY3Rpb24gdG9Db2xvcihjb2xvclN0cmluZzogQ29sb3JTdHJpbmcpOiBDb2xvciB7XG5cdGNvbnN0IGNsb25lZENvbG9yID0gY2xvbmUoY29sb3JTdHJpbmcpO1xuXG5cdGNvbnN0IHBhcnNlVmFsdWUgPSAodmFsdWU6IHN0cmluZyB8IG51bWJlcik6IG51bWJlciA9PlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuZW5kc1dpdGgoJyUnKVxuXHRcdFx0PyBwYXJzZUZsb2F0KHZhbHVlLnNsaWNlKDAsIC0xKSlcblx0XHRcdDogTnVtYmVyKHZhbHVlKTtcblxuXHRjb25zdCBuZXdWYWx1ZSA9IE9iamVjdC5lbnRyaWVzKGNsb25lZENvbG9yLnZhbHVlKS5yZWR1Y2UoXG5cdFx0KGFjYywgW2tleSwgdmFsXSkgPT4ge1xuXHRcdFx0YWNjW2tleSBhcyBrZXlvZiAodHlwZW9mIGNsb25lZENvbG9yKVsndmFsdWUnXV0gPSBwYXJzZVZhbHVlKFxuXHRcdFx0XHR2YWxcblx0XHRcdCkgYXMgbmV2ZXI7XG5cdFx0XHRyZXR1cm4gYWNjO1xuXHRcdH0sXG5cdFx0e30gYXMgUmVjb3JkPGtleW9mICh0eXBlb2YgY2xvbmVkQ29sb3IpWyd2YWx1ZSddLCBudW1iZXI+XG5cdCk7XG5cblx0c3dpdGNoIChjbG9uZWRDb2xvci5mb3JtYXQpIHtcblx0XHRjYXNlICdjbXlrJzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ2NteWsnLCB2YWx1ZTogbmV3VmFsdWUgYXMgQ01ZS1ZhbHVlIH07XG5cdFx0Y2FzZSAnaHNsJzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ2hzbCcsIHZhbHVlOiBuZXdWYWx1ZSBhcyBIU0xWYWx1ZSB9O1xuXHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdoc3YnLCB2YWx1ZTogbmV3VmFsdWUgYXMgSFNWVmFsdWUgfTtcblx0XHRjYXNlICdzbCc6XG5cdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdzbCcsIHZhbHVlOiBuZXdWYWx1ZSBhcyBTTFZhbHVlIH07XG5cdFx0Y2FzZSAnc3YnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnc3YnLCB2YWx1ZTogbmV3VmFsdWUgYXMgU1ZWYWx1ZSB9O1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdGxvZy5lcnJvcignVW5zdXBwb3J0ZWQgZm9ybWF0IGZvciBjb2xvclN0cmluZ1RvQ29sb3InKTtcblxuXHRcdFx0Y29uc3QgdW5icmFuZGVkSFNMID0gZGVmYXVsdENvbG9ycy5oc2w7XG5cblx0XHRcdGNvbnN0IGJyYW5kZWRIdWUgPSBicmFuZC5hc1JhZGlhbCh1bmJyYW5kZWRIU0wudmFsdWUuaHVlKTtcblx0XHRcdGNvbnN0IGJyYW5kZWRTYXR1cmF0aW9uID0gYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHR1bmJyYW5kZWRIU0wudmFsdWUuc2F0dXJhdGlvblxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IGJyYW5kZWRMaWdodG5lc3MgPSBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdHVuYnJhbmRlZEhTTC52YWx1ZS5saWdodG5lc3Ncblx0XHRcdCk7XG5cdFx0XHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UodW5icmFuZGVkSFNMLnZhbHVlLmFscGhhKTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IGJyYW5kZWRIdWUsXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmRlZFNhdHVyYXRpb24sXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZGVkTGlnaHRuZXNzLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fTtcblx0fVxufVxuXG5mdW5jdGlvbiB0b0NvbG9yVmFsdWVSYW5nZTxUIGV4dGVuZHMga2V5b2YgUmFuZ2VLZXlNYXA+KFxuXHR2YWx1ZTogc3RyaW5nIHwgbnVtYmVyLFxuXHRyYW5nZUtleTogVFxuKTogUmFuZ2VLZXlNYXBbVF0ge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgcmFuZ2VLZXkpO1xuXG5cdGlmIChyYW5nZUtleSA9PT0gJ0hleFNldCcpIHtcblx0XHRyZXR1cm4gYnJhbmQuYXNIZXhTZXQodmFsdWUgYXMgc3RyaW5nKSBhcyB1bmtub3duIGFzIFJhbmdlS2V5TWFwW1RdO1xuXHR9XG5cblx0aWYgKHJhbmdlS2V5ID09PSAnSGV4Q29tcG9uZW50Jykge1xuXHRcdHJldHVybiBicmFuZC5hc0hleENvbXBvbmVudChcblx0XHRcdHZhbHVlIGFzIHN0cmluZ1xuXHRcdCkgYXMgdW5rbm93biBhcyBSYW5nZUtleU1hcFtUXTtcblx0fVxuXG5cdHJldHVybiBicmFuZC5hc0JyYW5kZWQoXG5cdFx0dmFsdWUgYXMgbnVtYmVyLFxuXHRcdHJhbmdlS2V5XG5cdCkgYXMgdW5rbm93biBhcyBSYW5nZUtleU1hcFtUXTtcbn1cblxuZnVuY3Rpb24gdG9DU1NDb2xvclN0cmluZyhjb2xvcjogQ29sb3IpOiBzdHJpbmcge1xuXHR0cnkge1xuXHRcdHN3aXRjaCAoY29sb3IuZm9ybWF0KSB7XG5cdFx0XHRjYXNlICdjbXlrJzpcblx0XHRcdFx0cmV0dXJuIGBjbXlrKCR7Y29sb3IudmFsdWUuY3lhbn0sICR7Y29sb3IudmFsdWUubWFnZW50YX0sICR7Y29sb3IudmFsdWUueWVsbG93fSwgJHtjb2xvci52YWx1ZS5rZXl9LCAke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0cmV0dXJuIFN0cmluZyhjb2xvci52YWx1ZS5oZXgpO1xuXHRcdFx0Y2FzZSAnaHNsJzpcblx0XHRcdFx0cmV0dXJuIGBoc2woJHtjb2xvci52YWx1ZS5odWV9LCAke2NvbG9yLnZhbHVlLnNhdHVyYXRpb259JSwgJHtjb2xvci52YWx1ZS5saWdodG5lc3N9JSwgJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdHJldHVybiBgaHN2KCR7Y29sb3IudmFsdWUuaHVlfSwgJHtjb2xvci52YWx1ZS5zYXR1cmF0aW9ufSUsICR7Y29sb3IudmFsdWUudmFsdWV9JSwgJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBgbGFiKCR7Y29sb3IudmFsdWUubH0sICR7Y29sb3IudmFsdWUuYX0sICR7Y29sb3IudmFsdWUuYn0sICR7Y29sb3IudmFsdWUuYWxwaGF9KWA7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gYHJnYigke2NvbG9yLnZhbHVlLnJlZH0sICR7Y29sb3IudmFsdWUuZ3JlZW59LCAke2NvbG9yLnZhbHVlLmJsdWV9LCAke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIGB4eXooJHtjb2xvci52YWx1ZS54fSwgJHtjb2xvci52YWx1ZS55fSwgJHtjb2xvci52YWx1ZS56fSwgJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdFx0XHRsb2cuZXJyb3IoYFVuZXhwZWN0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yLmZvcm1hdH1gKTtcblxuXHRcdFx0XHRyZXR1cm4gJyNGRkZGRkZGRic7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgZ2V0Q1NTQ29sb3JTdHJpbmcgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24geHl6VmFsdWVUb1N0cmluZyh4eXo6IFhZWlZhbHVlKTogWFlaVmFsdWVTdHJpbmcge1xuXHRyZXR1cm4ge1xuXHRcdHg6IGAke3h5ei54fWAsXG5cdFx0eTogYCR7eHl6Lnl9YCxcblx0XHR6OiBgJHt4eXouen1gLFxuXHRcdGFscGhhOiBgJHt4eXouYWxwaGF9YFxuXHR9O1xufVxuXG5mdW5jdGlvbiB4eXpTdHJpbmdUb1ZhbHVlKHh5ejogWFlaVmFsdWVTdHJpbmcpOiBYWVpWYWx1ZSB7XG5cdHJldHVybiB7XG5cdFx0eDogYnJhbmQuYXNYWVpfWChwYXJzZUZsb2F0KHh5ei54KSksXG5cdFx0eTogYnJhbmQuYXNYWVpfWShwYXJzZUZsb2F0KHh5ei55KSksXG5cdFx0ejogYnJhbmQuYXNYWVpfWihwYXJzZUZsb2F0KHh5ei56KSksXG5cdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShwYXJzZUZsb2F0KHh5ei5hbHBoYSkpXG5cdH07XG59XG5cbmNvbnN0IHN0cmluZ1RvVmFsdWUgPSB7XG5cdGNteWs6IGNteWtTdHJpbmdUb1ZhbHVlLFxuXHRoZXg6IGhleFN0cmluZ1RvVmFsdWUsXG5cdGhzbDogaHNsU3RyaW5nVG9WYWx1ZSxcblx0aHN2OiBoc3ZTdHJpbmdUb1ZhbHVlLFxuXHRsYWI6IGxhYlN0cmluZ1RvVmFsdWUsXG5cdHJnYjogcmdiU3RyaW5nVG9WYWx1ZSxcblx0eHl6OiB4eXpTdHJpbmdUb1ZhbHVlXG59O1xuXG5jb25zdCB2YWx1ZVRvU3RyaW5nID0ge1xuXHRjbXlrOiBjbXlrVmFsdWVUb1N0cmluZyxcblx0aGV4OiBoZXhWYWx1ZVRvU3RyaW5nLFxuXHRoc2w6IGhzbFZhbHVlVG9TdHJpbmcsXG5cdGhzdjogaHN2VmFsdWVUb1N0cmluZyxcblx0bGFiOiBsYWJWYWx1ZVRvU3RyaW5nLFxuXHRyZ2I6IHJnYlZhbHVlVG9TdHJpbmcsXG5cdHh5ejogeHl6VmFsdWVUb1N0cmluZ1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbnZlcnQ6IENvbW1vbkNvcmVGbkNvbnZlcnQgPSB7XG5cdGhleEFscGhhVG9OdW1lcmljQWxwaGEsXG5cdHN0cmluZ1RvVmFsdWUsXG5cdHRvQ29sb3IsXG5cdHRvQ29sb3JWYWx1ZVJhbmdlLFxuXHR0b0NTU0NvbG9yU3RyaW5nLFxuXHR2YWx1ZVRvU3RyaW5nXG59O1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDQgLSBHdWFyZHMgKioqKioqKipcblxuZnVuY3Rpb24gaXNDb2xvcih2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENvbG9yIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuXHRjb25zdCBjb2xvciA9IHZhbHVlIGFzIENvbG9yO1xuXHRjb25zdCB2YWxpZEZvcm1hdHM6IENvbG9yWydmb3JtYXQnXVtdID0gW1xuXHRcdCdjbXlrJyxcblx0XHQnaGV4Jyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnbGFiJyxcblx0XHQncmdiJyxcblx0XHQnc2wnLFxuXHRcdCdzdicsXG5cdFx0J3h5eidcblx0XTtcblxuXHRyZXR1cm4gKFxuXHRcdCd2YWx1ZScgaW4gY29sb3IgJiZcblx0XHQnZm9ybWF0JyBpbiBjb2xvciAmJlxuXHRcdHZhbGlkRm9ybWF0cy5pbmNsdWRlcyhjb2xvci5mb3JtYXQpXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzQ29sb3JTcGFjZSh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENvbG9yU3BhY2Uge1xuXHRjb25zdCB2YWxpZENvbG9yU3BhY2VzOiBDb2xvclNwYWNlW10gPSBbXG5cdFx0J2NteWsnLFxuXHRcdCdoZXgnLFxuXHRcdCdoc2wnLFxuXHRcdCdoc3YnLFxuXHRcdCdsYWInLFxuXHRcdCdyZ2InLFxuXHRcdCd4eXonXG5cdF07XG5cblx0cmV0dXJuIChcblx0XHR0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmXG5cdFx0dmFsaWRDb2xvclNwYWNlcy5pbmNsdWRlcyh2YWx1ZSBhcyBDb2xvclNwYWNlKVxuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0NvbG9yU3RyaW5nKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQ29sb3JTdHJpbmcge1xuXHRpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fCB2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG5cdGNvbnN0IGNvbG9yU3RyaW5nID0gdmFsdWUgYXMgQ29sb3JTdHJpbmc7XG5cdGNvbnN0IHZhbGlkU3RyaW5nRm9ybWF0czogQ29sb3JTdHJpbmdbJ2Zvcm1hdCddW10gPSBbXG5cdFx0J2NteWsnLFxuXHRcdCdoc2wnLFxuXHRcdCdoc3YnLFxuXHRcdCdzbCcsXG5cdFx0J3N2J1xuXHRdO1xuXG5cdHJldHVybiAoXG5cdFx0J3ZhbHVlJyBpbiBjb2xvclN0cmluZyAmJlxuXHRcdCdmb3JtYXQnIGluIGNvbG9yU3RyaW5nICYmXG5cdFx0dmFsaWRTdHJpbmdGb3JtYXRzLmluY2x1ZGVzKGNvbG9yU3RyaW5nLmZvcm1hdClcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNJblJhbmdlPFQgZXh0ZW5kcyBrZXlvZiB0eXBlb2YgX3NldHM+KFxuXHR2YWx1ZTogbnVtYmVyIHwgc3RyaW5nLFxuXHRyYW5nZUtleTogVFxuKTogYm9vbGVhbiB7XG5cdGlmIChyYW5nZUtleSA9PT0gJ0hleFNldCcpIHtcblx0XHRyZXR1cm4gdmFsaWRhdGUuaGV4U2V0KHZhbHVlIGFzIHN0cmluZyk7XG5cdH1cblxuXHRpZiAocmFuZ2VLZXkgPT09ICdIZXhDb21wb25lbnQnKSB7XG5cdFx0cmV0dXJuIHZhbGlkYXRlLmhleENvbXBvbmVudCh2YWx1ZSBhcyBzdHJpbmcpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgQXJyYXkuaXNBcnJheShfc2V0c1tyYW5nZUtleV0pKSB7XG5cdFx0Y29uc3QgW21pbiwgbWF4XSA9IF9zZXRzW3JhbmdlS2V5XSBhcyBbbnVtYmVyLCBudW1iZXJdO1xuXG5cdFx0cmV0dXJuIHZhbHVlID49IG1pbiAmJiB2YWx1ZSA8PSBtYXg7XG5cdH1cblxuXHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcmFuZ2Ugb3IgdmFsdWUgZm9yICR7cmFuZ2VLZXl9YCk7XG59XG5cbmV4cG9ydCBjb25zdCBndWFyZHM6IENvbW1vbkNvcmVGbkd1YXJkcyA9IHtcblx0aXNDb2xvcixcblx0aXNDb2xvclNwYWNlLFxuXHRpc0NvbG9yU3RyaW5nLFxuXHRpc0luUmFuZ2Vcbn07XG5cbi8vICoqKioqKioqIFNFQ1RJT04gNSAtIFNhbml0aXplICoqKioqKioqXG5cbmZ1bmN0aW9uIGxhYih2YWx1ZTogbnVtYmVyLCBvdXRwdXQ6ICdsJyB8ICdhJyB8ICdiJyk6IExBQl9MIHwgTEFCX0EgfCBMQUJfQiB7XG5cdGlmIChvdXRwdXQgPT09ICdsJykge1xuXHRcdHJldHVybiBicmFuZC5hc0xBQl9MKE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIDApLCAxMDApKSk7XG5cdH0gZWxzZSBpZiAob3V0cHV0ID09PSAnYScpIHtcblx0XHRyZXR1cm4gYnJhbmQuYXNMQUJfQShNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAtMTI1KSwgMTI1KSkpO1xuXHR9IGVsc2UgaWYgKG91dHB1dCA9PT0gJ2InKSB7XG5cdFx0cmV0dXJuIGJyYW5kLmFzTEFCX0IoTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgLTEyNSksIDEyNSkpKTtcblx0fSBlbHNlIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHJldHVybiBMQUIgdmFsdWUnKTtcbn1cblxuZnVuY3Rpb24gcGVyY2VudGlsZSh2YWx1ZTogbnVtYmVyKTogUGVyY2VudGlsZSB7XG5cdGNvbnN0IHJhd1BlcmNlbnRpbGUgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAwKSwgMTAwKSk7XG5cblx0cmV0dXJuIGJyYW5kLmFzUGVyY2VudGlsZShyYXdQZXJjZW50aWxlKTtcbn1cblxuZnVuY3Rpb24gcmFkaWFsKHZhbHVlOiBudW1iZXIpOiBSYWRpYWwge1xuXHRjb25zdCByYXdSYWRpYWwgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAwKSwgMzYwKSkgJiAzNjA7XG5cblx0cmV0dXJuIGJyYW5kLmFzUmFkaWFsKHJhd1JhZGlhbCk7XG59XG5cbmZ1bmN0aW9uIHJnYih2YWx1ZTogbnVtYmVyKTogQnl0ZVJhbmdlIHtcblx0Y29uc3QgcmF3Qnl0ZVJhbmdlID0gTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgMCksIDI1NSkpO1xuXG5cdHJldHVybiB0b0NvbG9yVmFsdWVSYW5nZShyYXdCeXRlUmFuZ2UsICdCeXRlUmFuZ2UnKTtcbn1cblxuZXhwb3J0IGNvbnN0IHNhbml0aXplID0ge1xuXHRsYWIsXG5cdHBlcmNlbnRpbGUsXG5cdHJhZGlhbCxcblx0cmdiXG59O1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDYgLSBWYWxpZGF0ZSAqKioqKioqKlxuXG5mdW5jdGlvbiBjb2xvclZhbHVlcyhjb2xvcjogQ29sb3IgfCBTTCB8IFNWKTogYm9vbGVhbiB7XG5cdGNvbnN0IGNsb25lZENvbG9yID0gY2xvbmUoY29sb3IpO1xuXHRjb25zdCBpc051bWVyaWNWYWxpZCA9ICh2YWx1ZTogdW5rbm93bik6IGJvb2xlYW4gPT5cblx0XHR0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSk7XG5cdGNvbnN0IG5vcm1hbGl6ZVBlcmNlbnRhZ2UgPSAodmFsdWU6IHN0cmluZyB8IG51bWJlcik6IG51bWJlciA9PiB7XG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuZW5kc1dpdGgoJyUnKSkge1xuXHRcdFx0cmV0dXJuIHBhcnNlRmxvYXQodmFsdWUuc2xpY2UoMCwgLTEpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IHZhbHVlIDogTmFOO1xuXHR9O1xuXG5cdHN3aXRjaCAoY2xvbmVkQ29sb3IuZm9ybWF0KSB7XG5cdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuY3lhbixcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5tYWdlbnRhLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnllbGxvdyxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5rZXlcblx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuY3lhbiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmN5YW4gPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLm1hZ2VudGEgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5tYWdlbnRhIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55ZWxsb3cgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55ZWxsb3cgPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmtleSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmtleSA8PSAxMDBcblx0XHRcdCk7XG5cdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdHJldHVybiAvXiNbMC05QS1GYS1mXXs2fSQvLnRlc3QoY2xvbmVkQ29sb3IudmFsdWUuaGV4KTtcblx0XHRjYXNlICdoc2wnOlxuXHRcdFx0Y29uc3QgaXNWYWxpZEhTTEh1ZSA9XG5cdFx0XHRcdGlzTnVtZXJpY1ZhbGlkKGNsb25lZENvbG9yLnZhbHVlLmh1ZSkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlIDw9IDM2MDtcblx0XHRcdGNvbnN0IGlzVmFsaWRIU0xTYXR1cmF0aW9uID1cblx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uKSA+PSAwICYmXG5cdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbikgPD0gMTAwO1xuXHRcdFx0Y29uc3QgaXNWYWxpZEhTTExpZ2h0bmVzcyA9IGNsb25lZENvbG9yLnZhbHVlLmxpZ2h0bmVzc1xuXHRcdFx0XHQ/IG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzKSA+PSAwICYmXG5cdFx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MpIDw9IDEwMFxuXHRcdFx0XHQ6IHRydWU7XG5cblx0XHRcdHJldHVybiBpc1ZhbGlkSFNMSHVlICYmIGlzVmFsaWRIU0xTYXR1cmF0aW9uICYmIGlzVmFsaWRIU0xMaWdodG5lc3M7XG5cdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdGNvbnN0IGlzVmFsaWRIU1ZIdWUgPVxuXHRcdFx0XHRpc051bWVyaWNWYWxpZChjbG9uZWRDb2xvci52YWx1ZS5odWUpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmh1ZSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmh1ZSA8PSAzNjA7XG5cdFx0XHRjb25zdCBpc1ZhbGlkSFNWU2F0dXJhdGlvbiA9XG5cdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbikgPj0gMCAmJlxuXHRcdFx0XHRub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24pIDw9IDEwMDtcblx0XHRcdGNvbnN0IGlzVmFsaWRIU1ZWYWx1ZSA9IGNsb25lZENvbG9yLnZhbHVlLnZhbHVlXG5cdFx0XHRcdD8gbm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSkgPj0gMCAmJlxuXHRcdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUudmFsdWUpIDw9IDEwMFxuXHRcdFx0XHQ6IHRydWU7XG5cblx0XHRcdHJldHVybiBpc1ZhbGlkSFNWSHVlICYmIGlzVmFsaWRIU1ZTYXR1cmF0aW9uICYmIGlzVmFsaWRIU1ZWYWx1ZTtcblx0XHRjYXNlICdsYWInOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0W1xuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmwsXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYSxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5iXG5cdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmwgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5sIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5hID49IC0xMjUgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYSA8PSAxMjUgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYiA+PSAtMTI1ICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmIgPD0gMTI1XG5cdFx0XHQpO1xuXHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUucmVkLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmdyZWVuLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmJsdWVcblx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUucmVkID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUucmVkIDw9IDI1NSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ncmVlbiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmdyZWVuIDw9IDI1NSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ibHVlID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYmx1ZSA8PSAyNTVcblx0XHRcdCk7XG5cdFx0Y2FzZSAnc2wnOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0W1xuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24sXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzXG5cdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24gPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MgPD0gMTAwXG5cdFx0XHQpO1xuXHRcdGNhc2UgJ3N2Jzpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFtjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uLCBjbG9uZWRDb2xvci52YWx1ZS52YWx1ZV0uZXZlcnkoXG5cdFx0XHRcdFx0aXNOdW1lcmljVmFsaWRcblx0XHRcdFx0KSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbiA8PSAxMDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUudmFsdWUgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSA8PSAxMDBcblx0XHRcdCk7XG5cdFx0Y2FzZSAneHl6Jzpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFtcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS54LFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnksXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuelxuXHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS54ID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueCA8PSA5NS4wNDcgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnkgPD0gMTAwLjAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnogPD0gMTA4Ljg4M1xuXHRcdFx0KTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3JzKVxuXHRcdFx0XHRsb2cuZXJyb3IoYFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtjb2xvci5mb3JtYXR9YCk7XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5mdW5jdGlvbiBoZXgodmFsdWU6IHN0cmluZywgcGF0dGVybjogUmVnRXhwKTogYm9vbGVhbiB7XG5cdHJldHVybiBwYXR0ZXJuLnRlc3QodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBoZXhDb21wb25lbnQodmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gaGV4KHZhbHVlLCAvXltBLUZhLWYwLTldezJ9JC8pO1xufVxuXG5mdW5jdGlvbiBoZXhTZXQodmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gL14jWzAtOWEtZkEtRl17Nn0kLy50ZXN0KHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gcmFuZ2U8VCBleHRlbmRzIGtleW9mIHR5cGVvZiBfc2V0cz4oXG5cdHZhbHVlOiBudW1iZXIgfCBzdHJpbmcsXG5cdHJhbmdlS2V5OiBUXG4pOiB2b2lkIHtcblx0aWYgKCFpc0luUmFuZ2UodmFsdWUsIHJhbmdlS2V5KSkge1xuXHRcdGlmIChyYW5nZUtleSA9PT0gJ0hleFNldCcgfHwgcmFuZ2VLZXkgPT09ICdIZXhDb21wb25lbnQnKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdmFsdWUgZm9yICR7cmFuZ2VLZXl9OiAke3ZhbHVlfWApO1xuXHRcdH1cblxuXHRcdGNvbnN0IFttaW4sIG1heF0gPSBfc2V0c1tyYW5nZUtleV0gYXMgW251bWJlciwgbnVtYmVyXTtcblxuXHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdGBWYWx1ZSAke3ZhbHVlfSBpcyBvdXQgb2YgcmFuZ2UgZm9yICR7cmFuZ2VLZXl9IFske21pbn0sICR7bWF4fV1gXG5cdFx0KTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgdmFsaWRhdGU6IENvbW1vbkNvcmVGblZhbGlkYXRlID0ge1xuXHRjb2xvclZhbHVlcyxcblx0aGV4LFxuXHRoZXhDb21wb25lbnQsXG5cdGhleFNldCxcblx0cmFuZ2Vcbn07XG5cbmV4cG9ydCB7IGNsb25lIH07XG4iXX0=