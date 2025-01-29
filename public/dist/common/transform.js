// File: common/transform.js
import { brand } from './core.js';
import { createLogger } from '../logger/index.js';
import { modeData as mode } from '../data/mode.js';
const thisModule = 'common/transform/base.ts';
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
                        main: {
                            cmyk: {
                                cyan: brand.asPercentile(data.metadata.customColor.colors.main
                                    .cmyk.cyan ?? 0),
                                magenta: brand.asPercentile(data.metadata.customColor.colors.main
                                    .cmyk.magenta ?? 0),
                                yellow: brand.asPercentile(data.metadata.customColor.colors.main
                                    .cmyk.yellow ?? 0),
                                key: brand.asPercentile(data.metadata.customColor.colors.main
                                    .cmyk.key ?? 0),
                                alpha: brand.asAlphaRange(data.metadata.customColor.colors.main
                                    .cmyk.alpha ?? 1)
                            },
                            hex: {
                                hex: brand.asHexSet(data.metadata.customColor.colors.main
                                    .hex.hex ?? '#000000FF'),
                                alpha: brand.asHexComponent(data.metadata.customColor.colors.main
                                    .hex.alpha ?? 'FF'),
                                numAlpha: brand.asAlphaRange(data.metadata.customColor.colors.main
                                    .hex.numAlpha ?? 1)
                            },
                            hsl: {
                                hue: brand.asRadial(data.metadata.customColor.colors.main
                                    .hsl.hue ?? 0),
                                saturation: brand.asPercentile(data.metadata.customColor.colors.main
                                    .hsl.saturation ?? 0),
                                lightness: brand.asPercentile(data.metadata.customColor.colors.main
                                    .hsl.lightness ?? 0),
                                alpha: brand.asAlphaRange(data.metadata.customColor.colors.main
                                    .hsl.alpha ?? 1)
                            },
                            hsv: {
                                hue: brand.asRadial(data.metadata.customColor.colors.main
                                    .hsv.hue ?? 0),
                                saturation: brand.asPercentile(data.metadata.customColor.colors.main
                                    .hsv.saturation ?? 0),
                                value: brand.asPercentile(data.metadata.customColor.colors.main
                                    .hsv.value ?? 0),
                                alpha: brand.asAlphaRange(data.metadata.customColor.colors.main
                                    .hsv.alpha ?? 1)
                            },
                            lab: {
                                l: brand.asLAB_L(data.metadata.customColor.colors.main
                                    .lab.l ?? 0),
                                a: brand.asLAB_A(data.metadata.customColor.colors.main
                                    .lab.a ?? 0),
                                b: brand.asLAB_B(data.metadata.customColor.colors.main
                                    .lab.b ?? 0),
                                alpha: brand.asAlphaRange(data.metadata.customColor.colors.main
                                    .lab.alpha ?? 1)
                            },
                            rgb: {
                                red: brand.asByteRange(data.metadata.customColor.colors.main
                                    .rgb.red ?? 0),
                                green: brand.asByteRange(data.metadata.customColor.colors.main
                                    .rgb.green ?? 0),
                                blue: brand.asByteRange(data.metadata.customColor.colors.main
                                    .rgb.blue ?? 0),
                                alpha: brand.asAlphaRange(data.metadata.customColor.colors.main
                                    .rgb.alpha ?? 1)
                            },
                            xyz: {
                                x: brand.asXYZ_X(data.metadata.customColor.colors.main
                                    .xyz.x ?? 0),
                                y: brand.asXYZ_Y(data.metadata.customColor.colors.main
                                    .xyz.y ?? 0),
                                z: brand.asXYZ_Z(data.metadata.customColor.colors.main
                                    .xyz.z ?? 0),
                                alpha: brand.asAlphaRange(data.metadata.customColor.colors.main
                                    .xyz.alpha ?? 1)
                            }
                        },
                        stringProps: {
                            cmyk: {
                                cyan: String(data.metadata.customColor.colors.main
                                    .cmyk.cyan ?? 0),
                                magenta: String(data.metadata.customColor.colors.main
                                    .cmyk.magenta ?? 0),
                                yellow: String(data.metadata.customColor.colors.main
                                    .cmyk.yellow ?? 0),
                                key: String(data.metadata.customColor.colors.main
                                    .cmyk.key ?? 0),
                                alpha: String(data.metadata.customColor.colors.main
                                    .cmyk.alpha ?? 1)
                            },
                            hex: {
                                hex: String(data.metadata.customColor.colors.main
                                    .hex.hex ?? '#000000FF'),
                                alpha: String(data.metadata.customColor.colors.main
                                    .hex.alpha ?? 'FF'),
                                numAlpha: String(data.metadata.customColor.colors.main
                                    .hex.numAlpha ?? 1)
                            },
                            hsl: {
                                hue: String(data.metadata.customColor.colors.main
                                    .hsl.hue ?? 0),
                                saturation: String(data.metadata.customColor.colors.main
                                    .hsl.saturation ?? 0),
                                lightness: String(data.metadata.customColor.colors.main
                                    .hsl.lightness ?? 0),
                                alpha: String(data.metadata.customColor.colors.main
                                    .hsl.alpha ?? 1)
                            },
                            hsv: {
                                hue: String(data.metadata.customColor.colors.main
                                    .hsv.hue ?? 0),
                                saturation: String(data.metadata.customColor.colors.main
                                    .hsv.saturation ?? 0),
                                value: String(data.metadata.customColor.colors.main
                                    .hsv.value ?? 0),
                                alpha: String(data.metadata.customColor.colors.main
                                    .hsv.alpha ?? 1)
                            },
                            lab: {
                                l: String(data.metadata.customColor.colors.main
                                    .lab.l ?? 0),
                                a: String(data.metadata.customColor.colors.main
                                    .lab.a ?? 0),
                                b: String(data.metadata.customColor.colors.main
                                    .lab.b ?? 0),
                                alpha: String(data.metadata.customColor.colors.main
                                    .lab.alpha ?? 1)
                            },
                            rgb: {
                                red: String(data.metadata.customColor.colors.main
                                    .rgb.red ?? 0),
                                green: String(data.metadata.customColor.colors.main
                                    .rgb.green ?? 0),
                                blue: String(data.metadata.customColor.colors.main
                                    .rgb.blue ?? 0),
                                alpha: String(data.metadata.customColor.colors.main
                                    .rgb.alpha ?? 1)
                            },
                            xyz: {
                                x: String(data.metadata.customColor.colors.main
                                    .xyz.x ?? 0),
                                y: String(data.metadata.customColor.colors.main
                                    .xyz.y ?? 0),
                                z: String(data.metadata.customColor.colors.main
                                    .xyz.z ?? 0),
                                alpha: String(data.metadata.customColor.colors.main
                                    .xyz.alpha ?? 1)
                            }
                        },
                        css: {
                            cmyk: `cmyk(${data.metadata.customColor.colors.main.cmyk.cyan}%, ${data.metadata.customColor.colors.main.cmyk.magenta}%, ${data.metadata.customColor.colors.main.cmyk.yellow}%, ${data.metadata.customColor.colors.main.cmyk.key}%)`,
                            hex: `${data.metadata.customColor.colors.main.hex.hex}${data.metadata.customColor.colors.main.hex.alpha}`,
                            hsl: `hsl(${data.metadata.customColor.colors.main.hsl.hue}, ${data.metadata.customColor.colors.main.hsl.saturation}%, ${data.metadata.customColor.colors.main.hsl.lightness}%)`,
                            hsv: `hsv(${data.metadata.customColor.colors.main.hsv.hue}, ${data.metadata.customColor.colors.main.hsv.saturation}%, ${data.metadata.customColor.colors.main.hsv.value}%)`,
                            lab: `lab(${data.metadata.customColor.colors.main.lab.l}, ${data.metadata.customColor.colors.main.lab.a}, ${data.metadata.customColor.colors.main.lab.b})`,
                            rgb: `rgb(${data.metadata.customColor.colors.main.rgb.red}, ${data.metadata.customColor.colors.main.rgb.green}, ${data.metadata.customColor.colors.main.rgb.blue})`,
                            xyz: `xyz(${data.metadata.customColor.colors.main.xyz.x}, ${data.metadata.customColor.colors.main.xyz.y}, ${data.metadata.customColor.colors.main.xyz.z})`
                        }
                    }
                }
                : false
        },
        items: data.items.map(item => ({
            colors: {
                main: {
                    cmyk: {
                        cyan: brand.asPercentile(item.colors.main.cmyk.cyan ?? 0),
                        magenta: brand.asPercentile(item.colors.main.cmyk.magenta ?? 0),
                        yellow: brand.asPercentile(item.colors.main.cmyk.yellow ?? 0),
                        key: brand.asPercentile(item.colors.main.cmyk.key ?? 0),
                        alpha: brand.asAlphaRange(item.colors.main.cmyk.alpha ?? 1)
                    },
                    hex: {
                        hex: brand.asHexSet(item.colors.main.hex.hex ?? '#000000FF'),
                        alpha: brand.asHexComponent(item.colors.main.hex.alpha ?? 'FF'),
                        numAlpha: brand.asAlphaRange(item.colors.main.hex.numAlpha ?? 1)
                    },
                    hsl: {
                        hue: brand.asRadial(item.colors.main.hsl.hue ?? 0),
                        saturation: brand.asPercentile(item.colors.main.hsl.saturation ?? 0),
                        lightness: brand.asPercentile(item.colors.main.hsl.lightness ?? 0),
                        alpha: brand.asAlphaRange(item.colors.main.hsl.alpha ?? 1)
                    },
                    hsv: {
                        hue: brand.asRadial(item.colors.main.hsv.hue ?? 0),
                        saturation: brand.asPercentile(item.colors.main.hsv.saturation ?? 0),
                        value: brand.asPercentile(item.colors.main.hsv.value ?? 0),
                        alpha: brand.asAlphaRange(item.colors.main.hsv.alpha ?? 1)
                    },
                    lab: {
                        l: brand.asLAB_L(item.colors.main.lab.l ?? 0),
                        a: brand.asLAB_A(item.colors.main.lab.a ?? 0),
                        b: brand.asLAB_B(item.colors.main.lab.b ?? 0),
                        alpha: brand.asAlphaRange(item.colors.main.lab.alpha ?? 1)
                    },
                    rgb: {
                        red: brand.asByteRange(item.colors.main.rgb.red ?? 0),
                        green: brand.asByteRange(item.colors.main.rgb.green ?? 0),
                        blue: brand.asByteRange(item.colors.main.rgb.blue ?? 0),
                        alpha: brand.asAlphaRange(item.colors.main.rgb.alpha ?? 1)
                    },
                    xyz: {
                        x: brand.asXYZ_X(item.colors.main.xyz.x ?? 0),
                        y: brand.asXYZ_Y(item.colors.main.xyz.y ?? 0),
                        z: brand.asXYZ_Z(item.colors.main.xyz.z ?? 0),
                        alpha: brand.asAlphaRange(item.colors.main.xyz.alpha ?? 1)
                    }
                },
                stringProps: {
                    cmyk: {
                        cyan: String(item.colors.main.cmyk.cyan ?? 0),
                        magenta: String(item.colors.main.cmyk.magenta ?? 0),
                        yellow: String(item.colors.main.cmyk.yellow ?? 0),
                        key: String(item.colors.main.cmyk.key ?? 0),
                        alpha: String(item.colors.main.cmyk.alpha ?? 1)
                    },
                    hex: {
                        hex: String(item.colors.main.hex.hex ?? '#000000FF'),
                        alpha: String(item.colors.main.hex.alpha ?? 'FF'),
                        numAlpha: String(item.colors.main.hex.numAlpha ?? 1)
                    },
                    hsl: {
                        hue: String(item.colors.main.hsl.hue ?? 0),
                        saturation: String(item.colors.main.hsl.saturation ?? 0),
                        lightness: String(item.colors.main.hsl.lightness ?? 0),
                        alpha: String(item.colors.main.hsl.alpha ?? 1)
                    },
                    hsv: {
                        hue: String(item.colors.main.hsv.hue ?? 0),
                        saturation: String(item.colors.main.hsv.saturation ?? 0),
                        value: String(item.colors.main.hsv.value ?? 0),
                        alpha: String(item.colors.main.hsv.alpha ?? 1)
                    },
                    lab: {
                        l: String(item.colors.main.lab.l ?? 0),
                        a: String(item.colors.main.lab.a ?? 0),
                        b: String(item.colors.main.lab.b ?? 0),
                        alpha: String(item.colors.main.lab.alpha ?? 1)
                    },
                    rgb: {
                        red: String(item.colors.main.rgb.red ?? 0),
                        green: String(item.colors.main.rgb.green ?? 0),
                        blue: String(item.colors.main.rgb.blue ?? 0),
                        alpha: String(item.colors.main.rgb.alpha ?? 1)
                    },
                    xyz: {
                        x: String(item.colors.main.xyz.x ?? 0),
                        y: String(item.colors.main.xyz.y ?? 0),
                        z: String(item.colors.main.xyz.z ?? 0),
                        alpha: String(item.colors.main.xyz.alpha ?? 1)
                    }
                },
                css: {
                    cmyk: `cmyk(${item.colors.main.cmyk.cyan}%, ${item.colors.main.cmyk.magenta}%, ${item.colors.main.cmyk.yellow}%, ${item.colors.main.cmyk.key}%, ${item.colors.main.cmyk.alpha})`,
                    hex: `${item.colors.main.hex.hex}${item.colors.main.hex.alpha}`,
                    hsl: `hsl(${item.colors.main.hsl.hue}, ${item.colors.main.hsl.saturation}%, ${item.colors.main.hsl.lightness}%, ${item.colors.main.hsl.alpha})`,
                    hsv: `hsv(${item.colors.main.hsv.hue}, ${item.colors.main.hsv.saturation}%, ${item.colors.main.hsv.value}%, ${item.colors.main.hsv.alpha})`,
                    lab: `lab(${item.colors.main.lab.l}, ${item.colors.main.lab.a}, ${item.colors.main.lab.b}, ${item.colors.main.lab.alpha})`,
                    rgb: `rgb(${item.colors.main.rgb.red}, ${item.colors.main.rgb.green}, ${item.colors.main.rgb.blue}, ${item.colors.main.rgb.alpha})`,
                    xyz: `xyz(${item.colors.main.xyz.x}, ${item.colors.main.xyz.y}, ${item.colors.main.xyz.z}, ${item.colors.main.xyz.alpha})`
                }
            }
        }))
    };
}
function componentToHex(component) {
    const thisMethod = 'common > transform > base > componentToHex()';
    try {
        const hex = Math.max(0, Math.min(255, component)).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
    catch (error) {
        if (!mode.quiet && mode.logging.error)
            logger.error(`componentToHex error: ${error}`, `${thisModule} > ${thisMethod}`);
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
export const transformUtils = {
    addHashToHex,
    componentToHex,
    brandPalette,
    defaultColorValue
};
export { componentToHex };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1vbi90cmFuc2Zvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNEJBQTRCO0FBVTVCLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxRQUFRLElBQUksSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFbkQsTUFBTSxVQUFVLEdBQUcsMEJBQTBCLENBQUM7QUFFOUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxTQUFTLFlBQVksQ0FBQyxHQUFRO0lBQzdCLElBQUksQ0FBQztRQUNKLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztZQUNuQyxDQUFDLENBQUMsR0FBRztZQUNMLENBQUMsQ0FBQztnQkFDQSxLQUFLLEVBQUU7b0JBQ04sR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUM7b0JBQ3JDLEtBQUssRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDO29CQUNoRCxRQUFRLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztpQkFDaEQ7Z0JBQ0QsTUFBTSxFQUFFLEtBQWM7YUFDdEIsQ0FBQztJQUNMLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDakQsQ0FBQztBQUNGLENBQUM7QUFDRCxTQUFTLFlBQVksQ0FBQyxJQUFzQjtJQUMzQyxPQUFPO1FBQ04sR0FBRyxJQUFJO1FBQ1AsUUFBUSxFQUFFO1lBQ1QsR0FBRyxJQUFJLENBQUMsUUFBUTtZQUNoQixXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXO2dCQUNyQyxDQUFDLENBQUM7b0JBQ0EsTUFBTSxFQUFFO3dCQUNQLElBQUksRUFBRTs0QkFDTCxJQUFJLEVBQUU7Z0NBQ0wsSUFBSSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJO3FDQUNuQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FDaEI7Z0NBQ0QsT0FBTyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJO3FDQUNuQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FDbkI7Z0NBQ0QsTUFBTSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJO3FDQUNuQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FDbEI7Z0NBQ0QsR0FBRyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJO3FDQUNuQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FDZjtnQ0FDRCxLQUFLLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUk7cUNBQ25DLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUNqQjs2QkFDRDs0QkFDRCxHQUFHLEVBQUU7Z0NBQ0osR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJO3FDQUNuQyxHQUFHLENBQUMsR0FBRyxJQUFJLFdBQVcsQ0FDeEI7Z0NBQ0QsS0FBSyxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJO3FDQUNuQyxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksQ0FDbkI7Z0NBQ0QsUUFBUSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJO3FDQUNuQyxHQUFHLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FDbkI7NkJBQ0Q7NEJBQ0QsR0FBRyxFQUFFO2dDQUNKLEdBQUcsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSTtxQ0FDbkMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQ2Q7Z0NBQ0QsVUFBVSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJO3FDQUNuQyxHQUFHLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FDckI7Z0NBQ0QsU0FBUyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJO3FDQUNuQyxHQUFHLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FDcEI7Z0NBQ0QsS0FBSyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJO3FDQUNuQyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FDaEI7NkJBQ0Q7NEJBQ0QsR0FBRyxFQUFFO2dDQUNKLEdBQUcsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSTtxQ0FDbkMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQ2Q7Z0NBQ0QsVUFBVSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQzdCLElBQUksQ0FBQyxRQUFR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QyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFOzRCQUN6RyxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSTs0QkFDL0ssR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUk7NEJBQzNLLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHOzRCQUMxSixHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUss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TyxJQUFJLENBQUMsQ0FBQzt3QkFDbkQsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQzt3QkFDakQsR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQzt3QkFDM0MsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztxQkFDL0M7b0JBQ0QsR0FBRyxFQUFFO3dCQUNKLEdBQUcsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxXQUFXLENBQUM7d0JBQ3BELEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7d0JBQ2pELFFBQVEsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUM7cUJBQ3BEO29CQUNELEdBQUcsRUFBRTt3QkFDSixHQUFHLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO3dCQUMxQyxVQUFVLEVBQUUsTUFBTSxDQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FDcEM7d0JBQ0QsU0FBUyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQzt3QkFDdEQsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztxQkFDOUM7b0JBQ0QsR0FBRyxFQUFFO3dCQUNKLEdBQUcsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7d0JBQzFDLFVBQVUsRUFBRSxNQUFNLENBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUNwQzt3QkFDRCxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO3dCQUM5QyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO3FCQUM5QztvQkFDRCxHQUFHLEVBQUU7d0JBQ0osQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDdEMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDdEMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDdEMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztxQkFDOUM7b0JBQ0QsR0FBRyxFQUFFO3dCQUNKLEdBQUcsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7d0JBQzFDLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7d0JBQzlDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7d0JBQzVDLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7cUJBQzlDO29CQUNELEdBQUcsRUFBRTt3QkFDSixDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN0QyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN0QyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN0QyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO3FCQUM5QztpQkFDRDtnQkFDRCxHQUFHLEVBQUU7b0JBQ0osSUFBSSxFQUFFLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHO29CQUNoTCxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQy9ELEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUc7b0JBQy9JLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUc7b0JBQzNJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUc7b0JBQzFILEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENB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b0JBQ2hDLEtBQUssRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztpQkFDNUI7Z0JBQ0QsTUFBTSxFQUFFLElBQUk7YUFDWixDQUFDO1FBQ0gsS0FBSyxJQUFJO1lBQ1IsT0FBTztnQkFDTixLQUFLLEVBQUU7b0JBQ04sVUFBVSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxLQUFLLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQzVCLEtBQUssRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztpQkFDNUI7Z0JBQ0QsTUFBTSxFQUFFLElBQUk7YUFDWixDQUFDO1FBQ0gsS0FBSyxLQUFLO1lBQ1QsT0FBTztnQkFDTixLQUFLLEVBQUU7b0JBQ04sQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNuQixDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ25CLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsS0FBSyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUM1QjtnQkFDRCxNQUFNLEVBQUUsS0FBSzthQUNiLENBQUM7UUFDSDtZQUNDLE1BQU0sSUFBSSxLQUFLLENBQUM7cUNBQ2tCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzdELENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUEwQztJQUNwRSxZQUFZO0lBQ1osY0FBYztJQUNkLFlBQVk7SUFDWixpQkFBaUI7Q0FDakIsQ0FBQztBQUVGLE9BQU8sRUFBRSxjQUFjLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IGNvbW1vbi90cmFuc2Zvcm0uanNcblxuaW1wb3J0IHtcblx0Q29sb3IsXG5cdENvbW1vbkZuX01hc3RlckludGVyZmFjZSxcblx0SGV4LFxuXHRQYWxldHRlLFxuXHRVbmJyYW5kZWRDb2xvcixcblx0VW5icmFuZGVkUGFsZXR0ZVxufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBicmFuZCB9IGZyb20gJy4vY29yZS5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuLi9sb2dnZXIvaW5kZXguanMnO1xuaW1wb3J0IHsgbW9kZURhdGEgYXMgbW9kZSB9IGZyb20gJy4uL2RhdGEvbW9kZS5qcyc7XG5cbmNvbnN0IHRoaXNNb2R1bGUgPSAnY29tbW9uL3RyYW5zZm9ybS9iYXNlLnRzJztcblxuY29uc3QgbG9nZ2VyID0gYXdhaXQgY3JlYXRlTG9nZ2VyKCk7XG5cbmZ1bmN0aW9uIGFkZEhhc2hUb0hleChoZXg6IEhleCk6IEhleCB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGhleC52YWx1ZS5oZXguc3RhcnRzV2l0aCgnIycpXG5cdFx0XHQ/IGhleFxuXHRcdFx0OiB7XG5cdFx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoYCMke2hleC52YWx1ZX19YCksXG5cdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoYCMkaGV4LnZhbHVlLmFscGhhYCksXG5cdFx0XHRcdFx0XHRudW1BbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKGhleC52YWx1ZS5udW1BbHBoYSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGZvcm1hdDogJ2hleCcgYXMgJ2hleCdcblx0XHRcdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYGFkZEhhc2hUb0hleCBlcnJvcjogJHtlcnJvcn1gKTtcblx0fVxufVxuZnVuY3Rpb24gYnJhbmRQYWxldHRlKGRhdGE6IFVuYnJhbmRlZFBhbGV0dGUpOiBQYWxldHRlIHtcblx0cmV0dXJuIHtcblx0XHQuLi5kYXRhLFxuXHRcdG1ldGFkYXRhOiB7XG5cdFx0XHQuLi5kYXRhLm1ldGFkYXRhLFxuXHRcdFx0Y3VzdG9tQ29sb3I6IGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3Jcblx0XHRcdFx0PyB7XG5cdFx0XHRcdFx0XHRjb2xvcnM6IHtcblx0XHRcdFx0XHRcdFx0bWFpbjoge1xuXHRcdFx0XHRcdFx0XHRcdGNteWs6IHtcblx0XHRcdFx0XHRcdFx0XHRcdGN5YW46IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5jbXlrLmN5YW4gPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdG1hZ2VudGE6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5jbXlrLm1hZ2VudGEgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdHllbGxvdzogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmNteWsueWVsbG93ID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHRrZXk6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5jbXlrLmtleSA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5jbXlrLmFscGhhID8/IDFcblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdGhleDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldChcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5oZXguaGV4ID8/ICcjMDAwMDAwRkYnXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzSGV4Q29tcG9uZW50KFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmhleC5hbHBoYSA/PyAnRkYnXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5oZXgubnVtQWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0aHNsOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmhzbC5odWUgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5oc2wuc2F0dXJhdGlvbiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0bGlnaHRuZXNzOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuaHNsLmxpZ2h0bmVzcyA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5oc2wuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0aHN2OiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Lmhzdi5odWUgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5oc3Yuc2F0dXJhdGlvbiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5oc3YudmFsdWUgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuaHN2LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdGxhYjoge1xuXHRcdFx0XHRcdFx0XHRcdFx0bDogYnJhbmQuYXNMQUJfTChcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5sYWIubCA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0YTogYnJhbmQuYXNMQUJfQShcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5sYWIuYSA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0YjogYnJhbmQuYXNMQUJfQihcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5sYWIuYiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5sYWIuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0cmdiOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZWQ6IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LnJnYi5yZWQgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdGdyZWVuOiBicmFuZC5hc0J5dGVSYW5nZShcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5yZ2IuZ3JlZW4gPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdGJsdWU6IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LnJnYi5ibHVlID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LnJnYi5hbHBoYSA/PyAxXG5cdFx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHR4eXo6IHtcblx0XHRcdFx0XHRcdFx0XHRcdHg6IGJyYW5kLmFzWFlaX1goXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQueHl6LnggPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdHk6IGJyYW5kLmFzWFlaX1koXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQueHl6LnkgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdHo6IGJyYW5kLmFzWFlaX1ooXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQueHl6LnogPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQueHl6LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHN0cmluZ1Byb3BzOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y215azoge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y3lhbjogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmNteWsuY3lhbiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0bWFnZW50YTogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmNteWsubWFnZW50YSA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0eWVsbG93OiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuY215ay55ZWxsb3cgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdGtleTogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmNteWsua2V5ID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHRhbHBoYTogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmNteWsuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0aGV4OiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRoZXg6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5oZXguaGV4ID8/ICcjMDAwMDAwRkYnXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0YWxwaGE6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5oZXguYWxwaGEgPz8gJ0ZGJ1xuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdG51bUFscGhhOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuaGV4Lm51bUFscGhhID8/IDFcblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdGhzbDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0aHVlOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuaHNsLmh1ZSA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmhzbC5zYXR1cmF0aW9uID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHRsaWdodG5lc3M6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5oc2wubGlnaHRuZXNzID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHRhbHBoYTogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmhzbC5hbHBoYSA/PyAxXG5cdFx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRoc3Y6IHtcblx0XHRcdFx0XHRcdFx0XHRcdGh1ZTogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Lmhzdi5odWUgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdHNhdHVyYXRpb246IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5oc3Yuc2F0dXJhdGlvbiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5oc3YudmFsdWUgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdGFscGhhOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuaHN2LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdGxhYjoge1xuXHRcdFx0XHRcdFx0XHRcdFx0bDogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmxhYi5sID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHRhOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQubGFiLmEgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdGI6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5sYWIuYiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0YWxwaGE6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5sYWIuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0cmdiOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZWQ6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5yZ2IucmVkID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHRncmVlbjogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LnJnYi5ncmVlbiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0Ymx1ZTogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LnJnYi5ibHVlID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHRhbHBoYTogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LnJnYi5hbHBoYSA/PyAxXG5cdFx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHR4eXo6IHtcblx0XHRcdFx0XHRcdFx0XHRcdHg6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC54eXoueCA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0eTogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Lnh5ei55ID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHR6OiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQueHl6LnogPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdGFscGhhOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQueHl6LmFscGhhID8/IDFcblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGNzczoge1xuXHRcdFx0XHRcdFx0XHRcdGNteWs6IGBjbXlrKCR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpbi5jbXlrLmN5YW59JSwgJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluLmNteWsubWFnZW50YX0lLCAke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW4uY215ay55ZWxsb3d9JSwgJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluLmNteWsua2V5fSUpYCxcblx0XHRcdFx0XHRcdFx0XHRoZXg6IGAke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW4uaGV4LmhleH0ke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW4uaGV4LmFscGhhfWAsXG5cdFx0XHRcdFx0XHRcdFx0aHNsOiBgaHNsKCR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpbi5oc2wuaHVlfSwgJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluLmhzbC5zYXR1cmF0aW9ufSUsICR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpbi5oc2wubGlnaHRuZXNzfSUpYCxcblx0XHRcdFx0XHRcdFx0XHRoc3Y6IGBoc3YoJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluLmhzdi5odWV9LCAke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW4uaHN2LnNhdHVyYXRpb259JSwgJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluLmhzdi52YWx1ZX0lKWAsXG5cdFx0XHRcdFx0XHRcdFx0bGFiOiBgbGFiKCR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpbi5sYWIubH0sICR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpbi5sYWIuYX0sICR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpbi5sYWIuYn0pYCxcblx0XHRcdFx0XHRcdFx0XHRyZ2I6IGByZ2IoJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluLnJnYi5yZWR9LCAke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW4ucmdiLmdyZWVufSwgJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluLnJnYi5ibHVlfSlgLFxuXHRcdFx0XHRcdFx0XHRcdHh5ejogYHh5eigke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW4ueHl6Lnh9LCAke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW4ueHl6Lnl9LCAke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW4ueHl6Lnp9KWBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0OiBmYWxzZVxuXHRcdH0sXG5cdFx0aXRlbXM6IGRhdGEuaXRlbXMubWFwKGl0ZW0gPT4gKHtcblx0XHRcdGNvbG9yczoge1xuXHRcdFx0XHRtYWluOiB7XG5cdFx0XHRcdFx0Y215azoge1xuXHRcdFx0XHRcdFx0Y3lhbjogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRpdGVtLmNvbG9ycy5tYWluLmNteWsuY3lhbiA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0bWFnZW50YTogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRpdGVtLmNvbG9ycy5tYWluLmNteWsubWFnZW50YSA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0eWVsbG93OiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdGl0ZW0uY29sb3JzLm1haW4uY215ay55ZWxsb3cgPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGtleTogYnJhbmQuYXNQZXJjZW50aWxlKGl0ZW0uY29sb3JzLm1haW4uY215ay5rZXkgPz8gMCksXG5cdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRpdGVtLmNvbG9ycy5tYWluLmNteWsuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aGV4OiB7XG5cdFx0XHRcdFx0XHRoZXg6IGJyYW5kLmFzSGV4U2V0KFxuXHRcdFx0XHRcdFx0XHRpdGVtLmNvbG9ycy5tYWluLmhleC5oZXggPz8gJyMwMDAwMDBGRidcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoXG5cdFx0XHRcdFx0XHRcdGl0ZW0uY29sb3JzLm1haW4uaGV4LmFscGhhID8/ICdGRidcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRudW1BbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRpdGVtLmNvbG9ycy5tYWluLmhleC5udW1BbHBoYSA/PyAxXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRoc2w6IHtcblx0XHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoaXRlbS5jb2xvcnMubWFpbi5oc2wuaHVlID8/IDApLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRpdGVtLmNvbG9ycy5tYWluLmhzbC5zYXR1cmF0aW9uID8/IDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0aXRlbS5jb2xvcnMubWFpbi5oc2wubGlnaHRuZXNzID8/IDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRpdGVtLmNvbG9ycy5tYWluLmhzbC5hbHBoYSA/PyAxXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRoc3Y6IHtcblx0XHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoaXRlbS5jb2xvcnMubWFpbi5oc3YuaHVlID8/IDApLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRpdGVtLmNvbG9ycy5tYWluLmhzdi5zYXR1cmF0aW9uID8/IDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRpdGVtLmNvbG9ycy5tYWluLmhzdi52YWx1ZSA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0aXRlbS5jb2xvcnMubWFpbi5oc3YuYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0bGFiOiB7XG5cdFx0XHRcdFx0XHRsOiBicmFuZC5hc0xBQl9MKGl0ZW0uY29sb3JzLm1haW4ubGFiLmwgPz8gMCksXG5cdFx0XHRcdFx0XHRhOiBicmFuZC5hc0xBQl9BKGl0ZW0uY29sb3JzLm1haW4ubGFiLmEgPz8gMCksXG5cdFx0XHRcdFx0XHRiOiBicmFuZC5hc0xBQl9CKGl0ZW0uY29sb3JzLm1haW4ubGFiLmIgPz8gMCksXG5cdFx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRpdGVtLmNvbG9ycy5tYWluLmxhYi5hbHBoYSA/PyAxXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRyZ2I6IHtcblx0XHRcdFx0XHRcdHJlZDogYnJhbmQuYXNCeXRlUmFuZ2UoaXRlbS5jb2xvcnMubWFpbi5yZ2IucmVkID8/IDApLFxuXHRcdFx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRpdGVtLmNvbG9ycy5tYWluLnJnYi5ncmVlbiA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2UoaXRlbS5jb2xvcnMubWFpbi5yZ2IuYmx1ZSA/PyAwKSxcblx0XHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdGl0ZW0uY29sb3JzLm1haW4ucmdiLmFscGhhID8/IDFcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHh5ejoge1xuXHRcdFx0XHRcdFx0eDogYnJhbmQuYXNYWVpfWChpdGVtLmNvbG9ycy5tYWluLnh5ei54ID8/IDApLFxuXHRcdFx0XHRcdFx0eTogYnJhbmQuYXNYWVpfWShpdGVtLmNvbG9ycy5tYWluLnh5ei55ID8/IDApLFxuXHRcdFx0XHRcdFx0ejogYnJhbmQuYXNYWVpfWihpdGVtLmNvbG9ycy5tYWluLnh5ei56ID8/IDApLFxuXHRcdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZShcblx0XHRcdFx0XHRcdFx0aXRlbS5jb2xvcnMubWFpbi54eXouYWxwaGEgPz8gMVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0c3RyaW5nUHJvcHM6IHtcblx0XHRcdFx0XHRjbXlrOiB7XG5cdFx0XHRcdFx0XHRjeWFuOiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5jbXlrLmN5YW4gPz8gMCksXG5cdFx0XHRcdFx0XHRtYWdlbnRhOiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5jbXlrLm1hZ2VudGEgPz8gMCksXG5cdFx0XHRcdFx0XHR5ZWxsb3c6IFN0cmluZyhpdGVtLmNvbG9ycy5tYWluLmNteWsueWVsbG93ID8/IDApLFxuXHRcdFx0XHRcdFx0a2V5OiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5jbXlrLmtleSA/PyAwKSxcblx0XHRcdFx0XHRcdGFscGhhOiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5jbXlrLmFscGhhID8/IDEpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRoZXg6IHtcblx0XHRcdFx0XHRcdGhleDogU3RyaW5nKGl0ZW0uY29sb3JzLm1haW4uaGV4LmhleCA/PyAnIzAwMDAwMEZGJyksXG5cdFx0XHRcdFx0XHRhbHBoYTogU3RyaW5nKGl0ZW0uY29sb3JzLm1haW4uaGV4LmFscGhhID8/ICdGRicpLFxuXHRcdFx0XHRcdFx0bnVtQWxwaGE6IFN0cmluZyhpdGVtLmNvbG9ycy5tYWluLmhleC5udW1BbHBoYSA/PyAxKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aHNsOiB7XG5cdFx0XHRcdFx0XHRodWU6IFN0cmluZyhpdGVtLmNvbG9ycy5tYWluLmhzbC5odWUgPz8gMCksXG5cdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdGl0ZW0uY29sb3JzLm1haW4uaHNsLnNhdHVyYXRpb24gPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGxpZ2h0bmVzczogU3RyaW5nKGl0ZW0uY29sb3JzLm1haW4uaHNsLmxpZ2h0bmVzcyA/PyAwKSxcblx0XHRcdFx0XHRcdGFscGhhOiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5oc2wuYWxwaGEgPz8gMSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGhzdjoge1xuXHRcdFx0XHRcdFx0aHVlOiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5oc3YuaHVlID8/IDApLFxuXHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRpdGVtLmNvbG9ycy5tYWluLmhzdi5zYXR1cmF0aW9uID8/IDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHR2YWx1ZTogU3RyaW5nKGl0ZW0uY29sb3JzLm1haW4uaHN2LnZhbHVlID8/IDApLFxuXHRcdFx0XHRcdFx0YWxwaGE6IFN0cmluZyhpdGVtLmNvbG9ycy5tYWluLmhzdi5hbHBoYSA/PyAxKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0bGFiOiB7XG5cdFx0XHRcdFx0XHRsOiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5sYWIubCA/PyAwKSxcblx0XHRcdFx0XHRcdGE6IFN0cmluZyhpdGVtLmNvbG9ycy5tYWluLmxhYi5hID8/IDApLFxuXHRcdFx0XHRcdFx0YjogU3RyaW5nKGl0ZW0uY29sb3JzLm1haW4ubGFiLmIgPz8gMCksXG5cdFx0XHRcdFx0XHRhbHBoYTogU3RyaW5nKGl0ZW0uY29sb3JzLm1haW4ubGFiLmFscGhhID8/IDEpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRyZ2I6IHtcblx0XHRcdFx0XHRcdHJlZDogU3RyaW5nKGl0ZW0uY29sb3JzLm1haW4ucmdiLnJlZCA/PyAwKSxcblx0XHRcdFx0XHRcdGdyZWVuOiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5yZ2IuZ3JlZW4gPz8gMCksXG5cdFx0XHRcdFx0XHRibHVlOiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5yZ2IuYmx1ZSA/PyAwKSxcblx0XHRcdFx0XHRcdGFscGhhOiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5yZ2IuYWxwaGEgPz8gMSlcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHh5ejoge1xuXHRcdFx0XHRcdFx0eDogU3RyaW5nKGl0ZW0uY29sb3JzLm1haW4ueHl6LnggPz8gMCksXG5cdFx0XHRcdFx0XHR5OiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi54eXoueSA/PyAwKSxcblx0XHRcdFx0XHRcdHo6IFN0cmluZyhpdGVtLmNvbG9ycy5tYWluLnh5ei56ID8/IDApLFxuXHRcdFx0XHRcdFx0YWxwaGE6IFN0cmluZyhpdGVtLmNvbG9ycy5tYWluLnh5ei5hbHBoYSA/PyAxKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0Y3NzOiB7XG5cdFx0XHRcdFx0Y215azogYGNteWsoJHtpdGVtLmNvbG9ycy5tYWluLmNteWsuY3lhbn0lLCAke2l0ZW0uY29sb3JzLm1haW4uY215ay5tYWdlbnRhfSUsICR7aXRlbS5jb2xvcnMubWFpbi5jbXlrLnllbGxvd30lLCAke2l0ZW0uY29sb3JzLm1haW4uY215ay5rZXl9JSwgJHtpdGVtLmNvbG9ycy5tYWluLmNteWsuYWxwaGF9KWAsXG5cdFx0XHRcdFx0aGV4OiBgJHtpdGVtLmNvbG9ycy5tYWluLmhleC5oZXh9JHtpdGVtLmNvbG9ycy5tYWluLmhleC5hbHBoYX1gLFxuXHRcdFx0XHRcdGhzbDogYGhzbCgke2l0ZW0uY29sb3JzLm1haW4uaHNsLmh1ZX0sICR7aXRlbS5jb2xvcnMubWFpbi5oc2wuc2F0dXJhdGlvbn0lLCAke2l0ZW0uY29sb3JzLm1haW4uaHNsLmxpZ2h0bmVzc30lLCAke2l0ZW0uY29sb3JzLm1haW4uaHNsLmFscGhhfSlgLFxuXHRcdFx0XHRcdGhzdjogYGhzdigke2l0ZW0uY29sb3JzLm1haW4uaHN2Lmh1ZX0sICR7aXRlbS5jb2xvcnMubWFpbi5oc3Yuc2F0dXJhdGlvbn0lLCAke2l0ZW0uY29sb3JzLm1haW4uaHN2LnZhbHVlfSUsICR7aXRlbS5jb2xvcnMubWFpbi5oc3YuYWxwaGF9KWAsXG5cdFx0XHRcdFx0bGFiOiBgbGFiKCR7aXRlbS5jb2xvcnMubWFpbi5sYWIubH0sICR7aXRlbS5jb2xvcnMubWFpbi5sYWIuYX0sICR7aXRlbS5jb2xvcnMubWFpbi5sYWIuYn0sICR7aXRlbS5jb2xvcnMubWFpbi5sYWIuYWxwaGF9KWAsXG5cdFx0XHRcdFx0cmdiOiBgcmdiKCR7aXRlbS5jb2xvcnMubWFpbi5yZ2IucmVkfSwgJHtpdGVtLmNvbG9ycy5tYWluLnJnYi5ncmVlbn0sICR7aXRlbS5jb2xvcnMubWFpbi5yZ2IuYmx1ZX0sICR7aXRlbS5jb2xvcnMubWFpbi5yZ2IuYWxwaGF9KWAsXG5cdFx0XHRcdFx0eHl6OiBgeHl6KCR7aXRlbS5jb2xvcnMubWFpbi54eXoueH0sICR7aXRlbS5jb2xvcnMubWFpbi54eXoueX0sICR7aXRlbS5jb2xvcnMubWFpbi54eXouen0sICR7aXRlbS5jb2xvcnMubWFpbi54eXouYWxwaGF9KWBcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pKVxuXHR9O1xufVxuXG5mdW5jdGlvbiBjb21wb25lbnRUb0hleChjb21wb25lbnQ6IG51bWJlcik6IHN0cmluZyB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAnY29tbW9uID4gdHJhbnNmb3JtID4gYmFzZSA+IGNvbXBvbmVudFRvSGV4KCknO1xuXG5cdHRyeSB7XG5cdFx0Y29uc3QgaGV4ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBjb21wb25lbnQpKS50b1N0cmluZygxNik7XG5cblx0XHRyZXR1cm4gaGV4Lmxlbmd0aCA9PT0gMSA/ICcwJyArIGhleCA6IGhleDtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAoIW1vZGUucXVpZXQgJiYgbW9kZS5sb2dnaW5nLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgY29tcG9uZW50VG9IZXggZXJyb3I6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiAnMDAnO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRDb2xvclZhbHVlKGNvbG9yOiBVbmJyYW5kZWRDb2xvcik6IENvbG9yIHtcblx0c3dpdGNoIChjb2xvci5mb3JtYXQpIHtcblx0XHRjYXNlICdjbXlrJzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0Y3lhbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdG1hZ2VudGE6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHR5ZWxsb3c6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRrZXk6IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoJyMwMDAwMDAnKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNIZXhDb21wb25lbnQoJ0ZGJyksXG5cdFx0XHRcdFx0bnVtQWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoMCksXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHNsJ1xuXHRcdFx0fTtcblx0XHRjYXNlICdoc3YnOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKDApLFxuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHR2YWx1ZTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdFx0fTtcblx0XHRjYXNlICdsYWInOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRsOiBicmFuZC5hc0xBQl9MKDApLFxuXHRcdFx0XHRcdGE6IGJyYW5kLmFzTEFCX0EoMCksXG5cdFx0XHRcdFx0YjogYnJhbmQuYXNMQUJfQigwKSxcblx0XHRcdFx0XHRhbHBoYTogYnJhbmQuYXNBbHBoYVJhbmdlKDEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdH07XG5cdFx0Y2FzZSAncmdiJzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZSgwKSxcblx0XHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UoMCksXG5cdFx0XHRcdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2UoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ3NsJzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGFscGhhOiBicmFuZC5hc0FscGhhUmFuZ2UoMSlcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAnc2wnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ3N2Jzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdHZhbHVlOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzdidcblx0XHRcdH07XG5cdFx0Y2FzZSAneHl6Jzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0eDogYnJhbmQuYXNYWVpfWCgwKSxcblx0XHRcdFx0XHR5OiBicmFuZC5hc1hZWl9ZKDApLFxuXHRcdFx0XHRcdHo6IGJyYW5kLmFzWFlaX1ooMCksXG5cdFx0XHRcdFx0YWxwaGE6IGJyYW5kLmFzQWxwaGFSYW5nZSgxKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICd4eXonXG5cdFx0XHR9O1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFxuXHRcdFx0XHRVbmtub3duIGNvbG9yIGZvcm1hdFxcbkRldGFpbHM6ICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWApO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm1VdGlsczogQ29tbW9uRm5fTWFzdGVySW50ZXJmYWNlWyd0cmFuc2Zvcm0nXSA9IHtcblx0YWRkSGFzaFRvSGV4LFxuXHRjb21wb25lbnRUb0hleCxcblx0YnJhbmRQYWxldHRlLFxuXHRkZWZhdWx0Q29sb3JWYWx1ZVxufTtcblxuZXhwb3J0IHsgY29tcG9uZW50VG9IZXggfTtcbiJdfQ==