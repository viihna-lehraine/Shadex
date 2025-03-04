const palette = {
    id: `default-palette-${Date.now()}`,
    items: [],
    metadata: {
        name: 'DEFAULT PALETTE',
        columnCount: 5,
        limitDark: false,
        limitGray: false,
        limitLight: false,
        type: 'random',
        timestamp: `${Date.now()}`
    }
};
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
    hsv: {
        value: {
            hue: 0,
            saturation: 0,
            value: 0
        },
        format: 'hsv'
    },
    lab: {
        value: { l: 0, a: 0, b: 0 },
        format: 'lab'
    },
    rgb: {
        value: {
            red: 0,
            green: 0,
            blue: 0
        },
        format: 'rgb'
    },
    sl: {
        value: { saturation: 0, lightness: 0 },
        format: 'sl'
    },
    sv: {
        value: { saturation: 0, value: 0 },
        format: 'sv'
    },
    xyz: {
        value: { x: 0, y: 0, z: 0 },
        format: 'xyz'
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
    colors,
    palette};

export { defaults };
//# sourceMappingURL=defaults.js.map
