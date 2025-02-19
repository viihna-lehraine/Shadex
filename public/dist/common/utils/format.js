// File: common/utils/formatting.js
import { data } from '../../config/index.js';
const defaultColors = data.defaults.colors;
export function createFormattingUtils(services, utils) {
    const parseColor = (colorSpace, value) => {
        const log = services.log;
        try {
            switch (colorSpace) {
                case 'cmyk': {
                    const [c, m, y, k] = parseComponents(value, 5);
                    return {
                        value: {
                            cyan: utils.brand.asPercentile(c),
                            magenta: utils.brand.asPercentile(m),
                            yellow: utils.brand.asPercentile(y),
                            key: utils.brand.asPercentile(k)
                        },
                        format: 'cmyk'
                    };
                }
                case 'hex':
                    const hexValue = value.startsWith('#')
                        ? value
                        : `#${value}`;
                    return {
                        value: {
                            hex: utils.brand.asHexSet(hexValue)
                        },
                        format: 'hex'
                    };
                case 'hsl': {
                    const [h, s, l] = parseComponents(value, 4);
                    return {
                        value: {
                            hue: utils.brand.asRadial(h),
                            saturation: utils.brand.asPercentile(s),
                            lightness: utils.brand.asPercentile(l)
                        },
                        format: 'hsl'
                    };
                }
                case 'hsv': {
                    const [h, s, v] = parseComponents(value, 4);
                    return {
                        value: {
                            hue: utils.brand.asRadial(h),
                            saturation: utils.brand.asPercentile(s),
                            value: utils.brand.asPercentile(v)
                        },
                        format: 'hsv'
                    };
                }
                case 'lab': {
                    const [l, a, b] = parseComponents(value, 4);
                    return {
                        value: {
                            l: utils.brand.asLAB_L(l),
                            a: utils.brand.asLAB_A(a),
                            b: utils.brand.asLAB_B(b)
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
                            red: utils.brand.asByteRange(r),
                            green: utils.brand.asByteRange(g),
                            blue: utils.brand.asByteRange(b)
                        },
                        format: 'rgb'
                    };
                }
                default:
                    const message = `Unsupported color format: ${colorSpace}`;
                    log(`Failed to parse color: ${message}`, `warn`);
                    return null;
            }
        }
        catch (error) {
            log(`parseColor error: ${error}`, `warn`);
            return null;
        }
    };
    function parseComponents(value, count) {
        const log = services.log;
        try {
            const components = value
                .split(',')
                .map(val => val.trim().endsWith('%')
                ? parseFloat(val)
                : parseFloat(val) * 100);
            if (components.length !== count) {
                log(`Expected ${count} components.`, 'error');
                return [];
            }
            return components;
        }
        catch (error) {
            log(`Error parsing components: ${error}`, 'error');
            return [];
        }
    }
    return {
        parseColor,
        parseComponents,
        addHashToHex(hex) {
            try {
                return hex.value.hex.startsWith('#')
                    ? hex
                    : {
                        value: {
                            hex: utils.brand.asHexSet(`#${hex.value}}`)
                        },
                        format: 'hex'
                    };
            }
            catch (error) {
                throw new Error(`addHashToHex error: ${error}`);
            }
        },
        componentToHex(component) {
            const log = services.log;
            try {
                const hex = Math.max(0, Math.min(255, component)).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }
            catch (error) {
                log(`componentToHex error: ${error}`, 'error');
                return '00';
            }
        },
        convertShortHexToLong(hex) {
            if (hex.length !== 4)
                return hex;
            return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        },
        formatPercentageValues(value) {
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
        },
        hslAddFormat(value) {
            const log = services.log;
            try {
                if (!utils.validate.colorValue({ value: value, format: 'hsl' })) {
                    log(`Invalid HSL value ${JSON.stringify(value)}`, 'error');
                    return defaultColors.hsl;
                }
                return { value: value, format: 'hsl' };
            }
            catch (error) {
                log(`Error adding HSL format: ${error}`, 'error');
                return defaultColors.hsl;
            }
        },
        stripHashFromHex(hex) {
            const log = services.log;
            try {
                const hexString = `${hex.value.hex}`;
                return hex.value.hex.startsWith('#')
                    ? {
                        value: {
                            hex: utils.brand.asHexSet(hexString.slice(1))
                        },
                        format: 'hex'
                    }
                    : hex;
            }
            catch (error) {
                log(`stripHashFromHex error: ${error}`, 'error');
                return defaultColors.hex;
            }
        },
        stripPercentFromValues(value) {
            return Object.entries(value).reduce((acc, [key, val]) => {
                const parsedValue = typeof val === 'string' && val.endsWith('%')
                    ? parseFloat(val.slice(0, -1))
                    : val;
                acc[key] =
                    parsedValue;
                return acc;
            }, {});
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi91dGlscy9mb3JtYXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsbUNBQW1DO0FBV25DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUU3QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUUzQyxNQUFNLFVBQVUscUJBQXFCLENBQ3BDLFFBQTJCLEVBQzNCLEtBQXlCO0lBRXpCLE1BQU0sVUFBVSxHQUFHLENBQ2xCLFVBQXNCLEVBQ3RCLEtBQWEsRUFDRSxFQUFFO1FBQ2pCLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFFekIsSUFBSSxDQUFDO1lBQ0osUUFBUSxVQUFVLEVBQUUsQ0FBQztnQkFDcEIsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNiLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUUvQyxPQUFPO3dCQUNOLEtBQUssRUFBRTs0QkFDTixJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOzRCQUNqQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOzRCQUNwQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOzRCQUNuQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO3lCQUNoQzt3QkFDRCxNQUFNLEVBQUUsTUFBTTtxQkFDZCxDQUFDO2dCQUNILENBQUM7Z0JBQ0QsS0FBSyxLQUFLO29CQUNULE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxVQUFVLENB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LENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlCLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBRVIsR0FBRyxDQUFDLEdBQWMsQ0FBQztvQkFDbEIsV0FFYSxDQUFDO2dCQUVmLE9BQU8sR0FBRyxDQUFDO1lBQ1osQ0FBQyxFQUNELEVBRUMsQ0FDRCxDQUFDO1FBQ0gsQ0FBQztLQUNELENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogY29tbW9uL3V0aWxzL2Zvcm1hdHRpbmcuanNcblxuaW1wb3J0IHtcblx0Q29sb3IsXG5cdENvbG9yU3BhY2UsXG5cdEZvcm1hdHRpbmdVdGlsc0ludGVyZmFjZSxcblx0SGV4LFxuXHRIU0wsXG5cdFNlcnZpY2VzSW50ZXJmYWNlLFxuXHRVdGlsaXRpZXNJbnRlcmZhY2Vcbn0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uLy4uL2NvbmZpZy9pbmRleC5qcyc7XG5cbmNvbnN0IGRlZmF1bHRDb2xvcnMgPSBkYXRhLmRlZmF1bHRzLmNvbG9ycztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUZvcm1hdHRpbmdVdGlscyhcblx0c2VydmljZXM6IFNlcnZpY2VzSW50ZXJmYWNlLFxuXHR1dGlsczogVXRpbGl0aWVzSW50ZXJmYWNlXG4pOiBGb3JtYXR0aW5nVXRpbHNJbnRlcmZhY2Uge1xuXHRjb25zdCBwYXJzZUNvbG9yID0gKFxuXHRcdGNvbG9yU3BhY2U6IENvbG9yU3BhY2UsXG5cdFx0dmFsdWU6IHN0cmluZ1xuXHQpOiBDb2xvciB8IG51bGwgPT4ge1xuXHRcdGNvbnN0IGxvZyA9IHNlcnZpY2VzLmxvZztcblxuXHRcdHRyeSB7XG5cdFx0XHRzd2l0Y2ggKGNvbG9yU3BhY2UpIHtcblx0XHRcdFx0Y2FzZSAnY215ayc6IHtcblx0XHRcdFx0XHRjb25zdCBbYywgbSwgeSwga10gPSBwYXJzZUNvbXBvbmVudHModmFsdWUsIDUpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdGN5YW46IHV0aWxzLmJyYW5kLmFzUGVyY2VudGlsZShjKSxcblx0XHRcdFx0XHRcdFx0bWFnZW50YTogdXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKG0pLFxuXHRcdFx0XHRcdFx0XHR5ZWxsb3c6IHV0aWxzLmJyYW5kLmFzUGVyY2VudGlsZSh5KSxcblx0XHRcdFx0XHRcdFx0a2V5OiB1dGlscy5icmFuZC5hc1BlcmNlbnRpbGUoaylcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0XHRjb25zdCBoZXhWYWx1ZSA9IHZhbHVlLnN0YXJ0c1dpdGgoJyMnKVxuXHRcdFx0XHRcdFx0PyB2YWx1ZVxuXHRcdFx0XHRcdFx0OiBgIyR7dmFsdWV9YDtcblxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHRoZXg6IHV0aWxzLmJyYW5kLmFzSGV4U2V0KGhleFZhbHVlKVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRjYXNlICdoc2wnOiB7XG5cdFx0XHRcdFx0Y29uc3QgW2gsIHMsIGxdID0gcGFyc2VDb21wb25lbnRzKHZhbHVlLCA0KTtcblxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHRodWU6IHV0aWxzLmJyYW5kLmFzUmFkaWFsKGgpLFxuXHRcdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiB1dGlscy5icmFuZC5hc1BlcmNlbnRpbGUocyksXG5cdFx0XHRcdFx0XHRcdGxpZ2h0bmVzczogdXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKGwpXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZSAnaHN2Jzoge1xuXHRcdFx0XHRcdGNvbnN0IFtoLCBzLCB2XSA9IHBhcnNlQ29tcG9uZW50cyh2YWx1ZSwgNCk7XG5cblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0aHVlOiB1dGlscy5icmFuZC5hc1JhZGlhbChoKSxcblx0XHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogdXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKHMpLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogdXRpbHMuYnJhbmQuYXNQZXJjZW50aWxlKHYpXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZSAnbGFiJzoge1xuXHRcdFx0XHRcdGNvbnN0IFtsLCBhLCBiXSA9IHBhcnNlQ29tcG9uZW50cyh2YWx1ZSwgNCk7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdGw6IHV0aWxzLmJyYW5kLmFzTEFCX0wobCksXG5cdFx0XHRcdFx0XHRcdGE6IHV0aWxzLmJyYW5kLmFzTEFCX0EoYSksXG5cdFx0XHRcdFx0XHRcdGI6IHV0aWxzLmJyYW5kLmFzTEFCX0IoYilcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXNlICdyZ2InOiB7XG5cdFx0XHRcdFx0Y29uc3QgY29tcG9uZW50cyA9IHZhbHVlLnNwbGl0KCcsJykubWFwKE51bWJlcik7XG5cblx0XHRcdFx0XHRpZiAoY29tcG9uZW50cy5zb21lKGlzTmFOKSlcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBSR0IgZm9ybWF0Jyk7XG5cblx0XHRcdFx0XHRjb25zdCBbciwgZywgYl0gPSBjb21wb25lbnRzO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdHJlZDogdXRpbHMuYnJhbmQuYXNCeXRlUmFuZ2UociksXG5cdFx0XHRcdFx0XHRcdGdyZWVuOiB1dGlscy5icmFuZC5hc0J5dGVSYW5nZShnKSxcblx0XHRcdFx0XHRcdFx0Ymx1ZTogdXRpbHMuYnJhbmQuYXNCeXRlUmFuZ2UoYilcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGNvbnN0IG1lc3NhZ2UgPSBgVW5zdXBwb3J0ZWQgY29sb3IgZm9ybWF0OiAke2NvbG9yU3BhY2V9YDtcblxuXHRcdFx0XHRcdGxvZyhgRmFpbGVkIHRvIHBhcnNlIGNvbG9yOiAke21lc3NhZ2V9YCwgYHdhcm5gKTtcblxuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRsb2coYHBhcnNlQ29sb3IgZXJyb3I6ICR7ZXJyb3J9YCwgYHdhcm5gKTtcblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9O1xuXG5cdGZ1bmN0aW9uIHBhcnNlQ29tcG9uZW50cyh2YWx1ZTogc3RyaW5nLCBjb3VudDogbnVtYmVyKTogbnVtYmVyW10ge1xuXHRcdGNvbnN0IGxvZyA9IHNlcnZpY2VzLmxvZztcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjb21wb25lbnRzID0gdmFsdWVcblx0XHRcdFx0LnNwbGl0KCcsJylcblx0XHRcdFx0Lm1hcCh2YWwgPT5cblx0XHRcdFx0XHR2YWwudHJpbSgpLmVuZHNXaXRoKCclJylcblx0XHRcdFx0XHRcdD8gcGFyc2VGbG9hdCh2YWwpXG5cdFx0XHRcdFx0XHQ6IHBhcnNlRmxvYXQodmFsKSAqIDEwMFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRpZiAoY29tcG9uZW50cy5sZW5ndGggIT09IGNvdW50KSB7XG5cdFx0XHRcdGxvZyhgRXhwZWN0ZWQgJHtjb3VudH0gY29tcG9uZW50cy5gLCAnZXJyb3InKTtcblx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY29tcG9uZW50cztcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0bG9nKGBFcnJvciBwYXJzaW5nIGNvbXBvbmVudHM6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHBhcnNlQ29sb3IsXG5cdFx0cGFyc2VDb21wb25lbnRzLFxuXHRcdGFkZEhhc2hUb0hleChoZXg6IEhleCk6IEhleCB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRyZXR1cm4gaGV4LnZhbHVlLmhleC5zdGFydHNXaXRoKCcjJylcblx0XHRcdFx0XHQ/IGhleFxuXHRcdFx0XHRcdDoge1xuXHRcdFx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0XHRcdGhleDogdXRpbHMuYnJhbmQuYXNIZXhTZXQoYCMke2hleC52YWx1ZX19YClcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaGV4JyBhcyAnaGV4J1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgYWRkSGFzaFRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Y29tcG9uZW50VG9IZXgoY29tcG9uZW50OiBudW1iZXIpOiBzdHJpbmcge1xuXHRcdFx0Y29uc3QgbG9nID0gc2VydmljZXMubG9nO1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRjb25zdCBoZXggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIGNvbXBvbmVudCkpLnRvU3RyaW5nKDE2KTtcblxuXHRcdFx0XHRyZXR1cm4gaGV4Lmxlbmd0aCA9PT0gMSA/ICcwJyArIGhleCA6IGhleDtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGxvZyhgY29tcG9uZW50VG9IZXggZXJyb3I6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0cmV0dXJuICcwMCc7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRjb252ZXJ0U2hvcnRIZXhUb0xvbmcoaGV4OiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdFx0aWYgKGhleC5sZW5ndGggIT09IDQpIHJldHVybiBoZXg7XG5cblx0XHRcdHJldHVybiBgIyR7aGV4WzFdfSR7aGV4WzFdfSR7aGV4WzJdfSR7aGV4WzJdfSR7aGV4WzNdfSR7aGV4WzNdfWA7XG5cdFx0fSxcblx0XHRmb3JtYXRQZXJjZW50YWdlVmFsdWVzPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4odmFsdWU6IFQpOiBUIHtcblx0XHRcdHJldHVybiBPYmplY3QuZW50cmllcyh2YWx1ZSkucmVkdWNlKFxuXHRcdFx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHRcdFx0KGFjYyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilba2V5XSA9IFtcblx0XHRcdFx0XHRcdCdzYXR1cmF0aW9uJyxcblx0XHRcdFx0XHRcdCdsaWdodG5lc3MnLFxuXHRcdFx0XHRcdFx0J3ZhbHVlJyxcblx0XHRcdFx0XHRcdCdjeWFuJyxcblx0XHRcdFx0XHRcdCdtYWdlbnRhJyxcblx0XHRcdFx0XHRcdCd5ZWxsb3cnLFxuXHRcdFx0XHRcdFx0J2tleSdcblx0XHRcdFx0XHRdLmluY2x1ZGVzKGtleSlcblx0XHRcdFx0XHRcdD8gYCR7dmFsfSVgXG5cdFx0XHRcdFx0XHQ6IHZhbDtcblx0XHRcdFx0XHRyZXR1cm4gYWNjO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7fSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuXHRcdFx0KSBhcyBUO1xuXHRcdH0sXG5cdFx0aHNsQWRkRm9ybWF0KHZhbHVlOiBIU0xbJ3ZhbHVlJ10pOiBIU0wge1xuXHRcdFx0Y29uc3QgbG9nID0gc2VydmljZXMubG9nO1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0IXV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWUoeyB2YWx1ZTogdmFsdWUsIGZvcm1hdDogJ2hzbCcgfSlcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0bG9nKGBJbnZhbGlkIEhTTCB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX1gLCAnZXJyb3InKTtcblxuXHRcdFx0XHRcdHJldHVybiBkZWZhdWx0Q29sb3JzLmhzbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB7IHZhbHVlOiB2YWx1ZSwgZm9ybWF0OiAnaHNsJyB9IGFzIEhTTDtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGxvZyhgRXJyb3IgYWRkaW5nIEhTTCBmb3JtYXQ6ICR7ZXJyb3J9YCwgJ2Vycm9yJyk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRDb2xvcnMuaHNsO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0c3RyaXBIYXNoRnJvbUhleChoZXg6IEhleCk6IEhleCB7XG5cdFx0XHRjb25zdCBsb2cgPSBzZXJ2aWNlcy5sb2c7XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IGhleFN0cmluZyA9IGAke2hleC52YWx1ZS5oZXh9YDtcblxuXHRcdFx0XHRyZXR1cm4gaGV4LnZhbHVlLmhleC5zdGFydHNXaXRoKCcjJylcblx0XHRcdFx0XHQ/IHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0XHRoZXg6IHV0aWxzLmJyYW5kLmFzSGV4U2V0KGhleFN0cmluZy5zbGljZSgxKSlcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiAnaGV4JyBhcyAnaGV4J1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdDogaGV4O1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0bG9nKGBzdHJpcEhhc2hGcm9tSGV4IGVycm9yOiAke2Vycm9yfWAsICdlcnJvcicpO1xuXG5cdFx0XHRcdHJldHVybiBkZWZhdWx0Q29sb3JzLmhleDtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHN0cmlwUGVyY2VudEZyb21WYWx1ZXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIG51bWJlciB8IHN0cmluZz4+KFxuXHRcdFx0dmFsdWU6IFRcblx0XHQpOiB7IFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgYCR7bnVtYmVyfSVgID8gbnVtYmVyIDogVFtLXSB9IHtcblx0XHRcdHJldHVybiBPYmplY3QuZW50cmllcyh2YWx1ZSkucmVkdWNlKFxuXHRcdFx0XHQoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgcGFyc2VkVmFsdWUgPVxuXHRcdFx0XHRcdFx0dHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgdmFsLmVuZHNXaXRoKCclJylcblx0XHRcdFx0XHRcdFx0PyBwYXJzZUZsb2F0KHZhbC5zbGljZSgwLCAtMSkpXG5cdFx0XHRcdFx0XHRcdDogdmFsO1xuXG5cdFx0XHRcdFx0YWNjW2tleSBhcyBrZXlvZiBUXSA9XG5cdFx0XHRcdFx0XHRwYXJzZWRWYWx1ZSBhcyBUW2tleW9mIFRdIGV4dGVuZHMgYCR7bnVtYmVyfSVgXG5cdFx0XHRcdFx0XHRcdD8gbnVtYmVyXG5cdFx0XHRcdFx0XHRcdDogVFtrZXlvZiBUXTtcblxuXHRcdFx0XHRcdHJldHVybiBhY2M7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHt9IGFzIHtcblx0XHRcdFx0XHRbSyBpbiBrZXlvZiBUXTogVFtLXSBleHRlbmRzIGAke251bWJlcn0lYCA/IG51bWJlciA6IFRbS107XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXHR9O1xufVxuIl19