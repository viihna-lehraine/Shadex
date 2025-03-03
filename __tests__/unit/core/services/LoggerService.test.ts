import { LoggerService } from '../../../../src/core/services/LoggerService.js';
import { mockLoggerService } from '../../../mocks/core/services/index.js';

describe('LoggerService Mock', () => {
	it('should return the mocked LoggerService instance', () => {
		const instance = LoggerService.getInstance();
		expect(instance).toBe(mockLoggerService);
	});

	it('should call debug method correctly', () => {
		mockLoggerService.debug('Test debug message', 'TestCaller');
		expect(mockLoggerService.debug).toHaveBeenCalledWith(
			'Test debug message',
			'TestCaller'
		);
	});

	it('should call error method correctly', () => {
		mockLoggerService.error('Test error message', 'TestCaller');
		expect(mockLoggerService.error).toHaveBeenCalledWith(
			'Test error message',
			'TestCaller'
		);
	});

	it('should call info method correctly', () => {
		mockLoggerService.info('Test info message', 'TestCaller');
		expect(mockLoggerService.info).toHaveBeenCalledWith(
			'Test info message',
			'TestCaller'
		);
	});

	it('should call warn method correctly', () => {
		mockLoggerService.warn('Test warn message', 'TestCaller');
		expect(mockLoggerService.warn).toHaveBeenCalledWith(
			'Test warn message',
			'TestCaller'
		);
	});
});
