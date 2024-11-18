
const LanguageSelector = (() => {
	const queryParams = new URLSearchParams(window.location.search);

	const elements = {
		allLanguagesCheckbox: document.querySelector('.language--all > input'),
		specificLanguagesCheckboxes: Array.from(document.querySelectorAll('.language--specific > input')),
		showLanguageButton: document.querySelector('.language__button--show'),
		deselectLanguageButton: document.querySelector('.language__button--deselect'),
		hideLanguageButton: document.querySelector('.language__button--hide'),
		languageContainer: document.querySelector('.language__container'),
		searchInput: document.querySelector('.language__search'),
		languageItems: Array.from(document.querySelectorAll('.language')),
		selectedLanguagesContainer: document.querySelector('.language__selected'),
	};

	if (Object.values(elements).some((el) => el === null)) {
		console.error('One or more required DOM elements are missing');
		return;
	}

	const {
		allLanguagesCheckbox,
		specificLanguagesCheckboxes,
		showLanguageButton,
		hideLanguageButton,
		deselectLanguageButton,
		languageContainer,
		searchInput,
		languageItems,
		selectedLanguagesContainer,
	} = elements;

	const selectedLanguageIds = queryParams.getAll('languages');
	console.log(selectedLanguageIds);

	function debounce(func, delay) {
		let timeout;
		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func(...args), delay);
		};
	}

	function initializeCheckboxes() {
		if (selectedLanguageIds.length === 0) {
			allLanguagesCheckbox.checked = true;
			specificLanguagesCheckboxes.forEach((input) => (input.checked = false));
		} else {
			[...specificLanguagesCheckboxes, allLanguagesCheckbox].forEach((input) => {
				input.checked = selectedLanguageIds.includes(input.value);
			});
		}
	}

	function deselectLanguages(evt) {
		evt.preventDefault();
		allLanguagesCheckbox.checked = true;
		specificLanguagesCheckboxes.forEach((input) => (input.checked = false));
		updateSelectedLanguagesDisplay();
	}

	function showLanguages(evt) {
		evt.preventDefault();
		toggleLanguageContainer(true);
		searchInput.focus();
	}

	function hideLanguages(evt) {
		evt.preventDefault();
		toggleLanguageContainer(false);
	}

	function toggleLanguageContainer(show) {
		languageContainer.classList.toggle('hidden', !show);
		showLanguageButton.classList.toggle('hidden', show);

		deselectLanguageButton.classList.toggle('hidden', !show);
		hideLanguageButton.classList.toggle('hidden', !show);
		searchInput.classList.toggle('hidden', !show);
		updateSelectedLanguagesDisplay();
	}

	function handleAllLanguagesClick() {
		if (allLanguagesCheckbox.checked) {
			specificLanguagesCheckboxes.forEach((input) => (input.checked = false));
		}
		updateSelectedLanguagesDisplay();
	}

	function handleSpecificLanguageClick(evt) {
		if (evt.target.checked) {
			allLanguagesCheckbox.checked = false;
		}
		updateSelectedLanguagesDisplay();
	}

	function filterLanguages() {
		const searchTerm = searchInput.value.toLowerCase();
		languageItems.forEach((item) => {
			const label = item.querySelector('label').textContent.toLowerCase();
			item.classList.toggle('hidden', !label.includes(searchTerm));
		});
	}

	function updateSelectedLanguagesDisplay() {
		const selectedLanguages = specificLanguagesCheckboxes
			.filter((input) => input.checked)
			.map((input) => input.nextElementSibling.textContent);
		selectedLanguagesContainer.textContent = selectedLanguages.join(', ');
	}

	function attachEventListeners() {
		allLanguagesCheckbox.addEventListener('change', handleAllLanguagesClick);
		specificLanguagesCheckboxes.forEach((input) =>
			input.addEventListener('change', handleSpecificLanguageClick)
		);
		showLanguageButton.addEventListener('click', showLanguages);
		deselectLanguageButton.addEventListener('click', deselectLanguages);
		hideLanguageButton.addEventListener('click', hideLanguages);
		searchInput.addEventListener('input', debounce(filterLanguages, 300));
	}

	function init() {
		initializeCheckboxes();
		attachEventListeners();
		updateSelectedLanguagesDisplay();
	}

	return { init };
})();

LanguageSelector.init();
