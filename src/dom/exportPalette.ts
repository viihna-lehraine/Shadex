// File: src/dom/exportPalette.js

import {
	ColorSpace,
	DOMExportPaletteFnInterface,
	Palette
} from '../index/index.js';

function asCSS(palette: Palette, colorSpace: ColorSpace = 'hsl'): void {
	const css = palette.items
		.map(item => {
			const colorValue = (() => {
				switch (colorSpace) {
					case 'cmyk':
						return item.cssStrings.cmykCSSString;
					case 'hex':
						return item.cssStrings.hexCSSString;
					case 'hsl':
						return item.cssStrings.hslCSSString;
					case 'hsv':
						return item.cssStrings.hsvCSSString;
					case 'lab':
						return item.cssStrings.labCSSString;
					case 'rgb':
						return item.cssStrings.rgbCSSString;
					case 'xyz':
						return item.cssStrings.xyzCSSString;
					default:
						return item.cssStrings.hslCSSString;
				}
			})();

			return `
            /* Palette Item: ${item.id} */
            .color-${item.id} {
                cmyk-color: ${item.cssStrings.cmykCSSString};
                hex-color: ${item.cssStrings.hexCSSString};
                hsl-color: ${item.cssStrings.hslCSSString};
                hsv-color: ${item.cssStrings.hsvCSSString};
                lab-color: ${item.cssStrings.labCSSString};
                rgb-color: ${item.cssStrings.rgbCSSString};
                xyz-color: ${item.cssStrings.xyzCSSString};
                background-color: ${colorValue}; /* Use selected color space */
            }
        `;
		})
		.join('\n');

	const blob = new Blob([css], { type: 'text/css' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');

	a.href = url;
	a.download = `palette_${palette.id}.css`;
	a.click();

	URL.revokeObjectURL(url);
}

function asJSON(palette: Palette): void {
	const json = JSON.stringify(palette, null, 2);
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');

	a.href = url;
	a.download = `palette_${palette.id}.json`;
	a.click();

	URL.revokeObjectURL(url);
}

function asPNG(
	palette: Palette,
	colorSpace: ColorSpace = 'hsl',
	paletteName?: string
): void {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	const swatchSize = 100;
	const padding = 20;
	const labelHeight = 40;
	const titleHeight = paletteName ? 60 : 0;

	canvas.width = (swatchSize + padding) * palette.items.length + padding;
	canvas.height = swatchSize + labelHeight + titleHeight + 2 * padding;

	if (!context) throw new Error('Could not get 2d context');

	context.fillStyle = '#f0f0f0ff';
	context.fillRect(0, 0, canvas.width, canvas.height);

	if (paletteName) {
		context.font = '22px Arial';
		context.fillStyle = '#1e1e1eff';
		context.textAlign = 'center';
		context.fillText(
			paletteName,
			canvas.width / 2,
			padding + titleHeight / 2
		);
	}

	palette.items.forEach((item, index) => {
		const x = padding + index * (swatchSize + padding);
		const y = padding + titleHeight;

		const fillColor = (() => {
			switch (colorSpace) {
				case 'cmyk':
					return item.cssStrings.cmykCSSString;
				case 'hex':
					return item.cssStrings.hexCSSString;
				case 'hsl':
					return item.cssStrings.hslCSSString;
				case 'hsv':
					return item.cssStrings.hsvCSSString;
				case 'lab':
					return item.cssStrings.labCSSString;
				case 'rgb':
					return item.cssStrings.rgbCSSString;
				default:
					return item.cssStrings.hslCSSString;
			}
		})();

		const colorLabel = fillColor;

		context.fillStyle = fillColor;
		context.fillRect(x, y, swatchSize, swatchSize);

		context.font = '12px Arial';
		context.fillStyle = '#0a0a0aff';
		context.textAlign = 'center';
		context.fillText(
			colorLabel,
			x + swatchSize / 2,
			y + swatchSize + labelHeight - 5
		);
	});

	canvas.toBlob(blob => {
		if (blob) {
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');

			a.href = url;
			a.download = `palette_${palette.id}.png`;
			a.click();

			URL.revokeObjectURL(url);
		} else {
			console.error('Failed to create PNG blob.');
		}
	}, 'image/png');
}

function asXML(palette: Palette): void {
	const xmlItems = palette.items
		.map(
			item => `
		<PaletteItem "${item.id}>
			<Colors>
				<CMYK>${item.colors.cmyk}</CMYK>
				<Hex>${item.colors.hex}</Hex>
				<HSL>${item.colors.hsl}</HSL>
				<HSV>${item.colors.hsv}</HSV>
				<LAB>${item.colors.lab}</LAB>
				<RGB>${item.colors.rgb}</RGB>
			</Colors>
		</PaletteItem>
	`
		)
		.join('');
	const xml = `
		<Palette ${palette.id}>
			<Flags>
				<EnableAlpha>${palette.flags.enableAlpha}</EnableAlpha>
				<LimitDarkness>${palette.flags.limitDarkness}</LimitDarkness>
				<LimitGrayness>${palette.flags.limitGrayness}</LimitGrayness>
				<LimitLightness>${palette.flags.limitLightness}</LimitLightness>
			</Flags>
			<Metadata>
				<CustomColor>
					<HSLColor>${palette.metadata.customColor ? palette.metadata.customColor.hslColor : null}</HSLColor>
					<ConvertedColors>${palette.metadata.customColor ? palette.metadata.customColor.convertedColors : null}</ConvertedColors>
				</CustomColor>
				<NumBoxes>${palette.metadata.numBoxes}</NumBoxes>
				<PaletteType>${palette.metadata.paletteType}</PaletteType>
			</Metadata>
			${xmlItems}
		</Palette>
	`;

	const blob = new Blob([xml], { type: 'application/xml' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');

	a.href = url;
	a.download = `palette_${palette.id}.xml`;
	a.click();

	URL.revokeObjectURL(url);
}

export const exportPalette: DOMExportPaletteFnInterface = {
	asCSS,
	asJSON,
	asPNG,
	asXML
};
