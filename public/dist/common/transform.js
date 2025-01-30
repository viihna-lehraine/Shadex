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
                    hex: brand.asHexSet(`#${hex.value}}`)
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
                                    .cmyk.key ?? 0)
                            },
                            hex: {
                                hex: brand.asHexSet(data.metadata.customColor.colors.main
                                    .hex.hex ?? '#000000FF')
                            },
                            hsl: {
                                hue: brand.asRadial(data.metadata.customColor.colors.main
                                    .hsl.hue ?? 0),
                                saturation: brand.asPercentile(data.metadata.customColor.colors.main
                                    .hsl.saturation ?? 0),
                                lightness: brand.asPercentile(data.metadata.customColor.colors.main
                                    .hsl.lightness ?? 0)
                            },
                            hsv: {
                                hue: brand.asRadial(data.metadata.customColor.colors.main
                                    .hsv.hue ?? 0),
                                saturation: brand.asPercentile(data.metadata.customColor.colors.main
                                    .hsv.saturation ?? 0),
                                value: brand.asPercentile(data.metadata.customColor.colors.main
                                    .hsv.value ?? 0)
                            },
                            lab: {
                                l: brand.asLAB_L(data.metadata.customColor.colors.main
                                    .lab.l ?? 0),
                                a: brand.asLAB_A(data.metadata.customColor.colors.main
                                    .lab.a ?? 0),
                                b: brand.asLAB_B(data.metadata.customColor.colors.main
                                    .lab.b ?? 0)
                            },
                            rgb: {
                                red: brand.asByteRange(data.metadata.customColor.colors.main
                                    .rgb.red ?? 0),
                                green: brand.asByteRange(data.metadata.customColor.colors.main
                                    .rgb.green ?? 0),
                                blue: brand.asByteRange(data.metadata.customColor.colors.main
                                    .rgb.blue ?? 0)
                            },
                            xyz: {
                                x: brand.asXYZ_X(data.metadata.customColor.colors.main
                                    .xyz.x ?? 0),
                                y: brand.asXYZ_Y(data.metadata.customColor.colors.main
                                    .xyz.y ?? 0),
                                z: brand.asXYZ_Z(data.metadata.customColor.colors.main
                                    .xyz.z ?? 0)
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
                                    .cmyk.key ?? 0)
                            },
                            hex: {
                                hex: String(data.metadata.customColor.colors.main
                                    .hex.hex ?? '#000000FF')
                            },
                            hsl: {
                                hue: String(data.metadata.customColor.colors.main
                                    .hsl.hue ?? 0),
                                saturation: String(data.metadata.customColor.colors.main
                                    .hsl.saturation ?? 0),
                                lightness: String(data.metadata.customColor.colors.main
                                    .hsl.lightness ?? 0)
                            },
                            hsv: {
                                hue: String(data.metadata.customColor.colors.main
                                    .hsv.hue ?? 0),
                                saturation: String(data.metadata.customColor.colors.main
                                    .hsv.saturation ?? 0),
                                value: String(data.metadata.customColor.colors.main
                                    .hsv.value ?? 0)
                            },
                            lab: {
                                l: String(data.metadata.customColor.colors.main
                                    .lab.l ?? 0),
                                a: String(data.metadata.customColor.colors.main
                                    .lab.a ?? 0),
                                b: String(data.metadata.customColor.colors.main
                                    .lab.b ?? 0)
                            },
                            rgb: {
                                red: String(data.metadata.customColor.colors.main
                                    .rgb.red ?? 0),
                                green: String(data.metadata.customColor.colors.main
                                    .rgb.green ?? 0),
                                blue: String(data.metadata.customColor.colors.main
                                    .rgb.blue ?? 0)
                            },
                            xyz: {
                                x: String(data.metadata.customColor.colors.main
                                    .xyz.x ?? 0),
                                y: String(data.metadata.customColor.colors.main
                                    .xyz.y ?? 0),
                                z: String(data.metadata.customColor.colors.main
                                    .xyz.z ?? 0)
                            }
                        },
                        css: {
                            cmyk: `cmyk(${data.metadata.customColor.colors.main.cmyk.cyan}%, ${data.metadata.customColor.colors.main.cmyk.magenta}%, ${data.metadata.customColor.colors.main.cmyk.yellow}%, ${data.metadata.customColor.colors.main.cmyk.key}%)`,
                            hex: `${data.metadata.customColor.colors.main.hex.hex}`,
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
                        key: brand.asPercentile(item.colors.main.cmyk.key ?? 0)
                    },
                    hex: {
                        hex: brand.asHexSet(item.colors.main.hex.hex ?? '#000000')
                    },
                    hsl: {
                        hue: brand.asRadial(item.colors.main.hsl.hue ?? 0),
                        saturation: brand.asPercentile(item.colors.main.hsl.saturation ?? 0),
                        lightness: brand.asPercentile(item.colors.main.hsl.lightness ?? 0)
                    },
                    hsv: {
                        hue: brand.asRadial(item.colors.main.hsv.hue ?? 0),
                        saturation: brand.asPercentile(item.colors.main.hsv.saturation ?? 0),
                        value: brand.asPercentile(item.colors.main.hsv.value ?? 0)
                    },
                    lab: {
                        l: brand.asLAB_L(item.colors.main.lab.l ?? 0),
                        a: brand.asLAB_A(item.colors.main.lab.a ?? 0),
                        b: brand.asLAB_B(item.colors.main.lab.b ?? 0)
                    },
                    rgb: {
                        red: brand.asByteRange(item.colors.main.rgb.red ?? 0),
                        green: brand.asByteRange(item.colors.main.rgb.green ?? 0),
                        blue: brand.asByteRange(item.colors.main.rgb.blue ?? 0)
                    },
                    xyz: {
                        x: brand.asXYZ_X(item.colors.main.xyz.x ?? 0),
                        y: brand.asXYZ_Y(item.colors.main.xyz.y ?? 0),
                        z: brand.asXYZ_Z(item.colors.main.xyz.z ?? 0)
                    }
                },
                stringProps: {
                    cmyk: {
                        cyan: String(item.colors.main.cmyk.cyan ?? 0),
                        magenta: String(item.colors.main.cmyk.magenta ?? 0),
                        yellow: String(item.colors.main.cmyk.yellow ?? 0),
                        key: String(item.colors.main.cmyk.key ?? 0)
                    },
                    hex: {
                        hex: String(item.colors.main.hex.hex ?? '#000000')
                    },
                    hsl: {
                        hue: String(item.colors.main.hsl.hue ?? 0),
                        saturation: String(item.colors.main.hsl.saturation ?? 0),
                        lightness: String(item.colors.main.hsl.lightness ?? 0)
                    },
                    hsv: {
                        hue: String(item.colors.main.hsv.hue ?? 0),
                        saturation: String(item.colors.main.hsv.saturation ?? 0),
                        value: String(item.colors.main.hsv.value ?? 0)
                    },
                    lab: {
                        l: String(item.colors.main.lab.l ?? 0),
                        a: String(item.colors.main.lab.a ?? 0),
                        b: String(item.colors.main.lab.b ?? 0)
                    },
                    rgb: {
                        red: String(item.colors.main.rgb.red ?? 0),
                        green: String(item.colors.main.rgb.green ?? 0),
                        blue: String(item.colors.main.rgb.blue ?? 0)
                    },
                    xyz: {
                        x: String(item.colors.main.xyz.x ?? 0),
                        y: String(item.colors.main.xyz.y ?? 0),
                        z: String(item.colors.main.xyz.z ?? 0)
                    }
                },
                css: {
                    cmyk: `cmyk(${item.colors.main.cmyk.cyan}%, ${item.colors.main.cmyk.magenta}%, ${item.colors.main.cmyk.yellow}%, ${item.colors.main.cmyk.key}%)`,
                    hex: `${item.colors.main.hex.hex}}`,
                    hsl: `hsl(${item.colors.main.hsl.hue}, ${item.colors.main.hsl.saturation}%, ${item.colors.main.hsl.lightness}%)`,
                    hsv: `hsv(${item.colors.main.hsv.hue}, ${item.colors.main.hsv.saturation}%, ${item.colors.main.hsv.value}%)`,
                    lab: `lab(${item.colors.main.lab.l}, ${item.colors.main.lab.a}, ${item.colors.main.lab.b})`,
                    rgb: `rgb(${item.colors.main.rgb.red}, ${item.colors.main.rgb.green}, ${item.colors.main.rgb.blue})`,
                    xyz: `xyz(${item.colors.main.xyz.x}, ${item.colors.main.xyz.y}, ${item.colors.main.xyz.z})`
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
                    key: brand.asPercentile(0)
                },
                format: 'cmyk'
            };
        case 'hex':
            return {
                value: {
                    hex: brand.asHexSet('#000000')
                },
                format: 'hex'
            };
        case 'hsl':
            return {
                value: {
                    hue: brand.asRadial(0),
                    saturation: brand.asPercentile(0),
                    lightness: brand.asPercentile(0)
                },
                format: 'hsl'
            };
        case 'hsv':
            return {
                value: {
                    hue: brand.asRadial(0),
                    saturation: brand.asPercentile(0),
                    value: brand.asPercentile(0)
                },
                format: 'hsv'
            };
        case 'lab':
            return {
                value: {
                    l: brand.asLAB_L(0),
                    a: brand.asLAB_A(0),
                    b: brand.asLAB_B(0)
                },
                format: 'lab'
            };
        case 'rgb':
            return {
                value: {
                    red: brand.asByteRange(0),
                    green: brand.asByteRange(0),
                    blue: brand.asByteRange(0)
                },
                format: 'rgb'
            };
        case 'sl':
            return {
                value: {
                    saturation: brand.asPercentile(0),
                    lightness: brand.asPercentile(0)
                },
                format: 'sl'
            };
        case 'sv':
            return {
                value: {
                    saturation: brand.asPercentile(0),
                    value: brand.asPercentile(0)
                },
                format: 'sv'
            };
        case 'xyz':
            return {
                value: {
                    x: brand.asXYZ_X(0),
                    y: brand.asXYZ_Y(0),
                    z: brand.asXYZ_Z(0)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1vbi90cmFuc2Zvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNEJBQTRCO0FBVTVCLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxRQUFRLElBQUksSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFbkQsTUFBTSxVQUFVLEdBQUcsMEJBQTBCLENBQUM7QUFFOUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxTQUFTLFlBQVksQ0FBQyxHQUFRO0lBQzdCLElBQUksQ0FBQztRQUNKLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztZQUNuQyxDQUFDLENBQUMsR0FBRztZQUNMLENBQUMsQ0FBQztnQkFDQSxLQUFLLEVBQUU7b0JBQ04sR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUM7aUJBQ3JDO2dCQUNELE1BQU0sRUFBRSxLQUFjO2FBQ3RCLENBQUM7SUFDTCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELENBQUM7QUFDRixDQUFDO0FBQ0QsU0FBUyxZQUFZLENBQUMsSUFBc0I7SUFDM0MsT0FBTztRQUNOLEdBQUcsSUFBSTtRQUNQLFFBQVEsRUFBRTtZQUNULEdBQUcsSUFBSSxDQUFDLFFBQVE7WUFDaEIsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVztnQkFDckMsQ0FBQyxDQUFDO29CQUNBLE1BQU0sRUFBRTt3QkFDUCxJQUFJLEVBQUU7NEJBQ0ws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LENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUk7NEJBQy9LLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJOzRCQUMzSyxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRzs0QkFDMUosR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUc7NEJBQ25LLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxD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QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDdEMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDdEM7b0JBQ0QsR0FBRyxFQUFFO3dCQUNKLEdBQUcsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7d0JBQzFDLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7d0JBQzlDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7cUJBQzVDO29CQUNELEdBQUcsRUFBRTt3QkFDSixDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN0QyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN0QyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUN0QztpQkFDRDtnQkFDRCxHQUFHLEVBQUU7b0JBQ0osSUFBSSxFQUFFLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSTtvQkFDaEosR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRztvQkFDbkMsR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUk7b0JBQ2hILEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJO29CQUM1RyxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRztvQkFDM0YsR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUc7b0JBQ3BHLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHO2lCQUMzRjthQUNEO1NBQ0QsQ0FBQyxDQUFDO0tBQ0gsQ0FBQztBQUNILENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxTQUFpQjtJQUN4QyxNQUFNLFVBQVUsR0FBRyw4Q0FBOEMsQ0FBQztJQUVsRSxJQUFJLENBQUM7UUFDSixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUUvRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDM0MsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLO1lBQ3BDLE1BQU0sQ0FBQyxLQUFLLENBQ1gseUJBQXlCLEtBQUssRUFBRSxFQUNoQyxHQUFHLFVBQVUsTUFBTSxVQUFVLEVBQUUsQ0FDL0IsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztBQUNGLENBQUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLEtBQXFCO0lBQy9DLFFBQVEsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3RCLEtBQUssTUFBTTtZQUNWLE9BQU87Z0JBQ04sS0FBSyxFQUFFO29CQUNOLElBQUksRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDM0IsT0FBTyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUM5QixNQUFNLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQzdCLEdBQUcsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztpQkFDMUI7Z0JBQ0QsTUFBTSxFQUFFLE1BQU07YUFDZCxDQUFDO1FBQ0gsS0FBSyxLQUFLO1lBQ1QsT0FBTztnQkFDTixLQUFLLEVBQUU7b0JBQ04sR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO2lCQUM5QjtnQkFDRCxNQUFNLEVBQUUsS0FBSzthQUNiLENBQUM7UUFDSCxLQUFLLEtBQUs7WUFDVCxPQUFPO2dCQUNOLEtBQUssRUFBRTtvQkFDTixHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLFVBQVUsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDakMsU0FBUyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUNoQztnQkFDRCxNQUFNLEVBQUUsS0FBSzthQUNiLENBQUM7UUFDSCxLQUFLLEtBQUs7WUFDVCxPQUFPO2dCQUNOLEtBQUssRUFBRTtvQkFDTixHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLFVBQVUsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDakMsS0FBSyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUM1QjtnQkFDRCxNQUFNLEVBQUUsS0FBSzthQUNiLENBQUM7UUFDSCxLQUFLLEtBQUs7WUFDVCxPQUFPO2dCQUNOLEtBQUssRUFBRTtvQkFDTixDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ25CLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2lCQUNuQjtnQkFDRCxNQUFNLEVBQUUsS0FBSzthQUNiLENBQUM7UUFDSCxLQUFLLEtBQUs7WUFDVCxPQUFPO2dCQUNOLEtBQUssRUFBRTtvQkFDTixHQUFHLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLEtBQUssRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDM0IsSUFBSSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2lCQUMxQjtnQkFDRCxNQUFNLEVBQUUsS0FBSzthQUNiLENBQUM7UUFDSCxLQUFLLElBQUk7WUFDUixPQUFPO2dCQUNOLEtBQUssRUFBRTtvQkFDTixVQUFVLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLFNBQVMsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztpQkFDaEM7Z0JBQ0QsTUFBTSxFQUFFLElBQUk7YUFDWixDQUFDO1FBQ0gsS0FBSyxJQUFJO1lBQ1IsT0FBTztnQkFDTixLQUFLLEVBQUU7b0JBQ04sVUFBVSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxLQUFLLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7aUJBQzVCO2dCQUNELE1BQU0sRUFBRSxJQUFJO2FBQ1osQ0FBQztRQUNILEtBQUssS0FBSztZQUNULE9BQU87Z0JBQ04sS0FBSyxFQUFFO29CQUNOLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNuQixDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7aUJBQ25CO2dCQUNELE1BQU0sRUFBRSxLQUFLO2FBQ2IsQ0FBQztRQUNIO1lBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQztxQ0FDa0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDN0QsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQTBDO0lBQ3BFLFlBQVk7SUFDWixjQUFjO0lBQ2QsWUFBWTtJQUNaLGlCQUFpQjtDQUNqQixDQUFDO0FBRUYsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogY29tbW9uL3RyYW5zZm9ybS5qc1xuXG5pbXBvcnQge1xuXHRDb2xvcixcblx0Q29tbW9uRm5fTWFzdGVySW50ZXJmYWNlLFxuXHRIZXgsXG5cdFBhbGV0dGUsXG5cdFVuYnJhbmRlZENvbG9yLFxuXHRVbmJyYW5kZWRQYWxldHRlXG59IGZyb20gJy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGJyYW5kIH0gZnJvbSAnLi9jb3JlLmpzJztcbmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJy4uL2xvZ2dlci9pbmRleC5qcyc7XG5pbXBvcnQgeyBtb2RlRGF0YSBhcyBtb2RlIH0gZnJvbSAnLi4vZGF0YS9tb2RlLmpzJztcblxuY29uc3QgdGhpc01vZHVsZSA9ICdjb21tb24vdHJhbnNmb3JtL2Jhc2UudHMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuZnVuY3Rpb24gYWRkSGFzaFRvSGV4KGhleDogSGV4KTogSGV4IHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gaGV4LnZhbHVlLmhleC5zdGFydHNXaXRoKCcjJylcblx0XHRcdD8gaGV4XG5cdFx0XHQ6IHtcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldChgIyR7aGV4LnZhbHVlfX1gKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Zm9ybWF0OiAnaGV4JyBhcyAnaGV4J1xuXHRcdFx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihgYWRkSGFzaFRvSGV4IGVycm9yOiAke2Vycm9yfWApO1xuXHR9XG59XG5mdW5jdGlvbiBicmFuZFBhbGV0dGUoZGF0YTogVW5icmFuZGVkUGFsZXR0ZSk6IFBhbGV0dGUge1xuXHRyZXR1cm4ge1xuXHRcdC4uLmRhdGEsXG5cdFx0bWV0YWRhdGE6IHtcblx0XHRcdC4uLmRhdGEubWV0YWRhdGEsXG5cdFx0XHRjdXN0b21Db2xvcjogZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvclxuXHRcdFx0XHQ/IHtcblx0XHRcdFx0XHRcdGNvbG9yczoge1xuXHRcdFx0XHRcdFx0XHRtYWluOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y215azoge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y3lhbjogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmNteWsuY3lhbiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0bWFnZW50YTogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmNteWsubWFnZW50YSA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0eWVsbG93OiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuY215ay55ZWxsb3cgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdGtleTogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmNteWsua2V5ID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdGhleDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0aGV4OiBicmFuZC5hc0hleFNldChcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5oZXguaGV4ID8/ICcjMDAwMDAwRkYnXG5cdFx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRoc2w6IHtcblx0XHRcdFx0XHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuaHNsLmh1ZSA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmhzbC5zYXR1cmF0aW9uID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5oc2wubGlnaHRuZXNzID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdGhzdjoge1xuXHRcdFx0XHRcdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5oc3YuaHVlID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuaHN2LnNhdHVyYXRpb24gPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuaHN2LnZhbHVlID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdGxhYjoge1xuXHRcdFx0XHRcdFx0XHRcdFx0bDogYnJhbmQuYXNMQUJfTChcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5sYWIubCA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0YTogYnJhbmQuYXNMQUJfQShcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5sYWIuYSA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0YjogYnJhbmQuYXNMQUJfQihcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5sYWIuYiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRyZ2I6IHtcblx0XHRcdFx0XHRcdFx0XHRcdHJlZDogYnJhbmQuYXNCeXRlUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQucmdiLnJlZCA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0Z3JlZW46IGJyYW5kLmFzQnl0ZVJhbmdlKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LnJnYi5ncmVlbiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQucmdiLmJsdWUgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0eHl6OiB7XG5cdFx0XHRcdFx0XHRcdFx0XHR4OiBicmFuZC5hc1hZWl9YKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Lnh5ei54ID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHR5OiBicmFuZC5hc1hZWl9ZKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Lnh5ei55ID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHR6OiBicmFuZC5hc1hZWl9aKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Lnh5ei56ID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHN0cmluZ1Byb3BzOiB7XG5cdFx0XHRcdFx0XHRcdFx0Y215azoge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y3lhbjogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmNteWsuY3lhbiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0bWFnZW50YTogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmNteWsubWFnZW50YSA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0eWVsbG93OiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuY215ay55ZWxsb3cgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdGtleTogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmNteWsua2V5ID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdGhleDoge1xuXHRcdFx0XHRcdFx0XHRcdFx0aGV4OiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuaGV4LmhleCA/PyAnIzAwMDAwMEZGJ1xuXHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0aHNsOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRodWU6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5oc2wuaHVlID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuaHNsLnNhdHVyYXRpb24gPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdGxpZ2h0bmVzczogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmhzbC5saWdodG5lc3MgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0aHN2OiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRodWU6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5oc3YuaHVlID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuaHN2LnNhdHVyYXRpb24gPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuaHN2LnZhbHVlID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdGxhYjoge1xuXHRcdFx0XHRcdFx0XHRcdFx0bDogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmxhYi5sID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHRhOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQubGFiLmEgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdGI6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5sYWIuYiA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRyZ2I6IHtcblx0XHRcdFx0XHRcdFx0XHRcdHJlZDogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LnJnYi5yZWQgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdGdyZWVuOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQucmdiLmdyZWVuID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHRibHVlOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQucmdiLmJsdWUgPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0eHl6OiB7XG5cdFx0XHRcdFx0XHRcdFx0XHR4OiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQueHl6LnggPz8gMFxuXHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdHk6IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC54eXoueSA/PyAwXG5cdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0ejogU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Lnh5ei56ID8/IDBcblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGNzczoge1xuXHRcdFx0XHRcdFx0XHRcdGNteWs6IGBjbXlrKCR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpbi5jbXlrLmN5YW59JSwgJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluLmNteWsubWFnZW50YX0lLCAke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW4uY215ay55ZWxsb3d9JSwgJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluLmNteWsua2V5fSUpYCxcblx0XHRcdFx0XHRcdFx0XHRoZXg6IGAke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW4uaGV4LmhleH1gLFxuXHRcdFx0XHRcdFx0XHRcdGhzbDogYGhzbCgke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW4uaHNsLmh1ZX0sICR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpbi5oc2wuc2F0dXJhdGlvbn0lLCAke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW4uaHNsLmxpZ2h0bmVzc30lKWAsXG5cdFx0XHRcdFx0XHRcdFx0aHN2OiBgaHN2KCR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpbi5oc3YuaHVlfSwgJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluLmhzdi5zYXR1cmF0aW9ufSUsICR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpbi5oc3YudmFsdWV9JSlgLFxuXHRcdFx0XHRcdFx0XHRcdGxhYjogYGxhYigke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW4ubGFiLmx9LCAke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW4ubGFiLmF9LCAke2RhdGEubWV0YWRhdGEuY3VzdG9tQ29sb3IuY29sb3JzLm1haW4ubGFiLmJ9KWAsXG5cdFx0XHRcdFx0XHRcdFx0cmdiOiBgcmdiKCR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpbi5yZ2IucmVkfSwgJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluLnJnYi5ncmVlbn0sICR7ZGF0YS5tZXRhZGF0YS5jdXN0b21Db2xvci5jb2xvcnMubWFpbi5yZ2IuYmx1ZX0pYCxcblx0XHRcdFx0XHRcdFx0XHR4eXo6IGB4eXooJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluLnh5ei54fSwgJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluLnh5ei55fSwgJHtkYXRhLm1ldGFkYXRhLmN1c3RvbUNvbG9yLmNvbG9ycy5tYWluLnh5ei56fSlgXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdDogZmFsc2Vcblx0XHR9LFxuXHRcdGl0ZW1zOiBkYXRhLml0ZW1zLm1hcChpdGVtID0+ICh7XG5cdFx0XHRjb2xvcnM6IHtcblx0XHRcdFx0bWFpbjoge1xuXHRcdFx0XHRcdGNteWs6IHtcblx0XHRcdFx0XHRcdGN5YW46IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0aXRlbS5jb2xvcnMubWFpbi5jbXlrLmN5YW4gPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdG1hZ2VudGE6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0aXRlbS5jb2xvcnMubWFpbi5jbXlrLm1hZ2VudGEgPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdHllbGxvdzogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRpdGVtLmNvbG9ycy5tYWluLmNteWsueWVsbG93ID8/IDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRrZXk6IGJyYW5kLmFzUGVyY2VudGlsZShpdGVtLmNvbG9ycy5tYWluLmNteWsua2V5ID8/IDApXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRoZXg6IHtcblx0XHRcdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoXG5cdFx0XHRcdFx0XHRcdGl0ZW0uY29sb3JzLm1haW4uaGV4LmhleCA/PyAnIzAwMDAwMCdcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGhzbDoge1xuXHRcdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbChpdGVtLmNvbG9ycy5tYWluLmhzbC5odWUgPz8gMCksXG5cdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoXG5cdFx0XHRcdFx0XHRcdGl0ZW0uY29sb3JzLm1haW4uaHNsLnNhdHVyYXRpb24gPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKFxuXHRcdFx0XHRcdFx0XHRpdGVtLmNvbG9ycy5tYWluLmhzbC5saWdodG5lc3MgPz8gMFxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aHN2OiB7XG5cdFx0XHRcdFx0XHRodWU6IGJyYW5kLmFzUmFkaWFsKGl0ZW0uY29sb3JzLm1haW4uaHN2Lmh1ZSA/PyAwKSxcblx0XHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0aXRlbS5jb2xvcnMubWFpbi5oc3Yuc2F0dXJhdGlvbiA/PyAwXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZShcblx0XHRcdFx0XHRcdFx0aXRlbS5jb2xvcnMubWFpbi5oc3YudmFsdWUgPz8gMFxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0bGFiOiB7XG5cdFx0XHRcdFx0XHRsOiBicmFuZC5hc0xBQl9MKGl0ZW0uY29sb3JzLm1haW4ubGFiLmwgPz8gMCksXG5cdFx0XHRcdFx0XHRhOiBicmFuZC5hc0xBQl9BKGl0ZW0uY29sb3JzLm1haW4ubGFiLmEgPz8gMCksXG5cdFx0XHRcdFx0XHRiOiBicmFuZC5hc0xBQl9CKGl0ZW0uY29sb3JzLm1haW4ubGFiLmIgPz8gMClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHJnYjoge1xuXHRcdFx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZShpdGVtLmNvbG9ycy5tYWluLnJnYi5yZWQgPz8gMCksXG5cdFx0XHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UoXG5cdFx0XHRcdFx0XHRcdGl0ZW0uY29sb3JzLm1haW4ucmdiLmdyZWVuID8/IDBcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRibHVlOiBicmFuZC5hc0J5dGVSYW5nZShpdGVtLmNvbG9ycy5tYWluLnJnYi5ibHVlID8/IDApXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR4eXo6IHtcblx0XHRcdFx0XHRcdHg6IGJyYW5kLmFzWFlaX1goaXRlbS5jb2xvcnMubWFpbi54eXoueCA/PyAwKSxcblx0XHRcdFx0XHRcdHk6IGJyYW5kLmFzWFlaX1koaXRlbS5jb2xvcnMubWFpbi54eXoueSA/PyAwKSxcblx0XHRcdFx0XHRcdHo6IGJyYW5kLmFzWFlaX1ooaXRlbS5jb2xvcnMubWFpbi54eXoueiA/PyAwKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0c3RyaW5nUHJvcHM6IHtcblx0XHRcdFx0XHRjbXlrOiB7XG5cdFx0XHRcdFx0XHRjeWFuOiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5jbXlrLmN5YW4gPz8gMCksXG5cdFx0XHRcdFx0XHRtYWdlbnRhOiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5jbXlrLm1hZ2VudGEgPz8gMCksXG5cdFx0XHRcdFx0XHR5ZWxsb3c6IFN0cmluZyhpdGVtLmNvbG9ycy5tYWluLmNteWsueWVsbG93ID8/IDApLFxuXHRcdFx0XHRcdFx0a2V5OiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5jbXlrLmtleSA/PyAwKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aGV4OiB7XG5cdFx0XHRcdFx0XHRoZXg6IFN0cmluZyhpdGVtLmNvbG9ycy5tYWluLmhleC5oZXggPz8gJyMwMDAwMDAnKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aHNsOiB7XG5cdFx0XHRcdFx0XHRodWU6IFN0cmluZyhpdGVtLmNvbG9ycy5tYWluLmhzbC5odWUgPz8gMCksXG5cdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdGl0ZW0uY29sb3JzLm1haW4uaHNsLnNhdHVyYXRpb24gPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGxpZ2h0bmVzczogU3RyaW5nKGl0ZW0uY29sb3JzLm1haW4uaHNsLmxpZ2h0bmVzcyA/PyAwKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0aHN2OiB7XG5cdFx0XHRcdFx0XHRodWU6IFN0cmluZyhpdGVtLmNvbG9ycy5tYWluLmhzdi5odWUgPz8gMCksXG5cdFx0XHRcdFx0XHRzYXR1cmF0aW9uOiBTdHJpbmcoXG5cdFx0XHRcdFx0XHRcdGl0ZW0uY29sb3JzLm1haW4uaHN2LnNhdHVyYXRpb24gPz8gMFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdHZhbHVlOiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5oc3YudmFsdWUgPz8gMClcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGxhYjoge1xuXHRcdFx0XHRcdFx0bDogU3RyaW5nKGl0ZW0uY29sb3JzLm1haW4ubGFiLmwgPz8gMCksXG5cdFx0XHRcdFx0XHRhOiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5sYWIuYSA/PyAwKSxcblx0XHRcdFx0XHRcdGI6IFN0cmluZyhpdGVtLmNvbG9ycy5tYWluLmxhYi5iID8/IDApXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRyZ2I6IHtcblx0XHRcdFx0XHRcdHJlZDogU3RyaW5nKGl0ZW0uY29sb3JzLm1haW4ucmdiLnJlZCA/PyAwKSxcblx0XHRcdFx0XHRcdGdyZWVuOiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5yZ2IuZ3JlZW4gPz8gMCksXG5cdFx0XHRcdFx0XHRibHVlOiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi5yZ2IuYmx1ZSA/PyAwKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0eHl6OiB7XG5cdFx0XHRcdFx0XHR4OiBTdHJpbmcoaXRlbS5jb2xvcnMubWFpbi54eXoueCA/PyAwKSxcblx0XHRcdFx0XHRcdHk6IFN0cmluZyhpdGVtLmNvbG9ycy5tYWluLnh5ei55ID8/IDApLFxuXHRcdFx0XHRcdFx0ejogU3RyaW5nKGl0ZW0uY29sb3JzLm1haW4ueHl6LnogPz8gMClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNzczoge1xuXHRcdFx0XHRcdGNteWs6IGBjbXlrKCR7aXRlbS5jb2xvcnMubWFpbi5jbXlrLmN5YW59JSwgJHtpdGVtLmNvbG9ycy5tYWluLmNteWsubWFnZW50YX0lLCAke2l0ZW0uY29sb3JzLm1haW4uY215ay55ZWxsb3d9JSwgJHtpdGVtLmNvbG9ycy5tYWluLmNteWsua2V5fSUpYCxcblx0XHRcdFx0XHRoZXg6IGAke2l0ZW0uY29sb3JzLm1haW4uaGV4LmhleH19YCxcblx0XHRcdFx0XHRoc2w6IGBoc2woJHtpdGVtLmNvbG9ycy5tYWluLmhzbC5odWV9LCAke2l0ZW0uY29sb3JzLm1haW4uaHNsLnNhdHVyYXRpb259JSwgJHtpdGVtLmNvbG9ycy5tYWluLmhzbC5saWdodG5lc3N9JSlgLFxuXHRcdFx0XHRcdGhzdjogYGhzdigke2l0ZW0uY29sb3JzLm1haW4uaHN2Lmh1ZX0sICR7aXRlbS5jb2xvcnMubWFpbi5oc3Yuc2F0dXJhdGlvbn0lLCAke2l0ZW0uY29sb3JzLm1haW4uaHN2LnZhbHVlfSUpYCxcblx0XHRcdFx0XHRsYWI6IGBsYWIoJHtpdGVtLmNvbG9ycy5tYWluLmxhYi5sfSwgJHtpdGVtLmNvbG9ycy5tYWluLmxhYi5hfSwgJHtpdGVtLmNvbG9ycy5tYWluLmxhYi5ifSlgLFxuXHRcdFx0XHRcdHJnYjogYHJnYigke2l0ZW0uY29sb3JzLm1haW4ucmdiLnJlZH0sICR7aXRlbS5jb2xvcnMubWFpbi5yZ2IuZ3JlZW59LCAke2l0ZW0uY29sb3JzLm1haW4ucmdiLmJsdWV9KWAsXG5cdFx0XHRcdFx0eHl6OiBgeHl6KCR7aXRlbS5jb2xvcnMubWFpbi54eXoueH0sICR7aXRlbS5jb2xvcnMubWFpbi54eXoueX0sICR7aXRlbS5jb2xvcnMubWFpbi54eXouen0pYFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSkpXG5cdH07XG59XG5cbmZ1bmN0aW9uIGNvbXBvbmVudFRvSGV4KGNvbXBvbmVudDogbnVtYmVyKTogc3RyaW5nIHtcblx0Y29uc3QgdGhpc01ldGhvZCA9ICdjb21tb24gPiB0cmFuc2Zvcm0gPiBiYXNlID4gY29tcG9uZW50VG9IZXgoKSc7XG5cblx0dHJ5IHtcblx0XHRjb25zdCBoZXggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIGNvbXBvbmVudCkpLnRvU3RyaW5nKDE2KTtcblxuXHRcdHJldHVybiBoZXgubGVuZ3RoID09PSAxID8gJzAnICsgaGV4IDogaGV4O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmICghbW9kZS5xdWlldCAmJiBtb2RlLmxvZ2dpbmcuZXJyb3IpXG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdGBjb21wb25lbnRUb0hleCBlcnJvcjogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXG5cdFx0cmV0dXJuICcwMCc7XG5cdH1cbn1cblxuZnVuY3Rpb24gZGVmYXVsdENvbG9yVmFsdWUoY29sb3I6IFVuYnJhbmRlZENvbG9yKTogQ29sb3Ige1xuXHRzd2l0Y2ggKGNvbG9yLmZvcm1hdCkge1xuXHRcdGNhc2UgJ2NteWsnOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRjeWFuOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0bWFnZW50YTogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdHllbGxvdzogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGtleTogYnJhbmQuYXNQZXJjZW50aWxlKDApXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2NteWsnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ2hleCc6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGhleDogYnJhbmQuYXNIZXhTZXQoJyMwMDAwMDAnKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoZXgnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ2hzbCc6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGh1ZTogYnJhbmQuYXNSYWRpYWwoMCksXG5cdFx0XHRcdFx0c2F0dXJhdGlvbjogYnJhbmQuYXNQZXJjZW50aWxlKDApLFxuXHRcdFx0XHRcdGxpZ2h0bmVzczogYnJhbmQuYXNQZXJjZW50aWxlKDApXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHRcdH07XG5cdFx0Y2FzZSAnaHN2Jzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0aHVlOiBicmFuZC5hc1JhZGlhbCgwKSxcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZSgwKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdoc3YnXG5cdFx0XHR9O1xuXHRcdGNhc2UgJ2xhYic6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdGw6IGJyYW5kLmFzTEFCX0woMCksXG5cdFx0XHRcdFx0YTogYnJhbmQuYXNMQUJfQSgwKSxcblx0XHRcdFx0XHRiOiBicmFuZC5hc0xBQl9CKDApXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDogJ2xhYidcblx0XHRcdH07XG5cdFx0Y2FzZSAncmdiJzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0cmVkOiBicmFuZC5hc0J5dGVSYW5nZSgwKSxcblx0XHRcdFx0XHRncmVlbjogYnJhbmQuYXNCeXRlUmFuZ2UoMCksXG5cdFx0XHRcdFx0Ymx1ZTogYnJhbmQuYXNCeXRlUmFuZ2UoMClcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdFx0fTtcblx0XHRjYXNlICdzbCc6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNhdHVyYXRpb246IGJyYW5kLmFzUGVyY2VudGlsZSgwKSxcblx0XHRcdFx0XHRsaWdodG5lc3M6IGJyYW5kLmFzUGVyY2VudGlsZSgwKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzbCdcblx0XHRcdH07XG5cdFx0Y2FzZSAnc3YnOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzYXR1cmF0aW9uOiBicmFuZC5hc1BlcmNlbnRpbGUoMCksXG5cdFx0XHRcdFx0dmFsdWU6IGJyYW5kLmFzUGVyY2VudGlsZSgwKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtYXQ6ICdzdidcblx0XHRcdH07XG5cdFx0Y2FzZSAneHl6Jzpcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0eDogYnJhbmQuYXNYWVpfWCgwKSxcblx0XHRcdFx0XHR5OiBicmFuZC5hc1hZWl9ZKDApLFxuXHRcdFx0XHRcdHo6IGJyYW5kLmFzWFlaX1ooMClcblx0XHRcdFx0fSxcblx0XHRcdFx0Zm9ybWF0OiAneHl6J1xuXHRcdFx0fTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBcblx0XHRcdFx0VW5rbm93biBjb2xvciBmb3JtYXRcXG5EZXRhaWxzOiAke0pTT04uc3RyaW5naWZ5KGNvbG9yKX1gKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgdHJhbnNmb3JtVXRpbHM6IENvbW1vbkZuX01hc3RlckludGVyZmFjZVsndHJhbnNmb3JtJ10gPSB7XG5cdGFkZEhhc2hUb0hleCxcblx0Y29tcG9uZW50VG9IZXgsXG5cdGJyYW5kUGFsZXR0ZSxcblx0ZGVmYXVsdENvbG9yVmFsdWVcbn07XG5cbmV4cG9ydCB7IGNvbXBvbmVudFRvSGV4IH07XG4iXX0=