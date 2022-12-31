const runningPath = window.location.origin;
// login
let accessToken;
let refreshToken;

const SubmitLoginForm = document.getElementById('loginBut');
const SubmitReq = document.getElementById('reqBut');
const logout = document.getElementById('logout');
const googleLogIn = document.getElementById('googleLogIn');

SubmitLoginForm.addEventListener('click', async () => {
  const data = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  };
  const response = await fetch(`${runningPath}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const body = await response.json();
  console.log(response.headers);
  accessToken = body.accessToken;
  refreshToken = body.refreshToken;
  document.getElementById('Request-tokenAcss').value = accessToken;
  document.getElementById('Request-tokenRefrsh').value = refreshToken;
  if (response.status === 200) {
    document.getElementById('textarea').value = 'Login succeeded';
  } else {
    document.getElementById('textarea').value = 'Login failed';
  }
});

SubmitReq.addEventListener('click', async () => {
  const response = await fetch(`${runningPath}/accounts/invite/ofirpeleg2111@gmail.com`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRrcmFjaGVsaTEzNUBnbWFpbC5jb20iLCJpYXQiOjE2NzIxNzEwODYsImV4cCI6MTY3MjE3MTA5MX0.hTMRcRpnYXarczopuXTSZcUOD_tFnG50djLANyEKpcE',
    },
    // body: JSON.stringify(data),
  });
  const body = await response.json();
  console.log(body);
  if (accessToken === document.getElementById('Request-tokenAcss').value) {
    document.getElementById('textarea').value = 'token is valid';
  } else {
    document.getElementById('textarea').value = 'Token Not Valid';
  }

  if (response.status === 200) {
    accessToken = body.accessToken;
    document.getElementById('Request-tokenAcss').value = accessToken;
  } else {
    document.getElementById('Request-tokenAcss').value = 'Unauthorized';
    document.getElementById('Request-tokenRefrsh').value = 'Unauthorized';
  }
});

logout.addEventListener('click', async () => {
  document.getElementById('Request-tokenAcss').value = 'Unauthorized';
  document.getElementById('Request-tokenRefrsh').value = 'Unauthorized';
  document.getElementById('textarea').value = 'logout';
});
googleLogIn.addEventListener('click', () => {
  window.location.href =`${runningPath}/auth/google`;
});
