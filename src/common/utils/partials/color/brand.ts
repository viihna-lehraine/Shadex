// File: common/utils/partials/color/brand.ts

import {
	CMYK,
	CMYKStringMap,
	Color,
	ColorBrandUtils,
	ColorStringMap,
	Helpers,
	Hex,
	HexStringMap,
	HSL,
	HSLStringMap,
	HSV,
	HSVStringMap,
	LAB,
	LABStringMap,
	RGB,
	RGBStringMap,
	SL,
	SV,
	Utilities,
	XYZ,
	XYZStringMap
} from '../../../../types/index.js';
import { defaults } from '../../../../config/index.js';

const defaultColors = defaults.colors;

export function colorBrandingUtilsFactory(
	helpers: Helpers, utils: Utilities
): ColorBrandUtils {
	const { clone, parseValue } = helpers.data;
	const { brand } = utils;

	return {
		brandCMYKStringMapValue(
			cmyk: CMYKStringMap['value']
		): CMYK['value'] {
			return {
				cyan: brand.asPercentile(parseFloat(cmyk.cyan) / 100),
				magenta: brand.asPercentile(parseFloat(cmyk.magenta) / 100),
				yellow: brand.asPercentile(parseFloat(cmyk.yellow) / 100),
				key: brand.asPercentile(parseFloat(cmyk.key) / 100)
			};
		},
		brandColorStringMap(color: ColorStringMap): Color {
			const clonedColor = clone(color);

			const newValue = Object.entries(clonedColor.value).reduce(
				(acc, [key, val]) => {
					acc[key as keyof (typeof clonedColor)['value']] =
						parseValue(val) as never;

					return acc;
				},
				{} as Record<keyof (typeof clonedColor)['value'], number>
			);

			switch (clonedColor.format) {
				case 'cmyk':
					return { format: 'cmyk', value: newValue as CMYK['value'] };
				case 'hsl':
					return { format: 'hsl', value: newValue as HSL['value'] };
				case 'hsv':
					return { format: 'hsv', value: newValue as HSV['value'] };
				case 'sl':
					return { format: 'sl', value: newValue as SL['value'] };
				case 'sv':
					return { format: 'sv', value: newValue as SV['value'] };
				default:
					console.error('Unsupported format for colorStringToColor');

					const unbrandedHSL = defaultColors.hsl;

					const brandedHue = utils.brand.asRadial(
						unbrandedHSL.value.hue
					);
					const brandedSaturation = utils.brand.asPercentile(
						unbrandedHSL.value.saturation
					);
					const brandedLightness = utils.brand.asPercentile(
						unbrandedHSL.value.lightness
					);

					return {
						value: {
							hue: brandedHue,
							saturation: brandedSaturation,
							lightness: brandedLightness
						},
						format: 'hsl'
					};
			}
		},
		brandHexStringMapValue(hex: HexStringMap['value']): Hex['value'] {
			return { hex: utils.brand.asHexSet(hex.hex) };
		},
		brandHSLStringMapValue(
			hsl: HSLStringMap['value']
		): HSL['value'] {
			return {
				hue: utils.brand.asRadial(parseFloat(hsl.hue)),
				saturation: utils.brand.asPercentile(
					parseFloat(hsl.saturation) / 100
				),
				lightness: utils.brand.asPercentile(
					parseFloat(hsl.lightness) / 100
				)
			};
		},
		brandHSVStringMapValue(
			hsv: HSVStringMap['value']
		): HSV['value'] {
			return {
				hue: utils.brand.asRadial(parseFloat(hsv.hue)),
				saturation: utils.brand.asPercentile(
					parseFloat(hsv.saturation) / 100
				),
				value: utils.brand.asPercentile(parseFloat(hsv.value) / 100)
			};
		},
		brandLABStringMapValue(
			lab: LABStringMap['value']
		): LAB['value'] {
			return {
				l: utils.brand.asLAB_L(parseFloat(lab.l)),
				a: utils.brand.asLAB_A(parseFloat(lab.a)),
				b: utils.brand.asLAB_B(parseFloat(lab.b))
			};
		},
		brandRGBStringMapValue(
			rgb: RGBStringMap['value']
		): RGB['value'] {
			return {
				red: utils.brand.asByteRange(parseFloat(rgb.red)),
				green: utils.brand.asByteRange(parseFloat(rgb.green)),
				blue: utils.brand.asByteRange(parseFloat(rgb.blue))
			};
		},
		brandXYZStringMapValue(xyz: XYZStringMap['value']): XYZ['value'] {
			return {
				x: utils.brand.asXYZ_X(parseFloat(xyz.x)),
				y: utils.brand.asXYZ_Y(parseFloat(xyz.y)),
				z: utils.brand.asXYZ_Z(parseFloat(xyz.z))
			};
		}
	}
}
