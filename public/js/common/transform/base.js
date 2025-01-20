// File: src/common/transform/base.js
import { brand } from '../core/base.js';
import { logger } from '../../logger/index.js';
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
            customColor: data.metadata.customColor
                ? {
                    hslColor: {
                        ...(data.metadata.customColor.hslColor ?? {
                            value: {
                                hue: 0,
                                saturation: 0,
                                lightness: 0,
                                alpha: 1
                            },
                            format: 'hsl'
                        }),
                        value: {
                            hue: brand.asRadial(data.metadata.customColor.hslColor?.value
                                .hue ?? 0),
                            saturation: brand.asPercentile(data.metadata.customColor.hslColor?.value
                                .saturation ?? 0),
                            lightness: brand.asPercentile(data.metadata.customColor.hslColor?.value
                                .lightness ?? 0),
                            alpha: brand.asAlphaRange(data.metadata.customColor.hslColor?.value
                                .alpha ?? 1)
                        }
                    },
                    convertedColors: {
                        cmyk: {
                            cyan: brand.asPercentile(data.metadata.customColor.convertedColors
                                .cmyk.cyan ?? 0),
                            magenta: brand.asPercentile(data.metadata.customColor.convertedColors
                                .cmyk.magenta ?? 0),
                            yellow: brand.asPercentile(data.metadata.customColor.convertedColors
                                .cmyk.yellow ?? 0),
                            key: brand.asPercentile(data.metadata.customColor.convertedColors
                                .cmyk.key ?? 0),
                            alpha: brand.asAlphaRange(data.metadata.customColor.convertedColors
                                .cmyk.alpha ?? 1)
                        },
                        hex: {
                            hex: brand.asHexSet(data.metadata.customColor.convertedColors
                                .hex.hex ?? '#000000FF'),
                            alpha: brand.asHexComponent(data.metadata.customColor.convertedColors
                                .hex.alpha ?? 'FF'),
                            numAlpha: brand.asAlphaRange(data.metadata.customColor.convertedColors
                                .hex.numAlpha ?? 1)
                        },
                        hsl: {
                            hue: brand.asRadial(data.metadata.customColor.convertedColors
                                .hsl.hue ?? 0),
                            saturation: brand.asPercentile(data.metadata.customColor.convertedColors
                                .hsl.saturation ?? 0),
                            lightness: brand.asPercentile(data.metadata.customColor.convertedColors
                                .hsl.lightness ?? 0),
                            alpha: brand.asAlphaRange(data.metadata.customColor.convertedColors
                                .hsl.alpha ?? 1)
                        },
                        hsv: {
                            hue: brand.asRadial(data.metadata.customColor.convertedColors
                                .hsv.hue ?? 0),
                            saturation: brand.asPercentile(data.metadata.customColor.convertedColors
                                .hsv.saturation ?? 0),
                            value: brand.asPercentile(data.metadata.customColor.convertedColors
                                .hsv.value ?? 0),
                            alpha: brand.asAlphaRange(data.metadata.customColor.convertedColors
                                .hsv.alpha ?? 1)
                        },
                        lab: {
                            l: brand.asLAB_L(data.metadata.customColor.convertedColors
                                .lab.l ?? 0),
                            a: brand.asLAB_A(data.metadata.customColor.convertedColors
                                .lab.a ?? 0),
                            b: brand.asLAB_B(data.metadata.customColor.convertedColors
                                .lab.b ?? 0),
                            alpha: brand.asAlphaRange(data.metadata.customColor.convertedColors
                                .lab.alpha ?? 1)
                        },
                        rgb: {
                            red: brand.asByteRange(data.metadata.customColor.convertedColors
                                .rgb.red ?? 0),
                            green: brand.asByteRange(data.metadata.customColor.convertedColors
                                .rgb.green ?? 0),
                            blue: brand.asByteRange(data.metadata.customColor.convertedColors
                                .rgb.blue ?? 0),
                            alpha: brand.asAlphaRange(data.metadata.customColor.convertedColors
                                .rgb.alpha ?? 1)
                        },
                        xyz: {
                            x: brand.asXYZ_X(data.metadata.customColor.convertedColors
                                .xyz.x ?? 0),
                            y: brand.asXYZ_Y(data.metadata.customColor.convertedColors
                                .xyz.y ?? 0),
                            z: brand.asXYZ_Z(data.metadata.customColor.convertedColors
                                .xyz.z ?? 0),
                            alpha: brand.asAlphaRange(data.metadata.customColor.convertedColors
                                .xyz.alpha ?? 1)
                        }
                    }
                }
                : false
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
            logger.error(`componentToHex error: ${error}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vdHJhbnNmb3JtL2Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUNBQXFDO0FBVXJDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN4QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRWhELFNBQVMsWUFBWSxDQUFDLEdBQVE7SUFDN0IsSUFBSSxDQUFDO1FBQ0osT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxHQUFHO1lBQ0wsQ0FBQyxDQUFDO2dCQUNBLEtBQUssRUFBRTtvQkFDTixHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQztvQkFDckMsS0FBSyxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUM7b0JBQ2hELFFBQVEsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO2lCQUNoRDtnQkFDRCxNQUFNLEVBQUUsS0FBYzthQUN0QixDQUFDO0lBQ0wsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNqRCxDQUFDO0FBQ0YsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLElBQXNCO0lBQzNDLE9BQU87UUFDTixHQUFHLElBQUk7UUFDUCxRQUFRLEVBQUU7WUFDVCxHQUFHLElBQUksQ0FBQyxRQUFRO1lBQ2hCLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVc7Z0JBQ3JDLENBQUMsQ0FBQztv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SCxLQUFLLElBQUk7WUFDUixPQUFPO2dCQUNOLEtBQUssRUFBRTtvQkFDTixVQUFVLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLEtBQUssRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDNUIsS0FBSyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUM1QjtnQkFDRCxNQUFNLEVBQUUsSUFBSTthQUNaLENBQUM7UUFDSCxLQUFLLEtBQUs7WUFDVCxPQUFPO2dCQUNOLEtBQUssRUFBRTtvQkFDTixDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ25CLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNuQixLQUFLLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7aUJBQzVCO2dCQUNELE1BQU0sRUFBRSxLQUFLO2FBQ2IsQ0FBQztRQUNIO1lBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQztxQ0FDa0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDN0QsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQTBCO0lBQzFDLFlBQVk7SUFDWixjQUFjO0lBQ2QsWUFBWTtJQUNaLGlCQUFpQjtDQUNqQixDQUFDO0FBRUYsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2NvbW1vbi90cmFuc2Zvcm0vYmFzZS5qc1xuXG5pbXBvcnQge1xuXHRDb2xvcixcblx0Q29sb3JVbmJyYW5kZWQsXG5cdENvbW1vblRyYW5zZm9ybUZuQmFzZSxcblx0SGV4LFxuXHRQYWxldHRlLFxuXHRQYWxldHRlVW5icmFuZGVkXG59IGZyb20gJy4uLy4uL2luZGV4L2luZGV4LmpzJztcbmltcG9ydCB7IGJyYW5kIH0gZnJvbSAnLi4vY29yZS9iYXNlLmpzJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4uLy4uL2xvZ2dlci9pbmRleC5qcyc7XG5pbXBvcnQgeyBtb2RlIH0gZnJvbSAnLi4vLi4vZGF0YS9tb2RlL2luZGV4LmpzJztcblxuZnVuY3Rpb24gYWRkSGFzaFRvSGV4KGhleDogSGV4KTogSGV4IHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gaGV4LnZhbHVlLmhleC5zdGFydHNXaXRoKCcjJylcblx0XHRcdD8gaGV4XG5cdFx0XHQ6IHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldChgIyR7aGV4LnZhbHVlfX1gKSxcblx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0hleENvbXBvbmVudChgIyRoZXgudmFsdWUuYWxwaGFgKSxcblx0XHRcdFx0XHRcdG51bUFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoaGV4LnZhbHVlLm51bUFscGhhKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4JyBhcyAnaGV4J1xuXHRcdFx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgYWRkSGFzaFRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGJyYW5kUGFsZXR0ZShkYXRhOiBQYWxldHRlVW5icmFuZGVkKTogUGFsZXR0ZSB7XG5cdHJldHVybiB7XG5cdFx0Li4uZGF0YSxcblx0XHRtZXRhZGF0YToge1xuXHRcdFx0Li4uZGF0YS5tZXRhZGF0YSxcblx0XHRcdGN1c3RvbUNvbG9yOiBkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yXG5cdFx0XHRcdD8ge1xuXHRcdFx0XHRcdFx0aHNsQ29sb3I6IHtcblx0XHRcdFx0XHRcdFx0Li4uKGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuaHNsQ29sb3IgPz8ge1xuXHRcdFx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRodWU6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFx0bGlnaHRuZXNzOiAwLFxuXHRcdFx0XHRcdFx0XHRcdFx0YWxwaGE6IDFcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuaHNsQ29sb3I/LnZhbHVlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5odWUgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5oc2xDb2xvcj8udmFsdWVcblx0XHRcdFx0XHRcdFx0XHRcdFx0LnNhdHVyYXRpb24gPz8gMFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmhzbENvbG9yPy52YWx1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQubGlnaHRuZXNzID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmhzbENvbG9yPy52YWx1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGNvbnZlcnRlZENvbG9yczoge1xuXHRcdFx0XHRcdFx0XHRjbXlrOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y3lhbjogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnNcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmNteWsuY3lhbiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRtYWdlbnRhOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9yc1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQuY215ay5tYWdlbnRhID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdHllbGxvdzogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnNcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmNteWsueWVsbG93ID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGtleTogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnNcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmNteWsua2V5ID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9yc1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQuY215ay5hbHBoYSA/PyAxXG5cdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRoZXg6IHtcblx0XHRcdFx0XHRcdFx0XHRoZXg6IGJyYW5kLmFzSGV4U2V0KFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnNcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmhleC5oZXggPz8gJyMwMDAwMDBGRidcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0hleENvbXBvbmVudChcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5oZXguYWxwaGEgPz8gJ0ZGJ1xuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5oZXgubnVtQWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0aHNsOiB7XG5cdFx0XHRcdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5oc2wuaHVlID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5oc2wuc2F0dXJhdGlvbiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5oc2wubGlnaHRuZXNzID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9yc1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQuaHNsLmFscGhhID8/IDFcblx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGhzdjoge1xuXHRcdFx0XHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9yc1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQuaHN2Lmh1ZSA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9yc1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQuaHN2LnNhdHVyYXRpb24gPz8gMFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5oc3YudmFsdWUgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5oc3YuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0bGFiOiB7XG5cdFx0XHRcdFx0XHRcdFx0bDogYnJhbmQuYXNMQUJfTChcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5sYWIubCA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRhOiBicmFuZC5hc0xBQl9BKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnNcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmxhYi5hID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGI6IGJyYW5kLmFzTEFCX0IoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9yc1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQubGFiLmIgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5sYWIuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0cmdiOiB7XG5cdFx0XHRcdFx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5yZ2IucmVkID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5yZ2IuZ3JlZW4gPz8gMFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9yc1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQucmdiLmJsdWUgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5yZ2IuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0eHl6OiB7XG5cdFx0XHRcdFx0XHRcdFx0eDogYnJhbmQuYXNYWVpfWChcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC54eXoueCA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHR5OiBicmFuZC5hc1hZWl9ZKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb252ZXJ0ZWRDb2xvcnNcblx0XHRcdFx0XHRcdFx0XHRcdFx0Lnh5ei55ID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdHo6IGJyYW5kLmFzWFlaX1ooXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbnZlcnRlZENvbG9yc1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQueHl6LnogPz8gMFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29udmVydGVkQ29sb3JzXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC54eXouYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0OiBmYWxzZVxuXHRcdH1cblx0fTtcbn1cblxuZnVuY3Rpb24gY29tcG9uZW50VG9IZXgoY29tcG9uZW50OiBudW1iZXIpOiBzdHJpbmcge1xuXHR0cnkge1xuXHRcdGNvbnN0IGhleCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgY29tcG9uZW50KSkudG9TdHJpbmcoMTYpO1xuXG5cdFx0cmV0dXJuIGhleC5sZW5ndGggPT09IDEgPyAnMCcgKyBoZXggOiBoZXg7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCFtb2RlLnF1aWV0ICYmIG1vZGUubG9nZ2luZy5lcnJvcnMpXG5cdFx0XHRsb2dnZXIuZXJyb3IoYGNvbXBvbmVudFRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuICcwMCc7XG5cdH1cbn1cblxuZnVuY3Rpb24gZGVmYXVsdENvbG9yVmFsdWUoY29sb3I6IENvbG9yVW5icmFuZGVkKTogQ29sb3Ige1xuXHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRjeWFuOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0bWFnZW50YTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdHllbGxvdzogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGtleTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnY215aydcblx0XHRcdH07XG5cdFx0Y2FzZSAnaGV4Jzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldCgnIzAwMDAwMCcpLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0hleENvbXBvbmVudCgnRkYnKSxcblx0XHRcdFx0XHRudW1BbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hleCdcblx0XHRcdH07XG5cdFx0Y2FzZSAnaHNsJzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbCgwKSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ2hzdic6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoMCksXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdHZhbHVlOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGw6IGJyYW5kLmFzTEFCX0woMCksXG5cdFx0XHRcdFx0YTogYnJhbmQuYXNMQUJfQSgwKSxcblx0XHRcdFx0XHRiOiBicmFuZC5hc0xBQl9CKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnbGFiJ1xuXHRcdFx0fTtcblx0XHRjYXNlICdyZ2InOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKDApLFxuXHRcdFx0XHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZSgwKSxcblx0XHRcdFx0XHRibHVlOiBicmFuZC5hc0J5dGVSYW5nZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHRcdH07XG5cdFx0Y2FzZSAnc2wnOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzbCdcblx0XHRcdH07XG5cdFx0Y2FzZSAnc3YnOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3N2J1xuXHRcdFx0fTtcblx0XHRjYXNlICd4eXonOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHR4OiBicmFuZC5hc1hZWl9YKDApLFxuXHRcdFx0XHRcdHk6IGJyYW5kLmFzWFlaX1koMCksXG5cdFx0XHRcdFx0ejogYnJhbmQuYXNYWVpfWigwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ3h5eidcblx0XHRcdH07XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHRocm93IG5ldyBFcnJvcihgXG5cdFx0XHRcdFVua25vd24gY29sb3IgZm9ybWF0XFxuRGV0YWlsczogJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YCk7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGJhc2U6IENvbW1vblRyYW5zZm9ybUZuQmFzZSA9IHtcblx0YWRkSGFzaFRvSGV4LFxuXHRjb21wb25lbnRUb0hleCxcblx0YnJhbmRQYWxldHRlLFxuXHRkZWZhdWx0Q29sb3JWYWx1ZVxufTtcblxuZXhwb3J0IHsgY29tcG9uZW50VG9IZXggfTtcbiJdfQ==