import {
	BrandingUtilities,
	ByteRange,
	LAB_A,
	LAB_B,
	LAB_L,
	Percentile,
	Radial,
	RangeKeyMap,
	SanitationUtilities,
	Services,
	ValidationUtilities
} from '../../types/index.js';

export function sanitationUtilitiesFactory(
	brand: BrandingUtilities,
	services: Services,
	validate: ValidationUtilities
): SanitationUtilities {
	const { errors } = services;

	function getSafeQueryParam(param: string): string | null {
		return errors.handleSync(() => {
			const urlParams = new URLSearchParams(window.location.search);
			const rawValue = urlParams.get(param);

			return rawValue ? sanitizeInput(rawValue) : null;
		}, 'Error occurred while getting safe query parameter');
	}

	function toColorValueRange<T extends keyof RangeKeyMap>(
		value: string | number,
		rangeKey: T
	): RangeKeyMap[T] {
		return errors.handleSync(
			() => {
				validate.range(value, rangeKey);

				return rangeKey === 'HexSet'
					? (brand.asHexSet(
							value as string
						) as unknown as RangeKeyMap[T])
					: brand.asBranded(value as number, rangeKey);
			},
			'Error occurred while validating color value range.',
			{ context: { rangeKey } }
		);
	}

	function lab(
		value: number,
		output: 'l' | 'a' | 'b'
	): LAB_L | LAB_A | LAB_B {
		return errors.handleSync(() => {
			if (output === 'l') {
				return brand.asLAB_L(
					Math.round(Math.min(Math.max(value, 0), 100))
				);
			} else if (output === 'a') {
				return brand.asLAB_A(
					Math.round(Math.min(Math.max(value, -125), 125))
				);
			} else if (output === 'b') {
				return brand.asLAB_B(
					Math.round(Math.min(Math.max(value, -125), 125))
				);
			} else throw new Error('Unable to return LAB value');
		}, 'Error occurred while sanitizing LAB value');
	}

	function percentile(value: number): Percentile {
		return errors.handleSync(() => {
			const rawPercentile = Math.round(Math.min(Math.max(value, 0), 100));

			return brand.asPercentile(rawPercentile);
		}, 'Error occurred while sanitizing percentile value');
	}

	function radial(value: number): Radial {
		return errors.handleSync(() => {
			const rawRadial =
				Math.round(Math.min(Math.max(value, 0), 360)) & 360;

			return brand.asRadial(rawRadial);
		}, 'Error occurred while sanitizing radial value');
	}

	function rgb(value: number): ByteRange {
		return errors.handleSync(() => {
			const rawByteRange = Math.round(Math.min(Math.max(value, 0), 255));

			return toColorValueRange(rawByteRange, 'ByteRange')!;
		}, 'Error occurred while sanitizing RGB value');
	}

	function sanitizeInput(str: string): string {
		return errors.handleSync(() => {
			return str.replace(
				/[&<>"'`/=():]/g,
				char =>
					({
						'&': '&amp;',
						'<': '&lt;',
						'>': '&gt;',
						'"': '&quot;',
						"'": '&#039;',
						'`': '&#x60;',
						'/': '&#x2F;',
						'=': '&#x3D;',
						'(': '&#40;',
						')': '&#41;',
						':': '&#58;'
					})[char] || char
			);
		}, 'Error occurred while sanitizing input');
	}

	const sanitationUtilities: SanitationUtilities = {
		getSafeQueryParam,
		lab,
		percentile,
		radial,
		rgb,
		sanitizeInput,
		toColorValueRange
	};

	return errors.handleSync(
		() => sanitationUtilities,
		'Error creating sanitation utilities group.'
	);
}
