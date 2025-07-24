import axios from "axios";
import { CategoryOutput } from "../schema/CategoryOutput.schema";

export default async function getCategories(): Promise<CategoryOutput[] | null> {

    try {

        const response = await axios.get('/api/categories')

        if(!response) return null

        return response.data
    } catch(err) {
        console.error("Errore: ", err)
        throw new Error("Errore nel recupero delle categorie")
    }

}