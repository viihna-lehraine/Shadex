// File: src/dom/events/palette.js
import { data } from '../data/index.js';
import { log } from '../classes/logger/index.js';
const domIDs = data.consts.dom.ids;
const logMode = data.mode.logging;
const mode = data.mode;
function enforceSwatchRules(minimumSwatches, maximumSwatches) {
    const paletteDropdown = document.getElementById(domIDs.paletteNumberOptions);
    if (!paletteDropdown) {
        if (logMode.errors) {
            log.error('paletteDropdown not found');
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
                log.error(`Failed to dispatch change event to palette-number-options dropdown menu: ${error}`);
            }
            throw new Error(`Failed to dispatch change event: ${error}`);
        }
    }
}
export const base = {
    enforceSwatchRules
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGtDQUFrQztBQUdsQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDeEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRWpELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztBQUNuQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUNsQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBRXZCLFNBQVMsa0JBQWtCLENBQzFCLGVBQXVCLEVBQ3ZCLGVBQXdCO0lBRXhCLE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQzlDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FDTixDQUFDO0lBRXZCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN0QixJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNwQixHQUFHLENBQUMsS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQzlDLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBRUQsT0FBTztJQUNSLENBQUM7SUFFRCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztJQUV6RCxJQUFJLFFBQVEsR0FBRyxZQUFZLENBQUM7SUFFNUIsOENBQThDO0lBQzlDLElBQUksWUFBWSxHQUFHLGVBQWUsRUFBRSxDQUFDO1FBQ3BDLFFBQVEsR0FBRyxlQUFlLENBQUM7SUFDNUIsQ0FBQztTQUFNLElBQ04sZUFBZSxLQUFLLFNBQVM7UUFDN0IsWUFBWSxHQUFHLGVBQWUsRUFDN0IsQ0FBQztRQUNGLFFBQVEsR0FBRyxlQUFlLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQUksUUFBUSxLQUFLLFlBQVksRUFBRSxDQUFDO1FBQy9CLG9DQUFvQztRQUNwQyxlQUFlLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUU1QyxtREFBbUQ7UUFDbkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDO1lBQ0osZUFBZSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNoQixJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDcEIsR0FBRyxDQUFDLEtBQUssQ0FDUiw0RUFBNEUsS0FBSyxFQUFFLENBQ25GLENBQUM7WUFDSCxDQUFDO1lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUM5RCxDQUFDO0lBQ0YsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQXNCO0lBQ3RDLGtCQUFrQjtDQUNsQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2RvbS9ldmVudHMvcGFsZXR0ZS5qc1xuXG5pbXBvcnQgeyBVSUZuQmFzZUludGVyZmFjZSB9IGZyb20gJy4uL2luZGV4L2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9kYXRhL2luZGV4LmpzJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uL2NsYXNzZXMvbG9nZ2VyL2luZGV4LmpzJztcblxuY29uc3QgZG9tSURzID0gZGF0YS5jb25zdHMuZG9tLmlkcztcbmNvbnN0IGxvZ01vZGUgPSBkYXRhLm1vZGUubG9nZ2luZztcbmNvbnN0IG1vZGUgPSBkYXRhLm1vZGU7XG5cbmZ1bmN0aW9uIGVuZm9yY2VTd2F0Y2hSdWxlcyhcblx0bWluaW11bVN3YXRjaGVzOiBudW1iZXIsXG5cdG1heGltdW1Td2F0Y2hlcz86IG51bWJlclxuKTogdm9pZCB7XG5cdGNvbnN0IHBhbGV0dGVEcm9wZG93biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdGRvbUlEcy5wYWxldHRlTnVtYmVyT3B0aW9uc1xuXHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xuXG5cdGlmICghcGFsZXR0ZURyb3Bkb3duKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3JzKSB7XG5cdFx0XHRsb2cuZXJyb3IoJ3BhbGV0dGVEcm9wZG93biBub3QgZm91bmQnKTtcblx0XHR9XG5cdFx0aWYgKG1vZGUuc3RhY2tUcmFjZSAmJiBsb2dNb2RlLnZlcmJvc2l0eSA+IDMpIHtcblx0XHRcdGNvbnNvbGUudHJhY2UoJ2VuZm9yY2VNaW5pbXVtU3dhdGNoZXMgc3RhY2sgdHJhY2UnKTtcblx0XHR9XG5cblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBjdXJyZW50VmFsdWUgPSBwYXJzZUludChwYWxldHRlRHJvcGRvd24udmFsdWUsIDEwKTtcblxuXHRsZXQgbmV3VmFsdWUgPSBjdXJyZW50VmFsdWU7XG5cblx0Ly8gZW5zdWUgdGhlIHZhbHVlIGlzIHdpdGhpbiB0aGUgYWxsb3dlZCByYW5nZVxuXHRpZiAoY3VycmVudFZhbHVlIDwgbWluaW11bVN3YXRjaGVzKSB7XG5cdFx0bmV3VmFsdWUgPSBtaW5pbXVtU3dhdGNoZXM7XG5cdH0gZWxzZSBpZiAoXG5cdFx0bWF4aW11bVN3YXRjaGVzICE9PSB1bmRlZmluZWQgJiZcblx0XHRjdXJyZW50VmFsdWUgPiBtYXhpbXVtU3dhdGNoZXNcblx0KSB7XG5cdFx0bmV3VmFsdWUgPSBtYXhpbXVtU3dhdGNoZXM7XG5cdH1cblxuXHRpZiAobmV3VmFsdWUgIT09IGN1cnJlbnRWYWx1ZSkge1xuXHRcdC8vIHVwZGF0ZSB2YWx1ZSBpbiB0aGUgZHJvcGRvd24gbWVudVxuXHRcdHBhbGV0dGVEcm9wZG93bi52YWx1ZSA9IG5ld1ZhbHVlLnRvU3RyaW5nKCk7XG5cblx0XHQvLyB0cmlnZ2VyIGEgY2hhbmdlIGV2ZW50IHRvIG5vdGlmeSB0aGUgYXBwbGljYXRpb25cblx0XHRjb25zdCBldmVudCA9IG5ldyBFdmVudCgnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0pO1xuXHRcdHRyeSB7XG5cdFx0XHRwYWxldHRlRHJvcGRvd24uZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9ycykge1xuXHRcdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdFx0YEZhaWxlZCB0byBkaXNwYXRjaCBjaGFuZ2UgZXZlbnQgdG8gcGFsZXR0ZS1udW1iZXItb3B0aW9ucyBkcm9wZG93biBtZW51OiAke2Vycm9yfWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGRpc3BhdGNoIGNoYW5nZSBldmVudDogJHtlcnJvcn1gKTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGJhc2U6IFVJRm5CYXNlSW50ZXJmYWNlID0ge1xuXHRlbmZvcmNlU3dhdGNoUnVsZXNcbn07XG4iXX0=