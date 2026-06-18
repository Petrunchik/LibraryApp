import { apiClient } from "./ApiClient"
import { RedirectToHome } from "./redirectToHome"

export const logout = async () => {
    const result = await apiClient.logoutUser()

    if (result.success) {
        RedirectToHome()
    }

    return result
}

export const logoutUser = logout
