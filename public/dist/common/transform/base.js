// File: src/common/transform/base.js
import { brand } from '../core/base.js';
import { createLogger } from '../../logger/index.js';
import { mode } from '../data/base.js';
const logger = await createLogger();
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
                    colors: {
                        cmyk: {
                            cyan: brand.asPercentile(data.metadata.customColor.colors.cmyk
                                .cyan ?? 0),
                            magenta: brand.asPercentile(data.metadata.customColor.colors.cmyk
                                .magenta ?? 0),
                            yellow: brand.asPercentile(data.metadata.customColor.colors.cmyk
                                .yellow ?? 0),
                            key: brand.asPercentile(data.metadata.customColor.colors.cmyk.key ??
                                0),
                            alpha: brand.asAlphaRange(data.metadata.customColor.colors.cmyk
                                .alpha ?? 1)
                        },
                        hex: {
                            hex: brand.asHexSet(data.metadata.customColor.colors.hex.hex ??
                                '#000000FF'),
                            alpha: brand.asHexComponent(data.metadata.customColor.colors.hex
                                .alpha ?? 'FF'),
                            numAlpha: brand.asAlphaRange(data.metadata.customColor.colors.hex
                                .numAlpha ?? 1)
                        },
                        hsl: {
                            hue: brand.asRadial(data.metadata.customColor.colors.hsl.hue ??
                                0),
                            saturation: brand.asPercentile(data.metadata.customColor.colors.hsl
                                .saturation ?? 0),
                            lightness: brand.asPercentile(data.metadata.customColor.colors.hsl
                                .lightness ?? 0),
                            alpha: brand.asAlphaRange(data.metadata.customColor.colors.hsl
                                .alpha ?? 1)
                        },
                        hsv: {
                            hue: brand.asRadial(data.metadata.customColor.colors.hsv.hue ??
                                0),
                            saturation: brand.asPercentile(data.metadata.customColor.colors.hsv
                                .saturation ?? 0),
                            value: brand.asPercentile(data.metadata.customColor.colors.hsv
                                .value ?? 0),
                            alpha: brand.asAlphaRange(data.metadata.customColor.colors.hsv
                                .alpha ?? 1)
                        },
                        lab: {
                            l: brand.asLAB_L(data.metadata.customColor.colors.lab.l ?? 0),
                            a: brand.asLAB_A(data.metadata.customColor.colors.lab.a ?? 0),
                            b: brand.asLAB_B(data.metadata.customColor.colors.lab.b ?? 0),
                            alpha: brand.asAlphaRange(data.metadata.customColor.colors.lab
                                .alpha ?? 1)
                        },
                        rgb: {
                            red: brand.asByteRange(data.metadata.customColor.colors.rgb.red ??
                                0),
                            green: brand.asByteRange(data.metadata.customColor.colors.rgb
                                .green ?? 0),
                            blue: brand.asByteRange(data.metadata.customColor.colors.rgb.blue ??
                                0),
                            alpha: brand.asAlphaRange(data.metadata.customColor.colors.rgb
                                .alpha ?? 1)
                        },
                        xyz: {
                            x: brand.asXYZ_X(data.metadata.customColor.colors.xyz.x ?? 0),
                            y: brand.asXYZ_Y(data.metadata.customColor.colors.xyz.y ?? 0),
                            z: brand.asXYZ_Z(data.metadata.customColor.colors.xyz.z ?? 0),
                            alpha: brand.asAlphaRange(data.metadata.customColor.colors.xyz
                                .alpha ?? 1)
                        }
                    },
                    colorStrings: {
                        cmykString: {
                            cyan: String(data.metadata.customColor.colors.cmyk
                                .cyan ?? 0),
                            magenta: String(data.metadata.customColor.colors.cmyk
                                .magenta ?? 0),
                            yellow: String(data.metadata.customColor.colors.cmyk
                                .yellow ?? 0),
                            key: String(data.metadata.customColor.colors.cmyk.key ??
                                0),
                            alpha: String(data.metadata.customColor.colors.cmyk
                                .alpha ?? 1)
                        },
                        hexString: {
                            hex: String(data.metadata.customColor.colors.hex.hex ??
                                '#000000FF'),
                            alpha: String(data.metadata.customColor.colors.hex
                                .alpha ?? 'FF'),
                            numAlpha: String(data.metadata.customColor.colors.hex
                                .numAlpha ?? 1)
                        },
                        hslString: {
                            hue: String(data.metadata.customColor.colors.hsl.hue ??
                                0),
                            saturation: String(data.metadata.customColor.colors.hsl
                                .saturation ?? 0),
                            lightness: String(data.metadata.customColor.colors.hsl
                                .lightness ?? 0),
                            alpha: String(data.metadata.customColor.colors.hsl
                                .alpha ?? 1)
                        },
                        hsvString: {
                            hue: String(data.metadata.customColor.colors.hsv.hue ??
                                0),
                            saturation: String(data.metadata.customColor.colors.hsv
                                .saturation ?? 0),
                            value: String(data.metadata.customColor.colors.hsv
                                .value ?? 0),
                            alpha: String(data.metadata.customColor.colors.hsv
                                .alpha ?? 1)
                        },
                        labString: {
                            l: String(data.metadata.customColor.colors.lab.l ?? 0),
                            a: String(data.metadata.customColor.colors.lab.a ?? 0),
                            b: String(data.metadata.customColor.colors.lab.b ?? 0),
                            alpha: String(data.metadata.customColor.colors.lab
                                .alpha ?? 1)
                        },
                        rgbString: {
                            red: String(data.metadata.customColor.colors.rgb.red ??
                                0),
                            green: String(data.metadata.customColor.colors.rgb
                                .green ?? 0),
                            blue: String(data.metadata.customColor.colors.rgb.blue ??
                                0),
                            alpha: String(data.metadata.customColor.colors.rgb
                                .alpha ?? 1)
                        },
                        xyzString: {
                            x: String(data.metadata.customColor.colors.xyz.x ?? 0),
                            y: String(data.metadata.customColor.colors.xyz.y ?? 0),
                            z: String(data.metadata.customColor.colors.xyz.z ?? 0),
                            alpha: String(data.metadata.customColor.colors.xyz
                                .alpha ?? 1)
                        }
                    },
                    cssStrings: {
                        cmykCSSString: `cmyk(${data.metadata.customColor.colors.cmyk.cyan}%, ${data.metadata.customColor.colors.cmyk.magenta}%, ${data.metadata.customColor.colors.cmyk.yellow}%, ${data.metadata.customColor.colors.cmyk.key}%)`,
                        hexCSSString: `${data.metadata.customColor.colors.hex.hex}${data.metadata.customColor.colors.hex.alpha}`,
                        hslCSSString: `hsl(${data.metadata.customColor.colors.hsl.hue}, ${data.metadata.customColor.colors.hsl.saturation}%, ${data.metadata.customColor.colors.hsl.lightness}%)`,
                        hsvCSSString: `hsv(${data.metadata.customColor.colors.hsv.hue}, ${data.metadata.customColor.colors.hsv.saturation}%, ${data.metadata.customColor.colors.hsv.value}%)`,
                        labCSSString: `lab(${data.metadata.customColor.colors.lab.l}, ${data.metadata.customColor.colors.lab.a}, ${data.metadata.customColor.colors.lab.b})`,
                        rgbCSSString: `rgb(${data.metadata.customColor.colors.rgb.red}, ${data.metadata.customColor.colors.rgb.green}, ${data.metadata.customColor.colors.rgb.blue})`,
                        xyzCSSString: `xyz(${data.metadata.customColor.colors.xyz.x}, ${data.metadata.customColor.colors.xyz.y}, ${data.metadata.customColor.colors.xyz.z})`
                    }
                }
                : false
        },
        items: data.items.map(item => ({
            colors: {
                cmyk: {
                    cyan: brand.asPercentile(item.colors.cmyk.cyan ?? 0),
                    magenta: brand.asPercentile(item.colors.cmyk.magenta ?? 0),
                    yellow: brand.asPercentile(item.colors.cmyk.yellow ?? 0),
                    key: brand.asPercentile(item.colors.cmyk.key ?? 0),
                    alpha: brand.asAlphaRange(item.colors.cmyk.alpha ?? 1)
                },
                hex: {
                    hex: brand.asHexSet(item.colors.hex.hex ?? '#000000FF'),
                    alpha: brand.asHexComponent(item.colors.hex.alpha ?? 'FF'),
                    numAlpha: brand.asAlphaRange(item.colors.hex.numAlpha ?? 1)
                },
                hsl: {
                    hue: brand.asRadial(item.colors.hsl.hue ?? 0),
                    saturation: brand.asPercentile(item.colors.hsl.saturation ?? 0),
                    lightness: brand.asPercentile(item.colors.hsl.lightness ?? 0),
                    alpha: brand.asAlphaRange(item.colors.hsl.alpha ?? 1)
                },
                hsv: {
                    hue: brand.asRadial(item.colors.hsv.hue ?? 0),
                    saturation: brand.asPercentile(item.colors.hsv.saturation ?? 0),
                    value: brand.asPercentile(item.colors.hsv.value ?? 0),
                    alpha: brand.asAlphaRange(item.colors.hsv.alpha ?? 1)
                },
                lab: {
                    l: brand.asLAB_L(item.colors.lab.l ?? 0),
                    a: brand.asLAB_A(item.colors.lab.a ?? 0),
                    b: brand.asLAB_B(item.colors.lab.b ?? 0),
                    alpha: brand.asAlphaRange(item.colors.lab.alpha ?? 1)
                },
                rgb: {
                    red: brand.asByteRange(item.colors.rgb.red ?? 0),
                    green: brand.asByteRange(item.colors.rgb.green ?? 0),
                    blue: brand.asByteRange(item.colors.rgb.blue ?? 0),
                    alpha: brand.asAlphaRange(item.colors.rgb.alpha ?? 1)
                },
                xyz: {
                    x: brand.asXYZ_X(item.colors.xyz.x ?? 0),
                    y: brand.asXYZ_Y(item.colors.xyz.y ?? 0),
                    z: brand.asXYZ_Z(item.colors.xyz.z ?? 0),
                    alpha: brand.asAlphaRange(item.colors.xyz.alpha ?? 1)
                }
            },
            colorStrings: {
                cmykString: {
                    cyan: String(item.colors.cmyk.cyan ?? 0),
                    magenta: String(item.colors.cmyk.magenta ?? 0),
                    yellow: String(item.colors.cmyk.yellow ?? 0),
                    key: String(item.colors.cmyk.key ?? 0),
                    alpha: String(item.colors.cmyk.alpha ?? 1)
                },
                hexString: {
                    hex: String(item.colors.hex.hex ?? '#000000FF'),
                    alpha: String(item.colors.hex.alpha ?? 'FF'),
                    numAlpha: String(item.colors.hex.numAlpha ?? 1)
                },
                hslString: {
                    hue: String(item.colors.hsl.hue ?? 0),
                    saturation: String(item.colors.hsl.saturation ?? 0),
                    lightness: String(item.colors.hsl.lightness ?? 0),
                    alpha: String(item.colors.hsl.alpha ?? 1)
                },
                hsvString: {
                    hue: String(item.colors.hsv.hue ?? 0),
                    saturation: String(item.colors.hsv.saturation ?? 0),
                    value: String(item.colors.hsv.value ?? 0),
                    alpha: String(item.colors.hsv.alpha ?? 1)
                },
                labString: {
                    l: String(item.colors.lab.l ?? 0),
                    a: String(item.colors.lab.a ?? 0),
                    b: String(item.colors.lab.b ?? 0),
                    alpha: String(item.colors.lab.alpha ?? 1)
                },
                rgbString: {
                    red: String(item.colors.rgb.red ?? 0),
                    green: String(item.colors.rgb.green ?? 0),
                    blue: String(item.colors.rgb.blue ?? 0),
                    alpha: String(item.colors.rgb.alpha ?? 1)
                },
                xyzString: {
                    x: String(item.colors.xyz.x ?? 0),
                    y: String(item.colors.xyz.y ?? 0),
                    z: String(item.colors.xyz.z ?? 0),
                    alpha: String(item.colors.xyz.alpha ?? 1)
                }
            },
            cssStrings: {
                cmykCSSString: `cmyk(${item.colors.cmyk.cyan}%, ${item.colors.cmyk.magenta}%, ${item.colors.cmyk.yellow}%, ${item.colors.cmyk.key}%)`,
                hexCSSString: item.colors.hex.hex,
                hslCSSString: `hsl(${item.colors.hsl.hue}, ${item.colors.hsl.saturation}%, ${item.colors.hsl.lightness}%)`,
                hsvCSSString: `hsv(${item.colors.hsv.hue}, ${item.colors.hsv.saturation}%, ${item.colors.hsv.value}%)`,
                labCSSString: `lab(${item.colors.lab.l}, ${item.colors.lab.a}, ${item.colors.lab.b})`,
                rgbCSSString: `rgb(${item.colors.rgb.red}, ${item.colors.rgb.green}, ${item.colors.rgb.blue})`,
                xyzCSSString: `xyz(${item.colors.xyz.x}, ${item.colors.xyz.y}, ${item.colors.xyz.z})`
            }
        }))
    };
}
function componentToHex(component) {
    try {
        const hex = Math.max(0, Math.min(255, component)).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
    catch (error) {
        if (!mode.quiet && mode.logging.error)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vdHJhbnNmb3JtL2Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUNBQXFDO0FBVXJDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN4QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDckQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXZDLE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxFQUFFLENBQUM7QUFFcEMsU0FBUyxZQUFZLENBQUMsR0FBUTtJQUM3QixJQUFJLENBQUM7UUFDSixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7WUFDbkMsQ0FBQyxDQUFDLEdBQUc7WUFDTCxDQUFDLENBQUM7Z0JBQ0EsS0FBSyxFQUFFO29CQUNOLEdBQUcsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDO29CQUNyQyxLQUFLLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQztvQkFDaEQsUUFBUSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7aUJBQ2hEO2dCQUNELE1BQU0sRUFBRSxLQUFjO2FBQ3RCLENBQUM7SUFDTCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELENBQUM7QUFDRixDQUFDO0FBQ0QsU0FBUyxZQUFZLENBQUMsSUFBc0I7SUFDM0MsT0FBTztRQUNOLEdBQUcsSUFBSTtRQUNQLFFBQVEsRUFBRTtZQUNULEdBQUcsSUFBSSxDQUFDLFFBQVE7WUFDaEIsV0FBVyxFQUFFLElB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LENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUk7d0JBQ3pOLFlBQVksRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO3dCQUN4RyxZQUFZLEVBQUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSTt3QkFDekssWUFBWSxFQUFFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUk7d0JBQ3JLLFlBQVksRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxH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Q1osQ0FBQztRQUNILEtBQUssS0FBSztZQUNULE9BQU87Z0JBQ04sS0FBSyxFQUFFO29CQUNOLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNuQixDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ25CLEtBQUssRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztpQkFDNUI7Z0JBQ0QsTUFBTSxFQUFFLEtBQUs7YUFDYixDQUFDO1FBQ0g7WUFDQyxNQUFNLElBQUksS0FBSyxDQUFDO3FDQUNrQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM3RCxDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBZ0Q7SUFDaEUsWUFBWTtJQUNaLGNBQWM7SUFDZCxZQUFZO0lBQ1osaUJBQWlCO0NBQ2pCLENBQUM7QUFFRixPQUFPLEVBQUUsY0FBYyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvY29tbW9uL3RyYW5zZm9ybS9iYXNlLmpzXG5cbmltcG9ydCB7XG5cdENvbG9yLFxuXHRDb2xvclVuYnJhbmRlZCxcblx0Q29tbW9uRnVuY3Rpb25zTWFzdGVySW50ZXJmYWNlLFxuXHRIZXgsXG5cdFBhbGV0dGUsXG5cdFBhbGV0dGVVbmJyYW5kZWRcbn0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgYnJhbmQgfSBmcm9tICcuLi9jb3JlL2Jhc2UuanMnO1xuaW1wb3J0IHsgY3JlYXRlTG9nZ2VyIH0gZnJvbSAnLi4vLi4vbG9nZ2VyL2luZGV4LmpzJztcbmltcG9ydCB7IG1vZGUgfSBmcm9tICcuLi9kYXRhL2Jhc2UuanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuZnVuY3Rpb24gYWRkSGFzaFRvSGV4KGhleDogSGV4KTogSGV4IHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gaGV4LnZhbHVlLmhleC5zdGFydHNXaXRoKCcjJylcblx0XHRcdD8gaGV4XG5cdFx0XHQ6IHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldChgIyR7aGV4LnZhbHVlfX1gKSxcblx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0hleENvbXBvbmVudChgIyRoZXgudmFsdWUuYWxwaGFgKSxcblx0XHRcdFx0XHRcdG51bUFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoaGV4LnZhbHVlLm51bUFscGhhKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4JyBhcyAnaGV4J1xuXHRcdFx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgYWRkSGFzaFRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXHR9XG59XG5mdW5jdGlvbiBicmFuZFBhbGV0dGUoZGF0YTogUGFsZXR0ZVVuYnJhbmRlZCk6IFBhbGV0dGUge1xuXHRyZXR1cm4ge1xuXHRcdC4uLmRhdGEsXG5cdFx0bWV0YWRhdGE6IHtcblx0XHRcdC4uLmRhdGEubWV0YWRhdGEsXG5cdFx0XHRjdXN0b21Db2xvcjogZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvclxuXHRcdFx0XHQ/IHtcblx0XHRcdFx0XHRcdGNvbG9yczoge1xuXHRcdFx0XHRcdFx0XHRjbXlrOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y3lhbjogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMuY215a1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQuY3lhbiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRtYWdlbnRhOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5jbXlrXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5tYWdlbnRhID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdHllbGxvdzogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMuY215a1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQueWVsbG93ID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGtleTogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMuY215ay5rZXkgPz9cblx0XHRcdFx0XHRcdFx0XHRcdFx0MFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmNteWtcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGhleDoge1xuXHRcdFx0XHRcdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5oZXguaGV4ID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCcjMDAwMDAwRkYnXG5cdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5oZXhcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmFscGhhID8/ICdGRidcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdG51bUFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5oZXhcblx0XHRcdFx0XHRcdFx0XHRcdFx0Lm51bUFscGhhID8/IDFcblx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGhzbDoge1xuXHRcdFx0XHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5oc2wuaHVlID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmhzbFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQuc2F0dXJhdGlvbiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmhzbFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQubGlnaHRuZXNzID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5oc2xcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGhzdjoge1xuXHRcdFx0XHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5oc3YuaHVlID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmhzdlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQuc2F0dXJhdGlvbiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMuaHN2XG5cdFx0XHRcdFx0XHRcdFx0XHRcdC52YWx1ZSA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMuaHN2XG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5hbHBoYSA/PyAxXG5cdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRsYWI6IHtcblx0XHRcdFx0XHRcdFx0XHRsOiBicmFuZC5hc0xBQl9MKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubGFiLmwgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0YTogYnJhbmQuYXNMQUJfQShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmxhYi5hID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGI6IGJyYW5kLmFzTEFCX0IoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5sYWIuYiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubGFiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5hbHBoYSA/PyAxXG5cdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRyZ2I6IHtcblx0XHRcdFx0XHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMucmdiLnJlZCA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQwXG5cdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5yZ2Jcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmdyZWVuID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMucmdiLmJsdWUgPz9cblx0XHRcdFx0XHRcdFx0XHRcdFx0MFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLnJnYlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0eHl6OiB7XG5cdFx0XHRcdFx0XHRcdFx0eDogYnJhbmQuYXNYWVpfWChcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLnh5ei54ID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdHk6IGJyYW5kLmFzWFlaX1koXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy54eXoueSA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHR6OiBicmFuZC5hc1hZWl9aKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMueHl6LnogPz8gMFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLnh5elxuXHRcdFx0XHRcdFx0XHRcdFx0XHQuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGNvbG9yU3RyaW5nczoge1xuXHRcdFx0XHRcdFx0XHRjbXlrU3RyaW5nOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y3lhbjogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMuY215a1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQuY3lhbiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRtYWdlbnRhOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5jbXlrXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5tYWdlbnRhID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdHllbGxvdzogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMuY215a1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQueWVsbG93ID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGtleTogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMuY215ay5rZXkgPz9cblx0XHRcdFx0XHRcdFx0XHRcdFx0MFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0YWxwaGE6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmNteWtcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGhleFN0cmluZzoge1xuXHRcdFx0XHRcdFx0XHRcdGhleDogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMuaGV4LmhleCA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQnIzAwMDAwMEZGJ1xuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0YWxwaGE6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmhleFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQuYWxwaGEgPz8gJ0ZGJ1xuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0bnVtQWxwaGE6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmhleFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQubnVtQWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0aHNsU3RyaW5nOiB7XG5cdFx0XHRcdFx0XHRcdFx0aHVlOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5oc2wuaHVlID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdHNhdHVyYXRpb246IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmhzbFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQuc2F0dXJhdGlvbiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRsaWdodG5lc3M6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmhzbFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQubGlnaHRuZXNzID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGFscGhhOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5oc2xcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGhzdlN0cmluZzoge1xuXHRcdFx0XHRcdFx0XHRcdGh1ZTogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMuaHN2Lmh1ZSA/P1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQwXG5cdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5oc3Zcblx0XHRcdFx0XHRcdFx0XHRcdFx0LnNhdHVyYXRpb24gPz8gMFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmhzdlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQudmFsdWUgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0YWxwaGE6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmhzdlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0bGFiU3RyaW5nOiB7XG5cdFx0XHRcdFx0XHRcdFx0bDogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubGFiLmwgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0YTogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubGFiLmEgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0YjogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubGFiLmIgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0YWxwaGE6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmxhYlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0cmdiU3RyaW5nOiB7XG5cdFx0XHRcdFx0XHRcdFx0cmVkOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5yZ2IucmVkID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGdyZWVuOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5yZ2Jcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmdyZWVuID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGJsdWU6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLnJnYi5ibHVlID8/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGFscGhhOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5yZ2Jcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHh5elN0cmluZzoge1xuXHRcdFx0XHRcdFx0XHRcdHg6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLnh5ei54ID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdHk6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLnh5ei55ID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdHo6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLnh5ei56ID8/IDBcblx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdGFscGhhOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy54eXpcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRjc3NTdHJpbmdzOiB7XG5cdFx0XHRcdFx0XHRcdGNteWtDU1NTdHJpbmc6IGBjbXlrKCR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMuY215ay5jeWFufSUsICR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMuY215ay5tYWdlbnRhfSUsICR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMuY215ay55ZWxsb3d9JSwgJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5jbXlrLmtleX0lKWAsXG5cdFx0XHRcdFx0XHRcdGhleENTU1N0cmluZzogYCR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMuaGV4LmhleH0ke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmhleC5hbHBoYX1gLFxuXHRcdFx0XHRcdFx0XHRoc2xDU1NTdHJpbmc6IGBoc2woJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5oc2wuaHVlfSwgJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5oc2wuc2F0dXJhdGlvbn0lLCAke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmhzbC5saWdodG5lc3N9JSlgLFxuXHRcdFx0XHRcdFx0XHRoc3ZDU1NTdHJpbmc6IGBoc3YoJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5oc3YuaHVlfSwgJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5oc3Yuc2F0dXJhdGlvbn0lLCAke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmhzdi52YWx1ZX0lKWAsXG5cdFx0XHRcdFx0XHRcdGxhYkNTU1N0cmluZzogYGxhYigke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLmxhYi5sfSwgJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5sYWIuYX0sICR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubGFiLmJ9KWAsXG5cdFx0XHRcdFx0XHRcdHJnYkNTU1N0cmluZzogYHJnYigke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLnJnYi5yZWR9LCAke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLnJnYi5ncmVlbn0sICR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMucmdiLmJsdWV9KWAsXG5cdFx0XHRcdFx0XHRcdHh5ekNTU1N0cmluZzogYHh5eigke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLnh5ei54fSwgJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy54eXoueX0sICR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMueHl6Lnp9KWBcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdDogZmFsc2Vcblx0XHR9LFxuXHRcdGl0ZW1zOiBkYXRhLml0ZW1zLm1hcChpdGVtID0+ICh7XG5cdFx0XHRjb2xvcnM6IHtcblx0XHRcdFx0Y215azoge1xuXHRcdFx0XHRcdGN5YW46IGJyYW5kLmFzUGVyY2VudGlsZShpdGVtLmNvbG9ycy5jbXlrLmN5YW4gPz8gMCksXG5cdFx0XHRcdFx0bWFnZW50YTogYnJhbmQuYXNQZXJjZW50aWxlKGl0ZW0uY29sb3JzLmNteWsubWFnZW50YSA/PyAwKSxcblx0XHRcdFx0XHR5ZWxsb3c6IGJyYW5kLmFzUGVyY2VudGlsZShpdGVtLmNvbG9ycy5jbXlrLnllbGxvdyA/PyAwKSxcblx0XHRcdFx0XHRrZXk6IGJyYW5kLmFzUGVyY2VudGlsZShpdGVtLmNvbG9ycy5jbXlrLmtleSA/PyAwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKGl0ZW0uY29sb3JzLmNteWsuYWxwaGEgPz8gMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0aGV4OiB7XG5cdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldChpdGVtLmNvbG9ycy5oZXguaGV4ID8/ICcjMDAwMDAwRkYnKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoaXRlbS5jb2xvcnMuaGV4LmFscGhhID8/ICdGRicpLFxuXHRcdFx0XHRcdG51bUFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoaXRlbS5jb2xvcnMuaGV4Lm51bUFscGhhID8/IDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhzbDoge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoaXRlbS5jb2xvcnMuaHNsLmh1ZSA/PyAwKSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRpdGVtLmNvbG9ycy5oc2wuc2F0dXJhdGlvbiA/PyAwXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdGl0ZW0uY29sb3JzLmhzbC5saWdodG5lc3MgPz8gMFxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShpdGVtLmNvbG9ycy5oc2wuYWxwaGEgPz8gMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0aHN2OiB7XG5cdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChpdGVtLmNvbG9ycy5oc3YuaHVlID8/IDApLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdGl0ZW0uY29sb3JzLmhzdi5zYXR1cmF0aW9uID8/IDBcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdHZhbHVlOiBicmFuZC5hc1BlcmNlbnRpbGUoaXRlbS5jb2xvcnMuaHN2LnZhbHVlID8/IDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoaXRlbS5jb2xvcnMuaHN2LmFscGhhID8/IDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxhYjoge1xuXHRcdFx0XHRcdGw6IGJyYW5kLmFzTEFCX0woaXRlbS5jb2xvcnMubGFiLmwgPz8gMCksXG5cdFx0XHRcdFx0YTogYnJhbmQuYXNMQUJfQShpdGVtLmNvbG9ycy5sYWIuYSA/PyAwKSxcblx0XHRcdFx0XHRiOiBicmFuZC5hc0xBQl9CKGl0ZW0uY29sb3JzLmxhYi5iID8/IDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoaXRlbS5jb2xvcnMubGFiLmFscGhhID8/IDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHJnYjoge1xuXHRcdFx0XHRcdHJlZDogYnJhbmQuYXNCeXRlUmFuZ2UoaXRlbS5jb2xvcnMucmdiLnJlZCA/PyAwKSxcblx0XHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UoaXRlbS5jb2xvcnMucmdiLmdyZWVuID8/IDApLFxuXHRcdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKGl0ZW0uY29sb3JzLnJnYi5ibHVlID8/IDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoaXRlbS5jb2xvcnMucmdiLmFscGhhID8/IDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHh5ejoge1xuXHRcdFx0XHRcdHg6IGJyYW5kLmFzWFlaX1goaXRlbS5jb2xvcnMueHl6LnggPz8gMCksXG5cdFx0XHRcdFx0eTogYnJhbmQuYXNYWVpfWShpdGVtLmNvbG9ycy54eXoueSA/PyAwKSxcblx0XHRcdFx0XHR6OiBicmFuZC5hc1hZWl9aKGl0ZW0uY29sb3JzLnh5ei56ID8/IDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoaXRlbS5jb2xvcnMueHl6LmFscGhhID8/IDEpXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRjb2xvclN0cmluZ3M6IHtcblx0XHRcdFx0Y215a1N0cmluZzoge1xuXHRcdFx0XHRcdGN5YW46IFN0cmluZyhpdGVtLmNvbG9ycy5jbXlrLmN5YW4gPz8gMCksXG5cdFx0XHRcdFx0bWFnZW50YTogU3RyaW5nKGl0ZW0uY29sb3JzLmNteWsubWFnZW50YSA/PyAwKSxcblx0XHRcdFx0XHR5ZWxsb3c6IFN0cmluZyhpdGVtLmNvbG9ycy5jbXlrLnllbGxvdyA/PyAwKSxcblx0XHRcdFx0XHRrZXk6IFN0cmluZyhpdGVtLmNvbG9ycy5jbXlrLmtleSA/PyAwKSxcblx0XHRcdFx0XHRhbHBoYTogU3RyaW5nKGl0ZW0uY29sb3JzLmNteWsuYWxwaGEgPz8gMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0aGV4U3RyaW5nOiB7XG5cdFx0XHRcdFx0aGV4OiBTdHJpbmcoaXRlbS5jb2xvcnMuaGV4LmhleCA/PyAnIzAwMDAwMEZGJyksXG5cdFx0XHRcdFx0YWxwaGE6IFN0cmluZyhpdGVtLmNvbG9ycy5oZXguYWxwaGEgPz8gJ0ZGJyksXG5cdFx0XHRcdFx0bnVtQWxwaGE6IFN0cmluZyhpdGVtLmNvbG9ycy5oZXgubnVtQWxwaGEgPz8gMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0aHNsU3RyaW5nOiB7XG5cdFx0XHRcdFx0aHVlOiBTdHJpbmcoaXRlbS5jb2xvcnMuaHNsLmh1ZSA/PyAwKSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBTdHJpbmcoaXRlbS5jb2xvcnMuaHNsLnNhdHVyYXRpb24gPz8gMCksXG5cdFx0XHRcdFx0bGlnaHRuZXNzOiBTdHJpbmcoaXRlbS5jb2xvcnMuaHNsLmxpZ2h0bmVzcyA/PyAwKSxcblx0XHRcdFx0XHRhbHBoYTogU3RyaW5nKGl0ZW0uY29sb3JzLmhzbC5hbHBoYSA/PyAxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRoc3ZTdHJpbmc6IHtcblx0XHRcdFx0XHRodWU6IFN0cmluZyhpdGVtLmNvbG9ycy5oc3YuaHVlID8/IDApLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IFN0cmluZyhpdGVtLmNvbG9ycy5oc3Yuc2F0dXJhdGlvbiA/PyAwKSxcblx0XHRcdFx0XHR2YWx1ZTogU3RyaW5nKGl0ZW0uY29sb3JzLmhzdi52YWx1ZSA/PyAwKSxcblx0XHRcdFx0XHRhbHBoYTogU3RyaW5nKGl0ZW0uY29sb3JzLmhzdi5hbHBoYSA/PyAxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsYWJTdHJpbmc6IHtcblx0XHRcdFx0XHRsOiBTdHJpbmcoaXRlbS5jb2xvcnMubGFiLmwgPz8gMCksXG5cdFx0XHRcdFx0YTogU3RyaW5nKGl0ZW0uY29sb3JzLmxhYi5hID8/IDApLFxuXHRcdFx0XHRcdGI6IFN0cmluZyhpdGVtLmNvbG9ycy5sYWIuYiA/PyAwKSxcblx0XHRcdFx0XHRhbHBoYTogU3RyaW5nKGl0ZW0uY29sb3JzLmxhYi5hbHBoYSA/PyAxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRyZ2JTdHJpbmc6IHtcblx0XHRcdFx0XHRyZWQ6IFN0cmluZyhpdGVtLmNvbG9ycy5yZ2IucmVkID8/IDApLFxuXHRcdFx0XHRcdGdyZWVuOiBTdHJpbmcoaXRlbS5jb2xvcnMucmdiLmdyZWVuID8/IDApLFxuXHRcdFx0XHRcdGJsdWU6IFN0cmluZyhpdGVtLmNvbG9ycy5yZ2IuYmx1ZSA/PyAwKSxcblx0XHRcdFx0XHRhbHBoYTogU3RyaW5nKGl0ZW0uY29sb3JzLnJnYi5hbHBoYSA/PyAxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR4eXpTdHJpbmc6IHtcblx0XHRcdFx0XHR4OiBTdHJpbmcoaXRlbS5jb2xvcnMueHl6LnggPz8gMCksXG5cdFx0XHRcdFx0eTogU3RyaW5nKGl0ZW0uY29sb3JzLnh5ei55ID8/IDApLFxuXHRcdFx0XHRcdHo6IFN0cmluZyhpdGVtLmNvbG9ycy54eXoueiA/PyAwKSxcblx0XHRcdFx0XHRhbHBoYTogU3RyaW5nKGl0ZW0uY29sb3JzLnh5ei5hbHBoYSA/PyAxKVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0Y3NzU3RyaW5nczoge1xuXHRcdFx0XHRjbXlrQ1NTU3RyaW5nOiBgY215aygke2l0ZW0uY29sb3JzLmNteWsuY3lhbn0lLCAke2l0ZW0uY29sb3JzLmNteWsubWFnZW50YX0lLCAke2l0ZW0uY29sb3JzLmNteWsueWVsbG93fSUsICR7aXRlbS5jb2xvcnMuY215ay5rZXl9JSlgLFxuXHRcdFx0XHRoZXhDU1NTdHJpbmc6IGl0ZW0uY29sb3JzLmhleC5oZXgsXG5cdFx0XHRcdGhzbENTU1N0cmluZzogYGhzbCgke2l0ZW0uY29sb3JzLmhzbC5odWV9LCAke2l0ZW0uY29sb3JzLmhzbC5zYXR1cmF0aW9ufSUsICR7aXRlbS5jb2xvcnMuaHNsLmxpZ2h0bmVzc30lKWAsXG5cdFx0XHRcdGhzdkNTU1N0cmluZzogYGhzdigke2l0ZW0uY29sb3JzLmhzdi5odWV9LCAke2l0ZW0uY29sb3JzLmhzdi5zYXR1cmF0aW9ufSUsICR7aXRlbS5jb2xvcnMuaHN2LnZhbHVlfSUpYCxcblx0XHRcdFx0bGFiQ1NTU3RyaW5nOiBgbGFiKCR7aXRlbS5jb2xvcnMubGFiLmx9LCAke2l0ZW0uY29sb3JzLmxhYi5hfSwgJHtpdGVtLmNvbG9ycy5sYWIuYn0pYCxcblx0XHRcdFx0cmdiQ1NTU3RyaW5nOiBgcmdiKCR7aXRlbS5jb2xvcnMucmdiLnJlZH0sICR7aXRlbS5jb2xvcnMucmdiLmdyZWVufSwgJHtpdGVtLmNvbG9ycy5yZ2IuYmx1ZX0pYCxcblx0XHRcdFx0eHl6Q1NTU3RyaW5nOiBgeHl6KCR7aXRlbS5jb2xvcnMueHl6Lnh9LCAke2l0ZW0uY29sb3JzLnh5ei55fSwgJHtpdGVtLmNvbG9ycy54eXouen0pYFxuXHRcdFx0fVxuXHRcdH0pKVxuXHR9O1xufVxuXG5mdW5jdGlvbiBjb21wb25lbnRUb0hleChjb21wb25lbnQ6IG51bWJlcik6IHN0cmluZyB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgaGV4ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBjb21wb25lbnQpKS50b1N0cmluZygxNik7XG5cblx0XHRyZXR1cm4gaGV4Lmxlbmd0aCA9PT0gMSA/ICcwJyArIGhleCA6IGhleDtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbW9kZS5sb2dnaW5nLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKGBjb21wb25lbnRUb0hleCBlcnJvcjogJHtlcnJvcn1gKTtcblxuXHRcdHJldHVybiAnMDAnO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRDb2xvclZhbHVlKGNvbG9yOiBDb2xvclVuYnJhbmRlZCk6IENvbG9yIHtcblx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRjYXNlICdjbXlrJzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0Y3lhbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdG1hZ2VudGE6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHR5ZWxsb3c6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRrZXk6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoJyMwMDAwMDAnKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoJ0ZGJyksXG5cdFx0XHRcdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoMCksXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fTtcblx0XHRjYXNlICdoc3YnOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKDApLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0fTtcblx0XHRjYXNlICdsYWInOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRsOiBicmFuZC5hc0xBQl9MKDApLFxuXHRcdFx0XHRcdGE6IGJyYW5kLmFzTEFCX0EoMCksXG5cdFx0XHRcdFx0YjogYnJhbmQuYXNMQUJfQigwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdH07XG5cdFx0Y2FzZSAncmdiJzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZSgwKSxcblx0XHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UoMCksXG5cdFx0XHRcdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2UoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ3NsJzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnc2wnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ3N2Jzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdHZhbHVlOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzdidcblx0XHRcdH07XG5cdFx0Y2FzZSAneHl6Jzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0eDogYnJhbmQuYXNYWVpfWCgwKSxcblx0XHRcdFx0XHR5OiBicmFuZC5hc1hZWl9ZKDApLFxuXHRcdFx0XHRcdHo6IGJyYW5kLmFzWFlaX1ooMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0XHR9O1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFxuXHRcdFx0XHRVbmtub3duIGNvbG9yIGZvcm1hdFxcbkRldGFpbHM6ICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWApO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBiYXNlOiBDb21tb25GdW5jdGlvbnNNYXN0ZXJJbnRlcmZhY2VbJ3RyYW5zZm9ybSddID0ge1xuXHRhZGRIYXNoVG9IZXgsXG5cdGNvbXBvbmVudFRvSGV4LFxuXHRicmFuZFBhbGV0dGUsXG5cdGRlZmF1bHRDb2xvclZhbHVlXG59O1xuXG5leHBvcnQgeyBjb21wb25lbnRUb0hleCB9O1xuIl19