import { PrismaClient } from '@prisma/client';

// Dichiara una proprietà globale per TypeScript
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Usa l'istanza globale se esiste, altrimenti crea una nuova
const prisma = global.prisma || new PrismaClient();

// In sviluppo assegna l'istanza globale per riutilizzarla nei reload
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
