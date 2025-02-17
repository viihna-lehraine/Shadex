// File: palette/generate.js
import { defaultData as defaults } from '../data/defaults.js';
const defaultPalette = defaults.palette;
export function generatePalette(options, common, generateHues, generatePalette) {
    const log = common.services.app.log;
    try {
        log('debug', `Generating ${options.paletteType} palette with args ${JSON.stringify(options)}`, 'generatePalette()', 2);
        switch (options.paletteType) {
            case 'analogous':
                return generatePalette.analogous(options, common, generateHues);
            case 'complementary':
                return generatePalette.complementary(options, common);
            case 'diadic':
                return generatePalette.diadic(options, common, generateHues);
            case 'hexadic':
                return generatePalette.hexadic(options, common, generateHues);
            case 'monochromatic':
                return generatePalette.monochromatic(options, common);
            case 'random':
                return generatePalette.random(options, common);
            case 'split-complementary':
                return generatePalette.splitComplementary(options, common);
            case 'tetradic':
                return generatePalette.tetradic(options, common, generateHues);
            case 'triadic':
                return generatePalette.triadic(options, common, generateHues);
            default:
                log('error', `Invalid palette type ${options.paletteType}`, 'generatePalette()');
                return defaultPalette;
        }
    }
    catch (error) {
        throw new Error(`Error occurred during palette generation: ${error}`);
    }
}
export function generateHues(color, options, common, generateHues) {
    const utils = common.utils;
    const log = common.services.app.log;
    try {
        if (!utils.validate.colorValue(color)) {
            log('error', `Invalid color value ${JSON.stringify(color)}`, 'generateHues()');
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
                log('error', `Invalid hue type ${options.paletteType}`, 'generateHues()');
                return [];
        }
    }
    catch (error) {
        log('error', `Error generating hues: ${error}`, 'generateHues()');
        return [];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGFsZXR0ZS9nZW5lcmF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0QkFBNEI7QUFVNUIsT0FBTyxFQUFFLFdBQVcsSUFBSSxRQUFRLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUU5RCxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO0FBRXhDLE1BQU0sVUFBVSxlQUFlLENBQzlCLE9BQStCLEVBQy9CLE1BQWdDLEVBQ2hDLFlBQWlDLEVBQ2pDLGVBQXVDO0lBRXZDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUVwQyxJQUFJLENBQUM7UUFDSixHQUFHLENBQ0YsT0FBTyxFQUNQLGNBQWMsT0FBTyxDQUFDLFdBQVcsc0JBQXNCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFDaEYsbUJBQW1CLEVBQ25CLENBQUMsQ0FDRCxDQUFDO1FBRUYsUUFBUSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDN0IsS0FBSyxXQUFXO2dCQUNmLE9BQU8sZUFBZSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ2pFLEtBQUssZUFBZTtnQkFDbkIsT0FBTyxlQUFlLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN2RCxLQUFLLFFBQVE7Z0JBQ1osT0FBTyxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDOUQsS0FBSyxTQUFTO2dCQUNiLE9BQU8sZUFBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQy9ELEtBQUssZUFBZTtnQkFDbkIsT0FBTyxlQUFlLENBQUMsYUFBYSxDQUFDLE9BQU8s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e1xuXHRDb21tb25GdW5jdGlvbnNJbnRlcmZhY2UsXG5cdEdlbmVyYXRlSHVlc0ZuR3JvdXAsXG5cdEdlbmVyYXRlUGFsZXR0ZUZuR3JvdXAsXG5cdEhTTCxcblx0UGFsZXR0ZSxcblx0U2VsZWN0ZWRQYWxldHRlT3B0aW9uc1xufSBmcm9tICcuLi90eXBlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBkZWZhdWx0RGF0YSBhcyBkZWZhdWx0cyB9IGZyb20gJy4uL2RhdGEvZGVmYXVsdHMuanMnO1xuXG5jb25zdCBkZWZhdWx0UGFsZXR0ZSA9IGRlZmF1bHRzLnBhbGV0dGU7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVBhbGV0dGUoXG5cdG9wdGlvbnM6IFNlbGVjdGVkUGFsZXR0ZU9wdGlvbnMsXG5cdGNvbW1vbjogQ29tbW9uRnVuY3Rpb25zSW50ZXJmYWNlLFxuXHRnZW5lcmF0ZUh1ZXM6IEdlbmVyYXRlSHVlc0ZuR3JvdXAsXG5cdGdlbmVyYXRlUGFsZXR0ZTogR2VuZXJhdGVQYWxldHRlRm5Hcm91cFxuKTogUGFsZXR0ZSB7XG5cdGNvbnN0IGxvZyA9IGNvbW1vbi5zZXJ2aWNlcy5hcHAubG9nO1xuXG5cdHRyeSB7XG5cdFx0bG9nKFxuXHRcdFx0J2RlYnVnJyxcblx0XHRcdGBHZW5lcmF0aW5nICR7b3B0aW9ucy5wYWxldHRlVHlwZX0gcGFsZXR0ZSB3aXRoIGFyZ3MgJHtKU09OLnN0cmluZ2lmeShvcHRpb25zKX1gLFxuXHRcdFx0J2dlbmVyYXRlUGFsZXR0ZSgpJyxcblx0XHRcdDJcblx0XHQpO1xuXG5cdFx0c3dpdGNoIChvcHRpb25zLnBhbGV0dGVUeXBlKSB7XG5cdFx0XHRjYXNlICdhbmFsb2dvdXMnOlxuXHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVQYWxldHRlLmFuYWxvZ291cyhvcHRpb25zLCBjb21tb24sIGdlbmVyYXRlSHVlcyk7XG5cdFx0XHRjYXNlICdjb21wbGVtZW50YXJ5Jzpcblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlUGFsZXR0ZS5jb21wbGVtZW50YXJ5KG9wdGlvbnMsIGNvbW1vbik7XG5cdFx0XHRjYXNlICdkaWFkaWMnOlxuXHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVQYWxldHRlLmRpYWRpYyhvcHRpb25zLCBjb21tb24sIGdlbmVyYXRlSHVlcyk7XG5cdFx0XHRjYXNlICdoZXhhZGljJzpcblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlUGFsZXR0ZS5oZXhhZGljKG9wdGlvbnMsIGNvbW1vbiwgZ2VuZXJhdGVIdWVzKTtcblx0XHRcdGNhc2UgJ21vbm9jaHJvbWF0aWMnOlxuXHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVQYWxldHRlLm1vbm9jaHJvbWF0aWMob3B0aW9ucywgY29tbW9uKTtcblx0XHRcdGNhc2UgJ3JhbmRvbSc6XG5cdFx0XHRcdHJldHVybiBnZW5lcmF0ZVBhbGV0dGUucmFuZG9tKG9wdGlvbnMsIGNvbW1vbik7XG5cdFx0XHRjYXNlICdzcGxpdC1jb21wbGVtZW50YXJ5Jzpcblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlUGFsZXR0ZS5zcGxpdENvbXBsZW1lbnRhcnkob3B0aW9ucywgY29tbW9uKTtcblx0XHRcdGNhc2UgJ3RldHJhZGljJzpcblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlUGFsZXR0ZS50ZXRyYWRpYyhvcHRpb25zLCBjb21tb24sIGdlbmVyYXRlSHVlcyk7XG5cdFx0XHRjYXNlICd0cmlhZGljJzpcblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlUGFsZXR0ZS50cmlhZGljKG9wdGlvbnMsIGNvbW1vbiwgZ2VuZXJhdGVIdWVzKTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGxvZyhcblx0XHRcdFx0XHQnZXJyb3InLFxuXHRcdFx0XHRcdGBJbnZhbGlkIHBhbGV0dGUgdHlwZSAke29wdGlvbnMucGFsZXR0ZVR5cGV9YCxcblx0XHRcdFx0XHQnZ2VuZXJhdGVQYWxldHRlKCknXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmF1bHRQYWxldHRlO1xuXHRcdH1cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVycm9yIG9jY3VycmVkIGR1cmluZyBwYWxldHRlIGdlbmVyYXRpb246ICR7ZXJyb3J9YCk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlSHVlcyhcblx0Y29sb3I6IEhTTCxcblx0b3B0aW9uczogU2VsZWN0ZWRQYWxldHRlT3B0aW9ucyxcblx0Y29tbW9uOiBDb21tb25GdW5jdGlvbnNJbnRlcmZhY2UsXG5cdGdlbmVyYXRlSHVlczogR2VuZXJhdGVIdWVzRm5Hcm91cFxuKTogbnVtYmVyW10ge1xuXHRjb25zdCB1dGlscyA9IGNvbW1vbi51dGlscztcblx0Y29uc3QgbG9nID0gY29tbW9uLnNlcnZpY2VzLmFwcC5sb2c7XG5cblx0dHJ5IHtcblx0XHRpZiAoIXV0aWxzLnZhbGlkYXRlLmNvbG9yVmFsdWUoY29sb3IpKSB7XG5cdFx0XHRsb2coXG5cdFx0XHRcdCdlcnJvcicsXG5cdFx0XHRcdGBJbnZhbGlkIGNvbG9yIHZhbHVlICR7SlNPTi5zdHJpbmdpZnkoY29sb3IpfWAsXG5cdFx0XHRcdCdnZW5lcmF0ZUh1ZXMoKSdcblx0XHRcdCk7XG5cblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cblx0XHRjb25zdCBjbG9uZWRDb2xvciA9IHV0aWxzLmNvcmUuY2xvbmUoY29sb3IpIGFzIEhTTDtcblxuXHRcdHN3aXRjaCAob3B0aW9ucy5wYWxldHRlVHlwZSkge1xuXHRcdFx0Y2FzZSAnYW5hbG9nb3VzJzpcblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlSHVlcy5hbmFsb2dvdXMoY2xvbmVkQ29sb3IsIG9wdGlvbnMsIGNvbW1vbik7XG5cdFx0XHRjYXNlICdkaWFkaWMnOlxuXHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVIdWVzLmRpYWRpYyhjbG9uZWRDb2xvciwgb3B0aW9ucywgY29tbW9uKTtcblx0XHRcdGNhc2UgJ2hleGFkaWMnOlxuXHRcdFx0XHRyZXR1cm4gZ2VuZXJhdGVIdWVzLmhleGFkaWMoY2xvbmVkQ29sb3IsIGNvbW1vbik7XG5cdFx0XHRjYXNlICdzcGxpdC1jb21wbGVtZW50YXJ5Jzpcblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlSHVlcy5zcGxpdENvbXBsZW1lbnRhcnkoY2xvbmVkQ29sb3IsIGNvbW1vbik7XG5cdFx0XHRjYXNlICd0ZXRyYWRpYyc6XG5cdFx0XHRcdHJldHVybiBnZW5lcmF0ZUh1ZXMudGV0cmFkaWMoY2xvbmVkQ29sb3IsIGNvbW1vbik7XG5cdFx0XHRjYXNlICd0cmlhZGljJzpcblx0XHRcdFx0cmV0dXJuIGdlbmVyYXRlSHVlcy50cmlhZGljKGNsb25lZENvbG9yLCBjb21tb24pO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0bG9nKFxuXHRcdFx0XHRcdCdlcnJvcicsXG5cdFx0XHRcdFx0YEludmFsaWQgaHVlIHR5cGUgJHtvcHRpb25zLnBhbGV0dGVUeXBlfWAsXG5cdFx0XHRcdFx0J2dlbmVyYXRlSHVlcygpJ1xuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0bG9nKCdlcnJvcicsIGBFcnJvciBnZW5lcmF0aW5nIGh1ZXM6ICR7ZXJyb3J9YCwgJ2dlbmVyYXRlSHVlcygpJyk7XG5cblx0XHRyZXR1cm4gW107XG5cdH1cbn1cbiJdfQ==