const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = {};

function showModal() {
    modal.classList.add("show-modal");
    websiteNameEl.focus();
}

modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () => modal.classList.remove("show-modal"));
window.addEventListener("click", (event) => event.target === modal ? modal.classList.remove("show-modal") : false);

// Validate Form

/**
 * @param  {string} nameValue
 * @param  {string} urlValue
 */
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert("Please submit values for both fields.");
        return false;
    }
    if (!urlValue.match(regex)) {
        alert("Please, provide a valid web address.");
        return false;
    }

    return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
    // Remove all bookmarks elements
    bookmarksContainer.textContent = "";
    Object.keys(bookmarks).forEach((id) => {
        const { name, url } = bookmarks[id];
        // Item
        const item = document.createElement("div");
        item.classList.add("item");
        // Close Icon
        const closeIcon = document.createElement("i");
        closeIcon.classList.add("fas", "fa-times");
        closeIcon.setAttribute("title", "Delete Bookmark");
        closeIcon.setAttribute("onclick", `deleteBookmark("${id}")`);
        // Favicon / Link container
        const linkInfo = document.createElement("div");
        linkInfo.classList.add("name");
        // Favicon
        const favicon = document.createElement("img");
        favicon.setAttribute("src", `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute("alt", "Favicon");
        // Link
        const link = document.createElement("a");
        link.setAttribute("href", `${url}`);
        link.setAttribute("target", "_blank");
        link.textContent = name;
        // Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

// Fetch bookmarks
function fetchBookmarks() {
    // Get bookmarks from localStorage if available
    if (localStorage.getItem("bookmarks")) {
        bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    } else {
        // Create bookmarks array in localStorage
        const id = "https://jacinto.design";
        bookmarks[id] = {
            name: "Jacinto Design",
            url: "https://jacinto.design"
        };
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Delete bookmaark
function deleteBookmark(id) {
    if (bookmarks[id]) {
        delete bookmarks[id];
    }
    // Update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Handle data from form
function storeBookmark(e) {
    e.preventDefault(); // Чтобы предотвратить перезагрузку страницы после отправки формы
    console.log(e);
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes("http://", "https://")) {
        urlValue = `https://${urlValue}`;
    }
    console.log(nameValue, urlValue);
    if (!validate(nameValue, urlValue)) {
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks[urlValue] = bookmark;
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

bookmarkForm.addEventListener("submit", storeBookmark);

// On load, fetch bookmarks
fetchBookmarks();