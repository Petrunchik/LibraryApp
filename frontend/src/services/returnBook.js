import { apiClient } from "./ApiClient"

export const returnBook = async (returnData) => {
    const requestBody = {
            book_copy_id: returnData.returnBookCopyId,
            comment: returnData.returnComment || null,
        }
    return apiClient.post('/loans/return_book', requestBody)
}