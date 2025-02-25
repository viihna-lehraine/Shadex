// File: core/utils/formatting.ts
import { defaults } from '../../config/index.js';
const defaultColors = defaults.colors;
export function formattingUtilitiesFactory(brand, services, validate) {
    const { errors, log } = services;
    const parseColor = (colorSpace, value) => errors.handleSync(() => {
        switch (colorSpace) {
            case 'cmyk': {
                const [c, m, y, k] = parseComponents(value, 5);
                return {
                    value: {
                        cyan: brand.asPercentile(c),
                        magenta: brand.asPercentile(m),
                        yellow: brand.asPercentile(y),
                        key: brand.asPercentile(k)
                    },
                    format: 'cmyk'
                };
            }
            case 'hex': {
                const hexValue = value.startsWith('#')
                    ? value
                    : `#${value}`;
                return {
                    value: {
                        hex: brand.asHexSet(hexValue)
                    },
                    format: 'hex'
                };
            }
            case 'hsl': {
                const [h, s, l] = parseComponents(value, 4);
                return {
                    value: {
                        hue: brand.asRadial(h),
                        saturation: brand.asPercentile(s),
                        lightness: brand.asPercentile(l)
                    },
                    format: 'hsl'
                };
            }
            case 'hsv': {
                const [h, s, v] = parseComponents(value, 4);
                return {
                    value: {
                        hue: brand.asRadial(h),
                        saturation: brand.asPercentile(s),
                        value: brand.asPercentile(v)
                    },
                    format: 'hsv'
                };
            }
            case 'lab': {
                const [l, a, b] = parseComponents(value, 4);
                return {
                    value: {
                        l: brand.asLAB_L(l),
                        a: brand.asLAB_A(a),
                        b: brand.asLAB_B(b)
                    },
                    format: 'lab'
                };
            }
            case 'rgb': {
                const components = value.split(',').map(Number);
                if (components.some(isNaN)) {
                    throw new Error(`Invalid RGB format for value: ${value}`);
                }
                const [r, g, b] = components;
                return {
                    value: {
                        red: brand.asByteRange(r),
                        green: brand.asByteRange(g),
                        blue: brand.asByteRange(b)
                    },
                    format: 'rgb'
                };
            }
            default: {
                const message = `Unsupported color format: ${colorSpace}`;
                log.error(`Failed to parse color: ${message}`, `utils.format.parseColor`);
                return null;
            }
        }
    }, 'Error parsing color', { context: { colorSpace, value }, fallback: null });
    function addHashToHex(hex) {
        return errors.handleSync(() => {
            return hex.value.hex.startsWith('#')
                ? hex
                : {
                    value: {
                        hex: brand.asHexSet(`#${hex.value}}`)
                    },
                    format: 'hex'
                };
        }, 'Error occurred while adding hash to hex color.');
    }
    function componentToHex(component) {
        return errors.handleSync(() => {
            const hex = Math.max(0, Math.min(255, component)).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }, 'Error occurred while converting component to hex partial.');
    }
    function convertShortHexToLong(hex) {
        return errors.handleSync(() => {
            if (hex.length !== 4)
                return hex;
            return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        }, 'Error occurred while converting short hex to long hex.');
    }
    function formatPercentageValues(value) {
        return errors.handleSync(() => {
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
        }, 'Error formatting percentage values', { context: { value } });
    }
    function hslAddFormat(value) {
        return errors.handleSync(() => {
            if (!validate.colorValue({
                value: value,
                format: 'hsl'
            })) {
                log.error(`Invalid HSL value ${JSON.stringify(value)}`, `utils.format.hslAddFormat`);
                return defaultColors.hsl;
            }
            return { value: value, format: 'hsl' };
        }, 'Error occurred while adding format to HSL value.');
    }
    function parseComponents(value, count) {
        return errors.handleSync(() => {
            const components = value
                .split(',')
                .map(val => val.trim().endsWith('%')
                ? parseFloat(val)
                : parseFloat(val) * 100);
            if (components.length !== count) {
                log.error(`Expected ${count} components.`, `utils.format.parseComponents`);
                return [];
            }
            return components;
        }, 'Error occurred while parsing components.');
    }
    function stripHashFromHex(hex) {
        return errors.handleSync(() => {
            const hexString = `${hex.value.hex}`;
            return hex.value.hex.startsWith('#')
                ? {
                    value: {
                        hex: brand.asHexSet(hexString.slice(1))
                    },
                    format: 'hex'
                }
                : hex;
        }, 'Error occurred while stripping hash from hex color.');
    }
    function stripPercentFromValues(value) {
        return errors.handleSync(() => {
            return Object.entries(value).reduce((acc, [key, val]) => {
                const parsedValue = typeof val === 'string' && val.endsWith('%')
                    ? parseFloat(val.slice(0, -1))
                    : val;
                acc[key] =
                    parsedValue;
                return acc;
            }, {});
        }, 'Error occurred while stripping percent from values.', { context: value });
    }
    const formattingUtilities = {
        addHashToHex,
        componentToHex,
        convertShortHexToLong,
        formatPercentageValues,
        hslAddFormat,
        parseColor,
        parseComponents,
        stripHashFromHex,
        stripPercentFromValues
    };
    return errors.handleSync(() => formattingUtilities, 'Error occurred while creating formatting utilities group.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvcmUvdXRpbHMvZm9ybWF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGlDQUFpQztBQWFqQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFakQsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUV0QyxNQUFNLFVBQVUsMEJBQTBCLENBQ3pDLEtBQXdCLEVBQ3hCLFFBQWtCLEVBQ2xCLFFBQTZCO0lBRTdCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsUUFBUSxDQUFDO0lBRWpDLE1BQU0sVUFBVSxHQUFHLENBQUMsVUFBc0IsRUFBRSxLQUFhLEVBQWdCLEVBQUUsQ0FDMUUsTUFBTSxDQUFDLFVBQVUsQ0FDaEIsR0FBRyxFQUFFO1FBQ0osUUFBUSxVQUFVLEVBQUUsQ0FBQztZQUNwQixLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBRS9DLE9BQU87b0JBQ04sS0FBSyxFQUFFO3dCQUNOLElBQUksRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzt3QkFDM0IsT0FBTyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO3dCQUM5QixNQUFNLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7d0JBQzdCLEdBQUcsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztxQkFDMUI7b0JBQ0QsTUFBTSxFQUFFLE1BQU07aUJBQ2QsQ0FBQztZQUNILENBQUM7WUFDRCxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1osTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFVBQVUs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dEIsWUFBWTtRQUNaLFVBQVU7UUFDVixlQUFlO1FBQ2YsZ0JBQWdCO1FBQ2hCLHNCQUFzQjtLQUN0QixDQUFDO0lBRUYsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUN2QixHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsRUFDekIsMkRBQTJELENBQzNELENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogY29yZS91dGlscy9mb3JtYXR0aW5nLnRzXG5cbmltcG9ydCB7XG5cdEJyYW5kaW5nVXRpbGl0aWVzLFxuXHRDb2xvcixcblx0Q29sb3JTcGFjZSxcblx0Rm9ybWF0dGluZ1V0aWxpdGllcyxcblx0SGV4LFxuXHRIU0wsXG5cdE51bWVyaWNCcmFuZGVkVHlwZSxcblx0U2VydmljZXMsXG5cdFZhbGlkYXRpb25VdGlsaXRpZXNcbn0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgZGVmYXVsdHMgfSBmcm9tICcuLi8uLi9jb25maWcvaW5kZXguanMnO1xuXG5jb25zdCBkZWZhdWx0Q29sb3JzID0gZGVmYXVsdHMuY29sb3JzO1xuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0dGluZ1V0aWxpdGllc0ZhY3RvcnkoXG5cdGJyYW5kOiBCcmFuZGluZ1V0aWxpdGllcyxcblx0c2VydmljZXM6IFNlcnZpY2VzLFxuXHR2YWxpZGF0ZTogVmFsaWRhdGlvblV0aWxpdGllc1xuKTogRm9ybWF0dGluZ1V0aWxpdGllcyB7XG5cdGNvbnN0IHsgZXJyb3JzLCBsb2cgfSA9IHNlcnZpY2VzO1xuXG5cdGNvbnN0IHBhcnNlQ29sb3IgPSAoY29sb3JTcGFjZTogQ29sb3JTcGFjZSwgdmFsdWU6IHN0cmluZyk6IENvbG9yIHwgbnVsbCA9PlxuXHRcdGVycm9ycy5oYW5kbGVTeW5jKFxuXHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRzd2l0Y2ggKGNvbG9yU3BhY2UpIHtcblx0XHRcdFx0XHRjYXNlICdjbXlrJzoge1xuXHRcdFx0XHRcdFx0Y29uc3QgW2MsIG0sIHksIGtdID0gcGFyc2VDb21wb25lbnRzKHZhbHVlLCA1KTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0XHRjeWFuOiBicmFuZC5hc1BlcmNlbnRpbGUoYyksXG5cdFx0XHRcdFx0XHRcdFx0bWFnZW50YTogYnJhbmQuYXNQZXJjZW50aWxlKG0pLFxuXHRcdFx0XHRcdFx0XHRcdHllbGxvdzogYnJhbmQuYXNQZXJjZW50aWxlKHkpLFxuXHRcdFx0XHRcdFx0XHRcdGtleTogYnJhbmQuYXNQZXJjZW50aWxlKGspXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXNlICdoZXgnOiB7XG5cdFx0XHRcdFx0XHRjb25zdCBoZXhWYWx1ZSA9IHZhbHVlLnN0YXJ0c1dpdGgoJyMnKVxuXHRcdFx0XHRcdFx0XHQ/IHZhbHVlXG5cdFx0XHRcdFx0XHRcdDogYCMke3ZhbHVlfWA7XG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoaGV4VmFsdWUpXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhc2UgJ2hzbCc6IHtcblx0XHRcdFx0XHRcdGNvbnN0IFtoLCBzLCBsXSA9IHBhcnNlQ29tcG9uZW50cyh2YWx1ZSwgNCk7XG5cblx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChoKSxcblx0XHRcdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUocyksXG5cdFx0XHRcdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUobClcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2FzZSAnaHN2Jzoge1xuXHRcdFx0XHRcdFx0Y29uc3QgW2gsIHMsIHZdID0gcGFyc2VDb21wb25lbnRzKHZhbHVlLCA0KTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKGgpLFxuXHRcdFx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShzKSxcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKHYpXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhc2UgJ2xhYic6IHtcblx0XHRcdFx0XHRcdGNvbnN0IFtsLCBhLCBiXSA9IHBhcnNlQ29tcG9uZW50cyh2YWx1ZSwgNCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHRcdGw6IGJyYW5kLmFzTEFCX0wobCksXG5cdFx0XHRcdFx0XHRcdFx0YTogYnJhbmQuYXNMQUJfQShhKSxcblx0XHRcdFx0XHRcdFx0XHRiOiBicmFuZC5hc0xBQl9CKGIpXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhc2UgJ3JnYic6IHtcblx0XHRcdFx0XHRcdGNvbnN0IGNvbXBvbmVudHMgPSB2YWx1ZS5zcGxpdCgnLCcpLm1hcChOdW1iZXIpO1xuXG5cdFx0XHRcdFx0XHRpZiAoY29tcG9uZW50cy5zb21lKGlzTmFOKSkge1xuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRcdFx0YEludmFsaWQgUkdCIGZvcm1hdCBmb3IgdmFsdWU6ICR7dmFsdWV9YFxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zdCBbciwgZywgYl0gPSBjb21wb25lbnRzO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHRcdHJlZDogYnJhbmQuYXNCeXRlUmFuZ2UociksXG5cdFx0XHRcdFx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKGcpLFxuXHRcdFx0XHRcdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKGIpXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRlZmF1bHQ6IHtcblx0XHRcdFx0XHRcdGNvbnN0IG1lc3NhZ2UgPSBgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yU3BhY2V9YDtcblx0XHRcdFx0XHRcdGxvZy5lcnJvcihcblx0XHRcdFx0XHRcdFx0YEZhaWxlZCB0byBwYXJzZSBjb2xvcjogJHttZXNzYWdlfWAsXG5cdFx0XHRcdFx0XHRcdGB1dGlscy5mb3JtYXQucGFyc2VDb2xvcmBcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQnRXJyb3IgcGFyc2luZyBjb2xvcicsXG5cdFx0XHR7IGNvbnRleHQ6IHsgY29sb3JTcGFjZSwgdmFsdWUgfSwgZmFsbGJhY2s6IG51bGwgfVxuXHRcdCk7XG5cblx0ZnVuY3Rpb24gYWRkSGFzaFRvSGV4KGhleDogSGV4KTogSGV4IHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0cmV0dXJuIGhleC52YWx1ZS5oZXguc3RhcnRzV2l0aCgnIycpXG5cdFx0XHRcdD8gaGV4XG5cdFx0XHRcdDoge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldChgIyR7aGV4LnZhbHVlfX1gKVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2hleCcgYXMgJ2hleCdcblx0XHRcdFx0XHR9O1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBhZGRpbmcgaGFzaCB0byBoZXggY29sb3IuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBjb21wb25lbnRUb0hleChjb21wb25lbnQ6IG51bWJlcik6IHN0cmluZyB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGNvbnN0IGhleCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgY29tcG9uZW50KSkudG9TdHJpbmcoMTYpO1xuXG5cdFx0XHRyZXR1cm4gaGV4Lmxlbmd0aCA9PT0gMSA/ICcwJyArIGhleCA6IGhleDtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgY29udmVydGluZyBjb21wb25lbnQgdG8gaGV4IHBhcnRpYWwuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBjb252ZXJ0U2hvcnRIZXhUb0xvbmcoaGV4OiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRpZiAoaGV4Lmxlbmd0aCAhPT0gNCkgcmV0dXJuIGhleDtcblxuXHRcdFx0cmV0dXJuIGAjJHtoZXhbMV19JHtoZXhbMV19JHtoZXhbMl19JHtoZXhbMl19JHtoZXhbM119JHtoZXhbM119YDtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgY29udmVydGluZyBzaG9ydCBoZXggdG8gbG9uZyBoZXguJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBmb3JtYXRQZXJjZW50YWdlVmFsdWVzPFxuXHRcdFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBudW1iZXIgfCBOdW1lcmljQnJhbmRlZFR5cGU+XG5cdD4oXG5cdFx0dmFsdWU6IFRcblx0KToge1xuXHRcdFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgbnVtYmVyIHwgTnVtZXJpY0JyYW5kZWRUeXBlXG5cdFx0XHQ/IGAke251bWJlcn0lYCB8IFRbS11cblx0XHRcdDogVFtLXTtcblx0fSB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKFxuXHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gT2JqZWN0LmVudHJpZXModmFsdWUpLnJlZHVjZShcblx0XHRcdFx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHRcdFx0XHQoYWNjIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVtrZXldID0gW1xuXHRcdFx0XHRcdFx0XHQnc2F0dXJhdGlvbicsXG5cdFx0XHRcdFx0XHRcdCdsaWdodG5lc3MnLFxuXHRcdFx0XHRcdFx0XHQndmFsdWUnLFxuXHRcdFx0XHRcdFx0XHQnY3lhbicsXG5cdFx0XHRcdFx0XHRcdCdtYWdlbnRhJyxcblx0XHRcdFx0XHRcdFx0J3llbGxvdycsXG5cdFx0XHRcdFx0XHRcdCdrZXknXG5cdFx0XHRcdFx0XHRdLmluY2x1ZGVzKGtleSlcblx0XHRcdFx0XHRcdFx0PyBgJHt2YWwgYXMgbnVtYmVyfSVgXG5cdFx0XHRcdFx0XHRcdDogdmFsO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHt9IGFzIHtcblx0XHRcdFx0XHRcdFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgbnVtYmVyIHwgTnVtZXJpY0JyYW5kZWRUeXBlXG5cdFx0XHRcdFx0XHRcdD8gYCR7bnVtYmVyfSVgIHwgVFtLXVxuXHRcdFx0XHRcdFx0XHQ6IFRbS107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHRcdCdFcnJvciBmb3JtYXR0aW5nIHBlcmNlbnRhZ2UgdmFsdWVzJyxcblx0XHRcdHsgY29udGV4dDogeyB2YWx1ZSB9IH1cblx0XHQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaHNsQWRkRm9ybWF0KHZhbHVlOiBIU0xbJ3ZhbHVlJ10pOiBIU0wge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdCF2YWxpZGF0ZS5jb2xvclZhbHVlKHtcblx0XHRcdFx0XHR2YWx1ZTogdmFsdWUsXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHR9KVxuXHRcdFx0KSB7XG5cdFx0XHRcdGxvZy5lcnJvcihcblx0XHRcdFx0XHRgSW52YWxpZCBIU0wgdmFsdWUgJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9YCxcblx0XHRcdFx0XHRgdXRpbHMuZm9ybWF0LmhzbEFkZEZvcm1hdGBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRyZXR1cm4gZGVmYXVsdENvbG9ycy5oc2w7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB7IHZhbHVlOiB2YWx1ZSwgZm9ybWF0OiAnaHNsJyB9IGFzIEhTTDtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgYWRkaW5nIGZvcm1hdCB0byBIU0wgdmFsdWUuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBwYXJzZUNvbXBvbmVudHModmFsdWU6IHN0cmluZywgY291bnQ6IG51bWJlcik6IG51bWJlcltdIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0Y29uc3QgY29tcG9uZW50cyA9IHZhbHVlXG5cdFx0XHRcdC5zcGxpdCgnLCcpXG5cdFx0XHRcdC5tYXAodmFsID0+XG5cdFx0XHRcdFx0dmFsLnRyaW0oKS5lbmRzV2l0aCgnJScpXG5cdFx0XHRcdFx0XHQ/IHBhcnNlRmxvYXQodmFsKVxuXHRcdFx0XHRcdFx0OiBwYXJzZUZsb2F0KHZhbCkgKiAxMDBcblx0XHRcdFx0KTtcblx0XHRcdGlmIChjb21wb25lbnRzLmxlbmd0aCAhPT0gY291bnQpIHtcblx0XHRcdFx0bG9nLmVycm9yKFxuXHRcdFx0XHRcdGBFeHBlY3RlZCAke2NvdW50fSBjb21wb25lbnRzLmAsXG5cdFx0XHRcdFx0YHV0aWxzLmZvcm1hdC5wYXJzZUNvbXBvbmVudHNgXG5cdFx0XHRcdCk7XG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBjb21wb25lbnRzO1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBwYXJzaW5nIGNvbXBvbmVudHMuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBzdHJpcEhhc2hGcm9tSGV4KGhleDogSGV4KTogSGV4IHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0Y29uc3QgaGV4U3RyaW5nID0gYCR7aGV4LnZhbHVlLmhleH1gO1xuXG5cdFx0XHRyZXR1cm4gaGV4LnZhbHVlLmhleC5zdGFydHNXaXRoKCcjJylcblx0XHRcdFx0PyB7XG5cdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHRoZXg6IGJyYW5kLmFzSGV4U2V0KGhleFN0cmluZy5zbGljZSgxKSlcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnIGFzICdoZXgnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQ6IGhleDtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgc3RyaXBwaW5nIGhhc2ggZnJvbSBoZXggY29sb3IuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBzdHJpcFBlcmNlbnRGcm9tVmFsdWVzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBudW1iZXIgfCBzdHJpbmc+Pihcblx0XHR2YWx1ZTogVFxuXHQpOiB7IFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgYCR7bnVtYmVyfSVgID8gbnVtYmVyIDogVFtLXSB9IHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoXG5cdFx0XHQoKSA9PiB7XG5cdFx0XHRcdHJldHVybiBPYmplY3QuZW50cmllcyh2YWx1ZSkucmVkdWNlKFxuXHRcdFx0XHRcdChhY2MsIFtrZXksIHZhbF0pID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IHBhcnNlZFZhbHVlID1cblx0XHRcdFx0XHRcdFx0dHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgdmFsLmVuZHNXaXRoKCclJylcblx0XHRcdFx0XHRcdFx0XHQ/IHBhcnNlRmxvYXQodmFsLnNsaWNlKDAsIC0xKSlcblx0XHRcdFx0XHRcdFx0XHQ6IHZhbDtcblxuXHRcdFx0XHRcdFx0YWNjW2tleSBhcyBrZXlvZiBUXSA9XG5cdFx0XHRcdFx0XHRcdHBhcnNlZFZhbHVlIGFzIFRba2V5b2YgVF0gZXh0ZW5kcyBgJHtudW1iZXJ9JWBcblx0XHRcdFx0XHRcdFx0XHQ/IG51bWJlclxuXHRcdFx0XHRcdFx0XHRcdDogVFtrZXlvZiBUXTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHt9IGFzIHtcblx0XHRcdFx0XHRcdFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgYCR7bnVtYmVyfSVgXG5cdFx0XHRcdFx0XHRcdD8gbnVtYmVyXG5cdFx0XHRcdFx0XHRcdDogVFtLXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXHRcdFx0J0Vycm9yIG9jY3VycmVkIHdoaWxlIHN0cmlwcGluZyBwZXJjZW50IGZyb20gdmFsdWVzLicsXG5cdFx0XHR7IGNvbnRleHQ6IHZhbHVlIH1cblx0XHQpO1xuXHR9XG5cblx0Y29uc3QgZm9ybWF0dGluZ1V0aWxpdGllczogRm9ybWF0dGluZ1V0aWxpdGllcyA9IHtcblx0XHRhZGRIYXNoVG9IZXgsXG5cdFx0Y29tcG9uZW50VG9IZXgsXG5cdFx0Y29udmVydFNob3J0SGV4VG9Mb25nLFxuXHRcdGZvcm1hdFBlcmNlbnRhZ2VWYWx1ZXMsXG5cdFx0aHNsQWRkRm9ybWF0LFxuXHRcdHBhcnNlQ29sb3IsXG5cdFx0cGFyc2VDb21wb25lbnRzLFxuXHRcdHN0cmlwSGFzaEZyb21IZXgsXG5cdFx0c3RyaXBQZXJjZW50RnJvbVZhbHVlc1xuXHR9O1xuXG5cdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYyhcblx0XHQoKSA9PiBmb3JtYXR0aW5nVXRpbGl0aWVzLFxuXHRcdCdFcnJvciBvY2N1cnJlZCB3aGlsZSBjcmVhdGluZyBmb3JtYXR0aW5nIHV0aWxpdGllcyBncm91cC4nXG5cdCk7XG59XG4iXX0=