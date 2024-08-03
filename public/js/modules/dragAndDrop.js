// ColorGen - version 0.5.21-dev
// Licensed under GNU GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
// Author: Viihna Lehraine (reach me at viihna@ViihnaTech.com / viihna.78 (Signal) / Viihna-Lehraine (Github))

// BEGIN CODE



let dragSrcEl = null;


// Drag and Drop - attach drag and drop event listeners to elements
function attachDragAndDropEventListeners(element) {
    if (element) {
        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragover', handleDragOver);
        element.addEventListener('drop', handleDrop);
        element.addEventListener('dragend', handleDragEnd);
    }
};


// Drag and Drop - 1st function
function handleDragStart(e) {
    console.log('executing handleDragStart(e)');

    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
    this.classList.add('dragging');

    console.log('execution of handleDragStart(e) complete');
};


// Drag and Drop - 2nd function
function handleDragOver(e) {
    console.log('executing handleDragOver(e)');

    if (e.preventDefault) {
        e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';

    console.log('execution of handleDragOver(e) complete');

    return false;
};


// Drag and Drop - 3rd function
function handleDrop(e) {
    console.log('executing handleDrop(e)');
    
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (dragSrcEl !== this) {
        const dragSrcId = dragSrcEl.id;
        const dropTargetId = this.id;
        const dragSrcText = dragSrcEl.querySelector('.color-text-output-box').value;
        const dropTargetText = this.querySelector('.color-text-output-box').value;
        const dragSrcOuterHTML = dragSrcEl.outerHTML;
        const dropTargetOuterHTML = this.outerHTML;

        dragSrcEl.outerHTML = dropTargetOuterHTML;
        this.outerHTML = dragSrcOuterHTML;

        const newDragSrcEl = document.getElementById(dropTargetId);
        const newDropTargetEl = document.getElementById(dragSrcId);

        newDragSrcEl.id = dragSrcId;
        newDropTargetEl.id = dropTargetId;

        newDragSrcEl.querySelector('.color-text-output-box').value = dropTargetText;
        newDropTargetEl.querySelector('.color-text-output-box').value = dragSrcText;

        console.log('calling attachEventListeners 2x, once each for parameters newDragSrcEl and newDropTargetEl');

        attachEventListeners(newDragSrcEl);
        attachEventListeners(newDropTargetEl);
    }

    console.log('execution of handleDrop(e) complete');

    return false;
};


// Drag and Drop - 4th function
function handleDragEnd(e) {
    console.log('executing handleDragEnd(e)');

    this.classList.remove('dragging');
    document.querySelectorAll('.color-stripe').forEach((el) => {
        el.classList.remove('dragging');
    });

    console.log('execution of handleDragEnd(e) complete');
};


export { attachDragAndDropEventListeners, handleDragStart, handleDragOver, handleDrop, handleDragEnd };