/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export default async function createCategory(data: any) {

    try {

        const response = await axios.post('/api/categories', data)

        if(!response) return null

        return response.data
    } catch(err) {
        console.error("Errore: ", err)
        throw new Error("Errore nella creazione lato client della categoria")
    }

}