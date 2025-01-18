// File: src/common/transform/base.js
import { brand } from '../core/base.js';
import { log } from '../../classes/logger/index.js';
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
        if (!mode.quiet && mode.logging.errors)
            log.error(`componentToHex error: ${error}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vdHJhbnNmb3JtL2Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUNBQXFDO0FBVXJDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN4QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDcEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRWhELFNBQVMsWUFBWSxDQUFDLEdBQVE7SUFDN0IsSUFBSSxDQUFDO1FBQ0osT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxHQUFHO1lBQ0wsQ0FBQyxDQUFDO2dCQUNBLEtBQUssRUFBRTtvQkFDTixHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQztvQkFDckMsS0FBSyxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUM7b0JBQ2hELFFBQVEsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO2lCQUNoRDtnQkFDRCxNQUFNLEVBQUUsS0FBYzthQUN0QixDQUFDO0lBQ0wsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNqRCxDQUFDO0FBQ0YsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLElBQXNCO0lBQzNDLE9BQU87UUFDTixHQUFHLElBQUk7UUFDUCxRQUFRLEVBQUU7WUFDVCxHQUFHLElBQUksQ0FBQyxRQUFRO1lBQ2hCLFdBQVcsRUFBRTtnQkFDWixRQUFRLEVBQUU7b0JBQ1QsR0FBRyxDQUFDLElBQUksQ0FBQyxR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LENBQUM7b0JBQ2pDLEtBQUssRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDNUIsS0FBSyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUM1QjtnQkFDRCxNQUFNLEVBQUUsSUFBSTthQUNaLENBQUM7UUFDSCxLQUFLLEtBQUs7WUFDVCxPQUFPO2dCQUNOLEtBQUssRUFBRTtvQkFDTixDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ25CLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNuQixLQUFLLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7aUJBQzVCO2dCQUNELE1BQU0sRUFBRSxLQUFLO2FBQ2IsQ0FBQztRQUNIO1lBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQztxQ0FDa0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDN0QsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQTBCO0lBQzFDLFlBQVk7SUFDWixjQUFjO0lBQ2QsWUFBWTtJQUNaLGlCQUFpQjtDQUNqQixDQUFDO0FBRUYsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2NvbW1vbi90cmFuc2Zvcm0vYmFzZS5qc1xuXG5pbXBvcnQge1xuXHRDb2xvcixcblx0Q29sb3JVbmJyYW5kZWQsXG5cdENvbW1vblRyYW5zZm9ybUZuQmFzZSxcblx0SGV4LFxuXHRQYWxldHRlLFxuXHRQYWxldHRlVW5icmFuZGVkXG59IGZyb20gJy4uLy4uL2luZGV4L2luZGV4LmpzJztcbmltcG9ydCB7IGJyYW5kIH0gZnJvbSAnLi4vY29yZS9iYXNlLmpzJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uLy4uL2NsYXNzZXMvbG9nZ2VyL2luZGV4LmpzJztcbmltcG9ydCB7IG1vZGUgfSBmcm9tICcuLi8uLi9kYXRhL21vZGUvaW5kZXguanMnO1xuXG5mdW5jdGlvbiBhZGRIYXNoVG9IZXgoaGV4OiBIZXgpOiBIZXgge1xuXHR0cnkge1xuXHRcdHJldHVybiBoZXgudmFsdWUuaGV4LnN0YXJ0c1dpdGgoJyMnKVxuXHRcdFx0PyBoZXhcblx0XHRcdDoge1xuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRoZXg6IGJyYW5kLmFzSGV4U2V0KGAjJHtoZXgudmFsdWV9fWApLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzSGV4Q29tcG9uZW50KGAjJGhleC52YWx1ZS5hbHBoYWApLFxuXHRcdFx0XHRcdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShoZXgudmFsdWUubnVtQWxwaGEpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmb3JtYXQ6ICdoZXgnIGFzICdoZXgnXG5cdFx0XHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBhZGRIYXNoVG9IZXggZXJyb3I6ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gYnJhbmRQYWxldHRlKGRhdGE6IFBhbGV0dGVVbmJyYW5kZWQpOiBQYWxldHRlIHtcblx0cmV0dXJuIHtcblx0XHQuLi5kYXRhLFxuXHRcdG1ldGFkYXRhOiB7XG5cdFx0XHQuLi5kYXRhLm1ldGFkYXRhLFxuXHRcdFx0Y3VzdG9tQ29sb3I6IHtcblx0XHRcdFx0aHNsQ29sb3I6IHtcblx0XHRcdFx0XHQuLi4oZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uaHNsQ29sb3IgPz8ge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdFx0aHVlOiAwLFxuXHRcdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiAwLFxuXHRcdFx0XHRcdFx0XHRsaWdodG5lc3M6IDAsXG5cdFx0XHRcdFx0XHRcdGFscGhhOiAxXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5oc2xDb2xvcj8udmFsdWUuaHVlID8/IDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmhzbENvbG9yPy52YWx1ZVxuXHRcdFx0XHRcdFx0XHRcdC5zYXR1cmF0aW9uID8/IDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uaHNsQ29sb3I/LnZhbHVlXG5cdFx0XHRcdFx0XHRcdFx0LmxpZ2h0bmVzcyA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uaHNsQ29sb3I/LnZhbHVlLmFscGhhID8/XG5cdFx0XHRcdFx0XHRcdFx0MVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0Y29udmVydGVkQ29sb3JzOiB7XG5cdFx0XHRcdFx0Y215azoge1xuXHRcdFx0XHRcdFx0Y3lhbjogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmNteWtcblx0XHRcdFx0XHRcdFx0XHQuY3lhbiA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0bWFnZW50YTogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmNteWtcblx0XHRcdFx0XHRcdFx0XHQubWFnZW50YSA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0eWVsbG93OiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8uY215a1xuXHRcdFx0XHRcdFx0XHRcdC55ZWxsb3cgPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGtleTogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmNteWtcblx0XHRcdFx0XHRcdFx0XHQua2V5ID8/IDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmNteWtcblx0XHRcdFx0XHRcdFx0XHQuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aGV4OiB7XG5cdFx0XHRcdFx0XHRoZXg6IGJyYW5kLmFzSGV4U2V0KFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmhleFxuXHRcdFx0XHRcdFx0XHRcdC5oZXggPz8gJyMwMDAwMDBGRidcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8uaGV4XG5cdFx0XHRcdFx0XHRcdFx0LmFscGhhID8/ICdGRidcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRudW1BbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmhleFxuXHRcdFx0XHRcdFx0XHRcdC5udW1BbHBoYSA/PyAxXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRoc2w6IHtcblx0XHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8uaHNsXG5cdFx0XHRcdFx0XHRcdFx0Lmh1ZSA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmhzbFxuXHRcdFx0XHRcdFx0XHRcdC5zYXR1cmF0aW9uID8/IDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5oc2xcblx0XHRcdFx0XHRcdFx0XHQubGlnaHRuZXNzID8/IDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmhzbFxuXHRcdFx0XHRcdFx0XHRcdC5hbHBoYSA/PyAxXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRoc3Y6IHtcblx0XHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8uaHN2XG5cdFx0XHRcdFx0XHRcdFx0Lmh1ZSA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmhzdlxuXHRcdFx0XHRcdFx0XHRcdC5zYXR1cmF0aW9uID8/IDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmhzdlxuXHRcdFx0XHRcdFx0XHRcdC52YWx1ZSA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5oc3Zcblx0XHRcdFx0XHRcdFx0XHQuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0bGFiOiB7XG5cdFx0XHRcdFx0XHRsOiBicmFuZC5hc0xBQl9MKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmxhYi5sID8/XG5cdFx0XHRcdFx0XHRcdFx0MFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGE6IGJyYW5kLmFzTEFCX0EoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8ubGFiLmEgPz9cblx0XHRcdFx0XHRcdFx0XHQwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0YjogYnJhbmQuYXNMQUJfQihcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy5sYWIuYiA/P1xuXHRcdFx0XHRcdFx0XHRcdDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LmxhYlxuXHRcdFx0XHRcdFx0XHRcdC5hbHBoYSA/PyAxXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRyZ2I6IHtcblx0XHRcdFx0XHRcdHJlZDogYnJhbmQuYXNCeXRlUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8ucmdiXG5cdFx0XHRcdFx0XHRcdFx0LnJlZCA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/LnJnYlxuXHRcdFx0XHRcdFx0XHRcdC5ncmVlbiA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8ucmdiXG5cdFx0XHRcdFx0XHRcdFx0LmJsdWUgPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8ucmdiXG5cdFx0XHRcdFx0XHRcdFx0LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHh5ejoge1xuXHRcdFx0XHRcdFx0eDogYnJhbmQuYXNYWVpfWChcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy54eXoueCA/P1xuXHRcdFx0XHRcdFx0XHRcdDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHR5OiBicmFuZC5hc1hZWl9ZKFxuXHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yPy5jb252ZXJ0ZWRDb2xvcnM/Lnh5ei55ID8/XG5cdFx0XHRcdFx0XHRcdFx0MFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdHo6IGJyYW5kLmFzWFlaX1ooXG5cdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3I/LmNvbnZlcnRlZENvbG9ycz8ueHl6LnogPz9cblx0XHRcdFx0XHRcdFx0XHQwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvcj8uY29udmVydGVkQ29sb3JzPy54eXpcblx0XHRcdFx0XHRcdFx0XHQuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cblxuZnVuY3Rpb24gY29tcG9uZW50VG9IZXgoY29tcG9uZW50OiBudW1iZXIpOiBzdHJpbmcge1xuXHR0cnkge1xuXHRcdGNvbnN0IGhleCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgY29tcG9uZW50KSkudG9TdHJpbmcoMTYpO1xuXG5cdFx0cmV0dXJuIGhleC5sZW5ndGggPT09IDEgPyAnMCcgKyBoZXggOiBoZXg7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCFtb2RlLnF1aWV0ICYmIG1vZGUubG9nZ2luZy5lcnJvcnMpXG5cdFx0XHRsb2cuZXJyb3IoYGNvbXBvbmVudFRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuICcwMCc7XG5cdH1cbn1cblxuZnVuY3Rpb24gZGVmYXVsdENvbG9yVmFsdWUoY29sb3I6IENvbG9yVW5icmFuZGVkKTogQ29sb3Ige1xuXHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRjeWFuOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0bWFnZW50YTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdHllbGxvdzogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGtleTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdH07XG5cdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldCgnIzAwMDAwMCcpLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0hleENvbXBvbmVudCgnRkYnKSxcblx0XHRcdFx0XHRudW1BbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdH07XG5cdFx0Y2FzZSAnaHNsJzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbCgwKSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoMCksXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdHZhbHVlOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGw6IGJyYW5kLmFzTEFCX0woMCksXG5cdFx0XHRcdFx0YTogYnJhbmQuYXNMQUJfQSgwKSxcblx0XHRcdFx0XHRiOiBicmFuZC5hc0xBQl9CKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0fTtcblx0XHRjYXNlICdyZ2InOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZSgwKSxcblx0XHRcdFx0XHRibHVlOiBicmFuZC5hc0J5dGVSYW5nZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdH07XG5cdFx0Y2FzZSAnc2wnOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzbCdcblx0XHRcdH07XG5cdFx0Y2FzZSAnc3YnOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3N2J1xuXHRcdFx0fTtcblx0XHRjYXNlICd4eXonOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHR4OiBicmFuZC5hc1hZWl9YKDApLFxuXHRcdFx0XHRcdHk6IGJyYW5kLmFzWFlaX1koMCksXG5cdFx0XHRcdFx0ejogYnJhbmQuYXNYWVpfWigwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHRcdH07XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHRocm93IG5ldyBFcnJvcihgXG5cdFx0XHRcdFVua25vd24gY29sb3IgZm9ybWF0XFxuRGV0YWlsczogJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YCk7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGJhc2U6IENvbW1vblRyYW5zZm9ybUZuQmFzZSA9IHtcblx0YWRkSGFzaFRvSGV4LFxuXHRjb21wb25lbnRUb0hleCxcblx0YnJhbmRQYWxldHRlLFxuXHRkZWZhdWx0Q29sb3JWYWx1ZVxufTtcblxuZXhwb3J0IHsgY29tcG9uZW50VG9IZXggfTtcbiJdfQ==