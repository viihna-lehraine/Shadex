// File: app/ui/domUtils.js

import {
	ColorInputElement,
	ColorSpace,
	DOMUtilsInterface
} from '../../types/index.js';
import { createLogger } from '../../logger/factory.js';
import { commonFn } from '../../common/index.js';
import { modeData as mode } from '../../data/mode.js';

const logMode = mode.logging;

const thisModule = 'app/ui/domUtils.js';

const appUtils = commonFn.utils;
const coreUtils = commonFn.core;

const logger = await createLogger();

// 1. BASE DOM UTILITIES

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

				continue;
			}

			const currentFormat = inputBox.getAttribute(
				'data-format'
			) as ColorSpace;

			if (logMode.debug && logMode.verbosity >= 2)
				logger.debug(
					`Converting from ${currentFormat} to ${targetFormat}`,
					`${thisModule} > ${thisMethod}`
				);

			const convertFn = appUtils.conversion.getConversionFn(
				currentFormat,
				targetFormat
			);

			if (!convertFn) {
				if (logMode.error)
					logger.error(
						`Conversion from ${currentFormat} to ${targetFormat} is not supported.`,
						`${thisModule} > ${thisMethod}`
					);

				continue;
			}

			if (colorValues.format === 'xyz') {
				if (logMode.error)
					logger.error(
						'Cannot convert from XYZ to another color space.',
						`${thisModule} > ${thisMethod}`
					);

				continue;
			}

			const clonedColor = await appUtils.color.narrowToColor(colorValues);

			if (
				!clonedColor ||
				appUtils.color.isSLColor(clonedColor) ||
				appUtils.color.isSVColor(clonedColor) ||
				appUtils.color.isXYZ(clonedColor)
			) {
				if (logMode.verbosity >= 3 && logMode.error)
					logger.error(
						'Cannot convert from SL, SV, or XYZ color spaces. Please convert to a supported format first.',
						`${thisModule} > ${thisMethod}`
					);

				continue;
			}

			if (!clonedColor) {
				if (logMode.error)
					logger.error(
						`Conversion to ${targetFormat} failed.`,
						`${thisModule} > ${thisMethod}`
					);

				continue;
			}

			const newColor = coreUtils.base.clone(convertFn(clonedColor));

			if (!newColor) {
				if (logMode.error)
					logger.error(
						`Conversion to ${targetFormat} failed.`,
						`${thisModule} > ${thisMethod}`
					);

				continue;
			}

			inputBox.value = String(newColor);

			inputBox.setAttribute('data-format', targetFormat);
		}
	} catch (error) {
		if (logMode.warn)
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

// 2. EVENT UTILITIES

export function addEventListener<K extends keyof HTMLElementEventMap>(
	id: string,
	eventType: K,
	callback: (ev: HTMLElementEventMap[K]) => void
): void {
	const thisFunction = 'addEventListener()';
	const element = document.getElementById(id);

	if (element) {
		element.addEventListener(eventType, callback);
	} else if (logMode.warn) {
		if (mode.debug && logMode.warn && logMode.verbosity > 2)
			logger.warn(
				`Element with id "${id}" not found.`,
				`${thisModule} > ${thisFunction}`
			);
	}
}

export const addConversionListener = (id: string, colorSpace: string) => {
	const thisFunction = 'addConversionListener()';

	const btn = document.getElementById(id) as HTMLButtonElement | null;

	if (btn) {
		if (coreUtils.guards.isColorSpace(colorSpace)) {
			btn.addEventListener('click', () =>
				switchColorSpace(colorSpace as ColorSpace)
			);
		} else {
			if (logMode.warn) {
				logger.warn(
					`Invalid color space provided: ${colorSpace}`,
					`${thisModule} > ${thisFunction}`
				);
			}
		}
	} else {
		if (logMode.warn)
			logger.warn(
				`Element with id "${id}" not found.`,
				`${thisModule} > ${thisFunction}`
			);
	}
};

// 3. FILE UTILS

function downloadFile(data: string, filename: string, type: string): void {
	const blob = new Blob([data], { type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');

	a.href = url;
	a.download = filename;
	a.click();

	URL.revokeObjectURL(url);
}

function readFile(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(reader.error);

		reader.readAsText(file);
	});
}

export const domUtils: DOMUtilsInterface = {
	addConversionListener,
	addEventListener,
	downloadFile,
	readFile,
	switchColorSpace
};
