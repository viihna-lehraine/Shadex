const files = [
	'./html/help-menu.html',
	'./html/history-menu.html'
];

files.forEach(file => {
    fetch(file)
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
        })
        .catch(error => console.error(`Error loading ${file}:`, error));
});
