import axios from "axios";
import { ProfilePreferencesOutput, ProfilePreferencesOutputSchema } from "../schema/ProfilePreferencesOutput.schema";

export default async function getPreferences(): Promise<ProfilePreferencesOutput | null> {

    try {

        const preferences = await axios.get('/api/preferences')

        // console.log("Preferenze frontend: ", preferences)

        if(!preferences) return null

        const validate = ProfilePreferencesOutputSchema.safeParse(preferences.data)

        // console.log("Preferenze validate: ", validate.data)

        if(!validate.success) {
            // console.log("Errorino")
            console.error("Errore di validazione: ", validate.error)
            return null
        }
    
        return validate.data

    } catch(err) {
        console.error("Errore: ", err)
        throw new Error("Errore nel recupero delle preferenze")
    }

    
}