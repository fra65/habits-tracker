// FUNZIONE PER VEDERE TUTTI GLI UTENTI (SENZA INFO SENSIBILI)

import { auth } from "@/lib/auth";
import { getAllUsers } from "@/modules/user/services/user.service";
import { NextResponse } from "next/server";

export async function GET() {

  try {

    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 402 });
    }


    if (session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Non autorizzato: " }, { status: 401 });
    }

    //console.log(session.user.id)
    const users = await getAllUsers();

    if(!users) {
      return NextResponse.json({ error: "Utenti inesistenti" }, { status: 404 });
    }

    return NextResponse.json(users, { status: 201 });

  } catch(error) {
        console.error("Errore nel recupero del profilo:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }

}
