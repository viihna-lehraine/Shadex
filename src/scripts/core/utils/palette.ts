// File: src/scripts/core/utils/palette.ts

import {
	AllColors,
	BrandingUtilities,
	CMYK,
	ColorUtilities,
	DOMUtilities,
	Helpers,
	Hex,
	HSL,
	Palette,
	PaletteConfig,
	PaletteItem,
	PaletteType,
	PaletteUtilities,
	RGB,
	SelectedPaletteOptions,
	Services,
	ValidationUtilities
} from '../../types/index.js';
import { domIndex, env, paletteConfig } from '../../config/index.js';

const ids = domIndex.ids;
const maxColumns = env.app.maxColumns;

export function paletteUtilitiesFactory(
	brand: BrandingUtilities,
	colorUtils: ColorUtilities,
	dom: DOMUtilities,
	helpers: Helpers,
	services: Services,
	validate: ValidationUtilities
): PaletteUtilities {
	const {
		data: { deepClone },
		dom: { getElement }
	} = helpers;
	const { errors, log } = services;

	function createPaletteItem(color: HSL, itemID: number): PaletteItem {
		return errors.handleSync(() => {
			const clonedColor = deepClone(color) as HSL;

			return {
				itemID,
				colors: {
					cmyk: (colorUtils.convertHSL(clonedColor, 'cmyk') as CMYK)
						.value,
					hex: (colorUtils.convertHSL(clonedColor, 'hex') as Hex)
						.value,
					hsl: clonedColor.value,
					rgb: (colorUtils.convertHSL(clonedColor, 'rgb') as RGB)
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
					rgb: colorUtils.formatColorAsCSS(
						colorUtils.convertHSL(clonedColor, 'rgb')
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

			paletteItems.push(createPaletteItem(baseColor, 1));

			for (const [i, hue] of hues.slice(0, maxColumns - 1).entries()) {
				const newColor: HSL = {
					value: {
						hue: brand.asRadial(hue),
						saturation: brand.asPercentile(Math.random() * 100),
						lightness: brand.asPercentile(Math.random() * 100)
					},
					format: 'hsl'
				};

				const newPaletteItem = createPaletteItem(newColor, i + 2);
				paletteItems.push(newPaletteItem);
				dom.updateColorBox(newColor, String(i + 2));
			}

			while (paletteItems.length < maxColumns) {
				paletteItems.push(
					createPaletteItem(baseColor, paletteItems.length + 1)
				);
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
			const clonedColor = deepClone(color);

			if (!validate.colorValue(clonedColor)) {
				log.error(
					`Invalid color: ${JSON.stringify(clonedColor)}`,
					`utils.palette.generateAllColorValues`
				);
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
				rgb: convert('rgb')
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
				log.warn(
					'paletteTypeOptions DOM element not found',
					`utils.palette.getPaletteOptionsFromUI`
				);
			}
			if (!columnCountElement) {
				log.warn(
					`columnCount DOM element not found`,
					`utils.palette.getPaletteOptionsFromUI`
				);
			}
			if (!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) {
				log.warn(
					`One or more checkboxes not found`,
					`utils.palette.getPaletteOptionsFromUI`
				);
			}

			if (!helpers.typeGuards.isPaletteType(paletteTypeElement!.value)) {
				log.warn(
					`Invalid palette type: ${paletteTypeElement!.value}.`,
					`utils.palette.getPaletteOptionsFromUI`
				);
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
				log.error(
					`Invalid HSL value ${JSON.stringify(hsl)}`,
					`utils.palette.isHSLInBounds`
				);

				return false;
			}

			return isHSLTooDark(hsl) || isHSLTooGray(hsl) || isHSLTooLight(hsl);
		}, 'Error occurred while checking if HSL is in bounds');
	}

	function isHSLTooDark(hsl: HSL): boolean {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsl)) {
				log.error(
					`Invalid HSL value ${JSON.stringify(hsl)}`,
					`utils.palette.isHSLTooDark`
				);

				return false;
			}

			return (
				deepClone(hsl).value.lightness < paletteConfig.thresholds.dark
			);
		}, 'Error occurred while checking if HSL is too dark');
	}

	function isHSLTooGray(hsl: HSL): boolean {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsl)) {
				log.error(
					`Invalid HSL value ${JSON.stringify(hsl)}`,
					`utils.palette.isHSLTooGray`
				);

				return false;
			}

			return (
				deepClone(hsl).value.saturation < paletteConfig.thresholds.gray
			);
		}, 'Error occurred while checking if HSL is too gray');
	}

	function isHSLTooLight(hsl: HSL): boolean {
		return errors.handleSync(() => {
			if (!validate.colorValue(hsl)) {
				log.error(
					'Invalid HSL value ${JSON.stringify(hsl)}',
					`utils.palette.isHSLTooLight`
				);

				return false;
			}

			return (
				deepClone(hsl).value.lightness > paletteConfig.thresholds.light
			);
		}, 'Error occurred while checking if HSL is too light');
	}

	function showPaletteColumns(count: number): void {
		const allColumns = helpers.dom.getAllElements(
			`.${domIndex.classes.paletteColumn}`
		);

		allColumns.forEach((col, index) => {
			if (index < count) {
				col.classList.remove('hidden');
			} else {
				col.classList.add('hidden');
			}
		});
	}

	const paletteUtilities: PaletteUtilities = {
		createPaletteItem,
		createPaletteItemArray,
		createPaletteObject,
		generateAllColorValues,
		getPaletteOptionsFromUI,
		getRandomizedPaleteOptions,
		isHSLInBounds,
		isHSLTooDark,
		isHSLTooGray,
		isHSLTooLight,
		showPaletteColumns
	};

	return errors.handleSync(
		() => paletteUtilities,
		'Error creating palette utilities group group.'
	);
}
