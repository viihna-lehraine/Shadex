import { Helpers } from '../../../../src/types/index.js';

export const mockDOMHelpers: Helpers['dom'] = {
	getAllElements: jest
		.fn()
		.mockImplementation(
			<T extends HTMLElement>(selector: string): NodeListOf<T> => {
				console.log(`[Mock getAllElements]: Called with selector ${selector}`);

				const elements = Array.from({ length: 5 }, (_, index) => {
					const el = document.createElement('div');
					el.id = `mock-${index}`;
					return el;
				}) as unknown as T[];

				return Object.assign(elements, {
					item: (index: number) => elements[index] ?? null,
					forEach: elements.forEach.bind(elements),
					[Symbol.iterator]: elements[Symbol.iterator].bind(elements)
				}) as NodeListOf<T>;
			}
		),

	getElement: jest
		.fn()
		.mockImplementation(<T extends HTMLElement>(id: string): T | null => {
			console.log(`[Mock getElement]: Called with id ${id}`);

			return {
				id,
				classList: { add: jest.fn(), remove: jest.fn() }
			} as unknown as T;
		})
};

export const mockDOMHelpersFactory = jest.fn(() => mockDOMHelpers);
