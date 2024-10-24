import { dragAndDrop } from '../dom/drag-and-drop.js';
import { transforms } from '../utils/transforms.js';
function attachDragAndDropEventListeners(element) {
    try {
        if (element) {
            element.addEventListener('dragstart', dragAndDrop.handleDragStart);
            element.addEventListener('dragover', dragAndDrop.handleDragOver);
            element.addEventListener('drop', dragAndDrop.handleDrop);
            element.addEventListener('dragend', dragAndDrop.handleDragEnd);
        }
    }
    catch (error) {
        console.error(`Failed to execute attachDragAndDropEventListeners: ${error}`);
    }
}
function getElement(id) {
    return document.getElementById(id);
}
function makePaletteBox(color, paletteBoxCount) {
    try {
        // create main palette-box element
        const paletteBox = document.createElement('div');
        paletteBox.className = 'palette-box';
        paletteBox.id = `palette-box-${paletteBoxCount}`;
        // create top half of palette box
        const paletteBoxTopHalf = document.createElement('div');
        paletteBoxTopHalf.className = 'palette-box-half palette-box-top-half';
        paletteBoxTopHalf.id = `palette-box-top-half-${paletteBoxCount}`;
        const colorTextOutputBox = document.createElement('input');
        colorTextOutputBox.type = 'text';
        colorTextOutputBox.className = 'color-text-output-box tooltip';
        colorTextOutputBox.id = `color-text-output-box-${paletteBoxCount}`;
        colorTextOutputBox.setAttribute('data-format', 'hex');
        const colorString = transforms.getCSSColorString(color);
        if (colorString) {
            colorTextOutputBox.value = colorString;
        }
        else {
            console.warn(`Failed to generate color string for box #${paletteBoxCount}`);
            colorTextOutputBox.value = '';
        }
        colorTextOutputBox.colorValues = color; // store color values
        colorTextOutputBox.readOnly = false;
        colorTextOutputBox.style.cursor = 'text';
        colorTextOutputBox.style.pointerEvents = 'none';
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        const tooltipText = document.createElement('span');
        tooltipText.className = 'tooltiptext';
        tooltipText.textContent = 'Copied to clipboard!';
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(colorTextOutputBox.value);
                domHelpers.showTooltip(colorTextOutputBox);
                copyButton.textContent = 'Copied!';
                setTimeout(() => (copyButton.textContent = 'Copy'), 1000);
            }
            catch (error) {
                console.error(`Failed to copy: ${error}`);
            }
        });
        colorTextOutputBox.addEventListener('input', e => {
            const target = e.target;
            if (target) {
                const cssColor = target.value.trim();
                const boxElement = document.getElementById(`color-box-${paletteBoxCount}`);
                const stripeElement = document.getElementById(`color-stripe-${paletteBoxCount}`);
                if (boxElement)
                    boxElement.style.backgroundColor = cssColor;
                if (stripeElement)
                    stripeElement.style.backgroundColor = cssColor;
            }
        });
        paletteBoxTopHalf.appendChild(colorTextOutputBox);
        paletteBoxTopHalf.appendChild(copyButton);
        const paletteBoxBottomHalf = document.createElement('div');
        paletteBoxBottomHalf.className =
            'palette-box-half palette-box-bottom-half';
        paletteBoxBottomHalf.id = `palette-box-bottom-half-${paletteBoxCount}`;
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.id = `color-box-${paletteBoxCount}`;
        colorBox.style.backgroundColor = transforms.getCSSColorString(color);
        paletteBoxBottomHalf.appendChild(colorBox);
        paletteBox.appendChild(paletteBoxTopHalf);
        paletteBox.appendChild(paletteBoxBottomHalf);
        // create color stripe
        const colorStripe = document.createElement('div');
        colorStripe.className = 'color-stripe';
        colorStripe.id = `color-stripe-${paletteBoxCount}`;
        colorStripe.style.backgroundColor = transforms.getCSSColorString(color);
        colorStripe.setAttribute('draggable', 'true');
        attachDragAndDropEventListeners(colorStripe);
        // append palette box to color stripe
        colorStripe.appendChild(paletteBox);
        return {
            colorStripe,
            paletteBoxCount: paletteBoxCount + 1
        };
    }
    catch (error) {
        console.error(`Failed to execute makePaletteBox: ${error}`);
        return {
            colorStripe: document.createElement('div'),
            paletteBoxCount
        };
    }
}
function showTooltip(tooltipElement) {
    try {
        const tooltip = tooltipElement.querySelector('.tooltiptext');
        if (tooltip) {
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
            setTimeout(() => {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
            }, 1000);
        }
        console.log('showTooltip executed');
    }
    catch (error) {
        console.error(`Failed to execute showTooltip: ${error}`);
    }
}
export const domHelpers = {
    attachDragAndDropEventListeners,
    getElement,
    makePaletteBox,
    showTooltip
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2hlbHBlcnMvZG9tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUluRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFakQsU0FBUywrQkFBK0IsQ0FBQyxPQUEyQjtJQUNuRSxJQUFJLENBQUM7UUFDSixJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDbkUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDakUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDekQsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDaEUsQ0FBQztJQUNGLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQ1osc0RBQXNELEtBQUssRUFBRSxDQUM3RCxDQUFDO0lBQ0gsQ0FBQztBQUNGLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBd0IsRUFBVTtJQUNwRCxPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFhLENBQUM7QUFDaEQsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUN0QixLQUFrQixFQUNsQixlQUF1QjtJQUV2QixJQUFJLENBQUM7UUFDSixrQ0FBa0M7UUFDbEMsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRCxVQUFVLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztRQUNyQyxVQUFVLENBQUMsRUFBRSxH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QXNCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUF5QjtJQUMvQywrQkFBK0I7SUFDL0IsVUFBVTtJQUNWLGNBQWM7SUFDZCxXQUFXO0NBQ1gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRyYWdBbmREcm9wIH0gZnJvbSAnLi4vZG9tL2RyYWctYW5kLWRyb3AnO1xuaW1wb3J0ICogYXMgZm5PYmplY3RzIGZyb20gJy4uL2luZGV4L2ZuLW9iamVjdHMnO1xuaW1wb3J0ICogYXMgaW50ZXJmYWNlcyBmcm9tICcuLi9pbmRleC9pbnRlcmZhY2VzJztcbmltcG9ydCAqIGFzIHR5cGVzIGZyb20gJy4uL2luZGV4L3R5cGVzJztcbmltcG9ydCB7IHRyYW5zZm9ybXMgfSBmcm9tICcuLi91dGlscy90cmFuc2Zvcm1zJztcblxuZnVuY3Rpb24gYXR0YWNoRHJhZ0FuZERyb3BFdmVudExpc3RlbmVycyhlbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwpOiB2b2lkIHtcblx0dHJ5IHtcblx0XHRpZiAoZWxlbWVudCkge1xuXHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBkcmFnQW5kRHJvcC5oYW5kbGVEcmFnU3RhcnQpO1xuXHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGRyYWdBbmREcm9wLmhhbmRsZURyYWdPdmVyKTtcblx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGRyYWdBbmREcm9wLmhhbmRsZURyb3ApO1xuXHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgZHJhZ0FuZERyb3AuaGFuZGxlRHJhZ0VuZCk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoXG5cdFx0XHRgRmFpbGVkIHRvIGV4ZWN1dGUgYXR0YWNoRHJhZ0FuZERyb3BFdmVudExpc3RlbmVyczogJHtlcnJvcn1gXG5cdFx0KTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRFbGVtZW50PFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4oaWQ6IHN0cmluZyk6IFQgfCBudWxsIHtcblx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBUIHwgbnVsbDtcbn1cblxuZnVuY3Rpb24gbWFrZVBhbGV0dGVCb3goXG5cdGNvbG9yOiB0eXBlcy5Db2xvcixcblx0cGFsZXR0ZUJveENvdW50OiBudW1iZXJcbik6IGludGVyZmFjZXMuTWFrZVBhbGV0dGVCb3gge1xuXHR0cnkge1xuXHRcdC8vIGNyZWF0ZSBtYWluIHBhbGV0dGUtYm94IGVsZW1lbnRcblx0XHRjb25zdCBwYWxldHRlQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0cGFsZXR0ZUJveC5jbGFzc05hbWUgPSAncGFsZXR0ZS1ib3gnO1xuXHRcdHBhbGV0dGVCb3guaWQgPSBgcGFsZXR0ZS1ib3gtJHtwYWxldHRlQm94Q291bnR9YDtcblxuXHRcdC8vIGNyZWF0ZSB0b3AgaGFsZiBvZiBwYWxldHRlIGJveFxuXHRcdGNvbnN0IHBhbGV0dGVCb3hUb3BIYWxmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0cGFsZXR0ZUJveFRvcEhhbGYuY2xhc3NOYW1lID0gJ3BhbGV0dGUtYm94LWhhbGYgcGFsZXR0ZS1ib3gtdG9wLWhhbGYnO1xuXHRcdHBhbGV0dGVCb3hUb3BIYWxmLmlkID0gYHBhbGV0dGUtYm94LXRvcC1oYWxmLSR7cGFsZXR0ZUJveENvdW50fWA7XG5cblx0XHRjb25zdCBjb2xvclRleHRPdXRwdXRCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2lucHV0J1xuXHRcdCkgYXMgaW50ZXJmYWNlcy5Db2xvcklucHV0RWxlbWVudDtcblx0XHRjb2xvclRleHRPdXRwdXRCb3gudHlwZSA9ICd0ZXh0Jztcblx0XHRjb2xvclRleHRPdXRwdXRCb3guY2xhc3NOYW1lID0gJ2NvbG9yLXRleHQtb3V0cHV0LWJveCB0b29sdGlwJztcblx0XHRjb2xvclRleHRPdXRwdXRCb3guaWQgPSBgY29sb3ItdGV4dC1vdXRwdXQtYm94LSR7cGFsZXR0ZUJveENvdW50fWA7XG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94LnNldEF0dHJpYnV0ZSgnZGF0YS1mb3JtYXQnLCAnaGV4Jyk7XG5cblx0XHRjb25zdCBjb2xvclN0cmluZyA9IHRyYW5zZm9ybXMuZ2V0Q1NTQ29sb3JTdHJpbmcoY29sb3IpO1xuXG5cdFx0aWYgKGNvbG9yU3RyaW5nKSB7XG5cdFx0XHRjb2xvclRleHRPdXRwdXRCb3gudmFsdWUgPSBjb2xvclN0cmluZztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS53YXJuKFxuXHRcdFx0XHRgRmFpbGVkIHRvIGdlbmVyYXRlIGNvbG9yIHN0cmluZyBmb3IgYm94ICMke3BhbGV0dGVCb3hDb3VudH1gXG5cdFx0XHQpO1xuXHRcdFx0Y29sb3JUZXh0T3V0cHV0Qm94LnZhbHVlID0gJyc7XG5cdFx0fVxuXG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94LmNvbG9yVmFsdWVzID0gY29sb3I7IC8vIHN0b3JlIGNvbG9yIHZhbHVlc1xuXHRcdGNvbG9yVGV4dE91dHB1dEJveC5yZWFkT25seSA9IGZhbHNlO1xuXHRcdGNvbG9yVGV4dE91dHB1dEJveC5zdHlsZS5jdXJzb3IgPSAndGV4dCc7XG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG5cblx0XHRjb25zdCBjb3B5QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cdFx0Y29weUJ1dHRvbi5jbGFzc05hbWUgPSAnY29weS1idXR0b24nO1xuXHRcdGNvcHlCdXR0b24udGV4dENvbnRlbnQgPSAnQ29weSc7XG5cblx0XHRjb25zdCB0b29sdGlwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0XHR0b29sdGlwVGV4dC5jbGFzc05hbWUgPSAndG9vbHRpcHRleHQnO1xuXHRcdHRvb2x0aXBUZXh0LnRleHRDb250ZW50ID0gJ0NvcGllZCB0byBjbGlwYm9hcmQhJztcblxuXHRcdGNvcHlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChjb2xvclRleHRPdXRwdXRCb3gudmFsdWUpO1xuXHRcdFx0XHRkb21IZWxwZXJzLnNob3dUb29sdGlwKGNvbG9yVGV4dE91dHB1dEJveCk7XG5cdFx0XHRcdGNvcHlCdXR0b24udGV4dENvbnRlbnQgPSAnQ29waWVkISc7XG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4gKGNvcHlCdXR0b24udGV4dENvbnRlbnQgPSAnQ29weScpLCAxMDAwKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBjb3B5OiAke2Vycm9yfWApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZSA9PiB7XG5cdFx0XHRjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcblxuXHRcdFx0aWYgKHRhcmdldCkge1xuXHRcdFx0XHRjb25zdCBjc3NDb2xvciA9IHRhcmdldC52YWx1ZS50cmltKCk7XG5cdFx0XHRcdGNvbnN0IGJveEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0XHRgY29sb3ItYm94LSR7cGFsZXR0ZUJveENvdW50fWBcblx0XHRcdFx0KTtcblx0XHRcdFx0Y29uc3Qgc3RyaXBlRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRcdGBjb2xvci1zdHJpcGUtJHtwYWxldHRlQm94Q291bnR9YFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmIChib3hFbGVtZW50KSBib3hFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNzc0NvbG9yO1xuXHRcdFx0XHRpZiAoc3RyaXBlRWxlbWVudClcblx0XHRcdFx0XHRzdHJpcGVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNzc0NvbG9yO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cGFsZXR0ZUJveFRvcEhhbGYuYXBwZW5kQ2hpbGQoY29sb3JUZXh0T3V0cHV0Qm94KTtcblx0XHRwYWxldHRlQm94VG9wSGFsZi5hcHBlbmRDaGlsZChjb3B5QnV0dG9uKTtcblxuXHRcdGNvbnN0IHBhbGV0dGVCb3hCb3R0b21IYWxmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0cGFsZXR0ZUJveEJvdHRvbUhhbGYuY2xhc3NOYW1lID1cblx0XHRcdCdwYWxldHRlLWJveC1oYWxmIHBhbGV0dGUtYm94LWJvdHRvbS1oYWxmJztcblx0XHRwYWxldHRlQm94Qm90dG9tSGFsZi5pZCA9IGBwYWxldHRlLWJveC1ib3R0b20taGFsZi0ke3BhbGV0dGVCb3hDb3VudH1gO1xuXG5cdFx0Y29uc3QgY29sb3JCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRjb2xvckJveC5jbGFzc05hbWUgPSAnY29sb3ItYm94Jztcblx0XHRjb2xvckJveC5pZCA9IGBjb2xvci1ib3gtJHtwYWxldHRlQm94Q291bnR9YDtcblxuXHRcdGNvbG9yQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRyYW5zZm9ybXMuZ2V0Q1NTQ29sb3JTdHJpbmcoY29sb3IpO1xuXG5cdFx0cGFsZXR0ZUJveEJvdHRvbUhhbGYuYXBwZW5kQ2hpbGQoY29sb3JCb3gpO1xuXG5cdFx0cGFsZXR0ZUJveC5hcHBlbmRDaGlsZChwYWxldHRlQm94VG9wSGFsZik7XG5cdFx0cGFsZXR0ZUJveC5hcHBlbmRDaGlsZChwYWxldHRlQm94Qm90dG9tSGFsZik7XG5cblx0XHQvLyBjcmVhdGUgY29sb3Igc3RyaXBlXG5cdFx0Y29uc3QgY29sb3JTdHJpcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRjb2xvclN0cmlwZS5jbGFzc05hbWUgPSAnY29sb3Itc3RyaXBlJztcblx0XHRjb2xvclN0cmlwZS5pZCA9IGBjb2xvci1zdHJpcGUtJHtwYWxldHRlQm94Q291bnR9YDtcblx0XHRjb2xvclN0cmlwZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0cmFuc2Zvcm1zLmdldENTU0NvbG9yU3RyaW5nKGNvbG9yKTtcblxuXHRcdGNvbG9yU3RyaXBlLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgJ3RydWUnKTtcblx0XHRhdHRhY2hEcmFnQW5kRHJvcEV2ZW50TGlzdGVuZXJzKGNvbG9yU3RyaXBlKTtcblxuXHRcdC8vIGFwcGVuZCBwYWxldHRlIGJveCB0byBjb2xvciBzdHJpcGVcblx0XHRjb2xvclN0cmlwZS5hcHBlbmRDaGlsZChwYWxldHRlQm94KTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRjb2xvclN0cmlwZSxcblx0XHRcdHBhbGV0dGVCb3hDb3VudDogcGFsZXR0ZUJveENvdW50ICsgMVxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGV4ZWN1dGUgbWFrZVBhbGV0dGVCb3g6ICR7ZXJyb3J9YCk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNvbG9yU3RyaXBlOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcblx0XHRcdHBhbGV0dGVCb3hDb3VudFxuXHRcdH07XG5cdH1cbn1cblxuZnVuY3Rpb24gc2hvd1Rvb2x0aXAodG9vbHRpcEVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgdG9vbHRpcCA9XG5cdFx0XHR0b29sdGlwRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLnRvb2x0aXB0ZXh0Jyk7XG5cblx0XHRpZiAodG9vbHRpcCkge1xuXHRcdFx0dG9vbHRpcC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuXHRcdFx0dG9vbHRpcC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdHRvb2x0aXAuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuXHRcdFx0XHR0b29sdGlwLnN0eWxlLm9wYWNpdHkgPSAnMCc7XG5cdFx0XHR9LCAxMDAwKTtcblx0XHR9XG5cblx0XHRjb25zb2xlLmxvZygnc2hvd1Rvb2x0aXAgZXhlY3V0ZWQnKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gZXhlY3V0ZSBzaG93VG9vbHRpcDogJHtlcnJvcn1gKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgZG9tSGVscGVyczogZm5PYmplY3RzLkRPTUhlbHBlcnMgPSB7XG5cdGF0dGFjaERyYWdBbmREcm9wRXZlbnRMaXN0ZW5lcnMsXG5cdGdldEVsZW1lbnQsXG5cdG1ha2VQYWxldHRlQm94LFxuXHRzaG93VG9vbHRpcFxufTtcbiJdfQ==