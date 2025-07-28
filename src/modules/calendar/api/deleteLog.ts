/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import DeleteResponse from "../types/DeleteResponse";

export default async function deleteLog(habitId: number, logDate: Date): Promise<DeleteResponse> {
  const correctDate = logDate.toISOString();

  try {
    await axios.delete(`/api/habit-log/${habitId}_${correctDate}`);

    // Qui la richiesta ha successo (status 200)
    return { isDelete: true, message: "Log eliminato correttamente!" };

  } catch (error: any) {
    // Controlla se è un errore axios con response
    if (error.response) {
      if (error.response.status === 404) {
        console.error("Log inesistente");
        return { isDelete: false, message: "Log non trovato" };
      }

      if (error.response.status === 500) {
        console.error("Errore interno del server");
        return { isDelete: false, message: "Errore temporaneo imprevisto. Riprovare più tardi" };
      }
    }

    // Errore di rete o altro
    console.error("Errore imprevisto durante l'eliminazione:", error);
    return { isDelete: false, message: "Errore imprevisto nell'eliminazione" };
  }
}
