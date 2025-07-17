/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/prisma";
import { CreateUserInput } from "../types/createUserInput";
import { hashPassword } from "@/modules/auth/utils/managePassword";
import { UserOutput } from "../types/UserOutput";
import { UpdatePasswordInput } from "../types/UpdatePasswordInput";
import { CreateUserOauthInput } from "../types/createUserOauthInput";
import { UserOutputAdmin, UserOutputToAdminSchema } from "../schema/usersOutputAdmin.schema";
import z from "zod";

// funzione per verificare se esiste un utente
export const checkUsernameExists = async (username: string): Promise<boolean> => {

  try {
    // Cerca un utente con il username fornito
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    // Se user non è null, significa che un utente con quel username esiste
    return user !== null;
  } catch (error) {
    throw new Error("Errore durante la verifica dell'esistenza del username");
  }
};

export async function getUserByEmail(email: string, provider: string): Promise<UserOutput | null> {

  try {

    const user = await prisma.user.findUnique({
      where: {
        email_provider: {
          email: email,
          provider: provider,
        }
      }
    })

    if(!user) return null

    return user

  } catch {
    throw new Error("Email o provider inesistente");

  }
  
}

export async function getUserByAuthProvider(provider: string, oauthId: string) {
  
  try {

    const dbUser = await prisma?.user.findUnique({
      where: {
        provider_oauthId: {
          provider: provider,
          oauthId: oauthId,
        },
      },
    });

    if(!dbUser) {
      throw new Error("Utente non trovato")
    }

    return dbUser

  } catch(e) {
    throw new Error("Errore")
  }

}


// funzione di creazione user
export async function createUser(data: CreateUserInput) {
  // Hash della password prima di salvarla
  const hashedPassword = await hashPassword(data.password);

  // Creazione dell'utente nel DB
  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      provider: data.provider
    },
    // Se vuoi puoi selezionare solo alcuni campi da restituire
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
}

// funzione di creazione user
export async function createUserOauth(data: CreateUserOauthInput) {

  // Creazione dell'utente nel DB
  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      provider: data.provider
    },
    // Se vuoi puoi selezionare solo alcuni campi da restituire
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
}

export async function updatePassword({userId, hashedPassword}: UpdatePasswordInput) {

    // Aggiorna la password dell’utente
    await prisma.user.update({
      where: { id: userId as number  },
      data: { password: hashedPassword },
    });
}




// !! ADMIN !!





// GET DI TUTTI GLI UTENTI
export async function getAllUsers(): Promise<UserOutputAdmin[] | null> {

  const users = await prisma?.user.findMany({})

  // console.log("Users from DB:", users);

  const validateUsers = z.array(UserOutputToAdminSchema).safeParse(users);
  
  if(!validateUsers.success) {
    return null;
  }

  return validateUsers.data

}


// GET SINGOLO UTENTE
export async function getUser(id: string): Promise<UserOutputAdmin | null> {
  if (!id) {
    return null; // oppure lancia un errore se preferisci
  }

  // Recupera un solo utente con prisma.findUnique o findFirst
  const user = await prisma?.user.findUnique({
    where: { id: Number(id) }, // se id è number nel DB, converti
  });

  // console.log("User from DB:", user);

  if (!user) {
    return null;
  }

  // Valida singolo utente (non array)
  const validateUser = UserOutputToAdminSchema.safeParse(user);

  if (!validateUser.success) {
    console.error("Errore validazione utente:", validateUser.error);
    return null;
  }

  return validateUser.data;
}