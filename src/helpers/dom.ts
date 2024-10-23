import * as types from '../index';
import { convertColors, showTooltip } from '../dom/dom-main';
import { attachDragAndDropEventListeners } from '../dom/drag-and-drop';
import { guards } from '../utils/type-guards';

// defines buttons for the main UI
function defineUIButtons(): types.UIButtons {
	const generateButton = document.getElementById('generate-button');
	const saturateButton = document.getElementById('saturate-button');
	const desaturateButton = document.getElementById('desaturate-button');
	const popupDivButton = document.getElementById('custom-color-button');
	const applyCustomColorButton = document.getElementById(
		'apply-custom-color-button'
	);
	const clearCustomColorButton = document.getElementById(
		'clear-custom-color-button'
	);
	const advancedMenuToggleButton = document.getElementById(
		'advanced-menu-toggle-button'
	);
	const applyInitialColorSpaceButton = document.getElementById(
		'apply-initial-color-space-button'
	);
	const selectedColorOptions = document.getElementById(
		'selected-color-options'
	) as HTMLSelectElement | null;
	const selectedColor = selectedColorOptions
		? parseInt(selectedColorOptions.value, 10)
		: 0;

	return {
		generateButton,
		saturateButton,
		desaturateButton,
		popupDivButton,
		applyCustomColorButton,
		clearCustomColorButton,
		advancedMenuToggleButton,
		applyInitialColorSpaceButton,
		selectedColor
	};
}

// add conversion button event listeners
function addConversionButtonEventListeners(): void {
	const addListener = (id: string, colorSpace: types.ColorSpace) => {
		const button = document.getElementById(id) as HTMLButtonElement | null;

		if (button) {
			button.addEventListener('click', () => convertColors(colorSpace));
		} else {
			console.warn(`Element with id "${id}" not found.`);
		}
	};

	addListener('hex-conversion-button', 'hex');
	addListener('rgb-conversion-button', 'rgb');
	addListener('hsv-conversion-button', 'hsv');
	addListener('hsl-conversion-button', 'hsl');
	addListener('cmyk-conversion-button', 'cmyk');
	addListener('lab-conversion-button', 'lab');
}

function makePaletteBox(
	colorValues: types.Color,
	paletteBoxCount: number
): types.MakePaletteBox {
	const paletteBox = document.createElement('div');
	paletteBox.className = 'palette-box';
	paletteBox.id = `palette-box-${paletteBoxCount}`;

	const paletteBoxTopHalf = document.createElement('div');
	paletteBoxTopHalf.className = 'palette-box-half palette-box-top-half';
	paletteBoxTopHalf.id = `palette-box-top-half-${paletteBoxCount}`;

	const colorTextOutputBox = document.createElement(
		'input'
	) as types.ColorInputElement;
	colorTextOutputBox.type = 'text';
	colorTextOutputBox.className = 'color-text-output-box tooltip';
	colorTextOutputBox.id = `color-text-output-box-${paletteBoxCount}`;
	colorTextOutputBox.setAttribute('data-format', 'hex');

	// access nested properties safely using type guard(s)
	if (colorValues.format === 'hex' && 'value' in colorValues) {
		colorTextOutputBox.value = (colorValues as types.Hex).value.hex;
	} else {
		console.warn(`Hex value not found for palette-box #${paletteBoxCount}`);
		colorTextOutputBox.value = '';
	}

	// store color values within input element
	colorTextOutputBox.colorValues = colorValues;
	colorTextOutputBox.readOnly = false;
	colorTextOutputBox.style.cursor = 'text';

	// create copy button
	const copyButton = document.createElement('button');
	copyButton.className = 'copy-button';
	copyButton.textContent = 'Copy';

	const tooltipText = document.createElement('span');
	tooltipText.className = 'tooltiptext';
	tooltipText.textContent = 'Copied to clipboard!';

	// add clipboard functionality to copy button
	copyButton.addEventListener('click', async () => {
		try {
			await navigator.clipboard.writeText(colorTextOutputBox.value);
			showTooltip(colorTextOutputBox);
		} catch (error) {
			console.error(`Failed to copy: ${error}`);
		}
	});

	// add event listener for input changes
	colorTextOutputBox.addEventListener('input', e => {
		const target = e.target as HTMLInputElement | null;
		if (target && /^#[0-9A-F]{6}$%/i.test(target.value)) {
			const boxElement = document.getElementById(
				`color-box-${paletteBoxCount}`
			);
			const stripeElement = document.getElementById(
				`color-stripe-${paletteBoxCount}`
			);
			if (boxElement) boxElement.style.backgroundColor = target.value;
			if (stripeElement)
				stripeElement.style.backgroundColor = target.value;
		}
	});

	// appends elements to top half
	paletteBoxTopHalf.appendChild(colorTextOutputBox);
	paletteBoxTopHalf.appendChild(copyButton);

	// create bottom half of palette box
	const paletteBoxBottomHalf = document.createElement('div');
	paletteBoxBottomHalf.className = 'palette-box-half palette-box-bottom-half';
	paletteBoxBottomHalf.id = `palette-box-bottom-half-${paletteBoxCount}`;

	// create color box
	const colorBox = document.createElement('div');
	colorBox.className = 'color-box';
	colorBox.id = `color-box-${paletteBoxCount}`;

	if (colorValues.value && 'hsl' in colorValues.value) {
		const hslString = colorValues.value.hsl as string;
		colorBox.style.backgroundColor = hslString;
	} else {
		colorBox.style.backgroundColor = '#ffffff'; // default color
	}

	paletteBoxBottomHalf.appendChild(colorBox);

	// append halves to main palette box
	paletteBox.appendChild(paletteBoxTopHalf);
	paletteBox.appendChild(paletteBoxBottomHalf);

	// create color stripe
	const colorStripe = document.createElement('div');
	colorStripe.className = 'color-stripe';
	colorStripe.id = `color-stripe-${paletteBoxCount}`;

	if (colorValues.value && 'hsl' in colorValues.value) {
		colorStripe.style.backgroundColor = colorValues.value.hsl as string;
	}

	colorStripe.setAttribute('draggable', 'true');
	attachDragAndDropEventListeners(colorStripe);

	// append palette box to color stripe
	colorStripe.appendChild(paletteBox);

	return {
		colorStripe,
		paletteBoxCount: paletteBoxCount + 1
	};
}

function pullParamsFromUI(): types.PullParamsFromUI {
	const paletteTypeElement = document.getElementById(
		'palette-type-options'
	) as HTMLSelectElement | null;
	const numBoxesElement = document.getElementById(
		'palette-number-options'
	) as HTMLSelectElement | null;
	const initialColorSpaceElement = document.getElementById(
		'initial-color-space-options'
	) as HTMLSelectElement | null;

	const paletteType = paletteTypeElement
		? parseInt(paletteTypeElement.value, 10)
		: 0;
	const numBoxes = numBoxesElement ? parseInt(numBoxesElement.value, 10) : 0;
	const initialColorSpace =
		initialColorSpaceElement &&
		guards.isColorSpace(initialColorSpaceElement.value)
			? initialColorSpaceElement.value
			: 'hex';

	return {
		paletteType,
		numBoxes,
		initialColorSpace
	};
}

export const domHelpers = {
	defineUIButtons,
	addConversionButtonEventListeners,
	makePaletteBox,
	pullParamsFromUI
};
