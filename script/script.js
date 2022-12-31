const Accounts = [
    { profile: "Monte Falco", VatNo: 1658, Created: "Parco Foreste Casentinesi", Status: "Active", Edit: null },
    { profile: "Monte Falterona", VatNo: 1654, plCreatedace: "Parco Foreste Casentinesi", Status: "suspended", Edit: null  },
    { profile: "Poggio Scali", VatNo: 1520, Created: "Parco Foreste Casentinesi", Status: "active", Edit: null  },
    { profile: "Pratomagno", VatNo: 1592, Created: "Parco Foreste Casentinesi", Status: "close", Edit: null  },
    { profile: "Monte Amiata", VatNo: 1738, Created: "Siena",  Status: "suspended", Edit: null  }
];
const generateTableHead = (table, data) => {
    const thead = table.createTHead();
    const row = thead.insertRow();
    for (const key of data) {
        const th = document.createElement("th");
        const text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}
const generateTable = (table, data) => {
    for (const element of data) {
        const row = table.insertRow();
        for (const key in element) {
            const cell = row.insertCell();
            const text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}
// Cant Add btn to edit column;

const table = document.querySelector("table");
const data = Object.keys(Accounts[0]);
generateTableHead(table, data);
generateTable(table, Accounts);
