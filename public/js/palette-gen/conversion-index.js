import { defaults } from '../config/defaults.js';
import { conversionHelpers } from '../helpers/conversion.js';
import { colorUtils } from '../utils/color-utils.js';
import { commonUtils } from '../utils/common-utils.js';
import { core } from '../utils/core-utils.js';
function cmykToHSL(cmyk) {
    try {
        if (!commonUtils.validateColorValues(cmyk)) {
            console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);
            return core.clone(defaults.hsl);
        }
        return rgbToHSL(cmykToRGB(core.clone(cmyk)));
    }
    catch (error) {
        console.error(`cmykToHSL() error: ${error}`);
        return core.clone(defaults.hsl);
    }
}
export function cmykToRGB(cmyk) {
    try {
        if (!commonUtils.validateColorValues(cmyk)) {
            console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);
            return core.clone(defaults.rgb);
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
        return conversionHelpers.clampRGB(rgb);
    }
    catch (error) {
        console.error(`cmykToRGB error: ${error}`);
        return core.clone(defaults.rgb);
    }
}
function hexToHSL(hex) {
    try {
        if (!commonUtils.validateColorValues(hex)) {
            console.error(`Invalid Hex value ${JSON.stringify(hex)}`);
            return core.clone(defaults.hsl);
        }
        return rgbToHSL(hexToRGB(core.clone(hex)));
    }
    catch (error) {
        console.error(`hexToHSL() error: ${error}`);
        return core.clone(defaults.hsl);
    }
}
export function hexToRGB(hex) {
    try {
        if (!commonUtils.validateColorValues(hex)) {
            console.error(`Invalid Hex value ${JSON.stringify(hex)}`);
            return core.clone(defaults.rgb);
        }
        const clonedHex = core.clone(hex);
        const strippedHex = colorUtils.stripHashFromHex(clonedHex).value.hex;
        const bigint = parseInt(strippedHex, 16);
        return {
            value: {
                red: (bigint >> 16) & 255,
                green: (bigint >> 8) & 255,
                blue: bigint & 255,
                alpha: hex.value.numericAlpha
            },
            format: 'rgb'
        };
    }
    catch (error) {
        console.error(`hexToRGB error: ${error}`);
        return core.clone(defaults.rgb);
    }
}
function hslToCMYK(hsl) {
    try {
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.cmyk);
        }
        return rgbToCMYK(hslToRGB(core.clone(hsl)));
    }
    catch (error) {
        console.error(`Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`);
        return core.clone(defaults.cmyk);
    }
}
function hslToHex(hsl) {
    try {
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.hex);
        }
        return rgbToHex(hslToRGB(core.clone(hsl)));
    }
    catch (error) {
        console.warn(`hslToHex error: ${error}`);
        return core.clone(defaults.hex);
    }
}
function hslToHSV(hsl) {
    try {
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.hsv);
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
        return core.clone(defaults.hsv);
    }
}
function hslToLAB(hsl) {
    try {
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.lab);
        }
        return xyzToLAB(rgbToXYZ(hslToRGB(core.clone(hsl))));
    }
    catch (error) {
        console.error(`hslToLab() error: ${error}`);
        return core.clone(defaults.lab);
    }
}
export function hslToRGB(hsl) {
    try {
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.rgb);
        }
        const clonedHSL = core.clone(hsl);
        const s = clonedHSL.value.saturation / 100;
        const l = clonedHSL.value.lightness / 100;
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        return {
            value: {
                red: Math.round(conversionHelpers.hueToRGB(p, q, clonedHSL.value.hue + 1 / 3) * 255),
                green: Math.round(conversionHelpers.hueToRGB(p, q, clonedHSL.value.hue) * 255),
                blue: Math.round(conversionHelpers.hueToRGB(p, q, clonedHSL.value.hue - 1 / 3) * 255),
                alpha: hsl.value.alpha
            },
            format: 'rgb'
        };
    }
    catch (error) {
        console.error(`hslToRGB error: ${error}`);
        return core.clone(defaults.rgb);
    }
}
function hslToSL(hsl) {
    try {
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.sl);
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
        return defaults.sl;
    }
}
function hslToSV(hsl) {
    try {
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.sv);
        }
        return hsvToSV(rgbToHSV(hslToRGB(core.clone(hsl))));
    }
    catch (error) {
        console.error(`Error converting HSL to SV: ${error}`);
        return defaults.sv;
    }
}
function hslToXYZ(hsl) {
    try {
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.xyz);
        }
        return labToXYZ(hslToLAB(core.clone(hsl)));
    }
    catch (error) {
        console.error(`hslToXYZ error: ${error}`);
        return core.clone(defaults.xyz);
    }
}
function hsvToHSL(hsv) {
    try {
        if (!commonUtils.validateColorValues(hsv)) {
            console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);
            return core.clone(defaults.hsl);
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
        return core.clone(defaults.hsl);
    }
}
function hsvToSV(hsv) {
    try {
        if (!commonUtils.validateColorValues(hsv)) {
            console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);
            return core.clone(defaults.sv);
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
        return defaults.sv;
    }
}
function labToHSL(lab) {
    try {
        if (!commonUtils.validateColorValues(lab)) {
            console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaults.hsl);
        }
        return rgbToHSL(labToRGB(core.clone(lab)));
    }
    catch (error) {
        console.error(`labToHSL() error: ${error}`);
        return core.clone(defaults.hsl);
    }
}
export function labToRGB(lab) {
    try {
        if (!commonUtils.validateColorValues(lab)) {
            console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaults.rgb);
        }
        return xyzToRGB(labToXYZ(core.clone(lab)));
    }
    catch (error) {
        console.error(`labToRGB error: ${error}`);
        return core.clone(defaults.rgb);
    }
}
function labToXYZ(lab) {
    try {
        if (!commonUtils.validateColorValues(lab)) {
            console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaults.xyz);
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
        return core.clone(defaults.xyz);
    }
}
function rgbToCMYK(rgb) {
    try {
        if (!commonUtils.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.cmyk);
        }
        const clonedRGB = core.clone(rgb);
        const redPrime = clonedRGB.value.red / 255;
        const greenPrime = clonedRGB.value.green / 255;
        const bluePrime = clonedRGB.value.blue / 255;
        const key = commonUtils.sanitizePercentage(1 - Math.max(redPrime, greenPrime, bluePrime));
        const cyan = commonUtils.sanitizePercentage((1 - redPrime - key) / (1 - key) || 0);
        const magenta = commonUtils.sanitizePercentage((1 - greenPrime - key) / (1 - key) || 0);
        const yellow = commonUtils.sanitizePercentage((1 - bluePrime - key) / (1 - key) || 0);
        const alpha = rgb.value.alpha;
        const format = 'cmyk';
        const cmyk = { value: { cyan, magenta, yellow, key, alpha }, format };
        console.log(`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(core.clone(cmyk))}`);
        return cmyk;
    }
    catch (error) {
        console.error(`Error converting RGB to CMYK: ${error}`);
        return core.clone(defaults.cmyk);
    }
}
function rgbToHex(rgb) {
    try {
        if (!commonUtils.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.hex);
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
                    numericAlpha: 1
                },
                format: 'hex'
            };
        }
        return {
            value: {
                hex: `#${colorUtils.componentToHex(clonedRGB.value.red)}${colorUtils.componentToHex(clonedRGB.value.green)}${colorUtils.componentToHex(clonedRGB.value.blue)}`,
                alpha: colorUtils.componentToHex(clonedRGB.value.alpha),
                numericAlpha: clonedRGB.value.alpha
            },
            format: 'hex'
        };
    }
    catch (error) {
        console.warn(`rgbToHex error: ${error}`);
        return core.clone(defaults.hex);
    }
}
function rgbToHSL(rgb) {
    try {
        if (!commonUtils.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.hsl);
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
        return core.clone(defaults.hsl);
    }
}
function rgbToHSV(rgb) {
    try {
        if (!commonUtils.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.hsv);
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
        return core.clone(defaults.hsv);
    }
}
function rgbToXYZ(rgb) {
    try {
        if (!commonUtils.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.xyz);
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
        return core.clone(defaults.xyz);
    }
}
function xyzToLAB(xyz) {
    try {
        if (!commonUtils.validateColorValues(xyz)) {
            console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaults.lab);
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
        const l = commonUtils.sanitizePercentage(parseFloat((116 * clonedXYZ.value.y - 16).toFixed(2)));
        const a = commonUtils.sanitizeLAB(parseFloat((500 * (clonedXYZ.value.x - clonedXYZ.value.y)).toFixed(2)));
        const b = commonUtils.sanitizeLAB(parseFloat((200 * (clonedXYZ.value.y - clonedXYZ.value.z)).toFixed(2)));
        const lab = {
            value: { l, a, b, alpha: xyz.value.alpha },
            format: 'lab'
        };
        if (!commonUtils.validateColorValues(lab)) {
            console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaults.lab);
        }
        return lab;
    }
    catch (error) {
        console.error(`xyzToLab() error: ${error}`);
        return core.clone(defaults.lab);
    }
}
function xyzToHSL(xyz) {
    try {
        if (!commonUtils.validateColorValues(xyz)) {
            console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaults.hsl);
        }
        return rgbToHSL(xyzToRGB(core.clone(xyz)));
    }
    catch (error) {
        console.error(`xyzToHSL() error: ${error}`);
        return core.clone(defaults.hsl);
    }
}
export function xyzToRGB(xyz) {
    try {
        if (!commonUtils.validateColorValues(xyz)) {
            console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaults.rgb);
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
        red = conversionHelpers.applyGammaCorrection(red);
        green = conversionHelpers.applyGammaCorrection(green);
        blue = conversionHelpers.applyGammaCorrection(blue);
        return conversionHelpers.clampRGB({
            value: { red, green, blue, alpha: xyz.value.alpha },
            format: 'rgb'
        });
    }
    catch (error) {
        console.error(`xyzToRGB error: ${error}`);
        return core.clone(defaults.rgb);
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
export function hslTo(color, colorSpace) {
    try {
        if (!commonUtils.validateColorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return core.clone(defaults.rgb);
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
        if (!commonUtils.validateColorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return core.clone(defaults.hsl);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVyc2lvbi1pbmRleC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYWxldHRlLWdlbi9jb252ZXJzaW9uLWluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUcxRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3BELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUUzQyxTQUFTLFNBQVMsQ0FBQyxJQUFpQjtJQUNuQyxJQUFJLENBQUM7UUFDSixJQUFJLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDNUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFNUQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxDQUFDO1FBRUQsT0FBTyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFN0MsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQyxDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sVUFBVSxTQUFTLENBQUMsSUFBaUI7SUFDMUMsSUFBSSxDQUFDO1FBQ0osSUFBSSxD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LEVBQUUsQ0FBQztZQUM3QyxPQUFPLENBQUMsS0FBSyxDQUFDLHVCQUF1QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUU5RCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7UUFFRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRDLFFBQVEsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3RCLEtBQUssTUFBTTtnQkFDVixPQUFPLFNBQVMsQ0FBQyxXQUEwQixDQUFDLENBQUM7WUFDOUMsS0FBSyxLQUFLO2dCQUNULE9BQU8sUUFBUSxDQUFDLFdBQXlCLENBQUMsQ0FBQztZQUM1QyxLQUFLLEtBQUs7Z0JBQ1QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQXlCLENBQUMsQ0FBQztZQUM5QyxLQUFLLEtBQUs7Z0JBQ1QsT0FBTyxRQUFRLENBQUMsV0FBeUIsQ0FBQyxDQUFDO1lBQzVDLEtBQUssS0FBSztnQkFDVCxPQUFPLFFBQVEsQ0FBQyxXQUF5QixDQUFDLENBQUM7WUFDNUMsS0FBSyxLQUFLO2dCQUNULE9BQU8sUUFBUSxDQUFDLFdBQXlCLENBQUMsQ0FBQztZQUM1QyxLQUFLLEtBQUs7Z0JBQ1QsT0FBTyxRQUFRLENBQUMsV0FBeUIsQ0FBQyxDQUFDO1lBQzVDO2dCQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUMxQyxDQUFDO0lBQ0YsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUM1QyxDQUFDO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlZmF1bHRzIH0gZnJvbSAnLi4vY29uZmlnL2RlZmF1bHRzJztcbmltcG9ydCB7IGNvbnZlcnNpb25IZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycy9jb252ZXJzaW9uJztcbmltcG9ydCAqIGFzIGNvbG9ycyBmcm9tICcuLi9pbmRleC9jb2xvcnMnO1xuaW1wb3J0ICogYXMgZm5PYmplY3RzIGZyb20gJy4uL2luZGV4L2ZuLW9iamVjdHMnO1xuaW1wb3J0IHsgY29sb3JVdGlscyB9IGZyb20gJy4uL3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCB7IGNvbW1vblV0aWxzIH0gZnJvbSAnLi4vdXRpbHMvY29tbW9uLXV0aWxzJztcbmltcG9ydCB7IGNvcmUgfSBmcm9tICcuLi91dGlscy9jb3JlLXV0aWxzJztcblxuZnVuY3Rpb24gY215a1RvSFNMKGNteWs6IGNvbG9ycy5DTVlLKTogY29sb3JzLkhTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb21tb25VdGlscy52YWxpZGF0ZUNvbG9yVmFsdWVzKGNteWspKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIENNWUsgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjbXlrKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuaHNsKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IU0woY215a1RvUkdCKGNvcmUuY2xvbmUoY215aykpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBjbXlrVG9IU0woKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmhzbCk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNteWtUb1JHQihjbXlrOiBjb2xvcnMuQ01ZSyk6IGNvbG9ycy5SR0Ige1xuXHR0cnkge1xuXHRcdGlmICghY29tbW9uVXRpbHMudmFsaWRhdGVDb2xvclZhbHVlcyhjbXlrKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBDTVlLIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY215ayl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLnJnYik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkQ01ZSyA9IGNvcmUuY2xvbmUoY215ayk7XG5cdFx0Y29uc3QgciA9XG5cdFx0XHQyNTUgKlxuXHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLmN5YW4gLyAxMDApICpcblx0XHRcdCgxIC0gY2xvbmVkQ01ZSy52YWx1ZS5rZXkgLyAxMDApO1xuXHRcdGNvbnN0IGcgPVxuXHRcdFx0MjU1ICpcblx0XHRcdCgxIC0gY2xvbmVkQ01ZSy52YWx1ZS5tYWdlbnRhIC8gMTAwKSAqXG5cdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUua2V5IC8gMTAwKTtcblx0XHRjb25zdCBiID1cblx0XHRcdDI1NSAqXG5cdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUueWVsbG93IC8gMTAwKSAqXG5cdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUua2V5IC8gMTAwKTtcblx0XHRjb25zdCBhbHBoYSA9IGNteWsudmFsdWUuYWxwaGE7XG5cdFx0Y29uc3QgcmdiOiBjb2xvcnMuUkdCID0ge1xuXHRcdFx0dmFsdWU6IHsgcmVkOiByLCBncmVlbjogZywgYmx1ZTogYiwgYWxwaGEgfSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9O1xuXG5cdFx0cmV0dXJuIGNvbnZlcnNpb25IZWxwZXJzLmNsYW1wUkdCKHJnYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgY215a1RvUkdCIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMucmdiKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoZXhUb0hTTChoZXg6IGNvbG9ycy5IZXgpOiBjb2xvcnMuSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvbW1vblV0aWxzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaGV4KSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIZXggdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoZXgpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5oc2wpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZ2JUb0hTTChoZXhUb1JHQihjb3JlLmNsb25lKGhleCkpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBoZXhUb0hTTCgpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuaHNsKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGV4VG9SR0IoaGV4OiBjb2xvcnMuSGV4KTogY29sb3JzLlJHQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb21tb25VdGlscy52YWxpZGF0ZUNvbG9yVmFsdWVzKGhleCkpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSGV4IHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaGV4KX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMucmdiKTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRIZXggPSBjb3JlLmNsb25lKGhleCk7XG5cdFx0Y29uc3Qgc3RyaXBwZWRIZXggPSBjb2xvclV0aWxzLnN0cmlwSGFzaEZyb21IZXgoY2xvbmVkSGV4KS52YWx1ZS5oZXg7XG5cdFx0Y29uc3QgYmlnaW50ID0gcGFyc2VJbnQoc3RyaXBwZWRIZXgsIDE2KTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRyZWQ6IChiaWdpbnQgPj4gMTYpICYgMjU1LFxuXHRcdFx0XHRncmVlbjogKGJpZ2ludCA+PiA4KSAmIDI1NSxcblx0XHRcdFx0Ymx1ZTogYmlnaW50ICYgMjU1LFxuXHRcdFx0XHRhbHBoYTogaGV4LnZhbHVlLm51bWVyaWNBbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGhleFRvUkdCIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMucmdiKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb0NNWUsoaHNsOiBjb2xvcnMuSFNMKTogY29sb3JzLkNNWUsge1xuXHR0cnkge1xuXHRcdGlmICghY29tbW9uVXRpbHMudmFsaWRhdGVDb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmNteWspO1xuXHRcdH1cblxuXHRcdHJldHVybiByZ2JUb0NNWUsoaHNsVG9SR0IoY29yZS5jbG9uZShoc2wpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdGBFcnJvciBjb252ZXJ0aW5nIEhTTCAke0pTT04uc3RyaW5naWZ5KGhzbCl9IHRvIENNWUs6ICR7ZXJyb3J9YFxuXHRcdCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jbXlrKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb0hleChoc2w6IGNvbG9ycy5IU0wpOiBjb2xvcnMuSGV4IHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvbW1vblV0aWxzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5oZXgpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZ2JUb0hleChoc2xUb1JHQihjb3JlLmNsb25lKGhzbCkpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLndhcm4oYGhzbFRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuaGV4KTtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb0hTVihoc2w6IGNvbG9ycy5IU0wpOiBjb2xvcnMuSFNWIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvbW1vblV0aWxzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5oc3YpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZEhTTCA9IGNvcmUuY2xvbmUoaHNsKTtcblx0XHRjb25zdCBzID0gY2xvbmVkSFNMLnZhbHVlLnNhdHVyYXRpb24gLyAxMDA7XG5cdFx0Y29uc3QgbCA9IGNsb25lZEhTTC52YWx1ZS5saWdodG5lc3MgLyAxMDA7XG5cdFx0Y29uc3QgdmFsdWUgPSBsICsgcyAqIE1hdGgubWluKGwsIDEgLSAxKTtcblx0XHRjb25zdCBuZXdTYXR1cmF0aW9uID0gdmFsdWUgPT09IDAgPyAwIDogMiAqICgxIC0gbCAvIHZhbHVlKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6IE1hdGgucm91bmQoY2xvbmVkSFNMLnZhbHVlLmh1ZSksXG5cdFx0XHRcdHNhdHVyYXRpb246IE1hdGgucm91bmQobmV3U2F0dXJhdGlvbiAqIDEwMCksXG5cdFx0XHRcdHZhbHVlOiBNYXRoLnJvdW5kKHZhbHVlICogMTAwKSxcblx0XHRcdFx0YWxwaGE6IGhzbC52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGhzbFRvSFNWKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5oc3YpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvTEFCKGhzbDogY29sb3JzLkhTTCk6IGNvbG9ycy5MQUIge1xuXHR0cnkge1xuXHRcdGlmICghY29tbW9uVXRpbHMudmFsaWRhdGVDb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmxhYik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHh5elRvTEFCKHJnYlRvWFlaKGhzbFRvUkdCKGNvcmUuY2xvbmUoaHNsKSkpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBoc2xUb0xhYigpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMubGFiKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaHNsVG9SR0IoaHNsOiBjb2xvcnMuSFNMKTogY29sb3JzLlJHQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb21tb25VdGlscy52YWxpZGF0ZUNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMucmdiKTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRIU0wgPSBjb3JlLmNsb25lKGhzbCk7XG5cdFx0Y29uc3QgcyA9IGNsb25lZEhTTC52YWx1ZS5zYXR1cmF0aW9uIC8gMTAwO1xuXHRcdGNvbnN0IGwgPSBjbG9uZWRIU0wudmFsdWUubGlnaHRuZXNzIC8gMTAwO1xuXHRcdGNvbnN0IHEgPSBsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzO1xuXHRcdGNvbnN0IHAgPSAyICogbCAtIHE7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0cmVkOiBNYXRoLnJvdW5kKFxuXHRcdFx0XHRcdGNvbnZlcnNpb25IZWxwZXJzLmh1ZVRvUkdCKFxuXHRcdFx0XHRcdFx0cCxcblx0XHRcdFx0XHRcdHEsXG5cdFx0XHRcdFx0XHRjbG9uZWRIU0wudmFsdWUuaHVlICsgMSAvIDNcblx0XHRcdFx0XHQpICogMjU1XG5cdFx0XHRcdCksXG5cdFx0XHRcdGdyZWVuOiBNYXRoLnJvdW5kKFxuXHRcdFx0XHRcdGNvbnZlcnNpb25IZWxwZXJzLmh1ZVRvUkdCKHAsIHEsIGNsb25lZEhTTC52YWx1ZS5odWUpICogMjU1XG5cdFx0XHRcdCksXG5cdFx0XHRcdGJsdWU6IE1hdGgucm91bmQoXG5cdFx0XHRcdFx0Y29udmVyc2lvbkhlbHBlcnMuaHVlVG9SR0IoXG5cdFx0XHRcdFx0XHRwLFxuXHRcdFx0XHRcdFx0cSxcblx0XHRcdFx0XHRcdGNsb25lZEhTTC52YWx1ZS5odWUgLSAxIC8gM1xuXHRcdFx0XHRcdCkgKiAyNTVcblx0XHRcdFx0KSxcblx0XHRcdFx0YWxwaGE6IGhzbC52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGhzbFRvUkdCIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMucmdiKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb1NMKGhzbDogY29sb3JzLkhTTCk6IGNvbG9ycy5TTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb21tb25VdGlscy52YWxpZGF0ZUNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuc2wpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRzYXR1cmF0aW9uOiBoc2wudmFsdWUuc2F0dXJhdGlvbixcblx0XHRcdFx0bGlnaHRuZXNzOiBoc2wudmFsdWUubGlnaHRuZXNzLFxuXHRcdFx0XHRhbHBoYTogaHNsLnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnc2wnIGFzICdzbCdcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgSFNMIHRvIFNMOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRzLnNsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvU1YoaHNsOiBjb2xvcnMuSFNMKTogY29sb3JzLlNWIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvbW1vblV0aWxzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5zdik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGhzdlRvU1YocmdiVG9IU1YoaHNsVG9SR0IoY29yZS5jbG9uZShoc2wpKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgSFNMIHRvIFNWOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRzLnN2O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvWFlaKGhzbDogY29sb3JzLkhTTCk6IGNvbG9ycy5YWVoge1xuXHR0cnkge1xuXHRcdGlmICghY29tbW9uVXRpbHMudmFsaWRhdGVDb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLnh5eik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGxhYlRvWFlaKGhzbFRvTEFCKGNvcmUuY2xvbmUoaHNsKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGhzbFRvWFlaIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMueHl6KTtcblx0fVxufVxuXG5mdW5jdGlvbiBoc3ZUb0hTTChoc3Y6IGNvbG9ycy5IU1YpOiBjb2xvcnMuSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvbW1vblV0aWxzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoaHN2KSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU1YgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc3YpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5oc2wpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZEhTViA9IGNvcmUuY2xvbmUoaHN2KTtcblx0XHRjb25zdCBuZXdTYXR1cmF0aW9uID1cblx0XHRcdGNsb25lZEhTVi52YWx1ZS52YWx1ZSAqICgxIC0gY2xvbmVkSFNWLnZhbHVlLnNhdHVyYXRpb24gLyAxMDApID09PVxuXHRcdFx0XHQwIHx8IGNsb25lZEhTVi52YWx1ZS52YWx1ZSA9PT0gMFxuXHRcdFx0XHQ/IDBcblx0XHRcdFx0OiAoY2xvbmVkSFNWLnZhbHVlLnZhbHVlIC1cblx0XHRcdFx0XHRcdGNsb25lZEhTVi52YWx1ZS52YWx1ZSAqXG5cdFx0XHRcdFx0XHRcdCgxIC0gY2xvbmVkSFNWLnZhbHVlLnNhdHVyYXRpb24gLyAxMDApKSAvXG5cdFx0XHRcdFx0TWF0aC5taW4oXG5cdFx0XHRcdFx0XHRjbG9uZWRIU1YudmFsdWUudmFsdWUsXG5cdFx0XHRcdFx0XHQxMDAgLSBjbG9uZWRIU1YudmFsdWUudmFsdWVcblx0XHRcdFx0XHQpO1xuXHRcdGNvbnN0IGxpZ2h0bmVzcyA9XG5cdFx0XHRjbG9uZWRIU1YudmFsdWUudmFsdWUgKiAoMSAtIGNsb25lZEhTVi52YWx1ZS5zYXR1cmF0aW9uIC8gMjAwKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6IE1hdGgucm91bmQoY2xvbmVkSFNWLnZhbHVlLmh1ZSksXG5cdFx0XHRcdHNhdHVyYXRpb246IE1hdGgucm91bmQobmV3U2F0dXJhdGlvbiAqIDEwMCksXG5cdFx0XHRcdGxpZ2h0bmVzczogTWF0aC5yb3VuZChsaWdodG5lc3MpLFxuXHRcdFx0XHRhbHBoYTogaHN2LnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgaHN2VG9IU0woKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmhzbCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHN2VG9TVihoc3Y6IGNvbG9ycy5IU1YpOiBjb2xvcnMuU1Yge1xuXHR0cnkge1xuXHRcdGlmICghY29tbW9uVXRpbHMudmFsaWRhdGVDb2xvclZhbHVlcyhoc3YpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhTViB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzdil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLnN2KTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0c2F0dXJhdGlvbjogaHN2LnZhbHVlLnNhdHVyYXRpb24sXG5cdFx0XHRcdHZhbHVlOiBoc3YudmFsdWUudmFsdWUsXG5cdFx0XHRcdGFscGhhOiBoc3YudmFsdWUuYWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdzdicgYXMgJ3N2J1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBIU1YgdG8gU1Y6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdHMuc3Y7XG5cdH1cbn1cblxuZnVuY3Rpb24gbGFiVG9IU0wobGFiOiBjb2xvcnMuTEFCKTogY29sb3JzLkhTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb21tb25VdGlscy52YWxpZGF0ZUNvbG9yVmFsdWVzKGxhYikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuaHNsKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IU0wobGFiVG9SR0IoY29yZS5jbG9uZShsYWIpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgbGFiVG9IU0woKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmhzbCk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhYlRvUkdCKGxhYjogY29sb3JzLkxBQik6IGNvbG9ycy5SR0Ige1xuXHR0cnkge1xuXHRcdGlmICghY29tbW9uVXRpbHMudmFsaWRhdGVDb2xvclZhbHVlcyhsYWIpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIExBQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGxhYil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLnJnYik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHh5elRvUkdCKGxhYlRvWFlaKGNvcmUuY2xvbmUobGFiKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGxhYlRvUkdCIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMucmdiKTtcblx0fVxufVxuXG5mdW5jdGlvbiBsYWJUb1hZWihsYWI6IGNvbG9ycy5MQUIpOiBjb2xvcnMuWFlaIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvbW1vblV0aWxzLnZhbGlkYXRlQ29sb3JWYWx1ZXMobGFiKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBMQUIgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShsYWIpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy54eXopO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZExBQiA9IGNvcmUuY2xvbmUobGFiKTtcblx0XHRjb25zdCByZWZYID0gOTUuMDQ3LFxuXHRcdFx0cmVmWSA9IDEwMC4wLFxuXHRcdFx0cmVmWiA9IDEwOC44ODM7XG5cblx0XHRsZXQgeSA9IChjbG9uZWRMQUIudmFsdWUubCArIDE2KSAvIDExNjtcblx0XHRsZXQgeCA9IGNsb25lZExBQi52YWx1ZS5hIC8gNTAwICsgeTtcblx0XHRsZXQgeiA9IHkgLSBjbG9uZWRMQUIudmFsdWUuYiAvIDIwMDtcblxuXHRcdGNvbnN0IHBvdyA9IE1hdGgucG93O1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHg6XG5cdFx0XHRcdFx0cmVmWCAqXG5cdFx0XHRcdFx0KHBvdyh4LCAzKSA+IDAuMDA4ODU2ID8gcG93KHgsIDMpIDogKHggLSAxNiAvIDExNikgLyA3Ljc4NyksXG5cdFx0XHRcdHk6XG5cdFx0XHRcdFx0cmVmWSAqXG5cdFx0XHRcdFx0KHBvdyh5LCAzKSA+IDAuMDA4ODU2ID8gcG93KHksIDMpIDogKHkgLSAxNiAvIDExNikgLyA3Ljc4NyksXG5cdFx0XHRcdHo6XG5cdFx0XHRcdFx0cmVmWiAqXG5cdFx0XHRcdFx0KHBvdyh6LCAzKSA+IDAuMDA4ODU2ID8gcG93KHosIDMpIDogKHogLSAxNiAvIDExNikgLyA3Ljc4NyksXG5cdFx0XHRcdGFscGhhOiBsYWIudmFsdWUuYWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBsYWJUb1hZWiBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLnh5eik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9DTVlLKHJnYjogY29sb3JzLlJHQik6IGNvbG9ycy5DTVlLIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvbW1vblV0aWxzLnZhbGlkYXRlQ29sb3JWYWx1ZXMocmdiKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5jbXlrKTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRSR0IgPSBjb3JlLmNsb25lKHJnYik7XG5cblx0XHRjb25zdCByZWRQcmltZSA9IGNsb25lZFJHQi52YWx1ZS5yZWQgLyAyNTU7XG5cdFx0Y29uc3QgZ3JlZW5QcmltZSA9IGNsb25lZFJHQi52YWx1ZS5ncmVlbiAvIDI1NTtcblx0XHRjb25zdCBibHVlUHJpbWUgPSBjbG9uZWRSR0IudmFsdWUuYmx1ZSAvIDI1NTtcblxuXHRcdGNvbnN0IGtleSA9IGNvbW1vblV0aWxzLnNhbml0aXplUGVyY2VudGFnZShcblx0XHRcdDEgLSBNYXRoLm1heChyZWRQcmltZSwgZ3JlZW5QcmltZSwgYmx1ZVByaW1lKVxuXHRcdCk7XG5cdFx0Y29uc3QgY3lhbiA9IGNvbW1vblV0aWxzLnNhbml0aXplUGVyY2VudGFnZShcblx0XHRcdCgxIC0gcmVkUHJpbWUgLSBrZXkpIC8gKDEgLSBrZXkpIHx8IDBcblx0XHQpO1xuXHRcdGNvbnN0IG1hZ2VudGEgPSBjb21tb25VdGlscy5zYW5pdGl6ZVBlcmNlbnRhZ2UoXG5cdFx0XHQoMSAtIGdyZWVuUHJpbWUgLSBrZXkpIC8gKDEgLSBrZXkpIHx8IDBcblx0XHQpO1xuXHRcdGNvbnN0IHllbGxvdyA9IGNvbW1vblV0aWxzLnNhbml0aXplUGVyY2VudGFnZShcblx0XHRcdCgxIC0gYmx1ZVByaW1lIC0ga2V5KSAvICgxIC0ga2V5KSB8fCAwXG5cdFx0KTtcblx0XHRjb25zdCBhbHBoYTogbnVtYmVyID0gcmdiLnZhbHVlLmFscGhhO1xuXHRcdGNvbnN0IGZvcm1hdDogJ2NteWsnID0gJ2NteWsnO1xuXG5cdFx0Y29uc3QgY215ayA9IHsgdmFsdWU6IHsgY3lhbiwgbWFnZW50YSwgeWVsbG93LCBrZXksIGFscGhhIH0sIGZvcm1hdCB9O1xuXG5cdFx0Y29uc29sZS5sb2coXG5cdFx0XHRgQ29udmVydGVkIFJHQiAke0pTT04uc3RyaW5naWZ5KGNsb25lZFJHQil9IHRvIENNWUs6ICR7SlNPTi5zdHJpbmdpZnkoY29yZS5jbG9uZShjbXlrKSl9YFxuXHRcdCk7XG5cblx0XHRyZXR1cm4gY215aztcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIFJHQiB0byBDTVlLOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuY215ayk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9IZXgocmdiOiBjb2xvcnMuUkdCKTogY29sb3JzLkhleCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb21tb25VdGlscy52YWxpZGF0ZUNvbG9yVmFsdWVzKHJnYikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuaGV4KTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRSR0IgPSBjb3JlLmNsb25lKHJnYik7XG5cblx0XHRpZiAoXG5cdFx0XHRbXG5cdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5yZWQsXG5cdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbixcblx0XHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWVcblx0XHRcdF0uc29tZSh2ID0+IGlzTmFOKHYpIHx8IHYgPCAwIHx8IHYgPiAyNTUpIHx8XG5cdFx0XHRbY2xvbmVkUkdCLnZhbHVlLmFscGhhXS5zb21lKHYgPT4gaXNOYU4odikgfHwgdiA8IDAgfHwgdiA+IDEpXG5cdFx0KSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXG5cdFx0XHRcdGBJbnZhbGlkIFJHQiB2YWx1ZXM6IFI9JHtKU09OLnN0cmluZ2lmeShjbG9uZWRSR0IudmFsdWUucmVkKX0sIEc9JHtKU09OLnN0cmluZ2lmeShjbG9uZWRSR0IudmFsdWUuZ3JlZW4pfSwgQj0ke0pTT04uc3RyaW5naWZ5KGNsb25lZFJHQi52YWx1ZS5ibHVlKX0sIEE9JHtKU09OLnN0cmluZ2lmeShjbG9uZWRSR0IudmFsdWUuYWxwaGEpfWBcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aGV4OiAnIzAwMDAwMEZGJyxcblx0XHRcdFx0XHRhbHBoYTogJ0ZGJyxcblx0XHRcdFx0XHRudW1lcmljQWxwaGE6IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaGV4JyBhcyAnaGV4J1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aGV4OiBgIyR7Y29sb3JVdGlscy5jb21wb25lbnRUb0hleChjbG9uZWRSR0IudmFsdWUucmVkKX0ke2NvbG9yVXRpbHMuY29tcG9uZW50VG9IZXgoY2xvbmVkUkdCLnZhbHVlLmdyZWVuKX0ke2NvbG9yVXRpbHMuY29tcG9uZW50VG9IZXgoY2xvbmVkUkdCLnZhbHVlLmJsdWUpfWAsXG5cdFx0XHRcdGFscGhhOiBjb2xvclV0aWxzLmNvbXBvbmVudFRvSGV4KGNsb25lZFJHQi52YWx1ZS5hbHBoYSksXG5cdFx0XHRcdG51bWVyaWNBbHBoYTogY2xvbmVkUkdCLnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaGV4JyBhcyAnaGV4J1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS53YXJuKGByZ2JUb0hleCBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmhleCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9IU0wocmdiOiBjb2xvcnMuUkdCKTogY29sb3JzLkhTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb21tb25VdGlscy52YWxpZGF0ZUNvbG9yVmFsdWVzKHJnYikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuaHNsKTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRSR0IgPSBjb3JlLmNsb25lKHJnYik7XG5cblx0XHRjbG9uZWRSR0IudmFsdWUucmVkIC89IDI1NTtcblx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4gLz0gMjU1O1xuXHRcdGNsb25lZFJHQi52YWx1ZS5ibHVlIC89IDI1NTtcblxuXHRcdGNvbnN0IG1heCA9IE1hdGgubWF4KFxuXHRcdFx0Y2xvbmVkUkdCLnZhbHVlLnJlZCxcblx0XHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbixcblx0XHRcdGNsb25lZFJHQi52YWx1ZS5ibHVlXG5cdFx0KTtcblx0XHRjb25zdCBtaW4gPSBNYXRoLm1pbihcblx0XHRcdGNsb25lZFJHQi52YWx1ZS5yZWQsXG5cdFx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4sXG5cdFx0XHRjbG9uZWRSR0IudmFsdWUuYmx1ZVxuXHRcdCk7XG5cblx0XHRsZXQgaHVlID0gMCxcblx0XHRcdHNhdHVyYXRpb24gPSAwLFxuXHRcdFx0bGlnaHRuZXNzID0gKG1heCArIG1pbikgLyAyO1xuXG5cdFx0aWYgKG1heCAhPT0gbWluKSB7XG5cdFx0XHRjb25zdCBkZWx0YSA9IG1heCAtIG1pbjtcblxuXHRcdFx0c2F0dXJhdGlvbiA9XG5cdFx0XHRcdGxpZ2h0bmVzcyA+IDAuNSA/IGRlbHRhIC8gKDIgLSBtYXggLSBtaW4pIDogZGVsdGEgLyAobWF4ICsgbWluKTtcblxuXHRcdFx0c3dpdGNoIChtYXgpIHtcblx0XHRcdFx0Y2FzZSBjbG9uZWRSR0IudmFsdWUucmVkOlxuXHRcdFx0XHRcdGh1ZSA9XG5cdFx0XHRcdFx0XHQoY2xvbmVkUkdCLnZhbHVlLmdyZWVuIC0gY2xvbmVkUkdCLnZhbHVlLmJsdWUpIC8gZGVsdGEgK1xuXHRcdFx0XHRcdFx0KGNsb25lZFJHQi52YWx1ZS5ncmVlbiA8IGNsb25lZFJHQi52YWx1ZS5ibHVlID8gNiA6IDApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIGNsb25lZFJHQi52YWx1ZS5ncmVlbjpcblx0XHRcdFx0XHRodWUgPVxuXHRcdFx0XHRcdFx0KGNsb25lZFJHQi52YWx1ZS5ibHVlIC0gY2xvbmVkUkdCLnZhbHVlLnJlZCkgLyBkZWx0YSArXG5cdFx0XHRcdFx0XHQyO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIGNsb25lZFJHQi52YWx1ZS5ibHVlOlxuXHRcdFx0XHRcdGh1ZSA9XG5cdFx0XHRcdFx0XHQoY2xvbmVkUkdCLnZhbHVlLnJlZCAtIGNsb25lZFJHQi52YWx1ZS5ncmVlbikgLyBkZWx0YSArXG5cdFx0XHRcdFx0XHQ0O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aHVlICo9IDYwO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6IE1hdGgucm91bmQoaHVlKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogTWF0aC5yb3VuZChzYXR1cmF0aW9uICogMTAwKSxcblx0XHRcdFx0bGlnaHRuZXNzOiBNYXRoLnJvdW5kKGxpZ2h0bmVzcyAqIDEwMCksXG5cdFx0XHRcdGFscGhhOiByZ2IudmFsdWUuYWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGByZ2JUb0hTTCgpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuaHNsKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZ2JUb0hTVihyZ2I6IGNvbG9ycy5SR0IpOiBjb2xvcnMuSFNWIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvbW1vblV0aWxzLnZhbGlkYXRlQ29sb3JWYWx1ZXMocmdiKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5oc3YpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZFJHQiA9IGNvcmUuY2xvbmUocmdiKTtcblxuXHRcdGNsb25lZFJHQi52YWx1ZS5yZWQgLz0gMjU1O1xuXHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbiAvPSAyNTU7XG5cdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWUgLz0gMjU1O1xuXG5cdFx0Y29uc3QgbWF4ID0gTWF0aC5tYXgoXG5cdFx0XHRjbG9uZWRSR0IudmFsdWUucmVkLFxuXHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmdyZWVuLFxuXHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWVcblx0XHQpO1xuXHRcdGNvbnN0IG1pbiA9IE1hdGgubWluKFxuXHRcdFx0Y2xvbmVkUkdCLnZhbHVlLnJlZCxcblx0XHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbixcblx0XHRcdGNsb25lZFJHQi52YWx1ZS5ibHVlXG5cdFx0KTtcblx0XHRjb25zdCBkZWx0YSA9IG1heCAtIG1pbjtcblxuXHRcdGxldCBodWUgPSAwO1xuXG5cdFx0Y29uc3QgdmFsdWUgPSBtYXg7XG5cdFx0Y29uc3Qgc2F0dXJhdGlvbiA9IG1heCA9PT0gMCA/IDAgOiBkZWx0YSAvIG1heDtcblxuXHRcdGlmIChtYXggIT09IG1pbikge1xuXHRcdFx0c3dpdGNoIChtYXgpIHtcblx0XHRcdFx0Y2FzZSBjbG9uZWRSR0IudmFsdWUucmVkOlxuXHRcdFx0XHRcdGh1ZSA9XG5cdFx0XHRcdFx0XHQoY2xvbmVkUkdCLnZhbHVlLmdyZWVuIC0gY2xvbmVkUkdCLnZhbHVlLmJsdWUpIC8gZGVsdGEgK1xuXHRcdFx0XHRcdFx0KGNsb25lZFJHQi52YWx1ZS5ncmVlbiA8IGNsb25lZFJHQi52YWx1ZS5ibHVlID8gNiA6IDApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIGNsb25lZFJHQi52YWx1ZS5ncmVlbjpcblx0XHRcdFx0XHRodWUgPVxuXHRcdFx0XHRcdFx0KGNsb25lZFJHQi52YWx1ZS5ibHVlIC0gY2xvbmVkUkdCLnZhbHVlLnJlZCkgLyBkZWx0YSArXG5cdFx0XHRcdFx0XHQyO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIGNsb25lZFJHQi52YWx1ZS5ibHVlOlxuXHRcdFx0XHRcdGh1ZSA9XG5cdFx0XHRcdFx0XHQoY2xvbmVkUkdCLnZhbHVlLnJlZCAtIGNsb25lZFJHQi52YWx1ZS5ncmVlbikgLyBkZWx0YSArXG5cdFx0XHRcdFx0XHQ0O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRodWUgKj0gNjA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogTWF0aC5yb3VuZChodWUpLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBNYXRoLnJvdW5kKHNhdHVyYXRpb24gKiAxMDApLFxuXHRcdFx0XHR2YWx1ZTogTWF0aC5yb3VuZCh2YWx1ZSAqIDEwMCksXG5cdFx0XHRcdGFscGhhOiByZ2IudmFsdWUuYWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGByZ2JUb0hTVigpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuaHN2KTtcblx0fVxufVxuXG5mdW5jdGlvbiByZ2JUb1hZWihyZ2I6IGNvbG9ycy5SR0IpOiBjb2xvcnMuWFlaIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvbW1vblV0aWxzLnZhbGlkYXRlQ29sb3JWYWx1ZXMocmdiKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy54eXopO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZFJHQiA9IGNvcmUuY2xvbmUocmdiKTtcblxuXHRcdGNsb25lZFJHQi52YWx1ZS5yZWQgPSBjbG9uZWRSR0IudmFsdWUucmVkIC8gMjU1O1xuXHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbiA9IGNsb25lZFJHQi52YWx1ZS5ncmVlbiAvIDI1NTtcblx0XHRjbG9uZWRSR0IudmFsdWUuYmx1ZSA9IGNsb25lZFJHQi52YWx1ZS5ibHVlIC8gMjU1O1xuXG5cdFx0Y2xvbmVkUkdCLnZhbHVlLnJlZCA9XG5cdFx0XHRjbG9uZWRSR0IudmFsdWUucmVkID4gMC4wNDA0NVxuXHRcdFx0XHQ/IE1hdGgucG93KChjbG9uZWRSR0IudmFsdWUucmVkICsgMC4wNTUpIC8gMS4wNTUsIDIuNClcblx0XHRcdFx0OiBjbG9uZWRSR0IudmFsdWUucmVkIC8gMTIuOTI7XG5cdFx0Y2xvbmVkUkdCLnZhbHVlLmdyZWVuID1cblx0XHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbiA+IDAuMDQwNDVcblx0XHRcdFx0PyBNYXRoLnBvdygoY2xvbmVkUkdCLnZhbHVlLmdyZWVuICsgMC4wNTUpIC8gMS4wNTUsIDIuNClcblx0XHRcdFx0OiBjbG9uZWRSR0IudmFsdWUuZ3JlZW4gLyAxMi45Mjtcblx0XHRjbG9uZWRSR0IudmFsdWUuYmx1ZSA9XG5cdFx0XHRjbG9uZWRSR0IudmFsdWUuYmx1ZSA+IDAuMDQwNDVcblx0XHRcdFx0PyBNYXRoLnBvdygoY2xvbmVkUkdCLnZhbHVlLmJsdWUgKyAwLjA1NSkgLyAxLjA1NSwgMi40KVxuXHRcdFx0XHQ6IGNsb25lZFJHQi52YWx1ZS5ibHVlIC8gMTIuOTI7XG5cblx0XHRjbG9uZWRSR0IudmFsdWUucmVkID0gY2xvbmVkUkdCLnZhbHVlLnJlZCAqIDEwMDtcblx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4gPSBjbG9uZWRSR0IudmFsdWUuZ3JlZW4gKiAxMDA7XG5cdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWUgPSBjbG9uZWRSR0IudmFsdWUuYmx1ZSAqIDEwMDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHR4OlxuXHRcdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5yZWQgKiAwLjQxMjQgK1xuXHRcdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbiAqIDAuMzU3NiArXG5cdFx0XHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWUgKiAwLjE4MDUsXG5cdFx0XHRcdHk6XG5cdFx0XHRcdFx0Y2xvbmVkUkdCLnZhbHVlLnJlZCAqIDAuMjEyNiArXG5cdFx0XHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmdyZWVuICogMC43MTUyICtcblx0XHRcdFx0XHRjbG9uZWRSR0IudmFsdWUuYmx1ZSAqIDAuMDcyMixcblx0XHRcdFx0ejpcblx0XHRcdFx0XHRjbG9uZWRSR0IudmFsdWUucmVkICogMC4wMTkzICtcblx0XHRcdFx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4gKiAwLjExOTIgK1xuXHRcdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5ibHVlICogMC45NTA1LFxuXHRcdFx0XHRhbHBoYTogcmdiLnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgcmdiVG9YWVogZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy54eXopO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHh5elRvTEFCKHh5ejogY29sb3JzLlhZWik6IGNvbG9ycy5MQUIge1xuXHR0cnkge1xuXHRcdGlmICghY29tbW9uVXRpbHMudmFsaWRhdGVDb2xvclZhbHVlcyh4eXopKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIFhZWiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHh5eil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmxhYik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkWFlaID0gY29yZS5jbG9uZSh4eXopO1xuXHRcdGNvbnN0IHJlZlggPSA5NS4wNDcsXG5cdFx0XHRyZWZZID0gMTAwLjAsXG5cdFx0XHRyZWZaID0gMTA4Ljg4MztcblxuXHRcdGNsb25lZFhZWi52YWx1ZS54ID0gY2xvbmVkWFlaLnZhbHVlLnggLyByZWZYO1xuXHRcdGNsb25lZFhZWi52YWx1ZS55ID0gY2xvbmVkWFlaLnZhbHVlLnkgLyByZWZZO1xuXHRcdGNsb25lZFhZWi52YWx1ZS56ID0gY2xvbmVkWFlaLnZhbHVlLnogLyByZWZaO1xuXG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnggPVxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnggPiAwLjAwODg1NlxuXHRcdFx0XHQ/IE1hdGgucG93KGNsb25lZFhZWi52YWx1ZS54LCAxIC8gMylcblx0XHRcdFx0OiA3Ljc4NyAqIGNsb25lZFhZWi52YWx1ZS54ICsgMTYgLyAxMTY7XG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnkgPVxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnkgPiAwLjAwODg1NlxuXHRcdFx0XHQ/IE1hdGgucG93KGNsb25lZFhZWi52YWx1ZS55LCAxIC8gMylcblx0XHRcdFx0OiA3Ljc4NyAqIGNsb25lZFhZWi52YWx1ZS55ICsgMTYgLyAxMTY7XG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnogPVxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnogPiAwLjAwODg1NlxuXHRcdFx0XHQ/IE1hdGgucG93KGNsb25lZFhZWi52YWx1ZS56LCAxIC8gMylcblx0XHRcdFx0OiA3Ljc4NyAqIGNsb25lZFhZWi52YWx1ZS56ICsgMTYgLyAxMTY7XG5cblx0XHRjb25zdCBsID0gY29tbW9uVXRpbHMuc2FuaXRpemVQZXJjZW50YWdlKFxuXHRcdFx0cGFyc2VGbG9hdCgoMTE2ICogY2xvbmVkWFlaLnZhbHVlLnkgLSAxNikudG9GaXhlZCgyKSlcblx0XHQpO1xuXHRcdGNvbnN0IGEgPSBjb21tb25VdGlscy5zYW5pdGl6ZUxBQihcblx0XHRcdHBhcnNlRmxvYXQoXG5cdFx0XHRcdCg1MDAgKiAoY2xvbmVkWFlaLnZhbHVlLnggLSBjbG9uZWRYWVoudmFsdWUueSkpLnRvRml4ZWQoMilcblx0XHRcdClcblx0XHQpO1xuXHRcdGNvbnN0IGIgPSBjb21tb25VdGlscy5zYW5pdGl6ZUxBQihcblx0XHRcdHBhcnNlRmxvYXQoXG5cdFx0XHRcdCgyMDAgKiAoY2xvbmVkWFlaLnZhbHVlLnkgLSBjbG9uZWRYWVoudmFsdWUueikpLnRvRml4ZWQoMilcblx0XHRcdClcblx0XHQpO1xuXHRcdGNvbnN0IGxhYjogY29sb3JzLkxBQiA9IHtcblx0XHRcdHZhbHVlOiB7IGwsIGEsIGIsIGFscGhhOiB4eXoudmFsdWUuYWxwaGEgfSxcblx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHR9O1xuXG5cdFx0aWYgKCFjb21tb25VdGlscy52YWxpZGF0ZUNvbG9yVmFsdWVzKGxhYikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMubGFiKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbGFiO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYHh5elRvTGFiKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5sYWIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHh5elRvSFNMKHh5ejogY29sb3JzLlhZWik6IGNvbG9ycy5IU0wge1xuXHR0cnkge1xuXHRcdGlmICghY29tbW9uVXRpbHMudmFsaWRhdGVDb2xvclZhbHVlcyh4eXopKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIFhZWiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHh5eil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmhzbCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJnYlRvSFNMKHh5elRvUkdCKGNvcmUuY2xvbmUoeHl6KSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYHh5elRvSFNMKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5oc2wpO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB4eXpUb1JHQih4eXo6IGNvbG9ycy5YWVopOiBjb2xvcnMuUkdCIHtcblx0dHJ5IHtcblx0XHRpZiAoIWNvbW1vblV0aWxzLnZhbGlkYXRlQ29sb3JWYWx1ZXMoeHl6KSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBYWVogdmFsdWUgJHtKU09OLnN0cmluZ2lmeSh4eXopfWApO1xuXG5cdFx0XHRyZXR1cm4gY29yZS5jbG9uZShkZWZhdWx0cy5yZ2IpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZFhZWiA9IGNvcmUuY2xvbmUoeHl6KTtcblxuXHRcdGNsb25lZFhZWi52YWx1ZS54IC89IDEwMDtcblx0XHRjbG9uZWRYWVoudmFsdWUueSAvPSAxMDA7XG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnogLz0gMTAwO1xuXG5cdFx0bGV0IHJlZCA9XG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueCAqIDMuMjQwNiArXG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueSAqIC0xLjUzNzIgK1xuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnogKiAtMC40OTg2O1xuXHRcdGxldCBncmVlbiA9XG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueCAqIC0wLjk2ODkgK1xuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnkgKiAxLjg3NTggK1xuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnogKiAwLjA0MTU7XG5cdFx0bGV0IGJsdWUgPVxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnggKiAwLjA1NTcgK1xuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnkgKiAtMC4yMDQgK1xuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnogKiAxLjA1NztcblxuXHRcdHJlZCA9IGNvbnZlcnNpb25IZWxwZXJzLmFwcGx5R2FtbWFDb3JyZWN0aW9uKHJlZCk7XG5cdFx0Z3JlZW4gPSBjb252ZXJzaW9uSGVscGVycy5hcHBseUdhbW1hQ29ycmVjdGlvbihncmVlbik7XG5cdFx0Ymx1ZSA9IGNvbnZlcnNpb25IZWxwZXJzLmFwcGx5R2FtbWFDb3JyZWN0aW9uKGJsdWUpO1xuXG5cdFx0cmV0dXJuIGNvbnZlcnNpb25IZWxwZXJzLmNsYW1wUkdCKHtcblx0XHRcdHZhbHVlOiB7IHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhOiB4eXoudmFsdWUuYWxwaGEgfSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGB4eXpUb1JHQiBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLnJnYik7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGNvbnZlcnQ6IGZuT2JqZWN0cy5Db252ZXJ0ID0ge1xuXHRjbXlrVG9IU0wsXG5cdGhleFRvSFNMLFxuXHRoc2xUb0NNWUssXG5cdGhzbFRvSGV4LFxuXHRoc2xUb0hTVixcblx0aHNsVG9MQUIsXG5cdGhzbFRvUkdCLFxuXHRoc2xUb1NMLFxuXHRoc2xUb1NWLFxuXHRoc2xUb1hZWixcblx0aHN2VG9IU0wsXG5cdGhzdlRvU1YsXG5cdGxhYlRvSFNMLFxuXHRsYWJUb1hZWixcblx0cmdiVG9DTVlLLFxuXHRyZ2JUb0hleCxcblx0cmdiVG9IU0wsXG5cdHJnYlRvSFNWLFxuXHRyZ2JUb1hZWixcblx0eHl6VG9IU0wsXG5cdHh5elRvTEFCXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gaHNsVG8oXG5cdGNvbG9yOiBjb2xvcnMuSFNMLFxuXHRjb2xvclNwYWNlOiBjb2xvcnMuQ29sb3JTcGFjZUV4dGVuZGVkXG4pOiBjb2xvcnMuQ29sb3Ige1xuXHR0cnkge1xuXHRcdGlmICghY29tbW9uVXRpbHMudmFsaWRhdGVDb2xvclZhbHVlcyhjb2xvcikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgY29sb3IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YCk7XG5cblx0XHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLnJnYik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjb3JlLmNsb25lKGNvbG9yKSBhcyBjb2xvcnMuSFNMO1xuXG5cdFx0c3dpdGNoIChjb2xvclNwYWNlKSB7XG5cdFx0XHRjYXNlICdjbXlrJzpcblx0XHRcdFx0cmV0dXJuIGhzbFRvQ01ZSyhjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9IZXgoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y2FzZSAnaHNsJzpcblx0XHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGhzbFRvSFNWKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBoc2xUb0xBQihjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9SR0IoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y2FzZSAnc2wnOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9TTChjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdzdic6XG5cdFx0XHRcdHJldHVybiBoc2xUb1NWKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdHJldHVybiBoc2xUb1hZWihjbG9uZWRDb2xvcik7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29sb3IgZm9ybWF0Jyk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgaHNsVG8oKSBlcnJvcjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9IU0woXG5cdGNvbG9yOiBFeGNsdWRlPGNvbG9ycy5Db2xvciwgY29sb3JzLlNMIHwgY29sb3JzLlNWPlxuKTogY29sb3JzLkhTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb21tb25VdGlscy52YWxpZGF0ZUNvbG9yVmFsdWVzKGNvbG9yKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBjb2xvciB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGNvbG9yKX1gKTtcblxuXHRcdFx0cmV0dXJuIGNvcmUuY2xvbmUoZGVmYXVsdHMuaHNsKTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRDb2xvciA9IGNvcmUuY2xvbmUoY29sb3IpO1xuXG5cdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gY215a1RvSFNMKGNsb25lZENvbG9yIGFzIGNvbG9ycy5DTVlLKTtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBoZXhUb0hTTChjbG9uZWRDb2xvciBhcyBjb2xvcnMuSGV4KTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiBjb3JlLmNsb25lKGNsb25lZENvbG9yIGFzIGNvbG9ycy5IU0wpO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGhzdlRvSFNMKGNsb25lZENvbG9yIGFzIGNvbG9ycy5IU1YpO1xuXHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0cmV0dXJuIGxhYlRvSFNMKGNsb25lZENvbG9yIGFzIGNvbG9ycy5MQUIpO1xuXHRcdFx0Y2FzZSAncmdiJzpcblx0XHRcdFx0cmV0dXJuIHJnYlRvSFNMKGNsb25lZENvbG9yIGFzIGNvbG9ycy5SR0IpO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIHh5elRvSFNMKGNsb25lZENvbG9yIGFzIGNvbG9ycy5YWVopO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvbG9yIGZvcm1hdCcpO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYHRvSFNMKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cbiJdfQ==