// File: src/scripts/react/components/ConversionButtons.tsx

import { JSX } from 'react';

export default function ConversionButtons(): JSX.Element {
	return (
		<div className="conversion-buttons">
			<button id="show-as-hex-btn">Hex</button>
			<button id="show-as-rgb-btn">RGB</button>
			<button id="show-as-hsl-btn">HSL</button>
			<button id="show-as-cmyk-btn">CMYK</button>
		</div>
	);
}
