export const returnBook = async (returnData) => {
    const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000'
    try {
        
        const requestBody = {
            book_copy_id: returnData.returnBookCopyId,
            comment: returnData.returnComment || null,
        }

        const response = await fetch(`${API_BASE_URL}/loans/return_book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(requestBody)
        })
        
        const data = await response.json()
        if (!response.ok) {
            throw new Error('Ошибка возврата');
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}