// File: common/services/Semaphore.ts

import { SemaphoreInterface } from '../../types/index.js';
import { config } from '../../config/index.js';

const maxLocks = config.env.semaphoreMaxLocks;
const timeout = config.env.semaphoreTimeout;

export class Semaphore implements SemaphoreInterface {
	#isLocked: boolean = false;
	#waitingQueue: (() => void)[] = [];
	#lockCount: number = 0;

	async acquire(): Promise<void> {
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
	}

	release(): void {
		if (!this.#isLocked) {
			throw new Error("Cannot release a lock that isn't acquired.");
		}

		this.#isLocked = false;

		const next = this.#waitingQueue.shift();

		this.#lockCount--;
		if (next) {
			next();
		}
	}
}
