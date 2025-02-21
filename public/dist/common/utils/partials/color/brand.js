import { defaults } from '../../../../config/index.js';

// File: common/utils/partials/color/brand.ts
const defaultColors = defaults.colors;
function colorBrandingUtilsFactory(helpers, utils) {
    const { clone, parseValue } = helpers.data;
    const { brand } = utils;
    return {
        brandCMYKStringMapValue(cmyk) {
            return {
                cyan: brand.asPercentile(parseFloat(cmyk.cyan) / 100),
                magenta: brand.asPercentile(parseFloat(cmyk.magenta) / 100),
                yellow: brand.asPercentile(parseFloat(cmyk.yellow) / 100),
                key: brand.asPercentile(parseFloat(cmyk.key) / 100)
            };
        },
        brandColorStringMap(color) {
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
        },
        brandHexStringMapValue(hex) {
            return { hex: utils.brand.asHexSet(hex.hex) };
        },
        brandHSLStringMapValue(hsl) {
            return {
                hue: utils.brand.asRadial(parseFloat(hsl.hue)),
                saturation: utils.brand.asPercentile(parseFloat(hsl.saturation) / 100),
                lightness: utils.brand.asPercentile(parseFloat(hsl.lightness) / 100)
            };
        },
        brandHSVStringMapValue(hsv) {
            return {
                hue: utils.brand.asRadial(parseFloat(hsv.hue)),
                saturation: utils.brand.asPercentile(parseFloat(hsv.saturation) / 100),
                value: utils.brand.asPercentile(parseFloat(hsv.value) / 100)
            };
        },
        brandLABStringMapValue(lab) {
            return {
                l: utils.brand.asLAB_L(parseFloat(lab.l)),
                a: utils.brand.asLAB_A(parseFloat(lab.a)),
                b: utils.brand.asLAB_B(parseFloat(lab.b))
            };
        },
        brandRGBStringMapValue(rgb) {
            return {
                red: utils.brand.asByteRange(parseFloat(rgb.red)),
                green: utils.brand.asByteRange(parseFloat(rgb.green)),
                blue: utils.brand.asByteRange(parseFloat(rgb.blue))
            };
        },
        brandXYZStringMapValue(xyz) {
            return {
                x: utils.brand.asXYZ_X(parseFloat(xyz.x)),
                y: utils.brand.asXYZ_Y(parseFloat(xyz.y)),
                z: utils.brand.asXYZ_Z(parseFloat(xyz.z))
            };
        }
    };
}

export { colorBrandingUtilsFactory };
//# sourceMappingURL=brand.js.map
