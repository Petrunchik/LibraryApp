import { apiClient } from "./ApiClient";


export const getReservationInfo = () => {
    return apiClient.get("/users/reservations")
}