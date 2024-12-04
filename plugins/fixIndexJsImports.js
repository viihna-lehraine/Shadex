// File: src/plugins/fixIndexJsImports.js

function fixIndexJsImports() {
	return {
		name: 'fix-index-js-imports',

		generateBundle(_, bundle) {
			for (const fileName of Object.keys(bundle)) {
				if (fileName.endsWith('index.js')) {
					const chunk = bundle[fileName];

					if (chunk.type === 'chunk') {
						console.log(`Processing ${fileName}...`);
						console.log(`Before: ${chunk.code}`);

						chunk.code = chunk.code.replace(/from "(\.[^"]*)"/g, 'from "$1.js"');

						console.log(`After: ${chunk.code.replace(/from "(\.[^"]*)"/g, 'from "$1.js"')}`);
					}
				}
			}
		}
	}
}
