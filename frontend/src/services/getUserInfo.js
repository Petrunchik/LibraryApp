import { apiClient } from "./ApiClient";

let userInfoPromise = null

export const getUserInfo = () => {
    if (!apiClient.hasAccessToken()) {
        return Promise.resolve({
            success: false,
            error: "Требуется авторизация",
            status: 401,
            errorStatus: 401
        })
    }

    if (!userInfoPromise) {
        userInfoPromise = apiClient.get("/users/info")
            .finally(() => {
                userInfoPromise = null
            })
    }

    return userInfoPromise
}
