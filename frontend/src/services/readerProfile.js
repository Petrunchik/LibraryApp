import { apiClient } from "./ApiClient"

export const getUserHistoryReading = () => {
    return apiClient.get("/users/history-reading/")
}

export const addBookGrade = (data) => {
    return apiClient.post("/books/add-grade", data)
}