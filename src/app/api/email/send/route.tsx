    import { NextRequest, NextResponse } from "next/server";
    import { Resend } from "resend";
    import MyEmail from "@/emails/MyEmail";

    export async function POST(req: NextRequest) {
        try {
            const body = await req.json();
            const { email, token } = body;

            if (!email || !token) {
            return NextResponse.json({ success: false, error: "Email e token sono obbligatori." }, { status: 400 });
            }

            const resend = new Resend(process.env.RESEND_API_KEY);

            // Costruisci il link di reset password usando NEXTAUTH_URL (es. https://tuosito.com)
            const domain = process.env.NEXTAUTH_URL || "http://localhost:3000";
            const redirectUrl = `${domain}/reset-password?token=${encodeURIComponent(token)}`;

            const data = await resend.emails.send({
                from: `onboarding@resend.dev`,
                to: "francivillani06@gmail.com", // invia all'email dell'utente - ora metto la mia per provare
                subject: "Reset della password - Azione richiesta",
                react: <MyEmail resetLink={redirectUrl} email={email} />,
            });

            return NextResponse.json({ success: true, data });
        } catch (error) {
            console.error("Errore invio email:", error);
            return NextResponse.json({ success: false, error: "Errore interno del server" }, { status: 500 });
        }
    }
