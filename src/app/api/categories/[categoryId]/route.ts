import { auth } from "@/lib/auth";
import { getCategory } from "@/modules/category/services/category.service";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const id = Number(session.user.id);
    const categoryId = Number(params.categoryId);

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "ID non valido" }, { status: 400 });
    }

    const category = await getCategory(categoryId, id);

    if (!category) {
      return NextResponse.json({ error: "Categoria inesistente" }, { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Errore nel recupero della categoria:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}
