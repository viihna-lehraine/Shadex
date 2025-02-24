// File: state/StateHistory.ts

import { Helpers, History, Palette, Services, State } from '../types/index.js';
import { env } from '../config/index.js';

const caller = 'StateHistory';

export class StateHistory {
	static #instance: StateHistory | null = null;

	#history: History = [];
	#undoStack: History = [];

	#clone: Helpers['data']['clone'];
	#errors: Services['errors'];
	#log: Services['log'];

	constructor(helpers: Helpers, services: Services) {
		try {
			services.log(`Constructing StateLock instance.`, {
				caller: `${caller} constructor`,
				level: 'debug'
			});

			this.#clone = helpers.data.clone;
			this.#errors = services.errors;
			this.#log = services.log;
		} catch (error) {
			throw new Error(
				`[${caller} constructor]: ${
					error instanceof Error ? error.message : error
				}`
			);
		}
	}

	static getInstance(helpers: Helpers, services: Services): StateHistory {
		return services.errors.handleSync(() => {
			if (!StateHistory.#instance) {
				services.log('Creating StateHistory instance.', {
					caller: `${caller}.getInstance`,
					level: 'debug'
				});

				StateHistory.#instance = new StateHistory(helpers, services);
			}

			services.log(`Returning StateHistory instance.`, {
				caller: `${caller}.getInstance`,
				level: 'debug'
			});

			return StateHistory.#instance;
		}, `[${caller}]: Error getting instance.`);
	}

	addPaletteToHistory(state: State, palette: Palette): void {
		return this.#errors.handleSync(() => {
			this.trackAction(state);

			state.paletteHistory.push(palette);
		}, `[${caller}]: Failed to add palette to history.`);
	}

	async redo(): Promise<State | null> {
		return this.#errors.handleAsync(async () => {
			const redoState = this.#clone(this.#undoStack.pop());

			if (redoState) this.#history.push(redoState);

			return redoState ?? null;
		}, `[${caller}]: Failed to redo action.`);
	}

	trackAction(state: State): void {
		return this.#errors.handleSync(() => {
			this.#history.push(state);

			if (this.#history.length > env.app.historyLimit)
				this.#history.shift();
		}, `[${caller}]: Failed to track action.`);
	}

	async undo(state: State): Promise<State | null> {
		return this.#errors.handleAsync(async () => {
			if (this.#history.length <= 1) {
				this.#log('No previous state to revert to.', {
					caller: `${caller}.undo`
				});

				return null;
			}

			const previousState = this.#history.pop();

			if (!previousState) return null;

			this.#undoStack.push(this.#clone(state));

			this.#log(`Performed undo action.`, {
				caller: `${caller}.undo`,
				level: 'debug'
			});

			return previousState;
		}, `[${caller}]: Failed to undo action.`);
	}

	setPaletteHistory(updatedHistory: Palette[]): void {
		return this.#errors.handleSync(
			() => {

				this.#state.paletteHistory = updatedHistory;

				this.saveState();

				this.#log('Updated palette history', {
					caller: `${caller}.updatePaletteHistory`,
					level: 'debug'
				});

				this.logContentionStats();
			},
			`[${caller}: Failed to update palette history.`,
			{ context: { updatedHistory } }
		);
	}
}
