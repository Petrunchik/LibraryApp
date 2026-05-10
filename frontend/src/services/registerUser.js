import { toast } from "../hooks/useToast"

export const registerUser = async (userData) => {
    const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000'

    try {
        const requestBody = {
            role: userData.role || "reader",
            first_name: userData.name,
            last_name: userData.lastName,
            phone_number: userData.phone,
            password: userData.password
        }

        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(requestBody)
        })
        
        const data = await response.json()
        if(response.status === 409){
            throw new Error(response.status, {
                cause: {
                    status: response.status,
                    message: data.detail
                }
            })
        } else if (!response.ok) {
            throw new Error('Ошибка регистрации');
        }
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
        }
        toast.info("Вы успешно зарегистрировались!")
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}