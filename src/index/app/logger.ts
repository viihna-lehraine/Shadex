// File: src/index/app/logger.ts

export interface LoggerFnDebugInterface {
	validateDOMElements: () => void;
}

export interface LoggerFnVerboseInterface {
	validateDOMElements: () => void;
}

export interface LoggerFnMasterInterface {
	debug: LoggerFnDebugInterface;
	verbose: LoggerFnVerboseInterface;
}
