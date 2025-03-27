// File: src/scripts/react/components/BottomMenu.tsx

export default function BottomMenu() {
	return (
		<div id="bottom-menu">
			{/* Import/Export/Help/History Buttons */}
			<div id="buttons">
				<button id="export-btn" type="button">
					💾
				</button>
				<button id="import-btn" type="button">
					📤
				</button>
				<button id="help-menu-btn" type="button">
					❓
				</button>
				<button id="history-menu-btn" type="button">
					📜
				</button>
			</div>

			{/* Filters */}
			<div id="filters">
				<label>
					<input type="checkbox" id="limit-dark-chkbx" /> Limit dark
				</label>
				<label>
					<input type="checkbox" id="limit-gray-chkbx" /> Limit gray
				</label>
				<label>
					<input type="checkbox" id="limit-light-chkbx" /> Limit light
				</label>
			</div>

			{/* Column Count Selectors */}
			<div id="column-selectors">
				<label>
					Column:
					<select id="palette-column-selector" defaultValue="1">
						{[1, 2, 3, 4, 5, 6].map(n => (
							<option key={n} value={n}>
								{n}
							</option>
						))}
					</select>
				</label>

				<label>
					Total:
					<select id="palette-column-count-selector" defaultValue="1">
						{[1, 2, 3, 4, 5, 6].map(n => (
							<option key={n} value={n}>
								{n}
							</option>
						))}
					</select>
				</label>
			</div>

			{/* Placeholder divs */}
			<div id="palette-history"></div>
			<div id="help-menu"></div>
			<div id="history-menu"></div>
		</div>
	);
}
