/* eslint-disable @typescript-eslint/no-explicit-any */

import { ProfileOutput, ProfileOutputSchema } from "../schema/ProfileOutput";

// FUNZIONE PER CREAZIONE

export async function createUserProfile(data: any): Promise<ProfileOutput | undefined | null> {

    // console.log("Dati ricevuti in createUserProfile:", data);

    const createdProfile = await prisma?.user_profile.create({
        data: {
            id: data.id, // id utente
            nome: data.nome,
            cognome: data.cognome,
            data_nascita: data.data_nascita,
            sesso: data.sesso,
            is_complete: data.is_complete ? 1 : 0,
        }
    })

    if(!createdProfile) return null

    const profile = ProfileOutputSchema.safeParse(createdProfile)
    
    return profile.data;

}


// FUNZIONE PER RECUPERO INFO

export async function getUserProfileById(userId: string | number): Promise<ProfileOutput | undefined | null> {

    try {
        
        const selectedProfile = await prisma?.user_profile.findUnique({
            where: {
                id: userId as number
            }
        })

        if(!selectedProfile) return null

        const profile = ProfileOutputSchema.safeParse(selectedProfile)
    
        return profile.data;

    } catch {
        throw new Error("Profilo inesistente");

    }

}


// RECUPERO CAMPO is_complete
export async function getUserIsCompleteById(userId: string | number): Promise<boolean | null> {
  try {
    const selectedProfile = await prisma?.user_profile.findUnique({
      where: { id: Number(userId) },
      select: { is_complete: true }
    });

    if (!selectedProfile) return null;

    return selectedProfile.is_complete === 1 ? true : false;
  } catch {
    throw new Error("Profilo inesistente");
  }
}



// RECUPERO ID DEL PROFILO

export async function getProfileId(userId: string | number): Promise<ProfileOutput | undefined | null> {

    try {
        
        const selectedProfile = await prisma?.user_profile.findMany({
            where: {
                id: userId as number
            }
        })

        if(!selectedProfile) return null

        const profile = ProfileOutputSchema.safeParse(selectedProfile)
    
        return profile.data;

    } catch {
        throw new Error("Profilo inesistente");

    }

}



// FUNZIONE PER UPDATE

export async function updateUserProfile(userId: string | number, data: any): Promise<ProfileOutput | undefined | null> {

    const updatedProfile = await prisma?.user_profile.update({
        where: {
            id: userId as number
        },
        data: {
            ...data
        }
    })

    if(!updatedProfile) return null
    
    const profile = ProfileOutputSchema.safeParse(updatedProfile)

    return profile.data;
}

// FUNZIONE PER DELETE

export async function deleteUserProfile(userId: string | number): Promise<ProfileOutput | undefined | null> {

    try {
        
        const deletedProfile = await prisma?.user_profile.delete({
            where: {
                id: userId as number
            }
        })

        if(!deletedProfile) return null

        const profile = ProfileOutputSchema.safeParse(deletedProfile)
    
        return profile.data;

    } catch {
        throw new Error("Profilo inesistente");

    }

}