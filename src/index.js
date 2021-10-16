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
async function generationPokemonList(event) {
  pokemonList.innerHTML = "";
  const headerOfList = createElement("div", [], ["card-header"]);
  headerOfList.textContent = `Pokemons of ${event.target.textContent} type.`;
  pokemonList.appendChild(headerOfList);
  const pokemons = createElement("ul", [], ["list-group", "list-group-flush"]);
  pokemonList.appendChild(pokemons);
  await generationPokemonElements(event);
}

async function generationPokemonElements(event) {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/type/${event.target.textContent}//`
  );
  const newArr = response.data.pokemon.map((element) => element.pokemon.name);
  newArr.forEach(generationPokemonElement);
}

function generationPokemonElement(pokemon) {
  const newPokemon = createElement(
    "li",
    [],
    ["list-group-item"],
    {},
    { click: searchPokemonFromTheList }
  );
  newPokemon.textContent = pokemon;
  pokemonList.querySelector("ul").appendChild(newPokemon);
}

async function getPokemonByNameOrID(data) {
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${data}/`
    );
    return response.data;
  } catch {
    alert("Pokemon doesn`t exist.");
  }
}

async function searchPokemonFromTheList(event) {
  inputArea.value = event.target.textContent;
  pokemonList.innerHTML = "";
  await showingInformation();
}

function generatePokemonTypes(types) {
  pokemonTypes.innerHTML = "";
  const newArr = types.map((element) => element.type.name);
  for (const type of newArr) {
    const newTypeElement = createElement(
      "li",
      [],
      ["pokemon-type"],
      {},
      { click: generationPokemonList }
    );
    newTypeElement.textContent = type;
    pokemonTypes.appendChild(newTypeElement);
  }
}

async function showingInformation() {
  const data = getDataFromInput();
  const pokemonInformation = await getPokemonByNameOrID(data);
  pokemonName.textContent = pokemonInformation.name;
  pokemonHeight.textContent = `Height: ${pokemonInformation.height}`;
  pokemonWeight.textContent = `Weight: ${pokemonInformation.weight}`;
  generatePokemonTypes(pokemonInformation.types);
  pokemonImage.setAttribute("src", pokemonInformation.sprites.front_default);
}

function getDataFromInput() {
  let data = inputArea.value;
  if (typeof data === "string") {
    data = data.toLocaleLowerCase();
  }
  return data;
}

async function backImage() {
  if (pokemonName.textContent === "Name") {
    return 0;
  }
  const pokemonInformation = await getPokemonByNameOrID(
    pokemonName.textContent
  );
  pokemonImage.setAttribute("src", pokemonInformation.sprites.back_default);
}

async function frontImage() {
  if (pokemonName.textContent === "Name") {
    return 0;
  }
  const pokemonInformation = await getPokemonByNameOrID(
    pokemonName.textContent
  );
  pokemonImage.setAttribute("src", pokemonInformation.sprites.front_default);
}
