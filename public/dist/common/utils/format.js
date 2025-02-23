import { defaults } from '../../config/partials/defaults.js';
import '../../config/partials/regex.js';

// File: common/utils/formatting.ts
const defaultColors = defaults.colors;
function formattingUtilsFactory(brand, services, validate) {
    const { errors, log } = services;
    const parseColor = (colorSpace, value) => errors.handleSync(() => {
        switch (colorSpace) {
            case 'cmyk': {
                const [c, m, y, k] = parseComponents(value, 5);
                return {
                    value: {
                        cyan: brand.asPercentile(c),
                        magenta: brand.asPercentile(m),
                        yellow: brand.asPercentile(y),
                        key: brand.asPercentile(k)
                    },
                    format: 'cmyk'
                };
            }
            case 'hex': {
                const hexValue = value.startsWith('#')
                    ? value
                    : `#${value}`;
                return {
                    value: {
                        hex: brand.asHexSet(hexValue)
                    },
                    format: 'hex'
                };
            }
            case 'hsl': {
                const [h, s, l] = parseComponents(value, 4);
                return {
                    value: {
                        hue: brand.asRadial(h),
                        saturation: brand.asPercentile(s),
                        lightness: brand.asPercentile(l)
                    },
                    format: 'hsl'
                };
            }
            case 'hsv': {
                const [h, s, v] = parseComponents(value, 4);
                return {
                    value: {
                        hue: brand.asRadial(h),
                        saturation: brand.asPercentile(s),
                        value: brand.asPercentile(v)
                    },
                    format: 'hsv'
                };
            }
            case 'lab': {
                const [l, a, b] = parseComponents(value, 4);
                return {
                    value: {
                        l: brand.asLAB_L(l),
                        a: brand.asLAB_A(a),
                        b: brand.asLAB_B(b)
                    },
                    format: 'lab'
                };
            }
            case 'rgb': {
                const components = value.split(',').map(Number);
                if (components.some(isNaN)) {
                    throw new Error(`Invalid RGB format for value: ${value}`);
                }
                const [r, g, b] = components;
                return {
                    value: {
                        red: brand.asByteRange(r),
                        green: brand.asByteRange(g),
                        blue: brand.asByteRange(b)
                    },
                    format: 'rgb'
                };
            }
            default: {
                const message = `Unsupported color format: ${colorSpace}`;
                log(`Failed to parse color: ${message}`, {
                    caller: 'utils.format.parseColor',
                    level: 'error'
                });
                return null;
            }
        }
    }, 'Error parsing color', { context: { colorSpace, value }, fallback: null });
    function addHashToHex(hex) {
        return errors.handleSync(() => {
            return hex.value.hex.startsWith('#')
                ? hex
                : {
                    value: {
                        hex: brand.asHexSet(`#${hex.value}}`)
                    },
                    format: 'hex'
                };
        }, 'Error occurred while adding hash to hex color.');
    }
    function componentToHex(component) {
        return errors.handleSync(() => {
            const hex = Math.max(0, Math.min(255, component)).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }, 'Error occurred while converting component to hex partial.');
    }
    function convertShortHexToLong(hex) {
        return errors.handleSync(() => {
            if (hex.length !== 4)
                return hex;
            return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        }, 'Error occurred while converting short hex to long hex.');
    }
    function formatPercentageValues(value) {
        return errors.handleSync(() => {
            return Object.entries(value).reduce((acc, [key, val]) => {
                acc[key] = [
                    'saturation',
                    'lightness',
                    'value',
                    'cyan',
                    'magenta',
                    'yellow',
                    'key'
                ].includes(key)
                    ? `${val}%`
                    : val;
                return acc;
            }, {});
        }, 'Error formatting percentage values', { context: { value } });
    }
    function hslAddFormat(value) {
        return errors.handleSync(() => {
            if (!validate.colorValue({
                value: value,
                format: 'hsl'
            })) {
                log(`Invalid HSL value ${JSON.stringify(value)}`, {
                    caller: 'utils.format.hslAddFormat',
                    level: 'error'
                });
                return defaultColors.hsl;
            }
            return { value: value, format: 'hsl' };
        }, 'Error occurred while adding format to HSL value.');
    }
    function parseComponents(value, count) {
        return errors.handleSync(() => {
            const components = value
                .split(',')
                .map(val => val.trim().endsWith('%')
                ? parseFloat(val)
                : parseFloat(val) * 100);
            if (components.length !== count) {
                log(`Expected ${count} components.`, {
                    caller: 'utils.format.parseComponents',
                    level: 'error'
                });
                return [];
            }
            return components;
        }, 'Error occurred while parsing components.');
    }
    function stripHashFromHex(hex) {
        return errors.handleSync(() => {
            const hexString = `${hex.value.hex}`;
            return hex.value.hex.startsWith('#')
                ? {
                    value: {
                        hex: brand.asHexSet(hexString.slice(1))
                    },
                    format: 'hex'
                }
                : hex;
        }, 'Error occurred while stripping hash from hex color.');
    }
    function stripPercentFromValues(value) {
        return errors.handleSync(() => {
            return Object.entries(value).reduce((acc, [key, val]) => {
                const parsedValue = typeof val === 'string' && val.endsWith('%')
                    ? parseFloat(val.slice(0, -1))
                    : val;
                acc[key] =
                    parsedValue;
                return acc;
            }, {});
        }, 'Error occurred while stripping percent from values.', { context: value });
    }
    const formattingUtils = {
        addHashToHex,
        componentToHex,
        convertShortHexToLong,
        formatPercentageValues,
        hslAddFormat,
        parseColor,
        parseComponents,
        stripHashFromHex,
        stripPercentFromValues
    };
    return errors.handleSync(() => formattingUtils, 'Error occurred while creating formatting utilities group.');
}

export { formattingUtilsFactory };
//# sourceMappingURL=format.js.map
