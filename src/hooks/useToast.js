import { useState, useCallback } from 'react'

export const useToast = () => {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now()
        const newToast = { id, message, type, duration }
        
        setToasts(prev => [...prev, newToast])
        
        // Auto remove toast after duration
        setTimeout(() => {
            removeToast(id)
        }, duration)
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const showSuccess = useCallback((message, duration) => {
        addToast(message, 'success', duration)
    }, [addToast])

    const showError = useCallback((message, duration) => {
        addToast(message, 'error', duration)
    }, [addToast])

    const showWarning = useCallback((message, duration) => {
        addToast(message, 'warning', duration)
    }, [addToast])

    const showInfo = useCallback((message, duration) => {
        addToast(message, 'info', duration)
    }, [addToast])

    return {
        toasts,
        addToast,
        removeToast,
        showSuccess,
        showError,
        showWarning,
        showInfo
    }
} 