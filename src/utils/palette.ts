// File: utils/palette.js

import {
	AllColors,
	CMYK,
	HelpersInterface,
	Hex,
	HSL,
	HSV,
	LAB,
	Palette,
	PaletteArgs,
	PaletteItem,
	PaletteUtilsInterface,
	RGB,
	ServicesInterface,
	UtilitiesInterface,
	XYZ
} from '../types/index.js';

function createPaletteItem(
	color: HSL,
	itemID: number,
	helpers: HelpersInterface,
	services: ServicesInterface,
	utils: UtilitiesInterface
): PaletteItem {
	const clonedColor = utils.core.clone(color) as HSL;

	return {
		itemID,
		colors: {
			cmyk: (
				utils.color.convertHSL(
					clonedColor,
					'cmyk',
					helpers,
					services,
					utils
				) as CMYK
			).value,
			hex: (
				utils.color.convertHSL(
					clonedColor,
					'hex',
					helpers,
					services,
					utils
				) as Hex
			).value,
			hsl: clonedColor.value,
			hsv: (
				utils.color.convertHSL(
					clonedColor,
					'hsv',
					helpers,
					services,
					utils
				) as HSV
			).value,
			lab: (
				utils.color.convertHSL(
					clonedColor,
					'lab',
					helpers,
					services,
					utils
				) as LAB
			).value,
			rgb: (
				utils.color.convertHSL(
					clonedColor,
					'rgb',
					helpers,
					services,
					utils
				) as RGB
			).value,
			xyz: (
				utils.color.convertHSL(
					clonedColor,
					'xyz',
					helpers,
					services,
					utils
				) as XYZ
			).value
		},
		css: {
			cmyk: utils.color.convertColorToCSS(
				utils.color.convertHSL(
					clonedColor,
					'cmyk',
					helpers,
					services,
					utils
				)
			),
			hex: utils.color.convertColorToCSS(
				utils.color.convertHSL(
					clonedColor,
					'hex',
					helpers,
					services,
					utils
				)
			),
			hsl: utils.color.convertColorToCSS(clonedColor),
			hsv: utils.color.convertColorToCSS(
				utils.color.convertHSL(
					clonedColor,
					'hsv',
					helpers,
					services,
					utils
				)
			),
			lab: utils.color.convertColorToCSS(
				utils.color.convertHSL(
					clonedColor,
					'lab',
					helpers,
					services,
					utils
				)
			),
			rgb: utils.color.convertColorToCSS(
				utils.color.convertHSL(
					clonedColor,
					'rgb',
					helpers,
					services,
					utils
				)
			),
			xyz: utils.color.convertColorToCSS(
				utils.color.convertHSL(
					clonedColor,
					'xyz',
					helpers,
					services,
					utils
				)
			)
		}
	};
}

function createPaletteItemArray(
	baseColor: HSL,
	hues: number[],
	helpers: HelpersInterface,
	services: ServicesInterface,
	utils: UtilitiesInterface
): PaletteItem[] {
	const paletteItems: PaletteItem[] = [];

	// base color always gets itemID = 1
	paletteItems.push(
		createPaletteItem(
			baseColor,
			1, // ID 1 for base color
			helpers,
			services,
			utils
		)
	);

	// iterate over hues and generate PaletteItems
	for (const [i, hue] of hues.entries()) {
		const newColor: HSL = {
			value: {
				hue: utils.brand.asRadial(hue, utils),
				saturation: utils.brand.asPercentile(
					Math.random() * 100,
					utils
				),
				lightness: utils.brand.asPercentile(Math.random() * 100, utils)
			},
			format: 'hsl'
		};

		const newPaletteItem = createPaletteItem(
			newColor,
			i + 2, // IDs start at 2 for generated colors
			helpers,
			services,
			utils
		);

		paletteItems.push(newPaletteItem);
		utils.dom.updateColorBox(newColor, String(i + 2), utils);
	}

	return paletteItems;
}

function createPaletteObject(
	args: PaletteArgs,
	utils: UtilitiesInterface
): Palette {
	return {
		id: `${args.type}_${args.paletteID}`,
		items: args.items,
		metadata: {
			name: '',
			timestamp: utils.app.getFormattedTimestamp(),
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
	helpers: HelpersInterface,
	services: ServicesInterface,
	utils: UtilitiesInterface
): AllColors {
	const log = services.app.log;
	const clonedColor = utils.core.clone(color);

	if (!utils.validate.colorValue(clonedColor, utils)) {
		log(
			'error',
			`Invalid color: ${JSON.stringify(clonedColor)}`,
			'paletteUtils.generateAllColorValues()'
		);
		throw new Error('Invalid HSL color provided');
	}

	const convert = <T extends keyof AllColors>(target: T): AllColors[T] =>
		utils.color.convertHSL(
			clonedColor,
			target,
			helpers,
			services,
			utils
		) as AllColors[T];

	return {
		cmyk: convert('cmyk'),
		hex: convert('hex'),
		hsl: clonedColor,
		hsv: convert('hsv'),
		lab: convert('lab'),
		rgb: convert('rgb'),
		sl: convert('sl'),
		sv: convert('sv'),
		xyz: convert('xyz')
	};
}

export const paletteUtils: PaletteUtilsInterface = {
	createPaletteItem,
	createPaletteItemArray,
	createPaletteObject,
	generateAllColorValues
};
