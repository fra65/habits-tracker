/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ProfileUpdateOutput } from "../schema/ProfileUpdateOutputSchema";
// import { ProfileUpdateInput } from "../schema/ProfileUpdateInputSchema";

export default async function updateProfile(data: any): Promise<ProfileUpdateOutput | null | undefined> {

    try {
    const response = await axios.put("/api/profiles", data);
    return response.data;
  } catch (error) {
    // Puoi gestire l’errore qui o rilanciarlo
    throw error;
  }

}