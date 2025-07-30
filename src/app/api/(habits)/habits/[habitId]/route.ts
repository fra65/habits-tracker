/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { deleteHabit, getHabit, updateHabits } from "@/modules/habit/services/habit.service";
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


export async function DELETE(
  request: Request,
  context: { params: { habitId: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const { habitId } = context.params
    const validateId = Number(habitId)

    const id = Number(session.user.id);


    if (isNaN(validateId)) {
      return NextResponse.json({ error: "ID non valido" }, { status: 400 });
    }

    const habit = await deleteHabit(validateId, id);

    // console.log(habit)

    if (!habit) {
      return NextResponse.json({ error: "Abitudine inesistente" }, { status: 404 });
    }

    return NextResponse.json(habit, { status: 200 });
  } catch (error) {
    console.error("Errore nel recupero dell'abitudine + categoria:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}



export async function PUT(
  request: Request,
  context: { params: { habitId: string } }
) {
  

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Non autenticato" }, { status: 401 });
    }
    const body = await request.json();

    const { habitId } = context.params
    const correctId = Number(habitId)

    const id = Number(session.user.id);

    const dataWithUserId = { ...body, userId: id };
    if (isNaN(correctId)) {
      return NextResponse.json({ success: false, message: "ID non valido" }, { status: 400 });
    }
    const habit = await updateHabits(dataWithUserId, correctId, id);
    if (!habit) {
      return NextResponse.json({ success: false, message: "Abitudine inesistente" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: habit }, { status: 200 });
  } catch (error: any) {
    let message = "Errore interno del server";
    // Prisma unique constraint
    if (error?.code === 'P2002' || error?.message?.includes('unique')) {
      message = "Esiste già un'habit con questo titolo. Scegli un titolo diverso.";
    } else if (error?.message) {
      message = error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
