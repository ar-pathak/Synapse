import React, { useState, useEffect } from 'react'
import { FaPlay, FaPause, FaTimes, FaPlus } from 'react-icons/fa'
import { feedService } from '../../services/feedService'
import CreateStory from './CreateStory'

const StoriesCarousel = ({ userinfo }) => {
    const [stories, setStories] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedStory, setSelectedStory] = useState(null)
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [showCreateStory, setShowCreateStory] = useState(false)

    // Fetch stories from backend
    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await feedService.getStories()
                setStories(res)
            } catch (error) {
                console.error('Error fetching stories:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStories()
    }, [])

    const handleStoryClick = async (storyGroup) => {
        if (storyGroup.stories.length === 0) return
        
        setSelectedStory(storyGroup)
        setCurrentStoryIndex(0)
        setIsPlaying(true)
        
        // Mark first story as viewed
        try {
            await feedService.markStoryAsViewed(storyGroup.stories[0]._id)
        } catch (error) {
            console.error('Error marking story as viewed:', error)
        }
    }

    const handleNextStory = () => {
        if (!selectedStory) return
        
        if (currentStoryIndex < selectedStory.stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1)
            // Mark next story as viewed
            const nextStory = selectedStory.stories[currentStoryIndex + 1]
            feedService.markStoryAsViewed(nextStory._id)
        } else {
            // Move to next user's stories
            const currentUserIndex = stories.findIndex(s => s.user._id === selectedStory.user._id)
            if (currentUserIndex < stories.length - 1) {
                const nextUserStories = stories[currentUserIndex + 1]
                setSelectedStory(nextUserStories)
                setCurrentStoryIndex(0)
                if (nextUserStories.stories.length > 0) {
                    feedService.markStoryAsViewed(nextUserStories.stories[0]._id)
                }
            } else {
                // End of all stories
                setSelectedStory(null)
                setIsPlaying(false)
            }
        }
    }

    const handlePreviousStory = () => {
        if (!selectedStory) return
        
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1)
        } else {
            // Move to previous user's stories
            const currentUserIndex = stories.findIndex(s => s.user._id === selectedStory.user._id)
            if (currentUserIndex > 0) {
                const prevUserStories = stories[currentUserIndex - 1]
                setSelectedStory(prevUserStories)
                setCurrentStoryIndex(prevUserStories.stories.length - 1)
            }
        }
    }

    const closeStoryViewer = () => {
        setSelectedStory(null)
        setIsPlaying(false)
        setCurrentStoryIndex(0)
    }

    // Auto-advance stories
    useEffect(() => {
        if (!selectedStory || !isPlaying) return
        
        const timer = setTimeout(() => {
            handleNextStory()
        }, 5000) // 5 seconds per story
        
        return () => clearTimeout(timer)
    }, [selectedStory, currentStoryIndex, isPlaying])

    if (loading) {
        return (
            <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 overflow-x-auto">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                            <div className="mt-2 w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Stories Carousel */}
            <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 overflow-x-auto">
                    {/* Add Story Button - Always Visible */}
                    <div className="flex-shrink-0 text-center">
                        <button
                            onClick={() => setShowCreateStory(true)}
                            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <FaPlus className="text-white text-xl" />
                        </button>
                        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 font-medium">Add Story</p>
                    </div>
                    
                    {/* Story Circles */}
                    {stories.map((storyGroup) => (
                        <div key={storyGroup.user._id} className="flex-shrink-0 text-center">
                            <div 
                                className={`w-16 h-16 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 ${
                                    storyGroup.stories.some(s => s.views?.some(v => v.user === userinfo.id))
                                        ? 'ring-2 ring-gray-300 dark:ring-gray-600'
                                        : 'ring-2 ring-blue-500'
                                }`}
                                onClick={() => handleStoryClick(storyGroup)}
                            >
                                <img
                                    src={storyGroup.user.avatar}
                                    alt={storyGroup.user.fullName}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 truncate max-w-16 font-medium">
                                {storyGroup.user.fullName}
                            </p>
                        </div>
                    ))}
                    
                    {/* Empty state when no stories */}
                    {stories.length === 0 && (
                        <div className="flex-shrink-0 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <span className="text-gray-400 dark:text-gray-500 text-sm">No stories yet</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Be the first to share!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Story Viewer Modal */}
            {selectedStory && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <div className="relative w-full max-w-md h-full max-h-96 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                        {/* Story Header */}
                        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={selectedStory.user.avatar}
                                        alt={selectedStory.user.fullName}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div>
                                        <p className="text-white font-semibold text-sm">
                                            {selectedStory.user.fullName}
                                        </p>
                                        <p className="text-white/70 text-xs">
                                            {new Date(selectedStory.stories[currentStoryIndex]?.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeStoryViewer}
                                    className="text-white hover:text-gray-300 transition-colors"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Story Content */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            {selectedStory.stories[currentStoryIndex] && (
                                <div 
                                    className="w-full h-full flex items-center justify-center p-8"
                                    style={{
                                        backgroundColor: selectedStory.stories[currentStoryIndex].background || '#000000',
                                        color: selectedStory.stories[currentStoryIndex].textColor || '#ffffff'
                                    }}
                                >
                                    <div 
                                        className="text-center"
                                        style={{
                                            fontFamily: selectedStory.stories[currentStoryIndex].font || 'Arial',
                                            fontSize: `${selectedStory.stories[currentStoryIndex].fontSize || 16}px`
                                        }}
                                    >
                                        {selectedStory.stories[currentStoryIndex].content}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Story Navigation */}
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex gap-1 mb-4">
                                {selectedStory.stories.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`h-1 rounded-full transition-all duration-300 ${
                                            index <= currentStoryIndex
                                                ? 'bg-white'
                                                : 'bg-white/30'
                                        }`}
                                        style={{
                                            width: `${100 / selectedStory.stories.length}%`
                                        }}
                                    />
                                ))}
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={handlePreviousStory}
                                    className="text-white hover:text-gray-300 transition-colors"
                                >
                                    ← Previous
                                </button>
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="text-white hover:text-gray-300 transition-colors"
                                >
                                    {isPlaying ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={handleNextStory}
                                    className="text-white hover:text-gray-300 transition-colors"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Create Story Modal */}
            {showCreateStory && (
                <CreateStory
                    userinfo={userinfo}
                    onStoryCreated={() => {
                        // Refetch stories after creating a new one
                        const refetchStories = async () => {
                            try {
                                const res = await feedService.getStories()
                                setStories(res)
                            } catch (error) {
                                console.error('Error fetching stories:', error)
                            }
                        }
                        refetchStories()
                        setShowCreateStory(false)
                    }}
                    onClose={() => setShowCreateStory(false)}
                />
            )}
        </>
    )
}

export default StoriesCarousel 