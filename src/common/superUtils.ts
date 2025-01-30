// File: common/superUtils.js

import {
	ColorInputElement,
	ColorSpace,
	CommonFn_MasterInterface,
	HSL,
	PaletteGenerationArgs
} from '../types/index.js';
import { coreUtils } from './core.js';
import { createLogger } from '../logger/index.js';
import { domData } from '../data/dom.js';
import { helpers } from './helpers/index.js';
import { modeData as mode } from '../data/mode.js';
import { utils } from './utils/index.js';

const domElements = domData.elements.static;
const logMode = mode.logging;

const thisModule = 'common/superUtils/dom.js';

const logger = await createLogger();

function getPaletteGenerationArgs(): PaletteGenerationArgs | null {
	const thisMethod = 'getGenButtonArgs()';

	try {
		const swatchGenNumber = domElements.selects.swatchGen;
		const paletteType = domElements.selects.paletteType;
		const customColorRaw = domElements.inputs.customColor?.value;
		const limitDarkChkbx = domElements.inputs.limitDarkChkbx;
		const limitGrayChkbx = domElements.inputs.limitGrayChkbx;
		const limitLightChkbx = domElements.inputs.limitLightChkbx;

		if (
			swatchGenNumber === null ||
			paletteType === null ||
			limitDarkChkbx === null ||
			limitGrayChkbx === null ||
			limitLightChkbx === null
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
				`numBoxes: ${parseInt(swatchGenNumber.value, 10)}\npaletteType: ${parseInt(paletteType.value, 10)}`,
				`${thisModule} > ${thisMethod}`
			);

		return {
			swatches: parseInt(swatchGenNumber.value, 10),
			type: parseInt(paletteType.value, 10),
			customColor: customColorRaw
				? (coreUtils.base.parseCustomColor(
						customColorRaw
					) as HSL | null)
				: null,
			limitDark: limitDarkChkbx.checked,
			limitGray: limitGrayChkbx.checked,
			limitLight: limitLightChkbx.checked
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
		getPaletteGenerationArgs,
		switchColorSpace
	}
} as const;
