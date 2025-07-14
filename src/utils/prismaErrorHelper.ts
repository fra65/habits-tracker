import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

interface UniqueFieldError {
  field: string;
  message: string;
}

/**
 * Controlla se l'errore Prisma è un errore di vincolo unico su email o username,
 * e restituisce un messaggio user-friendly.
 * 
 * @param error - errore catturato da Prisma
 * @returns oggetto con campo e messaggio, oppure null se non è errore unico gestito
 */
export function handleUniqueConstraintError(error: unknown): UniqueFieldError | null {
  if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
    const target = error.meta?.target;

    if (Array.isArray(target)) {
      // Caso vincolo composito email+provider
      const hasEmail = target.includes('email');
      const hasProvider = target.includes('provider');

      if (hasEmail && hasProvider) {
        return {
          field: 'email+provider',
          message: "L'associazione email + provider è già in uso.",
        };
      }

      // Controllo username
      if (target.includes('username')) {
        return {
          field: 'username',
          message: "Lo username è già in uso.",
        };
      }

      // Altri campi unici
      return {
        field: target.join(', '),
        message: `Il/i campo/i [${target.join(', ')}] è/sono già in uso.`,
      };
    } else if (typeof target === 'string') {
      // Caso target singolo
      if (target === 'username') {
        return {
          field: 'username',
          message: "Lo username è già in uso.",
        };
      }
      if (target === 'email') {
        return {
          field: 'email',
          message: "L'email è già in uso.",
        };
      }
      if (target === 'provider') {
        // Se mai usato come unico, gestisci qui
        return {
          field: 'provider',
          message: "Il provider è già in uso.",
        };
      }
      return {
        field: target,
        message: `Il campo ${target} è già in uso.`,
      };
    }
  }
  return null;
}