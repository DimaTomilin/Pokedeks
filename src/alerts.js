export function showingAlert(object, status, message) {
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

export function showingAlert2(message) {
  const alert2 = document.getElementById('alert2');
  alert2.querySelector('div').innerHTML = `<strong>Error!<strong> ${message}`;
  alert2.style.display = 'block';
  alert2.style.opacity = '1';
}
