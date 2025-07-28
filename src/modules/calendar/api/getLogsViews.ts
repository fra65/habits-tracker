import axios from "axios";
import { LogsView } from "../schema/LogsView.schema";

export default async function getLogsViews(): Promise<LogsView[]> {
    try {

        const logsViews = await axios.get('/api/habit-log')

        return logsViews.data;
    } catch(err) {
        console.error("Errore nel recupero dei log lato client: ", err)
        throw new Error("ERRORONE")
    }
}