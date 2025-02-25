// File: core/utils/partials/color/format.ts
import { defaults, regex } from '../../../../config/index.js';
const defaultColors = defaults.colors;
export function colorFormattingUtilitiesFactory(format, helpers, services) {
    const { data: { clone }, typeguards } = helpers;
    const { errors, log } = services;
    function formatColorAsCSS(color) {
        errors.handleSync(() => {
            switch (color.format) {
                case 'cmyk':
                    return `cmyk(${color.value.cyan}, ${color.value.magenta}, ${color.value.yellow}, ${color.value.key})`;
                case 'hex':
                    return String(color.value.hex);
                case 'hsl':
                    return `hsl(${Math.round(color.value.hue)},
								${Math.round(color.value.saturation)}%,
								${Math.round(color.value.lightness)}%)`;
                case 'hsv':
                    return `hsv(${color.value.hue}, ${color.value.saturation}%, ${color.value.value}%)`;
                case 'lab':
                    return `lab(${color.value.l}, ${color.value.a}, ${color.value.b})`;
                case 'rgb':
                    return `rgb(${color.value.red}, ${color.value.green}, ${color.value.blue})`;
                case 'xyz':
                    return `xyz(${color.value.x}, ${color.value.y}, ${color.value.z})`;
                default:
                    console.error(`Unexpected color format: ${color.format}`);
                    return defaults.colors.hexCSS;
            }
        }, 'Error formatting color as CSS');
        return defaults.colors.hexCSS;
    }
    function formatColorAsStringMap(color) {
        errors.handleSync(() => {
            const clonedColor = clone(color);
            if (typeguards.isHex(clonedColor)) {
                return {
                    format: 'hex',
                    value: {
                        hex: `${clonedColor.value.hex}`
                    }
                };
            }
            else if (typeguards.isColorStringMap(clonedColor)) {
                log.info(`Already formatted as color string: ${JSON.stringify(color)}`, `formatColorAsStringMap`);
                return clonedColor;
            }
            else if (typeguards.isCMYK(clonedColor)) {
                const newValue = format.formatPercentageValues(clonedColor.value);
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
            else if (typeguards.isHSL(clonedColor)) {
                const newValue = format.formatPercentageValues(clonedColor.value);
                return {
                    format: 'hsl',
                    value: {
                        hue: `${newValue.hue}`,
                        saturation: `${newValue.saturation}%`,
                        lightness: `${newValue.lightness}%`
                    }
                };
            }
            else if (typeguards.isHSV(clonedColor)) {
                const newValue = format.formatPercentageValues(clonedColor.value);
                return {
                    format: 'hsv',
                    value: {
                        hue: `${newValue.hue}`,
                        saturation: `${newValue.saturation}%`,
                        value: `${newValue.value}%`
                    }
                };
            }
            else if (typeguards.isLAB(clonedColor)) {
                const newValue = format.formatPercentageValues(clonedColor.value);
                return {
                    format: 'lab',
                    value: {
                        l: `${newValue.l}`,
                        a: `${newValue.a}`,
                        b: `${newValue.b}`
                    }
                };
            }
            else if (typeguards.isRGB(clonedColor)) {
                const newValue = format.formatPercentageValues(clonedColor.value);
                return {
                    format: 'rgb',
                    value: {
                        red: `${newValue.red}`,
                        green: `${newValue.green}`,
                        blue: `${newValue.blue}`
                    }
                };
            }
            else if (typeguards.isXYZ(clonedColor)) {
                const newValue = format.formatPercentageValues(clonedColor.value);
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
                log.warn(`Unsupported format: ${clonedColor.format}`, `formatColorAsStringMap`);
                return defaultColors.hslString;
            }
        }, 'Error formatting color as string map');
        return defaults.colors.hexString;
    }
    function formatCSSAsColor(color) {
        errors.handleSync(() => {
            color = color.trim().toLowerCase();
            const cmykMatch = color.match(regex.css.cmyk);
            const hslMatch = color.match(regex.css.hsl);
            const hsvMatch = color.match(regex.css.hsv);
            const labMatch = color.match(regex.css.lab);
            const rgbMatch = color.match(regex.css.rgb);
            const xyzMatch = color.match(regex.css.xyz);
            if (cmykMatch) {
                return {
                    value: {
                        cyan: parseInt(cmykMatch[1], 10),
                        magenta: parseInt(cmykMatch[2], 10),
                        yellow: parseInt(cmykMatch[3], 10),
                        key: parseInt(cmykMatch[4], 10)
                    },
                    format: 'cmyk'
                };
            }
            if (color.startsWith('#')) {
                const hexValue = color.length === 7
                    ? color
                    : format.convertShortHexToLong(color);
                return {
                    value: { hex: hexValue },
                    format: 'hex'
                };
            }
            if (hslMatch) {
                return {
                    value: {
                        hue: parseInt(hslMatch[1], 10),
                        saturation: parseInt(hslMatch[2], 10),
                        lightness: parseInt(hslMatch[3], 10)
                    },
                    format: 'hsl'
                };
            }
            if (hsvMatch) {
                return {
                    value: {
                        hue: parseInt(hsvMatch[1], 10),
                        saturation: parseInt(hsvMatch[2], 10),
                        value: parseInt(hsvMatch[3], 10)
                    },
                    format: 'hsv'
                };
            }
            if (labMatch) {
                return {
                    value: {
                        l: parseFloat(labMatch[1]),
                        a: parseFloat(labMatch[2]),
                        b: parseFloat(labMatch[3])
                    },
                    format: 'lab'
                };
            }
            if (rgbMatch) {
                return {
                    value: {
                        red: parseInt(rgbMatch[1], 10),
                        green: parseInt(rgbMatch[2], 10),
                        blue: parseInt(rgbMatch[3], 10)
                    },
                    format: 'rgb'
                };
            }
            if (xyzMatch) {
                return {
                    value: {
                        x: parseFloat(xyzMatch[1]),
                        y: parseFloat(xyzMatch[2]),
                        z: parseFloat(xyzMatch[3])
                    },
                    format: 'xyz'
                };
            }
            return null;
        }, 'Error formatting CSS as color');
        return null;
    }
    const colorFormattingUtilities = {
        formatColorAsCSS,
        formatColorAsStringMap,
        formatCSSAsColor
    };
    return errors.handleSync(() => colorFormattingUtilities, 'Error creating color formatting utilities sub-group.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2NvcmUvdXRpbHMvcGFydGlhbHMvY29sb3IvZm9ybWF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDRDQUE0QztBQTBCNUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUU5RCxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBRXRDLE1BQU0sVUFBVSwrQkFBK0IsQ0FDOUMsTUFBMkIsRUFDM0IsT0FBZ0IsRUFDaEIsUUFBa0I7SUFFbEIsTUFBTSxFQUNMLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxFQUNmLFVBQVUsRUFDVixHQUFHLE9BQU8sQ0FBQztJQUNaLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsUUFBUSxDQUFDO0lBRWpDLFNBQVMsZ0JBQWdCLENBQUMsS0FBWTtRQUNyQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUN0QixRQUFRLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDdEIsS0FBSyxNQUFNO29CQUNWLE9BQU8sUUFBUSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUN2RyxLQUFLLEtBQUs7b0JBQ1QsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEMsS0FBSyxLQUFLO29CQUNULE9BQU8sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1VBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7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b2xvci9mb3JtYXQudHNcblxuaW1wb3J0IHtcblx0Q01ZSyxcblx0Q01ZS1N0cmluZ01hcCxcblx0Q29sb3IsXG5cdENvbG9yRm9ybWF0VXRpbGl0aWVzLFxuXHRDb2xvclN0cmluZ01hcCxcblx0Rm9ybWF0dGluZ1V0aWxpdGllcyxcblx0SGVscGVycyxcblx0SGV4LFxuXHRIZXhTdHJpbmdNYXAsXG5cdEhTTCxcblx0SFNMU3RyaW5nTWFwLFxuXHRIU1YsXG5cdEhTVlN0cmluZ01hcCxcblx0TEFCLFxuXHRMQUJTdHJpbmdNYXAsXG5cdFJHQixcblx0UkdCU3RyaW5nTWFwLFxuXHRTZXJ2aWNlcyxcblx0U0wsXG5cdFNWLFxuXHRYWVosXG5cdFhZWlN0cmluZ01hcFxufSBmcm9tICcuLi8uLi8uLi8uLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBkZWZhdWx0cywgcmVnZXggfSBmcm9tICcuLi8uLi8uLi8uLi9jb25maWcvaW5kZXguanMnO1xuXG5jb25zdCBkZWZhdWx0Q29sb3JzID0gZGVmYXVsdHMuY29sb3JzO1xuXG5leHBvcnQgZnVuY3Rpb24gY29sb3JGb3JtYXR0aW5nVXRpbGl0aWVzRmFjdG9yeShcblx0Zm9ybWF0OiBGb3JtYXR0aW5nVXRpbGl0aWVzLFxuXHRoZWxwZXJzOiBIZWxwZXJzLFxuXHRzZXJ2aWNlczogU2VydmljZXNcbik6IENvbG9yRm9ybWF0VXRpbGl0aWVzIHtcblx0Y29uc3Qge1xuXHRcdGRhdGE6IHsgY2xvbmUgfSxcblx0XHR0eXBlZ3VhcmRzXG5cdH0gPSBoZWxwZXJzO1xuXHRjb25zdCB7IGVycm9ycywgbG9nIH0gPSBzZXJ2aWNlcztcblxuXHRmdW5jdGlvbiBmb3JtYXRDb2xvckFzQ1NTKGNvbG9yOiBDb2xvcik6IHN0cmluZyB7XG5cdFx0ZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdFx0cmV0dXJuIGBjbXlrKCR7Y29sb3IudmFsdWUuY3lhbn0sICR7Y29sb3IudmFsdWUubWFnZW50YX0sICR7Y29sb3IudmFsdWUueWVsbG93fSwgJHtjb2xvci52YWx1ZS5rZXl9KWA7XG5cdFx0XHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRcdFx0cmV0dXJuIFN0cmluZyhjb2xvci52YWx1ZS5oZXgpO1xuXHRcdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRcdHJldHVybiBgaHNsKCR7TWF0aC5yb3VuZChjb2xvci52YWx1ZS5odWUpfSxcblx0XHRcdFx0XHRcdFx0XHQke01hdGgucm91bmQoY29sb3IudmFsdWUuc2F0dXJhdGlvbil9JSxcblx0XHRcdFx0XHRcdFx0XHQke01hdGgucm91bmQoY29sb3IudmFsdWUubGlnaHRuZXNzKX0lKWA7XG5cdFx0XHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRcdFx0cmV0dXJuIGBoc3YoJHtjb2xvci52YWx1ZS5odWV9LCAke2NvbG9yLnZhbHVlLnNhdHVyYXRpb259JSwgJHtjb2xvci52YWx1ZS52YWx1ZX0lKWA7XG5cdFx0XHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRcdFx0cmV0dXJuIGBsYWIoJHtjb2xvci52YWx1ZS5sfSwgJHtjb2xvci52YWx1ZS5hfSwgJHtjb2xvci52YWx1ZS5ifSlgO1xuXHRcdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRcdHJldHVybiBgcmdiKCR7Y29sb3IudmFsdWUucmVkfSwgJHtjb2xvci52YWx1ZS5ncmVlbn0sICR7Y29sb3IudmFsdWUuYmx1ZX0pYDtcblx0XHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0XHRyZXR1cm4gYHh5eigke2NvbG9yLnZhbHVlLnh9LCAke2NvbG9yLnZhbHVlLnl9LCAke2NvbG9yLnZhbHVlLnp9KWA7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgVW5leHBlY3RlZCBjb2xvciBmb3JtYXQ6ICR7Y29sb3IuZm9ybWF0fWApO1xuXG5cdFx0XHRcdFx0cmV0dXJuIGRlZmF1bHRzLmNvbG9ycy5oZXhDU1M7XG5cdFx0XHR9XG5cdFx0fSwgJ0Vycm9yIGZvcm1hdHRpbmcgY29sb3IgYXMgQ1NTJyk7XG5cdFx0cmV0dXJuIGRlZmF1bHRzLmNvbG9ycy5oZXhDU1M7XG5cdH1cblxuXHRmdW5jdGlvbiBmb3JtYXRDb2xvckFzU3RyaW5nTWFwKGNvbG9yOiBDb2xvcik6IENvbG9yU3RyaW5nTWFwIHtcblx0XHRlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb25zdCBjbG9uZWRDb2xvciA9IGNsb25lKGNvbG9yKTtcblxuXHRcdFx0aWYgKHR5cGVndWFyZHMuaXNIZXgoY2xvbmVkQ29sb3IpKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4Jyxcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aGV4OiBgJHtjbG9uZWRDb2xvci52YWx1ZS5oZXh9YFxuXHRcdFx0XHRcdH0gYXMgSGV4U3RyaW5nTWFwWyd2YWx1ZSddXG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVndWFyZHMuaXNDb2xvclN0cmluZ01hcChjbG9uZWRDb2xvcikpIHtcblx0XHRcdFx0bG9nLmluZm8oXG5cdFx0XHRcdFx0YEFscmVhZHkgZm9ybWF0dGVkIGFzIGNvbG9yIHN0cmluZzogJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YCxcblx0XHRcdFx0XHRgZm9ybWF0Q29sb3JBc1N0cmluZ01hcGBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gY2xvbmVkQ29sb3I7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVndWFyZHMuaXNDTVlLKGNsb25lZENvbG9yKSkge1xuXHRcdFx0XHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdC5mb3JtYXRQZXJjZW50YWdlVmFsdWVzKFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlXG5cdFx0XHRcdCkgYXMgQ01ZS1sndmFsdWUnXTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGZvcm1hdDogJ2NteWsnLFxuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRjeWFuOiBgJHtuZXdWYWx1ZS5jeWFufSVgLFxuXHRcdFx0XHRcdFx0bWFnZW50YTogYCR7bmV3VmFsdWUubWFnZW50YX0lYCxcblx0XHRcdFx0XHRcdHllbGxvdzogYCR7bmV3VmFsdWUueWVsbG93fSVgLFxuXHRcdFx0XHRcdFx0a2V5OiBgJHtuZXdWYWx1ZS5rZXl9JWBcblx0XHRcdFx0XHR9IGFzIENNWUtTdHJpbmdNYXBbJ3ZhbHVlJ11cblx0XHRcdFx0fTtcblx0XHRcdH0gZWxzZSBpZiAodHlwZWd1YXJkcy5pc0hTTChjbG9uZWRDb2xvcikpIHtcblx0XHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXQuZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZVxuXHRcdFx0XHQpIGFzIEhTTFsndmFsdWUnXTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGZvcm1hdDogJ2hzbCcsXG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGh1ZTogYCR7bmV3VmFsdWUuaHVlfWAsXG5cdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBgJHtuZXdWYWx1ZS5zYXR1cmF0aW9ufSVgLFxuXHRcdFx0XHRcdFx0bGlnaHRuZXNzOiBgJHtuZXdWYWx1ZS5saWdodG5lc3N9JWBcblx0XHRcdFx0XHR9IGFzIEhTTFN0cmluZ01hcFsndmFsdWUnXVxuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlZ3VhcmRzLmlzSFNWKGNsb25lZENvbG9yKSkge1xuXHRcdFx0XHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdC5mb3JtYXRQZXJjZW50YWdlVmFsdWVzKFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlXG5cdFx0XHRcdCkgYXMgSFNWWyd2YWx1ZSddO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHN2Jyxcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aHVlOiBgJHtuZXdWYWx1ZS5odWV9YCxcblx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGAke25ld1ZhbHVlLnNhdHVyYXRpb259JWAsXG5cdFx0XHRcdFx0XHR2YWx1ZTogYCR7bmV3VmFsdWUudmFsdWV9JWBcblx0XHRcdFx0XHR9IGFzIEhTVlN0cmluZ01hcFsndmFsdWUnXVxuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlZ3VhcmRzLmlzTEFCKGNsb25lZENvbG9yKSkge1xuXHRcdFx0XHRjb25zdCBuZXdWYWx1ZSA9IGZvcm1hdC5mb3JtYXRQZXJjZW50YWdlVmFsdWVzKFxuXHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlXG5cdFx0XHRcdCkgYXMgTEFCWyd2YWx1ZSddO1xuXG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0Zm9ybWF0OiAnbGFiJyxcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0bDogYCR7bmV3VmFsdWUubH1gLFxuXHRcdFx0XHRcdFx0YTogYCR7bmV3VmFsdWUuYX1gLFxuXHRcdFx0XHRcdFx0YjogYCR7bmV3VmFsdWUuYn1gXG5cdFx0XHRcdFx0fSBhcyBMQUJTdHJpbmdNYXBbJ3ZhbHVlJ11cblx0XHRcdFx0fTtcblx0XHRcdH0gZWxzZSBpZiAodHlwZWd1YXJkcy5pc1JHQihjbG9uZWRDb2xvcikpIHtcblx0XHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBmb3JtYXQuZm9ybWF0UGVyY2VudGFnZVZhbHVlcyhcblx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZVxuXHRcdFx0XHQpIGFzIFJHQlsndmFsdWUnXTtcblxuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGZvcm1hdDogJ3JnYicsXG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdHJlZDogYCR7bmV3VmFsdWUucmVkfWAsXG5cdFx0XHRcdFx0XHRncmVlbjogYCR7bmV3VmFsdWUuZ3JlZW59YCxcblx0XHRcdFx0XHRcdGJsdWU6IGAke25ld1ZhbHVlLmJsdWV9YFxuXHRcdFx0XHRcdH0gYXMgUkdCU3RyaW5nTWFwWyd2YWx1ZSddXG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVndWFyZHMuaXNYWVooY2xvbmVkQ29sb3IpKSB7XG5cdFx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gZm9ybWF0LmZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMoXG5cdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWVcblx0XHRcdFx0KSBhcyBYWVpbJ3ZhbHVlJ107XG5cblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRmb3JtYXQ6ICd4eXonLFxuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHR4OiBgJHtuZXdWYWx1ZS54fWAsXG5cdFx0XHRcdFx0XHR5OiBgJHtuZXdWYWx1ZS55fWAsXG5cdFx0XHRcdFx0XHR6OiBgJHtuZXdWYWx1ZS56fWBcblx0XHRcdFx0XHR9IGFzIFhZWlN0cmluZ01hcFsndmFsdWUnXVxuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9nLndhcm4oXG5cdFx0XHRcdFx0YFVuc3VwcG9ydGVkIGZvcm1hdDogJHtjbG9uZWRDb2xvci5mb3JtYXR9YCxcblx0XHRcdFx0XHRgZm9ybWF0Q29sb3JBc1N0cmluZ01hcGBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdENvbG9ycy5oc2xTdHJpbmc7XG5cdFx0XHR9XG5cdFx0fSwgJ0Vycm9yIGZvcm1hdHRpbmcgY29sb3IgYXMgc3RyaW5nIG1hcCcpO1xuXHRcdHJldHVybiBkZWZhdWx0cy5jb2xvcnMuaGV4U3RyaW5nO1xuXHR9XG5cblx0ZnVuY3Rpb24gZm9ybWF0Q1NTQXNDb2xvcihjb2xvcjogc3RyaW5nKTogRXhjbHVkZTxDb2xvciwgU0wgfCBTVj4gfCBudWxsIHtcblx0XHRlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb2xvciA9IGNvbG9yLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRjb25zdCBjbXlrTWF0Y2ggPSBjb2xvci5tYXRjaChyZWdleC5jc3MuY215ayk7XG5cdFx0XHRjb25zdCBoc2xNYXRjaCA9IGNvbG9yLm1hdGNoKHJlZ2V4LmNzcy5oc2wpO1xuXHRcdFx0Y29uc3QgaHN2TWF0Y2ggPSBjb2xvci5tYXRjaChyZWdleC5jc3MuaHN2KTtcblx0XHRcdGNvbnN0IGxhYk1hdGNoID0gY29sb3IubWF0Y2gocmVnZXguY3NzLmxhYik7XG5cdFx0XHRjb25zdCByZ2JNYXRjaCA9IGNvbG9yLm1hdGNoKHJlZ2V4LmNzcy5yZ2IpO1xuXHRcdFx0Y29uc3QgeHl6TWF0Y2ggPSBjb2xvci5tYXRjaChyZWdleC5jc3MueHl6KTtcblxuXHRcdFx0aWYgKGNteWtNYXRjaCkge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRjeWFuOiBwYXJzZUludChjbXlrTWF0Y2hbMV0sIDEwKSxcblx0XHRcdFx0XHRcdG1hZ2VudGE6IHBhcnNlSW50KGNteWtNYXRjaFsyXSwgMTApLFxuXHRcdFx0XHRcdFx0eWVsbG93OiBwYXJzZUludChjbXlrTWF0Y2hbM10sIDEwKSxcblx0XHRcdFx0XHRcdGtleTogcGFyc2VJbnQoY215a01hdGNoWzRdLCAxMClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHRcdH0gYXMgQ01ZSztcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNvbG9yLnN0YXJ0c1dpdGgoJyMnKSkge1xuXHRcdFx0XHRjb25zdCBoZXhWYWx1ZSA9XG5cdFx0XHRcdFx0Y29sb3IubGVuZ3RoID09PSA3XG5cdFx0XHRcdFx0XHQ/IGNvbG9yXG5cdFx0XHRcdFx0XHQ6IGZvcm1hdC5jb252ZXJ0U2hvcnRIZXhUb0xvbmcoY29sb3IpO1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHZhbHVlOiB7IGhleDogaGV4VmFsdWUgfSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHRcdH0gYXMgSGV4O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaHNsTWF0Y2gpIHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aHVlOiBwYXJzZUludChoc2xNYXRjaFsxXSwgMTApLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogcGFyc2VJbnQoaHNsTWF0Y2hbMl0sIDEwKSxcblx0XHRcdFx0XHRcdGxpZ2h0bmVzczogcGFyc2VJbnQoaHNsTWF0Y2hbM10sIDEwKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHR9IGFzIEhTTDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGhzdk1hdGNoKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGh1ZTogcGFyc2VJbnQoaHN2TWF0Y2hbMV0sIDEwKSxcblx0XHRcdFx0XHRcdHNhdHVyYXRpb246IHBhcnNlSW50KGhzdk1hdGNoWzJdLCAxMCksXG5cdFx0XHRcdFx0XHR2YWx1ZTogcGFyc2VJbnQoaHN2TWF0Y2hbM10sIDEwKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0XHR9IGFzIEhTVjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGxhYk1hdGNoKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGw6IHBhcnNlRmxvYXQobGFiTWF0Y2hbMV0pLFxuXHRcdFx0XHRcdFx0YTogcGFyc2VGbG9hdChsYWJNYXRjaFsyXSksXG5cdFx0XHRcdFx0XHRiOiBwYXJzZUZsb2F0KGxhYk1hdGNoWzNdKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0XHR9IGFzIExBQjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHJnYk1hdGNoKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdHJlZDogcGFyc2VJbnQocmdiTWF0Y2hbMV0sIDEwKSxcblx0XHRcdFx0XHRcdGdyZWVuOiBwYXJzZUludChyZ2JNYXRjaFsyXSwgMTApLFxuXHRcdFx0XHRcdFx0Ymx1ZTogcGFyc2VJbnQocmdiTWF0Y2hbM10sIDEwKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0XHR9IGFzIFJHQjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHh5ek1hdGNoKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdHg6IHBhcnNlRmxvYXQoeHl6TWF0Y2hbMV0pLFxuXHRcdFx0XHRcdFx0eTogcGFyc2VGbG9hdCh4eXpNYXRjaFsyXSksXG5cdFx0XHRcdFx0XHR6OiBwYXJzZUZsb2F0KHh5ek1hdGNoWzNdKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdFx0XHR9IGFzIFhZWjtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSwgJ0Vycm9yIGZvcm1hdHRpbmcgQ1NTIGFzIGNvbG9yJyk7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRjb25zdCBjb2xvckZvcm1hdHRpbmdVdGlsaXRpZXM6IENvbG9yRm9ybWF0VXRpbGl0aWVzID0ge1xuXHRcdGZvcm1hdENvbG9yQXNDU1MsXG5cdFx0Zm9ybWF0Q29sb3JBc1N0cmluZ01hcCxcblx0XHRmb3JtYXRDU1NBc0NvbG9yXG5cdH07XG5cblx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKFxuXHRcdCgpID0+IGNvbG9yRm9ybWF0dGluZ1V0aWxpdGllcyxcblx0XHQnRXJyb3IgY3JlYXRpbmcgY29sb3IgZm9ybWF0dGluZyB1dGlsaXRpZXMgc3ViLWdyb3VwLidcblx0KTtcbn1cbiJdfQ==