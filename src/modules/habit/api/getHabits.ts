import axios from "axios";

export default async function getHabits() {

    try {

        const response = await axios.get('/api/habits')

        if(!response) return null

        return response.data
    } catch(err) {
        console.error("Errore: ", err)
        throw new Error("Errore client nel recupero delle abitudini")
    }

}