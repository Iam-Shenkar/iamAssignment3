const selectButton = document.getElementById("SelectButton");
const openRegisterForm = document.getElementById("SelectRegister");
const openLoginForm = document.getElementById("SelectLogin");
const loginForm = document.getElementById("LoginForm");
const registerForm = document.getElementById("RegisterForm");
const backLoginBtn = document.getElementById('backLoginBtn');
const backRegisterBtn = document.getElementById('backRegisterBtn');
const goRegister = document.getElementById('GoRegister');
const goLogin = document.getElementById('GoLogin');
const backForgotBtn = document.getElementById('backForgotBtn');
const forgotPasswordBtn = document.getElementById('forgotPassword');
const ForgotPasswordModel = document.getElementById('ForgotPasswordModel');
const VerifyByEmail = document.getElementById('VerifyByEmail');
const SubmitLoginForm = document.getElementById('SubmitLoginForm');
const submitRegisterForm = document.getElementById('submitRegisterForm');
const SubmitEmailForm = document.getElementById('SubmitEmailForm');
const SubmitOTPForm = document.getElementById('SubmitOTPForm');
const Password = document.getElementById("Password");
const CPassword = document.getElementById("C-Password");
const message = document.getElementById('message');
const googleLogIn = document.getElementById('googleLogIn');
const addUser = document.getElementById('addUser');
const host = window.location.origin


const getUserEmail = () => {
    const email = document.cookie.match("email=[^;]*").toString().split("=")[1].split("%40");
    return email[0] + "@" + email[1];
}

const getUserType = () => {
    const type = document.cookie.match("type=[^;]*").toString().split("=")[1]
    return type;
}


if (selectButton) {

    openLoginForm.addEventListener('click', () => {
        selectButton.style.display = "none";
        loginForm.style.display = "block"
    })

    openRegisterForm.addEventListener('click', () => {
        selectButton.style.display = "none";
        registerForm.style.display = "block";
    })

    backRegisterBtn.addEventListener('click', () => {
        registerForm.style.display = "none";
        loginForm.style.display = "none"
        selectButton.style.display = "block";

    })

    backLoginBtn.addEventListener('click', () => {
        registerForm.style.display = "none";
        loginForm.style.display = "none"
        selectButton.style.display = "block";
    })

    goLogin.addEventListener('click', () => {
        registerForm.style.display = "none";
        loginForm.style.display = "block";
    })

    goRegister.addEventListener('click', () => {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    })

    forgotPasswordBtn.addEventListener('click', () => {
        loginForm.style.display = "none";
        ForgotPasswordModel.style.display = 'block';
    })
    backForgotBtn.addEventListener('click', () => {
        ForgotPasswordModel.style.display = 'none';
        loginForm.style.display = "block";
    })
    googleLogIn.addEventListener('click', () => {
        window.location.href = `${host}/googleLogIn`;
    })

    //login
    SubmitLoginForm.addEventListener('click', async () => {
        const data = {
            email: document.getElementById("L-Email").value,
            password: document.getElementById("L-Password").value,
        };
        const response = await fetch(`${host}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            redirect: "follow",
        })
        if (response.status === 200) {
            window.location.replace("/homePage");
        }
        const body = await response.json();
        if (body.message && response.status != 200) {
            alert((body.message));
        }
    })

    //forgot password
    SubmitEmailForm.addEventListener('click', async () => {
        const data = {
            "email": document.getElementById("forgotEmail").value,
        }
        const response = await fetch(`${host}/forgotPassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const body = await response.json();
        if (body.message) {
            alert((body.message));
            location.reload();
        }
    })

    //  confirm Code
    SubmitOTPForm.addEventListener('click', async () => {
        const data = {
            name: document.getElementById("Username").value,
            email: document.getElementById("Email").value,
            password: document.getElementById("C-Password").value,
            code: document.getElementById("VerifyOTP").value
        };
        const response = await fetch(`${host}/confirmCode`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const body = await response.json();
        if (body.message) {
            alert((body.message));
            location.reload();
        }
    })
    const signupData = async () => {
        const data = {
            name: document.getElementById("Username").value,
            email: document.getElementById("Email").value,
            password: document.getElementById("C-Password").value,
        }
        const response = await fetch(`${host}/signUp`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        const body = await response.json();
        if (body.message && response.status != 200) {
            alert(body.message);
            location.reload();
        }
    }


    submitRegisterForm.addEventListener('click', async () => {
        if ((Password.value === CPassword.value) && (Password.value !== '' && CPassword.value !== '')) {
            registerForm.style.display = "none";
            VerifyByEmail.style.display = 'block';
            await signupData();
            return true;
        } else {
            alert("Please check if :\n\n1. You fill out all the fields\n2. Password isn't empty!\n3. Password are the Same!");
            return false;
        }
    })


    Password && CPassword.addEventListener('keyup', () => {
        if (Password.value !== CPassword.value) {
            message.innerHTML = "Not Matching";
            message.style.color = "red";
        } else {
            message.innerHTML = "Matching";
            message.style.color = "green";
        }
    })

}

/*=============================== create table with  ====================================*/
const showUserBtn = document.getElementById("showUserBtn");
const showUser = document.getElementById("showUsers");
const addUserBtn = document.getElementById('addUserBtn');
const addUsers = document.getElementById('addUsers');
const backAddUsers = document.getElementById('backAddUsers');
const welcomeMessage = document.getElementById('welcomeMessage');
const backShowUsers = document.getElementById('backShowUsers');
const logOutBtn = document.getElementById('logOutBtn');
const userDetailsModel = document.getElementById('userDetailsModel');
const saveUser = document.getElementById('saveUser');
const removeUser = document.getElementById('removeUser');
const changePassword = document.getElementById('savePassword');


if (showUserBtn) {
    if (getUserType() === 'user') {
        document.getElementById("addUserBtn").style.display = "none";
    }

    logOutBtn.addEventListener("click", async () => {
        await fetch(`${host}/logout`);
        window.location.replace(`${host}/index.html`);
    });
    showUserBtn.addEventListener('click', () => {
        if (getUserType() == 'admin') {
            addUsers.style.display = 'none';
            welcomeMessage.style.display = 'none';
            userDetailsModel.style.display = 'none';
            changePasswordModel.style.display = "none";
            showUser.style.display = 'block';
            appendData();
        }
        if (getUserType() == 'user') {
            addUsers.style.display = 'none';
            welcomeMessage.style.display = 'none';
            userDetailsModel.style.display = 'none';
            changePasswordModel.style.display = "none";
            userDetailsModel.style.display = 'block';
            document.getElementById("removeUser").style.display = "none";
            userStatusDetails.readOnly = true;
            userDetails(getUserEmail())
        }
    })

    addUserBtn.addEventListener('click', () => {
        showUser.style.display = 'none';
        welcomeMessage.style.display = 'none';
        userDetailsModel.style.display = 'none';
        changePasswordModel.style.display = "none";
        addUsers.style.display = 'block';
    })
    backAddUsers.addEventListener('click', () => {
        addUsers.style.display = 'none';
        showUser.style.display = 'none';
        userDetailsModel.style.display = 'none';
        changePasswordModel.style.display = "none";
        welcomeMessage.style.display = 'block';
    })
    backShowUsers.addEventListener('click', () => {
        addUsers.style.display = 'none';
        showUser.style.display = 'none';
        userDetailsModel.style.display = 'none';
        changePasswordModel.style.display = "none";
        welcomeMessage.style.display = 'block';
    })

    addUser.addEventListener('click', async () => {
        const data = {
            name: document.getElementById("userFullName").value,
            email: document.getElementById("userEmail").value,
            password: document.getElementById("userPassword").value
        };
        const response = await fetch(`${host}/admin/addUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const body = await response.json();
        if (body.message) {
            alert((body.message));
            location.reload();
        }
    })


    saveUser.addEventListener('click', async () => {
        const suspendedBut = document.querySelector('input[name="userStatus"]:checked').value;
        let suspensionTime = 0
        if (suspendedBut === "suspended")
            suspensionTime = document.getElementById("suspensionTime").value

        const data = {
            name: document.getElementById('userNameDetails').value,
            type: document.getElementById('userPermissions').value,
            email: document.getElementById('userEmailDetails').value,
            status: suspendedBut,
            suspensionTime: suspensionTime
        };
console.log(data)
        const response = await fetch(`${host}/admin/updateUser`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const body = await response.json();
        if (body.message) {
            alert((body.message));
            location.reload();
        }
    });


    removeUser.addEventListener("click", async () => {
        const data = {
            email: document.getElementById('userEmailDetails').value
        }
        const response = await fetch(`${host}/admin/deleteUser`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const body = await response.json();
        if (body.message) {
            alert((body.message));
            location.reload();
        }
    })

    async function appendData() {
        if (document.getElementById("usersTable") === null) {
            const response = await fetch(`${host}/admin/showUsers`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            thead.setAttribute("id", "usersTable");
            const tbody = document.createElement('tbody');
            const userTitle = document.createElement('tr');
            const nameHeading = document.createElement('th');
            nameHeading.innerHTML = "Name";
            const emailHeading = document.createElement('th');
            emailHeading.innerHTML = "E-mail";
            const typeHeading = document.createElement('th');
            typeHeading.innerHTML = "Type";
            const statusHeading = document.createElement('th');
            statusHeading.innerHTML = "Status";
            table.appendChild(thead);
            table.appendChild(tbody);

// Adding the entire table to the body tag
            const myData = document.getElementById("myData").appendChild(table);

            userTitle.appendChild(nameHeading);
            userTitle.appendChild(emailHeading);
            userTitle.appendChild(typeHeading);
            userTitle.appendChild(statusHeading);
            thead.appendChild(userTitle);

            const userDbBtn = document.createElement('button');
            for (let i = 0; i < data.length; i++) {

                const userDbBtn = document.createElement('button');
                let userDb = myData.insertRow(i);
                userDbBtn.classList.add("userDbBtn");
                userDbBtn.setAttribute("onclick", "userDetails(value)");
                userDbBtn.setAttribute('value', data[i].email);
                userDbBtn.setAttribute('type', "button");

                let userDbRow1 = document.createElement('td');
                userDbRow1.innerHTML = data[i].name;
                let userDbRow2 = document.createElement('td');
                userDbRow2.innerHTML = data[i].email;
                let userDbRow3 = document.createElement('td');
                userDbRow3.innerHTML = data[i].type;
                let userDbRow4 = document.createElement('td');
                userDbRow4.innerHTML = data[i].status;
                userDbBtn.innerHTML = "Show User";

                userDb.appendChild(userDbRow1);
                userDb.appendChild(userDbRow2);
                userDb.appendChild(userDbRow3);
                userDb.appendChild(userDbRow4);
                userDb.appendChild(userDbBtn);
                tbody.appendChild(userDb);
            }

            const showUserToEdit = document.querySelectorAll('.userDbBtn');
            for (let i = 0; i < data.length; i++) {
                showUserToEdit[i].addEventListener('click', () => {
                    addUsers.style.display = 'none';
                    showUser.style.display = 'none';
                    userDetailsModel.style.display = 'block';
                })
            }
        } else {
            alert("Users table are up to date");
        }

    }
}

const editUser = document.getElementById('editUser');
const changePasswordUser = document.getElementById("changePasswordUser");
const userNameDetails = document.getElementById("userNameDetails");
const backChangePasswordUsers = document.getElementById("backChangePasswordUsers");
const changePasswordModel = document.getElementById("changePasswordModel");
const userPermissions = document.getElementById('userPermissions');
const userStatusDetails = document.getElementById('userStatusDetails');
const radioUserStatus = document.getElementById('radioUserStatus');
const suspensionModel = document.getElementById('suspensionModel');
const suspensionTime = document.getElementById('suspensionTime');


if (editUser) {
    editUser.addEventListener('click', () => {
        userNameDetails.readOnly = false;
        userPermissions.disabled = false;
        userStatusDetails.readOnly = false;
        userNameDetails.style.backgroundColor = "white";
        userStatusDetails.style.backgroundColor = "white";
        userPermissions.style.backgroundColor = "white";
        removeUser.style.display = "none";
        editUser.style.display = "none";
        saveUser.style.display = "block";
    })
}
if (backChangePasswordUsers) {
    backChangePasswordUsers.addEventListener('click', () => {
        changePasswordModel.style.display = "none";
        addUsers.style.display = 'none';
        showUser.style.display = 'none';
        userDetailsModel.style.display = 'none';
        userDetailsModel.style.display = "none";
        welcomeMessage.style.display = "block";
    })
}
if (changePasswordUser) {
    changePasswordUser.addEventListener('click', () => {
        addUsers.style.display = 'none';
        showUser.style.display = 'none';
        userDetailsModel.style.display = 'none';
        welcomeMessage.style.display = "none";
        changePasswordModel.style.display = "block";
    })
}

const backDetailsUsers = document.getElementById('backDetailsUsers');
if (backDetailsUsers) {
    backDetailsUsers.addEventListener('click', () => {
        addUsers.style.display = 'none';
        userDetailsModel.style.display = 'none';
        changePasswordModel.style.display = "none";
        showUser.style.display = 'block';
        userNameDetails.readOnly = false;
        userPermissions.disabled = false;
        userStatusDetails.readOnly = false;
        saveUser.style.display = "none";
        radioUserStatus.style.display = "none";
        removeUser.style.display = "block";
        editUser.style.display = "block";
        userNameDetails.style.backgroundColor = "rgba(171, 171, 171, 0.37)";
        userStatusDetails.style.backgroundColor = "rgba(171, 171, 171, 0.37)";
        userPermissions.style.backgroundColor = "rgba(171, 171, 171, 0.37)";
        closeTimeModel();
    })
}
if (changePassword) {
    changePassword.addEventListener("click", async () => {
        const data = {
            password: document.getElementById('oldPassword').value,
            newPassword: document.getElementById('newPassword').value
        }
        const response = await fetch(`${host}/changePassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const body = await response.json();
        if (body.message) {
            alert((body.message));
            location.reload();
        }
    })
}


if (saveUser) {
    saveUser.addEventListener('click', () => {
        addUsers.style.display = 'none';
        userDetailsModel.style.display = 'none';
        saveUser.style.display = "none"
        changePasswordModel.style.display = "none";
        userNameDetails.readOnly = true;
        userPermissions.disabled = true;
        userStatusDetails.readOnly = true;
        userNameDetails.style.backgroundColor = "rgba(171, 171, 171, 0.37)";
        showUser.style.display = 'block';
        removeUser.style.display = "block";
        editUser.style.display = "block";
        radioUserStatus.style.display = "none";
        closeTimeModel();
    })
    if (userStatusDetails) {
        userStatusDetails.addEventListener('focus', (event) => {
            if (getUserType() === 'admin')
                radioUserStatus.style.display = "block";
        })
    }

    function openTimeSuspension() {
        suspensionModel.style.display = "block";
        suspensionTime.style.backgroundColor = "white";
    }

    function closeTimeModel() {
        suspensionModel.style.display = "none";
    }
}

const userDetails = async (email) => {
    const response = await fetch(host + '/admin/showUser/' + email, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
    })
    const user = await response.json();
    document.getElementById('userNameDetails').value = user.name;
    document.getElementById('userStatusDetails').value = user.status;
    document.getElementById('userPermissions').value = user.type;
    document.getElementById('userEmailDetails').value = user.email;
    document.getElementById('userLastLoginDetails').value = user.loginDate;
}


