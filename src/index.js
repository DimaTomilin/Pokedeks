/*
*
Elements
*
*/

//const { default: axios } = require('axios');

function createElement(
  tagName,
  children = [],
  classes = [],
  attributes = {},
  eventListeners = {}
) {
  const el = document.createElement(tagName);
  // Adding children
  for (const child of children) {
    el.append(child);
  }
  // Adding classes
  for (const cls of classes) {
    el.classList.add(cls);
  }
  // Adding attributes
  for (const attr in attributes) {
    el.setAttribute(attr, attributes[attr]);
  }
  // Adding events
  for (const event in eventListeners) {
    el.addEventListener(event, eventListeners[event]);
  }
  return el;
}

async function generationListOfType(event) {
  pokemonListOfTypes.innerHTML = '';
  const headerOfList = createElement('div', [], ['card-header']);
  headerOfList.textContent = `Pokemons of ${event.target.textContent} type:`;
  pokemonListOfTypes.appendChild(headerOfList);
  const pokemons = createElement('ul', [], ['list-group', 'list-group-flush']);
  pokemonListOfTypes.appendChild(pokemons);
  await generationPokemonElements(event);
}

function generationPokemonElement(pokemon) {
  const newPokemon = createElement(
    'li',
    [],
    ['list-group-item'],
    {},
    { click: searchPokemonFromTheList }
  );
  newPokemon.textContent = capitalizeFirstLetter(pokemon);
  pokemonListOfTypes.querySelector('ul').appendChild(newPokemon);
}

/*
*
DOM Elements
*
*/

const inputArea = document.getElementById('id-input-area');
const searchButton = document.getElementById('search-button');
const pokemonName = document.getElementById('pokemon-name');
const pokemonWeight = document.getElementById('pokemon-weight');
const pokemonHeight = document.getElementById('pokemon-height');
const pokemonTypes = document.getElementById('pokemon-types');
const pokemonImage = document.getElementById('pokemon-image');
const pokemonListOfTypes = document.getElementById('pokemon-list');
const nextPokemon = document.getElementById('next-pokemon-button');
const previousPokemon = document.getElementById('previous-pokemon-button');
const singInButton = document.getElementById('sing-in-button');
const usernameInput = document.getElementById('username-area');

/*
*
Derectives
*
*/

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getDataFromInput() {
  let data = inputArea.value;
  if (typeof data === 'string') {
    data = data.toLowerCase();
  }
  return data;
}

async function backImage() {
  if (pokemonName.textContent === 'Name') {
    return 0;
  }
  const pokemonInformation = await getPokemonByNameOrID(
    pokemonName.textContent.toLowerCase()
  );
  pokemonImage.setAttribute('src', pokemonInformation.sprites.back_default);
}

async function frontImage() {
  if (pokemonName.textContent === 'Name') {
    return 0;
  }
  const pokemonInformation = await getPokemonByNameOrID(
    pokemonName.textContent.toLowerCase()
  );
  pokemonImage.setAttribute('src', pokemonInformation.sprites.front_default);
}

async function nextPokemonFunction() {
  if (inputArea.value === '' || inputArea.value === '0') {
    inputArea.value = 1;
  } else {
    const pokemon = await getPokemonByNameOrID(inputArea.value.toLowerCase());
    const nextPokemonID = pokemon.id + 1;
    inputArea.value = nextPokemonID;
  }
  await showingInformation();
}

async function previousPokemonFunction() {
  const pokemon = await getPokemonByNameOrID(inputArea.value.toLowerCase());
  const previousPokemonID = pokemon.id - 1;
  inputArea.value = previousPokemonID;
  await showingInformation();
}

/*
*
API requests
*
*/

async function generationPokemonElements(event) {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/type/${event.target.textContent}/`
  );
  const newArr = response.data.pokemon.map((element) => element.pokemon.name);
  newArr.forEach(generationPokemonElement);
}

async function getPokemonByNameOrID(data) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${data}/`);
    const pokemon = await response.json();
    return pokemon;
  } catch {
    alert('Pokemon doesn`t exist.');
  }
}

/*
*
Pokemon
*
*/

async function searchPokemonFromTheList(event) {
  inputArea.value = event.target.textContent;
  pokemonListOfTypes.innerHTML = '';
  await showingInformation();
}

function generatePokemonTypes(types) {
  pokemonTypes.innerHTML = '';
  const newArr = types.map((element) => element.type.name);
  for (const type of newArr) {
    const newTypeElement = createElement(
      'li',
      [],
      ['pokemon-type'],
      {},
      { click: generationListOfType }
    );
    newTypeElement.textContent = type;
    pokemonTypes.appendChild(newTypeElement);
  }
}

async function showingInformation() {
  const data = getDataFromInput();
  const pokemonInformation = await getPokemonByNameOrID(data);
  localStorage.setItem(
    'pokemon',
    JSON.stringify({
      height: pokemonInformation.height,
      weight: pokemonInformation.weight,
    })
  );
  pokemonName.textContent = capitalizeFirstLetter(pokemonInformation.name);
  pokemonHeight.textContent = `Height: ${pokemonInformation.height}`;
  pokemonWeight.textContent = `Weight: ${pokemonInformation.weight}`;
  generatePokemonTypes(pokemonInformation.types);
  pokemonImage.setAttribute('src', pokemonInformation.sprites.front_default);
}

/*
*
EventListener
*
*/

searchButton.addEventListener('click', showingInformation);
pokemonImage.addEventListener('mouseover', backImage);
pokemonImage.addEventListener('mouseleave', frontImage);
nextPokemon.addEventListener('click', nextPokemonFunction);
previousPokemon.addEventListener('click', previousPokemonFunction);
singInButton.addEventListener('click', userSingIn);

async function userSingIn(e) {
  const username = usernameInput.value.toLowerCase();
  usernameInput.value = '';
  localStorage.setItem('username', username);
  const response = await axios.put(
    `http://localhost:8080/users/create/${username}`
  );
  console.log(response);
}

/*
*
LocalStorage
*
*/

localStorage.setItem('username', '');
localStorage.setItem('pokemon', '');
