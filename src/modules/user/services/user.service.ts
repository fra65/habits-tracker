/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/prisma";
import { CreateUserInput } from "../types/createUserInput";
import { hashPassword } from "@/modules/auth/utils/managePassword";

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
