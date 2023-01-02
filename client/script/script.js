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
        const option = buttonOption(element.email, 'myProfile');
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
      const cell = row.insertCell();
      if (key === 'Edit') {
        const button = editButton(element.Name);
        const option = buttonOption(element.Name, 'myAccount');
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

const buttonOption = (email, path) => {
  console.log(email);
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
  view.setAttribute('href', `${runningPath}/${path}.html?email=${email}`);

  list.appendChild(remove);
  list.appendChild(view);
  return list;
};

const getUser = async () => {
  const url = new URL(window.location.href);
  const myParam = url.searchParams.get('email');
  const email = myParam;
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
  const data = Object.keys(body[0]);
  generateTableHead(table, data);
  generateAccountTable(table, body);
};

const getAccount = async () => {
  const url = new URL(window.location.href);
  const myParam = url.searchParams.get('email');
  const email = myParam;
  const response = await fetch(`${runningPath}/accounts/${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const body = await response.json();
  const table = document.querySelector('table');
  const plan = body.shift();

  const data = Object.keys(body[1]);
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
