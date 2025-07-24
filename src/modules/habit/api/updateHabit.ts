/* eslint-disable @typescript-eslint/no-unused-vars */
import CreateHabitResponse from "../types/CreateHabitResponse";
import { HabitUpdateInputClient } from "../schema/HabitUpdateInput.schema";
import axios from "axios";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updateHabit(data: HabitUpdateInputClient, habitId: number | undefined) {

    try {

        if( isNaN(Number(habitId)) ) {
        return { success: false, message: "ID categoria non valido" };
        }

        const response = await axios.put(`/api/categories/${habitId}`, data);

        if (!response || !response.data) {
        return { success: false, message: "Nessuna risposta dal server" };
        }

        // Restituisci direttamente i dati del server
        return response.data as CreateHabitResponse;

    } catch (err: any) {

        console.error("Errore client nell'update della habit + categoria:", err);
        // Gestione messaggio user-friendly per errore unique constraint
        let message = err.response?.data?.message || "Errore nell'update lato client della categoria";
        if (err.response?.status === 409 && message.includes('Esiste già una categoria')) {
        message = 'Esiste già una categoria con questo titolo. Scegli un titolo diverso.';
        }
        return { success: false, message };

    }
}