// File: palette/partials/types.js

import {
	CommonFunctionsInterface,
	GenerateHuesFnGroup,
	GeneratePaletteFnGroup,
	HSL,
	Palette,
	PaletteItem,
	SelectedPaletteOptions
} from '../../types/index.js';
import { data } from '../../data/index.js';

const paletteRanges = data.config.paletteRanges;

function analogous(
	options: SelectedPaletteOptions,
	common: CommonFunctionsInterface,
	generateHues: GenerateHuesFnGroup
): Palette {
	const utils = common.utils;

	if (options.columnCount < 2) utils.dom.enforceSwatchRules(2, 6);

	const baseColor = utils.app.generateRandomHSL();
	const hues = generateHues.analogous(baseColor, options, common);
	const paletteItems = utils.palette.createPaletteItemArray(baseColor, hues);
	const analogousPalette = utils.palette.createPaletteObject(
		options,
		paletteItems
	);

	return analogousPalette;
}

function complementary(
	options: SelectedPaletteOptions,
	common: CommonFunctionsInterface
): Palette {
	const helpers = common.helpers;
	const utils = common.utils;
	const columnCount = Math.max(2, Math.min(6, options.columnCount));

	utils.dom.enforceSwatchRules(columnCount, 6);

	const baseColor = utils.app.generateRandomHSL();
	const baseHue = baseColor.value.hue;
	const hues: number[] = [baseHue];

	// always include the direct complement
	hues.push((baseHue + 180) % 360);

	// generate additional complementary variations if needed
	const extraColorsNeeded = columnCount - 2;

	if (extraColorsNeeded > 0) {
		for (let i = 0; i < extraColorsNeeded; i++) {
			const variationOffset = helpers.palette.getWeightedRandomInterval(
				options.distributionType
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
				hue: utils.brand.asRadial(hue),
				saturation: utils.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationOffset
						)
					)
				),
				lightness: utils.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessOffset)
					)
				)
			},
			format: 'hsl'
		};

		return utils.palette.createPaletteItem(newColor, index + 1);
	});

	return utils.palette.createPaletteObject(options, paletteItems);
}

function diadic(
	options: SelectedPaletteOptions,
	common: CommonFunctionsInterface,
	generateHues: GenerateHuesFnGroup
): Palette {
	const helpers = common.helpers;
	const utils = common.utils;
	const columnCount = Math.max(2, Math.min(6, options.columnCount));

	utils.dom.enforceSwatchRules(columnCount, 6);

	const baseColor = utils.app.generateRandomHSL();
	const hues = generateHues.diadic(baseColor, options, common);

	// if more swatches are needed, create slight variations
	const extraColorsNeeded = columnCount - 2;
	if (extraColorsNeeded > 0) {
		for (let i = 0; i < extraColorsNeeded; i++) {
			const variationOffset = helpers.palette.getWeightedRandomInterval(
				options.distributionType
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
				hue: utils.brand.asRadial(hue),
				saturation: utils.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					)
				),
				lightness: utils.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					)
				)
			},
			format: 'hsl'
		};

		return utils.palette.createPaletteItem(newColor, index + 1);
	});

	return utils.palette.createPaletteObject(options, paletteItems);
}

function hexadic(
	options: SelectedPaletteOptions,
	common: CommonFunctionsInterface,
	generateHues: GenerateHuesFnGroup
): Palette {
	const utils = common.utils;
	// hexadic palettes always have 6 swatches
	const columnCount = 6;

	utils.dom.enforceSwatchRules(columnCount, 6);

	const baseColor = utils.app.generateRandomHSL();
	const hues = generateHues.hexadic(baseColor, common);

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
				hue: utils.brand.asRadial(hue),
				saturation: utils.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					)
				),
				lightness: utils.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					)
				)
			},
			format: 'hsl'
		};

		return utils.palette.createPaletteItem(newColor, index + 1);
	});

	return utils.palette.createPaletteObject(options, paletteItems);
}

function monochromatic(
	options: SelectedPaletteOptions,
	common: CommonFunctionsInterface
): Palette {
	const utils = common.utils;
	const columnCount = Math.max(2, Math.min(6, options.columnCount));

	utils.dom.enforceSwatchRules(columnCount, 6);

	const baseColor = utils.app.generateRandomHSL();
	const paletteItems: PaletteItem[] = [];

	const basePaletteItem = utils.palette.createPaletteItem(baseColor, 1);
	paletteItems.push(basePaletteItem);

	// generate monochromatic variations
	for (let i = 1; i < columnCount; i++) {
		const hueShift = Math.random() * 10 - 5; // small hue variation
		const saturationShift = Math.random() * 15 - 7.5; // slight saturation shift
		const lightnessShift = (i - 2) * 10; // creates a gradient effect

		const newColor: HSL = {
			value: {
				hue: utils.brand.asRadial(
					(baseColor.value.hue + hueShift + 360) % 360
				),
				saturation: utils.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					)
				),
				lightness: utils.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					)
				)
			},
			format: 'hsl'
		};
		const paletteItem = utils.palette.createPaletteItem(newColor, i + 1);

		paletteItems.push(paletteItem);
	}

	return utils.palette.createPaletteObject(options, paletteItems);
}

function random(
	options: SelectedPaletteOptions,
	common: CommonFunctionsInterface
): Palette {
	const utils = common.utils;
	// ensure column count is between 2 and 6
	const columnCount = Math.max(2, Math.min(6, options.columnCount));

	utils.dom.enforceSwatchRules(columnCount, 6);

	const baseColor = utils.app.generateRandomHSL();

	const paletteItems: PaletteItem[] = [];

	const basePaletteItem = utils.palette.createPaletteItem(baseColor, 1);
	paletteItems.push(basePaletteItem);

	for (let i = 1; i < columnCount; i++) {
		const randomColor = utils.app.generateRandomHSL();
		const nextPaletteItem = utils.palette.createPaletteItem(
			randomColor,
			i + 1
		);

		paletteItems.push(nextPaletteItem);
	}

	return utils.palette.createPaletteObject(options, paletteItems);
}

function splitComplementary(
	options: SelectedPaletteOptions,
	common: CommonFunctionsInterface
): Palette {
	const helpers = common.helpers;
	const utils = common.utils;
	// ensure column count is at least 3 and at most 6
	const columnCount = Math.max(3, Math.min(6, options.columnCount));
	utils.dom.enforceSwatchRules(columnCount, 6);

	const baseColor = utils.app.generateRandomHSL();
	const baseHue = baseColor.value.hue;

	// generate split complementary hues
	const hues = [
		baseHue,
		(baseHue + 180 + paletteRanges.shift.splitComp.hue) % 360,
		(baseHue + 180 - paletteRanges.shift.splitComp.hue + 360) % 360
	];

	// if swatchCount > 3, introduce additional variations
	for (let i = 3; i < columnCount; i++) {
		const variationOffset = helpers.palette.getWeightedRandomInterval(
			options.distributionType
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
				hue: utils.brand.asRadial(hue),
				saturation: utils.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					)
				),
				lightness: utils.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					)
				)
			},
			format: 'hsl'
		};

		return utils.palette.createPaletteItem(newColor, index + 1);
	});

	return utils.palette.createPaletteObject(options, paletteItems);
}

function tetradic(
	options: SelectedPaletteOptions,
	common: CommonFunctionsInterface,
	generateHues: GenerateHuesFnGroup
): Palette {
	const utils = common.utils;
	// tetradic palettes always have 4 swatches
	const columnCount = 4;
	utils.dom.enforceSwatchRules(columnCount, 4);

	const baseColor = utils.app.generateRandomHSL();

	// generate the 4 hues
	const hues = generateHues.tetradic(baseColor, common);

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
				hue: utils.brand.asRadial(hue),
				saturation: utils.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					)
				),
				lightness: utils.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					)
				)
			},
			format: 'hsl'
		};

		return utils.palette.createPaletteItem(newColor, index + 1);
	});

	return utils.palette.createPaletteObject(options, paletteItems);
}

function triadic(
	options: SelectedPaletteOptions,
	common: CommonFunctionsInterface,
	generateHues: GenerateHuesFnGroup
): Palette {
	const utils = common.utils;
	// triadic palettes always have exactly 3 colors
	const columnCount = 3;
	utils.dom.enforceSwatchRules(columnCount, 3);

	// generate the base color
	const baseColor = utils.app.generateRandomHSL();

	// generate the 3 hues needed
	const hues = generateHues.triadic(baseColor, common);

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
				hue: utils.brand.asRadial(hue),
				saturation: utils.brand.asPercentile(
					Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					)
				),
				lightness: utils.brand.asPercentile(
					Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					)
				)
			},
			format: 'hsl'
		};

		return utils.palette.createPaletteItem(newColor, index + 1);
	});

	return utils.palette.createPaletteObject(options, paletteItems);
}

export const generatePaletteFnGroup: GeneratePaletteFnGroup = {
	analogous,
	complementary,
	diadic,
	hexadic,
	monochromatic,
	random,
	splitComplementary,
	tetradic,
	triadic
};
