// File: common/utils/dom.ts
async function domUtilsFactory(helpers, services, utils) {
    const { domParsingUtilsFactory } = await import('./partials/dom/parse.js');
    const { partialDOMUtilsFactory } = await import('./partials/dom/main.js');
    const domParsingUtils = domParsingUtilsFactory(services, utils);
    const domUtils = partialDOMUtilsFactory(helpers, services, utils);
    return {
        ...domParsingUtils,
        ...domUtils
    };
}

export { domUtilsFactory };
//# sourceMappingURL=dom.js.map
