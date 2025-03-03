import { ErrorHandlerService } from '../../../../src/core/services/index.js';
import { mockErrorHandlerService } from '../../../mocks/core/services/index.js';

describe('ErrorHandlerService Mock', () => {
	it('should return the mocked ErrorHandlerService instance', () => {
		const instance = ErrorHandlerService.getInstance({} as any, {} as any);
		expect(instance).toBe(mockErrorHandlerService);
	});

	it('should call handleAndReturn correctly', () => {
		const mockAction = jest.fn(() => 'test result');
		const result = mockErrorHandlerService.handleAndReturn(
			mockAction,
			'Test error'
		);

		expect(mockAction).toHaveBeenCalled();
		expect(result).toBe('test result');
	});

	it('should handle errors in handleAndReturn', () => {
		const mockAction = jest.fn(() => {
			throw new Error('Test error');
		});

		expect(() =>
			mockErrorHandlerService.handleAndReturn(mockAction, 'Test error')
		).not.toThrow();
	});

	it('should call handleAsync correctly', async () => {
		const mockAction = jest.fn(async () => 'async result');
		const result = await mockErrorHandlerService.handleAsync(
			mockAction,
			'Test async error'
		);

		expect(mockAction).toHaveBeenCalled();
		expect(result).toBe('async result');
	});

	it('should call handleSync correctly', () => {
		const mockAction = jest.fn(() => 'sync result');
		const result = mockErrorHandlerService.handleSync(
			mockAction,
			'Test sync error'
		);

		expect(mockAction).toHaveBeenCalled();
		expect(result).toBe('sync result');
	});
});
