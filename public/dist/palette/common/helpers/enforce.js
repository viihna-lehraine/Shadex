// File: palette/common/helpers/enforce.js
import { createLogger } from '../../../logger/factory.js';
import { domData } from '../../../data/dom.js';
import { modeData as mode } from '../../../data/mode.js';
const domIDs = domData.ids;
const logMode = mode.logging;
const thisModule = 'palette/common/helpers/enforce.js';
const logger = await createLogger();
function swatchRules(minSwatches, maxSwatches) {
    const thisFunction = 'enforceSwatchRules()';
    const swatchNumberSelector = document.getElementById(domIDs.static.selects.swatchGen);
    if (!swatchNumberSelector) {
        if (logMode.error) {
            logger.error('paletteDropdown not found', `${thisModule} > ${thisFunction}`);
        }
        if (mode.stackTrace && logMode.verbosity > 3) {
            console.trace('enforceMinimumSwatches stack trace');
        }
        return;
    }
    const currentValue = parseInt(swatchNumberSelector.value, 10);
    let newValue = currentValue;
    // ensue the value is within the allowed range
    if (currentValue < minSwatches) {
        newValue = minSwatches;
    }
    else if (maxSwatches !== undefined && currentValue > maxSwatches) {
        newValue = maxSwatches;
    }
    if (newValue !== currentValue) {
        // update value in the dropdown menu
        swatchNumberSelector.value = newValue.toString();
        // trigger a change event to notify the application
        const event = new Event('change', { bubbles: true });
        try {
            swatchNumberSelector.dispatchEvent(event);
        }
        catch (error) {
            if (logMode.error) {
                logger.error(`Failed to dispatch change event to palette-number-options dropdown menu: ${error}`, `${thisModule} > ${thisFunction}`);
            }
            throw new Error(`Failed to dispatch change event: ${error}`);
        }
    }
}
export const enforce = {
    swatchRules
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5mb3JjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9wYWxldHRlL2NvbW1vbi9oZWxwZXJzL2VuZm9yY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMENBQTBDO0FBRTFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsSUFBSSxJQUFJLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUV6RCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBQzNCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFFN0IsTUFBTSxVQUFVLEdBQUcsbUNBQW1DLENBQUM7QUFFdkQsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxTQUFTLFdBQVcsQ0FBQyxXQUFtQixFQUFFLFdBQW9CO0lBQzdELE1BQU0sWUFBWSxHQUFHLHNCQUFzQixDQUFDO0lBQzVDLE1BQU0sb0JBQW9CLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDbkQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUNWLENBQUM7SUFFdkIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDM0IsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbkIsTUFBTSxDQUFDLEtBQUssQ0FDWCwyQkFBMkIsRUFDM0IsR0FBRyxVQUFVLE1BQU0sWUFBWSxFQUFFLENBQ2pDLENBQUM7UUFDSCxDQUFDO1FBQ0QsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDOUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFFRCxPQUFPO0lBQ1IsQ0FBQztJQUVELE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFOUQsSUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDO0lBRTVCLDhDQUE4QztJQUM5QyxJQUFJLFlBQVksR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUNoQyxRQUFRLEdBQUcsV0FBVyxDQUFDO0lBQ3hCLENBQUM7U0FBTSxJQUFJLFdBQVcsS0FBSyxTQUFTLElBQUksWUFBWSxHQUFHLFdBQVcsRUFBRSxDQUFDO1FBQ3BFLFFBQVEsR0FBRyxXQUFXLENBQUM7SUFDeEIsQ0FBQztJQUVELElBQUksUUFBUSxLQUFLLFlBQVksRUFBRSxDQUFDO1FBQy9CLG9DQUFvQztRQUNwQyxvQkFBb0IsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWpELG1EQUFtRDtRQUNuRCxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUM7WUFDSixvQkFBb0IsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDaEIsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQ1gsNEVBQTRFLEtBQUssRUFBRSxFQUNuRixHQUFHLFVBQVUsTUFBTSxZQUFZLEVBQUUsQ0FDakMsQ0FBQztZQUNILENBQUM7WUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzlELENBQUM7SUFDRixDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRztJQUN0QixXQUFXO0NBQ1gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHBhbGV0dGUvY29tbW9uL2hlbHBlcnMvZW5mb3JjZS5qc1xuXG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIgfSBmcm9tICcuLi8uLi8uLi9sb2dnZXIvZmFjdG9yeS5qcyc7XG5pbXBvcnQgeyBkb21EYXRhIH0gZnJvbSAnLi4vLi4vLi4vZGF0YS9kb20uanMnO1xuaW1wb3J0IHsgbW9kZURhdGEgYXMgbW9kZSB9IGZyb20gJy4uLy4uLy4uL2RhdGEvbW9kZS5qcyc7XG5cbmNvbnN0IGRvbUlEcyA9IGRvbURhdGEuaWRzO1xuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcblxuY29uc3QgdGhpc01vZHVsZSA9ICdwYWxldHRlL2NvbW1vbi9oZWxwZXJzL2VuZm9yY2UuanMnO1xuXG5jb25zdCBsb2dnZXIgPSBhd2FpdCBjcmVhdGVMb2dnZXIoKTtcblxuZnVuY3Rpb24gc3dhdGNoUnVsZXMobWluU3dhdGNoZXM6IG51bWJlciwgbWF4U3dhdGNoZXM/OiBudW1iZXIpOiB2b2lkIHtcblx0Y29uc3QgdGhpc0Z1bmN0aW9uID0gJ2VuZm9yY2VTd2F0Y2hSdWxlcygpJztcblx0Y29uc3Qgc3dhdGNoTnVtYmVyU2VsZWN0b3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRkb21JRHMuc3RhdGljLnNlbGVjdHMuc3dhdGNoR2VuXG5cdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XG5cblx0aWYgKCFzd2F0Y2hOdW1iZXJTZWxlY3Rvcikge1xuXHRcdGlmIChsb2dNb2RlLmVycm9yKSB7XG5cdFx0XHRsb2dnZXIuZXJyb3IoXG5cdFx0XHRcdCdwYWxldHRlRHJvcGRvd24gbm90IGZvdW5kJyxcblx0XHRcdFx0YCR7dGhpc01vZHVsZX0gPiAke3RoaXNGdW5jdGlvbn1gXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRpZiAobW9kZS5zdGFja1RyYWNlICYmIGxvZ01vZGUudmVyYm9zaXR5ID4gMykge1xuXHRcdFx0Y29uc29sZS50cmFjZSgnZW5mb3JjZU1pbmltdW1Td2F0Y2hlcyBzdGFjayB0cmFjZScpO1xuXHRcdH1cblxuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHBhcnNlSW50KHN3YXRjaE51bWJlclNlbGVjdG9yLnZhbHVlLCAxMCk7XG5cblx0bGV0IG5ld1ZhbHVlID0gY3VycmVudFZhbHVlO1xuXG5cdC8vIGVuc3VlIHRoZSB2YWx1ZSBpcyB3aXRoaW4gdGhlIGFsbG93ZWQgcmFuZ2Vcblx0aWYgKGN1cnJlbnRWYWx1ZSA8IG1pblN3YXRjaGVzKSB7XG5cdFx0bmV3VmFsdWUgPSBtaW5Td2F0Y2hlcztcblx0fSBlbHNlIGlmIChtYXhTd2F0Y2hlcyAhPT0gdW5kZWZpbmVkICYmIGN1cnJlbnRWYWx1ZSA+IG1heFN3YXRjaGVzKSB7XG5cdFx0bmV3VmFsdWUgPSBtYXhTd2F0Y2hlcztcblx0fVxuXG5cdGlmIChuZXdWYWx1ZSAhPT0gY3VycmVudFZhbHVlKSB7XG5cdFx0Ly8gdXBkYXRlIHZhbHVlIGluIHRoZSBkcm9wZG93biBtZW51XG5cdFx0c3dhdGNoTnVtYmVyU2VsZWN0b3IudmFsdWUgPSBuZXdWYWx1ZS50b1N0cmluZygpO1xuXG5cdFx0Ly8gdHJpZ2dlciBhIGNoYW5nZSBldmVudCB0byBub3RpZnkgdGhlIGFwcGxpY2F0aW9uXG5cdFx0Y29uc3QgZXZlbnQgPSBuZXcgRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KTtcblx0XHR0cnkge1xuXHRcdFx0c3dhdGNoTnVtYmVyU2VsZWN0b3IuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmIChsb2dNb2RlLmVycm9yKSB7XG5cdFx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRgRmFpbGVkIHRvIGRpc3BhdGNoIGNoYW5nZSBldmVudCB0byBwYWxldHRlLW51bWJlci1vcHRpb25zIGRyb3Bkb3duIG1lbnU6ICR7ZXJyb3J9YCxcblx0XHRcdFx0XHRgJHt0aGlzTW9kdWxlfSA+ICR7dGhpc0Z1bmN0aW9ufWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGRpc3BhdGNoIGNoYW5nZSBldmVudDogJHtlcnJvcn1gKTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGVuZm9yY2UgPSB7XG5cdHN3YXRjaFJ1bGVzXG59O1xuIl19