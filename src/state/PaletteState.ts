// File: state/PaletteState.ts

import {
	AllColors,
	PaletteItem,
	PaletteStateInterface,
	Services,
	Utilities
} from '../types/index.js';
import { StateManager } from './StateManager.js';

const caller = 'PaletteState';

export class PaletteState implements PaletteStateInterface {
	#errors: Services['errors'];
	#utils: Utilities;

	constructor(
		private stateManager: StateManager,
		services: Services,
		utils: Utilities
	) {
		try {
			services.log(`Constructing PaletteState instance`, {
				caller: `${caller} constructor`
			});

			this.#errors = services.errors;
			this.#utils = utils;
		} catch (error) {
			throw new Error(
				`[${caller} constructor]: ${error instanceof Error ? error.message : error}`
			);
		}
	}

	async updatePaletteItemColor(
		columnID: number,
		newColor: string
	): Promise<void> {
		return this.#errors.handleAsync(
			async () => {
				const currentState = await this.stateManager.getState();
				const latestPalette = currentState.paletteHistory[0];

				if (!latestPalette) return;

				// find the PaletteItem corresponding to this column
				const updatedItems = latestPalette.items.map(item => {
					if (item.itemID !== columnID) return item;

					const parsedNewColor =
						this.#utils.color.formatCSSAsColor(newColor);
					if (!parsedNewColor) throw new Error('Invalid color value');

					// ensure color is in HSL format
					const hslColor =
						parsedNewColor.format === 'hsl'
							? parsedNewColor
							: this.#utils.color.convertToHSL(parsedNewColor);

					// generate all color representations (ensuring correct branded types)
					const allColors: AllColors =
						this.#utils.palette.generateAllColorValues(hslColor);

					// ensure CSS representations match expected format
					const structuredCSS = {
						cmyk: this.#utils.color.formatColorAsCSS(
							allColors.cmyk
						),
						hex: this.#utils.color.formatColorAsCSS(allColors.hex),
						hsl: this.#utils.color.formatColorAsCSS(allColors.hsl),
						hsv: this.#utils.color.formatColorAsCSS(allColors.hsv),
						lab: this.#utils.color.formatColorAsCSS(allColors.lab),
						rgb: this.#utils.color.formatColorAsCSS(allColors.rgb),
						xyz: this.#utils.color.formatColorAsCSS(allColors.xyz)
					};

					return {
						...item,
						colors: allColors,
						css: structuredCSS
					};
				});

				// ensure column state is updated
				const updatedColumns = updatedItems.map((item, index) => ({
					id: item.itemID,
					isLocked:
						currentState.paletteContainer.columns[index].isLocked,
					position: index + 1,
					size: currentState.paletteContainer.columns[index].size
				}));

				// update state history with type assertions
				this.stateManager.updatePaletteColumns(updatedColumns, true, 3);
				this.stateManager.updatePaletteHistory([
					{ ...latestPalette, items: updatedItems as PaletteItem[] },
					...currentState.paletteHistory.slice(1)
				]);
			},
			`[${caller}]: Failed to update palette item color.`,
			{ context: { columnID, newColor } }
		);
	}
}
