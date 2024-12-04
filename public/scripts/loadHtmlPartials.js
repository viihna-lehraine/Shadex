// File: src/scripts/loadHtmlPartials.js

const files = [
	'./html/advanced-menu.html',
	'./html/custom-color-menu.html',
	'./html/help-menu.html',
	'./html/history-menu.html'
];

files.forEach(file => {
	fetch(file)
		.then(response => response.text())
		.then(html => {
			document.body.insertAdjacentHTML('beforeend', html);
		})
		.catch(error => console.error(`Error loading ${file}: ${error}`));
});
