// File: common/servies/AsyncLock.ts

import { AsyncLockClassInterface } from '../../types/index.js';

export class AsyncLock implements AsyncLockClassInterface {
	private isLocked: boolean = false;
	private waitingQueue: (() => void)[] = [];

	public async acquire(): Promise<void> {
		return new Promise<void>(resolve => {
			const tryAcquire = () => {
				if (!this.isLocked) {
					this.isLocked = true;
					resolve();
				} else {
					this.waitingQueue.push(tryAcquire);
				}
			};
			tryAcquire();
		});
	}

	public release(): void {
		if (!this.isLocked) {
			throw new Error("Cannot release a lock that isn't acquired.");
		}
		this.isLocked = false;
		const next = this.waitingQueue.shift();
		if (next) {
			next();
		}
	}
}
