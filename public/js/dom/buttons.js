// File: src/dom/buttons.ts
import { core, superUtils } from '../common';
import { config } from '../config';
import { start } from '../palette/start';
const buttonDebounce = config.consts.debounce.button || 300;
export const handlePaletteGen = core.debounce(() => {
    try {
        const params = superUtils.dom.getGenButtonParams();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb20vYnV0dG9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyQkFBMkI7QUFHM0IsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDN0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNuQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFekMsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQztBQUU1RCxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtJQUNsRCxJQUFJLENBQUM7UUFDSixNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFFbkQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1lBRTlELE9BQU87UUFDUixDQUFDO1FBRUQsTUFBTSxFQUNMLFFBQVEsRUFDUixXQUFXLEVBQ1gsV0FBVyxFQUNYLFdBQVcsRUFDWCxhQUFhLEVBQ2IsYUFBYSxFQUNiLGNBQWMsRUFDZCxHQUFHLE1BQU0sQ0FBQztRQUVYLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMvQixPQUFPLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7WUFFM0QsT0FBTztRQUNSLENBQUM7UUFFRCxNQUFNLE9BQU8sR0FBbUI7WUFDL0IsUUFBUTtZQUNSLFdBQVc7WUFDWCxXQUFXO1lBQ1gsV0FBVztZQUNYLGFBQWE7WUFDYixhQUFhO1lBQ2IsY0FBYztTQUNkLENBQUM7UUFFRixLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkNBQTJDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDbkUsQ0FBQztBQUNGLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUVuQixNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUc7SUFDdEIsZ0JBQWdCO0NBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvZG9tL2J1dHRvbnMudHNcblxuaW1wb3J0IHsgUGFsZXR0ZU9wdGlvbnMgfSBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgeyBjb3JlLCBzdXBlclV0aWxzIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgeyBzdGFydCB9IGZyb20gJy4uL3BhbGV0dGUvc3RhcnQnO1xuXG5jb25zdCBidXR0b25EZWJvdW5jZSA9IGNvbmZpZy5jb25zdHMuZGVib3VuY2UuYnV0dG9uIHx8IDMwMDtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZVBhbGV0dGVHZW4gPSBjb3JlLmRlYm91bmNlKCgpID0+IHtcblx0dHJ5IHtcblx0XHRjb25zdCBwYXJhbXMgPSBzdXBlclV0aWxzLmRvbS5nZXRHZW5CdXR0b25QYXJhbXMoKTtcblxuXHRcdGlmICghcGFyYW1zKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gcmV0cmlldmUgZ2VuZXJhdGVCdXR0b24gcGFyYW1ldGVycycpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3Qge1xuXHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRjdXN0b21Db2xvcixcblx0XHRcdHBhbGV0dGVUeXBlLFxuXHRcdFx0ZW5hYmxlQWxwaGEsXG5cdFx0XHRsaW1pdERhcmtuZXNzLFxuXHRcdFx0bGltaXRHcmF5bmVzcyxcblx0XHRcdGxpbWl0TGlnaHRuZXNzXG5cdFx0fSA9IHBhcmFtcztcblxuXHRcdGlmICghcGFsZXR0ZVR5cGUgfHwgIW51bUJveGVzKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdwYWxldHRlVHlwZSBhbmQvb3IgbnVtQm94ZXMgYXJlIHVuZGVmaW5lZCcpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3Qgb3B0aW9uczogUGFsZXR0ZU9wdGlvbnMgPSB7XG5cdFx0XHRudW1Cb3hlcyxcblx0XHRcdGN1c3RvbUNvbG9yLFxuXHRcdFx0cGFsZXR0ZVR5cGUsXG5cdFx0XHRlbmFibGVBbHBoYSxcblx0XHRcdGxpbWl0RGFya25lc3MsXG5cdFx0XHRsaW1pdEdyYXluZXNzLFxuXHRcdFx0bGltaXRMaWdodG5lc3Ncblx0XHR9O1xuXG5cdFx0c3RhcnQucGFsZXR0ZUdlbihvcHRpb25zKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gaGFuZGxlIGdlbmVyYXRlIGJ1dHRvbiBjbGljazogJHtlcnJvcn1gKTtcblx0fVxufSwgYnV0dG9uRGVib3VuY2UpO1xuXG5leHBvcnQgY29uc3QgYnV0dG9ucyA9IHtcblx0aGFuZGxlUGFsZXR0ZUdlblxufTtcbiJdfQ==