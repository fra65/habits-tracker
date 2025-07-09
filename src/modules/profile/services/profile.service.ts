/* eslint-disable @typescript-eslint/no-explicit-any */

// FUNZIONE PER CREAZIONE

export async function createUserProfile(userId: string, data: any) {

    const createdProfile = await prisma?.user_profile.create({
        data: {
            id: userId,
            ...data
        }
    })
    
    return createdProfile;

}

// FUNZIONE PER RECUPERO INFO

export async function getUserProfileById(userId: string | number) {

    try {
        
        const profile = await prisma?.user_profile.findMany({
            where: {
                id: userId as number
            }
        })


        if(!profile) return null

        return profile

    } catch {
        throw new Error("Profilo inesistente");

    }

}

// FUNZIONE PER UPDATE

export async function updateUserProfile(userId: string | number, data: any) {

    const updatedProfile = await prisma?.user_profile.update({
        where: {
            id: userId as number
        },
        data: {
            ...data
        }
    })
    
    return updatedProfile;
}

// FUNZIONE PER DELETE

export async function deleteUserProfile(userId: string | number) {

    try {
        
        const deletedProfile = await prisma?.user_profile.delete({
            where: {
                id: userId as number
            }
        })

        return deletedProfile

    } catch {
        throw new Error("Profilo inesistente");

    }

}