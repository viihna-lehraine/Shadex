import { configData } from '../../data/config.js';

// File: common/utils/brand.js
const regex = configData.regex;
function createBrandingUtils(utils) {
    function asByteRange(value) {
        utils.validate.range(value, 'ByteRange');
        return value;
    }
    function asHexSet(value) {
        if (regex.brand.hex.test(value)) {
            value = value.slice(0, 7);
        }
        if (!utils.validate.hexSet(value)) {
            throw new Error(`Invalid HexSet value: ${value}`);
        }
        return value;
    }
    function asLAB_A(value) {
        utils.validate.range(value, 'LAB_A');
        return value;
    }
    function asLAB_B(value) {
        utils.validate.range(value, 'LAB_B');
        return value;
    }
    function asLAB_L(value) {
        utils.validate.range(value, 'LAB_L');
        return value;
    }
    function asPercentile(value) {
        utils.validate.range(value, 'Percentile');
        return value;
    }
    function asRadial(value) {
        utils.validate.range(value, 'Radial');
        return value;
    }
    function asXYZ_X(value) {
        utils.validate.range(value, 'XYZ_X');
        return value;
    }
    function asXYZ_Y(value) {
        utils.validate.range(value, 'XYZ_Y');
        return value;
    }
    function asXYZ_Z(value) {
        utils.validate.range(value, 'XYZ_Z');
        return value;
    }
    return {
        asByteRange,
        asHexSet,
        asLAB_A,
        asLAB_B,
        asLAB_L,
        asPercentile,
        asRadial,
        asXYZ_X,
        asXYZ_Y,
        asXYZ_Z,
        asBranded(value, rangeKey) {
            utils.validate.range(value, rangeKey);
            return value;
        },
        asCMYK(color) {
            const brandedCyan = asPercentile(color.value.cyan);
            const brandedMagenta = asPercentile(color.value.magenta);
            const brandedYellow = asPercentile(color.value.yellow);
            const brandedKey = asPercentile(color.value.key);
            return {
                value: {
                    cyan: brandedCyan,
                    magenta: brandedMagenta,
                    yellow: brandedYellow,
                    key: brandedKey
                },
                format: 'cmyk'
            };
        },
        asHex(color) {
            let hex = color.value.hex;
            if (!hex.startsWith('#'))
                hex = `#${hex}`;
            if (!regex.brand.hex.test(hex))
                throw new Error(`Invalid Hex color format: ${hex}`);
            const hexRaw = hex.slice(0, 7);
            const brandedHex = utils.brand.asHexSet(hexRaw);
            return {
                value: { hex: brandedHex },
                format: 'hex'
            };
        },
        asHSL(color) {
            const brandedHue = asRadial(color.value.hue);
            const brandedSaturation = asPercentile(color.value.saturation);
            const brandedLightness = asPercentile(color.value.lightness);
            return {
                value: {
                    hue: brandedHue,
                    saturation: brandedSaturation,
                    lightness: brandedLightness
                },
                format: 'hsl'
            };
        },
        asHSV(color) {
            const brandedHue = asRadial(color.value.hue);
            const brandedSaturation = asPercentile(color.value.saturation);
            const brandedValue = asPercentile(color.value.value);
            return {
                value: {
                    hue: brandedHue,
                    saturation: brandedSaturation,
                    value: brandedValue
                },
                format: 'hsv'
            };
        },
        asLAB(color) {
            const brandedL = asLAB_L(color.value.l);
            const brandedA = asLAB_A(color.value.a);
            const brandedB = asLAB_B(color.value.b);
            return {
                value: {
                    l: brandedL,
                    a: brandedA,
                    b: brandedB
                },
                format: 'lab'
            };
        },
        asRGB(color) {
            const brandedRed = asByteRange(color.value.red);
            const brandedGreen = asByteRange(color.value.green);
            const brandedBlue = asByteRange(color.value.blue);
            return {
                value: {
                    red: brandedRed,
                    green: brandedGreen,
                    blue: brandedBlue
                },
                format: 'rgb'
            };
        },
        asSL(color) {
            const brandedSaturation = asPercentile(color.value.saturation);
            const brandedLightness = asPercentile(color.value.lightness);
            return {
                value: {
                    saturation: brandedSaturation,
                    lightness: brandedLightness
                },
                format: 'sl'
            };
        },
        asSV(color) {
            const brandedSaturation = asPercentile(color.value.saturation);
            const brandedValue = asPercentile(color.value.value);
            return {
                value: {
                    saturation: brandedSaturation,
                    value: brandedValue
                },
                format: 'sv'
            };
        },
        asXYZ(color) {
            const brandedX = asXYZ_X(color.value.x);
            const brandedY = asXYZ_Y(color.value.y);
            const brandedZ = asXYZ_Z(color.value.z);
            return {
                value: {
                    x: brandedX,
                    y: brandedY,
                    z: brandedZ
                },
                format: 'xyz'
            };
        },
        brandColor(color) {
            switch (color.format) {
                case 'cmyk':
                    return {
                        value: {
                            cyan: asPercentile(0),
                            magenta: asPercentile(0),
                            yellow: asPercentile(0),
                            key: asPercentile(0)
                        },
                        format: 'cmyk'
                    };
                case 'hex':
                    return {
                        value: {
                            hex: asHexSet('#000000')
                        },
                        format: 'hex'
                    };
                case 'hsl':
                    return {
                        value: {
                            hue: asRadial(0),
                            saturation: asPercentile(0),
                            lightness: asPercentile(0)
                        },
                        format: 'hsl'
                    };
                case 'hsv':
                    return {
                        value: {
                            hue: asRadial(0),
                            saturation: asPercentile(0),
                            value: asPercentile(0)
                        },
                        format: 'hsv'
                    };
                case 'lab':
                    return {
                        value: {
                            l: asLAB_L(0),
                            a: asLAB_A(0),
                            b: asLAB_B(0)
                        },
                        format: 'lab'
                    };
                case 'rgb':
                    return {
                        value: {
                            red: asByteRange(0),
                            green: asByteRange(0),
                            blue: asByteRange(0)
                        },
                        format: 'rgb'
                    };
                case 'sl':
                    return {
                        value: {
                            saturation: asPercentile(0),
                            lightness: asPercentile(0)
                        },
                        format: 'sl'
                    };
                case 'sv':
                    return {
                        value: {
                            saturation: asPercentile(0),
                            value: asPercentile(0)
                        },
                        format: 'sv'
                    };
                case 'xyz':
                    return {
                        value: {
                            x: asXYZ_X(0),
                            y: asXYZ_Y(0),
                            z: asXYZ_Z(0)
                        },
                        format: 'xyz'
                    };
                default:
                    throw new Error(`
						Unknown color format\nDetails: ${JSON.stringify(color)}`);
            }
        },
        brandPalette(data) {
            return {
                ...data,
                metadata: { ...data.metadata },
                items: data.items.map((item, index) => ({
                    itemID: index + 1,
                    colors: {
                        cmyk: {
                            cyan: asPercentile(item.colors.cmyk.cyan ?? 0),
                            magenta: asPercentile(item.colors.cmyk.magenta ?? 0),
                            yellow: asPercentile(item.colors.cmyk.yellow ?? 0),
                            key: asPercentile(item.colors.cmyk.key ?? 0)
                        },
                        hex: {
                            hex: asHexSet(item.colors.hex.hex ?? '#000000')
                        },
                        hsl: {
                            hue: asRadial(item.colors.hsl.hue ?? 0),
                            saturation: asPercentile(item.colors.hsl.saturation ?? 0),
                            lightness: asPercentile(item.colors.hsl.lightness ?? 0)
                        },
                        hsv: {
                            hue: asRadial(item.colors.hsv.hue ?? 0),
                            saturation: asPercentile(item.colors.hsv.saturation ?? 0),
                            value: asPercentile(item.colors.hsv.value ?? 0)
                        },
                        lab: {
                            l: asLAB_L(item.colors.lab.l ?? 0),
                            a: asLAB_A(item.colors.lab.a ?? 0),
                            b: asLAB_B(item.colors.lab.b ?? 0)
                        },
                        rgb: {
                            red: asByteRange(item.colors.rgb.red ?? 0),
                            green: asByteRange(item.colors.rgb.green ?? 0),
                            blue: asByteRange(item.colors.rgb.blue ?? 0)
                        },
                        xyz: {
                            x: asXYZ_X(item.colors.xyz.x ?? 0),
                            y: asXYZ_Y(item.colors.xyz.y ?? 0),
                            z: asXYZ_Z(item.colors.xyz.z ?? 0)
                        }
                    },
                    css: {
                        cmyk: `cmyk(${item.colors.cmyk.cyan}%, ${item.colors.cmyk.magenta}%, ${item.colors.cmyk.yellow}%, ${item.colors.cmyk.key}%)`,
                        hex: `${item.colors.hex.hex}}`,
                        hsl: `hsl(${item.colors.hsl.hue}, ${item.colors.hsl.saturation}%, ${item.colors.hsl.lightness}%)`,
                        hsv: `hsv(${item.colors.hsv.hue}, ${item.colors.hsv.saturation}%, ${item.colors.hsv.value}%)`,
                        lab: `lab(${item.colors.lab.l}, ${item.colors.lab.a}, ${item.colors.lab.b})`,
                        rgb: `rgb(${item.colors.rgb.red}, ${item.colors.rgb.green}, ${item.colors.rgb.blue})`,
                        xyz: `xyz(${item.colors.xyz.x}, ${item.colors.xyz.y}, ${item.colors.xyz.z})`
                    }
                }))
            };
        }
    };
}

export { createBrandingUtils };
//# sourceMappingURL=brand.js.map
