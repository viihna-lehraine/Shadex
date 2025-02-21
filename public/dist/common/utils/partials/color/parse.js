// File: common/utils/partials/color/parse.ts
function colorParsingUtilsFactory(helpers, utils) {
    const { brandColorStringMap } = utils.color;
    const { isColorStringMap } = helpers.typeguards;
    return {
        narrowToColor(color) {
            if (isColorStringMap(color))
                return brandColorStringMap(color);
            switch (color.format) {
                case 'cmyk':
                case 'hex':
                case 'hsl':
                case 'hsv':
                case 'lab':
                case 'sl':
                case 'sv':
                case 'rgb':
                case 'xyz':
                    return color;
                default:
                    return null;
            }
        },
        parseHexValueAsStringMap(hex) {
            return { hex: hex.hex };
        },
        parseHSLValueAsStringMap(hsl) {
            return {
                hue: `${hsl.hue}°`,
                saturation: `${hsl.saturation * 100}%`,
                lightness: `${hsl.lightness * 100}%`
            };
        },
        parseHSVValueAsStringMap(hsv) {
            return {
                hue: `${hsv.hue}°`,
                saturation: `${hsv.saturation * 100}%`,
                value: `${hsv.value * 100}%`
            };
        },
        parseLABValueAsStringMap(lab) {
            return {
                l: `${lab.l}`,
                a: `${lab.a}`,
                b: `${lab.b}`
            };
        },
        parseRGBValueAsStringMap(rgb) {
            return {
                red: `${rgb.red}`,
                green: `${rgb.green}`,
                blue: `${rgb.blue}`
            };
        },
        parseXYZValueAsStringMap(xyz) {
            return {
                x: `${xyz.x}`,
                y: `${xyz.y}`,
                z: `${xyz.z}`
            };
        }
    };
}

export { colorParsingUtilsFactory };
//# sourceMappingURL=parse.js.map
