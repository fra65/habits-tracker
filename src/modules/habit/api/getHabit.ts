import axios from "axios";

export default async function getHabit(habitId: number) {

    try {

        const response = await axios.get(`/api/habits/${habitId}`)

        if(!response) return null

        return response.data
    } catch(err) {
        console.error("Errore: ", err)
        throw new Error("Errore client nel recupero dell'abitudine")
    }

}