import { apiClient } from "./ApiClient"

export const searchBooksByTitle = async (title) => {
    const result = await apiClient.publicGet("/books/?skip=0&limit=200")
    if (!result.success) {
        return result
    }

    const query = title.trim().toLowerCase()
    const books = Array.isArray(result.data) ? result.data : []
    const matchedBooks = books.filter((book) => book.title?.toLowerCase().includes(query))

    return { success: true, data: matchedBooks }
}
