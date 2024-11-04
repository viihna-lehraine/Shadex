fetch('./html/help-menu.html')
    .then(response => response.text())
    .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
    })
    .catch(error => console.error('Error loading help modal:', error));
