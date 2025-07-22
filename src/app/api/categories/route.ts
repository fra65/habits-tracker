// POST

import { auth } from "@/lib/auth";
import { getAllCategories } from "@/modules/category/services/category.service";
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