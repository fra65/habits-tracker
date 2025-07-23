/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import CreateCategoryResponse from "../types/createCategoryResponse";

export default async function deleteCategory(categoryId: number): Promise<CreateCategoryResponse> {
  try {
    const response = await axios.delete(`/api/categories/${categoryId}`);

    if (!response || !response.data) {
      return { success: false, message: "Nessuna risposta dal server" };
    }

    // Restituisci direttamente i dati del server
    return response.data as CreateCategoryResponse;
  } catch (err: any) {
    console.error("Errore client nella creazione categoria:", err);
    // Gestione messaggio user-friendly per errore unique constraint
    const message = err.response?.data?.message || "Errore nell'eliminazione lato client della categoria";

    return { success: false, message };
  }
}