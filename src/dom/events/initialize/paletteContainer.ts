// File: dom/events/initialize/paletteContainer.js

import { UtilitiesInterface } from '../../../types/index.js';
import { StateManager } from '../../../state/StateManager.js';
import { domData } from '../../../data/dom.js';

export function initializeColumnPositions(
	stateManager: StateManager,
	utils: UtilitiesInterface
): void {
	const paletteColumns = utils.core.getAllElements(
		domData.classes.paletteColumn
	);

	const updatedColumns = Array.from(paletteColumns).map((column, index) => {
		return {
			id: parseInt(column.id.split('-').pop() || '0'),
			isLocked: false,
			position: index + 1,
			size: column.offsetWidth
		};
	});

	stateManager.updatePaletteColumns(updatedColumns, false, 4);
}
