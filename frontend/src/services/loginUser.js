import { apiClient } from "./ApiClient"

export const loginUser = async (userData) => {
    return apiClient.loginUser(userData)
}
