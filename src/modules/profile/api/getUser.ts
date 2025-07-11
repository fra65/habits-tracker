import axios from "axios";
import { ProfileOutput } from "../schema/ProfileOutput";

export default async function getUserProfile(): Promise<ProfileOutput | null | undefined> {

    try {
    const response = await axios.get("/api/profiles");

    return response.data;
  } catch (error) {
    // Puoi gestire l’errore qui o rilanciarlo
    throw error;
  }

}