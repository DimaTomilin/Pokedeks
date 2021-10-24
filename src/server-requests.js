import { generationPokemonElement, creatingList } from './elements';
import { capitalizeFirstLetter } from './derectives';
import { showingAlert, showingAlert2 } from './alerts';

document.getElementById('catch-button').addEventListener('click', catchPokemon);
document
  .getElementById('delete-button')
  .addEventListener('click', deletePokemon);
document
  .getElementById('all-pokemon-button')
  .addEventListener('click', showAllPokemons);

export async function generationPokemonElements(event) {
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

export async function getPokemonByNameOrID(data) {
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
