import { auth } from "@/lib/auth";
import { getUserLangPreferences } from "@/modules/preferences/services/preferences.service";
import { getUserProfileById } from "@/modules/profile/services/profile.service";
import { NextResponse } from "next/server";

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

    const preferences = await getUserLangPreferences(Number(session.user.id))


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