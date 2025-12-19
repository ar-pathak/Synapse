import React, { useState, useEffect } from 'react'
import { FaHeart, FaRegHeart, FaComment, FaShare, FaBookmark, FaRegBookmark, FaEllipsisH, FaReply } from 'react-icons/fa'
import CommentSection from './CommentSection'
import { feedService } from '../../services/feedService'

const PostCard = ({ post, userinfo }) => {
    const [showComments, setShowComments] = useState(false)
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(post?.likes?.length || 0)
    const [bookmarked, setBookmarked] = useState(false)
    const [bookmarkId, setBookmarkId] = useState(null)
    const [shareCount, setShareCount] = useState(post?.shareCount || 0)
    const [viewed, setViewed] = useState(false)
    const [isLiking, setIsLiking] = useState(false)

    // Check if liked/bookmarked on mount
    useEffect(() => {
        // Safe check for likes array and update like count
        const likesArray = post?.likes || []
        setLikeCount(likesArray.length)
        
        // Check if current user has liked the post
        const currentUserId = userinfo?.id || userinfo?._id
        const hasLiked = likesArray.some(likeId => likeId?.toString() === currentUserId?.toString())
        setLiked(hasLiked)
        
        // Debug logging
        console.log('PostCard Debug:', {
            postId: post?._id,
            likesArray: likesArray,
            likeCount: likesArray.length,
            currentUserId: currentUserId,
            hasLiked: hasLiked,
            userinfo: userinfo
        })
        
        // Check bookmark status only if post._id is valid
        if (post?._id && typeof post._id === 'string' && post._id.length === 24) {
            feedService.checkBookmark(post._id).then(res => {
                setBookmarked(res?.isBookmarked || false)
                setBookmarkId(res?.bookmark?._id || null)
            }).catch(err => {
                console.warn('Failed to check bookmark status:', err)
            })
        }
        // Mark as viewed only if post._id is valid
        if (!viewed && post?._id && typeof post._id === 'string' && post._id.length === 24) {
            feedService.markPostAsViewed(post._id)
            setViewed(true)
        }
    }, [post?._id, userinfo?.id, post?.likes])

    // Like handler with optimistic updates
    const handleLike = async () => {
        if (isLiking) return // Prevent double clicks
        
        try {
            setIsLiking(true)
            
            if (!post?._id) {
                console.warn('Cannot like post: missing post ID')
                return
            }
            
            // Optimistic update
            const newLikedStatus = !liked
            const newLikeCount = newLikedStatus ? likeCount + 1 : likeCount - 1
            
            setLiked(newLikedStatus)
            setLikeCount(newLikeCount)
            
            console.log('Like handler called:', {
                postId: post._id,
                currentLiked: liked,
                newLikedStatus: newLikedStatus,
                newLikeCount: newLikeCount
            })
            
            const response = await feedService.toggleLike(post._id)
            
            console.log('Like response:', response)
            
            // Update with server response
            if (response && response.likes) {
                setLikeCount(response.likes.length)
                const currentUserId = userinfo?.id || userinfo?._id
                const serverLikedStatus = response.likes.some(likeId => likeId?.toString() === currentUserId?.toString())
                setLiked(serverLikedStatus)
                
                console.log('Updated like status from server:', {
                    newLikeCount: response.likes.length,
                    serverLikedStatus: serverLikedStatus
                })
            }
        } catch (error) {
            console.error('Like operation failed:', error)
            // Revert optimistic update on error
            setLiked(!liked)
            setLikeCount(liked ? likeCount + 1 : likeCount - 1)
        } finally {
            setIsLiking(false)
        }
    }

    // Bookmark handler
    const handleBookmark = async () => {
        try {
            // Validate post._id before making bookmark requests
            if (!post?._id || typeof post._id !== 'string' || post._id.length !== 24) {
                console.warn('Invalid post ID for bookmark operation:', post?._id)
                return
            }
            
            if (bookmarked && bookmarkId) {
                await feedService.removeBookmark(bookmarkId)
                setBookmarked(false)
                setBookmarkId(null)
            } else {
                const res = await feedService.addBookmark(post._id)
                setBookmarked(true)
                setBookmarkId(res?._id || null)
            }
        } catch (error) {
            console.error('Bookmark operation failed:', error)
        }
    }

    // Share handler
    const handleShare = async () => {
        try {
            if (!post?._id) {
                console.warn('Cannot share post: missing post ID')
                return
            }
            await feedService.toggleShare(post._id)
            setShareCount(c => c + 1)
        } catch (error) {
            console.error('Share operation failed:', error)
        }
    }

    // Comment toggle
    const handleCommentClick = () => {
        setShowComments(s => !s)
    }

    return (
        <article className="bg-white dark:bg-gray-900 rounded-2xl p-6 mb-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group">
            {/* Post Header */}
            <div className="flex items-start gap-3 mb-4">
                <img
                    src={post?.user?.avatar || 'https://i.pravatar.cc/150'}
                    alt={post?.user?.fullName || 'User'}
                    className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80 transition-opacity ring-2 ring-gray-200 dark:ring-gray-600"
                    onClick={() => post?.user?._id && (window.location.href = `/profile/${post.user._id}`)}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                            onClick={() => post?.user?._id && (window.location.href = `/profile/${post.user._id}`)}>
                            {post?.user?.fullName || 'Anonymous User'}
                        </h3>
                        {post?.user?.verified && (
                            <span className="text-blue-500 text-sm">✓</span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{post?.user?.title || 'Developer'}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        {post?.createdAt ? new Date(post.createdAt).toLocaleString() : 'Just now'}
                    </p>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100">
                    <FaEllipsisH className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            {/* Post Content */}
            <div className="mb-4">
                <p className="text-gray-900 dark:text-white text-base leading-relaxed">{post?.content || 'No content'}</p>
            </div>

            {/* Post Tags */}
            {post?.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                        <span
                            key={tag || index}
                            className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`flex items-center gap-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 ${
                            liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                        }`}
                    >
                        {liked ? (
                            <FaHeart className="w-5 h-5 animate-pulse" />
                        ) : (
                            <FaRegHeart className="w-5 h-5" />
                        )}
                        <span className="text-sm font-medium">{likeCount}</span>
                    </button>
                    <button
                        onClick={handleCommentClick}
                        className={`flex items-center gap-2 transition-all duration-200 hover:scale-105 ${
                            showComments 
                                ? 'text-blue-500' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-blue-500'
                        }`}
                    >
                        <FaComment className="w-5 h-5" />
                        <span className="text-sm font-medium">{post?.commentCount || 0}</span>
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-500 transition-all duration-200 hover:scale-105"
                    >
                        <FaShare className="w-5 h-5" />
                        <span className="text-sm font-medium">{shareCount}</span>
                    </button>
                    <button
                        onClick={handleBookmark}
                        className={`flex items-center gap-2 transition-all duration-200 hover:scale-105 ${
                            bookmarked ? 'text-yellow-500' : 'text-gray-500 dark:text-gray-400 hover:text-yellow-500'
                        }`}
                    >
                        {bookmarked ? <FaBookmark className="w-5 h-5" /> : <FaRegBookmark className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Comment Section */}
            {showComments && post?._id && (
                <div className="mt-4">
                    <CommentSection
                        postId={post._id}
                        userinfo={userinfo}
                        // Pass handlers for add/like/reply/delete comment as needed
                    />
                </div>
            )}
        </article>
    )
}

export default PostCard 