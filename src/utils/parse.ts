// File: utils/parse.js

import {
	Hex,
	HSL,
	ParseUtilsInterface,
	RGB,
	ServicesInterface,
	UtilitiesInterface
} from '../types/index.js';
import { configData as config } from '../data/config.js';

const regex = config.regex.dom;

export function checkbox(
	id: string,
	services: ServicesInterface
): boolean | void {
	const log = services.app.log;

	const checkbox = document.getElementById(id) as HTMLInputElement | null;

	if (!checkbox) {
		log(
			'warn',
			`Checkbox element ${id} not found`,
			'parse > checkbox()',
			1
		);
	}

	return checkbox ? checkbox.checked : undefined;
}
export function colorInput(
	input: HTMLInputElement,
	services: ServicesInterface,
	utils: UtilitiesInterface
): Hex | HSL | RGB | null {
	const log = services.app.log;

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
			value: { hex: utils.brand.asHexSet(`#${hex}`, utils) }
		};
	}

	if (hslMatch) {
		return {
			format: 'hsl',
			value: {
				hue: utils.brand.asRadial(parseInt(hslMatch[1], 10), utils),
				saturation: utils.brand.asPercentile(
					parseFloat(hslMatch[2]),
					utils
				),
				lightness: utils.brand.asPercentile(
					parseFloat(hslMatch[3]),
					utils
				)
			}
		};
	}

	if (rgbMatch) {
		return {
			format: 'rgb',
			value: {
				red: utils.brand.asByteRange(parseInt(rgbMatch[1], 10), utils),
				green: utils.brand.asByteRange(
					parseInt(rgbMatch[2], 10),
					utils
				),
				blue: utils.brand.asByteRange(parseInt(rgbMatch[3], 10), utils)
			}
		};
	}

	// handle named colors
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
						red: utils.brand.asByteRange(rgb[0], utils),
						green: utils.brand.asByteRange(rgb[1], utils),
						blue: utils.brand.asByteRange(rgb[2], utils)
					}
				};
			}
		}
	}

	log('warn', `Invalid color input: ${colorStr}`, 'parse > colorInput()', 1);

	return null;
}

export function dropdownSelection(
	id: string,
	validOptions: string[],
	services: ServicesInterface
): string | void {
	const log = services.app.log;

	const dropdown = document.getElementById(id) as HTMLSelectElement | null;

	if (!dropdown) return;

	const selectedValue = dropdown.value;

	if (!validOptions.includes(selectedValue)) {
		log(
			'warn',
			`Invalid selection in ${id}: "${selectedValue}" is not one of ${validOptions.join(
				', '
			)}`,
			'parse > dropdownSelection()',
			1
		);
	}

	return validOptions.includes(selectedValue) ? selectedValue : undefined;
}

export function numberInput(
	input: HTMLInputElement,
	services: ServicesInterface,
	min?: number,
	max?: number
): number | null {
	const log = services.app.log;

	const value = parseFloat(input.value.trim());

	if (isNaN(value)) {
		log(
			'warn',
			`Invalid number input: ${input.value}`,
			'parseUtils > numberInput()',
			1
		);
	}

	if (isNaN(value)) return null;

	if (min !== undefined && value < min) return min;
	if (max !== undefined && value > max) return max;

	return value;
}

function textInput(
	input: HTMLInputElement,
	services: ServicesInterface,
	regex?: RegExp
): string | null {
	const log = services.app.log;

	const text = input.value.trim();

	if (regex && !regex.test(text)) {
		log(
			'warn',
			`Invalid text input: ${text}`,
			'parseUtils > textInput()',
			1
		);

		return null;
	}

	return text || null;
}

export const parseUtils: ParseUtilsInterface = {
	checkbox,
	colorInput,
	dropdownSelection,
	numberInput,
	textInput
};
