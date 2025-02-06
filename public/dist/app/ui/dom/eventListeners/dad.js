// File: app/ui/dom/eventListeners/dad.js
import { createLogger } from '../../../../logger/factory.js';
import { modeData as mode } from '../../../../data/mode.js';
const logMode = mode.logging;
const thisModule = 'dom/eventListeners/groups/dad.js';
const logger = await createLogger();
let dragSrcEl = null;
export function attachDADListeners(element) {
    const thisFunction = 'attach()';
    try {
        if (element) {
            element.addEventListener('dragstart', dragStart);
            element.addEventListener('dragover', dragOver);
            element.addEventListener('drop', drop);
            element.addEventListener('dragend', dragEnd);
        }
        if (logMode.debug && logMode.verbosity >= 4)
            logger.debug('Drag and drop event listeners successfully attached', `${thisModule} > ${thisFunction}`);
    }
    catch (error) {
        if (!logMode.error)
            logger.error(`Failed to execute attachDragAndDropEventListeners: ${error}`, `${thisModule} > ${thisFunction}`);
    }
}
function dragStart(e) {
    const thisFunction = 'handleDragStart()';
    try {
        dragSrcEl = e.currentTarget;
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', dragSrcEl.outerHTML);
        }
        if (logMode.debug && logMode.verbosity === 5)
            logger.info('handleDragStart complete', `${thisModule} > ${thisFunction}`);
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Error in handleDragStart: ${error}`, `${thisModule} > ${thisFunction}`);
    }
}
function dragOver(e) {
    const thisMethod = 'handleDragOver()';
    try {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }
        if (mode.debug && logMode.verbosity === 5)
            logger.info('handleDragOver complete', `${thisModule} > ${thisMethod}`);
        return false;
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Error in handleDragOver: ${error}`, `${thisModule} > ${thisMethod}`);
        return false;
    }
}
function dragEnd(e) {
    const thisMethod = 'handleDragEnd()';
    try {
        const target = e.currentTarget;
        target.classList.remove('dragging');
        document.querySelectorAll('.color-stripe').forEach(el => {
            el.classList.remove('dragging');
        });
        if (mode.debug && logMode.verbosity === 5)
            logger.info('handleDragEnd complete', `${thisModule} > ${thisMethod}`);
    }
    catch (error) {
        if (logMode.error)
            logger.error(`Error in handleDragEnd: ${error}`, `${thisModule} > ${thisMethod}`);
    }
}
function drop(e) {
    const thisMethod = 'drop()';
    try {
        e.stopPropagation();
        const target = e.currentTarget;
        if (dragSrcEl && dragSrcEl !== target) {
            const dragSrcId = dragSrcEl.id;
            const dropTargetId = target.id;
            const dragSrcText = dragSrcEl.querySelector('.color-text-output-box').value;
            const dropTargetText = target.querySelector('.color-text-output-box').value;
            const dragSrcOuterHTML = dragSrcEl.outerHTML;
            const dropTargetOuterHTML = target.outerHTML;
            dragSrcEl.outerHTML = dropTargetOuterHTML;
            target.outerHTML = dragSrcOuterHTML;
            const newDragSrcEl = document.getElementById(dropTargetId);
            const newDropTargetEl = document.getElementById(dragSrcId);
            newDragSrcEl.id = dragSrcId;
            newDropTargetEl.id = dropTargetId;
            newDragSrcEl.querySelector('.color-text-output-box').value = dropTargetText;
            newDropTargetEl.querySelector('.color-text-output-box').value = dragSrcText;
            if (mode.debug && logMode.verbosity >= 4)
                logger.debug('calling attachDragAndDropEventListeners for new elements', `${thisModule} > ${thisMethod}`);
            attachDADListeners(newDragSrcEl);
            attachDADListeners(newDropTargetEl);
        }
        if (logMode.debug && logMode.verbosity === 5)
            logger.info('handleDrop complete', `${thisModule} > ${thisMethod}`);
    }
    catch (error) {
        if (!logMode.error)
            logger.error(`Error in handleDrop: ${error}`, `${thisModule} > ${thisMethod}`);
    }
}
export const dadListeners = {
    attach: attachDADListeners
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC91aS9kb20vZXZlbnRMaXN0ZW5lcnMvZGFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlDQUF5QztBQUV6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDN0QsT0FBTyxFQUFFLFFBQVEsSUFBSSxJQUFJLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUU1RCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBRTdCLE1BQU0sVUFBVSxHQUFHLGtDQUFrQyxDQUFDO0FBRXRELE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxFQUFFLENBQUM7QUFFcEMsSUFBSSxTQUFTLEdBQXVCLElBQUksQ0FBQztBQUV6QyxNQUFNLFVBQVUsa0JBQWtCLENBQUMsT0FBMkI7SUFDN0QsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDO0lBRWhDLElBQUksQ0FBQztRQUNKLElBQUksT0FBTyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2pELE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDL0MsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2QyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFFRCxJQUFJLE9BQU8sQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLFNBQVMsSUFBSSxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxLQUFLLENBQ1gscURBQXFELEVBQ3JELEdBQUcsVUFBVSxNQUFNLFlBQVksRUFBRSxDQUNqQyxDQUFDO0lBQ0osQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFD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LEdBQUcsV0FBVyxDQUFDO1lBRXRCLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUM7Z0JBQ3ZDLE1BQU0sQ0FBQyxLQUFLLENBQ1gsMERBQTBELEVBQzFELEdBQUcsVUFBVSxNQUFNLFVBQVUsRUFBRSxDQUMvQixDQUFDO1lBRUgsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFakMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUVELElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLENBQUM7WUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLFVBQVUsTUFBTSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSztZQUNqQixNQUFNLENBQUMsS0FBSyxDQUNYLHdCQUF3QixLQUFLLEVBQUUsRUFDL0IsR0FBRyxVQUFVLE1BQU0sVUFBVSxFQUFFLENBQy9CLENBQUM7SUFDSixDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRztJQUMzQixNQUFNLEVBQUUsa0JBQWtCO0NBQzFCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBhcHAvdWkvZG9tL2V2ZW50TGlzdGVuZXJzL2RhZC5qc1xuXG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9sb2dnZXIvZmFjdG9yeS5qcyc7XG5pbXBvcnQgeyBtb2RlRGF0YSBhcyBtb2RlIH0gZnJvbSAnLi4vLi4vLi4vLi4vZGF0YS9tb2RlLmpzJztcblxuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcblxuY29uc3QgdGhpc01vZHVsZSA9ICdkb20vZXZlbnRMaXN0ZW5lcnMvZ3JvdXBzL2RhZC5qcyc7XG5cbmNvbnN0IGxvZ2dlciA9IGF3YWl0IGNyZWF0ZUxvZ2dlcigpO1xuXG5sZXQgZHJhZ1NyY0VsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gYXR0YWNoREFETGlzdGVuZXJzKGVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCk6IHZvaWQge1xuXHRjb25zdCB0aGlzRnVuY3Rpb24gPSAnYXR0YWNoKCknO1xuXG5cdHRyeSB7XG5cdFx0aWYgKGVsZW1lbnQpIHtcblx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZHJhZ1N0YXJ0KTtcblx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBkcmFnT3Zlcik7XG5cdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBkcm9wKTtcblx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsIGRyYWdFbmQpO1xuXHRcdH1cblxuXHRcdGlmIChsb2dNb2RlLmRlYnVnICYmIGxvZ01vZGUudmVyYm9zaXR5ID49IDQpXG5cdFx0XHRsb2dnZXIuZGVidWcoXG5cdFx0XHRcdCdEcmFnIGFuZCBkcm9wIGV2ZW50IGxpc3RlbmVycyBzdWNjZXNzZnVsbHkgYXR0YWNoZWQnLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc0Z1bmN0aW9ufWBcblx0XHRcdCk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKCFsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgRmFpbGVkIHRvIGV4ZWN1dGUgYXR0YWNoRHJhZ0FuZERyb3BFdmVudExpc3RlbmVyczogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc0Z1bmN0aW9ufWBcblx0XHRcdCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZHJhZ1N0YXJ0KGU6IERyYWdFdmVudCk6IHZvaWQge1xuXHRjb25zdCB0aGlzRnVuY3Rpb24gPSAnaGFuZGxlRHJhZ1N0YXJ0KCknO1xuXG5cdHRyeSB7XG5cdFx0ZHJhZ1NyY0VsID0gZS5jdXJyZW50VGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG5cdFx0aWYgKGUuZGF0YVRyYW5zZmVyKSB7XG5cdFx0XHRlLmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ21vdmUnO1xuXHRcdFx0ZS5kYXRhVHJhbnNmZXIuc2V0RGF0YSgndGV4dC9odG1sJywgZHJhZ1NyY0VsLm91dGVySFRNTCk7XG5cdFx0fVxuXG5cdFx0aWYgKGxvZ01vZGUuZGVidWcgJiYgbG9nTW9kZS52ZXJib3NpdHkgPT09IDUpXG5cdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0J2hhbmRsZURyYWdTdGFydCBjb21wbGV0ZScsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzRnVuY3Rpb259YFxuXHRcdFx0KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEVycm9yIGluIGhhbmRsZURyYWdTdGFydDogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc0Z1bmN0aW9ufWBcblx0XHRcdCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZHJhZ092ZXIoZTogRHJhZ0V2ZW50KTogYm9vbGVhbiB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAnaGFuZGxlRHJhZ092ZXIoKSc7XG5cblx0dHJ5IHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRpZiAoZS5kYXRhVHJhbnNmZXIpIHtcblx0XHRcdGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbW92ZSc7XG5cdFx0fVxuXG5cdFx0aWYgKG1vZGUuZGVidWcgJiYgbG9nTW9kZS52ZXJib3NpdHkgPT09IDUpXG5cdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0J2hhbmRsZURyYWdPdmVyIGNvbXBsZXRlJyxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEVycm9yIGluIGhhbmRsZURyYWdPdmVyOiAke2Vycm9yfWAsXG5cdFx0XHRcdGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWBcblx0XHRcdCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxuZnVuY3Rpb24gZHJhZ0VuZChlOiBEcmFnRXZlbnQpOiB2b2lkIHtcblx0Y29uc3QgdGhpc01ldGhvZCA9ICdoYW5kbGVEcmFnRW5kKCknO1xuXG5cdHRyeSB7XG5cdFx0Y29uc3QgdGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG5cdFx0dGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJyk7XG5cblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY29sb3Itc3RyaXBlJykuZm9yRWFjaChlbCA9PiB7XG5cdFx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpO1xuXHRcdH0pO1xuXG5cdFx0aWYgKG1vZGUuZGVidWcgJiYgbG9nTW9kZS52ZXJib3NpdHkgPT09IDUpXG5cdFx0XHRsb2dnZXIuaW5mbyhcblx0XHRcdFx0J2hhbmRsZURyYWdFbmQgY29tcGxldGUnLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKVxuXHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRgRXJyb3IgaW4gaGFuZGxlRHJhZ0VuZDogJHtlcnJvcn1gLFxuXHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc01ldGhvZH1gXG5cdFx0XHQpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGRyb3AoZTogRHJhZ0V2ZW50KTogdm9pZCB7XG5cdGNvbnN0IHRoaXNNZXRob2QgPSAnZHJvcCgpJztcblxuXHR0cnkge1xuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRjb25zdCB0YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cblx0XHRpZiAoZHJhZ1NyY0VsICYmIGRyYWdTcmNFbCAhPT0gdGFyZ2V0KSB7XG5cdFx0XHRjb25zdCBkcmFnU3JjSWQgPSBkcmFnU3JjRWwuaWQ7XG5cdFx0XHRjb25zdCBkcm9wVGFyZ2V0SWQgPSB0YXJnZXQuaWQ7XG5cdFx0XHRjb25zdCBkcmFnU3JjVGV4dCA9IChcblx0XHRcdFx0ZHJhZ1NyY0VsLnF1ZXJ5U2VsZWN0b3IoXG5cdFx0XHRcdFx0Jy5jb2xvci10ZXh0LW91dHB1dC1ib3gnXG5cdFx0XHRcdCkgYXMgSFRNTElucHV0RWxlbWVudFxuXHRcdFx0KS52YWx1ZTtcblx0XHRcdGNvbnN0IGRyb3BUYXJnZXRUZXh0ID0gKFxuXHRcdFx0XHR0YXJnZXQucXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0XHQnLmNvbG9yLXRleHQtb3V0cHV0LWJveCdcblx0XHRcdFx0KSBhcyBIVE1MSW5wdXRFbGVtZW50XG5cdFx0XHQpLnZhbHVlO1xuXHRcdFx0Y29uc3QgZHJhZ1NyY091dGVySFRNTCA9IGRyYWdTcmNFbC5vdXRlckhUTUw7XG5cdFx0XHRjb25zdCBkcm9wVGFyZ2V0T3V0ZXJIVE1MID0gdGFyZ2V0Lm91dGVySFRNTDtcblxuXHRcdFx0ZHJhZ1NyY0VsLm91dGVySFRNTCA9IGRyb3BUYXJnZXRPdXRlckhUTUw7XG5cdFx0XHR0YXJnZXQub3V0ZXJIVE1MID0gZHJhZ1NyY091dGVySFRNTDtcblxuXHRcdFx0Y29uc3QgbmV3RHJhZ1NyY0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdGRyb3BUYXJnZXRJZFxuXHRcdFx0KSBhcyBIVE1MRWxlbWVudDtcblx0XHRcdGNvbnN0IG5ld0Ryb3BUYXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRkcmFnU3JjSWRcblx0XHRcdCkgYXMgSFRNTEVsZW1lbnQ7XG5cblx0XHRcdG5ld0RyYWdTcmNFbC5pZCA9IGRyYWdTcmNJZDtcblx0XHRcdG5ld0Ryb3BUYXJnZXRFbC5pZCA9IGRyb3BUYXJnZXRJZDtcblxuXHRcdFx0KFxuXHRcdFx0XHRuZXdEcmFnU3JjRWwucXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0XHQnLmNvbG9yLXRleHQtb3V0cHV0LWJveCdcblx0XHRcdFx0KSBhcyBIVE1MSW5wdXRFbGVtZW50XG5cdFx0XHQpLnZhbHVlID0gZHJvcFRhcmdldFRleHQ7XG5cdFx0XHQoXG5cdFx0XHRcdG5ld0Ryb3BUYXJnZXRFbC5xdWVyeVNlbGVjdG9yKFxuXHRcdFx0XHRcdCcuY29sb3ItdGV4dC1vdXRwdXQtYm94J1xuXHRcdFx0XHQpIGFzIEhUTUxJbnB1dEVsZW1lbnRcblx0XHRcdCkudmFsdWUgPSBkcmFnU3JjVGV4dDtcblxuXHRcdFx0aWYgKG1vZGUuZGVidWcgJiYgbG9nTW9kZS52ZXJib3NpdHkgPj0gNClcblx0XHRcdFx0bG9nZ2VyLmRlYnVnKFxuXHRcdFx0XHRcdCdjYWxsaW5nIGF0dGFjaERyYWdBbmREcm9wRXZlbnRMaXN0ZW5lcnMgZm9yIG5ldyBlbGVtZW50cycsXG5cdFx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRhdHRhY2hEQURMaXN0ZW5lcnMobmV3RHJhZ1NyY0VsKTtcblxuXHRcdFx0YXR0YWNoREFETGlzdGVuZXJzKG5ld0Ryb3BUYXJnZXRFbCk7XG5cdFx0fVxuXG5cdFx0aWYgKGxvZ01vZGUuZGVidWcgJiYgbG9nTW9kZS52ZXJib3NpdHkgPT09IDUpXG5cdFx0XHRsb2dnZXIuaW5mbygnaGFuZGxlRHJvcCBjb21wbGV0ZScsIGAke3RoaXNNb2R1bGV9ID4gJHt0aGlzTWV0aG9kfWApO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmICghbG9nTW9kZS5lcnJvcilcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0YEVycm9yIGluIGhhbmRsZURyb3A6ICR7ZXJyb3J9YCxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNNZXRob2R9YFxuXHRcdFx0KTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgZGFkTGlzdGVuZXJzID0ge1xuXHRhdHRhY2g6IGF0dGFjaERBRExpc3RlbmVyc1xufTtcbiJdfQ==