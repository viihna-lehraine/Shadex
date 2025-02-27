// File: core/helpers/time.ts
const timeHelpersFactory = () => ({
    debounce(func, delay) {
        let timer = null;
        return (...args) => {
            if (timer)
                clearTimeout(timer);
            timer = setTimeout(() => {
                func(...args);
            }, delay);
        };
    }
});

export { timeHelpersFactory };
//# sourceMappingURL=time.js.map
