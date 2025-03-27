// File: src/scripts/react/App.tsx

import '../../styles/main.css';
import { SelectedPaletteOptions, Palette } from '../types/index.js';
import { useEffect, useState } from 'react';
import { useDependencies } from './context/DependencyContext.js';
import { generatePalette } from '../palette/generate.js';
import AdjustmentButtons from './components/AdjustmentButtons.js';
import BottomMenu from './components/BottomMenu.js';
import ConversionButtons from './components/ConversionButtons.js';
import Footer from './components/Footer.js';
import PaletteContainer from './components/PaletteContainer.js';
import TopBar from './components/TopBar.js';

export default function App() {
	const { common, generatePaletteFns, generateHuesFns } = useDependencies();
	const [palette, setPalette] = useState<Palette | null>(null);

	useEffect(() => {
		const defaultOptions: SelectedPaletteOptions = {
			paletteType: 'analogous',
			distributionType: 'base',
			columnCount: 5,
			limitDark: false,
			limitGray: false,
			limitLight: false
		};

		try {
			const result = generatePalette(
				defaultOptions,
				common,
				generateHuesFns,
				generatePaletteFns
			);

			setPalette(result);
		} catch (err) {
			common.services.log.error(
				`App failed to generate palette: ${err}`,
				'App.tsx'
			);
		}
	}, [common, generateHuesFns, generatePaletteFns]);

	return (
		<>
			<div className="app">
				<TopBar />
				{palette && (
					<PaletteContainer
						palette={palette}
						setPalette={setPalette}
					/>
				)}
				<AdjustmentButtons />
				<ConversionButtons />
				<BottomMenu />
				<Footer />
			</div>
		</>
	);
}
