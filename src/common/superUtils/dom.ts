// File: src/common/superUtils/dom.js

import {
	ColorInputElement,
	ColorSpace,
	CommonSuperUtilsDOM,
	GenButtonArgs,
	HSL
} from '../../index/index.js';
import { core } from '../core/index.js';
import { data } from '../../data/index.js';
import { helpers } from '../helpers/index.js';
import { utils } from '../utils/index.js';

const mode = data.mode;

function getGenButtonArgs(): GenButtonArgs | null {
	try {
		const paletteNumberOptions =
			data.consts.dom.elements.paletteNumberOptions;
		const paletteTypeOptions = data.consts.dom.elements.paletteTypeOptions;
		const customColorRaw =
			data.consts.dom.elements.customColorElement?.value;
		const enableAlphaCheckbox =
			data.consts.dom.elements.enableAlphaCheckbox;
		const limitDarknessCheckbox =
			data.consts.dom.elements.limitDarknessCheckbox;
		const limitGraynessCheckbox =
			data.consts.dom.elements.limitGraynessCheckbox;
		const limitLightnessCheckbox =
			data.consts.dom.elements.limitLightnessCheckbox;

		if (
			paletteNumberOptions === null ||
			paletteTypeOptions === null ||
			enableAlphaCheckbox === null ||
			limitDarknessCheckbox === null ||
			limitGraynessCheckbox === null ||
			limitLightnessCheckbox === null
		) {
			if (mode.errorLogs) console.error('One or more elements are null');

			return null;
		}

		if (!mode.quiet)
			console.log(
				`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}`
			);

		return {
			numBoxes: parseInt(paletteNumberOptions.value, 10),
			paletteType: parseInt(paletteTypeOptions.value, 10),
			customColor: customColorRaw
				? (core.base.parseCustomColor(customColorRaw) as HSL | null)
				: null,
			enableAlpha: enableAlphaCheckbox.checked,
			limitDarkness: limitDarknessCheckbox.checked,
			limitGrayness: limitGraynessCheckbox.checked,
			limitLightness: limitLightnessCheckbox.checked
		};
	} catch (error) {
		if (mode.errorLogs)
			console.error(
				`Failed to retrieve generateButton parameters: ${error}`
			);

		return null;
	}
}

function switchColorSpace(targetFormat: ColorSpace): void {
	try {
		const colorTextOutputBoxes =
			document.querySelectorAll<HTMLInputElement>(
				'.color-text-output-box'
			);

		colorTextOutputBoxes.forEach(box => {
			const inputBox = box as ColorInputElement;
			const colorValues = inputBox.colorValues;

			if (!colorValues || !core.validate.colorValues(colorValues)) {
				if (mode.errorLogs)
					console.error(
						'Invalid color values. Cannot display toast.'
					);

				helpers.dom.showToast('Invalid color.');

				return;
			}

			const currentFormat = inputBox.getAttribute(
				'data-format'
			) as ColorSpace;

			if (!mode.quiet)
				console.log(
					`Converting from ${currentFormat} to ${targetFormat}`
				);

			const convertFn = utils.conversion.getConversionFn(
				currentFormat,
				targetFormat
			);

			if (!convertFn) {
				if (mode.errorLogs)
					console.error(
						`Conversion from ${currentFormat} to ${targetFormat} is not supported.`
					);

				helpers.dom.showToast('Conversion not supported.');

				return;
			}

			if (colorValues.format === 'xyz') {
				if (mode.errorLogs)
					console.error(
						'Cannot convert from XYZ to another color space.'
					);

				helpers.dom.showToast('Conversion not supported.');

				return;
			}

			const clonedColor = utils.color.narrowToColor(colorValues);

			if (
				!clonedColor ||
				utils.color.isSLColor(clonedColor) ||
				utils.color.isSVColor(clonedColor) ||
				utils.color.isXYZ(clonedColor)
			) {
				if (mode.errorLogs)
					console.error(
						'Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.'
					);

				helpers.dom.showToast('Conversion not supported.');

				return;
			}

			if (!clonedColor) {
				if (mode.errorLogs)
					console.error(`Conversion to ${targetFormat} failed.`);

				helpers.dom.showToast('Conversion failed.');

				return;
			}

			const newColor = core.base.clone(convertFn(clonedColor));

			if (!newColor) {
				if (mode.errorLogs)
					console.error(`Conversion to ${targetFormat} failed.`);

				helpers.dom.showToast('Conversion failed.');

				return;
			}

			inputBox.value = String(newColor);

			inputBox.setAttribute('data-format', targetFormat);
		});
	} catch (error) {
		helpers.dom.showToast('Failed to convert colors.');

		if (!mode.quiet) console.log('Failed to convert colors.');
		else if (!mode.gracefulErrors)
			throw new Error(`Failed to convert colors: ${error as Error}`);
		else if (mode.errorLogs)
			console.error(`Failed to convert colors: ${error as Error}`);
	}
}

export const dom: CommonSuperUtilsDOM = {
	getGenButtonArgs,
	switchColorSpace
} as const;
