/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoginUserInput } from "../types/LoginUserInput";
import { LoginUserOutput } from "../types/LoginUserOutput";
import prisma from "@/prisma";
import { checkPassword } from "../utils/managePassword";
import { generateResetToken } from "../utils/tokenUtils";
import bcrypt from "bcrypt";
import { createHash } from "crypto";

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
    id: user.id,
    username: user.username,
    role: user.role
  };
}

export async function getUserActiveToken(userId: number) {

  const activeTokens = await prisma.passwordresettoken.findMany({
    where: {
      userId,
      expiresAt: {
        gt: new Date(), // considera data + ora attuale
      },
    },
    select: {
      expiresAt: true
    }
  });

  if(activeTokens) return activeTokens

}

export async function createPasswordResetToken(userId: number) {
  const { token, hashedToken } = generateResetToken();

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 ora

  await prisma.passwordresettoken.create({
    data: {
      userId,
      token: hashedToken,
      expiresAt,
    },
  });

  // Restituisci il token in chiaro per inviarlo via email
  return { token, expiresAt };
}



interface ResetPasswordParams {
  email: string;    // passata dal frontend ma non usata per la ricerca token
  token: string;
  password: string;
}

export async function resetPassword({ token, password }: ResetPasswordParams) {
  try {
    // Calcola hash SHA-256 del token ricevuto
    const hashedToken = createHash('sha256').update(token).digest('hex');

    // Cerca il record con il token hashato
    const tokenRecord = await prisma.passwordresettoken.findUnique({
      where: { token: hashedToken },
    });

    if (!tokenRecord) {
      return { success: false, message: "Token non valido o non trovato" };
    }

    // Verifica scadenza token
    const now = new Date();
    if (tokenRecord.expiresAt < now) {
      return { success: false, message: "Token scaduto" };
    }

    const userId = tokenRecord.userId;
    if (!userId) {
      return { success: false, message: "Utente non trovato per questo token" };
    }

    // Hash della nuova password con bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Aggiorna la password dell’utente
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Elimina il record del token dopo aggiornamento
    await prisma.passwordresettoken.deleteMany({
      where: { userId },
    });

    return { success: true, message: "Password aggiornata con successo" };
  } catch (error) {
    console.error("Errore in resetPassword:", error);
    return { success: false, message: "Errore interno del server" };
  }
}
