// hooks/useToast.js
let globalAddToast = null;

export const registerToast = (fn) => {
    globalAddToast = fn;
};

// Глобальная функция для вызова из любого места
export const toast = {
    show: (message, type = 'success') => {
        if (globalAddToast) {
            globalAddToast(message, type);
        } else {
            console.warn('ToastContainer еще не инициализирован');
        }
    },
    success: (message) => toast.show(message, 'success'),
    warning: (message) => toast.show(message, 'warning'),
    error: (message) => toast.show(message, 'error'),
    info: (message) => toast.show(message, 'info')
};