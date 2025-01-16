// File: src/data/consts/base.js
const adjustments$1 = {
    slaValue: 10
};
const debounce$1 = {
    button: 300,
    input: 200
};
const limits$3 = {
    xyz: {
        max: {
            x: 95.047,
            y: 100,
            z: 108.883
        },
        min: {
            x: 0,
            y: 0,
            z: 0
        }
    }
};
const paletteRanges$6 = {
    comp: {
        hueShift: 10,
        lightShift: null,
        satShift: null
    },
    diadic: {
        hueShift: 30,
        lightShift: 30,
        satShift: 30
    },
    hexad: {
        hueShift: null,
        lightShift: 30,
        satShift: 30
    },
    random: {
        hueShift: null,
        lightShift: null,
        satShift: null
    },
    splitComp: {
        hueShift: 30,
        lightShift: 30,
        satShift: 30
    },
    tetra: {
        hueShift: null,
        lightShift: 30,
        satShift: 30
    },
    triad: {
        hueShift: null,
        lightShift: 30,
        satShift: 30
    }
};
const probabilities$1 = {
    values: [40, 45, 50, 55, 60, 65, 70],
    weights: [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05]
};
const thresholds = {
    dark: 25,
    gray: 20,
    light: 75
};
const timeouts$1 = {
    copyButtonText: 1000,
    toast: 3000,
    tooltip: 1000
};

// File: src/data/mode/base.js
const mode$j = {
    app: 'dev',
    debug: true,
    debugLevel: 1,
    debugLogs: true,
    exposeIDB: true,
    errorLogs: true,
    gracefulErrors: false,
    infoLogs: true,
    logClicks: false,
    quiet: false,
    showAlerts: true,
    stackTrace: true,
    verbose: false,
    warnLogs: true
};

// File: src/data/mode/index.js
const mode$i = {
    ...mode$j
};

// File: src/common/dom/base.js
function getElement$1(id) {
    const element = document.getElementById(id);
    // if (mode.stackTrace) console.trace('getElement() was called');
    if (!element) {
        if (mode$i.warnLogs) {
            console.warn(`Element with ID ${id} not found`);
        }
    }
    return element;
}
const base$8 = {
    getElement: getElement$1
};

// File: src/common/dom/index.js
const domUtils$1 = {
    ...base$8
};

// File: src/data/consts/dom/elements.js
const getElement = domUtils$1.getElement;
const advancedMenu$1 = getElement('advanced-menu');
const advancedMenuButton$1 = getElement('advanced-menu-button');
const advancedMenuContent$1 = getElement('advanced-menu-content');
const applyCustomColorButton$1 = getElement('apply-custom-color-button');
const clearCustomColorButton$1 = getElement('clear-custom-color-button');
const customColorDisplay$1 = getElement('custom-color-display');
const customColorInput$1 = getElement('custom-color-input');
const customColorMenu$1 = getElement('custom-color-menu');
const customColorMenuButton$1 = getElement('custom-color-menu-button');
const deleteDatabaseButton$1 = getElement('delete-database-button');
const desaturateButton$1 = getElement('desaturate-button');
const developerMenu$1 = getElement('developer-menu');
const developerMenuButton$1 = getElement('developer-menu-button');
const enableAlphaCheckbox$1 = getElement('enable-alpha-checkbox');
const generateButton$1 = getElement('generate-button');
const helpMenu$1 = getElement('help-menu');
const helpMenuButton$1 = getElement('help-menu-button');
const helpMenuContent$1 = getElement('help-menu-content');
const historyMenu$1 = getElement('history-menu');
const historyMenuButton$1 = getElement('history-menu-button');
const historyMenuContent$1 = getElement('history-menu-content');
const limitDarknessCheckbox$1 = getElement('limit-darkness-checkbox');
const limitGraynessCheckbox$1 = getElement('limit-grayness-checkbox');
const limitLightnessCheckbox$1 = getElement('limit-lightness-checkbox');
const paletteNumberOptions$1 = getElement('palette-number-options');
const paletteTypeOptions$1 = getElement('palette-type-options');
const resetDatabaseButton$1 = getElement('reset-database-button');
const resetPaletteIDButton$1 = getElement('reset-palette-id-button');
const saturateButton$1 = getElement('saturate-button');
const selectedColorOption$1 = getElement('selected-color-option');
const showAsCMYKButton$1 = getElement('show-as-cmyk-button');
const showAsHexButton$1 = getElement('show-as-hex-button');
const showAsHSLButton$1 = getElement('show-as-hsl-button');
const showAsHSVButton$1 = getElement('show-as-hsv-button');
const showAsLABButton$1 = getElement('show-as-lab-button');
const showAsRGBButton$1 = getElement('show-as-rgb-button');
const domElements = {
    advancedMenu: advancedMenu$1,
    advancedMenuButton: advancedMenuButton$1,
    advancedMenuContent: advancedMenuContent$1,
    applyCustomColorButton: applyCustomColorButton$1,
    clearCustomColorButton: clearCustomColorButton$1,
    customColorDisplay: customColorDisplay$1,
    customColorInput: customColorInput$1,
    customColorMenu: customColorMenu$1,
    customColorMenuButton: customColorMenuButton$1,
    deleteDatabaseButton: deleteDatabaseButton$1,
    desaturateButton: desaturateButton$1,
    developerMenu: developerMenu$1,
    developerMenuButton: developerMenuButton$1,
    enableAlphaCheckbox: enableAlphaCheckbox$1,
    generateButton: generateButton$1,
    helpMenu: helpMenu$1,
    helpMenuButton: helpMenuButton$1,
    helpMenuContent: helpMenuContent$1,
    historyMenu: historyMenu$1,
    historyMenuButton: historyMenuButton$1,
    historyMenuContent: historyMenuContent$1,
    limitDarknessCheckbox: limitDarknessCheckbox$1,
    limitGraynessCheckbox: limitGraynessCheckbox$1,
    limitLightnessCheckbox: limitLightnessCheckbox$1,
    paletteNumberOptions: paletteNumberOptions$1,
    paletteTypeOptions: paletteTypeOptions$1,
    resetDatabaseButton: resetDatabaseButton$1,
    resetPaletteIDButton: resetPaletteIDButton$1,
    saturateButton: saturateButton$1,
    selectedColorOption: selectedColorOption$1,
    showAsCMYKButton: showAsCMYKButton$1,
    showAsHexButton: showAsHexButton$1,
    showAsHSLButton: showAsHSLButton$1,
    showAsHSVButton: showAsHSVButton$1,
    showAsLABButton: showAsLABButton$1,
    showAsRGBButton: showAsRGBButton$1
};

// File: src/data/consts/dom/IDs.js
const advancedMenu = 'advanced-menu';
const advancedMenuButton = 'advanced-menu-button';
const advancedMenuContent = 'advanced-menu-content';
const applyCustomColorButton = 'apply-custom-color-button';
const clearCustomColorButton = 'clear-custom-color-button';
const customColorDisplay = 'custom-color-display';
const customColorInput = 'custom-color-input';
const customColorMenu = 'custom-color-menu';
const customColorMenuButton = 'custom-color-menu-button';
const deleteDatabaseButton = 'delete-database-button';
const desaturateButton = 'desaturate-button';
const developerMenu = 'developer-menu';
const developerMenuButton = 'developer-menu-button';
const enableAlphaCheckbox = 'enable-alpha-checkbox';
const generateButton = 'generate-button';
const helpMenu = 'help-menu';
const helpMenuButton = 'help-menu-button';
const helpMenuContent = 'help-menu-content';
const historyMenu = 'history-menu';
const historyMenuButton = 'history-menu-button';
const historyMenuContent = 'history-menu-content';
const limitDarknessCheckbox = 'limit-darkness-checkbox';
const limitGraynessCheckbox = 'limit-grayness-checkbox';
const limitLightnessCheckbox = 'limit-lightness-checkbox';
const paletteNumberOptions = 'palette-number-options';
const paletteTypeOptions = 'palette-type-options';
const resetDatabaseButton = 'reset-database-button';
const resetPaletteIDButton = 'reset-palette-id-button';
const saturateButton = 'saturate-button';
const selectedColorOption = 'selected-color-option';
const showAsCMYKButton = 'show-as-cmyk-button';
const showAsHexButton = 'show-as-hex-button';
const showAsHSLButton = 'show-as-hsl-button';
const showAsHSVButton = 'show-as-hsv-button';
const showAsLABButton = 'show-as-lab-button';
const showAsRGBButton = 'show-as-rgb-button';
const domIDs$2 = {
    advancedMenu,
    advancedMenuButton,
    advancedMenuContent,
    applyCustomColorButton,
    clearCustomColorButton,
    customColorDisplay,
    customColorInput,
    customColorMenu,
    customColorMenuButton,
    deleteDatabaseButton,
    desaturateButton,
    developerMenu,
    developerMenuButton,
    enableAlphaCheckbox,
    generateButton,
    helpMenu,
    helpMenuButton,
    helpMenuContent,
    historyMenu,
    historyMenuButton,
    historyMenuContent,
    limitDarknessCheckbox,
    limitGraynessCheckbox,
    limitLightnessCheckbox,
    paletteNumberOptions,
    paletteTypeOptions,
    resetDatabaseButton,
    resetPaletteIDButton,
    saturateButton,
    selectedColorOption,
    showAsCMYKButton,
    showAsHexButton,
    showAsHSLButton,
    showAsHSVButton,
    showAsLABButton,
    showAsRGBButton
};

// File: src/data/consts/dom/IDs.js
const dom$3 = {
    elements: domElements,
    ids: domIDs$2
};

// File: src/data/consts/index.js
const consts$3 = {
    adjustments: adjustments$1,
    debounce: debounce$1,
    dom: dom$3,
    limits: limits$3,
    paletteRanges: paletteRanges$6,
    probabilities: probabilities$1,
    thresholds,
    timeouts: timeouts$1
};

// File: src/data/defaults/colors/colors.js
const cmyk$1 = {
    value: {
        cyan: 0,
        magenta: 0,
        yellow: 0,
        key: 0,
        alpha: 1
    },
    format: 'cmyk'
};
const hex$1 = {
    value: {
        hex: '#000000FF',
        alpha: 'FF',
        numAlpha: 1
    },
    format: 'hex'
};
const hsl$2 = {
    value: {
        hue: 0,
        saturation: 0,
        lightness: 0,
        alpha: 1
    },
    format: 'hsl'
};
const hsv$1 = {
    value: {
        hue: 0,
        saturation: 0,
        value: 0,
        alpha: 1
    },
    format: 'hsv'
};
const lab$2 = {
    value: {
        l: 0,
        a: 0,
        b: 0,
        alpha: 1
    },
    format: 'lab'
};
const rgb$2 = {
    value: {
        red: 0,
        green: 0,
        blue: 0,
        alpha: 1
    },
    format: 'rgb'
};
const sl$3 = {
    value: {
        saturation: 0,
        lightness: 0,
        alpha: 1
    },
    format: 'sl'
};
const sv$1 = {
    value: {
        saturation: 0,
        value: 0,
        alpha: 1
    },
    format: 'sv'
};
const xyz$1 = {
    value: {
        x: 0,
        y: 0,
        z: 0,
        alpha: 1
    },
    format: 'xyz'
};
const colors$2 = {
    cmyk: cmyk$1,
    hex: hex$1,
    hsl: hsl$2,
    hsv: hsv$1,
    lab: lab$2,
    rgb: rgb$2,
    sl: sl$3,
    sv: sv$1,
    xyz: xyz$1
};

// File: src/data/defaults/colors/colorStrings.js
const cmyk = {
    value: { cyan: '0%', magenta: '0%', yellow: '0%', key: '0%', alpha: '1' },
    format: 'cmyk'
};
const hsl$1 = {
    value: { hue: '0', saturation: '0%', lightness: '0%', alpha: '1' },
    format: 'hsl'
};
const hsv = {
    value: { hue: '0', saturation: '0%', value: '0%', alpha: '1' },
    format: 'hsv'
};
const lab$1 = {
    value: { l: '0', a: '0', b: '0', alpha: '1' },
    format: 'lab'
};
const rgb$1 = {
    value: { red: '0', green: '0', blue: '0', alpha: '1' },
    format: 'rgb'
};
const sl$2 = {
    value: { saturation: '0%', lightness: '0%', alpha: '1' },
    format: 'sl'
};
const sv = {
    value: { saturation: '0%', value: '0%', alpha: '1' },
    format: 'sv'
};
const xyz = {
    value: { x: '0', y: '0', z: '0', alpha: '1' },
    format: 'xyz'
};
const colorStrings$1 = {
    cmyk,
    hsl: hsl$1,
    hsv,
    lab: lab$1,
    rgb: rgb$1,
    sl: sl$2,
    sv,
    xyz
};

// File: src/data/defaults/colors/index.js
const colors$1 = {
    ...colors$2,
    strings: colorStrings$1
};

// File: src/data/defaults/idb.js
const mutation = {
    timestamp: new Date().toISOString(),
    key: 'default_key',
    action: 'update',
    newValue: { value: 'new_value' },
    oldValue: { value: 'old_value' },
    origin: 'DEFAULT'
};
const settings = {
    colorSpace: 'hsl',
    lastTableID: 0
};
const idb$c = {
    settings,
    mutation
};

// File: src/data/defaults/palette.js
const unbrandedData = {
    id: `null-palette-${Date.now()}`,
    items: [],
    flags: {
        enableAlpha: false,
        limitDarkness: false,
        limitGrayness: false,
        limitLightness: false
    },
    metadata: {
        customColor: {
            hslColor: {
                value: { hue: 0, saturation: 0, lightness: 0, alpha: 1 },
                format: 'hsl'
            },
            convertedColors: {
                cmyk: { cyan: 0, magenta: 0, yellow: 0, key: 0, alpha: 1 },
                hex: { hex: '#000000FF', alpha: 'FF', numAlpha: 1 },
                hsl: { hue: 0, saturation: 0, lightness: 0, alpha: 1 },
                hsv: { hue: 0, saturation: 0, value: 0, alpha: 1 },
                lab: { l: 0, a: 0, b: 0, alpha: 1 },
                rgb: { red: 0, green: 0, blue: 0, alpha: 1 },
                xyz: { x: 0, y: 0, z: 0, alpha: 1 }
            }
        },
        numBoxes: 1,
        paletteType: 'ERROR: DEFAULT UNBRANDED PALETTE',
        timestamp: Date.now()
    }
};
const unbrandedItem = {
    id: 'fake',
    colors: {
        cmyk: { cyan: 0, magenta: 0, yellow: 0, key: 0, alpha: 1 },
        hex: { hex: '#000000FF', alpha: 'FF', numAlpha: 1 },
        hsl: { hue: 0, saturation: 0, lightness: 0, alpha: 1 },
        hsv: { hue: 0, saturation: 0, value: 0, alpha: 1 },
        lab: { l: 0, a: 0, b: 0, alpha: 1 },
        rgb: { red: 0, green: 0, blue: 0, alpha: 1 },
        xyz: { x: 0, y: 0, z: 0, alpha: 1 }
    },
    colorStrings: {
        cmyk: {
            cyan: '0%',
            magenta: '0%',
            yellow: '0%',
            key: '0%',
            alpha: '1'
        },
        hex: { hex: '#000000FF', alpha: 'FF', numAlpha: '1' },
        hsl: { hue: '0', saturation: '0%', lightness: '0%', alpha: '1' },
        hsv: { hue: '0', saturation: '0%', value: '0%', alpha: '1' },
        lab: { l: '0', a: '0', b: '0', alpha: '1' },
        rgb: { red: '0', green: '0', blue: '0', alpha: '1' },
        xyz: { x: '0', y: '0', z: '0', alpha: '1' }
    },
    cssStrings: {
        cmykCSSString: 'cmyk(0%, 0%, 0%, 100%, 1)',
        hexCSSString: '#000000FF',
        hslCSSString: 'hsl(0, 0%, 0%, 0)',
        hsvCSSString: 'hsv(0, 0%, 0%, 0)',
        labCSSString: 'lab(0, 0, 0, 0)',
        rgbCSSString: 'rgb(0, 0, 0, 1)',
        xyzCSSString: 'xyz(0, 0, 0, 0)'
    }
};
const unbrandedStored = {
    tableID: 1,
    palette: unbrandedData
};
const palette$1 = {
    unbrandedData,
    unbrandedItem,
    unbrandedStored
};

// File: src/data/defaults/index.js
const colors = { ...colors$1 };
const colorStrings = colors$1.strings;
const defaults$1 = {
    colors,
    colorStrings,
    idb: idb$c,
    palette: palette$1
};

// File: src/data/idb/base.js
const DEFAULT_KEYS = {
    APP_SETTINGS: 'appSettings',
    CUSTOM_COLOR: 'customColor'
};
const STORE_NAMES = {
    CUSTOM_COLOR: 'customColor',
    MUTATIONS: 'mutations',
    PALLETES: 'palettes',
    SETTINGS: 'settings',
    TABLES: 'tables'
};
const base$7 = {
    DEFAULT_KEYS,
    STORE_NAMES
};

// File: src/data/idb/index.js
const idb$b = {
    ...base$7
};

// File: src/data/base.js
const base$6 = {
    AlphaRange: [0, 1],
    ByteRange: [0, 255],
    HexComponent: 'HexComponent',
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

// File: src/data/sets/index.js
const sets = {
    ...base$6
};

// File: src/data/index.js
const data = {
    consts: consts$3,
    defaults: defaults$1,
    idb: idb$b,
    mode: mode$i,
    sets
};

// File: src/common/core/base.js
const defaultColors = data.defaults.colors;
const mode$h = data.mode;
const _sets = data.sets;
function clampToRange(value, rangeKey) {
    const [min, max] = _sets[rangeKey];
    return Math.min(Math.max(value, min), max);
}
function clone(value) {
    return structuredClone(value);
}
function debounce(func, delay) {
    let timeout = null;
    return (...args) => {
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args);
        }, delay);
    };
}
function parseCustomColor(rawValue) {
    try {
        if (!mode$h.quiet)
            console.log(`Parsing custom color: ${JSON.stringify(rawValue)}`);
        const match = rawValue.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?,\s*(\d*\.?\d+)\)/);
        if (match) {
            const [, hue, saturation, lightness, alpha] = match;
            return {
                value: {
                    hue: brand.asRadial(parseInt(hue)),
                    saturation: brand.asPercentile(parseInt(saturation)),
                    lightness: brand.asPercentile(parseInt(lightness)),
                    alpha: brand.asAlphaRange(parseFloat(alpha))
                },
                format: 'hsl'
            };
        }
        else {
            if (mode$h.errorLogs)
                console.error('Invalid HSL custom color. Expected format: hsl(H, S%, L%, A)');
            return null;
        }
    }
    catch (error) {
        if (mode$h.errorLogs)
            console.error(`parseCustomColor error: ${error}`);
        return null;
    }
}
const base$5 = {
    clampToRange,
    clone,
    debounce,
    parseCustomColor
};
// ******** SECTION 2 ********
function asAlphaRange(value) {
    validate$1.range(value, 'AlphaRange');
    return value;
}
function asBranded(value, rangeKey) {
    validate$1.range(value, rangeKey);
    return value;
}
function asByteRange(value) {
    validate$1.range(value, 'ByteRange');
    return value;
}
function asHexComponent(value) {
    if (!validate$1.hexComponent(value)) {
        throw new Error(`Invalid HexComponent value: ${value}`);
    }
    return value;
}
function asHexSet(value) {
    if (/^#[0-9a-fA-F]{8}$/.test(value)) {
        value = value.slice(0, 7);
    }
    if (!validate$1.hexSet(value)) {
        throw new Error(`Invalid HexSet value: ${value}`);
    }
    return value;
}
function asLAB_L(value) {
    validate$1.range(value, 'LAB_L');
    return value;
}
function asLAB_A(value) {
    validate$1.range(value, 'LAB_A');
    return value;
}
function asLAB_B(value) {
    validate$1.range(value, 'LAB_B');
    return value;
}
function asPercentile(value) {
    validate$1.range(value, 'Percentile');
    return value;
}
function asRadial(value) {
    validate$1.range(value, 'Radial');
    return value;
}
function asXYZ_X(value) {
    validate$1.range(value, 'XYZ_X');
    return value;
}
function asXYZ_Y(value) {
    validate$1.range(value, 'XYZ_Y');
    return value;
}
function asXYZ_Z(value) {
    validate$1.range(value, 'XYZ_Z');
    return value;
}
const brand = {
    asAlphaRange,
    asBranded,
    asByteRange,
    asHexComponent,
    asHexSet,
    asLAB_L,
    asLAB_A,
    asLAB_B,
    asPercentile,
    asRadial,
    asXYZ_X,
    asXYZ_Y,
    asXYZ_Z
};
// ******** SECTION 2 - Brand Color ********
function asCMYK(color) {
    const brandedCyan = brand.asPercentile(color.value.cyan);
    const brandedMagenta = brand.asPercentile(color.value.magenta);
    const brandedYellow = brand.asPercentile(color.value.yellow);
    const brandedKey = brand.asPercentile(color.value.key);
    const brandedAlpha = brand.asAlphaRange(color.value.alpha);
    return {
        value: {
            cyan: brandedCyan,
            magenta: brandedMagenta,
            yellow: brandedYellow,
            key: brandedKey,
            alpha: brandedAlpha
        },
        format: 'cmyk'
    };
}
function asHex(color) {
    let hex = color.value.hex;
    if (!hex.startsWith('#'))
        hex = `#${hex}`;
    if (!/^#[0-9A-Fa-f]{8}$/.test(hex))
        throw new Error(`Invalid Hex color format: ${hex}`);
    const hexMain = hex.slice(0, 7);
    const alpha = hex.slice(7, 9);
    const brandedHex = brand.asHexSet(hexMain);
    const brandedHexAlpha = brand.asHexComponent(alpha);
    const brandedNumAlpha = brand.asAlphaRange(color.value.numAlpha);
    return {
        value: {
            hex: brandedHex,
            alpha: brandedHexAlpha,
            numAlpha: brandedNumAlpha
        },
        format: 'hex'
    };
}
function asHSL(color) {
    const brandedHue = brand.asRadial(color.value.hue);
    const brandedSaturation = brand.asPercentile(color.value.saturation);
    const brandedLightness = brand.asPercentile(color.value.lightness);
    const brandedAlpha = brand.asAlphaRange(color.value.alpha);
    return {
        value: {
            hue: brandedHue,
            saturation: brandedSaturation,
            lightness: brandedLightness,
            alpha: brandedAlpha
        },
        format: 'hsl'
    };
}
function asHSV(color) {
    const brandedHue = brand.asRadial(color.value.hue);
    const brandedSaturation = brand.asPercentile(color.value.saturation);
    const brandedValue = brand.asPercentile(color.value.value);
    const brandedAlpha = brand.asAlphaRange(color.value.alpha);
    return {
        value: {
            hue: brandedHue,
            saturation: brandedSaturation,
            value: brandedValue,
            alpha: brandedAlpha
        },
        format: 'hsv'
    };
}
function asLAB(color) {
    const brandedL = brand.asLAB_L(color.value.l);
    const brandedA = brand.asLAB_A(color.value.a);
    const brandedB = brand.asLAB_B(color.value.b);
    const brandedAlpha = brand.asAlphaRange(color.value.alpha);
    return {
        value: {
            l: brandedL,
            a: brandedA,
            b: brandedB,
            alpha: brandedAlpha
        },
        format: 'lab'
    };
}
function asRGB(color) {
    const brandedRed = brand.asByteRange(color.value.red);
    const brandedGreen = brand.asByteRange(color.value.green);
    const brandedBlue = brand.asByteRange(color.value.blue);
    const brandedAlpha = brand.asAlphaRange(color.value.alpha);
    return {
        value: {
            red: brandedRed,
            green: brandedGreen,
            blue: brandedBlue,
            alpha: brandedAlpha
        },
        format: 'rgb'
    };
}
function asSL(color) {
    const brandedSaturation = brand.asPercentile(color.value.saturation);
    const brandedLightness = brand.asPercentile(color.value.lightness);
    const brandedAlpha = brand.asAlphaRange(color.value.alpha);
    return {
        value: {
            saturation: brandedSaturation,
            lightness: brandedLightness,
            alpha: brandedAlpha
        },
        format: 'sl'
    };
}
function asSV(color) {
    const brandedSaturation = brand.asPercentile(color.value.saturation);
    const brandedValue = brand.asPercentile(color.value.value);
    const brandedAlpha = brand.asAlphaRange(color.value.alpha);
    return {
        value: {
            saturation: brandedSaturation,
            value: brandedValue,
            alpha: brandedAlpha
        },
        format: 'sv'
    };
}
function asXYZ(color) {
    const brandedX = brand.asXYZ_X(color.value.x);
    const brandedY = brand.asXYZ_Y(color.value.y);
    const brandedZ = brand.asXYZ_Z(color.value.z);
    const brandedAlpha = brand.asAlphaRange(color.value.alpha);
    return {
        value: {
            x: brandedX,
            y: brandedY,
            z: brandedZ,
            alpha: brandedAlpha
        },
        format: 'xyz'
    };
}
const brandColor = {
    asCMYK,
    asHex,
    asHSL,
    asHSV,
    asLAB,
    asRGB,
    asSL,
    asSV,
    asXYZ
};
// ******** SECTION 3 - Convert ********
function hexAlphaToNumericAlpha$1(hexAlpha) {
    return parseInt(hexAlpha, 16) / 255;
}
function toColor(colorString) {
    const clonedColor = clone(colorString);
    const parseValue = (value) => typeof value === 'string' && value.endsWith('%')
        ? parseFloat(value.slice(0, -1))
        : Number(value);
    const newValue = Object.entries(clonedColor.value).reduce((acc, [key, val]) => {
        acc[key] = parseValue(val);
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
            if (mode$h.errorLogs)
                console.error('Unsupported format for colorStringToColor');
            const unbrandedHSL = defaultColors.hsl;
            const brandedHue = brand.asRadial(unbrandedHSL.value.hue);
            const brandedSaturation = brand.asPercentile(unbrandedHSL.value.saturation);
            const brandedLightness = brand.asPercentile(unbrandedHSL.value.lightness);
            const brandedAlpha = brand.asAlphaRange(unbrandedHSL.value.alpha);
            return {
                value: {
                    hue: brandedHue,
                    saturation: brandedSaturation,
                    lightness: brandedLightness,
                    alpha: brandedAlpha
                },
                format: 'hsl'
            };
    }
}
function toColorValueRange(value, rangeKey) {
    validate$1.range(value, rangeKey);
    if (rangeKey === 'HexSet') {
        return brand.asHexSet(value);
    }
    if (rangeKey === 'HexComponent') {
        return brand.asHexComponent(value);
    }
    return brand.asBranded(value, rangeKey);
}
function toCSSColorString(color) {
    try {
        switch (color.format) {
            case 'cmyk':
                return `cmyk(${color.value.cyan}, ${color.value.magenta}, ${color.value.yellow}, ${color.value.key}, ${color.value.alpha})`;
            case 'hex':
                return String(color.value.hex);
            case 'hsl':
                return `hsl(${color.value.hue}, ${color.value.saturation}%, ${color.value.lightness}%, ${color.value.alpha})`;
            case 'hsv':
                return `hsv(${color.value.hue}, ${color.value.saturation}%, ${color.value.value}%, ${color.value.alpha})`;
            case 'lab':
                return `lab(${color.value.l}, ${color.value.a}, ${color.value.b}, ${color.value.alpha})`;
            case 'rgb':
                return `rgb(${color.value.red}, ${color.value.green}, ${color.value.blue}, ${color.value.alpha})`;
            case 'xyz':
                return `xyz(${color.value.x}, ${color.value.y}, ${color.value.z}, ${color.value.alpha})`;
            default:
                if (mode$h.errorLogs)
                    console.error(`Unexpected color format: ${color.format}`);
                return '#FFFFFFFF';
        }
    }
    catch (error) {
        throw new Error(`getCSSColorString error: ${error}`);
    }
}
const convert$1 = {
    hexAlphaToNumericAlpha: hexAlphaToNumericAlpha$1,
    toColor,
    toColorValueRange,
    toCSSColorString
};
// ******** SECTION 4 - Guards ********
function isColor(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    const color = value;
    const validFormats = [
        'cmyk',
        'hex',
        'hsl',
        'hsv',
        'lab',
        'rgb',
        'sl',
        'sv',
        'xyz'
    ];
    return ('value' in color &&
        'format' in color &&
        validFormats.includes(color.format));
}
function isColorSpace$1(value) {
    const validColorSpaces = [
        'cmyk',
        'hex',
        'hsl',
        'hsv',
        'lab',
        'rgb',
        'xyz'
    ];
    return (typeof value === 'string' &&
        validColorSpaces.includes(value));
}
function isColorString$1(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    const colorString = value;
    const validStringFormats = [
        'cmyk',
        'hsl',
        'hsv',
        'sl',
        'sv'
    ];
    return ('value' in colorString &&
        'format' in colorString &&
        validStringFormats.includes(colorString.format));
}
function isInRange(value, rangeKey) {
    if (rangeKey === 'HexSet') {
        return validate$1.hexSet(value);
    }
    if (rangeKey === 'HexComponent') {
        return validate$1.hexComponent(value);
    }
    if (typeof value === 'number' && Array.isArray(_sets[rangeKey])) {
        const [min, max] = _sets[rangeKey];
        return value >= min && value <= max;
    }
    throw new Error(`Invalid range or value for ${rangeKey}`);
}
const guards = {
    isColor,
    isColorSpace: isColorSpace$1,
    isColorString: isColorString$1,
    isInRange
};
// ******** SECTION 5 - Sanitize ********
function lab(value, output) {
    if (output === 'l') {
        return brand.asLAB_L(Math.round(Math.min(Math.max(value, 0), 100)));
    }
    else if (output === 'a') {
        return brand.asLAB_A(Math.round(Math.min(Math.max(value, -125), 125)));
    }
    else if (output === 'b') {
        return brand.asLAB_B(Math.round(Math.min(Math.max(value, -125), 125)));
    }
    else
        throw new Error('Unable to return LAB value');
}
function percentile(value) {
    const rawPercentile = Math.round(Math.min(Math.max(value, 0), 100));
    return brand.asPercentile(rawPercentile);
}
function radial(value) {
    const rawRadial = Math.round(Math.min(Math.max(value, 0), 360)) & 360;
    return brand.asRadial(rawRadial);
}
function rgb(value) {
    const rawByteRange = Math.round(Math.min(Math.max(value, 0), 255));
    return toColorValueRange(rawByteRange, 'ByteRange');
}
const sanitize = {
    lab,
    percentile,
    radial,
    rgb
};
// ******** SECTION 6 - Validate ********
function colorValues(color) {
    const clonedColor = clone(color);
    const isNumericValid = (value) => typeof value === 'number' && !isNaN(value);
    const normalizePercentage = (value) => {
        if (typeof value === 'string' && value.endsWith('%')) {
            return parseFloat(value.slice(0, -1));
        }
        return typeof value === 'number' ? value : NaN;
    };
    switch (clonedColor.format) {
        case 'cmyk':
            return ([
                clonedColor.value.cyan,
                clonedColor.value.magenta,
                clonedColor.value.yellow,
                clonedColor.value.key
            ].every(isNumericValid) &&
                clonedColor.value.cyan >= 0 &&
                clonedColor.value.cyan <= 100 &&
                clonedColor.value.magenta >= 0 &&
                clonedColor.value.magenta <= 100 &&
                clonedColor.value.yellow >= 0 &&
                clonedColor.value.yellow <= 100 &&
                clonedColor.value.key >= 0 &&
                clonedColor.value.key <= 100);
        case 'hex':
            return /^#[0-9A-Fa-f]{6}$/.test(clonedColor.value.hex);
        case 'hsl':
            const isValidHSLHue = isNumericValid(clonedColor.value.hue) &&
                clonedColor.value.hue >= 0 &&
                clonedColor.value.hue <= 360;
            const isValidHSLSaturation = normalizePercentage(clonedColor.value.saturation) >= 0 &&
                normalizePercentage(clonedColor.value.saturation) <= 100;
            const isValidHSLLightness = clonedColor.value.lightness
                ? normalizePercentage(clonedColor.value.lightness) >= 0 &&
                    normalizePercentage(clonedColor.value.lightness) <= 100
                : true;
            return isValidHSLHue && isValidHSLSaturation && isValidHSLLightness;
        case 'hsv':
            const isValidHSVHue = isNumericValid(clonedColor.value.hue) &&
                clonedColor.value.hue >= 0 &&
                clonedColor.value.hue <= 360;
            const isValidHSVSaturation = normalizePercentage(clonedColor.value.saturation) >= 0 &&
                normalizePercentage(clonedColor.value.saturation) <= 100;
            const isValidHSVValue = clonedColor.value.value
                ? normalizePercentage(clonedColor.value.value) >= 0 &&
                    normalizePercentage(clonedColor.value.value) <= 100
                : true;
            return isValidHSVHue && isValidHSVSaturation && isValidHSVValue;
        case 'lab':
            return ([
                clonedColor.value.l,
                clonedColor.value.a,
                clonedColor.value.b
            ].every(isNumericValid) &&
                clonedColor.value.l >= 0 &&
                clonedColor.value.l <= 100 &&
                clonedColor.value.a >= -125 &&
                clonedColor.value.a <= 125 &&
                clonedColor.value.b >= -125 &&
                clonedColor.value.b <= 125);
        case 'rgb':
            return ([
                clonedColor.value.red,
                clonedColor.value.green,
                clonedColor.value.blue
            ].every(isNumericValid) &&
                clonedColor.value.red >= 0 &&
                clonedColor.value.red <= 255 &&
                clonedColor.value.green >= 0 &&
                clonedColor.value.green <= 255 &&
                clonedColor.value.blue >= 0 &&
                clonedColor.value.blue <= 255);
        case 'sl':
            return ([
                clonedColor.value.saturation,
                clonedColor.value.lightness
            ].every(isNumericValid) &&
                clonedColor.value.saturation >= 0 &&
                clonedColor.value.saturation <= 100 &&
                clonedColor.value.lightness >= 0 &&
                clonedColor.value.lightness <= 100);
        case 'sv':
            return ([clonedColor.value.saturation, clonedColor.value.value].every(isNumericValid) &&
                clonedColor.value.saturation >= 0 &&
                clonedColor.value.saturation <= 100 &&
                clonedColor.value.value >= 0 &&
                clonedColor.value.value <= 100);
        case 'xyz':
            return ([
                clonedColor.value.x,
                clonedColor.value.y,
                clonedColor.value.z
            ].every(isNumericValid) &&
                clonedColor.value.x >= 0 &&
                clonedColor.value.x <= 95.047 &&
                clonedColor.value.y >= 0 &&
                clonedColor.value.y <= 100.0 &&
                clonedColor.value.z >= 0 &&
                clonedColor.value.z <= 108.883);
        default:
            if (mode$h.errorLogs)
                console.error(`Unsupported color format: ${color.format}`);
            return false;
    }
}
function hex(value, pattern) {
    return pattern.test(value);
}
function hexComponent(value) {
    return hex(value, /^[A-Fa-f0-9]{2}$/);
}
function hexSet(value) {
    return /^#[0-9a-fA-F]{6}$/.test(value);
}
function range(value, rangeKey) {
    if (!isInRange(value, rangeKey)) {
        if (rangeKey === 'HexSet' || rangeKey === 'HexComponent') {
            throw new Error(`Invalid value for ${rangeKey}: ${value}`);
        }
        const [min, max] = _sets[rangeKey];
        throw new Error(`Value ${value} is out of range for ${rangeKey} [${min}, ${max}]`);
    }
}
const validate$1 = {
    colorValues,
    hex,
    hexComponent,
    hexSet,
    range
};

// File: src/common/core/index.js
const core = {
    base: base$5,
    brand,
    brandColor,
    convert: convert$1,
    guards,
    sanitize,
    validate: validate$1
};

// File: src/common/helpers/conversion.js
const mode$g = data.mode;
function applyGammaCorrection(value) {
    try {
        return value > 0.0031308
            ? 1.055 * Math.pow(value, 1 / 2.4) - 0.055
            : 12.92 * value;
    }
    catch (error) {
        if (mode$g.errorLogs)
            console.error(`Error applying gamma correction: ${error}`);
        return value;
    }
}
function clampRGB(rgb) {
    const defaultRGBUnbranded = core.base.clone(data.defaults.colors.rgb);
    const defaultRGBBranded = core.brandColor.asRGB(defaultRGBUnbranded);
    if (!core.validate.colorValues(rgb)) {
        if (mode$g.errorLogs)
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
        return defaultRGBBranded;
    }
    try {
        return {
            value: {
                red: core.brand.asByteRange(Math.round(Math.min(Math.max(0, rgb.value.red), 1) * 255)),
                green: core.brand.asByteRange(Math.round(Math.min(Math.max(0, rgb.value.green), 1) * 255)),
                blue: core.brand.asByteRange(Math.round(Math.min(Math.max(0, rgb.value.blue), 1) * 255)),
                alpha: core.brand.asAlphaRange(parseFloat(Math.min(Math.max(0, rgb.value.alpha), 1).toFixed(2)))
            },
            format: 'rgb'
        };
    }
    catch (error) {
        if (mode$g.errorLogs)
            console.error(`Error clamping RGB values: ${error}`);
        return rgb;
    }
}
function hueToRGB(p, q, t) {
    try {
        const clonedP = core.base.clone(p);
        const clonedQ = core.base.clone(q);
        let clonedT = core.base.clone(t);
        if (clonedT < 0)
            clonedT += 1;
        if (clonedT > 1)
            clonedT -= 1;
        if (clonedT < 1 / 6)
            return clonedP + (clonedQ - clonedP) * 6 * clonedT;
        if (clonedT < 1 / 2)
            return clonedQ;
        if (clonedT < 2 / 3)
            return clonedP + (clonedQ - clonedP) * (2 / 3 - clonedT) * 6;
        return clonedP;
    }
    catch (error) {
        if (mode$g.errorLogs)
            console.error(`Error converting hue to RGB: ${error}`);
        return 0;
    }
}
function hslAddFormat(value) {
    const defaultHSLUnbranded = core.base.clone(data.defaults.colors.hsl);
    const defaultHSLBranded = core.brandColor.asHSL(defaultHSLUnbranded);
    try {
        if (!core.validate.colorValues({ value: value, format: 'hsl' })) {
            if (mode$g.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(value)}`);
            return defaultHSLBranded;
        }
        return { value: value, format: 'hsl' };
    }
    catch (error) {
        if (mode$g.errorLogs)
            console.error(`Error adding HSL format: ${error}`);
        return defaultHSLBranded;
    }
}
const conversion$2 = {
    applyGammaCorrection,
    clampRGB,
    hslAddFormat,
    hueToRGB
};

// File: src/common/transform/base.js
function addHashToHex(hex) {
    try {
        return hex.value.hex.startsWith('#')
            ? hex
            : {
                value: {
                    hex: brand.asHexSet(`#${hex.value}}`),
                    alpha: brand.asHexComponent(`#$hex.value.alpha`),
                    numAlpha: brand.asAlphaRange(hex.value.numAlpha)
                },
                format: 'hex'
            };
    }
    catch (error) {
        throw new Error(`addHashToHex error: ${error}`);
    }
}
function brandPalette(data) {
    return {
        ...data,
        metadata: {
            ...data.metadata,
            customColor: {
                hslColor: {
                    ...(data.metadata.customColor?.hslColor ?? {
                        value: {
                            hue: 0,
                            saturation: 0,
                            lightness: 0,
                            alpha: 1
                        },
                        format: 'hsl'
                    }),
                    value: {
                        hue: brand.asRadial(data.metadata.customColor?.hslColor?.value.hue ?? 0),
                        saturation: brand.asPercentile(data.metadata.customColor?.hslColor?.value
                            .saturation ?? 0),
                        lightness: brand.asPercentile(data.metadata.customColor?.hslColor?.value
                            .lightness ?? 0),
                        alpha: brand.asAlphaRange(data.metadata.customColor?.hslColor?.value.alpha ??
                            1)
                    }
                },
                convertedColors: {
                    cmyk: {
                        cyan: brand.asPercentile(data.metadata.customColor?.convertedColors?.cmyk
                            .cyan ?? 0),
                        magenta: brand.asPercentile(data.metadata.customColor?.convertedColors?.cmyk
                            .magenta ?? 0),
                        yellow: brand.asPercentile(data.metadata.customColor?.convertedColors?.cmyk
                            .yellow ?? 0),
                        key: brand.asPercentile(data.metadata.customColor?.convertedColors?.cmyk
                            .key ?? 0),
                        alpha: brand.asAlphaRange(data.metadata.customColor?.convertedColors?.cmyk
                            .alpha ?? 1)
                    },
                    hex: {
                        hex: brand.asHexSet(data.metadata.customColor?.convertedColors?.hex
                            .hex ?? '#000000FF'),
                        alpha: brand.asHexComponent(data.metadata.customColor?.convertedColors?.hex
                            .alpha ?? 'FF'),
                        numAlpha: brand.asAlphaRange(data.metadata.customColor?.convertedColors?.hex
                            .numAlpha ?? 1)
                    },
                    hsl: {
                        hue: brand.asRadial(data.metadata.customColor?.convertedColors?.hsl
                            .hue ?? 0),
                        saturation: brand.asPercentile(data.metadata.customColor?.convertedColors?.hsl
                            .saturation ?? 0),
                        lightness: brand.asPercentile(data.metadata.customColor?.convertedColors?.hsl
                            .lightness ?? 0),
                        alpha: brand.asAlphaRange(data.metadata.customColor?.convertedColors?.hsl
                            .alpha ?? 1)
                    },
                    hsv: {
                        hue: brand.asRadial(data.metadata.customColor?.convertedColors?.hsv
                            .hue ?? 0),
                        saturation: brand.asPercentile(data.metadata.customColor?.convertedColors?.hsv
                            .saturation ?? 0),
                        value: brand.asPercentile(data.metadata.customColor?.convertedColors?.hsv
                            .value ?? 0),
                        alpha: brand.asAlphaRange(data.metadata.customColor?.convertedColors?.hsv
                            .alpha ?? 1)
                    },
                    lab: {
                        l: brand.asLAB_L(data.metadata.customColor?.convertedColors?.lab.l ??
                            0),
                        a: brand.asLAB_A(data.metadata.customColor?.convertedColors?.lab.a ??
                            0),
                        b: brand.asLAB_B(data.metadata.customColor?.convertedColors?.lab.b ??
                            0),
                        alpha: brand.asAlphaRange(data.metadata.customColor?.convertedColors?.lab
                            .alpha ?? 1)
                    },
                    rgb: {
                        red: brand.asByteRange(data.metadata.customColor?.convertedColors?.rgb
                            .red ?? 0),
                        green: brand.asByteRange(data.metadata.customColor?.convertedColors?.rgb
                            .green ?? 0),
                        blue: brand.asByteRange(data.metadata.customColor?.convertedColors?.rgb
                            .blue ?? 0),
                        alpha: brand.asAlphaRange(data.metadata.customColor?.convertedColors?.rgb
                            .alpha ?? 1)
                    },
                    xyz: {
                        x: brand.asXYZ_X(data.metadata.customColor?.convertedColors?.xyz.x ??
                            0),
                        y: brand.asXYZ_Y(data.metadata.customColor?.convertedColors?.xyz.y ??
                            0),
                        z: brand.asXYZ_Z(data.metadata.customColor?.convertedColors?.xyz.z ??
                            0),
                        alpha: brand.asAlphaRange(data.metadata.customColor?.convertedColors?.xyz
                            .alpha ?? 1)
                    }
                }
            }
        }
    };
}
function componentToHex(component) {
    try {
        const hex = Math.max(0, Math.min(255, component)).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
    catch (error) {
        if (!mode$i.quiet)
            console.error(`componentToHex error: ${error}`);
        return '00';
    }
}
function defaultColorValue(color) {
    switch (color.format) {
        case 'cmyk':
            return {
                value: {
                    cyan: brand.asPercentile(0),
                    magenta: brand.asPercentile(0),
                    yellow: brand.asPercentile(0),
                    key: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'cmyk'
            };
        case 'hex':
            return {
                value: {
                    hex: brand.asHexSet('#000000'),
                    alpha: brand.asHexComponent('FF'),
                    numAlpha: brand.asAlphaRange(1)
                },
                format: 'hex'
            };
        case 'hsl':
            return {
                value: {
                    hue: brand.asRadial(0),
                    saturation: brand.asPercentile(0),
                    lightness: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'hsl'
            };
        case 'hsv':
            return {
                value: {
                    hue: brand.asRadial(0),
                    saturation: brand.asPercentile(0),
                    value: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'hsv'
            };
        case 'lab':
            return {
                value: {
                    l: brand.asLAB_L(0),
                    a: brand.asLAB_A(0),
                    b: brand.asLAB_B(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'lab'
            };
        case 'rgb':
            return {
                value: {
                    red: brand.asByteRange(0),
                    green: brand.asByteRange(0),
                    blue: brand.asByteRange(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'rgb'
            };
        case 'sl':
            return {
                value: {
                    saturation: brand.asPercentile(0),
                    lightness: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'sl'
            };
        case 'sv':
            return {
                value: {
                    saturation: brand.asPercentile(0),
                    value: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'sv'
            };
        case 'xyz':
            return {
                value: {
                    x: brand.asXYZ_X(0),
                    y: brand.asXYZ_Y(0),
                    z: brand.asXYZ_Z(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'xyz'
            };
        default:
            throw new Error(`
				Unknown color format\nDetails: ${JSON.stringify(color)}`);
    }
}
const base$4 = {
    addHashToHex,
    componentToHex,
    brandPalette,
    defaultColorValue
};

// File: src/common/utils/color.js
const mode$f = data.mode;
// ******** SECTION 1: Robust Type Guards ********
function isColorFormat(color, format) {
    return color.format === format;
}
function isColorSpace(value) {
    return ['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'xyz'].includes(value);
}
function isColorSpaceExtended(value) {
    return [
        'cmyk',
        'hex',
        'hsl',
        'hsv',
        'lab',
        'rgb',
        'sl',
        'sv',
        'xyz'
    ].includes(value);
}
function isColorString(value) {
    if (typeof value === 'object' && value !== null) {
        const colorString = value;
        const validStringFormats = ['cmyk', 'hsl', 'hsv', 'lab', 'rgb', 'sl', 'sv', 'xyz'];
        return ('value' in colorString &&
            'format' in colorString &&
            validStringFormats.includes(colorString.format));
    }
    return typeof value === 'string' && /^#[0-9A-Fa-f]{6,8}$/.test(value);
}
function isFormat(format) {
    return (typeof format === 'string' &&
        ['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'sl', 'sv', 'xyz'].includes(format));
}
// ******** SECTION 2: Narrow Type Guards ********
function isCMYKColor(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'cmyk' &&
        'value' in value &&
        typeof value.value.cyan === 'number' &&
        typeof value.value.magenta === 'number' &&
        typeof value.value.yellow === 'number' &&
        typeof value.value.key === 'number');
}
function isCMYKFormat(color) {
    return isColorFormat(color, 'cmyk');
}
function isCMYKString(value) {
    return (isColorString(value) &&
        typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'cmyk' &&
        'value' in value &&
        typeof value.value.cyan === 'string' &&
        typeof value.value.magenta === 'string' &&
        typeof value.value.yellow === 'string' &&
        typeof value.value.key === 'string');
}
function isHex(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'hex' &&
        'value' in value &&
        typeof value.value.hex === 'string');
}
function isHexFormat(color) {
    return isColorFormat(color, 'hex');
}
function isHSLColor(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'hsl' &&
        'value' in value &&
        typeof value.value.hue === 'number' &&
        typeof value.value.saturation === 'number' &&
        typeof value.value.lightness === 'number');
}
function isHSLFormat(color) {
    return isColorFormat(color, 'hsl');
}
function isHSLString(value) {
    return (isColorString(value) &&
        typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'hsl' &&
        'value' in value &&
        typeof value.value.hue === 'number' &&
        typeof value.value.saturation === 'string' &&
        typeof value.value.lightness === 'string');
}
function isHSVColor(value) {
    return (core.guards.isColor(value) &&
        typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'hsv' &&
        'value' in value &&
        typeof value.value.hue === 'number' &&
        typeof value.value.saturation === 'number' &&
        typeof value.value.value === 'number');
}
function isHSVFormat(color) {
    return isColorFormat(color, 'hsv');
}
function isHSVString(value) {
    return (isColorString(value) &&
        typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'hsv' &&
        'value' in value &&
        typeof value.value.hue === 'number' &&
        typeof value.value.saturation === 'string' &&
        typeof value.value.value === 'string');
}
function isLAB(value) {
    return (core.guards.isColor(value) &&
        typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'lab' &&
        'value' in value &&
        typeof value.value.l === 'number' &&
        typeof value.value.a === 'number' &&
        typeof value.value.b === 'number');
}
function isLABFormat(color) {
    return isColorFormat(color, 'lab');
}
function isRGB(value) {
    return (core.guards.isColor(value) &&
        typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'rgb' &&
        'value' in value &&
        typeof value.value.red === 'number' &&
        typeof value.value.green === 'number' &&
        typeof value.value.blue === 'number');
}
function isRGBFormat(color) {
    return isColorFormat(color, 'rgb');
}
function isSLColor(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'sl' &&
        'value' in value &&
        typeof value.value.saturation === 'number' &&
        typeof value.value.lightness === 'number');
}
function isSLFormat(color) {
    return isColorFormat(color, 'sl');
}
function isSLString(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'sl' &&
        'value' in value &&
        typeof value.value.saturation === 'string' &&
        typeof value.value.lightness === 'string');
}
function isSVColor(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'sv' &&
        'value' in value &&
        typeof value.value.saturation === 'number' &&
        typeof value.value.value === 'number');
}
function isSVFormat(color) {
    return isColorFormat(color, 'sv');
}
function isSVString(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'sv' &&
        'value' in value &&
        typeof value.value.saturation === 'string' &&
        typeof value.value.value === 'string');
}
function isXYZ(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'format' in value &&
        value.format === 'xyz' &&
        'value' in value &&
        typeof value.value.x === 'number' &&
        typeof value.value.y === 'number' &&
        typeof value.value.z === 'number');
}
function isXYZFormat(color) {
    return isColorFormat(color, 'xyz');
}
// ***** SECTION 3: Utility Guards *****
function ensureHash(value) {
    return value.startsWith('#') ? value : `#${value}`;
}
function isConvertibleColor(color) {
    return (color.format === 'cmyk' ||
        color.format === 'hex' ||
        color.format === 'hsl' ||
        color.format === 'hsv' ||
        color.format === 'lab' ||
        color.format === 'rgb');
}
function isInputElement(element) {
    return element instanceof HTMLInputElement;
}
function isStoredPalette(obj) {
    if (typeof obj !== 'object' || obj === null)
        return false;
    const candidate = obj;
    return (typeof candidate.tableID === 'number' &&
        typeof candidate.palette === 'object' &&
        Array.isArray(candidate.palette.items) &&
        typeof candidate.palette.id === 'string');
}
function narrowToColor(color) {
    if (isColorString(color)) {
        return core.convert.toColor(color);
    }
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
}
// ******** SECTION 4: TRANSFORM UTILS ********
function colorToColorString(color) {
    const clonedColor = core.base.clone(color);
    if (isColorString(clonedColor)) {
        if (mode$f.errorLogs) {
            console.log(`Already formatted as color string: ${JSON.stringify(color)}`);
        }
        return clonedColor;
    }
    if (isCMYKColor(clonedColor)) {
        const newValue = formatPercentageValues(clonedColor.value);
        return {
            format: 'cmyk',
            value: {
                cyan: `${newValue.cyan}%`,
                magenta: `${newValue.magenta}%`,
                yellow: `${newValue.yellow}%`,
                key: `${newValue.key}%`,
                alpha: `${newValue.alpha}`
            }
        };
    }
    else if (isHex(clonedColor)) {
        const newValue = formatPercentageValues(clonedColor.value);
        return {
            format: 'hex',
            value: {
                hex: `${newValue.hex}`,
                alpha: `${newValue.alpha}`,
                numAlpha: `${newValue.numAlpha}`
            }
        };
    }
    else if (isHSLColor(clonedColor)) {
        const newValue = formatPercentageValues(clonedColor.value);
        return {
            format: 'hsl',
            value: {
                hue: `${newValue.hue}`,
                saturation: `${newValue.saturation}%`,
                lightness: `${newValue.lightness}%`,
                alpha: `${newValue.alpha}`
            }
        };
    }
    else if (isHSVColor(clonedColor)) {
        const newValue = formatPercentageValues(clonedColor.value);
        return {
            format: 'hsv',
            value: {
                hue: `${newValue.hue}`,
                saturation: `${newValue.saturation}%`,
                value: `${newValue.value}%`,
                alpha: `${newValue.alpha}`
            }
        };
    }
    else if (isLAB(clonedColor)) {
        const newValue = formatPercentageValues(clonedColor.value);
        return {
            format: 'lab',
            value: {
                l: `${newValue.l}`,
                a: `${newValue.a}`,
                b: `${newValue.b}`,
                alpha: `${newValue.alpha}`
            }
        };
    }
    else if (isRGB(clonedColor)) {
        const newValue = formatPercentageValues(clonedColor.value);
        return {
            format: 'rgb',
            value: {
                red: `${newValue.red}`,
                green: `${newValue.green}`,
                blue: `${newValue.blue}`,
                alpha: `${newValue.alpha}`
            }
        };
    }
    else if (isXYZ(clonedColor)) {
        const newValue = formatPercentageValues(clonedColor.value);
        return {
            format: 'xyz',
            value: {
                x: `${newValue.x}`,
                y: `${newValue.y}`,
                z: `${newValue.z}`,
                alpha: `${newValue.alpha}`
            }
        };
    }
    else {
        if (!mode$f.gracefulErrors) {
            throw new Error(`Unsupported format: ${clonedColor.format}`);
        }
        else if (mode$f.errorLogs) {
            console.error(`Unsupported format: ${clonedColor.format}`);
        }
        else if (!mode$f.quiet) {
            console.warn('Failed to convert to color string.');
        }
        return data.defaults.colorStrings.hsl;
    }
}
function formatPercentageValues(value) {
    return Object.entries(value).reduce((acc, [key, val]) => {
        acc[key] = [
            'saturation',
            'lightness',
            'value',
            'cyan',
            'magenta',
            'yellow',
            'key'
        ].includes(key)
            ? `${val}%`
            : val;
        return acc;
    }, {});
}
function getAlphaFromHex(hex) {
    if (hex.length !== 9 || !hex.startsWith('#')) {
        if (!mode$f.gracefulErrors)
            throw new Error(`Invalid hex color: ${hex}. Expected format #RRGGBBAA`);
        else if (mode$f.errorLogs)
            console.error(`Invalid hex color: ${hex}. Expected format #RRGGBBAA`);
        else if (!mode$f.quiet)
            console.warn('Failed to parse alpha from hex color.');
    }
    const alphaHex = hex.slice(-2);
    const alphaDecimal = parseInt(alphaHex, 16);
    return alphaDecimal / 255;
}
function getColorString(color) {
    try {
        const formatters = {
            cmyk: (c) => `cmyk(${c.value.cyan}, ${c.value.magenta}, ${c.value.yellow}, ${c.value.key}, ${c.value.alpha})`,
            hex: (c) => c.value.hex,
            hsl: (c) => `hsl(${c.value.hue}, ${c.value.saturation}%, ${c.value.lightness}%,${c.value.alpha})`,
            hsv: (c) => `hsv(${c.value.hue}, ${c.value.saturation}%, ${c.value.value}%,${c.value.alpha})`,
            lab: (c) => `lab(${c.value.l}, ${c.value.a}, ${c.value.b},${c.value.alpha})`,
            rgb: (c) => `rgb(${c.value.red}, ${c.value.green}, ${c.value.blue},${c.value.alpha})`,
            xyz: (c) => `xyz(${c.value.x}, ${c.value.y}, ${c.value.z},${c.value.alpha})`
        };
        switch (color.format) {
            case 'cmyk':
                return formatters.cmyk(color);
            case 'hex':
                return formatters.hex(color);
            case 'hsl':
                return formatters.hsl(color);
            case 'hsv':
                return formatters.hsv(color);
            case 'lab':
                return formatters.lab(color);
            case 'rgb':
                return formatters.rgb(color);
            case 'xyz':
                return formatters.xyz(color);
            default:
                if (!mode$f.errorLogs)
                    console.error(`Unsupported color format for ${color}`);
                return null;
        }
    }
    catch (error) {
        if (!mode$f.errorLogs)
            console.error(`getColorString error: ${error}`);
        return null;
    }
}
function hexAlphaToNumericAlpha(hexAlpha) {
    return parseInt(hexAlpha, 16) / 255;
}
const parseColor = (colorSpace, value) => {
    try {
        switch (colorSpace) {
            case 'cmyk': {
                const [c, m, y, k, a] = parseComponents(value, 5);
                return {
                    value: {
                        cyan: core.brand.asPercentile(c),
                        magenta: core.brand.asPercentile(m),
                        yellow: core.brand.asPercentile(y),
                        key: core.brand.asPercentile(k),
                        alpha: core.brand.asAlphaRange(a)
                    },
                    format: 'cmyk'
                };
            }
            case 'hex':
                const hexValue = value.startsWith('#') ? value : `#${value}`;
                const alpha = hexValue.length === 9 ? hexValue.slice(-2) : 'FF';
                const numAlpha = hexAlphaToNumericAlpha(alpha);
                return {
                    value: {
                        hex: core.brand.asHexSet(hexValue),
                        alpha: core.brand.asHexComponent(alpha),
                        numAlpha: core.brand.asAlphaRange(numAlpha)
                    },
                    format: 'hex'
                };
            case 'hsl': {
                const [h, s, l, a] = parseComponents(value, 4);
                return {
                    value: {
                        hue: core.brand.asRadial(h),
                        saturation: core.brand.asPercentile(s),
                        lightness: core.brand.asPercentile(l),
                        alpha: core.brand.asAlphaRange(a)
                    },
                    format: 'hsl'
                };
            }
            case 'hsv': {
                const [h, s, v, a] = parseComponents(value, 4);
                return {
                    value: {
                        hue: core.brand.asRadial(h),
                        saturation: core.brand.asPercentile(s),
                        value: core.brand.asPercentile(v),
                        alpha: core.brand.asAlphaRange(a)
                    },
                    format: 'hsv'
                };
            }
            case 'lab': {
                const [l, a, b, alpha] = parseComponents(value, 4);
                return {
                    value: {
                        l: core.brand.asLAB_L(l),
                        a: core.brand.asLAB_A(a),
                        b: core.brand.asLAB_B(b),
                        alpha: core.brand.asAlphaRange(alpha)
                    },
                    format: 'lab'
                };
            }
            case 'rgb': {
                const components = value.split(',').map(Number);
                if (components.some(isNaN))
                    throw new Error('Invalid RGB format');
                const [r, g, b, a] = components;
                return {
                    value: {
                        red: core.brand.asByteRange(r),
                        green: core.brand.asByteRange(g),
                        blue: core.brand.asByteRange(b),
                        alpha: core.brand.asAlphaRange(a)
                    },
                    format: 'rgb'
                };
            }
            default:
                const message = `Unsupported color format: ${colorSpace}`;
                if (mode$f.gracefulErrors) {
                    if (mode$f.errorLogs)
                        console.error(message);
                    else if (!mode$f.quiet)
                        console.warn(`Failed to parse color: ${message}`);
                }
                else {
                    throw new Error(message);
                }
                return null;
        }
    }
    catch (error) {
        if (mode$f.errorLogs)
            console.error(`parseColor error: ${error}`);
        return null;
    }
};
function parseComponents(value, count) {
    try {
        const components = value
            .split(',')
            .map(val => val.trim().endsWith('%')
            ? parseFloat(val)
            : parseFloat(val) * 100);
        if (components.length !== count)
            if (!mode$f.gracefulErrors)
                throw new Error(`Expected ${count} components.`);
            else if (mode$f.errorLogs) {
                if (!mode$f.quiet)
                    console.warn(`Expected ${count} components.`);
                console.error(`Expected ${count} components.`);
                return [];
            }
        return components;
    }
    catch (error) {
        if (mode$f.errorLogs)
            console.error(`Error parsing components: ${error}`);
        return [];
    }
}
function parseHexWithAlpha(hexValue) {
    const hex = hexValue.startsWith('#') ? hexValue : `#${hexValue}`;
    const alpha = hex.length === 9 ? hex.slice(-2) : 'FF';
    const numAlpha = hexAlphaToNumericAlpha(alpha);
    return {
        hex: core.brand.asHexSet(hex),
        alpha: core.brand.asHexComponent(alpha),
        numAlpha: core.brand.asAlphaRange(numAlpha)
    };
}
function stripHashFromHex(hex) {
    try {
        const hexString = `${hex.value.hex}${hex.value.alpha}`;
        return hex.value.hex.startsWith('#')
            ? {
                value: {
                    hex: core.brand.asHexSet(hexString.slice(1)),
                    alpha: core.brand.asHexComponent(String(hex.value.alpha)),
                    numAlpha: core.brand.asAlphaRange(hexAlphaToNumericAlpha(String(hex.value.alpha)))
                },
                format: 'hex'
            }
            : hex;
    }
    catch (error) {
        if (mode$f.errorLogs)
            console.error(`stripHashFromHex error: ${error}`);
        const unbrandedHex = core.base.clone(data.defaults.colors.hex);
        return core.brandColor.asHex(unbrandedHex);
    }
}
function stripPercentFromValues(value) {
    return Object.entries(value).reduce((acc, [key, val]) => {
        const parsedValue = typeof val === 'string' && val.endsWith('%')
            ? parseFloat(val.slice(0, -1))
            : val;
        acc[key] = parsedValue;
        return acc;
    }, {});
}
function toHexWithAlpha(rgbValue) {
    const { red, green, blue, alpha } = rgbValue;
    const hex = `#${((1 << 24) + (red << 16) + (green << 8) + blue)
        .toString(16)
        .slice(1)}`;
    const alphaHex = Math.round(alpha * 255)
        .toString(16)
        .padStart(2, '0');
    return `${hex}${alphaHex}`;
}
const color = {
    colorToColorString,
    ensureHash,
    formatPercentageValues,
    getAlphaFromHex,
    getColorString,
    hexAlphaToNumericAlpha,
    isCMYKColor,
    isCMYKFormat,
    isCMYKString,
    isColorFormat,
    isColorString,
    isColorSpace,
    isColorSpaceExtended,
    isConvertibleColor,
    isFormat,
    isHex,
    isHexFormat,
    isHSLColor,
    isHSLFormat,
    isHSLString,
    isInputElement,
    isHSVColor,
    isHSVFormat,
    isHSVString,
    isLAB,
    isLABFormat,
    isRGB,
    isRGBFormat,
    isSLColor,
    isSLFormat,
    isSLString,
    isStoredPalette,
    isSVColor,
    isSVFormat,
    isSVString,
    isXYZ,
    isXYZFormat,
    narrowToColor,
    parseColor,
    parseComponents,
    parseHexWithAlpha,
    stripHashFromHex,
    stripPercentFromValues,
    toHexWithAlpha
};

// File: src/common/convert/base.js
const defaultCMYKUnbranded = base$5.clone(defaults$1.colors.cmyk);
const defaultHexUnbranded = base$5.clone(defaults$1.colors.hex);
const defaultHSLUnbranded = base$5.clone(defaults$1.colors.hsl);
const defaultHSVUnbranded = base$5.clone(defaults$1.colors.hsv);
const defaultLABUnbranded = base$5.clone(defaults$1.colors.lab);
const defaultRGBUnbranded = base$5.clone(defaults$1.colors.rgb);
const defaultSLUnbranded = base$5.clone(defaults$1.colors.sl);
const defaultSVUnbranded = base$5.clone(defaults$1.colors.sv);
const defaultXYZUnbranded = base$5.clone(defaults$1.colors.xyz);
const defaultCMYKBranded = brandColor.asCMYK(defaultCMYKUnbranded);
const defaultHexBranded = brandColor.asHex(defaultHexUnbranded);
const defaultHSLBranded = brandColor.asHSL(defaultHSLUnbranded);
const defaultHSVBranded = brandColor.asHSV(defaultHSVUnbranded);
const defaultLABBranded = brandColor.asLAB(defaultLABUnbranded);
const defaultRGBBranded = brandColor.asRGB(defaultRGBUnbranded);
const defaultSLBranded = brandColor.asSL(defaultSLUnbranded);
const defaultSVBranded = brandColor.asSV(defaultSVUnbranded);
const defaultXYZBranded = brandColor.asXYZ(defaultXYZUnbranded);
function cmykToHSL(cmyk) {
    try {
        if (!validate$1.colorValues(cmyk)) {
            if (mode$i.errorLogs)
                console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);
            return defaultHSLBranded;
        }
        return rgbToHSL(cmykToRGB(base$5.clone(cmyk)));
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`cmykToHSL() error: ${error}`);
        return defaultHSLBranded;
    }
}
function cmykToRGB(cmyk) {
    try {
        if (!validate$1.colorValues(cmyk)) {
            if (mode$i.errorLogs)
                console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);
            return defaultRGBBranded;
        }
        const clonedCMYK = base$5.clone(cmyk);
        const r = 255 *
            (1 - clonedCMYK.value.cyan / 100) *
            (1 - clonedCMYK.value.key / 100);
        const g = 255 *
            (1 - clonedCMYK.value.magenta / 100) *
            (1 - clonedCMYK.value.key / 100);
        const b = 255 *
            (1 - clonedCMYK.value.yellow / 100) *
            (1 - clonedCMYK.value.key / 100);
        const alpha = cmyk.value.alpha;
        const rgb = {
            value: {
                red: brand.asByteRange(Math.round(r)),
                green: brand.asByteRange(Math.round(g)),
                blue: brand.asByteRange(Math.round(b)),
                alpha: brand.asAlphaRange(alpha)
            },
            format: 'rgb'
        };
        return clampRGB(rgb);
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`cmykToRGB error: ${error}`);
        return defaultRGBBranded;
    }
}
function hexToHSL(hex) {
    try {
        if (!validate$1.colorValues(hex)) {
            if (mode$i.errorLogs)
                console.error(`Invalid Hex value ${JSON.stringify(hex)}`);
            return defaultHSLBranded;
        }
        return rgbToHSL(hexToRGB(base$5.clone(hex)));
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`hexToHSL() error: ${error}`);
        return defaultHSLBranded;
    }
}
function hexToHSLWrapper(input) {
    try {
        const clonedInput = base$5.clone(input);
        const hex = typeof clonedInput === 'string'
            ? {
                value: {
                    hex: brand.asHexSet(clonedInput),
                    alpha: brand.asHexComponent(clonedInput.slice(-2)),
                    numAlpha: brand.asAlphaRange(hexAlphaToNumericAlpha(clonedInput.slice(-2)))
                },
                format: 'hex'
            }
            : {
                ...clonedInput,
                value: {
                    ...clonedInput.value,
                    numAlpha: brand.asAlphaRange(hexAlphaToNumericAlpha(String(clonedInput.value.alpha)))
                }
            };
        return hexToHSL(hex);
    }
    catch (error) {
        if (mode$i.errorLogs) {
            console.error(`Error converting hex to HSL: ${error}`);
        }
        return defaultHSLBranded;
    }
}
function hexToRGB(hex) {
    try {
        if (!validate$1.colorValues(hex)) {
            if (mode$i.errorLogs)
                console.error(`Invalid Hex value ${JSON.stringify(hex)}`);
            return defaultRGBBranded;
        }
        const clonedHex = clone(hex);
        const strippedHex = stripHashFromHex(clonedHex).value.hex;
        const bigint = parseInt(strippedHex, 16);
        return {
            value: {
                red: brand.asByteRange(Math.round((bigint >> 16) & 255)),
                green: brand.asByteRange(Math.round((bigint >> 8) & 255)),
                blue: brand.asByteRange(Math.round(bigint & 255)),
                alpha: hex.value.numAlpha
            },
            format: 'rgb'
        };
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`hexToRGB error: ${error}`);
        return defaultRGBBranded;
    }
}
function hslToCMYK(hsl) {
    try {
        if (!validate$1.colorValues(hsl)) {
            if (mode$i.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return defaultCMYKBranded;
        }
        return rgbToCMYK(hslToRGB(clone(hsl)));
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`);
        return defaultCMYKBranded;
    }
}
function hslToHex(hsl) {
    try {
        if (!validate$1.colorValues(hsl)) {
            if (mode$i.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return defaultHexBranded;
        }
        return rgbToHex(hslToRGB(clone(hsl)));
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`hslToHex error: ${error}`);
        return defaultHexBranded;
    }
}
function hslToHSV(hsl) {
    try {
        if (!validate$1.colorValues(hsl)) {
            if (mode$i.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return defaultHSVBranded;
        }
        const clonedHSL = clone(hsl);
        const s = clonedHSL.value.saturation / 100;
        const l = clonedHSL.value.lightness / 100;
        const value = l + s * Math.min(l, 1 - 1);
        const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);
        return {
            value: {
                hue: brand.asRadial(Math.round(clonedHSL.value.hue)),
                saturation: brand.asPercentile(Math.round(newSaturation * 100)),
                value: brand.asPercentile(Math.round(value * 100)),
                alpha: brand.asAlphaRange(hsl.value.alpha)
            },
            format: 'hsv'
        };
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`hslToHSV() error: ${error}`);
        return defaultHSVBranded;
    }
}
function hslToLAB(hsl) {
    try {
        if (!validate$1.colorValues(hsl)) {
            if (mode$i.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return defaultLABBranded;
        }
        return xyzToLAB(rgbToXYZ(hslToRGB(clone(hsl))));
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`hslToLab() error: ${error}`);
        return defaultLABBranded;
    }
}
function hslToRGB(hsl) {
    try {
        if (!validate$1.colorValues(hsl)) {
            if (mode$i.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return defaultRGBBranded;
        }
        const clonedHSL = clone(hsl);
        const s = clonedHSL.value.saturation / 100;
        const l = clonedHSL.value.lightness / 100;
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        return {
            value: {
                red: brand.asByteRange(Math.round(hueToRGB(p, q, clonedHSL.value.hue + 1 / 3) * 255)),
                green: brand.asByteRange(Math.round(hueToRGB(p, q, clonedHSL.value.hue) * 255)),
                blue: brand.asByteRange(Math.round(hueToRGB(p, q, clonedHSL.value.hue - 1 / 3) * 255)),
                alpha: brand.asAlphaRange(hsl.value.alpha)
            },
            format: 'rgb'
        };
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`hslToRGB error: ${error}`);
        return defaultRGBBranded;
    }
}
function hslToSL(hsl) {
    try {
        if (!validate$1.colorValues(hsl)) {
            if (mode$i.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return defaultSLBranded;
        }
        return {
            value: {
                saturation: hsl.value.saturation,
                lightness: hsl.value.lightness,
                alpha: hsl.value.alpha
            },
            format: 'sl'
        };
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`Error converting HSL to SL: ${error}`);
        return defaultSLBranded;
    }
}
function hslToSV(hsl) {
    try {
        if (!validate$1.colorValues(hsl)) {
            if (mode$i.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return defaultSVBranded;
        }
        return hsvToSV(rgbToHSV(hslToRGB(clone(hsl))));
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`Error converting HSL to SV: ${error}`);
        return defaultSVBranded;
    }
}
function hslToXYZ(hsl) {
    try {
        if (!validate$1.colorValues(hsl)) {
            if (mode$i.errorLogs)
                console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return defaultXYZBranded;
        }
        return labToXYZ(hslToLAB(clone(hsl)));
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`hslToXYZ error: ${error}`);
        return defaultXYZBranded;
    }
}
function hsvToHSL(hsv) {
    try {
        if (!validate$1.colorValues(hsv)) {
            if (mode$i.errorLogs)
                console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);
            return defaultHSLBranded;
        }
        const clonedHSV = clone(hsv);
        const newSaturation = clonedHSV.value.value * (1 - clonedHSV.value.saturation / 100) ===
            0 || clonedHSV.value.value === 0
            ? 0
            : (clonedHSV.value.value -
                clonedHSV.value.value *
                    (1 - clonedHSV.value.saturation / 100)) /
                Math.min(clonedHSV.value.value, 100 - clonedHSV.value.value);
        const lightness = clonedHSV.value.value * (1 - clonedHSV.value.saturation / 200);
        return {
            value: {
                hue: brand.asRadial(Math.round(clonedHSV.value.hue)),
                saturation: brand.asPercentile(Math.round(newSaturation * 100)),
                lightness: brand.asPercentile(Math.round(lightness)),
                alpha: hsv.value.alpha
            },
            format: 'hsl'
        };
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`hsvToHSL() error: ${error}`);
        return defaultHSLBranded;
    }
}
function hsvToSV(hsv) {
    try {
        if (!validate$1.colorValues(hsv)) {
            if (mode$i.errorLogs)
                console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);
            return defaultSVBranded;
        }
        return {
            value: {
                saturation: hsv.value.saturation,
                value: hsv.value.value,
                alpha: hsv.value.alpha
            },
            format: 'sv'
        };
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`Error converting HSV to SV: ${error}`);
        return defaultSVBranded;
    }
}
function labToHSL(lab) {
    try {
        if (!validate$1.colorValues(lab)) {
            if (mode$i.errorLogs)
                console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return defaultHSLBranded;
        }
        return rgbToHSL(labToRGB(clone(lab)));
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`labToHSL() error: ${error}`);
        return defaultHSLBranded;
    }
}
function labToRGB(lab) {
    try {
        if (!validate$1.colorValues(lab)) {
            if (mode$i.errorLogs)
                console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return defaultRGBBranded;
        }
        return xyzToRGB(labToXYZ(clone(lab)));
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`labToRGB error: ${error}`);
        return defaultRGBBranded;
    }
}
function labToXYZ(lab) {
    try {
        if (!validate$1.colorValues(lab)) {
            if (mode$i.errorLogs)
                console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return defaultXYZBranded;
        }
        const clonedLAB = clone(lab);
        const refX = 95.047, refY = 100.0, refZ = 108.883;
        let y = (clonedLAB.value.l + 16) / 116;
        let x = clonedLAB.value.a / 500 + y;
        let z = y - clonedLAB.value.b / 200;
        const pow = Math.pow;
        return {
            value: {
                x: brand.asXYZ_X(Math.round(refX *
                    (pow(x, 3) > 0.008856
                        ? pow(x, 3)
                        : (x - 16 / 116) / 7.787))),
                y: brand.asXYZ_Y(Math.round(refY *
                    (pow(y, 3) > 0.008856
                        ? pow(y, 3)
                        : (y - 16 / 116) / 7.787))),
                z: brand.asXYZ_Z(Math.round(refZ *
                    (pow(z, 3) > 0.008856
                        ? pow(z, 3)
                        : (z - 16 / 116) / 7.787))),
                alpha: brand.asAlphaRange(lab.value.alpha)
            },
            format: 'xyz'
        };
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`labToXYZ error: ${error}`);
        return defaultXYZBranded;
    }
}
function rgbToCMYK(rgb) {
    try {
        if (!validate$1.colorValues(rgb)) {
            if (mode$i.errorLogs)
                console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return defaultCMYKBranded;
        }
        const clonedRGB = clone(rgb);
        const redPrime = clonedRGB.value.red / 255;
        const greenPrime = clonedRGB.value.green / 255;
        const bluePrime = clonedRGB.value.blue / 255;
        const key = sanitize.percentile(Math.round(1 - Math.max(redPrime, greenPrime, bluePrime)));
        const cyan = sanitize.percentile(Math.round((1 - redPrime - key) / (1 - key) || 0));
        const magenta = sanitize.percentile(Math.round((1 - greenPrime - key) / (1 - key) || 0));
        const yellow = sanitize.percentile(Math.round((1 - bluePrime - key) / (1 - key) || 0));
        const alpha = brand.asAlphaRange(rgb.value.alpha);
        const format = 'cmyk';
        const cmyk = { value: { cyan, magenta, yellow, key, alpha }, format };
        if (!mode$i.quiet)
            console.log(`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(clone(cmyk))}`);
        return cmyk;
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`Error converting RGB to CMYK: ${error}`);
        return defaultCMYKBranded;
    }
}
function rgbToHex(rgb) {
    try {
        if (!validate$1.colorValues(rgb)) {
            if (mode$i.errorLogs)
                console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return defaultHexBranded;
        }
        const clonedRGB = clone(rgb);
        if ([
            clonedRGB.value.red,
            clonedRGB.value.green,
            clonedRGB.value.blue
        ].some(v => isNaN(v) || v < 0 || v > 255) ||
            [clonedRGB.value.alpha].some(v => isNaN(v) || v < 0 || v > 1)) {
            if (mode$i.warnLogs)
                console.warn(`Invalid RGB values:\nR=${JSON.stringify(clonedRGB.value.red)}\nG=${JSON.stringify(clonedRGB.value.green)}\nB=${JSON.stringify(clonedRGB.value.blue)}\nA=${JSON.stringify(clonedRGB.value.alpha)}`);
            return {
                value: {
                    hex: brand.asHexSet('#000000FF'),
                    alpha: brand.asHexComponent('FF'),
                    numAlpha: brand.asAlphaRange(1)
                },
                format: 'hex'
            };
        }
        return {
            value: {
                hex: brand.asHexSet(`#${componentToHex(clonedRGB.value.red)}${componentToHex(clonedRGB.value.green)}${componentToHex(clonedRGB.value.blue)}`),
                alpha: brand.asHexComponent(componentToHex(clonedRGB.value.alpha)),
                numAlpha: clonedRGB.value.alpha
            },
            format: 'hex'
        };
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.warn(`rgbToHex error: ${error}`);
        return defaultHexBranded;
    }
}
function rgbToHSL(rgb) {
    try {
        if (!validate$1.colorValues(rgb)) {
            if (mode$i.errorLogs) {
                console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            }
            return defaultHSLBranded;
        }
        const clonedRGB = clone(rgb);
        const red = clonedRGB.value.red / 255;
        const green = clonedRGB.value.green / 255;
        const blue = clonedRGB.value.blue / 255;
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        let hue = 0, saturation = 0, lightness = (max + min) / 2;
        if (max !== min) {
            const delta = max - min;
            saturation =
                lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
            switch (max) {
                case red:
                    hue = (green - blue) / delta + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = (blue - red) / delta + 2;
                    break;
                case blue:
                    hue = (red - green) / delta + 4;
                    break;
            }
            hue *= 60;
        }
        return {
            value: {
                hue: brand.asRadial(Math.round(hue)),
                saturation: brand.asPercentile(Math.round(saturation * 100)),
                lightness: brand.asPercentile(Math.round(lightness * 100)),
                alpha: brand.asAlphaRange(rgb.value.alpha)
            },
            format: 'hsl'
        };
    }
    catch (error) {
        if (mode$i.errorLogs) {
            console.error(`rgbToHSL() error: ${error}`);
        }
        return defaultHSLBranded;
    }
}
function rgbToHSV(rgb) {
    try {
        if (!validate$1.colorValues(rgb)) {
            if (mode$i.errorLogs) {
                console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            }
            return defaultHSVBranded;
        }
        const red = rgb.value.red / 255;
        const green = rgb.value.green / 255;
        const blue = rgb.value.blue / 255;
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        const delta = max - min;
        let hue = 0;
        const value = max;
        const saturation = max === 0 ? 0 : delta / max;
        if (max !== min) {
            switch (max) {
                case red:
                    hue = (green - blue) / delta + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = (blue - red) / delta + 2;
                    break;
                case blue:
                    hue = (red - green) / delta + 4;
                    break;
            }
            hue *= 60;
        }
        return {
            value: {
                hue: brand.asRadial(Math.round(hue)),
                saturation: brand.asPercentile(Math.round(saturation * 100)),
                value: brand.asPercentile(Math.round(value * 100)),
                alpha: brand.asAlphaRange(rgb.value.alpha)
            },
            format: 'hsv'
        };
    }
    catch (error) {
        if (mode$i.errorLogs) {
            console.error(`rgbToHSV() error: ${error}`);
        }
        return defaultHSVBranded;
    }
}
function rgbToXYZ(rgb) {
    try {
        if (!validate$1.colorValues(rgb)) {
            if (mode$i.errorLogs) {
                console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            }
            return defaultXYZBranded;
        }
        const red = rgb.value.red / 255;
        const green = rgb.value.green / 255;
        const blue = rgb.value.blue / 255;
        const correctedRed = red > 0.04045 ? Math.pow((red + 0.055) / 1.055, 2.4) : red / 12.92;
        const correctedGreen = green > 0.04045
            ? Math.pow((green + 0.055) / 1.055, 2.4)
            : green / 12.92;
        const correctedBlue = blue > 0.04045
            ? Math.pow((blue + 0.055) / 1.055, 2.4)
            : blue / 12.92;
        const scaledRed = correctedRed * 100;
        const scaledGreen = correctedGreen * 100;
        const scaledBlue = correctedBlue * 100;
        return {
            value: {
                x: brand.asXYZ_X(Math.round(scaledRed * 0.4124 +
                    scaledGreen * 0.3576 +
                    scaledBlue * 0.1805)),
                y: brand.asXYZ_Y(Math.round(scaledRed * 0.2126 +
                    scaledGreen * 0.7152 +
                    scaledBlue * 0.0722)),
                z: brand.asXYZ_Z(Math.round(scaledRed * 0.0193 +
                    scaledGreen * 0.1192 +
                    scaledBlue * 0.9505)),
                alpha: brand.asAlphaRange(rgb.value.alpha)
            },
            format: 'xyz'
        };
    }
    catch (error) {
        if (mode$i.errorLogs) {
            console.error(`rgbToXYZ error: ${error}`);
        }
        return defaultXYZBranded;
    }
}
function xyzToHSL(xyz) {
    try {
        if (!validate$1.colorValues(xyz)) {
            if (mode$i.errorLogs)
                console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return defaultHSLBranded;
        }
        return rgbToHSL(xyzToRGB(clone(xyz)));
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`xyzToHSL() error: ${error}`);
        return defaultHSLBranded;
    }
}
function xyzToLAB(xyz) {
    try {
        if (!validate$1.colorValues(xyz)) {
            if (mode$i.errorLogs)
                console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return defaultLABBranded;
        }
        const clonedXYZ = clone(xyz);
        const refX = 95.047, refY = 100.0, refZ = 108.883;
        clonedXYZ.value.x = (clonedXYZ.value.x / refX);
        clonedXYZ.value.y = (clonedXYZ.value.y / refY);
        clonedXYZ.value.z = (clonedXYZ.value.z / refZ);
        clonedXYZ.value.x =
            clonedXYZ.value.x > 0.008856
                ? Math.pow(clonedXYZ.value.x, 1 / 3)
                : (7.787 * clonedXYZ.value.x + 16 / 116);
        clonedXYZ.value.y =
            clonedXYZ.value.y > 0.008856
                ? Math.pow(clonedXYZ.value.y, 1 / 3)
                : (7.787 * clonedXYZ.value.y + 16 / 116);
        clonedXYZ.value.z =
            clonedXYZ.value.z > 0.008856
                ? Math.pow(clonedXYZ.value.z, 1 / 3)
                : (7.787 * clonedXYZ.value.z + 16 / 116);
        const l = sanitize.percentile(parseFloat((116 * clonedXYZ.value.y - 16).toFixed(2)));
        const a = sanitize.lab(parseFloat((500 * (clonedXYZ.value.x - clonedXYZ.value.y)).toFixed(2)), 'a');
        const b = sanitize.lab(parseFloat((200 * (clonedXYZ.value.y - clonedXYZ.value.z)).toFixed(2)), 'b');
        const lab = {
            value: {
                l: brand.asLAB_L(Math.round(l)),
                a: brand.asLAB_A(Math.round(a)),
                b: brand.asLAB_B(Math.round(b)),
                alpha: xyz.value.alpha
            },
            format: 'lab'
        };
        if (!validate$1.colorValues(lab)) {
            if (mode$i.errorLogs)
                console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return defaultLABBranded;
        }
        return lab;
    }
    catch (error) {
        if (mode$i.errorLogs)
            console.error(`xyzToLab() error: ${error}`);
        return defaultLABBranded;
    }
}
function xyzToRGB(xyz) {
    try {
        if (!validate$1.colorValues(xyz)) {
            if (mode$i.errorLogs) {
                console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            }
            return defaultRGBBranded;
        }
        const x = xyz.value.x / 100;
        const y = xyz.value.y / 100;
        const z = xyz.value.z / 100;
        let red = x * 3.2406 + y * -1.5372 + z * -0.4986;
        let green = x * -0.9689 + y * 1.8758 + z * 0.0415;
        let blue = x * 0.0557 + y * -0.204 + z * 1.057;
        red = applyGammaCorrection(red);
        green = applyGammaCorrection(green);
        blue = applyGammaCorrection(blue);
        const rgb = clampRGB({
            value: {
                red: brand.asByteRange(Math.round(red)),
                green: brand.asByteRange(Math.round(green)),
                blue: brand.asByteRange(Math.round(blue)),
                alpha: xyz.value.alpha
            },
            format: 'rgb'
        });
        return rgb;
    }
    catch (error) {
        if (mode$i.errorLogs) {
            console.error(`xyzToRGB error: ${error}`);
        }
        return defaultRGBBranded;
    }
}
// ******** BUNDLED CONVERSION FUNCTIONS ********
function hslTo$1(color, colorSpace) {
    try {
        if (!validate$1.colorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return defaultRGBBranded;
        }
        const clonedColor = clone(color);
        switch (colorSpace) {
            case 'cmyk':
                return hslToCMYK(clonedColor);
            case 'hex':
                return hslToHex(clonedColor);
            case 'hsl':
                return clone(clonedColor);
            case 'hsv':
                return hslToHSV(clonedColor);
            case 'lab':
                return hslToLAB(clonedColor);
            case 'rgb':
                return hslToRGB(clonedColor);
            case 'sl':
                return hslToSL(clonedColor);
            case 'sv':
                return hslToSV(clonedColor);
            case 'xyz':
                return hslToXYZ(clonedColor);
            default:
                throw new Error('Invalid color format');
        }
    }
    catch (error) {
        throw new Error(`hslTo() error: ${error}`);
    }
}
function toHSL(color) {
    try {
        if (!validate$1.colorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return defaultHSLBranded;
        }
        const clonedColor = clone(color);
        switch (color.format) {
            case 'cmyk':
                return cmykToHSL(clonedColor);
            case 'hex':
                return hexToHSL(clonedColor);
            case 'hsl':
                return clone(clonedColor);
            case 'hsv':
                return hsvToHSL(clonedColor);
            case 'lab':
                return labToHSL(clonedColor);
            case 'rgb':
                return rgbToHSL(clonedColor);
            case 'xyz':
                return xyzToHSL(clonedColor);
            default:
                throw new Error('Invalid color format');
        }
    }
    catch (error) {
        throw new Error(`toHSL() error: ${error}`);
    }
}
const convert = {
    hslTo: hslTo$1,
    toHSL,
    wrappers: {
        hexToHSL: hexToHSLWrapper
    }
};

// File: src/common/helpers/dom.js
const timeouts = data.consts.timeouts;
const mode$e = data.mode;
let dragSrcEl = null;
function attachDragAndDropListeners(element) {
    try {
        if (element) {
            element.addEventListener('dragstart', dragStart);
            element.addEventListener('dragover', dragOver);
            element.addEventListener('drop', drop);
            element.addEventListener('dragend', dragEnd);
        }
        if (!mode$e.quiet)
            console.log('Drag and drop event listeners successfully attached');
    }
    catch (error) {
        if (!mode$e.errorLogs)
            console.error(`Failed to execute attachDragAndDropEventListeners: ${error}`);
    }
}
function dragStart(e) {
    try {
        dragSrcEl = e.currentTarget;
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', dragSrcEl.outerHTML);
        }
        if (!mode$e.quiet)
            console.log('handleDragStart complete');
    }
    catch (error) {
        if (!mode$e.errorLogs)
            console.error(`Error in handleDragStart: ${error}`);
    }
}
function dragOver(e) {
    try {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }
        if (!mode$e.quiet)
            console.log('handleDragOver complete');
        return false;
    }
    catch (error) {
        if (!mode$e.errorLogs)
            console.error(`Error in handleDragOver: ${error}`);
        return false;
    }
}
function dragEnd(e) {
    try {
        const target = e.currentTarget;
        target.classList.remove('dragging');
        document.querySelectorAll('.color-stripe').forEach(el => {
            el.classList.remove('dragging');
        });
        if (!mode$e.quiet)
            console.log('handleDragEnd complete');
    }
    catch (error) {
        if (!mode$e.errorLogs)
            console.error(`Error in handleDragEnd: ${error}`);
    }
}
function drop(e) {
    try {
        e.stopPropagation();
        const target = e.currentTarget;
        if (dragSrcEl && dragSrcEl !== target) {
            const dragSrcId = dragSrcEl.id;
            const dropTargetId = target.id;
            const dragSrcText = dragSrcEl.querySelector('.color-text-output-box').value;
            const dropTargetText = target.querySelector('.color-text-output-box').value;
            const dragSrcOuterHTML = dragSrcEl.outerHTML;
            const dropTargetOuterHTML = target.outerHTML;
            dragSrcEl.outerHTML = dropTargetOuterHTML;
            target.outerHTML = dragSrcOuterHTML;
            const newDragSrcEl = document.getElementById(dropTargetId);
            const newDropTargetEl = document.getElementById(dragSrcId);
            newDragSrcEl.id = dragSrcId;
            newDropTargetEl.id = dropTargetId;
            newDragSrcEl.querySelector('.color-text-output-box').value = dropTargetText;
            newDropTargetEl.querySelector('.color-text-output-box').value = dragSrcText;
            if (!mode$e.quiet)
                console.log('calling attachDragAndDropEventListeners for new elements');
            attachDragAndDropListeners(newDragSrcEl);
            attachDragAndDropListeners(newDropTargetEl);
        }
        if (!mode$e.quiet)
            console.log('handleDrop complete');
    }
    catch (error) {
        if (!mode$e.errorLogs)
            console.error(`Error in handleDrop: ${error}`);
    }
}
function makePaletteBox(color, paletteBoxCount) {
    try {
        if (!core.validate.colorValues(color)) {
            if (!mode$e.errorLogs)
                console.error(`Invalid ${color.format} color value ${JSON.stringify(color)}`);
            return {
                colorStripe: document.createElement('div'),
                paletteBoxCount
            };
        }
        const clonedColor = core.base.clone(color);
        const paletteBox = document.createElement('div');
        paletteBox.className = 'palette-box';
        paletteBox.id = `palette-box-${paletteBoxCount}`;
        const paletteBoxTopHalf = document.createElement('div');
        paletteBoxTopHalf.className = 'palette-box-half palette-box-top-half';
        paletteBoxTopHalf.id = `palette-box-top-half-${paletteBoxCount}`;
        const colorTextOutputBox = document.createElement('input');
        colorTextOutputBox.type = 'text';
        colorTextOutputBox.className = 'color-text-output-box tooltip';
        colorTextOutputBox.id = `color-text-output-box-${paletteBoxCount}`;
        colorTextOutputBox.setAttribute('data-format', 'hex');
        const colorString = core.convert.toCSSColorString(clonedColor);
        colorTextOutputBox.value = colorString || '';
        colorTextOutputBox.colorValues = clonedColor;
        colorTextOutputBox.readOnly = false;
        colorTextOutputBox.style.cursor = 'text';
        colorTextOutputBox.style.pointerEvents = 'none';
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        const tooltipText = document.createElement('span');
        tooltipText.className = 'tooltiptext';
        tooltipText.textContent = 'Copied to clipboard!';
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(colorTextOutputBox.value);
                showTooltip(colorTextOutputBox);
                clearTimeout(data.consts.timeouts.tooltip || 1000);
                copyButton.textContent = 'Copied!';
                setTimeout(() => (copyButton.textContent = 'Copy'), data.consts.timeouts.copyButtonText || 1000);
            }
            catch (error) {
                if (!mode$e.errorLogs)
                    console.error(`Failed to copy: ${error}`);
            }
        });
        colorTextOutputBox.addEventListener('input', core.base.debounce((e) => {
            const target = e.target;
            if (target) {
                const cssColor = target.value.trim();
                const boxElement = document.getElementById(`color-box-${paletteBoxCount}`);
                const stripeElement = document.getElementById(`color-stripe-${paletteBoxCount}`);
                if (boxElement)
                    boxElement.style.backgroundColor = cssColor;
                if (stripeElement)
                    stripeElement.style.backgroundColor = cssColor;
            }
        }, data.consts.debounce.input || 200));
        paletteBoxTopHalf.appendChild(colorTextOutputBox);
        paletteBoxTopHalf.appendChild(copyButton);
        const paletteBoxBottomHalf = document.createElement('div');
        paletteBoxBottomHalf.className =
            'palette-box-half palette-box-bottom-half';
        paletteBoxBottomHalf.id = `palette-box-bottom-half-${paletteBoxCount}`;
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.id = `color-box-${paletteBoxCount}`;
        colorBox.style.backgroundColor = colorString || '#ffffff';
        paletteBoxBottomHalf.appendChild(colorBox);
        paletteBox.appendChild(paletteBoxTopHalf);
        paletteBox.appendChild(paletteBoxBottomHalf);
        const colorStripe = document.createElement('div');
        colorStripe.className = 'color-stripe';
        colorStripe.id = `color-stripe-${paletteBoxCount}`;
        colorStripe.style.backgroundColor = colorString || '#ffffff';
        colorStripe.setAttribute('draggable', 'true');
        attachDragAndDropListeners(colorStripe);
        colorStripe.appendChild(paletteBox);
        return {
            colorStripe,
            paletteBoxCount: paletteBoxCount + 1
        };
    }
    catch (error) {
        if (!mode$e.errorLogs)
            console.error(`Failed to execute makePaletteBox: ${error}`);
        return {
            colorStripe: document.createElement('div'),
            paletteBoxCount
        };
    }
}
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    if (!mode$e.quiet)
        console.log('Toast message added');
    setTimeout(() => {
        toast.classList.add('fade-out');
        if (!mode$e.quiet)
            console.log('Toast message faded out');
        toast.addEventListener('transitioned', () => toast.remove());
    }, timeouts.toast);
}
function showTooltip(tooltipElement) {
    try {
        const tooltip = tooltipElement.querySelector('.tooltiptext');
        if (tooltip) {
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
            setTimeout(() => {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
            }, data.consts.timeouts.tooltip || 1000);
        }
        console.log('showTooltip executed');
    }
    catch (error) {
        console.error(`Failed to execute showTooltip: ${error}`);
    }
}
function validateAndConvertColor(color) {
    if (!color)
        return null;
    const convertedColor = core.guards.isColorString(color)
        ? core.convert.toColor(color)
        : color;
    if (!core.validate.colorValues(convertedColor)) {
        if (mode$e.errorLogs)
            console.error(`Invalid color: ${JSON.stringify(convertedColor)}`);
        return null;
    }
    return convertedColor;
}
const handle = {
    dragStart,
    dragOver,
    dragEnd,
    drop
};
const dom$2 = {
    attachDragAndDropListeners,
    handle,
    makePaletteBox,
    showToast,
    showTooltip,
    validateAndConvertColor
};

// File: src/common/helpers/index.js
const helpers = {
    conversion: conversion$2,
    dom: dom$2
};

// File: src/common/utils/conversion.js
const mode$d = data.mode;
function getConversionFn(from, to) {
    try {
        const fnName = `${from}To${to[0].toUpperCase() + to.slice(1)}`;
        if (!(fnName in convert))
            return undefined;
        const conversionFn = convert[fnName];
        return (value) => structuredClone(conversionFn(value));
    }
    catch (error) {
        if (mode$d.errorLogs)
            console.error(`Error getting conversion function: ${error}`);
        return undefined;
    }
}
function genAllColorValues$1(color) {
    const result = {};
    try {
        const clonedColor = core.base.clone(color);
        if (!core.validate.colorValues(clonedColor)) {
            if (mode$d.errorLogs)
                console.error(`Invalid color: ${JSON.stringify(clonedColor)}`);
            return {};
        }
        result.cmyk = convert.hslTo(clonedColor, 'cmyk');
        result.hex = convert.hslTo(clonedColor, 'hex');
        result.hsl = clonedColor;
        result.hsv = convert.hslTo(clonedColor, 'hsv');
        result.lab = convert.hslTo(clonedColor, 'lab');
        result.rgb = convert.hslTo(clonedColor, 'rgb');
        result.sl = convert.hslTo(clonedColor, 'sl');
        result.sv = convert.hslTo(clonedColor, 'sv');
        result.xyz = convert.hslTo(clonedColor, 'xyz');
        return result;
    }
    catch (error) {
        if (mode$d.errorLogs)
            console.error(`Error generating all color values: ${error}`);
        return {};
    }
}
const conversion$1 = {
    genAllColorValues: genAllColorValues$1,
    getConversionFn
};

// File: src/common/utils/palette.js
const mode$c = data.mode;
function createObject(type, items, baseColor, numBoxes, paletteID, enableAlpha, limitDark, limitGray, limitLight) {
    return {
        id: `${type}_${paletteID}`,
        items,
        flags: {
            enableAlpha: enableAlpha,
            limitDarkness: limitDark,
            limitGrayness: limitGray,
            limitLightness: limitLight
        },
        metadata: {
            numBoxes,
            paletteType: type,
            customColor: {
                hslColor: baseColor,
                convertedColors: items[0]?.colors || {}
            },
            timestamp: Date.now()
        }
    };
}
function populateOutputBox(color, boxNumber) {
    try {
        const clonedColor = core.guards.isColor(color)
            ? core.base.clone(color)
            : core.convert.toColor(color);
        if (!core.validate.colorValues(clonedColor)) {
            if (mode$c.errorLogs)
                console.error('Invalid color values.');
            helpers.dom.showToast('Invalid color.');
            return;
        }
        const colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);
        if (!colorTextOutputBox)
            return;
        const stringifiedColor = core.convert.toCSSColorString(clonedColor);
        if (!mode$c.quiet)
            console.log(`Adding CSS-formatted color to DOM ${stringifiedColor}`);
        colorTextOutputBox.value = stringifiedColor;
        colorTextOutputBox.setAttribute('data-format', color.format);
    }
    catch (error) {
        if (mode$c.errorLogs)
            console.error('Failed to populate color text output box:', error);
        return;
    }
}
const palette = {
    createObject,
    populateOutputBox
};

// File: src/common/utils/random.js
const defaults = data.defaults;
const mode$b = data.mode;
function hsl(enableAlpha) {
    try {
        const alpha = enableAlpha ? Math.round(Math.random() * 100) / 100 : 1;
        const hsl = {
            value: {
                hue: core.sanitize.radial(Math.floor(Math.random() * 360)),
                saturation: core.sanitize.percentile(Math.floor(Math.random() * 101)),
                lightness: core.sanitize.percentile(Math.floor(Math.random() * 101)),
                alpha: core.brand.asAlphaRange(alpha)
            },
            format: 'hsl'
        };
        if (!core.validate.colorValues(hsl)) {
            if (mode$b.errorLogs)
                console.error(`Invalid random HSL color value ${JSON.stringify(hsl)}`);
            const unbrandedHSL = core.base.clone(defaults.colors.hsl);
            return core.brandColor.asHSL(unbrandedHSL);
        }
        if (!mode$b.quiet)
            console.log(`Generated randomHSL: ${JSON.stringify(hsl)}`);
        return hsl;
    }
    catch (error) {
        if (mode$b.errorLogs)
            console.error(`Error generating random HSL color: ${error}`);
        const unbrandedHSL = core.base.clone(defaults.colors.hsl);
        return core.brandColor.asHSL(unbrandedHSL);
    }
}
function sl$1(enableAlpha) {
    try {
        const alpha = enableAlpha ? Math.round(Math.random() * 100) / 100 : 1;
        const sl = {
            value: {
                saturation: core.sanitize.percentile(Math.max(0, Math.min(100, Math.random() * 100))),
                lightness: core.sanitize.percentile(Math.max(0, Math.min(100, Math.random() * 100))),
                alpha: core.brand.asAlphaRange(alpha)
            },
            format: 'sl'
        };
        if (!core.validate.colorValues(sl)) {
            if (mode$b.errorLogs)
                console.error(`Invalid random SV color value ${JSON.stringify(sl)}`);
            const unbrandedSL = core.base.clone(defaults.colors.sl);
            return core.brandColor.asSL(unbrandedSL);
        }
        if (!mode$b.quiet)
            console.log(`Generated randomSL: ${JSON.stringify(sl)}`);
        return sl;
    }
    catch (error) {
        if (mode$b.errorLogs)
            console.error(`Error generating random SL color: ${error}`);
        const unbrandedSL = core.base.clone(defaults.colors.sl);
        return core.brandColor.asSL(unbrandedSL);
    }
}
const random$1 = {
    hsl,
    sl: sl$1
};

// File src/common/utils/index.js
const utils = {
    color,
    conversion: conversion$1,
    palette,
    random: random$1
};

// File: src/common/superUtils/dom.js
const mode$a = data.mode;
function getGenButtonArgs() {
    try {
        const paletteNumberOptions = data.consts.dom.elements.paletteNumberOptions;
        const paletteTypeOptions = data.consts.dom.elements.paletteTypeOptions;
        const customColorRaw = data.consts.dom.elements.customColorInput?.value;
        const enableAlphaCheckbox = data.consts.dom.elements.enableAlphaCheckbox;
        const limitDarknessCheckbox = data.consts.dom.elements.limitDarknessCheckbox;
        const limitGraynessCheckbox = data.consts.dom.elements.limitGraynessCheckbox;
        const limitLightnessCheckbox = data.consts.dom.elements.limitLightnessCheckbox;
        if (paletteNumberOptions === null ||
            paletteTypeOptions === null ||
            enableAlphaCheckbox === null ||
            limitDarknessCheckbox === null ||
            limitGraynessCheckbox === null ||
            limitLightnessCheckbox === null) {
            if (mode$a.errorLogs)
                console.error('One or more elements are null');
            return null;
        }
        if (!mode$a.quiet)
            console.log(`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}`);
        return {
            numBoxes: parseInt(paletteNumberOptions.value, 10),
            paletteType: parseInt(paletteTypeOptions.value, 10),
            customColor: customColorRaw
                ? core.base.parseCustomColor(customColorRaw)
                : null,
            enableAlpha: enableAlphaCheckbox.checked,
            limitDarkness: limitDarknessCheckbox.checked,
            limitGrayness: limitGraynessCheckbox.checked,
            limitLightness: limitLightnessCheckbox.checked
        };
    }
    catch (error) {
        if (mode$a.errorLogs)
            console.error(`Failed to retrieve generateButton parameters: ${error}`);
        return null;
    }
}
function switchColorSpace(targetFormat) {
    try {
        const colorTextOutputBoxes = document.querySelectorAll('.color-text-output-box');
        colorTextOutputBoxes.forEach(box => {
            const inputBox = box;
            const colorValues = inputBox.colorValues;
            if (!colorValues || !core.validate.colorValues(colorValues)) {
                if (mode$a.errorLogs)
                    console.error('Invalid color values. Cannot display toast.');
                helpers.dom.showToast('Invalid color.');
                return;
            }
            const currentFormat = inputBox.getAttribute('data-format');
            if (!mode$a.quiet)
                console.log(`Converting from ${currentFormat} to ${targetFormat}`);
            const convertFn = utils.conversion.getConversionFn(currentFormat, targetFormat);
            if (!convertFn) {
                if (mode$a.errorLogs)
                    console.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`);
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            if (colorValues.format === 'xyz') {
                if (mode$a.errorLogs)
                    console.error('Cannot convert from XYZ to another color space.');
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            const clonedColor = utils.color.narrowToColor(colorValues);
            if (!clonedColor ||
                utils.color.isSLColor(clonedColor) ||
                utils.color.isSVColor(clonedColor) ||
                utils.color.isXYZ(clonedColor)) {
                if (mode$a.errorLogs)
                    console.error('Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.');
                helpers.dom.showToast('Conversion not supported.');
                return;
            }
            if (!clonedColor) {
                if (mode$a.errorLogs)
                    console.error(`Conversion to ${targetFormat} failed.`);
                helpers.dom.showToast('Conversion failed.');
                return;
            }
            const newColor = core.base.clone(convertFn(clonedColor));
            if (!newColor) {
                if (mode$a.errorLogs)
                    console.error(`Conversion to ${targetFormat} failed.`);
                helpers.dom.showToast('Conversion failed.');
                return;
            }
            inputBox.value = String(newColor);
            inputBox.setAttribute('data-format', targetFormat);
        });
    }
    catch (error) {
        helpers.dom.showToast('Failed to convert colors.');
        if (!mode$a.quiet)
            console.log('Failed to convert colors.');
        else if (!mode$a.gracefulErrors)
            throw new Error(`Failed to convert colors: ${error}`);
        else if (mode$a.errorLogs)
            console.error(`Failed to convert colors: ${error}`);
    }
}
const dom$1 = {
    getGenButtonArgs,
    switchColorSpace
};

// File: src/common/superUtils/index.js
const superUtils = {
    dom: dom$1
};

// File: src/common/transform/index.js
const transform = {
    ...base$4
};

// File: src/dom/base.js
const mode$9 = data.mode;
function applyFirstColorToUI(color) {
    try {
        const colorBox1 = document.getElementById('color-box-1');
        if (!colorBox1) {
            if (mode$9.errorLogs)
                console.error('color-box-1 is null');
            return color;
        }
        const formatColorString = core.convert.toCSSColorString(color);
        if (!formatColorString) {
            if (mode$9.errorLogs)
                console.error('Unexpected or unsupported color format.');
            return color;
        }
        colorBox1.style.backgroundColor = formatColorString;
        utils.palette.populateOutputBox(color, 1);
        return color;
    }
    catch (error) {
        if (mode$9.errorLogs)
            console.error(`Failed to apply first color to UI: ${error}`);
        return utils.random.hsl(false);
    }
}
function copyToClipboard(text, tooltipElement) {
    try {
        const colorValue = text.replace('Copied to clipboard!', '').trim();
        navigator.clipboard
            .writeText(colorValue)
            .then(() => {
            helpers.dom.showTooltip(tooltipElement);
            if (!mode$9.quiet)
                console.log(`Copied color value: ${colorValue}`);
            setTimeout(() => tooltipElement.classList.remove('show'), data.consts.timeouts.tooltip || 1000);
        })
            .catch(err => {
            if (mode$9.errorLogs)
                console.error('Error copying to clipboard:', err);
        });
    }
    catch (error) {
        if (mode$9.errorLogs)
            console.error(`Failed to copy to clipboard: ${error}`);
        else if (!mode$9.quiet)
            console.error('Failed to copy to clipboard');
    }
}
function defineUIElements() {
    const elements = data.consts.dom.elements;
    const selectedColor = elements.selectedColorOption
        ? parseInt(elements.selectedColorOption.value, 10)
        : 0;
    return {
        advancedMenu: elements.advancedMenu,
        advancedMenuButton: elements.advancedMenuButton,
        advancedMenuContent: elements.advancedMenuContent,
        applyCustomColorButton: elements.applyCustomColorButton,
        clearCustomColorButton: elements.clearCustomColorButton,
        customColorDisplay: elements.customColorDisplay,
        customColorInput: elements.customColorInput,
        customColorMenu: elements.customColorMenu,
        customColorMenuButton: elements.customColorMenuButton,
        deleteDatabaseButton: elements.deleteDatabaseButton,
        desaturateButton: elements.desaturateButton,
        developerMenuButton: elements.developerMenuButton,
        enableAlphaCheckbox: elements.enableAlphaCheckbox,
        generateButton: elements.generateButton,
        helpMenu: elements.helpMenu,
        helpMenuButton: elements.helpMenuButton,
        helpMenuContent: elements.helpMenuContent,
        historyMenu: elements.historyMenu,
        historyMenuButton: elements.historyMenuButton,
        historyMenuContent: elements.historyMenuContent,
        limitDarknessCheckbox: elements.limitDarknessCheckbox,
        limitGraynessCheckbox: elements.limitGraynessCheckbox,
        limitLightnessCheckbox: elements.limitLightnessCheckbox,
        paletteNumberOptions: elements.paletteNumberOptions,
        paletteTypeOptions: elements.paletteTypeOptions,
        resetDatabaseButton: elements.resetDatabaseButton,
        resetPaletteIDButton: elements.resetPaletteIDButton,
        saturateButton: elements.saturateButton,
        selectedColor,
        selectedColorOption: elements.selectedColorOption,
        showAsCMYKButton: elements.showAsCMYKButton,
        showAsHexButton: elements.showAsHexButton,
        showAsHSLButton: elements.showAsHSLButton,
        showAsHSVButton: elements.showAsHSVButton,
        showAsLABButton: elements.showAsLABButton,
        showAsRGBButton: elements.showAsRGBButton
    };
}
async function initializeUI() {
    console.log('Initializing UI with dynamically loaded elements');
    const buttons = defineUIElements();
    if (!buttons) {
        console.error('Failed to initialize UI buttons');
        return;
    }
    buttons.applyCustomColorButton?.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('applyCustomColorButton clicked');
        // *DEV-NOTE* add logic here...
    });
}
const base$3 = {
    applyFirstColorToUI,
    copyToClipboard,
    defineUIElements,
    initializeUI
};

// File: src/dom/utils/base.ts
const mode$8 = data.mode;
function applyCustomColor() {
    try {
        const colorPicker = document.getElementById('custom-color-picker');
        if (!colorPicker) {
            throw new Error('Color picker element not found');
        }
        const rawValue = colorPicker.value.trim();
        const selectedFormat = document.getElementById('custom-color-format')?.value;
        if (!utils.color.isColorSpace(selectedFormat)) {
            if (!mode$8.gracefulErrors)
                throw new Error(`Unsupported color format: ${selectedFormat}`);
        }
        const parsedColor = utils.color.parseColor(selectedFormat, rawValue);
        if (!parsedColor) {
            if (!mode$8.gracefulErrors)
                throw new Error(`Invalid color value: ${rawValue}`);
        }
        const hslColor = utils.color.isHSLColor(parsedColor)
            ? parsedColor
            : convert.toHSL(parsedColor);
        return hslColor;
    }
    catch (error) {
        if (mode$8.errorLogs)
            console.error(`Failed to apply custom color: ${error}. Returning randomly generated hex color`);
        return utils.random.hsl(false);
    }
}
function desaturateColor(selectedColor) {
    try {
        getElementsForSelectedColor(selectedColor);
    }
    catch (error) {
        if (mode$8.errorLogs)
            console.error(`Failed to desaturate color: ${error}`);
    }
}
function getElementsForSelectedColor(selectedColor) {
    const selectedColorBox = document.getElementById(`color-box-${selectedColor}`);
    if (!selectedColorBox) {
        if (mode$8.warnLogs)
            console.warn(`Element not found for color ${selectedColor}`);
        helpers.dom.showToast('Please select a valid color.');
        return {
            selectedColorTextOutputBox: null,
            selectedColorBox: null,
            selectedColorStripe: null
        };
    }
    return {
        selectedColorTextOutputBox: document.getElementById(`color-text-output-box-${selectedColor}`),
        selectedColorBox,
        selectedColorStripe: document.getElementById(`color-stripe-${selectedColor}`)
    };
}
function pullParamsFromUI() {
    try {
        const paletteTypeOptionsElement = data.consts.dom.elements.paletteTypeOptions;
        const numBoxesElement = data.consts.dom.elements.paletteNumberOptions;
        const enableAlphaCheckbox = data.consts.dom.elements.enableAlphaCheckbox;
        const limitDarknessCheckbox = data.consts.dom.elements.limitDarknessCheckbox;
        const limitGraynessCheckbox = data.consts.dom.elements.limitGraynessCheckbox;
        const limitLightnessCheckbox = data.consts.dom.elements.limitLightnessCheckbox;
        return {
            paletteType: paletteTypeOptionsElement
                ? parseInt(paletteTypeOptionsElement.value, 10)
                : 0,
            numBoxes: numBoxesElement ? parseInt(numBoxesElement.value, 10) : 0,
            enableAlpha: enableAlphaCheckbox?.checked || false,
            limitDarkness: limitDarknessCheckbox?.checked || false,
            limitGrayness: limitGraynessCheckbox?.checked || false,
            limitLightness: limitLightnessCheckbox?.checked || false
        };
    }
    catch (error) {
        if (mode$8.errorLogs)
            console.error(`Failed to pull parameters from UI: ${error}`);
        return {
            paletteType: 0,
            numBoxes: 0,
            enableAlpha: false,
            limitDarkness: false,
            limitGrayness: false,
            limitLightness: false
        };
    }
}
function saturateColor(selectedColor) {
    try {
        getElementsForSelectedColor(selectedColor);
        // *DEV-NOTE* unfinished function
    }
    catch (error) {
        if (mode$8.errorLogs)
            console.error(`Failed to saturate color: ${error}`);
    }
}
const base$2 = {
    applyCustomColor,
    desaturateColor,
    getElementsForSelectedColor,
    pullParamsFromUI,
    saturateColor
};

// File: src/dom/utils/index.ts
const domUtils = {
    ...base$2
};

const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);

let idbProxyableTypes;
let cursorAdvanceMethods;
// This is a function to prevent it throwing up in node environments.
function getIdbProxyableTypes() {
    return (idbProxyableTypes ||
        (idbProxyableTypes = [
            IDBDatabase,
            IDBObjectStore,
            IDBIndex,
            IDBCursor,
            IDBTransaction,
        ]));
}
// This is a function to prevent it throwing up in node environments.
function getCursorAdvanceMethods() {
    return (cursorAdvanceMethods ||
        (cursorAdvanceMethods = [
            IDBCursor.prototype.advance,
            IDBCursor.prototype.continue,
            IDBCursor.prototype.continuePrimaryKey,
        ]));
}
const transactionDoneMap = new WeakMap();
const transformCache = new WeakMap();
const reverseTransformCache = new WeakMap();
function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
        const unlisten = () => {
            request.removeEventListener('success', success);
            request.removeEventListener('error', error);
        };
        const success = () => {
            resolve(wrap(request.result));
            unlisten();
        };
        const error = () => {
            reject(request.error);
            unlisten();
        };
        request.addEventListener('success', success);
        request.addEventListener('error', error);
    });
    // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
    // is because we create many promises from a single IDBRequest.
    reverseTransformCache.set(promise, request);
    return promise;
}
function cacheDonePromiseForTransaction(tx) {
    // Early bail if we've already created a done promise for this transaction.
    if (transactionDoneMap.has(tx))
        return;
    const done = new Promise((resolve, reject) => {
        const unlisten = () => {
            tx.removeEventListener('complete', complete);
            tx.removeEventListener('error', error);
            tx.removeEventListener('abort', error);
        };
        const complete = () => {
            resolve();
            unlisten();
        };
        const error = () => {
            reject(tx.error || new DOMException('AbortError', 'AbortError'));
            unlisten();
        };
        tx.addEventListener('complete', complete);
        tx.addEventListener('error', error);
        tx.addEventListener('abort', error);
    });
    // Cache it for later retrieval.
    transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
    get(target, prop, receiver) {
        if (target instanceof IDBTransaction) {
            // Special handling for transaction.done.
            if (prop === 'done')
                return transactionDoneMap.get(target);
            // Make tx.store return the only store in the transaction, or undefined if there are many.
            if (prop === 'store') {
                return receiver.objectStoreNames[1]
                    ? undefined
                    : receiver.objectStore(receiver.objectStoreNames[0]);
            }
        }
        // Else transform whatever we get back.
        return wrap(target[prop]);
    },
    set(target, prop, value) {
        target[prop] = value;
        return true;
    },
    has(target, prop) {
        if (target instanceof IDBTransaction &&
            (prop === 'done' || prop === 'store')) {
            return true;
        }
        return prop in target;
    },
};
function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
    // Due to expected object equality (which is enforced by the caching in `wrap`), we
    // only create one new func per func.
    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
    // with real promises, so each advance methods returns a new promise for the cursor object, or
    // undefined if the end of the cursor has been reached.
    if (getCursorAdvanceMethods().includes(func)) {
        return function (...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            func.apply(unwrap(this), args);
            return wrap(this.request);
        };
    }
    return function (...args) {
        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
        // the original object.
        return wrap(func.apply(unwrap(this), args));
    };
}
function transformCachableValue(value) {
    if (typeof value === 'function')
        return wrapFunction(value);
    // This doesn't return, it just creates a 'done' promise for the transaction,
    // which is later returned for transaction.done (see idbObjectHandler).
    if (value instanceof IDBTransaction)
        cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
        return new Proxy(value, idbProxyTraps);
    // Return the same value back if we're not going to transform it.
    return value;
}
function wrap(value) {
    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
    if (value instanceof IDBRequest)
        return promisifyRequest(value);
    // If we've already transformed this value before, reuse the transformed value.
    // This is faster, but it also provides object equality.
    if (transformCache.has(value))
        return transformCache.get(value);
    const newValue = transformCachableValue(value);
    // Not all types are transformed.
    // These may be primitive types, so they can't be WeakMap keys.
    if (newValue !== value) {
        transformCache.set(value, newValue);
        reverseTransformCache.set(newValue, value);
    }
    return newValue;
}
const unwrap = (value) => reverseTransformCache.get(value);

/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = wrap(request);
    if (upgrade) {
        request.addEventListener('upgradeneeded', (event) => {
            upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
        });
    }
    if (blocked) {
        request.addEventListener('blocked', (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event.newVersion, event));
    }
    openPromise
        .then((db) => {
        if (terminated)
            db.addEventListener('close', () => terminated());
        if (blocking) {
            db.addEventListener('versionchange', (event) => blocking(event.oldVersion, event.newVersion, event));
        }
    })
        .catch(() => { });
    return openPromise;
}

const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
const writeMethods = ['put', 'add', 'delete', 'clear'];
const cachedMethods = new Map();
function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase &&
        !(prop in target) &&
        typeof prop === 'string')) {
        return;
    }
    if (cachedMethods.get(prop))
        return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, '');
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
        !(isWrite || readMethods.includes(targetFuncName))) {
        return;
    }
    const method = async function (storeName, ...args) {
        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
        let target = tx.store;
        if (useIndex)
            target = target.index(args.shift());
        // Must reject if op rejects.
        // If it's a write operation, must reject if tx.done rejects.
        // Must reject with op rejection first.
        // Must resolve with op value.
        // Must handle both promises (no unhandled rejections)
        return (await Promise.all([
            target[targetFuncName](...args),
            isWrite && tx.done,
        ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
}
replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
}));

const advanceMethodProps = ['continue', 'continuePrimaryKey', 'advance'];
const methodMap = {};
const advanceResults = new WeakMap();
const ittrProxiedCursorToOriginalProxy = new WeakMap();
const cursorIteratorTraps = {
    get(target, prop) {
        if (!advanceMethodProps.includes(prop))
            return target[prop];
        let cachedFunc = methodMap[prop];
        if (!cachedFunc) {
            cachedFunc = methodMap[prop] = function (...args) {
                advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
            };
        }
        return cachedFunc;
    },
};
async function* iterate(...args) {
    // tslint:disable-next-line:no-this-assignment
    let cursor = this;
    if (!(cursor instanceof IDBCursor)) {
        cursor = await cursor.openCursor(...args);
    }
    if (!cursor)
        return;
    cursor = cursor;
    const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
    ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
    // Map this double-proxy back to the original, so other cursor methods work.
    reverseTransformCache.set(proxiedCursor, unwrap(cursor));
    while (cursor) {
        yield proxiedCursor;
        // If one of the advancing methods was not called, call continue().
        cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());
        advanceResults.delete(proxiedCursor);
    }
}
function isIteratorProp(target, prop) {
    return ((prop === Symbol.asyncIterator &&
        instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor])) ||
        (prop === 'iterate' && instanceOfAny(target, [IDBIndex, IDBObjectStore])));
}
replaceTraps((oldTraps) => ({
    ...oldTraps,
    get(target, prop, receiver) {
        if (isIteratorProp(target, prop))
            return iterate;
        return oldTraps.get(target, prop, receiver);
    },
    has(target, prop) {
        return isIteratorProp(target, prop) || oldTraps.has(target, prop);
    },
}));

// File: src/logger/Logger.ts
const mode$7 = data.mode;
class AppLogger {
    static instance = null;
    mode;
    constructor() {
        this.mode = mode$7;
    }
    static getInstance() {
        if (!AppLogger.instance) {
            AppLogger.instance = new AppLogger();
        }
        return AppLogger.instance;
    }
    async log(message, level = 'info', debugLevel = 0) {
        if ((level === 'info' && this.mode.quiet) || !this.mode[`${level}Logs`])
            return;
        const formattedMessage = this.formatLogMessage(level.toUpperCase(), {
            message
        });
        try {
            console[level](formattedMessage);
        }
        catch (error) {
            console.error(`AppLogger encountered an unexpected error:, ${error}`);
            if (debugLevel === 1)
                console.trace('Trace:');
        }
        if (debugLevel === 1)
            console.trace('Trace:');
    }
    formatLogMessage(action, details) {
        return JSON.stringify({
            timestamp: new Date().toISOString(),
            action,
            details
        });
    }
}

// File: src/logger/factory.ts
const debugLevel = data.mode.debugLevel;
const appLogger = AppLogger.getInstance();
function logDebug(message) {
    appLogger.log(message, 'debug', debugLevel);
}
function logInfo(message) {
    appLogger.log(message, 'info', debugLevel);
}
function logWarning(message) {
    appLogger.log(message, 'warn', debugLevel);
}
function logError(message) {
    appLogger.log(message, 'error', debugLevel);
}
function logCritical(message) {
    appLogger.log(message, 'error', debugLevel);
}
const log = {
    debug: logDebug,
    info: logInfo,
    warn: logWarning,
    error: logError,
    critical: logCritical
};

// File: src/idb/IDBManager.js
class IDBManager {
    static instance = null;
    cache = {};
    dbPromise;
    defaultKeys;
    defaultSettings;
    mode;
    storeNames;
    constructor() {
        this.dbPromise = openDB('paletteDB', 1, {
            upgrade: db => {
                const storeNames = Object.values(this.storeNames);
                for (const storeName of storeNames) {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, { keyPath: 'key' });
                    }
                }
            }
        });
        this.defaultSettings = data.defaults.idb.settings;
        this.mode = data.mode;
        this.defaultKeys = data.idb.DEFAULT_KEYS;
        this.storeNames = data.idb.STORE_NAMES;
    }
    //
    ///
    //// * * * * * * * * * * * * * * * * * * * * * *
    ///// * * * * * * STATIC METHODS * * * * * * *
    //// * * * * * * * * * * * * * * * * * * * * * *
    ///
    //
    static async createInstance() {
        if (!this.instance) {
            this.instance = new IDBManager();
            await this.instance.initializeDB();
        }
        return this.instance;
    }
    static getInstance() {
        if (!this.instance) {
            throw new Error('IDBManager instance has not been initialized. Call createInstance first.');
        }
        return this.instance;
    }
    static resetInstance() {
        this.instance = null;
    }
    //
    ///
    //// * * * * * * * * * * * * * * * * * * * * * *
    ///// * * * * * * * PUBLIC METHODS * * * * * * *
    //// * * * * * * * * * * * * * * * * * * * * * *
    ///
    //
    createMutationLogger(obj, key) {
        const logMutation = this.logMutation.bind(this);
        return new Proxy(obj, {
            set(target, property, value) {
                const oldValue = target[property];
                const success = Reflect.set(target, property, value);
                if (success) {
                    logMutation({
                        timestamp: new Date().toISOString(),
                        key,
                        action: 'update',
                        newValue: { [property]: value },
                        oldValue: { [property]: oldValue },
                        origin: 'Proxy'
                    });
                }
                return success;
            }
        });
    }
    createPaletteTable(palette) {
        const fragment = document.createDocumentFragment();
        const table = document.createElement('table');
        table.classList.add('palette-table');
        palette.palette.items.forEach((item, index) => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            const colorBox = document.createElement('div');
            cell.textContent = `Color ${index + 1}`;
            colorBox.classList.add('color-box');
            colorBox.style.backgroundColor = item.cssStrings.hexCSSString;
            row.appendChild(colorBox);
            row.appendChild(cell);
            table.appendChild(row);
        });
        fragment.appendChild(table);
        return fragment;
    }
    createPaletteObject(type, items, baseColor, numBoxes, enableAlpha, limitDark, limitGray, limitLight) {
        return utils.palette.createObject(type, items, baseColor, Date.now(), numBoxes, enableAlpha, limitDark, limitGray, limitLight);
    }
    // *DEV-NOTE* add this method to docs
    async deleteEntry(storeName, key) {
        return this.handleAsync(async () => {
            if (!(await this.ensureEntryExists(storeName, key))) {
                if (this.mode.warnLogs) {
                    log.warn(`Entry with key ${key} not found.`);
                }
                return;
            }
            const db = await this.getDB();
            const store = db
                .transaction(storeName, 'readwrite')
                .objectStore(storeName);
            await store.delete(key);
            if (!this.mode.quiet) {
                log.info(`Entry with key ${key} deleted successfully.`);
            }
        }, 'IDBManager.deleteData(): Error deleting entry');
    }
    async deleteEntries(storeName, keys) {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const store = db
                .transaction(storeName, 'readwrite')
                .objectStore(storeName);
            const validKeys = (await Promise.all(keys.map(async (key) => (await this.ensureEntryExists(storeName, key))
                ? key
                : null))).filter((key) => key !== null);
            await Promise.all(validKeys.map(key => store.delete(key)));
            if (!this.mode.quiet) {
                log.info(`Entries deleted successfully. Keys: ${validKeys}`);
            }
        }, 'IDBManager.deleteEntries(): Error deleting entries');
    }
    async getCurrentPaletteID() {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const settings = await db.get(this.getStoreName('SETTINGS'), this.getDefaultKey('APP_SETTINGS'));
            if (this.mode.debug)
                log.info(`Fetched settings from IndexedDB: ${settings}`);
            return settings?.lastPaletteID ?? 0;
        }, 'IDBManager: getCurrentPaletteID(): Error fetching current palette ID');
    }
    async getCachedSettings() {
        if (this.cache.settings)
            return this.cache.settings;
        const settings = await this.getSettings();
        if (settings)
            this.cache.settings = settings;
        return settings;
    }
    async getCustomColor() {
        const key = this.resolveKey('CUSTOM_COLOR');
        const storeName = this.resolveStoreName('CUSTOM_COLOR');
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const entry = await db.get(storeName, key);
            if (!entry?.color)
                return null;
            this.cache.customColor = entry.color;
            return this.createMutationLogger(entry.color, storeName);
        }, 'IDBManager.getCustomColor(): Error fetching custom color');
    }
    getLoggedObject(obj, key) {
        if (obj) {
            return this.createMutationLogger(obj, key);
        }
        return null;
    }
    async getNextTableID() {
        return this.handleAsync(async () => {
            const settings = await this.getSettings();
            const lastTableID = settings.lastTableID ?? 0;
            const nextID = lastTableID + 1;
            await this.saveData('settings', 'appSettings', {
                ...settings,
                lastTableID: nextID
            });
            return `palette_${nextID}`;
        }, 'IDBManager.getNextTableID(): Error fetching next table ID');
    }
    async getNextPaletteID() {
        return this.handleAsync(async () => {
            const currentID = await this.getCurrentPaletteID();
            const newID = currentID + 1;
            await this.updateCurrentPaletteID(newID);
            return newID;
        }, 'IDBManager.getNextPaletteID(): Error fetching next palette ID');
    }
    async getSettings() {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const settings = await db.get(this.getStoreName('SETTINGS'), this.getDefaultKey('APP_SETTINGS'));
            return settings ?? this.defaultSettings;
        }, 'IDBManager.getSettings(): Error fetching settings');
    }
    async getStore(storeName, mode) {
        const db = await this.getDB();
        return db.transaction(storeName, mode).objectStore(storeName);
    }
    async renderPalette(tableId) {
        return this.handleAsync(async () => {
            const storedPalette = await this.getTable(tableId);
            const paletteRow = document.getElementById('palette-row');
            if (!storedPalette)
                throw new Error(`Palette ${tableId} not found.`);
            if (!paletteRow)
                throw new Error('Palette row element not found.');
            paletteRow.innerHTML = '';
            const tableElement = this.createPaletteTable(storedPalette);
            paletteRow.appendChild(tableElement);
            if (!this.mode.quiet)
                log.info(`Rendered palette ${tableId}.`);
        }, 'IDBManager.renderPalette(): Error rendering palette');
    }
    async resetDatabase() {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const availableStores = Array.from(db.objectStoreNames);
            const expectedStores = Object.values(this.storeNames);
            for (const storeName of expectedStores) {
                if (!availableStores.includes(storeName)) {
                    log.warn(`Object store "${storeName}" not found in IndexedDB.`);
                    continue;
                }
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                await store.clear();
                await tx.done;
                const settingsStore = db
                    .transaction(this.getStoreName('SETTINGS'), 'readwrite')
                    .objectStore(this.getStoreName('SETTINGS'));
                await settingsStore.put(this.defaultSettings, this.getDefaultKey('APP_SETTINGS'));
                if (!this.mode.quiet)
                    log.info(`IndexedDB has been reset to default settins.`);
            }
        }, 'IDBManager.resetDatabase(): Error resetting database');
    }
    async deleteDatabase() {
        await this.handleAsync(async () => {
            const dbName = 'paletteDB';
            const dbExists = await new Promise(resolve => {
                const request = indexedDB.open(dbName);
                request.onsuccess = () => {
                    request.result.close();
                    resolve(true);
                };
                request.onerror = () => resolve(false);
            });
            if (dbExists) {
                const deleteRequest = indexedDB.deleteDatabase(dbName);
                deleteRequest.onsuccess = () => {
                    if (!this.mode.quiet)
                        log.info(`Database "${dbName}" deleted successfully.`);
                };
                deleteRequest.onerror = event => {
                    console.error(`Error deleting database "${dbName}":`, event);
                };
                deleteRequest.onblocked = () => {
                    if (this.mode.warnLogs)
                        log.warn(`Delete operation blocked. Ensure no open connections to "${dbName}".`);
                    if (this.mode.showAlerts)
                        alert(`Unable to delete database "${dbName}" because it is in use. Please close all other tabs or windows accessing this database and try again.`);
                    if (this.mode.stackTrace)
                        console.trace(`Blocked call stack:`);
                };
            }
            else {
                if (!this.mode.quiet)
                    log.warn(`Database "${dbName}" does not exist.`);
            }
        }, 'IDBManager.deleteDatabase(): Error deleting database');
    }
    // *DEV-NOTE* add this method to docs
    async resetPaletteID() {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const storeName = this.getStoreName('SETTINGS');
            const key = this.getDefaultKey('APP_SETTINGS');
            const settings = await db.get(storeName, key);
            if (!settings)
                throw new Error('Settings not found. Cannot reset palette ID.');
            settings.lastPaletteID = 0;
            await db.put(storeName, { key, ...this.defaultSettings });
            if (!this.mode.quiet)
                log.info(`Palette ID has successfully been reset to 0`);
        }, 'IDBManager.resetPaletteID(): Error resetting palette ID');
    }
    async saveData(storeName, key, data, oldValue) {
        return this.handleAsync(async () => {
            await this.withStore(storeName, 'readwrite', async (store) => {
                await store.put({ key, ...data });
                await this.logMutation({
                    timestamp: new Date().toISOString(),
                    key,
                    action: 'update',
                    newValue: data,
                    oldValue: oldValue || null,
                    origin: 'saveData'
                });
            });
        }, 'IDBManager.saveData(): Error saving data');
    }
    async savePalette(id, newPalette) {
        return this.handleAsync(async () => {
            const store = await this.getStore('tables', 'readwrite');
            const paletteToSave = {
                tableID: newPalette.tableID,
                palette: newPalette.palette
            };
            await store.put({ key: id, ...paletteToSave });
            if (!this.mode.quiet)
                log.info(`Palette ${id} saved successfully.`);
        }, 'IDBManager.savePalette(): Error saving palette');
    }
    async savePaletteToDB(type, items, baseColor, numBoxes, enableAlpha, limitDark, limitGray, limitLight) {
        return this.handleAsync(async () => {
            const newPalette = this.createPaletteObject(type, items, baseColor, numBoxes, enableAlpha, limitDark, limitGray, limitLight);
            const idParts = newPalette.id.split('_');
            if (idParts.length !== 2 || isNaN(Number(idParts[1]))) {
                throw new Error(`Invalid palette ID format: ${newPalette.id}`);
            }
            await this.savePalette(newPalette.id, {
                tableID: parseInt(idParts[1], 10),
                palette: newPalette
            });
            return newPalette;
        }, 'IDBManager.savePaletteToDB(): Error saving palette to DB');
    }
    async saveSettings(newSettings) {
        return this.handleAsync(async () => {
            await this.saveData('settings', 'appSettings', newSettings);
            if (!this.mode.quiet)
                log.info('Settings updated');
        }, 'IDBManager.saveSettings(): Error saving settings');
    }
    async updateEntryInPalette(tableID, entryIndex, newEntry) {
        return this.handleAsync(async () => {
            if (!(await this.ensureEntryExists('tables', tableID))) {
                throw new Error(`Palette ${tableID} not found.`);
            }
            const storedPalette = await this.getTable(tableID);
            if (!storedPalette)
                throw new Error(`Palette ${tableID} not found.`);
            const { items } = storedPalette.palette;
            if (entryIndex >= items.length) {
                if (!this.mode.gracefulErrors)
                    throw new Error(`Entry ${entryIndex} not found in palette ${tableID}.`);
                if (this.mode.errorLogs)
                    log.error(`Entry ${entryIndex} not found in palette ${tableID}.`);
                if (!this.mode.quiet)
                    log.warn('updateEntryInPalette: Entry not found.');
            }
            const oldEntry = items[entryIndex];
            items[entryIndex] = newEntry;
            await this.saveData('tables', tableID, storedPalette);
            await this.logMutation({
                timestamp: new Date().toISOString(),
                key: `${tableID}-${entryIndex}]`,
                action: 'update',
                newValue: newEntry,
                oldValue: oldEntry,
                origin: 'updateEntryInPalette'
            });
            if (!this.mode.quiet)
                log.info(`Entry ${entryIndex} in palette ${tableID} updated.`);
        }, 'IDBManager.updateEntryInPalette(): Error updating entry in palette');
    }
    //
    ///
    ///// * * * *  * * * * * * * * * * * * * * * *
    ////// * * * * * * PRIVATE METHODS * * * * * *
    ///// * * * *  * * * * * * * * * * * * * * * *
    ///
    //
    async initializeDB() {
        await this.dbPromise;
        const db = await this.getDB();
        const storeName = this.getStoreName('SETTINGS');
        const key = this.getDefaultKey('APP_SETTINGS');
        log.info(`Initializing DB with Store Name: ${storeName}, Key: ${key}`);
        if (!storeName || !key)
            throw new Error('Invalid store name or key.');
        const settings = await db.get(storeName, key);
        if (!settings) {
            if (!this.mode.quiet) {
                log.info(`Initializing default settings...`);
            }
            await db.put(storeName, { key, ...this.defaultSettings });
        }
    }
    debugError(context, error) {
        if (this.mode.errorLogs) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            log.error(`Error in ${context}: ${errorMsg}`);
        }
    }
    async ensureEntryExists(storeName, key) {
        const db = await this.getDB();
        const store = db
            .transaction(storeName, 'readonly')
            .objectStore(storeName);
        return (await store.get(key)) !== undefined;
    }
    async getDB() {
        return this.dbPromise;
    }
    getDefaultKey(key) {
        const defaultKey = this.defaultKeys[key];
        if (!defaultKey) {
            throw new Error(`[getDefaultKey()]: Invalid default key: ${key}`);
        }
        return defaultKey;
    }
    getStoreName(storeKey) {
        const storeName = this.storeNames[storeKey];
        if (!storeName) {
            throw new Error(`[getStoreName()]: Invalid store key: ${storeKey}`);
        }
        return storeName;
    }
    async getTable(id) {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const result = await db.get(this.storeNames.TABLES, id);
            if (!result) {
                if (this.mode.warnLogs)
                    log.warn(`Table with ID ${id} not found.`);
            }
            return result;
        }, 'IDBManager.getTable(): Error fetching table');
    }
    async handleAsync(action, errorMessage, context) {
        try {
            return await action();
        }
        catch (error) {
            if (this.mode.errorLogs) {
                const details = context ? JSON.stringify(context) : '';
                this.debugError(`Error: ${errorMessage}\nDetails: ${details}\n${error}`, 'error');
            }
            throw error;
        }
    }
    async logMutation(data) {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            await db.put('mutations', log);
            if (!this.mode.quiet)
                log.info(`Logged mutation: ${JSON.stringify(data)}`);
        }, 'IDBManager.logMutation(): Error logging mutation');
    }
    resolveKey(key) {
        return this.defaultKeys[key];
    }
    resolveStoreName(store) {
        return this.storeNames[store];
    }
    async updateCurrentPaletteID(newID) {
        return this.handleAsync(async () => {
            const db = await this.getDB();
            const tx = db.transaction('settings', 'readwrite');
            const store = tx.objectStore('settings');
            if (this.mode.debug)
                log.info(`Updating curent palette ID to ${newID}`);
            await store.put({ key: 'appSettings', lastPaletteID: newID });
            await tx.done;
            if (!this.mode.quiet)
                log.info(`Current palette ID updated to ${newID}`);
        }, 'IDBManager.updateCurrentPaletteID(): Error updating current palette ID');
    }
    async withStore(storeName, mode, callback) {
        const db = await this.getDB();
        const tx = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        if (!store) {
            throw new Error(`Store "${storeName}" not found`);
        }
        await callback(store);
        await tx.done;
    }
}

// File: src/idb/instance.ts
const idbInstance = await IDBManager.createInstance();

// File: src/palette/common/paletteHelpers/limits.js
const mode$6 = data.mode;
function isColorInBounds(hsl) {
    if (!core.validate.colorValues(hsl)) {
        if (mode$6.errorLogs)
            console.error(`isColorInBounds: Invalid HSL value ${JSON.stringify(hsl)}`);
        return false;
    }
    return isTooDark$1(hsl) || isTooGray$1(hsl) || isTooLight$1(hsl);
}
function isTooDark$1(hsl) {
    if (!core.validate.colorValues(hsl)) {
        if (mode$6.errorLogs)
            console.error(`isTooDark: Invalid HSL value ${JSON.stringify(hsl)}`);
        return false;
    }
    return core.base.clone(hsl).value.lightness < data.consts.thresholds.dark;
}
function isTooGray$1(hsl) {
    if (!core.validate.colorValues(hsl)) {
        if (mode$6.errorLogs)
            console.error(`isTooGray: Invalid HSL value ${JSON.stringify(hsl)}`);
        return false;
    }
    return core.base.clone(hsl).value.saturation < data.consts.thresholds.gray;
}
function isTooLight$1(hsl) {
    if (!core.validate.colorValues(hsl)) {
        if (mode$6.errorLogs)
            console.error(`isTooLight: Invalid HSL value ${JSON.stringify(hsl)}`);
        return false;
    }
    return core.base.clone(hsl).value.lightness > data.consts.thresholds.light;
}
const limits$2 = {
    isColorInBounds,
    isTooDark: isTooDark$1,
    isTooGray: isTooGray$1,
    isTooLight: isTooLight$1
};

// File: src/palette/common/paletteHelpers/update.js
function colorBox(color, index) {
    const colorBox = document.getElementById(`color-box-${index + 1}`);
    if (colorBox) {
        const colorValues = utils.conversion.genAllColorValues(color);
        const selectedColor = colorValues;
        if (selectedColor) {
            const hslColor = colorValues.hsl;
            const hslCSSString = core.convert.toCSSColorString(hslColor);
            colorBox.style.backgroundColor = hslCSSString;
            utils.palette.populateOutputBox(selectedColor, index + 1);
        }
    }
}
const update$2 = {
    colorBox
};

// File: src/palette/common/paletteHelpers/index.js
const paletteHelpers = {
    limits: limits$2,
    update: update$2
};

// File: src/palette/common/paletteSuperUtils/create.js
const limits$1 = paletteHelpers.limits;
const update$1 = paletteHelpers.update;
const hslTo = convert.hslTo;
function baseColor(customColor, enableAlpha) {
    const color = core.base.clone(customColor ?? utils.random.hsl(enableAlpha));
    return color;
}
async function paletteItem(color, enableAlpha) {
    const clonedColor = core.base.clone(color);
    const nextPaletteID = await idbInstance.getNextPaletteID();
    clonedColor.value.alpha = enableAlpha
        ? core.brand.asAlphaRange(Math.random())
        : core.brand.asAlphaRange(1);
    return {
        id: `${color.format}_${nextPaletteID}`,
        colors: {
            cmyk: hslTo(clonedColor, 'cmyk').value,
            hex: hslTo(clonedColor, 'hex').value,
            hsl: clonedColor.value,
            hsv: hslTo(clonedColor, 'hsv').value,
            lab: hslTo(clonedColor, 'lab').value,
            rgb: hslTo(clonedColor, 'rgb').value,
            xyz: hslTo(clonedColor, 'xyz').value
        },
        colorStrings: {
            cmykString: utils.color.colorToColorString(hslTo(clonedColor, 'cmyk')).value,
            hexString: utils.color.colorToColorString(hslTo(clonedColor, 'hex')).value,
            hslString: utils.color.colorToColorString(clonedColor).value,
            hsvString: utils.color.colorToColorString(hslTo(clonedColor, 'hsv')).value,
            labString: utils.color.colorToColorString(hslTo(clonedColor, 'lab')).value,
            rgbString: utils.color.colorToColorString(hslTo(clonedColor, 'rgb')).value,
            xyzString: utils.color.colorToColorString(hslTo(clonedColor, 'xyz')).value
        },
        cssStrings: {
            cmykCSSString: core.convert.toCSSColorString(hslTo(clonedColor, 'cmyk')),
            hexCSSString: core.convert.toCSSColorString(hslTo(clonedColor, 'hex')),
            hslCSSString: core.convert.toCSSColorString(clonedColor),
            hsvCSSString: core.convert.toCSSColorString(hslTo(clonedColor, 'hsv')),
            labCSSString: core.convert.toCSSColorString(hslTo(clonedColor, 'lab')),
            rgbCSSString: core.convert.toCSSColorString(hslTo(clonedColor, 'rgb')),
            xyzCSSString: core.convert.toCSSColorString(hslTo(clonedColor, 'xyz'))
        }
    };
}
async function paletteItemArray(baseColor, hues, enableAlpha, limitDark, limitGray, limitLight) {
    const paletteItems = [
        await paletteItem(baseColor, enableAlpha)
    ];
    for (const [i, hue] of hues.entries()) {
        let newColor = null;
        do {
            const sl = utils.random.sl(enableAlpha);
            newColor = utils.conversion.genAllColorValues({
                value: {
                    hue: core.brand.asRadial(hue),
                    ...sl.value
                },
                format: 'hsl'
            }).hsl;
        } while (newColor &&
            ((limitGray && limits$1.isTooGray(newColor)) ||
                (limitDark && limits$1.isTooDark(newColor)) ||
                (limitLight && limits$1.isTooLight(newColor))));
        if (newColor) {
            const newPaletteItem = await paletteItem(newColor, enableAlpha);
            paletteItems.push(newPaletteItem);
            update$1.colorBox(newColor, i + 1);
        }
    }
    return paletteItems;
}
const create$9 = {
    baseColor,
    paletteItem,
    paletteItemArray
};

// File: src/palette/common/paletteUtils/adjust.js
const adjustments = data.consts.adjustments;
const mode$5 = data.mode;
function sl(color) {
    try {
        if (!core.validate.colorValues(color)) {
            if (mode$5.errorLogs)
                console.error('Invalid color valus for adjustment.');
            helpers.dom.showToast('Invalid color values');
            return color;
        }
        const adjustedSaturation = Math.min(Math.max(color.value.saturation + adjustments.slaValue, 0), 100);
        const adjustedLightness = Math.min(100);
        return {
            value: {
                hue: color.value.hue,
                saturation: core.brand.asPercentile(adjustedSaturation),
                lightness: core.brand.asPercentile(adjustedLightness),
                alpha: color.value.alpha
            },
            format: 'hsl'
        };
    }
    catch (error) {
        if (mode$5.errorLogs)
            console.error(`Error adjusting saturation and lightness: ${error}`);
        return color;
    }
}
const adjust = {
    sl
};

// File: src/paelette/common/paletteUtils/probability.js
const mode$4 = data.mode;
const probabilities = data.consts.probabilities;
function getWeightedRandomInterval$1() {
    try {
        const weights = probabilities.weights;
        const probabilityValues = probabilities.values;
        const cumulativeProbabilities = probabilityValues.reduce((acc, prob, i) => {
            acc[i] = (acc[i - 1] || 0) + prob;
            return acc;
        }, []);
        const random = Math.random();
        for (let i = 0; i < cumulativeProbabilities.length; i++) {
            if (random < cumulativeProbabilities[i]) {
                return weights[i];
            }
        }
        return weights[weights.length - 1];
    }
    catch (error) {
        if (mode$4.errorLogs)
            console.error(`Error generating weighted random interval: ${error}`);
        return 50;
    }
}
const probability = {
    getWeightedRandomInterval: getWeightedRandomInterval$1
};

// File: src/palette/common/paletteUtils/index.js
const paletteUtils = {
    adjust,
    probability
};

// File: src/palette/common/paletteSuperUtils/genHues.js
const mode$3 = data.mode;
const genAllColorValues = utils.conversion.genAllColorValues;
const getWeightedRandomInterval = paletteUtils.probability.getWeightedRandomInterval;
const validateColorValues = core.validate.colorValues;
function analogous$1(color, numBoxes) {
    try {
        if (!validateColorValues(color)) {
            if (mode$3.errorLogs)
                console.error(`Invalid color value ${JSON.stringify(color)}`);
            return [];
        }
        const clonedColor = core.base.clone(color);
        const analogousHues = [];
        const baseHue = clonedColor.value.hue;
        const maxTotalDistance = 60;
        const minTotalDistance = Math.max(20, 10 + (numBoxes - 2) * 12);
        const totalIncrement = Math.floor(Math.random() * (maxTotalDistance - minTotalDistance + 1)) + minTotalDistance;
        const increment = Math.floor(totalIncrement / (numBoxes - 1));
        for (let i = 1; i < numBoxes; i++) {
            analogousHues.push((baseHue + increment * i) % 360);
        }
        return analogousHues;
    }
    catch (error) {
        if (mode$3.errorLogs)
            console.error(`Error generating analogous hues: ${error}`);
        return [];
    }
}
function diadic$1(baseHue) {
    try {
        const clonedBaseHue = core.base.clone(baseHue);
        const diadicHues = [];
        const randomDistance = getWeightedRandomInterval();
        const hue1 = clonedBaseHue;
        const hue2 = (hue1 + randomDistance) % 360;
        diadicHues.push(hue1, hue2);
        return diadicHues;
    }
    catch (error) {
        if (mode$3.errorLogs)
            console.error(`Error generating diadic hues: ${error}`);
        return [];
    }
}
function hexadic$1(color) {
    try {
        const clonedColor = core.base.clone(color);
        if (!validateColorValues(clonedColor)) {
            if (mode$3.errorLogs)
                console.error(`Invalid color value ${JSON.stringify(clonedColor)}`);
            return [];
        }
        const clonedBaseHSL = genAllColorValues(clonedColor).hsl;
        if (!clonedBaseHSL) {
            if (!mode$3.gracefulErrors)
                throw new Error('Unable to generate hexadic hues - missing HSL values');
            else if (mode$3.errorLogs)
                console.error('Unable to generate hexadic hues - missing HSL values');
            else if (!mode$3.quiet)
                console.error('Error generating hexadic hues');
            return [];
        }
        const hexadicHues = [];
        const baseHue = clonedBaseHSL.value.hue;
        const hue1 = baseHue;
        const hue2 = (hue1 + 180) % 360;
        const randomDistance = Math.floor(Math.random() * 61 + 30);
        const hue3 = (hue1 + randomDistance) % 360;
        const hue4 = (hue3 + 180) % 360;
        const hue5 = (hue1 + 360 - randomDistance) % 360;
        const hue6 = (hue5 + 180) % 360;
        hexadicHues.push(hue1, hue2, hue3, hue4, hue5, hue6);
        return hexadicHues;
    }
    catch (error) {
        if (mode$3.errorLogs)
            console.error(`Error generating hexadic hues: ${error}`);
        return [];
    }
}
function splitComplementary$1(baseHue) {
    try {
        const clonedBaseHue = core.base.clone(baseHue);
        const modifier = Math.floor(Math.random() * 11) + 20;
        return [
            (clonedBaseHue + 180 + modifier) % 360,
            (clonedBaseHue + 180 - modifier + 360) % 360
        ];
    }
    catch (error) {
        if (mode$3.errorLogs)
            console.error(`Error generating split complementary hues: ${error}`);
        return [];
    }
}
function tetradic$1(baseHue) {
    try {
        const clonedBaseHue = core.base.clone(baseHue);
        const randomOffset = Math.floor(Math.random() * 46) + 20;
        const distance = 90 + (Math.random() < 0.5 ? -randomOffset : randomOffset);
        return [
            clonedBaseHue,
            (clonedBaseHue + 180) % 360,
            (clonedBaseHue + distance) % 360,
            (clonedBaseHue + distance + 180) % 360
        ];
    }
    catch (error) {
        if (mode$3.errorLogs)
            console.error(`Error generating tetradic hues: ${error}`);
        return [];
    }
}
function triadic$1(baseHue) {
    try {
        const clonedBaseHue = core.base.clone(baseHue);
        return [120, 240].map(increment => (clonedBaseHue + increment) % 360);
    }
    catch (error) {
        if (mode$3.errorLogs)
            console.error(`Error generating triadic hues: ${error}`);
        return [];
    }
}
const genHues$6 = {
    analogous: analogous$1,
    diadic: diadic$1,
    hexadic: hexadic$1,
    splitComplementary: splitComplementary$1,
    tetradic: tetradic$1,
    triadic: triadic$1
};

// File: src/palette/common/paletteSuperUtils.js
const paletteSuperUtils = {
    create: create$9,
    genHues: genHues$6
};

// File: src/dom/events/palette.js
const domIDs$1 = data.consts.dom.ids;
const mode$2 = data.mode;
function enforceSwatchRules(minimumSwatches, maximumSwatches) {
    const paletteDropdown = document.getElementById(domIDs$1.paletteNumberOptions);
    if (!paletteDropdown) {
        if (mode$2.errorLogs) {
            console.error('paletteDropdown not found');
        }
        if (mode$2.stackTrace) {
            console.trace('enforceMinimumSwatches stack trace');
        }
        return;
    }
    const currentValue = parseInt(paletteDropdown.value, 10);
    let newValue = currentValue;
    // ensue the value is within the allowed range
    if (currentValue < minimumSwatches) {
        newValue = minimumSwatches;
    }
    else if (maximumSwatches !== undefined &&
        currentValue > maximumSwatches) {
        newValue = maximumSwatches;
    }
    if (newValue !== currentValue) {
        // update value in the dropdown menu
        paletteDropdown.value = newValue.toString();
        // trigger a change event to notify the application
        const event = new Event('change', { bubbles: true });
        try {
            paletteDropdown.dispatchEvent(event);
        }
        catch (error) {
            if (mode$2.errorLogs) {
                console.error(`Failed to dispatch change event to palette-number-options dropdown menu: ${error}`);
            }
            throw new Error(`Failed to dispatch change event: ${error}`);
        }
    }
}
const base$1 = {
    enforceSwatchRules
};

// File: src/ui/index.ts
const ui = {
    ...base$1
};

// File: src/palette/main/types/analogous.js
const create$8 = paletteSuperUtils.create;
const genHues$5 = paletteSuperUtils.genHues;
const idb$a = IDBManager.getInstance();
async function analogous(args) {
    // ensure at least 2 color swatches
    if (args.numBoxes < 2) {
        ui.enforceSwatchRules(2);
    }
    const baseColor = create$8.baseColor(args.customColor, args.enableAlpha);
    const hues = genHues$5.analogous(baseColor, args.numBoxes);
    const paletteItems = [];
    for (const [i, hue] of hues.entries()) {
        const newColor = {
            value: {
                hue: core.brand.asRadial(hue),
                saturation: core.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.saturation +
                    (Math.random() - 0.5) * 10))),
                lightness: core.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.lightness + (i % 2 === 0 ? 5 : -5)))),
                alpha: args.enableAlpha
                    ? core.brand.asAlphaRange(Math.random())
                    : core.brand.asAlphaRange(1)
            },
            format: 'hsl'
        };
        const paletteItem = await create$8.paletteItem(newColor, args.enableAlpha);
        paletteItems.push(paletteItem);
    }
    const analogousPalette = await idb$a.savePaletteToDB('analogous', paletteItems, baseColor, args.numBoxes, args.enableAlpha, args.limitDark, args.limitGray, args.limitLight);
    if (!analogousPalette)
        throw new Error('Analogous palette is null or undefined.');
    else
        return analogousPalette;
}

// File: src/palette/main/types/complementary.js
const create$7 = paletteSuperUtils.create;
const paletteRanges$5 = data.consts.paletteRanges;
const idb$9 = IDBManager.getInstance();
async function complementary(args) {
    // ensure at least 2 color swatches
    if (args.numBoxes < 2) {
        ui.enforceSwatchRules(2);
    }
    const baseColor = create$7.baseColor(args.customColor, args.enableAlpha);
    const complementaryHue = (baseColor.value.hue + 180) % 360;
    const hues = Array.from({ length: args.numBoxes - 1 }, (_, _i) => (complementaryHue +
        (Math.random() * paletteRanges$5.comp.hueShift -
            paletteRanges$5.comp.hueShift / 2)) %
        360);
    const paletteItems = [];
    for (let i = 0; i < hues.length; i++) {
        const hue = hues[i];
        const saturation = Math.min(100, Math.max(0, baseColor.value.saturation + (Math.random() - 0.5) * 15));
        const lightness = Math.min(100, Math.max(0, baseColor.value.lightness + (i % 2 === 0 ? -10 : 10)));
        const alpha = args.enableAlpha ? Math.random() : 1;
        const newColor = {
            value: {
                hue: core.brand.asRadial(hue),
                saturation: core.brand.asPercentile(saturation),
                lightness: core.brand.asPercentile(lightness),
                alpha: core.brand.asAlphaRange(alpha)
            },
            format: 'hsl'
        };
        const paletteItem = await create$7.paletteItem(newColor, args.enableAlpha);
        paletteItems.push(paletteItem);
    }
    const baseColorPaletteItem = await create$7.paletteItem(baseColor, args.enableAlpha);
    paletteItems.unshift(baseColorPaletteItem);
    const complementaryPalette = await idb$9.savePaletteToDB('complementary', paletteItems, baseColor, args.numBoxes, args.enableAlpha, args.limitDark, args.limitGray, args.limitLight);
    if (!complementaryPalette)
        throw new Error('Complementary palette is null or undefined.');
    else
        return complementaryPalette;
}

// File: src/palette/main/types/diadic.js
const consts$2 = data.consts;
const create$6 = paletteSuperUtils.create;
const genHues$4 = paletteSuperUtils.genHues;
const paletteRanges$4 = consts$2.paletteRanges;
const idb$8 = IDBManager.getInstance();
// *DEV-NOTE* update to reflect the fact this will always return 2 color swatches
async function diadic(args) {
    // ensure exactly 2 color swatches
    if (args.numBoxes !== 2) {
        ui.enforceSwatchRules(2, 2);
    }
    const baseColor = create$6.baseColor(args.customColor, args.enableAlpha);
    const hues = genHues$4.diadic(baseColor.value.hue);
    const paletteItems = [];
    for (let i = 0; i < args.numBoxes; i++) {
        const saturationShift = Math.random() * paletteRanges$4.diadic.satShift -
            paletteRanges$4.diadic.satShift / 2;
        const lightnessShift = Math.random() * paletteRanges$4.diadic.lightShift -
            paletteRanges$4.diadic.lightShift / 2;
        const newColor = {
            value: {
                hue: core.brand.asRadial(hues[i % hues.length]),
                saturation: core.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.saturation + saturationShift))),
                lightness: core.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.lightness + lightnessShift))),
                alpha: args.enableAlpha
                    ? core.brand.asAlphaRange(Math.random())
                    : core.brand.asAlphaRange(1)
            },
            format: 'hsl'
        };
        const paletteItem = await create$6.paletteItem(newColor, args.enableAlpha);
        paletteItems.push(paletteItem);
    }
    const diadicPalette = await idb$8.savePaletteToDB('diadic', paletteItems, baseColor, args.numBoxes, args.enableAlpha, args.limitDark, args.limitGray, args.limitLight);
    if (!diadicPalette)
        throw new Error(`Diadic palette is either null or undefined.`);
    else
        return diadicPalette;
}

// File: src/palette/main/types/hexadic.js
const consts$1 = data.consts;
const create$5 = paletteSuperUtils.create;
const genHues$3 = paletteSuperUtils.genHues;
const paletteRanges$3 = consts$1.paletteRanges;
const idb$7 = IDBManager.getInstance();
// *DEV-NOTE* update to reflect the fact this will always return 6 color swatches
async function hexadic(args) {
    // ensure exactly 6 color swatches
    if (args.numBoxes !== 6) {
        ui.enforceSwatchRules(6, 6);
    }
    const baseColor = create$5.baseColor(args.customColor, args.enableAlpha);
    const hues = genHues$3.hexadic(baseColor);
    const paletteItems = [];
    for (const hue of hues) {
        const saturationShift = Math.random() * paletteRanges$3.hexad.satShift -
            paletteRanges$3.hexad.satShift / 2;
        const lightnessShift = Math.random() * paletteRanges$3.hexad.lightShift -
            paletteRanges$3.hexad.lightShift / 2;
        const newColor = {
            value: {
                hue: core.brand.asRadial(hue),
                saturation: core.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.saturation + saturationShift))),
                lightness: core.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.lightness + lightnessShift))),
                alpha: args.enableAlpha
                    ? core.brand.asAlphaRange(Math.random())
                    : core.brand.asAlphaRange(1)
            },
            format: 'hsl'
        };
        const paletteItem = await create$5.paletteItem(newColor, args.enableAlpha);
        paletteItems.push(paletteItem);
    }
    const hexadicPalette = await idb$7.savePaletteToDB('hexadic', paletteItems, baseColor, args.numBoxes, args.enableAlpha, args.limitDark, args.limitGray, args.limitLight);
    if (!hexadicPalette) {
        throw new Error('Hexadic palette is either null or undefined.');
    }
    else {
        return hexadicPalette;
    }
}

// File: src/palette/main/types/monochromatic.js
const create$4 = paletteSuperUtils.create;
const idb$6 = IDBManager.getInstance();
async function monochromatic(args) {
    // ensure at least 2 color swatches
    if (args.numBoxes < 2) {
        ui.enforceSwatchRules(2);
    }
    const baseColor = create$4.baseColor(args.customColor, args.enableAlpha);
    const paletteItems = [];
    const basePaletteItem = await create$4.paletteItem(baseColor, args.enableAlpha);
    paletteItems.push(basePaletteItem);
    for (let i = 1; i < args.numBoxes; i++) {
        const hueShift = Math.random() * 10 - 5;
        const newColor = utils.conversion.genAllColorValues({
            value: {
                hue: core.brand.asRadial((baseColor.value.hue + hueShift + 360) % 360),
                saturation: core.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.saturation - i * 5))),
                lightness: core.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.lightness + (i * 10 - 20)))),
                alpha: args.enableAlpha
                    ? core.brand.asAlphaRange(Math.random())
                    : core.brand.asAlphaRange(1)
            },
            format: 'hsl'
        }).hsl;
        if (newColor) {
            const paletteItem = await create$4.paletteItem(newColor, args.enableAlpha);
            paletteItems.push(paletteItem);
        }
    }
    const monochromaticPalette = await idb$6.savePaletteToDB('monochromatic', paletteItems, baseColor, args.numBoxes, args.enableAlpha, args.limitDark, args.limitGray, args.limitLight);
    if (!monochromaticPalette) {
        throw new Error('Monochromatic palette is either null or undefined.');
    }
    else {
        return monochromaticPalette;
    }
}

// File: src/paletteGen/palettes/types/random.js
const create$3 = paletteSuperUtils.create;
const update = paletteHelpers.update;
const idb$5 = IDBManager.getInstance();
async function random(args) {
    const baseColor = create$3.baseColor(args.customColor, args.enableAlpha);
    const paletteItems = [
        await create$3.paletteItem(baseColor, args.enableAlpha)
    ];
    for (let i = 1; i < args.numBoxes; i++) {
        const randomColor = utils.random.hsl(args.enableAlpha);
        const nextPaletteItem = await create$3.paletteItem(randomColor, args.enableAlpha);
        paletteItems.push(nextPaletteItem);
        update.colorBox(randomColor, i);
    }
    const randomPalette = await idb$5.savePaletteToDB('random', paletteItems, baseColor, args.numBoxes, args.enableAlpha, args.limitDark, args.limitGray, args.limitLight);
    if (!randomPalette)
        throw new Error('Random palette is either null or undefined.');
    else
        return randomPalette;
}

// File: src/palette/main/types/splitComplementary.js
const create$2 = paletteSuperUtils.create;
const genHues$2 = paletteSuperUtils.genHues;
const paletteRanges$2 = data.consts.paletteRanges;
const idb$4 = IDBManager.getInstance();
// *DEV-NOTE* update to reflect the fact this will always return 3 color swatches
async function splitComplementary(args) {
    // ensure exactly 3 color swatches
    if (args.numBoxes < 3) {
        ui.enforceSwatchRules(3, 3);
    }
    // base color setup
    const baseColor = create$2.baseColor(args.customColor, args.enableAlpha);
    // generate split complementary hues
    const [hue1, hue2] = genHues$2.splitComplementary(baseColor.value.hue);
    // initialize palette items array
    const paletteItems = [];
    // add base color as the first item in the array
    const basePaletteItem = await create$2.paletteItem(baseColor, args.enableAlpha);
    paletteItems.push(basePaletteItem);
    for (const [index, hue] of [hue1, hue2].entries()) {
        const adjustedHSL = {
            value: {
                hue: core.brand.asRadial(hue),
                saturation: core.brand.asPercentile(Math.max(0, Math.min(baseColor.value.saturation +
                    (index === 0
                        ? -30
                        : paletteRanges$2.splitComp.satShift), 100))),
                lightness: core.brand.asPercentile(Math.max(0, Math.min(baseColor.value.lightness +
                    (index === 0
                        ? -30
                        : paletteRanges$2.splitComp.lightShift), 100))),
                alpha: args.enableAlpha
                    ? core.brand.asAlphaRange(Math.random())
                    : core.brand.asAlphaRange(1)
            },
            format: 'hsl'
        };
        const adjustedColor = utils.conversion.genAllColorValues(adjustedHSL).hsl;
        if (adjustedColor) {
            const paletteItem = await create$2.paletteItem(adjustedColor, args.enableAlpha);
            paletteItems.push(paletteItem);
        }
    }
    const splitComplementaryPalette = await idb$4.savePaletteToDB('splitComplementary', paletteItems, baseColor, args.numBoxes, args.enableAlpha, args.limitDark, args.limitGray, args.limitLight);
    if (!splitComplementaryPalette) {
        throw new Error('Split complementary palette is either null or undefined.');
    }
    return splitComplementaryPalette;
}

// File: src/palette/main/types/tetradic.js
const create$1 = paletteSuperUtils.create;
const genHues$1 = paletteSuperUtils.genHues;
const paletteRanges$1 = data.consts.paletteRanges;
const idb$3 = IDBManager.getInstance();
// *DEV-NOTE* update to reflect the fact this will always return 4 color swatches
async function tetradic(args) {
    // ensure exactly 4 swatches
    if (args.numBoxes !== 4) {
        ui.enforceSwatchRules(4, 4);
    }
    // base color setup
    const baseColor = create$1.baseColor(args.customColor, args.enableAlpha);
    // generate tetradic hues
    const tetradicHues = genHues$1.tetradic(baseColor.value.hue);
    // initialize palette items array
    const paletteItems = [];
    // add the base color as the first palette item
    const basePaletteItem = await create$1.paletteItem(baseColor, args.enableAlpha);
    paletteItems.push(basePaletteItem);
    // add the tetradic colors sequentially
    for (let index = 0; index < tetradicHues.length; index++) {
        const hue = tetradicHues[index];
        const adjustedHSL = {
            value: {
                hue: core.brand.asRadial(hue),
                saturation: core.brand.asPercentile(Math.max(0, Math.min(baseColor.value.saturation +
                    (index % 2 === 0
                        ? -30
                        : paletteRanges$1.tetra.satShift), 100))),
                lightness: core.brand.asPercentile(Math.max(0, Math.min(baseColor.value.lightness +
                    (index % 2 === 0
                        ? -30
                        : paletteRanges$1.tetra.lightShift), 100))),
                alpha: args.enableAlpha
                    ? core.brand.asAlphaRange(Math.random())
                    : core.brand.asAlphaRange(1)
            },
            format: 'hsl'
        };
        // generate all color values and create the palette item
        const adjustedColor = utils.conversion.genAllColorValues(adjustedHSL)
            .hsl;
        const paletteItem = await create$1.paletteItem(adjustedColor, args.enableAlpha);
        paletteItems.push(paletteItem);
    }
    // save the palette to the database
    const tetradicPalette = await idb$3.savePaletteToDB('tetradic', paletteItems, baseColor, args.numBoxes, args.enableAlpha, args.limitDark, args.limitGray, args.limitLight);
    // handle null or undefined palette
    if (!tetradicPalette) {
        throw new Error('Tetradic palette is either null or undefined.');
    }
    return tetradicPalette;
}

// File: src/palette/main/types/triadic.js
const conversion = utils.conversion;
const create = paletteSuperUtils.create;
const genHues = paletteSuperUtils.genHues;
const paletteRanges = data.consts.paletteRanges;
const idb$2 = IDBManager.getInstance();
async function triadic(args) {
    // ensure exactly 3 swatches
    if (args.numBoxes < 3) {
        ui.enforceSwatchRules(3, 3);
    }
    // base color setup
    const baseColor = create.baseColor(args.customColor, args.enableAlpha);
    // generate triadic hues
    const hues = genHues.triadic(baseColor.value.hue);
    // initialize palette items array
    const paletteItems = [];
    // add the base color as the first palette item
    const basePaletteItem = await create.paletteItem(baseColor, args.enableAlpha);
    paletteItems.push(basePaletteItem);
    // add the triadic colors sequentially
    for (let index = 0; index < hues.length; index++) {
        const hue = hues[index];
        const adjustedHSL = {
            value: {
                hue: core.brand.asRadial(hue),
                saturation: core.brand.asPercentile(Math.max(0, Math.min(baseColor.value.saturation +
                    (index % 2 === 0
                        ? -30
                        : paletteRanges.triad.satShift), 100))),
                lightness: core.brand.asPercentile(Math.max(0, Math.min(baseColor.value.lightness +
                    (index % 2 === 0
                        ? -30
                        : paletteRanges.triad.lightShift), 100))),
                alpha: args.enableAlpha
                    ? core.brand.asAlphaRange(Math.random())
                    : core.brand.asAlphaRange(1)
            },
            format: 'hsl'
        };
        // generate all color values and create the palette item
        const adjustedColor = conversion.genAllColorValues(adjustedHSL)
            .hsl;
        const paletteItem = await create.paletteItem(adjustedColor, args.enableAlpha);
        paletteItems.push(paletteItem);
    }
    // save the palette to the database
    const triadicPalette = await idb$2.savePaletteToDB('triadic', paletteItems, baseColor, args.numBoxes, args.enableAlpha, args.limitDark, args.limitGray, args.limitLight);
    // handle null or undefined palette
    if (!triadicPalette) {
        throw new Error('Triadic palette is either null or undefined.');
    }
    return triadicPalette;
}

// File: src/palete/main/index.js
const genPalette$1 = {
    analogous,
    complementary,
    diadic,
    hexadic,
    monochromatic,
    random,
    splitComplementary,
    tetradic,
    triadic
};

// File: src/palette/main.js
const defaultPalette = data.defaults.palette.unbrandedData;
const defaultBrandedPalete = transform.brandPalette(defaultPalette);
const limits = paletteHelpers.limits;
const mode$1 = data.mode;
const idb$1 = IDBManager.getInstance();
const isTooDark = limits.isTooDark;
const isTooGray = limits.isTooGray;
const isTooLight = limits.isTooLight;
async function genPalette(options) {
    try {
        let { numBoxes, customColor } = options;
        if (mode$1.verbose)
            console.log('Retrieving existing IDBManager instance.');
        const idb = IDBManager.getInstance();
        if (customColor === null || customColor === undefined) {
            if (mode$1.errorLogs)
                console.error('Custom color is null or undefined.');
            return;
        }
        const validatedCustomColor = helpers.dom.validateAndConvertColor(customColor) ??
            utils.random.hsl(options.enableAlpha);
        if (mode$1.debug)
            console.log(`Custom color: ${JSON.stringify(customColor)}`);
        options.customColor = validatedCustomColor;
        const palette = await generate.selectedPalette(options);
        if (palette.items.length === 0) {
            if (mode$1.errorLogs)
                console.error('Colors array is empty or invalid.');
            return;
        }
        if (!mode$1.quiet)
            console.log(`Colors array generated: ${JSON.stringify(palette.items)}`);
        const tableId = await idb.getNextTableID();
        if (!tableId)
            throw new Error('Table ID is null or undefined.');
        await genPaletteDOMBox(palette.items, numBoxes, tableId);
    }
    catch (error) {
        if (mode$1.errorLogs)
            console.error(`Error starting palette generation: ${error}`);
    }
}
async function genPaletteDOMBox(items, numBoxes, tableId) {
    try {
        const paletteRow = document.getElementById('palette-row');
        if (!paletteRow) {
            if (mode$1.errorLogs)
                console.error('paletteRow is undefined.');
            return;
        }
        paletteRow.innerHTML = '';
        const fragment = document.createDocumentFragment();
        items.slice(0, numBoxes).forEach((item, i) => {
            const color = { value: item.colors.hsl, format: 'hsl' };
            const { colorStripe } = helpers.dom.makePaletteBox(color, i + 1);
            fragment.appendChild(colorStripe);
            utils.palette.populateOutputBox(color, i + 1);
        });
        paletteRow.appendChild(fragment);
        if (!mode$1.quiet)
            console.log('Palette boxes generated and rendered.');
        await idb$1.saveData('tables', tableId, { palette: items });
    }
    catch (error) {
        if (mode$1.errorLogs)
            console.error(`Error generating palette box: ${error}`);
    }
}
const start = {
    genPalette,
    genPaletteDOMBox
};
// ******** GENERATE ********
function limitedHSL(baseHue, limitDark, limitGray, limitLight, alphaValue) {
    let hsl;
    do {
        hsl = {
            value: {
                hue: core.brand.asRadial(baseHue),
                saturation: core.brand.asPercentile(Math.random() * 100),
                lightness: core.brand.asPercentile(Math.random() * 100),
                alpha: alphaValue
                    ? core.brand.asAlphaRange(alphaValue)
                    : core.brand.asAlphaRange(1)
            },
            format: 'hsl'
        };
    } while ((limitGray && isTooGray(hsl)) ||
        (limitDark && isTooDark(hsl)) ||
        (limitLight && isTooLight(hsl)));
    return hsl;
}
async function selectedPalette(options) {
    try {
        const { paletteType, numBoxes, customColor, enableAlpha, limitDarkness, limitGrayness, limitLightness } = options;
        const args = {
            numBoxes,
            customColor,
            enableAlpha,
            limitDark: limitDarkness,
            limitGray: limitGrayness,
            limitLight: limitLightness
        };
        switch (paletteType) {
            case 1:
                return genPalette$1.random(args);
            case 2:
                return genPalette$1.complementary(args);
            case 3:
                return genPalette$1.triadic(args);
            case 4:
                return genPalette$1.tetradic(args);
            case 5:
                return genPalette$1.splitComplementary(args);
            case 6:
                return genPalette$1.analogous(args);
            case 7:
                return genPalette$1.hexadic(args);
            case 8:
                return genPalette$1.diadic(args);
            case 9:
                return genPalette$1.monochromatic(args);
            default:
                if (mode$1.errorLogs)
                    console.error('Invalid palette type.');
                return Promise.resolve(defaultBrandedPalete);
        }
    }
    catch (error) {
        if (mode$1.errorLogs)
            console.error(`Error generating palette: ${error}`);
        return Promise.resolve(defaultBrandedPalete);
    }
}
const generate = {
    limitedHSL,
    selectedPalette
};

// File: src/dom/events/base.js
const buttonDebounce = data.consts.debounce.button;
const domIDs = data.consts.dom.ids;
const uiElements = data.consts.dom.elements;
const idb = IDBManager.getInstance();
function addEventListener(id, eventType, callback) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener(eventType, callback);
    }
    else if (mode$i.warnLogs) {
        if ((mode$i.debug || mode$i.verbose) && mode$i.warnLogs)
            console.warn(`Element with id "${id}" not found.`);
    }
}
const handlePaletteGen = core.base.debounce(() => {
    try {
        const params = superUtils.dom.getGenButtonArgs();
        if (!params) {
            console.error('Failed to retrieve generateButton parameters');
            return;
        }
        const { numBoxes, customColor, paletteType, enableAlpha, limitDarkness, limitGrayness, limitLightness } = params;
        if (!paletteType || !numBoxes) {
            console.error('paletteType and/or numBoxes are undefined');
            return;
        }
        const options = {
            numBoxes,
            customColor,
            paletteType,
            enableAlpha,
            limitDarkness,
            limitGrayness,
            limitLightness
        };
        start.genPalette(options);
    }
    catch (error) {
        console.error(`Failed to handle generate button click: ${error}`);
    }
}, buttonDebounce);
function initializeEventListeners() {
    const addConversionListener = (id, colorSpace) => {
        const button = document.getElementById(id);
        if (button) {
            if (core.guards.isColorSpace(colorSpace)) {
                button.addEventListener('click', () => superUtils.dom.switchColorSpace(colorSpace));
            }
        }
        else {
            if (mode$i.warnLogs)
                console.warn(`Element with id "${id}" not found.`);
        }
    };
    addConversionListener('show-as-cmyk-button', 'cmyk');
    addConversionListener('show-as-hex-button', 'hex');
    addConversionListener('show-as-hsl-button', 'hsl');
    addConversionListener('show-as-hsv-button', 'hsv');
    addConversionListener('show-as-lab-button', 'lab');
    addConversionListener('show-as-rgb-button', 'rgb');
    addEventListener(domIDs.advancedMenuButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.advancedMenu?.classList.remove('hidden');
        uiElements.advancedMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(domIDs.applyCustomColorButton, 'click', async (e) => {
        e.preventDefault();
        const customHSLColor = domUtils.applyCustomColor();
        const customHSLColorClone = core.base.clone(customHSLColor);
        await idb.saveData('customColor', 'appSettings', customHSLColorClone);
        if (!mode$i.quiet)
            console.log('Custom color saved to IndexedDB');
        // *DEV-NOTE* unfinished, I think? Double-check this
    });
    addEventListener(domIDs.clearCustomColorButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.customColorInput.value = '#ff0000';
        if (!mode$i.quiet)
            console.log('Custom color cleared');
    });
    addEventListener(domIDs.customColorMenuButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.customColorMenu?.classList.add('hidden');
        uiElements.customColorMenu?.setAttribute('aria-hidden', 'true');
    });
    if (!uiElements.customColorInput)
        throw new Error('Custom color input element not found');
    uiElements.customColorInput.addEventListener('input', () => {
        if (!uiElements.customColorDisplay)
            throw new Error('Custom color display element not found');
        uiElements.customColorDisplay.textContent =
            uiElements.customColorInput.value;
    });
    addEventListener(domIDs.deleteDatabaseButton, 'click', async (e) => {
        e.preventDefault();
        // only allow if application is in development mode
        if (mode$i.app !== 'dev') {
            if (mode$i.infoLogs) {
                console.info('Cannot delete database in production mode.');
            }
            return;
        }
        const confirmDelete = confirm('Are you sure you want to delete the entire database? This action cannot be undone.');
        if (!confirmDelete)
            return;
        try {
            await IDBManager.getInstance().deleteDatabase();
            alert('Database deleted successfully!');
        }
        catch (error) {
            if (mode$i.errorLogs)
                console.error(`Failed to delete database: ${error}`);
            alert('Failed to delete database.');
        }
    });
    addEventListener(domIDs.desaturateButton, 'click', async (e) => {
        e.preventDefault();
        const selectedColor = uiElements.selectedColorOption
            ? parseInt(uiElements.selectedColorOption.value, 10)
            : 0;
        if (!mode$i.quiet)
            console.log('desaturateButton clicked');
        domUtils.desaturateColor(selectedColor);
    });
    addEventListener(domIDs.developerMenuButton, 'click', async (e) => {
        e.preventDefault();
        if (mode$i.app !== 'dev') {
            if (!mode$i.quiet)
                console.error('Cannot access developer menu in production mode.');
            return;
        }
        uiElements.developerMenu?.classList.remove('hidden');
        uiElements.developerMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(domIDs.generateButton, 'click', async (e) => {
        e.preventDefault();
        // captures data from UI at the time the Generate Button is clicked
        const { paletteType, numBoxes, enableAlpha, limitDarkness, limitGrayness, limitLightness } = domUtils.pullParamsFromUI();
        if (mode$i.verbose)
            console.log('Generate Button click event: Retrieved parameters from UI.');
        let customColor = (await idb.getCustomColor());
        if (!customColor) {
            customColor = utils.random.hsl(true);
        }
        else {
            if (mode$i.debug)
                console.log(`User-generated Custom Color found in IndexedDB: ${JSON.stringify(customColor)}`);
        }
        const paletteOptions = {
            paletteType,
            numBoxes,
            customColor: core.base.clone(customColor),
            enableAlpha,
            limitDarkness,
            limitGrayness,
            limitLightness
        };
        if (mode$i.debug) {
            console.log(`paletteOptions object data:`);
            console.log(`paletteType: ${paletteOptions.paletteType}`);
            console.log(`numBoxes: ${paletteOptions.numBoxes}`);
            console.log(`customColor: ${JSON.stringify(paletteOptions.customColor)}`);
            console.log(`enableAlpha: ${paletteOptions.enableAlpha}`);
            console.log(`limitDarkness: ${paletteOptions.limitDarkness}`);
            console.log(`limitGrayness: ${paletteOptions.limitGrayness}`);
            console.log(`limitLightness: ${paletteOptions.limitLightness}`);
        }
        await start.genPalette(paletteOptions);
    });
    addEventListener(domIDs.helpMenuButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.helpMenu?.classList.remove('hidden');
        uiElements.helpMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(domIDs.historyMenuButton, 'click', async (e) => {
        e.preventDefault();
        uiElements.historyMenu?.classList.remove('hidden');
        uiElements.historyMenu?.setAttribute('aria-hidden', 'false');
    });
    addEventListener(domIDs.resetDatabaseButton, 'click', async (e) => {
        e.preventDefault();
        const confirmReset = confirm('Are you sure you want to reset the database?');
        if (!confirmReset)
            return;
        try {
            IDBManager.getInstance().resetDatabase();
            if (!mode$i.quiet)
                console.log('Database has been successfully reset.');
            alert('IndexedDB successfully reset!');
        }
        catch (error) {
            if (mode$i.errorLogs)
                console.error(`Failed to reset database: ${error}`);
            alert('Failed to reset database.');
        }
    });
    addEventListener(domIDs.resetPaletteIDButton, 'click', async (e) => {
        e.preventDefault();
        if (mode$i.app !== 'dev') {
            if (!mode$i.quiet)
                console.error('Cannot reset palette ID in production mode.');
            return;
        }
        const confirmReset = confirm('Are you sure you want to reset the palette ID?');
        if (!confirmReset)
            return;
        try {
            await idb.resetPaletteID();
            if (!mode$i.quiet)
                console.log('Palette ID has been successfully reset.');
            alert('Palette ID reset successfully!');
        }
        catch (error) {
            if (mode$i.errorLogs)
                console.error(`Failed to reset palette ID: ${error}`);
            alert('Failed to reset palette ID.');
        }
    });
    addEventListener(domIDs.saturateButton, 'click', async (e) => {
        e.preventDefault();
        const selectedColor = uiElements.selectedColorOption
            ? parseInt(uiElements.selectedColorOption.value, 10)
            : 0;
        domUtils.saturateColor(selectedColor);
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.advancedMenu)
            if (e.target === uiElements.advancedMenu) {
                uiElements.advancedMenu.classList.add('hidden');
                uiElements.advancedMenu.setAttribute('aria-hidden', 'true');
            }
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.customColorMenu)
            if (e.target === uiElements.customColorMenu) {
                uiElements.customColorMenu.classList.add('hidden');
                uiElements.customColorMenu.setAttribute('aria-hidden', 'true');
            }
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.developerMenu)
            if (e.target === uiElements.developerMenu) {
                uiElements.developerMenu.classList.add('hidden');
                uiElements.developerMenu.setAttribute('aria-hidden', 'true');
            }
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.helpMenu)
            if (e.target === uiElements.helpMenu) {
                uiElements.helpMenu.classList.add('hidden');
                uiElements.helpMenu.setAttribute('aria-hidden', 'true');
            }
    });
    window.addEventListener('click', async (e) => {
        if (uiElements.historyMenu)
            if (e.target === uiElements.historyMenu) {
                uiElements.historyMenu.classList.add('hidden');
                uiElements.historyMenu.setAttribute('aria-hidden', 'true');
            }
    });
}
const base = {
    addEventListener,
    handlePaletteGen,
    initializeEventListeners
};

// File: src/dom/events/index.js
const events = {
    ...base
};

// File: src/dom/exportPalette.js
function asCSS(palette, colorSpace = 'hsl') {
    const css = palette.items
        .map(item => {
        const colorValue = (() => {
            switch (colorSpace) {
                case 'cmyk':
                    return item.cssStrings.cmykCSSString;
                case 'hex':
                    return item.cssStrings.hexCSSString;
                case 'hsl':
                    return item.cssStrings.hslCSSString;
                case 'hsv':
                    return item.cssStrings.hsvCSSString;
                case 'lab':
                    return item.cssStrings.labCSSString;
                case 'rgb':
                    return item.cssStrings.rgbCSSString;
                case 'xyz':
                    return item.cssStrings.xyzCSSString;
                default:
                    return item.cssStrings.hslCSSString;
            }
        })();
        return `
            /* Palette Item: ${item.id} */
            .color-${item.id} {
                cmyk-color: ${item.cssStrings.cmykCSSString};
                hex-color: ${item.cssStrings.hexCSSString};
                hsl-color: ${item.cssStrings.hslCSSString};
                hsv-color: ${item.cssStrings.hsvCSSString};
                lab-color: ${item.cssStrings.labCSSString};
                rgb-color: ${item.cssStrings.rgbCSSString};
                xyz-color: ${item.cssStrings.xyzCSSString};
                background-color: ${colorValue}; /* Use selected color space */
            }
        `;
    })
        .join('\n');
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette_${palette.id}.css`;
    a.click();
    URL.revokeObjectURL(url);
}
function asJSON(palette) {
    const json = JSON.stringify(palette, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette_${palette.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
}
function asPNG(palette, colorSpace = 'hsl', paletteName) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const swatchSize = 100;
    const padding = 20;
    const labelHeight = 40;
    const titleHeight = paletteName ? 60 : 0;
    canvas.width = (swatchSize + padding) * palette.items.length + padding;
    canvas.height = swatchSize + labelHeight + titleHeight + 2 * padding;
    if (!context)
        throw new Error('Could not get 2d context');
    context.fillStyle = '#f0f0f0ff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    if (paletteName) {
        context.font = '22px Arial';
        context.fillStyle = '#1e1e1eff';
        context.textAlign = 'center';
        context.fillText(paletteName, canvas.width / 2, padding + titleHeight / 2);
    }
    palette.items.forEach((item, index) => {
        const x = padding + index * (swatchSize + padding);
        const y = padding + titleHeight;
        const fillColor = (() => {
            switch (colorSpace) {
                case 'cmyk':
                    return item.cssStrings.cmykCSSString;
                case 'hex':
                    return item.cssStrings.hexCSSString;
                case 'hsl':
                    return item.cssStrings.hslCSSString;
                case 'hsv':
                    return item.cssStrings.hsvCSSString;
                case 'lab':
                    return item.cssStrings.labCSSString;
                case 'rgb':
                    return item.cssStrings.rgbCSSString;
                default:
                    return item.cssStrings.hslCSSString;
            }
        })();
        const colorLabel = fillColor;
        context.fillStyle = fillColor;
        context.fillRect(x, y, swatchSize, swatchSize);
        context.font = '12px Arial';
        context.fillStyle = '#0a0a0aff';
        context.textAlign = 'center';
        context.fillText(colorLabel, x + swatchSize / 2, y + swatchSize + labelHeight - 5);
    });
    canvas.toBlob(blob => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `palette_${palette.id}.png`;
            a.click();
            URL.revokeObjectURL(url);
        }
        else {
            console.error('Failed to create PNG blob.');
        }
    }, 'image/png');
}
function asXML(palette) {
    const xmlItems = palette.items
        .map(item => `
		<PaletteItem "${item.id}>
			<Colors>
				<CMYK>${item.colors.cmyk}</CMYK>
				<Hex>${item.colors.hex}</Hex>
				<HSL>${item.colors.hsl}</HSL>
				<HSV>${item.colors.hsv}</HSV>
				<LAB>${item.colors.lab}</LAB>
				<RGB>${item.colors.rgb}</RGB>
			</Colors>
		</PaletteItem>
	`)
        .join('');
    const xml = `
		<Palette ${palette.id}>
			<Flags>
				<EnableAlpha>${palette.flags.enableAlpha}</EnableAlpha>
				<LimitDarkness>${palette.flags.limitDarkness}</LimitDarkness>
				<LimitGrayness>${palette.flags.limitGrayness}</LimitGrayness>
				<LimitLightness>${palette.flags.limitLightness}</LimitLightness>
			</Flags>
			<Metadata>
				<CustomColor>
					<HSLColor>${palette.metadata.customColor ? palette.metadata.customColor.hslColor : null}</HSLColor>
					<ConvertedColors>${palette.metadata.customColor ? palette.metadata.customColor.convertedColors : null}</ConvertedColors>
				</CustomColor>
				<NumBoxes>${palette.metadata.numBoxes}</NumBoxes>
				<PaletteType>${palette.metadata.paletteType}</PaletteType>
			</Metadata>
			${xmlItems}
		</Palette>
	`;
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette_${palette.id}.xml`;
    a.click();
    URL.revokeObjectURL(url);
}
const exportPalette = {
    asCSS,
    asJSON,
    asPNG,
    asXML
};

// File: src/dom/history.js
let paletteHistory = [];
function addPalette(palette) {
    paletteHistory.unshift(palette);
    if (paletteHistory.length >= 50)
        paletteHistory.pop();
}
function renderPalette(displayFormat) {
    paletteHistory.forEach(palette => {
        console.log(`Palette ID: ${palette.id}`);
        console.log(`${displayFormat}`);
        // *DEV-NOTE* FINISH THIS
        // palette.items.forEach(item => {
        // 	const colorString = palette.items.
        // });
    });
}
const history = {
    addPalette,
    renderPalette
};

// File: src/dom/validate.ts
function validateElements() {
    const ids = data.consts.dom.ids;
    const missingElements = [];
    Object.values(ids).forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with ID "${id}" not found`);
            missingElements.push(id);
        }
    });
    if (missingElements.length) {
        console.warn(`Some DOM elements are missing (${missingElements.length}):`, missingElements);
    }
    else {
        console.log('All required DOM elements are present.');
    }
}
const validate = {
    elements: validateElements
};

// File: src/dom/index.js
const dom = {
    ...base$3,
    events,
    exportPalette,
    history,
    validate
};

// ColorGen - version 0.6.0-dev
// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.
// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.
// File: src/app.js
const consts = data.consts;
const mode = data.mode;
if (mode.debug)
    log.info('Executing main application script');
if (document.readyState === 'loading') {
    if (mode.debug)
        log.info('DOM content not yet loaded. Adding DOMContentLoaded event listener and awaiting...');
    document.addEventListener('DOMContentLoaded', initializeApp);
}
else {
    if (mode.debug)
        log.info('DOM content already loaded. Initializing application immediately.');
    initializeApp();
}
async function initializeApp() {
    console.log('DOM content loaded - Initializing application');
    try {
        if (mode.verbose)
            log.info('Creating new IDBManager instance. Initializing database and its dependencies.');
        if (mode.exposeIDB) {
            if (mode.debug)
                log.info('Exposing IDBManager instance to window.');
            try {
                (async () => {
                    const idbManagerInstance = await IDBManager.createInstance();
                    // binds the IDBManager instance to the window object
                    window.idbManager = idbManagerInstance;
                    log.info('IDBManager instance successfully exposed to window.');
                })();
            }
            catch (error) {
                if (mode.errorLogs)
                    log.error(`Failed to expose IDBManager instance to window. Error: ${error}`);
                if (mode.showAlerts)
                    alert('An error occurred. Check console for details.');
            }
        }
    }
    catch (error) {
        if (mode.errorLogs)
            log.error(`Failed to create initial IDBManager instance. Error: ${error}`);
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
    if (!mode.quiet)
        console.log('Initializing UI...');
    const domElements = dom.defineUIElements();
    if (!domElements) {
        if (mode.errorLogs)
            log.error('Failed to properly initialize the UI. Some DOM elements could not be found.');
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
    try {
        await dom.initializeUI();
        if (!mode.quiet)
            log.info('UI successfully initialized');
    }
    catch (error) {
        if (mode.errorLogs)
            log.error(`Failed to initialize UI\n${error}`);
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
    const selectedColorOption = consts.dom.elements.selectedColorOption;
    if (mode.debug) {
        dom.validate.elements();
    }
    else {
        if (!mode.quiet) {
            log.info('Skipping DOM element validation');
        }
    }
    const selectedColor = selectedColorOption
        ? parseInt(selectedColorOption.value, 10)
        : 0;
    if (!mode.quiet)
        log.info(`Selected color: ${selectedColor}`);
    try {
        dom.events.initializeEventListeners();
        if (!mode.quiet)
            log.info('Event listeners have been successfully initialized');
    }
    catch (error) {
        if (mode.errorLogs)
            log.error(`Failed to initialize event listeners.\n${error}`);
        if (mode.showAlerts)
            alert('An error occurred. Check console for details.');
    }
    if (!mode.quiet)
        log.info('Application successfully initialized. Awaiting user input.');
}
