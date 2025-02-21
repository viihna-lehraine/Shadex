import { regex, config } from '../../config/index.js';

// File: common/utils/validate.js
const sets = config.sets;
function validationUtilsFactory(helpers) {
    const { clone } = helpers.data;
    function hex(value, pattern) {
        return pattern.test(value);
    }
    function hexSet(value) {
        return regex.validation.hex.test(value);
    }
    return {
        hex,
        hexSet,
        colorValue(color) {
            const clonedColor = clone(color);
            const isNumericValid = (value) => typeof value === 'number' && !isNaN(value);
            const normalizePercentage = (value) => {
                if (typeof value === 'string' && value.endsWith('%')) {
                    return parseFloat(value.slice(0, -1));
                }
                return typeof value === 'number' ? value : NaN;
            };
            switch (clonedColor.format) {
                case 'cmyk':
                    return ([
                        clonedColor.value.cyan,
                        clonedColor.value.magenta,
                        clonedColor.value.yellow,
                        clonedColor.value.key
                    ].every(isNumericValid) &&
                        clonedColor.value.cyan >= 0 &&
                        clonedColor.value.cyan <= 100 &&
                        clonedColor.value.magenta >= 0 &&
                        clonedColor.value.magenta <= 100 &&
                        clonedColor.value.yellow >= 0 &&
                        clonedColor.value.yellow <= 100 &&
                        clonedColor.value.key >= 0 &&
                        clonedColor.value.key <= 100);
                case 'hex':
                    return regex.validation.hex.test(clonedColor.value.hex);
                case 'hsl':
                    const isValidHSLHue = isNumericValid(clonedColor.value.hue) &&
                        clonedColor.value.hue >= 0 &&
                        clonedColor.value.hue <= 360;
                    const isValidHSLSaturation = normalizePercentage(clonedColor.value.saturation) >=
                        0 &&
                        normalizePercentage(clonedColor.value.saturation) <=
                            100;
                    const isValidHSLLightness = clonedColor.value.lightness
                        ? normalizePercentage(clonedColor.value.lightness) >=
                            0 &&
                            normalizePercentage(clonedColor.value.lightness) <=
                                100
                        : true;
                    return (isValidHSLHue &&
                        isValidHSLSaturation &&
                        isValidHSLLightness);
                case 'hsv':
                    const isValidHSVHue = isNumericValid(clonedColor.value.hue) &&
                        clonedColor.value.hue >= 0 &&
                        clonedColor.value.hue <= 360;
                    const isValidHSVSaturation = normalizePercentage(clonedColor.value.saturation) >=
                        0 &&
                        normalizePercentage(clonedColor.value.saturation) <=
                            100;
                    const isValidHSVValue = clonedColor.value.value
                        ? normalizePercentage(clonedColor.value.value) >= 0 &&
                            normalizePercentage(clonedColor.value.value) <= 100
                        : true;
                    return (isValidHSVHue && isValidHSVSaturation && isValidHSVValue);
                case 'lab':
                    return ([
                        clonedColor.value.l,
                        clonedColor.value.a,
                        clonedColor.value.b
                    ].every(isNumericValid) &&
                        clonedColor.value.l >= 0 &&
                        clonedColor.value.l <= 100 &&
                        clonedColor.value.a >= -125 &&
                        clonedColor.value.a <= 125 &&
                        clonedColor.value.b >= -125 &&
                        clonedColor.value.b <= 125);
                case 'rgb':
                    return ([
                        clonedColor.value.red,
                        clonedColor.value.green,
                        clonedColor.value.blue
                    ].every(isNumericValid) &&
                        clonedColor.value.red >= 0 &&
                        clonedColor.value.red <= 255 &&
                        clonedColor.value.green >= 0 &&
                        clonedColor.value.green <= 255 &&
                        clonedColor.value.blue >= 0 &&
                        clonedColor.value.blue <= 255);
                case 'sl':
                    return ([
                        clonedColor.value.saturation,
                        clonedColor.value.lightness
                    ].every(isNumericValid) &&
                        clonedColor.value.saturation >= 0 &&
                        clonedColor.value.saturation <= 100 &&
                        clonedColor.value.lightness >= 0 &&
                        clonedColor.value.lightness <= 100);
                case 'sv':
                    return ([
                        clonedColor.value.saturation,
                        clonedColor.value.value
                    ].every(isNumericValid) &&
                        clonedColor.value.saturation >= 0 &&
                        clonedColor.value.saturation <= 100 &&
                        clonedColor.value.value >= 0 &&
                        clonedColor.value.value <= 100);
                case 'xyz':
                    return ([
                        clonedColor.value.x,
                        clonedColor.value.y,
                        clonedColor.value.z
                    ].every(isNumericValid) &&
                        clonedColor.value.x >= 0 &&
                        clonedColor.value.x <= 95.047 &&
                        clonedColor.value.y >= 0 &&
                        clonedColor.value.y <= 100.0 &&
                        clonedColor.value.z >= 0 &&
                        clonedColor.value.z <= 108.883);
                default:
                    console.error(`Unsupported color format: ${color.format}`);
                    return false;
            }
        },
        ensureHash(value) {
            return value.startsWith('#') ? value : `#${value}`;
        },
        hexComponent(value) {
            return hex(value, regex.validation.hexComponent);
        },
        range(value, rangeKey) {
            if (rangeKey === 'HexSet') {
                if (!hexSet(value)) {
                    throw new Error(`Invalid value for ${String(rangeKey)}: ${value}`);
                }
                return;
            }
            if (typeof value === 'number' && Array.isArray(sets[rangeKey])) {
                const [min, max] = sets[rangeKey];
                if (value < min || value > max) {
                    throw new Error(`Value ${value} is out of range for ${String(rangeKey)} [${min}, ${max}]`);
                }
                return;
            }
            throw new Error(`Invalid range or value for ${String(rangeKey)}`);
        },
        userColorInput(color) {
            return (regex.userInput.hex.test(color) ||
                regex.userInput.hsl.test(color) ||
                regex.userInput.rgb.test(color));
        }
    };
}

export { validationUtilsFactory };
//# sourceMappingURL=validate.js.map
