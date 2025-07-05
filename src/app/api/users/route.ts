/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkUsernameExists, createUser } from '@/modules/user/services/user.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Validazione base (opzionale)
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 });
    }

    // Controlla se username esiste
    const exists = await checkUsernameExists(username);
    if (exists) {
      return NextResponse.json({ error: 'Questo username è già in uso' }, { status: 400 });
    }

    // Crea utente
    const user = await createUser({ username, email, password });

    return NextResponse.json({ message: 'Utente creato con successo', user }, { status: 201 });
  } catch (error: any) {
    console.error('Errore API /api/users:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}