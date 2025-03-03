import { colorBrandingUtilitiesFactory } from '../../../../../../src/core/utils/partials/color/brand.js';
import { mockColorBrandingUtilities } from '../../../../../mocks/core/utils/index.js';

describe('colorBrandingUtilitiesFactory Mock', () => {
	let colorBrandingUtilities: ReturnType<typeof colorBrandingUtilitiesFactory>;

	it('should return a valid branded CMYK color', () => {
		expect(
			mockColorBrandingUtilities.brandCMYKString({
				cyan: '50',
				magenta: '50',
				yellow: '50',
				key: '50'
			})
		).toEqual({
			cyan: 0.5,
			magenta: 0.5,
			yellow: 0.5,
			key: 0.5
		});
	});

	it('should return a valid branded HEX color', () => {
		expect(
			mockColorBrandingUtilities.brandHexString({ hex: '#123ABC' })
		).toEqual({ hex: '#mock23ABC' });
	});

	it('should return a valid branded HSL color', () => {
		expect(
			mockColorBrandingUtilities.brandHSLString({
				hue: '100',
				saturation: '50',
				lightness: '50'
			})
		).toEqual({
			hue: 180,
			saturation: 50,
			lightness: 50
		});
	});

	it('should return a valid branded RGB color', () => {
		expect(
			mockColorBrandingUtilities.brandRGBString({
				red: '255',
				green: '255',
				blue: '255'
			})
		).toEqual({
			red: 128,
			green: 128,
			blue: 128
		});
	});
});
