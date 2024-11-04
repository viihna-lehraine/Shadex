function getElement(id) {
    return document.getElementById(id);
}
const adjustSLAmount = 10;
const xyzMaxX = 95.047;
const xyzMaxY = 100;
const xyzMaxZ = 108.883;
const xyzMinX = 0;
const xyzMinY = 0;
const xyzMinZ = 0;
const buttonDebounce = 300;
const inputDebounce = 200;
const applyCustomColorButton = getElement('apply-custom-color-button');
const clearCustomColorButton = getElement('clear-custom-color-button');
const closeHelpMenuButton = getElement('close-help-menu-button');
const closeHistoryMenuButton = getElement('close-history-menu-button');
const closeSubMenuAButton = getElement('close-sub-menu-A-button');
const closeSubMenuBButton = getElement('close-sub-menu-B-button');
const customColorElement = getElement('custom-color');
const customColorToggleButton = getElement('custom-color-toggle-button');
const desaturateButton = getElement('desaturate-button');
const enableAlphaCheckbox = getElement('enable-alpha-checkbox');
const generateButton = getElement('generate-button');
const helpMenu = getElement('help-modal');
const historyMenu = getElement('history-modal');
const limitBrightCheckbox = getElement('limit-light-checkbox');
const limitDarkCheckbox = getElement('limit-dark-checkbox');
const limitGrayCheckbox = getElement('limit-gray-checkbox');
const paletteNumberOptions = getElement('palette-number-options');
const paletteTypeOptions = getElement('palette-type-options');
const popupDivButton = getElement('custom-color-button');
const saturateButton = getElement('saturate-button');
const selectedColorOptions = getElement('selected-color-options');
const showAsCMYKButton = getElement('show-as-cmyk-button');
const showAsHexButton = getElement('show-as-hex-button');
const showAsHSLButton = getElement('show-as-hsl-button');
const showAsHSVButton = getElement('show-as-hsv-button');
const showAsLABButton = getElement('show-as-lab-button');
const showAsRGBButton = getElement('show-as-rgb-button');
const showHelpMenuButton = getElement('help-button');
const showHistoryMenuButton = getElement('show-history-menu-button');
const subMenuA = getElement('sub-menu-menu-A');
const subMenuB = getElement('sub-menu-menu-B');
const subMenuToggleButtonA = getElement('sub-menu-toggle-button-A');
const subMenuToggleButtonB = getElement('sub-menu-toggle-button-B');
const complementaryHueShiftRange = 10;
const diadicLightnessShiftRange = 30;
const diadicSaturationShiftRange = 30;
const hexadicLightnessShiftRange = 30;
const hexadicSaturationShiftRange = 30;
const splitComplementaryLightnessShiftRange = 30;
const splitComplementarySaturationShiftRange = 30;
const tetradicLightnessShiftRange = 30;
const tetradicSaturationShiftRange = 30;
const triadicLightnessShiftRange = 30;
const triadicSaturationShiftRange = 30;
const probabilities = [40, 45, 50, 55, 60, 65, 70];
const weights = [0.1, 0.15, 0.2, 0.3, 0.15, 0.05, 0.05];
const brightnessThreshold = 75;
const darknessThreshold = 25;
const grayThreshold = 20;
const copyButtonTextTimeout = 1000;
const toastTimeout = 3000;
const tooltipTimeout = 1000;
// ***** Constructed Constants *****
const adjustments = {
    adjustSLAmount
};
const boundaries = {
    xyzMaxX,
    xyzMaxY,
    xyzMaxZ,
    xyzMinX,
    xyzMinY,
    xyzMinZ
};
const debounce$1 = {
    buttonDebounce,
    inputDebounce
};
const domElements = {
    applyCustomColorButton,
    clearCustomColorButton,
    closeHelpMenuButton,
    closeHistoryMenuButton,
    closeSubMenuAButton,
    closeSubMenuBButton,
    customColorElement,
    customColorToggleButton,
    desaturateButton,
    enableAlphaCheckbox,
    generateButton,
    helpMenu,
    historyMenu,
    limitBrightCheckbox,
    limitDarkCheckbox,
    limitGrayCheckbox,
    paletteNumberOptions,
    paletteTypeOptions,
    popupDivButton,
    saturateButton,
    selectedColorOptions,
    showAsCMYKButton,
    showAsHexButton,
    showAsHSLButton,
    showAsHSVButton,
    showAsLABButton,
    showAsRGBButton,
    showHelpMenuButton,
    showHistoryMenuButton,
    subMenuA,
    subMenuB,
    subMenuToggleButtonA,
    subMenuToggleButtonB
};
const paletteShiftRanges = {
    complementaryHueShiftRange,
    diadicLightnessShiftRange,
    diadicSaturationShiftRange,
    hexadicLightnessShiftRange,
    hexadicSaturationShiftRange,
    splitComplementaryLightnessShiftRange,
    splitComplementarySaturationShiftRange,
    tetradicLightnessShiftRange,
    tetradicSaturationShiftRange,
    triadicLightnessShiftRange,
    triadicSaturationShiftRange
};
const probabilityConstants = {
    probabilities,
    weights
};
const thresholds = {
    brightnessThreshold,
    darknessThreshold,
    grayThreshold
};
const timeouts = {
    copyButtonTextTimeout,
    toastTimeout,
    tooltipTimeout
};
// **** Master Config Object ****
const config = {
    ...adjustments,
    ...boundaries,
    ...debounce$1,
    ...domElements,
    ...paletteShiftRanges,
    ...probabilityConstants,
    ...thresholds,
    ...timeouts
};

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
function isInRange(value, min, max) {
    return value >= min && value <= max;
}
const core = { clone, debounce, isInRange };

function sanitizeLAB(value) {
    return Math.round(Math.min(Math.max(value, -125), 125));
}
function sanitizePercentage(value) {
    return Math.round(Math.min(Math.max(value, 0), 100));
}
function sanitizeRadial(value) {
    return Math.round(Math.min(Math.max(value, 0), 360)) & 360;
}
function sanitizeRGB(value) {
    return Math.round(Math.min(Math.max(value, 0), 255));
}
function validateColorValues(color) {
    const clonedColor = core.clone(color);
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
            console.error(`Unsupported color format: ${color.format}`);
            return false;
    }
}
const commonUtils = {
    sanitizeLAB,
    sanitizePercentage,
    sanitizeRadial,
    sanitizeRGB,
    validateColorValues
};

const cmyk = {
    value: { cyan: 0, magenta: 0, yellow: 0, key: 0, alpha: 1 },
    format: 'cmyk'
};
const cmykString = {
    value: { cyan: '0%', magenta: '0%', yellow: '0%', key: '0%', alpha: '1' },
    format: 'cmyk'
};
const hex = {
    value: {
        hex: '#000000FF',
        alpha: 'FF',
        numericAlpha: 1
    },
    format: 'hex'
};
const hsl = {
    value: { hue: 0, saturation: 0, lightness: 0, alpha: 1 },
    format: 'hsl'
};
const hslString = {
    value: { hue: '0', saturation: '0%', lightness: '0%', alpha: '1' },
    format: 'hsl'
};
const hsv = {
    value: { hue: 0, saturation: 0, value: 0, alpha: 1 },
    format: 'hsv'
};
const hsvString = {
    value: { hue: '0', saturation: '0%', value: '0%', alpha: '1' },
    format: 'hsv'
};
const lab = {
    value: { l: 0, a: 0, b: 0, alpha: 1 },
    format: 'lab'
};
const labString = {
    value: { l: '0', a: '0', b: '0', alpha: '1' },
    format: 'lab'
};
const rgb = {
    value: { red: 0, green: 0, blue: 0, alpha: 1 },
    format: 'rgb'
};
const rgbString = {
    value: { red: '0', green: '0', blue: '0', alpha: '1' },
    format: 'rgb'
};
const settings = {
    colorSpace: 'hsl',
    lastTableID: 0
};
const sl = {
    value: { saturation: 0, lightness: 0, alpha: 1 },
    format: 'sl'
};
const slString = {
    value: { saturation: '0%', lightness: '0%', alpha: '1' },
    format: 'sl'
};
const sv = {
    value: { saturation: 0, value: 0, alpha: 1 },
    format: 'sv'
};
const svString = {
    value: { saturation: '0%', value: '0%', alpha: '1' },
    format: 'sv'
};
const xyz = {
    value: { x: 0, y: 0, z: 0, alpha: 1 },
    format: 'xyz'
};
const xyzString = {
    value: { x: '0', y: '0', z: '0', alpha: '1' },
    format: 'xyz'
};
const mutation = {
    timestamp: new Date().toISOString(),
    key: 'test_key',
    action: 'update',
    newValue: { value: 'new_value' },
    oldValue: { value: 'old_value' },
    origin: 'test'
};
const paletteData = {
    id: `null-palette-${Date.now()}`,
    items: [],
    flags: {
        enableAlpha: false,
        limitDark: false,
        limitGray: false,
        limitLight: false
    },
    metadata: {
        numBoxes: 5,
        paletteType: 'ERROR',
        customColor: {
            hslColor: hsl,
            convertedColors: {
                cmyk: cmyk.value,
                hex: hex.value,
                hsl: hsl.value,
                hsv: hsv.value,
                lab: lab.value,
                rgb: rgb.value,
                xyz: xyz.value
            }
        }
    }
};
const paletteItem = {
    id: 'fake',
    colors: {
        cmyk: cmyk.value,
        hex: hex.value,
        hsl: hsl.value,
        hsv: hsv.value,
        lab: lab.value,
        rgb: rgb.value,
        xyz: xyz.value
    },
    colorStrings: {
        cmykString: cmykString.value,
        hexString: hex.value,
        hslString: hslString.value,
        hsvString: hsvString.value,
        labString: labString.value,
        rgbString: rgbString.value,
        xyzString: xyzString.value
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
const storedPalette = {
    tableID: 1,
    palette: paletteData
};
const defaults = {
    cmyk,
    cmykString,
    hex,
    hsl,
    hslString,
    hsv,
    hsvString,
    lab,
    labString,
    mutation,
    paletteData,
    paletteItem,
    rgb,
    rgbString,
    settings,
    sl,
    slString,
    storedPalette,
    sv,
    svString,
    xyz,
    xyzString
};

function applyGammaCorrection(value) {
    try {
        return value > 0.0031308
            ? 1.055 * Math.pow(value, 1 / 2.4) - 0.055
            : 12.92 * value;
    }
    catch (error) {
        console.error(`Error applying gamma correction: ${error}`);
        return value;
    }
}
function clampRGB(rgb) {
    if (!commonUtils.validateColorValues(rgb)) {
        console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
        return core.clone(defaults.rgb);
    }
    try {
        return {
            value: {
                red: Math.round(Math.min(Math.max(0, rgb.value.red), 1) * 255),
                green: Math.round(Math.min(Math.max(0, rgb.value.green), 1) * 255),
                blue: Math.round(Math.min(Math.max(0, rgb.value.blue), 1) * 255),
                alpha: parseFloat(Math.min(Math.max(0, rgb.value.alpha), 1).toFixed(2))
            },
            format: 'rgb'
        };
    }
    catch (error) {
        console.error(`Error clamping RGB values: ${error}`);
        return rgb;
    }
}
function hueToRGB(p, q, t) {
    try {
        const clonedP = core.clone(p);
        const clonedQ = core.clone(q);
        let clonedT = core.clone(t);
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
        console.error(`Error converting hue to RGB: ${error}`);
        return 0;
    }
}
function hslAddFormat(value) {
    try {
        if (!commonUtils.validateColorValues({ value: value, format: 'hsl' })) {
            console.error(`Invalid HSL value ${JSON.stringify(value)}`);
            return core.clone(defaults.hsl);
        }
        return { value: value, format: 'hsl' };
    }
    catch (error) {
        console.error(`Error adding HSL format: ${error}`);
        return core.clone(defaults.hsl);
    }
}
const conversionHelpers = {
    applyGammaCorrection,
    clampRGB,
    hslAddFormat,
    hueToRGB
};

// ******** SECTION 1: Robust Type Guards ********
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
function isFormat(format) {
    return (typeof format === 'string' &&
        ['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'sl', 'sv', 'xyz'].includes(format));
}
// ******** SECTIOn 2: Narrower Type Guards ********
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
    return (isColor(value) &&
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
    return (isColor(value) &&
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
    return (isColor(value) &&
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
        return colorStringToColor(color);
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
function addHashToHex(hex) {
    try {
        return hex.value.hex.startsWith('#')
            ? hex
            : {
                value: {
                    hex: `#${hex.value}}`,
                    alpha: hex.value.alpha,
                    numericAlpha: hex.value.numericAlpha
                },
                format: 'hex'
            };
    }
    catch (error) {
        console.error(`addHashToHex error: ${error}`);
        return defaults.hex;
    }
}
function colorStringToColor(colorString) {
    const clonedColor = core.clone(colorString);
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
            throw new Error('Unsupported format for colorStringToColor');
    }
}
function colorToColorString(color) {
    const clonedColor = core.clone(color);
    if (isColorString(clonedColor)) {
        console.log(`Already formatted as color string: ${JSON.stringify(color)}`);
        return clonedColor;
    }
    const newValue = formatPercentageValues(clonedColor.value);
    if (isCMYKColor(clonedColor)) {
        return {
            format: 'cmyk',
            value: newValue
        };
    }
    else if (isHex(clonedColor)) {
        return {
            format: 'hex',
            value: newValue
        };
    }
    else if (isHSLColor(clonedColor)) {
        return {
            format: 'hsl',
            value: newValue
        };
    }
    else if (isHSVColor(clonedColor)) {
        return {
            format: 'hsv',
            value: newValue
        };
    }
    else if (isLAB(clonedColor)) {
        return {
            format: 'lab',
            value: newValue
        };
    }
    else if (isRGB(clonedColor)) {
        return {
            format: 'rgb',
            value: newValue
        };
    }
    else if (isXYZ(clonedColor)) {
        return {
            format: 'xyz',
            value: newValue
        };
    }
    else {
        throw new Error(`Unsupported format: ${clonedColor.format}`);
    }
}
function formatColor(color, asColorString = false, asCSSString = false) {
    const baseColor = core.clone(color);
    let formattedString = undefined;
    if (asColorString) {
        formattedString = colorToColorString(color);
    }
    else if (asCSSString) {
        formattedString = getCSSColorString(color);
    }
    return formattedString !== undefined
        ? { baseColor, formattedString }
        : { baseColor };
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
        throw new Error(`Invalid hex color: ${hex}. Expected format #RRGGBBAA`);
    }
    const alphaHex = hex.slice(-2);
    const alphaDecimal = parseInt(alphaHex, 16);
    return alphaDecimal / 255;
}
function componentToHex(component) {
    try {
        const hex = Math.max(0, Math.min(255, component)).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
    catch (error) {
        console.error(`componentToHex error: ${error}`);
        return '00';
    }
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
                console.error(`Unsupported color format for ${color}`);
                return null;
        }
    }
    catch (error) {
        console.error(`getColorString error: ${error}`);
        return null;
    }
}
function getCSSColorString(color) {
    try {
        switch (color.format) {
            case 'cmyk':
                return `cmyk(${color.value.cyan},${color.value.magenta},${color.value.yellow},${color.value.key}${color.value.alpha})`;
            case 'hex':
                return String(color.value.hex);
            case 'hsl':
                return `hsl(${color.value.hue},${color.value.saturation}%,${color.value.lightness}%,${color.value.alpha})`;
            case 'hsv':
                return `hsv(${color.value.hue},${color.value.saturation}%,${color.value.value}%,${color.value.alpha})`;
            case 'lab':
                return `lab(${color.value.l},${color.value.a},${color.value.b},${color.value.alpha})`;
            case 'rgb':
                return `rgb(${color.value.red},${color.value.green},${color.value.blue},${color.value.alpha})`;
            case 'xyz':
                return `xyz(${color.value.x},${color.value.y},${color.value.z},${color.value.alpha})`;
            default:
                console.error('Unexpected color format');
                return '#FFFFFFFF';
        }
    }
    catch (error) {
        console.error(`getCSSColorString error: ${error}`);
        return '#FFFFFFFF';
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
                    value: { cyan: c, magenta: m, yellow: y, key: k, alpha: a },
                    format: 'cmyk'
                };
            }
            case 'hex':
                const hexValue = value.startsWith('#') ? value : `#${value}`;
                const alpha = hexValue.length === 9 ? hexValue.slice(-2) : 'FF';
                const numericAlpha = hexAlphaToNumericAlpha(alpha);
                return {
                    value: {
                        hex: hexValue,
                        alpha,
                        numericAlpha
                    },
                    format: 'hex'
                };
            case 'hsl': {
                const [h, s, l, a] = parseComponents(value, 4);
                return {
                    value: { hue: h, saturation: s, lightness: l, alpha: a },
                    format: 'hsl'
                };
            }
            case 'hsv': {
                const [h, s, v, a] = parseComponents(value, 4);
                return {
                    value: { hue: h, saturation: s, value: v, alpha: a },
                    format: 'hsv'
                };
            }
            case 'lab': {
                const [l, a, b, alpha] = parseComponents(value, 4);
                return { value: { l, a, b, alpha }, format: 'lab' };
            }
            case 'rgb': {
                const [r, g, b, a] = value.split(',').map(Number);
                return {
                    value: { red: r, green: g, blue: b, alpha: a },
                    format: 'rgb'
                };
            }
            default:
                throw new Error(`Unsupported color format: ${colorSpace}`);
        }
    }
    catch (error) {
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
            throw new Error(`Expected ${count} components.`);
        return components;
    }
    catch (error) {
        console.error(`Error parsing components: ${error}`);
        return [];
    }
}
function parseCustomColor(rawValue) {
    try {
        console.log(`Parsing custom color: ${JSON.stringify(rawValue)}`);
        const match = rawValue.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?,\s*(\d*\.?\d+)\)/);
        if (match) {
            const [, hue, saturation, lightness, alpha] = match;
            return {
                value: {
                    hue: Number(hue),
                    saturation: Number(saturation),
                    lightness: Number(lightness),
                    alpha: Number(alpha)
                },
                format: 'hsl'
            };
        }
        else {
            console.error('Invalid HSL custom color. Expected format: hsl(H, S%, L%, A)');
            return null;
        }
    }
    catch (error) {
        console.error(`parseCustomColor error: ${error}`);
        return null;
    }
}
function parseHexWithAlpha(hexValue) {
    const hex = hexValue.startsWith('#') ? hexValue : `#${hexValue}`;
    const alpha = hex.length === 9 ? hex.slice(-2) : 'FF';
    const numericAlpha = hexAlphaToNumericAlpha(alpha);
    return { hex, alpha, numericAlpha };
}
function stripHashFromHex(hex) {
    try {
        const hexString = `${hex.value.hex}${hex.value.alpha}`;
        return hex.value.hex.startsWith('#')
            ? {
                value: {
                    hex: hexString.slice(1),
                    alpha: hex.value.alpha,
                    numericAlpha: hexAlphaToNumericAlpha(hex.value.alpha)
                },
                format: 'hex'
            }
            : hex;
    }
    catch (error) {
        console.error(`stripHashFromHex error: ${error}`);
        return core.clone(defaults.hex);
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
const colorUtils = {
    addHashToHex,
    colorStringToColor,
    colorToColorString,
    componentToHex,
    ensureHash,
    formatColor,
    formatPercentageValues,
    getAlphaFromHex,
    getColorString,
    getCSSColorString,
    hexAlphaToNumericAlpha,
    isCMYKColor,
    isCMYKFormat,
    isCMYKString,
    isColor,
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
    parseCustomColor,
    parseHexWithAlpha,
    stripHashFromHex,
    stripPercentFromValues,
    toHexWithAlpha
};

function cmykToHSL(cmyk) {
    try {
        if (!commonUtils.validateColorValues(cmyk)) {
            console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);
            return core.clone(defaults.hsl);
        }
        return rgbToHSL(cmykToRGB(core.clone(cmyk)));
    }
    catch (error) {
        console.error(`cmykToHSL() error: ${error}`);
        return core.clone(defaults.hsl);
    }
}
function cmykToRGB(cmyk) {
    try {
        if (!commonUtils.validateColorValues(cmyk)) {
            console.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`);
            return core.clone(defaults.rgb);
        }
        const clonedCMYK = core.clone(cmyk);
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
            value: { red: r, green: g, blue: b, alpha },
            format: 'rgb'
        };
        return conversionHelpers.clampRGB(rgb);
    }
    catch (error) {
        console.error(`cmykToRGB error: ${error}`);
        return core.clone(defaults.rgb);
    }
}
function hexToHSL(hex) {
    try {
        if (!commonUtils.validateColorValues(hex)) {
            console.error(`Invalid Hex value ${JSON.stringify(hex)}`);
            return core.clone(defaults.hsl);
        }
        return rgbToHSL(hexToRGB(core.clone(hex)));
    }
    catch (error) {
        console.error(`hexToHSL() error: ${error}`);
        return core.clone(defaults.hsl);
    }
}
function hexToRGB(hex) {
    try {
        if (!commonUtils.validateColorValues(hex)) {
            console.error(`Invalid Hex value ${JSON.stringify(hex)}`);
            return core.clone(defaults.rgb);
        }
        const clonedHex = core.clone(hex);
        const strippedHex = colorUtils.stripHashFromHex(clonedHex).value.hex;
        const bigint = parseInt(strippedHex, 16);
        return {
            value: {
                red: (bigint >> 16) & 255,
                green: (bigint >> 8) & 255,
                blue: bigint & 255,
                alpha: hex.value.numericAlpha
            },
            format: 'rgb'
        };
    }
    catch (error) {
        console.error(`hexToRGB error: ${error}`);
        return core.clone(defaults.rgb);
    }
}
function hslToCMYK(hsl) {
    try {
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.cmyk);
        }
        return rgbToCMYK(hslToRGB(core.clone(hsl)));
    }
    catch (error) {
        console.error(`Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`);
        return core.clone(defaults.cmyk);
    }
}
function hslToHex(hsl) {
    try {
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.hex);
        }
        return rgbToHex(hslToRGB(core.clone(hsl)));
    }
    catch (error) {
        console.warn(`hslToHex error: ${error}`);
        return core.clone(defaults.hex);
    }
}
function hslToHSV(hsl) {
    try {
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.hsv);
        }
        const clonedHSL = core.clone(hsl);
        const s = clonedHSL.value.saturation / 100;
        const l = clonedHSL.value.lightness / 100;
        const value = l + s * Math.min(l, 1 - 1);
        const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);
        return {
            value: {
                hue: Math.round(clonedHSL.value.hue),
                saturation: Math.round(newSaturation * 100),
                value: Math.round(value * 100),
                alpha: hsl.value.alpha
            },
            format: 'hsv'
        };
    }
    catch (error) {
        console.error(`hslToHSV() error: ${error}`);
        return core.clone(defaults.hsv);
    }
}
function hslToLAB(hsl) {
    try {
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.lab);
        }
        return xyzToLAB(rgbToXYZ(hslToRGB(core.clone(hsl))));
    }
    catch (error) {
        console.error(`hslToLab() error: ${error}`);
        return core.clone(defaults.lab);
    }
}
function hslToRGB(hsl) {
    try {
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.rgb);
        }
        const clonedHSL = core.clone(hsl);
        const s = clonedHSL.value.saturation / 100;
        const l = clonedHSL.value.lightness / 100;
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        return {
            value: {
                red: Math.round(conversionHelpers.hueToRGB(p, q, clonedHSL.value.hue + 1 / 3) * 255),
                green: Math.round(conversionHelpers.hueToRGB(p, q, clonedHSL.value.hue) * 255),
                blue: Math.round(conversionHelpers.hueToRGB(p, q, clonedHSL.value.hue - 1 / 3) * 255),
                alpha: hsl.value.alpha
            },
            format: 'rgb'
        };
    }
    catch (error) {
        console.error(`hslToRGB error: ${error}`);
        return core.clone(defaults.rgb);
    }
}
function hslToSL(hsl) {
    try {
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.sl);
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
        console.error(`Error converting HSL to SL: ${error}`);
        return defaults.sl;
    }
}
function hslToSV(hsl) {
    try {
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.sv);
        }
        return hsvToSV(rgbToHSV(hslToRGB(core.clone(hsl))));
    }
    catch (error) {
        console.error(`Error converting HSL to SV: ${error}`);
        return defaults.sv;
    }
}
function hslToXYZ(hsl) {
    try {
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.xyz);
        }
        return labToXYZ(hslToLAB(core.clone(hsl)));
    }
    catch (error) {
        console.error(`hslToXYZ error: ${error}`);
        return core.clone(defaults.xyz);
    }
}
function hsvToHSL(hsv) {
    try {
        if (!commonUtils.validateColorValues(hsv)) {
            console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);
            return core.clone(defaults.hsl);
        }
        const clonedHSV = core.clone(hsv);
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
                hue: Math.round(clonedHSV.value.hue),
                saturation: Math.round(newSaturation * 100),
                lightness: Math.round(lightness),
                alpha: hsv.value.alpha
            },
            format: 'hsl'
        };
    }
    catch (error) {
        console.error(`hsvToHSL() error: ${error}`);
        return core.clone(defaults.hsl);
    }
}
function hsvToSV(hsv) {
    try {
        if (!commonUtils.validateColorValues(hsv)) {
            console.error(`Invalid HSV value ${JSON.stringify(hsv)}`);
            return core.clone(defaults.sv);
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
        console.error(`Error converting HSV to SV: ${error}`);
        return defaults.sv;
    }
}
function labToHSL(lab) {
    try {
        if (!commonUtils.validateColorValues(lab)) {
            console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaults.hsl);
        }
        return rgbToHSL(labToRGB(core.clone(lab)));
    }
    catch (error) {
        console.error(`labToHSL() error: ${error}`);
        return core.clone(defaults.hsl);
    }
}
function labToRGB(lab) {
    try {
        if (!commonUtils.validateColorValues(lab)) {
            console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaults.rgb);
        }
        return xyzToRGB(labToXYZ(core.clone(lab)));
    }
    catch (error) {
        console.error(`labToRGB error: ${error}`);
        return core.clone(defaults.rgb);
    }
}
function labToXYZ(lab) {
    try {
        if (!commonUtils.validateColorValues(lab)) {
            console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaults.xyz);
        }
        const clonedLAB = core.clone(lab);
        const refX = 95.047, refY = 100.0, refZ = 108.883;
        let y = (clonedLAB.value.l + 16) / 116;
        let x = clonedLAB.value.a / 500 + y;
        let z = y - clonedLAB.value.b / 200;
        const pow = Math.pow;
        return {
            value: {
                x: refX *
                    (pow(x, 3) > 0.008856 ? pow(x, 3) : (x - 16 / 116) / 7.787),
                y: refY *
                    (pow(y, 3) > 0.008856 ? pow(y, 3) : (y - 16 / 116) / 7.787),
                z: refZ *
                    (pow(z, 3) > 0.008856 ? pow(z, 3) : (z - 16 / 116) / 7.787),
                alpha: lab.value.alpha
            },
            format: 'xyz'
        };
    }
    catch (error) {
        console.error(`labToXYZ error: ${error}`);
        return core.clone(defaults.xyz);
    }
}
function rgbToCMYK(rgb) {
    try {
        if (!commonUtils.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.cmyk);
        }
        const clonedRGB = core.clone(rgb);
        const redPrime = clonedRGB.value.red / 255;
        const greenPrime = clonedRGB.value.green / 255;
        const bluePrime = clonedRGB.value.blue / 255;
        const key = commonUtils.sanitizePercentage(1 - Math.max(redPrime, greenPrime, bluePrime));
        const cyan = commonUtils.sanitizePercentage((1 - redPrime - key) / (1 - key) || 0);
        const magenta = commonUtils.sanitizePercentage((1 - greenPrime - key) / (1 - key) || 0);
        const yellow = commonUtils.sanitizePercentage((1 - bluePrime - key) / (1 - key) || 0);
        const alpha = rgb.value.alpha;
        const format = 'cmyk';
        const cmyk = { value: { cyan, magenta, yellow, key, alpha }, format };
        console.log(`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(core.clone(cmyk))}`);
        return cmyk;
    }
    catch (error) {
        console.error(`Error converting RGB to CMYK: ${error}`);
        return core.clone(defaults.cmyk);
    }
}
function rgbToHex(rgb) {
    try {
        if (!commonUtils.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.hex);
        }
        const clonedRGB = core.clone(rgb);
        if ([
            clonedRGB.value.red,
            clonedRGB.value.green,
            clonedRGB.value.blue
        ].some(v => isNaN(v) || v < 0 || v > 255) ||
            [clonedRGB.value.alpha].some(v => isNaN(v) || v < 0 || v > 1)) {
            console.warn(`Invalid RGB values: R=${JSON.stringify(clonedRGB.value.red)}, G=${JSON.stringify(clonedRGB.value.green)}, B=${JSON.stringify(clonedRGB.value.blue)}, A=${JSON.stringify(clonedRGB.value.alpha)}`);
            return {
                value: {
                    hex: '#000000FF',
                    alpha: 'FF',
                    numericAlpha: 1
                },
                format: 'hex'
            };
        }
        return {
            value: {
                hex: `#${colorUtils.componentToHex(clonedRGB.value.red)}${colorUtils.componentToHex(clonedRGB.value.green)}${colorUtils.componentToHex(clonedRGB.value.blue)}`,
                alpha: colorUtils.componentToHex(clonedRGB.value.alpha),
                numericAlpha: clonedRGB.value.alpha
            },
            format: 'hex'
        };
    }
    catch (error) {
        console.warn(`rgbToHex error: ${error}`);
        return core.clone(defaults.hex);
    }
}
function rgbToHSL(rgb) {
    try {
        if (!commonUtils.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.hsl);
        }
        const clonedRGB = core.clone(rgb);
        clonedRGB.value.red /= 255;
        clonedRGB.value.green /= 255;
        clonedRGB.value.blue /= 255;
        const max = Math.max(clonedRGB.value.red, clonedRGB.value.green, clonedRGB.value.blue);
        const min = Math.min(clonedRGB.value.red, clonedRGB.value.green, clonedRGB.value.blue);
        let hue = 0, saturation = 0, lightness = (max + min) / 2;
        if (max !== min) {
            const delta = max - min;
            saturation =
                lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
            switch (max) {
                case clonedRGB.value.red:
                    hue =
                        (clonedRGB.value.green - clonedRGB.value.blue) / delta +
                            (clonedRGB.value.green < clonedRGB.value.blue ? 6 : 0);
                    break;
                case clonedRGB.value.green:
                    hue =
                        (clonedRGB.value.blue - clonedRGB.value.red) / delta +
                            2;
                    break;
                case clonedRGB.value.blue:
                    hue =
                        (clonedRGB.value.red - clonedRGB.value.green) / delta +
                            4;
                    break;
            }
            hue *= 60;
        }
        return {
            value: {
                hue: Math.round(hue),
                saturation: Math.round(saturation * 100),
                lightness: Math.round(lightness * 100),
                alpha: rgb.value.alpha
            },
            format: 'hsl'
        };
    }
    catch (error) {
        console.error(`rgbToHSL() error: ${error}`);
        return core.clone(defaults.hsl);
    }
}
function rgbToHSV(rgb) {
    try {
        if (!commonUtils.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.hsv);
        }
        const clonedRGB = core.clone(rgb);
        clonedRGB.value.red /= 255;
        clonedRGB.value.green /= 255;
        clonedRGB.value.blue /= 255;
        const max = Math.max(clonedRGB.value.red, clonedRGB.value.green, clonedRGB.value.blue);
        const min = Math.min(clonedRGB.value.red, clonedRGB.value.green, clonedRGB.value.blue);
        const delta = max - min;
        let hue = 0;
        const value = max;
        const saturation = max === 0 ? 0 : delta / max;
        if (max !== min) {
            switch (max) {
                case clonedRGB.value.red:
                    hue =
                        (clonedRGB.value.green - clonedRGB.value.blue) / delta +
                            (clonedRGB.value.green < clonedRGB.value.blue ? 6 : 0);
                    break;
                case clonedRGB.value.green:
                    hue =
                        (clonedRGB.value.blue - clonedRGB.value.red) / delta +
                            2;
                    break;
                case clonedRGB.value.blue:
                    hue =
                        (clonedRGB.value.red - clonedRGB.value.green) / delta +
                            4;
                    break;
            }
            hue *= 60;
        }
        return {
            value: {
                hue: Math.round(hue),
                saturation: Math.round(saturation * 100),
                value: Math.round(value * 100),
                alpha: rgb.value.alpha
            },
            format: 'hsv'
        };
    }
    catch (error) {
        console.error(`rgbToHSV() error: ${error}`);
        return core.clone(defaults.hsv);
    }
}
function rgbToXYZ(rgb) {
    try {
        if (!commonUtils.validateColorValues(rgb)) {
            console.error(`Invalid RGB value ${JSON.stringify(rgb)}`);
            return core.clone(defaults.xyz);
        }
        const clonedRGB = core.clone(rgb);
        clonedRGB.value.red = clonedRGB.value.red / 255;
        clonedRGB.value.green = clonedRGB.value.green / 255;
        clonedRGB.value.blue = clonedRGB.value.blue / 255;
        clonedRGB.value.red =
            clonedRGB.value.red > 0.04045
                ? Math.pow((clonedRGB.value.red + 0.055) / 1.055, 2.4)
                : clonedRGB.value.red / 12.92;
        clonedRGB.value.green =
            clonedRGB.value.green > 0.04045
                ? Math.pow((clonedRGB.value.green + 0.055) / 1.055, 2.4)
                : clonedRGB.value.green / 12.92;
        clonedRGB.value.blue =
            clonedRGB.value.blue > 0.04045
                ? Math.pow((clonedRGB.value.blue + 0.055) / 1.055, 2.4)
                : clonedRGB.value.blue / 12.92;
        clonedRGB.value.red = clonedRGB.value.red * 100;
        clonedRGB.value.green = clonedRGB.value.green * 100;
        clonedRGB.value.blue = clonedRGB.value.blue * 100;
        return {
            value: {
                x: clonedRGB.value.red * 0.4124 +
                    clonedRGB.value.green * 0.3576 +
                    clonedRGB.value.blue * 0.1805,
                y: clonedRGB.value.red * 0.2126 +
                    clonedRGB.value.green * 0.7152 +
                    clonedRGB.value.blue * 0.0722,
                z: clonedRGB.value.red * 0.0193 +
                    clonedRGB.value.green * 0.1192 +
                    clonedRGB.value.blue * 0.9505,
                alpha: rgb.value.alpha
            },
            format: 'xyz'
        };
    }
    catch (error) {
        console.error(`rgbToXYZ error: ${error}`);
        return core.clone(defaults.xyz);
    }
}
function xyzToLAB(xyz) {
    try {
        if (!commonUtils.validateColorValues(xyz)) {
            console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaults.lab);
        }
        const clonedXYZ = core.clone(xyz);
        const refX = 95.047, refY = 100.0, refZ = 108.883;
        clonedXYZ.value.x = clonedXYZ.value.x / refX;
        clonedXYZ.value.y = clonedXYZ.value.y / refY;
        clonedXYZ.value.z = clonedXYZ.value.z / refZ;
        clonedXYZ.value.x =
            clonedXYZ.value.x > 0.008856
                ? Math.pow(clonedXYZ.value.x, 1 / 3)
                : 7.787 * clonedXYZ.value.x + 16 / 116;
        clonedXYZ.value.y =
            clonedXYZ.value.y > 0.008856
                ? Math.pow(clonedXYZ.value.y, 1 / 3)
                : 7.787 * clonedXYZ.value.y + 16 / 116;
        clonedXYZ.value.z =
            clonedXYZ.value.z > 0.008856
                ? Math.pow(clonedXYZ.value.z, 1 / 3)
                : 7.787 * clonedXYZ.value.z + 16 / 116;
        const l = commonUtils.sanitizePercentage(parseFloat((116 * clonedXYZ.value.y - 16).toFixed(2)));
        const a = commonUtils.sanitizeLAB(parseFloat((500 * (clonedXYZ.value.x - clonedXYZ.value.y)).toFixed(2)));
        const b = commonUtils.sanitizeLAB(parseFloat((200 * (clonedXYZ.value.y - clonedXYZ.value.z)).toFixed(2)));
        const lab = {
            value: { l, a, b, alpha: xyz.value.alpha },
            format: 'lab'
        };
        if (!commonUtils.validateColorValues(lab)) {
            console.error(`Invalid LAB value ${JSON.stringify(lab)}`);
            return core.clone(defaults.lab);
        }
        return lab;
    }
    catch (error) {
        console.error(`xyzToLab() error: ${error}`);
        return core.clone(defaults.lab);
    }
}
function xyzToHSL(xyz) {
    try {
        if (!commonUtils.validateColorValues(xyz)) {
            console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaults.hsl);
        }
        return rgbToHSL(xyzToRGB(core.clone(xyz)));
    }
    catch (error) {
        console.error(`xyzToHSL() error: ${error}`);
        return core.clone(defaults.hsl);
    }
}
function xyzToRGB(xyz) {
    try {
        if (!commonUtils.validateColorValues(xyz)) {
            console.error(`Invalid XYZ value ${JSON.stringify(xyz)}`);
            return core.clone(defaults.rgb);
        }
        const clonedXYZ = core.clone(xyz);
        clonedXYZ.value.x /= 100;
        clonedXYZ.value.y /= 100;
        clonedXYZ.value.z /= 100;
        let red = clonedXYZ.value.x * 3.2406 +
            clonedXYZ.value.y * -1.5372 +
            clonedXYZ.value.z * -0.4986;
        let green = clonedXYZ.value.x * -0.9689 +
            clonedXYZ.value.y * 1.8758 +
            clonedXYZ.value.z * 0.0415;
        let blue = clonedXYZ.value.x * 0.0557 +
            clonedXYZ.value.y * -0.204 +
            clonedXYZ.value.z * 1.057;
        red = conversionHelpers.applyGammaCorrection(red);
        green = conversionHelpers.applyGammaCorrection(green);
        blue = conversionHelpers.applyGammaCorrection(blue);
        return conversionHelpers.clampRGB({
            value: { red, green, blue, alpha: xyz.value.alpha },
            format: 'rgb'
        });
    }
    catch (error) {
        console.error(`xyzToRGB error: ${error}`);
        return core.clone(defaults.rgb);
    }
}
const convert = {
    cmykToHSL,
    hexToHSL,
    hslToCMYK,
    hslToHex,
    hslToHSV,
    hslToLAB,
    hslToRGB,
    hslToSL,
    hslToSV,
    hslToXYZ,
    hsvToHSL,
    hsvToSV,
    labToHSL,
    labToXYZ,
    rgbToCMYK,
    rgbToHex,
    rgbToHSL,
    rgbToHSV,
    rgbToXYZ,
    xyzToHSL,
    xyzToLAB
};
function toHSL(color) {
    try {
        if (!commonUtils.validateColorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return core.clone(defaults.hsl);
        }
        const clonedColor = core.clone(color);
        switch (color.format) {
            case 'cmyk':
                return cmykToHSL(clonedColor);
            case 'hex':
                return hexToHSL(clonedColor);
            case 'hsl':
                return core.clone(clonedColor);
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

function getConversionFn(from, to) {
    try {
        const fnName = `${from}To${to[0].toUpperCase() + to.slice(1)}`;
        if (!(fnName in convert))
            return undefined;
        const conversionFn = convert[fnName];
        return (value) => structuredClone(conversionFn(value));
    }
    catch (error) {
        console.error(`Error getting conversion function: ${error}`);
        return undefined;
    }
}
function genAllColorValues(color) {
    const result = {};
    try {
        const clonedColor = core.clone(color);
        if (!commonUtils.validateColorValues(clonedColor)) {
            console.error(`Invalid color: ${JSON.stringify(clonedColor)}`);
            return {};
        }
        result.cmyk = convert.hslToCMYK(clonedColor);
        result.hex = convert.hslToHex(clonedColor);
        result.hsl = clonedColor;
        result.hsv = convert.hslToHSV(clonedColor);
        result.lab = convert.hslToLAB(clonedColor);
        result.rgb = convert.hslToRGB(clonedColor);
        result.sl = convert.hslToSL(clonedColor);
        result.sv = convert.hslToSV(clonedColor);
        result.xyz = convert.hslToXYZ(clonedColor);
        return result;
    }
    catch (error) {
        console.error(`Error generating all color values: ${error}`);
        return {};
    }
}

let dragSrcEl = null;
function attachDragAndDropEventListeners(element) {
    try {
        if (element) {
            element.addEventListener('dragstart', dragAndDrop.handleDragStart);
            element.addEventListener('dragover', dragAndDrop.handleDragOver);
            element.addEventListener('drop', dragAndDrop.handleDrop);
            element.addEventListener('dragend', dragAndDrop.handleDragEnd);
        }
        console.log('Drag and drop event listeners successfully attached');
    }
    catch (error) {
        console.error(`Failed to execute attachDragAndDropEventListeners: ${error}`);
    }
}
function handleDragStart(e) {
    try {
        dragSrcEl = e.currentTarget;
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', dragSrcEl.outerHTML);
        }
        console.log('handleDragStart complete');
    }
    catch (error) {
        console.error(`Error in handleDragStart: ${error}`);
    }
}
function handleDragOver(e) {
    try {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }
        console.log('handleDragOver complete');
        return false;
    }
    catch (error) {
        console.error(`Error in handleDragOver: ${error}`);
        return false;
    }
}
function handleDragEnd(e) {
    try {
        const target = e.currentTarget;
        target.classList.remove('dragging');
        document.querySelectorAll('.color-stripe').forEach(el => {
            el.classList.remove('dragging');
        });
        console.log('handleDragEnd complete');
    }
    catch (error) {
        console.error(`Error in handleDragEnd: ${error}`);
    }
}
function handleDrop(e) {
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
            console.log('calling attachDragAndDropEventListeners for new elements');
            attachDragAndDropEventListeners(newDragSrcEl);
            attachDragAndDropEventListeners(newDropTargetEl);
        }
        console.log('handleDrop complete');
    }
    catch (error) {
        console.error(`Error in handleDrop: ${error}`);
    }
}
const dragAndDrop = {
    attachDragAndDropEventListeners,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    handleDrop
};

function makePaletteBox(color, paletteBoxCount) {
    try {
        if (!commonUtils.validateColorValues(color)) {
            console.error(`Invalid ${color.format} color value ${JSON.stringify(color)}`);
            return {
                colorStripe: document.createElement('div'),
                paletteBoxCount
            };
        }
        const clonedColor = core.clone(color);
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
        const colorString = colorUtils.getCSSColorString(clonedColor);
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
                domHelpers.showTooltip(colorTextOutputBox);
                clearTimeout(config.tooltipTimeout || 1000);
                copyButton.textContent = 'Copied!';
                setTimeout(() => (copyButton.textContent = 'Copy'), config.copyButtonTextTimeout || 1000);
            }
            catch (error) {
                console.error(`Failed to copy: ${error}`);
            }
        });
        colorTextOutputBox.addEventListener('input', core.debounce((e) => {
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
        }, config.inputDebounce || 200));
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
        dragAndDrop.attachDragAndDropEventListeners(colorStripe);
        colorStripe.appendChild(paletteBox);
        return {
            colorStripe,
            paletteBoxCount: paletteBoxCount + 1
        };
    }
    catch (error) {
        console.error(`Failed to execute makePaletteBox: ${error}`);
        return {
            colorStripe: document.createElement('div'),
            paletteBoxCount
        };
    }
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
            }, config.tooltipTimeout || 1000);
        }
        console.log('showTooltip executed');
    }
    catch (error) {
        console.error(`Failed to execute showTooltip: ${error}`);
    }
}
const domHelpers = {
    makePaletteBox,
    showTooltip
};

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('transitioned', () => toast.remove());
    }, config.toastTimeout || 3000);
}
const notification = {
    showToast
};

function isColorInBounds(hsl) {
    if (!commonUtils.validateColorValues(hsl)) {
        console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
        return false;
    }
    return isTooGray(hsl) || isTooDark(hsl) || isTooBright(hsl);
}
function isTooBright(hsl) {
    if (!commonUtils.validateColorValues(hsl)) {
        console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
        return false;
    }
    return core.clone(hsl).value.lightness > config.brightnessThreshold;
}
function isTooDark(hsl) {
    if (!commonUtils.validateColorValues(hsl)) {
        console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
        return false;
    }
    return core.clone(hsl).value.lightness < config.darknessThreshold;
}
function isTooGray(hsl) {
    if (!commonUtils.validateColorValues(hsl)) {
        console.error(`Invalid HSL value ${JSON.stringify(hsl)}`);
        return false;
    }
    return core.clone(hsl).value.saturation < config.grayThreshold;
}
const limits = {
    isColorInBounds,
    isTooBright,
    isTooDark,
    isTooGray
};

function adjustSL(color) {
    try {
        if (!commonUtils.validateColorValues(color)) {
            console.error('Invalid color valus for adjustment.');
            notification.showToast('Invalid color values');
            return color;
        }
        const adjustedSaturation = Math.min(Math.max(color.value.saturation + config.adjustSLAmount, 0), 100);
        const adjustedLightness = Math.min(100);
        return {
            value: {
                hue: color.value.hue,
                saturation: adjustedSaturation,
                lightness: adjustedLightness,
                alpha: color.value.alpha
            },
            format: 'hsl'
        };
    }
    catch (error) {
        console.error(`Error adjusting saturation and lightness: ${error}`);
        return color;
    }
}
function getWeightedRandomInterval() {
    try {
        const weights = config.weights;
        const probabilities = config.probabilities;
        const cumulativeProbabilities = probabilities.reduce((acc, prob, i) => {
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
        console.error(`Error generating weighted random interval: ${error}`);
        return 50;
    }
}
function hexToHSLWrapper(input) {
    try {
        const clonedInput = core.clone(input);
        const hex = typeof clonedInput === 'string'
            ? {
                value: {
                    hex: clonedInput,
                    alpha: clonedInput.slice(-2),
                    numericAlpha: colorUtils.hexAlphaToNumericAlpha(clonedInput.slice(-2))
                },
                format: 'hex'
            }
            : {
                ...clonedInput,
                value: {
                    ...clonedInput.value,
                    numericAlpha: colorUtils.hexAlphaToNumericAlpha(clonedInput.value.alpha)
                }
            };
        return convert.hexToHSL(hex);
    }
    catch (error) {
        console.error(`Error converting hex to HSL: ${error}`);
        return defaults.hsl;
    }
}
const paletteHelpers = {
    adjustSL,
    getWeightedRandomInterval,
    hexToHSLWrapper
};

function analogous(color, numBoxes) {
    try {
        if (!commonUtils.validateColorValues(color)) {
            console.error(`Invalid color value ${JSON.stringify(color)}`);
            return [];
        }
        const clonedColor = core.clone(color);
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
        console.error(`Error generating analogous hues: ${error}`);
        return [];
    }
}
function diadic(baseHue) {
    try {
        const clonedBaseHue = core.clone(baseHue);
        const diadicHues = [];
        const randomDistance = paletteHelpers.getWeightedRandomInterval();
        const hue1 = clonedBaseHue;
        const hue2 = (hue1 + randomDistance) % 360;
        diadicHues.push(hue1, hue2);
        return diadicHues;
    }
    catch (error) {
        console.error(`Error generating diadic hues: ${error}`);
        return [];
    }
}
function hexadic(color) {
    try {
        const clonedColor = core.clone(color);
        if (!commonUtils.validateColorValues(clonedColor)) {
            console.error(`Invalid color value ${JSON.stringify(clonedColor)}`);
            return [];
        }
        const clonedBaseHSL = genAllColorValues(clonedColor).hsl;
        if (!clonedBaseHSL) {
            throw new Error('Unable to generate hexadic hues - missing HSL values');
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
        console.error(`Error generating hexadic hues: ${error}`);
        return [];
    }
}
function splitComplementary(baseHue) {
    try {
        const clonedBaseHue = core.clone(baseHue);
        const modifier = Math.floor(Math.random() * 11) + 20;
        return [
            (clonedBaseHue + 180 + modifier) % 360,
            (clonedBaseHue + 180 - modifier + 360) % 360
        ];
    }
    catch (error) {
        console.error(`Error generating split complementary hues: ${error}`);
        return [];
    }
}
function tetradic(baseHue) {
    try {
        const clonedBaseHue = core.clone(baseHue);
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
        console.error(`Error generating tetradic hues: ${error}`);
        return [];
    }
}
function triadic(baseHue) {
    try {
        const clonedBaseHue = core.clone(baseHue);
        return [120, 240].map(increment => (clonedBaseHue + increment) % 360);
    }
    catch (error) {
        console.error(`Error generating triadic hues: ${error}`);
        return [];
    }
}
const genHues = {
    analogous,
    diadic,
    hexadic,
    splitComplementary,
    tetradic,
    triadic
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

function createPaletteObject(type, items, baseColor, numBoxes, paletteID, enableAlpha, limitBright, limitDark, limitGray) {
    return {
        id: `${type}_${paletteID}`,
        items,
        flags: {
            enableAlpha: enableAlpha,
            limitDark: limitDark,
            limitGray: limitGray,
            limitLight: limitBright
        },
        metadata: {
            numBoxes,
            paletteType: type,
            customColor: {
                hslColor: baseColor,
                convertedColors: items[0]?.colors || {}
            }
        }
    };
}
function populateColorTextOutputBox(color, boxNumber) {
    try {
        const clonedColor = colorUtils.isColor(color)
            ? core.clone(color)
            : colorUtils.colorStringToColor(color);
        if (!commonUtils.validateColorValues(clonedColor)) {
            console.error('Invalid color values.');
            notification.showToast('Invalid color values.');
            return;
        }
        const colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);
        if (!colorTextOutputBox)
            return;
        const stringifiedColor = colorUtils.getCSSColorString(clonedColor);
        console.log(`Adding CSS-formatted color to DOM ${stringifiedColor}`);
        colorTextOutputBox.value = stringifiedColor;
        colorTextOutputBox.setAttribute('data-format', color.format);
    }
    catch (error) {
        console.error('Failed to populate color text output box:', error);
        return;
    }
}
const paletteUtils = {
    createPaletteObject,
    populateColorTextOutputBox
};

function createMutationLogger(obj, key) {
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
const dbPromise = openDB('paletteDatabase', 1, {
    upgrade(db) {
        try {
            const stores = [
                'customColor',
                'mutations',
                'settings',
                'tables'
            ];
            stores.forEach(store => {
                if (!db.objectStoreNames.contains(store)) {
                    db.createObjectStore(store, {
                        keyPath: store === 'mutations' ? 'timestamp' : 'key'
                    });
                }
            });
        }
        catch (error) {
            console.error('Error during IndexedDB upgrade:', error);
            throw error;
        }
    }
});
async function getDB() {
    return dbPromise;
}
async function getCurrentPaletteID() {
    const db = await getDB();
    const settings = await db.get('settings', 'appSettings');
    return settings?.lastPaletteID ?? 0;
}
async function getCustomColor() {
    const db = await getDB();
    const entry = await db.get('customColor', 'customColor');
    return entry?.color
        ? createMutationLogger(entry.color, 'customColor')
        : null;
}
function getLoggedObject(obj, key) {
    if (obj) {
        return createMutationLogger(obj, key);
    }
    return null;
}
async function getNextPaletteID() {
    const currentID = await getCurrentPaletteID();
    const newID = currentID + 1;
    await updateCurrentPaletteID(newID);
    return newID;
}
async function getNextTableID() {
    const settings = await getSettings();
    const nextID = settings.lastTableID + 1;
    await saveData('settings', 'appSettings', {
        ...settings,
        lastTableID: nextID
    });
    return `palette_${nextID}`;
}
async function getSettings() {
    try {
        const db = await getDB();
        const settings = await db.get('settings', 'appSettings');
        return settings ?? defaults.settings;
    }
    catch (error) {
        console.error('Error fetching settings:', error);
        return { colorSpace: 'hex', lastTableID: 0 };
    }
}
async function getTable(id) {
    const db = await getDB();
    const result = await db.get('tables', id);
    if (!result)
        console.warn(`Table with ID ${id} not found.`);
    return result;
}
async function getStore(storeName, mode) {
    const db = await getDB();
    return db.transaction(storeName, mode).objectStore(storeName);
}
async function logMutation(log) {
    const db = await getDB();
    await db.put('mutations', log);
    console.log(`Logged mutation: ${JSON.stringify(log)}`);
}
async function renderPalette(tableId) {
    try {
        const storedPalette = await getTable(tableId);
        const paletteRow = document.getElementById('palette-row');
        if (!storedPalette)
            throw new Error(`Palette ${tableId} not found.`);
        if (!paletteRow)
            throw new Error('Palette row element not found.');
        paletteRow.innerHTML = '';
        const fragment = document.createDocumentFragment();
        const table = document.createElement('table');
        table.classList.add('palette-table');
        storedPalette.palette.items.forEach((item, index) => {
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
        paletteRow.appendChild(fragment);
        console.log(`Rendered palette ${tableId}.`);
    }
    catch (error) {
        console.error(`Failed to render palette: ${error}`);
    }
}
async function saveData(storeName, key, data, oldValue) {
    try {
        const db = await getDB();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.put({ key, ...data });
        await tx.done;
        console.log(`${key} saved to ${storeName}.`);
        await logMutation({
            timestamp: new Date().toISOString(),
            key,
            action: 'update',
            newValue: data,
            oldValue: oldValue ? oldValue : null,
            origin: 'saveData'
        });
    }
    catch (error) {
        console.error(`Failed to save data to ${storeName}:`, error);
        throw error;
    }
}
async function savePalette(id, newPalette) {
    try {
        const store = await getStore('tables', 'readwrite');
        const paletteToSave = {
            tableID: newPalette.tableID,
            palette: newPalette.palette
        };
        await store.put({ key: id, ...paletteToSave });
        console.log(`Palette ${id} saved successfully.`);
    }
    catch (error) {
        console.error(`Failed to save palette ${id}: ${error}`);
        throw error;
    }
}
async function savePaletteToDB(type, items, baseColor, numBoxes, enableAlpha, limitBright, limitDark, limitGray) {
    const paletteID = await getNextPaletteID();
    const newPalette = paletteUtils.createPaletteObject(type, items, baseColor, paletteID, numBoxes, enableAlpha, limitBright, limitDark, limitGray);
    await savePalette(newPalette.id, {
        tableID: parseInt(newPalette.id.split('_')[1]),
        palette: newPalette
    });
    console.log(`Saved ${type} palette: ${JSON.stringify(newPalette)}`);
    return newPalette;
}
async function saveSettings(newSettings) {
    try {
        await saveData('settings', 'appSettings', newSettings);
        console.log('Settings updated');
    }
    catch (error) {
        console.error(`Failed to save settings: ${error}`);
        throw error;
    }
}
async function trackedTransaction(storeName, mode, callback) {
    const db = await getDB();
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    try {
        await callback(store);
        await tx.done;
        console.log(`Transaction on ${storeName} completed.`);
    }
    catch (error) {
        console.error(`Transaction on ${storeName} failed: ${error}`);
        throw error;
    }
}
async function updateCurrentPaletteID(newID) {
    const db = await getDB();
    const tx = db.transaction('settings', 'readwrite');
    const store = tx.objectStore('settings');
    await store.put({ key: 'appSettings', lastPaletteID: newID });
    await tx.done;
    console.log(`Current palette ID updated to ${newID}`);
}
async function updateEntryInPalette(tableID, entryIndex, newEntry) {
    try {
        const storedPalette = await getTable(tableID);
        if (!storedPalette)
            throw new Error(`Palette ${tableID} not found.`);
        const { items } = storedPalette.palette;
        if (entryIndex >= items.length)
            throw new Error(`Entry ${entryIndex} not found in palette ${tableID}.`);
        const oldEntry = items[entryIndex];
        items[entryIndex] = newEntry;
        await saveData('tables', tableID, storedPalette);
        await logMutation({
            timestamp: new Date().toISOString(),
            key: `${tableID}-${entryIndex}]`,
            action: 'update',
            newValue: newEntry,
            oldValue: oldEntry,
            origin: 'updateEntryInPalette'
        });
        console.log(`Entry ${entryIndex} in palette ${tableID} updated.`);
    }
    catch (error) {
        console.error(`Failed to update entry in palette: ${error}`);
        throw error;
    }
}
const database = {
    createMutationLogger,
    deleteTable: async (id) => {
        const db = await getDB();
        await db.delete('tables', id);
        console.log(`Table ${id} deleted.`);
    },
    getCurrentPaletteID,
    getCustomColor,
    getDB,
    getLoggedObject,
    getNextPaletteID,
    getNextTableID,
    getSettings,
    getStore,
    getTable,
    listTables: async () => {
        const db = await getDB();
        const keys = await db.getAllKeys('tables');
        return keys.map(String);
    },
    logMutation,
    renderPalette,
    saveData,
    savePalette,
    savePaletteToDB,
    saveSettings,
    trackedTransaction,
    updateCurrentPaletteID,
    updateEntryInPalette
};

function randomHSL(enableAlpha) {
    try {
        const alpha = enableAlpha ? Math.random() : 1;
        const hsl = {
            value: {
                hue: commonUtils.sanitizeRadial(Math.floor(Math.random() * 360)),
                saturation: commonUtils.sanitizePercentage(Math.floor(Math.random() * 101)),
                lightness: commonUtils.sanitizePercentage(Math.floor(Math.random() * 101)),
                alpha
            },
            format: 'hsl'
        };
        if (!commonUtils.validateColorValues(hsl)) {
            console.error(`Invalid random HSL color value ${JSON.stringify(hsl)}`);
            return core.clone(defaults.hsl);
        }
        console.log(`Generated randomHSL: ${JSON.stringify(hsl)}`);
        return hsl;
    }
    catch (error) {
        console.error(`Error generating random HSL color: ${error}`);
        return core.clone(defaults.hsl);
    }
}
function randomSL(enableAlpha) {
    try {
        const alpha = enableAlpha ? Math.random() : 1;
        const sl = {
            value: {
                saturation: commonUtils.sanitizePercentage(Math.max(0, Math.min(100, Math.random() * 100))),
                lightness: commonUtils.sanitizePercentage(Math.max(0, Math.min(100, Math.random() * 100))),
                alpha
            },
            format: 'sl'
        };
        if (!commonUtils.validateColorValues(sl)) {
            console.error(`Invalid random SV color value ${JSON.stringify(sl)}`);
            return core.clone(defaults.sl);
        }
        console.log(`Generated randomSL: ${JSON.stringify(sl)}`);
        return sl;
    }
    catch (error) {
        console.error(`Error generating random SL color: ${error}`);
        return core.clone(defaults.sl);
    }
}

async function genPalette() {
    function createPaletteItem(color, enableAlpha) {
        const clonedColor = core.clone(color);
        clonedColor.value.alpha = enableAlpha ? Math.random() : 1;
        return {
            id: `${color.format}_${database.getNextPaletteID()}`,
            colors: {
                cmyk: convert.hslToCMYK(clonedColor).value,
                hex: convert.hslToHex(clonedColor).value,
                hsl: clonedColor.value,
                hsv: convert.hslToHSV(clonedColor).value,
                lab: convert.hslToLAB(clonedColor).value,
                rgb: convert.hslToRGB(clonedColor).value,
                xyz: convert.hslToXYZ(clonedColor).value
            },
            colorStrings: {
                cmykString: colorUtils.colorToColorString(convert.hslToCMYK(clonedColor)).value,
                hexString: colorUtils.colorToColorString(convert.hslToHex(clonedColor)).value,
                hslString: colorUtils.colorToColorString(clonedColor).value,
                hsvString: colorUtils.colorToColorString(convert.hslToHSV(clonedColor)).value,
                labString: colorUtils.colorToColorString(convert.hslToLAB(clonedColor)).value,
                rgbString: colorUtils.colorToColorString(convert.hslToRGB(clonedColor)).value,
                xyzString: colorUtils.colorToColorString(convert.hslToXYZ(clonedColor)).value
            },
            cssStrings: {
                cmykCSSString: colorUtils.getCSSColorString(convert.hslToCMYK(clonedColor)),
                hexCSSString: convert.hslToHex(clonedColor).value.hex,
                hslCSSString: colorUtils.getCSSColorString(clonedColor),
                hsvCSSString: colorUtils.getCSSColorString(convert.hslToHSV(clonedColor)),
                labCSSString: colorUtils.getCSSColorString(convert.hslToLAB(clonedColor)),
                rgbCSSString: colorUtils.getCSSColorString(convert.hslToRGB(clonedColor)),
                xyzCSSString: colorUtils.getCSSColorString(convert.hslToXYZ(clonedColor))
            }
        };
    }
    function generatePaletteItems(baseColor, hues, enableAlpha, limitDark, limitGray, limitBright) {
        const paletteItems = [
            createPaletteItem(baseColor, enableAlpha)
        ];
        hues.forEach((hue, i) => {
            let newColor = null;
            do {
                const sl = randomSL(enableAlpha);
                newColor = genAllColorValues({
                    value: { hue, ...sl.value },
                    format: 'hsl'
                }).hsl;
            } while (newColor &&
                ((limitGray && limits.isTooGray(newColor)) ||
                    (limitDark && limits.isTooDark(newColor)) ||
                    (limitBright && limits.isTooBright(newColor))));
            if (newColor) {
                paletteItems.push(createPaletteItem(newColor, enableAlpha));
                updateColorBox(newColor, i + 1);
            }
        });
        return paletteItems;
    }
    function getBaseColor(customColor, enableAlpha) {
        const color = core.clone(customColor ?? randomHSL(enableAlpha));
        return color;
    }
    function updateColorBox(color, index) {
        const colorBox = document.getElementById(`color-box-${index + 1}`);
        if (colorBox) {
            const colorValues = genAllColorValues(color);
            const selectedColor = colorValues;
            if (selectedColor) {
                const hslColor = colorValues.hsl;
                const hslCSSString = colorUtils.getCSSColorString(hslColor);
                colorBox.style.backgroundColor = hslCSSString;
                paletteUtils.populateColorTextOutputBox(selectedColor, index + 1);
            }
        }
    }
    async function analogous(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray) {
        const currentAnalogousPaletteID = await database.getCurrentPaletteID();
        if (numBoxes < 2) {
            console.warn('Analogous palette requires at least 2 swatches.');
            return paletteUtils.createPaletteObject('analogous', [], defaults.hsl, 0, currentAnalogousPaletteID, enableAlpha, limitBright, limitDark, limitGray);
        }
        const baseColor = getBaseColor(customColor, enableAlpha);
        const hues = genHues.analogous(baseColor, numBoxes);
        const paletteItems = hues.map((hue, i) => {
            const newColor = {
                value: {
                    hue,
                    saturation: Math.min(100, Math.max(0, baseColor.value.saturation +
                        (Math.random() - 0.5) * 10)),
                    lightness: Math.min(100, Math.max(0, baseColor.value.lightness + (i % 2 === 0 ? 5 : -5))),
                    alpha: enableAlpha ? Math.random() : 1
                },
                format: 'hsl'
            };
            return createPaletteItem(newColor, enableAlpha);
        });
        return await database.savePaletteToDB('analogous', paletteItems, baseColor, numBoxes, enableAlpha, limitBright, limitDark, limitGray);
    }
    async function complementary(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray) {
        const currentComplementaryPaletteID = await database.getCurrentPaletteID();
        if (numBoxes < 2) {
            console.warn('Complementary palette requires at least 2 swatches.');
            return paletteUtils.createPaletteObject('complementary', [], defaults.hsl, 0, currentComplementaryPaletteID, enableAlpha, limitBright, limitDark, limitGray);
        }
        const baseColor = getBaseColor(customColor, enableAlpha);
        const complementaryHue = (baseColor.value.hue + 180) % 360;
        const hues = Array.from({ length: numBoxes - 1 }, (_, _i) => (complementaryHue +
            (Math.random() * config.complementaryHueShiftRange -
                config.complementaryHueShiftRange / 2)) %
            360);
        const paletteItems = hues.map((hue, i) => {
            const saturation = Math.min(100, Math.max(0, baseColor.value.saturation + (Math.random() - 0.5) * 15));
            const lightness = Math.min(100, Math.max(0, baseColor.value.lightness + (i % 2 === 0 ? -10 : 10)));
            const alpha = enableAlpha ? Math.random() : 1;
            const newColor = {
                value: { hue, saturation, lightness, alpha },
                format: 'hsl'
            };
            return createPaletteItem(newColor, enableAlpha);
        });
        paletteItems.unshift(createPaletteItem(baseColor, enableAlpha));
        return await database.savePaletteToDB('complementary', paletteItems, baseColor, numBoxes, enableAlpha, limitBright, limitDark, limitGray);
    }
    async function diadic(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray) {
        const currentDiadicPaletteID = await database.getCurrentPaletteID();
        if (numBoxes < 2) {
            console.warn('Diadic palette requires at least 2 swatches.');
            return paletteUtils.createPaletteObject('diadic', [], defaults.hsl, 0, currentDiadicPaletteID, enableAlpha, limitBright, limitDark, limitGray);
        }
        const baseColor = getBaseColor(customColor, enableAlpha);
        const hues = genHues.diadic(baseColor.value.hue);
        const paletteItems = Array.from({ length: numBoxes }, (_, i) => {
            const saturationShift = Math.random() * config.diadicSaturationShiftRange -
                config.diadicSaturationShiftRange / 2;
            const lightnessShift = Math.random() * config.diadicLightnessShiftRange -
                config.diadicLightnessShiftRange / 2;
            const newColor = {
                value: {
                    hue: hues[i % hues.length],
                    saturation: Math.min(100, Math.max(0, baseColor.value.saturation + saturationShift)),
                    lightness: Math.min(100, Math.max(0, baseColor.value.lightness + lightnessShift)),
                    alpha: enableAlpha ? Math.random() : 1
                },
                format: 'hsl'
            };
            return createPaletteItem(newColor, enableAlpha);
        });
        return await database.savePaletteToDB('diadic', paletteItems, baseColor, numBoxes, enableAlpha, limitBright, limitDark, limitGray);
    }
    async function hexadic(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray) {
        const currentHexadicPaletteID = await database.getCurrentPaletteID();
        if (numBoxes < 6) {
            console.warn('Hexadic palette requires at least 6 swatches.');
            return paletteUtils.createPaletteObject('hexadic', [], defaults.hsl, 0, currentHexadicPaletteID, enableAlpha, limitBright, limitDark, limitGray);
        }
        const baseColor = getBaseColor(customColor, enableAlpha);
        const hues = genHues.hexadic(baseColor);
        const paletteItems = hues.map((hue, _i) => {
            const saturationShift = Math.random() * config.hexadicSaturationShiftRange -
                config.hexadicSaturationShiftRange / 2;
            const lightnessShift = Math.random() * config.hexadicLightnessShiftRange -
                config.hexadicLightnessShiftRange / 2;
            const newColor = {
                value: {
                    hue,
                    saturation: Math.min(100, Math.max(0, baseColor.value.saturation + saturationShift)),
                    lightness: Math.min(100, Math.max(0, baseColor.value.lightness + lightnessShift)),
                    alpha: enableAlpha ? Math.random() : 1
                },
                format: 'hsl'
            };
            return createPaletteItem(newColor, enableAlpha);
        });
        return await database.savePaletteToDB('hexadic', paletteItems, baseColor, numBoxes, enableAlpha, limitBright, limitDark, limitGray);
    }
    async function monochromatic(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray) {
        const currentMonochromaticPaletteID = await database.getCurrentPaletteID();
        if (numBoxes < 2) {
            console.warn('Monochromatic palette requires at least 2 swatches.');
            return paletteUtils.createPaletteObject('monochromatic', [], defaults.hsl, 0, currentMonochromaticPaletteID, enableAlpha, limitBright, limitDark, limitGray);
        }
        const baseColor = getBaseColor(customColor, enableAlpha);
        const paletteItems = [
            createPaletteItem(baseColor, enableAlpha)
        ];
        for (let i = 1; i < numBoxes; i++) {
            const hueShift = Math.random() * 10 - 5;
            const newColor = genAllColorValues({
                value: {
                    hue: (baseColor.value.hue + hueShift + 360) % 360,
                    saturation: Math.min(100, Math.max(0, baseColor.value.saturation - i * 5)),
                    lightness: Math.min(100, Math.max(0, baseColor.value.lightness + (i * 10 - 20))),
                    alpha: enableAlpha ? Math.random() : 1
                },
                format: 'hsl'
            }).hsl;
            if (newColor) {
                paletteItems.push(createPaletteItem(newColor, enableAlpha));
            }
        }
        return await database.savePaletteToDB('monochromatic', paletteItems, baseColor, numBoxes, enableAlpha, limitBright, limitDark, limitGray);
    }
    async function random(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray) {
        const baseColor = getBaseColor(customColor, enableAlpha);
        const paletteItems = [
            createPaletteItem(baseColor, enableAlpha)
        ];
        for (let i = 1; i < numBoxes; i++) {
            const randomColor = randomHSL(enableAlpha);
            paletteItems.push(createPaletteItem(randomColor, enableAlpha));
            updateColorBox(randomColor, i);
        }
        return await database.savePaletteToDB('random', paletteItems, baseColor, numBoxes, enableAlpha, limitBright, limitDark, limitGray);
    }
    async function splitComplementary(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray) {
        const currentSplitComplementaryPaletteID = await database.getCurrentPaletteID();
        if (numBoxes < 3) {
            console.warn('Split complementary palette requires at least 3 swatches.');
            return paletteUtils.createPaletteObject('splitComplementary', [], defaults.hsl, 0, currentSplitComplementaryPaletteID, enableAlpha, limitBright, limitDark, limitGray);
        }
        const baseColor = getBaseColor(customColor, enableAlpha);
        const [hue1, hue2] = genHues.splitComplementary(baseColor.value.hue);
        const paletteItems = [
            createPaletteItem(baseColor, enableAlpha),
            ...[hue1, hue2].map((hue, index) => {
                const adjustedHSL = {
                    value: {
                        hue,
                        saturation: Math.max(0, Math.min(baseColor.value.saturation +
                            (index === 0
                                ? -config.splitComplementarySaturationShiftRange
                                : config.splitComplementarySaturationShiftRange), 100)),
                        lightness: Math.max(0, Math.min(baseColor.value.lightness +
                            (index === 0
                                ? -config.splitComplementaryLightnessShiftRange
                                : config.splitComplementaryLightnessShiftRange), 100)),
                        alpha: enableAlpha ? Math.random() : 1
                    },
                    format: 'hsl'
                };
                const adjustedColor = genAllColorValues(adjustedHSL);
                return createPaletteItem(adjustedColor, enableAlpha);
            })
        ];
        return await database.savePaletteToDB('splitComplementary', paletteItems, baseColor, numBoxes, enableAlpha, limitBright, limitDark, limitGray);
    }
    async function tetradic(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray) {
        const currentTetradicPaletteID = await database.getCurrentPaletteID();
        if (numBoxes < 4) {
            console.warn('Tetradic palette requires at least 4 swatches.');
            return paletteUtils.createPaletteObject('tetradic', [], defaults.hsl, 0, currentTetradicPaletteID, enableAlpha, limitBright, limitDark, limitGray);
        }
        const baseColor = getBaseColor(customColor, enableAlpha);
        const tetradicHues = genHues.tetradic(baseColor.value.hue);
        const paletteItems = [
            createPaletteItem(baseColor, enableAlpha),
            ...tetradicHues.map((hue, index) => {
                const adjustedHSL = {
                    value: {
                        hue,
                        saturation: Math.max(0, Math.min(baseColor.value.saturation +
                            (index % 2 === 0
                                ? -config.tetradicSaturationShiftRange
                                : config.tetradicSaturationShiftRange), 100)),
                        lightness: Math.max(0, Math.min(baseColor.value.lightness +
                            (index % 2 === 0
                                ? -config.tetradicLightnessShiftRange
                                : config.tetradicLightnessShiftRange), 100)),
                        alpha: enableAlpha ? Math.random() : 1
                    },
                    format: 'hsl'
                };
                const adjustedColor = genAllColorValues(adjustedHSL);
                return createPaletteItem(adjustedColor.hsl, enableAlpha);
            })
        ];
        return await database.savePaletteToDB('tetradic', paletteItems, baseColor, numBoxes, enableAlpha, limitBright, limitDark, limitGray);
    }
    async function triadic(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray) {
        const currentTriadicPaletteID = await database.getCurrentPaletteID();
        if (numBoxes < 3) {
            console.warn('Triadic palette requires at least 3 swatches.');
            return paletteUtils.createPaletteObject('triadic', [], defaults.hsl, 0, currentTriadicPaletteID, enableAlpha, limitBright, limitDark, limitGray);
        }
        const baseColor = getBaseColor(customColor, enableAlpha);
        const hues = genHues.triadic(baseColor.value.hue);
        const paletteItems = [
            createPaletteItem(baseColor, enableAlpha),
            ...hues.map((hue, index) => {
                const adjustedHSL = {
                    value: {
                        hue,
                        saturation: Math.max(0, Math.min(baseColor.value.saturation +
                            (index % 2 === 0
                                ? -config.triadicSaturationShiftRange
                                : config.triadicSaturationShiftRange), 100)),
                        lightness: Math.max(0, Math.min(baseColor.value.lightness +
                            (index % 2 === 0
                                ? -config.triadicLightnessShiftRange
                                : config.triadicLightnessShiftRange), 100)),
                        alpha: enableAlpha ? Math.random() : 1
                    },
                    format: 'hsl'
                };
                const adjustedColor = genAllColorValues(adjustedHSL);
                return createPaletteItem(adjustedColor, enableAlpha);
            })
        ];
        return await database.savePaletteToDB('triadic', paletteItems, baseColor, numBoxes, enableAlpha, limitBright, limitDark, limitGray);
    }
    return {
        createPaletteItem,
        generatePaletteItems,
        getBaseColor,
        updateColorBox,
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
}

var colors = /*#__PURE__*/Object.freeze({
    __proto__: null
});

async function genPaletteBox(items, numBoxes, tableId) {
    try {
        const paletteRow = document.getElementById('palette-row');
        if (!paletteRow) {
            console.error('paletteRow is undefined.');
            return;
        }
        paletteRow.innerHTML = '';
        const fragment = document.createDocumentFragment();
        items.slice(0, numBoxes).forEach((item, i) => {
            const color = { value: item.colors.hsl, format: 'hsl' };
            const { colorStripe } = domHelpers.makePaletteBox(color, i + 1);
            fragment.appendChild(colorStripe);
            paletteUtils.populateColorTextOutputBox(color, i + 1);
        });
        paletteRow.appendChild(fragment);
        console.log('Palette boxes generated and rendered.');
        await database.saveData('tables', tableId, { palette: items });
    }
    catch (error) {
        console.error(`Error generating palette box: ${error}`);
    }
}
const domUtils = {
    genPaletteBox
};

function genLimitedHSL(baseHue, limitDark, limitLight, limitGray, alpha) {
    let hsl;
    do {
        hsl = {
            value: {
                hue: baseHue,
                saturation: Math.random() * 100,
                lightness: Math.random() * 100,
                alpha: alpha ?? 1
            },
            format: 'hsl'
        };
    } while ((limitGray && limits.isTooGray(hsl)) ||
        (limitDark && limits.isTooDark(hsl)) ||
        (limitLight && limits.isTooBright(hsl)));
    return hsl;
}
async function genSelectedPalette(options) {
    try {
        const { paletteType, numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray } = options;
        const palette = await genPalette();
        switch (paletteType) {
            case 1:
                return palette.random(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray);
            case 2:
                return palette.complementary(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray);
            case 3:
                return palette.triadic(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray);
            case 4:
                return palette.tetradic(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray);
            case 5:
                return palette.splitComplementary(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray);
            case 6:
                return palette.analogous(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray);
            case 7:
                return palette.hexadic(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray);
            case 8:
                return palette.diadic(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray);
            case 9:
                return palette.monochromatic(numBoxes, customColor, enableAlpha, limitBright, limitDark, limitGray);
            default:
                console.error('Invalid palette type.');
                return Promise.resolve(defaults.paletteData);
        }
    }
    catch (error) {
        console.error(`Error generating palette: ${error}`);
        return Promise.resolve(defaults.paletteData);
    }
}
async function startPaletteGen(options) {
    try {
        let { numBoxes, customColor } = options;
        if (customColor === null || customColor === undefined) {
            console.error('Custom color is null or undefined.');
            return;
        }
        const validatedCustomColor = validateAndConvertColor(customColor) ??
            randomHSL(options.enableAlpha);
        options.customColor = validatedCustomColor;
        const palette = await genSelectedPalette(options);
        if (palette.items.length === 0) {
            console.error('Colors array is empty or invalid.');
            return;
        }
        console.log(`Colors array generated: ${JSON.stringify(colors)}`);
        const tableId = await database.getNextTableID();
        await domUtils.genPaletteBox(palette.items, numBoxes, tableId);
    }
    catch (error) {
        console.error(`Error starting palette generation: ${error}`);
    }
}
function validateAndConvertColor(color) {
    if (!color)
        return null;
    const convertedColor = colorUtils.isColorString(color)
        ? colorUtils.colorStringToColor(color)
        : color;
    if (!commonUtils.validateColorValues(convertedColor)) {
        console.error(`Invalid color: ${JSON.stringify(convertedColor)}`);
        return null;
    }
    return convertedColor;
}
const generate = {
    genLimitedHSL,
    genSelectedPalette,
    startPaletteGen,
    validateAndConvertColor
};

function addConversionButtonEventListeners() {
    try {
        const addListener = (id, colorSpace) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => switchColorSpace(colorSpace));
            }
            else {
                console.warn(`Element with id "${id}" not found.`);
            }
        };
        addListener('show-as-cmyk-button', 'cmyk');
        addListener('show-as-hex-button', 'hex');
        addListener('show-as-hsl-button', 'hsl');
        addListener('show-as-hsv-button', 'hsv');
        addListener('show-as-lab-button', 'lab');
        addListener('show-as-rgb-button', 'rgb');
    }
    catch (error) {
        console.error(`Failed to add event listeners to conversion buttons: ${error}`);
        return;
    }
}
function applyCustomColor() {
    try {
        const colorPicker = document.getElementById('custom-color-picker');
        if (!colorPicker) {
            throw new Error('Color picker element not found');
        }
        const rawValue = colorPicker.value.trim();
        const selectedFormat = document.getElementById('custom-color-format')?.value;
        if (!colorUtils.isColorSpace(selectedFormat)) {
            throw new Error(`Unsupported color format: ${selectedFormat}`);
        }
        const parsedColor = colorUtils.parseColor(selectedFormat, rawValue);
        if (!parsedColor) {
            throw new Error(`Invalid color value: ${rawValue}`);
        }
        const hslColor = colorUtils.isHSLColor(parsedColor)
            ? parsedColor
            : toHSL(parsedColor);
        return hslColor;
    }
    catch (error) {
        console.error(`Failed to apply custom color: ${error}. Returning randomly generated hex color`);
        return randomHSL(false);
    }
}
function applyFirstColorToUI(color) {
    try {
        const colorBox1 = document.getElementById('color-box-1');
        if (!colorBox1) {
            console.error('color-box-1 is null');
            return color;
        }
        const formatColorString = colorUtils.getCSSColorString(color);
        if (!formatColorString) {
            console.error('Unexpected or unsupported color format.');
            return color;
        }
        colorBox1.style.backgroundColor = formatColorString;
        paletteUtils.populateColorTextOutputBox(color, 1);
        return color;
    }
    catch (error) {
        console.error(`Failed to apply first color to UI: ${error}`);
        return randomHSL(false);
    }
}
function copyToClipboard(text, tooltipElement) {
    try {
        const colorValue = text.replace('Copied to clipboard!', '').trim();
        navigator.clipboard
            .writeText(colorValue)
            .then(() => {
            domHelpers.showTooltip(tooltipElement);
            console.log(`Copied color value: ${colorValue}`);
            setTimeout(() => tooltipElement.classList.remove('show'), config.tooltipTimeout || 1000);
        })
            .catch(err => {
            console.error('Error copying to clipboard:', err);
        });
    }
    catch (error) {
        console.error(`Failed to copy to clipboard: ${error}`);
    }
}
function defineUIElements() {
    try {
        const applyCustomColorButton = config.applyCustomColorButton;
        const clearCustomColorButton = config.clearCustomColorButton;
        const customColorToggleButton = config.customColorToggleButton;
        const closeHelpMenuButton = config.closeHelpMenuButton;
        const closeHistoryMenuButton = config.closeHistoryMenuButton;
        const closeSubMenuAButton = config.closeSubMenuAButton;
        const closeSubMenuBButton = config.closeSubMenuBButton;
        const desaturateButton = config.desaturateButton;
        const enableAlphaCheckbox = config.enableAlphaCheckbox;
        const generateButton = config.generateButton;
        const limitBrightCheckbox = config.limitBrightCheckbox;
        const limitDarkCheckbox = config.limitDarkCheckbox;
        const limitGrayCheckbox = config.limitGrayCheckbox;
        const saturateButton = config.saturateButton;
        const selectedColorOptions = config.selectedColorOptions;
        const showAsCMYKButton = config.showAsCMYKButton;
        const showAsHexButton = config.showAsHexButton;
        const showAsHSLButton = config.showAsHSLButton;
        const showAsHSVButton = config.showAsHSVButton;
        const showAsLABButton = config.showAsLABButton;
        const showAsRGBButton = config.showAsRGBButton;
        const showHelpMenuButton = config.showHelpMenuButton;
        const showHistoryMenuButton = config.showHistoryMenuButton;
        const subMenuToggleButtonA = config.subMenuToggleButtonA;
        const subMenuToggleButtonB = config.subMenuToggleButtonB;
        const selectedColor = selectedColorOptions
            ? parseInt(selectedColorOptions.value, 10)
            : 0;
        return {
            applyCustomColorButton,
            clearCustomColorButton,
            closeHelpMenuButton,
            closeHistoryMenuButton,
            closeSubMenuAButton,
            closeSubMenuBButton,
            customColorToggleButton,
            desaturateButton,
            enableAlphaCheckbox,
            generateButton,
            limitBrightCheckbox,
            limitDarkCheckbox,
            limitGrayCheckbox,
            saturateButton,
            selectedColor,
            showAsCMYKButton,
            showAsHexButton,
            showAsHSLButton,
            showAsHSVButton,
            showAsLABButton,
            showAsRGBButton,
            showHelpMenuButton,
            showHistoryMenuButton,
            subMenuToggleButtonA,
            subMenuToggleButtonB
        };
    }
    catch (error) {
        console.error('Failed to define UI buttons:', error);
        return {
            applyCustomColorButton: null,
            clearCustomColorButton: null,
            closeHelpMenuButton: null,
            closeHistoryMenuButton: null,
            closeSubMenuAButton: null,
            closeSubMenuBButton: null,
            customColorToggleButton: null,
            desaturateButton: null,
            enableAlphaCheckbox: null,
            generateButton: null,
            limitBrightCheckbox: null,
            limitDarkCheckbox: null,
            limitGrayCheckbox: null,
            saturateButton: null,
            selectedColor: 0,
            showAsCMYKButton: null,
            showAsHexButton: null,
            showAsHSLButton: null,
            showAsHSVButton: null,
            showAsLABButton: null,
            showAsRGBButton: null,
            showHelpMenuButton: null,
            showHistoryMenuButton: null,
            subMenuToggleButtonA: null,
            subMenuToggleButtonB: null
        };
    }
}
function desaturateColor(selectedColor) {
    try {
        getElementsForSelectedColor(selectedColor);
    }
    catch (error) {
        console.error(`Failed to desaturate color: ${error}`);
    }
}
function getElementsForSelectedColor(selectedColor) {
    const selectedColorBox = document.getElementById(`color-box-${selectedColor}`);
    if (!selectedColorBox) {
        console.warn(`Element not found for color ${selectedColor}`);
        notification.showToast('Please select a valid color.');
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
function getGenerateButtonParams() {
    try {
        const paletteNumberOptions = config.paletteNumberOptions;
        const paletteTypeOptions = config.paletteTypeOptions;
        const customColorRaw = config.customColorElement?.value;
        const enableAlphaCheckbox = config.enableAlphaCheckbox;
        const limitBrightCheckbox = config.limitBrightCheckbox;
        const limitDarkCheckbox = config.limitDarkCheckbox;
        const limitGrayCheckbox = config.limitGrayCheckbox;
        if (paletteNumberOptions === null ||
            paletteTypeOptions === null ||
            enableAlphaCheckbox === null ||
            limitBrightCheckbox === null ||
            limitDarkCheckbox === null ||
            limitGrayCheckbox === null) {
            console.error('One or more elements are null');
            return null;
        }
        console.log(`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}`);
        return {
            numBoxes: parseInt(paletteNumberOptions.value, 10),
            paletteType: parseInt(paletteTypeOptions.value, 10),
            customColor: customColorRaw
                ? colorUtils.parseCustomColor(customColorRaw)
                : null,
            enableAlpha: enableAlphaCheckbox.checked,
            limitBright: limitBrightCheckbox.checked,
            limitDark: limitDarkCheckbox.checked,
            limitGray: limitGrayCheckbox.checked
        };
    }
    catch (error) {
        console.error('Failed to retrieve generateButton parameters:', error);
        return null;
    }
}
const handleGenButtonClick = core.debounce(() => {
    try {
        const params = getGenerateButtonParams();
        if (!params) {
            console.error('Failed to retrieve generateButton parameters');
            return;
        }
        const { numBoxes, customColor, paletteType, enableAlpha, limitBright, limitDark, limitGray } = params;
        if (!paletteType || !numBoxes) {
            console.error('paletteType and/or numBoxes are undefined');
            return;
        }
        const options = {
            numBoxes,
            customColor,
            paletteType,
            enableAlpha,
            limitBright,
            limitDark,
            limitGray
        };
        generate.startPaletteGen(options);
    }
    catch (error) {
        console.error(`Failed to handle generate button click: ${error}`);
    }
}, config.buttonDebounce || 300);
function pullParamsFromUI() {
    try {
        const paletteTypeOptionsElement = config.paletteTypeOptions;
        const numBoxesElement = config.paletteNumberOptions;
        const enableAlphaCheckbox = config.enableAlphaCheckbox;
        const limitBrightCheckbox = config.limitBrightCheckbox;
        const limitDarkCheckbox = config.limitDarkCheckbox;
        const limitGrayCheckbox = config.limitGrayCheckbox;
        return {
            paletteType: paletteTypeOptionsElement
                ? parseInt(paletteTypeOptionsElement.value, 10)
                : 0,
            numBoxes: numBoxesElement ? parseInt(numBoxesElement.value, 10) : 0,
            enableAlpha: enableAlphaCheckbox?.checked || false,
            limitBright: limitBrightCheckbox?.checked || false,
            limitDark: limitDarkCheckbox?.checked || false,
            limitGray: limitGrayCheckbox?.checked || false
        };
    }
    catch (error) {
        console.error(`Failed to pull parameters from UI: ${error}`);
        return {
            paletteType: 0,
            numBoxes: 0,
            enableAlpha: false,
            limitBright: false,
            limitDark: false,
            limitGray: false
        };
    }
}
function saturateColor(selectedColor) {
    try {
        getElementsForSelectedColor(selectedColor);
    }
    catch (error) {
        console.error(`Failed to saturate color: ${error}`);
    }
}
function showCustomColorPopupDiv() {
    try {
        const popup = document.getElementById('popup-div');
        if (popup) {
            popup.classList.toggle('show');
        }
        else {
            console.error("document.getElementById('popup-div') is undefined");
            return;
        }
    }
    catch (error) {
        console.error(`Failed to show custom color popup div: ${error}`);
    }
}
function switchColorSpace(targetFormat) {
    try {
        const colorTextOutputBoxes = document.querySelectorAll('.color-text-output-box');
        colorTextOutputBoxes.forEach(box => {
            const inputBox = box;
            const colorValues = inputBox.colorValues;
            if (!colorValues || !commonUtils.validateColorValues(colorValues)) {
                console.error('Invalid color values.');
                notification.showToast('Invalid color values.');
                return;
            }
            const currentFormat = inputBox.getAttribute('data-format');
            console.log(`Converting from ${currentFormat} to ${targetFormat}`);
            const convertFn = getConversionFn(currentFormat, targetFormat);
            if (!convertFn) {
                console.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`);
                notification.showToast('Conversion not supported.');
                return;
            }
            if (colorValues.format === 'xyz') {
                console.error('Cannot convert from XYZ to another color space.');
                notification.showToast('Conversion not supported.');
                return;
            }
            const clonedColor = colorUtils.narrowToColor(colorValues);
            if (!clonedColor ||
                colorUtils.isSLColor(clonedColor) ||
                colorUtils.isSVColor(clonedColor) ||
                colorUtils.isXYZ(clonedColor)) {
                console.error('Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.');
                notification.showToast('Conversion not supported.');
                return;
            }
            if (!clonedColor) {
                console.error(`Conversion to ${targetFormat} failed.`);
                notification.showToast('Conversion failed.');
                return;
            }
            const newColor = core.clone(convertFn(clonedColor));
            if (!newColor) {
                console.error(`Conversion to ${targetFormat} failed.`);
                notification.showToast('Conversion failed.');
                return;
            }
            inputBox.value = String(newColor);
            inputBox.setAttribute('data-format', targetFormat);
        });
    }
    catch (error) {
        throw new Error(`Failed to convert colors: ${error}`);
    }
}
const domFn = {
    addConversionButtonEventListeners,
    applyCustomColor,
    applyFirstColorToUI,
    copyToClipboard,
    defineUIElements,
    desaturateColor,
    getElementsForSelectedColor,
    getGenerateButtonParams,
    handleGenButtonClick,
    pullParamsFromUI,
    saturateColor,
    showCustomColorPopupDiv,
    switchColorSpace
};

// ColorGen - version 0.6.0-dev
// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.
// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded - Initializing application');
    const buttons = domFn.defineUIElements();
    if (!buttons) {
        console.error('Failed to initialize UI buttons');
        return;
    }
    const selectedColorOptions = config.selectedColorOptions;
    const { applyCustomColorButton, clearCustomColorButton, closeHelpMenuButton, closeHistoryMenuButton, customColorToggleButton, desaturateButton, generateButton, saturateButton, showAsCMYKButton, showAsHexButton, showAsHSLButton, showAsHSVButton, showAsLABButton, showAsRGBButton, showHelpMenuButton, showHistoryMenuButton, subMenuToggleButtonA, subMenuToggleButtonB } = buttons;
    // confirm that all elements are accessible
    console.log(`Apply Custom Color Button: ${applyCustomColorButton ? 'found' : 'not found'}\nClear Custom Color Button: ${clearCustomColorButton ? 'found' : 'not found'}\nClose Help Menu Button: ${closeHelpMenuButton ? 'found' : 'not found'}\nClose History Menu Button: ${closeHistoryMenuButton ? 'found' : 'not found'}\nCustom Color Toggle Button: ${customColorToggleButton ? 'found' : 'not found'}\nDesaturate Button: ${desaturateButton ? 'found' : 'not found'}\nGenerate Button: ${generateButton ? 'found' : 'not found'}\nSaturate Button: ${saturateButton ? 'found' : 'not found'}\nShow as CMYK Button: ${showAsCMYKButton ? 'found' : 'not found'}\nShow as Hex Button: ${showAsHexButton ? 'found' : 'not found'}\nShow as HSL Button: ${showAsHSLButton ? 'found' : 'not found'}\nShow as HSV Button: ${showAsHSVButton ? 'found' : 'not found'}\nShow as LAB Button: ${showAsLABButton ? 'found' : 'not found'}\nShow as RGB Button: ${showAsRGBButton ? 'found' : 'not found'}\nShow Help Menu Button: ${showHelpMenuButton ? 'found' : 'not found'}\nShow History Menu Button${showHistoryMenuButton ? 'found' : 'not found'}\nSub Menu Toggle Button A: ${subMenuToggleButtonA ? 'found' : 'not found'}\nSub Menu Toggle Button B: ${subMenuToggleButtonB ? 'found' : 'not found'}`);
    const selectedColor = selectedColorOptions
        ? parseInt(selectedColorOptions.value, 10)
        : 0;
    console.log(`Selected color: ${selectedColor}`);
    try {
        domFn.addConversionButtonEventListeners();
        console.log('Conversion button event listeners attached');
    }
    catch (error) {
        console.error(`Unable to attach conversion button event listeners: ${error}`);
    }
    applyCustomColorButton?.addEventListener('click', async (e) => {
        e.preventDefault();
        const customHSLColor = domFn.applyCustomColor();
        const customHSLColorClone = core.clone(customHSLColor);
        await database.saveData('customColor', 'appSettings', customHSLColorClone);
        console.log('Custom color saved to IndexedDB');
    });
    clearCustomColorButton?.addEventListener('click', async (e) => {
        e.preventDefault();
        await database.deleteTable('customColor');
        console.log('Custom color cleared from IndexedDB');
        domFn.showCustomColorPopupDiv();
    });
    closeHelpMenuButton?.addEventListener('click', e => {
        e.preventDefault();
        console.log('closeHelpMenuButton clicked');
    });
    closeHistoryMenuButton?.addEventListener('click', e => {
        e.preventDefault();
        console.log('closeHistoryMenuButton clicked');
    });
    customColorToggleButton?.addEventListener('click', e => {
        e.preventDefault();
        console.log('customColorToggleButton clicked');
        domFn.showCustomColorPopupDiv();
    });
    desaturateButton?.addEventListener('click', e => {
        e.preventDefault();
        console.log('desaturateButton clicked');
        domFn.desaturateColor(selectedColor);
    });
    generateButton?.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('generateButton clicked');
        const { paletteType, numBoxes, enableAlpha, limitBright, limitDark, limitGray } = domFn.pullParamsFromUI();
        let customColor = (await database.getCustomColor());
        if (!customColor) {
            console.info('No custom color found. Using a random color');
            customColor = randomHSL(true);
        }
        const paletteOptions = {
            paletteType,
            numBoxes,
            customColor: core.clone(customColor),
            enableAlpha,
            limitBright,
            limitDark,
            limitGray
        };
        await generate.startPaletteGen(paletteOptions);
    });
    saturateButton?.addEventListener('click', e => {
        e.preventDefault();
        console.log('saturateButton clicked');
        domFn.saturateColor(selectedColor);
    });
    showAsCMYKButton?.addEventListener('click', e => {
        e.preventDefault();
        console.log('showAsCMYKButton clicked');
    });
    showAsHexButton?.addEventListener('click', e => {
        e.preventDefault();
        console.log('showAsHexButton clicked');
    });
    showAsHSLButton?.addEventListener('click', e => {
        e.preventDefault();
        console.log('showAsHSLButton clicked');
    });
    showAsHSVButton?.addEventListener('click', e => {
        e.preventDefault();
        console.log('showAsHSVButton clicked');
    });
    showAsLABButton?.addEventListener('click', e => {
        e.preventDefault();
        console.log('showAsLABButton clicked');
    });
    showAsRGBButton?.addEventListener('click', e => {
        e.preventDefault();
        console.log('showAsRGBButton clicked');
    });
    showHelpMenuButton?.addEventListener('click', e => {
        e.preventDefault();
        if (showHelpMenuButton) {
            const clonedClasses = [...showHelpMenuButton.classList];
            const isHidden = clonedClasses.includes('hidden');
            showHelpMenuButton.classList.toggle('hidden');
            showHelpMenuButton.style.display = isHidden ? 'block' : 'none';
        }
        console.log('showHelpMenuButton clicked');
    });
    showHistoryMenuButton?.addEventListener('click', e => {
        e.preventDefault();
        if (showHistoryMenuButton) {
            const clonedClasses = [...showHistoryMenuButton.classList];
            const isHidden = clonedClasses.includes('hidden');
            showHistoryMenuButton.classList.toggle('hidden');
            showHistoryMenuButton.style.display = isHidden ? 'block' : 'none';
        }
        console.log('showHistoryMenuButton clicked');
    });
    subMenuToggleButtonA?.addEventListener('click', e => {
        e.preventDefault();
        if (subMenuToggleButtonA) {
            const clonedClasses = [...subMenuToggleButtonA.classList];
            const isHidden = clonedClasses.includes('hidden');
            subMenuToggleButtonA.classList.toggle('hidden');
            subMenuToggleButtonA.style.display = isHidden ? 'block' : 'none';
        }
        console.log('subMenuToggleButtonA clicked');
    });
    subMenuToggleButtonB?.addEventListener('click', e => {
        e.preventDefault();
        if (subMenuToggleButtonB) {
            const clonedClasses = [...subMenuToggleButtonB.classList];
            const isHidden = clonedClasses.includes('hidden');
            subMenuToggleButtonB.classList.toggle('hidden');
            subMenuToggleButtonB.style.display = isHidden ? 'block' : 'none';
        }
        console.log('subMenuToggleButtonB clicked');
    });
});
//# sourceMappingURL=bundle.js.map
