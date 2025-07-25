import { auth } from "@/lib/auth";
import { getAllActiveHabitsWithCategory } from "@/modules/habit/services/habit.service";
import { NextResponse } from "next/server";

// GET
export async function GET() {

  try {

    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 402 });
    }

    const id = Number(session.user.id)

    //console.log(session.user.id)
    const habits = await getAllActiveHabitsWithCategory(id);

    if(!habits) {
      return NextResponse.json({ error: "Abitudini + categorie inesistenti" }, { status: 404 });
    }

    return NextResponse.json(habits, { status: 201 });

  } catch(error) {
        console.error("Errore route nel recupero delle  + cat:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }

}
