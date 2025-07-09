/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"

import {
  createUserProfile,
  getUserProfileById,
  updateUserProfile,
  deleteUserProfile
} from '@/modules/profile/services/profile.service'

// CREARE IL TUO PROFILO

export async function POST(request: NextRequest) {
  const res = NextResponse.next();

  const session = await getServerSession(request as any, res as any, authOptions);
  if (!session) {
    return NextResponse.json({ error: "Utente non autenticato" }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Passa userId dalla sessione e i dati dal body alla funzione di creazione
    const userProfile = await createUserProfile(session.user.id, data);

    return NextResponse.json({ message: "Profilo creato con successo", userProfile }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Errore nella creazione del profilo" }, { status: 500 });
  }
}

// RECUPERARE DATI DEL TUO PROFILO
export async function GET(request: NextRequest) {
  const res = NextResponse.next();

  const session = await getServerSession(request as any, res as any, authOptions);
  if (!session) {
    return NextResponse.json({ error: "Utente non autenticato" }, { status: 401 });
  }

  try {
    const userProfile = await getUserProfileById(session.user.id);

    if (!userProfile) {
      return NextResponse.json({ error: "Profilo non trovato" }, { status: 404 });
    }

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Errore nel recupero del profilo" }, { status: 500 });
  }
}

// AGGIORNARE DATI DEL TUO PROFILO

export async function PUT(request: NextRequest) {
  const res = NextResponse.next();

  const session = await getServerSession(request as any, res as any, authOptions);
  if (!session) {
    return NextResponse.json({ error: "Utente non autenticato" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const updatedProfile = await updateUserProfile(session.user.id, data);

    if (!updatedProfile) {
      return NextResponse.json({ error: "Profilo non trovato o non aggiornato" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profilo aggiornato con successo", updatedProfile }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Errore nell'aggiornamento del profilo" }, { status: 500 });
  }
}

// ELIMINARE IL TUO PROFILO

export async function DELETE(request: NextRequest) {
  const res = NextResponse.next();

  const session = await getServerSession(request as any, res as any, authOptions);
  if (!session) {
    return NextResponse.json({ error: "Utente non autenticato" }, { status: 401 });
  }

  try {
    const deleted = await deleteUserProfile(session.user.id);

    if (!deleted) {
      return NextResponse.json({ error: "Profilo non trovato o non eliminato" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profilo eliminato con successo" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Errore nell'eliminazione del profilo" }, { status: 500 });
  }
}
