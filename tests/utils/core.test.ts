import { core } from '../../src/utils/core';

describe('core module', () => {
    describe('clone', () => {
        it('should deeply clone a simple object', () => {
            const original = { name: 'Viihna', age: 25 };
            const cloned = core.clone(original);

            expect(cloned).toEqual(original);
            expect(cloned).not.toBe(original);
        });

        it('should deeply clone an array', () => {
            const original = [1, 2, 3];
            const cloned = core.clone(original);

            expect(cloned).toEqual(original);
            expect(cloned).not.toBe(original);
        });

        it('should handle cloning nested objects', () => {
            const original = { a: { b: { c: 42 } } };
            const cloned = core.clone(original);

            expect(cloned).toEqual(original);
            expect(cloned).not.toBe(original);
            expect(cloned.a.b).not.toBe(original.a.b);
        });
    });

    describe('debounce', () => {
        jest.useFakeTimers();

        it('should debounce function calls', () => {
            const mockFn = jest.fn();
            const debouncedFn = core.debounce(mockFn, 500);

            debouncedFn();
            debouncedFn();
            debouncedFn();

            jest.advanceTimersByTime(500);

            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        it('should reset the timer if called repeatedly', () => {
            const mockFn = jest.fn();
            const debouncedFn = core.debounce(mockFn, 300);

            debouncedFn();
            jest.advanceTimersByTime(100);
            debouncedFn();
            jest.advanceTimersByTime(100);
            debouncedFn();

            jest.advanceTimersByTime(300);

            expect(mockFn).toHaveBeenCalledTimes(1);
        });
    });

    describe('isInRange', () => {
        it('should return true if value is within the range', () => {
            expect(core.isInRange(5, 1, 10)).toBe(true);
        });

        it('should return false if value is below the range', () => {
            expect(core.isInRange(0, 1, 10)).toBe(false);
        });

        it('should return false if value is above the range', () => {
            expect(core.isInRange(15, 1, 10)).toBe(false);
        });

        it('should return true if value is on the lower boundary', () => {
            expect(core.isInRange(1, 1, 10)).toBe(true);
        });

        it('should return true if value is on the upper boundary', () => {
            expect(core.isInRange(10, 1, 10)).toBe(true);
        });
    });
});
