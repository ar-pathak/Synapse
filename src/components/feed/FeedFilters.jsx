import React from 'react'
import { FaBrain, FaUsers, FaFire, FaCompass, FaStar } from 'react-icons/fa'

const FeedFilters = ({ currentAlgorithm, onAlgorithmChange, isLoading }) => {
    const algorithms = [
        {
            id: 'smart',
            name: 'Smart Feed',
            description: 'AI-powered personalized content',
            icon: FaBrain,
            color: 'bg-gradient-to-r from-purple-500 to-pink-500'
        },
        {
            id: 'following',
            name: 'Following',
            description: 'Posts from people you follow',
            icon: FaUsers,
            color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
        },
        {
            id: 'trending',
            name: 'Trending',
            description: 'Most popular posts right now',
            icon: FaFire,
            color: 'bg-gradient-to-r from-orange-500 to-red-500'
        },
        {
            id: 'discovery',
            name: 'Discovery',
            description: 'Discover new content',
            icon: FaCompass,
            color: 'bg-gradient-to-r from-green-500 to-emerald-500'
        }
    ]

    return (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Feed
                        </h2>
                        
                        {/* Algorithm Selector */}
                        <div className="flex items-center space-x-2">
                            {algorithms.map((algorithm) => {
                                const Icon = algorithm.icon
                                const isActive = currentAlgorithm === algorithm.id
                                
                                return (
                                    <button
                                        key={algorithm.id}
                                        onClick={() => onAlgorithmChange(algorithm.id)}
                                        disabled={isLoading}
                                        className={`
                                            relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                            ${isActive 
                                                ? `${algorithm.color} text-white shadow-lg transform scale-105` 
                                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }
                                            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                        `}
                                        title={algorithm.description}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="hidden sm:inline">{algorithm.name}</span>
                                        
                                        {/* Active indicator */}
                                        {isActive && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-current"></div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Algorithm Info */}
                    <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <FaStar className="w-4 h-4" />
                        <span>
                            {algorithms.find(alg => alg.id === currentAlgorithm)?.description}
                        </span>
                    </div>
                </div>

                {/* Mobile Algorithm Selector */}
                <div className="md:hidden pb-4">
                    <div className="flex items-center justify-center space-x-2">
                        {algorithms.map((algorithm) => {
                            const Icon = algorithm.icon
                            const isActive = currentAlgorithm === algorithm.id
                            
                            return (
                                <button
                                    key={algorithm.id}
                                    onClick={() => onAlgorithmChange(algorithm.id)}
                                    disabled={isLoading}
                                    className={`
                                        flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs transition-all duration-200
                                        ${isActive 
                                            ? `${algorithm.color} text-white` 
                                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                        }
                                        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{algorithm.name}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedFilters 