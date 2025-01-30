// File: common/core.js
import { dataSets as sets } from '../data/sets.js';
const _sets = sets;
// ******** SECTION 0 - Brand ********
function asBranded(value, rangeKey) {
    validate.range(value, rangeKey);
    return value;
}
function asByteRange(value) {
    validate.range(value, 'ByteRange');
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
    asBranded,
    asByteRange,
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
                key: brand.asPercentile(0)
            },
            format: 'cmyk'
        },
        hex: {
            value: {
                hex: brand.asHexSet('#000000')
            },
            format: 'hex'
        },
        hsl: {
            value: {
                hue: brand.asRadial(0),
                saturation: brand.asPercentile(0),
                lightness: brand.asPercentile(0)
            },
            format: 'hsl'
        },
        hsv: {
            value: {
                hue: brand.asRadial(0),
                saturation: brand.asPercentile(0),
                value: brand.asPercentile(0)
            },
            format: 'hsv'
        },
        lab: {
            value: {
                l: brand.asLAB_L(0),
                a: brand.asLAB_A(0),
                b: brand.asLAB_B(0)
            },
            format: 'lab'
        },
        rgb: {
            value: {
                red: brand.asByteRange(0),
                green: brand.asByteRange(0),
                blue: brand.asByteRange(0)
            },
            format: 'rgb'
        },
        sl: {
            value: {
                saturation: brand.asPercentile(0),
                lightness: brand.asPercentile(0)
            },
            format: 'sl'
        },
        sv: {
            value: {
                saturation: brand.asPercentile(0),
                value: brand.asPercentile(0)
            },
            format: 'sv'
        },
        xyz: {
            value: {
                x: brand.asXYZ_X(0),
                y: brand.asXYZ_Y(0),
                z: brand.asXYZ_Z(0)
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
            const [, hue, saturation, lightness] = match;
            return {
                value: {
                    hue: brand.asRadial(parseInt(hue)),
                    saturation: brand.asPercentile(parseInt(saturation)),
                    lightness: brand.asPercentile(parseInt(lightness))
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
    return {
        value: {
            cyan: brandedCyan,
            magenta: brandedMagenta,
            yellow: brandedYellow,
            key: brandedKey
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
    const hexRaw = hex.slice(0, 7);
    const brandedHex = brand.asHexSet(hexRaw);
    return {
        value: { hex: brandedHex },
        format: 'hex'
    };
}
function asHSL(color) {
    const brandedHue = brand.asRadial(color.value.hue);
    const brandedSaturation = brand.asPercentile(color.value.saturation);
    const brandedLightness = brand.asPercentile(color.value.lightness);
    return {
        value: {
            hue: brandedHue,
            saturation: brandedSaturation,
            lightness: brandedLightness
        },
        format: 'hsl'
    };
}
function asHSV(color) {
    const brandedHue = brand.asRadial(color.value.hue);
    const brandedSaturation = brand.asPercentile(color.value.saturation);
    const brandedValue = brand.asPercentile(color.value.value);
    return {
        value: {
            hue: brandedHue,
            saturation: brandedSaturation,
            value: brandedValue
        },
        format: 'hsv'
    };
}
function asLAB(color) {
    const brandedL = brand.asLAB_L(color.value.l);
    const brandedA = brand.asLAB_A(color.value.a);
    const brandedB = brand.asLAB_B(color.value.b);
    return {
        value: {
            l: brandedL,
            a: brandedA,
            b: brandedB
        },
        format: 'lab'
    };
}
function asRGB(color) {
    const brandedRed = brand.asByteRange(color.value.red);
    const brandedGreen = brand.asByteRange(color.value.green);
    const brandedBlue = brand.asByteRange(color.value.blue);
    return {
        value: {
            red: brandedRed,
            green: brandedGreen,
            blue: brandedBlue
        },
        format: 'rgb'
    };
}
function asSL(color) {
    const brandedSaturation = brand.asPercentile(color.value.saturation);
    const brandedLightness = brand.asPercentile(color.value.lightness);
    return {
        value: {
            saturation: brandedSaturation,
            lightness: brandedLightness
        },
        format: 'sl'
    };
}
function asSV(color) {
    const brandedSaturation = brand.asPercentile(color.value.saturation);
    const brandedValue = brand.asPercentile(color.value.value);
    return {
        value: {
            saturation: brandedSaturation,
            value: brandedValue
        },
        format: 'sv'
    };
}
function asXYZ(color) {
    const brandedX = brand.asXYZ_X(color.value.x);
    const brandedY = brand.asXYZ_Y(color.value.y);
    const brandedZ = brand.asXYZ_Z(color.value.z);
    return {
        value: {
            x: brandedX,
            y: brandedY,
            z: brandedZ
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
        key: brand.asPercentile(parseFloat(cmyk.key) / 100)
    };
}
function cmykValueToString(cmyk) {
    return {
        cyan: `${cmyk.cyan * 100}%`,
        magenta: `${cmyk.magenta * 100}%`,
        yellow: `${cmyk.yellow * 100}%`,
        key: `${cmyk.key * 100}%`
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
            return {
                value: {
                    hue: brandedHue,
                    saturation: brandedSaturation,
                    lightness: brandedLightness
                },
                format: 'hsl'
            };
    }
}
async function colorToCSSColorString(color) {
    try {
        switch (color.format) {
            case 'cmyk':
                return `cmyk(${color.value.cyan}, ${color.value.magenta}, ${color.value.yellow}, ${color.value.key}`;
            case 'hex':
                return String(color.value.hex);
            case 'hsl':
                return `hsl(${color.value.hue}, ${color.value.saturation}%, ${color.value.lightness}%`;
            case 'hsv':
                return `hsv(${color.value.hue}, ${color.value.saturation}%, ${color.value.value}%`;
            case 'lab':
                return `lab(${color.value.l}, ${color.value.a}, ${color.value.b})`;
            case 'rgb':
                return `rgb(${color.value.red}, ${color.value.green}, ${color.value.blue})`;
            case 'xyz':
                return `xyz(${color.value.x}, ${color.value.y}, ${color.value.z}`;
            default:
                console.error(`Unexpected color format: ${color.format}`);
                return '#FFFFFF';
        }
    }
    catch (error) {
        throw new Error(`getCSSColorString error: ${error}`);
    }
}
function hexStringToValue(hex) {
    return { hex: brand.asHexSet(hex.hex) };
}
function hexValueToString(hex) {
    return { hex: hex.hex };
}
function hslStringToValue(hsl) {
    return {
        hue: brand.asRadial(parseFloat(hsl.hue)),
        saturation: brand.asPercentile(parseFloat(hsl.saturation) / 100),
        lightness: brand.asPercentile(parseFloat(hsl.lightness) / 100)
    };
}
function hslValueToString(hsl) {
    return {
        hue: `${hsl.hue}°`,
        saturation: `${hsl.saturation * 100}%`,
        lightness: `${hsl.lightness * 100}%`
    };
}
function hsvStringToValue(hsv) {
    return {
        hue: brand.asRadial(parseFloat(hsv.hue)),
        saturation: brand.asPercentile(parseFloat(hsv.saturation) / 100),
        value: brand.asPercentile(parseFloat(hsv.value) / 100)
    };
}
function hsvValueToString(hsv) {
    return {
        hue: `${hsv.hue}°`,
        saturation: `${hsv.saturation * 100}%`,
        value: `${hsv.value * 100}%`
    };
}
function labValueToString(lab) {
    return {
        l: `${lab.l}`,
        a: `${lab.a}`,
        b: `${lab.b}`
    };
}
function labStringToValue(lab) {
    return {
        l: brand.asLAB_L(parseFloat(lab.l)),
        a: brand.asLAB_A(parseFloat(lab.a)),
        b: brand.asLAB_B(parseFloat(lab.b))
    };
}
function rgbValueToString(rgb) {
    return {
        red: `${rgb.red}`,
        green: `${rgb.green}`,
        blue: `${rgb.blue}`
    };
}
function rgbStringToValue(rgb) {
    return {
        red: brand.asByteRange(parseFloat(rgb.red)),
        green: brand.asByteRange(parseFloat(rgb.green)),
        blue: brand.asByteRange(parseFloat(rgb.blue))
    };
}
function toColorValueRange(value, rangeKey) {
    validate.range(value, rangeKey);
    if (rangeKey === 'HexSet') {
        return brand.asHexSet(value);
    }
    return brand.asBranded(value, rangeKey);
}
function xyzValueToString(xyz) {
    return {
        x: `${xyz.x}`,
        y: `${xyz.y}`,
        z: `${xyz.z}`
    };
}
function xyzStringToValue(xyz) {
    return {
        x: brand.asXYZ_X(parseFloat(xyz.x)),
        y: brand.asXYZ_Y(parseFloat(xyz.y)),
        z: brand.asXYZ_Z(parseFloat(xyz.z))
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
    if (rangeKey === 'HexSet') {
        return validate.hexSet(value);
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
        if (rangeKey === 'HexSet') {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vY29yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1QkFBdUI7QUE2Q3ZCLE9BQU8sRUFBRSxRQUFRLElBQUksSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFbkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBRW5CLHNDQUFzQztBQUV0QyxTQUFTLFNBQVMsQ0FDakIsS0FBYSxFQUNiLFFBQVc7SUFFWCxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUVoQyxPQUFPLEtBQXVCLENBQUM7QUFDaEMsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLEtBQWE7SUFDakMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFbkMsT0FBTyxLQUFrQixDQUFDO0FBQzNCLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FBQyxLQUFhO0lBQzlCLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDckMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUNELE9BQU8sS0FBZSxDQUFDO0FBQ3hCLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxLQUFhO0lBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRS9CLE9BQU8sS0FBYyxDQUFDO0FBQ3ZCLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxLQUFhO0lBQzdCLFFBQVEsQ0FBQyxL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QUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDMUQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFMUQsT0FBTyxHQUFHLElBQUksSUFBSSxLQUFLLElBQUksR0FBRyxJQUFJLEtBQUssSUFBSSxPQUFPLElBQUksT0FBTyxFQUFFLENBQUM7QUFDakUsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFLHFCQUFxQixFQUFFLENBQUM7QUFFL0MsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO0FBRWpCLDZDQUE2QztBQUU3QyxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQXFDO0lBQzFELElBQUk7SUFDSixLQUFLO0lBQ0wsVUFBVTtJQUNWLE9BQU87SUFDUCxNQUFNO0lBQ04sR0FBRyxLQUFLO0lBQ1IsUUFBUTtJQUNSLFFBQVE7Q0FDQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogY29tbW9uL2NvcmUuanNcblxuaW1wb3J0IHtcblx0Qnl0ZVJhbmdlLFxuXHRDTVlLLFxuXHRDTVlLX1N0cmluZ1Byb3BzLFxuXHRDb2xvcixcblx0Q29sb3JTcGFjZSxcblx0Q29sb3JfU3RyaW5nUHJvcHMsXG5cdENvbW1vbkZuX01hc3RlckludGVyZmFjZSxcblx0SGV4LFxuXHRIZXhTZXQsXG5cdEhleF9TdHJpbmdQcm9wcyxcblx0SFNMLFxuXHRIU0xfU3RyaW5nUHJvcHMsXG5cdEhTVixcblx0SFNWX1N0cmluZ1Byb3BzLFxuXHRMQUIsXG5cdExBQl9TdHJpbmdQcm9wcyxcblx0TEFCX0wsXG5cdExBQl9BLFxuXHRMQUJfQixcblx0TnVtZXJpY1JhbmdlS2V5LFxuXHRQZXJjZW50aWxlLFxuXHRSYWRpYWwsXG5cdFJhbmdlS2V5TWFwLFxuXHRSR0IsXG5cdFJHQl9TdHJpbmdQcm9wcyxcblx0U0wsXG5cdFNWLFxuXHRVbmJyYW5kZWRDTVlLLFxuXHRVbmJyYW5kZWRIZXgsXG5cdFVuYnJhbmRlZEhTTCxcblx0VW5icmFuZGVkSFNWLFxuXHRVbmJyYW5kZWRMQUIsXG5cdFVuYnJhbmRlZFJHQixcblx0VW5icmFuZGVkU0wsXG5cdFVuYnJhbmRlZFNWLFxuXHRVbmJyYW5kZWRYWVosXG5cdFhZWixcblx0WFlaX1N0cmluZ1Byb3BzLFxuXHRYWVpfWCxcblx0WFlaX1ksXG5cdFhZWl9aXG59IGZyb20gJy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGFTZXRzIGFzIHNldHMgfSBmcm9tICcuLi9kYXRhL3NldHMuanMnO1xuXG5jb25zdCBfc2V0cyA9IHNldHM7XG5cbi8vICoqKioqKioqIFNFQ1RJT04gMCAtIEJyYW5kICoqKioqKioqXG5cbmZ1bmN0aW9uIGFzQnJhbmRlZDxUIGV4dGVuZHMga2V5b2YgUmFuZ2VLZXlNYXA+KFxuXHR2YWx1ZTogbnVtYmVyLFxuXHRyYW5nZUtleTogVFxuKTogUmFuZ2VLZXlNYXBbVF0ge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgcmFuZ2VLZXkpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBSYW5nZUtleU1hcFtUXTtcbn1cblxuZnVuY3Rpb24gYXNCeXRlUmFuZ2UodmFsdWU6IG51bWJlcik6IEJ5dGVSYW5nZSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnQnl0ZVJhbmdlJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIEJ5dGVSYW5nZTtcbn1cblxuZnVuY3Rpb24gYXNIZXhTZXQodmFsdWU6IHN0cmluZyk6IEhleFNldCB7XG5cdGlmICgvXiNbMC05YS1mQS1GXXs4fSQvLnRlc3QodmFsdWUpKSB7XG5cdFx0dmFsdWUgPSB2YWx1ZS5zbGljZSgwLCA3KTtcblx0fVxuXHRpZiAoIXZhbGlkYXRlLmhleFNldCh2YWx1ZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgSGV4U2V0IHZhbHVlOiAke3ZhbHVlfWApO1xuXHR9XG5cdHJldHVybiB2YWx1ZSBhcyBIZXhTZXQ7XG59XG5cbmZ1bmN0aW9uIGFzTEFCX0wodmFsdWU6IG51bWJlcik6IExBQl9MIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdMQUJfTCcpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBMQUJfTDtcbn1cblxuZnVuY3Rpb24gYXNMQUJfQSh2YWx1ZTogbnVtYmVyKTogTEFCX0Ege1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ0xBQl9BJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIExBQl9BO1xufVxuXG5mdW5jdGlvbiBhc0xBQl9CKHZhbHVlOiBudW1iZXIpOiBMQUJfQiB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnTEFCX0InKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgTEFCX0I7XG59XG5cbmZ1bmN0aW9uIGFzUGVyY2VudGlsZSh2YWx1ZTogbnVtYmVyKTogUGVyY2VudGlsZSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnUGVyY2VudGlsZScpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBQZXJjZW50aWxlO1xufVxuXG5mdW5jdGlvbiBhc1JhZGlhbCh2YWx1ZTogbnVtYmVyKTogUmFkaWFsIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdSYWRpYWwnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgUmFkaWFsO1xufVxuXG5mdW5jdGlvbiBhc1hZWl9YKHZhbHVlOiBudW1iZXIpOiBYWVpfWCB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCAnWFlaX1gnKTtcblxuXHRyZXR1cm4gdmFsdWUgYXMgWFlaX1g7XG59XG5cbmZ1bmN0aW9uIGFzWFlaX1kodmFsdWU6IG51bWJlcik6IFhZWl9ZIHtcblx0dmFsaWRhdGUucmFuZ2UodmFsdWUsICdYWVpfWScpO1xuXG5cdHJldHVybiB2YWx1ZSBhcyBYWVpfWTtcbn1cblxuZnVuY3Rpb24gYXNYWVpfWih2YWx1ZTogbnVtYmVyKTogWFlaX1oge1xuXHR2YWxpZGF0ZS5yYW5nZSh2YWx1ZSwgJ1hZWl9aJyk7XG5cblx0cmV0dXJuIHZhbHVlIGFzIFhZWl9aO1xufVxuXG5leHBvcnQgY29uc3QgYnJhbmQ6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnY29yZSddWydicmFuZCddID0ge1xuXHRhc0JyYW5kZWQsXG5cdGFzQnl0ZVJhbmdlLFxuXHRhc0hleFNldCxcblx0YXNMQUJfTCxcblx0YXNMQUJfQSxcblx0YXNMQUJfQixcblx0YXNQZXJjZW50aWxlLFxuXHRhc1JhZGlhbCxcblx0YXNYWVpfWCxcblx0YXNYWVpfWSxcblx0YXNYWVpfWlxufTtcblxuLy8gKioqKioqKiogU0VDVElPTiAxICoqKioqKioqXG5cbmZ1bmN0aW9uIGluaXRpYWxpemVEZWZhdWx0Q29sb3JzKCkge1xuXHRyZXR1cm4ge1xuXHRcdGNteWs6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGN5YW46IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0bWFnZW50YTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHR5ZWxsb3c6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0a2V5OiBicmFuZC5hc1BlcmNlbnRpbGUoMClcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdH0sXG5cdFx0aGV4OiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRoZXg6IGJyYW5kLmFzSGV4U2V0KCcjMDAwMDAwJylcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0fSxcblx0XHRoc2w6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoMCksXG5cdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoMClcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0fSxcblx0XHRoc3Y6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoMCksXG5cdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZSgwKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHR9LFxuXHRcdGxhYjoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0bDogYnJhbmQuYXNMQUJfTCgwKSxcblx0XHRcdFx0YTogYnJhbmQuYXNMQUJfQSgwKSxcblx0XHRcdFx0YjogYnJhbmQuYXNMQUJfQigwKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHR9LFxuXHRcdHJnYjoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZSgwKSxcblx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRibHVlOiBicmFuZC5hc0J5dGVSYW5nZSgwKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9LFxuXHRcdHNsOiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKDApXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnc2wnXG5cdFx0fSxcblx0XHRzdjoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKDApXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnc3YnXG5cdFx0fSxcblx0XHR4eXo6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHg6IGJyYW5kLmFzWFlaX1goMCksXG5cdFx0XHRcdHk6IGJyYW5kLmFzWFlaX1koMCksXG5cdFx0XHRcdHo6IGJyYW5kLmFzWFlaX1ooMClcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0fVxuXHR9O1xufVxuXG4vLyAqKioqKioqKiBTRUNUSU9OIDEgKioqKioqKipcblxuZnVuY3Rpb24gY2xhbXBUb1JhbmdlKHZhbHVlOiBudW1iZXIsIHJhbmdlS2V5OiBOdW1lcmljUmFuZ2VLZXkpOiBudW1iZXIge1xuXHRjb25zdCBbbWluLCBtYXhdID0gX3NldHNbcmFuZ2VLZXldO1xuXG5cdHJldHVybiBNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgbWluKSwgbWF4KTtcbn1cblxuZnVuY3Rpb24gY2xvbmU8VD4odmFsdWU6IFQpOiBUIHtcblx0cmV0dXJuIHN0cnVjdHVyZWRDbG9uZSh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGRlYm91bmNlPFQgZXh0ZW5kcyAoLi4uYXJnczogUGFyYW1ldGVyczxUPikgPT4gdm9pZD4oXG5cdGZ1bmM6IFQsXG5cdGRlbGF5OiBudW1iZXJcbikge1xuXHRsZXQgdGltZW91dDogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudWxsID0gbnVsbDtcblxuXHRyZXR1cm4gKC4uLmFyZ3M6IFBhcmFtZXRlcnM8VD4pOiB2b2lkID0+IHtcblx0XHRpZiAodGltZW91dCkgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0ZnVuYyguLi5hcmdzKTtcblx0XHR9LCBkZWxheSk7XG5cdH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ3VzdG9tQ29sb3IocmF3VmFsdWU6IHN0cmluZyk6IEhTTCB8IG51bGwge1xuXHR0cnkge1xuXHRcdGNvbnN0IG1hdGNoID0gcmF3VmFsdWUubWF0Y2goXG5cdFx0XHQvaHNsXFwoKFxcZCspLFxccyooXFxkKyklPyxcXHMqKFxcZCspJT8sXFxzKihcXGQqXFwuP1xcZCspXFwpL1xuXHRcdCk7XG5cblx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdGNvbnN0IFssIGh1ZSwgc2F0dXJhdGlvbiwgbGlnaHRuZXNzXSA9IG1hdGNoO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwocGFyc2VJbnQoaHVlKSksXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlSW50KHNhdHVyYXRpb24pKSxcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUludChsaWdodG5lc3MpKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHQnSW52YWxpZCBIU0wgY3VzdG9tIGNvbG9yLiBFeHBlY3RlZCBmb3JtYXQ6IGhzbChILCBTJSwgTCUsIEEpXFxuY2FsbGVyOiBwYXJzZUN1c3RvbUNvbG9yKCknXG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgcGFyc2VDdXN0b21Db2xvciBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBiYXNlOiBDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2VbJ2NvcmUnXVsnYmFzZSddID0ge1xuXHRjbGFtcFRvUmFuZ2UsXG5cdGNsb25lLFxuXHRkZWJvdW5jZSxcblx0cGFyc2VDdXN0b21Db2xvclxufSBhcyBjb25zdDtcblxuLy8gKioqKioqKiogU0VDVElPTiAyIC0gQnJhbmQgQ29sb3IgKioqKioqKipcblxuZnVuY3Rpb24gYXNDTVlLKGNvbG9yOiBVbmJyYW5kZWRDTVlLKTogQ01ZSyB7XG5cdGNvbnN0IGJyYW5kZWRDeWFuID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLmN5YW4pO1xuXHRjb25zdCBicmFuZGVkTWFnZW50YSA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5tYWdlbnRhKTtcblx0Y29uc3QgYnJhbmRlZFllbGxvdyA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS55ZWxsb3cpO1xuXHRjb25zdCBicmFuZGVkS2V5ID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLmtleSk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0Y3lhbjogYnJhbmRlZEN5YW4sXG5cdFx0XHRtYWdlbnRhOiBicmFuZGVkTWFnZW50YSxcblx0XHRcdHllbGxvdzogYnJhbmRlZFllbGxvdyxcblx0XHRcdGtleTogYnJhbmRlZEtleVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnY215aydcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNIZXgoY29sb3I6IFVuYnJhbmRlZEhleCk6IEhleCB7XG5cdGxldCBoZXggPSBjb2xvci52YWx1ZS5oZXg7XG5cblx0aWYgKCFoZXguc3RhcnRzV2l0aCgnIycpKSBoZXggPSBgIyR7aGV4fWA7XG5cblx0aWYgKCEvXiNbMC05QS1GYS1mXXs4fSQvLnRlc3QoaGV4KSlcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgSGV4IGNvbG9yIGZvcm1hdDogJHtoZXh9YCk7XG5cblx0Y29uc3QgaGV4UmF3ID0gaGV4LnNsaWNlKDAsIDcpO1xuXG5cdGNvbnN0IGJyYW5kZWRIZXggPSBicmFuZC5hc0hleFNldChoZXhSYXcpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHsgaGV4OiBicmFuZGVkSGV4IH0sXG5cdFx0Zm9ybWF0OiAnaGV4J1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc0hTTChjb2xvcjogVW5icmFuZGVkSFNMKTogSFNMIHtcblx0Y29uc3QgYnJhbmRlZEh1ZSA9IGJyYW5kLmFzUmFkaWFsKGNvbG9yLnZhbHVlLmh1ZSk7XG5cdGNvbnN0IGJyYW5kZWRTYXR1cmF0aW9uID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnNhdHVyYXRpb24pO1xuXHRjb25zdCBicmFuZGVkTGlnaHRuZXNzID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLmxpZ2h0bmVzcyk7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0aHVlOiBicmFuZGVkSHVlLFxuXHRcdFx0c2F0dXJhdGlvbjogYnJhbmRlZFNhdHVyYXRpb24sXG5cdFx0XHRsaWdodG5lc3M6IGJyYW5kZWRMaWdodG5lc3Ncblx0XHR9LFxuXHRcdGZvcm1hdDogJ2hzbCdcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNIU1YoY29sb3I6IFVuYnJhbmRlZEhTVik6IEhTViB7XG5cdGNvbnN0IGJyYW5kZWRIdWUgPSBicmFuZC5hc1JhZGlhbChjb2xvci52YWx1ZS5odWUpO1xuXHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5zYXR1cmF0aW9uKTtcblx0Y29uc3QgYnJhbmRlZFZhbHVlID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnZhbHVlKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRodWU6IGJyYW5kZWRIdWUsXG5cdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdHZhbHVlOiBicmFuZGVkVmFsdWVcblx0XHR9LFxuXHRcdGZvcm1hdDogJ2hzdidcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNMQUIoY29sb3I6IFVuYnJhbmRlZExBQik6IExBQiB7XG5cdGNvbnN0IGJyYW5kZWRMID0gYnJhbmQuYXNMQUJfTChjb2xvci52YWx1ZS5sKTtcblx0Y29uc3QgYnJhbmRlZEEgPSBicmFuZC5hc0xBQl9BKGNvbG9yLnZhbHVlLmEpO1xuXHRjb25zdCBicmFuZGVkQiA9IGJyYW5kLmFzTEFCX0IoY29sb3IudmFsdWUuYik7XG5cblx0cmV0dXJuIHtcblx0XHR2YWx1ZToge1xuXHRcdFx0bDogYnJhbmRlZEwsXG5cdFx0XHRhOiBicmFuZGVkQSxcblx0XHRcdGI6IGJyYW5kZWRCXG5cdFx0fSxcblx0XHRmb3JtYXQ6ICdsYWInXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzUkdCKGNvbG9yOiBVbmJyYW5kZWRSR0IpOiBSR0Ige1xuXHRjb25zdCBicmFuZGVkUmVkID0gYnJhbmQuYXNCeXRlUmFuZ2UoY29sb3IudmFsdWUucmVkKTtcblx0Y29uc3QgYnJhbmRlZEdyZWVuID0gYnJhbmQuYXNCeXRlUmFuZ2UoY29sb3IudmFsdWUuZ3JlZW4pO1xuXHRjb25zdCBicmFuZGVkQmx1ZSA9IGJyYW5kLmFzQnl0ZVJhbmdlKGNvbG9yLnZhbHVlLmJsdWUpO1xuXG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdHJlZDogYnJhbmRlZFJlZCxcblx0XHRcdGdyZWVuOiBicmFuZGVkR3JlZW4sXG5cdFx0XHRibHVlOiBicmFuZGVkQmx1ZVxuXHRcdH0sXG5cdFx0Zm9ybWF0OiAncmdiJ1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc1NMKGNvbG9yOiBVbmJyYW5kZWRTTCk6IFNMIHtcblx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUuc2F0dXJhdGlvbik7XG5cdGNvbnN0IGJyYW5kZWRMaWdodG5lc3MgPSBicmFuZC5hc1BlcmNlbnRpbGUoY29sb3IudmFsdWUubGlnaHRuZXNzKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdGxpZ2h0bmVzczogYnJhbmRlZExpZ2h0bmVzc1xuXHRcdH0sXG5cdFx0Zm9ybWF0OiAnc2wnXG5cdH07XG59XG5cbmZ1bmN0aW9uIGFzU1YoY29sb3I6IFVuYnJhbmRlZFNWKTogU1Yge1xuXHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IGJyYW5kLmFzUGVyY2VudGlsZShjb2xvci52YWx1ZS5zYXR1cmF0aW9uKTtcblx0Y29uc3QgYnJhbmRlZFZhbHVlID0gYnJhbmQuYXNQZXJjZW50aWxlKGNvbG9yLnZhbHVlLnZhbHVlKTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdHZhbHVlOiBicmFuZGVkVmFsdWVcblx0XHR9LFxuXHRcdGZvcm1hdDogJ3N2J1xuXHR9O1xufVxuXG5mdW5jdGlvbiBhc1hZWihjb2xvcjogVW5icmFuZGVkWFlaKTogWFlaIHtcblx0Y29uc3QgYnJhbmRlZFggPSBicmFuZC5hc1hZWl9YKGNvbG9yLnZhbHVlLngpO1xuXHRjb25zdCBicmFuZGVkWSA9IGJyYW5kLmFzWFlaX1koY29sb3IudmFsdWUueSk7XG5cdGNvbnN0IGJyYW5kZWRaID0gYnJhbmQuYXNYWVpfWihjb2xvci52YWx1ZS56KTtcblxuXHRyZXR1cm4ge1xuXHRcdHZhbHVlOiB7XG5cdFx0XHR4OiBicmFuZGVkWCxcblx0XHRcdHk6IGJyYW5kZWRZLFxuXHRcdFx0ejogYnJhbmRlZFpcblx0XHR9LFxuXHRcdGZvcm1hdDogJ3h5eidcblx0fTtcbn1cblxuZXhwb3J0IGNvbnN0IGJyYW5kQ29sb3I6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnY29yZSddWydicmFuZENvbG9yJ10gPSB7XG5cdGFzQ01ZSyxcblx0YXNIZXgsXG5cdGFzSFNMLFxuXHRhc0hTVixcblx0YXNMQUIsXG5cdGFzUkdCLFxuXHRhc1NMLFxuXHRhc1NWLFxuXHRhc1hZWlxufTtcblxuLy8gKioqKioqKiogU0VDVElPTiAzIC0gQ29udmVydCAqKioqKioqKlxuXG5mdW5jdGlvbiBjbXlrU3RyaW5nVG9WYWx1ZShjbXlrOiBDTVlLX1N0cmluZ1Byb3BzWyd2YWx1ZSddKTogQ01ZS1sndmFsdWUnXSB7XG5cdHJldHVybiB7XG5cdFx0Y3lhbjogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoY215ay5jeWFuKSAvIDEwMCksXG5cdFx0bWFnZW50YTogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoY215ay5tYWdlbnRhKSAvIDEwMCksXG5cdFx0eWVsbG93OiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VGbG9hdChjbXlrLnllbGxvdykgLyAxMDApLFxuXHRcdGtleTogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoY215ay5rZXkpIC8gMTAwKVxuXHR9O1xufVxuXG5mdW5jdGlvbiBjbXlrVmFsdWVUb1N0cmluZyhjbXlrOiBDTVlLWyd2YWx1ZSddKTogQ01ZS19TdHJpbmdQcm9wc1sndmFsdWUnXSB7XG5cdHJldHVybiB7XG5cdFx0Y3lhbjogYCR7Y215ay5jeWFuICogMTAwfSVgLFxuXHRcdG1hZ2VudGE6IGAke2NteWsubWFnZW50YSAqIDEwMH0lYCxcblx0XHR5ZWxsb3c6IGAke2NteWsueWVsbG93ICogMTAwfSVgLFxuXHRcdGtleTogYCR7Y215ay5rZXkgKiAxMDB9JWBcblx0fTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY29sb3JTdHJpbmdUb0NvbG9yKFxuXHRjb2xvclN0cmluZzogQ29sb3JfU3RyaW5nUHJvcHNcbik6IFByb21pc2U8Q29sb3I+IHtcblx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjbG9uZShjb2xvclN0cmluZyk7XG5cblx0Y29uc3QgcGFyc2VWYWx1ZSA9ICh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyID0+XG5cdFx0dHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5lbmRzV2l0aCgnJScpXG5cdFx0XHQ/IHBhcnNlRmxvYXQodmFsdWUuc2xpY2UoMCwgLTEpKVxuXHRcdFx0OiBOdW1iZXIodmFsdWUpO1xuXG5cdGNvbnN0IG5ld1ZhbHVlID0gT2JqZWN0LmVudHJpZXMoY2xvbmVkQ29sb3IudmFsdWUpLnJlZHVjZShcblx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHRhY2Nba2V5IGFzIGtleW9mICh0eXBlb2YgY2xvbmVkQ29sb3IpWyd2YWx1ZSddXSA9IHBhcnNlVmFsdWUoXG5cdFx0XHRcdHZhbFxuXHRcdFx0KSBhcyBuZXZlcjtcblx0XHRcdHJldHVybiBhY2M7XG5cdFx0fSxcblx0XHR7fSBhcyBSZWNvcmQ8a2V5b2YgKHR5cGVvZiBjbG9uZWRDb2xvcilbJ3ZhbHVlJ10sIG51bWJlcj5cblx0KTtcblxuXHRzd2l0Y2ggKGNsb25lZENvbG9yLmZvcm1hdCkge1xuXHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnY215aycsIHZhbHVlOiBuZXdWYWx1ZSBhcyBDTVlLWyd2YWx1ZSddIH07XG5cdFx0Y2FzZSAnaHNsJzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ2hzbCcsIHZhbHVlOiBuZXdWYWx1ZSBhcyBIU0xbJ3ZhbHVlJ10gfTtcblx0XHRjYXNlICdoc3YnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnaHN2JywgdmFsdWU6IG5ld1ZhbHVlIGFzIEhTVlsndmFsdWUnXSB9O1xuXHRcdGNhc2UgJ3NsJzpcblx0XHRcdHJldHVybiB7IGZvcm1hdDogJ3NsJywgdmFsdWU6IG5ld1ZhbHVlIGFzIFNMWyd2YWx1ZSddIH07XG5cdFx0Y2FzZSAnc3YnOlxuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnc3YnLCB2YWx1ZTogbmV3VmFsdWUgYXMgU1ZbJ3ZhbHVlJ10gfTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0Y29uc29sZS5lcnJvcignVW5zdXBwb3J0ZWQgZm9ybWF0IGZvciBjb2xvclN0cmluZ1RvQ29sb3InKTtcblxuXHRcdFx0Y29uc3QgZGVmYXVsdENvbG9ycyA9IGluaXRpYWxpemVEZWZhdWx0Q29sb3JzKCk7XG5cblx0XHRcdGNvbnN0IHVuYnJhbmRlZEhTTCA9IGRlZmF1bHRDb2xvcnMuaHNsO1xuXG5cdFx0XHRjb25zdCBicmFuZGVkSHVlID0gYnJhbmQuYXNSYWRpYWwodW5icmFuZGVkSFNMLnZhbHVlLmh1ZSk7XG5cdFx0XHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0dW5icmFuZGVkSFNMLnZhbHVlLnNhdHVyYXRpb25cblx0XHRcdCk7XG5cdFx0XHRjb25zdCBicmFuZGVkTGlnaHRuZXNzID0gYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHR1bmJyYW5kZWRIU0wudmFsdWUubGlnaHRuZXNzXG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmRlZEh1ZSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kZWRMaWdodG5lc3Ncblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fTtcblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBjb2xvclRvQ1NTQ29sb3JTdHJpbmcoY29sb3I6IENvbG9yKTogUHJvbWlzZTxzdHJpbmc+IHtcblx0dHJ5IHtcblx0XHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdHJldHVybiBgY215aygke2NvbG9yLnZhbHVlLmN5YW59LCAke2NvbG9yLnZhbHVlLm1hZ2VudGF9LCAke2NvbG9yLnZhbHVlLnllbGxvd30sICR7Y29sb3IudmFsdWUua2V5fWA7XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRyZXR1cm4gU3RyaW5nKGNvbG9yLnZhbHVlLmhleCk7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gYGhzbCgke2NvbG9yLnZhbHVlLmh1ZX0sICR7Y29sb3IudmFsdWUuc2F0dXJhdGlvbn0lLCAke2NvbG9yLnZhbHVlLmxpZ2h0bmVzc30lYDtcblx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdHJldHVybiBgaHN2KCR7Y29sb3IudmFsdWUuaHVlfSwgJHtjb2xvci52YWx1ZS5zYXR1cmF0aW9ufSUsICR7Y29sb3IudmFsdWUudmFsdWV9JWA7XG5cdFx0XHRjYXNlICdsYWInOlxuXHRcdFx0XHRyZXR1cm4gYGxhYigke2NvbG9yLnZhbHVlLmx9LCAke2NvbG9yLnZhbHVlLmF9LCAke2NvbG9yLnZhbHVlLmJ9KWA7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gYHJnYigke2NvbG9yLnZhbHVlLnJlZH0sICR7Y29sb3IudmFsdWUuZ3JlZW59LCAke2NvbG9yLnZhbHVlLmJsdWV9KWA7XG5cdFx0XHRjYXNlICd4eXonOlxuXHRcdFx0XHRyZXR1cm4gYHh5eigke2NvbG9yLnZhbHVlLnh9LCAke2NvbG9yLnZhbHVlLnl9LCAke2NvbG9yLnZhbHVlLnp9YDtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYFVuZXhwZWN0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yLmZvcm1hdH1gKTtcblxuXHRcdFx0XHRyZXR1cm4gJyNGRkZGRkYnO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYGdldENTU0NvbG9yU3RyaW5nIGVycm9yOiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleFN0cmluZ1RvVmFsdWUoaGV4OiBIZXhfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10pOiBIZXhbJ3ZhbHVlJ10ge1xuXHRyZXR1cm4geyBoZXg6IGJyYW5kLmFzSGV4U2V0KGhleC5oZXgpIH07XG59XG5cbmZ1bmN0aW9uIGhleFZhbHVlVG9TdHJpbmcoaGV4OiBIZXhbJ3ZhbHVlJ10pOiBIZXhfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10ge1xuXHRyZXR1cm4geyBoZXg6IGhleC5oZXggfTtcbn1cblxuZnVuY3Rpb24gaHNsU3RyaW5nVG9WYWx1ZShoc2w6IEhTTF9TdHJpbmdQcm9wc1sndmFsdWUnXSk6IEhTTFsndmFsdWUnXSB7XG5cdHJldHVybiB7XG5cdFx0aHVlOiBicmFuZC5hc1JhZGlhbChwYXJzZUZsb2F0KGhzbC5odWUpKSxcblx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VGbG9hdChoc2wuc2F0dXJhdGlvbikgLyAxMDApLFxuXHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoaHNsLmxpZ2h0bmVzcykgLyAxMDApXG5cdH07XG59XG5cbmZ1bmN0aW9uIGhzbFZhbHVlVG9TdHJpbmcoaHNsOiBIU0xbJ3ZhbHVlJ10pOiBIU0xfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10ge1xuXHRyZXR1cm4ge1xuXHRcdGh1ZTogYCR7aHNsLmh1ZX3CsGAsXG5cdFx0c2F0dXJhdGlvbjogYCR7aHNsLnNhdHVyYXRpb24gKiAxMDB9JWAsXG5cdFx0bGlnaHRuZXNzOiBgJHtoc2wubGlnaHRuZXNzICogMTAwfSVgXG5cdH07XG59XG5cbmZ1bmN0aW9uIGhzdlN0cmluZ1RvVmFsdWUoaHN2OiBIU1ZfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10pOiBIU1ZbJ3ZhbHVlJ10ge1xuXHRyZXR1cm4ge1xuXHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwocGFyc2VGbG9hdChoc3YuaHVlKSksXG5cdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoaHN2LnNhdHVyYXRpb24pIC8gMTAwKSxcblx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoaHN2LnZhbHVlKSAvIDEwMClcblx0fTtcbn1cblxuZnVuY3Rpb24gaHN2VmFsdWVUb1N0cmluZyhoc3Y6IEhTVlsndmFsdWUnXSk6IEhTVl9TdHJpbmdQcm9wc1sndmFsdWUnXSB7XG5cdHJldHVybiB7XG5cdFx0aHVlOiBgJHtoc3YuaHVlfcKwYCxcblx0XHRzYXR1cmF0aW9uOiBgJHtoc3Yuc2F0dXJhdGlvbiAqIDEwMH0lYCxcblx0XHR2YWx1ZTogYCR7aHN2LnZhbHVlICogMTAwfSVgXG5cdH07XG59XG5cbmZ1bmN0aW9uIGxhYlZhbHVlVG9TdHJpbmcobGFiOiBMQUJbJ3ZhbHVlJ10pOiBMQUJfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10ge1xuXHRyZXR1cm4ge1xuXHRcdGw6IGAke2xhYi5sfWAsXG5cdFx0YTogYCR7bGFiLmF9YCxcblx0XHRiOiBgJHtsYWIuYn1gXG5cdH07XG59XG5cbmZ1bmN0aW9uIGxhYlN0cmluZ1RvVmFsdWUobGFiOiBMQUJfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10pOiBMQUJbJ3ZhbHVlJ10ge1xuXHRyZXR1cm4ge1xuXHRcdGw6IGJyYW5kLmFzTEFCX0wocGFyc2VGbG9hdChsYWIubCkpLFxuXHRcdGE6IGJyYW5kLmFzTEFCX0EocGFyc2VGbG9hdChsYWIuYSkpLFxuXHRcdGI6IGJyYW5kLmFzTEFCX0IocGFyc2VGbG9hdChsYWIuYikpXG5cdH07XG59XG5cbmZ1bmN0aW9uIHJnYlZhbHVlVG9TdHJpbmcocmdiOiBSR0JbJ3ZhbHVlJ10pOiBSR0JfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10ge1xuXHRyZXR1cm4ge1xuXHRcdHJlZDogYCR7cmdiLnJlZH1gLFxuXHRcdGdyZWVuOiBgJHtyZ2IuZ3JlZW59YCxcblx0XHRibHVlOiBgJHtyZ2IuYmx1ZX1gXG5cdH07XG59XG5cbmZ1bmN0aW9uIHJnYlN0cmluZ1RvVmFsdWUocmdiOiBSR0JfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10pOiBSR0JbJ3ZhbHVlJ10ge1xuXHRyZXR1cm4ge1xuXHRcdHJlZDogYnJhbmQuYXNCeXRlUmFuZ2UocGFyc2VGbG9hdChyZ2IucmVkKSksXG5cdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKHBhcnNlRmxvYXQocmdiLmdyZWVuKSksXG5cdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2UocGFyc2VGbG9hdChyZ2IuYmx1ZSkpXG5cdH07XG59XG5cbmZ1bmN0aW9uIHRvQ29sb3JWYWx1ZVJhbmdlPFQgZXh0ZW5kcyBrZXlvZiBSYW5nZUtleU1hcD4oXG5cdHZhbHVlOiBzdHJpbmcgfCBudW1iZXIsXG5cdHJhbmdlS2V5OiBUXG4pOiBSYW5nZUtleU1hcFtUXSB7XG5cdHZhbGlkYXRlLnJhbmdlKHZhbHVlLCByYW5nZUtleSk7XG5cblx0aWYgKHJhbmdlS2V5ID09PSAnSGV4U2V0Jykge1xuXHRcdHJldHVybiBicmFuZC5hc0hleFNldCh2YWx1ZSBhcyBzdHJpbmcpIGFzIHVua25vd24gYXMgUmFuZ2VLZXlNYXBbVF07XG5cdH1cblxuXHRyZXR1cm4gYnJhbmQuYXNCcmFuZGVkKFxuXHRcdHZhbHVlIGFzIG51bWJlcixcblx0XHRyYW5nZUtleVxuXHQpIGFzIHVua25vd24gYXMgUmFuZ2VLZXlNYXBbVF07XG59XG5cbmZ1bmN0aW9uIHh5elZhbHVlVG9TdHJpbmcoeHl6OiBYWVpbJ3ZhbHVlJ10pOiBYWVpfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10ge1xuXHRyZXR1cm4ge1xuXHRcdHg6IGAke3h5ei54fWAsXG5cdFx0eTogYCR7eHl6Lnl9YCxcblx0XHR6OiBgJHt4eXouen1gXG5cdH07XG59XG5cbmZ1bmN0aW9uIHh5elN0cmluZ1RvVmFsdWUoeHl6OiBYWVpfU3RyaW5nUHJvcHNbJ3ZhbHVlJ10pOiBYWVpbJ3ZhbHVlJ10ge1xuXHRyZXR1cm4ge1xuXHRcdHg6IGJyYW5kLmFzWFlaX1gocGFyc2VGbG9hdCh4eXoueCkpLFxuXHRcdHk6IGJyYW5kLmFzWFlaX1kocGFyc2VGbG9hdCh4eXoueSkpLFxuXHRcdHo6IGJyYW5kLmFzWFlaX1oocGFyc2VGbG9hdCh4eXoueikpXG5cdH07XG59XG5cbmNvbnN0IHN0cmluZ1RvVmFsdWUgPSB7XG5cdGNteWs6IGNteWtTdHJpbmdUb1ZhbHVlLFxuXHRoZXg6IGhleFN0cmluZ1RvVmFsdWUsXG5cdGhzbDogaHNsU3RyaW5nVG9WYWx1ZSxcblx0aHN2OiBoc3ZTdHJpbmdUb1ZhbHVlLFxuXHRsYWI6IGxhYlN0cmluZ1RvVmFsdWUsXG5cdHJnYjogcmdiU3RyaW5nVG9WYWx1ZSxcblx0eHl6OiB4eXpTdHJpbmdUb1ZhbHVlXG59O1xuXG5jb25zdCB2YWx1ZVRvU3RyaW5nID0ge1xuXHRjbXlrOiBjbXlrVmFsdWVUb1N0cmluZyxcblx0aGV4OiBoZXhWYWx1ZVRvU3RyaW5nLFxuXHRoc2w6IGhzbFZhbHVlVG9TdHJpbmcsXG5cdGhzdjogaHN2VmFsdWVUb1N0cmluZyxcblx0bGFiOiBsYWJWYWx1ZVRvU3RyaW5nLFxuXHRyZ2I6IHJnYlZhbHVlVG9TdHJpbmcsXG5cdHh5ejogeHl6VmFsdWVUb1N0cmluZ1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbnZlcnQ6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnY29yZSddWydjb252ZXJ0J10gPSB7XG5cdGNvbG9yU3RyaW5nVG9Db2xvcixcblx0c3RyaW5nVG9WYWx1ZSxcblx0dG9Db2xvclZhbHVlUmFuZ2UsXG5cdGNvbG9yVG9DU1NDb2xvclN0cmluZyxcblx0dmFsdWVUb1N0cmluZ1xufTtcblxuLy8gKioqKioqKiogU0VDVElPTiA0IC0gR3VhcmRzICoqKioqKioqXG5cbmZ1bmN0aW9uIGlzQ29sb3IodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDb2xvciB7XG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8IHZhbHVlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cblx0Y29uc3QgY29sb3IgPSB2YWx1ZSBhcyBDb2xvcjtcblx0Y29uc3QgdmFsaWRGb3JtYXRzOiBDb2xvclsnZm9ybWF0J11bXSA9IFtcblx0XHQnY215aycsXG5cdFx0J2hleCcsXG5cdFx0J2hzbCcsXG5cdFx0J2hzdicsXG5cdFx0J2xhYicsXG5cdFx0J3JnYicsXG5cdFx0J3NsJyxcblx0XHQnc3YnLFxuXHRcdCd4eXonXG5cdF07XG5cblx0cmV0dXJuIChcblx0XHQndmFsdWUnIGluIGNvbG9yICYmXG5cdFx0J2Zvcm1hdCcgaW4gY29sb3IgJiZcblx0XHR2YWxpZEZvcm1hdHMuaW5jbHVkZXMoY29sb3IuZm9ybWF0KVxuXHQpO1xufVxuXG5mdW5jdGlvbiBpc0NvbG9yU3BhY2UodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBDb2xvclNwYWNlIHtcblx0Y29uc3QgdmFsaWRDb2xvclNwYWNlczogQ29sb3JTcGFjZVtdID0gW1xuXHRcdCdjbXlrJyxcblx0XHQnaGV4Jyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnbGFiJyxcblx0XHQncmdiJyxcblx0XHQneHl6J1xuXHRdO1xuXG5cdHJldHVybiAoXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJlxuXHRcdHZhbGlkQ29sb3JTcGFjZXMuaW5jbHVkZXModmFsdWUgYXMgQ29sb3JTcGFjZSlcblx0KTtcbn1cblxuZnVuY3Rpb24gaXNDb2xvclN0cmluZyh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIENvbG9yX1N0cmluZ1Byb3BzIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuXHRjb25zdCBjb2xvclN0cmluZyA9IHZhbHVlIGFzIENvbG9yX1N0cmluZ1Byb3BzO1xuXHRjb25zdCB2YWxpZFN0cmluZ0Zvcm1hdHM6IENvbG9yX1N0cmluZ1Byb3BzWydmb3JtYXQnXVtdID0gW1xuXHRcdCdjbXlrJyxcblx0XHQnaHNsJyxcblx0XHQnaHN2Jyxcblx0XHQnc2wnLFxuXHRcdCdzdidcblx0XTtcblxuXHRyZXR1cm4gKFxuXHRcdCd2YWx1ZScgaW4gY29sb3JTdHJpbmcgJiZcblx0XHQnZm9ybWF0JyBpbiBjb2xvclN0cmluZyAmJlxuXHRcdHZhbGlkU3RyaW5nRm9ybWF0cy5pbmNsdWRlcyhjb2xvclN0cmluZy5mb3JtYXQpXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGlzSW5SYW5nZTxUIGV4dGVuZHMga2V5b2YgdHlwZW9mIF9zZXRzPihcblx0dmFsdWU6IG51bWJlciB8IHN0cmluZyxcblx0cmFuZ2VLZXk6IFRcbik6IGJvb2xlYW4ge1xuXHRpZiAocmFuZ2VLZXkgPT09ICdIZXhTZXQnKSB7XG5cdFx0cmV0dXJuIHZhbGlkYXRlLmhleFNldCh2YWx1ZSBhcyBzdHJpbmcpO1xuXHR9XG5cblx0aWYgKHJhbmdlS2V5ID09PSAnSGV4U2V0Jykge1xuXHRcdHJldHVybiB2YWxpZGF0ZS5oZXhTZXQodmFsdWUgYXMgc3RyaW5nKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIEFycmF5LmlzQXJyYXkoX3NldHNbcmFuZ2VLZXldKSkge1xuXHRcdGNvbnN0IFttaW4sIG1heF0gPSBfc2V0c1tyYW5nZUtleV0gYXMgW251bWJlciwgbnVtYmVyXTtcblxuXHRcdHJldHVybiB2YWx1ZSA+PSBtaW4gJiYgdmFsdWUgPD0gbWF4O1xuXHR9XG5cblx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHJhbmdlIG9yIHZhbHVlIGZvciAke1N0cmluZyhyYW5nZUtleSl9YCk7XG59XG5cbmV4cG9ydCBjb25zdCBndWFyZHM6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnY29yZSddWydndWFyZHMnXSA9IHtcblx0aXNDb2xvcixcblx0aXNDb2xvclNwYWNlLFxuXHRpc0NvbG9yU3RyaW5nLFxuXHRpc0luUmFuZ2Vcbn07XG5cbi8vICoqKioqKioqIFNFQ1RJT04gNSAtIFNhbml0aXplICoqKioqKioqXG5cbmZ1bmN0aW9uIGxhYih2YWx1ZTogbnVtYmVyLCBvdXRwdXQ6ICdsJyB8ICdhJyB8ICdiJyk6IExBQl9MIHwgTEFCX0EgfCBMQUJfQiB7XG5cdGlmIChvdXRwdXQgPT09ICdsJykge1xuXHRcdHJldHVybiBicmFuZC5hc0xBQl9MKE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIDApLCAxMDApKSk7XG5cdH0gZWxzZSBpZiAob3V0cHV0ID09PSAnYScpIHtcblx0XHRyZXR1cm4gYnJhbmQuYXNMQUJfQShNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAtMTI1KSwgMTI1KSkpO1xuXHR9IGVsc2UgaWYgKG91dHB1dCA9PT0gJ2InKSB7XG5cdFx0cmV0dXJuIGJyYW5kLmFzTEFCX0IoTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgLTEyNSksIDEyNSkpKTtcblx0fSBlbHNlIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHJldHVybiBMQUIgdmFsdWUnKTtcbn1cblxuZnVuY3Rpb24gcGVyY2VudGlsZSh2YWx1ZTogbnVtYmVyKTogUGVyY2VudGlsZSB7XG5cdGNvbnN0IHJhd1BlcmNlbnRpbGUgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAwKSwgMTAwKSk7XG5cblx0cmV0dXJuIGJyYW5kLmFzUGVyY2VudGlsZShyYXdQZXJjZW50aWxlKTtcbn1cblxuZnVuY3Rpb24gcmFkaWFsKHZhbHVlOiBudW1iZXIpOiBSYWRpYWwge1xuXHRjb25zdCByYXdSYWRpYWwgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCAwKSwgMzYwKSkgJiAzNjA7XG5cblx0cmV0dXJuIGJyYW5kLmFzUmFkaWFsKHJhd1JhZGlhbCk7XG59XG5cbmZ1bmN0aW9uIHJnYih2YWx1ZTogbnVtYmVyKTogQnl0ZVJhbmdlIHtcblx0Y29uc3QgcmF3Qnl0ZVJhbmdlID0gTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgMCksIDI1NSkpO1xuXG5cdHJldHVybiB0b0NvbG9yVmFsdWVSYW5nZShyYXdCeXRlUmFuZ2UsICdCeXRlUmFuZ2UnKTtcbn1cblxuZXhwb3J0IGNvbnN0IHNhbml0aXplID0ge1xuXHRsYWIsXG5cdHBlcmNlbnRpbGUsXG5cdHJhZGlhbCxcblx0cmdiXG59O1xuXG4vLyAqKioqKioqKiBTRUNUSU9OIDUuMSAtIFZhbGlkYXRlICoqKioqKioqKlxuXG5mdW5jdGlvbiBjb2xvclZhbHVlcyhjb2xvcjogQ29sb3IgfCBTTCB8IFNWKTogYm9vbGVhbiB7XG5cdGNvbnN0IGNsb25lZENvbG9yID0gY2xvbmUoY29sb3IpO1xuXHRjb25zdCBpc051bWVyaWNWYWxpZCA9ICh2YWx1ZTogdW5rbm93bik6IGJvb2xlYW4gPT5cblx0XHR0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSk7XG5cdGNvbnN0IG5vcm1hbGl6ZVBlcmNlbnRhZ2UgPSAodmFsdWU6IHN0cmluZyB8IG51bWJlcik6IG51bWJlciA9PiB7XG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuZW5kc1dpdGgoJyUnKSkge1xuXHRcdFx0cmV0dXJuIHBhcnNlRmxvYXQodmFsdWUuc2xpY2UoMCwgLTEpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IHZhbHVlIDogTmFOO1xuXHR9O1xuXG5cdHN3aXRjaCAoY2xvbmVkQ29sb3IuZm9ybWF0KSB7XG5cdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuY3lhbixcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5tYWdlbnRhLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnllbGxvdyxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5rZXlcblx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuY3lhbiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmN5YW4gPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLm1hZ2VudGEgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5tYWdlbnRhIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55ZWxsb3cgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55ZWxsb3cgPD0gMTAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmtleSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmtleSA8PSAxMDBcblx0XHRcdCk7XG5cdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdHJldHVybiAvXiNbMC05QS1GYS1mXXs2fSQvLnRlc3QoY2xvbmVkQ29sb3IudmFsdWUuaGV4KTtcblx0XHRjYXNlICdoc2wnOlxuXHRcdFx0Y29uc3QgaXNWYWxpZEhTTEh1ZSA9XG5cdFx0XHRcdGlzTnVtZXJpY1ZhbGlkKGNsb25lZENvbG9yLnZhbHVlLmh1ZSkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlIDw9IDM2MDtcblx0XHRcdGNvbnN0IGlzVmFsaWRIU0xTYXR1cmF0aW9uID1cblx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uKSA+PSAwICYmXG5cdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbikgPD0gMTAwO1xuXHRcdFx0Y29uc3QgaXNWYWxpZEhTTExpZ2h0bmVzcyA9IGNsb25lZENvbG9yLnZhbHVlLmxpZ2h0bmVzc1xuXHRcdFx0XHQ/IG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzKSA+PSAwICYmXG5cdFx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MpIDw9IDEwMFxuXHRcdFx0XHQ6IHRydWU7XG5cblx0XHRcdHJldHVybiBpc1ZhbGlkSFNMSHVlICYmIGlzVmFsaWRIU0xTYXR1cmF0aW9uICYmIGlzVmFsaWRIU0xMaWdodG5lc3M7XG5cdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdGNvbnN0IGlzVmFsaWRIU1ZIdWUgPVxuXHRcdFx0XHRpc051bWVyaWNWYWxpZChjbG9uZWRDb2xvci52YWx1ZS5odWUpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmh1ZSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmh1ZSA8PSAzNjA7XG5cdFx0XHRjb25zdCBpc1ZhbGlkSFNWU2F0dXJhdGlvbiA9XG5cdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbikgPj0gMCAmJlxuXHRcdFx0XHRub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24pIDw9IDEwMDtcblx0XHRcdGNvbnN0IGlzVmFsaWRIU1ZWYWx1ZSA9IGNsb25lZENvbG9yLnZhbHVlLnZhbHVlXG5cdFx0XHRcdD8gbm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSkgPj0gMCAmJlxuXHRcdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUudmFsdWUpIDw9IDEwMFxuXHRcdFx0XHQ6IHRydWU7XG5cblx0XHRcdHJldHVybiBpc1ZhbGlkSFNWSHVlICYmIGlzVmFsaWRIU1ZTYXR1cmF0aW9uICYmIGlzVmFsaWRIU1ZWYWx1ZTtcblx0XHRjYXNlICdsYWInOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0W1xuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmwsXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYSxcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5iXG5cdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmwgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5sIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5hID49IC0xMjUgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYSA8PSAxMjUgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYiA+PSAtMTI1ICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmIgPD0gMTI1XG5cdFx0XHQpO1xuXHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRbXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUucmVkLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmdyZWVuLFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmJsdWVcblx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUucmVkID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUucmVkIDw9IDI1NSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ncmVlbiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmdyZWVuIDw9IDI1NSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ibHVlID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYmx1ZSA8PSAyNTVcblx0XHRcdCk7XG5cdFx0Y2FzZSAnc2wnOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0W1xuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24sXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzXG5cdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24gPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uIDw9IDEwMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MgPD0gMTAwXG5cdFx0XHQpO1xuXHRcdGNhc2UgJ3N2Jzpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFtjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uLCBjbG9uZWRDb2xvci52YWx1ZS52YWx1ZV0uZXZlcnkoXG5cdFx0XHRcdFx0aXNOdW1lcmljVmFsaWRcblx0XHRcdFx0KSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbiA8PSAxMDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUudmFsdWUgPj0gMCAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSA8PSAxMDBcblx0XHRcdCk7XG5cdFx0Y2FzZSAneHl6Jzpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFtcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS54LFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnksXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuelxuXHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS54ID49IDAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueCA8PSA5NS4wNDcgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueSA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnkgPD0gMTAwLjAgJiZcblx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueiA+PSAwICYmXG5cdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnogPD0gMTA4Ljg4M1xuXHRcdFx0KTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0Y29uc29sZS5lcnJvcihgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yLmZvcm1hdH1gKTtcblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleCh2YWx1ZTogc3RyaW5nLCBwYXR0ZXJuOiBSZWdFeHApOiBib29sZWFuIHtcblx0cmV0dXJuIHBhdHRlcm4udGVzdCh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGhleENvbXBvbmVudCh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdHJldHVybiBoZXgodmFsdWUsIC9eW0EtRmEtZjAtOV17Mn0kLyk7XG59XG5cbmZ1bmN0aW9uIGhleFNldCh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdHJldHVybiAvXiNbMC05YS1mQS1GXXs2fSQvLnRlc3QodmFsdWUpO1xufVxuXG5mdW5jdGlvbiByYW5nZTxUIGV4dGVuZHMga2V5b2YgdHlwZW9mIF9zZXRzPihcblx0dmFsdWU6IG51bWJlciB8IHN0cmluZyxcblx0cmFuZ2VLZXk6IFRcbik6IHZvaWQge1xuXHRpZiAoIWlzSW5SYW5nZSh2YWx1ZSwgcmFuZ2VLZXkpKSB7XG5cdFx0aWYgKHJhbmdlS2V5ID09PSAnSGV4U2V0Jykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHZhbHVlIGZvciAke1N0cmluZyhyYW5nZUtleSl9OiAke3ZhbHVlfWApO1xuXHRcdH1cblxuXHRcdGNvbnN0IFttaW4sIG1heF0gPSBfc2V0c1tyYW5nZUtleV0gYXMgW251bWJlciwgbnVtYmVyXTtcblxuXHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdGBWYWx1ZSAke3ZhbHVlfSBpcyBvdXQgb2YgcmFuZ2UgZm9yICR7U3RyaW5nKHJhbmdlS2V5KX0gWyR7bWlufSwgJHttYXh9XWBcblx0XHQpO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZTogQ29tbW9uRm5fTWFzdGVySW50ZXJmYWNlWydjb3JlJ11bJ3ZhbGlkYXRlJ10gPSB7XG5cdGNvbG9yVmFsdWVzLFxuXHRoZXgsXG5cdGhleENvbXBvbmVudCxcblx0aGV4U2V0LFxuXHRyYW5nZVxufTtcblxuLy8gKioqKioqKiogU0VDVElPTiA2IC0gT3RoZXIgKioqKioqKipcblxuZnVuY3Rpb24gZ2V0Rm9ybWF0dGVkVGltZXN0YW1wKCk6IHN0cmluZyB7XG5cdGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG5cdGNvbnN0IHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcblx0Y29uc3QgbW9udGggPSBTdHJpbmcobm93LmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpO1xuXHRjb25zdCBkYXkgPSBTdHJpbmcobm93LmdldERhdGUoKSkucGFkU3RhcnQoMiwgJzAnKTtcblx0Y29uc3QgaG91cnMgPSBTdHJpbmcobm93LmdldEhvdXJzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG5cdGNvbnN0IG1pbnV0ZXMgPSBTdHJpbmcobm93LmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwgJzAnKTtcblx0Y29uc3Qgc2Vjb25kcyA9IFN0cmluZyhub3cuZ2V0U2Vjb25kcygpKS5wYWRTdGFydCgyLCAnMCcpO1xuXG5cdHJldHVybiBgJHt5ZWFyfS0ke21vbnRofS0ke2RheX0gJHtob3Vyc306JHttaW51dGVzfToke3NlY29uZHN9YDtcbn1cblxuZXhwb3J0IGNvbnN0IG90aGVyID0geyBnZXRGb3JtYXR0ZWRUaW1lc3RhbXAgfTtcblxuZXhwb3J0IHsgY2xvbmUgfTtcblxuLy8gKioqKioqKiogU0VDVElPTiA3IC0gRmluYWwgRXhwb3J0ICoqKioqKioqXG5cbmV4cG9ydCBjb25zdCBjb3JlVXRpbHM6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnY29yZSddID0ge1xuXHRiYXNlLFxuXHRicmFuZCxcblx0YnJhbmRDb2xvcixcblx0Y29udmVydCxcblx0Z3VhcmRzLFxuXHQuLi5vdGhlcixcblx0c2FuaXRpemUsXG5cdHZhbGlkYXRlXG59IGFzIGNvbnN0O1xuIl19