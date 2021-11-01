import { showingAlert } from './alerts';
import axios from 'axios';

const usernameInput = document.getElementById('username-area');

document.getElementById('sing-in-button').addEventListener('click', userSingIn);
document.getElementById('check-button').addEventListener('click', checkUser);

async function userSingIn() {
  const username = usernameInput.value.toLowerCase();
  localStorage.setItem('username', username);
  const response = await fetch(
    `https://salty-thicket-98454.herokuapp.com/user/create/${username}`,
    {
      method: 'PUT',
    }
  );
  const body = await response.text();
  showingAlert(document.getElementById('alert1'), response.status, body);
  usernameInput.value = '';
}

async function checkUser() {
  const response = await axios.post(
    `https://salty-thicket-98454.herokuapp.com/user/info`,
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
