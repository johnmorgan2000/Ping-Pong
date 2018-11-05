var PAGE_DATA = {};

let main = document.querySelector("main");

function renderPage(main, id) {
    let page = document.getElementById(id).innerHTML;
    main.innerHTML = page;
}

function renderHomePage(main, PAGE_DATA) {
    renderPage(main, "homePage");

    let signUpBtn = document.querySelector("#signUpBtn");
    let loginBtn = document.querySelector("#loginBtn");

    signUpBtn.addEventListener("click", () => {
        renderPage(main, "registerPage");
        document.querySelector("button").addEventListener("click", event => {
            event.preventDefault();
            signUp(PAGE_DATA);
        });
    });

    loginBtn.addEventListener("click", () => {
        renderPage(main, "loginPage");
        document.querySelector("button").addEventListener("click", event => {
            event.preventDefault();
            login(PAGE_DATA);
        });
    });
}

function signUp(data) {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let passwordRepeat = document.querySelector("#passwordRepeat").value;
    fetch(`https://bcca-pingpong.herokuapp.com/api/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=ulf-8"
        },
        body: JSON.stringify({
            username: username,
            password: password,
            password_repeat: passwordRepeat
        })
    })
        .then(response => response.json())
        .then(obj => {
            data.token = obj.token;
            data.username = username;
            renderUserHome(main, PAGE_DATA);
        })
        .catch(e => {
            console.log(e);
            console.log(e.message);
        });
}

function login(data) {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    fetch(`https://bcca-pingpong.herokuapp.com/api/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=ulf-8"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => response.json())
        .then(obj => {
            data.token = obj.token;
            data.username = username;
            renderUserHome(main, PAGE_DATA);
        })
        .catch(e => {
            console.log(e);
            console.log(e.message);
        });
}

function getUsers(token, PAGE_DATA) {
    return fetch("https://bcca-pingpong.herokuapp.com/api/users/", {
        method: "GET",
        headers: { Authorization: `Token ${token}` }
    })
        .then(response => response.json())
        .then(obj => {
            return (PAGE_DATA.users = obj);
        })
        .catch(e => {
            console.log(e);
            console.log(e.message);
        });
}

function displayUsers(PAGE_DATA, div) {
    for (o of PAGE_DATA.users) {
        let span = document.createElement("div");
        let text = document.createTextNode(o.username);
        span.appendChild(text);
        span.classList.add("col-4");
        div.appendChild(span);
    }
}

function renderUserHome(main, PAGE_DATA) {
    var source = document.getElementById("userHomePage").innerHTML;
    var template = Handlebars.compile(source);

    getUsers(PAGE_DATA.token, PAGE_DATA).then(() => {
        console.log(PAGE_DATA.users);
        var html = template({
            user: PAGE_DATA.username
        });
        main.innerHTML = html;
        displayUsers(PAGE_DATA, document.querySelector("#selectPlayers"));

        document.querySelector("#newGameBtn").addEventListener("click", () => {
            PAGE_DATA.player_1 = document.querySelector("#player_1").value;
            PAGE_DATA.player_2 = document.querySelector("#player_2").value;
            renderNewGame(PAGE_DATA);
        });
    });
}

function renderNewGame(PAGE_DATA) {
    fetch("https://bcca-pingpong.herokuapp.com/api/new-game/", {
        method: "Post",
        headers: {
            Authorization: `Token ${PAGE_DATA.token}`
        },
        body: JSON.stringify({
            player_1: PAGE_DATA.player_1,
            player_2: PAGE_DATA.player_2
        })
    })
        .then(response => response.json())
        .then(obj => {
            console.log(obj);
            var source = document.getElementById("gameWindow").innerHTML;
            var template = Handlebars.compile(source);
            var html = template({
                player1: PAGE_DATA.player_1,
                player2: PAGE_DATA.player_2
            });
            let block = document.querySelector("#gameArea");
            block.innerHTML = html;
        });
}

function decreaseScore(playerScoreDiv) {
    let div = document.querySelector(playerScoreDiv);
    let score = Number(div.innerHTML);
    if (score != 0) {
        score -= 1;
        div.innerHTML = score;
    }
}

function increaseScore(playerScoreDiv) {
    let div = document.querySelector(playerScoreDiv);
    let score = Number(div.innerHTML);
    score += 1;
    div.innerHTML = score;
}

renderHomePage(main, PAGE_DATA);
