import { apiClient } from "./ApiClient";

export const managersList = () => {
    return apiClient.get("/users/manager/list")
}

export const addManager = (data) => {
    return apiClient.post("/users/manager/add", data)
}

export const demoteManager = (data) => {
    return apiClient.patch("/users/manager/demote", data)
}

export const toggleStatus = (phone) => {
    return apiClient.patch(`/users/${phone}/status`)
}

export const addNewBook = (data) => {
    return apiClient.post("/books", data)
}

export const getBookInfo = (bookId) => {
    return apiClient.get(`/books/${bookId}/info`)
}

export const addBookCopy = (data) => {
    return apiClient.post("/bookCopy/", data)
}