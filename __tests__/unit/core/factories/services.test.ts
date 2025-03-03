import { serviceFactory } from '../../../../src/core/factories/services.js';
import {
	ErrorHandlerService,
	LoggerService
} from '../../../../src/core/services/index.js';
import { mockHelpers } from '../../../mocks/core/helpers/index.js';
import {
	mockErrorHandlerService,
	mockLoggerService
} from '../../../mocks/core/services/index.js';

describe('serviceFactory', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should call getInstance() for LoggerService and ErrorHandlerService', () => {
		const loggerSpy = jest
			.spyOn(LoggerService, 'getInstance')
			.mockReturnValue(mockLoggerService);
		const errorHandlerSpy = jest
			.spyOn(ErrorHandlerService, 'getInstance')
			.mockReturnValue(mockErrorHandlerService);

		// Call the factory
		const services = serviceFactory(mockHelpers);

		expect(services.log).toBe(mockLoggerService);
		expect(services.errors).toBe(mockErrorHandlerService);

		expect(loggerSpy).toHaveBeenCalledTimes(1);
		expect(errorHandlerSpy).toHaveBeenCalledTimes(1);

		expect(errorHandlerSpy).toHaveBeenCalledWith(
			mockHelpers,
			mockLoggerService
		);
	});

	it('should log messages when initializing services', () => {
		const logSpy = jest.spyOn(console, 'log').mockImplementation();

		serviceFactory(mockHelpers);

		expect(logSpy).toHaveBeenCalledWith(
			'[SERVICE_FACTORY]: Executing createServices.'
		);
		expect(logSpy).toHaveBeenCalledWith(
			'[SERVICE_FACTORY]: Initializing Logger and ErrorHandler services.'
		);

		logSpy.mockRestore();
	});

	it('should throw an error if services fail to initialize', () => {
		jest.spyOn(LoggerService, 'getInstance').mockReturnValue(null as any);
		jest.spyOn(ErrorHandlerService, 'getInstance').mockReturnValue(null as any);

		expect(() => serviceFactory(mockHelpers)).toThrow(
			'[SERVICE_FACTORY]: Logger and/or ErrorHandler failed to initialize.'
		);
	});
});
