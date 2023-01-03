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

const matchPass = document.getElementById('matchPass');
const newPassword = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');

if (matchPass) {
    matchPass.addEventListener('click', () => {
        if (newPassword.value == confirmPassword.value) {
            return true;
        }
        alert('Password must be same!');
        return false;
    });
}
// Cancellation of sending a form before confirmation of the email
$(document).ready(() => {
    $(document).on('submit', '#sign-up', () =>
        // do your things
        false);
});

$('#pass, #repass').on('keyup', () => {
    if ($('#pass').val() == $('#repass').val()) {
        $('#message').html('Matching').css('color', 'green');
        $('#openEmailConfirmation').prop('disabled', false);
    } else {
        $('#message').html('Not Matching').css('color', 'red');
        $('#openEmailConfirmation').prop('disabled', true);
    }
});

const loginData = async () => {
    const data = {
        email: document.getElementById('userEmail').value,
        password: document.getElementById('userPass').value,
    };
    const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',

        },
        body: JSON.stringify(data),
    });

    const body = await response.json();
    console.log(body.message);
};

const signUpData = async () => {
    const data = {
        email: document.getElementById('newUserEmail').value,
        password: document.getElementById('repass').value,
        name: document.getElementById('newUsername').value,
    };
    const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const body = await response.json();
    console.log(body.message);
};
const forgotPassweord = async () => {
    const email = document.getElementById('newUserEmail').value;
    const data = {
        email,
    };
    const response = await fetch(`http://localhost:5000/auth/password/${email}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const body = await response.json();
    console.log(body.message);
};
const emailConfirmation = async () => {
    const data = {
        email: document.getElementById('newUserEmail').value,
        password: document.getElementById('repass').value,
        name: document.getElementById('newUsername').value,
        code: document.getElementById('OTPtext').value,
    };
    const response = await fetch('http://localhost:5000/auth//register/code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const body = await response.json();
    console.log(body.message);
};
