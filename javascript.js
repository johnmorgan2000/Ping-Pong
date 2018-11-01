let main = document.querySelector("main");

function renderHomePage(main) {
    let page = document.getElementById("homePage").innerHTML;
    main.innerHTML = page;
}

renderHomePage(main);
