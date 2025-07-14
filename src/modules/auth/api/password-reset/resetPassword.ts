import axios from "axios";

export async function resetPassword(token: string, password: string) {
    const result = await axios.post("/api/password-reset", {
        token,
        password: password,
    });

    if(!result) {
        return null
    }

    return result
}