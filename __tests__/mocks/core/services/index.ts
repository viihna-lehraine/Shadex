import { Services } from '../../../../src/types/index.js';
import { ErrorHandlerService } from '../../../../src/core/services/index.js';
import { LoggerService } from '../../../../src/core/services/index.js';
import { mockHelpers } from '../../../mocks/core/helpers/index.js';

class mockUserFacingError extends Error {
	constructor(
		message: string,
		public userMessage?: string
	) {
		super(message);
		this.name = 'UserFacingError';
	}
}

const mockLoggerService = Object.create(LoggerService.getInstance());

mockLoggerService.debug = jest.fn();
mockLoggerService.error = jest.fn();
mockLoggerService.info = jest.fn();
mockLoggerService.warn = jest.fn();

const mockErrorHandlerService = Object.create(
	ErrorHandlerService.getInstance(mockHelpers, mockLoggerService)
);

mockErrorHandlerService.handleAndReturn = jest.fn();
mockErrorHandlerService.handleAsync = jest.fn();
mockErrorHandlerService.handleSync = jest.fn();

const mockServices: Services = {
	log: mockLoggerService,
	errors: mockErrorHandlerService
};

export {
	mockUserFacingError,
	mockErrorHandlerService,
	mockLoggerService,
	mockServices
};
