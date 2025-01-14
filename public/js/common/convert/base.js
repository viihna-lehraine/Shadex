// File: src/common/convert/base.js
import { applyGammaCorrection, clampRGB, hueToRGB } from '../helpers/conversion.js';
import { base, brand, brandColor, clone, sanitize, validate } from '../core/base.js';
import { componentToHex } from '../transform/base.js';
import { defaults } from '../../data/defaults/index.js';
import { hexAlphaToNumericAlpha, stripHashFromHex } from '../utils/color.js';
import { mode } from '../../data/mode/index.js';
const defaultCMYKUnbranded = base.clone(defaults.colors.cmyk);
const defaultHexUnbranded = base.clone(defaults.colors.hex);
const defaultHSLUnbranded = base.clone(defaults.colors.hsl);
const defaultHSVUnbranded = base.clone(defaults.colors.hsv);
const defaultLABUnbranded = base.clone(defaults.colors.lab);
const defaultRGBUnbranded = base.clone(defaults.colors.rgb);
const defaultSLUnbranded = base.clone(defaults.colors.sl);
const defaultSVUnbranded = base.clone(defaults.colors.sv);
const defaultXYZUnbranded = base.clone(defaults.colors.xyz);
const defaultCMYKBranded = brandColor.asCMYK(defaultCMYKUnbranded);
const defaultHexBranded = brandColor.asHex(defaultHexUnbranded);
const defaultHSLBranded = brandColor.asHSL(defaultHSLUnbranded);
const defaultHSVBranded = brandColor.asHSV(defaultHSVUnbranded);
const defaultLABBranded = brandColor.asLAB(defaultLABUnbranded);
const defaultRGBBranded = brandColor.asRGB(defaultRGBUnbranded);
const defaultSLBranded = brandColor.asSL(defaultSLUnbranded);
const defaultSVBranded = brandColor.asSV(defaultSVUnbranded);
const defaultXYZBranded = brandColor.asXYZ(defaultXYZUnbranded);
function cmykToHSL(cmyk) {
    try {
        if (!validate.colorValues(cmyk)) {
            if (mode.errorLogs)
                console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);
            return defaultHSLBranded;
        }
        return rgbToHSL(cmykToRGB(base.clone(cmyk)));
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`cmykToHSL() error: ${error}`);
        return defaultHSLBranded;
    }
}
function cmykToRGB(cmyk) {
    try {
        if (!validate.colorValues(cmyk)) {
            if (mode.errorLogs)
                console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);
            return defaultRGBBranded;
        }
        const clonedCMYK = base.clone(cmyk);
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
            value: {
                red: brand.asByteRange(Math.round(r)),
                green: brand.asByteRange(Math.round(g)),
                blue: brand.asByteRange(Math.round(b)),
                alpha: brand.asAlphaRange(alpha)
            },
            format: 'rgb'
        };
        return clampRGB(rgb);
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`cmykToRGB error: ${error}`);
        return defaultRGBBranded;
    }
}
function hexToHSL(hex) {
    try {
        if (!validate.colorValues(hex)) {
            if (mode.errorLogs)
                console.error(`Invalid Hex value ${JSON.stringify(hex)}`);
            return defaultHSLBranded;
        }
        return rgbToHSL(hexToRGB(base.clone(hex)));
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`hexToHSL() error: ${error}`);
        return defaultHSLBranded;
    }
}
function hexToHSLWrapper(input) {
    try {
        const clonedInput = base.clone(input);
        const hex = typeof clonedInput === 'string'
            ? {
                value: {
                    hex: brand.asHexSet(clonedInput),
                    alpha: brand.asHexComponent(clonedInput.slice(-2)),
                    numAlpha: brand.asAlphaRange(hexAlphaToNumericAlpha(clonedInput.slice(-2)))
                },
                format: 'hex'
            }
            : {
                ...clonedInput,
                value: {
                    ...clonedInput.value,
                    numAlpha: brand.asAlphaRange(hexAlphaToNumericAlpha(String(clonedInput.value.alpha)))
                }
            };
        return hexToHSL(hex);
    }
    catch (error) {
        if (mode.errorLogs) {
            console.error(`Error converting hex to HSL: ${error}`);
        }
        return defaultHSLBranded;
    }
}
function hexToRGB(hex) {
    try {
        if (!validate.colorValues(hex)) {
            if (mode.errorLogs)
                console.error(`Invalid Hex value ${JSON.stringify(hex)}`);
            return defaultRGBBranded;
        }
        const clonedHex = clone(hex);
        const strippedHex = stripHashFromHex(clonedHex).value.hex;
        const bigint = parseInt(strippedHex, 16);
        return {
            value: {
                red: brand.asByteRange(Math.round((bigint >> 16) & 255)),
                green: brand.asByteRange(Math.round((bigint >> 8) & 255)),
                blue: brand.asByteRange(Math.round(bigint & 255)),
                alpha: hex.value.numAlpha
            },
            format: 'rgb'
        };
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`hexToRGB error: ${error}`);
        return defaultRGBBranded;
    }
}
function hslToCMYK(hsl) {
    try {
        if (!validate.colorValues(hsl)) {
            if (mode.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return defaultCMYKBranded;
        }
        return rgbToCMYK(hslToRGB(clone(hsl)));
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`);
        return defaultCMYKBranded;
    }
}
function hslToHex(hsl) {
    try {
        if (!validate.colorValues(hsl)) {
            if (mode.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return defaultHexBranded;
        }
        return rgbToHex(hslToRGB(clone(hsl)));
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`hslToHex error: ${error}`);
        return defaultHexBranded;
    }
}
function hslToHSV(hsl) {
    try {
        if (!validate.colorValues(hsl)) {
            if (mode.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return defaultHSVBranded;
        }
        const clonedHSL = clone(hsl);
        const s = clonedHSL.value.saturation / 100;
        const l = clonedHSL.value.lightness / 100;
        const value = l + s * Math.min(l, 1 - 1);
        const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);
        return {
            value: {
                hue: brand.asRadial(Math.round(clonedHSL.value.hue)),
                saturation: brand.asPercentile(Math.round(newSaturation * 100)),
                value: brand.asPercentile(Math.round(value * 100)),
                alpha: brand.asAlphaRange(hsl.value.alpha)
            },
            format: 'hsv'
        };
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`hslToHSV() error: ${error}`);
        return defaultHSVBranded;
    }
}
function hslToLAB(hsl) {
    try {
        if (!validate.colorValues(hsl)) {
            if (mode.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return defaultLABBranded;
        }
        return xyzToLAB(rgbToXYZ(hslToRGB(clone(hsl))));
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`hslToLab() error: ${error}`);
        return defaultLABBranded;
    }
}
function hslToRGB(hsl) {
    try {
        if (!validate.colorValues(hsl)) {
            if (mode.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return defaultRGBBranded;
        }
        const clonedHSL = clone(hsl);
        const s = clonedHSL.value.saturation / 100;
        const l = clonedHSL.value.lightness / 100;
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        return {
            value: {
                red: brand.asByteRange(Math.round(hueToRGB(p, q, clonedHSL.value.hue + 1 / 3) * 255)),
                green: brand.asByteRange(Math.round(hueToRGB(p, q, clonedHSL.value.hue) * 255)),
                blue: brand.asByteRange(Math.round(hueToRGB(p, q, clonedHSL.value.hue - 1 / 3) * 255)),
                alpha: brand.asAlphaRange(hsl.value.alpha)
            },
            format: 'rgb'
        };
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`hslToRGB error: ${error}`);
        return defaultRGBBranded;
    }
}
function hslToSL(hsl) {
    try {
        if (!validate.colorValues(hsl)) {
            if (mode.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return defaultSLBranded;
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
        if (mode.errorLogs)
            console.error(`Error converting HSL to SL: ${error}`);
        return defaultSLBranded;
    }
}
function hslToSV(hsl) {
    try {
        if (!validate.colorValues(hsl)) {
            if (mode.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return defaultSVBranded;
        }
        return hsvToSV(rgbToHSV(hslToRGB(clone(hsl))));
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Error converting HSL to SV: ${error}`);
        return defaultSVBranded;
    }
}
function hslToXYZ(hsl) {
    try {
        if (!validate.colorValues(hsl)) {
            if (mode.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return defaultXYZBranded;
        }
        return labToXYZ(hslToLAB(clone(hsl)));
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`hslToXYZ error: ${error}`);
        return defaultXYZBranded;
    }
}
function hsvToHSL(hsv) {
    try {
        if (!validate.colorValues(hsv)) {
            if (mode.errorLogs)
                console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);
            return defaultHSLBranded;
        }
        const clonedHSV = clone(hsv);
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
                hue: brand.asRadial(Math.round(clonedHSV.value.hue)),
                saturation: brand.asPercentile(Math.round(newSaturation * 100)),
                lightness: brand.asPercentile(Math.round(lightness)),
                alpha: hsv.value.alpha
            },
            format: 'hsl'
        };
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`hsvToHSL() error: ${error}`);
        return defaultHSLBranded;
    }
}
function hsvToSV(hsv) {
    try {
        if (!validate.colorValues(hsv)) {
            if (mode.errorLogs)
                console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);
            return defaultSVBranded;
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
        if (mode.errorLogs)
            console.error(`Error converting HSV to SV: ${error}`);
        return defaultSVBranded;
    }
}
function labToHSL(lab) {
    try {
        if (!validate.colorValues(lab)) {
            if (mode.errorLogs)
                console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return defaultHSLBranded;
        }
        return rgbToHSL(labToRGB(clone(lab)));
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`labToHSL() error: ${error}`);
        return defaultHSLBranded;
    }
}
function labToRGB(lab) {
    try {
        if (!validate.colorValues(lab)) {
            if (mode.errorLogs)
                console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return defaultRGBBranded;
        }
        return xyzToRGB(labToXYZ(clone(lab)));
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`labToRGB error: ${error}`);
        return defaultRGBBranded;
    }
}
function labToXYZ(lab) {
    try {
        if (!validate.colorValues(lab)) {
            if (mode.errorLogs)
                console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return defaultXYZBranded;
        }
        const clonedLAB = clone(lab);
        const refX = 95.047, refY = 100.0, refZ = 108.883;
        let y = (clonedLAB.value.l + 16) / 116;
        let x = clonedLAB.value.a / 500 + y;
        let z = y - clonedLAB.value.b / 200;
        const pow = Math.pow;
        return {
            value: {
                x: brand.asXYZ_X(Math.round(refX *
                    (pow(x, 3) > 0.008856
                        ? pow(x, 3)
                        : (x - 16 / 116) / 7.787))),
                y: brand.asXYZ_Y(Math.round(refY *
                    (pow(y, 3) > 0.008856
                        ? pow(y, 3)
                        : (y - 16 / 116) / 7.787))),
                z: brand.asXYZ_Z(Math.round(refZ *
                    (pow(z, 3) > 0.008856
                        ? pow(z, 3)
                        : (z - 16 / 116) / 7.787))),
                alpha: brand.asAlphaRange(lab.value.alpha)
            },
            format: 'xyz'
        };
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`labToXYZ error: ${error}`);
        return defaultXYZBranded;
    }
}
function rgbToCMYK(rgb) {
    try {
        if (!validate.colorValues(rgb)) {
            if (mode.errorLogs)
                console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return defaultCMYKBranded;
        }
        const clonedRGB = clone(rgb);
        const redPrime = clonedRGB.value.red / 255;
        const greenPrime = clonedRGB.value.green / 255;
        const bluePrime = clonedRGB.value.blue / 255;
        const key = sanitize.percentile(Math.round(1 - Math.max(redPrime, greenPrime, bluePrime)));
        const cyan = sanitize.percentile(Math.round((1 - redPrime - key) / (1 - key) || 0));
        const magenta = sanitize.percentile(Math.round((1 - greenPrime - key) / (1 - key) || 0));
        const yellow = sanitize.percentile(Math.round((1 - bluePrime - key) / (1 - key) || 0));
        const alpha = brand.asAlphaRange(rgb.value.alpha);
        const format = 'cmyk';
        const cmyk = { value: { cyan, magenta, yellow, key, alpha }, format };
        if (!mode.quiet)
            console.log(`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(clone(cmyk))}`);
        return cmyk;
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Error converting RGB to CMYK: ${error}`);
        return defaultCMYKBranded;
    }
}
function rgbToHex(rgb) {
    try {
        if (!validate.colorValues(rgb)) {
            if (mode.errorLogs)
                console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return defaultHexBranded;
        }
        const clonedRGB = clone(rgb);
        if ([
            clonedRGB.value.red,
            clonedRGB.value.green,
            clonedRGB.value.blue
        ].some(v => isNaN(v) || v < 0 || v > 255) ||
            [clonedRGB.value.alpha].some(v => isNaN(v) || v < 0 || v > 1)) {
            if (mode.warnLogs)
                console.warn(`Invalid RGB values:\nR=${JSON.stringify(clonedRGB.value.red)}\nG=${JSON.stringify(clonedRGB.value.green)}\nB=${JSON.stringify(clonedRGB.value.blue)}\nA=${JSON.stringify(clonedRGB.value.alpha)}`);
            return {
                value: {
                    hex: brand.asHexSet('#000000FF'),
                    alpha: brand.asHexComponent('FF'),
                    numAlpha: brand.asAlphaRange(1)
                },
                format: 'hex'
            };
        }
        return {
            value: {
                hex: brand.asHexSet(`#${componentToHex(clonedRGB.value.red)}${componentToHex(clonedRGB.value.green)}${componentToHex(clonedRGB.value.blue)}`),
                alpha: brand.asHexComponent(componentToHex(clonedRGB.value.alpha)),
                numAlpha: clonedRGB.value.alpha
            },
            format: 'hex'
        };
    }
    catch (error) {
        if (mode.errorLogs)
            console.warn(`rgbToHex error: ${error}`);
        return defaultHexBranded;
    }
}
function rgbToHSL(rgb) {
    try {
        if (!validate.colorValues(rgb)) {
            if (mode.errorLogs) {
                console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            }
            return defaultHSLBranded;
        }
        const clonedRGB = clone(rgb);
        const red = clonedRGB.value.red / 255;
        const green = clonedRGB.value.green / 255;
        const blue = clonedRGB.value.blue / 255;
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        let hue = 0, saturation = 0, lightness = (max + min) / 2;
        if (max !== min) {
            const delta = max - min;
            saturation =
                lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
            switch (max) {
                case red:
                    hue = (green - blue) / delta + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = (blue - red) / delta + 2;
                    break;
                case blue:
                    hue = (red - green) / delta + 4;
                    break;
            }
            hue *= 60;
        }
        return {
            value: {
                hue: brand.asRadial(Math.round(hue)),
                saturation: brand.asPercentile(Math.round(saturation * 100)),
                lightness: brand.asPercentile(Math.round(lightness * 100)),
                alpha: brand.asAlphaRange(rgb.value.alpha)
            },
            format: 'hsl'
        };
    }
    catch (error) {
        if (mode.errorLogs) {
            console.error(`rgbToHSL() error: ${error}`);
        }
        return defaultHSLBranded;
    }
}
function rgbToHSV(rgb) {
    try {
        if (!validate.colorValues(rgb)) {
            if (mode.errorLogs) {
                console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            }
            return defaultHSVBranded;
        }
        const red = rgb.value.red / 255;
        const green = rgb.value.green / 255;
        const blue = rgb.value.blue / 255;
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        const delta = max - min;
        let hue = 0;
        const value = max;
        const saturation = max === 0 ? 0 : delta / max;
        if (max !== min) {
            switch (max) {
                case red:
                    hue = (green - blue) / delta + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = (blue - red) / delta + 2;
                    break;
                case blue:
                    hue = (red - green) / delta + 4;
                    break;
            }
            hue *= 60;
        }
        return {
            value: {
                hue: brand.asRadial(Math.round(hue)),
                saturation: brand.asPercentile(Math.round(saturation * 100)),
                value: brand.asPercentile(Math.round(value * 100)),
                alpha: brand.asAlphaRange(rgb.value.alpha)
            },
            format: 'hsv'
        };
    }
    catch (error) {
        if (mode.errorLogs) {
            console.error(`rgbToHSV() error: ${error}`);
        }
        return defaultHSVBranded;
    }
}
function rgbToXYZ(rgb) {
    try {
        if (!validate.colorValues(rgb)) {
            if (mode.errorLogs) {
                console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            }
            return defaultXYZBranded;
        }
        const red = rgb.value.red / 255;
        const green = rgb.value.green / 255;
        const blue = rgb.value.blue / 255;
        const correctedRed = red > 0.04045 ? Math.pow((red + 0.055) / 1.055, 2.4) : red / 12.92;
        const correctedGreen = green > 0.04045
            ? Math.pow((green + 0.055) / 1.055, 2.4)
            : green / 12.92;
        const correctedBlue = blue > 0.04045
            ? Math.pow((blue + 0.055) / 1.055, 2.4)
            : blue / 12.92;
        const scaledRed = correctedRed * 100;
        const scaledGreen = correctedGreen * 100;
        const scaledBlue = correctedBlue * 100;
        return {
            value: {
                x: brand.asXYZ_X(Math.round(scaledRed * 0.4124 +
                    scaledGreen * 0.3576 +
                    scaledBlue * 0.1805)),
                y: brand.asXYZ_Y(Math.round(scaledRed * 0.2126 +
                    scaledGreen * 0.7152 +
                    scaledBlue * 0.0722)),
                z: brand.asXYZ_Z(Math.round(scaledRed * 0.0193 +
                    scaledGreen * 0.1192 +
                    scaledBlue * 0.9505)),
                alpha: brand.asAlphaRange(rgb.value.alpha)
            },
            format: 'xyz'
        };
    }
    catch (error) {
        if (mode.errorLogs) {
            console.error(`rgbToXYZ error: ${error}`);
        }
        return defaultXYZBranded;
    }
}
function xyzToHSL(xyz) {
    try {
        if (!validate.colorValues(xyz)) {
            if (mode.errorLogs)
                console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return defaultHSLBranded;
        }
        return rgbToHSL(xyzToRGB(clone(xyz)));
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`xyzToHSL() error: ${error}`);
        return defaultHSLBranded;
    }
}
function xyzToLAB(xyz) {
    try {
        if (!validate.colorValues(xyz)) {
            if (mode.errorLogs)
                console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return defaultLABBranded;
        }
        const clonedXYZ = clone(xyz);
        const refX = 95.047, refY = 100.0, refZ = 108.883;
        clonedXYZ.value.x = (clonedXYZ.value.x / refX);
        clonedXYZ.value.y = (clonedXYZ.value.y / refY);
        clonedXYZ.value.z = (clonedXYZ.value.z / refZ);
        clonedXYZ.value.x =
            clonedXYZ.value.x > 0.008856
                ? Math.pow(clonedXYZ.value.x, 1 / 3)
                : (7.787 * clonedXYZ.value.x + 16 / 116);
        clonedXYZ.value.y =
            clonedXYZ.value.y > 0.008856
                ? Math.pow(clonedXYZ.value.y, 1 / 3)
                : (7.787 * clonedXYZ.value.y + 16 / 116);
        clonedXYZ.value.z =
            clonedXYZ.value.z > 0.008856
                ? Math.pow(clonedXYZ.value.z, 1 / 3)
                : (7.787 * clonedXYZ.value.z + 16 / 116);
        const l = sanitize.percentile(parseFloat((116 * clonedXYZ.value.y - 16).toFixed(2)));
        const a = sanitize.lab(parseFloat((500 * (clonedXYZ.value.x - clonedXYZ.value.y)).toFixed(2)), 'a');
        const b = sanitize.lab(parseFloat((200 * (clonedXYZ.value.y - clonedXYZ.value.z)).toFixed(2)), 'b');
        const lab = {
            value: {
                l: brand.asLAB_L(Math.round(l)),
                a: brand.asLAB_A(Math.round(a)),
                b: brand.asLAB_B(Math.round(b)),
                alpha: xyz.value.alpha
            },
            format: 'lab'
        };
        if (!validate.colorValues(lab)) {
            if (mode.errorLogs)
                console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return defaultLABBranded;
        }
        return lab;
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`xyzToLab() error: ${error}`);
        return defaultLABBranded;
    }
}
function xyzToRGB(xyz) {
    try {
        if (!validate.colorValues(xyz)) {
            if (mode.errorLogs) {
                console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            }
            return defaultRGBBranded;
        }
        const x = xyz.value.x / 100;
        const y = xyz.value.y / 100;
        const z = xyz.value.z / 100;
        let red = x * 3.2406 + y * -1.5372 + z * -0.4986;
        let green = x * -0.9689 + y * 1.8758 + z * 0.0415;
        let blue = x * 0.0557 + y * -0.204 + z * 1.057;
        red = applyGammaCorrection(red);
        green = applyGammaCorrection(green);
        blue = applyGammaCorrection(blue);
        const rgb = clampRGB({
            value: {
                red: brand.asByteRange(Math.round(red)),
                green: brand.asByteRange(Math.round(green)),
                blue: brand.asByteRange(Math.round(blue)),
                alpha: xyz.value.alpha
            },
            format: 'rgb'
        });
        return rgb;
    }
    catch (error) {
        if (mode.errorLogs) {
            console.error(`xyzToRGB error: ${error}`);
        }
        return defaultRGBBranded;
    }
}
// ******** BUNDLED CONVERSION FUNCTIONS ********
function hslTo(color, colorSpace) {
    try {
        if (!validate.colorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return defaultRGBBranded;
        }
        const clonedColor = clone(color);
        switch (colorSpace) {
            case 'cmyk':
                return hslToCMYK(clonedColor);
            case 'hex':
                return hslToHex(clonedColor);
            case 'hsl':
                return clone(clonedColor);
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
        if (!validate.colorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return defaultHSLBranded;
        }
        const clonedColor = clone(color);
        switch (color.format) {
            case 'cmyk':
                return cmykToHSL(clonedColor);
            case 'hex':
                return hexToHSL(clonedColor);
            case 'hsl':
                return clone(clonedColor);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vY29udmVydC9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG1DQUFtQztBQW1CbkMsT0FBTyxFQUNOLG9CQUFvQixFQUNwQixRQUFRLEVBQ1IsUUFBUSxFQUNSLE1BQU0sMEJBQTBCLENBQUM7QUFDbEMsT0FBTyxFQUNOLElBQUksRUFDSixLQUFLLEVBQ0wsVUFBVSxFQUNWLEtBQUssRUFDTCxRQUFRLEVBQ1IsUUFBUSxFQUNSLE1BQU0saUJBQWlCLENBQUM7QUFDekIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFaEQsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUQsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUQsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUQsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUQsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUQsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUQsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFNUQsTUFBTSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDbkUsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDaEUsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDaEUsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDaEUsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDaEUsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDaEUsTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDN0QsTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDN0QsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFaEUsU0FBUyxTQUFTLENBQUMsSUFBVTtJQUM1QixJQUFJLENBQUM7UUFDSixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJ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QUFVLENBQUM7UUFDeEQsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQVUsQ0FBQztRQUN4RCxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBVSxDQUFDO1FBRXhELFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQixTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxRQUFRO2dCQUMzQixDQUFDLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFXO2dCQUMvQyxDQUFDLENBQUUsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBVyxDQUFDO1FBQ3RELFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQixTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxRQUFRO2dCQUMzQixDQUFDLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFXO2dCQUMvQyxDQUFDLENBQUUsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBVyxDQUFDO1FBQ3RELFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQixTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxRQUFRO2dCQUMzQixDQUFDLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFXO2dCQUMvQyxDQUFDLENBQUUsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxH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bnRlbnQiOlsiLy8gRmlsZTogc3JjL2NvbW1vbi9jb252ZXJ0L2Jhc2UuanNcblxuaW1wb3J0IHtcblx0Q01ZSyxcblx0Q29sb3IsXG5cdENvbG9yU3BhY2VFeHRlbmRlZCxcblx0Q29tbW9uQ29udmVydEZuQmFzZSxcblx0SGV4LFxuXHRIU0wsXG5cdEhTVixcblx0TEFCLFxuXHRSR0IsXG5cdFNMLFxuXHRTVixcblx0WFlaLFxuXHRYWVpfWCxcblx0WFlaX1ksXG5cdFhZWl9aXG59IGZyb20gJy4uLy4uL2luZGV4L2luZGV4LmpzJztcbmltcG9ydCB7XG5cdGFwcGx5R2FtbWFDb3JyZWN0aW9uLFxuXHRjbGFtcFJHQixcblx0aHVlVG9SR0Jcbn0gZnJvbSAnLi4vaGVscGVycy9jb252ZXJzaW9uLmpzJztcbmltcG9ydCB7XG5cdGJhc2UsXG5cdGJyYW5kLFxuXHRicmFuZENvbG9yLFxuXHRjbG9uZSxcblx0c2FuaXRpemUsXG5cdHZhbGlkYXRlXG59IGZyb20gJy4uL2NvcmUvYmFzZS5qcyc7XG5pbXBvcnQgeyBjb21wb25lbnRUb0hleCB9IGZyb20gJy4uL3RyYW5zZm9ybS9iYXNlLmpzJztcbmltcG9ydCB7IGRlZmF1bHRzIH0gZnJvbSAnLi4vLi4vZGF0YS9kZWZhdWx0cy9pbmRleC5qcyc7XG5pbXBvcnQgeyBoZXhBbHBoYVRvTnVtZXJpY0FscGhhLCBzdHJpcEhhc2hGcm9tSGV4IH0gZnJvbSAnLi4vdXRpbHMvY29sb3IuanMnO1xuaW1wb3J0IHsgbW9kZSB9IGZyb20gJy4uLy4uL2RhdGEvbW9kZS9pbmRleC5qcyc7XG5cbmNvbnN0IGRlZmF1bHRDTVlLVW5icmFuZGVkID0gYmFzZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuY215ayk7XG5jb25zdCBkZWZhdWx0SGV4VW5icmFuZGVkID0gYmFzZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuaGV4KTtcbmNvbnN0IGRlZmF1bHRIU0xVbmJyYW5kZWQgPSBiYXNlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5oc2wpO1xuY29uc3QgZGVmYXVsdEhTVlVuYnJhbmRlZCA9IGJhc2UuY2xvbmUoZGVmYXVsdHMuY29sb3JzLmhzdik7XG5jb25zdCBkZWZhdWx0TEFCVW5icmFuZGVkID0gYmFzZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMubGFiKTtcbmNvbnN0IGRlZmF1bHRSR0JVbmJyYW5kZWQgPSBiYXNlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5yZ2IpO1xuY29uc3QgZGVmYXVsdFNMVW5icmFuZGVkID0gYmFzZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuc2wpO1xuY29uc3QgZGVmYXVsdFNWVW5icmFuZGVkID0gYmFzZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuc3YpO1xuY29uc3QgZGVmYXVsdFhZWlVuYnJhbmRlZCA9IGJhc2UuY2xvbmUoZGVmYXVsdHMuY29sb3JzLnh5eik7XG5cbmNvbnN0IGRlZmF1bHRDTVlLQnJhbmRlZCA9IGJyYW5kQ29sb3IuYXNDTVlLKGRlZmF1bHRDTVlLVW5icmFuZGVkKTtcbmNvbnN0IGRlZmF1bHRIZXhCcmFuZGVkID0gYnJhbmRDb2xvci5hc0hleChkZWZhdWx0SGV4VW5icmFuZGVkKTtcbmNvbnN0IGRlZmF1bHRIU0xCcmFuZGVkID0gYnJhbmRDb2xvci5hc0hTTChkZWZhdWx0SFNMVW5icmFuZGVkKTtcbmNvbnN0IGRlZmF1bHRIU1ZCcmFuZGVkID0gYnJhbmRDb2xvci5hc0hTVihkZWZhdWx0SFNWVW5icmFuZGVkKTtcbmNvbnN0IGRlZmF1bHRMQUJCcmFuZGVkID0gYnJhbmRDb2xvci5hc0xBQihkZWZhdWx0TEFCVW5icmFuZGVkKTtcbmNvbnN0IGRlZmF1bHRSR0JCcmFuZGVkID0gYnJhbmRDb2xvci5hc1JHQihkZWZhdWx0UkdCVW5icmFuZGVkKTtcbmNvbnN0IGRlZmF1bHRTTEJyYW5kZWQgPSBicmFuZENvbG9yLmFzU0woZGVmYXVsdFNMVW5icmFuZGVkKTtcbmNvbnN0IGRlZmF1bHRTVkJyYW5kZWQgPSBicmFuZENvbG9yLmFzU1YoZGVmYXVsdFNWVW5icmFuZGVkKTtcbmNvbnN0IGRlZmF1bHRYWVpCcmFuZGVkID0gYnJhbmRDb2xvci5hc1hZWihkZWZhdWx0WFlaVW5icmFuZGVkKTtcblxuZnVuY3Rpb24gY215a1RvSFNMKGNteWs6IENNWUspOiBIU0wge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoY215aykpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBDTVlLIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY215ayl9YCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0SFNMQnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IU0woY215a1RvUkdCKGJhc2UuY2xvbmUoY215aykpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoYGNteWtUb0hTTCgpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNteWtUb1JHQihjbXlrOiBDTVlLKTogUkdCIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGNteWspKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgQ01ZSyB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGNteWspfWApO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFJHQkJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkQ01ZSyA9IGJhc2UuY2xvbmUoY215ayk7XG5cdFx0Y29uc3QgciA9XG5cdFx0XHQyNTUgKlxuXHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLmN5YW4gLyAxMDApICpcblx0XHRcdCgxIC0gY2xvbmVkQ01ZSy52YWx1ZS5rZXkgLyAxMDApO1xuXHRcdGNvbnN0IGcgPVxuXHRcdFx0MjU1ICpcblx0XHRcdCgxIC0gY2xvbmVkQ01ZSy52YWx1ZS5tYWdlbnRhIC8gMTAwKSAqXG5cdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUua2V5IC8gMTAwKTtcblx0XHRjb25zdCBiID1cblx0XHRcdDI1NSAqXG5cdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUueWVsbG93IC8gMTAwKSAqXG5cdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUua2V5IC8gMTAwKTtcblx0XHRjb25zdCBhbHBoYSA9IGNteWsudmFsdWUuYWxwaGE7XG5cdFx0Y29uc3QgcmdiOiBSR0IgPSB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKE1hdGgucm91bmQocikpLFxuXHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UoTWF0aC5yb3VuZChnKSksXG5cdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKE1hdGgucm91bmQoYikpLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKGFscGhhKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9O1xuXG5cdFx0cmV0dXJuIGNsYW1wUkdCKHJnYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKGBjbXlrVG9SR0IgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdFJHQkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4VG9IU0woaGV4OiBIZXgpOiBIU0wge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoaGV4KSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhleCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhleCl9YCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0SFNMQnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IU0woaGV4VG9SR0IoYmFzZS5jbG9uZShoZXgpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKGBoZXhUb0hTTCgpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleFRvSFNMV3JhcHBlcihpbnB1dDogc3RyaW5nIHwgSGV4KTogSFNMIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjbG9uZWRJbnB1dCA9IGJhc2UuY2xvbmUoaW5wdXQpO1xuXG5cdFx0Y29uc3QgaGV4OiBIZXggPVxuXHRcdFx0dHlwZW9mIGNsb25lZElucHV0ID09PSAnc3RyaW5nJ1xuXHRcdFx0XHQ/IHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoY2xvbmVkSW5wdXQpLFxuXHRcdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoY2xvbmVkSW5wdXQuc2xpY2UoLTIpKSxcblx0XHRcdFx0XHRcdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRoZXhBbHBoYVRvTnVtZXJpY0FscGhhKGNsb25lZElucHV0LnNsaWNlKC0yKSlcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdDoge1xuXHRcdFx0XHRcdFx0Li4uY2xvbmVkSW5wdXQsXG5cdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHQuLi5jbG9uZWRJbnB1dC52YWx1ZSxcblx0XHRcdFx0XHRcdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRoZXhBbHBoYVRvTnVtZXJpY0FscGhhKFxuXHRcdFx0XHRcdFx0XHRcdFx0U3RyaW5nKGNsb25lZElucHV0LnZhbHVlLmFscGhhKVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cblx0XHRyZXR1cm4gaGV4VG9IU0woaGV4KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgaGV4IHRvIEhTTDogJHtlcnJvcn1gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4VG9SR0IoaGV4OiBIZXgpOiBSR0Ige1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoaGV4KSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhleCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhleCl9YCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0UkdCQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRIZXggPSBjbG9uZShoZXgpO1xuXHRcdGNvbnN0IHN0cmlwcGVkSGV4ID0gc3RyaXBIYXNoRnJvbUhleChjbG9uZWRIZXgpLnZhbHVlLmhleDtcblx0XHRjb25zdCBiaWdpbnQgPSBwYXJzZUludChzdHJpcHBlZEhleCwgMTYpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHJlZDogYnJhbmQuYXNCeXRlUmFuZ2UoTWF0aC5yb3VuZCgoYmlnaW50ID4+IDE2KSAmIDI1NSkpLFxuXHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UoTWF0aC5yb3VuZCgoYmlnaW50ID4+IDgpICYgMjU1KSksXG5cdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKE1hdGgucm91bmQoYmlnaW50ICYgMjU1KSksXG5cdFx0XHRcdGFscGhhOiBoZXgudmFsdWUubnVtQWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoYGhleFRvUkdCIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRSR0JCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvQ01ZSyhoc2w6IEhTTCk6IENNWUsge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0Q01ZS0JyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJnYlRvQ01ZSyhoc2xUb1JHQihjbG9uZShoc2wpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0YEVycm9yIGNvbnZlcnRpbmcgSFNMICR7SlNPTi5zdHJpbmdpZnkoaHNsKX0gdG8gQ01ZSzogJHtlcnJvcn1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRDTVlLQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb0hleChoc2w6IEhTTCk6IEhleCB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIZXhCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiByZ2JUb0hleChoc2xUb1JHQihjbG9uZShoc2wpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKGBoc2xUb0hleCBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0SGV4QnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb0hTVihoc2w6IEhTTCk6IEhTViB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIU1ZCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZEhTTCA9IGNsb25lKGhzbCk7XG5cdFx0Y29uc3QgcyA9IGNsb25lZEhTTC52YWx1ZS5zYXR1cmF0aW9uIC8gMTAwO1xuXHRcdGNvbnN0IGwgPSBjbG9uZWRIU0wudmFsdWUubGlnaHRuZXNzIC8gMTAwO1xuXHRcdGNvbnN0IHZhbHVlID0gbCArIHMgKiBNYXRoLm1pbihsLCAxIC0gMSk7XG5cdFx0Y29uc3QgbmV3U2F0dXJhdGlvbiA9IHZhbHVlID09PSAwID8gMCA6IDIgKiAoMSAtIGwgLyB2YWx1ZSk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChNYXRoLnJvdW5kKGNsb25lZEhTTC52YWx1ZS5odWUpKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQobmV3U2F0dXJhdGlvbiAqIDEwMCkpLFxuXHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQodmFsdWUgKiAxMDApKSxcblx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShoc2wudmFsdWUuYWxwaGEpXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKGBoc2xUb0hTVigpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRIU1ZCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvTEFCKGhzbDogSFNMKTogTEFCIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdExBQkJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHh5elRvTEFCKHJnYlRvWFlaKGhzbFRvUkdCKGNsb25lKGhzbCkpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKGBoc2xUb0xhYigpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRMQUJCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvUkdCKGhzbDogSFNMKTogUkdCIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFJHQkJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkSFNMID0gY2xvbmUoaHNsKTtcblx0XHRjb25zdCBzID0gY2xvbmVkSFNMLnZhbHVlLnNhdHVyYXRpb24gLyAxMDA7XG5cdFx0Y29uc3QgbCA9IGNsb25lZEhTTC52YWx1ZS5saWdodG5lc3MgLyAxMDA7XG5cdFx0Y29uc3QgcSA9IGwgPCAwLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHM7XG5cdFx0Y29uc3QgcCA9IDIgKiBsIC0gcTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdE1hdGgucm91bmQoXG5cdFx0XHRcdFx0XHRodWVUb1JHQihwLCBxLCBjbG9uZWRIU0wudmFsdWUuaHVlICsgMSAvIDMpICogMjU1XG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UoXG5cdFx0XHRcdFx0TWF0aC5yb3VuZChodWVUb1JHQihwLCBxLCBjbG9uZWRIU0wudmFsdWUuaHVlKSAqIDI1NSlcblx0XHRcdFx0KSxcblx0XHRcdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2UoXG5cdFx0XHRcdFx0TWF0aC5yb3VuZChcblx0XHRcdFx0XHRcdGh1ZVRvUkdCKHAsIHEsIGNsb25lZEhTTC52YWx1ZS5odWUgLSAxIC8gMykgKiAyNTVcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCksXG5cdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoaHNsLnZhbHVlLmFscGhhKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgaHNsVG9SR0IgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdFJHQkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9TTChoc2w6IEhTTCk6IFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFNMQnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0c2F0dXJhdGlvbjogaHNsLnZhbHVlLnNhdHVyYXRpb24sXG5cdFx0XHRcdGxpZ2h0bmVzczogaHNsLnZhbHVlLmxpZ2h0bmVzcyxcblx0XHRcdFx0YWxwaGE6IGhzbC52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3NsJyBhcyAnc2wnXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIEhTTCB0byBTTDogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0U0xCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvU1YoaHNsOiBIU0wpOiBTViB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRTVkJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGhzdlRvU1YocmdiVG9IU1YoaHNsVG9SR0IoY2xvbmUoaHNsKSkpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIEhTTCB0byBTVjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0U1ZCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvWFlaKGhzbDogSFNMKTogWFlaIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFhZWkJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGxhYlRvWFlaKGhzbFRvTEFCKGNsb25lKGhzbCkpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoYGhzbFRvWFlaIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRYWVpCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzdlRvSFNMKGhzdjogSFNWKTogSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGhzdikpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU1YgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc3YpfWApO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkSFNWID0gY2xvbmUoaHN2KTtcblx0XHRjb25zdCBuZXdTYXR1cmF0aW9uID1cblx0XHRcdGNsb25lZEhTVi52YWx1ZS52YWx1ZSAqICgxIC0gY2xvbmVkSFNWLnZhbHVlLnNhdHVyYXRpb24gLyAxMDApID09PVxuXHRcdFx0XHQwIHx8IGNsb25lZEhTVi52YWx1ZS52YWx1ZSA9PT0gMFxuXHRcdFx0XHQ/IDBcblx0XHRcdFx0OiAoY2xvbmVkSFNWLnZhbHVlLnZhbHVlIC1cblx0XHRcdFx0XHRcdGNsb25lZEhTVi52YWx1ZS52YWx1ZSAqXG5cdFx0XHRcdFx0XHRcdCgxIC0gY2xvbmVkSFNWLnZhbHVlLnNhdHVyYXRpb24gLyAxMDApKSAvXG5cdFx0XHRcdFx0TWF0aC5taW4oXG5cdFx0XHRcdFx0XHRjbG9uZWRIU1YudmFsdWUudmFsdWUsXG5cdFx0XHRcdFx0XHQxMDAgLSBjbG9uZWRIU1YudmFsdWUudmFsdWVcblx0XHRcdFx0XHQpO1xuXHRcdGNvbnN0IGxpZ2h0bmVzcyA9XG5cdFx0XHRjbG9uZWRIU1YudmFsdWUudmFsdWUgKiAoMSAtIGNsb25lZEhTVi52YWx1ZS5zYXR1cmF0aW9uIC8gMjAwKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKE1hdGgucm91bmQoY2xvbmVkSFNWLnZhbHVlLmh1ZSkpLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoTWF0aC5yb3VuZChuZXdTYXR1cmF0aW9uICogMTAwKSksXG5cdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQobGlnaHRuZXNzKSksXG5cdFx0XHRcdGFscGhhOiBoc3YudmFsdWUuYWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoYGhzdlRvSFNMKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHN2VG9TVihoc3Y6IEhTVik6IFNWIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGhzdikpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU1YgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc3YpfWApO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFNWQnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0c2F0dXJhdGlvbjogaHN2LnZhbHVlLnNhdHVyYXRpb24sXG5cdFx0XHRcdHZhbHVlOiBoc3YudmFsdWUudmFsdWUsXG5cdFx0XHRcdGFscGhhOiBoc3YudmFsdWUuYWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdzdicgYXMgJ3N2J1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBIU1YgdG8gU1Y6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdFNWQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBsYWJUb0hTTChsYWI6IExBQik6IEhTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhsYWIpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiByZ2JUb0hTTChsYWJUb1JHQihjbG9uZShsYWIpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKGBsYWJUb0hTTCgpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGxhYlRvUkdCKGxhYjogTEFCKTogUkdCIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGxhYikpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBMQUIgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShsYWIpfWApO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFJHQkJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHh5elRvUkdCKGxhYlRvWFlaKGNsb25lKGxhYikpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoYGxhYlRvUkdCIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRSR0JCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGxhYlRvWFlaKGxhYjogTEFCKTogWFlaIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGxhYikpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBMQUIgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShsYWIpfWApO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFhZWkJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkTEFCID0gY2xvbmUobGFiKTtcblx0XHRjb25zdCByZWZYID0gOTUuMDQ3LFxuXHRcdFx0cmVmWSA9IDEwMC4wLFxuXHRcdFx0cmVmWiA9IDEwOC44ODM7XG5cblx0XHRsZXQgeSA9IChjbG9uZWRMQUIudmFsdWUubCArIDE2KSAvIDExNjtcblx0XHRsZXQgeCA9IGNsb25lZExBQi52YWx1ZS5hIC8gNTAwICsgeTtcblx0XHRsZXQgeiA9IHkgLSBjbG9uZWRMQUIudmFsdWUuYiAvIDIwMDtcblxuXHRcdGNvbnN0IHBvdyA9IE1hdGgucG93O1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHg6IGJyYW5kLmFzWFlaX1goXG5cdFx0XHRcdFx0TWF0aC5yb3VuZChcblx0XHRcdFx0XHRcdHJlZlggKlxuXHRcdFx0XHRcdFx0XHQocG93KHgsIDMpID4gMC4wMDg4NTZcblx0XHRcdFx0XHRcdFx0XHQ/IHBvdyh4LCAzKVxuXHRcdFx0XHRcdFx0XHRcdDogKHggLSAxNiAvIDExNikgLyA3Ljc4Nylcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCksXG5cdFx0XHRcdHk6IGJyYW5kLmFzWFlaX1koXG5cdFx0XHRcdFx0TWF0aC5yb3VuZChcblx0XHRcdFx0XHRcdHJlZlkgKlxuXHRcdFx0XHRcdFx0XHQocG93KHksIDMpID4gMC4wMDg4NTZcblx0XHRcdFx0XHRcdFx0XHQ/IHBvdyh5LCAzKVxuXHRcdFx0XHRcdFx0XHRcdDogKHkgLSAxNiAvIDExNikgLyA3Ljc4Nylcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCksXG5cdFx0XHRcdHo6IGJyYW5kLmFzWFlaX1ooXG5cdFx0XHRcdFx0TWF0aC5yb3VuZChcblx0XHRcdFx0XHRcdHJlZlogKlxuXHRcdFx0XHRcdFx0XHQocG93KHosIDMpID4gMC4wMDg4NTZcblx0XHRcdFx0XHRcdFx0XHQ/IHBvdyh6LCAzKVxuXHRcdFx0XHRcdFx0XHRcdDogKHogLSAxNiAvIDExNikgLyA3Ljc4Nylcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCksXG5cdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UobGFiLnZhbHVlLmFscGhhKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgbGFiVG9YWVogZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdFhZWkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9DTVlLKHJnYjogUkdCKTogQ01ZSyB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhyZ2IpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRDTVlLQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRSR0IgPSBjbG9uZShyZ2IpO1xuXG5cdFx0Y29uc3QgcmVkUHJpbWUgPSBjbG9uZWRSR0IudmFsdWUucmVkIC8gMjU1O1xuXHRcdGNvbnN0IGdyZWVuUHJpbWUgPSBjbG9uZWRSR0IudmFsdWUuZ3JlZW4gLyAyNTU7XG5cdFx0Y29uc3QgYmx1ZVByaW1lID0gY2xvbmVkUkdCLnZhbHVlLmJsdWUgLyAyNTU7XG5cblx0XHRjb25zdCBrZXkgPSBzYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0TWF0aC5yb3VuZCgxIC0gTWF0aC5tYXgocmVkUHJpbWUsIGdyZWVuUHJpbWUsIGJsdWVQcmltZSkpXG5cdFx0KTtcblx0XHRjb25zdCBjeWFuID0gc2FuaXRpemUucGVyY2VudGlsZShcblx0XHRcdE1hdGgucm91bmQoKDEgLSByZWRQcmltZSAtIGtleSkgLyAoMSAtIGtleSkgfHwgMClcblx0XHQpO1xuXHRcdGNvbnN0IG1hZ2VudGEgPSBzYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0TWF0aC5yb3VuZCgoMSAtIGdyZWVuUHJpbWUgLSBrZXkpIC8gKDEgLSBrZXkpIHx8IDApXG5cdFx0KTtcblx0XHRjb25zdCB5ZWxsb3cgPSBzYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0TWF0aC5yb3VuZCgoMSAtIGJsdWVQcmltZSAtIGtleSkgLyAoMSAtIGtleSkgfHwgMClcblx0XHQpO1xuXHRcdGNvbnN0IGFscGhhID0gYnJhbmQuYXNBbHBoYVJhbmdlKHJnYi52YWx1ZS5hbHBoYSk7XG5cdFx0Y29uc3QgZm9ybWF0OiAnY215aycgPSAnY215ayc7XG5cblx0XHRjb25zdCBjbXlrID0geyB2YWx1ZTogeyBjeWFuLCBtYWdlbnRhLCB5ZWxsb3csIGtleSwgYWxwaGEgfSwgZm9ybWF0IH07XG5cblx0XHRpZiAoIW1vZGUucXVpZXQpXG5cdFx0XHRjb25zb2xlLmxvZyhcblx0XHRcdFx0YENvbnZlcnRlZCBSR0IgJHtKU09OLnN0cmluZ2lmeShjbG9uZWRSR0IpfSB0byBDTVlLOiAke0pTT04uc3RyaW5naWZ5KGNsb25lKGNteWspKX1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIGNteWs7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBSR0IgdG8gQ01ZSzogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0Q01ZS0JyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9IZXgocmdiOiBSR0IpOiBIZXgge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMocmdiKSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIFJHQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHJnYil9YCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0SGV4QnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRSR0IgPSBjbG9uZShyZ2IpO1xuXG5cdFx0aWYgKFxuXHRcdFx0W1xuXHRcdFx0XHRjbG9uZWRSR0IudmFsdWUucmVkLFxuXHRcdFx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4sXG5cdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5ibHVlXG5cdFx0XHRdLnNvbWUodiA9PiBpc05hTih2KSB8fCB2IDwgMCB8fCB2ID4gMjU1KSB8fFxuXHRcdFx0W2Nsb25lZFJHQi52YWx1ZS5hbHBoYV0uc29tZSh2ID0+IGlzTmFOKHYpIHx8IHYgPCAwIHx8IHYgPiAxKVxuXHRcdCkge1xuXHRcdFx0aWYgKG1vZGUud2FybkxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUud2Fybihcblx0XHRcdFx0XHRgSW52YWxpZCBSR0IgdmFsdWVzOlxcblI9JHtKU09OLnN0cmluZ2lmeShjbG9uZWRSR0IudmFsdWUucmVkKX1cXG5HPSR7SlNPTi5zdHJpbmdpZnkoY2xvbmVkUkdCLnZhbHVlLmdyZWVuKX1cXG5CPSR7SlNPTi5zdHJpbmdpZnkoY2xvbmVkUkdCLnZhbHVlLmJsdWUpfVxcbkE9JHtKU09OLnN0cmluZ2lmeShjbG9uZWRSR0IudmFsdWUuYWxwaGEpfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRoZXg6IGJyYW5kLmFzSGV4U2V0KCcjMDAwMDAwRkYnKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoJ0ZGJyksXG5cdFx0XHRcdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoZXgnIGFzICdoZXgnXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRoZXg6IGJyYW5kLmFzSGV4U2V0KFxuXHRcdFx0XHRcdGAjJHtjb21wb25lbnRUb0hleChjbG9uZWRSR0IudmFsdWUucmVkKX0ke2NvbXBvbmVudFRvSGV4KGNsb25lZFJHQi52YWx1ZS5ncmVlbil9JHtjb21wb25lbnRUb0hleChjbG9uZWRSR0IudmFsdWUuYmx1ZSl9YFxuXHRcdFx0XHQpLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoXG5cdFx0XHRcdFx0Y29tcG9uZW50VG9IZXgoY2xvbmVkUkdCLnZhbHVlLmFscGhhKVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRudW1BbHBoYTogY2xvbmVkUkdCLnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaGV4JyBhcyAnaGV4J1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLndhcm4oYHJnYlRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRIZXhCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJnYlRvSFNMKHJnYjogUkdCKTogSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKHJnYikpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncykge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIFJHQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHJnYil9YCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkUkdCID0gY2xvbmUocmdiKTtcblxuXHRcdGNvbnN0IHJlZCA9IChjbG9uZWRSR0IudmFsdWUucmVkIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblx0XHRjb25zdCBncmVlbiA9IChjbG9uZWRSR0IudmFsdWUuZ3JlZW4gYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMjU1O1xuXHRcdGNvbnN0IGJsdWUgPSAoY2xvbmVkUkdCLnZhbHVlLmJsdWUgYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMjU1O1xuXG5cdFx0Y29uc3QgbWF4ID0gTWF0aC5tYXgocmVkLCBncmVlbiwgYmx1ZSk7XG5cdFx0Y29uc3QgbWluID0gTWF0aC5taW4ocmVkLCBncmVlbiwgYmx1ZSk7XG5cblx0XHRsZXQgaHVlID0gMCxcblx0XHRcdHNhdHVyYXRpb24gPSAwLFxuXHRcdFx0bGlnaHRuZXNzID0gKG1heCArIG1pbikgLyAyO1xuXG5cdFx0aWYgKG1heCAhPT0gbWluKSB7XG5cdFx0XHRjb25zdCBkZWx0YSA9IG1heCAtIG1pbjtcblxuXHRcdFx0c2F0dXJhdGlvbiA9XG5cdFx0XHRcdGxpZ2h0bmVzcyA+IDAuNSA/IGRlbHRhIC8gKDIgLSBtYXggLSBtaW4pIDogZGVsdGEgLyAobWF4ICsgbWluKTtcblxuXHRcdFx0c3dpdGNoIChtYXgpIHtcblx0XHRcdFx0Y2FzZSByZWQ6XG5cdFx0XHRcdFx0aHVlID0gKGdyZWVuIC0gYmx1ZSkgLyBkZWx0YSArIChncmVlbiA8IGJsdWUgPyA2IDogMCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgZ3JlZW46XG5cdFx0XHRcdFx0aHVlID0gKGJsdWUgLSByZWQpIC8gZGVsdGEgKyAyO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIGJsdWU6XG5cdFx0XHRcdFx0aHVlID0gKHJlZCAtIGdyZWVuKSAvIGRlbHRhICsgNDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGh1ZSAqPSA2MDtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChNYXRoLnJvdW5kKGh1ZSkpLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoTWF0aC5yb3VuZChzYXR1cmF0aW9uICogMTAwKSksXG5cdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQobGlnaHRuZXNzICogMTAwKSksXG5cdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UocmdiLnZhbHVlLmFscGhhKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgcmdiVG9IU0woKSBlcnJvcjogJHtlcnJvcn1gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9IU1YocmdiOiBSR0IpOiBIU1Yge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMocmdiKSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX1gKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBkZWZhdWx0SFNWQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCByZWQgPSAocmdiLnZhbHVlLnJlZCBhcyB1bmtub3duIGFzIG51bWJlcikgLyAyNTU7XG5cdFx0Y29uc3QgZ3JlZW4gPSAocmdiLnZhbHVlLmdyZWVuIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblx0XHRjb25zdCBibHVlID0gKHJnYi52YWx1ZS5ibHVlIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblxuXHRcdGNvbnN0IG1heCA9IE1hdGgubWF4KHJlZCwgZ3JlZW4sIGJsdWUpO1xuXHRcdGNvbnN0IG1pbiA9IE1hdGgubWluKHJlZCwgZ3JlZW4sIGJsdWUpO1xuXHRcdGNvbnN0IGRlbHRhID0gbWF4IC0gbWluO1xuXG5cdFx0bGV0IGh1ZSA9IDA7XG5cblx0XHRjb25zdCB2YWx1ZSA9IG1heDtcblx0XHRjb25zdCBzYXR1cmF0aW9uID0gbWF4ID09PSAwID8gMCA6IGRlbHRhIC8gbWF4O1xuXG5cdFx0aWYgKG1heCAhPT0gbWluKSB7XG5cdFx0XHRzd2l0Y2ggKG1heCkge1xuXHRcdFx0XHRjYXNlIHJlZDpcblx0XHRcdFx0XHRodWUgPSAoZ3JlZW4gLSBibHVlKSAvIGRlbHRhICsgKGdyZWVuIDwgYmx1ZSA/IDYgOiAwKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBncmVlbjpcblx0XHRcdFx0XHRodWUgPSAoYmx1ZSAtIHJlZCkgLyBkZWx0YSArIDI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgYmx1ZTpcblx0XHRcdFx0XHRodWUgPSAocmVkIC0gZ3JlZW4pIC8gZGVsdGEgKyA0O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRodWUgKj0gNjA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoTWF0aC5yb3VuZChodWUpKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQoc2F0dXJhdGlvbiAqIDEwMCkpLFxuXHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQodmFsdWUgKiAxMDApKSxcblx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShyZ2IudmFsdWUuYWxwaGEpXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGByZ2JUb0hTVigpIGVycm9yOiAke2Vycm9yfWApO1xuXHRcdH1cblxuXHRcdHJldHVybiBkZWZhdWx0SFNWQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiByZ2JUb1hZWihyZ2I6IFJHQik6IFhZWiB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhyZ2IpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRYWVpCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJlZCA9IChyZ2IudmFsdWUucmVkIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblx0XHRjb25zdCBncmVlbiA9IChyZ2IudmFsdWUuZ3JlZW4gYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMjU1O1xuXHRcdGNvbnN0IGJsdWUgPSAocmdiLnZhbHVlLmJsdWUgYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMjU1O1xuXG5cdFx0Y29uc3QgY29ycmVjdGVkUmVkID1cblx0XHRcdHJlZCA+IDAuMDQwNDUgPyBNYXRoLnBvdygocmVkICsgMC4wNTUpIC8gMS4wNTUsIDIuNCkgOiByZWQgLyAxMi45Mjtcblx0XHRjb25zdCBjb3JyZWN0ZWRHcmVlbiA9XG5cdFx0XHRncmVlbiA+IDAuMDQwNDVcblx0XHRcdFx0PyBNYXRoLnBvdygoZ3JlZW4gKyAwLjA1NSkgLyAxLjA1NSwgMi40KVxuXHRcdFx0XHQ6IGdyZWVuIC8gMTIuOTI7XG5cdFx0Y29uc3QgY29ycmVjdGVkQmx1ZSA9XG5cdFx0XHRibHVlID4gMC4wNDA0NVxuXHRcdFx0XHQ/IE1hdGgucG93KChibHVlICsgMC4wNTUpIC8gMS4wNTUsIDIuNClcblx0XHRcdFx0OiBibHVlIC8gMTIuOTI7XG5cblx0XHRjb25zdCBzY2FsZWRSZWQgPSBjb3JyZWN0ZWRSZWQgKiAxMDA7XG5cdFx0Y29uc3Qgc2NhbGVkR3JlZW4gPSBjb3JyZWN0ZWRHcmVlbiAqIDEwMDtcblx0XHRjb25zdCBzY2FsZWRCbHVlID0gY29ycmVjdGVkQmx1ZSAqIDEwMDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHR4OiBicmFuZC5hc1hZWl9YKFxuXHRcdFx0XHRcdE1hdGgucm91bmQoXG5cdFx0XHRcdFx0XHRzY2FsZWRSZWQgKiAwLjQxMjQgK1xuXHRcdFx0XHRcdFx0XHRzY2FsZWRHcmVlbiAqIDAuMzU3NiArXG5cdFx0XHRcdFx0XHRcdHNjYWxlZEJsdWUgKiAwLjE4MDVcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCksXG5cdFx0XHRcdHk6IGJyYW5kLmFzWFlaX1koXG5cdFx0XHRcdFx0TWF0aC5yb3VuZChcblx0XHRcdFx0XHRcdHNjYWxlZFJlZCAqIDAuMjEyNiArXG5cdFx0XHRcdFx0XHRcdHNjYWxlZEdyZWVuICogMC43MTUyICtcblx0XHRcdFx0XHRcdFx0c2NhbGVkQmx1ZSAqIDAuMDcyMlxuXHRcdFx0XHRcdClcblx0XHRcdFx0KSxcblx0XHRcdFx0ejogYnJhbmQuYXNYWVpfWihcblx0XHRcdFx0XHRNYXRoLnJvdW5kKFxuXHRcdFx0XHRcdFx0c2NhbGVkUmVkICogMC4wMTkzICtcblx0XHRcdFx0XHRcdFx0c2NhbGVkR3JlZW4gKiAwLjExOTIgK1xuXHRcdFx0XHRcdFx0XHRzY2FsZWRCbHVlICogMC45NTA1XG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKHJnYi52YWx1ZS5hbHBoYSlcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYHJnYlRvWFlaIGVycm9yOiAke2Vycm9yfWApO1xuXHRcdH1cblx0XHRyZXR1cm4gZGVmYXVsdFhZWkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24geHl6VG9IU0woeHl6OiBYWVopOiBIU0wge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoeHl6KSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIFhZWiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHh5eil9YCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0SFNMQnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IU0woeHl6VG9SR0IoY2xvbmUoeHl6KSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgeHl6VG9IU0woKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0SFNMQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiB4eXpUb0xBQih4eXo6IFhZWik6IExBQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyh4eXopKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgWFlaIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoeHl6KX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRMQUJCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZFhZWiA9IGNsb25lKHh5eik7XG5cdFx0Y29uc3QgcmVmWCA9IDk1LjA0Nyxcblx0XHRcdHJlZlkgPSAxMDAuMCxcblx0XHRcdHJlZlogPSAxMDguODgzO1xuXG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnggPSAoY2xvbmVkWFlaLnZhbHVlLnggLyByZWZYKSBhcyBYWVpfWDtcblx0XHRjbG9uZWRYWVoudmFsdWUueSA9IChjbG9uZWRYWVoudmFsdWUueSAvIHJlZlkpIGFzIFhZWl9ZO1xuXHRcdGNsb25lZFhZWi52YWx1ZS56ID0gKGNsb25lZFhZWi52YWx1ZS56IC8gcmVmWikgYXMgWFlaX1o7XG5cblx0XHRjbG9uZWRYWVoudmFsdWUueCA9XG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueCA+IDAuMDA4ODU2XG5cdFx0XHRcdD8gKE1hdGgucG93KGNsb25lZFhZWi52YWx1ZS54LCAxIC8gMykgYXMgWFlaX1gpXG5cdFx0XHRcdDogKCg3Ljc4NyAqIGNsb25lZFhZWi52YWx1ZS54ICsgMTYgLyAxMTYpIGFzIFhZWl9YKTtcblx0XHRjbG9uZWRYWVoudmFsdWUueSA9XG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueSA+IDAuMDA4ODU2XG5cdFx0XHRcdD8gKE1hdGgucG93KGNsb25lZFhZWi52YWx1ZS55LCAxIC8gMykgYXMgWFlaX1kpXG5cdFx0XHRcdDogKCg3Ljc4NyAqIGNsb25lZFhZWi52YWx1ZS55ICsgMTYgLyAxMTYpIGFzIFhZWl9ZKTtcblx0XHRjbG9uZWRYWVoudmFsdWUueiA9XG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueiA+IDAuMDA4ODU2XG5cdFx0XHRcdD8gKE1hdGgucG93KGNsb25lZFhZWi52YWx1ZS56LCAxIC8gMykgYXMgWFlaX1opXG5cdFx0XHRcdDogKCg3Ljc4NyAqIGNsb25lZFhZWi52YWx1ZS56ICsgMTYgLyAxMTYpIGFzIFhZWl9aKTtcblxuXHRcdGNvbnN0IGwgPSBzYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0cGFyc2VGbG9hdCgoMTE2ICogY2xvbmVkWFlaLnZhbHVlLnkgLSAxNikudG9GaXhlZCgyKSlcblx0XHQpO1xuXHRcdGNvbnN0IGEgPSBzYW5pdGl6ZS5sYWIoXG5cdFx0XHRwYXJzZUZsb2F0KFxuXHRcdFx0XHQoNTAwICogKGNsb25lZFhZWi52YWx1ZS54IC0gY2xvbmVkWFlaLnZhbHVlLnkpKS50b0ZpeGVkKDIpXG5cdFx0XHQpLFxuXHRcdFx0J2EnXG5cdFx0KTtcblx0XHRjb25zdCBiID0gc2FuaXRpemUubGFiKFxuXHRcdFx0cGFyc2VGbG9hdChcblx0XHRcdFx0KDIwMCAqIChjbG9uZWRYWVoudmFsdWUueSAtIGNsb25lZFhZWi52YWx1ZS56KSkudG9GaXhlZCgyKVxuXHRcdFx0KSxcblx0XHRcdCdiJ1xuXHRcdCk7XG5cblx0XHRjb25zdCBsYWI6IExBQiA9IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGw6IGJyYW5kLmFzTEFCX0woTWF0aC5yb3VuZChsKSksXG5cdFx0XHRcdGE6IGJyYW5kLmFzTEFCX0EoTWF0aC5yb3VuZChhKSksXG5cdFx0XHRcdGI6IGJyYW5kLmFzTEFCX0IoTWF0aC5yb3VuZChiKSksXG5cdFx0XHRcdGFscGhhOiB4eXoudmFsdWUuYWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0fTtcblxuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMobGFiKSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIExBQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGxhYil9YCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0TEFCQnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gbGFiO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgeHl6VG9MYWIoKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0TEFCQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiB4eXpUb1JHQih4eXo6IFhZWik6IFJHQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyh4eXopKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBYWVogdmFsdWUgJHtKU09OLnN0cmluZ2lmeSh4eXopfWApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRSR0JCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IHggPSAoeHl6LnZhbHVlLnggYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMTAwO1xuXHRcdGNvbnN0IHkgPSAoeHl6LnZhbHVlLnkgYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMTAwO1xuXHRcdGNvbnN0IHogPSAoeHl6LnZhbHVlLnogYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMTAwO1xuXG5cdFx0bGV0IHJlZCA9IHggKiAzLjI0MDYgKyB5ICogLTEuNTM3MiArIHogKiAtMC40OTg2O1xuXHRcdGxldCBncmVlbiA9IHggKiAtMC45Njg5ICsgeSAqIDEuODc1OCArIHogKiAwLjA0MTU7XG5cdFx0bGV0IGJsdWUgPSB4ICogMC4wNTU3ICsgeSAqIC0wLjIwNCArIHogKiAxLjA1NztcblxuXHRcdHJlZCA9IGFwcGx5R2FtbWFDb3JyZWN0aW9uKHJlZCk7XG5cdFx0Z3JlZW4gPSBhcHBseUdhbW1hQ29ycmVjdGlvbihncmVlbik7XG5cdFx0Ymx1ZSA9IGFwcGx5R2FtbWFDb3JyZWN0aW9uKGJsdWUpO1xuXG5cdFx0Y29uc3QgcmdiOiBSR0IgPSBjbGFtcFJHQih7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKE1hdGgucm91bmQocmVkKSksXG5cdFx0XHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZShNYXRoLnJvdW5kKGdyZWVuKSksXG5cdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKE1hdGgucm91bmQoYmx1ZSkpLFxuXHRcdFx0XHRhbHBoYTogeHl6LnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHJnYjtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYHh5elRvUkdCIGVycm9yOiAke2Vycm9yfWApO1xuXHRcdH1cblx0XHRyZXR1cm4gZGVmYXVsdFJHQkJyYW5kZWQ7XG5cdH1cbn1cblxuLy8gKioqKioqKiogQlVORExFRCBDT05WRVJTSU9OIEZVTkNUSU9OUyAqKioqKioqKlxuXG5mdW5jdGlvbiBoc2xUbyhjb2xvcjogSFNMLCBjb2xvclNwYWNlOiBDb2xvclNwYWNlRXh0ZW5kZWQpOiBDb2xvciB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhjb2xvcikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgY29sb3IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0UkdCQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRDb2xvciA9IGNsb25lKGNvbG9yKSBhcyBIU0w7XG5cblx0XHRzd2l0Y2ggKGNvbG9yU3BhY2UpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9DTVlLKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBoc2xUb0hleChjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gY2xvbmUoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGhzbFRvSFNWKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBoc2xUb0xBQihjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9SR0IoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y2FzZSAnc2wnOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9TTChjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdzdic6XG5cdFx0XHRcdHJldHVybiBoc2xUb1NWKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdHJldHVybiBoc2xUb1hZWihjbG9uZWRDb2xvcik7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29sb3IgZm9ybWF0Jyk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgaHNsVG8oKSBlcnJvcjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5mdW5jdGlvbiB0b0hTTChjb2xvcjogRXhjbHVkZTxDb2xvciwgU0wgfCBTVj4pOiBIU0wge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoY29sb3IpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIGNvbG9yIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWApO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjbG9uZShjb2xvcik7XG5cblx0XHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdHJldHVybiBjbXlrVG9IU0woY2xvbmVkQ29sb3IgYXMgQ01ZSyk7XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRyZXR1cm4gaGV4VG9IU0woY2xvbmVkQ29sb3IgYXMgSGV4KTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiBjbG9uZShjbG9uZWRDb2xvciBhcyBIU0wpO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGhzdlRvSFNMKGNsb25lZENvbG9yIGFzIEhTVik7XG5cdFx0XHRjYXNlICdsYWInOlxuXHRcdFx0XHRyZXR1cm4gbGFiVG9IU0woY2xvbmVkQ29sb3IgYXMgTEFCKTtcblx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdHJldHVybiByZ2JUb0hTTChjbG9uZWRDb2xvciBhcyBSR0IpO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIHh5elRvSFNMKGNsb25lZENvbG9yIGFzIFhZWik7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29sb3IgZm9ybWF0Jyk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgdG9IU0woKSBlcnJvcjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgY29udmVydDogQ29tbW9uQ29udmVydEZuQmFzZSA9IHtcblx0aHNsVG8sXG5cdHRvSFNMLFxuXHR3cmFwcGVyczoge1xuXHRcdGhleFRvSFNMOiBoZXhUb0hTTFdyYXBwZXJcblx0fVxufTtcbiJdfQ==