import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaBookmark, FaRegBookmark, FaHeart, FaRegHeart, FaShare, FaComment, FaEllipsisH } from 'react-icons/fa'
import { feedService } from '../../services/feedService'
import PostCard from '../feed/PostCard'

const Bookmarks = () => {
    const userinfo = useSelector((state) => state.userinfo.userinfo) || {
        id: Date.now(),
        name: 'Anonymous User',
        avatar: 'https://i.pravatar.cc/150',
        title: 'Developer'
    }
    
    const [bookmarks, setBookmarks] = useState([])
    const [collections, setCollections] = useState([])
    const [selectedCollection, setSelectedCollection] = useState('default')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    // Fetch bookmark collections
    const fetchCollections = async () => {
        try {
            const res = await feedService.getBookmarkCollections()
            setCollections(res)
        } catch (error) {
            console.error('Error fetching collections:', error)
        }
    }

    // Fetch bookmarks
    const fetchBookmarks = async (reset = false) => {
        setLoading(true)
        try {
            const res = await feedService.getBookmarks(page, 10, selectedCollection)
            if (reset) {
                setBookmarks(res.bookmarks)
            } else {
                setBookmarks(prev => [...prev, ...res.bookmarks])
            }
            setHasMore(res.pagination.hasMore)
        } catch (error) {
            setError('Failed to load bookmarks')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCollections()
    }, [])

    useEffect(() => {
        setPage(1)
        fetchBookmarks(true)
    }, [selectedCollection])

    useEffect(() => {
        if (page > 1) {
            fetchBookmarks()
        }
    }, [page])

    // Remove bookmark
    const handleRemoveBookmark = async (bookmarkId) => {
        try {
            await feedService.removeBookmark(bookmarkId)
            setBookmarks(prev => prev.filter(b => b._id !== bookmarkId))
        } catch (error) {
            console.error('Error removing bookmark:', error)
        }
    }

    // Load more bookmarks
    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Saved Posts
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Your bookmarked posts and articles
                    </p>
                </div>

                {/* Collections Filter */}
                {collections.length > 0 && (
                    <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                            Collections
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {collections.map((collection) => (
                                <button
                                    key={collection._id}
                                    onClick={() => setSelectedCollection(collection._id)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                                        selectedCollection === collection._id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {collection._id} ({collection.count})
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bookmarks List */}
                <div className="space-y-4">
                    {loading && page === 1 ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading bookmarks...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500">{error}</p>
                            <button 
                                onClick={() => {
                                    setError(null)
                                    fetchBookmarks(true)
                                }}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : bookmarks.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <FaBookmark className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No bookmarks yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                {selectedCollection === 'default' 
                                    ? "Start saving posts you want to read later!"
                                    : `No bookmarks in "${selectedCollection}" collection`
                                }
                            </p>
                            {selectedCollection !== 'default' && (
                                <button
                                    onClick={() => setSelectedCollection('default')}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    View All Bookmarks
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {bookmarks.map((bookmark) => (
                                <div key={bookmark._id} className="relative">
                                    <PostCard 
                                        post={bookmark.post} 
                                        userinfo={userinfo}
                                    />
                                    {/* Remove Bookmark Button */}
                                    <button
                                        onClick={() => handleRemoveBookmark(bookmark._id)}
                                        className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        title="Remove bookmark"
                                    >
                                        <FaBookmark className="w-4 h-4 text-yellow-500" />
                                    </button>
                                    {/* Bookmark Note */}
                                    {bookmark.note && (
                                        <div className="absolute top-4 left-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-xs">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                Note: {bookmark.note}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Load More */}
                            {hasMore && (
                                <div className="text-center py-4">
                                    <button
                                        onClick={loadMore}
                                        disabled={loading}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loading ? 'Loading...' : 'Load More'}
                                    </button>
                                </div>
                            )}

                            {/* End of Bookmarks */}
                            {!hasMore && bookmarks.length > 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                                        You've reached the end of your bookmarks!
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Bookmarks 