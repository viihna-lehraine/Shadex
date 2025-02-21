import { defaults, config } from '../../../../config/index.js';

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
function colorConversionUtilsFactory(helpers, services, utils) {
    const { clone } = helpers.data;
    const { log } = services;
    function cmykToHSL(cmyk) {
        try {
            if (!utils.validate.colorValue(cmyk)) {
                log(`Invalid CMYK value ${JSON.stringify(cmyk)}`, 'error');
                return defaultHSL;
            }
            return rgbToHSL(cmykToRGB(clone(cmyk)));
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultHSL;
        }
    }
    function cmykToRGB(cmyk) {
        try {
            if (!utils.validate.colorValue(cmyk)) {
                log(`Invalid CMYK value ${JSON.stringify(cmyk)}`, 'error');
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
                    red: utils.brand.asByteRange(utils.sanitize.percentile(r)),
                    green: utils.brand.asByteRange(utils.sanitize.percentile(g)),
                    blue: utils.brand.asByteRange(utils.sanitize.percentile(b))
                },
                format: 'rgb'
            };
            return utils.adjust.clampRGB(rgb);
        }
        catch (error) {
            log('Error: ${error}', 'error');
            return defaultRGB;
        }
    }
    function hexToHSL(hex) {
        try {
            if (!utils.validate.colorValue(hex)) {
                log(`Invalid Hex value ${JSON.stringify(hex)}`, 'error');
                return defaultHSL;
            }
            return rgbToHSL(hexToRGB(clone(hex)));
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultHSL;
        }
    }
    function hexToRGB(hex) {
        try {
            if (!utils.validate.colorValue(hex)) {
                log(`Invalid Hex value ${JSON.stringify(hex)}`, 'error');
                return defaultRGB;
            }
            const clonedHex = clone(hex);
            const strippedHex = utils.format.stripHashFromHex(clonedHex).value.hex;
            const bigint = parseInt(strippedHex, 16);
            return {
                value: {
                    red: utils.brand.asByteRange(utils.sanitize.percentile((bigint >> 16) & 255)),
                    green: utils.brand.asByteRange(utils.sanitize.percentile((bigint >> 8) & 255)),
                    blue: utils.brand.asByteRange(utils.sanitize.percentile(bigint & 255))
                },
                format: 'rgb'
            };
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultRGB;
        }
    }
    function hslToCMYK(hsl) {
        try {
            if (!utils.validate.colorValue(hsl)) {
                log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
                return defaultCMYK;
            }
            return rgbToCMYK(hslToRGB(clone(hsl)));
        }
        catch (error) {
            log(`Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`, 'error');
            return defaultCMYK;
        }
    }
    function hslToHex(hsl) {
        try {
            if (!utils.validate.colorValue(hsl)) {
                log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
                return defaultHex;
            }
            return rgbToHex(hslToRGB(clone(hsl)));
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultHex;
        }
    }
    function hslToHSV(hsl) {
        try {
            if (!utils.validate.colorValue(hsl)) {
                log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
                return defaultHSV;
            }
            const clonedHSL = clone(hsl);
            const s = clonedHSL.value.saturation / 100;
            const l = clonedHSL.value.lightness / 100;
            const value = l + s * Math.min(l, 1 - 1);
            const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);
            return {
                value: {
                    hue: utils.brand.asRadial(utils.sanitize.percentile(clonedHSL.value.hue)),
                    saturation: utils.brand.asPercentile(utils.sanitize.percentile(newSaturation * 100)),
                    value: utils.brand.asPercentile(utils.sanitize.percentile(value * 100))
                },
                format: 'hsv'
            };
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultHSV;
        }
    }
    function hslToLAB(hsl) {
        try {
            if (!utils.validate.colorValue(hsl)) {
                log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
                return defaultLAB;
            }
            return xyzToLAB(rgbToXYZ(hslToRGB(clone(hsl))));
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultLAB;
        }
    }
    function hslToRGB(hsl) {
        try {
            if (!utils.validate.colorValue(hsl)) {
                log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
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
                    red: utils.brand.asByteRange(utils.sanitize.percentile(helpers.color.hueToRGB(p, q, hue + 1 / 3) * 255)),
                    green: utils.brand.asByteRange(utils.sanitize.percentile(helpers.color.hueToRGB(p, q, hue) * 255)),
                    blue: utils.brand.asByteRange(utils.sanitize.percentile(helpers.color.hueToRGB(p, q, hue - 1 / 3) * 255))
                },
                format: 'rgb'
            };
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultRGB;
        }
    }
    function hslToSL(hsl) {
        try {
            if (!utils.validate.colorValue(hsl)) {
                log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
                return defaultSL;
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
            log(`Error: ${error}`, 'error');
            return defaultSL;
        }
    }
    function hslToSV(hsl) {
        try {
            if (!utils.validate.colorValue(hsl)) {
                log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
                return defaultSV;
            }
            return hsvToSV(rgbToHSV(hslToRGB(clone(hsl))));
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultSV;
        }
    }
    function hslToXYZ(hsl) {
        try {
            if (!utils.validate.colorValue(hsl)) {
                log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
                return defaultXYZ;
            }
            return labToXYZ(hslToLAB(clone(hsl)));
        }
        catch (error) {
            log(`hslToXYZ error: ${error}`, 'error');
            return defaultXYZ;
        }
    }
    function hsvToHSL(hsv) {
        try {
            if (!utils.validate.colorValue(hsv)) {
                log(`Invalid HSV value ${JSON.stringify(hsv)}`, 'error');
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
                    hue: utils.brand.asRadial(utils.sanitize.percentile(clonedHSV.value.hue)),
                    saturation: utils.brand.asPercentile(utils.sanitize.percentile(newSaturation * 100)),
                    lightness: utils.brand.asPercentile(utils.sanitize.percentile(lightness))
                },
                format: 'hsl'
            };
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultHSL;
        }
    }
    function hsvToSV(hsv) {
        try {
            if (!utils.validate.colorValue(hsv)) {
                log(`Invalid HSV value ${JSON.stringify(hsv)}`, 'error');
                return defaultSV;
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
            log(`Error: ${error}`, 'error');
            return defaultSV;
        }
    }
    function labToHSL(lab) {
        try {
            if (!utils.validate.colorValue(lab)) {
                log(`Invalid LAB value ${JSON.stringify(lab)}`, 'error');
                return defaultHSL;
            }
            return rgbToHSL(labToRGB(clone(lab)));
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultHSL;
        }
    }
    function labToRGB(lab) {
        try {
            if (!utils.validate.colorValue(lab)) {
                log(`Invalid LAB value ${JSON.stringify(lab)}`, 'error');
                return defaultRGB;
            }
            return xyzToRGB(labToXYZ(clone(lab)));
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultRGB;
        }
    }
    function labToXYZ(lab) {
        try {
            if (!utils.validate.colorValue(lab)) {
                log(`Invalid LAB value ${JSON.stringify(lab)}`, 'error');
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
                    x: utils.brand.asXYZ_X(utils.sanitize.percentile(refX *
                        (pow(x, 3) > 0.008856
                            ? pow(x, 3)
                            : (x - 16 / 116) / 7.787))),
                    y: utils.brand.asXYZ_Y(utils.sanitize.percentile(refY *
                        (pow(y, 3) > 0.008856
                            ? pow(y, 3)
                            : (y - 16 / 116) / 7.787))),
                    z: utils.brand.asXYZ_Z(utils.sanitize.percentile(refZ *
                        (pow(z, 3) > 0.008856
                            ? pow(z, 3)
                            : (z - 16 / 116) / 7.787)))
                },
                format: 'xyz'
            };
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultXYZ;
        }
    }
    function rgbToCMYK(rgb) {
        try {
            if (!utils.validate.colorValue(rgb)) {
                log(`Invalid RGB value ${JSON.stringify(rgb)}`, 'error');
                return defaultCMYK;
            }
            const clonedRGB = clone(rgb);
            const redPrime = clonedRGB.value.red / 255;
            const greenPrime = clonedRGB.value.green / 255;
            const bluePrime = clonedRGB.value.blue / 255;
            const key = utils.sanitize.percentile(utils.sanitize.percentile(1 - Math.max(redPrime, greenPrime, bluePrime)));
            const cyan = utils.sanitize.percentile(utils.sanitize.percentile((1 - redPrime - key) / (1 - key) || 0));
            const magenta = utils.sanitize.percentile(utils.sanitize.percentile((1 - greenPrime - key) / (1 - key) || 0));
            const yellow = utils.sanitize.percentile(utils.sanitize.percentile((1 - bluePrime - key) / (1 - key) || 0));
            const format = 'cmyk';
            const cmyk = { value: { cyan, magenta, yellow, key }, format };
            log(`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(clone(cmyk))}`, 'debug', 5);
            return cmyk;
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultCMYK;
        }
    }
    function rgbToHex(rgb) {
        try {
            if (!utils.validate.colorValue(rgb)) {
                log(`Invalid RGB value ${JSON.stringify(rgb)}`, 'error');
                return defaultHex;
            }
            const clonedRGB = clone(rgb);
            if ([
                clonedRGB.value.red,
                clonedRGB.value.green,
                clonedRGB.value.blue
            ].some(v => isNaN(v) || v < 0 || v > 255)) {
                log(`Invalid RGB values:\nR=${JSON.stringify(clonedRGB.value.red)}\nG=${JSON.stringify(clonedRGB.value.green)}\nB=${JSON.stringify(clonedRGB.value.blue)}`, 'error');
                return {
                    value: {
                        hex: utils.brand.asHexSet('#000000FF')
                    },
                    format: 'hex'
                };
            }
            return {
                value: {
                    hex: utils.brand.asHexSet(`#${utils.format.componentToHex(clonedRGB.value.red)}${utils.format.componentToHex(clonedRGB.value.green)}${utils.format.componentToHex(clonedRGB.value.blue)}`)
                },
                format: 'hex'
            };
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultHex;
        }
    }
    function rgbToHSL(rgb) {
        try {
            if (!utils.validate.colorValue(rgb)) {
                log(`Invalid RGB value ${JSON.stringify(rgb)}`, 'error');
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
                    hue: utils.brand.asRadial(utils.sanitize.percentile(hue)),
                    saturation: utils.brand.asPercentile(utils.sanitize.percentile(saturation * 100)),
                    lightness: utils.brand.asPercentile(utils.sanitize.percentile(lightness * 100))
                },
                format: 'hsl'
            };
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultHSL;
        }
    }
    function rgbToHSV(rgb) {
        try {
            if (!utils.validate.colorValue(rgb)) {
                log(`Invalid RGB value ${JSON.stringify(rgb)}`, 'error');
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
                    hue: utils.brand.asRadial(utils.sanitize.percentile(hue)),
                    saturation: utils.brand.asPercentile(utils.sanitize.percentile(saturation * 100)),
                    value: utils.brand.asPercentile(utils.sanitize.percentile(value * 100))
                },
                format: 'hsv'
            };
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultHSV;
        }
    }
    function rgbToXYZ(rgb) {
        try {
            if (!utils.validate.colorValue(rgb)) {
                log(`Invalid RGB value ${JSON.stringify(rgb)}`, 'error');
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
            const x = utils.brand.asXYZ_X(utils.adjust.clampXYZ(scaledRed * 0.4124 +
                scaledGreen * 0.3576 +
                scaledBlue * 0.1805, math.maxXYZ_X));
            const y = utils.brand.asXYZ_Y(utils.adjust.clampXYZ(scaledRed * 0.2126 +
                scaledGreen * 0.7152 +
                scaledBlue * 0.0722, math.maxXYZ_Y));
            const z = utils.brand.asXYZ_Z(utils.adjust.clampXYZ(scaledRed * 0.0193 +
                scaledGreen * 0.1192 +
                scaledBlue * 0.9505, math.maxXYZ_Z));
            const xyz = { value: { x, y, z }, format: 'xyz' };
            return utils.validate.colorValue(xyz) ? xyz : defaultXYZ;
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultXYZ;
        }
    }
    function xyzToHSL(xyz) {
        try {
            if (!utils.validate.colorValue(xyz)) {
                log(`Invalid XYZ value ${JSON.stringify(xyz)}`, 'error');
                return defaultHSL;
            }
            return rgbToHSL(xyzToRGB(clone(xyz)));
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultHSL;
        }
    }
    function xyzToLAB(xyz) {
        try {
            if (!utils.validate.colorValue(xyz)) {
                log(`Invalid XYZ value ${JSON.stringify(xyz)}`, 'error');
                return defaultLAB;
            }
            const clonedXYZ = clone(xyz);
            const refX = math.maxXYZ_X, refY = math.maxXYZ_Y, refZ = math.maxXYZ_Z;
            clonedXYZ.value.x = utils.adjust.normalizeXYZ(clonedXYZ.value.x, refX);
            clonedXYZ.value.y = utils.adjust.normalizeXYZ(clonedXYZ.value.y, refY);
            clonedXYZ.value.z = utils.adjust.normalizeXYZ(clonedXYZ.value.z, refZ);
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
            const l = utils.sanitize.percentile(parseFloat((116 * clonedXYZ.value.y - 16).toFixed(2)));
            const a = utils.sanitize.lab(parseFloat((500 * (clonedXYZ.value.x - clonedXYZ.value.y)).toFixed(2)), 'a');
            const b = utils.sanitize.lab(parseFloat((200 * (clonedXYZ.value.y - clonedXYZ.value.z)).toFixed(2)), 'b');
            const lab = {
                value: {
                    l: utils.brand.asLAB_L(utils.sanitize.percentile(l)),
                    a: utils.brand.asLAB_A(utils.sanitize.percentile(a)),
                    b: utils.brand.asLAB_B(utils.sanitize.percentile(b))
                },
                format: 'lab'
            };
            if (!utils.validate.colorValue(lab)) {
                log(`Invalid LAB value ${JSON.stringify(lab)}`, 'error');
                return defaultLAB;
            }
            return lab;
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultLAB;
        }
    }
    function xyzToRGB(xyz) {
        try {
            if (!utils.validate.colorValue(xyz)) {
                log(`Invalid XYZ value ${JSON.stringify(xyz)}`, 'error');
                return defaultRGB;
            }
            const x = xyz.value.x / 100;
            const y = xyz.value.y / 100;
            const z = xyz.value.z / 100;
            let red = x * 3.2406 + y * -1.5372 + z * -0.4986;
            let green = x * -0.9689 + y * 1.8758 + z * 0.0415;
            let blue = x * 0.0557 + y * -0.204 + z * 1.057;
            red = utils.adjust.applyGammaCorrection(red);
            green = utils.adjust.applyGammaCorrection(green);
            blue = utils.adjust.applyGammaCorrection(blue);
            const rgb = utils.adjust.clampRGB({
                value: {
                    red: utils.brand.asByteRange(utils.sanitize.percentile(red)),
                    green: utils.brand.asByteRange(utils.sanitize.percentile(green)),
                    blue: utils.brand.asByteRange(utils.sanitize.percentile(blue))
                },
                format: 'rgb'
            });
            return rgb;
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultRGB;
        }
    }
    return {
        cmykToHSL,
        cmykToRGB,
        hexToHSL,
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
        xyzToLAB,
        xyzToHSL,
        xyzToRGB,
        convertHSL(color, colorSpace) {
            try {
                if (!utils.validate.colorValue(color)) {
                    log(`Invalid color value ${JSON.stringify(color)}`, 'error');
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
            }
            catch (error) {
                throw new Error(`hslTo() error: ${error}`);
            }
        },
        convertToHSL(color) {
            const log = services.log;
            try {
                if (!utils.validate.colorValue(color)) {
                    log(`Invalid color value ${JSON.stringify(color)}`, 'error');
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
            }
            catch (error) {
                throw new Error(`toHSL() error: ${error}`);
            }
        },
        hexToHSLWrapper(input) {
            try {
                const clonedInput = clone(input);
                const hex = typeof clonedInput === 'string'
                    ? {
                        value: {
                            hex: utils.brand.asHexSet(clonedInput)
                        },
                        format: 'hex'
                    }
                    : {
                        value: {
                            hex: utils.brand.asHexSet(clonedInput.value.hex)
                        },
                        format: 'hex'
                    };
                return hexToHSL(hex);
            }
            catch (error) {
                log(`Error: ${error}`, 'error');
                return defaultHSL;
            }
        }
    };
}

export { colorConversionUtilsFactory };
//# sourceMappingURL=conversion.js.map
