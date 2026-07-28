import { apiClient } from "./ApiClient"

export const searchBooksByTitle = (title) => {
    return apiClient.get(`/books/search?title=${encodeURIComponent(title)}`)
}
