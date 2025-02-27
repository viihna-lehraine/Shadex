// File: core/utils/partials/color/parse.ts
function colorParsingUtilitiesFactory(services) {
    const { errors } = services;
    function parseHexValueAsStringMap(hex) {
        return errors.handleSync(() => {
            return { hex: hex.hex };
        }, 'Error parsing hex value as raw hex.');
    }
    function parseHSLValueAsStringMap(hsl) {
        return errors.handleSync(() => {
            return {
                hue: `${hsl.hue}°`,
                saturation: `${hsl.saturation * 100}%`,
                lightness: `${hsl.lightness * 100}%`
            };
        }, 'Error parsing HSL value as string map.');
    }
    function parseHSVValueAsStringMap(hsv) {
        return errors.handleSync(() => {
            return {
                hue: `${hsv.hue}°`,
                saturation: `${hsv.saturation * 100}%`,
                value: `${hsv.value * 100}%`
            };
        }, 'Error parsing HSV value as string map.');
    }
    function parseLABValueAsStringMap(lab) {
        return errors.handleSync(() => {
            return {
                l: `${lab.l}`,
                a: `${lab.a}`,
                b: `${lab.b}`
            };
        }, 'Error parsing LAB value as string map.');
    }
    function parseRGBValueAsStringMap(rgb) {
        return errors.handleSync(() => {
            return {
                red: `${rgb.red}`,
                green: `${rgb.green}`,
                blue: `${rgb.blue}`
            };
        }, 'Error parsing RGB value as string map.');
    }
    function parseXYZValueAsStringMap(xyz) {
        return errors.handleSync(() => {
            return {
                x: `${xyz.x}`,
                y: `${xyz.y}`,
                z: `${xyz.z}`
            };
        }, 'Error parsing XYZ value as string map.');
    }
    const colorParsingUtilities = {
        parseHexValueAsStringMap,
        parseHSLValueAsStringMap,
        parseHSVValueAsStringMap,
        parseLABValueAsStringMap,
        parseRGBValueAsStringMap,
        parseXYZValueAsStringMap
    };
    return errors.handleSync(() => colorParsingUtilities, 'Error occurred while creating color parsing utilities group.');
}

export { colorParsingUtilitiesFactory };
//# sourceMappingURL=parse.js.map
