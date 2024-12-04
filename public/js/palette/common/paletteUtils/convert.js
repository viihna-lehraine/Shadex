// File: src/palette/common/paletteUtils/convert.ts
import { core, helpers, utils } from '../../../common';
import { config } from '../../../config';
const defaults = config.defaults;
const mode = config.mode;
const defaultCMYK = defaults.colors.cmyk;
const defaultHex = defaults.colors.hex;
const defaultHSL = defaults.colors.hsl;
const defaultHSV = defaults.colors.hsv;
const defaultLAB = defaults.colors.lab;
const defaultRGB = defaults.colors.rgb;
const defaultSL = defaults.colors.sl;
const defaultSV = defaults.colors.sv;
const defaultXYZ = defaults.colors.xyz;
const applyGammaCorrection = helpers.conversion.applyGammaCorrection;
const clampRGB = helpers.conversion.clampRGB;
const componentToHex = utils.color.componentToHex;
const hueToRGB = helpers.conversion.hueToRGB;
const stripHashFromHex = utils.color.stripHashFromHex;
function cmykToHSL(cmyk) {
    try {
        if (!core.validateColorValues(cmyk)) {
            if (mode.logErrors)
                console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);
            return core.clone(defaultHSL);
        }
        return rgbToHSL(cmykToRGB(core.clone(cmyk)));
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`cmykToHSL() error: ${error}`);
        return core.clone(defaultHSL);
    }
}
function cmykToRGB(cmyk) {
    try {
        if (!core.validateColorValues(cmyk)) {
            if (mode.logErrors)
                console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);
            return core.clone(defaultRGB);
        }
        const clonedCMYK = core.clone(cmyk);
        const r = 255 *
            (1 - clonedCMYK.value.cyan / 100) *
            (1 - clonedCMYK.value.key / 100);
        const g = 255 *
            (1 - clonedCMYK.value.magenta / 100) *
            (1 - clonedCMYK.value.key / 100);
        const b = 255 *
            (1 - clonedCMYK.value.yellow / 100) *
            (1 - clonedCMYK.value.key / 100);
        const alpha = cmyk.value.alpha;
        const rgb = {
            value: { red: r, green: g, blue: b, alpha },
            format: 'rgb'
        };
        return clampRGB(rgb);
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`cmykToRGB error: ${error}`);
        return core.clone(defaultRGB);
    }
}
function hexToHSL(hex) {
    try {
        if (!core.validateColorValues(hex)) {
            if (mode.logErrors)
                console.error(`Invalid Hex value ${JSON.stringify(hex)}`);
            return core.clone(defaultHSL);
        }
        return rgbToHSL(hexToRGB(core.clone(hex)));
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`hexToHSL() error: ${error}`);
        return core.clone(defaultHSL);
    }
}
function hexToHSLWrapper(input) {
    try {
        const clonedInput = core.clone(input);
        const hex = typeof clonedInput === 'string'
            ? {
                value: {
                    hex: clonedInput,
                    alpha: clonedInput.slice(-2),
                    numAlpha: core.hexAlphaToNumericAlpha(clonedInput.slice(-2))
                },
                format: 'hex'
            }
            : {
                ...clonedInput,
                value: {
                    ...clonedInput.value,
                    numAlpha: core.hexAlphaToNumericAlpha(clonedInput.value.alpha)
                }
            };
        return hexToHSL(hex);
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`Error converting hex to HSL: ${error}`);
        return defaultHSL;
    }
}
function hexToRGB(hex) {
    try {
        if (!core.validateColorValues(hex)) {
            if (mode.logErrors)
                console.error(`Invalid Hex value ${JSON.stringify(hex)}`);
            return core.clone(defaultRGB);
        }
        const clonedHex = core.clone(hex);
        const strippedHex = stripHashFromHex(clonedHex).value.hex;
        const bigint = parseInt(strippedHex, 16);
        return {
            value: {
                red: (bigint >> 16) & 255,
                green: (bigint >> 8) & 255,
                blue: bigint & 255,
                alpha: hex.value.numAlpha
            },
            format: 'rgb'
        };
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`hexToRGB error: ${error}`);
        return core.clone(defaultRGB);
    }
}
function hslToCMYK(hsl) {
    try {
        if (!core.validateColorValues(hsl)) {
            if (mode.logErrors)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaultCMYK);
        }
        return rgbToCMYK(hslToRGB(core.clone(hsl)));
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`);
        return core.clone(defaultCMYK);
    }
}
function hslToHex(hsl) {
    try {
        if (!core.validateColorValues(hsl)) {
            if (mode.logErrors)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaultHex);
        }
        return rgbToHex(hslToRGB(core.clone(hsl)));
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`hslToHex error: ${error}`);
        return core.clone(defaultHex);
    }
}
function hslToHSV(hsl) {
    try {
        if (!core.validateColorValues(hsl)) {
            if (mode.logErrors)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaultHSV);
        }
        const clonedHSL = core.clone(hsl);
        const s = clonedHSL.value.saturation / 100;
        const l = clonedHSL.value.lightness / 100;
        const value = l + s * Math.min(l, 1 - 1);
        const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);
        return {
            value: {
                hue: Math.round(clonedHSL.value.hue),
                saturation: Math.round(newSaturation * 100),
                value: Math.round(value * 100),
                alpha: hsl.value.alpha
            },
            format: 'hsv'
        };
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`hslToHSV() error: ${error}`);
        return core.clone(defaultHSV);
    }
}
function hslToLAB(hsl) {
    try {
        if (!core.validateColorValues(hsl)) {
            if (mode.logErrors)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaultLAB);
        }
        return xyzToLAB(rgbToXYZ(hslToRGB(core.clone(hsl))));
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`hslToLab() error: ${error}`);
        return core.clone(defaultLAB);
    }
}
function hslToRGB(hsl) {
    try {
        if (!core.validateColorValues(hsl)) {
            if (mode.logErrors)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaultRGB);
        }
        const clonedHSL = core.clone(hsl);
        const s = clonedHSL.value.saturation / 100;
        const l = clonedHSL.value.lightness / 100;
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        return {
            value: {
                red: Math.round(hueToRGB(p, q, clonedHSL.value.hue + 1 / 3) * 255),
                green: Math.round(hueToRGB(p, q, clonedHSL.value.hue) * 255),
                blue: Math.round(hueToRGB(p, q, clonedHSL.value.hue - 1 / 3) * 255),
                alpha: hsl.value.alpha
            },
            format: 'rgb'
        };
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`hslToRGB error: ${error}`);
        return core.clone(defaultRGB);
    }
}
function hslToSL(hsl) {
    try {
        if (!core.validateColorValues(hsl)) {
            if (mode.logErrors)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaultSL);
        }
        return {
            value: {
                saturation: hsl.value.saturation,
                lightness: hsl.value.lightness,
                alpha: hsl.value.alpha
            },
            format: 'sl'
        };
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`Error converting HSL to SL: ${error}`);
        return defaultSL;
    }
}
function hslToSV(hsl) {
    try {
        if (!core.validateColorValues(hsl)) {
            if (mode.logErrors)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaultSV);
        }
        return hsvToSV(rgbToHSV(hslToRGB(core.clone(hsl))));
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`Error converting HSL to SV: ${error}`);
        return defaultSV;
    }
}
function hslToXYZ(hsl) {
    try {
        if (!core.validateColorValues(hsl)) {
            if (mode.logErrors)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaultXYZ);
        }
        return labToXYZ(hslToLAB(core.clone(hsl)));
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`hslToXYZ error: ${error}`);
        return core.clone(defaultXYZ);
    }
}
function hsvToHSL(hsv) {
    try {
        if (!core.validateColorValues(hsv)) {
            if (mode.logErrors)
                console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);
            return core.clone(defaultHSL);
        }
        const clonedHSV = core.clone(hsv);
        const newSaturation = clonedHSV.value.value * (1 - clonedHSV.value.saturation / 100) ===
            0 || clonedHSV.value.value === 0
            ? 0
            : (clonedHSV.value.value -
                clonedHSV.value.value *
                    (1 - clonedHSV.value.saturation / 100)) /
                Math.min(clonedHSV.value.value, 100 - clonedHSV.value.value);
        const lightness = clonedHSV.value.value * (1 - clonedHSV.value.saturation / 200);
        return {
            value: {
                hue: Math.round(clonedHSV.value.hue),
                saturation: Math.round(newSaturation * 100),
                lightness: Math.round(lightness),
                alpha: hsv.value.alpha
            },
            format: 'hsl'
        };
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`hsvToHSL() error: ${error}`);
        return core.clone(defaultHSL);
    }
}
function hsvToSV(hsv) {
    try {
        if (!core.validateColorValues(hsv)) {
            if (mode.logErrors)
                console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);
            return core.clone(defaultSV);
        }
        return {
            value: {
                saturation: hsv.value.saturation,
                value: hsv.value.value,
                alpha: hsv.value.alpha
            },
            format: 'sv'
        };
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`Error converting HSV to SV: ${error}`);
        return defaultSV;
    }
}
function labToHSL(lab) {
    try {
        if (!core.validateColorValues(lab)) {
            if (mode.logErrors)
                console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaultHSL);
        }
        return rgbToHSL(labToRGB(core.clone(lab)));
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`labToHSL() error: ${error}`);
        return core.clone(defaultHSL);
    }
}
function labToRGB(lab) {
    try {
        if (!core.validateColorValues(lab)) {
            if (mode.logErrors)
                console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaultRGB);
        }
        return xyzToRGB(labToXYZ(core.clone(lab)));
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`labToRGB error: ${error}`);
        return core.clone(defaultRGB);
    }
}
function labToXYZ(lab) {
    try {
        if (!core.validateColorValues(lab)) {
            if (mode.logErrors)
                console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaultXYZ);
        }
        const clonedLAB = core.clone(lab);
        const refX = 95.047, refY = 100.0, refZ = 108.883;
        let y = (clonedLAB.value.l + 16) / 116;
        let x = clonedLAB.value.a / 500 + y;
        let z = y - clonedLAB.value.b / 200;
        const pow = Math.pow;
        return {
            value: {
                x: refX *
                    (pow(x, 3) > 0.008856 ? pow(x, 3) : (x - 16 / 116) / 7.787),
                y: refY *
                    (pow(y, 3) > 0.008856 ? pow(y, 3) : (y - 16 / 116) / 7.787),
                z: refZ *
                    (pow(z, 3) > 0.008856 ? pow(z, 3) : (z - 16 / 116) / 7.787),
                alpha: lab.value.alpha
            },
            format: 'xyz'
        };
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`labToXYZ error: ${error}`);
        return core.clone(defaultXYZ);
    }
}
function rgbToCMYK(rgb) {
    try {
        if (!core.validateColorValues(rgb)) {
            if (mode.logErrors)
                console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaultCMYK);
        }
        const clonedRGB = core.clone(rgb);
        const redPrime = clonedRGB.value.red / 255;
        const greenPrime = clonedRGB.value.green / 255;
        const bluePrime = clonedRGB.value.blue / 255;
        const key = core.sanitizePercentage(1 - Math.max(redPrime, greenPrime, bluePrime));
        const cyan = core.sanitizePercentage((1 - redPrime - key) / (1 - key) || 0);
        const magenta = core.sanitizePercentage((1 - greenPrime - key) / (1 - key) || 0);
        const yellow = core.sanitizePercentage((1 - bluePrime - key) / (1 - key) || 0);
        const alpha = rgb.value.alpha;
        const format = 'cmyk';
        const cmyk = { value: { cyan, magenta, yellow, key, alpha }, format };
        if (!mode.quiet)
            console.log(`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(core.clone(cmyk))}`);
        return cmyk;
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`Error converting RGB to CMYK: ${error}`);
        return core.clone(defaultCMYK);
    }
}
function rgbToHex(rgb) {
    try {
        if (!core.validateColorValues(rgb)) {
            if (mode.logErrors)
                console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaultHex);
        }
        const clonedRGB = core.clone(rgb);
        if ([
            clonedRGB.value.red,
            clonedRGB.value.green,
            clonedRGB.value.blue
        ].some(v => isNaN(v) || v < 0 || v > 255) ||
            [clonedRGB.value.alpha].some(v => isNaN(v) || v < 0 || v > 1)) {
            if (mode.logWarnings)
                console.warn(`Invalid RGB values: \nR=${JSON.stringify(clonedRGB.value.red)}\nG=${JSON.stringify(clonedRGB.value.green)}\nB=${JSON.stringify(clonedRGB.value.blue)}\nA=${JSON.stringify(clonedRGB.value.alpha)}`);
            return {
                value: {
                    hex: '#000000FF',
                    alpha: 'FF',
                    numAlpha: 1
                },
                format: 'hex'
            };
        }
        return {
            value: {
                hex: `#${componentToHex(clonedRGB.value.red)}${componentToHex(clonedRGB.value.green)}${componentToHex(clonedRGB.value.blue)}`,
                alpha: componentToHex(clonedRGB.value.alpha),
                numAlpha: clonedRGB.value.alpha
            },
            format: 'hex'
        };
    }
    catch (error) {
        if (mode.logErrors)
            console.warn(`rgbToHex error: ${error}`);
        return core.clone(defaultHex);
    }
}
function rgbToHSL(rgb) {
    try {
        if (!core.validateColorValues(rgb)) {
            if (mode.logErrors)
                console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaultHSL);
        }
        const clonedRGB = core.clone(rgb);
        clonedRGB.value.red /= 255;
        clonedRGB.value.green /= 255;
        clonedRGB.value.blue /= 255;
        const max = Math.max(clonedRGB.value.red, clonedRGB.value.green, clonedRGB.value.blue);
        const min = Math.min(clonedRGB.value.red, clonedRGB.value.green, clonedRGB.value.blue);
        let hue = 0, saturation = 0, lightness = (max + min) / 2;
        if (max !== min) {
            const delta = max - min;
            saturation =
                lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
            switch (max) {
                case clonedRGB.value.red:
                    hue =
                        (clonedRGB.value.green - clonedRGB.value.blue) / delta +
                            (clonedRGB.value.green < clonedRGB.value.blue ? 6 : 0);
                    break;
                case clonedRGB.value.green:
                    hue =
                        (clonedRGB.value.blue - clonedRGB.value.red) / delta +
                            2;
                    break;
                case clonedRGB.value.blue:
                    hue =
                        (clonedRGB.value.red - clonedRGB.value.green) / delta +
                            4;
                    break;
            }
            hue *= 60;
        }
        return {
            value: {
                hue: Math.round(hue),
                saturation: Math.round(saturation * 100),
                lightness: Math.round(lightness * 100),
                alpha: rgb.value.alpha
            },
            format: 'hsl'
        };
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`rgbToHSL() error: ${error}`);
        return core.clone(defaultHSL);
    }
}
function rgbToHSV(rgb) {
    try {
        if (!core.validateColorValues(rgb)) {
            if (mode.logErrors)
                console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaultHSV);
        }
        const clonedRGB = core.clone(rgb);
        clonedRGB.value.red /= 255;
        clonedRGB.value.green /= 255;
        clonedRGB.value.blue /= 255;
        const max = Math.max(clonedRGB.value.red, clonedRGB.value.green, clonedRGB.value.blue);
        const min = Math.min(clonedRGB.value.red, clonedRGB.value.green, clonedRGB.value.blue);
        const delta = max - min;
        let hue = 0;
        const value = max;
        const saturation = max === 0 ? 0 : delta / max;
        if (max !== min) {
            switch (max) {
                case clonedRGB.value.red:
                    hue =
                        (clonedRGB.value.green - clonedRGB.value.blue) / delta +
                            (clonedRGB.value.green < clonedRGB.value.blue ? 6 : 0);
                    break;
                case clonedRGB.value.green:
                    hue =
                        (clonedRGB.value.blue - clonedRGB.value.red) / delta +
                            2;
                    break;
                case clonedRGB.value.blue:
                    hue =
                        (clonedRGB.value.red - clonedRGB.value.green) / delta +
                            4;
                    break;
            }
            hue *= 60;
        }
        return {
            value: {
                hue: Math.round(hue),
                saturation: Math.round(saturation * 100),
                value: Math.round(value * 100),
                alpha: rgb.value.alpha
            },
            format: 'hsv'
        };
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`rgbToHSV() error: ${error}`);
        return core.clone(defaultHSV);
    }
}
function rgbToXYZ(rgb) {
    try {
        if (!core.validateColorValues(rgb)) {
            if (mode.logErrors)
                console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaultXYZ);
        }
        const clonedRGB = core.clone(rgb);
        clonedRGB.value.red = clonedRGB.value.red / 255;
        clonedRGB.value.green = clonedRGB.value.green / 255;
        clonedRGB.value.blue = clonedRGB.value.blue / 255;
        clonedRGB.value.red =
            clonedRGB.value.red > 0.04045
                ? Math.pow((clonedRGB.value.red + 0.055) / 1.055, 2.4)
                : clonedRGB.value.red / 12.92;
        clonedRGB.value.green =
            clonedRGB.value.green > 0.04045
                ? Math.pow((clonedRGB.value.green + 0.055) / 1.055, 2.4)
                : clonedRGB.value.green / 12.92;
        clonedRGB.value.blue =
            clonedRGB.value.blue > 0.04045
                ? Math.pow((clonedRGB.value.blue + 0.055) / 1.055, 2.4)
                : clonedRGB.value.blue / 12.92;
        clonedRGB.value.red = clonedRGB.value.red * 100;
        clonedRGB.value.green = clonedRGB.value.green * 100;
        clonedRGB.value.blue = clonedRGB.value.blue * 100;
        return {
            value: {
                x: clonedRGB.value.red * 0.4124 +
                    clonedRGB.value.green * 0.3576 +
                    clonedRGB.value.blue * 0.1805,
                y: clonedRGB.value.red * 0.2126 +
                    clonedRGB.value.green * 0.7152 +
                    clonedRGB.value.blue * 0.0722,
                z: clonedRGB.value.red * 0.0193 +
                    clonedRGB.value.green * 0.1192 +
                    clonedRGB.value.blue * 0.9505,
                alpha: rgb.value.alpha
            },
            format: 'xyz'
        };
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`rgbToXYZ error: ${error}`);
        return core.clone(defaultXYZ);
    }
}
function xyzToLAB(xyz) {
    try {
        if (!core.validateColorValues(xyz)) {
            if (mode.logErrors)
                console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaultLAB);
        }
        const clonedXYZ = core.clone(xyz);
        const refX = 95.047, refY = 100.0, refZ = 108.883;
        clonedXYZ.value.x = clonedXYZ.value.x / refX;
        clonedXYZ.value.y = clonedXYZ.value.y / refY;
        clonedXYZ.value.z = clonedXYZ.value.z / refZ;
        clonedXYZ.value.x =
            clonedXYZ.value.x > 0.008856
                ? Math.pow(clonedXYZ.value.x, 1 / 3)
                : 7.787 * clonedXYZ.value.x + 16 / 116;
        clonedXYZ.value.y =
            clonedXYZ.value.y > 0.008856
                ? Math.pow(clonedXYZ.value.y, 1 / 3)
                : 7.787 * clonedXYZ.value.y + 16 / 116;
        clonedXYZ.value.z =
            clonedXYZ.value.z > 0.008856
                ? Math.pow(clonedXYZ.value.z, 1 / 3)
                : 7.787 * clonedXYZ.value.z + 16 / 116;
        const l = core.sanitizePercentage(parseFloat((116 * clonedXYZ.value.y - 16).toFixed(2)));
        const a = core.sanitizeLAB(parseFloat((500 * (clonedXYZ.value.x - clonedXYZ.value.y)).toFixed(2)));
        const b = core.sanitizeLAB(parseFloat((200 * (clonedXYZ.value.y - clonedXYZ.value.z)).toFixed(2)));
        const lab = {
            value: { l, a, b, alpha: xyz.value.alpha },
            format: 'lab'
        };
        if (!core.validateColorValues(lab)) {
            if (mode.logErrors)
                console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaultLAB);
        }
        return lab;
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`xyzToLab() error: ${error}`);
        return core.clone(defaultLAB);
    }
}
function xyzToHSL(xyz) {
    try {
        if (!core.validateColorValues(xyz)) {
            if (mode.logErrors)
                console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaultHSL);
        }
        return rgbToHSL(xyzToRGB(core.clone(xyz)));
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`xyzToHSL() error: ${error}`);
        return core.clone(defaultHSL);
    }
}
function xyzToRGB(xyz) {
    try {
        if (!core.validateColorValues(xyz)) {
            if (mode.logErrors)
                console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaultRGB);
        }
        const clonedXYZ = core.clone(xyz);
        clonedXYZ.value.x /= 100;
        clonedXYZ.value.y /= 100;
        clonedXYZ.value.z /= 100;
        let red = clonedXYZ.value.x * 3.2406 +
            clonedXYZ.value.y * -1.5372 +
            clonedXYZ.value.z * -0.4986;
        let green = clonedXYZ.value.x * -0.9689 +
            clonedXYZ.value.y * 1.8758 +
            clonedXYZ.value.z * 0.0415;
        let blue = clonedXYZ.value.x * 0.0557 +
            clonedXYZ.value.y * -0.204 +
            clonedXYZ.value.z * 1.057;
        red = applyGammaCorrection(red);
        green = applyGammaCorrection(green);
        blue = applyGammaCorrection(blue);
        return clampRGB({
            value: { red, green, blue, alpha: xyz.value.alpha },
            format: 'rgb'
        });
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`xyzToRGB error: ${error}`);
        return core.clone(defaultRGB);
    }
}
// ******** BUNDLED CONVERSION FUNCTIONS ********
function hslTo(color, colorSpace) {
    try {
        if (!core.validateColorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return core.clone(defaultRGB);
        }
        const clonedColor = core.clone(color);
        switch (colorSpace) {
            case 'cmyk':
                return hslToCMYK(clonedColor);
            case 'hex':
                return hslToHex(clonedColor);
            case 'hsl':
                return core.clone(clonedColor);
            case 'hsv':
                return hslToHSV(clonedColor);
            case 'lab':
                return hslToLAB(clonedColor);
            case 'rgb':
                return hslToRGB(clonedColor);
            case 'sl':
                return hslToSL(clonedColor);
            case 'sv':
                return hslToSV(clonedColor);
            case 'xyz':
                return hslToXYZ(clonedColor);
            default:
                throw new Error('Invalid color format');
        }
    }
    catch (error) {
        throw new Error(`hslTo() error: ${error}`);
    }
}
function toHSL(color) {
    try {
        if (!core.validateColorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return core.clone(defaultHSL);
        }
        const clonedColor = core.clone(color);
        switch (color.format) {
            case 'cmyk':
                return cmykToHSL(clonedColor);
            case 'hex':
                return hexToHSL(clonedColor);
            case 'hsl':
                return core.clone(clonedColor);
            case 'hsv':
                return hsvToHSL(clonedColor);
            case 'lab':
                return labToHSL(clonedColor);
            case 'rgb':
                return rgbToHSL(clonedColor);
            case 'xyz':
                return xyzToHSL(clonedColor);
            default:
                throw new Error('Invalid color format');
        }
    }
    catch (error) {
        throw new Error(`toHSL() error: ${error}`);
    }
}
export const convert = {
    hslTo,
    toHSL,
    wrappers: {
        hexToHSL: hexToHSLWrapper
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9wYWxldHRlL2NvbW1vbi9wYWxldHRlVXRpbHMvY29udmVydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxtREFBbUQ7QUFlbkQsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdkQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXpDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDakMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUV6QixNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN6QyxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUN2QyxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUN2QyxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUN2QyxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUN2QyxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUN2QyxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztBQUNyQyxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztBQUNyQyxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUV2QyxNQUFNLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUM7QUFDckUsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxR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UUFBUSxFQUFFO1FBQ1QsUUFBUSxFQUFFLGVBQWU7S0FDekI7Q0FDRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL3BhbGV0dGUvY29tbW9uL3BhbGV0dGVVdGlscy9jb252ZXJ0LnRzXG5cbmltcG9ydCB7XG5cdENNWUssXG5cdENvbG9yLFxuXHRDb2xvclNwYWNlRXh0ZW5kZWQsXG5cdEhleCxcblx0SFNMLFxuXHRIU1YsXG5cdExBQixcblx0UkdCLFxuXHRTTCxcblx0U1YsXG5cdFhZWlxufSBmcm9tICcuLi8uLi8uLi9pbmRleC9pbmRleCc7XG5pbXBvcnQgeyBjb3JlLCBoZWxwZXJzLCB1dGlscyB9IGZyb20gJy4uLy4uLy4uL2NvbW1vbic7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuLi8uLi8uLi9jb25maWcnO1xuXG5jb25zdCBkZWZhdWx0cyA9IGNvbmZpZy5kZWZhdWx0cztcbmNvbnN0IG1vZGUgPSBjb25maWcubW9kZTtcblxuY29uc3QgZGVmYXVsdENNWUsgPSBkZWZhdWx0cy5jb2xvcnMuY215aztcbmNvbnN0IGRlZmF1bHRIZXggPSBkZWZhdWx0cy5jb2xvcnMuaGV4O1xuY29uc3QgZGVmYXVsdEhTTCA9IGRlZmF1bHRzLmNvbG9ycy5oc2w7XG5jb25zdCBkZWZhdWx0SFNWID0gZGVmYXVsdHMuY29sb3JzLmhzdjtcbmNvbnN0IGRlZmF1bHRMQUIgPSBkZWZhdWx0cy5jb2xvcnMubGFiO1xuY29uc3QgZGVmYXVsdFJHQiA9IGRlZmF1bHRzLmNvbG9ycy5yZ2I7XG5jb25zdCBkZWZhdWx0U0wgPSBkZWZhdWx0cy5jb2xvcnMuc2w7XG5jb25zdCBkZWZhdWx0U1YgPSBkZWZhdWx0cy5jb2xvcnMuc3Y7XG5jb25zdCBkZWZhdWx0WFlaID0gZGVmYXVsdHMuY29sb3JzLnh5ejtcblxuY29uc3QgYXBwbHlHYW1tYUNvcnJlY3Rpb24gPSBoZWxwZXJzLmNvbnZlcnNpb24uYXBwbHlHYW1tYUNvcnJlY3Rpb247XG5jb25zdCBjbGFtcFJHQiA9IGhlbHBlcnMuY29udmVyc2lvbi5jbGFtcFJHQjtcbmNvbnN0IGNvbXBvbmVudFRvSGV4ID0gdXRpbHMuY29sb3IuY29tcG9uZW50VG9IZXg7XG5jb25zdCBodWVUb1JHQiA9IGhlbHBlcnMuY29udmVyc2lvbi5odWVUb1JHQjtcbmNvbnN0IHN0cmlwSGFzaEZyb21IZXggPSB1dGlscy5jb2xvci5zdHJpcEhhc2hGcm9tSGV4O1xuXG5mdW5jdGlvbiBjbXlrVG9IU0woY215azogQ01ZSyk6IEhTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoY215aykpIHtcblx0XHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBDTVlLIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY215ayl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRIU0wpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZ2JUb0hTTChjbXlrVG9SR0IoY29yZS5jbG9uZShjbXlrKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmxvZ0Vycm9ycykgY29uc29sZS5lcnJvcihgY215a1RvSFNMKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0SFNMKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjbXlrVG9SR0IoY215azogQ01ZSyk6IFJHQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoY215aykpIHtcblx0XHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBDTVlLIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY215ayl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRSR0IpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZENNWUsgPSBjb3JlLmNsb25lKGNteWspO1xuXHRcdGNvbnN0IHIgPVxuXHRcdFx0MjU1ICpcblx0XHRcdCgxIC0gY2xvbmVkQ01ZSy52YWx1ZS5jeWFuIC8gMTAwKSAqXG5cdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUua2V5IC8gMTAwKTtcblx0XHRjb25zdCBnID1cblx0XHRcdDI1NSAqXG5cdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUubWFnZW50YSAvIDEwMCkgKlxuXHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLmtleSAvIDEwMCk7XG5cdFx0Y29uc3QgYiA9XG5cdFx0XHQyNTUgKlxuXHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLnllbGxvdyAvIDEwMCkgKlxuXHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLmtleSAvIDEwMCk7XG5cdFx0Y29uc3QgYWxwaGEgPSBjbXlrLnZhbHVlLmFscGhhO1xuXHRcdGNvbnN0IHJnYjogUkdCID0ge1xuXHRcdFx0dmFsdWU6IHsgcmVkOiByLCBncmVlbjogZywgYmx1ZTogYiwgYWxwaGEgfSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9O1xuXG5cdFx0cmV0dXJuIGNsYW1wUkdCKHJnYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKSBjb25zb2xlLmVycm9yKGBjbXlrVG9SR0IgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0UkdCKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoZXhUb0hTTChoZXg6IEhleCk6IEhTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaGV4KSkge1xuXHRcdFx0aWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhleCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhleCl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRIU0wpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZ2JUb0hTTChoZXhUb1JHQihjb3JlLmNsb25lKGhleCkpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5sb2dFcnJvcnMpIGNvbnNvbGUuZXJyb3IoYGhleFRvSFNMKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0SFNMKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoZXhUb0hTTFdyYXBwZXIoaW5wdXQ6IHN0cmluZyB8IEhleCk6IEhTTCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY2xvbmVkSW5wdXQgPSBjb3JlLmNsb25lKGlucHV0KTtcblx0XHRjb25zdCBoZXg6IEhleCA9XG5cdFx0XHR0eXBlb2YgY2xvbmVkSW5wdXQgPT09ICdzdHJpbmcnXG5cdFx0XHRcdD8ge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0aGV4OiBjbG9uZWRJbnB1dCxcblx0XHRcdFx0XHRcdFx0YWxwaGE6IGNsb25lZElucHV0LnNsaWNlKC0yKSxcblx0XHRcdFx0XHRcdFx0bnVtQWxwaGE6IGNvcmUuaGV4QWxwaGFUb051bWVyaWNBbHBoYShcblx0XHRcdFx0XHRcdFx0XHRjbG9uZWRJbnB1dC5zbGljZSgtMilcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdDoge1xuXHRcdFx0XHRcdFx0Li4uY2xvbmVkSW5wdXQsXG5cdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHQuLi5jbG9uZWRJbnB1dC52YWx1ZSxcblx0XHRcdFx0XHRcdFx0bnVtQWxwaGE6IGNvcmUuaGV4QWxwaGFUb051bWVyaWNBbHBoYShcblx0XHRcdFx0XHRcdFx0XHRjbG9uZWRJbnB1dC52YWx1ZS5hbHBoYVxuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblxuXHRcdHJldHVybiBoZXhUb0hTTChoZXgpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgaGV4IHRvIEhTTDogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0SFNMO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleFRvUkdCKGhleDogSGV4KTogUkdCIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvcmUudmFsaWRhdGVDb2xvclZhbHVlcyhoZXgpKSB7XG5cdFx0XHRpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSGV4IHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaGV4KX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdFJHQik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkSGV4ID0gY29yZS5jbG9uZShoZXgpO1xuXHRcdGNvbnN0IHN0cmlwcGVkSGV4ID0gc3RyaXBIYXNoRnJvbUhleChjbG9uZWRIZXgpLnZhbHVlLmhleDtcblx0XHRjb25zdCBiaWdpbnQgPSBwYXJzZUludChzdHJpcHBlZEhleCwgMTYpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHJlZDogKGJpZ2ludCA+PiAxNikgJiAyNTUsXG5cdFx0XHRcdGdyZWVuOiAoYmlnaW50ID4+IDgpICYgMjU1LFxuXHRcdFx0XHRibHVlOiBiaWdpbnQgJiAyNTUsXG5cdFx0XHRcdGFscGhhOiBoZXgudmFsdWUubnVtQWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5sb2dFcnJvcnMpIGNvbnNvbGUuZXJyb3IoYGhleFRvUkdCIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdFJHQik7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9DTVlLKGhzbDogSFNMKTogQ01ZSyB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0aWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRDTVlLKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9DTVlLKGhzbFRvUkdCKGNvcmUuY2xvbmUoaHNsKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdGBFcnJvciBjb252ZXJ0aW5nIEhTTCAke0pTT04uc3RyaW5naWZ5KGhzbCl9IHRvIENNWUs6ICR7ZXJyb3J9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRDTVlLKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb0hleChoc2w6IEhTTCk6IEhleCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0aWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRIZXgpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZ2JUb0hleChoc2xUb1JHQihjb3JlLmNsb25lKGhzbCkpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5sb2dFcnJvcnMpIGNvbnNvbGUuZXJyb3IoYGhzbFRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdEhleCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9IU1YoaHNsOiBIU0wpOiBIU1Yge1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0SFNWKTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRIU0wgPSBjb3JlLmNsb25lKGhzbCk7XG5cdFx0Y29uc3QgcyA9IGNsb25lZEhTTC52YWx1ZS5zYXR1cmF0aW9uIC8gMTAwO1xuXHRcdGNvbnN0IGwgPSBjbG9uZWRIU0wudmFsdWUubGlnaHRuZXNzIC8gMTAwO1xuXHRcdGNvbnN0IHZhbHVlID0gbCArIHMgKiBNYXRoLm1pbihsLCAxIC0gMSk7XG5cdFx0Y29uc3QgbmV3U2F0dXJhdGlvbiA9IHZhbHVlID09PSAwID8gMCA6IDIgKiAoMSAtIGwgLyB2YWx1ZSk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBNYXRoLnJvdW5kKGNsb25lZEhTTC52YWx1ZS5odWUpLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBNYXRoLnJvdW5kKG5ld1NhdHVyYXRpb24gKiAxMDApLFxuXHRcdFx0XHR2YWx1ZTogTWF0aC5yb3VuZCh2YWx1ZSAqIDEwMCksXG5cdFx0XHRcdGFscGhhOiBoc2wudmFsdWUuYWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5sb2dFcnJvcnMpIGNvbnNvbGUuZXJyb3IoYGhzbFRvSFNWKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0SFNWKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb0xBQihoc2w6IEhTTCk6IExBQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0aWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRMQUIpO1xuXHRcdH1cblxuXHRcdHJldHVybiB4eXpUb0xBQihyZ2JUb1hZWihoc2xUb1JHQihjb3JlLmNsb25lKGhzbCkpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKSBjb25zb2xlLmVycm9yKGBoc2xUb0xhYigpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdExBQik7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9SR0IoaHNsOiBIU0wpOiBSR0Ige1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0UkdCKTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRIU0wgPSBjb3JlLmNsb25lKGhzbCk7XG5cdFx0Y29uc3QgcyA9IGNsb25lZEhTTC52YWx1ZS5zYXR1cmF0aW9uIC8gMTAwO1xuXHRcdGNvbnN0IGwgPSBjbG9uZWRIU0wudmFsdWUubGlnaHRuZXNzIC8gMTAwO1xuXHRcdGNvbnN0IHEgPSBsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzO1xuXHRcdGNvbnN0IHAgPSAyICogbCAtIHE7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0cmVkOiBNYXRoLnJvdW5kKFxuXHRcdFx0XHRcdGh1ZVRvUkdCKHAsIHEsIGNsb25lZEhTTC52YWx1ZS5odWUgKyAxIC8gMykgKiAyNTVcblx0XHRcdFx0KSxcblx0XHRcdFx0Z3JlZW46IE1hdGgucm91bmQoaHVlVG9SR0IocCwgcSwgY2xvbmVkSFNMLnZhbHVlLmh1ZSkgKiAyNTUpLFxuXHRcdFx0XHRibHVlOiBNYXRoLnJvdW5kKFxuXHRcdFx0XHRcdGh1ZVRvUkdCKHAsIHEsIGNsb25lZEhTTC52YWx1ZS5odWUgLSAxIC8gMykgKiAyNTVcblx0XHRcdFx0KSxcblx0XHRcdFx0YWxwaGE6IGhzbC52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmxvZ0Vycm9ycykgY29uc29sZS5lcnJvcihgaHNsVG9SR0IgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0UkdCKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb1NMKGhzbDogSFNMKTogU0wge1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0U0wpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRzYXR1cmF0aW9uOiBoc2wudmFsdWUuc2F0dXJhdGlvbixcblx0XHRcdFx0bGlnaHRuZXNzOiBoc2wudmFsdWUubGlnaHRuZXNzLFxuXHRcdFx0XHRhbHBoYTogaHNsLnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnc2wnIGFzICdzbCdcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgSFNMIHRvIFNMOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRTTDtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb1NWKGhzbDogSFNMKTogU1Yge1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0U1YpO1xuXHRcdH1cblxuXHRcdHJldHVybiBoc3ZUb1NWKHJnYlRvSFNWKGhzbFRvUkdCKGNvcmUuY2xvbmUoaHNsKSkpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIEhTTCB0byBTVjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0U1Y7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9YWVooaHNsOiBIU0wpOiBYWVoge1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0WFlaKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbGFiVG9YWVooaHNsVG9MQUIoY29yZS5jbG9uZShoc2wpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKSBjb25zb2xlLmVycm9yKGBoc2xUb1hZWiBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRYWVopO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzdlRvSFNMKGhzdjogSFNWKTogSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvcmUudmFsaWRhdGVDb2xvclZhbHVlcyhoc3YpKSB7XG5cdFx0XHRpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNWIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHN2KX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdEhTTCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkSFNWID0gY29yZS5jbG9uZShoc3YpO1xuXHRcdGNvbnN0IG5ld1NhdHVyYXRpb24gPVxuXHRcdFx0Y2xvbmVkSFNWLnZhbHVlLnZhbHVlICogKDEgLSBjbG9uZWRIU1YudmFsdWUuc2F0dXJhdGlvbiAvIDEwMCkgPT09XG5cdFx0XHRcdDAgfHwgY2xvbmVkSFNWLnZhbHVlLnZhbHVlID09PSAwXG5cdFx0XHRcdD8gMFxuXHRcdFx0XHQ6IChjbG9uZWRIU1YudmFsdWUudmFsdWUgLVxuXHRcdFx0XHRcdFx0Y2xvbmVkSFNWLnZhbHVlLnZhbHVlICpcblx0XHRcdFx0XHRcdFx0KDEgLSBjbG9uZWRIU1YudmFsdWUuc2F0dXJhdGlvbiAvIDEwMCkpIC9cblx0XHRcdFx0XHRNYXRoLm1pbihcblx0XHRcdFx0XHRcdGNsb25lZEhTVi52YWx1ZS52YWx1ZSxcblx0XHRcdFx0XHRcdDEwMCAtIGNsb25lZEhTVi52YWx1ZS52YWx1ZVxuXHRcdFx0XHRcdCk7XG5cdFx0Y29uc3QgbGlnaHRuZXNzID1cblx0XHRcdGNsb25lZEhTVi52YWx1ZS52YWx1ZSAqICgxIC0gY2xvbmVkSFNWLnZhbHVlLnNhdHVyYXRpb24gLyAyMDApO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogTWF0aC5yb3VuZChjbG9uZWRIU1YudmFsdWUuaHVlKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogTWF0aC5yb3VuZChuZXdTYXR1cmF0aW9uICogMTAwKSxcblx0XHRcdFx0bGlnaHRuZXNzOiBNYXRoLnJvdW5kKGxpZ2h0bmVzcyksXG5cdFx0XHRcdGFscGhhOiBoc3YudmFsdWUuYWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5sb2dFcnJvcnMpIGNvbnNvbGUuZXJyb3IoYGhzdlRvSFNMKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0SFNMKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoc3ZUb1NWKGhzdjogSFNWKTogU1Yge1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKGhzdikpIHtcblx0XHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU1YgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc3YpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0U1YpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRzYXR1cmF0aW9uOiBoc3YudmFsdWUuc2F0dXJhdGlvbixcblx0XHRcdFx0dmFsdWU6IGhzdi52YWx1ZS52YWx1ZSxcblx0XHRcdFx0YWxwaGE6IGhzdi52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3N2JyBhcyAnc3YnXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIEhTViB0byBTVjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0U1Y7XG5cdH1cbn1cblxuZnVuY3Rpb24gbGFiVG9IU0wobGFiOiBMQUIpOiBIU0wge1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKGxhYikpIHtcblx0XHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBMQUIgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShsYWIpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0SFNMKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IU0wobGFiVG9SR0IoY29yZS5jbG9uZShsYWIpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKSBjb25zb2xlLmVycm9yKGBsYWJUb0hTTCgpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdEhTTCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gbGFiVG9SR0IobGFiOiBMQUIpOiBSR0Ige1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKGxhYikpIHtcblx0XHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBMQUIgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShsYWIpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0UkdCKTtcblx0XHR9XG5cblx0XHRyZXR1cm4geHl6VG9SR0IobGFiVG9YWVooY29yZS5jbG9uZShsYWIpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKSBjb25zb2xlLmVycm9yKGBsYWJUb1JHQiBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRSR0IpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGxhYlRvWFlaKGxhYjogTEFCKTogWFlaIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvcmUudmFsaWRhdGVDb2xvclZhbHVlcyhsYWIpKSB7XG5cdFx0XHRpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdFhZWik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkTEFCID0gY29yZS5jbG9uZShsYWIpO1xuXHRcdGNvbnN0IHJlZlggPSA5NS4wNDcsXG5cdFx0XHRyZWZZID0gMTAwLjAsXG5cdFx0XHRyZWZaID0gMTA4Ljg4MztcblxuXHRcdGxldCB5ID0gKGNsb25lZExBQi52YWx1ZS5sICsgMTYpIC8gMTE2O1xuXHRcdGxldCB4ID0gY2xvbmVkTEFCLnZhbHVlLmEgLyA1MDAgKyB5O1xuXHRcdGxldCB6ID0geSAtIGNsb25lZExBQi52YWx1ZS5iIC8gMjAwO1xuXG5cdFx0Y29uc3QgcG93ID0gTWF0aC5wb3c7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0eDpcblx0XHRcdFx0XHRyZWZYICpcblx0XHRcdFx0XHQocG93KHgsIDMpID4gMC4wMDg4NTYgPyBwb3coeCwgMykgOiAoeCAtIDE2IC8gMTE2KSAvIDcuNzg3KSxcblx0XHRcdFx0eTpcblx0XHRcdFx0XHRyZWZZICpcblx0XHRcdFx0XHQocG93KHksIDMpID4gMC4wMDg4NTYgPyBwb3coeSwgMykgOiAoeSAtIDE2IC8gMTE2KSAvIDcuNzg3KSxcblx0XHRcdFx0ejpcblx0XHRcdFx0XHRyZWZaICpcblx0XHRcdFx0XHQocG93KHosIDMpID4gMC4wMDg4NTYgPyBwb3coeiwgMykgOiAoeiAtIDE2IC8gMTE2KSAvIDcuNzg3KSxcblx0XHRcdFx0YWxwaGE6IGxhYi52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmxvZ0Vycm9ycykgY29uc29sZS5lcnJvcihgbGFiVG9YWVogZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0WFlaKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZ2JUb0NNWUsocmdiOiBSR0IpOiBDTVlLIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvcmUudmFsaWRhdGVDb2xvclZhbHVlcyhyZ2IpKSB7XG5cdFx0XHRpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdENNWUspO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZFJHQiA9IGNvcmUuY2xvbmUocmdiKTtcblxuXHRcdGNvbnN0IHJlZFByaW1lID0gY2xvbmVkUkdCLnZhbHVlLnJlZCAvIDI1NTtcblx0XHRjb25zdCBncmVlblByaW1lID0gY2xvbmVkUkdCLnZhbHVlLmdyZWVuIC8gMjU1O1xuXHRcdGNvbnN0IGJsdWVQcmltZSA9IGNsb25lZFJHQi52YWx1ZS5ibHVlIC8gMjU1O1xuXG5cdFx0Y29uc3Qga2V5ID0gY29yZS5zYW5pdGl6ZVBlcmNlbnRhZ2UoXG5cdFx0XHQxIC0gTWF0aC5tYXgocmVkUHJpbWUsIGdyZWVuUHJpbWUsIGJsdWVQcmltZSlcblx0XHQpO1xuXHRcdGNvbnN0IGN5YW4gPSBjb3JlLnNhbml0aXplUGVyY2VudGFnZShcblx0XHRcdCgxIC0gcmVkUHJpbWUgLSBrZXkpIC8gKDEgLSBrZXkpIHx8IDBcblx0XHQpO1xuXHRcdGNvbnN0IG1hZ2VudGEgPSBjb3JlLnNhbml0aXplUGVyY2VudGFnZShcblx0XHRcdCgxIC0gZ3JlZW5QcmltZSAtIGtleSkgLyAoMSAtIGtleSkgfHwgMFxuXHRcdCk7XG5cdFx0Y29uc3QgeWVsbG93ID0gY29yZS5zYW5pdGl6ZVBlcmNlbnRhZ2UoXG5cdFx0XHQoMSAtIGJsdWVQcmltZSAtIGtleSkgLyAoMSAtIGtleSkgfHwgMFxuXHRcdCk7XG5cdFx0Y29uc3QgYWxwaGE6IG51bWJlciA9IHJnYi52YWx1ZS5hbHBoYTtcblx0XHRjb25zdCBmb3JtYXQ6ICdjbXlrJyA9ICdjbXlrJztcblxuXHRcdGNvbnN0IGNteWsgPSB7IHZhbHVlOiB7IGN5YW4sIG1hZ2VudGEsIHllbGxvdywga2V5LCBhbHBoYSB9LCBmb3JtYXQgfTtcblxuXHRcdGlmICghbW9kZS5xdWlldClcblx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRgQ29udmVydGVkIFJHQiAke0pTT04uc3RyaW5naWZ5KGNsb25lZFJHQil9IHRvIENNWUs6ICR7SlNPTi5zdHJpbmdpZnkoY29yZS5jbG9uZShjbXlrKSl9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBjbXlrO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgUkdCIHRvIENNWUs6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0Q01ZSyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9IZXgocmdiOiBSR0IpOiBIZXgge1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKHJnYikpIHtcblx0XHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0SGV4KTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRSR0IgPSBjb3JlLmNsb25lKHJnYik7XG5cblx0XHRpZiAoXG5cdFx0XHRbXG5cdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5yZWQsXG5cdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbixcblx0XHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWVcblx0XHRcdF0uc29tZSh2ID0+IGlzTmFOKHYpIHx8IHYgPCAwIHx8IHYgPiAyNTUpIHx8XG5cdFx0XHRbY2xvbmVkUkdCLnZhbHVlLmFscGhhXS5zb21lKHYgPT4gaXNOYU4odikgfHwgdiA8IDAgfHwgdiA+IDEpXG5cdFx0KSB7XG5cdFx0XHRpZiAobW9kZS5sb2dXYXJuaW5ncylcblx0XHRcdFx0Y29uc29sZS53YXJuKFxuXHRcdFx0XHRcdGBJbnZhbGlkIFJHQiB2YWx1ZXM6IFxcblI9JHtKU09OLnN0cmluZ2lmeShjbG9uZWRSR0IudmFsdWUucmVkKX1cXG5HPSR7SlNPTi5zdHJpbmdpZnkoY2xvbmVkUkdCLnZhbHVlLmdyZWVuKX1cXG5CPSR7SlNPTi5zdHJpbmdpZnkoY2xvbmVkUkdCLnZhbHVlLmJsdWUpfVxcbkE9JHtKU09OLnN0cmluZ2lmeShjbG9uZWRSR0IudmFsdWUuYWxwaGEpfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRoZXg6ICcjMDAwMDAwRkYnLFxuXHRcdFx0XHRcdGFscGhhOiAnRkYnLFxuXHRcdFx0XHRcdG51bUFscGhhOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hleCcgYXMgJ2hleCdcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGhleDogYCMke2NvbXBvbmVudFRvSGV4KGNsb25lZFJHQi52YWx1ZS5yZWQpfSR7Y29tcG9uZW50VG9IZXgoY2xvbmVkUkdCLnZhbHVlLmdyZWVuKX0ke2NvbXBvbmVudFRvSGV4KGNsb25lZFJHQi52YWx1ZS5ibHVlKX1gLFxuXHRcdFx0XHRhbHBoYTogY29tcG9uZW50VG9IZXgoY2xvbmVkUkdCLnZhbHVlLmFscGhhKSxcblx0XHRcdFx0bnVtQWxwaGE6IGNsb25lZFJHQi52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hleCcgYXMgJ2hleCdcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmxvZ0Vycm9ycykgY29uc29sZS53YXJuKGByZ2JUb0hleCBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRIZXgpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJnYlRvSFNMKHJnYjogUkdCKTogSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvcmUudmFsaWRhdGVDb2xvclZhbHVlcyhyZ2IpKSB7XG5cdFx0XHRpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdEhTTCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkUkdCID0gY29yZS5jbG9uZShyZ2IpO1xuXG5cdFx0Y2xvbmVkUkdCLnZhbHVlLnJlZCAvPSAyNTU7XG5cdFx0Y2xvbmVkUkdCLnZhbHVlLmdyZWVuIC89IDI1NTtcblx0XHRjbG9uZWRSR0IudmFsdWUuYmx1ZSAvPSAyNTU7XG5cblx0XHRjb25zdCBtYXggPSBNYXRoLm1heChcblx0XHRcdGNsb25lZFJHQi52YWx1ZS5yZWQsXG5cdFx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4sXG5cdFx0XHRjbG9uZWRSR0IudmFsdWUuYmx1ZVxuXHRcdCk7XG5cdFx0Y29uc3QgbWluID0gTWF0aC5taW4oXG5cdFx0XHRjbG9uZWRSR0IudmFsdWUucmVkLFxuXHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmdyZWVuLFxuXHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWVcblx0XHQpO1xuXG5cdFx0bGV0IGh1ZSA9IDAsXG5cdFx0XHRzYXR1cmF0aW9uID0gMCxcblx0XHRcdGxpZ2h0bmVzcyA9IChtYXggKyBtaW4pIC8gMjtcblxuXHRcdGlmIChtYXggIT09IG1pbikge1xuXHRcdFx0Y29uc3QgZGVsdGEgPSBtYXggLSBtaW47XG5cblx0XHRcdHNhdHVyYXRpb24gPVxuXHRcdFx0XHRsaWdodG5lc3MgPiAwLjUgPyBkZWx0YSAvICgyIC0gbWF4IC0gbWluKSA6IGRlbHRhIC8gKG1heCArIG1pbik7XG5cblx0XHRcdHN3aXRjaCAobWF4KSB7XG5cdFx0XHRcdGNhc2UgY2xvbmVkUkdCLnZhbHVlLnJlZDpcblx0XHRcdFx0XHRodWUgPVxuXHRcdFx0XHRcdFx0KGNsb25lZFJHQi52YWx1ZS5ncmVlbiAtIGNsb25lZFJHQi52YWx1ZS5ibHVlKSAvIGRlbHRhICtcblx0XHRcdFx0XHRcdChjbG9uZWRSR0IudmFsdWUuZ3JlZW4gPCBjbG9uZWRSR0IudmFsdWUuYmx1ZSA/IDYgOiAwKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBjbG9uZWRSR0IudmFsdWUuZ3JlZW46XG5cdFx0XHRcdFx0aHVlID1cblx0XHRcdFx0XHRcdChjbG9uZWRSR0IudmFsdWUuYmx1ZSAtIGNsb25lZFJHQi52YWx1ZS5yZWQpIC8gZGVsdGEgK1xuXHRcdFx0XHRcdFx0Mjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBjbG9uZWRSR0IudmFsdWUuYmx1ZTpcblx0XHRcdFx0XHRodWUgPVxuXHRcdFx0XHRcdFx0KGNsb25lZFJHQi52YWx1ZS5yZWQgLSBjbG9uZWRSR0IudmFsdWUuZ3JlZW4pIC8gZGVsdGEgK1xuXHRcdFx0XHRcdFx0NDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGh1ZSAqPSA2MDtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBNYXRoLnJvdW5kKGh1ZSksXG5cdFx0XHRcdHNhdHVyYXRpb246IE1hdGgucm91bmQoc2F0dXJhdGlvbiAqIDEwMCksXG5cdFx0XHRcdGxpZ2h0bmVzczogTWF0aC5yb3VuZChsaWdodG5lc3MgKiAxMDApLFxuXHRcdFx0XHRhbHBoYTogcmdiLnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKSBjb25zb2xlLmVycm9yKGByZ2JUb0hTTCgpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdEhTTCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9IU1YocmdiOiBSR0IpOiBIU1Yge1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKHJnYikpIHtcblx0XHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0SFNWKTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRSR0IgPSBjb3JlLmNsb25lKHJnYik7XG5cblx0XHRjbG9uZWRSR0IudmFsdWUucmVkIC89IDI1NTtcblx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4gLz0gMjU1O1xuXHRcdGNsb25lZFJHQi52YWx1ZS5ibHVlIC89IDI1NTtcblxuXHRcdGNvbnN0IG1heCA9IE1hdGgubWF4KFxuXHRcdFx0Y2xvbmVkUkdCLnZhbHVlLnJlZCxcblx0XHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbixcblx0XHRcdGNsb25lZFJHQi52YWx1ZS5ibHVlXG5cdFx0KTtcblx0XHRjb25zdCBtaW4gPSBNYXRoLm1pbihcblx0XHRcdGNsb25lZFJHQi52YWx1ZS5yZWQsXG5cdFx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4sXG5cdFx0XHRjbG9uZWRSR0IudmFsdWUuYmx1ZVxuXHRcdCk7XG5cdFx0Y29uc3QgZGVsdGEgPSBtYXggLSBtaW47XG5cblx0XHRsZXQgaHVlID0gMDtcblxuXHRcdGNvbnN0IHZhbHVlID0gbWF4O1xuXHRcdGNvbnN0IHNhdHVyYXRpb24gPSBtYXggPT09IDAgPyAwIDogZGVsdGEgLyBtYXg7XG5cblx0XHRpZiAobWF4ICE9PSBtaW4pIHtcblx0XHRcdHN3aXRjaCAobWF4KSB7XG5cdFx0XHRcdGNhc2UgY2xvbmVkUkdCLnZhbHVlLnJlZDpcblx0XHRcdFx0XHRodWUgPVxuXHRcdFx0XHRcdFx0KGNsb25lZFJHQi52YWx1ZS5ncmVlbiAtIGNsb25lZFJHQi52YWx1ZS5ibHVlKSAvIGRlbHRhICtcblx0XHRcdFx0XHRcdChjbG9uZWRSR0IudmFsdWUuZ3JlZW4gPCBjbG9uZWRSR0IudmFsdWUuYmx1ZSA/IDYgOiAwKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBjbG9uZWRSR0IudmFsdWUuZ3JlZW46XG5cdFx0XHRcdFx0aHVlID1cblx0XHRcdFx0XHRcdChjbG9uZWRSR0IudmFsdWUuYmx1ZSAtIGNsb25lZFJHQi52YWx1ZS5yZWQpIC8gZGVsdGEgK1xuXHRcdFx0XHRcdFx0Mjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBjbG9uZWRSR0IudmFsdWUuYmx1ZTpcblx0XHRcdFx0XHRodWUgPVxuXHRcdFx0XHRcdFx0KGNsb25lZFJHQi52YWx1ZS5yZWQgLSBjbG9uZWRSR0IudmFsdWUuZ3JlZW4pIC8gZGVsdGEgK1xuXHRcdFx0XHRcdFx0NDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0aHVlICo9IDYwO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6IE1hdGgucm91bmQoaHVlKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogTWF0aC5yb3VuZChzYXR1cmF0aW9uICogMTAwKSxcblx0XHRcdFx0dmFsdWU6IE1hdGgucm91bmQodmFsdWUgKiAxMDApLFxuXHRcdFx0XHRhbHBoYTogcmdiLnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKSBjb25zb2xlLmVycm9yKGByZ2JUb0hTVigpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdEhTVik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9YWVoocmdiOiBSR0IpOiBYWVoge1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKHJnYikpIHtcblx0XHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0WFlaKTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRSR0IgPSBjb3JlLmNsb25lKHJnYik7XG5cblx0XHRjbG9uZWRSR0IudmFsdWUucmVkID0gY2xvbmVkUkdCLnZhbHVlLnJlZCAvIDI1NTtcblx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4gPSBjbG9uZWRSR0IudmFsdWUuZ3JlZW4gLyAyNTU7XG5cdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWUgPSBjbG9uZWRSR0IudmFsdWUuYmx1ZSAvIDI1NTtcblxuXHRcdGNsb25lZFJHQi52YWx1ZS5yZWQgPVxuXHRcdFx0Y2xvbmVkUkdCLnZhbHVlLnJlZCA+IDAuMDQwNDVcblx0XHRcdFx0PyBNYXRoLnBvdygoY2xvbmVkUkdCLnZhbHVlLnJlZCArIDAuMDU1KSAvIDEuMDU1LCAyLjQpXG5cdFx0XHRcdDogY2xvbmVkUkdCLnZhbHVlLnJlZCAvIDEyLjkyO1xuXHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbiA9XG5cdFx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4gPiAwLjA0MDQ1XG5cdFx0XHRcdD8gTWF0aC5wb3coKGNsb25lZFJHQi52YWx1ZS5ncmVlbiArIDAuMDU1KSAvIDEuMDU1LCAyLjQpXG5cdFx0XHRcdDogY2xvbmVkUkdCLnZhbHVlLmdyZWVuIC8gMTIuOTI7XG5cdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWUgPVxuXHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWUgPiAwLjA0MDQ1XG5cdFx0XHRcdD8gTWF0aC5wb3coKGNsb25lZFJHQi52YWx1ZS5ibHVlICsgMC4wNTUpIC8gMS4wNTUsIDIuNClcblx0XHRcdFx0OiBjbG9uZWRSR0IudmFsdWUuYmx1ZSAvIDEyLjkyO1xuXG5cdFx0Y2xvbmVkUkdCLnZhbHVlLnJlZCA9IGNsb25lZFJHQi52YWx1ZS5yZWQgKiAxMDA7XG5cdFx0Y2xvbmVkUkdCLnZhbHVlLmdyZWVuID0gY2xvbmVkUkdCLnZhbHVlLmdyZWVuICogMTAwO1xuXHRcdGNsb25lZFJHQi52YWx1ZS5ibHVlID0gY2xvbmVkUkdCLnZhbHVlLmJsdWUgKiAxMDA7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0eDpcblx0XHRcdFx0XHRjbG9uZWRSR0IudmFsdWUucmVkICogMC40MTI0ICtcblx0XHRcdFx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4gKiAwLjM1NzYgK1xuXHRcdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5ibHVlICogMC4xODA1LFxuXHRcdFx0XHR5OlxuXHRcdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5yZWQgKiAwLjIxMjYgK1xuXHRcdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbiAqIDAuNzE1MiArXG5cdFx0XHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWUgKiAwLjA3MjIsXG5cdFx0XHRcdHo6XG5cdFx0XHRcdFx0Y2xvbmVkUkdCLnZhbHVlLnJlZCAqIDAuMDE5MyArXG5cdFx0XHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmdyZWVuICogMC4xMTkyICtcblx0XHRcdFx0XHRjbG9uZWRSR0IudmFsdWUuYmx1ZSAqIDAuOTUwNSxcblx0XHRcdFx0YWxwaGE6IHJnYi52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmxvZ0Vycm9ycykgY29uc29sZS5lcnJvcihgcmdiVG9YWVogZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0WFlaKTtcblx0fVxufVxuXG5mdW5jdGlvbiB4eXpUb0xBQih4eXo6IFhZWik6IExBQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoeHl6KSkge1xuXHRcdFx0aWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIFhZWiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHh5eil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRMQUIpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZFhZWiA9IGNvcmUuY2xvbmUoeHl6KTtcblx0XHRjb25zdCByZWZYID0gOTUuMDQ3LFxuXHRcdFx0cmVmWSA9IDEwMC4wLFxuXHRcdFx0cmVmWiA9IDEwOC44ODM7XG5cblx0XHRjbG9uZWRYWVoudmFsdWUueCA9IGNsb25lZFhZWi52YWx1ZS54IC8gcmVmWDtcblx0XHRjbG9uZWRYWVoudmFsdWUueSA9IGNsb25lZFhZWi52YWx1ZS55IC8gcmVmWTtcblx0XHRjbG9uZWRYWVoudmFsdWUueiA9IGNsb25lZFhZWi52YWx1ZS56IC8gcmVmWjtcblxuXHRcdGNsb25lZFhZWi52YWx1ZS54ID1cblx0XHRcdGNsb25lZFhZWi52YWx1ZS54ID4gMC4wMDg4NTZcblx0XHRcdFx0PyBNYXRoLnBvdyhjbG9uZWRYWVoudmFsdWUueCwgMSAvIDMpXG5cdFx0XHRcdDogNy43ODcgKiBjbG9uZWRYWVoudmFsdWUueCArIDE2IC8gMTE2O1xuXHRcdGNsb25lZFhZWi52YWx1ZS55ID1cblx0XHRcdGNsb25lZFhZWi52YWx1ZS55ID4gMC4wMDg4NTZcblx0XHRcdFx0PyBNYXRoLnBvdyhjbG9uZWRYWVoudmFsdWUueSwgMSAvIDMpXG5cdFx0XHRcdDogNy43ODcgKiBjbG9uZWRYWVoudmFsdWUueSArIDE2IC8gMTE2O1xuXHRcdGNsb25lZFhZWi52YWx1ZS56ID1cblx0XHRcdGNsb25lZFhZWi52YWx1ZS56ID4gMC4wMDg4NTZcblx0XHRcdFx0PyBNYXRoLnBvdyhjbG9uZWRYWVoudmFsdWUueiwgMSAvIDMpXG5cdFx0XHRcdDogNy43ODcgKiBjbG9uZWRYWVoudmFsdWUueiArIDE2IC8gMTE2O1xuXG5cdFx0Y29uc3QgbCA9IGNvcmUuc2FuaXRpemVQZXJjZW50YWdlKFxuXHRcdFx0cGFyc2VGbG9hdCgoMTE2ICogY2xvbmVkWFlaLnZhbHVlLnkgLSAxNikudG9GaXhlZCgyKSlcblx0XHQpO1xuXHRcdGNvbnN0IGEgPSBjb3JlLnNhbml0aXplTEFCKFxuXHRcdFx0cGFyc2VGbG9hdChcblx0XHRcdFx0KDUwMCAqIChjbG9uZWRYWVoudmFsdWUueCAtIGNsb25lZFhZWi52YWx1ZS55KSkudG9GaXhlZCgyKVxuXHRcdFx0KVxuXHRcdCk7XG5cdFx0Y29uc3QgYiA9IGNvcmUuc2FuaXRpemVMQUIoXG5cdFx0XHRwYXJzZUZsb2F0KFxuXHRcdFx0XHQoMjAwICogKGNsb25lZFhZWi52YWx1ZS55IC0gY2xvbmVkWFlaLnZhbHVlLnopKS50b0ZpeGVkKDIpXG5cdFx0XHQpXG5cdFx0KTtcblx0XHRjb25zdCBsYWI6IExBQiA9IHtcblx0XHRcdHZhbHVlOiB7IGwsIGEsIGIsIGFscGhhOiB4eXoudmFsdWUuYWxwaGEgfSxcblx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHR9O1xuXG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMobGFiKSkge1xuXHRcdFx0aWYgKG1vZGUubG9nRXJyb3JzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIExBQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGxhYil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRMQUIpO1xuXHRcdH1cblxuXHRcdHJldHVybiBsYWI7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKSBjb25zb2xlLmVycm9yKGB4eXpUb0xhYigpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdExBQik7XG5cdH1cbn1cblxuZnVuY3Rpb24geHl6VG9IU0woeHl6OiBYWVopOiBIU0wge1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKHh5eikpIHtcblx0XHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBYWVogdmFsdWUgJHtKU09OLnN0cmluZ2lmeSh4eXopfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0SFNMKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IU0woeHl6VG9SR0IoY29yZS5jbG9uZSh4eXopKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKSBjb25zb2xlLmVycm9yKGB4eXpUb0hTTCgpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdEhTTCk7XG5cdH1cbn1cblxuZnVuY3Rpb24geHl6VG9SR0IoeHl6OiBYWVopOiBSR0Ige1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKHh5eikpIHtcblx0XHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBYWVogdmFsdWUgJHtKU09OLnN0cmluZ2lmeSh4eXopfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0UkdCKTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRYWVogPSBjb3JlLmNsb25lKHh5eik7XG5cblx0XHRjbG9uZWRYWVoudmFsdWUueCAvPSAxMDA7XG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnkgLz0gMTAwO1xuXHRcdGNsb25lZFhZWi52YWx1ZS56IC89IDEwMDtcblxuXHRcdGxldCByZWQgPVxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnggKiAzLjI0MDYgK1xuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnkgKiAtMS41MzcyICtcblx0XHRcdGNsb25lZFhZWi52YWx1ZS56ICogLTAuNDk4Njtcblx0XHRsZXQgZ3JlZW4gPVxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnggKiAtMC45Njg5ICtcblx0XHRcdGNsb25lZFhZWi52YWx1ZS55ICogMS44NzU4ICtcblx0XHRcdGNsb25lZFhZWi52YWx1ZS56ICogMC4wNDE1O1xuXHRcdGxldCBibHVlID1cblx0XHRcdGNsb25lZFhZWi52YWx1ZS54ICogMC4wNTU3ICtcblx0XHRcdGNsb25lZFhZWi52YWx1ZS55ICogLTAuMjA0ICtcblx0XHRcdGNsb25lZFhZWi52YWx1ZS56ICogMS4wNTc7XG5cblx0XHRyZWQgPSBhcHBseUdhbW1hQ29ycmVjdGlvbihyZWQpO1xuXHRcdGdyZWVuID0gYXBwbHlHYW1tYUNvcnJlY3Rpb24oZ3JlZW4pO1xuXHRcdGJsdWUgPSBhcHBseUdhbW1hQ29ycmVjdGlvbihibHVlKTtcblxuXHRcdHJldHVybiBjbGFtcFJHQih7XG5cdFx0XHR2YWx1ZTogeyByZWQsIGdyZWVuLCBibHVlLCBhbHBoYTogeHl6LnZhbHVlLmFscGhhIH0sXG5cdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0fSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUubG9nRXJyb3JzKSBjb25zb2xlLmVycm9yKGB4eXpUb1JHQiBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRSR0IpO1xuXHR9XG59XG5cbi8vICoqKioqKioqIEJVTkRMRUQgQ09OVkVSU0lPTiBGVU5DVElPTlMgKioqKioqKipcblxuZnVuY3Rpb24gaHNsVG8oY29sb3I6IEhTTCwgY29sb3JTcGFjZTogQ29sb3JTcGFjZUV4dGVuZGVkKTogQ29sb3Ige1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKGNvbG9yKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBjb2xvciB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGNvbG9yKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdFJHQik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjb3JlLmNsb25lKGNvbG9yKSBhcyBIU0w7XG5cblx0XHRzd2l0Y2ggKGNvbG9yU3BhY2UpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9DTVlLKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBoc2xUb0hleChjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gY29yZS5jbG9uZShjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9IU1YoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0cmV0dXJuIGhzbFRvTEFCKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdHJldHVybiBoc2xUb1JHQihjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdzbCc6XG5cdFx0XHRcdHJldHVybiBoc2xUb1NMKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ3N2Jzpcblx0XHRcdFx0cmV0dXJuIGhzbFRvU1YoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIGhzbFRvWFlaKGNsb25lZENvbG9yKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2xvciBmb3JtYXQnKTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBoc2xUbygpIGVycm9yOiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHRvSFNMKGNvbG9yOiBFeGNsdWRlPENvbG9yLCBTTCB8IFNWPik6IEhTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoY29sb3IpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIGNvbG9yIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0SFNMKTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRDb2xvciA9IGNvcmUuY2xvbmUoY29sb3IpO1xuXG5cdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gY215a1RvSFNMKGNsb25lZENvbG9yIGFzIENNWUspO1xuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0cmV0dXJuIGhleFRvSFNMKGNsb25lZENvbG9yIGFzIEhleCk7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gY29yZS5jbG9uZShjbG9uZWRDb2xvciBhcyBIU0wpO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGhzdlRvSFNMKGNsb25lZENvbG9yIGFzIEhTVik7XG5cdFx0XHRjYXNlICdsYWInOlxuXHRcdFx0XHRyZXR1cm4gbGFiVG9IU0woY2xvbmVkQ29sb3IgYXMgTEFCKTtcblx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdHJldHVybiByZ2JUb0hTTChjbG9uZWRDb2xvciBhcyBSR0IpO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIHh5elRvSFNMKGNsb25lZENvbG9yIGFzIFhZWik7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29sb3IgZm9ybWF0Jyk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgdG9IU0woKSBlcnJvcjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgY29udmVydCA9IHtcblx0aHNsVG8sXG5cdHRvSFNMLFxuXHR3cmFwcGVyczoge1xuXHRcdGhleFRvSFNMOiBoZXhUb0hTTFdyYXBwZXJcblx0fVxufTtcbiJdfQ==