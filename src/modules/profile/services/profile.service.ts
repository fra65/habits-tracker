/* eslint-disable @typescript-eslint/no-explicit-any */

import z from "zod";
import { ProfileOutputAdmin, ProfileOutputAdminSchema } from "../schema/ProfileOutputAdmin";
import { ProfileOutput, ProfileOutputSchema } from "../schema/ProfileOutput";
import { ProfileUpdateOutput, ProfileUpdateOutputSchema } from "../schema/ProfileUpdateOutputSchema";
import prisma from "@/prisma";

// FUNZIONE PER CREAZIONE

export async function createUserProfile(data: any): Promise<ProfileOutput | undefined | null> {

    //console.log("Dati ricevuti in createUserProfile:", data);

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

export async function getUserProfileById(userId: number): Promise<ProfileOutput | undefined | null> {

    try {
        
        const selectedProfile = await prisma?.user_profile.findUnique({
            where: {
                id: Number(userId)
            }
        })

        if(!selectedProfile) return null

        const profile = ProfileOutputSchema.safeParse(selectedProfile)
    
        return profile.data;

    } catch (err) {
        console.error("Errore Prisma o validazione:", err)
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

export async function updateUserProfile(userId: string | number, data: any): Promise<ProfileUpdateOutput | undefined | null> {

    const updatedProfile = await prisma?.user_profile.update({
        where: {
            id: Number(userId)
        },
        data: {
            ...data
        }
    })

    if(!updatedProfile) return null
    
    const profile = ProfileUpdateOutputSchema.safeParse(updatedProfile)

    return profile.data;
}

// FUNZIONE PER DELETE

export async function deleteUserProfile(userId: number): Promise<boolean | undefined | null> {

    try {
        
        const deletedProfile = await prisma?.user_profile.delete({
            where: {
                id: Number(userId)
            }
        })

        if(!deletedProfile) return null

        const profile = ProfileOutputSchema.safeParse(deletedProfile)
    
        return profile.data && true;

    } catch {
        throw new Error("Profilo inesistente");

    }

}




// ADMIN


// GET DI TUTTI GLI UTENTI
export async function getAllProfiles(): Promise<ProfileOutputAdmin[] | null> {

  const profiles = await prisma?.user_profile.findMany({})

  // console.log("Users from DB:", users);

  const validateUsers = z.array(ProfileOutputAdminSchema).safeParse(profiles);
  
  if(!validateUsers.success) {
    return null;
  }

  return validateUsers.data

}


// GET SINGOLO UTENTE
// export async function getUser(id: string): Promise<UserOutputAdmin | null> {
//   if (!id) {
//     return null; // oppure lancia un errore se preferisci
//   }

//   // Recupera un solo utente con prisma.findUnique o findFirst
//   const user = await prisma?.user.findUnique({
//     where: { id: Number(id) }, // se id è number nel DB, converti
//   });

//   // console.log("User from DB:", user);

//   if (!user) {
//     return null;
//   }

//   // Valida singolo utente (non array)
//   const validateUser = UserOutputToAdminSchema.safeParse(user);

//   if (!validateUser.success) {
//     console.error("Errore validazione utente:", validateUser.error);
//     return null;
//   }

//   return validateUser.data;
// }