import axios from "axios";
import { UserOutputAdmin } from "../schema/usersOutputAdmin.schema";

type GetUsersResult = {
  data: UserOutputAdmin[] | null;
  message: string | null;
  error: boolean;
};

export async function getUsers(): Promise<GetUsersResult> {

  try {
    const response = await axios.get(`/api/admin/users`);
    return {
      data: response.data,
      message: "Utenti caricati con successo.",
      error: false,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;

      if (status === 404) {
        return {
          data: null,
          message: "Utenti non trovati (404)",
          error: true,
        };
      }
      if (status === 401) {
        return {
          data: null,
          message: "Non autorizzato (401)",
          error: true,
        };
      }
      if (status === 500) {
        return {
          data: null,
          message: "Errore interno del server (500)",
          error: true,
        };
      }

      return {
        data: null,
        message: `Errore sconosciuto (${status || "nessun codice"})`,
        error: true,
      };
    } else {
      return {
        data: null,
        message: "Errore imprevisto.",
        error: true,
      };
    }
  }
}
