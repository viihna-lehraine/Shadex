import { colorUtils } from './color-utils';
import { commonUtils } from './common-utils';
import { core } from './core-utils';
import * as colors from '../index/colors';
import * as fnObjects from '../index/fn-objects';
import * as palette from '../index/palette';
import { notification } from '../helpers/notification';

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
				convertedColors: items[0]?.colors || {}
			}
		}
	};
}

function populateColorTextOutputBox(
	color: colors.Color | colors.ColorString,
	boxNumber: number
): void {
	try {
		const clonedColor: colors.Color = colorUtils.isColor(color)
			? core.clone(color)
			: colorUtils.colorStringToColor(color);

		if (!commonUtils.validateColorValues(clonedColor)) {
			console.error('Invalid color values.');

			notification.showToast('Invalid color values.');

			return;
		}

		const colorTextOutputBox = document.getElementById(
			`color-text-output-box-${boxNumber}`
		) as HTMLInputElement | null;

		if (!colorTextOutputBox) return;

		const stringifiedColor = colorUtils.getCSSColorString(clonedColor);

		console.log(`Adding CSS-formatted color to DOM ${stringifiedColor}`);

		colorTextOutputBox.value = stringifiedColor;
		colorTextOutputBox.setAttribute('data-format', color.format);
	} catch (error) {
		console.error('Failed to populate color text output box:', error);

		return;
	}
}

export const paletteUtils: fnObjects.PaletteUtils = {
	createPaletteObject,
	populateColorTextOutputBox
};
