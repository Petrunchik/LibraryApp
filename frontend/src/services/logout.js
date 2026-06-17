import { apiClient } from "./ApiClient"

export const logoutUser = async () => {
    return apiClient.logoutUser()
}