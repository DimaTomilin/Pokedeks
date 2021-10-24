export const pokemonImage = document.getElementById('pokemon-image');
pokemonImage.addEventListener('mouseover', backImage);
pokemonImage.addEventListener('mouseleave', frontImage);

export const idInputArea = document.getElementById('id-input-area');
export const nameInputArea = document.getElementById('name-input-area');

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

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getDataFromInput() {
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
