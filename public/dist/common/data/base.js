// File: src/common/data/base.ts
import { brand } from '../core/base.js';
import { domUtils } from '../dom/index.js';
// * * * *  1. MODE DATA * * * * * * * *
export const mode = {
    environment: 'dev',
    debug: true,
    debugLevel: 1,
    expose: { idbManager: true, logger: true, uiManager: true },
    gracefulErrors: false,
    logging: {
        args: true,
        clicks: false,
        debug: true,
        error: true,
        info: true,
        verbosity: 3,
        warn: true
    },
    quiet: false,
    showAlerts: true,
    stackTrace: true
};
// * * * *  2. CONFIG DATA  * * * *
const DEFAULT_KEYS = {
    APP_SETTINGS: 'appSettings',
    CUSTOM_COLOR: 'customColor'
};
const DEFAULT_SETTINGS = {
    colorSpace: 'hsl',
    lastTableID: 0,
    theme: 'light',
    loggingEnabled: true
};
const STORE_NAMES = {
    APP_SETTINGS: 'appSettings',
    CUSTOM_COLOR: 'customColor',
    MUTATIONS: 'mutations',
    PALLETES: 'palettes',
    SETTINGS: 'settings',
    TABLES: 'tables'
};
const db = { DEFAULT_KEYS, DEFAULT_SETTINGS, STORE_NAMES };
const regex = {
    colors: {
        cmyk: /cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/i,
        hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
        hsl: /hsl\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
        hsv: /hsv\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
        lab: /lab\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
        rgb: /rgb\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
        xyz: /xyz\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i
    },
    file: {
        palette: {
            css: {
                color: /\.color-\d+\s*{\s*([\s\S]*?)\s*}/i,
                metadata: /\.palette\s*{\s*([\s\S]*?)\s*}/i
            }
        }
    }
};
export const config = { db, regex };
// * * * *  2. CONSTS DATA  * * * * *
const getElement = domUtils.getElement;
const adjustments = { slaValue: 10 };
const debounce = { button: 300, input: 200 };
const limits = {
    xyz: { max: { x: 95.047, y: 100, z: 108.883 }, min: { x: 0, y: 0, z: 0 } }
};
const paletteRanges = {
    comp: { hueShift: 10, lightShift: 0, satShift: 0 },
    diadic: { hueShift: 30, lightShift: 30, satShift: 30 },
    hexad: { hueShift: 0, lightShift: 30, satShift: 30 },
    random: { hueShift: 0, lightShift: 0, satShift: 0 },
    splitComp: { hueShift: 30, lightShift: 30, satShift: 30 },
    tetra: { hueShift: 0, lightShift: 30, satShift: 30 },
    triad: { hueShift: 0, lightShift: 30, satShift: 30 }
};
const probabilities = {
    values: [40, 45, 50, 55, 60, 65, 70],
    weights: [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05]
};
const thresholds = { dark: 25, gray: 20, light: 75 };
const timeouts = { copyButtonText: 1000, toast: 3000, tooltip: 1000 };
export const createDOMElements = async () => {
    const advancedMenu = await getElement('advanced-menu', mode);
    const advancedMenuButton = await getElement('advanced-menu-button', mode);
    const advancedMenuContent = await getElement('advanced-menu-content', mode);
    const applyCustomColorButton = await getElement('apply-custom-color-button', mode);
    const clearCustomColorButton = await getElement('clear-custom-color-button', mode);
    const colorBox1 = await getElement('color-box-1', mode);
    const customColorDisplay = await getElement('custom-color-display', mode);
    const customColorInput = await getElement('custom-color-input', mode);
    const customColorMenu = await getElement('custom-color-menu', mode);
    const customColorMenuButton = await getElement('custom-color-menu-button', mode);
    const deleteDatabaseButton = await getElement('delete-database-button', mode);
    const desaturateButton = await getElement('desaturate-button', mode);
    const developerMenu = await getElement('developer-menu', mode);
    const developerMenuButton = await getElement('developer-menu-button', mode);
    const enableAlphaCheckbox = await getElement('enable-alpha-checkbox', mode);
    const exportPaletteButton = await getElement('export-palette-button', mode);
    const exportPaletteFormatOptions = await getElement('export-palette-format-options', mode);
    const exportPaletteInput = await getElement('export-palette-input', mode);
    const generateButton = await getElement('generate-button', mode);
    const helpMenu = await getElement('help-menu', mode);
    const helpMenuButton = await getElement('help-menu-button', mode);
    const helpMenuContent = await getElement('help-menu-content', mode);
    const historyMenu = await getElement('history-menu', mode);
    const historyMenuButton = await getElement('history-menu-button', mode);
    const historyMenuContent = await getElement('history-menu-content', mode);
    const importExportMenu = await getElement('import-export-menu', mode);
    const importExportMenuButton = await getElement('import-export-menu-button', mode);
    const importPaletteInput = await getElement('import-palette-input', mode);
    const limitDarknessCheckbox = await getElement('limit-darkness-checkbox', mode);
    const limitGraynessCheckbox = await getElement('limit-grayness-checkbox', mode);
    const limitLightnessCheckbox = await getElement('limit-lightness-checkbox', mode);
    const paletteNumberOptions = await getElement('palette-number-options', mode);
    const paletteTypeOptions = await getElement('palette-type-options', mode);
    const resetDatabaseButton = await getElement('reset-database-button', mode);
    const resetPaletteIDButton = await getElement('reset-palette-id-button', mode);
    const saturateButton = await getElement('saturate-button', mode);
    const selectedColorOption = await getElement('selected-color-option', mode);
    const showAsCMYKButton = await getElement('show-as-cmyk-button', mode);
    const showAsHexButton = await getElement('show-as-hex-button', mode);
    const showAsHSLButton = await getElement('show-as-hsl-button', mode);
    const showAsHSVButton = await getElement('show-as-hsv-button', mode);
    const showAsLABButton = await getElement('show-as-lab-button', mode);
    const showAsRGBButton = await getElement('show-as-rgb-button', mode);
    const buttons = {
        advancedMenuButton,
        applyCustomColorButton,
        clearCustomColorButton,
        customColorMenuButton,
        deleteDatabaseButton,
        desaturateButton,
        developerMenuButton,
        exportPaletteButton,
        generateButton,
        helpMenuButton,
        historyMenuButton,
        importExportMenuButton,
        resetDatabaseButton,
        resetPaletteIDButton,
        saturateButton,
        showAsCMYKButton,
        showAsHexButton,
        showAsHSLButton,
        showAsHSVButton,
        showAsLABButton,
        showAsRGBButton
    };
    const divs = {
        advancedMenu,
        advancedMenuContent,
        colorBox1,
        customColorMenu,
        developerMenu,
        helpMenu,
        helpMenuContent,
        historyMenu,
        historyMenuContent,
        importExportMenu
    };
    const inputs = {
        customColorInput,
        enableAlphaCheckbox,
        exportPaletteInput,
        importPaletteInput,
        limitDarknessCheckbox,
        limitGraynessCheckbox,
        limitLightnessCheckbox,
        paletteNumberOptions
    };
    const select = {
        exportPaletteFormatOptions,
        paletteTypeOptions,
        selectedColorOption
    };
    const spans = { customColorDisplay };
    return {
        buttons,
        divs,
        inputs,
        select,
        spans
    };
};
const advancedMenu = 'advanced-menu';
const advancedMenuButton = 'advanced-menu-button';
const advancedMenuContent = 'advanced-menu-content';
const applyCustomColorButton = 'apply-custom-color-button';
const colorBox1 = 'color-box-1';
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
const exportPaletteButton = 'export-palette-button';
const exportPaletteFormatOptions = 'export-palette-format-options';
const exportPaletteInput = 'export-palette-input';
const generateButton = 'generate-button';
const helpMenu = 'help-menu';
const helpMenuButton = 'help-menu-button';
const helpMenuContent = 'help-menu-content';
const historyMenu = 'history-menu';
const historyMenuButton = 'history-menu-button';
const historyMenuContent = 'history-menu-content';
const importExportMenu = 'import-export-menu';
const importExportMenuButton = 'import-export-menu-button';
const importPaletteInput = 'import-palette-input';
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
export const domIDs = {
    advancedMenu,
    advancedMenuButton,
    advancedMenuContent,
    applyCustomColorButton,
    clearCustomColorButton,
    colorBox1,
    customColorDisplay,
    customColorInput,
    customColorMenu,
    customColorMenuButton,
    deleteDatabaseButton,
    desaturateButton,
    developerMenu,
    developerMenuButton,
    enableAlphaCheckbox,
    exportPaletteButton,
    exportPaletteFormatOptions,
    exportPaletteInput,
    generateButton,
    helpMenu,
    helpMenuButton,
    helpMenuContent,
    historyMenu,
    historyMenuButton,
    historyMenuContent,
    importExportMenu,
    importExportMenuButton,
    importPaletteInput,
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
export const dom = {
    elements: await createDOMElements(),
    ids: domIDs
};
export const consts = {
    adjustments,
    debounce,
    dom,
    limits,
    paletteRanges,
    probabilities,
    thresholds,
    timeouts
};
// * * * *  3. DEFAULTS  * * * *
const colors = {
    base: {
        branded: {
            cmyk: {
                value: {
                    cyan: brand.asPercentile(0),
                    magenta: brand.asPercentile(0),
                    yellow: brand.asPercentile(0),
                    key: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'cmyk'
            },
            hex: {
                value: {
                    hex: brand.asHexSet('#000000'),
                    alpha: brand.asHexComponent('FF'),
                    numAlpha: brand.asAlphaRange(1)
                },
                format: 'hex'
            },
            hsl: {
                value: {
                    hue: brand.asRadial(0),
                    saturation: brand.asPercentile(0),
                    lightness: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'hsl'
            },
            hsv: {
                value: {
                    hue: brand.asRadial(0),
                    saturation: brand.asPercentile(0),
                    value: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'hsv'
            },
            lab: {
                value: {
                    l: brand.asLAB_L(0),
                    a: brand.asLAB_A(0),
                    b: brand.asLAB_B(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'lab'
            },
            rgb: {
                value: {
                    red: brand.asByteRange(0),
                    green: brand.asByteRange(0),
                    blue: brand.asByteRange(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'rgb'
            },
            sl: {
                value: {
                    saturation: brand.asPercentile(0),
                    lightness: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'sl'
            },
            sv: {
                value: {
                    saturation: brand.asPercentile(0),
                    value: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'sv'
            },
            xyz: {
                value: {
                    x: brand.asXYZ_X(0),
                    y: brand.asXYZ_Y(0),
                    z: brand.asXYZ_Z(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'xyz'
            }
        },
        unbranded: {
            cmyk: {
                value: {
                    cyan: 0,
                    magenta: 0,
                    yellow: 0,
                    key: 0,
                    alpha: 1
                },
                format: 'cmyk'
            },
            hex: {
                value: {
                    hex: '#000000FF',
                    alpha: 'FF',
                    numAlpha: 1
                },
                format: 'hex'
            },
            hsl: {
                value: {
                    hue: 0,
                    saturation: 0,
                    lightness: 0,
                    alpha: 1
                },
                format: 'hsl'
            },
            hsv: {
                value: {
                    hue: 0,
                    saturation: 0,
                    value: 0,
                    alpha: 1
                },
                format: 'hsv'
            },
            lab: {
                value: {
                    l: 0,
                    a: 0,
                    b: 0,
                    alpha: 1
                },
                format: 'lab'
            },
            sl: {
                value: {
                    saturation: 0,
                    lightness: 0,
                    alpha: 1
                },
                format: 'sl'
            },
            rgb: {
                value: {
                    red: 0,
                    green: 0,
                    blue: 0,
                    alpha: 1
                },
                format: 'rgb'
            },
            sv: {
                value: {
                    saturation: 0,
                    value: 0,
                    alpha: 1
                },
                format: 'sv'
            },
            xyz: {
                value: {
                    x: 0,
                    y: 0,
                    z: 0,
                    alpha: 1
                },
                format: 'xyz'
            }
        }
    },
    cssColorStrings: {
        cmyk: 'cmyk(0%, 0%, 0%, 0%, 1)',
        hex: '#000000FF',
        hsl: 'hsl(0, 0%, 0%, 1)',
        hsv: 'hsv(0, 0%, 0%, 1)',
        lab: 'lab(0, 0, 0, 1)',
        rgb: 'rgb(0, 0, 0, 1)',
        sl: 'sl(0%, 0%, 1)',
        sv: 'sv(0%, 0%, 1)',
        xyz: 'xyz(0, 0, 0, 1)'
    },
    strings: {
        cmyk: {
            value: {
                cyan: '0',
                magenta: '0',
                yellow: '0',
                key: '0',
                alpha: '1'
            },
            format: 'cmyk'
        },
        hex: {
            value: {
                hex: '#000000',
                alpha: 'FF',
                numAlpha: '1'
            },
            format: 'hex'
        },
        hsl: {
            value: {
                hue: '0',
                saturation: '0',
                lightness: '0',
                alpha: '1'
            },
            format: 'hsl'
        },
        hsv: {
            value: {
                hue: '0',
                saturation: '0',
                value: '0',
                alpha: '1'
            },
            format: 'hsv'
        },
        lab: {
            value: {
                l: '0',
                a: '0',
                b: '0',
                alpha: '1'
            },
            format: 'lab'
        },
        rgb: {
            value: {
                red: '0',
                green: '0',
                blue: '0',
                alpha: '1'
            },
            format: 'rgb'
        },
        sl: {
            value: {
                saturation: '0',
                lightness: '0',
                alpha: '1'
            },
            format: 'sl'
        },
        sv: {
            value: {
                saturation: '0',
                value: '0',
                alpha: '1'
            },
            format: 'sv'
        },
        xyz: {
            value: {
                x: '0',
                y: '0',
                z: '0',
                alpha: '1'
            },
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
const idb = {
    mutation
};
const unbrandedData = {
    id: `null-palette-${Date.now()}`,
    items: [],
    metadata: {
        customColor: false,
        flags: {
            enableAlpha: false,
            limitDarkness: false,
            limitGrayness: false,
            limitLightness: false
        },
        name: 'UNBRANDED DEFAULT PALETTE',
        swatches: 1,
        type: '???',
        timestamp: '???'
    }
};
const unbrandedItem = {
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
        cmykString: {
            cyan: '0%',
            magenta: '0%',
            yellow: '0%',
            key: '0%',
            alpha: '1'
        },
        hexString: { hex: '#000000FF', alpha: 'FF', numAlpha: '1' },
        hslString: { hue: '0', saturation: '0%', lightness: '0%', alpha: '1' },
        hsvString: { hue: '0', saturation: '0%', value: '0%', alpha: '1' },
        labString: { l: '0', a: '0', b: '0', alpha: '1' },
        rgbString: { red: '0', green: '0', blue: '0', alpha: '1' },
        xyzString: { x: '0', y: '0', z: '0', alpha: '1' }
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
const palette = {
    unbranded: {
        data: unbrandedData,
        item: unbrandedItem,
        stored: unbrandedStored
    }
};
export const defaults = {
    colors,
    idb,
    palette
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vZGF0YS9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdDQUFnQztBQVdoQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDeEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTNDLHdDQUF3QztBQUV4QyxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUc7SUFDbkIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsS0FBSyxFQUFFLElBQUk7SUFDWCxVQUFVLEVBQUUsQ0FBQztJQUNiLE1BQU0sRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFO0lBQzNELGNBQWMsRUFBRSxLQUFLO0lBQ3JCLE9BQU8sRUFBRTtRQUNSLElBQUksRUFBRSxJQUFJO1FBQ1YsTUFBTSxFQUFFLEtBQUs7UUFDYixLQUFLLEVBQUUsSUFBSTtRQUNYLEtBQUssRUFBRSxJQUFJO1FBQ1gsSUFBSSxFQUFFLElBQUk7UUFDVixTQUFTLEVBQUUsQ0FBQztRQUNaLElBQUksRUFBRSxJQUFJO0tBQ1Y7SUFDRCxLQUFLLEVBQUUsS0FBSztJQUNaLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFVBQVUsRUFBRSxJQUFJO0NBQ1AsQ0FBQztBQUVYLG1DQUFtQztBQUVuQyxNQUFNLFlBQVksR0FBRztJQUNwQixZQUFZLEVBQUUsYUFBYTtJQUMzQixZQUFZLEVBQUUsYUFBYTtDQUNsQixDQUFDO0FBRVgsTUFBTSxnQkFBZ0IsR0FBRztJQUN4QixVQUFVLEVBQUUsS0FBSztJQUNqQixXQUFXLEVBQUUsQ0FBQztJQUNkLEtBQUssRUFBRSxPQUFPO0lBQ2QsY0FBYyxFQUFFLElBQUk7Q0FDWCxDQUFDO0FBRVgsTUFBTSxXQUFXLEdBQUc7SUFDbkIsWUFBWSxFQUFFLGFBQWE7SUFD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QU0sRUFBRSxNQUFNO1NBQ2Q7UUFDRCxHQUFHLEVBQUU7WUFDSixLQUFLLEVBQUU7Z0JBQ04sR0FBRyxFQUFFLFNBQVM7Z0JBQ2QsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsUUFBUSxFQUFFLEdBQUc7YUFDYjtZQUNELE1BQU0sRUFBRSxLQUFLO1NBQ2I7UUFDRCxHQUFHLEVBQUU7WUFDSixLQUFLLEVBQUU7Z0JBQ04sR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsU0FBUyxFQUFFLEdBQUc7Z0JBQ2QsS0FBSyxFQUFFLEdBQUc7YUFDVjtZQUNELE1BQU0sRUFBRSxLQUFLO1NBQ2I7UUFDRCxHQUFHLEVBQUU7WUFDSixLQUFLLEVBQUU7Z0JBQ04sR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsS0FBSyxFQUFFLEdBQUc7YUFDVjtZQUNELE1BQU0sRUFBRSxLQUFLO1NBQ2I7UUFDRCxHQUFHLEVBQUU7WUFDSixLQUFLLEVBQUU7Z0JBQ04sQ0FBQyxFQUFFLEdBQUc7Z0JBQ04sQ0FBQyxFQUFFLEdBQUc7Z0JBQ04sQ0FBQyxFQUFFLEdBQUc7Z0JBQ04sS0FBSyxFQUFFLEdBQUc7YUFDVjtZQUNELE1BQU0sRUFBRSxLQUFLO1NBQ2I7UUFDRCxHQUFHLEVBQUU7WUFDSixLQUFLLEVBQUU7Z0JBQ04sR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsSUFBSSxFQUFFLEdBQUc7Z0JBQ1QsS0FBSyxFQUFFLEdBQUc7YUFDVjtZQUNELE1BQU0sRUFBRSxLQUFLO1NBQ2I7UUFDRCxFQUFFLEVBQUU7WUFDSCxLQUFLLEVBQUU7Z0JBQ04sVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsU0FBUyxFQUFFLEdBQUc7Z0JBQ2QsS0FBSyxFQUFFLEdBQUc7YUFDVjtZQUNELE1BQU0sRUFBRSxJQUFJO1NBQ1o7UUFDRCxFQUFFLEVBQUU7WUFDSCxLQUFLLEVBQUU7Z0JBQ04sVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsS0FB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SUFDOUMsTUFBTTtJQUNOLEdBQUc7SUFDSCxPQUFPO0NBQ0UsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9jb21tb24vZGF0YS9iYXNlLnRzXG5cbmltcG9ydCB7XG5cdENvbmZpZ0RhdGFJbnRlcmZhY2UsXG5cdENvbnN0c0RhdGFJbnRlcmZhY2UsXG5cdERlZmF1bHRzRGF0YUludGVyZmFjZSxcblx0TXV0YXRpb25Mb2csXG5cdFBhbGV0dGVJdGVtVW5icmFuZGVkLFxuXHRQYWxldHRlVW5icmFuZGVkLFxuXHRTdG9yZWRQYWxldHRlVW5icmFuZGVkXG59IGZyb20gJy4uLy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGJyYW5kIH0gZnJvbSAnLi4vY29yZS9iYXNlLmpzJztcbmltcG9ydCB7IGRvbVV0aWxzIH0gZnJvbSAnLi4vZG9tL2luZGV4LmpzJztcblxuLy8gKiAqICogKiAgMS4gTU9ERSBEQVRBICogKiAqICogKiAqICogKlxuXG5leHBvcnQgY29uc3QgbW9kZSA9IHtcblx0ZW52aXJvbm1lbnQ6ICdkZXYnLFxuXHRkZWJ1ZzogdHJ1ZSxcblx0ZGVidWdMZXZlbDogMSxcblx0ZXhwb3NlOiB7IGlkYk1hbmFnZXI6IHRydWUsIGxvZ2dlcjogdHJ1ZSwgdWlNYW5hZ2VyOiB0cnVlIH0sXG5cdGdyYWNlZnVsRXJyb3JzOiBmYWxzZSxcblx0bG9nZ2luZzoge1xuXHRcdGFyZ3M6IHRydWUsXG5cdFx0Y2xpY2tzOiBmYWxzZSxcblx0XHRkZWJ1ZzogdHJ1ZSxcblx0XHRlcnJvcjogdHJ1ZSxcblx0XHRpbmZvOiB0cnVlLFxuXHRcdHZlcmJvc2l0eTogMyxcblx0XHR3YXJuOiB0cnVlXG5cdH0sXG5cdHF1aWV0OiBmYWxzZSxcblx0c2hvd0FsZXJ0czogdHJ1ZSxcblx0c3RhY2tUcmFjZTogdHJ1ZVxufSBhcyBjb25zdDtcblxuLy8gKiAqICogKiAgMi4gQ09ORklHIERBVEEgICogKiAqICpcblxuY29uc3QgREVGQVVMVF9LRVlTID0ge1xuXHRBUFBfU0VUVElOR1M6ICdhcHBTZXR0aW5ncycsXG5cdENVU1RPTV9DT0xPUjogJ2N1c3RvbUNvbG9yJ1xufSBhcyBjb25zdDtcblxuY29uc3QgREVGQVVMVF9TRVRUSU5HUyA9IHtcblx0Y29sb3JTcGFjZTogJ2hzbCcsXG5cdGxhc3RUYWJsZUlEOiAwLFxuXHR0aGVtZTogJ2xpZ2h0Jyxcblx0bG9nZ2luZ0VuYWJsZWQ6IHRydWVcbn0gYXMgY29uc3Q7XG5cbmNvbnN0IFNUT1JFX05BTUVTID0ge1xuXHRBUFBfU0VUVElOR1M6ICdhcHBTZXR0aW5ncycsXG5cdENVU1RPTV9DT0xPUjogJ2N1c3RvbUNvbG9yJyxcblx0TVVUQVRJT05TOiAnbXV0YXRpb25zJyxcblx0UEFMTEVURVM6ICdwYWxldHRlcycsXG5cdFNFVFRJTkdTOiAnc2V0dGluZ3MnLFxuXHRUQUJMRVM6ICd0YWJsZXMnXG59IGFzIGNvbnN0O1xuXG5jb25zdCBkYiA9IHsgREVGQVVMVF9LRVlTLCBERUZBVUxUX1NFVFRJTkdTLCBTVE9SRV9OQU1FUyB9IGFzIGNvbnN0O1xuXG5jb25zdCByZWdleDogQ29uZmlnRGF0YUludGVyZmFjZVsncmVnZXgnXSA9IHtcblx0Y29sb3JzOiB7XG5cdFx0Y215azogL2NteWtcXCgoXFxkKyklPyxcXHMqKFxcZCspJT8sXFxzKihcXGQrKSU/LFxccyooXFxkKyklPyg/OixcXHMqKFtcXGQuXSspKT9cXCkvaSxcblx0XHRoZXg6IC9eIyhbQS1GYS1mMC05XXs2fXxbQS1GYS1mMC05XXs4fSkkLyxcblx0XHRoc2w6IC9oc2xcXCgoW1xcZC5dKyksXFxzKihbXFxkLl0rKSU/LFxccyooW1xcZC5dKyklPyg/OixcXHMqKFtcXGQuXSspKT9cXCkvaSxcblx0XHRoc3Y6IC9oc3ZcXCgoW1xcZC5dKyksXFxzKihbXFxkLl0rKSU/LFxccyooW1xcZC5dKyklPyg/OixcXHMqKFtcXGQuXSspKT9cXCkvaSxcblx0XHRsYWI6IC9sYWJcXCgoW1xcZC5dKyksXFxzKihbXFxkLl0rKSxcXHMqKFtcXGQuXSspKD86LFxccyooW1xcZC5dKykpP1xcKS9pLFxuXHRcdHJnYjogL3JnYlxcKChbXFxkLl0rKSxcXHMqKFtcXGQuXSspLFxccyooW1xcZC5dKykoPzosXFxzKihbXFxkLl0rKSk/XFwpL2ksXG5cdFx0eHl6OiAveHl6XFwoKFtcXGQuXSspLFxccyooW1xcZC5dKyksXFxzKihbXFxkLl0rKSg/OixcXHMqKFtcXGQuXSspKT9cXCkvaVxuXHR9LFxuXHRmaWxlOiB7XG5cdFx0cGFsZXR0ZToge1xuXHRcdFx0Y3NzOiB7XG5cdFx0XHRcdGNvbG9yOiAvXFwuY29sb3ItXFxkK1xccyp7XFxzKihbXFxzXFxTXSo/KVxccyp9L2ksXG5cdFx0XHRcdG1ldGFkYXRhOiAvXFwucGFsZXR0ZVxccyp7XFxzKihbXFxzXFxTXSo/KVxccyp9L2lcblx0XHRcdH1cblx0XHR9XG5cdH1cbn07XG5cbmV4cG9ydCBjb25zdCBjb25maWc6IENvbmZpZ0RhdGFJbnRlcmZhY2UgPSB7IGRiLCByZWdleCB9IGFzIGNvbnN0O1xuXG4vLyAqICogKiAqICAyLiBDT05TVFMgREFUQSAgKiAqICogKiAqXG5cbmNvbnN0IGdldEVsZW1lbnQgPSBkb21VdGlscy5nZXRFbGVtZW50O1xuXG5jb25zdCBhZGp1c3RtZW50cyA9IHsgc2xhVmFsdWU6IDEwIH0gYXMgY29uc3Q7XG5cbmNvbnN0IGRlYm91bmNlID0geyBidXR0b246IDMwMCwgaW5wdXQ6IDIwMCB9IGFzIGNvbnN0O1xuXG5jb25zdCBsaW1pdHMgPSB7XG5cdHh5ejogeyBtYXg6IHsgeDogOTUuMDQ3LCB5OiAxMDAsIHo6IDEwOC44ODMgfSwgbWluOiB7IHg6IDAsIHk6IDAsIHo6IDAgfSB9XG59IGFzIGNvbnN0O1xuXG5jb25zdCBwYWxldHRlUmFuZ2VzID0ge1xuXHRjb21wOiB7IGh1ZVNoaWZ0OiAxMCwgbGlnaHRTaGlmdDogMCwgc2F0U2hpZnQ6IDAgfSxcblx0ZGlhZGljOiB7IGh1ZVNoaWZ0OiAzMCwgbGlnaHRTaGlmdDogMzAsIHNhdFNoaWZ0OiAzMCB9LFxuXHRoZXhhZDogeyBodWVTaGlmdDogMCwgbGlnaHRTaGlmdDogMzAsIHNhdFNoaWZ0OiAzMCB9LFxuXHRyYW5kb206IHsgaHVlU2hpZnQ6IDAsIGxpZ2h0U2hpZnQ6IDAsIHNhdFNoaWZ0OiAwIH0sXG5cdHNwbGl0Q29tcDogeyBodWVTaGlmdDogMzAsIGxpZ2h0U2hpZnQ6IDMwLCBzYXRTaGlmdDogMzAgfSxcblx0dGV0cmE6IHsgaHVlU2hpZnQ6IDAsIGxpZ2h0U2hpZnQ6IDMwLCBzYXRTaGlmdDogMzAgfSxcblx0dHJpYWQ6IHsgaHVlU2hpZnQ6IDAsIGxpZ2h0U2hpZnQ6IDMwLCBzYXRTaGlmdDogMzAgfVxufSBhcyBjb25zdDtcblxuY29uc3QgcHJvYmFiaWxpdGllcyA9IHtcblx0dmFsdWVzOiBbNDAsIDQ1LCA1MCwgNTUsIDYwLCA2NSwgNzBdLFxuXHR3ZWlnaHRzOiBbMC4xLCAwLjE1LCAwLjIsIDAuMywgMC4xNSwgMC4wNSwgMC4wNV1cbn0gYXMgY29uc3Q7XG5cbmNvbnN0IHRocmVzaG9sZHMgPSB7IGRhcms6IDI1LCBncmF5OiAyMCwgbGlnaHQ6IDc1IH0gYXMgY29uc3Q7XG5cbmNvbnN0IHRpbWVvdXRzID0geyBjb3B5QnV0dG9uVGV4dDogMTAwMCwgdG9hc3Q6IDMwMDAsIHRvb2x0aXA6IDEwMDAgfSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZURPTUVsZW1lbnRzID0gYXN5bmMgKCkgPT4ge1xuXHRjb25zdCBhZHZhbmNlZE1lbnUgPSBhd2FpdCBnZXRFbGVtZW50PEhUTUxEaXZFbGVtZW50Pihcblx0XHQnYWR2YW5jZWQtbWVudScsXG5cdFx0bW9kZVxuXHQpO1xuXHRjb25zdCBhZHZhbmNlZE1lbnVCdXR0b24gPSBhd2FpdCBnZXRFbGVtZW50PEhUTUxCdXR0b25FbGVtZW50Pihcblx0XHQnYWR2YW5jZWQtbWVudS1idXR0b24nLFxuXHRcdG1vZGVcblx0KTtcblx0Y29uc3QgYWR2YW5jZWRNZW51Q29udGVudCA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTERpdkVsZW1lbnQ+KFxuXHRcdCdhZHZhbmNlZC1tZW51LWNvbnRlbnQnLFxuXHRcdG1vZGVcblx0KTtcblx0Y29uc3QgYXBwbHlDdXN0b21Db2xvckJ1dHRvbiA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFxuXHRcdCdhcHBseS1jdXN0b20tY29sb3ItYnV0dG9uJyxcblx0XHRtb2RlXG5cdCk7XG5cdGNvbnN0IGNsZWFyQ3VzdG9tQ29sb3JCdXR0b24gPSBhd2FpdCBnZXRFbGVtZW50PEhUTUxCdXR0b25FbGVtZW50Pihcblx0XHQnY2xlYXItY3VzdG9tLWNvbG9yLWJ1dHRvbicsXG5cdFx0bW9kZVxuXHQpO1xuXHRjb25zdCBjb2xvckJveDEgPSBhd2FpdCBnZXRFbGVtZW50PEhUTUxEaXZFbGVtZW50PignY29sb3ItYm94LTEnLCBtb2RlKTtcblx0Y29uc3QgY3VzdG9tQ29sb3JEaXNwbGF5ID0gYXdhaXQgZ2V0RWxlbWVudDxIVE1MU3BhbkVsZW1lbnQ+KFxuXHRcdCdjdXN0b20tY29sb3ItZGlzcGxheScsXG5cdFx0bW9kZVxuXHQpO1xuXHRjb25zdCBjdXN0b21Db2xvcklucHV0ID0gYXdhaXQgZ2V0RWxlbWVudDxIVE1MSW5wdXRFbGVtZW50Pihcblx0XHQnY3VzdG9tLWNvbG9yLWlucHV0Jyxcblx0XHRtb2RlXG5cdCk7XG5cdGNvbnN0IGN1c3RvbUNvbG9yTWVudSA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTERpdkVsZW1lbnQ+KFxuXHRcdCdjdXN0b20tY29sb3ItbWVudScsXG5cdFx0bW9kZVxuXHQpO1xuXHRjb25zdCBjdXN0b21Db2xvck1lbnVCdXR0b24gPSBhd2FpdCBnZXRFbGVtZW50PEhUTUxCdXR0b25FbGVtZW50Pihcblx0XHQnY3VzdG9tLWNvbG9yLW1lbnUtYnV0dG9uJyxcblx0XHRtb2RlXG5cdCk7XG5cdGNvbnN0IGRlbGV0ZURhdGFiYXNlQnV0dG9uID0gYXdhaXQgZ2V0RWxlbWVudDxIVE1MQnV0dG9uRWxlbWVudD4oXG5cdFx0J2RlbGV0ZS1kYXRhYmFzZS1idXR0b24nLFxuXHRcdG1vZGVcblx0KTtcblx0Y29uc3QgZGVzYXR1cmF0ZUJ1dHRvbiA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFxuXHRcdCdkZXNhdHVyYXRlLWJ1dHRvbicsXG5cdFx0bW9kZVxuXHQpO1xuXHRjb25zdCBkZXZlbG9wZXJNZW51ID0gYXdhaXQgZ2V0RWxlbWVudDxIVE1MRGl2RWxlbWVudD4oXG5cdFx0J2RldmVsb3Blci1tZW51Jyxcblx0XHRtb2RlXG5cdCk7XG5cdGNvbnN0IGRldmVsb3Blck1lbnVCdXR0b24gPSBhd2FpdCBnZXRFbGVtZW50PEhUTUxCdXR0b25FbGVtZW50Pihcblx0XHQnZGV2ZWxvcGVyLW1lbnUtYnV0dG9uJyxcblx0XHRtb2RlXG5cdCk7XG5cdGNvbnN0IGVuYWJsZUFscGhhQ2hlY2tib3ggPSBhd2FpdCBnZXRFbGVtZW50PEhUTUxJbnB1dEVsZW1lbnQ+KFxuXHRcdCdlbmFibGUtYWxwaGEtY2hlY2tib3gnLFxuXHRcdG1vZGVcblx0KTtcblx0Y29uc3QgZXhwb3J0UGFsZXR0ZUJ1dHRvbiA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFxuXHRcdCdleHBvcnQtcGFsZXR0ZS1idXR0b24nLFxuXHRcdG1vZGVcblx0KTtcblx0Y29uc3QgZXhwb3J0UGFsZXR0ZUZvcm1hdE9wdGlvbnMgPSBhd2FpdCBnZXRFbGVtZW50PEhUTUxTZWxlY3RFbGVtZW50Pihcblx0XHQnZXhwb3J0LXBhbGV0dGUtZm9ybWF0LW9wdGlvbnMnLFxuXHRcdG1vZGVcblx0KTtcblx0Y29uc3QgZXhwb3J0UGFsZXR0ZUlucHV0ID0gYXdhaXQgZ2V0RWxlbWVudDxIVE1MSW5wdXRFbGVtZW50Pihcblx0XHQnZXhwb3J0LXBhbGV0dGUtaW5wdXQnLFxuXHRcdG1vZGVcblx0KTtcblx0Y29uc3QgZ2VuZXJhdGVCdXR0b24gPSBhd2FpdCBnZXRFbGVtZW50PEhUTUxCdXR0b25FbGVtZW50Pihcblx0XHQnZ2VuZXJhdGUtYnV0dG9uJyxcblx0XHRtb2RlXG5cdCk7XG5cdGNvbnN0IGhlbHBNZW51ID0gYXdhaXQgZ2V0RWxlbWVudDxIVE1MRGl2RWxlbWVudD4oJ2hlbHAtbWVudScsIG1vZGUpO1xuXHRjb25zdCBoZWxwTWVudUJ1dHRvbiA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFxuXHRcdCdoZWxwLW1lbnUtYnV0dG9uJyxcblx0XHRtb2RlXG5cdCk7XG5cdGNvbnN0IGhlbHBNZW51Q29udGVudCA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTERpdkVsZW1lbnQ+KFxuXHRcdCdoZWxwLW1lbnUtY29udGVudCcsXG5cdFx0bW9kZVxuXHQpO1xuXHRjb25zdCBoaXN0b3J5TWVudSA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTERpdkVsZW1lbnQ+KCdoaXN0b3J5LW1lbnUnLCBtb2RlKTtcblx0Y29uc3QgaGlzdG9yeU1lbnVCdXR0b24gPSBhd2FpdCBnZXRFbGVtZW50PEhUTUxCdXR0b25FbGVtZW50Pihcblx0XHQnaGlzdG9yeS1tZW51LWJ1dHRvbicsXG5cdFx0bW9kZVxuXHQpO1xuXHRjb25zdCBoaXN0b3J5TWVudUNvbnRlbnQgPSBhd2FpdCBnZXRFbGVtZW50PEhUTUxEaXZFbGVtZW50Pihcblx0XHQnaGlzdG9yeS1tZW51LWNvbnRlbnQnLFxuXHRcdG1vZGVcblx0KTtcblx0Y29uc3QgaW1wb3J0RXhwb3J0TWVudSA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTERpdkVsZW1lbnQ+KFxuXHRcdCdpbXBvcnQtZXhwb3J0LW1lbnUnLFxuXHRcdG1vZGVcblx0KTtcblx0Y29uc3QgaW1wb3J0RXhwb3J0TWVudUJ1dHRvbiA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFxuXHRcdCdpbXBvcnQtZXhwb3J0LW1lbnUtYnV0dG9uJyxcblx0XHRtb2RlXG5cdCk7XG5cdGNvbnN0IGltcG9ydFBhbGV0dGVJbnB1dCA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTElucHV0RWxlbWVudD4oXG5cdFx0J2ltcG9ydC1wYWxldHRlLWlucHV0Jyxcblx0XHRtb2RlXG5cdCk7XG5cdGNvbnN0IGxpbWl0RGFya25lc3NDaGVja2JveCA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTElucHV0RWxlbWVudD4oXG5cdFx0J2xpbWl0LWRhcmtuZXNzLWNoZWNrYm94Jyxcblx0XHRtb2RlXG5cdCk7XG5cdGNvbnN0IGxpbWl0R3JheW5lc3NDaGVja2JveCA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTElucHV0RWxlbWVudD4oXG5cdFx0J2xpbWl0LWdyYXluZXNzLWNoZWNrYm94Jyxcblx0XHRtb2RlXG5cdCk7XG5cdGNvbnN0IGxpbWl0TGlnaHRuZXNzQ2hlY2tib3ggPSBhd2FpdCBnZXRFbGVtZW50PEhUTUxJbnB1dEVsZW1lbnQ+KFxuXHRcdCdsaW1pdC1saWdodG5lc3MtY2hlY2tib3gnLFxuXHRcdG1vZGVcblx0KTtcblx0Y29uc3QgcGFsZXR0ZU51bWJlck9wdGlvbnMgPSBhd2FpdCBnZXRFbGVtZW50PEhUTUxJbnB1dEVsZW1lbnQ+KFxuXHRcdCdwYWxldHRlLW51bWJlci1vcHRpb25zJyxcblx0XHRtb2RlXG5cdCk7XG5cdGNvbnN0IHBhbGV0dGVUeXBlT3B0aW9ucyA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTFNlbGVjdEVsZW1lbnQ+KFxuXHRcdCdwYWxldHRlLXR5cGUtb3B0aW9ucycsXG5cdFx0bW9kZVxuXHQpO1xuXHRjb25zdCByZXNldERhdGFiYXNlQnV0dG9uID0gYXdhaXQgZ2V0RWxlbWVudDxIVE1MQnV0dG9uRWxlbWVudD4oXG5cdFx0J3Jlc2V0LWRhdGFiYXNlLWJ1dHRvbicsXG5cdFx0bW9kZVxuXHQpO1xuXHRjb25zdCByZXNldFBhbGV0dGVJREJ1dHRvbiA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFxuXHRcdCdyZXNldC1wYWxldHRlLWlkLWJ1dHRvbicsXG5cdFx0bW9kZVxuXHQpO1xuXHRjb25zdCBzYXR1cmF0ZUJ1dHRvbiA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFxuXHRcdCdzYXR1cmF0ZS1idXR0b24nLFxuXHRcdG1vZGVcblx0KTtcblx0Y29uc3Qgc2VsZWN0ZWRDb2xvck9wdGlvbiA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTFNlbGVjdEVsZW1lbnQ+KFxuXHRcdCdzZWxlY3RlZC1jb2xvci1vcHRpb24nLFxuXHRcdG1vZGVcblx0KTtcblx0Y29uc3Qgc2hvd0FzQ01ZS0J1dHRvbiA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFxuXHRcdCdzaG93LWFzLWNteWstYnV0dG9uJyxcblx0XHRtb2RlXG5cdCk7XG5cdGNvbnN0IHNob3dBc0hleEJ1dHRvbiA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFxuXHRcdCdzaG93LWFzLWhleC1idXR0b24nLFxuXHRcdG1vZGVcblx0KTtcblx0Y29uc3Qgc2hvd0FzSFNMQnV0dG9uID0gYXdhaXQgZ2V0RWxlbWVudDxIVE1MQnV0dG9uRWxlbWVudD4oXG5cdFx0J3Nob3ctYXMtaHNsLWJ1dHRvbicsXG5cdFx0bW9kZVxuXHQpO1xuXHRjb25zdCBzaG93QXNIU1ZCdXR0b24gPSBhd2FpdCBnZXRFbGVtZW50PEhUTUxCdXR0b25FbGVtZW50Pihcblx0XHQnc2hvdy1hcy1oc3YtYnV0dG9uJyxcblx0XHRtb2RlXG5cdCk7XG5cdGNvbnN0IHNob3dBc0xBQkJ1dHRvbiA9IGF3YWl0IGdldEVsZW1lbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFxuXHRcdCdzaG93LWFzLWxhYi1idXR0b24nLFxuXHRcdG1vZGVcblx0KTtcblx0Y29uc3Qgc2hvd0FzUkdCQnV0dG9uID0gYXdhaXQgZ2V0RWxlbWVudDxIVE1MQnV0dG9uRWxlbWVudD4oXG5cdFx0J3Nob3ctYXMtcmdiLWJ1dHRvbicsXG5cdFx0bW9kZVxuXHQpO1xuXG5cdGNvbnN0IGJ1dHRvbnMgPSB7XG5cdFx0YWR2YW5jZWRNZW51QnV0dG9uLFxuXHRcdGFwcGx5Q3VzdG9tQ29sb3JCdXR0b24sXG5cdFx0Y2xlYXJDdXN0b21Db2xvckJ1dHRvbixcblx0XHRjdXN0b21Db2xvck1lbnVCdXR0b24sXG5cdFx0ZGVsZXRlRGF0YWJhc2VCdXR0b24sXG5cdFx0ZGVzYXR1cmF0ZUJ1dHRvbixcblx0XHRkZXZlbG9wZXJNZW51QnV0dG9uLFxuXHRcdGV4cG9ydFBhbGV0dGVCdXR0b24sXG5cdFx0Z2VuZXJhdGVCdXR0b24sXG5cdFx0aGVscE1lbnVCdXR0b24sXG5cdFx0aGlzdG9yeU1lbnVCdXR0b24sXG5cdFx0aW1wb3J0RXhwb3J0TWVudUJ1dHRvbixcblx0XHRyZXNldERhdGFiYXNlQnV0dG9uLFxuXHRcdHJlc2V0UGFsZXR0ZUlEQnV0dG9uLFxuXHRcdHNhdHVyYXRlQnV0dG9uLFxuXHRcdHNob3dBc0NNWUtCdXR0b24sXG5cdFx0c2hvd0FzSGV4QnV0dG9uLFxuXHRcdHNob3dBc0hTTEJ1dHRvbixcblx0XHRzaG93QXNIU1ZCdXR0b24sXG5cdFx0c2hvd0FzTEFCQnV0dG9uLFxuXHRcdHNob3dBc1JHQkJ1dHRvblxuXHR9IGFzIGNvbnN0O1xuXG5cdGNvbnN0IGRpdnMgPSB7XG5cdFx0YWR2YW5jZWRNZW51LFxuXHRcdGFkdmFuY2VkTWVudUNvbnRlbnQsXG5cdFx0Y29sb3JCb3gxLFxuXHRcdGN1c3RvbUNvbG9yTWVudSxcblx0XHRkZXZlbG9wZXJNZW51LFxuXHRcdGhlbHBNZW51LFxuXHRcdGhlbHBNZW51Q29udGVudCxcblx0XHRoaXN0b3J5TWVudSxcblx0XHRoaXN0b3J5TWVudUNvbnRlbnQsXG5cdFx0aW1wb3J0RXhwb3J0TWVudVxuXHR9IGFzIGNvbnN0O1xuXG5cdGNvbnN0IGlucHV0cyA9IHtcblx0XHRjdXN0b21Db2xvcklucHV0LFxuXHRcdGVuYWJsZUFscGhhQ2hlY2tib3gsXG5cdFx0ZXhwb3J0UGFsZXR0ZUlucHV0LFxuXHRcdGltcG9ydFBhbGV0dGVJbnB1dCxcblx0XHRsaW1pdERhcmtuZXNzQ2hlY2tib3gsXG5cdFx0bGltaXRHcmF5bmVzc0NoZWNrYm94LFxuXHRcdGxpbWl0TGlnaHRuZXNzQ2hlY2tib3gsXG5cdFx0cGFsZXR0ZU51bWJlck9wdGlvbnNcblx0fSBhcyBjb25zdDtcblxuXHRjb25zdCBzZWxlY3QgPSB7XG5cdFx0ZXhwb3J0UGFsZXR0ZUZvcm1hdE9wdGlvbnMsXG5cdFx0cGFsZXR0ZVR5cGVPcHRpb25zLFxuXHRcdHNlbGVjdGVkQ29sb3JPcHRpb25cblx0fSBhcyBjb25zdDtcblxuXHRjb25zdCBzcGFucyA9IHsgY3VzdG9tQ29sb3JEaXNwbGF5IH0gYXMgY29uc3Q7XG5cblx0cmV0dXJuIHtcblx0XHRidXR0b25zLFxuXHRcdGRpdnMsXG5cdFx0aW5wdXRzLFxuXHRcdHNlbGVjdCxcblx0XHRzcGFuc1xuXHR9IGFzIGNvbnN0O1xufTtcblxuY29uc3QgYWR2YW5jZWRNZW51ID0gJ2FkdmFuY2VkLW1lbnUnIGFzIGNvbnN0O1xuY29uc3QgYWR2YW5jZWRNZW51QnV0dG9uID0gJ2FkdmFuY2VkLW1lbnUtYnV0dG9uJyBhcyBjb25zdDtcbmNvbnN0IGFkdmFuY2VkTWVudUNvbnRlbnQgPSAnYWR2YW5jZWQtbWVudS1jb250ZW50JyBhcyBjb25zdDtcbmNvbnN0IGFwcGx5Q3VzdG9tQ29sb3JCdXR0b24gPSAnYXBwbHktY3VzdG9tLWNvbG9yLWJ1dHRvbicgYXMgY29uc3Q7XG5jb25zdCBjb2xvckJveDEgPSAnY29sb3ItYm94LTEnIGFzIGNvbnN0O1xuY29uc3QgY2xlYXJDdXN0b21Db2xvckJ1dHRvbiA9ICdjbGVhci1jdXN0b20tY29sb3ItYnV0dG9uJyBhcyBjb25zdDtcbmNvbnN0IGN1c3RvbUNvbG9yRGlzcGxheSA9ICdjdXN0b20tY29sb3ItZGlzcGxheScgYXMgY29uc3Q7XG5jb25zdCBjdXN0b21Db2xvcklucHV0ID0gJ2N1c3RvbS1jb2xvci1pbnB1dCcgYXMgY29uc3Q7XG5jb25zdCBjdXN0b21Db2xvck1lbnUgPSAnY3VzdG9tLWNvbG9yLW1lbnUnIGFzIGNvbnN0O1xuY29uc3QgY3VzdG9tQ29sb3JNZW51QnV0dG9uID0gJ2N1c3RvbS1jb2xvci1tZW51LWJ1dHRvbicgYXMgY29uc3Q7XG5jb25zdCBkZWxldGVEYXRhYmFzZUJ1dHRvbiA9ICdkZWxldGUtZGF0YWJhc2UtYnV0dG9uJyBhcyBjb25zdDtcbmNvbnN0IGRlc2F0dXJhdGVCdXR0b24gPSAnZGVzYXR1cmF0ZS1idXR0b24nIGFzIGNvbnN0O1xuY29uc3QgZGV2ZWxvcGVyTWVudSA9ICdkZXZlbG9wZXItbWVudScgYXMgY29uc3Q7XG5jb25zdCBkZXZlbG9wZXJNZW51QnV0dG9uID0gJ2RldmVsb3Blci1tZW51LWJ1dHRvbicgYXMgY29uc3Q7XG5jb25zdCBlbmFibGVBbHBoYUNoZWNrYm94ID0gJ2VuYWJsZS1hbHBoYS1jaGVja2JveCcgYXMgY29uc3Q7XG5jb25zdCBleHBvcnRQYWxldHRlQnV0dG9uID0gJ2V4cG9ydC1wYWxldHRlLWJ1dHRvbicgYXMgY29uc3Q7XG5jb25zdCBleHBvcnRQYWxldHRlRm9ybWF0T3B0aW9ucyA9ICdleHBvcnQtcGFsZXR0ZS1mb3JtYXQtb3B0aW9ucycgYXMgY29uc3Q7XG5jb25zdCBleHBvcnRQYWxldHRlSW5wdXQgPSAnZXhwb3J0LXBhbGV0dGUtaW5wdXQnIGFzIGNvbnN0O1xuY29uc3QgZ2VuZXJhdGVCdXR0b24gPSAnZ2VuZXJhdGUtYnV0dG9uJyBhcyBjb25zdDtcbmNvbnN0IGhlbHBNZW51ID0gJ2hlbHAtbWVudScgYXMgY29uc3Q7XG5jb25zdCBoZWxwTWVudUJ1dHRvbiA9ICdoZWxwLW1lbnUtYnV0dG9uJyBhcyBjb25zdDtcbmNvbnN0IGhlbHBNZW51Q29udGVudCA9ICdoZWxwLW1lbnUtY29udGVudCcgYXMgY29uc3Q7XG5jb25zdCBoaXN0b3J5TWVudSA9ICdoaXN0b3J5LW1lbnUnIGFzIGNvbnN0O1xuY29uc3QgaGlzdG9yeU1lbnVCdXR0b24gPSAnaGlzdG9yeS1tZW51LWJ1dHRvbicgYXMgY29uc3Q7XG5jb25zdCBoaXN0b3J5TWVudUNvbnRlbnQgPSAnaGlzdG9yeS1tZW51LWNvbnRlbnQnIGFzIGNvbnN0O1xuY29uc3QgaW1wb3J0RXhwb3J0TWVudSA9ICdpbXBvcnQtZXhwb3J0LW1lbnUnIGFzIGNvbnN0O1xuY29uc3QgaW1wb3J0RXhwb3J0TWVudUJ1dHRvbiA9ICdpbXBvcnQtZXhwb3J0LW1lbnUtYnV0dG9uJyBhcyBjb25zdDtcbmNvbnN0IGltcG9ydFBhbGV0dGVJbnB1dCA9ICdpbXBvcnQtcGFsZXR0ZS1pbnB1dCcgYXMgY29uc3Q7XG5jb25zdCBsaW1pdERhcmtuZXNzQ2hlY2tib3ggPSAnbGltaXQtZGFya25lc3MtY2hlY2tib3gnIGFzIGNvbnN0O1xuY29uc3QgbGltaXRHcmF5bmVzc0NoZWNrYm94ID0gJ2xpbWl0LWdyYXluZXNzLWNoZWNrYm94JyBhcyBjb25zdDtcbmNvbnN0IGxpbWl0TGlnaHRuZXNzQ2hlY2tib3ggPSAnbGltaXQtbGlnaHRuZXNzLWNoZWNrYm94JyBhcyBjb25zdDtcbmNvbnN0IHBhbGV0dGVOdW1iZXJPcHRpb25zID0gJ3BhbGV0dGUtbnVtYmVyLW9wdGlvbnMnIGFzIGNvbnN0O1xuY29uc3QgcGFsZXR0ZVR5cGVPcHRpb25zID0gJ3BhbGV0dGUtdHlwZS1vcHRpb25zJyBhcyBjb25zdDtcbmNvbnN0IHJlc2V0RGF0YWJhc2VCdXR0b24gPSAncmVzZXQtZGF0YWJhc2UtYnV0dG9uJyBhcyBjb25zdDtcbmNvbnN0IHJlc2V0UGFsZXR0ZUlEQnV0dG9uID0gJ3Jlc2V0LXBhbGV0dGUtaWQtYnV0dG9uJyBhcyBjb25zdDtcbmNvbnN0IHNhdHVyYXRlQnV0dG9uID0gJ3NhdHVyYXRlLWJ1dHRvbicgYXMgY29uc3Q7XG5jb25zdCBzZWxlY3RlZENvbG9yT3B0aW9uID0gJ3NlbGVjdGVkLWNvbG9yLW9wdGlvbicgYXMgY29uc3Q7XG5jb25zdCBzaG93QXNDTVlLQnV0dG9uID0gJ3Nob3ctYXMtY215ay1idXR0b24nIGFzIGNvbnN0O1xuY29uc3Qgc2hvd0FzSGV4QnV0dG9uID0gJ3Nob3ctYXMtaGV4LWJ1dHRvbicgYXMgY29uc3Q7XG5jb25zdCBzaG93QXNIU0xCdXR0b24gPSAnc2hvdy1hcy1oc2wtYnV0dG9uJyBhcyBjb25zdDtcbmNvbnN0IHNob3dBc0hTVkJ1dHRvbiA9ICdzaG93LWFzLWhzdi1idXR0b24nIGFzIGNvbnN0O1xuY29uc3Qgc2hvd0FzTEFCQnV0dG9uID0gJ3Nob3ctYXMtbGFiLWJ1dHRvbicgYXMgY29uc3Q7XG5jb25zdCBzaG93QXNSR0JCdXR0b24gPSAnc2hvdy1hcy1yZ2ItYnV0dG9uJyBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IGRvbUlEczogQ29uc3RzRGF0YUludGVyZmFjZVsnZG9tJ11bJ2lkcyddID0ge1xuXHRhZHZhbmNlZE1lbnUsXG5cdGFkdmFuY2VkTWVudUJ1dHRvbixcblx0YWR2YW5jZWRNZW51Q29udGVudCxcblx0YXBwbHlDdXN0b21Db2xvckJ1dHRvbixcblx0Y2xlYXJDdXN0b21Db2xvckJ1dHRvbixcblx0Y29sb3JCb3gxLFxuXHRjdXN0b21Db2xvckRpc3BsYXksXG5cdGN1c3RvbUNvbG9ySW5wdXQsXG5cdGN1c3RvbUNvbG9yTWVudSxcblx0Y3VzdG9tQ29sb3JNZW51QnV0dG9uLFxuXHRkZWxldGVEYXRhYmFzZUJ1dHRvbixcblx0ZGVzYXR1cmF0ZUJ1dHRvbixcblx0ZGV2ZWxvcGVyTWVudSxcblx0ZGV2ZWxvcGVyTWVudUJ1dHRvbixcblx0ZW5hYmxlQWxwaGFDaGVja2JveCxcblx0ZXhwb3J0UGFsZXR0ZUJ1dHRvbixcblx0ZXhwb3J0UGFsZXR0ZUZvcm1hdE9wdGlvbnMsXG5cdGV4cG9ydFBhbGV0dGVJbnB1dCxcblx0Z2VuZXJhdGVCdXR0b24sXG5cdGhlbHBNZW51LFxuXHRoZWxwTWVudUJ1dHRvbixcblx0aGVscE1lbnVDb250ZW50LFxuXHRoaXN0b3J5TWVudSxcblx0aGlzdG9yeU1lbnVCdXR0b24sXG5cdGhpc3RvcnlNZW51Q29udGVudCxcblx0aW1wb3J0RXhwb3J0TWVudSxcblx0aW1wb3J0RXhwb3J0TWVudUJ1dHRvbixcblx0aW1wb3J0UGFsZXR0ZUlucHV0LFxuXHRsaW1pdERhcmtuZXNzQ2hlY2tib3gsXG5cdGxpbWl0R3JheW5lc3NDaGVja2JveCxcblx0bGltaXRMaWdodG5lc3NDaGVja2JveCxcblx0cGFsZXR0ZU51bWJlck9wdGlvbnMsXG5cdHBhbGV0dGVUeXBlT3B0aW9ucyxcblx0cmVzZXREYXRhYmFzZUJ1dHRvbixcblx0cmVzZXRQYWxldHRlSURCdXR0b24sXG5cdHNhdHVyYXRlQnV0dG9uLFxuXHRzZWxlY3RlZENvbG9yT3B0aW9uLFxuXHRzaG93QXNDTVlLQnV0dG9uLFxuXHRzaG93QXNIZXhCdXR0b24sXG5cdHNob3dBc0hTTEJ1dHRvbixcblx0c2hvd0FzSFNWQnV0dG9uLFxuXHRzaG93QXNMQUJCdXR0b24sXG5cdHNob3dBc1JHQkJ1dHRvblxufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IGRvbSA9IHtcblx0ZWxlbWVudHM6IGF3YWl0IGNyZWF0ZURPTUVsZW1lbnRzKCksXG5cdGlkczogZG9tSURzXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgY29uc3RzOiBDb25zdHNEYXRhSW50ZXJmYWNlID0ge1xuXHRhZGp1c3RtZW50cyxcblx0ZGVib3VuY2UsXG5cdGRvbSxcblx0bGltaXRzLFxuXHRwYWxldHRlUmFuZ2VzLFxuXHRwcm9iYWJpbGl0aWVzLFxuXHR0aHJlc2hvbGRzLFxuXHR0aW1lb3V0c1xufSBhcyBjb25zdDtcblxuLy8gKiAqICogKiAgMy4gREVGQVVMVFMgICogKiAqICpcblxuY29uc3QgY29sb3JzOiBEZWZhdWx0c0RhdGFJbnRlcmZhY2VbJ2NvbG9ycyddID0ge1xuXHRiYXNlOiB7XG5cdFx0YnJhbmRlZDoge1xuXHRcdFx0Y215azoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGN5YW46IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRtYWdlbnRhOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0eWVsbG93OiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0a2V5OiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0fSxcblx0XHRcdGhleDoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoJyMwMDAwMDAnKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoJ0ZGJyksXG5cdFx0XHRcdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHR9LFxuXHRcdFx0aHNsOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbCgwKSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9LFxuXHRcdFx0aHN2OiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbCgwKSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdH0sXG5cdFx0XHRsYWI6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRsOiBicmFuZC5hc0xBQl9MKDApLFxuXHRcdFx0XHRcdGE6IGJyYW5kLmFzTEFCX0EoMCksXG5cdFx0XHRcdFx0YjogYnJhbmQuYXNMQUJfQigwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdH0sXG5cdFx0XHRyZ2I6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZSgwKSxcblx0XHRcdFx0XHRibHVlOiBicmFuZC5hc0J5dGVSYW5nZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdH0sXG5cdFx0XHRzbDoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3NsJ1xuXHRcdFx0fSxcblx0XHRcdHN2OiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdHZhbHVlOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzdidcblx0XHRcdH0sXG5cdFx0XHR4eXo6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHR4OiBicmFuZC5hc1hZWl9YKDApLFxuXHRcdFx0XHRcdHk6IGJyYW5kLmFzWFlaX1koMCksXG5cdFx0XHRcdFx0ejogYnJhbmQuYXNYWVpfWigwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHRcdH1cblx0XHR9LFxuXHRcdHVuYnJhbmRlZDoge1xuXHRcdFx0Y215azoge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGN5YW46IDAsXG5cdFx0XHRcdFx0bWFnZW50YTogMCxcblx0XHRcdFx0XHR5ZWxsb3c6IDAsXG5cdFx0XHRcdFx0a2V5OiAwLFxuXHRcdFx0XHRcdGFscGhhOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHR9LFxuXHRcdFx0aGV4OiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aGV4OiAnIzAwMDAwMEZGJyxcblx0XHRcdFx0XHRhbHBoYTogJ0ZGJyxcblx0XHRcdFx0XHRudW1BbHBoYTogMVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHR9LFxuXHRcdFx0aHNsOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiAwLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IDAsXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiAwLFxuXHRcdFx0XHRcdGFscGhhOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdH0sXG5cdFx0XHRoc3Y6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IDAsXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogMCxcblx0XHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0XHRhbHBoYTogMVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHR9LFxuXHRcdFx0bGFiOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0bDogMCxcblx0XHRcdFx0XHRhOiAwLFxuXHRcdFx0XHRcdGI6IDAsXG5cdFx0XHRcdFx0YWxwaGE6IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0fSxcblx0XHRcdHNsOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogMCxcblx0XHRcdFx0XHRsaWdodG5lc3M6IDAsXG5cdFx0XHRcdFx0YWxwaGE6IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnc2wnXG5cdFx0XHR9LFxuXHRcdFx0cmdiOiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0cmVkOiAwLFxuXHRcdFx0XHRcdGdyZWVuOiAwLFxuXHRcdFx0XHRcdGJsdWU6IDAsXG5cdFx0XHRcdFx0YWxwaGE6IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0fSxcblx0XHRcdHN2OiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogMCxcblx0XHRcdFx0XHR2YWx1ZTogMCxcblx0XHRcdFx0XHRhbHBoYTogMVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzdidcblx0XHRcdH0sXG5cdFx0XHR4eXo6IHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHR4OiAwLFxuXHRcdFx0XHRcdHk6IDAsXG5cdFx0XHRcdFx0ejogMCxcblx0XHRcdFx0XHRhbHBoYTogMVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRjc3NDb2xvclN0cmluZ3M6IHtcblx0XHRjbXlrOiAnY215aygwJSwgMCUsIDAlLCAwJSwgMSknLFxuXHRcdGhleDogJyMwMDAwMDBGRicsXG5cdFx0aHNsOiAnaHNsKDAsIDAlLCAwJSwgMSknLFxuXHRcdGhzdjogJ2hzdigwLCAwJSwgMCUsIDEpJyxcblx0XHRsYWI6ICdsYWIoMCwgMCwgMCwgMSknLFxuXHRcdHJnYjogJ3JnYigwLCAwLCAwLCAxKScsXG5cdFx0c2w6ICdzbCgwJSwgMCUsIDEpJyxcblx0XHRzdjogJ3N2KDAlLCAwJSwgMSknLFxuXHRcdHh5ejogJ3h5eigwLCAwLCAwLCAxKSdcblx0fSxcblx0c3RyaW5nczoge1xuXHRcdGNteWs6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGN5YW46ICcwJyxcblx0XHRcdFx0bWFnZW50YTogJzAnLFxuXHRcdFx0XHR5ZWxsb3c6ICcwJyxcblx0XHRcdFx0a2V5OiAnMCcsXG5cdFx0XHRcdGFscGhhOiAnMSdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdH0sXG5cdFx0aGV4OiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRoZXg6ICcjMDAwMDAwJyxcblx0XHRcdFx0YWxwaGE6ICdGRicsXG5cdFx0XHRcdG51bUFscGhhOiAnMSdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0fSxcblx0XHRoc2w6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogJzAnLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiAnMCcsXG5cdFx0XHRcdGxpZ2h0bmVzczogJzAnLFxuXHRcdFx0XHRhbHBoYTogJzEnXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdH0sXG5cdFx0aHN2OiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRodWU6ICcwJyxcblx0XHRcdFx0c2F0dXJhdGlvbjogJzAnLFxuXHRcdFx0XHR2YWx1ZTogJzAnLFxuXHRcdFx0XHRhbHBoYTogJzEnXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdH0sXG5cdFx0bGFiOiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRsOiAnMCcsXG5cdFx0XHRcdGE6ICcwJyxcblx0XHRcdFx0YjogJzAnLFxuXHRcdFx0XHRhbHBoYTogJzEnXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdH0sXG5cdFx0cmdiOiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRyZWQ6ICcwJyxcblx0XHRcdFx0Z3JlZW46ICcwJyxcblx0XHRcdFx0Ymx1ZTogJzAnLFxuXHRcdFx0XHRhbHBoYTogJzEnXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdH0sXG5cdFx0c2w6IHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHNhdHVyYXRpb246ICcwJyxcblx0XHRcdFx0bGlnaHRuZXNzOiAnMCcsXG5cdFx0XHRcdGFscGhhOiAnMSdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdzbCdcblx0XHR9LFxuXHRcdHN2OiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRzYXR1cmF0aW9uOiAnMCcsXG5cdFx0XHRcdHZhbHVlOiAnMCcsXG5cdFx0XHRcdGFscGhhOiAnMSdcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdzdidcblx0XHR9LFxuXHRcdHh5ejoge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0eDogJzAnLFxuXHRcdFx0XHR5OiAnMCcsXG5cdFx0XHRcdHo6ICcwJyxcblx0XHRcdFx0YWxwaGE6ICcxJ1xuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHR9XG5cdH1cbn0gYXMgY29uc3Q7XG5cbmNvbnN0IG11dGF0aW9uOiBNdXRhdGlvbkxvZyA9IHtcblx0dGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG5cdGtleTogJ2RlZmF1bHRfa2V5Jyxcblx0YWN0aW9uOiAndXBkYXRlJyBhcyAndXBkYXRlJyxcblx0bmV3VmFsdWU6IHsgdmFsdWU6ICduZXdfdmFsdWUnIH0sXG5cdG9sZFZhbHVlOiB7IHZhbHVlOiAnb2xkX3ZhbHVlJyB9LFxuXHRvcmlnaW46ICdERUZBVUxUJ1xufTtcblxuY29uc3QgaWRiOiBEZWZhdWx0c0RhdGFJbnRlcmZhY2VbJ2lkYiddID0ge1xuXHRtdXRhdGlvblxufSBhcyBjb25zdDtcblxuY29uc3QgdW5icmFuZGVkRGF0YTogUGFsZXR0ZVVuYnJhbmRlZCA9IHtcblx0aWQ6IGBudWxsLXBhbGV0dGUtJHtEYXRlLm5vdygpfWAsXG5cdGl0ZW1zOiBbXSxcblx0bWV0YWRhdGE6IHtcblx0XHRjdXN0b21Db2xvcjogZmFsc2UsXG5cdFx0ZmxhZ3M6IHtcblx0XHRcdGVuYWJsZUFscGhhOiBmYWxzZSxcblx0XHRcdGxpbWl0RGFya25lc3M6IGZhbHNlLFxuXHRcdFx0bGltaXRHcmF5bmVzczogZmFsc2UsXG5cdFx0XHRsaW1pdExpZ2h0bmVzczogZmFsc2Vcblx0XHR9LFxuXHRcdG5hbWU6ICdVTkJSQU5ERUQgREVGQVVMVCBQQUxFVFRFJyxcblx0XHRzd2F0Y2hlczogMSxcblx0XHR0eXBlOiAnPz8/Jyxcblx0XHR0aW1lc3RhbXA6ICc/Pz8nXG5cdH1cbn07XG5cbmNvbnN0IHVuYnJhbmRlZEl0ZW06IFBhbGV0dGVJdGVtVW5icmFuZGVkID0ge1xuXHRjb2xvcnM6IHtcblx0XHRjbXlrOiB7IGN5YW46IDAsIG1hZ2VudGE6IDAsIHllbGxvdzogMCwga2V5OiAwLCBhbHBoYTogMSB9LFxuXHRcdGhleDogeyBoZXg6ICcjMDAwMDAwRkYnLCBhbHBoYTogJ0ZGJywgbnVtQWxwaGE6IDEgfSxcblx0XHRoc2w6IHsgaHVlOiAwLCBzYXR1cmF0aW9uOiAwLCBsaWdodG5lc3M6IDAsIGFscGhhOiAxIH0sXG5cdFx0aHN2OiB7IGh1ZTogMCwgc2F0dXJhdGlvbjogMCwgdmFsdWU6IDAsIGFscGhhOiAxIH0sXG5cdFx0bGFiOiB7IGw6IDAsIGE6IDAsIGI6IDAsIGFscGhhOiAxIH0sXG5cdFx0cmdiOiB7IHJlZDogMCwgZ3JlZW46IDAsIGJsdWU6IDAsIGFscGhhOiAxIH0sXG5cdFx0eHl6OiB7IHg6IDAsIHk6IDAsIHo6IDAsIGFscGhhOiAxIH1cblx0fSxcblx0Y29sb3JTdHJpbmdzOiB7XG5cdFx0Y215a1N0cmluZzoge1xuXHRcdFx0Y3lhbjogJzAlJyxcblx0XHRcdG1hZ2VudGE6ICcwJScsXG5cdFx0XHR5ZWxsb3c6ICcwJScsXG5cdFx0XHRrZXk6ICcwJScsXG5cdFx0XHRhbHBoYTogJzEnXG5cdFx0fSxcblx0XHRoZXhTdHJpbmc6IHsgaGV4OiAnIzAwMDAwMEZGJywgYWxwaGE6ICdGRicsIG51bUFscGhhOiAnMScgfSxcblx0XHRoc2xTdHJpbmc6IHsgaHVlOiAnMCcsIHNhdHVyYXRpb246ICcwJScsIGxpZ2h0bmVzczogJzAlJywgYWxwaGE6ICcxJyB9LFxuXHRcdGhzdlN0cmluZzogeyBodWU6ICcwJywgc2F0dXJhdGlvbjogJzAlJywgdmFsdWU6ICcwJScsIGFscGhhOiAnMScgfSxcblx0XHRsYWJTdHJpbmc6IHsgbDogJzAnLCBhOiAnMCcsIGI6ICcwJywgYWxwaGE6ICcxJyB9LFxuXHRcdHJnYlN0cmluZzogeyByZWQ6ICcwJywgZ3JlZW46ICcwJywgYmx1ZTogJzAnLCBhbHBoYTogJzEnIH0sXG5cdFx0eHl6U3RyaW5nOiB7IHg6ICcwJywgeTogJzAnLCB6OiAnMCcsIGFscGhhOiAnMScgfVxuXHR9LFxuXHRjc3NTdHJpbmdzOiB7XG5cdFx0Y215a0NTU1N0cmluZzogJ2NteWsoMCUsIDAlLCAwJSwgMTAwJSwgMSknLFxuXHRcdGhleENTU1N0cmluZzogJyMwMDAwMDBGRicsXG5cdFx0aHNsQ1NTU3RyaW5nOiAnaHNsKDAsIDAlLCAwJSwgMCknLFxuXHRcdGhzdkNTU1N0cmluZzogJ2hzdigwLCAwJSwgMCUsIDApJyxcblx0XHRsYWJDU1NTdHJpbmc6ICdsYWIoMCwgMCwgMCwgMCknLFxuXHRcdHJnYkNTU1N0cmluZzogJ3JnYigwLCAwLCAwLCAxKScsXG5cdFx0eHl6Q1NTU3RyaW5nOiAneHl6KDAsIDAsIDAsIDApJ1xuXHR9XG59O1xuXG5jb25zdCB1bmJyYW5kZWRTdG9yZWQ6IFN0b3JlZFBhbGV0dGVVbmJyYW5kZWQgPSB7XG5cdHRhYmxlSUQ6IDEsXG5cdHBhbGV0dGU6IHVuYnJhbmRlZERhdGFcbn07XG5cbmNvbnN0IHBhbGV0dGU6IERlZmF1bHRzRGF0YUludGVyZmFjZVsncGFsZXR0ZSddID0ge1xuXHR1bmJyYW5kZWQ6IHtcblx0XHRkYXRhOiB1bmJyYW5kZWREYXRhLFxuXHRcdGl0ZW06IHVuYnJhbmRlZEl0ZW0sXG5cdFx0c3RvcmVkOiB1bmJyYW5kZWRTdG9yZWRcblx0fVxufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRzOiBEZWZhdWx0c0RhdGFJbnRlcmZhY2UgPSB7XG5cdGNvbG9ycyxcblx0aWRiLFxuXHRwYWxldHRlXG59IGFzIGNvbnN0O1xuIl19