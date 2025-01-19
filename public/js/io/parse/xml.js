// File: src/io/parse/xml.ts
import { common } from '../../common/index.js';
import { data } from '../../data/index.js';
import { parseAsColorValue } from './shared/index.js';
const guards = common.core.guards;
const convertToColorString = common.utils.color.colorToColorString;
const convertToCSSColorString = common.core.convert.toCSSColorString;
const defaultColors = data.defaults.brandedColors;
const defaultColorValues = {
    cmyk: defaultColors.cmyk.value,
    hex: defaultColors.hex.value,
    hsl: defaultColors.hsl.value,
    hsv: defaultColors.hsv.value,
    lab: defaultColors.lab.value,
    rgb: defaultColors.rgb.value,
    xyz: defaultColors.xyz.value
};
function flags(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    const parseError = xmlDoc.querySelector('parsererror');
    const paletteElement = xmlDoc.querySelector('Palette');
    if (parseError) {
        throw new Error('Invalid XML format');
    }
    if (!paletteElement) {
        throw new Error('Invalid XML format: No Palette element found.');
    }
    return {
        enableAlpha: paletteElement.querySelector('EnableAlpha')?.textContent === 'true',
        limitDarkness: paletteElement.querySelector('LimitDarkness')?.textContent ===
            'true',
        limitGrayness: paletteElement.querySelector('LimitGrayness')?.textContent ===
            'true',
        limitLightness: paletteElement.querySelector('LimitLightness')?.textContent ===
            'true'
    };
}
function paletteItems(xmlData) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, 'application/xml');
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
            throw new Error('Invalid XML format');
        }
        // extract items
        const items = Array.from(xmlDoc.querySelectorAll('PaletteItem')).map(item => {
            const id = item.getAttribute('id') || 'unknown';
            // parse each color property
            const colors = {
                cmyk: guards.isColorString(item.querySelector('CMYK')?.textContent || '')
                    ? parseAsColorValue.cmyk(item.querySelector('CMYK')?.textContent || '')
                    : defaultColorValues.cmyk,
                hex: guards.isColorString(item.querySelector('Hex')?.textContent || '')
                    ? parseAsColorValue.hex(item.querySelector('Hex')?.textContent || '')
                    : defaultColorValues.hex,
                hsl: guards.isColorString(item.querySelector('HSL')?.textContent || '')
                    ? parseAsColorValue.hsl(item.querySelector('HSL')?.textContent || '')
                    : defaultColorValues.hsl,
                hsv: guards.isColorString(item.querySelector('HSV')?.textContent || '')
                    ? parseAsColorValue.hsv(item.querySelector('HSV')?.textContent || '')
                    : defaultColorValues.hsv,
                lab: guards.isColorString(item.querySelector('LAB')?.textContent || '')
                    ? parseAsColorValue.lab(item.querySelector('LAB')?.textContent || '')
                    : defaultColorValues.lab,
                rgb: guards.isColorString(item.querySelector('RGB')?.textContent || '')
                    ? parseAsColorValue.rgb(item.querySelector('RGB')?.textContent || '')
                    : defaultColorValues.rgb,
                xyz: guards.isColorString(item.querySelector('XYZ')?.textContent || '')
                    ? parseAsColorValue.xyz(item.querySelector('XYZ')?.textContent || '')
                    : defaultColorValues.xyz
            };
            const cmykColorString = convertToColorString({
                value: colors.cmyk,
                format: 'cmyk'
            }).value;
            const cmykCSSColorString = convertToCSSColorString({
                value: colors.cmyk,
                format: 'cmyk'
            });
            const hexColorString = convertToColorString({
                value: colors.hex,
                format: 'hex'
            }).value;
            const hexCSSColorString = convertToCSSColorString({
                value: colors.hex,
                format: 'hex'
            });
            const hslColorString = convertToColorString({
                value: colors.hsl,
                format: 'hsl'
            }).value;
            const hslCSSColorString = convertToCSSColorString({
                value: colors.hsl,
                format: 'hsl'
            });
            const hsvColorString = convertToColorString({
                value: colors.hsv,
                format: 'hsv'
            }).value;
            const hsvCSSColorString = convertToCSSColorString({
                value: colors.hsv,
                format: 'hsv'
            });
            const labColorString = convertToColorString({
                value: colors.lab,
                format: 'lab'
            }).value;
            const labCSSColorString = convertToCSSColorString({
                value: colors.lab,
                format: 'lab'
            });
            const rgbColorString = convertToColorString({
                value: colors.rgb,
                format: 'rgb'
            }).value;
            const rgbCSSColorString = convertToCSSColorString({
                value: colors.rgb,
                format: 'rgb'
            });
            const xyzColorString = convertToColorString({
                value: colors.xyz,
                format: 'xyz'
            }).value;
            const xyzCSSColorString = convertToCSSColorString({
                value: colors.xyz,
                format: 'xyz'
            });
            const colorStrings = {
                cmykString: cmykColorString,
                hexString: hexColorString,
                hslString: hslColorString,
                hsvString: hsvColorString,
                labString: labColorString,
                rgbString: rgbColorString,
                xyzString: xyzColorString
            };
            const cssStrings = {
                cmykCSSString: cmykCSSColorString,
                hexCSSString: hexCSSColorString,
                hslCSSString: hslCSSColorString,
                hsvCSSString: hsvCSSColorString,
                labCSSString: labCSSColorString,
                rgbCSSString: rgbCSSColorString,
                xyzCSSString: xyzCSSColorString
            };
            // generate color strings and CSS strings
            return {
                id,
                colors,
                colorStrings,
                cssStrings
            };
        });
        return Promise.resolve(items);
    }
    catch (error) {
        console.error('Error parsing XML palette items:', error);
        return Promise.resolve([]);
    }
}
export const xml = {
    flags,
    paletteItems
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2lvL3BhcnNlL3htbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0QkFBNEI7QUFtQjVCLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDM0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFdEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDbEMsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztBQUNuRSxNQUFNLHVCQUF1QixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDO0FBRXJFLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO0FBRWxELE1BQU0sa0JBQWtCLEdBQUc7SUFDMUIsSUFBSSxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBa0I7SUFDM0MsR0FBRyxFQUFFLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBaUI7SUFDeEMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBaUI7SUFDeEMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBaUI7SUFDeEMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBaUI7SUFDeEMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBaUI7SUFDeEMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBaUI7Q0FDeEMsQ0FBQztBQUVGLFNBQVMsS0FBSyxDQUFDLFNBQWlCO0lBTS9CLE1BQU0sTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7SUFDL0IsTUFBTSxNQUFN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RSxpQkFBaUI7Z0JBQy9CLFlBQVksRUFBRSxpQkFBaUI7Z0JBQy9CLFlBQVksRUFBRSxpQkFBaUI7Z0JBQy9CLFlBQVksRUFBRSxpQkFBaUI7YUFDL0IsQ0FBQztZQUVGLHlDQUF5QztZQUN6QyxPQUFPO2dCQUNOLEVBQUU7Z0JBQ0YsTUFBTTtnQkFDTixZQUFZO2dCQUNaLFVBQVU7YUFDVixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV6RCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUIsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUc7SUFDbEIsS0FBSztJQUNMLFlBQVk7Q0FDWixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2lvL3BhcnNlL3htbC50c1xuXG5pbXBvcnQge1xuXHRQYWxldHRlSXRlbSxcblx0Q01ZS1ZhbHVlLFxuXHRDTVlLVmFsdWVTdHJpbmcsXG5cdEhleFZhbHVlLFxuXHRIZXhWYWx1ZVN0cmluZyxcblx0SFNMVmFsdWUsXG5cdEhTTFZhbHVlU3RyaW5nLFxuXHRIU1ZWYWx1ZSxcblx0SFNWVmFsdWVTdHJpbmcsXG5cdExBQlZhbHVlLFxuXHRMQUJWYWx1ZVN0cmluZyxcblx0UkdCVmFsdWUsXG5cdFJHQlZhbHVlU3RyaW5nLFxuXHRYWVpWYWx1ZSxcblx0WFlaVmFsdWVTdHJpbmdcbn0gZnJvbSAnLi4vLi4vaW5kZXgvaW5kZXguanMnO1xuaW1wb3J0IHsgY29tbW9uIH0gZnJvbSAnLi4vLi4vY29tbW9uL2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi8uLi9kYXRhL2luZGV4LmpzJztcbmltcG9ydCB7IHBhcnNlQXNDb2xvclZhbHVlIH0gZnJvbSAnLi9zaGFyZWQvaW5kZXguanMnO1xuXG5jb25zdCBndWFyZHMgPSBjb21tb24uY29yZS5ndWFyZHM7XG5jb25zdCBjb252ZXJ0VG9Db2xvclN0cmluZyA9IGNvbW1vbi51dGlscy5jb2xvci5jb2xvclRvQ29sb3JTdHJpbmc7XG5jb25zdCBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyA9IGNvbW1vbi5jb3JlLmNvbnZlcnQudG9DU1NDb2xvclN0cmluZztcblxuY29uc3QgZGVmYXVsdENvbG9ycyA9IGRhdGEuZGVmYXVsdHMuYnJhbmRlZENvbG9ycztcblxuY29uc3QgZGVmYXVsdENvbG9yVmFsdWVzID0ge1xuXHRjbXlrOiBkZWZhdWx0Q29sb3JzLmNteWsudmFsdWUgYXMgQ01ZS1ZhbHVlLFxuXHRoZXg6IGRlZmF1bHRDb2xvcnMuaGV4LnZhbHVlIGFzIEhleFZhbHVlLFxuXHRoc2w6IGRlZmF1bHRDb2xvcnMuaHNsLnZhbHVlIGFzIEhTTFZhbHVlLFxuXHRoc3Y6IGRlZmF1bHRDb2xvcnMuaHN2LnZhbHVlIGFzIEhTVlZhbHVlLFxuXHRsYWI6IGRlZmF1bHRDb2xvcnMubGFiLnZhbHVlIGFzIExBQlZhbHVlLFxuXHRyZ2I6IGRlZmF1bHRDb2xvcnMucmdiLnZhbHVlIGFzIFJHQlZhbHVlLFxuXHR4eXo6IGRlZmF1bHRDb2xvcnMueHl6LnZhbHVlIGFzIFhZWlZhbHVlXG59O1xuXG5mdW5jdGlvbiBmbGFncyh4bWxTdHJpbmc6IHN0cmluZyk6IHtcblx0ZW5hYmxlQWxwaGE6IGJvb2xlYW47XG5cdGxpbWl0RGFya25lc3M6IGJvb2xlYW47XG5cdGxpbWl0R3JheW5lc3M6IGJvb2xlYW47XG5cdGxpbWl0TGlnaHRuZXNzOiBib29sZWFuO1xufSB7XG5cdGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcblx0Y29uc3QgeG1sRG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh4bWxTdHJpbmcsICdhcHBsaWNhdGlvbi94bWwnKTtcblx0Y29uc3QgcGFyc2VFcnJvciA9IHhtbERvYy5xdWVyeVNlbGVjdG9yKCdwYXJzZXJlcnJvcicpO1xuXHRjb25zdCBwYWxldHRlRWxlbWVudCA9IHhtbERvYy5xdWVyeVNlbGVjdG9yKCdQYWxldHRlJyk7XG5cblx0aWYgKHBhcnNlRXJyb3IpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgWE1MIGZvcm1hdCcpO1xuXHR9XG5cdGlmICghcGFsZXR0ZUVsZW1lbnQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgWE1MIGZvcm1hdDogTm8gUGFsZXR0ZSBlbGVtZW50IGZvdW5kLicpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRlbmFibGVBbHBoYTpcblx0XHRcdHBhbGV0dGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0VuYWJsZUFscGhhJyk/LnRleHRDb250ZW50ID09PSAndHJ1ZScsXG5cdFx0bGltaXREYXJrbmVzczpcblx0XHRcdHBhbGV0dGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0xpbWl0RGFya25lc3MnKT8udGV4dENvbnRlbnQgPT09XG5cdFx0XHQndHJ1ZScsXG5cdFx0bGltaXRHcmF5bmVzczpcblx0XHRcdHBhbGV0dGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ0xpbWl0R3JheW5lc3MnKT8udGV4dENvbnRlbnQgPT09XG5cdFx0XHQndHJ1ZScsXG5cdFx0bGltaXRMaWdodG5lc3M6XG5cdFx0XHRwYWxldHRlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdMaW1pdExpZ2h0bmVzcycpPy50ZXh0Q29udGVudCA9PT1cblx0XHRcdCd0cnVlJ1xuXHR9O1xufVxuXG5mdW5jdGlvbiBwYWxldHRlSXRlbXMoeG1sRGF0YTogc3RyaW5nKTogUHJvbWlzZTxQYWxldHRlSXRlbVtdPiB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuXHRcdGNvbnN0IHhtbERvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoeG1sRGF0YSwgJ2FwcGxpY2F0aW9uL3htbCcpO1xuXHRcdGNvbnN0IHBhcnNlRXJyb3IgPSB4bWxEb2MucXVlcnlTZWxlY3RvcigncGFyc2VyZXJyb3InKTtcblxuXHRcdGlmIChwYXJzZUVycm9yKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgWE1MIGZvcm1hdCcpO1xuXHRcdH1cblxuXHRcdC8vIGV4dHJhY3QgaXRlbXNcblx0XHRjb25zdCBpdGVtczogUGFsZXR0ZUl0ZW1bXSA9IEFycmF5LmZyb20oXG5cdFx0XHR4bWxEb2MucXVlcnlTZWxlY3RvckFsbCgnUGFsZXR0ZUl0ZW0nKVxuXHRcdCkubWFwKGl0ZW0gPT4ge1xuXHRcdFx0Y29uc3QgaWQgPSBpdGVtLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCAndW5rbm93bic7XG5cblx0XHRcdC8vIHBhcnNlIGVhY2ggY29sb3IgcHJvcGVydHlcblx0XHRcdGNvbnN0IGNvbG9ycyA9IHtcblx0XHRcdFx0Y215azogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoXG5cdFx0XHRcdFx0aXRlbS5xdWVyeVNlbGVjdG9yKCdDTVlLJyk/LnRleHRDb250ZW50IHx8ICcnXG5cdFx0XHRcdClcblx0XHRcdFx0XHQ/IHBhcnNlQXNDb2xvclZhbHVlLmNteWsoXG5cdFx0XHRcdFx0XHRcdGl0ZW0ucXVlcnlTZWxlY3RvcignQ01ZSycpPy50ZXh0Q29udGVudCB8fCAnJ1xuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdDogZGVmYXVsdENvbG9yVmFsdWVzLmNteWssXG5cdFx0XHRcdGhleDogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoXG5cdFx0XHRcdFx0aXRlbS5xdWVyeVNlbGVjdG9yKCdIZXgnKT8udGV4dENvbnRlbnQgfHwgJydcblx0XHRcdFx0KVxuXHRcdFx0XHRcdD8gcGFyc2VBc0NvbG9yVmFsdWUuaGV4KFxuXHRcdFx0XHRcdFx0XHRpdGVtLnF1ZXJ5U2VsZWN0b3IoJ0hleCcpPy50ZXh0Q29udGVudCB8fCAnJ1xuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdDogZGVmYXVsdENvbG9yVmFsdWVzLmhleCxcblx0XHRcdFx0aHNsOiBndWFyZHMuaXNDb2xvclN0cmluZyhcblx0XHRcdFx0XHRpdGVtLnF1ZXJ5U2VsZWN0b3IoJ0hTTCcpPy50ZXh0Q29udGVudCB8fCAnJ1xuXHRcdFx0XHQpXG5cdFx0XHRcdFx0PyBwYXJzZUFzQ29sb3JWYWx1ZS5oc2woXG5cdFx0XHRcdFx0XHRcdGl0ZW0ucXVlcnlTZWxlY3RvcignSFNMJyk/LnRleHRDb250ZW50IHx8ICcnXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0OiBkZWZhdWx0Q29sb3JWYWx1ZXMuaHNsLFxuXHRcdFx0XHRoc3Y6IGd1YXJkcy5pc0NvbG9yU3RyaW5nKFxuXHRcdFx0XHRcdGl0ZW0ucXVlcnlTZWxlY3RvcignSFNWJyk/LnRleHRDb250ZW50IHx8ICcnXG5cdFx0XHRcdClcblx0XHRcdFx0XHQ/IHBhcnNlQXNDb2xvclZhbHVlLmhzdihcblx0XHRcdFx0XHRcdFx0aXRlbS5xdWVyeVNlbGVjdG9yKCdIU1YnKT8udGV4dENvbnRlbnQgfHwgJydcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQ6IGRlZmF1bHRDb2xvclZhbHVlcy5oc3YsXG5cdFx0XHRcdGxhYjogZ3VhcmRzLmlzQ29sb3JTdHJpbmcoXG5cdFx0XHRcdFx0aXRlbS5xdWVyeVNlbGVjdG9yKCdMQUInKT8udGV4dENvbnRlbnQgfHwgJydcblx0XHRcdFx0KVxuXHRcdFx0XHRcdD8gcGFyc2VBc0NvbG9yVmFsdWUubGFiKFxuXHRcdFx0XHRcdFx0XHRpdGVtLnF1ZXJ5U2VsZWN0b3IoJ0xBQicpPy50ZXh0Q29udGVudCB8fCAnJ1xuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdDogZGVmYXVsdENvbG9yVmFsdWVzLmxhYixcblx0XHRcdFx0cmdiOiBndWFyZHMuaXNDb2xvclN0cmluZyhcblx0XHRcdFx0XHRpdGVtLnF1ZXJ5U2VsZWN0b3IoJ1JHQicpPy50ZXh0Q29udGVudCB8fCAnJ1xuXHRcdFx0XHQpXG5cdFx0XHRcdFx0PyBwYXJzZUFzQ29sb3JWYWx1ZS5yZ2IoXG5cdFx0XHRcdFx0XHRcdGl0ZW0ucXVlcnlTZWxlY3RvcignUkdCJyk/LnRleHRDb250ZW50IHx8ICcnXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0OiBkZWZhdWx0Q29sb3JWYWx1ZXMucmdiLFxuXHRcdFx0XHR4eXo6IGd1YXJkcy5pc0NvbG9yU3RyaW5nKFxuXHRcdFx0XHRcdGl0ZW0ucXVlcnlTZWxlY3RvcignWFlaJyk/LnRleHRDb250ZW50IHx8ICcnXG5cdFx0XHRcdClcblx0XHRcdFx0XHQ/IHBhcnNlQXNDb2xvclZhbHVlLnh5eihcblx0XHRcdFx0XHRcdFx0aXRlbS5xdWVyeVNlbGVjdG9yKCdYWVonKT8udGV4dENvbnRlbnQgfHwgJydcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQ6IGRlZmF1bHRDb2xvclZhbHVlcy54eXpcblx0XHRcdH07XG5cdFx0XHRjb25zdCBjbXlrQ29sb3JTdHJpbmcgPSBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBjb2xvcnMuY215ayxcblx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdH0pLnZhbHVlIGFzIENNWUtWYWx1ZVN0cmluZztcblx0XHRcdGNvbnN0IGNteWtDU1NDb2xvclN0cmluZyA9IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IGNvbG9ycy5jbXlrLFxuXHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBoZXhDb2xvclN0cmluZyA9IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IGNvbG9ycy5oZXgsXG5cdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdH0pLnZhbHVlIGFzIEhleFZhbHVlU3RyaW5nO1xuXHRcdFx0Y29uc3QgaGV4Q1NTQ29sb3JTdHJpbmcgPSBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBjb2xvcnMuaGV4LFxuXHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IGhzbENvbG9yU3RyaW5nID0gY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHR2YWx1ZTogY29sb3JzLmhzbCxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fSkudmFsdWUgYXMgSFNMVmFsdWVTdHJpbmc7XG5cdFx0XHRjb25zdCBoc2xDU1NDb2xvclN0cmluZyA9IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IGNvbG9ycy5oc2wsXG5cdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgaHN2Q29sb3JTdHJpbmcgPSBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBjb2xvcnMuaHN2LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHR9KS52YWx1ZSBhcyBIU1ZWYWx1ZVN0cmluZztcblx0XHRcdGNvbnN0IGhzdkNTU0NvbG9yU3RyaW5nID0gY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHR2YWx1ZTogY29sb3JzLmhzdixcblx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBsYWJDb2xvclN0cmluZyA9IGNvbnZlcnRUb0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IGNvbG9ycy5sYWIsXG5cdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdH0pLnZhbHVlIGFzIExBQlZhbHVlU3RyaW5nO1xuXHRcdFx0Y29uc3QgbGFiQ1NTQ29sb3JTdHJpbmcgPSBjb252ZXJ0VG9DU1NDb2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBjb2xvcnMubGFiLFxuXHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IHJnYkNvbG9yU3RyaW5nID0gY29udmVydFRvQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHR2YWx1ZTogY29sb3JzLnJnYixcblx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0fSkudmFsdWUgYXMgUkdCVmFsdWVTdHJpbmc7XG5cdFx0XHRjb25zdCByZ2JDU1NDb2xvclN0cmluZyA9IGNvbnZlcnRUb0NTU0NvbG9yU3RyaW5nKHtcblx0XHRcdFx0dmFsdWU6IGNvbG9ycy5yZ2IsXG5cdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgeHl6Q29sb3JTdHJpbmcgPSBjb252ZXJ0VG9Db2xvclN0cmluZyh7XG5cdFx0XHRcdHZhbHVlOiBjb2xvcnMueHl6LFxuXHRcdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0XHR9KS52YWx1ZSBhcyBYWVpWYWx1ZVN0cmluZztcblx0XHRcdGNvbnN0IHh5ekNTU0NvbG9yU3RyaW5nID0gY29udmVydFRvQ1NTQ29sb3JTdHJpbmcoe1xuXHRcdFx0XHR2YWx1ZTogY29sb3JzLnh5eixcblx0XHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBjb2xvclN0cmluZ3MgPSB7XG5cdFx0XHRcdGNteWtTdHJpbmc6IGNteWtDb2xvclN0cmluZyxcblx0XHRcdFx0aGV4U3RyaW5nOiBoZXhDb2xvclN0cmluZyxcblx0XHRcdFx0aHNsU3RyaW5nOiBoc2xDb2xvclN0cmluZyxcblx0XHRcdFx0aHN2U3RyaW5nOiBoc3ZDb2xvclN0cmluZyxcblx0XHRcdFx0bGFiU3RyaW5nOiBsYWJDb2xvclN0cmluZyxcblx0XHRcdFx0cmdiU3RyaW5nOiByZ2JDb2xvclN0cmluZyxcblx0XHRcdFx0eHl6U3RyaW5nOiB4eXpDb2xvclN0cmluZ1xuXHRcdFx0fTtcblx0XHRcdGNvbnN0IGNzc1N0cmluZ3MgPSB7XG5cdFx0XHRcdGNteWtDU1NTdHJpbmc6IGNteWtDU1NDb2xvclN0cmluZyxcblx0XHRcdFx0aGV4Q1NTU3RyaW5nOiBoZXhDU1NDb2xvclN0cmluZyxcblx0XHRcdFx0aHNsQ1NTU3RyaW5nOiBoc2xDU1NDb2xvclN0cmluZyxcblx0XHRcdFx0aHN2Q1NTU3RyaW5nOiBoc3ZDU1NDb2xvclN0cmluZyxcblx0XHRcdFx0bGFiQ1NTU3RyaW5nOiBsYWJDU1NDb2xvclN0cmluZyxcblx0XHRcdFx0cmdiQ1NTU3RyaW5nOiByZ2JDU1NDb2xvclN0cmluZyxcblx0XHRcdFx0eHl6Q1NTU3RyaW5nOiB4eXpDU1NDb2xvclN0cmluZ1xuXHRcdFx0fTtcblxuXHRcdFx0Ly8gZ2VuZXJhdGUgY29sb3Igc3RyaW5ncyBhbmQgQ1NTIHN0cmluZ3Ncblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGlkLFxuXHRcdFx0XHRjb2xvcnMsXG5cdFx0XHRcdGNvbG9yU3RyaW5ncyxcblx0XHRcdFx0Y3NzU3RyaW5nc1xuXHRcdFx0fTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoaXRlbXMpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHBhcnNpbmcgWE1MIHBhbGV0dGUgaXRlbXM6JywgZXJyb3IpO1xuXG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IHhtbCA9IHtcblx0ZmxhZ3MsXG5cdHBhbGV0dGVJdGVtc1xufTtcbiJdfQ==