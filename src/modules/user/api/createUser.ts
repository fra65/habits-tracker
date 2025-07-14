/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export async function createUser(username: string, email: string, password: string, provider: string) {
  try {
    const response = await axios.post('/api/users', {
      username,
      email,
      password,
      provider
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    // Se Axios ha una risposta dal server, estrai il messaggio specifico
    if (error.response && error.response.data) {
      // Supponiamo che il backend mandi un messaggio in error.response.data.message
      const message = error.response.data.message || "Username o email già esistenti";
      throw new Error(message);
    }
    // Altrimenti rilancia il messaggio generico di errore
    throw new Error(error.message || "Errore imprevisto. Riprovare tra qualche minuto");
  }
}
