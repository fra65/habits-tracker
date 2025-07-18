/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ProfilePreferencesOutput } from "../schema/ProfilePreferencesOutput.schema";

export default async function updatePreferences(data: any): Promise<ProfilePreferencesOutput | null> {
    
    try {
        const response = await axios.put("/api/preferences", data);

        if(!response) return null

        return response.data;
    } catch (error) {
        // Puoi gestire l’errore qui o rilanciarlo
        throw error;
    }

}