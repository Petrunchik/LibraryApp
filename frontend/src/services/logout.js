import { toast } from "../hooks/useToast"
import { RedirectToHome } from "./redirectToHome"

export const logout = async () => {
    const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000'
    try{
        const response = await fetch(`${API_BASE_URL}/users/signout`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })

        localStorage.removeItem('access_token')
        if (!response.ok) {
            throw new Error("Ошибка выхода")
        }
        toast.info("Вы успешно вышли из аккаунта")
        RedirectToHome()
        return
    }
    catch (error){
        return { success: false, error: error.message };
    }
}