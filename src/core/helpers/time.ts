import { TimeHelpers } from '../../types/index.js';

export const timeHelpersFactory = (): TimeHelpers =>
	({
		debounce<T extends (...args: Parameters<T>) => void>(
			func: T,
			delay: number
		): (...args: Parameters<T>) => void {
			let timer: ReturnType<typeof setTimeout> | null = null;

			return (...args: Parameters<T>): void => {
				if (timer) clearTimeout(timer);

				timer = setTimeout(() => {
					func(...args);
				}, delay);
			};
		}
	}) as const;
