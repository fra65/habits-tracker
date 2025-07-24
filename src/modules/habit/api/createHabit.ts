/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { HabitInputClient } from "../schema/HabitsInput.schema";
import CreateHabitResponse from "../schema/CreateHabitResponse";

export default async function createHabit(data: HabitInputClient): Promise<CreateHabitResponse> {
  try {

    const response = await axios.post('/api/habits', data);

    if (!response || !response.data) {
      return { success: false, message: "Nessuna risposta dal server" };
    }
    // Se la risposta contiene il messaggio user-friendly, lo mostro sempre
    if (
      response.data?.message &&
      response.data.message.normalize('NFKD').replace(/[^a-zA-Z ]/g, '').includes("Esiste gia un'abitudine")
    ) {
      return {
        success: false,
        message: "Esiste già un'abitudine con questo titolo. Scegli un titolo diverso."
      };
    }
    return response.data as CreateHabitResponse;
  } catch (err: any) {
    console.error("Errore client nella creazione abitudine:", err);
    let message = err.response?.data?.message || "Errore nella creazione lato client dell'abitudine";
    if (
      message.normalize('NFKD').replace(/[^a-zA-Z ]/g, '').includes("Esiste già un'abitudine")
    ) {
      message = "Esiste già un'abitudine con questo titolo. Scegli un titolo diverso.";
    }
    return { success: false, message };
  }
}
