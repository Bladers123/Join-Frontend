/**
 * Handles registration errors returned from the server response.
 * Displays an error message to the user based on the response details.
 * @async
 * @param {Response} response - The server response with error details.
 */
async function handleRegistrationError(response) {
    const errorData = await response.json();
    let failureText = document.getElementById("failureText");

    // Prüfen, ob ein Fehler für den Benutzernamen (username) vorliegt und diesen anzeigen
    if (errorData.username) {
        failureText.innerHTML = errorData.username[0];
    } else if (errorData.email) {
        failureText.innerHTML = errorData.email[0];
    } else {
        failureText.innerHTML = errorData.detail || "Registration failed";
    }
}

/**
 * Handles the user registration process, including UI feedback.
 * @async
 */
async function register() {
    if (!isPasswordConfirmed())
        return;

    const newUser = {
        username: inputName.value,
        email: inputEmail.value,
        password: inputPassword.value,
    };

    try {
        const isRequestSuccessfull = await registerRequest(newUser);

        if (isRequestSuccessfull)
            handleRegistrationSuccess();
        else
            handleRegistrationError(errorData);
    } catch (error) {
        handleNetworkError(error);
    }
}


/**
 * Displays a success message for successful registration and redirects to the login page.
 */
function handleRegistrationSuccess() {
    console.log("User registered successfully");
    const message = 'You Signed Up successfully';
    document.getElementById("popup-container").innerHTML = getPopUpTemplate(message);
    setTimeout(() => {
        window.location.href = "../html/login.html";
    }, 1000);
}

/**
 * Handles network errors that occur during the registration process.
 * Logs the error and displays an error message to the user.
 * @param {Error} error - The network error encountered during the request.
 */
function handleNetworkError(error) {
    console.log("Netzwerkfehler:", error);
    document.getElementById("failureText").innerHTML = "An error occurred. Please try again.";
}




/**
 * Navigates the user back to the login page.
 */
function backToLogIn() {
    window.location.href = "login.html";
}


/**
 * Checks if the password entered matches the confirmation password.
 * Updates the UI to reflect the validation result.
 * @returns {boolean} True if the passwords match, false otherwise.
 */
function isPasswordConfirmed() {
    let password = document.getElementById("inputPassword");
    let confirmPassword = document.getElementById("inputConfirmPassword");
    let confirmPasswordContainer = document.getElementById("confirm-password-container");
    if (password.value === confirmPassword.value) {
        confirmPasswordContainer.style.border = "";
        return true;
    } else {
        let failureText = document.getElementById("failureText");
        failureText.innerHTML = "Ups! your password dont match";
        confirmPasswordContainer.style.border = "2px solid #FF4057";
        return false;
    }
}

/**
 * Sets up event listeners to clear validation messages and styles upon user interaction with the confirmation password field.
 */
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("confirm-password-container")) {
        document.getElementById("confirm-password-container").addEventListener("click", function () {
            this.style.border = "";
            document.getElementById("failureText").innerHTML = "";
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".togglePasswordVisibility").forEach(toggleIcon => {
        toggleIcon.addEventListener("click", function () {
            let passwordInput = document.getElementById("inputPassword");
            let confirmPasswordInput = document.getElementById("inputConfirmPassword");
            let newType = passwordInput.type === "password" ? "text" : "password";
            let newImagePath = newType === "text" ? "../../img/visibility.png" : "../../img/visibility-off.png";
            passwordInput.type = newType;
            confirmPasswordInput.type = newType;
            document.querySelectorAll(".togglePasswordVisibility").forEach(icon => {
                icon.src = newImagePath;
            });
        });
    });

    let passwordFields = [document.getElementById("inputPassword"), document.getElementById("inputConfirmPassword")];
    passwordFields.forEach(field => {
        field.addEventListener("input", function () {
            if (field.value === "") {
                document.querySelectorAll(".togglePasswordVisibility").forEach(icon => {
                    icon.src = "../../img/lock.svg";
                });
                field.type = "password";
            }
        });
    });
});

