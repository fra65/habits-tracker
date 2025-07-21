import { ProfilePreferencesInputSchema } from "../schema/ProfilePreferencesInput.schema"
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


export async function updateProfilePreferences(userId: number, data: ProfilePreferencesInputSchema): Promise<ProfilePreferencesOutput | null> {

        const preferences = await prisma?.user_preferences.update({
        where: {
            id: Number(userId)
        },
        data
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


export async function createUserPreferences(userId: number): Promise<ProfilePreferencesOutput | null | undefined> {

    const preferences = await prisma?.user_preferences.create({
        data: {
            id: userId
        }
    })

    if(!preferences) return null

    const validatePreferences = ProfilePreferencesOutputSchema.safeParse(preferences)
    
    return validatePreferences.data;
}