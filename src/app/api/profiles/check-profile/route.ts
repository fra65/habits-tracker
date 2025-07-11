
// FUNZIONE PER VEDERE ESISTENZA E COMPLETEZZA PROFILO

import { auth } from "@/lib/auth";
import { getUserIsCompleteById } from "@/modules/profile/services/profile.service";
import { NextResponse } from "next/server";

export async function GET() {

  try {

    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const isUserComplete = await getUserIsCompleteById(session.user.id);

    if (isUserComplete === null || isUserComplete === undefined) {
      // Profilo non trovato
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    // Profilo trovato, restituisci lo stato di completezza (boolean)
    return NextResponse.json({ isComplete: isUserComplete }, { status: 200 });
  } catch (error) {
    console.error("Errore nel recupero del profilo:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }

}