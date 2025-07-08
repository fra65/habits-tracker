import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/modules/user/services/user.service';

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: 'Email mancante' }, { status: 400 });
  }
  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Utente trovato', user }, { status: 200 });
}
