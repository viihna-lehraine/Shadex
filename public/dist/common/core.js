// File: common/core.js
import { dataSets as sets } from '../data/sets.js';
const _sets = sets;
// ******** SECTION 0 - Brand ********
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
// ******** SECTION 1 ********
function initializeDefaultColors() {
    return {
        cmyk: {
            value: {
                cyan: brand.asPercentile(0),
                magenta: brand.asPercentile(0),
                yellow: brand.asPercentile(0),
                key: brand.asPercentile(0),
                alpha: brand.asAlphaRange(1)
            },
            format: 'cmyk'
        },
        hex: {
            value: {
                hex: brand.asHexSet('#000000'),
                alpha: brand.asHexComponent('FF'),
                numAlpha: brand.asAlphaRange(1)
            },
            format: 'hex'
        },
        hsl: {
            value: {
                hue: brand.asRadial(0),
                saturation: brand.asPercentile(0),
                lightness: brand.asPercentile(0),
                alpha: brand.asAlphaRange(1)
            },
            format: 'hsl'
        },
        hsv: {
            value: {
                hue: brand.asRadial(0),
                saturation: brand.asPercentile(0),
                value: brand.asPercentile(0),
                alpha: brand.asAlphaRange(1)
            },
            format: 'hsv'
        },
        lab: {
            value: {
                l: brand.asLAB_L(0),
                a: brand.asLAB_A(0),
                b: brand.asLAB_B(0),
                alpha: brand.asAlphaRange(1)
            },
            format: 'lab'
        },
        rgb: {
            value: {
                red: brand.asByteRange(0),
                green: brand.asByteRange(0),
                blue: brand.asByteRange(0),
                alpha: brand.asAlphaRange(1)
            },
            format: 'rgb'
        },
        sl: {
            value: {
                saturation: brand.asPercentile(0),
                lightness: brand.asPercentile(0),
                alpha: brand.asAlphaRange(1)
            },
            format: 'sl'
        },
        sv: {
            value: {
                saturation: brand.asPercentile(0),
                value: brand.asPercentile(0),
                alpha: brand.asAlphaRange(1)
            },
            format: 'sv'
        },
        xyz: {
            value: {
                x: brand.asXYZ_X(0),
                y: brand.asXYZ_Y(0),
                z: brand.asXYZ_Z(0),
                alpha: brand.asAlphaRange(1)
            },
            format: 'xyz'
        }
    };
}
// ******** SECTION 1 ********
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
            console.error('Invalid HSL custom color. Expected format: hsl(H, S%, L%, A)\ncaller: parseCustomColor()');
            return null;
        }
    }
    catch (error) {
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
async function colorStringToColor(colorString) {
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
            console.error('Unsupported format for colorStringToColor');
            const defaultColors = initializeDefaultColors();
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
async function colorToCSSColorString(color) {
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
                console.error(`Unexpected color format: ${color.format}`);
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
    throw new Error(`Invalid range or value for ${String(rangeKey)}`);
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
// ******** SECTION 5.1 - Validate *********
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
            throw new Error(`Invalid value for ${String(rangeKey)}: ${value}`);
        }
        const [min, max] = _sets[rangeKey];
        throw new Error(`Value ${value} is out of range for ${String(rangeKey)} [${min}, ${max}]`);
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
export const other = { getFormattedTimestamp };
export { clone };
// ******** SECTION 7 - Final Export ********
export const coreUtils = {
    base,
    brand,
    brandColor,
    convert,
    guards,
    ...other,
    sanitize,
    validate
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vY29yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1QkFBdUI7QUErQ3ZCLE9BQU8sRUFBRSxRQUFRLElBQUksSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFbkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBRW5CLHNDQUFzQztBQUV0QyxTQUFTLFlBQVksQ0FBQyxLQUFhO0lBQ2xDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBRXBDLE9BQU8sS0FBbUIsQ0FBQztBQUM1QixDQUFDO0FBRUQsU0FBUyxTQUFTLENBQ2pCLEtBQWEsRUFDYixRQUFXO0lBRVgsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFaEMsT0FBTyxLQUF1QixDQUFDO0FBQ2hDLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxLQUFhO0lBQ2pDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBRW5DLE9BQU8sS0FBa0IsQ0FBQztBQUMzQixDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsS0FBYTtJQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELE9BQU8sS0FBZ0MsQ0FBQztBQUN6QyxDQUFDO0FBRUQsU0FBUyxRQUFRLENBQUMsS0FBYTtJQUM5QixJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3JDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBQ0QsSUFBSSxDQUFD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MUQsSUFBSTtJQUNKLEtBQUs7SUFDTCxVQUFVO0lBQ1YsT0FBTztJQUNQLE1BQU07SUFDTixHQUFHLEtBQUs7SUFDUixRQUFRO0lBQ1IsUUFBUTtDQUNDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBjb21tb24vY29yZS5qc1xuXG5pbXBvcnQge1xuXHRBbHBoYVJhbmdlLFxuXHRCeXRlUmFuZ2UsXG5cdENNWUssXG5cdENNWUtfU3RyaW5nUHJvcHMsXG5cdENvbG9yLFxuXHRDb2xvclNwYWNlLFxuXHRDb2xvcl9TdHJpbmdQcm9wcyxcblx0Q29tbW9uRm5fTWFzdGVySW50ZXJmYWNlLFxuXHRIZXgsXG5cdEhleENvbXBvbmVudCxcblx0SGV4U2V0LFxuXHRIZXhfU3RyaW5nUHJvcHMsXG5cdEhTTCxcblx0SFNMX1N0cmluZ1Byb3BzLFxuXHRIU1YsXG5cdEhTVl9TdHJpbmdQcm9wcyxcblx0TEFCLFxuXHRMQUJfU3RyaW5nUHJvcHMsXG5cdExBQl9MLFxuXHRMQUJfQSxcblx0TEFCX0IsXG5cdE51bWVyaWNSYW5nZUtleSxcblx0UGVyY2VudGlsZSxcblx0UmFkaWFsLFxuXHRSYW5nZUtleU1hcCxcblx0UkdCLFxuXHRSR0JfU3RyaW5nUHJvcHMsXG5cdFNMLFxuXHRTVixcblx0VW5icmFuZGVkQ01ZSyxcblx0VW5icmFuZGVkSGV4LFxuXHRVbmJyYW5kZWRIU0wsXG5cdFVuYnJhbmRlZEhTVixcblx0VW5icmFuZGVkTEFCLFxuXHRVbmJyYW5kZWRSR0IsXG5cdFVuYnJhbmRlZFNMLFxuXHRVbmJyYW5kZWRTVixcblx0VW5icmFuZGVkWFlaLFxuXHRYWVosXG5cdFhZWl9TdHJpbmdQcm9wcyxcblx0WFlaX1gsXG5cdFhZWl9ZLFxuXHRYWVpfWlxufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhU2V0cyBhcyBzZXRzIH0gZnJvbSAnLi4vZGF0YS9zZXRzLmpzJztcblxuY29uc3QgX3NldHMgPSBzZXRzO1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDAgLSBCcmFuZCAqKioqKioqKlxuXG5mdW5jdGlvbiBhc0FscGhhUmFuZ2UodmFsdWU6IG51bWJlcik6IEFscGhhUmFuZ2Uge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ0FscGhhUmFuZ2UnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgQWxwaGFSYW5nZTtcbn1cblxuZnVuY3Rpb24gYXNCcmFuZGVkPFQgZXh0ZW5kcyBrZXlvZiBSYW5nZUtleU1hcD4oXG5cdHZhbHVlOiBudW1iZXIsXG5cdHJhbmdlS2V5OiBUXG4pOiBSYW5nZUtleU1hcFtUXSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCByYW5nZUtleSk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIFJhbmdlS2V5TWFwW1RdO1xufVxuXG5mdW5jdGlvbiBhc0J5dGVSYW5nZSh2YWx1ZTogbnVtYmVyKTogQnl0ZVJhbmdlIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdCeXRlUmFuZ2UnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgQnl0ZVJhbmdlO1xufVxuXG5mdW5jdGlvbiBhc0hleENvbXBvbmVudCh2YWx1ZTogc3RyaW5nKTogSGV4Q29tcG9uZW50IHtcblx0aWYgKCF2YWxpZGF0ZS5oZXhDb21wb25lbnQodmFsdWUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIEhleENvbXBvbmVudCB2YWx1ZTogJHt2YWx1ZX1gKTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZSBhcyB1bmtub3duIGFzIEhleENvbXBvbmVudDtcbn1cblxuZnVuY3Rpb24gYXNIZXhTZXQodmFsdWU6IHN0cmluZyk6IEhleFNldCB7XG5cdGlmICgvXiNbMC05YS1mQS1GXXs4fSQvLnRlc3QodmFsdWUpKSB7XG5cdFx0dmFsdWUgPSB2YWx1ZS5zbGljZSgwLCA3KTtcblx0fVxuXHRpZiAoIXZhbGlkYXRlLmhleFNldCh2YWx1ZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgSGV4U2V0IHZhbHVlOiAke3ZhbHVlfWApO1xuXHR9XG5cdHJldHVybiB2YWx1ZSBhcyBIZXhTZXQ7XG59XG5cbmZ1bmN0aW9uIGFzTEFCX0wodmFsdWU6IG51bWJlcik6IExBQl9MIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdMQUJfTCcpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBMQUJfTDtcbn1cblxuZnVuY3Rpb24gYXNMQUJfQSh2YWx1ZTogbnVtYmVyKTogTEFCX0Ege1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ0xBQl9BJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIExBQl9BO1xufVxuXG5mdW5jdGlvbiBhc0xBQl9CKHZhbHVlOiBudW1iZXIpOiBMQUJfQiB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnTEFCX0InKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgTEFCX0I7XG59XG5cbmZ1bmN0aW9uIGFzUGVyY2VudGlsZSh2YWx1ZTogbnVtYmVyKTogUGVyY2VudGlsZSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnUGVyY2VudGlsZScpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBQZXJjZW50aWxlO1xufVxuXG5mdW5jdGlvbiBhc1JhZGlhbCh2YWx1ZTogbnVtYmVyKTogUmFkaWFsIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdSYWRpYWwnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgUmFkaWFsO1xufVxuXG5mdW5jdGlvbiBhc1hZWl9YKHZhbHVlOiBudW1iZXIpOiBYWVpfWCB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnWFlaX1gnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgWFlaX1g7XG59XG5cbmZ1bmN0aW9uIGFzWFlaX1kodmFsdWU6IG51bWJlcik6IFhZWl9ZIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdYWVpfWScpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBYWVpfWTtcbn1cblxuZnVuY3Rpb24gYXNYWVpfWih2YWx1ZTogbnVtYmVyKTogWFlaX1oge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ1hZWl9aJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIFhZWl9aO1xufVxuXG5leHBvcnQgY29uc3QgYnJhbmQ6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnY29yZSddWydicmFuZCddID0ge1xuXHRhc0FscGhhUmFuZ2UsXG5cdGFzQnJhbmRlZCxcblx0YXNCeXRlUmFuZ2UsXG5cdGFzSGV4Q29tcG9uZW50LFxuXHRhc0hleFNldCxcblx0YXNMQUJfTCxcblx0YXNMQUJfQSxcblx0YXNMQUJfQixcblx0YXNQZXJjZW50aWxlLFxuXHRhc1JhZGlhbCxcblx0YXNYWVpfWCxcblx0YXNYWVpfWSxcblx0YXNYWVpfWlxufTtcblxuLy8gKioqKioqKiogU0VDVElPTiAxICoqKioqKioqXG5cbmZ1bmN0aW9uIGluaXRpYWxpemVEZWZhdWx0Q29sb3JzKCkge1xuXHRyZXR1cm4ge1xuXHRcdGNteWs6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGN5YW46IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0bWFnZW50YTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHR5ZWxsb3c6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0a2V5OiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdH0sXG5cdFx0aGV4OiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRoZXg6IGJyYW5kLmFzSGV4U2V0KCcjMDAwMDAwJyksXG5cdFx0XHRcdGFscGhhOiBicmFuZC5hc0hleENvbXBvbmVudCgnRkYnKSxcblx0XHRcdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHR9LFxuXHRcdGhzbDoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbCgwKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHR9LFxuXHRcdGhzdjoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbCgwKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdH0sXG5cdFx0bGFiOiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRsOiBicmFuZC5hc0xBQl9MKDApLFxuXHRcdFx0XHRhOiBicmFuZC5hc0xBQl9BKDApLFxuXHRcdFx0XHRiOiBicmFuZC5hc0xBQl9CKDApLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdH0sXG5cdFx0cmdiOiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UoMCksXG5cdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdH0sXG5cdFx0c2w6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdzbCdcblx0XHR9LFxuXHRcdHN2OiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdHZhbHVlOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdzdidcblx0XHR9LFxuXHRcdHh5ejoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0eDogYnJhbmQuYXNYWVpfWCgwKSxcblx0XHRcdFx0eTogYnJhbmQuYXNYWVpfWSgwKSxcblx0XHRcdFx0ejogYnJhbmQuYXNYWVpfWigwKSxcblx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHR9XG5cdH07XG59XG5cbi8vICoqKioqKioqIFNFQ1RJT04gMSAqKioqKioqKlxuXG5mdW5jdGlvbiBjbGFtcFRvUmFuZ2UodmFsdWU6IG51bWJlciwgcmFuZ2VLZXk6IE51bWVyaWNSYW5nZUtleSk6IG51bWJlciB7XG5cdGNvbnN0IFttaW4sIG1heF0gPSBfc2V0c1tyYW5nZUtleV07XG5cblx0cmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCBtaW4pLCBtYXgpO1xufVxuXG5mdW5jdGlvbiBjbG9uZTxUPih2YWx1ZTogVCk6IFQge1xuXHRyZXR1cm4gc3RydWN0dXJlZENsb25lKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gZGVib3VuY2U8VCBleHRlbmRzICguLi5hcmdzOiBQYXJhbWV0ZXJzPFQ+KSA9PiB2b2lkPihcblx0ZnVuYzogVCxcblx0ZGVsYXk6IG51bWJlclxuKSB7XG5cdGxldCB0aW1lb3V0OiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuXG5cdHJldHVybiAoLi4uYXJnczogUGFyYW1ldGVyczxUPik6IHZvaWQgPT4ge1xuXHRcdGlmICh0aW1lb3V0KSBjbGVhclRpbWVvdXQodGltZW91dCk7XG5cblx0XHR0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRmdW5jKC4uLmFyZ3MpO1xuXHRcdH0sIGRlbGF5KTtcblx0fTtcbn1cblxuZnVuY3Rpb24gcGFyc2VDdXN0b21Db2xvcihyYXdWYWx1ZTogc3RyaW5nKTogSFNMIHwgbnVsbCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgbWF0Y2ggPSByYXdWYWx1ZS5tYXRjaChcblx0XHRcdC9oc2xcXCgoXFxkKyksXFxzKihcXGQrKSU/LFxccyooXFxkKyklPyxcXHMqKFxcZCpcXC4/XFxkKylcXCkvXG5cdFx0KTtcblxuXHRcdGlmIChtYXRjaCkge1xuXHRcdFx0Y29uc3QgWywgaHVlLCBzYXR1cmF0aW9uLCBsaWdodG5lc3MsIGFscGhhXSA9IG1hdGNoO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwocGFyc2VJbnQoaHVlKSksXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlSW50KHNhdHVyYXRpb24pKSxcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUludChsaWdodG5lc3MpKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKHBhcnNlRmxvYXQoYWxwaGEpKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHQnSW52YWxpZCBIU0wgY3VzdG9tIGNvbG9yLiBFeHBlY3RlZCBmb3JtYXQ6IGhzbChILCBTJSwgTCUsIEEpXFxuY2FsbGVyOiBwYXJzZUN1c3RvbUNvbG9yKCknXG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgcGFyc2VDdXN0b21Db2xvciBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBiYXNlOiBDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2VbJ2NvcmUnXVsnYmFzZSddID0ge1xuXHRjbGFtcFRvUmFuZ2UsXG5cdGNsb25lLFxuXHRkZWJvdW5jZSxcblx0cGFyc2VDdXN0b21Db2xvclxufSBhcyBjb25zdDtcblxuLy8gKioqKioqKiogU0VDVElPTiAyIC0gQnJhbmQgQ29sb3IgKioqKioqKipcblxuZnVuY3Rpb24gYXNDTVlLKGNvbG9yOiBVbmJyYW5kZWRDTVlLKTogQ01ZSyB7XG5cdGNvbnN0IGJyYW5kZWRDeWFuID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLmN5YW4pO1xuXHRjb25zdCBicmFuZGVkTWFnZW50YSA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5tYWdlbnRhKTtcblx0Y29uc3QgYnJhbmRlZFllbGxvdyA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS55ZWxsb3cpO1xuXHRjb25zdCBicmFuZGVkS2V5ID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLmtleSk7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0Y3lhbjogYnJhbmRlZEN5YW4sXG5cdFx0XHRtYWdlbnRhOiBicmFuZGVkTWFnZW50YSxcblx0XHRcdHllbGxvdzogYnJhbmRlZFllbGxvdyxcblx0XHRcdGtleTogYnJhbmRlZEtleSxcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ2NteWsnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzSGV4KGNvbG9yOiBVbmJyYW5kZWRIZXgpOiBIZXgge1xuXHRsZXQgaGV4ID0gY29sb3IudmFsdWUuaGV4O1xuXG5cdGlmICghaGV4LnN0YXJ0c1dpdGgoJyMnKSkgaGV4ID0gYCMke2hleH1gO1xuXG5cdGlmICghL14jWzAtOUEtRmEtZl17OH0kLy50ZXN0KGhleCkpXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIEhleCBjb2xvciBmb3JtYXQ6ICR7aGV4fWApO1xuXG5cdGNvbnN0IGhleE1haW4gPSBoZXguc2xpY2UoMCwgNyk7XG5cdGNvbnN0IGFscGhhID0gaGV4LnNsaWNlKDcsIDkpO1xuXG5cdGNvbnN0IGJyYW5kZWRIZXggPSBicmFuZC5hc0hleFNldChoZXhNYWluKTtcblx0Y29uc3QgYnJhbmRlZEhleEFscGhhID0gYnJhbmQuYXNIZXhDb21wb25lbnQoYWxwaGEpO1xuXHRjb25zdCBicmFuZGVkTnVtQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUubnVtQWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdGhleDogYnJhbmRlZEhleCxcblx0XHRcdGFscGhhOiBicmFuZGVkSGV4QWxwaGEsXG5cdFx0XHRudW1BbHBoYTogYnJhbmRlZE51bUFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdoZXgnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzSFNMKGNvbG9yOiBVbmJyYW5kZWRIU0wpOiBIU0wge1xuXHRjb25zdCBicmFuZGVkSHVlID0gYnJhbmQuYXNSYWRpYWwoY29sb3IudmFsdWUuaHVlKTtcblx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUuc2F0dXJhdGlvbik7XG5cdGNvbnN0IGJyYW5kZWRMaWdodG5lc3MgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUubGlnaHRuZXNzKTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRodWU6IGJyYW5kZWRIdWUsXG5cdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdGxpZ2h0bmVzczogYnJhbmRlZExpZ2h0bmVzcyxcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ2hzbCdcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNIU1YoY29sb3I6IFVuYnJhbmRlZEhTVik6IEhTViB7XG5cdGNvbnN0IGJyYW5kZWRIdWUgPSBicmFuZC5hc1JhZGlhbChjb2xvci52YWx1ZS5odWUpO1xuXHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5zYXR1cmF0aW9uKTtcblx0Y29uc3QgYnJhbmRlZFZhbHVlID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnZhbHVlKTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRodWU6IGJyYW5kZWRIdWUsXG5cdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdHZhbHVlOiBicmFuZGVkVmFsdWUsXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdoc3YnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzTEFCKGNvbG9yOiBVbmJyYW5kZWRMQUIpOiBMQUIge1xuXHRjb25zdCBicmFuZGVkTCA9IGJyYW5kLmFzTEFCX0woY29sb3IudmFsdWUubCk7XG5cdGNvbnN0IGJyYW5kZWRBID0gYnJhbmQuYXNMQUJfQShjb2xvci52YWx1ZS5hKTtcblx0Y29uc3QgYnJhbmRlZEIgPSBicmFuZC5hc0xBQl9CKGNvbG9yLnZhbHVlLmIpO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdGw6IGJyYW5kZWRMLFxuXHRcdFx0YTogYnJhbmRlZEEsXG5cdFx0XHRiOiBicmFuZGVkQixcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ2xhYidcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNSR0IoY29sb3I6IFVuYnJhbmRlZFJHQik6IFJHQiB7XG5cdGNvbnN0IGJyYW5kZWRSZWQgPSBicmFuZC5hc0J5dGVSYW5nZShjb2xvci52YWx1ZS5yZWQpO1xuXHRjb25zdCBicmFuZGVkR3JlZW4gPSBicmFuZC5hc0J5dGVSYW5nZShjb2xvci52YWx1ZS5ncmVlbik7XG5cdGNvbnN0IGJyYW5kZWRCbHVlID0gYnJhbmQuYXNCeXRlUmFuZ2UoY29sb3IudmFsdWUuYmx1ZSk7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0cmVkOiBicmFuZGVkUmVkLFxuXHRcdFx0Z3JlZW46IGJyYW5kZWRHcmVlbixcblx0XHRcdGJsdWU6IGJyYW5kZWRCbHVlLFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAncmdiJ1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc1NMKGNvbG9yOiBVbmJyYW5kZWRTTCk6IFNMIHtcblx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUuc2F0dXJhdGlvbik7XG5cdGNvbnN0IGJyYW5kZWRMaWdodG5lc3MgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUubGlnaHRuZXNzKTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdGxpZ2h0bmVzczogYnJhbmRlZExpZ2h0bmVzcyxcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ3NsJ1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc1NWKGNvbG9yOiBVbmJyYW5kZWRTVik6IFNWIHtcblx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUuc2F0dXJhdGlvbik7XG5cdGNvbnN0IGJyYW5kZWRWYWx1ZSA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS52YWx1ZSk7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0c2F0dXJhdGlvbjogYnJhbmRlZFNhdHVyYXRpb24sXG5cdFx0XHR2YWx1ZTogYnJhbmRlZFZhbHVlLFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnc3YnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzWFlaKGNvbG9yOiBVbmJyYW5kZWRYWVopOiBYWVoge1xuXHRjb25zdCBicmFuZGVkWCA9IGJyYW5kLmFzWFlaX1goY29sb3IudmFsdWUueCk7XG5cdGNvbnN0IGJyYW5kZWRZID0gYnJhbmQuYXNYWVpfWShjb2xvci52YWx1ZS55KTtcblx0Y29uc3QgYnJhbmRlZFogPSBicmFuZC5hc1hZWl9aKGNvbG9yLnZhbHVlLnopO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdHg6IGJyYW5kZWRYLFxuXHRcdFx0eTogYnJhbmRlZFksXG5cdFx0XHR6OiBicmFuZGVkWixcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ3h5eidcblx0fTtcbn1cblxuZXhwb3J0IGNvbnN0IGJyYW5kQ29sb3I6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnY29yZSddWydicmFuZENvbG9yJ10gPSB7XG5cdGFzQ01ZSyxcblx0YXNIZXgsXG5cdGFzSFNMLFxuXHRhc0hTVixcblx0YXNMQUIsXG5cdGFzUkdCLFxuXHRhc1NMLFxuXHRhc1NWLFxuXHRhc1hZWlxufTtcblxuLy8gKioqKioqKiogU0VDVElPTiAzIC0gQ29udmVydCAqKioqKioqKlxuXG5mdW5jdGlvbiBjbXlrU3RyaW5nVG9WYWx1ZShjbXlrOiBDTVlLX1N0cmluZ1Byb3BzWyd2YWx1ZSddKTogQ01ZS1sndmFsdWUnXSB7XG5cdHJldHVybiB7XG5cdFx0Y3lhbjogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoY215ay5jeWFuKSAvIDEwMCksXG5cdFx0bWFnZW50YTogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoY215ay5tYWdlbnRhKSAvIDEwMCksXG5cdFx0eWVsbG93OiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VGbG9hdChjbXlrLnllbGxvdykgLyAxMDApLFxuXHRcdGtleTogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoY215ay5rZXkpIC8gMTAwKSxcblx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKHBhcnNlRmxvYXQoY215ay5hbHBoYSkpXG5cdH07XG59XG5cbmZ1bmN0aW9uIGNteWtWYWx1ZVRvU3RyaW5nKGNteWs6IENNWUtbJ3ZhbHVlJ10pOiBDTVlLX1N0cmluZ1Byb3BzWyd2YWx1ZSddIHtcblx0cmV0dXJuIHtcblx0XHRjeWFuOiBgJHtjbXlrLmN5YW4gKiAxMDB9JWAsXG5cdFx0bWFnZW50YTogYCR7Y215ay5tYWdlbnRhICogMTAwfSVgLFxuXHRcdHllbGxvdzogYCR7Y215ay55ZWxsb3cgKiAxMDB9JWAsXG5cdFx0a2V5OiBgJHtjbXlrLmtleSAqIDEwMH0lYCxcblx0XHRhbHBoYTogYCR7Y215ay5hbHBoYX1gXG5cdH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNvbG9yU3RyaW5nVG9Db2xvcihcblx0Y29sb3JTdHJpbmc6IENvbG9yX1N0cmluZ1Byb3BzXG4pOiBQcm9taXNlPENvbG9yPiB7XG5cdGNvbnN0IGNsb25lZENvbG9yID0gY2xvbmUoY29sb3JTdHJpbmcpO1xuXG5cdGNvbnN0IHBhcnNlVmFsdWUgPSAodmFsdWU6IHN0cmluZyB8IG51bWJlcik6IG51bWJlciA9PlxuXHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuZW5kc1dpdGgoJyUnKVxuXHRcdFx0PyBwYXJzZUZsb2F0KHZhbHVlLnNsaWNlKDAsIC0xKSlcblx0XHRcdDogTnVtYmVyKHZhbHVlKTtcblxuXHRjb25zdCBuZXdWYWx1ZSA9IE9iamVjdC5lbnRyaWVzKGNsb25lZENvbG9yLnZhbHVlKS5yZWR1Y2UoXG5cdFx0KGFjYywgW2tleSwgdmFsXSkgPT4ge1xuXHRcdFx0YWNjW2tleSBhcyBrZXlvZiAodHlwZW9mIGNsb25lZENvbG9yKVsndmFsdWUnXV0gPSBwYXJzZVZhbHVlKFxuXHRcdFx0XHR2YWxcblx0XHRcdCkgYXMgbmV2ZXI7XG5cdFx0XHRyZXR1cm4gYWNjO1xuXHRcdH0sXG5cdFx0e30gYXMgUmVjb3JkPGtleW9mICh0eXBlb2YgY2xvbmVkQ29sb3IpWyd2YWx1ZSddLCBudW1iZXI+XG5cdCk7XG5cblx0c3dpdGNoIChjbG9uZWRDb2xvci5mb3JtYXQpIHtcblx0XHRjYXNlICdjbXlrJzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ2NteWsnLCB2YWx1ZTogbmV3VmFsdWUgYXMgQ01ZS1sndmFsdWUnXSB9O1xuXHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdoc2wnLCB2YWx1ZTogbmV3VmFsdWUgYXMgSFNMWyd2YWx1ZSddIH07XG5cdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ2hzdicsIHZhbHVlOiBuZXdWYWx1ZSBhcyBIU1ZbJ3ZhbHVlJ10gfTtcblx0XHRjYXNlICdzbCc6XG5cdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdzbCcsIHZhbHVlOiBuZXdWYWx1ZSBhcyBTTFsndmFsdWUnXSB9O1xuXHRcdGNhc2UgJ3N2Jzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ3N2JywgdmFsdWU6IG5ld1ZhbHVlIGFzIFNWWyd2YWx1ZSddIH07XG5cdFx0ZGVmYXVsdDpcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ1Vuc3VwcG9ydGVkIGZvcm1hdCBmb3IgY29sb3JTdHJpbmdUb0NvbG9yJyk7XG5cblx0XHRcdGNvbnN0IGRlZmF1bHRDb2xvcnMgPSBpbml0aWFsaXplRGVmYXVsdENvbG9ycygpO1xuXG5cdFx0XHRjb25zdCB1bmJyYW5kZWRIU0wgPSBkZWZhdWx0Q29sb3JzLmhzbDtcblxuXHRcdFx0Y29uc3QgYnJhbmRlZEh1ZSA9IGJyYW5kLmFzUmFkaWFsKHVuYnJhbmRlZEhTTC52YWx1ZS5odWUpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdHVuYnJhbmRlZEhTTC52YWx1ZS5zYXR1cmF0aW9uXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZExpZ2h0bmVzcyA9IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0dW5icmFuZGVkSFNMLnZhbHVlLmxpZ2h0bmVzc1xuXHRcdFx0KTtcblx0XHRcdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZSh1bmJyYW5kZWRIU0wudmFsdWUuYWxwaGEpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmRlZEh1ZSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kZWRMaWdodG5lc3MsXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9O1xuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNvbG9yVG9DU1NDb2xvclN0cmluZyhjb2xvcjogQ29sb3IpOiBQcm9taXNlPHN0cmluZz4ge1xuXHR0cnkge1xuXHRcdHN3aXRjaCAoY29sb3IuZm9ybWF0KSB7XG5cdFx0XHRjYXNlICdjbXlrJzpcblx0XHRcdFx0cmV0dXJuIGBjbXlrKCR7Y29sb3IudmFsdWUuY3lhbn0sICR7Y29sb3IudmFsdWUubWFnZW50YX0sICR7Y29sb3IudmFsdWUueWVsbG93fSwgJHtjb2xvci52YWx1ZS5rZXl9LCAke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0cmV0dXJuIFN0cmluZyhjb2xvci52YWx1ZS5oZXgpO1xuXHRcdFx0Y2FzZSAnaHNsJzpcblx0XHRcdFx0cmV0dXJuIGBoc2woJHtjb2xvci52YWx1ZS5odWV9LCAke2NvbG9yLnZhbHVlLnNhdHVyYXRpb259JSwgJHtjb2xvci52YWx1ZS5saWdodG5lc3N9JSwgJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdHJldHVybiBgaHN2KCR7Y29sb3IudmFsdWUuaHVlfSwgJHtjb2xvci52YWx1ZS5zYXR1cmF0aW9ufSUsICR7Y29sb3IudmFsdWUudmFsdWV9JSwgJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBgbGFiKCR7Y29sb3IudmFsdWUubH0sICR7Y29sb3IudmFsdWUuYX0sICR7Y29sb3IudmFsdWUuYn0sICR7Y29sb3IudmFsdWUuYWxwaGF9KWA7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gYHJnYigke2NvbG9yLnZhbHVlLnJlZH0sICR7Y29sb3IudmFsdWUuZ3JlZW59LCAke2NvbG9yLnZhbHVlLmJsdWV9LCAke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIGB4eXooJHtjb2xvci52YWx1ZS54fSwgJHtjb2xvci52YWx1ZS55fSwgJHtjb2xvci52YWx1ZS56fSwgJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYFVuZXhwZWN0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yLmZvcm1hdH1gKTtcblxuXHRcdFx0XHRyZXR1cm4gJyNGRkZGRkZGRic7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgZ2V0Q1NTQ29sb3JTdHJpbmcgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4QWxwaGFUb051bWVyaWNBbHBoYShoZXhBbHBoYTogc3RyaW5nKTogbnVtYmVyIHtcblx0cmV0dXJuIHBhcnNlSW50KGhleEFscGhhLCAxNikgLyAyNTU7XG59XG5cbmZ1bmN0aW9uIGhleFN0cmluZ1RvVmFsdWUoaGV4OiBIZXhfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10pOiBIZXhbJ3ZhbHVlJ10ge1xuXHRyZXR1cm4ge1xuXHRcdGhleDogYnJhbmQuYXNIZXhTZXQoaGV4LmhleCksXG5cdFx0YWxwaGE6IGJyYW5kLmFzSGV4Q29tcG9uZW50KGhleC5hbHBoYSksXG5cdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShwYXJzZUZsb2F0KGhleC5udW1BbHBoYSkpXG5cdH07XG59XG5cbmZ1bmN0aW9uIGhleFZhbHVlVG9TdHJpbmcoaGV4OiBIZXhbJ3ZhbHVlJ10pOiBIZXhfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10ge1xuXHRyZXR1cm4ge1xuXHRcdGhleDogaGV4LmhleCxcblx0XHRhbHBoYTogYCR7aGV4LmFscGhhfWAsXG5cdFx0bnVtQWxwaGE6IGAke2hleC5udW1BbHBoYX1gXG5cdH07XG59XG5cbmZ1bmN0aW9uIGhzbFN0cmluZ1RvVmFsdWUoaHNsOiBIU0xfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10pOiBIU0xbJ3ZhbHVlJ10ge1xuXHRyZXR1cm4ge1xuXHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwocGFyc2VGbG9hdChoc2wuaHVlKSksXG5cdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoaHNsLnNhdHVyYXRpb24pIC8gMTAwKSxcblx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUZsb2F0KGhzbC5saWdodG5lc3MpIC8gMTAwKSxcblx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKHBhcnNlRmxvYXQoaHNsLmFscGhhKSlcblx0fTtcbn1cblxuZnVuY3Rpb24gaHNsVmFsdWVUb1N0cmluZyhoc2w6IEhTTFsndmFsdWUnXSk6IEhTTF9TdHJpbmdQcm9wc1sndmFsdWUnXSB7XG5cdHJldHVybiB7XG5cdFx0aHVlOiBgJHtoc2wuaHVlfcKwYCxcblx0XHRzYXR1cmF0aW9uOiBgJHtoc2wuc2F0dXJhdGlvbiAqIDEwMH0lYCxcblx0XHRsaWdodG5lc3M6IGAke2hzbC5saWdodG5lc3MgKiAxMDB9JWAsXG5cdFx0YWxwaGE6IGAke2hzbC5hbHBoYX1gXG5cdH07XG59XG5cbmZ1bmN0aW9uIGhzdlN0cmluZ1RvVmFsdWUoaHN2OiBIU1ZfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10pOiBIU1ZbJ3ZhbHVlJ10ge1xuXHRyZXR1cm4ge1xuXHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwocGFyc2VGbG9hdChoc3YuaHVlKSksXG5cdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoaHN2LnNhdHVyYXRpb24pIC8gMTAwKSxcblx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoaHN2LnZhbHVlKSAvIDEwMCksXG5cdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShwYXJzZUZsb2F0KGhzdi5hbHBoYSkpXG5cdH07XG59XG5cbmZ1bmN0aW9uIGhzdlZhbHVlVG9TdHJpbmcoaHN2OiBIU1ZbJ3ZhbHVlJ10pOiBIU1ZfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10ge1xuXHRyZXR1cm4ge1xuXHRcdGh1ZTogYCR7aHN2Lmh1ZX3CsGAsXG5cdFx0c2F0dXJhdGlvbjogYCR7aHN2LnNhdHVyYXRpb24gKiAxMDB9JWAsXG5cdFx0dmFsdWU6IGAke2hzdi52YWx1ZSAqIDEwMH0lYCxcblx0XHRhbHBoYTogYCR7aHN2LmFscGhhfWBcblx0fTtcbn1cblxuZnVuY3Rpb24gbGFiVmFsdWVUb1N0cmluZyhsYWI6IExBQlsndmFsdWUnXSk6IExBQl9TdHJpbmdQcm9wc1sndmFsdWUnXSB7XG5cdHJldHVybiB7XG5cdFx0bDogYCR7bGFiLmx9YCxcblx0XHRhOiBgJHtsYWIuYX1gLFxuXHRcdGI6IGAke2xhYi5ifWAsXG5cdFx0YWxwaGE6IGAke2xhYi5hbHBoYX1gXG5cdH07XG59XG5cbmZ1bmN0aW9uIGxhYlN0cmluZ1RvVmFsdWUobGFiOiBMQUJfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10pOiBMQUJbJ3ZhbHVlJ10ge1xuXHRyZXR1cm4ge1xuXHRcdGw6IGJyYW5kLmFzTEFCX0wocGFyc2VGbG9hdChsYWIubCkpLFxuXHRcdGE6IGJyYW5kLmFzTEFCX0EocGFyc2VGbG9hdChsYWIuYSkpLFxuXHRcdGI6IGJyYW5kLmFzTEFCX0IocGFyc2VGbG9hdChsYWIuYikpLFxuXHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UocGFyc2VGbG9hdChsYWIuYWxwaGEpKVxuXHR9O1xufVxuXG5mdW5jdGlvbiByZ2JWYWx1ZVRvU3RyaW5nKHJnYjogUkdCWyd2YWx1ZSddKTogUkdCX1N0cmluZ1Byb3BzWyd2YWx1ZSddIHtcblx0cmV0dXJuIHtcblx0XHRyZWQ6IGAke3JnYi5yZWR9YCxcblx0XHRncmVlbjogYCR7cmdiLmdyZWVufWAsXG5cdFx0Ymx1ZTogYCR7cmdiLmJsdWV9YCxcblx0XHRhbHBoYTogYCR7cmdiLmFscGhhfWBcblx0fTtcbn1cblxuZnVuY3Rpb24gcmdiU3RyaW5nVG9WYWx1ZShyZ2I6IFJHQl9TdHJpbmdQcm9wc1sndmFsdWUnXSk6IFJHQlsndmFsdWUnXSB7XG5cdHJldHVybiB7XG5cdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZShwYXJzZUZsb2F0KHJnYi5yZWQpKSxcblx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UocGFyc2VGbG9hdChyZ2IuZ3JlZW4pKSxcblx0XHRibHVlOiBicmFuZC5hc0J5dGVSYW5nZShwYXJzZUZsb2F0KHJnYi5ibHVlKSksXG5cdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShwYXJzZUZsb2F0KHJnYi5hbHBoYSkpXG5cdH07XG59XG5cbmZ1bmN0aW9uIHRvQ29sb3JWYWx1ZVJhbmdlPFQgZXh0ZW5kcyBrZXlvZiBSYW5nZUtleU1hcD4oXG5cdHZhbHVlOiBzdHJpbmcgfCBudW1iZXIsXG5cdHJhbmdlS2V5OiBUXG4pOiBSYW5nZUtleU1hcFtUXSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCByYW5nZUtleSk7XG5cblx0aWYgKHJhbmdlS2V5ID09PSAnSGV4U2V0Jykge1xuXHRcdHJldHVybiBicmFuZC5hc0hleFNldCh2YWx1ZSBhcyBzdHJpbmcpIGFzIHVua25vd24gYXMgUmFuZ2VLZXlNYXBbVF07XG5cdH1cblxuXHRpZiAocmFuZ2VLZXkgPT09ICdIZXhDb21wb25lbnQnKSB7XG5cdFx0cmV0dXJuIGJyYW5kLmFzSGV4Q29tcG9uZW50KFxuXHRcdFx0dmFsdWUgYXMgc3RyaW5nXG5cdFx0KSBhcyB1bmtub3duIGFzIFJhbmdlS2V5TWFwW1RdO1xuXHR9XG5cblx0cmV0dXJuIGJyYW5kLmFzQnJhbmRlZChcblx0XHR2YWx1ZSBhcyBudW1iZXIsXG5cdFx0cmFuZ2VLZXlcblx0KSBhcyB1bmtub3duIGFzIFJhbmdlS2V5TWFwW1RdO1xufVxuXG5mdW5jdGlvbiB4eXpWYWx1ZVRvU3RyaW5nKHh5ejogWFlaWyd2YWx1ZSddKTogWFlaX1N0cmluZ1Byb3BzWyd2YWx1ZSddIHtcblx0cmV0dXJuIHtcblx0XHR4OiBgJHt4eXoueH1gLFxuXHRcdHk6IGAke3h5ei55fWAsXG5cdFx0ejogYCR7eHl6Lnp9YCxcblx0XHRhbHBoYTogYCR7eHl6LmFscGhhfWBcblx0fTtcbn1cblxuZnVuY3Rpb24geHl6U3RyaW5nVG9WYWx1ZSh4eXo6IFhZWl9TdHJpbmdQcm9wc1sndmFsdWUnXSk6IFhZWlsndmFsdWUnXSB7XG5cdHJldHVybiB7XG5cdFx0eDogYnJhbmQuYXNYWVpfWChwYXJzZUZsb2F0KHh5ei54KSksXG5cdFx0eTogYnJhbmQuYXNYWVpfWShwYXJzZUZsb2F0KHh5ei55KSksXG5cdFx0ejogYnJhbmQuYXNYWVpfWihwYXJzZUZsb2F0KHh5ei56KSksXG5cdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShwYXJzZUZsb2F0KHh5ei5hbHBoYSkpXG5cdH07XG59XG5cbmNvbnN0IHN0cmluZ1RvVmFsdWUgPSB7XG5cdGNteWs6IGNteWtTdHJpbmdUb1ZhbHVlLFxuXHRoZXg6IGhleFN0cmluZ1RvVmFsdWUsXG5cdGhzbDogaHNsU3RyaW5nVG9WYWx1ZSxcblx0aHN2OiBoc3ZTdHJpbmdUb1ZhbHVlLFxuXHRsYWI6IGxhYlN0cmluZ1RvVmFsdWUsXG5cdHJnYjogcmdiU3RyaW5nVG9WYWx1ZSxcblx0eHl6OiB4eXpTdHJpbmdUb1ZhbHVlXG59O1xuXG5jb25zdCB2YWx1ZVRvU3RyaW5nID0ge1xuXHRjbXlrOiBjbXlrVmFsdWVUb1N0cmluZyxcblx0aGV4OiBoZXhWYWx1ZVRvU3RyaW5nLFxuXHRoc2w6IGhzbFZhbHVlVG9TdHJpbmcsXG5cdGhzdjogaHN2VmFsdWVUb1N0cmluZyxcblx0bGFiOiBsYWJWYWx1ZVRvU3RyaW5nLFxuXHRyZ2I6IHJnYlZhbHVlVG9TdHJpbmcsXG5cdHh5ejogeHl6VmFsdWVUb1N0cmluZ1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbnZlcnQ6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnY29yZSddWydjb252ZXJ0J10gPSB7XG5cdGNvbG9yU3RyaW5nVG9Db2xvcixcblx0aGV4QWxwaGFUb051bWVyaWNBbHBoYSxcblx0c3RyaW5nVG9WYWx1ZSxcblx0dG9Db2xvclZhbHVlUmFuZ2UsXG5cdGNvbG9yVG9DU1NDb2xvclN0cmluZyxcblx0dmFsdWVUb1N0cmluZ1xufTtcblxuLy8gKioqKioqKiogU0VDVElPTiA0IC0gR3VhcmRzICoqKioqKioqXG5cbmZ1bmN0aW9uIGlzQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDb2xvciB7XG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8IHZhbHVlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cblx0Y29uc3QgY29sb3IgPSB2YWx1ZSBhcyBDb2xvcjtcblx0Y29uc3QgdmFsaWRGb3JtYXRzOiBDb2xvclsnZm9ybWF0J11bXSA9IFtcblx0XHQnY215aycsXG5cdFx0J2hleCcsXG5cdFx0J2hzbCcsXG5cdFx0J2hzdicsXG5cdFx0J2xhYicsXG5cdFx0J3JnYicsXG5cdFx0J3NsJyxcblx0XHQnc3YnLFxuXHRcdCd4eXonXG5cdF07XG5cblx0cmV0dXJuIChcblx0XHQndmFsdWUnIGluIGNvbG9yICYmXG5cdFx0J2Zvcm1hdCcgaW4gY29sb3IgJiZcblx0XHR2YWxpZEZvcm1hdHMuaW5jbHVkZXMoY29sb3IuZm9ybWF0KVxuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0NvbG9yU3BhY2UodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDb2xvclNwYWNlIHtcblx0Y29uc3QgdmFsaWRDb2xvclNwYWNlczogQ29sb3JTcGFjZVtdID0gW1xuXHRcdCdjbXlrJyxcblx0XHQnaGV4Jyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnbGFiJyxcblx0XHQncmdiJyxcblx0XHQneHl6J1xuXHRdO1xuXG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJlxuXHRcdHZhbGlkQ29sb3JTcGFjZXMuaW5jbHVkZXModmFsdWUgYXMgQ29sb3JTcGFjZSlcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNDb2xvclN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENvbG9yX1N0cmluZ1Byb3BzIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuXHRjb25zdCBjb2xvclN0cmluZyA9IHZhbHVlIGFzIENvbG9yX1N0cmluZ1Byb3BzO1xuXHRjb25zdCB2YWxpZFN0cmluZ0Zvcm1hdHM6IENvbG9yX1N0cmluZ1Byb3BzWydmb3JtYXQnXVtdID0gW1xuXHRcdCdjbXlrJyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnc2wnLFxuXHRcdCdzdidcblx0XTtcblxuXHRyZXR1cm4gKFxuXHRcdCd2YWx1ZScgaW4gY29sb3JTdHJpbmcgJiZcblx0XHQnZm9ybWF0JyBpbiBjb2xvclN0cmluZyAmJlxuXHRcdHZhbGlkU3RyaW5nRm9ybWF0cy5pbmNsdWRlcyhjb2xvclN0cmluZy5mb3JtYXQpXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSW5SYW5nZTxUIGV4dGVuZHMga2V5b2YgdHlwZW9mIF9zZXRzPihcblx0dmFsdWU6IG51bWJlciB8IHN0cmluZyxcblx0cmFuZ2VLZXk6IFRcbik6IGJvb2xlYW4ge1xuXHRpZiAocmFuZ2VLZXkgPT09ICdIZXhTZXQnKSB7XG5cdFx0cmV0dXJuIHZhbGlkYXRlLmhleFNldCh2YWx1ZSBhcyBzdHJpbmcpO1xuXHR9XG5cblx0aWYgKHJhbmdlS2V5ID09PSAnSGV4Q29tcG9uZW50Jykge1xuXHRcdHJldHVybiB2YWxpZGF0ZS5oZXhDb21wb25lbnQodmFsdWUgYXMgc3RyaW5nKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIEFycmF5LmlzQXJyYXkoX3NldHNbcmFuZ2VLZXldKSkge1xuXHRcdGNvbnN0IFttaW4sIG1heF0gPSBfc2V0c1tyYW5nZUtleV0gYXMgW251bWJlciwgbnVtYmVyXTtcblxuXHRcdHJldHVybiB2YWx1ZSA+PSBtaW4gJiYgdmFsdWUgPD0gbWF4O1xuXHR9XG5cblx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHJhbmdlIG9yIHZhbHVlIGZvciAke1N0cmluZyhyYW5nZUtleSl9YCk7XG59XG5cbmV4cG9ydCBjb25zdCBndWFyZHM6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnY29yZSddWydndWFyZHMnXSA9IHtcblx0aXNDb2xvcixcblx0aXNDb2xvclNwYWNlLFxuXHRpc0NvbG9yU3RyaW5nLFxuXHRpc0luUmFuZ2Vcbn07XG5cbi8vICoqKioqKioqIFNFQ1RJT04gNSAtIFNhbml0aXplICoqKioqKioqXG5cbmZ1bmN0aW9uIGxhYih2YWx1ZTogbnVtYmVyLCBvdXRwdXQ6ICdsJyB8ICdhJyB8ICdiJyk6IExBQl9MIHwgTEFCX0EgfCBMQUJfQiB7XG5cdGlmIChvdXRwdXQgPT09ICdsJykge1xuXHRcdHJldHVybiBicmFuZC5hc0xBQl9MKE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIDApLCAxMDApKSk7XG5cdH0gZWxzZSBpZiAob3V0cHV0ID09PSAnYScpIHtcblx0XHRyZXR1cm4gYnJhbmQuYXNMQUJfQShNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAtMTI1KSwgMTI1KSkpO1xuXHR9IGVsc2UgaWYgKG91dHB1dCA9PT0gJ2InKSB7XG5cdFx0cmV0dXJuIGJyYW5kLmFzTEFCX0IoTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgLTEyNSksIDEyNSkpKTtcblx0fSBlbHNlIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHJldHVybiBMQUIgdmFsdWUnKTtcbn1cblxuZnVuY3Rpb24gcGVyY2VudGlsZSh2YWx1ZTogbnVtYmVyKTogUGVyY2VudGlsZSB7XG5cdGNvbnN0IHJhd1BlcmNlbnRpbGUgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAwKSwgMTAwKSk7XG5cblx0cmV0dXJuIGJyYW5kLmFzUGVyY2VudGlsZShyYXdQZXJjZW50aWxlKTtcbn1cblxuZnVuY3Rpb24gcmFkaWFsKHZhbHVlOiBudW1iZXIpOiBSYWRpYWwge1xuXHRjb25zdCByYXdSYWRpYWwgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAwKSwgMzYwKSkgJiAzNjA7XG5cblx0cmV0dXJuIGJyYW5kLmFzUmFkaWFsKHJhd1JhZGlhbCk7XG59XG5cbmZ1bmN0aW9uIHJnYih2YWx1ZTogbnVtYmVyKTogQnl0ZVJhbmdlIHtcblx0Y29uc3QgcmF3Qnl0ZVJhbmdlID0gTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgMCksIDI1NSkpO1xuXG5cdHJldHVybiB0b0NvbG9yVmFsdWVSYW5nZShyYXdCeXRlUmFuZ2UsICdCeXRlUmFuZ2UnKTtcbn1cblxuZXhwb3J0IGNvbnN0IHNhbml0aXplID0ge1xuXHRsYWIsXG5cdHBlcmNlbnRpbGUsXG5cdHJhZGlhbCxcblx0cmdiXG59O1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDUuMSAtIFZhbGlkYXRlICoqKioqKioqKlxuXG5mdW5jdGlvbiBjb2xvclZhbHVlcyhjb2xvcjogQ29sb3IgfCBTTCB8IFNWKTogYm9vbGVhbiB7XG5cdGNvbnN0IGNsb25lZENvbG9yID0gY2xvbmUoY29sb3IpO1xuXHRjb25zdCBpc051bWVyaWNWYWxpZCA9ICh2YWx1ZTogdW5rbm93bik6IGJvb2xlYW4gPT5cblx0XHR0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSk7XG5cdGNvbnN0IG5vcm1hbGl6ZVBlcmNlbnRhZ2UgPSAodmFsdWU6IHN0cmluZyB8IG51bWJlcik6IG51bWJlciA9PiB7XG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuZW5kc1dpdGgoJyUnKSkge1xuXHRcdFx0cmV0dXJuIHBhcnNlRmxvYXQodmFsdWUuc2xpY2UoMCwgLTEpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IHZhbHVlIDogTmFOO1xuXHR9O1xuXG5cdHN3aXRjaCAoY2xvbmVkQ29sb3IuZm9ybWF0KSB7XG5cdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuY3lhbixcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5tYWdlbnRhLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnllbGxvdyxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5rZXlcblx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuY3lhbiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmN5YW4gPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLm1hZ2VudGEgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5tYWdlbnRhIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55ZWxsb3cgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55ZWxsb3cgPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmtleSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmtleSA8PSAxMDBcblx0XHRcdCk7XG5cdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdHJldHVybiAvXiNbMC05QS1GYS1mXXs2fSQvLnRlc3QoY2xvbmVkQ29sb3IudmFsdWUuaGV4KTtcblx0XHRjYXNlICdoc2wnOlxuXHRcdFx0Y29uc3QgaXNWYWxpZEhTTEh1ZSA9XG5cdFx0XHRcdGlzTnVtZXJpY1ZhbGlkKGNsb25lZENvbG9yLnZhbHVlLmh1ZSkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlIDw9IDM2MDtcblx0XHRcdGNvbnN0IGlzVmFsaWRIU0xTYXR1cmF0aW9uID1cblx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uKSA+PSAwICYmXG5cdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbikgPD0gMTAwO1xuXHRcdFx0Y29uc3QgaXNWYWxpZEhTTExpZ2h0bmVzcyA9IGNsb25lZENvbG9yLnZhbHVlLmxpZ2h0bmVzc1xuXHRcdFx0XHQ/IG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzKSA+PSAwICYmXG5cdFx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MpIDw9IDEwMFxuXHRcdFx0XHQ6IHRydWU7XG5cblx0XHRcdHJldHVybiBpc1ZhbGlkSFNMSHVlICYmIGlzVmFsaWRIU0xTYXR1cmF0aW9uICYmIGlzVmFsaWRIU0xMaWdodG5lc3M7XG5cdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdGNvbnN0IGlzVmFsaWRIU1ZIdWUgPVxuXHRcdFx0XHRpc051bWVyaWNWYWxpZChjbG9uZWRDb2xvci52YWx1ZS5odWUpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmh1ZSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmh1ZSA8PSAzNjA7XG5cdFx0XHRjb25zdCBpc1ZhbGlkSFNWU2F0dXJhdGlvbiA9XG5cdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbikgPj0gMCAmJlxuXHRcdFx0XHRub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24pIDw9IDEwMDtcblx0XHRcdGNvbnN0IGlzVmFsaWRIU1ZWYWx1ZSA9IGNsb25lZENvbG9yLnZhbHVlLnZhbHVlXG5cdFx0XHRcdD8gbm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSkgPj0gMCAmJlxuXHRcdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUudmFsdWUpIDw9IDEwMFxuXHRcdFx0XHQ6IHRydWU7XG5cblx0XHRcdHJldHVybiBpc1ZhbGlkSFNWSHVlICYmIGlzVmFsaWRIU1ZTYXR1cmF0aW9uICYmIGlzVmFsaWRIU1ZWYWx1ZTtcblx0XHRjYXNlICdsYWInOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0W1xuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmwsXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYSxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5iXG5cdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmwgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5sIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5hID49IC0xMjUgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYSA8PSAxMjUgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYiA+PSAtMTI1ICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmIgPD0gMTI1XG5cdFx0XHQpO1xuXHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUucmVkLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmdyZWVuLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmJsdWVcblx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUucmVkID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUucmVkIDw9IDI1NSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ncmVlbiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmdyZWVuIDw9IDI1NSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ibHVlID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYmx1ZSA8PSAyNTVcblx0XHRcdCk7XG5cdFx0Y2FzZSAnc2wnOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0W1xuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24sXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzXG5cdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24gPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MgPD0gMTAwXG5cdFx0XHQpO1xuXHRcdGNhc2UgJ3N2Jzpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFtjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uLCBjbG9uZWRDb2xvci52YWx1ZS52YWx1ZV0uZXZlcnkoXG5cdFx0XHRcdFx0aXNOdW1lcmljVmFsaWRcblx0XHRcdFx0KSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbiA8PSAxMDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUudmFsdWUgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSA8PSAxMDBcblx0XHRcdCk7XG5cdFx0Y2FzZSAneHl6Jzpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFtcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS54LFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnksXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuelxuXHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS54ID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueCA8PSA5NS4wNDcgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnkgPD0gMTAwLjAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnogPD0gMTA4Ljg4M1xuXHRcdFx0KTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0Y29uc29sZS5lcnJvcihgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yLmZvcm1hdH1gKTtcblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleCh2YWx1ZTogc3RyaW5nLCBwYXR0ZXJuOiBSZWdFeHApOiBib29sZWFuIHtcblx0cmV0dXJuIHBhdHRlcm4udGVzdCh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGhleENvbXBvbmVudCh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdHJldHVybiBoZXgodmFsdWUsIC9eW0EtRmEtZjAtOV17Mn0kLyk7XG59XG5cbmZ1bmN0aW9uIGhleFNldCh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdHJldHVybiAvXiNbMC05YS1mQS1GXXs2fSQvLnRlc3QodmFsdWUpO1xufVxuXG5mdW5jdGlvbiByYW5nZTxUIGV4dGVuZHMga2V5b2YgdHlwZW9mIF9zZXRzPihcblx0dmFsdWU6IG51bWJlciB8IHN0cmluZyxcblx0cmFuZ2VLZXk6IFRcbik6IHZvaWQge1xuXHRpZiAoIWlzSW5SYW5nZSh2YWx1ZSwgcmFuZ2VLZXkpKSB7XG5cdFx0aWYgKHJhbmdlS2V5ID09PSAnSGV4U2V0JyB8fCByYW5nZUtleSA9PT0gJ0hleENvbXBvbmVudCcpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB2YWx1ZSBmb3IgJHtTdHJpbmcocmFuZ2VLZXkpfTogJHt2YWx1ZX1gKTtcblx0XHR9XG5cblx0XHRjb25zdCBbbWluLCBtYXhdID0gX3NldHNbcmFuZ2VLZXldIGFzIFtudW1iZXIsIG51bWJlcl07XG5cblx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRgVmFsdWUgJHt2YWx1ZX0gaXMgb3V0IG9mIHJhbmdlIGZvciAke1N0cmluZyhyYW5nZUtleSl9IFske21pbn0sICR7bWF4fV1gXG5cdFx0KTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgdmFsaWRhdGU6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnY29yZSddWyd2YWxpZGF0ZSddID0ge1xuXHRjb2xvclZhbHVlcyxcblx0aGV4LFxuXHRoZXhDb21wb25lbnQsXG5cdGhleFNldCxcblx0cmFuZ2Vcbn07XG5cbi8vICoqKioqKioqIFNFQ1RJT04gNiAtIE90aGVyICoqKioqKioqXG5cbmZ1bmN0aW9uIGdldEZvcm1hdHRlZFRpbWVzdGFtcCgpOiBzdHJpbmcge1xuXHRjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuXHRjb25zdCB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG5cdGNvbnN0IG1vbnRoID0gU3RyaW5nKG5vdy5nZXRNb250aCgpICsgMSkucGFkU3RhcnQoMiwgJzAnKTtcblx0Y29uc3QgZGF5ID0gU3RyaW5nKG5vdy5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG5cdGNvbnN0IGhvdXJzID0gU3RyaW5nKG5vdy5nZXRIb3VycygpKS5wYWRTdGFydCgyLCAnMCcpO1xuXHRjb25zdCBtaW51dGVzID0gU3RyaW5nKG5vdy5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG5cdGNvbnN0IHNlY29uZHMgPSBTdHJpbmcobm93LmdldFNlY29uZHMoKSkucGFkU3RhcnQoMiwgJzAnKTtcblxuXHRyZXR1cm4gYCR7eWVhcn0tJHttb250aH0tJHtkYXl9ICR7aG91cnN9OiR7bWludXRlc306JHtzZWNvbmRzfWA7XG59XG5cbmV4cG9ydCBjb25zdCBvdGhlciA9IHsgZ2V0Rm9ybWF0dGVkVGltZXN0YW1wIH07XG5cbmV4cG9ydCB7IGNsb25lIH07XG5cbi8vICoqKioqKioqIFNFQ1RJT04gNyAtIEZpbmFsIEV4cG9ydCAqKioqKioqKlxuXG5leHBvcnQgY29uc3QgY29yZVV0aWxzOiBDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2VbJ2NvcmUnXSA9IHtcblx0YmFzZSxcblx0YnJhbmQsXG5cdGJyYW5kQ29sb3IsXG5cdGNvbnZlcnQsXG5cdGd1YXJkcyxcblx0Li4ub3RoZXIsXG5cdHNhbml0aXplLFxuXHR2YWxpZGF0ZVxufSBhcyBjb25zdDtcbiJdfQ==