// File: app/ui/services/SwatchResize.js

export class SwatchResizeService {
	constructor() {
		this.init();
	}

	private init() {
		document.querySelectorAll('.resize-handle').forEach(handle => {
			handle.addEventListener('mousedown', event =>
				this.startResize(event)
			);
		});
	}

	private startResize(event: MouseEvent) {
		const swatch = (event.target as HTMLElement).closest(
			'.swatch'
		) as HTMLElement;
		if (!swatch || swatch.classList.contains('locked')) return;

		const startX = event.clientX;
		const startWidth = swatch.offsetWidth;

		const onMouseMove = (moveEvent: MouseEvent) => {
			const diff = moveEvent.clientX - startX;

			swatch.style.width = `${startWidth + diff}px`;
		};

		const onMouseUp = () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		};

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
	}
}
