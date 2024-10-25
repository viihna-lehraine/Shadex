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
        return { value: { hex: 'FFFFFF' }, format: 'hex' };
    }
}
export const transforms = {
    addHashToHex,
    componentToHex,
    getColorString,
    getCSSColorString,
    parseColor,
    parseColorComponents,
    parseCustomColor,
    stripHashFromHex
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3Jtcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy90cmFuc2Zvcm1zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdkMsU0FBUyxZQUFZLENBQUMsR0FBYztJQUNuQyxJQUFJLENBQUM7UUFDSixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7WUFDbkMsQ0FBQyxDQUFDLEdBQUc7WUFDTCxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBYyxFQUFFLENBQUM7SUFDakUsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUU5QyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFjLEVBQUUsQ0FBQztJQUM5RCxDQUFDO0FBQ0YsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLFNBQWlCO0lBQ3hDLElBQUksQ0FBQztRQUNKLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRS9ELE9BQU8sR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUMzQyxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFD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Q2QsaUJBQWlCO0lBQ2pCLFVBQVU7SUFDVixvQkFBb0I7SUFDcEIsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtDQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZm5PYmplY3RzIGZyb20gJy4uL2luZGV4L2ZuLW9iamVjdHMnO1xuaW1wb3J0ICogYXMgdHlwZXMgZnJvbSAnLi4vaW5kZXgvdHlwZXMnO1xuaW1wb3J0IHsgZ3VhcmRzIH0gZnJvbSAnLi90eXBlLWd1YXJkcyc7XG5cbmZ1bmN0aW9uIGFkZEhhc2hUb0hleChoZXg6IHR5cGVzLkhleCk6IHR5cGVzLkhleCB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGhleC52YWx1ZS5oZXguc3RhcnRzV2l0aCgnIycpXG5cdFx0XHQ/IGhleFxuXHRcdFx0OiB7IHZhbHVlOiB7IGhleDogYCMke2hleC52YWx1ZX19YCB9LCBmb3JtYXQ6ICdoZXgnIGFzIGNvbnN0IH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgYWRkSGFzaFRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIHsgdmFsdWU6IHsgaGV4OiAnI0ZGRkZGRicgfSwgZm9ybWF0OiAnaGV4JyBhcyBjb25zdCB9O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvbXBvbmVudFRvSGV4KGNvbXBvbmVudDogbnVtYmVyKTogc3RyaW5nIHtcblx0dHJ5IHtcblx0XHRjb25zdCBoZXggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIGNvbXBvbmVudCkpLnRvU3RyaW5nKDE2KTtcblxuXHRcdHJldHVybiBoZXgubGVuZ3RoID09PSAxID8gJzAnICsgaGV4IDogaGV4O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGNvbXBvbmVudFRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuICcwMCc7XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0Q29sb3JTdHJpbmcoY29sb3I6IHR5cGVzLkNvbG9yKTogc3RyaW5nIHwgbnVsbCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgZm9ybWF0dGVycyA9IHtcblx0XHRcdGNteWs6IChjOiB0eXBlcy5DTVlLKSA9PlxuXHRcdFx0XHRgY215aygke2MudmFsdWUuY3lhbn0sICR7Yy52YWx1ZS5tYWdlbnRhfSwgJHtjLnZhbHVlLnllbGxvd30sICR7Yy52YWx1ZS5rZXl9KWAsXG5cdFx0XHRoZXg6IChjOiB0eXBlcy5IZXgpID0+IGMudmFsdWUuaGV4LFxuXHRcdFx0aHNsOiAoYzogdHlwZXMuSFNMKSA9PlxuXHRcdFx0XHRgaHNsKCR7Yy52YWx1ZS5odWV9LCAke2MudmFsdWUuc2F0dXJhdGlvbn0lLCAke2MudmFsdWUubGlnaHRuZXNzfSUpYCxcblx0XHRcdGhzdjogKGM6IHR5cGVzLkhTVikgPT5cblx0XHRcdFx0YGhzdigke2MudmFsdWUuaHVlfSwgJHtjLnZhbHVlLnNhdHVyYXRpb259JSwgJHtjLnZhbHVlLnZhbHVlfSUpYCxcblx0XHRcdGxhYjogKGM6IHR5cGVzLkxBQikgPT5cblx0XHRcdFx0YGxhYigke2MudmFsdWUubH0sICR7Yy52YWx1ZS5hfSwgJHtjLnZhbHVlLmJ9KWAsXG5cdFx0XHRyZ2I6IChjOiB0eXBlcy5SR0IpID0+XG5cdFx0XHRcdGByZ2IoJHtjLnZhbHVlLnJlZH0sICR7Yy52YWx1ZS5ncmVlbn0sICR7Yy52YWx1ZS5ibHVlfSlgLFxuXHRcdFx0eHl6OiAoYzogdHlwZXMuWFlaKSA9PlxuXHRcdFx0XHRgeHl6KCR7Yy52YWx1ZS54fSwgJHtjLnZhbHVlLnl9LCAke2MudmFsdWUuen0pYFxuXHRcdH07XG5cblx0XHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmNteWsoY29sb3IpO1xuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMuaGV4KGNvbG9yKTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLmhzbChjb2xvcik7XG5cdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy5oc3YoY29sb3IpO1xuXHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcnMubGFiKGNvbG9yKTtcblx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXJzLnJnYihjb2xvcik7XG5cdFx0XHRjYXNlICd4eXonOlxuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVycy54eXooY29sb3IpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0IGZvciAke2NvbG9yfWApO1xuXG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBnZXRDb2xvclN0cmluZyBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldENTU0NvbG9yU3RyaW5nKGNvbG9yOiB0eXBlcy5Db2xvcik6IHN0cmluZyB7XG5cdHRyeSB7XG5cdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRyZXR1cm4gYGNteWsoJHtjb2xvci52YWx1ZS5jeWFufSwke2NvbG9yLnZhbHVlLm1hZ2VudGF9LCR7Y29sb3IudmFsdWUueWVsbG93fSwke2NvbG9yLnZhbHVlLmtleX0pYDtcblx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdHJldHVybiBTdHJpbmcoY29sb3IudmFsdWUuaGV4KTtcblx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdHJldHVybiBgaHNsKCR7Y29sb3IudmFsdWUuaHVlfSwke2NvbG9yLnZhbHVlLnNhdHVyYXRpb259JSwke2NvbG9yLnZhbHVlLmxpZ2h0bmVzc30lKWA7XG5cdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRyZXR1cm4gYGhzdigke2NvbG9yLnZhbHVlLmh1ZX0sJHtjb2xvci52YWx1ZS5zYXR1cmF0aW9ufSUsJHtjb2xvci52YWx1ZS52YWx1ZX0lKWA7XG5cdFx0XHRjYXNlICdsYWInOlxuXHRcdFx0XHRyZXR1cm4gYGxhYigke2NvbG9yLnZhbHVlLmx9LCR7Y29sb3IudmFsdWUuYX0sJHtjb2xvci52YWx1ZS5ifSlgO1xuXHRcdFx0Y2FzZSAncmdiJzpcblx0XHRcdFx0cmV0dXJuIGByZ2IoJHtjb2xvci52YWx1ZS5yZWR9LCR7Y29sb3IudmFsdWUuZ3JlZW59LCR7Y29sb3IudmFsdWUuYmx1ZX0pYDtcblx0XHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRcdHJldHVybiBgeHl6KCR7Y29sb3IudmFsdWUueH0sJHtjb2xvci52YWx1ZS55fSwke2NvbG9yLnZhbHVlLnp9KWA7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdVbmV4cGVjdGVkIGNvbG9yIGZvcm1hdCcpO1xuXG5cdFx0XHRcdHJldHVybiAnI0ZGRkZGRic7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYGdldENTU0NvbG9yU3RyaW5nIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuICcjRkZGRkZGJztcblx0fVxufVxuXG5jb25zdCBwYXJzZUNvbG9yID0gKFxuXHRjb2xvclNwYWNlOiB0eXBlcy5Db2xvclNwYWNlLFxuXHR2YWx1ZTogc3RyaW5nXG4pOiB0eXBlcy5Db2xvciB8IG51bGwgPT4ge1xuXHR0cnkge1xuXHRcdHN3aXRjaCAoY29sb3JTcGFjZSkge1xuXHRcdFx0Y2FzZSAnY215ayc6IHtcblx0XHRcdFx0Y29uc3QgW2MsIG0sIHksIGtdID0gcGFyc2VDb2xvckNvbXBvbmVudHModmFsdWUsIDQpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHsgY3lhbjogYywgbWFnZW50YTogbSwgeWVsbG93OiB5LCBrZXk6IGsgfSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZTogeyBoZXg6IGd1YXJkcy5lbnN1cmVIYXNoKHZhbHVlKSB9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdFx0fTtcblx0XHRcdGNhc2UgJ2hzbCc6IHtcblx0XHRcdFx0Y29uc3QgW2gsIHMsIGxdID0gcGFyc2VDb2xvckNvbXBvbmVudHModmFsdWUsIDMpO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHsgaHVlOiBoLCBzYXR1cmF0aW9uOiBzLCBsaWdodG5lc3M6IGwgfSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdoc3YnOiB7XG5cdFx0XHRcdGNvbnN0IFtoLCBzLCB2XSA9IHBhcnNlQ29sb3JDb21wb25lbnRzKHZhbHVlLCAzKTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7IGh1ZTogaCwgc2F0dXJhdGlvbjogcywgdmFsdWU6IHYgfSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdsYWInOiB7XG5cdFx0XHRcdGNvbnN0IFtsLCBhLCBiXSA9IHBhcnNlQ29sb3JDb21wb25lbnRzKHZhbHVlLCAzKTtcblx0XHRcdFx0cmV0dXJuIHsgdmFsdWU6IHsgbCwgYSwgYiB9LCBmb3JtYXQ6ICdsYWInIH07XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdyZ2InOiB7XG5cdFx0XHRcdGNvbnN0IFtyLCBnLCBiXSA9IHZhbHVlLnNwbGl0KCcsJykubWFwKE51bWJlcik7XG5cblx0XHRcdFx0cmV0dXJuIHsgdmFsdWU6IHsgcmVkOiByLCBncmVlbjogZywgYmx1ZTogYiB9LCBmb3JtYXQ6ICdyZ2InIH07XG5cdFx0XHR9XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtjb2xvclNwYWNlfWApO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBwYXJzZUNvbG9yIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn07XG5cbmZ1bmN0aW9uIHBhcnNlQ29sb3JDb21wb25lbnRzKHZhbHVlOiBzdHJpbmcsIGV4cGVjdGVkTGVuZ3RoOiBudW1iZXIpOiBudW1iZXJbXSB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY29tcG9uZW50cyA9IHZhbHVlXG5cdFx0XHQuc3BsaXQoJywnKVxuXHRcdFx0Lm1hcChjb21wID0+IHBhcnNlRmxvYXQoY29tcC50cmltKCkpKTtcblxuXHRcdGlmIChjb21wb25lbnRzLmxlbmd0aCAhPT0gZXhwZWN0ZWRMZW5ndGggfHwgY29tcG9uZW50cy5zb21lKGlzTmFOKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRgSW52YWxpZCBjb2xvciBjb21wb25lbnRzLiBFeHBlY3RlZCAke2V4cGVjdGVkTGVuZ3RofSB2YWx1ZXMgYnV0IGdvdCAke3ZhbHVlfWBcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbXBvbmVudHM7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgcGFyc2VDb2xvckNvbXBvbmVudHMgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gW107XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VDdXN0b21Db2xvcihcblx0Y29sb3JTcGFjZTogdHlwZXMuQ29sb3JTcGFjZSxcblx0cmF3VmFsdWU6IHN0cmluZ1xuKTogdHlwZXMuQ29sb3IgfCBudWxsIHtcblx0dHJ5IHtcblx0XHRjb25zb2xlLmxvZyhgUGFyc2luZyBjdXN0b20gY29sb3I6ICR7SlNPTi5zdHJpbmdpZnkocmF3VmFsdWUpfWApO1xuXG5cdFx0c3dpdGNoIChjb2xvclNwYWNlKSB7XG5cdFx0XHRjYXNlICdjbXlrJzoge1xuXHRcdFx0XHRjb25zdCBtYXRjaCA9IHJhd1ZhbHVlLm1hdGNoKFxuXHRcdFx0XHRcdC9jbXlrXFwoKFxcZCspJT8sXFxzKihcXGQrKSU/LFxccyooXFxkKyklPyxcXHMqKFxcZCspJT9cXCkvaVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0XHRjb25zdCBbLCBjeWFuLCBtYWdlbnRhLCB5ZWxsb3csIGtleV0gPSBtYXRjaC5tYXAoTnVtYmVyKTtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHsgY3lhbiwgbWFnZW50YSwgeWVsbG93LCBrZXkgfSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSAnaGV4Jzoge1xuXHRcdFx0XHRpZiAoIXJhd1ZhbHVlLnN0YXJ0c1dpdGgoJyMnKSkge1xuXHRcdFx0XHRcdHJldHVybiBhZGRIYXNoVG9IZXgoe1xuXHRcdFx0XHRcdFx0dmFsdWU6IHsgaGV4OiByYXdWYWx1ZSB9LFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiB7IHZhbHVlOiB7IGhleDogcmF3VmFsdWUgfSwgZm9ybWF0OiAnaGV4JyB9O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdoc2wnOiB7XG5cdFx0XHRcdGNvbnN0IG1hdGNoID0gcmF3VmFsdWUubWF0Y2goXG5cdFx0XHRcdFx0L2hzbFxcKChcXGQrKSxcXHMqKFxcZCspJSxcXHMqKFxcZCspJVxcKS9cblx0XHRcdFx0KTtcblxuXHRcdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0XHRjb25zdCBbLCBodWUsIHNhdHVyYXRpb24sIGxpZ2h0bmVzc10gPSBtYXRjaC5tYXAoTnVtYmVyKTtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHsgaHVlLCBzYXR1cmF0aW9uLCBsaWdodG5lc3MgfSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdoc3YnOiB7XG5cdFx0XHRcdGNvbnN0IG1hdGNoID0gcmF3VmFsdWUubWF0Y2goXG5cdFx0XHRcdFx0L2hzdlxcKChcXGQrKSxcXHMqKFxcZCspJT8sXFxzKihcXGQrKSU/XFwpL2lcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0XHRjb25zdCBbLCBodWUsIHNhdHVyYXRpb24sIHZhbHVlXSA9IG1hdGNoLm1hcChOdW1iZXIpO1xuXHRcdFx0XHRcdHJldHVybiB7IHZhbHVlOiB7IGh1ZSwgc2F0dXJhdGlvbiwgdmFsdWUgfSwgZm9ybWF0OiAnaHN2JyB9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdsYWInOiB7XG5cdFx0XHRcdGNvbnN0IG1hdGNoID0gcmF3VmFsdWUubWF0Y2goXG5cdFx0XHRcdFx0L2xhYlxcKChbLVxcZC5dKyksXFxzKihbLVxcZC5dKyksXFxzKihbLVxcZC5dKylcXCkvaVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmIChtYXRjaCkge1xuXHRcdFx0XHRcdGNvbnN0IFssIGwsIGEsIGJdID0gbWF0Y2gubWFwKE51bWJlcik7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7IGwsIGEsIGIgfSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdyZ2InOiB7XG5cdFx0XHRcdGNvbnN0IG1hdGNoID0gcmF3VmFsdWUubWF0Y2goL3JnYlxcKChcXGQrKSxcXHMqKFxcZCspLFxccyooXFxkKylcXCkvaSk7XG5cblx0XHRcdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHRcdFx0Y29uc3QgWywgcmVkLCBncmVlbiwgYmx1ZV0gPSBtYXRjaC5tYXAoTnVtYmVyKTtcblx0XHRcdFx0XHRyZXR1cm4geyB2YWx1ZTogeyByZWQsIGdyZWVuLCBibHVlIH0sIGZvcm1hdDogJ3JnYicgfTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Y29uc29sZS53YXJuKGBVbnN1cHBvcnRlZCBjb2xvciBzcGFjZTogJHtjb2xvclNwYWNlfWApO1xuXG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBwYXJzZSBjdXN0b20gY29sb3I6ICR7cmF3VmFsdWV9YCk7XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBwYXJzZUN1c3RvbUNvbG9yIGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuZnVuY3Rpb24gc3RyaXBIYXNoRnJvbUhleChoZXg6IHR5cGVzLkhleCk6IHR5cGVzLkhleCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgaGV4U3RyaW5nID0gaGV4LnZhbHVlLmhleDtcblxuXHRcdHJldHVybiBoZXgudmFsdWUuaGV4LnN0YXJ0c1dpdGgoJyMnKVxuXHRcdFx0PyB7IHZhbHVlOiB7IGhleDogaGV4U3RyaW5nLnNsaWNlKDEpIH0sIGZvcm1hdDogJ2hleCcgYXMgY29uc3QgfVxuXHRcdFx0OiBoZXg7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgc3RyaXBIYXNoRnJvbUhleCBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiB7IHZhbHVlOiB7IGhleDogJ0ZGRkZGRicgfSwgZm9ybWF0OiAnaGV4JyBhcyBjb25zdCB9O1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm1zOiBmbk9iamVjdHMuVHJhbnNmb3JtcyA9IHtcblx0YWRkSGFzaFRvSGV4LFxuXHRjb21wb25lbnRUb0hleCxcblx0Z2V0Q29sb3JTdHJpbmcsXG5cdGdldENTU0NvbG9yU3RyaW5nLFxuXHRwYXJzZUNvbG9yLFxuXHRwYXJzZUNvbG9yQ29tcG9uZW50cyxcblx0cGFyc2VDdXN0b21Db2xvcixcblx0c3RyaXBIYXNoRnJvbUhleFxufTtcbiJdfQ==