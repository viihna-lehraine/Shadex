// File: src/common/convert/base.js
import { applyGammaCorrection, clampRGB, hueToRGB } from '../helpers/conversion.js';
import { base, brand, brandColor, clone, sanitize, validate } from '../core/base.js';
import { componentToHex } from '../transform/base.js';
import { createLogger } from '../../logger/index.js';
import { defaults, mode } from '../data/base.js';
import { hexAlphaToNumericAlpha, stripHashFromHex } from '../utils/color.js';
const logger = await createLogger();
const logMode = mode.logging;
const defaultCMYKUnbranded = base.clone(defaults.colors.base.unbranded.cmyk);
const defaultHexUnbranded = base.clone(defaults.colors.base.unbranded.hex);
const defaultHSLUnbranded = base.clone(defaults.colors.base.unbranded.hsl);
const defaultHSVUnbranded = base.clone(defaults.colors.base.unbranded.hsv);
const defaultLABUnbranded = base.clone(defaults.colors.base.unbranded.lab);
const defaultRGBUnbranded = base.clone(defaults.colors.base.unbranded.rgb);
const defaultSLUnbranded = base.clone(defaults.colors.base.unbranded.sl);
const defaultSVUnbranded = base.clone(defaults.colors.base.unbranded.sv);
const defaultXYZUnbranded = base.clone(defaults.colors.base.unbranded.xyz);
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
            if (logMode.error)
                logger.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`, 'common > convert > base > cmykToHSL()');
            return defaultHSLBranded;
        }
        return rgbToHSL(cmykToRGB(base.clone(cmyk)));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`cmykToHSL() error: ${error}`, 'common > convert > base > cmykToHSL()');
        return defaultHSLBranded;
    }
}
function cmykToRGB(cmyk) {
    try {
        if (!validate.colorValues(cmyk)) {
            if (logMode.error)
                logger.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`, 'common > convert > base > cmykToRGB()');
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
        if (logMode.error)
            logger.error(`cmykToRGB error: ${error}`, 'common > convert > base > cmykToRGB()');
        return defaultRGBBranded;
    }
}
function hexToHSL(hex) {
    try {
        if (!validate.colorValues(hex)) {
            if (logMode.error)
                logger.error(`Invalid Hex value ${JSON.stringify(hex)}`, 'common > convert > base > hexToHSL()');
            return defaultHSLBranded;
        }
        return rgbToHSL(hexToRGB(base.clone(hex)));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`hexToHSL() error: ${error}`, 'common > convert > base > hexToHSL()');
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
        if (logMode.error) {
            logger.error(`Error converting hex to HSL: ${error}`, 'common > convert > base > hexToHSLWrapper()');
        }
        return defaultHSLBranded;
    }
}
function hexToRGB(hex) {
    try {
        if (!validate.colorValues(hex)) {
            if (logMode.error)
                logger.error(`Invalid Hex value ${JSON.stringify(hex)}`, 'common > convert > base > hexToRGB()');
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
        if (logMode.error)
            logger.error(`hexToRGB error: ${error}`, 'common > convert > base > hexToRGB()');
        return defaultRGBBranded;
    }
}
function hslToCMYK(hsl) {
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode.error)
                logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`, 'common > convert > base > hslToCMYK()');
            return defaultCMYKBranded;
        }
        return rgbToCMYK(hslToRGB(clone(hsl)));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`, 'common > convert > base > hslToCMYK()');
        return defaultCMYKBranded;
    }
}
function hslToHex(hsl) {
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode.error)
                logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`, 'common > convert > base > hslToHex()');
            return defaultHexBranded;
        }
        return rgbToHex(hslToRGB(clone(hsl)));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`hslToHex error: ${error}`, 'common > convert > base > hslToHex()');
        return defaultHexBranded;
    }
}
function hslToHSV(hsl) {
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode.error)
                logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`, 'common > convert > base > hslToHSV()');
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
        if (logMode.error)
            logger.error(`hslToHSV() error: ${error}`, 'common > convert > base > hslToHSV()');
        return defaultHSVBranded;
    }
}
function hslToLAB(hsl) {
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode.error)
                logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`, 'common > convert > base > hslToLAB()');
            return defaultLABBranded;
        }
        return xyzToLAB(rgbToXYZ(hslToRGB(clone(hsl))));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`hslToLab() error: ${error}`, 'common > convert > base > hslToLAB()');
        return defaultLABBranded;
    }
}
function hslToRGB(hsl) {
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode.error)
                logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`, 'common > convert > base > hslToRGB()');
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
        if (logMode.error)
            logger.error(`hslToRGB error: ${error}`, 'common > convert > base > hslToRGB()');
        return defaultRGBBranded;
    }
}
function hslToSL(hsl) {
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode.error)
                logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`, 'common > convert > base > hslToSL()');
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
        if (logMode.error)
            logger.error(`Error converting HSL to SL: ${error}`, 'common > convert > base > hslToSL()');
        return defaultSLBranded;
    }
}
function hslToSV(hsl) {
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode.error)
                logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`, 'common > convert > base > hslToSV()');
            return defaultSVBranded;
        }
        return hsvToSV(rgbToHSV(hslToRGB(clone(hsl))));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Error converting HSL to SV: ${error}`, 'common > convert > base > hslToSV()');
        return defaultSVBranded;
    }
}
function hslToXYZ(hsl) {
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode.error)
                logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`, 'common > convert > base > hslToXYZ()');
            return defaultXYZBranded;
        }
        return labToXYZ(hslToLAB(clone(hsl)));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`hslToXYZ error: ${error}`, 'common > convert > base > hslToXYZ()');
        return defaultXYZBranded;
    }
}
function hsvToHSL(hsv) {
    try {
        if (!validate.colorValues(hsv)) {
            if (logMode.error)
                logger.error(`Invalid HSV value ${JSON.stringify(hsv)}`, 'common > convert > base > hsvToHSL()');
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
        if (logMode.error)
            logger.error(`hsvToHSL() error: ${error}`, 'common > convert > base > hsvToHSL()');
        return defaultHSLBranded;
    }
}
function hsvToSV(hsv) {
    try {
        if (!validate.colorValues(hsv)) {
            if (logMode.error)
                logger.error(`Invalid HSV value ${JSON.stringify(hsv)}`, 'common > convert > base > hsvToSV()');
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
        if (logMode.error)
            logger.error(`Error converting HSV to SV: ${error}`, 'common > convert > base > hsvToSV()');
        return defaultSVBranded;
    }
}
function labToHSL(lab) {
    try {
        if (!validate.colorValues(lab)) {
            if (logMode.error)
                logger.error(`Invalid LAB value ${JSON.stringify(lab)}`, 'common > convert > base > labToHSL()');
            return defaultHSLBranded;
        }
        return rgbToHSL(labToRGB(clone(lab)));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`labToHSL() error: ${error}`, 'common > convert > base > labToHSL()');
        return defaultHSLBranded;
    }
}
function labToRGB(lab) {
    try {
        if (!validate.colorValues(lab)) {
            if (logMode.error)
                logger.error(`Invalid LAB value ${JSON.stringify(lab)}`, 'common > convert > base > labToRGB()');
            return defaultRGBBranded;
        }
        return xyzToRGB(labToXYZ(clone(lab)));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`labToRGB error: ${error}`, 'common > convert > base > labToRGB()');
        return defaultRGBBranded;
    }
}
function labToXYZ(lab) {
    try {
        if (!validate.colorValues(lab)) {
            if (logMode.error)
                logger.error(`Invalid LAB value ${JSON.stringify(lab)}`, 'common > convert > base > labToXYZ()');
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
        if (logMode.error)
            logger.error(`labToXYZ error: ${error}`, 'common > convert > base > labToXYZ()');
        return defaultXYZBranded;
    }
}
function rgbToCMYK(rgb) {
    try {
        if (!validate.colorValues(rgb)) {
            if (logMode.error)
                logger.error(`Invalid RGB value ${JSON.stringify(rgb)}`, 'common > convert > base > rgbToCMYK()');
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
            logger.info(`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(clone(cmyk))}`, 'common > convert > base > rgbToCMYK()');
        return cmyk;
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Error converting RGB to CMYK: ${error}`, 'common > convert > base > rgbToCMYK()');
        return defaultCMYKBranded;
    }
}
function rgbToHex(rgb) {
    try {
        if (!validate.colorValues(rgb)) {
            if (logMode.error)
                logger.error(`Invalid RGB value ${JSON.stringify(rgb)}`, 'common > convert > base > rgbToHex()');
            return defaultHexBranded;
        }
        const clonedRGB = clone(rgb);
        if ([
            clonedRGB.value.red,
            clonedRGB.value.green,
            clonedRGB.value.blue
        ].some(v => isNaN(v) || v < 0 || v > 255) ||
            [clonedRGB.value.alpha].some(v => isNaN(v) || v < 0 || v > 1)) {
            if (logMode.warn)
                logger.warn(`Invalid RGB values:\nR=${JSON.stringify(clonedRGB.value.red)}\nG=${JSON.stringify(clonedRGB.value.green)}\nB=${JSON.stringify(clonedRGB.value.blue)}\nA=${JSON.stringify(clonedRGB.value.alpha)}`, 'common > convert > base > rgbToHex()');
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
        if (logMode.error)
            logger.warn(`rgbToHex error: ${error}`, 'rgbToHex()');
        return defaultHexBranded;
    }
}
function rgbToHSL(rgb) {
    try {
        if (!validate.colorValues(rgb)) {
            if (logMode.error) {
                logger.error(`Invalid RGB value ${JSON.stringify(rgb)}`, 'common > convert > base > rgbToHSL()');
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
        if (logMode.error) {
            logger.error(`rgbToHSL() error: ${error}`, 'common > convert > base > rgbToHSL()');
        }
        return defaultHSLBranded;
    }
}
function rgbToHSV(rgb) {
    try {
        if (!validate.colorValues(rgb)) {
            if (logMode.error) {
                logger.error(`Invalid RGB value ${JSON.stringify(rgb)}`, 'common > convert > base > rgbToHSV()');
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
        if (logMode.error) {
            logger.error(`rgbToHSV() error: ${error}`, 'common > convert > base > rgbToHSV()');
        }
        return defaultHSVBranded;
    }
}
function rgbToXYZ(rgb) {
    try {
        if (!validate.colorValues(rgb)) {
            if (logMode.error) {
                logger.error(`Invalid RGB value ${JSON.stringify(rgb)}`, 'rgbToXYZ()');
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
        if (logMode.error) {
            logger.error(`rgbToXYZ error: ${error}`, 'common > convert > base > rgbToXYZ()');
        }
        return defaultXYZBranded;
    }
}
function xyzToHSL(xyz) {
    try {
        if (!validate.colorValues(xyz)) {
            if (logMode.error)
                logger.error(`Invalid XYZ value ${JSON.stringify(xyz)}`, 'common > convert > base > xyzToHSL()');
            return defaultHSLBranded;
        }
        return rgbToHSL(xyzToRGB(clone(xyz)));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`xyzToHSL() error: ${error}`, 'common > convert > base > xyzToHSL()');
        return defaultHSLBranded;
    }
}
function xyzToLAB(xyz) {
    try {
        if (!validate.colorValues(xyz)) {
            if (logMode.error)
                logger.error(`Invalid XYZ value ${JSON.stringify(xyz)}`, 'common > convert > base > xyzToLAB()');
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
            if (logMode.error)
                logger.error(`Invalid LAB value ${JSON.stringify(lab)}`, 'xyzToLAB()');
            return defaultLABBranded;
        }
        return lab;
    }
    catch (error) {
        if (logMode.error)
            logger.error(`xyzToLab() error: ${error}`, 'common > convert > base > xyzToLAB()');
        return defaultLABBranded;
    }
}
function xyzToRGB(xyz) {
    try {
        if (!validate.colorValues(xyz)) {
            if (logMode.error) {
                logger.error(`Invalid XYZ value ${JSON.stringify(xyz)}`, 'common > convert > base > xyzToRGB()');
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
        if (logMode.error) {
            logger.error(`xyzToRGB error: ${error}`, 'common > convert > base > xyzToRGB()');
        }
        return defaultRGBBranded;
    }
}
// ******** BUNDLED CONVERSION FUNCTIONS ********
function hslTo(color, colorSpace) {
    try {
        if (!validate.colorValues(color)) {
            logger.error(`Invalid color value ${JSON.stringify(color)}`, 'hslTo()');
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
            logger.error(`Invalid color value ${JSON.stringify(color)}`, 'toHSL()');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vY29udmVydC9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG1DQUFtQztBQW1CbkMsT0FBTyxFQUNOLG9CQUFvQixFQUNwQixRQUFRLEVBQ1IsUUFBUSxFQUNSLE1BQU0sMEJBQTBCLENBQUM7QUFDbEMsT0FBTyxFQUNOLElBQUksRUFDSixLQUFLLEVBQ0wsVUFBVSxFQUNWLEtBQUssRUFDTCxRQUFRLEVBQ1IsUUFBUSxFQUNSLE1BQU0saUJBQWlCLENBQUM7QUFDekIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRTdFLE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxFQUFFLENBQUM7QUFFcEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUU3QixNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdFLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0UsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzRSxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxL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QUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFVLENBQUM7UUFDeEQsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQVUsQ0FBQztRQUN4RCxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBVSxDQUFDO1FBRXhELFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQixTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxRQUFRO2dCQUMzQixDQUFDLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFXO2dCQUMvQyxDQUFDLENBQUUsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBVyxDQUFDO1FBQ3RELFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQixTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxRQUFRO2dCQUMzQixDQUFDLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFXO2dCQUMvQyxDQUFDLENBQUUsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBVyxDQUFDO1FBQ3RELFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQixTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxRQUFRO2dCQUMzQixDQUFDLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFXO2dCQUMvQyxDQUFDLENBQUUsQ0FBQyxLQUFLLEdBQUcsU0FBUyxD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LE1BQU0sT0FBTyxHQUE4QztJQUNqRSxLQUFLO0lBQ0wsS0FBSztJQUNMLFFBQVEsRUFBRTtRQUNULFFBQVEsRUFBRSxlQUFlO0tBQ3pCO0NBQ0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9jb21tb24vY29udmVydC9iYXNlLmpzXG5cbmltcG9ydCB7XG5cdENNWUssXG5cdENvbG9yLFxuXHRDb2xvclNwYWNlRXh0ZW5kZWQsXG5cdENvbW1vbkZ1bmN0aW9uc01hc3RlckludGVyZmFjZSxcblx0SGV4LFxuXHRIU0wsXG5cdEhTVixcblx0TEFCLFxuXHRSR0IsXG5cdFNMLFxuXHRTVixcblx0WFlaLFxuXHRYWVpfWCxcblx0WFlaX1ksXG5cdFhZWl9aXG59IGZyb20gJy4uLy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7XG5cdGFwcGx5R2FtbWFDb3JyZWN0aW9uLFxuXHRjbGFtcFJHQixcblx0aHVlVG9SR0Jcbn0gZnJvbSAnLi4vaGVscGVycy9jb252ZXJzaW9uLmpzJztcbmltcG9ydCB7XG5cdGJhc2UsXG5cdGJyYW5kLFxuXHRicmFuZENvbG9yLFxuXHRjbG9uZSxcblx0c2FuaXRpemUsXG5cdHZhbGlkYXRlXG59IGZyb20gJy4uL2NvcmUvYmFzZS5qcyc7XG5pbXBvcnQgeyBjb21wb25lbnRUb0hleCB9IGZyb20gJy4uL3RyYW5zZm9ybS9iYXNlLmpzJztcbmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJy4uLy4uL2xvZ2dlci9pbmRleC5qcyc7XG5pbXBvcnQgeyBkZWZhdWx0cywgbW9kZSB9IGZyb20gJy4uL2RhdGEvYmFzZS5qcyc7XG5pbXBvcnQgeyBoZXhBbHBoYVRvTnVtZXJpY0FscGhhLCBzdHJpcEhhc2hGcm9tSGV4IH0gZnJvbSAnLi4vdXRpbHMvY29sb3IuanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcblxuY29uc3QgZGVmYXVsdENNWUtVbmJyYW5kZWQgPSBiYXNlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5iYXNlLnVuYnJhbmRlZC5jbXlrKTtcbmNvbnN0IGRlZmF1bHRIZXhVbmJyYW5kZWQgPSBiYXNlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5iYXNlLnVuYnJhbmRlZC5oZXgpO1xuY29uc3QgZGVmYXVsdEhTTFVuYnJhbmRlZCA9IGJhc2UuY2xvbmUoZGVmYXVsdHMuY29sb3JzLmJhc2UudW5icmFuZGVkLmhzbCk7XG5jb25zdCBkZWZhdWx0SFNWVW5icmFuZGVkID0gYmFzZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuYmFzZS51bmJyYW5kZWQuaHN2KTtcbmNvbnN0IGRlZmF1bHRMQUJVbmJyYW5kZWQgPSBiYXNlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5iYXNlLnVuYnJhbmRlZC5sYWIpO1xuY29uc3QgZGVmYXVsdFJHQlVuYnJhbmRlZCA9IGJhc2UuY2xvbmUoZGVmYXVsdHMuY29sb3JzLmJhc2UudW5icmFuZGVkLnJnYik7XG5jb25zdCBkZWZhdWx0U0xVbmJyYW5kZWQgPSBiYXNlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5iYXNlLnVuYnJhbmRlZC5zbCk7XG5jb25zdCBkZWZhdWx0U1ZVbmJyYW5kZWQgPSBiYXNlLmNsb25lKGRlZmF1bHRzLmNvbG9ycy5iYXNlLnVuYnJhbmRlZC5zdik7XG5jb25zdCBkZWZhdWx0WFlaVW5icmFuZGVkID0gYmFzZS5jbG9uZShkZWZhdWx0cy5jb2xvcnMuYmFzZS51bmJyYW5kZWQueHl6KTtcblxuY29uc3QgZGVmYXVsdENNWUtCcmFuZGVkID0gYnJhbmRDb2xvci5hc0NNWUsoZGVmYXVsdENNWUtVbmJyYW5kZWQpO1xuY29uc3QgZGVmYXVsdEhleEJyYW5kZWQgPSBicmFuZENvbG9yLmFzSGV4KGRlZmF1bHRIZXhVbmJyYW5kZWQpO1xuY29uc3QgZGVmYXVsdEhTTEJyYW5kZWQgPSBicmFuZENvbG9yLmFzSFNMKGRlZmF1bHRIU0xVbmJyYW5kZWQpO1xuY29uc3QgZGVmYXVsdEhTVkJyYW5kZWQgPSBicmFuZENvbG9yLmFzSFNWKGRlZmF1bHRIU1ZVbmJyYW5kZWQpO1xuY29uc3QgZGVmYXVsdExBQkJyYW5kZWQgPSBicmFuZENvbG9yLmFzTEFCKGRlZmF1bHRMQUJVbmJyYW5kZWQpO1xuY29uc3QgZGVmYXVsdFJHQkJyYW5kZWQgPSBicmFuZENvbG9yLmFzUkdCKGRlZmF1bHRSR0JVbmJyYW5kZWQpO1xuY29uc3QgZGVmYXVsdFNMQnJhbmRlZCA9IGJyYW5kQ29sb3IuYXNTTChkZWZhdWx0U0xVbmJyYW5kZWQpO1xuY29uc3QgZGVmYXVsdFNWQnJhbmRlZCA9IGJyYW5kQ29sb3IuYXNTVihkZWZhdWx0U1ZVbmJyYW5kZWQpO1xuY29uc3QgZGVmYXVsdFhZWkJyYW5kZWQgPSBicmFuZENvbG9yLmFzWFlaKGRlZmF1bHRYWVpVbmJyYW5kZWQpO1xuXG5mdW5jdGlvbiBjbXlrVG9IU0woY215azogQ01ZSyk6IEhTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhjbXlrKSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgSW52YWxpZCBDTVlLIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY215ayl9YCxcblx0XHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiBjbXlrVG9IU0woKSdcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiByZ2JUb0hTTChjbXlrVG9SR0IoYmFzZS5jbG9uZShjbXlrKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgY215a1RvSFNMKCkgZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0J2NvbW1vbiA+IGNvbnZlcnQgPiBiYXNlID4gY215a1RvSFNMKCknXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNteWtUb1JHQihjbXlrOiBDTVlLKTogUkdCIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGNteWspKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIENNWUsgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjbXlrKX1gLFxuXHRcdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IGNteWtUb1JHQigpJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFJHQkJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkQ01ZSyA9IGJhc2UuY2xvbmUoY215ayk7XG5cdFx0Y29uc3QgciA9XG5cdFx0XHQyNTUgKlxuXHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLmN5YW4gLyAxMDApICpcblx0XHRcdCgxIC0gY2xvbmVkQ01ZSy52YWx1ZS5rZXkgLyAxMDApO1xuXHRcdGNvbnN0IGcgPVxuXHRcdFx0MjU1ICpcblx0XHRcdCgxIC0gY2xvbmVkQ01ZSy52YWx1ZS5tYWdlbnRhIC8gMTAwKSAqXG5cdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUua2V5IC8gMTAwKTtcblx0XHRjb25zdCBiID1cblx0XHRcdDI1NSAqXG5cdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUueWVsbG93IC8gMTAwKSAqXG5cdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUua2V5IC8gMTAwKTtcblx0XHRjb25zdCBhbHBoYSA9IGNteWsudmFsdWUuYWxwaGE7XG5cdFx0Y29uc3QgcmdiOiBSR0IgPSB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKE1hdGgucm91bmQocikpLFxuXHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UoTWF0aC5yb3VuZChnKSksXG5cdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKE1hdGgucm91bmQoYikpLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKGFscGhhKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9O1xuXG5cdFx0cmV0dXJuIGNsYW1wUkdCKHJnYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBjbXlrVG9SR0IgZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0J2NvbW1vbiA+IGNvbnZlcnQgPiBiYXNlID4gY215a1RvUkdCKCknXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRSR0JCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleFRvSFNMKGhleDogSGV4KTogSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGhleCkpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgSGV4IHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaGV4KX1gLFxuXHRcdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IGhleFRvSFNMKCknXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0SFNMQnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IU0woaGV4VG9SR0IoYmFzZS5jbG9uZShoZXgpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBoZXhUb0hTTCgpIGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IGhleFRvSFNMKCknXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhleFRvSFNMV3JhcHBlcihpbnB1dDogc3RyaW5nIHwgSGV4KTogSFNMIHtcblx0dHJ5IHtcblx0XHRjb25zdCBjbG9uZWRJbnB1dCA9IGJhc2UuY2xvbmUoaW5wdXQpO1xuXG5cdFx0Y29uc3QgaGV4OiBIZXggPVxuXHRcdFx0dHlwZW9mIGNsb25lZElucHV0ID09PSAnc3RyaW5nJ1xuXHRcdFx0XHQ/IHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoY2xvbmVkSW5wdXQpLFxuXHRcdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoY2xvbmVkSW5wdXQuc2xpY2UoLTIpKSxcblx0XHRcdFx0XHRcdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRoZXhBbHBoYVRvTnVtZXJpY0FscGhhKGNsb25lZElucHV0LnNsaWNlKC0yKSlcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdDoge1xuXHRcdFx0XHRcdFx0Li4uY2xvbmVkSW5wdXQsXG5cdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHQuLi5jbG9uZWRJbnB1dC52YWx1ZSxcblx0XHRcdFx0XHRcdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRoZXhBbHBoYVRvTnVtZXJpY0FscGhhKFxuXHRcdFx0XHRcdFx0XHRcdFx0U3RyaW5nKGNsb25lZElucHV0LnZhbHVlLmFscGhhKVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cblx0XHRyZXR1cm4gaGV4VG9IU0woaGV4KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcikge1xuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgRXJyb3IgY29udmVydGluZyBoZXggdG8gSFNMOiAke2Vycm9yfWAsXG5cdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IGhleFRvSFNMV3JhcHBlcigpJ1xuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4VG9SR0IoaGV4OiBIZXgpOiBSR0Ige1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoaGV4KSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgSW52YWxpZCBIZXggdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoZXgpfWAsXG5cdFx0XHRcdFx0J2NvbW1vbiA+IGNvbnZlcnQgPiBiYXNlID4gaGV4VG9SR0IoKSdcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRSR0JCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZEhleCA9IGNsb25lKGhleCk7XG5cdFx0Y29uc3Qgc3RyaXBwZWRIZXggPSBzdHJpcEhhc2hGcm9tSGV4KGNsb25lZEhleCkudmFsdWUuaGV4O1xuXHRcdGNvbnN0IGJpZ2ludCA9IHBhcnNlSW50KHN0cmlwcGVkSGV4LCAxNik7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZShNYXRoLnJvdW5kKChiaWdpbnQgPj4gMTYpICYgMjU1KSksXG5cdFx0XHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZShNYXRoLnJvdW5kKChiaWdpbnQgPj4gOCkgJiAyNTUpKSxcblx0XHRcdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2UoTWF0aC5yb3VuZChiaWdpbnQgJiAyNTUpKSxcblx0XHRcdFx0YWxwaGE6IGhleC52YWx1ZS5udW1BbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgaGV4VG9SR0IgZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0J2NvbW1vbiA+IGNvbnZlcnQgPiBiYXNlID4gaGV4VG9SR0IoKSdcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdFJHQkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9DTVlLKGhzbDogSFNMKTogQ01ZSyB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCxcblx0XHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiBoc2xUb0NNWUsoKSdcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRDTVlLQnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9DTVlLKGhzbFRvUkdCKGNsb25lKGhzbCkpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEVycm9yIGNvbnZlcnRpbmcgSFNMICR7SlNPTi5zdHJpbmdpZnkoaHNsKX0gdG8gQ01ZSzogJHtlcnJvcn1gLFxuXHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiBoc2xUb0NNWUsoKSdcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdENNWUtCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvSGV4KGhzbDogSFNMKTogSGV4IHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gLFxuXHRcdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IGhzbFRvSGV4KCknXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0SGV4QnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IZXgoaHNsVG9SR0IoY2xvbmUoaHNsKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgaHNsVG9IZXggZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0J2NvbW1vbiA+IGNvbnZlcnQgPiBiYXNlID4gaHNsVG9IZXgoKSdcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdEhleEJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9IU1YoaHNsOiBIU0wpOiBIU1Yge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWAsXG5cdFx0XHRcdFx0J2NvbW1vbiA+IGNvbnZlcnQgPiBiYXNlID4gaHNsVG9IU1YoKSdcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIU1ZCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZEhTTCA9IGNsb25lKGhzbCk7XG5cdFx0Y29uc3QgcyA9IGNsb25lZEhTTC52YWx1ZS5zYXR1cmF0aW9uIC8gMTAwO1xuXHRcdGNvbnN0IGwgPSBjbG9uZWRIU0wudmFsdWUubGlnaHRuZXNzIC8gMTAwO1xuXHRcdGNvbnN0IHZhbHVlID0gbCArIHMgKiBNYXRoLm1pbihsLCAxIC0gMSk7XG5cdFx0Y29uc3QgbmV3U2F0dXJhdGlvbiA9IHZhbHVlID09PSAwID8gMCA6IDIgKiAoMSAtIGwgLyB2YWx1ZSk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChNYXRoLnJvdW5kKGNsb25lZEhTTC52YWx1ZS5odWUpKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQobmV3U2F0dXJhdGlvbiAqIDEwMCkpLFxuXHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQodmFsdWUgKiAxMDApKSxcblx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShoc2wudmFsdWUuYWxwaGEpXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBoc2xUb0hTVigpIGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IGhzbFRvSFNWKCknXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRIU1ZCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvTEFCKGhzbDogSFNMKTogTEFCIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gLFxuXHRcdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IGhzbFRvTEFCKCknXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0TEFCQnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4geHl6VG9MQUIocmdiVG9YWVooaHNsVG9SR0IoY2xvbmUoaHNsKSkpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YGhzbFRvTGFiKCkgZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0J2NvbW1vbiA+IGNvbnZlcnQgPiBiYXNlID4gaHNsVG9MQUIoKSdcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdExBQkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9SR0IoaHNsOiBIU0wpOiBSR0Ige1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWAsXG5cdFx0XHRcdFx0J2NvbW1vbiA+IGNvbnZlcnQgPiBiYXNlID4gaHNsVG9SR0IoKSdcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRSR0JCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZEhTTCA9IGNsb25lKGhzbCk7XG5cdFx0Y29uc3QgcyA9IGNsb25lZEhTTC52YWx1ZS5zYXR1cmF0aW9uIC8gMTAwO1xuXHRcdGNvbnN0IGwgPSBjbG9uZWRIU0wudmFsdWUubGlnaHRuZXNzIC8gMTAwO1xuXHRcdGNvbnN0IHEgPSBsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzO1xuXHRcdGNvbnN0IHAgPSAyICogbCAtIHE7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZShcblx0XHRcdFx0XHRNYXRoLnJvdW5kKFxuXHRcdFx0XHRcdFx0aHVlVG9SR0IocCwgcSwgY2xvbmVkSFNMLnZhbHVlLmh1ZSArIDEgLyAzKSAqIDI1NVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KSxcblx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdE1hdGgucm91bmQoaHVlVG9SR0IocCwgcSwgY2xvbmVkSFNMLnZhbHVlLmh1ZSkgKiAyNTUpXG5cdFx0XHRcdCksXG5cdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdE1hdGgucm91bmQoXG5cdFx0XHRcdFx0XHRodWVUb1JHQihwLCBxLCBjbG9uZWRIU0wudmFsdWUuaHVlIC0gMSAvIDMpICogMjU1XG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKGhzbC52YWx1ZS5hbHBoYSlcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YGhzbFRvUkdCIGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IGhzbFRvUkdCKCknXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRSR0JCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvU0woaHNsOiBIU0wpOiBTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCxcblx0XHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiBoc2xUb1NMKCknXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0U0xCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRzYXR1cmF0aW9uOiBoc2wudmFsdWUuc2F0dXJhdGlvbixcblx0XHRcdFx0bGlnaHRuZXNzOiBoc2wudmFsdWUubGlnaHRuZXNzLFxuXHRcdFx0XHRhbHBoYTogaHNsLnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnc2wnIGFzICdzbCdcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgRXJyb3IgY29udmVydGluZyBIU0wgdG8gU0w6ICR7ZXJyb3J9YCxcblx0XHRcdFx0J2NvbW1vbiA+IGNvbnZlcnQgPiBiYXNlID4gaHNsVG9TTCgpJ1xuXHRcdFx0KTtcblxuXHRcdHJldHVybiBkZWZhdWx0U0xCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvU1YoaHNsOiBIU0wpOiBTViB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCxcblx0XHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiBoc2xUb1NWKCknXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0U1ZCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiBoc3ZUb1NWKHJnYlRvSFNWKGhzbFRvUkdCKGNsb25lKGhzbCkpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBFcnJvciBjb252ZXJ0aW5nIEhTTCB0byBTVjogJHtlcnJvcn1gLFxuXHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiBoc2xUb1NWKCknXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRTVkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9YWVooaHNsOiBIU0wpOiBYWVoge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWAsXG5cdFx0XHRcdFx0J2NvbW1vbiA+IGNvbnZlcnQgPiBiYXNlID4gaHNsVG9YWVooKSdcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRYWVpCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiBsYWJUb1hZWihoc2xUb0xBQihjbG9uZShoc2wpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBoc2xUb1hZWiBlcnJvcjogJHtlcnJvcn1gLFxuXHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiBoc2xUb1hZWigpJ1xuXHRcdFx0KTtcblxuXHRcdHJldHVybiBkZWZhdWx0WFlaQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBoc3ZUb0hTTChoc3Y6IEhTVik6IEhTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc3YpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIEhTViB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzdil9YCxcblx0XHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiBoc3ZUb0hTTCgpJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY2xvbmVkSFNWID0gY2xvbmUoaHN2KTtcblx0XHRjb25zdCBuZXdTYXR1cmF0aW9uID1cblx0XHRcdGNsb25lZEhTVi52YWx1ZS52YWx1ZSAqICgxIC0gY2xvbmVkSFNWLnZhbHVlLnNhdHVyYXRpb24gLyAxMDApID09PVxuXHRcdFx0XHQwIHx8IGNsb25lZEhTVi52YWx1ZS52YWx1ZSA9PT0gMFxuXHRcdFx0XHQ/IDBcblx0XHRcdFx0OiAoY2xvbmVkSFNWLnZhbHVlLnZhbHVlIC1cblx0XHRcdFx0XHRcdGNsb25lZEhTVi52YWx1ZS52YWx1ZSAqXG5cdFx0XHRcdFx0XHRcdCgxIC0gY2xvbmVkSFNWLnZhbHVlLnNhdHVyYXRpb24gLyAxMDApKSAvXG5cdFx0XHRcdFx0TWF0aC5taW4oXG5cdFx0XHRcdFx0XHRjbG9uZWRIU1YudmFsdWUudmFsdWUsXG5cdFx0XHRcdFx0XHQxMDAgLSBjbG9uZWRIU1YudmFsdWUudmFsdWVcblx0XHRcdFx0XHQpO1xuXHRcdGNvbnN0IGxpZ2h0bmVzcyA9XG5cdFx0XHRjbG9uZWRIU1YudmFsdWUudmFsdWUgKiAoMSAtIGNsb25lZEhTVi52YWx1ZS5zYXR1cmF0aW9uIC8gMjAwKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKE1hdGgucm91bmQoY2xvbmVkSFNWLnZhbHVlLmh1ZSkpLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoTWF0aC5yb3VuZChuZXdTYXR1cmF0aW9uICogMTAwKSksXG5cdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQobGlnaHRuZXNzKSksXG5cdFx0XHRcdGFscGhhOiBoc3YudmFsdWUuYWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YGhzdlRvSFNMKCkgZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0J2NvbW1vbiA+IGNvbnZlcnQgPiBiYXNlID4gaHN2VG9IU0woKSdcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHN2VG9TVihoc3Y6IEhTVik6IFNWIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGhzdikpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgSFNWIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHN2KX1gLFxuXHRcdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IGhzdlRvU1YoKSdcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRTVkJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHNhdHVyYXRpb246IGhzdi52YWx1ZS5zYXR1cmF0aW9uLFxuXHRcdFx0XHR2YWx1ZTogaHN2LnZhbHVlLnZhbHVlLFxuXHRcdFx0XHRhbHBoYTogaHN2LnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnc3YnIGFzICdzdidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgRXJyb3IgY29udmVydGluZyBIU1YgdG8gU1Y6ICR7ZXJyb3J9YCxcblx0XHRcdFx0J2NvbW1vbiA+IGNvbnZlcnQgPiBiYXNlID4gaHN2VG9TVigpJ1xuXHRcdFx0KTtcblxuXHRcdHJldHVybiBkZWZhdWx0U1ZCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGxhYlRvSFNMKGxhYjogTEFCKTogSFNMIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGxhYikpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gLFxuXHRcdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IGxhYlRvSFNMKCknXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0SFNMQnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IU0wobGFiVG9SR0IoY2xvbmUobGFiKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgbGFiVG9IU0woKSBlcnJvcjogJHtlcnJvcn1gLFxuXHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiBsYWJUb0hTTCgpJ1xuXHRcdFx0KTtcblxuXHRcdHJldHVybiBkZWZhdWx0SFNMQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBsYWJUb1JHQihsYWI6IExBQik6IFJHQiB7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhsYWIpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIExBQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGxhYil9YCxcblx0XHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiBsYWJUb1JHQigpJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFJHQkJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHh5elRvUkdCKGxhYlRvWFlaKGNsb25lKGxhYikpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YGxhYlRvUkdCIGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IGxhYlRvUkdCKCknXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRSR0JCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGxhYlRvWFlaKGxhYjogTEFCKTogWFlaIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGxhYikpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gLFxuXHRcdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IGxhYlRvWFlaKCknXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0WFlaQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRMQUIgPSBjbG9uZShsYWIpO1xuXHRcdGNvbnN0IHJlZlggPSA5NS4wNDcsXG5cdFx0XHRyZWZZID0gMTAwLjAsXG5cdFx0XHRyZWZaID0gMTA4Ljg4MztcblxuXHRcdGxldCB5ID0gKGNsb25lZExBQi52YWx1ZS5sICsgMTYpIC8gMTE2O1xuXHRcdGxldCB4ID0gY2xvbmVkTEFCLnZhbHVlLmEgLyA1MDAgKyB5O1xuXHRcdGxldCB6ID0geSAtIGNsb25lZExBQi52YWx1ZS5iIC8gMjAwO1xuXG5cdFx0Y29uc3QgcG93ID0gTWF0aC5wb3c7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0eDogYnJhbmQuYXNYWVpfWChcblx0XHRcdFx0XHRNYXRoLnJvdW5kKFxuXHRcdFx0XHRcdFx0cmVmWCAqXG5cdFx0XHRcdFx0XHRcdChwb3coeCwgMykgPiAwLjAwODg1NlxuXHRcdFx0XHRcdFx0XHRcdD8gcG93KHgsIDMpXG5cdFx0XHRcdFx0XHRcdFx0OiAoeCAtIDE2IC8gMTE2KSAvIDcuNzg3KVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KSxcblx0XHRcdFx0eTogYnJhbmQuYXNYWVpfWShcblx0XHRcdFx0XHRNYXRoLnJvdW5kKFxuXHRcdFx0XHRcdFx0cmVmWSAqXG5cdFx0XHRcdFx0XHRcdChwb3coeSwgMykgPiAwLjAwODg1NlxuXHRcdFx0XHRcdFx0XHRcdD8gcG93KHksIDMpXG5cdFx0XHRcdFx0XHRcdFx0OiAoeSAtIDE2IC8gMTE2KSAvIDcuNzg3KVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KSxcblx0XHRcdFx0ejogYnJhbmQuYXNYWVpfWihcblx0XHRcdFx0XHRNYXRoLnJvdW5kKFxuXHRcdFx0XHRcdFx0cmVmWiAqXG5cdFx0XHRcdFx0XHRcdChwb3coeiwgMykgPiAwLjAwODg1NlxuXHRcdFx0XHRcdFx0XHRcdD8gcG93KHosIDMpXG5cdFx0XHRcdFx0XHRcdFx0OiAoeiAtIDE2IC8gMTE2KSAvIDcuNzg3KVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KSxcblx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShsYWIudmFsdWUuYWxwaGEpXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBsYWJUb1hZWiBlcnJvcjogJHtlcnJvcn1gLFxuXHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiBsYWJUb1hZWigpJ1xuXHRcdFx0KTtcblxuXHRcdHJldHVybiBkZWZhdWx0WFlaQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiByZ2JUb0NNWUsocmdiOiBSR0IpOiBDTVlLIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKHJnYikpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX1gLFxuXHRcdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IHJnYlRvQ01ZSygpJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdENNWUtCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZFJHQiA9IGNsb25lKHJnYik7XG5cblx0XHRjb25zdCByZWRQcmltZSA9IGNsb25lZFJHQi52YWx1ZS5yZWQgLyAyNTU7XG5cdFx0Y29uc3QgZ3JlZW5QcmltZSA9IGNsb25lZFJHQi52YWx1ZS5ncmVlbiAvIDI1NTtcblx0XHRjb25zdCBibHVlUHJpbWUgPSBjbG9uZWRSR0IudmFsdWUuYmx1ZSAvIDI1NTtcblxuXHRcdGNvbnN0IGtleSA9IHNhbml0aXplLnBlcmNlbnRpbGUoXG5cdFx0XHRNYXRoLnJvdW5kKDEgLSBNYXRoLm1heChyZWRQcmltZSwgZ3JlZW5QcmltZSwgYmx1ZVByaW1lKSlcblx0XHQpO1xuXHRcdGNvbnN0IGN5YW4gPSBzYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0TWF0aC5yb3VuZCgoMSAtIHJlZFByaW1lIC0ga2V5KSAvICgxIC0ga2V5KSB8fCAwKVxuXHRcdCk7XG5cdFx0Y29uc3QgbWFnZW50YSA9IHNhbml0aXplLnBlcmNlbnRpbGUoXG5cdFx0XHRNYXRoLnJvdW5kKCgxIC0gZ3JlZW5QcmltZSAtIGtleSkgLyAoMSAtIGtleSkgfHwgMClcblx0XHQpO1xuXHRcdGNvbnN0IHllbGxvdyA9IHNhbml0aXplLnBlcmNlbnRpbGUoXG5cdFx0XHRNYXRoLnJvdW5kKCgxIC0gYmx1ZVByaW1lIC0ga2V5KSAvICgxIC0ga2V5KSB8fCAwKVxuXHRcdCk7XG5cdFx0Y29uc3QgYWxwaGEgPSBicmFuZC5hc0FscGhhUmFuZ2UocmdiLnZhbHVlLmFscGhhKTtcblx0XHRjb25zdCBmb3JtYXQ6ICdjbXlrJyA9ICdjbXlrJztcblxuXHRcdGNvbnN0IGNteWsgPSB7IHZhbHVlOiB7IGN5YW4sIG1hZ2VudGEsIHllbGxvdywga2V5LCBhbHBoYSB9LCBmb3JtYXQgfTtcblxuXHRcdGlmICghbW9kZS5xdWlldClcblx0XHRcdGxvZ2dlci5pbmZvKFxuXHRcdFx0XHRgQ29udmVydGVkIFJHQiAke0pTT04uc3RyaW5naWZ5KGNsb25lZFJHQil9IHRvIENNWUs6ICR7SlNPTi5zdHJpbmdpZnkoY2xvbmUoY215aykpfWAsXG5cdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IHJnYlRvQ01ZSygpJ1xuXHRcdFx0KTtcblxuXHRcdHJldHVybiBjbXlrO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgRXJyb3IgY29udmVydGluZyBSR0IgdG8gQ01ZSzogJHtlcnJvcn1gLFxuXHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiByZ2JUb0NNWUsoKSdcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdENNWUtCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJnYlRvSGV4KHJnYjogUkdCKTogSGV4IHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKHJnYikpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX1gLFxuXHRcdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IHJnYlRvSGV4KCknXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0SGV4QnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRSR0IgPSBjbG9uZShyZ2IpO1xuXG5cdFx0aWYgKFxuXHRcdFx0W1xuXHRcdFx0XHRjbG9uZWRSR0IudmFsdWUucmVkLFxuXHRcdFx0XHRjbG9uZWRSR0IudmFsdWUuZ3JlZW4sXG5cdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5ibHVlXG5cdFx0XHRdLnNvbWUodiA9PiBpc05hTih2KSB8fCB2IDwgMCB8fCB2ID4gMjU1KSB8fFxuXHRcdFx0W2Nsb25lZFJHQi52YWx1ZS5hbHBoYV0uc29tZSh2ID0+IGlzTmFOKHYpIHx8IHYgPCAwIHx8IHYgPiAxKVxuXHRcdCkge1xuXHRcdFx0aWYgKGxvZ01vZGUud2Fybilcblx0XHRcdFx0bG9nZ2VyLndhcm4oXG5cdFx0XHRcdFx0YEludmFsaWQgUkdCIHZhbHVlczpcXG5SPSR7SlNPTi5zdHJpbmdpZnkoY2xvbmVkUkdCLnZhbHVlLnJlZCl9XFxuRz0ke0pTT04uc3RyaW5naWZ5KGNsb25lZFJHQi52YWx1ZS5ncmVlbil9XFxuQj0ke0pTT04uc3RyaW5naWZ5KGNsb25lZFJHQi52YWx1ZS5ibHVlKX1cXG5BPSR7SlNPTi5zdHJpbmdpZnkoY2xvbmVkUkdCLnZhbHVlLmFscGhhKX1gLFxuXHRcdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IHJnYlRvSGV4KCknXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldCgnIzAwMDAwMEZGJyksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzSGV4Q29tcG9uZW50KCdGRicpLFxuXHRcdFx0XHRcdG51bUFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaGV4JyBhcyAnaGV4J1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldChcblx0XHRcdFx0XHRgIyR7Y29tcG9uZW50VG9IZXgoY2xvbmVkUkdCLnZhbHVlLnJlZCl9JHtjb21wb25lbnRUb0hleChjbG9uZWRSR0IudmFsdWUuZ3JlZW4pfSR7Y29tcG9uZW50VG9IZXgoY2xvbmVkUkdCLnZhbHVlLmJsdWUpfWBcblx0XHRcdFx0KSxcblx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzSGV4Q29tcG9uZW50KFxuXHRcdFx0XHRcdGNvbXBvbmVudFRvSGV4KGNsb25lZFJHQi52YWx1ZS5hbHBoYSlcblx0XHRcdFx0KSxcblx0XHRcdFx0bnVtQWxwaGE6IGNsb25lZFJHQi52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hleCcgYXMgJ2hleCdcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLndhcm4oYHJnYlRvSGV4IGVycm9yOiAke2Vycm9yfWAsICdyZ2JUb0hleCgpJyk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdEhleEJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9IU0wocmdiOiBSR0IpOiBIU0wge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMocmdiKSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpIHtcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIFJHQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHJnYil9YCxcblx0XHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiByZ2JUb0hTTCgpJ1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZFJHQiA9IGNsb25lKHJnYik7XG5cblx0XHRjb25zdCByZWQgPSAoY2xvbmVkUkdCLnZhbHVlLnJlZCBhcyB1bmtub3duIGFzIG51bWJlcikgLyAyNTU7XG5cdFx0Y29uc3QgZ3JlZW4gPSAoY2xvbmVkUkdCLnZhbHVlLmdyZWVuIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblx0XHRjb25zdCBibHVlID0gKGNsb25lZFJHQi52YWx1ZS5ibHVlIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblxuXHRcdGNvbnN0IG1heCA9IE1hdGgubWF4KHJlZCwgZ3JlZW4sIGJsdWUpO1xuXHRcdGNvbnN0IG1pbiA9IE1hdGgubWluKHJlZCwgZ3JlZW4sIGJsdWUpO1xuXG5cdFx0bGV0IGh1ZSA9IDAsXG5cdFx0XHRzYXR1cmF0aW9uID0gMCxcblx0XHRcdGxpZ2h0bmVzcyA9IChtYXggKyBtaW4pIC8gMjtcblxuXHRcdGlmIChtYXggIT09IG1pbikge1xuXHRcdFx0Y29uc3QgZGVsdGEgPSBtYXggLSBtaW47XG5cblx0XHRcdHNhdHVyYXRpb24gPVxuXHRcdFx0XHRsaWdodG5lc3MgPiAwLjUgPyBkZWx0YSAvICgyIC0gbWF4IC0gbWluKSA6IGRlbHRhIC8gKG1heCArIG1pbik7XG5cblx0XHRcdHN3aXRjaCAobWF4KSB7XG5cdFx0XHRcdGNhc2UgcmVkOlxuXHRcdFx0XHRcdGh1ZSA9IChncmVlbiAtIGJsdWUpIC8gZGVsdGEgKyAoZ3JlZW4gPCBibHVlID8gNiA6IDApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIGdyZWVuOlxuXHRcdFx0XHRcdGh1ZSA9IChibHVlIC0gcmVkKSAvIGRlbHRhICsgMjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBibHVlOlxuXHRcdFx0XHRcdGh1ZSA9IChyZWQgLSBncmVlbikgLyBkZWx0YSArIDQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRodWUgKj0gNjA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoTWF0aC5yb3VuZChodWUpKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQoc2F0dXJhdGlvbiAqIDEwMCkpLFxuXHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShNYXRoLnJvdW5kKGxpZ2h0bmVzcyAqIDEwMCkpLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKHJnYi52YWx1ZS5hbHBoYSlcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcikge1xuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgcmdiVG9IU0woKSBlcnJvcjogJHtlcnJvcn1gLFxuXHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiByZ2JUb0hTTCgpJ1xuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9IU1YocmdiOiBSR0IpOiBIU1Yge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMocmdiKSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpIHtcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIFJHQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHJnYil9YCxcblx0XHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiByZ2JUb0hTVigpJ1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIU1ZCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJlZCA9IChyZ2IudmFsdWUucmVkIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblx0XHRjb25zdCBncmVlbiA9IChyZ2IudmFsdWUuZ3JlZW4gYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMjU1O1xuXHRcdGNvbnN0IGJsdWUgPSAocmdiLnZhbHVlLmJsdWUgYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMjU1O1xuXG5cdFx0Y29uc3QgbWF4ID0gTWF0aC5tYXgocmVkLCBncmVlbiwgYmx1ZSk7XG5cdFx0Y29uc3QgbWluID0gTWF0aC5taW4ocmVkLCBncmVlbiwgYmx1ZSk7XG5cdFx0Y29uc3QgZGVsdGEgPSBtYXggLSBtaW47XG5cblx0XHRsZXQgaHVlID0gMDtcblxuXHRcdGNvbnN0IHZhbHVlID0gbWF4O1xuXHRcdGNvbnN0IHNhdHVyYXRpb24gPSBtYXggPT09IDAgPyAwIDogZGVsdGEgLyBtYXg7XG5cblx0XHRpZiAobWF4ICE9PSBtaW4pIHtcblx0XHRcdHN3aXRjaCAobWF4KSB7XG5cdFx0XHRcdGNhc2UgcmVkOlxuXHRcdFx0XHRcdGh1ZSA9IChncmVlbiAtIGJsdWUpIC8gZGVsdGEgKyAoZ3JlZW4gPCBibHVlID8gNiA6IDApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIGdyZWVuOlxuXHRcdFx0XHRcdGh1ZSA9IChibHVlIC0gcmVkKSAvIGRlbHRhICsgMjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBibHVlOlxuXHRcdFx0XHRcdGh1ZSA9IChyZWQgLSBncmVlbikgLyBkZWx0YSArIDQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGh1ZSAqPSA2MDtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChNYXRoLnJvdW5kKGh1ZSkpLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoTWF0aC5yb3VuZChzYXR1cmF0aW9uICogMTAwKSksXG5cdFx0XHRcdHZhbHVlOiBicmFuZC5hc1BlcmNlbnRpbGUoTWF0aC5yb3VuZCh2YWx1ZSAqIDEwMCkpLFxuXHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKHJnYi52YWx1ZS5hbHBoYSlcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcikge1xuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgcmdiVG9IU1YoKSBlcnJvcjogJHtlcnJvcn1gLFxuXHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiByZ2JUb0hTVigpJ1xuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVmYXVsdEhTVkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9YWVoocmdiOiBSR0IpOiBYWVoge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMocmdiKSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpIHtcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIFJHQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHJnYil9YCxcblx0XHRcdFx0XHQncmdiVG9YWVooKSdcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBkZWZhdWx0WFlaQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCByZWQgPSAocmdiLnZhbHVlLnJlZCBhcyB1bmtub3duIGFzIG51bWJlcikgLyAyNTU7XG5cdFx0Y29uc3QgZ3JlZW4gPSAocmdiLnZhbHVlLmdyZWVuIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblx0XHRjb25zdCBibHVlID0gKHJnYi52YWx1ZS5ibHVlIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblxuXHRcdGNvbnN0IGNvcnJlY3RlZFJlZCA9XG5cdFx0XHRyZWQgPiAwLjA0MDQ1ID8gTWF0aC5wb3coKHJlZCArIDAuMDU1KSAvIDEuMDU1LCAyLjQpIDogcmVkIC8gMTIuOTI7XG5cdFx0Y29uc3QgY29ycmVjdGVkR3JlZW4gPVxuXHRcdFx0Z3JlZW4gPiAwLjA0MDQ1XG5cdFx0XHRcdD8gTWF0aC5wb3coKGdyZWVuICsgMC4wNTUpIC8gMS4wNTUsIDIuNClcblx0XHRcdFx0OiBncmVlbiAvIDEyLjkyO1xuXHRcdGNvbnN0IGNvcnJlY3RlZEJsdWUgPVxuXHRcdFx0Ymx1ZSA+IDAuMDQwNDVcblx0XHRcdFx0PyBNYXRoLnBvdygoYmx1ZSArIDAuMDU1KSAvIDEuMDU1LCAyLjQpXG5cdFx0XHRcdDogYmx1ZSAvIDEyLjkyO1xuXG5cdFx0Y29uc3Qgc2NhbGVkUmVkID0gY29ycmVjdGVkUmVkICogMTAwO1xuXHRcdGNvbnN0IHNjYWxlZEdyZWVuID0gY29ycmVjdGVkR3JlZW4gKiAxMDA7XG5cdFx0Y29uc3Qgc2NhbGVkQmx1ZSA9IGNvcnJlY3RlZEJsdWUgKiAxMDA7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0eDogYnJhbmQuYXNYWVpfWChcblx0XHRcdFx0XHRNYXRoLnJvdW5kKFxuXHRcdFx0XHRcdFx0c2NhbGVkUmVkICogMC40MTI0ICtcblx0XHRcdFx0XHRcdFx0c2NhbGVkR3JlZW4gKiAwLjM1NzYgK1xuXHRcdFx0XHRcdFx0XHRzY2FsZWRCbHVlICogMC4xODA1XG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpLFxuXHRcdFx0XHR5OiBicmFuZC5hc1hZWl9ZKFxuXHRcdFx0XHRcdE1hdGgucm91bmQoXG5cdFx0XHRcdFx0XHRzY2FsZWRSZWQgKiAwLjIxMjYgK1xuXHRcdFx0XHRcdFx0XHRzY2FsZWRHcmVlbiAqIDAuNzE1MiArXG5cdFx0XHRcdFx0XHRcdHNjYWxlZEJsdWUgKiAwLjA3MjJcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCksXG5cdFx0XHRcdHo6IGJyYW5kLmFzWFlaX1ooXG5cdFx0XHRcdFx0TWF0aC5yb3VuZChcblx0XHRcdFx0XHRcdHNjYWxlZFJlZCAqIDAuMDE5MyArXG5cdFx0XHRcdFx0XHRcdHNjYWxlZEdyZWVuICogMC4xMTkyICtcblx0XHRcdFx0XHRcdFx0c2NhbGVkQmx1ZSAqIDAuOTUwNVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KSxcblx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShyZ2IudmFsdWUuYWxwaGEpXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpIHtcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YHJnYlRvWFlaIGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IHJnYlRvWFlaKCknXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gZGVmYXVsdFhZWkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24geHl6VG9IU0woeHl6OiBYWVopOiBIU0wge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoeHl6KSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgSW52YWxpZCBYWVogdmFsdWUgJHtKU09OLnN0cmluZ2lmeSh4eXopfWAsXG5cdFx0XHRcdFx0J2NvbW1vbiA+IGNvbnZlcnQgPiBiYXNlID4geHl6VG9IU0woKSdcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiByZ2JUb0hTTCh4eXpUb1JHQihjbG9uZSh4eXopKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGB4eXpUb0hTTCgpIGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IHh5elRvSFNMKCknXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHh5elRvTEFCKHh5ejogWFlaKTogTEFCIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKHh5eikpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgWFlaIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoeHl6KX1gLFxuXHRcdFx0XHRcdCdjb21tb24gPiBjb252ZXJ0ID4gYmFzZSA+IHh5elRvTEFCKCknXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0TEFCQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRYWVogPSBjbG9uZSh4eXopO1xuXHRcdGNvbnN0IHJlZlggPSA5NS4wNDcsXG5cdFx0XHRyZWZZID0gMTAwLjAsXG5cdFx0XHRyZWZaID0gMTA4Ljg4MztcblxuXHRcdGNsb25lZFhZWi52YWx1ZS54ID0gKGNsb25lZFhZWi52YWx1ZS54IC8gcmVmWCkgYXMgWFlaX1g7XG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnkgPSAoY2xvbmVkWFlaLnZhbHVlLnkgLyByZWZZKSBhcyBYWVpfWTtcblx0XHRjbG9uZWRYWVoudmFsdWUueiA9IChjbG9uZWRYWVoudmFsdWUueiAvIHJlZlopIGFzIFhZWl9aO1xuXG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnggPVxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnggPiAwLjAwODg1NlxuXHRcdFx0XHQ/IChNYXRoLnBvdyhjbG9uZWRYWVoudmFsdWUueCwgMSAvIDMpIGFzIFhZWl9YKVxuXHRcdFx0XHQ6ICgoNy43ODcgKiBjbG9uZWRYWVoudmFsdWUueCArIDE2IC8gMTE2KSBhcyBYWVpfWCk7XG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnkgPVxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnkgPiAwLjAwODg1NlxuXHRcdFx0XHQ/IChNYXRoLnBvdyhjbG9uZWRYWVoudmFsdWUueSwgMSAvIDMpIGFzIFhZWl9ZKVxuXHRcdFx0XHQ6ICgoNy43ODcgKiBjbG9uZWRYWVoudmFsdWUueSArIDE2IC8gMTE2KSBhcyBYWVpfWSk7XG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnogPVxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnogPiAwLjAwODg1NlxuXHRcdFx0XHQ/IChNYXRoLnBvdyhjbG9uZWRYWVoudmFsdWUueiwgMSAvIDMpIGFzIFhZWl9aKVxuXHRcdFx0XHQ6ICgoNy43ODcgKiBjbG9uZWRYWVoudmFsdWUueiArIDE2IC8gMTE2KSBhcyBYWVpfWik7XG5cblx0XHRjb25zdCBsID0gc2FuaXRpemUucGVyY2VudGlsZShcblx0XHRcdHBhcnNlRmxvYXQoKDExNiAqIGNsb25lZFhZWi52YWx1ZS55IC0gMTYpLnRvRml4ZWQoMikpXG5cdFx0KTtcblx0XHRjb25zdCBhID0gc2FuaXRpemUubGFiKFxuXHRcdFx0cGFyc2VGbG9hdChcblx0XHRcdFx0KDUwMCAqIChjbG9uZWRYWVoudmFsdWUueCAtIGNsb25lZFhZWi52YWx1ZS55KSkudG9GaXhlZCgyKVxuXHRcdFx0KSxcblx0XHRcdCdhJ1xuXHRcdCk7XG5cdFx0Y29uc3QgYiA9IHNhbml0aXplLmxhYihcblx0XHRcdHBhcnNlRmxvYXQoXG5cdFx0XHRcdCgyMDAgKiAoY2xvbmVkWFlaLnZhbHVlLnkgLSBjbG9uZWRYWVoudmFsdWUueikpLnRvRml4ZWQoMilcblx0XHRcdCksXG5cdFx0XHQnYidcblx0XHQpO1xuXG5cdFx0Y29uc3QgbGFiOiBMQUIgPSB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRsOiBicmFuZC5hc0xBQl9MKE1hdGgucm91bmQobCkpLFxuXHRcdFx0XHRhOiBicmFuZC5hc0xBQl9BKE1hdGgucm91bmQoYSkpLFxuXHRcdFx0XHRiOiBicmFuZC5hc0xBQl9CKE1hdGgucm91bmQoYikpLFxuXHRcdFx0XHRhbHBoYTogeHl6LnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdH07XG5cblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGxhYikpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gLFxuXHRcdFx0XHRcdCd4eXpUb0xBQigpJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdExBQkJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGxhYjtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YHh5elRvTGFiKCkgZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0J2NvbW1vbiA+IGNvbnZlcnQgPiBiYXNlID4geHl6VG9MQUIoKSdcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdExBQkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24geHl6VG9SR0IoeHl6OiBYWVopOiBSR0Ige1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoeHl6KSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpIHtcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIFhZWiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHh5eil9YCxcblx0XHRcdFx0XHQnY29tbW9uID4gY29udmVydCA+IGJhc2UgPiB4eXpUb1JHQigpJ1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRSR0JCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IHggPSAoeHl6LnZhbHVlLnggYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMTAwO1xuXHRcdGNvbnN0IHkgPSAoeHl6LnZhbHVlLnkgYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMTAwO1xuXHRcdGNvbnN0IHogPSAoeHl6LnZhbHVlLnogYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMTAwO1xuXG5cdFx0bGV0IHJlZCA9IHggKiAzLjI0MDYgKyB5ICogLTEuNTM3MiArIHogKiAtMC40OTg2O1xuXHRcdGxldCBncmVlbiA9IHggKiAtMC45Njg5ICsgeSAqIDEuODc1OCArIHogKiAwLjA0MTU7XG5cdFx0bGV0IGJsdWUgPSB4ICogMC4wNTU3ICsgeSAqIC0wLjIwNCArIHogKiAxLjA1NztcblxuXHRcdHJlZCA9IGFwcGx5R2FtbWFDb3JyZWN0aW9uKHJlZCk7XG5cdFx0Z3JlZW4gPSBhcHBseUdhbW1hQ29ycmVjdGlvbihncmVlbik7XG5cdFx0Ymx1ZSA9IGFwcGx5R2FtbWFDb3JyZWN0aW9uKGJsdWUpO1xuXG5cdFx0Y29uc3QgcmdiOiBSR0IgPSBjbGFtcFJHQih7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKE1hdGgucm91bmQocmVkKSksXG5cdFx0XHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZShNYXRoLnJvdW5kKGdyZWVuKSksXG5cdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKE1hdGgucm91bmQoYmx1ZSkpLFxuXHRcdFx0XHRhbHBoYTogeHl6LnZhbHVlLmFscGhhXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHJnYjtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcikge1xuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgeHl6VG9SR0IgZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0J2NvbW1vbiA+IGNvbnZlcnQgPiBiYXNlID4geHl6VG9SR0IoKSdcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiBkZWZhdWx0UkdCQnJhbmRlZDtcblx0fVxufVxuXG4vLyAqKioqKioqKiBCVU5ETEVEIENPTlZFUlNJT04gRlVOQ1RJT05TICoqKioqKioqXG5cbmZ1bmN0aW9uIGhzbFRvKGNvbG9yOiBIU0wsIGNvbG9yU3BhY2U6IENvbG9yU3BhY2VFeHRlbmRlZCk6IENvbG9yIHtcblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGNvbG9yKSkge1xuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgSW52YWxpZCBjb2xvciB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGNvbG9yKX1gLFxuXHRcdFx0XHQnaHNsVG8oKSdcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0UkdCQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRDb2xvciA9IGNsb25lKGNvbG9yKSBhcyBIU0w7XG5cblx0XHRzd2l0Y2ggKGNvbG9yU3BhY2UpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9DTVlLKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBoc2xUb0hleChjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gY2xvbmUoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGhzbFRvSFNWKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBoc2xUb0xBQihjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9SR0IoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y2FzZSAnc2wnOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9TTChjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdzdic6XG5cdFx0XHRcdHJldHVybiBoc2xUb1NWKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdHJldHVybiBoc2xUb1hZWihjbG9uZWRDb2xvcik7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29sb3IgZm9ybWF0Jyk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgaHNsVG8oKSBlcnJvcjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5mdW5jdGlvbiB0b0hTTChjb2xvcjogRXhjbHVkZTxDb2xvciwgU0wgfCBTVj4pOiBIU0wge1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoY29sb3IpKSB7XG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBJbnZhbGlkIGNvbG9yIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWAsXG5cdFx0XHRcdCd0b0hTTCgpJ1xuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZENvbG9yID0gY2xvbmUoY29sb3IpO1xuXG5cdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gY215a1RvSFNMKGNsb25lZENvbG9yIGFzIENNWUspO1xuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0cmV0dXJuIGhleFRvSFNMKGNsb25lZENvbG9yIGFzIEhleCk7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gY2xvbmUoY2xvbmVkQ29sb3IgYXMgSFNMKTtcblx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdHJldHVybiBoc3ZUb0hTTChjbG9uZWRDb2xvciBhcyBIU1YpO1xuXHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0cmV0dXJuIGxhYlRvSFNMKGNsb25lZENvbG9yIGFzIExBQik7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gcmdiVG9IU0woY2xvbmVkQ29sb3IgYXMgUkdCKTtcblx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdHJldHVybiB4eXpUb0hTTChjbG9uZWRDb2xvciBhcyBYWVopO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvbG9yIGZvcm1hdCcpO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYHRvSFNMKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGNvbnZlcnQ6IENvbW1vbkZ1bmN0aW9uc01hc3RlckludGVyZmFjZVsnY29udmVydCddID0ge1xuXHRoc2xUbyxcblx0dG9IU0wsXG5cdHdyYXBwZXJzOiB7XG5cdFx0aGV4VG9IU0w6IGhleFRvSFNMV3JhcHBlclxuXHR9XG59O1xuIl19