import { apiClient } from "./ApiClient"

export const logout = async () => {
    return apiClient.logoutUser()
}

export const logoutUser = logout
