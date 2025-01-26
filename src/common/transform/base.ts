// File: src/common/transform/base.js

import {
	Color,
	ColorUnbranded,
	CommonFunctionsMasterInterface,
	Hex,
	Palette,
	PaletteUnbranded
} from '../../types/index.js';
import { brand } from '../core/base.js';
import { createLogger } from '../../logger/index.js';
import { mode } from '../data/base.js';

const logger = await createLogger();

function addHashToHex(hex: Hex): Hex {
	try {
		return hex.value.hex.startsWith('#')
			? hex
			: {
					value: {
						hex: brand.asHexSet(`#${hex.value}}`),
						alpha: brand.asHexComponent(`#$hex.value.alpha`),
						numAlpha: brand.asAlphaRange(hex.value.numAlpha)
					},
					format: 'hex' as 'hex'
				};
	} catch (error) {
		throw new Error(`addHashToHex error: ${error}`);
	}
}
function brandPalette(data: PaletteUnbranded): Palette {
	return {
		...data,
		metadata: {
			...data.metadata,
			customColor: data.metadata.customColor
				? {
						colors: {
							cmyk: {
								cyan: brand.asPercentile(
									data.metadata.customColor.colors.cmyk
										.cyan ?? 0
								),
								magenta: brand.asPercentile(
									data.metadata.customColor.colors.cmyk
										.magenta ?? 0
								),
								yellow: brand.asPercentile(
									data.metadata.customColor.colors.cmyk
										.yellow ?? 0
								),
								key: brand.asPercentile(
									data.metadata.customColor.colors.cmyk.key ??
										0
								),
								alpha: brand.asAlphaRange(
									data.metadata.customColor.colors.cmyk
										.alpha ?? 1
								)
							},
							hex: {
								hex: brand.asHexSet(
									data.metadata.customColor.colors.hex.hex ??
										'#000000FF'
								),
								alpha: brand.asHexComponent(
									data.metadata.customColor.colors.hex
										.alpha ?? 'FF'
								),
								numAlpha: brand.asAlphaRange(
									data.metadata.customColor.colors.hex
										.numAlpha ?? 1
								)
							},
							hsl: {
								hue: brand.asRadial(
									data.metadata.customColor.colors.hsl.hue ??
										0
								),
								saturation: brand.asPercentile(
									data.metadata.customColor.colors.hsl
										.saturation ?? 0
								),
								lightness: brand.asPercentile(
									data.metadata.customColor.colors.hsl
										.lightness ?? 0
								),
								alpha: brand.asAlphaRange(
									data.metadata.customColor.colors.hsl
										.alpha ?? 1
								)
							},
							hsv: {
								hue: brand.asRadial(
									data.metadata.customColor.colors.hsv.hue ??
										0
								),
								saturation: brand.asPercentile(
									data.metadata.customColor.colors.hsv
										.saturation ?? 0
								),
								value: brand.asPercentile(
									data.metadata.customColor.colors.hsv
										.value ?? 0
								),
								alpha: brand.asAlphaRange(
									data.metadata.customColor.colors.hsv
										.alpha ?? 1
								)
							},
							lab: {
								l: brand.asLAB_L(
									data.metadata.customColor.colors.lab.l ?? 0
								),
								a: brand.asLAB_A(
									data.metadata.customColor.colors.lab.a ?? 0
								),
								b: brand.asLAB_B(
									data.metadata.customColor.colors.lab.b ?? 0
								),
								alpha: brand.asAlphaRange(
									data.metadata.customColor.colors.lab
										.alpha ?? 1
								)
							},
							rgb: {
								red: brand.asByteRange(
									data.metadata.customColor.colors.rgb.red ??
										0
								),
								green: brand.asByteRange(
									data.metadata.customColor.colors.rgb
										.green ?? 0
								),
								blue: brand.asByteRange(
									data.metadata.customColor.colors.rgb.blue ??
										0
								),
								alpha: brand.asAlphaRange(
									data.metadata.customColor.colors.rgb
										.alpha ?? 1
								)
							},
							xyz: {
								x: brand.asXYZ_X(
									data.metadata.customColor.colors.xyz.x ?? 0
								),
								y: brand.asXYZ_Y(
									data.metadata.customColor.colors.xyz.y ?? 0
								),
								z: brand.asXYZ_Z(
									data.metadata.customColor.colors.xyz.z ?? 0
								),
								alpha: brand.asAlphaRange(
									data.metadata.customColor.colors.xyz
										.alpha ?? 1
								)
							}
						},
						colorStrings: {
							cmykString: {
								cyan: String(
									data.metadata.customColor.colors.cmyk
										.cyan ?? 0
								),
								magenta: String(
									data.metadata.customColor.colors.cmyk
										.magenta ?? 0
								),
								yellow: String(
									data.metadata.customColor.colors.cmyk
										.yellow ?? 0
								),
								key: String(
									data.metadata.customColor.colors.cmyk.key ??
										0
								),
								alpha: String(
									data.metadata.customColor.colors.cmyk
										.alpha ?? 1
								)
							},
							hexString: {
								hex: String(
									data.metadata.customColor.colors.hex.hex ??
										'#000000FF'
								),
								alpha: String(
									data.metadata.customColor.colors.hex
										.alpha ?? 'FF'
								),
								numAlpha: String(
									data.metadata.customColor.colors.hex
										.numAlpha ?? 1
								)
							},
							hslString: {
								hue: String(
									data.metadata.customColor.colors.hsl.hue ??
										0
								),
								saturation: String(
									data.metadata.customColor.colors.hsl
										.saturation ?? 0
								),
								lightness: String(
									data.metadata.customColor.colors.hsl
										.lightness ?? 0
								),
								alpha: String(
									data.metadata.customColor.colors.hsl
										.alpha ?? 1
								)
							},
							hsvString: {
								hue: String(
									data.metadata.customColor.colors.hsv.hue ??
										0
								),
								saturation: String(
									data.metadata.customColor.colors.hsv
										.saturation ?? 0
								),
								value: String(
									data.metadata.customColor.colors.hsv
										.value ?? 0
								),
								alpha: String(
									data.metadata.customColor.colors.hsv
										.alpha ?? 1
								)
							},
							labString: {
								l: String(
									data.metadata.customColor.colors.lab.l ?? 0
								),
								a: String(
									data.metadata.customColor.colors.lab.a ?? 0
								),
								b: String(
									data.metadata.customColor.colors.lab.b ?? 0
								),
								alpha: String(
									data.metadata.customColor.colors.lab
										.alpha ?? 1
								)
							},
							rgbString: {
								red: String(
									data.metadata.customColor.colors.rgb.red ??
										0
								),
								green: String(
									data.metadata.customColor.colors.rgb
										.green ?? 0
								),
								blue: String(
									data.metadata.customColor.colors.rgb.blue ??
										0
								),
								alpha: String(
									data.metadata.customColor.colors.rgb
										.alpha ?? 1
								)
							},
							xyzString: {
								x: String(
									data.metadata.customColor.colors.xyz.x ?? 0
								),
								y: String(
									data.metadata.customColor.colors.xyz.y ?? 0
								),
								z: String(
									data.metadata.customColor.colors.xyz.z ?? 0
								),
								alpha: String(
									data.metadata.customColor.colors.xyz
										.alpha ?? 1
								)
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
					saturation: brand.asPercentile(
						item.colors.hsl.saturation ?? 0
					),
					lightness: brand.asPercentile(
						item.colors.hsl.lightness ?? 0
					),
					alpha: brand.asAlphaRange(item.colors.hsl.alpha ?? 1)
				},
				hsv: {
					hue: brand.asRadial(item.colors.hsv.hue ?? 0),
					saturation: brand.asPercentile(
						item.colors.hsv.saturation ?? 0
					),
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

function componentToHex(component: number): string {
	try {
		const hex = Math.max(0, Math.min(255, component)).toString(16);

		return hex.length === 1 ? '0' + hex : hex;
	} catch (error) {
		if (!mode.quiet && mode.logging.error)
			logger.error(
				`componentToHex error: ${error}`,
				'common > transform > base > componentToHex()'
			);

		return '00';
	}
}

function defaultColorValue(color: ColorUnbranded): Color {
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

export const base: CommonFunctionsMasterInterface['transform'] = {
	addHashToHex,
	componentToHex,
	brandPalette,
	defaultColorValue
};

export { componentToHex };
