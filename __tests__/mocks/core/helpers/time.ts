import { Helpers } from '../../../../src/types/index.js';

export const mockTimeHelpers: Helpers['time'] = {
	debounce: jest
		.fn()
		.mockImplementation(
			<T extends (...args: Parameters<T>) => void>(func: T, delay: number) => {
				console.log(`[Mock debounce]: Called with delay=${delay}`);

				// immediately invoke the function instead of delaying it
				return (...args: Parameters<T>) => {
					console.log(`[Mock debounce]: Executing function immediately.`);
					func(...args);
				};
			}
		)
};

export const mockTimeHelpersFactory = jest.fn(() => mockTimeHelpers);
