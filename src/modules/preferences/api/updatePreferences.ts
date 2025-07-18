/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export default async function updatePreferences(data: any) {
    
    try {
        const response = await axios.put("/api/preferences", data);
        return response.data;
    } catch (error) {
        // Puoi gestire l’errore qui o rilanciarlo
        throw error;
    }

}