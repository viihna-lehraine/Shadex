// File: src/common/superUtils/dom.js

import {
	ColorInputElement,
	ColorSpace,
	CommonFunctionsMasterInterface,
	GenButtonArgs,
	HSL
} from '../../types/index.js';
import { consts, mode } from '../data/base.js';
import { createLogger } from '../../logger/index.js';
import { core } from '../core/index.js';
import { helpers } from '../helpers/index.js';
import { utils } from '../utils/index.js';

const logger = await createLogger();

const logMode = mode.logging;
const domInputElements = consts.dom.elements.inputs;

function getGenButtonArgs(): GenButtonArgs | null {
	try {
		const paletteNumberOptions = domInputElements.paletteNumberOptions;
		const paletteTypeOptions = domInputElements.paletteTypeOptions;
		const customColorRaw = domInputElements.customColorInput?.value;
		const enableAlphaCheckbox = domInputElements.enableAlphaCheckbox;
		const limitDarknessCheckbox = domInputElements.limitDarknessCheckbox;
		const limitGraynessCheckbox = domInputElements.limitGraynessCheckbox;
		const limitLightnessCheckbox = domInputElements.limitLightnessCheckbox;

		if (
			paletteNumberOptions === null ||
			paletteTypeOptions === null ||
			enableAlphaCheckbox === null ||
			limitDarknessCheckbox === null ||
			limitGraynessCheckbox === null ||
			limitLightnessCheckbox === null
		) {
			if (logMode.error)
				logger.error(
					'One or more elements are null',
					'common > superUtils > dom > getGenButtonArgs()'
				);

			return null;
		}

		if (!mode.quiet && logMode.info && logMode.verbosity >= 2)
			logger.info(
				`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}`,
				'getGenButtonArgs()'
			);

		return {
			swatches: parseInt(paletteNumberOptions.value, 10),
			type: parseInt(paletteTypeOptions.value, 10),
			customColor: customColorRaw
				? (core.base.parseCustomColor(customColorRaw) as HSL | null)
				: null,
			enableAlpha: enableAlphaCheckbox.checked,
			limitDarkness: limitDarknessCheckbox.checked,
			limitGrayness: limitGraynessCheckbox.checked,
			limitLightness: limitLightnessCheckbox.checked
		};
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Failed to retrieve generateButton parameters: ${error}`,
				'common > superUtils > dom > getGenButtonArgs()'
			);

		return null;
	}
}

async function switchColorSpace(targetFormat: ColorSpace): Promise<void> {
	try {
		const colorTextOutputBoxes =
			document.querySelectorAll<HTMLInputElement>(
				'.color-text-output-box'
			);

		for (const box of colorTextOutputBoxes) {
			const inputBox = box as ColorInputElement;
			const colorValues = inputBox.colorValues;

			if (!colorValues || !core.validate.colorValues(colorValues)) {
				if (logMode.error)
					logger.error(
						'Invalid color values. Cannot display toast.',
						'common > superUtils > switchColorSpace()'
					);

				helpers.dom.showToast('Invalid color.');
				continue;
			}

			const currentFormat = inputBox.getAttribute(
				'data-format'
			) as ColorSpace;

			if (!mode.quiet && logMode.info && logMode.verbosity >= 2)
				logger.info(
					`Converting from ${currentFormat} to ${targetFormat}`,
					'common > superUtils > dom > switchColorSpace()'
				);

			const convertFn = utils.conversion.getConversionFn(
				currentFormat,
				targetFormat
			);

			if (!convertFn) {
				if (logMode.error)
					logger.error(
						`Conversion from ${currentFormat} to ${targetFormat} is not supported.`,
						'common > superUtils > dom > switchColorSpace()'
					);

				helpers.dom.showToast('Conversion not supported.');
				continue;
			}

			if (colorValues.format === 'xyz') {
				if (logMode.error)
					logger.error(
						'Cannot convert from XYZ to another color space.',
						'common > superUtils > dom > switchColorSpace()'
					);

				helpers.dom.showToast('Conversion not supported.');

				continue;
			}

			const clonedColor = await utils.color.narrowToColor(colorValues);

			if (
				!clonedColor ||
				utils.color.isSLColor(clonedColor) ||
				utils.color.isSVColor(clonedColor) ||
				utils.color.isXYZ(clonedColor)
			) {
				if (logMode.verbosity >= 3 && logMode.error)
					logger.error(
						'Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.',
						'common > superUtils > dom > switchColorSpace()'
					);

				helpers.dom.showToast('Conversion not supported.');

				continue;
			}

			if (!clonedColor) {
				if (logMode.error)
					logger.error(
						`Conversion to ${targetFormat} failed.`,
						'common > superUtils > dom > switchColorSpace()'
					);

				helpers.dom.showToast('Conversion failed.');

				continue;
			}

			const newColor = core.base.clone(convertFn(clonedColor));

			if (!newColor) {
				if (logMode.error)
					logger.error(
						`Conversion to ${targetFormat} failed.`,
						'common > superUtils > dom > switchColorSpace()'
					);

				helpers.dom.showToast('Conversion failed.');

				continue;
			}

			inputBox.value = String(newColor);

			inputBox.setAttribute('data-format', targetFormat);
		}
	} catch (error) {
		helpers.dom.showToast('Failed to convert colors.');

		if (!mode.quiet && logMode.warn)
			logger.warn(
				'Failed to convert colors.',
				'common > superUtils > dom > switchColorSpace()'
			);
		else if (!mode.gracefulErrors)
			throw new Error(`Failed to convert colors: ${error as Error}`);
		else if (logMode.error)
			logger.error(`Failed to convert colors: ${error as Error}`);
	}
}

export const dom: CommonFunctionsMasterInterface['superUtils']['dom'] = {
	getGenButtonArgs,
	switchColorSpace
} as const;
