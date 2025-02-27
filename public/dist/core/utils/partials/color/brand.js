import { defaults } from '../../../../config/partials/defaults.js';
import '../../../../config/partials/regex.js';

// File: core/utils/partials/color/brand.ts
const defaultColors = defaults.colors;
function colorBrandingUtilitiesFactory(brand, helpers, services) {
    const { data: { clone, parseValue } } = helpers;
    const { errors, log } = services;
    function brandColorString(color) {
        return errors.handleSync(() => {
            const clonedColor = clone(color);
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
                case 'hsv':
                    return { format: 'hsv', value: newValue };
                case 'sl':
                    return { format: 'sl', value: newValue };
                case 'sv':
                    return { format: 'sv', value: newValue };
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
    function brandHSVString(hsv) {
        return errors.handleSync(() => {
            return {
                hue: brand.asRadial(parseFloat(hsv.hue)),
                saturation: brand.asPercentile(parseFloat(hsv.saturation) / 100),
                value: brand.asPercentile(parseFloat(hsv.value) / 100)
            };
        }, 'Error occurred while branding HSV string.');
    }
    function brandLABString(lab) {
        return errors.handleSync(() => {
            return {
                l: brand.asLAB_L(parseFloat(lab.l)),
                a: brand.asLAB_A(parseFloat(lab.a)),
                b: brand.asLAB_B(parseFloat(lab.b))
            };
        }, 'Error occurred while branding LAB string.');
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
    function brandXYZString(xyz) {
        return errors.handleSync(() => {
            return {
                x: brand.asXYZ_X(parseFloat(xyz.x)),
                y: brand.asXYZ_Y(parseFloat(xyz.y)),
                z: brand.asXYZ_Z(parseFloat(xyz.z))
            };
        }, 'Error occurred while branding XYZ string.');
    }
    const colorBrandingUtilities = {
        brandCMYKString,
        brandColorString,
        brandHexString,
        brandHSLString,
        brandHSVString,
        brandLABString,
        brandRGBString,
        brandXYZString
    };
    return errors.handleSync(() => colorBrandingUtilities, 'Error creating color branding utilities sub-group.');
}

export { colorBrandingUtilitiesFactory };
//# sourceMappingURL=brand.js.map
