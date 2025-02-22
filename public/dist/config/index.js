// File: src/config/index.ts
// ***********************************************************
/// *********************************************************
//// ******************* 1. DOM INDEX **********************
/// *********************************************************
// ***********************************************************
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
    globalTooltipDiv: 'global-tooltip'
};
// ********************************************************
/// ******************************************************
//// **************** 2. DOM CONFIGURARTION *************
/// ******************************************************
// ********************************************************
const domConfig = {
    btnDebounce: 300,
    inputDebounce: 200,
    copyButtonTextTimeout: 1000,
    maxColumnSize: 70,
    minColumnSize: 5,
    toastTimer: 3000,
    tooltipFadeIn: 50,
    tooltipFadeOut: 50
};
// ***********************************************************
/// *********************************************************
//// **************** 3. PALETTE CONFIGURARTION *************
/// *********************************************************
// ***********************************************************
const paletteConfig = {
    adjustment: { slaValue: 10 },
    probabilities: {
        base: {
            values: [40, 45, 50, 55, 60, 65, 70],
            weights: [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05]
        },
        chaotic: {
            values: [20, 25, 30, 35, 40],
            weights: [0.1, 0.15, 0.3, 0.25, 0.2]
        },
        soft: {
            values: [20, 25, 30, 35, 40],
            weights: [0.2, 0.25, 0.3, 0.15, 0.1]
        },
        strong: {
            values: [20, 25, 30, 35, 40],
            weights: [0.1, 0.15, 0.3, 0.25, 0.2]
        }
    },
    shiftRanges: {
        analogous: { hue: 30, sat: 30, light: 30 },
        complementary: { hue: 10, sat: 0, light: 0 },
        custom: { hue: 0, sat: 0, light: 0 },
        diadic: { hue: 30, sat: 30, light: 30 },
        hexadic: { hue: 0, sat: 30, light: 30 },
        monochromatic: { hue: 0, sat: 0, light: 10 },
        random: { hue: 0, sat: 0, light: 0 },
        splitComplementary: { hue: 30, sat: 30, light: 30 },
        tetradic: { hue: 0, sat: 30, light: 30 },
        triadic: { hue: 0, sat: 30, light: 30 }
    },
    thresholds: { dark: 25, gray: 20, light: 75 }
};
// ****************************************************
/// **************************************************
//// ******************* 4. REGEX *******************
/// **************************************************
// ****************************************************
const number = '\\d+';
const decimal = '[\\d.]+';
const percent = '%?';
const optionalAlpha = '(?:,\\s*([\\d.]+))?';
const colorFunc = (name, args) => {
    return new RegExp(`${name}\\(${args.join(',\\s*')}${optionalAlpha}\\)`, 'i');
};
const regex = {
    brand: { hex: /^#[0-9A-Fa-f]{8}$/ },
    colors: {
        cmyk: colorFunc('cmyk', [
            number + percent,
            number + percent,
            number + percent,
            number + percent
        ]),
        hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
        hsl: colorFunc('hsl', [decimal, decimal + percent, decimal + percent]),
        hsv: colorFunc('hsv', [decimal, decimal + percent, decimal + percent]),
        lab: colorFunc('lab', [decimal, decimal, decimal]),
        rgb: colorFunc('rgb', [decimal, decimal, decimal]),
        xyz: colorFunc('xyz', [decimal, decimal, decimal])
    },
    css: {
        cmyk: colorFunc('cmyk', [
            number + percent,
            number + percent,
            number + percent,
            number + percent
        ]),
        hsl: colorFunc('hsl', [number, number + percent, number + percent]),
        hsv: colorFunc('hsv', [number, number + percent, number + percent]),
        lab: colorFunc('lab', [decimal, decimal, decimal]),
        rgb: colorFunc('rgb', [number, number, number]),
        xyz: colorFunc('xyz', [decimal, decimal, decimal])
    },
    dom: {
        hex: /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/i,
        hsl: colorFunc('hsl', [number, decimal + percent, decimal + percent]),
        rgb: colorFunc('rgb', [number, number, number])
    },
    stackTrace: {
        anon: /at\s+(.*?):(\d+):(\d+)/,
        chrome: /at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)/,
        electron: /at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)/,
        fallback: /(.*?):(\d+):(\d+)/,
        firefox: /(.*?)@(.*?):(\d+):(\d+)/,
        node: /at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)/,
        safari: /(.*?)@(.*?):(\d+):(\d+)/,
        workers: /at\s+(.*?):(\d+):(\d+)/
    },
    userInput: {
        hex: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/i,
        hsl: colorFunc('hsl', [number, number + percent, number + percent]),
        rgb: colorFunc('rgb', [number, number, number])
    },
    validation: {
        hex: /^#[0-9A-Fa-f]{6}$/,
        hexComponent: /^#[0-9a-fA-F]{2}$/
    }
};
// *****************************************************
/// ***************************************************
//// **************** 5. ENV CONFIG ******************
/// ***************************************************
// *****************************************************
const env = {
    appHistoryLimit: 100,
    appPaletteHistoryLimit: 20,
    idbRetryDelay: 50,
    observerDebounce: 100,
    semaphoreMaxLocks: 10,
    semaphoreTimeout: 5000
};
// *****************************************************
/// ***************************************************
//// **************** 5. DEFAULT DATA ****************
/// ***************************************************
// *****************************************************
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
        lab: { l: 0, a: 0, b: 0 },
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
    cmykNum: {
        value: { cyan: 0, magenta: 0, yellow: 0, key: 0 },
        format: 'cmyk'
    },
    hslNum: { value: { hue: 0, saturation: 0, lightness: 0 }, format: 'hsl' },
    hsvNum: { value: { hue: 0, saturation: 0, value: 0 }, format: 'hsv' },
    labNum: { value: { l: 0, a: 0, b: 0 }, format: 'lab' },
    rgbNum: { value: { red: 0, green: 0, blue: 0 }, format: 'rgb' },
    slNum: { value: { saturation: 0, lightness: 0 }, format: 'sl' },
    svNum: { value: { saturation: 0, value: 0 }, format: 'sv' },
    xyzNum: { value: { x: 0, y: 0, z: 0 }, format: 'xyz' },
    cmykString: {
        value: { cyan: '0', magenta: '0', yellow: '0', key: '0' },
        format: 'cmyk'
    },
    hexString: { value: { hex: '#000000' }, format: 'hex' },
    hslString: {
        value: { hue: '0', saturation: '0', lightness: '0' },
        format: 'hsl'
    },
    hsvString: {
        value: { hue: '0', saturation: '0', value: '0' },
        format: 'hsv'
    },
    labString: { value: { l: '0', a: '0', b: '0' }, format: 'lab' },
    rgbString: { value: { red: '0', green: '0', blue: '0' }, format: 'rgb' },
    slString: { value: { saturation: '0', lightness: '0' }, format: 'sl' },
    svString: { value: { saturation: '0', value: '0' }, format: 'sv' },
    xyzString: { value: { x: '0', y: '0', z: '0' }, format: 'xyz' },
    cmykCSS: 'cmyk(0%, 0%, 0%, 0%)',
    hexCSS: '#000000',
    hslCSS: 'hsl(0, 0%, 0%)',
    hsvCSS: 'hsv(0, 0%, 0%)',
    labCSS: 'lab(0, 0, 0)',
    rgbCSS: 'rgb(0, 0, 0)',
    slCSS: 'sl(0%, 0%)',
    svCSS: 'sv(0%, 0%)',
    xyzCSS: 'xyz(0, 0, 0)'
};
const mutation = {
    timestamp: new Date().toISOString(),
    key: 'default_key',
    action: 'update',
    newValue: { value: 'new_value' },
    oldValue: { value: 'old_value' },
    origin: 'DEFAULT'
};
const observerData = {
    count: 0,
    name: 'TEST'
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
    paletteContainer: { columns: [] },
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
    timestamp: 'NULL'
};
const unbrandedPalette = {
    id: `null-unbranded-palette`,
    items: [],
    metadata: {
        name: 'UNBRANDED DEFAULT PALETTE',
        timestamp: '???',
        columnCount: 1,
        limitDark: false,
        limitGray: false,
        limitLight: false,
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
// *****************************************************
/// ***************************************************
//// ******************** 6. MODE ********************
/// ***************************************************
// *****************************************************
const mode = {
    env: 'dev',
    debugLevel: 3,
    exposeClasses: true,
    log: {
        debug: true,
        info: true,
        error: true,
        verbosity: 3,
        warn: true
    },
    showAlerts: false,
    stackTrace: true
};
// *****************************************************
/// ***************************************************
//// ******************** 7. SETS ********************
/// ***************************************************
// *****************************************************
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
// *****************************************************
/// ***************************************************
//// **************** 8. STORAGE DATA ****************
/// ***************************************************
// *****************************************************
const storage = {
    idbDBName: 'IndexedDB',
    idbDefaultVersion: 1,
    idbStoreName: 'AppStorage'
};
// *********************************************************
/// *******************************************************
//// ************* 9. MATHEMATICAL CONSTANTS *************
/// *******************************************************
// *********************************************************
const math = {
    epsilon: 0.00001,
    maxXYZ_X: 95.047,
    maxXYZ_Y: 100,
    maxXYZ_Z: 108.883,
    minXYZ_X: 0,
    minXYZ_Y: 0,
    minXYZ_Z: 0
};
// *****************************************************
/// ***************************************************
//// ***************** 10. EXPORTS *******************
/// ***************************************************
// *****************************************************
const config = {
    env,
    math,
    mode,
    sets,
    storage
};
const defaults = {
    colors,
    mutation,
    observerData,
    palette,
    paletteItem,
    paletteOptions,
    state,
    unbrandedPalette,
    unbrandedPaletteItem
};
const domIndex = {
    classes,
    dynamicIDs,
    ids
};

export { config, defaults, domConfig, domIndex, paletteConfig, regex, sets };
//# sourceMappingURL=index.js.map
