/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import CreateCategoryResponse from "../types/createCategoryResponse";

export default async function createCategory(data: any): Promise<CreateCategoryResponse> {
  try {
    const response = await axios.post('/api/categories', data);

    if (!response || !response.data) {
      return { success: false, message: "Nessuna risposta dal server" };
    }

    // Restituisci direttamente i dati del server
    return response.data as CreateCategoryResponse;
  } catch (err: any) {
    console.error("Errore client nella creazione categoria:", err);
    // Gestione messaggio user-friendly per errore unique constraint
    let message = err.response?.data?.message || "Errore nella creazione lato client della categoria";
    if (err.response?.status === 409 && message.includes('Esiste già una categoria')) {
      message = 'Esiste già una categoria con questo titolo. Scegli un titolo diverso.';
    }
    return { success: false, message };
  }
}
