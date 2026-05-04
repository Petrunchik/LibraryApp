import { apiClient } from "./ApiClient";

export const reservationGet = () => {
    return apiClient.get("/reservation/")
}

export const reservationModerate = (data) => {
    return apiClient.post("/reservation/moderate", data)
}