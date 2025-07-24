/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import CreateHabitResponse from "../types/CreateHabitResponse";

export default async function deleteHabit(habitId: number): Promise<CreateHabitResponse | null> {
    
  try {
    const response = await axios.delete(`/api/habits-categories/${habitId}`);

    if (!response || !response.data) {
      return { success: false, message: "Nessuna risposta dal server" };
    }

    // Restituisci direttamente i dati del server
    return response.data as CreateHabitResponse;
  } catch (err: any) {
    // Stampa solo se c'è una vera risposta di errore
    if (err.response) {
      console.error("Errore client nella eliminazione categoria:", err);
    }
    const message = err.response?.data?.message || "Errore nell'eliminazione lato client della categoria";
    return { success: false, message };
  }


}