const runningPath = window.location.origin;
// const runningPath = 'http://localhost:5000';
// start building table
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

const generateTable = (table, data) => {
  for (const element of data) {
    const row = table.insertRow();
    for (const key in element) {
      const cell = row.insertCell();
      if (key === 'Edit') {
        const button = editButton(element.email);
        const option = buttonOption(element.email);
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

const buttonOption = (email) => {
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
  view.setAttribute('href', `${runningPath}/iamAssignment3/client/myProfile.html/?email=${email}`);

  list.appendChild(remove);
  list.appendChild(view);
  return list;
};
// End table

const getUsers = async () => {
  const response = await fetch('http://localhost:5000/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const body = await response.json();
  const table = document.querySelector('table');
  const data = Object.keys(body[0]);
  generateTableHead(table, data);
  generateTable(table, body);
};

// add user by admin
// adminAddUser.addEventListener('click', async () => {
//   const data = {
//     name: document.getElementById('exampleInputName1').value,
//     email: document.getElementById('exampleInputEmail3').value,
//     password: document.getElementById('exampleInputPassword').value,
//     Gender: document.getElementById('exampleSelectGender').value,
//     Type: document.getElementById('exampleInputType').value,
//   };
//
//   const response = await fetch('http://localhost:5000/users', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
//   const body = await response.json();
// });

// const myAccount = async () => {
//   const response = await fetch(`${runningPath}/accounts/dkracheli135@gmail.com`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//
//   const body = await response.json();
//   const table = document.querySelector('table');
//   const data = Object.keys(body[0]);
//   generateTableHead(table, data);
//   generateTable(table, body);
// };

// eslint-disable-next-line no-unused-vars
const getUser = async () => {
  const url = new URL(window.location.href);
  const myParam = url.searchParams.get('email');
  const email = myParam;
  const response = await fetch(`http://localhost:5000/users/${email}`, {
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

const updataUser = async () => {
  const data = {

  };
  const response = await fetch(`${runningPath}/accounts/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const body = await response.json();
};
