// File: common/utils/palette.js

import {
	AllColors,
	CMYK,
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
	Utilities,
	XYZ
} from '../../types/index.js';
import { domIndex, paletteConfig } from '../../config/index.js';

const ids = domIndex.ids;

export function paletteUtilsFactory(
	helpers: Helpers,
	services: Services,
	utils: Utilities
): PaletteUtils {
	const { clone } = helpers.data;
	const { getElement } = helpers.dom;
	const { log } = services;

	function createPaletteItem(color: HSL, itemID: number): PaletteItem {
		const clonedColor = clone(color) as HSL;

		return {
			itemID,
			colors: {
				cmyk: (utils.color.convertHSL(clonedColor, 'cmyk') as CMYK)
					.value,
				hex: (utils.color.convertHSL(clonedColor, 'hex') as Hex).value,
				hsl: clonedColor.value,
				hsv: (utils.color.convertHSL(clonedColor, 'hsv') as HSV).value,
				lab: (utils.color.convertHSL(clonedColor, 'lab') as LAB).value,
				rgb: (utils.color.convertHSL(clonedColor, 'rgb') as RGB).value,
				xyz: (utils.color.convertHSL(clonedColor, 'xyz') as XYZ).value
			},
			css: {
				cmyk: utils.color.formatColorAsCSS(
					utils.color.convertHSL(clonedColor, 'cmyk')
				),
				hex: utils.color.formatColorAsCSS(
					utils.color.convertHSL(clonedColor, 'hex')
				),
				hsl: utils.color.formatColorAsCSS(clonedColor),
				hsv: utils.color.formatColorAsCSS(
					utils.color.convertHSL(clonedColor, 'hsv')
				),
				lab: utils.color.formatColorAsCSS(
					utils.color.convertHSL(clonedColor, 'lab')
				),
				rgb: utils.color.formatColorAsCSS(
					utils.color.convertHSL(clonedColor, 'rgb')
				),
				xyz: utils.color.formatColorAsCSS(
					utils.color.convertHSL(clonedColor, 'xyz')
				)
			}
		};
	}

	function isHSLTooDark(hsl: HSL): boolean {
		if (!utils.validate.colorValue(hsl)) {
			log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');

			return false;
		}

		return clone(hsl).value.lightness < paletteConfig.thresholds.dark;
	}

	function isHSLTooGray(hsl: HSL): boolean {
		if (!utils.validate.colorValue(hsl)) {
			log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');

			return false;
		}

		return clone(hsl).value.saturation < paletteConfig.thresholds.gray;
	}

	function isHSLTooLight(hsl: HSL): boolean {
		if (!utils.validate.colorValue(hsl)) {
			log('Invalid HSL value ${JSON.stringify(hsl)}', 'error');

			return false;
		}

		return clone(hsl).value.lightness > paletteConfig.thresholds.light;
	}

	return {
		createPaletteItem,
		isHSLTooDark,
		isHSLTooGray,
		isHSLTooLight,
		createPaletteItemArray(baseColor: HSL, hues: number[]): PaletteItem[] {
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
						hue: utils.brand.asRadial(hue),
						saturation: utils.brand.asPercentile(
							Math.random() * 100
						),
						lightness: utils.brand.asPercentile(Math.random() * 100)
					},
					format: 'hsl'
				};

				const newPaletteItem = createPaletteItem(
					newColor,
					i + 2 // IDs start at 2 for generated colors
				);

				paletteItems.push(newPaletteItem);
				utils.dom.updateColorBox(newColor, String(i + 2));
			}

			return paletteItems;
		},
		createPaletteObject(
			options: SelectedPaletteOptions,
			paletteItems: PaletteItem[]
		): Palette {
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
		},
		generateAllColorValues(color: HSL): AllColors {
			const clonedColor = clone(color);

			if (!utils.validate.colorValue(clonedColor)) {
				log(`Invalid color: ${JSON.stringify(clonedColor)}`, 'error');
				throw new Error('Invalid HSL color provided');
			}

			const convert = <T extends keyof AllColors>(
				target: T
			): AllColors[T] =>
				utils.color.convertHSL(clonedColor, target) as AllColors[T];

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
		},
		getPaletteOptionsFromUI(): SelectedPaletteOptions {
			try {
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
					log('paletteTypeOptions DOM element not found', 'warn');
				}
				if (!columnCountElement) {
					log(`columnCount DOM element not found`, 'warn');
				}
				if (!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) {
					log(`One or more checkboxes not found`, 'warn');
				}

				if (
					!utils.typeGuards.isPaletteType(paletteTypeElement!.value)
				) {
					log(
						`Invalid palette type: ${paletteTypeElement!.value}`,
						'warn'
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
			} catch (error) {
				log(`Failed to retrieve parameters from UI: ${error}`, 'error');

				return {
					columnCount: 0,
					distributionType: 'soft',
					limitDark: false,
					limitGray: false,
					limitLight: false,
					paletteType: 'random'
				};
			}
		},
		getRandomizedPaleteOptions(): SelectedPaletteOptions {
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
		},
		isHSLInBounds(hsl: HSL): boolean {
			if (!utils.validate.colorValue(hsl)) {
				log(`Invalid HSL value ${JSON.stringify(hsl)}`, 'error');

				return false;
			}

			return isHSLTooDark(hsl) || isHSLTooGray(hsl) || isHSLTooLight(hsl);
		}
	};
}
