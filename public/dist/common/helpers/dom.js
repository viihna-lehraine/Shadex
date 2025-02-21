// File: common/helpers/dom.ts}
const domHelpersFactory = () => ({
    getAllElements(selector) {
        return document.querySelectorAll(selector);
    },
    getElement(id) {
        return document.getElementById(id);
    }
});

export { domHelpersFactory };
//# sourceMappingURL=dom.js.map
