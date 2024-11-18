const form = document.querySelector('.filter__form');
const inputAll = document.querySelector('.language--all > input');
const inputOther = document.querySelectorAll('.language--specific > input');
const showLanguageButton = document.getElementsByClassName('language__button language__button--show')[0];
const hideLanguageButton = document.getElementsByClassName('language__button language__button--hide')[0];
const languageContainer = document.getElementsByClassName('language__container')[0];
const showLanguages = (evt) => {
    evt.preventDefault();
    languageContainer.classList.remove('hidden');
    showLanguageButton.classList.add('hidden');
    hideLanguageButton.classList.remove('hidden');
};
const hideLanguages = (evt) => {
    evt.preventDefault();
    languageContainer.classList.add('hidden');
    showLanguageButton.classList.remove('hidden');
    hideLanguageButton.classList.add('hidden');
};

const langAll = () => {
    if (inputAll.checked) {
        for (const input of inputOther) {
            input.checked = false;
        }
    }
};
const langOther = (input) => {
    const {checked} = input;
    console.log('lang-other:', {checked});
    if (checked) {
        inputAll.checked = false;
    }
};
// add event listener

inputOther.forEach(input => input.addEventListener('change', () => langOther(input)));
inputAll.addEventListener('change', langAll);

showLanguageButton.addEventListener('click', showLanguages);
hideLanguageButton.addEventListener('click', hideLanguages);