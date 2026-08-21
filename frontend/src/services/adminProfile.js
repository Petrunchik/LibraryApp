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

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const getAuthors = () => {
    return apiClient.publicGet("/authors/")
}

export const getGenres = () => {
    return apiClient.publicGet("/genres/")
}

export const getPublishers = () => {
    return apiClient.publicGet("/publishers/")
}

const findBookInList = async (query) => {
    const result = await apiClient.publicGet("/books/?skip=0&limit=200")
    if (!result.success) {
        return result
    }

    const books = Array.isArray(result.data) ? result.data : []
    const value = query.trim().toLowerCase()
    const match = books.find((book) => (
        book.id === query
        || book.book_public_id?.toLowerCase() === value
        || book.title?.toLowerCase() === value
        || book.title?.toLowerCase().includes(value)
    ))

    if (!match) {
        return { success: false, error: "Книга не найдена" }
    }

    return apiClient.publicGet(`/books/${match.id}/info`)
}

export const addNewBook = (data) => {
    return apiClient.post("/books", data)
}

export const getBookInfo = (bookId) => {
    const query = bookId.trim()
    if (UUID_PATTERN.test(query)) {
        return apiClient.publicGet(`/books/${query}/info`)
    }

    return findBookInList(query)
}

export const addBookCopy = (data) => {
    return apiClient.post("/bookCopy/", data)
}

export const editBook = (bookPublicId, data) => {
    return apiClient.put(`/books/${bookPublicId}`, data)
}

export const deleteBook = (bookPublicId) => {
    return apiClient.delete(`/books/${bookPublicId}?book_public_id=${encodeURIComponent(bookPublicId)}`)
}