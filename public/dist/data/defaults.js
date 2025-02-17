// File: data/defaults.js
const palette = {
    id: `null-palette-${Date.now()}`,
    items: [],
    metadata: {
        columnCount: 1,
        flags: {
            limitDark: false,
            limitGray: false,
            limitLight: false
        },
        type: 'random',
        name: 'BRANDED DEFAULT PALETTE',
        timestamp: '???'
    }
};
const paletteItem = {
    itemID: 1,
    colors: {
        cmyk: {
            cyan: 0,
            magenta: 0,
            yellow: 0,
            key: 0
        },
        hex: { hex: '#000000' },
        hsl: {
            hue: 0,
            saturation: 0,
            lightness: 0
        },
        hsv: {
            hue: 0,
            saturation: 0,
            value: 0
        },
        lab: {
            l: 0,
            a: 0,
            b: 0
        },
        rgb: {
            red: 0,
            green: 0,
            blue: 0
        },
        xyz: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    css: {
        cmyk: 'cmyk(0%, 0%, 0%, 100%)',
        hex: '#000000',
        hsl: 'hsl(0, 0%, 0%)',
        hsv: 'hsv(0, 0%, 0%)',
        lab: 'lab(0, 0, 0)',
        rgb: 'rgb(0, 0, 0)',
        xyz: 'xyz(0, 0, 0)'
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
        value: {
            l: 0,
            a: 0,
            b: 0
        },
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
        value: {
            saturation: 0,
            lightness: 0
        },
        format: 'sl'
    },
    sv: {
        value: {
            saturation: 0,
            value: 0
        },
        format: 'sv'
    },
    xyz: {
        value: {
            x: 0,
            y: 0,
            z: 0
        },
        format: 'xyz'
    },
    unbranded: {
        cmyk: {
            value: { cyan: 0, magenta: 0, yellow: 0, key: 0 },
            format: 'cmyk'
        },
        hex: {
            value: { hex: '#000000FF' },
            format: 'hex'
        },
        hsl: {
            value: { hue: 0, saturation: 0, lightness: 0 },
            format: 'hsl'
        },
        hsv: {
            value: { hue: 0, saturation: 0, value: 0 },
            format: 'hsv'
        },
        lab: {
            value: { l: 0, a: 0, b: 0 },
            format: 'lab'
        },
        sl: {
            value: { saturation: 0, lightness: 0 },
            format: 'sl'
        },
        rgb: {
            value: { red: 0, green: 0, blue: 0 },
            format: 'rgb'
        },
        sv: {
            value: { saturation: 0, value: 0 },
            format: 'sv'
        },
        xyz: {
            value: { x: 0, y: 0, z: 0 },
            format: 'xyz'
        }
    },
    css: {
        cmyk: 'cmyk(0%, 0%, 0%, 0%)',
        hex: '#000000',
        hsl: 'hsl(0, 0%, 0%)',
        hsv: 'hsv(0, 0%, 0%)',
        lab: 'lab(0, 0, 0)',
        rgb: 'rgb(0, 0, 0)',
        sl: 'sl(0%, 0%)',
        sv: 'sv(0%, 0%)',
        xyz: 'xyz(0, 0, 0)'
    },
    strings: {
        cmyk: {
            value: { cyan: '0', magenta: '0', yellow: '0', key: '0' },
            format: 'cmyk'
        },
        hex: {
            value: { hex: '#000000' },
            format: 'hex'
        },
        hsl: {
            value: { hue: '0', saturation: '0', lightness: '0' },
            format: 'hsl'
        },
        hsv: {
            value: { hue: '0', saturation: '0', value: '0' },
            format: 'hsv'
        },
        lab: {
            value: { l: '0', a: '0', b: '0' },
            format: 'lab'
        },
        rgb: {
            value: { red: '0', green: '0', blue: '0' },
            format: 'rgb'
        },
        sl: {
            value: { saturation: '0', lightness: '0' },
            format: 'sl'
        },
        sv: {
            value: { saturation: '0', value: '0' },
            format: 'sv'
        },
        xyz: {
            value: { x: '0', y: '0', z: '0' },
            format: 'xyz'
        }
    }
};
const mutation = {
    timestamp: new Date().toISOString(),
    key: 'default_key',
    action: 'update',
    newValue: { value: 'new_value' },
    oldValue: { value: 'old_value' },
    origin: 'DEFAULT'
};
const paletteOptions = {
    columnCount: 6,
    distributionType: 'soft',
    limitDark: false,
    limitGray: false,
    limitLight: false,
    paletteType: 'analogous'
};
const state = {
    appMode: 'edit',
    paletteHistory: [],
    paletteContainer: {
        columns: [],
        dndAttached: false
    },
    preferences: {
        colorSpace: 'hsl',
        distributionType: 'soft',
        maxHistory: 20,
        maxPaletteHistory: 10,
        theme: 'light'
    },
    selections: {
        paletteColumnCount: 5,
        paletteType: 'complementary',
        targetedColumnPosition: 1
    },
    timestamp: 'NULL TIMESTAMP'
};
const unbrandedPalette = {
    id: `null-unbranded-palette}`,
    items: [],
    metadata: {
        name: 'UNBRANDED DEFAULT PALETTE',
        timestamp: '???',
        columnCount: 1,
        flags: {
            limitDark: false,
            limitGray: false,
            limitLight: false
        },
        type: 'random'
    }
};
const unbrandedPaletteItem = {
    itemID: 1,
    colors: {
        cmyk: { cyan: 0, magenta: 0, yellow: 0, key: 0 },
        hex: { hex: '#000000' },
        hsl: { hue: 0, saturation: 0, lightness: 0 },
        hsv: { hue: 0, saturation: 0, value: 0 },
        lab: { l: 0, a: 0, b: 0 },
        rgb: { red: 0, green: 0, blue: 0 },
        xyz: { x: 0, y: 0, z: 0 }
    },
    css: {
        cmyk: 'cmyk(0%, 0%, 0%, 100%)',
        hex: '#000000',
        hsl: 'hsl(0, 0%, 0%)',
        hsv: 'hsv(0, 0%, 0%)',
        lab: 'lab(0, 0, 0)',
        rgb: 'rgb(0, 0, 0)',
        xyz: 'xyz(0, 0, 0)'
    }
};
const defaultData = {
    colors,
    mutation,
    palette,
    paletteItem,
    paletteOptions,
    state,
    unbrandedPalette,
    unbrandedPaletteItem
};

export { defaultData };
//# sourceMappingURL=defaults.js.map
