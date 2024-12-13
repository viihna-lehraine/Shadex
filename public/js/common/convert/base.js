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
                red: brand.asByteRange(r),
                green: brand.asByteRange(g),
                blue: brand.asByteRange(b),
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
                red: brand.asByteRange((bigint >> 16) & 255),
                green: brand.asByteRange((bigint >> 8) & 255),
                blue: brand.asByteRange(bigint & 255),
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
                x: brand.asXYZ_X(refX *
                    (pow(x, 3) > 0.008856
                        ? pow(x, 3)
                        : (x - 16 / 116) / 7.787)),
                y: brand.asXYZ_Y(refY *
                    (pow(y, 3) > 0.008856
                        ? pow(y, 3)
                        : (y - 16 / 116) / 7.787)),
                z: brand.asXYZ_Z(refZ *
                    (pow(z, 3) > 0.008856
                        ? pow(z, 3)
                        : (z - 16 / 116) / 7.787)),
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
        const key = sanitize.percentile(1 - Math.max(redPrime, greenPrime, bluePrime));
        const cyan = sanitize.percentile((1 - redPrime - key) / (1 - key) || 0);
        const magenta = sanitize.percentile((1 - greenPrime - key) / (1 - key) || 0);
        const yellow = sanitize.percentile((1 - bluePrime - key) / (1 - key) || 0);
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
                console.warn(`Invalid RGB values: \nR=${JSON.stringify(clonedRGB.value.red)}\nG=${JSON.stringify(clonedRGB.value.green)}\nB=${JSON.stringify(clonedRGB.value.blue)}\nA=${JSON.stringify(clonedRGB.value.alpha)}`);
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
                x: brand.asXYZ_X(scaledRed * 0.4124 +
                    scaledGreen * 0.3576 +
                    scaledBlue * 0.1805),
                y: brand.asXYZ_Y(scaledRed * 0.2126 +
                    scaledGreen * 0.7152 +
                    scaledBlue * 0.0722),
                z: brand.asXYZ_Z(scaledRed * 0.0193 +
                    scaledGreen * 0.1192 +
                    scaledBlue * 0.9505),
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
                l: brand.asLAB_L(l),
                a: brand.asLAB_A(a),
                b: brand.asLAB_B(b),
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
                red: brand.asByteRange(red),
                green: brand.asByteRange(green),
                blue: brand.asByteRange(blue),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vY29udmVydC9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG1DQUFtQztBQW1CbkMsT0FBTyxFQUNOLG9CQUFvQixFQUNwQixRQUFRLEVBQ1IsUUFBUSxFQUNSLE1BQU0sMEJBQTBCLENBQUM7QUFDbEMsT0FBTyxFQUNOLElBQUksRUFDSixLQUFLLEVBQ0wsVUFBVSxFQUNWLEtBQUssRUFDTCxRQUFRLEVBQ1IsUUFBUSxFQUNSLE1BQU0saUJBQWlCLENBQUM7QUFDekIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFaEQsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUQsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUQsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUQsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUQsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUQsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUQsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFNUQsTUFBTSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDbkUsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDaEUsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDaEUsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDaEUsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDaEUsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDaEUsTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDN0QsTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDN0QsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFaEUsU0FBUyxTQUFTLENBQUMsSUFBVTtJQUM1QixJQUFJLENBQUM7UUFDSixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJ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LEVBQUUsR0FBRyxHQUFHLENBQVcsQ0FBQztRQUN0RCxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEIsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsUUFBUTtnQkFDM0IsQ0FBQyxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBVztnQkFDL0MsQ0FBQyxDQUFFLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQVcsQ0FBQztRQUN0RCxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEIsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsUUFBUTtnQkFDM0IsQ0FBQyxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBVztnQkFDL0MsQ0FBQyxDQUFFLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQVcsQ0FBQztRQUV0RCxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUM1QixVQUFVLENBQUMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ3JELENBQUM7UUFDRixNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUNyQixVQUFVLENBQ1QsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUMxRCxFQUNELEdBQUcsQ0FDSCxDQUFDO1FBQ0YsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FDckIsVUFBVSxD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a0IsQ0FBQyxDQUFDO1lBQ3JDLEtBQUssS0FBSztnQkFDVCxPQUFPLFFBQVEsQ0FBQyxXQUFrQixDQUFDLENBQUM7WUFDckM7Z0JBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQzFDLENBQUM7SUFDRixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUF3QjtJQUMzQyxLQUFLO0lBQ0wsS0FBSztJQUNMLFFBQVEsRUFBRTtRQUNULFFBQVEsRUFBRSxlQUFlO0tBQ3pCO0NBQ0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9jb21tb24vY29udmVydC9iYXNlLmpzXG5cbmltcG9ydCB7XG5cdENNWUssXG5cdENvbG9yLFxuXHRDb2xvclNwYWNlRXh0ZW5kZWQsXG5cdENvbW1vbkNvbnZlcnRGbkJhc2UsXG5cdEhleCxcblx0SFNMLFxuXHRIU1YsXG5cdExBQixcblx0UkdCLFxuXHRTTCxcblx0U1YsXG5cdFhZWixcblx0WFlaX1gsXG5cdFhZWl9ZLFxuXHRYWVpfWlxufSBmcm9tICcuLi8uLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQge1xuXHRhcHBseUdhbW1hQ29ycmVjdGlvbixcblx0Y2xhbXBSR0IsXG5cdGh1ZVRvUkdCXG59IGZyb20gJy4uL2hlbHBlcnMvY29udmVyc2lvbi5qcyc7XG5pbXBvcnQge1xuXHRiYXNlLFxuXHRicmFuZCxcblx0YnJhbmRDb2xvcixcblx0Y2xvbmUsXG5cdHNhbml0aXplLFxuXHR2YWxpZGF0ZVxufSBmcm9tICcuLi9jb3JlL2Jhc2UuanMnO1xuaW1wb3J0IHsgY29tcG9uZW50VG9IZXggfSBmcm9tICcuLi90cmFuc2Zvcm0vYmFzZS5qcyc7XG5pbXBvcnQgeyBkZWZhdWx0cyB9IGZyb20gJy4uLy4uL2RhdGEvZGVmYXVsdHMvaW5kZXguanMnO1xuaW1wb3J0IHsgaGV4QWxwaGFUb051bWVyaWNBbHBoYSwgc3RyaXBIYXNoRnJvbUhleCB9IGZyb20gJy4uL3V0aWxzL2NvbG9yLmpzJztcbmltcG9ydCB7IG1vZGUgfSBmcm9tICcuLi8uLi9kYXRhL21vZGUvaW5kZXguanMnO1xuXG5jb25zdCBkZWZhdWx0Q01ZS1VuYnJhbmRlZCA9IGJhc2UuY2xvbmUoZGVmYXVsdHMuY29sb3JzLmNteWspO1xuY29uc3QgZGVmYXVsdEhleFVuYnJhbmRlZCA9IGJhc2UuY2xvbmUoZGVmYXVsdHMuY29sb3JzLmhleCk7XG5jb25zdCBkZWZhdWx0SFNMVW5icmFuZGVkID0gYmFzZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuaHNsKTtcbmNvbnN0IGRlZmF1bHRIU1ZVbmJyYW5kZWQgPSBiYXNlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5oc3YpO1xuY29uc3QgZGVmYXVsdExBQlVuYnJhbmRlZCA9IGJhc2UuY2xvbmUoZGVmYXVsdHMuY29sb3JzLmxhYik7XG5jb25zdCBkZWZhdWx0UkdCVW5icmFuZGVkID0gYmFzZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMucmdiKTtcbmNvbnN0IGRlZmF1bHRTTFVuYnJhbmRlZCA9IGJhc2UuY2xvbmUoZGVmYXVsdHMuY29sb3JzLnNsKTtcbmNvbnN0IGRlZmF1bHRTVlVuYnJhbmRlZCA9IGJhc2UuY2xvbmUoZGVmYXVsdHMuY29sb3JzLnN2KTtcbmNvbnN0IGRlZmF1bHRYWVpVbmJyYW5kZWQgPSBiYXNlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy54eXopO1xuXG5jb25zdCBkZWZhdWx0Q01ZS0JyYW5kZWQgPSBicmFuZENvbG9yLmFzQ01ZSyhkZWZhdWx0Q01ZS1VuYnJhbmRlZCk7XG5jb25zdCBkZWZhdWx0SGV4QnJhbmRlZCA9IGJyYW5kQ29sb3IuYXNIZXgoZGVmYXVsdEhleFVuYnJhbmRlZCk7XG5jb25zdCBkZWZhdWx0SFNMQnJhbmRlZCA9IGJyYW5kQ29sb3IuYXNIU0woZGVmYXVsdEhTTFVuYnJhbmRlZCk7XG5jb25zdCBkZWZhdWx0SFNWQnJhbmRlZCA9IGJyYW5kQ29sb3IuYXNIU1YoZGVmYXVsdEhTVlVuYnJhbmRlZCk7XG5jb25zdCBkZWZhdWx0TEFCQnJhbmRlZCA9IGJyYW5kQ29sb3IuYXNMQUIoZGVmYXVsdExBQlVuYnJhbmRlZCk7XG5jb25zdCBkZWZhdWx0UkdCQnJhbmRlZCA9IGJyYW5kQ29sb3IuYXNSR0IoZGVmYXVsdFJHQlVuYnJhbmRlZCk7XG5jb25zdCBkZWZhdWx0U0xCcmFuZGVkID0gYnJhbmRDb2xvci5hc1NMKGRlZmF1bHRTTFVuYnJhbmRlZCk7XG5jb25zdCBkZWZhdWx0U1ZCcmFuZGVkID0gYnJhbmRDb2xvci5hc1NWKGRlZmF1bHRTVlVuYnJhbmRlZCk7XG5jb25zdCBkZWZhdWx0WFlaQnJhbmRlZCA9IGJyYW5kQ29sb3IuYXNYWVooZGVmYXVsdFhZWlVuYnJhbmRlZCk7XG5cbmZ1bmN0aW9uIGNteWtUb0hTTChjbXlrOiBDTVlLKTogSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGNteWspKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgQ01ZSyB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGNteWspfWApO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJnYlRvSFNMKGNteWtUb1JHQihiYXNlLmNsb25lKGNteWspKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKGBjbXlrVG9IU0woKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0SFNMQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBjbXlrVG9SR0IoY215azogQ01ZSyk6IFJHQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhjbXlrKSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIENNWUsgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjbXlrKX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRSR0JCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZENNWUsgPSBiYXNlLmNsb25lKGNteWspO1xuXHRcdGNvbnN0IHIgPVxuXHRcdFx0MjU1ICpcblx0XHRcdCgxIC0gY2xvbmVkQ01ZSy52YWx1ZS5jeWFuIC8gMTAwKSAqXG5cdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUua2V5IC8gMTAwKTtcblx0XHRjb25zdCBnID1cblx0XHRcdDI1NSAqXG5cdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUubWFnZW50YSAvIDEwMCkgKlxuXHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLmtleSAvIDEwMCk7XG5cdFx0Y29uc3QgYiA9XG5cdFx0XHQyNTUgKlxuXHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLnllbGxvdyAvIDEwMCkgKlxuXHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLmtleSAvIDEwMCk7XG5cdFx0Y29uc3QgYWxwaGEgPSBjbXlrLnZhbHVlLmFscGhhO1xuXHRcdGNvbnN0IHJnYjogUkdCID0ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZShyKSxcblx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKGcpLFxuXHRcdFx0XHRibHVlOiBicmFuZC5hc0J5dGVSYW5nZShiKSxcblx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShhbHBoYSlcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0fTtcblxuXHRcdHJldHVybiBjbGFtcFJHQihyZ2IpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgY215a1RvUkdCIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRSR0JCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleFRvSFNMKGhleDogSGV4KTogSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGhleCkpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIZXggdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoZXgpfWApO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJnYlRvSFNMKGhleFRvUkdCKGJhc2UuY2xvbmUoaGV4KSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgaGV4VG9IU0woKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0SFNMQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBoZXhUb0hTTFdyYXBwZXIoaW5wdXQ6IHN0cmluZyB8IEhleCk6IEhTTCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY2xvbmVkSW5wdXQgPSBiYXNlLmNsb25lKGlucHV0KTtcblxuXHRcdGNvbnN0IGhleDogSGV4ID1cblx0XHRcdHR5cGVvZiBjbG9uZWRJbnB1dCA9PT0gJ3N0cmluZydcblx0XHRcdFx0PyB7XG5cdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHRoZXg6IGJyYW5kLmFzSGV4U2V0KGNsb25lZElucHV0KSxcblx0XHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzSGV4Q29tcG9uZW50KGNsb25lZElucHV0LnNsaWNlKC0yKSksXG5cdFx0XHRcdFx0XHRcdG51bUFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdFx0aGV4QWxwaGFUb051bWVyaWNBbHBoYShjbG9uZWRJbnB1dC5zbGljZSgtMikpXG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQ6IHtcblx0XHRcdFx0XHRcdC4uLmNsb25lZElucHV0LFxuXHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0Li4uY2xvbmVkSW5wdXQudmFsdWUsXG5cdFx0XHRcdFx0XHRcdG51bUFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdFx0aGV4QWxwaGFUb051bWVyaWNBbHBoYShcblx0XHRcdFx0XHRcdFx0XHRcdFN0cmluZyhjbG9uZWRJbnB1dC52YWx1ZS5hbHBoYSlcblx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXG5cdFx0cmV0dXJuIGhleFRvSFNMKGhleCk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIGhleCB0byBIU0w6ICR7ZXJyb3J9YCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleFRvUkdCKGhleDogSGV4KTogUkdCIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGhleCkpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIZXggdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoZXgpfWApO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFJHQkJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkSGV4ID0gY2xvbmUoaGV4KTtcblx0XHRjb25zdCBzdHJpcHBlZEhleCA9IHN0cmlwSGFzaEZyb21IZXgoY2xvbmVkSGV4KS52YWx1ZS5oZXg7XG5cdFx0Y29uc3QgYmlnaW50ID0gcGFyc2VJbnQoc3RyaXBwZWRIZXgsIDE2KTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKChiaWdpbnQgPj4gMTYpICYgMjU1KSxcblx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKChiaWdpbnQgPj4gOCkgJiAyNTUpLFxuXHRcdFx0XHRibHVlOiBicmFuZC5hc0J5dGVSYW5nZShiaWdpbnQgJiAyNTUpLFxuXHRcdFx0XHRhbHBoYTogaGV4LnZhbHVlLm51bUFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKGBoZXhUb1JHQiBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0UkdCQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb0NNWUsoaHNsOiBIU0wpOiBDTVlLIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWApO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdENNWUtCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiByZ2JUb0NNWUsoaHNsVG9SR0IoY2xvbmUoaHNsKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdGBFcnJvciBjb252ZXJ0aW5nIEhTTCAke0pTT04uc3RyaW5naWZ5KGhzbCl9IHRvIENNWUs6ICR7ZXJyb3J9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBkZWZhdWx0Q01ZS0JyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9IZXgoaHNsOiBIU0wpOiBIZXgge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0SGV4QnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IZXgoaHNsVG9SR0IoY2xvbmUoaHNsKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgaHNsVG9IZXggZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdEhleEJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9IU1YoaHNsOiBIU0wpOiBIU1Yge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0SFNWQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRIU0wgPSBjbG9uZShoc2wpO1xuXHRcdGNvbnN0IHMgPSBjbG9uZWRIU0wudmFsdWUuc2F0dXJhdGlvbiAvIDEwMDtcblx0XHRjb25zdCBsID0gY2xvbmVkSFNMLnZhbHVlLmxpZ2h0bmVzcyAvIDEwMDtcblx0XHRjb25zdCB2YWx1ZSA9IGwgKyBzICogTWF0aC5taW4obCwgMSAtIDEpO1xuXHRcdGNvbnN0IG5ld1NhdHVyYXRpb24gPSB2YWx1ZSA9PT0gMCA/IDAgOiAyICogKDEgLSBsIC8gdmFsdWUpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoTWF0aC5yb3VuZChjbG9uZWRIU0wudmFsdWUuaHVlKSksXG5cdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShNYXRoLnJvdW5kKG5ld1NhdHVyYXRpb24gKiAxMDApKSxcblx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZShNYXRoLnJvdW5kKHZhbHVlICogMTAwKSksXG5cdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoaHNsLnZhbHVlLmFscGhhKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgaHNsVG9IU1YoKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0SFNWQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb0xBQihoc2w6IEhTTCk6IExBQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRMQUJCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiB4eXpUb0xBQihyZ2JUb1hZWihoc2xUb1JHQihjbG9uZShoc2wpKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgaHNsVG9MYWIoKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0TEFCQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb1JHQihoc2w6IEhTTCk6IFJHQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRSR0JCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZEhTTCA9IGNsb25lKGhzbCk7XG5cdFx0Y29uc3QgcyA9IGNsb25lZEhTTC52YWx1ZS5zYXR1cmF0aW9uIC8gMTAwO1xuXHRcdGNvbnN0IGwgPSBjbG9uZWRIU0wudmFsdWUubGlnaHRuZXNzIC8gMTAwO1xuXHRcdGNvbnN0IHEgPSBsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzO1xuXHRcdGNvbnN0IHAgPSAyICogbCAtIHE7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZShcblx0XHRcdFx0XHRNYXRoLnJvdW5kKFxuXHRcdFx0XHRcdFx0aHVlVG9SR0IocCwgcSwgY2xvbmVkSFNMLnZhbHVlLmh1ZSArIDEgLyAzKSAqIDI1NVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KSxcblx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdE1hdGgucm91bmQoaHVlVG9SR0IocCwgcSwgY2xvbmVkSFNMLnZhbHVlLmh1ZSkgKiAyNTUpXG5cdFx0XHRcdCksXG5cdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdE1hdGgucm91bmQoXG5cdFx0XHRcdFx0XHRodWVUb1JHQihwLCBxLCBjbG9uZWRIU0wudmFsdWUuaHVlIC0gMSAvIDMpICogMjU1XG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKGhzbC52YWx1ZS5hbHBoYSlcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoYGhzbFRvUkdCIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRSR0JCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvU0woaHNsOiBIU0wpOiBTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRTTEJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHNhdHVyYXRpb246IGhzbC52YWx1ZS5zYXR1cmF0aW9uLFxuXHRcdFx0XHRsaWdodG5lc3M6IGhzbC52YWx1ZS5saWdodG5lc3MsXG5cdFx0XHRcdGFscGhhOiBoc2wudmFsdWUuYWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdzbCcgYXMgJ3NsJ1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBIU0wgdG8gU0w6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdFNMQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb1NWKGhzbDogSFNMKTogU1Yge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0U1ZCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiBoc3ZUb1NWKHJnYlRvSFNWKGhzbFRvUkdCKGNsb25lKGhzbCkpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcihgRXJyb3IgY29udmVydGluZyBIU0wgdG8gU1Y6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdFNWQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb1hZWihoc2w6IEhTTCk6IFhZWiB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRYWVpCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiBsYWJUb1hZWihoc2xUb0xBQihjbG9uZShoc2wpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKGBoc2xUb1hZWiBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0WFlaQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBoc3ZUb0hTTChoc3Y6IEhTVik6IEhTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc3YpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNWIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHN2KX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZEhTViA9IGNsb25lKGhzdik7XG5cdFx0Y29uc3QgbmV3U2F0dXJhdGlvbiA9XG5cdFx0XHRjbG9uZWRIU1YudmFsdWUudmFsdWUgKiAoMSAtIGNsb25lZEhTVi52YWx1ZS5zYXR1cmF0aW9uIC8gMTAwKSA9PT1cblx0XHRcdFx0MCB8fCBjbG9uZWRIU1YudmFsdWUudmFsdWUgPT09IDBcblx0XHRcdFx0PyAwXG5cdFx0XHRcdDogKGNsb25lZEhTVi52YWx1ZS52YWx1ZSAtXG5cdFx0XHRcdFx0XHRjbG9uZWRIU1YudmFsdWUudmFsdWUgKlxuXHRcdFx0XHRcdFx0XHQoMSAtIGNsb25lZEhTVi52YWx1ZS5zYXR1cmF0aW9uIC8gMTAwKSkgL1xuXHRcdFx0XHRcdE1hdGgubWluKFxuXHRcdFx0XHRcdFx0Y2xvbmVkSFNWLnZhbHVlLnZhbHVlLFxuXHRcdFx0XHRcdFx0MTAwIC0gY2xvbmVkSFNWLnZhbHVlLnZhbHVlXG5cdFx0XHRcdFx0KTtcblx0XHRjb25zdCBsaWdodG5lc3MgPVxuXHRcdFx0Y2xvbmVkSFNWLnZhbHVlLnZhbHVlICogKDEgLSBjbG9uZWRIU1YudmFsdWUuc2F0dXJhdGlvbiAvIDIwMCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChNYXRoLnJvdW5kKGNsb25lZEhTVi52YWx1ZS5odWUpKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQobmV3U2F0dXJhdGlvbiAqIDEwMCkpLFxuXHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShNYXRoLnJvdW5kKGxpZ2h0bmVzcykpLFxuXHRcdFx0XHRhbHBoYTogaHN2LnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKGBoc3ZUb0hTTCgpIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzdlRvU1YoaHN2OiBIU1YpOiBTViB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc3YpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgSFNWIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHN2KX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRTVkJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHNhdHVyYXRpb246IGhzdi52YWx1ZS5zYXR1cmF0aW9uLFxuXHRcdFx0XHR2YWx1ZTogaHN2LnZhbHVlLnZhbHVlLFxuXHRcdFx0XHRhbHBoYTogaHN2LnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnc3YnIGFzICdzdidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgSFNWIHRvIFNWOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRTVkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gbGFiVG9IU0wobGFiOiBMQUIpOiBIU0wge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMobGFiKSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIExBQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGxhYil9YCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0SFNMQnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IU0wobGFiVG9SR0IoY2xvbmUobGFiKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgbGFiVG9IU0woKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0SFNMQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBsYWJUb1JHQihsYWI6IExBQik6IFJHQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhsYWIpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRSR0JCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiB4eXpUb1JHQihsYWJUb1hZWihjbG9uZShsYWIpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLmVycm9yKGBsYWJUb1JHQiBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0UkdCQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBsYWJUb1hZWihsYWI6IExBQik6IFhZWiB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhsYWIpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRYWVpCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZExBQiA9IGNsb25lKGxhYik7XG5cdFx0Y29uc3QgcmVmWCA9IDk1LjA0Nyxcblx0XHRcdHJlZlkgPSAxMDAuMCxcblx0XHRcdHJlZlogPSAxMDguODgzO1xuXG5cdFx0bGV0IHkgPSAoY2xvbmVkTEFCLnZhbHVlLmwgKyAxNikgLyAxMTY7XG5cdFx0bGV0IHggPSBjbG9uZWRMQUIudmFsdWUuYSAvIDUwMCArIHk7XG5cdFx0bGV0IHogPSB5IC0gY2xvbmVkTEFCLnZhbHVlLmIgLyAyMDA7XG5cblx0XHRjb25zdCBwb3cgPSBNYXRoLnBvdztcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHR4OiBicmFuZC5hc1hZWl9YKFxuXHRcdFx0XHRcdHJlZlggKlxuXHRcdFx0XHRcdFx0KHBvdyh4LCAzKSA+IDAuMDA4ODU2XG5cdFx0XHRcdFx0XHRcdD8gcG93KHgsIDMpXG5cdFx0XHRcdFx0XHRcdDogKHggLSAxNiAvIDExNikgLyA3Ljc4Nylcblx0XHRcdFx0KSxcblx0XHRcdFx0eTogYnJhbmQuYXNYWVpfWShcblx0XHRcdFx0XHRyZWZZICpcblx0XHRcdFx0XHRcdChwb3coeSwgMykgPiAwLjAwODg1NlxuXHRcdFx0XHRcdFx0XHQ/IHBvdyh5LCAzKVxuXHRcdFx0XHRcdFx0XHQ6ICh5IC0gMTYgLyAxMTYpIC8gNy43ODcpXG5cdFx0XHRcdCksXG5cdFx0XHRcdHo6IGJyYW5kLmFzWFlaX1ooXG5cdFx0XHRcdFx0cmVmWiAqXG5cdFx0XHRcdFx0XHQocG93KHosIDMpID4gMC4wMDg4NTZcblx0XHRcdFx0XHRcdFx0PyBwb3coeiwgMylcblx0XHRcdFx0XHRcdFx0OiAoeiAtIDE2IC8gMTE2KSAvIDcuNzg3KVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKGxhYi52YWx1ZS5hbHBoYSlcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoYGxhYlRvWFlaIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRYWVpCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJnYlRvQ01ZSyhyZ2I6IFJHQik6IENNWUsge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMocmdiKSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIFJHQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHJnYil9YCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0Q01ZS0JyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkUkdCID0gY2xvbmUocmdiKTtcblxuXHRcdGNvbnN0IHJlZFByaW1lID0gY2xvbmVkUkdCLnZhbHVlLnJlZCAvIDI1NTtcblx0XHRjb25zdCBncmVlblByaW1lID0gY2xvbmVkUkdCLnZhbHVlLmdyZWVuIC8gMjU1O1xuXHRcdGNvbnN0IGJsdWVQcmltZSA9IGNsb25lZFJHQi52YWx1ZS5ibHVlIC8gMjU1O1xuXG5cdFx0Y29uc3Qga2V5ID0gc2FuaXRpemUucGVyY2VudGlsZShcblx0XHRcdDEgLSBNYXRoLm1heChyZWRQcmltZSwgZ3JlZW5QcmltZSwgYmx1ZVByaW1lKVxuXHRcdCk7XG5cdFx0Y29uc3QgY3lhbiA9IHNhbml0aXplLnBlcmNlbnRpbGUoKDEgLSByZWRQcmltZSAtIGtleSkgLyAoMSAtIGtleSkgfHwgMCk7XG5cdFx0Y29uc3QgbWFnZW50YSA9IHNhbml0aXplLnBlcmNlbnRpbGUoXG5cdFx0XHQoMSAtIGdyZWVuUHJpbWUgLSBrZXkpIC8gKDEgLSBrZXkpIHx8IDBcblx0XHQpO1xuXHRcdGNvbnN0IHllbGxvdyA9IHNhbml0aXplLnBlcmNlbnRpbGUoXG5cdFx0XHQoMSAtIGJsdWVQcmltZSAtIGtleSkgLyAoMSAtIGtleSkgfHwgMFxuXHRcdCk7XG5cdFx0Y29uc3QgYWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UocmdiLnZhbHVlLmFscGhhKTtcblx0XHRjb25zdCBmb3JtYXQ6ICdjbXlrJyA9ICdjbXlrJztcblxuXHRcdGNvbnN0IGNteWsgPSB7IHZhbHVlOiB7IGN5YW4sIG1hZ2VudGEsIHllbGxvdywga2V5LCBhbHBoYSB9LCBmb3JtYXQgfTtcblxuXHRcdGlmICghbW9kZS5xdWlldClcblx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRgQ29udmVydGVkIFJHQiAke0pTT04uc3RyaW5naWZ5KGNsb25lZFJHQil9IHRvIENNWUs6ICR7SlNPTi5zdHJpbmdpZnkoY2xvbmUoY215aykpfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gY215aztcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBjb252ZXJ0aW5nIFJHQiB0byBDTVlLOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRDTVlLQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiByZ2JUb0hleChyZ2I6IFJHQik6IEhleCB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhyZ2IpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIZXhCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZFJHQiA9IGNsb25lKHJnYik7XG5cblx0XHRpZiAoXG5cdFx0XHRbXG5cdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5yZWQsXG5cdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbixcblx0XHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWVcblx0XHRcdF0uc29tZSh2ID0+IGlzTmFOKHYpIHx8IHYgPCAwIHx8IHYgPiAyNTUpIHx8XG5cdFx0XHRbY2xvbmVkUkdCLnZhbHVlLmFscGhhXS5zb21lKHYgPT4gaXNOYU4odikgfHwgdiA8IDAgfHwgdiA+IDEpXG5cdFx0KSB7XG5cdFx0XHRpZiAobW9kZS53YXJuTG9ncylcblx0XHRcdFx0Y29uc29sZS53YXJuKFxuXHRcdFx0XHRcdGBJbnZhbGlkIFJHQiB2YWx1ZXM6IFxcblI9JHtKU09OLnN0cmluZ2lmeShjbG9uZWRSR0IudmFsdWUucmVkKX1cXG5HPSR7SlNPTi5zdHJpbmdpZnkoY2xvbmVkUkdCLnZhbHVlLmdyZWVuKX1cXG5CPSR7SlNPTi5zdHJpbmdpZnkoY2xvbmVkUkdCLnZhbHVlLmJsdWUpfVxcbkE9JHtKU09OLnN0cmluZ2lmeShjbG9uZWRSR0IudmFsdWUuYWxwaGEpfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRoZXg6IGJyYW5kLmFzSGV4U2V0KCcjMDAwMDAwRkYnKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoJ0ZGJyksXG5cdFx0XHRcdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoZXgnIGFzICdoZXgnXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRoZXg6IGJyYW5kLmFzSGV4U2V0KFxuXHRcdFx0XHRcdGAjJHtjb21wb25lbnRUb0hleChjbG9uZWRSR0IudmFsdWUucmVkKX0ke2NvbXBvbmVudFRvSGV4KGNsb25lZFJHQi52YWx1ZS5ncmVlbil9JHtjb21wb25lbnRUb0hleChjbG9uZWRSR0IudmFsdWUuYmx1ZSl9YFxuXHRcdFx0XHQpLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoXG5cdFx0XHRcdFx0Y29tcG9uZW50VG9IZXgoY2xvbmVkUkdCLnZhbHVlLmFscGhhKVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRudW1BbHBoYTogY2xvbmVkUkdCLnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaGV4JyBhcyAnaGV4J1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSBjb25zb2xlLndhcm4oYHJnYlRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRIZXhCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJnYlRvSFNMKHJnYjogUkdCKTogSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKHJnYikpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncykge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIFJHQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHJnYil9YCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkUkdCID0gY2xvbmUocmdiKTtcblxuXHRcdGNvbnN0IHJlZCA9IChjbG9uZWRSR0IudmFsdWUucmVkIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblx0XHRjb25zdCBncmVlbiA9IChjbG9uZWRSR0IudmFsdWUuZ3JlZW4gYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMjU1O1xuXHRcdGNvbnN0IGJsdWUgPSAoY2xvbmVkUkdCLnZhbHVlLmJsdWUgYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMjU1O1xuXG5cdFx0Y29uc3QgbWF4ID0gTWF0aC5tYXgocmVkLCBncmVlbiwgYmx1ZSk7XG5cdFx0Y29uc3QgbWluID0gTWF0aC5taW4ocmVkLCBncmVlbiwgYmx1ZSk7XG5cblx0XHRsZXQgaHVlID0gMCxcblx0XHRcdHNhdHVyYXRpb24gPSAwLFxuXHRcdFx0bGlnaHRuZXNzID0gKG1heCArIG1pbikgLyAyO1xuXG5cdFx0aWYgKG1heCAhPT0gbWluKSB7XG5cdFx0XHRjb25zdCBkZWx0YSA9IG1heCAtIG1pbjtcblxuXHRcdFx0c2F0dXJhdGlvbiA9XG5cdFx0XHRcdGxpZ2h0bmVzcyA+IDAuNSA/IGRlbHRhIC8gKDIgLSBtYXggLSBtaW4pIDogZGVsdGEgLyAobWF4ICsgbWluKTtcblxuXHRcdFx0c3dpdGNoIChtYXgpIHtcblx0XHRcdFx0Y2FzZSByZWQ6XG5cdFx0XHRcdFx0aHVlID0gKGdyZWVuIC0gYmx1ZSkgLyBkZWx0YSArIChncmVlbiA8IGJsdWUgPyA2IDogMCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgZ3JlZW46XG5cdFx0XHRcdFx0aHVlID0gKGJsdWUgLSByZWQpIC8gZGVsdGEgKyAyO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIGJsdWU6XG5cdFx0XHRcdFx0aHVlID0gKHJlZCAtIGdyZWVuKSAvIGRlbHRhICsgNDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGh1ZSAqPSA2MDtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChNYXRoLnJvdW5kKGh1ZSkpLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoTWF0aC5yb3VuZChzYXR1cmF0aW9uICogMTAwKSksXG5cdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQobGlnaHRuZXNzICogMTAwKSksXG5cdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UocmdiLnZhbHVlLmFscGhhKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgcmdiVG9IU0woKSBlcnJvcjogJHtlcnJvcn1gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9IU1YocmdiOiBSR0IpOiBIU1Yge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMocmdiKSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX1gKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBkZWZhdWx0SFNWQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCByZWQgPSAocmdiLnZhbHVlLnJlZCBhcyB1bmtub3duIGFzIG51bWJlcikgLyAyNTU7XG5cdFx0Y29uc3QgZ3JlZW4gPSAocmdiLnZhbHVlLmdyZWVuIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblx0XHRjb25zdCBibHVlID0gKHJnYi52YWx1ZS5ibHVlIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblxuXHRcdGNvbnN0IG1heCA9IE1hdGgubWF4KHJlZCwgZ3JlZW4sIGJsdWUpO1xuXHRcdGNvbnN0IG1pbiA9IE1hdGgubWluKHJlZCwgZ3JlZW4sIGJsdWUpO1xuXHRcdGNvbnN0IGRlbHRhID0gbWF4IC0gbWluO1xuXG5cdFx0bGV0IGh1ZSA9IDA7XG5cblx0XHRjb25zdCB2YWx1ZSA9IG1heDtcblx0XHRjb25zdCBzYXR1cmF0aW9uID0gbWF4ID09PSAwID8gMCA6IGRlbHRhIC8gbWF4O1xuXG5cdFx0aWYgKG1heCAhPT0gbWluKSB7XG5cdFx0XHRzd2l0Y2ggKG1heCkge1xuXHRcdFx0XHRjYXNlIHJlZDpcblx0XHRcdFx0XHRodWUgPSAoZ3JlZW4gLSBibHVlKSAvIGRlbHRhICsgKGdyZWVuIDwgYmx1ZSA/IDYgOiAwKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBncmVlbjpcblx0XHRcdFx0XHRodWUgPSAoYmx1ZSAtIHJlZCkgLyBkZWx0YSArIDI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgYmx1ZTpcblx0XHRcdFx0XHRodWUgPSAocmVkIC0gZ3JlZW4pIC8gZGVsdGEgKyA0O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRodWUgKj0gNjA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoTWF0aC5yb3VuZChodWUpKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQoc2F0dXJhdGlvbiAqIDEwMCkpLFxuXHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQodmFsdWUgKiAxMDApKSxcblx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShyZ2IudmFsdWUuYWxwaGEpXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGByZ2JUb0hTVigpIGVycm9yOiAke2Vycm9yfWApO1xuXHRcdH1cblxuXHRcdHJldHVybiBkZWZhdWx0SFNWQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiByZ2JUb1hZWihyZ2I6IFJHQik6IFhZWiB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhyZ2IpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRYWVpCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJlZCA9IChyZ2IudmFsdWUucmVkIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblx0XHRjb25zdCBncmVlbiA9IChyZ2IudmFsdWUuZ3JlZW4gYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMjU1O1xuXHRcdGNvbnN0IGJsdWUgPSAocmdiLnZhbHVlLmJsdWUgYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMjU1O1xuXG5cdFx0Y29uc3QgY29ycmVjdGVkUmVkID1cblx0XHRcdHJlZCA+IDAuMDQwNDUgPyBNYXRoLnBvdygocmVkICsgMC4wNTUpIC8gMS4wNTUsIDIuNCkgOiByZWQgLyAxMi45Mjtcblx0XHRjb25zdCBjb3JyZWN0ZWRHcmVlbiA9XG5cdFx0XHRncmVlbiA+IDAuMDQwNDVcblx0XHRcdFx0PyBNYXRoLnBvdygoZ3JlZW4gKyAwLjA1NSkgLyAxLjA1NSwgMi40KVxuXHRcdFx0XHQ6IGdyZWVuIC8gMTIuOTI7XG5cdFx0Y29uc3QgY29ycmVjdGVkQmx1ZSA9XG5cdFx0XHRibHVlID4gMC4wNDA0NVxuXHRcdFx0XHQ/IE1hdGgucG93KChibHVlICsgMC4wNTUpIC8gMS4wNTUsIDIuNClcblx0XHRcdFx0OiBibHVlIC8gMTIuOTI7XG5cblx0XHRjb25zdCBzY2FsZWRSZWQgPSBjb3JyZWN0ZWRSZWQgKiAxMDA7XG5cdFx0Y29uc3Qgc2NhbGVkR3JlZW4gPSBjb3JyZWN0ZWRHcmVlbiAqIDEwMDtcblx0XHRjb25zdCBzY2FsZWRCbHVlID0gY29ycmVjdGVkQmx1ZSAqIDEwMDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHR4OiBicmFuZC5hc1hZWl9YKFxuXHRcdFx0XHRcdHNjYWxlZFJlZCAqIDAuNDEyNCArXG5cdFx0XHRcdFx0XHRzY2FsZWRHcmVlbiAqIDAuMzU3NiArXG5cdFx0XHRcdFx0XHRzY2FsZWRCbHVlICogMC4xODA1XG5cdFx0XHRcdCksXG5cdFx0XHRcdHk6IGJyYW5kLmFzWFlaX1koXG5cdFx0XHRcdFx0c2NhbGVkUmVkICogMC4yMTI2ICtcblx0XHRcdFx0XHRcdHNjYWxlZEdyZWVuICogMC43MTUyICtcblx0XHRcdFx0XHRcdHNjYWxlZEJsdWUgKiAwLjA3MjJcblx0XHRcdFx0KSxcblx0XHRcdFx0ejogYnJhbmQuYXNYWVpfWihcblx0XHRcdFx0XHRzY2FsZWRSZWQgKiAwLjAxOTMgK1xuXHRcdFx0XHRcdFx0c2NhbGVkR3JlZW4gKiAwLjExOTIgK1xuXHRcdFx0XHRcdFx0c2NhbGVkQmx1ZSAqIDAuOTUwNVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKHJnYi52YWx1ZS5hbHBoYSlcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYHJnYlRvWFlaIGVycm9yOiAke2Vycm9yfWApO1xuXHRcdH1cblx0XHRyZXR1cm4gZGVmYXVsdFhZWkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24geHl6VG9IU0woeHl6OiBYWVopOiBIU0wge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoeHl6KSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIFhZWiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHh5eil9YCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0SFNMQnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IU0woeHl6VG9SR0IoY2xvbmUoeHl6KSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgeHl6VG9IU0woKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0SFNMQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiB4eXpUb0xBQih4eXo6IFhZWik6IExBQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyh4eXopKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgWFlaIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoeHl6KX1gKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRMQUJCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZFhZWiA9IGNsb25lKHh5eik7XG5cdFx0Y29uc3QgcmVmWCA9IDk1LjA0Nyxcblx0XHRcdHJlZlkgPSAxMDAuMCxcblx0XHRcdHJlZlogPSAxMDguODgzO1xuXG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnggPSAoY2xvbmVkWFlaLnZhbHVlLnggLyByZWZYKSBhcyBYWVpfWDtcblx0XHRjbG9uZWRYWVoudmFsdWUueSA9IChjbG9uZWRYWVoudmFsdWUueSAvIHJlZlkpIGFzIFhZWl9ZO1xuXHRcdGNsb25lZFhZWi52YWx1ZS56ID0gKGNsb25lZFhZWi52YWx1ZS56IC8gcmVmWikgYXMgWFlaX1o7XG5cblx0XHRjbG9uZWRYWVoudmFsdWUueCA9XG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueCA+IDAuMDA4ODU2XG5cdFx0XHRcdD8gKE1hdGgucG93KGNsb25lZFhZWi52YWx1ZS54LCAxIC8gMykgYXMgWFlaX1gpXG5cdFx0XHRcdDogKCg3Ljc4NyAqIGNsb25lZFhZWi52YWx1ZS54ICsgMTYgLyAxMTYpIGFzIFhZWl9YKTtcblx0XHRjbG9uZWRYWVoudmFsdWUueSA9XG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueSA+IDAuMDA4ODU2XG5cdFx0XHRcdD8gKE1hdGgucG93KGNsb25lZFhZWi52YWx1ZS55LCAxIC8gMykgYXMgWFlaX1kpXG5cdFx0XHRcdDogKCg3Ljc4NyAqIGNsb25lZFhZWi52YWx1ZS55ICsgMTYgLyAxMTYpIGFzIFhZWl9ZKTtcblx0XHRjbG9uZWRYWVoudmFsdWUueiA9XG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueiA+IDAuMDA4ODU2XG5cdFx0XHRcdD8gKE1hdGgucG93KGNsb25lZFhZWi52YWx1ZS56LCAxIC8gMykgYXMgWFlaX1opXG5cdFx0XHRcdDogKCg3Ljc4NyAqIGNsb25lZFhZWi52YWx1ZS56ICsgMTYgLyAxMTYpIGFzIFhZWl9aKTtcblxuXHRcdGNvbnN0IGwgPSBzYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0cGFyc2VGbG9hdCgoMTE2ICogY2xvbmVkWFlaLnZhbHVlLnkgLSAxNikudG9GaXhlZCgyKSlcblx0XHQpO1xuXHRcdGNvbnN0IGEgPSBzYW5pdGl6ZS5sYWIoXG5cdFx0XHRwYXJzZUZsb2F0KFxuXHRcdFx0XHQoNTAwICogKGNsb25lZFhZWi52YWx1ZS54IC0gY2xvbmVkWFlaLnZhbHVlLnkpKS50b0ZpeGVkKDIpXG5cdFx0XHQpLFxuXHRcdFx0J2EnXG5cdFx0KTtcblx0XHRjb25zdCBiID0gc2FuaXRpemUubGFiKFxuXHRcdFx0cGFyc2VGbG9hdChcblx0XHRcdFx0KDIwMCAqIChjbG9uZWRYWVoudmFsdWUueSAtIGNsb25lZFhZWi52YWx1ZS56KSkudG9GaXhlZCgyKVxuXHRcdFx0KSxcblx0XHRcdCdiJ1xuXHRcdCk7XG5cblx0XHRjb25zdCBsYWI6IExBQiA9IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGw6IGJyYW5kLmFzTEFCX0wobCksXG5cdFx0XHRcdGE6IGJyYW5kLmFzTEFCX0EoYSksXG5cdFx0XHRcdGI6IGJyYW5kLmFzTEFCX0IoYiksXG5cdFx0XHRcdGFscGhhOiB4eXoudmFsdWUuYWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0fTtcblxuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMobGFiKSkge1xuXHRcdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIExBQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGxhYil9YCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0TEFCQnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gbGFiO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmVycm9yTG9ncykgY29uc29sZS5lcnJvcihgeHl6VG9MYWIoKSBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBkZWZhdWx0TEFCQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiB4eXpUb1JHQih4eXo6IFhZWik6IFJHQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyh4eXopKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgSW52YWxpZCBYWVogdmFsdWUgJHtKU09OLnN0cmluZ2lmeSh4eXopfWApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRSR0JCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IHggPSAoeHl6LnZhbHVlLnggYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMTAwO1xuXHRcdGNvbnN0IHkgPSAoeHl6LnZhbHVlLnkgYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMTAwO1xuXHRcdGNvbnN0IHogPSAoeHl6LnZhbHVlLnogYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMTAwO1xuXG5cdFx0bGV0IHJlZCA9IHggKiAzLjI0MDYgKyB5ICogLTEuNTM3MiArIHogKiAtMC40OTg2O1xuXHRcdGxldCBncmVlbiA9IHggKiAtMC45Njg5ICsgeSAqIDEuODc1OCArIHogKiAwLjA0MTU7XG5cdFx0bGV0IGJsdWUgPSB4ICogMC4wNTU3ICsgeSAqIC0wLjIwNCArIHogKiAxLjA1NztcblxuXHRcdHJlZCA9IGFwcGx5R2FtbWFDb3JyZWN0aW9uKHJlZCk7XG5cdFx0Z3JlZW4gPSBhcHBseUdhbW1hQ29ycmVjdGlvbihncmVlbik7XG5cdFx0Ymx1ZSA9IGFwcGx5R2FtbWFDb3JyZWN0aW9uKGJsdWUpO1xuXG5cdFx0Y29uc3QgcmdiOiBSR0IgPSBjbGFtcFJHQih7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKHJlZCksXG5cdFx0XHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZShncmVlbiksXG5cdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKGJsdWUpLFxuXHRcdFx0XHRhbHBoYTogeHl6LnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHJnYjtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYHh5elRvUkdCIGVycm9yOiAke2Vycm9yfWApO1xuXHRcdH1cblx0XHRyZXR1cm4gZGVmYXVsdFJHQkJyYW5kZWQ7XG5cdH1cbn1cblxuLy8gKioqKioqKiogQlVORExFRCBDT05WRVJTSU9OIEZVTkNUSU9OUyAqKioqKioqKlxuXG5mdW5jdGlvbiBoc2xUbyhjb2xvcjogSFNMLCBjb2xvclNwYWNlOiBDb2xvclNwYWNlRXh0ZW5kZWQpOiBDb2xvciB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhjb2xvcikpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEludmFsaWQgY29sb3IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0UkdCQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRDb2xvciA9IGNsb25lKGNvbG9yKSBhcyBIU0w7XG5cblx0XHRzd2l0Y2ggKGNvbG9yU3BhY2UpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9DTVlLKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBoc2xUb0hleChjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gY2xvbmUoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGhzbFRvSFNWKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBoc2xUb0xBQihjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9SR0IoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y2FzZSAnc2wnOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9TTChjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdzdic6XG5cdFx0XHRcdHJldHVybiBoc2xUb1NWKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdHJldHVybiBoc2xUb1hZWihjbG9uZWRDb2xvcik7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29sb3IgZm9ybWF0Jyk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgaHNsVG8oKSBlcnJvcjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5mdW5jdGlvbiB0b0hTTChjb2xvcjogRXhjbHVkZTxDb2xvciwgU0wgfCBTVj4pOiBIU0wge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoY29sb3IpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBJbnZhbGlkIGNvbG9yIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWApO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjbG9uZShjb2xvcik7XG5cblx0XHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdHJldHVybiBjbXlrVG9IU0woY2xvbmVkQ29sb3IgYXMgQ01ZSyk7XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRyZXR1cm4gaGV4VG9IU0woY2xvbmVkQ29sb3IgYXMgSGV4KTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiBjbG9uZShjbG9uZWRDb2xvciBhcyBIU0wpO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGhzdlRvSFNMKGNsb25lZENvbG9yIGFzIEhTVik7XG5cdFx0XHRjYXNlICdsYWInOlxuXHRcdFx0XHRyZXR1cm4gbGFiVG9IU0woY2xvbmVkQ29sb3IgYXMgTEFCKTtcblx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdHJldHVybiByZ2JUb0hTTChjbG9uZWRDb2xvciBhcyBSR0IpO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIHh5elRvSFNMKGNsb25lZENvbG9yIGFzIFhZWik7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29sb3IgZm9ybWF0Jyk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgdG9IU0woKSBlcnJvcjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgY29udmVydDogQ29tbW9uQ29udmVydEZuQmFzZSA9IHtcblx0aHNsVG8sXG5cdHRvSFNMLFxuXHR3cmFwcGVyczoge1xuXHRcdGhleFRvSFNMOiBoZXhUb0hTTFdyYXBwZXJcblx0fVxufTtcbiJdfQ==