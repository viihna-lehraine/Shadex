// File: src/scripts/react/components/PaletteColumn.tsx

interface Props {
	index: number;
	color: string;
	locked: boolean;
	setColor: (newColor: string) => void;
	toggleLock: () => void;
}

export default function PaletteColumn({
	index,
	color,
	locked,
	setColor,
	toggleLock
}: Props) {
	const inputId = `color-display-${index + 1}`;
	const modalId = `color-input-modal-${index + 1}`;
	const colorInputId = `color-input-${index + 1}`;

	return (
		<div className="palette-column" draggable>
			<input
				id={inputId}
				className="color-display"
				type="text"
				value={color}
				onChange={e => setColor(e.target.value)}
			/>
			<button className="color-input-btn modal-trigger">
				Change Color
			</button>
			<button className="lock-btn" onClick={toggleLock}>
				{locked ? 'Unlock 🔓' : 'Lock 🔒'}
			</button>
			<button className="drag-handle">Move ☰</button>
			<div className="resize-handle"></div>
			<div id={modalId} className="color-input-modal modal hidden">
				<input
					id={colorInputId}
					className="color-input"
					type="color"
					value={color}
					onChange={e => setColor(e.target.value)}
				/>
			</div>
		</div>
	);
}
