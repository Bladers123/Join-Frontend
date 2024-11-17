/**
 * Array to store old contact information.
 * @type {Array<{name: string, email: string, tel: string, backgroundColor: string, selected: boolean}>}
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
    if (this.loggedUser)
        await renderContacts();
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
    let connectionString = "http://localhost:8000/api/profile/contacts";

    try {
        let response = await fetch(connectionString, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + token
            }
        });

        if (!response.ok) {
            // Fehlerstatus prüfen
            let errorText = await response.text();
            console.error("Error loading contacts: ", response.status, errorText);
            throw new Error(`HTTP-Error ${response.status}: ${errorText}`);
        }

        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Network- or Servererror:", error);
    }
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
        let backgroundColor = oldContact["backgroundColor"];
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
        renderContact.innerHTML += renderContactToRegister(i, backgroundColor, initials, name, mail);
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
    let number = selectedName["number"];
    let backgroundColor = selectedName["backgroundColor"];
    let initials = name
        .split(" ")
        .map((n) => n[0])
        .join("");
    let letter = name.charAt(0);
    letters.push(letter);
    let contact = document.getElementById("open-contact");
    contact.classList.remove("d-none");
    contact.innerHTML = "";
    contact.innerHTML += generateHTMLshowContact(name, mail, number, backgroundColor, initials, i);
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
    let isSelected = false;
    let x = Math.floor(Math.random() * 255);
    let y = Math.floor(Math.random() * 255);
    let z = Math.floor(Math.random() * 255);

    let newContact = {
        name: document.getElementById("contact-name").value,
        email: document.getElementById("contact-email").value,
        number: document.getElementById("contact-tel").value,
        backgroundColor: `rgb(${x},${y},${z})`,
        isSelected,
    };

    contacts = contacts.concat(newContact);
    await insertContactToDB(newContact);
    renderContacts();
    closePopUp();
}

async function insertContactToDB(newContact) {
    let conntectionString = "http://localhost:8000/api/profile/contacts/";
    let token = this.loggedUser.token;

    try {
        let response = await fetch(conntectionString, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify(newContact)
        });

        if (!response.ok) {
            let errorText = await response.text();
            console.error("Error insert contact: ", response.status, errorText);
            throw new Error(`HTTP-Error ${response.status}: ${errorText}`);
        }
    }

    catch (error) {
        console.error("Network- or Servererror:", error);
    }

}

async function deleteContactFromDB(contact) {
    let conntectionString = `http://localhost:8000/api/profile/contacts/${contact.id}/`;
    let token = this.loggedUser.token;

    try {
        let response = await fetch(conntectionString, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify(contact)
        });

        if (!response.ok) {
            let errorText = await response.text();
            console.error("Error delete contact: ", response.status, errorText);
            throw new Error(`HTTP-Error ${response.status}: ${errorText}`);
        }
    }

    catch (error) {
        console.error("Network- or Servererror:", error);
    }
}

async function updateContactFromDb(contact) {
    let connectionString = `http://localhost:8000/api/profile/contacts/${contact.id}/`;
    let token = this.loggedUser.token;

    try {
        let response = await fetch(connectionString, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify(contact)
        });

        if (!response.ok) {
            let errorText = await response.text();
            console.error("Error update contact: ", response.status, errorText);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Network- or Servererror:", error);
        return false;
    }
}



/**
 * Saves changes to an existing contact.
 * @param {number} i - The index of the contact in the oldContacts array to save.
 */
async function saveContact(i) {
    let newName = document.getElementById("old-name").value;
    let newMail = document.getElementById("old-email").value;
    let newTel = document.getElementById("old-tel").value;

    let updatedContact = {
        ...contacts[i], // Übernehme bestehende Eigenschaften
        name: newName,
        email: newMail,
        number: newTel
    };

    let success = await updateContactFromDb(updatedContact); // API-Aufruf
    if (success) {
        contacts[i] = updatedContact; // Lokal aktualisieren
        renderContacts(); // Neu rendern
        showContact(i); // Aktualisierte Details anzeigen
    }

    document.getElementById("edit-pop-up").classList.add("d-none");
    document.getElementById("edit-pop-up").classList.remove("d-flex");
}

/**
 * Opens a modal to edit a contact's details.
 * @param {string} name - The contact's name.
 * @param {string} mail - The contact's email.
 * @param {string} number - The contact's telephone number.
 * @param {string} backgroundColor - The background color for the contact's display.
 * @param {string} initials - The initials of the contact.
 * @param {number} i - The index of the contact in the oldContacts array.
 */
function editContact(name, mail, number, backgroundColor, initials, i) {
    document.getElementById("edit-pop-up").classList.remove("d-none");
    document.getElementById("edit-pop-up").classList.add("d-flex");

    let edit = document.getElementById("edit-pop-up");
    edit.innerHTML = "";
    edit.innerHTML += generateEditContactHTML(backgroundColor, initials, name, mail, number, i);
}

/**
 * Deletes a contact from the contact list.
 * @param {number} i - The index of the contact in the oldContacts array to delete.
 */
async function deleteContact(i) {
    let contactToDelete = contacts[i]; // Hole Kontakt vor dem Entfernen
    await deleteContactFromDB(contactToDelete); // Kontakt aus DB löschen
    contacts.splice(i, 1); // Lokal entfernen, wenn erfolgreich
    letters.splice(i, 1);
    document.getElementById("open-contact").classList.add("d-none");
    renderContacts(); // Kontakte neu rendern
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
