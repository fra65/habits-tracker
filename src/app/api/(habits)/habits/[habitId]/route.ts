import { auth } from "@/lib/auth";
import { getHabit } from "@/modules/habit/services/habit.service";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { habitId: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const paramsResolved = await params;

    const id = Number(session.user.id);
    const habitId = Number(paramsResolved.habitId);

    if (isNaN(habitId)) {
      return NextResponse.json({ error: "ID non valido" }, { status: 400 });
    }

    const habit = await getHabit(habitId, id);

    if (!habit) {
      return NextResponse.json({ error: "Abitudine inesistente" }, { status: 404 });
    }

    return NextResponse.json(habit, { status: 200 });
  } catch (error) {
    console.error("Errore nel recupero dell'abitudine:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}
