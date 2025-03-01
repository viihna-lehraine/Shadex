import '../../config/partials/defaults.js';
import { regex } from '../../config/partials/regex.js';
import { sets } from '../../config/partials/sets.js';

// File: core/utils/validate.ts
function validationUtilitiesFactory(helpers, services) {
    const { data: { deepClone } } = helpers;
    const { errors } = services;
    function colorInput(color) {
        return errors.handleSync(() => {
            if (typeof color !== 'string' || !color.trim()) {
                return false;
            }
            const normalizedColor = color.trim().toLowerCase();
            return (regex.userInput.hex.test(normalizedColor) ||
                regex.userInput.hsl.test(normalizedColor) ||
                regex.userInput.rgb.test(normalizedColor));
        }, `Error occurred while validating color input from DOM: ${color}`);
    }
    function colorValue(color) {
        return errors.handleSync(() => {
            const clonedColor = deepClone(color);
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
                    const isValidHSLSaturation = normalizePercentage(clonedColor.value.saturation) >= 0 &&
                        normalizePercentage(clonedColor.value.saturation) <= 100;
                    const isValidHSLLightness = clonedColor.value.lightness
                        ? normalizePercentage(clonedColor.value.lightness) >= 0 &&
                            normalizePercentage(clonedColor.value.lightness) <= 100
                        : true;
                    return isValidHSLHue && isValidHSLSaturation && isValidHSLLightness;
                case 'hsv':
                    const isValidHSVHue = isNumericValid(clonedColor.value.hue) &&
                        clonedColor.value.hue >= 0 &&
                        clonedColor.value.hue <= 360;
                    const isValidHSVSaturation = normalizePercentage(clonedColor.value.saturation) >= 0 &&
                        normalizePercentage(clonedColor.value.saturation) <= 100;
                    const isValidHSVValue = clonedColor.value.value
                        ? normalizePercentage(clonedColor.value.value) >= 0 &&
                            normalizePercentage(clonedColor.value.value) <= 100
                        : true;
                    return isValidHSVHue && isValidHSVSaturation && isValidHSVValue;
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
                    return ([clonedColor.value.saturation, clonedColor.value.lightness].every(isNumericValid) &&
                        clonedColor.value.saturation >= 0 &&
                        clonedColor.value.saturation <= 100 &&
                        clonedColor.value.lightness >= 0 &&
                        clonedColor.value.lightness <= 100);
                case 'sv':
                    return ([clonedColor.value.saturation, clonedColor.value.value].every(isNumericValid) &&
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
        }, `Error occurred while validating color value: ${JSON.stringify(color)}`);
    }
    function ensureHash(value) {
        return errors.handleSync(() => {
            return value.startsWith('#') ? value : `#${value}`;
        }, `Error occurred while ensuring hash for value: ${value}`);
    }
    function hex(value, pattern) {
        return errors.handleSync(() => {
            return pattern.test(value);
        }, `Error occurred while validating hex value: ${value}`);
    }
    function hexComponent(value) {
        return errors.handleSync(() => {
            return hex(value, regex.validation.hexComponent);
        }, `Error occurred while validating hex component: ${value}`);
    }
    function hexSet(value) {
        return errors.handleSync(() => {
            return regex.validation.hex.test(value);
        }, `Error occurred while validating hex set: ${value}`);
    }
    function range(value, rangeKey) {
        return errors.handleSync(() => {
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
        }, `Error occurred while validating range for ${String(rangeKey)}: ${value}`);
    }
    const validationUtilities = {
        colorInput,
        colorValue,
        ensureHash,
        hex,
        hexComponent,
        hexSet,
        range
    };
    return errors.handleSync(() => validationUtilities, 'Error occurred while creating validation utilities group.');
}

export { validationUtilitiesFactory };
//# sourceMappingURL=validate.js.map
