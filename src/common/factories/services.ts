// File: common/factories/services.ts

import { DefaultObserverData, Helpers, Services } from '../../types/index.js';
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
	console.log('[ServiceFactory-1] Loading createServices...');

	const services = {} as Services<T>;

	const logger = Logger.getInstance(helpers);
	services.errors = ErrorHandler.getInstance(helpers, logger);

	if (!logger || !services.errors) {
		throw new Error(
			'[ServiceFactory-2] Logger or ErrorHandler failed to initialize.'
		);
	}

	services.log = (
		message: string,
		level: 'debug' | 'info' | 'warn' | 'error' = 'info',
		verbosityRequirement: number = 0
	) => {
		if (
			config.mode.log[level] &&
			config.mode.log.verbosity >= verbosityRequirement
		) {
			const caller = helpers.data.getCallerInfo();
			logger.log(message, level, caller);
		}

		if (level === 'error' && config.mode.showAlerts) {
			alert(message);
		}
	};

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
			'debug',
			2
		);
	};

	services.semaphore = new Semaphore();

	return services;
}
