// File: common/services/Logger.ts

import { Helpers, LoggerInterface, MutationLog } from '../../types/index.js';
import { config } from '../../config/index.js';

const caller = 'Logger';
const mode = config.mode;
const debugLevel = mode.debugLevel;

export class Logger implements LoggerInterface {
	static #instance: Logger | null = null;

	#getCallerInfo: Helpers['data']['getCallerInfo'];

	constructor(helpers: Helpers) {
		try {
			this.#getCallerInfo = helpers.data.getCallerInfo;

			console.log(
				`[${caller}]: Logger class constructor executed successfully.`
			);
		} catch (error) {
			throw new Error(
				`[${caller} constructor]: ${error instanceof Error ? error.message : error}`
			);
		}
	}

	static getInstance(helpers: Helpers): Logger {
		try {
			console.log(`[${caller}]: Executing getInstance.`);

			if (!Logger.#instance) {
				console.log(
					`[${caller}]: No instance found. Creating new instance.`
				);

				Logger.#instance = new Logger(helpers);

				console.log(`[${caller}]: Instance created.`);
			}

			console.log(`[${caller}]: Returning existing instance.`);

			return Logger.#instance;
		} catch (error) {
			throw new Error(
				`[${caller}.getInstance]: ${error instanceof Error ? error.message : error}`
			);
		}
	}

	log(
		message: string,
		level: 'debug' | 'info' | 'warn' | 'error' = 'info',
		caller?: string
	): void {
		if (debugLevel >= 5) {
			console.log(`[${caller}.log] Log function CALLED with:`, {
				message,
				level,
				debugLevel,
				caller
			});
		}

		this.#logMessage(message, level, caller);
	}

	logMutation(
		data: MutationLog,
		logCallback: (data: MutationLog) => void = () => {}
	): void {
		this.log(this.#formatMutationLog(data), 'info');

		logCallback(data);
	}

	#logMessage(
		message: string,
		level: 'debug' | 'info' | 'warn' | 'error',
		caller?: string
	): void {
		if (level === 'info' || debugLevel < this.#getDebugThreshold(level)) {
			return;
		}

		const callerInfo = caller || this.#getCallerInfo();
		const timestamp = this.#getFormattedTimestamp();

		try {
			console.log(
				`%c[${level.toUpperCase()}]%c ${timestamp} [${callerInfo}] %c${message}`,
				this.#getLevelColor(level),
				'color: gray',
				'color: inherit'
			);
		} catch (error) {
			console.error(
				`[${caller}]: Logger encountered an unexpected error: ${error}.`
			);
		}

		if (
			callerInfo === 'Unknown caller' &&
			debugLevel > 1 &&
			mode.stackTrace
		) {
			console.trace(`[${caller}]: Full Stack Trace:`);
		}
	}

	#formatMutationLog(data: MutationLog): string {
		return `Mutation logged: ${JSON.stringify(data)}`;
	}

	#getDebugThreshold(level: 'debug' | 'info' | 'warn' | 'error'): number {
		switch (level) {
			case 'debug':
				return 2;
			case 'info':
				return 1;
			case 'warn':
				return 0;
			case 'error':
				return 0;
			default:
				return 0;
		}
	}

	#getFormattedTimestamp(): string {
		return new Date().toLocaleString('en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		});
	}

	#getLevelColor(level: 'debug' | 'info' | 'warn' | 'error'): string {
		switch (level) {
			case 'debug':
				return 'color: green';
			case 'info':
				return 'color: blue';
			case 'warn':
				return 'color: orange';
			case 'error':
				return 'color: red';
			default:
				return 'color: black';
		}
	}
}
