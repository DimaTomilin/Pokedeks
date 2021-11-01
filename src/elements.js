import { generationPokemonElements } from './server-requests';
import { capitalizeFirstLetter } from './derectives';
import { searchPokemonFromTheList } from './pokemon';

const pokemonListOfTypes = document.getElementById('pokemon-list');
const pokemonTypes = document.getElementById('pokemon-types');

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

export function creatingList(header) {
  pokemonListOfTypes.innerHTML = '';
  const headerOfList = createElement('div', [], ['card-header']);
  headerOfList.textContent = `Pokemons of ${header}:`;
  pokemonListOfTypes.appendChild(headerOfList);
  const pokemons = createElement('ul', [], ['list-group', 'list-group-flush']);
  pokemonListOfTypes.appendChild(pokemons);
}

async function generationListOfType(event) {
  creatingList(`${event.target.textContent} type`);
  await generationPokemonElements(event);
}

export function generationPokemonElement(pokemon) {
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

export function generatePokemonTypes(types) {
  pokemonTypes.innerHTML = '';
  for (const type of types) {
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
