import { useState } from 'react'

const useFeedData = () => {
    const [activeFilter, setActiveFilter] = useState('all')
    const [sortBy, setSortBy] = useState('recent')
    const [showFollowedOnly, setShowFollowedOnly] = useState(false)
    const [followedUsers, setFollowedUsers] = useState(new Set())
    const [likedPosts, setLikedPosts] = useState(new Set())
    const [comments, setComments] = useState({})
    const [showCommentInput, setShowCommentInput] = useState(null)
    const [newComment, setNewComment] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    return {
        activeFilter, setActiveFilter,
        sortBy, setSortBy,
        showFollowedOnly, setShowFollowedOnly,
        followedUsers, setFollowedUsers,
        likedPosts, setLikedPosts,
        comments, setComments,
        showCommentInput, setShowCommentInput,
        newComment, setNewComment,
        isLoading, setIsLoading,
        error, setError,
        page, setPage,
        hasMore, setHasMore
    }
}

export default useFeedData 