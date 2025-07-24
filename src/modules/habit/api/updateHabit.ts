/* eslint-disable @typescript-eslint/no-unused-vars */
import CreateHabitResponse from "../types/CreateHabitResponse";
import { HabitUpdateInputClient } from "../schema/HabitUpdateInput.schema";
import axios from "axios";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function updateHabit(data: HabitUpdateInputClient, habitId: number | undefined) {

    try {

        if( isNaN(Number(habitId)) ) {
        return { success: false, message: "ID abitudine non valido" };
        }

        const response = await axios.put(`/api/habits/${habitId}`, data);

        if (!response || !response.data) {
        return { success: false, message: "Nessuna risposta dal server" };
        }

        // Restituisci direttamente i dati del server
        return response.data as CreateHabitResponse;

    } catch (err: any) {

        console.error("Errore client nell'update della habit:", err);
        // Gestione messaggio user-friendly per errore unique constraint
        let message = err.response?.data?.message || "Errore nell'update lato client della abitudine";
        if (err.response?.status === 409 && message.includes('Esiste già una abitudine')) {
        message = 'Esiste già una abitudine con questo titolo. Scegli un titolo diverso.';
        }
        return { success: false, message };

    }
}