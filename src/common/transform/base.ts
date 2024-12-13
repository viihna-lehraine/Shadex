// File: src/common/transform/base.js

import {
	Color,
	ColorUnbranded,
	CommonTransformFnBase,
	Hex,
	Palette,
	PaletteUnbranded
} from '../../index/index.js';
import { brand } from '../core/base.js';
import { mode } from '../../data/mode/index.js';

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
						hue: brand.asRadial(
							data.metadata.customColor?.hslColor?.value.hue ?? 0
						),
						saturation: brand.asPercentile(
							data.metadata.customColor?.hslColor?.value
								.saturation ?? 0
						),
						lightness: brand.asPercentile(
							data.metadata.customColor?.hslColor?.value
								.lightness ?? 0
						),
						alpha: brand.asAlphaRange(
							data.metadata.customColor?.hslColor?.value.alpha ??
								1
						)
					}
				},
				convertedColors: {
					cmyk: {
						cyan: brand.asPercentile(
							data.metadata.customColor?.convertedColors?.cmyk
								.cyan ?? 0
						),
						magenta: brand.asPercentile(
							data.metadata.customColor?.convertedColors?.cmyk
								.magenta ?? 0
						),
						yellow: brand.asPercentile(
							data.metadata.customColor?.convertedColors?.cmyk
								.yellow ?? 0
						),
						key: brand.asPercentile(
							data.metadata.customColor?.convertedColors?.cmyk
								.key ?? 0
						),
						alpha: brand.asAlphaRange(
							data.metadata.customColor?.convertedColors?.cmyk
								.alpha ?? 1
						)
					},
					hex: {
						hex: brand.asHexSet(
							data.metadata.customColor?.convertedColors?.hex
								.hex ?? '#000000FF'
						),
						alpha: brand.asHexComponent(
							data.metadata.customColor?.convertedColors?.hex
								.alpha ?? 'FF'
						),
						numAlpha: brand.asAlphaRange(
							data.metadata.customColor?.convertedColors?.hex
								.numAlpha ?? 1
						)
					},
					hsl: {
						hue: brand.asRadial(
							data.metadata.customColor?.convertedColors?.hsl
								.hue ?? 0
						),
						saturation: brand.asPercentile(
							data.metadata.customColor?.convertedColors?.hsl
								.saturation ?? 0
						),
						lightness: brand.asPercentile(
							data.metadata.customColor?.convertedColors?.hsl
								.lightness ?? 0
						),
						alpha: brand.asAlphaRange(
							data.metadata.customColor?.convertedColors?.hsl
								.alpha ?? 1
						)
					},
					hsv: {
						hue: brand.asRadial(
							data.metadata.customColor?.convertedColors?.hsv
								.hue ?? 0
						),
						saturation: brand.asPercentile(
							data.metadata.customColor?.convertedColors?.hsv
								.saturation ?? 0
						),
						value: brand.asPercentile(
							data.metadata.customColor?.convertedColors?.hsv
								.value ?? 0
						),
						alpha: brand.asAlphaRange(
							data.metadata.customColor?.convertedColors?.hsv
								.alpha ?? 1
						)
					},
					lab: {
						l: brand.asLAB_L(
							data.metadata.customColor?.convertedColors?.lab.l ??
								0
						),
						a: brand.asLAB_A(
							data.metadata.customColor?.convertedColors?.lab.a ??
								0
						),
						b: brand.asLAB_B(
							data.metadata.customColor?.convertedColors?.lab.b ??
								0
						),
						alpha: brand.asAlphaRange(
							data.metadata.customColor?.convertedColors?.lab
								.alpha ?? 1
						)
					},
					rgb: {
						red: brand.asByteRange(
							data.metadata.customColor?.convertedColors?.rgb
								.red ?? 0
						),
						green: brand.asByteRange(
							data.metadata.customColor?.convertedColors?.rgb
								.green ?? 0
						),
						blue: brand.asByteRange(
							data.metadata.customColor?.convertedColors?.rgb
								.blue ?? 0
						),
						alpha: brand.asAlphaRange(
							data.metadata.customColor?.convertedColors?.rgb
								.alpha ?? 1
						)
					},
					xyz: {
						x: brand.asXYZ_X(
							data.metadata.customColor?.convertedColors?.xyz.x ??
								0
						),
						y: brand.asXYZ_Y(
							data.metadata.customColor?.convertedColors?.xyz.y ??
								0
						),
						z: brand.asXYZ_Z(
							data.metadata.customColor?.convertedColors?.xyz.z ??
								0
						),
						alpha: brand.asAlphaRange(
							data.metadata.customColor?.convertedColors?.xyz
								.alpha ?? 1
						)
					}
				}
			}
		}
	};
}

function componentToHex(component: number): string {
	try {
		const hex = Math.max(0, Math.min(255, component)).toString(16);

		return hex.length === 1 ? '0' + hex : hex;
	} catch (error) {
		if (!mode.quiet) console.error(`componentToHex error: ${error}`);

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

export const base: CommonTransformFnBase = {
	addHashToHex,
	componentToHex,
	brandPalette,
	defaultColorValue
};

export { componentToHex };
