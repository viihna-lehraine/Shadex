// File: state/StateHistoryService.ts
import { env } from '../config/index.js';
const caller = 'StateHistoryService';
export class StateHistoryService {
    static #instance = null;
    #history = [];
    #redoStack = [];
    #undoStack = [];
    #clone;
    #errors;
    #log;
    constructor(helpers, services) {
        try {
            services.log.debug(`Constructing ${caller} instance.`, `${caller} constructor`);
            this.#clone = helpers.data.clone;
            this.#errors = services.errors;
            this.#log = services.log;
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static getInstance(helpers, services) {
        return services.errors.handleSync(() => {
            if (!StateHistoryService.#instance) {
                services.log.debug('Creating StateHistory instance.', `${caller}.getInstance`);
                StateHistoryService.#instance = new StateHistoryService(helpers, services);
            }
            services.log.debug(`Returning ${caller} instance.`, `${caller}.getInstance`);
            return StateHistoryService.#instance;
        }, `[${caller}.getInstance]: Error getting instance.`);
    }
    /**
     * @description Add a palette to State's palette history and tracks the action
     */
    addPaletteToHistory(state, palette) {
        return this.#errors.handleSync(() => {
            const newHistory = [...state.paletteHistory, palette];
            if (newHistory.length > env.app.historyLimit) {
                newHistory.shift();
            }
            // TODO: state update should be handled by StateStore
            this.trackAction(state);
            this.#log.debug(`Added palette to history.`, `${caller}.addPalette`);
        }, `[${caller}.addPaletteToHistory]: Failed to add palette to history.`);
    }
    clearHistory() {
        this.#errors.handleSync(() => {
            this.#history = [];
            this.#redoStack = [];
            this.#undoStack = [];
            this.#log.info(`History and undo stack cleared.`, `${caller}.clear`);
        }, `[${caller}.clearHistory]: Failed to clear history.`);
    }
    /**
     * @description Redo the previously undone action
     */
    redo() {
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
    trackAction(state) {
        return this.#errors.handleSync(() => {
            const clonedState = Object.freeze(this.#clone(state));
            this.#history.push(clonedState);
            if (this.#history.length > env.app.historyLimit) {
                this.#history.shift();
            }
            this.#log.debug(`Tracked new action in history.`, `${caller}.track`);
        }, `[${caller}]: Failed to track action.`);
    }
    /**
     * @description Undo the last action and return the previous state
     */
    undo(currentState) {
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
                this.#log.debug(`Undo successful. Undo stack size: ${this.#undoStack.length} | Redo stack size: ${this.#redoStack.length}`, `${caller}.undo`);
            }
            return previousState ?? null;
        }, `[${caller}]: Failed to undo action.`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdGVIaXN0b3J5U2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdGF0ZS9TdGF0ZUhpc3RvcnlTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFDQUFxQztBQVVyQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFekMsTUFBTSxNQUFNLEdBQUcscUJBQXFCLENBQUM7QUFFckMsTUFBTSxPQUFPLG1CQUFtQjtJQUMvQixNQUFNLENBQUMsU0FBUyxHQUErQixJQUFJLENBQUM7SUFFcEQsUUFBUSxHQUFZLEVBQUUsQ0FBQztJQUN2QixVQUFVLEdBQVksRUFBRSxDQUFDO0lBQ3pCLFVBQVUsR0FBWSxFQUFFLENBQUM7SUFFekIsTUFBTSxDQUEyQjtJQUNqQyxPQUFPLENBQXFCO0lBQzVCLElBQUksQ0FBa0I7SUFFdEIsWUFBb0IsT0FBZ0IsRUFBRSxRQUFrQjtRQUN2RCxJQUFJLENBQUM7WUFDSixRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FDakIsZ0JBQWdCLE1BQU0sWUFBWSxFQUNsQyxHQUFHLE1BQU0sY0FBYyxDQUN2QixDQUFDO1lBRUYsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBQzFCLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQ2QsSUFBSSxNQUFNLGtCQUNULEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQzFDLEVBQUUsQ0FDRixDQUFDO1FBQ0gsQ0FBQztJQUNGLENBQUM7SUFFRCxNQUFNLENBQUMsV0FBVyxDQUNqQixP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O1lBQy9ELGdDQUFnQztZQUNoQyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBRTVDLElBQUksYUFBYSxFQUFFLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUNkLHFDQUFxQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sdUJBQXVCLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEVBQzFHLEdBQUcsTUFBTSxPQUFPLENBQ2hCLENBQUM7WUFDSCxDQUFDO1lBRUQsT0FBTyxhQUFhLElBQUksSUFBSSxDQUFDO1FBQzlCLENBQUMsRUFBRSxJQUFJLE1BQU0sMkJBQTJCLENBQUMsQ0FBQztJQUMzQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3RhdGUvU3RhdGVIaXN0b3J5U2VydmljZS50c1xuXG5pbXBvcnQge1xuXHRIZWxwZXJzLFxuXHRIaXN0b3J5LFxuXHRQYWxldHRlLFxuXHRTZXJ2aWNlcyxcblx0U3RhdGUsXG5cdFN0YXRlSGlzdG9yeUNvbnRyYWN0XG59IGZyb20gJy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGVudiB9IGZyb20gJy4uL2NvbmZpZy9pbmRleC5qcyc7XG5cbmNvbnN0IGNhbGxlciA9ICdTdGF0ZUhpc3RvcnlTZXJ2aWNlJztcblxuZXhwb3J0IGNsYXNzIFN0YXRlSGlzdG9yeVNlcnZpY2UgaW1wbGVtZW50cyBTdGF0ZUhpc3RvcnlDb250cmFjdCB7XG5cdHN0YXRpYyAjaW5zdGFuY2U6IFN0YXRlSGlzdG9yeVNlcnZpY2UgfCBudWxsID0gbnVsbDtcblxuXHQjaGlzdG9yeTogSGlzdG9yeSA9IFtdO1xuXHQjcmVkb1N0YWNrOiBIaXN0b3J5ID0gW107XG5cdCN1bmRvU3RhY2s6IEhpc3RvcnkgPSBbXTtcblxuXHQjY2xvbmU6IEhlbHBlcnNbJ2RhdGEnXVsnY2xvbmUnXTtcblx0I2Vycm9yczogU2VydmljZXNbJ2Vycm9ycyddO1xuXHQjbG9nOiBTZXJ2aWNlc1snbG9nJ107XG5cblx0cHJpdmF0ZSBjb25zdHJ1Y3RvcihoZWxwZXJzOiBIZWxwZXJzLCBzZXJ2aWNlczogU2VydmljZXMpIHtcblx0XHR0cnkge1xuXHRcdFx0c2VydmljZXMubG9nLmRlYnVnKFxuXHRcdFx0XHRgQ29uc3RydWN0aW5nICR7Y2FsbGVyfSBpbnN0YW5jZS5gLFxuXHRcdFx0XHRgJHtjYWxsZXJ9IGNvbnN0cnVjdG9yYFxuXHRcdFx0KTtcblxuXHRcdFx0dGhpcy4jY2xvbmUgPSBoZWxwZXJzLmRhdGEuY2xvbmU7XG5cdFx0XHR0aGlzLiNlcnJvcnMgPSBzZXJ2aWNlcy5lcnJvcnM7XG5cdFx0XHR0aGlzLiNsb2cgPSBzZXJ2aWNlcy5sb2c7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0YFske2NhbGxlcn0gY29uc3RydWN0b3JdOiAke1xuXHRcdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogZXJyb3Jcblx0XHRcdFx0fWBcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0c3RhdGljIGdldEluc3RhbmNlKFxuXHRcdGhlbHBlcnM6IEhlbHBlcnMsXG5cdFx0c2VydmljZXM6IFNlcnZpY2VzXG5cdCk6IFN0YXRlSGlzdG9yeVNlcnZpY2Uge1xuXHRcdHJldHVybiBzZXJ2aWNlcy5lcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRpZiAoIVN0YXRlSGlzdG9yeVNlcnZpY2UuI2luc3RhbmNlKSB7XG5cdFx0XHRcdHNlcnZpY2VzLmxvZy5kZWJ1Zyhcblx0XHRcdFx0XHQnQ3JlYXRpbmcgU3RhdGVIaXN0b3J5IGluc3RhbmNlLicsXG5cdFx0XHRcdFx0YCR7Y2FsbGVyfS5nZXRJbnN0YW5jZWBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRTdGF0ZUhpc3RvcnlTZXJ2aWNlLiNpbnN0YW5jZSA9IG5ldyBTdGF0ZUhpc3RvcnlTZXJ2aWNlKFxuXHRcdFx0XHRcdGhlbHBlcnMsXG5cdFx0XHRcdFx0c2VydmljZXNcblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0c2VydmljZXMubG9nLmRlYnVnKFxuXHRcdFx0XHRgUmV0dXJuaW5nICR7Y2FsbGVyfSBpbnN0YW5jZS5gLFxuXHRcdFx0XHRgJHtjYWxsZXJ9LmdldEluc3RhbmNlYFxuXHRcdFx0KTtcblxuXHRcdFx0cmV0dXJuIFN0YXRlSGlzdG9yeVNlcnZpY2UuI2luc3RhbmNlO1xuXHRcdH0sIGBbJHtjYWxsZXJ9LmdldEluc3RhbmNlXTogRXJyb3IgZ2V0dGluZyBpbnN0YW5jZS5gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb24gQWRkIGEgcGFsZXR0ZSB0byBTdGF0ZSdzIHBhbGV0dGUgaGlzdG9yeSBhbmQgdHJhY2tzIHRoZSBhY3Rpb25cblx0ICovXG5cdGFkZFBhbGV0dGVUb0hpc3Rvcnkoc3RhdGU6IFN0YXRlLCBwYWxldHRlOiBQYWxldHRlKTogdm9pZCB7XG5cdFx0cmV0dXJuIHRoaXMuI2Vycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGNvbnN0IG5ld0hpc3RvcnkgPSBbLi4uc3RhdGUucGFsZXR0ZUhpc3RvcnksIHBhbGV0dGVdO1xuXG5cdFx0XHRpZiAobmV3SGlzdG9yeS5sZW5ndGggPiBlbnYuYXBwLmhpc3RvcnlMaW1pdCkge1xuXHRcdFx0XHRuZXdIaXN0b3J5LnNoaWZ0KCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRPRE86IHN0YXRlIHVwZGF0ZSBzaG91bGQgYmUgaGFuZGxlZCBieSBTdGF0ZVN0b3JlXG5cdFx0XHR0aGlzLnRyYWNrQWN0aW9uKHN0YXRlKTtcblxuXHRcdFx0dGhpcy4jbG9nLmRlYnVnKFxuXHRcdFx0XHRgQWRkZWQgcGFsZXR0ZSB0byBoaXN0b3J5LmAsXG5cdFx0XHRcdGAke2NhbGxlcn0uYWRkUGFsZXR0ZWBcblx0XHRcdCk7XG5cdFx0fSwgYFske2NhbGxlcn0uYWRkUGFsZXR0ZVRvSGlzdG9yeV06IEZhaWxlZCB0byBhZGQgcGFsZXR0ZSB0byBoaXN0b3J5LmApO1xuXHR9XG5cblx0Y2xlYXJIaXN0b3J5KCk6IHZvaWQge1xuXHRcdHRoaXMuI2Vycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdHRoaXMuI2hpc3RvcnkgPSBbXTtcblx0XHRcdHRoaXMuI3JlZG9TdGFjayA9IFtdO1xuXHRcdFx0dGhpcy4jdW5kb1N0YWNrID0gW107XG5cblx0XHRcdHRoaXMuI2xvZy5pbmZvKFxuXHRcdFx0XHRgSGlzdG9yeSBhbmQgdW5kbyBzdGFjayBjbGVhcmVkLmAsXG5cdFx0XHRcdGAke2NhbGxlcn0uY2xlYXJgXG5cdFx0XHQpO1xuXHRcdH0sIGBbJHtjYWxsZXJ9LmNsZWFySGlzdG9yeV06IEZhaWxlZCB0byBjbGVhciBoaXN0b3J5LmApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvbiBSZWRvIHRoZSBwcmV2aW91c2x5IHVuZG9uZSBhY3Rpb25cblx0ICovXG5cdHJlZG8oKTogU3RhdGUgfCBudWxsIHtcblx0XHRyZXR1cm4gdGhpcy4jZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuI3JlZG9TdGFjay5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0dGhpcy4jbG9nLmluZm8oYE5vIHJlZG8gYWN0aW9ucyBhdmFsYWJsZS5gLCBgJHtjYWxsZXJ9LnJlZG9gKTtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG5leHRTdGF0ZSA9IHRoaXMuI3JlZG9TdGFjay5wb3AoKTtcblxuXHRcdFx0aWYgKG5leHRTdGF0ZSkge1xuXHRcdFx0XHRjb25zdCBjbG9uZWRTdGF0ZSA9IE9iamVjdC5mcmVlemUodGhpcy4jY2xvbmUobmV4dFN0YXRlKSk7XG5cblx0XHRcdFx0Ly8gcmVkbyBhY3Rpb24gYmVjb21lcyBwYXJ0IG9mIHRoZSB1bmRvIGhpc3Rvcnlcblx0XHRcdFx0dGhpcy4jdW5kb1N0YWNrLnB1c2goY2xvbmVkU3RhdGUpO1xuXHRcdFx0XHR0aGlzLiNoaXN0b3J5LnB1c2goY2xvbmVkU3RhdGUpO1xuXG5cdFx0XHRcdHRoaXMuI2xvZy5kZWJ1ZygnUGVyZm9ybWVkIHJlZG8gYWN0aW9uLicsIGAke2NhbGxlcn0ucmVkb2ApO1xuXG5cdFx0XHRcdHJldHVybiBjbG9uZWRTdGF0ZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSwgYFske2NhbGxlcn1dOiBGYWlsZWQgdG8gcmVkbyBhY3Rpb24uYCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIFRyYWNrIGN1cnJlbnQgc3RhdGUgZm9yIHVuZG8vcmVkbyBhbmQgZW5mb3JjZXMgaGlzdG9yeSBsaW1pdFxuXHQgKi9cblx0dHJhY2tBY3Rpb24oc3RhdGU6IFN0YXRlKTogdm9pZCB7XG5cdFx0cmV0dXJuIHRoaXMuI2Vycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdGNvbnN0IGNsb25lZFN0YXRlID0gT2JqZWN0LmZyZWV6ZSh0aGlzLiNjbG9uZShzdGF0ZSkpO1xuXHRcdFx0dGhpcy4jaGlzdG9yeS5wdXNoKGNsb25lZFN0YXRlKTtcblxuXHRcdFx0aWYgKHRoaXMuI2hpc3RvcnkubGVuZ3RoID4gZW52LmFwcC5oaXN0b3J5TGltaXQpIHtcblx0XHRcdFx0dGhpcy4jaGlzdG9yeS5zaGlmdCgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiNsb2cuZGVidWcoXG5cdFx0XHRcdGBUcmFja2VkIG5ldyBhY3Rpb24gaW4gaGlzdG9yeS5gLFxuXHRcdFx0XHRgJHtjYWxsZXJ9LnRyYWNrYFxuXHRcdFx0KTtcblx0XHR9LCBgWyR7Y2FsbGVyfV06IEZhaWxlZCB0byB0cmFjayBhY3Rpb24uYCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uIFVuZG8gdGhlIGxhc3QgYWN0aW9uIGFuZCByZXR1cm4gdGhlIHByZXZpb3VzIHN0YXRlXG5cdCAqL1xuXHR1bmRvKGN1cnJlbnRTdGF0ZTogU3RhdGUpOiBTdGF0ZSB8IG51bGwge1xuXHRcdHJldHVybiB0aGlzLiNlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy4jdW5kb1N0YWNrLmxlbmd0aCA8PSAxKSB7XG5cdFx0XHRcdHRoaXMuI2xvZy5pbmZvKCdObyB1bmRvIGFjdGlvbnMgYXZhaWxhYmxlLicsIGAke2NhbGxlcn0udW5kb2ApO1xuXG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBzYXZlIGN1cnJlbnQgc3RhdGUgZm9yIHJlZG8gc3RhY2tcblx0XHRcdHRoaXMuI3JlZG9TdGFjay5wdXNoKE9iamVjdC5mcmVlemUodGhpcy4jY2xvbmUoY3VycmVudFN0YXRlKSkpO1xuXHRcdFx0Ly8gcmV2ZXJ0IHRvIHRoZSBwcmV2aW91cyBhY3Rpb25cblx0XHRcdGNvbnN0IHByZXZpb3VzU3RhdGUgPSB0aGlzLiN1bmRvU3RhY2sucG9wKCk7XG5cblx0XHRcdGlmIChwcmV2aW91c1N0YXRlKSB7XG5cdFx0XHRcdHRoaXMuI2xvZy5kZWJ1Zyhcblx0XHRcdFx0XHRgVW5kbyBzdWNjZXNzZnVsLiBVbmRvIHN0YWNrIHNpemU6ICR7dGhpcy4jdW5kb1N0YWNrLmxlbmd0aH0gfCBSZWRvIHN0YWNrIHNpemU6ICR7dGhpcy4jcmVkb1N0YWNrLmxlbmd0aH1gLFxuXHRcdFx0XHRcdGAke2NhbGxlcn0udW5kb2Bcblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHByZXZpb3VzU3RhdGUgPz8gbnVsbDtcblx0XHR9LCBgWyR7Y2FsbGVyfV06IEZhaWxlZCB0byB1bmRvIGFjdGlvbi5gKTtcblx0fVxufVxuIl19