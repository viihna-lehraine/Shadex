// File: src/palette/common/paletteUtils/adjust.ts
import { core, helpers } from '../../../common/index.js';
import { data } from '../../../data/index.js';
const adjustments = data.consts.adjustments;
const mode = data.mode;
function sl(color) {
    try {
        if (!core.validate.colorValues(color)) {
            if (mode.errorLogs)
                console.error('Invalid color valus for adjustment.');
            helpers.dom.showToast('Invalid color values');
            return color;
        }
        const adjustedSaturation = Math.min(Math.max(color.value.saturation + adjustments.slaValue, 0), 100);
        const adjustedLightness = Math.min(100);
        return {
            value: {
                hue: color.value.hue,
                saturation: core.brand.asPercentile(adjustedSaturation),
                lightness: core.brand.asPercentile(adjustedLightness),
                alpha: color.value.alpha
            },
            format: 'hsl'
        };
    }
    catch (error) {
        if (mode.errorLogs)
            console.error(`Error adjusting saturation and lightness: ${error}`);
        return color;
    }
}
export const adjust = {
    sl
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRqdXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3BhbGV0dGUvY29tbW9uL3BhbGV0dGVVdGlscy9hZGp1c3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsa0RBQWtEO0FBR2xELE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRTlDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQzVDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFFdkIsU0FBUyxFQUFFLENBQUMsS0FBVTtJQUNyQixJQUFJLENBQUM7UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUN2QyxJQUFJLElBQUksQ0FBQyxTQUFTO2dCQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7WUFFdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUU5QyxPQUFPLEtBQUssQ0FBQztRQUNkLENBQUM7UUFFRCxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFDMUQsR0FBRyxDQUNILENBQUM7UUFDRixNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFeEMsT0FBTztZQUNOLEtBQUssRUFBRTtnQkFDTixHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHO2dCQUNwQixVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUM7Z0JBQ3ZELFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQztnQkFDckQsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSzthQUN4QjtZQUNELE1BQU0sRUFBRSxLQUFLO1NBQ2IsQ0FBQztJQUNILENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLElBQUksSUFBSSxDQUFDLFNBQVM7WUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyw2Q0FBNkMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUVyRSxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUErQjtJQUNqRCxFQUFFO0NBQ08sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IHNyYy9wYWxldHRlL2NvbW1vbi9wYWxldHRlVXRpbHMvYWRqdXN0LnRzXG5cbmltcG9ydCB7IEhTTCwgUGFsZXR0ZUNvbW1vbl9VdGlsc19BZGp1c3QgfSBmcm9tICcuLi8uLi8uLi9pbmRleC9pbmRleC5qcyc7XG5pbXBvcnQgeyBjb3JlLCBoZWxwZXJzIH0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi8uLi8uLi9kYXRhL2luZGV4LmpzJztcblxuY29uc3QgYWRqdXN0bWVudHMgPSBkYXRhLmNvbnN0cy5hZGp1c3RtZW50cztcbmNvbnN0IG1vZGUgPSBkYXRhLm1vZGU7XG5cbmZ1bmN0aW9uIHNsKGNvbG9yOiBIU0wpOiBIU0wge1xuXHR0cnkge1xuXHRcdGlmICghY29yZS52YWxpZGF0ZS5jb2xvclZhbHVlcyhjb2xvcikpIHtcblx0XHRcdGlmIChtb2RlLmVycm9yTG9ncylcblx0XHRcdFx0Y29uc29sZS5lcnJvcignSW52YWxpZCBjb2xvciB2YWx1cyBmb3IgYWRqdXN0bWVudC4nKTtcblxuXHRcdFx0aGVscGVycy5kb20uc2hvd1RvYXN0KCdJbnZhbGlkIGNvbG9yIHZhbHVlcycpO1xuXG5cdFx0XHRyZXR1cm4gY29sb3I7XG5cdFx0fVxuXG5cdFx0Y29uc3QgYWRqdXN0ZWRTYXR1cmF0aW9uID0gTWF0aC5taW4oXG5cdFx0XHRNYXRoLm1heChjb2xvci52YWx1ZS5zYXR1cmF0aW9uICsgYWRqdXN0bWVudHMuc2xhVmFsdWUsIDApLFxuXHRcdFx0MTAwXG5cdFx0KTtcblx0XHRjb25zdCBhZGp1c3RlZExpZ2h0bmVzcyA9IE1hdGgubWluKDEwMCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBjb2xvci52YWx1ZS5odWUsXG5cdFx0XHRcdHNhdHVyYXRpb246IGNvcmUuYnJhbmQuYXNQZXJjZW50aWxlKGFkanVzdGVkU2F0dXJhdGlvbiksXG5cdFx0XHRcdGxpZ2h0bmVzczogY29yZS5icmFuZC5hc1BlcmNlbnRpbGUoYWRqdXN0ZWRMaWdodG5lc3MpLFxuXHRcdFx0XHRhbHBoYTogY29sb3IudmFsdWUuYWxwaGFcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdoc2wnXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRpZiAobW9kZS5lcnJvckxvZ3MpXG5cdFx0XHRjb25zb2xlLmVycm9yKGBFcnJvciBhZGp1c3Rpbmcgc2F0dXJhdGlvbiBhbmQgbGlnaHRuZXNzOiAke2Vycm9yfWApO1xuXG5cdFx0cmV0dXJuIGNvbG9yO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBhZGp1c3Q6IFBhbGV0dGVDb21tb25fVXRpbHNfQWRqdXN0ID0ge1xuXHRzbFxufSBhcyBjb25zdDtcbiJdfQ==