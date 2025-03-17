import {
	Color,
	Helpers,
	SetsData,
	Services,
	ValidationUtilities
} from '../../types/index.js';
import { regex, sets } from '../../config/index.js';

export function validationUtilitiesFactory(
	helpers: Helpers,
	services: Services
): ValidationUtilities {
	const {
		data: { deepClone }
	} = helpers;
	const { errors } = services;

	function colorInput(color: string): boolean {
		return errors.handleSync(() => {
			if (typeof color !== 'string' || !color.trim()) {
				return false;
			}

			const normalizedColor = color.trim().toLowerCase();

			return (
				regex.userInput.hex.test(normalizedColor) ||
				regex.userInput.hsl.test(normalizedColor) ||
				regex.userInput.rgb.test(normalizedColor)
			);
		}, `Error occurred while validating color input from DOM: ${color}`);
	}

	function colorValue(color: Color): boolean {
		return errors.handleSync(
			() => {
				const clonedColor = deepClone(color);

				const isNumericValid = (value: unknown): boolean =>
					typeof value === 'number' && !isNaN(value);
				const normalizePercentage = (
					value: string | number
				): number => {
					if (typeof value === 'string' && value.endsWith('%')) {
						return parseFloat(value.slice(0, -1));
					}

					return typeof value === 'number' ? value : NaN;
				};

				switch (clonedColor.format) {
					case 'cmyk':
						return (
							[
								clonedColor.value.cyan,
								clonedColor.value.magenta,
								clonedColor.value.yellow,
								clonedColor.value.key
							].every(isNumericValid) &&
							clonedColor.value.cyan >= 0 &&
							clonedColor.value.cyan <= 100 &&
							clonedColor.value.magenta >= 0 &&
							clonedColor.value.magenta <= 100 &&
							clonedColor.value.yellow >= 0 &&
							clonedColor.value.yellow <= 100 &&
							clonedColor.value.key >= 0 &&
							clonedColor.value.key <= 100
						);
					case 'hex':
						return regex.validation.hex.test(clonedColor.value.hex);
					case 'hsl':
						const isValidHSLHue =
							isNumericValid(clonedColor.value.hue) &&
							clonedColor.value.hue >= 0 &&
							clonedColor.value.hue <= 360;
						const isValidHSLSaturation =
							normalizePercentage(clonedColor.value.saturation) >=
								0 &&
							normalizePercentage(clonedColor.value.saturation) <=
								100;
						const isValidHSLLightness = clonedColor.value.lightness
							? normalizePercentage(
									clonedColor.value.lightness
								) >= 0 &&
								normalizePercentage(
									clonedColor.value.lightness
								) <= 100
							: true;

						return (
							isValidHSLHue &&
							isValidHSLSaturation &&
							isValidHSLLightness
						);
					case 'rgb':
						return (
							[
								clonedColor.value.red,
								clonedColor.value.green,
								clonedColor.value.blue
							].every(isNumericValid) &&
							clonedColor.value.red >= 0 &&
							clonedColor.value.red <= 255 &&
							clonedColor.value.green >= 0 &&
							clonedColor.value.green <= 255 &&
							clonedColor.value.blue >= 0 &&
							clonedColor.value.blue <= 255
						);
					default:
						console.error(
							`Unsupported color format: ${color.format}`
						);

						return false;
				}
			},
			`Error occurred while validating color value: ${JSON.stringify(color)}`
		);
	}

	function ensureHash(value: string): string {
		return errors.handleSync(() => {
			return value.startsWith('#') ? value : `#${value}`;
		}, `Error occurred while ensuring hash for value: ${value}`);
	}

	function hex(value: string, pattern: RegExp): boolean {
		return errors.handleSync(() => {
			return pattern.test(value);
		}, `Error occurred while validating hex value: ${value}`);
	}

	function hexComponent(value: string): boolean {
		return errors.handleSync(() => {
			return hex(value, regex.validation.hexComponent);
		}, `Error occurred while validating hex component: ${value}`);
	}

	function hexSet(value: string): boolean {
		return errors.handleSync(() => {
			return regex.validation.hex.test(value);
		}, `Error occurred while validating hex set: ${value}`);
	}

	function range<T extends keyof SetsData>(
		value: number | string,
		rangeKey: T
	): void {
		return errors.handleSync(
			() => {
				if (rangeKey === 'HexSet') {
					if (!hexSet(value as string)) {
						throw new Error(
							`Invalid value for ${String(rangeKey)}: ${value}`
						);
					}
					return;
				}

				if (
					typeof value === 'number' &&
					Array.isArray(sets[rangeKey])
				) {
					const [min, max] = sets[rangeKey] as [number, number];

					if (value < min || value > max) {
						throw new Error(
							`Value ${value} is out of range for ${String(rangeKey)} [${min}, ${max}]`
						);
					}
					return;
				}

				throw new Error(
					`Invalid range or value for ${String(rangeKey)}`
				);
			},
			`Error occurred while validating range for ${String(rangeKey)}: ${value}`
		);
	}

	const validationUtilities: ValidationUtilities = {
		colorInput,
		colorValue,
		ensureHash,
		hex,
		hexComponent,
		hexSet,
		range
	};

	return errors.handleSync(
		() => validationUtilities,
		'Error occurred while creating validation utilities group.'
	);
}
