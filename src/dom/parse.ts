// File: dom/parse.js

import {
	AppServicesInterface,
	BrandingUtilsInterface,
	Hex,
	HSL,
	RGB,
	ValidationUtilsInterface
} from '../types/index.js';
import { configData as config } from '../data/config.js';

const regex = config.regex.dom;

export function parseCheckbox(
	id: string,
	appServices: AppServicesInterface
): boolean | void {
	const log = appServices.log;

	const checkbox = document.getElementById(id) as HTMLInputElement | null;

	if (!checkbox) {
		log(
			'warn',
			`Checkbox element ${id} not found`,
			'dom/parse > parseCheckbox()',
			1
		);
	}

	return checkbox ? checkbox.checked : undefined;
}
export function parseColorInput(
	input: HTMLInputElement,
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	validate: ValidationUtilsInterface
): Hex | HSL | RGB | null {
	const log = appServices.log;

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
			value: { hex: brand.asHexSet(`#${hex}`, validate) }
		};
	}

	if (hslMatch) {
		return {
			format: 'hsl',
			value: {
				hue: brand.asRadial(parseInt(hslMatch[1], 10), validate),
				saturation: brand.asPercentile(
					parseFloat(hslMatch[2]),
					validate
				),
				lightness: brand.asPercentile(parseFloat(hslMatch[3]), validate)
			}
		};
	}

	if (rgbMatch) {
		return {
			format: 'rgb',
			value: {
				red: brand.asByteRange(parseInt(rgbMatch[1], 10), validate),
				green: brand.asByteRange(parseInt(rgbMatch[2], 10), validate),
				blue: brand.asByteRange(parseInt(rgbMatch[3], 10), validate)
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
						red: brand.asByteRange(rgb[0], validate),
						green: brand.asByteRange(rgb[1], validate),
						blue: brand.asByteRange(rgb[2], validate)
					}
				};
			}
		}
	}

	log(
		'warn',
		`Invalid color input: ${colorStr}`,
		'dom/parse > parseColorInput()',
		1
	);

	return null;
}

export function parseDropdownSelection(
	id: string,
	validOptions: string[],
	appServices: AppServicesInterface
): string | void {
	const log = appServices.log;

	const dropdown = document.getElementById(id) as HTMLSelectElement | null;

	if (!dropdown) return;

	const selectedValue = dropdown.value;

	if (!validOptions.includes(selectedValue)) {
		log(
			'warn',
			`Invalid selection in ${id}: "${selectedValue}" is not one of ${validOptions.join(
				', '
			)}`,
			'dom/parse > parseDropdownSelection()',
			1
		);
	}

	return validOptions.includes(selectedValue) ? selectedValue : undefined;
}

export function parseNumberInput(
	input: HTMLInputElement,
	appServices: AppServicesInterface,
	min?: number,
	max?: number
): number | null {
	const log = appServices.log;

	const value = parseFloat(input.value.trim());

	if (isNaN(value)) {
		log(
			'warn',
			`Invalid number input: ${input.value}`,
			'dom/parse > parseNumberInput()',
			1
		);
	}

	if (isNaN(value)) return null;

	if (min !== undefined && value < min) return min;
	if (max !== undefined && value > max) return max;

	return value;
}

export function parseTextInput(
	input: HTMLInputElement,
	appServices: AppServicesInterface,
	regex?: RegExp
): string | null {
	const log = appServices.log;

	const text = input.value.trim();

	if (regex && !regex.test(text)) {
		log(
			'warn',
			`Invalid text input: ${text}`,
			'dom/parse > parseTextInput()',
			1
		);

		return null;
	}

	return text || null;
}
