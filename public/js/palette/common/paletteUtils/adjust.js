// File: src/palette/common/paletteUtils/adjust.ts
import { core, helpers } from '../../../common';
import { config } from '../../../config';
const adjustments = config.consts.adjustments;
const mode = config.mode;
function sl(color) {
    try {
        if (!core.validateColorValues(color)) {
            if (mode.logErrors)
                console.error('Invalid color valus for adjustment.');
            helpers.dom.showToast('Invalid color values');
            return color;
        }
        const adjustedSaturation = Math.min(Math.max(color.value.saturation + adjustments.slaValue, 0), 100);
        const adjustedLightness = Math.min(100);
        return {
            value: {
                hue: color.value.hue,
                saturation: adjustedSaturation,
                lightness: adjustedLightness,
                alpha: color.value.alpha
            },
            format: 'hsl'
        };
    }
    catch (error) {
        if (mode.logErrors)
            console.error(`Error adjusting saturation and lightness: ${error}`);
        return color;
    }
}
export const adjust = { sl };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRqdXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3BhbGV0dGUvY29tbW9uL3BhbGV0dGVVdGlscy9hZGp1c3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsa0RBQWtEO0FBR2xELE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDaEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXpDLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQzlDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFFekIsU0FBUyxFQUFFLENBQUMsS0FBVTtJQUNyQixJQUFJLENBQUM7UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdEMsSUFBSSxJQUFJLENBQUMsU0FBUztnQkFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1lBRXRELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFFOUMsT0FBTyxLQUFLLENBQUM7UUFDZCxDQUFDO1FBRUQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQzFELEdBQUcsQ0FDSCxDQUFDO1FBQ0YsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXhDLE9BQU87WUFDTixLQUFLLEVBQUU7Z0JBQ04sR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRztnQkFDcEIsVUFBVSxFQUFFLGtCQUFrQjtnQkFDOUIsU0FBUyxFQUFFLGlCQUFpQjtnQkFDNUIsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSzthQUN4QjtZQUNELE1BQU0sRUFBRSxLQUFLO1NBQ2IsQ0FBQztJQUNILENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLElBQUksSUFBSSxDQUFDLFNBQVM7WUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyw2Q0FBNkMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUVyRSxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLEVBQUUsRUFBRSxFQUFXLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBzcmMvcGFsZXR0ZS9jb21tb24vcGFsZXR0ZVV0aWxzL2FkanVzdC50c1xuXG5pbXBvcnQgeyBIU0wgfSBmcm9tICcuLi8uLi8uLi9pbmRleC9pbmRleCc7XG5pbXBvcnQgeyBjb3JlLCBoZWxwZXJzIH0gZnJvbSAnLi4vLi4vLi4vY29tbW9uJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4uLy4uLy4uL2NvbmZpZyc7XG5cbmNvbnN0IGFkanVzdG1lbnRzID0gY29uZmlnLmNvbnN0cy5hZGp1c3RtZW50cztcbmNvbnN0IG1vZGUgPSBjb25maWcubW9kZTtcblxuZnVuY3Rpb24gc2woY29sb3I6IEhTTCk6IEhTTCB7XG5cdHRyeSB7XG5cdFx0aWYgKCFjb3JlLnZhbGlkYXRlQ29sb3JWYWx1ZXMoY29sb3IpKSB7XG5cdFx0XHRpZiAobW9kZS5sb2dFcnJvcnMpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgY29sb3IgdmFsdXMgZm9yIGFkanVzdG1lbnQuJyk7XG5cblx0XHRcdGhlbHBlcnMuZG9tLnNob3dUb2FzdCgnSW52YWxpZCBjb2xvciB2YWx1ZXMnKTtcblxuXHRcdFx0cmV0dXJuIGNvbG9yO1xuXHRcdH1cblxuXHRcdGNvbnN0IGFkanVzdGVkU2F0dXJhdGlvbiA9IE1hdGgubWluKFxuXHRcdFx0TWF0aC5tYXgoY29sb3IudmFsdWUuc2F0dXJhdGlvbiArIGFkanVzdG1lbnRzLnNsYVZhbHVlLCAwKSxcblx0XHRcdDEwMFxuXHRcdCk7XG5cdFx0Y29uc3QgYWRqdXN0ZWRMaWdodG5lc3MgPSBNYXRoLm1pbigxMDApO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogY29sb3IudmFsdWUuaHVlLFxuXHRcdFx0XHRzYXR1cmF0aW9uOiBhZGp1c3RlZFNhdHVyYXRpb24sXG5cdFx0XHRcdGxpZ2h0bmVzczogYWRqdXN0ZWRMaWdodG5lc3MsXG5cdFx0XHRcdGFscGhhOiBjb2xvci52YWx1ZS5hbHBoYVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzbCdcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGlmIChtb2RlLmxvZ0Vycm9ycylcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEVycm9yIGFkanVzdGluZyBzYXR1cmF0aW9uIGFuZCBsaWdodG5lc3M6ICR7ZXJyb3J9YCk7XG5cblx0XHRyZXR1cm4gY29sb3I7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGFkanVzdCA9IHsgc2wgfSBhcyBjb25zdDtcbiJdfQ==