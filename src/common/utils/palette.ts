// File: common/utils/palette.ts

import {
	AllColors,
	BrandingUtils,
	CMYK,
	ColorUtils,
	DOMUtils,
	Helpers,
	Hex,
	HSL,
	HSV,
	LAB,
	Palette,
	PaletteConfig,
	PaletteItem,
	PaletteType,
	PaletteUtils,
	RGB,
	SelectedPaletteOptions,
	Services,
	ValidationUtils,
	XYZ
} from '../../types/index.js';
import { domIndex, paletteConfig } from '../../config/index.js';

const ids = domIndex.ids;

export function paletteUtilsFactory(
	brand: BrandingUtils,
	colorUtils: ColorUtils,
	dom: DOMUtils,
	helpers: Helpers,
	services: Services,
	validate: ValidationUtils
): PaletteUtils {
	const {
		data: { clone },
		dom: { getElement }
	} = helpers;
	const { errors, log } = services;

	function createPaletteItem(color: HSL, itemID: number): PaletteItem {
		return errors.handleSync(() => {
			const clonedColor = clone(color) as HSL;

			return {
				itemID,
				colors: {
					cmyk: (colorUtils.convertHSL(clonedColor, 'cmyk') as CMYK)
						.value,
					hex: (colorUtils.convertHSL(clonedColor, 'hex') as Hex)
						.value,
					hsl: clonedColor.value,
					hsv: (colorUtils.convertHSL(clonedColor, 'hsv') as HSV)
						.value,
					lab: (colorUtils.convertHSL(clonedColor, 'lab') as LAB)
						.value,
					rgb: (colorUtils.convertHSL(clonedColor, 'rgb') as RGB)
						.value,
					xyz: (colorUtils.convertHSL(clonedColor, 'xyz') as XYZ)
						.value
				},
				css: {
					cmyk: colorUtils.formatColorAsCSS(
						colorUtils.convertHSL(clonedColor, 'cmyk')
					),
					hex: colorUtils.formatColorAsCSS(
						colorUtils.convertHSL(clonedColor, 'hex')
					),
					hsl: colorUtils.formatColorAsCSS(clonedColor),
					hsv: colorUtils.formatColorAsCSS(
						colorUtils.convertHSL(clonedColor, 'hsv')
					),
					lab: colorUtils.formatColorAsCSS(
						colorUtils.convertHSL(clonedColor, 'lab')
					),
					rgb: colorUtils.formatColorAsCSS(
						colorUtils.convertHSL(clonedColor, 'rgb')
					),
					xyz: colorUtils.formatColorAsCSS(
						colorUtils.convertHSL(clonedColor, 'xyz')
					)
				}
			};
		}, 'Error occurred while creating palette item');
	}

	function createPaletteItemArray(
		baseColor: HSL,
		hues: number[]
	): PaletteItem[] {
		return errors.handleSync(() => {
			const paletteItems: PaletteItem[] = [];

			// base color always gets itemID = 1
			paletteItems.push(
				createPaletteItem(
					baseColor,
					1 // ID 1 for base color
				)
			);

			// iterate over hues and generate PaletteItems
			for (const [i, hue] of hues.entries()) {
				const newColor: HSL = {
					value: {
						hue: brand.asRadial(hue),
						saturation: brand.asPercentile(Math.random() * 100),
						lightness: brand.asPercentile(Math.random() * 100)
					},
					format: 'hsl'
				};

				const newPaletteItem = createPaletteItem(
					newColor,
					i + 2 // IDs start at 2 for generated colors
				);

				paletteItems.push(newPaletteItem);
				dom.updateColorBox(newColor, String(i + 2));
			}

			return paletteItems;
		}, 'Error occurred while creating palette item array');
	}

	function createPaletteObject(
		options: SelectedPaletteOptions,
		paletteItems: PaletteItem[]
	): Palette {
		return errors.handleSync(() => {
			return {
				id: `${options.paletteType}_${crypto.randomUUID()}`,
				items: paletteItems,
				metadata: {
					columnCount: options.columnCount,
					limitDark: options.limitDark,
					limitGray: options.limitGray,
					limitLight: options.limitLight,
					timestamp: helpers.data.getFormattedTimestamp(),
					type: options.paletteType
				}
			};
		}, 'Error occurred while creating palette object');
	}

	function generateAllColorValues(color: HSL): AllColors {
		return errors.handleSync(() => {
			const clonedColor = clone(color);

			if (!validate.colorValue(clonedColor)) {
				log(`Invalid color: ${JSON.stringify(clonedColor)}`, {
					caller: 'utils.palette.generateAllColorValues',
					level: 'error'
				});
				throw new Error('Invalid HSL color provided');
			}

			const convert = <T extends keyof AllColors>(
				target: T
			): AllColors[T] =>
				colorUtils.convertHSL(clonedColor, target) as AllColors[T];

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
		}, 'Error occurred while generating all color values');
	}

	function getPaletteOptionsFromUI(): SelectedPaletteOptions {
		return errors.handleSync(() => {
			const columnCountElement = getElement<HTMLInputElement>(
				ids.inputs.columnCount
			);
			const paletteTypeElement = getElement<HTMLInputElement>(
				ids.inputs.paletteType
			);
			const limitDarkChkbx = getElement<HTMLInputElement>(
				ids.inputs.limitDarkChkbx
			);
			const limitGrayChkbx = getElement<HTMLInputElement>(
				ids.inputs.limitGrayChkbx
			);
			const limitLightChkbx = getElement<HTMLInputElement>(
				ids.inputs.limitLightChkbx
			);

			if (!paletteTypeElement) {
				log('paletteTypeOptions DOM element not found', {
					caller: 'utils.palette.getPaletteOptionsFromUI',
					level: 'warn'
				});
			}
			if (!columnCountElement) {
				log(`columnCount DOM element not found`, {
					caller: 'utils.palette.getPaletteOptionsFromUI',
					level: 'warn'
				});
			}
			if (!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) {
				log(`One or more checkboxes not found`, {
					caller: 'utils.palette.getPaletteOptionsFromUI',
					level: 'warn'
				});
			}

			if (!helpers.typeguards.isPaletteType(paletteTypeElement!.value)) {
				log(`Invalid palette type: ${paletteTypeElement!.value}`, {
					caller: 'utils.palette.getPaletteOptionsFromUI',
					level: 'warn'
				});
			}

			return {
				columnCount: columnCountElement
					? parseInt(columnCountElement.value, 10)
					: 0,
				distributionType: 'soft',
				limitDark: limitDarkChkbx?.checked || false,
				limitGray: limitGrayChkbx?.checked || false,
				limitLight: limitLightChkbx?.checked || false,
				paletteType: paletteTypeElement!.value as PaletteType
			};
		}, 'Error occurred while getting palette options from UI');
	}

	function getRandomizedPaleteOptions(): SelectedPaletteOptions {
		return errors.handleSync(() => {
			const paletteTypeMap: Record<number, PaletteType> = {
				0: 'analogous',
				1: 'complementary',
				2: 'diadic',
				3: 'hexadic',
				4: 'monochromatic',
				5: 'random',
				6: 'splitComplementary',
				7: 'tetradic',
				8: 'triadic'
			};
			const distributionTypeMap: Record<
				number,
				keyof PaletteConfig['probabilities']
			> = {
				0: 'base',
				1: 'chaotic',
				2: 'soft',
				3: 'strong'
			};
			const randomPaletteTypeIndex = Math.floor(
				Math.random() * Object.values(paletteTypeMap).length
			);
			const randomDistributionTypeIndex = Math.floor(
				Math.random() * Object.values(distributionTypeMap).length
			);
			const paletteType =
				paletteTypeMap[
					randomPaletteTypeIndex as keyof typeof paletteTypeMap
				];
			const distributionType =
				distributionTypeMap[
					randomDistributionTypeIndex as keyof typeof distributionTypeMap
				];
			const columnCount = Math.floor(Math.random() * 6) + 1;
			const limitDark = Math.random() < 0.5;
			const limitGray = Math.random() < 0.5;
			const limitLight = Math.random() < 0.5;
			return {
				columnCount,
				distributionType,
				limitDark,
				limitGray,
				limitLight,
				paletteType
			};
		}, 'Error occurred while getting randomized palette options');
	}

	function isHSLInBounds(hsl: HSL): boolean {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsl)) {
				log(`Invalid HSL value ${JSON.stringify(hsl)}`, {
					caller: 'utils.palette.isHSLInBounds',
					level: 'error'
				});

				return false;
			}

			return isHSLTooDark(hsl) || isHSLTooGray(hsl) || isHSLTooLight(hsl);
		}, 'Error occurred while checking if HSL is in bounds');
	}

	function isHSLTooDark(hsl: HSL): boolean {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsl)) {
				log(`Invalid HSL value ${JSON.stringify(hsl)}`, {
					caller: 'utils.palette.isHSLTooDark',
					level: 'error'
				});

				return false;
			}

			return clone(hsl).value.lightness < paletteConfig.thresholds.dark;
		}, 'Error occurred while checking if HSL is too dark');
	}

	function isHSLTooGray(hsl: HSL): boolean {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsl)) {
				log(`Invalid HSL value ${JSON.stringify(hsl)}`, {
					caller: 'utils.palette.isHSLTooGray',
					level: 'error'
				});

				return false;
			}

			return clone(hsl).value.saturation < paletteConfig.thresholds.gray;
		}, 'Error occurred while checking if HSL is too gray');
	}

	function isHSLTooLight(hsl: HSL): boolean {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsl)) {
				log('Invalid HSL value ${JSON.stringify(hsl)}', {
					caller: 'utils.palette.isHSLTooLight',
					level: 'error'
				});

				return false;
			}

			return clone(hsl).value.lightness > paletteConfig.thresholds.light;
		}, 'Error occurred while checking if HSL is too light');
	}

	const paletteUtils: PaletteUtils = {
		createPaletteItem,
		createPaletteItemArray,
		createPaletteObject,
		generateAllColorValues,
		getPaletteOptionsFromUI,
		getRandomizedPaleteOptions,
		isHSLInBounds,
		isHSLTooDark,
		isHSLTooGray,
		isHSLTooLight
	};

	return errors.handleSync(() => paletteUtils, 'Error creating paletteUtils');
}
