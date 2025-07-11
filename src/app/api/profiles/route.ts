/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ProfileInputSchema } from "@/modules/profile/schema/ProfileInput";
import { ProfileOutputSchema } from "@/modules/profile/schema/ProfileOutput";
import { createUserProfile, deleteUserProfile, getUserProfileById, updateUserProfile } from "@/modules/profile/services/profile.service";
import { ProfileUpdateInputSchema } from "@/modules/profile/schema/ProfileUpdateInputSchema";
import { ProfileUpdateOutputSchema } from "@/modules/profile/schema/ProfileUpdateOutputSchema";

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


// UPDATE PROFILO

export async function PUT(request: NextRequest) {
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
    const data = {
      ...body
    };

    // Validazione dati in ingresso
    const parseResult = ProfileUpdateInputSchema.safeParse(data);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Dati non validi", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    // Aggiorna profilo con dati validati
    const updatedProfile = await updateUserProfile(session.user.id, parseResult.data);

    if (!updatedProfile) {
      return NextResponse.json(
        { error: "Impossibile aggiornare il profilo" },
        { status: 500 }
      );
    }

    // Validazione opzionale della risposta (se hai uno schema per l'output)
    const outputValidation = ProfileUpdateOutputSchema.safeParse(updatedProfile);
    if (!outputValidation.success) {
      console.error("Profilo aggiornato ma output non valido:", outputValidation.error);
      // Puoi decidere se mandare comunque la risposta o un errore
      return NextResponse.json(
        { error: "Errore interno: output non valido" },
        { status: 500 }
      );
    }

    // Risposta con profilo creato
    return NextResponse.json(outputValidation.data, { status: 201 });
  } catch (error) {
    console.error("Errore nella POST updateProfile:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}


// DELETE PROFILO

export async function DELETE() {
  try {
    // Verifica sessione
    const session = await auth();

    // console.log("Session:", session);

    if (!session) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    // Aggiungi userId estratto dalla sessione
    const userId =  session.user.id

    // Aggiorna profilo con dati validati
    const deletedProfile = await deleteUserProfile(userId);

    if (!deletedProfile) {
      return NextResponse.json(
        { error: "Impossibile eliminare il profilo" },
        { status: 500 }
      );
    }

    // // Validazione opzionale della risposta (se hai uno schema per l'output)
    // const outputValidation = ProfileUpdateOutputSchema.safeParse(deletedProfile);
    // if (!outputValidation.success) {
    //   console.error("Profilo aggiornato ma output non valido:", outputValidation.error);
    //   // Puoi decidere se mandare comunque la risposta o un errore
    //   return NextResponse.json(
    //     { error: "Errore interno: output non valido" },
    //     { status: 500 }
    //   );
    // }

    // Risposta con profilo creato
    return NextResponse.json(deletedProfile, { status: 201 });
  } catch (error) {
    console.error("Errore nella DELETE:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}