import { useState, forwardRef, useImperativeHandle } from 'react';
import ToastNotification from './toastNotification';
import '../style/Toast.css'

function ToastContainer(props, ref) {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type) => {
        const newToast = {
            id: Date.now(),
            message,
            type
        };
        
        setToasts(prev => {
            const newToasts = [newToast, ...prev];
            if (newToasts.length > 2) {
                newToasts.pop();
            }
            return newToasts;
        });
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    useImperativeHandle(ref, () => ({
        addToast
    }));

    return (
        <div id="toastContainer">
            {toasts.map((toast) => (
                <ToastNotification
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

export default forwardRef(ToastContainer);