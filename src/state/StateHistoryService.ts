// File: state/StateHistoryService.ts

import {
	Helpers,
	History,
	Palette,
	Services,
	State,
	StateHistoryContract
} from '../types/index.js';
import { env } from '../config/index.js';

const caller = 'StateHistoryService';

export class StateHistoryService implements StateHistoryContract {
	static #instance: StateHistoryService | null = null;

	#history: History = [];
	#redoStack: History = [];
	#undoStack: History = [];

	#clone: Helpers['data']['clone'];
	#errors: Services['errors'];
	#log: Services['log'];

	private constructor(helpers: Helpers, services: Services) {
		try {
			services.log.debug(
				`Constructing ${caller} instance.`,
				`${caller} constructor`
			);

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

	static getInstance(
		helpers: Helpers,
		services: Services
	): StateHistoryService {
		return services.errors.handleSync(() => {
			if (!StateHistoryService.#instance) {
				services.log.debug(
					'Creating StateHistory instance.',
					`${caller}.getInstance`
				);

				StateHistoryService.#instance = new StateHistoryService(
					helpers,
					services
				);
			}

			services.log.debug(
				`Returning ${caller} instance.`,
				`${caller}.getInstance`
			);

			return StateHistoryService.#instance;
		}, `[${caller}.getInstance]: Error getting instance.`);
	}

	/**
	 * @description Add a palette to State's palette history and tracks the action
	 */
	addPaletteToHistory(state: State, palette: Palette): void {
		return this.#errors.handleSync(() => {
			const newHistory = [...state.paletteHistory, palette];

			if (newHistory.length > env.app.historyLimit) {
				newHistory.shift();
			}

			// TODO: state update should be handled by StateStore
			this.trackAction(state);

			this.#log.debug(
				`Added palette to history.`,
				`${caller}.addPalette`
			);
		}, `[${caller}.addPaletteToHistory]: Failed to add palette to history.`);
	}

	clearHistory(): void {
		this.#errors.handleSync(() => {
			this.#history = [];
			this.#redoStack = [];
			this.#undoStack = [];

			this.#log.info(
				`History and undo stack cleared.`,
				`${caller}.clear`
			);
		}, `[${caller}.clearHistory]: Failed to clear history.`);
	}

	/**
	 * @description Redo the previously undone action
	 */
	redo(): State | null {
		return this.#errors.handleSync(() => {
			if (this.#redoStack.length === 0) {
				this.#log.info(`No redo actions avalable.`, `${caller}.redo`);
				return null;
			}

			const nextState = this.#redoStack.pop();

			if (nextState) {
				const clonedState = Object.freeze(this.#clone(nextState));

				// redo action becomes part of the undo history
				this.#undoStack.push(clonedState);
				this.#history.push(clonedState);

				this.#log.debug('Performed redo action.', `${caller}.redo`);

				return clonedState;
			}

			return null;
		}, `[${caller}]: Failed to redo action.`);
	}

	/**
	 * @description Track current state for undo/redo and enforces history limit
	 */
	trackAction(state: State): void {
		return this.#errors.handleSync(() => {
			const clonedState = Object.freeze(this.#clone(state));
			this.#history.push(clonedState);

			if (this.#history.length > env.app.historyLimit) {
				this.#history.shift();
			}

			this.#log.debug(
				`Tracked new action in history.`,
				`${caller}.track`
			);
		}, `[${caller}]: Failed to track action.`);
	}

	/**
	 * @description Undo the last action and return the previous state
	 */
	undo(currentState: State): State | null {
		return this.#errors.handleSync(() => {
			if (this.#undoStack.length <= 1) {
				this.#log.info('No undo actions available.', `${caller}.undo`);

				return null;
			}

			// save current state for redo stack
			this.#redoStack.push(Object.freeze(this.#clone(currentState)));
			// revert to the previous action
			const previousState = this.#undoStack.pop();

			if (previousState) {
				this.#log.debug(
					`Undo successful. Undo stack size: ${this.#undoStack.length} | Redo stack size: ${this.#redoStack.length}`,
					`${caller}.undo`
				);
			}

			return previousState ?? null;
		}, `[${caller}]: Failed to undo action.`);
	}
}
