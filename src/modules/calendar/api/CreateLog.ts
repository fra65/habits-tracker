import axios from "axios";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function CreateLog(data: any) {

    // console.log("DATA NELLA API CLIENT: ", data.logDate)

    const response = await axios.post('/api/habit-log', data)

    if(!response) {
        console.error("Errore client nella creazione del log")
        return null
    }

    return response.data

}