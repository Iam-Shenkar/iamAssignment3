const runningPath = window.location.origin;

const signUpButton = document.getElementById('signUp');
const logInButton = document.getElementById('logIn');
const container = document.getElementById('container');
const backFlipCon = document.getElementById('backFlip-container');
const emailCon = document.getElementById('emailConfirmation');
const forgot = document.getElementById('forgot');
const closeForgot = document.getElementById('closeForgot');
const openEmailCon = document.getElementById('openEmailConfirmation');
const closeEmailCon = document.getElementById('closeEmailCon');

if (signUpButton) {
  signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
  });

  logInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
  });

  forgot.addEventListener('click', () => {
    container.classList.add('backFlip-container-active');
    container.style.display = 'none';
    emailCon.style.display = 'none';
  });

  closeForgot.addEventListener('click', () => {
    container.classList.remove('backFlip-container-active');
    container.style.display = 'block';
    emailCon.style.display = 'block';
  });

  openEmailCon.addEventListener('click', () => {
    container.classList.add('emailConfirmation-active');
    container.style.display = 'none';
    backFlipCon.style.display = 'none';
  });

  closeEmailCon.addEventListener('click', () => {
    container.classList.remove('emailConfirmation-active');
    container.style.display = 'block';
    backFlipCon.style.display = 'block';
  });
}
const login = async () => {
  const data = {
    email: document.getElementById('userEmail').value,
    password: document.getElementById('userPass').value,
  };
  const response = await fetch(`${runningPath}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  // const body = await response.json();
  if (response.status !== 302) {
  // alert((body.message));
  }
  window.location.href = `${runningPath}/`;
};

const register = async () => {
  const data = {
    name: document.getElementById('newUsername').value,
    email: document.getElementById('newUserEmail').value,
    password: document.getElementById('pass').value,
  };
  const response = await fetch(`${runningPath}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const body = await response.json();
  if (response.status !== 200 && body.message) {
    alert((body.message));
  }
};

const confirmationCode = async () => {
  const data = {
    name: document.getElementById('newUsername').value,
    email: document.getElementById('newUserEmail').value,
    password: document.getElementById('pass').value,
    code: document.getElementById('oneTimePassword').value,
  };
  const response = await fetch(`${runningPath}/auth/register/code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const body = await response.json();
  if (response.status !== 200 && body.message) {
    alert((body.message));
  }
};

const ResetPassweord = async () => {
  const data = {
    email: document.getElementById('emailResetPassword').value,
  };
  const response = await fetch(`${runningPath}/auth/register/code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const body = await response.json();
  if (response.status !== 200 && body.message) {
    alert((body.message));
  }
};
