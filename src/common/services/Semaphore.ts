// File: common/services/Semaphore.ts

import { SemaphoreInterface, Services } from '../../types/index.js';
import { config } from '../../config/index.js';

const caller = 'Semaphore';
const maxLocks = config.env.semaphoreMaxLocks;
const timeout = config.env.semaphoreTimeout;

export class Semaphore implements SemaphoreInterface {
	#isLocked: boolean = false;
	#waitingQueue: (() => void)[] = [];
	#lockCount: number = 0;
	#errors: Services['errors'];
	#log: Services['log'];

	constructor(errors: Services['errors'], log: Services['log']) {
		log('Constructing Semaphore instance.', {
			caller: `${caller} constructor`
		});
		this.#errors = errors;
		this.#log = log;
	}

	async acquire(): Promise<void> {
		return this.#errors.handleAndReturn(() => {
			this.#log('Semaphore acquiring lock.', {
				caller: `${caller}.acquire`,
				level: 'debug'
			});

			if (this.#lockCount >= maxLocks) {
				throw new Error(
					`Cannot acquire lock. Maximum number of locks (${maxLocks}) reached.`
				);
			}

			return new Promise<void>((resolve, reject) => {
				const timer = setTimeout(
					() =>
						reject(
							new Error(
								`Lock acquisition timed out after ${timeout} ms`
							)
						),
					timeout
				);

				const tryAcquire = () => {
					if (!this.#isLocked) {
						clearTimeout(timer);

						this.#isLocked = true;

						resolve();
					} else {
						this.#waitingQueue.push(tryAcquire);
					}
				};

				tryAcquire();

				this.#lockCount++;
			});
		}, 'Error acquiring semaphore lock.');
	}

	release(): void {
		return this.#errors.handleAndReturn(() => {
			this.#log('Semaphore releasing lock.', {
				caller: `${caller}.release`,
				level: 'debug'
			});
			if (!this.#isLocked) {
				throw new Error("Cannot release a lock that isn't acquired.");
			}

			this.#isLocked = false;

			const next = this.#waitingQueue.shift();

			this.#lockCount--;
			if (next) {
				next();
			}
		}, 'Error releasing semaphore lock.') as void;
	}
}
