import axios from "axios";

export default async function createPreferences(userId: number) {
    try {

        const response = await axios.post('/api/preferences', {userId})

        return response.data;

    } catch (error) {
        console.error("Errore nella creazione delle preferenze:", error);
        throw new Error("Impossibile creare le preferenze utente");
    }

}