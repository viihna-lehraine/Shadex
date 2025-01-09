// File: src/dom/validate.ts

function validateElements(ids: Record<string, string>): void {
	const missingElements: string[] = [];

	Object.values(ids).forEach(id => {
		const element = document.getElementById(id);

		if (!element) {
			console.error(`Element with ID "${id}" not found`);
			missingElements.push(id);
		}
	});

	if (missingElements.length) {
		console.warn(
			`Some DOM elements are missing (${missingElements.length}):`,
			missingElements
		);
	} else {
		console.log('All required DOM elements are present.');
	}
}

function validateFiles(files: readonly string[]): void {
	const missingFiles: string[] = [];

	files.forEach(file => {
		fetch(file, { method: 'HEAD' })
			.then(response => {
				if (!response.ok) {
					console.error(`File "${file}" is missing or inaccessible`);
					missingFiles.push(file);
				}
			})
			.catch(() => {
				console.error(`Failed to check file: ${file}`);
				missingFiles.push(file);
			});
	});

	if (missingFiles.length) {
		console.warn(
			`Some required HTML partial files are missing (${missingFiles.length}):`,
			missingFiles
		);
	} else {
		console.log('All required HTML partial files are accessible.');
	}
}

export { validateElements, validateFiles };
