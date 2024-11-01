import { genHues } from './hues';
import { limits } from './limits';
import { convert } from './conversion-index';
import { genAllColorValues } from '../utils/conversion-utils';
import { config } from '../config/constants';
import { defaults } from '../config/defaults';
import { database } from '../database/database';
import * as colors from '../index/colors';
import * as palette from '../index/palette';
import * as fnObjects from '../index/fn-objects';
import { colorUtils } from '../utils/color-utils';
import { core } from '../utils/core-utils';
import { paletteUtils } from '../utils/palette-utils';
import { randomHSL, randomSL } from '../utils/random-color-utils';

export async function genPalette(): Promise<fnObjects.GenPalette> {
	function createPaletteItem(
		color: colors.HSL,
		enableAlpha: boolean
	): palette.PaletteItem {
		const clonedColor = core.clone(color) as colors.HSL;

		clonedColor.value.alpha = enableAlpha ? Math.random() : 1;

		return {
			id: `${color.format}_${database.getNextPaletteID()}`,
			colors: {
				cmyk: (convert.hslToCMYK(clonedColor) as colors.CMYK).value,
				hex: (convert.hslToHex(clonedColor) as colors.Hex).value,
				hsl: clonedColor.value,
				hsv: (convert.hslToHSV(clonedColor) as colors.HSV).value,
				lab: (convert.hslToLAB(clonedColor) as colors.LAB).value,
				rgb: (convert.hslToRGB(clonedColor) as colors.RGB).value,
				xyz: (convert.hslToXYZ(clonedColor) as colors.XYZ).value
			},
			colorStrings: {
				cmykString: (
					colorUtils.colorToColorString(
						convert.hslToCMYK(clonedColor)
					) as colors.CMYKString
				).value,
				hslString: colorUtils.colorToColorString(
					clonedColor
				) as colors.HSLString,
				hsvString: colorUtils.colorToColorString(
					convert.hslToHSV(clonedColor)
				) as colors.HSVString,
				slString: colorUtils.colorToColorString(
					convert.hslToSL(clonedColor)
				) as colors.SLString,
				svString: colorUtils.colorToColorString(
					convert.hslToSV(clonedColor)
				) as colors.SVString
			},
			cssStrings: {
				cmykCSSString: colorUtils.getCSSColorString(
					convert.hslToCMYK(clonedColor)
				),
				hexCSSString: convert.hslToHex(clonedColor).value.hex,
				hslCSSString: colorUtils.getCSSColorString(clonedColor),
				hsvCSSString: colorUtils.getCSSColorString(
					convert.hslToHSV(clonedColor)
				),
				labCSSString: colorUtils.getCSSColorString(
					convert.hslToLAB(clonedColor)
				),
				xyzCSSString: colorUtils.getCSSColorString(
					convert.hslToXYZ(clonedColor)
				)
			}
		};
	}

	function generatePaletteItems(
		baseColor: colors.HSL,
		hues: number[],
		enableAlpha: boolean,
		limitDark: boolean,
		limitGray: boolean,
		limitBright: boolean
	): palette.PaletteItem[] {
		const paletteItems: palette.PaletteItem[] = [
			createPaletteItem(baseColor, enableAlpha)
		];

		hues.forEach((hue, i) => {
			let newColor: colors.HSL | null = null;

			do {
				const sl = randomSL(enableAlpha) as colors.SL;
				newColor = genAllColorValues({
					value: { hue, ...sl.value },
					format: 'hsl'
				}).hsl as colors.HSL;
			} while (
				newColor &&
				((limitGray && limits.isTooGray(newColor)) ||
					(limitDark && limits.isTooDark(newColor)) ||
					(limitBright && limits.isTooBright(newColor)))
			);

			if (newColor) {
				paletteItems.push(createPaletteItem(newColor, enableAlpha));

				updateColorBox(newColor, i + 1);
			}
		});

		return paletteItems;
	}

	function getBaseColor(
		customColor: colors.HSL | null,
		enableAlpha: boolean
	): colors.HSL {
		const color = core.clone(customColor ?? randomHSL(enableAlpha));

		return color as colors.HSL;
	}

	function updateColorBox(color: colors.HSL, index: number): void {
		const colorBox = document.getElementById(`color-box-${index + 1}`);

		if (colorBox) {
			const colorValues = genAllColorValues(color);
			const selectedColor = colorValues as colors.Color;

			if (selectedColor) {
				const hslColor = colorValues.hsl as colors.HSL;
				const hslCSSString = colorUtils.getCSSColorString(hslColor);

				colorBox.style.backgroundColor = hslCSSString;

				paletteUtils.populateColorTextOutputBox(
					selectedColor,
					index + 1
				);
			}
		}
	}

	async function analogous(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette> {
		const currentAnalogousPaletteID = await database.getCurrentPaletteID();

		if (numBoxes < 2) {
			console.warn('Analogous palette requires at least 2 swatches.');

			return paletteUtils.createPaletteObject(
				'analogous',
				[],
				defaults.hsl,
				0,
				currentAnalogousPaletteID,
				enableAlpha,
				limitBright,
				limitDark,
				limitGray
			);
		}

		const baseColor = getBaseColor(customColor, enableAlpha);
		const hues = genHues.analogous(baseColor, numBoxes);
		const paletteItems: palette.PaletteItem[] = hues.map((hue, i) => {
			const newColor: colors.HSL = {
				value: {
					hue,
					saturation: Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation +
								(Math.random() - 0.5) * 10
						)
					),
					lightness: Math.min(
						100,
						Math.max(
							0,
							baseColor.value.lightness + (i % 2 === 0 ? 5 : -5)
						)
					),
					alpha: enableAlpha ? Math.random() : 1
				},
				format: 'hsl'
			};

			return createPaletteItem(newColor, enableAlpha);
		});

		return await database.savePaletteToDB(
			'analogous',
			paletteItems,
			baseColor,
			numBoxes,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		);
	}

	async function complementary(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette> {
		const currentComplementaryPaletteID =
			await database.getCurrentPaletteID();

		if (numBoxes < 2) {
			console.warn('Complementary palette requires at least 2 swatches.');

			return paletteUtils.createPaletteObject(
				'complementary',
				[],
				defaults.hsl,
				0,
				currentComplementaryPaletteID,
				enableAlpha,
				limitBright,
				limitDark,
				limitGray
			);
		}

		const baseColor = getBaseColor(customColor, enableAlpha);
		const complementaryHue = (baseColor.value.hue + 180) % 360;
		const hues = Array.from(
			{ length: numBoxes - 1 },
			(_, _i) =>
				(complementaryHue +
					(Math.random() * config.complementaryHueShiftRange -
						config.complementaryHueShiftRange / 2)) %
				360
		);
		const paletteItems: palette.PaletteItem[] = hues.map((hue, i) => {
			const saturation = Math.min(
				100,
				Math.max(
					0,
					baseColor.value.saturation + (Math.random() - 0.5) * 15
				)
			);
			const lightness = Math.min(
				100,
				Math.max(
					0,
					baseColor.value.lightness + (i % 2 === 0 ? -10 : 10)
				)
			);
			const alpha = enableAlpha ? Math.random() : 1;
			const newColor: colors.HSL = {
				value: { hue, saturation, lightness, alpha },
				format: 'hsl'
			};

			return createPaletteItem(newColor, enableAlpha);
		});

		paletteItems.unshift(createPaletteItem(baseColor, enableAlpha));

		return await database.savePaletteToDB(
			'complementary',
			paletteItems,
			baseColor,
			numBoxes,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		);
	}

	async function diadic(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette> {
		const currentDiadicPaletteID = await database.getCurrentPaletteID();

		if (numBoxes < 2) {
			console.warn('Diadic palette requires at least 2 swatches.');

			return paletteUtils.createPaletteObject(
				'diadic',
				[],
				defaults.hsl,
				0,
				currentDiadicPaletteID,
				enableAlpha,
				limitBright,
				limitDark,
				limitGray
			);
		}

		const baseColor = getBaseColor(customColor, enableAlpha);
		const hues = genHues.diadic(baseColor.value.hue);
		const paletteItems = Array.from({ length: numBoxes }, (_, i) => {
			const saturationShift =
				Math.random() * config.diadicSaturationShiftRange -
				config.diadicSaturationShiftRange / 2;
			const lightnessShift =
				Math.random() * config.diadicLightnessShiftRange -
				config.diadicLightnessShiftRange / 2;
			const newColor: colors.HSL = {
				value: {
					hue: hues[i % hues.length],
					saturation: Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					),
					lightness: Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					),
					alpha: enableAlpha ? Math.random() : 1
				},
				format: 'hsl'
			};

			return createPaletteItem(newColor, enableAlpha);
		});

		return await database.savePaletteToDB(
			'diadic',
			paletteItems,
			baseColor,
			numBoxes,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		);
	}

	async function hexadic(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette> {
		const currentHexadicPaletteID = await database.getCurrentPaletteID();

		if (numBoxes < 6) {
			console.warn('Hexadic palette requires at least 6 swatches.');

			return paletteUtils.createPaletteObject(
				'hexadic',
				[],
				defaults.hsl,
				0,
				currentHexadicPaletteID,
				enableAlpha,
				limitBright,
				limitDark,
				limitGray
			);
		}

		const baseColor = getBaseColor(customColor, enableAlpha);
		const hues = genHues.hexadic(baseColor);
		const paletteItems = hues.map((hue, _i) => {
			const saturationShift =
				Math.random() * config.hexadicSaturationShiftRange -
				config.hexadicSaturationShiftRange / 2;
			const lightnessShift =
				Math.random() * config.hexadicLightnessShiftRange -
				config.hexadicLightnessShiftRange / 2;
			const newColor: colors.HSL = {
				value: {
					hue,
					saturation: Math.min(
						100,
						Math.max(
							0,
							baseColor.value.saturation + saturationShift
						)
					),
					lightness: Math.min(
						100,
						Math.max(0, baseColor.value.lightness + lightnessShift)
					),
					alpha: enableAlpha ? Math.random() : 1
				},
				format: 'hsl'
			};

			return createPaletteItem(newColor, enableAlpha);
		});

		return await database.savePaletteToDB(
			'hexadic',
			paletteItems,
			baseColor,
			numBoxes,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		);
	}

	async function monochromatic(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette> {
		const currentMonochromaticPaletteID =
			await database.getCurrentPaletteID();

		if (numBoxes < 2) {
			console.warn('Monochromatic palette requires at least 2 swatches.');

			return paletteUtils.createPaletteObject(
				'monochromatic',
				[],
				defaults.hsl,
				0,
				currentMonochromaticPaletteID,
				enableAlpha,
				limitBright,
				limitDark,
				limitGray
			);
		}

		const baseColor = getBaseColor(customColor, enableAlpha);
		const paletteItems: palette.PaletteItem[] = [
			createPaletteItem(baseColor, enableAlpha)
		];

		for (let i = 1; i < numBoxes; i++) {
			const hueShift = Math.random() * 10 - 5;
			const newColor = genAllColorValues({
				value: {
					hue: (baseColor.value.hue + hueShift + 360) % 360,
					saturation: Math.min(
						100,
						Math.max(0, baseColor.value.saturation - i * 5)
					),
					lightness: Math.min(
						100,
						Math.max(0, baseColor.value.lightness + (i * 10 - 20))
					),
					alpha: enableAlpha ? Math.random() : 1
				},
				format: 'hsl'
			}).hsl;

			if (newColor) {
				paletteItems.push(createPaletteItem(newColor, enableAlpha));
			}
		}

		return await database.savePaletteToDB(
			'monochromatic',
			paletteItems,
			baseColor,
			numBoxes,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		);
	}

	async function random(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette> {
		const baseColor = getBaseColor(customColor, enableAlpha);
		const paletteItems: palette.PaletteItem[] = [
			createPaletteItem(baseColor, enableAlpha)
		];

		for (let i = 1; i < numBoxes; i++) {
			const randomColor = randomHSL(enableAlpha);

			paletteItems.push(createPaletteItem(randomColor, enableAlpha));

			updateColorBox(randomColor, i);
		}

		return await database.savePaletteToDB(
			'random',
			paletteItems,
			baseColor,
			numBoxes,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		);
	}

	async function splitComplementary(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette> {
		const currentSplitComplementaryPaletteID =
			await database.getCurrentPaletteID();

		if (numBoxes < 3) {
			console.warn(
				'Split complementary palette requires at least 3 swatches.'
			);

			return paletteUtils.createPaletteObject(
				'splitComplementary',
				[],
				defaults.hsl,
				0,
				currentSplitComplementaryPaletteID,
				enableAlpha,
				limitBright,
				limitDark,
				limitGray
			);
		}

		const baseColor = getBaseColor(customColor, enableAlpha);
		const [hue1, hue2] = genHues.splitComplementary(baseColor.value.hue);
		const paletteItems: palette.PaletteItem[] = [
			createPaletteItem(baseColor, enableAlpha),
			...[hue1, hue2].map((hue, index) => {
				const adjustedHSL: colors.HSL = {
					value: {
						hue,
						saturation: Math.max(
							0,
							Math.min(
								baseColor.value.saturation +
									(index === 0
										? -config.splitComplementarySaturationShiftRange
										: config.splitComplementarySaturationShiftRange),
								100
							)
						),
						lightness: Math.max(
							0,
							Math.min(
								baseColor.value.lightness +
									(index === 0
										? -config.splitComplementaryLightnessShiftRange
										: config.splitComplementaryLightnessShiftRange),
								100
							)
						),
						alpha: enableAlpha ? Math.random() : 1
					},
					format: 'hsl'
				};
				const adjustedColor = genAllColorValues(
					adjustedHSL
				) as colors.HSL;

				return createPaletteItem(adjustedColor, enableAlpha);
			})
		];

		return await database.savePaletteToDB(
			'splitComplementary',
			paletteItems,
			baseColor,
			numBoxes,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		);
	}

	async function tetradic(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette> {
		const currentTetradicPaletteID = await database.getCurrentPaletteID();

		if (numBoxes < 4) {
			console.warn('Tetradic palette requires at least 4 swatches.');

			return paletteUtils.createPaletteObject(
				'tetradic',
				[],
				defaults.hsl,
				0,
				currentTetradicPaletteID,
				enableAlpha,
				limitBright,
				limitDark,
				limitGray
			);
		}

		const baseColor = getBaseColor(customColor, enableAlpha);
		const tetradicHues = genHues.tetradic(baseColor.value.hue);
		const paletteItems: palette.PaletteItem[] = [
			createPaletteItem(baseColor, enableAlpha),
			...tetradicHues.map((hue, index) => {
				const adjustedHSL: colors.HSL = {
					value: {
						hue,
						saturation: Math.max(
							0,
							Math.min(
								baseColor.value.saturation +
									(index % 2 === 0
										? -config.tetradicSaturationShiftRange
										: config.tetradicSaturationShiftRange),
								100
							)
						),
						lightness: Math.max(
							0,
							Math.min(
								baseColor.value.lightness +
									(index % 2 === 0
										? -config.tetradicLightnessShiftRange
										: config.tetradicLightnessShiftRange),
								100
							)
						),
						alpha: enableAlpha ? Math.random() : 1
					},
					format: 'hsl'
				};
				const adjustedColor = genAllColorValues(adjustedHSL);

				return createPaletteItem(
					adjustedColor.hsl as colors.HSL,
					enableAlpha
				);
			})
		];

		return await database.savePaletteToDB(
			'tetradic',
			paletteItems,
			baseColor,
			numBoxes,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		);
	}

	async function triadic(
		numBoxes: number,
		customColor: colors.HSL | null,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette> {
		const currentTriadicPaletteID = await database.getCurrentPaletteID();

		if (numBoxes < 3) {
			console.warn('Triadic palette requires at least 3 swatches.');

			return paletteUtils.createPaletteObject(
				'triadic',
				[],
				defaults.hsl,
				0,
				currentTriadicPaletteID,
				enableAlpha,
				limitBright,
				limitDark,
				limitGray
			);
		}

		const baseColor = getBaseColor(customColor, enableAlpha);
		const hues = genHues.triadic(baseColor.value.hue);
		const paletteItems: palette.PaletteItem[] = [
			createPaletteItem(baseColor, enableAlpha),
			...hues.map((hue, index) => {
				const adjustedHSL: colors.HSL = {
					value: {
						hue,
						saturation: Math.max(
							0,
							Math.min(
								baseColor.value.saturation +
									(index % 2 === 0
										? -config.triadicSaturationShiftRange
										: config.triadicSaturationShiftRange),
								100
							)
						),
						lightness: Math.max(
							0,
							Math.min(
								baseColor.value.lightness +
									(index % 2 === 0
										? -config.triadicLightnessShiftRange
										: config.triadicLightnessShiftRange),
								100
							)
						),
						alpha: enableAlpha ? Math.random() : 1
					},
					format: 'hsl'
				};
				const adjustedColor = genAllColorValues(adjustedHSL);

				return createPaletteItem(
					adjustedColor as colors.HSL,
					enableAlpha
				);
			})
		];

		return await database.savePaletteToDB(
			'triadic',
			paletteItems,
			baseColor,
			numBoxes,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		);
	}

	return {
		createPaletteItem,
		generatePaletteItems,
		getBaseColor,
		updateColorBox,
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
}
