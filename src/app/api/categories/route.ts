/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { createCategory, getAllCategories } from "@/modules/category/services/category.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";


// POST route
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Non autenticato" }, { status: 401 });
    }

    const body = await req.json();
    const dataWithUserId = { ...body, userId: Number(session.user.id) };

    const category = await createCategory(dataWithUserId);

    return NextResponse.json({ success: true, data: category, message: "Categoria creata correttamente!" }, { status: 201 });
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
      message: 'Errore interno del server'
    }, { status: 500 });
  }
}


// GET
export async function GET() {

  try {

    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 402 });
    }

    const id = Number(session.user.id)

    //console.log(session.user.id)
    const categories = await getAllCategories(id);

    if(!categories) {
      return NextResponse.json({ error: "Categorie inesistenti" }, { status: 404 });
    }

    return NextResponse.json(categories, { status: 201 });

  } catch(error) {
        console.error("Errore nel recupero delle categorie:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }

}

// PUT
// DELETE