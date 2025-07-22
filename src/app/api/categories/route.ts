import { auth } from "@/lib/auth";
import { createCategory, getAllCategories } from "@/modules/category/services/category.service";
import { NextRequest, NextResponse } from "next/server";

// POST
export async function POST(req: NextRequest) {

  try {

    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 402 });
    }

    const body = await req.json()

    console.log("Dati RICEVUTI NELLA ROUTE: ", body)     

    const dataWithUserId = {
      ...body,
      userId: Number(session.user.id),
    };

    //console.log(session.user.id)
    const category = await createCategory(dataWithUserId);

    if(!category) {
      return NextResponse.json({ error: "Categoria non creata" }, { status: 404 });
    }

    return NextResponse.json(category, { status: 201 });

  } catch(error) {
        console.error("Errore nel recupero della categoria post creazione:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
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