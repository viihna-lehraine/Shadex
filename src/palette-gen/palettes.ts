import { genHues } from './hues';
import { genAllColorValues } from '../color-spaces/conversion';
import { config } from '../config/constants';
import { defaults } from '../config/defaults';
import { domFn } from '../dom/dom-main';
import { idbFn } from '../dom/idb-fn';
import * as colors from '../index/colors';
import * as palette from '../index/palette';
import * as fnObjects from '../index/fn-objects';
import { genRandomColor } from '../utils/color-randomizer';
import { core } from '../utils/core';
import { transform } from '../utils/transform';

export function genPalette(): fnObjects.GenPalette {
	const slColorSpace: colors.ColorSpaceExtended = 'sl';

	function getBaseColor(
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Exclude<colors.Color, colors.SL | colors.SV> {
		const color = core.clone(customColor ?? genRandomColor(colorSpace));

		if (color.format === 'sl' || color.format === 'sv') {
			throw new Error(
				`Invalid color format: ${color.format} in getBaseColor`
			);
		}

		return color as Exclude<colors.Color, colors.SL | colors.SV>;
	}

	function createPaletteItem(
		color: Exclude<colors.Color, colors.SL | colors.SV>
	): palette.PaletteItem {
		const colorConversions = genAllColorValues(color);

		return {
			id: `${color.format}_${Math.random()}`,
			color,
			colorConversions: {
				cmyk: colorConversions.cmyk as colors.CMYK,
				hex: colorConversions.hex as colors.Hex,
				hsl: colorConversions.hsl as colors.HSL,
				hsv: colorConversions.hsv as colors.HSV,
				lab: colorConversions.lab as colors.LAB,
				rgb: colorConversions.rgb as colors.RGB,
				sl: colorConversions.sl as colors.SL,
				sv: colorConversions.sv as colors.SV,
				xyz: colorConversions.xyz as colors.XYZ
			},
			colorStringConversions: {
				cmykString: colorConversions.cmyk
					? (transform.colorToColorString(
							colorConversions.cmyk
						) as colors.CMYKString)
					: defaults.cmykString,
				hslString: colorConversions.hsl
					? (transform.colorToColorString(
							colorConversions.hsl
						) as colors.HSLString)
					: defaults.hslString,
				hsvString: colorConversions.hsv
					? (transform.colorToColorString(
							colorConversions.hsv
						) as colors.HSVString)
					: defaults.hsvString,
				slString: colorConversions.sl
					? (transform.colorToColorString(
							colorConversions.sl
						) as colors.SLString)
					: defaults.slString,
				svString: colorConversions.sv
					? (transform.colorToColorString(
							colorConversions.sv
						) as colors.SVString)
					: defaults.svString
			},
			cssStrings: {
				cmykCSSString: colorConversions.cmyk
					? transform.getCSSColorString(colorConversions.cmyk)
					: '',
				hexCSSString: colorConversions.hex?.value.hex ?? '',
				hslCSSString: colorConversions.hsl
					? transform.getCSSColorString(colorConversions.hsl)
					: '',
				hsvCSSString: colorConversions.hsv
					? transform.getCSSColorString(colorConversions.hsv)
					: '',
				labCSSString: colorConversions.lab
					? transform.getCSSColorString(colorConversions.lab)
					: '',
				xyzCSSString: colorConversions.xyz
					? transform.getCSSColorString(colorConversions.xyz)
					: ''
			},
			rawColorStrings: {
				cmykRawString: colorConversions.cmyk
					? transform.getRawColorString(colorConversions.cmyk)
					: '',
				hexRawString: colorConversions.hex
					? transform.getRawColorString(colorConversions.hex)
					: '',
				hslRawString: colorConversions.hsl
					? transform.getRawColorString(colorConversions.hsl)
					: '',
				hsvRawString: colorConversions.hsv
					? transform.getRawColorString(colorConversions.hsv)
					: '',
				labRawString: colorConversions.lab
					? transform.getRawColorString(colorConversions.lab)
					: '',
				slRawString: colorConversions.sl
					? transform.getRawColorString(colorConversions.sl)
					: '',
				svRawString: colorConversions.sv
					? transform.getRawColorString(colorConversions.sv)
					: '',
				xyzRawString: colorConversions.xyz
					? transform.getRawColorString(colorConversions.xyz)
					: ''
			}
		};
	}

	function createPaletteObject(
		type: string,
		items: palette.PaletteItem[],
		baseColor: colors.Color,
		numBoxes: number
	): palette.Palette {
		const validColorSpace = (format: string): format is colors.ColorSpace =>
			['cmyk', 'hex', 'hsl', 'hsv', 'lab', 'rgb', 'xyz'].includes(format);
		const originalColorSpace: colors.ColorSpace = validColorSpace(
			baseColor.format
		)
			? baseColor.format
			: 'hex';

		return {
			id: `${type}_${Date.now()}`,
			items,
			flags: {
				enableAlpha: false,
				limitDark: false,
				limitGray: false,
				limitLight: false
			},
			metadata: {
				numBoxes,
				originalColorSpace,
				paletteType: type,
				customColor: {
					originalColor: baseColor,
					colorConversions: items[0]?.colorConversions || {}
				}
			}
		};
	}

	function generatePaletteItems(
		baseColor: Exclude<colors.Color, colors.SL | colors.SV>,
		colorSpace: colors.ColorSpace,
		hues: number[]
	): palette.PaletteItem[] {
		const paletteItems: palette.PaletteItem[] = [
			createPaletteItem(baseColor)
		];

		hues.forEach((hue, i) => {
			const sl = genRandomColor(slColorSpace) as colors.SL;
			const newColor = genAllColorValues({
				value: { hue, ...sl.value },
				format: 'hsl'
			}).hsl;

			if (newColor) {
				paletteItems.push(createPaletteItem(newColor));
				updateColorBox(newColor, colorSpace, i + 1);
			}
		});

		return paletteItems;
	}

	async function savePaletteToDB(
		type: string,
		items: palette.PaletteItem[],
		baseColor: colors.Color,
		numBoxes: number
	): Promise<palette.Palette> {
		const newPalette = createPaletteObject(
			type,
			items,
			baseColor,
			numBoxes
		);

		await idbFn.savePalette(newPalette.id, {
			tableID: parseInt(newPalette.id.split('_')[1]),
			palette: newPalette
		});

		console.log(`Saved ${type} palette: ${JSON.stringify(newPalette)}`);
		return newPalette;
	}

	function updateColorBox(
		color: colors.Color,
		colorSpace: colors.ColorSpace,
		index: number
	): void {
		if (color.format === 'sl' || color.format === 'sv') {
			console.error(`Invalid color format: ${color.format}`);
			return;
		}

		const colorBox = document.getElementById(`color-box-${index + 1}`);

		if (colorBox) {
			const colorValues = genAllColorValues(
				color as Exclude<colors.Color, colors.SL | colors.SV>
			);
			const selectedColor = colorValues[colorSpace] as colors.Color;

			if (selectedColor) {
				const hexColor = colorValues.hex as colors.Hex;

				colorBox.style.backgroundColor = hexColor.value.hex;

				domFn.populateColorTextOutputBox(selectedColor, index + 1);
			}
		}
	}

	async function analogous(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette> {
		if (numBoxes < 2) {
			console.warn('Analogous palette requires at least 2 swatches.');

			return createPaletteObject('analogous', [], defaults.hex, 0);
		}

		const baseColor = getBaseColor(customColor, colorSpace);
		const baseColorValues = genAllColorValues(baseColor);
		const baseHSL = baseColorValues.hsl as colors.HSL;
		const hues = genHues.analogous(baseHSL, numBoxes);
		const paletteItems: palette.PaletteItem[] = hues.map((hue, i) => {
			const saturation = Math.min(
				100,
				Math.max(
					0,
					baseHSL.value.saturation + (Math.random() - 0.5) * 10
				)
			);
			const lightness = Math.min(
				100,
				Math.max(0, baseHSL.value.lightness + (i % 2 === 0 ? 5 : -5))
			);
			const newColor: colors.HSL = {
				value: { hue, saturation, lightness },
				format: 'hsl'
			};

			return createPaletteItem(newColor);
		});

		return await savePaletteToDB(
			'analogous',
			paletteItems,
			baseColor,
			numBoxes
		);
	}

	async function complementary(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette> {
		if (numBoxes < 2) {
			console.warn('Complementary palette requires at least 2 swatches.');

			return createPaletteObject('complementary', [], defaults.hex, 0);
		}

		const baseColor = getBaseColor(customColor, colorSpace);
		const baseHSL = genAllColorValues(baseColor).hsl as colors.HSL;
		const complementaryHue = (baseHSL.value.hue + 180) % 360;
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
					baseHSL.value.saturation + (Math.random() - 0.5) * 15
				)
			);
			const lightness = Math.min(
				100,
				Math.max(0, baseHSL.value.lightness + (i % 2 === 0 ? -10 : 10))
			);
			const newColor: colors.HSL = {
				value: { hue, saturation, lightness },
				format: 'hsl'
			};

			return createPaletteItem(newColor);
		});

		paletteItems.unshift(createPaletteItem(baseHSL));

		return await savePaletteToDB(
			'complementary',
			paletteItems,
			baseColor,
			numBoxes
		);
	}

	async function diadic(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette> {
		if (numBoxes < 2) {
			console.warn('Diadic palette requires at least 2 swatches.');

			return createPaletteObject('diadic', [], defaults.hex, 0);
		}

		const baseColor = getBaseColor(customColor, colorSpace);
		const baseHSL = genAllColorValues(baseColor).hsl as colors.HSL;
		const hues = genHues.diadic(baseHSL.value.hue);
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
				Math.max(0, baseHSL.value.saturation + saturationShift)
			);
			const adjustedLightness = Math.min(
				100,
				Math.max(0, baseHSL.value.lightness + lightnessShift)
			);
			const newColor: colors.HSL = {
				format: 'hsl',
				value: {
					hue,
					saturation: adjustedSaturation,
					lightness: adjustedLightness
				}
			};

			return createPaletteItem(newColor);
		});

		return await savePaletteToDB(
			'diadic',
			paletteItems,
			baseColor,
			numBoxes
		);
	}

	async function hexadic(
		numBoxes: number,
		customColor: colors.Color | null = null,
		colorSpace: colors.ColorSpace = 'hex'
	): Promise<palette.Palette> {
		if (numBoxes < 6) {
			console.warn('Hexadic palette requires at least 6 swatches.');

			return createPaletteObject('hexadic', [], defaults.hex, 0);
		}

		const baseColor = getBaseColor(customColor, colorSpace);
		const baseHSL = genAllColorValues(baseColor).hsl as colors.HSL;
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
				Math.max(0, baseHSL.value.saturation + saturationShift)
			);
			const adjustedLightness = Math.min(
				100,
				Math.max(0, baseHSL.value.lightness + lightnessShift)
			);
			const newColor: colors.HSL = {
				value: {
					hue,
					saturation: adjustedSaturation,
					lightness: adjustedLightness
				},
				format: 'hsl'
			};

			return createPaletteItem(newColor);
		});

		return await savePaletteToDB(
			'hexadic',
			paletteItems,
			baseColor,
			numBoxes
		);
	}

	async function monochromatic(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette> {
		if (numBoxes < 2) {
			console.warn('Monochromatic palette requires at least 2 swatches.');

			return createPaletteObject('monochromatic', [], defaults.hex, 0);
		}

		const baseColor = getBaseColor(customColor, colorSpace);
		const baseHSL = genAllColorValues(baseColor).hsl as colors.HSL;
		const paletteItems: palette.PaletteItem[] = [
			createPaletteItem(baseColor)
		];

		for (let i = 1; i < numBoxes; i++) {
			const hueShift = Math.random() * 10 - 5;
			const newHue = (baseHSL.value.hue + hueShift + 360) % 360;
			const adjustedLightness = Math.min(
				100,
				Math.max(0, baseHSL.value.lightness + (i * 10 - 20))
			);
			const adjustedSaturation = Math.min(
				100,
				Math.max(0, baseHSL.value.saturation - i * 5)
			);
			const newColor = genAllColorValues({
				value: {
					hue: newHue,
					saturation: adjustedSaturation,
					lightness: adjustedLightness
				},
				format: 'hsl'
			}).hsl;

			if (newColor) {
				paletteItems.push(createPaletteItem(newColor));
			}
		}

		return await savePaletteToDB(
			'monochromatic',
			paletteItems,
			baseColor,
			numBoxes
		);
	}

	async function random(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette> {
		const baseColor = getBaseColor(customColor, colorSpace);
		const paletteItems: palette.PaletteItem[] = [
			createPaletteItem(baseColor)
		];

		for (let i = 1; i < numBoxes; i++) {
			const randomColor = genRandomColor(colorSpace) as Exclude<
				colors.Color,
				colors.SL | colors.SV
			>;

			paletteItems.push(createPaletteItem(randomColor));

			updateColorBox(randomColor, colorSpace, i);
		}

		return await savePaletteToDB(
			'random',
			paletteItems,
			baseColor,
			numBoxes
		);
	}

	async function splitComplementary(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette> {
		if (numBoxes < 3) {
			console.warn(
				'Split complementary palette requires at least 3 swatches.'
			);

			return createPaletteObject(
				'splitComplementary',
				[],
				defaults.hex,
				0
			);
		}

		const baseColor = getBaseColor(customColor, colorSpace);
		const baseHSL = genAllColorValues(baseColor).hsl as colors.HSL;
		const [hue1, hue2] = genHues.splitComplementary(baseHSL.value.hue);
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
								baseHSL.value.saturation +
									(index === 0
										? -config.splitComplementarySaturationShiftRange
										: config.splitComplementarySaturationShiftRange),
								100
							)
						),
						lightness: Math.max(
							0,
							Math.min(
								baseHSL.value.lightness +
									(index === 0
										? -config.splitComplementaryLightnessShiftRange
										: config.splitComplementaryLightnessShiftRange),
								100
							)
						)
					}
				};
				const adjustedColor = genAllColorValues(adjustedHSL)[
					colorSpace
				] as colors.Color;

				if (
					adjustedColor.format === 'sv' ||
					adjustedColor.format === 'sl'
				) {
					throw new Error(
						`Invalid color format: ${adjustedColor.format}`
					);
				}

				return createPaletteItem(adjustedColor);
			})
		];

		return await savePaletteToDB(
			'splitComplementary',
			paletteItems,
			baseColor,
			numBoxes
		);
	}

	async function tetradic(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette> {
		if (numBoxes < 4) {
			console.warn('Tetradic palette requires at least 4 swatches.');

			return createPaletteObject('tetradic', [], defaults.hex, 0);
		}

		const baseColor = getBaseColor(customColor, colorSpace);
		const baseHSL = genAllColorValues(baseColor).hsl as colors.HSL;
		const tetradicHues = genHues.tetradic(baseHSL.value.hue);
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
								baseHSL.value.saturation +
									(index % 2 === 0
										? -config.tetradicSaturationShiftRange
										: config.tetradicSaturationShiftRange),
								100
							)
						),
						lightness: Math.max(
							0,
							Math.min(
								baseHSL.value.lightness +
									(index % 2 === 0
										? -config.tetradicLightnessShiftRange
										: config.tetradicLightnessShiftRange),
								100
							)
						)
					}
				};
				const adjustedColor =
					genAllColorValues(adjustedHSL)[colorSpace];

				return createPaletteItem(
					adjustedColor as Exclude<
						colors.Color,
						colors.SL | colors.SV
					>
				);
			})
		];

		return await savePaletteToDB(
			'tetradic',
			paletteItems,
			baseColor,
			numBoxes
		);
	}

	async function triadic(
		numBoxes: number,
		customColor: colors.Color | null,
		colorSpace: colors.ColorSpace
	): Promise<palette.Palette> {
		// Ensure at least 3 swatches
		if (numBoxes < 3) {
			console.warn('Triadic palette requires at least 3 swatches.');

			return createPaletteObject('triadic', [], defaults.hex, 0);
		}

		const baseColor = getBaseColor(customColor, colorSpace);
		const baseHSL = genAllColorValues(baseColor).hsl as colors.HSL;
		const hues = genHues.triadic(baseHSL.value.hue);
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
								baseHSL.value.saturation +
									(index % 2 === 0
										? -config.triadicSaturationShiftRange
										: config.triadicSaturationShiftRange),
								100
							)
						),
						lightness: Math.max(
							0,
							Math.min(
								baseHSL.value.lightness +
									(index % 2 === 0
										? -config.triadicLightnessShiftRange
										: config.triadicLightnessShiftRange),
								100
							)
						)
					}
				};
				const adjustedColor =
					genAllColorValues(adjustedHSL)[colorSpace];

				return createPaletteItem(
					adjustedColor as Exclude<
						colors.Color,
						colors.SL | colors.SV
					>
				);
			})
		];

		return await savePaletteToDB(
			'triadic',
			paletteItems,
			baseColor,
			numBoxes
		);
	}

	return {
		getBaseColor,
		createPaletteObject,
		createPaletteItem,
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
