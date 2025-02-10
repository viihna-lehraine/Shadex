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
	ConfigDataInterface,
	ConstsDataInterface,
	CoreUtilsInterface,
	DataSetsInterface,
	DefaultDataInterface,
	DOMDataInterface,
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
	ModeDataInterface,
	Palette,
	PaletteArgs,
	PaletteItem,
	PaletteGenerationArgs,
	PaletteUtilHelpersInterface,
	PaletteUtilsInterface,
	RGB,
	RGB_StringProps,
	SL,
	SV,
	SanitationUtilsInterface,
	TypeGuardUtilsInteface,
	ValidationUtilsInterface,
	XYZ,
	XYZ_StringProps
} from '../types/index.js';

function createPaletteItem(
	color: HSL,
	itemID: number,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	defaultColorStrings: DefaultDataInterface['colors']['strings'],
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	typeGuards: TypeGuardUtilsInteface,
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
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						defaultColors,
						format,
						log,
						regex,
						sanitize,
						sets,
						validate
					) as CMYK
				).value,
				hex: (
					colorUtils.convertHSL(
						clonedColor,
						'hex',
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						defaultColors,
						format,
						log,
						regex,
						sanitize,
						sets,
						validate
					) as Hex
				).value,
				hsl: clonedColor.value,
				hsv: (
					colorUtils.convertHSL(
						clonedColor,
						'hsv',
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						defaultColors,
						format,
						log,
						regex,
						sanitize,
						sets,
						validate
					) as HSV
				).value,
				lab: (
					colorUtils.convertHSL(
						clonedColor,
						'lab',
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						defaultColors,
						format,
						log,
						regex,
						sanitize,
						sets,
						validate
					) as LAB
				).value,
				rgb: (
					colorUtils.convertHSL(
						clonedColor,
						'rgb',
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						defaultColors,
						format,
						log,
						regex,
						sanitize,
						sets,
						validate
					) as RGB
				).value,
				xyz: (
					colorUtils.convertHSL(
						clonedColor,
						'xyz',
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						defaultColors,
						format,
						log,
						regex,
						sanitize,
						sets,
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
							brand,
							colorHelpers,
							colorUtils,
							coreUtils,
							defaultColors,
							format,
							log,
							regex,
							sanitize,
							sets,
							validate
						),
						coreUtils,
						defaultColorStrings,
						format,
						log,
						typeGuards
					) as CMYK_StringProps
				).value,
				hex: (
					colorUtils.convertColorToColorString(
						colorUtils.convertHSL(
							clonedColor,
							'hex',
							brand,
							colorHelpers,
							colorUtils,
							coreUtils,
							defaultColors,
							format,
							log,
							regex,
							sanitize,
							sets,
							validate
						),
						coreUtils,
						defaultColorStrings,
						format,
						log,
						typeGuards
					) as Hex_StringProps
				).value,
				hsl: (
					colorUtils.convertColorToColorString(
						clonedColor,
						coreUtils,
						defaultColorStrings,
						format,
						log,
						typeGuards
					) as HSL_StringProps
				).value,
				hsv: (
					colorUtils.convertColorToColorString(
						colorUtils.convertHSL(
							clonedColor,
							'hsv',
							brand,
							colorHelpers,
							colorUtils,
							coreUtils,
							defaultColors,
							format,
							log,
							regex,
							sanitize,
							sets,
							validate
						),
						coreUtils,
						defaultColorStrings,
						format,
						log,
						typeGuards
					) as HSV_StringProps
				).value,
				lab: (
					colorUtils.convertColorToColorString(
						colorUtils.convertHSL(
							clonedColor,
							'lab',
							brand,
							colorHelpers,
							colorUtils,
							coreUtils,
							defaultColors,
							format,
							log,
							regex,
							sanitize,
							sets,
							validate
						),
						coreUtils,
						defaultColorStrings,
						format,
						log,
						typeGuards
					) as LAB_StringProps
				).value,
				rgb: (
					colorUtils.convertColorToColorString(
						colorUtils.convertHSL(
							clonedColor,
							'rgb',
							brand,
							colorHelpers,
							colorUtils,
							coreUtils,
							defaultColors,
							format,
							log,
							regex,
							sanitize,
							sets,
							validate
						),
						coreUtils,
						defaultColorStrings,
						format,
						log,
						typeGuards
					) as RGB_StringProps
				).value,
				xyz: (
					colorUtils.convertColorToColorString(
						colorUtils.convertHSL(
							clonedColor,
							'xyz',
							brand,
							colorHelpers,
							colorUtils,
							coreUtils,
							defaultColors,
							format,
							log,
							regex,
							sanitize,
							sets,
							validate
						),
						coreUtils,
						defaultColorStrings,
						format,
						log,
						typeGuards
					) as XYZ_StringProps
				).value
			},
			css: {
				cmyk: colorUtils.convertColorToCSS(
					colorUtils.convertHSL(
						clonedColor,
						'cmyk',
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						defaultColors,
						format,
						log,
						regex,
						sanitize,
						sets,
						validate
					)
				),
				hex: colorUtils.convertColorToCSS(
					colorUtils.convertHSL(
						clonedColor,
						'hex',
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						defaultColors,
						format,
						log,
						regex,
						sanitize,
						sets,
						validate
					)
				),
				hsl: colorUtils.convertColorToCSS(clonedColor),
				hsv: colorUtils.convertColorToCSS(
					colorUtils.convertHSL(
						clonedColor,
						'hsv',
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						defaultColors,
						format,
						log,
						regex,
						sanitize,
						sets,
						validate
					)
				),
				lab: colorUtils.convertColorToCSS(
					colorUtils.convertHSL(
						clonedColor,
						'lab',
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						defaultColors,
						format,
						log,
						regex,
						sanitize,
						sets,
						validate
					)
				),
				rgb: colorUtils.convertColorToCSS(
					colorUtils.convertHSL(
						clonedColor,
						'rgb',
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						defaultColors,
						format,
						log,
						regex,
						sanitize,
						sets,
						validate
					)
				),
				xyz: colorUtils.convertColorToCSS(
					colorUtils.convertHSL(
						clonedColor,
						'xyz',
						brand,
						colorHelpers,
						colorUtils,
						coreUtils,
						defaultColors,
						format,
						log,
						regex,
						sanitize,
						sets,
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
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	defaultColorStrings: DefaultDataInterface['colors']['strings'],
	domUtils: DOMUtilsInterface,
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	typeGuards: TypeGuardUtilsInteface,
	validate: ValidationUtilsInterface
): PaletteItem[] {
	const paletteItems: PaletteItem[] = [];

	// base color always gets itemID = 1
	paletteItems.push(
		createPaletteItem(
			baseColor,
			1, // ID 1 for base color
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			defaultColorStrings,
			format,
			log,
			regex,
			sanitize,
			sets,
			typeGuards,
			validate
		)
	);

	// iterate over hues and generate PaletteItems
	for (const [i, hue] of hues.entries()) {
		const newColor: HSL = {
			value: {
				hue: brand.asRadial(hue, sets, validate),
				saturation: brand.asPercentile(
					Math.random() * 100,
					sets,
					validate
				),
				lightness: brand.asPercentile(
					Math.random() * 100,
					sets,
					validate
				)
			},
			format: 'hsl'
		};

		const newPaletteItem = createPaletteItem(
			newColor,
			i + 2, // IDs start at 2 for generated colors
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			defaultColorStrings,
			format,
			log,
			regex,
			sanitize,
			sets,
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
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	format: FormattingUtilsInterface,
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): Partial<ColorDataExtended> {
	const log = console.log;
	const result: Partial<ColorDataExtended> = {};

	try {
		const clonedColor = coreUtils.clone(color);

		if (!validate.colorValue(clonedColor, coreUtils, regex)) {
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
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			format,
			log,
			regex,
			sanitize,
			sets,
			validate
		) as CMYK;
		result.hex = colorUtils.convertHSL(
			clonedColor,
			'hex',
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			format,
			log,
			regex,
			sanitize,
			sets,
			validate
		) as Hex;
		result.hsl = clonedColor;
		result.hsv = colorUtils.convertHSL(
			clonedColor,
			'hsv',
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			format,
			log,
			regex,
			sanitize,
			sets,
			validate
		) as HSV;
		result.lab = colorUtils.convertHSL(
			clonedColor,
			'lab',
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			format,
			log,
			regex,
			sanitize,
			sets,
			validate
		) as LAB;
		result.rgb = colorUtils.convertHSL(
			clonedColor,
			'rgb',
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			format,
			log,
			regex,
			sanitize,
			sets,
			validate
		) as RGB;
		result.sl = colorUtils.convertHSL(
			clonedColor,
			'sl',
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			format,
			log,
			regex,
			sanitize,
			sets,
			validate
		) as SL;
		result.sv = colorUtils.convertHSL(
			clonedColor,
			'sv',
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			format,
			log,
			regex,
			sanitize,
			sets,
			validate
		) as SV;
		result.xyz = colorUtils.convertHSL(
			clonedColor,
			'xyz',
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			format,
			log,
			regex,
			sanitize,
			sets,
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

function generateAnalogousHues(
	color: HSL,
	numBoxes: number,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	validate: ValidationUtilsInterface
): number[] {
	try {
		if (!validate.colorValue(color, coreUtils, regex)) {
			log(
				'error',
				`Invalid color value ${JSON.stringify(color)}`,
				'paletteUtils.generateAnalogousHues()'
			);

			return [];
		}

		const clonedColor = coreUtils.clone(color) as HSL;

		const analogousHues: number[] = [];
		const baseHue = clonedColor.value.hue;
		const maxTotalDistance = 60;
		const minTotalDistance = Math.max(20, 10 + (numBoxes - 2) * 12);
		const totalIncrement =
			Math.floor(
				Math.random() * (maxTotalDistance - minTotalDistance + 1)
			) + minTotalDistance;
		const increment = Math.floor(totalIncrement / (numBoxes - 1));

		for (let i = 1; i < numBoxes; i++) {
			analogousHues.push((baseHue + increment * i) % 360);
		}

		return analogousHues;
	} catch (error) {
		log(
			'error',
			`Error generating analogous hues: ${error}`,
			'paletteUtils.generateAnalogousHues()'
		);

		return [];
	}
}

function generateAnalogousPalette(
	args: PaletteGenerationArgs,
	appUtils: AppUtilsInterface,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	defaultColorStrings: DefaultDataInterface['colors']['strings'],
	domIDs: DOMDataInterface['ids']['static'],
	domUtils: DOMUtilsInterface,
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	mode: ModeDataInterface,
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	typeGuards: TypeGuardUtilsInteface,
	validate: ValidationUtilsInterface
): Palette {
	if (args.swatches < 2) domUtils.enforceSwatchRules(2, 6, domIDs, log, mode);

	const baseColor = appUtils.generateRandomHSL(
		brand,
		coreUtils,
		defaultColors,
		log,
		regex,
		sanitize,
		sets,
		validate
	);
	const hues = generateAnalogousHues(
		baseColor,
		args.swatches,
		coreUtils,
		log,
		regex,
		validate
	);
	const paletteItems = createPaletteItemArray(
		baseColor,
		hues,
		brand,
		colorHelpers,
		colorUtils,
		coreUtils,
		defaultColors,
		defaultColorStrings,
		domUtils,
		format,
		log,
		regex,
		sanitize,
		sets,
		typeGuards,
		validate
	);
	const paletteID = `${args.type}_${Date.now()}`;
	const paletteArgs: PaletteArgs = {
		type: 'analogous',
		items: paletteItems,
		paletteID,
		swatches: args.swatches,
		limitDark: args.limitDark,
		limitGray: args.limitGray,
		limitLight: args.limitLight
	};
	const analogousPalette = createPaletteObject(paletteArgs, appUtils);

	return analogousPalette;
}

function generateComplementaryPalette(
	args: PaletteGenerationArgs,
	appUtils: AppUtilsInterface,
	distributionType: keyof ConstsDataInterface['probabilities'],
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	defaultColorStrings: DefaultDataInterface['colors']['strings'],
	domIDs: DOMDataInterface['ids']['static'],
	domUtils: DOMUtilsInterface,
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	mode: ModeDataInterface,
	paletteHelpers: PaletteUtilHelpersInterface,
	probabilityConsts: ConstsDataInterface['probabilities'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	typeGuards: TypeGuardUtilsInteface,
	validate: ValidationUtilsInterface
): Palette {
	const swatchCount = Math.max(2, Math.min(6, args.swatches));
	domUtils.enforceSwatchRules(swatchCount, 6, domIDs, log, mode);

	const baseColor = appUtils.generateRandomHSL(
		brand,
		coreUtils,
		defaultColors,
		log,
		regex,
		sanitize,
		sets,
		validate
	);
	const baseHue = baseColor.value.hue;
	const hues: number[] = [baseHue];

	// always include the direct complement
	hues.push((baseHue + 180) % 360);

	// generate additional complementary variations if needed
	const extraColorsNeeded = swatchCount - 2;

	if (extraColorsNeeded > 0) {
		for (let i = 0; i < extraColorsNeeded; i++) {
			const variationOffset = paletteHelpers.getWeightedRandomInterval(
				distributionType,
				log,
				probabilityConsts
			);
			const direction = Math.random() < 0.5 ? 1 : -1; // randomize direction
			const newHue =
				(baseHue + 180 + variationOffset * direction + 360) % 360;
			hues.push(newHue);
		}
	}

	// define lightness & saturation variation ranges
	const lightnessRange = [-10, -5, 0, 5, 10]; // possible changes in lightness
	const saturationRange = [-15, -10, 0, 10, 15]; // possible changes in saturation

	const paletteItems = hues.map((hue, index) => {
		const lightnessOffset =
			lightnessRange[Math.floor(Math.random() * lightnessRange.length)];
		const saturationOffset =
			saturationRange[Math.floor(Math.random() * saturationRange.length)];

		const newColor: HSL = {
			value: {
				hue: brand.asRadial(hue, sets, validate),
				saturation: brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationOffset
						)
					),
					sets,
					validate
				),
				lightness: brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessOffset)
					),
					sets,
					validate
				)
			},
			format: 'hsl'
		};

		return createPaletteItem(
			newColor,
			index + 1, // pass 1-based itemID
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			defaultColorStrings,
			format,
			log,
			regex,
			sanitize,
			sets,
			typeGuards,
			validate
		);
	});

	const paletteID = `${args.type}_${appUtils.getFormattedTimestamp()}`;
	const paletteArgs: PaletteArgs = {
		type: 'complementary',
		items: paletteItems,
		paletteID,
		swatches: swatchCount,
		limitDark: args.limitDark,
		limitGray: args.limitGray,
		limitLight: args.limitLight
	};

	return createPaletteObject(paletteArgs, appUtils);
}

function generateDiadicHues(
	baseHue: number,
	distributionType: keyof ConstsDataInterface['probabilities'],
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log'],
	paletteHelpers: PaletteUtilHelpersInterface,
	probabilityConsts: ConstsDataInterface['probabilities']
): number[] {
	try {
		const clonedBaseHue = coreUtils.clone(baseHue);
		const diadicHues = [];
		const randomDistance = paletteHelpers.getWeightedRandomInterval(
			distributionType,
			log,
			probabilityConsts
		);
		const hue1 = clonedBaseHue;
		const hue2 = (hue1 + randomDistance) % 360;

		diadicHues.push(hue1, hue2);

		return diadicHues;
	} catch (error) {
		log(
			'error',
			`Error generating diadic hues: ${error}`,
			'paletteUtils.generateDiadicHues()'
		);

		return [];
	}
}

function generateDiadicPalette(
	args: PaletteGenerationArgs,
	distributionType: keyof ConstsDataInterface['probabilities'],
	paletteRanges: ConstsDataInterface['paletteRanges'],
	appUtils: AppUtilsInterface,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	defaultColorStrings: DefaultDataInterface['colors']['strings'],
	domIDs: DOMDataInterface['ids']['static'],
	domUtils: DOMUtilsInterface,
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	mode: ModeDataInterface,
	paletteHelpers: PaletteUtilHelpersInterface,
	probabilityConsts: ConstsDataInterface['probabilities'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	typeGuards: TypeGuardUtilsInteface,
	validate: ValidationUtilsInterface
): Palette {
	const swatchCount = Math.max(2, Math.min(6, args.swatches));
	domUtils.enforceSwatchRules(swatchCount, 6, domIDs, log, mode);

	const baseColor = appUtils.generateRandomHSL(
		brand,
		coreUtils,
		defaultColors,
		log,
		regex,
		sanitize,
		sets,
		validate
	);
	const baseHue = baseColor.value.hue;
	const hues = generateDiadicHues(
		baseHue,
		distributionType,
		coreUtils,
		log,
		paletteHelpers,
		probabilityConsts
	);

	// if more swatches are needed, create slight variations
	const extraColorsNeeded = swatchCount - 2;
	if (extraColorsNeeded > 0) {
		for (let i = 0; i < extraColorsNeeded; i++) {
			const variationOffset = paletteHelpers.getWeightedRandomInterval(
				distributionType,
				log,
				probabilityConsts
			);
			const direction = i % 2 === 0 ? 1 : -1;

			hues.push((baseHue + variationOffset * direction) % 360);
		}
	}

	// create PaletteItem array with incrementing itemIDs
	const paletteItems = hues.map((hue, index) => {
		const saturationShift =
			Math.random() * paletteRanges.shift.diadic.sat -
			paletteRanges.shift.diadic.sat / 2;
		const lightnessShift =
			Math.random() * paletteRanges.shift.diadic.light -
			paletteRanges.shift.diadic.light / 2;
		const newColor: HSL = {
			value: {
				hue: brand.asRadial(hue, sets, validate),
				saturation: brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					),
					sets,
					validate
				),
				lightness: brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					),
					sets,
					validate
				)
			},
			format: 'hsl'
		};

		return createPaletteItem(
			newColor,
			index + 1,
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			defaultColorStrings,
			format,
			log,
			regex,
			sanitize,
			sets,
			typeGuards,
			validate
		);
	});
	const paletteID = `diadic_${Date.now()}`;
	const paletteArgs: PaletteArgs = {
		type: 'diadic',
		items: paletteItems,
		paletteID,
		swatches: swatchCount,
		limitDark: args.limitDark,
		limitGray: args.limitGray,
		limitLight: args.limitLight
	};

	return createPaletteObject(paletteArgs, appUtils);
}

function generateHexadicHues(
	color: HSL,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	validate: ValidationUtilsInterface
): number[] {
	try {
		const clonedColor = coreUtils.clone(color);

		if (!validate.colorValue(clonedColor, coreUtils, regex)) {
			log(
				'error',
				`Invalid color value ${JSON.stringify(clonedColor)}`,
				'paletteUtils.generateHexadicHues()'
			);

			return [];
		}

		const clonedBaseHSL = generateAllColorValues(
			clonedColor,
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			format,
			regex,
			sanitize,
			sets,
			validate
		).hsl as HSL;

		if (!clonedBaseHSL) {
			log(
				'error',
				'Unable to generate hexadic hues - missing HSL values',
				'paletteUtils.generateHexadicHues()',
				1
			);

			return [];
		}

		const hexadicHues: number[] = [];
		const baseHue = clonedBaseHSL.value.hue;
		const hue1 = baseHue;
		const hue2 = (hue1 + 180) % 360;
		const randomDistance = Math.floor(Math.random() * 61 + 30);
		const hue3 = (hue1 + randomDistance) % 360;
		const hue4 = (hue3 + 180) % 360;
		const hue5 = (hue1 + 360 - randomDistance) % 360;
		const hue6 = (hue5 + 180) % 360;

		hexadicHues.push(hue1, hue2, hue3, hue4, hue5, hue6);

		return hexadicHues;
	} catch (error) {
		log(
			'error',
			`Error generating hexadic hues: ${error}`,
			'paletteUtils.generateHexadicHues()'
		);

		return [];
	}
}

function generateHexadicPalette(
	args: PaletteGenerationArgs,
	appUtils: AppUtilsInterface,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	defaultColorStrings: DefaultDataInterface['colors']['strings'],
	domIDs: DOMDataInterface['ids']['static'],
	domUtils: DOMUtilsInterface,
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	mode: ModeDataInterface,
	paletteRanges: ConstsDataInterface['paletteRanges'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	typeGuards: TypeGuardUtilsInteface,
	validate: ValidationUtilsInterface
): Palette {
	// hexadic palettes always have 6 swatches
	const swatchCount = 6;
	domUtils.enforceSwatchRules(swatchCount, 6, domIDs, log, mode);

	// generate base color
	const baseColor = appUtils.generateRandomHSL(
		brand,
		coreUtils,
		defaultColors,
		log,
		regex,
		sanitize,
		sets,
		validate
	);
	const hues = generateHexadicHues(
		baseColor,
		brand,
		colorHelpers,
		colorUtils,
		coreUtils,
		defaultColors,
		format,
		log,
		regex,
		sanitize,
		sets,
		validate
	);

	// create PaletteItem array with assigned itemIDs
	const paletteItems = hues.map((hue, index) => {
		const saturationShift =
			Math.random() * paletteRanges.shift.hexad.sat -
			paletteRanges.shift.hexad.sat / 2;
		const lightnessShift =
			Math.random() * paletteRanges.shift.hexad.light -
			paletteRanges.shift.hexad.light / 2;

		const newColor: HSL = {
			value: {
				hue: brand.asRadial(hue, sets, validate),
				saturation: brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					),
					sets,
					validate
				),
				lightness: brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					),
					sets,
					validate
				)
			},
			format: 'hsl'
		};

		return createPaletteItem(
			newColor,
			index + 1, // Assign itemID
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			defaultColorStrings,
			format,
			log,
			regex,
			sanitize,
			sets,
			typeGuards,
			validate
		);
	});

	// generate a unique Palette ID
	const paletteID = `hexadic_${Date.now()}`;

	// build and return the palette
	const paletteArgs: PaletteArgs = {
		type: 'hexadic',
		items: paletteItems,
		paletteID,
		swatches: swatchCount,
		limitDark: args.limitDark,
		limitGray: args.limitGray,
		limitLight: args.limitLight
	};

	return createPaletteObject(paletteArgs, appUtils);
}

function generateMonochromaticPalette(
	args: PaletteGenerationArgs,
	appUtils: AppUtilsInterface,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	defaultColorStrings: DefaultDataInterface['colors']['strings'],
	domIDs: DOMDataInterface['ids']['static'],
	domUtils: DOMUtilsInterface,
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	mode: ModeDataInterface,
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	typeGuards: TypeGuardUtilsInteface,
	validate: ValidationUtilsInterface
): Palette {
	const swatchCount = Math.max(2, Math.min(6, args.swatches));
	domUtils.enforceSwatchRules(swatchCount, 6, domIDs, log, mode);

	// Generate base color
	const baseColor = appUtils.generateRandomHSL(
		brand,
		coreUtils,
		defaultColors,
		log,
		regex,
		sanitize,
		sets,
		validate
	);
	const paletteItems: PaletteItem[] = [];

	// Create and push the base color as the first PaletteItem
	const basePaletteItem = createPaletteItem(
		baseColor,
		1, // itemID starts at 1
		brand,
		colorHelpers,
		colorUtils,
		coreUtils,
		defaultColors,
		defaultColorStrings,
		format,
		log,
		regex,
		sanitize,
		sets,
		typeGuards,
		validate
	);
	paletteItems.push(basePaletteItem);

	// generate monochromatic variations
	for (let i = 1; i < swatchCount; i++) {
		const hueShift = Math.random() * 10 - 5; // small hue variation
		const saturationShift = Math.random() * 15 - 7.5; // slight saturation shift
		const lightnessShift = (i - 2) * 10; // creates a gradient effect

		const newColor: HSL = {
			value: {
				hue: brand.asRadial(
					(baseColor.value.hue + hueShift + 360) % 360,
					sets,
					validate
				),
				saturation: brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					),
					sets,
					validate
				),
				lightness: brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					),
					sets,
					validate
				)
			},
			format: 'hsl'
		};

		// create and push the new PaletteItem with an incrementing itemID
		const paletteItem = createPaletteItem(
			newColor,
			i + 1, // itemID increment
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			defaultColorStrings,
			format,
			log,
			regex,
			sanitize,
			sets,
			typeGuards,
			validate
		);
		paletteItems.push(paletteItem);
	}

	// generate a unique Palette ID
	const paletteID = `monochromatic_${Date.now()}`;

	// Build and return the palette
	const paletteArgs: PaletteArgs = {
		type: 'monochromatic',
		items: paletteItems,
		paletteID,
		swatches: swatchCount,
		limitDark: args.limitDark,
		limitGray: args.limitGray,
		limitLight: args.limitLight
	};

	return createPaletteObject(paletteArgs, appUtils);
}

function generateRandomPalette(
	args: PaletteGenerationArgs,
	appUtils: AppUtilsInterface,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	defaultColorStrings: DefaultDataInterface['colors']['strings'],
	domIDs: DOMDataInterface['ids']['static'],
	domUtils: DOMUtilsInterface,
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	mode: ModeDataInterface,
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	typeGuards: TypeGuardUtilsInteface,
	validate: ValidationUtilsInterface
): Palette {
	// ensure swatch count is between 2 and 6
	const swatchCount = Math.max(2, Math.min(6, args.swatches));
	domUtils.enforceSwatchRules(swatchCount, 6, domIDs, log, mode);

	// generate the first base color
	const baseColor = appUtils.generateRandomHSL(
		brand,
		coreUtils,
		defaultColors,
		log,
		regex,
		sanitize,
		sets,
		validate
	);
	const paletteItems: PaletteItem[] = [];

	// create and push the base color as the first PaletteItem
	const basePaletteItem = createPaletteItem(
		baseColor,
		1, // itemID starts at 1
		brand,
		colorHelpers,
		colorUtils,
		coreUtils,
		defaultColors,
		defaultColorStrings,
		format,
		log,
		regex,
		sanitize,
		sets,
		typeGuards,
		validate
	);
	paletteItems.push(basePaletteItem);

	// Generate additional random colors
	for (let i = 1; i < swatchCount; i++) {
		const randomColor = appUtils.generateRandomHSL(
			brand,
			coreUtils,
			defaultColors,
			log,
			regex,
			sanitize,
			sets,
			validate
		);

		const nextPaletteItem = createPaletteItem(
			randomColor,
			i + 1, // increment itemID
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			defaultColorStrings,
			format,
			log,
			regex,
			sanitize,
			sets,
			typeGuards,
			validate
		);

		paletteItems.push(nextPaletteItem);

		// update UI color box
		domUtils.updateColorBox(randomColor, String(i + 1), colorUtils);
	}

	// generate a unique Palette ID
	const paletteID = `random_${Date.now()}`;

	// construct and return the final Palette object
	const paletteArgs: PaletteArgs = {
		type: 'random',
		items: paletteItems,
		paletteID,
		swatches: swatchCount,
		limitDark: args.limitDark,
		limitGray: args.limitGray,
		limitLight: args.limitLight
	};

	return createPaletteObject(paletteArgs, appUtils);
}

function generateSplitComplementaryHues(
	baseHue: number,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log']
): number[] {
	try {
		const clonedBaseHue = coreUtils.clone(baseHue);
		const modifier = Math.floor(Math.random() * 11) + 20;

		return [
			(clonedBaseHue + 180 + modifier) % 360,
			(clonedBaseHue + 180 - modifier + 360) % 360
		];
	} catch (error) {
		log(
			'error',
			`Error generating split complementary hues: ${error}`,
			'paletteUtils.generateSplitComplementaryHues()'
		);

		return [];
	}
}

function generateSplitComplementaryPalette(
	args: PaletteGenerationArgs,
	appUtils: AppUtilsInterface,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	defaultColorStrings: DefaultDataInterface['colors']['strings'],
	domIDs: DOMDataInterface['ids']['static'],
	domUtils: DOMUtilsInterface,
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	mode: ModeDataInterface,
	paletteHelpers: PaletteUtilHelpersInterface,
	paletteRanges: ConstsDataInterface['paletteRanges'],
	probabilityConsts: ConstsDataInterface['probabilities'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	typeGuards: TypeGuardUtilsInteface,
	validate: ValidationUtilsInterface
): Palette {
	// ensure swatch count is at least 3 and at most 6
	const swatchCount = Math.max(3, Math.min(6, args.swatches));
	domUtils.enforceSwatchRules(swatchCount, 6, domIDs, log, mode);

	// Generate base color
	const baseColor = appUtils.generateRandomHSL(
		brand,
		coreUtils,
		defaultColors,
		log,
		regex,
		sanitize,
		sets,
		validate
	);
	const baseHue = baseColor.value.hue;

	// generate split complementary hues
	const hues = [
		baseHue,
		(baseHue + 180 + paletteRanges.shift.splitComp.hue) % 360,
		(baseHue + 180 - paletteRanges.shift.splitComp.hue + 360) % 360
	];

	// if swatchCount > 3, introduce additional variations
	for (let i = 3; i < swatchCount; i++) {
		const variationOffset = paletteHelpers.getWeightedRandomInterval(
			'soft',
			log,
			probabilityConsts
		);
		const direction = i % 2 === 0 ? 1 : -1;
		hues.push((baseHue + 180 + variationOffset * direction) % 360);
	}

	// create PaletteItem array with assigned itemIDs
	const paletteItems = hues.map((hue, index) => {
		const saturationShift =
			Math.random() * paletteRanges.shift.splitComp.sat -
			paletteRanges.shift.splitComp.sat / 2;
		const lightnessShift =
			Math.random() * paletteRanges.shift.splitComp.light -
			paletteRanges.shift.splitComp.light / 2;

		const newColor: HSL = {
			value: {
				hue: brand.asRadial(hue, sets, validate),
				saturation: brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					),
					sets,
					validate
				),
				lightness: brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					),
					sets,
					validate
				)
			},
			format: 'hsl'
		};

		return createPaletteItem(
			newColor,
			index + 1, // assign itemID
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			defaultColorStrings,
			format,
			log,
			regex,
			sanitize,
			sets,
			typeGuards,
			validate
		);
	});

	// generate a unique Palette ID
	const paletteID = `splitComplementary_${Date.now()}`;

	// build and return the palette
	const paletteArgs: PaletteArgs = {
		type: 'splitComplementary',
		items: paletteItems,
		paletteID,
		swatches: swatchCount,
		limitDark: args.limitDark,
		limitGray: args.limitGray,
		limitLight: args.limitLight
	};

	return createPaletteObject(paletteArgs, appUtils);
}

function generateTetradicHues(
	baseHue: number,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log']
): number[] {
	try {
		const clonedBaseHue = coreUtils.clone(baseHue);
		const randomOffset = Math.floor(Math.random() * 46) + 20;
		const distance =
			90 + (Math.random() < 0.5 ? -randomOffset : randomOffset);

		return [
			clonedBaseHue,
			(clonedBaseHue + 180) % 360,
			(clonedBaseHue + distance) % 360,
			(clonedBaseHue + distance + 180) % 360
		];
	} catch (error) {
		log(
			'error',
			`Error generating tetradic hues: ${error}`,
			'paletteUtils.generateTetradicHues()'
		);

		return [];
	}
}

function generateTetradicPalette(
	args: PaletteGenerationArgs,
	appUtils: AppUtilsInterface,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	defaultColorStrings: DefaultDataInterface['colors']['strings'],
	domIDs: DOMDataInterface['ids']['static'],
	domUtils: DOMUtilsInterface,
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	mode: ModeDataInterface,
	paletteRanges: ConstsDataInterface['paletteRanges'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	typeGuards: TypeGuardUtilsInteface,
	validate: ValidationUtilsInterface
): Palette {
	// tetradic palettes always have 4 swatches
	const swatchCount = 4;
	domUtils.enforceSwatchRules(swatchCount, 4, domIDs, log, mode);

	// generate base color
	const baseColor = appUtils.generateRandomHSL(
		brand,
		coreUtils,
		defaultColors,
		log,
		regex,
		sanitize,
		sets,
		validate
	);
	const baseHue = baseColor.value.hue;

	// generate the 4 hues
	const hues = generateTetradicHues(baseHue, coreUtils, log);

	// create PaletteItem array with assigned itemIDs
	const paletteItems = hues.map((hue, index) => {
		const saturationShift =
			Math.random() * paletteRanges.shift.tetra.sat -
			paletteRanges.shift.tetra.sat / 2;
		const lightnessShift =
			Math.random() * paletteRanges.shift.tetra.light -
			paletteRanges.shift.tetra.light / 2;

		const newColor: HSL = {
			value: {
				hue: brand.asRadial(hue, sets, validate),
				saturation: brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					),
					sets,
					validate
				),
				lightness: brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					),
					sets,
					validate
				)
			},
			format: 'hsl'
		};

		return createPaletteItem(
			newColor,
			index + 1, // assign itemID
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			defaultColorStrings,
			format,
			log,
			regex,
			sanitize,
			sets,
			typeGuards,
			validate
		);
	});

	// generate a unique Palette ID
	const paletteID = `tetradic_${Date.now()}`;

	// build and return the palette
	const paletteArgs: PaletteArgs = {
		type: 'tetradic',
		items: paletteItems,
		paletteID,
		swatches: swatchCount,
		limitDark: args.limitDark,
		limitGray: args.limitGray,
		limitLight: args.limitLight
	};

	return createPaletteObject(paletteArgs, appUtils);
}

function generateTriadicHues(
	baseHue: number,
	coreUtils: CoreUtilsInterface,
	log: AppServicesInterface['log']
): number[] {
	try {
		const clonedBaseHue = coreUtils.clone(baseHue);

		return [120, 240].map(increment => (clonedBaseHue + increment) % 360);
	} catch (error) {
		log(
			'error',
			`Error generating triadic hues: ${error}`,
			'paletteUtils.generateTriadicHues()'
		);

		return [];
	}
}

function generateTriadicPalette(
	args: PaletteGenerationArgs,
	appUtils: AppUtilsInterface,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	defaultColors: DefaultDataInterface['colors']['base']['branded'],
	defaultColorStrings: DefaultDataInterface['colors']['strings'],
	domIDs: DOMDataInterface['ids']['static'],
	domUtils: DOMUtilsInterface,
	format: FormattingUtilsInterface,
	log: AppServicesInterface['log'],
	mode: ModeDataInterface,
	paletteRanges: ConstsDataInterface['paletteRanges'],
	regex: ConfigDataInterface['regex'],
	sanitize: SanitationUtilsInterface,
	sets: DataSetsInterface,
	typeGuards: TypeGuardUtilsInteface,
	validate: ValidationUtilsInterface
): Palette {
	// triadic palettes always have exactly 3 colors
	const swatchCount = 3;
	domUtils.enforceSwatchRules(swatchCount, 3, domIDs, log, mode);

	// generate the base color
	const baseColor = appUtils.generateRandomHSL(
		brand,
		coreUtils,
		defaultColors,
		log,
		regex,
		sanitize,
		sets,
		validate
	);
	const baseHue = baseColor.value.hue;

	// generate the 3 hues needed
	const hues = generateTriadicHues(baseHue, coreUtils, log);

	// create PaletteItem array with assigned itemIDs
	const paletteItems = hues.map((hue, index) => {
		const saturationShift =
			Math.random() * paletteRanges.shift.triad.sat -
			paletteRanges.shift.triad.sat / 2;
		const lightnessShift =
			Math.random() * paletteRanges.shift.triad.light -
			paletteRanges.shift.triad.light / 2;

		const newColor: HSL = {
			value: {
				hue: brand.asRadial(hue, sets, validate),
				saturation: brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					),
					sets,
					validate
				),
				lightness: brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					),
					sets,
					validate
				)
			},
			format: 'hsl'
		};

		return createPaletteItem(
			newColor,
			index + 1, // assign itemID
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			defaultColors,
			defaultColorStrings,
			format,
			log,
			regex,
			sanitize,
			sets,
			typeGuards,
			validate
		);
	});

	//*generate a unique Palette ID
	const paletteID = `triadic_${Date.now()}`;

	// build and return the palette
	const paletteArgs: PaletteArgs = {
		type: 'triadic',
		items: paletteItems,
		paletteID,
		swatches: swatchCount,
		limitDark: args.limitDark,
		limitGray: args.limitGray,
		limitLight: args.limitLight
	};

	return createPaletteObject(paletteArgs, appUtils);
}

export const paletteUtils: PaletteUtilsInterface = {
	createPaletteItem,
	createPaletteItemArray,
	createPaletteObject,
	generateAllColorValues,
	generateAnalogousHues,
	generateAnalogousPalette,
	generateComplementaryPalette,
	generateDiadicHues,
	generateDiadicPalette,
	generateHexadicHues,
	generateHexadicPalette,
	generateMonochromaticPalette,
	generateRandomPalette,
	generateSplitComplementaryHues,
	generateSplitComplementaryPalette,
	generateTetradicHues,
	generateTetradicPalette,
	generateTriadicHues,
	generateTriadicPalette
};
