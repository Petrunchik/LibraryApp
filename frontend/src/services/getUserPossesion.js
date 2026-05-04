import { apiClient } from "./ApiClient";

export const getUserPossesion = () => {
    return apiClient.get("/loans/")
}