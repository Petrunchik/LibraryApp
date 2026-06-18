import { toast } from "../hooks/useToast"

class ApiClient {
    constructor() {
        this.baseURL = import.meta.env.API_BASE_URL || 'http://localhost:8000'
        this.maxRetries = 1
        this.refreshTokenPromise = null
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

        if (requiresAuth && !localStorage.getItem('access_token')) {
            return {
                success: false,
                error: "Требуется авторизация",
                status: 401,
                errorStatus: 401
            }
        }

        const fetchOptions = {
            method,
            headers: this.#getHeaders(requiresAuth, headers),
            credentials: 'include',
        }

        if (body) {
            fetchOptions.body = body instanceof URLSearchParams ? body : JSON.stringify(body)
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
                if (response.status === 401 && retryCount < this.maxRetries && requiresAuth && url !== '/users/refresh-token') {
                    console.log("Сессия истекла, пробуем обновить токен...")
                    const refreshResult = await this.updateAccessToken()
                    
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
                } else if (response.status === 500) {
                    toast.error("Сервер недоступен, повторите попытку позже!")
                } else if (response.status === 429) {
                    toast.error("Слишком много попыток, попробуйте позже!")
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

    async patch(url, body, options = {}) {
        return this.#request(url, { ...options, method: 'PATCH', body })
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

    async loginUser(userData) {
        const formData = new URLSearchParams()
        formData.append('username', userData.phone)
        formData.append('password', userData.password)

        const result = await this.publicPost('/users/token', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })

        if (result.success && result.data?.access_token) {
            localStorage.setItem('access_token', result.data.access_token)
            toast.info("Вы успешно вошли в аккаунт!")
        }

        return result
    }

    async registerUser(userData) {
        const requestBody = {
            role: userData.role || "reader",
            first_name: userData.name,
            last_name: userData.lastName,
            phone_number: userData.phone,
            password: userData.password
        }

        const result = await this.publicPost('/users', requestBody)

        if (result.success && result.data?.access_token) {
            localStorage.setItem('access_token', result.data.access_token)
            toast.info("Вы успешно зарегистрировались!")
        }

        return result
    }

    async logoutUser() {
        const result = await this.get('/users/signout')
        if (result.success) {
            localStorage.removeItem('access_token')
            toast.info("Вы успешно вышли из аккаунта!")
        }
        return result
    }

    async updateAccessToken() {
        if (this.refreshTokenPromise) {
            return this.refreshTokenPromise
        }

        this.refreshTokenPromise = this.publicGet('/users/refresh-token')
            .then((result) => {
                if (!result.success) {
                    if (result.status === 401){
                        // Refresh token в cookies истек или невалиден
                        localStorage.removeItem('access_token')
                        // Можно перенаправить на логин
                        // window.location.href = '/login'
                    }
                    return result
                }
                if (result.data?.access_token) {
                    localStorage.setItem('access_token', result.data.access_token);
                }
                return result
            })
            .finally(() => {
                this.refreshTokenPromise = null
            })

        return this.refreshTokenPromise
    }

    hasAccessToken() {
        return Boolean(localStorage.getItem('access_token'))
    }
}

// Создаем и экспортируем один экземпляр (синглтон)
export const apiClient = new ApiClient()
