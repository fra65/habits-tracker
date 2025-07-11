/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export default async function getIsCompleteProfile(): Promise<boolean | null> {
  try {
    const response = await axios.get("/api/profiles/check-profile");
    return response.data.isComplete; // assumendo che la risposta sia { isComplete: boolean }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        // Profilo non trovato, consideralo come profilo da completare
        return false;
      }
    }
    // Rilancia altri errori
    throw error;
  }
}
