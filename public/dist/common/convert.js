// File: common/convert.js
import { applyGammaCorrection, clampRGB, hueToRGB } from './helpers/conversion.js';
import { base, brand, brandColor, clone, sanitize, validate } from './core.js';
import { componentToHex } from './transform.js';
import { createLogger } from '../logger/index.js';
import { defaultData as defaults } from '../data/defaults.js';
import { stripHashFromHex } from './utils/color.js';
import { modeData as mode } from '../data/mode.js';
const defaultColors = defaults.colors.base.unbranded;
const logMode = mode.logging;
const thisModule = 'common/convert/base.js';
const logger = await createLogger();
const defaultCMYKUnbranded = base.clone(defaultColors.cmyk);
const defaultHexUnbranded = base.clone(defaultColors.hex);
const defaultHSLUnbranded = base.clone(defaultColors.hsl);
const defaultHSVUnbranded = base.clone(defaultColors.hsv);
const defaultLABUnbranded = base.clone(defaultColors.lab);
const defaultRGBUnbranded = base.clone(defaultColors.rgb);
const defaultSLUnbranded = base.clone(defaultColors.sl);
const defaultSVUnbranded = base.clone(defaultColors.sv);
const defaultXYZUnbranded = base.clone(defaultColors.xyz);
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
    const thisMethod = 'cmykToHSL()';
    try {
        if (!validate.colorValues(cmyk)) {
            if (logMode.error)
                logger.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`, `${thisModule} > ${thisMethod}`);
            return defaultHSLBranded;
        }
        return rgbToHSL(cmykToRGB(base.clone(cmyk)));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`cmykToHSL() error: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultHSLBranded;
    }
}
function cmykToRGB(cmyk) {
    const thisMethod = 'cmykToRGB()';
    try {
        if (!validate.colorValues(cmyk)) {
            if (logMode.error)
                logger.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`, `${thisModule} > ${thisMethod}`);
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
        const rgb = {
            value: {
                red: brand.asByteRange(Math.round(r)),
                green: brand.asByteRange(Math.round(g)),
                blue: brand.asByteRange(Math.round(b))
            },
            format: 'rgb'
        };
        return clampRGB(rgb);
    }
    catch (error) {
        if (logMode.error)
            logger.error(`cmykToRGB error: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultRGBBranded;
    }
}
function hexToHSL(hex) {
    const thisMethod = 'hexToHSL()';
    try {
        if (!validate.colorValues(hex)) {
            if (logMode.error)
                logger.error(`Invalid Hex value ${JSON.stringify(hex)}`, `${thisModule} > ${thisMethod}`);
            return defaultHSLBranded;
        }
        return rgbToHSL(hexToRGB(base.clone(hex)));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`hexToHSL() error: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultHSLBranded;
    }
}
function hexToHSLWrapper(input) {
    const thisMethod = 'hexToHSLWrapper()';
    try {
        const clonedInput = base.clone(input);
        const hex = typeof clonedInput === 'string'
            ? {
                value: {
                    hex: brand.asHexSet(clonedInput)
                },
                format: 'hex'
            }
            : {
                value: {
                    hex: brand.asHexSet(clonedInput.value.hex)
                },
                format: 'hex'
            };
        return hexToHSL(hex);
    }
    catch (error) {
        if (logMode.error) {
            logger.error(`Error converting hex to HSL: ${error}`, `${thisModule} > ${thisMethod}`);
        }
        return defaultHSLBranded;
    }
}
function hexToRGB(hex) {
    const thisMethod = 'hexToRGB()';
    try {
        if (!validate.colorValues(hex)) {
            if (logMode.error)
                logger.error(`Invalid Hex value ${JSON.stringify(hex)}`, `${thisModule} > ${thisMethod}`);
            return defaultRGBBranded;
        }
        const clonedHex = clone(hex);
        const strippedHex = stripHashFromHex(clonedHex).value.hex;
        const bigint = parseInt(strippedHex, 16);
        return {
            value: {
                red: brand.asByteRange(Math.round((bigint >> 16) & 255)),
                green: brand.asByteRange(Math.round((bigint >> 8) & 255)),
                blue: brand.asByteRange(Math.round(bigint & 255))
            },
            format: 'rgb'
        };
    }
    catch (error) {
        if (logMode.error)
            logger.error(`hexToRGB error: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultRGBBranded;
    }
}
function hslToCMYK(hsl) {
    const thisMethod = 'hslToCMYK()';
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode.error)
                logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule} > ${thisMethod}`);
            return defaultCMYKBranded;
        }
        return rgbToCMYK(hslToRGB(clone(hsl)));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultCMYKBranded;
    }
}
function hslToHex(hsl) {
    const thisMethod = 'hslToHex()';
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode.error)
                logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule} > ${thisMethod}`);
            return defaultHexBranded;
        }
        return rgbToHex(hslToRGB(clone(hsl)));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`hslToHex error: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultHexBranded;
    }
}
function hslToHSV(hsl) {
    const thisMethod = 'hslToHSV()';
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode.error)
                logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule} > ${thisMethod}`);
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
                value: brand.asPercentile(Math.round(value * 100))
            },
            format: 'hsv'
        };
    }
    catch (error) {
        if (logMode.error)
            logger.error(`hslToHSV() error: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultHSVBranded;
    }
}
function hslToLAB(hsl) {
    const thisMethod = 'hslToLAB()';
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode.error)
                logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule} > ${thisMethod}`);
            return defaultLABBranded;
        }
        return xyzToLAB(rgbToXYZ(hslToRGB(clone(hsl))));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`hslToLab() error: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultLABBranded;
    }
}
function hslToRGB(hsl) {
    const thisMethod = 'hslToRGB()';
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode.error)
                logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule} > ${thisMethod}`);
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
                blue: brand.asByteRange(Math.round(hueToRGB(p, q, clonedHSL.value.hue - 1 / 3) * 255))
            },
            format: 'rgb'
        };
    }
    catch (error) {
        if (logMode.error)
            logger.error(`hslToRGB error: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultRGBBranded;
    }
}
function hslToSL(hsl) {
    const thisMethod = 'hslToSL()';
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode.error)
                logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule} > ${thisMethod}`);
            return defaultSLBranded;
        }
        return {
            value: {
                saturation: hsl.value.saturation,
                lightness: hsl.value.lightness
            },
            format: 'sl'
        };
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Error converting HSL to SL: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultSLBranded;
    }
}
function hslToSV(hsl) {
    const thisMethod = 'hslToSV()';
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode.error)
                logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule} > ${thisMethod}`);
            return defaultSVBranded;
        }
        return hsvToSV(rgbToHSV(hslToRGB(clone(hsl))));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Error converting HSL to SV: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultSVBranded;
    }
}
function hslToXYZ(hsl) {
    const thisMethod = 'hslToXYZ()';
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode.error)
                logger.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule} > ${thisMethod}`);
            return defaultXYZBranded;
        }
        return labToXYZ(hslToLAB(clone(hsl)));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`hslToXYZ error: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultXYZBranded;
    }
}
function hsvToHSL(hsv) {
    const thisMethod = 'hsvToHSL()';
    try {
        if (!validate.colorValues(hsv)) {
            if (logMode.error)
                logger.error(`Invalid HSV value ${JSON.stringify(hsv)}`, `${thisModule} > ${thisMethod}`);
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
                lightness: brand.asPercentile(Math.round(lightness))
            },
            format: 'hsl'
        };
    }
    catch (error) {
        if (logMode.error)
            logger.error(`hsvToHSL() error: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultHSLBranded;
    }
}
function hsvToSV(hsv) {
    const thisMethod = 'hsvToSV()';
    try {
        if (!validate.colorValues(hsv)) {
            if (logMode.error)
                logger.error(`Invalid HSV value ${JSON.stringify(hsv)}`, `${thisModule} > ${thisMethod}`);
            return defaultSVBranded;
        }
        return {
            value: {
                saturation: hsv.value.saturation,
                value: hsv.value.value
            },
            format: 'sv'
        };
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Error converting HSV to SV: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultSVBranded;
    }
}
function labToHSL(lab) {
    const thisMethod = 'labToHSL()';
    try {
        if (!validate.colorValues(lab)) {
            if (logMode.error)
                logger.error(`Invalid LAB value ${JSON.stringify(lab)}`, `${thisModule} > ${thisMethod}`);
            return defaultHSLBranded;
        }
        return rgbToHSL(labToRGB(clone(lab)));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`labToHSL() error: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultHSLBranded;
    }
}
function labToRGB(lab) {
    try {
        if (!validate.colorValues(lab)) {
            if (logMode.error)
                logger.error(`Invalid LAB value ${JSON.stringify(lab)}`, `${thisModule} > labToRGB()`);
            return defaultRGBBranded;
        }
        return xyzToRGB(labToXYZ(clone(lab)));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`labToRGB error: ${error}`, `${thisModule} > labToRGB()`);
        return defaultRGBBranded;
    }
}
function labToXYZ(lab) {
    const thisMethod = 'labToXYZ()';
    try {
        if (!validate.colorValues(lab)) {
            if (logMode.error)
                logger.error(`Invalid LAB value ${JSON.stringify(lab)}`, `${thisModule} > ${thisMethod}`);
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
                        : (z - 16 / 116) / 7.787)))
            },
            format: 'xyz'
        };
    }
    catch (error) {
        if (logMode.error)
            logger.error(`labToXYZ error: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultXYZBranded;
    }
}
function rgbToCMYK(rgb) {
    const thisMethod = 'rgbToCMYK()';
    try {
        if (!validate.colorValues(rgb)) {
            if (logMode.error)
                logger.error(`Invalid RGB value ${JSON.stringify(rgb)}`, `${thisModule} > ${thisMethod}`);
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
        const format = 'cmyk';
        const cmyk = { value: { cyan, magenta, yellow, key }, format };
        if (logMode.debug && logMode.verbosity > 1)
            logger.debug(`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(clone(cmyk))}`, `${thisModule} > ${thisMethod}`);
        return cmyk;
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Error converting RGB to CMYK: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultCMYKBranded;
    }
}
function rgbToHex(rgb) {
    const thisMethod = 'rgbToHex()';
    try {
        if (!validate.colorValues(rgb)) {
            if (logMode.error)
                logger.error(`Invalid RGB value ${JSON.stringify(rgb)}`, `${thisModule} > ${thisMethod}`);
            return defaultHexBranded;
        }
        const clonedRGB = clone(rgb);
        if ([
            clonedRGB.value.red,
            clonedRGB.value.green,
            clonedRGB.value.blue
        ].some(v => isNaN(v) || v < 0 || v > 255)) {
            if (logMode.warn)
                logger.warn(`Invalid RGB values:\nR=${JSON.stringify(clonedRGB.value.red)}\nG=${JSON.stringify(clonedRGB.value.green)}\nB=${JSON.stringify(clonedRGB.value.blue)}`, `${thisModule} > ${thisMethod}`);
            return {
                value: {
                    hex: brand.asHexSet('#000000FF')
                },
                format: 'hex'
            };
        }
        return {
            value: {
                hex: brand.asHexSet(`#${componentToHex(clonedRGB.value.red)}${componentToHex(clonedRGB.value.green)}${componentToHex(clonedRGB.value.blue)}`)
            },
            format: 'hex'
        };
    }
    catch (error) {
        if (logMode.error)
            logger.warn(`rgbToHex error: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultHexBranded;
    }
}
function rgbToHSL(rgb) {
    const thisMethod = 'rgbToHSL()';
    try {
        if (!validate.colorValues(rgb)) {
            if (logMode.error) {
                logger.error(`Invalid RGB value ${JSON.stringify(rgb)}`, `${thisModule} > ${thisMethod}`);
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
                lightness: brand.asPercentile(Math.round(lightness * 100))
            },
            format: 'hsl'
        };
    }
    catch (error) {
        if (logMode.error) {
            logger.error(`rgbToHSL() error: ${error}`, `${thisModule} > ${thisMethod}`);
        }
        return defaultHSLBranded;
    }
}
function rgbToHSV(rgb) {
    const thisMethod = 'rgbToHSV()';
    try {
        if (!validate.colorValues(rgb)) {
            if (logMode.error) {
                logger.error(`Invalid RGB value ${JSON.stringify(rgb)}`, `${thisModule} > ${thisMethod}`);
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
                value: brand.asPercentile(Math.round(value * 100))
            },
            format: 'hsv'
        };
    }
    catch (error) {
        if (logMode.error) {
            logger.error(`rgbToHSV() error: ${error}`, `${thisModule} > ${thisMethod}`);
        }
        return defaultHSVBranded;
    }
}
function rgbToXYZ(rgb) {
    const thisMethod = 'rgbToXYZ()';
    try {
        if (!validate.colorValues(rgb)) {
            if (logMode.error) {
                logger.error(`Invalid RGB value ${JSON.stringify(rgb)}`, `${thisModule} > ${thisMethod}`);
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
                    scaledBlue * 0.9505))
            },
            format: 'xyz'
        };
    }
    catch (error) {
        if (logMode.error) {
            logger.error(`rgbToXYZ error: ${error}`, `${thisModule} > ${thisMethod}`);
        }
        return defaultXYZBranded;
    }
}
function xyzToHSL(xyz) {
    const thisMethod = 'xyzToHSL()';
    try {
        if (!validate.colorValues(xyz)) {
            if (logMode.error)
                logger.error(`Invalid XYZ value ${JSON.stringify(xyz)}`, `${thisModule} > ${thisMethod}`);
            return defaultHSLBranded;
        }
        return rgbToHSL(xyzToRGB(clone(xyz)));
    }
    catch (error) {
        if (logMode.error)
            logger.error(`xyzToHSL() error: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultHSLBranded;
    }
}
function xyzToLAB(xyz) {
    const thisMethod = 'xyzToLAB()';
    try {
        if (!validate.colorValues(xyz)) {
            if (logMode.error)
                logger.error(`Invalid XYZ value ${JSON.stringify(xyz)}`, `${thisModule} > ${thisMethod}`);
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
                b: brand.asLAB_B(Math.round(b))
            },
            format: 'lab'
        };
        if (!validate.colorValues(lab)) {
            if (logMode.error)
                logger.error(`Invalid LAB value ${JSON.stringify(lab)}`, `${thisModule} > ${thisMethod}`);
            return defaultLABBranded;
        }
        return lab;
    }
    catch (error) {
        if (logMode.error)
            logger.error(`xyzToLab() error: ${error}`, `${thisModule} > ${thisMethod}`);
        return defaultLABBranded;
    }
}
function xyzToRGB(xyz) {
    const thisMethod = 'xyzToRGB()';
    try {
        if (!validate.colorValues(xyz)) {
            if (logMode.error) {
                logger.error(`Invalid XYZ value ${JSON.stringify(xyz)}`, `${thisModule} > ${thisMethod}`);
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
                blue: brand.asByteRange(Math.round(blue))
            },
            format: 'rgb'
        });
        return rgb;
    }
    catch (error) {
        if (logMode.error) {
            logger.error(`xyzToRGB error: ${error}`, `${thisModule} > ${thisMethod}`);
        }
        return defaultRGBBranded;
    }
}
// ******** BUNDLED CONVERSION FUNCTIONS ********
function hslTo(color, colorSpace) {
    const thisMethod = 'hslTo()';
    try {
        if (!validate.colorValues(color)) {
            logger.error(`Invalid color value ${JSON.stringify(color)}`, `${thisModule} > ${thisMethod}`);
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
    const thisMethod = 'toHSL()';
    try {
        if (!validate.colorValues(color)) {
            logger.error(`Invalid color value ${JSON.stringify(color)}`, `${thisModule} > ${thisMethod}`);
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
export const coreConversionUtils = {
    hslTo,
    toHSL,
    wrappers: {
        hexToHSL: hexToHSLWrapper
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vY29udmVydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwQkFBMEI7QUFtQjFCLE9BQU8sRUFDTixvQkFBb0IsRUFDcEIsUUFBUSxFQUNSLFFBQVEsRUFDUixNQUFNLHlCQUF5QixDQUFDO0FBQ2pDLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUMvRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxXQUFXLElBQUksUUFBUSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDcEQsT0FBTyxFQUFFLFFBQVEsSUFBSSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUVuRCxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDckQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUU3QixNQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQztBQUU1QyxNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksRUFBRSxDQUFDO0FBRXBDLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUQsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxRCxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxD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QUFDLENBQUM7WUFDckMsS0FBSyxLQUFLO2dCQUNULE9BQU8sUUFBUSxDQUFDLFdBQWtCLENBQUMsQ0FBQztZQUNyQztnQkFDQyxNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDMUMsQ0FBQztJQUNGLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDNUMsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBd0M7SUFDdkUsS0FBSztJQUNMLEtBQUs7SUFDTCxRQUFRLEVBQUU7UUFDVCxRQUFRLEVBQUUsZUFBZTtLQUN6QjtDQUNELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBjb21tb24vY29udmVydC5qc1xuXG5pbXBvcnQge1xuXHRDTVlLLFxuXHRDb2xvcixcblx0Q29sb3JTcGFjZUV4dGVuZGVkLFxuXHRDb21tb25Gbl9NYXN0ZXJJbnRlcmZhY2UsXG5cdEhleCxcblx0SFNMLFxuXHRIU1YsXG5cdExBQixcblx0UkdCLFxuXHRTTCxcblx0U1YsXG5cdFhZWixcblx0WFlaX1gsXG5cdFhZWl9ZLFxuXHRYWVpfWlxufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQge1xuXHRhcHBseUdhbW1hQ29ycmVjdGlvbixcblx0Y2xhbXBSR0IsXG5cdGh1ZVRvUkdCXG59IGZyb20gJy4vaGVscGVycy9jb252ZXJzaW9uLmpzJztcbmltcG9ydCB7IGJhc2UsIGJyYW5kLCBicmFuZENvbG9yLCBjbG9uZSwgc2FuaXRpemUsIHZhbGlkYXRlIH0gZnJvbSAnLi9jb3JlLmpzJztcbmltcG9ydCB7IGNvbXBvbmVudFRvSGV4IH0gZnJvbSAnLi90cmFuc2Zvcm0uanMnO1xuaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAnLi4vbG9nZ2VyL2luZGV4LmpzJztcbmltcG9ydCB7IGRlZmF1bHREYXRhIGFzIGRlZmF1bHRzIH0gZnJvbSAnLi4vZGF0YS9kZWZhdWx0cy5qcyc7XG5pbXBvcnQgeyBzdHJpcEhhc2hGcm9tSGV4IH0gZnJvbSAnLi91dGlscy9jb2xvci5qcyc7XG5pbXBvcnQgeyBtb2RlRGF0YSBhcyBtb2RlIH0gZnJvbSAnLi4vZGF0YS9tb2RlLmpzJztcblxuY29uc3QgZGVmYXVsdENvbG9ycyA9IGRlZmF1bHRzLmNvbG9ycy5iYXNlLnVuYnJhbmRlZDtcbmNvbnN0IGxvZ01vZGUgPSBtb2RlLmxvZ2dpbmc7XG5cbmNvbnN0IHRoaXNNb2R1bGUgPSAnY29tbW9uL2NvbnZlcnQvYmFzZS5qcyc7XG5cbmNvbnN0IGxvZ2dlciA9IGF3YWl0IGNyZWF0ZUxvZ2dlcigpO1xuXG5jb25zdCBkZWZhdWx0Q01ZS1VuYnJhbmRlZCA9IGJhc2UuY2xvbmUoZGVmYXVsdENvbG9ycy5jbXlrKTtcbmNvbnN0IGRlZmF1bHRIZXhVbmJyYW5kZWQgPSBiYXNlLmNsb25lKGRlZmF1bHRDb2xvcnMuaGV4KTtcbmNvbnN0IGRlZmF1bHRIU0xVbmJyYW5kZWQgPSBiYXNlLmNsb25lKGRlZmF1bHRDb2xvcnMuaHNsKTtcbmNvbnN0IGRlZmF1bHRIU1ZVbmJyYW5kZWQgPSBiYXNlLmNsb25lKGRlZmF1bHRDb2xvcnMuaHN2KTtcbmNvbnN0IGRlZmF1bHRMQUJVbmJyYW5kZWQgPSBiYXNlLmNsb25lKGRlZmF1bHRDb2xvcnMubGFiKTtcbmNvbnN0IGRlZmF1bHRSR0JVbmJyYW5kZWQgPSBiYXNlLmNsb25lKGRlZmF1bHRDb2xvcnMucmdiKTtcbmNvbnN0IGRlZmF1bHRTTFVuYnJhbmRlZCA9IGJhc2UuY2xvbmUoZGVmYXVsdENvbG9ycy5zbCk7XG5jb25zdCBkZWZhdWx0U1ZVbmJyYW5kZWQgPSBiYXNlLmNsb25lKGRlZmF1bHRDb2xvcnMuc3YpO1xuY29uc3QgZGVmYXVsdFhZWlVuYnJhbmRlZCA9IGJhc2UuY2xvbmUoZGVmYXVsdENvbG9ycy54eXopO1xuXG5jb25zdCBkZWZhdWx0Q01ZS0JyYW5kZWQgPSBicmFuZENvbG9yLmFzQ01ZSyhkZWZhdWx0Q01ZS1VuYnJhbmRlZCk7XG5jb25zdCBkZWZhdWx0SGV4QnJhbmRlZCA9IGJyYW5kQ29sb3IuYXNIZXgoZGVmYXVsdEhleFVuYnJhbmRlZCk7XG5jb25zdCBkZWZhdWx0SFNMQnJhbmRlZCA9IGJyYW5kQ29sb3IuYXNIU0woZGVmYXVsdEhTTFVuYnJhbmRlZCk7XG5jb25zdCBkZWZhdWx0SFNWQnJhbmRlZCA9IGJyYW5kQ29sb3IuYXNIU1YoZGVmYXVsdEhTVlVuYnJhbmRlZCk7XG5jb25zdCBkZWZhdWx0TEFCQnJhbmRlZCA9IGJyYW5kQ29sb3IuYXNMQUIoZGVmYXVsdExBQlVuYnJhbmRlZCk7XG5jb25zdCBkZWZhdWx0UkdCQnJhbmRlZCA9IGJyYW5kQ29sb3IuYXNSR0IoZGVmYXVsdFJHQlVuYnJhbmRlZCk7XG5jb25zdCBkZWZhdWx0U0xCcmFuZGVkID0gYnJhbmRDb2xvci5hc1NMKGRlZmF1bHRTTFVuYnJhbmRlZCk7XG5jb25zdCBkZWZhdWx0U1ZCcmFuZGVkID0gYnJhbmRDb2xvci5hc1NWKGRlZmF1bHRTVlVuYnJhbmRlZCk7XG5jb25zdCBkZWZhdWx0WFlaQnJhbmRlZCA9IGJyYW5kQ29sb3IuYXNYWVooZGVmYXVsdFhZWlVuYnJhbmRlZCk7XG5cbmZ1bmN0aW9uIGNteWtUb0hTTChjbXlrOiBDTVlLKTogSFNMIHtcblx0Y29uc3QgdGhpc01ldGhvZCA9ICdjbXlrVG9IU0woKSc7XG5cblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGNteWspKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIENNWUsgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjbXlrKX1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiByZ2JUb0hTTChjbXlrVG9SR0IoYmFzZS5jbG9uZShjbXlrKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgY215a1RvSFNMKCkgZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBkZWZhdWx0SFNMQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBjbXlrVG9SR0IoY215azogQ01ZSyk6IFJHQiB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAnY215a1RvUkdCKCknO1xuXG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhjbXlrKSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgSW52YWxpZCBDTVlLIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY215ayl9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0UkdCQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRDTVlLID0gYmFzZS5jbG9uZShjbXlrKTtcblx0XHRjb25zdCByID1cblx0XHRcdDI1NSAqXG5cdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUuY3lhbiAvIDEwMCkgKlxuXHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLmtleSAvIDEwMCk7XG5cdFx0Y29uc3QgZyA9XG5cdFx0XHQyNTUgKlxuXHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLm1hZ2VudGEgLyAxMDApICpcblx0XHRcdCgxIC0gY2xvbmVkQ01ZSy52YWx1ZS5rZXkgLyAxMDApO1xuXHRcdGNvbnN0IGIgPVxuXHRcdFx0MjU1ICpcblx0XHRcdCgxIC0gY2xvbmVkQ01ZSy52YWx1ZS55ZWxsb3cgLyAxMDApICpcblx0XHRcdCgxIC0gY2xvbmVkQ01ZSy52YWx1ZS5rZXkgLyAxMDApO1xuXHRcdGNvbnN0IHJnYjogUkdCID0ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZShNYXRoLnJvdW5kKHIpKSxcblx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKE1hdGgucm91bmQoZykpLFxuXHRcdFx0XHRibHVlOiBicmFuZC5hc0J5dGVSYW5nZShNYXRoLnJvdW5kKGIpKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9O1xuXG5cdFx0cmV0dXJuIGNsYW1wUkdCKHJnYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBjbXlrVG9SR0IgZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBkZWZhdWx0UkdCQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBoZXhUb0hTTChoZXg6IEhleCk6IEhTTCB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAnaGV4VG9IU0woKSc7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoZXgpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIEhleCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhleCl9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0SFNMQnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IU0woaGV4VG9SR0IoYmFzZS5jbG9uZShoZXgpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBoZXhUb0hTTCgpIGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4VG9IU0xXcmFwcGVyKGlucHV0OiBzdHJpbmcgfCBIZXgpOiBIU0wge1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ2hleFRvSFNMV3JhcHBlcigpJztcblxuXHR0cnkge1xuXHRcdGNvbnN0IGNsb25lZElucHV0ID0gYmFzZS5jbG9uZShpbnB1dCk7XG5cblx0XHRjb25zdCBoZXg6IEhleCA9XG5cdFx0XHR0eXBlb2YgY2xvbmVkSW5wdXQgPT09ICdzdHJpbmcnXG5cdFx0XHRcdD8ge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldChjbG9uZWRJbnB1dClcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQ6IHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoY2xvbmVkSW5wdXQudmFsdWUuaGV4KVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdFx0XHR9O1xuXHRcdHJldHVybiBoZXhUb0hTTChoZXgpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKSB7XG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBFcnJvciBjb252ZXJ0aW5nIGhleCB0byBIU0w6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaGV4VG9SR0IoaGV4OiBIZXgpOiBSR0Ige1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ2hleFRvUkdCKCknO1xuXG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoZXgpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIEhleCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhleCl9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0UkdCQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRIZXggPSBjbG9uZShoZXgpO1xuXHRcdGNvbnN0IHN0cmlwcGVkSGV4ID0gc3RyaXBIYXNoRnJvbUhleChjbG9uZWRIZXgpLnZhbHVlLmhleDtcblx0XHRjb25zdCBiaWdpbnQgPSBwYXJzZUludChzdHJpcHBlZEhleCwgMTYpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHJlZDogYnJhbmQuYXNCeXRlUmFuZ2UoTWF0aC5yb3VuZCgoYmlnaW50ID4+IDE2KSAmIDI1NSkpLFxuXHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UoTWF0aC5yb3VuZCgoYmlnaW50ID4+IDgpICYgMjU1KSksXG5cdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKE1hdGgucm91bmQoYmlnaW50ICYgMjU1KSlcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YGhleFRvUkdCIGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdFJHQkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9DTVlLKGhzbDogSFNMKTogQ01ZSyB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAnaHNsVG9DTVlLKCknO1xuXG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0Q01ZS0JyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJnYlRvQ01ZSyhoc2xUb1JHQihjbG9uZShoc2wpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBFcnJvciBjb252ZXJ0aW5nIEhTTCAke0pTT04uc3RyaW5naWZ5KGhzbCl9IHRvIENNWUs6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBkZWZhdWx0Q01ZS0JyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9IZXgoaHNsOiBIU0wpOiBIZXgge1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ2hzbFRvSGV4KCknO1xuXG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0SGV4QnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiVG9IZXgoaHNsVG9SR0IoY2xvbmUoaHNsKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgaHNsVG9IZXggZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBkZWZhdWx0SGV4QnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb0hTVihoc2w6IEhTTCk6IEhTViB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAnaHNsVG9IU1YoKSc7XG5cblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIU1ZCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZEhTTCA9IGNsb25lKGhzbCk7XG5cdFx0Y29uc3QgcyA9IGNsb25lZEhTTC52YWx1ZS5zYXR1cmF0aW9uIC8gMTAwO1xuXHRcdGNvbnN0IGwgPSBjbG9uZWRIU0wudmFsdWUubGlnaHRuZXNzIC8gMTAwO1xuXHRcdGNvbnN0IHZhbHVlID0gbCArIHMgKiBNYXRoLm1pbihsLCAxIC0gMSk7XG5cdFx0Y29uc3QgbmV3U2F0dXJhdGlvbiA9IHZhbHVlID09PSAwID8gMCA6IDIgKiAoMSAtIGwgLyB2YWx1ZSk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChNYXRoLnJvdW5kKGNsb25lZEhTTC52YWx1ZS5odWUpKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQobmV3U2F0dXJhdGlvbiAqIDEwMCkpLFxuXHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQodmFsdWUgKiAxMDApKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgaHNsVG9IU1YoKSBlcnJvcjogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRIU1ZCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvTEFCKGhzbDogSFNMKTogTEFCIHtcblx0Y29uc3QgdGhpc01ldGhvZCA9ICdoc2xUb0xBQigpJztcblxuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoaHNsKSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdExBQkJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHh5elRvTEFCKHJnYlRvWFlaKGhzbFRvUkdCKGNsb25lKGhzbCkpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBoc2xUb0xhYigpIGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdExBQkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9SR0IoaHNsOiBIU0wpOiBSR0Ige1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ2hzbFRvUkdCKCknO1xuXG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0UkdCQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRIU0wgPSBjbG9uZShoc2wpO1xuXHRcdGNvbnN0IHMgPSBjbG9uZWRIU0wudmFsdWUuc2F0dXJhdGlvbiAvIDEwMDtcblx0XHRjb25zdCBsID0gY2xvbmVkSFNMLnZhbHVlLmxpZ2h0bmVzcyAvIDEwMDtcblx0XHRjb25zdCBxID0gbCA8IDAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcztcblx0XHRjb25zdCBwID0gMiAqIGwgLSBxO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHJlZDogYnJhbmQuYXNCeXRlUmFuZ2UoXG5cdFx0XHRcdFx0TWF0aC5yb3VuZChcblx0XHRcdFx0XHRcdGh1ZVRvUkdCKHAsIHEsIGNsb25lZEhTTC52YWx1ZS5odWUgKyAxIC8gMykgKiAyNTVcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCksXG5cdFx0XHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZShcblx0XHRcdFx0XHRNYXRoLnJvdW5kKGh1ZVRvUkdCKHAsIHEsIGNsb25lZEhTTC52YWx1ZS5odWUpICogMjU1KVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRibHVlOiBicmFuZC5hc0J5dGVSYW5nZShcblx0XHRcdFx0XHRNYXRoLnJvdW5kKFxuXHRcdFx0XHRcdFx0aHVlVG9SR0IocCwgcSwgY2xvbmVkSFNMLnZhbHVlLmh1ZSAtIDEgLyAzKSAqIDI1NVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgaHNsVG9SR0IgZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBkZWZhdWx0UkdCQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBoc2xUb1NMKGhzbDogSFNMKTogU0wge1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ2hzbFRvU0woKSc7XG5cblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGhzbCkpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRTTEJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHNhdHVyYXRpb246IGhzbC52YWx1ZS5zYXR1cmF0aW9uLFxuXHRcdFx0XHRsaWdodG5lc3M6IGhzbC52YWx1ZS5saWdodG5lc3Ncblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdzbCcgYXMgJ3NsJ1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBFcnJvciBjb252ZXJ0aW5nIEhTTCB0byBTTDogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRTTEJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9TVihoc2w6IEhTTCk6IFNWIHtcblx0Y29uc3QgdGhpc01ldGhvZCA9ICdoc2xUb1NWKCknO1xuXG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0U1ZCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiBoc3ZUb1NWKHJnYlRvSFNWKGhzbFRvUkdCKGNsb25lKGhzbCkpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBFcnJvciBjb252ZXJ0aW5nIEhTTCB0byBTVjogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRTVkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHNsVG9YWVooaHNsOiBIU0wpOiBYWVoge1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ2hzbFRvWFlaKCknO1xuXG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc2wpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0WFlaQnJhbmRlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gbGFiVG9YWVooaHNsVG9MQUIoY2xvbmUoaHNsKSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgaHNsVG9YWVogZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBkZWZhdWx0WFlaQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBoc3ZUb0hTTChoc3Y6IEhTVik6IEhTTCB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAnaHN2VG9IU0woKSc7XG5cblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGhzdikpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgSFNWIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHN2KX1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZEhTViA9IGNsb25lKGhzdik7XG5cdFx0Y29uc3QgbmV3U2F0dXJhdGlvbiA9XG5cdFx0XHRjbG9uZWRIU1YudmFsdWUudmFsdWUgKiAoMSAtIGNsb25lZEhTVi52YWx1ZS5zYXR1cmF0aW9uIC8gMTAwKSA9PT1cblx0XHRcdFx0MCB8fCBjbG9uZWRIU1YudmFsdWUudmFsdWUgPT09IDBcblx0XHRcdFx0PyAwXG5cdFx0XHRcdDogKGNsb25lZEhTVi52YWx1ZS52YWx1ZSAtXG5cdFx0XHRcdFx0XHRjbG9uZWRIU1YudmFsdWUudmFsdWUgKlxuXHRcdFx0XHRcdFx0XHQoMSAtIGNsb25lZEhTVi52YWx1ZS5zYXR1cmF0aW9uIC8gMTAwKSkgL1xuXHRcdFx0XHRcdE1hdGgubWluKFxuXHRcdFx0XHRcdFx0Y2xvbmVkSFNWLnZhbHVlLnZhbHVlLFxuXHRcdFx0XHRcdFx0MTAwIC0gY2xvbmVkSFNWLnZhbHVlLnZhbHVlXG5cdFx0XHRcdFx0KTtcblx0XHRjb25zdCBsaWdodG5lc3MgPVxuXHRcdFx0Y2xvbmVkSFNWLnZhbHVlLnZhbHVlICogKDEgLSBjbG9uZWRIU1YudmFsdWUuc2F0dXJhdGlvbiAvIDIwMCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChNYXRoLnJvdW5kKGNsb25lZEhTVi52YWx1ZS5odWUpKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQobmV3U2F0dXJhdGlvbiAqIDEwMCkpLFxuXHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShNYXRoLnJvdW5kKGxpZ2h0bmVzcykpXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBoc3ZUb0hTTCgpIGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gaHN2VG9TVihoc3Y6IEhTVik6IFNWIHtcblx0Y29uc3QgdGhpc01ldGhvZCA9ICdoc3ZUb1NWKCknO1xuXG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhoc3YpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIEhTViB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzdil9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0U1ZCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRzYXR1cmF0aW9uOiBoc3YudmFsdWUuc2F0dXJhdGlvbixcblx0XHRcdFx0dmFsdWU6IGhzdi52YWx1ZS52YWx1ZVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3N2JyBhcyAnc3YnXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEVycm9yIGNvbnZlcnRpbmcgSFNWIHRvIFNWOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdFNWQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiBsYWJUb0hTTChsYWI6IExBQik6IEhTTCB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAnbGFiVG9IU0woKSc7XG5cblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGxhYikpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiByZ2JUb0hTTChsYWJUb1JHQihjbG9uZShsYWIpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBsYWJUb0hTTCgpIGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gbGFiVG9SR0IobGFiOiBMQUIpOiBSR0Ige1xuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMobGFiKSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgSW52YWxpZCBMQUIgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShsYWIpfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiBsYWJUb1JHQigpYFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFJHQkJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHh5elRvUkdCKGxhYlRvWFlaKGNsb25lKGxhYikpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YGxhYlRvUkdCIGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gbGFiVG9SR0IoKWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdFJHQkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gbGFiVG9YWVoobGFiOiBMQUIpOiBYWVoge1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ2xhYlRvWFlaKCknO1xuXG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhsYWIpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIExBQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGxhYil9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0WFlaQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRMQUIgPSBjbG9uZShsYWIpO1xuXHRcdGNvbnN0IHJlZlggPSA5NS4wNDcsXG5cdFx0XHRyZWZZID0gMTAwLjAsXG5cdFx0XHRyZWZaID0gMTA4Ljg4MztcblxuXHRcdGxldCB5ID0gKGNsb25lZExBQi52YWx1ZS5sICsgMTYpIC8gMTE2O1xuXHRcdGxldCB4ID0gY2xvbmVkTEFCLnZhbHVlLmEgLyA1MDAgKyB5O1xuXHRcdGxldCB6ID0geSAtIGNsb25lZExBQi52YWx1ZS5iIC8gMjAwO1xuXG5cdFx0Y29uc3QgcG93ID0gTWF0aC5wb3c7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0eDogYnJhbmQuYXNYWVpfWChcblx0XHRcdFx0XHRNYXRoLnJvdW5kKFxuXHRcdFx0XHRcdFx0cmVmWCAqXG5cdFx0XHRcdFx0XHRcdChwb3coeCwgMykgPiAwLjAwODg1NlxuXHRcdFx0XHRcdFx0XHRcdD8gcG93KHgsIDMpXG5cdFx0XHRcdFx0XHRcdFx0OiAoeCAtIDE2IC8gMTE2KSAvIDcuNzg3KVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KSxcblx0XHRcdFx0eTogYnJhbmQuYXNYWVpfWShcblx0XHRcdFx0XHRNYXRoLnJvdW5kKFxuXHRcdFx0XHRcdFx0cmVmWSAqXG5cdFx0XHRcdFx0XHRcdChwb3coeSwgMykgPiAwLjAwODg1NlxuXHRcdFx0XHRcdFx0XHRcdD8gcG93KHksIDMpXG5cdFx0XHRcdFx0XHRcdFx0OiAoeSAtIDE2IC8gMTE2KSAvIDcuNzg3KVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KSxcblx0XHRcdFx0ejogYnJhbmQuYXNYWVpfWihcblx0XHRcdFx0XHRNYXRoLnJvdW5kKFxuXHRcdFx0XHRcdFx0cmVmWiAqXG5cdFx0XHRcdFx0XHRcdChwb3coeiwgMykgPiAwLjAwODg1NlxuXHRcdFx0XHRcdFx0XHRcdD8gcG93KHosIDMpXG5cdFx0XHRcdFx0XHRcdFx0OiAoeiAtIDE2IC8gMTE2KSAvIDcuNzg3KVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgbGFiVG9YWVogZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBkZWZhdWx0WFlaQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiByZ2JUb0NNWUsocmdiOiBSR0IpOiBDTVlLIHtcblx0Y29uc3QgdGhpc01ldGhvZCA9ICdyZ2JUb0NNWUsoKSc7XG5cblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKHJnYikpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRDTVlLQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRSR0IgPSBjbG9uZShyZ2IpO1xuXG5cdFx0Y29uc3QgcmVkUHJpbWUgPSBjbG9uZWRSR0IudmFsdWUucmVkIC8gMjU1O1xuXHRcdGNvbnN0IGdyZWVuUHJpbWUgPSBjbG9uZWRSR0IudmFsdWUuZ3JlZW4gLyAyNTU7XG5cdFx0Y29uc3QgYmx1ZVByaW1lID0gY2xvbmVkUkdCLnZhbHVlLmJsdWUgLyAyNTU7XG5cblx0XHRjb25zdCBrZXkgPSBzYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0TWF0aC5yb3VuZCgxIC0gTWF0aC5tYXgocmVkUHJpbWUsIGdyZWVuUHJpbWUsIGJsdWVQcmltZSkpXG5cdFx0KTtcblx0XHRjb25zdCBjeWFuID0gc2FuaXRpemUucGVyY2VudGlsZShcblx0XHRcdE1hdGgucm91bmQoKDEgLSByZWRQcmltZSAtIGtleSkgLyAoMSAtIGtleSkgfHwgMClcblx0XHQpO1xuXHRcdGNvbnN0IG1hZ2VudGEgPSBzYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0TWF0aC5yb3VuZCgoMSAtIGdyZWVuUHJpbWUgLSBrZXkpIC8gKDEgLSBrZXkpIHx8IDApXG5cdFx0KTtcblx0XHRjb25zdCB5ZWxsb3cgPSBzYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0TWF0aC5yb3VuZCgoMSAtIGJsdWVQcmltZSAtIGtleSkgLyAoMSAtIGtleSkgfHwgMClcblx0XHQpO1xuXHRcdGNvbnN0IGZvcm1hdDogJ2NteWsnID0gJ2NteWsnO1xuXG5cdFx0Y29uc3QgY215ayA9IHsgdmFsdWU6IHsgY3lhbiwgbWFnZW50YSwgeWVsbG93LCBrZXkgfSwgZm9ybWF0IH07XG5cblx0XHRpZiAobG9nTW9kZS5kZWJ1ZyAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+IDEpXG5cdFx0XHRsb2dnZXIuZGVidWcoXG5cdFx0XHRcdGBDb252ZXJ0ZWQgUkdCICR7SlNPTi5zdHJpbmdpZnkoY2xvbmVkUkdCKX0gdG8gQ01ZSzogJHtKU09OLnN0cmluZ2lmeShjbG9uZShjbXlrKSl9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBjbXlrO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgRXJyb3IgY29udmVydGluZyBSR0IgdG8gQ01ZSzogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuIGRlZmF1bHRDTVlLQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiByZ2JUb0hleChyZ2I6IFJHQik6IEhleCB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAncmdiVG9IZXgoKSc7XG5cblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKHJnYikpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIZXhCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZFJHQiA9IGNsb25lKHJnYik7XG5cblx0XHRpZiAoXG5cdFx0XHRbXG5cdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5yZWQsXG5cdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbixcblx0XHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmJsdWVcblx0XHRcdF0uc29tZSh2ID0+IGlzTmFOKHYpIHx8IHYgPCAwIHx8IHYgPiAyNTUpXG5cdFx0KSB7XG5cdFx0XHRpZiAobG9nTW9kZS53YXJuKVxuXHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRgSW52YWxpZCBSR0IgdmFsdWVzOlxcblI9JHtKU09OLnN0cmluZ2lmeShjbG9uZWRSR0IudmFsdWUucmVkKX1cXG5HPSR7SlNPTi5zdHJpbmdpZnkoY2xvbmVkUkdCLnZhbHVlLmdyZWVuKX1cXG5CPSR7SlNPTi5zdHJpbmdpZnkoY2xvbmVkUkdCLnZhbHVlLmJsdWUpfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoJyMwMDAwMDBGRicpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hleCcgYXMgJ2hleCdcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoXG5cdFx0XHRcdFx0YCMke2NvbXBvbmVudFRvSGV4KGNsb25lZFJHQi52YWx1ZS5yZWQpfSR7Y29tcG9uZW50VG9IZXgoY2xvbmVkUkdCLnZhbHVlLmdyZWVuKX0ke2NvbXBvbmVudFRvSGV4KGNsb25lZFJHQi52YWx1ZS5ibHVlKX1gXG5cdFx0XHRcdClcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoZXgnIGFzICdoZXgnXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRgcmdiVG9IZXggZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBkZWZhdWx0SGV4QnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiByZ2JUb0hTTChyZ2I6IFJHQik6IEhTTCB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAncmdiVG9IU0woKSc7XG5cblx0dHJ5IHtcblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKHJnYikpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKSB7XG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZFJHQiA9IGNsb25lKHJnYik7XG5cblx0XHRjb25zdCByZWQgPSAoY2xvbmVkUkdCLnZhbHVlLnJlZCBhcyB1bmtub3duIGFzIG51bWJlcikgLyAyNTU7XG5cdFx0Y29uc3QgZ3JlZW4gPSAoY2xvbmVkUkdCLnZhbHVlLmdyZWVuIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblx0XHRjb25zdCBibHVlID0gKGNsb25lZFJHQi52YWx1ZS5ibHVlIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblxuXHRcdGNvbnN0IG1heCA9IE1hdGgubWF4KHJlZCwgZ3JlZW4sIGJsdWUpO1xuXHRcdGNvbnN0IG1pbiA9IE1hdGgubWluKHJlZCwgZ3JlZW4sIGJsdWUpO1xuXG5cdFx0bGV0IGh1ZSA9IDAsXG5cdFx0XHRzYXR1cmF0aW9uID0gMCxcblx0XHRcdGxpZ2h0bmVzcyA9IChtYXggKyBtaW4pIC8gMjtcblxuXHRcdGlmIChtYXggIT09IG1pbikge1xuXHRcdFx0Y29uc3QgZGVsdGEgPSBtYXggLSBtaW47XG5cblx0XHRcdHNhdHVyYXRpb24gPVxuXHRcdFx0XHRsaWdodG5lc3MgPiAwLjUgPyBkZWx0YSAvICgyIC0gbWF4IC0gbWluKSA6IGRlbHRhIC8gKG1heCArIG1pbik7XG5cblx0XHRcdHN3aXRjaCAobWF4KSB7XG5cdFx0XHRcdGNhc2UgcmVkOlxuXHRcdFx0XHRcdGh1ZSA9IChncmVlbiAtIGJsdWUpIC8gZGVsdGEgKyAoZ3JlZW4gPCBibHVlID8gNiA6IDApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIGdyZWVuOlxuXHRcdFx0XHRcdGh1ZSA9IChibHVlIC0gcmVkKSAvIGRlbHRhICsgMjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBibHVlOlxuXHRcdFx0XHRcdGh1ZSA9IChyZWQgLSBncmVlbikgLyBkZWx0YSArIDQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRodWUgKj0gNjA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoTWF0aC5yb3VuZChodWUpKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQoc2F0dXJhdGlvbiAqIDEwMCkpLFxuXHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShNYXRoLnJvdW5kKGxpZ2h0bmVzcyAqIDEwMCkpXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpIHtcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YHJnYlRvSFNMKCkgZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmdiVG9IU1YocmdiOiBSR0IpOiBIU1Yge1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ3JnYlRvSFNWKCknO1xuXG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhyZ2IpKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcikge1xuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBkZWZhdWx0SFNWQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCByZWQgPSAocmdiLnZhbHVlLnJlZCBhcyB1bmtub3duIGFzIG51bWJlcikgLyAyNTU7XG5cdFx0Y29uc3QgZ3JlZW4gPSAocmdiLnZhbHVlLmdyZWVuIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblx0XHRjb25zdCBibHVlID0gKHJnYi52YWx1ZS5ibHVlIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblxuXHRcdGNvbnN0IG1heCA9IE1hdGgubWF4KHJlZCwgZ3JlZW4sIGJsdWUpO1xuXHRcdGNvbnN0IG1pbiA9IE1hdGgubWluKHJlZCwgZ3JlZW4sIGJsdWUpO1xuXHRcdGNvbnN0IGRlbHRhID0gbWF4IC0gbWluO1xuXG5cdFx0bGV0IGh1ZSA9IDA7XG5cblx0XHRjb25zdCB2YWx1ZSA9IG1heDtcblx0XHRjb25zdCBzYXR1cmF0aW9uID0gbWF4ID09PSAwID8gMCA6IGRlbHRhIC8gbWF4O1xuXG5cdFx0aWYgKG1heCAhPT0gbWluKSB7XG5cdFx0XHRzd2l0Y2ggKG1heCkge1xuXHRcdFx0XHRjYXNlIHJlZDpcblx0XHRcdFx0XHRodWUgPSAoZ3JlZW4gLSBibHVlKSAvIGRlbHRhICsgKGdyZWVuIDwgYmx1ZSA/IDYgOiAwKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBncmVlbjpcblx0XHRcdFx0XHRodWUgPSAoYmx1ZSAtIHJlZCkgLyBkZWx0YSArIDI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgYmx1ZTpcblx0XHRcdFx0XHRodWUgPSAocmVkIC0gZ3JlZW4pIC8gZGVsdGEgKyA0O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRodWUgKj0gNjA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoTWF0aC5yb3VuZChodWUpKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQoc2F0dXJhdGlvbiAqIDEwMCkpLFxuXHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKE1hdGgucm91bmQodmFsdWUgKiAxMDApKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKSB7XG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGByZ2JUb0hTVigpIGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRlZmF1bHRIU1ZCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJnYlRvWFlaKHJnYjogUkdCKTogWFlaIHtcblx0Y29uc3QgdGhpc01ldGhvZCA9ICdyZ2JUb1hZWigpJztcblxuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMocmdiKSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpIHtcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIFJHQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHJnYil9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZGVmYXVsdFhZWkJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmVkID0gKHJnYi52YWx1ZS5yZWQgYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMjU1O1xuXHRcdGNvbnN0IGdyZWVuID0gKHJnYi52YWx1ZS5ncmVlbiBhcyB1bmtub3duIGFzIG51bWJlcikgLyAyNTU7XG5cdFx0Y29uc3QgYmx1ZSA9IChyZ2IudmFsdWUuYmx1ZSBhcyB1bmtub3duIGFzIG51bWJlcikgLyAyNTU7XG5cblx0XHRjb25zdCBjb3JyZWN0ZWRSZWQgPVxuXHRcdFx0cmVkID4gMC4wNDA0NSA/IE1hdGgucG93KChyZWQgKyAwLjA1NSkgLyAxLjA1NSwgMi40KSA6IHJlZCAvIDEyLjkyO1xuXHRcdGNvbnN0IGNvcnJlY3RlZEdyZWVuID1cblx0XHRcdGdyZWVuID4gMC4wNDA0NVxuXHRcdFx0XHQ/IE1hdGgucG93KChncmVlbiArIDAuMDU1KSAvIDEuMDU1LCAyLjQpXG5cdFx0XHRcdDogZ3JlZW4gLyAxMi45Mjtcblx0XHRjb25zdCBjb3JyZWN0ZWRCbHVlID1cblx0XHRcdGJsdWUgPiAwLjA0MDQ1XG5cdFx0XHRcdD8gTWF0aC5wb3coKGJsdWUgKyAwLjA1NSkgLyAxLjA1NSwgMi40KVxuXHRcdFx0XHQ6IGJsdWUgLyAxMi45MjtcblxuXHRcdGNvbnN0IHNjYWxlZFJlZCA9IGNvcnJlY3RlZFJlZCAqIDEwMDtcblx0XHRjb25zdCBzY2FsZWRHcmVlbiA9IGNvcnJlY3RlZEdyZWVuICogMTAwO1xuXHRcdGNvbnN0IHNjYWxlZEJsdWUgPSBjb3JyZWN0ZWRCbHVlICogMTAwO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHg6IGJyYW5kLmFzWFlaX1goXG5cdFx0XHRcdFx0TWF0aC5yb3VuZChcblx0XHRcdFx0XHRcdHNjYWxlZFJlZCAqIDAuNDEyNCArXG5cdFx0XHRcdFx0XHRcdHNjYWxlZEdyZWVuICogMC4zNTc2ICtcblx0XHRcdFx0XHRcdFx0c2NhbGVkQmx1ZSAqIDAuMTgwNVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KSxcblx0XHRcdFx0eTogYnJhbmQuYXNYWVpfWShcblx0XHRcdFx0XHRNYXRoLnJvdW5kKFxuXHRcdFx0XHRcdFx0c2NhbGVkUmVkICogMC4yMTI2ICtcblx0XHRcdFx0XHRcdFx0c2NhbGVkR3JlZW4gKiAwLjcxNTIgK1xuXHRcdFx0XHRcdFx0XHRzY2FsZWRCbHVlICogMC4wNzIyXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpLFxuXHRcdFx0XHR6OiBicmFuZC5hc1hZWl9aKFxuXHRcdFx0XHRcdE1hdGgucm91bmQoXG5cdFx0XHRcdFx0XHRzY2FsZWRSZWQgKiAwLjAxOTMgK1xuXHRcdFx0XHRcdFx0XHRzY2FsZWRHcmVlbiAqIDAuMTE5MiArXG5cdFx0XHRcdFx0XHRcdHNjYWxlZEJsdWUgKiAwLjk1MDVcblx0XHRcdFx0XHQpXG5cdFx0XHRcdClcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcikge1xuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgcmdiVG9YWVogZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIGRlZmF1bHRYWVpCcmFuZGVkO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHh5elRvSFNMKHh5ejogWFlaKTogSFNMIHtcblx0Y29uc3QgdGhpc01ldGhvZCA9ICd4eXpUb0hTTCgpJztcblxuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoeHl6KSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgSW52YWxpZCBYWVogdmFsdWUgJHtKU09OLnN0cmluZ2lmeSh4eXopfWAsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEhTTEJyYW5kZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJnYlRvSFNMKHh5elRvUkdCKGNsb25lKHh5eikpKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YHh5elRvSFNMKCkgZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBkZWZhdWx0SFNMQnJhbmRlZDtcblx0fVxufVxuXG5mdW5jdGlvbiB4eXpUb0xBQih4eXo6IFhZWik6IExBQiB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAneHl6VG9MQUIoKSc7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyh4eXopKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBJbnZhbGlkIFhZWiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHh5eil9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0TEFCQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRYWVogPSBjbG9uZSh4eXopO1xuXHRcdGNvbnN0IHJlZlggPSA5NS4wNDcsXG5cdFx0XHRyZWZZID0gMTAwLjAsXG5cdFx0XHRyZWZaID0gMTA4Ljg4MztcblxuXHRcdGNsb25lZFhZWi52YWx1ZS54ID0gKGNsb25lZFhZWi52YWx1ZS54IC8gcmVmWCkgYXMgWFlaX1g7XG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnkgPSAoY2xvbmVkWFlaLnZhbHVlLnkgLyByZWZZKSBhcyBYWVpfWTtcblx0XHRjbG9uZWRYWVoudmFsdWUueiA9IChjbG9uZWRYWVoudmFsdWUueiAvIHJlZlopIGFzIFhZWl9aO1xuXG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnggPVxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnggPiAwLjAwODg1NlxuXHRcdFx0XHQ/IChNYXRoLnBvdyhjbG9uZWRYWVoudmFsdWUueCwgMSAvIDMpIGFzIFhZWl9YKVxuXHRcdFx0XHQ6ICgoNy43ODcgKiBjbG9uZWRYWVoudmFsdWUueCArIDE2IC8gMTE2KSBhcyBYWVpfWCk7XG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnkgPVxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnkgPiAwLjAwODg1NlxuXHRcdFx0XHQ/IChNYXRoLnBvdyhjbG9uZWRYWVoudmFsdWUueSwgMSAvIDMpIGFzIFhZWl9ZKVxuXHRcdFx0XHQ6ICgoNy43ODcgKiBjbG9uZWRYWVoudmFsdWUueSArIDE2IC8gMTE2KSBhcyBYWVpfWSk7XG5cdFx0Y2xvbmVkWFlaLnZhbHVlLnogPVxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnogPiAwLjAwODg1NlxuXHRcdFx0XHQ/IChNYXRoLnBvdyhjbG9uZWRYWVoudmFsdWUueiwgMSAvIDMpIGFzIFhZWl9aKVxuXHRcdFx0XHQ6ICgoNy43ODcgKiBjbG9uZWRYWVoudmFsdWUueiArIDE2IC8gMTE2KSBhcyBYWVpfWik7XG5cblx0XHRjb25zdCBsID0gc2FuaXRpemUucGVyY2VudGlsZShcblx0XHRcdHBhcnNlRmxvYXQoKDExNiAqIGNsb25lZFhZWi52YWx1ZS55IC0gMTYpLnRvRml4ZWQoMikpXG5cdFx0KTtcblx0XHRjb25zdCBhID0gc2FuaXRpemUubGFiKFxuXHRcdFx0cGFyc2VGbG9hdChcblx0XHRcdFx0KDUwMCAqIChjbG9uZWRYWVoudmFsdWUueCAtIGNsb25lZFhZWi52YWx1ZS55KSkudG9GaXhlZCgyKVxuXHRcdFx0KSxcblx0XHRcdCdhJ1xuXHRcdCk7XG5cdFx0Y29uc3QgYiA9IHNhbml0aXplLmxhYihcblx0XHRcdHBhcnNlRmxvYXQoXG5cdFx0XHRcdCgyMDAgKiAoY2xvbmVkWFlaLnZhbHVlLnkgLSBjbG9uZWRYWVoudmFsdWUueikpLnRvRml4ZWQoMilcblx0XHRcdCksXG5cdFx0XHQnYidcblx0XHQpO1xuXG5cdFx0Y29uc3QgbGFiOiBMQUIgPSB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRsOiBicmFuZC5hc0xBQl9MKE1hdGgucm91bmQobCkpLFxuXHRcdFx0XHRhOiBicmFuZC5hc0xBQl9BKE1hdGgucm91bmQoYSkpLFxuXHRcdFx0XHRiOiBicmFuZC5hc0xBQl9CKE1hdGgucm91bmQoYikpXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdH07XG5cblx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWVzKGxhYikpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRMQUJCcmFuZGVkO1xuXHRcdH1cblxuXHRcdHJldHVybiBsYWI7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGB4eXpUb0xhYigpIGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gZGVmYXVsdExBQkJyYW5kZWQ7XG5cdH1cbn1cblxuZnVuY3Rpb24geHl6VG9SR0IoeHl6OiBYWVopOiBSR0Ige1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ3h5elRvUkdCKCknO1xuXG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyh4eXopKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcikge1xuXHRcdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgWFlaIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoeHl6KX1gLFxuXHRcdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBkZWZhdWx0UkdCQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCB4ID0gKHh5ei52YWx1ZS54IGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDEwMDtcblx0XHRjb25zdCB5ID0gKHh5ei52YWx1ZS55IGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDEwMDtcblx0XHRjb25zdCB6ID0gKHh5ei52YWx1ZS56IGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDEwMDtcblxuXHRcdGxldCByZWQgPSB4ICogMy4yNDA2ICsgeSAqIC0xLjUzNzIgKyB6ICogLTAuNDk4Njtcblx0XHRsZXQgZ3JlZW4gPSB4ICogLTAuOTY4OSArIHkgKiAxLjg3NTggKyB6ICogMC4wNDE1O1xuXHRcdGxldCBibHVlID0geCAqIDAuMDU1NyArIHkgKiAtMC4yMDQgKyB6ICogMS4wNTc7XG5cblx0XHRyZWQgPSBhcHBseUdhbW1hQ29ycmVjdGlvbihyZWQpO1xuXHRcdGdyZWVuID0gYXBwbHlHYW1tYUNvcnJlY3Rpb24oZ3JlZW4pO1xuXHRcdGJsdWUgPSBhcHBseUdhbW1hQ29ycmVjdGlvbihibHVlKTtcblxuXHRcdGNvbnN0IHJnYjogUkdCID0gY2xhbXBSR0Ioe1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZShNYXRoLnJvdW5kKHJlZCkpLFxuXHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UoTWF0aC5yb3VuZChncmVlbikpLFxuXHRcdFx0XHRibHVlOiBicmFuZC5hc0J5dGVSYW5nZShNYXRoLnJvdW5kKGJsdWUpKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9KTtcblxuXHRcdHJldHVybiByZ2I7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpIHtcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YHh5elRvUkdCIGVycm9yOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiBkZWZhdWx0UkdCQnJhbmRlZDtcblx0fVxufVxuXG4vLyAqKioqKioqKiBCVU5ETEVEIENPTlZFUlNJT04gRlVOQ1RJT05TICoqKioqKioqXG5cbmZ1bmN0aW9uIGhzbFRvKGNvbG9yOiBIU0wsIGNvbG9yU3BhY2U6IENvbG9yU3BhY2VFeHRlbmRlZCk6IENvbG9yIHtcblx0Y29uc3QgdGhpc01ldGhvZCA9ICdoc2xUbygpJztcblxuXHR0cnkge1xuXHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZXMoY29sb3IpKSB7XG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBJbnZhbGlkIGNvbG9yIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0UkdCQnJhbmRlZDtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRDb2xvciA9IGNsb25lKGNvbG9yKSBhcyBIU0w7XG5cblx0XHRzd2l0Y2ggKGNvbG9yU3BhY2UpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9DTVlLKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBoc2xUb0hleChjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gY2xvbmUoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIGhzbFRvSFNWKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdHJldHVybiBoc2xUb0xBQihjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9SR0IoY2xvbmVkQ29sb3IpO1xuXHRcdFx0Y2FzZSAnc2wnOlxuXHRcdFx0XHRyZXR1cm4gaHNsVG9TTChjbG9uZWRDb2xvcik7XG5cdFx0XHRjYXNlICdzdic6XG5cdFx0XHRcdHJldHVybiBoc2xUb1NWKGNsb25lZENvbG9yKTtcblx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdHJldHVybiBoc2xUb1hZWihjbG9uZWRDb2xvcik7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29sb3IgZm9ybWF0Jyk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgaHNsVG8oKSBlcnJvcjogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5mdW5jdGlvbiB0b0hTTChjb2xvcjogRXhjbHVkZTxDb2xvciwgU0wgfCBTVj4pOiBIU0wge1xuXHRjb25zdCB0aGlzTWV0aG9kID0gJ3RvSFNMKCknO1xuXG5cdHRyeSB7XG5cdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlcyhjb2xvcikpIHtcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEludmFsaWQgY29sb3IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRIU0xCcmFuZGVkO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZENvbG9yID0gY2xvbmUoY29sb3IpO1xuXG5cdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gY215a1RvSFNMKGNsb25lZENvbG9yIGFzIENNWUspO1xuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0cmV0dXJuIGhleFRvSFNMKGNsb25lZENvbG9yIGFzIEhleCk7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRyZXR1cm4gY2xvbmUoY2xvbmVkQ29sb3IgYXMgSFNMKTtcblx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdHJldHVybiBoc3ZUb0hTTChjbG9uZWRDb2xvciBhcyBIU1YpO1xuXHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0cmV0dXJuIGxhYlRvSFNMKGNsb25lZENvbG9yIGFzIExBQik7XG5cdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRyZXR1cm4gcmdiVG9IU0woY2xvbmVkQ29sb3IgYXMgUkdCKTtcblx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdHJldHVybiB4eXpUb0hTTChjbG9uZWRDb2xvciBhcyBYWVopO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvbG9yIGZvcm1hdCcpO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYHRvSFNMKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGNvcmVDb252ZXJzaW9uVXRpbHM6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsnY29udmVydCddID0ge1xuXHRoc2xUbyxcblx0dG9IU0wsXG5cdHdyYXBwZXJzOiB7XG5cdFx0aGV4VG9IU0w6IGhleFRvSFNMV3JhcHBlclxuXHR9XG59O1xuIl19