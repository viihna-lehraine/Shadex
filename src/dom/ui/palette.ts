// File: dom/ui/newPalette.js

import {
	AppServicesInterface,
	BrandingUtilsInterface,
	Color,
	ColorUtilHelpersInterface,
	ColorUtilsInterface,
	CoreUtilsInterface,
	FormattingUtilsInterface,
	HSL,
	PaletteItem,
	PaletteUtilsInterface,
	RenderNewPaletteArgs,
	SanitationUtilsInterface,
	TypeGuardUtilsInterface,
	ValidationUtilsInterface
} from '../../types/index.js';
import { StateManager } from '../../state/StateManager.js';
import { constsData as consts } from '../../data/consts.js';
import { domData } from '../../data/dom.js';

export function copyToClipboard(
	text: string,
	tooltipElement: HTMLElement,
	appServices: AppServicesInterface
): void {
	const log = appServices.log;

	try {
		const colorValue = text.replace('Copied to clipboard!', '').trim();

		navigator.clipboard
			.writeText(colorValue)
			.then(() => {
				// showTooltip(tooltipElement);

				log(
					'debug',
					`Copied color value: ${colorValue}`,
					'copyToClipboard()',
					4
				);

				setTimeout(
					() => tooltipElement.classList.remove('show'),
					consts.timeouts.tooltip || 1000
				);
			})
			.catch(err => {
				log(
					'error',
					`Error copying to clipboard: ${err}`,
					'copyToClipboard()'
				);
			});
	} catch (error) {
		log(
			'error',
			`Failed to copy to clipboard: ${error}`,
			'copyToClipboard()'
		);
	}
}

export function createTooltipElement(): HTMLDivElement {
	const tooltip = document.createElement('div');
	tooltip.classList.add('tooltip');
	document.body.appendChild(tooltip);

	return tooltip;
}

export function renderNewPalette(args: RenderNewPaletteArgs): void {
	const log = args.appServices.log;

	log('debug', 'Rendering new palette...', 'renderNewPalette()', 2);

	const paletteContainer = args.coreUtils.getElement<HTMLDivElement>(
		domData.ids.divs.paletteContainer
	);

	if (!paletteContainer) {
		log('error', `Palette container not found`, 'renderNewPalette()', 1);

		return;
	}

	// Step 1: Retrieve palette generation options from the DOM
	const options = args.pullParamsFromUI(args.appServices, args.typeGuards);

	log(
		'debug',
		`Palette generation options: ${JSON.stringify(options)}`,
		'renderNewPalette()',
		2
	);

	// Step 2: Push old palette to history
	const currentState = args.stateManager.getState();
	const oldPalette =
		currentState.paletteHistory[
			Array.prototype.lastIndexOf(currentState.paletteHistory)
		];
	args.stateManager.addPaletteToHistory(oldPalette);

	// Step 3: Clear the palette container
	paletteContainer.innerHTML = '';

	// Step 4: Generate a new palette
	const newPalette = args.generatePalette({
		options,
		adjust: args.adjust,
		appServices: args.appServices,
		appUtils: args.appUtils,
		argsHelpers: args.argsHelpers,
		brand: args.brand,
		colorHelpers: args.colorHelpers,
		colorUtils: args.colorUtils,
		coreUtils: args.coreUtils,
		domUtils: args.domUtils,
		format: args.format,
		generateHues: args.generateHues,
		paletteHelpers: args.paletteHelpers,
		paletteUtils: args.paletteUtils,
		sanitize: args.sanitize,
		typeGuards: args.typeGuards,
		validate: args.validate
	});

	// Step 5: Create and append palette columns

	const columnCount = newPalette.items.length;
	const columnWidth = 100 / columnCount;
	const colorSpace = currentState.preferences.colorSpace;
	const validColorSpace = ['hex', 'hsl', 'rgb'].includes(colorSpace)
		? colorSpace
		: 'hex';
	const columns = newPalette.items.map((items, index) => {
		const columnID = index + 1;
		const colorValue =
			items.cssColors[
				validColorSpace as keyof PaletteItem['cssColors']
			] || items.cssColors.hex;

		// create palette column div
		const column = document.createElement('div');
		column.id = `palette-column-${columnID}`;
		column.className = 'palette-column';
		column.setAttribute('draggable', 'true');
		column.style.backgroundColor = colorValue;

		// create color display input
		const colorDisplay = document.createElement('input');
		colorDisplay.id = `color-display-${columnID}`;
		colorDisplay.className = 'color-display';
		colorDisplay.type = 'text';
		colorDisplay.value = colorValue;

		// create color input button
		const colorInputBtn = document.createElement('button');
		colorInputBtn.id = `color-input-btn-${columnID}`;
		colorInputBtn.className = 'color-input-btn';
		colorInputBtn.textContent = 'Change Color';

		// create lock button
		const lockBtn = document.createElement('button');
		lockBtn.id = `lock-btn-${columnID}`;
		lockBtn.className = 'lock-btn';
		lockBtn.textContent = 'Lock 🔒';

		// create drag handle button
		const dragHandle = document.createElement('button');
		dragHandle.id = `drag-handle-${columnID}`;
		dragHandle.className = 'drag-handle';
		dragHandle.textContent = 'Move ☰';

		// create resize handle
		const resizeHandle = document.createElement('div');
		resizeHandle.id = `resize-handle-${columnID}`;
		resizeHandle.className = 'resize-handle';

		// create color input modal
		const colorInputModal = document.createElement('div');
		colorInputModal.id = `color-input-modal-${columnID}`;
		colorInputModal.className = 'color-input-modal hidden';

		// create color input inside the modal
		const colorInput = document.createElement('input');
		colorInput.id = `color-input-${columnID}`;
		colorInput.className = 'color-input';
		colorInput.type = 'color';
		colorInput.value = colorValue;

		colorInputModal.appendChild(colorInput);
		column.appendChild(colorDisplay);
		column.appendChild(colorInputBtn);
		column.appendChild(lockBtn);
		column.appendChild(dragHandle);
		column.appendChild(resizeHandle);
		column.appendChild(colorInputModal);

		return {
			column,
			state: {
				id: columnID,
				isLocked: false,
				position: columnID,
				size: columnWidth
			}
		};
	});

	// Step 6: Append new columns to the palette container
	columns.forEach(({ column }) => paletteContainer.appendChild(column));

	// Step 7: Update StateManager with new columns
	args.stateManager.updatePaletteColumns(
		columns.map(col => col.state),
		true,
		3
	);

	// Step 8: Attach event listeners
	args.attachPaletteListeners(
		args.appServices,
		args.attachTooltipListener,
		args.coreUtils,
		args.createTooltipElement,
		args.domUtils,
		args.stateManager,
		args.validate
	);
}

export function renderPaletteColor(
	color: HSL,
	colorBox: HTMLDivElement,
	colorBoxNumber: number,
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	typeGuards: TypeGuardUtilsInterface,
	validate: ValidationUtilsInterface
): void {
	const log = appServices.log;

	try {
		const formatColorString = colorUtils.convertColorToCSS(color);

		colorBox.style.backgroundColor = formatColorString;

		const clonedColor: Color = typeGuards.isColor(color)
			? coreUtils.clone(color)
			: colorUtils.convertColorStringToColor(
					color,
					brand,
					coreUtils,
					validate
				);

		if (!validate.colorValue(clonedColor, coreUtils)) {
			log('error', 'Invalid color values.', 'renderPaletteColor()');

			return;
		}

		const colorTextOutputBox = document.getElementById(
			`color-text-output-box-${colorBoxNumber}`
		) as HTMLInputElement | null;

		if (!colorTextOutputBox) return;

		const stringifiedColor = colorUtils.convertColorToCSS(clonedColor);

		log(
			'debug',
			`Adding CSS-formatted color to DOM ${stringifiedColor}`,
			'renderPaletteColor()',
			2
		);

		colorTextOutputBox.value = stringifiedColor;
		colorTextOutputBox.setAttribute('data-format', color.format);
	} catch (error) {
		log(
			'error',
			`Failed to populate color text output box: ${error}`,
			'renderPaletteColor()'
		);

		return;
	}
}

function updatePaletteItemColor(
	columnID: number,
	newColor: string,
	appServices: AppServicesInterface,
	brand: BrandingUtilsInterface,
	colorHelpers: ColorUtilHelpersInterface,
	colorUtils: ColorUtilsInterface,
	coreUtils: CoreUtilsInterface,
	format: FormattingUtilsInterface,
	paletteUtils: PaletteUtilsInterface,
	sanitize: SanitationUtilsInterface,
	stateManager: StateManager,
	validate: ValidationUtilsInterface
): void {
	const currentState = stateManager.getState();
	const paletteItems = currentState.paletteHistory[0].items; // Get latest palette

	// Find the PaletteItem corresponding to this column
	const updatedItems = paletteItems.map(item => {
		if (item.itemID !== columnID) return item;

		// CONVERT NEWCOLOR INTO A COLOR-TYPED OBJECT USING colorUtils.convertCSSToColor(color: string): Exclude<Color, SV | SL> | null

		// Convert newColor into different color spaces
		const updatedColors = paletteUtils.generateAllColorValues(
			newColor,
			appServices,
			brand,
			colorHelpers,
			colorUtils,
			coreUtils,
			format,
			sanitize,
			validate
		);

		return {
			...item,
			colors: updatedColors,
			cssColors: {
				hex: updatedColors.hex,
				hsl: `hsl(${updatedColors.hsl.hue}, ${updatedColors.hsl.saturation}%, ${updatedColors.hsl.lightness}%)`,
				rgb: `rgb(${updatedColors.rgb.red}, ${updatedColors.rgb.green}, ${updatedColors.rgb.blue})`,
				cmyk: `cmyk(${updatedColors.cmyk.cyan}%, ${updatedColors.cmyk.magenta}%, ${updatedColors.cmyk.yellow}%, ${updatedColors.cmyk.key}%)`,
				lab: `lab(${updatedColors.lab.l}, ${updatedColors.lab.a}, ${updatedColors.lab.b})`,
				xyz: `xyz(${updatedColors.xyz.x}, ${updatedColors.xyz.y}, ${updatedColors.xyz.z})`,
			},
		};
	});

	// track this change in State history
	stateManager.updatePaletteColumns(updatedItems, true, 3);
}
