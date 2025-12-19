import React from 'react'

const EmptyState = ({ 
    title = 'No data found', 
    description = 'There are no items to display at the moment.',
    icon,
    actionText,
    onAction,
    className = ''
}) => {
    return (
        <div className={`text-center py-12 ${className}`}>
            {icon && (
                <div className="mx-auto mb-4 text-white/40">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">{description}</p>
            {actionText && onAction && (
                <button
                    onClick={onAction}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    {actionText}
                </button>
            )}
        </div>
    )
}

export default EmptyState 