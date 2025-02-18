import { data } from '../../data/index.js';

// File: common/utils/formatting.js
const defaultColors = data.defaults.colors;
function createFormattingUtils(services, utils) {
    const parseColor = (colorSpace, value) => {
        const log = services.log;
        try {
            switch (colorSpace) {
                case 'cmyk': {
                    const [c, m, y, k] = parseComponents(value, 5);
                    return {
                        value: {
                            cyan: utils.brand.asPercentile(c),
                            magenta: utils.brand.asPercentile(m),
                            yellow: utils.brand.asPercentile(y),
                            key: utils.brand.asPercentile(k)
                        },
                        format: 'cmyk'
                    };
                }
                case 'hex':
                    const hexValue = value.startsWith('#')
                        ? value
                        : `#${value}`;
                    return {
                        value: {
                            hex: utils.brand.asHexSet(hexValue)
                        },
                        format: 'hex'
                    };
                case 'hsl': {
                    const [h, s, l] = parseComponents(value, 4);
                    return {
                        value: {
                            hue: utils.brand.asRadial(h),
                            saturation: utils.brand.asPercentile(s),
                            lightness: utils.brand.asPercentile(l)
                        },
                        format: 'hsl'
                    };
                }
                case 'hsv': {
                    const [h, s, v] = parseComponents(value, 4);
                    return {
                        value: {
                            hue: utils.brand.asRadial(h),
                            saturation: utils.brand.asPercentile(s),
                            value: utils.brand.asPercentile(v)
                        },
                        format: 'hsv'
                    };
                }
                case 'lab': {
                    const [l, a, b] = parseComponents(value, 4);
                    return {
                        value: {
                            l: utils.brand.asLAB_L(l),
                            a: utils.brand.asLAB_A(a),
                            b: utils.brand.asLAB_B(b)
                        },
                        format: 'lab'
                    };
                }
                case 'rgb': {
                    const components = value.split(',').map(Number);
                    if (components.some(isNaN))
                        throw new Error('Invalid RGB format');
                    const [r, g, b] = components;
                    return {
                        value: {
                            red: utils.brand.asByteRange(r),
                            green: utils.brand.asByteRange(g),
                            blue: utils.brand.asByteRange(b)
                        },
                        format: 'rgb'
                    };
                }
                default:
                    const message = `Unsupported color format: ${colorSpace}`;
                    log('warn', `Failed to parse color: ${message}`, `formattingUtils.parseColor()`);
                    return null;
            }
        }
        catch (error) {
            log('warn', `parseColor error: ${error}`, `formattingUtils.parseColor()`);
            return null;
        }
    };
    function parseComponents(value, count) {
        const log = services.log;
        try {
            const components = value
                .split(',')
                .map(val => val.trim().endsWith('%')
                ? parseFloat(val)
                : parseFloat(val) * 100);
            if (components.length !== count) {
                log('error', `Expected ${count} components.`, 'formattingUtils.parseComponents()');
                return [];
            }
            return components;
        }
        catch (error) {
            log('error', `Error parsing components: ${error}`, 'formattingUtils.parseComponents()');
            return [];
        }
    }
    return {
        parseColor,
        parseComponents,
        addHashToHex(hex) {
            try {
                return hex.value.hex.startsWith('#')
                    ? hex
                    : {
                        value: {
                            hex: utils.brand.asHexSet(`#${hex.value}}`)
                        },
                        format: 'hex'
                    };
            }
            catch (error) {
                throw new Error(`addHashToHex error: ${error}`);
            }
        },
        componentToHex(component) {
            const log = services.log;
            try {
                const hex = Math.max(0, Math.min(255, component)).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }
            catch (error) {
                log('error', `componentToHex error: ${error}`, 'formattingUtils.componentToHex()');
                return '00';
            }
        },
        convertShortHexToLong(hex) {
            if (hex.length !== 4)
                return hex;
            return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        },
        formatPercentageValues(value) {
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
        },
        hslAddFormat(value) {
            const log = services.log;
            try {
                if (!utils.validate.colorValue({ value: value, format: 'hsl' })) {
                    log('error', `Invalid HSL value ${JSON.stringify(value)}`, 'formattingUtils.hslAddFormat()');
                    return defaultColors.hsl;
                }
                return { value: value, format: 'hsl' };
            }
            catch (error) {
                log('error', `Error adding HSL format: ${error}`, 'formattingUtils.hslAddFormat()');
                return defaultColors.hsl;
            }
        },
        stripHashFromHex(hex) {
            const log = services.log;
            try {
                const hexString = `${hex.value.hex}`;
                return hex.value.hex.startsWith('#')
                    ? {
                        value: {
                            hex: utils.brand.asHexSet(hexString.slice(1))
                        },
                        format: 'hex'
                    }
                    : hex;
            }
            catch (error) {
                log('error', `stripHashFromHex error: ${error}`, 'formattingUtils.stripHashFromHex()');
                return defaultColors.hex;
            }
        },
        stripPercentFromValues(value) {
            return Object.entries(value).reduce((acc, [key, val]) => {
                const parsedValue = typeof val === 'string' && val.endsWith('%')
                    ? parseFloat(val.slice(0, -1))
                    : val;
                acc[key] =
                    parsedValue;
                return acc;
            }, {});
        }
    };
}

export { createFormattingUtils };
//# sourceMappingURL=format.js.map
