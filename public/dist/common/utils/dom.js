// File: common/utils/dom.ts
async function domUtilsFactory(brand, colorUtils, helpers, services, validate) {
    const { errors } = services;
    return errors.handleAsync(async () => {
        const { domParsingUtilsFactory } = await import('./partials/dom/parse.js');
        const { partialDOMUtilsFactory } = await import('./partials/dom/main.js');
        const domParsingUtils = domParsingUtilsFactory(brand, services);
        const domUtils = partialDOMUtilsFactory(colorUtils, helpers, services, validate);
        return {
            ...domParsingUtils,
            ...domUtils
        };
    }, 'Error occurred while creating DOM utilities group');
}

export { domUtilsFactory };
//# sourceMappingURL=dom.js.map
