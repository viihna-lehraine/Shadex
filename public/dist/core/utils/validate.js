// File: core/utils/validate.ts
import { regex, sets } from '../../config/index.js';
export function validationUtilitiesFactory(helpers, services) {
    const { data: { clone } } = helpers;
    const { errors } = services;
    function colorValue(color) {
        return errors.handleSync(() => {
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
                        ? normalizePercentage(clonedColor.value.lightness) >= 0 &&
                            normalizePercentage(clonedColor.value.lightness) <= 100
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
                        ? normalizePercentage(clonedColor.value.value) >=
                            0 &&
                            normalizePercentage(clonedColor.value.value) <=
                                100
                        : true;
                    return (isValidHSVHue &&
                        isValidHSVSaturation &&
                        isValidHSVValue);
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
        }, `Error occurred while validating color value: ${JSON.stringify(color)}`);
    }
    function ensureHash(value) {
        return errors.handleSync(() => {
            return value.startsWith('#') ? value : `#${value}`;
        }, `Error occurred while ensuring hash for value: ${value}`);
    }
    function hex(value, pattern) {
        return errors.handleSync(() => {
            return pattern.test(value);
        }, `Error occurred while validating hex value: ${value}`);
    }
    function hexComponent(value) {
        return errors.handleSync(() => {
            return hex(value, regex.validation.hexComponent);
        }, `Error occurred while validating hex component: ${value}`);
    }
    function hexSet(value) {
        return errors.handleSync(() => {
            return regex.validation.hex.test(value);
        }, `Error occurred while validating hex set: ${value}`);
    }
    function range(value, rangeKey) {
        return errors.handleSync(() => {
            if (rangeKey === 'HexSet') {
                if (!hexSet(value)) {
                    throw new Error(`Invalid value for ${String(rangeKey)}: ${value}`);
                }
                return;
            }
            if (typeof value === 'number' &&
                Array.isArray(sets[rangeKey])) {
                const [min, max] = sets[rangeKey];
                if (value < min || value > max) {
                    throw new Error(`Value ${value} is out of range for ${String(rangeKey)} [${min}, ${max}]`);
                }
                return;
            }
            throw new Error(`Invalid range or value for ${String(rangeKey)}`);
        }, `Error occurred while validating range for ${String(rangeKey)}: ${value}`);
    }
    function userColorInput(color) {
        return errors.handleSync(() => {
            return (regex.userInput.hex.test(color) ||
                regex.userInput.hsl.test(color) ||
                regex.userInput.rgb.test(color));
        }, `Error occurred while validating user color input: ${color}`);
    }
    const validationUtilities = {
        colorValue,
        ensureHash,
        hex,
        hexComponent,
        hexSet,
        range,
        userColorInput
    };
    return errors.handleSync(() => validationUtilities, 'Error occurred while creating validation utilities group.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29yZS91dGlscy92YWxpZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFXL0IsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUVwRCxNQUFNLFVBQVUsMEJBQTBCLENBQ3pDLE9BQWdCLEVBQ2hCLFFBQWtCO0lBRWxCLE1BQU0sRUFDTCxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFDZixHQUFHLE9BQU8sQ0FBQztJQUNaLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUM7SUFFNUIsU0FBUyxVQUFVLENBQUMsS0FBc0I7UUFDekMsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUN2QixHQUFHLEVBQUU7WUFDSixNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFakMsTUFBTSxjQUFjLEdBQUcsQ0FBQyxLQUFjLEVBQVcsRUFBRSxDQUNsRCxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUMsTUFBTSxtQkFBbUIsR0FBRyxDQUMzQixLQUFzQixFQUNiLEVBQUU7Z0JBQ1gsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO29CQUN0RCxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLENBQUM7Z0JBRUQsT0FBTyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ2hELENBQUMsQ0FBQztZQUVGLFFBQVEsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUM1QixL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YTtRQUNwQyxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQzdCLE9BQU8sQ0FDTixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUMvQixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUMvQixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQy9CLENBQUM7UUFDSCxDQUFDLEVBQUUscURBQXFELEtBQUssRUFBRSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELE1BQU0sbUJBQW1CLEdBQXdCO1FBQ2hELFVBQVU7UUFDVixVQUFVO1FBQ1YsR0FBRztRQUNILFlBQVk7UUFDWixNQUFNO1FBQ04sS0FBSztRQUNMLGNBQWM7S0FDZCxDQUFDO0lBRUYsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUN2QixHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsRUFDekIsMkRBQTJELENBQzNELENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogY29yZS91dGlscy92YWxpZGF0ZS50c1xuXG5pbXBvcnQge1xuXHRDb2xvcixcblx0SGVscGVycyxcblx0U2V0c0RhdGEsXG5cdFNlcnZpY2VzLFxuXHRTTCxcblx0U1YsXG5cdFZhbGlkYXRpb25VdGlsaXRpZXNcbn0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgcmVnZXgsIHNldHMgfSBmcm9tICcuLi8uLi9jb25maWcvaW5kZXguanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGlvblV0aWxpdGllc0ZhY3RvcnkoXG5cdGhlbHBlcnM6IEhlbHBlcnMsXG5cdHNlcnZpY2VzOiBTZXJ2aWNlc1xuKTogVmFsaWRhdGlvblV0aWxpdGllcyB7XG5cdGNvbnN0IHtcblx0XHRkYXRhOiB7IGNsb25lIH1cblx0fSA9IGhlbHBlcnM7XG5cdGNvbnN0IHsgZXJyb3JzIH0gPSBzZXJ2aWNlcztcblxuXHRmdW5jdGlvbiBjb2xvclZhbHVlKGNvbG9yOiBDb2xvciB8IFNMIHwgU1YpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoXG5cdFx0XHQoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGNsb25lZENvbG9yID0gY2xvbmUoY29sb3IpO1xuXG5cdFx0XHRcdGNvbnN0IGlzTnVtZXJpY1ZhbGlkID0gKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiA9PlxuXHRcdFx0XHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKTtcblx0XHRcdFx0Y29uc3Qgbm9ybWFsaXplUGVyY2VudGFnZSA9IChcblx0XHRcdFx0XHR2YWx1ZTogc3RyaW5nIHwgbnVtYmVyXG5cdFx0XHRcdCk6IG51bWJlciA9PiB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuZW5kc1dpdGgoJyUnKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHBhcnNlRmxvYXQodmFsdWUuc2xpY2UoMCwgLTEpKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IHZhbHVlIDogTmFOO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHN3aXRjaCAoY2xvbmVkQ29sb3IuZm9ybWF0KSB7XG5cdFx0XHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuY3lhbixcblx0XHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5tYWdlbnRhLFxuXHRcdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnllbGxvdyxcblx0XHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5rZXlcblx0XHRcdFx0XHRcdFx0XS5ldmVyeShpc051bWVyaWNWYWxpZCkgJiZcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuY3lhbiA+PSAwICYmXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmN5YW4gPD0gMTAwICYmXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLm1hZ2VudGEgPj0gMCAmJlxuXHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5tYWdlbnRhIDw9IDEwMCAmJlxuXHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55ZWxsb3cgPj0gMCAmJlxuXHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS55ZWxsb3cgPD0gMTAwICYmXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmtleSA+PSAwICYmXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmtleSA8PSAxMDBcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdFx0XHRcdHJldHVybiByZWdleC52YWxpZGF0aW9uLmhleC50ZXN0KGNsb25lZENvbG9yLnZhbHVlLmhleCk7XG5cdFx0XHRcdFx0Y2FzZSAnaHNsJzpcblx0XHRcdFx0XHRcdGNvbnN0IGlzVmFsaWRIU0xIdWUgPVxuXHRcdFx0XHRcdFx0XHRpc051bWVyaWNWYWxpZChjbG9uZWRDb2xvci52YWx1ZS5odWUpICYmXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmh1ZSA+PSAwICYmXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmh1ZSA8PSAzNjA7XG5cdFx0XHRcdFx0XHRjb25zdCBpc1ZhbGlkSFNMU2F0dXJhdGlvbiA9XG5cdFx0XHRcdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbikgPj1cblx0XHRcdFx0XHRcdFx0XHQwICYmXG5cdFx0XHRcdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoY2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbikgPD1cblx0XHRcdFx0XHRcdFx0XHQxMDA7XG5cdFx0XHRcdFx0XHRjb25zdCBpc1ZhbGlkSFNMTGlnaHRuZXNzID0gY2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzXG5cdFx0XHRcdFx0XHRcdD8gbm9ybWFsaXplUGVyY2VudGFnZShcblx0XHRcdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmxpZ2h0bmVzc1xuXHRcdFx0XHRcdFx0XHRcdCkgPj0gMCAmJlxuXHRcdFx0XHRcdFx0XHRcdG5vcm1hbGl6ZVBlcmNlbnRhZ2UoXG5cdFx0XHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5saWdodG5lc3Ncblx0XHRcdFx0XHRcdFx0XHQpIDw9IDEwMFxuXHRcdFx0XHRcdFx0XHQ6IHRydWU7XG5cblx0XHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRcdGlzVmFsaWRIU0xIdWUgJiZcblx0XHRcdFx0XHRcdFx0aXNWYWxpZEhTTFNhdHVyYXRpb24gJiZcblx0XHRcdFx0XHRcdFx0aXNWYWxpZEhTTExpZ2h0bmVzc1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRcdFx0Y29uc3QgaXNWYWxpZEhTVkh1ZSA9XG5cdFx0XHRcdFx0XHRcdGlzTnVtZXJpY1ZhbGlkKGNsb25lZENvbG9yLnZhbHVlLmh1ZSkgJiZcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlID49IDAgJiZcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuaHVlIDw9IDM2MDtcblx0XHRcdFx0XHRcdGNvbnN0IGlzVmFsaWRIU1ZTYXR1cmF0aW9uID1cblx0XHRcdFx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uKSA+PVxuXHRcdFx0XHRcdFx0XHRcdDAgJiZcblx0XHRcdFx0XHRcdFx0bm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uKSA8PVxuXHRcdFx0XHRcdFx0XHRcdDEwMDtcblx0XHRcdFx0XHRcdGNvbnN0IGlzVmFsaWRIU1ZWYWx1ZSA9IGNsb25lZENvbG9yLnZhbHVlLnZhbHVlXG5cdFx0XHRcdFx0XHRcdD8gbm9ybWFsaXplUGVyY2VudGFnZShjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSkgPj1cblx0XHRcdFx0XHRcdFx0XHRcdDAgJiZcblx0XHRcdFx0XHRcdFx0XHRub3JtYWxpemVQZXJjZW50YWdlKGNsb25lZENvbG9yLnZhbHVlLnZhbHVlKSA8PVxuXHRcdFx0XHRcdFx0XHRcdFx0MTAwXG5cdFx0XHRcdFx0XHRcdDogdHJ1ZTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRcdFx0aXNWYWxpZEhTVkh1ZSAmJlxuXHRcdFx0XHRcdFx0XHRpc1ZhbGlkSFNWU2F0dXJhdGlvbiAmJlxuXHRcdFx0XHRcdFx0XHRpc1ZhbGlkSFNWVmFsdWVcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0Y2FzZSAnbGFiJzpcblx0XHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5sLFxuXHRcdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmEsXG5cdFx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYlxuXHRcdFx0XHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5sID49IDAgJiZcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubCA8PSAxMDAgJiZcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYSA+PSAtMTI1ICYmXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmEgPD0gMTI1ICYmXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmIgPj0gLTEyNSAmJlxuXHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5iIDw9IDEyNVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRjYXNlICdyZ2InOlxuXHRcdFx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRcdFx0W1xuXHRcdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnJlZCxcblx0XHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ncmVlbixcblx0XHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ibHVlXG5cdFx0XHRcdFx0XHRcdF0uZXZlcnkoaXNOdW1lcmljVmFsaWQpICYmXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnJlZCA+PSAwICYmXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnJlZCA8PSAyNTUgJiZcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuZ3JlZW4gPj0gMCAmJlxuXHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5ncmVlbiA8PSAyNTUgJiZcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuYmx1ZSA+PSAwICYmXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmJsdWUgPD0gMjU1XG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGNhc2UgJ3NsJzpcblx0XHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLmxpZ2h0bmVzc1xuXHRcdFx0XHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uID49IDAgJiZcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbiA8PSAxMDAgJiZcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzID49IDAgJiZcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUubGlnaHRuZXNzIDw9IDEwMFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRjYXNlICdzdic6XG5cdFx0XHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbixcblx0XHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS52YWx1ZVxuXHRcdFx0XHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS5zYXR1cmF0aW9uID49IDAgJiZcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuc2F0dXJhdGlvbiA8PSAxMDAgJiZcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUudmFsdWUgPj0gMCAmJlxuXHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS52YWx1ZSA8PSAxMDBcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0Y2FzZSAneHl6Jzpcblx0XHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS54LFxuXHRcdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnksXG5cdFx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUuelxuXHRcdFx0XHRcdFx0XHRdLmV2ZXJ5KGlzTnVtZXJpY1ZhbGlkKSAmJlxuXHRcdFx0XHRcdFx0XHRjbG9uZWRDb2xvci52YWx1ZS54ID49IDAgJiZcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueCA8PSA5NS4wNDcgJiZcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueSA+PSAwICYmXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnkgPD0gMTAwLjAgJiZcblx0XHRcdFx0XHRcdFx0Y2xvbmVkQ29sb3IudmFsdWUueiA+PSAwICYmXG5cdFx0XHRcdFx0XHRcdGNsb25lZENvbG9yLnZhbHVlLnogPD0gMTA4Ljg4M1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0XHRcdFx0YFVuc3VwcG9ydGVkIGNvbG9yIGZvcm1hdDogJHtjb2xvci5mb3JtYXR9YFxuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0YEVycm9yIG9jY3VycmVkIHdoaWxlIHZhbGlkYXRpbmcgY29sb3IgdmFsdWU6ICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWBcblx0XHQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZW5zdXJlSGFzaCh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHZhbHVlLnN0YXJ0c1dpdGgoJyMnKSA/IHZhbHVlIDogYCMke3ZhbHVlfWA7XG5cdFx0fSwgYEVycm9yIG9jY3VycmVkIHdoaWxlIGVuc3VyaW5nIGhhc2ggZm9yIHZhbHVlOiAke3ZhbHVlfWApO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGV4KHZhbHVlOiBzdHJpbmcsIHBhdHRlcm46IFJlZ0V4cCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRyZXR1cm4gcGF0dGVybi50ZXN0KHZhbHVlKTtcblx0XHR9LCBgRXJyb3Igb2NjdXJyZWQgd2hpbGUgdmFsaWRhdGluZyBoZXggdmFsdWU6ICR7dmFsdWV9YCk7XG5cdH1cblxuXHRmdW5jdGlvbiBoZXhDb21wb25lbnQodmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRyZXR1cm4gaGV4KHZhbHVlLCByZWdleC52YWxpZGF0aW9uLmhleENvbXBvbmVudCk7XG5cdFx0fSwgYEVycm9yIG9jY3VycmVkIHdoaWxlIHZhbGlkYXRpbmcgaGV4IGNvbXBvbmVudDogJHt2YWx1ZX1gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhleFNldCh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdHJldHVybiByZWdleC52YWxpZGF0aW9uLmhleC50ZXN0KHZhbHVlKTtcblx0XHR9LCBgRXJyb3Igb2NjdXJyZWQgd2hpbGUgdmFsaWRhdGluZyBoZXggc2V0OiAke3ZhbHVlfWApO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmFuZ2U8VCBleHRlbmRzIGtleW9mIFNldHNEYXRhPihcblx0XHR2YWx1ZTogbnVtYmVyIHwgc3RyaW5nLFxuXHRcdHJhbmdlS2V5OiBUXG5cdCk6IHZvaWQge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYyhcblx0XHRcdCgpID0+IHtcblx0XHRcdFx0aWYgKHJhbmdlS2V5ID09PSAnSGV4U2V0Jykge1xuXHRcdFx0XHRcdGlmICghaGV4U2V0KHZhbHVlIGFzIHN0cmluZykpIHtcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XHRcdFx0YEludmFsaWQgdmFsdWUgZm9yICR7U3RyaW5nKHJhbmdlS2V5KX06ICR7dmFsdWV9YFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiZcblx0XHRcdFx0XHRBcnJheS5pc0FycmF5KHNldHNbcmFuZ2VLZXldKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRjb25zdCBbbWluLCBtYXhdID0gc2V0c1tyYW5nZUtleV0gYXMgW251bWJlciwgbnVtYmVyXTtcblxuXHRcdFx0XHRcdGlmICh2YWx1ZSA8IG1pbiB8fCB2YWx1ZSA+IG1heCkge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRcdFx0XHRgVmFsdWUgJHt2YWx1ZX0gaXMgb3V0IG9mIHJhbmdlIGZvciAke1N0cmluZyhyYW5nZUtleSl9IFske21pbn0sICR7bWF4fV1gXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgcmFuZ2Ugb3IgdmFsdWUgZm9yICR7U3RyaW5nKHJhbmdlS2V5KX1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXHRcdFx0YEVycm9yIG9jY3VycmVkIHdoaWxlIHZhbGlkYXRpbmcgcmFuZ2UgZm9yICR7U3RyaW5nKHJhbmdlS2V5KX06ICR7dmFsdWV9YFxuXHRcdCk7XG5cdH1cblxuXHRmdW5jdGlvbiB1c2VyQ29sb3JJbnB1dChjb2xvcjogc3RyaW5nKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdHJlZ2V4LnVzZXJJbnB1dC5oZXgudGVzdChjb2xvcikgfHxcblx0XHRcdFx0cmVnZXgudXNlcklucHV0LmhzbC50ZXN0KGNvbG9yKSB8fFxuXHRcdFx0XHRyZWdleC51c2VySW5wdXQucmdiLnRlc3QoY29sb3IpXG5cdFx0XHQpO1xuXHRcdH0sIGBFcnJvciBvY2N1cnJlZCB3aGlsZSB2YWxpZGF0aW5nIHVzZXIgY29sb3IgaW5wdXQ6ICR7Y29sb3J9YCk7XG5cdH1cblxuXHRjb25zdCB2YWxpZGF0aW9uVXRpbGl0aWVzOiBWYWxpZGF0aW9uVXRpbGl0aWVzID0ge1xuXHRcdGNvbG9yVmFsdWUsXG5cdFx0ZW5zdXJlSGFzaCxcblx0XHRoZXgsXG5cdFx0aGV4Q29tcG9uZW50LFxuXHRcdGhleFNldCxcblx0XHRyYW5nZSxcblx0XHR1c2VyQ29sb3JJbnB1dFxuXHR9O1xuXG5cdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYyhcblx0XHQoKSA9PiB2YWxpZGF0aW9uVXRpbGl0aWVzLFxuXHRcdCdFcnJvciBvY2N1cnJlZCB3aGlsZSBjcmVhdGluZyB2YWxpZGF0aW9uIHV0aWxpdGllcyBncm91cC4nXG5cdCk7XG59XG4iXX0=