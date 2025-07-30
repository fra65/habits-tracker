import { auth } from "@/lib/auth";
import { deleteHabitLog } from "@/modules/calendar/service/habitLog.service";
import { NextResponse } from "next/server";

// Nota il cambio da "request" e "context" come parametri
export async function DELETE(
  request: Request,
  context: { params: { habitId_logDate: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const { habitId_logDate } = context.params;

    // Divido i due parametri con un underscore
    const [habitIdStr, logDateStr] = habitId_logDate.split("_");

    // Validazione semplice
    if (!habitIdStr || !logDateStr) {
      return NextResponse.json({ error: "Parametri mancanti" }, { status: 400 });
    }

    const habitId = Number(habitIdStr);

    if (Number.isNaN(habitId)) {
      return NextResponse.json({ error: "habitId non valido" }, { status: 400 });
    }

    const id = Number(session.user.id);

    const habit = await deleteHabitLog(habitId, logDateStr, id);

    if (!habit) {
      return NextResponse.json({ error: "Log inesistente" }, { status: 404 });
    }

    return NextResponse.json(habit, { status: 200 });
  } catch (error) {
    console.error("Errore nel recupero del log:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}
