export const navigateTo = (path) => {
        // Меняем URL без перезагрузки
        window.history.pushState({}, "", path);
        
        // Вызываем событие popstate вручную, чтобы обновить маршрутизацию
        window.dispatchEvent(new PopStateEvent("popstate"));
    }