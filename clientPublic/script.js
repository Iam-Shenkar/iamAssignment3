//login
const SubmitLoginForm = document.getElementById("loginBut");
const smbitReq = document.getElementById("reqBut")
let Db = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJka3JhY2hlbGkxMzVAZ21haWwuY29tIiwiaWF0IjoxNjcxOTAxNTQ5LCJleHAiOjE2NzE5ODc5NDl9.sl_4DpMTKh0Ncp4jEv9lm2Xiv5e0iQmDgx7uH0E9TBM"
let token1
SubmitLoginForm.addEventListener('click', async () => {
    const data = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJka3JhY2hlbGkxMzVAZ21haWwuY29tIiwiaWF0IjoxNjcxOTAxNTQ5LCJleHAiOjE2NzE5ODc5NDl9.sl_4DpMTKh0Ncp4jEv9lm2Xiv5e0iQmDgx7uH0E9TBM",
        email: "dkracheli135@gmail.com",
        password: "Sima9542",
    }
    const response = await fetch("http://localhost:5000/auth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    const body = await response.json();

    token1 = body.accessToken;
    document.getElementById("Request-tokenAcss").value = Db.split(".")[2]
    document.getElementById("Request-tokenRefrsh").value = token1.split(".")[2]
})

smbitReq.addEventListener('click', async () => {
    const data = {

        email: "dkracheli135@gmail.com",
        password: "Sima9542",
        token: token1

    }
    console.log(JSON.stringify(data));
    const response = await fetch("http://localhost:5000/homePage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)

    })
    if (response.status === 200) {

    }
    const body = await response.json();

})

