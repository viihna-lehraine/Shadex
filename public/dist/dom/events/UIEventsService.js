// File: dom/events/UIEventsService.ts
import { EventManager } from '../index.js';
import { domIndex } from '../../config/index.js';
const caller = 'UIEventsService';
const classes = domIndex.classes;
export class UIEventsService {
    static #instance = null;
    #domStore;
    #elements;
    #paletteRenderer;
    #errors;
    #helpers;
    #log;
    #utils;
    constructor(helpers, paletteRenderer, services, utils) {
        try {
            services.log.info(`Constructing UIEvents instance`, `${caller} constructor`);
            this.#domStore = services.domStore;
            this.#errors = services.errors;
            this.#helpers = helpers;
            this.#log = services.log;
            this.#utils = utils;
            const validatedElements = this.#domStore.getElements();
            if (!validatedElements) {
                throw new Error(`[${caller} constructor]: Critical UI elements not found. Application cannot start!`);
            }
            this.#elements = validatedElements;
            this.#paletteRenderer = paletteRenderer;
        }
        catch (error) {
            throw new Error(`[${caller} constructor]: ${error instanceof Error ? error.message : error}`);
        }
    }
    static getInstance(helpers, paletteRenderer, services, utils) {
        return services.errors.handleSync(() => {
            if (!UIEventsService.#instance) {
                services.log.debug('No UIEvents instance exists yet. Creating UIEvents instance', `${caller}.getInstance`);
                UIEventsService.#instance = new UIEventsService(helpers, paletteRenderer, services, utils);
            }
            return UIEventsService.#instance;
        }, `[${caller}.getInstance]: Failed to get UIEvents instance.`);
    }
    init() {
        return this.#errors.handleSync(() => {
            EventManager.add(document, 'click', event => {
                const target = event.target;
                // open modal
                if (target.matches(classes.modalTrigger)) {
                    const modal = this.#helpers.dom.getElement(target.dataset.modalID);
                    modal?.classList.remove(classes.hidden);
                }
                // close modal when clicking outside
                if (target.matches(classes.modal)) {
                    target.classList.add(classes.hidden);
                }
            });
            // handle 'Esc' key press to close modals
            EventManager.add(document, 'keydown', ((event) => {
                if (event.key === 'Escape') {
                    this.#helpers.dom
                        .getAllElements(classes.modal)
                        .forEach(modal => modal.classList.add(classes.hidden));
                }
            }));
        }, `[${caller}]: Failed to initialize UI events.`);
    }
    initButtons() {
        return this.#errors.handleSync(() => {
            const addButtonEvent = (button, logMessage, action) => {
                if (!button)
                    return;
                EventManager.add(button, 'click', (e) => {
                    e.preventDefault();
                    this.#log.debug(logMessage, `${caller}.initButtons`);
                    action?.();
                });
            };
            addButtonEvent(this.#elements.btns.desaturate, 'Desaturate button clicked', () => {
                this.#log.warn('Desaturation logic not implemented!', `${caller}.initButtons`);
            });
            addButtonEvent(this.#elements.btns.export, 'Export button clicked', () => {
                this.#log.warn('Export logic not implemented!', `${caller}.initButtons`);
            });
            addButtonEvent(this.#elements.btns.generate, 'Generate button clicked', () => {
                this.#paletteRenderer.renderNewPalette();
                this.#log.debug('New palette generated and rendered', `${caller}.initButtons`);
            });
            EventManager.add(document, 'click', this.handleWindowClick.bind(this));
        }, `[${caller}]: Failed to initialize buttons.`);
    }
    attachTooltipListener(id, tooltipText) {
        return this.#errors.handleSync(() => {
            const element = this.#helpers.dom.getElement(id);
            if (!element)
                return;
            EventManager.add(element, 'mouseenter', () => this.#utils.dom.createTooltip(element, tooltipText));
            EventManager.add(element, 'mouseleave', () => this.#utils.dom.removeTooltip(element));
        }, `[${caller}]: Failed to attach tooltip listener for ${id}.`);
    }
    handleWindowClick(event) {
        return this.#errors.handleSync(() => {
            const target = event.target;
            if (target === this.#elements.divs.helpMenu) {
                this.#elements.divs.helpMenu.classList.add(classes.hidden);
            }
            if (target === this.#elements.divs.historyMenu) {
                this.#elements.divs.historyMenu.classList.add(classes.hidden);
            }
        }, `[${caller}]: Failed to handle window click.`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUlFdmVudHNTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2RvbS9ldmVudHMvVUlFdmVudHNTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNDQUFzQztBQVN0QyxPQUFPLEVBQUUsWUFBWSxFQUEwQixNQUFNLGFBQWEsQ0FBQztBQUNuRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFakQsTUFBTSxNQUFNLEdBQUcsaUJBQWlCLENBQUM7QUFDakMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztBQUVqQyxNQUFNLE9BQU8sZUFBZTtJQUMzQixNQUFNLENBQUMsU0FBUyxHQUEyQixJQUFJLENBQUM7SUFFaEQsU0FBUyxDQUF1QjtJQUNoQyxTQUFTLENBQWM7SUFDdkIsZ0JBQWdCLENBQXlCO0lBRXpDLE9BQU8sQ0FBcUI7SUFDNUIsUUFBUSxDQUFVO0lBQ2xCLElBQUksQ0FBa0I7SUFDdEIsTUFBTSxDQUFZO0lBRWxCLFlBQ0MsT0FBZ0IsRUFDaEIsZUFBdUMsRUFDdkMsUUFBa0IsRUFDbEIsS0FBZ0I7UUFFaEIsSUFBSSxDQUFDO1lBQ0osUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQ2hCLGdDQUFnQyxFQUNoQyxHQUFHLE1BQU0sY0FBYyxDQUN2QixDQUFDO1lBRUYsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1lBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUMvQixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7WUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFFcEIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lB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LENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVELENBQUM7WUFFRCxJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDaEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9ELENBQUM7UUFDRixDQUFDLEVBQUUsSUFBSSxNQUFNLG1DQUFtQyxDQUFDLENBQUM7SUFDbkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IGRvbS9ldmVudHMvVUlFdmVudHNTZXJ2aWNlLnRzXG5cbmltcG9ydCB7XG5cdERPTUVsZW1lbnRzLFxuXHRIZWxwZXJzLFxuXHRTZXJ2aWNlcyxcblx0VUlFdmVudHNDb250cmFjdCxcblx0VXRpbGl0aWVzXG59IGZyb20gJy4uLy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IEV2ZW50TWFuYWdlciwgUGFsZXR0ZVJlbmRlcmVyU2VydmljZSB9IGZyb20gJy4uL2luZGV4LmpzJztcbmltcG9ydCB7IGRvbUluZGV4IH0gZnJvbSAnLi4vLi4vY29uZmlnL2luZGV4LmpzJztcblxuY29uc3QgY2FsbGVyID0gJ1VJRXZlbnRzU2VydmljZSc7XG5jb25zdCBjbGFzc2VzID0gZG9tSW5kZXguY2xhc3NlcztcblxuZXhwb3J0IGNsYXNzIFVJRXZlbnRzU2VydmljZSBpbXBsZW1lbnRzIFVJRXZlbnRzQ29udHJhY3Qge1xuXHRzdGF0aWMgI2luc3RhbmNlOiBVSUV2ZW50c1NlcnZpY2UgfCBudWxsID0gbnVsbDtcblxuXHQjZG9tU3RvcmU6IFNlcnZpY2VzWydkb21TdG9yZSddO1xuXHQjZWxlbWVudHM6IERPTUVsZW1lbnRzO1xuXHQjcGFsZXR0ZVJlbmRlcmVyOiBQYWxldHRlUmVuZGVyZXJTZXJ2aWNlO1xuXG5cdCNlcnJvcnM6IFNlcnZpY2VzWydlcnJvcnMnXTtcblx0I2hlbHBlcnM6IEhlbHBlcnM7XG5cdCNsb2c6IFNlcnZpY2VzWydsb2cnXTtcblx0I3V0aWxzOiBVdGlsaXRpZXM7XG5cblx0cHJpdmF0ZSBjb25zdHJ1Y3Rvcihcblx0XHRoZWxwZXJzOiBIZWxwZXJzLFxuXHRcdHBhbGV0dGVSZW5kZXJlcjogUGFsZXR0ZVJlbmRlcmVyU2VydmljZSxcblx0XHRzZXJ2aWNlczogU2VydmljZXMsXG5cdFx0dXRpbHM6IFV0aWxpdGllc1xuXHQpIHtcblx0XHR0cnkge1xuXHRcdFx0c2VydmljZXMubG9nLmluZm8oXG5cdFx0XHRcdGBDb25zdHJ1Y3RpbmcgVUlFdmVudHMgaW5zdGFuY2VgLFxuXHRcdFx0XHRgJHtjYWxsZXJ9IGNvbnN0cnVjdG9yYFxuXHRcdFx0KTtcblxuXHRcdFx0dGhpcy4jZG9tU3RvcmUgPSBzZXJ2aWNlcy5kb21TdG9yZTtcblx0XHRcdHRoaXMuI2Vycm9ycyA9IHNlcnZpY2VzLmVycm9ycztcblx0XHRcdHRoaXMuI2hlbHBlcnMgPSBoZWxwZXJzO1xuXHRcdFx0dGhpcy4jbG9nID0gc2VydmljZXMubG9nO1xuXHRcdFx0dGhpcy4jdXRpbHMgPSB1dGlscztcblxuXHRcdFx0Y29uc3QgdmFsaWRhdGVkRWxlbWVudHMgPSB0aGlzLiNkb21TdG9yZS5nZXRFbGVtZW50cygpO1xuXG5cdFx0XHRpZiAoIXZhbGlkYXRlZEVsZW1lbnRzKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XHRgWyR7Y2FsbGVyfSBjb25zdHJ1Y3Rvcl06IENyaXRpY2FsIFVJIGVsZW1lbnRzIG5vdCBmb3VuZC4gQXBwbGljYXRpb24gY2Fubm90IHN0YXJ0IWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy4jZWxlbWVudHMgPSB2YWxpZGF0ZWRFbGVtZW50cztcblx0XHRcdHRoaXMuI3BhbGV0dGVSZW5kZXJlciA9IHBhbGV0dGVSZW5kZXJlcjtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRgWyR7Y2FsbGVyfSBjb25zdHJ1Y3Rvcl06ICR7ZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBlcnJvcn1gXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdHN0YXRpYyBnZXRJbnN0YW5jZShcblx0XHRoZWxwZXJzOiBIZWxwZXJzLFxuXHRcdHBhbGV0dGVSZW5kZXJlcjogUGFsZXR0ZVJlbmRlcmVyU2VydmljZSxcblx0XHRzZXJ2aWNlczogU2VydmljZXMsXG5cdFx0dXRpbHM6IFV0aWxpdGllc1xuXHQpOiBVSUV2ZW50c1NlcnZpY2Uge1xuXHRcdHJldHVybiBzZXJ2aWNlcy5lcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRpZiAoIVVJRXZlbnRzU2VydmljZS4jaW5zdGFuY2UpIHtcblx0XHRcdFx0c2VydmljZXMubG9nLmRlYnVnKFxuXHRcdFx0XHRcdCdObyBVSUV2ZW50cyBpbnN0YW5jZSBleGlzdHMgeWV0LiBDcmVhdGluZyBVSUV2ZW50cyBpbnN0YW5jZScsXG5cdFx0XHRcdFx0YCR7Y2FsbGVyfS5nZXRJbnN0YW5jZWBcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRVSUV2ZW50c1NlcnZpY2UuI2luc3RhbmNlID0gbmV3IFVJRXZlbnRzU2VydmljZShcblx0XHRcdFx0XHRoZWxwZXJzLFxuXHRcdFx0XHRcdHBhbGV0dGVSZW5kZXJlcixcblx0XHRcdFx0XHRzZXJ2aWNlcyxcblx0XHRcdFx0XHR1dGlsc1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gVUlFdmVudHNTZXJ2aWNlLiNpbnN0YW5jZTtcblx0XHR9LCBgWyR7Y2FsbGVyfS5nZXRJbnN0YW5jZV06IEZhaWxlZCB0byBnZXQgVUlFdmVudHMgaW5zdGFuY2UuYCk7XG5cdH1cblxuXHRpbml0KCk6IHZvaWQge1xuXHRcdHJldHVybiB0aGlzLiNlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRFdmVudE1hbmFnZXIuYWRkKGRvY3VtZW50LCAnY2xpY2snLCBldmVudCA9PiB7XG5cdFx0XHRcdGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblxuXHRcdFx0XHQvLyBvcGVuIG1vZGFsXG5cdFx0XHRcdGlmICh0YXJnZXQubWF0Y2hlcyhjbGFzc2VzLm1vZGFsVHJpZ2dlcikpIHtcblx0XHRcdFx0XHRjb25zdCBtb2RhbCA9IHRoaXMuI2hlbHBlcnMuZG9tLmdldEVsZW1lbnQoXG5cdFx0XHRcdFx0XHR0YXJnZXQuZGF0YXNldC5tb2RhbElEIVxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRtb2RhbD8uY2xhc3NMaXN0LnJlbW92ZShjbGFzc2VzLmhpZGRlbik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBjbG9zZSBtb2RhbCB3aGVuIGNsaWNraW5nIG91dHNpZGVcblx0XHRcdFx0aWYgKHRhcmdldC5tYXRjaGVzKGNsYXNzZXMubW9kYWwpKSB7XG5cdFx0XHRcdFx0dGFyZ2V0LmNsYXNzTGlzdC5hZGQoY2xhc3Nlcy5oaWRkZW4pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gaGFuZGxlICdFc2MnIGtleSBwcmVzcyB0byBjbG9zZSBtb2RhbHNcblx0XHRcdEV2ZW50TWFuYWdlci5hZGQoZG9jdW1lbnQsICdrZXlkb3duJywgKChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuXHRcdFx0XHRpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJykge1xuXHRcdFx0XHRcdHRoaXMuI2hlbHBlcnMuZG9tXG5cdFx0XHRcdFx0XHQuZ2V0QWxsRWxlbWVudHMoY2xhc3Nlcy5tb2RhbClcblx0XHRcdFx0XHRcdC5mb3JFYWNoKG1vZGFsID0+IG1vZGFsLmNsYXNzTGlzdC5hZGQoY2xhc3Nlcy5oaWRkZW4pKTtcblx0XHRcdFx0fVxuXHRcdFx0fSkgYXMgRXZlbnRMaXN0ZW5lcik7XG5cdFx0fSwgYFske2NhbGxlcn1dOiBGYWlsZWQgdG8gaW5pdGlhbGl6ZSBVSSBldmVudHMuYCk7XG5cdH1cblxuXHRpbml0QnV0dG9ucygpOiB2b2lkIHtcblx0XHRyZXR1cm4gdGhpcy4jZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0Y29uc3QgYWRkQnV0dG9uRXZlbnQgPSAoXG5cdFx0XHRcdGJ1dHRvbjogSFRNTEVsZW1lbnQgfCBudWxsLFxuXHRcdFx0XHRsb2dNZXNzYWdlOiBzdHJpbmcsXG5cdFx0XHRcdGFjdGlvbj86ICgpID0+IHZvaWRcblx0XHRcdCkgPT4ge1xuXHRcdFx0XHRpZiAoIWJ1dHRvbikgcmV0dXJuO1xuXG5cdFx0XHRcdEV2ZW50TWFuYWdlci5hZGQoYnV0dG9uLCAnY2xpY2snLCAoZTogRXZlbnQpID0+IHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHR0aGlzLiNsb2cuZGVidWcobG9nTWVzc2FnZSwgYCR7Y2FsbGVyfS5pbml0QnV0dG9uc2ApO1xuXG5cdFx0XHRcdFx0YWN0aW9uPy4oKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0XHRhZGRCdXR0b25FdmVudChcblx0XHRcdFx0dGhpcy4jZWxlbWVudHMuYnRucy5kZXNhdHVyYXRlLFxuXHRcdFx0XHQnRGVzYXR1cmF0ZSBidXR0b24gY2xpY2tlZCcsXG5cdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHR0aGlzLiNsb2cud2Fybihcblx0XHRcdFx0XHRcdCdEZXNhdHVyYXRpb24gbG9naWMgbm90IGltcGxlbWVudGVkIScsXG5cdFx0XHRcdFx0XHRgJHtjYWxsZXJ9LmluaXRCdXR0b25zYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdGFkZEJ1dHRvbkV2ZW50KFxuXHRcdFx0XHR0aGlzLiNlbGVtZW50cy5idG5zLmV4cG9ydCxcblx0XHRcdFx0J0V4cG9ydCBidXR0b24gY2xpY2tlZCcsXG5cdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHR0aGlzLiNsb2cud2Fybihcblx0XHRcdFx0XHRcdCdFeHBvcnQgbG9naWMgbm90IGltcGxlbWVudGVkIScsXG5cdFx0XHRcdFx0XHRgJHtjYWxsZXJ9LmluaXRCdXR0b25zYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdGFkZEJ1dHRvbkV2ZW50KFxuXHRcdFx0XHR0aGlzLiNlbGVtZW50cy5idG5zLmdlbmVyYXRlLFxuXHRcdFx0XHQnR2VuZXJhdGUgYnV0dG9uIGNsaWNrZWQnLFxuXHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy4jcGFsZXR0ZVJlbmRlcmVyLnJlbmRlck5ld1BhbGV0dGUoKTtcblx0XHRcdFx0XHR0aGlzLiNsb2cuZGVidWcoXG5cdFx0XHRcdFx0XHQnTmV3IHBhbGV0dGUgZ2VuZXJhdGVkIGFuZCByZW5kZXJlZCcsXG5cdFx0XHRcdFx0XHRgJHtjYWxsZXJ9LmluaXRCdXR0b25zYFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdEV2ZW50TWFuYWdlci5hZGQoXG5cdFx0XHRcdGRvY3VtZW50LFxuXHRcdFx0XHQnY2xpY2snLFxuXHRcdFx0XHR0aGlzLmhhbmRsZVdpbmRvd0NsaWNrLmJpbmQodGhpcylcblx0XHRcdCk7XG5cdFx0fSwgYFske2NhbGxlcn1dOiBGYWlsZWQgdG8gaW5pdGlhbGl6ZSBidXR0b25zLmApO1xuXHR9XG5cblx0YXR0YWNoVG9vbHRpcExpc3RlbmVyKGlkOiBzdHJpbmcsIHRvb2x0aXBUZXh0OiBzdHJpbmcpOiB2b2lkIHtcblx0XHRyZXR1cm4gdGhpcy4jZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IHRoaXMuI2hlbHBlcnMuZG9tLmdldEVsZW1lbnQoaWQpO1xuXG5cdFx0XHRpZiAoIWVsZW1lbnQpIHJldHVybjtcblxuXHRcdFx0RXZlbnRNYW5hZ2VyLmFkZChlbGVtZW50LCAnbW91c2VlbnRlcicsICgpID0+XG5cdFx0XHRcdHRoaXMuI3V0aWxzLmRvbS5jcmVhdGVUb29sdGlwKGVsZW1lbnQsIHRvb2x0aXBUZXh0KVxuXHRcdFx0KTtcblx0XHRcdEV2ZW50TWFuYWdlci5hZGQoZWxlbWVudCwgJ21vdXNlbGVhdmUnLCAoKSA9PlxuXHRcdFx0XHR0aGlzLiN1dGlscy5kb20ucmVtb3ZlVG9vbHRpcChlbGVtZW50KVxuXHRcdFx0KTtcblx0XHR9LCBgWyR7Y2FsbGVyfV06IEZhaWxlZCB0byBhdHRhY2ggdG9vbHRpcCBsaXN0ZW5lciBmb3IgJHtpZH0uYCk7XG5cdH1cblxuXHRwcml2YXRlIGhhbmRsZVdpbmRvd0NsaWNrKGV2ZW50OiBFdmVudCk6IHZvaWQge1xuXHRcdHJldHVybiB0aGlzLiNlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cblx0XHRcdGlmICh0YXJnZXQgPT09IHRoaXMuI2VsZW1lbnRzLmRpdnMuaGVscE1lbnUpIHtcblx0XHRcdFx0dGhpcy4jZWxlbWVudHMuZGl2cy5oZWxwTWVudS5jbGFzc0xpc3QuYWRkKGNsYXNzZXMuaGlkZGVuKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRhcmdldCA9PT0gdGhpcy4jZWxlbWVudHMuZGl2cy5oaXN0b3J5TWVudSkge1xuXHRcdFx0XHR0aGlzLiNlbGVtZW50cy5kaXZzLmhpc3RvcnlNZW51LmNsYXNzTGlzdC5hZGQoY2xhc3Nlcy5oaWRkZW4pO1xuXHRcdFx0fVxuXHRcdH0sIGBbJHtjYWxsZXJ9XTogRmFpbGVkIHRvIGhhbmRsZSB3aW5kb3cgY2xpY2suYCk7XG5cdH1cbn1cbiJdfQ==