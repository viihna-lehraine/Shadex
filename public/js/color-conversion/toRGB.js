import { conversionHelpers } from '../helpers/conversion.js';
import { defaults } from '../utils/defaults.js';
import { transforms } from '../utils/transforms.js';
export function cmykToRGB(cmyk) {
    try {
        const r = 255 * (1 - cmyk.value.cyan / 100) * (1 - cmyk.value.key / 100);
        const g = 255 * (1 - cmyk.value.magenta / 100) * (1 - cmyk.value.key / 100);
        const b = 255 * (1 - cmyk.value.yellow / 100) * (1 - cmyk.value.key / 100);
        const rgb = {
            value: { red: r, green: g, blue: b },
            format: 'rgb'
        };
        return conversionHelpers.clampRGB(rgb);
    }
    catch (error) {
        console.error(`cmykToRGB error: ${error}`);
        return defaults.defaultRGB();
    }
}
export function hexToRGB(hex) {
    try {
        const strippedHex = transforms.stripHashFromHex(hex).value.hex;
        const bigint = parseInt(strippedHex, 16);
        return {
            value: {
                red: (bigint >> 16) & 255,
                green: (bigint >> 8) & 255,
                blue: bigint & 255
            },
            format: 'rgb'
        };
    }
    catch (error) {
        console.error(`hexToRGB error: ${error}`);
        return defaults.defaultRGB();
    }
}
export function hslToRGB(hsl) {
    try {
        const s = hsl.value.saturation / 100;
        const l = hsl.value.lightness / 100;
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        return {
            value: {
                red: Math.round(conversionHelpers.hueToRGB(p, q, hsl.value.hue + 1 / 3) *
                    255),
                green: Math.round(conversionHelpers.hueToRGB(p, q, hsl.value.hue) * 255),
                blue: Math.round(conversionHelpers.hueToRGB(p, q, hsl.value.hue - 1 / 3) *
                    255)
            },
            format: 'rgb'
        };
    }
    catch (error) {
        console.error(`hslToRGB error: ${error}`);
        return defaults.defaultRGB();
    }
}
export function hsvToRGB(hsv) {
    try {
        const s = hsv.value.saturation / 100;
        const v = hsv.value.value / 100;
        const i = Math.floor(hsv.value.hue / 60) % 6;
        const f = hsv.value.hue / 60 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        let rgb = {
            value: { red: 0, green: 0, blue: 0 },
            format: 'rgb'
        };
        switch (i) {
            case 0:
                rgb = { value: { red: v, green: t, blue: p }, format: 'rgb' };
                break;
            case 1:
                rgb = { value: { red: q, green: v, blue: p }, format: 'rgb' };
                break;
            case 2:
                rgb = { value: { red: p, green: v, blue: t }, format: 'rgb' };
                break;
            case 3:
                rgb = { value: { red: p, green: q, blue: v }, format: 'rgb' };
                break;
            case 4:
                rgb = { value: { red: t, green: p, blue: v }, format: 'rgb' };
                break;
            case 5:
                rgb = { value: { red: v, green: p, blue: q }, format: 'rgb' };
                break;
        }
        return conversionHelpers.clampRGB(rgb);
    }
    catch (error) {
        console.error(`hsvToRGB error: ${error}`);
        return defaults.defaultRGB();
    }
}
export function labToRGB(lab) {
    try {
        const xyz = conversionHelpers.labToXYZHelper(lab);
        return xyzToRGB(xyz);
    }
    catch (error) {
        console.error(`labToRGB error: ${error}`);
        return defaults.defaultRGB();
    }
}
export function xyzToRGB(xyz) {
    try {
        xyz.value.x /= 100;
        xyz.value.y /= 100;
        xyz.value.z /= 100;
        let red = xyz.value.x * 3.2406 +
            xyz.value.y * -1.5372 +
            xyz.value.z * -0.4986;
        let green = xyz.value.x * -0.9689 + xyz.value.y * 1.8758 + xyz.value.z * 0.0415;
        let blue = xyz.value.x * 0.0557 + xyz.value.y * -0.204 + xyz.value.z * 1.057;
        red = conversionHelpers.applyGammaCorrection(red);
        green = conversionHelpers.applyGammaCorrection(green);
        blue = conversionHelpers.applyGammaCorrection(blue);
        const rgb = { value: { red, green, blue }, format: 'rgb' };
        return conversionHelpers.clampRGB(rgb);
    }
    catch (error) {
        console.error(`xyzToRGB error: ${error}`);
        return defaults.defaultRGB();
    }
}
export const toRGB = {
    cmykToRGB,
    hexToRGB,
    hslToRGB,
    hsvToRGB,
    labToRGB,
    xyzToRGB
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9SR0IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29sb3ItY29udmVyc2lvbi90b1JHQi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUcxRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRWpELE1BQU0sVUFBVSxTQUFTLENBQUMsSUFBZ0I7SUFDekMsSUFBSSxDQUFDO1FBQ0osTUFBTSxDQUFDLEdBQ04sR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sQ0FBQyxHQUNOLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNuRSxNQUFNLENBQUMsR0FDTixHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFFbEUsTUFBTSxHQUFHLEdBQWM7WUFDdEIsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUU7WUFDcEMsTUFBTSxFQUFFLEtBQUs7U0FDYixDQUFDO1FBRUYsT0FBTyxpQkFB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aUJBQWlCLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEQsSUFBSSxHQUFHLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBELE1BQU0sR0FBRyxHQUFjLEVBQUUsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFFdEUsT0FBTyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUMxQyxPQUFPLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUM5QixDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBb0I7SUFDckMsU0FBUztJQUNULFFBQVE7SUFDUixRQUFRO0lBQ1IsUUFBUTtJQUNSLFFBQVE7SUFDUixRQUFRO0NBQ1IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvbnZlcnNpb25IZWxwZXJzIH0gZnJvbSAnLi4vaGVscGVycy9jb252ZXJzaW9uJztcbmltcG9ydCAqIGFzIGZuT2JqZWN0cyBmcm9tICcuLi9pbmRleC9mbi1vYmplY3RzJztcbmltcG9ydCAqIGFzIHR5cGVzIGZyb20gJy4uL2luZGV4L3R5cGVzJztcbmltcG9ydCB7IGRlZmF1bHRzIH0gZnJvbSAnLi4vdXRpbHMvZGVmYXVsdHMnO1xuaW1wb3J0IHsgdHJhbnNmb3JtcyB9IGZyb20gJy4uL3V0aWxzL3RyYW5zZm9ybXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY215a1RvUkdCKGNteWs6IHR5cGVzLkNNWUspOiB0eXBlcy5SR0Ige1xuXHR0cnkge1xuXHRcdGNvbnN0IHIgPVxuXHRcdFx0MjU1ICogKDEgLSBjbXlrLnZhbHVlLmN5YW4gLyAxMDApICogKDEgLSBjbXlrLnZhbHVlLmtleSAvIDEwMCk7XG5cdFx0Y29uc3QgZyA9XG5cdFx0XHQyNTUgKiAoMSAtIGNteWsudmFsdWUubWFnZW50YSAvIDEwMCkgKiAoMSAtIGNteWsudmFsdWUua2V5IC8gMTAwKTtcblx0XHRjb25zdCBiID1cblx0XHRcdDI1NSAqICgxIC0gY215ay52YWx1ZS55ZWxsb3cgLyAxMDApICogKDEgLSBjbXlrLnZhbHVlLmtleSAvIDEwMCk7XG5cblx0XHRjb25zdCByZ2I6IHR5cGVzLlJHQiA9IHtcblx0XHRcdHZhbHVlOiB7IHJlZDogciwgZ3JlZW46IGcsIGJsdWU6IGIgfSxcblx0XHRcdGZvcm1hdDogJ3JnYidcblx0XHR9O1xuXG5cdFx0cmV0dXJuIGNvbnZlcnNpb25IZWxwZXJzLmNsYW1wUkdCKHJnYik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgY215a1RvUkdCIGVycm9yOiAke2Vycm9yfWApO1xuXHRcdHJldHVybiBkZWZhdWx0cy5kZWZhdWx0UkdCKCk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhleFRvUkdCKGhleDogdHlwZXMuSGV4KTogdHlwZXMuUkdCIHtcblx0dHJ5IHtcblx0XHRjb25zdCBzdHJpcHBlZEhleCA9IHRyYW5zZm9ybXMuc3RyaXBIYXNoRnJvbUhleChoZXgpLnZhbHVlLmhleDtcblx0XHRjb25zdCBiaWdpbnQgPSBwYXJzZUludChzdHJpcHBlZEhleCwgMTYpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdHJlZDogKGJpZ2ludCA+PiAxNikgJiAyNTUsXG5cdFx0XHRcdGdyZWVuOiAoYmlnaW50ID4+IDgpICYgMjU1LFxuXHRcdFx0XHRibHVlOiBiaWdpbnQgJiAyNTVcblx0XHRcdH0sXG5cdFx0XHRmb3JtYXQ6ICdyZ2InXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBoZXhUb1JHQiBlcnJvcjogJHtlcnJvcn1gKTtcblx0XHRyZXR1cm4gZGVmYXVsdHMuZGVmYXVsdFJHQigpO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoc2xUb1JHQihoc2w6IHR5cGVzLkhTTCk6IHR5cGVzLlJHQiB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcyA9IGhzbC52YWx1ZS5zYXR1cmF0aW9uIC8gMTAwO1xuXHRcdGNvbnN0IGwgPSBoc2wudmFsdWUubGlnaHRuZXNzIC8gMTAwO1xuXG5cdFx0Y29uc3QgcSA9IGwgPCAwLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHM7XG5cdFx0Y29uc3QgcCA9IDIgKiBsIC0gcTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRyZWQ6IE1hdGgucm91bmQoXG5cdFx0XHRcdFx0Y29udmVyc2lvbkhlbHBlcnMuaHVlVG9SR0IocCwgcSwgaHNsLnZhbHVlLmh1ZSArIDEgLyAzKSAqXG5cdFx0XHRcdFx0XHQyNTVcblx0XHRcdFx0KSxcblx0XHRcdFx0Z3JlZW46IE1hdGgucm91bmQoXG5cdFx0XHRcdFx0Y29udmVyc2lvbkhlbHBlcnMuaHVlVG9SR0IocCwgcSwgaHNsLnZhbHVlLmh1ZSkgKiAyNTVcblx0XHRcdFx0KSxcblx0XHRcdFx0Ymx1ZTogTWF0aC5yb3VuZChcblx0XHRcdFx0XHRjb252ZXJzaW9uSGVscGVycy5odWVUb1JHQihwLCBxLCBoc2wudmFsdWUuaHVlIC0gMSAvIDMpICpcblx0XHRcdFx0XHRcdDI1NVxuXHRcdFx0XHQpXG5cdFx0XHR9LFxuXHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihgaHNsVG9SR0IgZXJyb3I6ICR7ZXJyb3J9YCk7XG5cdFx0cmV0dXJuIGRlZmF1bHRzLmRlZmF1bHRSR0IoKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaHN2VG9SR0IoaHN2OiB0eXBlcy5IU1YpOiB0eXBlcy5SR0Ige1xuXHR0cnkge1xuXHRcdGNvbnN0IHMgPSBoc3YudmFsdWUuc2F0dXJhdGlvbiAvIDEwMDtcblx0XHRjb25zdCB2ID0gaHN2LnZhbHVlLnZhbHVlIC8gMTAwO1xuXG5cdFx0Y29uc3QgaSA9IE1hdGguZmxvb3IoaHN2LnZhbHVlLmh1ZSAvIDYwKSAlIDY7XG5cdFx0Y29uc3QgZiA9IGhzdi52YWx1ZS5odWUgLyA2MCAtIGk7XG5cblx0XHRjb25zdCBwID0gdiAqICgxIC0gcyk7XG5cdFx0Y29uc3QgcSA9IHYgKiAoMSAtIGYgKiBzKTtcblx0XHRjb25zdCB0ID0gdiAqICgxIC0gKDEgLSBmKSAqIHMpO1xuXG5cdFx0bGV0IHJnYjogdHlwZXMuUkdCID0ge1xuXHRcdFx0dmFsdWU6IHsgcmVkOiAwLCBncmVlbjogMCwgYmx1ZTogMCB9LFxuXHRcdFx0Zm9ybWF0OiAncmdiJ1xuXHRcdH07XG5cblx0XHRzd2l0Y2ggKGkpIHtcblx0XHRcdGNhc2UgMDpcblx0XHRcdFx0cmdiID0geyB2YWx1ZTogeyByZWQ6IHYsIGdyZWVuOiB0LCBibHVlOiBwIH0sIGZvcm1hdDogJ3JnYicgfTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHJnYiA9IHsgdmFsdWU6IHsgcmVkOiBxLCBncmVlbjogdiwgYmx1ZTogcCB9LCBmb3JtYXQ6ICdyZ2InIH07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRyZ2IgPSB7IHZhbHVlOiB7IHJlZDogcCwgZ3JlZW46IHYsIGJsdWU6IHQgfSwgZm9ybWF0OiAncmdiJyB9O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzpcblx0XHRcdFx0cmdiID0geyB2YWx1ZTogeyByZWQ6IHAsIGdyZWVuOiBxLCBibHVlOiB2IH0sIGZvcm1hdDogJ3JnYicgfTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdHJnYiA9IHsgdmFsdWU6IHsgcmVkOiB0LCBncmVlbjogcCwgYmx1ZTogdiB9LCBmb3JtYXQ6ICdyZ2InIH07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA1OlxuXHRcdFx0XHRyZ2IgPSB7IHZhbHVlOiB7IHJlZDogdiwgZ3JlZW46IHAsIGJsdWU6IHEgfSwgZm9ybWF0OiAncmdiJyB9O1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXR1cm4gY29udmVyc2lvbkhlbHBlcnMuY2xhbXBSR0IocmdiKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBoc3ZUb1JHQiBlcnJvcjogJHtlcnJvcn1gKTtcblx0XHRyZXR1cm4gZGVmYXVsdHMuZGVmYXVsdFJHQigpO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYWJUb1JHQihsYWI6IHR5cGVzLkxBQik6IHR5cGVzLlJHQiB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgeHl6ID0gY29udmVyc2lvbkhlbHBlcnMubGFiVG9YWVpIZWxwZXIobGFiKTtcblx0XHRyZXR1cm4geHl6VG9SR0IoeHl6KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKGBsYWJUb1JHQiBlcnJvcjogJHtlcnJvcn1gKTtcblx0XHRyZXR1cm4gZGVmYXVsdHMuZGVmYXVsdFJHQigpO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB4eXpUb1JHQih4eXo6IHR5cGVzLlhZWik6IHR5cGVzLlJHQiB7XG5cdHRyeSB7XG5cdFx0eHl6LnZhbHVlLnggLz0gMTAwO1xuXHRcdHh5ei52YWx1ZS55IC89IDEwMDtcblx0XHR4eXoudmFsdWUueiAvPSAxMDA7XG5cblx0XHRsZXQgcmVkID1cblx0XHRcdHh5ei52YWx1ZS54ICogMy4yNDA2ICtcblx0XHRcdHh5ei52YWx1ZS55ICogLTEuNTM3MiArXG5cdFx0XHR4eXoudmFsdWUueiAqIC0wLjQ5ODY7XG5cdFx0bGV0IGdyZWVuID1cblx0XHRcdHh5ei52YWx1ZS54ICogLTAuOTY4OSArIHh5ei52YWx1ZS55ICogMS44NzU4ICsgeHl6LnZhbHVlLnogKiAwLjA0MTU7XG5cdFx0bGV0IGJsdWUgPVxuXHRcdFx0eHl6LnZhbHVlLnggKiAwLjA1NTcgKyB4eXoudmFsdWUueSAqIC0wLjIwNCArIHh5ei52YWx1ZS56ICogMS4wNTc7XG5cblx0XHRyZWQgPSBjb252ZXJzaW9uSGVscGVycy5hcHBseUdhbW1hQ29ycmVjdGlvbihyZWQpO1xuXHRcdGdyZWVuID0gY29udmVyc2lvbkhlbHBlcnMuYXBwbHlHYW1tYUNvcnJlY3Rpb24oZ3JlZW4pO1xuXHRcdGJsdWUgPSBjb252ZXJzaW9uSGVscGVycy5hcHBseUdhbW1hQ29ycmVjdGlvbihibHVlKTtcblxuXHRcdGNvbnN0IHJnYjogdHlwZXMuUkdCID0geyB2YWx1ZTogeyByZWQsIGdyZWVuLCBibHVlIH0sIGZvcm1hdDogJ3JnYicgfTtcblxuXHRcdHJldHVybiBjb252ZXJzaW9uSGVscGVycy5jbGFtcFJHQihyZ2IpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoYHh5elRvUkdCIGVycm9yOiAke2Vycm9yfWApO1xuXHRcdHJldHVybiBkZWZhdWx0cy5kZWZhdWx0UkdCKCk7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IHRvUkdCOiBmbk9iamVjdHMuVG9SR0IgPSB7XG5cdGNteWtUb1JHQixcblx0aGV4VG9SR0IsXG5cdGhzbFRvUkdCLFxuXHRoc3ZUb1JHQixcblx0bGFiVG9SR0IsXG5cdHh5elRvUkdCXG59O1xuIl19