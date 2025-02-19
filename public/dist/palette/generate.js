// File: palette/generate.js
import { data } from '../config/index.js';
const defaultPalette = data.defaults.palette;
export function generatePalette(options, common, generateHuesFns, generatePaletteFns) {
    const { log, errors } = common.services;
    try {
        log(`Generating ${options.paletteType} palette with args ${JSON.stringify(options)}`, 'debug');
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
            case 'split-complementary':
                return generatePaletteFns.splitComplementary(options, common);
            case 'tetradic':
                return generatePaletteFns.tetradic(options, common, generateHuesFns);
            case 'triadic':
                return generatePaletteFns.triadic(options, common, generateHuesFns);
            default:
                log(`Invalid palette type ${options.paletteType}`, 'error');
                return defaultPalette;
        }
    }
    catch (error) {
        errors.handle(error, 'Error occurred during palette generation');
        return defaultPalette;
    }
}
export function generateHues(color, options, common, generateHues) {
    const { log, errors } = common.services;
    const { utils } = common;
    try {
        if (!utils.validate.colorValue(color)) {
            log(`Invalid color value ${JSON.stringify(color)}`, 'error');
            return [];
        }
        const clonedColor = utils.core.clone(color);
        switch (options.paletteType) {
            case 'analogous':
                return generateHues.analogous(clonedColor, options, common);
            case 'diadic':
                return generateHues.diadic(clonedColor, options, common);
            case 'hexadic':
                return generateHues.hexadic(clonedColor, common);
            case 'split-complementary':
                return generateHues.splitComplementary(clonedColor, common);
            case 'tetradic':
                return generateHues.tetradic(clonedColor, common);
            case 'triadic':
                return generateHues.triadic(clonedColor, common);
            default:
                log(`Invalid hue type ${options.paletteType}`, 'error');
                return [];
        }
    }
    catch (error) {
        errors.handle(error, 'Error generating hues');
        return [];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFsZXR0ZS9nZW5lcmF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0QkFBNEI7QUFVNUIsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRTFDLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0FBRTdDLE1BQU0sVUFBVSxlQUFlLENBQzlCLE9BQStCLEVBQy9CLE1BQXVCLEVBQ3ZCLGVBQW9DLEVBQ3BDLGtCQUEwQztJQUUxQyxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFFeEMsSUFBSSxDQUFDO1FBQ0osR0FBRyxDQUNGLGNBQWMsT0FBTyxDQUFDLFdBQVcsc0JBQXNCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFDaEYsT0FBTyxDQUNQLENBQUM7UUFFRixRQUFRLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUM3QixLQUFLLFdBQVc7Z0JBQ2YsT0FBTyxrQkFBa0IsQ0FBQyxTQUFTLENBQ2xDLE9BQU8sRUFDUCxNQUFNLEVBQ04sZUFBZSxDQUNmLENBQUM7WUFDSCxLQUFLLGVBQWU7Z0JBQ25CLE9BQU8sa0JBQWtCLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMxRCxLQUFLLFFBQVE7Z0JBQ1osT0FBTyxrQkFBa0IsQ0FBQyxNQUFNLENBQy9CLE9BQU8sRUFDUCxNQUFNLEVBQ04sZUFBZSxDQUNmLENBQUM7WUFDSCxLQUFLLFNBQVM7Z0JBQ2IsT0FBTyxrQkFBa0IsQ0FBQyxPQUFPLENBQ2hDLE9BQU8sRUFDUCxNQUFNLEVBQ04sZUFBZSxDQUNmLENBQUM7WUFDSCxLQUFLLGVBQWU7Z0JBQ25CLE9BQU8sa0JBQWtCLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMxRCxLQUFLLFFBQVE7Z0JBQ1osT0FBTyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ25ELEtBQUsscUJBQXFCO2dCQUN6QixPQUFPLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMvRCxLQUFLLFVBQVU7Z0JBQ2QsT0FBTyxrQkFBa0IsQ0FBQyxRQUFRLENBQ2pDLE9BQU8sRUFDUCxNQUFNLEVBQ04sZUFBZSxDQUNmLENBQUM7WUFDSCxLQUFLLFNBQVM7Z0JBQ2IsT0FBTyxrQkFBa0IsQ0FBQyxPQUFPLENBQ2hDLE9BQU8sRUFDUCxNQUFNLEVBQ04sZUFBZSxDQUNmLENBQUM7WUFDSDtnQkFDQyxHQUFHLENBQUMsd0JBQXdCLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDNUQsT0FBTyxjQUFjLENBQUM7UUFDeEIsQ0FBQztJQUNGLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLDBDQUEwQyxDQUFDLENBQUM7UUFDakUsT0FBTyxjQUFjLENBQUM7SUFDdkIsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLFVBQVUsWUFBWSxDQUMzQixLQUFVLEVBQ1YsT0FBK0IsRUFDL0IsTUFBdUIsRUFDdkIsWUFBaUM7SUFFakMsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ3hDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLENBQUM7SUFFekIsSUFBSSxDQUFDO1FBQ0osSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdkMsR0FBRyxDQUFDLHVCQUF1QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDN0QsT0FBTyxFQUFFLENBQUM7UUFDWCxDQUFDO1FBRUQsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFRLENBQUM7UUFFbkQsUUFBUSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDN0IsS0FBSyxXQUFXO2dCQUNmLE9BQU8sWUFBWSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzdELEtBQUssUUFBUTtnQkFDWixPQUFPLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMxRCxLQUFLLFNBQVM7Z0JBQ2IsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNsRCxLQUFLLHFCQUFxQjtnQkFDekIsT0FBTyxZQUFZLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzdELEtBQUssVUFBVTtnQkFDZCxPQUFPLFlBQVksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ25ELEtBQUssU0FBUztnQkFDYixPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2xEO2dCQUNDLEdBQUcsQ0FBQyxvQkFBb0IsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN4RCxPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7SUFDRixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNoQixNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBQzlDLE9BQU8sRUFBRSxDQUFDO0lBQ1gsQ0FBQztBQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaWxlOiBwYWxldHRlL2dlbmVyYXRlLmpzXG5cbmltcG9ydCB7XG5cdENvbW1vbkZ1bmN0aW9ucyxcblx0R2VuZXJhdGVIdWVzRm5Hcm91cCxcblx0R2VuZXJhdGVQYWxldHRlRm5Hcm91cCxcblx0SFNMLFxuXHRQYWxldHRlLFxuXHRTZWxlY3RlZFBhbGV0dGVPcHRpb25zXG59IGZyb20gJy4uL3R5cGVzL2luZGV4LmpzJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9jb25maWcvaW5kZXguanMnO1xuXG5jb25zdCBkZWZhdWx0UGFsZXR0ZSA9IGRhdGEuZGVmYXVsdHMucGFsZXR0ZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlUGFsZXR0ZShcblx0b3B0aW9uczogU2VsZWN0ZWRQYWxldHRlT3B0aW9ucyxcblx0Y29tbW9uOiBDb21tb25GdW5jdGlvbnMsXG5cdGdlbmVyYXRlSHVlc0ZuczogR2VuZXJhdGVIdWVzRm5Hcm91cCxcblx0Z2VuZXJhdGVQYWxldHRlRm5zOiBHZW5lcmF0ZVBhbGV0dGVGbkdyb3VwXG4pOiBQYWxldHRlIHtcblx0Y29uc3QgeyBsb2csIGVycm9ycyB9ID0gY29tbW9uLnNlcnZpY2VzO1xuXG5cdHRyeSB7XG5cdFx0bG9nKFxuXHRcdFx0YEdlbmVyYXRpbmcgJHtvcHRpb25zLnBhbGV0dGVUeXBlfSBwYWxldHRlIHdpdGggYXJncyAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMpfWAsXG5cdFx0XHQnZGVidWcnXG5cdFx0KTtcblxuXHRcdHN3aXRjaCAob3B0aW9ucy5wYWxldHRlVHlwZSkge1xuXHRcdFx0Y2FzZSAnYW5hbG9nb3VzJzpcblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlUGFsZXR0ZUZucy5hbmFsb2dvdXMoXG5cdFx0XHRcdFx0b3B0aW9ucyxcblx0XHRcdFx0XHRjb21tb24sXG5cdFx0XHRcdFx0Z2VuZXJhdGVIdWVzRm5zXG5cdFx0XHRcdCk7XG5cdFx0XHRjYXNlICdjb21wbGVtZW50YXJ5Jzpcblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlUGFsZXR0ZUZucy5jb21wbGVtZW50YXJ5KG9wdGlvbnMsIGNvbW1vbik7XG5cdFx0XHRjYXNlICdkaWFkaWMnOlxuXHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVQYWxldHRlRm5zLmRpYWRpYyhcblx0XHRcdFx0XHRvcHRpb25zLFxuXHRcdFx0XHRcdGNvbW1vbixcblx0XHRcdFx0XHRnZW5lcmF0ZUh1ZXNGbnNcblx0XHRcdFx0KTtcblx0XHRcdGNhc2UgJ2hleGFkaWMnOlxuXHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVQYWxldHRlRm5zLmhleGFkaWMoXG5cdFx0XHRcdFx0b3B0aW9ucyxcblx0XHRcdFx0XHRjb21tb24sXG5cdFx0XHRcdFx0Z2VuZXJhdGVIdWVzRm5zXG5cdFx0XHRcdCk7XG5cdFx0XHRjYXNlICdtb25vY2hyb21hdGljJzpcblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlUGFsZXR0ZUZucy5tb25vY2hyb21hdGljKG9wdGlvbnMsIGNvbW1vbik7XG5cdFx0XHRjYXNlICdyYW5kb20nOlxuXHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVQYWxldHRlRm5zLnJhbmRvbShvcHRpb25zLCBjb21tb24pO1xuXHRcdFx0Y2FzZSAnc3BsaXQtY29tcGxlbWVudGFyeSc6XG5cdFx0XHRcdHJldHVybiBnZW5lcmF0ZVBhbGV0dGVGbnMuc3BsaXRDb21wbGVtZW50YXJ5KG9wdGlvbnMsIGNvbW1vbik7XG5cdFx0XHRjYXNlICd0ZXRyYWRpYyc6XG5cdFx0XHRcdHJldHVybiBnZW5lcmF0ZVBhbGV0dGVGbnMudGV0cmFkaWMoXG5cdFx0XHRcdFx0b3B0aW9ucyxcblx0XHRcdFx0XHRjb21tb24sXG5cdFx0XHRcdFx0Z2VuZXJhdGVIdWVzRm5zXG5cdFx0XHRcdCk7XG5cdFx0XHRjYXNlICd0cmlhZGljJzpcblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlUGFsZXR0ZUZucy50cmlhZGljKFxuXHRcdFx0XHRcdG9wdGlvbnMsXG5cdFx0XHRcdFx0Y29tbW9uLFxuXHRcdFx0XHRcdGdlbmVyYXRlSHVlc0Zuc1xuXHRcdFx0XHQpO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0bG9nKGBJbnZhbGlkIHBhbGV0dGUgdHlwZSAke29wdGlvbnMucGFsZXR0ZVR5cGV9YCwgJ2Vycm9yJyk7XG5cdFx0XHRcdHJldHVybiBkZWZhdWx0UGFsZXR0ZTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0ZXJyb3JzLmhhbmRsZShlcnJvciwgJ0Vycm9yIG9jY3VycmVkIGR1cmluZyBwYWxldHRlIGdlbmVyYXRpb24nKTtcblx0XHRyZXR1cm4gZGVmYXVsdFBhbGV0dGU7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlSHVlcyhcblx0Y29sb3I6IEhTTCxcblx0b3B0aW9uczogU2VsZWN0ZWRQYWxldHRlT3B0aW9ucyxcblx0Y29tbW9uOiBDb21tb25GdW5jdGlvbnMsXG5cdGdlbmVyYXRlSHVlczogR2VuZXJhdGVIdWVzRm5Hcm91cFxuKTogbnVtYmVyW10ge1xuXHRjb25zdCB7IGxvZywgZXJyb3JzIH0gPSBjb21tb24uc2VydmljZXM7XG5cdGNvbnN0IHsgdXRpbHMgfSA9IGNvbW1vbjtcblxuXHR0cnkge1xuXHRcdGlmICghdXRpbHMudmFsaWRhdGUuY29sb3JWYWx1ZShjb2xvcikpIHtcblx0XHRcdGxvZyhgSW52YWxpZCBjb2xvciB2YWx1ZSAke0pTT04uc3RyaW5naWZ5KGNvbG9yKX1gLCAnZXJyb3InKTtcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRDb2xvciA9IHV0aWxzLmNvcmUuY2xvbmUoY29sb3IpIGFzIEhTTDtcblxuXHRcdHN3aXRjaCAob3B0aW9ucy5wYWxldHRlVHlwZSkge1xuXHRcdFx0Y2FzZSAnYW5hbG9nb3VzJzpcblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlSHVlcy5hbmFsb2dvdXMoY2xvbmVkQ29sb3IsIG9wdGlvbnMsIGNvbW1vbik7XG5cdFx0XHRjYXNlICdkaWFkaWMnOlxuXHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVIdWVzLmRpYWRpYyhjbG9uZWRDb2xvciwgb3B0aW9ucywgY29tbW9uKTtcblx0XHRcdGNhc2UgJ2hleGFkaWMnOlxuXHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVIdWVzLmhleGFkaWMoY2xvbmVkQ29sb3IsIGNvbW1vbik7XG5cdFx0XHRjYXNlICdzcGxpdC1jb21wbGVtZW50YXJ5Jzpcblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlSHVlcy5zcGxpdENvbXBsZW1lbnRhcnkoY2xvbmVkQ29sb3IsIGNvbW1vbik7XG5cdFx0XHRjYXNlICd0ZXRyYWRpYyc6XG5cdFx0XHRcdHJldHVybiBnZW5lcmF0ZUh1ZXMudGV0cmFkaWMoY2xvbmVkQ29sb3IsIGNvbW1vbik7XG5cdFx0XHRjYXNlICd0cmlhZGljJzpcblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlSHVlcy50cmlhZGljKGNsb25lZENvbG9yLCBjb21tb24pO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0bG9nKGBJbnZhbGlkIGh1ZSB0eXBlICR7b3B0aW9ucy5wYWxldHRlVHlwZX1gLCAnZXJyb3InKTtcblx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRlcnJvcnMuaGFuZGxlKGVycm9yLCAnRXJyb3IgZ2VuZXJhdGluZyBodWVzJyk7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG59XG4iXX0=