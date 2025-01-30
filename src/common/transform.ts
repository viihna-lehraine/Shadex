// File: common/transform.js

import {
	Color,
	CommonFn_MasterInterface,
	Hex,
	Palette,
	UnbrandedColor,
	UnbrandedPalette
} from '../types/index.js';
import { brand } from './core.js';
import { createLogger } from '../logger/index.js';
import { modeData as mode } from '../data/mode.js';

const thisModule = 'common/transform/base.ts';

const logger = await createLogger();

function addHashToHex(hex: Hex): Hex {
	try {
		return hex.value.hex.startsWith('#')
			? hex
			: {
					value: {
						hex: brand.asHexSet(`#${hex.value}}`)
					},
					format: 'hex' as 'hex'
				};
	} catch (error) {
		throw new Error(`addHashToHex error: ${error}`);
	}
}
function brandPalette(data: UnbrandedPalette): Palette {
	return {
		...data,
		metadata: {
			...data.metadata,
			customColor: data.metadata.customColor
				? {
						colors: {
							main: {
								cmyk: {
									cyan: brand.asPercentile(
										data.metadata.customColor.colors.main
											.cmyk.cyan ?? 0
									),
									magenta: brand.asPercentile(
										data.metadata.customColor.colors.main
											.cmyk.magenta ?? 0
									),
									yellow: brand.asPercentile(
										data.metadata.customColor.colors.main
											.cmyk.yellow ?? 0
									),
									key: brand.asPercentile(
										data.metadata.customColor.colors.main
											.cmyk.key ?? 0
									)
								},
								hex: {
									hex: brand.asHexSet(
										data.metadata.customColor.colors.main
											.hex.hex ?? '#000000FF'
									)
								},
								hsl: {
									hue: brand.asRadial(
										data.metadata.customColor.colors.main
											.hsl.hue ?? 0
									),
									saturation: brand.asPercentile(
										data.metadata.customColor.colors.main
											.hsl.saturation ?? 0
									),
									lightness: brand.asPercentile(
										data.metadata.customColor.colors.main
											.hsl.lightness ?? 0
									)
								},
								hsv: {
									hue: brand.asRadial(
										data.metadata.customColor.colors.main
											.hsv.hue ?? 0
									),
									saturation: brand.asPercentile(
										data.metadata.customColor.colors.main
											.hsv.saturation ?? 0
									),
									value: brand.asPercentile(
										data.metadata.customColor.colors.main
											.hsv.value ?? 0
									)
								},
								lab: {
									l: brand.asLAB_L(
										data.metadata.customColor.colors.main
											.lab.l ?? 0
									),
									a: brand.asLAB_A(
										data.metadata.customColor.colors.main
											.lab.a ?? 0
									),
									b: brand.asLAB_B(
										data.metadata.customColor.colors.main
											.lab.b ?? 0
									)
								},
								rgb: {
									red: brand.asByteRange(
										data.metadata.customColor.colors.main
											.rgb.red ?? 0
									),
									green: brand.asByteRange(
										data.metadata.customColor.colors.main
											.rgb.green ?? 0
									),
									blue: brand.asByteRange(
										data.metadata.customColor.colors.main
											.rgb.blue ?? 0
									)
								},
								xyz: {
									x: brand.asXYZ_X(
										data.metadata.customColor.colors.main
											.xyz.x ?? 0
									),
									y: brand.asXYZ_Y(
										data.metadata.customColor.colors.main
											.xyz.y ?? 0
									),
									z: brand.asXYZ_Z(
										data.metadata.customColor.colors.main
											.xyz.z ?? 0
									)
								}
							},
							stringProps: {
								cmyk: {
									cyan: String(
										data.metadata.customColor.colors.main
											.cmyk.cyan ?? 0
									),
									magenta: String(
										data.metadata.customColor.colors.main
											.cmyk.magenta ?? 0
									),
									yellow: String(
										data.metadata.customColor.colors.main
											.cmyk.yellow ?? 0
									),
									key: String(
										data.metadata.customColor.colors.main
											.cmyk.key ?? 0
									)
								},
								hex: {
									hex: String(
										data.metadata.customColor.colors.main
											.hex.hex ?? '#000000FF'
									)
								},
								hsl: {
									hue: String(
										data.metadata.customColor.colors.main
											.hsl.hue ?? 0
									),
									saturation: String(
										data.metadata.customColor.colors.main
											.hsl.saturation ?? 0
									),
									lightness: String(
										data.metadata.customColor.colors.main
											.hsl.lightness ?? 0
									)
								},
								hsv: {
									hue: String(
										data.metadata.customColor.colors.main
											.hsv.hue ?? 0
									),
									saturation: String(
										data.metadata.customColor.colors.main
											.hsv.saturation ?? 0
									),
									value: String(
										data.metadata.customColor.colors.main
											.hsv.value ?? 0
									)
								},
								lab: {
									l: String(
										data.metadata.customColor.colors.main
											.lab.l ?? 0
									),
									a: String(
										data.metadata.customColor.colors.main
											.lab.a ?? 0
									),
									b: String(
										data.metadata.customColor.colors.main
											.lab.b ?? 0
									)
								},
								rgb: {
									red: String(
										data.metadata.customColor.colors.main
											.rgb.red ?? 0
									),
									green: String(
										data.metadata.customColor.colors.main
											.rgb.green ?? 0
									),
									blue: String(
										data.metadata.customColor.colors.main
											.rgb.blue ?? 0
									)
								},
								xyz: {
									x: String(
										data.metadata.customColor.colors.main
											.xyz.x ?? 0
									),
									y: String(
										data.metadata.customColor.colors.main
											.xyz.y ?? 0
									),
									z: String(
										data.metadata.customColor.colors.main
											.xyz.z ?? 0
									)
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
						cyan: brand.asPercentile(
							item.colors.main.cmyk.cyan ?? 0
						),
						magenta: brand.asPercentile(
							item.colors.main.cmyk.magenta ?? 0
						),
						yellow: brand.asPercentile(
							item.colors.main.cmyk.yellow ?? 0
						),
						key: brand.asPercentile(item.colors.main.cmyk.key ?? 0)
					},
					hex: {
						hex: brand.asHexSet(
							item.colors.main.hex.hex ?? '#000000'
						)
					},
					hsl: {
						hue: brand.asRadial(item.colors.main.hsl.hue ?? 0),
						saturation: brand.asPercentile(
							item.colors.main.hsl.saturation ?? 0
						),
						lightness: brand.asPercentile(
							item.colors.main.hsl.lightness ?? 0
						)
					},
					hsv: {
						hue: brand.asRadial(item.colors.main.hsv.hue ?? 0),
						saturation: brand.asPercentile(
							item.colors.main.hsv.saturation ?? 0
						),
						value: brand.asPercentile(
							item.colors.main.hsv.value ?? 0
						)
					},
					lab: {
						l: brand.asLAB_L(item.colors.main.lab.l ?? 0),
						a: brand.asLAB_A(item.colors.main.lab.a ?? 0),
						b: brand.asLAB_B(item.colors.main.lab.b ?? 0)
					},
					rgb: {
						red: brand.asByteRange(item.colors.main.rgb.red ?? 0),
						green: brand.asByteRange(
							item.colors.main.rgb.green ?? 0
						),
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
						saturation: String(
							item.colors.main.hsl.saturation ?? 0
						),
						lightness: String(item.colors.main.hsl.lightness ?? 0)
					},
					hsv: {
						hue: String(item.colors.main.hsv.hue ?? 0),
						saturation: String(
							item.colors.main.hsv.saturation ?? 0
						),
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

function componentToHex(component: number): string {
	const thisMethod = 'common > transform > base > componentToHex()';

	try {
		const hex = Math.max(0, Math.min(255, component)).toString(16);

		return hex.length === 1 ? '0' + hex : hex;
	} catch (error) {
		if (!mode.quiet && mode.logging.error)
			logger.error(
				`componentToHex error: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		return '00';
	}
}

function defaultColorValue(color: UnbrandedColor): Color {
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

export const transformUtils: CommonFn_MasterInterface['transform'] = {
	addHashToHex,
	componentToHex,
	brandPalette,
	defaultColorValue
};

export { componentToHex };
