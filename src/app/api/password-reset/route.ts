// /app/api/reset-password/route.ts (Next.js 13+ con app router)
import { NextResponse } from "next/server";
import { resetPassword } from "@/modules/auth/services/auth.service";

export async function POST(request: Request) {
  try {
    const { email, token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token e password sono obbligatori" },
        { status: 400 }
      );
    }

    const result = await resetPassword({ email, token, password });

    if (!result.success) {
      return NextResponse.json(
        { message: result.message || "Errore nel reset della password" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Password aggiornata con successo" });
  } catch (error) {
    console.error("Errore API reset-password:", error);
    return NextResponse.json(
      { message: "Errore interno del server" },
      { status: 500 }
    );
  }
}
