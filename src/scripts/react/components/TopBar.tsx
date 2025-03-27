// File: src/scripts/react/componments/TopBar.tsx

import { useState } from 'react';
import GenerateButton from './buttons/GenerateButton.js';

export default function TopBar() {
	const [preset, setPreset] = useState('complementary');
	const handleGenerate = () => {};

	return (
		<div className="top-bar">
			<div className="logo-field">LOGO GOES HERE!</div>
			<div className="controls">
				<label htmlFor="palette-type-selector">Preset:</label>
				<select
					id="palette-type-selector"
					value={preset}
					onChange={e => setPreset(e.target.value)}
				>
					<option value="complementary">Complementary</option>
					<option value="splitComplementary">
						Split Complementary
					</option>
					<option value="analogous">Analogous</option>
					<option value="diadic">Diadic</option>
					<option value="triadic">Triadic</option>
					<option value="tetradic">Tetradic</option>
					<option value="hexadic">Hexadic</option>
					<option value="monochromatic">Monochromatic</option>
					<option value="random">Random</option>
				</select>
				<GenerateButton onGenerate={handleGenerate} />
			</div>
		</div>
	);
}
