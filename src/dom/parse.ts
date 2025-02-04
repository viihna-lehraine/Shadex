// File: dom/parse.js

import { DOMFn_MasterInterface, Hex, HSL, RGB } from '../types/index.js';
import { createLogger } from '../logger/index.js';
import { commonFn } from '../common/index.js';
import { configData as config } from '../data/config.js';
import { domData } from '../data/dom.js';
import { modeData as mode } from '../data/mode.js';

const ids = domData.ids.static;
const logMode = mode.logging;
const regex = config.regex.dom;

const thisModule = 'dom/parse.js';

const brand = commonFn.core.brand;

const logger = await createLogger();

function checkbox(id: string): boolean | void {
	const thisFunction = 'checkbox()';
	const checkbox = document.getElementById(id) as HTMLInputElement;

	if (!checkbox) {
		if (logMode.error && !mode.quiet) {
			logger.error(
				`Checkbox element ${id} not found`,
				`${thisModule} > ${thisFunction}`
			);
		}

		return;
	}

	if (!(checkbox instanceof HTMLInputElement)) {
		if (logMode.error && !mode.quiet) {
			logger.error(
				`Element ${id} is not a checkbox`,
				`${thisModule} > ${thisFunction}`
			);
		}

		return;
	}

	return checkbox ? checkbox.checked : undefined;
}

function colorInput(input: HTMLInputElement): Hex | HSL | RGB | null {
	const thisFunction = 'colorInput()';

	const colorStr = input.value.trim().toLowerCase();

	const hexMatch = colorStr.match(regex.hex);
	const hslMatch = colorStr.match(regex.hsl);
	const rgbMatch = colorStr.match(regex.rgb);

	if (hexMatch) {
		let hex = hexMatch[1];
		if (hex.length === 3) {
			hex = hex
				.split('')
				.map(c => c + c)
				.join('');
		}
		return {
			format: 'hex',
			value: { hex: brand.asHexSet(`#${hex}`) }
		};
	}

	if (hslMatch) {
		return {
			format: 'hsl',
			value: {
				hue: brand.asRadial(parseInt(hslMatch[1], 10)),
				saturation: brand.asPercentile(parseFloat(hslMatch[2])),
				lightness: brand.asPercentile(parseFloat(hslMatch[3]))
			}
		};
	}

	if (rgbMatch) {
		return {
			format: 'rgb',
			value: {
				red: brand.asByteRange(parseInt(rgbMatch[1], 10)),
				green: brand.asByteRange(parseInt(rgbMatch[2], 10)),
				blue: brand.asByteRange(parseInt(rgbMatch[3], 10))
			}
		};
	}

	// for Named Colors (convert to RGB using CSS canvas)
	const testElement = document.createElement('div');

	testElement.style.color = colorStr;

	if (testElement.style.color !== '') {
		const ctx = document.createElement('canvas').getContext('2d');

		if (ctx) {
			ctx.fillStyle = colorStr;

			const rgb = ctx.fillStyle.match(/\d+/g)?.map(Number);

			if (rgb && rgb.length === 3) {
				return {
					format: 'rgb',
					value: {
						red: brand.asByteRange(rgb[0]),
						green: brand.asByteRange(rgb[1]),
						blue: brand.asByteRange(rgb[2])
					}
				};
			}
		}
	}

	if (!mode.quiet && logMode.error && logMode.verbosity > 1) {
		logger.error('Invalid color input', `${thisModule} > ${thisFunction}`);
	}

	return null;
}

function paletteExportFormat(): string | void {
	const thisFunction = 'paletteExportFormat()';
	const formatSelectionMenu = document.getElementById(
		ids.selects.exportFormatOption
	) as HTMLSelectElement;

	if (!formatSelectionMenu) {
		if (logMode.error && !mode.quiet)
			logger.error(
				'Export format selection dropdown not found',
				`${thisModule} > ${thisFunction}`
			);
	}

	const selectedFormat = formatSelectionMenu.value;

	if (
		selectedFormat !== 'CSS' &&
		selectedFormat !== 'JSON' &&
		selectedFormat !== 'XML'
	) {
		if (logMode.error && !mode.quiet)
			logger.error(
				'Invalid export format selected',
				`${thisModule} > ${thisFunction}`
			);

		return;
	} else {
		return selectedFormat;
	}
}

export const parse: DOMFn_MasterInterface['parse'] = {
	checkbox,
	colorInput,
	paletteExportFormat
};
