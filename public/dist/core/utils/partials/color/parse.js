// File: core/utils/partials/color/parse.ts
export function colorParsingUtilitiesFactory(services) {
    const { errors } = services;
    function parseHexValueAsStringMap(hex) {
        return errors.handleSync(() => {
            return { hex: hex.hex };
        }, 'Error parsing hex value as raw hex.');
    }
    function parseHSLValueAsStringMap(hsl) {
        return errors.handleSync(() => {
            return {
                hue: `${hsl.hue}°`,
                saturation: `${hsl.saturation * 100}%`,
                lightness: `${hsl.lightness * 100}%`
            };
        }, 'Error parsing HSL value as string map.');
    }
    function parseHSVValueAsStringMap(hsv) {
        return errors.handleSync(() => {
            return {
                hue: `${hsv.hue}°`,
                saturation: `${hsv.saturation * 100}%`,
                value: `${hsv.value * 100}%`
            };
        }, 'Error parsing HSV value as string map.');
    }
    function parseLABValueAsStringMap(lab) {
        return errors.handleSync(() => {
            return {
                l: `${lab.l}`,
                a: `${lab.a}`,
                b: `${lab.b}`
            };
        }, 'Error parsing LAB value as string map.');
    }
    function parseRGBValueAsStringMap(rgb) {
        return errors.handleSync(() => {
            return {
                red: `${rgb.red}`,
                green: `${rgb.green}`,
                blue: `${rgb.blue}`
            };
        }, 'Error parsing RGB value as string map.');
    }
    function parseXYZValueAsStringMap(xyz) {
        return errors.handleSync(() => {
            return {
                x: `${xyz.x}`,
                y: `${xyz.y}`,
                z: `${xyz.z}`
            };
        }, 'Error parsing XYZ value as string map.');
    }
    const colorParsingUtilities = {
        parseHexValueAsStringMap,
        parseHSLValueAsStringMap,
        parseHSVValueAsStringMap,
        parseLABValueAsStringMap,
        parseRGBValueAsStringMap,
        parseXYZValueAsStringMap
    };
    return errors.handleSync(() => colorParsingUtilities, 'Error occurred while creating color parsing utilities group.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY29yZS91dGlscy9wYXJ0aWFscy9jb2xvci9wYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyQ0FBMkM7QUFtQjNDLE1BQU0sVUFBVSw0QkFBNEIsQ0FDM0MsUUFBa0I7SUFFbEIsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQztJQUU1QixTQUFTLHdCQUF3QixDQUNoQyxHQUFpQjtRQUVqQixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQzdCLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3pCLENBQUMsRUFBRSxxQ0FBcUMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxTQUFTLHdCQUF3QixDQUNoQyxHQUFpQjtRQUVqQixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQzdCLE9BQU87Z0JBQ04sR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRztnQkFDbEIsVUFBVSxFQUFFLEdBQUcsR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLEdBQUc7Z0JBQ3RDLFNBQVMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHO2FBQ3BDLENBQUM7UUFDSCxDQUFDLEVBQUUsd0NBQXdDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsU0FBUyx3QkFBd0IsQ0FDaEMsR0FBaUI7UUFFakIsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUM3QixPQUFPO2dCQUNOLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUc7Z0JBQ2xCLFVBQVUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHO2dCQUN0QyxLQUFLLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRzthQUM1QixDQUFDO1FBQ0gsQ0FBQyxFQUFFLHdDQUF3QyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUNELFNBQVMsd0JBQXdCLENBQ2hDLEdBQWlCO1FBRWpCLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDN0IsT0FBTztnQkFDTixDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNiLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2IsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRTthQUNiLENBQUM7UUFDSCxDQUFDLEVBQUUsd0NBQXdDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsU0FBUyx3QkFBd0IsQ0FDaEMsR0FBaUI7UUFFakIsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUM3QixPQUFPO2dCQUNOLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2pCLEtBQUssRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3JCLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUU7YUFDbkIsQ0FBQztRQUNILENBQUMsRUFBRSx3Q0FBd0MsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxTQUFTLHdCQUF3QixDQUNoQyxHQUFpQjtRQUVqQixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQzdCLE9BQU87Z0JBQ04sQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDYixDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNiLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUU7YUFDYixDQUFDO1FBQ0gsQ0FBQyxFQUFFLHdDQUF3QyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELE1BQU0scUJBQXFCLEdBQTBCO1FBQ3BELHdCQUF3QjtRQUN4Qix3QkFBd0I7UUFDeEIsd0JBQXdCO1FBQ3hCLHdCQUF3QjtRQUN4Qix3QkFBd0I7UUFDeEIsd0JBQXdCO0tBQ3hCLENBQUM7SUFFRixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQ3ZCLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixFQUMzQiw4REFBOEQsQ0FDOUQsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBjb3JlL3V0aWxzL3BhcnRpYWxzL2NvbG9yL3BhcnNlLnRzXG5cbmltcG9ydCB7XG5cdENvbG9yUGFyc2luZ1V0aWxpdGllcyxcblx0SGV4LFxuXHRIZXhTdHJpbmdNYXAsXG5cdEhTTCxcblx0SFNMU3RyaW5nTWFwLFxuXHRIU1YsXG5cdEhTVlN0cmluZ01hcCxcblx0TEFCLFxuXHRMQUJTdHJpbmdNYXAsXG5cdFJHQixcblx0UkdCU3RyaW5nTWFwLFxuXHRTZXJ2aWNlcyxcblx0WFlaLFxuXHRYWVpTdHJpbmdNYXBcbn0gZnJvbSAnLi4vLi4vLi4vLi4vdHlwZXMvaW5kZXguanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29sb3JQYXJzaW5nVXRpbGl0aWVzRmFjdG9yeShcblx0c2VydmljZXM6IFNlcnZpY2VzXG4pOiBDb2xvclBhcnNpbmdVdGlsaXRpZXMge1xuXHRjb25zdCB7IGVycm9ycyB9ID0gc2VydmljZXM7XG5cblx0ZnVuY3Rpb24gcGFyc2VIZXhWYWx1ZUFzU3RyaW5nTWFwKFxuXHRcdGhleDogSGV4Wyd2YWx1ZSddXG5cdCk6IEhleFN0cmluZ01hcFsndmFsdWUnXSB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdHJldHVybiB7IGhleDogaGV4LmhleCB9O1xuXHRcdH0sICdFcnJvciBwYXJzaW5nIGhleCB2YWx1ZSBhcyByYXcgaGV4LicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcGFyc2VIU0xWYWx1ZUFzU3RyaW5nTWFwKFxuXHRcdGhzbDogSFNMWyd2YWx1ZSddXG5cdCk6IEhTTFN0cmluZ01hcFsndmFsdWUnXSB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGh1ZTogYCR7aHNsLmh1ZX3CsGAsXG5cdFx0XHRcdHNhdHVyYXRpb246IGAke2hzbC5zYXR1cmF0aW9uICogMTAwfSVgLFxuXHRcdFx0XHRsaWdodG5lc3M6IGAke2hzbC5saWdodG5lc3MgKiAxMDB9JWBcblx0XHRcdH07XG5cdFx0fSwgJ0Vycm9yIHBhcnNpbmcgSFNMIHZhbHVlIGFzIHN0cmluZyBtYXAuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBwYXJzZUhTVlZhbHVlQXNTdHJpbmdNYXAoXG5cdFx0aHN2OiBIU1ZbJ3ZhbHVlJ11cblx0KTogSFNWU3RyaW5nTWFwWyd2YWx1ZSddIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aHVlOiBgJHtoc3YuaHVlfcKwYCxcblx0XHRcdFx0c2F0dXJhdGlvbjogYCR7aHN2LnNhdHVyYXRpb24gKiAxMDB9JWAsXG5cdFx0XHRcdHZhbHVlOiBgJHtoc3YudmFsdWUgKiAxMDB9JWBcblx0XHRcdH07XG5cdFx0fSwgJ0Vycm9yIHBhcnNpbmcgSFNWIHZhbHVlIGFzIHN0cmluZyBtYXAuJyk7XG5cdH1cblx0ZnVuY3Rpb24gcGFyc2VMQUJWYWx1ZUFzU3RyaW5nTWFwKFxuXHRcdGxhYjogTEFCWyd2YWx1ZSddXG5cdCk6IExBQlN0cmluZ01hcFsndmFsdWUnXSB7XG5cdFx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKCgpID0+IHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGw6IGAke2xhYi5sfWAsXG5cdFx0XHRcdGE6IGAke2xhYi5hfWAsXG5cdFx0XHRcdGI6IGAke2xhYi5ifWBcblx0XHRcdH07XG5cdFx0fSwgJ0Vycm9yIHBhcnNpbmcgTEFCIHZhbHVlIGFzIHN0cmluZyBtYXAuJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBwYXJzZVJHQlZhbHVlQXNTdHJpbmdNYXAoXG5cdFx0cmdiOiBSR0JbJ3ZhbHVlJ11cblx0KTogUkdCU3RyaW5nTWFwWyd2YWx1ZSddIHtcblx0XHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cmVkOiBgJHtyZ2IucmVkfWAsXG5cdFx0XHRcdGdyZWVuOiBgJHtyZ2IuZ3JlZW59YCxcblx0XHRcdFx0Ymx1ZTogYCR7cmdiLmJsdWV9YFxuXHRcdFx0fTtcblx0XHR9LCAnRXJyb3IgcGFyc2luZyBSR0IgdmFsdWUgYXMgc3RyaW5nIG1hcC4nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHBhcnNlWFlaVmFsdWVBc1N0cmluZ01hcChcblx0XHR4eXo6IFhZWlsndmFsdWUnXVxuXHQpOiBYWVpTdHJpbmdNYXBbJ3ZhbHVlJ10ge1xuXHRcdHJldHVybiBlcnJvcnMuaGFuZGxlU3luYygoKSA9PiB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR4OiBgJHt4eXoueH1gLFxuXHRcdFx0XHR5OiBgJHt4eXoueX1gLFxuXHRcdFx0XHR6OiBgJHt4eXouen1gXG5cdFx0XHR9O1xuXHRcdH0sICdFcnJvciBwYXJzaW5nIFhZWiB2YWx1ZSBhcyBzdHJpbmcgbWFwLicpO1xuXHR9XG5cblx0Y29uc3QgY29sb3JQYXJzaW5nVXRpbGl0aWVzOiBDb2xvclBhcnNpbmdVdGlsaXRpZXMgPSB7XG5cdFx0cGFyc2VIZXhWYWx1ZUFzU3RyaW5nTWFwLFxuXHRcdHBhcnNlSFNMVmFsdWVBc1N0cmluZ01hcCxcblx0XHRwYXJzZUhTVlZhbHVlQXNTdHJpbmdNYXAsXG5cdFx0cGFyc2VMQUJWYWx1ZUFzU3RyaW5nTWFwLFxuXHRcdHBhcnNlUkdCVmFsdWVBc1N0cmluZ01hcCxcblx0XHRwYXJzZVhZWlZhbHVlQXNTdHJpbmdNYXBcblx0fTtcblxuXHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoXG5cdFx0KCkgPT4gY29sb3JQYXJzaW5nVXRpbGl0aWVzLFxuXHRcdCdFcnJvciBvY2N1cnJlZCB3aGlsZSBjcmVhdGluZyBjb2xvciBwYXJzaW5nIHV0aWxpdGllcyBncm91cC4nXG5cdCk7XG59XG4iXX0=