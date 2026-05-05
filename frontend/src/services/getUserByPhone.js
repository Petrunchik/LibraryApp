import { apiClient } from "./ApiClient"

export const getUserByPhone = (phone) => {
    return apiClient.get(`/users/${phone}/info`)
}