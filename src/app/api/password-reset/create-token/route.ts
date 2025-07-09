import { createPasswordResetToken, getUserActiveToken } from '@/modules/auth/services/auth.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {

  const { userId, email } = await request.json();

  if (!email || !userId) {
    return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 });
  }

  const activeTokens = await getUserActiveToken(userId);

  if (activeTokens && activeTokens.length > 0) {
    // Prendi il token con expiresAt più lontano (o il primo)
    const token = activeTokens.reduce((prev, current) => 
      prev.expiresAt > current.expiresAt ? prev : current
    );

    const now = new Date();
    const expiresAt = new Date(token.expiresAt);
    const minutesLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / 60000);

    return NextResponse.json(
      { error: `Token già attivo, scade tra ${minutesLeft} minuti.` },
      { status: 429 }
    );
  }

  const { token, expiresAt } = await createPasswordResetToken(userId);

  if (!token) {
    return NextResponse.json({ error: 'Errore nella creazione del token' }, { status: 500 });
  }

  // Qui puoi decidere se restituire anche l'utente, oppure solo token e scadenza
  return NextResponse.json(
    { message: 'Token creato con successo', token, expiresAt },
    { status: 200 }
  );
}
