// File: src/common/transform/base.ts
import { brand } from '../core/base.js';
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
    brandPalette,
    defaultColorValue
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vdHJhbnNmb3JtL2Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUNBQXFDO0FBU3JDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV4QyxTQUFTLFlBQVksQ0FBQyxJQUFzQjtJQUMzQyxPQUFPO1FBQ04sR0FBRyxJQUFJO1FBQ1AsUUFBUSxFQUFFO1lBQ1QsR0FBRyxJQUFJLENBQUMsUUFBUTtZQUNoQixXQUFXLEVBQUU7Z0JBQ1osUUFBUSxFQUFFO29CQUNULEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxRQUFRLElBQUk7d0JBQzFDLEtBQUssRUFBRTs0QkFDTixHQUFHLEVBQUUsQ0FBQzs0QkFDTixVQUFVLEVBQUUsQ0FBQzs0QkFDYixTQUFTLEVBQUUsQ0FBQzs0QkFDWixLQUFLLEVBQUUsQ0FBQzt5QkFDUjt3QkFDRCxNQUFNLEVBQUUsS0FBSztxQkFDYixDQUFDO29CQUNGLEtBQUssRUFBRTt3QkFDTixHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUNuRDt3QkFDRCxVQUFVLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLEtBQUs7NkJBQ3hDLFVBQVUsSUFBSSxDQUFDLENBQ2pCO3dCQUNELFNBQVMsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsS0FBSzs2QkFDeEMsU0FBUyxJQUFJLENBQUMsQ0FDaEI7d0JBQ0QsS0FBSyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMs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RUFBRSxJQUFJO2FBQ1osQ0FBQztRQUNILEtBQUssS0FBSztZQUNULE9BQU87Z0JBQ04sS0FBSyxFQUFFO29CQUNOLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNuQixDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ25CLEtBQUssRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztpQkFDNUI7Z0JBQ0QsTUFBTSxFQUFFLEtBQUs7YUFDYixDQUFDO1FBQ0g7WUFDQyxNQUFNLElBQUksS0FBSyxDQUFDO3FDQUNrQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM3RCxDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBMEI7SUFDMUMsWUFBWTtJQUNaLGlCQUFpQjtDQUNqQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2NvbW1vbi90cmFuc2Zvcm0vYmFzZS50c1xuXG5pbXBvcnQge1xuXHRDb2xvcixcblx0Q29sb3JVbmJyYW5kZWQsXG5cdENvbW1vblRyYW5zZm9ybUZuQmFzZSxcblx0UGFsZXR0ZSxcblx0UGFsZXR0ZVVuYnJhbmRlZFxufSBmcm9tICcuLi8uLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBicmFuZCB9IGZyb20gJy4uL2NvcmUvYmFzZS5qcyc7XG5cbmZ1bmN0aW9uIGJyYW5kUGFsZXR0ZShkYXRhOiBQYWxldHRlVW5icmFuZGVkKTogUGFsZXR0ZSB7XG5cdHJldHVybiB7XG5cdFx0Li4uZGF0YSxcblx0XHRtZXRhZGF0YToge1xuXHRcdFx0Li4uZGF0YS5tZXRhZGF0YSxcblx0XHRcdGN1c3RvbUNvbG9yOiB7XG5cdFx0XHRcdGhzbENvbG9yOiB7XG5cdFx0XHRcdFx0Li4uKGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmhzbENvbG9yID8/IHtcblx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdGh1ZTogMCxcblx0XHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogMCxcblx0XHRcdFx0XHRcdFx0bGlnaHRuZXNzOiAwLFxuXHRcdFx0XHRcdFx0XHRhbHBoYTogMVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uaHNsQ29sb3I/LnZhbHVlLmh1ZSA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5oc2xDb2xvcj8udmFsdWVcblx0XHRcdFx0XHRcdFx0XHQuc2F0dXJhdGlvbiA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmhzbENvbG9yPy52YWx1ZVxuXHRcdFx0XHRcdFx0XHRcdC5saWdodG5lc3MgPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmhzbENvbG9yPy52YWx1ZS5hbHBoYSA/P1xuXHRcdFx0XHRcdFx0XHRcdDFcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbnZlcnRlZENvbG9yczoge1xuXHRcdFx0XHRcdGNteWs6IHtcblx0XHRcdFx0XHRcdGN5YW46IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5jbXlrXG5cdFx0XHRcdFx0XHRcdFx0LmN5YW4gPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdG1hZ2VudGE6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5jbXlrXG5cdFx0XHRcdFx0XHRcdFx0Lm1hZ2VudGEgPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdHllbGxvdzogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmNteWtcblx0XHRcdFx0XHRcdFx0XHQueWVsbG93ID8/IDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRrZXk6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5jbXlrXG5cdFx0XHRcdFx0XHRcdFx0LmtleSA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5jbXlrXG5cdFx0XHRcdFx0XHRcdFx0LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGhleDoge1xuXHRcdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldChcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5oZXhcblx0XHRcdFx0XHRcdFx0XHQuaGV4ID8/ICcjMDAwMDAwRkYnXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzSGV4Q29tcG9uZW50KFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmhleFxuXHRcdFx0XHRcdFx0XHRcdC5hbHBoYSA/PyAnRkYnXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5oZXhcblx0XHRcdFx0XHRcdFx0XHQubnVtQWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aHNsOiB7XG5cdFx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmhzbFxuXHRcdFx0XHRcdFx0XHRcdC5odWUgPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5oc2xcblx0XHRcdFx0XHRcdFx0XHQuc2F0dXJhdGlvbiA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8uaHNsXG5cdFx0XHRcdFx0XHRcdFx0LmxpZ2h0bmVzcyA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5oc2xcblx0XHRcdFx0XHRcdFx0XHQuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aHN2OiB7XG5cdFx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmhzdlxuXHRcdFx0XHRcdFx0XHRcdC5odWUgPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5oc3Zcblx0XHRcdFx0XHRcdFx0XHQuc2F0dXJhdGlvbiA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5oc3Zcblx0XHRcdFx0XHRcdFx0XHQudmFsdWUgPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8uaHN2XG5cdFx0XHRcdFx0XHRcdFx0LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGxhYjoge1xuXHRcdFx0XHRcdFx0bDogYnJhbmQuYXNMQUJfTChcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5sYWIubCA/P1xuXHRcdFx0XHRcdFx0XHRcdDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRhOiBicmFuZC5hc0xBQl9BKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmxhYi5hID8/XG5cdFx0XHRcdFx0XHRcdFx0MFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGI6IGJyYW5kLmFzTEFCX0IoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8ubGFiLmIgPz9cblx0XHRcdFx0XHRcdFx0XHQwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5sYWJcblx0XHRcdFx0XHRcdFx0XHQuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0cmdiOiB7XG5cdFx0XHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LnJnYlxuXHRcdFx0XHRcdFx0XHRcdC5yZWQgPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5yZ2Jcblx0XHRcdFx0XHRcdFx0XHQuZ3JlZW4gPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LnJnYlxuXHRcdFx0XHRcdFx0XHRcdC5ibHVlID8/IDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LnJnYlxuXHRcdFx0XHRcdFx0XHRcdC5hbHBoYSA/PyAxXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR4eXo6IHtcblx0XHRcdFx0XHRcdHg6IGJyYW5kLmFzWFlaX1goXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8ueHl6LnggPz9cblx0XHRcdFx0XHRcdFx0XHQwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0eTogYnJhbmQuYXNYWVpfWShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy54eXoueSA/P1xuXHRcdFx0XHRcdFx0XHRcdDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHR6OiBicmFuZC5hc1hZWl9aKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/Lnh5ei56ID8/XG5cdFx0XHRcdFx0XHRcdFx0MFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8ueHl6XG5cdFx0XHRcdFx0XHRcdFx0LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRDb2xvclZhbHVlKGNvbG9yOiBDb2xvclVuYnJhbmRlZCk6IENvbG9yIHtcblx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRjYXNlICdjbXlrJzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0Y3lhbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdG1hZ2VudGE6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHR5ZWxsb3c6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRrZXk6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoJyMwMDAwMDAnKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoJ0ZGJyksXG5cdFx0XHRcdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoMCksXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fTtcblx0XHRjYXNlICdoc3YnOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKDApLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0fTtcblx0XHRjYXNlICdsYWInOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRsOiBicmFuZC5hc0xBQl9MKDApLFxuXHRcdFx0XHRcdGE6IGJyYW5kLmFzTEFCX0EoMCksXG5cdFx0XHRcdFx0YjogYnJhbmQuYXNMQUJfQigwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdH07XG5cdFx0Y2FzZSAncmdiJzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZSgwKSxcblx0XHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UoMCksXG5cdFx0XHRcdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2UoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ3NsJzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnc2wnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ3N2Jzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdHZhbHVlOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzdidcblx0XHRcdH07XG5cdFx0Y2FzZSAneHl6Jzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0eDogYnJhbmQuYXNYWVpfWCgwKSxcblx0XHRcdFx0XHR5OiBicmFuZC5hc1hZWl9ZKDApLFxuXHRcdFx0XHRcdHo6IGJyYW5kLmFzWFlaX1ooMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0XHR9O1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFxuXHRcdFx0XHRVbmtub3duIGNvbG9yIGZvcm1hdFxcbkRldGFpbHM6ICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWApO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBiYXNlOiBDb21tb25UcmFuc2Zvcm1GbkJhc2UgPSB7XG5cdGJyYW5kUGFsZXR0ZSxcblx0ZGVmYXVsdENvbG9yVmFsdWVcbn07XG4iXX0=