import axios from "axios";
import { ProfileInputClient } from "../schema/ProfileInput";
import { ProfileOutput } from "../schema/ProfileOutput";

export default async function createdProfile(data: ProfileInputClient): Promise<ProfileOutput | null | undefined> {

    try {
    const response = await axios.post("/api/profiles", data);
    return response.data;
  } catch (error) {
    // Puoi gestire l’errore qui o rilanciarlo
    throw error;
  }

}