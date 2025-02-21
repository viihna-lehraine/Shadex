// File: common/helpers/time.ts
const timeHelpersFactory = () => ({
    debounce(func, delay) {
        let timeout = null;
        return (...args) => {
            if (timeout)
                clearTimeout(timeout);
            timeout = setTimeout(() => {
                func(...args);
            }, delay);
        };
    }
});

export { timeHelpersFactory };
//# sourceMappingURL=time.js.map
