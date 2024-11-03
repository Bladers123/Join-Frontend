
let url = 'http://127.0.0.1:8000/api/';



async function setItem(endpoint, value) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(value),
            
        });

        if (!response.ok) {
            throw new Error(`Fehler: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fehler beim Senden der Daten:', error);
        return null;
    }
}


async function getItem(endpoint) {
    try {
        console.log('Versuche zu fetchen...', `${url}${endpoint}/`);
        const response = await fetch(`${url}${endpoint}/`);

        const data = await response.json();
        console.log('Antwort: ', data);
        if (!response.ok) {
            throw new Error(`Fehler: ${response.status} ${response.statusText}`);
        }
       
        return data;
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        return null;
    }
}
