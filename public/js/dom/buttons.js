// File: src/dom/buttons.ts
import { core, utils } from '../common.js';
import { config } from '../config.js';
import { start } from '../palette/start.js';
export const handleGenButtonClick = core.debounce(() => {
    try {
        const params = utils.dom.getGenButtonParams();
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
}, config.consts.debounce.button || 300);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kb20vYnV0dG9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyQkFBMkI7QUFHM0IsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDeEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNuQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFekMsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7SUFDdEQsSUFBSSxDQUFDO1FBQ0osTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBRTlDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztZQUM5RCxPQUFPO1FBQ1IsQ0FBQztRQUVELE1BQU0sRUFDTCxRQUFRLEVBQ1IsV0FBVyxFQUNYLFdBQVcsRUFDWCxXQUFXLEVBQ1gsYUFBYSxFQUNiLGFBQWEsRUFDYixjQUFjLEVBQ2QsR0FBRyxNQUFNLENBQUM7UUFFWCxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDL0IsT0FBTyxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1lBRTNELE9BQU87UUFDUixDQUFDO1FBRUQsTUFBTSxPQUFPLEdBQW1CO1lBQy9CLFFBQVE7WUFDUixXQUFXO1lBQ1gsV0FBVztZQUNYLFdBQVc7WUFDWCxhQUFhO1lBQ2IsYUFBYTtZQUNiLGNBQWM7U0FDZCxDQUFDO1FBRUYsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ25FLENBQUM7QUFDRixDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlsZTogc3JjL2RvbS9idXR0b25zLnRzXG5cbmltcG9ydCB7IFBhbGV0dGVPcHRpb25zIH0gZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IHsgY29yZSwgdXRpbHMgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7IHN0YXJ0IH0gZnJvbSAnLi4vcGFsZXR0ZS9zdGFydCc7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVHZW5CdXR0b25DbGljayA9IGNvcmUuZGVib3VuY2UoKCkgPT4ge1xuXHR0cnkge1xuXHRcdGNvbnN0IHBhcmFtcyA9IHV0aWxzLmRvbS5nZXRHZW5CdXR0b25QYXJhbXMoKTtcblxuXHRcdGlmICghcGFyYW1zKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gcmV0cmlldmUgZ2VuZXJhdGVCdXR0b24gcGFyYW1ldGVycycpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHtcblx0XHRcdG51bUJveGVzLFxuXHRcdFx0Y3VzdG9tQ29sb3IsXG5cdFx0XHRwYWxldHRlVHlwZSxcblx0XHRcdGVuYWJsZUFscGhhLFxuXHRcdFx0bGltaXREYXJrbmVzcyxcblx0XHRcdGxpbWl0R3JheW5lc3MsXG5cdFx0XHRsaW1pdExpZ2h0bmVzc1xuXHRcdH0gPSBwYXJhbXM7XG5cblx0XHRpZiAoIXBhbGV0dGVUeXBlIHx8ICFudW1Cb3hlcykge1xuXHRcdFx0Y29uc29sZS5lcnJvcigncGFsZXR0ZVR5cGUgYW5kL29yIG51bUJveGVzIGFyZSB1bmRlZmluZWQnKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9wdGlvbnM6IFBhbGV0dGVPcHRpb25zID0ge1xuXHRcdFx0bnVtQm94ZXMsXG5cdFx0XHRjdXN0b21Db2xvcixcblx0XHRcdHBhbGV0dGVUeXBlLFxuXHRcdFx0ZW5hYmxlQWxwaGEsXG5cdFx0XHRsaW1pdERhcmtuZXNzLFxuXHRcdFx0bGltaXRHcmF5bmVzcyxcblx0XHRcdGxpbWl0TGlnaHRuZXNzXG5cdFx0fTtcblxuXHRcdHN0YXJ0LnBhbGV0dGVHZW4ob3B0aW9ucyk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGhhbmRsZSBnZW5lcmF0ZSBidXR0b24gY2xpY2s6ICR7ZXJyb3J9YCk7XG5cdH1cbn0sIGNvbmZpZy5jb25zdHMuZGVib3VuY2UuYnV0dG9uIHx8IDMwMCk7XG4iXX0=