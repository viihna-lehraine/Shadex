import { core } from './core.js';
import { defaults } from '../config/defaults.js';
import { guards } from './type-guards.js';
function addHashToHex(hex) {
    try {
        return hex.value.hex.startsWith('#')
            ? hex
            : { value: { hex: `#${hex.value}}` }, format: 'hex' };
    }
    catch (error) {
        console.error(`addHashToHex error: ${error}`);
        return { value: { hex: '#FFFFFF' }, format: 'hex' };
    }
}
function colorToColorString(color) {
    try {
        if (guards.isColorString(color)) {
            console.log(`Already formatted as color string: ${JSON.stringify(color)}`);
            return color;
        }
        const clonedColor = core.clone(color);
        const addPercentage = (key, value) => [
            'cyan',
            'magenta',
            'yellow',
            'key',
            'saturation',
            'lightness',
            'value'
        ].includes(key) && typeof value === 'number'
            ? `${value}%`
            : value;
        const newValue = Object.entries(clonedColor.value).reduce((acc, [key, val]) => {
            acc[key] = addPercentage(key, val);
            return acc;
        }, {});
        if (guards.isCMYKColor(clonedColor)) {
            return {
                format: 'cmyk',
                value: newValue
            };
        }
        else if (guards.isHSLColor(clonedColor)) {
            return { format: 'hsl', value: newValue };
        }
        else if (guards.isHSVColor(clonedColor)) {
            return { format: 'hsv', value: newValue };
        }
        else if (guards.isSLColor(clonedColor)) {
            return { format: 'sl', value: newValue };
        }
        else if (guards.isSVColor(clonedColor)) {
            return { format: 'sv', value: newValue };
        }
        else {
            throw new Error(`Unsupported format: ${clonedColor.format}`);
        }
    }
    catch (error) {
        console.error(`addPercentToColorString error: ${error}`);
        throw new Error('Failed to add percent to color string');
    }
}
function colorStringToColor(color) {
    try {
        const clonedColor = core.clone(color);
        const parseValue = (value) => typeof value === 'string' && value.endsWith('%')
            ? parseFloat(value.slice(0, -1))
            : Number(value);
        const newValue = Object.entries(clonedColor.value).reduce((acc, [key, val]) => {
            acc[key] = parseValue(val);
            return acc;
        }, {});
        console.log(`Stripped percent from ${clonedColor.format} color string: ${JSON.stringify(newValue)}`);
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
                throw new Error('Unsupported format');
        }
    }
    catch (error) {
        console.error(`stripPercentFromColorString error: ${error}`);
        throw new Error('Failed to strip percent from color string');
    }
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
                return `cmyk(${color.value.cyan},${color.value.magenta},${color.value.yellow},${color.value.key})`;
            case 'hex':
                return String(color.value.hex);
            case 'hsl':
                return `hsl(${color.value.hue},${color.value.saturation}%,${color.value.lightness}%)`;
            case 'hsv':
                return `hsv(${color.value.hue},${color.value.saturation}%,${color.value.value}%)`;
            case 'lab':
                return `lab(${color.value.l},${color.value.a},${color.value.b})`;
            case 'rgb':
                return `rgb(${color.value.red},${color.value.green},${color.value.blue})`;
            case 'xyz':
                return `xyz(${color.value.x},${color.value.y},${color.value.z})`;
            default:
                console.error('Unexpected color format');
                return '#FFFFFF';
        }
    }
    catch (error) {
        console.error(`getCSSColorString error: ${error}`);
        return '#FFFFFF';
    }
}
function getRawColorString(color) {
    try {
        switch (color.format) {
            case 'cmyk':
                const cmykValue = stripPercentFromValues(color.value);
                return `cmyk(${cmykValue.cyan},${cmykValue.magenta},${cmykValue.yellow},${cmykValue.key})`;
            case 'hex':
                return stripHashFromHex(color).value.hex;
            case 'hsl':
                const hslValue = stripPercentFromValues(color.value);
                return `hsl(${hslValue.hue},${hslValue.saturation},${hslValue.lightness})`;
            case 'hsv':
                const hsvValue = stripPercentFromValues(color.value);
                return `hsv(${hsvValue.hue},${hsvValue.saturation},${hsvValue.value})`;
            case 'lab':
                return `lab(${color.value.l},${color.value.a},${color.value.b})`;
            case 'rgb':
                return `rgb(${color.value.red},${color.value.green},${color.value.blue})`;
            case 'sl':
                const slValue = stripPercentFromValues(color.value);
                return `sl(${slValue.saturation},${slValue.lightness})`;
            case 'sv':
                const svValue = stripPercentFromValues(color.value);
                return `sv(${svValue.saturation},${svValue.value})`;
            case 'xyz':
                return `xyz(${color.value.x},${color.value.y},${color.value.z})`;
            default:
                throw new Error(`Unsupported color format`);
        }
    }
    catch (error) {
        console.error(`getRawColorString error: ${error}`);
        return '';
    }
}
const parseColor = (colorSpace, value) => {
    try {
        switch (colorSpace) {
            case 'cmyk': {
                const [c, m, y, k] = parseColorComponents(value, 4);
                return {
                    value: { cyan: c, magenta: m, yellow: y, key: k },
                    format: 'cmyk'
                };
            }
            case 'hex':
                return {
                    value: { hex: guards.ensureHash(value) },
                    format: 'hex'
                };
            case 'hsl': {
                const [h, s, l] = parseColorComponents(value, 3);
                return {
                    value: { hue: h, saturation: s, lightness: l },
                    format: 'hsl'
                };
            }
            case 'hsv': {
                const [h, s, v] = parseColorComponents(value, 3);
                return {
                    value: { hue: h, saturation: s, value: v },
                    format: 'hsv'
                };
            }
            case 'lab': {
                const [l, a, b] = parseColorComponents(value, 3);
                return { value: { l, a, b }, format: 'lab' };
            }
            case 'rgb': {
                const [r, g, b] = value.split(',').map(Number);
                return { value: { red: r, green: g, blue: b }, format: 'rgb' };
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
function parseColorComponents(value, expectedLength) {
    try {
        const components = value
            .split(',')
            .map(comp => parseFloat(comp.trim()));
        if (components.length !== expectedLength || components.some(isNaN)) {
            throw new Error(`Invalid color components. Expected ${expectedLength} values but got ${value}`);
        }
        return components;
    }
    catch (error) {
        console.error(`parseColorComponents error: ${error}`);
        return [];
    }
}
function parseCustomColor(colorSpace, rawValue) {
    try {
        console.log(`Parsing custom color: ${JSON.stringify(rawValue)}`);
        switch (colorSpace) {
            case 'cmyk': {
                const match = rawValue.match(/cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?\)/i);
                if (match) {
                    const [, cyan, magenta, yellow, key] = match.map(Number);
                    return {
                        value: { cyan, magenta, yellow, key },
                        format: 'cmyk'
                    };
                }
                break;
            }
            case 'hex': {
                if (!rawValue.startsWith('#')) {
                    return addHashToHex({
                        value: { hex: rawValue },
                        format: 'hex'
                    });
                }
                else {
                    return { value: { hex: rawValue }, format: 'hex' };
                }
            }
            case 'hsl': {
                const match = rawValue.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
                if (match) {
                    const [, hue, saturation, lightness] = match.map(Number);
                    return {
                        value: { hue, saturation, lightness },
                        format: 'hsl'
                    };
                }
                break;
            }
            case 'hsv': {
                const match = rawValue.match(/hsv\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/i);
                if (match) {
                    const [, hue, saturation, value] = match.map(Number);
                    return { value: { hue, saturation, value }, format: 'hsv' };
                }
                break;
            }
            case 'lab': {
                const match = rawValue.match(/lab\(([-\d.]+),\s*([-\d.]+),\s*([-\d.]+)\)/i);
                if (match) {
                    const [, l, a, b] = match.map(Number);
                    return {
                        value: { l, a, b },
                        format: 'lab'
                    };
                }
                break;
            }
            case 'rgb': {
                const match = rawValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
                if (match) {
                    const [, red, green, blue] = match.map(Number);
                    return { value: { red, green, blue }, format: 'rgb' };
                }
                break;
            }
            default:
                console.warn(`Unsupported color space: ${colorSpace}`);
                return null;
        }
        console.error(`Failed to parse custom color: ${rawValue}`);
        return null;
    }
    catch (error) {
        console.error(`parseCustomColor error: ${error}`);
        return null;
    }
}
function stripHashFromHex(hex) {
    try {
        const hexString = hex.value.hex;
        return hex.value.hex.startsWith('#')
            ? { value: { hex: hexString.slice(1) }, format: 'hex' }
            : hex;
    }
    catch (error) {
        console.error(`stripHashFromHex error: ${error}`);
        return core.clone(defaults.defaultHex);
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
export const transform = {
    addHashToHex,
    colorToColorString,
    colorStringToColor,
    componentToHex,
    getColorString,
    getCSSColorString,
    getRawColorString,
    parseColor,
    parseColorComponents,
    parseCustomColor,
    stripHashFromHex,
    stripPercentFromValues
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3RyYW5zZm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUc5QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXZDLFNBQVMsWUFBWSxDQUFDLEdBQWU7SUFDcEMsSUFBSSxDQUFDO1FBQ0osT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxHQUFHO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQWMsRUFBRSxDQUFDO0lBQ2pFLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsdUJBQXVCLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFOUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBYyxFQUFFLENBQUM7SUFDOUQsQ0FBQztBQUNGLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUMxQixLQUFrRTtJQUVsRSxJQUFJLENBQUM7UUFDSixJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUNqQyxPQUFPLENBQUMsR0FBRyxDQUNWLHNDQUFzQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQzdELENBQUM7WUFDRixPQUFPLEtBQUssQ0FBQztRQUNkLENBQUM7UUFFRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FB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RUFBRTtRQUNuQixNQUFNLFdBQVcsR0FDaEIsT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO1lBQzNDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1IsR0FBRyxDQUFDLEdBQWMsQ0FBQyxHQUFHLFdBRVQsQ0FBQztRQUNkLE9BQU8sR0FBRyxDQUFDO0lBQ1osQ0FBQyxFQUNELEVBQW1FLENBQ25FLENBQUM7QUFDSCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUF3QjtJQUM3QyxZQUFZO0lBQ1osa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUNsQixjQUFjO0lBQ2QsY0FBYztJQUNkLGlCQUFpQjtJQUNqQixpQkFBaUI7SUFDakIsVUFBVTtJQUNWLG9CQUFvQjtJQUNwQixnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLHNCQUFzQjtDQUN0QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29yZSB9IGZyb20gJy4vY29yZSc7XG5pbXBvcnQgeyBkZWZhdWx0cyB9IGZyb20gJy4uL2NvbmZpZy9kZWZhdWx0cyc7XG5pbXBvcnQgKiBhcyBmbk9iamVjdHMgZnJvbSAnLi4vaW5kZXgvZm4tb2JqZWN0cyc7XG5pbXBvcnQgKiBhcyBjb2xvcnMgZnJvbSAnLi4vaW5kZXgvY29sb3JzJztcbmltcG9ydCB7IGd1YXJkcyB9IGZyb20gJy4vdHlwZS1ndWFyZHMnO1xuXG5mdW5jdGlvbiBhZGRIYXNoVG9IZXgoaGV4OiBjb2xvcnMuSGV4KTogY29sb3JzLkhleCB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGhleC52YWx1ZS5oZXguc3RhcnRzV2l0aCgnIycpXG5cdFx0XHQ/IGhleFxuXHRcdFx0OiB7IHZhbHVlOiB7IGhleDogYCMke2hleC52YWx1ZX19YCB9LCBmb3JtYXQ6ICdoZXgnIGFzIGNvbnN0IH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgYWRkSGFzaFRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIHsgdmFsdWU6IHsgaGV4OiAnI0ZGRkZGRicgfSwgZm9ybWF0OiAnaGV4JyBhcyBjb25zdCB9O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvbG9yVG9Db2xvclN0cmluZyhcblx0Y29sb3I6IEV4Y2x1ZGU8Y29sb3JzLkNvbG9yLCBjb2xvcnMuSGV4IHwgY29sb3JzLkxBQiB8IGNvbG9ycy5SR0I+XG4pOiBjb2xvcnMuQ29sb3JTdHJpbmcge1xuXHR0cnkge1xuXHRcdGlmIChndWFyZHMuaXNDb2xvclN0cmluZyhjb2xvcikpIHtcblx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRgQWxyZWFkeSBmb3JtYXR0ZWQgYXMgY29sb3Igc3RyaW5nOiAke0pTT04uc3RyaW5naWZ5KGNvbG9yKX1gXG5cdFx0XHQpO1xuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNsb25lZENvbG9yID0gY29yZS5jbG9uZShjb2xvcik7XG5cblx0XHRjb25zdCBhZGRQZXJjZW50YWdlID0gKFxuXHRcdFx0a2V5OiBrZXlvZiAodHlwZW9mIGNsb25lZENvbG9yKVsndmFsdWUnXSxcblx0XHRcdHZhbHVlOiBudW1iZXIgfCBzdHJpbmdcblx0XHQpOiBzdHJpbmcgfCBudW1iZXIgPT5cblx0XHRcdFtcblx0XHRcdFx0J2N5YW4nLFxuXHRcdFx0XHQnbWFnZW50YScsXG5cdFx0XHRcdCd5ZWxsb3cnLFxuXHRcdFx0XHQna2V5Jyxcblx0XHRcdFx0J3NhdHVyYXRpb24nLFxuXHRcdFx0XHQnbGlnaHRuZXNzJyxcblx0XHRcdFx0J3ZhbHVlJ1xuXHRcdFx0XS5pbmNsdWRlcyhrZXkgYXMgc3RyaW5nKSAmJiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInXG5cdFx0XHRcdD8gYCR7dmFsdWV9JWBcblx0XHRcdFx0OiB2YWx1ZTtcblxuXHRcdGNvbnN0IG5ld1ZhbHVlID0gT2JqZWN0LmVudHJpZXMoY2xvbmVkQ29sb3IudmFsdWUpLnJlZHVjZShcblx0XHRcdChhY2MsIFtrZXksIHZhbF0pID0+IHtcblx0XHRcdFx0YWNjW2tleSBhcyBrZXlvZiAodHlwZW9mIGNsb25lZENvbG9yKVsndmFsdWUnXV0gPSBhZGRQZXJjZW50YWdlKFxuXHRcdFx0XHRcdGtleSBhcyBrZXlvZiAodHlwZW9mIGNsb25lZENvbG9yKVsndmFsdWUnXSxcblx0XHRcdFx0XHR2YWxcblx0XHRcdFx0KSBhcyBuZXZlcjtcblx0XHRcdFx0cmV0dXJuIGFjYztcblx0XHRcdH0sXG5cdFx0XHR7fSBhcyBSZWNvcmQ8a2V5b2YgKHR5cGVvZiBjbG9uZWRDb2xvcilbJ3ZhbHVlJ10sIHN0cmluZyB8IG51bWJlcj5cblx0XHQpO1xuXG5cdFx0aWYgKGd1YXJkcy5pc0NNWUtDb2xvcihjbG9uZWRDb2xvcikpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGZvcm1hdDogJ2NteWsnLFxuXHRcdFx0XHR2YWx1ZTogbmV3VmFsdWUgYXMgY29sb3JzLkNNWUtWYWx1ZVN0cmluZ1xuXHRcdFx0fTtcblx0XHR9IGVsc2UgaWYgKGd1YXJkcy5pc0hTTENvbG9yKGNsb25lZENvbG9yKSkge1xuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnaHNsJywgdmFsdWU6IG5ld1ZhbHVlIGFzIGNvbG9ycy5IU0xWYWx1ZVN0cmluZyB9O1xuXHRcdH0gZWxzZSBpZiAoZ3VhcmRzLmlzSFNWQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdoc3YnLCB2YWx1ZTogbmV3VmFsdWUgYXMgY29sb3JzLkhTVlZhbHVlU3RyaW5nIH07XG5cdFx0fSBlbHNlIGlmIChndWFyZHMuaXNTTENvbG9yKGNsb25lZENvbG9yKSkge1xuXHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnc2wnLCB2YWx1ZTogbmV3VmFsdWUgYXMgY29sb3JzLlNMVmFsdWVTdHJpbmcgfTtcblx0XHR9IGVsc2UgaWYgKGd1YXJkcy5pc1NWQ29sb3IoY2xvbmVkQ29sb3IpKSB7XG5cdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdzdicsIHZhbHVlOiBuZXdWYWx1ZSBhcyBjb2xvcnMuU1ZWYWx1ZVN0cmluZyB9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGZvcm1hdDogJHtjbG9uZWRDb2xvci5mb3JtYXR9YCk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGFkZFBlcmNlbnRUb0NvbG9yU3RyaW5nIGVycm9yOiAke2Vycm9yfWApO1xuXHRcdHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGFkZCBwZXJjZW50IHRvIGNvbG9yIHN0cmluZycpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvbG9yU3RyaW5nVG9Db2xvcihcblx0Y29sb3I6IGNvbG9ycy5Db2xvclN0cmluZ1xuKTogRXhjbHVkZTxjb2xvcnMuQ29sb3IsIGNvbG9ycy5IZXggfCBjb2xvcnMuTEFCIHwgY29sb3JzLlJHQj4ge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNsb25lZENvbG9yID0gY29yZS5jbG9uZShjb2xvcik7XG5cdFx0Y29uc3QgcGFyc2VWYWx1ZSA9ICh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyID0+XG5cdFx0XHR0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLmVuZHNXaXRoKCclJylcblx0XHRcdFx0PyBwYXJzZUZsb2F0KHZhbHVlLnNsaWNlKDAsIC0xKSlcblx0XHRcdFx0OiBOdW1iZXIodmFsdWUpO1xuXHRcdGNvbnN0IG5ld1ZhbHVlID0gT2JqZWN0LmVudHJpZXMoY2xvbmVkQ29sb3IudmFsdWUpLnJlZHVjZShcblx0XHRcdChhY2MsIFtrZXksIHZhbF0pID0+IHtcblx0XHRcdFx0YWNjW2tleSBhcyBrZXlvZiAodHlwZW9mIGNsb25lZENvbG9yKVsndmFsdWUnXV0gPSBwYXJzZVZhbHVlKFxuXHRcdFx0XHRcdHZhbFxuXHRcdFx0XHQpIGFzIG5ldmVyO1xuXHRcdFx0XHRyZXR1cm4gYWNjO1xuXHRcdFx0fSxcblx0XHRcdHt9IGFzIFJlY29yZDxrZXlvZiAodHlwZW9mIGNsb25lZENvbG9yKVsndmFsdWUnXSwgbnVtYmVyPlxuXHRcdCk7XG5cblx0XHRjb25zb2xlLmxvZyhcblx0XHRcdGBTdHJpcHBlZCBwZXJjZW50IGZyb20gJHtjbG9uZWRDb2xvci5mb3JtYXR9IGNvbG9yIHN0cmluZzogJHtKU09OLnN0cmluZ2lmeShuZXdWYWx1ZSl9YFxuXHRcdCk7XG5cblx0XHRzd2l0Y2ggKGNsb25lZENvbG9yLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdHJldHVybiB7IGZvcm1hdDogJ2NteWsnLCB2YWx1ZTogbmV3VmFsdWUgYXMgY29sb3JzLkNNWUtWYWx1ZSB9O1xuXHRcdFx0Y2FzZSAnaHNsJzpcblx0XHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnaHNsJywgdmFsdWU6IG5ld1ZhbHVlIGFzIGNvbG9ycy5IU0xWYWx1ZSB9O1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnaHN2JywgdmFsdWU6IG5ld1ZhbHVlIGFzIGNvbG9ycy5IU1ZWYWx1ZSB9O1xuXHRcdFx0Y2FzZSAnc2wnOlxuXHRcdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdzbCcsIHZhbHVlOiBuZXdWYWx1ZSBhcyBjb2xvcnMuU0xWYWx1ZSB9O1xuXHRcdFx0Y2FzZSAnc3YnOlxuXHRcdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdzdicsIHZhbHVlOiBuZXdWYWx1ZSBhcyBjb2xvcnMuU1ZWYWx1ZSB9O1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBmb3JtYXQnKTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgc3RyaXBQZXJjZW50RnJvbUNvbG9yU3RyaW5nIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gc3RyaXAgcGVyY2VudCBmcm9tIGNvbG9yIHN0cmluZycpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvbXBvbmVudFRvSGV4KGNvbXBvbmVudDogbnVtYmVyKTogc3RyaW5nIHtcblx0dHJ5IHtcblx0XHRjb25zdCBoZXggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIGNvbXBvbmVudCkpLnRvU3RyaW5nKDE2KTtcblxuXHRcdHJldHVybiBoZXgubGVuZ3RoID09PSAxID8gJzAnICsgaGV4IDogaGV4O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGNvbXBvbmVudFRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuICcwMCc7XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0Q29sb3JTdHJpbmcoY29sb3I6IGNvbG9ycy5Db2xvcik6IHN0cmluZyB8IG51bGwge1xuXHR0cnkge1xuXHRcdGNvbnN0IGZvcm1hdHRlcnMgPSB7XG5cdFx0XHRjbXlrOiAoYzogY29sb3JzLkNNWUspID0+XG5cdFx0XHRcdGBjbXlrKCR7Yy52YWx1ZS5jeWFufSwgJHtjLnZhbHVlLm1hZ2VudGF9LCAke2MudmFsdWUueWVsbG93fSwgJHtjLnZhbHVlLmtleX0pYCxcblx0XHRcdGhleDogKGM6IGNvbG9ycy5IZXgpID0+IGMudmFsdWUuaGV4LFxuXHRcdFx0aHNsOiAoYzogY29sb3JzLkhTTCkgPT5cblx0XHRcdFx0YGhzbCgke2MudmFsdWUuaHVlfSwgJHtjLnZhbHVlLnNhdHVyYXRpb259JSwgJHtjLnZhbHVlLmxpZ2h0bmVzc30lKWAsXG5cdFx0XHRoc3Y6IChjOiBjb2xvcnMuSFNWKSA9PlxuXHRcdFx0XHRgaHN2KCR7Yy52YWx1ZS5odWV9LCAke2MudmFsdWUuc2F0dXJhdGlvbn0lLCAke2MudmFsdWUudmFsdWV9JSlgLFxuXHRcdFx0bGFiOiAoYzogY29sb3JzLkxBQikgPT5cblx0XHRcdFx0YGxhYigke2MudmFsdWUubH0sICR7Yy52YWx1ZS5hfSwgJHtjLnZhbHVlLmJ9KWAsXG5cdFx0XHRyZ2I6IChjOiBjb2xvcnMuUkdCKSA9PlxuXHRcdFx0XHRgcmdiKCR7Yy52YWx1ZS5yZWR9LCAke2MudmFsdWUuZ3JlZW59LCAke2MudmFsdWUuYmx1ZX0pYCxcblx0XHRcdHh5ejogKGM6IGNvbG9ycy5YWVopID0+XG5cdFx0XHRcdGB4eXooJHtjLnZhbHVlLnh9LCAke2MudmFsdWUueX0sICR7Yy52YWx1ZS56fSlgXG5cdFx0fTtcblxuXHRcdHN3aXRjaCAoY29sb3IuZm9ybWF0KSB7XG5cdFx0XHRjYXNlICdjbXlrJzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMuY215ayhjb2xvcik7XG5cdFx0XHRjYXNlICdoZXgnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5oZXgoY29sb3IpO1xuXHRcdFx0Y2FzZSAnaHNsJzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMuaHNsKGNvbG9yKTtcblx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmhzdihjb2xvcik7XG5cdFx0XHRjYXNlICdsYWInOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5sYWIoY29sb3IpO1xuXHRcdFx0Y2FzZSAncmdiJzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMucmdiKGNvbG9yKTtcblx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLnh5eihjb2xvcik7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQgZm9yICR7Y29sb3J9YCk7XG5cblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGdldENvbG9yU3RyaW5nIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0Q1NTQ29sb3JTdHJpbmcoY29sb3I6IGNvbG9ycy5Db2xvcik6IHN0cmluZyB7XG5cdHRyeSB7XG5cdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gYGNteWsoJHtjb2xvci52YWx1ZS5jeWFufSwke2NvbG9yLnZhbHVlLm1hZ2VudGF9LCR7Y29sb3IudmFsdWUueWVsbG93fSwke2NvbG9yLnZhbHVlLmtleX0pYDtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBTdHJpbmcoY29sb3IudmFsdWUuaGV4KTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiBgaHNsKCR7Y29sb3IudmFsdWUuaHVlfSwke2NvbG9yLnZhbHVlLnNhdHVyYXRpb259JSwke2NvbG9yLnZhbHVlLmxpZ2h0bmVzc30lKWA7XG5cdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRyZXR1cm4gYGhzdigke2NvbG9yLnZhbHVlLmh1ZX0sJHtjb2xvci52YWx1ZS5zYXR1cmF0aW9ufSUsJHtjb2xvci52YWx1ZS52YWx1ZX0lKWA7XG5cdFx0XHRjYXNlICdsYWInOlxuXHRcdFx0XHRyZXR1cm4gYGxhYigke2NvbG9yLnZhbHVlLmx9LCR7Y29sb3IudmFsdWUuYX0sJHtjb2xvci52YWx1ZS5ifSlgO1xuXHRcdFx0Y2FzZSAncmdiJzpcblx0XHRcdFx0cmV0dXJuIGByZ2IoJHtjb2xvci52YWx1ZS5yZWR9LCR7Y29sb3IudmFsdWUuZ3JlZW59LCR7Y29sb3IudmFsdWUuYmx1ZX0pYDtcblx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdHJldHVybiBgeHl6KCR7Y29sb3IudmFsdWUueH0sJHtjb2xvci52YWx1ZS55fSwke2NvbG9yLnZhbHVlLnp9KWA7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdVbmV4cGVjdGVkIGNvbG9yIGZvcm1hdCcpO1xuXG5cdFx0XHRcdHJldHVybiAnI0ZGRkZGRic7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGdldENTU0NvbG9yU3RyaW5nIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuICcjRkZGRkZGJztcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRSYXdDb2xvclN0cmluZyhjb2xvcjogY29sb3JzLkNvbG9yKTogc3RyaW5nIHtcblx0dHJ5IHtcblx0XHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdGNvbnN0IGNteWtWYWx1ZSA9IHN0cmlwUGVyY2VudEZyb21WYWx1ZXMoY29sb3IudmFsdWUpO1xuXG5cdFx0XHRcdHJldHVybiBgY215aygke2NteWtWYWx1ZS5jeWFufSwke2NteWtWYWx1ZS5tYWdlbnRhfSwke2NteWtWYWx1ZS55ZWxsb3d9LCR7Y215a1ZhbHVlLmtleX0pYDtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBzdHJpcEhhc2hGcm9tSGV4KGNvbG9yKS52YWx1ZS5oZXg7XG5cdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRjb25zdCBoc2xWYWx1ZSA9IHN0cmlwUGVyY2VudEZyb21WYWx1ZXMoY29sb3IudmFsdWUpO1xuXG5cdFx0XHRcdHJldHVybiBgaHNsKCR7aHNsVmFsdWUuaHVlfSwke2hzbFZhbHVlLnNhdHVyYXRpb259LCR7aHNsVmFsdWUubGlnaHRuZXNzfSlgO1xuXHRcdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdFx0Y29uc3QgaHN2VmFsdWUgPSBzdHJpcFBlcmNlbnRGcm9tVmFsdWVzKGNvbG9yLnZhbHVlKTtcblxuXHRcdFx0XHRyZXR1cm4gYGhzdigke2hzdlZhbHVlLmh1ZX0sJHtoc3ZWYWx1ZS5zYXR1cmF0aW9ufSwke2hzdlZhbHVlLnZhbHVlfSlgO1xuXHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0cmV0dXJuIGBsYWIoJHtjb2xvci52YWx1ZS5sfSwke2NvbG9yLnZhbHVlLmF9LCR7Y29sb3IudmFsdWUuYn0pYDtcblx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdHJldHVybiBgcmdiKCR7Y29sb3IudmFsdWUucmVkfSwke2NvbG9yLnZhbHVlLmdyZWVufSwke2NvbG9yLnZhbHVlLmJsdWV9KWA7XG5cdFx0XHRjYXNlICdzbCc6XG5cdFx0XHRcdGNvbnN0IHNsVmFsdWUgPSBzdHJpcFBlcmNlbnRGcm9tVmFsdWVzKGNvbG9yLnZhbHVlKTtcblxuXHRcdFx0XHRyZXR1cm4gYHNsKCR7c2xWYWx1ZS5zYXR1cmF0aW9ufSwke3NsVmFsdWUubGlnaHRuZXNzfSlgO1xuXHRcdFx0Y2FzZSAnc3YnOlxuXHRcdFx0XHRjb25zdCBzdlZhbHVlID0gc3RyaXBQZXJjZW50RnJvbVZhbHVlcyhjb2xvci52YWx1ZSk7XG5cblx0XHRcdFx0cmV0dXJuIGBzdigke3N2VmFsdWUuc2F0dXJhdGlvbn0sJHtzdlZhbHVlLnZhbHVlfSlgO1xuXHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0cmV0dXJuIGB4eXooJHtjb2xvci52YWx1ZS54fSwke2NvbG9yLnZhbHVlLnl9LCR7Y29sb3IudmFsdWUuen0pYDtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0YCk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGdldFJhd0NvbG9yU3RyaW5nIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuICcnO1xuXHR9XG59XG5cbmNvbnN0IHBhcnNlQ29sb3IgPSAoXG5cdGNvbG9yU3BhY2U6IGNvbG9ycy5Db2xvclNwYWNlLFxuXHR2YWx1ZTogc3RyaW5nXG4pOiBjb2xvcnMuQ29sb3IgfCBudWxsID0+IHtcblx0dHJ5IHtcblx0XHRzd2l0Y2ggKGNvbG9yU3BhY2UpIHtcblx0XHRcdGNhc2UgJ2NteWsnOiB7XG5cdFx0XHRcdGNvbnN0IFtjLCBtLCB5LCBrXSA9IHBhcnNlQ29sb3JDb21wb25lbnRzKHZhbHVlLCA0KTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7IGN5YW46IGMsIG1hZ2VudGE6IG0sIHllbGxvdzogeSwga2V5OiBrIH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHsgaGV4OiBndWFyZHMuZW5zdXJlSGFzaCh2YWx1ZSkgfSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdH07XG5cdFx0XHRjYXNlICdoc2wnOiB7XG5cdFx0XHRcdGNvbnN0IFtoLCBzLCBsXSA9IHBhcnNlQ29sb3JDb21wb25lbnRzKHZhbHVlLCAzKTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7IGh1ZTogaCwgc2F0dXJhdGlvbjogcywgbGlnaHRuZXNzOiBsIH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAnaHN2Jzoge1xuXHRcdFx0XHRjb25zdCBbaCwgcywgdl0gPSBwYXJzZUNvbG9yQ29tcG9uZW50cyh2YWx1ZSwgMyk7XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZTogeyBodWU6IGgsIHNhdHVyYXRpb246IHMsIHZhbHVlOiB2IH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAnbGFiJzoge1xuXHRcdFx0XHRjb25zdCBbbCwgYSwgYl0gPSBwYXJzZUNvbG9yQ29tcG9uZW50cyh2YWx1ZSwgMyk7XG5cdFx0XHRcdHJldHVybiB7IHZhbHVlOiB7IGwsIGEsIGIgfSwgZm9ybWF0OiAnbGFiJyB9O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAncmdiJzoge1xuXHRcdFx0XHRjb25zdCBbciwgZywgYl0gPSB2YWx1ZS5zcGxpdCgnLCcpLm1hcChOdW1iZXIpO1xuXG5cdFx0XHRcdHJldHVybiB7IHZhbHVlOiB7IHJlZDogciwgZ3JlZW46IGcsIGJsdWU6IGIgfSwgZm9ybWF0OiAncmdiJyB9O1xuXHRcdFx0fVxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQ6ICR7Y29sb3JTcGFjZX1gKTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgcGFyc2VDb2xvciBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59O1xuXG5mdW5jdGlvbiBwYXJzZUNvbG9yQ29tcG9uZW50cyh2YWx1ZTogc3RyaW5nLCBleHBlY3RlZExlbmd0aDogbnVtYmVyKTogbnVtYmVyW10ge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNvbXBvbmVudHMgPSB2YWx1ZVxuXHRcdFx0LnNwbGl0KCcsJylcblx0XHRcdC5tYXAoY29tcCA9PiBwYXJzZUZsb2F0KGNvbXAudHJpbSgpKSk7XG5cblx0XHRpZiAoY29tcG9uZW50cy5sZW5ndGggIT09IGV4cGVjdGVkTGVuZ3RoIHx8IGNvbXBvbmVudHMuc29tZShpc05hTikpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0YEludmFsaWQgY29sb3IgY29tcG9uZW50cy4gRXhwZWN0ZWQgJHtleHBlY3RlZExlbmd0aH0gdmFsdWVzIGJ1dCBnb3QgJHt2YWx1ZX1gXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb21wb25lbnRzO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYHBhcnNlQ29sb3JDb21wb25lbnRzIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIFtdO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ3VzdG9tQ29sb3IoXG5cdGNvbG9yU3BhY2U6IGNvbG9ycy5Db2xvclNwYWNlLFxuXHRyYXdWYWx1ZTogc3RyaW5nXG4pOiBjb2xvcnMuQ29sb3IgfCBudWxsIHtcblx0dHJ5IHtcblx0XHRjb25zb2xlLmxvZyhgUGFyc2luZyBjdXN0b20gY29sb3I6ICR7SlNPTi5zdHJpbmdpZnkocmF3VmFsdWUpfWApO1xuXG5cdFx0c3dpdGNoIChjb2xvclNwYWNlKSB7XG5cdFx0XHRjYXNlICdjbXlrJzoge1xuXHRcdFx0XHRjb25zdCBtYXRjaCA9IHJhd1ZhbHVlLm1hdGNoKFxuXHRcdFx0XHRcdC9jbXlrXFwoKFxcZCspJT8sXFxzKihcXGQrKSU/LFxccyooXFxkKyklPyxcXHMqKFxcZCspJT9cXCkvaVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0XHRjb25zdCBbLCBjeWFuLCBtYWdlbnRhLCB5ZWxsb3csIGtleV0gPSBtYXRjaC5tYXAoTnVtYmVyKTtcblxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHR2YWx1ZTogeyBjeWFuLCBtYWdlbnRhLCB5ZWxsb3csIGtleSB9LFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdoZXgnOiB7XG5cdFx0XHRcdGlmICghcmF3VmFsdWUuc3RhcnRzV2l0aCgnIycpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGFkZEhhc2hUb0hleCh7XG5cdFx0XHRcdFx0XHR2YWx1ZTogeyBoZXg6IHJhd1ZhbHVlIH0sXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIHsgdmFsdWU6IHsgaGV4OiByYXdWYWx1ZSB9LCBmb3JtYXQ6ICdoZXgnIH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNhc2UgJ2hzbCc6IHtcblx0XHRcdFx0Y29uc3QgbWF0Y2ggPSByYXdWYWx1ZS5tYXRjaChcblx0XHRcdFx0XHQvaHNsXFwoKFxcZCspLFxccyooXFxkKyklLFxccyooXFxkKyklXFwpL1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmIChtYXRjaCkge1xuXHRcdFx0XHRcdGNvbnN0IFssIGh1ZSwgc2F0dXJhdGlvbiwgbGlnaHRuZXNzXSA9IG1hdGNoLm1hcChOdW1iZXIpO1xuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHR2YWx1ZTogeyBodWUsIHNhdHVyYXRpb24sIGxpZ2h0bmVzcyB9LFxuXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAnaHN2Jzoge1xuXHRcdFx0XHRjb25zdCBtYXRjaCA9IHJhd1ZhbHVlLm1hdGNoKFxuXHRcdFx0XHRcdC9oc3ZcXCgoXFxkKyksXFxzKihcXGQrKSU/LFxccyooXFxkKyklP1xcKS9pXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHRcdFx0Y29uc3QgWywgaHVlLCBzYXR1cmF0aW9uLCB2YWx1ZV0gPSBtYXRjaC5tYXAoTnVtYmVyKTtcblxuXHRcdFx0XHRcdHJldHVybiB7IHZhbHVlOiB7IGh1ZSwgc2F0dXJhdGlvbiwgdmFsdWUgfSwgZm9ybWF0OiAnaHN2JyB9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdsYWInOiB7XG5cdFx0XHRcdGNvbnN0IG1hdGNoID0gcmF3VmFsdWUubWF0Y2goXG5cdFx0XHRcdFx0L2xhYlxcKChbLVxcZC5dKyksXFxzKihbLVxcZC5dKyksXFxzKihbLVxcZC5dKylcXCkvaVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmIChtYXRjaCkge1xuXHRcdFx0XHRcdGNvbnN0IFssIGwsIGEsIGJdID0gbWF0Y2gubWFwKE51bWJlcik7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7IGwsIGEsIGIgfSxcblxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGNhc2UgJ3JnYic6IHtcblx0XHRcdFx0Y29uc3QgbWF0Y2ggPSByYXdWYWx1ZS5tYXRjaCgvcmdiXFwoKFxcZCspLFxccyooXFxkKyksXFxzKihcXGQrKVxcKS9pKTtcblxuXHRcdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0XHRjb25zdCBbLCByZWQsIGdyZWVuLCBibHVlXSA9IG1hdGNoLm1hcChOdW1iZXIpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHsgdmFsdWU6IHsgcmVkLCBncmVlbiwgYmx1ZSB9LCBmb3JtYXQ6ICdyZ2InIH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGNvbnNvbGUud2FybihgVW5zdXBwb3J0ZWQgY29sb3Igc3BhY2U6ICR7Y29sb3JTcGFjZX1gKTtcblxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gcGFyc2UgY3VzdG9tIGNvbG9yOiAke3Jhd1ZhbHVlfWApO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgcGFyc2VDdXN0b21Db2xvciBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHN0cmlwSGFzaEZyb21IZXgoaGV4OiBjb2xvcnMuSGV4KTogY29sb3JzLkhleCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgaGV4U3RyaW5nID0gaGV4LnZhbHVlLmhleDtcblxuXHRcdHJldHVybiBoZXgudmFsdWUuaGV4LnN0YXJ0c1dpdGgoJyMnKVxuXHRcdFx0PyB7IHZhbHVlOiB7IGhleDogaGV4U3RyaW5nLnNsaWNlKDEpIH0sIGZvcm1hdDogJ2hleCcgYXMgY29uc3QgfVxuXHRcdFx0OiBoZXg7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgc3RyaXBIYXNoRnJvbUhleCBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBjb3JlLmNsb25lKGRlZmF1bHRzLmRlZmF1bHRIZXgpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHN0cmlwUGVyY2VudEZyb21WYWx1ZXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIG51bWJlciB8IHN0cmluZz4+KFxuXHR2YWx1ZTogVFxuKTogeyBbSyBpbiBrZXlvZiBUXTogVFtLXSBleHRlbmRzIGAke251bWJlcn0lYCA/IG51bWJlciA6IFRbS10gfSB7XG5cdHJldHVybiBPYmplY3QuZW50cmllcyh2YWx1ZSkucmVkdWNlKFxuXHRcdChhY2MsIFtrZXksIHZhbF0pID0+IHtcblx0XHRcdGNvbnN0IHBhcnNlZFZhbHVlID1cblx0XHRcdFx0dHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgdmFsLmVuZHNXaXRoKCclJylcblx0XHRcdFx0XHQ/IHBhcnNlRmxvYXQodmFsLnNsaWNlKDAsIC0xKSlcblx0XHRcdFx0XHQ6IHZhbDtcblx0XHRcdGFjY1trZXkgYXMga2V5b2YgVF0gPSBwYXJzZWRWYWx1ZSBhcyBUW2tleW9mIFRdIGV4dGVuZHMgYCR7bnVtYmVyfSVgXG5cdFx0XHRcdD8gbnVtYmVyXG5cdFx0XHRcdDogVFtrZXlvZiBUXTtcblx0XHRcdHJldHVybiBhY2M7XG5cdFx0fSxcblx0XHR7fSBhcyB7IFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgYCR7bnVtYmVyfSVgID8gbnVtYmVyIDogVFtLXSB9XG5cdCk7XG59XG5cbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm06IGZuT2JqZWN0cy5UcmFuc2Zvcm0gPSB7XG5cdGFkZEhhc2hUb0hleCxcblx0Y29sb3JUb0NvbG9yU3RyaW5nLFxuXHRjb2xvclN0cmluZ1RvQ29sb3IsXG5cdGNvbXBvbmVudFRvSGV4LFxuXHRnZXRDb2xvclN0cmluZyxcblx0Z2V0Q1NTQ29sb3JTdHJpbmcsXG5cdGdldFJhd0NvbG9yU3RyaW5nLFxuXHRwYXJzZUNvbG9yLFxuXHRwYXJzZUNvbG9yQ29tcG9uZW50cyxcblx0cGFyc2VDdXN0b21Db2xvcixcblx0c3RyaXBIYXNoRnJvbUhleCxcblx0c3RyaXBQZXJjZW50RnJvbVZhbHVlc1xufTtcbiJdfQ==