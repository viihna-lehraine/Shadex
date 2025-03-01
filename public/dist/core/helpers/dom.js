// File: core/helpers/dom.ts
const domHelpersFactory = () => ({
    getAllElements(selector) {
        console.log(`[domHelpers > getAllElements]: Looking for elements with selector: ${selector}.`);
        const elements = document.querySelectorAll(selector);
        console.log(`[getAllElements]: Found ${elements.length} elements.`);
        return elements;
    },
    getElement(id) {
        return document.getElementById(id);
    }
});

export { domHelpersFactory };
//# sourceMappingURL=dom.js.map
