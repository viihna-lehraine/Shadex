// File: src/dom/buttons.ts
import { core, superUtils } from '../common/index.js';
import { data } from '../data/index.js';
import { start } from '../palette/index.js';
const buttonDebounce = data.consts.debounce.button || 300;
const handlePaletteGen = core.base.debounce(() => {
    try {
        const params = superUtils.dom.getGenButtonArgs();
        if (!params) {
            console.error('Failed to retrieve generateButton parameters');
            return;
        }
        const { numBoxes, customColor, paletteType, enableAlpha, limitDarkness, limitGrayness, limitLightness } = params;
        if (!paletteType || !numBoxes) {
            console.error('paletteType and/or numBoxes are undefined');
            return;
        }
        const options = {
            numBoxes,
            customColor,
            paletteType,
            enableAlpha,
            limitDarkness,
            limitGrayness,
            limitLightness
        };
        start.paletteGen(options);
    }
    catch (error) {
        console.error(`Failed to handle generate button click: ${error}`);
    }
}, buttonDebounce);
export const buttons = {
    handlePaletteGen
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb20vYnV0dG9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyQkFBMkI7QUFHM0IsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN0RCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDeEMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTVDLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUM7QUFFMUQsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7SUFDaEQsSUFBSSxDQUFDO1FBQ0osTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRWpELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztZQUU5RCxPQUFPO1FBQ1IsQ0FBQztRQUVELE1BQU0sRUFDTCxRQUFRLEVBQ1IsV0FBVyxFQUNYLFdBQVcsRUFDWCxXQUFXLEVBQ1gsYUFBYSxFQUNiLGFBQWEsRUFDYixjQUFjLEVBQ2QsR0FBRyxNQUFNLENBQUM7UUFFWCxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDL0IsT0FBTyxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1lBRTNELE9BQU87UUFDUixDQUFDO1FBRUQsTUFBTSxPQUFPLEdBQW1CO1lBQy9CLFFBQVE7WUFDUixXQUFXO1lBQ1gsV0FBVztZQUNYLFdBQVc7WUFDWCxhQUFhO1lBQ2IsYUFBYTtZQUNiLGNBQWM7U0FDZCxDQUFDO1FBRUYsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ25FLENBQUM7QUFDRixDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFFbkIsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUEwQjtJQUM3QyxnQkFBZ0I7Q0FDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9kb20vYnV0dG9ucy50c1xuXG5pbXBvcnQgeyBET01CdXR0b25zRm5JbnRlcmZhY2UsIFBhbGV0dGVPcHRpb25zIH0gZnJvbSAnLi4vaW5kZXgvaW5kZXguanMnO1xuaW1wb3J0IHsgY29yZSwgc3VwZXJVdGlscyB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5qcyc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vZGF0YS9pbmRleC5qcyc7XG5pbXBvcnQgeyBzdGFydCB9IGZyb20gJy4uL3BhbGV0dGUvaW5kZXguanMnO1xuXG5jb25zdCBidXR0b25EZWJvdW5jZSA9IGRhdGEuY29uc3RzLmRlYm91bmNlLmJ1dHRvbiB8fCAzMDA7XG5cbmNvbnN0IGhhbmRsZVBhbGV0dGVHZW4gPSBjb3JlLmJhc2UuZGVib3VuY2UoKCkgPT4ge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBhcmFtcyA9IHN1cGVyVXRpbHMuZG9tLmdldEdlbkJ1dHRvbkFyZ3MoKTtcblxuXHRcdGlmICghcGFyYW1zKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gcmV0cmlldmUgZ2VuZXJhdGVCdXR0b24gcGFyYW1ldGVycycpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3Qge1xuXHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRjdXN0b21Db2xvcixcblx0XHRcdHBhbGV0dGVUeXBlLFxuXHRcdFx0ZW5hYmxlQWxwaGEsXG5cdFx0XHRsaW1pdERhcmtuZXNzLFxuXHRcdFx0bGltaXRHcmF5bmVzcyxcblx0XHRcdGxpbWl0TGlnaHRuZXNzXG5cdFx0fSA9IHBhcmFtcztcblxuXHRcdGlmICghcGFsZXR0ZVR5cGUgfHwgIW51bUJveGVzKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdwYWxldHRlVHlwZSBhbmQvb3IgbnVtQm94ZXMgYXJlIHVuZGVmaW5lZCcpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3Qgb3B0aW9uczogUGFsZXR0ZU9wdGlvbnMgPSB7XG5cdFx0XHRudW1Cb3hlcyxcblx0XHRcdGN1c3RvbUNvbG9yLFxuXHRcdFx0cGFsZXR0ZVR5cGUsXG5cdFx0XHRlbmFibGVBbHBoYSxcblx0XHRcdGxpbWl0RGFya25lc3MsXG5cdFx0XHRsaW1pdEdyYXluZXNzLFxuXHRcdFx0bGltaXRMaWdodG5lc3Ncblx0XHR9O1xuXG5cdFx0c3RhcnQucGFsZXR0ZUdlbihvcHRpb25zKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gaGFuZGxlIGdlbmVyYXRlIGJ1dHRvbiBjbGljazogJHtlcnJvcn1gKTtcblx0fVxufSwgYnV0dG9uRGVib3VuY2UpO1xuXG5leHBvcnQgY29uc3QgYnV0dG9uczogRE9NQnV0dG9uc0ZuSW50ZXJmYWNlID0ge1xuXHRoYW5kbGVQYWxldHRlR2VuXG59O1xuIl19