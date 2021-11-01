import { generatePokemonTypes } from './elements';
import {
  idInputArea,
  nameInputArea,
  getDataFromInput,
  pokemonImage,
  capitalizeFirstLetter,
} from './derectives';
import { getPokemonByNameOrID } from './server-requests';

export const pokemonName = document.getElementById('pokemon-name');
const pokemonWeight = document.getElementById('pokemon-weight');
const pokemonHeight = document.getElementById('pokemon-height');

const pokemonListOfTypes = document.getElementById('pokemon-list');

document
  .getElementById('search-button')
  .addEventListener('click', searchPokemon);

document
  .getElementById('next-pokemon-button')
  .addEventListener('click', nextPokemonFunction);
document
  .getElementById('previous-pokemon-button')
  .addEventListener('click', previousPokemonFunction);

async function nextPokemonFunction() {
  if (idInputArea.value === '' || idInputArea.value === '0') {
    idInputArea.value = 1;
  } else {
    const pokemon = JSON.parse(localStorage.getItem('pokemon'));
    const nextPokemonID = pokemon.id + 1;
    idInputArea.value = nextPokemonID;
  }
  await searchPokemon();
}

async function previousPokemonFunction() {
  const pokemon = JSON.parse(localStorage.getItem('pokemon'));
  const previousPokemonID = pokemon.id - 1;
  idInputArea.value = previousPokemonID;
  await searchPokemon();
}

export async function searchPokemonFromTheList(event) {
  nameInputArea.value = event.target.textContent;
  idInputArea.value = '';
  pokemonListOfTypes.innerHTML = '';
  await searchPokemon();
}

async function searchPokemon() {
  try {
    const data = getDataFromInput();
    const pokemon = await getPokemonByNameOrID(data);
    localStorage.setItem('pokemon', JSON.stringify(pokemon));
    showingPokemon(pokemon);
  } catch {
    return;
  }
}

function showingPokemon(pokemon) {
  pokemonName.textContent = capitalizeFirstLetter(pokemon.name);
  nameInputArea.value = capitalizeFirstLetter(pokemon.name);
  idInputArea.value = pokemon.id;
  pokemonHeight.textContent = `Height: ${pokemon.height}`;
  pokemonWeight.textContent = `Weight: ${pokemon.weight}`;
  generatePokemonTypes(pokemon.types);
  pokemonImage.setAttribute('src', pokemon.front_pic);
}
