import { createPasswordResetToken } from '@/modules/auth/services/auth.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {

  const { userId, email } = await request.json();

  if (!email || !userId) {
    return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 });
  }

  const user = await createPasswordResetToken(userId)

  if (!user) {
    return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
  }
  
  return NextResponse.json({ message: 'Utente trovato', user }, { status: 200 });
}
