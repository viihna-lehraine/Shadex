import {
	BrandingUtilities,
	DOMParsingUtilities,
	Hex,
	HSL,
	RGB,
	Services
} from '../../../../types/index.js';
import { regex } from '../../../../config/index.js';

export function domParsingUtilitiesFactory(
	brand: BrandingUtilities,
	services: Services
): DOMParsingUtilities {
	const { errors, log } = services;

	function parseCheckbox(id: string): boolean | void {
		return errors.handleSync(() => {
			const checkbox = document.getElementById(
				id
			) as HTMLInputElement | null;

			return checkbox ? checkbox.checked : undefined;
		}, 'Error occurred while parsing checkbox.');
	}

	function parseColorInput(input: HTMLInputElement): Hex | HSL | RGB | null {
		return errors.handleSync(() => {
			const colorStr = input.value.trim().toLowerCase();
			const hexMatch = colorStr.match(regex.dom.hex);
			const hslMatch = colorStr.match(regex.dom.hsl);
			const rgbMatch = colorStr.match(regex.dom.rgb);

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
								red: brand.asByteRange(rgb[0]),
								green: brand.asByteRange(rgb[1]),
								blue: brand.asByteRange(rgb[2])
							}
						};
					}
				}
			}

			log.info(`Invalid color input: ${colorStr}`, `parseColorInput`);

			return null;
		}, 'Error occurred while parsing color input.');
	}

	function parseDropdownSelection(
		id: string,
		validOptions: string[]
	): string | void {
		return errors.handleSync(() => {
			const dropdown = document.getElementById(
				id
			) as HTMLSelectElement | null;

			if (!dropdown) return;

			const selectedValue = dropdown.value;

			if (!validOptions.includes(selectedValue)) {
				return validOptions.includes(selectedValue)
					? selectedValue
					: undefined;
			}

			return;
		}, 'Error occurred while parsing dropdown selection.');
	}

	function parseNumberInput(
		input: HTMLInputElement,
		min?: number,
		max?: number
	): number | null {
		return errors.handleSync(() => {
			const value = parseFloat(input.value.trim());

			if (isNaN(value)) return null;

			if (min !== undefined && value < min) return min;
			if (max !== undefined && value > max) return max;

			return value;
		}, 'Error occurred while parsing number input.');
	}

	function parseTextInput(
		input: HTMLInputElement,
		regex?: RegExp
	): string | null {
		return errors.handleSync(() => {
			const text = input.value.trim();

			if (regex && !regex.test(text)) {
				return null;
			}

			return text || null;
		}, 'Error occurred while parsing text input.');
	}

	const domParsingUtilities: DOMParsingUtilities = {
		parseCheckbox,
		parseColorInput,
		parseDropdownSelection,
		parseNumberInput,
		parseTextInput
	};

	return errors.handleSync(
		() => domParsingUtilities,
		'Error occurred while creating DOM parsing utilities group.'
	);
}
