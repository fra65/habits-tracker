import axios from "axios";

export default async function getCategory(categoryId: number) {

    try {

        const response = await axios.get(`/api/categories/${categoryId}`)

        if(!response) return null

        return response.data
    } catch(err) {
        console.error("Errore: ", err)
        throw new Error("Errore nel recupero della categoria")
    }

}