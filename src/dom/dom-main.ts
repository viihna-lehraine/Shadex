import * as types from '../index';
import { guards } from '../utils/type-guards';
import { convert } from '../color-conversion/conversion-index';
import { paletteHelpers } from '../helpers/palette';
import { random } from '../utils/color-randomizer';
import { domHelpers } from '../helpers/dom';
import { genAllColorValues } from '../color-conversion/conversion';
import { colorToColorObject, createColorObjectData } from '../utils/transforms';
import { getConversionFn } from '../color-conversion/conversion';

export function applyFirstColorToUI(
	initialColorSpace: types.ColorSpace
): types.ColorData {
	const color = random.getRandomColorBySpace(initialColorSpace);
	const colorBox1 = document.getElementById('color-box-1');

	if (colorBox1) {
		let colorString: string;

		if (guards.isCMYK(color)) {
			colorString = `cmyk(${color.cyan}, ${color.magenta}, ${color.yellow}, ${color.key})`;
		} else if (guards.isHex(color)) {
			colorString = color.hex;
		} else if (guards.isRGB(color)) {
			colorString = `rgb(${color.red}, ${color.green}, ${color.blue})`;
		} else if (guards.isHSL(color)) {
			colorString = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
		} else if (guards.isHSV(color)) {
			colorString = `hsv(${color.hue}, ${color.saturation}%, ${color.value}%)`;
		} else if (guards.isLAB(color)) {
			colorString = `lab(${color.l}, ${color.a}, ${color.b})`;
		} else {
			console.error('Unexpected color format');
			return color;
		}

		colorBox1.style.backgroundColor = colorString;
		if (color.format === 'hsl') {
			populateColorTextOutputBox(color, 1);
		} else {
			console.error(
				'Logic not yet implemented fpr cases where intiialColorSpace !== hsl!'
			);
		}
	} else {
		console.error('color-box-1 is null');
	}

	return color;
}

export function genPaletteBox(
	numBoxes: number,
	colors: types.ColorData[]
): void {
	const paletteRow = document.getElementById('palette-row');

	if (!paletteRow) {
		console.error('paletteRow is undefined');
		return;
	}

	paletteRow.innerHTML = '';
	let paletteBoxCount = 1;

	for (let i = 0; i < numBoxes; i++) {
		const colorData = colors[i];

		if (!colorData) {
			console.warn(`Color at index ${i} is undefined.`);
			continue;
		}

		const colorObject = colorToColorObject(colorData);

		if (!colorObject) {
			console.warn(`Skipping invalid color data at index ${i}.`);
			continue;
		}

		const colorValues = genAllColorValues(colorObject);
		const originalColorFormat =
			colorObject.format as types.ColorSpaceFormats;

		if (!guards.isColorFormat(originalColorFormat)) {
			console.warn(
				`Skipping unsupported color format: ${originalColorFormat}`
			);
			continue;
		}

		const originalColorValue = colorValues[originalColorFormat];

		if (!originalColorValue) {
			throw new Error(
				`Failed to generate color data for format ${originalColorFormat}`
			);
		}

		const colorObjectData: types.ColorObjectData = createColorObjectData(
			originalColorFormat,
			originalColorValue
		);
		const { colorStripe, paletteBoxCount: newPaletteBoxCount } =
			domHelpers.makePaletteBox(colorObjectData, paletteBoxCount);

		paletteRow.appendChild(colorStripe);

		if (guards.isHSL(colorData)) {
			populateColorTextOutputBox(colorData, paletteBoxCount);
		} else {
			console.warn(`Skipping non-HSL color at index ${i}.`);
		}

		paletteBoxCount = newPaletteBoxCount;
	}
}

export function populateColorTextOutputBox(
	hsl: types.HSL,
	boxNumber: number
): void {
	const colorTextOutputBox = document.getElementById(
		`color-text-output-box-${boxNumber}`
	) as HTMLInputElement | null;

	if (colorTextOutputBox) {
		const hexColor = convert.hslToHex(hsl);
		colorTextOutputBox.value = hexColor.hex;
	}
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
	const customHex: types.Hex = { hex: customHexBase, format: 'hex' };

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

export function convertColors(targetFormat: types.ColorSpaceFormats): void {
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
		) as types.ColorSpaceFormats;

		if (
			!guards.isColorFormat(currentFormat) ||
			!guards.isColorFormat(targetFormat)
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

		const newColor = convertFn(colorValues as types.ColorData);
		if (!newColor) {
			console.error(`Conversion to ${targetFormat} failed.`);
			return;
		}

		inputBox.value = String(newColor);
		inputBox.setAttribute('data-format', targetFormat);
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
	const customColor: types.CustomColor = domHelpers.parseCustomColor(
		initialColorSpace,
		customColorRaw
	);

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
		initialColorSpace: space
	} = getGenerateButtonParams();

	if (!paletteType || !numBoxes) {
		console.error('paletteType and/or numBoxes are undefined');
		return;
	}

	const initialColorSpace: types.ColorSpace = space ?? 'hex';

	paletteHelpers.startPaletteGen(paletteType, numBoxes, initialColorSpace);
}
