// File: src/common/core/base.js
import { sets } from '../data/sets.js';
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
            const defaultColors = await initializeDefaultColors();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vY29yZS9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdDQUFnQztBQXdEaEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXZDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQztBQUVuQixzQ0FBc0M7QUFFdEMsU0FBUyxZQUFZLENBQUMsS0FBYTtJQUNsQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztJQUVwQyxPQUFPLEtBQW1CLENBQUM7QUFDNUIsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUNqQixLQUFhLEVBQ2IsUUFBVztJQUVYLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRWhDLE9BQU8sS0FBdUIsQ0FBQztBQUNoQyxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsS0FBYTtJQUNqQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztJQUVuQyxPQUFPLEtBQWtCLENBQUM7QUFDM0IsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLEtBQWE7SUFDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxPQUFPLEtBQWdDLENBQUM7QUFDekMsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEtBQWE7SUFDOUIsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUNyQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUNELElBQUksQ0FBQyxR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XG5pbXBvcnQge1xuXHRBbHBoYVJhbmdlLFxuXHRCeXRlUmFuZ2UsXG5cdENNWUssXG5cdENNWUtVbmJyYW5kZWQsXG5cdENNWUtWYWx1ZSxcblx0Q01ZS1ZhbHVlU3RyaW5nLFxuXHRDb2xvcixcblx0Q29sb3JTcGFjZSxcblx0Q29sb3JTdHJpbmcsXG5cdENvbW1vbkZ1bmN0aW9uc01hc3RlckludGVyZmFjZSxcblx0SGV4LFxuXHRIZXhDb21wb25lbnQsXG5cdEhleFNldCxcblx0SGV4VW5icmFuZGVkLFxuXHRIZXhWYWx1ZSxcblx0SGV4VmFsdWVTdHJpbmcsXG5cdEhTTCxcblx0SFNMVW5icmFuZGVkLFxuXHRIU0xWYWx1ZSxcblx0SFNMVmFsdWVTdHJpbmcsXG5cdEhTVixcblx0SFNWVW5icmFuZGVkLFxuXHRIU1ZWYWx1ZSxcblx0SFNWVmFsdWVTdHJpbmcsXG5cdExBQixcblx0TEFCVW5icmFuZGVkLFxuXHRMQUJWYWx1ZSxcblx0TEFCVmFsdWVTdHJpbmcsXG5cdExBQl9MLFxuXHRMQUJfQSxcblx0TEFCX0IsXG5cdE51bWVyaWNSYW5nZUtleSxcblx0UGVyY2VudGlsZSxcblx0UmFkaWFsLFxuXHRSYW5nZUtleU1hcCxcblx0UkdCLFxuXHRSR0JVbmJyYW5kZWQsXG5cdFJHQlZhbHVlLFxuXHRSR0JWYWx1ZVN0cmluZyxcblx0U0wsXG5cdFNMVW5icmFuZGVkLFxuXHRTTFZhbHVlLFxuXHRTVixcblx0U1ZVbmJyYW5kZWQsXG5cdFNWVmFsdWUsXG5cdFhZWixcblx0WFlaVW5icmFuZGVkLFxuXHRYWVpWYWx1ZSxcblx0WFlaVmFsdWVTdHJpbmcsXG5cdFhZWl9YLFxuXHRYWVpfWSxcblx0WFlaX1pcbn0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgc2V0cyB9IGZyb20gJy4uL2RhdGEvc2V0cy5qcyc7XG5cbmNvbnN0IF9zZXRzID0gc2V0cztcblxuLy8gKioqKioqKiogU0VDVElPTiAwIC0gQnJhbmQgKioqKioqKipcblxuZnVuY3Rpb24gYXNBbHBoYVJhbmdlKHZhbHVlOiBudW1iZXIpOiBBbHBoYVJhbmdlIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdBbHBoYVJhbmdlJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIEFscGhhUmFuZ2U7XG59XG5cbmZ1bmN0aW9uIGFzQnJhbmRlZDxUIGV4dGVuZHMga2V5b2YgUmFuZ2VLZXlNYXA+KFxuXHR2YWx1ZTogbnVtYmVyLFxuXHRyYW5nZUtleTogVFxuKTogUmFuZ2VLZXlNYXBbVF0ge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgcmFuZ2VLZXkpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBSYW5nZUtleU1hcFtUXTtcbn1cblxuZnVuY3Rpb24gYXNCeXRlUmFuZ2UodmFsdWU6IG51bWJlcik6IEJ5dGVSYW5nZSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnQnl0ZVJhbmdlJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIEJ5dGVSYW5nZTtcbn1cblxuZnVuY3Rpb24gYXNIZXhDb21wb25lbnQodmFsdWU6IHN0cmluZyk6IEhleENvbXBvbmVudCB7XG5cdGlmICghdmFsaWRhdGUuaGV4Q29tcG9uZW50KHZhbHVlKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBIZXhDb21wb25lbnQgdmFsdWU6ICR7dmFsdWV9YCk7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWUgYXMgdW5rbm93biBhcyBIZXhDb21wb25lbnQ7XG59XG5cbmZ1bmN0aW9uIGFzSGV4U2V0KHZhbHVlOiBzdHJpbmcpOiBIZXhTZXQge1xuXHRpZiAoL14jWzAtOWEtZkEtRl17OH0kLy50ZXN0KHZhbHVlKSkge1xuXHRcdHZhbHVlID0gdmFsdWUuc2xpY2UoMCwgNyk7XG5cdH1cblx0aWYgKCF2YWxpZGF0ZS5oZXhTZXQodmFsdWUpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIEhleFNldCB2YWx1ZTogJHt2YWx1ZX1gKTtcblx0fVxuXHRyZXR1cm4gdmFsdWUgYXMgSGV4U2V0O1xufVxuXG5mdW5jdGlvbiBhc0xBQl9MKHZhbHVlOiBudW1iZXIpOiBMQUJfTCB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnTEFCX0wnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgTEFCX0w7XG59XG5cbmZ1bmN0aW9uIGFzTEFCX0EodmFsdWU6IG51bWJlcik6IExBQl9BIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdMQUJfQScpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBMQUJfQTtcbn1cblxuZnVuY3Rpb24gYXNMQUJfQih2YWx1ZTogbnVtYmVyKTogTEFCX0Ige1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ0xBQl9CJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIExBQl9CO1xufVxuXG5mdW5jdGlvbiBhc1BlcmNlbnRpbGUodmFsdWU6IG51bWJlcik6IFBlcmNlbnRpbGUge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ1BlcmNlbnRpbGUnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgUGVyY2VudGlsZTtcbn1cblxuZnVuY3Rpb24gYXNSYWRpYWwodmFsdWU6IG51bWJlcik6IFJhZGlhbCB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnUmFkaWFsJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIFJhZGlhbDtcbn1cblxuZnVuY3Rpb24gYXNYWVpfWCh2YWx1ZTogbnVtYmVyKTogWFlaX1gge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ1hZWl9YJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIFhZWl9YO1xufVxuXG5mdW5jdGlvbiBhc1hZWl9ZKHZhbHVlOiBudW1iZXIpOiBYWVpfWSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnWFlaX1knKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgWFlaX1k7XG59XG5cbmZ1bmN0aW9uIGFzWFlaX1oodmFsdWU6IG51bWJlcik6IFhZWl9aIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdYWVpfWicpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBYWVpfWjtcbn1cblxuZXhwb3J0IGNvbnN0IGJyYW5kOiBDb21tb25GdW5jdGlvbnNNYXN0ZXJJbnRlcmZhY2VbJ2NvcmUnXVsnYnJhbmQnXSA9IHtcblx0YXNBbHBoYVJhbmdlLFxuXHRhc0JyYW5kZWQsXG5cdGFzQnl0ZVJhbmdlLFxuXHRhc0hleENvbXBvbmVudCxcblx0YXNIZXhTZXQsXG5cdGFzTEFCX0wsXG5cdGFzTEFCX0EsXG5cdGFzTEFCX0IsXG5cdGFzUGVyY2VudGlsZSxcblx0YXNSYWRpYWwsXG5cdGFzWFlaX1gsXG5cdGFzWFlaX1ksXG5cdGFzWFlaX1pcbn07XG5cbi8vICoqKioqKioqIFNFQ1RJT04gMSAqKioqKioqKlxuXG5mdW5jdGlvbiBpbml0aWFsaXplRGVmYXVsdENvbG9ycygpIHtcblx0cmV0dXJuIHtcblx0XHRjbXlrOiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRjeWFuOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdG1hZ2VudGE6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0eWVsbG93OiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdGtleTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHR9LFxuXHRcdGhleDoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldCgnIzAwMDAwMCcpLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoJ0ZGJyksXG5cdFx0XHRcdG51bUFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0fSxcblx0XHRoc2w6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoMCksXG5cdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0fSxcblx0XHRoc3Y6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoMCksXG5cdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHR9LFxuXHRcdGxhYjoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0bDogYnJhbmQuYXNMQUJfTCgwKSxcblx0XHRcdFx0YTogYnJhbmQuYXNMQUJfQSgwKSxcblx0XHRcdFx0YjogYnJhbmQuYXNMQUJfQigwKSxcblx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHR9LFxuXHRcdHJnYjoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZSgwKSxcblx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRibHVlOiBicmFuZC5hc0J5dGVSYW5nZSgwKSxcblx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9LFxuXHRcdHNsOiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnc2wnXG5cdFx0fSxcblx0XHRzdjoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnc3YnXG5cdFx0fSxcblx0XHR4eXo6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHg6IGJyYW5kLmFzWFlaX1goMCksXG5cdFx0XHRcdHk6IGJyYW5kLmFzWFlaX1koMCksXG5cdFx0XHRcdHo6IGJyYW5kLmFzWFlaX1ooMCksXG5cdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0fVxuXHR9O1xufVxuXG4vLyAqKioqKioqKiBTRUNUSU9OIDEgKioqKioqKipcblxuZnVuY3Rpb24gY2xhbXBUb1JhbmdlKHZhbHVlOiBudW1iZXIsIHJhbmdlS2V5OiBOdW1lcmljUmFuZ2VLZXkpOiBudW1iZXIge1xuXHRjb25zdCBbbWluLCBtYXhdID0gX3NldHNbcmFuZ2VLZXldO1xuXG5cdHJldHVybiBNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgbWluKSwgbWF4KTtcbn1cblxuZnVuY3Rpb24gY2xvbmU8VD4odmFsdWU6IFQpOiBUIHtcblx0cmV0dXJuIHN0cnVjdHVyZWRDbG9uZSh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGRlYm91bmNlPFQgZXh0ZW5kcyAoLi4uYXJnczogUGFyYW1ldGVyczxUPikgPT4gdm9pZD4oXG5cdGZ1bmM6IFQsXG5cdGRlbGF5OiBudW1iZXJcbikge1xuXHRsZXQgdGltZW91dDogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudWxsID0gbnVsbDtcblxuXHRyZXR1cm4gKC4uLmFyZ3M6IFBhcmFtZXRlcnM8VD4pOiB2b2lkID0+IHtcblx0XHRpZiAodGltZW91dCkgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0ZnVuYyguLi5hcmdzKTtcblx0XHR9LCBkZWxheSk7XG5cdH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ3VzdG9tQ29sb3IocmF3VmFsdWU6IHN0cmluZyk6IEhTTCB8IG51bGwge1xuXHR0cnkge1xuXHRcdGNvbnN0IG1hdGNoID0gcmF3VmFsdWUubWF0Y2goXG5cdFx0XHQvaHNsXFwoKFxcZCspLFxccyooXFxkKyklPyxcXHMqKFxcZCspJT8sXFxzKihcXGQqXFwuP1xcZCspXFwpL1xuXHRcdCk7XG5cblx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdGNvbnN0IFssIGh1ZSwgc2F0dXJhdGlvbiwgbGlnaHRuZXNzLCBhbHBoYV0gPSBtYXRjaDtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKHBhcnNlSW50KGh1ZSkpLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUludChzYXR1cmF0aW9uKSksXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VJbnQobGlnaHRuZXNzKSksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShwYXJzZUZsb2F0KGFscGhhKSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0J0ludmFsaWQgSFNMIGN1c3RvbSBjb2xvci4gRXhwZWN0ZWQgZm9ybWF0OiBoc2woSCwgUyUsIEwlLCBBKVxcbmNhbGxlcjogcGFyc2VDdXN0b21Db2xvcigpJ1xuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYHBhcnNlQ3VzdG9tQ29sb3IgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgYmFzZTogQ29tbW9uRnVuY3Rpb25zTWFzdGVySW50ZXJmYWNlWydjb3JlJ11bJ2Jhc2UnXSA9IHtcblx0Y2xhbXBUb1JhbmdlLFxuXHRjbG9uZSxcblx0ZGVib3VuY2UsXG5cdHBhcnNlQ3VzdG9tQ29sb3Jcbn0gYXMgY29uc3Q7XG5cbi8vICoqKioqKioqIFNFQ1RJT04gMiAtIEJyYW5kIENvbG9yICoqKioqKioqXG5cbmZ1bmN0aW9uIGFzQ01ZSyhjb2xvcjogQ01ZS1VuYnJhbmRlZCk6IENNWUsge1xuXHRjb25zdCBicmFuZGVkQ3lhbiA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5jeWFuKTtcblx0Y29uc3QgYnJhbmRlZE1hZ2VudGEgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUubWFnZW50YSk7XG5cdGNvbnN0IGJyYW5kZWRZZWxsb3cgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUueWVsbG93KTtcblx0Y29uc3QgYnJhbmRlZEtleSA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5rZXkpO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdGN5YW46IGJyYW5kZWRDeWFuLFxuXHRcdFx0bWFnZW50YTogYnJhbmRlZE1hZ2VudGEsXG5cdFx0XHR5ZWxsb3c6IGJyYW5kZWRZZWxsb3csXG5cdFx0XHRrZXk6IGJyYW5kZWRLZXksXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc0hleChjb2xvcjogSGV4VW5icmFuZGVkKTogSGV4IHtcblx0bGV0IGhleCA9IGNvbG9yLnZhbHVlLmhleDtcblxuXHRpZiAoIWhleC5zdGFydHNXaXRoKCcjJykpIGhleCA9IGAjJHtoZXh9YDtcblxuXHRpZiAoIS9eI1swLTlBLUZhLWZdezh9JC8udGVzdChoZXgpKVxuXHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBIZXggY29sb3IgZm9ybWF0OiAke2hleH1gKTtcblxuXHRjb25zdCBoZXhNYWluID0gaGV4LnNsaWNlKDAsIDcpO1xuXHRjb25zdCBhbHBoYSA9IGhleC5zbGljZSg3LCA5KTtcblxuXHRjb25zdCBicmFuZGVkSGV4ID0gYnJhbmQuYXNIZXhTZXQoaGV4TWFpbik7XG5cdGNvbnN0IGJyYW5kZWRIZXhBbHBoYSA9IGJyYW5kLmFzSGV4Q29tcG9uZW50KGFscGhhKTtcblx0Y29uc3QgYnJhbmRlZE51bUFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLm51bUFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRoZXg6IGJyYW5kZWRIZXgsXG5cdFx0XHRhbHBoYTogYnJhbmRlZEhleEFscGhhLFxuXHRcdFx0bnVtQWxwaGE6IGJyYW5kZWROdW1BbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnaGV4J1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc0hTTChjb2xvcjogSFNMVW5icmFuZGVkKTogSFNMIHtcblx0Y29uc3QgYnJhbmRlZEh1ZSA9IGJyYW5kLmFzUmFkaWFsKGNvbG9yLnZhbHVlLmh1ZSk7XG5cdGNvbnN0IGJyYW5kZWRTYXR1cmF0aW9uID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnNhdHVyYXRpb24pO1xuXHRjb25zdCBicmFuZGVkTGlnaHRuZXNzID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLmxpZ2h0bmVzcyk7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0aHVlOiBicmFuZGVkSHVlLFxuXHRcdFx0c2F0dXJhdGlvbjogYnJhbmRlZFNhdHVyYXRpb24sXG5cdFx0XHRsaWdodG5lc3M6IGJyYW5kZWRMaWdodG5lc3MsXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdoc2wnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzSFNWKGNvbG9yOiBIU1ZVbmJyYW5kZWQpOiBIU1Yge1xuXHRjb25zdCBicmFuZGVkSHVlID0gYnJhbmQuYXNSYWRpYWwoY29sb3IudmFsdWUuaHVlKTtcblx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUuc2F0dXJhdGlvbik7XG5cdGNvbnN0IGJyYW5kZWRWYWx1ZSA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS52YWx1ZSk7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0aHVlOiBicmFuZGVkSHVlLFxuXHRcdFx0c2F0dXJhdGlvbjogYnJhbmRlZFNhdHVyYXRpb24sXG5cdFx0XHR2YWx1ZTogYnJhbmRlZFZhbHVlLFxuXHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnaHN2J1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc0xBQihjb2xvcjogTEFCVW5icmFuZGVkKTogTEFCIHtcblx0Y29uc3QgYnJhbmRlZEwgPSBicmFuZC5hc0xBQl9MKGNvbG9yLnZhbHVlLmwpO1xuXHRjb25zdCBicmFuZGVkQSA9IGJyYW5kLmFzTEFCX0EoY29sb3IudmFsdWUuYSk7XG5cdGNvbnN0IGJyYW5kZWRCID0gYnJhbmQuYXNMQUJfQihjb2xvci52YWx1ZS5iKTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRsOiBicmFuZGVkTCxcblx0XHRcdGE6IGJyYW5kZWRBLFxuXHRcdFx0YjogYnJhbmRlZEIsXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdsYWInXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzUkdCKGNvbG9yOiBSR0JVbmJyYW5kZWQpOiBSR0Ige1xuXHRjb25zdCBicmFuZGVkUmVkID0gYnJhbmQuYXNCeXRlUmFuZ2UoY29sb3IudmFsdWUucmVkKTtcblx0Y29uc3QgYnJhbmRlZEdyZWVuID0gYnJhbmQuYXNCeXRlUmFuZ2UoY29sb3IudmFsdWUuZ3JlZW4pO1xuXHRjb25zdCBicmFuZGVkQmx1ZSA9IGJyYW5kLmFzQnl0ZVJhbmdlKGNvbG9yLnZhbHVlLmJsdWUpO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdHJlZDogYnJhbmRlZFJlZCxcblx0XHRcdGdyZWVuOiBicmFuZGVkR3JlZW4sXG5cdFx0XHRibHVlOiBicmFuZGVkQmx1ZSxcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ3JnYidcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNTTChjb2xvcjogU0xVbmJyYW5kZWQpOiBTTCB7XG5cdGNvbnN0IGJyYW5kZWRTYXR1cmF0aW9uID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnNhdHVyYXRpb24pO1xuXHRjb25zdCBicmFuZGVkTGlnaHRuZXNzID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLmxpZ2h0bmVzcyk7XG5cdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZShjb2xvci52YWx1ZS5hbHBoYSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0c2F0dXJhdGlvbjogYnJhbmRlZFNhdHVyYXRpb24sXG5cdFx0XHRsaWdodG5lc3M6IGJyYW5kZWRMaWdodG5lc3MsXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdzbCdcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNTVihjb2xvcjogU1ZVbmJyYW5kZWQpOiBTViB7XG5cdGNvbnN0IGJyYW5kZWRTYXR1cmF0aW9uID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnNhdHVyYXRpb24pO1xuXHRjb25zdCBicmFuZGVkVmFsdWUgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUudmFsdWUpO1xuXHRjb25zdCBicmFuZGVkQWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UoY29sb3IudmFsdWUuYWxwaGEpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdHNhdHVyYXRpb246IGJyYW5kZWRTYXR1cmF0aW9uLFxuXHRcdFx0dmFsdWU6IGJyYW5kZWRWYWx1ZSxcblx0XHRcdGFscGhhOiBicmFuZGVkQWxwaGFcblx0XHR9LFxuXHRcdGZvcm1hdDogJ3N2J1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc1hZWihjb2xvcjogWFlaVW5icmFuZGVkKTogWFlaIHtcblx0Y29uc3QgYnJhbmRlZFggPSBicmFuZC5hc1hZWl9YKGNvbG9yLnZhbHVlLngpO1xuXHRjb25zdCBicmFuZGVkWSA9IGJyYW5kLmFzWFlaX1koY29sb3IudmFsdWUueSk7XG5cdGNvbnN0IGJyYW5kZWRaID0gYnJhbmQuYXNYWVpfWihjb2xvci52YWx1ZS56KTtcblx0Y29uc3QgYnJhbmRlZEFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKGNvbG9yLnZhbHVlLmFscGhhKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHR4OiBicmFuZGVkWCxcblx0XHRcdHk6IGJyYW5kZWRZLFxuXHRcdFx0ejogYnJhbmRlZFosXG5cdFx0XHRhbHBoYTogYnJhbmRlZEFscGhhXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICd4eXonXG5cdH07XG59XG5cbmV4cG9ydCBjb25zdCBicmFuZENvbG9yOiBDb21tb25GdW5jdGlvbnNNYXN0ZXJJbnRlcmZhY2VbJ2NvcmUnXVsnYnJhbmRDb2xvciddID1cblx0e1xuXHRcdGFzQ01ZSyxcblx0XHRhc0hleCxcblx0XHRhc0hTTCxcblx0XHRhc0hTVixcblx0XHRhc0xBQixcblx0XHRhc1JHQixcblx0XHRhc1NMLFxuXHRcdGFzU1YsXG5cdFx0YXNYWVpcblx0fTtcblxuLy8gKioqKioqKiogU0VDVElPTiAzIC0gQ29udmVydCAqKioqKioqKlxuXG5mdW5jdGlvbiBjbXlrU3RyaW5nVG9WYWx1ZShjbXlrOiBDTVlLVmFsdWVTdHJpbmcpOiBDTVlLVmFsdWUge1xuXHRyZXR1cm4ge1xuXHRcdGN5YW46IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUZsb2F0KGNteWsuY3lhbikgLyAxMDApLFxuXHRcdG1hZ2VudGE6IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUZsb2F0KGNteWsubWFnZW50YSkgLyAxMDApLFxuXHRcdHllbGxvdzogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoY215ay55ZWxsb3cpIC8gMTAwKSxcblx0XHRrZXk6IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUZsb2F0KGNteWsua2V5KSAvIDEwMCksXG5cdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShwYXJzZUZsb2F0KGNteWsuYWxwaGEpKVxuXHR9O1xufVxuXG5mdW5jdGlvbiBjbXlrVmFsdWVUb1N0cmluZyhjbXlrOiBDTVlLVmFsdWUpOiBDTVlLVmFsdWVTdHJpbmcge1xuXHRyZXR1cm4ge1xuXHRcdGN5YW46IGAke2NteWsuY3lhbiAqIDEwMH0lYCxcblx0XHRtYWdlbnRhOiBgJHtjbXlrLm1hZ2VudGEgKiAxMDB9JWAsXG5cdFx0eWVsbG93OiBgJHtjbXlrLnllbGxvdyAqIDEwMH0lYCxcblx0XHRrZXk6IGAke2NteWsua2V5ICogMTAwfSVgLFxuXHRcdGFscGhhOiBgJHtjbXlrLmFscGhhfWBcblx0fTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY29sb3JTdHJpbmdUb0NvbG9yKGNvbG9yU3RyaW5nOiBDb2xvclN0cmluZyk6IFByb21pc2U8Q29sb3I+IHtcblx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjbG9uZShjb2xvclN0cmluZyk7XG5cblx0Y29uc3QgcGFyc2VWYWx1ZSA9ICh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyID0+XG5cdFx0dHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5lbmRzV2l0aCgnJScpXG5cdFx0XHQ/IHBhcnNlRmxvYXQodmFsdWUuc2xpY2UoMCwgLTEpKVxuXHRcdFx0OiBOdW1iZXIodmFsdWUpO1xuXG5cdGNvbnN0IG5ld1ZhbHVlID0gT2JqZWN0LmVudHJpZXMoY2xvbmVkQ29sb3IudmFsdWUpLnJlZHVjZShcblx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHRhY2Nba2V5IGFzIGtleW9mICh0eXBlb2YgY2xvbmVkQ29sb3IpWyd2YWx1ZSddXSA9IHBhcnNlVmFsdWUoXG5cdFx0XHRcdHZhbFxuXHRcdFx0KSBhcyBuZXZlcjtcblx0XHRcdHJldHVybiBhY2M7XG5cdFx0fSxcblx0XHR7fSBhcyBSZWNvcmQ8a2V5b2YgKHR5cGVvZiBjbG9uZWRDb2xvcilbJ3ZhbHVlJ10sIG51bWJlcj5cblx0KTtcblxuXHRzd2l0Y2ggKGNsb25lZENvbG9yLmZvcm1hdCkge1xuXHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnY215aycsIHZhbHVlOiBuZXdWYWx1ZSBhcyBDTVlLVmFsdWUgfTtcblx0XHRjYXNlICdoc2wnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnaHNsJywgdmFsdWU6IG5ld1ZhbHVlIGFzIEhTTFZhbHVlIH07XG5cdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ2hzdicsIHZhbHVlOiBuZXdWYWx1ZSBhcyBIU1ZWYWx1ZSB9O1xuXHRcdGNhc2UgJ3NsJzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ3NsJywgdmFsdWU6IG5ld1ZhbHVlIGFzIFNMVmFsdWUgfTtcblx0XHRjYXNlICdzdic6XG5cdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdzdicsIHZhbHVlOiBuZXdWYWx1ZSBhcyBTVlZhbHVlIH07XG5cdFx0ZGVmYXVsdDpcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ1Vuc3VwcG9ydGVkIGZvcm1hdCBmb3IgY29sb3JTdHJpbmdUb0NvbG9yJyk7XG5cblx0XHRcdGNvbnN0IGRlZmF1bHRDb2xvcnMgPSBhd2FpdCBpbml0aWFsaXplRGVmYXVsdENvbG9ycygpO1xuXG5cdFx0XHRjb25zdCB1bmJyYW5kZWRIU0wgPSBkZWZhdWx0Q29sb3JzLmhzbDtcblxuXHRcdFx0Y29uc3QgYnJhbmRlZEh1ZSA9IGJyYW5kLmFzUmFkaWFsKHVuYnJhbmRlZEhTTC52YWx1ZS5odWUpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdHVuYnJhbmRlZEhTTC52YWx1ZS5zYXR1cmF0aW9uXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgYnJhbmRlZExpZ2h0bmVzcyA9IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0dW5icmFuZGVkSFNMLnZhbHVlLmxpZ2h0bmVzc1xuXHRcdFx0KTtcblx0XHRcdGNvbnN0IGJyYW5kZWRBbHBoYSA9IGJyYW5kLmFzQWxwaGFSYW5nZSh1bmJyYW5kZWRIU0wudmFsdWUuYWxwaGEpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmRlZEh1ZSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kZWRMaWdodG5lc3MsXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kZWRBbHBoYVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9O1xuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNvbG9yVG9DU1NDb2xvclN0cmluZyhjb2xvcjogQ29sb3IpOiBQcm9taXNlPHN0cmluZz4ge1xuXHR0cnkge1xuXHRcdHN3aXRjaCAoY29sb3IuZm9ybWF0KSB7XG5cdFx0XHRjYXNlICdjbXlrJzpcblx0XHRcdFx0cmV0dXJuIGBjbXlrKCR7Y29sb3IudmFsdWUuY3lhbn0sICR7Y29sb3IudmFsdWUubWFnZW50YX0sICR7Y29sb3IudmFsdWUueWVsbG93fSwgJHtjb2xvci52YWx1ZS5rZXl9LCAke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0cmV0dXJuIFN0cmluZyhjb2xvci52YWx1ZS5oZXgpO1xuXHRcdFx0Y2FzZSAnaHNsJzpcblx0XHRcdFx0cmV0dXJuIGBoc2woJHtjb2xvci52YWx1ZS5odWV9LCAke2NvbG9yLnZhbHVlLnNhdHVyYXRpb259JSwgJHtjb2xvci52YWx1ZS5saWdodG5lc3N9JSwgJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdHJldHVybiBgaHN2KCR7Y29sb3IudmFsdWUuaHVlfSwgJHtjb2xvci52YWx1ZS5zYXR1cmF0aW9ufSUsICR7Y29sb3IudmFsdWUudmFsdWV9JSwgJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBgbGFiKCR7Y29sb3IudmFsdWUubH0sICR7Y29sb3IudmFsdWUuYX0sICR7Y29sb3IudmFsdWUuYn0sICR7Y29sb3IudmFsdWUuYWxwaGF9KWA7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gYHJnYigke2NvbG9yLnZhbHVlLnJlZH0sICR7Y29sb3IudmFsdWUuZ3JlZW59LCAke2NvbG9yLnZhbHVlLmJsdWV9LCAke2NvbG9yLnZhbHVlLmFscGhhfSlgO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIGB4eXooJHtjb2xvci52YWx1ZS54fSwgJHtjb2xvci52YWx1ZS55fSwgJHtjb2xvci52YWx1ZS56fSwgJHtjb2xvci52YWx1ZS5hbHBoYX0pYDtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYFVuZXhwZWN0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yLmZvcm1hdH1gKTtcblxuXHRcdFx0XHRyZXR1cm4gJyNGRkZGRkZGRic7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgZ2V0Q1NTQ29sb3JTdHJpbmcgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4QWxwaGFUb051bWVyaWNBbHBoYShoZXhBbHBoYTogc3RyaW5nKTogbnVtYmVyIHtcblx0cmV0dXJuIHBhcnNlSW50KGhleEFscGhhLCAxNikgLyAyNTU7XG59XG5cbmZ1bmN0aW9uIGhleFN0cmluZ1RvVmFsdWUoaGV4OiBIZXhWYWx1ZVN0cmluZyk6IEhleFZhbHVlIHtcblx0cmV0dXJuIHtcblx0XHRoZXg6IGJyYW5kLmFzSGV4U2V0KGhleC5oZXgpLFxuXHRcdGFscGhhOiBicmFuZC5hc0hleENvbXBvbmVudChoZXguYWxwaGEpLFxuXHRcdG51bUFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UocGFyc2VGbG9hdChoZXgubnVtQWxwaGEpKVxuXHR9O1xufVxuXG5mdW5jdGlvbiBoZXhWYWx1ZVRvU3RyaW5nKGhleDogSGV4VmFsdWUpOiBIZXhWYWx1ZVN0cmluZyB7XG5cdHJldHVybiB7XG5cdFx0aGV4OiBoZXguaGV4LFxuXHRcdGFscGhhOiBgJHtoZXguYWxwaGF9YCxcblx0XHRudW1BbHBoYTogYCR7aGV4Lm51bUFscGhhfWBcblx0fTtcbn1cblxuZnVuY3Rpb24gaHNsU3RyaW5nVG9WYWx1ZShoc2w6IEhTTFZhbHVlU3RyaW5nKTogSFNMVmFsdWUge1xuXHRyZXR1cm4ge1xuXHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwocGFyc2VGbG9hdChoc2wuaHVlKSksXG5cdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoaHNsLnNhdHVyYXRpb24pIC8gMTAwKSxcblx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUZsb2F0KGhzbC5saWdodG5lc3MpIC8gMTAwKSxcblx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKHBhcnNlRmxvYXQoaHNsLmFscGhhKSlcblx0fTtcbn1cblxuZnVuY3Rpb24gaHNsVmFsdWVUb1N0cmluZyhoc2w6IEhTTFZhbHVlKTogSFNMVmFsdWVTdHJpbmcge1xuXHRyZXR1cm4ge1xuXHRcdGh1ZTogYCR7aHNsLmh1ZX3CsGAsXG5cdFx0c2F0dXJhdGlvbjogYCR7aHNsLnNhdHVyYXRpb24gKiAxMDB9JWAsXG5cdFx0bGlnaHRuZXNzOiBgJHtoc2wubGlnaHRuZXNzICogMTAwfSVgLFxuXHRcdGFscGhhOiBgJHtoc2wuYWxwaGF9YFxuXHR9O1xufVxuXG5mdW5jdGlvbiBoc3ZTdHJpbmdUb1ZhbHVlKGhzdjogSFNWVmFsdWVTdHJpbmcpOiBIU1ZWYWx1ZSB7XG5cdHJldHVybiB7XG5cdFx0aHVlOiBicmFuZC5hc1JhZGlhbChwYXJzZUZsb2F0KGhzdi5odWUpKSxcblx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VGbG9hdChoc3Yuc2F0dXJhdGlvbikgLyAxMDApLFxuXHRcdHZhbHVlOiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VGbG9hdChoc3YudmFsdWUpIC8gMTAwKSxcblx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKHBhcnNlRmxvYXQoaHN2LmFscGhhKSlcblx0fTtcbn1cblxuZnVuY3Rpb24gaHN2VmFsdWVUb1N0cmluZyhoc3Y6IEhTVlZhbHVlKTogSFNWVmFsdWVTdHJpbmcge1xuXHRyZXR1cm4ge1xuXHRcdGh1ZTogYCR7aHN2Lmh1ZX3CsGAsXG5cdFx0c2F0dXJhdGlvbjogYCR7aHN2LnNhdHVyYXRpb24gKiAxMDB9JWAsXG5cdFx0dmFsdWU6IGAke2hzdi52YWx1ZSAqIDEwMH0lYCxcblx0XHRhbHBoYTogYCR7aHN2LmFscGhhfWBcblx0fTtcbn1cblxuZnVuY3Rpb24gbGFiVmFsdWVUb1N0cmluZyhsYWI6IExBQlZhbHVlKTogTEFCVmFsdWVTdHJpbmcge1xuXHRyZXR1cm4ge1xuXHRcdGw6IGAke2xhYi5sfWAsXG5cdFx0YTogYCR7bGFiLmF9YCxcblx0XHRiOiBgJHtsYWIuYn1gLFxuXHRcdGFscGhhOiBgJHtsYWIuYWxwaGF9YFxuXHR9O1xufVxuXG5mdW5jdGlvbiBsYWJTdHJpbmdUb1ZhbHVlKGxhYjogTEFCVmFsdWVTdHJpbmcpOiBMQUJWYWx1ZSB7XG5cdHJldHVybiB7XG5cdFx0bDogYnJhbmQuYXNMQUJfTChwYXJzZUZsb2F0KGxhYi5sKSksXG5cdFx0YTogYnJhbmQuYXNMQUJfQShwYXJzZUZsb2F0KGxhYi5hKSksXG5cdFx0YjogYnJhbmQuYXNMQUJfQihwYXJzZUZsb2F0KGxhYi5iKSksXG5cdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShwYXJzZUZsb2F0KGxhYi5hbHBoYSkpXG5cdH07XG59XG5cbmZ1bmN0aW9uIHJnYlZhbHVlVG9TdHJpbmcocmdiOiBSR0JWYWx1ZSk6IFJHQlZhbHVlU3RyaW5nIHtcblx0cmV0dXJuIHtcblx0XHRyZWQ6IGAke3JnYi5yZWR9YCxcblx0XHRncmVlbjogYCR7cmdiLmdyZWVufWAsXG5cdFx0Ymx1ZTogYCR7cmdiLmJsdWV9YCxcblx0XHRhbHBoYTogYCR7cmdiLmFscGhhfWBcblx0fTtcbn1cblxuZnVuY3Rpb24gcmdiU3RyaW5nVG9WYWx1ZShyZ2I6IFJHQlZhbHVlU3RyaW5nKTogUkdCVmFsdWUge1xuXHRyZXR1cm4ge1xuXHRcdHJlZDogYnJhbmQuYXNCeXRlUmFuZ2UocGFyc2VGbG9hdChyZ2IucmVkKSksXG5cdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKHBhcnNlRmxvYXQocmdiLmdyZWVuKSksXG5cdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2UocGFyc2VGbG9hdChyZ2IuYmx1ZSkpLFxuXHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UocGFyc2VGbG9hdChyZ2IuYWxwaGEpKVxuXHR9O1xufVxuXG5mdW5jdGlvbiB0b0NvbG9yVmFsdWVSYW5nZTxUIGV4dGVuZHMga2V5b2YgUmFuZ2VLZXlNYXA+KFxuXHR2YWx1ZTogc3RyaW5nIHwgbnVtYmVyLFxuXHRyYW5nZUtleTogVFxuKTogUmFuZ2VLZXlNYXBbVF0ge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgcmFuZ2VLZXkpO1xuXG5cdGlmIChyYW5nZUtleSA9PT0gJ0hleFNldCcpIHtcblx0XHRyZXR1cm4gYnJhbmQuYXNIZXhTZXQodmFsdWUgYXMgc3RyaW5nKSBhcyB1bmtub3duIGFzIFJhbmdlS2V5TWFwW1RdO1xuXHR9XG5cblx0aWYgKHJhbmdlS2V5ID09PSAnSGV4Q29tcG9uZW50Jykge1xuXHRcdHJldHVybiBicmFuZC5hc0hleENvbXBvbmVudChcblx0XHRcdHZhbHVlIGFzIHN0cmluZ1xuXHRcdCkgYXMgdW5rbm93biBhcyBSYW5nZUtleU1hcFtUXTtcblx0fVxuXG5cdHJldHVybiBicmFuZC5hc0JyYW5kZWQoXG5cdFx0dmFsdWUgYXMgbnVtYmVyLFxuXHRcdHJhbmdlS2V5XG5cdCkgYXMgdW5rbm93biBhcyBSYW5nZUtleU1hcFtUXTtcbn1cblxuZnVuY3Rpb24geHl6VmFsdWVUb1N0cmluZyh4eXo6IFhZWlZhbHVlKTogWFlaVmFsdWVTdHJpbmcge1xuXHRyZXR1cm4ge1xuXHRcdHg6IGAke3h5ei54fWAsXG5cdFx0eTogYCR7eHl6Lnl9YCxcblx0XHR6OiBgJHt4eXouen1gLFxuXHRcdGFscGhhOiBgJHt4eXouYWxwaGF9YFxuXHR9O1xufVxuXG5mdW5jdGlvbiB4eXpTdHJpbmdUb1ZhbHVlKHh5ejogWFlaVmFsdWVTdHJpbmcpOiBYWVpWYWx1ZSB7XG5cdHJldHVybiB7XG5cdFx0eDogYnJhbmQuYXNYWVpfWChwYXJzZUZsb2F0KHh5ei54KSksXG5cdFx0eTogYnJhbmQuYXNYWVpfWShwYXJzZUZsb2F0KHh5ei55KSksXG5cdFx0ejogYnJhbmQuYXNYWVpfWihwYXJzZUZsb2F0KHh5ei56KSksXG5cdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShwYXJzZUZsb2F0KHh5ei5hbHBoYSkpXG5cdH07XG59XG5cbmNvbnN0IHN0cmluZ1RvVmFsdWUgPSB7XG5cdGNteWs6IGNteWtTdHJpbmdUb1ZhbHVlLFxuXHRoZXg6IGhleFN0cmluZ1RvVmFsdWUsXG5cdGhzbDogaHNsU3RyaW5nVG9WYWx1ZSxcblx0aHN2OiBoc3ZTdHJpbmdUb1ZhbHVlLFxuXHRsYWI6IGxhYlN0cmluZ1RvVmFsdWUsXG5cdHJnYjogcmdiU3RyaW5nVG9WYWx1ZSxcblx0eHl6OiB4eXpTdHJpbmdUb1ZhbHVlXG59O1xuXG5jb25zdCB2YWx1ZVRvU3RyaW5nID0ge1xuXHRjbXlrOiBjbXlrVmFsdWVUb1N0cmluZyxcblx0aGV4OiBoZXhWYWx1ZVRvU3RyaW5nLFxuXHRoc2w6IGhzbFZhbHVlVG9TdHJpbmcsXG5cdGhzdjogaHN2VmFsdWVUb1N0cmluZyxcblx0bGFiOiBsYWJWYWx1ZVRvU3RyaW5nLFxuXHRyZ2I6IHJnYlZhbHVlVG9TdHJpbmcsXG5cdHh5ejogeHl6VmFsdWVUb1N0cmluZ1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbnZlcnQ6IENvbW1vbkZ1bmN0aW9uc01hc3RlckludGVyZmFjZVsnY29yZSddWydjb252ZXJ0J10gPSB7XG5cdGNvbG9yU3RyaW5nVG9Db2xvcixcblx0aGV4QWxwaGFUb051bWVyaWNBbHBoYSxcblx0c3RyaW5nVG9WYWx1ZSxcblx0dG9Db2xvclZhbHVlUmFuZ2UsXG5cdGNvbG9yVG9DU1NDb2xvclN0cmluZyxcblx0dmFsdWVUb1N0cmluZ1xufTtcblxuLy8gKioqKioqKiogU0VDVElPTiA0IC0gR3VhcmRzICoqKioqKioqXG5cbmZ1bmN0aW9uIGlzQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDb2xvciB7XG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8IHZhbHVlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cblx0Y29uc3QgY29sb3IgPSB2YWx1ZSBhcyBDb2xvcjtcblx0Y29uc3QgdmFsaWRGb3JtYXRzOiBDb2xvclsnZm9ybWF0J11bXSA9IFtcblx0XHQnY215aycsXG5cdFx0J2hleCcsXG5cdFx0J2hzbCcsXG5cdFx0J2hzdicsXG5cdFx0J2xhYicsXG5cdFx0J3JnYicsXG5cdFx0J3NsJyxcblx0XHQnc3YnLFxuXHRcdCd4eXonXG5cdF07XG5cblx0cmV0dXJuIChcblx0XHQndmFsdWUnIGluIGNvbG9yICYmXG5cdFx0J2Zvcm1hdCcgaW4gY29sb3IgJiZcblx0XHR2YWxpZEZvcm1hdHMuaW5jbHVkZXMoY29sb3IuZm9ybWF0KVxuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0NvbG9yU3BhY2UodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDb2xvclNwYWNlIHtcblx0Y29uc3QgdmFsaWRDb2xvclNwYWNlczogQ29sb3JTcGFjZVtdID0gW1xuXHRcdCdjbXlrJyxcblx0XHQnaGV4Jyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnbGFiJyxcblx0XHQncmdiJyxcblx0XHQneHl6J1xuXHRdO1xuXG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJlxuXHRcdHZhbGlkQ29sb3JTcGFjZXMuaW5jbHVkZXModmFsdWUgYXMgQ29sb3JTcGFjZSlcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNDb2xvclN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENvbG9yU3RyaW5nIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuXHRjb25zdCBjb2xvclN0cmluZyA9IHZhbHVlIGFzIENvbG9yU3RyaW5nO1xuXHRjb25zdCB2YWxpZFN0cmluZ0Zvcm1hdHM6IENvbG9yU3RyaW5nWydmb3JtYXQnXVtdID0gW1xuXHRcdCdjbXlrJyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnc2wnLFxuXHRcdCdzdidcblx0XTtcblxuXHRyZXR1cm4gKFxuXHRcdCd2YWx1ZScgaW4gY29sb3JTdHJpbmcgJiZcblx0XHQnZm9ybWF0JyBpbiBjb2xvclN0cmluZyAmJlxuXHRcdHZhbGlkU3RyaW5nRm9ybWF0cy5pbmNsdWRlcyhjb2xvclN0cmluZy5mb3JtYXQpXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSW5SYW5nZTxUIGV4dGVuZHMga2V5b2YgdHlwZW9mIF9zZXRzPihcblx0dmFsdWU6IG51bWJlciB8IHN0cmluZyxcblx0cmFuZ2VLZXk6IFRcbik6IGJvb2xlYW4ge1xuXHRpZiAocmFuZ2VLZXkgPT09ICdIZXhTZXQnKSB7XG5cdFx0cmV0dXJuIHZhbGlkYXRlLmhleFNldCh2YWx1ZSBhcyBzdHJpbmcpO1xuXHR9XG5cblx0aWYgKHJhbmdlS2V5ID09PSAnSGV4Q29tcG9uZW50Jykge1xuXHRcdHJldHVybiB2YWxpZGF0ZS5oZXhDb21wb25lbnQodmFsdWUgYXMgc3RyaW5nKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIEFycmF5LmlzQXJyYXkoX3NldHNbcmFuZ2VLZXldKSkge1xuXHRcdGNvbnN0IFttaW4sIG1heF0gPSBfc2V0c1tyYW5nZUtleV0gYXMgW251bWJlciwgbnVtYmVyXTtcblxuXHRcdHJldHVybiB2YWx1ZSA+PSBtaW4gJiYgdmFsdWUgPD0gbWF4O1xuXHR9XG5cblx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHJhbmdlIG9yIHZhbHVlIGZvciAke1N0cmluZyhyYW5nZUtleSl9YCk7XG59XG5cbmV4cG9ydCBjb25zdCBndWFyZHM6IENvbW1vbkZ1bmN0aW9uc01hc3RlckludGVyZmFjZVsnY29yZSddWydndWFyZHMnXSA9IHtcblx0aXNDb2xvcixcblx0aXNDb2xvclNwYWNlLFxuXHRpc0NvbG9yU3RyaW5nLFxuXHRpc0luUmFuZ2Vcbn07XG5cbi8vICoqKioqKioqIFNFQ1RJT04gNSAtIFNhbml0aXplICoqKioqKioqXG5cbmZ1bmN0aW9uIGxhYih2YWx1ZTogbnVtYmVyLCBvdXRwdXQ6ICdsJyB8ICdhJyB8ICdiJyk6IExBQl9MIHwgTEFCX0EgfCBMQUJfQiB7XG5cdGlmIChvdXRwdXQgPT09ICdsJykge1xuXHRcdHJldHVybiBicmFuZC5hc0xBQl9MKE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIDApLCAxMDApKSk7XG5cdH0gZWxzZSBpZiAob3V0cHV0ID09PSAnYScpIHtcblx0XHRyZXR1cm4gYnJhbmQuYXNMQUJfQShNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAtMTI1KSwgMTI1KSkpO1xuXHR9IGVsc2UgaWYgKG91dHB1dCA9PT0gJ2InKSB7XG5cdFx0cmV0dXJuIGJyYW5kLmFzTEFCX0IoTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgLTEyNSksIDEyNSkpKTtcblx0fSBlbHNlIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHJldHVybiBMQUIgdmFsdWUnKTtcbn1cblxuZnVuY3Rpb24gcGVyY2VudGlsZSh2YWx1ZTogbnVtYmVyKTogUGVyY2VudGlsZSB7XG5cdGNvbnN0IHJhd1BlcmNlbnRpbGUgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAwKSwgMTAwKSk7XG5cblx0cmV0dXJuIGJyYW5kLmFzUGVyY2VudGlsZShyYXdQZXJjZW50aWxlKTtcbn1cblxuZnVuY3Rpb24gcmFkaWFsKHZhbHVlOiBudW1iZXIpOiBSYWRpYWwge1xuXHRjb25zdCByYXdSYWRpYWwgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAwKSwgMzYwKSkgJiAzNjA7XG5cblx0cmV0dXJuIGJyYW5kLmFzUmFkaWFsKHJhd1JhZGlhbCk7XG59XG5cbmZ1bmN0aW9uIHJnYih2YWx1ZTogbnVtYmVyKTogQnl0ZVJhbmdlIHtcblx0Y29uc3QgcmF3Qnl0ZVJhbmdlID0gTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgMCksIDI1NSkpO1xuXG5cdHJldHVybiB0b0NvbG9yVmFsdWVSYW5nZShyYXdCeXRlUmFuZ2UsICdCeXRlUmFuZ2UnKTtcbn1cblxuZXhwb3J0IGNvbnN0IHNhbml0aXplID0ge1xuXHRsYWIsXG5cdHBlcmNlbnRpbGUsXG5cdHJhZGlhbCxcblx0cmdiXG59O1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDUuMSAtIFZhbGlkYXRlICoqKioqKioqKlxuXG5mdW5jdGlvbiBjb2xvclZhbHVlcyhjb2xvcjogQ29sb3IgfCBTTCB8IFNWKTogYm9vbGVhbiB7XG5cdGNvbnN0IGNsb25lZENvbG9yID0gY2xvbmUoY29sb3IpO1xuXHRjb25zdCBpc051bWVyaWNWYWxpZCA9ICh2YWx1ZTogdW5rbm93bik6IGJvb2xlYW4gPT5cblx0XHR0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSk7XG5cdGNvbnN0IG5vcm1hbGl6ZVBlcmNlbnRhZ2UgPSAodmFsdWU6IHN0cmluZyB8IG51bWJlcik6IG51bWJlciA9PiB7XG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuZW5kc1dpdGgoJyUnKSkge1xuXHRcdFx0cmV0dXJuIHBhcnNlRmxvYXQodmFsdWUuc2xpY2UoMCwgLTEpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IHZhbHVlIDogTmFOO1xuXHR9O1xuXG5cdHN3aXRjaCAoY2xvbmVkQ29sb3IuZm9ybWF0KSB7XG5cdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuY3lhbixcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5tYWdlbnRhLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnllbGxvdyxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5rZXlcblx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuY3lhbiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmN5YW4gPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLm1hZ2VudGEgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5tYWdlbnRhIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55ZWxsb3cgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55ZWxsb3cgPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmtleSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmtleSA8PSAxMDBcblx0XHRcdCk7XG5cdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdHJldHVybiAvXiNbMC05QS1GYS1mXXs2fSQvLnRlc3QoY2xvbmVkQ29sb3IudmFsdWUuaGV4KTtcblx0XHRjYXNlICdoc2wnOlxuXHRcdFx0Y29uc3QgaXNWYWxpZEhTTEh1ZSA9XG5cdFx0XHRcdGlzTnVtZXJpY1ZhbGlkKGNsb25lZENvbG9yLnZhbHVlLmh1ZSkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlIDw9IDM2MDtcblx0XHRcdGNvbnN0IGlzVmFsaWRIU0xTYXR1cmF0aW9uID1cblx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uKSA+PSAwICYmXG5cdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbikgPD0gMTAwO1xuXHRcdFx0Y29uc3QgaXNWYWxpZEhTTExpZ2h0bmVzcyA9IGNsb25lZENvbG9yLnZhbHVlLmxpZ2h0bmVzc1xuXHRcdFx0XHQ/IG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzKSA+PSAwICYmXG5cdFx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MpIDw9IDEwMFxuXHRcdFx0XHQ6IHRydWU7XG5cblx0XHRcdHJldHVybiBpc1ZhbGlkSFNMSHVlICYmIGlzVmFsaWRIU0xTYXR1cmF0aW9uICYmIGlzVmFsaWRIU0xMaWdodG5lc3M7XG5cdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdGNvbnN0IGlzVmFsaWRIU1ZIdWUgPVxuXHRcdFx0XHRpc051bWVyaWNWYWxpZChjbG9uZWRDb2xvci52YWx1ZS5odWUpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmh1ZSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmh1ZSA8PSAzNjA7XG5cdFx0XHRjb25zdCBpc1ZhbGlkSFNWU2F0dXJhdGlvbiA9XG5cdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbikgPj0gMCAmJlxuXHRcdFx0XHRub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24pIDw9IDEwMDtcblx0XHRcdGNvbnN0IGlzVmFsaWRIU1ZWYWx1ZSA9IGNsb25lZENvbG9yLnZhbHVlLnZhbHVlXG5cdFx0XHRcdD8gbm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSkgPj0gMCAmJlxuXHRcdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUudmFsdWUpIDw9IDEwMFxuXHRcdFx0XHQ6IHRydWU7XG5cblx0XHRcdHJldHVybiBpc1ZhbGlkSFNWSHVlICYmIGlzVmFsaWRIU1ZTYXR1cmF0aW9uICYmIGlzVmFsaWRIU1ZWYWx1ZTtcblx0XHRjYXNlICdsYWInOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0W1xuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmwsXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYSxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5iXG5cdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmwgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5sIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5hID49IC0xMjUgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYSA8PSAxMjUgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYiA+PSAtMTI1ICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmIgPD0gMTI1XG5cdFx0XHQpO1xuXHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUucmVkLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmdyZWVuLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmJsdWVcblx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUucmVkID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUucmVkIDw9IDI1NSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ncmVlbiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmdyZWVuIDw9IDI1NSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ibHVlID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYmx1ZSA8PSAyNTVcblx0XHRcdCk7XG5cdFx0Y2FzZSAnc2wnOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0W1xuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24sXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzXG5cdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24gPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MgPD0gMTAwXG5cdFx0XHQpO1xuXHRcdGNhc2UgJ3N2Jzpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFtjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uLCBjbG9uZWRDb2xvci52YWx1ZS52YWx1ZV0uZXZlcnkoXG5cdFx0XHRcdFx0aXNOdW1lcmljVmFsaWRcblx0XHRcdFx0KSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbiA8PSAxMDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUudmFsdWUgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSA8PSAxMDBcblx0XHRcdCk7XG5cdFx0Y2FzZSAneHl6Jzpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFtcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS54LFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnksXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuelxuXHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS54ID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueCA8PSA5NS4wNDcgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnkgPD0gMTAwLjAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnogPD0gMTA4Ljg4M1xuXHRcdFx0KTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0Y29uc29sZS5lcnJvcihgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yLmZvcm1hdH1gKTtcblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleCh2YWx1ZTogc3RyaW5nLCBwYXR0ZXJuOiBSZWdFeHApOiBib29sZWFuIHtcblx0cmV0dXJuIHBhdHRlcm4udGVzdCh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGhleENvbXBvbmVudCh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdHJldHVybiBoZXgodmFsdWUsIC9eW0EtRmEtZjAtOV17Mn0kLyk7XG59XG5cbmZ1bmN0aW9uIGhleFNldCh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdHJldHVybiAvXiNbMC05YS1mQS1GXXs2fSQvLnRlc3QodmFsdWUpO1xufVxuXG5mdW5jdGlvbiByYW5nZTxUIGV4dGVuZHMga2V5b2YgdHlwZW9mIF9zZXRzPihcblx0dmFsdWU6IG51bWJlciB8IHN0cmluZyxcblx0cmFuZ2VLZXk6IFRcbik6IHZvaWQge1xuXHRpZiAoIWlzSW5SYW5nZSh2YWx1ZSwgcmFuZ2VLZXkpKSB7XG5cdFx0aWYgKHJhbmdlS2V5ID09PSAnSGV4U2V0JyB8fCByYW5nZUtleSA9PT0gJ0hleENvbXBvbmVudCcpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB2YWx1ZSBmb3IgJHtTdHJpbmcocmFuZ2VLZXkpfTogJHt2YWx1ZX1gKTtcblx0XHR9XG5cblx0XHRjb25zdCBbbWluLCBtYXhdID0gX3NldHNbcmFuZ2VLZXldIGFzIFtudW1iZXIsIG51bWJlcl07XG5cblx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRgVmFsdWUgJHt2YWx1ZX0gaXMgb3V0IG9mIHJhbmdlIGZvciAke1N0cmluZyhyYW5nZUtleSl9IFske21pbn0sICR7bWF4fV1gXG5cdFx0KTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgdmFsaWRhdGU6IENvbW1vbkZ1bmN0aW9uc01hc3RlckludGVyZmFjZVsnY29yZSddWyd2YWxpZGF0ZSddID0ge1xuXHRjb2xvclZhbHVlcyxcblx0aGV4LFxuXHRoZXhDb21wb25lbnQsXG5cdGhleFNldCxcblx0cmFuZ2Vcbn07XG5cbi8vICoqKioqKioqIFNFQ1RJT04gNiAtIE90aGVyICoqKioqKioqXG5cbmZ1bmN0aW9uIGdldEZvcm1hdHRlZFRpbWVzdGFtcCgpOiBzdHJpbmcge1xuXHRjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuXHRjb25zdCB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG5cdGNvbnN0IG1vbnRoID0gU3RyaW5nKG5vdy5nZXRNb250aCgpICsgMSkucGFkU3RhcnQoMiwgJzAnKTtcblx0Y29uc3QgZGF5ID0gU3RyaW5nKG5vdy5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG5cdGNvbnN0IGhvdXJzID0gU3RyaW5nKG5vdy5nZXRIb3VycygpKS5wYWRTdGFydCgyLCAnMCcpO1xuXHRjb25zdCBtaW51dGVzID0gU3RyaW5nKG5vdy5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG5cdGNvbnN0IHNlY29uZHMgPSBTdHJpbmcobm93LmdldFNlY29uZHMoKSkucGFkU3RhcnQoMiwgJzAnKTtcblxuXHRyZXR1cm4gYCR7eWVhcn0tJHttb250aH0tJHtkYXl9ICR7aG91cnN9OiR7bWludXRlc306JHtzZWNvbmRzfWA7XG59XG5cbmV4cG9ydCBjb25zdCBvdGhlciA9IHsgZ2V0Rm9ybWF0dGVkVGltZXN0YW1wIH07XG5cbmV4cG9ydCB7IGNsb25lIH07XG4iXX0=