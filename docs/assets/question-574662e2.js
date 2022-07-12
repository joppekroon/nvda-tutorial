document.body.addEventListener('submit', event => {
	const formData = new FormData(event.target);
	formData.forEach((answer, key) => {
		localStorage.setItem(key, answer);
	});
});