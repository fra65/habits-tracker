/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import CreateCategoryResponse from "../types/createCategoryResponse";
import { CategoryInput } from "../schema/CategoryInput.schema";

export default async function createCategory(data: CategoryInput): Promise<CreateCategoryResponse> {
  try {
    const response = await axios.post('/api/categories', data);
    if (!response || !response.data) {
      return { success: false, message: "Nessuna risposta dal server" };
    }
    // Se la risposta contiene il messaggio user-friendly, lo mostro sempre
    if (
      response.data?.message &&
      response.data.message.normalize('NFKD').replace(/[^a-zA-Z ]/g, '').includes('Esiste gia una categoria')
    ) {
      return {
        success: false,
        message: 'Esiste già una categoria con questo titolo. Scegli un titolo diverso.'
      };
    }
    return response.data as CreateCategoryResponse;
  } catch (err: any) {
    console.error("Errore client nella creazione categoria:", err);
    let message = err.response?.data?.message || "Errore nella creazione lato client della categoria";
    if (
      message.normalize('NFKD').replace(/[^a-zA-Z ]/g, '').includes('Esiste gia una categoria')
    ) {
      message = 'Esiste già una categoria con questo titolo. Scegli un titolo diverso.';
    }
    return { success: false, message };
  }
}
