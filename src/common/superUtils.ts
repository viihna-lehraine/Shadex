// File: common/superUtils.js

import {
	ColorInputElement,
	ColorSpace,
	CommonFn_MasterInterface,
	GenPaletteArgs,
	HSL
} from '../types/index.js';
import { coreUtils } from './core.js';
import { createLogger } from '../logger/index.js';
import { domData } from '../data/dom.js';
import { helpers } from './helpers/index.js';
import { modeData as mode } from '../data/mode.js';
import { utils } from './utils/index.js';

const domInputElements = domData.elements.inputs;
const logMode = mode.logging;

const thisModule = 'common/superUtils/dom.js';

const logger = await createLogger();

function getGenButtonArgs(): GenPaletteArgs | null {
	const thisMethod = 'getGenButtonArgs()';

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
					`${thisModule} > ${thisMethod}`
				);

			return null;
		}

		if (!mode.quiet && logMode.info && logMode.verbosity >= 2)
			logger.info(
				`numBoxes: ${parseInt(paletteNumberOptions.value, 10)}\npaletteType: ${parseInt(paletteTypeOptions.value, 10)}`,
				`${thisModule} > ${thisMethod}`
			);

		return {
			swatches: parseInt(paletteNumberOptions.value, 10),
			type: parseInt(paletteTypeOptions.value, 10),
			customColor: customColorRaw
				? (coreUtils.base.parseCustomColor(
						customColorRaw
					) as HSL | null)
				: null,
			enableAlpha: enableAlphaCheckbox.checked,
			limitDark: limitDarknessCheckbox.checked,
			limitGray: limitGraynessCheckbox.checked,
			limitLight: limitLightnessCheckbox.checked
		};
	} catch (error) {
		if (logMode.error)
			logger.error(
				`Failed to retrieve generateButton parameters: ${error}`,
				`${thisModule} > ${thisMethod}`
			);

		return null;
	}
}

async function switchColorSpace(targetFormat: ColorSpace): Promise<void> {
	const thisMethod = 'switchColorSpace()';

	try {
		const colorTextOutputBoxes =
			document.querySelectorAll<HTMLInputElement>(
				'.color-text-output-box'
			);

		for (const box of colorTextOutputBoxes) {
			const inputBox = box as ColorInputElement;
			const colorValues = inputBox.colorValues;

			if (!colorValues || !coreUtils.validate.colorValues(colorValues)) {
				if (logMode.error)
					logger.error(
						'Invalid color values. Cannot display toast.',
						`${thisModule} > ${thisMethod}`
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
					`${thisModule} > ${thisMethod}`
				);

			const convertFn = utils.conversion.getConversionFn(
				currentFormat,
				targetFormat
			);

			if (!convertFn) {
				if (logMode.error)
					logger.error(
						`Conversion from ${currentFormat} to ${targetFormat} is not supported.`,
						`${thisModule} > ${thisMethod}`
					);

				helpers.dom.showToast('Conversion not supported.');

				continue;
			}

			if (colorValues.format === 'xyz') {
				if (logMode.error)
					logger.error(
						'Cannot convert from XYZ to another color space.',
						`${thisModule} > ${thisMethod}`
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
						`${thisModule} > ${thisMethod}`
					);

				helpers.dom.showToast('Conversion not supported.');

				continue;
			}

			if (!clonedColor) {
				if (logMode.error)
					logger.error(
						`Conversion to ${targetFormat} failed.`,
						`${thisModule} > ${thisMethod}`
					);

				helpers.dom.showToast('Conversion failed.');

				continue;
			}

			const newColor = coreUtils.base.clone(convertFn(clonedColor));

			if (!newColor) {
				if (logMode.error)
					logger.error(
						`Conversion to ${targetFormat} failed.`,
						`${thisModule} > ${thisMethod}`
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
				`${thisModule} > ${thisMethod}`
			);
		else if (!mode.gracefulErrors)
			throw new Error(`Failed to convert colors: ${error as Error}`);
		else if (logMode.error)
			logger.error(`Failed to convert colors: ${error as Error}`);
	}
}

export const superUtils: CommonFn_MasterInterface['superUtils'] = {
	dom: {
		getGenButtonArgs,
		switchColorSpace
	}
} as const;
