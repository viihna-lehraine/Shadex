// File: utils/palette.js

import {
	AppServicesInterface,
	AppUtilsInterface,
	BrandingUtilsInterface,
	CMYK,
	CMYK_StringProps,
	ColorDataExtended,
	ColorUtilHelpersInterface,
	ColorUtilsInterface,
	CoreUtilsInterface,
	DOMUtilsInterface,
	FormattingUtilsInterface,
	Hex,
	Hex_StringProps,
	HSL,
	HSL_StringProps,
	HSV,
	HSV_StringProps,
	LAB,
	LAB_StringProps,
	Palette,
	PaletteArgs,
	PaletteItem,
	PaletteUtilsInterface,
	RGB,
	RGB_StringProps,
	SL,
	SV,
	SanitationUtilsInterface,
	TypeGuardUtilsInterface,
	ValidationUtilsInterface,
	XYZ,
	XYZ_StringProps
} from '../types/index.js';

function createPaletteItem(
	color: HSL,
	itemID: number,
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	format: FormattingUtilsInterface,
	sanitize: SanitationUtilsInterface,
	typeGuards: TypeGuardUtilsInterface,
	validate: ValidationUtilsInterface
): PaletteItem {
	const clonedColor = coreUtils.clone(color) as HSL;

	return {
		itemID,
		colors: {
			main: {
				cmyk: (
					colorUtils.convertHSL(
						clonedColor,
						'cmyk',
						appServices,
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						format,
						sanitize,
						validate
					) as CMYK
				).value,
				hex: (
					colorUtils.convertHSL(
						clonedColor,
						'hex',
						appServices,
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						format,
						sanitize,
						validate
					) as Hex
				).value,
				hsl: clonedColor.value,
				hsv: (
					colorUtils.convertHSL(
						clonedColor,
						'hsv',
						appServices,
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						format,
						sanitize,
						validate
					) as HSV
				).value,
				lab: (
					colorUtils.convertHSL(
						clonedColor,
						'lab',
						appServices,
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						format,
						sanitize,
						validate
					) as LAB
				).value,
				rgb: (
					colorUtils.convertHSL(
						clonedColor,
						'rgb',
						appServices,
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						format,
						sanitize,
						validate
					) as RGB
				).value,
				xyz: (
					colorUtils.convertHSL(
						clonedColor,
						'xyz',
						appServices,
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						format,
						sanitize,
						validate
					) as XYZ
				).value
			},
			stringProps: {
				cmyk: (
					colorUtils.convertColorToColorString(
						colorUtils.convertHSL(
							clonedColor,
							'cmyk',
							appServices,
							brand,
							colorHelpers,
							colorUtils,
							coreUtils,
							format,
							sanitize,
							validate
						),
						appServices,
						coreUtils,
						format,
						typeGuards
					) as CMYK_StringProps
				).value,
				hex: (
					colorUtils.convertColorToColorString(
						colorUtils.convertHSL(
							clonedColor,
							'hex',
							appServices,
							brand,
							colorHelpers,
							colorUtils,
							coreUtils,
							format,
							sanitize,
							validate
						),
						appServices,
						coreUtils,
						format,
						typeGuards
					) as Hex_StringProps
				).value,
				hsl: (
					colorUtils.convertColorToColorString(
						clonedColor,
						appServices,
						coreUtils,
						format,
						typeGuards
					) as HSL_StringProps
				).value,
				hsv: (
					colorUtils.convertColorToColorString(
						colorUtils.convertHSL(
							clonedColor,
							'hsv',
							appServices,
							brand,
							colorHelpers,
							colorUtils,
							coreUtils,
							format,
							sanitize,
							validate
						),
						appServices,
						coreUtils,
						format,
						typeGuards
					) as HSV_StringProps
				).value,
				lab: (
					colorUtils.convertColorToColorString(
						colorUtils.convertHSL(
							clonedColor,
							'lab',
							appServices,
							brand,
							colorHelpers,
							colorUtils,
							coreUtils,
							format,
							sanitize,
							validate
						),
						appServices,
						coreUtils,
						format,
						typeGuards
					) as LAB_StringProps
				).value,
				rgb: (
					colorUtils.convertColorToColorString(
						colorUtils.convertHSL(
							clonedColor,
							'rgb',
							appServices,
							brand,
							colorHelpers,
							colorUtils,
							coreUtils,
							format,
							sanitize,
							validate
						),
						appServices,
						coreUtils,
						format,
						typeGuards
					) as RGB_StringProps
				).value,
				xyz: (
					colorUtils.convertColorToColorString(
						colorUtils.convertHSL(
							clonedColor,
							'xyz',
							appServices,
							brand,
							colorHelpers,
							colorUtils,
							coreUtils,
							format,
							sanitize,
							validate
						),
						appServices,
						coreUtils,
						format,
						typeGuards
					) as XYZ_StringProps
				).value
			},
			css: {
				cmyk: colorUtils.convertColorToCSS(
					colorUtils.convertHSL(
						clonedColor,
						'cmyk',
						appServices,
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						format,
						sanitize,
						validate
					)
				),
				hex: colorUtils.convertColorToCSS(
					colorUtils.convertHSL(
						clonedColor,
						'hex',
						appServices,
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						format,
						sanitize,
						validate
					)
				),
				hsl: colorUtils.convertColorToCSS(clonedColor),
				hsv: colorUtils.convertColorToCSS(
					colorUtils.convertHSL(
						clonedColor,
						'hsv',
						appServices,
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						format,
						sanitize,
						validate
					)
				),
				lab: colorUtils.convertColorToCSS(
					colorUtils.convertHSL(
						clonedColor,
						'lab',
						appServices,
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						format,
						sanitize,
						validate
					)
				),
				rgb: colorUtils.convertColorToCSS(
					colorUtils.convertHSL(
						clonedColor,
						'rgb',
						appServices,
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						format,
						sanitize,
						validate
					)
				),
				xyz: colorUtils.convertColorToCSS(
					colorUtils.convertHSL(
						clonedColor,
						'xyz',
						appServices,
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						format,
						sanitize,
						validate
					)
				)
			}
		}
	};
}

function createPaletteItemArray(
	baseColor: HSL,
	hues: number[],
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	domUtils: DOMUtilsInterface,
	format: FormattingUtilsInterface,
	sanitize: SanitationUtilsInterface,
	typeGuards: TypeGuardUtilsInterface,
	validate: ValidationUtilsInterface
): PaletteItem[] {
	const paletteItems: PaletteItem[] = [];

	// base color always gets itemID = 1
	paletteItems.push(
		createPaletteItem(
			baseColor,
			1, // ID 1 for base color
			appServices,
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			format,
			sanitize,
			typeGuards,
			validate
		)
	);

	// iterate over hues and generate PaletteItems
	for (const [i, hue] of hues.entries()) {
		const newColor: HSL = {
			value: {
				hue: brand.asRadial(hue, validate),
				saturation: brand.asPercentile(Math.random() * 100, validate),
				lightness: brand.asPercentile(Math.random() * 100, validate)
			},
			format: 'hsl'
		};

		const newPaletteItem = createPaletteItem(
			newColor,
			i + 2, // IDs start at 2 for generated colors
			appServices,
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			format,
			sanitize,
			typeGuards,
			validate
		);

		paletteItems.push(newPaletteItem);
		domUtils.updateColorBox(newColor, String(i + 2), colorUtils);
	}

	return paletteItems;
}

function createPaletteObject(
	args: PaletteArgs,
	appUtils: AppUtilsInterface
): Palette {
	return {
		id: `${args.type}_${args.paletteID}`,
		items: args.items,
		metadata: {
			name: '',
			timestamp: appUtils.getFormattedTimestamp(),
			swatches: args.swatches,
			type: args.type,
			flags: {
				limitDark: args.limitDark,
				limitGray: args.limitGray,
				limitLight: args.limitLight
			}
		}
	};
}

function generateAllColorValues(
	color: HSL,
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	format: FormattingUtilsInterface,
	sanitize: SanitationUtilsInterface,
	validate: ValidationUtilsInterface
): Partial<ColorDataExtended> {
	const log = console.log;
	const result: Partial<ColorDataExtended> = {};

	try {
		const clonedColor = coreUtils.clone(color);

		if (!validate.colorValue(clonedColor, coreUtils)) {
			log(
				'error',
				`Invalid color: ${JSON.stringify(clonedColor)}`,
				'paletteUtils.generateAllColorValues()'
			);

			return {};
		}

		result.cmyk = colorUtils.convertHSL(
			clonedColor,
			'cmyk',
			appServices,
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			format,
			sanitize,
			validate
		) as CMYK;
		result.hex = colorUtils.convertHSL(
			clonedColor,
			'hex',
			appServices,
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			format,
			sanitize,
			validate
		) as Hex;
		result.hsl = clonedColor;
		result.hsv = colorUtils.convertHSL(
			clonedColor,
			'hsv',
			appServices,
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			format,
			sanitize,
			validate
		) as HSV;
		result.lab = colorUtils.convertHSL(
			clonedColor,
			'lab',
			appServices,
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			format,
			sanitize,
			validate
		) as LAB;
		result.rgb = colorUtils.convertHSL(
			clonedColor,
			'rgb',
			appServices,
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			format,
			sanitize,
			validate
		) as RGB;
		result.sl = colorUtils.convertHSL(
			clonedColor,
			'sl',
			appServices,
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			format,
			sanitize,
			validate
		) as SL;
		result.sv = colorUtils.convertHSL(
			clonedColor,
			'sv',
			appServices,
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			format,
			sanitize,
			validate
		) as SV;
		result.xyz = colorUtils.convertHSL(
			clonedColor,
			'xyz',
			appServices,
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			format,
			sanitize,
			validate
		) as XYZ;

		return result;
	} catch (error) {
		log(
			'error',
			`Error generating all color values: ${error}`,
			'paletteUtils.generateAllColorValues()'
		);

		return {};
	}
}

export const paletteUtils: PaletteUtilsInterface = {
	createPaletteItem,
	createPaletteItemArray,
	createPaletteObject,
	generateAllColorValues
};
