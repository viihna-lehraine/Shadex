import { paletteConfig, config, defaults } from '../../config/index.js';

// File: common/utils/adjust.js
const adjustments = paletteConfig.adjustment;
const defaultColors = defaults.colors;
const math = config.math;
function adjustmentUtilsFactory(services, utils) {
    const { log } = services;
    return {
        applyGammaCorrection(value) {
            try {
                return value > 0.0031308
                    ? 1.055 * Math.pow(value, 1 / 2.4) - 0.055
                    : 12.92 * value;
            }
            catch (error) {
                log(`Error applying gamma correction: ${error}`, 'error');
                return value;
            }
        },
        clampRGB(rgb) {
            const defaultRGB = defaultColors.rgb;
            if (!utils.validate.colorValue(rgb)) {
                log(`Invalid RGB value ${JSON.stringify(rgb)}`, 'error');
                return defaultRGB;
            }
            try {
                return {
                    value: {
                        red: utils.brand.asByteRange(Math.round(Math.min(Math.max(0, rgb.value.red), 1) * 255)),
                        green: utils.brand.asByteRange(Math.round(Math.min(Math.max(0, rgb.value.green), 1) * 255)),
                        blue: utils.brand.asByteRange(Math.round(Math.min(Math.max(0, rgb.value.blue), 1) * 255))
                    },
                    format: 'rgb'
                };
            }
            catch (error) {
                log(`Error clamping RGB values: ${error}`, 'error');
                return rgb;
            }
        },
        clampXYZ(value, maxValue) {
            return Math.max(0, Math.min(maxValue + math.epsilon, value));
        },
        normalizeXYZ(value, reference) {
            return value / reference;
        },
        sl(color) {
            try {
                if (!utils.validate.colorValue(color)) {
                    log('Invalid color valus for adjustment.', 'error');
                    return color;
                }
                const adjustedSaturation = Math.min(Math.max(color.value.saturation + adjustments.slaValue, 0), 100);
                const adjustedLightness = Math.min(100);
                return {
                    value: {
                        hue: color.value.hue,
                        saturation: utils.brand.asPercentile(adjustedSaturation),
                        lightness: utils.brand.asPercentile(adjustedLightness)
                    },
                    format: 'hsl'
                };
            }
            catch (error) {
                log(`Error adjusting saturation and lightness: ${error}`, 'error');
                return color;
            }
        }
    };
}

export { adjustmentUtilsFactory };
//# sourceMappingURL=adjust.js.map
