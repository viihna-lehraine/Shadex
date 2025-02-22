// File: common/factories/services.ts

import {
	DefaultObserverData,
	Helpers,
	LoggerOptions,
	Services
} from '../../types/index.js';
import {
	DataObserver,
	DOMStore,
	ErrorHandler,
	Logger,
	Semaphore
} from '../services/index.js';
import { config } from '../../config/index.js';

export function serviceFactory<
	T extends DefaultObserverData = DefaultObserverData
>(helpers: Helpers, initialData: T): Services<T> {
	console.log('[SERVICE_FACTORY]: Executing createServices.');

	console.log(
		`[SERVICE_FACTORY]: Initializing services with empty placeholder object.`
	);
	const services = {} as Services<T>;

	console.log(
		`[SERVICE_FACTORY]: Initializing Logger and ErrorHandler (creating instances).`
	);
	const logger = Logger.getInstance(helpers);
	services.errors = ErrorHandler.getInstance(helpers, logger);

	if (!logger || !services.errors) {
		throw new Error(
			'[SERVICE_FACTORY]: Logger or ErrorHandler failed to initialize.'
		);
	}

	services.log = (message: string, options: LoggerOptions) => {
		options.level ??= 'info';
		options.verbosity ??= 1;

		if (
			config.mode.log[options.level] &&
			config.mode.log.verbosity >= options.verbosity
		) {
			logger.log(message, options.level, options.caller);
		}

		if (options.level === 'error' && config.mode.showAlerts) {
			alert(message);
		}
	};

	console.log(
		`[SERVICE_FACTORY]: Initializing DOMStore, DataObserver, and Semaphore.`
	);
	services.domStore = DOMStore.getInstance(
		services.errors,
		helpers,
		services.log
	);
	services.observer = new DataObserver<T>(initialData);

	services.setObserverData = (newData: T) => {
		services.observer.setData(newData);
		services.log(
			`DataObserver updated with new data: ${JSON.stringify(newData)}`,
			{
				caller: '[SERVICE_FACTORY.setObserverData]',
				level: 'debug',
				verbosity: 2
			}
		);
	};

	services.semaphore = new Semaphore(services.errors, services.log);

	return services;
}
