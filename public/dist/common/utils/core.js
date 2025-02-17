import { dataSets } from '../../data/sets.js';

// File: common/utils/core.js
const sets = dataSets;
function clampToRange(value, rangeKey) {
    const [min, max] = sets[rangeKey];
    return Math.min(Math.max(value, min), max);
}
function clone(value) {
    return structuredClone(value);
}
function debounce(func, delay) {
    let timeout = null;
    return (...args) => {
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args);
        }, delay);
    };
}
function getAllElements(selector) {
    return document.querySelectorAll(selector);
}
function getElement(id) {
    return document.getElementById(id);
}
const coreUtils = {
    clampToRange,
    clone,
    debounce,
    getAllElements,
    getElement
};

export { coreUtils };
//# sourceMappingURL=core.js.map
