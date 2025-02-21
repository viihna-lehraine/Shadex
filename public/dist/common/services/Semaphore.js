import { config } from '../../config/index.js';

// File: common/services/Semaphore.ts
const maxLocks = config.env.semaphoreMaxLocks;
const timeout = config.env.semaphoreTimeout;
class Semaphore {
    #isLocked = false;
    #waitingQueue = [];
    #lockCount = 0;
    async acquire() {
        if (this.#lockCount >= maxLocks) {
            throw new Error(`Cannot acquire lock. Maximum number of locks (${maxLocks}) reached.`);
        }
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error(`Lock acquisition timed out after ${timeout} ms`)), timeout);
            const tryAcquire = () => {
                if (!this.#isLocked) {
                    clearTimeout(timer);
                    this.#isLocked = true;
                    resolve();
                }
                else {
                    this.#waitingQueue.push(tryAcquire);
                }
            };
            tryAcquire();
            this.#lockCount++;
        });
    }
    release() {
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

export { Semaphore };
//# sourceMappingURL=Semaphore.js.map
