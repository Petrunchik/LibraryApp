import { useState, useEffect } from 'react';

function ToastNotification({ message, type = 'success', onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Анимация появления
        setTimeout(() => setIsVisible(true), 10);
        
        // Автоудаление через 3 секунды
        const timer = setTimeout(() => {
            handleClose();
        }, 3000);
        
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
    };

    const getIcon = () => {
        switch(type) {
            case 'success': return 'fas fa-check-circle';
            case 'warning': return 'fas fa-exclamation-triangle';
            case 'error': return 'fas fa-times-circle';
            default: return 'fas fa-info-circle';
        }
    };

    return (
        <div className={`toast ${isVisible ? 'show' : ''}`}>
            <div className="toast-content">
                <div className="toast-message">
                    <i className={`${getIcon()} toast-icon`}></i>
                    <span>{message}</span>
                </div>
                <button className="toast-close" onClick={handleClose}>
                    <i className="fas fa-times"></i>
                </button>
            </div>
        </div>
    );
}
export default ToastNotification