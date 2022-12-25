//login
let accessToken;
let refreshToken;

const SubmitLoginForm = document.getElementById("loginBut");
const SubmitReq = document.getElementById("reqBut")
const logout = document.getElementById("logout")

SubmitLoginForm.addEventListener('click', async () => {
        const data = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
        }
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        const body = await response.json();
        console.log(response.headers)
        accessToken = body.accessToken;
        refreshToken = body.refreshToken
        document.getElementById("Request-tokenAcss").value = accessToken
        document.getElementById("Request-tokenRefrsh").value = refreshToken
        if (response.status === 200) {
            document.getElementById("textarea").value = "Login succeeded"
        } else {
            document.getElementById("textarea").value = "Login failed"
        }
    }
)

SubmitReq.addEventListener('click', async () => {
    const data = {
        email: "dkracheli135@gmail.com",
        password: "Sima9542",
        refreshToken: document.getElementById("Request-tokenRefrsh").value
    }
    console.log(JSON.stringify(data));
    const response = await fetch("http://localhost:5000/homePage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": document.getElementById("Request-tokenAcss").value
        },
        body: JSON.stringify(data)
    })
    const body = await response.json();
    if (accessToken === document.getElementById("Request-tokenAcss").value) {
        document.getElementById("textarea").value = "token is valid"
    } else {
        document.getElementById("textarea").value = "Token Not Valid"
    }

    if (response.status === 200) {
        accessToken = body.accessToken;
        document.getElementById("Request-tokenAcss").value = accessToken
    } else {
        document.getElementById("Request-tokenAcss").value = "Unauthorized"
        document.getElementById("Request-tokenRefrsh").value = "Unauthorized"

    }


})

logout.addEventListener('click', async () => {
    document.getElementById("Request-tokenAcss").value = "Unauthorized"
    document.getElementById("Request-tokenRefrsh").value = "Unauthorized"
    document.getElementById("textarea").value = "logout"
})
