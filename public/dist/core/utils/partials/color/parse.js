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
                hue: `${hsl.hue}`,
                saturation: `${hsl.saturation * 100}%`,
                lightness: `${hsl.lightness * 100}%`
            };
        }, 'Error parsing HSL value as string map.');
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
    const colorParsingUtilities = {
        parseHexValueAsStringMap,
        parseHSLValueAsStringMap,
        parseRGBValueAsStringMap
    };
    return errors.handleSync(() => colorParsingUtilities, 'Error occurred while creating color parsing utilities group.');
}

export { colorParsingUtilitiesFactory };
//# sourceMappingURL=parse.js.map
