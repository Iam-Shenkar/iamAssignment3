const ChangePasswordPage = () => {
  const Role = getCookie('role');
  const changePassword = document.getElementById('changePassword');
  const editButton = document.getElementById('editButton');
  const saveButton = document.getElementById('saveButton');
  const url = new URL(window.location.href);
  const email = url.searchParams.get('email');
  if (decodeURIComponent(getCookie('email')) === email) {
    changePassword.style.display = 'block';
  } else {
    changePassword.style.display = 'none';
    if (Role !== 'admin') {
      editButton.style.display = 'none';
      saveButton.style.display = 'none';
    } else {
      const email = document.getElementById('exampleInputEmail1').value;
      editButton.style.display = 'block';
    }
  }
};

const myAccountButton = () => {
  const addUserButton = document.getElementById('addUserButton');
  const upgeadButton = document.getElementById('upgeadButton');
  const editButton = document.getElementById('editButton');
  const Role = getCookie('role');
  if (Role === 'manager') {
    addUserButton.style.display = 'block';
    upgeadButton.style.display = 'block';
    editButton.style.display = 'none';
  } else if (Role === 'user') {
    addUserButton.style.display = 'none';
    upgeadButton.style.display = 'none';
    editButton.style.display = 'none';
  } else {
    addUserButton.style.display = 'block';
    upgeadButton.style.display = 'block';
    editButton.style.display = 'block';
  }
};
