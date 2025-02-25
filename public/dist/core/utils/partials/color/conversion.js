// File: common/utils/partials/conversion.ts
import { config, defaults } from '../../../../config/index.js';
const defaultCMYK = defaults.colors.cmyk;
const defaultHex = defaults.colors.hex;
const defaultHSL = defaults.colors.hsl;
const defaultHSV = defaults.colors.hsv;
const defaultLAB = defaults.colors.lab;
const defaultRGB = defaults.colors.rgb;
const defaultSL = defaults.colors.sl;
const defaultSV = defaults.colors.sv;
const defaultXYZ = defaults.colors.xyz;
const math = config.math;
export function colorConversionUtilitiesFactory(adjust, brand, format, helpers, sanitize, services, validate) {
    const { color: { hueToRGB }, data: { clone } } = helpers;
    const { errors, log } = services;
    function cmykToHSL(cmyk) {
        return errors.handleSync(() => {
            if (!validate.colorValue(cmyk)) {
                log.info(`Invalid CMYK value ${JSON.stringify(cmyk)}. Returning default HSL`, `utils.color.cmykToHSL`);
                return defaultHSL;
            }
            return rgbToHSL(cmykToRGB(clone(cmyk)));
        }, 'Error converting CMYK to HSL');
    }
    function cmykToRGB(cmyk) {
        return errors.handleSync(() => {
            if (!validate.colorValue(cmyk)) {
                log.info(`Invalid CMYK value ${JSON.stringify(cmyk)}. Returning default RGB.`, `utils.color.cmykToRGB`);
                return defaultRGB;
            }
            const clonedCMYK = clone(cmyk);
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
                    red: brand.asByteRange(sanitize.percentile(r)),
                    green: brand.asByteRange(sanitize.percentile(g)),
                    blue: brand.asByteRange(sanitize.percentile(b))
                },
                format: 'rgb'
            };
            return adjust.clampRGB(rgb);
        }, 'Error converting CMYK to RGB');
    }
    function convertHSL(color, colorSpace) {
        return errors.handleSync(() => {
            if (!validate.colorValue(color)) {
                log.info(`Invalid color value ${JSON.stringify(color)}. Returning default HSL.`, `utils.color.convertHSL`);
                return defaultHSL;
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
        }, 'Error converting HSL to color');
    }
    function convertToHSL(color) {
        return errors.handleSync(() => {
            if (!validate.colorValue(color)) {
                log.info(`Invalid color value ${JSON.stringify(color)}. Returning default HSL`, `utils.color.convertToHSL`);
                return defaultHSL;
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
        }, 'Error converting color to HSL');
    }
    function hexToHSL(hex) {
        return errors.handleSync(() => {
            if (!validate.colorValue(hex)) {
                log.info(`Invalid Hex value ${JSON.stringify(hex)}. Returning default HSL`, `utils.color.hexToHSL`);
                return defaultHSL;
            }
            return rgbToHSL(hexToRGB(clone(hex)));
        }, 'Error converting Hex to HSL');
    }
    function hexToHSLWrapper(input) {
        return errors.handleSync(() => {
            const clonedInput = clone(input);
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
        }, 'Error converting Hex to HSL');
    }
    function hexToRGB(hex) {
        return errors.handleSync(() => {
            if (!validate.colorValue(hex)) {
                log.info(`Invalid Hex value ${JSON.stringify(hex)}. Returning default RGB`, `utils.color.hexToRGB`);
                return defaultRGB;
            }
            const clonedHex = clone(hex);
            const strippedHex = format.stripHashFromHex(clonedHex).value.hex;
            const bigint = parseInt(strippedHex, 16);
            return {
                value: {
                    red: brand.asByteRange(sanitize.percentile((bigint >> 16) & 255)),
                    green: brand.asByteRange(sanitize.percentile((bigint >> 8) & 255)),
                    blue: brand.asByteRange(sanitize.percentile(bigint & 255))
                },
                format: 'rgb'
            };
        }, 'Error converting Hex to RGB');
    }
    function hslToCMYK(hsl) {
        return errors.handleSync(() => {
            if (!validate.colorValue(hsl)) {
                log.info(`Invalid HSL value ${JSON.stringify(hsl)}. Returning default CMYK.`, `utils.color.hslToCMYK`);
                return defaultCMYK;
            }
            return rgbToCMYK(hslToRGB(clone(hsl)));
        }, 'Error converting HSL to CMYK');
    }
    function hslToHex(hsl) {
        return errors.handleSync(() => {
            if (!validate.colorValue(hsl)) {
                log.info(`Invalid HSL value ${JSON.stringify(hsl)}. Returning default Hex`, `utils.color.hslToHex`);
                return defaultHex;
            }
            return rgbToHex(hslToRGB(clone(hsl)));
        }, 'Error converting HSL to Hex');
    }
    function hslToHSV(hsl) {
        return errors.handleSync(() => {
            if (!validate.colorValue(hsl)) {
                log.info(`Invalid HSL value ${JSON.stringify(hsl)}. Returning default HSV`, `utils.color.hslToHSV`);
                return defaultHSV;
            }
            const clonedHSL = clone(hsl);
            const s = clonedHSL.value.saturation / 100;
            const l = clonedHSL.value.lightness / 100;
            const value = l + s * Math.min(l, 1 - 1);
            const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);
            return {
                value: {
                    hue: brand.asRadial(sanitize.percentile(clonedHSL.value.hue)),
                    saturation: brand.asPercentile(sanitize.percentile(newSaturation * 100)),
                    value: brand.asPercentile(sanitize.percentile(value * 100))
                },
                format: 'hsv'
            };
        }, 'Error converting HSL to HSV');
    }
    function hslToLAB(hsl) {
        return errors.handleSync(() => {
            if (!validate.colorValue(hsl)) {
                log.info(`Invalid HSL value ${JSON.stringify(hsl)}. Returning default LAB`, `utils.color.hslToLAB`);
                return defaultLAB;
            }
            return xyzToLAB(rgbToXYZ(hslToRGB(clone(hsl))));
        }, 'Error converting HSL to LAB');
    }
    function hslToRGB(hsl) {
        return errors.handleSync(() => {
            if (!validate.colorValue(hsl)) {
                log.info(`Invalid HSL value ${JSON.stringify(hsl)}. Returning default RGB`, `utils.color.hslToRGB`);
                return defaultRGB;
            }
            const clonedHSL = clone(hsl);
            const hue = clonedHSL.value.hue / 360;
            const s = clonedHSL.value.saturation / 100;
            const l = clonedHSL.value.lightness / 100;
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            return {
                value: {
                    red: brand.asByteRange(sanitize.percentile(hueToRGB(p, q, hue + 1 / 3) * 255)),
                    green: brand.asByteRange(sanitize.percentile(hueToRGB(p, q, hue) * 255)),
                    blue: brand.asByteRange(sanitize.percentile(hueToRGB(p, q, hue - 1 / 3) * 255))
                },
                format: 'rgb'
            };
        }, 'Error converting HSL to RGB');
    }
    function hslToSL(hsl) {
        return errors.handleSync(() => {
            if (!validate.colorValue(hsl)) {
                log.info(`Invalid HSL value ${JSON.stringify(hsl)}. Returning default SL`, `utils.color.hslToSL`);
                return defaultSL;
            }
            return {
                value: {
                    saturation: hsl.value.saturation,
                    lightness: hsl.value.lightness
                },
                format: 'sl'
            };
        }, 'Error converting HSL to SL');
    }
    function hslToSV(hsl) {
        return errors.handleSync(() => {
            if (!validate.colorValue(hsl)) {
                log.info(`Invalid HSL value ${JSON.stringify(hsl)}. Returning default SV`, `utils.color.hslToSV`);
                return defaultSV;
            }
            return hsvToSV(rgbToHSV(hslToRGB(clone(hsl))));
        }, 'Error converting HSL to SV');
    }
    function hslToXYZ(hsl) {
        return errors.handleSync(() => {
            if (!validate.colorValue(hsl)) {
                log.info(`Invalid HSL value ${JSON.stringify(hsl)}. Returning default HSL.`, `utils.color.hslToXYZ`);
                return defaultXYZ;
            }
            return labToXYZ(hslToLAB(clone(hsl)));
        }, 'Error converting HSL to XYZ');
    }
    function hsvToHSL(hsv) {
        return errors.handleSync(() => {
            if (!validate.colorValue(hsv)) {
                log.info(`Invalid HSV value ${JSON.stringify(hsv)}. Returning default HSL`, `utils.color.hsvToHSL`);
                return defaultHSL;
            }
            const clonedHSV = clone(hsv);
            const s = clonedHSV.value.saturation / 100;
            const v = clonedHSV.value.value / 100;
            const l = v * (1 - s / 2);
            const newSaturation = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
            const lightness = clonedHSV.value.value * (1 - clonedHSV.value.saturation / 200);
            return {
                value: {
                    hue: brand.asRadial(sanitize.percentile(clonedHSV.value.hue)),
                    saturation: brand.asPercentile(sanitize.percentile(newSaturation * 100)),
                    lightness: brand.asPercentile(sanitize.percentile(lightness))
                },
                format: 'hsl'
            };
        }, 'Error converting HSV to HSL');
    }
    function hsvToSV(hsv) {
        return errors.handleSync(() => {
            if (!validate.colorValue(hsv)) {
                log.info(`Invalid HSV value ${JSON.stringify(hsv)}. Returning default SV`, `utils.color.hsvToSV`);
                return defaultSV;
            }
            return {
                value: {
                    saturation: hsv.value.saturation,
                    value: hsv.value.value
                },
                format: 'sv'
            };
        }, 'Error converting HSV to SV');
    }
    function labToHSL(lab) {
        return errors.handleSync(() => {
            if (!validate.colorValue(lab)) {
                log.info(`Invalid LAB value ${JSON.stringify(lab)}. Returning default HSL.`, `utils.color.labToHSL`);
                return defaultHSL;
            }
            return rgbToHSL(labToRGB(clone(lab)));
        }, 'Error converting LAB to HSL');
    }
    function labToRGB(lab) {
        return errors.handleSync(() => {
            if (!validate.colorValue(lab)) {
                log.info(`Invalid LAB value ${JSON.stringify(lab)}. . Returning default RGB.`, `utils.color.labToRGB`);
                return defaultRGB;
            }
            return xyzToRGB(labToXYZ(clone(lab)));
        }, 'Error converting LAB to RGB');
    }
    function labToXYZ(lab) {
        return errors.handleSync(() => {
            if (!validate.colorValue(lab)) {
                log.info(`Invalid LAB value ${JSON.stringify(lab)}. Returning default XYZ.`, `utils.color.labToXYZ`);
                return defaultXYZ;
            }
            const clonedLAB = clone(lab);
            const refX = 95.047, refY = 100.0, refZ = 108.883;
            let y = (clonedLAB.value.l + 16) / 116;
            let x = clonedLAB.value.a / 500 + y;
            let z = y - clonedLAB.value.b / 200;
            const pow = Math.pow;
            return {
                value: {
                    x: brand.asXYZ_X(sanitize.percentile(refX *
                        (pow(x, 3) > 0.008856
                            ? pow(x, 3)
                            : (x - 16 / 116) / 7.787))),
                    y: brand.asXYZ_Y(sanitize.percentile(refY *
                        (pow(y, 3) > 0.008856
                            ? pow(y, 3)
                            : (y - 16 / 116) / 7.787))),
                    z: brand.asXYZ_Z(sanitize.percentile(refZ *
                        (pow(z, 3) > 0.008856
                            ? pow(z, 3)
                            : (z - 16 / 116) / 7.787)))
                },
                format: 'xyz'
            };
        }, 'Error converting LAB to XYZ');
    }
    function rgbToCMYK(rgb) {
        return errors.handleSync(() => {
            if (!validate.colorValue(rgb)) {
                log.info(`Invalid RGB value ${JSON.stringify(rgb)}.. Returning default CMYK`, `utils.color.rgbToCMYK`);
                return defaultCMYK;
            }
            const clonedRGB = clone(rgb);
            const redPrime = clonedRGB.value.red / 255;
            const greenPrime = clonedRGB.value.green / 255;
            const bluePrime = clonedRGB.value.blue / 255;
            const key = sanitize.percentile(sanitize.percentile(1 - Math.max(redPrime, greenPrime, bluePrime)));
            const cyan = sanitize.percentile(sanitize.percentile((1 - redPrime - key) / (1 - key) || 0));
            const magenta = sanitize.percentile(sanitize.percentile((1 - greenPrime - key) / (1 - key) || 0));
            const yellow = sanitize.percentile(sanitize.percentile((1 - bluePrime - key) / (1 - key) || 0));
            const format = 'cmyk';
            const cmyk = { value: { cyan, magenta, yellow, key }, format };
            log.info(`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(clone(cmyk))}`, `utils.color.rgbToCMYK`);
            return cmyk;
        }, 'Error converting RGB to CMYK');
    }
    function rgbToHex(rgb) {
        return errors.handleSync(() => {
            if (!validate.colorValue(rgb)) {
                log.info(`Invalid RGB value ${JSON.stringify(rgb)}. . Returning default Hex.`, `utils.color.rgbToHex`);
                return defaultHex;
            }
            const clonedRGB = clone(rgb);
            if ([
                clonedRGB.value.red,
                clonedRGB.value.green,
                clonedRGB.value.blue
            ].some(v => isNaN(v) || v < 0 || v > 255)) {
                log.info(`Invalid RGB values:\nR=${JSON.stringify(clonedRGB.value.red)}\nG=${JSON.stringify(clonedRGB.value.green)}\nB=${JSON.stringify(clonedRGB.value.blue)}\nReturning default Hex.`, `utils.color.rgbToHex`);
                return defaultHex;
            }
            return {
                value: {
                    hex: brand.asHexSet(`#${format.componentToHex(clonedRGB.value.red)}${format.componentToHex(clonedRGB.value.green)}${format.componentToHex(clonedRGB.value.blue)}`)
                },
                format: 'hex'
            };
        }, 'Error converting RGB to Hex');
    }
    function rgbToHSL(rgb) {
        return errors.handleSync(() => {
            if (!validate.colorValue(rgb)) {
                log.info(`Invalid RGB value ${JSON.stringify(rgb)}. Returning default HSL.`, `utils.color.rgbToHSL`);
                return defaultHSL;
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
                    lightness > 0.5
                        ? delta / (2 - max - min)
                        : delta / (max + min);
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
                    hue: brand.asRadial(sanitize.percentile(hue)),
                    saturation: brand.asPercentile(sanitize.percentile(saturation * 100)),
                    lightness: brand.asPercentile(sanitize.percentile(lightness * 100))
                },
                format: 'hsl'
            };
        }, 'Error converting RGB to HSL');
    }
    function rgbToHSV(rgb) {
        return errors.handleSync(() => {
            if (!validate.colorValue(rgb)) {
                log.info(`Invalid RGB value ${JSON.stringify(rgb)}. Returning default HSV.`, `utils.color.rgbToHSV`);
                return defaultHSV;
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
                    hue: brand.asRadial(sanitize.percentile(hue)),
                    saturation: brand.asPercentile(sanitize.percentile(saturation * 100)),
                    value: brand.asPercentile(sanitize.percentile(value * 100))
                },
                format: 'hsv'
            };
        }, 'Error converting RGB to HSV');
    }
    function rgbToXYZ(rgb) {
        return errors.handleSync(() => {
            if (!validate.colorValue(rgb)) {
                log.info(`Invalid RGB value ${JSON.stringify(rgb)}. Returning default XYZ`, `utils.color.rgbToXYZ`);
                return defaultXYZ;
            }
            // convert RGB values to linear space
            const red = rgb.value.red / 255;
            const green = rgb.value.green / 255;
            const blue = rgb.value.blue / 255;
            const linearRed = red > 0.04045
                ? Math.pow((red + 0.055) / 1.055, 2.4)
                : red / 12.92;
            const linearGreen = green > 0.04045
                ? Math.pow((green + 0.055) / 1.055, 2.4)
                : green / 12.92;
            const linearBlue = blue > 0.04045
                ? Math.pow((blue + 0.055) / 1.055, 2.4)
                : blue / 12.92;
            // scale to 100
            const scaledRed = linearRed * 100;
            const scaledGreen = linearGreen * 100;
            const scaledBlue = linearBlue * 100;
            const x = brand.asXYZ_X(adjust.clampXYZ(scaledRed * 0.4124 +
                scaledGreen * 0.3576 +
                scaledBlue * 0.1805, math.maxXYZ_X));
            const y = brand.asXYZ_Y(adjust.clampXYZ(scaledRed * 0.2126 +
                scaledGreen * 0.7152 +
                scaledBlue * 0.0722, math.maxXYZ_Y));
            const z = brand.asXYZ_Z(adjust.clampXYZ(scaledRed * 0.0193 +
                scaledGreen * 0.1192 +
                scaledBlue * 0.9505, math.maxXYZ_Z));
            const xyz = { value: { x, y, z }, format: 'xyz' };
            return validate.colorValue(xyz) ? xyz : defaultXYZ;
        }, 'Error converting RGB to XYZ');
    }
    function xyzToHSL(xyz) {
        return errors.handleSync(() => {
            if (!validate.colorValue(xyz)) {
                log.info(`Invalid XYZ value ${JSON.stringify(xyz)}. Returning default HSL.`, `utils.color.xyzToHSL`);
                return defaultHSL;
            }
            return rgbToHSL(xyzToRGB(clone(xyz)));
        }, 'Error converting XYZ to HSL');
    }
    function xyzToLAB(xyz) {
        return errors.handleSync(() => {
            if (!validate.colorValue(xyz)) {
                log.info(`Invalid XYZ value ${JSON.stringify(xyz)}. Returning default LAB.`, `utils.color.xyzToLAB`);
                return defaultLAB;
            }
            const clonedXYZ = clone(xyz);
            const refX = math.maxXYZ_X, refY = math.maxXYZ_Y, refZ = math.maxXYZ_Z;
            clonedXYZ.value.x = adjust.normalizeXYZ(clonedXYZ.value.x, refX);
            clonedXYZ.value.y = adjust.normalizeXYZ(clonedXYZ.value.y, refY);
            clonedXYZ.value.z = adjust.normalizeXYZ(clonedXYZ.value.z, refZ);
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
                    l: brand.asLAB_L(sanitize.percentile(l)),
                    a: brand.asLAB_A(sanitize.percentile(a)),
                    b: brand.asLAB_B(sanitize.percentile(b))
                },
                format: 'lab'
            };
            if (!validate.colorValue(lab)) {
                log.info(`Invalid LAB value ${JSON.stringify(lab)}. Returning default LAB.`, `utils.color.xyzToLAB`);
                return defaultLAB;
            }
            return lab;
        }, 'Error converting XYZ to LAB');
    }
    function xyzToRGB(xyz) {
        return errors.handleSync(() => {
            if (!validate.colorValue(xyz)) {
                log.info(`Invalid XYZ value ${JSON.stringify(xyz)}. Returning default RGB.`, `utils.color.xyzToRGB`);
                return defaultRGB;
            }
            const x = xyz.value.x / 100;
            const y = xyz.value.y / 100;
            const z = xyz.value.z / 100;
            let red = x * 3.2406 + y * -1.5372 + z * -0.4986;
            let green = x * -0.9689 + y * 1.8758 + z * 0.0415;
            let blue = x * 0.0557 + y * -0.204 + z * 1.057;
            red = adjust.applyGammaCorrection(red);
            green = adjust.applyGammaCorrection(green);
            blue = adjust.applyGammaCorrection(blue);
            const rgb = adjust.clampRGB({
                value: {
                    red: brand.asByteRange(sanitize.percentile(red)),
                    green: brand.asByteRange(sanitize.percentile(green)),
                    blue: brand.asByteRange(sanitize.percentile(blue))
                },
                format: 'rgb'
            });
            return rgb;
        }, 'Error converting XYZ to RGB');
    }
    const colorConversionUtilities = {
        cmykToHSL,
        cmykToRGB,
        convertHSL,
        convertToHSL,
        hexToHSL,
        hexToHSLWrapper,
        hexToRGB,
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
        labToRGB,
        labToXYZ,
        rgbToCMYK,
        rgbToHex,
        rgbToHSL,
        rgbToHSV,
        rgbToXYZ,
        xyzToHSL,
        xyzToLAB,
        xyzToRGB
    };
    return errors.handleSync(() => {
        return colorConversionUtilities;
    }, 'Error creating color conversion utilities sub-group.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVyc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jb3JlL3V0aWxzL3BhcnRpYWxzL2NvbG9yL2NvbnZlcnNpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNENBQTRDO0FBMEI1QyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRS9ELE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3pDLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ3ZDLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ3ZDLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ3ZDLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ3ZDLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ3ZDLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO0FBQ3JDLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO0FBQ3JDLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBRXZDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFFekIsTUFBTSxVQUFVLCtCQUErQixDQUM5QyxNQUEyQixFQUMzQixLQUF3QixFQUN4QixNQUEyQixFQUMzQixPQUFnQixFQUNoQixRQUE2QixFQUM3QixRQUFrQixFQUNsQixRQUE2QjtJQUU3QixNQUFNLEVBQ0wsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQ25CLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxFQUNm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Ly8gRmlsZTogY29tbW9uL3V0aWxzL3BhcnRpYWxzL2NvbnZlcnNpb24udHNcblxuaW1wb3J0IHtcblx0QWRqdXN0bWVudFV0aWxpdGllcyxcblx0QnJhbmRpbmdVdGlsaXRpZXMsXG5cdENNWUssXG5cdENvbG9yLFxuXHRDb2xvckNvbnZlcnNpb25VdGlsaXRpZXMsXG5cdENvbG9yU3BhY2VFeHRlbmRlZCxcblx0Rm9ybWF0dGluZ1V0aWxpdGllcyxcblx0SGVscGVycyxcblx0SGV4LFxuXHRIU0wsXG5cdEhTVixcblx0TEFCLFxuXHRSR0IsXG5cdFNhbml0YXRpb25VdGlsaXRpZXMsXG5cdFNlcnZpY2VzLFxuXHRTTCxcblx0U1YsXG5cdFZhbGlkYXRpb25VdGlsaXRpZXMsXG5cdFhZWixcblx0WFlaX1gsXG5cdFhZWl9ZLFxuXHRYWVpfWlxufSBmcm9tICcuLi8uLi8uLi8uLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb25maWcsIGRlZmF1bHRzIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29uZmlnL2luZGV4LmpzJztcblxuY29uc3QgZGVmYXVsdENNWUsgPSBkZWZhdWx0cy5jb2xvcnMuY215aztcbmNvbnN0IGRlZmF1bHRIZXggPSBkZWZhdWx0cy5jb2xvcnMuaGV4O1xuY29uc3QgZGVmYXVsdEhTTCA9IGRlZmF1bHRzLmNvbG9ycy5oc2w7XG5jb25zdCBkZWZhdWx0SFNWID0gZGVmYXVsdHMuY29sb3JzLmhzdjtcbmNvbnN0IGRlZmF1bHRMQUIgPSBkZWZhdWx0cy5jb2xvcnMubGFiO1xuY29uc3QgZGVmYXVsdFJHQiA9IGRlZmF1bHRzLmNvbG9ycy5yZ2I7XG5jb25zdCBkZWZhdWx0U0wgPSBkZWZhdWx0cy5jb2xvcnMuc2w7XG5jb25zdCBkZWZhdWx0U1YgPSBkZWZhdWx0cy5jb2xvcnMuc3Y7XG5jb25zdCBkZWZhdWx0WFlaID0gZGVmYXVsdHMuY29sb3JzLnh5ejtcblxuY29uc3QgbWF0aCA9IGNvbmZpZy5tYXRoO1xuXG5leHBvcnQgZnVuY3Rpb24gY29sb3JDb252ZXJzaW9uVXRpbGl0aWVzRmFjdG9yeShcblx0YWRqdXN0OiBBZGp1c3RtZW50VXRpbGl0aWVzLFxuXHRicmFuZDogQnJhbmRpbmdVdGlsaXRpZXMsXG5cdGZvcm1hdDogRm9ybWF0dGluZ1V0aWxpdGllcyxcblx0aGVscGVyczogSGVscGVycyxcblx0c2FuaXRpemU6IFNhbml0YXRpb25VdGlsaXRpZXMsXG5cdHNlcnZpY2VzOiBTZXJ2aWNlcyxcblx0dmFsaWRhdGU6IFZhbGlkYXRpb25VdGlsaXRpZXNcbik6IENvbG9yQ29udmVyc2lvblV0aWxpdGllcyB7XG5cdGNvbnN0IHtcblx0XHRjb2xvcjogeyBodWVUb1JHQiB9LFxuXHRcdGRhdGE6IHsgY2xvbmUgfVxuXHR9ID0gaGVscGVycztcblx0Y29uc3QgeyBlcnJvcnMsIGxvZyB9ID0gc2VydmljZXM7XG5cblx0ZnVuY3Rpb24gY215a1RvSFNMKGNteWs6IENNWUspOiBIU0wge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWUoY215aykpIHtcblx0XHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdFx0YEludmFsaWQgQ01ZSyB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGNteWspfS4gUmV0dXJuaW5nIGRlZmF1bHQgSFNMYCxcblx0XHRcdFx0XHRgdXRpbHMuY29sb3IuY215a1RvSFNMYFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0SFNMO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmdiVG9IU0woY215a1RvUkdCKGNsb25lKGNteWspKSk7XG5cdFx0fSwgJ0Vycm9yIGNvbnZlcnRpbmcgQ01ZSyB0byBIU0wnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNteWtUb1JHQihjbXlrOiBDTVlLKTogUkdCIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlKGNteWspKSB7XG5cdFx0XHRcdGxvZy5pbmZvKFxuXHRcdFx0XHRcdGBJbnZhbGlkIENNWUsgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjbXlrKX0uIFJldHVybmluZyBkZWZhdWx0IFJHQi5gLFxuXHRcdFx0XHRcdGB1dGlscy5jb2xvci5jbXlrVG9SR0JgXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRSR0I7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNsb25lZENNWUsgPSBjbG9uZShjbXlrKTtcblx0XHRcdGNvbnN0IHIgPVxuXHRcdFx0XHQyNTUgKlxuXHRcdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUuY3lhbiAvIDEwMCkgKlxuXHRcdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUua2V5IC8gMTAwKTtcblx0XHRcdGNvbnN0IGcgPVxuXHRcdFx0XHQyNTUgKlxuXHRcdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUubWFnZW50YSAvIDEwMCkgKlxuXHRcdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUua2V5IC8gMTAwKTtcblx0XHRcdGNvbnN0IGIgPVxuXHRcdFx0XHQyNTUgKlxuXHRcdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUueWVsbG93IC8gMTAwKSAqXG5cdFx0XHRcdCgxIC0gY2xvbmVkQ01ZSy52YWx1ZS5rZXkgLyAxMDApO1xuXHRcdFx0Y29uc3QgcmdiOiBSR0IgPSB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZShzYW5pdGl6ZS5wZXJjZW50aWxlKHIpKSxcblx0XHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2Uoc2FuaXRpemUucGVyY2VudGlsZShnKSksXG5cdFx0XHRcdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2Uoc2FuaXRpemUucGVyY2VudGlsZShiKSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIGFkanVzdC5jbGFtcFJHQihyZ2IpO1xuXHRcdH0sICdFcnJvciBjb252ZXJ0aW5nIENNWUsgdG8gUkdCJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBjb252ZXJ0SFNMKGNvbG9yOiBIU0wsIGNvbG9yU3BhY2U6IENvbG9yU3BhY2VFeHRlbmRlZCk6IENvbG9yIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlKGNvbG9yKSkge1xuXHRcdFx0XHRsb2cuaW5mbyhcblx0XHRcdFx0XHRgSW52YWxpZCBjb2xvciB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGNvbG9yKX0uIFJldHVybmluZyBkZWZhdWx0IEhTTC5gLFxuXHRcdFx0XHRcdGB1dGlscy5jb2xvci5jb252ZXJ0SFNMYFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0SFNMO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjbG9uZWRDb2xvciA9IGNsb25lKGNvbG9yKSBhcyBIU0w7XG5cblx0XHRcdHN3aXRjaCAoY29sb3JTcGFjZSkge1xuXHRcdFx0XHRjYXNlICdjbXlrJzpcblx0XHRcdFx0XHRyZXR1cm4gaHNsVG9DTVlLKGNsb25lZENvbG9yKTtcblx0XHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0XHRyZXR1cm4gaHNsVG9IZXgoY2xvbmVkQ29sb3IpO1xuXHRcdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRcdHJldHVybiBjbG9uZShjbG9uZWRDb2xvcik7XG5cdFx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdFx0cmV0dXJuIGhzbFRvSFNWKGNsb25lZENvbG9yKTtcblx0XHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0XHRyZXR1cm4gaHNsVG9MQUIoY2xvbmVkQ29sb3IpO1xuXHRcdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRcdHJldHVybiBoc2xUb1JHQihjbG9uZWRDb2xvcik7XG5cdFx0XHRcdGNhc2UgJ3NsJzpcblx0XHRcdFx0XHRyZXR1cm4gaHNsVG9TTChjbG9uZWRDb2xvcik7XG5cdFx0XHRcdGNhc2UgJ3N2Jzpcblx0XHRcdFx0XHRyZXR1cm4gaHNsVG9TVihjbG9uZWRDb2xvcik7XG5cdFx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdFx0cmV0dXJuIGhzbFRvWFlaKGNsb25lZENvbG9yKTtcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29sb3IgZm9ybWF0Jyk7XG5cdFx0XHR9XG5cdFx0fSwgJ0Vycm9yIGNvbnZlcnRpbmcgSFNMIHRvIGNvbG9yJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBjb252ZXJ0VG9IU0woY29sb3I6IEV4Y2x1ZGU8Q29sb3IsIFNMIHwgU1Y+KTogSFNMIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlKGNvbG9yKSkge1xuXHRcdFx0XHRsb2cuaW5mbyhcblx0XHRcdFx0XHRgSW52YWxpZCBjb2xvciB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGNvbG9yKX0uIFJldHVybmluZyBkZWZhdWx0IEhTTGAsXG5cdFx0XHRcdFx0YHV0aWxzLmNvbG9yLmNvbnZlcnRUb0hTTGBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdEhTTDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjbG9uZShjb2xvcik7XG5cblx0XHRcdHN3aXRjaCAoY29sb3IuZm9ybWF0KSB7XG5cdFx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRcdHJldHVybiBjbXlrVG9IU0woY2xvbmVkQ29sb3IgYXMgQ01ZSyk7XG5cdFx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdFx0cmV0dXJuIGhleFRvSFNMKGNsb25lZENvbG9yIGFzIEhleCk7XG5cdFx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdFx0cmV0dXJuIGNsb25lKGNsb25lZENvbG9yIGFzIEhTTCk7XG5cdFx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdFx0cmV0dXJuIGhzdlRvSFNMKGNsb25lZENvbG9yIGFzIEhTVik7XG5cdFx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdFx0cmV0dXJuIGxhYlRvSFNMKGNsb25lZENvbG9yIGFzIExBQik7XG5cdFx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdFx0cmV0dXJuIHJnYlRvSFNMKGNsb25lZENvbG9yIGFzIFJHQik7XG5cdFx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdFx0cmV0dXJuIHh5elRvSFNMKGNsb25lZENvbG9yIGFzIFhZWik7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvbG9yIGZvcm1hdCcpO1xuXHRcdFx0fVxuXHRcdH0sICdFcnJvciBjb252ZXJ0aW5nIGNvbG9yIHRvIEhTTCcpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGV4VG9IU0woaGV4OiBIZXgpOiBIU0wge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWUoaGV4KSkge1xuXHRcdFx0XHRsb2cuaW5mbyhcblx0XHRcdFx0XHRgSW52YWxpZCBIZXggdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoZXgpfS4gUmV0dXJuaW5nIGRlZmF1bHQgSFNMYCxcblx0XHRcdFx0XHRgdXRpbHMuY29sb3IuaGV4VG9IU0xgXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRIU0w7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZ2JUb0hTTChoZXhUb1JHQihjbG9uZShoZXgpKSk7XG5cdFx0fSwgJ0Vycm9yIGNvbnZlcnRpbmcgSGV4IHRvIEhTTCcpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGV4VG9IU0xXcmFwcGVyKGlucHV0OiBzdHJpbmcgfCBIZXgpOiBIU0wge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb25zdCBjbG9uZWRJbnB1dCA9IGNsb25lKGlucHV0KTtcblxuXHRcdFx0Y29uc3QgaGV4OiBIZXggPVxuXHRcdFx0XHR0eXBlb2YgY2xvbmVkSW5wdXQgPT09ICdzdHJpbmcnXG5cdFx0XHRcdFx0PyB7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldChjbG9uZWRJbnB1dClcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdDoge1xuXHRcdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoY2xvbmVkSW5wdXQudmFsdWUuaGV4KVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0cmV0dXJuIGhleFRvSFNMKGhleCk7XG5cdFx0fSwgJ0Vycm9yIGNvbnZlcnRpbmcgSGV4IHRvIEhTTCcpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGV4VG9SR0IoaGV4OiBIZXgpOiBSR0Ige1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWUoaGV4KSkge1xuXHRcdFx0XHRsb2cuaW5mbyhcblx0XHRcdFx0XHRgSW52YWxpZCBIZXggdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoZXgpfS4gUmV0dXJuaW5nIGRlZmF1bHQgUkdCYCxcblx0XHRcdFx0XHRgdXRpbHMuY29sb3IuaGV4VG9SR0JgXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRSR0I7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNsb25lZEhleCA9IGNsb25lKGhleCk7XG5cdFx0XHRjb25zdCBzdHJpcHBlZEhleCA9IGZvcm1hdC5zdHJpcEhhc2hGcm9tSGV4KGNsb25lZEhleCkudmFsdWUuaGV4O1xuXHRcdFx0Y29uc3QgYmlnaW50ID0gcGFyc2VJbnQoc3RyaXBwZWRIZXgsIDE2KTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0c2FuaXRpemUucGVyY2VudGlsZSgoYmlnaW50ID4+IDE2KSAmIDI1NSlcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZShcblx0XHRcdFx0XHRcdHNhbml0aXplLnBlcmNlbnRpbGUoKGJpZ2ludCA+PiA4KSAmIDI1NSlcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKHNhbml0aXplLnBlcmNlbnRpbGUoYmlnaW50ICYgMjU1KSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0fTtcblx0XHR9LCAnRXJyb3IgY29udmVydGluZyBIZXggdG8gUkdCJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBoc2xUb0NNWUsoaHNsOiBIU0wpOiBDTVlLIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlKGhzbCkpIHtcblx0XHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdFx0YEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX0uIFJldHVybmluZyBkZWZhdWx0IENNWUsuYCxcblx0XHRcdFx0XHRgdXRpbHMuY29sb3IuaHNsVG9DTVlLYFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0Q01ZSztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJnYlRvQ01ZSyhoc2xUb1JHQihjbG9uZShoc2wpKSk7XG5cdFx0fSwgJ0Vycm9yIGNvbnZlcnRpbmcgSFNMIHRvIENNWUsnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhzbFRvSGV4KGhzbDogSFNMKTogSGV4IHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlKGhzbCkpIHtcblx0XHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdFx0YEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX0uIFJldHVybmluZyBkZWZhdWx0IEhleGAsXG5cdFx0XHRcdFx0YHV0aWxzLmNvbG9yLmhzbFRvSGV4YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0SGV4O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmdiVG9IZXgoaHNsVG9SR0IoY2xvbmUoaHNsKSkpO1xuXHRcdH0sICdFcnJvciBjb252ZXJ0aW5nIEhTTCB0byBIZXgnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhzbFRvSFNWKGhzbDogSFNMKTogSFNWIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlKGhzbCkpIHtcblx0XHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdFx0YEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX0uIFJldHVybmluZyBkZWZhdWx0IEhTVmAsXG5cdFx0XHRcdFx0YHV0aWxzLmNvbG9yLmhzbFRvSFNWYFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0SFNWO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjbG9uZWRIU0wgPSBjbG9uZShoc2wpO1xuXHRcdFx0Y29uc3QgcyA9IGNsb25lZEhTTC52YWx1ZS5zYXR1cmF0aW9uIC8gMTAwO1xuXHRcdFx0Y29uc3QgbCA9IGNsb25lZEhTTC52YWx1ZS5saWdodG5lc3MgLyAxMDA7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IGwgKyBzICogTWF0aC5taW4obCwgMSAtIDEpO1xuXHRcdFx0Y29uc3QgbmV3U2F0dXJhdGlvbiA9IHZhbHVlID09PSAwID8gMCA6IDIgKiAoMSAtIGwgLyB2YWx1ZSk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChcblx0XHRcdFx0XHRcdHNhbml0aXplLnBlcmNlbnRpbGUoY2xvbmVkSFNMLnZhbHVlLmh1ZSlcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdHNhbml0aXplLnBlcmNlbnRpbGUobmV3U2F0dXJhdGlvbiAqIDEwMClcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdHZhbHVlOiBicmFuZC5hc1BlcmNlbnRpbGUoc2FuaXRpemUucGVyY2VudGlsZSh2YWx1ZSAqIDEwMCkpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdH07XG5cdFx0fSwgJ0Vycm9yIGNvbnZlcnRpbmcgSFNMIHRvIEhTVicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaHNsVG9MQUIoaHNsOiBIU0wpOiBMQUIge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWUoaHNsKSkge1xuXHRcdFx0XHRsb2cuaW5mbyhcblx0XHRcdFx0XHRgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfS4gUmV0dXJuaW5nIGRlZmF1bHQgTEFCYCxcblx0XHRcdFx0XHRgdXRpbHMuY29sb3IuaHNsVG9MQUJgXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRMQUI7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB4eXpUb0xBQihyZ2JUb1hZWihoc2xUb1JHQihjbG9uZShoc2wpKSkpO1xuXHRcdH0sICdFcnJvciBjb252ZXJ0aW5nIEhTTCB0byBMQUInKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhzbFRvUkdCKGhzbDogSFNMKTogUkdCIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlKGhzbCkpIHtcblx0XHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdFx0YEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX0uIFJldHVybmluZyBkZWZhdWx0IFJHQmAsXG5cdFx0XHRcdFx0YHV0aWxzLmNvbG9yLmhzbFRvUkdCYFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0UkdCO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjbG9uZWRIU0wgPSBjbG9uZShoc2wpO1xuXHRcdFx0Y29uc3QgaHVlID0gY2xvbmVkSFNMLnZhbHVlLmh1ZSAvIDM2MDtcblxuXHRcdFx0Y29uc3QgcyA9IGNsb25lZEhTTC52YWx1ZS5zYXR1cmF0aW9uIC8gMTAwO1xuXHRcdFx0Y29uc3QgbCA9IGNsb25lZEhTTC52YWx1ZS5saWdodG5lc3MgLyAxMDA7XG5cdFx0XHRjb25zdCBxID0gbCA8IDAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcztcblx0XHRcdGNvbnN0IHAgPSAyICogbCAtIHE7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZShcblx0XHRcdFx0XHRcdHNhbml0aXplLnBlcmNlbnRpbGUoaHVlVG9SR0IocCwgcSwgaHVlICsgMSAvIDMpICogMjU1KVxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0c2FuaXRpemUucGVyY2VudGlsZShodWVUb1JHQihwLCBxLCBodWUpICogMjU1KVxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2UoXG5cdFx0XHRcdFx0XHRzYW5pdGl6ZS5wZXJjZW50aWxlKGh1ZVRvUkdCKHAsIHEsIGh1ZSAtIDEgLyAzKSAqIDI1NSlcblx0XHRcdFx0XHQpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdH07XG5cdFx0fSwgJ0Vycm9yIGNvbnZlcnRpbmcgSFNMIHRvIFJHQicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaHNsVG9TTChoc2w6IEhTTCk6IFNMIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlKGhzbCkpIHtcblx0XHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdFx0YEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX0uIFJldHVybmluZyBkZWZhdWx0IFNMYCxcblx0XHRcdFx0XHRgdXRpbHMuY29sb3IuaHNsVG9TTGBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdFNMO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNhdHVyYXRpb246IGhzbC52YWx1ZS5zYXR1cmF0aW9uLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogaHNsLnZhbHVlLmxpZ2h0bmVzc1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzbCcgYXMgJ3NsJ1xuXHRcdFx0fTtcblx0XHR9LCAnRXJyb3IgY29udmVydGluZyBIU0wgdG8gU0wnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhzbFRvU1YoaHNsOiBIU0wpOiBTViB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZShoc2wpKSB7XG5cdFx0XHRcdGxvZy5pbmZvKFxuXHRcdFx0XHRcdGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9LiBSZXR1cm5pbmcgZGVmYXVsdCBTVmAsXG5cdFx0XHRcdFx0YHV0aWxzLmNvbG9yLmhzbFRvU1ZgXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRTVjtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGhzdlRvU1YocmdiVG9IU1YoaHNsVG9SR0IoY2xvbmUoaHNsKSkpKTtcblx0XHR9LCAnRXJyb3IgY29udmVydGluZyBIU0wgdG8gU1YnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhzbFRvWFlaKGhzbDogSFNMKTogWFlaIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlKGhzbCkpIHtcblx0XHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdFx0YEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX0uIFJldHVybmluZyBkZWZhdWx0IEhTTC5gLFxuXHRcdFx0XHRcdGB1dGlscy5jb2xvci5oc2xUb1hZWmBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdFhZWjtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGxhYlRvWFlaKGhzbFRvTEFCKGNsb25lKGhzbCkpKTtcblx0XHR9LCAnRXJyb3IgY29udmVydGluZyBIU0wgdG8gWFlaJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBoc3ZUb0hTTChoc3Y6IEhTVik6IEhTTCB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZShoc3YpKSB7XG5cdFx0XHRcdGxvZy5pbmZvKFxuXHRcdFx0XHRcdGBJbnZhbGlkIEhTViB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzdil9LiBSZXR1cm5pbmcgZGVmYXVsdCBIU0xgLFxuXHRcdFx0XHRcdGB1dGlscy5jb2xvci5oc3ZUb0hTTGBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdEhTTDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY2xvbmVkSFNWID0gY2xvbmUoaHN2KTtcblxuXHRcdFx0Y29uc3QgcyA9IGNsb25lZEhTVi52YWx1ZS5zYXR1cmF0aW9uIC8gMTAwO1xuXHRcdFx0Y29uc3QgdiA9IGNsb25lZEhTVi52YWx1ZS52YWx1ZSAvIDEwMDtcblx0XHRcdGNvbnN0IGwgPSB2ICogKDEgLSBzIC8gMik7XG5cblx0XHRcdGNvbnN0IG5ld1NhdHVyYXRpb24gPVxuXHRcdFx0XHRsID09PSAwIHx8IGwgPT09IDEgPyAwIDogKHYgLSBsKSAvIE1hdGgubWluKGwsIDEgLSBsKTtcblx0XHRcdGNvbnN0IGxpZ2h0bmVzcyA9XG5cdFx0XHRcdGNsb25lZEhTVi52YWx1ZS52YWx1ZSAqICgxIC0gY2xvbmVkSFNWLnZhbHVlLnNhdHVyYXRpb24gLyAyMDApO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoXG5cdFx0XHRcdFx0XHRzYW5pdGl6ZS5wZXJjZW50aWxlKGNsb25lZEhTVi52YWx1ZS5odWUpXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRzYW5pdGl6ZS5wZXJjZW50aWxlKG5ld1NhdHVyYXRpb24gKiAxMDApXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdHNhbml0aXplLnBlcmNlbnRpbGUobGlnaHRuZXNzKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fTtcblx0XHR9LCAnRXJyb3IgY29udmVydGluZyBIU1YgdG8gSFNMJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBoc3ZUb1NWKGhzdjogSFNWKTogU1Yge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWUoaHN2KSkge1xuXHRcdFx0XHRsb2cuaW5mbyhcblx0XHRcdFx0XHRgSW52YWxpZCBIU1YgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc3YpfS4gUmV0dXJuaW5nIGRlZmF1bHQgU1ZgLFxuXHRcdFx0XHRcdGB1dGlscy5jb2xvci5oc3ZUb1NWYFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0U1Y7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogaHN2LnZhbHVlLnNhdHVyYXRpb24sXG5cdFx0XHRcdFx0dmFsdWU6IGhzdi52YWx1ZS52YWx1ZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzdicgYXMgJ3N2J1xuXHRcdFx0fTtcblx0XHR9LCAnRXJyb3IgY29udmVydGluZyBIU1YgdG8gU1YnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGxhYlRvSFNMKGxhYjogTEFCKTogSFNMIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlKGxhYikpIHtcblx0XHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdFx0YEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX0uIFJldHVybmluZyBkZWZhdWx0IEhTTC5gLFxuXHRcdFx0XHRcdGB1dGlscy5jb2xvci5sYWJUb0hTTGBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdEhTTDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJnYlRvSFNMKGxhYlRvUkdCKGNsb25lKGxhYikpKTtcblx0XHR9LCAnRXJyb3IgY29udmVydGluZyBMQUIgdG8gSFNMJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBsYWJUb1JHQihsYWI6IExBQik6IFJHQiB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZShsYWIpKSB7XG5cdFx0XHRcdGxvZy5pbmZvKFxuXHRcdFx0XHRcdGBJbnZhbGlkIExBQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGxhYil9LiAuIFJldHVybmluZyBkZWZhdWx0IFJHQi5gLFxuXHRcdFx0XHRcdGB1dGlscy5jb2xvci5sYWJUb1JHQmBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdFJHQjtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHh5elRvUkdCKGxhYlRvWFlaKGNsb25lKGxhYikpKTtcblx0XHR9LCAnRXJyb3IgY29udmVydGluZyBMQUIgdG8gUkdCJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBsYWJUb1hZWihsYWI6IExBQik6IFhZWiB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZShsYWIpKSB7XG5cdFx0XHRcdGxvZy5pbmZvKFxuXHRcdFx0XHRcdGBJbnZhbGlkIExBQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGxhYil9LiBSZXR1cm5pbmcgZGVmYXVsdCBYWVouYCxcblx0XHRcdFx0XHRgdXRpbHMuY29sb3IubGFiVG9YWVpgXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRYWVo7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNsb25lZExBQiA9IGNsb25lKGxhYik7XG5cdFx0XHRjb25zdCByZWZYID0gOTUuMDQ3LFxuXHRcdFx0XHRyZWZZID0gMTAwLjAsXG5cdFx0XHRcdHJlZlogPSAxMDguODgzO1xuXG5cdFx0XHRsZXQgeSA9IChjbG9uZWRMQUIudmFsdWUubCArIDE2KSAvIDExNjtcblx0XHRcdGxldCB4ID0gY2xvbmVkTEFCLnZhbHVlLmEgLyA1MDAgKyB5O1xuXHRcdFx0bGV0IHogPSB5IC0gY2xvbmVkTEFCLnZhbHVlLmIgLyAyMDA7XG5cblx0XHRcdGNvbnN0IHBvdyA9IE1hdGgucG93O1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHg6IGJyYW5kLmFzWFlaX1goXG5cdFx0XHRcdFx0XHRzYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRyZWZYICpcblx0XHRcdFx0XHRcdFx0XHQocG93KHgsIDMpID4gMC4wMDg4NTZcblx0XHRcdFx0XHRcdFx0XHRcdD8gcG93KHgsIDMpXG5cdFx0XHRcdFx0XHRcdFx0XHQ6ICh4IC0gMTYgLyAxMTYpIC8gNy43ODcpXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0XHR5OiBicmFuZC5hc1hZWl9ZKFxuXHRcdFx0XHRcdFx0c2FuaXRpemUucGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0cmVmWSAqXG5cdFx0XHRcdFx0XHRcdFx0KHBvdyh5LCAzKSA+IDAuMDA4ODU2XG5cdFx0XHRcdFx0XHRcdFx0XHQ/IHBvdyh5LCAzKVxuXHRcdFx0XHRcdFx0XHRcdFx0OiAoeSAtIDE2IC8gMTE2KSAvIDcuNzg3KVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0ejogYnJhbmQuYXNYWVpfWihcblx0XHRcdFx0XHRcdHNhbml0aXplLnBlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdHJlZlogKlxuXHRcdFx0XHRcdFx0XHRcdChwb3coeiwgMykgPiAwLjAwODg1NlxuXHRcdFx0XHRcdFx0XHRcdFx0PyBwb3coeiwgMylcblx0XHRcdFx0XHRcdFx0XHRcdDogKHogLSAxNiAvIDExNikgLyA3Ljc4Nylcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHRcdH07XG5cdFx0fSwgJ0Vycm9yIGNvbnZlcnRpbmcgTEFCIHRvIFhZWicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmdiVG9DTVlLKHJnYjogUkdCKTogQ01ZSyB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZShyZ2IpKSB7XG5cdFx0XHRcdGxvZy5pbmZvKFxuXHRcdFx0XHRcdGBJbnZhbGlkIFJHQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHJnYil9Li4gUmV0dXJuaW5nIGRlZmF1bHQgQ01ZS2AsXG5cdFx0XHRcdFx0YHV0aWxzLmNvbG9yLnJnYlRvQ01ZS2Bcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdENNWUs7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNsb25lZFJHQiA9IGNsb25lKHJnYik7XG5cblx0XHRcdGNvbnN0IHJlZFByaW1lID0gY2xvbmVkUkdCLnZhbHVlLnJlZCAvIDI1NTtcblx0XHRcdGNvbnN0IGdyZWVuUHJpbWUgPSBjbG9uZWRSR0IudmFsdWUuZ3JlZW4gLyAyNTU7XG5cdFx0XHRjb25zdCBibHVlUHJpbWUgPSBjbG9uZWRSR0IudmFsdWUuYmx1ZSAvIDI1NTtcblxuXHRcdFx0Y29uc3Qga2V5ID0gc2FuaXRpemUucGVyY2VudGlsZShcblx0XHRcdFx0c2FuaXRpemUucGVyY2VudGlsZShcblx0XHRcdFx0XHQxIC0gTWF0aC5tYXgocmVkUHJpbWUsIGdyZWVuUHJpbWUsIGJsdWVQcmltZSlcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IGN5YW4gPSBzYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0XHRzYW5pdGl6ZS5wZXJjZW50aWxlKCgxIC0gcmVkUHJpbWUgLSBrZXkpIC8gKDEgLSBrZXkpIHx8IDApXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgbWFnZW50YSA9IHNhbml0aXplLnBlcmNlbnRpbGUoXG5cdFx0XHRcdHNhbml0aXplLnBlcmNlbnRpbGUoKDEgLSBncmVlblByaW1lIC0ga2V5KSAvICgxIC0ga2V5KSB8fCAwKVxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IHllbGxvdyA9IHNhbml0aXplLnBlcmNlbnRpbGUoXG5cdFx0XHRcdHNhbml0aXplLnBlcmNlbnRpbGUoKDEgLSBibHVlUHJpbWUgLSBrZXkpIC8gKDEgLSBrZXkpIHx8IDApXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgZm9ybWF0OiAnY215aycgPSAnY215ayc7XG5cblx0XHRcdGNvbnN0IGNteWsgPSB7IHZhbHVlOiB7IGN5YW4sIG1hZ2VudGEsIHllbGxvdywga2V5IH0sIGZvcm1hdCB9O1xuXG5cdFx0XHRsb2cuaW5mbyhcblx0XHRcdFx0YENvbnZlcnRlZCBSR0IgJHtKU09OLnN0cmluZ2lmeShjbG9uZWRSR0IpfSB0byBDTVlLOiAke0pTT04uc3RyaW5naWZ5KGNsb25lKGNteWspKX1gLFxuXHRcdFx0XHRgdXRpbHMuY29sb3IucmdiVG9DTVlLYFxuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGNteWs7XG5cdFx0fSwgJ0Vycm9yIGNvbnZlcnRpbmcgUkdCIHRvIENNWUsnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJnYlRvSGV4KHJnYjogUkdCKTogSGV4IHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlKHJnYikpIHtcblx0XHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdFx0YEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX0uIC4gUmV0dXJuaW5nIGRlZmF1bHQgSGV4LmAsXG5cdFx0XHRcdFx0YHV0aWxzLmNvbG9yLnJnYlRvSGV4YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0SGV4O1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjbG9uZWRSR0IgPSBjbG9uZShyZ2IpO1xuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdFtcblx0XHRcdFx0XHRjbG9uZWRSR0IudmFsdWUucmVkLFxuXHRcdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5ncmVlbixcblx0XHRcdFx0XHRjbG9uZWRSR0IudmFsdWUuYmx1ZVxuXHRcdFx0XHRdLnNvbWUodiA9PiBpc05hTih2KSB8fCB2IDwgMCB8fCB2ID4gMjU1KVxuXHRcdFx0KSB7XG5cdFx0XHRcdGxvZy5pbmZvKFxuXHRcdFx0XHRcdGBJbnZhbGlkIFJHQiB2YWx1ZXM6XFxuUj0ke0pTT04uc3RyaW5naWZ5KGNsb25lZFJHQi52YWx1ZS5yZWQpfVxcbkc9JHtKU09OLnN0cmluZ2lmeShjbG9uZWRSR0IudmFsdWUuZ3JlZW4pfVxcbkI9JHtKU09OLnN0cmluZ2lmeShjbG9uZWRSR0IudmFsdWUuYmx1ZSl9XFxuUmV0dXJuaW5nIGRlZmF1bHQgSGV4LmAsXG5cdFx0XHRcdFx0YHV0aWxzLmNvbG9yLnJnYlRvSGV4YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0SGV4O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoXG5cdFx0XHRcdFx0XHRgIyR7Zm9ybWF0LmNvbXBvbmVudFRvSGV4KGNsb25lZFJHQi52YWx1ZS5yZWQpfSR7Zm9ybWF0LmNvbXBvbmVudFRvSGV4KGNsb25lZFJHQi52YWx1ZS5ncmVlbil9JHtmb3JtYXQuY29tcG9uZW50VG9IZXgoY2xvbmVkUkdCLnZhbHVlLmJsdWUpfWBcblx0XHRcdFx0XHQpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hleCcgYXMgJ2hleCdcblx0XHRcdH07XG5cdFx0fSwgJ0Vycm9yIGNvbnZlcnRpbmcgUkdCIHRvIEhleCcpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmdiVG9IU0wocmdiOiBSR0IpOiBIU0wge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWUocmdiKSkge1xuXHRcdFx0XHRsb2cuaW5mbyhcblx0XHRcdFx0XHRgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfS4gUmV0dXJuaW5nIGRlZmF1bHQgSFNMLmAsXG5cdFx0XHRcdFx0YHV0aWxzLmNvbG9yLnJnYlRvSFNMYFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0SFNMO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjbG9uZWRSR0IgPSBjbG9uZShyZ2IpO1xuXG5cdFx0XHRjb25zdCByZWQgPSAoY2xvbmVkUkdCLnZhbHVlLnJlZCBhcyB1bmtub3duIGFzIG51bWJlcikgLyAyNTU7XG5cdFx0XHRjb25zdCBncmVlbiA9IChjbG9uZWRSR0IudmFsdWUuZ3JlZW4gYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMjU1O1xuXHRcdFx0Y29uc3QgYmx1ZSA9IChjbG9uZWRSR0IudmFsdWUuYmx1ZSBhcyB1bmtub3duIGFzIG51bWJlcikgLyAyNTU7XG5cblx0XHRcdGNvbnN0IG1heCA9IE1hdGgubWF4KHJlZCwgZ3JlZW4sIGJsdWUpO1xuXHRcdFx0Y29uc3QgbWluID0gTWF0aC5taW4ocmVkLCBncmVlbiwgYmx1ZSk7XG5cblx0XHRcdGxldCBodWUgPSAwLFxuXHRcdFx0XHRzYXR1cmF0aW9uID0gMCxcblx0XHRcdFx0bGlnaHRuZXNzID0gKG1heCArIG1pbikgLyAyO1xuXG5cdFx0XHRpZiAobWF4ICE9PSBtaW4pIHtcblx0XHRcdFx0Y29uc3QgZGVsdGEgPSBtYXggLSBtaW47XG5cblx0XHRcdFx0c2F0dXJhdGlvbiA9XG5cdFx0XHRcdFx0bGlnaHRuZXNzID4gMC41XG5cdFx0XHRcdFx0XHQ/IGRlbHRhIC8gKDIgLSBtYXggLSBtaW4pXG5cdFx0XHRcdFx0XHQ6IGRlbHRhIC8gKG1heCArIG1pbik7XG5cblx0XHRcdFx0c3dpdGNoIChtYXgpIHtcblx0XHRcdFx0XHRjYXNlIHJlZDpcblx0XHRcdFx0XHRcdGh1ZSA9IChncmVlbiAtIGJsdWUpIC8gZGVsdGEgKyAoZ3JlZW4gPCBibHVlID8gNiA6IDApO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBncmVlbjpcblx0XHRcdFx0XHRcdGh1ZSA9IChibHVlIC0gcmVkKSAvIGRlbHRhICsgMjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgYmx1ZTpcblx0XHRcdFx0XHRcdGh1ZSA9IChyZWQgLSBncmVlbikgLyBkZWx0YSArIDQ7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRodWUgKj0gNjA7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChzYW5pdGl6ZS5wZXJjZW50aWxlKGh1ZSkpLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdHNhbml0aXplLnBlcmNlbnRpbGUoc2F0dXJhdGlvbiAqIDEwMClcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0c2FuaXRpemUucGVyY2VudGlsZShsaWdodG5lc3MgKiAxMDApXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9O1xuXHRcdH0sICdFcnJvciBjb252ZXJ0aW5nIFJHQiB0byBIU0wnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJnYlRvSFNWKHJnYjogUkdCKTogSFNWIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlKHJnYikpIHtcblx0XHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdFx0YEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX0uIFJldHVybmluZyBkZWZhdWx0IEhTVi5gLFxuXHRcdFx0XHRcdGB1dGlscy5jb2xvci5yZ2JUb0hTVmBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdEhTVjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcmVkID0gKHJnYi52YWx1ZS5yZWQgYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMjU1O1xuXHRcdFx0Y29uc3QgZ3JlZW4gPSAocmdiLnZhbHVlLmdyZWVuIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblx0XHRcdGNvbnN0IGJsdWUgPSAocmdiLnZhbHVlLmJsdWUgYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMjU1O1xuXG5cdFx0XHRjb25zdCBtYXggPSBNYXRoLm1heChyZWQsIGdyZWVuLCBibHVlKTtcblx0XHRcdGNvbnN0IG1pbiA9IE1hdGgubWluKHJlZCwgZ3JlZW4sIGJsdWUpO1xuXHRcdFx0Y29uc3QgZGVsdGEgPSBtYXggLSBtaW47XG5cblx0XHRcdGxldCBodWUgPSAwO1xuXG5cdFx0XHRjb25zdCB2YWx1ZSA9IG1heDtcblx0XHRcdGNvbnN0IHNhdHVyYXRpb24gPSBtYXggPT09IDAgPyAwIDogZGVsdGEgLyBtYXg7XG5cblx0XHRcdGlmIChtYXggIT09IG1pbikge1xuXHRcdFx0XHRzd2l0Y2ggKG1heCkge1xuXHRcdFx0XHRcdGNhc2UgcmVkOlxuXHRcdFx0XHRcdFx0aHVlID0gKGdyZWVuIC0gYmx1ZSkgLyBkZWx0YSArIChncmVlbiA8IGJsdWUgPyA2IDogMCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIGdyZWVuOlxuXHRcdFx0XHRcdFx0aHVlID0gKGJsdWUgLSByZWQpIC8gZGVsdGEgKyAyO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBibHVlOlxuXHRcdFx0XHRcdFx0aHVlID0gKHJlZCAtIGdyZWVuKSAvIGRlbHRhICsgNDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aHVlICo9IDYwO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoc2FuaXRpemUucGVyY2VudGlsZShodWUpKSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRzYW5pdGl6ZS5wZXJjZW50aWxlKHNhdHVyYXRpb24gKiAxMDApXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKHNhbml0aXplLnBlcmNlbnRpbGUodmFsdWUgKiAxMDApKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHR9O1xuXHRcdH0sICdFcnJvciBjb252ZXJ0aW5nIFJHQiB0byBIU1YnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJnYlRvWFlaKHJnYjogUkdCKTogWFlaIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlKHJnYikpIHtcblx0XHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdFx0YEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX0uIFJldHVybmluZyBkZWZhdWx0IFhZWmAsXG5cdFx0XHRcdFx0YHV0aWxzLmNvbG9yLnJnYlRvWFlaYFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0WFlaO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBjb252ZXJ0IFJHQiB2YWx1ZXMgdG8gbGluZWFyIHNwYWNlXG5cdFx0XHRjb25zdCByZWQgPSAocmdiLnZhbHVlLnJlZCBhcyBudW1iZXIpIC8gMjU1O1xuXHRcdFx0Y29uc3QgZ3JlZW4gPSAocmdiLnZhbHVlLmdyZWVuIGFzIG51bWJlcikgLyAyNTU7XG5cdFx0XHRjb25zdCBibHVlID0gKHJnYi52YWx1ZS5ibHVlIGFzIG51bWJlcikgLyAyNTU7XG5cblx0XHRcdGNvbnN0IGxpbmVhclJlZCA9XG5cdFx0XHRcdHJlZCA+IDAuMDQwNDVcblx0XHRcdFx0XHQ/IE1hdGgucG93KChyZWQgKyAwLjA1NSkgLyAxLjA1NSwgMi40KVxuXHRcdFx0XHRcdDogcmVkIC8gMTIuOTI7XG5cdFx0XHRjb25zdCBsaW5lYXJHcmVlbiA9XG5cdFx0XHRcdGdyZWVuID4gMC4wNDA0NVxuXHRcdFx0XHRcdD8gTWF0aC5wb3coKGdyZWVuICsgMC4wNTUpIC8gMS4wNTUsIDIuNClcblx0XHRcdFx0XHQ6IGdyZWVuIC8gMTIuOTI7XG5cdFx0XHRjb25zdCBsaW5lYXJCbHVlID1cblx0XHRcdFx0Ymx1ZSA+IDAuMDQwNDVcblx0XHRcdFx0XHQ/IE1hdGgucG93KChibHVlICsgMC4wNTUpIC8gMS4wNTUsIDIuNClcblx0XHRcdFx0XHQ6IGJsdWUgLyAxMi45MjtcblxuXHRcdFx0Ly8gc2NhbGUgdG8gMTAwXG5cdFx0XHRjb25zdCBzY2FsZWRSZWQgPSBsaW5lYXJSZWQgKiAxMDA7XG5cdFx0XHRjb25zdCBzY2FsZWRHcmVlbiA9IGxpbmVhckdyZWVuICogMTAwO1xuXHRcdFx0Y29uc3Qgc2NhbGVkQmx1ZSA9IGxpbmVhckJsdWUgKiAxMDA7XG5cblx0XHRcdGNvbnN0IHggPSBicmFuZC5hc1hZWl9YKFxuXHRcdFx0XHRhZGp1c3QuY2xhbXBYWVooXG5cdFx0XHRcdFx0c2NhbGVkUmVkICogMC40MTI0ICtcblx0XHRcdFx0XHRcdHNjYWxlZEdyZWVuICogMC4zNTc2ICtcblx0XHRcdFx0XHRcdHNjYWxlZEJsdWUgKiAwLjE4MDUsXG5cdFx0XHRcdFx0bWF0aC5tYXhYWVpfWFxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgeSA9IGJyYW5kLmFzWFlaX1koXG5cdFx0XHRcdGFkanVzdC5jbGFtcFhZWihcblx0XHRcdFx0XHRzY2FsZWRSZWQgKiAwLjIxMjYgK1xuXHRcdFx0XHRcdFx0c2NhbGVkR3JlZW4gKiAwLjcxNTIgK1xuXHRcdFx0XHRcdFx0c2NhbGVkQmx1ZSAqIDAuMDcyMixcblx0XHRcdFx0XHRtYXRoLm1heFhZWl9ZXG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0XHRjb25zdCB6ID0gYnJhbmQuYXNYWVpfWihcblx0XHRcdFx0YWRqdXN0LmNsYW1wWFlaKFxuXHRcdFx0XHRcdHNjYWxlZFJlZCAqIDAuMDE5MyArXG5cdFx0XHRcdFx0XHRzY2FsZWRHcmVlbiAqIDAuMTE5MiArXG5cdFx0XHRcdFx0XHRzY2FsZWRCbHVlICogMC45NTA1LFxuXHRcdFx0XHRcdG1hdGgubWF4WFlaX1pcblx0XHRcdFx0KVxuXHRcdFx0KTtcblxuXHRcdFx0Y29uc3QgeHl6OiBYWVogPSB7IHZhbHVlOiB7IHgsIHksIHogfSwgZm9ybWF0OiAneHl6JyB9O1xuXG5cdFx0XHRyZXR1cm4gdmFsaWRhdGUuY29sb3JWYWx1ZSh4eXopID8geHl6IDogZGVmYXVsdFhZWjtcblx0XHR9LCAnRXJyb3IgY29udmVydGluZyBSR0IgdG8gWFlaJyk7XG5cdH1cblxuXHRmdW5jdGlvbiB4eXpUb0hTTCh4eXo6IFhZWik6IEhTTCB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGlmICghdmFsaWRhdGUuY29sb3JWYWx1ZSh4eXopKSB7XG5cdFx0XHRcdGxvZy5pbmZvKFxuXHRcdFx0XHRcdGBJbnZhbGlkIFhZWiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHh5eil9LiBSZXR1cm5pbmcgZGVmYXVsdCBIU0wuYCxcblx0XHRcdFx0XHRgdXRpbHMuY29sb3IueHl6VG9IU0xgXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRIU0w7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZ2JUb0hTTCh4eXpUb1JHQihjbG9uZSh4eXopKSk7XG5cdFx0fSwgJ0Vycm9yIGNvbnZlcnRpbmcgWFlaIHRvIEhTTCcpO1xuXHR9XG5cblx0ZnVuY3Rpb24geHl6VG9MQUIoeHl6OiBYWVopOiBMQUIge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWUoeHl6KSkge1xuXHRcdFx0XHRsb2cuaW5mbyhcblx0XHRcdFx0XHRgSW52YWxpZCBYWVogdmFsdWUgJHtKU09OLnN0cmluZ2lmeSh4eXopfS4gUmV0dXJuaW5nIGRlZmF1bHQgTEFCLmAsXG5cdFx0XHRcdFx0YHV0aWxzLmNvbG9yLnh5elRvTEFCYFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0TEFCO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjbG9uZWRYWVogPSBjbG9uZSh4eXopO1xuXHRcdFx0Y29uc3QgcmVmWCA9IG1hdGgubWF4WFlaX1gsXG5cdFx0XHRcdHJlZlkgPSBtYXRoLm1heFhZWl9ZLFxuXHRcdFx0XHRyZWZaID0gbWF0aC5tYXhYWVpfWjtcblxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnggPSBhZGp1c3Qubm9ybWFsaXplWFlaKFxuXHRcdFx0XHRjbG9uZWRYWVoudmFsdWUueCxcblx0XHRcdFx0cmVmWFxuXHRcdFx0KSBhcyBYWVpfWDtcblx0XHRcdGNsb25lZFhZWi52YWx1ZS55ID0gYWRqdXN0Lm5vcm1hbGl6ZVhZWihcblx0XHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnksXG5cdFx0XHRcdHJlZllcblx0XHRcdCkgYXMgWFlaX1k7XG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueiA9IGFkanVzdC5ub3JtYWxpemVYWVooXG5cdFx0XHRcdGNsb25lZFhZWi52YWx1ZS56LFxuXHRcdFx0XHRyZWZaXG5cdFx0XHQpIGFzIFhZWl9aO1xuXG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueCA9XG5cdFx0XHRcdGNsb25lZFhZWi52YWx1ZS54ID4gMC4wMDg4NTZcblx0XHRcdFx0XHQ/IChNYXRoLnBvdyhjbG9uZWRYWVoudmFsdWUueCwgMSAvIDMpIGFzIFhZWl9YKVxuXHRcdFx0XHRcdDogKCg3Ljc4NyAqIGNsb25lZFhZWi52YWx1ZS54ICsgMTYgLyAxMTYpIGFzIFhZWl9YKTtcblx0XHRcdGNsb25lZFhZWi52YWx1ZS55ID1cblx0XHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnkgPiAwLjAwODg1NlxuXHRcdFx0XHRcdD8gKE1hdGgucG93KGNsb25lZFhZWi52YWx1ZS55LCAxIC8gMykgYXMgWFlaX1kpXG5cdFx0XHRcdFx0OiAoKDcuNzg3ICogY2xvbmVkWFlaLnZhbHVlLnkgKyAxNiAvIDExNikgYXMgWFlaX1kpO1xuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnogPVxuXHRcdFx0XHRjbG9uZWRYWVoudmFsdWUueiA+IDAuMDA4ODU2XG5cdFx0XHRcdFx0PyAoTWF0aC5wb3coY2xvbmVkWFlaLnZhbHVlLnosIDEgLyAzKSBhcyBYWVpfWilcblx0XHRcdFx0XHQ6ICgoNy43ODcgKiBjbG9uZWRYWVoudmFsdWUueiArIDE2IC8gMTE2KSBhcyBYWVpfWik7XG5cblx0XHRcdGNvbnN0IGwgPSBzYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0XHRwYXJzZUZsb2F0KCgxMTYgKiBjbG9uZWRYWVoudmFsdWUueSAtIDE2KS50b0ZpeGVkKDIpKVxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IGEgPSBzYW5pdGl6ZS5sYWIoXG5cdFx0XHRcdHBhcnNlRmxvYXQoXG5cdFx0XHRcdFx0KDUwMCAqIChjbG9uZWRYWVoudmFsdWUueCAtIGNsb25lZFhZWi52YWx1ZS55KSkudG9GaXhlZCgyKVxuXHRcdFx0XHQpLFxuXHRcdFx0XHQnYSdcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBiID0gc2FuaXRpemUubGFiKFxuXHRcdFx0XHRwYXJzZUZsb2F0KFxuXHRcdFx0XHRcdCgyMDAgKiAoY2xvbmVkWFlaLnZhbHVlLnkgLSBjbG9uZWRYWVoudmFsdWUueikpLnRvRml4ZWQoMilcblx0XHRcdFx0KSxcblx0XHRcdFx0J2InXG5cdFx0XHQpO1xuXG5cdFx0XHRjb25zdCBsYWI6IExBQiA9IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRsOiBicmFuZC5hc0xBQl9MKHNhbml0aXplLnBlcmNlbnRpbGUobCkpLFxuXHRcdFx0XHRcdGE6IGJyYW5kLmFzTEFCX0Eoc2FuaXRpemUucGVyY2VudGlsZShhKSksXG5cdFx0XHRcdFx0YjogYnJhbmQuYXNMQUJfQihzYW5pdGl6ZS5wZXJjZW50aWxlKGIpKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIXZhbGlkYXRlLmNvbG9yVmFsdWUobGFiKSkge1xuXHRcdFx0XHRsb2cuaW5mbyhcblx0XHRcdFx0XHRgSW52YWxpZCBMQUIgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShsYWIpfS4gUmV0dXJuaW5nIGRlZmF1bHQgTEFCLmAsXG5cdFx0XHRcdFx0YHV0aWxzLmNvbG9yLnh5elRvTEFCYFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0TEFCO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbGFiO1xuXHRcdH0sICdFcnJvciBjb252ZXJ0aW5nIFhZWiB0byBMQUInKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHh5elRvUkdCKHh5ejogWFlaKTogUkdCIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKCF2YWxpZGF0ZS5jb2xvclZhbHVlKHh5eikpIHtcblx0XHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdFx0YEludmFsaWQgWFlaIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoeHl6KX0uIFJldHVybmluZyBkZWZhdWx0IFJHQi5gLFxuXHRcdFx0XHRcdGB1dGlscy5jb2xvci54eXpUb1JHQmBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdFJHQjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgeCA9ICh4eXoudmFsdWUueCBhcyB1bmtub3duIGFzIG51bWJlcikgLyAxMDA7XG5cdFx0XHRjb25zdCB5ID0gKHh5ei52YWx1ZS55IGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDEwMDtcblx0XHRcdGNvbnN0IHogPSAoeHl6LnZhbHVlLnogYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMTAwO1xuXG5cdFx0XHRsZXQgcmVkID0geCAqIDMuMjQwNiArIHkgKiAtMS41MzcyICsgeiAqIC0wLjQ5ODY7XG5cdFx0XHRsZXQgZ3JlZW4gPSB4ICogLTAuOTY4OSArIHkgKiAxLjg3NTggKyB6ICogMC4wNDE1O1xuXHRcdFx0bGV0IGJsdWUgPSB4ICogMC4wNTU3ICsgeSAqIC0wLjIwNCArIHogKiAxLjA1NztcblxuXHRcdFx0cmVkID0gYWRqdXN0LmFwcGx5R2FtbWFDb3JyZWN0aW9uKHJlZCk7XG5cdFx0XHRncmVlbiA9IGFkanVzdC5hcHBseUdhbW1hQ29ycmVjdGlvbihncmVlbik7XG5cdFx0XHRibHVlID0gYWRqdXN0LmFwcGx5R2FtbWFDb3JyZWN0aW9uKGJsdWUpO1xuXG5cdFx0XHRjb25zdCByZ2I6IFJHQiA9IGFkanVzdC5jbGFtcFJHQih7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZShzYW5pdGl6ZS5wZXJjZW50aWxlKHJlZCkpLFxuXHRcdFx0XHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZShzYW5pdGl6ZS5wZXJjZW50aWxlKGdyZWVuKSksXG5cdFx0XHRcdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2Uoc2FuaXRpemUucGVyY2VudGlsZShibHVlKSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiByZ2I7XG5cdFx0fSwgJ0Vycm9yIGNvbnZlcnRpbmcgWFlaIHRvIFJHQicpO1xuXHR9XG5cblx0Y29uc3QgY29sb3JDb252ZXJzaW9uVXRpbGl0aWVzOiBDb2xvckNvbnZlcnNpb25VdGlsaXRpZXMgPSB7XG5cdFx0Y215a1RvSFNMLFxuXHRcdGNteWtUb1JHQixcblx0XHRjb252ZXJ0SFNMLFxuXHRcdGNvbnZlcnRUb0hTTCxcblx0XHRoZXhUb0hTTCxcblx0XHRoZXhUb0hTTFdyYXBwZXIsXG5cdFx0aGV4VG9SR0IsXG5cdFx0aHNsVG9DTVlLLFxuXHRcdGhzbFRvSGV4LFxuXHRcdGhzbFRvSFNWLFxuXHRcdGhzbFRvTEFCLFxuXHRcdGhzbFRvUkdCLFxuXHRcdGhzbFRvU0wsXG5cdFx0aHNsVG9TVixcblx0XHRoc2xUb1hZWixcblx0XHRoc3ZUb0hTTCxcblx0XHRoc3ZUb1NWLFxuXHRcdGxhYlRvSFNMLFxuXHRcdGxhYlRvUkdCLFxuXHRcdGxhYlRvWFlaLFxuXHRcdHJnYlRvQ01ZSyxcblx0XHRyZ2JUb0hleCxcblx0XHRyZ2JUb0hTTCxcblx0XHRyZ2JUb0hTVixcblx0XHRyZ2JUb1hZWixcblx0XHR4eXpUb0hTTCxcblx0XHR4eXpUb0xBQixcblx0XHR4eXpUb1JHQlxuXHR9O1xuXG5cdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0cmV0dXJuIGNvbG9yQ29udmVyc2lvblV0aWxpdGllcztcblx0fSwgJ0Vycm9yIGNyZWF0aW5nIGNvbG9yIGNvbnZlcnNpb24gdXRpbGl0aWVzIHN1Yi1ncm91cC4nKTtcbn1cbiJdfQ==