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
	PaletteType,
	PaletteUtilsInterface,
	RGB,
	SelectedPaletteOptions,
	ServicesInterface,
	UtilitiesInterface,
	XYZ
} from '../types/index.js';
import { domData } from '../data/dom.js';

const elements = domData.elements;

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

function getPaletteOptionsFromUI(
	services: ServicesInterface,
	utils: UtilitiesInterface
): SelectedPaletteOptions {
	const log = services.app.log;

	try {
		const paletteColumnCountElement = elements.selectors.paletteColumnCount;
		const paletteTypeElement = elements.selectors.paletteType;
		const limitDarkChkbx = elements.inputs.limitDarkChkbx;
		const limitGrayChkbx = elements.inputs.limitGrayChkbx;
		const limitLightChkbx = elements.inputs.limitLightChkbx;

		if (!paletteTypeElement) {
			log(
				'warn',
				'paletteTypeOptions DOM element not found',
				'paletteUtils > getPaletteOptionsFromUI()',
				2
			);
		}
		if (!paletteColumnCountElement) {
			log(
				'warn',
				`paletteColumnCount DOM element not found`,
				'paletteUtils > getPaletteOptionsFromUI()',
				2
			);
		}
		if (!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) {
			log(
				'warn',
				`One or more checkboxes not found`,
				'paletteUtils > getPaletteOptionsFromUI()',
				2
			);
		}

		if (!utils.typeGuards.isPaletteType(paletteTypeElement!.value)) {
			log(
				'warn',
				`Invalid palette type: ${paletteTypeElement!.value}`,
				'paletteUtils > getPaletteOptionsFromUI()',
				2
			);
		}

		return {
			columnCount: paletteColumnCountElement
				? parseInt(paletteColumnCountElement.value, 10)
				: 0,
			distributionType: 'soft',
			limitDark: limitDarkChkbx?.checked || false,
			limitGray: limitGrayChkbx?.checked || false,
			limitLight: limitLightChkbx?.checked || false,
			paletteType: paletteTypeElement!.value as PaletteType
		};
	} catch (error) {
		log(
			'error',
			`Failed to retrieve parameters from UI: ${error}`,
			'paletteUtils > getPaletteOptionsFromUI()'
		);

		return {
			columnCount: 0,
			distributionType: 'base',
			limitDark: false,
			limitGray: false,
			limitLight: false,
			paletteType: 'random'
		};
	}
}

export const paletteUtils: PaletteUtilsInterface = {
	createPaletteItem,
	createPaletteItemArray,
	createPaletteObject,
	generateAllColorValues,
	getPaletteOptionsFromUI
};
