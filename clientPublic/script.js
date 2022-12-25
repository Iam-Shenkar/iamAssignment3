//login
const SubmitLoginForm = document.getElementById("loginBut");
const SubmitReq = document.getElementById("reqBut")

SubmitLoginForm.addEventListener('click', async () => {
    const data = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    }
    // const response =
    await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": ""
        },
        body: JSON.stringify(data)
    }, response => {
        console.log("in fetch:" + response.headers)
    }).then(response => {
        console.log(response.headers.get('authorization'))
    })


    // const body = await response.json();
    // console.log(response.headers)
    document.getElementById("Request-tokenAcss").value = body.refreshToken
    //document.getElementById("Request-tokenRefrsh").value = response.headers
})

SubmitReq.addEventListener('click', async () => {
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

