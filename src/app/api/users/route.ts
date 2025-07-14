/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/modules/user/services/user.service';
import { handleUniqueConstraintError } from '@/utils/prismaErrorHelper';

//funzione per aggiungere un utente al db
export async function POST(request: NextRequest) {

  try {

    const { username, email, password, provider } = await request.json();
    const user = await createUser({ username, email, password, provider });

    return NextResponse.json({ message: 'Utente creato con successo', user }, { status: 201 });

  } catch (error: any) {
    
    const uniqueError = handleUniqueConstraintError(error);

    if (uniqueError) {
      return NextResponse.json({ error: uniqueError.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}