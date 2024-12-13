// File: src/common/transform/base.js
import { brand } from '../core/base.js';
import { mode } from '../../data/mode/index.js';
function addHashToHex(hex) {
    try {
        return hex.value.hex.startsWith('#')
            ? hex
            : {
                value: {
                    hex: brand.asHexSet(`#${hex.value}}`),
                    alpha: brand.asHexComponent(`#$hex.value.alpha`),
                    numAlpha: brand.asAlphaRange(hex.value.numAlpha)
                },
                format: 'hex'
            };
    }
    catch (error) {
        throw new Error(`addHashToHex error: ${error}`);
    }
}
function brandPalette(data) {
    return {
        ...data,
        metadata: {
            ...data.metadata,
            customColor: {
                hslColor: {
                    ...(data.metadata.customColor?.hslColor ?? {
                        value: {
                            hue: 0,
                            saturation: 0,
                            lightness: 0,
                            alpha: 1
                        },
                        format: 'hsl'
                    }),
                    value: {
                        hue: brand.asRadial(data.metadata.customColor?.hslColor?.value.hue ?? 0),
                        saturation: brand.asPercentile(data.metadata.customColor?.hslColor?.value
                            .saturation ?? 0),
                        lightness: brand.asPercentile(data.metadata.customColor?.hslColor?.value
                            .lightness ?? 0),
                        alpha: brand.asAlphaRange(data.metadata.customColor?.hslColor?.value.alpha ??
                            1)
                    }
                },
                convertedColors: {
                    cmyk: {
                        cyan: brand.asPercentile(data.metadata.customColor?.convertedColors?.cmyk
                            .cyan ?? 0),
                        magenta: brand.asPercentile(data.metadata.customColor?.convertedColors?.cmyk
                            .magenta ?? 0),
                        yellow: brand.asPercentile(data.metadata.customColor?.convertedColors?.cmyk
                            .yellow ?? 0),
                        key: brand.asPercentile(data.metadata.customColor?.convertedColors?.cmyk
                            .key ?? 0),
                        alpha: brand.asAlphaRange(data.metadata.customColor?.convertedColors?.cmyk
                            .alpha ?? 1)
                    },
                    hex: {
                        hex: brand.asHexSet(data.metadata.customColor?.convertedColors?.hex
                            .hex ?? '#000000FF'),
                        alpha: brand.asHexComponent(data.metadata.customColor?.convertedColors?.hex
                            .alpha ?? 'FF'),
                        numAlpha: brand.asAlphaRange(data.metadata.customColor?.convertedColors?.hex
                            .numAlpha ?? 1)
                    },
                    hsl: {
                        hue: brand.asRadial(data.metadata.customColor?.convertedColors?.hsl
                            .hue ?? 0),
                        saturation: brand.asPercentile(data.metadata.customColor?.convertedColors?.hsl
                            .saturation ?? 0),
                        lightness: brand.asPercentile(data.metadata.customColor?.convertedColors?.hsl
                            .lightness ?? 0),
                        alpha: brand.asAlphaRange(data.metadata.customColor?.convertedColors?.hsl
                            .alpha ?? 1)
                    },
                    hsv: {
                        hue: brand.asRadial(data.metadata.customColor?.convertedColors?.hsv
                            .hue ?? 0),
                        saturation: brand.asPercentile(data.metadata.customColor?.convertedColors?.hsv
                            .saturation ?? 0),
                        value: brand.asPercentile(data.metadata.customColor?.convertedColors?.hsv
                            .value ?? 0),
                        alpha: brand.asAlphaRange(data.metadata.customColor?.convertedColors?.hsv
                            .alpha ?? 1)
                    },
                    lab: {
                        l: brand.asLAB_L(data.metadata.customColor?.convertedColors?.lab.l ??
                            0),
                        a: brand.asLAB_A(data.metadata.customColor?.convertedColors?.lab.a ??
                            0),
                        b: brand.asLAB_B(data.metadata.customColor?.convertedColors?.lab.b ??
                            0),
                        alpha: brand.asAlphaRange(data.metadata.customColor?.convertedColors?.lab
                            .alpha ?? 1)
                    },
                    rgb: {
                        red: brand.asByteRange(data.metadata.customColor?.convertedColors?.rgb
                            .red ?? 0),
                        green: brand.asByteRange(data.metadata.customColor?.convertedColors?.rgb
                            .green ?? 0),
                        blue: brand.asByteRange(data.metadata.customColor?.convertedColors?.rgb
                            .blue ?? 0),
                        alpha: brand.asAlphaRange(data.metadata.customColor?.convertedColors?.rgb
                            .alpha ?? 1)
                    },
                    xyz: {
                        x: brand.asXYZ_X(data.metadata.customColor?.convertedColors?.xyz.x ??
                            0),
                        y: brand.asXYZ_Y(data.metadata.customColor?.convertedColors?.xyz.y ??
                            0),
                        z: brand.asXYZ_Z(data.metadata.customColor?.convertedColors?.xyz.z ??
                            0),
                        alpha: brand.asAlphaRange(data.metadata.customColor?.convertedColors?.xyz
                            .alpha ?? 1)
                    }
                }
            }
        }
    };
}
function componentToHex(component) {
    try {
        const hex = Math.max(0, Math.min(255, component)).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
    catch (error) {
        if (!mode.quiet)
            console.error(`componentToHex error: ${error}`);
        return '00';
    }
}
function defaultColorValue(color) {
    switch (color.format) {
        case 'cmyk':
            return {
                value: {
                    cyan: brand.asPercentile(0),
                    magenta: brand.asPercentile(0),
                    yellow: brand.asPercentile(0),
                    key: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'cmyk'
            };
        case 'hex':
            return {
                value: {
                    hex: brand.asHexSet('#000000'),
                    alpha: brand.asHexComponent('FF'),
                    numAlpha: brand.asAlphaRange(1)
                },
                format: 'hex'
            };
        case 'hsl':
            return {
                value: {
                    hue: brand.asRadial(0),
                    saturation: brand.asPercentile(0),
                    lightness: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'hsl'
            };
        case 'hsv':
            return {
                value: {
                    hue: brand.asRadial(0),
                    saturation: brand.asPercentile(0),
                    value: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'hsv'
            };
        case 'lab':
            return {
                value: {
                    l: brand.asLAB_L(0),
                    a: brand.asLAB_A(0),
                    b: brand.asLAB_B(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'lab'
            };
        case 'rgb':
            return {
                value: {
                    red: brand.asByteRange(0),
                    green: brand.asByteRange(0),
                    blue: brand.asByteRange(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'rgb'
            };
        case 'sl':
            return {
                value: {
                    saturation: brand.asPercentile(0),
                    lightness: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'sl'
            };
        case 'sv':
            return {
                value: {
                    saturation: brand.asPercentile(0),
                    value: brand.asPercentile(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'sv'
            };
        case 'xyz':
            return {
                value: {
                    x: brand.asXYZ_X(0),
                    y: brand.asXYZ_Y(0),
                    z: brand.asXYZ_Z(0),
                    alpha: brand.asAlphaRange(1)
                },
                format: 'xyz'
            };
        default:
            throw new Error(`
				Unknown color format\nDetails: ${JSON.stringify(color)}`);
    }
}
export const base = {
    addHashToHex,
    componentToHex,
    brandPalette,
    defaultColorValue
};
export { componentToHex };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vdHJhbnNmb3JtL2Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUNBQXFDO0FBVXJDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN4QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFaEQsU0FBUyxZQUFZLENBQUMsR0FBUTtJQUM3QixJQUFJLENBQUM7UUFDSixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7WUFDbkMsQ0FBQyxDQUFDLEdBQUc7WUFDTCxDQUFDLENBQUM7Z0JBQ0EsS0FBSyxFQUFFO29CQUNOLEdBQUcsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDO29CQUNyQyxLQUFLLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQztvQkFDaEQsUUFBUSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7aUJBQ2hEO2dCQUNELE1BQU0sRUFBRSxLQUFjO2FBQ3RCLENBQUM7SUFDTCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELENBQUM7QUFDRixDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsSUFBc0I7SUFDM0MsT0FBTztRQUNOLEdBQUcsSUFBSTtRQUNQLFFBQVEsRUFBRTtZQUNULEdBQUcsSUFBSSxDQUFDLFFBQVE7WUFDaEIsV0FBVyxFQUFFO2dCQUNaLFFBQVEsRUFBRTtvQkFDVCxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsUUFBUSxJQUFJO3dCQUMxQyxLQUFLLEVB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LENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztpQkFDNUI7Z0JBQ0QsTUFBTSxFQUFFLElBQUk7YUFDWixDQUFDO1FBQ0gsS0FBSyxLQUFLO1lBQ1QsT0FBTztnQkFDTixLQUFLLEVBQUU7b0JBQ04sQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNuQixDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ25CLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsS0FBSyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUM1QjtnQkFDRCxNQUFNLEVBQUUsS0FBSzthQUNiLENBQUM7UUFDSDtZQUNDLE1BQU0sSUFBSSxLQUFLLENBQUM7cUNBQ2tCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzdELENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUEwQjtJQUMxQyxZQUFZO0lBQ1osY0FBYztJQUNkLFlBQVk7SUFDWixpQkFBaUI7Q0FDakIsQ0FBQztBQUVGLE9BQU8sRUFBRSxjQUFjLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9jb21tb24vdHJhbnNmb3JtL2Jhc2UuanNcblxuaW1wb3J0IHtcblx0Q29sb3IsXG5cdENvbG9yVW5icmFuZGVkLFxuXHRDb21tb25UcmFuc2Zvcm1GbkJhc2UsXG5cdEhleCxcblx0UGFsZXR0ZSxcblx0UGFsZXR0ZVVuYnJhbmRlZFxufSBmcm9tICcuLi8uLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBicmFuZCB9IGZyb20gJy4uL2NvcmUvYmFzZS5qcyc7XG5pbXBvcnQgeyBtb2RlIH0gZnJvbSAnLi4vLi4vZGF0YS9tb2RlL2luZGV4LmpzJztcblxuZnVuY3Rpb24gYWRkSGFzaFRvSGV4KGhleDogSGV4KTogSGV4IHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gaGV4LnZhbHVlLmhleC5zdGFydHNXaXRoKCcjJylcblx0XHRcdD8gaGV4XG5cdFx0XHQ6IHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldChgIyR7aGV4LnZhbHVlfX1gKSxcblx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0hleENvbXBvbmVudChgIyRoZXgudmFsdWUuYWxwaGFgKSxcblx0XHRcdFx0XHRcdG51bUFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoaGV4LnZhbHVlLm51bUFscGhhKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4JyBhcyAnaGV4J1xuXHRcdFx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgYWRkSGFzaFRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGJyYW5kUGFsZXR0ZShkYXRhOiBQYWxldHRlVW5icmFuZGVkKTogUGFsZXR0ZSB7XG5cdHJldHVybiB7XG5cdFx0Li4uZGF0YSxcblx0XHRtZXRhZGF0YToge1xuXHRcdFx0Li4uZGF0YS5tZXRhZGF0YSxcblx0XHRcdGN1c3RvbUNvbG9yOiB7XG5cdFx0XHRcdGhzbENvbG9yOiB7XG5cdFx0XHRcdFx0Li4uKGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmhzbENvbG9yID8/IHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdGh1ZTogMCxcblx0XHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogMCxcblx0XHRcdFx0XHRcdFx0bGlnaHRuZXNzOiAwLFxuXHRcdFx0XHRcdFx0XHRhbHBoYTogMVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uaHNsQ29sb3I/LnZhbHVlLmh1ZSA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5oc2xDb2xvcj8udmFsdWVcblx0XHRcdFx0XHRcdFx0XHQuc2F0dXJhdGlvbiA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmhzbENvbG9yPy52YWx1ZVxuXHRcdFx0XHRcdFx0XHRcdC5saWdodG5lc3MgPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmhzbENvbG9yPy52YWx1ZS5hbHBoYSA/P1xuXHRcdFx0XHRcdFx0XHRcdDFcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbnZlcnRlZENvbG9yczoge1xuXHRcdFx0XHRcdGNteWs6IHtcblx0XHRcdFx0XHRcdGN5YW46IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5jbXlrXG5cdFx0XHRcdFx0XHRcdFx0LmN5YW4gPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdG1hZ2VudGE6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5jbXlrXG5cdFx0XHRcdFx0XHRcdFx0Lm1hZ2VudGEgPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdHllbGxvdzogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmNteWtcblx0XHRcdFx0XHRcdFx0XHQueWVsbG93ID8/IDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRrZXk6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5jbXlrXG5cdFx0XHRcdFx0XHRcdFx0LmtleSA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5jbXlrXG5cdFx0XHRcdFx0XHRcdFx0LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGhleDoge1xuXHRcdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldChcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5oZXhcblx0XHRcdFx0XHRcdFx0XHQuaGV4ID8/ICcjMDAwMDAwRkYnXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzSGV4Q29tcG9uZW50KFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmhleFxuXHRcdFx0XHRcdFx0XHRcdC5hbHBoYSA/PyAnRkYnXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5oZXhcblx0XHRcdFx0XHRcdFx0XHQubnVtQWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aHNsOiB7XG5cdFx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmhzbFxuXHRcdFx0XHRcdFx0XHRcdC5odWUgPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5oc2xcblx0XHRcdFx0XHRcdFx0XHQuc2F0dXJhdGlvbiA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8uaHNsXG5cdFx0XHRcdFx0XHRcdFx0LmxpZ2h0bmVzcyA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5oc2xcblx0XHRcdFx0XHRcdFx0XHQuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aHN2OiB7XG5cdFx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmhzdlxuXHRcdFx0XHRcdFx0XHRcdC5odWUgPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5oc3Zcblx0XHRcdFx0XHRcdFx0XHQuc2F0dXJhdGlvbiA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5oc3Zcblx0XHRcdFx0XHRcdFx0XHQudmFsdWUgPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8uaHN2XG5cdFx0XHRcdFx0XHRcdFx0LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGxhYjoge1xuXHRcdFx0XHRcdFx0bDogYnJhbmQuYXNMQUJfTChcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5sYWIubCA/P1xuXHRcdFx0XHRcdFx0XHRcdDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRhOiBicmFuZC5hc0xBQl9BKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmxhYi5hID8/XG5cdFx0XHRcdFx0XHRcdFx0MFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGI6IGJyYW5kLmFzTEFCX0IoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8ubGFiLmIgPz9cblx0XHRcdFx0XHRcdFx0XHQwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5sYWJcblx0XHRcdFx0XHRcdFx0XHQuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0cmdiOiB7XG5cdFx0XHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LnJnYlxuXHRcdFx0XHRcdFx0XHRcdC5yZWQgPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5yZ2Jcblx0XHRcdFx0XHRcdFx0XHQuZ3JlZW4gPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LnJnYlxuXHRcdFx0XHRcdFx0XHRcdC5ibHVlID8/IDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LnJnYlxuXHRcdFx0XHRcdFx0XHRcdC5hbHBoYSA/PyAxXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR4eXo6IHtcblx0XHRcdFx0XHRcdHg6IGJyYW5kLmFzWFlaX1goXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8ueHl6LnggPz9cblx0XHRcdFx0XHRcdFx0XHQwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0eTogYnJhbmQuYXNYWVpfWShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy54eXoueSA/P1xuXHRcdFx0XHRcdFx0XHRcdDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHR6OiBicmFuZC5hc1hZWl9aKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/Lnh5ei56ID8/XG5cdFx0XHRcdFx0XHRcdFx0MFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8ueHl6XG5cdFx0XHRcdFx0XHRcdFx0LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG59XG5cbmZ1bmN0aW9uIGNvbXBvbmVudFRvSGV4KGNvbXBvbmVudDogbnVtYmVyKTogc3RyaW5nIHtcblx0dHJ5IHtcblx0XHRjb25zdCBoZXggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIGNvbXBvbmVudCkpLnRvU3RyaW5nKDE2KTtcblxuXHRcdHJldHVybiBoZXgubGVuZ3RoID09PSAxID8gJzAnICsgaGV4IDogaGV4O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmICghbW9kZS5xdWlldCkgY29uc29sZS5lcnJvcihgY29tcG9uZW50VG9IZXggZXJyb3I6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gJzAwJztcblx0fVxufVxuXG5mdW5jdGlvbiBkZWZhdWx0Q29sb3JWYWx1ZShjb2xvcjogQ29sb3JVbmJyYW5kZWQpOiBDb2xvciB7XG5cdHN3aXRjaCAoY29sb3IuZm9ybWF0KSB7XG5cdFx0Y2FzZSAnY215ayc6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGN5YW46IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRtYWdlbnRhOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0eWVsbG93OiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0a2V5OiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdjbXlrJ1xuXHRcdFx0fTtcblx0XHRjYXNlICdoZXgnOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRoZXg6IGJyYW5kLmFzSGV4U2V0KCcjMDAwMDAwJyksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzSGV4Q29tcG9uZW50KCdGRicpLFxuXHRcdFx0XHRcdG51bUFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaGV4J1xuXHRcdFx0fTtcblx0XHRjYXNlICdoc2wnOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKDApLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdH07XG5cdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbCgwKSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHRcdH07XG5cdFx0Y2FzZSAnbGFiJzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0bDogYnJhbmQuYXNMQUJfTCgwKSxcblx0XHRcdFx0XHRhOiBicmFuZC5hc0xBQl9BKDApLFxuXHRcdFx0XHRcdGI6IGJyYW5kLmFzTEFCX0IoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdsYWInXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ3JnYic6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHJlZDogYnJhbmQuYXNCeXRlUmFuZ2UoMCksXG5cdFx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0fTtcblx0XHRjYXNlICdzbCc6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3NsJ1xuXHRcdFx0fTtcblx0XHRjYXNlICdzdic6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnc3YnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ3h5eic6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHg6IGJyYW5kLmFzWFlaX1goMCksXG5cdFx0XHRcdFx0eTogYnJhbmQuYXNYWVpfWSgwKSxcblx0XHRcdFx0XHR6OiBicmFuZC5hc1hZWl9aKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdFx0fTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBcblx0XHRcdFx0VW5rbm93biBjb2xvciBmb3JtYXRcXG5EZXRhaWxzOiAke0pTT04uc3RyaW5naWZ5KGNvbG9yKX1gKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgYmFzZTogQ29tbW9uVHJhbnNmb3JtRm5CYXNlID0ge1xuXHRhZGRIYXNoVG9IZXgsXG5cdGNvbXBvbmVudFRvSGV4LFxuXHRicmFuZFBhbGV0dGUsXG5cdGRlZmF1bHRDb2xvclZhbHVlXG59O1xuXG5leHBvcnQgeyBjb21wb25lbnRUb0hleCB9O1xuIl19