// File: src/palette/io/parse.ts

export interface PaletteIOParseFnInterface {
	cssFileHeader(cssData: string): Promise<string | null>;
	cssFileSettings(data: string): Promise<{
		enableAlpha: boolean;
		limitDarkness: boolean;
		limitGrayness: boolean;
		limitLightness: boolean;
	}>;
}

function cssFileHeader(cssData: string): Promise<string | null> {
	// match the pattern `/* CSS Palette File ID: ${string} */`
	const headerPattern = /\/\* CSS Palette File ID:\s*(.+?)\s*\*\//;

	// execute the regex on the provided CSS data
	const match = cssData.match(headerPattern);

	// if a match is found, return the extracted ID; otherwise, return null
	return Promise.resolve(match ? match[1] : null);
}

function cssFileSettings(data: string): Promise<{
	enableAlpha: boolean;
	limitDarkness: boolean;
	limitGrayness: boolean;
	limitLightness: boolean;
} | void> {
	// define regex patterns for the settings
	const settingsPatterns: Record<string, RegExp> = {
		enableAlpha: /\/\* EnableAlpha Value: (\w+) \*\//i,
		limitDarkness: /\/\* LimitDarkness Value: (\w+) \*\//i,
		limitGrayness: /\/\* LimitGrayness Value: (\w+) \*\//i,
		limitLightness: /\/\* LimitLightness Value: (\w+) \*\//i
	};

	// initialize default values
	const settings = {
		enableAlpha: false,
		limitDarkness: false,
		limitGrayness: false,
		limitLightness: false
	};

	// iterate through each setting and parse its value
	for (const [key, pattern] of Object.entries(settingsPatterns)) {
		const match = data.match(pattern);
		if (match) {
			// convert 'TRUE'/'FALSE' (case-insensitive) to boolean
			settings[key as keyof typeof settings] =
				match[1].toUpperCase() === 'TRUE';
		}
	}

	return Promise.resolve(settings);
}

export const parse: PaletteIOParseFnInterface = {
	cssFileHeader,
	cssFileSettings
};
