// File: core/utils/partials/color/brand.ts
import { defaults } from '../../../../config/index.js';
const defaultColors = defaults.colors;
export function colorBrandingUtilitiesFactory(brand, helpers, services) {
    const { data: { clone, parseValue } } = helpers;
    const { errors, log } = services;
    function brandColorString(color) {
        return errors.handleSync(() => {
            const clonedColor = clone(color);
            const newValue = Object.entries(clonedColor.value).reduce((acc, [key, val]) => {
                acc[key] =
                    parseValue(val);
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
                    log.error('Unsupported format for colorStringToColor', 'utils.color.brandColorString');
                    const unbrandedHSL = defaultColors.hsl;
                    const brandedHue = brand.asRadial(unbrandedHSL.value.hue);
                    const brandedSaturation = brand.asPercentile(unbrandedHSL.value.saturation);
                    const brandedLightness = brand.asPercentile(unbrandedHSL.value.lightness);
                    return {
                        value: {
                            hue: brandedHue,
                            saturation: brandedSaturation,
                            lightness: brandedLightness
                        },
                        format: 'hsl'
                    };
            }
        }, 'Error occurred while branding color string map value.');
    }
    function brandCMYKString(cmyk) {
        return errors.handleSync(() => {
            return {
                cyan: brand.asPercentile(parseFloat(cmyk.cyan) / 100),
                magenta: brand.asPercentile(parseFloat(cmyk.magenta) / 100),
                yellow: brand.asPercentile(parseFloat(cmyk.yellow) / 100),
                key: brand.asPercentile(parseFloat(cmyk.key) / 100)
            };
        }, 'Error occurred while branding CMYK string.');
    }
    function brandHexString(hex) {
        return errors.handleSync(() => {
            return { hex: brand.asHexSet(hex.hex) };
        }, 'Error occurred while branding hex string.');
    }
    function brandHSLString(hsl) {
        return errors.handleSync(() => {
            return {
                hue: brand.asRadial(parseFloat(hsl.hue)),
                saturation: brand.asPercentile(parseFloat(hsl.saturation) / 100),
                lightness: brand.asPercentile(parseFloat(hsl.lightness) / 100)
            };
        }, 'Error occurred while branding HSL string.');
    }
    function brandHSVString(hsv) {
        return errors.handleSync(() => {
            return {
                hue: brand.asRadial(parseFloat(hsv.hue)),
                saturation: brand.asPercentile(parseFloat(hsv.saturation) / 100),
                value: brand.asPercentile(parseFloat(hsv.value) / 100)
            };
        }, 'Error occurred while branding HSV string.');
    }
    function brandLABString(lab) {
        return errors.handleSync(() => {
            return {
                l: brand.asLAB_L(parseFloat(lab.l)),
                a: brand.asLAB_A(parseFloat(lab.a)),
                b: brand.asLAB_B(parseFloat(lab.b))
            };
        }, 'Error occurred while branding LAB string.');
    }
    function brandRGBString(rgb) {
        return errors.handleSync(() => {
            return {
                red: brand.asByteRange(parseFloat(rgb.red)),
                green: brand.asByteRange(parseFloat(rgb.green)),
                blue: brand.asByteRange(parseFloat(rgb.blue))
            };
        }, 'Error occurred while branding RGB string.');
    }
    function brandXYZString(xyz) {
        return errors.handleSync(() => {
            return {
                x: brand.asXYZ_X(parseFloat(xyz.x)),
                y: brand.asXYZ_Y(parseFloat(xyz.y)),
                z: brand.asXYZ_Z(parseFloat(xyz.z))
            };
        }, 'Error occurred while branding XYZ string.');
    }
    const colorBrandingUtilities = {
        brandCMYKString,
        brandColorString,
        brandHexString,
        brandHSLString,
        brandHSVString,
        brandLABString,
        brandRGBString,
        brandXYZString
    };
    return errors.handleSync(() => colorBrandingUtilities, 'Error creating color branding utilities sub-group.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJhbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY29yZS91dGlscy9wYXJ0aWFscy9jb2xvci9icmFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyQ0FBMkM7QUEwQjNDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUV2RCxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBRXRDLE1BQU0sVUFBVSw2QkFBNkIsQ0FDNUMsS0FBd0IsRUFBRSxPQUFnQixFQUFFLFFBQWtCO0lBRTlELE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsR0FBRyxPQUFPLENBQUM7SUFDaEQsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxRQUFRLENBQUM7SUFFakMsU0FBUyxnQkFBZ0IsQ0FBQyxLQUFxQjtRQUM5QyxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQzdCLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVqQyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQ3hELENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUU7Z0JBQ25CLEdBQUcsQ0FBQyxHQUEwQyxDQUFDO29CQUM5QyxVQUFVLENBQUMsR0FBRyxDQUFVLENBQUM7Z0JBRTFCLE9BQU8sR0FBRyxDQUFDO1lBQ1osQ0FBQyxFQUNELEVBQXlELENBQ3pELENBQUM7WUFFRixRQUFRLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDNUIsS0FBSyxNQUFNO29CQUNWLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUF5QixFQUFFLENBQUM7Z0JBQzdELEtBQUss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QUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQyxLQUFLLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzdDLENBQUM7UUFDSCxDQUFDLEVBQUUsMkNBQTJDLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsU0FBUyxjQUFjLENBQUMsR0FBMEI7UUFDakQsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUM3QixPQUFPO2dCQUNOLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbkMsQ0FBQztRQUNILENBQUMsRUFBRSwyQ0FBMkMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxNQUFNLHNCQUFzQixHQUF3QjtRQUNuRCxlQUFlO1FBQ2YsZ0JBQWdCO1FBQ2hCLGNBQWM7UUFDZCxjQUFjO1FBQ2QsY0FBYztRQUNkLGNBQWM7UUFDZCxjQUFjO1FBQ2QsY0FBYztLQUNkLENBQUM7SUFFRixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsc0JBQXNCLEVBQUUsb0RBQW9ELENBQUMsQ0FBQztBQUM5RyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogY29yZS91dGlscy9wYXJ0aWFscy9jb2xvci9icmFuZC50c1xuXG5pbXBvcnQge1xuXHRCcmFuZGluZ1V0aWxpdGllcyxcblx0Q01ZSyxcblx0Q01ZS1N0cmluZ01hcCxcblx0Q29sb3IsXG5cdENvbG9yQnJhbmRVdGlsaXRpZXMsXG5cdENvbG9yU3RyaW5nTWFwLFxuXHRIZWxwZXJzLFxuXHRIZXgsXG5cdEhleFN0cmluZ01hcCxcblx0SFNMLFxuXHRIU0xTdHJpbmdNYXAsXG5cdEhTVixcblx0SFNWU3RyaW5nTWFwLFxuXHRMQUIsXG5cdExBQlN0cmluZ01hcCxcblx0UkdCLFxuXHRSR0JTdHJpbmdNYXAsXG5cdFNlcnZpY2VzLFxuXHRTTCxcblx0U1YsXG5cdFhZWixcblx0WFlaU3RyaW5nTWFwXG59IGZyb20gJy4uLy4uLy4uLy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGRlZmF1bHRzIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29uZmlnL2luZGV4LmpzJztcblxuY29uc3QgZGVmYXVsdENvbG9ycyA9IGRlZmF1bHRzLmNvbG9ycztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbG9yQnJhbmRpbmdVdGlsaXRpZXNGYWN0b3J5KFxuXHRicmFuZDogQnJhbmRpbmdVdGlsaXRpZXMsIGhlbHBlcnM6IEhlbHBlcnMsIHNlcnZpY2VzOiBTZXJ2aWNlc1xuKTogQ29sb3JCcmFuZFV0aWxpdGllcyB7XG5cdGNvbnN0IHsgZGF0YTogeyBjbG9uZSwgcGFyc2VWYWx1ZSB9IH0gPSBoZWxwZXJzO1xuXHRjb25zdCB7IGVycm9ycywgbG9nIH0gPSBzZXJ2aWNlcztcblxuXHRmdW5jdGlvbiBicmFuZENvbG9yU3RyaW5nKGNvbG9yOiBDb2xvclN0cmluZ01hcCk6IENvbG9yIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0Y29uc3QgY2xvbmVkQ29sb3IgPSBjbG9uZShjb2xvcik7XG5cblx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gT2JqZWN0LmVudHJpZXMoY2xvbmVkQ29sb3IudmFsdWUpLnJlZHVjZShcblx0XHRcdFx0KGFjYywgW2tleSwgdmFsXSkgPT4ge1xuXHRcdFx0XHRcdGFjY1trZXkgYXMga2V5b2YgKHR5cGVvZiBjbG9uZWRDb2xvcilbJ3ZhbHVlJ11dID1cblx0XHRcdFx0XHRcdHBhcnNlVmFsdWUodmFsKSBhcyBuZXZlcjtcblxuXHRcdFx0XHRcdHJldHVybiBhY2M7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHt9IGFzIFJlY29yZDxrZXlvZiAodHlwZW9mIGNsb25lZENvbG9yKVsndmFsdWUnXSwgbnVtYmVyPlxuXHRcdFx0KTtcblxuXHRcdFx0c3dpdGNoIChjbG9uZWRDb2xvci5mb3JtYXQpIHtcblx0XHRcdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnY215aycsIHZhbHVlOiBuZXdWYWx1ZSBhcyBDTVlLWyd2YWx1ZSddIH07XG5cdFx0XHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRcdFx0cmV0dXJuIHsgZm9ybWF0OiAnaHNsJywgdmFsdWU6IG5ld1ZhbHVlIGFzIEhTTFsndmFsdWUnXSB9O1xuXHRcdFx0XHRjYXNlICdoc3YnOlxuXHRcdFx0XHRcdHJldHVybiB7IGZvcm1hdDogJ2hzdicsIHZhbHVlOiBuZXdWYWx1ZSBhcyBIU1ZbJ3ZhbHVlJ10gfTtcblx0XHRcdFx0Y2FzZSAnc2wnOlxuXHRcdFx0XHRcdHJldHVybiB7IGZvcm1hdDogJ3NsJywgdmFsdWU6IG5ld1ZhbHVlIGFzIFNMWyd2YWx1ZSddIH07XG5cdFx0XHRcdGNhc2UgJ3N2Jzpcblx0XHRcdFx0XHRyZXR1cm4geyBmb3JtYXQ6ICdzdicsIHZhbHVlOiBuZXdWYWx1ZSBhcyBTVlsndmFsdWUnXSB9O1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGxvZy5lcnJvcihcblx0XHRcdFx0XHRcdCdVbnN1cHBvcnRlZCBmb3JtYXQgZm9yIGNvbG9yU3RyaW5nVG9Db2xvcicsXG5cdFx0XHRcdFx0XHQndXRpbHMuY29sb3IuYnJhbmRDb2xvclN0cmluZycsXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdGNvbnN0IHVuYnJhbmRlZEhTTCA9IGRlZmF1bHRDb2xvcnMuaHNsO1xuXG5cdFx0XHRcdFx0Y29uc3QgYnJhbmRlZEh1ZSA9IGJyYW5kLmFzUmFkaWFsKFxuXHRcdFx0XHRcdFx0dW5icmFuZGVkSFNMLnZhbHVlLmh1ZVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0Y29uc3QgYnJhbmRlZFNhdHVyYXRpb24gPSBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHR1bmJyYW5kZWRIU0wudmFsdWUuc2F0dXJhdGlvblxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0Y29uc3QgYnJhbmRlZExpZ2h0bmVzcyA9IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdHVuYnJhbmRlZEhTTC52YWx1ZS5saWdodG5lc3Ncblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdGh1ZTogYnJhbmRlZEh1ZSxcblx0XHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmRlZFNhdHVyYXRpb24sXG5cdFx0XHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmRlZExpZ2h0bmVzc1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBicmFuZGluZyBjb2xvciBzdHJpbmcgbWFwIHZhbHVlLicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYnJhbmRDTVlLU3RyaW5nKFxuXHRcdGNteWs6IENNWUtTdHJpbmdNYXBbJ3ZhbHVlJ11cblx0KTogQ01ZS1sndmFsdWUnXSB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGN5YW46IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUZsb2F0KGNteWsuY3lhbikgLyAxMDApLFxuXHRcdFx0XHRtYWdlbnRhOiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VGbG9hdChjbXlrLm1hZ2VudGEpIC8gMTAwKSxcblx0XHRcdFx0eWVsbG93OiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VGbG9hdChjbXlrLnllbGxvdykgLyAxMDApLFxuXHRcdFx0XHRrZXk6IGJyYW5kLmFzUGVyY2VudGlsZShwYXJzZUZsb2F0KGNteWsua2V5KSAvIDEwMClcblx0XHRcdH07XG5cdFx0fSwgJ0Vycm9yIG9jY3VycmVkIHdoaWxlIGJyYW5kaW5nIENNWUsgc3RyaW5nLicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYnJhbmRIZXhTdHJpbmcoaGV4OiBIZXhTdHJpbmdNYXBbJ3ZhbHVlJ10pOiBIZXhbJ3ZhbHVlJ10ge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRyZXR1cm4geyBoZXg6IGJyYW5kLmFzSGV4U2V0KGhleC5oZXgpIH07XG5cdFx0fSwgJ0Vycm9yIG9jY3VycmVkIHdoaWxlIGJyYW5kaW5nIGhleCBzdHJpbmcuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBicmFuZEhTTFN0cmluZyhcblx0XHRoc2w6IEhTTFN0cmluZ01hcFsndmFsdWUnXVxuXHQpOiBIU0xbJ3ZhbHVlJ10ge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKHBhcnNlRmxvYXQoaHNsLmh1ZSkpLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0cGFyc2VGbG9hdChoc2wuc2F0dXJhdGlvbikgLyAxMDBcblx0XHRcdFx0KSxcblx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0cGFyc2VGbG9hdChoc2wubGlnaHRuZXNzKSAvIDEwMFxuXHRcdFx0XHQpXG5cdFx0XHR9O1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBicmFuZGluZyBIU0wgc3RyaW5nLicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYnJhbmRIU1ZTdHJpbmcoXG5cdFx0aHN2OiBIU1ZTdHJpbmdNYXBbJ3ZhbHVlJ11cblx0KTogSFNWWyd2YWx1ZSddIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChwYXJzZUZsb2F0KGhzdi5odWUpKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdHBhcnNlRmxvYXQoaHN2LnNhdHVyYXRpb24pIC8gMTAwXG5cdFx0XHRcdCksXG5cdFx0XHRcdHZhbHVlOiBicmFuZC5hc1BlcmNlbnRpbGUocGFyc2VGbG9hdChoc3YudmFsdWUpIC8gMTAwKVxuXHRcdFx0fTtcblx0XHR9LCAnRXJyb3Igb2NjdXJyZWQgd2hpbGUgYnJhbmRpbmcgSFNWIHN0cmluZy4nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGJyYW5kTEFCU3RyaW5nKFxuXHRcdGxhYjogTEFCU3RyaW5nTWFwWyd2YWx1ZSddXG5cdCk6IExBQlsndmFsdWUnXSB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGw6IGJyYW5kLmFzTEFCX0wocGFyc2VGbG9hdChsYWIubCkpLFxuXHRcdFx0XHRhOiBicmFuZC5hc0xBQl9BKHBhcnNlRmxvYXQobGFiLmEpKSxcblx0XHRcdFx0YjogYnJhbmQuYXNMQUJfQihwYXJzZUZsb2F0KGxhYi5iKSlcblx0XHRcdH07XG5cdFx0fSwgJ0Vycm9yIG9jY3VycmVkIHdoaWxlIGJyYW5kaW5nIExBQiBzdHJpbmcuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBicmFuZFJHQlN0cmluZyhcblx0XHRyZ2I6IFJHQlN0cmluZ01hcFsndmFsdWUnXVxuXHQpOiBSR0JbJ3ZhbHVlJ10ge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKHBhcnNlRmxvYXQocmdiLnJlZCkpLFxuXHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UocGFyc2VGbG9hdChyZ2IuZ3JlZW4pKSxcblx0XHRcdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2UocGFyc2VGbG9hdChyZ2IuYmx1ZSkpXG5cdFx0XHR9O1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBicmFuZGluZyBSR0Igc3RyaW5nLicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYnJhbmRYWVpTdHJpbmcoeHl6OiBYWVpTdHJpbmdNYXBbJ3ZhbHVlJ10pOiBYWVpbJ3ZhbHVlJ10ge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR4OiBicmFuZC5hc1hZWl9YKHBhcnNlRmxvYXQoeHl6LngpKSxcblx0XHRcdFx0eTogYnJhbmQuYXNYWVpfWShwYXJzZUZsb2F0KHh5ei55KSksXG5cdFx0XHRcdHo6IGJyYW5kLmFzWFlaX1oocGFyc2VGbG9hdCh4eXoueikpXG5cdFx0XHR9O1xuXHRcdH0sICdFcnJvciBvY2N1cnJlZCB3aGlsZSBicmFuZGluZyBYWVogc3RyaW5nLicpO1xuXHR9XG5cblx0Y29uc3QgY29sb3JCcmFuZGluZ1V0aWxpdGllczogQ29sb3JCcmFuZFV0aWxpdGllcyA9IHtcblx0XHRicmFuZENNWUtTdHJpbmcsXG5cdFx0YnJhbmRDb2xvclN0cmluZyxcblx0XHRicmFuZEhleFN0cmluZyxcblx0XHRicmFuZEhTTFN0cmluZyxcblx0XHRicmFuZEhTVlN0cmluZyxcblx0XHRicmFuZExBQlN0cmluZyxcblx0XHRicmFuZFJHQlN0cmluZyxcblx0XHRicmFuZFhZWlN0cmluZ1xuXHR9O1xuXG5cdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiBjb2xvckJyYW5kaW5nVXRpbGl0aWVzLCAnRXJyb3IgY3JlYXRpbmcgY29sb3IgYnJhbmRpbmcgdXRpbGl0aWVzIHN1Yi1ncm91cC4nKTtcbn1cbiJdfQ==