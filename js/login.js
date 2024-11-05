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
 * Performs the login by sending the entered email and password to the backend.
 * If the user is found, it stores the token and navigates to the summary page.
 * If login fails, an error message is displayed.
 * @async
 */
async function logIn() {
    let connectionString = "http://localhost:8000/api/auth/login/";
    let userData = {
        "email": document.getElementById("emailInput").value,
        "password": document.getElementById("passwordInput").value
    };

    try {
        let response = await sendLoginRequest(connectionString, userData);

        if (response.ok) {
            let data = await response.json();

            let user = {
                "token": data.token,
                "user_id": data.user_id,
                "username": data.username,
                "email": data.email
            };

            localStorage.setItem("user", JSON.stringify(user));
            window.location.href = "../../html/summary.html";
        } else {
            let failureText = document.getElementById("failureTextInLogin");
            failureText.innerHTML = "Email or password are incorrect";
        }
    } catch (error) {
        let failureText = document.getElementById("failureTextInLogin");
        failureText.innerHTML = "An error has occurred. Please try again.";
    }
}

/**
 * Sends a POST request to the specified login endpoint with the user login credentials.
 * @param {string} connectionString - The URL of the login endpoint.
 * @param {Object} userData - Object containing the login credentials (email and password).
 * @param {string} userData.email - The user's email address.
 * @param {string} userData.password - The user's password.
 * @returns {Promise<Response>} - The response from the fetch request.
 * @async
 */
async function sendLoginRequest(connectionString, userData) {
    let response = await fetch(connectionString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: userData.email,
            password: userData.password
        })
    });
    return response;
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
