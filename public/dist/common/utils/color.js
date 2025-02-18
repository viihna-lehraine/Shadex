import { data } from '../../data/index.js';

// File: common/utils/color.js
const config = data.config;
const defaultColors = data.defaults.colors;
const defaultColorStrings = data.defaults.colors.strings;
function createColorUtils(helpers, services, utils) {
    function convertColorStringToColor(colorString) {
        const clonedColor = utils.core.clone(colorString);
        const parseValue = (value) => typeof value === 'string' && value.endsWith('%')
            ? parseFloat(value.slice(0, -1))
            : Number(value);
        const newValue = Object.entries(clonedColor.value).reduce((acc, [key, val]) => {
            acc[key] = parseValue(val);
            return acc;
        }, {});
        switch (clonedColor.format) {
            case 'cmyk':
                return { format: 'cmyk', value: newValue };
            case 'hsl':
                return { format: 'hsl', value: newValue };
            case 'hsv':
                return { format: 'hsv', value: newValue };
            case 'sl':
                return { format: 'sl', value: newValue };
            case 'sv':
                return { format: 'sv', value: newValue };
            default:
                console.error('Unsupported format for colorStringToColor');
                const unbrandedHSL = defaultColors.hsl;
                const brandedHue = utils.brand.asRadial(unbrandedHSL.value.hue);
                const brandedSaturation = utils.brand.asPercentile(unbrandedHSL.value.saturation);
                const brandedLightness = utils.brand.asPercentile(unbrandedHSL.value.lightness);
                return {
                    value: {
                        hue: brandedHue,
                        saturation: brandedSaturation,
                        lightness: brandedLightness
                    },
                    format: 'hsl'
                };
        }
    }
    return {
        convertColorStringToColor,
        convertCMYKStringToValue(cmyk) {
            return {
                cyan: utils.brand.asPercentile(parseFloat(cmyk.cyan) / 100),
                magenta: utils.brand.asPercentile(parseFloat(cmyk.magenta) / 100),
                yellow: utils.brand.asPercentile(parseFloat(cmyk.yellow) / 100),
                key: utils.brand.asPercentile(parseFloat(cmyk.key) / 100)
            };
        },
        convertCMYKValueToString(cmyk) {
            return {
                cyan: `${cmyk.cyan * 100}%`,
                magenta: `${cmyk.magenta * 100}%`,
                yellow: `${cmyk.yellow * 100}%`,
                key: `${cmyk.key * 100}%`
            };
        },
        convertColorToColorString(color) {
            const log = services.log;
            const clonedColor = utils.core.clone(color);
            if (utils.typeGuards.isColorString(clonedColor)) {
                log('error', `Already formatted as color string: ${JSON.stringify(color)}`, 'colorUtils.convertColorToColorString()');
                return clonedColor;
            }
            if (utils.typeGuards.isCMYKColor(clonedColor)) {
                const newValue = utils.format.formatPercentageValues(clonedColor.value);
                return {
                    format: 'cmyk',
                    value: {
                        cyan: `${newValue.cyan}%`,
                        magenta: `${newValue.magenta}%`,
                        yellow: `${newValue.yellow}%`,
                        key: `${newValue.key}%`
                    }
                };
            }
            else if (utils.typeGuards.isHex(clonedColor)) {
                const newValue = utils.format.formatPercentageValues(clonedColor.value);
                return {
                    format: 'hex',
                    value: {
                        hex: `${newValue.hex}`
                    }
                };
            }
            else if (utils.typeGuards.isHSLColor(clonedColor)) {
                const newValue = utils.format.formatPercentageValues(clonedColor.value);
                return {
                    format: 'hsl',
                    value: {
                        hue: `${newValue.hue}`,
                        saturation: `${newValue.saturation}%`,
                        lightness: `${newValue.lightness}%`
                    }
                };
            }
            else if (utils.typeGuards.isHSVColor(clonedColor)) {
                const newValue = utils.format.formatPercentageValues(clonedColor.value);
                return {
                    format: 'hsv',
                    value: {
                        hue: `${newValue.hue}`,
                        saturation: `${newValue.saturation}%`,
                        value: `${newValue.value}%`
                    }
                };
            }
            else if (utils.typeGuards.isLAB(clonedColor)) {
                const newValue = utils.format.formatPercentageValues(clonedColor.value);
                return {
                    format: 'lab',
                    value: {
                        l: `${newValue.l}`,
                        a: `${newValue.a}`,
                        b: `${newValue.b}`
                    }
                };
            }
            else if (utils.typeGuards.isRGB(clonedColor)) {
                const newValue = utils.format.formatPercentageValues(clonedColor.value);
                return {
                    format: 'rgb',
                    value: {
                        red: `${newValue.red}`,
                        green: `${newValue.green}`,
                        blue: `${newValue.blue}`
                    }
                };
            }
            else if (utils.typeGuards.isXYZ(clonedColor)) {
                const newValue = utils.format.formatPercentageValues(clonedColor.value);
                return {
                    format: 'xyz',
                    value: {
                        x: `${newValue.x}`,
                        y: `${newValue.y}`,
                        z: `${newValue.z}`
                    }
                };
            }
            else {
                log('error', `Unsupported format: ${clonedColor.format}`, 'colorUtils.convertColorToColorString()');
                return defaultColorStrings.hsl;
            }
        },
        convertColorToCSS(color) {
            try {
                switch (color.format) {
                    case 'cmyk':
                        return `cmyk(${color.value.cyan}, ${color.value.magenta}, ${color.value.yellow}, ${color.value.key}`;
                    case 'hex':
                        return String(color.value.hex);
                    case 'hsl':
                        return `hsl(${color.value.hue}, ${color.value.saturation}%, ${color.value.lightness}%`;
                    case 'hsv':
                        return `hsv(${color.value.hue}, ${color.value.saturation}%, ${color.value.value}%`;
                    case 'lab':
                        return `lab(${color.value.l}, ${color.value.a}, ${color.value.b})`;
                    case 'rgb':
                        return `rgb(${color.value.red}, ${color.value.green}, ${color.value.blue})`;
                    case 'xyz':
                        return `xyz(${color.value.x}, ${color.value.y}, ${color.value.z}`;
                    default:
                        console.error(`Unexpected color format: ${color.format}`);
                        return '#FFFFFF';
                }
            }
            catch (error) {
                throw new Error(`getCSSColorString error: ${error}`);
            }
        },
        convertCSSToColor(color) {
            color = color.trim().toLowerCase();
            const cmykMatch = color.match(config.regex.css.cmyk);
            const hslMatch = color.match(config.regex.css.hsl);
            const hsvMatch = color.match(config.regex.css.hsv);
            const labMatch = color.match(config.regex.css.lab);
            const rgbMatch = color.match(config.regex.css.rgb);
            const xyzMatch = color.match(config.regex.css.xyz);
            if (cmykMatch) {
                return {
                    value: {
                        cyan: parseInt(cmykMatch[1], 10),
                        magenta: parseInt(cmykMatch[2], 10),
                        yellow: parseInt(cmykMatch[3], 10),
                        key: parseInt(cmykMatch[4], 10)
                    },
                    format: 'cmyk'
                };
            }
            if (color.startsWith('#')) {
                const hexValue = color.length === 7
                    ? color
                    : utils.format.convertShortHexToLong(color);
                return {
                    value: { hex: hexValue },
                    format: 'hex'
                };
            }
            if (hslMatch) {
                return {
                    value: {
                        hue: parseInt(hslMatch[1], 10),
                        saturation: parseInt(hslMatch[2], 10),
                        lightness: parseInt(hslMatch[3], 10)
                    },
                    format: 'hsl'
                };
            }
            if (hsvMatch) {
                return {
                    value: {
                        hue: parseInt(hsvMatch[1], 10),
                        saturation: parseInt(hsvMatch[2], 10),
                        value: parseInt(hsvMatch[3], 10)
                    },
                    format: 'hsv'
                };
            }
            if (labMatch) {
                return {
                    value: {
                        l: parseFloat(labMatch[1]),
                        a: parseFloat(labMatch[2]),
                        b: parseFloat(labMatch[3])
                    },
                    format: 'lab'
                };
            }
            if (rgbMatch) {
                return {
                    value: {
                        red: parseInt(rgbMatch[1], 10),
                        green: parseInt(rgbMatch[2], 10),
                        blue: parseInt(rgbMatch[3], 10)
                    },
                    format: 'rgb'
                };
            }
            if (xyzMatch) {
                return {
                    value: {
                        x: parseFloat(xyzMatch[1]),
                        y: parseFloat(xyzMatch[2]),
                        z: parseFloat(xyzMatch[3])
                    },
                    format: 'xyz'
                };
            }
            return null;
        },
        convertHexStringToValue(hex) {
            return { hex: utils.brand.asHexSet(hex.hex) };
        },
        convertHexValueToString(hex) {
            return { hex: hex.hex };
        },
        convertHSL(color, colorSpace) {
            const log = services.log;
            try {
                if (!utils.validate.colorValue(color)) {
                    log('error', `Invalid color value ${JSON.stringify(color)}`, 'colorUtils.convertHSL()');
                    return defaultColors.hsl;
                }
                const clonedColor = utils.core.clone(color);
                switch (colorSpace) {
                    case 'cmyk':
                        return helpers.color.hslToCMYK(clonedColor);
                    case 'hex':
                        return helpers.color.hslToHex(clonedColor);
                    case 'hsl':
                        return utils.core.clone(clonedColor);
                    case 'hsv':
                        return helpers.color.hslToHSV(clonedColor);
                    case 'lab':
                        return helpers.color.hslToLAB(clonedColor);
                    case 'rgb':
                        return helpers.color.hslToRGB(clonedColor);
                    case 'sl':
                        return helpers.color.hslToSL(clonedColor);
                    case 'sv':
                        return helpers.color.hslToSV(clonedColor);
                    case 'xyz':
                        return helpers.color.hslToXYZ(clonedColor);
                    default:
                        throw new Error('Invalid color format');
                }
            }
            catch (error) {
                throw new Error(`hslTo() error: ${error}`);
            }
        },
        convertHSLStringToValue(hsl) {
            return {
                hue: utils.brand.asRadial(parseFloat(hsl.hue)),
                saturation: utils.brand.asPercentile(parseFloat(hsl.saturation) / 100),
                lightness: utils.brand.asPercentile(parseFloat(hsl.lightness) / 100)
            };
        },
        convertHSLValueToString(hsl) {
            return {
                hue: `${hsl.hue}°`,
                saturation: `${hsl.saturation * 100}%`,
                lightness: `${hsl.lightness * 100}%`
            };
        },
        convertHSVStringToValue(hsv) {
            return {
                hue: utils.brand.asRadial(parseFloat(hsv.hue)),
                saturation: utils.brand.asPercentile(parseFloat(hsv.saturation) / 100),
                value: utils.brand.asPercentile(parseFloat(hsv.value) / 100)
            };
        },
        convertHSVValueToString(hsv) {
            return {
                hue: `${hsv.hue}°`,
                saturation: `${hsv.saturation * 100}%`,
                value: `${hsv.value * 100}%`
            };
        },
        convertLABStringToValue(lab) {
            return {
                l: utils.brand.asLAB_L(parseFloat(lab.l)),
                a: utils.brand.asLAB_A(parseFloat(lab.a)),
                b: utils.brand.asLAB_B(parseFloat(lab.b))
            };
        },
        convertLABValueToString(lab) {
            return {
                l: `${lab.l}`,
                a: `${lab.a}`,
                b: `${lab.b}`
            };
        },
        convertRGBStringToValue(rgb) {
            return {
                red: utils.brand.asByteRange(parseFloat(rgb.red)),
                green: utils.brand.asByteRange(parseFloat(rgb.green)),
                blue: utils.brand.asByteRange(parseFloat(rgb.blue))
            };
        },
        convertRGBValueToString(rgb) {
            return {
                red: `${rgb.red}`,
                green: `${rgb.green}`,
                blue: `${rgb.blue}`
            };
        },
        convertToHSL(color) {
            const log = services.log;
            try {
                if (!utils.validate.colorValue(color)) {
                    log('error', `Invalid color value ${JSON.stringify(color)}`, 'colorUtils.convertToHSL()');
                    return defaultColors.hsl;
                }
                const clonedColor = utils.core.clone(color);
                switch (color.format) {
                    case 'cmyk':
                        return helpers.color.cmykToHSL(clonedColor);
                    case 'hex':
                        return helpers.color.hexToHSL(clonedColor);
                    case 'hsl':
                        return utils.core.clone(clonedColor);
                    case 'hsv':
                        return helpers.color.hsvToHSL(clonedColor);
                    case 'lab':
                        return helpers.color.labToHSL(clonedColor);
                    case 'rgb':
                        return helpers.color.rgbToHSL(clonedColor);
                    case 'xyz':
                        return helpers.color.xyzToHSL(clonedColor);
                    default:
                        throw new Error('Invalid color format');
                }
            }
            catch (error) {
                throw new Error(`toHSL() error: ${error}`);
            }
        },
        convertXYZStringToValue(xyz) {
            return {
                x: utils.brand.asXYZ_X(parseFloat(xyz.x)),
                y: utils.brand.asXYZ_Y(parseFloat(xyz.y)),
                z: utils.brand.asXYZ_Z(parseFloat(xyz.z))
            };
        },
        convertXYZValueToString(xyz) {
            return {
                x: `${xyz.x}`,
                y: `${xyz.y}`,
                z: `${xyz.z}`
            };
        },
        getColorString(color) {
            try {
                const formatters = {
                    cmyk: (c) => `cmyk(${c.value.cyan}, ${c.value.magenta}, ${c.value.yellow}, ${c.value.key})`,
                    hex: (c) => c.value.hex,
                    hsl: (c) => `hsl(${c.value.hue}, ${c.value.saturation}%, ${c.value.lightness}%)`,
                    hsv: (c) => `hsv(${c.value.hue}, ${c.value.saturation}%, ${c.value.value}%)`,
                    lab: (c) => `lab(${c.value.l}, ${c.value.a}, ${c.value.b})`,
                    rgb: (c) => `rgb(${c.value.red}, ${c.value.green}, ${c.value.blue})`,
                    xyz: (c) => `xyz(${c.value.x}, ${c.value.y}, ${c.value.z})`
                };
                switch (color.format) {
                    case 'cmyk':
                        return formatters.cmyk(color);
                    case 'hex':
                        return formatters.hex(color);
                    case 'hsl':
                        return formatters.hsl(color);
                    case 'hsv':
                        return formatters.hsv(color);
                    case 'lab':
                        return formatters.lab(color);
                    case 'rgb':
                        return formatters.rgb(color);
                    case 'xyz':
                        return formatters.xyz(color);
                    default:
                        services.log('error', `Unsupported color format for ${color}`, 'colorUtils.getColorString()');
                        return null;
                }
            }
            catch (error) {
                services.log('error', `getColorString error: ${error}`, 'colorUtils.getColorString()');
                return null;
            }
        },
        getConversionFn(from, to) {
            try {
                const fnName = `${from}To${to[0].toUpperCase() + to.slice(1)}`;
                if (!(fnName in helpers.color))
                    return undefined;
                const conversionFn = helpers.color[fnName];
                return (value) => structuredClone(conversionFn(value));
            }
            catch (error) {
                services.log('error', `Error getting conversion function: ${error}`, 'colorUtils.getConversionFn()');
                return undefined;
            }
        },
        hueToRGB(p, q, t) {
            try {
                const clonedP = utils.core.clone(p);
                const clonedQ = utils.core.clone(q);
                let clonedT = utils.core.clone(t);
                if (clonedT < 0)
                    clonedT += 1;
                if (clonedT > 1)
                    clonedT -= 1;
                if (clonedT < 1 / 6)
                    return clonedP + (clonedQ - clonedP) * 6 * clonedT;
                if (clonedT < 1 / 2)
                    return clonedQ;
                if (clonedT < 2 / 3)
                    return (clonedP + (clonedQ - clonedP) * (2 / 3 - clonedT) * 6);
                return clonedP;
            }
            catch (error) {
                services.log('error', `Error converting hue to RGB: ${error}`, 'colorUtils.hueToRGB()');
                return 0;
            }
        },
        narrowToColor(color) {
            if (utils.typeGuards.isColorString(color))
                return convertColorStringToColor(color);
            switch (color.format) {
                case 'cmyk':
                case 'hex':
                case 'hsl':
                case 'hsv':
                case 'lab':
                case 'sl':
                case 'sv':
                case 'rgb':
                case 'xyz':
                    return color;
                default:
                    return null;
            }
        },
        toColorValueRange(value, rangeKey) {
            utils.validate.range(value, rangeKey);
            if (rangeKey === 'HexSet') {
                return utils.brand.asHexSet(value);
            }
            return utils.brand.asBranded(value, rangeKey);
        },
        validateAndConvertColor(color) {
            const log = services.log;
            if (!color)
                return null;
            const convertedColor = utils.typeGuards.isColorString(color)
                ? convertColorStringToColor(color)
                : color;
            if (!utils.validate.colorValue(convertedColor)) {
                log('error', `Invalid color: ${JSON.stringify(convertedColor)}`, 'colorUtils.validateAndConvertColor()');
                return null;
            }
            return convertedColor;
        }
    };
}

export { createColorUtils };
//# sourceMappingURL=color.js.map
