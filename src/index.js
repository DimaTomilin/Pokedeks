/*
*
Elements
*
*/
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

function creatingList(header) {
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

const usernameInput = document.getElementById('username-area');

const idInputArea = document.getElementById('id-input-area');
const nameInputArea = document.getElementById('name-input-area');

const pokemonImage = document.getElementById('pokemon-image');

const pokemonName = document.getElementById('pokemon-name');
const pokemonWeight = document.getElementById('pokemon-weight');
const pokemonHeight = document.getElementById('pokemon-height');
const pokemonTypes = document.getElementById('pokemon-types');

const pokemonListOfTypes = document.getElementById('pokemon-list');

/*
*
Derectives
*
*/

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getDataFromInput() {
  if (idInputArea.value === '') {
    data = nameInputArea.value.toLowerCase();
  } else {
    data = parseInt(idInputArea.value);
    if (data < 0) {
      return;
    }
  }
  return data;
}

async function backImage() {
  if (pokemonName.textContent === 'Name') {
    return;
  }
  const pokemon = JSON.parse(localStorage.getItem('pokemon'));
  pokemonImage.setAttribute('src', pokemon.back_pic);
}

async function frontImage() {
  if (pokemonName.textContent === 'Name') {
    return;
  }
  const pokemon = JSON.parse(localStorage.getItem('pokemon'));
  pokemonImage.setAttribute('src', pokemon.front_pic);
}

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

/*
*
API requests
*
*/

async function generationPokemonElements(event) {
  const response = await axios.get(
    `http://localhost:8080/pokemon/type/${event.target.textContent}`,
    {
      headers: {
        username: localStorage.getItem('username'),
      },
    }
  );
  response.data.forEach(generationPokemonElement);
}

async function getPokemonByNameOrID(data) {
  try {
    let response;
    if (typeof data === 'string') {
      response = await axios.get(
        `http://localhost:8080/pokemon/query?name=${data}`,
        {
          headers: {
            username: localStorage.getItem('username'),
          },
        }
      );
    } else {
      response = await axios.get(`http://localhost:8080/pokemon/get/${data}`, {
        headers: {
          username: localStorage.getItem('username'),
        },
      });
    }
    return response.data;
  } catch {
    let message;
    if (localStorage.getItem('username') === '') {
      message = '401 Unknown username. Please make sing in.';
    } else {
      message = '404 Pokemon not found!';
    }
    showingAlert2(message);
    throw Error;
  }
}

/*
*
Pokemon
*
*/

async function searchPokemonFromTheList(event) {
  nameInputArea.value = event.target.textContent;
  idInputArea.value = '';
  pokemonListOfTypes.innerHTML = '';
  await searchPokemon();
}

function generatePokemonTypes(types) {
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

/*
*
EventListener
*
*/

document
  .getElementById('search-button')
  .addEventListener('click', searchPokemon);
pokemonImage.addEventListener('mouseover', backImage);
pokemonImage.addEventListener('mouseleave', frontImage);
document
  .getElementById('next-pokemon-button')
  .addEventListener('click', nextPokemonFunction);
document
  .getElementById('previous-pokemon-button')
  .addEventListener('click', previousPokemonFunction);
document.getElementById('sing-in-button').addEventListener('click', userSingIn);
document.getElementById('catch-button').addEventListener('click', catchPokemon);
document
  .getElementById('delete-button')
  .addEventListener('click', deletePokemon);
document
  .getElementById('all-pokemon-button')
  .addEventListener('click', showAllPokemons);
document.getElementById('check-button').addEventListener('click', checkUser);

async function checkUser() {
  const response = await axios.post(
    `http://localhost:8080/user/info`,
    {},
    {
      headers: {
        username: localStorage.getItem('username'),
      },
    }
  );
  showingAlert(
    document.getElementById('alert1'),
    response.status,
    response.data
  );
}

async function showAllPokemons() {
  const response = await axios.get(`http://localhost:8080/pokemon/`, {
    headers: {
      username: localStorage.getItem('username'),
    },
  });
  creatingList(capitalizeFirstLetter(localStorage.getItem('username')));
  response.data.forEach((pokemon) => generationPokemonElement(pokemon));
}

async function catchPokemon() {
  const pokemonId = JSON.parse(localStorage.getItem('pokemon')).id;
  const response = await fetch(
    `http://localhost:8080/pokemon/catch/${pokemonId}`,
    {
      method: 'PUT',
      headers: {
        username: localStorage.getItem('username'),
      },
    }
  );
  const body = await response.text();
  showingAlert(document.getElementById('alert3'), response.status, body);
}

async function deletePokemon() {
  const pokemonId = JSON.parse(localStorage.getItem('pokemon')).id;
  const response = await fetch(
    `http://localhost:8080/pokemon/release/${pokemonId}`,
    {
      method: 'DELETE',
      headers: {
        username: localStorage.getItem('username'),
      },
    }
  );
  const body = await response.text();
  showingAlert(document.getElementById('alert3'), response.status, body);
}

async function userSingIn() {
  const username = usernameInput.value.toLowerCase();
  usernameInput.value = '';
  localStorage.setItem('username', username);
  const response = await fetch(
    `http://localhost:8080/user/create/${username}`,
    {
      method: 'PUT',
    }
  );
  const body = await response.text();
  showingAlert(document.getElementById('alert1'), response.status, body);
}

function showingAlert(object, status, message) {
  object.classList.remove(object.classList.item(1));
  if (status === 200) {
    object.classList.add('success');
    object.querySelector(
      'div'
    ).innerHTML = `<strong>Success!<strong> ${message}`;
  } else {
    object.querySelector(
      'div'
    ).innerHTML = `<strong>Error!<strong> ${status} ${message}`;
  }
  object.style.display = 'block';
  object.style.opacity = '1';
}

function showingAlert2(message) {
  const alert2 = document.getElementById('alert2');
  alert2.querySelector('div').innerHTML = `<strong>Error!<strong> ${message}`;
  alert2.style.display = 'block';
  alert2.style.opacity = '1';
}

const closeButtons = document.getElementsByClassName('closebtn');

for (const button of closeButtons) {
  button.onclick = function () {
    const div = this.parentElement;
    div.style.opacity = '0';
    setTimeout(function () {
      div.style.display = 'none';
    }, 600);
  };
}

/*
*
LocalStorage
*
*/

localStorage.setItem('username', '');
localStorage.setItem('pokemon', '');
