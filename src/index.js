import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
    e.preventDefault();
    const searchBox = inputEl.value.trim();

    if (searchBox === '') {
        countryListEl.innerHTML = ""
    } else {
    fetchCountries(searchBox).then(data => {
        if (data.length > 10){
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
            countryListEl.innerHTML = ""
        }
        else if (data.length >= 2 && data.length <= 10) {
            renderCountryList(data);
            countryInfoEl.innerHTML = ""
        }
        else {
            renderCountryArr(data);
            countryListEl.innerHTML = ""
        }
    })
        .catch(error => {
            countryListEl.innerHTML = ""
            countryInfoEl.innerHTML = ""
            Notiflix.Notify.failure("Oops, there is no country with that name")
        })
    }
}
    
function renderCountryList(countries) {
    const markup = countries.map(({ flags, name }) => {
        return `<li><img src="${flags.svg}" alt='${name.official}' width="40"><span class="country-text">${name.official}</span></li>`
    }).join("");

    countryListEl.insertAdjacentHTML('afterbegin',markup);
};

function renderCountryArr(countries) {
    const markup = countries.map(({ flags, name, capital, population, languages}) => {
        return `<li><img src="${flags.svg}" alt="${name.official}" width="30"><span class="country-title"><b>${name.official}</b></span></li>
        <li><b>Capital:</b> ${capital}</li>
        <li><b>Population:</b> ${population}</li>
        <li><b>Languages:</b> ${Object.values(languages)} </li>`;
        })
        .join('');
    
    countryInfoEl.insertAdjacentHTML('afterbegin', markup);
    countryListEl.innerHTML = ""
    
}