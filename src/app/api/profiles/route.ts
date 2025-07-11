/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ProfileInputSchema } from "@/modules/profile/schema/ProfileInput";
import { ProfileOutputSchema } from "@/modules/profile/schema/ProfileOutput";
import { createUserProfile, getUserProfileById } from "@/modules/profile/services/profile.service";
import getUserProfile from "@/modules/profile/api/getUser";

// CREAZIONE PROFILO

export async function POST(request: NextRequest) {
  try {
    // Verifica sessione
    const session = await auth();

    // console.log("Session:", session);

    if (!session) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    // Leggi body JSON
    const body = await request.json();

    // Aggiungi userId estratto dalla sessione
    const dataWithUserId = {
      ...body,
      id: session.user.id,
    };

    // Validazione dati in ingresso
    const parseResult = ProfileInputSchema.safeParse(dataWithUserId);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Dati non validi", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    // Crea profilo con dati validati
    const createdProfile = await createUserProfile(parseResult.data);

    if (!createdProfile) {
      return NextResponse.json(
        { error: "Impossibile creare il profilo" },
        { status: 500 }
      );
    }

    // Validazione opzionale della risposta (se hai uno schema per l'output)
    const outputValidation = ProfileOutputSchema.safeParse(createdProfile);
    if (!outputValidation.success) {
      console.error("Profilo creato ma output non valido:", outputValidation.error);
      // Puoi decidere se mandare comunque la risposta o un errore
      return NextResponse.json(
        { error: "Errore interno: output non valido" },
        { status: 500 }
      );
    }

    // Risposta con profilo creato
    return NextResponse.json(outputValidation.data, { status: 201 });
  } catch (error) {
    console.error("Errore nella POST createProfile:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}


// RECUPERO DATI DEL PROFILO


// FUNZIONE PER VEDERE ESISTENZA E COMPLETEZZA PROFILO

export async function GET() {

  try {

    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const isUserComplete = await getUserProfileById(session.user.id);

    if(!isUserComplete) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    return NextResponse.json(isUserComplete, { status: 201 });

  } catch(error) {
        console.error("Errore nel recupero del profilo:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }

}