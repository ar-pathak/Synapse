import React, { useState } from 'react'
import { feedService } from '../../services/feedService'

const CreatePost = ({ userinfo, onPostCreated }) => {
    const [postContent, setPostContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedLink, setSelectedLink] = useState('')
    const [showLinkInput, setShowLinkInput] = useState(false)
    const [toasts, setToasts] = useState([])

    const showToast = (message, type = 'info') => {
        const id = Date.now()
        const newToast = { id, message, type }
        setToasts(prev => [...prev, newToast])
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id))
        }, 3000)
    }

    const handleSubmit = async () => {
        if (!postContent.trim()) return
        
        setIsSubmitting(true)
        try {
            // Create post data for backend
            const postData = {
                content: postContent,
                tags: extractHashtags(postContent),
                imageUrl: selectedImage,
                linkUrl: selectedLink
            }

            // Call backend API
            const newPost = await feedService.createPost(postData)
            
            // Call the callback to add post to feed
            onPostCreated(newPost)
            
            // Reset form
            setPostContent('')
            setIsExpanded(false)
            setSelectedImage(null)
            setSelectedLink('')
            setShowLinkInput(false)
            
            // Show success message
            showToast('Post created successfully! 🎉', 'success')
            
        } catch (error) {
            console.error('Error creating post:', error)
            showToast('Failed to create post. Please try again.', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleImageUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showToast('Image size should be less than 5MB', 'error')
                return
            }
            
            const reader = new FileReader()
            reader.onload = (e) => {
                setSelectedImage(e.target.result)
                showToast('Image added successfully!', 'success')
            }
            reader.readAsDataURL(file)
        }
    }

    const handleLinkAdd = () => {
        if (selectedLink.trim()) {
            if (!isValidUrl(selectedLink)) {
                showToast('Please enter a valid URL', 'error')
                return
            }
            setShowLinkInput(false)
            showToast('Link added successfully!', 'success')
        }
    }

    const isValidUrl = (string) => {
        try {
            new URL(string)
            return true
        } catch (_) {
            return false
        }
    }

    const extractHashtags = (text) => {
        const hashtagRegex = /#[\w]+/g
        return text.match(hashtagRegex) || []
    }

    const handleFocus = () => {
        setIsExpanded(true)
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                    <img
                        src={userinfo?.avatar || "https://i.pravatar.cc/150"}
                        alt="Your avatar"
                        className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                        <textarea
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            onFocus={handleFocus}
                            placeholder="What's happening?"
                            className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none resize-none text-lg"
                            rows={isExpanded ? "4" : "2"}
                            maxLength={500}
                        />
                        
                        {/* Selected Image Preview */}
                        {selectedImage && (
                            <div className="relative mt-3">
                                <img 
                                    src={selectedImage} 
                                    alt="Selected" 
                                    className="w-full max-h-48 object-cover rounded-xl"
                                />
                                <button
                                    onClick={() => {
                                        setSelectedImage(null)
                                        showToast('Image removed', 'info')
                                    }}
                                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Selected Link Preview */}
                        {selectedLink && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5a2 2 0 112.828 2.828l-1.5 1.5a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l1.5-1.5a4 4 0 00-.707 5.707 1 1 0 01-1.414-1.414 6 6 0 018.485-8.485l3 3a6 6 0 01-8.485 8.485l-1.5-1.5a1 1 0 00-1.414 1.414l1.5 1.5a8 8 0 0011.314 0l3-3a8 8 0 00-11.314-11.314l-3 3a8 8 0 00.707 11.707 1 1 0 01-1.414 1.414A10 10 0 012.929 2.929l3-3z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm text-blue-600 dark:text-blue-400 truncate">{selectedLink}</span>
                                    <button
                                        onClick={() => {
                                            setSelectedLink('')
                                            showToast('Link removed', 'info')
                                        }}
                                        className="ml-auto text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {(isExpanded || postContent.length > 0) && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex gap-2">
                                    {/* Image Upload */}
                                    <label className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 hover:text-blue-500 cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </label>

                                    {/* Link Input */}
                                    <button 
                                        onClick={() => setShowLinkInput(!showLinkInput)}
                                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 hover:text-green-500"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5a2 2 0 112.828 2.828l-1.5 1.5a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l1.5-1.5a4 4 0 00-.707 5.707 1 1 0 01-1.414-1.414 6 6 0 018.485-8.485l3 3a6 6 0 01-8.485 8.485l-1.5-1.5a1 1 0 00-1.414 1.414l1.5 1.5a8 8 0 0011.314 0l3-3a8 8 0 00-11.314-11.314l-3 3a8 8 0 00.707 11.707 1 1 0 01-1.414 1.414A10 10 0 012.929 2.929l3-3z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {/* Poll Button */}
                                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 hover:text-purple-500">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Character Counter */}
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm ${
                                        postContent.length > 400 ? 'text-red-500' : 'text-gray-400'
                                    }`}>
                                        {postContent.length}/500
                                    </span>
                                    <button 
                                        onClick={handleSubmit}
                                        disabled={!postContent.trim() || isSubmitting || postContent.length > 500}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Posting...</span>
                                            </div>
                                        ) : (
                                            'Post'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Link Input Modal */}
                        {showLinkInput && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        placeholder="Enter URL..."
                                        value={selectedLink}
                                        onChange={(e) => setSelectedLink(e.target.value)}
                                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={handleLinkAdd}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => setShowLinkInput(false)}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Toast Notifications */}
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transform transition-all duration-300 max-w-sm ${
                        toast.type === 'success' ? 'bg-green-500 text-white' :
                        toast.type === 'error' ? 'bg-red-500 text-white' :
                        toast.type === 'warning' ? 'bg-yellow-500 text-black' :
                        'bg-blue-500 text-white'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <span className="font-medium">{toast.message}</span>
                        <button
                            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                            className="ml-auto text-white/80 hover:text-white"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </>
    )
}

export default CreatePost 