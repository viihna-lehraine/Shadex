// File: common/helpers/time.ts

import { TimeHelpers } from '../../types/index.js';

export const timeHelpersFactory = (): TimeHelpers =>
	({
		debounce<T extends (...args: Parameters<T>) => void>(
			func: T,
			delay: number
		): (...args: Parameters<T>) => void {
			let timeout: ReturnType<typeof setTimeout> | null = null;

			return (...args: Parameters<T>): void => {
				if (timeout) clearTimeout(timeout);

				timeout = setTimeout(() => {
					func(...args);
				}, delay);
			};
		}
	}) as const;
