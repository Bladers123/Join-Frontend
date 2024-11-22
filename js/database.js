async function getContactsFromDB() {
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

        if (!response.ok) 
            console.error("Error loading contacts: ", response.status, response.statusText);

        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Network- or Servererror:", error);
    }
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

        if (!response.ok)
            console.error("Error insert contact: ", response.status, response.statusText);
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

            if (!response.ok)
                console.error("Error deletting contact: ", response.status, response.statusText);
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

            if (!response.ok)
                console.error("Error updating contact: ", response.status, response.statusText);

            return true;
        } catch (error) {
            console.error("Network- or Servererror:", error);
        }
    }

    async function insertTaskToDB(task) {
        let connectionString = "http://localhost:8000/api/profile/tickets/";
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

    async function getTaskFromDB() {
        let token = this.loggedUser.token;
        let connectionString = "http://localhost:8000/api/profile/tickets/";

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
        let connectionString = `http://localhost:8000/api/profile/tickets/${task.id}/`;

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
        let conntectionString = `http://localhost:8000/api/profile/tickets/${task.id}/`;
        let token = this.loggedUser.token;

        try {
            let response = await fetch(conntectionString, {
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