// File: common/utils/validate.js
import { data } from '../../config/index.js';
const regex = data.config.regex;
const sets = data.sets;
export function createValidationUtils(utils) {
    function hex(value, pattern) {
        return pattern.test(value);
    }
    function hexSet(value) {
        return regex.validation.hex.test(value);
    }
    return {
        hex,
        hexSet,
        colorValue(color) {
            const clonedColor = utils.core.clone(color);
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
                    return regex.validation.hex.test(clonedColor.value.hex);
                case 'hsl':
                    const isValidHSLHue = isNumericValid(clonedColor.value.hue) &&
                        clonedColor.value.hue >= 0 &&
                        clonedColor.value.hue <= 360;
                    const isValidHSLSaturation = normalizePercentage(clonedColor.value.saturation) >=
                        0 &&
                        normalizePercentage(clonedColor.value.saturation) <=
                            100;
                    const isValidHSLLightness = clonedColor.value.lightness
                        ? normalizePercentage(clonedColor.value.lightness) >=
                            0 &&
                            normalizePercentage(clonedColor.value.lightness) <=
                                100
                        : true;
                    return (isValidHSLHue &&
                        isValidHSLSaturation &&
                        isValidHSLLightness);
                case 'hsv':
                    const isValidHSVHue = isNumericValid(clonedColor.value.hue) &&
                        clonedColor.value.hue >= 0 &&
                        clonedColor.value.hue <= 360;
                    const isValidHSVSaturation = normalizePercentage(clonedColor.value.saturation) >=
                        0 &&
                        normalizePercentage(clonedColor.value.saturation) <=
                            100;
                    const isValidHSVValue = clonedColor.value.value
                        ? normalizePercentage(clonedColor.value.value) >= 0 &&
                            normalizePercentage(clonedColor.value.value) <= 100
                        : true;
                    return (isValidHSVHue && isValidHSVSaturation && isValidHSVValue);
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
                    return ([
                        clonedColor.value.saturation,
                        clonedColor.value.value
                    ].every(isNumericValid) &&
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
        },
        ensureHash(value) {
            return value.startsWith('#') ? value : `#${value}`;
        },
        hexComponent(value) {
            return hex(value, regex.validation.hexComponent);
        },
        range(value, rangeKey) {
            if (rangeKey === 'HexSet') {
                if (!hexSet(value)) {
                    throw new Error(`Invalid value for ${String(rangeKey)}: ${value}`);
                }
                return;
            }
            if (typeof value === 'number' && Array.isArray(sets[rangeKey])) {
                const [min, max] = sets[rangeKey];
                if (value < min || value > max) {
                    throw new Error(`Value ${value} is out of range for ${String(rangeKey)} [${min}, ${max}]`);
                }
                return;
            }
            throw new Error(`Invalid range or value for ${String(rangeKey)}`);
        },
        userColorInput(color) {
            return (regex.userInput.hex.test(color) ||
                regex.userInput.hsl.test(color) ||
                regex.userInput.rgb.test(color));
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL3V0aWxzL3ZhbGlkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGlDQUFpQztBQVVqQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFN0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDaEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUV2QixNQUFNLFVBQVUscUJBQXFCLENBQ3BDLEtBQXlCO0lBRXpCLFNBQVMsR0FBRyxDQUFDLEtBQWEsRUFBRSxPQUFlO1FBQzFDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsU0FBUyxNQUFNLENBQUMsS0FBYTtRQUM1QixPQUFPLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsT0FBTztRQUNOLEdBQUc7UUFDSCxNQUFNO1FBQ04sVUFBVSxDQUFDLEtBQXNCO1lBQ2hDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTVDLE1BQU0sY0FBYyxHQUFHLENBQUMsS0FBYyxFQUFXLEVBQUUsQ0FDbEQsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVDLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxLQUFzQixFQUFVLEVBQUU7Z0JBQzlELElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztvQkFDdEQsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FB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R0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQXFCLENBQUM7Z0JBRXRELElBQUksS0FBSyxHQUFHLEdBQUcsSUFBSSxLQUFLLEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQ2QsU0FBUyxLQUFLLHdCQUF3QixNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUN6RSxDQUFDO2dCQUNILENBQUM7Z0JBQ0QsT0FBTztZQUNSLENBQUM7WUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ25FLENBQUM7UUFDRCxjQUFjLENBQUMsS0FBYTtZQUMzQixPQUFPLENBQ04sS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDL0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDL0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUMvQixDQUFDO1FBQ0gsQ0FBQztLQUNELENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogY29tbW9uL3V0aWxzL3ZhbGlkYXRlLmpzXG5cbmltcG9ydCB7XG5cdENvbG9yLFxuXHRTZXRzRGF0YSxcblx0U0wsXG5cdFNWLFxuXHRVdGlsaXRpZXNJbnRlcmZhY2UsXG5cdFZhbGlkYXRpb25VdGlsc0ludGVyZmFjZVxufSBmcm9tICcuLi8uLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vLi4vY29uZmlnL2luZGV4LmpzJztcblxuY29uc3QgcmVnZXggPSBkYXRhLmNvbmZpZy5yZWdleDtcbmNvbnN0IHNldHMgPSBkYXRhLnNldHM7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWYWxpZGF0aW9uVXRpbHMoXG5cdHV0aWxzOiBVdGlsaXRpZXNJbnRlcmZhY2Vcbik6IFZhbGlkYXRpb25VdGlsc0ludGVyZmFjZSB7XG5cdGZ1bmN0aW9uIGhleCh2YWx1ZTogc3RyaW5nLCBwYXR0ZXJuOiBSZWdFeHApOiBib29sZWFuIHtcblx0XHRyZXR1cm4gcGF0dGVybi50ZXN0KHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhleFNldCh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHJlZ2V4LnZhbGlkYXRpb24uaGV4LnRlc3QodmFsdWUpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRoZXgsXG5cdFx0aGV4U2V0LFxuXHRcdGNvbG9yVmFsdWUoY29sb3I6IENvbG9yIHwgU0wgfCBTVik6IGJvb2xlYW4ge1xuXHRcdFx0Y29uc3QgY2xvbmVkQ29sb3IgPSB1dGlscy5jb3JlLmNsb25lKGNvbG9yKTtcblxuXHRcdFx0Y29uc3QgaXNOdW1lcmljVmFsaWQgPSAodmFsdWU6IHVua25vd24pOiBib29sZWFuID0+XG5cdFx0XHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKTtcblx0XHRcdGNvbnN0IG5vcm1hbGl6ZVBlcmNlbnRhZ2UgPSAodmFsdWU6IHN0cmluZyB8IG51bWJlcik6IG51bWJlciA9PiB7XG5cdFx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLmVuZHNXaXRoKCclJykpIHtcblx0XHRcdFx0XHRyZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZS5zbGljZSgwLCAtMSkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgPyB2YWx1ZSA6IE5hTjtcblx0XHRcdH07XG5cblx0XHRcdHN3aXRjaCAoY2xvbmVkQ29sb3IuZm9ybWF0KSB7XG5cdFx0XHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmN5YW4sXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLm1hZ2VudGEsXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnllbGxvdyxcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUua2V5XG5cdFx0XHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuY3lhbiA+PSAwICYmXG5cdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5jeWFuIDw9IDEwMCAmJlxuXHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubWFnZW50YSA+PSAwICYmXG5cdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5tYWdlbnRhIDw9IDEwMCAmJlxuXHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueWVsbG93ID49IDAgJiZcblx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnllbGxvdyA8PSAxMDAgJiZcblx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmtleSA+PSAwICYmXG5cdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5rZXkgPD0gMTAwXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0XHRyZXR1cm4gcmVnZXgudmFsaWRhdGlvbi5oZXgudGVzdChjbG9uZWRDb2xvci52YWx1ZS5oZXgpO1xuXHRcdFx0XHRjYXNlICdoc2wnOlxuXHRcdFx0XHRcdGNvbnN0IGlzVmFsaWRIU0xIdWUgPVxuXHRcdFx0XHRcdFx0aXNOdW1lcmljVmFsaWQoY2xvbmVkQ29sb3IudmFsdWUuaHVlKSAmJlxuXHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlID49IDAgJiZcblx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmh1ZSA8PSAzNjA7XG5cdFx0XHRcdFx0Y29uc3QgaXNWYWxpZEhTTFNhdHVyYXRpb24gPVxuXHRcdFx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uKSA+PVxuXHRcdFx0XHRcdFx0XHQwICYmXG5cdFx0XHRcdFx0XHRub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24pIDw9XG5cdFx0XHRcdFx0XHRcdDEwMDtcblx0XHRcdFx0XHRjb25zdCBpc1ZhbGlkSFNMTGlnaHRuZXNzID0gY2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzXG5cdFx0XHRcdFx0XHQ/IG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzKSA+PVxuXHRcdFx0XHRcdFx0XHRcdDAgJiZcblx0XHRcdFx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3MpIDw9XG5cdFx0XHRcdFx0XHRcdFx0MTAwXG5cdFx0XHRcdFx0XHQ6IHRydWU7XG5cblx0XHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0aXNWYWxpZEhTTEh1ZSAmJlxuXHRcdFx0XHRcdFx0aXNWYWxpZEhTTFNhdHVyYXRpb24gJiZcblx0XHRcdFx0XHRcdGlzVmFsaWRIU0xMaWdodG5lc3Ncblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRcdGNvbnN0IGlzVmFsaWRIU1ZIdWUgPVxuXHRcdFx0XHRcdFx0aXNOdW1lcmljVmFsaWQoY2xvbmVkQ29sb3IudmFsdWUuaHVlKSAmJlxuXHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlID49IDAgJiZcblx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmh1ZSA8PSAzNjA7XG5cdFx0XHRcdFx0Y29uc3QgaXNWYWxpZEhTVlNhdHVyYXRpb24gPVxuXHRcdFx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uKSA+PVxuXHRcdFx0XHRcdFx0XHQwICYmXG5cdFx0XHRcdFx0XHRub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24pIDw9XG5cdFx0XHRcdFx0XHRcdDEwMDtcblx0XHRcdFx0XHRjb25zdCBpc1ZhbGlkSFNWVmFsdWUgPSBjbG9uZWRDb2xvci52YWx1ZS52YWx1ZVxuXHRcdFx0XHRcdFx0PyBub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLnZhbHVlKSA+PSAwICYmXG5cdFx0XHRcdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUudmFsdWUpIDw9IDEwMFxuXHRcdFx0XHRcdFx0OiB0cnVlO1xuXG5cdFx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRcdGlzVmFsaWRIU1ZIdWUgJiYgaXNWYWxpZEhTVlNhdHVyYXRpb24gJiYgaXNWYWxpZEhTVlZhbHVlXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0W1xuXHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5sLFxuXHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5hLFxuXHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5iXG5cdFx0XHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubCA+PSAwICYmXG5cdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5sIDw9IDEwMCAmJlxuXHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYSA+PSAtMTI1ICYmXG5cdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5hIDw9IDEyNSAmJlxuXHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYiA+PSAtMTI1ICYmXG5cdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5iIDw9IDEyNVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUucmVkLFxuXHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ncmVlbixcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYmx1ZVxuXHRcdFx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnJlZCA+PSAwICYmXG5cdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5yZWQgPD0gMjU1ICYmXG5cdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ncmVlbiA+PSAwICYmXG5cdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ncmVlbiA8PSAyNTUgJiZcblx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmJsdWUgPj0gMCAmJlxuXHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYmx1ZSA8PSAyNTVcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRjYXNlICdzbCc6XG5cdFx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbixcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzXG5cdFx0XHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbiA+PSAwICYmXG5cdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uIDw9IDEwMCAmJlxuXHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzID49IDAgJiZcblx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmxpZ2h0bmVzcyA8PSAxMDBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRjYXNlICdzdic6XG5cdFx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbixcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUudmFsdWVcblx0XHRcdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uID49IDAgJiZcblx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnNhdHVyYXRpb24gPD0gMTAwICYmXG5cdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSA+PSAwICYmXG5cdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSA8PSAxMDBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRjYXNlICd4eXonOlxuXHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLngsXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnksXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnpcblx0XHRcdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS54ID49IDAgJiZcblx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnggPD0gOTUuMDQ3ICYmXG5cdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55ID49IDAgJiZcblx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnkgPD0gMTAwLjAgJiZcblx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnogPj0gMCAmJlxuXHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueiA8PSAxMDguODgzXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBVbnN1cHBvcnRlZCBjb2xvciBmb3JtYXQ6ICR7Y29sb3IuZm9ybWF0fWApO1xuXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZW5zdXJlSGFzaCh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcblx0XHRcdHJldHVybiB2YWx1ZS5zdGFydHNXaXRoKCcjJykgPyB2YWx1ZSA6IGAjJHt2YWx1ZX1gO1xuXHRcdH0sXG5cdFx0aGV4Q29tcG9uZW50KHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiBoZXgodmFsdWUsIHJlZ2V4LnZhbGlkYXRpb24uaGV4Q29tcG9uZW50KTtcblx0XHR9LFxuXHRcdHJhbmdlPFQgZXh0ZW5kcyBrZXlvZiBTZXRzRGF0YT4oXG5cdFx0XHR2YWx1ZTogbnVtYmVyIHwgc3RyaW5nLFxuXHRcdFx0cmFuZ2VLZXk6IFRcblx0XHQpOiB2b2lkIHtcblx0XHRcdGlmIChyYW5nZUtleSA9PT0gJ0hleFNldCcpIHtcblx0XHRcdFx0aWYgKCFoZXhTZXQodmFsdWUgYXMgc3RyaW5nKSkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XHRcdGBJbnZhbGlkIHZhbHVlIGZvciAke1N0cmluZyhyYW5nZUtleSl9OiAke3ZhbHVlfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgQXJyYXkuaXNBcnJheShzZXRzW3JhbmdlS2V5XSkpIHtcblx0XHRcdFx0Y29uc3QgW21pbiwgbWF4XSA9IHNldHNbcmFuZ2VLZXldIGFzIFtudW1iZXIsIG51bWJlcl07XG5cblx0XHRcdFx0aWYgKHZhbHVlIDwgbWluIHx8IHZhbHVlID4gbWF4KSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRcdFx0YFZhbHVlICR7dmFsdWV9IGlzIG91dCBvZiByYW5nZSBmb3IgJHtTdHJpbmcocmFuZ2VLZXkpfSBbJHttaW59LCAke21heH1dYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcmFuZ2Ugb3IgdmFsdWUgZm9yICR7U3RyaW5nKHJhbmdlS2V5KX1gKTtcblx0XHR9LFxuXHRcdHVzZXJDb2xvcklucHV0KGNvbG9yOiBzdHJpbmcpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdHJlZ2V4LnVzZXJJbnB1dC5oZXgudGVzdChjb2xvcikgfHxcblx0XHRcdFx0cmVnZXgudXNlcklucHV0LmhzbC50ZXN0KGNvbG9yKSB8fFxuXHRcdFx0XHRyZWdleC51c2VySW5wdXQucmdiLnRlc3QoY29sb3IpXG5cdFx0XHQpO1xuXHRcdH1cblx0fTtcbn1cbiJdfQ==