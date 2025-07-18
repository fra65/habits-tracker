import axios from "axios"
import { ProfilePreferencesOutput, ProfilePreferencesOutputSchema } from "../schema/ProfilePreferencesOutput.schema"

export default async function resetPreferences(): Promise<ProfilePreferencesOutput | null> {
  try {
    const response = await axios.get('/api/preferences/default')

    if (!response) return null

    const validate = ProfilePreferencesOutputSchema.safeParse(response.data)

    if (!validate.success) {
      console.error("Errore di validazione: ", validate.error)
      return null
    }

    return validate.data
  } catch (err) {
    console.error("Errore: ", err)
    throw new Error("Errore nel recupero delle preferenze di default")
  }
}
