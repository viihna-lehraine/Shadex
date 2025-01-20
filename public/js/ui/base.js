// File: src/dom/events/palette.js
import { data } from '../data/index.js';
import { logger } from '../logger/index.js';
const domIDs = data.consts.dom.ids;
const logMode = data.mode.logging;
const mode = data.mode;
function enforceSwatchRules(minimumSwatches, maximumSwatches) {
    const paletteDropdown = document.getElementById(domIDs.paletteNumberOptions);
    if (!paletteDropdown) {
        if (logMode.errors) {
            logger.error('paletteDropdown not found');
        }
        if (mode.stackTrace && logMode.verbosity > 3) {
            console.trace('enforceMinimumSwatches stack trace');
        }
        return;
    }
    const currentValue = parseInt(paletteDropdown.value, 10);
    let newValue = currentValue;
    // ensue the value is within the allowed range
    if (currentValue < minimumSwatches) {
        newValue = minimumSwatches;
    }
    else if (maximumSwatches !== undefined &&
        currentValue > maximumSwatches) {
        newValue = maximumSwatches;
    }
    if (newValue !== currentValue) {
        // update value in the dropdown menu
        paletteDropdown.value = newValue.toString();
        // trigger a change event to notify the application
        const event = new Event('change', { bubbles: true });
        try {
            paletteDropdown.dispatchEvent(event);
        }
        catch (error) {
            if (logMode.errors) {
                logger.error(`Failed to dispatch change event to palette-number-options dropdown menu: ${error}`);
            }
            throw new Error(`Failed to dispatch change event: ${error}`);
        }
    }
}
export const base = {
    enforceSwatchRules
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGtDQUFrQztBQUdsQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDeEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRTVDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztBQUNuQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUNsQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBRXZCLFNBQVMsa0JBQWtCLENBQzFCLGVBQXVCLEVBQ3ZCLGVBQXdCO0lBRXhCLE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQzlDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FDTixDQUFDO0lBRXZCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN0QixJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNwQixNQUFNLENBQUMsS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQzlDLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBRUQsT0FBTztJQUNSLENBQUM7SUFFRCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztJQUV6RCxJQUFJLFFBQVEsR0FBRyxZQUFZLENBQUM7SUFFNUIsOENBQThDO0lBQzlDLElBQUksWUFBWSxHQUFHLGVBQWUsRUFBRSxDQUFDO1FBQ3BDLFFBQVEsR0FBRyxlQUFlLENBQUM7SUFDNUIsQ0FBQztTQUFNLElBQ04sZUFBZSxLQUFLLFNBQVM7UUFDN0IsWUFBWSxHQUFHLGVBQWUsRUFDN0IsQ0FBQztRQUNGLFFBQVEsR0FBRyxlQUFlLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQUksUUFBUSxLQUFLLFlBQVksRUFBRSxDQUFDO1FBQy9CLG9DQUFvQztRQUNwQyxlQUFlLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUU1QyxtREFBbUQ7UUFDbkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDO1lBQ0osZUFBZSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNoQixJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDcEIsTUFBTSxDQUFDLEtBQUssQ0FDWCw0RUFBNEUsS0FBSyxFQUFFLENBQ25GLENBQUM7WUFDSCxDQUFDO1lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUM5RCxDQUFDO0lBQ0YsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQXNCO0lBQ3RDLGtCQUFrQjtDQUNsQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2RvbS9ldmVudHMvcGFsZXR0ZS5qc1xuXG5pbXBvcnQgeyBVSUZuQmFzZUludGVyZmFjZSB9IGZyb20gJy4uL2luZGV4L2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9kYXRhL2luZGV4LmpzJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4uL2xvZ2dlci9pbmRleC5qcyc7XG5cbmNvbnN0IGRvbUlEcyA9IGRhdGEuY29uc3RzLmRvbS5pZHM7XG5jb25zdCBsb2dNb2RlID0gZGF0YS5tb2RlLmxvZ2dpbmc7XG5jb25zdCBtb2RlID0gZGF0YS5tb2RlO1xuXG5mdW5jdGlvbiBlbmZvcmNlU3dhdGNoUnVsZXMoXG5cdG1pbmltdW1Td2F0Y2hlczogbnVtYmVyLFxuXHRtYXhpbXVtU3dhdGNoZXM/OiBudW1iZXJcbik6IHZvaWQge1xuXHRjb25zdCBwYWxldHRlRHJvcGRvd24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRkb21JRHMucGFsZXR0ZU51bWJlck9wdGlvbnNcblx0KSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcblxuXHRpZiAoIXBhbGV0dGVEcm9wZG93bikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9ycykge1xuXHRcdFx0bG9nZ2VyLmVycm9yKCdwYWxldHRlRHJvcGRvd24gbm90IGZvdW5kJyk7XG5cdFx0fVxuXHRcdGlmIChtb2RlLnN0YWNrVHJhY2UgJiYgbG9nTW9kZS52ZXJib3NpdHkgPiAzKSB7XG5cdFx0XHRjb25zb2xlLnRyYWNlKCdlbmZvcmNlTWluaW11bVN3YXRjaGVzIHN0YWNrIHRyYWNlJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgY3VycmVudFZhbHVlID0gcGFyc2VJbnQocGFsZXR0ZURyb3Bkb3duLnZhbHVlLCAxMCk7XG5cblx0bGV0IG5ld1ZhbHVlID0gY3VycmVudFZhbHVlO1xuXG5cdC8vIGVuc3VlIHRoZSB2YWx1ZSBpcyB3aXRoaW4gdGhlIGFsbG93ZWQgcmFuZ2Vcblx0aWYgKGN1cnJlbnRWYWx1ZSA8IG1pbmltdW1Td2F0Y2hlcykge1xuXHRcdG5ld1ZhbHVlID0gbWluaW11bVN3YXRjaGVzO1xuXHR9IGVsc2UgaWYgKFxuXHRcdG1heGltdW1Td2F0Y2hlcyAhPT0gdW5kZWZpbmVkICYmXG5cdFx0Y3VycmVudFZhbHVlID4gbWF4aW11bVN3YXRjaGVzXG5cdCkge1xuXHRcdG5ld1ZhbHVlID0gbWF4aW11bVN3YXRjaGVzO1xuXHR9XG5cblx0aWYgKG5ld1ZhbHVlICE9PSBjdXJyZW50VmFsdWUpIHtcblx0XHQvLyB1cGRhdGUgdmFsdWUgaW4gdGhlIGRyb3Bkb3duIG1lbnVcblx0XHRwYWxldHRlRHJvcGRvd24udmFsdWUgPSBuZXdWYWx1ZS50b1N0cmluZygpO1xuXG5cdFx0Ly8gdHJpZ2dlciBhIGNoYW5nZSBldmVudCB0byBub3RpZnkgdGhlIGFwcGxpY2F0aW9uXG5cdFx0Y29uc3QgZXZlbnQgPSBuZXcgRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KTtcblx0XHR0cnkge1xuXHRcdFx0cGFsZXR0ZURyb3Bkb3duLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAobG9nTW9kZS5lcnJvcnMpIHtcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gZGlzcGF0Y2ggY2hhbmdlIGV2ZW50IHRvIHBhbGV0dGUtbnVtYmVyLW9wdGlvbnMgZHJvcGRvd24gbWVudTogJHtlcnJvcn1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBkaXNwYXRjaCBjaGFuZ2UgZXZlbnQ6ICR7ZXJyb3J9YCk7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBiYXNlOiBVSUZuQmFzZUludGVyZmFjZSA9IHtcblx0ZW5mb3JjZVN3YXRjaFJ1bGVzXG59O1xuIl19