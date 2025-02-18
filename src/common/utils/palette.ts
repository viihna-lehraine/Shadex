// File: common/utils/palette.js

import {
	AllColors,
	CMYK,
	Hex,
	HSL,
	HSV,
	LAB,
	Palette,
	PaletteItem,
	PaletteType,
	PaletteUtilsInterface,
	RGB,
	SelectedPaletteOptions,
	ServicesInterface,
	UtilitiesInterface,
	XYZ
} from '../../types/index.js';
import { data } from '../../data/index.js';

const ids = data.dom.ids;

export function createPaletteUtils(
	services: ServicesInterface,
	utils: UtilitiesInterface
): PaletteUtilsInterface {
	function createPaletteItem(color: HSL, itemID: number): PaletteItem {
		const clonedColor = utils.core.clone(color) as HSL;

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
				cmyk: utils.color.convertColorToCSS(
					utils.color.convertHSL(clonedColor, 'cmyk')
				),
				hex: utils.color.convertColorToCSS(
					utils.color.convertHSL(clonedColor, 'hex')
				),
				hsl: utils.color.convertColorToCSS(clonedColor),
				hsv: utils.color.convertColorToCSS(
					utils.color.convertHSL(clonedColor, 'hsv')
				),
				lab: utils.color.convertColorToCSS(
					utils.color.convertHSL(clonedColor, 'lab')
				),
				rgb: utils.color.convertColorToCSS(
					utils.color.convertHSL(clonedColor, 'rgb')
				),
				xyz: utils.color.convertColorToCSS(
					utils.color.convertHSL(clonedColor, 'xyz')
				)
			}
		};
	}

	return {
		createPaletteItem,
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
					flags: {
						limitDark: options.limitDark,
						limitGray: options.limitGray,
						limitLight: options.limitLight
					},
					timestamp: utils.app.getFormattedTimestamp(),
					type: options.paletteType
				}
			};
		},
		generateAllColorValues(color: HSL): AllColors {
			const log = services.log;
			const clonedColor = utils.core.clone(color);

			if (!utils.validate.colorValue(clonedColor)) {
				log(
					'error',
					`Invalid color: ${JSON.stringify(clonedColor)}`,
					'paletteUtils.generateAllColorValues()'
				);
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
			const log = services.log;

			try {
				const columnCountElement =
					utils.core.getElement<HTMLInputElement>(
						ids.inputs.columnCount
					);
				const paletteTypeElement =
					utils.core.getElement<HTMLInputElement>(
						ids.inputs.paletteType
					);
				const limitDarkChkbx = utils.core.getElement<HTMLInputElement>(
					ids.inputs.limitDarkChkbx
				);
				const limitGrayChkbx = utils.core.getElement<HTMLInputElement>(
					ids.inputs.limitGrayChkbx
				);
				const limitLightChkbx = utils.core.getElement<HTMLInputElement>(
					ids.inputs.limitLightChkbx
				);

				if (!paletteTypeElement) {
					log(
						'warn',
						'paletteTypeOptions DOM element not found',
						'paletteUtils.getPaletteOptionsFromUI',
						2
					);
				}
				if (!columnCountElement) {
					log(
						'warn',
						`columnCount DOM element not found`,
						'paletteUtils.getPaletteOptionsFromUI',
						2
					);
				}
				if (!limitDarkChkbx || !limitGrayChkbx || !limitLightChkbx) {
					log(
						'warn',
						`One or more checkboxes not found`,
						'paletteUtils.getPaletteOptionsFromUI',
						2
					);
				}

				if (
					!utils.typeGuards.isPaletteType(paletteTypeElement!.value)
				) {
					log(
						'warn',
						`Invalid palette type: ${paletteTypeElement!.value}`,
						'paletteUtils.getPaletteOptionsFromUI',
						2
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
				log(
					'error',
					`Failed to retrieve parameters from UI: ${error}`,
					'paletteUtils.getPaletteOptionsFromUI',
					1
				);

				return {
					columnCount: 0,
					distributionType: 'soft',
					limitDark: false,
					limitGray: false,
					limitLight: false,
					paletteType: 'random'
				};
			}
		}
	};
}
