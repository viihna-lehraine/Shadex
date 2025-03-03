import { Helpers } from '../../../../src/types/index.js';
import { dataHelpersFactory } from '../../../../src/core/helpers/data.js';
import { mockTypeGuards } from './typeGuards.js';

export const mockDataHelpers: Helpers['data'] = {
	deepClone: jest.fn().mockImplementation(<T>(value: T): T => {
		console.log(`[Mock deepClone]: Called with value`, value);
		return structuredClone(value);
	}),

	deepFreeze: jest.fn().mockImplementation(<T>(obj: T): T => {
		console.log(`[Mock deepFreeze]: Called with obj`, obj);
		return Object.freeze(structuredClone(obj));
	}),

	getCallerInfo: jest.fn().mockImplementation((): string => {
		console.log(`[Mock getCallerInfo]: Returning mock caller info`);
		return 'mockFunction (mockFile.ts:10:5)';
	}),

	getFormattedTimestamp: jest.fn().mockImplementation((): string => {
		console.log(`[Mock getFormattedTimestamp]: Returning mock timestamp`);
		return '2025-03-01 12:34:56';
	}),

	parseValue: jest.fn().mockImplementation((value: string | number): number => {
		console.log(`[Mock parseValue]: Called with value`, value);
		if (typeof value === 'string' && value.endsWith('%')) {
			return parseFloat(value.slice(0, -1));
		}
		return Number(value);
	}),

	tracePromise: jest
		.fn()
		.mockImplementation(
			async (promise: Promise<unknown>, label: string): Promise<unknown> => {
				console.log(`[Mock tracePromise]: Called with label ${label}`);
				try {
					const result = await promise;
					console.log(`[Mock tracePromise]: Success for ${label}`, result);
					return result;
				} catch (error) {
					console.error(`[Mock tracePromise]: Error for ${label}`, error);
					throw error;
				}
			}
		)
};

export const mockDataHelpersFactory = jest.fn(
	(typeGuards: Helpers['typeGuards']) => mockDataHelpers
);
