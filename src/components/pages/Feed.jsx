import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { FaSpinner, FaPlus, FaFilter } from 'react-icons/fa'
import StoriesCarousel from '../feed/StoriesCarousel'
import CreatePost from '../feed/CreatePost'
import FeedFilters from '../feed/FeedFilters'
import PostCard from '../feed/PostCard'
import useFeedData from '../../hooks/useFeedData'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'
import { feedService } from '../../services/feedService'

const Feed = () => {
    const userinfo = useSelector((state) => state.userinfo.userinfo) || {
        id: '507f1f77bcf86cd799439017', // Use proper ObjectId format
        _id: '507f1f77bcf86cd799439017', // Also provide _id for consistency
        name: 'Anonymous User',
        fullName: 'Anonymous User',
        avatar: 'https://i.pravatar.cc/150',
        title: 'Developer'
    }
    const feedData = useFeedData()
    const [posts, setPosts] = useState([])
    const [currentAlgorithm, setCurrentAlgorithm] = useState('smart')
    const [showCreatePost, setShowCreatePost] = useState(false)

    // Fetch posts from backend with advanced algorithms
    const fetchPosts = useCallback(async (reset = false) => {
        feedData.setIsLoading(true)
        try {
            const filters = {
                page: feedData.page,
                limit: 10,
                algorithm: currentAlgorithm
            }
            const res = await feedService.getFeedPosts(filters)
            if (reset) {
                setPosts(res.posts)
            } else {
                setPosts(prev => [...prev, ...res.posts])
            }
            feedData.setHasMore(res.pagination.hasMore)
        } catch (err) {
            feedData.setError(err.message)
        } finally {
            feedData.setIsLoading(false)
        }
    }, [feedData.page, currentAlgorithm])

    // Initial fetch and on algorithm/page change
    useEffect(() => {
        fetchPosts(feedData.page === 1)
    }, [feedData.page, currentAlgorithm])

    // Infinite scroll
    const loadMorePosts = useCallback(() => {
        if (feedData.isLoading || !feedData.hasMore) return
        feedData.setPage(prev => prev + 1)
    }, [feedData.isLoading, feedData.hasMore, feedData.setPage])
    const lastElementRef = useInfiniteScroll(loadMorePosts, feedData.hasMore)

    // Algorithm change handler
    const handleAlgorithmChange = useCallback((algorithm) => {
        setCurrentAlgorithm(algorithm)
        feedData.setPage(1) // Reset to first page when changing algorithm
    }, [feedData.setPage])

    // Handlers for post actions
    const handleLike = useCallback(async (postId) => {
        try {
            await feedService.toggleLike(postId)
            // Update local state
            setPosts(prev => prev.map(post => 
                post._id === postId 
                    ? { ...post, likes: post.likes.includes(userinfo.id) 
                        ? post.likes.filter(id => id !== userinfo.id)
                        : [...post.likes, userinfo.id]
                    }
                    : post
            ))
        } catch (error) {
            console.error('Error liking post:', error)
        }
    }, [userinfo.id])

    const handleComment = useCallback(async (postId) => {
        try {
            const comments = await feedService.getComments(postId)
            // Handle comments display (could open a modal or expand comment section)
            console.log('Comments for post:', comments)
        } catch (error) {
            console.error('Error fetching comments:', error)
        }
    }, [])

    const handleShare = useCallback(async (postId) => {
        try {
            await feedService.toggleShare(postId)
            // Update local state
            setPosts(prev => prev.map(post => 
                post._id === postId 
                    ? { ...post, shares: post.shares.includes(userinfo.id) 
                        ? post.shares.filter(id => id !== userinfo.id)
                        : [...post.shares, userinfo.id]
                    }
                    : post
            ))
        } catch (error) {
            console.error('Error sharing post:', error)
        }
    }, [userinfo.id])

    const handleFollow = useCallback(async (userId) => {
        try {
            await feedService.toggleFollow(userId)
            // Handle follow state update
            console.log('Follow toggled for user:', userId)
        } catch (error) {
            console.error('Error following user:', error)
        }
    }, [])

    const handleBookmark = useCallback(async (postId) => {
        try {
            await feedService.addBookmark(postId)
            console.log('Post bookmarked:', postId)
        } catch (error) {
            console.error('Error bookmarking post:', error)
        }
    }, [])

    const handleSharePost = useCallback(async (postId, shareData) => {
        try {
            await feedService.sharePost(postId, shareData)
            console.log('Post shared:', postId)
        } catch (error) {
            console.error('Error sharing post:', error)
        }
    }, [])

    // Memoized filtered and sorted posts (now handled by backend)
    const filteredAndSortedPosts = useMemo(() => posts, [posts])

    // Handlers for post actions (to be implemented in PostCard)
    const handlePostCreated = useCallback((newPost) => {
        setPosts(prevPosts => [newPost, ...prevPosts])
        setShowCreatePost(false)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-6 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header with Create Post Button */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Feed</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Discover amazing content from developers</p>
                    </div>
                    <button
                        onClick={() => setShowCreatePost(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
                    >
                        <FaPlus className="w-4 h-4" />
                        Create Post
                    </button>
                </div>

                {/* Stories Carousel */}
                <StoriesCarousel userinfo={userinfo} />

                {/* Create Post Component */}
                {showCreatePost && (
                    <div className="mb-6">
                        <CreatePost 
                            userinfo={userinfo} 
                            onPostCreated={handlePostCreated}
                            onClose={() => setShowCreatePost(false)}
                        />
                    </div>
                )}

                {/* Advanced Feed Filters */}
                <div className="mb-6">
                <FeedFilters 
                    currentAlgorithm={currentAlgorithm}
                    onAlgorithmChange={handleAlgorithmChange}
                    isLoading={feedData.isLoading}
                />
                </div>

                {/* Posts Feed */}
                <div className="space-y-6">
                    {filteredAndSortedPosts.map((post, index) => (
                        <div
                            key={post._id}
                            ref={index === filteredAndSortedPosts.length - 1 ? lastElementRef : null}
                        >
                            <PostCard
                                post={post}
                                userinfo={userinfo}
                                onLike={handleLike}
                                onComment={handleComment}
                                onShare={handleShare}
                                onFollow={handleFollow}
                                onPostCreated={handlePostCreated}
                                onBookmark={handleBookmark}
                                onSharePost={handleSharePost}
                            />
                        </div>
                    ))}
                    
                    {feedData.isLoading && (
                        <div className="flex justify-center py-8">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <FaSpinner className="animate-spin w-5 h-5" />
                                <span>Loading more posts...</span>
                            </div>
                        </div>
                    )}
                    
                    {!feedData.isLoading && filteredAndSortedPosts.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <FaFilter className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No posts found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Try switching to a different algorithm or create your first post!
                            </p>
                            <button
                                onClick={() => setShowCreatePost(true)}
                                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                            >
                                Create Your First Post
                            </button>
                        </div>
                    )}

                    {!feedData.isLoading && !feedData.hasMore && filteredAndSortedPosts.length > 0 && (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🎉</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                You've reached the end! Check back later for more content.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Feed