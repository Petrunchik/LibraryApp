export const updateAccessToken = async () => {
    const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000'
    try {
        const response = await fetch(`${API_BASE_URL}/users/refresh-token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        
        const data = await response.json()
        if (!response.ok) {
            if (response.status === 401){
                // Refresh token в cookies истек или невалиден
                localStorage.removeItem('access_token')
                // Можно перенаправить на логин
                // window.location.href = '/login'
            }
            throw new Error('Ошибка обновления токена');
        }
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
        }
        return { success: true }
    } catch (error) {
        return { success: false };
    }
}