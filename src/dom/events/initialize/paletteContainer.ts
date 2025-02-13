// File: dom/events/initialize/paletteContainer.js

import { CoreUtilsInterface } from '../../../types/index.js';
import { StateManager } from '../../../state/StateManager.js';
import { domData } from '../../../data/dom.js';

export function initializeColumnPositions(
	coreUtils: CoreUtilsInterface,
	stateManager: StateManager
): void {
	const paletteColumns = coreUtils.getAllElements(
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
