/**
 * Initializes the webpage by including HTML content, setting user initials, and highlighting the active sidebar item.
 * @param {string} sideBarId - The ID of the sidebar item to highlight as active.
 * @async
 */
async function init(sideBarId) {
    await includeHTML();
    await setUserInitialsInHeaderTemplateButton();
    await setBackgroundToActiveSideBar(sideBarId);
}

/**
 * Includes external HTML into elements with the "w3-include-html" attribute, fetching the content from the specified file.
 * @async
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = "Page not found";
        }
    }
}

/**
 * Sets the user's initials on a specific button element intended for displaying user information.
 * The initials are extracted from the user's name stored in a web storage item named 'user'.
 * @async
 */
async function setUserInitialsInHeaderTemplateButton() {
    let button = document.getElementById("user-button-initials");
    let user = JSON.parse(await getItem("user"));
    if (button && user.name) {
        button.innerHTML = user.name
            .split(" ")
            .map((part) => part[0].toUpperCase())
            .join("");
    }
}

/**
 * Applies a background style to the active sidebar item based on the provided ID.
 * @param {string} sideBarId - The ID of the sidebar item to activate.
 */
async function setBackgroundToActiveSideBar(sideBarId) {
    if (sideBarId.trim() !== "") {
        switch (sideBarId) {
            case "summary":
                document.getElementById(sideBarId).classList.add("navButtonBackGroundActive");
                break;
            case "Contacts":
                document.getElementById(sideBarId).classList.add("navButtonBackGroundActive");
                break;
            case "addTask":
                document.getElementById(sideBarId).classList.add("navButtonBackGroundActive");
                break;
            case "Board":
                document.getElementById(sideBarId).classList.add("navButtonBackGroundActive");
            default:
                break;
        }
    }
}
