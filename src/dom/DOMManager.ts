// File: dom/DOMManager.ts

import { CommonFunctions, Services, State } from '../types/index.js';
import { PaletteRendererService } from './PaletteRendererService.js';

const caller = 'DOMManager';

export class DOMManager {
	static #instance: DOMManager | null = null;

	#paletteRenderer: PaletteRendererService;

	#errors: Services['errors'];
	#log: Services['log'];

	private constructor(
		common: CommonFunctions,
		paletteRenderer: PaletteRendererService
	) {
		try {
			common.services.log.info(
				`Constructing DOMManager instance`,
				`DOMManager.constructor`
			);

			this.#errors = common.services.errors;
			this.#log = common.services.log;

			this.#paletteRenderer = paletteRenderer;
		} catch (error) {
			throw new Error(
				`[DOMManager.constructor]: ${
					error instanceof Error ? error.message : error
				}`
			);
		}
	}

	static async getInstance(
		common: CommonFunctions,
		paletteRenderer: PaletteRendererService
	): Promise<DOMManager> {
		return common.services.errors.handleAsync(async () => {
			if (!DOMManager.#instance) {
				common.services.log.debug(
					`Creating ${caller} instance`,
					`${caller}.getInstance`
				);

				return new DOMManager(common, paletteRenderer);
			}

			return DOMManager.#instance;
		}, `[${caller}.getInstance]: Failed to create ${caller} instance.`);
	}

	renderPaletteColumns(columns: State['paletteContainer']['columns']): void {
		this.#errors.handleSync(() => {
			this.#paletteRenderer.renderColumns(columns);

			this.#log.debug(
				'Rendered palette columns.',
				`${caller}.renderPaletteColumns`
			);
		}, `[${caller}]: Failed to render palette columns.`);
	}

	updateColumnSize(columnID: number, newSize: number): void {
		this.#errors.handleSync(() => {
			this.#paletteRenderer.updatePaletteColumnSize(columnID, newSize);
			this.#log.debug(
				`Updated column size for ID: ${columnID}.`,
				`${caller}.updateColumnSize`
			);
		}, `[${caller}]: Failed to update column size.`);
	}
}
