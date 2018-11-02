let main = document.querySelector("main");

function renderPage(main, id) {
    let page = document.getElementById(id).innerHTML;
    main.innerHTML = page;
}

function renderHomePage(main) {
    renderPage(main, "homePage");

    let signUpBtn = document.querySelector("#signUpBtn");
    let loginBtn = document.querySelector("#loginBtn");

    signUpBtn.addEventListener("click", () => {
        renderPage(main, "registerPage");
        document.querySelector("button").addEventListener("click", event => {
            event.preventDefault();
            signUp();
        });
    });

    loginBtn.addEventListener("click", () => {
        renderPage(main, "loginPage");
        document.querySelector("button").addEventListener("click", event => {
            event.preventDefault();
            login();
        });
    });
}

function signUp() {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let passwordRepeat = document.querySelector("#passwordRepeat").value;
    fetch(`https://bcca-pingpong.herokuapp.com/api/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json.charset=ulf-8"
        },
        body: JSON.stringify({
            username: username,
            password: password,
            password_repeat: passwordRepeat
        })
    })
        .then(response => response.json())
        .then(obj => {
            console.log(obj);
        })
        .catch(e => {
            console.log(e);
            console.log(e.message);
        });
}

function login() {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    fetch(`https://bcca-pingpong.herokuapp.com/api/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json.charset=ulf-8"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => {
            console.log(response);
        })
        .catch(e => {
            console.log(e);
            console.log(e.message);
        });
}

renderHomePage(main);
