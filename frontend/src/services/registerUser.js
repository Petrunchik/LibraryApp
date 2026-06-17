import { apiClient } from "./ApiClient"

export const registerUser = async (userData) => {
    return apiClient.registerUser(userData)
}
