import { defaults } from '../../../../config/partials/defaults.js';
import '../../../../config/partials/regex.js';

const defaultColors = defaults.colors;
function colorBrandingUtilitiesFactory(brand, helpers, services) {
    const { data: { deepClone, parseValue } } = helpers;
    const { errors, log } = services;
    function brandCMYKString(cmyk) {
        return errors.handleSync(() => {
            return {
                cyan: brand.asPercentile(parseFloat(cmyk.cyan) / 100),
                magenta: brand.asPercentile(parseFloat(cmyk.magenta) / 100),
                yellow: brand.asPercentile(parseFloat(cmyk.yellow) / 100),
                key: brand.asPercentile(parseFloat(cmyk.key) / 100)
            };
        }, 'Error occurred while branding CMYK string.');
    }
    function brandColorString(color) {
        return errors.handleSync(() => {
            const clonedColor = deepClone(color);
            const newValue = Object.entries(clonedColor.value).reduce((acc, [key, val]) => {
                acc[key] =
                    parseValue(val);
                return acc;
            }, {});
            switch (clonedColor.format) {
                case 'cmyk':
                    return { format: 'cmyk', value: newValue };
                case 'hsl':
                    return { format: 'hsl', value: newValue };
                default:
                    log.error('Unsupported format for colorStringToColor', 'utils.color.brandColorString');
                    const unbrandedHSL = defaultColors.hsl;
                    const brandedHue = brand.asRadial(unbrandedHSL.value.hue);
                    const brandedSaturation = brand.asPercentile(unbrandedHSL.value.saturation);
                    const brandedLightness = brand.asPercentile(unbrandedHSL.value.lightness);
                    return {
                        value: {
                            hue: brandedHue,
                            saturation: brandedSaturation,
                            lightness: brandedLightness
                        },
                        format: 'hsl'
                    };
            }
        }, 'Error occurred while branding color string map value.');
    }
    function brandHexString(hex) {
        return errors.handleSync(() => {
            return { hex: brand.asHexSet(hex.hex) };
        }, 'Error occurred while branding hex string.');
    }
    function brandHSLString(hsl) {
        return errors.handleSync(() => {
            return {
                hue: brand.asRadial(parseFloat(hsl.hue)),
                saturation: brand.asPercentile(parseFloat(hsl.saturation) / 100),
                lightness: brand.asPercentile(parseFloat(hsl.lightness) / 100)
            };
        }, 'Error occurred while branding HSL string.');
    }
    function brandRGBString(rgb) {
        return errors.handleSync(() => {
            return {
                red: brand.asByteRange(parseFloat(rgb.red)),
                green: brand.asByteRange(parseFloat(rgb.green)),
                blue: brand.asByteRange(parseFloat(rgb.blue))
            };
        }, 'Error occurred while branding RGB string.');
    }
    const colorBrandingUtilities = {
        brandCMYKString,
        brandColorString,
        brandHexString,
        brandHSLString,
        brandRGBString
    };
    return errors.handleSync(() => colorBrandingUtilities, 'Error creating color branding utilities sub-group.');
}

export { colorBrandingUtilitiesFactory };
//# sourceMappingURL=brand.js.map
