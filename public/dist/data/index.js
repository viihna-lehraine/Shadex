// File: src/data/index.js
//
///
//// ******** 1. CONFIGURATION DATA ********
///
//
const adjustments = {
    slaValue: 10
};
const appLimits = {
    history: 100,
    paletteHistory: 20
};
const debounce = {
    btn: 300,
    input: 200
};
const paletteRanges = {
    shift: {
        comp: { hue: 10, sat: 0, light: 0 },
        diadic: { hue: 30, sat: 30, light: 30 },
        hexad: { hue: 0, sat: 30, light: 30 },
        random: { hue: 0, sat: 0, light: 0 },
        splitComp: { hue: 30, sat: 30, light: 30 },
        tetra: { hue: 0, sat: 30, light: 30 },
        triad: { hue: 0, sat: 30, light: 30 }
    }
};
const probabilities = {
    base: {
        values: [40, 45, 50, 55, 60, 65, 70],
        weights: [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05]
    },
    chaotic: {
        values: [20, 25, 30, 35, 40],
        weights: [0.1, 0.15, 0.3, 0.25, 0.2]
        // big gaps possible, but favoring mid-range (45°-60°)
        // occasional extreme shifts (120°-150°)
        // useful for abstract or experimental palettes.
    },
    soft: {
        values: [20, 25, 30, 35, 40],
        weights: [0.2, 0.25, 0.3, 0.15, 0.1]
        // most common variations: 30°
        // rare to see anything above 40°
        // creates gentle color differences.
    },
    strong: {
        values: [20, 25, 30, 35, 40],
        weights: [0.1, 0.15, 0.3, 0.25, 0.2]
        // most common variation: 60°
        // rare to see shifts beyond 80°
        // feels bolder but still maintains balance.
    }
};
const thresholds = {
    dark: 25,
    gray: 20,
    light: 75
};
const timers = {
    copyButtonTextTimeout: 1000,
    toast: 3000,
    tooltipFadeIn: 50,
    tooltipFadeOut: 50
};
const ui = {
    maxColumnSize: 70,
    minColumnSize: 5
};
const regex = {
    brand: {
        hex: /^#[0-9A-Fa-f]{8}$/
    },
    colors: {
        cmyk: /cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/i,
        hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
        hsl: /hsl\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
        hsv: /hsv\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
        lab: /lab\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
        rgb: /rgb\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
        xyz: /xyz\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i
    },
    css: {
        cmyk: /^cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?\)$/,
        hsl: /^hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)$/,
        hsv: /^hsv\((\d+),\s*(\d+)%?,\s*(\d+)%?\)$/,
        lab: /^lab\(([\d.]+),\s*([\d.]+),\s*([\d.]+)\)$/,
        rgb: /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/,
        xyz: /^xyz\(([\d.]+),\s*([\d.]+),\s*([\d.]+)\)$/
    },
    dom: {
        hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i,
        hsl: /^hsl\(\s*(\d+),\s*([\d.]+)%,\s*([\d.]+)%\s*\)$/,
        rgb: /^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/
    },
    userInput: {
        hex: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/i,
        hsl: /^hsl\(\s*(\d{1,3})\s*,\s*([0-9]{1,3})%\s*,\s*([0-9]{1,3})%\s*\)$/i,
        rgb: /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i
    },
    validation: {
        hex: /^#[0-9A-Fa-f]{6}$/,
        hexComponent: /^#[0-9a-fA-F]{2}$/
    }
};
const config = {
    adjustments,
    appLimits,
    debounce,
    paletteRanges,
    probabilities,
    regex,
    thresholds,
    timers,
    ui
};
//
///
//// ******** 2. DEFAULT DATA ********
///
//
const palette = {
    id: `default-palette-${Date.now()}`,
    items: [],
    metadata: {
        name: 'DEFAULT PALETTE',
        columnCount: 5,
        flags: {
            limitDark: false,
            limitGray: false,
            limitLight: false
        },
        type: 'random',
        timestamp: `${Date.now()}`
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
        columns: []
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
const defaults = {
    colors,
    mutation,
    palette,
    paletteItem,
    paletteOptions,
    state,
    unbrandedPalette,
    unbrandedPaletteItem
};
//
///
//// ******** 3. DOM DATA ********
///
//
const classes = {
    colorDisplay: 'color-display',
    colorInput: 'color-input',
    colorInputBtn: 'color-input-btn',
    colorInputModal: 'color-input-modal',
    colorStripe: 'color-stripe',
    colorSwatch: 'color-swatch',
    dragHandle: 'drag-handle',
    hidden: 'hidden',
    lockBtn: 'lock-btn',
    locked: 'locked',
    modal: 'modal',
    modalTrigger: 'modal-trigger',
    paletteColumn: 'palette-column',
    resizeHandle: 'resize-handle',
    tooltipContainer: 'tooltip-container',
    tooltipTrigger: 'tooltip-trigger'
};
const ids = {
    btns: {
        desaturate: 'desaturate-btn',
        export: 'export-btn',
        generate: 'generate-btn',
        helpMenu: 'help-menu-btn',
        historyMenu: 'history-menu-btn',
        import: 'import-btn',
        saturate: 'saturate-btn',
        showAsCMYK: 'show-as-cmyk-btn',
        showAsHex: 'show-as-hex-btn',
        showAsHSL: 'show-as-hsl-btn',
        showAsHSV: 'show-as-hsv-btn',
        showAsLAB: 'show-as-lab-btn',
        showAsRGB: 'show-as-rgb-btn'
    },
    divs: {
        helpMenu: 'help-menu',
        historyMenu: 'history-menu',
        paletteContainer: 'palette-container',
        paletteHistory: 'palette-history'
    },
    inputs: {
        columnCount: 'palette-column-count-selector',
        limitDarkChkbx: 'limit-dark-chkbx',
        limitGrayChkbx: 'limit-gray-chkbx',
        limitLightChkbx: 'limit-light-chkbx',
        paletteColumn: 'palette-column-selector',
        paletteType: 'palette-type-selector'
    }
};
const dynamicIDs = {
    divs: {
        globalTooltip: 'global-tooltip'
    }
};
const dom = {
    classes,
    dynamicIDs,
    ids
};
//
///
//// ******** 4. MODE ********
///
//
const mode = {
    env: 'dev',
    debug: true,
    debugLevel: 3,
    exposeToWindow: true,
    logging: {
        args: true,
        clicks: false,
        debug: true,
        info: true,
        error: true,
        verbosity: 3,
        warn: true
    },
    showAlerts: false,
    stackTrace: true
};
//
///
//// ******** 5. SETS ********
///
//
const sets = {
    ByteRange: [0, 255],
    HexSet: 'HexSet',
    LAB_L: [0, 100],
    LAB_A: [-128, 127],
    LAB_B: [-128, 127],
    Percentile: [0, 100],
    Radial: [0, 360],
    XYZ_X: [0, 95.047],
    XYZ_Y: [0, 100],
    XYZ_Z: [0, 108.883]
};
//
///
//// ******** 6. STORAGE DATA ********
///
//
const storage = {
    idb: {
        dbName: 'IndexedDB',
        defaultVersion: 1,
        storeName: 'AppStorage'
    }
};
//
///
//// ******** 7. MATHEMATICAL CONSTANTS ********
const epsilon = 0.00001;
const limits = {
    maxX: 95.047,
    maxY: 100,
    maxZ: 108.883,
    minX: 0,
    minY: 0,
    minZ: 0
};
const math = { epsilon, limits };
//
///
//// ******** 8. FINAL EXPORTED DATA OBJECT ********
///
//
const data = {
    config,
    defaults,
    dom,
    math,
    mode,
    sets,
    storage
};

export { data, sets };
//# sourceMappingURL=index.js.map
