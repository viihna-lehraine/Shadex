import * as types from '../index';
import { guards } from '../utils/type-guards';
import { convert } from '../color-conversion/conversion-index';
import { random } from '../utils/color-randomizer';
import { parseCustomColor } from '../utils/transforms';
import { getConversionFn } from '../color-conversion/conversion';
import { startPaletteGen } from '../palette-gen/generate';

export function applyFirstColorToUI(
	initialColorSpace: types.ColorSpace
): types.Color {
	const color = random.randomColor(initialColorSpace);
	const colorBox1 = document.getElementById('color-box-1');

	if (colorBox1) {
		let colorString: string;

		if (guards.isCMYK(color)) {
			colorString = `cmyk(${color.value.cyan}, ${color.value.magenta}, ${color.value.yellow}, ${color.value.key})`;
		} else if (guards.isHex(color)) {
			colorString = color.value.hex;
		} else if (guards.isRGB(color)) {
			colorString = `rgb(${color.value.red}, ${color.value.green}, ${color.value.blue})`;
		} else if (guards.isHSL(color)) {
			colorString = `hsl(${color.value.hue}, ${color.value.saturation}%, ${color.value.lightness}%)`;
		} else if (guards.isHSV(color)) {
			colorString = `hsv(${color.value.hue}, ${color.value.saturation}%, ${color.value.value}%)`;
		} else if (guards.isLAB(color)) {
			colorString = `lab(${color.value.l}, ${color.value.a}, ${color.value.b})`;
		} else {
			console.error('Unexpected color format');
			return color;
		}

		colorBox1.style.backgroundColor = colorString;
		if (color.format === 'hsl') {
			populateColorTextOutputBox(color, 1);
		} else {
			console.error(
				'Logic not yet implemented for cases where intiialColorSpace !== hsl!'
			);
		}
	} else {
		console.error('color-box-1 is null');
	}

	return color;
}

export function populateColorTextOutputBox(
	color: Exclude<types.Color, types.XYZ>,
	boxNumber: number
): void {
	const colorTextOutputBox = document.getElementById(
		`color-text-output-box-${boxNumber}`
	) as HTMLInputElement | null;

	if (!colorTextOutputBox) return;

	// convert color to Hex for display purposes
	let hexColor: types.Hex | null = null;

	if (color.format === 'cmyk') {
		hexColor = convert.cmykToHex(color as types.CMYK);
	} else if (color.format === 'hex') {
		hexColor = color;
	} else if (color.format === 'hsl') {
		hexColor = convert.hslToHex(color as types.HSL);
	} else if (color.format === 'hsv') {
		hexColor = convert.hsvToHex(color as types.HSV);
	} else if (color.format === 'lab') {
		hexColor = convert.labToHex(color as types.LAB);
	} else if (color.format === 'rgb') {
		hexColor = convert.rgbToHex(color as types.RGB);
	} else {
		console.error('Unexpected color format');
		return;
	}

	console.log(`Hex color alue: ${hexColor.value.hex}`);

	colorTextOutputBox.value = hexColor.value.hex;
	colorTextOutputBox.setAttribute('data-format', 'hex');
}

export function getElementsForSelectedColor(
	selectedColor: number
): types.GetElementsForSelectedColor {
	return {
		selectedColorTextOutputBox: document.getElementById(
			`color-text-output-box-${selectedColor}`
		),
		selectedColorBox: document.getElementById(`color-box-${selectedColor}`),
		selectedColorStripe: document.getElementById(
			`color-stripe-${selectedColor}`
		)
	};
}

// *DEV NOTE: add saturation logic and function type
export function saturateColor(selectedColor: number) {
	getElementsForSelectedColor(selectedColor);
}

// *DEV NOTE: add desaturation logic and function type
export function desaturateColor(selectedColor: number) {
	getElementsForSelectedColor(selectedColor);
}

export function showTooltip(tooltipElement: HTMLElement): void {
	const tooltip = tooltipElement.querySelector<HTMLElement>('.tooltiptext');
	if (tooltip) {
		tooltip.style.visibility = 'visible';
		tooltip.style.opacity = '1';
		setTimeout(() => {
			tooltip.style.visibility = 'hidden';
			tooltip.style.opacity = '0';
		}, 1000);
	}

	console.log('execution of showTooltip complete');
}

export function showCustomColorPopupDiv(): void {
	const popup = document.getElementById('popup-div');

	if (popup) {
		popup.classList.toggle('show');
	} else {
		console.error("document.getElementById('popup-div') is undefined");
		return;
	}
}

export function applyCustomColor(): types.HSL {
	const customHexBase = (
		document.getElementById('custom-color-picker') as HTMLInputElement
	).value;
	const customHex: types.Hex = {
		value: { hex: customHexBase },
		format: 'hex'
	};

	if (!guards.isHexColor(customHexBase)) {
		throw new Error('Invalid hex color');
	}

	const customHSL = convert.hexToHSL(customHex);

	return customHSL;
}

export function applyInitialColorSpace(): types.ColorSpace {
	const initialColorSpaceValue = (
		document.getElementById(
			'initial-colorspace-options'
		) as HTMLSelectElement
	).value;

	return guards.isColorSpace(initialColorSpaceValue)
		? initialColorSpaceValue
		: 'hex';
}

export function copyToClipboard(
	text: string,
	tooltipElement: HTMLElement
): void {
	const colorValue = text.replace('Copied to clipboard!', '').trim();

	navigator.clipboard
		.writeText(colorValue)
		.then(() => {
			showTooltip(tooltipElement);
			console.log(`Copied color value: ${colorValue}`);
		})
		.catch(err => {
			console.error('Error copying to clipboard:', err);
		});
}

export function convertColors(targetFormat: types.ColorSpace): void {
	const colorTextOutputBoxes = document.querySelectorAll<HTMLInputElement>(
		'.color-text-output-box'
	);

	colorTextOutputBoxes.forEach(box => {
		if (!(box instanceof HTMLInputElement)) {
			console.error('Invalid input element.');
			return;
		}

		const inputBox = box as types.ColorInputElement;
		const colorValues = inputBox.colorValues;

		if (!colorValues) {
			console.error('Missing color values.');
			return;
		}

		const currentFormat = inputBox.getAttribute(
			'data-format'
		) as types.ColorSpace;

		if (
			!guards.isColorSpace(currentFormat) ||
			!guards.isColorSpace(targetFormat)
		) {
			console.error(
				`Invalid format: ${currentFormat} or ${targetFormat}`
			);
			return;
		}

		const convertFn = getConversionFn(currentFormat, targetFormat);
		if (!convertFn) {
			console.error(
				`Conversion from ${currentFormat} to ${targetFormat} is not supported.`
			);
			return;
		}

		if (guards.isConvertibleColor(colorValues)) {
			const newColor = convertFn(colorValues);
			if (!newColor) {
				console.error(`Conversion to ${targetFormat} failed.`);
				return;
			}

			inputBox.value = String(newColor);
			inputBox.setAttribute('data-format', targetFormat);
		} else {
			console.error(`Invalid color type for conversion.`);
		}
	});
}

export function getGenerateButtonParams(): types.GenButtonParams {
	const paletteTypeOptions = document.getElementById(
		'palette-type-options'
	) as HTMLSelectElement;
	const paletteNumberOptions = document.getElementById(
		'palette-number-options'
	) as HTMLInputElement;
	const colorSpaceValue = (
		document.getElementById(
			'initial-colorspace-options'
		) as HTMLSelectElement
	)?.value;
	const initialColorSpace: types.ColorSpace = guards.isColorSpace(
		colorSpaceValue
	)
		? colorSpaceValue
		: 'hex';
	const customColorRaw = (
		document.getElementById('custom-color') as HTMLInputElement
	)?.value;
	const customColor = parseCustomColor(initialColorSpace, customColorRaw);

	return {
		numBoxes: parseInt(paletteNumberOptions.value, 10),
		paletteType: parseInt(paletteTypeOptions.value, 10),
		initialColorSpace,
		customColor
	};
}

export function handleGenButtonClick(): void {
	const {
		paletteType,
		numBoxes,
		initialColorSpace: space,
		customColor
	} = getGenerateButtonParams();

	if (!paletteType || !numBoxes) {
		console.error('paletteType and/or numBoxes are undefined');
		return;
	}

	const initialColorSpace: types.ColorSpace = space ?? 'hex';

	startPaletteGen(paletteType, numBoxes, initialColorSpace, customColor);
}
