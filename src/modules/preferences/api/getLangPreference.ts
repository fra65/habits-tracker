import axios from "axios"
import { PreferencesLangOutput, PreferencesLangOutputSchema } from "../schema/PreferencesLangOutputSchema"

export default async function getLangPreference(): Promise<PreferencesLangOutput | null> {

    try {

        const langPreferences = await axios.get('/api/preferences/lang')

        // console.log("Preferenze frontend: ", preferences)

        if(!langPreferences) return null

        const validate = PreferencesLangOutputSchema.safeParse(langPreferences.data)

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