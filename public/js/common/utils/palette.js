// File: src/common/utils/palette.js
import { core } from '../core/index.js';
import { data } from '../../data/index.js';
import { helpers } from '../helpers/index.js';
import { log } from '../../classes/logger/index.js';
const mode = data.mode;
const logMode = mode.logging;
function createObject(type, items, baseColor, numBoxes, paletteID, enableAlpha, limitDark, limitGray, limitLight) {
    return {
        id: `${type}_${paletteID}`,
        items,
        flags: {
            enableAlpha: enableAlpha,
            limitDarkness: limitDark,
            limitGrayness: limitGray,
            limitLightness: limitLight
        },
        metadata: {
            numBoxes,
            paletteType: type,
            customColor: {
                hslColor: baseColor,
                convertedColors: items[0]?.colors || {}
            },
            timestamp: Date.now()
        }
    };
}
export function populateOutputBox(color, boxNumber) {
    try {
        const clonedColor = core.guards.isColor(color)
            ? core.base.clone(color)
            : core.convert.toColor(color);
        if (!core.validate.colorValues(clonedColor)) {
            if (logMode.errors)
                log.error('Invalid color values.');
            helpers.dom.showToast('Invalid color.');
            return;
        }
        const colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);
        if (!colorTextOutputBox)
            return;
        const stringifiedColor = core.convert.toCSSColorString(clonedColor);
        if (!mode.quiet && logMode.info && logMode.verbosity > 0)
            log.info(`Adding CSS-formatted color to DOM ${stringifiedColor}`);
        colorTextOutputBox.value = stringifiedColor;
        colorTextOutputBox.setAttribute('data-format', color.format);
    }
    catch (error) {
        if (logMode.errors)
            log.error(`Failed to populate color text output box: ${error}`);
        return;
    }
}
export const palette = {
    createObject,
    populateOutputBox
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFsZXR0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcGFsZXR0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQ0FBb0M7QUFVcEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRXBELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUU3QixTQUFTLFlBQVksQ0FDcEIsSUFBWSxFQUNaLEtBQW9CLEVBQ3BCLFNBQWMsRUFDZCxRQUFnQixFQUNoQixTQUFpQixFQUNqQixXQUFvQixFQUNwQixTQUFrQixFQUNsQixTQUFrQixFQUNsQixVQUFtQjtJQUVuQixPQUFPO1FBQ04sRUFBRSxFQUFFLEdBQUcsSUFBSSxJQUFJLFNBQVMsRUFBRTtRQUMxQixLQUFLO1FBQ0wsS0FBSyxFQUFFO1lBQ04sV0FBVyxFQUFFLFdBQVc7WUFDeEIsYUFBYSxFQUFFLFNBQVM7WUFDeEIsYUFBYSxFQUFFLFNBQVM7WUFDeEIsY0FBYyxFQUFFLFVBQVU7U0FDMUI7UUFDRCxRQUFRLEVBQUU7WUFDVCxRQUFRO1lBQ1IsV0FBVyxFQUFFLElBQUk7WUFDakIsV0FBVyxFQUFFO2dCQUNaLFFBQVEsRUFBRSxTQUFTO2dCQUNuQixlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sSUFBSSxFQUFFO2FBQ3ZDO1lBQ0QsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7U0FDckI7S0FDRCxDQUFDO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FDaEMsS0FBMEIsRUFDMUIsU0FBaUI7SUFFakIsSUFBSSxDQUFDO1FBQ0osTUFBTSxXQUFXLEdBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDeEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRS9CLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1lBQzdDLElBQUksT0FBTyxDQUFDLE1BQU07Z0JBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBRXZELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFeEMsT0FBTztRQUNSLENBQUM7UUFFRCxNQUFNLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQ2pELHlCQUF5QixTQUFTLEVBQUUsQ0FDVCxDQUFDO1FBRTdCLElBQUksQ0FBQyxrQkFBa0I7WUFBRSxPQUFPO1FBRWhDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVwRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQztZQUN2RCxHQUFHLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFFbkUsa0JBQWtCLENBQUMsS0FBSyxHQUFHLGdCQUFnQixDQUFDO1FBQzVDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLElBQUksT0FBTyxDQUFDLE1BQU07WUFDakIsR0FBRyxDQUFDLEtBQUssQ0FBQyw2Q0FBNkMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUVqRSxPQUFPO0lBQ1IsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQXlCO0lBQzVDLFlBQVk7SUFDWixpQkFBaUI7Q0FDUixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2NvbW1vbi91dGlscy9wYWxldHRlLmpzXG5cbmltcG9ydCB7XG5cdENvbG9yLFxuXHRDb2xvclN0cmluZyxcblx0Q29tbW9uVXRpbHNGblBhbGV0dGUsXG5cdEhTTCxcblx0UGFsZXR0ZSxcblx0UGFsZXR0ZUl0ZW1cbn0gZnJvbSAnLi4vLi4vaW5kZXgnO1xuaW1wb3J0IHsgY29yZSB9IGZyb20gJy4uL2NvcmUvaW5kZXguanMnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uLy4uL2RhdGEvaW5kZXguanMnO1xuaW1wb3J0IHsgaGVscGVycyB9IGZyb20gJy4uL2hlbHBlcnMvaW5kZXguanMnO1xuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi4vLi4vY2xhc3Nlcy9sb2dnZXIvaW5kZXguanMnO1xuXG5jb25zdCBtb2RlID0gZGF0YS5tb2RlO1xuY29uc3QgbG9nTW9kZSA9IG1vZGUubG9nZ2luZztcblxuZnVuY3Rpb24gY3JlYXRlT2JqZWN0KFxuXHR0eXBlOiBzdHJpbmcsXG5cdGl0ZW1zOiBQYWxldHRlSXRlbVtdLFxuXHRiYXNlQ29sb3I6IEhTTCxcblx0bnVtQm94ZXM6IG51bWJlcixcblx0cGFsZXR0ZUlEOiBudW1iZXIsXG5cdGVuYWJsZUFscGhhOiBib29sZWFuLFxuXHRsaW1pdERhcms6IGJvb2xlYW4sXG5cdGxpbWl0R3JheTogYm9vbGVhbixcblx0bGltaXRMaWdodDogYm9vbGVhblxuKTogUGFsZXR0ZSB7XG5cdHJldHVybiB7XG5cdFx0aWQ6IGAke3R5cGV9XyR7cGFsZXR0ZUlEfWAsXG5cdFx0aXRlbXMsXG5cdFx0ZmxhZ3M6IHtcblx0XHRcdGVuYWJsZUFscGhhOiBlbmFibGVBbHBoYSxcblx0XHRcdGxpbWl0RGFya25lc3M6IGxpbWl0RGFyayxcblx0XHRcdGxpbWl0R3JheW5lc3M6IGxpbWl0R3JheSxcblx0XHRcdGxpbWl0TGlnaHRuZXNzOiBsaW1pdExpZ2h0XG5cdFx0fSxcblx0XHRtZXRhZGF0YToge1xuXHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRwYWxldHRlVHlwZTogdHlwZSxcblx0XHRcdGN1c3RvbUNvbG9yOiB7XG5cdFx0XHRcdGhzbENvbG9yOiBiYXNlQ29sb3IsXG5cdFx0XHRcdGNvbnZlcnRlZENvbG9yczogaXRlbXNbMF0/LmNvbG9ycyB8fCB7fVxuXHRcdFx0fSxcblx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdH1cblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvcHVsYXRlT3V0cHV0Qm94KFxuXHRjb2xvcjogQ29sb3IgfCBDb2xvclN0cmluZyxcblx0Ym94TnVtYmVyOiBudW1iZXJcbik6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNsb25lZENvbG9yOiBDb2xvciA9IGNvcmUuZ3VhcmRzLmlzQ29sb3IoY29sb3IpXG5cdFx0XHQ/IGNvcmUuYmFzZS5jbG9uZShjb2xvcilcblx0XHRcdDogY29yZS5jb252ZXJ0LnRvQ29sb3IoY29sb3IpO1xuXG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlLmNvbG9yVmFsdWVzKGNsb25lZENvbG9yKSkge1xuXHRcdFx0aWYgKGxvZ01vZGUuZXJyb3JzKSBsb2cuZXJyb3IoJ0ludmFsaWQgY29sb3IgdmFsdWVzLicpO1xuXG5cdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0ludmFsaWQgY29sb3IuJyk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBjb2xvclRleHRPdXRwdXRCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdGBjb2xvci10ZXh0LW91dHB1dC1ib3gtJHtib3hOdW1iZXJ9YFxuXHRcdCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cblx0XHRpZiAoIWNvbG9yVGV4dE91dHB1dEJveCkgcmV0dXJuO1xuXG5cdFx0Y29uc3Qgc3RyaW5naWZpZWRDb2xvciA9IGNvcmUuY29udmVydC50b0NTU0NvbG9yU3RyaW5nKGNsb25lZENvbG9yKTtcblxuXHRcdGlmICghbW9kZS5xdWlldCAmJiBsb2dNb2RlLmluZm8gJiYgbG9nTW9kZS52ZXJib3NpdHkgPiAwKVxuXHRcdFx0bG9nLmluZm8oYEFkZGluZyBDU1MtZm9ybWF0dGVkIGNvbG9yIHRvIERPTSAke3N0cmluZ2lmaWVkQ29sb3J9YCk7XG5cblx0XHRjb2xvclRleHRPdXRwdXRCb3gudmFsdWUgPSBzdHJpbmdpZmllZENvbG9yO1xuXHRcdGNvbG9yVGV4dE91dHB1dEJveC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9ybWF0JywgY29sb3IuZm9ybWF0KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobG9nTW9kZS5lcnJvcnMpXG5cdFx0XHRsb2cuZXJyb3IoYEZhaWxlZCB0byBwb3B1bGF0ZSBjb2xvciB0ZXh0IG91dHB1dCBib3g6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IHBhbGV0dGU6IENvbW1vblV0aWxzRm5QYWxldHRlID0ge1xuXHRjcmVhdGVPYmplY3QsXG5cdHBvcHVsYXRlT3V0cHV0Qm94XG59IGFzIGNvbnN0O1xuIl19