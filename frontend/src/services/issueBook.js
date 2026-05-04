export const issueBook = async (loanData) => {
    const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000'
    try {
        
        const requestBody = {
            user_id: loanData.readerId,
            book_copy_id: loanData.bookCopyId,
            days: loanData.days,
        }

        const response = await fetch(`${API_BASE_URL}/loans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(requestBody)
        })
        
        const data = await response.json()
        if (!response.ok) {
            throw new Error('Ошибка выдачи');
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}