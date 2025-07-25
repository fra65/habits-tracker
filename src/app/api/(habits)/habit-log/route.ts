import { auth } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Non autenticato" }, { status: 401 });
    }

    const userId = Number(session.user.id)

    const body = await req.json();
    const dataWithUserId = { ...body, userId: userId };

    const validateData = HabitInputSchema.safeParse(dataWithUserId)

    if(!validateData.success) {
      return NextResponse.json({ success: false, message: 'Errore validazione nella route in input POST'})
    }

    const response = await createHabit(validateData.data);

    if (!response.success) {
      // Se il messaggio è quello user-friendly, status 409
      if (response.message && response.message.includes("Esiste già un'abitudine")) {
        return NextResponse.json({ success: false, message: response.message }, { status: 409 });
      }
      // Altri errori
      return NextResponse.json({ success: false, message: response.message }, { status: 400 });
    }
    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error("Errore nella route POST:", error);

    // Controllo se è errore Prisma di vincolo unico
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        message: 'Esiste già una categoria con questo titolo. Scegli un titolo diverso.'
      }, { status: 409 });
    }

    // Se è un altro tipo di errore, rispondi genericamente
    return NextResponse.json({
      success: false,
      message: "Esiste già un'abitudine con questo titolo. Scegli un titolo diverso."
    }, { status: 500 });
  }
}
