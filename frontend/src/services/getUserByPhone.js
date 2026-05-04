import { updateAccessToken } from "./updateAccessToken"

export const getUserByPhone = async (phone, retryCount = 0) => {
    const MAX_RETRIES = 1
    const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000'

    try {
        const token = localStorage.getItem('access_token')

        const response = await fetch(`${API_BASE_URL}/users/${phone}/info`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            credentials: 'include',
        })
        
        const data = await response.json()

        if (!response.ok) {
            if (response.status === 401 && retryCount < MAX_RETRIES){
                console.log("Сессия истекла, пробуем обновить токен...")

                const refreshResult = await updateAccessToken()
                if (refreshResult.success) {
                    console.log("Токен успешно обновлен")
                    return await getUserByPhone(phone, retryCount + 1)
                } else {
                    throw new Error("Сессия истекла, необходимо войти заново")
                }
            }
            throw new Error('Ошибка получения пользователя');
        }
        return { success: true, data }
    } catch (error) {
        return { success: false, error: error.message };
    }
}