// File: data/dom/dom.js
const classes = {
    colorDisplay: 'color-display',
    colorInput: 'color-input',
    colorInputBtn: 'color-input-btn',
    colorInputModal: 'color-input-modal',
    colorStripe: 'color-stripe',
    colorSwatch: 'color-swatch',
    dragHandle: 'drag-handle',
    hidden: 'hidden',
    lockBtn: 'lock-btn',
    locked: 'locked',
    modal: 'modal',
    modalTrigger: 'modal-trigger',
    paletteColumn: 'palette-column',
    resizeHandle: 'resize-handle',
    tooltipContainer: 'tooltip-container',
    tooltipTrigger: 'tooltip-trigger'
};
const ids = {
    btns: {
        desaturate: 'desaturate-btn',
        export: 'export-btn',
        generate: 'generate-btn',
        helpMenu: 'help-menu-btn',
        historyMenu: 'history-menu-btn',
        import: 'import-btn',
        saturate: 'saturate-btn',
        showAsCMYK: 'show-as-cmyk-btn',
        showAsHex: 'show-as-hex-btn',
        showAsHSL: 'show-as-hsl-btn',
        showAsHSV: 'show-as-hsv-btn',
        showAsLAB: 'show-as-lab-btn',
        showAsRGB: 'show-as-rgb-btn'
    },
    divs: {
        helpMenu: 'help-menu',
        historyMenu: 'history-menu',
        paletteContainer: 'palette-container',
        paletteHistory: 'palette-history'
    },
    inputs: {
        limitDarkChkbx: 'limit-dark-chkbx',
        limitGrayChkbx: 'limit-gray-chkbx',
        limitLightChkbx: 'limit-light-chkbx'
    },
    selectors: {
        paletteColumn: 'palette-column-selector',
        paletteColumnCount: 'palette-column-count-selector',
        paletteType: 'palette-type-selector'
    }
};
const dynamicIDs = {
    divs: {
        globalTooltip: 'global-tooltip'
    }
};
function getElement(id) {
    return document.getElementById(id);
}
const btnIds = ids.btns;
const divIds = ids.divs;
const inputIds = ids.inputs;
const selectorIds = ids.selectors;
const dynamicElements = {
    divs: {
        globalTooltip: getElement(dynamicIDs.divs.globalTooltip)
    }
};
const elements = {
    get btns() {
        return {
            desaturate: getElement(btnIds.desaturate),
            export: getElement(btnIds.export),
            generate: getElement(btnIds.generate),
            helpMenu: getElement(btnIds.helpMenu),
            historyMenu: getElement(btnIds.historyMenu),
            import: getElement(btnIds.import),
            saturate: getElement(btnIds.saturate),
            showAsCMYK: getElement(btnIds.showAsCMYK),
            showAsHex: getElement(btnIds.showAsHex),
            showAsHSL: getElement(btnIds.showAsHSL),
            showAsHSV: getElement(btnIds.showAsHSV),
            showAsLAB: getElement(btnIds.showAsLAB),
            showAsRGB: getElement(btnIds.showAsRGB)
        };
    },
    get divs() {
        return {
            helpMenu: getElement(divIds.helpMenu),
            historyMenu: getElement(divIds.historyMenu),
            paletteContainer: getElement(divIds.paletteContainer),
            paletteHistory: getElement(divIds.paletteHistory)
        };
    },
    get inputs() {
        return {
            limitDarkChkbx: getElement(inputIds.limitDarkChkbx),
            limitGrayChkbx: getElement(inputIds.limitGrayChkbx),
            limitLightChkbx: getElement(inputIds.limitLightChkbx)
        };
    },
    get selectors() {
        return {
            paletteColumn: getElement(selectorIds.paletteColumn),
            paletteColumnCount: getElement(selectorIds.paletteColumnCount),
            paletteType: getElement(selectorIds.paletteType)
        };
    }
};
const domData = {
    classes,
    dynamicElements,
    dynamicIDs,
    ids,
    elements
};

export { domData };
//# sourceMappingURL=dom.js.map
