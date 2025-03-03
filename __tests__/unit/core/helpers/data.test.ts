import { dataHelpersFactory } from '../../../../src/core/helpers/data.js';
import { mockTypeGuards } from '../../../mocks/core/helpers/index.js';

describe('dataHelpersFactory', () => {
	it('should return a DataHelpers object with the correct methods', () => {
		const result = dataHelpersFactory(mockTypeGuards); // Call the real factory

		expect(result).toHaveProperty('deepClone');
		expect(result).toHaveProperty('deepFreeze');
		expect(result).toHaveProperty('getCallerInfo');
		expect(result).toHaveProperty('getFormattedTimestamp');
		expect(result).toHaveProperty('parseValue');
		expect(result).toHaveProperty('tracePromise');

		expect(result.deepClone).toBeInstanceOf(Function);
		expect(result.deepFreeze).toBeInstanceOf(Function);
		expect(result.getCallerInfo).toBeInstanceOf(Function);
		expect(result.getFormattedTimestamp).toBeInstanceOf(Function);
		expect(result.parseValue).toBeInstanceOf(Function);
		expect(result.tracePromise).toBeInstanceOf(Function);
	});

	it('should deepClone correctly', () => {
		const helpers = dataHelpersFactory(mockTypeGuards);
		const mockObj = { a: 1 };
		const cloned = helpers.deepClone(mockObj);

		expect(cloned).toEqual(mockObj);
		expect(cloned).not.toBe(mockObj);
	});

	it('should deepFreeze correctly', () => {
		const helpers = dataHelpersFactory(mockTypeGuards);
		const mockObj = { a: 1 };
		const frozen = helpers.deepFreeze(mockObj);

		expect(Object.isFrozen(frozen)).toBe(true);
	});

	it('should getCallerInfo correctly', () => {
		const helpers = dataHelpersFactory(mockTypeGuards);
		expect(typeof helpers.getCallerInfo()).toBe('string');
	});

	it('should getFormattedTimestamp correctly', () => {
		const helpers = dataHelpersFactory(mockTypeGuards);
		expect(typeof helpers.getFormattedTimestamp()).toBe('string');
	});

	it('should parseValue correctly', () => {
		const helpers = dataHelpersFactory(mockTypeGuards);
		expect(helpers.parseValue('50%')).toBe(50);
		expect(helpers.parseValue(42)).toBe(42);
	});

	it('should tracePromise correctly', async () => {
		const helpers = dataHelpersFactory(mockTypeGuards);
		const mockPromise = Promise.resolve('mocked result');

		await expect(helpers.tracePromise(mockPromise, 'testLabel')).resolves.toBe(
			'mocked result'
		);
	});
});
