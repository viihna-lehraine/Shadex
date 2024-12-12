// File: src/common/utils/palette.ts
import { core } from '../core';
import { data } from '../../data';
import { helpers } from '../helpers';
const mode = data.mode;
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
            if (mode.errorLogs)
                console.error('Invalid color values.');
            helpers.dom.showToast('Invalid color.');
            return;
        }
        const colorTextOutputBox = document.getElementById(`color-text-output-box-${boxNumber}`);
        if (!colorTextOutputBox)
            return;
        const stringifiedColor = core.convert.toCSSColorString(clonedColor);
        if (!mode.quiet)
            console.log(`Adding CSS-formatted color to DOM ${stringifiedColor}`);
        colorTextOutputBox.value = stringifiedColor;
        colorTextOutputBox.setAttribute('data-format', color.format);
    }
    catch (error) {
        if (mode.errorLogs)
            console.error('Failed to populate color text output box:', error);
        return;
    }
}
export const palette = {
    createObject,
    populateOutputBox
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFsZXR0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcGFsZXR0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQ0FBb0M7QUFVcEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUMvQixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUV2QixTQUFTLFlBQVksQ0FDcEIsSUFBWSxFQUNaLEtBQW9CLEVBQ3BCLFNBQWMsRUFDZCxRQUFnQixFQUNoQixTQUFpQixFQUNqQixXQUFvQixFQUNwQixTQUFrQixFQUNsQixTQUFrQixFQUNsQixVQUFtQjtJQUVuQixPQUFPO1FBQ04sRUFBRSxFQUFFLEdBQUcsSUFBSSxJQUFJLFNBQVMsRUFBRTtRQUMxQixLQUFLO1FBQ0wsS0FBSyxFQUFFO1lBQ04sV0FBVyxFQUFFLFdBQVc7WUFDeEIsYUFBYSxFQUFFLFNBQVM7WUFDeEIsYUFBYSxFQUFFLFNBQVM7WUFDeEIsY0FBYyxFQUFFLFVBQVU7U0FDMUI7UUFDRCxRQUFRLEVBQUU7WUFDVCxRQUFRO1lBQ1IsV0FBVyxFQUFFLElBQUk7WUFDakIsV0FBVyxFQUFFO2dCQUNaLFFBQVEsRUFBRSxTQUFTO2dCQUNuQixlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sSUFBSSxFQUFFO2FBQ3ZDO1lBQ0QsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7U0FDckI7S0FDRCxDQUFDO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FDaEMsS0FBMEIsRUFDMUIsU0FBaUI7SUFFakIsSUFBSSxDQUFDO1FBQ0osTUFBTSxXQUFXLEdBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDeEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRS9CLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1lBQzdDLElBQUksSUFBSSxDQUFDLFNBQVM7Z0JBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBRTNELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFeEMsT0FBTztRQUNSLENBQUM7UUFFRCxNQUFNLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQ2pELHlCQUF5QixTQUFTLEVBQUUsQ0FDVCxDQUFDO1FBRTdCLElBQUksQ0FBQyxrQkFBa0I7WUFBRSxPQUFPO1FBRWhDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVwRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7WUFDZCxPQUFPLENBQUMsR0FBRyxDQUNWLHFDQUFxQyxnQkFBZ0IsRUFBRSxDQUN2RCxDQUFDO1FBRUgsa0JBQWtCLENBQUMsS0FBSyxHQUFHLGdCQUFnQixDQUFDO1FBQzVDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLElBQUksSUFBSSxDQUFDLFNBQVM7WUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVuRSxPQUFPO0lBQ1IsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQXlCO0lBQzVDLFlBQVk7SUFDWixpQkFBaUI7Q0FDUixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2NvbW1vbi91dGlscy9wYWxldHRlLnRzXG5cbmltcG9ydCB7XG5cdENvbG9yLFxuXHRDb2xvclN0cmluZyxcblx0Q29tbW9uVXRpbHNGblBhbGV0dGUsXG5cdEhTTCxcblx0UGFsZXR0ZSxcblx0UGFsZXR0ZUl0ZW1cbn0gZnJvbSAnLi4vLi4vaW5kZXgnO1xuaW1wb3J0IHsgY29yZSB9IGZyb20gJy4uL2NvcmUnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHsgaGVscGVycyB9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5jb25zdCBtb2RlID0gZGF0YS5tb2RlO1xuXG5mdW5jdGlvbiBjcmVhdGVPYmplY3QoXG5cdHR5cGU6IHN0cmluZyxcblx0aXRlbXM6IFBhbGV0dGVJdGVtW10sXG5cdGJhc2VDb2xvcjogSFNMLFxuXHRudW1Cb3hlczogbnVtYmVyLFxuXHRwYWxldHRlSUQ6IG51bWJlcixcblx0ZW5hYmxlQWxwaGE6IGJvb2xlYW4sXG5cdGxpbWl0RGFyazogYm9vbGVhbixcblx0bGltaXRHcmF5OiBib29sZWFuLFxuXHRsaW1pdExpZ2h0OiBib29sZWFuXG4pOiBQYWxldHRlIHtcblx0cmV0dXJuIHtcblx0XHRpZDogYCR7dHlwZX1fJHtwYWxldHRlSUR9YCxcblx0XHRpdGVtcyxcblx0XHRmbGFnczoge1xuXHRcdFx0ZW5hYmxlQWxwaGE6IGVuYWJsZUFscGhhLFxuXHRcdFx0bGltaXREYXJrbmVzczogbGltaXREYXJrLFxuXHRcdFx0bGltaXRHcmF5bmVzczogbGltaXRHcmF5LFxuXHRcdFx0bGltaXRMaWdodG5lc3M6IGxpbWl0TGlnaHRcblx0XHR9LFxuXHRcdG1ldGFkYXRhOiB7XG5cdFx0XHRudW1Cb3hlcyxcblx0XHRcdHBhbGV0dGVUeXBlOiB0eXBlLFxuXHRcdFx0Y3VzdG9tQ29sb3I6IHtcblx0XHRcdFx0aHNsQ29sb3I6IGJhc2VDb2xvcixcblx0XHRcdFx0Y29udmVydGVkQ29sb3JzOiBpdGVtc1swXT8uY29sb3JzIHx8IHt9XG5cdFx0XHR9LFxuXHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0fVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9wdWxhdGVPdXRwdXRCb3goXG5cdGNvbG9yOiBDb2xvciB8IENvbG9yU3RyaW5nLFxuXHRib3hOdW1iZXI6IG51bWJlclxuKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgY2xvbmVkQ29sb3I6IENvbG9yID0gY29yZS5ndWFyZHMuaXNDb2xvcihjb2xvcilcblx0XHRcdD8gY29yZS5iYXNlLmNsb25lKGNvbG9yKVxuXHRcdFx0OiBjb3JlLmNvbnZlcnQudG9Db2xvcihjb2xvcik7XG5cblx0XHRpZiAoIWNvcmUudmFsaWRhdGUuY29sb3JWYWx1ZXMoY2xvbmVkQ29sb3IpKSB7XG5cdFx0XHRpZiAobW9kZS5lcnJvckxvZ3MpIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgY29sb3IgdmFsdWVzLicpO1xuXG5cdFx0XHRoZWxwZXJzLmRvbS5zaG93VG9hc3QoJ0ludmFsaWQgY29sb3IuJyk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBjb2xvclRleHRPdXRwdXRCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdGBjb2xvci10ZXh0LW91dHB1dC1ib3gtJHtib3hOdW1iZXJ9YFxuXHRcdCkgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG5cblx0XHRpZiAoIWNvbG9yVGV4dE91dHB1dEJveCkgcmV0dXJuO1xuXG5cdFx0Y29uc3Qgc3RyaW5naWZpZWRDb2xvciA9IGNvcmUuY29udmVydC50b0NTU0NvbG9yU3RyaW5nKGNsb25lZENvbG9yKTtcblxuXHRcdGlmICghbW9kZS5xdWlldClcblx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRgQWRkaW5nIENTUy1mb3JtYXR0ZWQgY29sb3IgdG8gRE9NICR7c3RyaW5naWZpZWRDb2xvcn1gXG5cdFx0XHQpO1xuXG5cdFx0Y29sb3JUZXh0T3V0cHV0Qm94LnZhbHVlID0gc3RyaW5naWZpZWRDb2xvcjtcblx0XHRjb2xvclRleHRPdXRwdXRCb3guc2V0QXR0cmlidXRlKCdkYXRhLWZvcm1hdCcsIGNvbG9yLmZvcm1hdCk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKG1vZGUuZXJyb3JMb2dzKVxuXHRcdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIHBvcHVsYXRlIGNvbG9yIHRleHQgb3V0cHV0IGJveDonLCBlcnJvcik7XG5cblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IHBhbGV0dGU6IENvbW1vblV0aWxzRm5QYWxldHRlID0ge1xuXHRjcmVhdGVPYmplY3QsXG5cdHBvcHVsYXRlT3V0cHV0Qm94XG59IGFzIGNvbnN0O1xuIl19