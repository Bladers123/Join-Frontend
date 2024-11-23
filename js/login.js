/**
 * Navigates to the sign-in page.
 */
function navToSignIn() {
    window.location.href = "../../html/sign-in.html";
}

/**
 * Handles guest login by clearing the current user and redirecting to the summary page.
 * @async
 */
async function loginGuest() {
    user = [];
    await setItem("user", JSON.stringify(user));
    window.location.href = "../../html/summary.html";
}

async function loginUser() {
    let userData = {
        "email": document.getElementById("emailInput").value,
        "password": document.getElementById("passwordInput").value
    };

    let isRequestSuccessfull = await loginRequest(userData);

    if (isRequestSuccessfull) {
        window.location.href = "../../html/summary.html";
    }
    else {
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
