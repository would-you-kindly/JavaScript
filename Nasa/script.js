const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

// NASA API
const count = 10;
const apiKey = "DEMO_KEY";
const api = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page) {
    // Прокручиваем экран к верху
    window.scrollTo({
        top: 0,
        behavior: "instant",
    });
    if (page === "results") {
        resultsNav.classList.remove("hidden");
        favoritesNav.classList.add("hidden");
    } else {
        resultsNav.classList.add("hidden");
        favoritesNav.classList.remove("hidden");
    }
    loader.classList.add("hidden");
}

function updateDOM(page) {
    // Get favorites from localStorage
    if (localStorage.getItem("nasaFavorites")) {
        favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
        console.log(favorites);
    }
    // Перед тем как построить страницу, почистим ее
    imagesContainer.textContent = "";
    createDOMNodes(page);
    showContent(page);
}

function createDOMNodes(page) {
    const currentArray = page === "results" ? resultsArray : Object.values(favorites);
    currentArray.forEach((result) => {
        // Card container
        const card = document.createElement("div");
        card.classList.add("card");
        const link = document.createElement("a");
        link.href = result.hdurl;
        link.title = "View Full Image";
        link.target = "_blank";
        const img = document.createElement("img");
        img.src = result.url;
        img.alt = "NASA Picture of the Day";
        img.loading = "lazy";
        img.classList.add("card-img-top");
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        const title = document.createElement("h5");
        title.classList.add("card-title");
        title.textContent = result.title;
        const addToFavorites = document.createElement("p");
        addToFavorites.classList.add("clickable");
        if (page === "results") {
            addToFavorites.textContent = "Add to Favorites";
            // addToFavorites.onclick = `saveFavorites("${result.url}")`;
            addToFavorites.setAttribute("onclick", `saveFavorite("${result.url}")`);
        } else {
            addToFavorites.textContent = "Remove Favorite";
            addToFavorites.setAttribute("onclick", `removeFavorite("${result.url}")`);
        }
        const text = document.createElement("p");
        text.classList.add("card-text");
        text.textContent = result.explanation;
        const small = document.createElement("small");
        small.classList.add("text-muted");
        const strong = document.createElement("strong");
        strong.textContent = result.date;
        const span = document.createElement("span");
        span.textContent = result.copyright ? ` ${result.copyright}` : "";
        link.append(img);
        small.append(strong, span);
        cardBody.append(title, addToFavorites, text, small);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

function saveFavorite(itemUrl) {
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            // Show save confirmation for 2 secconds
            saveConfirmed.hidden = false;
            // Говорим вызвать функцию через 2 секунды
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            // Set favorites to localStorage
            localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
        }
    });
}

function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
        updateDOM("favorites");
    }
}

// Get 10 Images
async function getNasaPictures() {
    // Show loader
    loader.classList.remove("hidden");
    try {
        const response = await fetch(api);
        resultsArray = await response.json();
        console.log(resultsArray);
        updateDOM("results");
    } catch (error) {

    }
}

getNasaPictures();