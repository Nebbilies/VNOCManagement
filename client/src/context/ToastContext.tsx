// contexts/ToastContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast from "../Components/Utility/Toast.tsx";

interface ToastContextType {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
}

interface ToastState {
    message: string;
    type: 'success' | 'error';
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toast, setToast] = useState<ToastState | null>(null);
    const [key, setKey] = useState<number>(0);
    const showSuccess = (message: string) => {
        setToast(null)
        setTimeout(() => {
            setToast({ message, type: 'success' });
            setKey(prevKey => prevKey + 1);
        }, 10);
    };

    const showError = (message: string) => {
        setToast(null)
        setTimeout(() => {
            setToast({ message, type: 'error' });
            setKey(prevKey => prevKey + 1);
        }, 10);
    };

    const clearToast = () => {
        setToast(null);
    };

    return (
        <ToastContext.Provider value={{ showSuccess, showError }}>
            {children}
            {toast && (
                <Toast
                    key={key}
                    message={toast.message}
                    type={toast.type}
                    onClose={clearToast}
                />
            )}
        </ToastContext.Provider>
    );
};
