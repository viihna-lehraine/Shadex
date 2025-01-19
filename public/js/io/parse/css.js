// File: src/io/parse/css.ts
import { common } from '../../common/index.js';
import { config } from '../../config/index.js';
import { data } from '../../data/index.js';
import { colorString as parseColorString, parseAsColorValue } from './shared/index.js';
const defaultColors = data.defaults.brandedColors;
const defaultCMYKValue = defaultColors.cmyk.value;
const defaultHexValue = defaultColors.hex.value;
const defaultHSLValue = defaultColors.hsl.value;
const defaultHSVValue = defaultColors.hsv.value;
const defaultLABValue = defaultColors.lab.value;
const defaultRGBValue = defaultColors.rgb.value;
const defaultXYZValue = defaultColors.xyz.value;
const defaultColorValues = {
    cmyk: defaultCMYKValue,
    hex: defaultHexValue,
    hsl: defaultHSLValue,
    hsv: defaultHSVValue,
    lab: defaultLABValue,
    rgb: defaultRGBValue,
    xyz: defaultXYZValue
};
const guards = common.core.guards;
const regex = config.regex;
const convertToColorString = common.utils.color.colorToColorString;
const convertToCSSColorString = common.core.convert.toCSSColorString;
function header(cssData) {
    // match the pattern
    const headerPattern = regex.file.palette.css.header;
    // execute the regex on the provided CSS data
    const match = cssData.match(headerPattern);
    // if a match is found, return the extracted ID; otherwise, return null
    return Promise.resolve(match ? match[1] : null);
}
function paletteItems(cssData) {
    const lines = cssData.split('\n');
    const items = [];
    let currentId = '';
    let colors = {};
    for (const line of lines) {
        const classMatch = line.match(regex.file.palette.css.class);
        if (classMatch) {
            if (currentId) {
                items.push({
                    id: currentId,
                    colors: {
                        cmyk: guards.isColorString(colors.cmyk)
                            ? parseAsColorValue.cmyk(colors.cmyk)
                            : defaultColorValues.cmyk,
                        hex: guards.isColorString(colors.hex)
                            ? parseAsColorValue.hex(colors.hex)
                            : defaultColorValues.hex,
                        hsl: guards.isColorString(colors.hsl)
                            ? parseAsColorValue.hsl(colors.hsl)
                            : defaultColorValues.hsl,
                        hsv: guards.isColorString(colors.hsv)
                            ? parseAsColorValue.hsv(colors.hsv)
                            : defaultColorValues.hsv,
                        lab: guards.isColorString(colors.lab)
                            ? parseAsColorValue.lab(colors.lab)
                            : defaultColorValues.lab,
                        rgb: guards.isColorString(colors.rgb)
                            ? parseAsColorValue.rgb(colors.rgb)
                            : defaultColorValues.rgb,
                        xyz: guards.isColorString(colors.xyz)
                            ? parseAsColorValue.xyz(colors.xyz)
                            : defaultColorValues.xyz
                    },
                    colorStrings: {
                        cmykString: guards.isColorString(colors.cmyk)
                            ? convertToColorString(parseColorString('cmyk', colors.cmyk)).value
                            : data.defaults.colorStrings.cmyk.value,
                        hexString: guards.isColorString(colors.hex)
                            ? convertToColorString(parseColorString('hex', colors.hex)).value
                            : data.defaults.colorStrings.hex.value,
                        hslString: guards.isColorString(colors.hsl)
                            ? convertToColorString(parseColorString('hsl', colors.hsl)).value
                            : data.defaults.colorStrings.hsl.value,
                        hsvString: guards.isColorString(colors.hsv)
                            ? convertToColorString(parseColorString('hsv', colors.hsv)).value
                            : data.defaults.colorStrings.hsv.value,
                        labString: guards.isColorString(colors.lab)
                            ? convertToColorString(parseColorString('lab', colors.lab)).value
                            : data.defaults.colorStrings.lab.value,
                        rgbString: guards.isColorString(colors.rgb)
                            ? convertToColorString(parseColorString('rgb', colors.rgb)).value
                            : data.defaults.colorStrings.rgb.value,
                        xyzString: guards.isColorString(colors.xyz)
                            ? convertToColorString(parseColorString('xyz', colors.xyz)).value
                            : data.defaults.colorStrings.xyz.value
                    },
                    cssStrings: {
                        cmykCSSString: guards.isColorString(colors.cmyk)
                            ? convertToCSSColorString(parseColorString('cmyk', colors.cmyk))
                            : 'cmyk(0%, 0%, 0%, 0%)',
                        hexCSSString: guards.isColorString(colors.hex)
                            ? convertToCSSColorString(parseColorString('hex', colors.hex))
                            : '#000000',
                        hslCSSString: guards.isColorString(colors.hsl)
                            ? convertToCSSColorString(parseColorString('hsl', colors.hsl))
                            : 'hsl(0, 0%, 0%)',
                        hsvCSSString: guards.isColorString(colors.hsv)
                            ? convertToCSSColorString(parseColorString('hsv', colors.hsv))
                            : 'hsv(0, 0%, 0%)',
                        labCSSString: guards.isColorString(colors.lab)
                            ? convertToCSSColorString(parseColorString('lab', colors.lab))
                            : 'lab(0, 0, 0)',
                        rgbCSSString: guards.isColorString(colors.rgb)
                            ? convertToCSSColorString(parseColorString('rgb', colors.rgb))
                            : 'rgb(0, 0, 0)',
                        xyzCSSString: guards.isColorString(colors.xyz)
                            ? convertToCSSColorString(parseColorString('xyz', colors.xyz))
                            : 'xyz(0, 0, 0)'
                    }
                });
                colors = {}; // reset for the next item
            }
            currentId = classMatch[1]; // update the current ID
        }
        const propertyMatch = line.match(regex.file.palette.css.colorProperty);
        if (propertyMatch) {
            const [, key, value] = propertyMatch;
            colors[key.replace('-color', '')] = value.trim();
        }
    }
    if (currentId) {
        items.push({
            id: currentId,
            colors: {
                cmyk: guards.isColorString(colors.cmyk)
                    ? parseAsColorValue.cmyk(colors.cmyk)
                    : defaultColorValues.cmyk,
                hex: guards.isColorString(colors.hex)
                    ? parseAsColorValue.hex(colors.hex)
                    : defaultColorValues.hex,
                hsl: guards.isColorString(colors.hsl)
                    ? parseAsColorValue.hsl(colors.hsl)
                    : defaultColorValues.hsl,
                hsv: guards.isColorString(colors.hsv)
                    ? parseAsColorValue.hsv(colors.hsv)
                    : defaultColorValues.hsv,
                lab: guards.isColorString(colors.lab)
                    ? parseAsColorValue.lab(colors.lab)
                    : defaultColorValues.lab,
                rgb: guards.isColorString(colors.rgb)
                    ? parseAsColorValue.rgb(colors.rgb)
                    : defaultColorValues.rgb,
                xyz: guards.isColorString(colors.xyz)
                    ? parseAsColorValue.xyz(colors.xyz)
                    : defaultColorValues.xyz
            },
            colorStrings: {
                cmykString: guards.isColorString(colors.cmyk)
                    ? convertToColorString(parseColorString('cmyk', colors.cmyk)).value
                    : data.defaults.colorStrings.cmyk.value,
                hexString: guards.isColorString(colors.hex)
                    ? convertToColorString(parseColorString('hex', colors.hex))
                        .value
                    : data.defaults.colorStrings.hex.value,
                hslString: guards.isColorString(colors.hsl)
                    ? convertToColorString(parseColorString('hsl', colors.hsl))
                        .value
                    : data.defaults.colorStrings.hsl.value,
                hsvString: guards.isColorString(colors.hsv)
                    ? convertToColorString(parseColorString('hsv', colors.hsv))
                        .value
                    : data.defaults.colorStrings.hsv.value,
                labString: guards.isColorString(colors.lab)
                    ? convertToColorString(parseColorString('lab', colors.lab))
                        .value
                    : data.defaults.colorStrings.lab.value,
                rgbString: guards.isColorString(colors.rgb)
                    ? convertToColorString(parseColorString('rgb', colors.rgb))
                        .value
                    : data.defaults.colorStrings.rgb.value,
                xyzString: guards.isColorString(colors.xyz)
                    ? convertToColorString(parseColorString('xyz', colors.xyz))
                        .value
                    : data.defaults.colorStrings.xyz.value
            },
            cssStrings: {
                cmykCSSString: guards.isColorString(colors.cmyk)
                    ? convertToCSSColorString(parseColorString('cmyk', colors.cmyk))
                    : 'cmyk(0%, 0%, 0%, 0%)',
                hexCSSString: guards.isColorString(colors.hex)
                    ? convertToCSSColorString(parseColorString('hex', colors.hex))
                    : '#000000',
                hslCSSString: guards.isColorString(colors.hsl)
                    ? convertToCSSColorString(parseColorString('hsl', colors.hsl))
                    : 'hsl(0, 0%, 0%)',
                hsvCSSString: guards.isColorString(colors.hsv)
                    ? convertToCSSColorString(parseColorString('hsv', colors.hsv))
                    : 'hsv(0, 0%, 0%)',
                labCSSString: guards.isColorString(colors.lab)
                    ? convertToCSSColorString(parseColorString('lab', colors.lab))
                    : 'lab(0, 0, 0)',
                rgbCSSString: guards.isColorString(colors.rgb)
                    ? convertToCSSColorString(parseColorString('rgb', colors.rgb))
                    : 'rgb(0, 0, 0)',
                xyzCSSString: guards.isColorString(colors.xyz)
                    ? convertToCSSColorString(parseColorString('xyz', colors.xyz))
                    : 'xyz(0, 0, 0)'
            }
        });
        colors = {}; // reset for the next item
    }
    return Promise.resolve(items);
}
function settings(data) {
    // define regex patterns for the settings
    const settingsPatterns = {
        enableAlpha: regex.file.palette.css.settings.enableAlpha,
        limitDarkness: regex.file.palette.css.settings.limitDarkness,
        limitGrayness: regex.file.palette.css.settings.limitGrayness,
        limitLightness: regex.file.palette.css.settings.limitLightness
    };
    // initialize default values
    const settings = {
        enableAlpha: false,
        limitDarkness: false,
        limitGrayness: false,
        limitLightness: false
    };
    // iterate through each setting and parse its value
    for (const [key, pattern] of Object.entries(settingsPatterns)) {
        const match = data.match(pattern);
        if (match) {
            // convert 'TRUE'/'FALSE' (case-insensitive) to boolean
            settings[key] =
                match[1].toUpperCase() === 'TRUE';
        }
    }
    return Promise.resolve(settings);
}
export const css = {
    header,
    settings,
    paletteItems
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2lvL3BhcnNlL2Nzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0QkFBNEI7QUFhNUIsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDM0MsT0FBTyxFQUNOLFdBQVcsSUFBSSxnQkFBZ0IsRUFDL0IsaUJBQWlCLEVBQ2pCLE1BQU0sbUJBQW1CLENBQUM7QUFFM0IsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUM7QUFFbEQsTUFBTSxnQkFBZ0IsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUNsRCxNQUFNLGVBQWUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUNoRCxNQUFNLGVBQWUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUNoRCxNQUFNLGVBQWUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUNoRCxNQUFNLGVBQWUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUNoRCxNQUFNLGVBQWUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUNoRCxNQUFNLGVBQWUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUVoRCxNQUFNLGtCQUFrQixHQUFHO0lBQzFCLElBQUksRUFBRSxnQkFBZ0I7SUFDdEIsR0FBRyxFQUFFLGVBQWU7SUFDcEIsR0FBRyxFQUFFLGVBQWU7SUFDcEIsR0FBRyxFQUFFLGVBQWU7SUFDcEIsR0FBRyxFQUFFLGVBQWU7SUFDcEIsR0FBRyxFQUFFLGVBQWU7SUFDcEIsR0FBRyxFQUFF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QUFHLENBQUMsUUFBUSxDQUFDLFdBQVc7UUFDeEQsYUFBYSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsYUFBYTtRQUM1RCxhQUFhLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxhQUFhO1FBQzVELGNBQWMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWM7S0FDOUQsQ0FBQztJQUVILDRCQUE0QjtJQUM1QixNQUFNLFFBQVEsR0FBRztRQUNoQixXQUFXLEVBQUUsS0FBSztRQUNsQixhQUFhLEVBQUUsS0FBSztRQUNwQixhQUFhLEVBQUUsS0FBSztRQUNwQixjQUFjLEVBQUUsS0FBSztLQUNyQixDQUFDO0lBRUYsbURBQW1EO0lBQ25ELEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQztRQUMvRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLElBQUksS0FBSyxFQUFFLENBQUM7WUFDWCx1REFBdUQ7WUFDdkQsUUFBUSxDQUFDLEdBQTRCLENBQUM7Z0JBQ3JDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNLENBQUM7UUFDcEMsQ0FBQztJQUNGLENBQUM7SUFFRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRztJQUNsQixNQUFNO0lBQ04sUUFBUTtJQUNSLFlBQVk7Q0FDWixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2lvL3BhcnNlL2Nzcy50c1xuXG5pbXBvcnQge1xuXHRDTVlLVmFsdWVTdHJpbmcsXG5cdENvbmZpZ1JlZ2V4SW50ZXJmYWNlLFxuXHRIZXhWYWx1ZVN0cmluZyxcblx0SFNMVmFsdWVTdHJpbmcsXG5cdEhTVlZhbHVlU3RyaW5nLFxuXHRMQUJWYWx1ZVN0cmluZyxcblx0UGFsZXR0ZUl0ZW0sXG5cdFJHQlZhbHVlU3RyaW5nLFxuXHRYWVpWYWx1ZVN0cmluZ1xufSBmcm9tICcuLi8uLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb21tb24gfSBmcm9tICcuLi8uLi9jb21tb24vaW5kZXguanMnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi4vLi4vY29uZmlnL2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi8uLi9kYXRhL2luZGV4LmpzJztcbmltcG9ydCB7XG5cdGNvbG9yU3RyaW5nIGFzIHBhcnNlQ29sb3JTdHJpbmcsXG5cdHBhcnNlQXNDb2xvclZhbHVlXG59IGZyb20gJy4vc2hhcmVkL2luZGV4LmpzJztcblxuY29uc3QgZGVmYXVsdENvbG9ycyA9IGRhdGEuZGVmYXVsdHMuYnJhbmRlZENvbG9ycztcblxuY29uc3QgZGVmYXVsdENNWUtWYWx1ZSA9IGRlZmF1bHRDb2xvcnMuY215ay52YWx1ZTtcbmNvbnN0IGRlZmF1bHRIZXhWYWx1ZSA9IGRlZmF1bHRDb2xvcnMuaGV4LnZhbHVlO1xuY29uc3QgZGVmYXVsdEhTTFZhbHVlID0gZGVmYXVsdENvbG9ycy5oc2wudmFsdWU7XG5jb25zdCBkZWZhdWx0SFNWVmFsdWUgPSBkZWZhdWx0Q29sb3JzLmhzdi52YWx1ZTtcbmNvbnN0IGRlZmF1bHRMQUJWYWx1ZSA9IGRlZmF1bHRDb2xvcnMubGFiLnZhbHVlO1xuY29uc3QgZGVmYXVsdFJHQlZhbHVlID0gZGVmYXVsdENvbG9ycy5yZ2IudmFsdWU7XG5jb25zdCBkZWZhdWx0WFlaVmFsdWUgPSBkZWZhdWx0Q29sb3JzLnh5ei52YWx1ZTtcblxuY29uc3QgZGVmYXVsdENvbG9yVmFsdWVzID0ge1xuXHRjbXlrOiBkZWZhdWx0Q01ZS1ZhbHVlLFxuXHRoZXg6IGRlZmF1bHRIZXhWYWx1ZSxcblx0aHNsOiBkZWZhdWx0SFNMVmFsdWUsXG5cdGhzdjogZGVmYXVsdEhTVlZhbHVlLFxuXHRsYWI6IGRlZmF1bHRMQUJWYWx1ZSxcblx0cmdiOiBkZWZhdWx0UkdCVmFsdWUsXG5cdHh5ejogZGVmYXVsdFhZWlZhbHVlXG59O1xuXG5jb25zdCBndWFyZHMgPSBjb21tb24uY29yZS5ndWFyZHM7XG5jb25zdCByZWdleCA9IGNvbmZpZy5yZWdleDtcblxuY29uc3QgY29udmVydFRvQ29sb3JTdHJpbmcgPSBjb21tb24udXRpbHMuY29sb3IuY29sb3JUb0NvbG9yU3RyaW5nO1xuY29uc3QgY29udmVydFRvQ1NTQ29sb3JTdHJpbmcgPSBjb21tb24uY29yZS5jb252ZXJ0LnRvQ1NTQ29sb3JTdHJpbmc7XG5cbmZ1bmN0aW9uIGhlYWRlcihjc3NEYXRhOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcblx0Ly8gbWF0Y2ggdGhlIHBhdHRlcm5cblx0Y29uc3QgaGVhZGVyUGF0dGVybiA9IHJlZ2V4LmZpbGUucGFsZXR0ZS5jc3MuaGVhZGVyO1xuXG5cdC8vIGV4ZWN1dGUgdGhlIHJlZ2V4IG9uIHRoZSBwcm92aWRlZCBDU1MgZGF0YVxuXHRjb25zdCBtYXRjaCA9IGNzc0RhdGEubWF0Y2goaGVhZGVyUGF0dGVybik7XG5cblx0Ly8gaWYgYSBtYXRjaCBpcyBmb3VuZCwgcmV0dXJuIHRoZSBleHRyYWN0ZWQgSUQ7IG90aGVyd2lzZSwgcmV0dXJuIG51bGxcblx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShtYXRjaCA/IG1hdGNoWzFdIDogbnVsbCk7XG59XG5cbmZ1bmN0aW9uIHBhbGV0dGVJdGVtcyhjc3NEYXRhOiBzdHJpbmcpOiBQcm9taXNlPFBhbGV0dGVJdGVtW10+IHtcblx0Y29uc3QgbGluZXMgPSBjc3NEYXRhLnNwbGl0KCdcXG4nKTtcblx0Y29uc3QgaXRlbXM6IFBhbGV0dGVJdGVtW10gPSBbXTtcblxuXHRsZXQgY3VycmVudElkID0gJyc7XG5cdGxldCBjb2xvcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcblxuXHRmb3IgKGNvbnN0IGxpbmUgb2YgbGluZXMpIHtcblx0XHRjb25zdCBjbGFzc01hdGNoID0gbGluZS5tYXRjaChyZWdleC5maWxlLnBhbGV0dGUuY3NzLmNsYXNzKTtcblxuXHRcdGlmIChjbGFzc01hdGNoKSB7XG5cdFx0XHRpZiAoY3VycmVudElkKSB7XG5cdFx0XHRcdGl0ZW1zLnB1c2goe1xuXHRcdFx0XHRcdGlkOiBjdXJyZW50SWQsXG5cdFx0XHRcdFx0Y29sb3JzOiB7XG5cdFx0XHRcdFx0XHRjbXlrOiBndWFyZHMuaXNDb2xvclN0cmluZyhjb2xvcnMuY215aylcblx0XHRcdFx0XHRcdFx0PyBwYXJzZUFzQ29sb3JWYWx1ZS5jbXlrKGNvbG9ycy5jbXlrKVxuXHRcdFx0XHRcdFx0XHQ6IGRlZmF1bHRDb2xvclZhbHVlcy5jbXlrLFxuXHRcdFx0XHRcdFx0aGV4OiBndWFyZHMuaXNDb2xvclN0cmluZyhjb2xvcnMuaGV4KVxuXHRcdFx0XHRcdFx0XHQ/IHBhcnNlQXNDb2xvclZhbHVlLmhleChjb2xvcnMuaGV4KVxuXHRcdFx0XHRcdFx0XHQ6IGRlZmF1bHRDb2xvclZhbHVlcy5oZXgsXG5cdFx0XHRcdFx0XHRoc2w6IGd1YXJkcy5pc0NvbG9yU3RyaW5nKGNvbG9ycy5oc2wpXG5cdFx0XHRcdFx0XHRcdD8gcGFyc2VBc0NvbG9yVmFsdWUuaHNsKGNvbG9ycy5oc2wpXG5cdFx0XHRcdFx0XHRcdDogZGVmYXVsdENvbG9yVmFsdWVzLmhzbCxcblx0XHRcdFx0XHRcdGhzdjogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoY29sb3JzLmhzdilcblx0XHRcdFx0XHRcdFx0PyBwYXJzZUFzQ29sb3JWYWx1ZS5oc3YoY29sb3JzLmhzdilcblx0XHRcdFx0XHRcdFx0OiBkZWZhdWx0Q29sb3JWYWx1ZXMuaHN2LFxuXHRcdFx0XHRcdFx0bGFiOiBndWFyZHMuaXNDb2xvclN0cmluZyhjb2xvcnMubGFiKVxuXHRcdFx0XHRcdFx0XHQ/IHBhcnNlQXNDb2xvclZhbHVlLmxhYihjb2xvcnMubGFiKVxuXHRcdFx0XHRcdFx0XHQ6IGRlZmF1bHRDb2xvclZhbHVlcy5sYWIsXG5cdFx0XHRcdFx0XHRyZ2I6IGd1YXJkcy5pc0NvbG9yU3RyaW5nKGNvbG9ycy5yZ2IpXG5cdFx0XHRcdFx0XHRcdD8gcGFyc2VBc0NvbG9yVmFsdWUucmdiKGNvbG9ycy5yZ2IpXG5cdFx0XHRcdFx0XHRcdDogZGVmYXVsdENvbG9yVmFsdWVzLnJnYixcblx0XHRcdFx0XHRcdHh5ejogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoY29sb3JzLnh5eilcblx0XHRcdFx0XHRcdFx0PyBwYXJzZUFzQ29sb3JWYWx1ZS54eXooY29sb3JzLnh5eilcblx0XHRcdFx0XHRcdFx0OiBkZWZhdWx0Q29sb3JWYWx1ZXMueHl6XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRjb2xvclN0cmluZ3M6IHtcblx0XHRcdFx0XHRcdGNteWtTdHJpbmc6IGd1YXJkcy5pc0NvbG9yU3RyaW5nKGNvbG9ycy5jbXlrKVxuXHRcdFx0XHRcdFx0XHQ/IChjb252ZXJ0VG9Db2xvclN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdHBhcnNlQ29sb3JTdHJpbmcoJ2NteWsnLCBjb2xvcnMuY215aylcblx0XHRcdFx0XHRcdFx0XHQpLnZhbHVlIGFzIENNWUtWYWx1ZVN0cmluZylcblx0XHRcdFx0XHRcdFx0OiBkYXRhLmRlZmF1bHRzLmNvbG9yU3RyaW5ncy5jbXlrLnZhbHVlLFxuXHRcdFx0XHRcdFx0aGV4U3RyaW5nOiBndWFyZHMuaXNDb2xvclN0cmluZyhjb2xvcnMuaGV4KVxuXHRcdFx0XHRcdFx0XHQ/IChjb252ZXJ0VG9Db2xvclN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdHBhcnNlQ29sb3JTdHJpbmcoJ2hleCcsIGNvbG9ycy5oZXgpXG5cdFx0XHRcdFx0XHRcdFx0KS52YWx1ZSBhcyBIZXhWYWx1ZVN0cmluZylcblx0XHRcdFx0XHRcdFx0OiBkYXRhLmRlZmF1bHRzLmNvbG9yU3RyaW5ncy5oZXgudmFsdWUsXG5cdFx0XHRcdFx0XHRoc2xTdHJpbmc6IGd1YXJkcy5pc0NvbG9yU3RyaW5nKGNvbG9ycy5oc2wpXG5cdFx0XHRcdFx0XHRcdD8gKGNvbnZlcnRUb0NvbG9yU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0cGFyc2VDb2xvclN0cmluZygnaHNsJywgY29sb3JzLmhzbClcblx0XHRcdFx0XHRcdFx0XHQpLnZhbHVlIGFzIEhTTFZhbHVlU3RyaW5nKVxuXHRcdFx0XHRcdFx0XHQ6IGRhdGEuZGVmYXVsdHMuY29sb3JTdHJpbmdzLmhzbC52YWx1ZSxcblx0XHRcdFx0XHRcdGhzdlN0cmluZzogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoY29sb3JzLmhzdilcblx0XHRcdFx0XHRcdFx0PyAoY29udmVydFRvQ29sb3JTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRwYXJzZUNvbG9yU3RyaW5nKCdoc3YnLCBjb2xvcnMuaHN2KVxuXHRcdFx0XHRcdFx0XHRcdCkudmFsdWUgYXMgSFNWVmFsdWVTdHJpbmcpXG5cdFx0XHRcdFx0XHRcdDogZGF0YS5kZWZhdWx0cy5jb2xvclN0cmluZ3MuaHN2LnZhbHVlLFxuXHRcdFx0XHRcdFx0bGFiU3RyaW5nOiBndWFyZHMuaXNDb2xvclN0cmluZyhjb2xvcnMubGFiKVxuXHRcdFx0XHRcdFx0XHQ/IChjb252ZXJ0VG9Db2xvclN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdHBhcnNlQ29sb3JTdHJpbmcoJ2xhYicsIGNvbG9ycy5sYWIpXG5cdFx0XHRcdFx0XHRcdFx0KS52YWx1ZSBhcyBMQUJWYWx1ZVN0cmluZylcblx0XHRcdFx0XHRcdFx0OiBkYXRhLmRlZmF1bHRzLmNvbG9yU3RyaW5ncy5sYWIudmFsdWUsXG5cdFx0XHRcdFx0XHRyZ2JTdHJpbmc6IGd1YXJkcy5pc0NvbG9yU3RyaW5nKGNvbG9ycy5yZ2IpXG5cdFx0XHRcdFx0XHRcdD8gKGNvbnZlcnRUb0NvbG9yU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0cGFyc2VDb2xvclN0cmluZygncmdiJywgY29sb3JzLnJnYilcblx0XHRcdFx0XHRcdFx0XHQpLnZhbHVlIGFzIFJHQlZhbHVlU3RyaW5nKVxuXHRcdFx0XHRcdFx0XHQ6IGRhdGEuZGVmYXVsdHMuY29sb3JTdHJpbmdzLnJnYi52YWx1ZSxcblx0XHRcdFx0XHRcdHh5elN0cmluZzogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoY29sb3JzLnh5eilcblx0XHRcdFx0XHRcdFx0PyAoY29udmVydFRvQ29sb3JTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRwYXJzZUNvbG9yU3RyaW5nKCd4eXonLCBjb2xvcnMueHl6KVxuXHRcdFx0XHRcdFx0XHRcdCkudmFsdWUgYXMgWFlaVmFsdWVTdHJpbmcgYXMgWFlaVmFsdWVTdHJpbmcpXG5cdFx0XHRcdFx0XHRcdDogZGF0YS5kZWZhdWx0cy5jb2xvclN0cmluZ3MueHl6LnZhbHVlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRjc3NTdHJpbmdzOiB7XG5cdFx0XHRcdFx0XHRjbXlrQ1NTU3RyaW5nOiBndWFyZHMuaXNDb2xvclN0cmluZyhjb2xvcnMuY215aylcblx0XHRcdFx0XHRcdFx0PyBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdHBhcnNlQ29sb3JTdHJpbmcoJ2NteWsnLCBjb2xvcnMuY215aylcblx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdDogJ2NteWsoMCUsIDAlLCAwJSwgMCUpJyxcblx0XHRcdFx0XHRcdGhleENTU1N0cmluZzogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoY29sb3JzLmhleClcblx0XHRcdFx0XHRcdFx0PyBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdHBhcnNlQ29sb3JTdHJpbmcoJ2hleCcsIGNvbG9ycy5oZXgpXG5cdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHQ6ICcjMDAwMDAwJyxcblx0XHRcdFx0XHRcdGhzbENTU1N0cmluZzogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoY29sb3JzLmhzbClcblx0XHRcdFx0XHRcdFx0PyBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdHBhcnNlQ29sb3JTdHJpbmcoJ2hzbCcsIGNvbG9ycy5oc2wpXG5cdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHQ6ICdoc2woMCwgMCUsIDAlKScsXG5cdFx0XHRcdFx0XHRoc3ZDU1NTdHJpbmc6IGd1YXJkcy5pc0NvbG9yU3RyaW5nKGNvbG9ycy5oc3YpXG5cdFx0XHRcdFx0XHRcdD8gY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRwYXJzZUNvbG9yU3RyaW5nKCdoc3YnLCBjb2xvcnMuaHN2KVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0OiAnaHN2KDAsIDAlLCAwJSknLFxuXHRcdFx0XHRcdFx0bGFiQ1NTU3RyaW5nOiBndWFyZHMuaXNDb2xvclN0cmluZyhjb2xvcnMubGFiKVxuXHRcdFx0XHRcdFx0XHQ/IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0cGFyc2VDb2xvclN0cmluZygnbGFiJywgY29sb3JzLmxhYilcblx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdDogJ2xhYigwLCAwLCAwKScsXG5cdFx0XHRcdFx0XHRyZ2JDU1NTdHJpbmc6IGd1YXJkcy5pc0NvbG9yU3RyaW5nKGNvbG9ycy5yZ2IpXG5cdFx0XHRcdFx0XHRcdD8gY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRwYXJzZUNvbG9yU3RyaW5nKCdyZ2InLCBjb2xvcnMucmdiKVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0OiAncmdiKDAsIDAsIDApJyxcblx0XHRcdFx0XHRcdHh5ekNTU1N0cmluZzogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoY29sb3JzLnh5eilcblx0XHRcdFx0XHRcdFx0PyBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdHBhcnNlQ29sb3JTdHJpbmcoJ3h5eicsIGNvbG9ycy54eXopXG5cdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHQ6ICd4eXooMCwgMCwgMCknXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRjb2xvcnMgPSB7fTsgLy8gcmVzZXQgZm9yIHRoZSBuZXh0IGl0ZW1cblx0XHRcdH1cblxuXHRcdFx0Y3VycmVudElkID0gY2xhc3NNYXRjaFsxXTsgLy8gdXBkYXRlIHRoZSBjdXJyZW50IElEXG5cdFx0fVxuXG5cdFx0Y29uc3QgcHJvcGVydHlNYXRjaCA9IGxpbmUubWF0Y2gocmVnZXguZmlsZS5wYWxldHRlLmNzcy5jb2xvclByb3BlcnR5KTtcblx0XHRpZiAocHJvcGVydHlNYXRjaCkge1xuXHRcdFx0Y29uc3QgWywga2V5LCB2YWx1ZV0gPSBwcm9wZXJ0eU1hdGNoO1xuXHRcdFx0Y29sb3JzW2tleS5yZXBsYWNlKCctY29sb3InLCAnJyldID0gdmFsdWUudHJpbSgpO1xuXHRcdH1cblx0fVxuXG5cdGlmIChjdXJyZW50SWQpIHtcblx0XHRpdGVtcy5wdXNoKHtcblx0XHRcdGlkOiBjdXJyZW50SWQsXG5cdFx0XHRjb2xvcnM6IHtcblx0XHRcdFx0Y215azogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoY29sb3JzLmNteWspXG5cdFx0XHRcdFx0PyBwYXJzZUFzQ29sb3JWYWx1ZS5jbXlrKGNvbG9ycy5jbXlrKVxuXHRcdFx0XHRcdDogZGVmYXVsdENvbG9yVmFsdWVzLmNteWssXG5cdFx0XHRcdGhleDogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoY29sb3JzLmhleClcblx0XHRcdFx0XHQ/IHBhcnNlQXNDb2xvclZhbHVlLmhleChjb2xvcnMuaGV4KVxuXHRcdFx0XHRcdDogZGVmYXVsdENvbG9yVmFsdWVzLmhleCxcblx0XHRcdFx0aHNsOiBndWFyZHMuaXNDb2xvclN0cmluZyhjb2xvcnMuaHNsKVxuXHRcdFx0XHRcdD8gcGFyc2VBc0NvbG9yVmFsdWUuaHNsKGNvbG9ycy5oc2wpXG5cdFx0XHRcdFx0OiBkZWZhdWx0Q29sb3JWYWx1ZXMuaHNsLFxuXHRcdFx0XHRoc3Y6IGd1YXJkcy5pc0NvbG9yU3RyaW5nKGNvbG9ycy5oc3YpXG5cdFx0XHRcdFx0PyBwYXJzZUFzQ29sb3JWYWx1ZS5oc3YoY29sb3JzLmhzdilcblx0XHRcdFx0XHQ6IGRlZmF1bHRDb2xvclZhbHVlcy5oc3YsXG5cdFx0XHRcdGxhYjogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoY29sb3JzLmxhYilcblx0XHRcdFx0XHQ/IHBhcnNlQXNDb2xvclZhbHVlLmxhYihjb2xvcnMubGFiKVxuXHRcdFx0XHRcdDogZGVmYXVsdENvbG9yVmFsdWVzLmxhYixcblx0XHRcdFx0cmdiOiBndWFyZHMuaXNDb2xvclN0cmluZyhjb2xvcnMucmdiKVxuXHRcdFx0XHRcdD8gcGFyc2VBc0NvbG9yVmFsdWUucmdiKGNvbG9ycy5yZ2IpXG5cdFx0XHRcdFx0OiBkZWZhdWx0Q29sb3JWYWx1ZXMucmdiLFxuXHRcdFx0XHR4eXo6IGd1YXJkcy5pc0NvbG9yU3RyaW5nKGNvbG9ycy54eXopXG5cdFx0XHRcdFx0PyBwYXJzZUFzQ29sb3JWYWx1ZS54eXooY29sb3JzLnh5eilcblx0XHRcdFx0XHQ6IGRlZmF1bHRDb2xvclZhbHVlcy54eXpcblx0XHRcdH0sXG5cdFx0XHRjb2xvclN0cmluZ3M6IHtcblx0XHRcdFx0Y215a1N0cmluZzogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoY29sb3JzLmNteWspXG5cdFx0XHRcdFx0PyAoY29udmVydFRvQ29sb3JTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdHBhcnNlQ29sb3JTdHJpbmcoJ2NteWsnLCBjb2xvcnMuY215aylcblx0XHRcdFx0XHRcdCkudmFsdWUgYXMgQ01ZS1ZhbHVlU3RyaW5nKVxuXHRcdFx0XHRcdDogZGF0YS5kZWZhdWx0cy5jb2xvclN0cmluZ3MuY215ay52YWx1ZSxcblx0XHRcdFx0aGV4U3RyaW5nOiBndWFyZHMuaXNDb2xvclN0cmluZyhjb2xvcnMuaGV4KVxuXHRcdFx0XHRcdD8gKGNvbnZlcnRUb0NvbG9yU3RyaW5nKHBhcnNlQ29sb3JTdHJpbmcoJ2hleCcsIGNvbG9ycy5oZXgpKVxuXHRcdFx0XHRcdFx0XHQudmFsdWUgYXMgSGV4VmFsdWVTdHJpbmcpXG5cdFx0XHRcdFx0OiBkYXRhLmRlZmF1bHRzLmNvbG9yU3RyaW5ncy5oZXgudmFsdWUsXG5cdFx0XHRcdGhzbFN0cmluZzogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoY29sb3JzLmhzbClcblx0XHRcdFx0XHQ/IChjb252ZXJ0VG9Db2xvclN0cmluZyhwYXJzZUNvbG9yU3RyaW5nKCdoc2wnLCBjb2xvcnMuaHNsKSlcblx0XHRcdFx0XHRcdFx0LnZhbHVlIGFzIEhTTFZhbHVlU3RyaW5nKVxuXHRcdFx0XHRcdDogZGF0YS5kZWZhdWx0cy5jb2xvclN0cmluZ3MuaHNsLnZhbHVlLFxuXHRcdFx0XHRoc3ZTdHJpbmc6IGd1YXJkcy5pc0NvbG9yU3RyaW5nKGNvbG9ycy5oc3YpXG5cdFx0XHRcdFx0PyAoY29udmVydFRvQ29sb3JTdHJpbmcocGFyc2VDb2xvclN0cmluZygnaHN2JywgY29sb3JzLmhzdikpXG5cdFx0XHRcdFx0XHRcdC52YWx1ZSBhcyBIU1ZWYWx1ZVN0cmluZylcblx0XHRcdFx0XHQ6IGRhdGEuZGVmYXVsdHMuY29sb3JTdHJpbmdzLmhzdi52YWx1ZSxcblx0XHRcdFx0bGFiU3RyaW5nOiBndWFyZHMuaXNDb2xvclN0cmluZyhjb2xvcnMubGFiKVxuXHRcdFx0XHRcdD8gKGNvbnZlcnRUb0NvbG9yU3RyaW5nKHBhcnNlQ29sb3JTdHJpbmcoJ2xhYicsIGNvbG9ycy5sYWIpKVxuXHRcdFx0XHRcdFx0XHQudmFsdWUgYXMgTEFCVmFsdWVTdHJpbmcpXG5cdFx0XHRcdFx0OiBkYXRhLmRlZmF1bHRzLmNvbG9yU3RyaW5ncy5sYWIudmFsdWUsXG5cdFx0XHRcdHJnYlN0cmluZzogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoY29sb3JzLnJnYilcblx0XHRcdFx0XHQ/IChjb252ZXJ0VG9Db2xvclN0cmluZyhwYXJzZUNvbG9yU3RyaW5nKCdyZ2InLCBjb2xvcnMucmdiKSlcblx0XHRcdFx0XHRcdFx0LnZhbHVlIGFzIFJHQlZhbHVlU3RyaW5nKVxuXHRcdFx0XHRcdDogZGF0YS5kZWZhdWx0cy5jb2xvclN0cmluZ3MucmdiLnZhbHVlLFxuXHRcdFx0XHR4eXpTdHJpbmc6IGd1YXJkcy5pc0NvbG9yU3RyaW5nKGNvbG9ycy54eXopXG5cdFx0XHRcdFx0PyAoY29udmVydFRvQ29sb3JTdHJpbmcocGFyc2VDb2xvclN0cmluZygneHl6JywgY29sb3JzLnh5eikpXG5cdFx0XHRcdFx0XHRcdC52YWx1ZSBhcyBYWVpWYWx1ZVN0cmluZylcblx0XHRcdFx0XHQ6IGRhdGEuZGVmYXVsdHMuY29sb3JTdHJpbmdzLnh5ei52YWx1ZVxuXHRcdFx0fSxcblx0XHRcdGNzc1N0cmluZ3M6IHtcblx0XHRcdFx0Y215a0NTU1N0cmluZzogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoY29sb3JzLmNteWspXG5cdFx0XHRcdFx0PyBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyhcblx0XHRcdFx0XHRcdFx0cGFyc2VDb2xvclN0cmluZygnY215aycsIGNvbG9ycy5jbXlrKVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdDogJ2NteWsoMCUsIDAlLCAwJSwgMCUpJyxcblx0XHRcdFx0aGV4Q1NTU3RyaW5nOiBndWFyZHMuaXNDb2xvclN0cmluZyhjb2xvcnMuaGV4KVxuXHRcdFx0XHRcdD8gY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdHBhcnNlQ29sb3JTdHJpbmcoJ2hleCcsIGNvbG9ycy5oZXgpXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0OiAnIzAwMDAwMCcsXG5cdFx0XHRcdGhzbENTU1N0cmluZzogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoY29sb3JzLmhzbClcblx0XHRcdFx0XHQ/IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRwYXJzZUNvbG9yU3RyaW5nKCdoc2wnLCBjb2xvcnMuaHNsKVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdDogJ2hzbCgwLCAwJSwgMCUpJyxcblx0XHRcdFx0aHN2Q1NTU3RyaW5nOiBndWFyZHMuaXNDb2xvclN0cmluZyhjb2xvcnMuaHN2KVxuXHRcdFx0XHRcdD8gY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdHBhcnNlQ29sb3JTdHJpbmcoJ2hzdicsIGNvbG9ycy5oc3YpXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0OiAnaHN2KDAsIDAlLCAwJSknLFxuXHRcdFx0XHRsYWJDU1NTdHJpbmc6IGd1YXJkcy5pc0NvbG9yU3RyaW5nKGNvbG9ycy5sYWIpXG5cdFx0XHRcdFx0PyBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyhcblx0XHRcdFx0XHRcdFx0cGFyc2VDb2xvclN0cmluZygnbGFiJywgY29sb3JzLmxhYilcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQ6ICdsYWIoMCwgMCwgMCknLFxuXHRcdFx0XHRyZ2JDU1NTdHJpbmc6IGd1YXJkcy5pc0NvbG9yU3RyaW5nKGNvbG9ycy5yZ2IpXG5cdFx0XHRcdFx0PyBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyhcblx0XHRcdFx0XHRcdFx0cGFyc2VDb2xvclN0cmluZygncmdiJywgY29sb3JzLnJnYilcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQ6ICdyZ2IoMCwgMCwgMCknLFxuXHRcdFx0XHR4eXpDU1NTdHJpbmc6IGd1YXJkcy5pc0NvbG9yU3RyaW5nKGNvbG9ycy54eXopXG5cdFx0XHRcdFx0PyBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyhcblx0XHRcdFx0XHRcdFx0cGFyc2VDb2xvclN0cmluZygneHl6JywgY29sb3JzLnh5eilcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQ6ICd4eXooMCwgMCwgMCknXG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRjb2xvcnMgPSB7fTsgLy8gcmVzZXQgZm9yIHRoZSBuZXh0IGl0ZW1cblx0fVxuXG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoaXRlbXMpO1xufVxuXG5mdW5jdGlvbiBzZXR0aW5ncyhkYXRhOiBzdHJpbmcpOiBQcm9taXNlPHtcblx0ZW5hYmxlQWxwaGE6IGJvb2xlYW47XG5cdGxpbWl0RGFya25lc3M6IGJvb2xlYW47XG5cdGxpbWl0R3JheW5lc3M6IGJvb2xlYW47XG5cdGxpbWl0TGlnaHRuZXNzOiBib29sZWFuO1xufSB8IHZvaWQ+IHtcblx0Ly8gZGVmaW5lIHJlZ2V4IHBhdHRlcm5zIGZvciB0aGUgc2V0dGluZ3Ncblx0Y29uc3Qgc2V0dGluZ3NQYXR0ZXJuczogQ29uZmlnUmVnZXhJbnRlcmZhY2VbJ2ZpbGUnXVsncGFsZXR0ZSddWydjc3MnXVsnc2V0dGluZ3MnXSA9XG5cdFx0e1xuXHRcdFx0ZW5hYmxlQWxwaGE6IHJlZ2V4LmZpbGUucGFsZXR0ZS5jc3Muc2V0dGluZ3MuZW5hYmxlQWxwaGEsXG5cdFx0XHRsaW1pdERhcmtuZXNzOiByZWdleC5maWxlLnBhbGV0dGUuY3NzLnNldHRpbmdzLmxpbWl0RGFya25lc3MsXG5cdFx0XHRsaW1pdEdyYXluZXNzOiByZWdleC5maWxlLnBhbGV0dGUuY3NzLnNldHRpbmdzLmxpbWl0R3JheW5lc3MsXG5cdFx0XHRsaW1pdExpZ2h0bmVzczogcmVnZXguZmlsZS5wYWxldHRlLmNzcy5zZXR0aW5ncy5saW1pdExpZ2h0bmVzc1xuXHRcdH07XG5cblx0Ly8gaW5pdGlhbGl6ZSBkZWZhdWx0IHZhbHVlc1xuXHRjb25zdCBzZXR0aW5ncyA9IHtcblx0XHRlbmFibGVBbHBoYTogZmFsc2UsXG5cdFx0bGltaXREYXJrbmVzczogZmFsc2UsXG5cdFx0bGltaXRHcmF5bmVzczogZmFsc2UsXG5cdFx0bGltaXRMaWdodG5lc3M6IGZhbHNlXG5cdH07XG5cblx0Ly8gaXRlcmF0ZSB0aHJvdWdoIGVhY2ggc2V0dGluZyBhbmQgcGFyc2UgaXRzIHZhbHVlXG5cdGZvciAoY29uc3QgW2tleSwgcGF0dGVybl0gb2YgT2JqZWN0LmVudHJpZXMoc2V0dGluZ3NQYXR0ZXJucykpIHtcblx0XHRjb25zdCBtYXRjaCA9IGRhdGEubWF0Y2gocGF0dGVybik7XG5cdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHQvLyBjb252ZXJ0ICdUUlVFJy8nRkFMU0UnIChjYXNlLWluc2Vuc2l0aXZlKSB0byBib29sZWFuXG5cdFx0XHRzZXR0aW5nc1trZXkgYXMga2V5b2YgdHlwZW9mIHNldHRpbmdzXSA9XG5cdFx0XHRcdG1hdGNoWzFdLnRvVXBwZXJDYXNlKCkgPT09ICdUUlVFJztcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHNldHRpbmdzKTtcbn1cblxuZXhwb3J0IGNvbnN0IGNzcyA9IHtcblx0aGVhZGVyLFxuXHRzZXR0aW5ncyxcblx0cGFsZXR0ZUl0ZW1zXG59O1xuIl19