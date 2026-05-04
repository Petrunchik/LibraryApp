import { updateAccessToken } from "./updateAccessToken"

class ApiClient {
    constructor() {
        this.baseURL = import.meta.env.API_BASE_URL || 'http://localhost:8000'
        this.maxRetries = 1
    }

    // Приватный метод для заголовков
    #getHeaders(requiresAuth = true, customHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...customHeaders
        }

        if (requiresAuth) {
            const token = localStorage.getItem('access_token')
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }
        }

        return headers
    }

    // Основной метод запроса
    async #request(url, options = {}, retryCount = 0) {
        const {
            method = 'GET',
            body = null,
            requiresAuth = true,
            headers = {}
        } = options

        const fetchOptions = {
            method,
            headers: this.#getHeaders(requiresAuth, headers),
            credentials: 'include',
        }

        if (body) {
            fetchOptions.body = JSON.stringify(body)
        }

        try {
            const response = await fetch(`${this.baseURL}${url}`, fetchOptions)
            
            // Обработка пустого ответа
            if (response.status === 204) {
                return { success: true, data: null }
            }

            const data = await response.json()

            if (!response.ok) {
                // Обработка 401 с повторной попыткой
                if (response.status === 401 && retryCount < this.maxRetries && requiresAuth) {
                    console.log("Сессия истекла, пробуем обновить токен...")
                    const refreshResult = await updateAccessToken()
                    
                    if (refreshResult.success) {
                        console.log("Токен успешно обновлен")
                        return this.#request(url, options, retryCount + 1)
                    }
                    return { 
                        success: false, 
                        error: "Сессия истекла, необходимо войти заново",
                        status: 401,
                        errorStatus: 401
                    }
                }
                
                return { 
                    success: false, 
                    error: data.detail || data.message || `Ошибка ${method} запроса`,
                    status: response.status,
                    errorStatus: response.status
                }
            }

            return { success: true, data }
        } catch (error) {
            return { success: false, error: error.message, errorStatus: error.status }
        }
    }

    // Публичные методы
    async get(url, options = {}) {
        return this.#request(url, { ...options, method: 'GET' })
    }

    async post(url, body, options = {}) {
        return this.#request(url, { ...options, method: 'POST', body })
    }

    async put(url, body, options = {}) {
        return this.#request(url, { ...options, method: 'PUT', body })
    }

    async delete(url, options = {}) {
        return this.#request(url, { ...options, method: 'DELETE' })
    }

    // Специальные методы для аутентификации
    async publicPost(url, body, options = {}) {
        return this.#request(url, { ...options, method: 'POST', body, requiresAuth: false })
    }

    async publicGet(url, options = {}) {
        return this.#request(url, { ...options, method: 'GET', requiresAuth: false })
    }
}

// Создаем и экспортируем один экземпляр (синглтон)
export const apiClient = new ApiClient()