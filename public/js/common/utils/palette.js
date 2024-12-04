// File: src/common/utils/palette.ts
import { config } from '../../config';
import { core } from '../core';
import { helpers } from '../helpers';
const mode = config.mode;
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
            }
        }
    };
}
export function populateOutputBox(color, boxNumber) {
    try {
        const clonedColor = core.isColor(color)
            ? core.clone(color)
            : core.colorStringToColor(color);
        if (!core.validateColorValues(clonedColor)) {
            if (mode.logErrors)
                console.error('Invalid color values.');
            helpers.dom.showToast('Invalid color.');
            return;
        }
        const colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);
        if (!colorTextOutputBox)
            return;
        const stringifiedColor = core.getCSSColorString(clonedColor);
        if (!mode.quiet)
            console.log(`Adding CSS-formatted color to DOM ${stringifiedColor}`);
        colorTextOutputBox.value = stringifiedColor;
        colorTextOutputBox.setAttribute('data-format', color.format);
    }
    catch (error) {
        if (mode.logErrors)
            console.error('Failed to populate color text output box:', error);
        return;
    }
}
export const palette = { createObject, populateOutputBox };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFsZXR0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcGFsZXR0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQ0FBb0M7QUFHcEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN0QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQy9CLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFckMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUV6QixTQUFTLFlBQVksQ0FDcEIsSUFBWSxFQUNaLEtBQW9CLEVBQ3BCLFNBQWMsRUFDZCxRQUFnQixFQUNoQixTQUFpQixFQUNqQixXQUFvQixFQUNwQixTQUFrQixFQUNsQixTQUFrQixFQUNsQixVQUFtQjtJQUVuQixPQUFPO1FBQ04sRUFBRSxFQUFFLEdBQUcsSUFBSSxJQUFJLFNBQVMsRUFBRTtRQUMxQixLQUFLO1FBQ0wsS0FBSyxFQUFFO1lBQ04sV0FBVyxFQUFFLFdBQVc7WUFDeEIsYUFBYSxFQUFFLFNBQVM7WUFDeEIsYUFBYSxFQUFFLFNBQVM7WUFDeEIsY0FBYyxFQUFFLFVBQVU7U0FDMUI7UUFDRCxRQUFRLEVBQUU7WUFDVCxRQUFRO1lBQ1IsV0FBVyxFQUFFLElBQUk7WUFDakIsV0FBVyxFQUFFO2dCQUNaLFFBQVEsRUFBRSxTQUFTO2dCQUNuQixlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sSUFBSSxFQUFFO2FBQ3ZDO1NBQ0Q7S0FDRCxDQUFDO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FDaEMsS0FBMEIsRUFDMUIsU0FBaUI7SUFFakIsSUFBSSxDQUFDO1FBQ0osTUFBTSxXQUFXLEdBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFDN0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ25CLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1lBQzVDLElBQUksSUFBSSxDQUFDLFNBQVM7Z0JBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBRTNELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFeEMsT0FBTztRQUNSLENBQUM7UUFFRCxNQUFNLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQ2pELHlCQUF5QixTQUFTLEVBQUUsQ0FDVCxDQUFDO1FBRTdCLElBQUksQ0FBQyxrQkFBa0I7WUFBRSxPQUFPO1FBRWhDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTdELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztZQUNkLE9BQU8sQ0FBQyxHQUFHLENBQ1YscUNBQXFDLGdCQUFnQixFQUFFLENBQ3ZELENBQUM7UUFFSCxrQkFBa0IsQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUM7UUFDNUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxJQUFJLENBQUMsU0FBUztZQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRW5FLE9BQU87SUFDUixDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBVyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2NvbW1vbi91dGlscy9wYWxldHRlLnRzXG5cbmltcG9ydCB7IENvbG9yLCBDb2xvclN0cmluZywgSFNMLCBQYWxldHRlLCBQYWxldHRlSXRlbSB9IGZyb20gJy4uLy4uL2luZGV4JztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQgeyBjb3JlIH0gZnJvbSAnLi4vY29yZSc7XG5pbXBvcnQgeyBoZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmNvbnN0IG1vZGUgPSBjb25maWcubW9kZTtcblxuZnVuY3Rpb24gY3JlYXRlT2JqZWN0KFxuXHR0eXBlOiBzdHJpbmcsXG5cdGl0ZW1zOiBQYWxldHRlSXRlbVtdLFxuXHRiYXNlQ29sb3I6IEhTTCxcblx0bnVtQm94ZXM6IG51bWJlcixcblx0cGFsZXR0ZUlEOiBudW1iZXIsXG5cdGVuYWJsZUFscGhhOiBib29sZWFuLFxuXHRsaW1pdERhcms6IGJvb2xlYW4sXG5cdGxpbWl0R3JheTogYm9vbGVhbixcblx0bGltaXRMaWdodDogYm9vbGVhblxuKTogUGFsZXR0ZSB7XG5cdHJldHVybiB7XG5cdFx0aWQ6IGAke3R5cGV9XyR7cGFsZXR0ZUlEfWAsXG5cdFx0aXRlbXMsXG5cdFx0ZmxhZ3M6IHtcblx0XHRcdGVuYWJsZUFscGhhOiBlbmFibGVBbHBoYSxcblx0XHRcdGxpbWl0RGFya25lc3M6IGxpbWl0RGFyayxcblx0XHRcdGxpbWl0R3JheW5lc3M6IGxpbWl0R3JheSxcblx0XHRcdGxpbWl0TGlnaHRuZXNzOiBsaW1pdExpZ2h0XG5cdFx0fSxcblx0XHRtZXRhZGF0YToge1xuXHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRwYWxldHRlVHlwZTogdHlwZSxcblx0XHRcdGN1c3RvbUNvbG9yOiB7XG5cdFx0XHRcdGhzbENvbG9yOiBiYXNlQ29sb3IsXG5cdFx0XHRcdGNvbnZlcnRlZENvbG9yczogaXRlbXNbMF0/LmNvbG9ycyB8fCB7fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvcHVsYXRlT3V0cHV0Qm94KFxuXHRjb2xvcjogQ29sb3IgfCBDb2xvclN0cmluZyxcblx0Ym94TnVtYmVyOiBudW1iZXJcbik6IHZvaWQge1xuXHR0cnkge1xuXHRcdGNvbnN0IGNsb25lZENvbG9yOiBDb2xvciA9IGNvcmUuaXNDb2xvcihjb2xvcilcblx0XHRcdD8gY29yZS5jbG9uZShjb2xvcilcblx0XHRcdDogY29yZS5jb2xvclN0cmluZ1RvQ29sb3IoY29sb3IpO1xuXG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoY2xvbmVkQ29sb3IpKSB7XG5cdFx0XHRpZiAobW9kZS5sb2dFcnJvcnMpIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgY29sb3IgdmFsdWVzLicpO1xuXG5cdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0ludmFsaWQgY29sb3IuJyk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBjb2xvclRleHRPdXRwdXRCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdGBjb2xvci10ZXh0LW91dHB1dC1ib3gtJHtib3hOdW1iZXJ9YFxuXHRcdCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cblx0XHRpZiAoIWNvbG9yVGV4dE91dHB1dEJveCkgcmV0dXJuO1xuXG5cdFx0Y29uc3Qgc3RyaW5naWZpZWRDb2xvciA9IGNvcmUuZ2V0Q1NTQ29sb3JTdHJpbmcoY2xvbmVkQ29sb3IpO1xuXG5cdFx0aWYgKCFtb2RlLnF1aWV0KVxuXHRcdFx0Y29uc29sZS5sb2coXG5cdFx0XHRcdGBBZGRpbmcgQ1NTLWZvcm1hdHRlZCBjb2xvciB0byBET00gJHtzdHJpbmdpZmllZENvbG9yfWBcblx0XHRcdCk7XG5cblx0XHRjb2xvclRleHRPdXRwdXRCb3gudmFsdWUgPSBzdHJpbmdpZmllZENvbG9yO1xuXHRcdGNvbG9yVGV4dE91dHB1dEJveC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9ybWF0JywgY29sb3IuZm9ybWF0KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gcG9wdWxhdGUgY29sb3IgdGV4dCBvdXRwdXQgYm94OicsIGVycm9yKTtcblxuXHRcdHJldHVybjtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgcGFsZXR0ZSA9IHsgY3JlYXRlT2JqZWN0LCBwb3B1bGF0ZU91dHB1dEJveCB9IGFzIGNvbnN0O1xuIl19