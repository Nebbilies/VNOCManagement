// contexts/ToastContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast from "../Components/Toast.tsx";

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

    const showSuccess = (message: string) => {
        setToast({ message, type: 'success' });
    };

    const showError = (message: string) => {
        setToast({ message, type: 'error' });
    };

    const clearToast = () => {
        setToast(null);
    };

    return (
        <ToastContext.Provider value={{ showSuccess, showError }}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={clearToast}
                />
            )}
        </ToastContext.Provider>
    );
};
