const colors = {
    cmyk: {
        value: {
            cyan: 0,
            magenta: 0,
            yellow: 0,
            key: 0
        },
        format: 'cmyk'
    },
    hex: {
        value: { hex: '#000000' },
        format: 'hex'
    },
    hsl: {
        value: {
            hue: 0,
            saturation: 0,
            lightness: 0
        },
        format: 'hsl'
    },
    rgb: {
        value: {
            red: 0,
            green: 0,
            blue: 0
        },
        format: 'rgb'
    },
    hexString: { value: { hex: '#000000' }, format: 'hex' },
    hslString: {
        value: { hue: '0', saturation: '0', lightness: '0' },
        format: 'hsl'
    },
    hexCSS: '#000000'};
({
    timestamp: new Date().toISOString()});
/**
 * @description The default values for various application states, values, and configurations.
 * @exports defaults
 */
const defaults = {
    colors};

export { defaults };
//# sourceMappingURL=defaults.js.map
