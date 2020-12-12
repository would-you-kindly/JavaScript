const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterButton = document.getElementById("twitter");
const newQuoteButton = document.getElementById("new-quote");
const loader = document.getElementById("loader");

// Show loader
function loading() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

// Hide loading
function complete() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

// Get Quote from API
async function getQuote() {
    loading();
    // Без proxy выпадает ошибка запроса
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const api = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=ru&format=json";
    try {
        const response = await fetch(proxy + api);
        const data = await response.json();
        console.log(data);
        if (data.quoteAuthor === "") {
            authorText.innerHTML = "Unknown";
        } else {
            authorText.innerHTML = data.quoteAuthor;
        }
        // Уменьшаем размер шрифта, если длинная цитата
        if (data.quoteText.length > 120) {
            quoteText.classList.add("long-quote");
        } else {
            quoteText.classList.remove("long-quote");
        }
        quoteText.innerHTML = data.quoteText;
        complete();
    } catch (error) {
        getQuote();
        // console.log("Ops, no quote", error);
    }
}

function tweetQuote() {
    const quote = quoteText.innerHTML;
    const author = authorText.innerHTML;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, "_blank");
}

// Event Linsteners
newQuoteButton.addEventListener("click", getQuote);
twitterButton.addEventListener("click", tweetQuote);

// On Load
getQuote();