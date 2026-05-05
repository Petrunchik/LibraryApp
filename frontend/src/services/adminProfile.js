import { apiClient } from "./ApiClient";

export const managersList = () => {
    return apiClient.get("/users/manager/list")
}

export const addManager = (data) => {
    return apiClient.post("/users/manager/add", data)
}

export const demoteManager = (data) => {
    console.log(data)
    return apiClient.patch("/users/manager/demote", data)
}