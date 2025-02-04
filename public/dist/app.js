// File: src/data/config.js
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
const regex$4 = {
    colors: {
        cmyk: /cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/i,
        hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
        hsl: /hsl\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
        hsv: /hsv\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)/i,
        lab: /lab\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
        rgb: /rgb\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i,
        xyz: /xyz\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/i
    },
    dom: {
        hex: /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i,
        hsl: /^hsl\(\s*(\d+),\s*([\d.]+)%,\s*([\d.]+)%\s*\)$/,
        rgb: /^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/
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
const configData = { db, regex: regex$4 };

// File: logger/AppLogger.js
class AppLogger {
    static instance = null;
    mode;
    constructor(mode) {
        this.mode = mode;
    }
    static getInstance(mode) {
        if (!AppLogger.instance) {
            AppLogger.instance = new AppLogger(mode);
        }
        return AppLogger.instance;
    }
    log(message, level = 'info', debugLevel = 0, caller) {
        this.logMessage(message, level, debugLevel, caller);
    }
    async logAsync(message, level = 'info', debugLevel = 0, caller) {
        this.logMessage(message, level, debugLevel, caller);
    }
    logMutation(data, logCallback = () => { }) {
        this.log(this.formatMutationLog(data), 'info');
        logCallback(data);
    }
    logMessage(message, level, debugLevel, caller) {
        if ((level === 'info' && this.mode.quiet) ||
            debugLevel < this.getDebugThreshold(level)) {
            return;
        }
        const callerInfo = caller || this.getCallerInfo();
        const timestamp = this.getFormattedTimestamp();
        try {
            console.log(`%c[${level.toUpperCase()}]%c ${timestamp} [${callerInfo}] %c${message}`, this.getLevelColor(level), 'color: gray', 'color: inherit');
        }
        catch (error) {
            console.error(`AppLogger encountered an unexpected error: ${error}`);
        }
        if (callerInfo === 'Unknown caller' &&
            debugLevel > 1 &&
            this.mode.stackTrace) {
            console.trace('Full Stack Trace:');
        }
    }
    formatMutationLog(data) {
        return `Mutation logged: ${JSON.stringify(data)}`;
    }
    getDebugThreshold(level) {
        switch (level) {
            case 'debug':
                return 2;
            case 'info':
                return 1;
            case 'warn':
                return 0;
            case 'error':
                return 0;
            default:
                return 0;
        }
    }
    getCallerInfo() {
        const stack = new Error().stack;
        if (stack) {
            const stackLines = stack.split('\n');
            for (const line of stackLines) {
                if (!line.includes('AppLogger') && line.includes('at ')) {
                    const match = line.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) ||
                        line.match(/at\s+(.*):(\d+):(\d+)/);
                    if (match) {
                        return match[1]
                            ? `${match[1]} (${match[2]}:${match[3]})`
                            : `${match[2]}:${match[3]}`;
                    }
                }
            }
        }
        return 'Unknown caller';
    }
    getFormattedTimestamp() {
        return new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }
    getLevelColor(level) {
        switch (level) {
            case 'debug':
                return 'color: green';
            case 'info':
                return 'color: blue';
            case 'warn':
                return 'color: orange';
            case 'error':
                return 'color: red';
            default:
                return 'color: black';
        }
    }
}

// File: data/mode.js
const modeData = {
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

// File: logger/factory.js
const createLogger = async () => {
    const debugLevel = modeData.debugLevel;
    const appLogger = AppLogger.getInstance(modeData);
    return {
        debug: (message, caller) => appLogger.log(message, 'debug', debugLevel, caller),
        info: (message, caller) => appLogger.log(message, 'info', debugLevel, caller),
        warn: (message, caller) => appLogger.log(message, 'warn', debugLevel, caller),
        error: (message, caller) => appLogger.log(message, 'error', debugLevel, caller),
        mutation: (data, logCallback, caller) => {
            appLogger.logMutation(data, logCallback);
            if (caller) {
                appLogger.log(`Mutation logged by ${caller}`, 'debug', debugLevel);
            }
        }
    };
};

// File: data/sets.js
const dataSets = {
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

// File: common/core.js
const _sets = dataSets;
// ******** SECTION 0 - Brand ********
function asBranded(value, rangeKey) {
    validate.range(value, rangeKey);
    return value;
}
function asByteRange(value) {
    validate.range(value, 'ByteRange');
    return value;
}
function asHexSet(value) {
    if (/^#[0-9a-fA-F]{8}$/.test(value)) {
        value = value.slice(0, 7);
    }
    if (!validate.hexSet(value)) {
        throw new Error(`Invalid HexSet value: ${value}`);
    }
    return value;
}
function asLAB_L(value) {
    validate.range(value, 'LAB_L');
    return value;
}
function asLAB_A(value) {
    validate.range(value, 'LAB_A');
    return value;
}
function asLAB_B(value) {
    validate.range(value, 'LAB_B');
    return value;
}
function asPercentile(value) {
    validate.range(value, 'Percentile');
    return value;
}
function asRadial(value) {
    validate.range(value, 'Radial');
    return value;
}
function asXYZ_X(value) {
    validate.range(value, 'XYZ_X');
    return value;
}
function asXYZ_Y(value) {
    validate.range(value, 'XYZ_Y');
    return value;
}
function asXYZ_Z(value) {
    validate.range(value, 'XYZ_Z');
    return value;
}
const brand$3 = {
    asBranded,
    asByteRange,
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
// ******** SECTION 1 ********
function initializeDefaultColors() {
    return {
        cmyk: {
            value: {
                cyan: brand$3.asPercentile(0),
                magenta: brand$3.asPercentile(0),
                yellow: brand$3.asPercentile(0),
                key: brand$3.asPercentile(0)
            },
            format: 'cmyk'
        },
        hex: {
            value: {
                hex: brand$3.asHexSet('#000000')
            },
            format: 'hex'
        },
        hsl: {
            value: {
                hue: brand$3.asRadial(0),
                saturation: brand$3.asPercentile(0),
                lightness: brand$3.asPercentile(0)
            },
            format: 'hsl'
        },
        hsv: {
            value: {
                hue: brand$3.asRadial(0),
                saturation: brand$3.asPercentile(0),
                value: brand$3.asPercentile(0)
            },
            format: 'hsv'
        },
        lab: {
            value: {
                l: brand$3.asLAB_L(0),
                a: brand$3.asLAB_A(0),
                b: brand$3.asLAB_B(0)
            },
            format: 'lab'
        },
        rgb: {
            value: {
                red: brand$3.asByteRange(0),
                green: brand$3.asByteRange(0),
                blue: brand$3.asByteRange(0)
            },
            format: 'rgb'
        },
        sl: {
            value: {
                saturation: brand$3.asPercentile(0),
                lightness: brand$3.asPercentile(0)
            },
            format: 'sl'
        },
        sv: {
            value: {
                saturation: brand$3.asPercentile(0),
                value: brand$3.asPercentile(0)
            },
            format: 'sv'
        },
        xyz: {
            value: {
                x: brand$3.asXYZ_X(0),
                y: brand$3.asXYZ_Y(0),
                z: brand$3.asXYZ_Z(0)
            },
            format: 'xyz'
        }
    };
}
// ******** SECTION 1 ********
function clampToRange(value, rangeKey) {
    const [min, max] = _sets[rangeKey];
    return Math.min(Math.max(value, min), max);
}
function clone(value) {
    return structuredClone(value);
}
function debounce$1(func, delay) {
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
        const match = rawValue.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?,\s*(\d*\.?\d+)\)/);
        if (match) {
            const [, hue, saturation, lightness] = match;
            return {
                value: {
                    hue: brand$3.asRadial(parseInt(hue)),
                    saturation: brand$3.asPercentile(parseInt(saturation)),
                    lightness: brand$3.asPercentile(parseInt(lightness))
                },
                format: 'hsl'
            };
        }
        else {
            console.error('Invalid HSL custom color. Expected format: hsl(H, S%, L%, A)\ncaller: parseCustomColor()');
            return null;
        }
    }
    catch (error) {
        console.error(`parseCustomColor error: ${error}`);
        return null;
    }
}
const base = {
    clampToRange,
    clone,
    debounce: debounce$1,
    parseCustomColor
};
// ******** SECTION 2 - Brand Color ********
function asCMYK(color) {
    const brandedCyan = brand$3.asPercentile(color.value.cyan);
    const brandedMagenta = brand$3.asPercentile(color.value.magenta);
    const brandedYellow = brand$3.asPercentile(color.value.yellow);
    const brandedKey = brand$3.asPercentile(color.value.key);
    return {
        value: {
            cyan: brandedCyan,
            magenta: brandedMagenta,
            yellow: brandedYellow,
            key: brandedKey
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
    const hexRaw = hex.slice(0, 7);
    const brandedHex = brand$3.asHexSet(hexRaw);
    return {
        value: { hex: brandedHex },
        format: 'hex'
    };
}
function asHSL(color) {
    const brandedHue = brand$3.asRadial(color.value.hue);
    const brandedSaturation = brand$3.asPercentile(color.value.saturation);
    const brandedLightness = brand$3.asPercentile(color.value.lightness);
    return {
        value: {
            hue: brandedHue,
            saturation: brandedSaturation,
            lightness: brandedLightness
        },
        format: 'hsl'
    };
}
function asHSV(color) {
    const brandedHue = brand$3.asRadial(color.value.hue);
    const brandedSaturation = brand$3.asPercentile(color.value.saturation);
    const brandedValue = brand$3.asPercentile(color.value.value);
    return {
        value: {
            hue: brandedHue,
            saturation: brandedSaturation,
            value: brandedValue
        },
        format: 'hsv'
    };
}
function asLAB(color) {
    const brandedL = brand$3.asLAB_L(color.value.l);
    const brandedA = brand$3.asLAB_A(color.value.a);
    const brandedB = brand$3.asLAB_B(color.value.b);
    return {
        value: {
            l: brandedL,
            a: brandedA,
            b: brandedB
        },
        format: 'lab'
    };
}
function asRGB(color) {
    const brandedRed = brand$3.asByteRange(color.value.red);
    const brandedGreen = brand$3.asByteRange(color.value.green);
    const brandedBlue = brand$3.asByteRange(color.value.blue);
    return {
        value: {
            red: brandedRed,
            green: brandedGreen,
            blue: brandedBlue
        },
        format: 'rgb'
    };
}
function asSL(color) {
    const brandedSaturation = brand$3.asPercentile(color.value.saturation);
    const brandedLightness = brand$3.asPercentile(color.value.lightness);
    return {
        value: {
            saturation: brandedSaturation,
            lightness: brandedLightness
        },
        format: 'sl'
    };
}
function asSV(color) {
    const brandedSaturation = brand$3.asPercentile(color.value.saturation);
    const brandedValue = brand$3.asPercentile(color.value.value);
    return {
        value: {
            saturation: brandedSaturation,
            value: brandedValue
        },
        format: 'sv'
    };
}
function asXYZ(color) {
    const brandedX = brand$3.asXYZ_X(color.value.x);
    const brandedY = brand$3.asXYZ_Y(color.value.y);
    const brandedZ = brand$3.asXYZ_Z(color.value.z);
    return {
        value: {
            x: brandedX,
            y: brandedY,
            z: brandedZ
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
function cmykStringToValue(cmyk) {
    return {
        cyan: brand$3.asPercentile(parseFloat(cmyk.cyan) / 100),
        magenta: brand$3.asPercentile(parseFloat(cmyk.magenta) / 100),
        yellow: brand$3.asPercentile(parseFloat(cmyk.yellow) / 100),
        key: brand$3.asPercentile(parseFloat(cmyk.key) / 100)
    };
}
function cmykValueToString(cmyk) {
    return {
        cyan: `${cmyk.cyan * 100}%`,
        magenta: `${cmyk.magenta * 100}%`,
        yellow: `${cmyk.yellow * 100}%`,
        key: `${cmyk.key * 100}%`
    };
}
async function colorStringToColor(colorString) {
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
            console.error('Unsupported format for colorStringToColor');
            const defaultColors = initializeDefaultColors();
            const unbrandedHSL = defaultColors.hsl;
            const brandedHue = brand$3.asRadial(unbrandedHSL.value.hue);
            const brandedSaturation = brand$3.asPercentile(unbrandedHSL.value.saturation);
            const brandedLightness = brand$3.asPercentile(unbrandedHSL.value.lightness);
            return {
                value: {
                    hue: brandedHue,
                    saturation: brandedSaturation,
                    lightness: brandedLightness
                },
                format: 'hsl'
            };
    }
}
async function colorToCSSColorString(color) {
    try {
        switch (color.format) {
            case 'cmyk':
                return `cmyk(${color.value.cyan}, ${color.value.magenta}, ${color.value.yellow}, ${color.value.key}`;
            case 'hex':
                return String(color.value.hex);
            case 'hsl':
                return `hsl(${color.value.hue}, ${color.value.saturation}%, ${color.value.lightness}%`;
            case 'hsv':
                return `hsv(${color.value.hue}, ${color.value.saturation}%, ${color.value.value}%`;
            case 'lab':
                return `lab(${color.value.l}, ${color.value.a}, ${color.value.b})`;
            case 'rgb':
                return `rgb(${color.value.red}, ${color.value.green}, ${color.value.blue})`;
            case 'xyz':
                return `xyz(${color.value.x}, ${color.value.y}, ${color.value.z}`;
            default:
                console.error(`Unexpected color format: ${color.format}`);
                return '#FFFFFF';
        }
    }
    catch (error) {
        throw new Error(`getCSSColorString error: ${error}`);
    }
}
function hexStringToValue(hex) {
    return { hex: brand$3.asHexSet(hex.hex) };
}
function hexValueToString(hex) {
    return { hex: hex.hex };
}
function hslStringToValue(hsl) {
    return {
        hue: brand$3.asRadial(parseFloat(hsl.hue)),
        saturation: brand$3.asPercentile(parseFloat(hsl.saturation) / 100),
        lightness: brand$3.asPercentile(parseFloat(hsl.lightness) / 100)
    };
}
function hslValueToString(hsl) {
    return {
        hue: `${hsl.hue}°`,
        saturation: `${hsl.saturation * 100}%`,
        lightness: `${hsl.lightness * 100}%`
    };
}
function hsvStringToValue(hsv) {
    return {
        hue: brand$3.asRadial(parseFloat(hsv.hue)),
        saturation: brand$3.asPercentile(parseFloat(hsv.saturation) / 100),
        value: brand$3.asPercentile(parseFloat(hsv.value) / 100)
    };
}
function hsvValueToString(hsv) {
    return {
        hue: `${hsv.hue}°`,
        saturation: `${hsv.saturation * 100}%`,
        value: `${hsv.value * 100}%`
    };
}
function labValueToString(lab) {
    return {
        l: `${lab.l}`,
        a: `${lab.a}`,
        b: `${lab.b}`
    };
}
function labStringToValue(lab) {
    return {
        l: brand$3.asLAB_L(parseFloat(lab.l)),
        a: brand$3.asLAB_A(parseFloat(lab.a)),
        b: brand$3.asLAB_B(parseFloat(lab.b))
    };
}
function rgbValueToString(rgb) {
    return {
        red: `${rgb.red}`,
        green: `${rgb.green}`,
        blue: `${rgb.blue}`
    };
}
function rgbStringToValue(rgb) {
    return {
        red: brand$3.asByteRange(parseFloat(rgb.red)),
        green: brand$3.asByteRange(parseFloat(rgb.green)),
        blue: brand$3.asByteRange(parseFloat(rgb.blue))
    };
}
function toColorValueRange(value, rangeKey) {
    validate.range(value, rangeKey);
    if (rangeKey === 'HexSet') {
        return brand$3.asHexSet(value);
    }
    return brand$3.asBranded(value, rangeKey);
}
function xyzValueToString(xyz) {
    return {
        x: `${xyz.x}`,
        y: `${xyz.y}`,
        z: `${xyz.z}`
    };
}
function xyzStringToValue(xyz) {
    return {
        x: brand$3.asXYZ_X(parseFloat(xyz.x)),
        y: brand$3.asXYZ_Y(parseFloat(xyz.y)),
        z: brand$3.asXYZ_Z(parseFloat(xyz.z))
    };
}
const stringToValue = {
    cmyk: cmykStringToValue,
    hex: hexStringToValue,
    hsl: hslStringToValue,
    hsv: hsvStringToValue,
    lab: labStringToValue,
    rgb: rgbStringToValue,
    xyz: xyzStringToValue
};
const valueToString = {
    cmyk: cmykValueToString,
    hex: hexValueToString,
    hsl: hslValueToString,
    hsv: hsvValueToString,
    lab: labValueToString,
    rgb: rgbValueToString,
    xyz: xyzValueToString
};
const convert = {
    colorStringToColor,
    stringToValue,
    toColorValueRange,
    colorToCSSColorString,
    valueToString
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
        return validate.hexSet(value);
    }
    if (rangeKey === 'HexSet') {
        return validate.hexSet(value);
    }
    if (typeof value === 'number' && Array.isArray(_sets[rangeKey])) {
        const [min, max] = _sets[rangeKey];
        return value >= min && value <= max;
    }
    throw new Error(`Invalid range or value for ${String(rangeKey)}`);
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
        return brand$3.asLAB_L(Math.round(Math.min(Math.max(value, 0), 100)));
    }
    else if (output === 'a') {
        return brand$3.asLAB_A(Math.round(Math.min(Math.max(value, -125), 125)));
    }
    else if (output === 'b') {
        return brand$3.asLAB_B(Math.round(Math.min(Math.max(value, -125), 125)));
    }
    else
        throw new Error('Unable to return LAB value');
}
function percentile(value) {
    const rawPercentile = Math.round(Math.min(Math.max(value, 0), 100));
    return brand$3.asPercentile(rawPercentile);
}
function radial(value) {
    const rawRadial = Math.round(Math.min(Math.max(value, 0), 360)) & 360;
    return brand$3.asRadial(rawRadial);
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
// ******** SECTION 5.1 - Validate *********
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
        if (rangeKey === 'HexSet') {
            throw new Error(`Invalid value for ${String(rangeKey)}: ${value}`);
        }
        const [min, max] = _sets[rangeKey];
        throw new Error(`Value ${value} is out of range for ${String(rangeKey)} [${min}, ${max}]`);
    }
}
const validate = {
    colorValues,
    hex,
    hexComponent,
    hexSet,
    range
};
// ******** SECTION 6 - Other ********
function getFormattedTimestamp$1() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const other = { getFormattedTimestamp: getFormattedTimestamp$1 };
// ******** SECTION 7 - Final Export ********
const coreUtils$2 = {
    base,
    brand: brand$3,
    brandColor,
    convert,
    guards,
    ...other,
    sanitize,
    validate
};

// File: data/defaults.js
const brandedData = {
    id: `null-palette-${Date.now()}`,
    items: [],
    metadata: {
        flags: {
            limitDarkness: false,
            limitGrayness: false,
            limitLightness: false
        },
        name: 'BRANDED DEFAULT PALETTE',
        swatches: 1,
        type: '???',
        timestamp: '???'
    }
};
const brandedItem = {
    colors: {
        main: {
            cmyk: {
                cyan: brand$3.asPercentile(0),
                magenta: brand$3.asPercentile(0),
                yellow: brand$3.asPercentile(0),
                key: brand$3.asPercentile(0)
            },
            hex: { hex: brand$3.asHexSet('#000000') },
            hsl: {
                hue: brand$3.asRadial(0),
                saturation: brand$3.asPercentile(0),
                lightness: brand$3.asPercentile(0)
            },
            hsv: {
                hue: brand$3.asRadial(0),
                saturation: brand$3.asPercentile(0),
                value: brand$3.asPercentile(0)
            },
            lab: {
                l: brand$3.asLAB_L(0),
                a: brand$3.asLAB_A(0),
                b: brand$3.asLAB_B(0)
            },
            rgb: {
                red: brand$3.asByteRange(0),
                green: brand$3.asByteRange(0),
                blue: brand$3.asByteRange(0)
            },
            xyz: {
                x: brand$3.asXYZ_X(0),
                y: brand$3.asXYZ_Y(0),
                z: brand$3.asXYZ_Z(0)
            }
        },
        stringProps: {
            cmyk: {
                cyan: '0%',
                magenta: '0%',
                yellow: '0%',
                key: '0%'
            },
            hex: { hex: '#000000FF' },
            hsl: { hue: '0', saturation: '0%', lightness: '0%' },
            hsv: { hue: '0', saturation: '0%', value: '0%' },
            lab: { l: '0', a: '0', b: '0' },
            rgb: { red: '0', green: '0', blue: '0' },
            xyz: { x: '0', y: '0', z: '0' }
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
    }
};
const brandedStoredPalette = {
    tableID: 1,
    palette: brandedData
};
const colors = {
    base: {
        branded: {
            cmyk: {
                value: {
                    cyan: brand$3.asPercentile(0),
                    magenta: brand$3.asPercentile(0),
                    yellow: brand$3.asPercentile(0),
                    key: brand$3.asPercentile(0)
                },
                format: 'cmyk'
            },
            hex: {
                value: {
                    hex: brand$3.asHexSet('#000000')
                },
                format: 'hex'
            },
            hsl: {
                value: {
                    hue: brand$3.asRadial(0),
                    saturation: brand$3.asPercentile(0),
                    lightness: brand$3.asPercentile(0)
                },
                format: 'hsl'
            },
            hsv: {
                value: {
                    hue: brand$3.asRadial(0),
                    saturation: brand$3.asPercentile(0),
                    value: brand$3.asPercentile(0)
                },
                format: 'hsv'
            },
            lab: {
                value: {
                    l: brand$3.asLAB_L(0),
                    a: brand$3.asLAB_A(0),
                    b: brand$3.asLAB_B(0)
                },
                format: 'lab'
            },
            rgb: {
                value: {
                    red: brand$3.asByteRange(0),
                    green: brand$3.asByteRange(0),
                    blue: brand$3.asByteRange(0)
                },
                format: 'rgb'
            },
            sl: {
                value: {
                    saturation: brand$3.asPercentile(0),
                    lightness: brand$3.asPercentile(0)
                },
                format: 'sl'
            },
            sv: {
                value: {
                    saturation: brand$3.asPercentile(0),
                    value: brand$3.asPercentile(0)
                },
                format: 'sv'
            },
            xyz: {
                value: {
                    x: brand$3.asXYZ_X(0),
                    y: brand$3.asXYZ_Y(0),
                    z: brand$3.asXYZ_Z(0)
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
                    key: 0
                },
                format: 'cmyk'
            },
            hex: {
                value: {
                    hex: '#000000FF'
                },
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
            sl: {
                value: {
                    saturation: 0,
                    lightness: 0
                },
                format: 'sl'
            },
            rgb: {
                value: {
                    red: 0,
                    green: 0,
                    blue: 0
                },
                format: 'rgb'
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
            }
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
            value: {
                cyan: '0',
                magenta: '0',
                yellow: '0',
                key: '0'
            },
            format: 'cmyk'
        },
        hex: {
            value: {
                hex: '#000000'
            },
            format: 'hex'
        },
        hsl: {
            value: {
                hue: '0',
                saturation: '0',
                lightness: '0'
            },
            format: 'hsl'
        },
        hsv: {
            value: {
                hue: '0',
                saturation: '0',
                value: '0'
            },
            format: 'hsv'
        },
        lab: {
            value: {
                l: '0',
                a: '0',
                b: '0'
            },
            format: 'lab'
        },
        rgb: {
            value: {
                red: '0',
                green: '0',
                blue: '0'
            },
            format: 'rgb'
        },
        sl: {
            value: {
                saturation: '0',
                lightness: '0'
            },
            format: 'sl'
        },
        sv: {
            value: {
                saturation: '0',
                value: '0'
            },
            format: 'sv'
        },
        xyz: {
            value: {
                x: '0',
                y: '0',
                z: '0'
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
const paletteOptions = {
    flags: {
        limitDark: false,
        limitGray: false,
        limitLight: false
    },
    swatches: 6,
    type: 1
};
const unbrandedData = {
    id: `null-branded-palette-${Date.now()}`,
    items: [],
    metadata: {
        flags: {
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
        main: {
            cmyk: { cyan: 0, magenta: 0, yellow: 0, key: 0 },
            hex: { hex: '#000000' },
            hsl: { hue: 0, saturation: 0, lightness: 0 },
            hsv: { hue: 0, saturation: 0, value: 0 },
            lab: { l: 0, a: 0, b: 0 },
            rgb: { red: 0, green: 0, blue: 0 },
            xyz: { x: 0, y: 0, z: 0 }
        },
        stringProps: {
            cmyk: {
                cyan: '0%',
                magenta: '0%',
                yellow: '0%',
                key: '0%'
            },
            hex: { hex: '#000000FF' },
            hsl: { hue: '0', saturation: '0%', lightness: '0%' },
            hsv: { hue: '0', saturation: '0%', value: '0%' },
            lab: { l: '0', a: '0', b: '0' },
            rgb: { red: '0', green: '0', blue: '0' },
            xyz: { x: '0', y: '0', z: '0' }
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
    }
};
const unbrandedStoredPalette = {
    tableID: 1,
    palette: unbrandedData
};
const palette = {
    branded: {
        data: brandedData,
        item: brandedItem,
        stored: brandedStoredPalette
    },
    unbranded: {
        data: unbrandedData,
        item: unbrandedItem,
        stored: unbrandedStoredPalette
    }
};
const defaultData = {
    colors,
    idb,
    palette,
    paletteOptions
};

// File: common/helpers/conversion.js
const logMode$p = modeData.logging;
const thisModule$s = 'common/helpers/conversion.js';
const logger$s = await createLogger();
function applyGammaCorrection(value) {
    const thisMethod = 'applyGammaCorrection()';
    try {
        return value > 0.0031308
            ? 1.055 * Math.pow(value, 1 / 2.4) - 0.055
            : 12.92 * value;
    }
    catch (error) {
        if (logMode$p.error)
            logger$s.error(`Error applying gamma correction: ${error}`, `${thisModule$s} > ${thisMethod}`);
        return value;
    }
}
function clampRGB(rgb) {
    const thisMethod = 'clampRGB()';
    const defaultRGBUnbranded = coreUtils$2.base.clone(defaultData.colors.base.unbranded.rgb);
    const defaultRGBBranded = coreUtils$2.brandColor.asRGB(defaultRGBUnbranded);
    if (!coreUtils$2.validate.colorValues(rgb)) {
        if (logMode$p.error)
            logger$s.error(`Invalid RGB value ${JSON.stringify(rgb)}`, `${thisModule$s} > ${thisMethod}`);
        return defaultRGBBranded;
    }
    try {
        return {
            value: {
                red: coreUtils$2.brand.asByteRange(Math.round(Math.min(Math.max(0, rgb.value.red), 1) * 255)),
                green: coreUtils$2.brand.asByteRange(Math.round(Math.min(Math.max(0, rgb.value.green), 1) * 255)),
                blue: coreUtils$2.brand.asByteRange(Math.round(Math.min(Math.max(0, rgb.value.blue), 1) * 255))
            },
            format: 'rgb'
        };
    }
    catch (error) {
        if (logMode$p.error)
            logger$s.error(`Error clamping RGB values: ${error}`, `${thisModule$s} > ${thisMethod}`);
        return rgb;
    }
}
function hueToRGB(p, q, t) {
    const thisMethod = 'hueToRGB()';
    try {
        const clonedP = coreUtils$2.base.clone(p);
        const clonedQ = coreUtils$2.base.clone(q);
        let clonedT = coreUtils$2.base.clone(t);
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
        if (logMode$p.error)
            logger$s.error(`Error converting hue to RGB: ${error}`, `${thisModule$s} > ${thisMethod}`);
        return 0;
    }
}
function hslAddFormat(value) {
    const thisMethod = 'hslAddFormat()';
    const defaultHSLUnbranded = coreUtils$2.base.clone(defaultData.colors.base.unbranded.hsl);
    const defaultHSLBranded = coreUtils$2.brandColor.asHSL(defaultHSLUnbranded);
    try {
        if (!coreUtils$2.validate.colorValues({ value: value, format: 'hsl' })) {
            if (logMode$p.error)
                logger$s.error(`Invalid HSL value ${JSON.stringify(value)}`, `${thisModule$s} > ${thisMethod}`);
            return defaultHSLBranded;
        }
        return { value: value, format: 'hsl' };
    }
    catch (error) {
        if (logMode$p.error)
            logger$s.error(`Error adding HSL format: ${error}`, `${thisModule$s} > ${thisMethod}`);
        return defaultHSLBranded;
    }
}
const conversionHelpers = {
    applyGammaCorrection,
    clampRGB,
    hslAddFormat,
    hueToRGB
};

// File: common/transform.js
const thisModule$r = 'common/transform/base.ts';
const logger$r = await createLogger();
function addHashToHex(hex) {
    try {
        return hex.value.hex.startsWith('#')
            ? hex
            : {
                value: {
                    hex: brand$3.asHexSet(`#${hex.value}}`)
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
        metadata: { ...data.metadata },
        items: data.items.map(item => ({
            colors: {
                main: {
                    cmyk: {
                        cyan: brand$3.asPercentile(item.colors.main.cmyk.cyan ?? 0),
                        magenta: brand$3.asPercentile(item.colors.main.cmyk.magenta ?? 0),
                        yellow: brand$3.asPercentile(item.colors.main.cmyk.yellow ?? 0),
                        key: brand$3.asPercentile(item.colors.main.cmyk.key ?? 0)
                    },
                    hex: {
                        hex: brand$3.asHexSet(item.colors.main.hex.hex ?? '#000000')
                    },
                    hsl: {
                        hue: brand$3.asRadial(item.colors.main.hsl.hue ?? 0),
                        saturation: brand$3.asPercentile(item.colors.main.hsl.saturation ?? 0),
                        lightness: brand$3.asPercentile(item.colors.main.hsl.lightness ?? 0)
                    },
                    hsv: {
                        hue: brand$3.asRadial(item.colors.main.hsv.hue ?? 0),
                        saturation: brand$3.asPercentile(item.colors.main.hsv.saturation ?? 0),
                        value: brand$3.asPercentile(item.colors.main.hsv.value ?? 0)
                    },
                    lab: {
                        l: brand$3.asLAB_L(item.colors.main.lab.l ?? 0),
                        a: brand$3.asLAB_A(item.colors.main.lab.a ?? 0),
                        b: brand$3.asLAB_B(item.colors.main.lab.b ?? 0)
                    },
                    rgb: {
                        red: brand$3.asByteRange(item.colors.main.rgb.red ?? 0),
                        green: brand$3.asByteRange(item.colors.main.rgb.green ?? 0),
                        blue: brand$3.asByteRange(item.colors.main.rgb.blue ?? 0)
                    },
                    xyz: {
                        x: brand$3.asXYZ_X(item.colors.main.xyz.x ?? 0),
                        y: brand$3.asXYZ_Y(item.colors.main.xyz.y ?? 0),
                        z: brand$3.asXYZ_Z(item.colors.main.xyz.z ?? 0)
                    }
                },
                stringProps: {
                    cmyk: {
                        cyan: String(item.colors.main.cmyk.cyan ?? 0),
                        magenta: String(item.colors.main.cmyk.magenta ?? 0),
                        yellow: String(item.colors.main.cmyk.yellow ?? 0),
                        key: String(item.colors.main.cmyk.key ?? 0)
                    },
                    hex: {
                        hex: String(item.colors.main.hex.hex ?? '#000000')
                    },
                    hsl: {
                        hue: String(item.colors.main.hsl.hue ?? 0),
                        saturation: String(item.colors.main.hsl.saturation ?? 0),
                        lightness: String(item.colors.main.hsl.lightness ?? 0)
                    },
                    hsv: {
                        hue: String(item.colors.main.hsv.hue ?? 0),
                        saturation: String(item.colors.main.hsv.saturation ?? 0),
                        value: String(item.colors.main.hsv.value ?? 0)
                    },
                    lab: {
                        l: String(item.colors.main.lab.l ?? 0),
                        a: String(item.colors.main.lab.a ?? 0),
                        b: String(item.colors.main.lab.b ?? 0)
                    },
                    rgb: {
                        red: String(item.colors.main.rgb.red ?? 0),
                        green: String(item.colors.main.rgb.green ?? 0),
                        blue: String(item.colors.main.rgb.blue ?? 0)
                    },
                    xyz: {
                        x: String(item.colors.main.xyz.x ?? 0),
                        y: String(item.colors.main.xyz.y ?? 0),
                        z: String(item.colors.main.xyz.z ?? 0)
                    }
                },
                css: {
                    cmyk: `cmyk(${item.colors.main.cmyk.cyan}%, ${item.colors.main.cmyk.magenta}%, ${item.colors.main.cmyk.yellow}%, ${item.colors.main.cmyk.key}%)`,
                    hex: `${item.colors.main.hex.hex}}`,
                    hsl: `hsl(${item.colors.main.hsl.hue}, ${item.colors.main.hsl.saturation}%, ${item.colors.main.hsl.lightness}%)`,
                    hsv: `hsv(${item.colors.main.hsv.hue}, ${item.colors.main.hsv.saturation}%, ${item.colors.main.hsv.value}%)`,
                    lab: `lab(${item.colors.main.lab.l}, ${item.colors.main.lab.a}, ${item.colors.main.lab.b})`,
                    rgb: `rgb(${item.colors.main.rgb.red}, ${item.colors.main.rgb.green}, ${item.colors.main.rgb.blue})`,
                    xyz: `xyz(${item.colors.main.xyz.x}, ${item.colors.main.xyz.y}, ${item.colors.main.xyz.z})`
                }
            }
        }))
    };
}
function componentToHex(component) {
    const thisMethod = 'common > transform > base > componentToHex()';
    try {
        const hex = Math.max(0, Math.min(255, component)).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
    catch (error) {
        if (!modeData.quiet && modeData.logging.error)
            logger$r.error(`componentToHex error: ${error}`, `${thisModule$r} > ${thisMethod}`);
        return '00';
    }
}
function defaultColorValue(color) {
    switch (color.format) {
        case 'cmyk':
            return {
                value: {
                    cyan: brand$3.asPercentile(0),
                    magenta: brand$3.asPercentile(0),
                    yellow: brand$3.asPercentile(0),
                    key: brand$3.asPercentile(0)
                },
                format: 'cmyk'
            };
        case 'hex':
            return {
                value: {
                    hex: brand$3.asHexSet('#000000')
                },
                format: 'hex'
            };
        case 'hsl':
            return {
                value: {
                    hue: brand$3.asRadial(0),
                    saturation: brand$3.asPercentile(0),
                    lightness: brand$3.asPercentile(0)
                },
                format: 'hsl'
            };
        case 'hsv':
            return {
                value: {
                    hue: brand$3.asRadial(0),
                    saturation: brand$3.asPercentile(0),
                    value: brand$3.asPercentile(0)
                },
                format: 'hsv'
            };
        case 'lab':
            return {
                value: {
                    l: brand$3.asLAB_L(0),
                    a: brand$3.asLAB_A(0),
                    b: brand$3.asLAB_B(0)
                },
                format: 'lab'
            };
        case 'rgb':
            return {
                value: {
                    red: brand$3.asByteRange(0),
                    green: brand$3.asByteRange(0),
                    blue: brand$3.asByteRange(0)
                },
                format: 'rgb'
            };
        case 'sl':
            return {
                value: {
                    saturation: brand$3.asPercentile(0),
                    lightness: brand$3.asPercentile(0)
                },
                format: 'sl'
            };
        case 'sv':
            return {
                value: {
                    saturation: brand$3.asPercentile(0),
                    value: brand$3.asPercentile(0)
                },
                format: 'sv'
            };
        case 'xyz':
            return {
                value: {
                    x: brand$3.asXYZ_X(0),
                    y: brand$3.asXYZ_Y(0),
                    z: brand$3.asXYZ_Z(0)
                },
                format: 'xyz'
            };
        default:
            throw new Error(`
				Unknown color format\nDetails: ${JSON.stringify(color)}`);
    }
}
const transformUtils = {
    addHashToHex,
    componentToHex,
    brandPalette,
    defaultColorValue
};

// File: common/utils/color.js
const logMode$o = modeData.logging;
const thisModule$q = 'common/utils/color.js';
const logger$q = await createLogger();
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
    return (coreUtils$2.guards.isColor(value) &&
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
    return (coreUtils$2.guards.isColor(value) &&
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
    return (coreUtils$2.guards.isColor(value) &&
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
async function narrowToColor(color) {
    if (isColorString(color)) {
        return coreUtils$2.convert.colorStringToColor(color);
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
    const thisMethod = 'colorToColorString()';
    const clonedColor = coreUtils$2.base.clone(color);
    if (isColorString(clonedColor)) {
        if (logMode$o.error) {
            logger$q.info(`Already formatted as color string: ${JSON.stringify(color)}`, `${thisModule$q} > ${thisMethod}`);
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
                key: `${newValue.key}%`
            }
        };
    }
    else if (isHex(clonedColor)) {
        const newValue = formatPercentageValues(clonedColor.value);
        return {
            format: 'hex',
            value: {
                hex: `${newValue.hex}`
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
                lightness: `${newValue.lightness}%`
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
                value: `${newValue.value}%`
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
                b: `${newValue.b}`
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
                blue: `${newValue.blue}`
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
                z: `${newValue.z}`
            }
        };
    }
    else {
        if (!modeData.gracefulErrors) {
            throw new Error(`Unsupported format: ${clonedColor.format}`);
        }
        else if (logMode$o.error) {
            logger$q.error(`Unsupported format: ${clonedColor.format}`, `${thisModule$q} > ${thisMethod}`);
        }
        else if (!modeData.quiet && logMode$o.warn) {
            logger$q.warn('Failed to convert to color string.', `${thisModule$q} > ${thisMethod}`);
        }
        return defaultData.colors.strings.hsl;
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
function getColorString(color) {
    const thisMethod = 'getColorString()';
    try {
        const formatters = {
            cmyk: (c) => `cmyk(${c.value.cyan}, ${c.value.magenta}, ${c.value.yellow}, ${c.value.key})`,
            hex: (c) => c.value.hex,
            hsl: (c) => `hsl(${c.value.hue}, ${c.value.saturation}%, ${c.value.lightness}%)`,
            hsv: (c) => `hsv(${c.value.hue}, ${c.value.saturation}%, ${c.value.value}%)`,
            lab: (c) => `lab(${c.value.l}, ${c.value.a}, ${c.value.b})`,
            rgb: (c) => `rgb(${c.value.red}, ${c.value.green}, ${c.value.blue})`,
            xyz: (c) => `xyz(${c.value.x}, ${c.value.y}, ${c.value.z})`
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
                if (!logMode$o.error)
                    logger$q.error(`Unsupported color format for ${color}`, `${thisModule$q} > ${thisMethod}`);
                return null;
        }
    }
    catch (error) {
        if (!logMode$o.error)
            logger$q.error(`getColorString error: ${error}`, `${thisModule$q} > ${thisMethod}`);
        return null;
    }
}
const parseColor = (colorSpace, value) => {
    const thisMethod = 'parseColor';
    try {
        switch (colorSpace) {
            case 'cmyk': {
                const [c, m, y, k] = parseComponents(value, 5);
                return {
                    value: {
                        cyan: coreUtils$2.brand.asPercentile(c),
                        magenta: coreUtils$2.brand.asPercentile(m),
                        yellow: coreUtils$2.brand.asPercentile(y),
                        key: coreUtils$2.brand.asPercentile(k)
                    },
                    format: 'cmyk'
                };
            }
            case 'hex':
                const hexValue = value.startsWith('#') ? value : `#${value}`;
                return {
                    value: {
                        hex: coreUtils$2.brand.asHexSet(hexValue)
                    },
                    format: 'hex'
                };
            case 'hsl': {
                const [h, s, l] = parseComponents(value, 4);
                return {
                    value: {
                        hue: coreUtils$2.brand.asRadial(h),
                        saturation: coreUtils$2.brand.asPercentile(s),
                        lightness: coreUtils$2.brand.asPercentile(l)
                    },
                    format: 'hsl'
                };
            }
            case 'hsv': {
                const [h, s, v] = parseComponents(value, 4);
                return {
                    value: {
                        hue: coreUtils$2.brand.asRadial(h),
                        saturation: coreUtils$2.brand.asPercentile(s),
                        value: coreUtils$2.brand.asPercentile(v)
                    },
                    format: 'hsv'
                };
            }
            case 'lab': {
                const [l, a, b] = parseComponents(value, 4);
                return {
                    value: {
                        l: coreUtils$2.brand.asLAB_L(l),
                        a: coreUtils$2.brand.asLAB_A(a),
                        b: coreUtils$2.brand.asLAB_B(b)
                    },
                    format: 'lab'
                };
            }
            case 'rgb': {
                const components = value.split(',').map(Number);
                if (components.some(isNaN))
                    throw new Error('Invalid RGB format');
                const [r, g, b] = components;
                return {
                    value: {
                        red: coreUtils$2.brand.asByteRange(r),
                        green: coreUtils$2.brand.asByteRange(g),
                        blue: coreUtils$2.brand.asByteRange(b)
                    },
                    format: 'rgb'
                };
            }
            default:
                const message = `Unsupported color format: ${colorSpace}`;
                if (modeData.gracefulErrors) {
                    if (logMode$o.error)
                        logger$q.error(message);
                    else if (!modeData.quiet && logMode$o.warn)
                        logger$q.warn(`Failed to parse color: ${message}`, `${thisModule$q} > ${thisMethod}`);
                }
                else {
                    throw new Error(message);
                }
                return null;
        }
    }
    catch (error) {
        if (logMode$o.error)
            logger$q.error(`parseColor error: ${error}`, `${thisModule$q} > ${thisMethod}`);
        return null;
    }
};
function parseComponents(value, count) {
    const thisMethod = 'parseComponents()';
    try {
        const components = value
            .split(',')
            .map(val => val.trim().endsWith('%')
            ? parseFloat(val)
            : parseFloat(val) * 100);
        if (components.length !== count)
            if (!modeData.gracefulErrors)
                throw new Error(`Expected ${count} components.`);
            else if (logMode$o.error) {
                if (!modeData.quiet && logMode$o.warn)
                    logger$q.warn(`Expected ${count} components.`, `${thisModule$q} > ${thisMethod}`);
                return [];
            }
        return components;
    }
    catch (error) {
        if (logMode$o.error)
            logger$q.error(`Error parsing components: ${error}`, `${thisModule$q} > ${thisMethod}`);
        return [];
    }
}
function stripHashFromHex(hex) {
    const thisMethod = 'stripHashFromHex()';
    try {
        const hexString = `${hex.value.hex}`;
        return hex.value.hex.startsWith('#')
            ? {
                value: {
                    hex: coreUtils$2.brand.asHexSet(hexString.slice(1))
                },
                format: 'hex'
            }
            : hex;
    }
    catch (error) {
        if (logMode$o.error)
            logger$q.error(`stripHashFromHex error: ${error}`, `${thisModule$q} > ${thisMethod}`);
        const unbrandedHex = coreUtils$2.base.clone(defaultData.colors.base.unbranded.hex);
        return coreUtils$2.brandColor.asHex(unbrandedHex);
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
const colorUtils = {
    colorToColorString,
    ensureHash,
    formatPercentageValues,
    getColorString,
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
    stripHashFromHex,
    stripPercentFromValues
};

// File: common/convert.js
const defaultColors$1 = defaultData.colors.base.unbranded;
const logMode$n = modeData.logging;
const thisModule$p = 'common/convert/base.js';
const logger$p = await createLogger();
const defaultCMYKUnbranded = base.clone(defaultColors$1.cmyk);
const defaultHexUnbranded = base.clone(defaultColors$1.hex);
const defaultHSLUnbranded = base.clone(defaultColors$1.hsl);
const defaultHSVUnbranded = base.clone(defaultColors$1.hsv);
const defaultLABUnbranded = base.clone(defaultColors$1.lab);
const defaultRGBUnbranded = base.clone(defaultColors$1.rgb);
const defaultSLUnbranded = base.clone(defaultColors$1.sl);
const defaultSVUnbranded = base.clone(defaultColors$1.sv);
const defaultXYZUnbranded = base.clone(defaultColors$1.xyz);
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
    const thisMethod = 'cmykToHSL()';
    try {
        if (!validate.colorValues(cmyk)) {
            if (logMode$n.error)
                logger$p.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultHSLBranded;
        }
        return rgbToHSL(cmykToRGB(base.clone(cmyk)));
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`cmykToHSL() error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultHSLBranded;
    }
}
function cmykToRGB(cmyk) {
    const thisMethod = 'cmykToRGB()';
    try {
        if (!validate.colorValues(cmyk)) {
            if (logMode$n.error)
                logger$p.error(`Invalid CMYK value ${JSON.stringify(cmyk)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultRGBBranded;
        }
        const clonedCMYK = base.clone(cmyk);
        const r = 255 *
            (1 - clonedCMYK.value.cyan / 100) *
            (1 - clonedCMYK.value.key / 100);
        const g = 255 *
            (1 - clonedCMYK.value.magenta / 100) *
            (1 - clonedCMYK.value.key / 100);
        const b = 255 *
            (1 - clonedCMYK.value.yellow / 100) *
            (1 - clonedCMYK.value.key / 100);
        const rgb = {
            value: {
                red: brand$3.asByteRange(Math.round(r)),
                green: brand$3.asByteRange(Math.round(g)),
                blue: brand$3.asByteRange(Math.round(b))
            },
            format: 'rgb'
        };
        return clampRGB(rgb);
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`cmykToRGB error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultRGBBranded;
    }
}
function hexToHSL(hex) {
    const thisMethod = 'hexToHSL()';
    try {
        if (!validate.colorValues(hex)) {
            if (logMode$n.error)
                logger$p.error(`Invalid Hex value ${JSON.stringify(hex)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultHSLBranded;
        }
        return rgbToHSL(hexToRGB(base.clone(hex)));
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`hexToHSL() error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultHSLBranded;
    }
}
function hexToHSLWrapper(input) {
    const thisMethod = 'hexToHSLWrapper()';
    try {
        const clonedInput = base.clone(input);
        const hex = typeof clonedInput === 'string'
            ? {
                value: {
                    hex: brand$3.asHexSet(clonedInput)
                },
                format: 'hex'
            }
            : {
                value: {
                    hex: brand$3.asHexSet(clonedInput.value.hex)
                },
                format: 'hex'
            };
        return hexToHSL(hex);
    }
    catch (error) {
        if (logMode$n.error) {
            logger$p.error(`Error converting hex to HSL: ${error}`, `${thisModule$p} > ${thisMethod}`);
        }
        return defaultHSLBranded;
    }
}
function hexToRGB(hex) {
    const thisMethod = 'hexToRGB()';
    try {
        if (!validate.colorValues(hex)) {
            if (logMode$n.error)
                logger$p.error(`Invalid Hex value ${JSON.stringify(hex)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultRGBBranded;
        }
        const clonedHex = clone(hex);
        const strippedHex = stripHashFromHex(clonedHex).value.hex;
        const bigint = parseInt(strippedHex, 16);
        return {
            value: {
                red: brand$3.asByteRange(Math.round((bigint >> 16) & 255)),
                green: brand$3.asByteRange(Math.round((bigint >> 8) & 255)),
                blue: brand$3.asByteRange(Math.round(bigint & 255))
            },
            format: 'rgb'
        };
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`hexToRGB error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultRGBBranded;
    }
}
function hslToCMYK(hsl) {
    const thisMethod = 'hslToCMYK()';
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode$n.error)
                logger$p.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultCMYKBranded;
        }
        return rgbToCMYK(hslToRGB(clone(hsl)));
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`Error converting HSL ${JSON.stringify(hsl)} to CMYK: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultCMYKBranded;
    }
}
function hslToHex(hsl) {
    const thisMethod = 'hslToHex()';
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode$n.error)
                logger$p.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultHexBranded;
        }
        return rgbToHex(hslToRGB(clone(hsl)));
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`hslToHex error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultHexBranded;
    }
}
function hslToHSV(hsl) {
    const thisMethod = 'hslToHSV()';
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode$n.error)
                logger$p.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultHSVBranded;
        }
        const clonedHSL = clone(hsl);
        const s = clonedHSL.value.saturation / 100;
        const l = clonedHSL.value.lightness / 100;
        const value = l + s * Math.min(l, 1 - 1);
        const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);
        return {
            value: {
                hue: brand$3.asRadial(Math.round(clonedHSL.value.hue)),
                saturation: brand$3.asPercentile(Math.round(newSaturation * 100)),
                value: brand$3.asPercentile(Math.round(value * 100))
            },
            format: 'hsv'
        };
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`hslToHSV() error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultHSVBranded;
    }
}
function hslToLAB(hsl) {
    const thisMethod = 'hslToLAB()';
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode$n.error)
                logger$p.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultLABBranded;
        }
        return xyzToLAB(rgbToXYZ(hslToRGB(clone(hsl))));
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`hslToLab() error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultLABBranded;
    }
}
function hslToRGB(hsl) {
    const thisMethod = 'hslToRGB()';
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode$n.error)
                logger$p.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultRGBBranded;
        }
        const clonedHSL = clone(hsl);
        const s = clonedHSL.value.saturation / 100;
        const l = clonedHSL.value.lightness / 100;
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        return {
            value: {
                red: brand$3.asByteRange(Math.round(hueToRGB(p, q, clonedHSL.value.hue + 1 / 3) * 255)),
                green: brand$3.asByteRange(Math.round(hueToRGB(p, q, clonedHSL.value.hue) * 255)),
                blue: brand$3.asByteRange(Math.round(hueToRGB(p, q, clonedHSL.value.hue - 1 / 3) * 255))
            },
            format: 'rgb'
        };
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`hslToRGB error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultRGBBranded;
    }
}
function hslToSL(hsl) {
    const thisMethod = 'hslToSL()';
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode$n.error)
                logger$p.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultSLBranded;
        }
        return {
            value: {
                saturation: hsl.value.saturation,
                lightness: hsl.value.lightness
            },
            format: 'sl'
        };
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`Error converting HSL to SL: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultSLBranded;
    }
}
function hslToSV(hsl) {
    const thisMethod = 'hslToSV()';
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode$n.error)
                logger$p.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultSVBranded;
        }
        return hsvToSV(rgbToHSV(hslToRGB(clone(hsl))));
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`Error converting HSL to SV: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultSVBranded;
    }
}
function hslToXYZ(hsl) {
    const thisMethod = 'hslToXYZ()';
    try {
        if (!validate.colorValues(hsl)) {
            if (logMode$n.error)
                logger$p.error(`Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultXYZBranded;
        }
        return labToXYZ(hslToLAB(clone(hsl)));
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`hslToXYZ error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultXYZBranded;
    }
}
function hsvToHSL(hsv) {
    const thisMethod = 'hsvToHSL()';
    try {
        if (!validate.colorValues(hsv)) {
            if (logMode$n.error)
                logger$p.error(`Invalid HSV value ${JSON.stringify(hsv)}`, `${thisModule$p} > ${thisMethod}`);
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
                hue: brand$3.asRadial(Math.round(clonedHSV.value.hue)),
                saturation: brand$3.asPercentile(Math.round(newSaturation * 100)),
                lightness: brand$3.asPercentile(Math.round(lightness))
            },
            format: 'hsl'
        };
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`hsvToHSL() error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultHSLBranded;
    }
}
function hsvToSV(hsv) {
    const thisMethod = 'hsvToSV()';
    try {
        if (!validate.colorValues(hsv)) {
            if (logMode$n.error)
                logger$p.error(`Invalid HSV value ${JSON.stringify(hsv)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultSVBranded;
        }
        return {
            value: {
                saturation: hsv.value.saturation,
                value: hsv.value.value
            },
            format: 'sv'
        };
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`Error converting HSV to SV: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultSVBranded;
    }
}
function labToHSL(lab) {
    const thisMethod = 'labToHSL()';
    try {
        if (!validate.colorValues(lab)) {
            if (logMode$n.error)
                logger$p.error(`Invalid LAB value ${JSON.stringify(lab)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultHSLBranded;
        }
        return rgbToHSL(labToRGB(clone(lab)));
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`labToHSL() error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultHSLBranded;
    }
}
function labToRGB(lab) {
    try {
        if (!validate.colorValues(lab)) {
            if (logMode$n.error)
                logger$p.error(`Invalid LAB value ${JSON.stringify(lab)}`, `${thisModule$p} > labToRGB()`);
            return defaultRGBBranded;
        }
        return xyzToRGB(labToXYZ(clone(lab)));
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`labToRGB error: ${error}`, `${thisModule$p} > labToRGB()`);
        return defaultRGBBranded;
    }
}
function labToXYZ(lab) {
    const thisMethod = 'labToXYZ()';
    try {
        if (!validate.colorValues(lab)) {
            if (logMode$n.error)
                logger$p.error(`Invalid LAB value ${JSON.stringify(lab)}`, `${thisModule$p} > ${thisMethod}`);
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
                x: brand$3.asXYZ_X(Math.round(refX *
                    (pow(x, 3) > 0.008856
                        ? pow(x, 3)
                        : (x - 16 / 116) / 7.787))),
                y: brand$3.asXYZ_Y(Math.round(refY *
                    (pow(y, 3) > 0.008856
                        ? pow(y, 3)
                        : (y - 16 / 116) / 7.787))),
                z: brand$3.asXYZ_Z(Math.round(refZ *
                    (pow(z, 3) > 0.008856
                        ? pow(z, 3)
                        : (z - 16 / 116) / 7.787)))
            },
            format: 'xyz'
        };
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`labToXYZ error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultXYZBranded;
    }
}
function rgbToCMYK(rgb) {
    const thisMethod = 'rgbToCMYK()';
    try {
        if (!validate.colorValues(rgb)) {
            if (logMode$n.error)
                logger$p.error(`Invalid RGB value ${JSON.stringify(rgb)}`, `${thisModule$p} > ${thisMethod}`);
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
        const format = 'cmyk';
        const cmyk = { value: { cyan, magenta, yellow, key }, format };
        if (!modeData.quiet)
            logger$p.info(`Converted RGB ${JSON.stringify(clonedRGB)} to CMYK: ${JSON.stringify(clone(cmyk))}`, `${thisModule$p} > ${thisMethod}`);
        return cmyk;
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`Error converting RGB to CMYK: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultCMYKBranded;
    }
}
function rgbToHex(rgb) {
    const thisMethod = 'rgbToHex()';
    try {
        if (!validate.colorValues(rgb)) {
            if (logMode$n.error)
                logger$p.error(`Invalid RGB value ${JSON.stringify(rgb)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultHexBranded;
        }
        const clonedRGB = clone(rgb);
        if ([
            clonedRGB.value.red,
            clonedRGB.value.green,
            clonedRGB.value.blue
        ].some(v => isNaN(v) || v < 0 || v > 255)) {
            if (logMode$n.warn)
                logger$p.warn(`Invalid RGB values:\nR=${JSON.stringify(clonedRGB.value.red)}\nG=${JSON.stringify(clonedRGB.value.green)}\nB=${JSON.stringify(clonedRGB.value.blue)}`, `${thisModule$p} > ${thisMethod}`);
            return {
                value: {
                    hex: brand$3.asHexSet('#000000FF')
                },
                format: 'hex'
            };
        }
        return {
            value: {
                hex: brand$3.asHexSet(`#${componentToHex(clonedRGB.value.red)}${componentToHex(clonedRGB.value.green)}${componentToHex(clonedRGB.value.blue)}`)
            },
            format: 'hex'
        };
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.warn(`rgbToHex error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultHexBranded;
    }
}
function rgbToHSL(rgb) {
    const thisMethod = 'rgbToHSL()';
    try {
        if (!validate.colorValues(rgb)) {
            if (logMode$n.error) {
                logger$p.error(`Invalid RGB value ${JSON.stringify(rgb)}`, `${thisModule$p} > ${thisMethod}`);
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
                hue: brand$3.asRadial(Math.round(hue)),
                saturation: brand$3.asPercentile(Math.round(saturation * 100)),
                lightness: brand$3.asPercentile(Math.round(lightness * 100))
            },
            format: 'hsl'
        };
    }
    catch (error) {
        if (logMode$n.error) {
            logger$p.error(`rgbToHSL() error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        }
        return defaultHSLBranded;
    }
}
function rgbToHSV(rgb) {
    const thisMethod = 'rgbToHSV()';
    try {
        if (!validate.colorValues(rgb)) {
            if (logMode$n.error) {
                logger$p.error(`Invalid RGB value ${JSON.stringify(rgb)}`, `${thisModule$p} > ${thisMethod}`);
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
                hue: brand$3.asRadial(Math.round(hue)),
                saturation: brand$3.asPercentile(Math.round(saturation * 100)),
                value: brand$3.asPercentile(Math.round(value * 100))
            },
            format: 'hsv'
        };
    }
    catch (error) {
        if (logMode$n.error) {
            logger$p.error(`rgbToHSV() error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        }
        return defaultHSVBranded;
    }
}
function rgbToXYZ(rgb) {
    const thisMethod = 'rgbToXYZ()';
    try {
        if (!validate.colorValues(rgb)) {
            if (logMode$n.error) {
                logger$p.error(`Invalid RGB value ${JSON.stringify(rgb)}`, `${thisModule$p} > ${thisMethod}`);
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
                x: brand$3.asXYZ_X(Math.round(scaledRed * 0.4124 +
                    scaledGreen * 0.3576 +
                    scaledBlue * 0.1805)),
                y: brand$3.asXYZ_Y(Math.round(scaledRed * 0.2126 +
                    scaledGreen * 0.7152 +
                    scaledBlue * 0.0722)),
                z: brand$3.asXYZ_Z(Math.round(scaledRed * 0.0193 +
                    scaledGreen * 0.1192 +
                    scaledBlue * 0.9505))
            },
            format: 'xyz'
        };
    }
    catch (error) {
        if (logMode$n.error) {
            logger$p.error(`rgbToXYZ error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        }
        return defaultXYZBranded;
    }
}
function xyzToHSL(xyz) {
    const thisMethod = 'xyzToHSL()';
    try {
        if (!validate.colorValues(xyz)) {
            if (logMode$n.error)
                logger$p.error(`Invalid XYZ value ${JSON.stringify(xyz)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultHSLBranded;
        }
        return rgbToHSL(xyzToRGB(clone(xyz)));
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`xyzToHSL() error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultHSLBranded;
    }
}
function xyzToLAB(xyz) {
    const thisMethod = 'xyzToLAB()';
    try {
        if (!validate.colorValues(xyz)) {
            if (logMode$n.error)
                logger$p.error(`Invalid XYZ value ${JSON.stringify(xyz)}`, `${thisModule$p} > ${thisMethod}`);
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
                l: brand$3.asLAB_L(Math.round(l)),
                a: brand$3.asLAB_A(Math.round(a)),
                b: brand$3.asLAB_B(Math.round(b))
            },
            format: 'lab'
        };
        if (!validate.colorValues(lab)) {
            if (logMode$n.error)
                logger$p.error(`Invalid LAB value ${JSON.stringify(lab)}`, `${thisModule$p} > ${thisMethod}`);
            return defaultLABBranded;
        }
        return lab;
    }
    catch (error) {
        if (logMode$n.error)
            logger$p.error(`xyzToLab() error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        return defaultLABBranded;
    }
}
function xyzToRGB(xyz) {
    const thisMethod = 'xyzToRGB()';
    try {
        if (!validate.colorValues(xyz)) {
            if (logMode$n.error) {
                logger$p.error(`Invalid XYZ value ${JSON.stringify(xyz)}`, `${thisModule$p} > ${thisMethod}`);
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
                red: brand$3.asByteRange(Math.round(red)),
                green: brand$3.asByteRange(Math.round(green)),
                blue: brand$3.asByteRange(Math.round(blue))
            },
            format: 'rgb'
        });
        return rgb;
    }
    catch (error) {
        if (logMode$n.error) {
            logger$p.error(`xyzToRGB error: ${error}`, `${thisModule$p} > ${thisMethod}`);
        }
        return defaultRGBBranded;
    }
}
// ******** BUNDLED CONVERSION FUNCTIONS ********
function hslTo$1(color, colorSpace) {
    const thisMethod = 'hslTo()';
    try {
        if (!validate.colorValues(color)) {
            logger$p.error(`Invalid color value ${JSON.stringify(color)}`, `${thisModule$p} > ${thisMethod}`);
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
    const thisMethod = 'toHSL()';
    try {
        if (!validate.colorValues(color)) {
            logger$p.error(`Invalid color value ${JSON.stringify(color)}`, `${thisModule$p} > ${thisMethod}`);
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
const coreConversionUtils = {
    hslTo: hslTo$1,
    toHSL,
    wrappers: {
        hexToHSL: hexToHSLWrapper
    }
};

// File: common/helpers/dom.js
const logMode$m = modeData.logging;
const thisModule$o = 'common/helpers/dom.js';
const logger$o = await createLogger();
async function validateAndConvertColor(color) {
    const thisMethod = 'validateAndConvertColor()';
    if (!color)
        return null;
    const convertedColor = coreUtils$2.guards.isColorString(color)
        ? await coreUtils$2.convert.colorStringToColor(color)
        : color;
    if (!coreUtils$2.validate.colorValues(convertedColor)) {
        if (logMode$m.error)
            logger$o.error(`Invalid color: ${JSON.stringify(convertedColor)}`, `${thisModule$o} > ${thisMethod}`);
        return null;
    }
    return convertedColor;
}
const domHelpers = {
    validateAndConvertColor
};

// File: common/helpers/index.js
const helpers$1 = {
    conversion: conversionHelpers,
    dom: domHelpers
};

// File: common/utils/conversion.js
const logMode$l = modeData.logging;
const thisModule$n = 'common/utils/conversion.js';
const logger$n = await createLogger();
function getConversionFn(from, to) {
    const thisMethod = 'getConversionFn()';
    try {
        const fnName = `${from}To${to[0].toUpperCase() + to.slice(1)}`;
        if (!(fnName in conversionUtils))
            return undefined;
        const conversionFn = conversionUtils[fnName];
        return (value) => structuredClone(conversionFn(value));
    }
    catch (error) {
        if (logMode$l.error)
            logger$n.error(`Error getting conversion function: ${error}`, `${thisModule$n} > ${thisMethod}`);
        return undefined;
    }
}
function genAllColorValues$1(color) {
    const thisMethod = 'genAllColorValues()';
    const result = {};
    try {
        const clonedColor = coreUtils$2.base.clone(color);
        if (!coreUtils$2.validate.colorValues(clonedColor)) {
            if (logMode$l.error)
                logger$n.error(`Invalid color: ${JSON.stringify(clonedColor)}`, `${thisModule$n} > ${thisMethod}`);
            return {};
        }
        result.cmyk = coreConversionUtils.hslTo(clonedColor, 'cmyk');
        result.hex = coreConversionUtils.hslTo(clonedColor, 'hex');
        result.hsl = clonedColor;
        result.hsv = coreConversionUtils.hslTo(clonedColor, 'hsv');
        result.lab = coreConversionUtils.hslTo(clonedColor, 'lab');
        result.rgb = coreConversionUtils.hslTo(clonedColor, 'rgb');
        result.sl = coreConversionUtils.hslTo(clonedColor, 'sl');
        result.sv = coreConversionUtils.hslTo(clonedColor, 'sv');
        result.xyz = coreConversionUtils.hslTo(clonedColor, 'xyz');
        return result;
    }
    catch (error) {
        if (logMode$l.error)
            logger$n.error(`Error generating all color values: ${error}`, `${thisModule$n} > ${thisMethod}`);
        return {};
    }
}
const conversionUtils = {
    genAllColorValues: genAllColorValues$1,
    getConversionFn
};

// File: common/utils/errors.js
const logMode$k = modeData.logging;
const thisModule$m = 'common/utils/errors.ts';
const logger$m = await createLogger();
async function handleAsync(action, errorMessage, context) {
    const thisMethod = 'handleAsync()';
    try {
        return await action();
    }
    catch (error) {
        if (logMode$k.error)
            if (error instanceof Error) {
                logger$m.error(`${errorMessage}: ${error.message}. Context: ${context}`, `${thisModule$m} > ${thisMethod}`);
            }
            else {
                logger$m.error(`${errorMessage}: ${error}. Context: ${context}`, `${thisModule$m} > ${thisMethod}`);
            }
        return null;
    }
}
const errorUtils = {
    handleAsync
};

// File: common/utils/palette.js
const logMode$j = modeData.logging;
const thisModule$l = 'common/utils/palette.js';
const logger$l = await createLogger();
function createObject(type, items, swatches, paletteID, limitDark, limitGray, limitLight) {
    return {
        id: `${type}_${paletteID}`,
        items,
        metadata: {
            name: '',
            timestamp: coreUtils$2.getFormattedTimestamp(),
            swatches,
            type,
            flags: {
                limitDarkness: limitDark,
                limitGrayness: limitGray,
                limitLightness: limitLight
            }
        }
    };
}
async function populateOutputBox(color, boxNumber) {
    const thisMethod = 'populateOutputBox()';
    try {
        const clonedColor = coreUtils$2.guards.isColor(color)
            ? coreUtils$2.base.clone(color)
            : await coreUtils$2.convert.colorStringToColor(color);
        if (!coreUtils$2.validate.colorValues(clonedColor)) {
            if (logMode$j.error)
                logger$l.error('Invalid color values.', `${thisModule$l} > ${thisMethod}`);
            return;
        }
        const colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);
        if (!colorTextOutputBox)
            return;
        const stringifiedColor = await coreUtils$2.convert.colorToCSSColorString(clonedColor);
        if (!modeData.quiet && logMode$j.info && logMode$j.verbosity > 0)
            logger$l.info(`Adding CSS-formatted color to DOM ${stringifiedColor}`, `${thisModule$l} > ${thisMethod}`);
        colorTextOutputBox.value = stringifiedColor;
        colorTextOutputBox.setAttribute('data-format', color.format);
    }
    catch (error) {
        if (logMode$j.error)
            logger$l.error(`Failed to populate color text output box: ${error}`, `${thisModule$l} > ${thisMethod}`);
        return;
    }
}
const paletteUtils = {
    createObject,
    populateOutputBox
};

// File: common/utils/random.js
const logMode$i = modeData.logging;
const thisModule$k = 'common/utils/random.js';
const logger$k = await createLogger();
function hsl() {
    const thisMethod = 'hsl()';
    try {
        const hsl = {
            value: {
                hue: coreUtils$2.sanitize.radial(Math.floor(Math.random() * 360)),
                saturation: coreUtils$2.sanitize.percentile(Math.floor(Math.random() * 101)),
                lightness: coreUtils$2.sanitize.percentile(Math.floor(Math.random() * 101))
            },
            format: 'hsl'
        };
        if (!coreUtils$2.validate.colorValues(hsl)) {
            if (logMode$i.error)
                logger$k.error(`Invalid random HSL color value ${JSON.stringify(hsl)}`, `${thisModule$k} > ${thisMethod}`);
            const unbrandedHSL = coreUtils$2.base.clone(defaultData.colors.base.unbranded.hsl);
            return coreUtils$2.brandColor.asHSL(unbrandedHSL);
        }
        if (!modeData.quiet && !logMode$i.info)
            logger$k.info(`Generated randomHSL: ${JSON.stringify(hsl)}`, `${thisModule$k} > ${thisMethod}`);
        return hsl;
    }
    catch (error) {
        if (logMode$i.error)
            logger$k.error(`Error generating random HSL color: ${error}`, `${thisModule$k} > ${thisMethod}`);
        const unbrandedHSL = coreUtils$2.base.clone(defaultData.colors.base.unbranded.hsl);
        return coreUtils$2.brandColor.asHSL(unbrandedHSL);
    }
}
function sl$1() {
    const thisMethod = 'sl()';
    try {
        const sl = {
            value: {
                saturation: coreUtils$2.sanitize.percentile(Math.max(0, Math.min(100, Math.random() * 100))),
                lightness: coreUtils$2.sanitize.percentile(Math.max(0, Math.min(100, Math.random() * 100)))
            },
            format: 'sl'
        };
        if (!coreUtils$2.validate.colorValues(sl)) {
            if (logMode$i.error)
                logger$k.error(`Invalid random SV color value ${JSON.stringify(sl)}`, `${thisModule$k} > ${thisMethod}`);
            const unbrandedSL = coreUtils$2.base.clone(defaultData.colors.base.unbranded.sl);
            return coreUtils$2.brandColor.asSL(unbrandedSL);
        }
        if (!modeData.quiet && logMode$i.info)
            logger$k.info(`Generated randomSL: ${JSON.stringify(sl)}`, `${thisModule$k} > ${thisMethod}`);
        return sl;
    }
    catch (error) {
        if (logMode$i.error)
            logger$k.error(`Error generating random SL color: ${error}`, `${thisModule$k} > ${thisMethod}`);
        const unbrandedSL = coreUtils$2.base.clone(defaultData.colors.base.unbranded.sl);
        return coreUtils$2.brandColor.asSL(unbrandedSL);
    }
}
const randomUtils = {
    hsl,
    sl: sl$1
};

// File common/utils/index.js
const utils$c = {
    color: colorUtils,
    conversion: conversionUtils,
    errors: errorUtils,
    palette: paletteUtils,
    random: randomUtils
};

// File: common/index.js
const commonFn = {
    convert: coreConversionUtils,
    core: coreUtils$2,
    helpers: helpers$1,
    transform: transformUtils,
    utils: utils$c
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
    // This mapping exists in reverseTransformCache but doesn't exist in transformCache. This
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

// db/initialize.js
// File: db/initialize.js
async function initializeDB() {
    return openDB('paletteDB', 1, {
        upgrade: db => {
            const storeNames = Object.values(configData.db.STORE_NAMES);
            storeNames.forEach(storeName => {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'key' });
                }
            });
        }
    });
}

// File: db/utils.js
async function withStore(db, storeName, mode, callback) {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    callback(store);
    await tx.done;
}
const dbUtils = {
    store: { withStore }
};

// File: db/IDBManager.js
const thisModule$j = 'db/IDBManager.js';
const logger$j = await createLogger();
class IDBManager {
    static instance = null;
    dbPromise;
    dbData = configData.db;
    mode = modeData;
    logMode = modeData.logging;
    cache = {};
    defaultKeys = configData.db.DEFAULT_KEYS;
    defaultSettings = configData.db.DEFAULT_SETTINGS;
    storeNames = configData.db.STORE_NAMES;
    utils;
    dbUtils;
    constructor() {
        this.dbPromise = initializeDB();
        this.dbData = this.dbData;
        this.defaultKeys = configData.db.DEFAULT_KEYS;
        this.defaultSettings = configData.db.DEFAULT_SETTINGS;
        this.storeNames = configData.db.STORE_NAMES;
        this.mode = modeData;
        this.dbUtils = dbUtils;
        this.utils = commonFn.utils;
    }
    //
    ///
    //// * * * * * * * * * * * * * * * * * * * * * *
    ///// * * * * * * STATIC METHODS * * * * * * *
    //// * * * * * * * * * * * * * * * * * * * * * *
    ///
    //
    static async getInstance() {
        if (!this.instance) {
            this.instance = new IDBManager();
            await this.instance.dbPromise;
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
        const thisMethod = 'createMutationLogger()';
        const self = this;
        return new Proxy(obj, {
            set(target, property, value) {
                const oldValue = target[property];
                const success = Reflect.set(target, property, value);
                if (success) {
                    const mutationLog = {
                        timestamp: new Date().toISOString(),
                        key,
                        action: 'update',
                        newValue: { [property]: value },
                        oldValue: { [property]: oldValue },
                        origin: 'Proxy'
                    };
                    if (self.logMode.info)
                        logger$j.info(`Mutation detected: ${JSON.stringify(mutationLog)}`, `${thisModule$j} > ${thisMethod}`);
                    self.persistMutation(mutationLog).catch(err => {
                        if (self.logMode.error)
                            logger$j.error(`Failed to persist mutation: ${err.message}`, `${thisModule$j} > ${thisMethod}`);
                    });
                }
                return success;
            }
        });
    }
    createPaletteObject(type, items, paletteID, swatches, limitDark, limitGray, limitLight) {
        return this.utils.palette.createObject(type, items, swatches, paletteID, limitDark, limitGray, limitLight);
    }
    // *DEV-NOTE* add this method to docs
    async deleteEntry(storeName, key) {
        const thisMethod = 'deleteEntry()';
        return this.utils.errors.handleAsync(async () => {
            if (!(await this.ensureEntryExists(storeName, key))) {
                if (this.logMode.warn) {
                    logger$j.warn(`Entry with key ${key} not found.`, `${thisModule$j} > ${thisMethod}`);
                }
                return;
            }
            const db = await this.getDB();
            const store = db
                .transaction(storeName, 'readwrite')
                .objectStore(storeName);
            await store.delete(key);
            if (!this.mode.quiet) {
                logger$j.info(`Entry with key ${key} deleted successfully.`, `${thisModule$j} > ${thisMethod}`);
            }
        }, 'IDBManager.deleteData(): Error deleting entry');
    }
    async deleteEntries(storeName, keys) {
        const thisMethod = 'deleteEntries()';
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            const store = db
                .transaction(storeName, 'readwrite')
                .objectStore(storeName);
            const validKeys = (await Promise.all(keys.map(async (key) => (await this.ensureEntryExists(storeName, key))
                ? key
                : null))).filter((key) => key !== null);
            await Promise.all(validKeys.map(key => store.delete(key)));
            if (!this.mode.quiet) {
                logger$j.info(`Entries deleted successfully. Keys: ${validKeys}`, `${thisModule$j} > ${thisMethod}`);
            }
        }, 'IDBManager.deleteEntries(): Error deleting entries');
    }
    async getCurrentPaletteID() {
        const thisMethod = 'getCurrentPaletteID()';
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            const settings = await db.get(this.storeNames['SETTINGS'], this.getDefaultKey('APP_SETTINGS'));
            if (this.mode.debug)
                logger$j.info(`Fetched settings from IndexedDB: ${settings}`, `${thisModule$j} > ${thisMethod}`);
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
    async getDB() {
        return this.dbPromise;
    }
    getLoggedObject(obj, key) {
        if (obj) {
            return this.createMutationLogger(obj, key);
        }
        return null;
    }
    async getNextPaletteID() {
        return this.utils.errors.handleAsync(async () => {
            const currentID = await this.getCurrentPaletteID();
            const newID = currentID + 1;
            await this.updateCurrentPaletteID(newID);
            return newID;
        }, 'IDBManager.getNextPaletteID(): Error fetching next palette ID');
    }
    async getMutations() {
        const store = await this.getStore('settings', 'readonly');
        const entries = await store.getAll();
        return entries.filter(entry => entry.key.startsWith('mutation_'));
    }
    async getNextTableID() {
        return this.utils.errors.handleAsync(async () => {
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
    async getPaletteHistory() {
        const thisMethod = 'getPaletteHistory()';
        try {
            const db = await this.getDB();
            const tx = db.transaction('settings', 'readwrite');
            const store = tx.objectStore('settings');
            let entry = await store.get('paletteHistory');
            if (!entry) {
                entry = { key: 'paletteHistory', palettes: [] };
                await store.put(entry);
                await tx.done;
            }
            return entry.palettes;
        }
        catch (error) {
            logger$j.error(`Error retrieving palette history: ${error}`, `${thisModule$j} > ${thisMethod}`);
            return [];
        }
    }
    async getSettings() {
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            const settings = await db.get(this.storeNames['SETTINGS'], this.getDefaultKey('APP_SETTINGS'));
            return settings ?? this.defaultSettings;
        }, 'IDBManager.getSettings(): Error fetching settings');
    }
    async getStore(storeName, mode) {
        const db = await this.getDB();
        return db.transaction(storeName, mode).objectStore(storeName);
    }
    async persistMutation(data) {
        const caller = 'persistMutation()';
        const db = await this.getDB();
        await db.put('mutations', data);
        logger$j.info(`Persisted mutation: ${JSON.stringify(data)}`, `${thisModule$j} > ${caller}`);
    }
    async resetDatabase() {
        const thisMethod = 'resetDatabase()';
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            const availableStores = Array.from(db.objectStoreNames);
            const expectedStores = Object.values(this.storeNames);
            for (const storeName of expectedStores) {
                if (!availableStores.includes(storeName)) {
                    logger$j.warn(`Object store "${storeName}" not found in IndexedDB.`, `${thisModule$j} > ${thisMethod}`);
                    continue;
                }
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                await store.clear();
                await tx.done;
                const settingsStore = db
                    .transaction(this.storeNames['SETTINGS'], 'readwrite')
                    .objectStore(this.storeNames['SETTINGS']);
                await settingsStore.put(this.defaultSettings, this.getDefaultKey('APP_SETTINGS'));
                if (!this.mode.quiet)
                    logger$j.info(`IndexedDB has been reset to default settings.`, `${thisModule$j} > ${thisMethod}`);
            }
        }, 'IDBManager.resetDatabase(): Error resetting database');
    }
    async deleteDatabase() {
        const thisMethod = 'deleteDatabase()';
        await this.utils.errors.handleAsync(async () => {
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
                        logger$j.info(`Database "${dbName}" deleted successfully.`, `${thisModule$j} > ${thisMethod}`);
                };
                deleteRequest.onerror = event => {
                    logger$j.error(`Error deleting database "${dbName}":\nEvent: ${event}`, `${thisModule$j} > ${thisMethod}`);
                };
                deleteRequest.onblocked = () => {
                    if (this.logMode.warn)
                        logger$j.warn(`Delete operation blocked. Ensure no open connections to "${dbName}".`, `${thisModule$j} > ${thisMethod}`);
                    if (this.mode.showAlerts)
                        alert(`Unable to delete database "${dbName}" because it is in use. Please close all other tabs or windows accessing this database and try again.`);
                    if (this.mode.stackTrace)
                        console.trace(`Blocked call stack:`);
                };
            }
            else {
                if (!this.mode.quiet)
                    logger$j.warn(`Database "${dbName}" does not exist.`, `${thisModule$j} > ${thisMethod}`);
            }
        }, 'IDBManager.deleteDatabase(): Error deleting database');
    }
    // *DEV-NOTE* add this method to docs
    async resetPaletteID() {
        const thisMethod = 'resetPaletteID()';
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            const storeName = this.storeNames['SETTINGS'];
            const key = this.getDefaultKey('APP_SETTINGS');
            const settings = await db.get(storeName, key);
            if (!settings)
                throw new Error('Settings not found. Cannot reset palette ID.');
            settings.lastPaletteID = 0;
            await db.put(storeName, { key, ...this.defaultSettings });
            if (!this.mode.quiet)
                logger$j.info(`Palette ID has successfully been reset to 0`, `${thisModule$j} > ${thisMethod}`);
        }, 'IDBManager.resetPaletteID(): Error resetting palette ID');
    }
    async saveData(storeName, key, data, oldValue) {
        const thisMethod = 'saveData()';
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            await this.dbUtils.store.withStore(db, storeName, 'readwrite', async (store) => {
                await store.put({ key, ...data });
                logger$j.mutation({
                    timestamp: new Date().toISOString(),
                    key,
                    action: 'update',
                    newValue: data,
                    oldValue: oldValue || null,
                    origin: 'saveData'
                }, mutationLog => {
                    console.log('Mutation log triggered for saveData:', mutationLog);
                }, `${thisModule$j} > ${thisMethod}`);
            });
        }, 'IDBManager.saveData(): Error saving data');
    }
    async savePaletteToDB(type, items, paletteID, numBoxes, limitDark, limitGray, limitLight) {
        return this.utils.errors.handleAsync(async () => {
            const newPalette = this.createPaletteObject(type, items, paletteID, numBoxes, limitDark, limitGray, limitLight);
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
    async savePalette(id, newPalette) {
        const thisMethod = 'savePalette()';
        return this.utils.errors.handleAsync(async () => {
            const store = await this.getStore('tables', 'readwrite');
            const paletteToSave = {
                tableID: newPalette.tableID,
                palette: newPalette.palette
            };
            await store.put({ key: id, ...paletteToSave });
            if (!this.mode.quiet && this.logMode.info)
                logger$j.info(`Palette ${id} saved successfully.`, `${thisModule$j} > ${thisMethod}`);
        }, 'IDBManager.savePalette(): Error saving palette');
    }
    async savePaletteHistory(paletteHistory) {
        const db = await this.getDB();
        const tx = db.transaction('settings', 'readwrite');
        const store = tx.objectStore('settings');
        await store.put({ key: 'paletteHistory', palettes: paletteHistory });
        await tx.done;
    }
    async saveSettings(newSettings) {
        const thisMethod = 'saveSettings()';
        return this.utils.errors.handleAsync(async () => {
            await this.saveData('settings', 'appSettings', newSettings);
            if (!this.mode.quiet && this.logMode.info)
                logger$j.info('Settings updated', `${thisModule$j} > ${thisMethod}`);
        }, 'IDBManager.saveSettings(): Error saving settings');
    }
    async updateEntryInPalette(tableID, entryIndex, newEntry) {
        const thisMethod = 'updateEntryInPalette()';
        return this.utils.errors.handleAsync(async () => {
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
                if (this.logMode.error)
                    logger$j.error(`Entry ${entryIndex} not found in palette ${tableID}.`, `${thisModule$j} > ${thisMethod}`);
                if (!this.mode.quiet && this.logMode.info)
                    logger$j.warn('updateEntryInPalette: Entry not found.', `${thisModule$j} > ${thisMethod}`);
            }
            const oldEntry = items[entryIndex];
            items[entryIndex] = newEntry;
            await this.saveData('tables', tableID, storedPalette);
            logger$j.mutation({
                timestamp: new Date().toISOString(),
                key: `${tableID}-${entryIndex}]`,
                action: 'update',
                newValue: newEntry,
                oldValue: oldEntry,
                origin: 'updateEntryInPalette'
            }, mutationLog => console.log(`Mutation log trigger for updateEntryInPalette:`, mutationLog), `${thisModule$j} > ${thisMethod}`);
            if (!this.mode.quiet && this.logMode.info)
                logger$j.info(`Entry ${entryIndex} in palette ${tableID} updated.`);
        }, 'IDBManager.updateEntryInPalette(): Error updating entry in palette');
    }
    //
    ///
    ///// * * * *  * * * * * * * * * * * * * * * *
    ////// * * * * * * PRIVATE METHODS * * * * * *
    ///// * * * *  * * * * * * * * * * * * * * * *
    ///
    //
    async ensureEntryExists(storeName, key) {
        const db = await this.getDB();
        const store = db
            .transaction(storeName, 'readonly')
            .objectStore(storeName);
        return (await store.get(key)) !== undefined;
    }
    getDefaultKey(key) {
        const defaultKey = this.defaultKeys[key];
        if (!defaultKey) {
            throw new Error(`[getDefaultKey()]: Invalid default key: ${key}`);
        }
        return defaultKey;
    }
    async getTable(id) {
        const thisMethod = 'getTable()';
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            const result = await db.get(this.storeNames.TABLES, id);
            if (!result) {
                if (this.logMode.warn)
                    logger$j.warn(`Table with ID ${id} not found.`, `${thisModule$j} > ${thisMethod}`);
            }
            return result;
        }, 'IDBManager.getTable(): Error fetching table');
    }
    async updateCurrentPaletteID(newID) {
        const thisMethod = 'updateCurrentPaletteID()';
        return this.utils.errors.handleAsync(async () => {
            const db = await this.getDB();
            const tx = db.transaction('settings', 'readwrite');
            const store = tx.objectStore('settings');
            await store.put({ key: 'appSettings', lastPaletteID: newID });
            await tx.done;
            if (!this.mode.quiet)
                logger$j.info(`Current palette ID updated to ${newID}`, `${thisModule$j} > ${thisMethod}`);
        }, 'IDBManager.updateCurrentPaletteID(): Error updating current palette ID');
    }
}

// File: data/consts.js
const adjustments$1 = {
    slaValue: 10
};
const debounce = {
    btn: 300,
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
const paletteRanges$5 = {
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
const constsData = {
    adjustments: adjustments$1,
    debounce,
    limits: limits$3,
    paletteRanges: paletteRanges$5,
    probabilities: probabilities$1,
    thresholds,
    timeouts: timeouts$1
};

// File: data/dom/dom.js
const domClasses$1 = {
    colorDisplay: 'color-display',
    colorInput: 'color-input',
    colorStripe: 'color-stripe',
    colorSwatch: 'color-swatch',
    dragBtn: 'drag-btn',
    lockBtn: 'lock-btn'
};
const dynamicIds = {
    btns: {
        colorBoxLockBtn1: 'color-box-lock-btn-1',
        colorBoxLockBtn2: 'color-box-lock-btn-2',
        colorBoxLockBtn3: 'color-box-lock-btn-3',
        colorBoxLockBtn4: 'color-box-lock-btn-4',
        colorBoxLockBtn5: 'color-box-lock-btn-5',
        colorBoxLockBtn6: 'color-box-lock-btn-6'
    },
    divs: {
        colorBox1: 'color-box-1',
        colorBox2: 'color-box-1',
        colorBox3: 'color-box-1',
        colorBox4: 'color-box-1',
        colorBox5: 'color-box-1',
        colorBox6: 'color-box-1',
        colorBoxDragBar1: 'color-box-drag-bar-1',
        colorBoxDragBar2: 'color-box-drag-bar-2',
        colorBoxDragBar3: 'color-box-drag-bar-3',
        colorBoxDragBar4: 'color-box-drag-bar-4',
        colorBoxDragBar5: 'color-box-drag-bar-5',
        colorBoxDragBar6: 'color-box-drag-bar-6',
        colorDisplay1: 'color-display-1',
        colorDisplay2: 'color-display-2',
        colorDisplay3: 'color-display-3',
        colorDisplay4: 'color-display-4',
        colorDisplay5: 'color-display-5',
        colorDisplay6: 'color-display-6'
    },
    inputs: {
        colorPicker1: 'color-picker-input-1',
        colorPicker2: 'color-picker-input-2',
        colorPicker3: 'color-picker-input-3',
        colorPicker4: 'color-picker-input-4',
        colorPicker5: 'color-picker-input-5',
        colorPicker6: 'color-picker-input-6',
        export: 'export-input'
    },
    selects: {},
    spans: {}
};
const staticIds = {
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
        historyLimit: 'history-limit-input',
        limitDarkChkbx: 'limit-dark-chkbx',
        limitGrayChkbx: 'limit-gray-chkbx',
        limitLightChkbx: 'limit-light-chkbx'
    },
    selects: {
        exportFormatOption: 'export-format-option-selector',
        paletteType: 'palette-type-selector',
        swatch: 'swatch-selector',
        swatchGen: 'swatch-gen-selector'
    }
};
// ******** Helpers ********
function getElement(id) {
    return document.getElementById(id);
}
const dynamicDivIds = dynamicIds.divs;
const dynamicInputIds = dynamicIds.inputs;
const staticBtnIds = staticIds.btns;
const staticDivIds = staticIds.divs;
const staticInputIds = staticIds.inputs;
const staticSelectIds = staticIds.selects;
// ******** Dynamic DOM Data ********
const dynamicDomElements = {
    get btns() {
        return {
            colorBoxLockBtn1: getElement(dynamicIds.btns.colorBoxLockBtn1),
            colorBoxLockBtn2: getElement(dynamicIds.btns.colorBoxLockBtn2),
            colorBoxLockBtn3: getElement(dynamicIds.btns.colorBoxLockBtn3),
            colorBoxLockBtn4: getElement(dynamicIds.btns.colorBoxLockBtn4),
            colorBoxLockBtn5: getElement(dynamicIds.btns.colorBoxLockBtn5),
            colorBoxLockBtn6: getElement(dynamicIds.btns.colorBoxLockBtn6)
        };
    },
    get divs() {
        return {
            colorBox1: getElement(dynamicDivIds.colorBox1),
            colorBox2: getElement(dynamicDivIds.colorBox2),
            colorBox3: getElement(dynamicDivIds.colorBox3),
            colorBox4: getElement(dynamicDivIds.colorBox4),
            colorBox5: getElement(dynamicDivIds.colorBox5),
            colorBox6: getElement(dynamicDivIds.colorBox6),
            colorBoxDragBar1: getElement(dynamicDivIds.colorBoxDragBar1),
            colorBoxDragBar2: getElement(dynamicDivIds.colorBoxDragBar2),
            colorBoxDragBar3: getElement(dynamicDivIds.colorBoxDragBar3),
            colorBoxDragBar4: getElement(dynamicDivIds.colorBoxDragBar4),
            colorBoxDragBar5: getElement(dynamicDivIds.colorBoxDragBar5),
            colorBoxDragBar6: getElement(dynamicDivIds.colorBoxDragBar6),
            colorDisplay1: getElement(dynamicDivIds.colorDisplay1),
            colorDisplay2: getElement(dynamicDivIds.colorDisplay2),
            colorDisplay3: getElement(dynamicDivIds.colorDisplay3),
            colorDisplay4: getElement(dynamicDivIds.colorDisplay4),
            colorDisplay5: getElement(dynamicDivIds.colorDisplay5),
            colorDisplay6: getElement(dynamicDivIds.colorDisplay6)
        };
    },
    get inputs() {
        return {
            colorPicker1: getElement(dynamicInputIds.colorPicker1),
            colorPicker2: getElement(dynamicInputIds.colorPicker2),
            colorPicker3: getElement(dynamicInputIds.colorPicker3),
            colorPicker4: getElement(dynamicInputIds.colorPicker4),
            colorPicker5: getElement(dynamicInputIds.colorPicker5),
            colorPicker6: getElement(dynamicInputIds.colorPicker6),
            export: getElement(dynamicInputIds.export)
        };
    },
    get selects() {
        return {};
    },
    get spans() {
        return {};
    }
};
const dynamicDomIds = {
    btns: {
        colorBoxLockBtn1: dynamicIds.btns.colorBoxLockBtn1,
        colorBoxLockBtn2: dynamicIds.btns.colorBoxLockBtn2,
        colorBoxLockBtn3: dynamicIds.btns.colorBoxLockBtn3,
        colorBoxLockBtn4: dynamicIds.btns.colorBoxLockBtn4,
        colorBoxLockBtn5: dynamicIds.btns.colorBoxLockBtn5,
        colorBoxLockBtn6: dynamicIds.btns.colorBoxLockBtn6
    },
    divs: {
        colorBox1: dynamicDivIds.colorBox1,
        colorBox2: dynamicDivIds.colorBox2,
        colorBox3: dynamicDivIds.colorBox3,
        colorBox4: dynamicDivIds.colorBox4,
        colorBox5: dynamicDivIds.colorBox5,
        colorBox6: dynamicDivIds.colorBox6,
        colorDisplay1: dynamicDivIds.colorDisplay1,
        colorDisplay2: dynamicDivIds.colorDisplay2,
        colorDisplay3: dynamicDivIds.colorDisplay3,
        colorDisplay4: dynamicDivIds.colorDisplay4,
        colorDisplay5: dynamicDivIds.colorDisplay5,
        colorDisplay6: dynamicDivIds.colorDisplay6,
        colorBoxDragBar1: dynamicDivIds.colorBoxDragBar1,
        colorBoxDragBar2: dynamicDivIds.colorBoxDragBar2,
        colorBoxDragBar3: dynamicDivIds.colorBoxDragBar3,
        colorBoxDragBar4: dynamicDivIds.colorBoxDragBar4,
        colorBoxDragBar5: dynamicDivIds.colorBoxDragBar5,
        colorBoxDragBar6: dynamicDivIds.colorBoxDragBar6
    },
    inputs: {
        colorPicker1: dynamicInputIds.colorPicker1,
        colorPicker2: dynamicInputIds.colorPicker2,
        colorPicker3: dynamicInputIds.colorPicker3,
        colorPicker4: dynamicInputIds.colorPicker4,
        colorPicker5: dynamicInputIds.colorPicker5,
        colorPicker6: dynamicInputIds.colorPicker6,
        export: dynamicInputIds.export
    },
    selects: {},
    spans: {}
};
// ******** Static DOM Data ********
const staticDomElements = {
    get btns() {
        return {
            desaturate: getElement(staticBtnIds.desaturate),
            export: getElement(staticBtnIds.export),
            generate: getElement(staticBtnIds.generate),
            helpMenu: getElement(staticBtnIds.helpMenu),
            historyMenu: getElement(staticBtnIds.historyMenu),
            import: getElement(staticBtnIds.import),
            saturate: getElement(staticBtnIds.saturate),
            showAsCMYK: getElement(staticBtnIds.showAsCMYK),
            showAsHex: getElement(staticBtnIds.showAsHex),
            showAsHSL: getElement(staticBtnIds.showAsHSL),
            showAsHSV: getElement(staticBtnIds.showAsHSV),
            showAsLAB: getElement(staticBtnIds.showAsLAB),
            showAsRGB: getElement(staticBtnIds.showAsRGB)
        };
    },
    get divs() {
        return {
            helpMenu: getElement(staticDivIds.helpMenu),
            historyMenu: getElement(staticDivIds.historyMenu),
            paletteContainer: getElement(staticDivIds.paletteContainer),
            paletteHistory: getElement(staticDivIds.paletteHistory)
        };
    },
    get inputs() {
        return {
            historyLimit: getElement(staticInputIds.historyLimit),
            limitDarkChkbx: getElement(staticInputIds.limitDarkChkbx),
            limitGrayChkbx: getElement(staticInputIds.limitGrayChkbx),
            limitLightChkbx: getElement(staticInputIds.limitLightChkbx)
        };
    },
    get selects() {
        return {
            exportFormatOption: getElement(staticSelectIds.exportFormatOption),
            paletteType: getElement(staticSelectIds.paletteType),
            swatch: getElement(staticSelectIds.swatch),
            swatchGen: getElement(staticSelectIds.swatchGen)
        };
    }
};
const staticDomIds = {
    btns: {
        desaturate: staticBtnIds.desaturate,
        export: staticBtnIds.export,
        generate: staticBtnIds.generate,
        helpMenu: staticBtnIds.helpMenu,
        historyMenu: staticBtnIds.historyMenu,
        import: staticBtnIds.import,
        saturate: staticBtnIds.saturate,
        showAsCMYK: staticBtnIds.showAsCMYK,
        showAsHex: staticBtnIds.showAsHex,
        showAsHSL: staticBtnIds.showAsHSL,
        showAsHSV: staticBtnIds.showAsHSV,
        showAsLAB: staticBtnIds.showAsLAB,
        showAsRGB: staticBtnIds.showAsRGB
    },
    divs: {
        helpMenu: staticDivIds.helpMenu,
        historyMenu: staticDivIds.historyMenu,
        paletteHistory: staticDivIds.paletteHistory,
        paletteContainer: staticDivIds.paletteContainer
    },
    inputs: {
        historyLimit: staticInputIds.historyLimit,
        limitDarkChkbx: staticInputIds.limitDarkChkbx,
        limitGrayChkbx: staticInputIds.limitGrayChkbx,
        limitLightChkbx: staticInputIds.limitLightChkbx
    },
    selects: {
        exportFormatOption: staticSelectIds.exportFormatOption,
        paletteType: staticSelectIds.paletteType,
        swatch: staticSelectIds.swatch,
        swatchGen: staticSelectIds.swatchGen
    }
};
// ******** Final DOM Data Object ********
const domData = {
    classes: domClasses$1,
    ids: {
        dynamic: dynamicDomIds,
        static: staticDomIds
    },
    elements: {
        dynamic: dynamicDomElements,
        static: staticDomElements
    }
};

// File: dom/eventListeners/utils.js
const logMode$h = modeData.logging;
const thisModule$i = 'dom/eventListeners/utils.js';
const appUtils = commonFn.utils;
const coreUtils$1 = commonFn.core;
const logger$i = await createLogger();
// 1. BASE DOM UTILITIES
async function switchColorSpace(targetFormat) {
    const thisMethod = 'switchColorSpace()';
    try {
        const colorTextOutputBoxes = document.querySelectorAll('.color-text-output-box');
        for (const box of colorTextOutputBoxes) {
            const inputBox = box;
            const colorValues = inputBox.colorValues;
            if (!colorValues || !coreUtils$1.validate.colorValues(colorValues)) {
                if (logMode$h.error)
                    logger$i.error('Invalid color values. Cannot display toast.', `${thisModule$i} > ${thisMethod}`);
                continue;
            }
            const currentFormat = inputBox.getAttribute('data-format');
            if (!modeData.quiet && logMode$h.info && logMode$h.verbosity >= 2)
                logger$i.info(`Converting from ${currentFormat} to ${targetFormat}`, `${thisModule$i} > ${thisMethod}`);
            const convertFn = appUtils.conversion.getConversionFn(currentFormat, targetFormat);
            if (!convertFn) {
                if (logMode$h.error)
                    logger$i.error(`Conversion from ${currentFormat} to ${targetFormat} is not supported.`, `${thisModule$i} > ${thisMethod}`);
                continue;
            }
            if (colorValues.format === 'xyz') {
                if (logMode$h.error)
                    logger$i.error('Cannot convert from XYZ to another color space.', `${thisModule$i} > ${thisMethod}`);
                continue;
            }
            const clonedColor = await appUtils.color.narrowToColor(colorValues);
            if (!clonedColor ||
                appUtils.color.isSLColor(clonedColor) ||
                appUtils.color.isSVColor(clonedColor) ||
                appUtils.color.isXYZ(clonedColor)) {
                if (logMode$h.verbosity >= 3 && logMode$h.error)
                    logger$i.error('Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.', `${thisModule$i} > ${thisMethod}`);
                continue;
            }
            if (!clonedColor) {
                if (logMode$h.error)
                    logger$i.error(`Conversion to ${targetFormat} failed.`, `${thisModule$i} > ${thisMethod}`);
                continue;
            }
            const newColor = coreUtils$1.base.clone(convertFn(clonedColor));
            if (!newColor) {
                if (logMode$h.error)
                    logger$i.error(`Conversion to ${targetFormat} failed.`, `${thisModule$i} > ${thisMethod}`);
                continue;
            }
            inputBox.value = String(newColor);
            inputBox.setAttribute('data-format', targetFormat);
        }
    }
    catch (error) {
        if (!modeData.quiet && logMode$h.warn)
            logger$i.warn('Failed to convert colors.', `${thisModule$i} > ${thisMethod}`);
        else if (!modeData.gracefulErrors)
            throw new Error(`Failed to convert colors: ${error}`);
        else if (logMode$h.error)
            logger$i.error(`Failed to convert colors: ${error}`);
    }
}
// 2. EVENT UTILITIES
function addEventListener$1(id, eventType, callback) {
    const thisFunction = 'addEventListener()';
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener(eventType, callback);
    }
    else if (logMode$h.warn) {
        if (modeData.debug && logMode$h.warn && logMode$h.verbosity > 2)
            logger$i.warn(`Element with id "${id}" not found.`, `${thisModule$i} > ${thisFunction}`);
    }
}
const addConversionListener$1 = (id, colorSpace) => {
    const thisFunction = 'addConversionListener()';
    const btn = document.getElementById(id);
    if (btn) {
        if (coreUtils$1.guards.isColorSpace(colorSpace)) {
            btn.addEventListener('click', () => switchColorSpace(colorSpace));
        }
        else {
            if (logMode$h.warn) {
                logger$i.warn(`Invalid color space provided: ${colorSpace}`, `${thisModule$i} > ${thisFunction}`);
            }
        }
    }
    else {
        if (logMode$h.warn)
            logger$i.warn(`Element with id "${id}" not found.`, `${thisModule$i} > ${thisFunction}`);
    }
};
const event = {
    addEventListener: addEventListener$1,
    addConversionListener: addConversionListener$1
};
// 3. FILE UTILS
function download(data, filename, type) {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}
const file$2 = {
    download,
    readFile
};
const utils$b = {
    switchColorSpace,
    event,
    file: file$2
};

// File: io/parse/color.js
const brand$2 = commonFn.core.brand;
const regex$3 = configData.regex;
const colorParsers = {};
const cmykParser = {
    parse(input) {
        const match = input.match(regex$3.colors.cmyk);
        if (!match) {
            throw new Error(`Invalid CMYK string format: ${input}`);
        }
        const [_, cyan, magenta, yellow, key = '1'] = match;
        const value = {
            cyan: brand$2.asPercentile(parseFloat(cyan) / 100),
            magenta: brand$2.asPercentile(parseFloat(magenta) / 100),
            yellow: brand$2.asPercentile(parseFloat(yellow) / 100),
            key: brand$2.asPercentile(parseFloat(key) / 100)
        };
        return { format: 'cmyk', value };
    }
};
const hexParser = {
    parse(input) {
        const match = input.match(regex$3.colors.hex);
        if (!match) {
            throw new Error(`Invalid Hex string format: ${input}`);
        }
        const hex = brand$2.asHexSet(match[1].substring(0, 6));
        return {
            format: 'hex',
            value: { hex }
        };
    }
};
const hslParser = {
    parse(input) {
        const match = input.match(regex$3.colors.hsl);
        if (!match) {
            throw new Error(`Invalid HSL string format: ${input}`);
        }
        const [_, hue, saturation, lightness] = match;
        const value = {
            hue: brand$2.asRadial(parseFloat(hue)),
            saturation: brand$2.asPercentile(parseFloat(saturation) / 100),
            lightness: brand$2.asPercentile(parseFloat(lightness) / 100)
        };
        return { format: 'hsl', value };
    }
};
const hsvParser = {
    parse(input) {
        const match = input.match(regex$3.colors.hsv);
        if (!match) {
            throw new Error(`Invalid HSV string format: ${input}`);
        }
        const [_, hue, saturation, value] = match;
        const hsvValue = {
            hue: brand$2.asRadial(parseFloat(hue)),
            saturation: brand$2.asPercentile(parseFloat(saturation) / 100),
            value: brand$2.asPercentile(parseFloat(value) / 100)
        };
        return { format: 'hsv', value: hsvValue };
    }
};
const labParser = {
    parse(input) {
        const match = input.match(regex$3.colors.lab);
        if (!match) {
            throw new Error(`Invalid LAB string format: ${input}`);
        }
        const [_, l, a, b] = match;
        const labValue = {
            l: brand$2.asLAB_L(parseFloat(l)),
            a: brand$2.asLAB_A(parseFloat(a)),
            b: brand$2.asLAB_B(parseFloat(b))
        };
        return { format: 'lab', value: labValue };
    }
};
const rgbParser = {
    parse(input) {
        const match = input.match(regex$3.colors.rgb);
        if (!match) {
            throw new Error(`Invalid RGB string format: ${input}`);
        }
        const [_, red, green, blue] = match;
        const rgbValue = {
            red: brand$2.asByteRange(parseFloat(red)),
            green: brand$2.asByteRange(parseFloat(green)),
            blue: brand$2.asByteRange(parseFloat(blue))
        };
        return { format: 'rgb', value: rgbValue };
    }
};
const xyzParser = {
    parse(input) {
        const match = input.match(regex$3.colors.xyz);
        if (!match) {
            throw new Error(`Invalid XYZ string format: ${input}`);
        }
        const [_, x, y, z] = match;
        const xyzValue = {
            x: brand$2.asXYZ_X(parseFloat(x)),
            y: brand$2.asXYZ_Y(parseFloat(y)),
            z: brand$2.asXYZ_Z(parseFloat(z))
        };
        return { format: 'xyz', value: xyzValue };
    }
};
colorParsers['cmyk'] = cmykParser;
colorParsers['hex'] = hexParser;
colorParsers['hsl'] = hslParser;
colorParsers['hsv'] = hsvParser;
colorParsers['lab'] = labParser;
colorParsers['rgb'] = rgbParser;
colorParsers['xyz'] = xyzParser;
function asColorString(format, input) {
    const parser = colorParsers[format.toLowerCase()];
    if (!parser) {
        throw new Error(`No parser available for format: ${format}`);
    }
    return parser.parse(input);
}
// ******** CSS COLOR STRINGS ********
function asCSSColorString(format, input) {
    const color = asColorString(format, input);
    switch (color.format) {
        case 'cmyk':
            const cmyk = color.value;
            return `cmyk(${cmyk.cyan * 100}%, ${cmyk.magenta * 100}%, ${cmyk.yellow * 100}%, ${cmyk.key * 100}`;
        case 'hex':
            const hex = color.value;
            return `#${hex.hex}}`;
        case 'hsl':
            const hsl = color.value;
            return `hsl(${hsl.hue}, ${hsl.saturation * 100}%, ${hsl.lightness * 100}%})`;
        case 'hsv':
            const hsv = color.value;
            return `hsv(${hsv.hue}, ${hsv.saturation * 100}%, ${hsv.value * 100}%})`;
        case 'lab':
            const lab = color.value;
            return `lab(${lab.l}, ${lab.a}, ${lab.b}})`;
        case 'rgb':
            const rgb = color.value;
            return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
        case 'xyz':
            const xyz = color.value;
            return `xyz(${xyz.x}, ${xyz.y}, ${xyz.z})`;
        default:
            throw new Error(`Unsupported color format: ${color.format}`);
    }
}

// File: io/parse/colorValue.js
function asCMYKValue(colorString) {
    const parsed = asColorString('cmyk', colorString);
    if (parsed && parsed.format === 'cmyk') {
        return parsed.value;
    }
    throw new Error(`Invalid CMYK color string: ${colorString}`);
}
function asHexValue(colorValue) {
    const parsed = asColorString('hex', colorValue);
    if (parsed && parsed.format === 'hex') {
        return parsed.value;
    }
    throw new Error(`Invalid Hex color value: ${colorValue}`);
}
function asHSLValue(colorValue) {
    const parsed = asColorString('hsl', colorValue);
    if (parsed && parsed.format === 'hsl') {
        return parsed.value;
    }
    throw new Error(`Invalid HSL color value: ${colorValue}`);
}
function asHSVValue(colorValue) {
    const parsed = asColorString('hsv', colorValue);
    if (parsed && parsed.format === 'hsv') {
        return parsed.value;
    }
    throw new Error(`Invalid HSV color value: ${colorValue}`);
}
function asLABValue(colorValue) {
    const parsed = asColorString('lab', colorValue);
    if (parsed && parsed.format === 'lab') {
        return parsed.value;
    }
    throw new Error(`Invalid LAB color value: ${colorValue}`);
}
function asRGBValue(colorValue) {
    const parsed = asColorString('rgb', colorValue);
    if (parsed && parsed.format === 'rgb') {
        return parsed.value;
    }
    throw new Error(`Invalid RGB color value: ${colorValue}`);
}
function asXYZValue(colorValue) {
    const parsed = asColorString('xyz', colorValue);
    if (parsed && parsed.format === 'xyz') {
        return parsed.value;
    }
    throw new Error(`Invalid XYZ color value: ${colorValue}`);
}
const asColorValue = {
    cmyk: asCMYKValue,
    hex: asHexValue,
    hsl: asHSLValue,
    hsv: asHSVValue,
    lab: asLABValue,
    rgb: asRGBValue,
    xyz: asXYZValue
};

// File: io/parse/base.js
const brand$1 = commonFn.core.brand;
const logMode$g = modeData.logging;
const regex$2 = {
    cmyk: configData.regex.colors.cmyk,
    hex: configData.regex.colors.hex,
    hsl: configData.regex.colors.hsl,
    hsv: configData.regex.colors.hsv,
    lab: configData.regex.colors.lab,
    rgb: configData.regex.colors.rgb,
    xyz: configData.regex.colors.xyz
};
const thisModule$h = 'io/parse/base.js';
const logger$h = await createLogger();
function parseCMYKColorValue(rawCMYK) {
    const caller = 'parseCMYKColorValue()';
    if (!rawCMYK) {
        if (!modeData.quiet && logMode$g.warn && logMode$g.verbosity >= 2) {
            logger$h.warn('A CMYK element could not be found while parsing palette file. Injecting default values.', `${thisModule$h} > ${caller}`);
        }
        else {
            logger$h.debug('Missing CMYK element in palette file.', `${thisModule$h} > ${caller}`);
        }
        if (modeData.stackTrace)
            console.trace('Stack Trace:');
        return {
            cyan: brand$1.asPercentile(0),
            magenta: brand$1.asPercentile(0),
            yellow: brand$1.asPercentile(0),
            key: brand$1.asPercentile(0)
        };
    }
    const match = rawCMYK.match(regex$2.cmyk);
    return match
        ? {
            cyan: brand$1.asPercentile(parseFloat(match[1])),
            magenta: brand$1.asPercentile(parseFloat(match[2])),
            yellow: brand$1.asPercentile(parseFloat(match[3])),
            key: brand$1.asPercentile(parseFloat(match[4]))
        }
        : {
            cyan: brand$1.asPercentile(0),
            magenta: brand$1.asPercentile(0),
            yellow: brand$1.asPercentile(0),
            key: brand$1.asPercentile(0)
        };
}
function parseHexColorValue(rawHex) {
    const caller = 'parseHexColorValue()';
    if (!rawHex) {
        if (!modeData.quiet && logMode$g.warn && logMode$g.verbosity >= 2) {
            logger$h.warn('A Hex element could not be found while parsing palette file. Injecting default values.', `${thisModule$h} > ${caller}`);
        }
        else {
            logger$h.debug('Missing Hex element in palette file.', `${thisModule$h} > ${caller}`);
        }
        if (modeData.stackTrace)
            console.trace('Stack Trace:');
        return { hex: brand$1.asHexSet('#000000') };
    }
    const match = rawHex.match(regex$2.hex);
    return match
        ? {
            hex: brand$1.asHexSet(`#${match[1]}`)
        }
        : {
            hex: brand$1.asHexSet('#000000')
        };
}
function parseHSLColorValue(rawHSL) {
    const caller = 'parseHSLColorValue()';
    if (!rawHSL) {
        if (!modeData.quiet && logMode$g.warn && logMode$g.verbosity >= 2) {
            logger$h.warn('An HSL element could not be found while parsing palette file. Injecting default values.', `${thisModule$h} > ${caller}`);
        }
        else {
            logger$h.debug('Missing HSL element in palette file.', `${thisModule$h} > ${caller}`);
        }
        if (modeData.stackTrace)
            console.trace('Stack Trace:');
        return {
            hue: brand$1.asRadial(0),
            saturation: brand$1.asPercentile(0),
            lightness: brand$1.asPercentile(0)
        };
    }
    const match = rawHSL.match(regex$2.hsl);
    return match
        ? {
            hue: brand$1.asRadial(parseFloat(match[1])),
            saturation: brand$1.asPercentile(parseFloat(match[2])),
            lightness: brand$1.asPercentile(parseFloat(match[3]))
        }
        : {
            hue: brand$1.asRadial(0),
            saturation: brand$1.asPercentile(0),
            lightness: brand$1.asPercentile(0)
        };
}
function parseHSVColorValue(rawHSV) {
    const caller = 'parseHSVColorValue()';
    if (!rawHSV) {
        if (!modeData.quiet && logMode$g.warn && logMode$g.verbosity >= 2) {
            logger$h.warn('An HSV element could not be found while parsing palette file. Injecting default values.', `${thisModule$h} > ${caller}`);
        }
        else {
            logger$h.debug('Missing HSV element in palette file.', `${thisModule$h} > ${caller}`);
        }
        if (modeData.stackTrace)
            console.trace('Stack Trace:');
        return {
            hue: brand$1.asRadial(0),
            saturation: brand$1.asPercentile(0),
            value: brand$1.asPercentile(0)
        };
    }
    const match = rawHSV.match(regex$2.hsv);
    return match
        ? {
            hue: brand$1.asRadial(parseFloat(match[1])),
            saturation: brand$1.asPercentile(parseFloat(match[2])),
            value: brand$1.asPercentile(parseFloat(match[3]))
        }
        : {
            hue: brand$1.asRadial(0),
            saturation: brand$1.asPercentile(0),
            value: brand$1.asPercentile(0)
        };
}
function parseLABColorValue(rawLAB) {
    const caller = 'parseLABColorValue()';
    if (!rawLAB) {
        if (!modeData.quiet && logMode$g.warn && logMode$g.verbosity >= 2) {
            logger$h.warn('A LAB element could not be found while parsing palette file. Injecting default values.', `${thisModule$h} > ${caller}`);
        }
        else {
            logger$h.debug('Missing LAB element in palette file.', `${thisModule$h} > ${caller}`);
        }
        if (modeData.stackTrace)
            console.trace('Stack Trace:');
        return {
            l: brand$1.asLAB_L(0),
            a: brand$1.asLAB_A(0),
            b: brand$1.asLAB_B(0)
        };
    }
    const match = rawLAB.match(regex$2.lab);
    return match
        ? {
            l: brand$1.asLAB_L(parseFloat(match[1])),
            a: brand$1.asLAB_A(parseFloat(match[2])),
            b: brand$1.asLAB_B(parseFloat(match[3]))
        }
        : {
            l: brand$1.asLAB_L(0),
            a: brand$1.asLAB_A(0),
            b: brand$1.asLAB_B(0)
        };
}
function parseRGBColorValue(rawRGB) {
    const caller = 'parseRGBColorValue()';
    if (!rawRGB) {
        if (!modeData.quiet && logMode$g.warn && logMode$g.verbosity >= 2) {
            logger$h.warn('An RGB element could not be found while parsing palette file. Injecting default values.', `${thisModule$h} > ${caller}`);
        }
        else {
            logger$h.debug('Missing RGB element in palette file.', `${thisModule$h} > ${caller}`);
        }
        if (modeData.stackTrace)
            console.trace('Stack Trace:');
        return {
            red: brand$1.asByteRange(0),
            green: brand$1.asByteRange(0),
            blue: brand$1.asByteRange(0)
        };
    }
    const match = rawRGB.match(regex$2.rgb);
    return match
        ? {
            red: brand$1.asByteRange(parseFloat(match[1])),
            green: brand$1.asByteRange(parseFloat(match[2])),
            blue: brand$1.asByteRange(parseFloat(match[3]))
        }
        : {
            red: brand$1.asByteRange(0),
            green: brand$1.asByteRange(0),
            blue: brand$1.asByteRange(0)
        };
}
function parseXYZColorValue(rawXYZ) {
    const caller = 'parseXYZColorValue()';
    if (!rawXYZ) {
        if (!modeData.quiet && logMode$g.warn && logMode$g.verbosity >= 2) {
            logger$h.warn('An XYZ element could not be found while parsing palette file. Injecting default values.', `${thisModule$h} > ${caller}`);
        }
        else {
            logger$h.debug('Missing XYZ element in palette file.', `${thisModule$h} > ${caller}`);
        }
        if (modeData.stackTrace)
            console.trace('Stack Trace:');
        return {
            x: brand$1.asXYZ_X(0),
            y: brand$1.asXYZ_Y(0),
            z: brand$1.asXYZ_Z(0)
        };
    }
    const match = rawXYZ.match(regex$2.xyz);
    return match
        ? {
            x: brand$1.asXYZ_X(parseFloat(match[1])),
            y: brand$1.asXYZ_Y(parseFloat(match[2])),
            z: brand$1.asXYZ_Z(parseFloat(match[3]))
        }
        : {
            x: brand$1.asXYZ_X(0),
            y: brand$1.asXYZ_Y(0),
            z: brand$1.asXYZ_Z(0)
        };
}
const color = {
    cmyk: parseCMYKColorValue,
    hex: parseHexColorValue,
    hsl: parseHSLColorValue,
    hsv: parseHSVColorValue,
    lab: parseLABColorValue,
    rgb: parseRGBColorValue,
    xyz: parseXYZColorValue
};

// File: io/parse/json.js
const logMode$f = modeData.logging;
const mode = modeData;
const thisModule$g = 'io/parse/json.ts';
const logger$g = await createLogger();
function file$1(jsonData) {
    const caller = 'file()';
    try {
        const parsed = JSON.parse(jsonData);
        // Validate that the parsed object matches the expected structure
        if (!parsed.items || !Array.isArray(parsed.items)) {
            throw new Error('Invalid JSON structure for Palette');
        }
        return Promise.resolve(parsed);
    }
    catch (error) {
        if (!mode.quiet && logMode$f.error && logMode$f.verbosity > 1) {
            logger$g.error(`Error parsing JSON file: ${error}`, `${thisModule$g} > ${caller}`);
            if (mode.showAlerts)
                alert(`Error parsing JSON file. See console for details.`);
        }
        return Promise.resolve(null);
    }
}
const json = {
    file: file$1
};

// File: io/parse/index.js
const ioParseUtils = {
    asColorValue,
    asColorString,
    asCSSColorString,
    color,
    json
};

// File: io/deserialize.js
const defaultColors = {
    cmyk: defaultData.colors.base.branded.cmyk,
    hex: defaultData.colors.base.branded.hex,
    hsl: defaultData.colors.base.branded.hsl,
    hsv: defaultData.colors.base.branded.hsv,
    lab: defaultData.colors.base.branded.lab,
    rgb: defaultData.colors.base.branded.rgb,
    xyz: defaultData.colors.base.branded.xyz
};
const logMode$e = modeData.logging;
const regex$1 = configData.regex;
const thisModule$f = 'io/deserialize.js';
const logger$f = await createLogger();
const getFormattedTimestamp = commonFn.core.getFormattedTimestamp;
const convertToColorString = commonFn.utils.color.colorToColorString;
const convertToCSSColorString = commonFn.core.convert.colorToCSSColorString;
async function fromCSS(data) {
    const caller = 'fromCSS()';
    try {
        // 1. parse metadata
        const metadataMatch = data.match(regex$1.file.palette.css.metadata);
        const metadataRaw = metadataMatch ? metadataMatch[1] : '{}';
        const metadataJSON = JSON.parse(metadataRaw);
        // 2. extract individual metadata properties
        const id = metadataJSON.id || 'ERROR_(PALETTE_ID)';
        const name = metadataJSON.name || undefined;
        const swatches = metadataJSON.swatches || 1;
        const type = metadataJSON.type || '???';
        const timestamp = metadataJSON.timestamp || getFormattedTimestamp();
        // 3. parse flags
        const flags = {
            enableAlpha: metadataJSON.flags?.enableAlpha || false,
            limitDarkness: metadataJSON.flags?.limitDarkness || false,
            limitGrayness: metadataJSON.flags?.limitGrayness || false,
            limitLightness: metadataJSON.flags?.limitLightness || false
        };
        // 4. parse palette items
        const items = [];
        const itemBlocks = Array.from(data.matchAll(regex$1.file.palette.css.color));
        for (const match of itemBlocks) {
            const properties = match[2].split(';').reduce((acc, line) => {
                const [key, value] = line.split(':').map(s => s.trim());
                if (key && value) {
                    acc[key.replace('--', '')] = value.replace(/[";]/g, '');
                }
                return acc;
            }, {});
            // 4.1. create each PaletteItem with required properties
            items.push({
                colors: {
                    main: {
                        cmyk: ioParseUtils.asColorValue.cmyk(properties.cmyk) ??
                            defaultColors.cmyk.value,
                        hex: ioParseUtils.asColorValue.hex(properties.hex) ??
                            defaultColors.hex.value,
                        hsl: ioParseUtils.asColorValue.hsl(properties.hsl) ??
                            defaultColors.hsl.value,
                        hsv: ioParseUtils.asColorValue.hsv(properties.hsv) ??
                            defaultColors.hsv.value,
                        lab: ioParseUtils.asColorValue.lab(properties.lab) ??
                            defaultColors.lab.value,
                        rgb: ioParseUtils.asColorValue.rgb(properties.rgb) ??
                            defaultColors.rgb.value,
                        xyz: ioParseUtils.asColorValue.xyz(properties.xyz) ??
                            defaultColors.xyz.value
                    },
                    stringProps: {
                        cmyk: convertToColorString({
                            value: ioParseUtils.asColorValue.cmyk(properties.cmyk) ?? defaultColors.cmyk,
                            format: 'cmyk'
                        }).value,
                        hex: convertToColorString({
                            value: ioParseUtils.asColorValue.hex(properties.hex) ??
                                defaultColors.hex,
                            format: 'hex'
                        }).value,
                        hsl: convertToColorString({
                            value: ioParseUtils.asColorValue.hsl(properties.hsl) ??
                                defaultColors.hsl,
                            format: 'hsl'
                        }).value,
                        hsv: convertToColorString({
                            value: ioParseUtils.asColorValue.hsv(properties.hsv) ??
                                defaultColors.hsv,
                            format: 'hsv'
                        }).value,
                        lab: convertToColorString({
                            value: ioParseUtils.asColorValue.lab(properties.lab) ??
                                defaultColors.lab,
                            format: 'lab'
                        }).value,
                        rgb: convertToColorString({
                            value: ioParseUtils.asColorValue.rgb(properties.rgb) ??
                                defaultColors.rgb,
                            format: 'rgb'
                        }).value,
                        xyz: convertToColorString({
                            value: ioParseUtils.asColorValue.xyz(properties.xyz) ??
                                defaultColors.xyz,
                            format: 'xyz'
                        }).value
                    },
                    css: {
                        cmyk: await convertToCSSColorString({
                            value: ioParseUtils.asColorValue.cmyk(properties.cmyk) ?? defaultColors.cmyk,
                            format: 'cmyk'
                        }),
                        hex: await convertToCSSColorString({
                            value: ioParseUtils.asColorValue.hex(properties.hex) ??
                                defaultColors.hex,
                            format: 'hex'
                        }),
                        hsl: await convertToCSSColorString({
                            value: ioParseUtils.asColorValue.hsl(properties.hsl) ??
                                defaultColors.hsl,
                            format: 'hsl'
                        }),
                        hsv: await convertToCSSColorString({
                            value: ioParseUtils.asColorValue.hsv(properties.hsv) ??
                                defaultColors.hsv,
                            format: 'hsv'
                        }),
                        lab: await convertToCSSColorString({
                            value: ioParseUtils.asColorValue.lab(properties.lab) ??
                                defaultColors.lab,
                            format: 'lab'
                        }),
                        rgb: await convertToCSSColorString({
                            value: ioParseUtils.asColorValue.rgb(properties.rgb) ??
                                defaultColors.rgb,
                            format: 'rgb'
                        }),
                        xyz: await convertToCSSColorString({
                            value: ioParseUtils.asColorValue.xyz(properties.xyz) ??
                                defaultColors.xyz,
                            format: 'xyz'
                        })
                    }
                }
            });
        }
        // 4. construct and return the palette object
        return {
            id,
            items,
            metadata: {
                flags,
                name,
                swatches,
                type,
                timestamp
            }
        };
    }
    catch (error) {
        if (logMode$e.error && logMode$e.verbosity > 1)
            logger$f.error(`Error occurred during CSS deserialization: ${error}`, `${thisModule$f} > ${caller}`);
        throw new Error('Failed to deserialize CSS Palette.');
    }
}
async function fromJSON(data) {
    const caller = 'fromJSON()';
    try {
        const parsedData = JSON.parse(data);
        if (!parsedData.items || !Array.isArray(parsedData.items)) {
            throw new Error('Invalid JSON format: Missing or invalid `items` property.');
        }
        return parsedData;
    }
    catch (error) {
        if (error instanceof Error) {
            if (logMode$e.error)
                logger$f.error(`Failed to deserialize JSON: ${error.message}`, `${thisModule$f} > ${caller}`);
            throw new Error('Failed to deserialize palette from JSPM file');
        }
        else {
            if (logMode$e.error)
                logger$f.error(`Failed to deserialize JSON: ${error}`, `${thisModule$f} > ${caller}`);
            throw new Error('Failed to deserialize palette from JSPM file');
        }
    }
}
async function fromXML(data) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, 'application/xml');
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
        throw new Error(`Invalid XML format: ${parseError.textContent}`);
    }
    const paletteElement = xmlDoc.querySelector('Palette');
    if (!paletteElement) {
        throw new Error('Missing <Palette> root element.');
    }
    // 1. parse metadata
    const id = paletteElement.getAttribute('id') || 'ERROR_(PALETTE_ID)';
    const metadataElement = paletteElement.querySelector('Metadata');
    if (!metadataElement) {
        throw new Error('Missing <Metadata> element in XML.');
    }
    const name = metadataElement.querySelector('Name')?.textContent || 'Unnamed Palette';
    const timestamp = metadataElement.querySelector('Timestamp')?.textContent ||
        new Date().toISOString();
    const swatches = parseInt(metadataElement.querySelector('Swatches')?.textContent || '0', 10);
    const type = metadataElement.querySelector('Type')?.textContent || '???';
    const flagsElement = metadataElement.querySelector('Flags');
    const flags = {
        enableAlpha: flagsElement?.querySelector('EnableAlpha')?.textContent === 'true',
        limitDarkness: flagsElement?.querySelector('LimitDarkness')?.textContent ===
            'true',
        limitGrayness: flagsElement?.querySelector('LimitGrayness')?.textContent ===
            'true',
        limitLightness: flagsElement?.querySelector('LimitLightness')?.textContent ===
            'true'
    };
    // 2. parse palette items
    const items = Array.from(paletteElement.querySelectorAll('PaletteItem')).map(itemElement => {
        const id = parseInt(itemElement.getAttribute('id') || '0', 10);
        // 2.1 parse main colors
        const mainColors = {
            cmyk: ioParseUtils.color.cmyk(itemElement.querySelector('Colors > Main > CMYK')
                ?.textContent || null),
            hex: ioParseUtils.color.hex(itemElement.querySelector('Colors > Main > Hex')?.textContent ||
                null),
            hsl: ioParseUtils.color.hsl(itemElement.querySelector('Colors > Main > HSL')?.textContent ||
                null),
            hsv: ioParseUtils.color.hsv(itemElement.querySelector('Colors > Main > HSV')?.textContent ||
                null),
            lab: ioParseUtils.color.lab(itemElement.querySelector('Colors > Main > LAB')?.textContent ||
                null),
            rgb: ioParseUtils.color.rgb(itemElement.querySelector('Colors > Main > RGB')?.textContent ||
                null),
            xyz: ioParseUtils.color.xyz(itemElement.querySelector('Colors > Main > XYZ')?.textContent ||
                null)
        };
        // 2.2 derive color strings from colors
        const stringPropColors = {
            cmyk: convertToColorString({
                value: mainColors.cmyk,
                format: 'cmyk'
            }).value,
            hex: convertToColorString({
                value: mainColors.hex,
                format: 'hex'
            }).value,
            hsl: convertToColorString({
                value: mainColors.hsl,
                format: 'hsl'
            }).value,
            hsv: convertToColorString({
                value: mainColors.hsv,
                format: 'hsv'
            }).value,
            lab: convertToColorString({
                value: mainColors.lab,
                format: 'lab'
            }).value,
            rgb: convertToColorString({
                value: mainColors.rgb,
                format: 'rgb'
            }).value,
            xyz: convertToColorString({
                value: mainColors.xyz,
                format: 'xyz'
            }).value
        };
        // 2.3 derive CSS strings from colors
        const cssColors = {
            cmyk: itemElement.querySelector('Colors > CSS > CMYK')?.textContent ||
                '',
            hex: itemElement.querySelector('Colors > CSS > Hex')?.textContent ||
                '',
            hsl: itemElement.querySelector('Colors > CSS > HSL')?.textContent ||
                '',
            hsv: itemElement.querySelector('Colors > CSS > HSV')?.textContent ||
                '',
            lab: itemElement.querySelector('Colors > CSS > LAB')?.textContent ||
                '',
            rgb: itemElement.querySelector('Colors > CSS > RGB')?.textContent ||
                '',
            xyz: itemElement.querySelector('Colors > CSS > XYZ')?.textContent ||
                ''
        };
        return {
            id,
            colors: {
                main: mainColors,
                stringProps: stringPropColors,
                css: cssColors
            }
        };
    });
    // 3. return the constructed Palette
    return {
        id,
        items,
        metadata: { name, timestamp, swatches, type, flags }
    };
}
const deserialize = {
    fromCSS,
    fromJSON,
    fromXML
};

// File: io/deserialize.js
const logMode$d = modeData.logging;
const thisModule$e = 'io/serialize.js';
const logger$e = await createLogger();
async function toCSS(palette) {
    const thisMethod = 'toCSS()';
    return new Promise((resolve, reject) => {
        try {
            // 1. serialize metadata
            const metadata = `
				/* Palette Metadata */
				.palette {
					--id: "${palette.id}";
					--name: "${palette.metadata.name ?? 'Unnamed Palette'}";
					--swatches: ${palette.metadata.swatches};
					--type: "${palette.metadata.type}";
					--timestamp: "${palette.metadata.timestamp}";
					--limitDarkness: ${palette.metadata.flags.limitDarkness};
					--limitGrayness: ${palette.metadata.flags.limitGrayness};
					--limitLightness: ${palette.metadata.flags.limitLightness};
				}`.trim();
            // 2. serialize palette items
            const items = palette.items
                .map(item => {
                const backgroundColor = item.colors.css.hsl;
                return `
					/* Palette Item */
					.color {
						--cmyk-color: "${item.colors.css.cmyk}";
						--hex-color: "${item.colors.css.hex}";
						--hsl-color: "${item.colors.css.hsl}";
						--hsv-color: "${item.colors.css.hsv}";
						--lab-color: "${item.colors.css.lab}";
						--rgb-color: "${item.colors.css.rgb}";
						--xyz-color: "${item.colors.css.xyz}";
						background-color: ${backgroundColor};
					}`.trim();
            })
                .join('\n\n');
            // 3. combine CSS data
            const cssData = [metadata, items].filter(Boolean).join('\n\n');
            // 4. resolve serialized CSS data
            resolve(cssData.trim());
        }
        catch (error) {
            if (!modeData.quiet && logMode$d.error) {
                if (logMode$d.verbosity > 1) {
                    logger$e.error(`Failed to convert palette to CSS: ${error}`, `${thisModule$e} > ${thisMethod}`);
                }
                else {
                    logger$e.error('Failed to convert palette to CSS', `${thisModule$e} > ${thisMethod}`);
                }
            }
            if (modeData.stackTrace) {
                console.trace('Stack Trace:');
            }
            reject(new Error(`Failed to convert palette to CSS: ${error}`));
        }
    });
}
async function toJSON(palette) {
    const thisMethod = 'toJSON()';
    return new Promise((resolve, reject) => {
        try {
            const jsonData = JSON.stringify(palette, null, 2);
            resolve(jsonData);
        }
        catch (error) {
            if (!modeData.quiet && logMode$d.error) {
                if (logMode$d.verbosity > 1) {
                    logger$e.error(`Failed to convert palette to JSON: ${error}`, `${thisModule$e} > ${thisMethod}`);
                }
                else {
                    logger$e.error('Failed to convert palette to JSON', `${thisModule$e} > ${thisMethod}`);
                }
            }
            if (modeData.stackTrace) {
                console.trace('Stack Trace:');
            }
            reject(new Error(`Failed to convert palette to JSON: ${error}`));
        }
    });
}
async function toXML(palette) {
    const thisMethod = 'toXML()';
    return new Promise((resolve, reject) => {
        try {
            // 1. serialize palette metadata
            const metadata = `
				<Metadata>
					<Name>${palette.metadata.name ?? 'Unnamed Palette'}</Name>
					<Timestamp>${palette.metadata.timestamp}</Timestamp>
					<Swatches>${palette.metadata.swatches}</Swatches>
					<Type>${palette.metadata.type}</Type>
					<Flags>
						<LimitDarkness>${palette.metadata.flags.limitDarkness}</LimitDarkness>
						<LimitGrayness>${palette.metadata.flags.limitGrayness}</LimitGrayness>
						<LimitLightness>${palette.metadata.flags.limitLightness}</LimitLightness>
					</Flags>
				</Metadata>`.trim();
            // 2. serialize palette items
            const xmlItems = palette.items
                .map((item, index) => `
					<PaletteItem id="${index + 1}">
						<Colors>
							<Main>
								<CMYK>${item.colors.main.cmyk}</CMYK>
								<Hex>${item.colors.main.hex}</Hex>
								<HSL>${item.colors.main.hsl}</HSL>
								<HSV>${item.colors.main.hsv}</HSV>
								<LAB>${item.colors.main.lab}</LAB>
								<RGB>${item.colors.main.rgb}</RGB>
								<XYZ>${item.colors.main.xyz}</XYZ>
							</Main>
							<CSS>
								<CMYK>${item.colors.css.cmyk}</CMYK>
								<Hex>${item.colors.css.hex}</Hex>
								<HSL>${item.colors.css.hsl}</HSL>
								<HSV>${item.colors.css.hsv}</HSV>
								<LAB>${item.colors.css.lab}</LAB>
								<RGB>${item.colors.css.rgb}</RGB>
								<XYZ>${item.colors.css.xyz}</XYZ>
							</CSS>
						</Colors>
					</PaletteItem>`.trim())
                .join('\n');
            // 3. combine metadata and items into the palette XML
            const xmlData = `
				<Palette id=${palette.id}>
					${metadata}
					<Items>
						${xmlItems}
					</Items>
				</Palette>`.trim();
            resolve(xmlData.trim());
        }
        catch (error) {
            if (!modeData.quiet && logMode$d.error) {
                if (logMode$d.verbosity > 1) {
                    logger$e.error(`Failed to convert palette to XML: ${error}`, `${thisModule$e} > ${thisMethod}`);
                }
                else {
                    logger$e.error('Failed to convert palette to XML', `${thisModule$e} > ${thisMethod}`);
                }
            }
            if (modeData.stackTrace) {
                console.trace('Stack Trace:');
            }
            reject(new Error(`Failed to convert palette to XML: ${error}`));
        }
    });
}
const serialize = {
    toCSS,
    toJSON,
    toXML
};

// File: io/base.js
// *DEV-NOTE* improve error handling and logging throughout
const file = {
    async importFromFile(file) {
        return file.text().then(importPalette);
    },
    async exportToFile(palette, format) {
        const data = await exportPalette(palette, format);
        const mimeType = {
            css: 'text/css',
            json: 'application/json',
            xml: 'application/xml'
        }[format];
        utils$b.file.download(data, `palette_${palette.id}.${format}`, mimeType);
    }
};
function detectFileType(data) {
    if (data.trim().startsWith('{'))
        return 'json';
    if (data.trim().startsWith('<'))
        return 'xml';
    return 'css';
}
async function exportPalette(palette, format) {
    switch (format) {
        case 'css':
            const cssData = await serialize.toCSS(palette);
            return cssData;
        case 'json':
            const jsonData = await serialize.toJSON(palette);
            return jsonData;
        case 'xml':
            const xmlData = await serialize.toXML(palette);
            return xmlData;
        default:
            throw new Error('Unsupported export format');
    }
}
async function importPalette(data) {
    const fileType = detectFileType(data);
    switch (fileType) {
        case 'css':
            const cssPalette = await deserialize.fromCSS(data);
            if (!cssPalette)
                throw new Error('Invalid CSS');
            return cssPalette;
        case 'json':
            const jsonPalette = await deserialize.fromJSON(data);
            if (!jsonPalette)
                throw new Error('Invalid JSON');
            return jsonPalette;
        case 'xml':
            const xmlPalette = await deserialize.fromXML(data);
            if (!xmlPalette)
                throw new Error('Invalid XML');
            return xmlPalette;
        default:
            throw new Error('Unsupported file format');
    }
}

// File: io/index.js
const ioFn = {
    deserialize,
    exportPalette,
    file,
    importPalette,
    parse: ioParseUtils,
    serialize
};

// File: src/ui/UIManager.ts
const thisModule$d = 'ui/UIManager.ts';
const fileUtils = {
    download,
    readFile
};
const logger$d = await createLogger();
class UIManager {
    static instanceCounter = 0; // static instance ID counter
    static instances = new Map(); // instance registry
    id; // unique instance ID
    currentPalette = null;
    paletteHistory = [];
    idbManager;
    consts;
    domData;
    logMode;
    mode;
    conversionUtils;
    coreUtils;
    utils;
    getCurrentPaletteFn;
    getStoredPalette;
    eventListenerFn;
    constructor(eventListenerFn, idbManager) {
        this.init();
        this.id = UIManager.instanceCounter++;
        UIManager.instances.set(this.id, this);
        this.idbManager = idbManager || null;
        this.paletteHistory = [];
        this.consts = constsData;
        this.domData = domData;
        this.logMode = modeData.logging;
        this.mode = modeData;
        this.coreUtils = commonFn.core;
        this.utils = commonFn.utils;
        this.conversionUtils = commonFn.convert;
        this.eventListenerFn = eventListenerFn;
    }
    /* PUBLIC METHODS */
    async addPaletteToHistory(palette) {
        const thisMethod = 'addPaletteToHistory()';
        const idbManager = await IDBManager.getInstance();
        const maxHistory = (await idbManager.getSettings()).maxHistory;
        try {
            const history = await idbManager.getPaletteHistory();
            const newID = await idbManager.getNextPaletteID();
            const idString = `${palette.metadata.type}_${newID}`;
            await idbManager.savePaletteHistory(history);
            if (!this.mode.quiet &&
                this.mode.debug &&
                this.logMode.verbosity > 2)
                logger$d.info(`Added palette with ID ${idString} to history`, `${thisModule$d} > ${thisMethod}`);
        }
        catch (error) {
            logger$d.error(`Error adding palette to history: ${error}`, `${thisModule$d} > ${thisMethod}`);
        }
        this.paletteHistory.unshift(palette);
        if (this.paletteHistory.length > maxHistory)
            this.paletteHistory.pop();
        if (this.idbManager) {
            await this.idbManager.savePaletteHistory(this.paletteHistory);
        }
        else {
            const idbManager = await IDBManager.getInstance();
            await idbManager.savePaletteHistory(this.paletteHistory);
        }
        this.updateHistoryUI();
    }
    applyCustomColor() {
        const thisMethod = 'applyCustomColor()';
        try {
            const colorPicker = document.getElementById('custom-color-picker');
            if (!colorPicker) {
                throw new Error('Color picker element not found');
            }
            const rawValue = colorPicker.value.trim();
            // *DEV-NOTE* Add this to the Data object
            const selectedFormat = document.getElementById('custom-color-format')?.value;
            if (!this.utils.color.isColorSpace(selectedFormat)) {
                if (!this.mode.gracefulErrors)
                    throw new Error(`Unsupported color format: ${selectedFormat}`);
            }
            const parsedColor = this.utils.color.parseColor(selectedFormat, rawValue);
            if (!parsedColor) {
                if (!this.mode.gracefulErrors)
                    throw new Error(`Invalid color value: ${rawValue}`);
            }
            const hslColor = this.utils.color.isHSLColor(parsedColor)
                ? parsedColor
                : this.conversionUtils.toHSL(parsedColor);
            return hslColor;
        }
        catch (error) {
            if (this.logMode.error)
                logger$d.error(`Failed to apply custom color: ${error}. Returning randomly generated hex color`, `${thisModule$d} > ${thisMethod}`);
            return this.utils.random.hsl();
        }
    }
    async applyFirstColorToUI(color) {
        const thisMethod = 'applyFirstColorToUI()';
        try {
            const colorBox1 = this.domData.elements.dynamic.divs.colorBox1;
            if (!colorBox1) {
                if (this.logMode.error)
                    logger$d.error('color-box-1 is null', `${thisModule$d} > ${thisMethod}`);
                return color;
            }
            const formatColorString = await this.coreUtils.convert.colorToCSSColorString(color);
            if (!formatColorString) {
                if (this.logMode.error)
                    logger$d.error('Unexpected or unsupported color format.', `${thisModule$d} > ${thisMethod}`);
                return color;
            }
            colorBox1.style.backgroundColor = formatColorString;
            this.utils.palette.populateOutputBox(color, 1);
            return color;
        }
        catch (error) {
            if (this.logMode.error)
                logger$d.error(`Failed to apply first color to UI: ${error}`, `${thisModule$d} > ${thisMethod}`);
            return this.utils.random.hsl();
        }
    }
    copyToClipboard(text, tooltipElement) {
        const thisMethod = 'copyToClipboard()';
        try {
            const colorValue = text.replace('Copied to clipboard!', '').trim();
            navigator.clipboard
                .writeText(colorValue)
                .then(() => {
                this.getEventListenerFn().temp.showTooltip(tooltipElement);
                if (!this.mode.quiet &&
                    this.mode.debug &&
                    this.logMode.verbosity > 2 &&
                    this.logMode.info) {
                    logger$d.info(`Copied color value: ${colorValue}`, `${thisModule$d} > ${thisMethod}`);
                }
                setTimeout(() => tooltipElement.classList.remove('show'), this.consts.timeouts.tooltip || 1000);
            })
                .catch(err => {
                if (this.logMode.error)
                    logger$d.error(`Error copying to clipboard: ${err}`, `${thisModule$d} > ${thisMethod}`);
            });
        }
        catch (error) {
            if (this.logMode.error)
                logger$d.error(`Failed to copy to clipboard: ${error}`, `${thisModule$d} > ${thisMethod}`);
        }
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
            colorBox.style.backgroundColor = item.colors.css.hex;
            row.appendChild(colorBox);
            row.appendChild(cell);
            table.appendChild(row);
        });
        fragment.appendChild(table);
        return fragment;
    }
    desaturateColor(selectedColor) {
        const thisMethod = 'desaturateColor()';
        try {
            this.getElementsForSelectedColor(selectedColor);
        }
        catch (error) {
            if (this.logMode.error)
                logger$d.error(`Failed to desaturate color: ${error}`, `${thisModule$d} > ${thisMethod}`);
        }
    }
    getElementsForSelectedColor(selectedColor) {
        const thisMethod = 'getElementsForSelectedColor()';
        const selectedColorBox = document.getElementById(`color-box-${selectedColor}`);
        if (!selectedColorBox) {
            if (this.logMode.warn)
                logger$d.warn(`Element not found for color ${selectedColor}`, `${thisModule$d} > ${thisMethod}`);
            this.getEventListenerFn().temp.showToast('Please select a valid color.');
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
    getID() {
        return this.id;
    }
    static getAllInstances() {
        return Array.from(UIManager.instances.values());
    }
    async getCurrentPalette() {
        if (this.getCurrentPaletteFn) {
            return await this.getCurrentPaletteFn();
        }
        return (this.currentPalette ||
            (this.paletteHistory.length > 0 ? this.paletteHistory[0] : null));
    }
    static getInstanceById(id) {
        return UIManager.instances.get(id);
    }
    static deleteInstanceById(id) {
        UIManager.instances.delete(id);
    }
    async handleExport(format) {
        const thisMethod = 'handleExport()';
        try {
            const palette = await this.getCurrentPalette();
            if (!palette) {
                logger$d.error('No palette available for export', `${thisModule$d} > ${thisMethod}`);
                return;
            }
            switch (format) {
                case 'css':
                    ioFn.exportPalette(palette, format);
                    break;
                case 'json':
                    ioFn.exportPalette(palette, format);
                    break;
                case 'xml':
                    ioFn.exportPalette(palette, format);
                    break;
                default:
                    throw new Error(`Unsupported export format: ${format}`);
            }
        }
        catch (error) {
            if (this.logMode.error && this.logMode.verbosity > 1)
                logger$d.error(`Failed to export palette: ${error}`, `${thisModule$d} > ${thisMethod}`);
        }
    }
    async handleImport(file, format) {
        try {
            const thisMethod = 'handleImport()';
            const data = await fileUtils.readFile(file);
            let palette = null;
            switch (format) {
                case 'JSON':
                    palette = await ioFn.deserialize.fromJSON(data);
                    if (!palette) {
                        if (this.logMode.error && this.logMode.verbosity > 1) {
                            logger$d.error('Failed to deserialize JSON data', `${thisModule$d} > ${thisMethod}`);
                        }
                        return;
                    }
                    break;
                case 'XML':
                    palette = (await ioFn.deserialize.fromXML(data)) || null;
                    break;
                case 'CSS':
                    palette = (await ioFn.deserialize.fromCSS(data)) || null;
                    break;
                default:
                    throw new Error(`Unsupported format: ${format}`);
            }
            if (!palette) {
                if (this.logMode.error && this.logMode.verbosity > 1) {
                    logger$d.error(`Failed to deserialize ${format} data`, `${thisModule$d} > ${thisMethod}`);
                }
                return;
            }
            this.addPaletteToHistory(palette);
            if (this.logMode.info && this.logMode.verbosity > 1) {
                logger$d.info(`Successfully imported palette in ${format} format.`, `${thisModule$d} > ${thisMethod}`);
            }
        }
        catch (error) {
            logger$d.error(`Failed to import file: ${error}`, `${thisModule$d} > handleImport()`);
        }
    }
    async makePaletteBox(color, swatchCount) {
        const thisMethod = 'makePaletteBox()';
        try {
            if (!this.coreUtils.validate.colorValues(color)) {
                if (!this.logMode.error)
                    logger$d.error(`Invalid ${color.format} color value ${JSON.stringify(color)}`, `${thisModule$d} > ${thisMethod}`);
                return {
                    colorStripe: document.createElement('div'),
                    swatchCount
                };
            }
            const clonedColor = this.coreUtils.base.clone(color);
            const paletteBox = document.createElement('div');
            paletteBox.className = 'palette-box';
            paletteBox.id = `palette-box-${swatchCount}`;
            const paletteBoxTopHalf = document.createElement('div');
            paletteBoxTopHalf.className =
                'palette-box-half palette-box-top-half';
            paletteBoxTopHalf.id = `palette-box-top-half-${swatchCount}`;
            const colorTextOutputBox = document.createElement('input');
            colorTextOutputBox.type = 'text';
            colorTextOutputBox.className = 'color-text-output-box tooltip';
            colorTextOutputBox.id = `color-text-output-box-${swatchCount}`;
            colorTextOutputBox.setAttribute('data-format', 'hex');
            const colorString = await this.coreUtils.convert.colorToCSSColorString(clonedColor);
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
                    this.getEventListenerFn().temp.showTooltip(colorTextOutputBox);
                    clearTimeout(constsData.timeouts.tooltip || 1000);
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => (copyButton.textContent = 'Copy'), constsData.timeouts.copyButtonText || 1000);
                }
                catch (error) {
                    if (!this.logMode.error)
                        logger$d.error(`Failed to copy: ${error}`, `${thisModule$d} > ${thisMethod}`);
                }
            });
            colorTextOutputBox.addEventListener('input', this.coreUtils.base.debounce((e) => {
                const target = e.target;
                if (target) {
                    const cssColor = target.value.trim();
                    const boxElement = document.getElementById(`color-box-${swatchCount}`);
                    const stripeElement = document.getElementById(`color-stripe-${swatchCount}`);
                    if (boxElement)
                        boxElement.style.backgroundColor = cssColor;
                    if (stripeElement)
                        stripeElement.style.backgroundColor = cssColor;
                }
            }, constsData.debounce.input || 200));
            paletteBoxTopHalf.appendChild(colorTextOutputBox);
            paletteBoxTopHalf.appendChild(copyButton);
            const paletteBoxBottomHalf = document.createElement('div');
            paletteBoxBottomHalf.className =
                'palette-box-half palette-box-bottom-half';
            paletteBoxBottomHalf.id = `palette-box-bottom-half-${swatchCount}`;
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.id = `color-box-${swatchCount}`;
            colorBox.style.backgroundColor = colorString || '#ffffff';
            paletteBoxBottomHalf.appendChild(colorBox);
            paletteBox.appendChild(paletteBoxTopHalf);
            paletteBox.appendChild(paletteBoxBottomHalf);
            const colorStripe = document.createElement('div');
            colorStripe.className = 'color-stripe';
            colorStripe.id = `color-stripe-${swatchCount}`;
            colorStripe.style.backgroundColor = colorString || '#ffffff';
            colorStripe.setAttribute('draggable', 'true');
            this.getEventListenerFn().dad.attach(colorStripe);
            colorStripe.appendChild(paletteBox);
            return {
                colorStripe,
                swatchCount: swatchCount + 1
            };
        }
        catch (error) {
            if (!this.logMode.error)
                logger$d.error(`Failed to execute makePaletteBox: ${error}`, `${thisModule$d} > ${thisMethod}`);
            return {
                colorStripe: document.createElement('div'),
                swatchCount
            };
        }
    }
    pullParamsFromUI() {
        const thisMethod = 'pullParamsFromUI()';
        try {
            const paletteTypeElement = domData.elements.static.selects.paletteType;
            const numSwatchesElement = domData.elements.static.selects.swatchGen;
            const limitDarkChkbx = domData.elements.static.inputs.limitDarkChkbx;
            const limitGrayChkbx = domData.elements.static.inputs.limitGrayChkbx;
            const limitLightChkbx = domData.elements.static.inputs.limitLightChkbx;
            if (!paletteTypeElement &&
                !this.mode.quiet &&
                this.logMode.debug &&
                this.logMode.verbosity >= 2) {
                logger$d.warn('paletteTypeOptions DOM element not found', `${thisModule$d} > ${thisMethod}`);
            }
            if (!numSwatchesElement &&
                !this.mode.quiet &&
                this.logMode.debug &&
                this.logMode.verbosity >= 2) {
                logger$d.warn(`numBoxes DOM element not found`, `${thisModule$d} > ${thisMethod}`);
            }
            if ((!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) &&
                !this.mode.quiet &&
                this.logMode.debug &&
                this.logMode.verbosity >= 2) {
                logger$d.warn(`One or more checkboxes not found`, `${thisModule$d} > ${thisMethod}`);
            }
            return {
                type: paletteTypeElement
                    ? parseInt(paletteTypeElement.value, 10)
                    : 0,
                swatches: numSwatchesElement
                    ? parseInt(numSwatchesElement.value, 10)
                    : 0,
                limitDark: limitDarkChkbx?.checked || false,
                limitGray: limitGrayChkbx?.checked || false,
                limitLight: limitLightChkbx?.checked || false
            };
        }
        catch (error) {
            if (this.logMode.error)
                logger$d.error(`Failed to pull parameters from UI: ${error}`, `${thisModule$d} > ${thisMethod}`);
            return {
                type: 0,
                swatches: 0,
                limitDark: false,
                limitGray: false,
                limitLight: false
            };
        }
    }
    async removePaletteFromHistory(paletteID) {
        const thisMethod = 'removePaletteFromHistory()';
        try {
            const entry = document.getElementById(`palette_${paletteID}`);
            if (!entry)
                return;
            entry.remove();
            const idbManager = await IDBManager.getInstance();
            this.paletteHistory = this.paletteHistory.filter(p => p.id !== paletteID);
            await idbManager.savePaletteHistory(this.paletteHistory);
            if (!this.mode.quiet)
                logger$d.info(`Removed palette ${paletteID} from history`, `${thisModule$d} > ${thisMethod}`);
        }
        catch (error) {
            logger$d.error(`Error removing palette ${paletteID}: ${error}`, `${thisModule$d} > ${thisMethod}`);
        }
    }
    async renderPalette(tableId) {
        const thisMethod = 'renderPalette()';
        if (!this.getStoredPalette) {
            throw new Error('Palette fetching function has not been set.');
        }
        return this.utils.errors.handleAsync(async () => {
            const storedPalette = await this.getStoredPalette(tableId);
            const paletteRow = document.getElementById('palette-row');
            if (!storedPalette)
                throw new Error(`Palette ${tableId} not found.`);
            if (!paletteRow)
                throw new Error('Palette row element not found.');
            paletteRow.innerHTML = '';
            const tableElement = this.createPaletteTable(storedPalette);
            paletteRow.appendChild(tableElement);
            if (!this.mode.quiet)
                logger$d.info(`Rendered palette ${tableId}.`, `${thisModule$d} > ${thisMethod}`);
        }, 'UIManager.renderPalette(): Error rendering palette');
    }
    saturateColor(selectedColor) {
        const thisMethod = 'saturateColor()';
        try {
            this.getElementsForSelectedColor(selectedColor);
            // *DEV-NOTE* unfinished function
        }
        catch (error) {
            if (this.logMode.error)
                logger$d.error(`Failed to saturate color: ${error}`, `${thisModule$d} > ${thisMethod}`);
        }
    }
    setCurrentPalette(palette) {
        this.currentPalette = palette;
    }
    setGetCurrentPaletteFn(fn) {
        this.getCurrentPaletteFn = fn;
    }
    setGetStoredPalette(getter) {
        this.getStoredPalette = getter;
    }
    async setHistoryLimit(limit) {
        const thisMethod = 'setHistoryLimit()';
        try {
            if (limit < 1 || limit > 1000) {
                if (this.logMode.warn)
                    logger$d.warn(`Invalid history limit: ${limit}. Keeping current limit.`, `${thisModule$d} > ${thisMethod}`);
                return;
            }
            const idbManager = await IDBManager.getInstance();
            const settings = await idbManager.getSettings();
            settings.maxHistory = limit;
            await idbManager.saveSettings(settings);
            if (this.paletteHistory.length > limit) {
                this.paletteHistory = this.paletteHistory.slice(0, limit);
                await idbManager.savePaletteHistory(this.paletteHistory);
            }
            this.updateHistoryUI();
            if (!this.mode.quiet)
                logger$d.info(`History limit set to ${limit}`, `${thisModule$d} > ${thisMethod}`);
        }
        catch (error) {
            logger$d.error(`Error setting history limit: ${error}`, `${thisModule$d} > ${thisMethod}`);
        }
    }
    /* PRIVATE METHODS */
    async init() {
        this.idbManager = await IDBManager.getInstance();
        await this.loadPaletteHistory();
    }
    getEventListenerFn() {
        if (!this.eventListenerFn) {
            throw new Error('Event listeners have not been initialized yet.');
        }
        return this.eventListenerFn;
    }
    async loadPaletteHistory() {
        if (!this.idbManager)
            return;
        const history = await this.idbManager.getPaletteHistory();
        const settings = await this.idbManager.getSettings();
        const maxHistory = settings.maxHistory || 50;
        if (history) {
            this.paletteHistory = history.slice(0, maxHistory);
            this.updateHistoryUI();
        }
    }
    updateHistoryUI() {
        const historyList = this.domData.elements.static.divs.paletteHistory;
        if (!historyList)
            return;
        historyList.innerHTML = '';
        this.paletteHistory.forEach(palette => {
            const entryID = `palette_${palette.id}`;
            const entry = document.createElement('div');
            entry.classList.add('history-item');
            entry.id = entryID;
            const colors = palette.items
                .map(item => 
            /*html*/
            `<span class="color-box" style="background: ${item.colors.css.hex};">
						</span>`)
                .join(' ');
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.classList.add('remove-history-item');
            removeBtn.dataset.id = `${palette.id}-history-remove-btn`;
            removeBtn.addEventListener('click', async () => {
                await this.removePaletteFromHistory(palette.id);
            });
            entry.innerHTML =
                /*html*/
                `
				<p>Palette #${palette.metadata.name || palette.id}</p>
				<div class="color-preview">${colors}</div>
				`;
            historyList.appendChild(entry);
        });
    }
}

var UIManager$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    UIManager: UIManager
});

// File: db/instance.js
let idbInstance = null;
const getIDBInstance = async () => {
    if (!idbInstance) {
        idbInstance = await IDBManager.getInstance();
    }
    return idbInstance;
};

var instance = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getIDBInstance: getIDBInstance
});

// File: dom/parse.js
const ids = domData.ids.static;
const logMode$c = modeData.logging;
const regex = configData.regex.dom;
const thisModule$c = 'dom/parse.js';
const brand = commonFn.core.brand;
const logger$c = await createLogger();
function checkbox(id) {
    const thisFunction = 'checkbox()';
    const checkbox = document.getElementById(id);
    if (!checkbox) {
        if (logMode$c.error && !modeData.quiet) {
            logger$c.error(`Checkbox element ${id} not found`, `${thisModule$c} > ${thisFunction}`);
        }
        return;
    }
    if (!(checkbox instanceof HTMLInputElement)) {
        if (logMode$c.error && !modeData.quiet) {
            logger$c.error(`Element ${id} is not a checkbox`, `${thisModule$c} > ${thisFunction}`);
        }
        return;
    }
    return checkbox ? checkbox.checked : undefined;
}
function colorInput(input) {
    const thisFunction = 'colorInput()';
    const colorStr = input.value.trim().toLowerCase();
    const hexMatch = colorStr.match(regex.hex);
    const hslMatch = colorStr.match(regex.hsl);
    const rgbMatch = colorStr.match(regex.rgb);
    if (hexMatch) {
        let hex = hexMatch[1];
        if (hex.length === 3) {
            hex = hex
                .split('')
                .map(c => c + c)
                .join('');
        }
        return {
            format: 'hex',
            value: { hex: brand.asHexSet(`#${hex}`) }
        };
    }
    if (hslMatch) {
        return {
            format: 'hsl',
            value: {
                hue: brand.asRadial(parseInt(hslMatch[1], 10)),
                saturation: brand.asPercentile(parseFloat(hslMatch[2])),
                lightness: brand.asPercentile(parseFloat(hslMatch[3]))
            }
        };
    }
    if (rgbMatch) {
        return {
            format: 'rgb',
            value: {
                red: brand.asByteRange(parseInt(rgbMatch[1], 10)),
                green: brand.asByteRange(parseInt(rgbMatch[2], 10)),
                blue: brand.asByteRange(parseInt(rgbMatch[3], 10))
            }
        };
    }
    // for Named Colors (convert to RGB using CSS canvas)
    const testElement = document.createElement('div');
    testElement.style.color = colorStr;
    if (testElement.style.color !== '') {
        const ctx = document.createElement('canvas').getContext('2d');
        if (ctx) {
            ctx.fillStyle = colorStr;
            const rgb = ctx.fillStyle.match(/\d+/g)?.map(Number);
            if (rgb && rgb.length === 3) {
                return {
                    format: 'rgb',
                    value: {
                        red: brand.asByteRange(rgb[0]),
                        green: brand.asByteRange(rgb[1]),
                        blue: brand.asByteRange(rgb[2])
                    }
                };
            }
        }
    }
    if (!modeData.quiet && logMode$c.error && logMode$c.verbosity > 1) {
        logger$c.error('Invalid color input', `${thisModule$c} > ${thisFunction}`);
    }
    return null;
}
function paletteExportFormat() {
    const thisFunction = 'paletteExportFormat()';
    const formatSelectionMenu = document.getElementById(ids.selects.exportFormatOption);
    if (!formatSelectionMenu) {
        if (logMode$c.error && !modeData.quiet)
            logger$c.error('Export format selection dropdown not found', `${thisModule$c} > ${thisFunction}`);
    }
    const selectedFormat = formatSelectionMenu.value;
    if (selectedFormat !== 'CSS' &&
        selectedFormat !== 'JSON' &&
        selectedFormat !== 'XML') {
        if (logMode$c.error && !modeData.quiet)
            logger$c.error('Invalid export format selected', `${thisModule$c} > ${thisFunction}`);
        return;
    }
    else {
        return selectedFormat;
    }
}
const parse = {
    checkbox,
    colorInput,
    paletteExportFormat
};

// File: ui/instance.ts
async function getUIManager() {
    const { UIManager } = await Promise.resolve().then(function () { return UIManager$1; });
    const { getIDBInstance } = await Promise.resolve().then(function () { return instance; });
    const { eventListenerFn } = await Promise.resolve().then(function () { return index; });
    const idbManager = await getIDBInstance();
    return new UIManager(eventListenerFn, idbManager);
}

// File: palette/common/helpers/enforce.js
const domIDs$1 = domData.ids;
const logMode$b = modeData.logging;
const thisModule$b = 'palette/common/helpers/enforce.js';
const logger$b = await createLogger();
function swatchRules(minSwatches, maxSwatches) {
    const thisFunction = 'enforceSwatchRules()';
    const swatchNumberSelector = document.getElementById(domIDs$1.static.selects.swatchGen);
    if (!swatchNumberSelector) {
        if (logMode$b.error) {
            logger$b.error('paletteDropdown not found', `${thisModule$b} > ${thisFunction}`);
        }
        if (modeData.stackTrace && logMode$b.verbosity > 3) {
            console.trace('enforceMinimumSwatches stack trace');
        }
        return;
    }
    const currentValue = parseInt(swatchNumberSelector.value, 10);
    let newValue = currentValue;
    // ensue the value is within the allowed range
    if (currentValue < minSwatches) {
        newValue = minSwatches;
    }
    else if (maxSwatches !== undefined && currentValue > maxSwatches) {
        newValue = maxSwatches;
    }
    if (newValue !== currentValue) {
        // update value in the dropdown menu
        swatchNumberSelector.value = newValue.toString();
        // trigger a change event to notify the application
        const event = new Event('change', { bubbles: true });
        try {
            swatchNumberSelector.dispatchEvent(event);
        }
        catch (error) {
            if (logMode$b.error) {
                logger$b.error(`Failed to dispatch change event to palette-number-options dropdown menu: ${error}`, `${thisModule$b} > ${thisFunction}`);
            }
            throw new Error(`Failed to dispatch change event: ${error}`);
        }
    }
}
const enforce = {
    swatchRules
};

// File: palette/common/helpers/limits.js
const logMode$a = modeData.logging;
const thisModule$a = 'palette/common/helpers/limits.js';
const logger$a = await createLogger();
function isColorInBounds(hsl) {
    const thisFunction = 'paletteHelpers > limits > isColorInBounds()';
    if (!coreUtils$2.validate.colorValues(hsl)) {
        if (logMode$a.error)
            logger$a.error(`isColorInBounds: Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule$a} > ${thisFunction}`);
        return false;
    }
    return isTooDark$1(hsl) || isTooGray$1(hsl) || isTooLight$1(hsl);
}
function isTooDark$1(hsl) {
    const thisFunction = 'isTooDark()';
    if (!coreUtils$2.validate.colorValues(hsl)) {
        if (logMode$a.error)
            logger$a.error(`isTooDark: Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule$a} > ${thisFunction}`);
        return false;
    }
    return coreUtils$2.base.clone(hsl).value.lightness < constsData.thresholds.dark;
}
function isTooGray$1(hsl) {
    const thisFunction = 'isTooGray()';
    if (!coreUtils$2.validate.colorValues(hsl)) {
        if (logMode$a.error)
            logger$a.error(`isTooGray: Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule$a} > ${thisFunction}`);
        return false;
    }
    return coreUtils$2.base.clone(hsl).value.saturation < constsData.thresholds.gray;
}
function isTooLight$1(hsl) {
    const thisFunction = 'isTooLight()';
    if (!coreUtils$2.validate.colorValues(hsl)) {
        if (logMode$a.error)
            logger$a.error(`isTooLight: Invalid HSL value ${JSON.stringify(hsl)}`, `${thisModule$a} > ${thisFunction}`);
        return false;
    }
    return coreUtils$2.base.clone(hsl).value.lightness > constsData.thresholds.light;
}
const limits$2 = {
    isColorInBounds,
    isTooDark: isTooDark$1,
    isTooGray: isTooGray$1,
    isTooLight: isTooLight$1
};

// File: palette/common/helpers/update.js
async function colorBox(color, index) {
    const colorBox = document.getElementById(`color-box-${index + 1}`);
    if (colorBox) {
        const colorValues = utils$c.conversion.genAllColorValues(color);
        const selectedColor = colorValues;
        if (selectedColor) {
            const hslColor = colorValues.hsl;
            const hslCSSString = await coreUtils$2.convert.colorToCSSColorString(hslColor);
            colorBox.style.backgroundColor = hslCSSString;
            utils$c.palette.populateOutputBox(selectedColor, index + 1);
        }
    }
}
const update$1 = { colorBox };

// File: palette/common/helpers/index.js
const helpers = {
    enforce,
    limits: limits$2,
    update: update$1
};

// File: palette/common/superUtils/create.js
const limits$1 = helpers.limits;
const update = helpers.update;
const hslTo = coreConversionUtils.hslTo;
function baseColor(customColor) {
    const color = coreUtils$2.base.clone(customColor);
    return color;
}
async function paletteItem(color) {
    const clonedColor = coreUtils$2.base.clone(color);
    return {
        colors: {
            main: {
                cmyk: hslTo(clonedColor, 'cmyk').value,
                hex: hslTo(clonedColor, 'hex').value,
                hsl: clonedColor.value,
                hsv: hslTo(clonedColor, 'hsv').value,
                lab: hslTo(clonedColor, 'lab').value,
                rgb: hslTo(clonedColor, 'rgb').value,
                xyz: hslTo(clonedColor, 'xyz').value
            },
            stringProps: {
                cmyk: utils$c.color.colorToColorString(hslTo(clonedColor, 'cmyk')).value,
                hex: utils$c.color.colorToColorString(hslTo(clonedColor, 'hex')).value,
                hsl: utils$c.color.colorToColorString(clonedColor).value,
                hsv: utils$c.color.colorToColorString(hslTo(clonedColor, 'hsv')).value,
                lab: utils$c.color.colorToColorString(hslTo(clonedColor, 'lab')).value,
                rgb: utils$c.color.colorToColorString(hslTo(clonedColor, 'rgb')).value,
                xyz: utils$c.color.colorToColorString(hslTo(clonedColor, 'xyz')).value
            },
            css: {
                cmyk: await coreUtils$2.convert.colorToCSSColorString(hslTo(clonedColor, 'cmyk')),
                hex: await coreUtils$2.convert.colorToCSSColorString(hslTo(clonedColor, 'hex')),
                hsl: await coreUtils$2.convert.colorToCSSColorString(clonedColor),
                hsv: await coreUtils$2.convert.colorToCSSColorString(hslTo(clonedColor, 'hsv')),
                lab: await coreUtils$2.convert.colorToCSSColorString(hslTo(clonedColor, 'lab')),
                rgb: await coreUtils$2.convert.colorToCSSColorString(hslTo(clonedColor, 'rgb')),
                xyz: await coreUtils$2.convert.colorToCSSColorString(hslTo(clonedColor, 'xyz'))
            }
        }
    };
}
async function paletteItemArray(baseColor, hues, limitDark, limitGray, limitLight) {
    const paletteItems = [await paletteItem(baseColor)];
    for (const [i, hue] of hues.entries()) {
        let newColor = null;
        do {
            const sl = utils$c.random.sl();
            newColor = utils$c.conversion.genAllColorValues({
                value: {
                    hue: coreUtils$2.brand.asRadial(hue),
                    ...sl.value
                },
                format: 'hsl'
            }).hsl;
        } while (newColor &&
            ((limitGray && limits$1.isTooGray(newColor)) ||
                (limitDark && limits$1.isTooDark(newColor)) ||
                (limitLight && limits$1.isTooLight(newColor))));
        if (newColor) {
            const newPaletteItem = await paletteItem(newColor);
            paletteItems.push(newPaletteItem);
            update.colorBox(newColor, i + 1);
        }
    }
    return paletteItems;
}
const create = {
    baseColor,
    paletteItem,
    paletteItemArray
};

// File: palette/common/utils/adjust.js
const adjustments = constsData.adjustments;
const logMode$9 = modeData.logging;
const thisModule$9 = 'palette/common/utils/adjust.js';
const coreUtils = commonFn.core;
const logger$9 = await createLogger();
function sl(color) {
    const thisFunction = 'sl()';
    try {
        if (!coreUtils.validate.colorValues(color)) {
            if (logMode$9.error)
                logger$9.error('Invalid color valus for adjustment.', `${thisModule$9} > ${thisFunction}`);
            return color;
        }
        const adjustedSaturation = Math.min(Math.max(color.value.saturation + adjustments.slaValue, 0), 100);
        const adjustedLightness = Math.min(100);
        return {
            value: {
                hue: color.value.hue,
                saturation: coreUtils.brand.asPercentile(adjustedSaturation),
                lightness: coreUtils.brand.asPercentile(adjustedLightness)
            },
            format: 'hsl'
        };
    }
    catch (error) {
        if (logMode$9.error)
            logger$9.error(`Error adjusting saturation and lightness: ${error}`, `${thisModule$9} > ${thisFunction}`);
        return color;
    }
}
const adjust = { sl };

// File: paelette/common/utils/probability.js
const logMode$8 = modeData.logging;
const probabilities = constsData.probabilities;
const thisModule$8 = 'common/utils/probabilities.js';
const logger$8 = await createLogger();
function getWeightedRandomInterval$1() {
    const thisFunction = 'getWeightedRandomInterval()';
    try {
        const weights = probabilities.weights;
        const probabilityValues = probabilities.values;
        const cumulativeProbabilities = probabilityValues.reduce((acc, prob, i) => {
            acc[i] = (acc[i - 1] || 0) + prob;
            return acc;
        }, []);
        const random = Math.random();
        for (let i = 0; i < cumulativeProbabilities.length; i++) {
            if (random < cumulativeProbabilities[i])
                return weights[i];
        }
        return weights[weights.length - 1];
    }
    catch (error) {
        if (logMode$8.error)
            logger$8.error(`Error generating weighted random interval: ${error}`, `${thisModule$8} > ${thisFunction}`);
        return 50;
    }
}
const probability = {
    getWeightedRandomInterval: getWeightedRandomInterval$1
};

// File: palette/common/utils/index.js
const utils$a = {
    adjust,
    probability
};

// File: palette/common/superUtils/genHues.js
const logMode$7 = modeData.logging;
const thisModule$7 = 'palette/common/superUtils/genHues.js';
const logger$7 = await createLogger();
const genAllColorValues = utils$c.conversion.genAllColorValues;
const getWeightedRandomInterval = utils$a.probability.getWeightedRandomInterval;
const validateColorValues = coreUtils$2.validate.colorValues;
function analogous$1(color, numBoxes) {
    const thisFunction = 'analogous()';
    try {
        if (!validateColorValues(color)) {
            if (logMode$7.error)
                logger$7.error(`Invalid color value ${JSON.stringify(color)}`, `${thisModule$7} > ${thisFunction}`);
            return [];
        }
        const clonedColor = coreUtils$2.base.clone(color);
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
        if (logMode$7.error)
            logger$7.error(`Error generating analogous hues: ${error}`, `${thisModule$7} > ${thisFunction}`);
        return [];
    }
}
function diadic$1(baseHue) {
    const thisFunction = 'diadic()';
    try {
        const clonedBaseHue = coreUtils$2.base.clone(baseHue);
        const diadicHues = [];
        const randomDistance = getWeightedRandomInterval();
        const hue1 = clonedBaseHue;
        const hue2 = (hue1 + randomDistance) % 360;
        diadicHues.push(hue1, hue2);
        return diadicHues;
    }
    catch (error) {
        if (logMode$7.error)
            logger$7.error(`Error generating diadic hues: ${error}`, `${thisModule$7} > ${thisFunction}`);
        return [];
    }
}
function hexadic$1(color) {
    const thisFunction = 'hexadic()';
    try {
        const clonedColor = coreUtils$2.base.clone(color);
        if (!validateColorValues(clonedColor)) {
            if (logMode$7.error)
                logger$7.error(`Invalid color value ${JSON.stringify(clonedColor)}`, `${thisModule$7} > ${thisFunction}`);
            return [];
        }
        const clonedBaseHSL = genAllColorValues(clonedColor).hsl;
        if (!clonedBaseHSL) {
            if (!modeData.gracefulErrors)
                throw new Error('Unable to generate hexadic hues - missing HSL values');
            else if (logMode$7.error)
                logger$7.error('Unable to generate hexadic hues - missing HSL values', `${thisModule$7} > ${thisFunction}`);
            else if (!modeData.quiet && logMode$7.verbosity > 0)
                logger$7.error('Error generating hexadic hues', `${thisModule$7} > ${thisFunction}`);
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
        if (logMode$7.error)
            logger$7.error(`Error generating hexadic hues: ${error}`, `${thisModule$7} > ${thisFunction}`);
        return [];
    }
}
function splitComplementary$1(baseHue) {
    const thisFunction = 'splitComplementary()';
    try {
        const clonedBaseHue = coreUtils$2.base.clone(baseHue);
        const modifier = Math.floor(Math.random() * 11) + 20;
        return [
            (clonedBaseHue + 180 + modifier) % 360,
            (clonedBaseHue + 180 - modifier + 360) % 360
        ];
    }
    catch (error) {
        if (logMode$7.error)
            logger$7.error(`Error generating split complementary hues: ${error}`, `${thisModule$7} > ${thisFunction}`);
        return [];
    }
}
function tetradic$1(baseHue) {
    const thisFunction = 'tetradic()';
    try {
        const clonedBaseHue = coreUtils$2.base.clone(baseHue);
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
        if (logMode$7.error)
            logger$7.error(`Error generating tetradic hues: ${error}`, `${thisModule$7} > ${thisFunction}`);
        return [];
    }
}
function triadic$1(baseHue) {
    const thisFunction = 'triadic()';
    try {
        const clonedBaseHue = coreUtils$2.base.clone(baseHue);
        return [120, 240].map(increment => (clonedBaseHue + increment) % 360);
    }
    catch (error) {
        if (logMode$7.error)
            logger$7.error(`Error generating triadic hues: ${error}`, `${thisModule$7} > ${thisFunction}`);
        return [];
    }
}
const genHues = {
    analogous: analogous$1,
    diadic: diadic$1,
    hexadic: hexadic$1,
    splitComplementary: splitComplementary$1,
    tetradic: tetradic$1,
    triadic: triadic$1
};

// File: palette/common/superUtils.js
const superUtils = {
    create,
    genHues
};

// File: palette/main/types/analogous.js
const core$8 = commonFn.core;
const utils$9 = commonFn.utils;
async function analogous(args) {
    // ensure at least 2 color swatches
    if (args.swatches < 2)
        helpers.enforce.swatchRules(2);
    const baseColor = utils$9.random.hsl();
    const hues = superUtils.genHues.analogous(baseColor, args.swatches);
    const paletteItems = [];
    for (const [i, hue] of hues.entries()) {
        const newColor = {
            value: {
                hue: core$8.brand.asRadial(hue),
                saturation: core$8.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.saturation +
                    (Math.random() - 0.5) * 10))),
                lightness: core$8.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.lightness + (i % 2 === 0 ? 5 : -5))))
            },
            format: 'hsl'
        };
        const paletteItem = await superUtils.create.paletteItem(newColor);
        paletteItems.push(paletteItem);
    }
    const idbManager = await IDBManager.getInstance();
    const paletteID = await idbManager.getNextPaletteID();
    if (!paletteID)
        throw new Error('Palette ID is either null or undefined.');
    const analogousPalette = await idbManager.savePaletteToDB('analogous', paletteItems, paletteID, args.swatches, args.limitDark, args.limitGray, args.limitLight);
    if (!analogousPalette)
        throw new Error('Analogous palette is null or undefined.');
    else
        return analogousPalette;
}

// File: palette/main/types/complementary.js
const core$7 = commonFn.core;
const utils$8 = commonFn.utils;
async function complementary(args) {
    // ensure at least 2 color swatches
    if (args.swatches !== 2)
        helpers.enforce.swatchRules(2);
    const swatches = 2;
    const baseColor = utils$8.random.hsl();
    const complementaryHue = (baseColor.value.hue + 180) % 360;
    const complementaryColor = {
        value: {
            hue: core$7.brand.asRadial(complementaryHue),
            saturation: baseColor.value.saturation,
            lightness: baseColor.value.lightness
        },
        format: 'hsl'
    };
    const basePaletteItem = await superUtils.create.paletteItem(baseColor);
    const complementaryPaletteItem = await superUtils.create.paletteItem(complementaryColor);
    const idbManager = await IDBManager.getInstance();
    const paletteID = await idbManager.getNextPaletteID();
    if (!paletteID)
        throw new Error('Palette ID is either null or undefined.');
    const complementaryPalette = await idbManager.savePaletteToDB('complementary', [basePaletteItem, complementaryPaletteItem], paletteID, swatches, args.limitDark, args.limitGray, args.limitLight);
    if (!complementaryPalette) {
        throw new Error('Complementary palette is null or undefined.');
    }
    return complementaryPalette;
}

// File: palette/main/types/diadic.js
const paletteRanges$4 = constsData.paletteRanges;
const core$6 = commonFn.core;
const utils$7 = commonFn.utils;
async function diadic(args) {
    // ensure exactly 2 color swatches
    if (args.swatches !== 2)
        helpers.enforce.swatchRules(2, 2);
    const baseColor = utils$7.random.hsl();
    const hues = superUtils.genHues.diadic(baseColor.value.hue);
    const paletteItems = [];
    for (let i = 0; i < 2; i++) {
        const saturationShift = Math.random() * paletteRanges$4.shift.diadic.sat -
            paletteRanges$4.shift.diadic.sat / 2;
        const lightnessShift = Math.random() * paletteRanges$4.shift.diadic.light -
            paletteRanges$4.shift.diadic.light / 2;
        const newColor = {
            value: {
                hue: core$6.brand.asRadial(hues[i % hues.length]),
                saturation: core$6.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.saturation + saturationShift))),
                lightness: core$6.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.lightness + lightnessShift)))
            },
            format: 'hsl'
        };
        const paletteItem = await superUtils.create.paletteItem(newColor);
        paletteItems.push(paletteItem);
    }
    const idbManager = await IDBManager.getInstance();
    const paletteID = await idbManager.getNextPaletteID();
    if (!paletteID)
        throw new Error('Palette ID is either null or undefined.');
    const diadicPalette = await idbManager.savePaletteToDB('diadic', paletteItems, paletteID, 2, args.limitDark, args.limitGray, args.limitLight);
    if (!diadicPalette)
        throw new Error(`Diadic palette is either null or undefined.`);
    else
        return diadicPalette;
}

// File: palette/main/types/hexadic.js
const paletteRanges$3 = constsData.paletteRanges;
const core$5 = commonFn.core;
const utils$6 = commonFn.utils;
async function hexadic(args) {
    // ensure exactly 6 color swatches
    if (args.swatches !== 6)
        helpers.enforce.swatchRules(6, 6);
    const baseColor = utils$6.random.hsl();
    const hues = superUtils.genHues.hexadic(baseColor);
    const paletteItems = [];
    for (const hue of hues) {
        const saturationShift = Math.random() * paletteRanges$3.shift.hexad.sat -
            paletteRanges$3.shift.hexad.sat / 2;
        const lightnessShift = Math.random() * paletteRanges$3.shift.hexad.light -
            paletteRanges$3.shift.hexad.light / 2;
        const newColor = {
            value: {
                hue: core$5.brand.asRadial(hue),
                saturation: core$5.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.saturation + saturationShift))),
                lightness: core$5.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.lightness + lightnessShift)))
            },
            format: 'hsl'
        };
        const paletteItem = await superUtils.create.paletteItem(newColor);
        paletteItems.push(paletteItem);
    }
    const idbManager = await IDBManager.getInstance();
    const paletteID = await idbManager.getNextPaletteID();
    if (!paletteID)
        throw new Error('Palette ID is either null or undefined.');
    const hexadicPalette = await idbManager.savePaletteToDB('hexadic', paletteItems, paletteID, args.swatches, args.limitDark, args.limitGray, args.limitLight);
    if (!hexadicPalette) {
        throw new Error('Hexadic palette is either null or undefined.');
    }
    else {
        return hexadicPalette;
    }
}

// File: palette/main/types/monochromatic.js
const core$4 = commonFn.core;
const utils$5 = commonFn.utils;
async function monochromatic(args) {
    // ensure at least 2 color swatches
    if (args.swatches < 2)
        helpers.enforce.swatchRules(2);
    const baseColor = utils$5.random.hsl();
    const paletteItems = [];
    const basePaletteItem = await superUtils.create.paletteItem(baseColor);
    paletteItems.push(basePaletteItem);
    for (let i = 1; i < args.swatches; i++) {
        const hueShift = Math.random() * 10 - 5;
        const newColor = utils$5.conversion.genAllColorValues({
            value: {
                hue: core$4.brand.asRadial((baseColor.value.hue + hueShift + 360) % 360),
                saturation: core$4.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.saturation - i * 5))),
                lightness: core$4.brand.asPercentile(Math.min(100, Math.max(0, baseColor.value.lightness + (i * 10 - 20))))
            },
            format: 'hsl'
        }).hsl;
        if (newColor) {
            const paletteItem = await superUtils.create.paletteItem(newColor);
            paletteItems.push(paletteItem);
        }
    }
    const idbManager = await IDBManager.getInstance();
    const paletteID = await idbManager.getNextPaletteID();
    if (!paletteID)
        throw new Error('Palette ID is either null or undefined.');
    const monochromaticPalette = await idbManager.savePaletteToDB('monochromatic', paletteItems, paletteID, args.swatches, args.limitDark, args.limitGray, args.limitLight);
    if (!monochromaticPalette) {
        throw new Error('Monochromatic palette is either null or undefined.');
    }
    else {
        return monochromaticPalette;
    }
}

// File: paletteGen/palettes/types/random.js
const utils$4 = commonFn.utils;
async function random(args) {
    const baseColor = utils$4.random.hsl();
    const paletteItems = [
        await superUtils.create.paletteItem(baseColor)
    ];
    for (let i = 1; i < args.swatches; i++) {
        const randomColor = utils$4.random.hsl();
        const nextPaletteItem = await superUtils.create.paletteItem(randomColor);
        paletteItems.push(nextPaletteItem);
        helpers.update.colorBox(randomColor, i);
    }
    const idbManager = await IDBManager.getInstance();
    const paletteID = await idbManager.getNextPaletteID();
    if (!paletteID)
        throw new Error('Palette ID is either null or undefined.');
    const randomPalette = await idbManager.savePaletteToDB('random', paletteItems, paletteID, args.swatches, args.limitDark, args.limitGray, args.limitLight);
    if (!randomPalette)
        throw new Error('Random palette is either null or undefined.');
    else
        return randomPalette;
}

// File: palette/main/types/splitComplementary.js
const paletteRanges$2 = constsData.paletteRanges;
const core$3 = commonFn.core;
const utils$3 = commonFn.utils;
async function splitComplementary(args) {
    // ensure exactly 3 color swatches
    if (args.swatches !== 3)
        helpers.enforce.swatchRules(3, 3);
    // base color setup
    const baseColor = utils$3.random.hsl();
    // generate split complementary hues
    const [hue1, hue2] = superUtils.genHues.splitComplementary(baseColor.value.hue);
    // initialize palette items array
    const paletteItems = [];
    // add base color as the first item in the array
    const basePaletteItem = await superUtils.create.paletteItem(baseColor);
    paletteItems.push(basePaletteItem);
    for (const [index, hue] of [hue1, hue2].entries()) {
        const adjustedHSL = {
            value: {
                hue: core$3.brand.asRadial(hue),
                saturation: core$3.brand.asPercentile(Math.max(0, Math.min(baseColor.value.saturation +
                    (index === 0
                        ? -paletteRanges$2.shift.splitComp.sat
                        : paletteRanges$2.shift.splitComp.sat), 100))),
                lightness: core$3.brand.asPercentile(Math.max(0, Math.min(baseColor.value.lightness +
                    (index === 0
                        ? -paletteRanges$2.shift.splitComp.light
                        : paletteRanges$2.shift.splitComp.light), 100)))
            },
            format: 'hsl'
        };
        const adjustedColor = utils$3.conversion.genAllColorValues(adjustedHSL).hsl;
        if (adjustedColor) {
            const paletteItem = await superUtils.create.paletteItem(adjustedColor);
            paletteItems.push(paletteItem);
        }
    }
    const idbManager = await IDBManager.getInstance();
    const paletteID = await idbManager.getNextPaletteID();
    if (!paletteID)
        throw new Error('Palette ID is either null or undefined.');
    const splitComplementaryPalette = await idbManager.savePaletteToDB('splitComplementary', paletteItems, paletteID, args.swatches, args.limitDark, args.limitGray, args.limitLight);
    if (!splitComplementaryPalette) {
        throw new Error('Split complementary palette is either null or undefined.');
    }
    return splitComplementaryPalette;
}

// File: palette/main/types/tetradic.js
const paletteRanges$1 = constsData.paletteRanges;
const core$2 = commonFn.core;
const utils$2 = commonFn.utils;
async function tetradic(args) {
    // ensure exactly 4 swatches
    if (args.swatches !== 4)
        helpers.enforce.swatchRules(4, 4);
    // base color setup
    const baseColor = utils$2.random.hsl();
    // generate tetradic hues
    const tetradicHues = superUtils.genHues.tetradic(baseColor.value.hue);
    // initialize palette items array
    const paletteItems = [];
    // add the base color as the first palette item
    const basePaletteItem = await superUtils.create.paletteItem(baseColor);
    paletteItems.push(basePaletteItem);
    // add the tetradic colors sequentially
    for (let index = 0; index < tetradicHues.length; index++) {
        const hue = tetradicHues[index];
        const adjustedHSL = {
            value: {
                hue: core$2.brand.asRadial(hue),
                saturation: core$2.brand.asPercentile(Math.max(0, Math.min(baseColor.value.saturation +
                    (index % 2 === 0
                        ? -paletteRanges$1.shift.tetra.sat
                        : paletteRanges$1.shift.tetra.sat), 100))),
                lightness: core$2.brand.asPercentile(Math.max(0, Math.min(baseColor.value.lightness +
                    (index % 2 === 0
                        ? -paletteRanges$1.shift.tetra.light
                        : paletteRanges$1.shift.tetra.light), 100)))
            },
            format: 'hsl'
        };
        // generate all color values and create the palette item
        const adjustedColor = utils$2.conversion.genAllColorValues(adjustedHSL)
            .hsl;
        const paletteItem = await superUtils.create.paletteItem(adjustedColor);
        paletteItems.push(paletteItem);
    }
    const idbManager = await IDBManager.getInstance();
    const paletteID = await idbManager.getNextPaletteID();
    if (!paletteID)
        throw new Error('Palette ID is either null or undefined.');
    // save the palette to the database
    const tetradicPalette = await idbManager.savePaletteToDB('tetradic', paletteItems, paletteID, args.swatches, args.limitDark, args.limitGray, args.limitLight);
    // handle null or undefined palette
    if (!tetradicPalette) {
        throw new Error('Tetradic palette is either null or undefined.');
    }
    return tetradicPalette;
}

// File: palette/main/types/triadic.js
const paletteRanges = constsData.paletteRanges;
const core$1 = commonFn.core;
const utils$1 = commonFn.utils;
async function triadic(args) {
    // ensure exactly 3 swatches
    if (args.swatches !== 3)
        helpers.enforce.swatchRules(3, 3);
    // base color setup
    const baseColor = utils$1.random.hsl();
    // generate triadic hues
    const hues = superUtils.genHues.triadic(baseColor.value.hue);
    // initialize palette items array
    const paletteItems = [];
    // add the base color as the first palette item
    const basePaletteItem = await superUtils.create.paletteItem(baseColor);
    paletteItems.push(basePaletteItem);
    // add the triadic colors sequentially
    for (let index = 0; index < hues.length; index++) {
        const hue = hues[index];
        const adjustedHSL = {
            value: {
                hue: core$1.brand.asRadial(hue),
                saturation: core$1.brand.asPercentile(Math.max(0, Math.min(baseColor.value.saturation +
                    (index % 2 === 0
                        ? -paletteRanges.shift.triad.sat
                        : paletteRanges.shift.triad.sat), 100))),
                lightness: core$1.brand.asPercentile(Math.max(0, Math.min(baseColor.value.lightness +
                    (index % 2 === 0
                        ? -paletteRanges.shift.triad.light
                        : paletteRanges.shift.triad.light), 100)))
            },
            format: 'hsl'
        };
        // generate all color values and create the palette item
        const adjustedColor = utils$1.conversion.genAllColorValues(adjustedHSL)
            .hsl;
        const paletteItem = await superUtils.create.paletteItem(adjustedColor);
        paletteItems.push(paletteItem);
    }
    const idbManager = await IDBManager.getInstance();
    const paletteID = await idbManager.getNextPaletteID();
    if (!paletteID)
        throw new Error('Palette ID is either null or undefined.');
    // save the palette to the database
    const triadicPalette = await idbManager.savePaletteToDB('triadic', paletteItems, paletteID, args.swatches, args.limitDark, args.limitGray, args.limitLight);
    // handle null or undefined palette
    if (!triadicPalette) {
        throw new Error('Triadic palette is either null or undefined.');
    }
    return triadicPalette;
}

// File: palette/main/index.js
const genPalette = {
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

// File: dom/ui/main.js
const btnDebounce = constsData.debounce.btn || 300;
const defaultBrandedPalette = commonFn.transform.brandPalette(defaultData.palette.unbranded.data);
const domIDs = domData.ids.static;
const domElements = domData.elements.static;
const logMode$6 = modeData.logging;
const thisModule$6 = 'dom/ui/main.js';
const limits = helpers.limits;
const isTooDark = limits.isTooDark;
const isTooGray = limits.isTooGray;
const isTooLight = limits.isTooLight;
const core = commonFn.core;
const utils = commonFn.utils;
const logger$6 = await createLogger();
function generateLimitedHSL(baseHue, limitDark, limitGray, limitLight) {
    let hsl;
    do {
        hsl = {
            value: {
                hue: core.brand.asRadial(baseHue),
                saturation: core.brand.asPercentile(Math.random() * 100),
                lightness: core.brand.asPercentile(Math.random() * 100)
            },
            format: 'hsl'
        };
    } while ((limitGray && isTooGray(hsl)) ||
        (limitDark && isTooDark(hsl)) ||
        (limitLight && isTooLight(hsl)));
    return hsl;
}
async function generateSelectedPalette(options) {
    const thisFunction = 'selectedPalette()';
    try {
        const { flags, swatches, type } = options;
        const args = {
            swatches,
            type,
            limitDark: flags.limitDark,
            limitGray: flags.limitGray,
            limitLight: flags.limitLight
        };
        if (!modeData.quiet && logMode$6.debug && logMode$6.verbosity > 2) {
            logger$6.debug(`Generating palette with type #: ${type}`, `${thisModule$6} > ${thisFunction}`);
        }
        switch (type) {
            case 1:
                return genPalette.complementary(args);
            case 2:
                return genPalette.splitComplementary(args);
            case 3:
                return genPalette.analogous(args);
            case 4:
                return genPalette.diadic(args);
            case 5:
                return genPalette.triadic(args);
            case 6:
                return genPalette.tetradic(args);
            case 7:
                return genPalette.hexadic(args);
            case 8:
                return genPalette.monochromatic(args);
            case 9:
                return genPalette.random(args);
            default:
                if (logMode$6.error)
                    logger$6.error('Invalid palette type.', `${thisModule$6} > ${thisFunction}`);
                return Promise.resolve(defaultBrandedPalette);
        }
    }
    catch (error) {
        if (logMode$6.error)
            logger$6.error(`Error generating palette: ${error}`, `${thisModule$6} > ${thisFunction}`);
        return Promise.resolve(defaultBrandedPalette);
    }
}
const processPaletteGeneration = core.base.debounce(async () => {
    const thisFunction = 'processPaletteGeneration';
    try {
        const swatchGenNumber = domElements.selects.swatchGen;
        const paletteType = domElements.selects.paletteType;
        const limitDarkChkbx = domElements.inputs.limitDarkChkbx;
        const limitGrayChkbx = domElements.inputs.limitGrayChkbx;
        const limitLightChkbx = domElements.inputs.limitLightChkbx;
        if (swatchGenNumber === null ||
            paletteType === null ||
            limitDarkChkbx === null ||
            limitGrayChkbx === null ||
            limitLightChkbx === null) {
            if (logMode$6.error)
                logger$6.error('One or more elements are null', `${thisModule$6} > ${thisFunction}`);
            return;
        }
        if (!modeData.quiet && logMode$6.info && logMode$6.verbosity >= 2)
            logger$6.info(`numBoxes: ${parseInt(swatchGenNumber.value, 10)}\npaletteType: ${parseInt(paletteType.value, 10)}`, `${thisModule$6} > ${thisFunction}`);
        const params = {
            swatches: parseInt(swatchGenNumber.value, 10),
            type: parseInt(paletteType.value, 10),
            limitDark: limitDarkChkbx.checked,
            limitGray: limitGrayChkbx.checked,
            limitLight: limitLightChkbx.checked
        };
        const { swatches, type, limitDark, limitGray, limitLight } = params;
        if (!type || !swatches) {
            if (logMode$6.error) {
                logger$6.error('paletteType and/or swatches are undefined', `${thisModule$6} > ${thisFunction}`);
            }
            return;
        }
        const options = {
            flags: {
                limitDark,
                limitGray,
                limitLight
            },
            swatches,
            type
        };
        await startPaletteGeneration(options);
    }
    catch (error) {
        if (logMode$6.error)
            logger$6.error(`Failed to handle generate button click: ${error}`, `${thisModule$6} > ${thisFunction}`);
    }
}, btnDebounce);
async function startPaletteGeneration(options) {
    const thisFunction = 'paletteGeneration()';
    try {
        let { swatches } = options;
        if (logMode$6.info && logMode$6.verbosity > 2)
            logger$6.info('Retrieving existing IDBManager instance.', `${thisModule$6} > ${thisFunction}`);
        const idb = await getIDBInstance();
        const palette = await generateSelectedPalette(options);
        if (palette.items.length === 0) {
            if (logMode$6.error)
                logger$6.error('Colors array is empty or invalid.', `${thisModule$6} > ${thisFunction}`);
            return;
        }
        if (!modeData.quiet && logMode$6.info && logMode$6.verbosity > 0)
            logger$6.info(`Colors array generated: ${JSON.stringify(palette.items)}`, `${thisModule$6} > ${thisFunction}`);
        const tableId = await idb.getNextTableID();
        if (!tableId)
            throw new Error('Table ID is null or undefined.');
        const uiManager = await getUIManager();
        uiManager.addPaletteToHistory(palette);
        await startPaletteDomBoxGeneration(palette.items, swatches, tableId);
    }
    catch (error) {
        if (logMode$6.error)
            logger$6.error(`Error starting palette generation: ${error}`, `${thisModule$6} > ${thisFunction}`);
    }
}
async function startPaletteDomBoxGeneration(items, numBoxes, tableId) {
    const thisFunction = 'paletteDomBoxGeneration()';
    try {
        const paletteContainer = document.getElementById(domIDs.divs.paletteContainer);
        const idbManager = await getIDBInstance();
        if (!paletteContainer) {
            if (logMode$6.error)
                logger$6.error('paletteContainer is undefined.', `${thisModule$6} > ${thisFunction}`);
            return;
        }
        paletteContainer.innerHTML = '';
        const fragment = document.createDocumentFragment();
        const uiManager = await getUIManager();
        for (let i = 0; i < Math.min(items.length, numBoxes); i++) {
            const item = items[i];
            const color = { value: item.colors.main.hsl, format: 'hsl' };
            const { colorStripe } = await uiManager.makePaletteBox(color, i + 1);
            fragment.appendChild(colorStripe);
            utils.palette.populateOutputBox(color, i + 1);
        }
        paletteContainer.appendChild(fragment);
        if (!modeData.quiet && logMode$6.info && logMode$6.verbosity > 1)
            logger$6.info('Palette boxes generated and rendered.', `${thisModule$6} > ${thisFunction}`);
        await idbManager.saveData('tables', tableId, { palette: items });
    }
    catch (error) {
        if (logMode$6.error)
            logger$6.error(`Error generating palette box: ${error}`, `${thisModule$6} > ${thisFunction}`);
    }
}
const uiFn = {
    generateLimitedHSL,
    generateSelectedPalette,
    processPaletteGeneration,
    startPaletteGeneration,
    startPaletteDomBoxGeneration
};

// File: dom/eventListeners/btns.js
const btnIds = domData.ids.static.btns;
const divElements$1 = domData.elements.static.divs;
const logMode$5 = modeData.logging;
const selectionElements = domData.elements.static.selects;
const thisModule$5 = 'dom/eventListeners/groups/btns.js';
const addConversionListener = utils$b.event.addConversionListener;
const addEventListener = utils$b.event.addEventListener;
const logger$5 = await createLogger();
async function initBtnEventListeners(uiManager) {
    // 1. DESATURATE BUTTON
    addEventListener(btnIds.desaturate, 'click', async (e) => {
        e.preventDefault();
        const selectedColor = selectionElements.swatch
            ? parseInt(selectionElements.swatch.value, 10)
            : 0;
        if (!modeData.quiet && logMode$5.clicks)
            logger$5.info('desaturateButton clicked', `${thisModule$5} > desaturateButton click event`);
        uiManager.desaturateColor(selectedColor);
    });
    // 2. EXPORT BUTTON
    addEventListener(btnIds.export, 'click', async (e) => {
        e.preventDefault();
        const format = parse.paletteExportFormat();
        if (modeData.debug && logMode$5.info && logMode$5.verbosity > 1)
            logger$5.info(`Export Button click event: Export format selected: ${format}`, `${thisModule$5} > exportButton click event`);
        if (!format) {
            if (logMode$5.error && !modeData.quiet && logMode$5.verbosity > 1) {
                logger$5.error('Export format not selected', `${thisModule$5} > exportButton click event`);
                return;
            }
        }
        else {
            uiManager.handleExport(format);
        }
    });
    // 3. GENERATE BUTTON
    addEventListener(btnIds.generate, 'click', async (e) => {
        e.preventDefault();
        const { type, swatches, limitDark, limitGray, limitLight } = uiManager.pullParamsFromUI();
        if (logMode$5.info && logMode$5.verbosity > 1)
            logger$5.info('Generate Button click event: Retrieved parameters from UI.', `${thisModule$5} > generateButton click event`);
        if (logMode$5.info && modeData.debug && logMode$5.verbosity > 1)
            logger$5.info(`Type: ${type}\nSwatches: ${swatches}\nLimit Dark: ${limitDark}\nLimit Gray: ${limitGray}\nLimit Light${limitLight}.`, `${thisModule$5} > generateButton click event`);
        const paletteOptions = {
            flags: {
                limitDark,
                limitGray,
                limitLight
            },
            swatches,
            type
        };
        await uiFn.startPaletteGeneration(paletteOptions);
    });
    // 4. HELP MENU BUTTON
    addEventListener(btnIds.helpMenu, 'click', async (e) => {
        e.preventDefault();
        divElements$1.helpMenu?.classList.remove('hidden');
    });
    // 5. HISTORY MENU BUTTON
    addEventListener(btnIds.historyMenu, 'click', async (e) => {
        e.preventDefault();
        divElements$1.historyMenu?.classList.remove('hidden');
    });
    // 6. SATURATE BUTTON
    addEventListener(btnIds.saturate, 'click', async (e) => {
        e.preventDefault();
        if (!selectionElements.swatch) {
            throw new Error('Selected color option not found');
        }
        const selectedColor = selectionElements.swatch
            ? parseInt(selectionElements.swatch.value, 10)
            : 0;
        uiManager.saturateColor(selectedColor);
    });
}
function initConversionBtnEventListeners() {
    addConversionListener(String(btnIds.showAsCMYK), 'cmyk');
    addConversionListener(String(btnIds.showAsHex), 'hex');
    addConversionListener(String(btnIds.showAsHSL), 'hsl');
    addConversionListener(String(btnIds.showAsHSV), 'hsv');
    addConversionListener(String(btnIds.showAsLAB), 'lab');
    addConversionListener(String(btnIds.showAsRGB), 'rgb');
}
const btnListeners = {
    initialize: {
        conversionBtns: initConversionBtnEventListeners,
        main: initBtnEventListeners
    }
};

// File: dom/eventListeners/dad.js
const logMode$4 = modeData.logging;
const thisModule$4 = 'dom/eventListeners/groups/dad.js';
const logger$4 = await createLogger();
let dragSrcEl = null;
function attachDADListeners(element) {
    const thisFunction = 'attach()';
    try {
        if (element) {
            element.addEventListener('dragstart', dragStart);
            element.addEventListener('dragover', dragOver);
            element.addEventListener('drop', drop);
            element.addEventListener('dragend', dragEnd);
        }
        if (!modeData.quiet)
            logger$4.info('Drag and drop event listeners successfully attached', `${thisModule$4} > ${thisFunction}`);
    }
    catch (error) {
        if (!logMode$4.error)
            logger$4.error(`Failed to execute attachDragAndDropEventListeners: ${error}`, `${thisModule$4} > ${thisFunction}`);
    }
}
function dragStart(e) {
    const thisFunction = 'handleDragStart()';
    try {
        dragSrcEl = e.currentTarget;
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', dragSrcEl.outerHTML);
        }
        if (!modeData.quiet && modeData.debug && logMode$4.verbosity > 3)
            logger$4.info('handleDragStart complete', `${thisModule$4} > ${thisFunction}`);
    }
    catch (error) {
        if (logMode$4.error)
            logger$4.error(`Error in handleDragStart: ${error}`, `${thisModule$4} > ${thisFunction}`);
    }
}
function dragOver(e) {
    const thisMethod = 'handleDragOver()';
    try {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }
        if (!modeData.quiet && modeData.debug && logMode$4.verbosity > 3)
            logger$4.info('handleDragOver complete', `${thisModule$4} > ${thisMethod}`);
        return false;
    }
    catch (error) {
        if (logMode$4.error)
            logger$4.error(`Error in handleDragOver: ${error}`, `${thisModule$4} > ${thisMethod}`);
        return false;
    }
}
function dragEnd(e) {
    const thisMethod = 'handleDragEnd()';
    try {
        const target = e.currentTarget;
        target.classList.remove('dragging');
        document.querySelectorAll('.color-stripe').forEach(el => {
            el.classList.remove('dragging');
        });
        if (!modeData.quiet && modeData.debug && logMode$4.verbosity > 3)
            logger$4.info('handleDragEnd complete', `${thisModule$4} > ${thisMethod}`);
    }
    catch (error) {
        if (logMode$4.error)
            logger$4.error(`Error in handleDragEnd: ${error}`, `${thisModule$4} > ${thisMethod}`);
    }
}
function drop(e) {
    const thisMethod = 'drop()';
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
            if (!modeData.quiet && modeData.debug && logMode$4.verbosity > 3)
                logger$4.info('calling attachDragAndDropEventListeners for new elements', `${thisModule$4} > ${thisMethod}`);
            attachDADListeners(newDragSrcEl);
            attachDADListeners(newDropTargetEl);
        }
        if (!modeData.quiet && modeData.debug && logMode$4.verbosity > 3)
            logger$4.info('handleDrop complete', `${thisModule$4} > ${thisMethod}`);
    }
    catch (error) {
        if (!logMode$4.error)
            logger$4.error(`Error in handleDrop: ${error}`, `${thisModule$4} > ${thisMethod}`);
    }
}
const dadListeners = {
    attach: attachDADListeners
};

// File: dom/eventListeners/inputs.js
const inputIds = domData.ids.static.inputs;
function initInputListeners(uiManager) {
    addEventListener$1(inputIds.historyLimit, 'input', async (e) => {
        const input = e.target;
        const newLimit = parseInt(input.value, 10);
        if (isNaN(newLimit) || newLimit < 1 || newLimit > 1000) {
            input.value = '50';
            return;
        }
        await uiManager.setHistoryLimit(newLimit);
    });
}
const inputListeners = {
    initialize: initInputListeners
};

// File: dom/eventListeners/palette.js
const domClasses = domData.classes;
const logMode$3 = modeData.logging;
const thisModule$3 = 'dom/eventListeners/groups/palette.js';
const logger$3 = await createLogger();
function initLiveColorRender() {
    document.querySelectorAll(domClasses.colorInput).forEach(input => {
        input.addEventListener('input', (e) => {
            const target = e.target;
            const parsedColor = parse.colorInput(target);
            if (parsedColor) {
                if (!modeData.quiet && logMode$3.debug && logMode$3.verbosity > 1) {
                    logger$3.debug(`Parsed color: ${JSON.stringify(parsedColor)}`, `${thisModule$3}`);
                }
                const swatch = target
                    .closest(domClasses.colorStripe)
                    ?.querySelector(domClasses.colorSwatch);
                if (swatch) {
                    swatch.style.backgroundColor =
                        parsedColor.format === 'hex'
                            ? parsedColor.value.hex
                            : parsedColor.format === 'rgb'
                                ? `rgb(${parsedColor.value.red}, ${parsedColor.value.green}, ${parsedColor.value.blue})`
                                : `hsl(${parsedColor.value.hue}, ${parsedColor.value.saturation}%, ${parsedColor.value.lightness}%)`;
                }
            }
            else {
                if (!modeData.quiet && logMode$3.warn) {
                    logger$3.warn(`Invalid color input: ${target.value}`, `${thisModule$3}`);
                }
            }
        });
    });
}
const paletteListeners = {
    initialize: {
        liveColorRender: initLiveColorRender
    }
};

// File: dom/eventListeners/temp.js
const logMode$2 = modeData.logging;
const timeouts = constsData.timeouts;
const thisModule$2 = 'dom/eventListeners/groups/temp.js';
const logger$2 = await createLogger();
function showToast(message) {
    const thisMethod = 'showToast()';
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    if (!modeData.quiet && logMode$2.verbosity > 3)
        logger$2.info('Toast message added', `${thisModule$2} > ${thisMethod}`);
    setTimeout(() => {
        toast.classList.add('fade-out');
        if (!modeData.quiet && logMode$2.verbosity > 3)
            logger$2.info('Toast message faded out', `${thisModule$2} > ${thisMethod}`);
        toast.addEventListener('transitioned', () => toast.remove());
    }, timeouts.toast || 3000);
}
function showTooltip(tooltipElement) {
    const thisMethod = 'showTooltip()';
    try {
        const tooltip = tooltipElement.querySelector('.tooltiptext');
        if (tooltip) {
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
            setTimeout(() => {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
            }, constsData.timeouts.tooltip || 1000);
        }
        if (!modeData.quiet && logMode$2.verbosity > 3)
            logger$2.info('showTooltip executed', `${thisModule$2} > ${thisMethod}`);
    }
    catch (error) {
        if (logMode$2.error)
            logger$2.error(`Failed to execute showTooltip: ${error}`, `${thisModule$2} > ${thisMethod}`);
    }
}
const tempListeners = {
    showToast,
    showTooltip
};

// File: dom/eventListeners/windows.js
const divElements = domData.elements.static.divs;
function initWindowListeners() {
    window.addEventListener('click', async (e) => {
        if (divElements.helpMenu)
            if (e.target === divElements.helpMenu) {
                divElements.helpMenu.classList.add('hidden');
            }
    });
    window.addEventListener('click', async (e) => {
        if (divElements.historyMenu)
            if (e.target === divElements.historyMenu) {
                divElements.historyMenu.classList.add('hidden');
            }
    });
}
const windowListeners = {
    initialize: initWindowListeners
};

// File: dom/eventListeners/index.js
const btns = btnListeners;
const inputs = inputListeners;
const windows = windowListeners;
function initializeEventListeners(uiManager) {
    btns.initialize.conversionBtns();
    btns.initialize.main(uiManager);
    inputs.initialize(uiManager);
    windows.initialize();
}
const eventListenerFn = {
    initializeEventListeners,
    btn: btnListeners,
    dad: dadListeners,
    input: inputListeners,
    palette: paletteListeners,
    temp: tempListeners,
    window: windowListeners
};

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    eventListenerFn: eventListenerFn,
    initializeEventListeners: initializeEventListeners
});

// File: dom/validate.js
const logMode$1 = modeData.logging;
const thisModule$1 = 'dom/validate.js';
const logger$1 = await createLogger();
function validateStaticElements() {
    const thisFunction = 'validateElements()';
    const ids = domData.ids.static;
    const missingElements = [];
    // flattens the nested structure into a single array of IDs, then extracts their values
    const allIDs = Object.values(ids).flatMap(category => Object.values(category));
    allIDs.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) {
            if (logMode$1.error)
                logger$1.error(`Element with ID "${id}" not found`, `${thisModule$1} > ${thisFunction}`);
            missingElements.push(id);
        }
    });
    if (missingElements.length) {
        if (logMode$1.warn)
            logger$1.warn(`Some DOM elements are missing (${missingElements.length}): ${missingElements.join(', ')}`, `${thisModule$1} > ${thisFunction}`);
    }
    else {
        if (logMode$1.info && modeData.debug && logMode$1.verbosity > 1)
            logger$1.info('All required DOM elements are present.', `${thisModule$1} > ${thisFunction}`);
    }
}

// ColorGen - version 0.6.0-dev
// Author: Viihna Leraine (viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// You may use this code for any purpose EXCEPT for the creation of proprietary derivatives. I encourage you to improve on my code or to include it in other projects if you find it helpful. Please credit me as the original author.
// This application comes with ABSOLUTELY NO WARRANTY OR GUARANTEE OF ANY KIND.
// File: src/app.js
const logMode = modeData.logging;
const thisModule = 'app.js';
const logger = await createLogger();
if (modeData.debug)
    logger.info('Executing main application script', `${thisModule} > ANONYMOUS`);
if (document.readyState === 'loading') {
    if (modeData.debug)
        logger.info('DOM content not yet loaded. Adding DOMContentLoaded event listener and awaiting...', `${thisModule} > ANONYMOUS`);
    document.addEventListener('DOMContentLoaded', initializeApp);
}
else {
    if (modeData.debug)
        logger.info('DOM content already loaded. Initializing application immediately.', `${thisModule} > ANONYMOUS`);
    initializeApp();
}
async function initializeApp() {
    const thisFunction = 'initializeApp()';
    logger.info('DOM content loaded - Initializing application', `${thisModule} > ${thisFunction}`);
    try {
        if (modeData.logging.verbosity > 1)
            logger.info('Creating new IDBManager instance. Initializing database and its dependencies.', `${thisModule} > ${thisFunction}`);
        const idbManager = await getIDBInstance();
        const selectedSwatch = domData.elements.static.selects.swatch;
        if (modeData.debug) {
            if (!modeData.quiet && logMode.debug && logMode.verbosity > 1) {
                logger.debug('Validating DOM elements', `${thisModule} > ${thisFunction}`);
                validateStaticElements();
            }
        }
        else {
            if (!modeData.quiet) {
                logger.info('Skipping DOM element validation', `${thisModule} > ${thisFunction}`);
            }
        }
        const selectedColor = selectedSwatch
            ? parseInt(selectedSwatch.value, 10)
            : 0;
        if (!modeData.quiet && modeData.debug)
            logger.debug(`Selected color: ${selectedColor}`, `${thisModule} > ${thisFunction}`);
        const defaultPaletteOptions = defaultData.paletteOptions;
        if (!modeData.quiet && logMode.info && logMode.verbosity > 1) {
            logger.info(`Generating initial color palette.`, `${thisModule} > ${thisFunction}`);
        }
        await uiFn.startPaletteGeneration(defaultPaletteOptions);
        const uiManager = new UIManager(eventListenerFn, idbManager);
        try {
            eventListenerFn.initializeEventListeners(uiManager);
            if (!modeData.quiet)
                logger.info('Event listeners have been successfully initialized', `${thisModule} > ${thisFunction}`);
        }
        catch (error) {
            if (logMode.error)
                logger.error(`Failed to initialize event listeners.\n${error}`, `${thisModule} > ${thisFunction}`);
            if (modeData.showAlerts)
                alert('An error occurred. Check console for details.');
        }
        if (!modeData.quiet && logMode.info)
            logger.info('Application successfully initialized. Awaiting user input.', `${thisModule} > ${thisFunction}`);
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Failed to initialize application: ${error}`, `${thisModule} > ${thisFunction}`);
        if (modeData.showAlerts)
            alert('An error occurred. Check console for details.');
    }
}
//# sourceMappingURL=app.js.map
