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
      // Verifica se tra i campi c'è email o username
      if (target.includes('email')) {
        return {
          field: 'email',
          message: 'L\'email è già in uso.',
        };
      }
      if (target.includes('username')) {
        return {
          field: 'username',
          message: 'Lo username è già in uso.',
        };
      }
      // Se altri campi unici, puoi aggiungere qui altri controlli
      return {
        field: target.join(', '),
        message: `Il/i campo/i [${target.join(', ')}] è/sono già in uso.`,
      };
    } else if (typeof target === 'string') {
      if (target === 'email') {
        return {
          field: 'email',
          message: 'L\'email è già in uso.',
        };
      }
      if (target === 'username') {
        return {
          field: 'username',
          message: 'Lo username è già in uso.',
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
