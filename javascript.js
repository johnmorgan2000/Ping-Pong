var PAGE_DATA = {};

let main = document.querySelector("main");

// A small function the inserts a simple template
function renderPage(main, id) {
    let page = document.getElementById(id).innerHTML;
    main.innerHTML = page;
}

// Inserts the Home Page where the user can click signin or login
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

// Gets the Token for the user signing up and renders the User Home Page
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

//Gets the Token for the user login and renders the User Home Page
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

// fetches all the users for the site
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

// Displays all the users onto the page in the form of divs
function displayUsers(PAGE_DATA, div) {
    for (o of PAGE_DATA.users) {
        let span = document.createElement("div");
        let text = document.createTextNode(o.username);
        span.appendChild(text);
        span.classList.add("col-4");
        div.appendChild(span);
    }
}

// Creates the user home page where you can input players and get them validated then start a new game
function renderUserHome(main, PAGE_DATA) {
    getUsers(PAGE_DATA.token, PAGE_DATA).then(() => {
        userHomeTemplate(main, PAGE_DATA);

        let input1 = document.querySelector("#player_1");
        let input2 = document.querySelector("#player_2");

        validatePlayerInput(PAGE_DATA, input1);
        validatePlayerInput(PAGE_DATA, input2);

        PAGE_DATA.player_1 = {};
        PAGE_DATA.player_2 = {};

        document.querySelector("#newGameBtn").addEventListener("click", () => {
            PAGE_DATA.player_1.name = document.querySelector("#player_1").value;
            PAGE_DATA.player_2.name = document.querySelector("#player_2").value;
            renderNewGame(PAGE_DATA);
        });
    });
}

// Inserts the user home page template
function userHomeTemplate(main, PAGE_DATA) {
    var source = document.getElementById("userHomePage").innerHTML;
    var template = Handlebars.compile(source);
    var html = template({
        user: PAGE_DATA.username
    });
    main.innerHTML = html;
    displayUsers(PAGE_DATA, document.querySelector("#selectPlayers"));
}

// validates the player input if the player is valid
function validatePlayerInput(PAGE_DATA, input) {
    input.addEventListener("input", () => {
        if (validPlayer(PAGE_DATA, input.value)) {
            input.classList.remove("invalid");
            input.classList.add("valid");
        } else {
            input.classList.remove("valid");
            input.classList.add("invalid");
        }
    });
}

// Checks if the player is valid
function validPlayer(PAGE_DATA, player) {
    for (obj of PAGE_DATA.users) {
        if (player == obj.username) {
            return true;
        }
    }
}

// returns the id of the name given
function getPlayerId(PAGE_DATA, name) {
    for (user of PAGE_DATA.users) {
        if (user.username == name) {
            return user.id;
        }
    }
}

//
function renderNewGame(PAGE_DATA) {
    PAGE_DATA.player_1.id = getPlayerId(PAGE_DATA, PAGE_DATA.player_1.name);
    PAGE_DATA.player_2.id = getPlayerId(PAGE_DATA, PAGE_DATA.player_2.name);

    console.log(PAGE_DATA.player_1.id);

    fetch("https://bcca-pingpong.herokuapp.com/api/new-game/", {
        method: "Post",
        headers: {
            Authorization: `Token ${PAGE_DATA.token}`
        },
        body: JSON.stringify({
            player_1: PAGE_DATA.player_1.id,
            player_2: PAGE_DATA.player_2.id
        })
    })
        .then(response => response.json())
        .then(obj => {
            console.log(obj);
            newGameTemplate();

            PAGE_DATA.points = [];
            let player_1Btns = document.querySelectorAll("#player1 buttons");
            let player_2Btns = document.querySelectorAll("#player2 buttons");

            playerScore(PAGE_DATA, player_1Btns, PAGE_DATA.player_1.id);

            playerScore(PAGE_DATA, player_2Btns, PAGE_DATA.player_2.id);
            console.log(PAGE_DATA.points);
        });
}

// inserts the newGame template
function newGameTemplate() {
    var source = document.getElementById("gameWindow").innerHTML;
    var template = Handlebars.compile(source);
    var html = template({
        player1: PAGE_DATA.player_1.name,
        player2: PAGE_DATA.player_2.name
    });
    let block = document.querySelector("#gameArea");
    block.innerHTML = html;
}

// adds or subtracts the player id to the points array
function playerScore(PAGE_DATA, buttons, playerId) {
    for (const btn of buttons) {
        btn.addEventListener("click", () => {
            if (btn.classList.contains("up")) {
                PAGE_DATA.points.push(playerId);
            } else if (btn.classList.contains("down")) {
                let index = PAGE_DATA.points.indexOf(playerId);
                if (index > -1) {
                    PAGE_DATA.points.splice(index, 1);
                }
            }
        });
    }
}

// Changes the displayed number
function decreaseScore(playerScoreDiv) {
    let div = document.querySelector(playerScoreDiv);
    let score = Number(div.innerHTML);
    if (score != 0) {
        score -= 1;
        div.innerHTML = score;
    }
}

//changes the displayed number
function increaseScore(playerScoreDiv) {
    let div = document.querySelector(playerScoreDiv);
    let score = Number(div.innerHTML);
    score += 1;
    div.innerHTML = score;
}

renderHomePage(main, PAGE_DATA);
