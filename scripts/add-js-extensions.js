import { replaceInFile } from 'replace-in-file';

async function addJsExtensions() {
	console.log('Starting the JS extension replacement process...');

	try {
		const results = await replaceInFile({
			files: 'public/js/**/*.js',
			from: /(import\s+.*?['"])(\..*?)(['"])/g,
			to: '$1$2.js$3',
			dry: false
		});

		if (results.length === 0) {
			console.warn('No files were modified. Check the path and regex.');
		} else {
			results.forEach(result => {
				console.log(`Modified: ${result.file}`);
				console.log(`Has changes: ${result.hasChanged}`);
			});
		}
	} catch (error) {
		console.error(`Error occurred: ${error}`);
	}
}

addJsExtensions();
