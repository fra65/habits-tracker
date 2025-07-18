import { ProfilePreferencesOutput, ProfilePreferencesOutputSchema } from "../schema/ProfilePreferencesOutput.schema"

export async function getUserPreferences(userId: number): Promise<ProfilePreferencesOutput | null> {

    const preferences = await prisma?.user_preferences.findUnique({
        where: {
            id: Number(userId)
        }
    })


    if (!preferences) return null

    const validate = ProfilePreferencesOutputSchema.safeParse(preferences)

    // console.log("Preferenze backend post validazione: ", validate.data)

    if(!validate.success) {
        console.error("Errore di validazione: ", validate.error)
        return null
    }

    return validate.data

}