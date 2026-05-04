import { toast } from "../hooks/useToast";

export const loginUser = async (userData) => {
    const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000'
    try {
        
        const formData = new URLSearchParams();
        formData.append('username', userData.phone);  // username, не phone_number
        formData.append('password', userData.password);

        const response = await fetch(`${API_BASE_URL}/users/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'include',
            body: formData
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
            throw new Error('Ошибка входа');
        }

        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
        }
        toast.info("Вы успешно вошли в аккаунт!")
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}