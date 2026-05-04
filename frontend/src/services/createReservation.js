import { apiClient } from "./ApiClient";

export const createReservation = (bookId) => {
    return apiClient.post("/reservation/", {"book_id": bookId})
}