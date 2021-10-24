import { showingAlert } from './alerts';

const usernameInput = document.getElementById('username-area');

document.getElementById('sing-in-button').addEventListener('click', userSingIn);
document.getElementById('check-button').addEventListener('click', checkUser);

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
