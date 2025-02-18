import { data } from '../../data/index.js';

// File: common/helpers/color.js
const math = data.math;
const limits = math.limits;
const defaults = data.defaults;
const defaultCMYK = defaults.colors.cmyk;
const defaultHex = defaults.colors.hex;
const defaultHSL = defaults.colors.hsl;
const defaultHSV = defaults.colors.hsv;
const defaultLAB = defaults.colors.lab;
const defaultRGB = defaults.colors.rgb;
const defaultSL = defaults.colors.sl;
const defaultSV = defaults.colors.sv;
const defaultXYZ = defaults.colors.xyz;
function createColorHelpers(services, utils) {
    function cmykToRGB(cmyk) {
        const log = services.log;
        try {
            if (!utils.validate.colorValue(cmyk)) {
                log('error', `Invalid CMYK value ${JSON.stringify(cmyk)}`, 'cmykToRGB()');
                return defaultRGB;
            }
            const clonedCMYK = utils.core.clone(cmyk);
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
            log('error', `Error: ${error}`, 'cmykToRGB()');
            return defaultRGB;
        }
    }
    function hexToHSL(hex) {
        const log = services.log;
        try {
            if (!utils.validate.colorValue(hex)) {
                log('error', `Invalid Hex value ${JSON.stringify(hex)}`, 'hexToHSL()');
                return defaultHSL;
            }
            return rgbToHSL(hexToRGB(utils.core.clone(hex)));
        }
        catch (error) {
            log('error', `Error: ${error}`, 'hexToHSL()');
            return defaultHSL;
        }
    }
    function hexToRGB(hex) {
        const log = services.log;
        try {
            if (!utils.validate.colorValue(hex)) {
                log('error', `Invalid Hex value ${JSON.stringify(hex)}`, 'hexToRGB()');
                return defaultRGB;
            }
            const clonedHex = utils.core.clone(hex);
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
            log('error', `Error: ${error}`, 'hexToRGB()');
            return defaultRGB;
        }
    }
    function hslToLAB(hsl) {
        const log = services.log;
        try {
            if (!utils.validate.colorValue(hsl)) {
                log('error', `Invalid HSL value ${JSON.stringify(hsl)}`, 'hslToLAB()');
                return defaultLAB;
            }
            return xyzToLAB(rgbToXYZ(hslToRGB(utils.core.clone(hsl))));
        }
        catch (error) {
            log('error', `Error: ${error}`, 'hslToLAB()');
            return defaultLAB;
        }
    }
    function hslToRGB(hsl) {
        const log = services.log;
        try {
            if (!utils.validate.colorValue(hsl)) {
                log('error', `Invalid HSL value ${JSON.stringify(hsl)}`, 'hslToRGB()');
                return defaultRGB;
            }
            const clonedHSL = utils.core.clone(hsl);
            const hue = clonedHSL.value.hue / 360;
            const s = clonedHSL.value.saturation / 100;
            const l = clonedHSL.value.lightness / 100;
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            return {
                value: {
                    red: utils.brand.asByteRange(utils.sanitize.percentile(utils.color.hueToRGB(p, q, hue + 1 / 3) * 255)),
                    green: utils.brand.asByteRange(utils.sanitize.percentile(utils.color.hueToRGB(p, q, hue) * 255)),
                    blue: utils.brand.asByteRange(utils.sanitize.percentile(utils.color.hueToRGB(p, q, hue - 1 / 3) * 255))
                },
                format: 'rgb'
            };
        }
        catch (error) {
            log('error', `Error: ${error}`, 'hslToRGB()');
            return defaultRGB;
        }
    }
    function hsvToSV(hsv) {
        const log = services.log;
        try {
            if (!utils.validate.colorValue(hsv)) {
                log('error', `Invalid HSV value ${JSON.stringify(hsv)}`, 'hsvToSV()');
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
            log('error', `Error: ${error}`, 'hsvToSV()');
            return defaultSV;
        }
    }
    function labToRGB(lab) {
        const log = services.log;
        try {
            if (!utils.validate.colorValue(lab)) {
                log('error', `Invalid LAB value ${JSON.stringify(lab)}`, 'labToRGB()');
                return defaultRGB;
            }
            return xyzToRGB(labToXYZ(utils.core.clone(lab)));
        }
        catch (error) {
            log('error', `Eerror: ${error}`, 'labToRGB()');
            return defaultRGB;
        }
    }
    function labToXYZ(lab) {
        const log = services.log;
        try {
            if (!utils.validate.colorValue(lab)) {
                log('error', `Invalid LAB value ${JSON.stringify(lab)}`, 'labToXYZ()');
                return defaultXYZ;
            }
            const clonedLAB = utils.core.clone(lab);
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
            log('error', `Error: ${error}`, 'labToXYZ()');
            return defaultXYZ;
        }
    }
    function rgbToCMYK(rgb) {
        const log = services.log;
        try {
            if (!utils.validate.colorValue(rgb)) {
                log('error', `Invalid RGB value ${JSON.stringify(rgb)}`, 'rgbToCMYK()');
                return defaultCMYK;
            }
            const clonedRGB = utils.core.clone(rgb);
            const redPrime = clonedRGB.value.red / 255;
            const greenPrime = clonedRGB.value.green / 255;
            const bluePrime = clonedRGB.value.blue / 255;
            const key = utils.sanitize.percentile(utils.sanitize.percentile(1 - Math.max(redPrime, greenPrime, bluePrime)));
            const cyan = utils.sanitize.percentile(utils.sanitize.percentile((1 - redPrime - key) / (1 - key) || 0));
            const magenta = utils.sanitize.percentile(utils.sanitize.percentile((1 - greenPrime - key) / (1 - key) || 0));
            const yellow = utils.sanitize.percentile(utils.sanitize.percentile((1 - bluePrime - key) / (1 - key) || 0));
            const format = 'cmyk';
            const cmyk = { value: { cyan, magenta, yellow, key }, format };
            log('debug', `Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(utils.core.clone(cmyk))}`, 'rgbToCMYK()', 5);
            return cmyk;
        }
        catch (error) {
            log('error', `Error: ${error}`, 'rgbToCMYK()');
            return defaultCMYK;
        }
    }
    function rgbToHex(rgb) {
        const log = services.log;
        try {
            if (!utils.validate.colorValue(rgb)) {
                log('error', `Invalid RGB value ${JSON.stringify(rgb)}`, 'rgbToHex()');
                return defaultHex;
            }
            const clonedRGB = utils.core.clone(rgb);
            if ([
                clonedRGB.value.red,
                clonedRGB.value.green,
                clonedRGB.value.blue
            ].some(v => isNaN(v) || v < 0 || v > 255)) {
                log('error', `Invalid RGB values:\nR=${JSON.stringify(clonedRGB.value.red)}\nG=${JSON.stringify(clonedRGB.value.green)}\nB=${JSON.stringify(clonedRGB.value.blue)}`, 'rgbToHex()');
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
            log('error', `Error: ${error}`, 'rgbToHex()');
            return defaultHex;
        }
    }
    function rgbToHSL(rgb) {
        const log = services.log;
        try {
            if (!utils.validate.colorValue(rgb)) {
                log('error', `Invalid RGB value ${JSON.stringify(rgb)}`, 'rgbToHSL()');
                return defaultHSL;
            }
            const clonedRGB = utils.core.clone(rgb);
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
            log('error', `Error: ${error}`, 'rgbToHSL()');
            return defaultHSL;
        }
    }
    function rgbToHSV(rgb) {
        const log = services.log;
        try {
            if (!utils.validate.colorValue(rgb)) {
                log('error', `Invalid RGB value ${JSON.stringify(rgb)}`, 'rgbToHSV()');
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
            log('error', `Error: ${error}`, 'rgbToHSV()');
            return defaultHSV;
        }
    }
    function rgbToXYZ(rgb) {
        const log = services.log;
        try {
            if (!utils.validate.colorValue(rgb)) {
                log('error', `Invalid RGB value ${JSON.stringify(rgb)}`, 'rgbToXYZ()');
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
                scaledBlue * 0.1805, limits.maxX));
            const y = utils.brand.asXYZ_Y(utils.adjust.clampXYZ(scaledRed * 0.2126 +
                scaledGreen * 0.7152 +
                scaledBlue * 0.0722, limits.maxY));
            const z = utils.brand.asXYZ_Z(utils.adjust.clampXYZ(scaledRed * 0.0193 +
                scaledGreen * 0.1192 +
                scaledBlue * 0.9505, limits.maxZ));
            const xyz = { value: { x, y, z }, format: 'xyz' };
            return utils.validate.colorValue(xyz) ? xyz : defaultXYZ;
        }
        catch (error) {
            log('error', `Error: ${error}`, 'rgbToXYZ()');
            return defaultXYZ;
        }
    }
    function xyzToLAB(xyz) {
        const log = services.log;
        try {
            if (!utils.validate.colorValue(xyz)) {
                log('error', `Invalid XYZ value ${JSON.stringify(xyz)}`, 'xyzToLAB()');
                return defaultLAB;
            }
            const clonedXYZ = utils.core.clone(xyz);
            const refX = limits.maxX, refY = limits.maxY, refZ = limits.maxZ;
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
                log('error', `Invalid LAB value ${JSON.stringify(lab)}`, 'labToXYZ()');
                return defaultLAB;
            }
            return lab;
        }
        catch (error) {
            log('error', `${error}`, 'xyzToLAB');
            return defaultLAB;
        }
    }
    function xyzToRGB(xyz) {
        const log = services.log;
        try {
            if (!utils.validate.colorValue(xyz)) {
                log('error', `Invalid XYZ value ${JSON.stringify(xyz)}`, 'colorUtils > helpers.xyzToRGB()');
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
            log('warn', `Error: ${error}`, 'xyzToRGB()');
            return defaultRGB;
        }
    }
    return {
        cmykToRGB,
        hexToHSL,
        hexToRGB,
        hslToLAB,
        hslToRGB,
        hsvToSV,
        labToRGB,
        labToXYZ,
        rgbToCMYK,
        rgbToHex,
        rgbToHSL,
        rgbToHSV,
        rgbToXYZ,
        xyzToRGB,
        xyzToLAB,
        cmykToHSL(cmyk) {
            const log = services.log;
            try {
                if (!utils.validate.colorValue(cmyk)) {
                    log('error', `Invalid CMYK value ${JSON.stringify(cmyk)}`, 'cmykToHSL()');
                    return defaultHSL;
                }
                return rgbToHSL(cmykToRGB(utils.core.clone(cmyk)));
            }
            catch (error) {
                log('error', `Error: ${error}`, 'cmykToHSL()');
                return defaultHSL;
            }
        },
        hexToHSLWrapper(input) {
            const log = services.log;
            try {
                const clonedInput = utils.core.clone(input);
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
                log('error', `Error: ${error}`, 'hexToHSLWrapper()');
                return defaultHSL;
            }
        },
        hslToCMYK(hsl) {
            const log = services.log;
            try {
                if (!utils.validate.colorValue(hsl)) {
                    log('error', `Invalid HSL value ${JSON.stringify(hsl)}`, 'hslToCMYK()');
                    return defaultCMYK;
                }
                return rgbToCMYK(hslToRGB(utils.core.clone(hsl)));
            }
            catch (error) {
                log('error', `Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`, 'colorUtils > helpers.hslToCMYK()');
                return defaultCMYK;
            }
        },
        hslToHex(hsl) {
            const log = services.log;
            try {
                if (!utils.validate.colorValue(hsl)) {
                    log('error', `Invalid HSL value ${JSON.stringify(hsl)}`, 'hslToHex()');
                    return defaultHex;
                }
                return rgbToHex(hslToRGB(utils.core.clone(hsl)));
            }
            catch (error) {
                log('error', `Error: ${error}`, 'hslToHex()');
                return defaultHex;
            }
        },
        hslToHSV(hsl) {
            const log = services.log;
            try {
                if (!utils.validate.colorValue(hsl)) {
                    log('error', `Invalid HSL value ${JSON.stringify(hsl)}`, 'hslToHSV()');
                    return defaultHSV;
                }
                const clonedHSL = utils.core.clone(hsl);
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
                log('error', `Error: ${error}`, 'hslToHSV()');
                return defaultHSV;
            }
        },
        hslToSL(hsl) {
            const log = services.log;
            try {
                if (!utils.validate.colorValue(hsl)) {
                    log('error', `Invalid HSL value ${JSON.stringify(hsl)}`, 'hslToSL()');
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
                log('error', `Error: ${error}`, 'hslToSL()');
                return defaultSL;
            }
        },
        hslToSV(hsl) {
            const log = services.log;
            try {
                if (!utils.validate.colorValue(hsl)) {
                    log('error', `Invalid HSL value ${JSON.stringify(hsl)}`, 'hslToSV()');
                    return defaultSV;
                }
                return hsvToSV(rgbToHSV(hslToRGB(utils.core.clone(hsl))));
            }
            catch (error) {
                log('error', `Error: ${error}`, 'hsvToSV()');
                return defaultSV;
            }
        },
        hslToXYZ(hsl) {
            const log = services.log;
            try {
                if (!utils.validate.colorValue(hsl)) {
                    log('error', `Invalid HSL value ${JSON.stringify(hsl)}`, 'hslToXYZ()');
                    return defaultXYZ;
                }
                return labToXYZ(hslToLAB(utils.core.clone(hsl)));
            }
            catch (error) {
                log('error', `hslToXYZ error: ${error}`, 'labToXYZ()');
                return defaultXYZ;
            }
        },
        hsvToHSL(hsv) {
            const log = services.log;
            try {
                if (!utils.validate.colorValue(hsv)) {
                    log('error', `Invalid HSV value ${JSON.stringify(hsv)}`, 'hsvToHSL()');
                    return defaultHSL;
                }
                const clonedHSV = utils.core.clone(hsv);
                const s = clonedHSV.value.saturation / 100;
                const v = clonedHSV.value.value / 100;
                const l = v * (1 - s / 2);
                const newSaturation = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
                const lightness = clonedHSV.value.value *
                    (1 - clonedHSV.value.saturation / 200);
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
                log('error', `Error: ${error}`, 'hsvToHSL()');
                return defaultHSL;
            }
        },
        labToHSL(lab) {
            const log = services.log;
            try {
                if (!utils.validate.colorValue(lab)) {
                    log('error', `Invalid LAB value ${JSON.stringify(lab)}`, 'labToHSL()');
                    return defaultHSL;
                }
                return rgbToHSL(labToRGB(utils.core.clone(lab)));
            }
            catch (error) {
                log('error', `Error: ${error}`, 'labToHSL()');
                return defaultHSL;
            }
        },
        xyzToHSL(xyz) {
            const log = services.log;
            try {
                if (!utils.validate.colorValue(xyz)) {
                    log('error', `Invalid XYZ value ${JSON.stringify(xyz)}`, 'xyzToHSL()');
                    return defaultHSL;
                }
                return rgbToHSL(xyzToRGB(utils.core.clone(xyz)));
            }
            catch (error) {
                log('error', `Error: ${error}`, 'xyzToHSL()');
                return defaultHSL;
            }
        }
    };
}

export { createColorHelpers };
//# sourceMappingURL=color.js.map
