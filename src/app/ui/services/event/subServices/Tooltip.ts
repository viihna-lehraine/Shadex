// File: app/ui/services/event/subServices/Tooltip.js

export class TooltipEventSubService {
	private static instance: TooltipEventSubService | null = null;

	constructor() {}

	public static async getInstance() {
		if (!this.instance) {
			this.instance = new TooltipEventSubService();
		}

		return this.instance;
	}

	public initialize(): void {}

	public showToast(message: string): void {
		if (document.querySelector('.toast-message')) return;

		const toast = document.createElement('div');

		toast.className = 'toast-message';
		toast.textContent = message;
		document.body.appendChild(toast);

		setTimeout(() => {
			toast.classList.add('fade-out');
			toast.addEventListener('transitioned', () => toast.remove());
		}, 3000);
	}

	public showTooltip(tooltipElement: HTMLElement): void {
		const tooltip =
			tooltipElement.querySelector<HTMLElement>('.tooltiptext');

		if (tooltip) {
			tooltip.style.visibility = 'visible';
			tooltip.style.opacity = '1';
			setTimeout(() => {
				tooltip.style.visibility = 'hidden';
				tooltip.style.opacity = '0';
			}, 1000);
		}
	}
}
