// Feed service for API calls and data management
const API_BASE_URL = (() => {
    // Try Vite environment variable first
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
        return import.meta.env.VITE_API_URL
    }
    // Default fallback
    return 'http://localhost:5000/api'
})()

// Helper function to validate ObjectId format
const isValidObjectId = (id) => {
    return id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)
}

// Helper function to generate MongoDB ObjectId-like strings
const generateObjectId = () => {
    const timestamp = Math.floor(Date.now() / 1000).toString(16)
    const random = Math.random().toString(16).substring(2, 8)
    const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0')
    return timestamp + random + counter
}

export const feedService = {
    // Get feed posts with advanced algorithms
    async getFeedPosts(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters)
            const response = await fetch(`${API_BASE_URL}/feed?${queryParams}`, {
                credentials: 'include'
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()
            
            // Validate response structure
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid response format from server')
            }
            
            // Ensure posts array exists
            if (!Array.isArray(data.posts)) {
                console.warn('Posts array missing from response, using empty array')
                data.posts = []
            }
            
            // Ensure pagination exists
            if (!data.pagination || typeof data.pagination !== 'object') {
                console.warn('Pagination missing from response, using default')
                data.pagination = {
                    currentPage: 1,
                    totalPages: 1,
                    hasMore: false
                }
            }
            
            return data
        } catch (error) {
            console.error('Error fetching feed posts:', error)
            
            // Return mock data for development if API fails
            return {
                posts: [
                    {
                        _id: generateObjectId(),
                        content: 'Welcome to DevTinder! This is a sample post.',
                        user: {
                            _id: generateObjectId(),
                            fullName: 'DevTinder Team',
                            avatar: 'https://i.pravatar.cc/150?img=1',
                            username: 'devtinder'
                        },
                        createdAt: new Date().toISOString(),
                        likes: [],
                        likeCount: 0,
                        commentCount: 0,
                        shareCount: 0,
                        tags: ['welcome', 'sample'],
                        priority: 'normal',
                        engagementRate: '0.00'
                    }
                ],
                algorithm: filters.algorithm || 'smart',
                pagination: {
                    currentPage: parseInt(filters.page) || 1,
                    totalPosts: 1,
                    hasMore: false
                }
            }
        }
    },

    // Get smart feed (priority-based algorithm)
    async getSmartFeed(page = 1, limit = 20) {
        return this.getFeedPosts({ algorithm: 'smart', page, limit })
    },

    // Get following-only feed
    async getFollowingFeed(page = 1, limit = 20) {
        return this.getFeedPosts({ algorithm: 'following', page, limit })
    },

    // Get trending feed
    async getTrendingFeed(page = 1, limit = 20) {
        return this.getFeedPosts({ algorithm: 'trending', page, limit })
    },

    // Get discovery feed (non-following content)
    async getDiscoveryFeed(page = 1, limit = 20) {
        return this.getFeedPosts({ algorithm: 'discovery', page, limit })
    },

    // Get personalized recommendations
    async getRecommendations(limit = 10) {
        try {
            const response = await fetch(`${API_BASE_URL}/feed/recommendations?limit=${limit}`, {
                credentials: 'include'
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error fetching recommendations:', error)
            throw error
        }
    },

    // Get trending posts
    async getTrendingPosts(limit = 10) {
        try {
            const response = await fetch(`${API_BASE_URL}/feed/trending?limit=${limit}`, {
                credentials: 'include'
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error fetching trending posts:', error)
            throw error
        }
    },

    // Get stories
    async getStories() {
        try {
            const response = await fetch(`${API_BASE_URL}/feed/stories`, {
                credentials: 'include'
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()
            
            // Validate response structure
            if (!Array.isArray(data)) {
                console.warn('Stories response is not an array, using empty array')
                return []
            }
            
            return data
        } catch (error) {
            console.error('Error fetching stories:', error)
            // Return mock data for development
            return [
                {
                    user: {
                        _id: generateObjectId(),
                        fullName: 'DevTinder Team',
                        avatar: 'https://i.pravatar.cc/150?img=1'
                    },
                    stories: [
                        {
                            _id: generateObjectId(),
                            content: 'Welcome to DevTinder Stories!',
                            mediaUrl: null,
                            createdAt: new Date().toISOString(),
                            isViewed: false
                        }
                    ]
                }
            ]
        }
    },

    // Create new post
    async createPost(postData) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(postData)
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error creating post:', error)
            throw error
        }
    },

    // Like/unlike post
    async toggleLike(postId) {
        try {
            if (!isValidObjectId(postId)) {
                console.warn('Invalid postId format for like:', postId)
                throw new Error('Invalid post ID format')
            }
            
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
                method: 'POST',
                credentials: 'include'
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error toggling like:', error)
            throw error
        }
    },

    // Toggle share
    async toggleShare(postId) {
        try {
            if (!isValidObjectId(postId)) {
                console.warn('Invalid postId format for share:', postId)
                throw new Error('Invalid post ID format')
            }
            
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/share`, {
                method: 'POST',
                credentials: 'include'
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error toggling share:', error)
            throw error
        }
    },

    // Mark post as viewed
    async markPostAsViewed(postId) {
        try {
            if (!isValidObjectId(postId)) {
                console.warn('Invalid postId format for mark as viewed:', postId)
                return // Don't throw error for this, just skip
            }
            
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/view`, {
                method: 'POST',
                credentials: 'include'
            })
            
            if (!response.ok) {
                console.warn('Failed to mark post as viewed:', response.status)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error marking post as viewed:', error)
            // Don't throw error for this operation
        }
    },

    // Get comments for a post with advanced filtering
    async getComments(postId, queryParams = '') {
        try {
            if (!isValidObjectId(postId)) {
                console.warn('Invalid postId format for comments:', postId)
                throw new Error('Invalid post ID format')
            }
            
            const response = await fetch(`${API_BASE_URL}/comments/post/${postId}?${queryParams}`, {
                credentials: 'include'
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()
            
            // Validate response structure
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid response format from server')
            }
            
            // Ensure comments array exists
            if (!Array.isArray(data.comments)) {
                console.warn('Comments array missing from response, using empty array')
                data.comments = []
            }
            
            return data
        } catch (error) {
            console.error('Error fetching comments:', error)
            // Return mock data for development
            return {
                comments: [
                    {
                        _id: generateObjectId(),
                        content: 'This is a sample comment!',
                        user: {
                            _id: generateObjectId(),
                            fullName: 'Sample User',
                            avatar: 'https://i.pravatar.cc/150?img=2'
                        },
                        createdAt: new Date().toISOString(),
                        userReaction: null,
                        reactionCounts: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0, care: 0, fire: 0, rocket: 0, eyes: 0 },
                        replyCount: 0,
                        isEdited: false,
                        isPinned: false,
                        media: [],
                        mentions: [],
                        hashtags: []
                    }
                ],
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalComments: 1,
                    hasMore: false
                },
                filters: {
                    sort: 'newest',
                    filter: 'all',
                    reaction: null,
                    user: null,
                    search: ''
                }
            }
        }
    },

    // Add comment
    async addComment(postId, commentData) {
        try {
            if (!isValidObjectId(postId)) {
                console.warn('Invalid postId format for adding comment:', postId)
                throw new Error('Invalid post ID format')
            }
            
            console.log('Adding comment with data:', {
                postId: postId,
                commentData: commentData,
                requestBody: {
                    ...commentData,
                    postId: postId
                }
            })
            
            const response = await fetch(`${API_BASE_URL}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...commentData,
                    postId: postId
                })
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.error('Comment creation failed:', errorData)
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            
            const result = await response.json()
            console.log('Comment created successfully:', result)
            return result
        } catch (error) {
            console.error('Error adding comment:', error)
            throw error
        }
    },

    // Toggle comment reaction (advanced)
    async toggleCommentReaction(commentId, reactionType = 'like') {
        try {
            if (!isValidObjectId(commentId)) {
                console.warn('Invalid commentId format for reaction:', commentId)
                throw new Error('Invalid comment ID format')
            }
            
            const response = await fetch(`${API_BASE_URL}/comments/${commentId}/reaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ reactionType })
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error toggling comment reaction:', error)
            throw error
        }
    },

    // Like/unlike comment (legacy)
    async toggleCommentLike(commentId) {
        return this.toggleCommentReaction(commentId, 'like')
    },

    // Update comment (advanced)
    async updateComment(commentId, updateData) {
        try {
            if (!isValidObjectId(commentId)) {
                console.warn('Invalid commentId format for update:', commentId)
                throw new Error('Invalid comment ID format')
            }
            
            const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(updateData)
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error updating comment:', error)
            throw error
        }
    },

    // Delete comment
    async deleteComment(commentId) {
        try {
            if (!isValidObjectId(commentId)) {
                console.warn('Invalid commentId format for delete:', commentId)
                throw new Error('Invalid comment ID format')
            }
            
            const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error deleting comment:', error)
            throw error
        }
    },

    // Create story
    async createStory(storyData) {
        try {
            const response = await fetch(`${API_BASE_URL}/stories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(storyData)
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error creating story:', error)
            throw error
        }
    },

    // Mark story as viewed
    async markStoryAsViewed(storyId) {
        try {
            const response = await fetch(`${API_BASE_URL}/stories/${storyId}/view`, {
                method: 'POST',
                credentials: 'include'
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error marking story as viewed:', error)
            throw error
        }
    },

    // Add bookmark
    async addBookmark(postId, collection = 'default', note = '') {
        try {
            // Validate postId format before making request
            if (!postId || typeof postId !== 'string' || postId.length !== 24) {
                console.warn('Invalid postId format for adding bookmark:', postId)
                throw new Error('Invalid post ID format')
            }
            
            const response = await fetch(`${API_BASE_URL}/bookmarks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ postId, collection, note })
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error adding bookmark:', error)
            throw error
        }
    },

    // Remove bookmark
    async removeBookmark(bookmarkId) {
        try {
            const response = await fetch(`${API_BASE_URL}/bookmarks/${bookmarkId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error removing bookmark:', error)
            throw error
        }
    },

    // Get bookmarks
    async getBookmarks(page = 1, limit = 20, collection = 'default') {
        try {
            const response = await fetch(`${API_BASE_URL}/bookmarks?page=${page}&limit=${limit}&collection=${collection}`, {
                credentials: 'include'
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error fetching bookmarks:', error)
            throw error
        }
    },

    // Get bookmark collections
    async getBookmarkCollections() {
        try {
            const response = await fetch(`${API_BASE_URL}/bookmarks/collections`, {
                credentials: 'include'
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error fetching bookmark collections:', error)
            throw error
        }
    },

    // Check if post is bookmarked
    async checkBookmark(postId) {
        try {
            // Validate postId format before making request
            if (!postId || typeof postId !== 'string' || postId.length !== 24) {
                console.warn('Invalid postId format for bookmark check:', postId)
                return {
                    isBookmarked: false,
                    bookmark: null
                }
            }
            
            const response = await fetch(`${API_BASE_URL}/bookmarks/check/${postId}`, {
                credentials: 'include'
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error checking bookmark:', error)
            // Return mock data for development
            return {
                isBookmarked: false,
                bookmark: null
            }
        }
    },

    // Share post (repost/quote)
    async sharePost(postId, shareData) {
        try {
            const response = await fetch(`${API_BASE_URL}/shares`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    postId,
                    ...shareData
                })
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error sharing post:', error)
            throw error
        }
    },

    // Follow/unfollow user
    async toggleFollow(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
                method: 'POST',
                credentials: 'include'
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error toggling follow:', error)
            throw error
        }
    },

    // Advanced comment methods
    async reportComment(commentId, reportData) {
        try {
            if (!isValidObjectId(commentId)) {
                throw new Error('Invalid comment ID format')
            }

            const response = await fetch(`${API_BASE_URL}/comments/${commentId}/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(reportData)
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error reporting comment:', error)
            throw error
        }
    },

    async pinComment(commentId) {
        try {
            if (!isValidObjectId(commentId)) {
                throw new Error('Invalid comment ID format')
            }

            const response = await fetch(`${API_BASE_URL}/comments/${commentId}/pin`, {
                method: 'POST',
                credentials: 'include'
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error pinning comment:', error)
            throw error
        }
    },

    async getCommentReplies(commentId, page = 1, limit = 20) {
        try {
            if (!isValidObjectId(commentId)) {
                throw new Error('Invalid comment ID format')
            }

            const response = await fetch(`${API_BASE_URL}/comments/${commentId}/replies?page=${page}&limit=${limit}`, {
                credentials: 'include'
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error fetching comment replies:', error)
            throw error
        }
    },

    async getCommentThread(threadId, page = 1, limit = 50) {
        try {
            const response = await fetch(`${API_BASE_URL}/comments/thread/${threadId}?page=${page}&limit=${limit}`, {
                credentials: 'include'
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error fetching comment thread:', error)
            throw error
        }
    },

    async searchComments(query, filters = {}) {
        try {
            const params = new URLSearchParams({ q: query, ...filters })
            const response = await fetch(`${API_BASE_URL}/comments/search?${params}`, {
                credentials: 'include'
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error searching comments:', error)
            throw error
        }
    },

    async getCommentStats(postId) {
        try {
            if (!isValidObjectId(postId)) {
                throw new Error('Invalid post ID format')
            }

            const response = await fetch(`${API_BASE_URL}/comments/post/${postId}/stats`, {
                credentials: 'include'
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error fetching comment stats:', error)
            throw error
        }
    }
}