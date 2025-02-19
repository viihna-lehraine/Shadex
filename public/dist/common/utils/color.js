// File: common/utils/color.js
import { data } from '../../config/index.js';
const config = data.config;
const defaultColors = data.defaults.colors;
const defaultColorStrings = data.defaults.colors.strings;
export function createColorUtils(helpers, services, utils) {
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
                log(`Already formatted as color string: ${JSON.stringify(color)}`, 'error');
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
                log(`Unsupported format: ${clonedColor.format}`, 'error');
                return defaultColorStrings.hsl;
            }
        },
        convertColorToCSS(color) {
            try {
                switch (color.format) {
                    case 'cmyk':
                        return `cmyk(${color.value.cyan}, ${color.value.magenta}, ${color.value.yellow}, ${color.value.key})`;
                    case 'hex':
                        return String(color.value.hex);
                    case 'hsl':
                        return `hsl(${Math.round(color.value.hue)},
									${Math.round(color.value.saturation)}%,
									${Math.round(color.value.lightness)}%)`;
                    case 'hsv':
                        return `hsv(${color.value.hue}, ${color.value.saturation}%, ${color.value.value}%)`;
                    case 'lab':
                        return `lab(${color.value.l}, ${color.value.a}, ${color.value.b})`;
                    case 'rgb':
                        return `rgb(${color.value.red}, ${color.value.green}, ${color.value.blue})`;
                    case 'xyz':
                        return `xyz(${color.value.x}, ${color.value.y}, ${color.value.z})`;
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
                    log(`Invalid color value ${JSON.stringify(color)}`, 'error');
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
                    log(`Invalid color value ${JSON.stringify(color)}`, 'error');
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
                        services.log(`Unsupported color format for ${color}`, 'error');
                        return null;
                }
            }
            catch (error) {
                services.log(`getColorString error: ${error}`, 'error');
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
                services.log(`Error getting conversion function: ${error}`, 'error');
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
                services.log(`Error converting hue to RGB: ${error}`, 'error');
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
                log(`Invalid color: ${JSON.stringify(convertedColor)}`, 'error');
                return null;
            }
            return convertedColor;
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL3V0aWxzL2NvbG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQTZCOUIsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTdDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDM0IsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFDM0MsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFFekQsTUFBTSxVQUFVLGdCQUFnQixDQUMvQixPQUF5QixFQUN6QixRQUEyQixFQUMzQixLQUF5QjtJQUV6QixTQUFTLHlCQUF5QixDQUFDLFdBQThCO1FBQ2hFLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRWxELE1BQU0sVUFBVSxHQUFHLENBQUMsS0FBc0IsRUFBVSxFQUFFLENBQ3JELE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztZQUMvQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsQixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQ3hELENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUU7WUFDbkIsR0FBRyxDQUFDLEdBQTBDLENBQUMsR0FBRyxVQUFVLENBQzNELEdBQUcsQ0FDTSxDQUFDO1lBRVgsT0FB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QyxLQUFLO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBRXhCLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztnQkFDM0QsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUVULElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDO2dCQUNoRCxHQUFHLENBQ0Ysa0JBQWtCLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFDbEQsT0FBTyxDQUNQLENBQUM7Z0JBRUYsT0FBTyxJQUFJLENBQUM7WUFDYixDQUFDO1lBRUQsT0FBTyxjQUFjLENBQUM7UUFDdkIsQ0FBQztLQUNELENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogY29tbW9uL3V0aWxzL2NvbG9yLmpzXG5cbmltcG9ydCB7XG5cdENNWUssXG5cdENNWUtTdHJpbmdPYmplY3QsXG5cdENvbG9yLFxuXHRDb2xvckRhdGFBc3NlcnRpb24sXG5cdENvbG9yU3BhY2VFeHRlbmRlZCxcblx0Q29sb3JTdHJpbmdPYmplY3QsXG5cdENvbG9yVXRpbHNJbnRlcmZhY2UsXG5cdEhlbHBlcnNJbnRlcmZhY2UsXG5cdEhleCxcblx0SGV4U3RyaW5nT2JqZWN0LFxuXHRIU0wsXG5cdEhTTFN0cmluZ09iamVjdCxcblx0SFNWLFxuXHRIU1ZTdHJpbmdPYmplY3QsXG5cdExBQixcblx0TEFCU3RyaW5nT2JqZWN0LFxuXHRSYW5nZUtleU1hcCxcblx0UkdCLFxuXHRSR0JTdHJpbmdPYmplY3QsXG5cdFNlcnZpY2VzSW50ZXJmYWNlLFxuXHRTTCxcblx0U1YsXG5cdFV0aWxpdGllc0ludGVyZmFjZSxcblx0WFlaLFxuXHRYWVpTdHJpbmdPYmplY3Rcbn0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uLy4uL2NvbmZpZy9pbmRleC5qcyc7XG5cbmNvbnN0IGNvbmZpZyA9IGRhdGEuY29uZmlnO1xuY29uc3QgZGVmYXVsdENvbG9ycyA9IGRhdGEuZGVmYXVsdHMuY29sb3JzO1xuY29uc3QgZGVmYXVsdENvbG9yU3RyaW5ncyA9IGRhdGEuZGVmYXVsdHMuY29sb3JzLnN0cmluZ3M7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb2xvclV0aWxzKFxuXHRoZWxwZXJzOiBIZWxwZXJzSW50ZXJmYWNlLFxuXHRzZXJ2aWNlczogU2VydmljZXNJbnRlcmZhY2UsXG5cdHV0aWxzOiBVdGlsaXRpZXNJbnRlcmZhY2Vcbik6IENvbG9yVXRpbHNJbnRlcmZhY2Uge1xuXHRmdW5jdGlvbiBjb252ZXJ0Q29sb3JTdHJpbmdUb0NvbG9yKGNvbG9yU3RyaW5nOiBDb2xvclN0cmluZ09iamVjdCk6IENvbG9yIHtcblx0XHRjb25zdCBjbG9uZWRDb2xvciA9IHV0aWxzLmNvcmUuY2xvbmUoY29sb3JTdHJpbmcpO1xuXG5cdFx0Y29uc3QgcGFyc2VWYWx1ZSA9ICh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyID0+XG5cdFx0XHR0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLmVuZHNXaXRoKCclJylcblx0XHRcdFx0PyBwYXJzZUZsb2F0KHZhbHVlLnNsaWNlKDAsIC0xKSlcblx0XHRcdFx0OiBOdW1iZXIodmFsdWUpO1xuXG5cdFx0Y29uc3QgbmV3VmFsdWUgPSBPYmplY3QuZW50cmllcyhjbG9uZWRDb2xvci52YWx1ZSkucmVkdWNlKFxuXHRcdFx0KGFjYywgW2tleSwgdmFsXSkgPT4ge1xuXHRcdFx0XHRhY2Nba2V5IGFzIGtleW9mICh0eXBlb2YgY2xvbmVkQ29sb3IpWyd2YWx1ZSddXSA9IHBhcnNlVmFsdWUoXG5cdFx0XHRcdFx0dmFsXG5cdFx0XHRcdCkgYXMgbmV2ZXI7XG5cblx0XHRcdFx0cmV0dXJuIGFjYztcblx0XHRcdH0sXG5cdFx0XHR7fSBhcyBSZWNvcmQ8a2V5b2YgKHR5cGVvZiBjbG9uZWRDb2xvcilbJ3ZhbHVlJ10sIG51bWJlcj5cblx0XHQpO1xuXG5cdFx0c3dpdGNoIChjbG9uZWRDb2xvci5mb3JtYXQpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdjbXlrJywgdmFsdWU6IG5ld1ZhbHVlIGFzIENNWUtbJ3ZhbHVlJ10gfTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiB7IGZvcm1hdDogJ2hzbCcsIHZhbHVlOiBuZXdWYWx1ZSBhcyBIU0xbJ3ZhbHVlJ10gfTtcblx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdHJldHVybiB7IGZvcm1hdDogJ2hzdicsIHZhbHVlOiBuZXdWYWx1ZSBhcyBIU1ZbJ3ZhbHVlJ10gfTtcblx0XHRcdGNhc2UgJ3NsJzpcblx0XHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnc2wnLCB2YWx1ZTogbmV3VmFsdWUgYXMgU0xbJ3ZhbHVlJ10gfTtcblx0XHRcdGNhc2UgJ3N2Jzpcblx0XHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnc3YnLCB2YWx1ZTogbmV3VmFsdWUgYXMgU1ZbJ3ZhbHVlJ10gfTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ1Vuc3VwcG9ydGVkIGZvcm1hdCBmb3IgY29sb3JTdHJpbmdUb0NvbG9yJyk7XG5cblx0XHRcdFx0Y29uc3QgdW5icmFuZGVkSFNMID0gZGVmYXVsdENvbG9ycy5oc2w7XG5cblx0XHRcdFx0Y29uc3QgYnJhbmRlZEh1ZSA9IHV0aWxzLmJyYW5kLmFzUmFkaWFsKHVuYnJhbmRlZEhTTC52YWx1ZS5odWUpO1xuXHRcdFx0XHRjb25zdCBicmFuZGVkU2F0dXJhdGlvbiA9IHV0aWxzLmJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHR1bmJyYW5kZWRIU0wudmFsdWUuc2F0dXJhdGlvblxuXHRcdFx0XHQpO1xuXHRcdFx0XHRjb25zdCBicmFuZGVkTGlnaHRuZXNzID0gdXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdHVuYnJhbmRlZEhTTC52YWx1ZS5saWdodG5lc3Ncblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRodWU6IGJyYW5kZWRIdWUsXG5cdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZGVkU2F0dXJhdGlvbixcblx0XHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmRlZExpZ2h0bmVzc1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7XG5cdFx0Y29udmVydENvbG9yU3RyaW5nVG9Db2xvcixcblx0XHRjb252ZXJ0Q01ZS1N0cmluZ1RvVmFsdWUoY215aykge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Y3lhbjogdXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoY215ay5jeWFuKSAvIDEwMCksXG5cdFx0XHRcdG1hZ2VudGE6IHV0aWxzLmJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRwYXJzZUZsb2F0KGNteWsubWFnZW50YSkgLyAxMDBcblx0XHRcdFx0KSxcblx0XHRcdFx0eWVsbG93OiB1dGlscy5icmFuZC5hc1BlcmNlbnRpbGUocGFyc2VGbG9hdChjbXlrLnllbGxvdykgLyAxMDApLFxuXHRcdFx0XHRrZXk6IHV0aWxzLmJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUZsb2F0KGNteWsua2V5KSAvIDEwMClcblx0XHRcdH07XG5cdFx0fSxcblx0XHRjb252ZXJ0Q01ZS1ZhbHVlVG9TdHJpbmcoXG5cdFx0XHRjbXlrOiBDTVlLWyd2YWx1ZSddXG5cdFx0KTogQ01ZS1N0cmluZ09iamVjdFsndmFsdWUnXSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRjeWFuOiBgJHtjbXlrLmN5YW4gKiAxMDB9JWAsXG5cdFx0XHRcdG1hZ2VudGE6IGAke2NteWsubWFnZW50YSAqIDEwMH0lYCxcblx0XHRcdFx0eWVsbG93OiBgJHtjbXlrLnllbGxvdyAqIDEwMH0lYCxcblx0XHRcdFx0a2V5OiBgJHtjbXlrLmtleSAqIDEwMH0lYFxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGNvbnZlcnRDb2xvclRvQ29sb3JTdHJpbmcoY29sb3I6IENvbG9yKTogQ29sb3JTdHJpbmdPYmplY3Qge1xuXHRcdFx0Y29uc3QgbG9nID0gc2VydmljZXMubG9nO1xuXHRcdFx0Y29uc3QgY2xvbmVkQ29sb3IgPSB1dGlscy5jb3JlLmNsb25lKGNvbG9yKTtcblxuXHRcdFx0aWYgKHV0aWxzLnR5cGVHdWFyZHMuaXNDb2xvclN0cmluZyhjbG9uZWRDb2xvcikpIHtcblx0XHRcdFx0bG9nKFxuXHRcdFx0XHRcdGBBbHJlYWR5IGZvcm1hdHRlZCBhcyBjb2xvciBzdHJpbmc6ICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWAsXG5cdFx0XHRcdFx0J2Vycm9yJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBjbG9uZWRDb2xvcjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHV0aWxzLnR5cGVHdWFyZHMuaXNDTVlLQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gdXRpbHMuZm9ybWF0LmZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWVcblx0XHRcdFx0KSBhcyBDTVlLWyd2YWx1ZSddO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0Zm9ybWF0OiAnY215aycsXG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGN5YW46IGAke25ld1ZhbHVlLmN5YW59JWAsXG5cdFx0XHRcdFx0XHRtYWdlbnRhOiBgJHtuZXdWYWx1ZS5tYWdlbnRhfSVgLFxuXHRcdFx0XHRcdFx0eWVsbG93OiBgJHtuZXdWYWx1ZS55ZWxsb3d9JWAsXG5cdFx0XHRcdFx0XHRrZXk6IGAke25ld1ZhbHVlLmtleX0lYFxuXHRcdFx0XHRcdH0gYXMgQ01ZS1N0cmluZ09iamVjdFsndmFsdWUnXVxuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIGlmICh1dGlscy50eXBlR3VhcmRzLmlzSGV4KGNsb25lZENvbG9yKSkge1xuXHRcdFx0XHRjb25zdCBuZXdWYWx1ZSA9IHV0aWxzLmZvcm1hdC5mb3JtYXRQZXJjZW50YWdlVmFsdWVzKFxuXHRcdFx0XHRcdChjbG9uZWRDb2xvciBhcyBIZXgpLnZhbHVlXG5cdFx0XHRcdCkgYXMgSGV4Wyd2YWx1ZSddO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4Jyxcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aGV4OiBgJHtuZXdWYWx1ZS5oZXh9YFxuXHRcdFx0XHRcdH0gYXMgSGV4U3RyaW5nT2JqZWN0Wyd2YWx1ZSddXG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2UgaWYgKHV0aWxzLnR5cGVHdWFyZHMuaXNIU0xDb2xvcihjbG9uZWRDb2xvcikpIHtcblx0XHRcdFx0Y29uc3QgbmV3VmFsdWUgPSB1dGlscy5mb3JtYXQuZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZVxuXHRcdFx0XHQpIGFzIEhTTFsndmFsdWUnXTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGZvcm1hdDogJ2hzbCcsXG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGh1ZTogYCR7bmV3VmFsdWUuaHVlfWAsXG5cdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBgJHtuZXdWYWx1ZS5zYXR1cmF0aW9ufSVgLFxuXHRcdFx0XHRcdFx0bGlnaHRuZXNzOiBgJHtuZXdWYWx1ZS5saWdodG5lc3N9JWBcblx0XHRcdFx0XHR9IGFzIEhTTFN0cmluZ09iamVjdFsndmFsdWUnXVxuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIGlmICh1dGlscy50eXBlR3VhcmRzLmlzSFNWQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gdXRpbHMuZm9ybWF0LmZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWVcblx0XHRcdFx0KSBhcyBIU1ZbJ3ZhbHVlJ107XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRmb3JtYXQ6ICdoc3YnLFxuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRodWU6IGAke25ld1ZhbHVlLmh1ZX1gLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYCR7bmV3VmFsdWUuc2F0dXJhdGlvbn0lYCxcblx0XHRcdFx0XHRcdHZhbHVlOiBgJHtuZXdWYWx1ZS52YWx1ZX0lYFxuXHRcdFx0XHRcdH0gYXMgSFNWU3RyaW5nT2JqZWN0Wyd2YWx1ZSddXG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2UgaWYgKHV0aWxzLnR5cGVHdWFyZHMuaXNMQUIoY2xvbmVkQ29sb3IpKSB7XG5cdFx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gdXRpbHMuZm9ybWF0LmZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWVcblx0XHRcdFx0KSBhcyBMQUJbJ3ZhbHVlJ107XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRmb3JtYXQ6ICdsYWInLFxuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRsOiBgJHtuZXdWYWx1ZS5sfWAsXG5cdFx0XHRcdFx0XHRhOiBgJHtuZXdWYWx1ZS5hfWAsXG5cdFx0XHRcdFx0XHRiOiBgJHtuZXdWYWx1ZS5ifWBcblx0XHRcdFx0XHR9IGFzIExBQlN0cmluZ09iamVjdFsndmFsdWUnXVxuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIGlmICh1dGlscy50eXBlR3VhcmRzLmlzUkdCKGNsb25lZENvbG9yKSkge1xuXHRcdFx0XHRjb25zdCBuZXdWYWx1ZSA9IHV0aWxzLmZvcm1hdC5mb3JtYXRQZXJjZW50YWdlVmFsdWVzKFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlXG5cdFx0XHRcdCkgYXMgUkdCWyd2YWx1ZSddO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0Zm9ybWF0OiAncmdiJyxcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0cmVkOiBgJHtuZXdWYWx1ZS5yZWR9YCxcblx0XHRcdFx0XHRcdGdyZWVuOiBgJHtuZXdWYWx1ZS5ncmVlbn1gLFxuXHRcdFx0XHRcdFx0Ymx1ZTogYCR7bmV3VmFsdWUuYmx1ZX1gXG5cdFx0XHRcdFx0fSBhcyBSR0JTdHJpbmdPYmplY3RbJ3ZhbHVlJ11cblx0XHRcdFx0fTtcblx0XHRcdH0gZWxzZSBpZiAodXRpbHMudHlwZUd1YXJkcy5pc1hZWihjbG9uZWRDb2xvcikpIHtcblx0XHRcdFx0Y29uc3QgbmV3VmFsdWUgPSB1dGlscy5mb3JtYXQuZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZVxuXHRcdFx0XHQpIGFzIFhZWlsndmFsdWUnXTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGZvcm1hdDogJ3h5eicsXG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdHg6IGAke25ld1ZhbHVlLnh9YCxcblx0XHRcdFx0XHRcdHk6IGAke25ld1ZhbHVlLnl9YCxcblx0XHRcdFx0XHRcdHo6IGAke25ld1ZhbHVlLnp9YFxuXHRcdFx0XHRcdH0gYXMgWFlaU3RyaW5nT2JqZWN0Wyd2YWx1ZSddXG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsb2coYFVuc3VwcG9ydGVkIGZvcm1hdDogJHtjbG9uZWRDb2xvci5mb3JtYXR9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRDb2xvclN0cmluZ3MuaHNsO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Y29udmVydENvbG9yVG9DU1MoY29sb3I6IENvbG9yKTogc3RyaW5nIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHN3aXRjaCAoY29sb3IuZm9ybWF0KSB7XG5cdFx0XHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gYGNteWsoJHtjb2xvci52YWx1ZS5jeWFufSwgJHtjb2xvci52YWx1ZS5tYWdlbnRhfSwgJHtjb2xvci52YWx1ZS55ZWxsb3d9LCAke2NvbG9yLnZhbHVlLmtleX0pYDtcblx0XHRcdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRcdFx0cmV0dXJuIFN0cmluZyhjb2xvci52YWx1ZS5oZXgpO1xuXHRcdFx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gYGhzbCgke01hdGgucm91bmQoY29sb3IudmFsdWUuaHVlKX0sXG5cdFx0XHRcdFx0XHRcdFx0XHQke01hdGgucm91bmQoY29sb3IudmFsdWUuc2F0dXJhdGlvbil9JSxcblx0XHRcdFx0XHRcdFx0XHRcdCR7TWF0aC5yb3VuZChjb2xvci52YWx1ZS5saWdodG5lc3MpfSUpYDtcblx0XHRcdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRcdFx0cmV0dXJuIGBoc3YoJHtjb2xvci52YWx1ZS5odWV9LCAke2NvbG9yLnZhbHVlLnNhdHVyYXRpb259JSwgJHtjb2xvci52YWx1ZS52YWx1ZX0lKWA7XG5cdFx0XHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0XHRcdHJldHVybiBgbGFiKCR7Y29sb3IudmFsdWUubH0sICR7Y29sb3IudmFsdWUuYX0sICR7Y29sb3IudmFsdWUuYn0pYDtcblx0XHRcdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRcdFx0cmV0dXJuIGByZ2IoJHtjb2xvci52YWx1ZS5yZWR9LCAke2NvbG9yLnZhbHVlLmdyZWVufSwgJHtjb2xvci52YWx1ZS5ibHVlfSlgO1xuXHRcdFx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdFx0XHRyZXR1cm4gYHh5eigke2NvbG9yLnZhbHVlLnh9LCAke2NvbG9yLnZhbHVlLnl9LCAke2NvbG9yLnZhbHVlLnp9KWA7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRcdFx0XHRcdGBVbmV4cGVjdGVkIGNvbG9yIGZvcm1hdDogJHtjb2xvci5mb3JtYXR9YFxuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuICcjRkZGRkZGJztcblx0XHRcdFx0fVxuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBnZXRDU1NDb2xvclN0cmluZyBlcnJvcjogJHtlcnJvcn1gKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGNvbnZlcnRDU1NUb0NvbG9yKGNvbG9yOiBzdHJpbmcpOiBFeGNsdWRlPENvbG9yLCBTTCB8IFNWPiB8IG51bGwge1xuXHRcdFx0Y29sb3IgPSBjb2xvci50cmltKCkudG9Mb3dlckNhc2UoKTtcblxuXHRcdFx0Y29uc3QgY215a01hdGNoID0gY29sb3IubWF0Y2goY29uZmlnLnJlZ2V4LmNzcy5jbXlrKTtcblx0XHRcdGNvbnN0IGhzbE1hdGNoID0gY29sb3IubWF0Y2goY29uZmlnLnJlZ2V4LmNzcy5oc2wpO1xuXHRcdFx0Y29uc3QgaHN2TWF0Y2ggPSBjb2xvci5tYXRjaChjb25maWcucmVnZXguY3NzLmhzdik7XG5cdFx0XHRjb25zdCBsYWJNYXRjaCA9IGNvbG9yLm1hdGNoKGNvbmZpZy5yZWdleC5jc3MubGFiKTtcblx0XHRcdGNvbnN0IHJnYk1hdGNoID0gY29sb3IubWF0Y2goY29uZmlnLnJlZ2V4LmNzcy5yZ2IpO1xuXHRcdFx0Y29uc3QgeHl6TWF0Y2ggPSBjb2xvci5tYXRjaChjb25maWcucmVnZXguY3NzLnh5eik7XG5cblx0XHRcdGlmIChjbXlrTWF0Y2gpIHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0Y3lhbjogcGFyc2VJbnQoY215a01hdGNoWzFdLCAxMCksXG5cdFx0XHRcdFx0XHRtYWdlbnRhOiBwYXJzZUludChjbXlrTWF0Y2hbMl0sIDEwKSxcblx0XHRcdFx0XHRcdHllbGxvdzogcGFyc2VJbnQoY215a01hdGNoWzNdLCAxMCksXG5cdFx0XHRcdFx0XHRrZXk6IHBhcnNlSW50KGNteWtNYXRjaFs0XSwgMTApXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0XHR9IGFzIENNWUs7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb2xvci5zdGFydHNXaXRoKCcjJykpIHtcblx0XHRcdFx0Y29uc3QgaGV4VmFsdWUgPVxuXHRcdFx0XHRcdGNvbG9yLmxlbmd0aCA9PT0gN1xuXHRcdFx0XHRcdFx0PyBjb2xvclxuXHRcdFx0XHRcdFx0OiB1dGlscy5mb3JtYXQuY29udmVydFNob3J0SGV4VG9Mb25nKGNvbG9yKTtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZTogeyBoZXg6IGhleFZhbHVlIH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHR9IGFzIEhleDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGhzbE1hdGNoKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGh1ZTogcGFyc2VJbnQoaHNsTWF0Y2hbMV0sIDEwKSxcblx0XHRcdFx0XHRcdHNhdHVyYXRpb246IHBhcnNlSW50KGhzbE1hdGNoWzJdLCAxMCksXG5cdFx0XHRcdFx0XHRsaWdodG5lc3M6IHBhcnNlSW50KGhzbE1hdGNoWzNdLCAxMClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdFx0fSBhcyBIU0w7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChoc3ZNYXRjaCkge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRodWU6IHBhcnNlSW50KGhzdk1hdGNoWzFdLCAxMCksXG5cdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBwYXJzZUludChoc3ZNYXRjaFsyXSwgMTApLFxuXHRcdFx0XHRcdFx0dmFsdWU6IHBhcnNlSW50KGhzdk1hdGNoWzNdLCAxMClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdFx0fSBhcyBIU1Y7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChsYWJNYXRjaCkge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRsOiBwYXJzZUZsb2F0KGxhYk1hdGNoWzFdKSxcblx0XHRcdFx0XHRcdGE6IHBhcnNlRmxvYXQobGFiTWF0Y2hbMl0pLFxuXHRcdFx0XHRcdFx0YjogcGFyc2VGbG9hdChsYWJNYXRjaFszXSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdFx0fSBhcyBMQUI7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChyZ2JNYXRjaCkge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRyZWQ6IHBhcnNlSW50KHJnYk1hdGNoWzFdLCAxMCksXG5cdFx0XHRcdFx0XHRncmVlbjogcGFyc2VJbnQocmdiTWF0Y2hbMl0sIDEwKSxcblx0XHRcdFx0XHRcdGJsdWU6IHBhcnNlSW50KHJnYk1hdGNoWzNdLCAxMClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdFx0fSBhcyBSR0I7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh4eXpNYXRjaCkge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHR4OiBwYXJzZUZsb2F0KHh5ek1hdGNoWzFdKSxcblx0XHRcdFx0XHRcdHk6IHBhcnNlRmxvYXQoeHl6TWF0Y2hbMl0pLFxuXHRcdFx0XHRcdFx0ejogcGFyc2VGbG9hdCh4eXpNYXRjaFszXSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHRcdFx0fSBhcyBYWVo7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH0sXG5cdFx0Y29udmVydEhleFN0cmluZ1RvVmFsdWUoaGV4OiBIZXhTdHJpbmdPYmplY3RbJ3ZhbHVlJ10pOiBIZXhbJ3ZhbHVlJ10ge1xuXHRcdFx0cmV0dXJuIHsgaGV4OiB1dGlscy5icmFuZC5hc0hleFNldChoZXguaGV4KSB9O1xuXHRcdH0sXG5cdFx0Y29udmVydEhleFZhbHVlVG9TdHJpbmcoaGV4OiBIZXhbJ3ZhbHVlJ10pOiBIZXhTdHJpbmdPYmplY3RbJ3ZhbHVlJ10ge1xuXHRcdFx0cmV0dXJuIHsgaGV4OiBoZXguaGV4IH07XG5cdFx0fSxcblx0XHRjb252ZXJ0SFNMKGNvbG9yOiBIU0wsIGNvbG9yU3BhY2U6IENvbG9yU3BhY2VFeHRlbmRlZCk6IENvbG9yIHtcblx0XHRcdGNvbnN0IGxvZyA9IHNlcnZpY2VzLmxvZztcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKCF1dGlscy52YWxpZGF0ZS5jb2xvclZhbHVlKGNvbG9yKSkge1xuXHRcdFx0XHRcdGxvZyhcblx0XHRcdFx0XHRcdGBJbnZhbGlkIGNvbG9yIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWAsXG5cdFx0XHRcdFx0XHQnZXJyb3InXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdHJldHVybiBkZWZhdWx0Q29sb3JzLmhzbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IGNsb25lZENvbG9yID0gdXRpbHMuY29yZS5jbG9uZShjb2xvcikgYXMgSFNMO1xuXG5cdFx0XHRcdHN3aXRjaCAoY29sb3JTcGFjZSkge1xuXHRcdFx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRcdFx0cmV0dXJuIGhlbHBlcnMuY29sb3IuaHNsVG9DTVlLKGNsb25lZENvbG9yKTtcblx0XHRcdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRcdFx0cmV0dXJuIGhlbHBlcnMuY29sb3IuaHNsVG9IZXgoY2xvbmVkQ29sb3IpO1xuXHRcdFx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gdXRpbHMuY29yZS5jbG9uZShjbG9uZWRDb2xvcik7XG5cdFx0XHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0XHRcdHJldHVybiBoZWxwZXJzLmNvbG9yLmhzbFRvSFNWKGNsb25lZENvbG9yKTtcblx0XHRcdFx0XHRjYXNlICdsYWInOlxuXHRcdFx0XHRcdFx0cmV0dXJuIGhlbHBlcnMuY29sb3IuaHNsVG9MQUIoY2xvbmVkQ29sb3IpO1xuXHRcdFx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdFx0XHRyZXR1cm4gaGVscGVycy5jb2xvci5oc2xUb1JHQihjbG9uZWRDb2xvcik7XG5cdFx0XHRcdFx0Y2FzZSAnc2wnOlxuXHRcdFx0XHRcdFx0cmV0dXJuIGhlbHBlcnMuY29sb3IuaHNsVG9TTChjbG9uZWRDb2xvcik7XG5cdFx0XHRcdFx0Y2FzZSAnc3YnOlxuXHRcdFx0XHRcdFx0cmV0dXJuIGhlbHBlcnMuY29sb3IuaHNsVG9TVihjbG9uZWRDb2xvcik7XG5cdFx0XHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0XHRcdHJldHVybiBoZWxwZXJzLmNvbG9yLmhzbFRvWFlaKGNsb25lZENvbG9yKTtcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvbG9yIGZvcm1hdCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGhzbFRvKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRjb252ZXJ0SFNMU3RyaW5nVG9WYWx1ZShoc2w6IEhTTFN0cmluZ09iamVjdFsndmFsdWUnXSk6IEhTTFsndmFsdWUnXSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRodWU6IHV0aWxzLmJyYW5kLmFzUmFkaWFsKHBhcnNlRmxvYXQoaHNsLmh1ZSkpLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiB1dGlscy5icmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0cGFyc2VGbG9hdChoc2wuc2F0dXJhdGlvbikgLyAxMDBcblx0XHRcdFx0KSxcblx0XHRcdFx0bGlnaHRuZXNzOiB1dGlscy5icmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0cGFyc2VGbG9hdChoc2wubGlnaHRuZXNzKSAvIDEwMFxuXHRcdFx0XHQpXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0Y29udmVydEhTTFZhbHVlVG9TdHJpbmcoaHNsOiBIU0xbJ3ZhbHVlJ10pOiBIU0xTdHJpbmdPYmplY3RbJ3ZhbHVlJ10ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aHVlOiBgJHtoc2wuaHVlfcKwYCxcblx0XHRcdFx0c2F0dXJhdGlvbjogYCR7aHNsLnNhdHVyYXRpb24gKiAxMDB9JWAsXG5cdFx0XHRcdGxpZ2h0bmVzczogYCR7aHNsLmxpZ2h0bmVzcyAqIDEwMH0lYFxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGNvbnZlcnRIU1ZTdHJpbmdUb1ZhbHVlKGhzdjogSFNWU3RyaW5nT2JqZWN0Wyd2YWx1ZSddKTogSFNWWyd2YWx1ZSddIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGh1ZTogdXRpbHMuYnJhbmQuYXNSYWRpYWwocGFyc2VGbG9hdChoc3YuaHVlKSksXG5cdFx0XHRcdHNhdHVyYXRpb246IHV0aWxzLmJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRwYXJzZUZsb2F0KGhzdi5zYXR1cmF0aW9uKSAvIDEwMFxuXHRcdFx0XHQpLFxuXHRcdFx0XHR2YWx1ZTogdXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKHBhcnNlRmxvYXQoaHN2LnZhbHVlKSAvIDEwMClcblx0XHRcdH07XG5cdFx0fSxcblx0XHRjb252ZXJ0SFNWVmFsdWVUb1N0cmluZyhoc3Y6IEhTVlsndmFsdWUnXSk6IEhTVlN0cmluZ09iamVjdFsndmFsdWUnXSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRodWU6IGAke2hzdi5odWV9wrBgLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBgJHtoc3Yuc2F0dXJhdGlvbiAqIDEwMH0lYCxcblx0XHRcdFx0dmFsdWU6IGAke2hzdi52YWx1ZSAqIDEwMH0lYFxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGNvbnZlcnRMQUJTdHJpbmdUb1ZhbHVlKGxhYjogTEFCU3RyaW5nT2JqZWN0Wyd2YWx1ZSddKTogTEFCWyd2YWx1ZSddIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGw6IHV0aWxzLmJyYW5kLmFzTEFCX0wocGFyc2VGbG9hdChsYWIubCkpLFxuXHRcdFx0XHRhOiB1dGlscy5icmFuZC5hc0xBQl9BKHBhcnNlRmxvYXQobGFiLmEpKSxcblx0XHRcdFx0YjogdXRpbHMuYnJhbmQuYXNMQUJfQihwYXJzZUZsb2F0KGxhYi5iKSlcblx0XHRcdH07XG5cdFx0fSxcblx0XHRjb252ZXJ0TEFCVmFsdWVUb1N0cmluZyhsYWI6IExBQlsndmFsdWUnXSk6IExBQlN0cmluZ09iamVjdFsndmFsdWUnXSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsOiBgJHtsYWIubH1gLFxuXHRcdFx0XHRhOiBgJHtsYWIuYX1gLFxuXHRcdFx0XHRiOiBgJHtsYWIuYn1gXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0Y29udmVydFJHQlN0cmluZ1RvVmFsdWUocmdiOiBSR0JTdHJpbmdPYmplY3RbJ3ZhbHVlJ10pOiBSR0JbJ3ZhbHVlJ10ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cmVkOiB1dGlscy5icmFuZC5hc0J5dGVSYW5nZShwYXJzZUZsb2F0KHJnYi5yZWQpKSxcblx0XHRcdFx0Z3JlZW46IHV0aWxzLmJyYW5kLmFzQnl0ZVJhbmdlKHBhcnNlRmxvYXQocmdiLmdyZWVuKSksXG5cdFx0XHRcdGJsdWU6IHV0aWxzLmJyYW5kLmFzQnl0ZVJhbmdlKHBhcnNlRmxvYXQocmdiLmJsdWUpKVxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGNvbnZlcnRSR0JWYWx1ZVRvU3RyaW5nKHJnYjogUkdCWyd2YWx1ZSddKTogUkdCU3RyaW5nT2JqZWN0Wyd2YWx1ZSddIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHJlZDogYCR7cmdiLnJlZH1gLFxuXHRcdFx0XHRncmVlbjogYCR7cmdiLmdyZWVufWAsXG5cdFx0XHRcdGJsdWU6IGAke3JnYi5ibHVlfWBcblx0XHRcdH07XG5cdFx0fSxcblx0XHRjb252ZXJ0VG9IU0woY29sb3I6IEV4Y2x1ZGU8Q29sb3IsIFNMIHwgU1Y+KTogSFNMIHtcblx0XHRcdGNvbnN0IGxvZyA9IHNlcnZpY2VzLmxvZztcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKCF1dGlscy52YWxpZGF0ZS5jb2xvclZhbHVlKGNvbG9yKSkge1xuXHRcdFx0XHRcdGxvZyhcblx0XHRcdFx0XHRcdGBJbnZhbGlkIGNvbG9yIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWAsXG5cdFx0XHRcdFx0XHQnZXJyb3InXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdHJldHVybiBkZWZhdWx0Q29sb3JzLmhzbCBhcyBIU0w7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBjbG9uZWRDb2xvciA9IHV0aWxzLmNvcmUuY2xvbmUoY29sb3IpO1xuXG5cdFx0XHRcdHN3aXRjaCAoY29sb3IuZm9ybWF0KSB7XG5cdFx0XHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gaGVscGVycy5jb2xvci5jbXlrVG9IU0woY2xvbmVkQ29sb3IgYXMgQ01ZSyk7XG5cdFx0XHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0XHRcdHJldHVybiBoZWxwZXJzLmNvbG9yLmhleFRvSFNMKGNsb25lZENvbG9yIGFzIEhleCk7XG5cdFx0XHRcdFx0Y2FzZSAnaHNsJzpcblx0XHRcdFx0XHRcdHJldHVybiB1dGlscy5jb3JlLmNsb25lKGNsb25lZENvbG9yIGFzIEhTTCk7XG5cdFx0XHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0XHRcdHJldHVybiBoZWxwZXJzLmNvbG9yLmhzdlRvSFNMKGNsb25lZENvbG9yIGFzIEhTVik7XG5cdFx0XHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0XHRcdHJldHVybiBoZWxwZXJzLmNvbG9yLmxhYlRvSFNMKGNsb25lZENvbG9yIGFzIExBQik7XG5cdFx0XHRcdFx0Y2FzZSAncmdiJzpcblx0XHRcdFx0XHRcdHJldHVybiBoZWxwZXJzLmNvbG9yLnJnYlRvSFNMKGNsb25lZENvbG9yIGFzIFJHQik7XG5cdFx0XHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0XHRcdHJldHVybiBoZWxwZXJzLmNvbG9yLnh5elRvSFNMKGNsb25lZENvbG9yIGFzIFhZWik7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2xvciBmb3JtYXQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGB0b0hTTCgpIGVycm9yOiAke2Vycm9yfWApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Y29udmVydFhZWlN0cmluZ1RvVmFsdWUoeHl6OiBYWVpTdHJpbmdPYmplY3RbJ3ZhbHVlJ10pOiBYWVpbJ3ZhbHVlJ10ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0eDogdXRpbHMuYnJhbmQuYXNYWVpfWChwYXJzZUZsb2F0KHh5ei54KSksXG5cdFx0XHRcdHk6IHV0aWxzLmJyYW5kLmFzWFlaX1kocGFyc2VGbG9hdCh4eXoueSkpLFxuXHRcdFx0XHR6OiB1dGlscy5icmFuZC5hc1hZWl9aKHBhcnNlRmxvYXQoeHl6LnopKVxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGNvbnZlcnRYWVpWYWx1ZVRvU3RyaW5nKHh5ejogWFlaWyd2YWx1ZSddKTogWFlaU3RyaW5nT2JqZWN0Wyd2YWx1ZSddIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHg6IGAke3h5ei54fWAsXG5cdFx0XHRcdHk6IGAke3h5ei55fWAsXG5cdFx0XHRcdHo6IGAke3h5ei56fWBcblx0XHRcdH07XG5cdFx0fSxcblx0XHRnZXRDb2xvclN0cmluZyhjb2xvcjogQ29sb3IpOiBzdHJpbmcgfCBudWxsIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IGZvcm1hdHRlcnMgPSB7XG5cdFx0XHRcdFx0Y215azogKGM6IENNWUspID0+XG5cdFx0XHRcdFx0XHRgY215aygke2MudmFsdWUuY3lhbn0sICR7Yy52YWx1ZS5tYWdlbnRhfSwgJHtjLnZhbHVlLnllbGxvd30sICR7Yy52YWx1ZS5rZXl9KWAsXG5cdFx0XHRcdFx0aGV4OiAoYzogSGV4KSA9PiBjLnZhbHVlLmhleCxcblx0XHRcdFx0XHRoc2w6IChjOiBIU0wpID0+XG5cdFx0XHRcdFx0XHRgaHNsKCR7Yy52YWx1ZS5odWV9LCAke2MudmFsdWUuc2F0dXJhdGlvbn0lLCAke2MudmFsdWUubGlnaHRuZXNzfSUpYCxcblx0XHRcdFx0XHRoc3Y6IChjOiBIU1YpID0+XG5cdFx0XHRcdFx0XHRgaHN2KCR7Yy52YWx1ZS5odWV9LCAke2MudmFsdWUuc2F0dXJhdGlvbn0lLCAke2MudmFsdWUudmFsdWV9JSlgLFxuXHRcdFx0XHRcdGxhYjogKGM6IExBQikgPT5cblx0XHRcdFx0XHRcdGBsYWIoJHtjLnZhbHVlLmx9LCAke2MudmFsdWUuYX0sICR7Yy52YWx1ZS5ifSlgLFxuXHRcdFx0XHRcdHJnYjogKGM6IFJHQikgPT5cblx0XHRcdFx0XHRcdGByZ2IoJHtjLnZhbHVlLnJlZH0sICR7Yy52YWx1ZS5ncmVlbn0sICR7Yy52YWx1ZS5ibHVlfSlgLFxuXHRcdFx0XHRcdHh5ejogKGM6IFhZWikgPT5cblx0XHRcdFx0XHRcdGB4eXooJHtjLnZhbHVlLnh9LCAke2MudmFsdWUueX0sICR7Yy52YWx1ZS56fSlgXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdFx0XHRjYXNlICdjbXlrJzpcblx0XHRcdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmNteWsoY29sb3IpO1xuXHRcdFx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5oZXgoY29sb3IpO1xuXHRcdFx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5oc2woY29sb3IpO1xuXHRcdFx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5oc3YoY29sb3IpO1xuXHRcdFx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5sYWIoY29sb3IpO1xuXHRcdFx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5yZ2IoY29sb3IpO1xuXHRcdFx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy54eXooY29sb3IpO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRzZXJ2aWNlcy5sb2coXG5cdFx0XHRcdFx0XHRcdGBVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQgZm9yICR7Y29sb3J9YCxcblx0XHRcdFx0XHRcdFx0J2Vycm9yJ1xuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdHNlcnZpY2VzLmxvZyhgZ2V0Q29sb3JTdHJpbmcgZXJyb3I6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRnZXRDb252ZXJzaW9uRm48XG5cdFx0XHRGcm9tIGV4dGVuZHMga2V5b2YgQ29sb3JEYXRhQXNzZXJ0aW9uLFxuXHRcdFx0VG8gZXh0ZW5kcyBrZXlvZiBDb2xvckRhdGFBc3NlcnRpb25cblx0XHQ+KFxuXHRcdFx0ZnJvbTogRnJvbSxcblx0XHRcdHRvOiBUb1xuXHRcdCk6XG5cdFx0XHR8ICgodmFsdWU6IENvbG9yRGF0YUFzc2VydGlvbltGcm9tXSkgPT4gQ29sb3JEYXRhQXNzZXJ0aW9uW1RvXSlcblx0XHRcdHwgdW5kZWZpbmVkIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IGZuTmFtZSA9XG5cdFx0XHRcdFx0YCR7ZnJvbX1UbyR7dG9bMF0udG9VcHBlckNhc2UoKSArIHRvLnNsaWNlKDEpfWAgYXMga2V5b2YgdHlwZW9mIGhlbHBlcnMuY29sb3I7XG5cblx0XHRcdFx0aWYgKCEoZm5OYW1lIGluIGhlbHBlcnMuY29sb3IpKSByZXR1cm4gdW5kZWZpbmVkO1xuXG5cdFx0XHRcdGNvbnN0IGNvbnZlcnNpb25GbiA9IGhlbHBlcnMuY29sb3JbZm5OYW1lXSBhcyB1bmtub3duIGFzIChcblx0XHRcdFx0XHRpbnB1dDogQ29sb3JEYXRhQXNzZXJ0aW9uW0Zyb21dXG5cdFx0XHRcdCkgPT4gQ29sb3JEYXRhQXNzZXJ0aW9uW1RvXTtcblxuXHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdHZhbHVlOiBDb2xvckRhdGFBc3NlcnRpb25bRnJvbV1cblx0XHRcdFx0KTogQ29sb3JEYXRhQXNzZXJ0aW9uW1RvXSA9PlxuXHRcdFx0XHRcdHN0cnVjdHVyZWRDbG9uZShjb252ZXJzaW9uRm4odmFsdWUpKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdHNlcnZpY2VzLmxvZyhcblx0XHRcdFx0XHRgRXJyb3IgZ2V0dGluZyBjb252ZXJzaW9uIGZ1bmN0aW9uOiAke2Vycm9yfWAsXG5cdFx0XHRcdFx0J2Vycm9yJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRodWVUb1JHQihwOiBudW1iZXIsIHE6IG51bWJlciwgdDogbnVtYmVyKTogbnVtYmVyIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IGNsb25lZFAgPSB1dGlscy5jb3JlLmNsb25lKHApO1xuXHRcdFx0XHRjb25zdCBjbG9uZWRRID0gdXRpbHMuY29yZS5jbG9uZShxKTtcblxuXHRcdFx0XHRsZXQgY2xvbmVkVCA9IHV0aWxzLmNvcmUuY2xvbmUodCk7XG5cblx0XHRcdFx0aWYgKGNsb25lZFQgPCAwKSBjbG9uZWRUICs9IDE7XG5cdFx0XHRcdGlmIChjbG9uZWRUID4gMSkgY2xvbmVkVCAtPSAxO1xuXHRcdFx0XHRpZiAoY2xvbmVkVCA8IDEgLyA2KVxuXHRcdFx0XHRcdHJldHVybiBjbG9uZWRQICsgKGNsb25lZFEgLSBjbG9uZWRQKSAqIDYgKiBjbG9uZWRUO1xuXHRcdFx0XHRpZiAoY2xvbmVkVCA8IDEgLyAyKSByZXR1cm4gY2xvbmVkUTtcblx0XHRcdFx0aWYgKGNsb25lZFQgPCAyIC8gMylcblx0XHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0Y2xvbmVkUCArIChjbG9uZWRRIC0gY2xvbmVkUCkgKiAoMiAvIDMgLSBjbG9uZWRUKSAqIDZcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBjbG9uZWRQO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0c2VydmljZXMubG9nKGBFcnJvciBjb252ZXJ0aW5nIGh1ZSB0byBSR0I6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRuYXJyb3dUb0NvbG9yKGNvbG9yOiBDb2xvciB8IENvbG9yU3RyaW5nT2JqZWN0KTogQ29sb3IgfCBudWxsIHtcblx0XHRcdGlmICh1dGlscy50eXBlR3VhcmRzLmlzQ29sb3JTdHJpbmcoY29sb3IpKVxuXHRcdFx0XHRyZXR1cm4gY29udmVydENvbG9yU3RyaW5nVG9Db2xvcihjb2xvcik7XG5cblx0XHRcdHN3aXRjaCAoY29sb3IuZm9ybWF0IGFzIENvbG9yU3BhY2VFeHRlbmRlZCkge1xuXHRcdFx0XHRjYXNlICdjbXlrJzpcblx0XHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0Y2FzZSAnaHNsJzpcblx0XHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0Y2FzZSAnc2wnOlxuXHRcdFx0XHRjYXNlICdzdic6XG5cdFx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0dG9Db2xvclZhbHVlUmFuZ2U8VCBleHRlbmRzIGtleW9mIFJhbmdlS2V5TWFwPihcblx0XHRcdHZhbHVlOiBzdHJpbmcgfCBudW1iZXIsXG5cdFx0XHRyYW5nZUtleTogVFxuXHRcdCk6IFJhbmdlS2V5TWFwW1RdIHtcblx0XHRcdHV0aWxzLnZhbGlkYXRlLnJhbmdlKHZhbHVlLCByYW5nZUtleSk7XG5cblx0XHRcdGlmIChyYW5nZUtleSA9PT0gJ0hleFNldCcpIHtcblx0XHRcdFx0cmV0dXJuIHV0aWxzLmJyYW5kLmFzSGV4U2V0KFxuXHRcdFx0XHRcdHZhbHVlIGFzIHN0cmluZ1xuXHRcdFx0XHQpIGFzIHVua25vd24gYXMgUmFuZ2VLZXlNYXBbVF07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB1dGlscy5icmFuZC5hc0JyYW5kZWQodmFsdWUgYXMgbnVtYmVyLCByYW5nZUtleSk7XG5cdFx0fSxcblx0XHR2YWxpZGF0ZUFuZENvbnZlcnRDb2xvcihcblx0XHRcdGNvbG9yOiBDb2xvciB8IENvbG9yU3RyaW5nT2JqZWN0IHwgbnVsbFxuXHRcdCk6IENvbG9yIHwgbnVsbCB7XG5cdFx0XHRjb25zdCBsb2cgPSBzZXJ2aWNlcy5sb2c7XG5cblx0XHRcdGlmICghY29sb3IpIHJldHVybiBudWxsO1xuXG5cdFx0XHRjb25zdCBjb252ZXJ0ZWRDb2xvciA9IHV0aWxzLnR5cGVHdWFyZHMuaXNDb2xvclN0cmluZyhjb2xvcilcblx0XHRcdFx0PyBjb252ZXJ0Q29sb3JTdHJpbmdUb0NvbG9yKGNvbG9yKVxuXHRcdFx0XHQ6IGNvbG9yO1xuXG5cdFx0XHRpZiAoIXV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWUoY29udmVydGVkQ29sb3IpKSB7XG5cdFx0XHRcdGxvZyhcblx0XHRcdFx0XHRgSW52YWxpZCBjb2xvcjogJHtKU09OLnN0cmluZ2lmeShjb252ZXJ0ZWRDb2xvcil9YCxcblx0XHRcdFx0XHQnZXJyb3InXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBjb252ZXJ0ZWRDb2xvcjtcblx0XHR9XG5cdH07XG59XG4iXX0=