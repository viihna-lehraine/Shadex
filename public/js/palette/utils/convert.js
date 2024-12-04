// File: src/palette/utils/convert.ts
import { config } from '../../config.js';
import { core, helpers, utils } from '../../common/.js';
const defaults = config.defaults;
const applyGammaCorrection = helpers.conversion.applyGammaCorrection;
const clampRGB = helpers.conversion.clampRGB;
const componentToHex = utils.color.componentToHex;
const hueToRGB = helpers.conversion.hueToRGB;
const stripHashFromHex = utils.color.stripHashFromHex;
function cmykToHSL(cmyk) {
    try {
        if (!core.validateColorValues(cmyk)) {
            console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);
            return core.clone(defaults.colors.hsl);
        }
        return rgbToHSL(cmykToRGB(core.clone(cmyk)));
    }
    catch (error) {
        console.error(`cmykToHSL() error: ${error}`);
        return core.clone(defaults.colors.hsl);
    }
}
export function cmykToRGB(cmyk) {
    try {
        if (!core.validateColorValues(cmyk)) {
            console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);
            return core.clone(defaults.colors.rgb);
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
        console.error(`cmykToRGB error: ${error}`);
        return core.clone(defaults.colors.rgb);
    }
}
function hexToHSL(hex) {
    try {
        if (!core.validateColorValues(hex)) {
            console.error(`Invalid Hex value ${JSON.stringify(hex)}`);
            return core.clone(defaults.colors.hsl);
        }
        return rgbToHSL(hexToRGB(core.clone(hex)));
    }
    catch (error) {
        console.error(`hexToHSL() error: ${error}`);
        return core.clone(defaults.colors.hsl);
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
        return convert.hexToHSL(hex);
    }
    catch (error) {
        console.error(`Error converting hex to HSL: ${error}`);
        return defaults.colors.hsl;
    }
}
export function hexToRGB(hex) {
    try {
        if (!core.validateColorValues(hex)) {
            console.error(`Invalid Hex value ${JSON.stringify(hex)}`);
            return core.clone(defaults.colors.rgb);
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
        console.error(`hexToRGB error: ${error}`);
        return core.clone(defaults.colors.rgb);
    }
}
function hslToCMYK(hsl) {
    try {
        if (!core.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.colors.cmyk);
        }
        return rgbToCMYK(hslToRGB(core.clone(hsl)));
    }
    catch (error) {
        console.error(`Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`);
        return core.clone(defaults.colors.cmyk);
    }
}
function hslToHex(hsl) {
    try {
        if (!core.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.colors.hex);
        }
        return rgbToHex(hslToRGB(core.clone(hsl)));
    }
    catch (error) {
        console.warn(`hslToHex error: ${error}`);
        return core.clone(defaults.colors.hex);
    }
}
function hslToHSV(hsl) {
    try {
        if (!core.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.colors.hsv);
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
        console.error(`hslToHSV() error: ${error}`);
        return core.clone(defaults.colors.hsv);
    }
}
function hslToLAB(hsl) {
    try {
        if (!core.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.colors.lab);
        }
        return xyzToLAB(rgbToXYZ(hslToRGB(core.clone(hsl))));
    }
    catch (error) {
        console.error(`hslToLab() error: ${error}`);
        return core.clone(defaults.colors.lab);
    }
}
export function hslToRGB(hsl) {
    try {
        if (!core.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.colors.rgb);
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
        console.error(`hslToRGB error: ${error}`);
        return core.clone(defaults.colors.rgb);
    }
}
function hslToSL(hsl) {
    try {
        if (!core.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.colors.sl);
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
        console.error(`Error converting HSL to SL: ${error}`);
        return defaults.colors.sl;
    }
}
function hslToSV(hsl) {
    try {
        if (!core.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.colors.sv);
        }
        return hsvToSV(rgbToHSV(hslToRGB(core.clone(hsl))));
    }
    catch (error) {
        console.error(`Error converting HSL to SV: ${error}`);
        return defaults.colors.sv;
    }
}
function hslToXYZ(hsl) {
    try {
        if (!core.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.colors.xyz);
        }
        return labToXYZ(hslToLAB(core.clone(hsl)));
    }
    catch (error) {
        console.error(`hslToXYZ error: ${error}`);
        return core.clone(defaults.colors.xyz);
    }
}
function hsvToHSL(hsv) {
    try {
        if (!core.validateColorValues(hsv)) {
            console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);
            return core.clone(defaults.colors.hsl);
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
        console.error(`hsvToHSL() error: ${error}`);
        return core.clone(defaults.colors.hsl);
    }
}
function hsvToSV(hsv) {
    try {
        if (!core.validateColorValues(hsv)) {
            console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);
            return core.clone(defaults.colors.sv);
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
        console.error(`Error converting HSV to SV: ${error}`);
        return defaults.colors.sv;
    }
}
function labToHSL(lab) {
    try {
        if (!core.validateColorValues(lab)) {
            console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaults.colors.hsl);
        }
        return rgbToHSL(labToRGB(core.clone(lab)));
    }
    catch (error) {
        console.error(`labToHSL() error: ${error}`);
        return core.clone(defaults.colors.hsl);
    }
}
export function labToRGB(lab) {
    try {
        if (!core.validateColorValues(lab)) {
            console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaults.colors.rgb);
        }
        return xyzToRGB(labToXYZ(core.clone(lab)));
    }
    catch (error) {
        console.error(`labToRGB error: ${error}`);
        return core.clone(defaults.colors.rgb);
    }
}
function labToXYZ(lab) {
    try {
        if (!core.validateColorValues(lab)) {
            console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaults.colors.xyz);
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
        console.error(`labToXYZ error: ${error}`);
        return core.clone(defaults.colors.xyz);
    }
}
function rgbToCMYK(rgb) {
    try {
        if (!core.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.colors.cmyk);
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
        console.log(`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(core.clone(cmyk))}`);
        return cmyk;
    }
    catch (error) {
        console.error(`Error converting RGB to CMYK: ${error}`);
        return core.clone(defaults.colors.cmyk);
    }
}
function rgbToHex(rgb) {
    try {
        if (!core.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.colors.hex);
        }
        const clonedRGB = core.clone(rgb);
        if ([
            clonedRGB.value.red,
            clonedRGB.value.green,
            clonedRGB.value.blue
        ].some(v => isNaN(v) || v < 0 || v > 255) ||
            [clonedRGB.value.alpha].some(v => isNaN(v) || v < 0 || v > 1)) {
            console.warn(`Invalid RGB values: R=${JSON.stringify(clonedRGB.value.red)}, G=${JSON.stringify(clonedRGB.value.green)}, B=${JSON.stringify(clonedRGB.value.blue)}, A=${JSON.stringify(clonedRGB.value.alpha)}`);
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
        console.warn(`rgbToHex error: ${error}`);
        return core.clone(defaults.colors.hex);
    }
}
function rgbToHSL(rgb) {
    try {
        if (!core.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.colors.hsl);
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
        console.error(`rgbToHSL() error: ${error}`);
        return core.clone(defaults.colors.hsl);
    }
}
function rgbToHSV(rgb) {
    try {
        if (!core.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.colors.hsv);
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
        console.error(`rgbToHSV() error: ${error}`);
        return core.clone(defaults.colors.hsv);
    }
}
function rgbToXYZ(rgb) {
    try {
        if (!core.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.colors.xyz);
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
        console.error(`rgbToXYZ error: ${error}`);
        return core.clone(defaults.colors.xyz);
    }
}
function xyzToLAB(xyz) {
    try {
        if (!core.validateColorValues(xyz)) {
            console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaults.colors.lab);
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
            console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaults.colors.lab);
        }
        return lab;
    }
    catch (error) {
        console.error(`xyzToLab() error: ${error}`);
        return core.clone(defaults.colors.lab);
    }
}
function xyzToHSL(xyz) {
    try {
        if (!core.validateColorValues(xyz)) {
            console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaults.colors.hsl);
        }
        return rgbToHSL(xyzToRGB(core.clone(xyz)));
    }
    catch (error) {
        console.error(`xyzToHSL() error: ${error}`);
        return core.clone(defaults.colors.hsl);
    }
}
export function xyzToRGB(xyz) {
    try {
        if (!core.validateColorValues(xyz)) {
            console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaults.colors.rgb);
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
        console.error(`xyzToRGB error: ${error}`);
        return core.clone(defaults.colors.rgb);
    }
}
export const convert = {
    cmykToHSL,
    hexToHSL,
    hslToCMYK,
    hslToHex,
    hslToHSV,
    hslToLAB,
    hslToRGB,
    hslToSL,
    hslToSV,
    hslToXYZ,
    hsvToHSL,
    hsvToSV,
    labToHSL,
    labToXYZ,
    rgbToCMYK,
    rgbToHex,
    rgbToHSL,
    rgbToHSV,
    rgbToXYZ,
    xyzToHSL,
    xyzToLAB
};
export const wrappers = { hexToHSL: hexToHSLWrapper };
export function hslTo(color, colorSpace) {
    try {
        if (!core.validateColorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return core.clone(defaults.colors.rgb);
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
export function toHSL(color) {
    try {
        if (!core.validateColorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return core.clone(defaults.colors.hsl);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wYWxldHRlL3V0aWxzL2NvbnZlcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUNBQXFDO0FBZXJDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDdEMsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXJELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFFakMsTUFBTSxvQkFBb0IsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDO0FBQ3JFLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO0FBQzdDLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO0FBQ2xELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO0FBQzdDLE1BQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztBQUV0RCxTQUFTLFNBQVMsQ0FBQyxJQUFVO0lBQzVCLElBQUksQ0FBQztRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNyQyxPQUFPLENBQUMsS0FBSyxDQUFDLHNCQUFzQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUU1RCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBRUQsT0FBTyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFBQyxPQUFPLEtBQUss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QUFDO1lBQ3JDLEtBQUssS0FBSztnQkFDVCxPQUFPLFFBQVEsQ0FBQyxXQUFrQixDQUFDLENBQUM7WUFDckMsS0FBSyxLQUFLO2dCQUNULE9BQU8sUUFBUSxDQUFDLFdBQWtCLENBQUMsQ0FBQztZQUNyQyxLQUFLLEtBQUs7Z0JBQ1QsT0FBTyxRQUFRLENBQUMsV0FBa0IsQ0FBQyxDQUFDO1lBQ3JDO2dCQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUMxQyxDQUFDO0lBQ0YsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUM1QyxDQUFDO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9wYWxldHRlL3V0aWxzL2NvbnZlcnQudHNcblxuaW1wb3J0IHtcblx0Q01ZSyxcblx0Q29sb3IsXG5cdENvbG9yU3BhY2VFeHRlbmRlZCxcblx0SGV4LFxuXHRIU0wsXG5cdEhTVixcblx0TEFCLFxuXHRSR0IsXG5cdFNMLFxuXHRTVixcblx0WFlaXG59IGZyb20gJy4uLy4uL2luZGV4JztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQgeyBjb3JlLCBoZWxwZXJzLCB1dGlscyB9IGZyb20gJy4uLy4uL2NvbW1vbi8nO1xuXG5jb25zdCBkZWZhdWx0cyA9IGNvbmZpZy5kZWZhdWx0cztcblxuY29uc3QgYXBwbHlHYW1tYUNvcnJlY3Rpb24gPSBoZWxwZXJzLmNvbnZlcnNpb24uYXBwbHlHYW1tYUNvcnJlY3Rpb247XG5jb25zdCBjbGFtcFJHQiA9IGhlbHBlcnMuY29udmVyc2lvbi5jbGFtcFJHQjtcbmNvbnN0IGNvbXBvbmVudFRvSGV4ID0gdXRpbHMuY29sb3IuY29tcG9uZW50VG9IZXg7XG5jb25zdCBodWVUb1JHQiA9IGhlbHBlcnMuY29udmVyc2lvbi5odWVUb1JHQjtcbmNvbnN0IHN0cmlwSGFzaEZyb21IZXggPSB1dGlscy5jb2xvci5zdHJpcEhhc2hGcm9tSGV4O1xuXG5mdW5jdGlvbiBjbXlrVG9IU0woY215azogQ01ZSyk6IEhTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoY215aykpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgQ01ZSyB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGNteWspfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuaHNsKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IU0woY215a1RvUkdCKGNvcmUuY2xvbmUoY215aykpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBjbXlrVG9IU0woKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5oc2wpO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbXlrVG9SR0IoY215azogQ01ZSyk6IFJHQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoY215aykpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgQ01ZSyB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGNteWspfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMucmdiKTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRDTVlLID0gY29yZS5jbG9uZShjbXlrKTtcblx0XHRjb25zdCByID1cblx0XHRcdDI1NSAqXG5cdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUuY3lhbiAvIDEwMCkgKlxuXHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLmtleSAvIDEwMCk7XG5cdFx0Y29uc3QgZyA9XG5cdFx0XHQyNTUgKlxuXHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLm1hZ2VudGEgLyAxMDApICpcblx0XHRcdCgxIC0gY2xvbmVkQ01ZSy52YWx1ZS5rZXkgLyAxMDApO1xuXHRcdGNvbnN0IGIgPVxuXHRcdFx0MjU1ICpcblx0XHRcdCgxIC0gY2xvbmVkQ01ZSy52YWx1ZS55ZWxsb3cgLyAxMDApICpcblx0XHRcdCgxIC0gY2xvbmVkQ01ZSy52YWx1ZS5rZXkgLyAxMDApO1xuXHRcdGNvbnN0IGFscGhhID0gY215ay52YWx1ZS5hbHBoYTtcblx0XHRjb25zdCByZ2I6IFJHQiA9IHtcblx0XHRcdHZhbHVlOiB7IHJlZDogciwgZ3JlZW46IGcsIGJsdWU6IGIsIGFscGhhIH0sXG5cdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0fTtcblxuXHRcdHJldHVybiBjbGFtcFJHQihyZ2IpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGNteWtUb1JHQiBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5yZ2IpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleFRvSFNMKGhleDogSGV4KTogSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvcmUudmFsaWRhdGVDb2xvclZhbHVlcyhoZXgpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhleCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhleCl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5oc2wpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZ2JUb0hTTChoZXhUb1JHQihjb3JlLmNsb25lKGhleCkpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBoZXhUb0hTTCgpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuY29sb3JzLmhzbCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4VG9IU0xXcmFwcGVyKGlucHV0OiBzdHJpbmcgfCBIZXgpOiBIU0wge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNsb25lZElucHV0ID0gY29yZS5jbG9uZShpbnB1dCk7XG5cdFx0Y29uc3QgaGV4OiBIZXggPVxuXHRcdFx0dHlwZW9mIGNsb25lZElucHV0ID09PSAnc3RyaW5nJ1xuXHRcdFx0XHQ/IHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdGhleDogY2xvbmVkSW5wdXQsXG5cdFx0XHRcdFx0XHRcdGFscGhhOiBjbG9uZWRJbnB1dC5zbGljZSgtMiksXG5cdFx0XHRcdFx0XHRcdG51bUFscGhhOiBjb3JlLmhleEFscGhhVG9OdW1lcmljQWxwaGEoXG5cdFx0XHRcdFx0XHRcdFx0Y2xvbmVkSW5wdXQuc2xpY2UoLTIpXG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQ6IHtcblx0XHRcdFx0XHRcdC4uLmNsb25lZElucHV0LFxuXHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0Li4uY2xvbmVkSW5wdXQudmFsdWUsXG5cdFx0XHRcdFx0XHRcdG51bUFscGhhOiBjb3JlLmhleEFscGhhVG9OdW1lcmljQWxwaGEoXG5cdFx0XHRcdFx0XHRcdFx0Y2xvbmVkSW5wdXQudmFsdWUuYWxwaGFcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cblx0XHRyZXR1cm4gY29udmVydC5oZXhUb0hTTChoZXgpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgaGV4IHRvIEhTTDogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0cy5jb2xvcnMuaHNsO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoZXhUb1JHQihoZXg6IEhleCk6IFJHQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaGV4KSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIZXggdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoZXgpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMucmdiKTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRIZXggPSBjb3JlLmNsb25lKGhleCk7XG5cdFx0Y29uc3Qgc3RyaXBwZWRIZXggPSBzdHJpcEhhc2hGcm9tSGV4KGNsb25lZEhleCkudmFsdWUuaGV4O1xuXHRcdGNvbnN0IGJpZ2ludCA9IHBhcnNlSW50KHN0cmlwcGVkSGV4LCAxNik7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0cmVkOiAoYmlnaW50ID4+IDE2KSAmIDI1NSxcblx0XHRcdFx0Z3JlZW46IChiaWdpbnQgPj4gOCkgJiAyNTUsXG5cdFx0XHRcdGJsdWU6IGJpZ2ludCAmIDI1NSxcblx0XHRcdFx0YWxwaGE6IGhleC52YWx1ZS5udW1BbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGhleFRvUkdCIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuY29sb3JzLnJnYik7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9DTVlLKGhzbDogSFNMKTogQ01ZSyB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuY215ayk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJnYlRvQ01ZSyhoc2xUb1JHQihjb3JlLmNsb25lKGhzbCkpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0YEVycm9yIGNvbnZlcnRpbmcgSFNMICR7SlNPTi5zdHJpbmdpZnkoaHNsKX0gdG8gQ01ZSzogJHtlcnJvcn1gXG5cdFx0KTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5jbXlrKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb0hleChoc2w6IEhTTCk6IEhleCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuaGV4KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IZXgoaHNsVG9SR0IoY29yZS5jbG9uZShoc2wpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS53YXJuKGBoc2xUb0hleCBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5oZXgpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvSFNWKGhzbDogSFNMKTogSFNWIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvcmUudmFsaWRhdGVDb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5oc3YpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZEhTTCA9IGNvcmUuY2xvbmUoaHNsKTtcblx0XHRjb25zdCBzID0gY2xvbmVkSFNMLnZhbHVlLnNhdHVyYXRpb24gLyAxMDA7XG5cdFx0Y29uc3QgbCA9IGNsb25lZEhTTC52YWx1ZS5saWdodG5lc3MgLyAxMDA7XG5cdFx0Y29uc3QgdmFsdWUgPSBsICsgcyAqIE1hdGgubWluKGwsIDEgLSAxKTtcblx0XHRjb25zdCBuZXdTYXR1cmF0aW9uID0gdmFsdWUgPT09IDAgPyAwIDogMiAqICgxIC0gbCAvIHZhbHVlKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6IE1hdGgucm91bmQoY2xvbmVkSFNMLnZhbHVlLmh1ZSksXG5cdFx0XHRcdHNhdHVyYXRpb246IE1hdGgucm91bmQobmV3U2F0dXJhdGlvbiAqIDEwMCksXG5cdFx0XHRcdHZhbHVlOiBNYXRoLnJvdW5kKHZhbHVlICogMTAwKSxcblx0XHRcdFx0YWxwaGE6IGhzbC52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGhzbFRvSFNWKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuaHN2KTtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb0xBQihoc2w6IEhTTCk6IExBQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMubGFiKTtcblx0XHR9XG5cblx0XHRyZXR1cm4geHl6VG9MQUIocmdiVG9YWVooaHNsVG9SR0IoY29yZS5jbG9uZShoc2wpKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGhzbFRvTGFiKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMubGFiKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaHNsVG9SR0IoaHNsOiBIU0wpOiBSR0Ige1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuY29sb3JzLnJnYik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkSFNMID0gY29yZS5jbG9uZShoc2wpO1xuXHRcdGNvbnN0IHMgPSBjbG9uZWRIU0wudmFsdWUuc2F0dXJhdGlvbiAvIDEwMDtcblx0XHRjb25zdCBsID0gY2xvbmVkSFNMLnZhbHVlLmxpZ2h0bmVzcyAvIDEwMDtcblx0XHRjb25zdCBxID0gbCA8IDAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcztcblx0XHRjb25zdCBwID0gMiAqIGwgLSBxO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHJlZDogTWF0aC5yb3VuZChcblx0XHRcdFx0XHRodWVUb1JHQihwLCBxLCBjbG9uZWRIU0wudmFsdWUuaHVlICsgMSAvIDMpICogMjU1XG5cdFx0XHRcdCksXG5cdFx0XHRcdGdyZWVuOiBNYXRoLnJvdW5kKGh1ZVRvUkdCKHAsIHEsIGNsb25lZEhTTC52YWx1ZS5odWUpICogMjU1KSxcblx0XHRcdFx0Ymx1ZTogTWF0aC5yb3VuZChcblx0XHRcdFx0XHRodWVUb1JHQihwLCBxLCBjbG9uZWRIU0wudmFsdWUuaHVlIC0gMSAvIDMpICogMjU1XG5cdFx0XHRcdCksXG5cdFx0XHRcdGFscGhhOiBoc2wudmFsdWUuYWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBoc2xUb1JHQiBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5yZ2IpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvU0woaHNsOiBIU0wpOiBTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuc2wpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRzYXR1cmF0aW9uOiBoc2wudmFsdWUuc2F0dXJhdGlvbixcblx0XHRcdFx0bGlnaHRuZXNzOiBoc2wudmFsdWUubGlnaHRuZXNzLFxuXHRcdFx0XHRhbHBoYTogaHNsLnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnc2wnIGFzICdzbCdcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgSFNMIHRvIFNMOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRzLmNvbG9ycy5zbDtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb1NWKGhzbDogSFNMKTogU1Yge1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuY29sb3JzLnN2KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaHN2VG9TVihyZ2JUb0hTVihoc2xUb1JHQihjb3JlLmNsb25lKGhzbCkpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBIU0wgdG8gU1Y6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdHMuY29sb3JzLnN2O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvWFlaKGhzbDogSFNMKTogWFlaIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvcmUudmFsaWRhdGVDb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy54eXopO1xuXHRcdH1cblxuXHRcdHJldHVybiBsYWJUb1hZWihoc2xUb0xBQihjb3JlLmNsb25lKGhzbCkpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBoc2xUb1hZWiBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy54eXopO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzdlRvSFNMKGhzdjogSFNWKTogSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvcmUudmFsaWRhdGVDb2xvclZhbHVlcyhoc3YpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhTViB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzdil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5oc2wpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZEhTViA9IGNvcmUuY2xvbmUoaHN2KTtcblx0XHRjb25zdCBuZXdTYXR1cmF0aW9uID1cblx0XHRcdGNsb25lZEhTVi52YWx1ZS52YWx1ZSAqICgxIC0gY2xvbmVkSFNWLnZhbHVlLnNhdHVyYXRpb24gLyAxMDApID09PVxuXHRcdFx0XHQwIHx8IGNsb25lZEhTVi52YWx1ZS52YWx1ZSA9PT0gMFxuXHRcdFx0XHQ/IDBcblx0XHRcdFx0OiAoY2xvbmVkSFNWLnZhbHVlLnZhbHVlIC1cblx0XHRcdFx0XHRcdGNsb25lZEhTVi52YWx1ZS52YWx1ZSAqXG5cdFx0XHRcdFx0XHRcdCgxIC0gY2xvbmVkSFNWLnZhbHVlLnNhdHVyYXRpb24gLyAxMDApKSAvXG5cdFx0XHRcdFx0TWF0aC5taW4oXG5cdFx0XHRcdFx0XHRjbG9uZWRIU1YudmFsdWUudmFsdWUsXG5cdFx0XHRcdFx0XHQxMDAgLSBjbG9uZWRIU1YudmFsdWUudmFsdWVcblx0XHRcdFx0XHQpO1xuXHRcdGNvbnN0IGxpZ2h0bmVzcyA9XG5cdFx0XHRjbG9uZWRIU1YudmFsdWUudmFsdWUgKiAoMSAtIGNsb25lZEhTVi52YWx1ZS5zYXR1cmF0aW9uIC8gMjAwKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6IE1hdGgucm91bmQoY2xvbmVkSFNWLnZhbHVlLmh1ZSksXG5cdFx0XHRcdHNhdHVyYXRpb246IE1hdGgucm91bmQobmV3U2F0dXJhdGlvbiAqIDEwMCksXG5cdFx0XHRcdGxpZ2h0bmVzczogTWF0aC5yb3VuZChsaWdodG5lc3MpLFxuXHRcdFx0XHRhbHBoYTogaHN2LnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgaHN2VG9IU0woKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5oc2wpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzdlRvU1YoaHN2OiBIU1YpOiBTViB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHN2KSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU1YgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc3YpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuc3YpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRzYXR1cmF0aW9uOiBoc3YudmFsdWUuc2F0dXJhdGlvbixcblx0XHRcdFx0dmFsdWU6IGhzdi52YWx1ZS52YWx1ZSxcblx0XHRcdFx0YWxwaGE6IGhzdi52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3N2JyBhcyAnc3YnXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIEhTViB0byBTVjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0cy5jb2xvcnMuc3Y7XG5cdH1cbn1cblxuZnVuY3Rpb24gbGFiVG9IU0wobGFiOiBMQUIpOiBIU0wge1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKGxhYikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuY29sb3JzLmhzbCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJnYlRvSFNMKGxhYlRvUkdCKGNvcmUuY2xvbmUobGFiKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGxhYlRvSFNMKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuaHNsKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbGFiVG9SR0IobGFiOiBMQUIpOiBSR0Ige1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKGxhYikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuY29sb3JzLnJnYik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHh5elRvUkdCKGxhYlRvWFlaKGNvcmUuY2xvbmUobGFiKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGxhYlRvUkdCIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuY29sb3JzLnJnYik7XG5cdH1cbn1cblxuZnVuY3Rpb24gbGFiVG9YWVoobGFiOiBMQUIpOiBYWVoge1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKGxhYikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuY29sb3JzLnh5eik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkTEFCID0gY29yZS5jbG9uZShsYWIpO1xuXHRcdGNvbnN0IHJlZlggPSA5NS4wNDcsXG5cdFx0XHRyZWZZID0gMTAwLjAsXG5cdFx0XHRyZWZaID0gMTA4Ljg4MztcblxuXHRcdGxldCB5ID0gKGNsb25lZExBQi52YWx1ZS5sICsgMTYpIC8gMTE2O1xuXHRcdGxldCB4ID0gY2xvbmVkTEFCLnZhbHVlLmEgLyA1MDAgKyB5O1xuXHRcdGxldCB6ID0geSAtIGNsb25lZExBQi52YWx1ZS5iIC8gMjAwO1xuXG5cdFx0Y29uc3QgcG93ID0gTWF0aC5wb3c7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0eDpcblx0XHRcdFx0XHRyZWZYICpcblx0XHRcdFx0XHQocG93KHgsIDMpID4gMC4wMDg4NTYgPyBwb3coeCwgMykgOiAoeCAtIDE2IC8gMTE2KSAvIDcuNzg3KSxcblx0XHRcdFx0eTpcblx0XHRcdFx0XHRyZWZZICpcblx0XHRcdFx0XHQocG93KHksIDMpID4gMC4wMDg4NTYgPyBwb3coeSwgMykgOiAoeSAtIDE2IC8gMTE2KSAvIDcuNzg3KSxcblx0XHRcdFx0ejpcblx0XHRcdFx0XHRyZWZaICpcblx0XHRcdFx0XHQocG93KHosIDMpID4gMC4wMDg4NTYgPyBwb3coeiwgMykgOiAoeiAtIDE2IC8gMTE2KSAvIDcuNzg3KSxcblx0XHRcdFx0YWxwaGE6IGxhYi52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGxhYlRvWFlaIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuY29sb3JzLnh5eik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9DTVlLKHJnYjogUkdCKTogQ01ZSyB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMocmdiKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuY215ayk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkUkdCID0gY29yZS5jbG9uZShyZ2IpO1xuXG5cdFx0Y29uc3QgcmVkUHJpbWUgPSBjbG9uZWRSR0IudmFsdWUucmVkIC8gMjU1O1xuXHRcdGNvbnN0IGdyZWVuUHJpbWUgPSBjbG9uZWRSR0IudmFsdWUuZ3JlZW4gLyAyNTU7XG5cdFx0Y29uc3QgYmx1ZVByaW1lID0gY2xvbmVkUkdCLnZhbHVlLmJsdWUgLyAyNTU7XG5cblx0XHRjb25zdCBrZXkgPSBjb3JlLnNhbml0aXplUGVyY2VudGFnZShcblx0XHRcdDEgLSBNYXRoLm1heChyZWRQcmltZSwgZ3JlZW5QcmltZSwgYmx1ZVByaW1lKVxuXHRcdCk7XG5cdFx0Y29uc3QgY3lhbiA9IGNvcmUuc2FuaXRpemVQZXJjZW50YWdlKFxuXHRcdFx0KDEgLSByZWRQcmltZSAtIGtleSkgLyAoMSAtIGtleSkgfHwgMFxuXHRcdCk7XG5cdFx0Y29uc3QgbWFnZW50YSA9IGNvcmUuc2FuaXRpemVQZXJjZW50YWdlKFxuXHRcdFx0KDEgLSBncmVlblByaW1lIC0ga2V5KSAvICgxIC0ga2V5KSB8fCAwXG5cdFx0KTtcblx0XHRjb25zdCB5ZWxsb3cgPSBjb3JlLnNhbml0aXplUGVyY2VudGFnZShcblx0XHRcdCgxIC0gYmx1ZVByaW1lIC0ga2V5KSAvICgxIC0ga2V5KSB8fCAwXG5cdFx0KTtcblx0XHRjb25zdCBhbHBoYTogbnVtYmVyID0gcmdiLnZhbHVlLmFscGhhO1xuXHRcdGNvbnN0IGZvcm1hdDogJ2NteWsnID0gJ2NteWsnO1xuXG5cdFx0Y29uc3QgY215ayA9IHsgdmFsdWU6IHsgY3lhbiwgbWFnZW50YSwgeWVsbG93LCBrZXksIGFscGhhIH0sIGZvcm1hdCB9O1xuXG5cdFx0Y29uc29sZS5sb2coXG5cdFx0XHRgQ29udmVydGVkIFJHQiAke0pTT04uc3RyaW5naWZ5KGNsb25lZFJHQil9IHRvIENNWUs6ICR7SlNPTi5zdHJpbmdpZnkoY29yZS5jbG9uZShjbXlrKSl9YFxuXHRcdCk7XG5cblx0XHRyZXR1cm4gY215aztcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIFJHQiB0byBDTVlLOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuY29sb3JzLmNteWspO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJnYlRvSGV4KHJnYjogUkdCKTogSGV4IHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvcmUudmFsaWRhdGVDb2xvclZhbHVlcyhyZ2IpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIFJHQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHJnYil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5oZXgpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZFJHQiA9IGNvcmUuY2xvbmUocmdiKTtcblxuXHRcdGlmIChcblx0XHRcdFtcblx0XHRcdFx0Y2xvbmVkUkdCLnZhbHVlLnJlZCxcblx0XHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmdyZWVuLFxuXHRcdFx0XHRjbG9uZWRSR0IudmFsdWUuYmx1ZVxuXHRcdFx0XS5zb21lKHYgPT4gaXNOYU4odikgfHwgdiA8IDAgfHwgdiA+IDI1NSkgfHxcblx0XHRcdFtjbG9uZWRSR0IudmFsdWUuYWxwaGFdLnNvbWUodiA9PiBpc05hTih2KSB8fCB2IDwgMCB8fCB2ID4gMSlcblx0XHQpIHtcblx0XHRcdGNvbnNvbGUud2Fybihcblx0XHRcdFx0YEludmFsaWQgUkdCIHZhbHVlczogUj0ke0pTT04uc3RyaW5naWZ5KGNsb25lZFJHQi52YWx1ZS5yZWQpfSwgRz0ke0pTT04uc3RyaW5naWZ5KGNsb25lZFJHQi52YWx1ZS5ncmVlbil9LCBCPSR7SlNPTi5zdHJpbmdpZnkoY2xvbmVkUkdCLnZhbHVlLmJsdWUpfSwgQT0ke0pTT04uc3RyaW5naWZ5KGNsb25lZFJHQi52YWx1ZS5hbHBoYSl9YFxuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRoZXg6ICcjMDAwMDAwRkYnLFxuXHRcdFx0XHRcdGFscGhhOiAnRkYnLFxuXHRcdFx0XHRcdG51bUFscGhhOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hleCcgYXMgJ2hleCdcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGhleDogYCMke2NvbXBvbmVudFRvSGV4KGNsb25lZFJHQi52YWx1ZS5yZWQpfSR7Y29tcG9uZW50VG9IZXgoY2xvbmVkUkdCLnZhbHVlLmdyZWVuKX0ke2NvbXBvbmVudFRvSGV4KGNsb25lZFJHQi52YWx1ZS5ibHVlKX1gLFxuXHRcdFx0XHRhbHBoYTogY29tcG9uZW50VG9IZXgoY2xvbmVkUkdCLnZhbHVlLmFscGhhKSxcblx0XHRcdFx0bnVtQWxwaGE6IGNsb25lZFJHQi52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hleCcgYXMgJ2hleCdcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUud2FybihgcmdiVG9IZXggZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuaGV4KTtcblx0fVxufVxuXG5mdW5jdGlvbiByZ2JUb0hTTChyZ2I6IFJHQik6IEhTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMocmdiKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuaHNsKTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRSR0IgPSBjb3JlLmNsb25lKHJnYik7XG5cblx0XHRjbG9uZWRSR0IudmFsdWUucmVkIC89IDI1NTtcblx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4gLz0gMjU1O1xuXHRcdGNsb25lZFJHQi52YWx1ZS5ibHVlIC89IDI1NTtcblxuXHRcdGNvbnN0IG1heCA9IE1hdGgubWF4KFxuXHRcdFx0Y2xvbmVkUkdCLnZhbHVlLnJlZCxcblx0XHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbixcblx0XHRcdGNsb25lZFJHQi52YWx1ZS5ibHVlXG5cdFx0KTtcblx0XHRjb25zdCBtaW4gPSBNYXRoLm1pbihcblx0XHRcdGNsb25lZFJHQi52YWx1ZS5yZWQsXG5cdFx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4sXG5cdFx0XHRjbG9uZWRSR0IudmFsdWUuYmx1ZVxuXHRcdCk7XG5cblx0XHRsZXQgaHVlID0gMCxcblx0XHRcdHNhdHVyYXRpb24gPSAwLFxuXHRcdFx0bGlnaHRuZXNzID0gKG1heCArIG1pbikgLyAyO1xuXG5cdFx0aWYgKG1heCAhPT0gbWluKSB7XG5cdFx0XHRjb25zdCBkZWx0YSA9IG1heCAtIG1pbjtcblxuXHRcdFx0c2F0dXJhdGlvbiA9XG5cdFx0XHRcdGxpZ2h0bmVzcyA+IDAuNSA/IGRlbHRhIC8gKDIgLSBtYXggLSBtaW4pIDogZGVsdGEgLyAobWF4ICsgbWluKTtcblxuXHRcdFx0c3dpdGNoIChtYXgpIHtcblx0XHRcdFx0Y2FzZSBjbG9uZWRSR0IudmFsdWUucmVkOlxuXHRcdFx0XHRcdGh1ZSA9XG5cdFx0XHRcdFx0XHQoY2xvbmVkUkdCLnZhbHVlLmdyZWVuIC0gY2xvbmVkUkdCLnZhbHVlLmJsdWUpIC8gZGVsdGEgK1xuXHRcdFx0XHRcdFx0KGNsb25lZFJHQi52YWx1ZS5ncmVlbiA8IGNsb25lZFJHQi52YWx1ZS5ibHVlID8gNiA6IDApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIGNsb25lZFJHQi52YWx1ZS5ncmVlbjpcblx0XHRcdFx0XHRodWUgPVxuXHRcdFx0XHRcdFx0KGNsb25lZFJHQi52YWx1ZS5ibHVlIC0gY2xvbmVkUkdCLnZhbHVlLnJlZCkgLyBkZWx0YSArXG5cdFx0XHRcdFx0XHQyO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIGNsb25lZFJHQi52YWx1ZS5ibHVlOlxuXHRcdFx0XHRcdGh1ZSA9XG5cdFx0XHRcdFx0XHQoY2xvbmVkUkdCLnZhbHVlLnJlZCAtIGNsb25lZFJHQi52YWx1ZS5ncmVlbikgLyBkZWx0YSArXG5cdFx0XHRcdFx0XHQ0O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aHVlICo9IDYwO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6IE1hdGgucm91bmQoaHVlKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogTWF0aC5yb3VuZChzYXR1cmF0aW9uICogMTAwKSxcblx0XHRcdFx0bGlnaHRuZXNzOiBNYXRoLnJvdW5kKGxpZ2h0bmVzcyAqIDEwMCksXG5cdFx0XHRcdGFscGhhOiByZ2IudmFsdWUuYWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGByZ2JUb0hTTCgpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuY29sb3JzLmhzbCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9IU1YocmdiOiBSR0IpOiBIU1Yge1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKHJnYikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuY29sb3JzLmhzdik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkUkdCID0gY29yZS5jbG9uZShyZ2IpO1xuXG5cdFx0Y2xvbmVkUkdCLnZhbHVlLnJlZCAvPSAyNTU7XG5cdFx0Y2xvbmVkUkdCLnZhbHVlLmdyZWVuIC89IDI1NTtcblx0XHRjbG9uZWRSR0IudmFsdWUuYmx1ZSAvPSAyNTU7XG5cblx0XHRjb25zdCBtYXggPSBNYXRoLm1heChcblx0XHRcdGNsb25lZFJHQi52YWx1ZS5yZWQsXG5cdFx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4sXG5cdFx0XHRjbG9uZWRSR0IudmFsdWUuYmx1ZVxuXHRcdCk7XG5cdFx0Y29uc3QgbWluID0gTWF0aC5taW4oXG5cdFx0XHRjbG9uZWRSR0IudmFsdWUucmVkLFxuXHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmdyZWVuLFxuXHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWVcblx0XHQpO1xuXHRcdGNvbnN0IGRlbHRhID0gbWF4IC0gbWluO1xuXG5cdFx0bGV0IGh1ZSA9IDA7XG5cblx0XHRjb25zdCB2YWx1ZSA9IG1heDtcblx0XHRjb25zdCBzYXR1cmF0aW9uID0gbWF4ID09PSAwID8gMCA6IGRlbHRhIC8gbWF4O1xuXG5cdFx0aWYgKG1heCAhPT0gbWluKSB7XG5cdFx0XHRzd2l0Y2ggKG1heCkge1xuXHRcdFx0XHRjYXNlIGNsb25lZFJHQi52YWx1ZS5yZWQ6XG5cdFx0XHRcdFx0aHVlID1cblx0XHRcdFx0XHRcdChjbG9uZWRSR0IudmFsdWUuZ3JlZW4gLSBjbG9uZWRSR0IudmFsdWUuYmx1ZSkgLyBkZWx0YSArXG5cdFx0XHRcdFx0XHQoY2xvbmVkUkdCLnZhbHVlLmdyZWVuIDwgY2xvbmVkUkdCLnZhbHVlLmJsdWUgPyA2IDogMCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgY2xvbmVkUkdCLnZhbHVlLmdyZWVuOlxuXHRcdFx0XHRcdGh1ZSA9XG5cdFx0XHRcdFx0XHQoY2xvbmVkUkdCLnZhbHVlLmJsdWUgLSBjbG9uZWRSR0IudmFsdWUucmVkKSAvIGRlbHRhICtcblx0XHRcdFx0XHRcdDI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgY2xvbmVkUkdCLnZhbHVlLmJsdWU6XG5cdFx0XHRcdFx0aHVlID1cblx0XHRcdFx0XHRcdChjbG9uZWRSR0IudmFsdWUucmVkIC0gY2xvbmVkUkdCLnZhbHVlLmdyZWVuKSAvIGRlbHRhICtcblx0XHRcdFx0XHRcdDQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGh1ZSAqPSA2MDtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBNYXRoLnJvdW5kKGh1ZSksXG5cdFx0XHRcdHNhdHVyYXRpb246IE1hdGgucm91bmQoc2F0dXJhdGlvbiAqIDEwMCksXG5cdFx0XHRcdHZhbHVlOiBNYXRoLnJvdW5kKHZhbHVlICogMTAwKSxcblx0XHRcdFx0YWxwaGE6IHJnYi52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYHJnYlRvSFNWKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuaHN2KTtcblx0fVxufVxuXG5mdW5jdGlvbiByZ2JUb1hZWihyZ2I6IFJHQik6IFhZWiB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMocmdiKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMueHl6KTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRSR0IgPSBjb3JlLmNsb25lKHJnYik7XG5cblx0XHRjbG9uZWRSR0IudmFsdWUucmVkID0gY2xvbmVkUkdCLnZhbHVlLnJlZCAvIDI1NTtcblx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4gPSBjbG9uZWRSR0IudmFsdWUuZ3JlZW4gLyAyNTU7XG5cdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWUgPSBjbG9uZWRSR0IudmFsdWUuYmx1ZSAvIDI1NTtcblxuXHRcdGNsb25lZFJHQi52YWx1ZS5yZWQgPVxuXHRcdFx0Y2xvbmVkUkdCLnZhbHVlLnJlZCA+IDAuMDQwNDVcblx0XHRcdFx0PyBNYXRoLnBvdygoY2xvbmVkUkdCLnZhbHVlLnJlZCArIDAuMDU1KSAvIDEuMDU1LCAyLjQpXG5cdFx0XHRcdDogY2xvbmVkUkdCLnZhbHVlLnJlZCAvIDEyLjkyO1xuXHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbiA9XG5cdFx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4gPiAwLjA0MDQ1XG5cdFx0XHRcdD8gTWF0aC5wb3coKGNsb25lZFJHQi52YWx1ZS5ncmVlbiArIDAuMDU1KSAvIDEuMDU1LCAyLjQpXG5cdFx0XHRcdDogY2xvbmVkUkdCLnZhbHVlLmdyZWVuIC8gMTIuOTI7XG5cdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWUgPVxuXHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWUgPiAwLjA0MDQ1XG5cdFx0XHRcdD8gTWF0aC5wb3coKGNsb25lZFJHQi52YWx1ZS5ibHVlICsgMC4wNTUpIC8gMS4wNTUsIDIuNClcblx0XHRcdFx0OiBjbG9uZWRSR0IudmFsdWUuYmx1ZSAvIDEyLjkyO1xuXG5cdFx0Y2xvbmVkUkdCLnZhbHVlLnJlZCA9IGNsb25lZFJHQi52YWx1ZS5yZWQgKiAxMDA7XG5cdFx0Y2xvbmVkUkdCLnZhbHVlLmdyZWVuID0gY2xvbmVkUkdCLnZhbHVlLmdyZWVuICogMTAwO1xuXHRcdGNsb25lZFJHQi52YWx1ZS5ibHVlID0gY2xvbmVkUkdCLnZhbHVlLmJsdWUgKiAxMDA7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0eDpcblx0XHRcdFx0XHRjbG9uZWRSR0IudmFsdWUucmVkICogMC40MTI0ICtcblx0XHRcdFx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4gKiAwLjM1NzYgK1xuXHRcdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5ibHVlICogMC4xODA1LFxuXHRcdFx0XHR5OlxuXHRcdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5yZWQgKiAwLjIxMjYgK1xuXHRcdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbiAqIDAuNzE1MiArXG5cdFx0XHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWUgKiAwLjA3MjIsXG5cdFx0XHRcdHo6XG5cdFx0XHRcdFx0Y2xvbmVkUkdCLnZhbHVlLnJlZCAqIDAuMDE5MyArXG5cdFx0XHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmdyZWVuICogMC4xMTkyICtcblx0XHRcdFx0XHRjbG9uZWRSR0IudmFsdWUuYmx1ZSAqIDAuOTUwNSxcblx0XHRcdFx0YWxwaGE6IHJnYi52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYHJnYlRvWFlaIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuY29sb3JzLnh5eik7XG5cdH1cbn1cblxuZnVuY3Rpb24geHl6VG9MQUIoeHl6OiBYWVopOiBMQUIge1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZUNvbG9yVmFsdWVzKHh5eikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgWFlaIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoeHl6KX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuY29sb3JzLmxhYik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkWFlaID0gY29yZS5jbG9uZSh4eXopO1xuXHRcdGNvbnN0IHJlZlggPSA5NS4wNDcsXG5cdFx0XHRyZWZZID0gMTAwLjAsXG5cdFx0XHRyZWZaID0gMTA4Ljg4MztcblxuXHRcdGNsb25lZFhZWi52YWx1ZS54ID0gY2xvbmVkWFlaLnZhbHVlLnggLyByZWZYO1xuXHRcdGNsb25lZFhZWi52YWx1ZS55ID0gY2xvbmVkWFlaLnZhbHVlLnkgLyByZWZZO1xuXHRcdGNsb25lZFhZWi52YWx1ZS56ID0gY2xvbmVkWFlaLnZhbHVlLnogLyByZWZaO1xuXG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnggPVxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnggPiAwLjAwODg1NlxuXHRcdFx0XHQ/IE1hdGgucG93KGNsb25lZFhZWi52YWx1ZS54LCAxIC8gMylcblx0XHRcdFx0OiA3Ljc4NyAqIGNsb25lZFhZWi52YWx1ZS54ICsgMTYgLyAxMTY7XG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnkgPVxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnkgPiAwLjAwODg1NlxuXHRcdFx0XHQ/IE1hdGgucG93KGNsb25lZFhZWi52YWx1ZS55LCAxIC8gMylcblx0XHRcdFx0OiA3Ljc4NyAqIGNsb25lZFhZWi52YWx1ZS55ICsgMTYgLyAxMTY7XG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnogPVxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnogPiAwLjAwODg1NlxuXHRcdFx0XHQ/IE1hdGgucG93KGNsb25lZFhZWi52YWx1ZS56LCAxIC8gMylcblx0XHRcdFx0OiA3Ljc4NyAqIGNsb25lZFhZWi52YWx1ZS56ICsgMTYgLyAxMTY7XG5cblx0XHRjb25zdCBsID0gY29yZS5zYW5pdGl6ZVBlcmNlbnRhZ2UoXG5cdFx0XHRwYXJzZUZsb2F0KCgxMTYgKiBjbG9uZWRYWVoudmFsdWUueSAtIDE2KS50b0ZpeGVkKDIpKVxuXHRcdCk7XG5cdFx0Y29uc3QgYSA9IGNvcmUuc2FuaXRpemVMQUIoXG5cdFx0XHRwYXJzZUZsb2F0KFxuXHRcdFx0XHQoNTAwICogKGNsb25lZFhZWi52YWx1ZS54IC0gY2xvbmVkWFlaLnZhbHVlLnkpKS50b0ZpeGVkKDIpXG5cdFx0XHQpXG5cdFx0KTtcblx0XHRjb25zdCBiID0gY29yZS5zYW5pdGl6ZUxBQihcblx0XHRcdHBhcnNlRmxvYXQoXG5cdFx0XHRcdCgyMDAgKiAoY2xvbmVkWFlaLnZhbHVlLnkgLSBjbG9uZWRYWVoudmFsdWUueikpLnRvRml4ZWQoMilcblx0XHRcdClcblx0XHQpO1xuXHRcdGNvbnN0IGxhYjogTEFCID0ge1xuXHRcdFx0dmFsdWU6IHsgbCwgYSwgYiwgYWxwaGE6IHh5ei52YWx1ZS5hbHBoYSB9LFxuXHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdH07XG5cblx0XHRpZiAoIWNvcmUudmFsaWRhdGVDb2xvclZhbHVlcyhsYWIpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIExBQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGxhYil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5sYWIpO1xuXHRcdH1cblxuXHRcdHJldHVybiBsYWI7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgeHl6VG9MYWIoKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5sYWIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHh5elRvSFNMKHh5ejogWFlaKTogSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvcmUudmFsaWRhdGVDb2xvclZhbHVlcyh4eXopKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIFhZWiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHh5eil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5oc2wpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZ2JUb0hTTCh4eXpUb1JHQihjb3JlLmNsb25lKHh5eikpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGB4eXpUb0hTTCgpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuY29sb3JzLmhzbCk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHh5elRvUkdCKHh5ejogWFlaKTogUkdCIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvcmUudmFsaWRhdGVDb2xvclZhbHVlcyh4eXopKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIFhZWiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHh5eil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5yZ2IpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZFhZWiA9IGNvcmUuY2xvbmUoeHl6KTtcblxuXHRcdGNsb25lZFhZWi52YWx1ZS54IC89IDEwMDtcblx0XHRjbG9uZWRYWVoudmFsdWUueSAvPSAxMDA7XG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnogLz0gMTAwO1xuXG5cdFx0bGV0IHJlZCA9XG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueCAqIDMuMjQwNiArXG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueSAqIC0xLjUzNzIgK1xuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnogKiAtMC40OTg2O1xuXHRcdGxldCBncmVlbiA9XG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueCAqIC0wLjk2ODkgK1xuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnkgKiAxLjg3NTggK1xuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnogKiAwLjA0MTU7XG5cdFx0bGV0IGJsdWUgPVxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnggKiAwLjA1NTcgK1xuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnkgKiAtMC4yMDQgK1xuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnogKiAxLjA1NztcblxuXHRcdHJlZCA9IGFwcGx5R2FtbWFDb3JyZWN0aW9uKHJlZCk7XG5cdFx0Z3JlZW4gPSBhcHBseUdhbW1hQ29ycmVjdGlvbihncmVlbik7XG5cdFx0Ymx1ZSA9IGFwcGx5R2FtbWFDb3JyZWN0aW9uKGJsdWUpO1xuXG5cdFx0cmV0dXJuIGNsYW1wUkdCKHtcblx0XHRcdHZhbHVlOiB7IHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhOiB4eXoudmFsdWUuYWxwaGEgfSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGB4eXpUb1JHQiBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5yZ2IpO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBjb252ZXJ0ID0ge1xuXHRjbXlrVG9IU0wsXG5cdGhleFRvSFNMLFxuXHRoc2xUb0NNWUssXG5cdGhzbFRvSGV4LFxuXHRoc2xUb0hTVixcblx0aHNsVG9MQUIsXG5cdGhzbFRvUkdCLFxuXHRoc2xUb1NMLFxuXHRoc2xUb1NWLFxuXHRoc2xUb1hZWixcblx0aHN2VG9IU0wsXG5cdGhzdlRvU1YsXG5cdGxhYlRvSFNMLFxuXHRsYWJUb1hZWixcblx0cmdiVG9DTVlLLFxuXHRyZ2JUb0hleCxcblx0cmdiVG9IU0wsXG5cdHJnYlRvSFNWLFxuXHRyZ2JUb1hZWixcblx0eHl6VG9IU0wsXG5cdHh5elRvTEFCXG59O1xuXG5leHBvcnQgY29uc3Qgd3JhcHBlcnMgPSB7IGhleFRvSFNMOiBoZXhUb0hTTFdyYXBwZXIgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIGhzbFRvKGNvbG9yOiBIU0wsIGNvbG9yU3BhY2U6IENvbG9yU3BhY2VFeHRlbmRlZCk6IENvbG9yIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvcmUudmFsaWRhdGVDb2xvclZhbHVlcyhjb2xvcikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgY29sb3IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5yZ2IpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZENvbG9yID0gY29yZS5jbG9uZShjb2xvcikgYXMgSFNMO1xuXG5cdFx0c3dpdGNoIChjb2xvclNwYWNlKSB7XG5cdFx0XHRjYXNlICdjbXlrJzpcblx0XHRcdFx0cmV0dXJuIGhzbFRvQ01ZSyhjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9IZXgoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y2FzZSAnaHNsJzpcblx0XHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGhzbFRvSFNWKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBoc2xUb0xBQihjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9SR0IoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y2FzZSAnc2wnOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9TTChjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdzdic6XG5cdFx0XHRcdHJldHVybiBoc2xUb1NWKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdHJldHVybiBoc2xUb1hZWihjbG9uZWRDb2xvcik7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29sb3IgZm9ybWF0Jyk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgaHNsVG8oKSBlcnJvcjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9IU0woY29sb3I6IEV4Y2x1ZGU8Q29sb3IsIFNMIHwgU1Y+KTogSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvcmUudmFsaWRhdGVDb2xvclZhbHVlcyhjb2xvcikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgY29sb3IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5oc2wpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZENvbG9yID0gY29yZS5jbG9uZShjb2xvcik7XG5cblx0XHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdHJldHVybiBjbXlrVG9IU0woY2xvbmVkQ29sb3IgYXMgQ01ZSyk7XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRyZXR1cm4gaGV4VG9IU0woY2xvbmVkQ29sb3IgYXMgSGV4KTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiBjb3JlLmNsb25lKGNsb25lZENvbG9yIGFzIEhTTCk7XG5cdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRyZXR1cm4gaHN2VG9IU0woY2xvbmVkQ29sb3IgYXMgSFNWKTtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBsYWJUb0hTTChjbG9uZWRDb2xvciBhcyBMQUIpO1xuXHRcdFx0Y2FzZSAncmdiJzpcblx0XHRcdFx0cmV0dXJuIHJnYlRvSFNMKGNsb25lZENvbG9yIGFzIFJHQik7XG5cdFx0XHRjYXNlICd4eXonOlxuXHRcdFx0XHRyZXR1cm4geHl6VG9IU0woY2xvbmVkQ29sb3IgYXMgWFlaKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2xvciBmb3JtYXQnKTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGB0b0hTTCgpIGVycm9yOiAke2Vycm9yfWApO1xuXHR9XG59XG4iXX0=