const runningPath = window.location.origin;
const generateTableHead = (table, data) => {
  const thead = table.createTHead();
  const row = thead.insertRow();
  for (const key of data) {
    const th = document.createElement('th');
    const text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
};

const generateUserTable = (table, data) => {
  for (const element of data) {
    const row = table.insertRow();
    for (const key in element) {
      const cell = row.insertCell();
      if (key === 'Edit') {
        const button = editButton(element.email);
        const option = buttonOption(element.email, 'myProfile', 'email');
        cell.appendChild(button);
        cell.appendChild(option);
      } else if (key === 'Status') {
        const status = statusStyle(element[key]);
        cell.appendChild(status);
      } else {
        const text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }
    }
  }
};

const generateAccountTable = (table, data) => {
  for (const element of data) {
    const row = table.insertRow();
    for (const key in element) {
      if (key !== 'id') {
        const cell = row.insertCell();
        if (key === 'Edit') {
          const button = editButton(element.id);
          const option = buttonOption(element.id, 'myAccount', 'id');
          cell.appendChild(button);
          cell.appendChild(option);
        } else if (key === 'Status') {
          const status = statusStyle(element[key]);
          cell.appendChild(status);
        } else {
          const text = document.createTextNode(element[key]);
          cell.appendChild(text);
        }
      }
    }
  }
};

const statusStyle = (element) => {
  const status = document.createElement('label');
  status.innerText = element;
  if (element === 'active') status.className = 'badge badge-success';
  if (element === 'pending') status.className = 'badge badge-warning';
  if (element === 'closed') status.className = 'badge badge-danger';
  if (element === 'suspended') status.className = 'badge badge-danger';
  return status;
};

const editButton = () => {
  const bth = document.createElement('button');
  bth.className = 'btn btn-primary editButton';
  bth.type = 'button';
  bth.setAttribute('data-bs-toggle', 'dropdown');
  bth.setAttribute('aria-haspopup', 'true');
  bth.setAttribute('aria-expanded', 'false');

  bth.innerHTML = '<i ' + 'class= ' + '"bi bi-pen"' + ' >';
  bth.style.padding = '8px';
  return bth;
};

const buttonOption = (email, path, val) => {
  const list = document.createElement('div');
  list.className = 'dropdown-menu';
  list.setAttribute('aria-labelledby', 'dropdownMenuIconButton6');
  const remove = document.createElement('a');
  const view = document.createElement('a');
  remove.innerText = 'Remove';
  view.innerText = 'Edit';

  remove.className = 'dropdown-item';
  view.className = 'dropdown-item';

  remove.setAttribute('onclick', '');
  view.setAttribute('href', `${runningPath}/${path}.html?${val}=${email}`);

  list.appendChild(remove);
  list.appendChild(view);
  return list;
};

const getUser = async () => {
  const url = new URL(window.location.href);
  let email = url.searchParams.get('email');
  if (!email) email = getCookie('email');
  const response = await fetch(`${runningPath}/users/${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const body = await response.json();
  document.getElementById('exampleInputUsername1').value = body.name;
  document.getElementById('exampleInputEmail1').value = body.email;
  document.getElementById('exampleInputRole').value = body.role;
  document.getElementById('exampleInputAccount').value = body.account;
};

// eslint-disable-next-line no-unused-vars
const editProfile = () => {
  const role = document.getElementById('exampleInputRole').value;
  const name = document.getElementById('exampleInputUsername1');
  if (role !== 'admin') {
    name.removeAttribute('readonly');
  }
};

const adminAddUser = async () => {
  const data = {
    name: document.getElementById('exampleInputName1').value,
    email: document.getElementById('exampleInputEmail3').value,
    password: document.getElementById('exampleInputPassword').value,
    gender: document.getElementById('exampleSelectGender').value,
  };
  const response = await fetch(`${runningPath}/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const body = await response.json();
  if (response.status === 200) {
    document.getElementById('userAddedSuccessfully').style.display = 'block';
    document.getElementById('userAddText').innerText = `${data.name} added successfully`;
  } else if (body.message) {
    alert((body.message));
  }
};

const getUsers = async () => {
  const response = await fetch(`${runningPath}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const body = await response.json();
  const table = document.querySelector('table');
  const data = Object.keys(body[0]);
  generateTableHead(table, data);
  generateUserTable(table, body);
};

const getAccounts = async () => {
  const response = await fetch(`${runningPath}/accounts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const body = await response.json();
  const table = document.querySelector('table');
  const data = Object.keys(body[0]).splice(1, 6);
  generateTableHead(table, data);
  generateAccountTable(table, body);
};

const getAccount = async () => {
  const url = new URL(window.location.href);
  let id = url.searchParams.get('id');
  if (!id) id = getCookie('account');
  const response = await fetch(`${runningPath}/accounts/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const body = await response.json();
  const table = document.querySelector('table');
  const plan = body.shift();

  const data = Object.keys(body[0]);
  generateTableHead(table, data);
  generateUserTable(table, body);
  document.getElementById('plan').innerText = plan.Plan;
  document.getElementById('seats').innerText = plan.Seats;
  document.getElementById('credits').innerText = plan.Credits;
  document.getElementById('features').innerText = plan.Features;
};

const userInvitation = async () => {
  const url = new URL(window.location.href);
  const account = url.searchParams.get('email');
  const email = document.getElementById('userEmail').value;
  const response = await fetch(`${runningPath}/accounts/${account}/invite/${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const body = await response.json();
  if (response.status === 200) {
    document.getElementById('userEmail').placeholder = body.message;
  }
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function getEmailUser() {
  const value = getCookie('email').split('%40');
  return `${value[0]}@${value[1]}`;
}

document.onload;
{
  let greeting;
  const time = new Date().getHours();

  switch (true) {
    case time < 10:
      greeting = 'Good morning,';
      break;
    case time < 20:
      greeting = 'Good day,';
      break;
    default:
      greeting = 'Good evening,';
  }
  const name = getCookie('name');
  document.getElementById('timeOfDay').innerHTML = `${greeting
  } <span style="color: #222222" id="userNameTitle" class="text-black fw-bold">${name}</span>`;
}

const sideMenu = () => {
  const email = getEmailUser();
  const nav = document.getElementById('navSideMenu');
  const title = MenuPermission();
  for (const key of title) {
    const list = document.createElement('li');
    const link = document.createElement('a');

    list.className = 'nav-item';
    link.className = 'nav-link';

    link.setAttribute('aria-expanded', 'false');
    link.setAttribute('aria-controls', 'ui-basic');
    link.setAttribute('href', `${runningPath}/${key.replace(' ', '')}.html?email=${email}`);
    link.innerText = key;
    nav.appendChild(list);
    list.appendChild(link);
  }
};

function MenuPermission() {
  const role = getCookie('role');
  const titleNavAdmin = ['My Profile', 'My Account', 'Accounts', 'Users', 'Add User'];
  const titleNavUser = ['My Profile', 'My Account'];
  if (role !== 'admin') {
    return titleNavUser;
  }
  return titleNavAdmin;
}

window.addEventListener('load', sideMenu);

const Logout = document.getElementById('logout');

Logout.addEventListener('click', async () => {
  const data = {
    email: decodeURIComponent(getCookie('email')),
  };
  console.log(data);
  const response = await fetch(`${runningPath}/auth/logout`, {
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
});
