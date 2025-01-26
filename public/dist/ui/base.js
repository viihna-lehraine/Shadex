// File: src/dom/events/palette.js
import { consts, mode } from '../common/data/base.js';
import { createLogger } from '../logger/index.js';
const logger = await createLogger();
const domIDs = consts.dom.ids;
const logMode = mode.logging;
function enforceSwatchRules(minimumSwatches, maximumSwatches) {
    const paletteDropdown = document.getElementById(domIDs.paletteNumberOptions);
    if (!paletteDropdown) {
        if (logMode.error) {
            logger.error('paletteDropdown not found', 'ui > base > enforceSwatchRules()');
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
            if (logMode.error) {
                logger.error(`Failed to dispatch change event to palette-number-options dropdown menu: ${error}`, 'ui > base > enforceSwatchRules()');
            }
            throw new Error(`Failed to dispatch change event: ${error}`);
        }
    }
}
export const base = {
    enforceSwatchRules
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGtDQUFrQztBQUdsQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVsRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksRUFBRSxDQUFDO0FBRXBDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0FBQzlCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFFN0IsU0FBUyxrQkFBa0IsQ0FDMUIsZUFBdUIsRUFDdkIsZUFBd0I7SUFFeEIsTUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDOUMsTUFBTSxDQUFDLG9CQUFvQixDQUNOLENBQUM7SUFFdkIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3RCLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQ1gsMkJBQTJCLEVBQzNCLGtDQUFrQyxDQUNsQyxDQUFDO1FBQ0gsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQzlDLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBRUQsT0FBTztJQUNSLENBQUM7SUFFRCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztJQUV6RCxJQUFJLFFBQVEsR0FBRyxZQUFZLENBQUM7SUFFNUIsOENBQThDO0lBQzlDLElBQUksWUFBWSxHQUFHLGVBQWUsRUFBRSxDQUFDO1FBQ3BDLFFBQVEsR0FBRyxlQUFlLENBQUM7SUFDNUIsQ0FBQztTQUFNLElBQ04sZUFBZSxLQUFLLFNBQVM7UUFDN0IsWUFBWSxHQUFHLGVBQWUsRUFDN0IsQ0FBQztRQUNGLFFBQVEsR0FBRyxlQUFlLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQUksUUFBUSxLQUFLLFlBQVksRUFBRSxDQUFDO1FBQy9CLG9DQUFvQztRQUNwQyxlQUFlLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUU1QyxtREFBbUQ7UUFDbkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDO1lBQ0osZUFBZSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNoQixJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDbkIsTUFBTSxDQUFDLEtBQUssQ0FDWCw0RUFBNEUsS0FBSyxFQUFFLEVBQ25GLGtDQUFrQyxDQUNsQyxDQUFDO1lBQ0gsQ0FBQztZQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDOUQsQ0FBQztJQUNGLENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFzQjtJQUN0QyxrQkFBa0I7Q0FDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9kb20vZXZlbnRzL3BhbGV0dGUuanNcblxuaW1wb3J0IHsgVUlGbkJhc2VJbnRlcmZhY2UgfSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb25zdHMsIG1vZGUgfSBmcm9tICcuLi9jb21tb24vZGF0YS9iYXNlLmpzJztcbmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJy4uL2xvZ2dlci9pbmRleC5qcyc7XG5cbmNvbnN0IGxvZ2dlciA9IGF3YWl0IGNyZWF0ZUxvZ2dlcigpO1xuXG5jb25zdCBkb21JRHMgPSBjb25zdHMuZG9tLmlkcztcbmNvbnN0IGxvZ01vZGUgPSBtb2RlLmxvZ2dpbmc7XG5cbmZ1bmN0aW9uIGVuZm9yY2VTd2F0Y2hSdWxlcyhcblx0bWluaW11bVN3YXRjaGVzOiBudW1iZXIsXG5cdG1heGltdW1Td2F0Y2hlcz86IG51bWJlclxuKTogdm9pZCB7XG5cdGNvbnN0IHBhbGV0dGVEcm9wZG93biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdGRvbUlEcy5wYWxldHRlTnVtYmVyT3B0aW9uc1xuXHQpIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xuXG5cdGlmICghcGFsZXR0ZURyb3Bkb3duKSB7XG5cdFx0aWYgKGxvZ01vZGUuZXJyb3IpIHtcblx0XHRcdGxvZ2dlci5lcnJvcihcblx0XHRcdFx0J3BhbGV0dGVEcm9wZG93biBub3QgZm91bmQnLFxuXHRcdFx0XHQndWkgPiBiYXNlID4gZW5mb3JjZVN3YXRjaFJ1bGVzKCknXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRpZiAobW9kZS5zdGFja1RyYWNlICYmIGxvZ01vZGUudmVyYm9zaXR5ID4gMykge1xuXHRcdFx0Y29uc29sZS50cmFjZSgnZW5mb3JjZU1pbmltdW1Td2F0Y2hlcyBzdGFjayB0cmFjZScpO1xuXHRcdH1cblxuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHBhcnNlSW50KHBhbGV0dGVEcm9wZG93bi52YWx1ZSwgMTApO1xuXG5cdGxldCBuZXdWYWx1ZSA9IGN1cnJlbnRWYWx1ZTtcblxuXHQvLyBlbnN1ZSB0aGUgdmFsdWUgaXMgd2l0aGluIHRoZSBhbGxvd2VkIHJhbmdlXG5cdGlmIChjdXJyZW50VmFsdWUgPCBtaW5pbXVtU3dhdGNoZXMpIHtcblx0XHRuZXdWYWx1ZSA9IG1pbmltdW1Td2F0Y2hlcztcblx0fSBlbHNlIGlmIChcblx0XHRtYXhpbXVtU3dhdGNoZXMgIT09IHVuZGVmaW5lZCAmJlxuXHRcdGN1cnJlbnRWYWx1ZSA+IG1heGltdW1Td2F0Y2hlc1xuXHQpIHtcblx0XHRuZXdWYWx1ZSA9IG1heGltdW1Td2F0Y2hlcztcblx0fVxuXG5cdGlmIChuZXdWYWx1ZSAhPT0gY3VycmVudFZhbHVlKSB7XG5cdFx0Ly8gdXBkYXRlIHZhbHVlIGluIHRoZSBkcm9wZG93biBtZW51XG5cdFx0cGFsZXR0ZURyb3Bkb3duLnZhbHVlID0gbmV3VmFsdWUudG9TdHJpbmcoKTtcblxuXHRcdC8vIHRyaWdnZXIgYSBjaGFuZ2UgZXZlbnQgdG8gbm90aWZ5IHRoZSBhcHBsaWNhdGlvblxuXHRcdGNvbnN0IGV2ZW50ID0gbmV3IEV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUgfSk7XG5cdFx0dHJ5IHtcblx0XHRcdHBhbGV0dGVEcm9wZG93bi5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3IpIHtcblx0XHRcdFx0bG9nZ2VyLmVycm9yKFxuXHRcdFx0XHRcdGBGYWlsZWQgdG8gZGlzcGF0Y2ggY2hhbmdlIGV2ZW50IHRvIHBhbGV0dGUtbnVtYmVyLW9wdGlvbnMgZHJvcGRvd24gbWVudTogJHtlcnJvcn1gLFxuXHRcdFx0XHRcdCd1aSA+IGJhc2UgPiBlbmZvcmNlU3dhdGNoUnVsZXMoKSdcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGRpc3BhdGNoIGNoYW5nZSBldmVudDogJHtlcnJvcn1gKTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGJhc2U6IFVJRm5CYXNlSW50ZXJmYWNlID0ge1xuXHRlbmZvcmNlU3dhdGNoUnVsZXNcbn07XG4iXX0=