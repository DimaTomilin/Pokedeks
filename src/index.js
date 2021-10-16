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
const inputArea = document.getElementById("input-area");
const searchButton = document.getElementById("search-button");
const pokemonName = document.getElementById("pokemon-name");
const pokemonWeight = document.getElementById("pokemon-weight");
const pokemonHeight = document.getElementById("pokemon-height");
const pokemonTypes = document.getElementById("pokemon-types");
const pokemonImage = document.getElementById("pokemon-image");
const pokemonList = document.getElementById("pokemon-list");
const nextPokemon = document.getElementById("next-pokemon-button");
const previousPokemom = document.getElementById("previous-pokemon-button");
