/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from "@/lib/auth";
// import { ProfilePreferencesInputSchema } from "@/modules/preferences/schema/ProfilePreferencesInput.schema";
// import { ProfilePreferencesOutputSchema } from "@/modules/preferences/schema/ProfilePreferencesOutput.schema";
import { getUserPreferences } from "@/modules/preferences/services/preferences.service";
import { getUserProfileById } from "@/modules/profile/services/profile.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {

  try {

    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    //console.log(session.user.id)
    const isUserComplete = await getUserProfileById(session.user.id);

    if(!isUserComplete) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    const preferences = await getUserPreferences(Number(session.user.id))


    if(!preferences) {
      return NextResponse.json({ error: "Preferenze non trovate" }, { status: 404 });
    }

    return NextResponse.json(preferences, { status: 201 });

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
  // try {
  //   // Verifica sessione
  //   const session = await auth();

  //   //console.log("Session:", session);

  //   if (!session) {
  //     return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  //   }

  //   // Leggi body JSON
  //   const body = await request.json();

  //   // Aggiungi userId estratto dalla sessione
  //   const data = {
  //     ...body
  //   };

  //   // Validazione dati in ingresso
  //   const parseResult = ProfilePreferencesInputSchema.safeParse(data);
  //   if (!parseResult.success) {
  //     return NextResponse.json(
  //       { error: "Dati non validi", details: parseResult.error.format() },
  //       { status: 400 }
  //     );
  //   }

  //   // Aggiorna profilo con dati validati
  //   const updatedProfile = await updateProfilePreferences(session.user.id, parseResult.data);

  //   if (!updatedProfile) {
  //     return NextResponse.json(
  //       { error: "Impossibile aggiornare il profilo" },
  //       { status: 500 }
  //     );
  //   }

  //   // Validazione opzionale della risposta (se hai uno schema per l'output)
  //   const outputValidation = ProfilePreferencesOutputSchema.safeParse(updatedProfile);
  //   if (!outputValidation.success) {
  //     console.error("Profilo aggiornato ma output non valido:", outputValidation.error);
  //     // Puoi decidere se mandare comunque la risposta o un errore
  //     return NextResponse.json(
  //       { error: "Errore interno: output non valido" },
  //       { status: 500 }
  //     );
  //   }

  //   // Risposta con profilo creato
  //   return NextResponse.json(outputValidation.data, { status: 201 });
  // } catch (error) {
  //   console.error("Errore nella POST updateProfile:", error);
  //   return NextResponse.json(
  //     { error: "Errore interno del server" },
  //     { status: 500 }
  //   );
  // }
}
