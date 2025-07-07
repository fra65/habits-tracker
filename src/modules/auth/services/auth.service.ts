/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoginUserInput } from "../types/LoginUserInput";
import { LoginUserOutput } from "../types/LoginUserOutput";
import prisma from "@/prisma";
import { checkPassword } from "../utils/hashPassword";

export async function loginUser(credentials: LoginUserInput): Promise<LoginUserOutput | null> {
  // Trova l'utente con l'username fornito
  const user = await prisma.user.findUnique({
    where: {
      username: credentials.username,
    },
  });

  // Se l'utente non esiste, ritorna un errore o dati vuoti
  if (!user) {
    return null;
  }

  // Verifica se la password fornita corrisponde a quella hashata nel DB
  const isPasswordValid = await checkPassword(credentials.password, user.password)

  if (!isPasswordValid) {
    return null
  }

  // Se tutto è corretto, ritorna i dati dell'utente (ad esempio username ed email)
  return {
    username: user.username,
    email: user.email,
    error: null
  };
}