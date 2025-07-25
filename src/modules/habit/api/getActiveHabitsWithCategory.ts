import axios from "axios";
import { HabitCategoryOutput } from "../schema/HabitCategoryOutputSchema";

export default async function getActiveHabitsWithCategory(): Promise<HabitCategoryOutput[] | null> {

    try {

        const response = await axios.get('/api/habits-categories/actives')

        if(!response) return null

        return response.data
    } catch(err) {
        console.error("Errore: ", err)
        throw new Error("Errore client nel recupero delle abitudini + categorie")
    }

}