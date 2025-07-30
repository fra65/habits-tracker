/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { deleteCategory, getCategory, updateCategory } from "@/modules/category/services/category.service";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { categoryId: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const id = Number(session.user.id);
    const { categoryId } = context.params;

    const correctId = Number(categoryId)

    if (isNaN(correctId)) {
      return NextResponse.json({ error: "Id non valido" }, { status: 400 });
    }

    const category = await getCategory(correctId, id);

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



export async function DELETE(
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

    const category = await deleteCategory(categoryId, id);

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



export async function PUT(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "Non autenticato" }, { status: 401 });
    }
    const body = await request.json();
    const id = Number(session.user.id);
    const categoryId = Number(params.categoryId);
    const dataWithUserId = { ...body, userId: id };
    if (isNaN(categoryId)) {
      return NextResponse.json({ success: false, message: "ID non valido" }, { status: 400 });
    }
    const category = await updateCategory(dataWithUserId, categoryId, id);
    if (!category) {
      return NextResponse.json({ success: false, message: "Categoria inesistente" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: category }, { status: 200 });
  } catch (error: any) {
    let message = "Errore interno del server";
    // Prisma unique constraint
    if (error?.code === 'P2002' || error?.message?.includes('unique')) {
      message = 'Esiste già una categoria con questo titolo. Scegli un titolo diverso.';
    } else if (error?.message) {
      message = error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
