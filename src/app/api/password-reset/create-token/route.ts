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

  const user = await createPasswordResetToken(userId)

  if (!user) {
    return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
  }
  
  return NextResponse.json({ message: 'Utente trovato', user }, { status: 200 });
}
