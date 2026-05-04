import { apiClient } from "./ApiClient";


export const getUserInfo = () => {
    return apiClient.get("/users/info")
}