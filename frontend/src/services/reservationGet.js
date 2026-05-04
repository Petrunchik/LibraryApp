export const reservationGet = async () => {
    const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000'
    try {

        const response = await fetch(`${API_BASE_URL}/reservation/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        
        const data = await response.json()
        console.log(data)
        if (!response.ok) {
            throw new Error('Ошибка получения бронирований');
        }
        return data
    } catch (error) {
        return { success: false, error: error.message };
    }
}