/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export async function createUser(username: string, email: string, password: string) {
  try {
    const response = await axios.post('/api/users', {
      username,
      email,
      password,
    });

    console.log('Risposta dal server:', response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Errore durante la chiamata API:', error);
    throw new Error(error)
  }
}
