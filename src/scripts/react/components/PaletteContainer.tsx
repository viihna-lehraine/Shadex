// File: src/scripts/react/components/PaletteContainer.tsx

import { HexSet, Palette } from '../../types/index.js';
import PaletteColumn from './PaletteColumn.js';

export interface ColumnProps {
	palette: Palette;
	setPalette: React.Dispatch<React.SetStateAction<Palette | null>>;
}

export default function PaletteContainer({ palette, setPalette }: ColumnProps) {
	return (
		<section className="palette-container">
			{palette.items.map((item, i) => (
				<PaletteColumn
					key={i}
					index={i}
					color={item.colors.hex.hex}
					locked={false}
					setColor={newColor => {
						setPalette(prev => {
							if (!prev) return prev;

							const updated = [...prev.items];
							updated[i] = {
								...updated[i],
								colors: {
									...updated[i].colors,
									hex: {
										...updated[i].colors.hex,
										hex: newColor as HexSet
									}
								}
							};

							return {
								...prev,
								items: updated
							};
						});
					}}
					toggleLock={() => {}}
				/>
			))}
		</section>
	);
}
