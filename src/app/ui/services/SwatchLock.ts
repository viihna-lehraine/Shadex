// File: app/ui/services/SwatchLock.js

export class SwatchLockService {
	constructor() {
		this.init();
	}

	private init() {
		document.querySelectorAll('.lock-button').forEach(button => {
			button.addEventListener('click', event => this.toggleLock(event));
		});
	}

	private toggleLock(event: Event) {
		const button = event.target as HTMLElement;
		const swatch = button.closest('.swatch') as HTMLElement;
		const isLocked = swatch.classList.toggle('locked');

		// disable interactions when locked
		swatch.draggable = !isLocked;
		swatch.querySelector('input')!.disabled = isLocked;
	}
}
