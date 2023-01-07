const runningPath = window.location.origin;

// const Logout = document.getElementById('logout');

const alert = (message, type, id) => {
  const alertPlaceholder = document.getElementById(id);
  const wrapper = document.createElement('div');
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>',
  ].join('');

  alertPlaceholder.append(wrapper);
};

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
        const option = buttonOption(element.email, 'myProfile', 'email', 'deleteUser', element);
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
          const option = buttonOption(element.id, 'myAccount', 'id', 'disableAccount', element);
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

const buttonOption = (email, path, val, removeFunc, element) => {
  const list = document.createElement('div');
  list.className = 'dropdown-menu';
  list.setAttribute('aria-labelledby', 'dropdownMenuIconButton6');
  const remove = document.createElement('a');
  const view = document.createElement('a');
  view.innerText = 'View';
  remove.innerText = 'Remove';

  remove.className = 'dropdown-item';
  view.className = 'dropdown-item';

  if (element.Status === 'closed') {
    view.setAttribute('onclick', 'viewClose()');
  } else {
    view.setAttribute('href', `${runningPath}/${path}?${val}=${email}`);
  }
  remove.setAttribute('onclick', `${removeFunc}(\'${email}\')`);
  remove.setAttribute('value', email);

  list.appendChild(view);
  if (getCookie('role') === 'admin') list.appendChild(remove);
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

  const editButton = document.getElementById('editButton');
  const role = getCookie('role');
  if (role === 'admin') editButton.setAttribute('href', `${runningPath}/EditProfile=${email}`);
  if (role !== 'admin') editButton.setAttribute('onclick', 'editProfile()');

  document.getElementById('exampleInputUsername1').value = body.name;
  document.getElementById('exampleInputEmail1').value = body.email;
  document.getElementById('exampleInputRole').value = body.role;
  document.getElementById('exampleInputAccount').value = body.account;
};

// eslint-disable-next-line no-unused-vars
const editProfile = () => {
  console.log('edit');
  const name = document.getElementById('exampleInputUsername1');
  name.removeAttribute('readonly');
};

const adminAddUser = async () => {
  const data = {
    name: document.getElementById('exampleInputName1').value,
    email: document.getElementById('exampleInputEmail3').value,
    password: document.getElementById('exampleInputPassword').value,
    gender: document.getElementById('exampleSelectGender').value,
  };
  const response = await fetch(`${runningPath}/users/invite`, {
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
  const response = await fetch(`${runningPath}/users/list`, {
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
  const response = await fetch(`${runningPath}/accounts/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const body = await response.json();
  const table = document.querySelector('table');
  const data = Object.keys(body[0])
    .splice(1, 6);
  generateTableHead(table, data);
  generateAccountTable(table, body);
};

const getAccount = async () => {
  const url = new URL(window.location.href);
  let id = url.searchParams.get('id');
  if (!id) id = getCookie('account');
  console.log(`${runningPath}/accounts/${id}`);
  const response = await fetch(`${runningPath}/accounts/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const body = await response.json();
  if (response.status === 200) {
    const table = document.querySelector('table');
    const plan = body.shift();

    const data = Object.keys(body[0]);
    generateTableHead(table, data);
    generateUserTable(table, body);
    document.getElementById('plan').innerText = plan.Plan;
    document.getElementById('seats').innerText = plan.Seats;
    document.getElementById('credits').innerText = plan.Credits;
    document.getElementById('features').innerText = plan.Features;
  } else {
    alert(body.message);
  }
};

const userInvitation = async () => {
  const url = new URL(window.location.href);
  let account = url.searchParams.get('id');
  if (!account) account = getCookie('account');
  const email = document.getElementById('userEmail').value;
  const response = await fetch(`${runningPath}/accounts/${account}/invite/${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const body = await response.json();
  if (response.status === 200) {
    document.getElementById('userEmail').value = body.message;
    getAccount();
  }
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()
      .split(';')
      .shift();
  }
}

const sideMenu = () => {
  const email = decodeURIComponent(getCookie('email'));
  const nav = document.getElementById('navSideMenu');
  const title = MenuPermission();
  for (const key of title) {
    const list = document.createElement('li');
    const link = document.createElement('a');

    list.className = 'nav-item';
    link.className = 'nav-link';

    link.setAttribute('aria-expanded', 'false');
    link.setAttribute('aria-controls', 'ui-basic');
    link.setAttribute('href', `${runningPath}/${key.replace(' ', '')}?email=${email}`);
    link.innerText = key;
    nav.appendChild(list);
    list.appendChild(link);
  }
};

function MenuPermission() {
  const role = getCookie('role');
  const titleNavAdmin = ['My Profile', 'Accounts', 'Users'];
  const titleNavUser = ['My Profile', 'My Account'];
  if (role !== 'admin') {
    return titleNavUser;
  }
  return titleNavAdmin;
}

window.addEventListener('load', sideMenu);
window.onload = () => {
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
  const name = (getCookie('name')).replaceAll('%20', ' ');
  const email = getCookie('email');
  document.getElementById('timeOfDay').innerHTML = `${greeting
  } <span style="color: #222222" id="userNameTitle" class="text-black fw-bold">${name}</span>`;
  let userName = document.getElementById('userNameProfile');
  userName.innerText = name;
  userName = document.getElementById('userEmailProfile');
  userName.innerHTML = email.replace('%40', '&#064;');
};

// Logout.addEventListener('click', async () => {
//   const data = {
//     email: decodeURIComponent(getCookie('email')),
//   };
//   console.log(data);
//   const response = await fetch(`${runningPath}/auth/logout`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
//   // const body = await response.json();
//   if (response.status !== 302) { console.log('redirect'); }
//   window.location.href = `${runningPath}/`;
// });

const charts = async () => {
  const responseUser = await fetch(`${runningPath}/users/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const users = await responseUser.json();
  typeChart(users);

  const responseAccount = await fetch(`${runningPath}/accounts/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const accounts = await responseAccount.json();
  planChart(accounts);
};

const typeChart = (users) => {
  const roles = {};
  for (let i = 0; i < users.length; i++) {
    const role = users[i].Role;
    if (roles[role] == null) {
      roles[role] = 0;
    }
    roles[role]++;
  }
  for (const role in roles) {
    roles[role] = (roles[role] / users.length) * 100;
  }
  const ctx = document.getElementById('typePieChart')
    .getContext('2d');
  const pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(roles),
      datasets: [{
        data: Object.values(roles),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      }],
    },
    options: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          fontSize: 14,
        },
      },
      responsive: true,
      aspectRatio: 1,
    },
  });
};

const planChart = (accounts) => {
  const plans = {};
  for (let i = 0; i < accounts.length; i++) {
    const plan = accounts[i].Plan;
    if (plans[plan] == null) {
      plans[plan] = 0;
    }
    plans[plan]++;
  }
  for (const plan in plans) {
    plans[plan] = (plans[plan] / accounts.length) * 100;
  }
  const ctx = document.getElementById('myPieChart')
    .getContext('2d');
  const pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(plans),
      datasets: [{
        data: Object.values(plans),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      }],
    },
    options: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          fontSize: 14,
        },
      },
    },
    responsive: true,
    aspectRatio: 1,
  });
};

// const logo = document.getElementById('logo'); // or grab it by tagname etc
// logo.setAttribute('href', `${runningPath}/`);

// eslint-disable-next-line no-unused-vars
const positiveNumber = () => {
  const exampleAmountOfDays = document.getElementById('exampleAmountOfDays');
  if (exampleAmountOfDays.value < 0) {
    exampleAmountOfDays.value *= -1;
  }
};

// eslint-disable-next-line no-unused-vars
const updateDaysOfSuspension = () => {
  const select = document.getElementById('exampleUsersStatus');
  const exampleAmountOfDays = document.getElementById('exampleAmountOfDays');
  exampleAmountOfDays.readOnly = select.value !== 'Suspend';
};

// eslint-disable-next-line no-unused-vars
const disableAccount = async (accotnt) => {
  const response = await fetch(
    `${runningPath}/accounts/status/${accotnt}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  // eslint-disable-next-line no-unused-vars
  const body = await response.json();
  if (response.status === 200) {
    alert('account closed', 'primary', 'liveAlertPlaceholder');
  }
};

// eslint-disable-next-line no-unused-vars
function viewClose() {
  alert('It is not possible to view a closed account!', 'danger', 'liveAlertPlaceholder');
}

// eslint-disable-next-line no-unused-vars
const deleteUser = async (email) => {
  // eslint-disable-next-line no-console
  console.log('deleteF');
  const response = await fetch(
    `${runningPath}/users/${email}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const body = await response.json();
  if (body.status === 200) {
    alert('account closed', 'primary', 'liveAlertPlaceholder');
  }
};

const dataArray = [
  {
    date: 'January 1, 2023',
    users: 100,
  },
  {
    date: 'January 2, 2023',
    users: 110,
  },
  {
    date: 'January 3, 2023',
    users: 120,
  },
];
const monthArray = [
  {
    date: 'January , 2022',
    users: 1000,
  },
  {
    date: 'February, 2022',
    users: 1100,
  },
  {
    date: 'March 2022',
    users: 1200,
  },
  {
    date: 'April 2022',
    users: 1300,
  },
  {
    date: 'May 2022',
    users: 1400,
  },
  {
    date: 'June 2022',
    users: 1500,
  },
  {
    date: 'July 2022',
    users: 1600,
  },
  {
    date: 'August 2022',
    users: 1700,
  },
  {
    date: 'September 2022',
    users: 1800,
  },
  {
    date: 'October 2022',
    users: 1900,
  },
  {
    date: 'November 2022',
    users: 2000,
  },
  {
    date: 'December 2022',
    users: 2100,
  },
];

const buildTablePerDayAndMonth = (dataArray, monthArray) => {
  const div1 = document.getElementById('tablesPerDay');
  const div2 = document.getElementById('tablesPerMonth');

  const table1 = document.createElement('table');
  const table2 = document.createElement('table');
  table1.className = 'table';
  table2.className = 'table';

  const headerRowDay = document.createElement('tr');
  const headerRowMonth = document.createElement('tr');

  const dayColumn = document.createElement('th');
  const monthColumn = document.createElement('th');

  dayColumn.textContent = 'Per Day';
  monthColumn.textContent = 'Per Month';

  const usersColumnDay = document.createElement('th');
  usersColumnDay.textContent = 'Number of Registered Users';
  const usersColumnMonth = document.createElement('th');
  usersColumnMonth.textContent = 'Number of Registered Users';
  headerRowDay.appendChild(dayColumn);
  headerRowMonth.appendChild(monthColumn);
  headerRowDay.appendChild(usersColumnDay);
  headerRowMonth.appendChild(usersColumnMonth);
  table1.appendChild(headerRowDay);
  table2.appendChild(headerRowMonth);

  for (const data of dataArray) {
    const row = document.createElement('tr');
    const dayCell = document.createElement('td');
    dayCell.textContent = data.date;
    const usersCell = document.createElement('td');
    usersCell.textContent = data.users;
    row.appendChild(dayCell);
    row.appendChild(usersCell);
    table1.appendChild(row);
  }
  for (const data of monthArray) {
    const row = document.createElement('tr');
    const monthCell = document.createElement('td');
    monthCell.textContent = data.date;
    const usersCellMonth = document.createElement('td');
    usersCellMonth.textContent = data.users;
    row.appendChild(monthCell);
    row.appendChild(usersCellMonth);
    table2.appendChild(row);
  }
  if (div1 && div2) {
    div1.appendChild(table1);
    div2.appendChild(table2);
  }
};

buildTablePerDayAndMonth(dataArray, monthArray);

// eslint-disable-next-line no-shadow
const buildTableForCredits = (dataArray1, dataArry2) => {
  const day = document.getElementById('tablesPerDayPerUser');
  const month = document.getElementById('tablesPerMonthPerUser');

  const tableDay = document.createElement('table');
  const tableMonth = document.createElement('table');

  const headerRowDay = document.createElement('tr');
  const headerRowMonth = document.createElement('tr');

  const nameColumnDay = document.createElement('th');
  nameColumnDay.textContent = 'Name';
  const nameColumnMonth = document.createElement('th');
  nameColumnMonth.textContent = 'Name';
  const dateColumnDay = document.createElement('th');
  dateColumnDay.textContent = 'Date';
  const dateColumnMonth = document.createElement('th');
  dateColumnMonth.textContent = 'Month';

  const creditsColumnDay = document.createElement('th');
  creditsColumnDay.textContent = 'Total Credits Used';
  const creditsColumnMonth = document.createElement('th');
  creditsColumnMonth.textContent = 'Total Credits Used';
  headerRowDay.appendChild(nameColumnDay);
  headerRowDay.appendChild(dateColumnDay);
  headerRowDay.appendChild(creditsColumnDay);
  headerRowMonth.appendChild(nameColumnMonth);
  headerRowMonth.appendChild(dateColumnMonth);
  headerRowMonth.appendChild(creditsColumnMonth);
  tableDay.appendChild(headerRowDay);
  tableMonth.appendChild(headerRowMonth);

  for (const data of dataArray1) {
    const rowDay = document.createElement('tr');
    const nameCellDay = document.createElement('td');
    nameCellDay.textContent = data.name;
    const dateCellDay = document.createElement('td');
    dateCellDay.textContent = data.date;
    const creditsCellDay = document.createElement('td');
    creditsCellDay.textContent = data.credits;
    rowDay.appendChild(nameCellDay);
    rowDay.appendChild(dateCellDay);
    rowDay.appendChild(creditsCellDay);
    tableDay.appendChild(rowDay);
  }
  for (const data of dataArray2) {
    const rowMonth = document.createElement('tr');
    const nameCellMonth = document.createElement('td');
    nameCellMonth.textContent = data.name;
    const dateCellMonth = document.createElement('td');
    dateCellMonth.textContent = data.date;
    const creditsCellMonth = document.createElement('td');
    creditsCellMonth.textContent = data.credits;
    rowMonth.appendChild(nameCellMonth);
    rowMonth.appendChild(dateCellMonth);
    rowMonth.appendChild(creditsCellMonth);
    tableMonth.appendChild(rowMonth);
  }

  day.appendChild(tableDay);
  month.appendChild(tableMonth);
};

// Define the data array for total credits usage per day per user
const dataArray1 = [
  {
    name: 'Alice',
    date: 'January 1, 2021',
    credits: 10,
  },
  {
    name: 'Bob',
    date: 'January 1, 2021',
    credits: 20,
  },
  {
    name: 'Charlie',
    date: 'January 1, 2021',
    credits: 30,
  },
  {
    name: 'Alice',
    date: 'January 2, 2021',
    credits: 15,
  },
  {
    name: 'Bob',
    date: 'January 2, 2021',
    credits: 25,
  },
  {
    name: 'Charlie',
    date: 'January 2, 2021',
    credits: 35,
  },
  // ...
];
const dataArray2 = [
  {
    name: 'Alice',
    date: 'January 2021',
    credits: 100,
  },
  {
    name: 'Bob',
    date: 'January 2021',
    credits: 200,
  },
  {
    name: 'Charlie',
    date: 'January 2021',
    credits: 300,
  },
  {
    name: 'Alice',
    date: 'February 2021',
    credits: 150,
  },
  {
    name: 'Bob',
    date: 'February 2021',
    credits: 250,
  },
  {
    name: 'Charlie',
    date: 'February 2021',
    credits: 350,
  },
  // ...
];

// Build the table for total credits usage per day per user
buildTableForCredits(dataArray1, dataArray2);

async function getMonthlyExperiments(month, year) {
  const months = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };
  const url = `https://core-team-final-assignment.onrender.com/bi/experiments/${months[month]}/${year}`;
  try {
    const response = await fetch(url);
    const dataExperiments = await response.json();
    console.log('in Fetch: ', dataExperiments);
    return dataExperiments;
  } catch (error) {
    console.error(error);
  }

  const printMonthAndYear = async () => {
    const MandY = [{
      type: '',
      value: await getMonthlyExperiments(),
    }, {
      type: 'ARR',
      value: await getARR(),
    }];
    const generateMonthAndyearExperiment = (data) => {
      let html = '';
      html += '<div id="mrr-arr">';
      html += '<table>';
      html += '<tr>';
      html += '<th>Month</th>';
      html += '<th>Year</th>';
      html += '</tr>';
      for (const datum of data) {
        html += '<tr>';
        html += `<td>${datum.value}</td>`;
        html += `<td>${datum.value}</td>`;
        html += '</tr>';
      }
      html += '</table>';
      html += '</div>';
      return html;
    };
    const container = document.getElementById('container');
    container.innerHTML = generateMARR(MArr);
  };
}

const requestData = {
  deviceDistribution: {
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36': 10,
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15': 5,
    'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Mobile Safari/537.36': 3,
  },
  geoDistribution: {
    'United States': 7,
    'United Kingdom': 4,
    India: 3,
  },
};

document.getElementById('device-distribution').textContent = JSON.stringify(requestData.deviceDistribution, null, 2);
document.getElementById('geo-distribution').textContent = JSON.stringify(requestData.geoDistribution, null, 2);

async function getMRR() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // months are zero-indexed, so we need to add 1
  const currentYear = currentDate.getFullYear();
  const url = `https://core-team-final-assignment.onrender.com/bi/MRR/${currentMonth}/${currentYear}`;
  try {
    const response = await fetch(url);
    const dataMRR = await response.json();
    return dataMRR;
  } catch (error) {
    console.error(error);
  }
}

async function getARR() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const url = `https://core-team-final-assignment.onrender.com/bi/ARR/${currentYear}`;
  try {
    const response = await fetch(url);
    const dataARR = await response.json();
    return dataARR;
  } catch (error) {
    console.error(error);
  }
}

const printMRR = async () => {
  const MArr = [{
    type: 'MRR',
    value: await getMRR(),
  }, {
    type: 'ARR',
    value: await getARR(),
  }];

  const generateMARR = (data) => {
    let html = '';
    html += '<div id="mrr-arr">';
    html += '<table>';
    html += '<tr>';
    html += '<th>Type</th>';
    html += '<th>Value</th>';
    html += '</tr>';
    for (const datum of data) {
      html += '<tr>';
      html += `<td>${datum.type}</td>`;
      html += `<td>${datum.value}</td>`;
      html += '</tr>';
    }
    html += '</table>';
    html += '</div>';
    return html;
  };
  const container = document.getElementById('container');
  container.innerHTML = generateMARR(MArr);
};
printMRR();

async function getPayments() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // months are zero-indexed, so we need to add 1
  const currentYear = currentDate.getFullYear();
  const url = `https://core-team-final-assignment.onrender.com/bi/payments/${currentMonth}/${currentYear}`;
  try {
    const response = await fetch(url);
    const dataPayments = await response.json();
    return dataPayments;
  } catch (error) {
    console.log(error);
  }
}

const printSuccessAndFailed = async () => {
  const payments = await getPayments();
  const paymentData = {
    succeeded: payments.success,
    failed: payments.fail,
  };

  const generatePaymentView = (paymentData) => {
    let html = '';
    html += '<div id="payment-data">';
    html += '<table>';
    html += '<tr>';
    html += '<th>Type</th>';
    html += '<th>Count</th>';
    html += '</tr>';
    for (const key in paymentData) {
      html += '<tr>';
      html += `<td>${key}</td>`;
      html += `<td>${paymentData[key]}</td>`;
      html += '</tr>';
    }
    html += '</table>';
    html += '</div>';
    return html;
  };
  const wrapper = document.getElementById('wrapper');
  wrapper.innerHTML = generatePaymentView(paymentData);
};
printSuccessAndFailed();
