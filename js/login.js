/**
 * Array to store user objects.
 * @type {Array<{email: string, password: string}>}
 */
let users = [];

/**
 * The current user object.
 * @type {Array}
 */
let user = [];

/**
 * Initializes the login process by loading users.
 * @async
 */
async function initLogIn() {
    await loadUsers();
}

/**
 * Navigates to the sign-in page.
 */
function navToSignIn() {
    window.location.href = "../../html/user-login/sign-in.html";
}

/**
 * Handles guest login by clearing the current user and redirecting to the summary page.
 * @async
 */
async function guestLogIn() {
    user = [];
    await setItem("user", JSON.stringify(user));
    window.location.href = "../../html/summary.html"; 
    console.log("test");
}

/**
 * Loads users from storage.
 * Tries to parse the "users" item from storage. If it exists and is an array, it sets the users variable.
 * Otherwise, initializes users with an empty array.
 * @async
 */
async function loadUsers() {
    try {
       let loadedUsers = await getItem("users");
        
        if (Array.isArray(loadedUsers)) {
            users = loadedUsers;
        } else {
            users = [];
        }
    } catch (error) {
        console.error("Fehler beim Laden der Benutzer: ", error);
        users = [];
    }
}

/**
 * Performs the login by validating the entered email and password against the loaded users.
 * If the user is found, it saves the user to storage and navigates to the summary page.
 * Otherwise, it displays an error message.
 * @async
 */
async function logIn() {
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;

    user = users.find((user) => user.email === email && user.password === password);

    if (user) {
        await setItem("user", JSON.stringify(user));
        window.location.href = "../../html/summary.html";
    } else {
        let failureText = document.getElementById("failureTextInLogin");
        failureText.innerHTML = "Email or password are incorrect";
    }
}

/**
 * Sets up event listeners on DOMContentLoaded event to clear failure messages upon input field interaction.
 */
document.addEventListener("DOMContentLoaded", function () {
    let inputs = document.getElementsByClassName("input");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("click", function () {
            document.getElementById("failureTextInLogin").innerHTML = "";
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let passwordInput = document.getElementById("passwordInput");
    let toggleIcon = document.getElementById("togglePasswordVisibility");
    toggleIcon.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            toggleIcon.src = "../../img/visibility.png"; 
        } else {
            passwordInput.type = "password";
            toggleIcon.src = "../../img/visibility-off.png"; 
        }
    });
    passwordInput.addEventListener("input", function () {
        if (passwordInput.value === "") {
            toggleIcon.src = "../../img/lock.svg"; 
            passwordInput.type = "password";
        }
    });
});
