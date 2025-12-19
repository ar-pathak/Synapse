import React from 'react'

const LoadingSpinner = ({ size = 'md', color = 'blue', text = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    }

    const colorClasses = {
        blue: 'border-blue-500',
        green: 'border-green-500',
        red: 'border-red-500',
        yellow: 'border-yellow-500',
        white: 'border-white'
    }

    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]} mx-auto`}></div>
            {text && (
                <p className="mt-2 text-white/60 text-sm">{text}</p>
            )}
        </div>
    )
}

export default LoadingSpinner 