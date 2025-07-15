import { auth } from "@/lib/auth";
import { getUser } from "@/modules/user/services/user.service";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {

  try {

    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { id } = params; // <-- qui prendi l'id dalla URL

    //console.log(session.user.id)
    const user = await getUser(id);

    if(!user) {
      return NextResponse.json({ error: "Utente inesistente" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 201 });

  } catch(error) {
        console.error("Errore nel recupero del profilo:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }

}