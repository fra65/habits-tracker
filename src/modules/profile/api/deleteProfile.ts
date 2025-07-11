import axios from "axios";
// import { ProfileDeleteOutput } from "../schema/ProfileOutput";

export default async function deleteProfile(): Promise<boolean | null | undefined> {

    try {
    const response = await axios.delete("/api/profiles");
    return response.data;
  } catch (error) {
    // Puoi gestire l’errore qui o rilanciarlo
    throw error;
  }

}