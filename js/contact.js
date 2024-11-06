/**
 * Array to store old contact information.
 * @type {Array<{name: string, email: string, tel: string, bg: string, selected: boolean}>}
 */
let contacts = [];

/**
 * Stores letters for contact sorting or other operations.
 * @type {Array<string>}
 */
let letters = [];

/**
 * Holds the selected name from the contact list.
 * @type {string}
 */
let selectedName;

/**
 * Indicates whether a contact detail view is open.
 * @type {boolean}
 */
let openContact = false;

/**
 * Index of the currently selected contact in the oldContacts array.
 * @type {number}
 */
let selectedContactIndex;


let loggedUser;


/**
 * Initializes contacts by loading them from storage and rendering.
 * @async
 */
async function initContacts() {
    this.loggedUser = getUserFromLocalStorage();
    if (this.loggedUser) {
        console.log(this.loggedUser);
        await renderContacts();
    }
    else
        window.location.href = "../../html/user-login/log-in.html";
}

/**
 * Adds input formatting for the telephone input field upon DOM content loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("contact-tel").addEventListener("input", function () {
        if (this.value.startsWith("+")) this.value = "+" + this.value.slice(1).replace(/[^0-9]/g, "");
        else this.value = this.value.replace(/[^0-9]/g, "");
    });
});

/**
 * Renders the old contacts in the contact list.
 */
async function renderContacts() {
    contacts = await getContactsRequest();
    let renderContact = document.getElementById("contactName");
    let currentLetter = null;
    renderContact.innerHTML = "";
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    getVariablesToRender(renderContact, currentLetter);
}


async function getContactsRequest() {
    let token = this.loggedUser.token;
    let connectionString = "http://localhost:8000/api/auth/Profile/";

    let response = await fetch(connectionString, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    return response;
}


/**
 * Iterates through oldContacts to render each contact.
 * @param {HTMLElement} renderContact - The container element to render contacts into.
 * @param {string|null} currentLetter - The current letter grouping for sorting contacts.
 */
function getVariablesToRender(renderContact, currentLetter) {
    for (let i = 0; i < contacts.length; i++) {
        const oldContact = contacts[i];
        let name = oldContact["name"];
        let mail = oldContact["email"];
        let bg = oldContact["bg"];
        name = name.charAt(0).toUpperCase() + name.slice(1);
        let initials = name
            .split(" ")
            .map((n) => n[0])
            .join("");
        let sortedByLetter = name.charAt(0);

        if (sortedByLetter !== currentLetter) {
            currentLetter = sortedByLetter;
            renderContact.innerHTML += generateRegisterHTML(sortedByLetter);
        }
        renderContact.innerHTML += renderContactToRegister(i, bg, initials, name, mail);
    }
}

/**
 * Displays contact details in a detailed view.
 * @param {number} i - The index of the contact in the oldContacts array.
 */
function showContact(i) {
    document.querySelectorAll(".contact-item").forEach((item) => {
        item.classList.remove("setUserproperty");
    });
    document.getElementById("contact" + i).classList.add("setUserproperty");
    document.getElementById("resize-contact").classList.remove("d-none");
    selectedName = contacts[i];
    let name = selectedName["name"];
    let mail = selectedName["email"];
    let number = selectedName["tel"];
    let bg = selectedName["bg"];
    let initials = name
        .split(" ")
        .map((n) => n[0])
        .join("");
    let letter = name.charAt(0);
    letters.push(letter);
    let contact = document.getElementById("open-contact");
    contact.classList.remove("d-none");
    contact.innerHTML = "";
    contact.innerHTML += generateHTMLshowContact(name, mail, number, bg, initials, i);
}

/**
 * Toggles the display of a contact's detailed view.
 * @param {number} i - The index of the contact in the oldContacts array to toggle.
 */
function toggleContact(i) {
    if (window.innerWidth >= 1350) {
        if (openContact && selectedContactIndex === i) {
            document.getElementById("open-contact").classList.add("d-none");
            openContact = false;
            document.querySelectorAll(".contact-item").forEach((item) => {
                item.classList.remove("setUserproperty");
            });
        } else {
            showContact(i);
            openContact = true;
            selectedContactIndex = i;
        }
    } else {
        showContact(i);
        document.querySelectorAll(".contact-item").forEach((item) => {
            item.classList.remove("setUserproperty");
        });
    }
}

/**
 * Creates a new contact and adds it to the contact list.
 * @async
 */
async function createContact() {
    let selected = false;
    let x = Math.floor(Math.random() * 255);
    let y = Math.floor(Math.random() * 255);
    let z = Math.floor(Math.random() * 255);

    let newContact = {
        name: document.getElementById("contact-name").value,
        email: document.getElementById("contact-email").value,
        tel: document.getElementById("contact-tel").value,
        bg: `rgb(${x},${y},${z})`,
        selected,
    };

    contacts = contacts.concat(newContact);
    await setItem("oldContacts", JSON.stringify(contacts));
    renderContacts();
    closePopUp();
}

/**
 * Saves changes to an existing contact.
 * @param {number} i - The index of the contact in the oldContacts array to save.
 */
async function saveContact(i) {
    document.getElementById("edit-pop-up").classList.add("d-none");
    document.getElementById("edit-pop-up").classList.remove("d-flex");

    let newName = document.getElementById("old-name").value;
    let newMail = document.getElementById("old-email").value;
    let newTel = document.getElementById("old-tel").value;

    contacts[i]["name"] = newName;
    contacts[i]["email"] = newMail;
    contacts[i]["tel"] = newTel;

    showContact(i);
    renderContacts();
    await setItem("oldContacts", JSON.stringify(contacts));
}

/**
 * Opens a modal to edit a contact's details.
 * @param {string} name - The contact's name.
 * @param {string} mail - The contact's email.
 * @param {string} number - The contact's telephone number.
 * @param {string} bg - The background color for the contact's display.
 * @param {string} initials - The initials of the contact.
 * @param {number} i - The index of the contact in the oldContacts array.
 */
function editContact(name, mail, number, bg, initials, i) {
    document.getElementById("edit-pop-up").classList.remove("d-none");
    document.getElementById("edit-pop-up").classList.add("d-flex");

    let edit = document.getElementById("edit-pop-up");
    edit.innerHTML = "";
    edit.innerHTML += generateEditContactHTML(bg, initials, name, mail, number, i);
}

/**
 * Deletes a contact from the contact list.
 * @param {number} i - The index of the contact in the oldContacts array to delete.
 */
async function deleteContact(i) {
    contacts.splice(i, 1);
    letters.splice(i, 1);
    document.getElementById("open-contact").classList.add("d-none");
    renderContacts();
    await setItem("oldContacts", JSON.stringify(contacts));
}

/**
 * Opens a popup modal for creating a new contact.
 */
function openPopUp() {
    document.getElementById("pop-up").classList.remove("d-none");
    document.getElementById("pop-up").classList.add("d-flex");
}

/**
 * Closes the popup modal for adding or editing a contact.
 */
function closePopUp() {
    document.getElementById("pop-up").classList.add("d-none");
    document.getElementById("pop-up").classList.remove("d-flex");
    document.getElementById("edit-pop-up").classList.add("d-none");
    document.getElementById("edit-pop-up").classList.remove("d-flex");
    document.getElementById("contact-name").value = "";
    document.getElementById("contact-email").value = "";
    document.getElementById("contact-tel").value = "";
}

/**
 * Opens mobile view for contact name input.
 */
function openMobileName() {
    document.getElementById("resize-contact").classList.remove("d-none-1300");
}

/**
 * Closes the contact view in mobile.
 */
function closeContact() {
    document.getElementById("resize-contact").classList.add("d-none-1300");
}
