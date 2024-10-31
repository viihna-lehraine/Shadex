import { genHues } from './hues';
import { limits } from './limits';
import { convert } from '../color-spaces/convert-all';
import { genAllColorValues } from '../color-spaces/conversion';
import { config } from '../config/constants';
import { defaults } from '../config/defaults';
import { domFn } from '../dom/dom-main';
import { idbFn } from '../dom/idb-fn';
import * as colors from '../index/colors';
import * as palette from '../index/palette';
import * as fnObjects from '../index/fn-objects';
import { core } from '../utils/core';
import { randomHSL, randomSL } from '../utils/random-color';
import { transform } from '../utils/transform';

export function genPalette(): fnObjects.GenPalette {
	const slColorSpace: colors.ColorSpaceExtended = 'sl';

	let currentPaletteID: number;

	async function initializeCurrentPaletteID(): Promise<void> {
		currentPaletteID = await idbFn.getCurrentPaletteID();
	}

	initializeCurrentPaletteID();

	function getNextPaletteID(): number {
		currentPaletteID += 1;

		idbFn.updateCurrentPaletteID(currentPaletteID);

		return currentPaletteID;
	}

	function createPaletteItem(
		color: colors.HSL,
		enableAlpha: boolean
	): palette.PaletteItem {
		const clonedColor = core.clone(color) as colors.HSL;

		clonedColor.value.alpha = enableAlpha ? Math.random() : 1;

		return {
			id: `${color.format}_${getNextPaletteID()}`,
			color,
			colorConversions: {
				cmyk: convert.hslToCMYK(clonedColor) as colors.CMYK,
				hex: convert.hslToHex(clonedColor) as colors.Hex,
				hsv: convert.hslToHSV(clonedColor) as colors.HSV,
				lab: convert.hslToLAB(clonedColor) as colors.LAB,
				rgb: convert.hslToRGB(clonedColor) as colors.RGB,
				sl: convert.hslToSL(clonedColor) as colors.SL,
				sv: convert.hslToSV(clonedColor) as colors.SV,
				xyz: convert.hslToXYZ(clonedColor) as colors.XYZ
			},
			colorStringConversions: {
				cmykString: transform.colorToColorString(
					convert.hslToCMYK(clonedColor)
				) as colors.CMYKString,
				hslString: transform.colorToColorString(
					clonedColor
				) as colors.HSLString,
				hsvString: transform.colorToColorString(
					convert.hslToHSV(clonedColor)
				) as colors.HSVString,
				slString: transform.colorToColorString(
					convert.hslToSL(clonedColor)
				) as colors.SLString,
				svString: transform.colorToColorString(
					convert.hslToSV(clonedColor)
				) as colors.SVString
			},
			cssStrings: {
				cmykCSSString: transform.getCSSColorString(
					convert.hslToCMYK(clonedColor)
				),
				hexCSSString: convert.hslToHex(clonedColor).value.hex,
				hslCSSString: transform.getCSSColorString(clonedColor),
				hsvCSSString: transform.getCSSColorString(
					convert.hslToHSV(clonedColor)
				),
				labCSSString: transform.getCSSColorString(
					convert.hslToLAB(clonedColor)
				),
				xyzCSSString: transform.getCSSColorString(
					convert.hslToXYZ(clonedColor)
				)
			},
			rawColorStrings: {
				cmykRawString: transform.getRawColorString(
					convert.hslToCMYK(clonedColor)
				),
				hexRawString: transform.getRawColorString(
					convert.hslToHex(clonedColor)
				),
				hslRawString: transform.getRawColorString(clonedColor),
				hsvRawString: transform.getRawColorString(
					convert.hslToHSV(clonedColor)
				),
				labRawString: transform.getRawColorString(
					convert.hslToLAB(clonedColor)
				),
				slRawString: transform.getRawColorString(
					convert.hslToSL(clonedColor)
				),
				svRawString: transform.getRawColorString(
					convert.hslToSV(clonedColor)
				),
				xyzRawString: transform.getRawColorString(
					convert.hslToXYZ(clonedColor)
				)
			}
		};
	}

	function createPaletteObject(
		type: string,
		items: palette.PaletteItem[],
		baseColor: colors.HSL,
		numBoxes: number,
		paletteID: number,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): palette.Palette {
		return {
			id: `${type}_${paletteID}`,
			items,
			flags: {
				enableAlpha: enableAlpha,
				limitDark: limitDark,
				limitGray: limitGray,
				limitLight: limitBright
			},
			metadata: {
				numBoxes,
				paletteType: type,
				customColor: {
					hslColor: baseColor,
					convertedColors: items[0]?.colorConversions || {}
				}
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

	async function savePaletteToDB(
		type: string,
		items: palette.PaletteItem[],
		baseColor: colors.HSL,
		numBoxes: number,
		enableAlpha: boolean,
		limitBright: boolean,
		limitDark: boolean,
		limitGray: boolean
	): Promise<palette.Palette> {
		const paletteID = getNextPaletteID();

		const newPalette = createPaletteObject(
			type,
			items,
			baseColor,
			numBoxes,
			paletteID,
			enableAlpha,
			limitBright,
			limitDark,
			limitGray
		);

		await idbFn.savePalette(newPalette.id, {
			tableID: parseInt(newPalette.id.split('_')[1]),
			palette: newPalette
		});

		console.log(`Saved ${type} palette: ${JSON.stringify(newPalette)}`);

		return newPalette;
	}

	function updateColorBox(color: colors.HSL, index: number): void {
		const colorBox = document.getElementById(`color-box-${index + 1}`);

		if (colorBox) {
			const colorValues = genAllColorValues(color);
			const selectedColor = colorValues as colors.Color;

			if (selectedColor) {
				const hslColor = colorValues.hsl as colors.HSL;
				const hslCSSString = transform.getCSSColorString(hslColor);

				colorBox.style.backgroundColor = hslCSSString;

				domFn.populateColorTextOutputBox(selectedColor, index + 1);
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
		const currentAnalogousPaletteID = await idbFn.getCurrentPaletteID();

		if (numBoxes < 2) {
			console.warn('Analogous palette requires at least 2 swatches.');

			return createPaletteObject(
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

		const baseColor = getBaseColor(customColor);
		const hues = genHues.analogous(baseColor, numBoxes);
		const paletteItems: palette.PaletteItem[] = hues.map((hue, i) => {
			const saturation = Math.min(
				100,
				Math.max(
					0,
					baseColor.value.saturation + (Math.random() - 0.5) * 10
				)
			);
			const lightness = Math.min(
				100,
				Math.max(0, baseColor.value.lightness + (i % 2 === 0 ? 5 : -5))
			);
			const alpha = enableAlpha ? Math.random() : 1;
			const newColor: colors.HSL = {
				value: { hue, saturation, lightness, alpha },
				format: 'hsl'
			};

			return createPaletteItem(newColor, enableAlpha);
		});

		return await savePaletteToDB(
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
		const currentComplementaryPaletteID = await idbFn.getCurrentPaletteID();

		if (numBoxes < 2) {
			console.warn('Complementary palette requires at least 2 swatches.');

			return createPaletteObject(
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

		const baseColor = getBaseColor(customColor);
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

		return await savePaletteToDB(
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
		const currentDiadicPaletteID = await idbFn.getCurrentPaletteID();

		if (numBoxes < 2) {
			console.warn('Diadic palette requires at least 2 swatches.');

			return createPaletteObject(
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

		const baseColor = getBaseColor(customColor);
		const hues = genHues.diadic(baseColor.value.hue);
		const paletteItems = Array.from({ length: numBoxes }, (_, i) => {
			const hue = hues[i % hues.length];
			const saturationShift =
				Math.random() * config.diadicSaturationShiftRange -
				config.diadicSaturationShiftRange / 2;
			const lightnessShift =
				Math.random() * config.diadicLightnessShiftRange -
				config.diadicLightnessShiftRange / 2;
			const adjustedSaturation = Math.min(
				100,
				Math.max(0, baseColor.value.saturation + saturationShift)
			);
			const adjustedLightness = Math.min(
				100,
				Math.max(0, baseColor.value.lightness + lightnessShift)
			);
			const alpha = enableAlpha ? Math.random() : 1;
			const newColor: colors.HSL = {
				value: {
					hue,
					saturation: adjustedSaturation,
					lightness: adjustedLightness,
					alpha
				},
				format: 'hsl'
			};

			return createPaletteItem(newColor, enableAlpha);
		});

		return await savePaletteToDB(
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
		const currentHexadicPaletteID = await idbFn.getCurrentPaletteID();

		if (numBoxes < 6) {
			console.warn('Hexadic palette requires at least 6 swatches.');

			return createPaletteObject(
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

		const baseColor = getBaseColor(customColor);
		const hues = genHues.hexadic(baseColor);
		const paletteItems = hues.map((hue, _i) => {
			const saturationShift =
				Math.random() * config.hexadicSaturationShiftRange -
				config.hexadicSaturationShiftRange / 2;
			const lightnessShift =
				Math.random() * config.hexadicLightnessShiftRange -
				config.hexadicLightnessShiftRange / 2;
			const adjustedSaturation = Math.min(
				100,
				Math.max(0, baseColor.value.saturation + saturationShift)
			);
			const adjustedLightness = Math.min(
				100,
				Math.max(0, baseColor.value.lightness + lightnessShift)
			);
			const alpha = enableAlpha ? Math.random() : 1;
			const newColor: colors.HSL = {
				value: {
					hue,
					saturation: adjustedSaturation,
					lightness: adjustedLightness,
					alpha
				},
				format: 'hsl'
			};

			return createPaletteItem(newColor, enableAlpha);
		});

		return await savePaletteToDB(
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
		const currentMonochromaticPaletteID = await idbFn.getCurrentPaletteID();

		if (numBoxes < 2) {
			console.warn('Monochromatic palette requires at least 2 swatches.');

			return createPaletteObject(
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

		const baseColor = getBaseColor(customColor);
		const paletteItems: palette.PaletteItem[] = [
			createPaletteItem(baseColor, enableAlpha)
		];

		for (let i = 1; i < numBoxes; i++) {
			const hueShift = Math.random() * 10 - 5;
			const newHue = (baseColor.value.hue + hueShift + 360) % 360;
			const adjustedLightness = Math.min(
				100,
				Math.max(0, baseColor.value.lightness + (i * 10 - 20))
			);
			const adjustedSaturation = Math.min(
				100,
				Math.max(0, baseColor.value.saturation - i * 5)
			);
			const alpha = enableAlpha ? Math.random() : 1;
			const newColor = genAllColorValues({
				value: {
					hue: newHue,
					saturation: adjustedSaturation,
					lightness: adjustedLightness,
					alpha
				},
				format: 'hsl'
			}).hsl;

			if (newColor) {
				paletteItems.push(createPaletteItem(newColor, enableAlpha));
			}
		}

		return await savePaletteToDB(
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
		const baseColor = getBaseColor(customColor);
		const paletteItems: palette.PaletteItem[] = [
			createPaletteItem(baseColor, enableAlpha)
		];

		for (let i = 1; i < numBoxes; i++) {
			const randomColor = genRandomColor('hsl') as colors.HSL;

			paletteItems.push(createPaletteItem(randomColor, enableAlpha));

			updateColorBox(randomColor, i);
		}

		return await savePaletteToDB(
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
			await idbFn.getCurrentPaletteID();

		if (numBoxes < 3) {
			console.warn(
				'Split complementary palette requires at least 3 swatches.'
			);

			return createPaletteObject(
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

		const baseColor = getBaseColor(customColor);
		const [hue1, hue2] = genHues.splitComplementary(baseColor.value.hue);
		const paletteItems: palette.PaletteItem[] = [
			createPaletteItem(baseColor),
			...[hue1, hue2].map((hue, index) => {
				const adjustedHSL: colors.HSL = {
					format: 'hsl',
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
						)
					}
				};
				const adjustedColor = genAllColorValues(
					adjustedHSL
				) as colors.HSL;

				return createPaletteItem(adjustedColor);
			})
		];

		return await savePaletteToDB(
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
		const currentTetradicPaletteID = await idbFn.getCurrentPaletteID();

		if (numBoxes < 4) {
			console.warn('Tetradic palette requires at least 4 swatches.');

			return createPaletteObject(
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

		const baseColor = getBaseColor(customColor);
		const tetradicHues = genHues.tetradic(baseColor.value.hue);
		const paletteItems: palette.PaletteItem[] = [
			createPaletteItem(baseColor),
			...tetradicHues.map((hue, index) => {
				const adjustedHSL: colors.HSL = {
					format: 'hsl',
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
						)
					}
				};
				const adjustedColor = genAllColorValues(adjustedHSL);

				return createPaletteItem(adjustedColor as colors.HSL);
			})
		];

		return await savePaletteToDB(
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
		const currentTriadicPaletteID = await idbFn.getCurrentPaletteID();

		if (numBoxes < 3) {
			console.warn('Triadic palette requires at least 3 swatches.');

			return createPaletteObject(
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

		const baseColor = getBaseColor(customColor);
		const hues = genHues.triadic(baseColor.value.hue);
		const paletteItems: palette.PaletteItem[] = [
			createPaletteItem(baseColor),
			...hues.map((hue, index) => {
				const adjustedHSL: colors.HSL = {
					format: 'hsl',
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
						)
					}
				};
				const adjustedColor = genAllColorValues(adjustedHSL);

				return createPaletteItem(adjustedColor as colors.HSL);
			})
		];

		return await savePaletteToDB(
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
		getBaseColor,
		createPaletteItem,
		createPaletteObject,
		generatePaletteItems,
		savePaletteToDB,
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
