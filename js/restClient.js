async function getContactsFromDB() {
    let token = this.loggedUser.token;
    let connectionString = "http://localhost:8000/api/contacts";

    try {
        let response = await fetch(connectionString, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + token
            }
        });

        if (!response.ok)
            console.error("Error loading contacts: ", response.status, response.statusText);

        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Network- or Servererror:", error);
    }
}

async function insertContactToDB(newContact) {
    let connectionString = "http://localhost:8000/api/contacts/";
    let token = this.loggedUser.token;

    try {
        let response = await fetch(connectionString, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify(newContact)
        });

        if (!response.ok)
            console.error("Error insert contact: ", response.status, response.statusText);
    }
    catch (error) {
        console.error("Network- or Servererror:", error);
    }

}

async function deleteContactFromDB(contact) {
    let connectionString = `http://localhost:8000/api/contacts/${contact.id}/`;
    let token = this.loggedUser.token;

    try {
        let response = await fetch(connectionString, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify(contact)
        });

        if (!response.ok)
            console.error("Error deletting contact: ", response.status, response.statusText);
    }

    catch (error) {
        console.error("Network- or Servererror:", error);
    }
}

async function updateContactFromDb(contact) {
    let connectionString = `http://localhost:8000/api/contacts/${contact.id}/`;
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

        if (!response.ok)
            console.error("Error updating contact: ", response.status, response.statusText);

        return true;
    } catch (error) {
        console.error("Network- or Servererror:", error);
    }
}

async function insertTaskToDB(task) {
    let connectionString = "http://localhost:8000/api/tasks/";
    let token = this.loggedUser.token;

    try {
        let response = await fetch(connectionString, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify(task)
        });

        if (!response.ok)
            console.error("Error insert task: ", response.status, response.statusText);

    }

    catch (error) {
        console.error("Network- or Servererror:", error);
    }
}

async function getTasksFromDB() {
    let token = this.loggedUser.token;
    let connectionString = "http://localhost:8000/api/tasks/";

    try {
        let response = await fetch(connectionString, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + token
            }
        });

        if (!response.ok)
            console.error("Error loading task: ", response.status, response.statusText);


        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Network- or Servererror:", error);
    }
}

async function updateTaskInDB(task) {
    let token = this.loggedUser.token;
    let connectionString = `http://localhost:8000/api/tasks/${task.id}/`;

    try {
        let response = await fetch(connectionString, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify(task)
        });

        if (!response.ok)
            console.error("Error updating task: ", response.status, response.statusText);

        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Network- or Servererror:", error);
    }
}

async function deleteTaskFromDB(task) {
    let connectionString = `http://localhost:8000/api/tasks/${task.id}/`;
    let token = this.loggedUser.token;

    try {
        let response = await fetch(connectionString, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify(task)
        });

        if (!response.ok)
            console.error("Error deleting task: ", response.status, response.statusText);
    }

    catch (error) {
        console.error("Network- or Servererror:", error);
    }
}


/**
 * Performs the login by sending the entered email and password to the backend.
 * If the user is found, it stores the token and navigates to the summary page.
 * If login fails, an error message is displayed.
 * @async
 */
async function loginRequest(userData) {
    let connectionString = "http://localhost:8000/api/login/";

    try {
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

        if (response.ok) {
            let data = await response.json();

            let user = {
                "token": data.token,
                "user_id": data.user_id,
                "username": data.username,
                "email": data.email
            };

            localStorage.setItem("user", JSON.stringify(user));
            
            return true;
        } else 
            false
    
    } catch (error) {
        console.error("Network- or Servererror:", error);
    }
}

async function registerRequest(userData) {
    const connectionString = "http://127.0.0.1:8000/api/register/";

    try {
        let response = await fetch(connectionString, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            console.error("Error register user: ", response.status, response.statusText);
            return false
        }
        else
            return true;

    }

    catch (error) {
        console.error("Network- or Servererror:", error);
    }
}