//login
const SubmitLoginForm = document.getElementById("loginBut");


SubmitLoginForm.addEventListener('click', async () => {
    const data = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
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