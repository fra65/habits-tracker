// /app/api/preferences/default/route.ts
import { NextResponse } from "next/server"

const defaultPreferences = {
  theme: "system",
  sidebarDefaultOpen: true,
  sidebarOpenShortcut: "b",
  sidebarSide: "left",
  sidebarType: "floating",
  lang: "it",
}

export async function GET() {
  return NextResponse.json(defaultPreferences)
}
