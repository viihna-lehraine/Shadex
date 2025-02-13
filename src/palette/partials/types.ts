// File: palette/partials/types.js

import {
	GeneratePaletteArgs,
	HSL,
	Palette,
	PaletteItem,
	PaletteType
} from '../../types/index.js';
import { constsData as consts } from '../../data/consts.js';

const paletteRanges = consts.paletteRanges;

export function generateAnalogousPalette(params: GeneratePaletteArgs): Palette {
	if (params.options.columnCount < 2)
		params.domUtils.enforceSwatchRules(2, 6, params.appServices);

	const baseColor = params.appUtils.generateRandomHSL(
		...params.argsHelpers.getGenerateRandomColorArgs(params)
	);
	const hues = params.generateHues(
		params.argsHelpers.getHueGenerationArgs(baseColor, params)
	);
	const paletteItems = params.paletteUtils.createPaletteItemArray(
		...params.argsHelpers.getCreatePaletteItemArrayArgs(
			baseColor,
			hues,
			params
		)
	);
	const analogousPalette = params.paletteUtils.createPaletteObject(
		params.argsHelpers.getCreatePaletteObjectArgs(
			'analogous',
			`analogous_${Date.now()}`,
			paletteItems,
			params.options.columnCount,
			params
		),
		params.appUtils
	);

	return analogousPalette;
}

export function generateComplementaryPalette(
	params: GeneratePaletteArgs
): Palette {
	const swatchCount = Math.max(2, Math.min(6, params.options.columnCount));

	params.domUtils.enforceSwatchRules(swatchCount, 6, params.appServices);

	const randomColorArgs =
		params.argsHelpers.getGenerateRandomColorArgs(params);
	const baseColor = params.appUtils.generateRandomHSL(...randomColorArgs);
	const baseHue = baseColor.value.hue;
	const hues: number[] = [baseHue];

	// always include the direct complement
	hues.push((baseHue + 180) % 360);

	// generate additional complementary variations if needed
	const extraColorsNeeded = swatchCount - 2;

	if (extraColorsNeeded > 0) {
		for (let i = 0; i < extraColorsNeeded; i++) {
			const variationOffset =
				params.paletteHelpers.getWeightedRandomInterval(
					params.options.distributionType,
					params.appServices
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
				hue: params.brand.asRadial(hue, params.validate),
				saturation: params.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationOffset
						)
					),
					params.validate
				),
				lightness: params.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessOffset)
					),
					params.validate
				)
			},
			format: 'hsl'
		};

		return params.paletteUtils.createPaletteItem(
			...params.argsHelpers.getCreatePaletteItemArgs(
				newColor,
				index + 1,
				params
			)
		);
	});

	return params.paletteUtils.createPaletteObject(
		params.argsHelpers.getCreatePaletteObjectArgs(
			'complementary',
			`complementary_${params.appUtils.getFormattedTimestamp()}`,
			paletteItems,
			swatchCount,
			params
		),
		params.appUtils
	);
}

export function generateDiadicPalette(params: GeneratePaletteArgs): Palette {
	const swatchCount = Math.max(2, Math.min(6, params.options.columnCount));

	params.domUtils.enforceSwatchRules(swatchCount, 6, params.appServices);

	const baseColor = params.appUtils.generateRandomHSL(
		...params.argsHelpers.getGenerateRandomColorArgs(params)
	);
	const hues = params.generateHues(
		params.argsHelpers.getHueGenerationArgs(baseColor, params)
	);

	// if more swatches are needed, create slight variations
	const extraColorsNeeded = swatchCount - 2;
	if (extraColorsNeeded > 0) {
		for (let i = 0; i < extraColorsNeeded; i++) {
			const variationOffset =
				params.paletteHelpers.getWeightedRandomInterval(
					params.options.distributionType,
					params.appServices
				);
			const direction = i % 2 === 0 ? 1 : -1;

			hues.push(
				(baseColor.value.hue + variationOffset * direction) % 360
			);
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
				hue: params.brand.asRadial(hue, params.validate),
				saturation: params.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					),
					params.validate
				),
				lightness: params.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					),
					params.validate
				)
			},
			format: 'hsl'
		};
		const paletteItemArgs = params.argsHelpers.getCreatePaletteItemArgs(
			newColor,
			index + 1,
			params
		);

		return params.paletteUtils.createPaletteItem(...paletteItemArgs);
	});

	return params.paletteUtils.createPaletteObject(
		params.argsHelpers.getCreatePaletteObjectArgs(
			'diadic',
			`diadic_${params.appUtils.getFormattedTimestamp()}`,
			paletteItems,
			swatchCount,
			params
		),
		params.appUtils
	);
}

export function generateHexadicPalette(params: GeneratePaletteArgs): Palette {
	// hexadic palettes always have 6 swatches
	const swatchCount = 6;

	params.domUtils.enforceSwatchRules(swatchCount, 6, params.appServices);

	const baseColor = params.appUtils.generateRandomHSL(
		...params.argsHelpers.getGenerateRandomColorArgs(params)
	);
	const hues = params.generateHues(
		params.argsHelpers.getHueGenerationArgs(baseColor, params)
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
				hue: params.brand.asRadial(hue, params.validate),
				saturation: params.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					),
					params.validate
				),
				lightness: params.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					),
					params.validate
				)
			},
			format: 'hsl'
		};
		const paletteItemArgs = params.argsHelpers.getCreatePaletteItemArgs(
			newColor,
			index + 1,
			params
		);

		return params.paletteUtils.createPaletteItem(...paletteItemArgs);
	});

	return params.paletteUtils.createPaletteObject(
		params.argsHelpers.getCreatePaletteObjectArgs(
			'hexadic',
			`hexadic_${params.appUtils.getFormattedTimestamp()}`,
			paletteItems,
			swatchCount,
			params
		),
		params.appUtils
	);
}

export function generateMonochromaticPalette(
	params: GeneratePaletteArgs
): Palette {
	const columnCount = Math.max(2, Math.min(6, params.options.columnCount));

	params.domUtils.enforceSwatchRules(columnCount, 6, params.appServices);

	const baseColor = params.appUtils.generateRandomHSL(
		...params.argsHelpers.getGenerateRandomColorArgs(params)
	);
	const paletteItems: PaletteItem[] = [];

	const basePaletteItem = params.paletteUtils.createPaletteItem(
		...params.argsHelpers.getCreatePaletteItemArgs(baseColor, 1, params)
	);
	paletteItems.push(basePaletteItem);

	// generate monochromatic variations
	for (let i = 1; i < columnCount; i++) {
		const hueShift = Math.random() * 10 - 5; // small hue variation
		const saturationShift = Math.random() * 15 - 7.5; // slight saturation shift
		const lightnessShift = (i - 2) * 10; // creates a gradient effect

		const newColor: HSL = {
			value: {
				hue: params.brand.asRadial(
					(baseColor.value.hue + hueShift + 360) % 360,
					params.validate
				),
				saturation: params.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					),
					params.validate
				),
				lightness: params.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					),
					params.validate
				)
			},
			format: 'hsl'
		};
		const paletteItem = params.paletteUtils.createPaletteItem(
			...params.argsHelpers.getCreatePaletteItemArgs(
				newColor,
				i + 1,
				params
			)
		);

		paletteItems.push(paletteItem);
	}

	return params.paletteUtils.createPaletteObject(
		params.argsHelpers.getCreatePaletteObjectArgs(
			'monochromatic',
			`monochromatic_${params.appUtils.getFormattedTimestamp()}`,
			paletteItems,
			columnCount,
			params
		),
		params.appUtils
	);
}

export function generateRandomPalette(params: GeneratePaletteArgs): Palette {
	// ensure column count is between 2 and 6
	const swatchCount = Math.max(2, Math.min(6, params.options.columnCount));

	params.domUtils.enforceSwatchRules(swatchCount, 6, params.appServices);

	const baseColor = params.appUtils.generateRandomHSL(
		...params.argsHelpers.getGenerateRandomColorArgs(params)
	);

	const paletteItems: PaletteItem[] = [];

	const basePaletteItem = params.paletteUtils.createPaletteItem(
		...params.argsHelpers.getCreatePaletteItemArgs(baseColor, 1, params)
	);
	paletteItems.push(basePaletteItem);

	for (let i = 1; i < swatchCount; i++) {
		const randomColor = params.appUtils.generateRandomHSL(
			...params.argsHelpers.getGenerateRandomColorArgs(params)
		);
		const nextPaletteItem = params.paletteUtils.createPaletteItem(
			...params.argsHelpers.getCreatePaletteItemArgs(
				randomColor,
				i + 1,
				params
			)
		);

		paletteItems.push(nextPaletteItem);

		params.domUtils.updateColorBox(
			randomColor,
			String(i + 1),
			params.colorUtils
		);
	}

	return params.paletteUtils.createPaletteObject(
		params.argsHelpers.getCreatePaletteObjectArgs(
			'random',
			`random_${params.appUtils.getFormattedTimestamp()}`,
			paletteItems,
			swatchCount,
			params
		),
		params.appUtils
	);
}

export function generateSplitComplementaryPalette(
	params: GeneratePaletteArgs
): Palette {
	// ensure column count is at least 3 and at most 6
	const columnCount = Math.max(3, Math.min(6, params.options.columnCount));
	params.domUtils.enforceSwatchRules(columnCount, 6, params.appServices);

	const randomColorArgs =
		params.argsHelpers.getGenerateRandomColorArgs(params);
	const baseColor = params.appUtils.generateRandomHSL(...randomColorArgs);
	const baseHue = baseColor.value.hue;

	// generate split complementary hues
	const hues = [
		baseHue,
		(baseHue + 180 + paletteRanges.shift.splitComp.hue) % 360,
		(baseHue + 180 - paletteRanges.shift.splitComp.hue + 360) % 360
	];

	// if swatchCount > 3, introduce additional variations
	for (let i = 3; i < columnCount; i++) {
		const variationOffset = params.paletteHelpers.getWeightedRandomInterval(
			'soft',
			params.appServices
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
				hue: params.brand.asRadial(hue, params.validate),
				saturation: params.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					),
					params.validate
				),
				lightness: params.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					),
					params.validate
				)
			},
			format: 'hsl'
		};

		return params.paletteUtils.createPaletteItem(
			...params.argsHelpers.getCreatePaletteItemArgs(
				newColor,
				index + 1,
				params
			)
		);
	});

	return params.paletteUtils.createPaletteObject(
		params.argsHelpers.getCreatePaletteObjectArgs(
			'splitComplementary' as PaletteType,
			`splitComplementary_${params.appUtils.getFormattedTimestamp()}`,
			paletteItems,
			columnCount,
			params
		),
		params.appUtils
	);
}

export function generateTetradicPalette(params: GeneratePaletteArgs): Palette {
	// tetradic palettes always have 4 swatches
	const swatchCount = 4;
	params.domUtils.enforceSwatchRules(swatchCount, 4, params.appServices);

	const baseColor = params.appUtils.generateRandomHSL(
		...params.argsHelpers.getGenerateRandomColorArgs(params)
	);

	// generate the 4 hues
	const hues = params.generateHues(
		params.argsHelpers.getHueGenerationArgs(baseColor, params)
	);

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
				hue: params.brand.asRadial(hue, params.validate),
				saturation: params.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					),
					params.validate
				),
				lightness: params.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					),
					params.validate
				)
			},
			format: 'hsl'
		};

		return params.paletteUtils.createPaletteItem(
			...params.argsHelpers.getCreatePaletteItemArgs(
				newColor,
				index + 1,
				params
			)
		);
	});

	return params.paletteUtils.createPaletteObject(
		params.argsHelpers.getCreatePaletteObjectArgs(
			'tetradic',
			`tetradic_${Date.now()}`,
			paletteItems,
			swatchCount,
			params
		),
		params.appUtils
	);
}

export function generateTriadicPalette(params: GeneratePaletteArgs): Palette {
	// triadic palettes always have exactly 3 colors
	const columnCount = 3;
	params.domUtils.enforceSwatchRules(columnCount, 3, params.appServices);

	// generate the base color
	const baseColor = params.appUtils.generateRandomHSL(
		...params.argsHelpers.getGenerateRandomColorArgs(params)
	);

	// generate the 3 hues needed
	const hues = params.generateHues(
		params.argsHelpers.getHueGenerationArgs(baseColor, params)
	);

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
				hue: params.brand.asRadial(hue, params.validate),
				saturation: params.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					),
					params.validate
				),
				lightness: params.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					),
					params.validate
				)
			},
			format: 'hsl'
		};

		return params.paletteUtils.createPaletteItem(
			...params.argsHelpers.getCreatePaletteItemArgs(
				newColor,
				index + 1,
				params
			)
		);
	});

	return params.paletteUtils.createPaletteObject(
		params.argsHelpers.getCreatePaletteObjectArgs(
			'tetradic',
			`triadic_${Date.now()}`,
			paletteItems,
			columnCount,
			params
		),
		params.appUtils
	);
}
