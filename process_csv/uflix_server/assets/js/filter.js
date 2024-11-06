const langAll = (input) => {
	console.log(input);
	console.log(input.checked);
	if (input.checked) {
		document.querySelectorAll(`label>input[type='checkbox']:not(#checkbox-all)`).forEach(el => el.checked = false);
	}
}
const langOther = (input) => {
	console.log(input);
	if (input.checked) {
		const checkboxAll = document.querySelector(`#checkbox-all`);
		console.log(checkboxAll)
		checkboxAll.checked = false;
	}
}