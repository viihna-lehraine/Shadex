// File: common/helpers/color.js
import { data } from '../../config/index.js';
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
export function createColorHelpers(services, utils) {
    const { log } = services;
    function cmykToRGB(cmyk) {
        try {
            if (!utils.validate.colorValue(cmyk)) {
                log(`Invalid CMYK value ${JSON.stringify(cmyk)}`, 'error');
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
            return rgbToHSL(hexToRGB(utils.core.clone(hex)));
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
            log(`Error: ${error}`, 'error');
            return defaultRGB;
        }
    }
    function hslToLAB(hsl) {
        try {
            if (!utils.validate.colorValue(hsl)) {
                log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
                return defaultLAB;
            }
            return xyzToLAB(rgbToXYZ(hslToRGB(utils.core.clone(hsl))));
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
            log(`Error: ${error}`, 'error');
            return defaultRGB;
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
    function labToRGB(lab) {
        try {
            if (!utils.validate.colorValue(lab)) {
                log(`Invalid LAB value ${JSON.stringify(lab)}`, 'error');
                return defaultRGB;
            }
            return xyzToRGB(labToXYZ(utils.core.clone(lab)));
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
            log(`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(utils.core.clone(cmyk))}`, 'debug', 5);
            return cmyk;
        }
        catch (error) {
            log(`Error: ${error}`, 'error');
            return defaultCMYK;
        }
    }
    function rgbToHex(rgb) {
        const log = services.log;
        try {
            if (!utils.validate.colorValue(rgb)) {
                log(`Invalid RGB value ${JSON.stringify(rgb)}`, 'error');
                return defaultHex;
            }
            const clonedRGB = utils.core.clone(rgb);
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
            log(`Error: ${error}`, 'error');
            return defaultXYZ;
        }
    }
    function xyzToLAB(xyz) {
        try {
            if (!utils.validate.colorValue(xyz)) {
                log(`Invalid XYZ value ${JSON.stringify(xyz)}`, 'error');
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
            try {
                if (!utils.validate.colorValue(cmyk)) {
                    log(`Invalid CMYK value ${JSON.stringify(cmyk)}`, 'error');
                    return defaultHSL;
                }
                return rgbToHSL(cmykToRGB(utils.core.clone(cmyk)));
            }
            catch (error) {
                log(`Error: ${error}`, 'error');
                return defaultHSL;
            }
        },
        hexToHSLWrapper(input) {
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
                log(`Error: ${error}`, 'error');
                return defaultHSL;
            }
        },
        hslToCMYK(hsl) {
            try {
                if (!utils.validate.colorValue(hsl)) {
                    log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
                    return defaultCMYK;
                }
                return rgbToCMYK(hslToRGB(utils.core.clone(hsl)));
            }
            catch (error) {
                log(`Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`, 'error');
                return defaultCMYK;
            }
        },
        hslToHex(hsl) {
            try {
                if (!utils.validate.colorValue(hsl)) {
                    log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
                    return defaultHex;
                }
                return rgbToHex(hslToRGB(utils.core.clone(hsl)));
            }
            catch (error) {
                log(`Error: ${error}`, 'error');
                return defaultHex;
            }
        },
        hslToHSV(hsl) {
            try {
                if (!utils.validate.colorValue(hsl)) {
                    log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
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
                log(`Error: ${error}`, 'error');
                return defaultHSV;
            }
        },
        hslToSL(hsl) {
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
        },
        hslToSV(hsl) {
            try {
                if (!utils.validate.colorValue(hsl)) {
                    log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
                    return defaultSV;
                }
                return hsvToSV(rgbToHSV(hslToRGB(utils.core.clone(hsl))));
            }
            catch (error) {
                log(`Error: ${error}`, 'error');
                return defaultSV;
            }
        },
        hslToXYZ(hsl) {
            const log = services.log;
            try {
                if (!utils.validate.colorValue(hsl)) {
                    log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');
                    return defaultXYZ;
                }
                return labToXYZ(hslToLAB(utils.core.clone(hsl)));
            }
            catch (error) {
                log(`hslToXYZ error: ${error}`, 'error');
                return defaultXYZ;
            }
        },
        hsvToHSL(hsv) {
            try {
                if (!utils.validate.colorValue(hsv)) {
                    log(`Invalid HSV value ${JSON.stringify(hsv)}`, 'error');
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
                log(`Error: ${error}`, 'error');
                return defaultHSL;
            }
        },
        labToHSL(lab) {
            try {
                if (!utils.validate.colorValue(lab)) {
                    log(`Invalid LAB value ${JSON.stringify(lab)}`, 'error');
                    return defaultHSL;
                }
                return rgbToHSL(labToRGB(utils.core.clone(lab)));
            }
            catch (error) {
                log(`Error: ${error}`, 'error');
                return defaultHSL;
            }
        },
        xyzToHSL(xyz) {
            try {
                if (!utils.validate.colorValue(xyz)) {
                    log(`Invalid XYZ value ${JSON.stringify(xyz)}`, 'error');
                    return defaultHSL;
                }
                return rgbToHSL(xyzToRGB(utils.core.clone(xyz)));
            }
            catch (error) {
                log(`Error: ${error}`, 'error');
                return defaultHSL;
            }
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL2hlbHBlcnMvY29sb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsZ0NBQWdDO0FBbUJoQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFN0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN2QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBRTNCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFFL0IsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDekMsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDdkMsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDdkMsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDdkMsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDdkMsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDdkMsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDckMsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDckMsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFFdkMsTUFBTSxVQUFVLGtCQUFrQixDQUNqQyxRQUEyQixFQUMzQixLQUF5QjtJQUV6QixNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsUUFBUSxDQUFDO0lBRXpCLFNBQVMsU0FBUyxDQUFDLElBQVU7UUFDNUIsSUFBSSxDQUFDO1lBQ0osSUFB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QkFFaEMsT0FBTyxVQUFVLENBQUM7WUFDbkIsQ0FBQztRQUNGLENBQUM7S0FDRCxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IGNvbW1vbi9oZWxwZXJzL2NvbG9yLmpzXG5cbmltcG9ydCB7XG5cdENNWUssXG5cdENvbG9ySGVscGVyc0ludGVyZmFjZSxcblx0SGV4LFxuXHRIU0wsXG5cdEhTVixcblx0TEFCLFxuXHRSR0IsXG5cdFNlcnZpY2VzSW50ZXJmYWNlLFxuXHRTTCxcblx0U1YsXG5cdFV0aWxpdGllc0ludGVyZmFjZSxcblx0WFlaLFxuXHRYWVpfWCxcblx0WFlaX1ksXG5cdFhZWl9aXG59IGZyb20gJy4uLy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi8uLi9jb25maWcvaW5kZXguanMnO1xuXG5jb25zdCBtYXRoID0gZGF0YS5tYXRoO1xuY29uc3QgbGltaXRzID0gbWF0aC5saW1pdHM7XG5cbmNvbnN0IGRlZmF1bHRzID0gZGF0YS5kZWZhdWx0cztcblxuY29uc3QgZGVmYXVsdENNWUsgPSBkZWZhdWx0cy5jb2xvcnMuY215aztcbmNvbnN0IGRlZmF1bHRIZXggPSBkZWZhdWx0cy5jb2xvcnMuaGV4O1xuY29uc3QgZGVmYXVsdEhTTCA9IGRlZmF1bHRzLmNvbG9ycy5oc2w7XG5jb25zdCBkZWZhdWx0SFNWID0gZGVmYXVsdHMuY29sb3JzLmhzdjtcbmNvbnN0IGRlZmF1bHRMQUIgPSBkZWZhdWx0cy5jb2xvcnMubGFiO1xuY29uc3QgZGVmYXVsdFJHQiA9IGRlZmF1bHRzLmNvbG9ycy5yZ2I7XG5jb25zdCBkZWZhdWx0U0wgPSBkZWZhdWx0cy5jb2xvcnMuc2w7XG5jb25zdCBkZWZhdWx0U1YgPSBkZWZhdWx0cy5jb2xvcnMuc3Y7XG5jb25zdCBkZWZhdWx0WFlaID0gZGVmYXVsdHMuY29sb3JzLnh5ejtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbG9ySGVscGVycyhcblx0c2VydmljZXM6IFNlcnZpY2VzSW50ZXJmYWNlLFxuXHR1dGlsczogVXRpbGl0aWVzSW50ZXJmYWNlXG4pOiBDb2xvckhlbHBlcnNJbnRlcmZhY2Uge1xuXHRjb25zdCB7IGxvZyB9ID0gc2VydmljZXM7XG5cblx0ZnVuY3Rpb24gY215a1RvUkdCKGNteWs6IENNWUspOiBSR0Ige1xuXHRcdHRyeSB7XG5cdFx0XHRpZiAoIXV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWUoY215aykpIHtcblx0XHRcdFx0bG9nKGBJbnZhbGlkIENNWUsgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjbXlrKX1gLCAnZXJyb3InKTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdFJHQjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY2xvbmVkQ01ZSyA9IHV0aWxzLmNvcmUuY2xvbmUoY215ayk7XG5cdFx0XHRjb25zdCByID1cblx0XHRcdFx0MjU1ICpcblx0XHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLmN5YW4gLyAxMDApICpcblx0XHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLmtleSAvIDEwMCk7XG5cdFx0XHRjb25zdCBnID1cblx0XHRcdFx0MjU1ICpcblx0XHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLm1hZ2VudGEgLyAxMDApICpcblx0XHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLmtleSAvIDEwMCk7XG5cdFx0XHRjb25zdCBiID1cblx0XHRcdFx0MjU1ICpcblx0XHRcdFx0KDEgLSBjbG9uZWRDTVlLLnZhbHVlLnllbGxvdyAvIDEwMCkgKlxuXHRcdFx0XHQoMSAtIGNsb25lZENNWUsudmFsdWUua2V5IC8gMTAwKTtcblx0XHRcdGNvbnN0IHJnYjogUkdCID0ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHJlZDogdXRpbHMuYnJhbmQuYXNCeXRlUmFuZ2UodXRpbHMuc2FuaXRpemUucGVyY2VudGlsZShyKSksXG5cdFx0XHRcdFx0Z3JlZW46IHV0aWxzLmJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0dXRpbHMuc2FuaXRpemUucGVyY2VudGlsZShnKVxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0Ymx1ZTogdXRpbHMuYnJhbmQuYXNCeXRlUmFuZ2UodXRpbHMuc2FuaXRpemUucGVyY2VudGlsZShiKSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIHV0aWxzLmFkanVzdC5jbGFtcFJHQihyZ2IpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRsb2coJ0Vycm9yOiAke2Vycm9yfScsICdlcnJvcicpO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFJHQjtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBoZXhUb0hTTChoZXg6IEhleCk6IEhTTCB7XG5cdFx0dHJ5IHtcblx0XHRcdGlmICghdXRpbHMudmFsaWRhdGUuY29sb3JWYWx1ZShoZXgpKSB7XG5cdFx0XHRcdGxvZyhgSW52YWxpZCBIZXggdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoZXgpfWAsICdlcnJvcicpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0SFNMO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmdiVG9IU0woaGV4VG9SR0IodXRpbHMuY29yZS5jbG9uZShoZXgpKSk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGxvZyhgRXJyb3I6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0SFNMO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGhleFRvUkdCKGhleDogSGV4KTogUkdCIHtcblx0XHR0cnkge1xuXHRcdFx0aWYgKCF1dGlscy52YWxpZGF0ZS5jb2xvclZhbHVlKGhleCkpIHtcblx0XHRcdFx0bG9nKGBJbnZhbGlkIEhleCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhleCl9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRSR0I7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNsb25lZEhleCA9IHV0aWxzLmNvcmUuY2xvbmUoaGV4KTtcblx0XHRcdGNvbnN0IHN0cmlwcGVkSGV4ID1cblx0XHRcdFx0dXRpbHMuZm9ybWF0LnN0cmlwSGFzaEZyb21IZXgoY2xvbmVkSGV4KS52YWx1ZS5oZXg7XG5cdFx0XHRjb25zdCBiaWdpbnQgPSBwYXJzZUludChzdHJpcHBlZEhleCwgMTYpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHJlZDogdXRpbHMuYnJhbmQuYXNCeXRlUmFuZ2UoXG5cdFx0XHRcdFx0XHR1dGlscy5zYW5pdGl6ZS5wZXJjZW50aWxlKChiaWdpbnQgPj4gMTYpICYgMjU1KVxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0Z3JlZW46IHV0aWxzLmJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0dXRpbHMuc2FuaXRpemUucGVyY2VudGlsZSgoYmlnaW50ID4+IDgpICYgMjU1KVxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0Ymx1ZTogdXRpbHMuYnJhbmQuYXNCeXRlUmFuZ2UoXG5cdFx0XHRcdFx0XHR1dGlscy5zYW5pdGl6ZS5wZXJjZW50aWxlKGJpZ2ludCAmIDI1NSlcblx0XHRcdFx0XHQpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdH07XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGxvZyhgRXJyb3I6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0UkdCO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGhzbFRvTEFCKGhzbDogSFNMKTogTEFCIHtcblx0XHR0cnkge1xuXHRcdFx0aWYgKCF1dGlscy52YWxpZGF0ZS5jb2xvclZhbHVlKGhzbCkpIHtcblx0XHRcdFx0bG9nKGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRMQUI7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB4eXpUb0xBQihyZ2JUb1hZWihoc2xUb1JHQih1dGlscy5jb3JlLmNsb25lKGhzbCkpKSk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGxvZyhgRXJyb3I6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0TEFCO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGhzbFRvUkdCKGhzbDogSFNMKTogUkdCIHtcblx0XHR0cnkge1xuXHRcdFx0aWYgKCF1dGlscy52YWxpZGF0ZS5jb2xvclZhbHVlKGhzbCkpIHtcblx0XHRcdFx0bG9nKGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzbCl9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRSR0I7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNsb25lZEhTTCA9IHV0aWxzLmNvcmUuY2xvbmUoaHNsKTtcblx0XHRcdGNvbnN0IGh1ZSA9IGNsb25lZEhTTC52YWx1ZS5odWUgLyAzNjA7XG5cblx0XHRcdGNvbnN0IHMgPSBjbG9uZWRIU0wudmFsdWUuc2F0dXJhdGlvbiAvIDEwMDtcblx0XHRcdGNvbnN0IGwgPSBjbG9uZWRIU0wudmFsdWUubGlnaHRuZXNzIC8gMTAwO1xuXHRcdFx0Y29uc3QgcSA9IGwgPCAwLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHM7XG5cdFx0XHRjb25zdCBwID0gMiAqIGwgLSBxO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHJlZDogdXRpbHMuYnJhbmQuYXNCeXRlUmFuZ2UoXG5cdFx0XHRcdFx0XHR1dGlscy5zYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHR1dGlscy5jb2xvci5odWVUb1JHQihwLCBxLCBodWUgKyAxIC8gMykgKiAyNTVcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdGdyZWVuOiB1dGlscy5icmFuZC5hc0J5dGVSYW5nZShcblx0XHRcdFx0XHRcdHV0aWxzLnNhbml0aXplLnBlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdHV0aWxzLmNvbG9yLmh1ZVRvUkdCKHAsIHEsIGh1ZSkgKiAyNTVcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdGJsdWU6IHV0aWxzLmJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0dXRpbHMuc2FuaXRpemUucGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0dXRpbHMuY29sb3IuaHVlVG9SR0IocCwgcSwgaHVlIC0gMSAvIDMpICogMjU1XG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHR9O1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRsb2coYEVycm9yOiAke2Vycm9yfWAsICdlcnJvcicpO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFJHQjtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBoc3ZUb1NWKGhzdjogSFNWKTogU1Yge1xuXHRcdHRyeSB7XG5cdFx0XHRpZiAoIXV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWUoaHN2KSkge1xuXHRcdFx0XHRsb2coYEludmFsaWQgSFNWIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHN2KX1gLCAnZXJyb3InKTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdFNWO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNhdHVyYXRpb246IGhzdi52YWx1ZS5zYXR1cmF0aW9uLFxuXHRcdFx0XHRcdHZhbHVlOiBoc3YudmFsdWUudmFsdWVcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnc3YnIGFzICdzdidcblx0XHRcdH07XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGxvZyhgRXJyb3I6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0U1Y7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gbGFiVG9SR0IobGFiOiBMQUIpOiBSR0Ige1xuXHRcdHRyeSB7XG5cdFx0XHRpZiAoIXV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWUobGFiKSkge1xuXHRcdFx0XHRsb2coYEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gLCAnZXJyb3InKTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdFJHQjtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHh5elRvUkdCKGxhYlRvWFlaKHV0aWxzLmNvcmUuY2xvbmUobGFiKSkpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRsb2coYEVycm9yOiAke2Vycm9yfWAsICdlcnJvcicpO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFJHQjtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBsYWJUb1hZWihsYWI6IExBQik6IFhZWiB7XG5cdFx0dHJ5IHtcblx0XHRcdGlmICghdXRpbHMudmFsaWRhdGUuY29sb3JWYWx1ZShsYWIpKSB7XG5cdFx0XHRcdGxvZyhgSW52YWxpZCBMQUIgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShsYWIpfWAsICdlcnJvcicpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0WFlaO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjbG9uZWRMQUIgPSB1dGlscy5jb3JlLmNsb25lKGxhYik7XG5cdFx0XHRjb25zdCByZWZYID0gOTUuMDQ3LFxuXHRcdFx0XHRyZWZZID0gMTAwLjAsXG5cdFx0XHRcdHJlZlogPSAxMDguODgzO1xuXG5cdFx0XHRsZXQgeSA9IChjbG9uZWRMQUIudmFsdWUubCArIDE2KSAvIDExNjtcblx0XHRcdGxldCB4ID0gY2xvbmVkTEFCLnZhbHVlLmEgLyA1MDAgKyB5O1xuXHRcdFx0bGV0IHogPSB5IC0gY2xvbmVkTEFCLnZhbHVlLmIgLyAyMDA7XG5cblx0XHRcdGNvbnN0IHBvdyA9IE1hdGgucG93O1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHg6IHV0aWxzLmJyYW5kLmFzWFlaX1goXG5cdFx0XHRcdFx0XHR1dGlscy5zYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRyZWZYICpcblx0XHRcdFx0XHRcdFx0XHQocG93KHgsIDMpID4gMC4wMDg4NTZcblx0XHRcdFx0XHRcdFx0XHRcdD8gcG93KHgsIDMpXG5cdFx0XHRcdFx0XHRcdFx0XHQ6ICh4IC0gMTYgLyAxMTYpIC8gNy43ODcpXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0XHR5OiB1dGlscy5icmFuZC5hc1hZWl9ZKFxuXHRcdFx0XHRcdFx0dXRpbHMuc2FuaXRpemUucGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0cmVmWSAqXG5cdFx0XHRcdFx0XHRcdFx0KHBvdyh5LCAzKSA+IDAuMDA4ODU2XG5cdFx0XHRcdFx0XHRcdFx0XHQ/IHBvdyh5LCAzKVxuXHRcdFx0XHRcdFx0XHRcdFx0OiAoeSAtIDE2IC8gMTE2KSAvIDcuNzg3KVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0ejogdXRpbHMuYnJhbmQuYXNYWVpfWihcblx0XHRcdFx0XHRcdHV0aWxzLnNhbml0aXplLnBlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdHJlZlogKlxuXHRcdFx0XHRcdFx0XHRcdChwb3coeiwgMykgPiAwLjAwODg1NlxuXHRcdFx0XHRcdFx0XHRcdFx0PyBwb3coeiwgMylcblx0XHRcdFx0XHRcdFx0XHRcdDogKHogLSAxNiAvIDExNikgLyA3Ljc4Nylcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHRcdH07XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGxvZyhgRXJyb3I6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0WFlaO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHJnYlRvQ01ZSyhyZ2I6IFJHQik6IENNWUsge1xuXHRcdHRyeSB7XG5cdFx0XHRpZiAoIXV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWUocmdiKSkge1xuXHRcdFx0XHRsb2coYEludmFsaWQgUkdCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkocmdiKX1gLCAnZXJyb3InKTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdENNWUs7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGNsb25lZFJHQiA9IHV0aWxzLmNvcmUuY2xvbmUocmdiKTtcblxuXHRcdFx0Y29uc3QgcmVkUHJpbWUgPSBjbG9uZWRSR0IudmFsdWUucmVkIC8gMjU1O1xuXHRcdFx0Y29uc3QgZ3JlZW5QcmltZSA9IGNsb25lZFJHQi52YWx1ZS5ncmVlbiAvIDI1NTtcblx0XHRcdGNvbnN0IGJsdWVQcmltZSA9IGNsb25lZFJHQi52YWx1ZS5ibHVlIC8gMjU1O1xuXG5cdFx0XHRjb25zdCBrZXkgPSB1dGlscy5zYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0XHR1dGlscy5zYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0XHRcdDEgLSBNYXRoLm1heChyZWRQcmltZSwgZ3JlZW5QcmltZSwgYmx1ZVByaW1lKVxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgY3lhbiA9IHV0aWxzLnNhbml0aXplLnBlcmNlbnRpbGUoXG5cdFx0XHRcdHV0aWxzLnNhbml0aXplLnBlcmNlbnRpbGUoKDEgLSByZWRQcmltZSAtIGtleSkgLyAoMSAtIGtleSkgfHwgMClcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBtYWdlbnRhID0gdXRpbHMuc2FuaXRpemUucGVyY2VudGlsZShcblx0XHRcdFx0dXRpbHMuc2FuaXRpemUucGVyY2VudGlsZShcblx0XHRcdFx0XHQoMSAtIGdyZWVuUHJpbWUgLSBrZXkpIC8gKDEgLSBrZXkpIHx8IDBcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IHllbGxvdyA9IHV0aWxzLnNhbml0aXplLnBlcmNlbnRpbGUoXG5cdFx0XHRcdHV0aWxzLnNhbml0aXplLnBlcmNlbnRpbGUoXG5cdFx0XHRcdFx0KDEgLSBibHVlUHJpbWUgLSBrZXkpIC8gKDEgLSBrZXkpIHx8IDBcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IGZvcm1hdDogJ2NteWsnID0gJ2NteWsnO1xuXG5cdFx0XHRjb25zdCBjbXlrID0geyB2YWx1ZTogeyBjeWFuLCBtYWdlbnRhLCB5ZWxsb3csIGtleSB9LCBmb3JtYXQgfTtcblxuXHRcdFx0bG9nKFxuXHRcdFx0XHRgQ29udmVydGVkIFJHQiAke0pTT04uc3RyaW5naWZ5KGNsb25lZFJHQil9IHRvIENNWUs6ICR7SlNPTi5zdHJpbmdpZnkodXRpbHMuY29yZS5jbG9uZShjbXlrKSl9YCxcblx0XHRcdFx0J2RlYnVnJyxcblx0XHRcdFx0NVxuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIGNteWs7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGxvZyhgRXJyb3I6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0Q01ZSztcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZ2JUb0hleChyZ2I6IFJHQik6IEhleCB7XG5cdFx0Y29uc3QgbG9nID0gc2VydmljZXMubG9nO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGlmICghdXRpbHMudmFsaWRhdGUuY29sb3JWYWx1ZShyZ2IpKSB7XG5cdFx0XHRcdGxvZyhgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWAsICdlcnJvcicpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0SGV4O1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjbG9uZWRSR0IgPSB1dGlscy5jb3JlLmNsb25lKHJnYik7XG5cblx0XHRcdGlmIChcblx0XHRcdFx0W1xuXHRcdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5yZWQsXG5cdFx0XHRcdFx0Y2xvbmVkUkdCLnZhbHVlLmdyZWVuLFxuXHRcdFx0XHRcdGNsb25lZFJHQi52YWx1ZS5ibHVlXG5cdFx0XHRcdF0uc29tZSh2ID0+IGlzTmFOKHYpIHx8IHYgPCAwIHx8IHYgPiAyNTUpXG5cdFx0XHQpIHtcblx0XHRcdFx0bG9nKFxuXHRcdFx0XHRcdGBJbnZhbGlkIFJHQiB2YWx1ZXM6XFxuUj0ke0pTT04uc3RyaW5naWZ5KGNsb25lZFJHQi52YWx1ZS5yZWQpfVxcbkc9JHtKU09OLnN0cmluZ2lmeShjbG9uZWRSR0IudmFsdWUuZ3JlZW4pfVxcbkI9JHtKU09OLnN0cmluZ2lmeShjbG9uZWRSR0IudmFsdWUuYmx1ZSl9YCxcblx0XHRcdFx0XHQnZXJyb3InXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aGV4OiB1dGlscy5icmFuZC5hc0hleFNldCgnIzAwMDAwMEZGJylcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hleCcgYXMgJ2hleCdcblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRoZXg6IHV0aWxzLmJyYW5kLmFzSGV4U2V0KFxuXHRcdFx0XHRcdFx0YCMke3V0aWxzLmZvcm1hdC5jb21wb25lbnRUb0hleChjbG9uZWRSR0IudmFsdWUucmVkKX0ke3V0aWxzLmZvcm1hdC5jb21wb25lbnRUb0hleChjbG9uZWRSR0IudmFsdWUuZ3JlZW4pfSR7dXRpbHMuZm9ybWF0LmNvbXBvbmVudFRvSGV4KGNsb25lZFJHQi52YWx1ZS5ibHVlKX1gXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoZXgnIGFzICdoZXgnXG5cdFx0XHR9O1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRsb2coYEVycm9yOiAke2Vycm9yfWAsICdlcnJvcicpO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEhleDtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZ2JUb0hTTChyZ2I6IFJHQik6IEhTTCB7XG5cdFx0dHJ5IHtcblx0XHRcdGlmICghdXRpbHMudmFsaWRhdGUuY29sb3JWYWx1ZShyZ2IpKSB7XG5cdFx0XHRcdGxvZyhgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWAsICdlcnJvcicpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0SFNMO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjbG9uZWRSR0IgPSB1dGlscy5jb3JlLmNsb25lKHJnYik7XG5cblx0XHRcdGNvbnN0IHJlZCA9IChjbG9uZWRSR0IudmFsdWUucmVkIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblx0XHRcdGNvbnN0IGdyZWVuID0gKGNsb25lZFJHQi52YWx1ZS5ncmVlbiBhcyB1bmtub3duIGFzIG51bWJlcikgLyAyNTU7XG5cdFx0XHRjb25zdCBibHVlID0gKGNsb25lZFJHQi52YWx1ZS5ibHVlIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblxuXHRcdFx0Y29uc3QgbWF4ID0gTWF0aC5tYXgocmVkLCBncmVlbiwgYmx1ZSk7XG5cdFx0XHRjb25zdCBtaW4gPSBNYXRoLm1pbihyZWQsIGdyZWVuLCBibHVlKTtcblxuXHRcdFx0bGV0IGh1ZSA9IDAsXG5cdFx0XHRcdHNhdHVyYXRpb24gPSAwLFxuXHRcdFx0XHRsaWdodG5lc3MgPSAobWF4ICsgbWluKSAvIDI7XG5cblx0XHRcdGlmIChtYXggIT09IG1pbikge1xuXHRcdFx0XHRjb25zdCBkZWx0YSA9IG1heCAtIG1pbjtcblxuXHRcdFx0XHRzYXR1cmF0aW9uID1cblx0XHRcdFx0XHRsaWdodG5lc3MgPiAwLjVcblx0XHRcdFx0XHRcdD8gZGVsdGEgLyAoMiAtIG1heCAtIG1pbilcblx0XHRcdFx0XHRcdDogZGVsdGEgLyAobWF4ICsgbWluKTtcblxuXHRcdFx0XHRzd2l0Y2ggKG1heCkge1xuXHRcdFx0XHRcdGNhc2UgcmVkOlxuXHRcdFx0XHRcdFx0aHVlID0gKGdyZWVuIC0gYmx1ZSkgLyBkZWx0YSArIChncmVlbiA8IGJsdWUgPyA2IDogMCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIGdyZWVuOlxuXHRcdFx0XHRcdFx0aHVlID0gKGJsdWUgLSByZWQpIC8gZGVsdGEgKyAyO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBibHVlOlxuXHRcdFx0XHRcdFx0aHVlID0gKHJlZCAtIGdyZWVuKSAvIGRlbHRhICsgNDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGh1ZSAqPSA2MDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IHV0aWxzLmJyYW5kLmFzUmFkaWFsKHV0aWxzLnNhbml0aXplLnBlcmNlbnRpbGUoaHVlKSksXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogdXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0dXRpbHMuc2FuaXRpemUucGVyY2VudGlsZShzYXR1cmF0aW9uICogMTAwKVxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiB1dGlscy5icmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHR1dGlscy5zYW5pdGl6ZS5wZXJjZW50aWxlKGxpZ2h0bmVzcyAqIDEwMClcblx0XHRcdFx0XHQpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdH07XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGxvZyhgRXJyb3I6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0SFNMO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHJnYlRvSFNWKHJnYjogUkdCKTogSFNWIHtcblx0XHR0cnkge1xuXHRcdFx0aWYgKCF1dGlscy52YWxpZGF0ZS5jb2xvclZhbHVlKHJnYikpIHtcblx0XHRcdFx0bG9nKGBJbnZhbGlkIFJHQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHJnYil9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRIU1Y7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHJlZCA9IChyZ2IudmFsdWUucmVkIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblx0XHRcdGNvbnN0IGdyZWVuID0gKHJnYi52YWx1ZS5ncmVlbiBhcyB1bmtub3duIGFzIG51bWJlcikgLyAyNTU7XG5cdFx0XHRjb25zdCBibHVlID0gKHJnYi52YWx1ZS5ibHVlIGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDI1NTtcblxuXHRcdFx0Y29uc3QgbWF4ID0gTWF0aC5tYXgocmVkLCBncmVlbiwgYmx1ZSk7XG5cdFx0XHRjb25zdCBtaW4gPSBNYXRoLm1pbihyZWQsIGdyZWVuLCBibHVlKTtcblx0XHRcdGNvbnN0IGRlbHRhID0gbWF4IC0gbWluO1xuXG5cdFx0XHRsZXQgaHVlID0gMDtcblxuXHRcdFx0Y29uc3QgdmFsdWUgPSBtYXg7XG5cdFx0XHRjb25zdCBzYXR1cmF0aW9uID0gbWF4ID09PSAwID8gMCA6IGRlbHRhIC8gbWF4O1xuXG5cdFx0XHRpZiAobWF4ICE9PSBtaW4pIHtcblx0XHRcdFx0c3dpdGNoIChtYXgpIHtcblx0XHRcdFx0XHRjYXNlIHJlZDpcblx0XHRcdFx0XHRcdGh1ZSA9IChncmVlbiAtIGJsdWUpIC8gZGVsdGEgKyAoZ3JlZW4gPCBibHVlID8gNiA6IDApO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBncmVlbjpcblx0XHRcdFx0XHRcdGh1ZSA9IChibHVlIC0gcmVkKSAvIGRlbHRhICsgMjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgYmx1ZTpcblx0XHRcdFx0XHRcdGh1ZSA9IChyZWQgLSBncmVlbikgLyBkZWx0YSArIDQ7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGh1ZSAqPSA2MDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IHV0aWxzLmJyYW5kLmFzUmFkaWFsKHV0aWxzLnNhbml0aXplLnBlcmNlbnRpbGUoaHVlKSksXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogdXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0dXRpbHMuc2FuaXRpemUucGVyY2VudGlsZShzYXR1cmF0aW9uICogMTAwKVxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0dmFsdWU6IHV0aWxzLmJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdHV0aWxzLnNhbml0aXplLnBlcmNlbnRpbGUodmFsdWUgKiAxMDApXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHR9O1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRsb2coYEVycm9yOiAke2Vycm9yfWAsICdlcnJvcicpO1xuXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEhTVjtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZ2JUb1hZWihyZ2I6IFJHQik6IFhZWiB7XG5cdFx0dHJ5IHtcblx0XHRcdGlmICghdXRpbHMudmFsaWRhdGUuY29sb3JWYWx1ZShyZ2IpKSB7XG5cdFx0XHRcdGxvZyhgSW52YWxpZCBSR0IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShyZ2IpfWAsICdlcnJvcicpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0WFlaO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBjb252ZXJ0IFJHQiB2YWx1ZXMgdG8gbGluZWFyIHNwYWNlXG5cdFx0XHRjb25zdCByZWQgPSAocmdiLnZhbHVlLnJlZCBhcyBudW1iZXIpIC8gMjU1O1xuXHRcdFx0Y29uc3QgZ3JlZW4gPSAocmdiLnZhbHVlLmdyZWVuIGFzIG51bWJlcikgLyAyNTU7XG5cdFx0XHRjb25zdCBibHVlID0gKHJnYi52YWx1ZS5ibHVlIGFzIG51bWJlcikgLyAyNTU7XG5cblx0XHRcdGNvbnN0IGxpbmVhclJlZCA9XG5cdFx0XHRcdHJlZCA+IDAuMDQwNDVcblx0XHRcdFx0XHQ/IE1hdGgucG93KChyZWQgKyAwLjA1NSkgLyAxLjA1NSwgMi40KVxuXHRcdFx0XHRcdDogcmVkIC8gMTIuOTI7XG5cdFx0XHRjb25zdCBsaW5lYXJHcmVlbiA9XG5cdFx0XHRcdGdyZWVuID4gMC4wNDA0NVxuXHRcdFx0XHRcdD8gTWF0aC5wb3coKGdyZWVuICsgMC4wNTUpIC8gMS4wNTUsIDIuNClcblx0XHRcdFx0XHQ6IGdyZWVuIC8gMTIuOTI7XG5cdFx0XHRjb25zdCBsaW5lYXJCbHVlID1cblx0XHRcdFx0Ymx1ZSA+IDAuMDQwNDVcblx0XHRcdFx0XHQ/IE1hdGgucG93KChibHVlICsgMC4wNTUpIC8gMS4wNTUsIDIuNClcblx0XHRcdFx0XHQ6IGJsdWUgLyAxMi45MjtcblxuXHRcdFx0Ly8gc2NhbGUgdG8gMTAwXG5cdFx0XHRjb25zdCBzY2FsZWRSZWQgPSBsaW5lYXJSZWQgKiAxMDA7XG5cdFx0XHRjb25zdCBzY2FsZWRHcmVlbiA9IGxpbmVhckdyZWVuICogMTAwO1xuXHRcdFx0Y29uc3Qgc2NhbGVkQmx1ZSA9IGxpbmVhckJsdWUgKiAxMDA7XG5cblx0XHRcdGNvbnN0IHggPSB1dGlscy5icmFuZC5hc1hZWl9YKFxuXHRcdFx0XHR1dGlscy5hZGp1c3QuY2xhbXBYWVooXG5cdFx0XHRcdFx0c2NhbGVkUmVkICogMC40MTI0ICtcblx0XHRcdFx0XHRcdHNjYWxlZEdyZWVuICogMC4zNTc2ICtcblx0XHRcdFx0XHRcdHNjYWxlZEJsdWUgKiAwLjE4MDUsXG5cdFx0XHRcdFx0bGltaXRzLm1heFhcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IHkgPSB1dGlscy5icmFuZC5hc1hZWl9ZKFxuXHRcdFx0XHR1dGlscy5hZGp1c3QuY2xhbXBYWVooXG5cdFx0XHRcdFx0c2NhbGVkUmVkICogMC4yMTI2ICtcblx0XHRcdFx0XHRcdHNjYWxlZEdyZWVuICogMC43MTUyICtcblx0XHRcdFx0XHRcdHNjYWxlZEJsdWUgKiAwLjA3MjIsXG5cdFx0XHRcdFx0bGltaXRzLm1heFlcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IHogPSB1dGlscy5icmFuZC5hc1hZWl9aKFxuXHRcdFx0XHR1dGlscy5hZGp1c3QuY2xhbXBYWVooXG5cdFx0XHRcdFx0c2NhbGVkUmVkICogMC4wMTkzICtcblx0XHRcdFx0XHRcdHNjYWxlZEdyZWVuICogMC4xMTkyICtcblx0XHRcdFx0XHRcdHNjYWxlZEJsdWUgKiAwLjk1MDUsXG5cdFx0XHRcdFx0bGltaXRzLm1heFpcblx0XHRcdFx0KVxuXHRcdFx0KTtcblxuXHRcdFx0Y29uc3QgeHl6OiBYWVogPSB7IHZhbHVlOiB7IHgsIHksIHogfSwgZm9ybWF0OiAneHl6JyB9O1xuXG5cdFx0XHRyZXR1cm4gdXRpbHMudmFsaWRhdGUuY29sb3JWYWx1ZSh4eXopID8geHl6IDogZGVmYXVsdFhZWjtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0bG9nKGBFcnJvcjogJHtlcnJvcn1gLCAnZXJyb3InKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRYWVo7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24geHl6VG9MQUIoeHl6OiBYWVopOiBMQUIge1xuXHRcdHRyeSB7XG5cdFx0XHRpZiAoIXV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWUoeHl6KSkge1xuXHRcdFx0XHRsb2coYEludmFsaWQgWFlaIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoeHl6KX1gLCAnZXJyb3InKTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdExBQjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY2xvbmVkWFlaID0gdXRpbHMuY29yZS5jbG9uZSh4eXopO1xuXHRcdFx0Y29uc3QgcmVmWCA9IGxpbWl0cy5tYXhYLFxuXHRcdFx0XHRyZWZZID0gbGltaXRzLm1heFksXG5cdFx0XHRcdHJlZlogPSBsaW1pdHMubWF4WjtcblxuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnggPSB1dGlscy5hZGp1c3Qubm9ybWFsaXplWFlaKFxuXHRcdFx0XHRjbG9uZWRYWVoudmFsdWUueCxcblx0XHRcdFx0cmVmWFxuXHRcdFx0KSBhcyBYWVpfWDtcblx0XHRcdGNsb25lZFhZWi52YWx1ZS55ID0gdXRpbHMuYWRqdXN0Lm5vcm1hbGl6ZVhZWihcblx0XHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnksXG5cdFx0XHRcdHJlZllcblx0XHRcdCkgYXMgWFlaX1k7XG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueiA9IHV0aWxzLmFkanVzdC5ub3JtYWxpemVYWVooXG5cdFx0XHRcdGNsb25lZFhZWi52YWx1ZS56LFxuXHRcdFx0XHRyZWZaXG5cdFx0XHQpIGFzIFhZWl9aO1xuXG5cdFx0XHRjbG9uZWRYWVoudmFsdWUueCA9XG5cdFx0XHRcdGNsb25lZFhZWi52YWx1ZS54ID4gMC4wMDg4NTZcblx0XHRcdFx0XHQ/IChNYXRoLnBvdyhjbG9uZWRYWVoudmFsdWUueCwgMSAvIDMpIGFzIFhZWl9YKVxuXHRcdFx0XHRcdDogKCg3Ljc4NyAqIGNsb25lZFhZWi52YWx1ZS54ICsgMTYgLyAxMTYpIGFzIFhZWl9YKTtcblx0XHRcdGNsb25lZFhZWi52YWx1ZS55ID1cblx0XHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnkgPiAwLjAwODg1NlxuXHRcdFx0XHRcdD8gKE1hdGgucG93KGNsb25lZFhZWi52YWx1ZS55LCAxIC8gMykgYXMgWFlaX1kpXG5cdFx0XHRcdFx0OiAoKDcuNzg3ICogY2xvbmVkWFlaLnZhbHVlLnkgKyAxNiAvIDExNikgYXMgWFlaX1kpO1xuXHRcdFx0Y2xvbmVkWFlaLnZhbHVlLnogPVxuXHRcdFx0XHRjbG9uZWRYWVoudmFsdWUueiA+IDAuMDA4ODU2XG5cdFx0XHRcdFx0PyAoTWF0aC5wb3coY2xvbmVkWFlaLnZhbHVlLnosIDEgLyAzKSBhcyBYWVpfWilcblx0XHRcdFx0XHQ6ICgoNy43ODcgKiBjbG9uZWRYWVoudmFsdWUueiArIDE2IC8gMTE2KSBhcyBYWVpfWik7XG5cblx0XHRcdGNvbnN0IGwgPSB1dGlscy5zYW5pdGl6ZS5wZXJjZW50aWxlKFxuXHRcdFx0XHRwYXJzZUZsb2F0KCgxMTYgKiBjbG9uZWRYWVoudmFsdWUueSAtIDE2KS50b0ZpeGVkKDIpKVxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IGEgPSB1dGlscy5zYW5pdGl6ZS5sYWIoXG5cdFx0XHRcdHBhcnNlRmxvYXQoXG5cdFx0XHRcdFx0KDUwMCAqIChjbG9uZWRYWVoudmFsdWUueCAtIGNsb25lZFhZWi52YWx1ZS55KSkudG9GaXhlZCgyKVxuXHRcdFx0XHQpLFxuXHRcdFx0XHQnYSdcblx0XHRcdCk7XG5cdFx0XHRjb25zdCBiID0gdXRpbHMuc2FuaXRpemUubGFiKFxuXHRcdFx0XHRwYXJzZUZsb2F0KFxuXHRcdFx0XHRcdCgyMDAgKiAoY2xvbmVkWFlaLnZhbHVlLnkgLSBjbG9uZWRYWVoudmFsdWUueikpLnRvRml4ZWQoMilcblx0XHRcdFx0KSxcblx0XHRcdFx0J2InXG5cdFx0XHQpO1xuXG5cdFx0XHRjb25zdCBsYWI6IExBQiA9IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRsOiB1dGlscy5icmFuZC5hc0xBQl9MKHV0aWxzLnNhbml0aXplLnBlcmNlbnRpbGUobCkpLFxuXHRcdFx0XHRcdGE6IHV0aWxzLmJyYW5kLmFzTEFCX0EodXRpbHMuc2FuaXRpemUucGVyY2VudGlsZShhKSksXG5cdFx0XHRcdFx0YjogdXRpbHMuYnJhbmQuYXNMQUJfQih1dGlscy5zYW5pdGl6ZS5wZXJjZW50aWxlKGIpKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIXV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWUobGFiKSkge1xuXHRcdFx0XHRsb2coYEludmFsaWQgTEFCIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkobGFiKX1gLCAnZXJyb3InKTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdExBQjtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGxhYjtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0bG9nKGBFcnJvcjogJHtlcnJvcn1gLCAnZXJyb3InKTtcblxuXHRcdFx0cmV0dXJuIGRlZmF1bHRMQUI7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24geHl6VG9SR0IoeHl6OiBYWVopOiBSR0Ige1xuXHRcdHRyeSB7XG5cdFx0XHRpZiAoIXV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWUoeHl6KSkge1xuXHRcdFx0XHRsb2coYEludmFsaWQgWFlaIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoeHl6KX1gLCAnZXJyb3InKTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdFJHQjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgeCA9ICh4eXoudmFsdWUueCBhcyB1bmtub3duIGFzIG51bWJlcikgLyAxMDA7XG5cdFx0XHRjb25zdCB5ID0gKHh5ei52YWx1ZS55IGFzIHVua25vd24gYXMgbnVtYmVyKSAvIDEwMDtcblx0XHRcdGNvbnN0IHogPSAoeHl6LnZhbHVlLnogYXMgdW5rbm93biBhcyBudW1iZXIpIC8gMTAwO1xuXG5cdFx0XHRsZXQgcmVkID0geCAqIDMuMjQwNiArIHkgKiAtMS41MzcyICsgeiAqIC0wLjQ5ODY7XG5cdFx0XHRsZXQgZ3JlZW4gPSB4ICogLTAuOTY4OSArIHkgKiAxLjg3NTggKyB6ICogMC4wNDE1O1xuXHRcdFx0bGV0IGJsdWUgPSB4ICogMC4wNTU3ICsgeSAqIC0wLjIwNCArIHogKiAxLjA1NztcblxuXHRcdFx0cmVkID0gdXRpbHMuYWRqdXN0LmFwcGx5R2FtbWFDb3JyZWN0aW9uKHJlZCk7XG5cdFx0XHRncmVlbiA9IHV0aWxzLmFkanVzdC5hcHBseUdhbW1hQ29ycmVjdGlvbihncmVlbik7XG5cdFx0XHRibHVlID0gdXRpbHMuYWRqdXN0LmFwcGx5R2FtbWFDb3JyZWN0aW9uKGJsdWUpO1xuXG5cdFx0XHRjb25zdCByZ2I6IFJHQiA9IHV0aWxzLmFkanVzdC5jbGFtcFJHQih7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0cmVkOiB1dGlscy5icmFuZC5hc0J5dGVSYW5nZShcblx0XHRcdFx0XHRcdHV0aWxzLnNhbml0aXplLnBlcmNlbnRpbGUocmVkKVxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0Z3JlZW46IHV0aWxzLmJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0dXRpbHMuc2FuaXRpemUucGVyY2VudGlsZShncmVlbilcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdGJsdWU6IHV0aWxzLmJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0dXRpbHMuc2FuaXRpemUucGVyY2VudGlsZShibHVlKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiByZ2I7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGxvZyhgRXJyb3I6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdHJldHVybiBkZWZhdWx0UkdCO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7XG5cdFx0Y215a1RvUkdCLFxuXHRcdGhleFRvSFNMLFxuXHRcdGhleFRvUkdCLFxuXHRcdGhzbFRvTEFCLFxuXHRcdGhzbFRvUkdCLFxuXHRcdGhzdlRvU1YsXG5cdFx0bGFiVG9SR0IsXG5cdFx0bGFiVG9YWVosXG5cdFx0cmdiVG9DTVlLLFxuXHRcdHJnYlRvSGV4LFxuXHRcdHJnYlRvSFNMLFxuXHRcdHJnYlRvSFNWLFxuXHRcdHJnYlRvWFlaLFxuXHRcdHh5elRvUkdCLFxuXHRcdHh5elRvTEFCLFxuXHRcdGNteWtUb0hTTChjbXlrOiBDTVlLKTogSFNMIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmICghdXRpbHMudmFsaWRhdGUuY29sb3JWYWx1ZShjbXlrKSkge1xuXHRcdFx0XHRcdGxvZyhgSW52YWxpZCBDTVlLIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY215ayl9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0XHRyZXR1cm4gZGVmYXVsdEhTTDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiByZ2JUb0hTTChjbXlrVG9SR0IodXRpbHMuY29yZS5jbG9uZShjbXlrKSkpO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0bG9nKGBFcnJvcjogJHtlcnJvcn1gLCAnZXJyb3InKTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdEhTTDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGhleFRvSFNMV3JhcHBlcihpbnB1dDogc3RyaW5nIHwgSGV4KTogSFNMIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IGNsb25lZElucHV0ID0gdXRpbHMuY29yZS5jbG9uZShpbnB1dCk7XG5cblx0XHRcdFx0Y29uc3QgaGV4OiBIZXggPVxuXHRcdFx0XHRcdHR5cGVvZiBjbG9uZWRJbnB1dCA9PT0gJ3N0cmluZydcblx0XHRcdFx0XHRcdD8ge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRoZXg6IHV0aWxzLmJyYW5kLmFzSGV4U2V0KGNsb25lZElucHV0KVxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQ6IHtcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHRcdFx0aGV4OiB1dGlscy5icmFuZC5hc0hleFNldChcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2xvbmVkSW5wdXQudmFsdWUuaGV4XG5cdFx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdHJldHVybiBoZXhUb0hTTChoZXgpO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0bG9nKGBFcnJvcjogJHtlcnJvcn1gLCAnZXJyb3InKTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdEhTTDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGhzbFRvQ01ZSyhoc2w6IEhTTCk6IENNWUsge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKCF1dGlscy52YWxpZGF0ZS5jb2xvclZhbHVlKGhzbCkpIHtcblx0XHRcdFx0XHRsb2coYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gLCAnZXJyb3InKTtcblxuXHRcdFx0XHRcdHJldHVybiBkZWZhdWx0Q01ZSztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiByZ2JUb0NNWUsoaHNsVG9SR0IodXRpbHMuY29yZS5jbG9uZShoc2wpKSk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRsb2coXG5cdFx0XHRcdFx0YEVycm9yIGNvbnZlcnRpbmcgSFNMICR7SlNPTi5zdHJpbmdpZnkoaHNsKX0gdG8gQ01ZSzogJHtlcnJvcn1gLFxuXHRcdFx0XHRcdCdlcnJvcidcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdENNWUs7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoc2xUb0hleChoc2w6IEhTTCk6IEhleCB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRpZiAoIXV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWUoaHNsKSkge1xuXHRcdFx0XHRcdGxvZyhgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWAsICdlcnJvcicpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIGRlZmF1bHRIZXg7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gcmdiVG9IZXgoaHNsVG9SR0IodXRpbHMuY29yZS5jbG9uZShoc2wpKSk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRsb2coYEVycm9yOiAke2Vycm9yfWAsICdlcnJvcicpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0SGV4O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aHNsVG9IU1YoaHNsOiBIU0wpOiBIU1Yge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKCF1dGlscy52YWxpZGF0ZS5jb2xvclZhbHVlKGhzbCkpIHtcblx0XHRcdFx0XHRsb2coYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gLCAnZXJyb3InKTtcblxuXHRcdFx0XHRcdHJldHVybiBkZWZhdWx0SFNWO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgY2xvbmVkSFNMID0gdXRpbHMuY29yZS5jbG9uZShoc2wpO1xuXHRcdFx0XHRjb25zdCBzID0gY2xvbmVkSFNMLnZhbHVlLnNhdHVyYXRpb24gLyAxMDA7XG5cdFx0XHRcdGNvbnN0IGwgPSBjbG9uZWRIU0wudmFsdWUubGlnaHRuZXNzIC8gMTAwO1xuXHRcdFx0XHRjb25zdCB2YWx1ZSA9IGwgKyBzICogTWF0aC5taW4obCwgMSAtIDEpO1xuXHRcdFx0XHRjb25zdCBuZXdTYXR1cmF0aW9uID0gdmFsdWUgPT09IDAgPyAwIDogMiAqICgxIC0gbCAvIHZhbHVlKTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRodWU6IHV0aWxzLmJyYW5kLmFzUmFkaWFsKFxuXHRcdFx0XHRcdFx0XHR1dGlscy5zYW5pdGl6ZS5wZXJjZW50aWxlKGNsb25lZEhTTC52YWx1ZS5odWUpXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogdXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHR1dGlscy5zYW5pdGl6ZS5wZXJjZW50aWxlKG5ld1NhdHVyYXRpb24gKiAxMDApXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0dmFsdWU6IHV0aWxzLmJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0dXRpbHMuc2FuaXRpemUucGVyY2VudGlsZSh2YWx1ZSAqIDEwMClcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdFx0fTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGxvZyhgRXJyb3I6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRIU1Y7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoc2xUb1NMKGhzbDogSFNMKTogU0wge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKCF1dGlscy52YWxpZGF0ZS5jb2xvclZhbHVlKGhzbCkpIHtcblx0XHRcdFx0XHRsb2coYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gLCAnZXJyb3InKTtcblxuXHRcdFx0XHRcdHJldHVybiBkZWZhdWx0U0w7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBoc2wudmFsdWUuc2F0dXJhdGlvbixcblx0XHRcdFx0XHRcdGxpZ2h0bmVzczogaHNsLnZhbHVlLmxpZ2h0bmVzc1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnc2wnIGFzICdzbCdcblx0XHRcdFx0fTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGxvZyhgRXJyb3I6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRTTDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGhzbFRvU1YoaHNsOiBIU0wpOiBTViB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRpZiAoIXV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWUoaHNsKSkge1xuXHRcdFx0XHRcdGxvZyhgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShoc2wpfWAsICdlcnJvcicpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIGRlZmF1bHRTVjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBoc3ZUb1NWKHJnYlRvSFNWKGhzbFRvUkdCKHV0aWxzLmNvcmUuY2xvbmUoaHNsKSkpKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGxvZyhgRXJyb3I6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRTVjtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGhzbFRvWFlaKGhzbDogSFNMKTogWFlaIHtcblx0XHRcdGNvbnN0IGxvZyA9IHNlcnZpY2VzLmxvZztcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKCF1dGlscy52YWxpZGF0ZS5jb2xvclZhbHVlKGhzbCkpIHtcblx0XHRcdFx0XHRsb2coYEludmFsaWQgSFNMIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoaHNsKX1gLCAnZXJyb3InKTtcblxuXHRcdFx0XHRcdHJldHVybiBkZWZhdWx0WFlaO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGxhYlRvWFlaKGhzbFRvTEFCKHV0aWxzLmNvcmUuY2xvbmUoaHNsKSkpO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0bG9nKGBoc2xUb1hZWiBlcnJvcjogJHtlcnJvcn1gLCAnZXJyb3InKTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdFhZWjtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGhzdlRvSFNMKGhzdjogSFNWKTogSFNMIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmICghdXRpbHMudmFsaWRhdGUuY29sb3JWYWx1ZShoc3YpKSB7XG5cdFx0XHRcdFx0bG9nKGBJbnZhbGlkIEhTViB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGhzdil9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0XHRyZXR1cm4gZGVmYXVsdEhTTDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IGNsb25lZEhTViA9IHV0aWxzLmNvcmUuY2xvbmUoaHN2KTtcblxuXHRcdFx0XHRjb25zdCBzID0gY2xvbmVkSFNWLnZhbHVlLnNhdHVyYXRpb24gLyAxMDA7XG5cdFx0XHRcdGNvbnN0IHYgPSBjbG9uZWRIU1YudmFsdWUudmFsdWUgLyAxMDA7XG5cdFx0XHRcdGNvbnN0IGwgPSB2ICogKDEgLSBzIC8gMik7XG5cblx0XHRcdFx0Y29uc3QgbmV3U2F0dXJhdGlvbiA9XG5cdFx0XHRcdFx0bCA9PT0gMCB8fCBsID09PSAxID8gMCA6ICh2IC0gbCkgLyBNYXRoLm1pbihsLCAxIC0gbCk7XG5cdFx0XHRcdGNvbnN0IGxpZ2h0bmVzcyA9XG5cdFx0XHRcdFx0Y2xvbmVkSFNWLnZhbHVlLnZhbHVlICpcblx0XHRcdFx0XHQoMSAtIGNsb25lZEhTVi52YWx1ZS5zYXR1cmF0aW9uIC8gMjAwKTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRodWU6IHV0aWxzLmJyYW5kLmFzUmFkaWFsKFxuXHRcdFx0XHRcdFx0XHR1dGlscy5zYW5pdGl6ZS5wZXJjZW50aWxlKGNsb25lZEhTVi52YWx1ZS5odWUpXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogdXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHR1dGlscy5zYW5pdGl6ZS5wZXJjZW50aWxlKG5ld1NhdHVyYXRpb24gKiAxMDApXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0bGlnaHRuZXNzOiB1dGlscy5icmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdHV0aWxzLnNhbml0aXplLnBlcmNlbnRpbGUobGlnaHRuZXNzKVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0bG9nKGBFcnJvcjogJHtlcnJvcn1gLCAnZXJyb3InKTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdEhTTDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGxhYlRvSFNMKGxhYjogTEFCKTogSFNMIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmICghdXRpbHMudmFsaWRhdGUuY29sb3JWYWx1ZShsYWIpKSB7XG5cdFx0XHRcdFx0bG9nKGBJbnZhbGlkIExBQiB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGxhYil9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0XHRyZXR1cm4gZGVmYXVsdEhTTDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiByZ2JUb0hTTChsYWJUb1JHQih1dGlscy5jb3JlLmNsb25lKGxhYikpKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGxvZyhgRXJyb3I6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRIU0w7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR4eXpUb0hTTCh4eXo6IFhZWik6IEhTTCB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRpZiAoIXV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWUoeHl6KSkge1xuXHRcdFx0XHRcdGxvZyhgSW52YWxpZCBYWVogdmFsdWUgJHtKU09OLnN0cmluZ2lmeSh4eXopfWAsICdlcnJvcicpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIGRlZmF1bHRIU0w7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gcmdiVG9IU0woeHl6VG9SR0IodXRpbHMuY29yZS5jbG9uZSh4eXopKSk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRsb2coYEVycm9yOiAke2Vycm9yfWAsICdlcnJvcicpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0SFNMO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cbiJdfQ==