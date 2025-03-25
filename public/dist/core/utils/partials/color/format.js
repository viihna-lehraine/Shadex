import { defaults } from '../../../../config/partials/defaults.js';
import { regex } from '../../../../config/partials/regex.js';

const defaultColors = defaults.colors;
function colorFormattingUtilitiesFactory(format, helpers, services) {
    const { data: { deepClone }, typeGuards } = helpers;
    const { errors, log } = services;
    function formatColorAsCSS(color) {
        errors.handleSync(() => {
            switch (color.format) {
                case 'cmyk':
                    return `cmyk(${color.value.cyan}, ${color.value.magenta}, ${color.value.yellow}, ${color.value.key})`;
                case 'hex':
                    return String(color.value.hex);
                case 'hsl':
                    return `hsl(${Math.round(color.value.hue)},
								${Math.round(color.value.saturation)}%,
								${Math.round(color.value.lightness)}%)`;
                case 'rgb':
                    return `rgb(${color.value.red}, ${color.value.green}, ${color.value.blue})`;
                default:
                    console.error(`Unexpected color format`);
                    return defaults.colors.hexCSS;
            }
        }, 'Error formatting color as CSS');
        return defaults.colors.hexCSS;
    }
    function formatColorAsStringMap(color) {
        errors.handleSync(() => {
            const clonedColor = deepClone(color);
            if (typeGuards.isHex(clonedColor)) {
                return {
                    format: 'hex',
                    value: {
                        hex: `${clonedColor.value.hex}`
                    }
                };
            }
            else if (typeGuards.isColorStringMap(clonedColor)) {
                log.info(`Already formatted as color string: ${JSON.stringify(color)}`, `formatColorAsStringMap`);
                return clonedColor;
            }
            else if (typeGuards.isCMYK(clonedColor)) {
                const newValue = format.formatPercentageValues(clonedColor.value);
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
            else if (typeGuards.isHSL(clonedColor)) {
                const newValue = format.formatPercentageValues(clonedColor.value);
                return {
                    format: 'hsl',
                    value: {
                        hue: `${newValue.hue}`,
                        saturation: `${newValue.saturation}%`,
                        lightness: `${newValue.lightness}%`
                    }
                };
            }
            else if (typeGuards.isRGB(clonedColor)) {
                const newValue = format.formatPercentageValues(clonedColor.value);
                return {
                    format: 'rgb',
                    value: {
                        red: `${newValue.red}`,
                        green: `${newValue.green}`,
                        blue: `${newValue.blue}`
                    }
                };
            }
            else {
                log.warn(`Unsupported format: ${clonedColor}`, `formatColorAsStringMap`);
                return defaultColors.hslString;
            }
        }, 'Error formatting color as string map');
        return defaults.colors.hexString;
    }
    function formatCSSAsColor(color) {
        errors.handleSync(() => {
            color = color.trim().toLowerCase();
            const cmykMatch = color.match(regex.css.cmyk);
            const hslMatch = color.match(regex.css.hsl);
            const rgbMatch = color.match(regex.css.rgb);
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
                    : format.convertShortHexToLong(color);
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
            return null;
        }, 'Error formatting CSS as color');
        return null;
    }
    const colorFormattingUtilities = {
        formatColorAsCSS,
        formatColorAsStringMap,
        formatCSSAsColor
    };
    return errors.handleSync(() => colorFormattingUtilities, 'Error creating color formatting utilities sub-group.');
}

export { colorFormattingUtilitiesFactory };
//# sourceMappingURL=format.js.map
