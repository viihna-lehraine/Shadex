import { config } from '../../../../config/partials/base.js';
import { defaults } from '../../../../config/partials/defaults.js';
import '../../../../config/partials/regex.js';

// File: common/utils/partials/conversion.ts
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
function colorConversionUtilitiesFactory(adjust, brand, format, helpers, sanitize, services, validate) {
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
                    x: brand.asXYZ_X(sanitize.percentile(refX * (pow(x, 3) > 0.008856 ? pow(x, 3) : (x - 16 / 116) / 7.787))),
                    y: brand.asXYZ_Y(sanitize.percentile(refY * (pow(y, 3) > 0.008856 ? pow(y, 3) : (y - 16 / 116) / 7.787))),
                    z: brand.asXYZ_Z(sanitize.percentile(refZ * (pow(z, 3) > 0.008856 ? pow(z, 3) : (z - 16 / 116) / 7.787)))
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
            if ([clonedRGB.value.red, clonedRGB.value.green, clonedRGB.value.blue].some(v => isNaN(v) || v < 0 || v > 255)) {
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
            const linearRed = red > 0.04045 ? Math.pow((red + 0.055) / 1.055, 2.4) : red / 12.92;
            const linearGreen = green > 0.04045
                ? Math.pow((green + 0.055) / 1.055, 2.4)
                : green / 12.92;
            const linearBlue = blue > 0.04045 ? Math.pow((blue + 0.055) / 1.055, 2.4) : blue / 12.92;
            // scale to 100
            const scaledRed = linearRed * 100;
            const scaledGreen = linearGreen * 100;
            const scaledBlue = linearBlue * 100;
            const x = brand.asXYZ_X(adjust.clampXYZ(scaledRed * 0.4124 + scaledGreen * 0.3576 + scaledBlue * 0.1805, math.maxXYZ_X));
            const y = brand.asXYZ_Y(adjust.clampXYZ(scaledRed * 0.2126 + scaledGreen * 0.7152 + scaledBlue * 0.0722, math.maxXYZ_Y));
            const z = brand.asXYZ_Z(adjust.clampXYZ(scaledRed * 0.0193 + scaledGreen * 0.1192 + scaledBlue * 0.9505, math.maxXYZ_Z));
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

export { colorConversionUtilitiesFactory };
//# sourceMappingURL=conversion.js.map
