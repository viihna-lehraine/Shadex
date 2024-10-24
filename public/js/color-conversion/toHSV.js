import { convert } from './conversion-index.js';
import { conversionHelpers } from '../helpers/conversion.js';
import { defaults } from '../utils/defaults.js';
function cmykToHSV(cmyk) {
    try {
        const rgb = convert.cmykToRGB(cmyk);
        return rgbToHSV(rgb);
    }
    catch (error) {
        console.error(`cmykToHSV() error: ${error}`);
        return defaults.defaultHSV();
    }
}
function hexToHSV(hex) {
    try {
        const rgb = convert.hexToRGB(hex);
        return convert.rgbToHSV(rgb);
    }
    catch (error) {
        console.error(`hexToHSV() error: ${error}`);
        return defaults.defaultHSV();
    }
}
function hslToHSV(hsl) {
    try {
        const s = hsl.value.saturation / 100;
        const l = hsl.value.lightness / 100;
        const value = l + s * Math.min(l, 1 - 1);
        const newSaturation = value === 0 ? 0 : 2 * (1 - l / value);
        return {
            value: {
                hue: Math.round(hsl.value.hue),
                saturation: Math.round(newSaturation * 100),
                value: Math.round(value * 100)
            },
            format: 'hsv'
        };
    }
    catch (error) {
        console.error(`hslToHSV() error: ${error}`);
        return defaults.defaultHSV();
    }
}
function labToHSV(lab) {
    try {
        const rgb = convert.labToRGB(lab);
        return rgbToHSV(rgb);
    }
    catch (error) {
        console.error(`labToHSV() error: ${error}`);
        return defaults.defaultHSV();
    }
}
function rgbToHSV(rgb) {
    try {
        rgb.value.red /= 255;
        rgb.value.green /= 255;
        rgb.value.blue /= 255;
        const max = Math.max(rgb.value.red, rgb.value.green, rgb.value.blue);
        const min = Math.min(rgb.value.red, rgb.value.green, rgb.value.blue);
        const delta = max - min;
        let hue = 0;
        const value = max;
        const saturation = max === 0 ? 0 : delta / max;
        if (max !== min) {
            switch (max) {
                case rgb.value.red:
                    hue =
                        (rgb.value.green - rgb.value.blue) / delta +
                            (rgb.value.green < rgb.value.blue ? 6 : 0);
                    break;
                case rgb.value.green:
                    hue = (rgb.value.blue - rgb.value.red) / delta + 2;
                    break;
                case rgb.value.blue:
                    hue = (rgb.value.red - rgb.value.green) / delta + 4;
                    break;
            }
            hue *= 60;
        }
        return {
            value: {
                hue: Math.round(hue),
                saturation: Math.round(saturation * 100),
                value: Math.round(value * 100)
            },
            format: 'hsv'
        };
    }
    catch (error) {
        console.error(`rgbToHSV() error: ${error}`);
        return defaults.defaultHSV();
    }
}
function xyzToHSV(xyz) {
    try {
        return conversionHelpers.xyzToHSVHelper(xyz);
    }
    catch (error) {
        console.error(`xyzToHSV() error: ${error}`);
        return defaults.defaultHSV();
    }
}
export const toHSV = {
    cmykToHSV,
    hexToHSV,
    hslToHSV,
    labToHSV,
    rgbToHSV,
    xyzToHSV
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9IU1YuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29sb3ItY29udmVyc2lvbi90b0hTVi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDN0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFHMUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRTdDLFNBQVMsU0FBUyxDQUFDLElBQWdCO0lBQ2xDLElBQUksQ0FBQztRQUNKLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUM3QyxPQUFPLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUM5QixDQUFDO0FBQ0YsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEdBQWM7SUFDL0IsSUFBSSxDQUFDO1FBQ0osTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQyxPQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUM1QyxPQUFPLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUM5QixDQUFDO0FBQ0YsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEdBQWM7SUFDL0IsSUFBSSxDQUFDO1FBQ0osTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FB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aUJBQWlCLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMscUJBQXFCLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDNUMsT0FBTyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDOUIsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQW9CO0lBQ3JDLFNBQVM7SUFDVCxRQUFRO0lBQ1IsUUFBUTtJQUNSLFFBQVE7SUFDUixRQUFRO0lBQ1IsUUFBUTtDQUNSLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb252ZXJ0IH0gZnJvbSAnLi9jb252ZXJzaW9uLWluZGV4JztcbmltcG9ydCB7IGNvbnZlcnNpb25IZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycy9jb252ZXJzaW9uJztcbmltcG9ydCAqIGFzIGZuT2JqZWN0cyBmcm9tICcuLi9pbmRleC9mbi1vYmplY3RzJztcbmltcG9ydCAqIGFzIHR5cGVzIGZyb20gJy4uL2luZGV4L3R5cGVzJztcbmltcG9ydCB7IGRlZmF1bHRzIH0gZnJvbSAnLi4vdXRpbHMvZGVmYXVsdHMnO1xuXG5mdW5jdGlvbiBjbXlrVG9IU1YoY215azogdHlwZXMuQ01ZSyk6IHR5cGVzLkhTViB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcmdiID0gY29udmVydC5jbXlrVG9SR0IoY215ayk7XG5cdFx0cmV0dXJuIHJnYlRvSFNWKHJnYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgY215a1RvSFNWKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cdFx0cmV0dXJuIGRlZmF1bHRzLmRlZmF1bHRIU1YoKTtcblx0fVxufVxuXG5mdW5jdGlvbiBoZXhUb0hTVihoZXg6IHR5cGVzLkhleCk6IHR5cGVzLkhTViB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcmdiID0gY29udmVydC5oZXhUb1JHQihoZXgpO1xuXHRcdHJldHVybiBjb252ZXJ0LnJnYlRvSFNWKHJnYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgaGV4VG9IU1YoKSBlcnJvcjogJHtlcnJvcn1gKTtcblx0XHRyZXR1cm4gZGVmYXVsdHMuZGVmYXVsdEhTVigpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhzbFRvSFNWKGhzbDogdHlwZXMuSFNMKTogdHlwZXMuSFNWIHtcblx0dHJ5IHtcblx0XHRjb25zdCBzID0gaHNsLnZhbHVlLnNhdHVyYXRpb24gLyAxMDA7XG5cdFx0Y29uc3QgbCA9IGhzbC52YWx1ZS5saWdodG5lc3MgLyAxMDA7XG5cblx0XHRjb25zdCB2YWx1ZSA9IGwgKyBzICogTWF0aC5taW4obCwgMSAtIDEpO1xuXHRcdGNvbnN0IG5ld1NhdHVyYXRpb24gPSB2YWx1ZSA9PT0gMCA/IDAgOiAyICogKDEgLSBsIC8gdmFsdWUpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdGh1ZTogTWF0aC5yb3VuZChoc2wudmFsdWUuaHVlKSxcblx0XHRcdFx0c2F0dXJhdGlvbjogTWF0aC5yb3VuZChuZXdTYXR1cmF0aW9uICogMTAwKSxcblx0XHRcdFx0dmFsdWU6IE1hdGgucm91bmQodmFsdWUgKiAxMDApXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAnaHN2J1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgaHNsVG9IU1YoKSBlcnJvcjogJHtlcnJvcn1gKTtcblx0XHRyZXR1cm4gZGVmYXVsdHMuZGVmYXVsdEhTVigpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGxhYlRvSFNWKGxhYjogdHlwZXMuTEFCKTogdHlwZXMuSFNWIHtcblx0dHJ5IHtcblx0XHRjb25zdCByZ2IgPSBjb252ZXJ0LmxhYlRvUkdCKGxhYik7XG5cdFx0cmV0dXJuIHJnYlRvSFNWKHJnYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgbGFiVG9IU1YoKSBlcnJvcjogJHtlcnJvcn1gKTtcblx0XHRyZXR1cm4gZGVmYXVsdHMuZGVmYXVsdEhTVigpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJnYlRvSFNWKHJnYjogdHlwZXMuUkdCKTogdHlwZXMuSFNWIHtcblx0dHJ5IHtcblx0XHRyZ2IudmFsdWUucmVkIC89IDI1NTtcblx0XHRyZ2IudmFsdWUuZ3JlZW4gLz0gMjU1O1xuXHRcdHJnYi52YWx1ZS5ibHVlIC89IDI1NTtcblxuXHRcdGNvbnN0IG1heCA9IE1hdGgubWF4KHJnYi52YWx1ZS5yZWQsIHJnYi52YWx1ZS5ncmVlbiwgcmdiLnZhbHVlLmJsdWUpO1xuXHRcdGNvbnN0IG1pbiA9IE1hdGgubWluKHJnYi52YWx1ZS5yZWQsIHJnYi52YWx1ZS5ncmVlbiwgcmdiLnZhbHVlLmJsdWUpO1xuXHRcdGNvbnN0IGRlbHRhID0gbWF4IC0gbWluO1xuXG5cdFx0bGV0IGh1ZSA9IDA7XG5cdFx0Y29uc3QgdmFsdWUgPSBtYXg7XG5cdFx0Y29uc3Qgc2F0dXJhdGlvbiA9IG1heCA9PT0gMCA/IDAgOiBkZWx0YSAvIG1heDtcblxuXHRcdGlmIChtYXggIT09IG1pbikge1xuXHRcdFx0c3dpdGNoIChtYXgpIHtcblx0XHRcdFx0Y2FzZSByZ2IudmFsdWUucmVkOlxuXHRcdFx0XHRcdGh1ZSA9XG5cdFx0XHRcdFx0XHQocmdiLnZhbHVlLmdyZWVuIC0gcmdiLnZhbHVlLmJsdWUpIC8gZGVsdGEgK1xuXHRcdFx0XHRcdFx0KHJnYi52YWx1ZS5ncmVlbiA8IHJnYi52YWx1ZS5ibHVlID8gNiA6IDApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIHJnYi52YWx1ZS5ncmVlbjpcblx0XHRcdFx0XHRodWUgPSAocmdiLnZhbHVlLmJsdWUgLSByZ2IudmFsdWUucmVkKSAvIGRlbHRhICsgMjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSByZ2IudmFsdWUuYmx1ZTpcblx0XHRcdFx0XHRodWUgPSAocmdiLnZhbHVlLnJlZCAtIHJnYi52YWx1ZS5ncmVlbikgLyBkZWx0YSArIDQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGh1ZSAqPSA2MDtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0aHVlOiBNYXRoLnJvdW5kKGh1ZSksXG5cdFx0XHRcdHNhdHVyYXRpb246IE1hdGgucm91bmQoc2F0dXJhdGlvbiAqIDEwMCksXG5cdFx0XHRcdHZhbHVlOiBNYXRoLnJvdW5kKHZhbHVlICogMTAwKVxuXHRcdFx0fSxcblx0XHRcdGZvcm1hdDogJ2hzdidcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYHJnYlRvSFNWKCkgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cdFx0cmV0dXJuIGRlZmF1bHRzLmRlZmF1bHRIU1YoKTtcblx0fVxufVxuXG5mdW5jdGlvbiB4eXpUb0hTVih4eXo6IHR5cGVzLlhZWik6IHR5cGVzLkhTViB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGNvbnZlcnNpb25IZWxwZXJzLnh5elRvSFNWSGVscGVyKHh5eik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgeHl6VG9IU1YoKSBlcnJvcjogJHtlcnJvcn1gKTtcblx0XHRyZXR1cm4gZGVmYXVsdHMuZGVmYXVsdEhTVigpO1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCB0b0hTVjogZm5PYmplY3RzLlRvSFNWID0ge1xuXHRjbXlrVG9IU1YsXG5cdGhleFRvSFNWLFxuXHRoc2xUb0hTVixcblx0bGFiVG9IU1YsXG5cdHJnYlRvSFNWLFxuXHR4eXpUb0hTVlxufTtcbiJdfQ==