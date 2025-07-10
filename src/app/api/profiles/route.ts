/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

  const session = await auth()
  
  
  if (!session) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const user = session.user;

  return NextResponse.json({
    message: "Utente autenticato",
    userId: user.id,
    role: user.role,
  });
}
