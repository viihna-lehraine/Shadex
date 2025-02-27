// File: core/utils/dom.ts
async function domUtilitiesFactory(brand, colorUtils, helpers, services, validate) {
    const { errors } = services;
    return errors.handleAsync(async () => {
        const { domParsingUtilitiesFactory } = await import('./partials/dom/parse.js');
        const { partialDOMUtilitiesFactory } = await import('./partials/dom/main.js');
        const domParsingUtilities = domParsingUtilitiesFactory(brand, services);
        const domUtilities = partialDOMUtilitiesFactory(colorUtils, helpers, services, validate);
        return {
            ...domParsingUtilities,
            ...domUtilities
        };
    }, 'Error occurred while creating DOM utilities group');
}

export { domUtilitiesFactory };
//# sourceMappingURL=dom.js.map
