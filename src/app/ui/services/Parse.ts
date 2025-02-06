// File: app/ui/services/Parse.js

import {
	AppUtilsInterface,
	CommonFn_MasterInterface,
	Hex,
	HSL,
	ParsingService_ClassInterface,
	RGB
} from '../../../types/index.js';
import { appUtils } from '../../appUtils.js';
import { commonFn } from '../../../common/index.js';
import { configData as config } from '../../../data/config.js';

export class ParseService implements ParsingService_ClassInterface {
	private static instance: ParsingService | null = null;

	private appUtils: AppUtilsInterface;
	private brand: CommonFn_MasterInterface['core']['brand'];

	private regex = config.regex.dom;

	constructor() {
		this.appUtils = appUtils;
		this.brand = commonFn.core.brand;
	}

	public static async getInstance() {
		if (!this.instance) {
			this.instance = new ParsingService();
		}

		return this.instance;
	}

	public parseCheckbox(id: string): boolean | void {
		const checkbox = document.getElementById(id) as HTMLInputElement | null;

		if (!checkbox) {
			this.appUtils.log(
				'warn',
				`Checkbox element ${id} not found`,
				'ParsingService.parseCheckbox()',
				1
			);
		}

		return checkbox ? checkbox.checked : undefined;
	}

	public parseColorInput(input: HTMLInputElement): Hex | HSL | RGB | null {
		const colorStr = input.value.trim().toLowerCase();
		const hexMatch = colorStr.match(this.regex.hex);
		const hslMatch = colorStr.match(this.regex.hsl);
		const rgbMatch = colorStr.match(this.regex.rgb);

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
				value: { hex: this.brand.asHexSet(`#${hex}`) }
			};
		}

		if (hslMatch) {
			return {
				format: 'hsl',
				value: {
					hue: this.brand.asRadial(parseInt(hslMatch[1], 10)),
					saturation: this.brand.asPercentile(
						parseFloat(hslMatch[2])
					),
					lightness: this.brand.asPercentile(parseFloat(hslMatch[3]))
				}
			};
		}

		if (rgbMatch) {
			return {
				format: 'rgb',
				value: {
					red: this.brand.asByteRange(parseInt(rgbMatch[1], 10)),
					green: this.brand.asByteRange(parseInt(rgbMatch[2], 10)),
					blue: this.brand.asByteRange(parseInt(rgbMatch[3], 10))
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
							red: this.brand.asByteRange(rgb[0]),
							green: this.brand.asByteRange(rgb[1]),
							blue: this.brand.asByteRange(rgb[2])
						}
					};
				}
			}
		}

		this.appUtils.log(
			'warn',
			`Invalid color input: ${colorStr}`,
			'ParsingService.parseColorInput()',
			1
		);

		return null;
	}

	public parseDropdownSelection(
		id: string,
		validOptions: string[]
	): string | void {
		const dropdown = document.getElementById(
			id
		) as HTMLSelectElement | null;

		if (!dropdown) return;

		const selectedValue = dropdown.value;

		if (!validOptions.includes(selectedValue)) {
			this.appUtils.log(
				'warn',
				`Invalid selection in ${id}: "${selectedValue}" is not one of ${validOptions.join(
					', '
				)}`,
				'ParsingService.parseDropdownSelection()',
				1
			);
		}

		return validOptions.includes(selectedValue) ? selectedValue : undefined;
	}

	public parseNumberInput(
		input: HTMLInputElement,
		min?: number,
		max?: number
	): number | null {
		const value = parseFloat(input.value.trim());

		if (isNaN(value)) {
			this.appUtils.log(
				'warn',
				`Invalid number input: ${input.value}`,
				'ParsingService.parseNumberInput()',
				1
			);
		}

		if (isNaN(value)) return null;

		if (min !== undefined && value < min) return min;
		if (max !== undefined && value > max) return max;

		return value;
	}

	public parsePaletteExportFormat(): string | void {
		return this.parseDropdownSelection('export-format', [
			'CSS',
			'JSON',
			'XML'
		]);
	}

	public parseTextInput(
		input: HTMLInputElement,
		regex?: RegExp
	): string | null {
		const text = input.value.trim();

		if (regex && !regex.test(text)) {
			this.appUtils.log(
				'warn',
				`Invalid text input: ${text}`,
				'ParsingService.parseTextInput()',
				1
			);

			return null;
		}

		return text || null;
	}
}
