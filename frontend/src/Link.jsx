const Link = ({ to, children, className, title, onClick }) => {
    const handleClick = (e) => {
        e.preventDefault();
        
        // Меняем URL без перезагрузки
        window.history.pushState({}, "", to);
        
        // Вызываем событие popstate вручную, чтобы useRoute обновился
        window.dispatchEvent(new PopStateEvent("popstate"));
        
        // Пользовательский onClick, если передан
        onClick?.();
    };

    return (
        <a href={to} className={className} title={title} onClick={handleClick}>
            {children}
        </a>
    );
};

export default Link;