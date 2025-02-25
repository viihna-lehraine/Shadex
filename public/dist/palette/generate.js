// File: dom/palette/generate.js
import { defaults } from '../config/index.js';
const defaultPalette = defaults.palette;
export function generatePalette(options, common, generateHuesFns, generatePaletteFns) {
    const { log, errors } = common.services;
    return errors.handleSync(() => {
        log.debug(`Generating ${options.paletteType} palette with args ${JSON.stringify(options)}`, `[generatePalette]`);
        switch (options.paletteType) {
            case 'analogous':
                return generatePaletteFns.analogous(options, common, generateHuesFns);
            case 'complementary':
                return generatePaletteFns.complementary(options, common);
            case 'diadic':
                return generatePaletteFns.diadic(options, common, generateHuesFns);
            case 'hexadic':
                return generatePaletteFns.hexadic(options, common, generateHuesFns);
            case 'monochromatic':
                return generatePaletteFns.monochromatic(options, common);
            case 'random':
                return generatePaletteFns.random(options, common);
            case 'splitComplementary':
                return generatePaletteFns.splitComplementary(options, common);
            case 'tetradic':
                return generatePaletteFns.tetradic(options, common, generateHuesFns);
            case 'triadic':
                return generatePaletteFns.triadic(options, common, generateHuesFns);
            default:
                log.error(`Invalid palette type ${options.paletteType}`, `[generatePalette]`);
                return defaultPalette;
        }
    }, 'Error generating palette', { context: { options } });
}
export function generateHues(color, options, common, generateHues) {
    const { helpers, services: { log, errors }, utils } = common;
    return errors.handleSync(() => {
        if (!utils.validate.colorValue(color)) {
            log.error(`Invalid color value ${JSON.stringify(color)}`, `[generateHues]`);
            return [];
        }
        const clonedColor = helpers.data.clone(color);
        switch (options.paletteType) {
            case 'analogous':
                return generateHues.analogous(clonedColor, options, common);
            case 'diadic':
                return generateHues.diadic(clonedColor, options, common);
            case 'hexadic':
                return generateHues.hexadic(clonedColor, common);
            case 'splitComplementary':
                return generateHues.splitComplementary(clonedColor, common);
            case 'tetradic':
                return generateHues.tetradic(clonedColor, common);
            case 'triadic':
                return generateHues.triadic(clonedColor, common);
            default:
                log.error(`Invalid hue type ${options.paletteType}`, `[generateHues]`);
                return [];
        }
    }, 'Error generating hues', { context: { color, options } });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFsZXR0ZS9nZW5lcmF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxnQ0FBZ0M7QUFVaEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRTlDLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7QUFFeEMsTUFBTSxVQUFVLGVBQWUsQ0FDOUIsT0FBK0IsRUFDL0IsTUFBdUIsRUFDdkIsZUFBb0MsRUFDcEMsa0JBQTBDO0lBRTFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUV4QyxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQ3ZCLEdBQUcsRUFBRTtRQUNKLEdBQUcsQ0FBQyxLQUFLLENBQ1IsY0FBYyxPQUFPLENBQUMsV0FBVyxzQkFBc0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUNoRixtQkFBbUIsQ0FDbkIsQ0FBQztRQUVGLFFBQVEsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzdCLEtBQUssV0FBVztnQkFDZixPQUFPLGtCQUFrQixDQUFDLFNBQVMsQ0FDbEMsT0FBTyxFQUNQLE1BQU0sRUFDTixlQUFlLENBQ2YsQ0FBQztZQUNILEtBQUssZUFBZTtnQkFDbkIsT0FBTyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzFELEtBQUssUUFBUTtnQkFDWixPQUFPLGtCQUFrQixDQUFDLE1BQU0sQ0FDL0IsT0FBTyxFQUNQLE1BQU0sRUFDTixlQUFlLENBQ2YsQ0FBQztZQUNILEtBQUssU0FBUztnQkFDYixPQUFPLGtCQUFrQixDQUFDLE9BQU8sQ0FDaEMsT0FBTyxFQUNQLE1BQU0sRUFDTixlQUFlLENBQ2YsQ0FBQztZQUNILEtBQUssZUFBZTtnQkFDbkIsT0FBTyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzFELEtBQUssUUFBUTtnQkFDWixPQUFPLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbkQsS0FBSyxvQkFBb0I7Z0JBQ3hCLE9BQU8sa0JBQWtCLENBQUMsa0JBQWtCLENBQzNDLE9BQU8sRUFDUCxNQUFNLENBQ04sQ0FBQztZQUNILEtBQUssVUFBVTtnQkFDZCxPQUFPLGtCQUFrQixDQUFDLFFBQVEsQ0FDakMsT0FBTyxFQUNQLE1BQU0sRUFDTixlQUFlLENBQ2YsQ0FBQztZQUNILEtBQUssU0FBUztnQkFDYixPQUFPLGtCQUFrQixDQUFDLE9BQU8sQ0FDaEMsT0FBTyxFQUNQLE1BQU0sRUFDTixlQUFlLENBQ2YsQ0FBQztZQUNIO2dCQUNDLEdBQUcsQ0FBQyxLQUFLLENBQ1Isd0JBQXdCLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFDN0MsbUJBQW1CLENBQ25CLENBQUM7Z0JBQ0YsT0FBTyxjQUFjLENBQUM7UUFDeEIsQ0FBQztJQUNGLENBQUMsRUFDRCwwQkFBMEIsRUFDMUIsRUFBRSxPQUFPLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUN4QixDQUFDO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSxZQUFZLENBQzNCLEtBQVUsRUFDVixPQUErQixFQUMvQixNQUF1QixFQUN2QixZQUFpQztJQUVqQyxNQUFNLEVBQ0wsT0FBTyxFQUNQLFFBQVEsRUFBRSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsRUFDekIsS0FBSyxFQUNMLEdBQUcsTUFBTSxDQUFDO0lBRVgsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUN2QixHQUFHLEVBQUU7UUFDSixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUN2QyxHQUFHLENBQUMsS0FBSyxDQUNSLHVCQUF1QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQzlDLGdCQUFnQixDQUNoQixDQUFDO1lBQ0YsT0FBTyxFQUFFLENBQUM7UUFDWCxDQUFDO1FBRUQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFRLENBQUM7UUFFckQsUUFBUSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDN0IsS0FBSyxXQUFXO2dCQUNmLE9BQU8sWUFBWSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzdELEtBQUssUUFBUTtnQkFDWixPQUFPLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMxRCxLQUFLLFNBQVM7Z0JBQ2IsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNsRCxLQUFLLG9CQUFvQjtnQkFDeEIsT0FBTyxZQUFZLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzdELEtBQUssVUFBVTtnQkFDZCxPQUFPLFlBQVksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ25ELEtBQUssU0FBUztnQkFDYixPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2xEO2dCQUNDLEdBQUcsQ0FBQyxLQUFLLENBQ1Isb0JBQW9CLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFDekMsZ0JBQWdCLENBQ2hCLENBQUM7Z0JBQ0YsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO0lBQ0YsQ0FBQyxFQUNELHVCQUF1QixFQUN2QixFQUFFLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUMvQixDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEZpbGU6IGRvbS9wYWxldHRlL2dlbmVyYXRlLmpzXG5cbmltcG9ydCB7XG5cdENvbW1vbkZ1bmN0aW9ucyxcblx0R2VuZXJhdGVIdWVzRm5Hcm91cCxcblx0R2VuZXJhdGVQYWxldHRlRm5Hcm91cCxcblx0SFNMLFxuXHRQYWxldHRlLFxuXHRTZWxlY3RlZFBhbGV0dGVPcHRpb25zXG59IGZyb20gJy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGRlZmF1bHRzIH0gZnJvbSAnLi4vY29uZmlnL2luZGV4LmpzJztcblxuY29uc3QgZGVmYXVsdFBhbGV0dGUgPSBkZWZhdWx0cy5wYWxldHRlO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVQYWxldHRlKFxuXHRvcHRpb25zOiBTZWxlY3RlZFBhbGV0dGVPcHRpb25zLFxuXHRjb21tb246IENvbW1vbkZ1bmN0aW9ucyxcblx0Z2VuZXJhdGVIdWVzRm5zOiBHZW5lcmF0ZUh1ZXNGbkdyb3VwLFxuXHRnZW5lcmF0ZVBhbGV0dGVGbnM6IEdlbmVyYXRlUGFsZXR0ZUZuR3JvdXBcbik6IFBhbGV0dGUge1xuXHRjb25zdCB7IGxvZywgZXJyb3JzIH0gPSBjb21tb24uc2VydmljZXM7XG5cblx0cmV0dXJuIGVycm9ycy5oYW5kbGVTeW5jKFxuXHRcdCgpID0+IHtcblx0XHRcdGxvZy5kZWJ1Zyhcblx0XHRcdFx0YEdlbmVyYXRpbmcgJHtvcHRpb25zLnBhbGV0dGVUeXBlfSBwYWxldHRlIHdpdGggYXJncyAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMpfWAsXG5cdFx0XHRcdGBbZ2VuZXJhdGVQYWxldHRlXWBcblx0XHRcdCk7XG5cblx0XHRcdHN3aXRjaCAob3B0aW9ucy5wYWxldHRlVHlwZSkge1xuXHRcdFx0XHRjYXNlICdhbmFsb2dvdXMnOlxuXHRcdFx0XHRcdHJldHVybiBnZW5lcmF0ZVBhbGV0dGVGbnMuYW5hbG9nb3VzKFxuXHRcdFx0XHRcdFx0b3B0aW9ucyxcblx0XHRcdFx0XHRcdGNvbW1vbixcblx0XHRcdFx0XHRcdGdlbmVyYXRlSHVlc0Zuc1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdGNhc2UgJ2NvbXBsZW1lbnRhcnknOlxuXHRcdFx0XHRcdHJldHVybiBnZW5lcmF0ZVBhbGV0dGVGbnMuY29tcGxlbWVudGFyeShvcHRpb25zLCBjb21tb24pO1xuXHRcdFx0XHRjYXNlICdkaWFkaWMnOlxuXHRcdFx0XHRcdHJldHVybiBnZW5lcmF0ZVBhbGV0dGVGbnMuZGlhZGljKFxuXHRcdFx0XHRcdFx0b3B0aW9ucyxcblx0XHRcdFx0XHRcdGNvbW1vbixcblx0XHRcdFx0XHRcdGdlbmVyYXRlSHVlc0Zuc1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdGNhc2UgJ2hleGFkaWMnOlxuXHRcdFx0XHRcdHJldHVybiBnZW5lcmF0ZVBhbGV0dGVGbnMuaGV4YWRpYyhcblx0XHRcdFx0XHRcdG9wdGlvbnMsXG5cdFx0XHRcdFx0XHRjb21tb24sXG5cdFx0XHRcdFx0XHRnZW5lcmF0ZUh1ZXNGbnNcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRjYXNlICdtb25vY2hyb21hdGljJzpcblx0XHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVQYWxldHRlRm5zLm1vbm9jaHJvbWF0aWMob3B0aW9ucywgY29tbW9uKTtcblx0XHRcdFx0Y2FzZSAncmFuZG9tJzpcblx0XHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVQYWxldHRlRm5zLnJhbmRvbShvcHRpb25zLCBjb21tb24pO1xuXHRcdFx0XHRjYXNlICdzcGxpdENvbXBsZW1lbnRhcnknOlxuXHRcdFx0XHRcdHJldHVybiBnZW5lcmF0ZVBhbGV0dGVGbnMuc3BsaXRDb21wbGVtZW50YXJ5KFxuXHRcdFx0XHRcdFx0b3B0aW9ucyxcblx0XHRcdFx0XHRcdGNvbW1vblxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdGNhc2UgJ3RldHJhZGljJzpcblx0XHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVQYWxldHRlRm5zLnRldHJhZGljKFxuXHRcdFx0XHRcdFx0b3B0aW9ucyxcblx0XHRcdFx0XHRcdGNvbW1vbixcblx0XHRcdFx0XHRcdGdlbmVyYXRlSHVlc0Zuc1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdGNhc2UgJ3RyaWFkaWMnOlxuXHRcdFx0XHRcdHJldHVybiBnZW5lcmF0ZVBhbGV0dGVGbnMudHJpYWRpYyhcblx0XHRcdFx0XHRcdG9wdGlvbnMsXG5cdFx0XHRcdFx0XHRjb21tb24sXG5cdFx0XHRcdFx0XHRnZW5lcmF0ZUh1ZXNGbnNcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGxvZy5lcnJvcihcblx0XHRcdFx0XHRcdGBJbnZhbGlkIHBhbGV0dGUgdHlwZSAke29wdGlvbnMucGFsZXR0ZVR5cGV9YCxcblx0XHRcdFx0XHRcdGBbZ2VuZXJhdGVQYWxldHRlXWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHJldHVybiBkZWZhdWx0UGFsZXR0ZTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdCdFcnJvciBnZW5lcmF0aW5nIHBhbGV0dGUnLFxuXHRcdHsgY29udGV4dDogeyBvcHRpb25zIH0gfVxuXHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVIdWVzKFxuXHRjb2xvcjogSFNMLFxuXHRvcHRpb25zOiBTZWxlY3RlZFBhbGV0dGVPcHRpb25zLFxuXHRjb21tb246IENvbW1vbkZ1bmN0aW9ucyxcblx0Z2VuZXJhdGVIdWVzOiBHZW5lcmF0ZUh1ZXNGbkdyb3VwXG4pOiBudW1iZXJbXSB7XG5cdGNvbnN0IHtcblx0XHRoZWxwZXJzLFxuXHRcdHNlcnZpY2VzOiB7IGxvZywgZXJyb3JzIH0sXG5cdFx0dXRpbHNcblx0fSA9IGNvbW1vbjtcblxuXHRyZXR1cm4gZXJyb3JzLmhhbmRsZVN5bmMoXG5cdFx0KCkgPT4ge1xuXHRcdFx0aWYgKCF1dGlscy52YWxpZGF0ZS5jb2xvclZhbHVlKGNvbG9yKSkge1xuXHRcdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdFx0YEludmFsaWQgY29sb3IgdmFsdWUgJHtKU09OLnN0cmluZ2lmeShjb2xvcil9YCxcblx0XHRcdFx0XHRgW2dlbmVyYXRlSHVlc11gXG5cdFx0XHRcdCk7XG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY2xvbmVkQ29sb3IgPSBoZWxwZXJzLmRhdGEuY2xvbmUoY29sb3IpIGFzIEhTTDtcblxuXHRcdFx0c3dpdGNoIChvcHRpb25zLnBhbGV0dGVUeXBlKSB7XG5cdFx0XHRcdGNhc2UgJ2FuYWxvZ291cyc6XG5cdFx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlSHVlcy5hbmFsb2dvdXMoY2xvbmVkQ29sb3IsIG9wdGlvbnMsIGNvbW1vbik7XG5cdFx0XHRcdGNhc2UgJ2RpYWRpYyc6XG5cdFx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlSHVlcy5kaWFkaWMoY2xvbmVkQ29sb3IsIG9wdGlvbnMsIGNvbW1vbik7XG5cdFx0XHRcdGNhc2UgJ2hleGFkaWMnOlxuXHRcdFx0XHRcdHJldHVybiBnZW5lcmF0ZUh1ZXMuaGV4YWRpYyhjbG9uZWRDb2xvciwgY29tbW9uKTtcblx0XHRcdFx0Y2FzZSAnc3BsaXRDb21wbGVtZW50YXJ5Jzpcblx0XHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVIdWVzLnNwbGl0Q29tcGxlbWVudGFyeShjbG9uZWRDb2xvciwgY29tbW9uKTtcblx0XHRcdFx0Y2FzZSAndGV0cmFkaWMnOlxuXHRcdFx0XHRcdHJldHVybiBnZW5lcmF0ZUh1ZXMudGV0cmFkaWMoY2xvbmVkQ29sb3IsIGNvbW1vbik7XG5cdFx0XHRcdGNhc2UgJ3RyaWFkaWMnOlxuXHRcdFx0XHRcdHJldHVybiBnZW5lcmF0ZUh1ZXMudHJpYWRpYyhjbG9uZWRDb2xvciwgY29tbW9uKTtcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRsb2cuZXJyb3IoXG5cdFx0XHRcdFx0XHRgSW52YWxpZCBodWUgdHlwZSAke29wdGlvbnMucGFsZXR0ZVR5cGV9YCxcblx0XHRcdFx0XHRcdGBbZ2VuZXJhdGVIdWVzXWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdCdFcnJvciBnZW5lcmF0aW5nIGh1ZXMnLFxuXHRcdHsgY29udGV4dDogeyBjb2xvciwgb3B0aW9ucyB9IH1cblx0KTtcbn1cbiJdfQ==