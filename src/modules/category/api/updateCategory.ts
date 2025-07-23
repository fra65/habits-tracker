/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import CreateCategoryResponse from "../types/createCategoryResponse";

export default async function updateCategory(data: any, categoryId: number | undefined): Promise<CreateCategoryResponse> {
  try {

    if( isNaN(Number(categoryId)) ) {
      return { success: false, message: "ID categoria non valido" };
    }

    const response = await axios.put(`/api/categories/${categoryId}`, data);

    if (!response || !response.data) {
      return { success: false, message: "Nessuna risposta dal server" };
    }

    // Restituisci direttamente i dati del server
    return response.data as CreateCategoryResponse;
  } catch (err: any) {
    console.error("Errore client nell'update della categoria:", err);
    // Gestione messaggio user-friendly per errore unique constraint
    let message = err.response?.data?.message || "Errore nell'update lato client della categoria";
    if (err.response?.status === 409 && message.includes('Esiste già una categoria')) {
      message = 'Esiste già una categoria con questo titolo. Scegli un titolo diverso.';
    }
    return { success: false, message };
  }
}
