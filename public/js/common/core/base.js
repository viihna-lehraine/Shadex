// File: src/common/core/base.js
import { data } from '../../data/index.js';
import { logger } from '../../logger/index.js';
const logMode = data.mode.logging;
const defaultColors = data.defaults.colors.base.branded;
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
            logger.info(`Parsing custom color: ${JSON.stringify(rawValue)}`);
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
                logger.error('Invalid HSL custom color. Expected format: hsl(H, S%, L%, A)');
            return null;
        }
    }
    catch (error) {
        if (logMode.errors)
            logger.error(`parseCustomColor error: ${error}`);
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
function colorStringToColor(colorString) {
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
                logger.error('Unsupported format for colorStringToColor');
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
function colorToCSSColorString(color) {
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
                    logger.error(`Unexpected color format: ${color.format}`);
                return '#FFFFFFFF';
        }
    }
    catch (error) {
        throw new Error(`getCSSColorString error: ${error}`);
    }
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
    colorStringToColor,
    hexAlphaToNumericAlpha,
    stringToValue,
    toColorValueRange,
    colorToCSSColorString,
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
                logger.error(`Unsupported color format: ${color.format}`);
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
// ******** SECTION 6 - Other ********
function getFormattedTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
export const other = {
    getFormattedTimestamp
};
export { clone };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vY29yZS9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdDQUFnQztBQThEaEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUUvQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUNsQyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQ3hELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUV4QixTQUFTLFlBQVksQ0FBQyxLQUFhLEVBQUUsUUFBeUI7SUFDN0QsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFbkMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBSSxLQUFRO0lBQ3pCLE9BQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FDaEIsSUFBTyxFQUNQLEtBQWE7SUFFYixJQUFJLE9BQU8sR0FBeUMsSUFBSSxDQUFDO0lBRXpELE9BQU8sQ0FBQyxHQUFHLElBQW1CLEVBQVEsRUFBRTtRQUN2QyxJQUFJLE9BQU87WUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbkMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDekIsSUFBSSxDQUFD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SztDQUNMLENBQUM7QUFFRixzQ0FBc0M7QUFFdEMsU0FBUyxxQkFBcUI7SUFDN0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUN2QixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDL0IsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzFELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ25ELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3RELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzFELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRTFELE9BQU8sR0FBRyxJQUFJLElBQUksS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLElBQUksT0FBTyxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ2pFLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQXNCO0lBQ3ZDLHFCQUFxQjtDQUNyQixDQUFDO0FBRUYsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2NvbW1vbi9jb3JlL2Jhc2UuanNcblxuaW1wb3J0IHtcblx0QWxwaGFSYW5nZSxcblx0Qnl0ZVJhbmdlLFxuXHRDTVlLLFxuXHRDTVlLVW5icmFuZGVkLFxuXHRDTVlLVmFsdWUsXG5cdENNWUtWYWx1ZVN0cmluZyxcblx0Q29sb3IsXG5cdENvbG9yU3BhY2UsXG5cdENvbG9yU3RyaW5nLFxuXHRDb21tb25Db3JlRm5CYXNlLFxuXHRDb21tb25Db3JlRm5CcmFuZCxcblx0Q29tbW9uQ29yZUZuQnJhbmRDb2xvcixcblx0Q29tbW9uQ29yZUZuQ29udmVydCxcblx0Q29tbW9uQ29yZUZuR3VhcmRzLFxuXHRDb21tb25Db3JlRm5PdGhlcixcblx0Q29tbW9uQ29yZUZuVmFsaWRhdGUsXG5cdEhleCxcblx0SGV4Q29tcG9uZW50LFxuXHRIZXhTZXQsXG5cdEhleFVuYnJhbmRlZCxcblx0SGV4VmFsdWUsXG5cdEhleFZhbHVlU3RyaW5nLFxuXHRIU0wsXG5cdEhTTFVuYnJhbmRlZCxcblx0SFNMVmFsdWUsXG5cdEhTTFZhbHVlU3RyaW5nLFxuXHRIU1YsXG5cdEhTVlVuYnJhbmRlZCxcblx0SFNWVmFsdWUsXG5cdEhTVlZhbHVlU3RyaW5nLFxuXHRMQUIsXG5cdExBQlVuYnJhbmRlZCxcblx0TEFCVmFsdWUsXG5cdExBQlZhbHVlU3RyaW5nLFxuXHRMQUJfTCxcblx0TEFCX0EsXG5cdExBQl9CLFxuXHROdW1lcmljUmFuZ2VLZXksXG5cdFBlcmNlbnRpbGUsXG5cdFJhZGlhbCxcblx0UmFuZ2VLZXlNYXAsXG5cdFJHQixcblx0UkdCVW5icmFuZGVkLFxuXHRSR0JWYWx1ZSxcblx0UkdCVmFsdWVTdHJpbmcsXG5cdFNMLFxuXHRTTFVuYnJhbmRlZCxcblx0U0xWYWx1ZSxcblx0U1YsXG5cdFNWVW5icmFuZGVkLFxuXHRTVlZhbHVlLFxuXHRYWVosXG5cdFhZWlVuYnJhbmRlZCxcblx0WFlaVmFsdWUsXG5cdFhZWlZhbHVlU3RyaW5nLFxuXHRYWVpfWCxcblx0WFlaX1ksXG5cdFhZWl9aXG59IGZyb20gJy4uLy4uL2luZGV4L2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi8uLi9kYXRhL2luZGV4LmpzJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4uLy4uL2xvZ2dlci9pbmRleC5qcyc7XG5cbmNvbnN0IGxvZ01vZGUgPSBkYXRhLm1vZGUubG9nZ2luZztcbmNvbnN0IGRlZmF1bHRDb2xvcnMgPSBkYXRhLmRlZmF1bHRzLmNvbG9ycy5iYXNlLmJyYW5kZWQ7XG5jb25zdCBtb2RlID0gZGF0YS5tb2RlO1xuY29uc3QgX3NldHMgPSBkYXRhLnNldHM7XG5cbmZ1bmN0aW9uIGNsYW1wVG9SYW5nZSh2YWx1ZTogbnVtYmVyLCByYW5nZUtleTogTnVtZXJpY1JhbmdlS2V5KTogbnVtYmVyIHtcblx0Y29uc3QgW21pbiwgbWF4XSA9IF9zZXRzW3JhbmdlS2V5XTtcblxuXHRyZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIG1pbiksIG1heCk7XG59XG5cbmZ1bmN0aW9uIGNsb25lPFQ+KHZhbHVlOiBUKTogVCB7XG5cdHJldHVybiBzdHJ1Y3R1cmVkQ2xvbmUodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBkZWJvdW5jZTxUIGV4dGVuZHMgKC4uLmFyZ3M6IFBhcmFtZXRlcnM8VD4pID0+IHZvaWQ+KFxuXHRmdW5jOiBULFxuXHRkZWxheTogbnVtYmVyXG4pIHtcblx0bGV0IHRpbWVvdXQ6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgbnVsbCA9IG51bGw7XG5cblx0cmV0dXJuICguLi5hcmdzOiBQYXJhbWV0ZXJzPFQ+KTogdm9pZCA9PiB7XG5cdFx0aWYgKHRpbWVvdXQpIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblxuXHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdGZ1bmMoLi4uYXJncyk7XG5cdFx0fSwgZGVsYXkpO1xuXHR9O1xufVxuXG5mdW5jdGlvbiBwYXJzZUN1c3RvbUNvbG9yKHJhd1ZhbHVlOiBzdHJpbmcpOiBIU0wgfCBudWxsIHtcblx0dHJ5IHtcblx0XHRpZiAoIW1vZGUucXVpZXQpXG5cdFx0XHRsb2dnZXIuaW5mbyhgUGFyc2luZyBjdXN0b20gY29sb3I6ICR7SlNPTi5zdHJpbmdpZnkocmF3VmFsdWUpfWApO1xuXG5cdFx0Y29uc3QgbWF0Y2ggPSByYXdWYWx1ZS5tYXRjaChcblx0XHRcdC9oc2xcXCgoXFxkKyksXFxzKihcXGQrKSU/LFxccyooXFxkKyklPyxcXHMqKFxcZCpcXC4/XFxkKylcXCkvXG5cdFx0KTtcblxuXHRcdGlmIChtYXRjaCkge1xuXHRcdFx0Y29uc3QgWywgaHVlLCBzYXR1cmF0aW9uLCBsaWdodG5lc3MsIGFscGhhXSA9IG1hdGNoO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwocGFyc2VJbnQoaHVlKSksXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlSW50KHNhdHVyYXRpb24pKSxcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUludChsaWdodG5lc3MpKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKHBhcnNlRmxvYXQoYWxwaGEpKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHQnSW52YWxpZCBIU0wgY3VzdG9tIGNvbG9yLiBFeHBlY3RlZCBmb3JtYXQ6IGhzbChILCBTJSwgTCUsIEEpJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3JzKSBsb2dnZXIuZXJyb3IoYHBhcnNlQ3VzdG9tQ29sb3IgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgYmFzZTogQ29tbW9uQ29yZUZuQmFzZSA9IHtcblx0Y2xhbXBUb1JhbmdlLFxuXHRjbG9uZSxcblx0ZGVib3VuY2UsXG5cdHBhcnNlQ3VzdG9tQ29sb3Jcbn0gYXMgY29uc3Q7XG5cbi8vICoqKioqKioqIFNFQ1RJT04gMiAqKioqKioqKlxuXG5mdW5jdGlvbiBhc0FscGhhUmFuZ2UodmFsdWU6IG51bWJlcik6IEFscGhhUmFuZ2Uge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ0FscGhhUmFuZ2UnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgQWxwaGFSYW5nZTtcbn1cblxuZnVuY3Rpb24gYXNCcmFuZGVkPFQgZXh0ZW5kcyBrZXlvZiBSYW5nZUtleU1hcD4oXG5cdHZhbHVlOiBudW1iZXIsXG5cdHJhbmdlS2V5OiBUXG4pOiBSYW5nZUtleU1hcFtUXSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCByYW5nZUtleSk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIFJhbmdlS2V5TWFwW1RdO1xufVxuXG5mdW5jdGlvbiBhc0J5dGVSYW5nZSh2YWx1ZTogbnVtYmVyKTogQnl0ZVJhbmdlIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdCeXRlUmFuZ2UnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgQnl0ZVJhbmdlO1xufVxuXG5mdW5jdGlvbiBhc0hleENvbXBvbmVudCh2YWx1ZTogc3RyaW5nKTogSGV4Q29tcG9uZW50IHtcblx0aWYgKCF2YWxpZGF0ZS5oZXhDb21wb25lbnQodmFsdWUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIEhleENvbXBvbmVudCB2YWx1ZTogJHt2YWx1ZX1gKTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZSBhcyB1bmtub3duIGFzIEhleENvbXBvbmVudDtcbn1cblxuZnVuY3Rpb24gYXNIZXhTZXQodmFsdWU6IHN0cmluZyk6IEhleFNldCB7XG5cdGlmICgvXiNbMC05YS1mQS1GXXs4fSQvLnRlc3QodmFsdWUpKSB7XG5cdFx0dmFsdWUgPSB2YWx1ZS5zbGljZSgwLCA3KTtcblx0fVxuXHRpZiAoIXZhbGlkYXRlLmhleFNldCh2YWx1ZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgSGV4U2V0IHZhbHVlOiAke3ZhbHVlfWApO1xuXHR9XG5cdHJldHVybiB2YWx1ZSBhcyBIZXhTZXQ7XG59XG5cbmZ1bmN0aW9uIGFzTEFCX0wodmFsdWU6IG51bWJlcik6IExBQl9MIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdMQUJfTCcpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBMQUJfTDtcbn1cblxuZnVuY3Rpb24gYXNMQUJfQSh2YWx1ZTogbnVtYmVyKTogTEFCX0Ege1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ0xBQl9BJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIExBQl9BO1xufVxuXG5mdW5jdGlvbiBhc0xBQl9CKHZhbHVlOiBudW1iZXIpOiBMQUJfQiB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnTEFCX0InKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgTEFCX0I7XG59XG5cbmZ1bmN0aW9uIGFzUGVyY2VudGlsZSh2YWx1ZTogbnVtYmVyKTogUGVyY2VudGlsZSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnUGVyY2VudGlsZScpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBQZXJjZW50aWxlO1xufVxuXG5mdW5jdGlvbiBhc1JhZGlhbCh2YWx1ZTogbnVtYmVyKTogUmFkaWFsIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdSYWRpYWwnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgUmFkaWFsO1xufVxuXG5mdW5jdGlvbiBhc1hZWl9YKHZhbHVlOiBudW1iZXIpOiBYWVpfWCB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnWFlaX1gnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgWFlaX1g7XG59XG5cbmZ1bmN0aW9uIGFzWFlaX1kodmFsdWU6IG51bWJlcik6IFhZWl9ZIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdYWVpfWScpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBYWVpfWTtcbn1cblxuZnVuY3Rpb24gYXNYWVpfWih2YWx1ZTogbnVtYmVyKTogWFlaX1oge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ1hZWl9aJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIFhZWl9aO1xufVxuXG5leHBvcnQgY29uc3QgYnJhbmQ6IENvbW1vbkNvcmVGbkJyYW5kID0ge1xuXHRhc0FscGhhUmFuZ2UsXG5cdGFzQnJhbmRlZCxcblx0YXNCeXRlUmFuZ2UsXG5cdGFzSGV4Q29tcG9uZW50LFxuXHRhc0hleFNldCxcblx0YXNMQUJfTCxcblx0YXNMQUJfQSxcblx0YXNMQUJfQixcblx0YXNQZXJjZW50aWxlLFxuXHRhc1JhZGlhbCxcblx0YXNYWVpfWCxcblx0YXNYWVpfWSxcblx0YXNYWVpfWlxufTtcblxuLy8gKioqKioqKiogU0VDVElPTiAyIC0gQnJhbmQgQ29sb3IgKioqKioqKipcblxuZnVuY3Rpb24gYXNDTVlLKGNvbG9yOiBDTVlLVW5icmFuZGVkKTogQ01ZSyB7XG5cdGNvbnN0IGJyYW5kZWRDeWFuID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLmN5YW4pO1xuXHRjb25zdCBicmFuZGVkTWFnZW50YSA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5tYWdlbnRhKTtcblx0Y29uc3QgYnJhbmRlZFllbGxvdyA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS55ZWxsb3cpO1xuXHRjb25zdCBicmFuZGVkS2V5ID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLmtleSk7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0Y3lhbjogYnJhbmRlZEN5YW4sXG5cdFx0XHRtYWdlbnRhOiBicmFuZGVkTWFnZW50YSxcblx0XHRcdHllbGxvdzogYnJhbmRlZFllbGxvdyxcblx0XHRcdGtleTogYnJhbmRlZEtleSxcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ2NteWsnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzSGV4KGNvbG9yOiBIZXhVbmJyYW5kZWQpOiBIZXgge1xuXHRsZXQgaGV4ID0gY29sb3IudmFsdWUuaGV4O1xuXG5cdGlmICghaGV4LnN0YXJ0c1dpdGgoJyMnKSkgaGV4ID0gYCMke2hleH1gO1xuXG5cdGlmICghL14jWzAtOUEtRmEtZl17OH0kLy50ZXN0KGhleCkpXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIEhleCBjb2xvciBmb3JtYXQ6ICR7aGV4fWApO1xuXG5cdGNvbnN0IGhleE1haW4gPSBoZXguc2xpY2UoMCwgNyk7XG5cdGNvbnN0IGFscGhhID0gaGV4LnNsaWNlKDcsIDkpO1xuXG5cdGNvbnN0IGJyYW5kZWRIZXggPSBicmFuZC5hc0hleFNldChoZXhNYWluKTtcblx0Y29uc3QgYnJhbmRlZEhleEFscGhhID0gYnJhbmQuYXNIZXhDb21wb25lbnQoYWxwaGEpO1xuXHRjb25zdCBicmFuZGVkTnVtQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUubnVtQWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdGhleDogYnJhbmRlZEhleCxcblx0XHRcdGFscGhhOiBicmFuZGVkSGV4QWxwaGEsXG5cdFx0XHRudW1BbHBoYTogYnJhbmRlZE51bUFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdoZXgnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzSFNMKGNvbG9yOiBIU0xVbmJyYW5kZWQpOiBIU0wge1xuXHRjb25zdCBicmFuZGVkSHVlID0gYnJhbmQuYXNSYWRpYWwoY29sb3IudmFsdWUuaHVlKTtcblx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUuc2F0dXJhdGlvbik7XG5cdGNvbnN0IGJyYW5kZWRMaWdodG5lc3MgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUubGlnaHRuZXNzKTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRodWU6IGJyYW5kZWRIdWUsXG5cdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdGxpZ2h0bmVzczogYnJhbmRlZExpZ2h0bmVzcyxcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ2hzbCdcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNIU1YoY29sb3I6IEhTVlVuYnJhbmRlZCk6IEhTViB7XG5cdGNvbnN0IGJyYW5kZWRIdWUgPSBicmFuZC5hc1JhZGlhbChjb2xvci52YWx1ZS5odWUpO1xuXHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5zYXR1cmF0aW9uKTtcblx0Y29uc3QgYnJhbmRlZFZhbHVlID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnZhbHVlKTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRodWU6IGJyYW5kZWRIdWUsXG5cdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdHZhbHVlOiBicmFuZGVkVmFsdWUsXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdoc3YnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzTEFCKGNvbG9yOiBMQUJVbmJyYW5kZWQpOiBMQUIge1xuXHRjb25zdCBicmFuZGVkTCA9IGJyYW5kLmFzTEFCX0woY29sb3IudmFsdWUubCk7XG5cdGNvbnN0IGJyYW5kZWRBID0gYnJhbmQuYXNMQUJfQShjb2xvci52YWx1ZS5hKTtcblx0Y29uc3QgYnJhbmRlZEIgPSBicmFuZC5hc0xBQl9CKGNvbG9yLnZhbHVlLmIpO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdGw6IGJyYW5kZWRMLFxuXHRcdFx0YTogYnJhbmRlZEEsXG5cdFx0XHRiOiBicmFuZGVkQixcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ2xhYidcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNSR0IoY29sb3I6IFJHQlVuYnJhbmRlZCk6IFJHQiB7XG5cdGNvbnN0IGJyYW5kZWRSZWQgPSBicmFuZC5hc0J5dGVSYW5nZShjb2xvci52YWx1ZS5yZWQpO1xuXHRjb25zdCBicmFuZGVkR3JlZW4gPSBicmFuZC5hc0J5dGVSYW5nZShjb2xvci52YWx1ZS5ncmVlbik7XG5cdGNvbnN0IGJyYW5kZWRCbHVlID0gYnJhbmQuYXNCeXRlUmFuZ2UoY29sb3IudmFsdWUuYmx1ZSk7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0cmVkOiBicmFuZGVkUmVkLFxuXHRcdFx0Z3JlZW46IGJyYW5kZWRHcmVlbixcblx0XHRcdGJsdWU6IGJyYW5kZWRCbHVlLFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAncmdiJ1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc1NMKGNvbG9yOiBTTFVuYnJhbmRlZCk6IFNMIHtcblx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUuc2F0dXJhdGlvbik7XG5cdGNvbnN0IGJyYW5kZWRMaWdodG5lc3MgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUubGlnaHRuZXNzKTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdGxpZ2h0bmVzczogYnJhbmRlZExpZ2h0bmVzcyxcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ3NsJ1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc1NWKGNvbG9yOiBTVlVuYnJhbmRlZCk6IFNWIHtcblx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUuc2F0dXJhdGlvbik7XG5cdGNvbnN0IGJyYW5kZWRWYWx1ZSA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS52YWx1ZSk7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0c2F0dXJhdGlvbjogYnJhbmRlZFNhdHVyYXRpb24sXG5cdFx0XHR2YWx1ZTogYnJhbmRlZFZhbHVlLFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnc3YnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzWFlaKGNvbG9yOiBYWVpVbmJyYW5kZWQpOiBYWVoge1xuXHRjb25zdCBicmFuZGVkWCA9IGJyYW5kLmFzWFlaX1goY29sb3IudmFsdWUueCk7XG5cdGNvbnN0IGJyYW5kZWRZID0gYnJhbmQuYXNYWVpfWShjb2xvci52YWx1ZS55KTtcblx0Y29uc3QgYnJhbmRlZFogPSBicmFuZC5hc1hZWl9aKGNvbG9yLnZhbHVlLnopO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdHg6IGJyYW5kZWRYLFxuXHRcdFx0eTogYnJhbmRlZFksXG5cdFx0XHR6OiBicmFuZGVkWixcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ3h5eidcblx0fTtcbn1cblxuZXhwb3J0IGNvbnN0IGJyYW5kQ29sb3I6IENvbW1vbkNvcmVGbkJyYW5kQ29sb3IgPSB7XG5cdGFzQ01ZSyxcblx0YXNIZXgsXG5cdGFzSFNMLFxuXHRhc0hTVixcblx0YXNMQUIsXG5cdGFzUkdCLFxuXHRhc1NMLFxuXHRhc1NWLFxuXHRhc1hZWlxufTtcblxuLy8gKioqKioqKiogU0VDVElPTiAzIC0gQ29udmVydCAqKioqKioqKlxuXG5mdW5jdGlvbiBjbXlrU3RyaW5nVG9WYWx1ZShjbXlrOiBDTVlLVmFsdWVTdHJpbmcpOiBDTVlLVmFsdWUge1xuXHRyZXR1cm4ge1xuXHRcdGN5YW46IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUZsb2F0KGNteWsuY3lhbikgLyAxMDApLFxuXHRcdG1hZ2VudGE6IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUZsb2F0KGNteWsubWFnZW50YSkgLyAxMDApLFxuXHRcdHllbGxvdzogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoY215ay55ZWxsb3cpIC8gMTAwKSxcblx0XHRrZXk6IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUZsb2F0KGNteWsua2V5KSAvIDEwMCksXG5cdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShwYXJzZUZsb2F0KGNteWsuYWxwaGEpKVxuXHR9O1xufVxuXG5mdW5jdGlvbiBjbXlrVmFsdWVUb1N0cmluZyhjbXlrOiBDTVlLVmFsdWUpOiBDTVlLVmFsdWVTdHJpbmcge1xuXHRyZXR1cm4ge1xuXHRcdGN5YW46IGAke2NteWsuY3lhbiAqIDEwMH0lYCxcblx0XHRtYWdlbnRhOiBgJHtjbXlrLm1hZ2VudGEgKiAxMDB9JWAsXG5cdFx0eWVsbG93OiBgJHtjbXlrLnllbGxvdyAqIDEwMH0lYCxcblx0XHRrZXk6IGAke2NteWsua2V5ICogMTAwfSVgLFxuXHRcdGFscGhhOiBgJHtjbXlrLmFscGhhfWBcblx0fTtcbn1cblxuZnVuY3Rpb24gY29sb3JTdHJpbmdUb0NvbG9yKGNvbG9yU3RyaW5nOiBDb2xvclN0cmluZyk6IENvbG9yIHtcblx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjbG9uZShjb2xvclN0cmluZyk7XG5cblx0Y29uc3QgcGFyc2VWYWx1ZSA9ICh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyID0+XG5cdFx0dHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5lbmRzV2l0aCgnJScpXG5cdFx0XHQ/IHBhcnNlRmxvYXQodmFsdWUuc2xpY2UoMCwgLTEpKVxuXHRcdFx0OiBOdW1iZXIodmFsdWUpO1xuXG5cdGNvbnN0IG5ld1ZhbHVlID0gT2JqZWN0LmVudHJpZXMoY2xvbmVkQ29sb3IudmFsdWUpLnJlZHVjZShcblx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHRhY2Nba2V5IGFzIGtleW9mICh0eXBlb2YgY2xvbmVkQ29sb3IpWyd2YWx1ZSddXSA9IHBhcnNlVmFsdWUoXG5cdFx0XHRcdHZhbFxuXHRcdFx0KSBhcyBuZXZlcjtcblx0XHRcdHJldHVybiBhY2M7XG5cdFx0fSxcblx0XHR7fSBhcyBSZWNvcmQ8a2V5b2YgKHR5cGVvZiBjbG9uZWRDb2xvcilbJ3ZhbHVlJ10sIG51bWJlcj5cblx0KTtcblxuXHRzd2l0Y2ggKGNsb25lZENvbG9yLmZvcm1hdCkge1xuXHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnY215aycsIHZhbHVlOiBuZXdWYWx1ZSBhcyBDTVlLVmFsdWUgfTtcblx0XHRjYXNlICdoc2wnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnaHNsJywgdmFsdWU6IG5ld1ZhbHVlIGFzIEhTTFZhbHVlIH07XG5cdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ2hzdicsIHZhbHVlOiBuZXdWYWx1ZSBhcyBIU1ZWYWx1ZSB9O1xuXHRcdGNhc2UgJ3NsJzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ3NsJywgdmFsdWU6IG5ld1ZhbHVlIGFzIFNMVmFsdWUgfTtcblx0XHRjYXNlICdzdic6XG5cdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdzdicsIHZhbHVlOiBuZXdWYWx1ZSBhcyBTVlZhbHVlIH07XG5cdFx0ZGVmYXVsdDpcblx0XHRcdGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdFx0bG9nZ2VyLmVycm9yKCdVbnN1cHBvcnRlZCBmb3JtYXQgZm9yIGNvbG9yU3RyaW5nVG9Db2xvcicpO1xuXG5cdFx0XHRjb25zdCB1bmJyYW5kZWRIU0wgPSBkZWZhdWx0Q29sb3JzLmhzbDtcblxuXHRcdFx0Y29uc3QgYnJhbmRlZEh1ZSA9IGJyYW5kLmFzUmFkaWFsKHVuYnJhbmRlZEhTTC52YWx1ZS5odWUpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdHVuYnJhbmRlZEhTTC52YWx1ZS5zYXR1cmF0aW9uXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZExpZ2h0bmVzcyA9IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0dW5icmFuZGVkSFNMLnZhbHVlLmxpZ2h0bmVzc1xuXHRcdFx0KTtcblx0XHRcdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZSh1bmJyYW5kZWRIU0wudmFsdWUuYWxwaGEpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmRlZEh1ZSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kZWRMaWdodG5lc3MsXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvbG9yVG9DU1NDb2xvclN0cmluZyhjb2xvcjogQ29sb3IpOiBzdHJpbmcge1xuXHR0cnkge1xuXHRcdHN3aXRjaCAoY29sb3IuZm9ybWF0KSB7XG5cdFx0XHRjYXNlICdjbXlrJzpcblx0XHRcdFx0cmV0dXJuIGBjbXlrKCR7Y29sb3IudmFsdWUuY3lhbn0sICR7Y29sb3IudmFsdWUubWFnZW50YX0sICR7Y29sb3IudmFsdWUueWVsbG93fSwgJHtjb2xvci52YWx1ZS5rZXl9LCAke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0cmV0dXJuIFN0cmluZyhjb2xvci52YWx1ZS5oZXgpO1xuXHRcdFx0Y2FzZSAnaHNsJzpcblx0XHRcdFx0cmV0dXJuIGBoc2woJHtjb2xvci52YWx1ZS5odWV9LCAke2NvbG9yLnZhbHVlLnNhdHVyYXRpb259JSwgJHtjb2xvci52YWx1ZS5saWdodG5lc3N9JSwgJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdHJldHVybiBgaHN2KCR7Y29sb3IudmFsdWUuaHVlfSwgJHtjb2xvci52YWx1ZS5zYXR1cmF0aW9ufSUsICR7Y29sb3IudmFsdWUudmFsdWV9JSwgJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBgbGFiKCR7Y29sb3IudmFsdWUubH0sICR7Y29sb3IudmFsdWUuYX0sICR7Y29sb3IudmFsdWUuYn0sICR7Y29sb3IudmFsdWUuYWxwaGF9KWA7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gYHJnYigke2NvbG9yLnZhbHVlLnJlZH0sICR7Y29sb3IudmFsdWUuZ3JlZW59LCAke2NvbG9yLnZhbHVlLmJsdWV9LCAke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIGB4eXooJHtjb2xvci52YWx1ZS54fSwgJHtjb2xvci52YWx1ZS55fSwgJHtjb2xvci52YWx1ZS56fSwgJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IoYFVuZXhwZWN0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yLmZvcm1hdH1gKTtcblxuXHRcdFx0XHRyZXR1cm4gJyNGRkZGRkZGRic7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgZ2V0Q1NTQ29sb3JTdHJpbmcgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4QWxwaGFUb051bWVyaWNBbHBoYShoZXhBbHBoYTogc3RyaW5nKTogbnVtYmVyIHtcblx0cmV0dXJuIHBhcnNlSW50KGhleEFscGhhLCAxNikgLyAyNTU7XG59XG5cbmZ1bmN0aW9uIGhleFN0cmluZ1RvVmFsdWUoaGV4OiBIZXhWYWx1ZVN0cmluZyk6IEhleFZhbHVlIHtcblx0cmV0dXJuIHtcblx0XHRoZXg6IGJyYW5kLmFzSGV4U2V0KGhleC5oZXgpLFxuXHRcdGFscGhhOiBicmFuZC5hc0hleENvbXBvbmVudChoZXguYWxwaGEpLFxuXHRcdG51bUFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UocGFyc2VGbG9hdChoZXgubnVtQWxwaGEpKVxuXHR9O1xufVxuXG5mdW5jdGlvbiBoZXhWYWx1ZVRvU3RyaW5nKGhleDogSGV4VmFsdWUpOiBIZXhWYWx1ZVN0cmluZyB7XG5cdHJldHVybiB7XG5cdFx0aGV4OiBoZXguaGV4LFxuXHRcdGFscGhhOiBgJHtoZXguYWxwaGF9YCxcblx0XHRudW1BbHBoYTogYCR7aGV4Lm51bUFscGhhfWBcblx0fTtcbn1cblxuZnVuY3Rpb24gaHNsU3RyaW5nVG9WYWx1ZShoc2w6IEhTTFZhbHVlU3RyaW5nKTogSFNMVmFsdWUge1xuXHRyZXR1cm4ge1xuXHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwocGFyc2VGbG9hdChoc2wuaHVlKSksXG5cdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoaHNsLnNhdHVyYXRpb24pIC8gMTAwKSxcblx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUZsb2F0KGhzbC5saWdodG5lc3MpIC8gMTAwKSxcblx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKHBhcnNlRmxvYXQoaHNsLmFscGhhKSlcblx0fTtcbn1cblxuZnVuY3Rpb24gaHNsVmFsdWVUb1N0cmluZyhoc2w6IEhTTFZhbHVlKTogSFNMVmFsdWVTdHJpbmcge1xuXHRyZXR1cm4ge1xuXHRcdGh1ZTogYCR7aHNsLmh1ZX3CsGAsXG5cdFx0c2F0dXJhdGlvbjogYCR7aHNsLnNhdHVyYXRpb24gKiAxMDB9JWAsXG5cdFx0bGlnaHRuZXNzOiBgJHtoc2wubGlnaHRuZXNzICogMTAwfSVgLFxuXHRcdGFscGhhOiBgJHtoc2wuYWxwaGF9YFxuXHR9O1xufVxuXG5mdW5jdGlvbiBoc3ZTdHJpbmdUb1ZhbHVlKGhzdjogSFNWVmFsdWVTdHJpbmcpOiBIU1ZWYWx1ZSB7XG5cdHJldHVybiB7XG5cdFx0aHVlOiBicmFuZC5hc1JhZGlhbChwYXJzZUZsb2F0KGhzdi5odWUpKSxcblx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VGbG9hdChoc3Yuc2F0dXJhdGlvbikgLyAxMDApLFxuXHRcdHZhbHVlOiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VGbG9hdChoc3YudmFsdWUpIC8gMTAwKSxcblx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKHBhcnNlRmxvYXQoaHN2LmFscGhhKSlcblx0fTtcbn1cblxuZnVuY3Rpb24gaHN2VmFsdWVUb1N0cmluZyhoc3Y6IEhTVlZhbHVlKTogSFNWVmFsdWVTdHJpbmcge1xuXHRyZXR1cm4ge1xuXHRcdGh1ZTogYCR7aHN2Lmh1ZX3CsGAsXG5cdFx0c2F0dXJhdGlvbjogYCR7aHN2LnNhdHVyYXRpb24gKiAxMDB9JWAsXG5cdFx0dmFsdWU6IGAke2hzdi52YWx1ZSAqIDEwMH0lYCxcblx0XHRhbHBoYTogYCR7aHN2LmFscGhhfWBcblx0fTtcbn1cblxuZnVuY3Rpb24gbGFiVmFsdWVUb1N0cmluZyhsYWI6IExBQlZhbHVlKTogTEFCVmFsdWVTdHJpbmcge1xuXHRyZXR1cm4ge1xuXHRcdGw6IGAke2xhYi5sfWAsXG5cdFx0YTogYCR7bGFiLmF9YCxcblx0XHRiOiBgJHtsYWIuYn1gLFxuXHRcdGFscGhhOiBgJHtsYWIuYWxwaGF9YFxuXHR9O1xufVxuXG5mdW5jdGlvbiBsYWJTdHJpbmdUb1ZhbHVlKGxhYjogTEFCVmFsdWVTdHJpbmcpOiBMQUJWYWx1ZSB7XG5cdHJldHVybiB7XG5cdFx0bDogYnJhbmQuYXNMQUJfTChwYXJzZUZsb2F0KGxhYi5sKSksXG5cdFx0YTogYnJhbmQuYXNMQUJfQShwYXJzZUZsb2F0KGxhYi5hKSksXG5cdFx0YjogYnJhbmQuYXNMQUJfQihwYXJzZUZsb2F0KGxhYi5iKSksXG5cdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShwYXJzZUZsb2F0KGxhYi5hbHBoYSkpXG5cdH07XG59XG5cbmZ1bmN0aW9uIHJnYlZhbHVlVG9TdHJpbmcocmdiOiBSR0JWYWx1ZSk6IFJHQlZhbHVlU3RyaW5nIHtcblx0cmV0dXJuIHtcblx0XHRyZWQ6IGAke3JnYi5yZWR9YCxcblx0XHRncmVlbjogYCR7cmdiLmdyZWVufWAsXG5cdFx0Ymx1ZTogYCR7cmdiLmJsdWV9YCxcblx0XHRhbHBoYTogYCR7cmdiLmFscGhhfWBcblx0fTtcbn1cblxuZnVuY3Rpb24gcmdiU3RyaW5nVG9WYWx1ZShyZ2I6IFJHQlZhbHVlU3RyaW5nKTogUkdCVmFsdWUge1xuXHRyZXR1cm4ge1xuXHRcdHJlZDogYnJhbmQuYXNCeXRlUmFuZ2UocGFyc2VGbG9hdChyZ2IucmVkKSksXG5cdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKHBhcnNlRmxvYXQocmdiLmdyZWVuKSksXG5cdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2UocGFyc2VGbG9hdChyZ2IuYmx1ZSkpLFxuXHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UocGFyc2VGbG9hdChyZ2IuYWxwaGEpKVxuXHR9O1xufVxuXG5mdW5jdGlvbiB0b0NvbG9yVmFsdWVSYW5nZTxUIGV4dGVuZHMga2V5b2YgUmFuZ2VLZXlNYXA+KFxuXHR2YWx1ZTogc3RyaW5nIHwgbnVtYmVyLFxuXHRyYW5nZUtleTogVFxuKTogUmFuZ2VLZXlNYXBbVF0ge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgcmFuZ2VLZXkpO1xuXG5cdGlmIChyYW5nZUtleSA9PT0gJ0hleFNldCcpIHtcblx0XHRyZXR1cm4gYnJhbmQuYXNIZXhTZXQodmFsdWUgYXMgc3RyaW5nKSBhcyB1bmtub3duIGFzIFJhbmdlS2V5TWFwW1RdO1xuXHR9XG5cblx0aWYgKHJhbmdlS2V5ID09PSAnSGV4Q29tcG9uZW50Jykge1xuXHRcdHJldHVybiBicmFuZC5hc0hleENvbXBvbmVudChcblx0XHRcdHZhbHVlIGFzIHN0cmluZ1xuXHRcdCkgYXMgdW5rbm93biBhcyBSYW5nZUtleU1hcFtUXTtcblx0fVxuXG5cdHJldHVybiBicmFuZC5hc0JyYW5kZWQoXG5cdFx0dmFsdWUgYXMgbnVtYmVyLFxuXHRcdHJhbmdlS2V5XG5cdCkgYXMgdW5rbm93biBhcyBSYW5nZUtleU1hcFtUXTtcbn1cblxuZnVuY3Rpb24geHl6VmFsdWVUb1N0cmluZyh4eXo6IFhZWlZhbHVlKTogWFlaVmFsdWVTdHJpbmcge1xuXHRyZXR1cm4ge1xuXHRcdHg6IGAke3h5ei54fWAsXG5cdFx0eTogYCR7eHl6Lnl9YCxcblx0XHR6OiBgJHt4eXouen1gLFxuXHRcdGFscGhhOiBgJHt4eXouYWxwaGF9YFxuXHR9O1xufVxuXG5mdW5jdGlvbiB4eXpTdHJpbmdUb1ZhbHVlKHh5ejogWFlaVmFsdWVTdHJpbmcpOiBYWVpWYWx1ZSB7XG5cdHJldHVybiB7XG5cdFx0eDogYnJhbmQuYXNYWVpfWChwYXJzZUZsb2F0KHh5ei54KSksXG5cdFx0eTogYnJhbmQuYXNYWVpfWShwYXJzZUZsb2F0KHh5ei55KSksXG5cdFx0ejogYnJhbmQuYXNYWVpfWihwYXJzZUZsb2F0KHh5ei56KSksXG5cdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShwYXJzZUZsb2F0KHh5ei5hbHBoYSkpXG5cdH07XG59XG5cbmNvbnN0IHN0cmluZ1RvVmFsdWUgPSB7XG5cdGNteWs6IGNteWtTdHJpbmdUb1ZhbHVlLFxuXHRoZXg6IGhleFN0cmluZ1RvVmFsdWUsXG5cdGhzbDogaHNsU3RyaW5nVG9WYWx1ZSxcblx0aHN2OiBoc3ZTdHJpbmdUb1ZhbHVlLFxuXHRsYWI6IGxhYlN0cmluZ1RvVmFsdWUsXG5cdHJnYjogcmdiU3RyaW5nVG9WYWx1ZSxcblx0eHl6OiB4eXpTdHJpbmdUb1ZhbHVlXG59O1xuXG5jb25zdCB2YWx1ZVRvU3RyaW5nID0ge1xuXHRjbXlrOiBjbXlrVmFsdWVUb1N0cmluZyxcblx0aGV4OiBoZXhWYWx1ZVRvU3RyaW5nLFxuXHRoc2w6IGhzbFZhbHVlVG9TdHJpbmcsXG5cdGhzdjogaHN2VmFsdWVUb1N0cmluZyxcblx0bGFiOiBsYWJWYWx1ZVRvU3RyaW5nLFxuXHRyZ2I6IHJnYlZhbHVlVG9TdHJpbmcsXG5cdHh5ejogeHl6VmFsdWVUb1N0cmluZ1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbnZlcnQ6IENvbW1vbkNvcmVGbkNvbnZlcnQgPSB7XG5cdGNvbG9yU3RyaW5nVG9Db2xvcixcblx0aGV4QWxwaGFUb051bWVyaWNBbHBoYSxcblx0c3RyaW5nVG9WYWx1ZSxcblx0dG9Db2xvclZhbHVlUmFuZ2UsXG5cdGNvbG9yVG9DU1NDb2xvclN0cmluZyxcblx0dmFsdWVUb1N0cmluZ1xufTtcblxuLy8gKioqKioqKiogU0VDVElPTiA0IC0gR3VhcmRzICoqKioqKioqXG5cbmZ1bmN0aW9uIGlzQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDb2xvciB7XG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8IHZhbHVlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cblx0Y29uc3QgY29sb3IgPSB2YWx1ZSBhcyBDb2xvcjtcblx0Y29uc3QgdmFsaWRGb3JtYXRzOiBDb2xvclsnZm9ybWF0J11bXSA9IFtcblx0XHQnY215aycsXG5cdFx0J2hleCcsXG5cdFx0J2hzbCcsXG5cdFx0J2hzdicsXG5cdFx0J2xhYicsXG5cdFx0J3JnYicsXG5cdFx0J3NsJyxcblx0XHQnc3YnLFxuXHRcdCd4eXonXG5cdF07XG5cblx0cmV0dXJuIChcblx0XHQndmFsdWUnIGluIGNvbG9yICYmXG5cdFx0J2Zvcm1hdCcgaW4gY29sb3IgJiZcblx0XHR2YWxpZEZvcm1hdHMuaW5jbHVkZXMoY29sb3IuZm9ybWF0KVxuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0NvbG9yU3BhY2UodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDb2xvclNwYWNlIHtcblx0Y29uc3QgdmFsaWRDb2xvclNwYWNlczogQ29sb3JTcGFjZVtdID0gW1xuXHRcdCdjbXlrJyxcblx0XHQnaGV4Jyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnbGFiJyxcblx0XHQncmdiJyxcblx0XHQneHl6J1xuXHRdO1xuXG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJlxuXHRcdHZhbGlkQ29sb3JTcGFjZXMuaW5jbHVkZXModmFsdWUgYXMgQ29sb3JTcGFjZSlcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNDb2xvclN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENvbG9yU3RyaW5nIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuXHRjb25zdCBjb2xvclN0cmluZyA9IHZhbHVlIGFzIENvbG9yU3RyaW5nO1xuXHRjb25zdCB2YWxpZFN0cmluZ0Zvcm1hdHM6IENvbG9yU3RyaW5nWydmb3JtYXQnXVtdID0gW1xuXHRcdCdjbXlrJyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnc2wnLFxuXHRcdCdzdidcblx0XTtcblxuXHRyZXR1cm4gKFxuXHRcdCd2YWx1ZScgaW4gY29sb3JTdHJpbmcgJiZcblx0XHQnZm9ybWF0JyBpbiBjb2xvclN0cmluZyAmJlxuXHRcdHZhbGlkU3RyaW5nRm9ybWF0cy5pbmNsdWRlcyhjb2xvclN0cmluZy5mb3JtYXQpXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSW5SYW5nZTxUIGV4dGVuZHMga2V5b2YgdHlwZW9mIF9zZXRzPihcblx0dmFsdWU6IG51bWJlciB8IHN0cmluZyxcblx0cmFuZ2VLZXk6IFRcbik6IGJvb2xlYW4ge1xuXHRpZiAocmFuZ2VLZXkgPT09ICdIZXhTZXQnKSB7XG5cdFx0cmV0dXJuIHZhbGlkYXRlLmhleFNldCh2YWx1ZSBhcyBzdHJpbmcpO1xuXHR9XG5cblx0aWYgKHJhbmdlS2V5ID09PSAnSGV4Q29tcG9uZW50Jykge1xuXHRcdHJldHVybiB2YWxpZGF0ZS5oZXhDb21wb25lbnQodmFsdWUgYXMgc3RyaW5nKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIEFycmF5LmlzQXJyYXkoX3NldHNbcmFuZ2VLZXldKSkge1xuXHRcdGNvbnN0IFttaW4sIG1heF0gPSBfc2V0c1tyYW5nZUtleV0gYXMgW251bWJlciwgbnVtYmVyXTtcblxuXHRcdHJldHVybiB2YWx1ZSA+PSBtaW4gJiYgdmFsdWUgPD0gbWF4O1xuXHR9XG5cblx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHJhbmdlIG9yIHZhbHVlIGZvciAke3JhbmdlS2V5fWApO1xufVxuXG5leHBvcnQgY29uc3QgZ3VhcmRzOiBDb21tb25Db3JlRm5HdWFyZHMgPSB7XG5cdGlzQ29sb3IsXG5cdGlzQ29sb3JTcGFjZSxcblx0aXNDb2xvclN0cmluZyxcblx0aXNJblJhbmdlXG59O1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDUgLSBTYW5pdGl6ZSAqKioqKioqKlxuXG5mdW5jdGlvbiBsYWIodmFsdWU6IG51bWJlciwgb3V0cHV0OiAnbCcgfCAnYScgfCAnYicpOiBMQUJfTCB8IExBQl9BIHwgTEFCX0Ige1xuXHRpZiAob3V0cHV0ID09PSAnbCcpIHtcblx0XHRyZXR1cm4gYnJhbmQuYXNMQUJfTChNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAwKSwgMTAwKSkpO1xuXHR9IGVsc2UgaWYgKG91dHB1dCA9PT0gJ2EnKSB7XG5cdFx0cmV0dXJuIGJyYW5kLmFzTEFCX0EoTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgLTEyNSksIDEyNSkpKTtcblx0fSBlbHNlIGlmIChvdXRwdXQgPT09ICdiJykge1xuXHRcdHJldHVybiBicmFuZC5hc0xBQl9CKE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIC0xMjUpLCAxMjUpKSk7XG5cdH0gZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byByZXR1cm4gTEFCIHZhbHVlJyk7XG59XG5cbmZ1bmN0aW9uIHBlcmNlbnRpbGUodmFsdWU6IG51bWJlcik6IFBlcmNlbnRpbGUge1xuXHRjb25zdCByYXdQZXJjZW50aWxlID0gTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgMCksIDEwMCkpO1xuXG5cdHJldHVybiBicmFuZC5hc1BlcmNlbnRpbGUocmF3UGVyY2VudGlsZSk7XG59XG5cbmZ1bmN0aW9uIHJhZGlhbCh2YWx1ZTogbnVtYmVyKTogUmFkaWFsIHtcblx0Y29uc3QgcmF3UmFkaWFsID0gTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgMCksIDM2MCkpICYgMzYwO1xuXG5cdHJldHVybiBicmFuZC5hc1JhZGlhbChyYXdSYWRpYWwpO1xufVxuXG5mdW5jdGlvbiByZ2IodmFsdWU6IG51bWJlcik6IEJ5dGVSYW5nZSB7XG5cdGNvbnN0IHJhd0J5dGVSYW5nZSA9IE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIDApLCAyNTUpKTtcblxuXHRyZXR1cm4gdG9Db2xvclZhbHVlUmFuZ2UocmF3Qnl0ZVJhbmdlLCAnQnl0ZVJhbmdlJyk7XG59XG5cbmV4cG9ydCBjb25zdCBzYW5pdGl6ZSA9IHtcblx0bGFiLFxuXHRwZXJjZW50aWxlLFxuXHRyYWRpYWwsXG5cdHJnYlxufTtcblxuLy8gKioqKioqKiogU0VDVElPTiA2IC0gVmFsaWRhdGUgKioqKioqKipcblxuZnVuY3Rpb24gY29sb3JWYWx1ZXMoY29sb3I6IENvbG9yIHwgU0wgfCBTVik6IGJvb2xlYW4ge1xuXHRjb25zdCBjbG9uZWRDb2xvciA9IGNsb25lKGNvbG9yKTtcblx0Y29uc3QgaXNOdW1lcmljVmFsaWQgPSAodmFsdWU6IHVua25vd24pOiBib29sZWFuID0+XG5cdFx0dHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpO1xuXHRjb25zdCBub3JtYWxpemVQZXJjZW50YWdlID0gKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpOiBudW1iZXIgPT4ge1xuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLmVuZHNXaXRoKCclJykpIHtcblx0XHRcdHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLnNsaWNlKDAsIC0xKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgPyB2YWx1ZSA6IE5hTjtcblx0fTtcblxuXHRzd2l0Y2ggKGNsb25lZENvbG9yLmZvcm1hdCkge1xuXHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0W1xuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmN5YW4sXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubWFnZW50YSxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55ZWxsb3csXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUua2V5XG5cdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmN5YW4gPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5jeWFuIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5tYWdlbnRhID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubWFnZW50YSA8PSAxMDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueWVsbG93ID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueWVsbG93IDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5rZXkgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5rZXkgPD0gMTAwXG5cdFx0XHQpO1xuXHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRyZXR1cm4gL14jWzAtOUEtRmEtZl17Nn0kLy50ZXN0KGNsb25lZENvbG9yLnZhbHVlLmhleCk7XG5cdFx0Y2FzZSAnaHNsJzpcblx0XHRcdGNvbnN0IGlzVmFsaWRIU0xIdWUgPVxuXHRcdFx0XHRpc051bWVyaWNWYWxpZChjbG9uZWRDb2xvci52YWx1ZS5odWUpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmh1ZSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmh1ZSA8PSAzNjA7XG5cdFx0XHRjb25zdCBpc1ZhbGlkSFNMU2F0dXJhdGlvbiA9XG5cdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbikgPj0gMCAmJlxuXHRcdFx0XHRub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24pIDw9IDEwMDtcblx0XHRcdGNvbnN0IGlzVmFsaWRIU0xMaWdodG5lc3MgPSBjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3Ncblx0XHRcdFx0PyBub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLmxpZ2h0bmVzcykgPj0gMCAmJlxuXHRcdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzKSA8PSAxMDBcblx0XHRcdFx0OiB0cnVlO1xuXG5cdFx0XHRyZXR1cm4gaXNWYWxpZEhTTEh1ZSAmJiBpc1ZhbGlkSFNMU2F0dXJhdGlvbiAmJiBpc1ZhbGlkSFNMTGlnaHRuZXNzO1xuXHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRjb25zdCBpc1ZhbGlkSFNWSHVlID1cblx0XHRcdFx0aXNOdW1lcmljVmFsaWQoY2xvbmVkQ29sb3IudmFsdWUuaHVlKSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5odWUgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5odWUgPD0gMzYwO1xuXHRcdFx0Y29uc3QgaXNWYWxpZEhTVlNhdHVyYXRpb24gPVxuXHRcdFx0XHRub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24pID49IDAgJiZcblx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uKSA8PSAxMDA7XG5cdFx0XHRjb25zdCBpc1ZhbGlkSFNWVmFsdWUgPSBjbG9uZWRDb2xvci52YWx1ZS52YWx1ZVxuXHRcdFx0XHQ/IG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUudmFsdWUpID49IDAgJiZcblx0XHRcdFx0XHRub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLnZhbHVlKSA8PSAxMDBcblx0XHRcdFx0OiB0cnVlO1xuXG5cdFx0XHRyZXR1cm4gaXNWYWxpZEhTVkh1ZSAmJiBpc1ZhbGlkSFNWU2F0dXJhdGlvbiAmJiBpc1ZhbGlkSFNWVmFsdWU7XG5cdFx0Y2FzZSAnbGFiJzpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFtcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5sLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmEsXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYlxuXHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5sID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubCA8PSAxMDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYSA+PSAtMTI1ICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmEgPD0gMTI1ICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmIgPj0gLTEyNSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5iIDw9IDEyNVxuXHRcdFx0KTtcblx0XHRjYXNlICdyZ2InOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0W1xuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnJlZCxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ncmVlbixcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ibHVlXG5cdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnJlZCA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnJlZCA8PSAyNTUgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuZ3JlZW4gPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ncmVlbiA8PSAyNTUgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYmx1ZSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmJsdWUgPD0gMjU1XG5cdFx0XHQpO1xuXHRcdGNhc2UgJ3NsJzpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFtcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmxpZ2h0bmVzc1xuXHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbiA8PSAxMDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzIDw9IDEwMFxuXHRcdFx0KTtcblx0XHRjYXNlICdzdic6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRbY2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbiwgY2xvbmVkQ29sb3IudmFsdWUudmFsdWVdLmV2ZXJ5KFxuXHRcdFx0XHRcdGlzTnVtZXJpY1ZhbGlkXG5cdFx0XHRcdCkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24gPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnZhbHVlID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUudmFsdWUgPD0gMTAwXG5cdFx0XHQpO1xuXHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueCxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55LFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnpcblx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueCA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnggPD0gOTUuMDQ3ICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnkgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55IDw9IDEwMC4wICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnogPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS56IDw9IDEwOC44ODNcblx0XHRcdCk7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdGlmIChsb2dNb2RlLmVycm9ycylcblx0XHRcdFx0bG9nZ2VyLmVycm9yKGBVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQ6ICR7Y29sb3IuZm9ybWF0fWApO1xuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4KHZhbHVlOiBzdHJpbmcsIHBhdHRlcm46IFJlZ0V4cCk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gcGF0dGVybi50ZXN0KHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gaGV4Q29tcG9uZW50KHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcblx0cmV0dXJuIGhleCh2YWx1ZSwgL15bQS1GYS1mMC05XXsyfSQvKTtcbn1cblxuZnVuY3Rpb24gaGV4U2V0KHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcblx0cmV0dXJuIC9eI1swLTlhLWZBLUZdezZ9JC8udGVzdCh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHJhbmdlPFQgZXh0ZW5kcyBrZXlvZiB0eXBlb2YgX3NldHM+KFxuXHR2YWx1ZTogbnVtYmVyIHwgc3RyaW5nLFxuXHRyYW5nZUtleTogVFxuKTogdm9pZCB7XG5cdGlmICghaXNJblJhbmdlKHZhbHVlLCByYW5nZUtleSkpIHtcblx0XHRpZiAocmFuZ2VLZXkgPT09ICdIZXhTZXQnIHx8IHJhbmdlS2V5ID09PSAnSGV4Q29tcG9uZW50Jykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHZhbHVlIGZvciAke3JhbmdlS2V5fTogJHt2YWx1ZX1gKTtcblx0XHR9XG5cblx0XHRjb25zdCBbbWluLCBtYXhdID0gX3NldHNbcmFuZ2VLZXldIGFzIFtudW1iZXIsIG51bWJlcl07XG5cblx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRgVmFsdWUgJHt2YWx1ZX0gaXMgb3V0IG9mIHJhbmdlIGZvciAke3JhbmdlS2V5fSBbJHttaW59LCAke21heH1dYFxuXHRcdCk7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlOiBDb21tb25Db3JlRm5WYWxpZGF0ZSA9IHtcblx0Y29sb3JWYWx1ZXMsXG5cdGhleCxcblx0aGV4Q29tcG9uZW50LFxuXHRoZXhTZXQsXG5cdHJhbmdlXG59O1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDYgLSBPdGhlciAqKioqKioqKlxuXG5mdW5jdGlvbiBnZXRGb3JtYXR0ZWRUaW1lc3RhbXAoKTogc3RyaW5nIHtcblx0Y29uc3Qgbm93ID0gbmV3IERhdGUoKTtcblx0Y29uc3QgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuXHRjb25zdCBtb250aCA9IFN0cmluZyhub3cuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsICcwJyk7XG5cdGNvbnN0IGRheSA9IFN0cmluZyhub3cuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCAnMCcpO1xuXHRjb25zdCBob3VycyA9IFN0cmluZyhub3cuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKTtcblx0Y29uc3QgbWludXRlcyA9IFN0cmluZyhub3cuZ2V0TWludXRlcygpKS5wYWRTdGFydCgyLCAnMCcpO1xuXHRjb25zdCBzZWNvbmRzID0gU3RyaW5nKG5vdy5nZXRTZWNvbmRzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG5cblx0cmV0dXJuIGAke3llYXJ9LSR7bW9udGh9LSR7ZGF5fSAke2hvdXJzfToke21pbnV0ZXN9OiR7c2Vjb25kc31gO1xufVxuXG5leHBvcnQgY29uc3Qgb3RoZXI6IENvbW1vbkNvcmVGbk90aGVyID0ge1xuXHRnZXRGb3JtYXR0ZWRUaW1lc3RhbXBcbn07XG5cbmV4cG9ydCB7IGNsb25lIH07XG4iXX0=