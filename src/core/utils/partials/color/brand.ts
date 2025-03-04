import {
	BrandingUtilities,
	CMYK,
	CMYKStringMap,
	Color,
	ColorBrandUtilities,
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
	Services,
	SL,
	SV,
	XYZ,
	XYZStringMap
} from '../../../../types/index.js';
import { defaults } from '../../../../config/index.js';

const defaultColors = defaults.colors;

export function colorBrandingUtilitiesFactory(
	brand: BrandingUtilities, helpers: Helpers, services: Services
): ColorBrandUtilities {
	const { data: { deepClone, parseValue } } = helpers;
	const { errors, log } = services;

	function brandCMYKString(
		cmyk: CMYKStringMap['value']
	): CMYK['value'] {
		return errors.handleSync(() => {
			return {
				cyan: brand.asPercentile(parseFloat(cmyk.cyan) / 100),
				magenta: brand.asPercentile(parseFloat(cmyk.magenta) / 100),
				yellow: brand.asPercentile(parseFloat(cmyk.yellow) / 100),
				key: brand.asPercentile(parseFloat(cmyk.key) / 100)
			};
		}, 'Error occurred while branding CMYK string.');
	}

	function brandColorString(color: ColorStringMap): Color {
		return errors.handleSync(() => {
			const clonedColor = deepClone(color);

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
					log.error(
						'Unsupported format for colorStringToColor',
						'utils.color.brandColorString',
					);

					const unbrandedHSL = defaultColors.hsl;

					const brandedHue = brand.asRadial(
						unbrandedHSL.value.hue
					);
					const brandedSaturation = brand.asPercentile(
						unbrandedHSL.value.saturation
					);
					const brandedLightness = brand.asPercentile(
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
		}, 'Error occurred while branding color string map value.');
	}

	function brandHexString(hex: HexStringMap['value']): Hex['value'] {
		return errors.handleSync(() => {
			return { hex: brand.asHexSet(hex.hex) };
		}, 'Error occurred while branding hex string.');
	}

	function brandHSLString(
		hsl: HSLStringMap['value']
	): HSL['value'] {
		return errors.handleSync(() => {
			return {
				hue: brand.asRadial(parseFloat(hsl.hue)),
				saturation: brand.asPercentile(
					parseFloat(hsl.saturation) / 100
				),
				lightness: brand.asPercentile(
					parseFloat(hsl.lightness) / 100
				)
			};
		}, 'Error occurred while branding HSL string.');
	}

	function brandHSVString(
		hsv: HSVStringMap['value']
	): HSV['value'] {
		return errors.handleSync(() => {
			return {
				hue: brand.asRadial(parseFloat(hsv.hue)),
				saturation: brand.asPercentile(
					parseFloat(hsv.saturation) / 100
				),
				value: brand.asPercentile(parseFloat(hsv.value) / 100)
			};
		}, 'Error occurred while branding HSV string.');
	}

	function brandLABString(
		lab: LABStringMap['value']
	): LAB['value'] {
		return errors.handleSync(() => {
			return {
				l: brand.asLAB_L(parseFloat(lab.l)),
				a: brand.asLAB_A(parseFloat(lab.a)),
				b: brand.asLAB_B(parseFloat(lab.b))
			};
		}, 'Error occurred while branding LAB string.');
	}

	function brandRGBString(
		rgb: RGBStringMap['value']
	): RGB['value'] {
		return errors.handleSync(() => {
			return {
				red: brand.asByteRange(parseFloat(rgb.red)),
				green: brand.asByteRange(parseFloat(rgb.green)),
				blue: brand.asByteRange(parseFloat(rgb.blue))
			};
		}, 'Error occurred while branding RGB string.');
	}

	function brandXYZString(xyz: XYZStringMap['value']): XYZ['value'] {
		return errors.handleSync(() => {
			return {
				x: brand.asXYZ_X(parseFloat(xyz.x)),
				y: brand.asXYZ_Y(parseFloat(xyz.y)),
				z: brand.asXYZ_Z(parseFloat(xyz.z))
			};
		}, 'Error occurred while branding XYZ string.');
	}

	const colorBrandingUtilities: ColorBrandUtilities = {
		brandCMYKString,
		brandColorString,
		brandHexString,
		brandHSLString,
		brandHSVString,
		brandLABString,
		brandRGBString,
		brandXYZString
	};

	return errors.handleSync(() => colorBrandingUtilities, 'Error creating color branding utilities sub-group.');
}
